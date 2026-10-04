# QA report A (60.0s film, "Brief. Review. Approve.")
Output: `final/anchors-zeko-A-brief-review-approve-60s.mp4`
Mux: `ffmpeg -i video-A/out/A_silent.mp4 -i audio-A/A_mix.wav -map 0:v -map 1:a -vf scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 30 -c:a aac -b:a 320k -ar 48000 -ac 2 -t 60 -movflags +faststart`
(v4 settings: crf 16 / AAC 320k. The silent source was only 3.8 Mbps full-range yuvj420p, so a 16-20 Mbps target would be padding; crf 16 gives 3.95 Mbps video, 1080p UI content, no visible artefacts in stills. Source range was converted from full (pc) to limited (tv) bt709 so players do not clip/crush.)

ffprobe: 1920x1080, 30fps, H.264 High, yuv420p, 1800 frames, video 60.000s; AAC LC 48k stereo ~312 kbps, 60.000s (trimmed with -t; encoder priming handled by edit list); both stream start_time 0.000000; container 60.000s.
ebur128 (muxed audio): integrated -14.0 LUFS, true peak -1.0 dBTP, LRA 8.1 LU. Source A_mix.wav: -14.0 LUFS, peak -1.2 dBFS (AAC adds 0.2 dB inter-sample overshoot, still <= -1.0).

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Duration exactly 60.000s, v = a | PASS | video 60.000, audio 60.000, format 60.000, 1800 frames |
| 2 | Codec/format | PASS | H.264 High, yuv420p, AAC 48k stereo, +faststart |
| 3 | A/V sync, no offset/drift | PASS | Both start_time 0. Onsets measured on decoded mux vs source wav at 1.07, 17.68, 49.29, 53.57: diff 0.0 ms at all four (start and end), so no drift |
| 4 | Loudness target (-14 LUFS) | PASS | -14.0 LUFS, TP -1.0 dBTP |
| 5 | First frame | PASS | f0: Darika Jain first-draft card, dark bg, no black or blank frame. No "Dramatised example" tag |
| 6 | Last frame / fade | PASS | Fade to black over the last frames; blackdetect flags only 59.933-59.967 (2 frames). End card fully legible at 59.0 |
| 7 | Black gaps | PASS | blackdetect: only 1.600-2.167 (intentional hard black, script 1.607-2.143) and the dark title frames at 2.2. No unintended black |
| 8 | Smash cut 1.607 (f48) | PASS | f47 draft + Off-brief stamp, f48 pure black. Exact |
| 9 | Title sub-hit 2.143 (f64) | PASS | f63 black, f64 first title element (logo dots) appears. Exact |
| 10 | Scene boundaries (17) | PASS | Stills at every boundary read: S2 empty chat + pills start, S3 chat, S4 brief text, S5 format chips, S6 chip->payment page, S7 whip/chat, S8 empty chat + "Sat 3 Oct" chip, S9 draft preview w/ Mon 5 Oct, S10 flashes (Jyoti card), S11 "0 of 8", S12 Ashish request changes, S13, S14 table pan, S15 "Set once. Final.", S16 LinkedIn feed, S17 logo. Cuts land on scripted frames (S16 cut is exactly f1607) |
| 11 | Payment chip click 17.000 (f510) / page 17.143 | PASS with note | Cursor sits on the Pay chip at f509-f511 but there is no distinct press/ripple at f510; orange glow at f512-514, chip morphs f516-f525. See issue 2 |
| 12 | Key change + payment chime 17.679 (f530) | PASS with note | Full-bleed light page finishes landing at f529-531 (edges still inside frame at f529, full at f530-531); green check circle visible and fully drawn by f535. Chime lands as the page fills. Check-stroke tick (17.8, f534) sits at the end of the draw. See issue 3 |
| 13 | Gold impact 49.286 (f1479) | PASS with note | Gold glow bloom starts at exactly f1479 (f1478 has none). Counter reaches 8 at ~f1471-1474 (f1470 shows 7, f1474 shows 8), i.e. 5-8 frames before the hit, and the large "8 of 8." wipe grows f1481-1490 (after the hit). See issue 1 |
| 14 | Cymbal at Live 53.571 (f1607) | PASS | f1606 = "Set once. Final." scene, f1607 = full-bleed LinkedIn feed (Ashish post "Just now"); hard cut on the frame. Reactions 0 -> 88 by f1608+ |
| 15 | Logo hit ~55.9 (f1677) | PASS | f1676 fourth dot still an outline, f1677 four solid dots, f1678 complete. Within 1 frame |
| 16 | 4 Live / 4 Scheduled board, S16 | PASS | f1665 shows board, "4 Live / 4 Scheduled", "Thu 8 Oct"; matches script. (Board is visible at f1665 = 55.5; cut to end card follows) |
| 17 | Banned words on screen (dramatised/illustrative/demo/fabricated/sample) | PASS | grep of video-A/src (case-insensitive) finds none; frames at f0, f46-47, f1253 (Ashish card), and the S13 boundary show no such tag. NOTE: the script asks for a "Dramatised example" tag at 0-1.6, 36.7-41.5, 42-47; the animator correctly left it off per this brief, so the script and picture now disagree (see issue 5). No OCR tool installed, so this is source grep + spot stills, not full-frame OCR |
| 18 | Stand-alone (no "Part of" / series line) | PASS | none seen |
| 19 | Text legibility / numbers | PASS | Fees Rs 1,47,000 (counts up to it 17.9-18.5), dates, "Change requests: 1/2", table values read correctly in stills |

## Issues found (for owners; nothing re-rendered)
1. Gold hit vs counter lock (animator, low). Counter reads "8 of 8" about 5-8 frames (0.17-0.27s) before the gold bloom and the giant "8 of 8." graphic arrives 2-11 frames after the impact at 1479. Fix: move the counter's 8th tick to f1477-1479 and start the large "8 of 8." scale-in on f1479. Risk if left: hit reads as landing after the info.
2. Pay click has no visible press (animator, low). The script's T1 pay-click at 17.000 (f510) shows only cursor-on-button; add a 2-frame press-scale/darken at f510.
3. Payment page arrival vs chime (animator, low). Full-bleed page is only fully filled at ~f530 and the check is already complete by f535, so the check draw is nearly invisible against the "silence, then chime" beat at 17.679. Fix: hold the check draw start at f530 so its stroke runs f530-f538 with the tick at f534.
4. Title words overlap during slide (animator, low). f68-f72 "Brief." / "Review." / "Approve." collide horizontally while sliding in ("Brief.Review." touching, "Review.Approve." touching at f72). Fix: increase stagger spacing or start each word from further off-screen so they never overlap.
5. Script vs picture mismatch on "Dramatised example" tags (director/animator, decision). Section 3 rows 1, 12, 13 of the script still specify the tag; picture has none. Either update the script or leave as is. Nothing on screen breaches the banned-word rule.
6. End card logo mark position (animator, low, informational). At f1671-1678 the four-dot mark sits at upper-left of frame while glow is centred; it settles to a centred lockup by f1710, so this is only the draw-in, but check the intended motion.
7. Not measured (editor): full-frame OCR of all 1800 frames not available (no tesseract); waveform onsets checked at 4 cues only, not all 90+ cue-sheet rows; the SFX/music sit is sound designer's domain (no sound issues found in loudness/peak).

## Sound owner
No defects found. A_mix.wav loudness -14.0 LUFS, sample peak -1.2 dBFS, 60.000s exact, sync 0 ms at measured cues.

## Verdict
Deliverable is ready to ship. Issues 1-4 are polish, none block. Owner: animator for 1-4 and 6, director for 5, sound none.
