# Film A cue sheet (60.000 s, 112 BPM, 30 fps)

time = the moment the sound is heard (a transient with a lead-in is placed early so its hit lands here). script_frame = key-cue frame from the BUILD SPEC; delta = frame(time) - script_frame (must be within +/-1). Tiers: T1 loud, T2 subtle; T3 (ticks) cut.

| time_s | frame_30fps | beat | kind | tier | event | sound | volume | script_frame | delta_frames | off_half_beat_ms |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.000 | 0 | 0.00 | MUSIC | - | Hook: riser + sub pulses (E2) | music |  | 0 | 0 | 0 |
| 1.071 | 32 | 2.00 | SFX | T1 | Off-brief stamp thud | stamp-thud | 0.85 | 32 | 0 | 0 |
| 1.607 | 48 | 3.00 | MUSIC | - | Hard black: music cut, room tone | music |  | 48 | 0 | 0 |
| 1.607 | 48 | 3.00 | SFX | T1 | Smash cut to black | smash-hit | 0.85 | 48 | 0 | 0 |
| 2.143 | 64 | 4.00 | MUSIC | - | Title: sub hit + Am9 pad (E2) | music |  | 64 | 0 | 0 |
| 2.143 | 64 | 4.00 | SFX | T1 | Title sub hit on the bar line | sub-hit | 0.9 | 64 | 0 | 0 |
| 4.286 | 129 | 8.00 | MUSIC | - | Kick + muted pluck enter (E4) | music |  | 129 | 0 | 0 |
| 4.821 | 145 | 9.00 | SFX | T2 | Pill cluster whoosh (pills 9-11) | card-whoosh | 0.34 | 145 | 0 | 0 |
| 6.429 | 193 | 12.00 | MUSIC | - | Steady arpeggio A-C-E-G (E5); pluck ducked 3 dB under typing | music |  | 193 | 0 | 0 |
| 6.964 | 209 | 13.00 | SFX | T2 | Label ping 1 of 6 | label-ping-1 | 0.3 | 209 | 0 | 0 |
| 7.500 | 225 | 14.00 | SFX | T2 | Label ping 2 of 6 | label-ping-2 | 0.3 |  |  | 0 |
| 8.036 | 241 | 15.00 | SFX | T2 | Label ping 3 of 6 | label-ping-3 | 0.3 |  |  | 0 |
| 8.571 | 257 | 16.00 | SFX | T2 | Label ping 4 of 6 | label-ping-4 | 0.3 |  |  | 0 |
| 9.107 | 273 | 17.00 | SFX | T2 | Label ping 5 of 6 | label-ping-5 | 0.3 |  |  | 0 |
| 9.643 | 289 | 18.00 | SFX | T2 | Label ping 6 of 6 | label-ping-6 | 0.3 | 289 | 0 | 0 |
| 12.321 | 370 | 23.00 | SFX | T2 | Tool line (beat 23; tier list says 12.857, frame table says 370) | tool-blip | 0.4 | 370 | 0 | 0 |
| 12.857 | 386 | 24.00 | MUSIC | - | F chord at bar 7 (E5) | music |  | 386 | 0 | 0 |
| 12.857 | 386 | 24.00 | SFX | T2 | Angle line highlight | highlight-ping | 0.4 | 386 | 0 | 0 |
| 13.929 | 418 | 26.00 | SFX | T2 | Key point 3 highlight (secondary) | highlight-ping | 0.32 | 418 | 0 | 0 |
| 15.000 | 450 | 28.00 | MUSIC | - | Full groove, hats open (E6); filter sweep to 17.143 | music |  | 450 | 0 | 0 |
| 15.268 | 458 | 28.50 | SFX | T2 | Format chip click | chip-click-1 | 0.45 | 458 | 0 | 0 |
| 16.339 | 490 | 30.50 | SFX | T2 | Attach clip 1 | attach-clip | 0.45 | 490 | 0 | 0 |
| 16.607 | 498 | 31.00 | SFX | T2 | Attach clip 2 | attach-clip | 0.45 | 498 | 0 | 0 |
| 17.000 | 510 | 31.73 | SFX | T1 | Pay-chip click (fixed time, frame 510) | pay-click | 0.75 | 510 | 0 | 125 |
| 17.143 | 514 | 32.00 | MUSIC | - | Payment page: hard cut to silence + room tone | music |  | 514 | 0 | 0 |
| 17.679 | 530 | 33.00 | MUSIC | - | KEY CHANGE to C major: warm chord, glass + bell (E8) | music |  | 530 | 0 | 0 |
| 17.679 | 530 | 33.00 | SFX | T1 | Payment glass chime = key change to C major (only note outside the groove) | payment-chime | 0.6 | 530 | 0 | 0 |
| 17.800 | 534 | 33.23 | SFX | T2 | Check stroke tick | check-stroke-tick | 0.35 |  |  | 121 |
| 19.286 | 579 | 36.00 | SFX | T2 | Reverse whip out, landing click on the chat at 19.821 | whip-land | 0.5 | 579 | 0 | 0 |
| 19.821 | 595 | 37.00 | MUSIC | - | Groove restarts on beat 37, snare pickup (E5) | music |  | 595 | 0 | 0 |
| 21.429 | 643 | 40.00 | SFX | T1 | Soft chime on the 8th avatar stamp (stamp ticks cut) | avatar-chime | 0.7 | 643 | 0 | 0 |
| 22.500 | 675 | 42.00 | SFX | T2 | Tool line (scene start) | tool-blip | 0.4 |  |  | 0 |
| 23.036 | 691 | 43.00 | SFX | T2 | Status flip sweep start (one rising sweep) | pill-flip-tick-1 | 0.28 | 691 | 0 | 0 |
| 23.317 | 699 | 43.52 | SFX | T2 | Status flip sweep | pill-flip-tick-2 | 0.30000000000000004 |  |  | 13 |
| 23.597 | 708 | 44.05 | SFX | T2 | Status flip sweep | pill-flip-tick-3 | 0.32 |  |  | 26 |
| 23.878 | 716 | 44.57 | SFX | T2 | Status flip sweep | pill-flip-tick-4 | 0.34 |  |  | 38 |
| 24.107 | 723 | 45.00 | MUSIC | - | Snare roll beats 45-47 | music |  | 723 | 0 | 0 |
| 24.158 | 725 | 45.10 | SFX | T2 | Status flip sweep | pill-flip-tick-5 | 0.36000000000000004 |  |  | 51 |
| 24.439 | 733 | 45.62 | SFX | T2 | Status flip sweep | pill-flip-tick-6 | 0.38 |  |  | 64 |
| 24.719 | 742 | 46.14 | SFX | T2 | Status flip sweep | pill-flip-tick-7 | 0.4 |  |  | 77 |
| 25.000 | 750 | 46.67 | SFX | T2 | Status flip sweep end | pill-flip-tick-8 | 0.42000000000000004 | 750 | 0 | 89 |
| 25.179 | 755 | 47.00 | MUSIC | - | Full groove, hats (E6) | music |  | 755 | 0 | 0 |
| 26.786 | 804 | 50.00 | SFX | T2 | Claude check tick (1 of 5) | check-tick | 0.34 | 804 | 0 | 0 |
| 27.857 | 836 | 52.00 | SFX | T2 | Claude check tick (3 of 5) | check-tick | 0.34 |  |  | 0 |
| 28.929 | 868 | 54.00 | SFX | T2 | Claude check tick (5 of 5) | check-tick | 0.34 | 868 | 0 | 0 |
| 29.464 | 884 | 55.00 | SFX | T2 | Badge pop | reaction-pop | 0.4 | 884 | 0 | 0 |
| 31.607 | 948 | 59.00 | MUSIC | - | Flashes: arp continues, stab per cut | music |  | 948 | 0 | 0 |
| 31.607 | 948 | 59.00 | SFX | T1 | Flash 1 stab (rising) | bright-stab-1 | 0.6 | 948 | 0 | 0 |
| 32.143 | 964 | 60.00 | SFX | T1 | Flash 2 stab (rising) | bright-stab-2 | 0.6 | 964 | 0 | 0 |
| 32.679 | 980 | 61.00 | SFX | T1 | Flash 3 stab (rising) | bright-stab-3 | 0.6 | 980 | 0 | 0 |
| 33.214 | 996 | 62.00 | SFX | T1 | Flash 4 stab (rising) | bright-stab-4 | 0.6 | 996 | 0 | 0 |
| 33.750 | 1013 | 63.00 | MUSIC | - | Approve section rising (E6), stab under each chime | music |  | 1013 | 0 | 0 |
| 34.018 | 1021 | 63.50 | SFX | T1 | Approve chime 1 of 5 (rising) | approve-chime-1 | 0.55 | 1021 | 0 | 0 |
| 34.554 | 1037 | 64.50 | SFX | T1 | Approve chime 2 of 5 (rising) | approve-chime-2 | 0.55 |  |  | 0 |
| 35.090 | 1053 | 65.50 | SFX | T1 | Approve chime 3 of 5 (rising) | approve-chime-3 | 0.55 |  |  | 0 |
| 35.625 | 1069 | 66.50 | SFX | T1 | Approve chime 4 of 5 (rising) | approve-chime-4 | 0.55 |  |  | 0 |
| 36.161 | 1085 | 67.50 | SFX | T1 | Approve chime 5 of 5 (rising) | approve-chime-5 | 0.55 | 1085 | 0 | 0 |
| 36.429 | 1093 | 68.00 | MUSIC | - | Thin to bass + pluck (E5 to E4) | music |  | 1093 | 0 | 0 |
| 36.964 | 1109 | 69.00 | SFX | T2 | Cross 1 thud | cross-thud | 0.5 | 1109 | 0 | 0 |
| 37.500 | 1125 | 70.00 | SFX | T2 | Cross 2 thud | cross-thud | 0.5 | 1125 | 0 | 0 |
| 40.179 | 1205 | 75.00 | SFX | T1 | Send blip (beat 75) | send-blip | 0.8 | 1205 | 0 | 0 |
| 44.500 | 1335 | 83.07 | SFX | T2 | Note blip 1 | note-blip | 0.4 |  |  | 36 |
| 45.000 | 1350 | 84.00 | SFX | T2 | Note blip 2 | note-blip | 0.4 |  |  | 0 |
| 45.536 | 1366 | 85.00 | SFX | T2 | Send blip (badges) | send-blip | 0.5 | 1366 | 0 | 0 |
| 46.071 | 1382 | 86.00 | MUSIC | - | Near-silence (E3), room tone only | music |  | 1382 | 0 | 0 |
| 46.607 | 1398 | 87.00 | MUSIC | - | Drum tail-out on beat 87 (toms) | music |  | 1398 | 0 | 0 |
| 47.100 | 1413 | 87.92 | MUSIC | - | Drop returns one frame before beat 88; chord swell builds (E7) | music |  | 1413 | 0 | 43 |
| 48.214 | 1446 | 90.00 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 0 |
| 48.362 | 1451 | 90.28 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 120 |
| 48.510 | 1455 | 90.55 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 28 |
| 48.658 | 1460 | 90.83 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 92 |
| 48.806 | 1464 | 91.10 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 56 |
| 48.954 | 1469 | 91.38 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 64 |
| 49.102 | 1473 | 91.66 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 84 |
| 49.250 | 1478 | 91.93 | SFX | T2 | Green tick sweep | green-tick | 0.36 |  |  | 36 |
| 49.286 | 1479 | 92.00 | MUSIC | - | GOLD hit on bar line 92: impact + C stab, NO cymbal (E9) | music |  | 1479 | 0 | 0 |
| 49.286 | 1479 | 92.00 | SFX | T1 | GOLD impact at the 8 of 8 lock (bar line 92), no cymbal | gold-impact | 0.7 | 1479 | 0 | 0 |
| 49.286 | 1479 | 92.00 | SFX | T1 | Layered chime with the gold hit | approve-chime-big | 0.45 | 1479 | 0 | 0 |
| 51.429 | 1543 | 96.00 | SFX | T2 | Calendar pop (beat 96) | calendar-pop | 0.45 |  |  | 0 |
| 51.964 | 1559 | 97.00 | MUSIC | - | Riser + snare build to the peak (E8) | music |  | 1559 | 0 | 0 |
| 51.964 | 1559 | 97.00 | SFX | T1 | Riser 51.964 to 53.571 | riser-1607 | 0.6 | 1559 | 0 | 0 |
| 53.036 | 1591 | 99.00 | SFX | T1 | Confirm chime (beat 99) | confirm-chime | 0.6 | 1591 | 0 | 0 |
| 53.571 | 1607 | 100.00 | MUSIC | - | PEAK (E10): impact + the only cymbal | music |  | 1607 | 0 | 0 |
| 53.571 | 1607 | 100.00 | SFX | T1 | CYMBAL SWELL at Live (first and only cymbal) | cymbal-swell-short | 0.5 | 1607 | 0 | 0 |
| 53.700 | 1611 | 100.24 | SFX | T2 | Reaction pop 1 | reaction-pop | 0.4 |  |  | 129 |
| 53.833 | 1615 | 100.49 | SFX | T2 | Reaction pop 2 | reaction-pop | 0.4 |  |  | 6 |
| 53.967 | 1619 | 100.74 | SFX | T2 | Reaction pop 3 | reaction-pop | 0.4 |  |  | 127 |
| 54.100 | 1623 | 100.99 | SFX | T2 | Reaction pop 4 | reaction-pop | 0.4 |  |  | 7 |
| 54.107 | 1623 | 101.00 | SFX | T1 | Live ping 1 of 4 | live-ping-1 | 0.45 |  |  | 0 |
| 54.471 | 1634 | 101.68 | SFX | T1 | Live ping 2 of 4 | live-ping-2 | 0.45 |  |  | 96 |
| 54.836 | 1645 | 102.36 | SFX | T1 | Live ping 3 of 4 | live-ping-3 | 0.45 |  |  | 75 |
| 55.200 | 1656 | 103.04 | SFX | T1 | Live ping 4 of 4 | live-ping-4 | 0.45 | 1656 | 0 | 21 |
| 55.714 | 1671 | 104.00 | MUSIC | - | End card: Am(add9) chord (E2) | music |  | 1671 | 0 | 0 |
| 55.900 | 1677 | 104.35 | SFX | T1 | Logo hit (transient on the frame cue) | logo-hit-short | 0.75 | 1677 | 0 | 82 |
| 56.200 | 1686 | 104.91 | SFX | T1 | Glass tail 56.2 to 59.6 | glass-tail | 0.6 |  |  | 50 |
| 57.857 | 1736 | 108.00 | MUSIC | - | Chord moves to C, decays to silence at 60.000 | music |  | 1736 | 0 | 0 |
