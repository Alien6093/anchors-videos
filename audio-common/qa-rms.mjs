// node qa-rms.mjs <filmDir>: per-second RMS (dBFS) of music part vs sfx part inside the mix, to judge balance.
import path from 'node:path';
import { readWav, SR } from './lib.mjs';
const dir = process.argv[2];
const m = readWav(path.join(dir, 'build/music_part.wav')), s = readWav(path.join(dir, 'build/sfx_part.wav'));
const db = (x) => (x > 1e-9 ? (20 * Math.log10(x)).toFixed(1) : '-inf').padStart(6);
let out = 'sec  music   sfx   sfxPk\n';
for (let sec = 0; sec < 60; sec++) {
  let a = 0, b = 0, pk = 0;
  for (let i = sec * SR; i < (sec + 1) * SR; i++) { a += ((m.L[i] + m.R[i]) / 2) ** 2; const v = (s.L[i] + s.R[i]) / 2; b += v * v; pk = Math.max(pk, Math.abs(s.L[i])); }
  out += `${String(sec).padStart(3)} ${db(Math.sqrt(a / SR))} ${db(Math.sqrt(b / SR))} ${db(pk)}\n`;
}
console.log(out);
