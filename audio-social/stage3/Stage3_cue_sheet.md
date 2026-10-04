# Stage 3 cue sheet (23 bars, 112 BPM, 49.286 s grid, 49.300 s file = 1479 f @30)

Gain = cue volume before the SFX bus (x0.85) and master (G 6.72 dB, limiter 0.7972). Music ducks per audio-B v5 rules, plus -6 dB for the freeze length at both locks.

| time s | frame | beat | kind | tier | cue | gain | note |
|---|---|---|---|---|---|---|---|
| 0.000 | 0.0 | 0.00 | MUSIC | - | music |  | Hook: riser + sub pulses (src 0-2.143), black from 1.607 [A: src 0-2.143] |
| 0.000 | 0.0 | 0.00 | SFX | T1 | counter-ramp-B0-v2 | 0.6 | v5 cue, src 0.000 s -> out 0.000 s (unchanged) |
| 0.000 | 0.0 | 0.00 | SFX | T1 | s3-f0-thud | 0.95 | NEW frame-0 thud (sub 100>38 Hz + 2-6 kHz click) under the 2,80,000 freeze |
| 0.000 | 0.0 | 0.00 | SFX | T1 | lock-glass | 0.5 | NEW glass tick on frame 0 (reuse lock-glass) |
| 0.536 | 16.1 | 1.00 | SFX | T2 | mid-tick | 0.6 | v5 cue, src 0.536 s -> out 0.536 s (unchanged) |
| 1.071 | 32.1 | 2.00 | SFX | T2 | mid-tick | 0.65 | v5 cue, src 1.071 s -> out 1.071 s (unchanged) |
| 1.607 | 48.2 | 3.00 | SFX | T1 | smash-hit | 0.85 | v5 cue, src 1.607 s -> out 1.607 s (unchanged) |
| 2.114 | 63.4 | 3.95 | SFX | T2 | pill-flip-tick-8 | 0.38 | v5 cue, src 6.400 s -> out 2.114 s (src-4.286) |
| 2.143 | 64.3 | 4.00 | MUSIC | - | music |  | Cut 1: music slice B starts (kick + pluck E4, src 6.429), 1-beat equal-power crossfade in over beat 3 [B: src 6.429-12.857] |
| 2.143 | 64.3 | 4.00 | SFX | T1 | sub-hit | 0.9 | v5 cue, src 2.143 s -> out 2.143 s (unchanged) |
| 2.143 | 64.3 | 4.00 | SFX | T1 | title-thump | 0.7 | v5 cue, src 2.143 s -> out 2.143 s (unchanged) |
| 3.750 | 112.5 | 7.00 | SFX | T1 | bubble-whoosh | 0.7 | v5 cue, src 8.036 s -> out 3.750 s (src-4.286) |
| 4.285 | 128.6 | 8.00 | SFX | T1 | counter-ramp-B1 | 0.7 | v5 cue, src 8.571 s -> out 4.285 s (src-4.286) |
| 5.357 | 160.7 | 10.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 10 (-2 dB under T2, pan alternating) |
| 5.893 | 176.8 | 11.00 | SFX | T1 | s3-hitstop-tape-5f | 0.55 | NEW hit-stop tape click, 5f freeze at 1,85,700 lock (f177-181); music ducks -6 dB for the freeze |
| 5.893 | 176.8 | 11.00 | SFX | T1 | lock-glass | 0.7 | v5 cue, src 10.179 s -> out 5.893 s (src-4.286) |
| 6.429 | 192.9 | 12.00 | SFX | T1 | s3-riser-bar | 0.5 | NEW 1-bar filter-sweep riser before the dip (out beats 12-16), resolves into the whip |
| 6.714 | 201.4 | 12.53 | SFX | T2 | tile-tick | 0.35 | v5 cue, src 11.000 s -> out 6.714 s (src-4.286) |
| 6.964 | 208.9 | 13.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 13 (-2 dB under T2, pan alternating) |
| 8.036 | 241.1 | 15.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 15 (-2 dB under T2, pan alternating) |
| 8.372 | 251.2 | 15.63 | SFX | T2 | whip-peak | 0.4 | v5 cue, src 19.086 s -> out 8.372 s (src-10.714) |
| 8.571 | 257.1 | 16.00 | MUSIC | - | music |  | Cut 2: music slice C (DIP bar, crest 21.4/22.5 out 10.7/11.8, end chord), 1-beat crossfade from B over beat 15 [C: src 19.286-60.0] |
| 9.653 | 289.6 | 18.02 | SFX | T1 | riser-1071 | 0.6 | v5 cue, src 20.367 s -> out 9.653 s (src-10.714) |
| 10.714 | 321.4 | 20.00 | MUSIC | - | music |  | Crest: full groove [C] |
| 11.786 | 353.6 | 22.00 | SFX | T1 | counter-ramp-final | 0.6 | v5 cue, src 22.500 s -> out 11.786 s (src-10.714) |
| 13.929 | 417.9 | 26.00 | MUSIC | - | music |  | Melody resolves on Am at the 2,80,000 lock [C] |
| 13.929 | 417.9 | 26.00 | SFX | T1 | s3-hitstop-tape-6f | 0.6 | NEW hit-stop tape click, 6f freeze at 2,80,000 lock (f418-423); music ducks -6 dB for the freeze |
| 13.929 | 417.9 | 26.00 | SFX | T1 | lock-glass | 0.34 | v5 cue, src 24.643 s -> out 13.929 s (src-10.714) |
| 13.929 | 417.9 | 26.00 | SFX | T1 | low-impact | 0.36 | v5 cue, src 24.643 s -> out 13.929 s (src-10.714) |
| 15.000 | 450.0 | 28.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 28 (-2 dB under T2, pan alternating) |
| 15.286 | 458.6 | 28.53 | SFX | T2 | tile-tick | 0.35 | v5 cue, src 26.000 s -> out 15.286 s (src-10.714) |
| 16.071 | 482.1 | 30.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 30 (-2 dB under T2, pan alternating) |
| 17.143 | 514.3 | 32.00 | SFX | T2 | label-ping-3 | 0.5 | v5 cue, src 27.857 s -> out 17.143 s (src-10.714) |
| 17.143 | 514.3 | 32.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 32 (-2 dB under T2, pan alternating) |
| 18.214 | 546.4 | 34.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 34 (-2 dB under T2, pan alternating) |
| 20.357 | 610.7 | 38.00 | SFX | T2 | sort-swish | 0.42 | v5 cue, src 31.071 s -> out 20.357 s (src-10.714) |
| 23.036 | 691.1 | 43.00 | SFX | T1 | lock-glass | 0.7 | v5 cue, src 33.750 s -> out 23.036 s (src-10.714) |
| 25.786 | 773.6 | 48.13 | SFX | T2 | label-ping-5 | 0.45 | v5 cue, src 36.500 s -> out 25.786 s (src-10.714) |
| 25.786 | 773.6 | 48.13 | SFX | T2 | green-tick | 0.35 | v5 cue, src 36.500 s -> out 25.786 s (src-10.714) |
| 26.686 | 800.6 | 49.81 | SFX | T2 | chip-click-2 | 0.45 | v5 cue, src 37.400 s -> out 26.686 s (src-10.714) |
| 28.125 | 843.7 | 52.50 | SFX | T2 | reaction-pop | 0.4 | v5 cue, src 38.839 s -> out 28.125 s (src-10.714) |
| 28.393 | 851.8 | 53.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 53 (-2 dB under T2, pan alternating) |
| 28.661 | 859.8 | 53.50 | SFX | T2 | tool-blip | 0.3 | v5 cue, src 39.375 s -> out 28.661 s (src-10.714) |
| 30.000 | 900.0 | 56.00 | SFX | T2 | widget-whoosh | 0.28 | v5 cue, src 40.714 s -> out 30.000 s (src-10.714) |
| 30.000 | 900.0 | 56.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 56 (-2 dB under T2, pan alternating) |
| 30.268 | 908.0 | 56.50 | SFX | T2 | count-up-soft | 0.5 | v5 cue, src 40.982 s -> out 30.268 s (src-10.714) |
| 31.071 | 932.1 | 58.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 58 (-2 dB under T2, pan alternating) |
| 31.072 | 932.2 | 58.00 | SFX | T2 | tile-tick | 0.3 | v5 cue, src 41.786 s -> out 31.072 s (src-10.714) |
| 31.072 | 932.2 | 58.00 | SFX | T2 | chip-click-1 | 0.4 | v5 cue, src 41.786 s -> out 31.072 s (src-10.714) |
| 31.607 | 948.2 | 59.00 | SFX | T2 | check-stroke-tick | 0.26 | v5 cue, src 42.321 s -> out 31.607 s (src-10.714) |
| 33.386 | 1001.6 | 62.32 | SFX | T2 | bar-fill | 0.4 | v5 cue, src 44.100 s -> out 33.386 s (src-10.714) |
| 33.750 | 1012.5 | 63.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 63 (-2 dB under T2, pan alternating) |
| 35.893 | 1076.8 | 67.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 67 (-2 dB under T2, pan alternating) |
| 36.186 | 1085.6 | 67.55 | SFX | T2 | card-whoosh | 0.42 | v5 cue, src 46.900 s -> out 36.186 s (src-10.714) |
| 39.786 | 1193.6 | 74.27 | SFX | T2 | panel-tick | 0.35 | v5 cue, src 50.500 s -> out 39.786 s (src-10.714) |
| 40.714 | 1221.4 | 76.00 | SFX | T2 | pad-swell | 0.45 | v5 cue, src 51.429 s -> out 40.714 s (src-10.714) |
| 41.250 | 1237.5 | 77.00 | SFX | T2 | toggle-click | 0.45 | v5 cue, src 51.964 s -> out 41.250 s (src-10.714) |
| 41.486 | 1244.6 | 77.44 | SFX | T2 | morph-swish | 0.4 | v5 cue, src 52.200 s -> out 41.486 s (src-10.714) |
| 42.857 | 1285.7 | 80.00 | SFX | T2 | toggle-click | 0.45 | v5 cue, src 53.571 s -> out 42.857 s (src-10.714) |
| 43.086 | 1292.6 | 80.43 | SFX | T2 | morph-swish | 0.4 | v5 cue, src 53.800 s -> out 43.086 s (src-10.714) |
| 44.464 | 1333.9 | 83.00 | SFX | T2 | tile-tick | 0.278 | NEW 9:16 crop-hop tick, beat 83 (-2 dB under T2, pan alternating) |
| 44.903 | 1347.1 | 83.82 | SFX | T1 | logo-hit-short | 0.55 | v5 cue, src 55.680 s -> out 44.903 s (src-10.714) |
| 45.000 | 1350.0 | 84.00 | MUSIC | - | music |  | End card chord Am(add9) [C] |
| 45.423 | 1362.7 | 84.79 | SFX | T1 | glass-tail | 0.45 | v5 cue, src 56.200 s -> out 45.423 s (src-10.714) |
| 47.143 | 1414.3 | 88.00 | MUSIC | - | music |  | Chord moves to C, decays to silence [C] |
| 48.886 | 1466.6 | 91.25 | SFX | T1 | s3-loop-inhale | 0.6 | NEW loop bridge: reversed-cymbal swell + air inhale into the frame-0 thud |
