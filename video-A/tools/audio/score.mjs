// Score data for the 150 s film: tempo grid, chord map, section activity map, loudness targets.
export const BPM = 112;
export const BEAT = 60 / BPM;
export const STEP = BEAT / 4;
export const BAR = BEAT * 4;
export const DUR = 150;
export const bt = (n) => n * BEAT;
export const bar = (n) => n * BAR;

// Voicings are voice-led: each pad chord moves to the next by step (A minor family, then C major key at payment).
export const CHORDS = {
  Am: { root: 33, arp: [57, 60, 64, 67] },
  F: { root: 29, arp: [57, 60, 65, 69] },
  C: { root: 36, arp: [55, 60, 64, 67] },
  G: { root: 31, arp: [55, 59, 62, 67] },
  Em: { root: 28, arp: [55, 59, 64, 67] },
  E: { root: 28, arp: [56, 59, 64, 68] },
  Dm: { root: 38, arp: [57, 62, 65, 69] },
  Cmaj: { root: 36, arp: [55, 59, 64, 71] },
  Fmaj: { root: 29, arp: [57, 60, 64, 69] },
  Am9: { root: 33, arp: [57, 60, 64, 71] },
};
// melody tone set (index 0..3) derived from the chord voicing
export const tonesOf = (name) => { const a = CHORDS[name].arp; return [a[1] + 12, a[2] + 12, a[3] + 12, a[1] + 24]; };

// one chord per bar, bars 0..69 (bar n starts at n * 2.1429 s)
export const PROG = [
  'Am9', 'Am9', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G',          // 0-9   intro to first groove
  'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'Em', 'Am', 'F',            // 10-19 full groove, Em colour before the cut
  'C', 'G', 'Am', 'F',                                             // 20-23 after the cut
  'Am', 'Am', 'Am', 'Am',                                          // 24-27 arpeggio pedal through the brief
  'F', 'C', 'G', 'F', 'G',                                         // 28-32 rise, dominant into the key change
  'Cmaj', 'Fmaj',                                                  // 33-34 C major (payment)
  'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G',                        // 35-42 groove restarts
  'Am', 'F', 'C', 'Dm', 'F', 'E',                                  // 43-48 approvals, tension
  'C', 'G', 'Am', 'F', 'G', 'C', 'G',                              // 49-55 release, live build
  'Am', 'F', 'C', 'G', 'Am', 'F',                                  // 56-61 metrics crest
  'Am', 'F', 'C', 'G', 'F', 'E',                                   // 62-67 supports, dominant into the end
  'Am9', 'C',                                                      // 68-69 end card
];
// exact-time chord overrides (t0, t1, chord)
export const OVERRIDES = [[58.929, 60.0, 'F'], [104.5, 105.0, 'C']];
export const chordAt = (t) => {
  for (const [a, b, c] of OVERRIDES) if (t >= a - 1e-6 && t < b - 1e-6) return c;
  return PROG[Math.min(PROG.length - 1, Math.max(0, Math.floor((t + 1e-6) / BAR)))];
};

// Activity map. Later rows override earlier ones. Times are exact script boundaries or beat-grid snaps.
// kick 0 none,1 half,2 four,3 four+ghost | hat 0..3 | clap gain | bass 0 none,1 long,1.5 sparse,2 groove,'pulse','sub','heart'
// pluck 0 none,1 quiet,2 8ths,3 16ths,'arp' pinned A-C-E-G | mel 0..3,'climb','resolve' | pad gain | vel drum push
const R = (t0, t1, o) => ({ t0, t1, ...o });
export const SECS = [
  R(1.9, bar(2), { pad: 0.55, padCut: 900, padAtk: 1.2, bass: 'heart' }),
  R(bar(2), bar(4), { kick: 1, pluck: 1, pad: 0.7, bass: 1 }),
  R(bar(4), 13.5, { kick: 1, hat: 1, pluck: 2, pad: 0.7, bass: 1 }),
  R(13.5, bt(29), { kick: 2, hat: 2, pluck: 2, pad: 0.7, bass: 1 }),
  R(bt(29), bt(34.5), { kick: 2, hat: 1, pluck: 2, pad: 0.6, bass: 1, mel: 1 }),
  R(bt(34.5), bt(43), { kick: 2, hat: 2, clap: 0.3, bass: 2, pluck: 2, mel: 1, pad: 0.6 }),
  R(bt(43), 30.0, { kick: 2, hat: 3, clap: 0.6, bass: 2, pluck: 2, mel: 2, pad: 0.75 }),
  R(30.0, 40.5, { kick: 2, hat: 3, clap: 0.6, bass: 2, pluck: 2, mel: 2, pad: 1.0, padCut: 2600 }),
  R(40.5, bt(80), { bass: 'pulse', click: true }),
  R(bt(80), 49.5, { kick: 2, hat: 3, clap: 0.8, bass: 2, pluck: 2, mel: 2, pad: 0.9, padCut: 3000, vel: 1.05, oct: true }),
  R(49.5, 58.929, { kick: 2, hat: 2, clap: 0.3, bass: 1.5, pluck: 'arp', mel: 1, pad: 0.7 }),
  R(58.929, 60.0, { kick: 2, hat: 2, clap: 0.3, bass: 1.5, pluck: 'arp', mel: 2, pad: 0.75 }),
  R(60.0, 66.0, { kick: 2, hat: 2, clap: 0.35, bass: 1.5, pluck: 2, mel: 2, pad: 0.75 }),
  R(66.0, bar(32), { kick: 2, hat: 2, pluck: 2, bass: 1, pad: 0.95, padCut: 3200, mel: 1 }),
  R(bar(32), 70.0, { kick: 2, pad: 1.1, padCut: 3800, bass: 1 }),
  R(70.0, bar(33), {}),
  R(bar(33), bar(34), { pad: 1.1, padCut: 2400, padAtk: 0.35, bass: 'sub', glass: 1 }),
  R(bar(34), 75.0, { kick: 1, pad: 1.1, padCut: 2600, bass: 'sub', glass: 2 }),
  R(75.0, 82.5, { kick: 2, hat: 2, clap: 0.5, bass: 2, pluck: 2, mel: 1, pad: 0.7 }),
  R(82.5, 96.0, { kick: 2, hat: 3, clap: 0.6, bass: 2, pluck: 2, mel: 2, pad: 0.8 }),
  R(96.0, 100.5, { kick: 1, pluck: 2, bass: 1, pad: 0.35, padCut: 1200, vel: 0.8 }),
  R(100.5, 103.3, { pluck: 2, bass: 1, pad: 0.2, padCut: 1000, vel: 0.7 }),
  R(103.3, 104.5, {}),
  R(104.5, 105.0, { pad: 1.2, padAtk: 0.5, padCut: 3500 }),
  R(105.0, 110.0, { kick: 2, hat: 3, clap: 0.8, snare: 1, bass: 2, pluck: 3, mel: 2, pad: 1.0, padCut: 3500, vel: 1.1, oct: true }),
  R(110.0, 114.643, { kick: 2, hat: 3, clap: 0.7, bass: 2, pluck: 2, mel: 2, pad: 0.9, padCut: 3000, oct: true }),
  R(114.643, 115.0, { pad: 0.9, padCut: 3000 }),
  R(115.0, 120.0, { kick: 3, hat: 3, clap: 1, snare: 1, bass: 2, pluck: 3, mel: 3, pad: 1.0, padCut: 4200, vel: 1.15, oct: true, stabs: true }),
  R(120.0, 121.5, { bass: 1, pluck: 1, pad: 0.7 }),
  R(121.5, 122.6, { kick: 2, hat: 2, pluck: 2, bass: 2, pad: 0.8 }),
  R(122.6, 124.286, { kick: 2, hat: 3, bass: 2, pluck: 2, mel: 'climb', pad: 0.9, padCut: 3000 }),
  R(124.286, 132.0, { kick: 2, hat: 3, clap: 0.8, bass: 2, pluck: 3, mel: 2, pad: 1.0, padCut: 3500, vel: 1.05, oct: true }),
  R(132.0, 140.0, { kick: 2, hat: 2, clap: 0.35, bass: 1.5, pluck: 2, mel: 1, pad: 0.85 }),
  R(140.0, 145.5, { pluck: 2, bass: 1, mel: 'resolve', pad: 0.95, padCut: 2800, vel: 0.8 }),
];
export const secAt = (t) => {
  let out = {};
  for (const s of SECS) if (t >= s.t0 - 1e-6 && t < s.t1 - 1e-6) out = s;
  return out;
};
// Times where pad notes must be re-cut (section edges the script pins).
export const PAD_BREAKS = [1.9, 40.5, 70.0, bar(33), 104.5, 105.0, 114.643, 115.0, 120.0, 122.6, 124.286, 132.0, 140.0, 145.5, 58.929, 60.0, 30.0];

// Loudness targets (dB relative to the E10 peak) for auto-levelling: [t0, t1, energy 1-10]
export const ENERGY_DB = { 2: -25, 3: -22.5, 4: -20.5, 5: -18.5, 6: -16.5, 8: -13.5, 9: -13.2, 10: -11, dip: -24 };
export const LEVELS = [
  [0, 1.6, 2], [1.9, bar(2), 2], [bar(2), 15.536, 4], [15.536, 23.036, 5], [23.036, 40.5, 6], [40.5, 42.0, 'dip'],
  [42.857, 49.5, 6], [49.5, 66.0, 5], [66.0, 70.0, 6], [bar(33), 75.0, 8], [75.0, 82.5, 5], [82.5, 96.0, 6],
  [96.0, 103.3, 4], [104.5, 110.0, 9], [110.0, 115.0, 8], [115.0, 120.0, 10], [120.0, 121.5, 5], [121.5, 122.6, 6],
  [122.6, 132.0, 8], [132.0, 145.5, 5], [145.5, 150.0, 2],
];
