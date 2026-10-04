// Stage 2 score data: 23 bars = 92 beats at 112 BPM. Everything stays in A minor / C major (relative), no payment key change.
import { bt, R, ramp } from '../../audio-common/engine.mjs';

export const DUR = 49.3; // 1479 frames @30 = 2,366,400 samples
export const PROG = [
  [0, 'Am9'], [8, 'Am'], [20, 'F'], [24, 'C'], [28, 'G'], [32, 'Am'], [36, 'F'], [40, 'C'], [44, 'G'],
  [48, 'Am'], [52, 'F'], [56, 'C'], [60, 'G'], [64, 'Am'], [68, 'F'], [72, 'Dm'], [74, 'G'], [76, 'C'],
  [80, 'E'], [84, 'Am9'],
];
export const SECS = [
  R(bt(2), bt(4), { kick: 2, hat: 2, bass: 1, pad: 0.7, padCut: 1800 }),
  R(bt(4), bt(8), { kick: 1, pluck: 1, pad: 0.6, bass: 1, padCut: 1400 }),
  R(bt(8), bt(20), { kick: 2, hat: 1, pluck: 'arp', pad: 0.65, bass: 1.5, mel: 1 }),
  R(bt(20), bt(22), { kick: 2, hat: 2, pluck: 'arp', pad: 0.75, bass: 1.5, mel: 1 }),
  R(bt(22), bt(31), { kick: 2, hat: 3, clap: 0.35, pluck: 2, bass: 2, mel: 1, pad: 0.85, padCut: 2600 }),
  R(bt(31), bt(36), { kick: 2, hat: 3, clap: 0.5, pluck: 2, bass: 2, mel: 1, pad: 0.9, padCut: 2800 }),
  R(bt(36), bt(44), { kick: 2, hat: 3, clap: 0.6, pluck: 2, bass: 2, mel: 2, pad: 0.85, padCut: 2600 }),
  R(bt(44), bt(48), { kick: 2, hat: 3, clap: 0.7, pluck: 2, bass: 2, mel: 2, pad: 0.85, padCut: 2800, vel: 1.05 }),
  R(bt(48), bt(60), { kick: 2, hat: 3, clap: 0.6, pluck: 2, bass: 2, mel: 2, pad: 0.85, padCut: 2600 }),
  R(bt(60), bt(64), { kick: 2, hat: 2, pluck: 2, bass: 2, mel: 1, pad: 0.8, padCut: 2200, vel: 0.95 }),
  R(bt(64), bt(71), { kick: 1, pluck: 2, bass: 1, pad: 0.5, padCut: 1400, vel: 0.85 }),
  R(bt(72), bt(74), { kick: 2, hat: 2, bass: 2, pad: 0.8, padCut: 2000, vel: 0.95 }),
  R(bt(74), bt(76), { kick: 2, hat: 3, clap: 0.5, pluck: 2, bass: 2, pad: 1.15, padAtk: 0.9, padCut: 3500 }),
  R(bt(76), bt(78), { kick: 3, hat: 3, clap: 0.8, snare: 1, bass: 2, pluck: 3, mel: 2, pad: 1.0, padCut: 3500, vel: 1.1, oct: true }),
  R(bt(78), bt(80), { kick: 2, bass: 2, pad: 1.0, padCut: 3200, mel: 2, vel: 0.9 }),
  R(bt(80), bt(83.4), { pad: 0.9, padCut: 2400, padAtk: 1.6 }),
  R(bt(84), bt(88), { pad: 1.0, padCut: 2200, padAtk: 0.35, bass: 'sub', mel: 1 }),
  R(bt(88), bt(92), { pad: 0.9, padCut: 1800, bass: 'sub' }),
];
export const LEVELS = [
  [0, bt(2), 4], [bt(2), bt(4), 6], [bt(4), bt(8), 4], [bt(8), bt(20), 5], [bt(20), bt(48), 6], [bt(48), bt(60), 6],
  [bt(60), bt(64), 5], [bt(64), bt(71), 4], [bt(72), bt(76), 7], [bt(76), bt(80), 9], [bt(80), bt(83.4), 5], [bt(84), DUR, 3],
];
export const OVERRIDES = [];
export const PAD_BREAKS = [bt(2), bt(4), bt(72), bt(74), bt(76), bt(80), bt(83.4), bt(84), bt(88)];
export const SWEEPS = [[bt(31), bt(36), 700, 12000], [bt(73), bt(76), 700, 10000]];
// typed-text moments (pluck -3 dB): scene 3 brief, scene 11 note, scene 12 notes
export const TYPING = [[bt(8), bt(16)], [bt(57), bt(61)], [bt(64), bt(70)]];
export const GLASS = [0, 0];

export const gate = (t) => {
  let g = 1;
  g *= 1 - 0.97 * (ramp(t, bt(71) - 0.04, bt(71) + 0.03) - ramp(t, bt(72) - 0.03, bt(72) - 0.002)); // near-silence b71-72
  g *= 1 - (ramp(t, bt(83.4), bt(83.5)) - ramp(t, bt(84) - 0.004, bt(84)));                        // clean beat before the logo
  if (t > DUR - 0.3) g *= Math.cos(ramp(t, DUR - 0.3, DUR) * Math.PI / 2) ** 2;
  return g;
};
export const roomTone = (t) => (ramp(t, bt(71), bt(71) + 0.05) - ramp(t, bt(72) - 0.05, bt(72))) + (ramp(t, bt(83.5), bt(83.52)) - ramp(t, bt(84) - 0.03, bt(84))) * 0.6;
