// Writes out/Part1_cue_sheet.csv + .md from cues.mjs plus the music event list, and verifies cue frames against the script v2 beat sheet.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cues } from './cues.mjs';
import { HOLES, SECTIONS } from './grid.mjs';

const OUT = fileURLToPath(new URL('./out/', import.meta.url));
const music = [
  [0, 'MUSIC hook: kick + snap + hat 16ths + motif A4 (f0 + 1 ms)', 'M', 'f0 settled prompt bubble'], [1, 'MUSIC motif C5', 'M', ''], [2, 'MUSIC motif E5 (caption swap)', 'M', 'f30 caption swap'], [3, 'MUSIC motif D5 (passing)', 'M', ''],
  [4, 'MUSIC motif A5 lands, groove 1 starts (kick, bass, clap, offbeat open hat, pad)', 'M', 'cut to ASKS'], [10, 'MUSIC motif full form A4-C5-E5-D5 -> A5 on b12', 'M', ''], [12, 'MUSIC groove 2: tresillo arp enters (opens over 4 bars), shaker', 'M', 'cut to REACH'],
  [18, 'MUSIC motif full form -> A5 on b20', 'M', ''], [20, 'MUSIC card taps as 8th plucks panned L-R (b20-b26), chord stabs on offbeats, rim', 'M', 'card cascade'], [27, 'MUSIC rim hit on the hard cut', 'M', 'hard cut f405'],
  [30, 'MUSIC motif full form -> A5 on b32', 'M', ''], [32, 'MUSIC build groove under typing', 'M', 'cut chat'], [40, 'MUSIC snare roll b40-b43.875 (8ths, 16ths, 32nds), kick keeps 4-on-floor to b43', 'M', ''], [43, 'MUSIC kick + bass out (last beat), pre-drop gap 3 f before b44', 'M', ''],
  [44, 'MUSIC DROP: full groove, 16th arp, stabs, motif full level (A4 b44 -> A5 b46)', 'M', 'digit roll 16 -> 8'], [52, 'MUSIC briefs: 8-note pill arp (16ths) b52-b54, label arp b54-b56.5, hats lead', 'M', '8 name pills'],
  [60, 'MUSIC breakdown: kick halved, filter closes, bass long notes, hats 8ths', 'M', 'QUOTE'], [63.6, 'MUSIC drop-out f954-f959 (6 f)', 'M', ''], [64, 'MUSIC C-major restart (C | G | Am7 | F), stab chord hit', 'M', 'HARD cut to pay page'],
  [68, 'MUSIC SENT peak groove (stamp notes from SFX stem), peak b70+', 'M', 'SENT'], [74, 'MUSIC motif full form -> A5 on b76', 'M', ''], [76, 'MUSIC recap groove (energy 9)', 'M', 'RECAP'], [84, 'MUSIC breath: kick heartbeat at b84/b86, pad + bass low-passed, hats out', 'M', 'calm breath'],
  [88, 'MUSIC end card: stripped groove (kick, bass, clap, pad), Am9 | Fmaj7', 'M', 'END card'], [92, 'MUSIC motif A4 b92 -> A5 b94 under the CTA (-6 dB)', 'M', ''], [94.5, 'MUSIC hat roll crescendo + loop pickup (SFX) into f0', 'M', 'loop pickup'],
];
const rows = [];
for (const c of cues) rows.push({ t: c.t, frame: c.frame, beat: c.beat, cue: c.id, tier: c.tier, gain: `${c.db} dB (${c.cls})`, pic: c.pic });
for (const [b, cue, tier, pic] of music) rows.push({ t: b * 0.5, frame: b * 15, beat: b, cue, tier, gain: 'stem', pic });
for (const h of HOLES) rows.push({ t: h.a, frame: +(h.a * 30).toFixed(2), beat: +(h.a * 2).toFixed(3), cue: `MUSIC HOLE ${h.name}`, tier: 'M', gain: '-inf', pic: 'pre-hit gap / hit-stop' });
rows.sort((a, b) => a.t - b.t || a.cue.localeCompare(b.cue));
const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
const fmt = (r) => [r.t.toFixed(4), Number.isInteger(r.frame) ? r.frame : r.frame.toFixed(3), r.beat, q(r.cue), r.tier, q(r.gain), q(r.pic)].join(',');
fs.writeFileSync(OUT + 'Part1_cue_sheet.csv', ['time_s,frame,beat,cue,tier,gain,picture_event', ...rows.map(fmt)].join('\n') + '\n');
// frame check against script v2 section 1.2/1.4 (frame = beat x 15)
const expect = { 'hook-slam': 0, 'whoosh-cut-b4': 60, 'hook-land-A5': 60, 'whoosh-cut-b8': 120, 'whoosh-cut-b12': 180, 'hit-stop-lock': 240, 'whoosh-cut-b20': 300, 'chip-click-sort': 390, 'whoosh-cut-b27': 405, 'whoosh-cut-b32': 480, 'enter-thock': 570,
  'drop-impact': 660, 'cell-write-1': 705, 'cell-write-2': 720, 'whoosh-cut-b52': 780, 'avoid-highlight': 870, 'whoosh-cut-b60': 900, 'pay-restart': 960, 'check-tick': 975, 'whoosh-cut-b68': 1020, 'stamp-1': 1035, 'stamp-8': 1056, 'light-burst': 1056, 'hit-stop-freeze': 1080,
  'phrase-hit-1': 1140, 'phrase-hit-2': 1200, 'phrase-hit-3': 1260, 'logo-sting': 1320, 'cta-pop': 1335, 'button-pop': 1350, 'loop-pickup': 1440 };
const bad = Object.entries(expect).filter(([id, f]) => { const c = cues.find((x) => x.id === id); return !c || c.frame !== f; });
const byTier = { T1: 'T1 hit', T2: 'T2 transition / UI', T3: 'T3 detail', M: 'music event' };
let md = `# Part 1 (BUILD) cue sheet\n\n120 BPM, frame = beat x 15 @30 fps, time = frame / 30. 48.000 s = 1440 f = 2,304,000 samples. ${cues.length} SFX cues + ${music.length} music events + ${HOLES.length} holes.\n\n`;
md += `Tiers: ${Object.values(byTier).join('; ')}. Gain = trim in dB relative to the peak-normalised voice on its SFX class bus (hit / trans / swell / ui). Cues with a fractional frame are sub-frame pre-rolls (riser peaks one 16th before the cut, pickup ends on the last sample).\n\n`;
md += `Frame check against script v2 beat sheet: ${bad.length ? 'FAIL ' + JSON.stringify(bad) : `PASS (${Object.keys(expect).length} picture-locked cues, all frame = beat x 15 or script frame)`}\n\n`;
md += '| time (s) | frame | beat | cue | tier | gain | picture event |\n|---|---|---|---|---|---|---|\n' + rows.map((r) => `| ${r.t.toFixed(3)} | ${Number.isInteger(r.frame) ? r.frame : r.frame.toFixed(2)} | ${r.beat} | ${r.cue} | ${r.tier} | ${r.gain} | ${r.pic} |`).join('\n') + '\n';
md += `\n## Sections\n\n| section | beats | frames | seconds |\n|---|---|---|---|\n` + SECTIONS.map(([n, a, b]) => `| ${n} | b${a}-b${b} | f${a * 15}-f${b * 15} | ${a / 2}-${b / 2} |`).join('\n') + '\n';
fs.writeFileSync(OUT + 'Part1_cue_sheet.md', md);
console.log('cue sheet rows', rows.length, 'frame check', bad.length ? 'FAIL ' + JSON.stringify(bad) : 'PASS');
// ear-candy cadence: gaps between SFX/music events (T1/T2 + music fills) after the hook
const ev = rows.filter((r) => r.t > 2 && (r.tier === 'T1' || r.tier === 'T2' || r.tier === 'M')).map((r) => r.t).sort((a, b) => a - b);
let mg = 0, at = 0; for (let i = 1; i < ev.length; i++) if (ev[i] - ev[i - 1] > mg) { mg = ev[i] - ev[i - 1]; at = ev[i - 1]; }
console.log('max gap between T1/T2/music events after 2 s:', mg.toFixed(2), 's after', at);
