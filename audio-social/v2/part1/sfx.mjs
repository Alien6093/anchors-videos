// Renders the SFX class buses (hit/trans/swell/ui) from cues.mjs. Each voice is peak-normalised to 1.0, then trimmed by the cue gain (dB).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SR, SVF } from './lib.mjs';
import { TOTAL } from './grid.mjs';
import { cues } from './cues.mjs';

const CLS = ['hit', 'trans', 'swell', 'ui'];
const buses = Object.fromEntries(CLS.map((c) => [c, { L: new Float32Array(TOTAL + SR), R: new Float32Array(TOTAL + SR) }]));
const log = [];
for (const c of cues) {
  let v = c.build(); const L = Float32Array.from(v.L || v), R = Float32Array.from(v.R || v);
  const hpL = new SVF(), hpR = new SVF();                       // SFX never carry sub: HP 120 Hz
  for (let i = 0; i < L.length; i++) { hpL.run(L[i], 120, 0.7); hpR.run(R[i], 120, 0.7); L[i] = hpL.hp; R[i] = hpR.hp; }
  let pk = 0; for (let i = 0; i < L.length; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  if (c.cls === 'hit' && c.tier === 'T1') { // dense hits: saturate (peak-preserving) so RMS/peak survives the master limiter
    const dr = 2.4, nrm = Math.tanh(dr); for (let i = 0; i < L.length; i++) { L[i] = Math.tanh((L[i] / pk) * dr) / nrm * pk; R[i] = Math.tanh((R[i] / pk) * dr) / nrm * pk; }
  }
  const g = (10 ** (c.db / 20)) / (pk || 1);
  const a = ((c.pan + 1) * Math.PI) / 4, gl = Math.cos(a) * Math.SQRT2, gr = Math.sin(a) * Math.SQRT2;
  const start = Math.round(c.t * SR) - (c.endAt ? L.length : 0) + (c.offSamples || 0);
  const B = buses[c.cls];
  for (let i = 0; i < L.length; i++) { const s = start + i; if (s < 0 || s >= B.L.length) continue; B.L[s] += L[i] * g * gl; B.R[s] += R[i] * g * gr; }
  log.push({ id: c.id, start: start / SR, len: L.length / SR });
}
const OUT = fileURLToPath(new URL('./build/', import.meta.url));
for (const k of CLS) { const b = buses[k]; const buf = Buffer.alloc(TOTAL * 8); for (let i = 0; i < TOTAL; i++) { buf.writeFloatLE(b.L[i], i * 8); buf.writeFloatLE(b.R[i], i * 8 + 4); } fs.writeFileSync(OUT + `sfx_${k}.f32`, buf); }
fs.writeFileSync(OUT + 'sfx-log.json', JSON.stringify(log, null, 1));
console.log('sfx cues:', cues.length);
