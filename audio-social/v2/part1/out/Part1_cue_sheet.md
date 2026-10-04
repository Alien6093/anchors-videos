# Part 1 (BUILD) cue sheet

120 BPM, frame = beat x 15 @30 fps, time = frame / 30. 48.000 s = 1440 f = 2,304,000 samples. 77 SFX cues + 26 music events + 4 holes.

Tiers: T1 hit; T2 transition / UI; T3 detail; music event. Gain = trim in dB relative to the peak-normalised voice on its SFX class bus (hit / trans / swell / ui). Cues with a fractional frame are sub-frame pre-rolls (riser peaks one 16th before the cut, pickup ends on the last sample).

Frame check against script v2 beat sheet: PASS (31 picture-locked cues, all frame = beat x 15 or script frame)

| time (s) | frame | beat | cue | tier | gain | picture event |
|---|---|---|---|---|---|---|
| 0.000 | 0 | 0 | hook-slam | T1 | 0 dB (hit) | f0 settled prompt bubble, thud + snap with motif A4 (music), 16th hat from f0 |
| 0.000 | 0 | 0 | MUSIC hook: kick + snap + hat 16ths + motif A4 (f0 + 1 ms) | M | stem | f0 settled prompt bubble |
| 0.500 | 15 | 1 | MUSIC motif C5 | M | stem |  |
| 1.000 | 30 | 2 | MUSIC motif E5 (caption swap) | M | stem | f30 caption swap |
| 1.000 | 30 | 2 | swap-whoosh-1 | T3 | -9 dB (trans) | f30 caption swap "A creator campaign. In Claude." |
| 1.500 | 45 | 3 | MUSIC motif D5 (passing) | M | stem |  |
| 2.000 | 60 | 4 | chip-note-1 | T2 | -6 dB (ui) | Audience chip A4 pops |
| 2.000 | 60 | 4 | hook-land-A5 | T1 | -9 dB (hit) | A5 lands on the cut to ASKS (f60), crash + impact |
| 2.000 | 60 | 4 | MUSIC motif A5 lands, groove 1 starts (kick, bass, clap, offbeat open hat, pad) | M | stem | cut to ASKS |
| 2.000 | 60 | 4 | whoosh-cut-b4 | T2 | -4 dB (trans) | cut to ASKS (f60) |
| 2.500 | 75 | 5 | chip-note-2 | T2 | -6 dB (ui) | Product chip C5 pops |
| 3.000 | 90 | 6 | chip-note-3 | T2 | -6 dB (ui) | Motive chip E5 pops |
| 3.500 | 105 | 7 | chip-note-4 | T2 | -6 dB (ui) | Tool chip A5 pops |
| 4.000 | 120 | 8 | card-pop-plan | T3 | -9 dB (ui) | NATIVE Plan card pops |
| 4.000 | 120 | 8 | whoosh-cut-b8 | T2 | -5 dB (trans) | cut to PLAN (f120) |
| 5.000 | 150 | 10 | MUSIC motif full form A4-C5-E5-D5 -> A5 on b12 | M | stem |  |
| 6.000 | 180 | 12 | MUSIC groove 2: tresillo arp enters (opens over 4 bars), shaker | M | stem | cut to REACH |
| 6.000 | 180 | 12 | whoosh-cut-b12 | T2 | -5 dB (trans) | cut to REACH (f180) |
| 6.250 | 187.50 | 12.5 | card-pop-proj | T3 | -9 dB (ui) | Projection card from b12.5 (f187.5 -> f188) |
| 7.970 | 239.10 | 15.94 | MUSIC HOLE hit-stop b16 (4 f + 30 ms pre) | M | -inf | pre-hit gap / hit-stop |
| 8.000 | 240 | 16 | hit-stop-lock | T1 | -4 dB (hit) | lock click + 4 f hit-stop on f240 (music hole f239-f244) |
| 8.000 | 240 | 16 | range-sweep | T3 | -13 dB (swell) | range bar draws b14-b16, peaks on the lock |
| 9.000 | 270 | 18 | MUSIC motif full form -> A5 on b20 | M | stem |  |
| 10.000 | 300 | 20 | MUSIC card taps as 8th plucks panned L-R (b20-b26), chord stabs on offbeats, rim | M | stem | card cascade |
| 10.000 | 300 | 20 | whoosh-cut-b20 | T2 | -4 dB (trans) | cut to CREATORS (f300), card cascade starts (card taps in music) |
| 13.000 | 390 | 26 | chip-click-sort | T3 | -8 dB (ui) | chip "Sort: Engagement" click (f390) |
| 13.500 | 405 | 27 | MUSIC rim hit on the hard cut | M | stem | hard cut f405 |
| 13.500 | 405 | 27 | whoosh-cut-b27 | T2 | -7 dB (trans) | hard cut to post-sort frame (f405); rim hit in music |
| 15.000 | 450 | 30 | MUSIC motif full form -> A5 on b32 | M | stem |  |
| 16.000 | 480 | 32 | key-click-00 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 16.000 | 480 | 32 | MUSIC build groove under typing | M | stem | cut chat |
| 16.000 | 480 | 32 | whoosh-cut-b32 | T2 | -4 dB (trans) | cut to CUT chat (f480) |
| 16.250 | 487.50 | 32.5 | key-click-02 | T3 | -18 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 16.375 | 491.25 | 32.75 | key-click-03 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 16.500 | 495 | 33 | key-click-04 | T3 | -17 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 16.750 | 502.50 | 33.5 | key-click-06 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 17.000 | 510 | 34 | key-click-08 | T3 | -18 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 17.125 | 513.75 | 34.25 | key-click-09 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 17.375 | 521.25 | 34.75 | key-click-11 | T3 | -18 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 17.500 | 525 | 35 | key-click-12 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 17.750 | 532.50 | 35.5 | key-click-14 | T3 | -18 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 18.000 | 540 | 36 | key-click-16 | T3 | -17 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 18.250 | 547.50 | 36.5 | key-click-18 | T3 | -16 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 18.375 | 551.25 | 36.75 | key-click-19 | T3 | -17 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 18.500 | 555 | 37 | key-click-20 | T3 | -18 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 18.750 | 562.50 | 37.5 | key-click-22 | T3 | -17 dB (ui) | typed key (16th grid, re-time to native typing if it differs) |
| 19.000 | 570 | 38 | enter-thock | T1 | -4 dB (hit) | Enter at b38 (f570) |
| 19.000 | 570 | 38 | send-whoosh | T3 | -7 dB (trans) | bubble send |
| 19.500 | 585 | 39 | pill-tick-1 | T3 | -7 dB (ui) | tool pill "CLEO - Adjust the creator list" |
| 20.000 | 600 | 40 | MUSIC snare roll b40-b43.875 (8ths, 16ths, 32nds), kick keeps 4-on-floor to b43 | M | stem |  |
| 20.500 | 615 | 41 | pill-tick-2 | T3 | -7 dB (ui) | tool pill "CLEO - What this campaign costs" |
| 21.500 | 645 | 43 | MUSIC kick + bass out (last beat), pre-drop gap 3 f before b44 | M | stem |  |
| 21.900 | 657 | 43.8 | MUSIC HOLE pre-drop gap b44 (3 f) | M | -inf | pre-hit gap / hit-stop |
| 21.938 | 658.13 | 43.875 | reverse-crash-b44 | T2 | -8 dB (swell) | reverse crash into the drop (peak in the pre-drop gap) |
| 21.938 | 658.13 | 43.875 | riser-build-b36 | T1 | -6 dB (trans) | riser b36 -> peak at b43.875, then pre-drop gap |
| 22.000 | 660 | 44 | drop-impact | T1 | 0 dB (hit) | DROP (f660): digit roll "16" settles, impact + crash, bass drop |
| 22.000 | 660 | 44 | MUSIC DROP: full groove, 16th arp, stabs, motif full level (A4 b44 -> A5 b46) | M | stem | digit roll 16 -> 8 |
| 22.200 | 666 | 44.4 | digit-roll | T2 | -9 dB (ui) | digit roll 16 -> 8 (8 f, f666-f674) |
| 22.467 | 674 | 44.93333333333333 | digit-land | T1 | -6 dB (hit) | "8" lands (held >= 24 f) |
| 23.500 | 705 | 47 | cell-write-1 | T2 | -8 dB (ui) | Before/After cell overwritten (b47, f705) |
| 24.000 | 720 | 48 | cell-write-2 | T2 | -8 dB (ui) | Before/After cell overwritten (b48, f720) |
| 26.000 | 780 | 52 | MUSIC briefs: 8-note pill arp (16ths) b52-b54, label arp b54-b56.5, hats lead | M | stem | 8 name pills |
| 26.000 | 780 | 52 | whoosh-cut-b52 | T2 | -4 dB (trans) | cut to BRIEFS (f780), 8 pills (arp fill in music) |
| 29.000 | 870 | 58 | avoid-highlight | T2 | -6 dB (ui) | "Avoid:" line highlighted (f870) |
| 30.000 | 900 | 60 | MUSIC breakdown: kick halved, filter closes, bass long notes, hats 8ths | M | stem | QUOTE |
| 30.000 | 900 | 60 | whoosh-cut-b60 | T2 | -6 dB (trans) | cut to QUOTE (f900) |
| 30.250 | 907.50 | 60.5 | row-tick-1 | T3 | -9 dB (ui) | quote row 1 lands on the half-beat |
| 30.500 | 915 | 61 | row-tick-2 | T3 | -9 dB (ui) | quote row 2 lands on the half-beat |
| 30.750 | 922.50 | 61.5 | row-tick-3 | T3 | -9 dB (ui) | quote row 3 lands on the half-beat |
| 31.000 | 930 | 62 | row-tick-4 | T3 | -9 dB (ui) | quote row 4 lands on the half-beat |
| 31.250 | 937.50 | 62.5 | row-tick-total | T2 | -5 dB (ui) | Total payable row (f937.5, held >= 20 f before the cut) |
| 31.800 | 954 | 63.6 | MUSIC drop-out f954-f959 (6 f) | M | stem |  |
| 31.800 | 954 | 63.6 | MUSIC HOLE pre-pay drop-out f954-959 (6 f) | M | -inf | pre-hit gap / hit-stop |
| 31.800 | 954 | 63.6 | quote-riser | T2 | -11 dB (trans) | riser b60 -> peak f954 (start of the 6-frame drop-out) |
| 32.000 | 960 | 64 | MUSIC C-major restart (C | G | Am7 | F), stab chord hit | M | stem | HARD cut to pay page |
| 32.000 | 960 | 64 | pay-restart | T1 | -4 dB (hit) | HARD cut to cream pay page (f960), C-major groove restart, glass chime <= 1.2 s |
| 32.500 | 975 | 65 | check-draw | T3 | -10 dB (ui) | green check strokes f960-f975 |
| 32.500 | 975 | 65 | check-tick | T3 | -6 dB (ui) | check completes (f975) |
| 34.000 | 1020 | 68 | MUSIC SENT peak groove (stamp notes from SFX stem), peak b70+ | M | stem | SENT |
| 34.000 | 1020 | 68 | whoosh-cut-b68 | T2 | -5 dB (trans) | cut to SENT chat (f1020) |
| 34.500 | 1035 | 69 | stamp-1 | T2 | -7 dB (ui) | avatar 1 stamps "Brief sent" (0.1 s stagger) |
| 34.600 | 1038 | 69.2 | stamp-2 | T2 | -6.7 dB (ui) | avatar 2 stamps "Brief sent" (0.1 s stagger) |
| 34.700 | 1041 | 69.4 | stamp-3 | T2 | -6.4 dB (ui) | avatar 3 stamps "Brief sent" (0.1 s stagger) |
| 34.800 | 1044 | 69.6 | stamp-4 | T2 | -6.1 dB (ui) | avatar 4 stamps "Brief sent" (0.1 s stagger) |
| 34.900 | 1047 | 69.8 | stamp-5 | T2 | -5.8 dB (ui) | avatar 5 stamps "Brief sent" (0.1 s stagger) |
| 35.000 | 1050 | 70 | stamp-6 | T2 | -5.5 dB (ui) | avatar 6 stamps "Brief sent" (0.1 s stagger) |
| 35.100 | 1053 | 70.2 | stamp-7 | T2 | -5.2 dB (ui) | avatar 7 stamps "Brief sent" (0.1 s stagger) |
| 35.200 | 1056 | 70.4 | light-burst | T1 | -7 dB (hit) | light burst on the 8th avatar (SENT peak) |
| 35.200 | 1056 | 70.4 | stamp-8 | T1 | -3 dB (hit) | avatar 8 stamps "Brief sent" (0.1 s stagger) |
| 36.000 | 1080 | 72 | hit-stop-freeze | T3 | -11 dB (ui) | freeze + 3% push at b72 (f1080) |
| 37.000 | 1110 | 74 | MUSIC motif full form -> A5 on b76 | M | stem |  |
| 38.000 | 1140 | 76 | MUSIC recap groove (energy 9) | M | stem | RECAP |
| 38.000 | 1140 | 76 | phrase-hit-1 | T1 | -6 dB (hit) | "You pick who." (f1140) |
| 38.000 | 1140 | 76 | whoosh-cut-b76 | T2 | -5 dB (trans) | cut to RECAP text card (f1140) |
| 40.000 | 1200 | 80 | phrase-hit-2 | T2 | -8 dB (hit) | "You set the budget." (f1200) |
| 42.000 | 1260 | 84 | MUSIC breath: kick heartbeat at b84/b86, pad + bass low-passed, hats out | M | stem | calm breath |
| 42.000 | 1260 | 84 | phrase-hit-3 | T2 | -9 dB (hit) | "Claude writes the briefs." (f1260), calm breath starts |
| 42.000 | 1260 | 84 | tease-breath | T3 | -4 dB (swell) | low-pass breath b84-b88 |
| 43.938 | 1318.13 | 87.875 | tease-lift | T2 | -7 dB (trans) | lift into the logo (peak b87.875, gap, logo f1320) |
| 43.940 | 1318.20 | 87.88 | MUSIC HOLE pre-logo gap b88 (60 ms) | M | -inf | pre-hit gap / hit-stop |
| 44.000 | 1320 | 88 | logo-sting | T1 | -12 dB (hit) | logo sting: ANCHOR A4-C5-E5-A5 on bell, kick + snap on the first note (f1320) |
| 44.000 | 1320 | 88 | MUSIC end card: stripped groove (kick, bass, clap, pad), Am9 | Fmaj7 | M | stem | END card |
| 44.500 | 1335 | 89 | cta-pop | T3 | -12 dB (ui) | CTA line "Run your creator campaign in a chat." (f1335) |
| 45.000 | 1350 | 90 | button-pop | T2 | -7 dB (ui) | button "Try it: anchors.in" (f1350) |
| 46.000 | 1380 | 92 | MUSIC motif A4 b92 -> A5 b94 under the CTA (-6 dB) | M | stem |  |
| 47.250 | 1417.50 | 94.5 | MUSIC hat roll crescendo + loop pickup (SFX) into f0 | M | stem | loop pickup |
| 48.000 | 1440 | 96 | loop-pickup | T1 | -10 dB (trans) | b95 pickup: reverse crash + rising noise, peaks on the last sample, lands on f0 hit |

## Sections

| section | beats | frames | seconds |
|---|---|---|---|
| HOOK | b0-b4 | f0-f60 | 0-2 |
| ASKS groove 1 | b4-b12 | f60-f180 | 2-6 |
| REACH groove 2 | b12-b20 | f180-f300 | 6-10 |
| CREATORS | b20-b32 | f300-f480 | 10-16 |
| CUT build | b32-b44 | f480-f660 | 16-22 |
| DROP | b44-b52 | f660-f780 | 22-26 |
| BRIEFS | b52-b60 | f780-f900 | 26-30 |
| QUOTE breakdown | b60-b64 | f900-f960 | 30-32 |
| PAY lift | b64-b68 | f960-f1020 | 32-34 |
| SENT peak | b68-b76 | f1020-f1140 | 34-38 |
| RECAP | b76-b84 | f1140-f1260 | 38-42 |
| BREATH | b84-b88 | f1260-f1320 | 42-44 |
| END card | b88-b96 | f1320-f1440 | 44-48 |
