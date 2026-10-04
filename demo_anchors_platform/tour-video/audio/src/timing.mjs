// Everything time-related is derived here from project/src/timeline.json at build time.
// No shot time is hard-coded: the tempo map, the arrangement markers and every SFX cue come from the timeline,
// so a re-cut (e.g. the s31-s33 revision) only needs `bash build.sh`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const TIMELINE = process.env.TIMELINE || path.resolve(HERE, '../../project/src/timeline.json');
export const TL = JSON.parse(fs.readFileSync(TIMELINE, 'utf8'));
export const DUR = TL.durationSec;            // 120.000
export const FPS = TL.fps;

// Act map from the script (chapter numbers -> act). Times always come from the chapters in timeline.json.
export const ACTS = [
  { name: 'Launch', chapters: [1, 2, 3, 4, 5, 6] },
  { name: 'Run', chapters: [7, 8] },
  { name: 'Measure', chapters: [9, 10] },
];
const chap = (n) => TL.chapters.find((c) => c.n === n);
export const chapters = TL.chapters;
export const shots = TL.shots;
export const END_T = TL.endCard.tIn;          // end card start (115.5)
export const HOOK_END = Math.min(...TL.chapters.map((c) => c.tIn)); // first chapter start (5.0)
export const actStart = (name) => chap(ACTS.find((a) => a.name === name).chapters[0]).tIn;
const findChapter = (re) => TL.chapters.find((c) => re.test(c.title));
export const AI_START = (findChapter(/AI analysis/i) ?? chap(10)).tIn;

// ---------- tempo map ----------
// Anchors that must land on a downbeat: act starts, the AI-analysis chapter (peak) and the end card.
// For each span choose an integer beat count whose tempo is close to TARGET_BPM, preferring whole 4/4 bars;
// a leftover 1-3 beats becomes a short pickup bar at the end of the span (used as a fill into the next downbeat).
export const TARGET_BPM = 118;
export const anchors = [...new Set([HOOK_END, actStart('Run'), actStart('Measure'), AI_START, END_T].map((x) => +x.toFixed(4)))].sort((a, b) => a - b);

function solveSpan(d, prevBpm) {
  let best = null;
  for (let n = Math.max(1, Math.floor((d * 100) / 60)); n <= Math.ceil((d * 135) / 60); n++) {
    const bpm = (60 * n) / d;
    const meter = n % 4 === 0 ? 0 : n % 2 === 0 ? 1.5 : 2.5;
    const cost = (Math.abs(bpm - TARGET_BPM) / TARGET_BPM) * 100 + meter + (prevBpm ? (Math.abs(bpm - prevBpm) / prevBpm) * 50 : 0);
    if (!best || cost < best.cost) best = { n, bpm, cost };
  }
  return best;
}

export const bars = [];   // { i, t0, t1, beats: [t...], beatDur, len (beats), span }
export const spans = [];
{
  let prev = null;
  for (let k = 0; k < anchors.length - 1; k++) {
    const a = anchors[k], b = anchors[k + 1], d = b - a;
    const { n, bpm } = solveSpan(d, prev);
    prev = bpm;
    const beat = d / n;
    spans.push({ t0: a, t1: b, beats: n, bpm, beat });
    let used = 0;
    while (used < n) {
      const len = Math.min(4, n - used);
      const t0 = a + used * beat;
      bars.push({ i: bars.length, t0, t1: t0 + len * beat, len, beatDur: beat, span: k, beats: Array.from({ length: len }, (_, j) => t0 + j * beat) });
      used += len;
    }
  }
}
export const barAt = (t) => bars.find((b) => t >= b.t0 - 1e-6 && t < b.t1 - 1e-6);
export const nearestBar = (t) => bars.reduce((best, b) => (Math.abs(b.t0 - t) < Math.abs(best.t0 - t) ? b : best), bars[0]);

// ---------- events ----------
const hasCallout = (s) => typeof s.callout === 'string' && s.callout.trim() && s.callout !== 'None';
export const hookShots = shots.filter((s) => s.tIn < HOOK_END - 1e-6);
export const hookHits = hookShots.map((s) => s.tIn);                       // 0,1,2,3,4
export const activationShot = shots.find((s) => /campaign activated/i.test(s.callout ?? ''));
export const approvedShot = shots.find((s) => /draft approved/i.test(s.callout ?? '')) ?? shots.find((s) => /approve with one click/i.test(s.callout ?? ''));
export const matchedShot = shots.find((s) => s.tIn >= HOOK_END && /creators matched/i.test(s.callout ?? ''));
export const ACTIVATION_T = activationShot?.tIn;

// Cue list (SFX). Each cue: { t (moment heard: whoosh peak / riser arrival / transient), type, reason, ...params }
export function sfxCues() {
  const cues = [];
  const add = (c) => cues.push({ ...c, t: +c.t.toFixed(4) });
  // 1. hook: five hard hits on the hook cuts
  hookHits.forEach((t, k) => add({ t, type: 'hit', k, last: k === hookHits.length - 1, reason: `hook hit ${k + 1}/${hookHits.length} (${hookShots[k].id} "${hookShots[k].callout}")` }));
  // lift into chapter 1
  const lastHit = hookHits[hookHits.length - 1] ?? 0;
  add({ t: HOOK_END, type: 'riser', len: Math.min(0.85, HOOK_END - lastHit - 0.1), soft: true, reason: `lift into chapter 1 "${chap(1).title}"` });
  // 2. whooshes on whoosh/zoom transitions (peak on the cut); fade transitions with a whoosh tag get a soft swell
  shots.forEach((s, i) => {
    if (i === 0) return;
    if (s.transition === 'whoosh' || s.transition === 'zoom')
      add({ t: s.tIn, type: s.transition === 'zoom' ? 'zoom' : 'whoosh', inHook: s.tIn < HOOK_END, idx: i, reason: `${s.transition} transition into ${s.id}` });
    else if (s.transition === 'fade' && (s.sfx ?? []).includes('whoosh'))
      add({ t: s.tIn, type: 'swell', reason: `fade transition into ${s.id} (act start)` });
  });
  // 3. risers into big reveals (and wherever the timeline tags a riser), arriving on the reveal
  const reveals = [];
  if (matchedShot) reveals.push([matchedShot.tIn, `riser into reveal "${matchedShot.callout}" (${matchedShot.id})`, 1.6]);
  if (activationShot) reveals.push([activationShot.tIn, `riser into "${activationShot.callout}" (${activationShot.id})`, 2.0]);
  reveals.push([AI_START, `riser into chapter "${findChapter(/AI analysis/i)?.title ?? 'AI analysis'}"`, 1.6]);
  shots.forEach((s, i) => {
    if (s.tIn < HOOK_END || !(s.sfx ?? []).includes('riser')) return;
    const nxt = shots[i + 1];
    if (nxt) reveals.push([nxt.tIn, `timeline riser under ${s.id} "${s.callout ?? ''}" into ${nxt.id}`, Math.max(0.5, nxt.tIn - s.tIn)]);
  });
  for (const [t, reason, len] of reveals) if (!cues.some((c) => c.type === 'riser' && Math.abs(c.t - t) < 0.3)) add({ t, type: 'riser', len, reason });
  // 4. success chimes
  if (activationShot) add({ t: activationShot.tIn, type: 'success', big: true, reason: `"${activationShot.callout}" (${activationShot.id})` });
  if (activationShot) add({ t: activationShot.tIn, type: 'impact', gain: 0.75, reason: `impact under activation (${activationShot.id})` });
  if (approvedShot) add({ t: approvedShot.tIn, type: 'success', big: false, reason: `"${approvedShot.callout}" (${approvedShot.id})` });
  // reveal bells + impacts the timeline asks for (not in the hook, not too close to other big cues or the end card)
  shots.forEach((s) => {
    if (s.tIn < HOOK_END || s === activationShot || s === approvedShot) return;
    if ((s.sfx ?? []).includes('impact')) add({ t: s.tIn, type: 'impact', gain: 0.55, reason: `timeline impact on ${s.id} "${s.callout ?? ''}"` });
    if ((s.sfx ?? []).includes('chime') && END_T - s.tIn > 1.5) add({ t: s.tIn + 0.1, type: 'bell', reason: `reveal bell on ${s.id} "${s.callout ?? ''}"` });
  });
  // 5. callout pops at tIn + 0.15 (skipped in the hook and where a bigger cue already marks the moment)
  shots.forEach((s) => {
    if (s.tIn < HOOK_END || !hasCallout(s)) return;
    const t = s.tIn + 0.15;
    if (cues.some((c) => ['success', 'bell', 'impact'].includes(c.type) && Math.abs(c.t - t) < 0.35)) return;
    add({ t, type: 'pop', reason: `callout "${s.callout}" (${s.id})` });
  });
  // 6. clicks: at most one per shot (the first click inside the shot), subtle
  shots.forEach((s) => {
    if (s.tIn < HOOK_END) return;
    const c = (s.clicks ?? []).map((c) => s.tIn + c.t).filter((t) => t < s.tOut - 0.02)[0];
    if (c == null) return;
    if (cues.some((o) => (['success', 'impact', 'hit'].includes(o.type) && Math.abs(o.t - c) < 0.2) || (o.type === 'pop' && Math.abs(o.t - c) < 0.12))) return;
    add({ t: c, type: 'click', x: s.clicks[0].x, reason: `cursor click in ${s.id} (${(s.clicks ?? []).length} in shot, first kept)` });
  });
  // 7. end card sting
  add({ t: END_T, type: 'sting', reason: 'end card: Anchors logo + tagline' });
  return cues.sort((a, b) => a.t - b.t);
}

export function summary() {
  return { anchors, spans: spans.map((s) => ({ ...s, bpm: +s.bpm.toFixed(3) })), bars: bars.length, hookHits, ACTIVATION_T, AI_START, END_T };
}
if (process.argv[1] && process.argv[1].endsWith('timing.mjs')) {
  console.log(JSON.stringify(summary(), null, 1));
  for (const c of sfxCues()) console.log(c.t.toFixed(3).padStart(8), c.type.padEnd(8), c.reason);
}
