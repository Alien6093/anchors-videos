// Film B v2 one-shots, rendered into audio-B/sfx (stereo, 48k, 24-bit, peak 0.79 like the shared set):
//  title-thump : 150-400 Hz body + ~20 ms 2-4 kHz transient, layered on the 2.143 title sub hit so it reads on phone speakers
//  pad-swell   : soft Am9 pad, 4.3 s, slow swell (cued at 51.4, gone by 55.7)
//  counter-ramp-B0-v2 : the shared teaser ramp with +6.5 dB on the first 0.9 s (eased back to unity by 1.25 s so the 1.5 s glass landing and its tail keep the v1 level)
//  mid-tick    : short ~1.1 kHz woodblock tick for the first-second beats (0.536, 1.071)
// node audio-B/sfx-v2.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, SVF, Stereo, addMono, reverb, writeWav, readWav, peakOf, fadeTail, fadeHead, mtof, rng } from '../audio-common/lib.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sfx');
const N = (s) => Math.round(s * SR);
const noise = (seed) => { const r = rng(seed); return () => r() * 2 - 1; };

const thump = () => {
  const o = new Float32Array(N(0.7));
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph += (TWO_PI * (150 + 250 * Math.exp(-t / 0.05))) / SR; // 400 -> 150 Hz
    o[i] = Math.sin(ph) * Math.exp(-t / 0.11) * Math.min(1, t / 0.002);
  }
  const n = noise(91), bp = new SVF();
  for (let i = 0; i < N(0.02); i++) { // ~20 ms 2-4 kHz transient
    bp.run(n(), 3000, 0.9);
    o[i] += bp.bp * 1.6 * Math.exp(-(i / SR) / 0.007) * Math.min(1, (i / SR) / 0.0005);
  }
  return o;
};

const padSwell = () => {
  const dur = 4.3, len = N(dur);
  const L = new Float32Array(len), R = new Float32Array(len);
  const notes = [[57, -0.5], [60, 0.4], [64, -0.3], [71, 0.5], [76, 0.2]]; // A3 C4 E4 B4(add9) E5
  notes.forEach(([m, pan], k) => {
    [-0.07, 0.07].forEach((cents, d) => {
      const f = mtof(m) * 2 ** (cents / 12 / 12);
      const flt = new SVF();
      let ph = k * 1.3 + d;
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        ph += (TWO_PI * f) / SR;
        const saw = ((ph / TWO_PI) % 1) * 2 - 1;
        flt.run(saw * 0.6 + Math.sin(ph) * 0.4, 1300, 0.7);
        const env = t < 2.9 ? Math.sin((t / 2.9) * Math.PI / 2) ** 2 : Math.cos(Math.min(1, (t - 2.9) / 1.4) * Math.PI / 2) ** 1.5;
        const v = flt.lp * env * (m > 70 ? 0.5 : 1) * 0.16;
        const gl = pan + (d ? 0.3 : -0.3) < 0 ? 1 : 0.6, gr = pan + (d ? 0.3 : -0.3) > 0 ? 1 : 0.6;
        L[i] += v * gl; R[i] += v * gr;
      }
    });
  });
  const st = new Stereo(dur);
  st.L.set(L); st.R.set(R);
  const rv = reverb(st, { decay: 0.8, damp: 0.5, size: 1 });
  for (let i = 0; i < len; i++) { st.L[i] += rv.L[i] * 0.3; st.R[i] += rv.R[i] * 0.3; }
  return st;
};

const midTick = () => {
  const o = new Float32Array(N(0.12));
  const n = noise(92), hp = new SVF();
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    hp.run(n(), 2200, 1.2);
    o[i] = (Math.sin(TWO_PI * 1100 * t) * Math.exp(-t / 0.03) + 0.35 * Math.sin(TWO_PI * 2200 * t) * Math.exp(-t / 0.015) + hp.hp * 0.5 * Math.exp(-t / 0.004)) * Math.min(1, t / 0.001);
  }
  return o;
};

const write = (name, stereo, normalize = true) => {
  const L = stereo.L.slice(), R = stereo.R.slice();
  const g = normalize ? 0.79 / (peakOf(L, R) || 1) : 1;
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  fadeHead(L, 0.001); fadeHead(R, 0.001); fadeTail(L, 0.03); fadeTail(R, 0.03);
  writeWav(path.join(OUT, `${name}.wav`), L, R, 24);
};
const mono = (m) => { const st = new Stereo(m.length / SR); addMono(st, m, 0, 1, 0); return st; };

const RAMP_BOOST_DB = 6.5, RAMP_FULL_S = 0.9, RAMP_UNITY_S = 1.25;
const boostedRamp = () => {
  const w = readWav(path.join(path.dirname(OUT), '../audio-common/sfx/counter-ramp-B0.wav'));
  const st = new Stereo(w.n / SR);
  for (let i = 0; i < w.n; i++) {
    const t = i / SR, k = Math.min(1, Math.max(0, (t - RAMP_FULL_S) / (RAMP_UNITY_S - RAMP_FULL_S)));
    const g = 10 ** ((RAMP_BOOST_DB * (1 - k * k * (3 - 2 * k))) / 20);
    st.L[i] = w.L[i] * g; st.R[i] = w.R[i] * g;
  }
  return st;
};

write('title-thump', mono(thump()));
write('pad-swell', padSwell());
write('mid-tick', mono(midTick()));
write('counter-ramp-B0-v2', boostedRamp(), false); // level-preserving: keeps the v1 landing level
console.log('v2 sfx written: title-thump, pad-swell, mid-tick, counter-ramp-B0-v2');
