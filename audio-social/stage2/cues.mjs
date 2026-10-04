// Stage 2 SFX cue list on beat lines (112 BPM, 30 fps). node cues.mjs -> sfx-cues.json, Stage2_cue_sheet.csv/.md, copies reused one-shots into ./sfx
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REUSE = path.join(HERE, '../../audio-A/sfx');
const FPS = 30, BEAT = 60 / 112, FRAME_PER_BEAT = 16.0714;
const sfx = [], music = [];
const b2t = (b) => b * BEAT;
// at = beat where the transient is heard; lead = seconds of file before that transient
const cue = (name, beat, volume, pan, event, tier, { lead = 0, src = 'reuse' } = {}) =>
  sfx.push({ name, beat, at: b2t(beat), time: +(b2t(beat) - lead).toFixed(5), volume, pan, event, tier, src });
const mus = (beat, event) => music.push({ beat, at: b2t(beat), event });

// ---- music structure rows ----
mus(0, 'Hook: frame-0 sub hit + Am9 pad, kick'); mus(2, 'Drop under the stamp: kick + hats + sub');
mus(4, 'Title: sub hit + kick/pluck enter'); mus(8, 'Arpeggio + muted pluck (ducked 3 dB under typing b8-16)');
mus(20, 'F chord (key-point ping)'); mus(22, 'Full groove, hats'); mus(31, 'Flip sweep rising b31-36');
mus(36, 'Review groove'); mus(44, 'Same-standard flashes, bright stabs'); mus(48, 'Approve: rising stab under each chime');
mus(60, 'Groove eases'); mus(64, 'Thin: bass + pluck (pluck ducked under notes)'); mus(71, 'NEAR-SILENCE (room tone only)');
mus(72, 'Drum return on bar line, chord swell builds'); mus(76, 'GOLD hit: impact + C stab, NO cymbal');
mus(78, 'Slow hold: kick + pad'); mus(80, "'Next' bridge: pad rise + soft snare build"); mus(83.5, 'Clean silence before the logo');
mus(84, 'End card: Am(add9) bloom'); mus(88, 'CTA sub pulses b88, b90'); mus(91.0, 'Loop-seam Am tail, fade over last 0.3 s');

// ---- SFX ----
cue('hook-slam', 0, 0.85, 0, 'Hook slam on frame 0 (text slams f0-6)', 'T1', { src: 'NEW' });
cue('hook-riser', 0, 0.55, 0, 'Hook reverse-swell riser 0-1.071 s', 'T2', { src: 'NEW' });
cue('stamp-thud', 2, 0.85, 0, 'Off-brief stamp thud (plan f32)', 'T1');
cue('hook-drop-sub', 2, 0.7, 0, 'Low sub layered under the stamp', 'T1', { src: 'NEW' });
cue('sub-hit', 4, 0.9, 0, 'Sub hit, scene 2 (bar line)', 'T1');
cue('card-whoosh', 4.5, 0.34, 0, 'Pill cluster whoosh', 'T2');
[9, 10, 11, 12, 13, 14].forEach((b, i) => cue(`label-ping-${i + 1}`, b, 0.3, -0.25 + i * 0.1, `Label ping ${i + 1} of 6`, 'T2'));
cue('tool-blip', 16, 0.4, -0.2, 'Tool blip (own angle)', 'T2');
cue('highlight-ping', 18, 0.4, 0, 'Angle line glow', 'T2');
cue('highlight-ping', 20, 0.32, 0.2, 'Key point ping (F chord)', 'T2');
cue('chip-click-1', 22.5, 0.45, -0.1, 'Format chip click', 'T2');
cue('attach-clip', 24, 0.45, -0.2, 'Attach clip 1', 'T2');
cue('attach-clip', 25, 0.45, 0.2, 'Attach clip 2', 'T2');
cue('avatar-chime', 29.5, 0.7, 0, 'Soft chime on the 8th stamp', 'T1');
[37.4, 38.4, 39.4, 40.4, 41.4].forEach((b, i) => cue('check-tick', b, 0.34, -0.2 + i * 0.1, `Check tick ${i + 1} of 5`, 'T2'));
cue('green-tick', 42.6, 0.4, 0, 'Badge pop (green tick)', 'T2');
[44, 45, 46, 47].forEach((b, i) => cue(`bright-stab-${i + 1}`, b, 0.6, (i - 1.5) * 0.15, `Same-standard flash ${i + 1} stab`, 'T1'));
[48.5, 49.5, 50.5, 51.5, 52.5].forEach((b, i) => cue(`approve-chime-${i + 1}`, b, 0.55, (i - 2) * 0.1, `Approve chime ${i + 1} of 5 (rising)`, 'T1'));
cue('cross-thud', 53.5, 0.5, -0.15, 'Cross 1 thud', 'T1');
cue('cross-thud', 54.5, 0.5, 0.15, 'Cross 2 thud', 'T1');
cue('note-blip', 58, 0.4, -0.3, 'Note blip 1', 'T2');
cue('note-blip', 59, 0.4, 0.3, 'Note blip 2', 'T2');
cue('send-blip', 61, 0.8, 0, 'Send blip', 'T1');
cue('send-blip', 70, 0.5, 0, 'Both badges (sent back)', 'T2');
cue('near-silence-air', 71, 0.28, 0, 'NEAR-SILENCE beat b71-72: room air only', 'T2', { src: 'NEW' });
cue('gold-impact', 76, 0.7, 0, 'GOLD impact, 8 of 8 locks (bar line, loudest element)', 'T1');
cue('approve-chime-big', 76, 0.45, 0, 'Layered chime with gold hit', 'T1');
cue('next-riser', 80, 0.55, 0, "'Next' bridge: rising pad note + riser tail, ends b83.45", 'T2', { src: 'NEW' });
cue('logo-hit-short', 84.4, 0.75, 0, 'Logo hit (transient on beat 84.4)', 'T1', { lead: 0.22 });
cue('glass-tail-s2', 84.5, 0.6, 0, 'Glass tail b84.5-88.5, pulled to -12 dB by 49.0 s', 'T1', { src: 'NEW (from audio-A glass-tail)' });
cue('loop-tail', 91.0, 0.5, 0, 'Loop-seam low Am(add9) pad tail', 'T2', { src: 'NEW' });

// ---- write ----
const rows = [...sfx.map((c) => ({ ...c, kind: 'SFX' })), ...music.map((m) => ({ ...m, kind: 'MUSIC', tier: '-', volume: '', name: 'music' }))]
  .sort((a, b) => a.at - b.at || (a.kind < b.kind ? -1 : 1));
const errors = [];
for (const r of rows) {
  r.fr = Math.round(r.at * FPS);
  r.planFr = Math.round(r.beat * FRAME_PER_BEAT);
  if (Math.abs(r.fr - r.planFr) > 1) errors.push(`${r.event}: frame ${r.fr} vs plan ${r.planFr}`);
}
fs.mkdirSync(path.join(HERE, 'sfx'), { recursive: true });
for (const c of sfx) {
  if (c.src.startsWith('NEW')) { if (!fs.existsSync(path.join(HERE, 'sfx', `${c.name}.wav`))) errors.push(`missing new sfx ${c.name}`); continue; }
  const s = path.join(REUSE, `${c.name}.wav`);
  if (!fs.existsSync(s)) errors.push(`missing reuse sfx ${c.name}`); else fs.copyFileSync(s, path.join(HERE, 'sfx', `${c.name}.wav`));
}
const BANNED = /payment|pay-click|whip-land|cymbal|live-ping|reaction-pop|calendar-pop|coin/;
for (const c of sfx) if (BANNED.test(c.name)) errors.push(`banned sfx ${c.name}`);
fs.writeFileSync(path.join(HERE, 'sfx-cues.json'), JSON.stringify(sfx.sort((a, b) => a.time - b.time).map(({ name, time, volume, pan }) => ({ file: `sfx/${name}.wav`, time, volume, pan })), null, 2));
const head = ['time_s', 'frame_30fps', 'beat', 'kind', 'tier', 'cue', 'sound', 'gain', 'plan_frame', 'delta_frames', 'source'];
const line = (r) => [r.at.toFixed(3), r.fr, r.beat.toFixed(2), r.kind, r.tier, r.event, r.name, r.volume, r.planFr, r.fr - r.planFr, r.src ?? ''];
fs.writeFileSync(path.join(HERE, 'Stage2_cue_sheet.csv'), [head, ...rows.map(line)].map((l) => l.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n');
fs.writeFileSync(path.join(HERE, 'Stage2_cue_sheet.md'), [
  '# Stage 2 cue sheet (49.3 s = 1479 frames @30 fps, 112 BPM, 23 bars)', '',
  'time = moment the sound is heard (transient); plan_frame = round(beat x 16.0714) from social_plan_stage2.md; delta must be within +/-1. gain = linear cue volume before the SFX bus (x0.85) and master. Tiers: T1 loud, T2 subtle. source: reuse = audio-A/sfx copy, NEW = built in this folder.', '',
  `| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${line(r).join(' | ')} |`)].join('\n') + '\n');
console.log(`cues: ${sfx.length} sfx + ${music.length} music rows; max |delta| ${Math.max(...rows.map((r) => Math.abs(r.fr - r.planFr)))}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
