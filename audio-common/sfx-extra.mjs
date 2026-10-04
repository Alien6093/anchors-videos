// New one-shots for the 60 s films (A and B). Same voices and finishing chain as sfx.mjs (v4).
// Output: audio-common/sfx/*.wav (added next to the reused v4 one-shots). Usage: node sfx-extra.mjs [outDir]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, SVF, Stereo, addMono, reverb, writeWav, peakOf, fadeTail, fadeHead, mtof } from './lib.mjs';
import * as V from './voices.mjs';

const OUT = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), 'sfx'));
fs.mkdirSync(OUT, { recursive: true });
const N = (s) => Math.round(s * SR);
const noise = (seed) => V.noiseSrc(seed);
const mixIn = (dst, src, at = 0, g = 1) => { const s = N(at); for (let i = 0; i < src.length && s + i < dst.length; i++) dst[s + i] += src[i] * g; return dst; };
const sine = (freqFn, envFn, dur) => {
  const o = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < o.length; i++) { const t = i / SR; ph += (TWO_PI * freqFn(t)) / SR; o[i] = Math.sin(ph) * envFn(t); }
  return o;
};
const click = (seed, hp, bodyHz, dur = 0.09) => {
  const o = new Float32Array(N(dur)); const n = noise(seed); const f = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; f.run(n(), hp, 1.2); ph += (TWO_PI * bodyHz) / SR;
    o[i] = f.hp * Math.exp(-t / 0.006) * 0.9 + Math.sin(ph) * Math.exp(-t / 0.012) * 0.5;
  }
  return o;
};
const whoosh = (dur, f0, f1, seed, peak = 0.5, q = 1.6) => {
  const o = new Float32Array(N(dur)); const n = noise(seed); const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const p = i / o.length; f.run(n(), f0 * (f1 / f0) ** p, q);
    const env = p < peak ? Math.sin((p / peak) * Math.PI / 2) : Math.cos(((p - peak) / (1 - peak)) * Math.PI / 2);
    o[i] = f.bp * env ** 1.5;
  }
  return o;
};
const blip = (f0, dur = 0.12, tau = 0.04, h2 = 0.4) =>
  sine(() => f0, (t) => Math.exp(-t / tau) * Math.min(1, t / 0.002), dur).map((v, i) => v + h2 * Math.sin(TWO_PI * f0 * 2 * (i / SR)) * Math.exp(-(i / SR) / (tau * 0.6)));
const glassBell = (m, dur, vel = 1) => V.bell(mtof(m), dur, vel, [[1, 1, dur * 0.45], [2.02, 0.3, dur * 0.25], [3.98, 0.12, dur * 0.14], [5.9, 0.05, dur * 0.08]]);
const tickRamp = (dur, iv0, iv1, f0, f1, tail, g0 = 0.3) => {
  const o = new Float32Array(N(dur + tail));
  let t = 0;
  while (t < dur) { const p = t / dur; mixIn(o, blip(f0 * (f1 / f0) ** p, 0.05, 0.008, 0.25), t, g0 + (1 - g0) * p); t += iv0 * (iv1 / iv0) ** p; }
  return o;
};
const riseTone = (dur, m0, oct, gain) => {
  const n = N(dur), o = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(m0) * 2 ** (p * oct)) / SR; o[i] = (2 * (ph % 1) - 1) * p ** 2.5 * gain; }
  return o;
};
const riser = (dur, seed, m0) => { const a = V.noiseSweep(dur, 300, 9000, 0.9, seed, 2.3); return mixIn(a, riseTone(dur, m0, 2, 0.16), 0, 1); };

const S = {};
// logo hit whose transient lands exactly on the cue (short 0.22 s whoosh lead-in, hit at +0.22)
S['logo-hit-short'] = (() => {
  const o = new Float32Array(N(2.4));
  mixIn(o, whoosh(0.22, 250, 4500, 12, 0.9, 1.5), 0, 0.7);
  mixIn(o, V.impact(1.8, 0.9), 0.22, 0.9);
  [57, 64, 69, 72].forEach((m) => mixIn(o, V.bell(mtof(m + 12), 1.8, 0.5), 0.22, 0.4));
  return o;
})();
// reverse whip whose landing click sits exactly one beat (0.5357 s) after the cue
S['whip-land'] = (() => {
  const o = new Float32Array(N(1.0));
  mixIn(o, V.noiseSweep(0.5357, 400, 8000, 1, 67, 3, 1.6), 0, 1);
  return mixIn(o, mixIn(click(68, 2500, 300, 0.06), sine(() => 120, (t) => Math.exp(-t / 0.05) * 0.4, 0.2), 0, 1), 0.5357, 0.8);
})();
// whip whose peak lands 0.2 s after the file start (the cue is placed 0.2 s early so the peak hits the cut)
S['whip-peak'] = whoosh(0.5, 500, 5200, 74, 0.4, 1.4);
S['riser-1607'] = riser(1.607, 81, 57);   // A: 51.964 -> 53.571
S['riser-1071'] = riser(1.0714, 82, 60);  // B: 20.367 -> 21.438
S['counter-ramp-B0'] = (() => { // 1.5 s race, tick + glass landing at 1.5
  const o = tickRamp(1.5, 0.12, 0.018, 1500, 3800, 1.2);
  mixIn(o, blip(2400, 0.08, 0.02, 0.3), 1.5, 0.7);
  return mixIn(o, glassBell(96, 1.1, 0.8), 1.5, 0.75);
})();
S['counter-ramp-B1'] = tickRamp(1.0714, 0.11, 0.02, 900, 3000, 0.25);           // 8.571 -> 9.643, no bell (lock cued separately)
S['counter-ramp-final'] = tickRamp(2.1429, 0.16, 0.02, 700, 3800, 0.2, 0.2);  // 22.5 -> 24.643, pitch-rising, lock cued separately
S['row-swish'] = whoosh(1.0, 900, 4200, 75, 0.55, 1.1);
// the film's only cymbal, trimmed so it rings out under the peak and is gone before the end card is felt
S['cymbal-swell-short'] = V.cymbalSwell(3.4, 1, 43).map((v, i) => v * Math.exp(-Math.max(0, i / SR - 0.7) / 0.55));
S['bright-stab-4'] = V.stab([mtof(84), mtof(91)], 1, 0.3);
S['approve-stab-up'] = V.stab([mtof(72), mtof(79)], 0.9, 0.35);

const WIDE = /whoosh|riser|whip|swell|chime|impact|logo|glass|ramp|stab|swish|coin|ping|bar-fill/;
for (const [name, m] of Object.entries(S)) {
  const wide = WIDE.test(name);
  const mono = fadeHead(Float32Array.from(m), 0.001);
  const st = new Stereo(mono.length / SR + (wide ? 0.4 : 0.01));
  addMono(st, mono, 0, 1, 0);
  if (wide) {
    const rv = reverb(st, { decay: 0.7, damp: 0.5, size: 0.8 });
    for (let i = 0; i < st.n; i++) { st.L[i] += rv.L[i] * 0.35; st.R[i] += rv.R[i] * 0.35; }
  }
  const L = st.L.slice(), R = st.R.slice();
  const g = 0.79 / (peakOf(L, R) || 1);
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  fadeTail(L, 0.03); fadeTail(R, 0.03);
  writeWav(path.join(OUT, `${name}.wav`), L, R, 24);
}
console.log('extra sfx written:', Object.keys(S).length);
