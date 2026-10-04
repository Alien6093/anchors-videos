# Film B cue sheet (60.000 s, 112 BPM, 30 fps)

time = the moment the sound is heard (a transient with a lead-in is placed early so its hit lands here). script_frame = key-cue frame from the BUILD SPEC; delta = frame(time) - script_frame (must be within +/-1). Tiers: T1 loud, T2 subtle; T3 (ticks) cut.

| time_s | frame_30fps | beat | kind | tier | event | sound | volume | script_frame | delta_frames | off_half_beat_ms |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.000 | 0 | 0.00 | MUSIC | - | Teaser: riser + sub pulses (E2) | music |  | 0 | 0 | 0 |
| 0.000 | 0 | 0.00 | SFX | T1 | Teaser counter ramp 0-1.5, lands with green tick + glass (v2: +6.5 dB on the first 0.9 s so the first second is not quiet; landing unchanged) | counter-ramp-B0-v2 | 0.6 | 0 | 0 | 0 |
| 0.536 | 16 | 1.00 | SFX | T2 | v2: mid tick on beat 1 (first second lift) | mid-tick | 0.6 | 16 | 0 | 0 |
| 1.071 | 32 | 2.00 | SFX | T2 | v2: mid tick on beat 2 (first second lift) | mid-tick | 0.65 | 32 | 0 | 0 |
| 1.607 | 48 | 3.00 | MUSIC | - | Hard black: music cut, room tone | music |  | 48 | 0 | 0 |
| 1.607 | 48 | 3.00 | SFX | T1 | Smash cut to black | smash-hit | 0.85 | 48 | 0 | 0 |
| 2.143 | 64 | 4.00 | MUSIC | - | Title: sub hit + Am9 pad (E2) | music |  | 64 | 0 | 0 |
| 2.143 | 64 | 4.00 | SFX | T1 | Title sub hit on the bar line | sub-hit | 0.9 | 64 | 0 | 0 |
| 2.143 | 64 | 4.00 | SFX | T1 | v2: title sub-hit layer, 150-400 Hz thump + 20 ms 2-4 kHz transient (audible on phone speakers) | title-thump | 0.7 | 64 | 0 | 0 |
| 4.286 | 129 | 8.00 | MUSIC | - | Kick + muted pluck enter (E4) | music |  | 129 | 0 | 0 |
| 5.400 | 162 | 10.08 | SFX | T2 | Dot flip sweep start | pill-flip-tick-1 | 0.24 | 162 | 0 | 43 |
| 5.543 | 166 | 10.35 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-2 | 0.26 |  |  | 82 |
| 5.686 | 171 | 10.61 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-3 | 0.27999999999999997 |  |  | 61 |
| 5.829 | 175 | 10.88 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-4 | 0.3 |  |  | 64 |
| 5.971 | 179 | 11.15 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-5 | 0.32 |  |  | 79 |
| 6.114 | 183 | 11.41 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-6 | 0.33999999999999997 |  |  | 46 |
| 6.257 | 188 | 11.68 | SFX | T2 | Dot flip sweep (one rising sweep) | pill-flip-tick-7 | 0.36 |  |  | 96 |
| 6.400 | 192 | 11.95 | SFX | T2 | Dot flip sweep end | pill-flip-tick-8 | 0.38 | 192 | 0 | 29 |
| 7.500 | 225 | 14.00 | MUSIC | - | Marimba melody enters, hats (E5) | music |  | 225 | 0 | 0 |
| 8.036 | 241 | 15.00 | SFX | T1 | User bubble whoosh | bubble-whoosh | 0.7 |  |  | 0 |
| 8.571 | 257 | 16.00 | SFX | T1 | Snapshot counter ramp 8.571-9.643 (pitch-rising) | counter-ramp-B1 | 0.7 | 257 | 0 | 0 |
| 10.179 | 305 | 19.00 | SFX | T1 | Impressions lock click + glass tick | lock-glass | 0.7 | 305 | 0 | 0 |
| 11.000 | 330 | 20.53 | SFX | T2 | One tile tick (cascade) | tile-tick | 0.35 |  |  | 18 |
| 12.857 | 386 | 24.00 | MUSIC | - | Full groove (E5) | music |  | 386 | 0 | 0 |
| 13.400 | 402 | 25.01 | SFX | T2 | Rows land as one sweep 13.4-14.4 | row-swish | 0.35 | 402 | 0 | 7 |
| 15.500 | 465 | 28.93 | SFX | T2 | Highlight ping on the two Friday rows | highlight-ping | 0.4 | 465 | 0 | 36 |
| 17.600 | 528 | 32.85 | SFX | T2 | Forecast marker fill swish | bar-fill | 0.4 |  |  | 79 |
| 18.214 | 546 | 34.00 | MUSIC | - | Filter sweep up into the breath | music |  | 546 | 0 | 0 |
| 18.700 | 561 | 34.91 | SFX | T1 | Marker lock tick (67-69% readout) | lock-glass | 0.7 | 561 | 0 | 50 |
| 19.286 | 579 | 36.00 | MUSIC | - | DIP: bass + click + pad (E2) | music |  | 579 | 0 | 0 |
| 19.286 | 579 | 36.00 | SFX | T2 | Whip in (peak lands on the cut) | whip-peak | 0.4 | 579 | 0 | 0 |
| 20.367 | 611 | 38.02 | SFX | T1 | Riser 20.367 to 21.438 | riser-1071 | 0.6 | 611 | 0 | 10 |
| 20.400 | 612 | 38.08 | MUSIC | - | Snare-tick rise to the crest | music |  | 612 | 0 | 43 |
| 21.429 | 643 | 40.00 | MUSIC | - | Crest chord bloom, half-time kick (E6) | music |  | 643 | 0 | 0 |
| 22.500 | 675 | 42.00 | MUSIC | - | CREST: full groove drops in, melody climbs with the count (E9) | music |  | 675 | 0 | 0 |
| 22.500 | 675 | 42.00 | SFX | T1 | Final counter ramp 22.5-24.643 (pitch-rising) | counter-ramp-final | 0.6 | 675 | 0 | 0 |
| 24.643 | 739 | 46.00 | MUSIC | - | Melody resolves on the tonic (Am) at the count-up lock | music |  | 739 | 0 | 0 |
| 24.643 | 739 | 46.00 | SFX | T1 | 2,80,000 lock: glass tick (v2: picture lands on f739 too) | lock-glass | 0.34 | 739 | 0 | 0 |
| 24.643 | 739 | 46.00 | SFX | T1 | 2,80,000 lock: low impact | low-impact | 0.36 | 739 | 0 | 0 |
| 26.000 | 780 | 48.53 | SFX | T2 | One tile tick | tile-tick | 0.35 |  |  | 18 |
| 27.857 | 836 | 52.00 | SFX | T1 | CPM glow ping (Rs 525) | label-ping-3 | 0.5 | 836 | 0 | 0 |
| 30.000 | 900 | 56.00 | MUSIC | - | Groove steady, pad opens (E8) | music |  | 900 | 0 | 0 |
| 31.071 | 932 | 58.00 | SFX | T2 | FLIP swish (Darika 4th to 1st), v2: flip starts f932 = beat 58 | sort-swish | 0.42 | 932 | 0 | 0 |
| 33.750 | 1013 | 63.00 | SFX | T1 | Totals row lock click + glass tick | lock-glass | 0.7 | 1013 | 0 | 0 |
| 34.286 | 1029 | 64.00 | MUSIC | - | Bass walks, light lift (E7) | music |  | 1029 | 0 | 0 |
| 36.429 | 1093 | 68.00 | MUSIC | - | Lift as the marker crosses the band | music |  | 1093 | 0 | 0 |
| 36.500 | 1095 | 68.13 | SFX | T1 | Marker crossing the band top | label-ping-5 | 0.45 | 1095 | 0 | 71 |
| 36.500 | 1095 | 68.13 | SFX | T1 | Marker crossing tick | green-tick | 0.35 | 1095 | 0 | 71 |
| 37.400 | 1122 | 69.81 | SFX | T2 | CPM chip click | chip-click-2 | 0.45 | 1122 | 0 | 100 |
| 38.571 | 1157 | 72.00 | MUSIC | - | Sc10: bass + hats (E6) | music |  | 1157 | 0 | 0 |
| 38.839 | 1165 | 72.50 | SFX | T2 | User bubble pop (b72.5) | reaction-pop | 0.4 | 1165 | 0 | 0 |
| 39.375 | 1181 | 73.50 | SFX | T2 | CLEO tool-line blip (b73.5) | tool-blip | 0.3 | 1181 | 0 | 0 |
| 40.714 | 1221 | 76.00 | MUSIC | - | Sc10: soft pluck joins (-3 dB under the sentence/table) | music |  | 1221 | 0 | 0 |
| 40.714 | 1221 | 76.00 | SFX | T2 | Soft table whoosh (b76) | widget-whoosh | 0.28 | 1221 | 0 | 0 |
| 40.982 | 1229 | 76.50 | SFX | T2 | ONE soft count-up 40.982-41.786 (b76.5-78), locks with the tile tick | count-up-soft | 0.5 | 1229 | 0 | 0 |
| 41.786 | 1254 | 78.00 | SFX | T2 | Count-up lock: tile tick (b78) | tile-tick | 0.3 | 1254 | 0 | 0 |
| 41.786 | 1254 | 78.00 | SFX | T2 | View post chip click (b78) | chip-click-1 | 0.4 | 1254 | 0 | 0 |
| 42.321 | 1270 | 79.00 | MUSIC | - | Sc10: kick drops out (into scene 11) | music |  | 1270 | 0 | 0 |
| 42.321 | 1270 | 79.00 | SFX | T2 | Check tick: content-changed row fades in (b79) | check-stroke-tick | 0.26 | 1270 | 0 | 0 |
| 42.857 | 1286 | 80.00 | MUSIC | - | Sc11 (bar 20): drums thin, pad + pluck, melody rests (E5) | music |  | 1286 | 0 | 0 |
| 44.100 | 1323 | 82.32 | SFX | T2 | Sentiment fill (brief 44.1) | bar-fill | 0.4 | 1323 | 0 | 96 |
| 46.900 | 1407 | 87.55 | SFX | T2 | Negative comment card whoosh | card-whoosh | 0.42 | 1407 | 0 | 25 |
| 49.286 | 1479 | 92.00 | MUSIC | - | Sc12: E5 continues (audience) | music |  | 1479 | 0 | 0 |
| 50.500 | 1515 | 94.27 | SFX | T2 | Panel tick | panel-tick | 0.35 | 1515 | 0 | 125 |
| 51.429 | 1543 | 96.00 | SFX | T2 | v2: soft Am9 pad swell across 51.4-55.7 (through the audience section into the end card) | pad-swell | 0.45 | 1543 | 0 | 0 |
| 51.429 | 1543 | 96.00 | MUSIC | - | Sc12: drums drop; pad wide | music |  | 1543 | 0 | 0 |
| 51.964 | 1559 | 97.00 | SFX | T2 | Toggle to Likers | toggle-click | 0.45 | 1559 | 0 | 0 |
| 52.200 | 1566 | 97.44 | SFX | T2 | Roles bar morph swish | morph-swish | 0.4 | 1566 | 0 | 32 |
| 53.571 | 1607 | 100.00 | MUSIC | - | Melody resolves on the tonic (Am) at the Commenters toggle (F then Am) | music |  | 1607 | 0 | 0 |
| 53.571 | 1607 | 100.00 | SFX | T2 | Toggle to Commenters | toggle-click | 0.45 | 1607 | 0 | 0 |
| 53.800 | 1614 | 100.43 | SFX | T2 | Roles bar morph swish | morph-swish | 0.4 | 1614 | 0 | 39 |
| 55.714 | 1671 | 104.00 | MUSIC | - | End card: Am(add9) chord (E2) | music |  | 1671 | 0 | 0 |
| 55.900 | 1677 | 104.35 | SFX | T1 | Logo hit (transient on the frame cue) | logo-hit-short | 0.55 | 1677 | 0 | 82 |
| 56.200 | 1686 | 104.91 | SFX | T1 | Glass tail 56.2 to 59.6 | glass-tail | 0.45 |  |  | 50 |
| 57.857 | 1736 | 108.00 | MUSIC | - | Chord moves to C, decays to silence at 60.000 | music |  | 1736 | 0 | 0 |
