// node check.mjs <filmDir> <FILM>: QA for the deliverables. Prints duration, loudness, true peak, clipping, boundary samples,
// section RMS (music + mix) against the energy map, silence windows, and transient timing of every SFX cue in the SFX stem (ms and frames at 30 fps).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { readWav, SR } from './lib.mjs';

const [dir, film] = process.argv.slice(2);
const { SECTIONS, MUSIC_HITS } = await import(path.resolve(dir, 'qa-config.mjs'));
const db = (x) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
const fx = (x) => (isFinite(x) ? x.toFixed(1) : '-inf').padStart(6);
const rms = (w, a, b) => { let s = 0; const i0 = Math.round(a * SR), i1 = Math.round(b * SR); for (let i = i0; i < i1; i++) { const m = (w.L[i] + w.R[i]) / 2; s += m * m; } return Math.sqrt(s / (i1 - i0)); };
const ffLoud = (file) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;

let failed = 0;
const assert = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failed++; };
const files = { mix: `${film}_mix.wav`, music: `${film}_music.wav`, sfx: `${film}_sfx.wav` };
const W = {};
for (const [k, f] of Object.entries(files)) {
  const w = W[k] = readWav(path.join(dir, f));
  let jump = 0, clip = 0, pk = 0;
  for (let i = 1; i < w.n; i++) { jump = Math.max(jump, Math.abs(w.L[i] - w.L[i - 1])); if (Math.abs(w.L[i]) >= 0.9999 || Math.abs(w.R[i]) >= 0.9999) clip++; pk = Math.max(pk, Math.abs(w.L[i]), Math.abs(w.R[i])); }
  const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=sample_rate,channels,duration', '-of', 'default=nw=1', path.join(dir, f)], { encoding: 'utf8' }).replace(/\n/g, ' ');
  console.log(`\n${f}: ${probe} samples=${w.n} (${(w.n / SR).toFixed(3)} s) first=${w.L[0]} last=${w.L[w.n - 1]} maxjump=${jump.toFixed(3)} clipped=${clip} samplePeak=${db(pk).toFixed(2)} dBFS`);
  assert(w.n === 60 * SR, `${f} is exactly 60.000 s (${w.n} samples)`);
  assert(clip === 0, `${f} has no clipped samples`);
  if (k !== 'sfx') {
    const out = ffLoud(path.join(dir, f));
    const I = +out.match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0], LRA = out.match(/LRA:\s+([\d.]+) LU/g).pop().match(/[\d.]+/)[0], TP = +out.match(/Peak:\s+(-?[\d.]+) dBFS/g).pop().match(/-?[\d.]+/)[0];
    console.log(`  loudness I=${I} LUFS LRA=${LRA} LU true peak=${TP} dBTP`);
    assert(Math.abs(I - (k === 'mix' ? -14 : -16)) <= 0.3, `${f} integrated loudness ${I} within 0.3 LU of target`);
    assert(TP <= -1.0, `${f} true peak ${TP} dBTP <= -1.0`);
  }
}
console.log('\nSection RMS (mid, dBFS): music.wav | mix.wav');
for (const [a, b, name] of SECTIONS) console.log(`  ${String(a).padStart(7)}-${String(b).padEnd(7)} ${name.padEnd(34)} ${fx(db(rms(W.music, a, b)))} | ${fx(db(rms(W.mix, a, b)))}`);

console.log('\nMusic hit timing (largest 5 ms energy rise near the cue, in music.wav):');
const env = (w, i0, i1, win) => { const o = []; for (let i = i0; i + win <= i1; i += win / 2) { let m = 0; for (let j = i; j < i + win; j++) m = Math.max(m, Math.abs(w.L[j]), Math.abs(w.R[j])); o.push([i, m]); } return o; };
for (const [t, name, span = 0.12] of MUSIC_HITS) {
  const e = env(W.music, Math.round((t - span) * SR), Math.round((t + span) * SR), Math.round(0.005 * SR));
  let best = 0, at = t;
  for (let k = 1; k < e.length; k++) { const r = (e[k][1] + 1e-5) / (e[k - 1][1] + 1e-5); if (r > best) { best = r; at = e[k][0] / SR; } }
  const dMs = (at - t) * 1000;
  console.log(`  ${name.padEnd(38)} cue ${t.toFixed(3)} onset ${at.toFixed(3)} (${dMs >= 0 ? '+' : ''}${dMs.toFixed(0)} ms = ${(dMs / (1000 / 30)).toFixed(2)} frames, rise ${db(best).toFixed(0)} dB)`);
  assert(Math.abs(dMs) <= 1000 / 30, `${name}: music hit within 1 frame of cue`);
}

console.log('\nSFX timing: (a) file attack = first 1 ms window above 10% of the file peak (isolated one-shot); (b) matched filter of the one-shot against the SFX stem near its cue (lag in samples).');
const sheet = fs.readFileSync(path.join(dir, `${film}_cue_sheet.csv`), 'utf8').split('\n').slice(1).map((l) => l.match(/"([^"]*)"/g).map((x) => x.slice(1, -1).replace(/""/g, '"'))).filter((r) => r[3] === 'SFX');
const cuesJson = JSON.parse(fs.readFileSync(path.join(dir, 'sfx-cues.json'), 'utf8'));
const cues = sheet.map((r) => ({ at: +r[0], name: r[6], event: r[5] }));
const SLOW = /whoosh|riser|swish|swell|ramp|whip|spinner|tail|fill|logo|land|peak/;
const ONE_SHOTS = new Map();
const one = (name) => { if (!ONE_SHOTS.has(name)) ONE_SHOTS.set(name, readWav(path.join(dir, 'sfx', `${name}.wav`))); return ONE_SHOTS.get(name); };
const fileAttack = (w) => { let mx = 0; for (let i = 0; i < w.n; i++) mx = Math.max(mx, Math.abs(w.L[i])); const win = Math.round(0.001 * SR); for (let i = 0; i + win < w.n; i += win) { let m = 0; for (let j = i; j < i + win; j++) m = Math.max(m, Math.abs(w.L[j])); if (m > 0.1 * mx) return i / SR; } return 0; };
const G = 4; // decimation for the matched filter
const dec = (arr, a, b) => { const o = new Float32Array(Math.floor((b - a) / G)); for (let i = 0; i < o.length; i++) o[i] = arr[a + i * G]; return o; };
let worstAttack = 0, worstLag = 0, nA = 0, nB = 0;
for (const c of cues) {
  const jc = cuesJson.filter((x) => x.file === `sfx/${c.name}.wav`).sort((a, b) => Math.abs(a.time - c.at) - Math.abs(b.time - c.at))[0];
  if (!jc || Math.abs(jc.time - c.at) > 0.3) { assert(false, `no json cue for ${c.name} @ ${c.at}`); continue; }
  const w = one(c.name);
  if (!SLOW.test(c.name)) {                                      // (a) predicted transient time vs the cue sheet time
    const atk = fileAttack(w), dMs = (jc.time + atk - c.at) * 1000;
    worstAttack = Math.max(worstAttack, Math.abs(dMs)); nA++;
    if (Math.abs(dMs) > 12) console.log(`  attack ${c.at.toFixed(3)} ${c.name}: file attack ${(atk * 1000).toFixed(0)} ms -> hit ${dMs >= 0 ? '+' : ''}${dMs.toFixed(1)} ms vs cue`);
  }
  if (SLOW.test(c.name) || cues.some((o) => o !== c && o.at < c.at + 0.25 && o.at > c.at - 1.5)) continue; // (b) needs a clean, percussive, non-overlapped cue
  // (b) matched filter: where does the stem contain this one-shot? (first 250 ms of the file, +/-40 ms search)
  const segLen = Math.min(w.n, Math.round(0.25 * SR)), s0 = Math.round(jc.time * SR);
  const tpl = dec(w.L, 0, segLen - (segLen % G)), stem = dec(W.sfx.L, Math.max(0, s0 - Math.round(0.04 * SR)), Math.min(W.sfx.n, s0 + segLen + Math.round(0.04 * SR)));
  const maxLag = Math.round(0.04 * SR / G), base = s0 - Math.round(0.04 * SR) < 0 ? 0 : Math.round(0.04 * SR / G);
  let best = -Infinity, bestLag = 0;
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    let acc = 0, e = 0;
    for (let i = 0; i < tpl.length; i++) { const k = base + lag + i; if (k >= 0 && k < stem.length) { acc += tpl[i] * stem[k]; e += stem[k] * stem[k]; } }
    const score = acc / Math.sqrt(e + 1e-12);
    if (score > best) { best = score; bestLag = lag; }
  }
  const lagMs = (bestLag * G / SR) * 1000;
  worstLag = Math.max(worstLag, Math.abs(lagMs)); nB++;
  if (Math.abs(lagMs) > 2) console.log(`  lag ${c.at.toFixed(3)} ${c.name}: ${lagMs.toFixed(1)} ms`);
}
console.log(`  (a) ${nA} percussive/bell cues: worst predicted hit offset vs cue sheet ${worstAttack.toFixed(1)} ms = ${(worstAttack / (1000 / 30)).toFixed(2)} frames`);
console.log(`  (b) ${nB} isolated cues: worst matched-filter lag in the SFX stem ${worstLag.toFixed(2)} ms`);
assert(worstAttack <= 1000 / 30, 'every percussive SFX hit lands within 1 frame (33.3 ms) of its cue time');
assert(worstLag <= 2, 'every SFX one-shot sits in the stem at its cue time (matched filter, within 2 ms)');
console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL CHECKS PASSED');
process.exit(failed ? 1 : 0);
