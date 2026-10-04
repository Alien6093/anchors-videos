// Part 1 music: tech-house / electro-pop pulse, 120 BPM, A minor with C-major lift at PAY. Renders layer buses + kick triggers.
// Usage: node music.mjs  -> build/music_layers.json (kick list) and build/music_<bus>.f32 (raw float buses, stereo interleaved not needed: L/R files)
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SR, SVF, sat } from './lib.mjs';
import * as V from './voices2.mjs';
import { TOTAL, beatToSample, STEP_SAMPLES, CHORDS, BAR_CHORDS, MOTIF } from './grid.mjs';

const LEN = TOTAL + 3 * SR;
const mk = () => ({ L: new Float32Array(LEN), R: new Float32Array(LEN) });
export const bus = { kick: mk(), perc: mk(), bass: mk(), harm: mk(), lead: mk() };
const kicks = [];
const cache = new Map();
const memo = (key, fn) => { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); };
const dB = (d) => 10 ** (d / 20);
function put(b, voice, at, gain = 1, pan = 0) {
  const s = Math.round(at);
  const stereo = !(voice instanceof Float32Array);
  const l = stereo ? voice.L : voice, r = stereo ? voice.R : voice;
  const a = ((pan + 1) * Math.PI) / 4, gl = Math.cos(a) * Math.SQRT2 * gain, gr = Math.sin(a) * Math.SQRT2 * gain;
  for (let i = 0; i < l.length && s + i < LEN; i++) { if (s + i < 0) continue; b.L[s + i] += l[i] * gl; b.R[s + i] += r[i] * gr; }
}
const stepAt = (s) => s * STEP_SAMPLES;           // 16th step index -> sample
const beatAt = (b) => beatToSample(b);
const inR = (b, a, z) => b >= a && b < z;
// level helpers (dB per section) -------------------------------------------------------------------------------------------
const kickK = memo('kick', () => V.kick());
const kickSoft = memo('kicks', () => V.kick({ tauA: 0.09 }));
const clapV = memo('clap', () => V.clap()), snapV = memo('snap', () => V.snap());
const hatC = memo('hc', () => V.hat({ seed: 5 })), hatC2 = memo('hc2', () => V.hat({ seed: 6 })), hatO = memo('ho', () => V.hat({ open: true, seed: 8 }));
const shk = memo('shk', () => V.shaker()), rimV = memo('rim', () => V.rim()), snr = memo('snr', () => V.snareHit());

function addKick(beat, vel = 1, soft = false) { const at = beatAt(beat); put(bus.kick, soft ? kickSoft : kickK, at, 0.9 * vel, 0); kicks.push({ beat, at, vel }); }

const bars = 24;
// hook sample offset: first transient lands at +1 ms (loop seam rule)
const HOOK_OFF = 48;
for (let s = 0; s < 96 * 4; s++) {
  const b = s / 4, bar = Math.floor(s / 16), st = s % 16, chord = CHORDS[BAR_CHORDS[bar]];
  const at = stepAt(s) + (s === 0 ? HOOK_OFF : 0);
  const onBeat = st % 4 === 0;
  const hook = b < 4, groove1 = inR(b, 4, 12), build = inR(b, 32, 44), drop = inR(b, 44, 52), briefs = inR(b, 52, 60), quote = inR(b, 60, 64), breath = inR(b, 84, 88), end = b >= 88;
  const fullGroove = inR(b, 64, 84);
  // ---- kick ----
  if (onBeat) {
    const beat = s / 4;
    let k = true, vel = 1, soft = false;
    if (inR(beat, 43, 44)) k = false;                 // kick out on the last beat before the drop
    if (quote) k = beat === 60 || beat === 62;       // halved
    if (breath) { k = beat === 84 || beat === 86; vel = 0.55; soft = true; }
    if (beat === 95) k = false;                       // pickup beat
    if (end && beat >= 90 && beat < 95) vel = beat === 91 || beat === 93 ? 0.8 : 0.85;
    if (k) addKick(beat, vel, soft);
  }
  if (st === 15 && bar % 4 === 3 && (inR(b, 8, 40) || drop || briefs || inR(b, 64, 84)) && b < 95) { put(bus.kick, kickSoft, at, 0.3, 0); kicks.push({ beat: s / 4, at, vel: 0.3 }); }
  // ---- clap + snap on 2 and 4 ----
  if ((st === 4 || st === 12) && !inR(b, 40, 44) && !quote && !breath && b !== 95 && !(b > 94)) {
    const g = end ? 0.45 : hook ? 0.7 : 0.6;
    put(bus.perc, clapV, at, g, 0.05); put(bus.perc, snapV, at, g * 0.55, -0.05);
  }
  if (s === 0) put(bus.perc, snapV, at, 0.9, 0);       // hook: kick + snap at f0
  // ---- hats ----
  const hatMode = quote || end ? 8 : breath ? 0 : groove1 ? 8 : 16;
  if (hatMode && !(b > 95)) {
    const offbeat = st % 4 === 2;
    const vel = offbeat ? 1.0 : st % 2 === 0 ? 0.55 : 0.33;
    const lvl = drop || fullGroove ? 1.15 : briefs ? 1.25 : end ? 0.7 : hook ? 1.1 : 1.0;
    if (hatMode === 16 || st % 2 === 0) {
      if (offbeat && !quote && !(end && b >= 94)) put(bus.perc, hatO, at, 0.30 * lvl, 0.12);      // offbeat open hat
      else put(bus.perc, st % 2 ? hatC2 : hatC, at, 0.22 * vel * lvl, st % 2 ? 0.2 : -0.15);
    }
  }
  if (!hook && st % 2 === 0 && inR(b, 12, 88) && !breath) put(bus.perc, shk, at, 0.14, st % 4 === 0 ? -0.35 : 0.35);
  if (st === 9 && inR(b, 20, 44)) put(bus.perc, rimV, at, 0.28, 0.25);
  if (b === 27) put(bus.perc, rimV, beatAt(27), 0.45, 0.0);       // rim hit on the b27 hard cut
  // ---- bass ----
  const bassSteps = quote ? [0, 8] : breath ? [0, 8] : end ? [0, 6, 10] : [0, 3, 6, 10, 13];
  const bassBeat = !(inR(b, 43, 44)) && b < 95 && b !== 63.75 && !(inR(b, 94, 96));
  if (bassSteps.includes(st) && bassBeat) {
    let m = chord.root; if (st === 6 && !quote && !breath) m += 12;
    const dur = quote || breath ? 0.9 : st === 0 ? 0.2 : 0.17;
    const cutoff = quote ? 420 : breath ? 350 : drop || fullGroove ? 1250 : 900;
    const key = `b${m}-${dur}-${cutoff}`;
    put(bus.bass, memo(key, () => V.bassPluck(V.mtof(m), dur, { cutoff })), at, 0.75, 0);
  }
  // ---- chord stabs on the offbeats ----
  const stabOn = (inR(b, 20, 44) && (st === 6 || st === 14)) || (drop && (st === 2 || st === 6 || st === 10 || st === 14)) || (fullGroove && (st === 6 || st === 14 || st === 3)) || (inR(b, 76, 84) && (st === 6 || st === 14));
  if (stabOn && !inR(b, 43, 44)) put(bus.harm, memo('st' + BAR_CHORDS[bar], () => V.stab(chord.stab.map((x) => x + 12))), at, st === 3 ? 0.14 : 0.3, st === 6 ? -0.25 : 0.25);
  // ---- arp (bright pluck) ----
  const arpTresillo = [0, 3, 6, 8, 11, 14], arp16 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], arp8 = [0, 2, 4, 6, 8, 10, 12, 14];
  let arpSteps = [];
  if (inR(b, 12, 28)) arpSteps = arpTresillo; else if (inR(b, 28, 43)) arpSteps = arp8; else if (drop || fullGroove) arpSteps = arp16.filter((x) => x % 2 === 0 || drop); else if (inR(b, 56, 60) || b >= 76 && b < 84) arpSteps = arp8;
  if (inR(b, 52, 56)) arpSteps = arp8;
  if (arpSteps.includes(st) && !inR(b, 43, 44)) {
    const idx = (bar * 3 + st) % 4, note = chord.arp[st % 8 === 0 ? 0 : (st >> 1) % 4 === 0 ? 2 : idx];
    const ramp = inR(b, 12, 28) ? -9 + 6 * ((b - 12) / 16) : drop ? -2 : -4;
    put(bus.lead, memo('ap' + note, () => V.arpPluck(note + 12, 0.16, 1)), at, dB(ramp) * 0.4, ((st * 37) % 7 - 3) / 7);
  }
  // ---- pad: one per bar ----
  if (st === 0 && b < 95 && !(b >= 92 && false)) {
    const cutoff = quote ? 1400 : breath ? 1200 : drop || fullGroove ? 5200 : 4200;
    const dur = quote && bar === 15 ? 2.0 : breath ? 2.0 : 2.0 + 0.15;
    const key = `pad${BAR_CHORDS[bar]}${cutoff}`;
    put(bus.harm, memo(key, () => V.pad(chord.pad, dur, { cutoff })), at, hook ? 0.9 : end ? 0.8 : drop || fullGroove ? 1.0 : 0.7, 0);
  }
}
// ---- snare roll b40 -> b43.875 (accelerating), ends in the pre-drop hole ----
{
  const hits = [];
  for (let b = 40; b < 42; b += 0.5) hits.push(b);
  for (let b = 42; b < 43.5; b += 0.25) hits.push(b);
  for (let b = 43.5; b < 43.875; b += 0.125) hits.push(b);
  hits.forEach((bb, i) => put(bus.perc, snr, beatAt(bb), 0.35 + 0.6 * (i / hits.length), (i % 2 ? 0.1 : -0.1)));
}
// ---- snare fill into the briefs cut (b51 -> b52, 16ths crescendo) ----
[51, 51.25, 51.5, 51.625, 51.75, 51.875].forEach((bb, i) => put(bus.perc, snr, beatAt(bb), 0.35 + 0.12 * i, i % 2 ? 0.15 : -0.15));
// ---- hat roll crescendo into the loop: b94 16ths (end-card last beat pickup) ----
for (let k = 0; k < 8; k++) put(bus.perc, hatC, beatAt(94.5 + k * 0.125), 0.1 + 0.22 * (k / 7), k % 2 ? 0.2 : -0.2);
// ---- ANCHOR motif placements (music stem) ----
const note = (name, beat, vel = 1, dur = 0.5, bellAmt = 0.35, g = 0.5, pan = 0, off = 0) => put(bus.lead, V.pluckNote(MOTIF[name], dur, vel, bellAmt), beatAt(beat) + off, g, pan);
function motifFull(landBeat, g = 0.5, dur5 = 1.0) { // A4 at land-2, C5 land-1.5, E5 land-1, D5 land-0.5, A5 at land
  [['A4', -2], ['C5', -1.5], ['E5', -1], ['D5', -0.5]].forEach(([n, o], i) => note(n, landBeat + o, 0.85, 0.35, 0.3, g, (i - 1.5) * 0.1));
  note('A5', landBeat, 1, dur5, 0.45, g);
}
// hook: hit form on the beats; A5 lands on b4
[['A4', 0], ['C5', 1], ['E5', 2], ['D5', 3]].forEach(([n, b], i) => note(n, b, 1, 0.5, 0.35, 0.65, 0, b === 0 ? HOOK_OFF : 0));
note('A5', 4, 1, 1.4, 0.5, 0.65);
const MOTIF_AT = [[12, 0.32], [20, 0.32], [32, 0.35]];
MOTIF_AT.forEach(([l, g]) => motifFull(l, g));
// drop: full-level motif b44-b46 (A4 at 44 -> A5 at 46)
motifFull(46, 0.62, 1.4);
motifFull(52, 0.4);
motifFull(76, 0.5);
// end card: motif under the CTA (A4 b92 ... A5 b94), -6 dB
motifFull(94, 0.3, 1.0);
// ---- b4-b7 chip notes live in the SFX stem; b20-b26 card taps (8ths, panned plucks) ----
{
  const scale = [69, 72, 74, 76, 79, 81, 79, 76, 74, 72, 76, 79];
  for (let i = 0; i < 12; i++) put(bus.lead, memo('card' + scale[i], () => V.pluckNote(scale[i], 0.14, 0.9, 0.1)), beatAt(20 + i * 0.5), 0.3, -0.7 + 1.4 * (i / 11));
}
// ---- b52-b54 name-pill arp (8 x 16th ascending), b54-b56.5 label ticks (6 x 8th) ----
{
  const run = [69, 72, 74, 76, 79, 81, 84, 86];
  run.forEach((m, i) => put(bus.lead, memo('pill' + m, () => V.pluckNote(m, 0.12, 0.9, 0.1)), beatAt(52 + i * 0.25) - (i === 0 ? 0 : 0), 0.34, -0.5 + i / 7));
  [69, 72, 76, 79, 81, 84].forEach((m, i) => put(bus.lead, memo('lab' + m, () => V.pluckNote(m, 0.2, 0.9, 0.15)), beatAt(54 + i * 0.5), 0.34, i % 2 ? 0.3 : -0.3));
}
// ---- PAY restart (b64): C-major hit chord, the groove restarts hard ----
put(bus.harm, V.stab([60, 64, 67, 72, 76], { dur: 0.5, tau: 0.15, bright: 5000 }), beatAt(64), 0.55, 0);
// ---- loop-friendly: pad/lead tails past the end are truncated by length; write layers ----
const OUT = fileURLToPath(new URL('./build/', import.meta.url));
function sc(b, f) { return { L: b.L.map((v) => v * f), R: b.R.map((v) => v * f) }; }
for (const [k, b] of Object.entries(bus)) {
  const buf = Buffer.alloc(TOTAL * 8);
  for (let i = 0; i < TOTAL; i++) { buf.writeFloatLE(b.L[i], i * 8); buf.writeFloatLE(b.R[i], i * 8 + 4); }
  fs.writeFileSync(OUT + `music_${k}.f32`, buf);
}
fs.writeFileSync(OUT + 'kicks.json', JSON.stringify(kicks));
console.log('music layers written; kicks:', kicks.length);
