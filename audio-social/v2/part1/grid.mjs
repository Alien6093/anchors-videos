// 120 BPM grid: 1 beat = 0.5 s = 15 frames @30 fps = 24000 samples @48k. 96 beats = 1440 f = 48.000 s = 2,304,000 samples.
export const SR = 48000, BPM = 120, FPS = 30;
export const BEAT_S = 0.5, BEAT_SAMPLES = 24000, STEP_SAMPLES = 6000;
export const TOTAL_BEATS = 96, TOTAL = 2304000;
export const beatToSample = (b) => Math.round(b * BEAT_SAMPLES);
export const beatToSec = (b) => b * BEAT_S;
export const beatToFrame = (b) => b * 15;
export const frameToSec = (f) => f / FPS;
// energy per second (script v2 section 1.4), 48 values
export const ENERGY = [9, 9, 6, 6, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7, 8, 8, 7, 8, 8, 8, 9, 9, 10, 10, 10, 10, 8, 8, 8, 8, 6, 5, 9, 8, 8, 9, 10, 10, 10, 9, 9, 9, 5, 5, 8, 6, 5, 7];
// chord per bar (24 bars). Bars 0-15 loop Am9|Fmaj7|Cmaj7(add9)|G6, PAY lift (b64-88) in C major, end card back to A minor.
export const CHORDS = {
  Am9: { root: 45, pad: [57, 60, 64, 67, 71], stab: [64, 67, 71, 72], arp: [69, 72, 76, 79] },
  Fmaj7: { root: 41, pad: [53, 57, 60, 64], stab: [65, 69, 72, 76], arp: [69, 72, 77, 81] },
  Cmaj7: { root: 48, pad: [55, 59, 62, 64, 67], stab: [64, 67, 71, 74], arp: [72, 76, 79, 83] },
  G6: { root: 43, pad: [55, 59, 62, 64], stab: [62, 67, 71, 76], arp: [71, 74, 76, 79] },
  C: { root: 48, pad: [55, 60, 64, 67, 74], stab: [64, 67, 72, 74], arp: [72, 74, 76, 79] },
  G: { root: 43, pad: [55, 59, 62, 67], stab: [62, 67, 71, 74], arp: [71, 74, 79, 83] },
  Am7: { root: 45, pad: [57, 60, 64, 67], stab: [64, 67, 69, 72], arp: [69, 72, 76, 79] },
  F: { root: 41, pad: [53, 57, 60, 65], stab: [65, 69, 72, 77], arp: [69, 72, 77, 81] },
};
export const BAR_CHORDS = ['Am9', 'Fmaj7', 'Cmaj7', 'G6', 'Am9', 'Fmaj7', 'Cmaj7', 'G6', 'Am9', 'Fmaj7', 'Cmaj7', 'G6', 'Am9', 'Fmaj7', 'Cmaj7', 'G6',
  'C', 'G', 'Am7', 'F', 'C', 'G', 'Am9', 'Fmaj7'];
export const MOTIF = { A4: 69, C5: 72, E5: 76, D5: 74, A5: 81 };
// section map (beats) used by music and mix
export const SECTIONS = [
  ['HOOK', 0, 4], ['ASKS groove 1', 4, 12], ['REACH groove 2', 12, 20], ['CREATORS', 20, 32], ['CUT build', 32, 44], ['DROP', 44, 52],
  ['BRIEFS', 52, 60], ['QUOTE breakdown', 60, 64], ['PAY lift', 64, 68], ['SENT peak', 68, 76], ['RECAP', 76, 84], ['BREATH', 84, 88], ['END card', 88, 96],
];
// music holes (beats): pre-hit gaps. [startSec, endSec] ; hit-stop at b16, pre-drop b44, pre-pay b64 (6 frames, script 1.5)
export const HOLES = [
  { name: 'hit-stop b16 (4 f + 30 ms pre)', a: 8.0 - 0.03, b: 8.0 + 4 / 30 },
  { name: 'pre-drop gap b44 (3 f)', a: 22.0 - 0.1, b: 22.0 },
  { name: 'pre-pay drop-out f954-959 (6 f)', a: 954 / 30, b: 960 / 30 },
  { name: 'pre-logo gap b88 (60 ms)', a: 44.0 - 0.06, b: 44.0 },
];
