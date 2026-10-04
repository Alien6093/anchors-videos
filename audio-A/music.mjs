// Film A music: node audio-A/music.mjs <out.wav>. Original instrumental, no samples.
import { renderMusic, bt } from '../audio-common/engine.mjs';
import { introEvents, endCardEvents } from '../audio-common/events.mjs';
import * as S from './score.mjs';

const MELODY = {
  1: (k) => (k % 2 ? [2, -1, -1, -1, 1, -1, -1, -1] : [1, -1, -1, 2, -1, -1, 0, -1]),
  2: (k) => [[2, -1, 1, 0, -1, 1, 2, -1], [3, -1, 2, -1, 1, -1, 0, -1], [2, -1, 1, 0, -1, 1, 2, 3], [3, 2, -1, 1, -1, 0, -1, -1]][k % 4],
  3: (k) => (k % 2 ? [3, 2, 1, 0, 1, 2, 3, 3] : [0, 2, 1, 3, 2, 3, 1, 2]),
};
const style = {
  kickFour: [0, 4, 8, 12], kickHalf: [0, 10], ghost: 15, openHatBarParity: 0,
  bassSparse: { 0: [0, 6], 10: [7, 2], 14: [12, 2] },
  bassGroove: { 0: [0, 3], 3: [12, 1], 6: [7, 2], 8: [0, 3], 11: [12, 1], 14: [7, 2] },
  pluckQuiet: [0, 1, 2, 1, 3, 2, 1, 2], pluck8: [0, 2, 3, 1, 2, 3, 1, 2], pluck16: [0, 1, 2, 3, 3, 2, 1, 2],
  melPattern: (level, barIdx) => (MELODY[level] ? MELODY[level](barIdx) : null),
};

const film = {
  ...S, style, seed: 60001, padEnd: bt(104), tailBypass: true, tailGain: 0.35,
  glassStart: bt(33), glassEnd: bt(37),
  events(ctx) {
    const { mono, roll, V, mtof, BEAT } = ctx;
    introEvents(ctx);
    // pad rise into the hard cut at 17.143 (payment)
    mono('pad', V.pad([57, 64, 67, 72, 76].map(mtof), 2.2, 0.7, 5200, 2.0, 0.1, 71), bt(28), 0.32, 0);
    mono('fx', V.noiseSweep(1.9, 250, 7000, 0.7, 34, 3), bt(28.5), 0.28, 0);
    // payment bloom: C major sub under glass + bell (key change at beat 33)
    mono('bass', V.subNote(mtof(36), BEAT * 2 * 0.98, 0.9), bt(33), 0.7);
    mono('bass', V.subNote(mtof(29), BEAT * 2 * 0.98, 0.9), bt(35), 0.7);
    mono('mallet', V.marimba(mtof(72), 0.8, 3), bt(33), 0.45, 0);
    mono('stab', V.bell(mtof(84), 2.0, 0.5, [[1, 1, 1.0], [2.02, 0.3, 0.55], [3.98, 0.12, 0.3]]), bt(33), 0.5, 0.1);
    // groove restart at beat 37: snare pickup, soft impact, Am stab
    roll(bt(36.35), bt(37), 0.134, 0.05, 0.15, 0.5, 0.4);
    mono('fx', V.impact(1.2, 0.7), bt(37), 0.4, 0);
    mono('stab', V.stab([57, 60, 64, 69, 72, 76].map(mtof), 0.7, 0.5), bt(37), 0.4, 0);
    // snare roll beats 45-47 into the review
    roll(bt(45), bt(47), 0.134, 0.045, 0.3, 1.0);
    // five approvals: rising stab under each chime (beat 63.5 + k)
    [69, 72, 76, 79, 81].forEach((m, i) => mono('stab', V.stab([mtof(m), mtof(m + 12)], 0.85 + i * 0.03, 0.45), 34.018 + i * BEAT, 0.42, (i - 2) * 0.15));
    // near-silence 46.071-47.143: drum tail-out on beat 87 (46.607), drop one frame before 47.143
    mono('tail', V.tom(90, 0.5), bt(87), 0.6, -0.2);
    mono('tail', V.tom(70, 0.55), bt(87.5), 0.6, 0.2);
    roll(bt(87.5), 47.1, 0.134, 0.05, 0.1, 0.35, 0.3, 'tail');
    mono('drums', V.kick(1.2), 47.1, 1, 0);
    mono('drums', V.snare(0.9), 47.1, 0.5, 0);
    mono('fx', V.impact(1.5, 0.8), 47.1, 0.45, 0);
    mono('fx', V.noiseSweep(2.15, 300, 7000, 0.6, 32, 2.2), bt(88), 0.35, 0);
    // gold hit on the bar line 92 (49.286): impact + C major stab, NO cymbal
    const CM = [55, 60, 64, 67, 72, 76].map(mtof);
    mono('fx', V.impact(2.0, 1.0), bt(92), 0.6, 0);
    mono('stab', V.stab(CM, 1.0, 1.4), bt(92), 0.6, 0);
    // live build 51.964-53.571: riser + accelerating snare
    roll(bt(97), bt(100), 0.27, 0.035, 0.35, 1.0, 0.6);
    mono('fx', V.noiseSweep(1.607, 300, 9000, 0.9, 35, 2.4), bt(97), 0.6, 0);
    // peak at beat 100 (53.571): impact + the film's only cymbal + C stab
    mono('fx', V.impact(2.0, 1.0), bt(100), 0.6, 0);
    const cym = V.cymbalSwell(3.4, 1, 41).map((v, i) => v * Math.exp(-Math.max(0, i / 48000 - 0.7) / 0.55));
    mono('fx', cym, bt(100), 0.5, 0.05);
    mono('stab', V.stab(CM, 1.0, 1.2), bt(100), 0.55, 0);
    endCardEvents(ctx);
  },
};
renderMusic(film, process.argv[2] || 'music_raw.wav');
