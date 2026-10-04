// Stage 1 social cut: the 7 NEW cue families, written only into audio-social/stage1/sfx. Same voices/finishing chain as audio-common/sfx-extra.mjs.
// Usage (from project root): node audio-social/stage1/sfx-stage1.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, SVF, Stereo, addMono, reverb, writeWav, peakOf, fadeTail, fadeHead, mtof, sat } from '../../audio-common/lib.mjs';
import * as V from '../../audio-common/voices.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sfx');
fs.mkdirSync(OUT, { recursive: true });
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
// noise whoosh rising f0->f1 whose energy peaks at the very end (p^shape) and is cut by the caller's tail fade
const riseWhoosh = (dur, f0, f1, seed, shape = 2.2, q = 1.8) => {
  const o = new Float32Array(N(dur)); const n = V.noiseSrc(seed); const f = new SVF();
  for (let i = 0; i < o.length; i++) { const p = i / o.length; f.run(n(), f0 * (f1 / f0) ** p, q); o[i] = f.bp * p ** shape; }
  return o;
};
// punchy hit that survives a phone speaker: pitch-dropping sine with saturated harmonics + a mid "knock" and a click
const punch = (f0, f1, tau, dur, drive = 2.4) => {
  const o = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; ph += (TWO_PI * (f1 + (f0 - f1) * Math.exp(-t / 0.035))) / SR;
    o[i] = sat(Math.sin(ph) * Math.exp(-t / tau) * Math.min(1, t / 0.0015), drive);
  }
  return o;
};
const blip = (f0, dur = 0.05, tau = 0.01) => sine(() => f0, (t) => Math.exp(-t / tau) * Math.min(1, t / 0.001), dur);

const S = {};
// (1) hook flash stack: three hits, rising pitch A1 / C2 / E2 fundamentals, each with a 1 kHz-4 kHz click so it reads on a phone
[[55, 440, 2000], [65.4, 523, 2600], [82.4, 659, 3200]].forEach(([fund, knock, clickHz], i) => {
  const o = new Float32Array(N(0.9));
  mixIn(o, punch(fund * 3.2, fund, 0.22, 0.9, 2.6), 0, 1);
  mixIn(o, punch(knock, knock * 0.6, 0.05, 0.25, 1.6), 0, 0.55);
  mixIn(o, click(70 + i, clickHz, knock, 0.08), 0, 0.75);
  S[`hook-flash-${i + 1}`] = o;
});
// white-flash whooshes (rising pitch per flash), transient/peak at the END of the file: cue with lead = file length
[[500, 6500, 91], [700, 8000, 92], [900, 9500, 93]].forEach(([f0, f1, seed], i) => { S[`hook-whoosh-${i + 1}`] = riseWhoosh(0.22, f0, f1, seed); });
// (2) title smash at b3: A-minor stab + sub impact + air burst + short tail
S['title-smash'] = (() => {
  const o = new Float32Array(N(1.4));
  mixIn(o, V.impact(1.2, 1, 94), 0, 0.85);
  mixIn(o, punch(200, 55, 0.3, 1.0, 2.6), 0, 0.8);
  mixIn(o, click(95, 2400, 330, 0.14), 0, 0.9);
  mixIn(o, V.stab([mtof(69), mtof(72), mtof(76), mtof(81)], 0.9, 0.35), 0, 0.55);
  mixIn(o, V.noiseSweep(0.35, 9000, 3000, 0.5, 96, 0, 1.2).map((v, i, a) => v * Math.exp(-i / SR / 0.1) * 1.4), 0, 0.3);
  return o;
})();
// (3) 6-frame (0.2 s) sub hit per payoff freeze: heavy in the sub and saturated so the 2nd/3rd harmonics carry it on small speakers
S['payoff-sub'] = (() => {
  const o = punch(130, 52, 0.07, 0.2, 2.2);
  return fadeTail(o, 0.03);
})();
// (4) loop-return whoosh: 0.5357 s rising sweep + rising A tone, peak at the last sample -> cue so it ends on the end of the film
S['loop-whoosh'] = (() => {
  const d = BEAT, o = riseWhoosh(d, 350, 10000, 97, 1.8, 1.6);
  const n = N(d); let ph = 0;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (TWO_PI * 220 * 4 ** p) / SR; o[i] = o[i] * 1.0 + Math.sin(ph) * p ** 2.2 * 0.22; }
  return o;
})();
// (5) tease lift: a soft, low-passed two-octave riser over 4 beats, swelling into b88 (quiet: music is dimmed under the tease)
S['tease-lift'] = (() => {
  const d = 4 * BEAT, n = N(d), o = V.noiseSweep(d, 250, 3200, 0.55, 98, 2.4, 1.5); let ph = 0, ph2 = 0;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (TWO_PI * mtof(45) * 4 ** p) / SR; ph2 += (TWO_PI * mtof(52) * 4 ** p) / SR; o[i] += (Math.sin(ph) * 0.14 + Math.sin(ph2) * 0.09) * p ** 1.8; }
  return o;
})();
// (6) low-pass breath at b84: an exhale of dark air (LP sweeps down 3.5k -> 250 Hz), peak 0.12 s in
S['tease-breath'] = (() => {
  const d = 1.3, o = new Float32Array(N(d)); const nz = V.noiseSrc(99); const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; f.run(nz(), 250 + 3250 * Math.exp(-t / 0.35), 0.8);
    o[i] = f.lp * Math.min(1, t / 0.12) * Math.exp(-Math.max(0, t - 0.12) / 0.4);
  }
  return o;
})();
// (7) soft ticks for the extra 9:16 cuts: quiet, dry, rising in pitch (choices b13/b15/b17, projection punch, sort macro)
[1500, 1850, 2250].forEach((hz, i) => { S[`soft-tick-${i + 1}`] = mixIn(blip(hz, 0.06, 0.009), blip(hz * 2, 0.03, 0.004), 0, 0.25); });

const WIDE = /whoosh|lift|breath|smash|hook-flash/;
const NOTAIL = /whoosh|lift|soft-tick|payoff-sub|loop/;
for (const [name, m] of Object.entries(S)) {
  const mono = fadeHead(Float32Array.from(m), 0.0005);
  const rvOn = /title-smash|tease-breath/.test(name);
  const st = new Stereo(mono.length / SR + (rvOn ? 0.4 : 0.01));
  addMono(st, mono, 0, 1, 0);
  if (WIDE.test(name) && rvOn) {
    const rv = reverb(st, { decay: 0.7, damp: 0.5, size: 0.8 });
    for (let i = 0; i < st.n; i++) { st.L[i] += rv.L[i] * 0.3; st.R[i] += rv.R[i] * 0.3; }
  }
  const L = st.L.slice(), R = st.R.slice();
  const g = 0.79 / (peakOf(L, R) || 1);
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  // whooshes/lifts end on their peak by design: only a 3 ms declick tail; everything else a 30 ms tail
  const tail = /whoosh|lift|loop/.test(name) ? 0.003 : 0.03;
  fadeTail(L, tail); fadeTail(R, tail);
  writeWav(path.join(OUT, `${name}.wav`), L, R, 24);
}
console.log('stage1 sfx written:', Object.keys(S).length, Object.keys(S).join(' '));
