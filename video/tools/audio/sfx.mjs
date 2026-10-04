// Renders every individual SFX to public/audio/sfx/*.wav (stereo, 48k, 24-bit, peak-normalized).
import fs from 'node:fs';
import path from 'node:path';
import { SR, TWO_PI, SVF, Stereo, addMono, reverb, writeWav, peakOf, fadeTail, fadeHead, mtof } from './lib.mjs';
import * as V from './voices.mjs';

const OUT = path.resolve(process.argv[2] || 'public/audio/sfx');
fs.mkdirSync(OUT, { recursive: true });
const N = (s) => Math.round(s * SR);
const sine = (freqFn, envFn, dur) => {
  const o = new Float32Array(N(dur)); let ph = 0;
  for (let i = 0; i < o.length; i++) { const t = i / SR; ph += (TWO_PI * freqFn(t)) / SR; o[i] = Math.sin(ph) * envFn(t); }
  return o;
};
const noise = (seed) => V.noiseSrc(seed);
const mixIn = (dst, src, at = 0, g = 1) => { const s = N(at); for (let i = 0; i < src.length && s + i < dst.length; i++) dst[s + i] += src[i] * g; return dst; };

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
    const e = Math.sin(Math.PI * Math.min(1, p / (peak * 2)) * (p < peak ? 0.5 : 0) + (p < peak ? 0 : Math.PI / 2 + ((p - peak) / (1 - peak)) * Math.PI / 2 - Math.PI / 2));
    const env = p < peak ? Math.sin((p / peak) * Math.PI / 2) : Math.cos(((p - peak) / (1 - peak)) * Math.PI / 2);
    o[i] = f.bp * env ** 1.5; void e;
  }
  return o;
};
const blip = (f0, dur = 0.12, tau = 0.04, h2 = 0.4) =>
  sine((t) => f0, (t) => Math.exp(-t / tau) * Math.min(1, t / 0.002), dur).map((v, i) => v + h2 * Math.sin(TWO_PI * f0 * 2 * (i / SR)) * Math.exp(-(i / SR) / (tau * 0.6)));
const pop = (f0, f1, dur = 0.14) => {
  const o = sine((t) => f0 + (f1 - f0) * Math.min(1, t / 0.05), (t) => Math.exp(-t / 0.04) * Math.min(1, t / 0.001), dur);
  const n = noise(3); for (let i = 0; i < N(0.006); i++) o[i] += n() * 0.3 * (1 - i / N(0.006));
  return o;
};

const S = {}; // name -> mono or {L,R}

S['keyboard-click-1'] = click(1, 2500, 320);
S['keyboard-click-2'] = click(2, 3200, 380);
S['keyboard-click-3'] = click(3, 2000, 280);
S['enter-thock'] = (() => {
  const o = sine((t) => 150 - 60 * Math.min(1, t / 0.08), (t) => Math.exp(-t / 0.07), 0.25);
  return mixIn(o, click(4, 1500, 200, 0.05), 0, 0.5);
})();
S['bubble-whoosh'] = (() => {
  const w = whoosh(0.55, 500, 3200, 5, 0.4, 1.4);
  return mixIn(w, sine((t) => 300 + 700 * Math.min(1, t / 0.2), (t) => Math.exp(-t / 0.1) * 0.5, 0.4), 0.05);
})();
S['tool-blip'] = blip(1320, 0.14, 0.045);
S['widget-whoosh'] = whoosh(0.75, 300, 3800, 6, 0.55, 1.2);
S['field-tick'] = blip(2100, 0.07, 0.014, 0.3);
S['tab-click'] = mixIn(click(7, 2500, 900, 0.12), blip(1600, 0.08, 0.02, 0.2), 0.008, 0.3);
S['card-tap'] = sine((t) => 880, (t) => Math.exp(-t / 0.018) * Math.min(1, t / 0.001), 0.08).map((v, i) => v * 0.8 + click(8, 3000, 500, 0.08)[i] * 0.3);
S['counter-tick'] = blip(3000, 0.05, 0.008, 0.2);
for (let i = 0; i < 6; i++) S[`counter-tick-r${i + 1}`] = blip(1800 * 2 ** (i / 6 * 1.2), 0.06, 0.01, 0.25);
S['riser'] = (() => {
  const a = V.noiseSweep(1.0, 300, 7000, 0.9, 41, 2);
  const n = N(1.0); let ph = 0;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(64) * 2 ** (p * 2)) / SR; a[i] += (2 * (ph % 1) - 1) * p ** 2.5 * 0.15; }
  return a;
})();
S['riser-soft'] = V.noiseSweep(0.5, 500, 5000, 0.6, 42, 2);
[69, 72, 74, 76, 79, 81, 84, 88].forEach((m, i) => { S[`pill-flip-tick-${i + 1}`] = blip(mtof(m + 12), 0.16, 0.035, 0.35); });
S['pill-flip-tick'] = S['pill-flip-tick-1'];
S['card-whoosh'] = whoosh(0.5, 2200, 500, 9, 0.35, 1.3);
S['toggle-click'] = (() => { const o = click(10, 2800, 700, 0.12); return mixIn(o, click(11, 3200, 900, 0.06), 0.03, 0.6); })();
S['approve-chime-soft'] = V.bell(mtof(88), 1.4, 0.6);
S['approve-chime-soft-high'] = V.bell(mtof(91), 1.4, 0.6);
S['note-blip'] = sine((t) => 660 * (1 + 0.004 * Math.sin(TWO_PI * 6 * t)), (t) => Math.exp(-t / 0.09) * Math.min(1, t / 0.004), 0.3)
  .map((v, i) => v + 0.3 * Math.sin(TWO_PI * 990 * (i / SR)) * Math.exp(-(i / SR) / 0.05));
S['approve-chime-big'] = (() => {
  const o = new Float32Array(N(2.4));
  [[81, 0], [84, 0.07], [88, 0.14], [93, 0.21]].forEach(([m, at]) => mixIn(o, V.bell(mtof(m), 2.2, 0.6), at, 0.7));
  mixIn(o, V.stab([57, 64, 69, 72, 76].map(mtof), 0.6, 0.6), 0, 0.5);
  mixIn(o, sine((t) => 110, (t) => Math.exp(-t / 0.5) * 0.6, 1.2), 0, 0.6);
  return o;
})();
S['green-tick'] = blip(1760, 0.09, 0.02, 0.3);
S['low-impact'] = V.impact(1.6, 1);
S['calendar-pop'] = pop(420, 950);
S['confirm-chime'] = (() => { const o = V.bell(mtof(88), 1.6, 0.6); return mixIn(o, V.bell(mtof(95), 1.4, 0.6), 0.12, 0.8); })();
S['live-ping'] = V.bell(mtof(91), 0.5, 0.6, [[1, 1, 0.14], [2, 0.3, 0.08], [3, 0.1, 0.05]]);
S['reaction-pop'] = pop(520, 1100, 0.16);
S['logo-hit'] = (() => {
  const o = new Float32Array(N(2.4));
  mixIn(o, whoosh(0.5, 250, 4500, 12, 0.85, 1.5), 0, 0.8);
  mixIn(o, V.impact(1.8, 0.9), 0.48, 0.9);
  [57, 64, 69, 72].forEach((m) => mixIn(o, V.bell(mtof(m + 12), 1.8, 0.5), 0.48, 0.4));
  return o;
})();
S['glass-tail'] = (() => {
  const o = new Float32Array(N(3.4)); const parts = [1760, 2637, 3520, 4186, 5274];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; let x = 0;
    parts.forEach((f, k) => { x += Math.sin(TWO_PI * f * t + 0.6 * Math.sin(TWO_PI * (0.3 + 0.1 * k) * t)) * (0.6 / (k + 1)) * (0.6 + 0.4 * Math.sin(TWO_PI * (0.5 + 0.13 * k) * t)); });
    o[i] = x * Math.min(1, t / 0.15) * Math.exp(-t / 1.1);
  }
  return o;
})();
S['lock-click'] = mixIn(click(13, 1800, 500, 0.15), sine((t) => 200, (t) => Math.exp(-t / 0.05) * 0.5, 0.12), 0.012, 1);
S['word-tick'] = sine((t) => 700, (t) => Math.exp(-t / 0.02) * Math.min(1, t / 0.001), 0.09).map((v, i) => v + 0.5 * click(14, 1500, 250, 0.09)[i]);
S['sub-hit'] = sine((t) => 40 + 30 * Math.exp(-t / 0.08), (t) => Math.exp(-t / 0.35) * Math.min(1, t / 0.004), 1.2);
S['reverse-swell'] = (() => {
  const src = V.noiseSweep(0.5, 300, 6000, 1, 15, 3.5, 2);
  const n = N(0.5); const ph = { v: 0 };
  for (let i = 0; i < n; i++) { const p = i / n; ph.v += (mtof(45) * 2 ** (p * 1.5)) / SR; src[i] += Math.sin(TWO_PI * ph.v) * p ** 3 * 0.5; }
  return src;
})();

// Stereo width for select effects, then normalize + tail fade
const stereoize = (m, name) => {
  const st = new Stereo(m.length / SR + 0.01);
  const wide = ['bubble-whoosh', 'widget-whoosh', 'card-whoosh', 'riser', 'riser-soft', 'approve-chime-big', 'logo-hit', 'glass-tail', 'reverse-swell', 'confirm-chime'];
  addMono(st, m, 0, 1, 0);
  if (wide.includes(name) || name.startsWith('approve-chime')) {
    const rv = reverb(st, { decay: 0.7, damp: 0.5, size: 0.8 });
    for (let i = 0; i < st.n; i++) { st.L[i] += rv.L[i] * 0.35; st.R[i] += rv.R[i] * 0.35; }
  }
  return st;
};
for (const [name, m] of Object.entries(S)) {
  const mono = fadeHead(Float32Array.from(m), 0.001);
  const st = stereoize(mono, name);
  const n = Math.min(st.n, mono.length + (name.includes('chime') || name === 'logo-hit' ? N(0.3) : 0));
  const L = st.L.slice(0, n), R = st.R.slice(0, n);
  const g = 0.79 / (peakOf(L, R) || 1);
  for (let i = 0; i < n; i++) { L[i] *= g; R[i] *= g; }
  fadeTail(L, 0.02); fadeTail(R, 0.02);
  writeWav(path.join(OUT, `${name}.wav`), L, R, 24);
}
console.log('sfx written:', Object.keys(S).length);
