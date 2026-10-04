import { fileURLToPath } from 'node:url';
import { writeWav, peakOf } from './part1/lib.mjs';
import { renderAnchorMotif } from './anchor-voice.mjs';
const s = renderAnchorMotif(); const g = 0.5 / peakOf(s.L, s.R);
writeWav(fileURLToPath(new URL('./anchor-motif.wav', import.meta.url)), s.L.map((v) => v * g), s.R.map((v) => v * g), 24);
console.log('anchor-motif.wav', s.n / 48000, 's');
