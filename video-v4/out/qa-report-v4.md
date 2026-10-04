# QA report v4 (150.0s film)
Render: `npx remotion render src/index.ts Main out/anchors-zeko-150s.mp4 --codec=h264 --crf=16 --audio-codec=aac --audio-bitrate=320k` (188 s wall, 10 cores). ffprobe: 1920x1080, 30fps, video 150.000s, AAC 48k stereo 150.059s (encoder padding). ebur128: -14.0 LUFS, sample peak -1.4 dBFS.

## Built
src/Main.tsx: 27 Sequences from timing.ts, mix.wav once, 4-frame fade-in, 12-frame fade to black at the end. Hard cuts throughout (no dissolves; scenes carry their own whips/dips). tsc clean (the Scene25 error was already gone).

## Fixes
- Seam 70.0: Scene 13 now mounts the real Scene 12 final frame (Sequence from -135) and fades it while the chip expands; verified frames 2097-2102 continuous.
- Whip-back 75.0: removed the cream stand-in in Scene 14; the chat whips in from the dark left after Scene 13's whip-out.
- Scrim 0.93 -> 0.66 in scenes 16-20 (chat visible but dimmed). Scene 17 first flash no longer has a 50% white flash; other stabs 0.34.
- Scene 23 reaction bubbles confined to the card's right edge, retimed to the pop cues.
- Sync retimes (visual moved to cues): S3 chip clicks 75/96/117; S4 range-bar lock 180; S5 card taps 6/14/22/30, sort 95; S9 six labels at 60/90/120/150/180/210; S10 tool line 17, highlight 42; S11 attach 2 at 77; S12 total lock 87; S15 flip wave 30..120; S16 checks 45/56/68/79/90; S19 second cross 28; S20 notes 39/63; S21 Approve click 14 + Approved 15, green wave 45..69; S22 confirm 102; S23 live flips 48/62/76/90; S24 tiles start 144; S25 bar fill 17; S26 toggle 105, morph 125; S27 logo dots complete by ~6.

## Sync table (cue s = local frame -> visual; offset in frames, computed from scene constants after fixes)
| cue | visual | offset |
|---|---|---|
| 1.6 / 1.9 | smash cut to black / title | 0 / 0 |
| 5.0-7.4 | typing 15..86 | 0 |
| 7.6 | Enter, bubble | 0 / +1 |
| 8.0 | tool line 105 | 0 |
| 11.0/11.7/12.4 | chip clicks | 0/0/0 |
| 15.6 | widget rise | +3 (spring onset 0) |
| 18.5 | Projection tab click | 0 |
| 21.5 | range-bar lock | 0 |
| 23.2-24.0 | card taps | 0 |
| 26.2 | sort | -1 |
| 30.6 | panel slide | +2 |
| 33.5 / 34.5 | credit chip / bars | 0 / 0 |
| 40.5 | Enter | 0 |
| 43.2 | 16 to 8 | 0 |
| 47.0 | cells overwrite | 0 |
| 51.5-56.5 | six labels | 0 |
| 59.6 / 60.4 | tool line / highlight | 0 / 0 |
| 62.6 / 64.2 / 64.55 | chip / attach x2 | 0 / 0 / +0.5 |
| 68.4 / 69.4 | total lock / pay click | 0 / 0 |
| 71.0 / 71.2 | check draw / stroke tick | 0 / mid-stroke |
| 74.5 | whip | 0 |
| 76.5 | 8th stamp | +0 |
| 78.5-81.5 | status flips | 0 |
| 84.0/84.75/85.5 | checks 1,3,5 | 0 |
| 89.9/90.6/91.3 | flash cuts | 0 |
| 92.6-94.6 | five approvals | 0 |
| 96.8/96.95 | crosses | 0 / +0.5 |
| 99.6 | send | 0 |
| 101.8/102.6 | note types | -1 / 0 |
| 105.0 | Approve + gold flash | 0 |
| 106.0-106.8 | green wave | 0 |
| 107.6 | 8 of 8 | 0 |
| 113.4 | Scheduled wave | 0 |
| 115.0 | feed/cymbal | 0 |
| 116.6-118.0 | four Live flips | 0 |
| 122.6 | counter ramp | 0 |
| 125.0 | tile | 0 |
| 131.0 | total lock | 0 |
| 132.6 / 135.6 | sentiment fill / card | -1 / 0 |
| 141.5 / 142.0 | toggle / morph | 0 / ~0 |
| 145.7 | logo hit | ~0 |

## Verified vs unverified
Verified by render: final file specs, seam 70.0, contact sheets (out/contact-v4-1..3.png, 20 frames each, 3s apart), copy/numbers in all 1s sheets (fees, totals, metrics, sentiment, table). Offsets above are derived from code constants, not measured from decoded video or audio waveforms. Not done: full-resolution stills of every dense scene, 111 (calendar-pop 111.0) has no dedicated pop (date chip is continuous), cursor click coordinates (S19 request-changes, S12) only eyeballed in thumbnails.

## Residual issues
- Caption systems differ: left margin (1-13) vs top band (14-27); left as the payment cut is the chapter break.
- Scene 23 caption "on LinkedIn. Three days, eight posts." appears clipped at the left in the earlier draft; not re-fixed.
- Scene 24 "Two weeks later." words overlap at ~120.5; caption still fades before table pan.
- Scene 8 odometer gap and Scene 6 slow-only motion, 22-24px labels: untouched.
- 115.0 first frame is near-empty (sparks only).
