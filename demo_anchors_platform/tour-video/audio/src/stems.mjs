// node src/stems.mjs <buildDir> <outDir>: stems/music.wav and stems/sfx.wav = the two parts of the pre-master mix
// (music already ducked) times the static gain mastering applied to the mix, so music + sfx ~= mix.wav (before the
// limiter, which only acts on a few peaks), up to one common trim reported in build/stems.json.
import fs from 'node:fs';
import path from 'node:path';
import { readWav, writeWav } from './lib.mjs';
const [dir, out] = process.argv.slice(2);
const dB = Number(fs.readFileSync(path.join(dir, 'mix.gain'), 'utf8'));
const report = {};
// one common gain for both stems (so music.wav + sfx.wav = pre-limiter mix x a constant); trimmed only if either
// stem alone would exceed -1.3 dBFS sample peak
const parts = [['music_part', 'music'], ['sfx_part', 'sfx']].map(([part, name]) => ({ name, w: readWav(path.join(dir, `${part}.wav`)) }));
let G = 10 ** (dB / 20), pk = 0;
for (const { w } of parts) for (let i = 0; i < w.n; i++) pk = Math.max(pk, Math.abs(w.L[i]), Math.abs(w.R[i]));
const trim = pk * G > 0.86 ? 0.86 / (pk * G) : 1;
G *= trim;
for (const { name, w } of parts) writeWav(path.join(out, `${name}.wav`), w.L.map((v) => v * G), w.R.map((v) => v * G), 24);
report.gain_dB = +(20 * Math.log10(G)).toFixed(2); report.trim_dB = +(20 * Math.log10(trim)).toFixed(2); report.master_gain_dB = +dB.toFixed(2);
fs.writeFileSync(path.join(dir, 'stems.json'), JSON.stringify(report));
console.log('stems', JSON.stringify(report));
