// Master + encoded-file QA loop. node master.mjs <916|45> <targetLUFS> [clip=0.85]
// pre (float) -> gain -> tanh soft clip -> look-ahead limiter -> 24-bit wav (exact length); wav -> AAC 320k in a dummy-video mp4 ->
// decode -> ebur128 (I, LRA, true peak). Gain and limiter ceiling are re-trimmed until the DECODED file is at target LUFS and <= -1.5 dBTP.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const D = fileURLToPath(new URL('./', import.meta.url)), B = D + 'build/', OUTD = D + 'out/';
const [variant, tgtS, clipS] = process.argv.slice(2); const target = parseFloat(tgtS), clip = parseFloat(clipS || '0.85'); export const EQ = process.env.EQ || 'equalizer=f=3000:t=q:w=0.8:g=3.5,equalizer=f=380:t=q:w=0.9:g=-2,equalizer=f=9000:t=q:w=0.6:g=2.5,lowpass=f=17000'; const CEIL = -1.65, N = 2304000; const CREST = parseFloat(process.env.CREST || '9.7');
const run = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });
function measure(file) {
  const r = run(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr; const s = r.slice(r.lastIndexOf('Summary:'));
  const g = (re) => parseFloat((s.match(re) || [])[1]);
  return { I: g(/I:\s+(-?[\d.]+) LUFS/), LRA: g(/LRA:\s+(-?[\d.]+) LU/), TP: g(/Peak:\s+(-?[\d.]+) dBFS/) };
}
const wav = OUTD + `Part1_mix_${variant === '916' ? '916' : '45'}.wav`, mp4 = B + `test_${variant}.mp4`, dec = B + `dec_${variant}.wav`;
function masterStats(file) {
  const r = run(['-i', file, '-af', 'astats=metadata=0', '-f', 'null', '-']).stderr; const o = r.slice(r.lastIndexOf('Overall'));
  return { peak: parseFloat(o.match(/Peak level dB:\s+(-?[\d.]+)/)[1]), rms: parseFloat(o.match(/RMS level dB:\s+(-?[\d.]+)/)[1]) };
}
function render(g, lim) {
  const af = `${EQ},volume=${g}dB,asoftclip=type=tanh:threshold=${clip},apad=pad_len=480,alimiter=limit=${lim}:attack=5:release=80:level=disabled,atrim=start_sample=239,asetpts=PTS-STARTPTS,apad=whole_len=${N},atrim=end_sample=${N}`;
  let r = run(['-f', 'f32le', '-ar', '48000', '-ac', '2', '-i', B + `${variant}_pre.f32`, '-af', af, '-ar', '48000', '-c:a', 'pcm_s24le', wav]); if (r.status) throw new Error(r.stderr);
  r = run(['-f', 'lavfi', '-i', 'color=c=black:s=360x640:r=30', '-i', wav, '-t', '48', '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-shortest', mp4]); if (r.status) throw new Error(r.stderr);
  r = run(['-i', mp4, '-vn', '-c:a', 'pcm_s24le', dec]); if (r.status) throw new Error(r.stderr);
  return measure(dec);
}
let g = target - (-18), lim = 0.5, m;
for (let i = 0; i < 14; i++) {
  m = render(g.toFixed(3), lim.toFixed(4)); console.log(`iter ${i}: gain ${g.toFixed(2)} lim ${lim.toFixed(4)} -> I ${m.I} LRA ${m.LRA} TP ${m.TP}`);
  const ms = masterStats(wav); m.crest = +(ms.peak - ms.rms).toFixed(2); console.log('   master peak', ms.peak, 'rms', ms.rms, 'crest', m.crest);
  const okI = Math.abs(m.I - target) < 0.06, okT = m.TP <= -1.55, okC = m.crest <= CREST + 0.15; if (okI && okT && okC) break;
  g += target - m.I; lim = Math.min(10 ** ((ms.rms + CREST) / 20), lim * (m.TP > CEIL ? 10 ** ((CEIL - m.TP) / 20) : 1.0));
}
fs.writeFileSync(B + `master_${variant}.json`, JSON.stringify({ gain: g, lim, clip, ...m }));
console.log('final', JSON.stringify({ gain: g, lim, clip, ...m }));
