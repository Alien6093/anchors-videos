// Film B v5 one-shot (round 6, scene 10), rendered into audio-B/sfx:
//  count-up-soft : ONE soft count-up for the table values, 0.804 s (40.982-41.786). A run of light, filtered-noise-plus-sine ticks that decelerate (ease-out, like the
//                  0.8 s ease-out number count) and rise gently in pitch (A minor pentatonic-free: smooth glide 900 -> 1500 Hz), quiet and dry, no chime or coin character.
//                  The last tick lands exactly on the file end; the lock itself is the separate tile-tick at 41.786.
// node audio-B/sfx-v5.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, Stereo, writeWav, fadeTail, rng } from '../audio-common/lib.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sfx');
const LEN_S = 0.804, TICKS = 16, F0 = 900, F1 = 1500, PEAK0 = 0.12, PEAK1 = 0.2, DECAY_S = 0.012, ATTACK_S = 0.001, EASE_POW = 2.2;
const rand = rng(5150);
const st = new Stereo(LEN_S + 0.05);
for (let k = 0; k < TICKS; k++) {
  const p = k / (TICKS - 1);
  const t0 = LEN_S * (1 - (1 - p) ** EASE_POW) - 0.012 * (k === TICKS - 1 ? 1 : 0); // dense at the start, sparse at the end (ease-out)
  const f = F0 * (F1 / F0) ** p, amp = PEAK0 + (PEAK1 - PEAK0) * p, pan = (k % 2 ? 0.15 : -0.15);
  const gl = pan > 0 ? 1 - pan : 1, gr = pan < 0 ? 1 + pan : 1;
  const s0 = Math.round(Math.max(0, t0) * SR);
  let lp = 0;
  for (let i = 0; i < 0.06 * SR && s0 + i < st.n; i++) {
    const t = i / SR, e = Math.exp(-t / DECAY_S) * Math.min(1, t / ATTACK_S);
    lp += 0.35 * ((rand() * 2 - 1) - lp);
    const v = (Math.sin(TWO_PI * f * t) * 0.7 + lp * 0.5) * e * amp;
    st.L[s0 + i] += v * gl; st.R[s0 + i] += v * gr;
  }
}
fadeTail(st.L, 0.03); fadeTail(st.R, 0.03);
writeWav(path.join(OUT, 'count-up-soft.wav'), st.L, st.R, 24);
console.log('v5 sfx written: count-up-soft');
