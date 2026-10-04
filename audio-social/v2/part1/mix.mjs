// Combines music layer buses + SFX class buses into a variant's pre-master music/sfx stems (float32 raw, stereo interleaved).
// Applies: kick sidechain (bass 8 dB / harm 6 dB / lead 4 dB, 110 ms), energy curve, pre-hit holes, T1 SFX ducks.
//   node mix.mjs 916|45   (also reads build/mixcfg.json for hand-tuned bus gains)
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SR, SVF } from './lib.mjs';
import { TOTAL, ENERGY, HOLES } from './grid.mjs';
import { cues } from './cues.mjs';

const variant = process.argv[2] || '916';
const OUT = fileURLToPath(new URL('./build/', import.meta.url));
const cfg = JSON.parse(fs.readFileSync(OUT + 'mixcfg.json', 'utf8'));
const V45 = variant === '45';
const rd = (f) => { const b = fs.readFileSync(OUT + f); const L = new Float32Array(TOTAL), R = new Float32Array(TOTAL); for (let i = 0; i < TOTAL; i++) { L[i] = b.readFloatLE(i * 8); R[i] = b.readFloatLE(i * 8 + 4); } return { L, R }; };
const dB = (d) => 10 ** (d / 20);
const kicks = JSON.parse(fs.readFileSync(OUT + 'kicks.json', 'utf8'));
// sidechain curve for a depth (dB) and release (s)
function scCurve(depthDb, rel = 0.11) {
  const g = new Float32Array(TOTAL).fill(1), d = dB(-depthDb), atk = Math.round(0.004 * SR), r = Math.round(rel * SR);
  for (const k of kicks) { if (k.vel < 0.5) continue; const dd = 1 - (1 - d) * Math.min(1, k.vel); for (let i = 0; i < atk + r; i++) { const s = k.at + i; if (s >= TOTAL) break; const w = i < atk ? 1 - (1 - dd) * (i / atk) : 1 - (1 - dd) * (1 - (0.5 - 0.5 * Math.cos(Math.PI * (i - atk) / r))) ; g[s] = Math.min(g[s], w); } }
  return g;
}
// energy curve (dB), ramps +-0.125 s around the second boundaries
const cap = V45 ? 7 : 10, perLevel = cfg.energyDbPerLevel;
const eDb = (s) => (Math.min(ENERGY[Math.min(47, Math.max(0, s))], cap) - 10) * perLevel;
const energy = new Float32Array(TOTAL);
for (let i = 0; i < TOTAL; i++) { const t = i / SR, s = Math.floor(t), fr = t - s; let d = eDb(s); if (fr < 0.125 && s > 0) d = eDb(s - 1) + (eDb(s) - eDb(s - 1)) * (0.5 + fr / 0.25); else if (fr > 0.875 && s < 47) d = eDb(s) + (eDb(s + 1) - eDb(s)) * ((fr - 0.875) / 0.25); energy[i] = dB(d); }
// holes
const holeG = new Float32Array(TOTAL).fill(1);
for (const h of HOLES) { let a = h.a, b = h.b; if (V45 && b - a > 0.03) a = b - 0.03; const i0 = Math.round(a * SR), i1 = Math.round(b * SR), f = Math.round(0.004 * SR); for (let i = i0 - f; i < i1 + f; i++) { if (i < 0 || i >= TOTAL) continue; const w = i < i0 ? 1 - (i - (i0 - f)) / f : i >= i1 ? (i - i1) / f : 0; holeG[i] = Math.min(holeG[i], Math.max(0, w)); } }
const DUCK_DB = { 'hook-slam': 12, 'drop-impact': 14, 'pay-restart': 8, 'light-burst': 8, 'logo-sting': 6, 'hook-land-A5': 6, 'hit-stop-lock': 5, 'phrase-hit-1': 4 };
// T1 ducks of the music from hit cues (V45 ducks half as deep in dB)
const duck = new Float32Array(TOTAL).fill(1);
for (const c of cues) {
  if (c.tier !== 'T1' || c.cls !== 'hit') continue;
  const dd = dB(-(V45 ? 0.5 : 1) * (DUCK_DB[c.id] ?? 3.5)), a0 = Math.round((c.t - 0.02) * SR), atk = Math.round(0.02 * SR), hold = Math.round((c.id === 'drop-impact' ? 0.2 : 0.12) * SR), rel = Math.round(0.25 * SR);
  for (let i = 0; i < atk + hold + rel; i++) { const s = a0 + i; if (s < 0 || s >= TOTAL) continue; const w = i < atk ? i / atk : i < atk + hold ? 1 : 1 - (i - atk - hold) / rel; duck[s] = Math.min(duck[s], 1 - (1 - dd) * w); }
}
const music = { L: new Float32Array(TOTAL), R: new Float32Array(TOTAL) };
const scDepth = { kick: 0, perc: 0, bass: 8, harm: 6, lead: 4 };
for (const k of ['kick', 'perc', 'bass', 'harm', 'lead']) {
  const b = rd(`music_${k}.f32`), sc = scDepth[k] ? scCurve(scDepth[k]) : null, g = dB(cfg.bus[k]);
  for (let i = 0; i < TOTAL; i++) { const m = g * (sc ? sc[i] : 1); music.L[i] += b.L[i] * m; music.R[i] += b.R[i] * m; }
}
for (let i = 0; i < TOTAL; i++) { const m = energy[i] * holeG[i] * duck[i]; music.L[i] *= m; music.R[i] *= m; }
const sfx = { L: new Float32Array(TOTAL), R: new Float32Array(TOTAL) };
const clsDb = { hit: cfg.sfx.hit + (V45 ? -11 : 0), trans: cfg.sfx.trans + (V45 ? -4 : 0), swell: cfg.sfx.swell + (V45 ? -8 : 0), ui: cfg.sfx.ui + (V45 ? -1 : 0) };
for (const k of Object.keys(clsDb)) { const b = rd(`sfx_${k}.f32`), g = dB(clsDb[k]); for (let i = 0; i < TOTAL; i++) { sfx.L[i] += b.L[i] * g; sfx.R[i] += b.R[i] * g; } }
// the 45 mix drops the reverse-crash and tease swells entirely is handled by the swell class gain (-8 dB below its 916 level)
const wr = (name, m) => { const buf = Buffer.alloc(TOTAL * 8); for (let i = 0; i < TOTAL; i++) { buf.writeFloatLE(m.L[i], i * 8); buf.writeFloatLE(m.R[i], i * 8 + 4); } fs.writeFileSync(OUT + name, buf); };
// loop seam: 2 ms taper on the last samples so the final sample is ~0 (the pickup SFX already ends tapered)
{ const z = Math.round(0.002 * SR); for (let i = 0; i < z; i++) { const k = i / z; for (const m of [music, sfx]) { m.L[TOTAL - 1 - i] *= k; m.R[TOTAL - 1 - i] *= k; } } }
wr(`${variant}_music.f32`, music); wr(`${variant}_sfx.f32`, sfx);
const mix = { L: music.L.map((v, i) => v + sfx.L[i]), R: music.R.map((v, i) => v + sfx.R[i]) };
wr(`${variant}_pre.f32`, mix);
let pk = 0; for (let i = 0; i < TOTAL; i++) pk = Math.max(pk, Math.abs(mix.L[i]), Math.abs(mix.R[i]));
console.log(variant, 'pre-master peak', pk.toFixed(3));
