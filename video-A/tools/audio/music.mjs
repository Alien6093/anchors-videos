// Original instrumental score: 112 BPM, A minor -> C major (payment) -> A minor, 150.000 s. No samples, no vocals.
import { SR, Stereo, addMono, addStereo, reverb, pingPong, SVF, mtof, writeWav, peakOf, rng } from './lib.mjs';
import * as V from './voices.mjs';
import { BEAT, STEP, BAR, DUR, bt, bar, CHORDS, PROG, chordAt, tonesOf, secAt, PAD_BREAKS, ENERGY_DB, LEVELS } from './score.mjs';

const TAIL = 3;
const stems = Object.fromEntries(['drums', 'bass', 'pad', 'pluck', 'mallet', 'stab', 'fx', 'tail'].map((k) => [k, new Stereo(DUR + TAIL)]));
const kicks = [];
const rand = rng(12345);
const mono = (stem, buf, t, g, pan) => addMono(stems[stem], buf, t, g, pan);

// ---- melodic patterns: indices into the chord's 4 melody tones (-1 = rest), 8th-note slots ----
const PAT = {
  hook: [1, -1, 0, 1, -1, 2, 1, -1], answer: [2, -1, 1, -1, 0, 1, -1, -1], lift: [1, -1, 0, 1, 2, -1, 3, 2],
  sparse: [1, -1, -1, -1, 2, -1, -1, -1], rise: [0, -1, 1, -1, 2, -1, 3, -1], run: [0, 1, 2, 3, 2, 1, 2, 3],
  slow: [1, -1, -1, -1, 2, -1, 0, -1], held: [2, -1, -1, -1, -1, -1, -1, -1],
};
const melPattern = (level, barIdx) => {
  const k = barIdx % 4;
  if (level === 1) return k === 3 ? PAT.rise : PAT.sparse;
  if (level === 2) return [PAT.hook, PAT.answer, PAT.hook, PAT.lift][k];
  if (level === 3) return k % 2 ? PAT.hook : PAT.run;
  if (level === 'resolve') return k === 3 ? PAT.held : PAT.slow;
  return null;
};
const SCALE = [69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88];

// ---- snare roll helper (accelerating) ----
const roll = (a, b, i0, i1, v0, v1, g = 0.55, stem = 'drums') => {
  let t = a, i = 0;
  while (t < b - 0.005) {
    const p = (t - a) / (b - a);
    mono(stem, V.snare(v0 + (v1 - v0) * p, 100 + i++), t, g, 0);
    t += i0 * (i1 / i0) ** p;
  }
};

// ---- step grid: drums, bass, pluck, mallet ----
for (let s = 0; s * STEP < DUR; s++) {
  const t = s * STEP, p = s % 16, barIdx = Math.floor(s / 16);
  const sec = secAt(t), chord = chordAt(t), root = CHORDS[chord].root, arp = CHORDS[chord].arp;
  const v = sec.vel ?? 1, hum = 0.9 + rand() * 0.2;

  // kick
  let k = 0;
  if (sec.kick === 1) k = p % 8 === 0 ? 0.75 : 0;
  else if (sec.kick >= 2) k = p % 4 === 0 ? 0.95 : sec.kick === 3 && p === 10 ? 0.5 : 0;
  if (k) { kicks.push(t); mono('drums', V.kick(k * v, s), t, 0.95, 0); }

  // hats and brushes
  if (sec.hat === 1 && p % 4 === 2) mono('drums', V.brush(0.55 * hum, s), t, 0.5, 0.25);
  else if (sec.hat === 2 && p % 2 === 0) mono('drums', V.hat((p % 4 === 2 ? 0.8 : 0.35) * hum, false, s), t, 0.42, p % 4 ? -0.3 : 0.3);
  else if (sec.hat === 3) {
    if (p % 8 === 6 && barIdx % 2 === 0) mono('drums', V.hat(0.9, true, s), t, 0.6, 0.3);
    else mono('drums', V.hat((p % 4 === 2 ? 1 : p % 2 === 0 ? 0.55 : 0.35) * hum, false, s), t, 0.45, p % 2 ? -0.3 : 0.3);
  }
  // claps (+ snare layer where marked) on 2 and 4, phrase-end fills every 4th bar
  if (sec.clap && p % 8 === 4) {
    mono('drums', V.clap(1, s), t, sec.clap, 0.05);
    if (sec.snare) mono('drums', V.snare(0.8, s), t, 0.45, 0);
  }
  if (sec.clap >= 0.5 && barIdx % 4 === 3 && p >= 13) mono('drums', V.snare(0.3 + (p - 13) * 0.15, s), t, 0.4, 0);

  // bass
  const b = sec.bass;
  const bass = (n, dur, vel, saw = 0.45) => {
    mono('bass', V.subNote(mtof(n), dur, 0.9 * vel), t, 0.8);
    if (saw) mono('bass', V.bassSaw(mtof(n + 12), dur, 0.5 * vel, 900), t, saw);
  };
  if (b === 'pulse') { if (p % 4 === 0) bass(root, 0.28, 0.9, 0); }
  else if (b === 'sub') { if (p === 0) bass(root, BAR * 0.97, 0.9, 0); }
  else if (b === 1) { if (p === 0) bass(root, STEP * 14, 0.85 * v, 0); }
  else if (b === 1.5) { const h = { 0: [root, 6], 8: [root, 3], 14: [root + 12, 2] }[p]; if (h) bass(h[0], h[1] * STEP * 0.95, 0.9 * v); }
  else if (b === 2) {
    const h = { 0: [root, 5], 6: [root + 12, 2], 8: [root, 3], 11: [root + 7, 2], 14: [root + 12, 2] }[p];
    if (h) bass(h[0], h[1] * STEP * 0.95, v);
  }

  // click pulse in the 1.5 s dropout
  if (sec.click && p % 2 === 0) mono('fx', V.rim(0.7, s), t, 0.5, p % 4 ? 0.3 : -0.3);

  // pluck
  const pl = sec.pluck;
  if (pl === 'arp' && p % 2 === 0) {
    const seq = [0, 1, 2, 3, 4, 3, 2, 1][(p / 2) % 8];
    const n = [57, 60, 64, 67, 69][Math.min(seq, 4)] + 12 * (seq === 4 ? 0 : 0);
    mono('pluck', V.pluck(mtof(n + 12), 0.8 * (p % 4 ? 0.8 : 1)), t, 0.6, p % 4 ? 0.25 : -0.25);
  } else if (pl === 1 && p % 2 === 0) {
    mono('pluck', V.pluck(mtof(arp[[0, 2, 1, 3, 2, 1, 3, 2][(p / 2) % 8]] + 12), 0.6), t, 0.6, p % 4 ? 0.25 : -0.25);
  } else if (pl === 2 && p % 2 === 0) {
    mono('pluck', V.pluck(mtof(arp[[0, 2, 1, 3, 2, 1, 3, 2][(p / 2) % 8]] + 12), v * (p % 4 ? 0.6 : 0.8)), t, 0.6, p % 4 ? 0.25 : -0.25);
  } else if (pl === 3) {
    mono('pluck', V.pluck(mtof(arp[[0, 1, 2, 3, 2, 3, 1, 2][p % 8]] + 12), v * (p % 2 ? 0.5 : 0.85), 0.25), t, 0.55, p % 2 ? 0.3 : -0.3);
  }

  // mallet melody
  const mp = melPattern(sec.mel, barIdx);
  if (mp && p % 2 === 0) {
    const idx = mp[(p / 2) % 8];
    if (idx >= 0) {
      const n = tonesOf(chord)[idx];
      const vel = (sec.mel === 'resolve' ? 0.8 : sec.mel === 1 ? 0.8 : 0.95) * (idx === 3 ? 0.9 : 1);
      mono('mallet', V.marimba(mtof(n), vel), t, 0.6, (p / 2) % 2 ? 0.35 : -0.35);
      if (sec.oct) mono('mallet', V.marimba(mtof(n + 12), vel * 0.4, 0.5), t, 0.4, (p / 2) % 2 ? -0.4 : 0.4);
    }
  }
  if (sec.mel === 'climb') {
    const prog = (t - 122.6) / (124.286 - 122.6);
    const n = SCALE[Math.min(SCALE.length - 1, Math.round(prog * (SCALE.length - 1)))];
    mono('mallet', V.marimba(mtof(n), 0.8 + 0.25 * prog, 0.6), t, 0.6, p % 2 ? 0.3 : -0.3);
  }
  // stabs on bar downbeat and the "and" of 2 in the peak
  if (sec.stabs && (p === 0 || p === 10)) mono('stab', V.stab(arp.map((n) => mtof(n + 12)), p ? 0.6 : 0.85, 0.5), t, 0.5, 0);
  // glass bells over the C major payment chords (bell + glass timbre)
  if (sec.glass && (sec.glass === 2 || p % 2 === 0)) {
    const idx = [0, 2, 1, 3, 2, 3, 1, 2][(p / (sec.glass === 2 ? 1 : 2)) % 8];
    const glassy = [[1, 1, 1.0], [2.02, 0.3, 0.55], [3.98, 0.12, 0.3]];
    mono('stab', V.bell(mtof(tonesOf(chord)[idx % 4] + (idx > 2 ? 0 : 0)), 1.3, 0.32 * (0.6 + 0.4 * ((t - bar(33)) / (75 - bar(33)))), glassy), t, 0.55, (p % 4 ? 0.4 : -0.4));
  }
}

// ---- intro: sub pulses under teaser + riser, sub hit and Am9 pad at 1.9 ----
[0, BEAT, BEAT * 2].forEach((t0) => mono('bass', V.subNote(mtof(33), 0.3, 0.9), t0, 0.7));
mono('fx', V.noiseSweep(1.6, 200, 9000, 0.9, 51, 2.2), 0, 0.55, 0);
mono('pad', V.pad([45, 57, 60, 64, 71].map(mtof), 1.6, 0.7, 900, 1.2, 0.2, 61), 0, 0.42, 0);
mono('bass', V.subNote(mtof(33), 2.3, 1), 1.9, 0.7);

// ---- pad: one voice-led chord per segment, merged across same-chord bars ----
{
  const cuts = [...new Set([...Array.from({ length: 71 }, (_, i) => +(i * BAR).toFixed(4)), ...PAD_BREAKS.map((t) => +t.toFixed(4)), 150])].sort((a, b) => a - b);
  const forced = new Set(PAD_BREAKS.map((t) => +t.toFixed(4)));
  const segs = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i], bEnd = cuts[i + 1], mid = (a + bEnd) / 2, sec = secAt(mid), ch = chordAt(mid);
    if (!sec.pad || a >= 145.5) continue;
    const prev = segs[segs.length - 1];
    if (prev && !forced.has(a) && prev.chord === ch && prev.pad === sec.pad && prev.cut === (sec.padCut ?? 1800) && Math.abs(prev.t1 - a) < 1e-3) prev.t1 = bEnd;
    else segs.push({ t0: a, t1: bEnd, chord: ch, pad: sec.pad, cut: sec.padCut ?? 1800, atk: sec.padAtk ?? 0.7 });
  }
  segs.forEach((g, i) => {
    const nextPad = secAt(g.t1 + 0.01).pad;
    const rel = nextPad ? 0.9 : 0.12;
    const notes = [CHORDS[g.chord].root + 12, ...CHORDS[g.chord].arp].map(mtof);
    mono('pad', V.pad(notes, g.t1 - g.t0 + 0.05, g.pad, g.cut, g.atk, rel, i), g.t0, 0.42, 0);
  });
}
// pad rise 66-70 (an octave-up layer swelling into the hard cut)
mono('pad', V.pad([57, 64, 67, 72, 76].map(mtof), 3.9, 0.7, 5200, 3.6, 0.1, 71), 66.0, 0.32, 0);

// ---- rolls, risers, impacts (the film's only cymbal is at 115.0) ----
roll(22.0, bt(43), 0.134, 0.045, 0.3, 1.0);
roll(42.0, 43.2, 0.27, 0.04, 0.35, 1.0);
roll(68.9, 70.0, 0.27, 0.05, 0.15, 0.5, 0.35);
roll(81.0, 82.5, 0.134, 0.134, 0.4, 0.9, 0.5);
roll(104.0, 104.5, 0.134, 0.05, 0.1, 0.35, 0.22, 'tail');
roll(113.5, 115.0, 0.27, 0.035, 0.35, 1.0, 0.6);
mono('tail', V.tom(90, 0.5), 104.0, 0.3, -0.2);
mono('tail', V.tom(70, 0.55), 104.27, 0.3, 0.2);
mono('fx', V.noiseSweep(1.9, 300, 6000, 0.6, 32, 2.2), 13.6, 0.35, 0);
mono('fx', V.noiseSweep(1.2, 300, 9000, 0.9, 33, 2.5), 42.0, 0.55, 0);
mono('fx', V.noiseSweep(4.0, 250, 6000, 0.7, 34, 3), 66.0, 0.3, 0);
mono('fx', V.noiseSweep(1.5, 300, 9000, 0.9, 35, 2.4), 113.5, 0.6, 0);
{
  const rise = (t0, dur, m0, oct, g) => {
    const n = Math.round(dur * SR), o = new Float32Array(n); let ph = 0;
    for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(m0) * 2 ** (p * oct)) / SR; o[i] = (2 * (ph % 1) - 1) * p ** 2.5 * 0.35; }
    mono('fx', o, t0, g, 0);
  };
  rise(42.0, 1.2, 57, 2, 0.4);
  rise(113.5, 1.5, 60, 2, 0.4);
}
const AM = [57, 60, 64, 69, 72, 76].map(mtof), CM = [55, 60, 64, 67, 72, 76].map(mtof);
mono('fx', V.impact(1.4, 0.8), 43.2, 0.5, 0);
mono('fx', V.impact(1.2, 0.7), 75.0, 0.4, 0);
mono('stab', V.stab(AM, 0.7, 0.5), 75.0, 0.4, 0);
mono('drums', V.kick(1.2), 104.9, 1, 0);
mono('drums', V.snare(0.9), 104.9, 0.5, 0);
mono('fx', V.impact(1.8, 1.0), 104.9, 0.6, 0);
mono('stab', V.stab(CM, 1.0, 1.4), 105.0, 0.6, 0);
mono('fx', V.impact(2.0, 1.0), 115.0, 0.6, 0);
mono('fx', V.cymbalSwell(5, 1, 41), 115.0, 0.5, 0.05);
mono('stab', V.stab(CM, 1.0, 1.2), 115.0, 0.55, 0);
mono('fx', V.impact(1.5, 0.7), 124.286, 0.45, 0);
[79, 84, 88].forEach((m, i) => mono('mallet', V.marimba(mtof(m), 1.0 - i * 0.1, 2.5), 124.286, 0.55, (i - 1) * 0.3));
mono('stab', V.stab(CM, 0.8, 1.0), 124.286, 0.45, 0);
// approvals and cuts: bright stabs
[89.9, 90.6, 91.3].forEach((t, i) => mono('stab', V.stab([mtof([76, 79, 81][i]), mtof([83, 86, 88][i])], 0.9, 0.35), t, 0.5, (i - 1) * 0.25));
[69, 72, 76, 79, 81].forEach((m, i) => mono('stab', V.stab([mtof(m), mtof(m + 12)], 0.85 + i * 0.03, 0.45), 92.6 + i * 0.5, 0.5, (i - 2) * 0.15));
// payment bloom: bass under the C major chord + warm marimba tail
mono('mallet', V.marimba(mtof(72), 0.8, 3), bar(33), 0.45, 0);
// resolve to the tonic on the end card
mono('mallet', V.marimba(mtof(81), 0.9, 2.5), 145.5, 0.5, -0.2);
mono('mallet', V.marimba(mtof(76), 0.8, 2.5), 145.5, 0.4, 0.2);

// ---- end card: Am(add9) then C, decaying to silence at 150.0 ----
mono('pad', V.pad([45, 57, 60, 64, 71, 76].map(mtof), 2.1, 1.1, 2200, 0.5, 1.4, 77), 145.5, 0.5, 0);
mono('pad', V.pad([48, 55, 60, 64, 67, 72].map(mtof), 2.0, 1.0, 2000, 0.9, 2.5, 78), 147.6, 0.5, 0);
mono('bass', V.subNote(mtof(33), 2.3, 0.8), 145.5, 0.6);
mono('bass', V.subNote(mtof(36), 2.3, 0.7), 147.65, 0.5);
mono('mallet', V.marimba(mtof(72), 0.7, 3), 147.65, 0.4, 0.1);

// ---- typing duck on pluck (-3 dB) under keystrokes ----
for (const [a, b] of [[5.0, 7.4], [38.3, 40.5]]) {
  const st = stems.pluck;
  for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { st.L[i] *= 0.708; st.R[i] *= 0.708; }
}

// ---- pad/pluck rising-filter sweeps ----
const SWEEPS = [[13.5, 15.5, 500, 14000], [bt(80), 44.5, 700, 18000], [66.0, 70.0, 800, 9000], [113.5, 115.0, 900, 14000]];
for (const name of ['pad', 'pluck', 'mallet']) {
  const st = stems[name];
  for (const [a, b, f0, f1] of SWEEPS) {
    for (const ch of [st.L, st.R]) {
      const f = new SVF();
      for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) {
        const p = (i / SR - a) / (b - a);
        f.run(ch[i], f0 * (f1 / f0) ** p, 0.9);
        ch[i] = f.lp;
      }
    }
  }
}

// ---- kick sidechain ----
const duck = new Float32Array(stems.pad.n).fill(1);
for (const tk of kicks) {
  const i0 = Math.round(tk * SR);
  for (let i = i0; i < Math.min(duck.length, i0 + 0.4 * SR); i++) { const g = 1 - 0.55 * Math.exp(-((i - i0) / SR) / 0.11); if (g < duck[i]) duck[i] = g; }
}
for (const [name, amt] of [['pad', 1], ['bass', 0.8], ['pluck', 0.5]]) {
  const st = stems[name];
  for (let i = 0; i < st.n; i++) { const g = 1 - (1 - duck[i]) * amt; st.L[i] *= g; st.R[i] *= g; }
}

// ---- buses with reverb + delay ----
const N = stems.pad.n;
const sum = new Stereo(DUR + TAIL), send = new Stereo(DUR + TAIL), dsend = new Stereo(DUR + TAIL);
const busGain = { drums: 1.0, bass: 1.0, pad: 0.85, pluck: 0.8, mallet: 0.9, stab: 0.8, fx: 0.8, tail: 1.0 };
const revAmt = { drums: 0.05, bass: 0, pad: 0.5, pluck: 0.3, mallet: 0.4, stab: 0.4, fx: 0.25, tail: 0.5 };
for (const [name, st] of Object.entries(stems)) { addStereo(sum, st, 0, busGain[name]); addStereo(send, st, 0, revAmt[name]); }
addStereo(dsend, stems.mallet, 0, 0.35); addStereo(dsend, stems.pluck, 0, 0.25); addStereo(dsend, stems.stab, 0, 0.25);
addStereo(sum, reverb(send, { decay: 0.86, damp: 0.4, pre: 0.015, size: 1.4 }), 0, 0.75);
addStereo(sum, pingPong(dsend, BEAT * 0.75, 0.38, 3200), 0, 0.7);

// ---- auto-level each section to the script's energy map, then gates, room tone, tone shaping ----
const nOut = Math.round(DUR * SR);
const mid = (i) => (sum.L[i] + sum.R[i]) * 0.5;
const anchors = [];
for (const [a, b, e] of LEVELS) {
  let s = 0, c = 0;
  for (let i = Math.round((a + 0.3) * SR); i < Math.round((b - 0.1) * SR); i++) { s += mid(i) ** 2; c++; }
  const rms = Math.sqrt(s / Math.max(1, c)) || 1e-6;
  const g = 10 ** (ENERGY_DB[e] / 20) / rms;
  anchors.push([a + 0.25, Math.log(g)], [b - 0.25, Math.log(g)]);
}
const levelAt = (t) => {
  if (t <= anchors[0][0]) return Math.exp(anchors[0][1]);
  for (let k = 1; k < anchors.length; k++) if (t <= anchors[k][0]) { const [a, ga] = anchors[k - 1], [b, gb] = anchors[k]; return Math.exp(ga + ((gb - ga) * (t - a)) / Math.max(1e-6, b - a)); }
  return Math.exp(anchors[anchors.length - 1][1]);
};
const ramp = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const gate = (t) => {
  let g = 1;
  g *= 1 - (ramp(t, 1.595, 1.6) - ramp(t, 1.9, 1.903));                    // smash-to-black 1.6-1.9
  g *= 1 - (ramp(t, 69.992, 70.0) - ramp(t, 70.6, 70.714));         // pre-payment silence
  g *= 1 - 0.97 * (ramp(t, 103.3, 103.55) - ramp(t, 104.0, 104.5));        // near-silence before 8 of 8
    if (t > 148) g *= Math.cos(ramp(t, 148, 150) * Math.PI / 2) ** 2;
  return g;
};
const room = rng(777);
let rl = 0, rr = 0;
const out = new Stereo(DUR);
let hpL = 0, hpR = 0;
const hpk = Math.exp((-2 * Math.PI * 28) / SR);
for (let i = 0; i < nOut; i++) {
  const t = i / SR;
  let g = gate(t) * levelAt(t);
  if (t < 0.02) g *= t / 0.02;
  let l = sum.L[i] * g, r = sum.R[i] * g;
  hpL = hpk * hpL + (1 - hpk) * l; hpR = hpk * hpR + (1 - hpk) * r;
  l -= hpL; r -= hpR;
  out.L[i] = Math.tanh(l * 1.15) / 1.15;
  out.R[i] = Math.tanh(r * 1.15) / 1.15;
  // room tone: warm low noise, only in the two scripted near-silences
  const rt = (ramp(t, 70.0, 70.02) - ramp(t, 70.55, 70.7)) + (ramp(t, 103.35, 103.5) - ramp(t, 104.2, 104.5));
  if (rt > 0) { rl += 0.05 * ((room() * 2 - 1) - rl); rr += 0.05 * ((room() * 2 - 1) - rr); out.L[i] += rl * 0.012 * rt; out.R[i] += rr * 0.012 * rt; }
}
out.L[nOut - 1] = 0; out.R[nOut - 1] = 0;
const pk = peakOf(out.L, out.R);
const scale = 0.85 / pk;
for (let i = 0; i < nOut; i++) { out.L[i] *= scale; out.R[i] *= scale; }
writeWav(process.argv[2] || 'music_raw.wav', out.L, out.R, 24);
console.log('music rendered, peak', pk.toFixed(3), 'samples', nOut, 'kicks', kicks.length);
