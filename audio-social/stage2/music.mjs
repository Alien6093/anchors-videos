// Stage 2 music bed, re-synthesised with the shared engine (audio-common/engine.mjs). node music.mjs <out.wav>
import { renderMusic, bt } from '../../audio-common/engine.mjs';
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
  ...S, style, seed: 60002, padEnd: S.DUR + 1, tailBypass: false, glassStart: 0, glassEnd: 1,
  events(ctx) {
    const { mono, roll, V, mtof, BEAT } = ctx;
    const CM = [55, 60, 64, 67, 72, 76].map(mtof);
    // hook: frame-0 sub hit, sub pulse on beat 1, Am9 pad that swells into the stamp (beat 2); pad + sub repeat at the loop seam
    mono('bass', V.subNote(mtof(33), 0.45, 1), 0, 0.75);
    mono('bass', V.subNote(mtof(33), 0.3, 0.8), bt(1), 0.7);
    mono('pad', V.pad([45, 57, 60, 64, 71].map(mtof), bt(2), 0.7, 1100, 0.25, 0.15, 61), 0, 0.42, 0);
    mono('drums', V.kick(1), 0, 0.85, 0);
    // title: sub hit on the bar line (beat 4)
    mono('bass', V.subNote(mtof(33), 2.0, 1), bt(4), 0.7);
    // flip sweep, beats 31-36 (one rising sweep replaces the pill ticks)
    mono('fx', V.noiseSweep(BEAT * 5, 300, 7500, 0.7, 34, 3), bt(31), 0.26, 0);
    // same-standard flashes bed: stab pads rising under each approve chime (beat 48.5 + k)
    [69, 72, 76, 79, 81].forEach((m, i) => mono('stab', V.stab([mtof(m), mtof(m + 12)], 0.85 + i * 0.03, 0.45), bt(48.5 + i), 0.36, (i - 2) * 0.15));
    // drop: drums return on the bar line at beat 72, chord swell builds to the gold hit
    mono('drums', V.kick(1.2), bt(72), 1, 0);
    mono('drums', V.snare(0.9), bt(72), 0.5, 0);
    mono('fx', V.impact(1.5, 0.8), bt(72), 0.4, 0);
    mono('fx', V.noiseSweep(BEAT * 4, 300, 7000, 0.6, 32, 2.2), bt(72), 0.3, 0);
    roll(bt(74.5), bt(76), 0.134, 0.045, 0.3, 1.0, 0.5);
    // gold hit on beat 76 (bar line, frame 1221): impact + C major stab, NO cymbal
    mono('fx', V.impact(2.0, 1.0), bt(76), 0.6, 0);
    mono('stab', V.stab(CM, 1.0, 1.4), bt(76), 0.6, 0);
    // bridge 'Next' (b80-83.4): pad rise + soft snare build, silence for the last half beat
    mono('pad', V.pad([57, 64, 67, 72, 76].map(mtof), BEAT * 3.4, 0.7, 5200, 1.6, 0.1, 71), bt(80), 0.3, 0);
    roll(bt(81.5), bt(83.4), 0.27, 0.05, 0.2, 0.7, 0.3);
    // end card: Am(add9) bloom at the logo hit, marimba answer, CTA sub pulses on beats 88 and 90
    mono('bass', V.subNote(mtof(33), bt(4), 0.8), bt(84), 0.6);
    mono('mallet', V.marimba(mtof(81), 0.9, 2.5), bt(84), 0.5, -0.2);
    mono('mallet', V.marimba(mtof(76), 0.8, 2.5), bt(84), 0.4, 0.2);
    mono('bass', V.subNote(mtof(33), 0.4, 0.9), bt(88), 0.6);
    mono('bass', V.subNote(mtof(33), 0.4, 0.8), bt(90), 0.55);
  },
};
renderMusic(film, process.argv[2] || 'music_raw.wav');
