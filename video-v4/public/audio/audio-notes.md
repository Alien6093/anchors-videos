# Audio notes: One Chat. Whole Campaign. (150.000 s)

Files: music.wav, mix.wav (48 kHz, stereo, 24-bit, exactly 150.000 s), sfx-cues.json (122 cues, sorted, all files exist), sfx/ (97 WAVs). Rebuild: `bash tools/audio/build.sh` from the project root.

## Key, tempo, harmony
112 BPM (bar 2.1429 s, 70 bars). A minor (Am-F-C-G, Em/Dm/E colour for tension) with voice-led pads. C major only at the payment scene (bars 33-34: Cmaj9, Fmaj7, from 70.714 to 75.0), back to A minor at 75.0. Peak/release sections lean on C (105, 115, crest resolution at 124.286 on C). End card: Am(add9) at 145.5 moving to C at 147.6, decaying to silence at 150.0. Palette: sub bass, saw bass, muted pluck, FM marimba, soft kick, brushed/closed/open hats, claps + snare, airy pad, bright stabs, glass bells, risers, impacts; one cymbal (115.0). Reverb + ping-pong delay, kick sidechain on pad/bass/pluck, tanh saturation, pluck ducked 3 dB under typing.

## Energy map (music.wav section RMS, dBFS pre-master; E-level from script)
| Time | E | RMS |
|---|---|---|
| 0-1.6 teaser (riser, sub pulse) / 1.6-1.9 cut to silence / 1.9 sub hit + pad | 2 | -25 |
| 4.3-15.5 kick+pluck, hats at 8.57, sweep 13.5-15.5 | 4 | -21 |
| 15.5-23 marimba, groove locks 18.48 | 5 | -19 |
| 23-40.5 full groove, pad opens 30.0 | 6 | -17 |
| 40.5-42.0 dropout: bass + click pulse only | 3.5 | -23.5 |
| 42.9-49.5 groove returns, filter rise, impact 43.2 | 6 | -17 |
| 49.5-66 A-C-E-G arpeggio, F at 58.93 | 5 | -19 |
| 66-70 pad rise, then hard cut; 70.0-70.7 silence (room tone) | 6 | |
| 70.714-75 C major glass/bell + warm pad | 8 | -14 |
| 75-96 groove restart; snare roll 81-82.5; stabs 89.9/90.6/91.3, approvals 92.6-94.6 | 5-6 | -19/-17 |
| 96-103.3 thin (bass, pluck) | 4 | -21 |
| 103.3-104.5 near-silence, tom/snare tail-out from 104.0, drop at 104.9 | 3 | -37 |
| 104.5-110 gold hit 105.0, no cymbal | 9 | -13.4 |
| 110-115 build (riser + snare 113.5-115) | 8 | -14 |
| 115-120 peak, cymbal swell 115.0 | 10 | -11.7 |
| 120-121.5 breath; 122.6-124.29 marimba climb; resolve 124.286; crest to 132 | 5 / 8 | -19 / -14 |
| 132-145.5 comments/audience, drums drop 140.0 | 5 | -18 / -22 |
| 145.5-150 end chord | 2 | -24 |

## Loudness
mix.wav: about -13.9 LUFS integrated, LRA 8.7 LU, true peak -1.3 dBTP, no clipped samples. music.wav: about -15.9 LUFS, peak -2.0 dBFS. Mastering: two-pass linear loudnorm + alimiter. First/last samples are zero (no boundary clicks).

## SFX
Tier 1 loud (volume 0.7-1.0), Tier 2 subtle (0.28-0.55). Tier 3 cut (word ticks, per-name/card/row/stamp ticks). Music ducked 2.5-4 dB around chimes, impacts, stabs, pings, cymbal.

## Deviations and adjustments
- Cue times use the script's exact timecodes (not re-quantized to the beat grid); music events snap to beats except scripted exact points (1.6, 1.9, 40.5, 70.0, 103.3, 104.5, 104.9, 115.0).
- Dropout 40.5-42.0 is levelled about 7 dB below the groove (E3.5 instead of E4) so it reads as a dropout.
- In mix.wav the 105-110 section (gold impact, chimes, low impact) measures slightly louder than 115-120 because of the SFX layers; music.wav alone follows the map exactly (E10 highest).
- Typing clicks are cued only in scene 2 (script lists none for scene 7).
- Both the music and the SFX cymbal at 115.0 are the only cymbal in the film. The dashboard key-change swell is baked into the music; key-change-swell.wav, stamp-thud, word-tick, riser, riser-soft, reverse-swell and other spare files are delivered but not cued (Tier 3 or covered by music).
- Room tone (about -50 dBFS) only in 70.0-70.6 and 103.35-104.5.
