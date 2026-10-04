// Section RMS / peak report for public/audio/{music,mix}.wav, plus boundary and clip checks.
import { readWav, SR } from './lib.mjs';
const db = (x) => (x > 0 ? (20 * Math.log10(x)).toFixed(1) : '-inf');
const SECTIONS = [[0, 1.6, 'E2 teaser'], [1.6, 1.9, 'smash black'], [1.9, 4.29, 'E2 title'], [4.5, 8.5, 'E4 kick+pluck'], [9, 15, 'E4 hats/sweep'], [15.6, 23, 'E5 marimba'],
  [23.1, 40.4, 'E6 groove'], [40.6, 41.9, 'DIP 1.5s'], [43.5, 49.4, 'E6 lift'], [50, 66, 'E5 arpeggio'], [70.0, 70.5, 'SILENCE pay'], [71.0, 75, 'E8 C major'],
  [75.2, 82.4, 'E5 restart'], [83, 96, 'E6 groove'], [96.2, 103.2, 'E5-4 thin'], [103.4, 104.4, 'NEAR-SILENCE'], [105.2, 110, 'E9 gold'],
  [110.2, 113.4, 'E8 dates'], [115.2, 120, 'E10 PEAK'], [120.1, 121.4, 'breath'], [124.4, 132, 'E8 crest'], [132.2, 139.9, 'E5 comments'], [140.2, 145.4, 'E5 audience'], [146, 148, 'E2 chord'], [149.5, 150, 'tail']];
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['music', 'mix'];
for (const f of files) {
  const w = readWav(`public/audio/${f}.wav`);
  let jump = 0, clip = 0;
  for (let i = 1; i < w.n; i++) { jump = Math.max(jump, Math.abs(w.L[i] - w.L[i - 1])); if (Math.abs(w.L[i]) >= 0.9999) clip++; }
  console.log(`${f}: n=${w.n} (${(w.n / SR).toFixed(3)}s) first=${w.L[0]} last=${w.L[w.n - 1]} maxjump=${jump.toFixed(3)} clipped=${clip}`);
  for (const [a, b, name] of SECTIONS) {
    let s = 0, p = 0;
    const i0 = Math.round(a * SR), i1 = Math.round(b * SR);
    for (let i = i0; i < i1; i++) { const m = (w.L[i] + w.R[i]) / 2; s += m * m; p = Math.max(p, Math.abs(w.L[i])); }
    console.log(`  ${String(a).padStart(6)}-${String(b).padEnd(6)} ${name.padEnd(15)} rms ${db(Math.sqrt(s / (i1 - i0))).padStart(6)} pk ${db(p).padStart(6)}`);
  }
}
