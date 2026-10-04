// Stage 1 mix: mastered music bed (Stage1_music.wav) + SFX cues -> build/mix_pre.wav (+ music_part / sfx_part at the same pre-master scale).
// Same maths as audio-common/mix.mjs (music gain 0.75, SFX bus 0.85, ducking rules) plus ducks for the new hook/payoff hits.   node mix-stage1.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, readWav, writeWav, peakOf } from '../../audio-common/lib.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const music = readWav(path.join(dir, 'Stage1_music.wav'));
const cues = JSON.parse(fs.readFileSync(path.join(dir, 'sfx-cues.json'), 'utf8'));
const MUSIC_GAIN = 0.75;
const SFX_GAIN = 0.85;
const DUCK_RULES = [
  [/hook-flash|title-smash|payoff-sub/, -3, 0.25, 0.4],
  [/impact|logo-hit|digit-roll/, -4, 0.6, 0.8],
  [/chime|cymbal|pay-click|lock-glass|riser/, -3.5, 0.5, 0.6],
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
const mL = new Float32Array(n), mR = new Float32Array(n), sL = new Float32Array(n), sR = new Float32Array(n);
for (let i = 0; i < n; i++) { mL[i] = music.L[i] * MUSIC_GAIN * gain[i]; mR[i] = music.R[i] * MUSIC_GAIN * gain[i]; }
const cache = new Map();
for (const c of cues) {
  if (!cache.has(c.file)) cache.set(c.file, readWav(path.join(dir, c.file)));
  const w = cache.get(c.file);
  const gl = c.volume * (c.pan > 0 ? 1 - c.pan : 1), gr = c.volume * (c.pan < 0 ? 1 + c.pan : 1);
  const s = Math.round(c.time * SR);
  for (let i = 0; i < w.n && s + i < n; i++) { if (s + i >= 0) { sL[s + i] += w.L[i] * gl * SFX_GAIN; sR[s + i] += w.R[i] * gr * SFX_GAIN; } }
}
const L = mL.map((v, i) => v + sL[i]), R = mR.map((v, i) => v + sR[i]);
const pk = peakOf(L, R);
const g = pk > 0.9 ? 0.9 / pk : 1;
const sc = (a) => a.map((v) => v * g);
const b = path.join(dir, 'build');
writeWav(path.join(b, 'mix_pre.wav'), sc(L), sc(R), 24);
writeWav(path.join(b, 'music_part.wav'), sc(mL), sc(mR), 24);
writeWav(path.join(b, 'sfx_part.wav'), sc(sL), sc(sR), 24);
console.log('premix peak', pk.toFixed(3), 'scaled', g.toFixed(3), 'samples', n);
