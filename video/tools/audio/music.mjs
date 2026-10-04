// Original instrumental: 112 BPM, A minor (Am - F - C - G), 60.000 s.
import { SR, Stereo, addMono, addStereo, reverb, pingPong, mtof, writeWav, peakOf } from './lib.mjs';
import * as V from './voices.mjs';

const BPM = 112;
const BEAT = 60 / BPM;
const STEP = BEAT / 4; // 16th
const BAR = BEAT * 4;
const DUR = 60;
const END_BEAT = 55.5;

const PAD = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 60, 64, 67], [55, 59, 62, 69]];
const ROOT = [33, 29, 36, 31];
const MEL = [
  [76, 0, 72, 76, 0, 79, 76, 0],
  [77, 0, 72, 77, 0, 81, 77, 0],
  [79, 0, 76, 72, 0, 76, 79, 0],
  [74, 0, 79, 74, 0, 83, 79, 0],
];
const inR = (t, a, b) => t >= a - 1e-6 && t < b - 1e-6;

const stems = Object.fromEntries(['drums', 'bass', 'pad', 'pluck', 'mallet', 'stab', 'fx'].map((k) => [k, new Stereo(DUR + 3)]));
const kicks = [];
const rand = (() => { let s = 12345; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

// ---- Section-driven drum + note grid ----
for (let s = 0; s * STEP < END_BEAT; s++) {
  const t = s * STEP;
  const p = s % 16;
  const bar = Math.floor(s / 16);
  const chord = bar % 4;
  const inSilence = inR(t, 29, 34);
  const hum = 0.9 + rand() * 0.2;

  // kick
  let k = 0;
  if (inR(t, 3.5, 13)) k = p % 8 === 0 ? 0.75 : 0;
  else if (inR(t, 13, 22.4) || inR(t, 23, 29) || inR(t, 34, END_BEAT)) k = p % 4 === 0 ? 0.95 : 0;
  if (k) { kicks.push(t); addMono(stems.drums, V.kick(k * (inR(t, 34, 49) ? 1.05 : 1), s), t, 0.95, 0); }

  // hats
  if (t >= 8 && !inSilence && t < END_BEAT) {
    if (t < 13) { if (p % 4 === 2) addMono(stems.drums, V.brush(0.55 * hum, s), t, 0.5, 0.25); }
    else if (t < 23 || inR(t, 34, END_BEAT)) {
      const accent = p % 4 === 2 ? 1 : p % 2 === 0 ? 0.55 : 0.35;
      if (p % 8 === 6 && t >= 23 && !(t >= 22.0 && t < 23)) addMono(stems.drums, V.hat(0.9, true, s), t, 0.6, 0.3);
      else addMono(stems.drums, V.hat(accent * hum, false, s), t, 0.45, p % 2 ? -0.3 : 0.3);
    } else {
      if (p % 8 === 6) addMono(stems.drums, V.hat(0.9, true, s), t, 0.6, 0.3);
      else addMono(stems.drums, V.hat((p % 4 === 2 ? 1 : 0.45) * hum, false, s), t, 0.45, p % 2 ? -0.3 : 0.3);
    }
  }
  // claps on 2 and 4
  if (p % 8 === 4 && !inSilence) {
    const g = inR(t, 13, 22) ? 0.28 : inR(t, 23, 29) || inR(t, 34, 44) ? 0.6 : inR(t, 44, 49) ? 0.8 : inR(t, 49, END_BEAT) ? 0.5 : 0;
    if (g) addMono(stems.drums, V.clap(1, s), t, g, 0.05);
  }

  // bass (13-29, 34-55.5; 29-34 thin section still has bass)
  if ((t >= 13 && t < END_BEAT) && !(t >= 33.45 && t < 34)) {
    const r = ROOT[chord];
    const bassHits = { 0: [r, 5], 6: [r + 12, 2], 8: [r, 3], 11: [chord === 1 ? r + 7 : r + 7, 2], 14: [r + 12, 2] };
    const h = bassHits[p];
    if (h) {
      const dur = h[1] * STEP * 0.95;
      addMono(stems.bass, V.subNote(mtof(h[0]), dur, 0.9), t, 0.8);
      addMono(stems.bass, V.bassSaw(mtof(h[0] + 12), dur, 0.5, 900), t, 0.45);
    }
  } else if (t >= 3.5 && t < 13 && p === 0 && bar % 2 === 0) {
    addMono(stems.bass, V.subNote(mtof(ROOT[chord] - 0), BEAT * 1.6, 0.7), t, 0.5); // gentle sub bed
  }

  // pluck arp (8ths)
  if (t >= 3.5 && t < END_BEAT && p % 2 === 0 && !(t >= 33.45 && t < 34)) {
    const notes = PAD[chord];
    const order = [0, 2, 1, 3, 2, 1, 3, 2];
    const n = notes[order[(p / 2) % 8]] + 12;
    const vel = inR(t, 29, 34) ? 1.0 : 0.75;
    addMono(stems.pluck, V.pluck(mtof(n), vel * (p % 4 === 0 ? 1 : 0.8)), t, 0.6, p % 4 === 0 ? -0.25 : 0.25);
  }

  // mallet melody (8ths), from 8.0
  if (t >= 8 && t < END_BEAT && p % 2 === 0 && !inSilence) {
    let step = (p / 2) % 8;
    let note = MEL[chord][step];
    if (t >= 49) note = step % 4 === 0 || step === 5 ? MEL[chord][step] : 0; // sparse resolve
    if (note) {
      const oct = inR(t, 34, 49) && step === 5 ? 12 : 0;
      addMono(stems.mallet, V.marimba(mtof(note + oct), inR(t, 34, 49) ? 1.05 : 0.9), t, 0.6, step % 2 ? 0.35 : -0.35);
    }
  }
}
// melody resolution to tonic
addMono(stems.mallet, V.marimba(mtof(81), 1.0, 2), 54.86, 0.6, -0.2);
addMono(stems.mallet, V.marimba(mtof(76), 0.9, 2), 55.4, 0.55, 0.2);

// ---- Sub heartbeat intro 0-3.5 ----
for (let k = 0; k * BEAT * 2 < 3.5; k++) {
  const t0 = k * BEAT * 2;
  addMono(stems.bass, V.subNote(mtof(33), 0.28, 0.9), t0, 0.7);
  if (t0 + 0.24 < 3.5) addMono(stems.bass, V.subNote(mtof(33), 0.2, 0.6), t0 + 0.24, 0.5);
}

// ---- Pads: one chord per bar, gain by section ----
const padGain = (t) => inR(t, 0, 3.5) ? 0.45 : inR(t, 3.5, 13) ? 0.7 : inR(t, 13, 23) ? 0.55 : inR(t, 23, 29) ? 0.75 : inR(t, 29, 34) ? 0.12 : inR(t, 34, 44) ? 0.85 : inR(t, 44, 49) ? 0.9 : 0.7;
for (let b = 0; b * BAR < END_BEAT; b++) {
  const t = b * BAR;
  if (t >= 29.5 && t < 34) continue;
  const dur = Math.min(BAR, 55.6 - t);
  const first = t < 3.5;
  const notes = first ? [45, 52, 57, 60].map(mtof) : PAD[b % 4].map(mtof);
  const cutoff = first ? 700 : inR(t, 44, 49) ? 3000 : 1800;
  addMono(stems.pad, V.pad(notes, dur, padGain(t), cutoff, first ? 1.5 : 0.7, 0.9, b), t, 0.42, 0);
}
// low pad tension bed in the 29-34 thin section (root+fifth, very quiet)
addMono(stems.pad, V.pad([mtof(45), mtof(52)], 4.4, 0.5, 500, 1.2, 0.8, 99), 29.0, 0.3, 0);

// ---- Builds, stabs, impacts, risers ----
const roll = (a, b, i0, i1, v0, v1) => {
  let t = a, i = 0;
  while (t < b - 0.005) {
    const p = (t - a) / (b - a);
    addMono(stems.drums, V.snare(v0 + (v1 - v0) * p, 100 + i++), t, 0.55, 0);
    t += i0 * (i1 / i0) ** p;
  }
};
roll(22.0, 23.0, 0.134, 0.045, 0.3, 1.0);
roll(42.0, 44.0, 0.27, 0.04, 0.35, 1.0);
addMono(stems.fx, V.noiseSweep(1.0, 400, 7000, 0.8, 31, 2.2), 22.0, 0.5, 0);
addMono(stems.fx, V.noiseSweep(2.0, 300, 9000, 0.9, 32, 2.5), 42.0, 0.6, 0);
addMono(stems.fx, V.noiseSweep(1.0, 200, 3000, 0.7, 33, 2), 12.0, 0.35, 0);
addMono(stems.fx, V.noiseSweep(1.5, 300, 5000, 0.7, 34, 2), 35.5, 0.45, 0);
// tonal riser 42-44 (rising saw stack)
{
  const n = Math.round(2 * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    ph += (mtof(57) * 2 ** (p * 2)) / SR;
    o[i] = (2 * (ph % 1) - 1) * p ** 2.5 * 0.35;
  }
  addMono(stems.fx, o, 42.0, 0.5, 0);
}

const AM = [57, 60, 64, 69, 72, 76].map(mtof);
const FM = [53, 57, 60, 65, 69, 72].map(mtof);
const CM = [55, 60, 64, 67, 72, 76].map(mtof);
addMono(stems.stab, V.stab(AM, 0.8, 0.6), 23.0, 0.5, 0);       // drop
addMono(stems.stab, V.stab(CM, 0.9, 0.5), 26.8, 0.55, -0.1);    // approve 1
addMono(stems.stab, V.stab(CM.map((f) => f * 1.122), 0.95, 0.5), 28.0, 0.55, 0.1); // approve 2 (higher)
addMono(stems.stab, V.stab(AM, 1.0, 1.4), 34.0, 0.6, 0);        // return
addMono(stems.stab, V.stab(CM, 1.0, 0.7), 34.8, 0.6, 0);        // big approve
addMono(stems.stab, V.stab(FM, 1.0, 1.6), 37.0, 0.6, 0);        // 8 of 8
addMono(stems.stab, V.stab(CM, 0.9, 0.5), 43.3, 0.5, 0);        // confirm
addMono(stems.pad, V.pad(PAD[1].map(mtof), 1.2, 1.3, 4000, 1.1, 1.0, 55), 35.9, 0.5, 0); // swell into 37.0
addMono(stems.fx, V.impact(1.8, 0.9), 34.0, 0.6, 0);
addMono(stems.fx, V.impact(1.4, 0.7), 23.0, 0.45, 0);
addMono(stems.fx, V.impact(1.8, 1.0), 37.0, 0.55, 0);
addMono(stems.fx, V.crash(3.5, 1), 34.0, 0.45, 0.1);
addMono(stems.fx, V.crash(3.0, 0.8), 23.0, 0.35, -0.1);
addMono(stems.fx, V.crash(4.0, 1.0), 44.0, 0.6, 0);
addMono(stems.fx, V.crash(2.5, 0.9), 37.0, 0.3, 0);

// ---- Final warm chord Am9 (56.0 -> decays to silence at 60) ----
addMono(stems.pad, V.pad([45, 57, 60, 64, 67, 71].map(mtof), 1.6, 1.2, 2200, 0.35, 2.2, 77), 56.0, 0.5, 0);
addMono(stems.mallet, V.marimba(mtof(69), 0.8, 3), 56.0, 0.4, 0);
addMono(stems.bass, V.subNote(mtof(33), 2.2, 0.8), 56.0, 0.6);

// ---- Sidechain duck derived from kicks ----
const duck = new Float32Array(stems.pad.n).fill(1);
for (const tk of kicks) {
  const i0 = Math.round(tk * SR);
  for (let i = i0; i < Math.min(duck.length, i0 + 0.4 * SR); i++) {
    const g = 1 - 0.55 * Math.exp(-((i - i0) / SR) / 0.11);
    if (g < duck[i]) duck[i] = g;
  }
}
for (const [name, amt] of [['pad', 1], ['bass', 0.8], ['pluck', 0.5]]) {
  const st = stems[name];
  for (let i = 0; i < st.n; i++) { const g = 1 - (1 - duck[i]) * amt; st.L[i] *= g; st.R[i] *= g; }
}

// ---- Bus mix with reverb + delay ----
const sum = new Stereo(DUR + 3);
const send = new Stereo(DUR + 3);
const dsend = new Stereo(DUR + 3);
const busGain = { drums: 1.0, bass: 1.0, pad: 0.85, pluck: 0.8, mallet: 0.9, stab: 0.8, fx: 0.8 };
const revAmt = { drums: 0.05, bass: 0, pad: 0.5, pluck: 0.3, mallet: 0.4, stab: 0.35, fx: 0.25 };
for (const [name, st] of Object.entries(stems)) {
  addStereo(sum, st, 0, busGain[name]);
  addStereo(send, st, 0, revAmt[name]);
}
addStereo(dsend, stems.mallet, 0, 0.35);
addStereo(dsend, stems.pluck, 0, 0.25);
addStereo(dsend, stems.stab, 0, 0.25);
addStereo(sum, reverb(send, { decay: 0.86, damp: 0.4, pre: 0.015, size: 1.4 }), 0, 0.75);
addStereo(sum, pingPong(dsend, BEAT * 0.75, 0.38, 3200), 0, 0.7);

// ---- Master: gate silence 33.5-34.0, tail fade, tone, limiter-ish ----
const CURVE = [[0, 0.5], [3.4, 0.5], [3.6, 0.72], [13, 0.72], [13.1, 0.88], [22.9, 0.95], [23, 1.05], [29, 1.05], [29.3, 0.9], [33.4, 0.9], [34, 1.1], [49, 1.1], [49.6, 0.9], [55.5, 0.9], [56, 1.0], [60, 1.0]];
const secGain = (t) => {
  for (let k = 1; k < CURVE.length; k++) if (t <= CURVE[k][0]) { const [a, ga] = CURVE[k - 1], [b, gb] = CURVE[k]; return ga + ((gb - ga) * (t - a)) / (b - a); }
  return 1;
};
const gate = (t) => {
  if (t >= 33.4 && t < 33.5) return 1 - 0.97 * ((t - 33.4) / 0.1);
  if (t >= 33.5 && t < 33.98) return 0.03;
  if (t >= 33.98 && t < 34.0) return 0.03 + 0.97 * ((t - 33.98) / 0.02);
  return 1;
};
const out = new Stereo(DUR);
let lpL = 0, lpR = 0, hpL = 0, hpR = 0;
const hpk = Math.exp((-2 * Math.PI * 28) / SR);
for (let i = 0; i < out.n; i++) {
  const t = i / SR;
  let g = gate(t) * secGain(t);
  if (t > 59.2) g *= Math.cos(((t - 59.2) / 0.8) * Math.PI / 2) ** 2;
  if (t < 0.03) g *= t / 0.03;
  let l = sum.L[i] * g, r = sum.R[i] * g;
  // DC/subsonic high-pass
  hpL = hpk * hpL + (1 - hpk) * l; hpR = hpk * hpR + (1 - hpk) * r;
  l -= hpL; r -= hpR;
  out.L[i] = Math.tanh(l * 1.15) / 1.15;
  out.R[i] = Math.tanh(r * 1.15) / 1.15;
}
out.L[out.n - 1] = 0; out.R[out.n - 1] = 0;
const pk = peakOf(out.L, out.R);
const scale = 0.85 / pk;
for (let i = 0; i < out.n; i++) { out.L[i] *= scale; out.R[i] *= scale; }
writeWav(process.argv[2] || 'music_raw.wav', out.L, out.R, 24);
console.log('music rendered, pre-scale peak', pk.toFixed(3), 'samples', out.n);
