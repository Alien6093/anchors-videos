// node stems.mjs <filmDir> <FILM>: exports <FILM>_sfx.wav = SFX part scaled by the same static gain that mastering
// applied to the mix (read from <FILM>_mix.gain), so music-in-mix + sfx stem reproduce <FILM>_mix.wav up to the limiter.
import fs from 'node:fs';
import path from 'node:path';
import { readWav, writeWav } from './lib.mjs';
const [dir, film] = process.argv.slice(2);
const sfx = readWav(path.join(dir, 'build/sfx_part.wav'));
const dB = Number(fs.readFileSync(path.join(dir, `${film}_mix.gain`), 'utf8'));
let G = 10 ** (dB / 20);
let pk = 0;
for (let i = 0; i < sfx.n; i++) pk = Math.max(pk, Math.abs(sfx.L[i]), Math.abs(sfx.R[i]));
// the stem is not limited: if it would exceed -1 dBFS on its own, trim it (the trim is reported, not hidden)
const trim = pk * G > 0.89 ? 0.89 / (pk * G) : 1;
G *= trim;
writeWav(path.join(dir, `${film}_sfx.wav`), sfx.L.map((v) => v * G), sfx.R.map((v) => v * G), 24);
console.log(`master gain ${dB.toFixed(2)} dB, stem trim ${(20 * Math.log10(trim)).toFixed(2)} dB; wrote ${film}_sfx.wav`);
