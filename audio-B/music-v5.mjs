// Film B v5 music (round 6): copy of music.mjs on engine-v4 + score-v5; only the events from beat 83 on differ. Film B music: node audio-B/music.mjs <out.wav>. Original instrumental, no samples.
import { renderMusic, bt } from './engine-v4.mjs';
import { introEvents, endCardEvents } from '../audio-common/events.mjs';
import * as S from './score-v5.mjs';

const MELODY = {
  1: (k) => [[1, -1, -1, -1, 2, -1, -1, -1], [2, -1, -1, 1, -1, -1, 0, -1]][k % 2],
  2: (k) => [[2, -1, 3, -1, 2, 1, -1, -1], [1, -1, 2, -1, 3, -1, 2, -1], [2, -1, 3, 2, -1, 1, 0, -1], [3, -1, 2, -1, 1, -1, 0, -1]][k % 4],
  3: (k) => [[3, 2, 3, -1, 1, 2, -1, 0], [2, 3, -1, 2, 1, -1, 0, 1]][k % 2],
};
const style = {
  kickFour: [0, 6, 8, 12], kickHalf: [0, 8], ghost: 15, openHatBarParity: 1,
  bassSparse: { 0: [0, 4], 6: [7, 2], 12: [12, 2] },
  bassGroove: { 0: [0, 4], 4: [12, 1], 7: [7, 2], 10: [0, 2], 12: [12, 2] },
  bassWalk: { 0: [0, 3], 4: [7, 3], 8: [12, 3], 12: [7, 3] },
  pluckQuiet: [0, 2, 3, 1, 2, 3, 1, 2], pluck8: [0, 3, 1, 2, 3, 2, 1, 2], pluck16: [0, 1, 2, 3, 2, 1, 3, 2],
  melPattern: (level, barIdx) => (MELODY[level] ? MELODY[level](barIdx) : null),
};

const film = {
  ...S, style, seed: 60002, padEnd: bt(104), tailBypass: false,
  events(ctx) {
    const { mono, roll, V, mtof, BEAT } = ctx;
    introEvents(ctx, { pulses: [0, 1, 2] });
    // band filter rise into the breath
    mono('fx', V.noiseSweep(1.07, 300, 8000, 0.5, 36, 2.4), bt(34), 0.25, 0);
    // dip: snare-tick rise 20.4-21.4 (the riser SFX starts 20.367)
    roll(20.4, bt(40), 0.27, 0.05, 0.1, 0.6, 0.4);
    // 21.429 crest chord bloom, groove drops in at 22.5 (beat 42)
    mono('fx', V.impact(1.2, 0.5), bt(40), 0.35, 0);
    mono('stab', V.stab([57, 60, 65, 69, 72].map(mtof), 0.6, 0.5), bt(40), 0.4, 0);
    mono('fx', V.impact(1.0, 0.7), bt(42), 0.4, 0);
    mono('drums', V.snare(0.9), bt(42), 0.4, 0);
    // tonic lock at beat 46 (24.643): melody resolves on A, Am chord, sub
    [[81, 1.0, -0.3], [76, 0.85, 0.3], [69, 0.8, 0], [93, 0.6, 0.2]].forEach(([m, v, pan]) => mono('mallet', V.marimba(mtof(m), v, 2.5), bt(46), 0.55, pan));
    mono('stab', V.stab([57, 64, 69, 72, 76].map(mtof), 1.0, 1.2), bt(46), 0.4, 0);
    mono('fx', V.impact(1.5, 0.7), bt(46), 0.15, 0);
    // lift as the marker crosses the band (beat 68): open pad + stab
    mono('stab', V.stab([55, 60, 64, 67, 72].map(mtof), 0.6, 0.7), bt(68), 0.35, 0);
    // scene 12 (drums drop at beat 96 = 51.429): drums out, pad wide. Melody: A5+E5 at the drop, C5 (98), E5 (99), resolves on the tonic A5 (Am, beat 100 = 53.571, the Commenters toggle);
    // the beat-102 A5 is unchanged from v3 (keeps the end-card reverb bleed the same).
    [[81, 0.8, -0.2], [76, 0.7, 0.2]].forEach(([m, v, pan]) => mono('mallet', V.marimba(mtof(m), v, 3), bt(96), 0.5, pan));
    mono('mallet', V.marimba(mtof(72), 0.7, 3), bt(98), 0.4, 0.2);
    mono('mallet', V.marimba(mtof(76), 0.6, 3), bt(99), 0.4, -0.2);
    [[81, 0.95, -0.1], [69, 0.7, 0.2], [93, 0.35, 0.3]].forEach(([m, v, pan]) => mono('mallet', V.marimba(mtof(m), v, 3), bt(100), 0.5, pan));
    mono('mallet', V.marimba(mtof(81), 0.75, 3), bt(102), 0.45, 0.1);
    endCardEvents(ctx);
  },
};
renderMusic(film, process.argv[2] || 'music_raw.wav');
