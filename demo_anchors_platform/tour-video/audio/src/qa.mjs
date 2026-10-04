// node src/qa.mjs : measures the deliverables and writes qa.txt (+ qa/rms.ppm for qa-images.sh).
// Checks: format/duration, loudness (ffmpeg ebur128 I/LRA/true peak), sample peak, clipping, DC offset, head/tail
// silence, discontinuity scan, limiter alignment, cue sync (onsets measured in the SFX stem), downbeats in the
// music stem, per-section and per-second RMS. Exit code 1 if any hard check fails.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readWav, SR } from './lib.mjs';
import * as T from './timing.mjs';

const A = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = (f) => path.join(A, f);
const lines = [];
const log = (s = '') => lines.push(s);
let failed = 0;
const check = (ok, msg) => { log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failed++; };
const db = (x) => (x > 1e-12 ? 20 * Math.log10(x) : -Infinity);
const f1 = (x, w = 6) => (isFinite(x) ? x.toFixed(1) : '-inf').padStart(w);
const ebur = (file) => {
  const o = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const sum = o.slice(o.lastIndexOf('Summary:'));
  const g = (re) => +(sum.match(re)?.[1] ?? NaN);
  return { I: g(/I:\s+(-?[\d.]+) LUFS/), LRA: g(/LRA:\s+([\d.]+) LU/), TP: g(/Peak:\s+(-?[\d.inf]+) dBFS/) };
};
const astats = (file) => {
  const o = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'astats=measure_overall=DC_offset+Peak_level+RMS_level+Number_of_samples:measure_perchannel=none', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const g = (re) => o.match(re)?.[1];
  return { dc: g(/DC offset:\s*(-?[\d.e-]+)/), peak: g(/Peak level dB:\s*(-?[\d.inf]+)/), rms: g(/RMS level dB:\s*(-?[\d.inf]+)/), n: g(/Number of samples:\s*(\d+)/) };
};
const probe = (file) => spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels,bits_per_sample,duration', '-of', 'default=nw=1', file], { encoding: 'utf8' }).stdout.trim().replace(/\n/g, ' ');

const cues = JSON.parse(fs.readFileSync(P('build/cues.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(P('build/music_raw.plan.json'), 'utf8'));
const W = { mix: readWav(P('mix.wav')), music: readWav(P('stems/music.wav')), sfx: readWav(P('stems/sfx.wav')) };
const NEXP = Math.round(T.DUR * SR);

log(`ANCHORS PLATFORM TOUR (120 s) - AUDIO QA   generated ${new Date().toISOString()}`);
log(`timeline: ${path.relative(A, T.TIMELINE)}  duration ${T.DUR} s, ${T.shots.length} shots, ${T.chapters.length} chapters, end card ${T.END_T} s`);
log('');
log('== FILES ==');
for (const [k, f] of [['mix', 'mix.wav'], ['music', 'stems/music.wav'], ['sfx', 'stems/sfx.wav'], ['public', '../project/public/audio/mix.wav']]) {
  const file = P(f);
  if (!fs.existsSync(file)) { check(false, `${f} exists`); continue; }
  const w = k === 'public' ? readWav(file) : W[k];
  const e = ebur(file), st = astats(file);
  let clip = 0, pk = 0, sum = 0;
  for (let i = 0; i < w.n; i++) { const a = Math.abs(w.L[i]), b = Math.abs(w.R[i]); if (a >= 0.9999 || b >= 0.9999) clip++; pk = Math.max(pk, a, b); sum += w.L[i] + w.R[i]; }
  let tail = 0; for (let i = w.n - Math.round(0.05 * SR); i < w.n; i++) tail = Math.max(tail, Math.abs(w.L[i]), Math.abs(w.R[i]));
  const size = fs.statSync(file).size;
  log(`${f}`);
  log(`   ${probe(file)}  size ${(size / 1e6).toFixed(1)} MB`);
  log(`   samples ${w.n} = ${(w.n / SR).toFixed(3)} s | integrated ${e.I} LUFS | LRA ${e.LRA} LU | true peak ${e.TP} dBTP | sample peak ${db(pk).toFixed(2)} dBFS | clipped samples ${clip}`);
  log(`   astats: DC offset ${st.dc}, peak ${st.peak} dBFS, RMS ${st.rms} dBFS | first sample ${w.L[0].toFixed(6)} | max |x| in last 50 ms ${tail.toExponential(2)}`);
  check(w.n === NEXP, `${f}: exactly ${T.DUR.toFixed(3)} s (${w.n} samples @ 48 kHz)`);
  check(clip === 0, `${f}: no clipped samples`);
  check(Math.abs(sum / (2 * w.n)) < 1e-4, `${f}: DC offset ${(sum / (2 * w.n)).toExponential(2)} (< 1e-4)`);
  check(size < 50e6, `${f}: < 50 MB`);
  if (k === 'mix' || k === 'public') {
    check(Math.abs(e.I + 14) <= 0.5, `${f}: integrated loudness ${e.I} LUFS within -14 +/- 0.5`);
    check(e.TP <= -1.0, `${f}: true peak ${e.TP} dBTP <= -1.0`);
    check(tail < 1e-4, `${f}: ends in silence (last 50 ms max ${db(tail).toFixed(1)} dBFS)`);
  }
}
{ // public copy identical
  const a = fs.readFileSync(P('mix.wav')), b = fs.readFileSync(P('../project/public/audio/mix.wav'));
  check(a.equals(b), 'project/public/audio/mix.wav is byte-identical to audio/mix.wav');
}

// limiter alignment: mix.wav vs pre-master (should be 0-sample offset)
{
  const pre = readWav(P('build/mix_pre.wav'));
  const i0 = Math.round(T.ACTIVATION_T ? T.ACTIVATION_T * SR : 30 * SR) - 4800, len = 9600;
  let best = -Infinity, bl = 0;
  for (let lag = -400; lag <= 400; lag++) { let s = 0; for (let i = 0; i < len; i += 2) s += pre.L[i0 + i] * W.mix.L[i0 + i + lag]; if (s > best) { best = s; bl = lag; } }
  log(`   mastering alignment: mix.wav vs pre-master cross-correlation lag ${bl} samples`);
  check(bl === 0, 'mastering adds no delay (limiter latency compensated)');
}

// stems null test: mix - (music + sfx) / common stem trim  -> only the limiter / soft-clip difference should remain
{
  const st = JSON.parse(fs.readFileSync(P('build/stems.json'), 'utf8'));
  const k = 10 ** (-st.trim_dB / 20);
  let r = 0, m = 0;
  for (let i = 0; i < W.mix.n; i++) { const d = W.mix.L[i] - (W.music.L[i] + W.sfx.L[i]) * k; r += d * d; m += W.mix.L[i] ** 2; }
  log(`   stems: common gain ${st.gain_dB} dB (mastering gain ${st.master_gain_dB} dB, trim ${st.trim_dB} dB); null test mix - (music+sfx)x${k.toFixed(3)}: residual ${(10 * Math.log10(r / m)).toFixed(1)} dB below the mix`);
  check(10 * Math.log10(r / m) < -30, 'stems sum to the mix (residual from the limiter only, < -30 dB)');
}

// discontinuity scan: 2nd difference spikes that are not explained by a cue, a kick/hit or a step onset
{
  log('');
  log('== CLICK / DISCONTINUITY SCAN (mix.wav) ==');
  const w = W.mix, win = Math.round(0.01 * SR);
  const ev = [...cues.map((c) => c.t), ...cues.map((c) => c.start), ...T.bars.flatMap((b) => Array.from({ length: b.len * 4 }, (_, k) => b.t0 + (k * b.beatDur) / 4)), ...T.hookHits];
  const hits = [];
  let e2 = 0;
  const d2 = (i) => Math.abs(w.L[i] - 2 * w.L[i - 1] + w.L[i - 2]) + Math.abs(w.R[i] - 2 * w.R[i - 1] + w.R[i - 2]);
  for (let i = 2; i < w.n; i++) { const v = d2(i); e2 = 0.999 * e2 + 0.001 * v; if (v > 0.08 && v > 25 * e2) hits.push([i, v, e2]); }
  const unexplained = hits.filter(([i]) => !ev.some((t) => Math.abs(t - i / SR) < 0.03));
  log(`   samples whose 2nd difference exceeds 25x the running average (and 0.08): ${hits.length}; not within 30 ms of a cue or 16th-note grid onset: ${unexplained.length}`);
  for (const [i, v] of unexplained.slice(0, 10)) log(`     ${(i / SR).toFixed(4)} s  d2=${v.toFixed(3)}`);
  check(unexplained.length === 0, 'no unexplained discontinuities (clicks/pops) in the mix');
}

// cue sync: (a) heard time of every cue = placement + the attack/peak measured on its own rendered one-shot
// (written by sfx.mjs); (b) onset measured directly in stems/sfx.wav for percussive cues with no other cue within 0.3 s
{
  log('');
  log('== CUE SYNC ==');
  let worstA = 0;
  for (const c of cues) worstA = Math.max(worstA, Math.abs(c.heard - c.t));
  log(`   (a) all ${cues.length} cues: |heard - timeline time| max ${(worstA * 1000).toFixed(1)} ms (heard = transient for hits/pops/clicks/chimes, envelope peak for whooshes, arrival for risers)`);
  check(worstA <= 1 / T.FPS, 'every SFX cue is heard within 1 frame of its timeline time');
  const w = W.sfx, win = 48;
  const lvl = (i) => { let m = 0; for (let j = i; j < i + win; j++) m = Math.max(m, Math.abs(w.L[j]), Math.abs(w.R[j])); return m; };
  let worst = 0, n = 0;
  for (const c of cues) {
    if (!['hit', 'pop', 'click', 'impact', 'success', 'bell'].includes(c.type)) continue;
    if (cues.some((o) => o !== c && Math.abs(o.t - c.t) < 0.3) || cues.some((o) => o !== c && o.start < c.t + 0.3 && o.start > c.t - 1.2 && ['whoosh', 'zoom'].includes(o.type))) continue;
    const i0 = Math.round((c.t - 0.05) * SR), i1 = Math.round((c.t + 0.15) * SR);
    let mx = 0; for (let i = i0; i < i1; i += win) mx = Math.max(mx, lvl(i));
    let at = null; for (let i = i0; i < i1; i += win) if (lvl(i) > 0.3 * mx) { at = i / SR; break; }
    const d = (at - c.t) * 1000; worst = Math.max(worst, Math.abs(d)); n++;
  }
  log(`   (b) ${n} isolated percussive cues measured in stems/sfx.wav: worst onset offset ${worst.toFixed(1)} ms (${(worst / (1000 / T.FPS)).toFixed(2)} frames)`);
  check(worst <= 1000 / T.FPS, 'isolated cue onsets in the SFX stem within 1 frame of the timeline');
}

// downbeats / section starts in the music stem: onset of the low band (< 150 Hz: kick + sub) around each anchor
{
  log('');
  log('== MUSIC DOWNBEATS ON ANCHORS (stems/music.wav, low-band onset) ==');
  const w = W.music, k = 1 - Math.exp((-2 * Math.PI * 150) / SR);
  for (const t of [...T.hookHits, ...T.anchors]) {
    const i0 = Math.max(0, Math.round((t - 0.25) * SR)), i1 = Math.round((t + 0.06) * SR), win = 48;
    let y = 0, prev = 1e-6, best = 0, at = t; const env = [];
    for (let i = i0; i < i1; i++) { y += k * ((w.L[i] + w.R[i]) / 2 - y); if ((i - i0) % win === 0) env.push([i / SR, 0]); env[env.length - 1][1] = Math.max(env[env.length - 1][1], Math.abs(y)); }
    // onset = first 1 ms window in [t-50 ms, t+60 ms] whose low-band level exceeds 60 % of that span's maximum,
    // compared with the level 50-100 ms before (rise)
    const span = env.filter(([tt]) => tt >= t - 0.05);
    const mx = Math.max(...span.map((x) => x[1]));
    const hit = span.find(([, m]) => m >= 0.6 * mx);
    at = hit[0];
    const pre = env.filter(([tt]) => tt < at - 0.05 && tt >= at - 0.1).reduce((a, x) => Math.max(a, x[1]), 1e-9);
    best = mx / pre;
    const d = (at - t) * 1000;
    log(`   ${t.toFixed(3).padStart(8)} s  onset ${at.toFixed(3)}  (${d >= 0 ? '+' : ''}${d.toFixed(1)} ms, rise ${db(best) > 60 ? ">60" : db(best).toFixed(0)} dB)`);
    check(Math.abs(d) <= 1000 / T.FPS, `music downbeat at ${t.toFixed(2)} s within 1 frame`);
  }
}

// structure
log('');
log('== TEMPO MAP (derived from timeline chapters) ==');
for (const s of plan.spans) log(`   ${s.t0.toFixed(2).padStart(7)}-${s.t1.toFixed(2).padEnd(7)} ${String(s.beats).padStart(3)} beats @ ${s.bpm.toFixed(2)} BPM (${Math.floor(s.beats / 4)} bars of 4/4${s.beats % 4 ? ` + ${s.beats % 4}-beat pickup` : ''})`);
log('');
log('== ARRANGEMENT / SECTION LEVELS (mid RMS dBFS; music stem | sfx stem | mix) ==');
const rmsOf = (w, a, b) => { let s = 0; const i0 = Math.round(a * SR), i1 = Math.round(b * SR); for (let i = i0; i < i1; i++) { const m = (w.L[i] + w.R[i]) / 2; s += m * m; } return Math.sqrt(s / Math.max(1, i1 - i0)); };
const secs = [{ name: 'Hook', t0: 0, t1: T.HOOK_END, chords: 'hits I vi IV V I', key: 'D', bars: '-' }, ...plan.sections, { name: 'End', t0: T.END_T, t1: T.DUR, chords: 'I (Emaj9) ring-out', key: 'E', bars: '-' }];
for (const s of secs) log(`   ${s.name.padEnd(5)} ${s.t0.toFixed(2).padStart(7)}-${s.t1.toFixed(2).padEnd(7)} key ${s.key} bars ${String(s.bars).padStart(2)}  ${s.chords.padEnd(34)} ${f1(db(rmsOf(W.music, s.t0, s.t1)))} | ${f1(db(rmsOf(W.sfx, s.t0, s.t1)))} | ${f1(db(rmsOf(W.mix, s.t0, s.t1)))}`);
{
  const act = (a, b) => db(rmsOf(W.music, a, b));
  const L = act(T.HOOK_END, T.actStart('Run')), Rn = act(T.actStart('Run'), T.actStart('Measure')), M = act(T.actStart('Measure'), T.END_T);
  const L1 = act(T.HOOK_END, T.HOOK_END + 10), Llast = act(T.actStart('Run') - 10, T.actStart('Run'));
  log(`   act averages (music): Launch ${L.toFixed(1)} (first 10 s ${L1.toFixed(1)}, last 10 s ${Llast.toFixed(1)}) | Run ${Rn.toFixed(1)} | Measure ${M.toFixed(1)}`);
  check(L1 < Llast && Llast <= M && Rn < M, 'music builds: Launch rises across the act and Measure is the loudest act');
  const endR = db(rmsOf(W.mix, T.DUR - 0.5, T.DUR)), endR2 = db(rmsOf(W.mix, T.END_T + 0.1, T.END_T + 1.5));
  log(`   ending: mix RMS ${endR2.toFixed(1)} dBFS just after the end-card sting, ${endR.toFixed(1)} dBFS in the last 0.5 s`);
  check(endR < -60, 'ending fades to silence (last 0.5 s below -60 dBFS RMS)');
}

// per-second RMS table + plot data
log('');
log('== PER-SECOND RMS (mid dBFS): music stem | sfx stem | mix ==');
const perSec = [];
for (let s = 0; s < Math.ceil(T.DUR); s++) perSec.push([s, db(rmsOf(W.music, s, Math.min(T.DUR, s + 1))), db(rmsOf(W.sfx, s, Math.min(T.DUR, s + 1))), db(rmsOf(W.mix, s, Math.min(T.DUR, s + 1)))]);
for (let r = 0; r < perSec.length; r += 4) log('   ' + perSec.slice(r, r + 4).map(([s, a, b, c]) => `${String(s).padStart(3)}s ${f1(a)} ${f1(b)} ${f1(c)}`).join('  |'));

// cue list
log('');
log(`== CUE LIST (${cues.length} SFX cues; time = moment heard; frame @ ${T.FPS} fps) ==`);
const counts = cues.reduce((m, c) => ((m[c.type] = (m[c.type] ?? 0) + 1), m), {});
log('   counts: ' + Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', '));
log('   time_s   frame  type     gain  duck_dB  heard_ms  reason');
for (const c of cues) log(`   ${c.t.toFixed(3).padStart(7)}  ${String(Math.round(c.t * T.FPS)).padStart(5)}  ${c.type.padEnd(8)} ${c.gain.toFixed(2)}  ${String(c.duck[0]).padStart(5)}  ${(((c.heard - c.t) * 1000) >= 0 ? '+' : '') + ((c.heard - c.t) * 1000).toFixed(1).padStart(5)}    ${c.reason}`);
log('');
log('== MUSIC CUES (score events) ==');
for (const s of plan.sections) log(`   ${s.t0.toFixed(3).padStart(7)}  section ${s.name.padEnd(5)} (${s.chords}) key ${s.key}`);
log(`   ${T.END_T.toFixed(3).padStart(7)}  end-card resolve: Emaj9 stab + pad + sub + bells, ring-out, digital silence from ${(T.DUR - 0.1).toFixed(2)} s`);
log('');
log(`RESULT: ${failed ? `${failed} CHECK(S) FAILED` : 'ALL CHECKS PASSED'}`);
fs.writeFileSync(P('qa.txt'), lines.join('\n') + '\n');

// RMS plot (10 Hz resolution) as PPM -> PNG by qa-images.sh
{
  const Wd = 1200, H = 360, img = Buffer.alloc(Wd * H * 3, 255);
  const px = (x, y, [r, g, b]) => { if (x < 0 || y < 0 || x >= Wd || y >= H) return; const o = (y * Wd + x) * 3; img[o] = r; img[o + 1] = g; img[o + 2] = b; };
  const yOf = (d) => Math.round(((-6 - Math.max(-66, Math.min(-6, d))) / 60) * (H - 1));
  for (let d = -6; d >= -66; d -= 6) for (let x = 0; x < Wd; x++) px(x, yOf(d), [225, 225, 225]);
  for (const t of [T.HOOK_END, ...T.chapters.map((c) => c.tIn), T.END_T]) for (let y = 0; y < H; y += 2) px(Math.round((t / T.DUR) * Wd), y, [190, 190, 190]);
  for (const t of T.anchors) for (let y = 0; y < H; y++) px(Math.round((t / T.DUR) * Wd), y, [120, 120, 120]);
  const series = [[W.music, [40, 90, 200]], [W.sfx, [220, 120, 30]], [W.mix, [20, 20, 20]]];
  for (const [w, col] of series) {
    let py = null;
    for (let x = 0; x < Wd; x++) {
      const a = (x / Wd) * T.DUR, b = ((x + 1) / Wd) * T.DUR;
      const y = yOf(db(rmsOf(w, Math.max(0, (a + b) / 2 - 0.05), Math.min(T.DUR, (a + b) / 2 + 0.05))));
      if (py != null) for (let yy = Math.min(py, y); yy <= Math.max(py, y); yy++) px(x, yy, col);
      py = y;
    }
  }
  fs.mkdirSync(P('qa'), { recursive: true });
  fs.writeFileSync(P('qa/rms.ppm'), Buffer.concat([Buffer.from(`P6 ${Wd} ${H} 255\n`), img]));
}
console.log(lines.filter((l) => /^(PASS|FAIL|RESULT)/.test(l)).join('\n'));
process.exit(failed ? 1 : 0);
