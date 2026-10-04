// Score events shared by both 60 s films (intro pulses, end card, cymbal tail).
import { BEAT, bt } from './engine.mjs';

// Teaser riser + sub pulses under the hook (0 - 1.607), then the title downbeat at 2.143.
export function introEvents({ mono, V, mtof }, { riserEnd = 1.607, titleAt = 2.143, pulses = [0, 1, 2] } = {}) {
  pulses.forEach((b, i) => mono('bass', V.subNote(mtof(33), 0.3, 0.7 + 0.15 * i), b * BEAT, 0.7));
  mono('fx', V.noiseSweep(riserEnd, 200, 9000, 0.9, 51, 2.2), 0, 0.55, 0);
  mono('pad', V.pad([45, 57, 60, 64, 71].map(mtof), riserEnd, 0.7, 900, 1.0, 0.2, 61), 0, 0.42, 0);
  mono('bass', V.subNote(mtof(33), 2.1, 1), titleAt, 0.7);
}

// End card: Am(add9) at beat 104 (55.714), C at beat 108 (57.857), decaying to silence at 60.0.
export function endCardEvents({ mono, V, mtof }) {
  const a = bt(104), c = bt(108);
  mono('pad', V.pad([45, 57, 60, 64, 71, 76].map(mtof), 2.1, 1.1, 2200, 0.5, 1.4, 77), a, 0.5, 0);
  mono('pad', V.pad([48, 55, 60, 64, 67, 72].map(mtof), 2.0, 1.0, 2000, 0.9, 2.5, 78), c, 0.5, 0);
  mono('bass', V.subNote(mtof(33), 2.3, 0.8), a, 0.6);
  mono('bass', V.subNote(mtof(36), 2.3, 0.7), c + 0.05, 0.5);
  mono('mallet', V.marimba(mtof(81), 0.9, 2.5), a, 0.5, -0.2);
  mono('mallet', V.marimba(mtof(76), 0.8, 2.5), a, 0.4, 0.2);
  mono('mallet', V.marimba(mtof(72), 0.7, 3), c + 0.05, 0.4, 0.1);
}
