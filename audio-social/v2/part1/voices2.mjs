// Part 1 voices (v2 engine extension): saturated kick/808-style bass with upper harmonics, detuned-saw stab/lead/pad, plucks, risers, hit-stops.
// Mono voices return Float32Array; wide voices return {L,R}.
import { SR, TWO_PI, SVF, mtof, rng, sat } from './lib.mjs';
import { anchorPluck, anchorBell } from '../anchor-voice.mjs';

export { mtof, anchorPluck, anchorBell };
export const N = (s) => Math.max(1, Math.round(s * SR));
export const nz = (seed) => { const r = rng(seed); return () => r() * 2 - 1; };
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));
const sqr = (ph) => (ph - Math.floor(ph) < 0.5 ? 1 : -1);
const tail = (o, sec = 0.008) => { const n = Math.min(o.length, N(sec)); for (let i = 0; i < n; i++) o[o.length - 1 - i] *= i / n; return o; };
const head = (o, sec = 0.0005) => { const n = Math.min(o.length, N(sec)); for (let i = 0; i < n; i++) o[i] *= i / n; return o; };

// tight club kick: pitch-dropping sine, saturated (harmonics carry on phone), 2-4 kHz click + 180 Hz knock
export function kick({ f1 = 52, tauA = 0.09, drive = 3.4, click = 0.8, len = 0.28 } = {}) {
  const o = new Float32Array(N(len)); const n = nz(1); const hp = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph += (TWO_PI * (f1 + 150 * Math.exp(-t / 0.02))) / SR;
    hp.run(n(), 2200, 0.9);
    const body = Math.sin(ph) * Math.exp(-t / tauA) * Math.min(1, t / 0.0008);
    o[i] = sat(body * 1.25, drive) * 0.95 + hp.hp * Math.exp(-t / 0.0035) * click + Math.sin(TWO_PI * 210 * t) * Math.exp(-t / 0.016) * 0.4;
  }
  return tail(o, 0.015);
}
// short snap (2-5 kHz) layered under claps and the hook thud
export function snap({ len = 0.09 } = {}) {
  const o = new Float32Array(N(len)); const n = nz(7); const hp = new SVF();
  for (let i = 0; i < o.length; i++) { const t = i / SR; hp.run(n(), 2800, 1.0); o[i] = hp.hp * Math.exp(-t / 0.018) * 0.8 + Math.sin(TWO_PI * 1900 * t) * Math.exp(-t / 0.006) * 0.35; }
  return tail(head(o), 0.01);
}
export function clap({ len = 0.26 } = {}) {
  const o = new Float32Array(N(len)); const n = nz(11); const bp = new SVF(); const hp = new SVF();
  const bursts = [0, 0.011, 0.022];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; bp.run(n(), 2600, 0.9); hp.run(bp.bp * 2.2, 1000, 0.7);
    let e = Math.exp(-Math.max(0, t - 0.03) / 0.07) * 0.55;
    for (const b of bursts) if (t >= b) e += Math.exp(-(t - b) / 0.004) * 0.7 * (t - b < 0.012 ? 1 : 0);
    o[i] = hp.hp * e;
  }
  return tail(head(o), 0.02);
}
export function hat({ open = false, seed = 5 } = {}) {
  const len = open ? 0.34 : 0.07; const o = new Float32Array(N(len)); const n = nz(seed); const hp = new SVF();
  const fs = [5300, 7100, 8400, 10100];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; hp.run(n(), open ? 6200 : 7200, 0.8);
    let m = 0; for (const f of fs) m += sqr(f * t) * 0.15;
    o[i] = (hp.hp * 0.8 + m * 0.5) * Math.exp(-t / (open ? 0.09 : 0.016)) * Math.min(1, t / 0.0004);
  }
  return tail(o, open ? 0.03 : 0.01);
}
export function shaker() {
  const o = new Float32Array(N(0.09)); const n = nz(9); const bp = new SVF();
  for (let i = 0; i < o.length; i++) { const t = i / SR; bp.run(n(), 5800, 1.3); o[i] = bp.bp * Math.sin(Math.PI * Math.min(1, t / 0.07)) * 0.9; }
  return tail(o, 0.01);
}
export function rim() {
  const o = new Float32Array(N(0.08)); const n = nz(31);
  for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = (Math.sin(TWO_PI * 520 * t) * 0.6 + Math.sin(TWO_PI * 1180 * t) * 0.3 + n() * 0.25) * Math.exp(-t / 0.014); }
  return tail(head(o), 0.01);
}
// plucked bass: layer B (saw+square -> LP -> sat) carries 110-330 Hz and harmonics; layer A sine is support only
export function bassPluck(freq, dur = 0.2, { cutoff = 900, sub = 0.2 } = {}) {
  const o = new Float32Array(N(dur + 0.06)); const lp = new SVF(); const hp = new SVF(); const gl = new SVF(); const gh = new SVF(); let p1 = 0, p2 = 0.3, p3 = 0, ps = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; p1 += (freq * 1.003) / SR; p2 += (freq * 0.997) / SR; p3 += freq / SR; ps += freq / 2 / SR;
    const x = saw(p1) * 0.4 + saw(p2) * 0.4 + sqr(p3) * 0.3;
    lp.run(x, 260 + cutoff * Math.exp(-t / 0.085), 1.3);
    const e = Math.min(1, t / 0.003) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.06)) * (0.55 + 0.45 * Math.exp(-t / 0.11));
    gl.run(x, 1500 + 3500 * Math.exp(-t / 0.06), 1.2); gh.run(gl.lp, 380, 0.7);
    hp.run(sat(lp.lp * 1.8, 3.0) * e + Math.sin(TWO_PI * ps) * sub * e + sat(gh.hp * 1.5, 2.5) * e * 0.55, 40, 0.7);
    o[i] = hp.hp;
  }
  return o;
}
// detuned-saw chord stab (HP 300 Hz), fast filter decay
export function stab(midis, { dur = 0.22, tau = 0.09, bright = 7500 } = {}) {
  const o = new Float32Array(N(dur + 0.05)); const lp = new SVF(); const hp = new SVF();
  const ph = midis.flatMap((m) => [[mtof(m) * 1.004, Math.random() * 0], [mtof(m) * 0.996, 0.31]]);
  const ps = ph.map(([f, p]) => ({ f, p }));
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; let x = 0; for (const v of ps) { v.p += v.f / SR; x += saw(v.p); }
    x /= ps.length * 0.6;
    lp.run(x, 1800 + bright * Math.exp(-t / tau), 1.1); hp.run(lp.lp, 300, 0.7);
    o[i] = sat(hp.hp, 1.4) * Math.min(1, t / 0.002) * Math.exp(-t / (dur * 0.6)) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.05) : 1);
  }
  return o;
}
// soft saw pad (one chord, one bar+): returns stereo, HP 220 Hz
export function pad(midis, dur, { cutoff = 4200 } = {}) {
  const n = N(dur); const L = new Float32Array(n), R = new Float32Array(n);
  const lpL = new SVF(), lpR = new SVF(), hpL = new SVF(), hpR = new SVF();
  const vs = midis.flatMap((m) => [{ f: mtof(m) * 1.006, p: 0, c: 0 }, { f: mtof(m) * 0.994, p: 0.4, c: 1 }, { f: mtof(m) * 2.001, p: 0.7, c: 0, g: 0.3 }]);
  for (let i = 0; i < n; i++) {
    const t = i / SR; let l = 0, r = 0;
    for (const v of vs) { v.p += v.f / SR; const s = saw(v.p) * (v.g || 1); if (v.c) r += s; else l += s; }
    lpL.run(l, cutoff, 0.8); lpR.run(r, cutoff, 0.8); hpL.run(lpL.lp, 220, 0.7); hpR.run(lpR.lp, 220, 0.7);
    const e = Math.min(1, t / 0.04) * Math.min(1, (dur - t) / 0.05);
    L[i] = hpL.hp * e * 0.12; R[i] = hpR.hp * e * 0.12;
  }
  return { L, R };
}
// brighter arp pluck for the groove bed (same recipe as the ANCHOR pluck, LP opens higher, 2-5 kHz presence)
export function arpPluck(midi, dur = 0.16, vel = 1) {
  const freq = mtof(midi), o = new Float32Array(N(dur + 0.02)); const lp = new SVF(), hp = new SVF(); let p1 = 0, p2 = 0.37, p3 = 0.11; const up = 2 ** (9 / 1200), dn = 2 ** (-9 / 1200);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; p1 += (freq * up) / SR; p2 += (freq * dn) / SR; p3 += freq / SR;
    lp.run(saw(p1) * 0.42 + saw(p2) * 0.42 + sqr(p3) * 0.16, 2600 + 9000 * Math.exp(-t / 0.05), 1.3); hp.run(lp.lp, 400, 0.7);
    o[i] = sat(hp.hp * 1.4, 1.8) * Math.min(1, t / 0.0015) * Math.exp(-t / 0.075) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.02) : 1) * vel;
  }
  return o;
}
export function bell(midi, dur = 1.0, vel = 1) { return anchorBell(mtof(midi), dur, vel); }
// ---- SFX building blocks ----
export function noiseBand(dur, f0, f1, shape, seed, q = 1.6) {
  const o = new Float32Array(N(dur)); const n = nz(seed); const f = new SVF();
  for (let i = 0; i < o.length; i++) { const p = i / o.length; f.run(n(), f0 * (f1 / f0) ** p, q); o[i] = f.bp * (shape >= 0 ? p ** shape : (1 - p) ** -shape); }
  return o;
}
// stereo whoosh: peak at the END of the file (cue with lead = length). chirp rises to `toMidi` so it resolves in key.
export function whoosh(dur, { f0 = 400, f1 = 9000, toMidi = 81, tone = 0.12, shape = 2.0, seed = 40 } = {}) {
  const a = noiseBand(dur, f0, f1, shape, seed), b = noiseBand(dur, f0, f1, shape, seed + 1);
  const n = a.length; let ph = 0; const fT = mtof(toMidi);
  for (let i = 0; i < n; i++) { const p = i / n; ph += (TWO_PI * fT * (0.5 + 0.5 * p ** 2)) / SR; const c = Math.sin(ph) * p ** 2.4 * tone; a[i] += c; b[i] += c; }
  tail(a, 0.003); tail(b, 0.003);
  return { L: a, R: b };
}
export function riser(dur, { f0 = 250, f1 = 11000, toMidi = 69, tone = 0.18, shape = 2.2, seed = 50 } = {}) {
  const a = noiseBand(dur, f0, f1, shape, seed, 1.4), b = noiseBand(dur, f0, f1, shape, seed + 1, 1.4);
  const n = a.length; let ph1 = 0, ph2 = 0; const fE = mtof(toMidi + 12);
  for (let i = 0; i < n; i++) {
    const p = i / n; const f = fE * 0.25 * 4 ** p;
    ph1 += (TWO_PI * f) / SR; ph2 += (TWO_PI * f * 1.005) / SR;
    const c = (saw(ph1 / TWO_PI) + saw(ph2 / TWO_PI)) * 0.5 * p ** 2.4 * tone;
    a[i] += c; b[i] += c;
  }
  // 120 Hz high-pass (SFX never carry sub)
  const ha = new SVF(), hb = new SVF();
  for (let i = 0; i < n; i++) { ha.run(a[i], 160, 0.7); hb.run(b[i], 160, 0.7); a[i] = ha.hp; b[i] = hb.hp; }
  return { L: a, R: b };
}
export function reverseCrash(dur = 1.4, seed = 60) {
  const n = N(dur); const a = new Float32Array(n), b = new Float32Array(n); const ng = nz(seed), nh = nz(seed + 1); const f1 = new SVF(), f2 = new SVF();
  for (let i = 0; i < n; i++) { const t = i / SR; f1.run(ng(), 4200, 0.8); f2.run(nh(), 4200, 0.8); const e = Math.exp(-t / (dur * 0.33)); a[i] = f1.hp * e; b[i] = f2.hp * e; }
  a.reverse(); b.reverse(); tail(a, 0.002); tail(b, 0.002); head(a, 0.01); head(b, 0.01);
  return { L: a, R: b };
}
export function crash(dur = 1.6, seed = 70) {
  const n = N(dur); const a = new Float32Array(n), b = new Float32Array(n); const ng = nz(seed), nh = nz(seed + 1); const f1 = new SVF(), f2 = new SVF();
  for (let i = 0; i < n; i++) { const t = i / SR; f1.run(ng(), 3800, 0.8); f2.run(nh(), 3800, 0.8); let m = 0; for (const f of [4100, 5900, 7300, 9100]) m += sqr(f * t) * 0.08; const e = Math.exp(-t / 0.35) * Math.min(1, t / 0.0005); a[i] = (f1.hp + m) * e; b[i] = (f2.hp + m) * e; }
  tail(a, 0.05); tail(b, 0.05);
  return { L: a, R: b };
}
// impact (no sub): mid boom 120-500 Hz + noise burst + click
export function impact(dur = 1.1, seed = 80) {
  const o = new Float32Array(N(dur)); const n = nz(seed); const f = new SVF(); const h = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; ph += (TWO_PI * (150 + 160 * Math.exp(-t / 0.05))) / SR;
    f.run(n(), 900 * Math.exp(-t / 0.4) + 200, 0.9); h.run(n(), 3000, 0.9);
    o[i] = sat(Math.sin(ph) * Math.exp(-t / 0.22), 2) * 0.7 + f.lp * Math.exp(-t / 0.25) * 0.7 + h.hp * Math.exp(-t / 0.03) * 0.8;
  }
  const hp = new SVF(); for (let i = 0; i < o.length; i++) { hp.run(o[i], 120, 0.7); o[i] = hp.hp; }
  return tail(head(o), 0.05);
}
export function tapeClick() {
  const o = new Float32Array(N(0.12)); const n = nz(90); const hp = new SVF(); let ph = 0;
  for (let i = 0; i < o.length; i++) { const t = i / SR; hp.run(n(), 2000, 0.9); ph += (TWO_PI * (200 + 1100 * Math.exp(-t / 0.03))) / SR; o[i] = hp.hp * Math.exp(-t / 0.004) * 0.9 + Math.sin(ph) * Math.exp(-t / 0.04) * 0.5; }
  return tail(head(o), 0.02);
}
export function click(hz = 2400, tau = 0.006, seed = 91) {
  const o = new Float32Array(N(0.07)); const n = nz(seed); const hp = new SVF();
  for (let i = 0; i < o.length; i++) { const t = i / SR; hp.run(n(), hz, 1.1); o[i] = hp.hp * Math.exp(-t / tau) * 0.8 + Math.sin(TWO_PI * hz * 0.5 * t) * Math.exp(-t / 0.01) * 0.4; }
  return tail(head(o), 0.01);
}
// tuned UI thock (Enter / stamp): pitched body 200-500 Hz + click, sub-free
export function thock(midi = 57, dur = 0.16) {
  const o = new Float32Array(N(dur)); const n = nz(95); const hp = new SVF(); const hpf = new SVF(); let ph = 0; const f = mtof(midi);
  for (let i = 0; i < o.length; i++) { const t = i / SR; ph += (TWO_PI * f * (1 + 1.2 * Math.exp(-t / 0.02))) / SR; hp.run(n(), 2600, 1); hpf.run(sat(Math.sin(ph), 2) * Math.exp(-t / 0.05), 130, 0.7); o[i] = hpf.hp + hp.hp * Math.exp(-t / 0.004) * 0.6; }
  return tail(head(o), 0.02);
}
export function glassChord(midis, dur = 1.1) {
  const o = new Float32Array(N(dur));
  midis.forEach((m, k) => { const b = anchorBell(mtof(m), dur, k === 0 ? 1 : 0.7); for (let i = 0; i < o.length && i < b.length; i++) o[i] += b[i] * Math.exp(-i / SR / 0.5); });
  return tail(o, 0.2);
}
export function pluckNote(midi, dur = 0.3, vel = 1, bellAmt = 0.25) {
  const f = mtof(midi), p = anchorPluck(f, vel, dur), b = anchorBell(f, Math.max(0.5, dur), vel * bellAmt);
  const o = new Float32Array(Math.max(p.length, b.length)); for (let i = 0; i < o.length; i++) o[i] = (p[i] || 0) + (b[i] || 0); return o;
}
export function snareHit() {
  const o = new Float32Array(N(0.18)); const n = nz(13); const bp = new SVF(); const hp = new SVF();
  for (let i = 0; i < o.length; i++) { const t = i / SR; bp.run(n(), 2200, 0.7); hp.run(bp.hp, 600, 0.7); o[i] = (hp.hp * 0.9 + Math.sin(TWO_PI * 210 * t) * 0.35 * Math.exp(-t / 0.03)) * Math.exp(-t / 0.05); }
  return tail(head(o), 0.02);
}
export { saw, sqr, tail, head };
