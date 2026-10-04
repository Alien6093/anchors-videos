// node src/mix.mjs <buildDir>: music_raw.wav + sfx_raw.wav + cues.json -> mix_pre.wav, music_part.wav, sfx_part.wav
// Music is ducked under every SFX cue (event-keyed sidechain, 3-5 dB by cue type; risers/swells duck gradually).
import fs from 'node:fs';
import path from 'node:path';
import { SR, readWav, writeWav, peakOf } from './lib.mjs';

const dir = process.argv[2] || 'build';
const music = readWav(path.join(dir, 'music_raw.wav'));
const sfx = readWav(path.join(dir, 'sfx_raw.wav'));
const cues = JSON.parse(fs.readFileSync(path.join(dir, 'cues.json'), 'utf8'));
const MUSIC_GAIN = 1.0;
const SFX_GAIN = Number(process.env.SFX_GAIN ?? 1.0);
const n = music.n;
if (sfx.n !== n) throw new Error(`length mismatch music ${n} sfx ${sfx.n}`);
const gain = new Float32Array(n).fill(1);
for (const c of cues) {
  const [db, hold, rel] = c.duck;
  const depth = 1 - 10 ** (db / 20);
  const ramp = ['riser', 'swell'].includes(c.type);
  const a = ramp ? c.start : c.type === 'whoosh' || c.type === 'zoom' ? c.t - 0.18 : c.t - 0.012;
  const atk = ramp ? Math.max(0.05, c.t - c.start) : c.type === 'whoosh' || c.type === 'zoom' ? 0.15 : 0.01;
  const i0 = Math.max(0, Math.round(a * SR)), iA = Math.round((a + atk) * SR), iH = Math.round((Math.max(c.t, a + atk) + hold) * SR), iR = iH + Math.round(rel * SR);
  for (let i = i0; i < Math.min(n, iR); i++) {
    const w = i < iA ? ((i - i0) / Math.max(1, iA - i0)) ** (ramp ? 2 : 1) : i < iH ? 1 : 0.5 * (1 + Math.cos(Math.PI * (i - iH) / (iR - iH)));
    gain[i] = Math.min(gain[i], 1 - depth * w);
  }
}
const mL = new Float32Array(n), mR = new Float32Array(n), sL = new Float32Array(n), sR = new Float32Array(n), L = new Float32Array(n), R = new Float32Array(n);
for (let i = 0; i < n; i++) {
  mL[i] = music.L[i] * MUSIC_GAIN * gain[i]; mR[i] = music.R[i] * MUSIC_GAIN * gain[i];
  sL[i] = sfx.L[i] * SFX_GAIN; sR[i] = sfx.R[i] * SFX_GAIN;
  L[i] = mL[i] + sL[i]; R[i] = mR[i] + sR[i];
}
// DC blocker (1-pole high-pass, 8 Hz) on both parts so the stems and the mix carry no DC offset
for (const a of [mL, mR, sL, sR]) { const k = Math.exp((-2 * Math.PI * 8) / SR); let x1 = 0, y1 = 0; for (let i = 0; i < n; i++) { const x = a[i]; y1 = k * (y1 + x - x1); x1 = x; a[i] = y1; } }
for (let i = 0; i < n; i++) { L[i] = mL[i] + sL[i]; R[i] = mR[i] + sR[i]; }
const pk = peakOf(L, R), g = 0.9 / pk;
const sc = (a) => a.map((v) => v * g);
writeWav(path.join(dir, 'mix_pre.wav'), sc(L), sc(R), 24);
writeWav(path.join(dir, 'music_part.wav'), sc(mL), sc(mR), 24);
writeWav(path.join(dir, 'sfx_part.wav'), sc(sL), sc(sR), 24);
fs.writeFileSync(path.join(dir, 'duck.f32'), Buffer.from(gain.buffer));
let minG = 1; for (const v of gain) minG = Math.min(minG, v);
console.log(`premix peak ${pk.toFixed(3)} -> scaled ${g.toFixed(3)}; deepest duck ${(20 * Math.log10(minG)).toFixed(1)} dB`);
