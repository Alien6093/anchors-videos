// Builds public/audio/sfx-cues.json from the script's timecoded SFX list (section 6).
import fs from 'node:fs';

const cues = [];
const cue = (file, time, volume = 0.7, pan = 0) => cues.push({ file: `sfx/${file}.wav`, time: +time.toFixed(3), volume, pan });
const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => (n === 1 ? a : a + ((b - a) * i) / (n - 1)));
const typing = (times, vol) => times.forEach((t, i) => cue(`keyboard-click-${(i * 2 % 3) + 1}`, t, vol * (0.85 + ((i * 7) % 5) * 0.06), ((i * 5) % 7 - 3) * 0.05));

// Scene 1
cue('sub-hit', 0.0, 0.85);
[0.3, 1.4, 2.6].forEach((t, i) => cue('word-tick', t, 0.55, [-0.2, 0.1, 0.2][i]));
cue('reverse-swell', 3.0, 0.7);
// Scene 2: 16 soft clicks across 4.0-6.0 with a pause after "zeko.ai" (~5.05-5.4)
typing([4.0, 4.1, 4.24, 4.36, 4.5, 4.62, 4.75, 4.88, 5.0, 5.42, 5.55, 5.66, 5.8, 5.9, 6.0], 0.4);
cue('enter-thock', 6.2, 0.75);
cue('bubble-whoosh', 6.3, 0.6);
cue('tool-blip', 7.0, 0.5, -0.2);
cue('tool-blip', 7.6, 0.5, 0.2);
// Scene 3
cue('widget-whoosh', 8.2, 0.65);
linspace(9.0, 10.5, 5).forEach((t, i) => cue('field-tick', t, 0.5, -0.15 + i * 0.075));
cue('tab-click', 12.2, 0.65);
// Scene 4: 24 card taps (16 cascade + 8 scroll) and 16 counter ticks
linspace(13.2, 15.2, 16).forEach((t, i) => cue('card-tap', t, 0.32, ((i % 4) - 1.5) * 0.25));
linspace(15.55, 16.5, 8).forEach((t, i) => cue('card-tap', t, 0.3, ((i % 4) - 1.5) * 0.25));
linspace(13.4, 16.4, 16).forEach((t) => cue('counter-tick', t, 0.3, 0.35));
cue('riser-soft', 17.6, 0.5);
// Scene 5
linspace(19.53, 21.87, 8).forEach((t, i) => cue(`pill-flip-tick-${i + 1}`, t, 0.55, -0.3 + i * 0.085));
cue('tool-blip', 19.0, 0.45, 0.2);
// Scene 6
cue('card-whoosh', 23.3, 0.6);
cue('toggle-click', 25.0, 0.65);
cue('approve-chime-soft', 26.8, 0.8);
cue('approve-chime-soft-high', 28.0, 0.8);
// Scene 7: 2x speed typing then send
typing([29.5, 29.6, 29.7, 29.8, 29.9, 30.0, 30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7, 30.8, 30.9, 31.0], 0.4);
cue('bubble-whoosh', 31.2, 0.55);
[32.0, 32.6, 33.2].forEach((t, i) => cue('note-blip', t, 0.6, [-0.4, 0, 0.4][i]));
// Scene 8
cue('approve-chime-big', 34.8, 0.9);
linspace(35.0, 36.0, 8).forEach((t, i) => cue('green-tick', t, 0.5, -0.3 + i * 0.085));
cue('low-impact', 37.0, 0.9);
cue('sub-hit', 37.0, 0.6);
// Scene 9
typing([39.5, 39.63, 39.77, 39.9, 40.05, 40.18, 40.3, 40.44, 40.6, 40.75, 40.9], 0.4);
cue('tool-blip', 41.0, 0.5);
[42.0, 42.5, 43.0].forEach((t, i) => cue('calendar-pop', t, 0.6, [-0.3, 0.3, 0][i]));
cue('confirm-chime', 43.3, 0.85);
cue('riser', 43.0, 0.65);
// Scene 10
cue('card-whoosh', 44.2, 0.65);
linspace(44.5, 46.5, 8).forEach((t, i) => cue('live-ping', t, 0.55, -0.5 + i * 0.14));
linspace(47.0, 49.0, 8).forEach((t, i) => cue('reaction-pop', t, 0.5, ((i * 3) % 5 - 2) * 0.22));
// Scene 11: counter ramp (12 ticks, pitch stepping up through r1..r6), 6 row ticks, lock
linspace(49.5, 51.0, 12).forEach((t, i) => cue(`counter-tick-r${Math.floor(i / 2) + 1}`, t, 0.4, 0.3));
linspace(51.5, 53.5, 6).forEach((t, i) => cue('field-tick', t, 0.4, -0.2 + i * 0.08));
cue('lock-click', 55.0, 0.7);
// Scene 12
cue('logo-hit', 56.2, 0.8);
cue('glass-tail', 56.5, 0.55);

cues.sort((a, b) => a.time - b.time);
const out = process.argv[2] || 'public/audio/sfx-cues.json';
fs.writeFileSync(out, JSON.stringify(cues, null, 2));
export default cues;
console.log('cues:', cues.length);
