// node qa-where.mjs <filmDir> <t0> <t1>: peak of music part vs sfx part inside a window (pre-master scale)
import path from 'node:path';
import { readWav, SR } from './lib.mjs';
const [dir, a, b] = process.argv.slice(2);
for (const n of ['music_part', 'sfx_part']) {
  const w = readWav(path.join(dir, `build/${n}.wav`));
  let pk = 0, at = 0;
  for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { const v = Math.max(Math.abs(w.L[i]), Math.abs(w.R[i])); if (v > pk) { pk = v; at = i / SR; } }
  console.log(n, pk.toFixed(3), 'at', at.toFixed(3));
}
