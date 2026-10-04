// Film B v4 one-shot (round 5 retime), rendered into audio-B/sfx:
//  stage3-tick-shimmer : the unchanged panel-tick (stage 3 load tick) with a very light stagger shimmer under it: five soft sine pips, 0.1 s apart (one per chip
//                        of the "Worked with" row, 43.125-43.525 on the timeline), ~-11 dB under the tick, pan-spread, non-monotonic pitch (A-minor pentatonic) so it never
//                        reads as a coin or reward chime. One file = one soft cue.
// node audio-B/sfx-v4.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SR, TWO_PI, Stereo, readWav, writeWav, fadeTail, mtof } from '../audio-common/lib.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sfx');
const CHIPS = 5, STAGGER_S = 0.1, PIP_PEAK = 0.22, PIP_DECAY_S = 0.045, PIP_ATTACK_S = 0.003, LEN_S = 0.75;
const PIP_MIDI = [81, 84, 83, 88, 86]; // A5 C6 B5 E6 D6 (pentatonic-ish, zig-zag)
const PIP_PAN = [-0.35, -0.15, 0.05, 0.25, 0.4];

const tick = readWav(path.join(OUT, 'panel-tick.wav'));
const st = new Stereo(LEN_S);
for (let i = 0; i < tick.n; i++) { st.L[i] += tick.L[i]; st.R[i] += tick.R[i]; }
for (let k = 0; k < CHIPS; k++) {
  const f = mtof(PIP_MIDI[k]), t0 = Math.round(k * STAGGER_S * SR) + Math.round(0.004 * SR);
  const a = ((PIP_PAN[k] + 1) * Math.PI) / 4, gl = Math.cos(a) * Math.SQRT2, gr = Math.sin(a) * Math.SQRT2;
  const amp = PIP_PEAK * (1 - 0.08 * k);
  for (let i = 0; t0 + i < st.n && i < 0.3 * SR; i++) {
    const t = i / SR;
    const v = Math.sin(TWO_PI * f * t) * Math.exp(-t / PIP_DECAY_S) * Math.min(1, t / PIP_ATTACK_S) * amp;
    st.L[t0 + i] += v * gl; st.R[t0 + i] += v * gr;
  }
}
fadeTail(st.L, 0.03); fadeTail(st.R, 0.03);
writeWav(path.join(OUT, 'stage3-tick-shimmer.wav'), st.L, st.R, 24);
console.log('v4 sfx written: stage3-tick-shimmer');
