// Mixes music + SFX at cue times into a pre-master float-safe WAV (mastered by ffmpeg in build.sh).
import fs from 'node:fs';
import { SR, Stereo, readWav, writeWav, peakOf } from './lib.mjs';

const music = readWav('public/audio/music.wav');
const cues = JSON.parse(fs.readFileSync('public/audio/sfx-cues.json', 'utf8'));
const MUSIC_GAIN = 0.62;
const DUCK_DB = -3.5;
const DUCK_TIMES = [26.8, 28.0, 34.8, 43.3];

const n = music.n;
const L = new Float32Array(n), R = new Float32Array(n);
const gain = new Float32Array(n).fill(1);
const duckG = 10 ** (DUCK_DB / 20);
for (const t of DUCK_TIMES) {
  const a = Math.round((t - 0.03) * SR), h = Math.round((t + 0.7) * SR), r = Math.round(0.6 * SR);
  for (let i = a; i < h + r && i < n; i++) {
    const w = i < a + 0.03 * SR ? (i - a) / (0.03 * SR) : i < h ? 1 : 1 - (i - h) / r;
    gain[i] = Math.min(gain[i], 1 - (1 - duckG) * w);
  }
}
for (let i = 0; i < n; i++) { L[i] = music.L[i] * MUSIC_GAIN * gain[i]; R[i] = music.R[i] * MUSIC_GAIN * gain[i]; }

const cache = new Map();
for (const c of cues) {
  if (!cache.has(c.file)) cache.set(c.file, readWav(`public/audio/${c.file}`));
  const w = cache.get(c.file);
  const gl = c.volume * (c.pan > 0 ? 1 - c.pan : 1);
  const gr = c.volume * (c.pan < 0 ? 1 + c.pan : 1);
  const s = Math.round(c.time * SR);
  for (let i = 0; i < w.n && s + i < n; i++) { L[s + i] += w.L[i] * gl; R[s + i] += w.R[i] * gr; }
}
const pk = peakOf(L, R);
const g = pk > 0.9 ? 0.9 / pk : 1;
for (let i = 0; i < n; i++) { L[i] *= g; R[i] *= g; }
writeWav(process.argv[2] || 'mix_pre.wav', L, R, 24);
console.log('premix peak', pk.toFixed(3), 'scaled', g.toFixed(3));
