// node qa-peaks.mjs <filmDir> <FILM>: where does the limiter work? per-second premix peak + master gain, listing seconds that exceed the ceiling.
import fs from 'node:fs';
import path from 'node:path';
import { readWav, SR } from './lib.mjs';
const [dir, film] = process.argv.slice(2);
const w = readWav(path.join(dir, 'build/mix_pre.wav'));
const gdb = Number(fs.readFileSync(path.join(dir, `${film}_mix.gain`), 'utf8'));
const G = 10 ** (gdb / 20);
const rows = [];
for (let sec = 0; sec < 60; sec++) {
  let pk = 0;
  for (let i = sec * SR; i < (sec + 1) * SR; i++) pk = Math.max(pk, Math.abs(w.L[i]), Math.abs(w.R[i]));
  const reduction = 20 * Math.log10(Math.max(1e-9, pk * G) / 0.84);
  if (reduction > 0.5) rows.push(`${sec}s: pre-limiter peak ${(20 * Math.log10(pk * G)).toFixed(1)} dBFS, reduction ${reduction.toFixed(1)} dB`);
}
console.log(`master gain ${gdb.toFixed(2)} dB\n${rows.join('\n') || 'no limiting above 0.5 dB'}`);
