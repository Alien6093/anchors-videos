// Mixes music + SFX at cue times into a pre-master WAV (mastered by ffmpeg in build.sh).
import fs from 'node:fs';
import { SR, readWav, writeWav, peakOf } from './lib.mjs';

const music = readWav('public/audio/music.wav');
const cues = JSON.parse(fs.readFileSync('public/audio/sfx-cues.json', 'utf8'));
const MUSIC_GAIN = 0.75;
// music ducking: [file pattern, depth dB, hold s, release s]
const DUCK_RULES = [
  [/impact|logo-hit|digit-roll/, -4, 0.6, 0.8],
  [/chime|cymbal|coin|pay-click|lock-glass|riser-long/, -3.5, 0.5, 0.6],
  [/bright-stab|enter-thock|live-ping|counter-ramp/, -2.5, 0.2, 0.4],
];

const n = music.n;
const gain = new Float32Array(n).fill(1);
for (const c of cues) {
  const rule = DUCK_RULES.find(([re]) => re.test(c.file));
  if (!rule) continue;
  const [, db, hold, rel] = rule;
  const g = 10 ** (db / 20);
  const a = Math.round((c.time - 0.03) * SR), h = Math.round((c.time + hold) * SR), r = Math.round(rel * SR), atk = Math.round(0.03 * SR);
  for (let i = Math.max(0, a); i < Math.min(n, h + r); i++) {
    const w = i < a + atk ? (i - a) / atk : i < h ? 1 : 1 - (i - h) / r;
    gain[i] = Math.min(gain[i], 1 - (1 - g) * w);
  }
}
const L = new Float32Array(n), R = new Float32Array(n);
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
