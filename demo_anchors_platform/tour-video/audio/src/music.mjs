// Original score for the Anchors 120 s platform tour. node src/music.mjs <out.wav>
// Bar grid, arrangement markers and the hook/end events are all derived from timeline.json (see timing.mjs).
import { SR, Stereo, addMono, addStereo, reverb, pingPong, SVF, mtof, writeWav, peakOf, rng } from './lib.mjs';
import * as V from './voices.mjs';
import * as T from './timing.mjs';

const OUT = process.argv[2] || 'build/music_raw.wav';
const DUR = T.DUR, TAIL = 2;
const rand = rng(20261004);

// ---------- harmony (written in D major; Measure + end card are transposed up a whole tone to E major) ----------
const CH = {
  I:    { root: 38, pad: [50, 57, 61, 64, 66], arp: [62, 66, 69, 73], mel: [74, 76, 78, 81] }, // Dmaj9
  vi:   { root: 35, pad: [47, 54, 57, 62, 64], arp: [59, 62, 66, 69], mel: [74, 76, 78, 83] }, // Bm7(11)
  IV:   { root: 31, pad: [55, 59, 62, 66, 69], arp: [59, 62, 66, 71], mel: [74, 78, 79, 83] }, // Gmaj9
  Vsus: { root: 33, pad: [57, 62, 64, 69, 71], arp: [62, 64, 69, 71], mel: [74, 76, 81, 83] }, // A sus4
  V:    { root: 33, pad: [57, 61, 64, 69, 71], arp: [61, 64, 69, 73], mel: [73, 76, 81, 85] }, // A(add9)
  I6:   { root: 42, pad: [54, 57, 62, 66, 69], arp: [62, 66, 69, 74], mel: [74, 78, 81, 86] }, // D/F#
  ii:   { root: 40, pad: [52, 59, 62, 66, 67], arp: [59, 62, 64, 67], mel: [74, 76, 79, 83] }, // Em7
};
const PROG = {
  launch: ['I', 'vi', 'IV', 'Vsus'],
  run: ['vi', 'IV', 'I6', 'V'],
  measure: ['I', 'vi', 'IV', 'V'],
  peak: ['I', 'V', 'vi', 'IV'],
  final: ['ii'],
};

// ---------- arrangement: markers at bars derived from chapters / reveals ----------
// e = target RMS (dBFS, mid) of the music bus in that section; 'inherit' keeps the previous section's gain (for builds).
const S = {
  L1: { drums: 1, bass: 'sub', pluck: 1, pad: 0.8, padCut: 1300, prog: 'launch', e: -20.5 },
  L2: { drums: 1.5, bass: 'sparse', pluck: 2, pad: 0.8, padCut: 1600, prog: 'launch', e: -19.5 },
  L3: { drums: 2, bass: 'groove', pluck: 2, pad: 0.75, padCut: 1800, mel: 1, prog: 'launch', e: -18 },
  L4: { drums: 2, bass: 'groove', pluck: 2, pad: 0.75, padCut: 2000, mel: 1, glass: 1, prog: 'launch', e: -17.5 },
  L5: { drums: 2, bass: 'groove', pluck: 3, pad: 0.8, padCut: 1800, prog: 'launch', e: -17 },
  Lpre: { drums: 'roll', bass: 'sub', pluck: 3, pad: 0.9, padCut: 2400, prog: 'pre', e: 'inherit' },
  L6: { drums: 3, bass: 'groove', pluck: 2, pad: 0.8, padCut: 2600, mel: 1, stabs: 1, crash: 1, prog: 'launch', e: -15.5 },
  R1: { drums: 3, bass: 'walk', pluck: 2, pad: 0.8, padCut: 2600, mel: 2, glass: 1, crash: 0.6, prog: 'run', e: -15.5 },
  R2: { drums: 1.5, bass: 'sparse', pluck: 3, pad: 0.8, padCut: 2000, prog: 'run', e: -16.5 },
  Rpre: { drums: 'roll', bass: 'sub', pluck: 3, pad: 0.9, padCut: 2600, prog: 'pre', e: 'inherit' },
  M1: { drums: 3, bass: 'groove', pluck: 3, pad: 0.8, padCut: 3000, mel: 1, stabs: 1, crash: 0.8, prog: 'measure', key: 2, e: -14.5 },
  Mpre: { drums: 'roll', bass: 'sub', pluck: 3, pad: 0.9, padCut: 3000, prog: 'pre', key: 2, e: 'inherit' },
  M2: { drums: 3, bass: 'drive', pluck: 3, pad: 0.85, padCut: 3400, mel: 2, glass: 2, stabs: 1, crash: 1, prog: 'peak', key: 2, e: -13.5 },
  M3: { drums: 2, bass: 'groove', pluck: 2, pad: 0.85, padCut: 3000, mel: 1, glass: 1, prog: 'final', key: 2, e: -14.5 },
  Mres: { drums: 'roll', bass: 'sub', pluck: 1, pad: 0.95, padCut: 3200, prog: 'pre', key: 2, e: 'inherit' },
};
const bars = T.bars;
const chapterBar = (n) => T.nearestBar(T.chapters.find((c) => c.n === n).tIn).i;
const actBar = (name) => T.nearestBar(T.actStart(name)).i;
const markers = [];
const mark = (bar, name) => markers.push({ bar, name });
mark(0, 'L1');
mark(chapterBar(2), 'L2');
mark(chapterBar(3), 'L3');
mark(chapterBar(5), 'L4');
mark(chapterBar(6), 'L5');
const actBarI = T.ACTIVATION_T != null ? T.nearestBar(T.ACTIVATION_T).i : chapterBar(6) + 3;
mark(actBarI - 1, 'Lpre');
mark(actBarI, 'L6');
const runBar = actBar('Run'), measBar = actBar('Measure'), aiBar = T.nearestBar(T.AI_START).i;
mark(runBar, 'R1');
mark(chapterBar(8), 'R2');
mark(measBar - 1, 'Rpre');
mark(measBar, 'M1');
mark(aiBar - 1, 'Mpre');
mark(aiBar, 'M2');
mark(bars.length - 2, 'M3');
mark(bars.length - 1, 'Mres');
// a later marker wins when two fall on the same bar; sections keep chronological order
const secOfBar = new Array(bars.length);
const sorted = markers.map((m, k) => ({ ...m, k })).sort((a, b) => a.bar - b.bar || a.k - b.k);
for (const m of sorted) for (let b = m.bar; b < bars.length; b++) secOfBar[b] = m.name;
const sections = []; // merged runs of bars
for (let b = 0; b < bars.length; b++) {
  const last = sections[sections.length - 1];
  if (last && last.name === secOfBar[b]) { last.b1 = b; last.t1 = bars[b].t1; }
  else sections.push({ name: secOfBar[b], b0: b, b1: b, t0: bars[b].t0, t1: bars[b].t1 });
}

// phrase counter: counts bars from the start of each contiguous run of the same progression (so the 4-bar cycle,
// melody motif and fills run on across chapter changes and restart only at drops / act changes)
const phraseIdx = [];
for (let b = 0; b < bars.length; b++) {
  const pg = S[secOfBar[b]].prog, prev = b ? S[secOfBar[b - 1]].prog : null;
  phraseIdx[b] = b && pg === prev && bars[b - 1].len === 4 ? phraseIdx[b - 1] + 1 : 0;
}
const barChord = bars.map((bar, b) => {
  const cfg = S[secOfBar[b]];
  if (cfg.prog === 'pre' || bar.len < 4) return 'V';
  const prog = PROG[cfg.prog];
  return prog[phraseIdx[b] % prog.length];
});
const keyOf = (b) => S[secOfBar[b]].key ?? 0;
const chordNotes = (b) => { const c = CH[barChord[b]], k = keyOf(b); return { root: c.root + k, pad: c.pad.map((n) => n + k), arp: c.arp.map((n) => n + k), mel: c.mel.map((n) => n + k) }; };

// ---------- stems ----------
const stems = Object.fromEntries(['drums', 'bass', 'pad', 'pluck', 'mallet', 'stab', 'fx'].map((k) => [k, new Stereo(DUR + TAIL)]));
const mono = (stem, buf, t, g, pan = 0) => addMono(stems[stem], buf, t, g, pan);
const kicks = [];
const kick = (t, v) => { kicks.push(t); mono('drums', V.kick(v, Math.round(t * 100)), t, 0.95); };

const MOTIF = [
  [[0, 2, 3], [3, 1, 1], [6, 2, 2], [8, 3, 3], [12, 1, 2], [14, 0, 2]],
  [[0, 3, 2], [2, 2, 2], [4, 1, 4], [10, 0, 2], [12, 1, 2], [14, 2, 2]],
  [[0, 2, 3], [3, 1, 1], [6, 2, 2], [8, 3, 2], [10, 2, 2], [12, 3, 4]],
  [[0, 1, 6], [6, 2, 2], [8, 0, 6], [14, 1, 2]],
];
const BASS = {
  sparse: [[0, 0, 6], [10, 7, 2], [12, 0, 4]],
  groove: [[0, 0, 3], [3, 0, 1], [6, 12, 2], [8, 0, 3], [11, 0, 1], [14, 7, 2]],
  walk: [[0, 0, 4], [4, 7, 2], [6, 12, 2], [8, 0, 3], [11, 0, 1], [12, 7, 2], [14, 12, 2]],
  drive: [0, 2, 4, 6, 8, 10, 12, 14].map((s) => [s, s % 4 === 2 ? 12 : 0, 2]),
};
const PLUCK8 = [0, 1, 2, 3, 2, 1, 2, 3];
const PLUCK16 = [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 2, 3, 1, 2];

for (let b = 0; b < bars.length; b++) {
  const bar = bars[b], cfg = S[secOfBar[b]], step = bar.beatDur / 4, nSteps = bar.len * 4;
  const ch = chordNotes(b);
  const secStart = sections.find((s) => b === s.b0);
  if (secStart && cfg.crash) mono('drums', V.crash(2.6, cfg.crash, 17 + b), bar.t0, 0.32, 0.15);
  const barInSec = phraseIdx[b];
  for (let p = 0; p < nSteps; p++) {
    const t = bar.t0 + p * step, hum = 0.9 + rand() * 0.2;
    const d = cfg.drums;
    // drums
    if (d === 1) { if (p === 0 || p === 8) kick(t, 0.7); if (p % 4 === 2) mono('drums', V.brush(0.55 * hum, p + b), t, 0.5, 0.25); }
    if (d === 1.5) {
      if (p === 0 || p === 8 || p === 10) kick(t, p === 10 ? 0.5 : 0.8);
      if (p % 8 === 4) mono('drums', V.clap(0.7, b * 16 + p), t, 0.45, 0.05);
      if (p % 2 === 0) mono('drums', V.hat((p % 4 === 2 ? 0.75 : 0.3) * hum, false, b * 16 + p), t, 0.45, p % 4 ? -0.3 : 0.3);
    }
    if (d === 2 || d === 3) {
      if (p % 4 === 0) kick(t, 0.95);
      if (d === 3 && p === 14 && barInSec % 2 === 1) kick(t, 0.45);
      if (p % 8 === 4) { mono('drums', V.clap(1, b * 16 + p), t, d === 3 ? 0.62 : 0.5, 0.05); if (d === 3) mono('drums', V.snare(0.7, b * 16 + p), t, 0.35, 0); }
      if (d === 2 && p % 2 === 0) mono('drums', V.hat((p % 4 === 2 ? 0.8 : 0.35) * hum, false, b * 16 + p), t, 0.5, p % 4 ? -0.3 : 0.3);
      if (d === 3) {
        if (p === 14 && barInSec % 2 === 1) mono('drums', V.hat(0.85, true, b), t, 0.5, 0.3);
        else mono('drums', V.hat((p % 4 === 2 ? 1 : p % 2 === 0 ? 0.5 : 0.3) * hum, false, b * 16 + p), t, 0.53, p % 2 ? -0.3 : 0.3);
      }
      // 1-bar snare pickup at the end of every 4th bar of a section (fills)
      if (barInSec % 4 === 3 && p >= 13 && bar.len === 4) mono('drums', V.snare(0.25 + (p - 13) * 0.15, b * 16 + p), t, 0.35, 0);
    }
    // bass
    const bassNote = (semi, durSteps, vel, saw = 0.45) => {
      const n = ch.root + semi, dd = durSteps * step * 0.95;
      mono('bass', V.subNote(mtof(n), dd, 0.9 * vel), t, 0.8);
      if (saw) mono('bass', V.bassSaw(mtof(n + 12), dd, 0.5 * vel, 900), t, saw);
    };
    if (cfg.bass === 'sub') { if (p === 0) bassNote(0, cfg.prog === 'pre' && bar.len > 1 ? nSteps - 4 : nSteps * 1.04, 0.85, 0); } // full bar (release overlaps the next note); pre-drop bars breathe on the last beat
    else if (BASS[cfg.bass]) { const h = BASS[cfg.bass].find((x) => x[0] === p); if (h) bassNote(h[1], Math.min(h[2], nSteps - p), cfg.bass === 'sparse' ? 0.85 : 0.95, cfg.bass === 'sparse' ? 0.3 : 0.45); }
    // pluck
    if (cfg.pluck === 1 && p % 2 === 0) mono('pluck', V.pluck(mtof(ch.arp[PLUCK8[(p / 2) % 8]]), 0.55), t, 0.55, p % 4 ? 0.25 : -0.25);
    if (cfg.pluck === 2 && p % 2 === 0) mono('pluck', V.pluck(mtof(ch.arp[PLUCK8[(p / 2) % 8]] + 12), p % 4 ? 0.55 : 0.75), t, 0.55, p % 4 ? 0.25 : -0.25);
    if (cfg.pluck === 3) mono('pluck', V.pluck(mtof(ch.arp[PLUCK16[p % 16]] + 12), p % 2 ? 0.45 : 0.75, 0.25), t, 0.5, p % 2 ? 0.3 : -0.3);
    // mallet melody (motif per bar)
    if (cfg.mel && bar.len === 4) {
      const motif = MOTIF[barInSec % 4];
      const h = motif.find((x) => x[0] === p);
      if (h) {
        const n = ch.mel[h[1]];
        mono('mallet', V.marimba(mtof(n), 0.9, Math.max(0.5, h[2] * step * 2.5)), t, 0.55, (p / 2) % 2 ? 0.3 : -0.3);
        if (cfg.mel === 2) mono('mallet', V.marimba(mtof(n + 12), 0.35, 0.5), t, 0.4, (p / 2) % 2 ? -0.4 : 0.4);
      }
    }
    if (cfg.glass && (cfg.glass === 2 ? p % 2 === 1 : p % 4 === 3)) {
      const n = ch.mel[[0, 2, 1, 3, 2, 3, 1, 2][(p >> 1) % 8]] + 12;
      mono('stab', V.bell(mtof(n), 1.0, 0.16, [[1, 1, 0.45], [2.02, 0.3, 0.25], [3.98, 0.12, 0.12]]), t, 0.5, p % 4 === 1 ? 0.45 : -0.45);
    }
    if (cfg.stabs && (p === 0 || p === 10)) mono('stab', V.stab(ch.arp.map((n) => mtof(n + 12)), p ? 0.55 : 0.8, 0.45), t, 0.42, 0);
  }
  if (cfg.drums === 'roll') {  // accelerating, crescendo snare roll into the next downbeat + low tom
    let tt = bar.t0, i = 0;
    while (tt < bar.t1 - 0.02) {
      const pr = (tt - bar.t0) / (bar.t1 - bar.t0);
      mono('drums', V.snare(0.2 + 0.6 * pr, 300 + b * 50 + i++), tt, 0.45, 0);
      tt += (bar.beatDur / 2) * 0.5 ** (pr * 2); // 8ths -> 32nds
    }
    if (bar.len >= 2) kick(bar.t0, 0.8);
  }
}

// ---------- pads (one voice-led chord per run of identical chord within a section) ----------
{
  const segs = [];
  for (let b = 0; b < bars.length; b++) {
    const name = barChord[b] + ':' + keyOf(b), sec = secOfBar[b], last = segs[segs.length - 1];
    if (last && last.name === name && last.sec === sec) last.t1 = bars[b].t1;
    else segs.push({ name, sec, b, t0: bars[b].t0, t1: bars[b].t1 });
  }
  segs.forEach((g, i) => {
    const cfg = S[g.sec], ch = chordNotes(g.b);
    const notes = ch.pad.map(mtof);
    mono('pad', V.pad(notes, g.t1 - g.t0 + 0.05, cfg.pad, cfg.padCut, 0.35, 0.5, 100 + i), g.t0, 0.42, 0);
  });
}

// ---------- hook (0 -> first chapter): five hits I-vi-IV-V-I, drone, lift ----------
{
  const hitChords = ['I', 'vi', 'IV', 'V', 'I'];
  T.hookHits.forEach((t, k) => {
    const c = CH[hitChords[k % hitChords.length]], last = k === T.hookHits.length - 1;
    mono('stab', V.stab(c.arp.map((n) => mtof(n + (last ? 12 : 0))), 1, 0.5), t, 0.75, 0);
    mono('stab', V.stab(c.arp.map((n) => mtof(n - 12)), 0.8, 0.6), t, 0.5, 0);
    mono('bass', V.subNote(mtof(c.root), 0.75, 1), t, 0.9);
    kick(t, 1);
    mono('mallet', V.marimba(mtof(c.mel[last ? 3 : 2]), 1, 1.2), t, 0.5, k % 2 ? 0.3 : -0.3);
  });
  // soft drone under the hook, filter opening, then the lift into chapter 1
  mono('pad', V.pad([38, 50, 57, 64].map(mtof), T.HOOK_END - 0.1, 0.6, 900, 1.2, 0.3, 7), 0, 0.42, 0);
  const lastHit = T.hookHits[T.hookHits.length - 1] ?? 0;
  const liftLen = Math.max(0.3, T.HOOK_END - lastHit - 0.15);
  mono('fx', V.noiseSweep(liftLen, 300, 8000, 0.8, 51, 2.4), T.HOOK_END - liftLen, 0.35, 0);
  let tt = lastHit + 0.5, i = 0;
  while (tt < T.HOOK_END - 0.03) { const pr = (tt - lastHit - 0.5) / (T.HOOK_END - lastHit - 0.5); mono('drums', V.snare(0.2 + 0.5 * pr, 900 + i++), tt, 0.4, 0); tt += 0.125 * (0.5) ** pr; }
}

// ---------- music-side builds: pre-drop sweeps and lift swells ----------
const SWEEPS = [];
for (const s of sections) if (S[s.name].prog === 'pre') SWEEPS.push([s.t0 - (s.t1 - s.t0), s.t1, 900, 9000]);
{ const l5 = sections.find((s) => s.name === 'L5'); if (l5) SWEEPS.push([l5.t0, l5.t1, 1000, 6000]); }
for (const s of sections) if (S[s.name].prog === 'pre') mono('fx', V.noiseSweep(Math.min(2.5, s.t1 - s.t0 + 1.2), 400, 9000, 0.7, 60 + s.b0, 2.2), s.t1 - Math.min(2.5, s.t1 - s.t0 + 1.2), 0.25, 0);

// ---------- end card: resolve on I (E major), ring out, silent by DUR ----------
const END = T.END_T;
{
  const k = 2, c = CH.I;
  const fin = [c.root + k, ...c.pad.map((n) => n + k), 76 + k]; // E2 + Emaj9 voicing + F#5 (add9) on top
  mono('stab', V.stab(c.arp.map((n) => mtof(n + k + 12)), 0.9, 0.6), END, 0.55, 0);
  mono('pad', V.pad(fin.map(mtof), 1.5, 1.0, 2400, 0.05, 2.6, 501).map((v, i) => v * (i < 1.4 * SR ? 1 : Math.exp(-(i / SR - 1.4) / 0.9))), END, 0.6, 0);
  mono('bass', V.subNote(mtof(c.root + k), 3.4, 0.9).map((v, i) => v * (i < 1.0 * SR ? 1 : Math.exp(-(i / SR - 1.0) / 0.7))), END, 0.9);
  kick(END, 1);
  [[c.mel[3] + k, 0, -0.25], [c.mel[2] + k, 0.12, 0.25], [c.mel[0] + k + 12, 0.24, 0]].forEach(([n, d, pan]) => mono('mallet', V.marimba(mtof(n), 0.8, 2.6), END + d, 0.45, pan));
  mono('drums', V.crash(3.2, 0.7, 99), END, 0.3, 0.1);
}

// ---------- processing: sweeps, kick sidechain, buses, reverb/delay ----------
for (const name of ['pad', 'pluck']) {
  for (const [a, b, f0, f1] of SWEEPS) {
    for (const chn of [stems[name].L, stems[name].R]) {
      const f = new SVF();
      for (let i = Math.max(0, Math.round(a * SR)); i < Math.round(b * SR); i++) { const pr = (i / SR - a) / (b - a); f.run(chn[i], f0 * (f1 / f0) ** pr, 0.9); chn[i] = f.lp; }
    }
  }
}
const duck = new Float32Array(stems.pad.n).fill(1);
for (const tk of kicks) {
  const i0 = Math.round(tk * SR);
  for (let i = i0; i < Math.min(duck.length, i0 + 0.4 * SR); i++) { const g = 1 - 0.5 * Math.exp(-((i - i0) / SR) / 0.1); if (g < duck[i]) duck[i] = g; }
}
for (const [name, amt] of [['pad', 1], ['bass', 0.7], ['pluck', 0.5], ['stab', 0.3]]) {
  const s = stems[name];
  for (let i = 0; i < s.n; i++) { const g = 1 - (1 - duck[i]) * amt; s.L[i] *= g; s.R[i] *= g; }
}
const N = DUR + TAIL;
const sum = new Stereo(N), send = new Stereo(N), dsend = new Stereo(N);
const busGain = { drums: 0.95, bass: 0.9, pad: 0.85, pluck: 0.75, mallet: 0.85, stab: 0.75, fx: 0.8 };
const revAmt = { drums: 0.05, bass: 0, pad: 0.45, pluck: 0.28, mallet: 0.4, stab: 0.4, fx: 0.3 };
for (const [name, s] of Object.entries(stems)) { addStereo(sum, s, 0, busGain[name]); addStereo(send, s, 0, revAmt[name]); }
addStereo(dsend, stems.mallet, 0, 0.3); addStereo(dsend, stems.pluck, 0, 0.2);
addStereo(sum, reverb(send, { decay: 0.85, damp: 0.4, pre: 0.015, size: 1.4 }), 0, 0.7);
addStereo(sum, pingPong(dsend, 0.75 * T.spans[0].beat, 0.35, 3200), 0, 0.6);

// ---------- section auto-levelling to the energy map ----------
const midRms = (a, b) => { let s = 0, c = 0; for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { const m = (sum.L[i] + sum.R[i]) * 0.5; s += m * m; c++; } return Math.sqrt(s / Math.max(1, c)) || 1e-6; };
const levelSecs = [{ name: 'hook', t0: 0, t1: T.HOOK_END, e: -15.5 }, ...sections.map((s) => ({ ...s, e: S[s.name].e })), { name: 'end', t0: END, t1: DUR, e: 'inherit' }];
let prevG = 1;
for (const s of levelSecs) {
  if (s.e === 'inherit') { s.g = prevG; continue; }
  s.g = 10 ** (s.e / 20) / midRms(s.t0 + 0.05, s.t1 - 0.05);
  prevG = s.g;
}
const XF = 0.12; // gain crossfade ending on each section start (so the downbeat already sits at the new level)
const gainAt = (t) => {
  for (let k = 0; k < levelSecs.length; k++) {
    const s = levelSecs[k], nxt = levelSecs[k + 1];
    if (!nxt || t < s.t1) {
      if (nxt && t > s.t1 - XF) { const pr = (t - (s.t1 - XF)) / XF; return Math.exp(Math.log(s.g) * (1 - pr) + Math.log(nxt.g) * pr); }
      return s.g;
    }
  }
  return levelSecs[levelSecs.length - 1].g;
};

const nOut = Math.round(DUR * SR);
const out = new Stereo(DUR);
let hpL = 0, hpR = 0;
const hpk = Math.exp((-2 * Math.PI * 25) / SR);
// final fade: natural ring-out after the end card, eased to digital silence 0.08 s before DUR
const FADE_A = END + 2.0, FADE_B = DUR - 0.08;
for (let i = 0; i < nOut; i++) {
  const t = i / SR;
  let g = gainAt(t);
  if (t < 0.003) g *= t / 0.003;
  if (t > FADE_A) g *= t >= FADE_B ? 0 : 0.5 * (1 + Math.cos(Math.PI * (t - FADE_A) / (FADE_B - FADE_A)));
  let l = sum.L[i] * g, r = sum.R[i] * g;
  hpL = hpk * hpL + (1 - hpk) * l; hpR = hpk * hpR + (1 - hpk) * r;
  l -= hpL; r -= hpR;
  if (t >= FADE_B) { l = 0; r = 0; }
  out.L[i] = Math.tanh(l * 1.2) / 1.2;
  out.R[i] = Math.tanh(r * 1.2) / 1.2;
}
const pk = peakOf(out.L, out.R);
for (let i = 0; i < nOut; i++) { out.L[i] *= 0.85 / pk; out.R[i] *= 0.85 / pk; }
writeWav(OUT, out.L, out.R, 24);
const plan = { spans: T.spans.map((s) => ({ t0: s.t0, t1: s.t1, beats: s.beats, bpm: +s.bpm.toFixed(3) })), sections: sections.map((s) => ({ name: s.name, t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3), bars: s.b1 - s.b0 + 1, chords: barChord.slice(s.b0, s.b1 + 1).join(' '), key: keyOf(s.b0) ? 'E' : 'D', e: S[s.name].e })) };
import('node:fs').then((fs) => fs.writeFileSync(OUT.replace(/\.wav$/, '.plan.json'), JSON.stringify(plan, null, 1)));
console.log('music rendered', OUT, 'peak', pk.toFixed(3), 'kicks', kicks.length, 'sections', sections.map((s) => `${s.name}@${s.t0.toFixed(2)}`).join(' '));
