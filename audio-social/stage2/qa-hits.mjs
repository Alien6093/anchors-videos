// QA: measure the transient onset of each cue in the SFX-only stem and report offset from the plan frame (30 fps).
import fs from 'node:fs';
import { readWav, SR } from '../../audio-common/lib.mjs';
const w = readWav('Stage2_sfx.wav');
const cues = JSON.parse(fs.readFileSync('sfx-cues.json', 'utf8'));
const key = /hook-slam|stamp-thud|sub-hit|gold-impact|logo-hit|bright-stab|approve-chime-[1-5]|cross-thud|send-blip|avatar/;
let worst = 0; const out = [];
for (const c of cues) {
  if (!key.test(c.file)) continue;
  const lead = c.file.includes('logo-hit') ? 0.22 : 0, at = c.time + lead;
  const a = Math.max(0, Math.round((at - 0.04) * SR)), b = Math.round((at + 0.06) * SR);
  let pk = 0; for (let i = a; i < b; i++) pk = Math.max(pk, Math.abs(w.L[i]) + Math.abs(w.R[i]));
  let on = a; for (let i = a; i < b; i++) if (Math.abs(w.L[i]) + Math.abs(w.R[i]) > pk * 0.3) { on = i; break; }
  const dFr = (on / SR - at) * 30; worst = Math.max(worst, Math.abs(dFr));
  out.push(`${c.file} at ${at.toFixed(3)}s frame ${(at * 30).toFixed(1)} onset offset ${(dFr * 33.3).toFixed(1)} ms`);
}
console.log(out.join('\n')); console.log('worst offset (frames):', worst.toFixed(2));
