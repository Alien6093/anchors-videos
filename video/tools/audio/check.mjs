import { readWav, SR } from './lib.mjs';
const db = (x) => (x > 0 ? (20 * Math.log10(x)).toFixed(1) : '-inf');
for (const f of ['music', 'mix']) {
  const w = readWav(`public/audio/${f}.wav`);
  const rms = (a, b) => { let s = 0, p = 0; const i0 = Math.round(a * SR), i1 = Math.round(b * SR); for (let i = i0; i < i1; i++) { s += w.L[i] ** 2; p = Math.max(p, Math.abs(w.L[i])); } return `rms ${db(Math.sqrt(s / (i1 - i0)))} pk ${db(p)}`; };
  let jump = 0; for (let i = 1; i < w.n; i++) jump = Math.max(jump, Math.abs(w.L[i] - w.L[i - 1]));
  console.log(f, 'n', w.n, 'first', w.L[0], 'last', w.L[w.n - 1], 'max sample jump', jump.toFixed(3), 'clip samples', [...w.L].filter((v) => Math.abs(v) >= 0.9999).length);
  for (const [a, b] of [[0, 0.05], [0, 3.5], [8, 13], [18, 22], [24, 29], [29.5, 33.3], [33.55, 33.95], [34.2, 37], [45, 49], [50, 55], [56, 57], [58, 59], [59.5, 60], [59.9, 60]]) console.log(' ', a, b, rms(a, b));
}
