// Film B SFX + music cue list, from script_B_metrics_60s.md section 6b (tiers), section 3 (scene table) and BUILD SPEC section 3 (frames).
// Tier 1 = loud (vol >= 0.7), Tier 2 = subtle (0.3-0.5). Tier 3 (per-row / extra tile / word / name ticks) is cut.
// Where the tier list and the frame cues differ by a few frames, the frame cue wins (noted in the event text).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCues, linspace } from '../audio-common/cues-lib.mjs';

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
music(38.571, 'Bass + hats (E6)', 'music', 1157);
music(42.857, 'Drums thin, pad + pluck (E5)', 'music', 1286);
music(51.429, 'Drums drop; pad wide; melody resolves on the tonic', 'music', 1543);
music(55.714, 'End card: Am(add9) chord (E2)', 'music', 1671);
music(57.857, 'Chord moves to C, decays to silence at 60.000', 'music', 1736);

// ---- SFX ----
// Scene 1
cue('counter-ramp-B0', 0.0, 0.6, 0.1, { event: 'Teaser counter ramp 0-1.5, lands with green tick + glass', tier: T1, frame: 0 });
cue('smash-hit', 1.607, 0.85, 0, { event: 'Smash cut to black', tier: T1, frame: 48 });
cue('sub-hit', 2.143, 0.9, 0, { event: 'Title sub hit on the bar line', tier: T1, frame: 64 });
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
cue('lock-glass', 24.643, 0.34, 0, { event: '2,80,000 lock: glass tick', tier: T1, frame: 739 });
cue('low-impact', 24.643, 0.36, 0, { event: '2,80,000 lock: low impact', tier: T1, frame: 739 });
cue('tile-tick', 26.0, 0.35, -0.2, { event: 'One tile tick', tier: T2 });
cue('label-ping-3', 27.857, 0.5, 0, { event: 'CPM glow ping (Rs 525)', tier: T1, frame: 836 });
// Scene 8
cue('sort-swish', 31.0, 0.42, 0, { event: 'FLIP swish (Darika 4th to 1st)', tier: T2, frame: 930 });
cue('lock-glass', 33.75, 0.7, 0, { event: 'Totals row lock click + glass tick', tier: T1, frame: 1013 });
// Scene 9
cue('label-ping-5', 36.5, 0.45, 0, { event: 'Marker crossing the band top', tier: T1, frame: 1095 });
cue('green-tick', 36.5, 0.35, 0.2, { event: 'Marker crossing tick', tier: T1, frame: 1095 });
cue('chip-click-2', 37.4, 0.45, 0, { event: 'CPM chip click', tier: T2, frame: 1122 });
// Scene 10
cue('panel-whoosh', 38.7, 0.42, 0, { event: 'Ashish panel whoosh', tier: T2, frame: 1161 });
cue('credit-coin', 39.9, 0.7, 0, { event: 'Deep insights credit coin', tier: T1, frame: 1197 });
cue('bar-tick', 40.9, 0.3, 0, { event: 'Topic bars tick (one soft cue)', tier: T2, frame: 1227 });
// Scene 11
cue('bar-fill', 44.0, 0.4, 0, { event: 'Sentiment fill (tier list 44.1, frame cue 44.0)', tier: T2, frame: 1320 });
cue('card-whoosh', 46.9, 0.42, 0, { event: 'Negative comment card whoosh', tier: T2, frame: 1407 });
// Scene 12
cue('panel-tick', 50.5, 0.35, 0, { event: 'Panel tick', tier: T2 });
cue('toggle-click', 51.964, 0.45, -0.1, { event: 'Toggle to Likers', tier: T2, frame: 1559 });
cue('morph-swish', 52.2, 0.4, -0.1, { event: 'Roles bar morph swish', tier: T2 });
cue('toggle-click', 53.571, 0.45, 0.1, { event: 'Toggle to Commenters', tier: T2, frame: 1607 });
cue('morph-swish', 53.8, 0.4, 0.1, { event: 'Roles bar morph swish', tier: T2 });
// Scene 13: transient lands on 55.9 (file has a 0.22 s whoosh lead-in)
cue('logo-hit-short', 55.9, 0.75, 0, { event: 'Logo hit (transient on the frame cue)', tier: T1, frame: 1677, lead: 0.22 });
cue('glass-tail', 56.2, 0.6, 0, { event: 'Glass tail 56.2 to 59.6', tier: T1 });

finish();
