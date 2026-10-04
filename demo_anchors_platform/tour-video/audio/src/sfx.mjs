// Original SFX for the Anchors 120 s platform tour, synthesized per cue. node src/sfx.mjs <out.wav> <cues.json>
// Cue times come from timing.mjs (timeline.json). Each cue's `t` is the moment the sound is HEARD:
// whoosh peak on the cut, riser arrival on the reveal, transient of hits/pops/clicks/chimes.
import fs from 'node:fs';
import { SR, TWO_PI, SVF, Stereo, reverb, addStereo, writeWav, peakOf, mtof, fadeTail, fadeHead, rng } from './lib.mjs';
import * as V from './voices.mjs';
import * as T from './timing.mjs';

const OUT = process.argv[2] || 'build/sfx_raw.wav';
const CUES = process.argv[3] || 'build/cues.json';
const DUR = T.DUR;
const N = (s) => Math.max(1, Math.round(s * SR));
const noise = (seed) => V.noiseSrc(seed);
const mixIn = (dst, src, at = 0, g = 1) => { const s = N(at); for (let i = 0; i < src.length && s + i < dst.length; i++) dst[s + i] += src[i] * g; return dst; };
const sine = (freqFn, envFn, dur) => { const o = new Float32Array(N(dur)); let ph = 0; for (let i = 0; i < o.length; i++) { const t = i / SR; ph += (TWO_PI * freqFn(t)) / SR; o[i] = Math.sin(ph) * envFn(t); } return o; };
const glassBell = (m, dur, vel = 1) => V.bell(mtof(m), dur, vel, [[1, 1, dur * 0.45], [2.02, 0.3, dur * 0.25], [3.98, 0.12, dur * 0.14], [5.9, 0.04, dur * 0.08]]);
const keyAt = (t) => (t >= T.actStart('Measure') - 0.01 ? 2 : 0); // D major -> E major at Measure (matches the score)
const PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83]; // D major pentatonic

// ---------- voices (all return { buf (mono Float32Array), lead (s before the heard moment), wet (reverb send) }) ----------
function whoosh({ dur = 0.7, peak = 0.6, f0 = 400, f1 = 4200, seed = 1, q = 1.5 }) {
  const o = new Float32Array(N(dur)), n = noise(seed), f = new SVF(), f2 = new SVF();
  for (let i = 0; i < o.length; i++) {
    const p = i / o.length;
    const fc = p < peak ? f0 * (f1 / f0) ** (p / peak) : f1 * (f0 * 1.5 / f1) ** ((p - peak) / (1 - peak));
    const x = n(); f.run(x, fc, q); f2.run(x, fc * 1.9, q * 1.3);
    const e = p < peak ? Math.sin((p / peak) * Math.PI / 2) ** 2.2 : Math.cos(((p - peak) / (1 - peak)) * Math.PI / 2) ** 1.6;
    o[i] = (f.bp + 0.45 * f2.bp) * e;
  }
  return { buf: o, lead: dur * peak, wet: 0.25, sweep: true };
}
function zoom({ seed = 1, key = 0 }) {
  const w = whoosh({ dur: 0.75, peak: 0.62, f0: 250, f1: 2600, seed, q: 1.3 }).buf;
  // tonal "zoom-in" swell (5th of the key rising an octave) + soft landing thump on the cut
  const lead = 0.75 * 0.62;
  mixIn(w, sine((t) => mtof(57 + key) * 2 ** Math.min(1, t / lead), (t) => (t < lead ? (t / lead) ** 2 : Math.exp(-(t - lead) / 0.06)) * 0.12, 0.75), 0, 1);
  mixIn(w, sine((t) => 70 + 40 * Math.exp(-t / 0.03), (t) => Math.exp(-t / 0.09) * Math.min(1, t / 0.003) * 0.35, 0.3), lead, 1);
  return { buf: w, lead, wet: 0.25, sweep: true };
}
function pop({ note = 74, seed = 1 }) {
  const f = mtof(note + 12);
  const o = sine((t) => f * (0.8 + 0.2 * Math.min(1, t / 0.025)), (t) => Math.exp(-t / 0.045) * Math.min(1, t / 0.0015), 0.22);
  const n = noise(seed);
  for (let i = 0; i < N(0.004); i++) o[i] += n() * 0.12 * (1 - i / N(0.004));
  mixIn(o, sine(() => f * 2, (t) => Math.exp(-t / 0.02) * 0.18, 0.1), 0, 1);
  return { buf: fadeTail(o, 0.03), lead: 0, wet: 0.12 };
}
function click({ seed = 1 }) {
  const o = new Float32Array(N(0.06)), n = noise(seed), f = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; f.run(n(), 3200, 0.9); ph += (TWO_PI * 1350) / SR;
    o[i] = (f.bp * 0.7 * Math.exp(-t / 0.0025) + Math.sin(ph) * 0.45 * Math.exp(-t / 0.007)) * Math.min(1, t / 0.0004);
  }
  return { buf: fadeTail(o, 0.01), lead: 0, wet: 0.03 };
}
function riser({ len = 1.5, seed = 1, key = 0, soft = false }) {
  const o = V.noiseSweep(len, 300, soft ? 6000 : 9000, 0.9, seed, 2.3, 2.2);
  let ph = 0; const n = o.length;
  for (let i = 0; i < n; i++) { const p = i / n; ph += (mtof(57 + key) * 2 ** (p * 1.5)) / SR; o[i] += (2 * (ph % 1) - 1) * p ** 2.6 * 0.1 + Math.sin(TWO_PI * ph * 0.5) * p ** 2 * 0.12; }
  fadeHead(o, 0.05); fadeTail(o, 0.012);
  return { buf: o, lead: len, wet: 0.35 };
}
function swell({ len = 1.4, seed = 1 }) {
  const o = V.noiseSweep(len, 1500, 9000, 0.8, seed, 3.2, 1.0);
  fadeTail(o, 0.01);
  return { buf: o, lead: len, wet: 0.5 };
}
function impact({ seed = 1 }) {
  const o = V.impact(1.5, 1, seed);
  mixIn(o, sine((t) => 44 + 20 * Math.exp(-t / 0.05), (t) => Math.exp(-t / 0.45) * Math.min(1, t / 0.004) * 0.6, 1.4), 0, 1);
  return { buf: fadeTail(o, 0.1), lead: 0, wet: 0.2 };
}
function hit({ k = 0, last = false }) {
  const o = new Float32Array(N(last ? 1.4 : 0.9));
  mixIn(o, V.impact(last ? 1.4 : 0.85, 1, 700 + k), 0, 0.9);
  const n = noise(800 + k), f = new SVF();
  for (let i = 0; i < N(0.08); i++) { const t = i / SR; f.run(n(), 2400, 0.8); o[i] += f.bp * Math.exp(-t / 0.018) * 1.1; }
  mixIn(o, sine((t) => 52 + 60 * Math.exp(-t / 0.025), (t) => Math.exp(-t / (last ? 0.4 : 0.22)) * Math.min(1, t / 0.002), last ? 1.2 : 0.7), 0, 0.8);
  return { buf: fadeTail(o, 0.05), lead: 0, wet: 0.25 };
}
function success({ big, key }) {
  const notes = big ? [74, 78, 81, 86] : [81, 86];
  const o = new Float32Array(N(2.6));
  notes.forEach((m, i) => mixIn(o, glassBell(m + key, 2.2, 0.7), i * 0.075, 1));
  if (big) {
    mixIn(o, V.stab([62, 66, 69, 74].map((m) => mtof(m + key)), 0.5, 0.5), 0, 0.35);
    mixIn(o, glassBell(93 + key, 1.8, 0.25), 0.3, 1);
  }
  return { buf: fadeTail(o, 0.2), lead: 0, wet: 0.5 };
}
function bell({ key }) {
  const o = new Float32Array(N(1.6));
  mixIn(o, glassBell(86 + key, 1.4, 0.6), 0, 1);
  mixIn(o, glassBell(81 + key, 1.4, 0.35), 0.06, 1);
  return { buf: fadeTail(o, 0.1), lead: 0, wet: 0.5 };
}
function sting({ key }) {
  const lead = 0.28;
  const o = new Float32Array(N(lead + 4.6));
  mixIn(o, whoosh({ dur: lead + 0.12, peak: lead / (lead + 0.12), f0: 300, f1: 5000, seed: 909 }).buf, 0, 0.6);
  mixIn(o, V.impact(2.2, 0.9, 910), lead, 1);
  [62, 69, 74, 78, 81].forEach((m, i) => mixIn(o, glassBell(m + key + 12, 4.4, 0.32), lead + i * 0.03, 1));
  const cym = V.cymbalSwell(3.2, 0.5, 43).map((v, i) => v * Math.exp(-Math.max(0, i / SR - 0.5) / 0.6));
  mixIn(o, cym, lead - 0.15, 0.6);
  return { buf: fadeTail(o, 0.4), lead, wet: 0.45 };
}

// ---------- per-type mix settings: gain (linear) and music duck (dB, hold s, release s) ----------
const TYPE = {
  hit: { gain: 0.9, duck: [-5, 0.15, 0.35] },
  whoosh: { gain: 0.6, duck: [-3, 0.1, 0.3] },
  zoom: { gain: 0.62, duck: [-3, 0.12, 0.35] },
  swell: { gain: 0.8, duck: [-3, 0.1, 0.5] },
  riser: { gain: 0.4, duck: [-3, 0.05, 0.4] },
  pop: { gain: 0.45, duck: [-3, 0.05, 0.15] },
  click: { gain: 0.55, duck: [-3, 0.03, 0.1] },
  impact: { gain: 0.65, duck: [-4.5, 0.4, 0.7] },
  success: { gain: 0.65, duck: [-4, 0.6, 0.8] },
  bell: { gain: 0.5, duck: [-3, 0.3, 0.5] },
  sting: { gain: 0.8, duck: [-5, 0.8, 1.2] },
};

const cues = T.sfxCues();
const dry = new Stereo(DUR + 1), send = new Stereo(DUR + 1);
let popIdx = 0, wIdx = 0;
const PAN_X = (x) => Math.max(-0.45, Math.min(0.45, ((x ?? 960) / 1920 - 0.5) * 0.9));
const out = [];
for (const c of cues) {
  const key = keyAt(c.t);
  let v, pan = 0, gain = TYPE[c.type].gain;
  switch (c.type) {
    case 'hit': v = hit(c); pan = 0; if (c.last) gain *= 1.1; break;
    case 'whoosh': v = c.inHook ? whoosh({ dur: 0.42, peak: 0.8, f0: 600, f1: 5000, seed: 300 + wIdx }) : whoosh({ dur: 0.7, peak: 0.6, f0: 350 + 50 * (wIdx % 3), f1: 3800 + 400 * (wIdx % 4), seed: 300 + wIdx }); if (c.inHook) gain *= 0.7; wIdx++; break;
    case 'zoom': v = zoom({ seed: 400 + wIdx, key }); wIdx++; break;
    case 'swell': v = swell({ len: 1.4, seed: 500 }); break;
    case 'riser': v = riser({ len: c.len ?? 1.5, seed: 600 + Math.round(c.t), key, soft: c.soft }); if (c.soft) gain *= 0.8; break;
    case 'pop': { // pentatonic walk in the current key, gentle stereo spread
      const seq = [5, 7, 6, 8, 5, 4, 6, 7];
      v = pop({ note: PENTA[seq[popIdx % seq.length]] + key, seed: 50 + popIdx });
      const sh = T.shots.find((s) => Math.abs(s.tIn + 0.15 - c.t) < 0.01);
      pan = sh?.callTarget ? PAN_X(sh.callTarget.x + sh.callTarget.w / 2) * 0.6 : 0;
      popIdx++; break;
    }
    case 'click': v = click({ seed: 80 + Math.round(c.t * 10) }); pan = PAN_X(c.x) * 0.6; break;
    case 'impact': v = impact({ seed: 23 + Math.round(c.t) }); gain *= c.gain ?? 1; break;
    case 'success': v = success({ big: c.big, key }); if (!c.big) gain *= 0.8; break;
    case 'bell': v = bell({ key }); break;
    case 'sting': v = sting({ key: 2 }); break;
  }
  const start = c.t - v.lead;
  // where the cue is actually heard, measured on its own rendered buffer: envelope peak (10 ms RMS) for sweeps,
  // end for risers/swells, first sample above 30 % of the first 150 ms peak for transients
  let heardOff;
  if (['riser', 'swell'].includes(c.type)) { let m = 0, at = 0; const w = Math.round(0.01 * SR); for (let i = 0; i + w <= v.buf.length; i += w) { let s2 = 0; for (let j = i; j < i + w; j++) s2 += v.buf[j] ** 2; if (s2 >= m) { m = s2; at = (i + w) / SR; } } heardOff = at; }
  else if (v.sweep) { let m = 0, at = 0; const w = Math.round(0.01 * SR); for (let i = 0; i + w <= v.buf.length; i += w / 2) { let s2 = 0; for (let j = i; j < i + w; j++) s2 += v.buf[j] ** 2; if (s2 > m) { m = s2; at = (i + w / 2) / SR; } } heardOff = at; }
  else { const a0 = Math.round(v.lead * SR), a1 = Math.min(v.buf.length, a0 + Math.round(0.15 * SR)); let m = 0; for (let i = a0; i < a1; i++) m = Math.max(m, Math.abs(v.buf[i])); heardOff = v.lead; for (let i = a0; i < a1; i++) if (Math.abs(v.buf[i]) > 0.3 * m) { heardOff = i / SR; break; } }
  const a = ((pan + 1) * Math.PI) / 4;
  const s0 = Math.round(start * SR);
  for (let i = 0; i < v.buf.length; i++) {
    const j = s0 + i; if (j < 0 || j >= dry.n) continue;
    let gl = Math.cos(a) * Math.SQRT2, gr = Math.sin(a) * Math.SQRT2;
    if (v.sweep) { const p = i / v.buf.length, d = (wIdx % 2 ? 1 : -1) * 0.5 * (p - 0.5); const aa = ((d + 1) * Math.PI) / 4; gl = Math.cos(aa) * Math.SQRT2; gr = Math.sin(aa) * Math.SQRT2; }
    const x = v.buf[i] * gain;
    dry.L[j] += x * gl; dry.R[j] += x * gr;
    send.L[j] += x * gl * v.wet; send.R[j] += x * gr * v.wet;
  }
  out.push({ t: c.t, start: +start.toFixed(4), heard: +(start + heardOff).toFixed(4), type: c.type, gain: +gain.toFixed(3), duck: TYPE[c.type].duck, reason: c.reason });
}
addStereo(dry, reverb(send, { decay: 0.8, damp: 0.45, pre: 0.01, size: 1.1 }), 0, 0.6);
// DC/rumble high-pass, fade to digital silence 0.08 s before the end (same as the score)
const nOut = Math.round(DUR * SR), L = new Float32Array(nOut), R = new Float32Array(nOut);
const hpk = Math.exp((-2 * Math.PI * 25) / SR); let hl = 0, hr = 0;
const FADE_A = T.END_T + 2.0, FADE_B = DUR - 0.08;
for (let i = 0; i < nOut; i++) {
  const t = i / SR;
  let l = dry.L[i], r = dry.R[i];
  hl = hpk * hl + (1 - hpk) * l; hr = hpk * hr + (1 - hpk) * r; l -= hl; r -= hr;
  const g = t < FADE_A ? 1 : t >= FADE_B ? 0 : 0.5 * (1 + Math.cos(Math.PI * (t - FADE_A) / (FADE_B - FADE_A)));
  L[i] = l * g; R[i] = r * g;
}
// fixed raw-stem scale (headroom for 24-bit file); mix.mjs balances the buses
const RAW_SCALE = 0.4;
for (let i = 0; i < nOut; i++) { L[i] *= RAW_SCALE; R[i] *= RAW_SCALE; }
if (peakOf(L, R) >= 1) throw new Error('sfx raw stem would clip');
writeWav(OUT, L, R, 24);
fs.writeFileSync(CUES, JSON.stringify(out, null, 1));
const counts = out.reduce((m, c) => ((m[c.type] = (m[c.type] ?? 0) + 1), m), {});
console.log('sfx rendered', OUT, 'peak', peakOf(L, R).toFixed(3), 'cues', out.length, JSON.stringify(counts));
