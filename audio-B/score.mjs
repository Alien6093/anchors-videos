// Film B "Every Number. One Chat." score data: 60.000 s = 112 beats = 28 bars at 112 BPM. Stays in A minor (no key change);
// the crest resolves on the tonic at the count-up lock (beat 46, 24.643). Beat n = n * 60/112 s.
import { bt, R, ramp } from '../audio-common/engine.mjs';

export const DUR = 60;
export const PROG = [
  [0, 'Am9'], [8, 'Am'], [12, 'F'], [16, 'C'], [20, 'G'], [24, 'Am'], [28, 'F'], [32, 'Dm'], [34, 'E'],   // hook, snapshot, band
  [36, 'Am'], [40, 'F'], [42, 'Dm'], [44, 'Em'], [46, 'Am'],                                             // dip, riser, climb, tonic lock
  [48, 'F'], [52, 'C'], [56, 'G'], [60, 'Am'], [64, 'F'], [68, 'C'], [72, 'G'], [76, 'Am'],            // crest, table, plan vs actual, insights
  [80, 'Dm'], [84, 'F'], [88, 'C'], [92, 'G'], [96, 'Am'], [100, 'F'],                                   // comments, audience
  [104, 'Am9'], [108, 'C'],                                                                              // end card
];
export const SECS = [
  R(bt(4), bt(8), { pad: 0.55, padCut: 900, padAtk: 1.2 }),
  R(bt(8), bt(14), { kick: 1, pluck: 1, pad: 0.7, bass: 1 }),
  R(bt(14), bt(24), { kick: 2, hat: 1, pluck: 2, bass: 1.5, mel: 1, pad: 0.7 }),
  R(bt(24), bt(36), { kick: 2, hat: 2, clap: 0.3, pluck: 2, bass: 2, mel: 1, pad: 0.8, padCut: 2400 }),
  R(bt(36), bt(40), { bass: 'pulse', click: true, pad: 0.6, padCut: 900 }),
  R(bt(40), bt(42), { kick: 1, bass: 1, pad: 1.0, padCut: 2600, padAtk: 0.3 }),
  R(bt(42), bt(46), { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 2, mel: 'climb', pad: 0.9, padCut: 3000, vel: 1.05 }),
  R(bt(46), bt(56), { kick: 3, hat: 3, clap: 1, bass: 2, pluck: 3, mel: 3, pad: 1.0, padCut: 4200, vel: 1.1, oct: true }),
  R(bt(56), bt(64), { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 2, mel: 2, pad: 1.0, padCut: 3500, oct: true }),
  R(bt(64), bt(68), { kick: 2, hat: 2, clap: 0.5, bass: 'walk', pluck: 2, pad: 0.8, padCut: 2400 }),
  R(bt(68), bt(72), { kick: 2, hat: 3, clap: 0.5, bass: 'walk', pluck: 3, mel: 1, pad: 0.9, padCut: 3000 }),
  R(bt(72), bt(80), { kick: 1, hat: 2, bass: 2, pluck: 1, pad: 0.7, padCut: 2000, vel: 0.9 }),
  R(bt(80), bt(96), { kick: 1, hat: 1, bass: 1.5, pluck: 2, pad: 0.9, padCut: 2200, vel: 0.85 }),
  R(bt(96), bt(104), { pluck: 2, bass: 1, pad: 1.0, padCut: 3200, padAtk: 1.0, vel: 0.8 }),
];
export const LEVELS = [
  [0, 1.607, 2], [bt(4), bt(8), 2], [bt(8), bt(14), 4], [bt(14), bt(36), 5], [bt(36), bt(40), 'dip'], [bt(40), bt(42), 6],
  [bt(42), bt(56), 9], [bt(56), bt(64), 8], [bt(64), bt(72), 7], [bt(72), bt(80), 6], [bt(80), bt(104), 5], [bt(104), 60, 2],
];
export const OVERRIDES = [];
export const PAD_BREAKS = [bt(36), bt(40), bt(42), bt(46), bt(56), bt(96), bt(104)];
export const SWEEPS = [[bt(34), bt(36), 800, 12000], [bt(38), bt(42), 700, 9000]];
// user bubbles / typed prompts: pluck -3 dB
export const TYPING = [[7.5, 8.036], [42.857, 44.0], [49.286, 50.4]];

export const gate = (t) => {
  let g = 1;
  g *= 1 - (ramp(t, 1.602, 1.607) - ramp(t, 2.14, 2.143));   // smash to black 1.607-2.143
  if (t > 58) g *= Math.cos(ramp(t, 58, 60) * Math.PI / 2) ** 2;
  return g;
};
export const roomTone = (t) => ramp(t, 1.61, 1.63) - ramp(t, 2.05, 2.14);
