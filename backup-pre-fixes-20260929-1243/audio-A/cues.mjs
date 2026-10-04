// Film A SFX + music cue list, from script_A_brief_review_60s.md section 7 (tiers) and BUILD SPEC section 3 (frames).
// Tier 1 = loud (vol >= 0.7), Tier 2 = subtle (0.28-0.5). Tier 3 (word ticks, per-name/avatar/row ticks, typed-line ticks) is cut.
// Script times are used as given (beats/half beats, or the fixed time the script pins). Where the tier list and the scene
// table disagree, the scene table / frame cue wins (noted in the event text).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCues, linspace } from '../audio-common/cues-lib.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const { cue, music, finish } = makeCues('A', dir);
const B = 60 / 112;
const T1 = 'T1', T2 = 'T2';

// ---- music / structure rows (cue sheet only) ----
music(0, 'Hook: riser + sub pulses (E2)', 'music', 0);
music(1.607, 'Hard black: music cut, room tone', 'music', 48);
music(2.143, 'Title: sub hit + Am9 pad (E2)', 'music', 64);
music(4.286, 'Kick + muted pluck enter (E4)', 'music', 129);
music(6.429, 'Steady arpeggio A-C-E-G (E5); pluck ducked 3 dB under typing', 'music', 193);
music(12.857, 'F chord at bar 7 (E5)', 'music', 386);
music(15.0, 'Full groove, hats open (E6); filter sweep to 17.143', 'music', 450);
music(17.143, 'Payment page: hard cut to silence + room tone', 'music', 514);
music(17.679, 'KEY CHANGE to C major: warm chord, glass + bell (E8)', 'music', 530);
music(19.821, 'Groove restarts on beat 37, snare pickup (E5)', 'music', 595);
music(24.107, 'Snare roll beats 45-47', 'music', 723);
music(25.179, 'Full groove, hats (E6)', 'music', 755);
music(31.607, 'Flashes: arp continues, stab per cut', 'music', 948);
music(33.75, 'Approve section rising (E6), stab under each chime', 'music', 1013);
music(36.429, 'Thin to bass + pluck (E5 to E4)', 'music', 1093);
music(46.071, 'Near-silence (E3), room tone only', 'music', 1382);
music(46.607, 'Drum tail-out on beat 87 (toms)', 'music', 1398);
music(47.1, 'Drop returns one frame before beat 88; chord swell builds (E7)', 'music', 1413);
music(49.286, 'GOLD hit on bar line 92: impact + C stab, NO cymbal (E9)', 'music', 1479);
music(51.964, 'Riser + snare build to the peak (E8)', 'music', 1559);
music(53.571, 'PEAK (E10): impact + the only cymbal', 'music', 1607);
music(55.714, 'End card: Am(add9) chord (E2)', 'music', 1671);
music(57.857, 'Chord moves to C, decays to silence at 60.000', 'music', 1736);

// ---- SFX ----
// Scene 1 (0-4.286)
cue('stamp-thud', 1.071, 0.85, 0, { event: 'Off-brief stamp thud', tier: T1, frame: 32 });
cue('smash-hit', 1.607, 0.85, 0, { event: 'Smash cut to black', tier: T1, frame: 48 });
cue('sub-hit', 2.143, 0.9, 0, { event: 'Title sub hit on the bar line', tier: T1, frame: 64 });
// Scene 2
cue('card-whoosh', 4.821, 0.34, 0, { event: 'Pill cluster whoosh (pills 9-11)', tier: T2, frame: 145 });
// Scene 3: six label pings on beats 13-18
linspace(6.964, 9.643, 6).forEach((t, i) => cue(`label-ping-${i + 1}`, t, 0.3, -0.25 + i * 0.1, { event: `Label ping ${i + 1} of 6`, tier: T2, frame: i === 0 ? 209 : i === 5 ? 289 : undefined }));
// Scene 4 (scene table + frames: tool line beat 23, Angle line lit 12.857, Key point 3 lit 13.929)
cue('tool-blip', 12.321, 0.4, -0.2, { event: 'Tool line (beat 23; tier list says 12.857, frame table says 370)', tier: T2, frame: 370 });
cue('highlight-ping', 12.857, 0.4, 0, { event: 'Angle line highlight', tier: T2, frame: 386 });
cue('highlight-ping', 13.929, 0.32, 0.2, { event: 'Key point 3 highlight (secondary)', tier: T2, frame: 418 });
// Scene 5
cue('chip-click-1', 15.268, 0.45, -0.1, { event: 'Format chip click', tier: T2, frame: 458 });
cue('attach-clip', 16.339, 0.45, -0.2, { event: 'Attach clip 1', tier: T2, frame: 490 });
cue('attach-clip', 16.607, 0.45, 0.2, { event: 'Attach clip 2', tier: T2, frame: 498 });
cue('pay-click', 17.0, 0.75, 0, { event: 'Pay-chip click (fixed time, frame 510)', tier: T1, frame: 510 });
// Scene 6: payment (own timbre: glass + bell)
cue('payment-chime', 17.679, 0.6, 0, { event: 'Payment glass chime = key change to C major (only note outside the groove)', tier: T1, frame: 530 });
cue('check-stroke-tick', 17.8, 0.35, 0, { event: 'Check stroke tick', tier: T2 });
cue('whip-land', 19.286, 0.5, 0, { event: 'Reverse whip out, landing click on the chat at 19.821', tier: T2, frame: 579 });
// Scene 7
cue('avatar-chime', 21.429, 0.7, 0, { event: 'Soft chime on the 8th avatar stamp (stamp ticks cut)', tier: T1, frame: 643 });
// Scene 8
cue('tool-blip', 22.5, 0.4, 0.2, { event: 'Tool line (scene start)', tier: T2 });
linspace(23.036, 25.0, 8).forEach((t, i) => cue(`pill-flip-tick-${i + 1}`, t, 0.28 + i * 0.02, -0.3 + i * 0.085, { event: i === 0 ? 'Status flip sweep start (one rising sweep)' : i === 7 ? 'Status flip sweep end' : 'Status flip sweep', tier: T2, frame: i === 0 ? 691 : i === 7 ? 750 : undefined }));
// Scene 9: three of five check ticks, badge pop
[26.786, 27.857, 28.929].forEach((t, i) => cue('check-tick', t, 0.34, -0.15 + i * 0.15, { event: `Claude check tick (${['1', '3', '5'][i]} of 5)`, tier: T2, frame: i === 0 ? 804 : i === 2 ? 868 : undefined }));
cue('reaction-pop', 29.464, 0.4, 0, { event: 'Badge pop', tier: T2, frame: 884 });
// Scene 10: bright stab per flash
[31.607, 32.143, 32.679, 33.214].forEach((t, i) => cue(`bright-stab-${i + 1}`, t, 0.6, (i - 1.5) * 0.15, { event: `Flash ${i + 1} stab (rising)`, tier: T1, frame: 948 + 16 * i }));
// Scene 11: five rising approve chimes
linspace(34.018, 36.161, 5).forEach((t, i) => cue(`approve-chime-${i + 1}`, t, 0.55, (i - 2) * 0.1, { event: `Approve chime ${i + 1} of 5 (rising)`, tier: T1, frame: i === 0 ? 1021 : i === 4 ? 1085 : undefined }));
// Scene 12
cue('cross-thud', 36.964, 0.5, -0.15, { event: 'Cross 1 thud', tier: T2, frame: 1109 });
cue('cross-thud', 37.5, 0.5, 0.15, { event: 'Cross 2 thud', tier: T2, frame: 1125 });
cue('send-blip', 40.179, 0.8, 0, { event: 'Send blip (beat 75)', tier: T1, frame: 1205 });
// Scene 13
cue('note-blip', 44.5, 0.4, -0.3, { event: 'Note blip 1', tier: T2 });
cue('note-blip', 45.0, 0.4, 0.3, { event: 'Note blip 2', tier: T2 });
cue('send-blip', 45.536, 0.5, 0, { event: 'Send blip (badges)', tier: T2, frame: 1366 });
// 46.071-47.143: near-silence, no cues
// Scene 14: eight green ticks as one sweep, then the gold hit (no cymbal)
linspace(48.214, 49.25, 8).forEach((t, i) => cue('green-tick', t, 0.36, -0.6 + i * 0.17, { event: 'Green tick sweep', tier: T2 }));
cue('gold-impact', 49.286, 0.7, 0, { event: 'GOLD impact at the 8 of 8 lock (bar line 92), no cymbal', tier: T1, frame: 1479 });
cue('approve-chime-big', 49.286, 0.45, 0, { event: 'Layered chime with the gold hit', tier: T1, frame: 1479 });
// Scene 15
cue('calendar-pop', 51.429, 0.45, 0, { event: 'Calendar pop (beat 96)', tier: T2 });
cue('riser-1607', 51.964, 0.6, 0, { event: 'Riser 51.964 to 53.571', tier: T1, frame: 1559 });
cue('confirm-chime', 53.036, 0.6, 0, { event: 'Confirm chime (beat 99)', tier: T1, frame: 1591 });
// Scene 16: the film's only cymbal
cue('cymbal-swell-short', 53.571, 0.5, 0, { event: 'CYMBAL SWELL at Live (first and only cymbal)', tier: T1, frame: 1607 });
linspace(53.7, 54.1, 4).forEach((t, i) => cue('reaction-pop', t, 0.4, ((i * 3) % 5 - 2) * 0.22, { event: `Reaction pop ${i + 1}`, tier: T2 }));
linspace(54.107, 55.2, 4).forEach((t, i) => cue(`live-ping-${i + 1}`, t, 0.45, -0.4 + i * 0.27, { event: `Live ping ${i + 1} of 4`, tier: T1, frame: i === 3 ? 1656 : undefined }));
// Scene 17: transient lands on 55.9 (file has a 0.22 s whoosh lead-in)
cue('logo-hit-short', 55.9, 0.75, 0, { event: 'Logo hit (transient on the frame cue)', tier: T1, frame: 1677, lead: 0.22 });
cue('glass-tail', 56.2, 0.6, 0, { event: 'Glass tail 56.2 to 59.6', tier: T1 });

finish();
