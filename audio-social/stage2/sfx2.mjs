// Stage 2 new one-shots (hook riser/slam/drop, Next bridge riser, near-silence air, loop tail, processed glass tail).
// node sfx2.mjs  -> ./sfx/*.wav  (only place these are written; audio-common/audio-A are read only)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, SVF, Stereo, addMono, reverb, writeWav, readWav, peakOf, fadeTail, fadeHead, mtof } from '../../audio-common/lib.mjs';
import * as V from '../../audio-common/voices.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'sfx');
const BEAT = 60 / 112;
const N = (s) => Math.round(s * SR);
const mixIn = (dst, src, at = 0, g = 1) => { const s = N(at); for (let i = 0; i < src.length && s + i < dst.length; i++) dst[s + i] += src[i] * g; return dst; };
const sine = (freqFn, envFn, dur) => {
  const o = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < o.length; i++) { const t = i / SR; ph += (TWO_PI * freqFn(t)) / SR; o[i] = Math.sin(ph) * envFn(t); }
  return o;
};
const click = (seed, hp, bodyHz, dur = 0.09) => {
  const o = new Float32Array(N(dur)); const n = V.noiseSrc(seed); const f = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; f.run(n(), hp, 1.2); ph += (TWO_PI * bodyHz) / SR;
    o[i] = f.hp * Math.exp(-t / 0.006) * 0.9 + Math.sin(ph) * Math.exp(-t / 0.012) * 0.5;
  }
  return o;
};
const riseTone = (dur, m0, oct, gain) => {
  const n = N(dur), o = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(m0) * 2 ** (p * oct)) / SR; o[i] = (2 * (ph % 1) - 1) * p ** 2.5 * gain; }
  return o;
};

const S = {};
const opts = {}; // per-file: {wide, peak, tail}

// 1a. hook slam: lands on frame 0 (text slam). Dry, tight, low sub + snap.
S['hook-slam'] = (() => {
  const o = new Float32Array(N(0.42));
  mixIn(o, sine((t) => 62 + 70 * Math.exp(-t / 0.035), (t) => Math.exp(-t / 0.13) * Math.min(1, t / 0.0015), 0.42), 0, 0.95);
  mixIn(o, click(101, 1400, 190, 0.07), 0, 0.75);
  mixIn(o, V.tom(150, 0.7), 0, 0.3);
  return o;
})();
opts['hook-slam'] = { peak: 0.85 };
// 1b. hook riser: reverse-swell, exactly 2 beats (0 -> 1.0714 s = f32), peaks at the stamp
S['hook-riser'] = (() => {
  const d = 2 * BEAT, o = V.noiseSweep(d, 250, 9500, 0.9, 91, 2.0);
  mixIn(o, riseTone(d, 57, 2, 0.14), 0, 1);
  return o;
})();
opts['hook-riser'] = { wide: true, peak: 0.6, tail: 0 };
// 1c. drop sub under the stamp at f32
S['hook-drop-sub'] = sine((t) => 44 + 26 * Math.exp(-t / 0.05), (t) => Math.exp(-t / 0.28) * Math.min(1, t / 0.002), 0.9);
opts['hook-drop-sub'] = { peak: 0.8 };
// 2. 'Next' bridge: soft rising Am9 pad note + riser tail, 3.45 beats (b80 -> b83.45), then a clean half-beat of silence
S['next-riser'] = (() => {
  const d = 3.45 * BEAT, o = new Float32Array(N(d));
  mixIn(o, V.noiseSweep(d, 350, 8200, 0.8, 93, 2.4), 0, 0.85);
  mixIn(o, riseTone(d, 60, 1.5, 0.12), 0, 1);
  const pad = V.pad([57, 64, 71, 76].map(mtof), d, 0.6, 3800, 1.4, 0.05, 94);
  mixIn(o, pad, 0, 0.5);
  const ramp = Math.round(0.02 * SR); // quick exit so b83.5-84 is silent
  for (let i = 0; i < ramp; i++) o[o.length - 1 - i] *= i / ramp;
  return o;
})();
opts['next-riser'] = { peak: 0.6, tail: 0 };
// 3. loop-seam tail: low Am(add9) pad, same voicing as the hook pad, 0.7 s
S['loop-tail'] = (() => {
  const o = V.pad([33, 45, 57, 60, 64, 71].map(mtof), 0.7, 0.8, 1100, 0.22, 0.25, 61);
  return o;
})();
opts['loop-tail'] = { wide: false, peak: 0.6, tail: 0 };
// 4. near-silence beat b71 -> b72: room air that inhales under the gate (very quiet, rising)
S['near-silence-air'] = (() => {
  const d = BEAT, o = new Float32Array(N(d)); const n = V.noiseSrc(777); const f = new SVF();
  for (let i = 0; i < o.length; i++) { const p = i / o.length; f.run(n(), 320 + 900 * p * p, 0.7); o[i] = f.lp * (0.25 + 0.75 * p ** 2); }
  return o;
})();
opts['near-silence-air'] = { peak: 0.5, tail: 0 };

fs.mkdirSync(OUT, { recursive: true });
for (const [name, m] of Object.entries(S)) {
  const { wide = false, peak = 0.79, tail = 0.01 } = opts[name] ?? {};
  const mono = fadeHead(Float32Array.from(m), 0.001);
  const st = new Stereo(mono.length / SR + (wide ? 0.25 : tail));
  addMono(st, mono, 0, 1, 0);
  if (wide) { const rv = reverb(st, { decay: 0.6, damp: 0.5, size: 0.8 }); for (let i = 0; i < st.n; i++) { st.L[i] += rv.L[i] * 0.3; st.R[i] += rv.R[i] * 0.3; } }
  const L = st.L.slice(), R = st.R.slice(), g = peak / (peakOf(L, R) || 1);
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  fadeTail(L, 0.02); fadeTail(R, 0.02);
  writeWav(path.join(OUT, `${name}.wav`), L, R, 24);
}
// 5. processed glass tail: reused audio-A glass tail, pulled down to -12 dB toward the end (read only source)
{
  const g = readWav(path.join(HERE, '../../audio-A/sfx/glass-tail.wav'));
  const L = new Float32Array(g.n), R = new Float32Array(g.n);
  for (let i = 0; i < g.n; i++) {
    const t = i / SR, p = Math.min(1, Math.max(0, (t - 2.6) / 0.8));
    const k = 10 ** ((-12 * p) / 20);
    L[i] = g.L[i] * k; R[i] = g.R[i] * k;
  }
  writeWav(path.join(OUT, 'glass-tail-s2.wav'), L, R, 24);
}
console.log('stage2 sfx written');
