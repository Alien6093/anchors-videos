// Copied verbatim from audio-common/ (original synthesis engine written for Anchors films; same licence as this folder).
// Minimal DSP toolkit: stereo buffers, filters, reverb, delay, WAV io.
import fs from 'node:fs';

export const SR = 48000;
export const TWO_PI = Math.PI * 2;
export const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Zero-delay-feedback state variable filter; results in .lp .bp .hp
export class SVF {
  constructor() { this.ic1 = 0; this.ic2 = 0; this.lp = 0; this.bp = 0; this.hp = 0; }
  run(x, fc, q = 0.7) {
    const g = Math.tan((Math.PI * Math.min(Math.max(fc, 20), SR * 0.45)) / SR);
    const k = 1 / q;
    const a1 = 1 / (1 + g * (g + k));
    const a2 = g * a1;
    const a3 = g * a2;
    const v3 = x - this.ic2;
    const v1 = a1 * this.ic1 + a2 * v3;
    const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
    this.ic1 = 2 * v1 - this.ic1;
    this.ic2 = 2 * v2 - this.ic2;
    this.lp = v2; this.bp = v1; this.hp = x - k * v1 - v2;
  }
}

export class Stereo {
  constructor(seconds) {
    this.n = Math.round(seconds * SR);
    this.L = new Float32Array(this.n);
    this.R = new Float32Array(this.n);
  }
}

// Add a mono voice at time t (s) with gain and pan (-1..1), equal power.
export function addMono(st, mono, t, gain = 1, pan = 0) {
  const start = Math.round(t * SR);
  const a = ((pan + 1) * Math.PI) / 4;
  const gl = Math.cos(a) * gain * Math.SQRT2;
  const gr = Math.sin(a) * gain * Math.SQRT2;
  const end = Math.min(st.n, start + mono.length);
  for (let i = Math.max(0, start); i < end; i++) {
    const v = mono[i - start];
    st.L[i] += v * gl;
    st.R[i] += v * gr;
  }
}

export function addStereo(dst, src, t = 0, gain = 1) {
  const start = Math.round(t * SR);
  const end = Math.min(dst.n, start + src.n);
  for (let i = Math.max(0, start); i < end; i++) {
    dst.L[i] += src.L[i - start] * gain;
    dst.R[i] += src.R[i - start] * gain;
  }
}

export const env = {
  // exponential decay after tiny attack
  perc: (i, atk, tau) => {
    const t = i / SR;
    return (t < atk ? t / atk : 1) * Math.exp(-Math.max(0, t - atk) / tau);
  },
  // ADSR with total note length `dur` before release of `rel`
  adsr: (i, a, d, s, dur, r) => {
    const t = i / SR;
    if (t < dur) {
      if (t < a) return t / a;
      if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
      return s;
    }
    const lvl = t - dur < r ? s * (1 - (t - dur) / r) : 0;
    return Math.max(0, lvl);
  },
};

export const sat = (x, drive = 1) => Math.tanh(x * drive) / Math.tanh(drive);

// Schroeder/Moorer reverb (4 damped combs + 2 allpass per channel). Returns wet-only Stereo.
export function reverb(src, { decay = 0.84, damp = 0.35, pre = 0.012, size = 1 } = {}) {
  const out = new Stereo(src.n / SR);
  const combMs = [29.7, 37.1, 41.1, 43.7];
  const apMs = [5.0, 1.7];
  const run = (input, output, spread) => {
    const combs = combMs.map((m) => {
      const len = Math.round(((m * size) / 1000) * SR) + spread;
      return { buf: new Float32Array(len), idx: 0, lp: 0 };
    });
    const aps = apMs.map((m) => ({ buf: new Float32Array(Math.round((m / 1000) * SR) + spread), idx: 0 }));
    const preLen = Math.round(pre * SR);
    for (let i = 0; i < src.n; i++) {
      const x = i >= preLen ? input[i - preLen] : 0;
      let y = 0;
      for (const c of combs) {
        const o = c.buf[c.idx];
        c.lp = o * (1 - damp) + c.lp * damp;
        c.buf[c.idx] = x * 0.25 + c.lp * decay;
        c.idx = (c.idx + 1) % c.buf.length;
        y += o;
      }
      for (const a of aps) {
        const o = a.buf[a.idx];
        const v = y + o * 0.5;
        a.buf[a.idx] = v;
        y = o - v * 0.5;
        a.idx = (a.idx + 1) % a.buf.length;
      }
      output[i] = y;
    }
  };
  run(src.L, out.L, 0);
  run(src.R, out.R, 23);
  return out;
}

// Ping-pong feedback delay; returns wet-only Stereo
export function pingPong(src, time, feedback = 0.4, lpHz = 3500) {
  const out = new Stereo(src.n / SR);
  const d = Math.round(time * SR);
  const k = 1 - Math.exp((-TWO_PI * lpHz) / SR);
  let lpl = 0, lpr = 0;
  for (let i = 0; i < src.n; i++) {
    const fl = i >= d ? out.R[i - d] : 0;
    const fr = i >= d ? out.L[i - d] : 0;
    const inl = i >= d ? src.L[i - d] : 0;
    const inr = i >= d ? src.R[i - d] : 0;
    lpl += k * ((inl + fl * feedback) - lpl);
    lpr += k * ((inr + fr * feedback) - lpr);
    out.L[i] = lpl;
    out.R[i] = lpr;
  }
  return out;
}

export function fadeTail(mono, sec = 0.012) {
  const n = Math.min(mono.length, Math.round(sec * SR));
  for (let i = 0; i < n; i++) mono[mono.length - 1 - i] *= i / n;
  return mono;
}
export function fadeHead(mono, sec = 0.002) {
  const n = Math.min(mono.length, Math.round(sec * SR));
  for (let i = 0; i < n; i++) mono[i] *= i / n;
  return mono;
}

export function peakOf(...chs) {
  let p = 0;
  for (const c of chs) for (let i = 0; i < c.length; i++) p = Math.max(p, Math.abs(c[i]));
  return p;
}

export function writeWav(file, L, R, bits = 24) {
  const n = L.length;
  const bytes = bits / 8;
  const data = Buffer.alloc(n * 2 * bytes);
  const max = 2 ** (bits - 1) - 1;
  let o = 0;
  for (let i = 0; i < n; i++) {
    for (const ch of [L, R]) {
      const v = Math.max(-1, Math.min(1, ch[i]));
      const q = Math.round(v * max);
      if (bits === 24) { data.writeIntLE(q, o, 3); o += 3; } else { data.writeInt16LE(q, o); o += 2; }
    }
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2 * bytes, 28); h.writeUInt16LE(2 * bytes, 32);
  h.writeUInt16LE(bits, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}

// Reads PCM 16/24-bit stereo WAV written by writeWav or ffmpeg.
export function readWav(file) {
  const b = fs.readFileSync(file);
  let p = 12, bits = 24, ch = 2, dataOff = 0, dataLen = 0;
  while (p < b.length - 8) {
    const id = b.toString('ascii', p, p + 4);
    const sz = b.readUInt32LE(p + 4);
    if (id === 'fmt ') { ch = b.readUInt16LE(p + 10); bits = b.readUInt16LE(p + 22); }
    if (id === 'data') { dataOff = p + 8; dataLen = Math.min(sz, b.length - dataOff); break; }
    p += 8 + sz + (sz % 2);
  }
  const bytes = bits / 8;
  const n = Math.floor(dataLen / (bytes * ch));
  const L = new Float32Array(n), R = new Float32Array(n);
  const max = 2 ** (bits - 1);
  for (let i = 0; i < n; i++) {
    const rd = (c) => {
      const off = dataOff + (i * ch + c) * bytes;
      return (bits === 24 ? b.readIntLE(off, 3) : b.readInt16LE(off)) / max;
    };
    L[i] = rd(0);
    R[i] = ch > 1 ? rd(1) : L[i];
  }
  return { L, R, n };
}
