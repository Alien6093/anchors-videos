# Part 3 MONITOR cue sheet

120 BPM, 30 fps: frame = beat x 15. 24 bars = 96 beats = 1440 f = 48.000 s = 2,304,000 samples @ 48 kHz. Every event starts 1 ms (48 samples) after its nominal time so nothing begins at sample 0 (AAC priming safe); SFX and music share this offset.
Tiers: T1 = hit (max two layers per beat, different bands), T2 = musical accent / transition, T3 = subtle. All SFX are high-passed at 120 Hz (no sub); sub comes only from the kick and bass.
Cues marked 'estimated' sit on a beat where the script gives no frame.

| time (s) | frame | beat | cue | tier | stem | gain | picture event |
|---|---|---|---|---|---|---|---|
| 0.000 | 0 | 0 | groove-on + motif A4 + hook chord swell | T1 | music | 1.0 | f0: kick, 16th hats, open-hat offbeats, lead A4, Am swell (mid/high content from sample 48) |
| 0.000 | 0 | 0.0 | hook-thud | T1 | sfx | 1.8 | f0 board frame (end state of Part 2), settled hero frame |
| 0.133 | 4 | 0.27 | flip-whoosh | T3 | sfx | 0.35 | f4-14 the 4 Scheduled dots flip green in a wave |
| 0.500 | 15 | 1 | clap | T3 | music | 0.9 | f15 bubble: clap on beats 2 and 4 of every bar |
| 0.500 | 15 | 1.0 | bubble-pop | T2 | sfx | 0.55 | f15 bubble 'How is it performing?' rises |
| 1.250 | 37.5 | 2.5 | counter-ramp-A-minor-run | T2 | sfx | 0.55 | f36-60 counter 0 -> 1,85,700: B4..G5 on 16ths (b2.5-b3.75), lands on the A5 at f60 |
| 1.500 | 45 | 3.0 | reverse-crash-into-lock | T2 | sfx | 0.5 | b3-b4 reverse crash peaking on the f60 counter lock |
| 1.950 | 58.5 | 3.9 | pre-hit gap 50 ms | T3 | music | 0.0 | music dropout before the f60 lock (30 ms in the 4:5 mix) |
| 2.000 | 60 | 4 | bass drop + A5 lead + Am swell | T1 | music | 1.25 | f60 counter lands 1,85,700 (A5 = motif landing, offbeat bass starts) |
| 2.000 | 60 | 4.0 | lock-impact | T1 | sfx | 1.0 | f60 counter lands 1,85,700 (A5 on the lead); 4 f hit-stop |
| 2.000 | 60 | 4.0 | hit-stop-tape-4f | T2 | sfx | 0.6 | f60-63 hit-stop (tape click) |
| 3.000 | 90 | 6.0 | morph-swish | T3 | sfx | 0.3 | b6 hero counter morphs into the Impressions tile |
| 3.500 | 105 | 7.0 | tile-tick-E5 | T3 | sfx | 0.45 | f105 Likes 2,955 tile lands |
| 3.733 | 112 | 7.47 | tile-tick-A5 | T3 | sfx | 0.4 | f112 Comments 238 tile lands |
| 4.000 | 120 | 8.0 | tile-tick-C5 | T3 | sfx | 0.4 | f120 Engagement rate 1.72% tile lands (bar line) |
| 5.000 | 150 | 10 | ANCHOR motif A4 C5 E5 D5 -> A5 on b12 | T2 | music | 0.5 | b10-12 over the tiles; A5 lands on the b12 cut |
| 6.000 | 180 | 12 | riser bar (SFX) + stabs | T3 | music | 0.3 | b12-16 'Two weeks later.' |
| 6.000 | 180 | 12.0 | whoosh-cut | T3 | sfx | 0.4 | b12 cut to kinetic card 'Two weeks later.' |
| 6.000 | 180 | 12.0 | riser-bar-b12-16 | T2 | sfx | 0.45 | b12-16 one-bar riser into the 'Update me.' beat (+ chip Fri 23 Oct) |
| 8.000 | 240 | 16 | 1-beat filter dip (800 Hz LP, back at b17) | T3 | music | 0.0 | b16 'Update me.' bubble |
| 8.000 | 240 | 16.0 | bubble-pop | T2 | sfx | 0.55 | b16 bubble 'Update me.' |
| 8.500 | 255 | 17.0 | tool-blip | T3 | sfx | 0.4 | b17 tool line 'CLEO - How the campaign is performing' |
| 9.000 | 270 | 18 | ANCHOR motif -> A5 on b20 | T2 | music | 0.5 | b18-20 tool line; A5 lands on the b20 cut |
| 10.000 | 300 | 20 | crest build: stabs on offbeats, arp up | T3 | music | 0.5 | b20-26 counter held / final ramp |
| 10.000 | 300 | 20.0 | whoosh-cut | T3 | sfx | 0.4 | b20 cut to the held counter |
| 10.000 | 300 | 20.0 | riser-b20-24 | T2 | sfx | 0.5 | b20-24 riser while the counter is held at 1,85,700 |
| 12.000 | 360 | 24.0 | counter-ramp-C-major-run | T2 | sfx | 0.6 | f360-387 final-count ramp 1,85,700 -> 2,80,000 (8 notes, 16ths, lands C6 at the lock) |
| 12.500 | 375 | 25.0 | reverse-crash-into-lock | T2 | sfx | 0.55 | b25-26 reverse crash peaking on the lock |
| 12.950 | 388.5 | 25.9 | pre-hit gap 50 ms (kick and bass out for b25) | T3 | music | 0.0 | just before the count lock |
| 13.000 | 390 | 26 | C-MAJOR LIFT: stab + lead C-E-G-C + kick/bass drop | T1 | music | 1.15 | f390 (b26) count lock 2,80,000, harmony lifts Am -> C |
| 13.000 | 390 | 26.0 | lock-impact | T1 | sfx | 1.0 | f390 (b26) COUNT LOCK 2,80,000: impact (music: C-major stab + kick/bass drop) |
| 13.000 | 390 | 26.0 | lock-bell-C6 | T1 | sfx | 0.7 | f390 glow once: C6 bell with E6 shimmer |
| 13.000 | 390 | 26.0 | hit-stop-tape-6f | T2 | sfx | 0.6 | f390-396 hit-stop (tape click) |
| 13.200 | 396 | 26.4 | glass-tail | T3 | sfx | 0.28 | after the lock: glass tail C-E-G (2 s max) |
| 15.000 | 450 | 30.0 | morph-swish | T3 | sfx | 0.3 | b30 hero '2,80,000' morphs into the tile row |
| 15.500 | 465 | 31.0 | tile-tick-E5 | T3 | sfx | 0.4 | b31 Likes 4,500 tile (estimated landing) |
| 16.000 | 480 | 32 | ANCHOR motif -> A5 on b34 | T2 | music | 0.5 | b32-34 tiles Likes/Comments/Engagement; A5 on the b34 cut |
| 16.000 | 480 | 32.0 | tile-tick-G5 | T3 | sfx | 0.4 | b32 Comments 361 tile (estimated landing) |
| 16.500 | 495 | 33.0 | tile-tick-C6 | T3 | sfx | 0.38 | b33 Engagement rate 1.74% tile (estimated landing) |
| 17.000 | 510 | 34 | tuned arp bed, 6 tuned SFX ticks only | T3 | music | 0.5 | b34-54 plan vs actual, one post |
| 17.000 | 510 | 34.0 | whoosh-cut | T3 | sfx | 0.4 | b34 cut to the plan band |
| 17.000 | 510 | 34.0 | marker-sweep | T3 | sfx | 0.22 | b34-40 marker travels to the final value |
| 20.000 | 600 | 40.0 | marker-cross-bell-A5 | T2 | sfx | 0.6 | f600 (b40) marker crosses the top, flag 'Above range' |
| 22.000 | 660 | 44.0 | chip-ping-E5 | T2 | sfx | 0.5 | f660 (b44) chip 'Rs 15 below plan' lands |
| 23.000 | 690 | 46.0 | whoosh-cut | T3 | sfx | 0.4 | b46 cut to the one-post scene |
| 23.000 | 690 | 46.0 | bubble-pop | T2 | sfx | 0.5 | b46 bubble 'How did Ashish's post do?' |
| 23.500 | 705 | 47.0 | tool-blip | T3 | sfx | 0.4 | b47 tool line |
| 25.500 | 765 | 51.0 | table-tick-G5 | T2 | sfx | 0.45 | b51 NATIVE table lands (Impressions 44,800 / Likes / Comments) |
| 26.500 | 795 | 53.0 | chip-tick-E5 | T3 | sfx | 0.4 | b53 chip 'Campaign average 1.74%' |
| 27.000 | 810 | 54 | thinner top: hats 8ths accents, no open hat, bass keeps pulse | T3 | music | 0.7 | b54-66 comments |
| 27.000 | 810 | 54.0 | whoosh-cut | T3 | sfx | 0.4 | b54 cut to the comments bar |
| 27.000 | 810 | 54.0 | bar-grow-sweep | T3 | sfx | 0.22 | b54-58 sentiment bar grows with no digits |
| 29.000 | 870 | 58.0 | lock-tick-E5 | T2 | sfx | 0.5 | f870 (b58) 71 / 25 / 4 numbers appear; Neha K. quote 1 |
| 31.000 | 930 | 62.0 | quote-pluck-D5 | T3 | sfx | 0.4 | b62 Sandeep R. quote 2 |
| 32.000 | 960 | 64 | ANCHOR motif -> A5 on b66 | T2 | music | 0.5 | b64-66 Sandeep R. quote; A5 lands on the b66 cut |
| 33.000 | 990 | 66 | toggle plucks bed | T3 | music | 0.55 | b66-78 audience |
| 33.000 | 990 | 66.0 | whoosh-cut | T3 | sfx | 0.4 | b66 cut to audience scene |
| 33.000 | 990 | 66.0 | bubble-pop | T2 | sfx | 0.5 | b66 bubble 'Who did it reach?' |
| 34.000 | 1020 | 68.0 | card-land-tick-A4 | T3 | sfx | 0.4 | b68 Roles card (Reached 41%) |
| 36.000 | 1080 | 72.0 | toggle-click-E5 | T2 | sfx | 0.5 | b72 toggle to Commenters, bar morphs to 47% |
| 38.000 | 1140 | 76 | snare roll b76-78 | T2 | music | 0.6 | b76-78 riser into the recap |
| 38.000 | 1140 | 76.0 | riser-b76-78 | T2 | sfx | 0.45 | b76-78 riser into the recap |
| 39.000 | 1170 | 78 | lead A4 (recap phrase 1) | T2 | music | 1.0 | b78 'Built.' |
| 39.000 | 1170 | 78.0 | whoosh-cut | T3 | sfx | 0.4 | b78 cut to the recap |
| 39.000 | 1170 | 78.0 | word-hit-Built | T2 | sfx | 0.55 | b78 'Built.' (Part 1 chip lights); music lead A4 |
| 40.000 | 1200 | 80 | lead C5 (recap phrase 2) | T2 | music | 1.0 | b80 'Reviewed.' |
| 40.000 | 1200 | 80.0 | word-hit-Reviewed | T2 | sfx | 0.55 | b80 'Reviewed.' (Part 2 chip); music lead C5 |
| 41.000 | 1230 | 82 | lead E5 (recap phrase 3) | T2 | music | 1.0 | b82 'Monitored.' |
| 41.000 | 1230 | 82.0 | word-hit-Monitored | T2 | sfx | 0.55 | b82 'Monitored.' (Part 3 chip); music lead E5 |
| 42.000 | 1260 | 84 | lead A5 (recap landing) + snare roll to b88 | T2 | music | 1.0 | b84 'In one Claude chat.' |
| 42.000 | 1260 | 84.0 | word-hit-chat | T2 | sfx | 0.65 | b84 'In one Claude chat.'; music lead A5 |
| 42.000 | 1260 | 84.0 | riser-b84-88 | T2 | sfx | 0.5 | b84-88 build to the logo |
| 43.500 | 1305 | 87.0 | reverse-crash-into-logo | T2 | sfx | 0.5 | b87-88 reverse crash into the logo sting (60 ms music gap) |
| 43.950 | 1318.5 | 87.9 | pre-hit gap 50 ms | T3 | music | 0.0 | before the logo |
| 44.000 | 1320 | 88 | kick + Am swell under the logo sting (stripped groove: kick, bass, motif, soft hats) | T1 | music | 1.0 | f1320 logo / end card |
| 44.000 | 1320 | 88.0 | logo-sting | T1 | sfx | 1.5 | f1320 (b88) logo: snap + bell A4 C5 E5 A5 on 8ths, glass tail (no sub) |
| 46.000 | 1380 | 92 | ANCHOR motif -> A5 on b94 | T3 | music | 0.4 | end card, CTA |
| 47.500 | 1425 | 95 | loop pickup: SFX reverse crash + riser + whoosh; kick out; hats out | T2 | music | 0.7 | last beat lands on the f0 hit |
| 47.500 | 1425 | 95.0 | loop-pickup | T2 | sfx | 0.7 | b95 pickup: reverse crash + noise riser + whoosh peaking on the last 50 ms, lands on the f0 thud |
