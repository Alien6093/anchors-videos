// Stage 1 social music bed: bar-exact re-cut of the v4 film music (video-v4/out/music_raw.wav, read only), 112 BPM, slices start on source beats.
// Output: pre-master raw bed, exactly 2,468,800 samples (1543 frames @30 = 51.4333 s).   node music-stage1.mjs <out.wav>
import fs from "node:fs";
import path from "node:path";
import { SR, SVF, readWav, writeWav, mtof } from '../../audio-common/lib.mjs';
import * as V from '../../audio-common/voices.mjs';

const OUT_SAMPLES = 2468800;
const BEAT = 60 / 112;
const SRC = readWav(path.resolve('video-v4/out/music_raw.wav'));
const L = new Float32Array(OUT_SAMPLES + SR), R = new Float32Array(OUT_SAMPLES + SR);
const log = [];

// Render source [srcStart, srcStart+dur+ext) at outStart. Head fade `fin` (s); the `ext` tail beyond the nominal end is a cosine fade-out
// (the outgoing slice rings 'ext' s into the next beat while the incoming one starts on the beat); with ext = 0 the last `fout` s fade out.
function seg(name, srcStart, outStart, dur, { fin = 0.003, ext = 0.03, fout = 0.012, gain = 1, proc = null } = {}) {
  const n = Math.round((dur + ext) * SR), s0 = Math.round(srcStart * SR), o0 = Math.round(outStart * SR);
  let l = SRC.L.slice(s0, s0 + n), r = SRC.R.slice(s0, s0 + n);
  if (proc) [l, r] = proc(l, r);
  const nd = Math.round(dur * SR), nf = Math.round(fin * SR), ne = Math.max(Math.round(ext * SR), Math.round(fout * SR));
  for (let i = 0; i < n; i++) {
    let g = gain;
    if (i < nf) g *= 0.5 - 0.5 * Math.cos((Math.PI * i) / nf);
    if (ext > 0 ? i >= nd : i >= n - ne) { const k = ext > 0 ? (i - nd) / Math.max(1, n - nd) : (i - (n - ne)) / ne; g *= 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, k)); }
    if (o0 + i < L.length) { L[o0 + i] += l[i] * g; R[o0 + i] += r[i] * g; }
  }
  log.push({ name, src: +srcStart.toFixed(4), out: +outStart.toFixed(4), dur: +dur.toFixed(4) });
}
const bt = (b) => b * BEAT;

// --- hook (b0-b4): low A1 drone under the flash stack, then the v4 pad (src 1.9, A minor) under the title ---
{
  const d = V.subNote(55, bt(3), 0.5);
  for (let i = 0; i < d.length && i < OUT_SAMPLES; i++) { const e = Math.min(1, i / (0.02 * SR)) * (i > 1.4 * SR ? Math.max(0, 1 - (i - 1.4 * SR) / (0.2 * SR)) : 1); L[i] += d[i] * e; R[i] += d[i] * e; }
  log.push({ name: 'hook A1 drone (synth)', out: 0, dur: 1.607 });
}
seg('hook pad (v4 pad @1.9)', 1.9, bt(3), bt(1), { fin: 0.02, ext: 0.12, gain: 1.0 });
// --- b4-b40.5 prompt..cut request: src bars 2-11 contiguous (4.286 -> 23.839) ---
seg('prompt->projection->creators->cut bed', bt(8), bt(4), bt(36.5), { ext: 0.06, fin: 0.004 });
// --- b40.5-b44 dip: bass + click pulse only (src beats 76.5-80) ---
seg('dip (bass+click pulse)', bt(76.5), bt(40.5), bt(3.5), { ext: 0.03, fin: 0.004, gain: 1.1 });
// --- b44-b52: src bars 20-21, groove returns on the 16-to-8 bar line ---
seg('16 to 8 groove + filter rise', bt(80), bt(44), bt(8), { ext: 0.03, fin: 0.002 });
// --- b52-b60: src bars 24-25 (arpeggio motif) ---
seg('briefs arpeggio', bt(96), bt(52), bt(8), { ext: 0.03, fin: 0.004 });
// --- b60-b63.5: src bar 31 + half of bar 32-less: pad rise into pay, hard cut on b63.5 ---
seg('pad rise into pay', bt(124), bt(60), bt(3.5), { ext: 0, fout: 0.008, fin: 0.004 });
// --- b63.5-b64: room tone (v4 70.1-70.4, about -55 dBFS) ---
seg('room tone', 70.1, bt(63.5), 0.268, { ext: 0, fout: 0.05, fin: 0.05 });
// --- b64-b74: src bars 33-34 C major glass + warm pad (70.714 -> 75.0), contiguous into the groove restart (75.0 -> 76.07) ---
seg('pay key change C major + groove restart', bt(132), bt(64), bt(10), { ext: 0.03, fin: 0.0015 });
// --- b73-b74 snare build (synth snare roll into the cymbal) ---
[[73, 0.30], [73.25, 0.34], [73.5, 0.4], [73.625, 0.45], [73.75, 0.55], [73.875, 0.68]].forEach(([b, v], i) => {
  const s = V.snare(v, 40 + i), o0 = Math.round(bt(b) * SR);
  for (let k = 0; k < s.length; k++) { L[o0 + k] += s[k] * 0.9; R[o0 + k] += s[k] * 0.9; }
});
log.push({ name: 'snare build (synth)', out: +bt(73).toFixed(4), dur: +BEAT.toFixed(4) });
// --- b74-b88: src 114.643 -> 122.143 (live peak bars 53.5-56, then the breath); low-pass closes over the tease (b84-b88) and the bed dims ---
const teaseLP = (l, r) => {
  const n = l.length, a = Math.round(bt(10) * SR), b = Math.round(bt(14) * SR), fl = new SVF(), fr = new SVF();
  for (let i = a; i < n; i++) {
    const p = Math.min(1, (i - a) / (b - a)), fc = 14000 * (600 / 14000) ** (p ** 0.8), g = 10 ** ((-5 * p) / 20);
    fl.run(l[i], fc, 0.75); fr.run(r[i], fc, 0.75); l[i] = fl.lp * g; r[i] = fr.lp * g;
  }
  return [l, r];
};
seg('live peak + tease breath (low-passed)', bt(214), bt(74), bt(14), { ext: 0.03, fin: 0.003, proc: teaseLP });
// --- b88-b96: src bar 68 (145.714) end chord Am(add9) -> C, decays to silence at 51.0 s; last 2 ms declick ---
seg('end card chord', bt(272), bt(88), bt(8), { ext: 0, fout: 0.002, fin: 0.003 });
{
  const a = Math.round(50.2 * SR), b = Math.round(51.0 * SR);
  for (let i = a; i < L.length; i++) { const k = Math.min(1, (i - a) / (b - a)), g = 0.5 + 0.5 * Math.cos(Math.PI * k); L[i] *= g; R[i] *= g; }
}
const outL = L.slice(0, OUT_SAMPLES), outR = R.slice(0, OUT_SAMPLES);
outL[OUT_SAMPLES - 1] = 0; outR[OUT_SAMPLES - 1] = 0;
writeWav(process.argv[2], outL, outR, 24);
console.log('music bed written,', OUT_SAMPLES, 'samples');
for (const s of log) console.log(JSON.stringify(s));
fs.writeFileSync(path.join(path.dirname(process.argv[2]), "music-slices.json"), JSON.stringify(log, null, 2));
