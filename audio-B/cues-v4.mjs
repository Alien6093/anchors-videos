// Film B v4 SFX + music cue list (round 5 retime: scene 10 = 38.571-45.000, scene 11 +2.143, scene 12 shortened, Likers removed). Copy of cues.mjs; scenes 1-9 and 13 rows are unchanged.
// Film B SFX + music cue list, from script_B_metrics_60s.md section 6b (tiers), section 3 (scene table) and BUILD SPEC section 3 (frames).
// Tier 1 = loud (vol >= 0.7), Tier 2 = subtle (0.3-0.5). Tier 3 (per-row / extra tile / word / name ticks) is cut.
// Where the tier list and the frame cues differ by a few frames, the frame cue wins (noted in the event text).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCues, linspace } from './cues-lib.mjs'; // v2: film-local copy that also accepts audio-B/sfx one-shots (see sfx-v2.mjs)

const dir = path.dirname(fileURLToPath(import.meta.url));
const { cue, music, finish } = makeCues('B', dir);
const T1 = 'T1', T2 = 'T2';

// ---- music / structure rows (cue sheet only) ----
music(0, 'Teaser: riser + sub pulses (E2)', 'music', 0);
music(1.607, 'Hard black: music cut, room tone', 'music', 48);
music(2.143, 'Title: sub hit + Am9 pad (E2)', 'music', 64);
music(4.286, 'Kick + muted pluck enter (E4)', 'music', 129);
music(7.5, 'Marimba melody enters, hats (E5)', 'music', 225);
music(12.857, 'Full groove (E5)', 'music', 386);
music(18.214, 'Filter sweep up into the breath', 'music', 546);
music(19.286, 'DIP: bass + click + pad (E2)', 'music', 579);
music(20.4, 'Snare-tick rise to the crest', 'music', 612);
music(21.429, 'Crest chord bloom, half-time kick (E6)', 'music', 643);
music(22.5, 'CREST: full groove drops in, melody climbs with the count (E9)', 'music', 675);
music(24.643, 'Melody resolves on the tonic (Am) at the count-up lock', 'music', 739);
music(30.0, 'Groove steady, pad opens (E8)', 'music', 900);
music(34.286, 'Bass walks, light lift (E7)', 'music', 1029);
music(36.429, 'Lift as the marker crosses the band', 'music', 1093);
music(38.571, 'Sc10 stage 1: bass + hats (E6)', 'music', 1157);
music(40.714, 'Sc10 stage 2: soft pluck motif joins', 'music', 1221);
music(42.857, 'Sc10 stage 3: pad swell', 'music', 1286);
music(44.464, 'Sc10: kick drops out, pickup into scene 11', 'music', 1334);
music(45.0, 'Sc11 (bar 21): drums thin, pad + pluck, melody rests (E5)', 'music', 1350);
music(51.429, 'Sc12: drums drop; pad wide', 'music', 1543);
music(53.571, 'Melody resolves on the tonic (Am) at the Commenters toggle', 'music', 1607);
music(55.714, 'End card: Am(add9) chord (E2)', 'music', 1671);
music(57.857, 'Chord moves to C, decays to silence at 60.000', 'music', 1736);

// ---- SFX ----
// Scene 1
cue('counter-ramp-B0-v2', 0.0, 0.6, 0.1, { event: 'Teaser counter ramp 0-1.5, lands with green tick + glass (v2: +6.5 dB on the first 0.9 s so the first second is not quiet; landing unchanged)', tier: T1, frame: 0 });
cue('mid-tick', 0.5357, 0.6, -0.15, { event: 'v2: mid tick on beat 1 (first second lift)', tier: T2, frame: 16 });
cue('mid-tick', 1.0714, 0.65, 0.15, { event: 'v2: mid tick on beat 2 (first second lift)', tier: T2, frame: 32 });
cue('smash-hit', 1.607, 0.85, 0, { event: 'Smash cut to black', tier: T1, frame: 48 });
cue('sub-hit', 2.143, 0.9, 0, { event: 'Title sub hit on the bar line', tier: T1, frame: 64 });
cue('title-thump', 2.143, 0.7, 0, { event: 'v2: title sub-hit layer, 150-400 Hz thump + 20 ms 2-4 kHz transient (audible on phone speakers)', tier: T1, frame: 64 });
// Scene 2: dot flips as one rising sweep 5.4-6.4
linspace(5.4, 6.4, 8).forEach((t, i) => cue(`pill-flip-tick-${i + 1}`, t, 0.24 + i * 0.02, -0.3 + i * 0.085, { event: i === 0 ? 'Dot flip sweep start' : i === 7 ? 'Dot flip sweep end' : 'Dot flip sweep (one rising sweep)', tier: T2, frame: i === 0 ? 162 : i === 7 ? 192 : undefined }));
// Scene 3: snapshot
cue('bubble-whoosh', 8.036, 0.7, 0, { event: 'User bubble whoosh', tier: T1 });
cue('counter-ramp-B1', 8.571, 0.7, 0, { event: 'Snapshot counter ramp 8.571-9.643 (pitch-rising)', tier: T1, frame: 257 });
cue('lock-glass', 10.179, 0.7, 0, { event: 'Impressions lock click + glass tick', tier: T1, frame: 305 });
cue('tile-tick', 11.0, 0.35, 0.2, { event: 'One tile tick (cascade)', tier: T2 });
// Scene 4
cue('row-swish', 13.4, 0.35, 0, { event: 'Rows land as one sweep 13.4-14.4', tier: T2, frame: 402 });
cue('highlight-ping', 15.5, 0.4, 0, { event: 'Highlight ping on the two Friday rows', tier: T2, frame: 465 });
// Scene 5
cue('bar-fill', 17.6, 0.4, 0, { event: 'Forecast marker fill swish', tier: T2 });
cue('lock-glass', 18.7, 0.7, 0, { event: 'Marker lock tick (67-69% readout)', tier: T1, frame: 561 });
// Scene 6: breath
cue('whip-peak', 19.286, 0.4, 0, { event: 'Whip in (peak lands on the cut)', tier: T2, frame: 579, lead: 0.2 });
cue('riser-1071', 20.367, 0.6, 0, { event: 'Riser 20.367 to 21.438', tier: T1, frame: 611 });
// Scene 7: final count
cue('counter-ramp-final', 22.5, 0.6, 0, { event: 'Final counter ramp 22.5-24.643 (pitch-rising)', tier: T1, frame: 675 });
cue('lock-glass', 24.643, 0.34, 0, { event: '2,80,000 lock: glass tick (v2: picture lands on f739 too)', tier: T1, frame: 739 });
cue('low-impact', 24.643, 0.36, 0, { event: '2,80,000 lock: low impact', tier: T1, frame: 739 });
cue('tile-tick', 26.0, 0.35, -0.2, { event: 'One tile tick', tier: T2 });
cue('label-ping-3', 27.857, 0.5, 0, { event: 'CPM glow ping (Rs 525)', tier: T1, frame: 836 });
// Scene 8
cue('sort-swish', 31.0714, 0.42, 0, { event: 'FLIP swish (Darika 4th to 1st), v2: flip starts f932 = beat 58', tier: T2, frame: 932 });
cue('lock-glass', 33.75, 0.7, 0, { event: 'Totals row lock click + glass tick', tier: T1, frame: 1013 });
// Scene 9
cue('label-ping-5', 36.5, 0.45, 0, { event: 'Marker crossing the band top', tier: T1, frame: 1095 });
cue('green-tick', 36.5, 0.35, 0.2, { event: 'Marker crossing tick', tier: T1, frame: 1095 });
cue('chip-click-2', 37.4, 0.45, 0, { event: 'CPM chip click', tier: T2, frame: 1122 });
// Scene 10 (T2 only: no coin, paywall or charge sounds; all on the beat / half-beat grid)
cue('panel-whoosh', 38.839, 0.42, 0, { event: 'Ashish panel whoosh (beat 72.5)', tier: T2, frame: 1165 });
cue('panel-tick', 39.375, 0.22, 0, { event: 'Stage 1 insights load tick (beat 73.5)', tier: T2, frame: 1181 });
cue('bar-tick', 40.179, 0.3, 0, { event: 'Topic bars tick (one soft cue, beat 75)', tier: T2, frame: 1205 });
cue('panel-tick', 40.982, 0.2, 0.1, { event: 'Stage 2 load tick, Who follows Ashish (beat 76.5)', tier: T2, frame: 1229 });
cue('stage3-tick-shimmer', 43.125, 0.2, 0, { event: 'Stage 3 load tick + very light 5-chip stagger shimmer, one soft cue (beat 80.5)', tier: T2, frame: 1294 });
// Scene 11 (all cues +2.143 vs v3 = +64 frames)
cue('bar-fill', 46.243, 0.4, 0, { event: 'Sentiment fill (v3 44.1 + 2.143)', tier: T2, frame: 1387 });
cue('card-whoosh', 49.043, 0.42, 0, { event: 'Negative comment card whoosh (v3 46.9 + 2.143)', tier: T2, frame: 1471 });
// Scene 12 (Likers toggle and its swishes removed)
cue('panel-tick', 51.964, 0.35, 0, { event: 'Roles panel tick (beat 97)', tier: T2, frame: 1559 });
cue('toggle-click', 53.571, 0.45, 0.1, { event: 'Toggle to Commenters (only toggle, beat 100)', tier: T2, frame: 1607 });
cue('morph-swish', 53.839, 0.4, 0.1, { event: 'Roles bar morph swish to Commenters (beat 100.5)', tier: T2, frame: 1615 });
// Scene 13: transient lands on 55.9 (file has a 0.22 s whoosh lead-in)
cue('pad-swell', 51.4286, 0.45, 0, { event: 'v2: soft Am9 pad swell across 51.4-55.7 (through the audience section into the end card)', tier: T2, frame: 1543 });
cue('logo-hit-short', 55.9, 0.55, 0, { event: 'Logo hit (transient on the frame cue)', tier: T1, frame: 1677, lead: 0.22 });
cue('glass-tail', 56.2, 0.45, 0, { event: 'Glass tail 56.2 to 59.6', tier: T1 });

finish();
