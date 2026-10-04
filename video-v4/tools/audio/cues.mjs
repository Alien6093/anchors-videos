// Builds public/audio/sfx-cues.json from script_v4 sections 3 and 8 (exact timecodes, tiered).
// Tier 1 = loud (volume >= 0.7), Tier 2 = subtle (0.25-0.55). Tier 3 (word ticks, per-name/per-card/per-row/stamp ticks) is cut.
import fs from 'node:fs';

const cues = [];
const cue = (file, time, volume = 0.7, pan = 0) => cues.push({ file: `sfx/${file}.wav`, time: +time.toFixed(3), volume, pan });
const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => (n === 1 ? a : a + ((b - a) * i) / (n - 1)));
const jitter = (i) => (((i * 37) % 11) - 5) * 0.003;

// Scene 1 (0.0-4.5)
cue('counter-ramp-teaser', 0.2, 0.8, 0.1);   // ramp 0.2-1.4, glass lands at 1.4
cue('smash-hit', 1.6, 1.0);
cue('sub-hit', 1.9, 0.9);
// Scene 2 (4.5-8.5): T2 key clicks 5.0-7.4 (22 clicks, pause after "zeko.ai"), T1 Enter thock + bubble whoosh 7.6
[...linspace(5.0, 5.88, 9), ...linspace(6.3, 7.4, 13)].forEach((t, i) => cue(`keyboard-click-${((i * 2) % 3) + 1}`, t + jitter(i), 0.32 + ((i * 7) % 5) * 0.03, (((i * 5) % 7) - 3) * 0.05));
cue('enter-thock', 7.6, 0.9);
cue('bubble-whoosh', 7.6, 0.7);
cue('tool-blip', 8.0, 0.4, -0.2);
// Scene 3 (8.5-15.5): three rising chip clicks 11.0-12.4, spinner 13.4-15.3
[11.0, 11.7, 12.4].forEach((t, i) => cue(`chip-click-${i + 1}`, t, 0.5, -0.2 + i * 0.2));
cue('spinner-loop', 13.4, 0.28, 0.2);
// Scene 4 (15.5-23.0)
cue('widget-whoosh', 15.6, 0.42);
cue('tab-click', 18.5, 0.45);
cue('lock-glass', 21.5, 0.9);
// Scene 5 (23.0-30.0): first four card taps only, sort swish
[23.2, 23.47, 23.73, 24.0].forEach((t, i) => cue('card-tap', t, 0.36, -0.3 + i * 0.2));
cue('sort-swish', 26.2, 0.42);
// Scene 6 (30.0-37.5)
cue('panel-whoosh', 30.6, 0.42);
cue('credit-coin', 33.5, 0.9);
cue('bar-tick', 34.5, 0.34);
// Scene 7 (37.5-42.5): Enter thock only, no per-name ticks
cue('enter-thock', 40.5, 0.9);
// Scene 8 (42.5-49.5)
cue('digit-roll-impact', 43.2, 1.0);
cue('cell-tick', 47.0, 0.35);
// Scene 9 (49.5-59.0): six soft label pings 51.5-56.5, rising
linspace(51.5, 56.5, 6).forEach((t, i) => cue(`label-ping-${i + 1}`, t, 0.3, -0.25 + i * 0.1));
// Scene 10-11
cue('tool-blip', 59.6, 0.4, 0.2);
cue('highlight-ping', 60.4, 0.4);
cue('chip-click-2', 62.6, 0.45);
cue('attach-clip', 64.2, 0.45, -0.2);
cue('attach-clip', 64.55, 0.45, 0.2);
// Scene 12 (65.5-70.0)
cue('lock-click', 68.4, 0.55);
cue('pay-click', 69.4, 0.9);
// Scene 13 (70.0-75.0): dashboard timbre
cue('payment-chime', 71.0, 0.75);
cue('check-stroke-tick', 71.2, 0.35);
cue('whip-reverse', 74.5, 0.7);
// Scene 14: soft chime on the 8th stamp (stamp ticks cut)
cue('avatar-chime', 76.5, 0.7);
// Scene 15: status flips as one rising sweep 78.5-81.5
linspace(78.5, 81.5, 8).forEach((t, i) => cue(`pill-flip-tick-${i + 1}`, t, 0.28 + i * 0.02, -0.3 + i * 0.085));
// Scene 16: three of five check ticks, toggle
[84.0, 84.75, 85.5].forEach((t) => cue('check-tick', t, 0.34));
cue('toggle-click', 86.5, 0.45);
// Scene 17: bright stab per cut, one tick set
[89.9, 90.6, 91.3].forEach((t, i) => cue(`bright-stab-${i + 1}`, t, 0.8, (i - 1) * 0.2));
cue('check-tick', 90.1, 0.3);
// Scene 18: five rising approve chimes 92.6-94.6
linspace(92.6, 94.6, 5).forEach((t, i) => cue(`approve-chime-${i + 1}`, t, 0.75, (i - 2) * 0.1));
// Scene 19-20
cue('cross-thud', 96.8, 0.5, -0.15);
cue('cross-thud', 96.95, 0.5, 0.15);
cue('send-blip', 99.6, 0.8);
cue('note-blip', 101.8, 0.4, -0.3);
cue('note-blip', 102.6, 0.4, 0.3);
// 103.3-104.5: silence, no cues
// Scene 21 (104.5-110.0): one big layered hit, eight green ticks as one sweep, low impact
cue('gold-impact', 105.0, 0.85);
cue('approve-chime-big', 105.0, 0.65);
linspace(106.0, 106.8, 8).forEach((t, i) => cue('green-tick', t, 0.36, -0.6 + i * 0.17));
cue('low-impact', 107.6, 0.85);
// Scene 22 (110.0-115.0)
cue('calendar-pop', 111.0, 0.45);
cue('confirm-chime', 113.4, 0.85);
cue('riser-long', 113.5, 0.8);
// Scene 23 (115.0-120.0): the film's only cymbal
cue('cymbal-swell', 115.0, 0.9);
linspace(115.4, 116.2, 4).forEach((t, i) => cue('reaction-pop', t, 0.4, ((i * 3) % 5 - 2) * 0.22));
linspace(116.6, 118.0, 4).forEach((t, i) => cue(`live-ping-${i + 1}`, t, 0.85, -0.4 + i * 0.27));
// Scene 24 (120.0-132.0)
cue('counter-ramp-metrics', 122.6, 0.9);
cue('tile-tick', 125.0, 0.35);
cue('lock-glass', 131.0, 0.9);
// Scene 25-26
cue('bar-fill', 132.6, 0.4);
cue('card-whoosh', 135.6, 0.42);
cue('panel-tick', 139.0, 0.35);
cue('toggle-click', 141.5, 0.45);
cue('morph-swish', 142.0, 0.4);
// Scene 27
cue('logo-hit', 145.7, 0.9);
cue('glass-tail', 146.0, 0.6);

cues.sort((a, b) => a.time - b.time);
const bad = cues.filter((c) => !fs.existsSync(`public/audio/${c.file}`));
if (bad.length) { console.error('missing SFX files:', bad.map((c) => c.file)); process.exit(1); }
fs.writeFileSync(process.argv[2] || 'public/audio/sfx-cues.json', JSON.stringify(cues, null, 2));
console.log('cues:', cues.length);
