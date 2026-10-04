// node audio-B/splice-v4.mjs <new_raw.wav> <ref_raw.wav> <out.wav> [splice_s=55.70] [xfade_s=0.010]
// Film B v4: keeps the newly rendered music up to the splice point, then the v3 music from the splice point on (linear crossfade of xfade_s ending at the splice point),
// so the end card (bar 27 = 55.714) and everything after is sample-identical to v3 (the retimed scene 12 otherwise leaks a slightly different reverb tail under the
// end-card chord). Works on the raw 24-bit PCM integers (no float round trip), so samples outside the crossfade are copied bit-exactly.
// Everything before 38.571 is already bit-identical in the new render, no splice needed there.
import fs from 'node:fs';
import { SR } from '../audio-common/lib.mjs';

const dataChunk = (buf) => { // -> { off, len } of the 'data' chunk
  for (let p = 12; p + 8 <= buf.length;) {
    const id = buf.toString('ascii', p, p + 4), len = buf.readUInt32LE(p + 4);
    if (id === 'data') return { off: p + 8, len };
    p += 8 + len + (len & 1);
  }
  throw new Error('no data chunk');
};
const [fn, fr, fo, sp = '55.70', xf = '0.010'] = process.argv.slice(2);
const A = fs.readFileSync(fn), B = fs.readFileSync(fr);
const a = dataChunk(A), b = dataChunk(B);
if (a.len !== b.len) throw new Error(`length mismatch ${a.len} vs ${b.len}`);
const FRAME = 6; // 24-bit stereo
const end = Math.round(+sp * SR), start = end - Math.round(+xf * SR);
const out = Buffer.from(A);
out.set(B.subarray(b.off + end * FRAME, b.off + b.len), a.off + end * FRAME);
for (let i = start; i < end; i++) {
  const w = (i - start) / (end - start);
  for (let ch = 0; ch < 2; ch++) {
    const o = a.off + i * FRAME + ch * 3, p = b.off + i * FRAME + ch * 3;
    const v = Math.round(A.readIntLE(o, 3) * (1 - w) + B.readIntLE(p, 3) * w);
    out.writeIntLE(v, o, 3);
  }
}
fs.writeFileSync(fo, out);
console.log(`spliced: new render < ${(start / SR).toFixed(4)} s, crossfade to v3 by ${(end / SR).toFixed(4)} s`);
