// Film A "Brief. Review. Approve." score data: 60.000 s = 112 beats = 28 bars at 112 BPM.
// A minor -> C major at the payment check (beat 33, 17.679) -> A minor. Beat n = n * 60/112 s.
import { bt, R, ramp } from '../audio-common/engine.mjs';

export const DUR = 60;
export const PROG = [
  [0, 'Am9'], [8, 'Am'], [24, 'F'], [28, 'G'],                 // hook/title, arpeggio pedal, F at bar 7 (12.857), dominant into the cut
  [33, 'Cmaj'], [35, 'Fmaj'],                                  // payment: C major (key change)
  [37, 'Am'], [40, 'F'], [44, 'C'], [48, 'G'], [52, 'Am'], [56, 'F'], [60, 'C'], [64, 'G'], // groove restart to approvals
  [68, 'Am'], [72, 'F'], [76, 'Dm'], [80, 'Am'], [84, 'E'],    // sent back: thin, tension
  [88, 'F'], [90, 'G'], [92, 'C'],                             // drop returns, build, gold on C
  [96, 'F'], [98, 'G'], [100, 'C'], [102, 'G'],                // set live, peak
  [104, 'Am9'], [108, 'C'],                                    // end card
];
export const SECS = [
  R(bt(4), bt(8), { pad: 0.55, padCut: 900, padAtk: 1.2 }),
  R(bt(8), bt(12), { kick: 1, pluck: 1, pad: 0.7, bass: 1 }),
  R(bt(12), bt(28), { kick: 2, hat: 1, pluck: 'arp', pad: 0.65, bass: 1.5, mel: 1 }),
  R(bt(28), bt(32), { kick: 2, hat: 3, clap: 0.35, pluck: 2, bass: 2, mel: 1, pad: 0.85, padCut: 2600 }),
  R(bt(32), bt(33), {}),
  R(bt(33), bt(35), { pad: 1.1, padCut: 2400, padAtk: 0.35, glass: 1 }),
  R(bt(35), bt(37), { pad: 1.1, padCut: 2600, glass: 2 }),
  R(bt(37), bt(42), { kick: 2, hat: 2, clap: 0.5, bass: 2, pluck: 2, mel: 1, pad: 0.7 }),
  R(bt(42), bt(47), { kick: 2, hat: 3, clap: 0.6, bass: 2, pluck: 2, mel: 2, pad: 0.8 }),
  R(bt(47), bt(59), { kick: 2, hat: 3, clap: 0.6, bass: 2, pluck: 2, mel: 2, pad: 0.85, padCut: 2600 }),
  R(bt(59), bt(63), { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 2, mel: 1, pad: 0.85, vel: 1.05 }),
  R(bt(63), bt(68), { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 3, mel: 2, pad: 0.95, padCut: 3000, vel: 1.05, oct: true }),
  R(bt(68), bt(78), { kick: 1, pluck: 2, bass: 1, pad: 0.5, padCut: 1400, vel: 0.85 }),
  R(bt(78), bt(86), { pluck: 2, bass: 1, pad: 0.3, padCut: 1200, vel: 0.7 }),
  R(bt(86), bt(88), {}),
  R(bt(88), bt(90), { kick: 2, hat: 2, bass: 2, pad: 0.8, padCut: 2000, vel: 0.9 }),
  R(bt(90), bt(92), { kick: 2, hat: 3, clap: 0.5, bass: 2, pluck: 2, pad: 1.15, padAtk: 0.9, padCut: 3500 }),
  R(bt(92), bt(94), { kick: 3, hat: 3, clap: 0.8, snare: 1, bass: 2, pluck: 3, mel: 2, pad: 1.0, padCut: 3500, vel: 1.1, oct: true }),
  R(bt(94), bt(99.5), { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 2, mel: 2, pad: 0.9, padCut: 3000, oct: true }),
  R(bt(99.5), bt(100), { pad: 0.9, padCut: 3000 }),
  R(bt(100), bt(104), { kick: 3, hat: 3, clap: 1, snare: 1, bass: 2, pluck: 3, mel: 3, pad: 1.0, padCut: 4200, vel: 1.15, oct: true, stabs: true }),
];
export const LEVELS = [
  [0, 1.607, 2], [bt(4), bt(8), 2], [bt(8), bt(12), 4], [bt(12), bt(28), 5], [bt(28), bt(32), 6],
  [bt(33), bt(37), 8], [bt(37), bt(45), 5], [bt(45), bt(63), 6], [bt(63), bt(68), 6], [bt(68), bt(78), 5], [bt(78), bt(86), 4],
  [bt(88), bt(92), 7], [bt(92), bt(94), 9], [bt(94), bt(100), 8], [bt(100), bt(104), 10], [bt(104), 60, 2],
];
export const OVERRIDES = [];
export const PAD_BREAKS = [bt(33), bt(35), bt(37), bt(86), bt(88), bt(90), bt(92), bt(94), bt(99.5), bt(100), bt(104)];
export const SWEEPS = [[bt(28.5), bt(32), 700, 12000], [bt(88), bt(92), 600, 9000], [bt(97), bt(100), 900, 14000]];
// typed-text moments: scene 3 bubble, scene 12 note, scene 13 notes (pluck -3 dB)
export const TYPING = [[6.429, 8.0], [38.033, 40.17], [43.933, 45.5]];
export const GLASS = [bt(33), bt(37)];

export const gate = (t) => {
  let g = 1;
  g *= 1 - (ramp(t, 1.602, 1.607) - ramp(t, 2.14, 2.143));            // smash to black 1.607-2.143
  g *= 1 - (ramp(t, 17.138, 17.143) - ramp(t, 17.676, 17.679));       // payment: silence 17.143-17.679
  g *= 1 - 0.97 * (ramp(t, 46.071, 46.32) - ramp(t, 46.607, 47.1));   // near-silence 46.071-47.143
  if (t > 58) g *= Math.cos(ramp(t, 58, 60) * Math.PI / 2) ** 2;
  return g;
};
export const roomTone = (t) =>
  (ramp(t, 1.61, 1.63) - ramp(t, 2.05, 2.14)) + (ramp(t, 17.15, 17.17) - ramp(t, 17.6, 17.679)) + (ramp(t, 46.1, 46.3) - ramp(t, 46.95, 47.11));
