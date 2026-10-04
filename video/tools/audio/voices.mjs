// Mono instrument voices shared by music and SFX. Every voice returns Float32Array.
import { SR, TWO_PI, SVF, mtof, rng, env, sat, fadeTail, fadeHead } from './lib.mjs';

const len = (s) => Math.max(1, Math.round(s * SR));
const noiseSrc = (seed) => { const r = rng(seed); return () => r() * 2 - 1; };
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));

export function kick(vel = 1, seed = 1) {
  const o = new Float32Array(len(0.5));
  let ph = 0;
  const n = noiseSrc(seed);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 48 + 90 * Math.exp(-t / 0.028);
    ph += (TWO_PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.16);
    const click = n() * Math.exp(-t / 0.003) * 0.25;
    o[i] = sat((body + click) * 1.4, 1.3) * vel;
  }
  return fadeTail(o, 0.02);
}

export function subNote(freq, dur, vel = 1) {
  const o = new Float32Array(len(dur + 0.15));
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    ph += (TWO_PI * freq) / SR;
    const e = env.adsr(i, 0.012, 0.1, 0.8, dur, 0.12);
    o[i] = sat(Math.sin(ph) + 0.18 * Math.sin(2 * ph), 1.4) * e * vel;
  }
  return o;
}

// detuned saw bass through resonant lowpass
export function bassSaw(freq, dur, vel = 1, cutoff = 700) {
  const o = new Float32Array(len(dur + 0.1));
  const f = new SVF();
  let p1 = 0, p2 = 0.3;
  for (let i = 0; i < o.length; i++) {
    p1 += (freq * 1.003) / SR; p2 += (freq * 0.997) / SR;
    const x = (saw(p1) + saw(p2)) * 0.5;
    const t = i / SR;
    f.run(x, 180 + cutoff * Math.exp(-t / 0.12), 1.4);
    o[i] = sat(f.lp * 1.6, 1.5) * env.adsr(i, 0.005, 0.1, 0.7, dur, 0.06) * vel;
  }
  return o;
}

// muted pluck: detuned saw+square, fast filter decay
export function pluck(freq, vel = 1, dur = 0.35) {
  const o = new Float32Array(len(dur + 0.1));
  const f = new SVF();
  let p1 = 0, p2 = 0.2, p3 = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    p1 += (freq * 1.004) / SR; p2 += (freq * 0.996) / SR; p3 += freq / SR;
    const sq = p3 % 1 < 0.5 ? 1 : -1;
    const x = saw(p1) * 0.45 + saw(p2) * 0.45 + sq * 0.2;
    f.run(x, 350 + 3800 * Math.exp(-t / 0.07), 1.1);
    o[i] = f.lp * Math.exp(-t / 0.13) * vel;
  }
  return fadeTail(o, 0.02);
}

// FM marimba / mallet
export function marimba(freq, vel = 1, dur = 0.9) {
  const o = new Float32Array(len(dur));
  const n = noiseSrc(7);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const idx = 1.6 * Math.exp(-t / 0.05);
    const mod = Math.sin(TWO_PI * freq * 4 * t) * idx;
    const car = Math.sin(TWO_PI * freq * t + mod) * Math.exp(-t / 0.42);
    const ov = 0.22 * Math.sin(TWO_PI * freq * 10 * t) * Math.exp(-t / 0.03);
    const thump = n() * Math.exp(-t / 0.004) * 0.12;
    o[i] = (car + ov + thump) * vel;
  }
  return fadeTail(o, 0.05);
}

// airy detuned pad chord; freqs in Hz
export function pad(freqs, dur, vel = 1, cutoff = 1600, atk = 0.7, rel = 1.0, seed = 3) {
  const o = new Float32Array(len(dur + rel));
  const f = new SVF();
  const ph = freqs.flatMap((_, k) => [0.1 * k, 0.4 + 0.1 * k, 0.7 + 0.05 * k]);
  const det = [1, 1.006, 0.994];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    let x = 0;
    for (let k = 0; k < freqs.length; k++) {
      for (let d = 0; d < 3; d++) {
        const idx = k * 3 + d;
        ph[idx] += (freqs[k] * det[d] * (1 + 0.0015 * Math.sin(TWO_PI * (0.23 + 0.05 * k) * t))) / SR;
        x += saw(ph[idx]);
      }
    }
    x /= freqs.length * 3 * 0.55;
    f.run(x, cutoff * (0.6 + 0.4 * Math.min(1, t / atk)), 0.8);
    o[i] = f.lp * env.adsr(i, atk, 0.3, 0.85, dur, rel) * vel;
  }
  return o;
}

// bright synth stab chord
export function stab(freqs, vel = 1, dur = 0.7) {
  const o = new Float32Array(len(dur + 0.3));
  const f = new SVF();
  const ph = freqs.flatMap(() => [0, 0.33, 0.66]);
  const det = [1, 1.005, 0.995];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    let x = 0;
    for (let k = 0; k < freqs.length; k++)
      for (let d = 0; d < 3; d++) { ph[k * 3 + d] += (freqs[k] * det[d]) / SR; x += saw(ph[k * 3 + d]); }
    x /= freqs.length * 3 * 0.5;
    f.run(x, 1400 + 6500 * Math.exp(-t / 0.18), 1.0);
    o[i] = sat(f.lp, 1.2) * env.adsr(i, 0.004, 0.25, 0.25, dur, 0.25) * vel;
  }
  return o;
}

export function hat(vel = 1, open = false, seed = 5) {
  const o = new Float32Array(len(open ? 0.35 : 0.09));
  const n = noiseSrc(seed);
  const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    f.run(n(), 7500, 0.9);
    o[i] = f.hp * (open ? Math.exp(-t / 0.09) : Math.exp(-t / 0.018)) * Math.min(1, t / 0.002) * vel * 0.5;
  }
  return fadeTail(o, 0.01);
}

// brushed hat: softer, band-limited with slower attack
export function brush(vel = 1, seed = 9) {
  const o = new Float32Array(len(0.13));
  const n = noiseSrc(seed);
  const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    f.run(n(), 6000, 0.6);
    o[i] = f.bp * Math.min(1, t / 0.008) * Math.exp(-t / 0.03) * vel * 0.9;
  }
  return fadeTail(o, 0.015);
}

export function clap(vel = 1, seed = 11) {
  const o = new Float32Array(len(0.3));
  const n = noiseSrc(seed);
  const f = new SVF();
  const bursts = [0, 0.011, 0.023];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    f.run(n(), 1700, 1.6);
    let e = Math.exp(-Math.max(0, t - 0.035) / 0.07) * (t >= 0.035 ? 1 : 0);
    for (const b of bursts) if (t >= b && t < b + 0.01) e = Math.max(e, 1 - (t - b) / 0.01);
    o[i] = f.bp * e * vel * 1.2;
  }
  return fadeTail(o, 0.02);
}

export function snare(vel = 1, seed = 13) {
  const o = new Float32Array(len(0.25));
  const n = noiseSrc(seed);
  const f = new SVF();
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph += (TWO_PI * (185 + 60 * Math.exp(-t / 0.02))) / SR;
    f.run(n(), 2600, 0.7);
    o[i] = (f.bp * 0.9 * Math.exp(-t / 0.07) + Math.sin(ph) * 0.5 * Math.exp(-t / 0.05)) * vel;
  }
  return fadeTail(o, 0.02);
}

// noise crash / cymbal
export function crash(dur = 3, vel = 1, seed = 17) {
  const o = new Float32Array(len(dur));
  const n = noiseSrc(seed);
  const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    f.run(n(), 6500, 0.8);
    o[i] = f.hp * Math.min(1, t / 0.003) * Math.exp(-t / (dur * 0.28)) * vel * 0.55;
  }
  return fadeTail(o, 0.1);
}

// filtered noise sweep with rising envelope (riser); f0->f1 exponential
export function noiseSweep(dur, f0, f1, vel = 1, seed = 21, shape = 2, q = 2.5) {
  const o = new Float32Array(len(dur));
  const n = noiseSrc(seed);
  const f = new SVF();
  for (let i = 0; i < o.length; i++) {
    const p = i / o.length;
    f.run(n(), f0 * (f1 / f0) ** p, q);
    o[i] = f.bp * p ** shape * vel;
  }
  return o;
}

export function impact(dur = 1.6, vel = 1, seed = 23) {
  const o = new Float32Array(len(dur));
  const n = noiseSrc(seed);
  const f = new SVF();
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph += (TWO_PI * (32 + 60 * Math.exp(-t / 0.15))) / SR;
    f.run(n(), 900 * Math.exp(-t / 0.3) + 80, 0.8);
    o[i] = (Math.sin(ph) * Math.exp(-t / 0.55) + f.lp * 0.6 * Math.exp(-t / 0.12)) * vel;
  }
  return fadeTail(o, 0.05);
}

// bell/chime partials: [[ratio, amp, tau]]
export function bell(freq, dur, vel = 1, partials = [[1, 1, 0.6], [2.76, 0.4, 0.35], [5.4, 0.2, 0.18], [8.93, 0.08, 0.1]]) {
  const o = new Float32Array(len(dur));
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    let x = 0;
    for (const [r, a, tau] of partials) x += Math.sin(TWO_PI * freq * r * t) * a * Math.exp(-t / tau);
    o[i] = x * Math.min(1, t / 0.002) * vel;
  }
  return fadeTail(o, 0.05);
}

export { fadeTail, fadeHead, mtof, noiseSrc };
