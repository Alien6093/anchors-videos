// Part 1 cue list: single source for the SFX render, the ducking rules and the cue sheet. Times are the moment the sound is HEARD
// (peak/transient). beat -> frame = beat*15 (exact). Cues with endAt=true have their peak on the LAST sample of the file.
import * as V from './voices2.mjs';
import { SR, SVF } from './lib.mjs';
import { beatToSec } from './grid.mjs';

const mixV = (parts) => { // [{v, at(s), g}] -> {L,R}
  const len = Math.max(...parts.map((p) => (p.at || 0) * SR + (p.v.L ? p.v.L.length : p.v.length)));
  const L = new Float32Array(Math.ceil(len)), R = new Float32Array(Math.ceil(len));
  for (const { v, at = 0, g = 1 } of parts) { const s = Math.round(at * SR); const l = v.L || v, r = v.R || v; for (let i = 0; i < l.length; i++) { L[s + i] += l[i] * g; R[s + i] += r[i] * g; } }
  return { L, R };
};
const sc = (v, g) => { const l = v.L || v, r = v.R || v; return { L: Float32Array.from(l, (x) => x * g), R: Float32Array.from(r, (x) => x * g) }; };
const slam = () => mixV([{ v: V.thock(57, 0.22), g: 0.9 }, { v: V.snap(), g: 0.9 }, { v: V.clap(), g: 0.8 }, { v: V.click(3500, 0.004, 71), g: 0.5 }, { v: V.crash(0.7, 72), g: 0.3 }]);
const land = () => mixV([{ v: V.impact(0.95, 81), g: 0.8 }, { v: V.crash(0.9, 73), g: 0.35 }, { v: V.pluckNote(81, 0.8, 1, 0.5), g: 0.3 }]);
const dropHit = () => mixV([{ v: V.impact(1.25, 82), g: 0.9 }, { v: V.crash(1.8, 74), g: 0.55 }, { v: V.clap(), g: 0.7 }, { v: V.snareHit(), g: 0.6 }, { v: V.click(3000, 0.005, 75), g: 0.5 }]);
const payHit = () => mixV([{ v: V.impact(0.7, 83), g: 0.55 }, { v: V.glassChord([84, 88, 91], 1.1), g: 0.45 }, { v: V.click(3200, 0.004, 76), g: 0.4 }]);
const burst = () => mixV([{ v: V.crash(1.3, 77), g: 0.5 }, { v: V.glassChord([88, 91, 96], 1.0), g: 0.5 }, { v: V.impact(0.5, 84), g: 0.4 }]);
const logo = () => mixV([{ v: V.snap(), g: 0.8 }, { v: V.pluckNote(69, 0.5, 1, 0.5), at: 0 }, { v: V.pluckNote(72, 0.5, 1, 0.5), at: 0.25 }, { v: V.pluckNote(76, 0.5, 1, 0.5), at: 0.5 },
  { v: V.pluckNote(81, 1.8, 1, 0.8), at: 0.75, g: 1.15 }, { v: V.glassChord([81, 84, 88], 2.2), at: 0.75, g: 0.35 }]);
const phraseStab = (m) => mixV([{ v: V.stab(m, { dur: 0.3, tau: 0.12, bright: 4800 }), g: 0.7 }, { v: V.click(2800, 0.004, 78), g: 0.45 }, { v: V.pluckNote(m[3], 0.3, 1, 0.3), g: 0.4 }]);
const teaseBreath = () => { const o = new Float32Array(Math.round(1.3 * SR)); const n = V.nz(99); const f = new SVF(); for (let i = 0; i < o.length; i++) { const t = i / SR; f.run(n(), 250 + 3250 * Math.exp(-t / 0.35), 0.8); o[i] = f.lp * Math.min(1, t / 0.12) * Math.exp(-Math.max(0, t - 0.12) / 0.4); } return o; };
const rowTick = (m) => mixV([{ v: V.pluckNote(m, 0.12, 0.9, 0.1) }, { v: V.click(3200, 0.003, 79), g: 0.3 }]);
const digitRoll = () => { const o = new Float32Array(Math.round(0.27 * SR)); for (let k = 0; k < 8; k++) { const c = V.click(2200 + k * 220, 0.004, 120 + k); c.forEach((x, i) => { o[Math.round(k * SR / 30) + i] += x * (0.5 + 0.06 * k); }); } return o; };
const loopPickup = () => { const rc = V.reverseCrash(0.5, 61), w = V.whoosh(0.5, { f0: 500, f1: 12000, toMidi: 81, tone: 0.2, shape: 2.6, seed: 66 }), t = V.riser(0.5, { f0: 800, f1: 12000, toMidi: 69, tone: 0.25, shape: 2.2, seed: 68 });
  const o = mixV([{ v: rc, g: 0.7 }, { v: w, g: 0.8 }, { v: t, g: 0.5 }]); const n = o.L.length, z = Math.round(0.002 * SR); for (let i = 0; i < z; i++) { const k = i / z; o.L[n - 1 - i] *= k; o.R[n - 1 - i] *= k; } return o; };

export const cues = [];
function cue(id, { b, f, db = 0, pan = 0, tier = 'T2', cls = 'ui', pic, build, endAt = false, offSamples = 0 }) {
  const frame = f != null ? f : b * 15, t = frame / 30;
  cues.push({ id, frame, beat: frame / 15, t, db, pan, tier, cls, pic, build, endAt, offSamples });
}
const W = (d, o) => () => V.whoosh(d, o);
// ---- 1 HOOK b0-b4 ----
cue('hook-slam', { b: 0, db: 0, tier: 'T1', cls: 'hit', pic: 'f0 settled prompt bubble, thud + snap with motif A4 (music), 16th hat from f0', build: slam, offSamples: 48 });
cue('swap-whoosh-1', { b: 2, db: -9, tier: 'T3', cls: 'trans', pic: 'f30 caption swap "A creator campaign. In Claude."', build: W(0.2, { toMidi: 76, seed: 41 }), endAt: true });
cue('whoosh-cut-b4', { b: 4, db: -4, tier: 'T2', cls: 'trans', pic: 'cut to ASKS (f60)', build: W(0.25, { toMidi: 81, seed: 42 }), endAt: true });
cue('hook-land-A5', { b: 4, db: -9, tier: 'T1', cls: 'hit', pic: 'A5 lands on the cut to ASKS (f60), crash + impact', build: land });
// ---- 2 ASKS b4-b8: chips are the motif notes ----
[['Audience chip A4', 4, 69, -0.3], ['Product chip C5', 5, 72, 0], ['Motive chip E5', 6, 76, 0.3], ['Tool chip A5', 7, 81, 0]].forEach(([n, b, m, p], i) => cue(`chip-note-${i + 1}`, { b, db: -6, pan: p, tier: 'T2', cls: 'ui', pic: n + ' pops', build: () => V.pluckNote(m, 0.3, 1, 0.3) }));
// ---- 3 PLAN b8-b12 ----
cue('whoosh-cut-b8', { b: 8, db: -5, tier: 'T2', cls: 'trans', pic: 'cut to PLAN (f120)', build: W(0.25, { toMidi: 72, seed: 43 }), endAt: true });
cue('card-pop-plan', { b: 8, db: -9, tier: 'T3', cls: 'ui', pic: 'NATIVE Plan card pops', build: () => V.thock(60, 0.14) });
// ---- 4 REACH b12-b20 ----
cue('whoosh-cut-b12', { b: 12, db: -5, tier: 'T2', cls: 'trans', pic: 'cut to REACH (f180)', build: W(0.25, { toMidi: 76, seed: 44 }), endAt: true });
cue('card-pop-proj', { b: 12.5, db: -9, tier: 'T3', cls: 'ui', pic: 'Projection card from b12.5 (f187.5 -> f188)', build: () => V.thock(64, 0.14), });
cue('range-sweep', { b: 16, db: -13, tier: 'T3', cls: 'swell', pic: 'range bar draws b14-b16, peaks on the lock', build: () => V.riser(1.5, { f0: 500, f1: 9000, toMidi: 76, tone: 0.2, shape: 1.8, seed: 51 }), endAt: true });
cue('hit-stop-lock', { b: 16, db: -4, tier: 'T1', cls: 'hit', pic: 'lock click + 4 f hit-stop on f240 (music hole f239-f244)', build: () => mixV([{ v: V.tapeClick(), g: 0.9 }, { v: V.thock(76, 0.12), g: 0.7 }, { v: V.pluckNote(88, 0.5, 1, 0.8), g: 0.4 }]) });
// ---- 5 CREATORS b20-b32 ----
cue('whoosh-cut-b20', { b: 20, db: -4, tier: 'T2', cls: 'trans', pic: 'cut to CREATORS (f300), card cascade starts (card taps in music)', build: W(0.25, { toMidi: 81, seed: 45 }), endAt: true });
cue('chip-click-sort', { b: 26, db: -8, tier: 'T3', cls: 'ui', pic: 'chip "Sort: Engagement" click (f390)', build: () => V.click(2400, 0.006, 92) });
cue('whoosh-cut-b27', { b: 27, db: -7, tier: 'T2', cls: 'trans', pic: 'hard cut to post-sort frame (f405); rim hit in music', build: W(0.15, { toMidi: 76, seed: 46, f0: 700, shape: 1.6 }), endAt: true });
// ---- 6 CUT b32-b44 ----
cue('whoosh-cut-b32', { b: 32, db: -4, tier: 'T2', cls: 'trans', pic: 'cut to CUT chat (f480)', build: W(0.25, { toMidi: 76, seed: 47 }), endAt: true });
const pat = [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0];
for (let i = 0; i < 24; i++) if (pat[i % 16]) cue(`key-click-${String(i).padStart(2, '0')}`, { b: 32 + i / 4, db: -16 - (i % 3), pan: ((i % 5) - 2) * 0.08, tier: 'T3', cls: 'ui', pic: 'typed key (16th grid, re-time to native typing if it differs)', build: () => V.click(2200 + (i % 4) * 300, 0.005, 130 + (i % 7)) });
cue('riser-build-b36', { b: 43.875, db: -6, tier: 'T1', cls: 'trans', pic: 'riser b36 -> peak at b43.875, then pre-drop gap', build: () => V.riser(3.9375, { f0: 250, f1: 11000, toMidi: 69, tone: 0.2, shape: 2.2, seed: 52 }), endAt: true });
cue('enter-thock', { b: 38, db: -4, tier: 'T1', cls: 'hit', pic: 'Enter at b38 (f570)', build: () => V.thock(57, 0.2) });
cue('send-whoosh', { b: 38, db: -7, tier: 'T3', cls: 'trans', pic: 'bubble send', build: W(0.2, { toMidi: 76, seed: 48, f0: 600 }), endAt: false });
cue('pill-tick-1', { b: 39, db: -7, pan: -0.3, tier: 'T3', cls: 'ui', pic: 'tool pill "CLEO - Adjust the creator list"', build: () => V.pluckNote(72, 0.25, 1, 0.2) });
cue('pill-tick-2', { b: 41, db: -7, pan: 0.3, tier: 'T3', cls: 'ui', pic: 'tool pill "CLEO - What this campaign costs"', build: () => V.pluckNote(76, 0.25, 1, 0.2) });
cue('reverse-crash-b44', { b: 43.875, db: -8, tier: 'T2', cls: 'swell', pic: 'reverse crash into the drop (peak in the pre-drop gap)', build: () => V.reverseCrash(1.0, 62), endAt: true });
// ---- 7 DROP b44-b52 ----
cue('drop-impact', { b: 44, db: 0, tier: 'T1', cls: 'hit', pic: 'DROP (f660): digit roll "16" settles, impact + crash, bass drop', build: dropHit });
cue('digit-roll', { f: 666, db: -9, tier: 'T2', cls: 'ui', pic: 'digit roll 16 -> 8 (8 f, f666-f674)', build: digitRoll });
cue('digit-land', { f: 674, db: -6, tier: 'T1', cls: 'hit', pic: '"8" lands (held >= 24 f)', build: () => mixV([{ v: V.thock(64, 0.18), g: 0.9 }, { v: V.click(3000, 0.004, 93), g: 0.6 }]) });
cue('cell-write-1', { b: 47, db: -8, tier: 'T2', cls: 'ui', pic: 'Before/After cell overwritten (b47, f705)', build: () => rowTick(81) });
cue('cell-write-2', { b: 48, db: -8, tier: 'T2', cls: 'ui', pic: 'Before/After cell overwritten (b48, f720)', build: () => rowTick(84) });
// ---- 8 BRIEFS b52-b60 ----
cue('whoosh-cut-b52', { b: 52, db: -4, tier: 'T2', cls: 'trans', pic: 'cut to BRIEFS (f780), 8 pills (arp fill in music)', build: W(0.25, { toMidi: 81, seed: 53 }), endAt: true });
cue('avoid-highlight', { b: 58, db: -6, tier: 'T2', cls: 'ui', pic: '"Avoid:" line highlighted (f870)', build: () => V.glassChord([88, 93], 0.7) });
// ---- 9 QUOTE b60-b64 ----
cue('whoosh-cut-b60', { b: 60, db: -6, tier: 'T2', cls: 'trans', pic: 'cut to QUOTE (f900)', build: W(0.25, { toMidi: 72, seed: 54 }), endAt: true });
[[60.5, 69], [61, 72], [61.5, 76], [62, 79]].forEach(([b, m], i) => cue(`row-tick-${i + 1}`, { b, db: -9, pan: (i - 1.5) * 0.1, tier: 'T3', cls: 'ui', pic: `quote row ${i + 1} lands on the half-beat`, build: () => rowTick(m) }));
cue('row-tick-total', { b: 62.5, db: -5, tier: 'T2', cls: 'ui', pic: 'Total payable row (f937.5, held >= 20 f before the cut)', build: () => mixV([{ v: rowTick(81) }, { v: V.thock(64, 0.15), g: 0.6 }]) });
cue('quote-riser', { f: 954, db: -11, tier: 'T2', cls: 'trans', pic: 'riser b60 -> peak f954 (start of the 6-frame drop-out)', build: () => V.riser(3.8, { f0: 300, f1: 9000, toMidi: 72, tone: 0.15, shape: 2.0, seed: 55 }), endAt: true });
// ---- 10 PAY b64-b68 ----
cue('pay-restart', { b: 64, db: -4, tier: 'T1', cls: 'hit', pic: 'HARD cut to cream pay page (f960), C-major groove restart, glass chime <= 1.2 s', build: payHit });
cue('check-draw', { b: 65, db: -10, tier: 'T3', cls: 'ui', pic: 'green check strokes f960-f975', build: () => V.noiseBand(0.5, 1500, 7000, 1.5, 56, 1.2), endAt: true });
cue('check-tick', { b: 65, db: -6, tier: 'T3', cls: 'ui', pic: 'check completes (f975)', build: () => mixV([{ v: V.pluckNote(91, 0.2, 1, 0.3) }, { v: V.click(3500, 0.003, 94), g: 0.4 }]) });
// ---- 11 SENT b68-b76 ----
cue('whoosh-cut-b68', { b: 68, db: -5, tier: 'T2', cls: 'trans', pic: 'cut to SENT chat (f1020)', build: W(0.25, { toMidi: 81, seed: 57 }), endAt: true });
[69, 72, 76, 81, 72, 76, 81, 84].forEach((m, i) => cue(`stamp-${i + 1}`, { f: 1035 + 3 * i, db: i === 7 ? -3 : -7 + i * 0.3, pan: (i - 3.5) * 0.12, tier: i === 7 ? 'T1' : 'T2', cls: i === 7 ? 'hit' : 'ui', pic: `avatar ${i + 1} stamps "Brief sent" (0.1 s stagger)`, build: () => mixV([{ v: V.pluckNote(m, 0.28, 1, 0.3) }, { v: V.thock(57, 0.12), g: 0.45 }]) }));
cue('light-burst', { f: 1056, db: -7, tier: 'T1', cls: 'hit', pic: 'light burst on the 8th avatar (SENT peak)', build: burst });
cue('hit-stop-freeze', { b: 72, db: -11, tier: 'T3', cls: 'ui', pic: 'freeze + 3% push at b72 (f1080)', build: () => V.tapeClick() });
// ---- 12 RECAP b76-b88 ----
cue('phrase-hit-1', { b: 76, db: -6, tier: 'T1', cls: 'hit', pic: '"You pick who." (f1140)', build: () => phraseStab([60, 64, 67, 72]) });
cue('whoosh-cut-b76', { b: 76, db: -5, tier: 'T2', cls: 'trans', pic: 'cut to RECAP text card (f1140)', build: W(0.25, { toMidi: 76, seed: 58 }), endAt: true });
cue('phrase-hit-2', { b: 80, db: -8, tier: 'T2', cls: 'hit', pic: '"You set the budget." (f1200)', build: () => phraseStab([53, 60, 65, 69]) });
cue('phrase-hit-3', { b: 84, db: -9, tier: 'T2', cls: 'hit', pic: '"Claude writes the briefs." (f1260), calm breath starts', build: () => V.pluckNote(76, 1.0, 1, 0.6) });
cue('tease-breath', { b: 84, db: -4, tier: 'T3', cls: 'swell', pic: 'low-pass breath b84-b88', build: teaseBreath });
cue('tease-lift', { b: 87.875, db: -7, tier: 'T2', cls: 'trans', pic: 'lift into the logo (peak b87.875, gap, logo f1320)', build: () => V.riser(2.0, { f0: 250, f1: 3600, toMidi: 57, tone: 0.1, shape: 1.8, seed: 59 }), endAt: true });
// ---- 13 END b88-b96 ----
cue('logo-sting', { b: 88, db: -12, tier: 'T1', cls: 'hit', pic: 'logo sting: ANCHOR A4-C5-E5-A5 on bell, kick + snap on the first note (f1320)', build: logo });
cue('cta-pop', { b: 89, db: -12, tier: 'T3', cls: 'ui', pic: 'CTA line "Run your creator campaign in a chat." (f1335)', build: () => V.thock(72, 0.12) });
cue('button-pop', { b: 90, db: -7, tier: 'T2', cls: 'ui', pic: 'button "Try it: anchors.in" (f1350)', build: () => mixV([{ v: V.pluckNote(76, 0.3, 1, 0.4) }, { v: V.thock(64, 0.14), g: 0.5 }]) });
cue('loop-pickup', { b: 96, db: -10, tier: 'T1', cls: 'trans', pic: 'b95 pickup: reverse crash + rising noise, peaks on the last sample, lands on f0 hit', build: loopPickup, endAt: true });
cues.sort((a, b) => a.t - b.t);
