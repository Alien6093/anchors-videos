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

// ---- v4 additions ----
const glassBell = (m, dur, vel = 1) => V.bell(mtof(m), dur, vel, [[1, 1, dur * 0.45], [2.02, 0.3, dur * 0.25], [3.98, 0.12, dur * 0.14], [5.9, 0.05, dur * 0.08]]);
const tickRamp = (dur, iv0, iv1, f0, f1, tail) => {
  const o = new Float32Array(N(dur + tail));
  let t = 0;
  while (t < dur) { const p = t / dur; mixIn(o, blip(f0 * (f1 / f0) ** p, 0.05, 0.008, 0.25), t, 0.3 + 0.7 * p); t += iv0 * (iv1 / iv0) ** p; }
  return o;
};
[0, 1, 2].forEach((i) => { S[`chip-click-${i + 1}`] = mixIn(click(20 + i, 2600 + 250 * i, 700 + 120 * i, 0.08), blip(1500 + 300 * i, 0.08, 0.02, 0.2), 0.004, 0.4); });
S['spinner-loop'] = (() => {
  const o = new Float32Array(N(1.9));
  for (let k = 0; k * 0.11 < 1.85; k++) { const w = Math.sin(Math.PI * (k * 0.11) / 1.9); mixIn(o, blip(k % 2 ? 2300 : 1900, 0.03, 0.006, 0.2), k * 0.11, 0.6 * w); }
  return o;
})();
S['counter-ramp-teaser'] = (() => { const o = tickRamp(1.2, 0.12, 0.02, 1500, 3800, 0.3); return mixIn(o, glassBell(96, 0.25, 0.8), 1.2, 0.7); })();
S['counter-ramp-metrics'] = (() => { const o = tickRamp(1.7, 0.14, 0.025, 900, 3200, 1.6); mixIn(o, glassBell(96, 1.5, 0.9), 1.7, 0.8); return mixIn(o, glassBell(88, 1.5, 0.5), 1.7, 0.6); })();
S['smash-hit'] = (() => { const o = V.impact(0.6, 1); mixIn(o, click(60, 1200, 180, 0.2), 0, 0.8); return mixIn(o, whoosh(0.15, 3000, 9000, 61, 0.3, 1), 0, 0.5); })();
S['lock-glass'] = (() => { const o = mixIn(click(13, 1800, 500, 0.15), sine((t) => 200, (t) => Math.exp(-t / 0.05) * 0.5, 0.12), 0.012, 1); const g = new Float32Array(N(0.7)); mixIn(g, o, 0, 1); return mixIn(g, glassBell(96, 0.6, 0.7), 0.02, 0.7); })();
S['sort-swish'] = whoosh(0.35, 1500, 5000, 62, 0.5, 1.4);
S['panel-whoosh'] = whoosh(0.6, 300, 2200, 63, 0.45, 1.2);
S['credit-coin'] = (() => { const o = V.bell(mtof(93), 0.6, 1, [[1, 1, 0.12], [1.504, 0.7, 0.16], [2.51, 0.35, 0.08], [3.9, 0.15, 0.05]]); return mixIn(o, click(62, 3000, 800, 0.04), 0, 0.4); })();
S['bar-tick'] = blip(1500, 0.07, 0.015, 0.3);
S['digit-roll-impact'] = (() => { const o = V.impact(1.4, 1); mixIn(o, click(64, 1500, 200, 0.05), 0, 0.6); return mixIn(o, blip(660, 0.3, 0.1, 0.3), 0.02, 0.4); })();
S['cell-tick'] = blip(2400, 0.06, 0.012, 0.25);
[81, 84, 88, 91, 93, 96].forEach((m, i) => { S[`label-ping-${i + 1}`] = glassBell(m, 0.7, 0.6); });
S['highlight-ping'] = glassBell(88, 0.7, 0.7);
S['attach-clip'] = mixIn(click(65, 2200, 600, 0.1), blip(900, 0.07, 0.02, 0.2), 0.01, 0.4);
S['pay-click'] = (() => { const o = click(66, 1800, 420, 0.2); mixIn(o, sine((t) => 170, (t) => Math.exp(-t / 0.06) * 0.5, 0.15), 0, 1); return mixIn(o, blip(1100, 0.12, 0.03, 0.3), 0.01, 0.5); })();
S['payment-chime'] = (() => { const o = glassBell(84, 3.0, 1); return mixIn(o, glassBell(96, 2.0, 0.25), 0, 1); })();
S['check-stroke-tick'] = blip(2600, 0.05, 0.01, 0.2);
S['whip-reverse'] = (() => { const o = V.noiseSweep(0.5, 400, 8000, 1, 67, 3, 1.6); return mixIn(o, click(68, 2500, 300, 0.05), 0.44, 0.7); })();
S['avatar-chime'] = (() => { const o = new Float32Array(N(1.8)); [[84, 0, 0.7], [88, 0.08, 0.6], [91, 0.16, 0.55], [96, 0.24, 0.45]].forEach(([m, at, v]) => mixIn(o, glassBell(m, 1.5, v), at, 1)); return o; })();
S['stamp-thud'] = mixIn(sine((t) => 110 - 40 * Math.min(1, t / 0.05), (t) => Math.exp(-t / 0.06) * Math.min(1, t / 0.002), 0.2), click(69, 900, 150, 0.04), 0, 0.5);
S['check-tick'] = blip(2000, 0.06, 0.012, 0.2);
[[76, 83], [79, 86], [81, 88]].forEach(([a, b], i) => { S[`bright-stab-${i + 1}`] = V.stab([mtof(a), mtof(b)], 1, 0.3); });
[81, 84, 88, 91, 93].forEach((m, i) => { S[`approve-chime-${i + 1}`] = glassBell(m, 1.3, 0.8); });
S['cross-thud'] = mixIn(sine((t) => 95 - 30 * Math.min(1, t / 0.08), (t) => Math.exp(-t / 0.09) * Math.min(1, t / 0.002), 0.3), click(70, 700, 120, 0.05), 0, 0.4);
S['send-blip'] = sine((t) => 1300 + 700 * Math.min(1, t / 0.05), (t) => Math.exp(-t / 0.05) * Math.min(1, t / 0.002), 0.2).map((v, i) => v + 0.3 * Math.sin(TWO_PI * 3000 * (i / SR)) * Math.exp(-(i / SR) / 0.03));
S['gold-impact'] = (() => {
  const o = V.impact(2.4, 1);
  mixIn(o, sine((t) => 45, (t) => Math.exp(-t / 0.7) * 0.7, 2.2), 0, 1);
  mixIn(o, V.stab([48, 55, 60, 64, 67, 72].map(mtof), 0.6, 0.8), 0, 0.45);
  return mixIn(o, glassBell(96, 1.6, 0.4), 0.02, 0.6);
})();
S['riser-long'] = (() => {
  const a = V.noiseSweep(1.5, 300, 9000, 0.9, 71, 2.4); let ph = 0; const n = N(1.5);
  for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(60) * 2 ** (p * 2)) / SR; a[i] += (2 * (ph % 1) - 1) * p ** 2.5 * 0.18; }
  return a;
})();
S['cymbal-swell'] = V.cymbalSwell(5, 1, 43);
[79, 84, 88, 91].forEach((m, i) => { S[`live-ping-${i + 1}`] = V.bell(mtof(m), 0.6, 0.6, [[1, 1, 0.16], [2, 0.3, 0.09], [3, 0.1, 0.05]]); });
S['tile-tick'] = blip(1900, 0.06, 0.012, 0.2);
S['bar-fill'] = whoosh(0.9, 600, 2600, 72, 0.7, 1.3);
S['panel-tick'] = blip(1500, 0.07, 0.014, 0.25);
S['morph-swish'] = whoosh(0.5, 2500, 700, 73, 0.4, 1.3);
S['key-change-swell'] = V.pad([48, 55, 64, 71, 74].map(mtof), 1.4, 0.8, 3000, 1.0, 0.8, 5);

// Stereo width + space for select effects, then normalize + tail fade
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
console.log('sfx written:', Object.keys(S).length);
