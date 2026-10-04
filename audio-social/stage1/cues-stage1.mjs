// Stage 1 cue list: writes sfx-cues.json (time/volume/pan, consumed by mix-stage1.mjs), Stage1_cue_sheet.csv/.md, copies used one-shots into stage1/sfx.
// Times are the moment the sound is HEARD (file time = at - lead). Beat-anchored cues carry the plan frame (round(beat*16.0714)) and are checked to +-1 frame.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const COMMON = path.join(HERE, '../../audio-common/sfx');
const FPS = 30, BEAT = 60 / 112, TOTAL = 2468800 / 48000;
const bt = (b) => b * BEAT;
const planFrame = (b) => Math.round(b * 16.0714);
const rows = [];
// beat: plan beat (frame-checked); at: explicit seconds (scene-derived, not checked)
function cue(file, { beat, at, vol, pan = 0, tier, cue: name, lead = 0, note = '' }) {
  const t = beat != null ? bt(beat) : at;
  rows.push({ file, at: t, time: t - lead, volume: vol, pan, tier, cue: name, planFrame: beat != null ? planFrame(beat) : null, note });
}
const scene = (srcT, outStart, srcIn, speed) => outStart + (srcT - srcIn) / speed;

// ---- 1 Hook b0-b4: three flash hits (rising A1/C2/E2) + sub + white-flash whooshes, riser to the b3 smash ----
[0, 1, 2].forEach((b, i) => {
  cue(`hook-flash-${i + 1}`, { beat: b, vol: 1.0, tier: 'T1', cue: `Hook flash ${'ABC'[i]} hit`, note: ['LIVE.', 'PAID.', '16 to 8.'][i] + ' (NEW 1)' });
  cue('payoff-sub', { beat: b, vol: 0.85, tier: 'T1', cue: `Payoff sub hit, flash ${'ABC'[i]}`, note: '6-frame sub, NEW 3' });
});
[1, 2, 3].forEach((b, i) => cue(`hook-whoosh-${i + 1}`, { beat: b, vol: 0.6, tier: 'T2', lead: 0.22, cue: `White-flash whoosh into ${b === 3 ? 'title smash' : 'flash ' + 'ABC'[b]}`, note: 'rising pitch, peak on the cut (NEW 1)' }));
cue('riser-1607', { at: 0.05 + 1.557, vol: 0.5, tier: 'T2', lead: 1.557, cue: 'Hook riser b0-b3', note: 'reused v4/common, crest lands on b3' });
cue('title-smash', { beat: 3, vol: 1.0, tier: 'T1', cue: 'Title smash "One chat. Whole campaign."', note: 'NEW 2' });

// ---- 2 Prompt b4-b11 (scene 5.0-8.5 src @0.93x) ----
const P = { o: bt(4), i: 5.0, s: 0.93 };
const keyTimes = [5.107, 5.229, 5.318, 5.44, 5.562, 5.651, 5.773, 5.895, 6.294, 6.398, 6.468, 6.572, 6.676, 6.746, 6.85, 6.954, 7.024, 7.128, 7.232, 7.302, 7.406];
const keyVol = [0.38, 0.44, 0.35, 0.41, 0.32, 0.38, 0.44, 0.35, 0.41, 0.32, 0.38, 0.44, 0.35, 0.41, 0.32, 0.38, 0.44, 0.35, 0.41, 0.32, 0.38];
keyTimes.forEach((t, i) => cue(`keyboard-click-${(i % 3) + 1}`, { at: scene(t, P.o, P.i, P.s), vol: +(keyVol[i] * 0.85).toFixed(3), pan: [-0.15, 0.1, 0, -0.1, 0.15][i % 5], tier: 'T2', cue: 'Prompt key click', note: 'v4 typing rhythm / 0.93' }));
cue('soft-tick-2', { beat: 8, vol: 0.35, tier: 'T2', cue: 'Soft tick, 9:16 punch on "zeko.ai / Rs 3 lakh"', note: 'NEW 7' });
cue('enter-thock', { at: scene(7.6, P.o, P.i, P.s), vol: 0.9, tier: 'T1', cue: 'Enter thock (prompt send)' });
cue('bubble-whoosh', { at: scene(7.6, P.o, P.i, P.s), vol: 0.6, tier: 'T2', cue: 'Bubble whoosh' });
cue('tool-blip', { at: scene(8.0, P.o, P.i, P.s), vol: 0.4, pan: -0.2, tier: 'T2', cue: 'Tool-call blip' });

// ---- 3 Choices b11-b19 (src 10.6 @0.93x) ----
const C = { o: bt(11), i: 10.6, s: 0.93 };
[[11.0, 1, -0.2], [11.7, 2, 0], [12.4, 3, 0.2]].forEach(([t, k, p]) => cue(`chip-click-${k}`, { at: scene(t, C.o, C.i, C.s), vol: 0.5, pan: p, tier: 'T2', cue: `Choice chip ${k}`, note: 'rising' }));
[[13, 1], [15, 2], [17, 3]].forEach(([b, k]) => cue(`soft-tick-${k}`, { beat: b, vol: 0.35, tier: 'T2', cue: `Soft tick, 9:16 choices cut b${b}`, note: 'NEW 7' }));

// ---- 4 Plan b19-b29 ----
cue('widget-whoosh', { beat: 19, vol: 0.42, tier: 'T2', lead: 0.25, cue: 'Plan widget whoosh', note: 'whoosh crest lands just after b19' });
cue('tab-click', { beat: 21, vol: 0.45, tier: 'T2', cue: 'Projection tab click' });
cue('lock-glass', { at: bt(21) + 3.0, vol: 0.8, tier: 'T1', cue: 'Range-bar lock (src 21.5 freeze)', note: 'plan 4b: 0.4 s freeze on the range bar' });
cue('soft-tick-1', { beat: 25, vol: 0.35, tier: 'T2', cue: 'Soft tick, 9:16 projection pull to card', note: 'NEW 7' });

// ---- 5 Creators b29-b37 (src 23.4 @0.93x) ----
const K = { o: bt(29), i: 23.4, s: 0.93 };
[[23.47, -0.3], [23.73, -0.1], [24.0, 0.1], [24.27, 0.3]].forEach(([t, p]) => cue('card-tap', { at: scene(t, K.o, K.i, K.s), vol: 0.36, pan: p, tier: 'T2', cue: 'Creator card tap', note: 'cascade' }));
cue('soft-tick-3', { at: scene(26.0, K.o, K.i, K.s), vol: 0.3, tier: 'T2', cue: 'Soft tick, 9:16 sort macro punch', note: 'NEW 7' });
cue('sort-swish', { at: scene(26.2, K.o, K.i, K.s), vol: 0.42, tier: 'T2', cue: 'Sort swish' });

// ---- 7 Cut to 8 b37-b44 ----
cue('enter-thock', { beat: 40.5, vol: 0.9, tier: 'T1', cue: 'Enter thock (cut request)', note: 'music dip b40.5-b44' });

// ---- 8 16 to 8 b44-b52 ----
cue('digit-roll-impact', { beat: 44, vol: 1.0, tier: 'T1', cue: 'Digit-roll impact 16 -> 8' });
[0, 1, 2, 3].forEach((i) => cue('cell-tick', { beat: 47.5 + i * 0.25, vol: 0.3, pan: +(-0.3 + i * 0.2).toFixed(2), tier: 'T2', cue: 'Cost/forecast cell overwrite tick', note: 'left to right' }));
cue('payoff-sub', { beat: 50, vol: 0.85, tier: 'T1', cue: 'Payoff sub hit, 16-to-8 hold freeze', note: 'NEW 3' });

// ---- 9 Briefs b52-b60 ----
[0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => cue(`pill-flip-tick-${i + 1}`, { beat: 52 + i * 0.25, vol: +(0.28 + 0.02 * i).toFixed(2), pan: +(-0.3 + i * 0.085).toFixed(2), tier: 'T2', cue: `Brief pill ${i + 1}/8 flash`, note: 'rising' }));
[-0.25, -0.15, -0.05, 0.05, 0.15, 0.25].forEach((p, i) => cue(`label-ping-${i + 1}`, { beat: 54.5 + i, vol: 0.32, pan: p, tier: 'T2', cue: `Brief label ${i + 1}/6 ping` }));

// ---- 12 Quote / 13 Pay ----
cue('riser-1607', { at: bt(63.5), vol: 0.45, tier: 'T2', lead: 1.557, cue: 'Pad-rise riser into the pay silence', note: 'crest lands on b63.5' });
cue('lock-click', { beat: 62, vol: 0.7, tier: 'T1', cue: 'Total lock click (Rs 1,47,000)' });
cue('pay-click', { at: bt(63.25), vol: 0.8, tier: 'T1', cue: 'Pay-chip click', note: 'just before the b63.5 silence' });
cue('payoff-sub', { beat: 64, vol: 0.8, tier: 'T1', cue: 'Payoff sub hit, pay hard cut + key change', note: 'NEW 3' });
cue('payment-chime', { beat: 64.5, vol: 0.7, tier: 'T1', cue: 'Payment glass chime', note: 'glass chime, not a coin' });
cue('check-stroke-tick', { beat: 64.8, vol: 0.35, tier: 'T2', cue: 'Check draw tick' });

// ---- 22 Dates b68-b74 ----
cue('calendar-pop', { beat: 68.15, vol: 0.45, tier: 'T2', cue: 'Dates calendar pop' });
cue('confirm-chime', { beat: 72, vol: 0.8, tier: 'T1', cue: 'Confirm chime (date set)' });
cue('riser-1071', { beat: 74, vol: 0.8, tier: 'T1', lead: 1.054, cue: 'Riser into live cut b72-b74', note: 'crest on b74; music has the snare build' });

// ---- 23 Live b74-b84 ----
cue('cymbal-swell', { beat: 74, vol: 0.9, tier: 'T1', lead: 0.45, cue: 'Cymbal swell, live hard cut', note: 'swell ramps in under b73.5, crest at b74' });
cue('payoff-sub', { beat: 74, vol: 0.8, tier: 'T1', cue: 'Payoff sub hit, live cut', note: 'NEW 3' });
[[75, -0.44], [75.5, 0.22], [76, -0.22], [76.5, 0.44]].forEach(([b, p]) => cue('reaction-pop', { beat: b, vol: 0.35, pan: p, tier: 'T2', cue: 'Feed reaction pop' }));
[[77, -0.4], [78, -0.13], [79, 0.14], [80, 0.41]].forEach(([b, p], i) => cue(`live-ping-${i + 1}`, { beat: b, vol: 0.85, pan: p, tier: 'T1', cue: `Live ping ${i + 1}/4` }));
[[81, -0.2, 1], [82, 0, 2], [83, 0.2, 3]].forEach(([b, p, k]) => cue(`chip-click-${k}`, { beat: b, vol: 0.3, pan: p, tier: 'T2', cue: `Date chip ${['Wed 7', 'Thu 8', 'Fri 9'][k - 1]}` }));

// ---- 24 Tease b84-b88 ----
cue('tease-breath', { beat: 84, vol: 0.45, tier: 'T2', lead: 0.12, cue: 'Low-pass breath (tease)', note: 'NEW 6; music LP closes b84-b88' });
cue('tease-lift', { beat: 84, vol: 0.55, tier: 'T2', cue: 'Tease lift b84-b88', note: 'NEW 5, crest lands on b88' });

// ---- 25 End card b88-b96 + loop ----
cue('logo-hit', { beat: 88, vol: 0.9, tier: 'T1', cue: 'Logo hit (mark draws b88-89)', note: 'file crest at +0.55 s = b89' });
cue('glass-tail', { at: bt(88) + 0.286, vol: 0.6, tier: 'T2', cue: 'Logo glass tail' });
cue('highlight-ping', { beat: 91, vol: 0.3, tier: 'T2', cue: 'CTA appears' });
rows.push({ file: 'loop-whoosh', at: TOTAL, time: (2468800 - 25714) / 48000, volume: 0.75, pan: 0, tier: 'T1', cue: 'Loop-return whoosh into frame 0', planFrame: null, note: 'NEW 4; crest = last sample, frame-0 hook flash follows on the loop' });

rows.sort((a, b) => a.time - b.time);
const errors = [];
for (const f of new Set(rows.map((r) => r.file))) {
  const local = path.join(HERE, 'sfx', `${f}.wav`), shared = path.join(COMMON, `${f}.wav`);
  if (fs.existsSync(local)) continue;
  if (fs.existsSync(shared)) fs.copyFileSync(shared, local); else errors.push(`missing sfx ${f}`);
}
for (const r of rows) {
  if (/coin|cha-?ching/.test(r.file)) errors.push(`forbidden cue ${r.file}`);
  r.frame = Math.round(r.at * FPS);
  r.delta = r.planFrame == null ? '' : r.frame - r.planFrame;
  if (r.delta !== '' && Math.abs(r.delta) > 1) errors.push(`${r.cue}: frame ${r.frame} vs plan ${r.planFrame}`);
}
fs.writeFileSync(path.join(HERE, 'sfx-cues.json'), JSON.stringify(rows.map((r) => ({ file: `sfx/${r.file}.wav`, time: +r.time.toFixed(5), volume: r.volume, pan: r.pan })), null, 2));
const music = JSON.parse(fs.readFileSync(path.join(HERE, 'build/music-slices.json'), 'utf8')).map((m) => ({ at: m.out, cue: `MUSIC: ${m.name}`, file: m.src == null ? 'synth' : `v4 music_raw @ src ${m.src}s (bar ${(m.src / (4 * BEAT)).toFixed(2)})`, tier: '-', volume: '', pan: '', planFrame: null, note: `${m.dur}s` }));
const all = [...rows, ...music.map((m) => ({ ...m, frame: Math.round(m.at * FPS), delta: '' }))].sort((a, b) => a.at - b.at);
const head = ['time_s', 'frame_30fps', 'beat', 'tier', 'cue', 'sound', 'gain', 'pan', 'plan_frame', 'delta_frames', 'note'];
const line = (r) => [r.at.toFixed(3), r.frame, (r.at / BEAT).toFixed(2), r.tier, r.cue, r.file, r.volume, r.pan, r.planFrame ?? '', r.delta ?? '', r.note];
fs.writeFileSync(path.join(HERE, 'Stage1_cue_sheet.csv'), [head, ...all.map(line)].map((l) => l.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n');
const md = ['# Stage 1 social cut: cue sheet (51.4333 s = 1543 frames @30 fps, 112 BPM, 24 bars)', '',
  'time = the moment the sound is heard (files with a lead-in are placed early so the crest lands here). plan_frame = round(beat x 16.0714) from social_plan_stage1.md, delta = frame - plan_frame (must be within +-1). gain = cue volume before the SFX bus trim (T1 0.7-1.0 loud, T2 0.28-0.6 subtle). Same audio serves 9:16 and 4:5.', '',
  `| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...all.map((r) => `| ${line(r).join(' | ')} |`)].join('\n');
fs.writeFileSync(path.join(HERE, 'Stage1_cue_sheet.md'), md + '\n');
const chk = rows.filter((r) => r.delta !== '');
console.log(`cues: ${rows.length} sfx, ${chk.length} frame-checked, max |delta| ${Math.max(0, ...chk.map((r) => Math.abs(r.delta)))}`);
if (errors.length) { console.error('CUE ERRORS:\n' + errors.join('\n')); process.exit(1); }
