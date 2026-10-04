// ANCHOR motif reference voice (Part 1 is the reference; Parts 2 and 3 import or copy this and change only the timbre layer they are assigned).
// Notes (MIDI): A4 69, C5 72, E5 76, D5 74 (passing), A5 81.  120 BPM: spacing 0.25 s, A5 at 1.0 s rings 1.0 s.
import { SR, TWO_PI, SVF, mtof, rng, sat, Stereo, addMono, reverb } from './part1/lib.mjs';

export const ANCHOR_NOTES = [
  { name: 'A4', midi: 69, t: 0.0 },
  { name: 'C5', midi: 72, t: 0.25 },
  { name: 'E5', midi: 76, t: 0.5 },
  { name: 'D5', midi: 74, t: 0.75 },
  { name: 'A5', midi: 81, t: 1.0 },
];
const N = (s) => Math.max(1, Math.round(s * SR));
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));

// bright muted pluck: 2 detuned saws (+/-7 cents) + square, resonant LP with fast envelope sweep, HP 250 Hz, soft saturation.
export function anchorPluck(freq, vel = 1, dur = 0.5) {
  const o = new Float32Array(N(dur));
  const lp = new SVF(), hp = new SVF();
  let p1 = 0, p2 = 0.37, p3 = 0.11;
  const up = 2 ** (7 / 1200), dn = 2 ** (-7 / 1200);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    p1 += (freq * up) / SR; p2 += (freq * dn) / SR; p3 += freq / SR;
    const x = saw(p1) * 0.42 + saw(p2) * 0.42 + (p3 % 1 < 0.5 ? 1 : -1) * 0.16;
    lp.run(x, 1300 + 5200 * Math.exp(-t / 0.09), 1.5);
    hp.run(lp.lp, 250, 0.7);
    const e = Math.min(1, t / 0.002) * Math.exp(-t / 0.2) * (t > dur - 0.02 ? Math.max(0, (dur - t) / 0.02) : 1);
    o[i] = sat(hp.hp * 1.3, 1.6) * e * vel;
  }
  return o;
}
// glass bell doubling (inharmonic partials), -9 dB under the pluck in the reference
export function anchorBell(freq, dur = 1.2, vel = 1) {
  const o = new Float32Array(N(dur));
  const parts = [[1, 1, 0.7], [2.76, 0.35, 0.4], [5.4, 0.16, 0.2], [8.93, 0.06, 0.1]];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; let s = 0;
    for (const [r, a, tau] of parts) s += Math.sin(TWO_PI * freq * r * t) * a * Math.exp(-t / (tau * (dur / 1.2 + 0.4)));
    o[i] = s * Math.min(1, t / 0.001) * vel;
  }
  return o;
}
// one motif note = pluck + bell
export function anchorNote(midi, { vel = 1, dur = 0.5, bell = 0.35 } = {}) {
  const f = mtof(midi), p = anchorPluck(f, vel, dur), b = anchorBell(f, Math.max(dur, 0.6), vel * bell);
  const o = new Float32Array(Math.max(p.length, b.length));
  for (let i = 0; i < o.length; i++) o[i] = (p[i] || 0) + (b[i] || 0);
  return o;
}
export function renderAnchorMotif() {
  const st = new Stereo(2.6);
  for (const n of ANCHOR_NOTES) {
    const last = n.name === 'A5';
    addMono(st, anchorNote(n.midi, { vel: last ? 1.0 : 0.85, dur: last ? 1.0 : 0.35, bell: last ? 0.45 : 0.3 }), n.t, 0.6, 0);
  }
  const rv = reverb(st, { decay: 0.6, damp: 0.5, size: 0.8 });
  for (let i = 0; i < st.n; i++) { st.L[i] += rv.L[i] * 0.18; st.R[i] += rv.R[i] * 0.18; }
  const fade = N(0.05);
  for (let i = 0; i < fade; i++) { st.L[st.n - 1 - i] *= i / fade; st.R[st.n - 1 - i] *= i / fade; }
  return st;
}
