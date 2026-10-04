# Social cuts: brutal music and sound audit, plus new music direction

Scope: stage1-build, stage2-brief, stage3-metrics, each in 9:16 and 4:5. The two formats of a stage carry the same audio. I decoded both and the difference is exactly 0.0, so every number below applies to both.

Honesty note: I cannot hear audio. Everything here comes from measurement (ffmpeg ebur128, numpy/scipy FFT, spectrograms, frame extraction at cue times) and from reading the cue sheets and engine code. I cannot verify what is trending on Reels or Shorts today. The trend statements are professional judgement and should be tested against the live feed before lock. Platform loudness figures (about -14 LUFS for Instagram and YouTube, -14 to -16 for LinkedIn) are the brief's assumptions and I have not re-verified them.

Scratch evidence (spectrograms, frame sheets, scripts): `/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/audit_music/` (`spec_all.png`, `wave_first3.png`, `fr_s1a..s3c.png`, `an.py`, `an2.py`, `sj.py`).

---

## 0. Headline

- The three tracks hit the numbers (-14.0 LUFS integrated, except Stage 3 true peak). The sound itself is a trimmed 150-second corporate film score, not a Reel or Short.
- 67 to 71 percent of the energy sits below 250 Hz and about 35 percent sits below 60 Hz. A phone speaker removes most of it. The hook hits are 91 to 98 percent below 150 Hz.
- Measured phone simulation (high-pass 250 Hz, low-pass 8 kHz):
  - Programme loudness falls 5.1 to 5.4 dB.
  - Stage 2's three hook hits land 7.7 to 9.2 dB below the programme level on a phone. On a phone there is no audible hook.
- Stage 3's delivered MP4 has a true peak of +0.5 dBTP. It fails the -1 dBTP spec and the master WAV hid it (-1.7 dBTP).
- The tempo (112 BPM) and key (A minor) are not the real problem. The arrangement, the sound palette and the low-end design are.
- Recommended: 120 BPM for all three stages, 24 bars = 48.0 s, beats land on integer frames (15 f). One brand motif, three grooves. Full spec in section C.

Scores (audio only, against Reels/Shorts norms):

| Video | Score | One-line verdict |
|---|---|---|
| Stage 1 Build (51.43 s) | 5 / 10 | Best-synchronised, three flash hits on the cut grid, but a corporate score with a hook that is sub-only on a phone and a 20 s mid-section that sits 5 to 7 LU under the hook. |
| Stage 2 Brief (49.3 s) | 4 / 10 | Weakest hook: the frame-0 slam and the stamp thud are inaudible on a phone. Sparse (0.65 SFX per second), a 0.5 s near-silence at -50 dB, and a rising chime ladder. |
| Stage 3 Metrics (49.3 s) | 5 / 10 | Strongest frame-0 cue (+9.4 dB over programme) but no music underneath (-35 dBFS first second). Breaches true peak and ends dead. |

---

## A. Measurements (from the delivered MP4s, 48 kHz stereo AAC, about 320 kb/s)

| Metric | Stage 1 | Stage 2 | Stage 3 |
|---|---|---|---|
| Integrated LUFS | -14.1 | -14.0 | -14.0 |
| LRA | 10.0 LU | 6.3 LU | 5.9 LU |
| True peak (MP4) | -1.8 dBTP | -1.6 dBTP | **+0.5 dBTP** |
| True peak (master WAV) | -1.7 | -1.6 | -1.7 |
| Sample peak (MP4) | -3.7 dBFS (mono sum) | -1.7 | **0.0 (8 samples at or above -0.1 dBFS, 4 at full scale)** |
| Crest factor (peak minus RMS, mono) | 11.9 dB | 13.9 dB | 15.6 dB |
| Energy below 60 Hz | 35.2 % | 35.1 % | 36.6 % |
| Energy 60 to 250 Hz | 32.4 % | 34.7 % | 34.8 % |
| Energy 250 to 800 Hz | 9.7 % | 10.8 % | 13.7 % |
| Energy 0.8 to 2 kHz | 13.9 % | 15.7 % | 8.7 % |
| Energy 2 to 5 kHz (presence) | 3.3 % | 3.0 % | 5.1 % |
| Energy above 5 kHz (air) | 4.4 % | **0.8 %** | **1.0 %** |
| Stereo: L/R correlation | 0.970 | 0.967 | 0.962 |
| Mono sum power change | -0.07 dB | -0.07 dB | -0.08 dB |
| Side level vs mid | about 18 dB lower | about 17 dB lower | about 17 dB lower |
| Phone simulation: programme level change | -5.4 dB | -5.1 dB | -5.4 dB |
| Phone simulation: LRA | 11.4 LU | 12.9 LU | 9.1 LU |
| Phone simulation: true peak | -3.2 | -2.1 | +0.1 |
| SFX transients per second (detector: +9 dB rise, above -45 dBFS) | 1.13 (58) | 0.65 (32) | 1.22 (60) |
| Seconds with no SFX transient | 20 of 51 | 25 of 49 | 26 of 49 |
| Music stem RMS | -16.6 dBFS | -16.8 | **-23.1** |
| Music stem, first second | -11 | -19 | **-35** |

Notes:
- Stage 3's master is -1.7 dBTP, yet the muxed MP4 reads +0.5 dBTP. That is about 2.2 dB of codec overshoot on a transient-heavy, sub-heavy mix with a master limiter ceiling of 0.797 linear. The delivery check was never run on the encoded file.
- Stereo and mono compatibility are fine (no phase cancellation). It is also almost mono: the sides are 17 to 18 dB under the mid and the 5 kHz+ side is under -44 dB. That is a missed sparkle opportunity, not a defect.
- The detector misses very soft ticks (gain below about 0.3), so the "seconds with no SFX" figures are indicative. They still say the picture is carrying long stretches with no audible event.

Short-term loudness (3 s window, LUFS-S) per stage, sampled every 1 s:

- Stage 1: s2 to s3 -13/-14, s4 to s14 about -18 to -20, s15 to s24 about -17, s25 to s33 -15/-16, s35 to s43 -12 to -9, s45 to s49 -13/-14, s50 and s51 -18/-19.
- Stage 2: s2 to s22 mostly -15/-16, s27 to s29 -10/-11, s36 and s37 **-20**, s40 to s47 -12 to -13, s48 and s49 -19/-20.
- Stage 3: s2 to s7 -13 to -15, s8 to s11 -17/-18, s13 to s19 **-11**, s30 to s42 -16/-17, s48 and s49 -21/-22.

The integrated target is met by averaging a loud hook and a loud last third against a quiet middle. Stage 1's first 24 s (everything after the hook) sits 3 to 6 LU below -14.

First 0.5 s content (mono mix, RMS dBFS):

| | 0 to 0.1 | 0.1 to 0.3 | 0.3 to 0.5 | 0.5 to 1.0 |
|---|---|---|---|---|
| Stage 1 | -10.0 (hit) | -15.8 | **-21.5** | -10.7 (flash B at 0.536) |
| Stage 2 | -12.2 (hit) | -18.3 | -20.7 | -21.1 (riser) |
| Stage 3 | **-5.8** (thud) | -10.5 | -23.4 | -20.0 |

All three open on an immediate transient, which is correct. Each then collapses 10 to 17 dB within 0.3 s. The music stem has no onsets between 150 Hz and 8 kHz in the first second of any stage. The hook is carried entirely by SFX.

Phone-band level of the key hits (150 ms RMS relative to the programme level, full range versus phone):

| Event | Full range | Phone (250 to 8 kHz) |
|---|---|---|
| S1 f0 hit | +5.5 | -1.2 |
| S1 flash B (0.536) | +7.6 | -0.6 |
| S1 flash C (1.071) | +6.1 | +0.7 |
| S1 title smash (1.607) | +4.2 | -0.8 |
| S1 after title (2.143) | +0.7 | **-11.1** |
| S1 end-card hit (47.143) | -8.9 | -6.7 |
| S2 f0 slam | +2.1 | **-7.9** |
| S2 stamp (1.071) | +6.0 | **-7.7** |
| S2 scene 2 sub (2.143) | +7.6 | **-9.2** |
| S2 GOLD (40.714) | +6.1 | +2.4 |
| S3 f0 thud | **+9.4** | +0.9 |
| S3 smash (1.607) | +4.1 | +0.4 |
| S3 hit-stop (5.893) | +2.2 | +6.1 |
| S3 logo (44.903) | -9.5 | -5.7 |

A hit should be at least +6 dB over the programme in the band people actually hear. Only a handful clear it on a phone.

Source-file spectral shape of the hook cues (from `sfx/*.wav`):

| Cue | Energy below 150 Hz | Energy above 2 kHz |
|---|---|---|
| hook-flash-1 | 91 % | 0 % |
| title-smash | 95 % | 1 % |
| payoff-sub | 98 % | 0 % |
| hook-slam (S2) | 93 % | 1 % |
| logo-hit | 74 % | 5 % |
| payment-chime | 0 % | 9 % (centroid 1.16 kHz, 3.4 s long) |
| confirm-chime | 0 % | 7 % (centroid 1.76 kHz, 2.0 s) |

Splice quality (music stems, joins listed in the cue sheets):
- No sample-level clicks: largest sample step at a join is 0.027 (S2 40.714, the designed gold impact), with most under 0.005. HF burst at joins is within about 2 dB of the preceding material.
- Level steps at joins are large but by design (for example S1 1.607: -12.5 dB, S2 38.571: +39.7 dB out of the near-silence).
- Chord estimation by FFT chroma is crude on this sub-heavy material. The joins stay inside the Am-F-C-G family. Stage 1's hard cut to C major at 34.286 (the pay key change) is intentional. I found no foreign-key join.
- Tempo continuity is inherent: the music is rendered on a single 112 BPM grid. The slices come from bar-multiple positions of the 150 s film score.
- The splice problem is musical, not technical. The arc is inherited from a 150-second film: long build, dip, key change, tease. It was compressed rather than written for 50 seconds.

Cue sync spot-check (24 events per stage, frames at -3 f, 0, +3 f around the cue time, `fr_*.png`):
- Stage 1: 21 of 24 land on a visible cut or pop within about ±3 f. Examples checked: flash cuts at 0.536/1.071/1.607, enter thock, chip highlights, plan whoosh, range-bar freeze, sort cut, ring and digit roll, pill start, pay hard cut to white at 34.286, payment tick at 34.65, live cut, logo dots. Findings: lock-click at 33.214 is about 0.1 to 0.3 s before the total row appears (33.3 to 33.5), and the ring lands near 33.95. The CTA ping at 48.75 is 0.1 to 0.5 s after the CTA fade-in (48.2 to 48.65). The typing clicks and live-ping 1 could not be tied to a visible event.
- Stage 2: 22 of 24 verified, including stamp at 1.071, scene cut at 2.143, GOLD "8 of 8" at 40.714 and logo dots at 45.214. Not visible: send blip at 32.679 (card static within ±100 ms) and avatar chime timing.
- Stage 3: 24 of 24 within ±3 f (f0 number freeze, counter ramps, both hit-stops, bar fill, toggles, logo). Sync is the strongest part of this deliverable.

Spectrogram reading (`spec_all.png`): all three show the same picture. A continuous bright block from 40 Hz to about 250 Hz for the entire duration (the sub/bass bed), thin tonal lines in 400 Hz to 2 kHz (plucks, bells), and almost nothing above 5 kHz except short noise swooshes at the hook and drops. Stage 1's rising swoosh around 39 to 47 s is the only broadband event past 8 kHz. The "air" of Stages 2 and 3 is essentially absent (0.8 to 1.0 percent).

---

## B. Per-video verdicts and defect tables

### Stage 1: Build (5 / 10)

Blunt verdict: it sounds like a premium fintech product film. The sync work is excellent: every flash, freeze and cut has a cue on it. As a Reel it fails at the exact moment that matters, because the hook hits live in the sub where a phone cannot play them. After the title the track settles into a 20 s sub-heavy bed that is 5 to 7 LU under the hook. The 2:1 ratio of "UI tick" cues to rhythm instruments makes it a UI demo with a pad under it.

| ID | Time (s) | Severity | What | Why / evidence | Fix |
|---|---|---|---|---|---|
| S1-01 | 0.00 to 1.61 | BLOCKER | Hook hits are sub-only | hook-flash 91 % and payoff-sub 98 % of energy below 150 Hz. Phone-band level at f0, flash B, flash C is -1.2/-0.6/+0.7 dB vs programme (full range +5.5 to +7.6). Between hits the mix drops to -21.5 dB RMS (0.3 to 0.5 s). | Re-voice each hit with a 1 to 4 kHz snap/clap/rim layer and a note from the motif. Keep sub at 60 to 120 Hz, not 40 Hz. Target phone-band hit at least +6 dB over programme. |
| S1-02 | 2.14 to 2.7 | MAJOR | Energy cliff right after the title smash | Phone-band level at 2.143 is -11.1 dB vs programme. Music stem falls from -11 dB/s (s0) to -21 dB/s from s2. SFX ticks only at gain 0.27 to 0.37. | Keep a groove running through the title. Do not drop the bed to a drone-then-pad (v4 hook "A1 drone 1.607 s"). |
| S1-03 | 2 to 24 | MAJOR | Wallpaper middle | LUFS-S -17 to -20 for 22 s while hook is -13 and last third -9 to -12. Kick pattern half-time in intro (two kicks per bar), brush hats only on beat. Typing clicks at gain 0.27 to 0.37. Longest no-SFX stretch 6 s. | New groove from bar 2 (section C). Add an event every 2 s. Keep LUFS-S in -15 to -13 after the hook. |
| S1-04 | whole | MAJOR | Low-end design built for headphones | 35.2 % below 60 Hz, 67.6 % below 250 Hz; presence 3.3 %. Phone drops programme by 5.4 dB (LRA 11.4 LU in the sim). | Bass built from saturated 110 to 220 Hz tone with sub as support. Target shares in C.7. |
| S1-05 | 1.6 to 47 | MAJOR | Style: corporate explainer | Palette: muted pluck, marimba, airy pad, glassy bells; 112 BPM minimal; arc inherited from a 150 s film (long build, dip, key change). | New style and arrangement in section C. |
| S1-06 | 27.9 to 28.8, 41.25 to 42.9, 34.55, 38.57 | MAJOR | Jingle-coded cues | 8 rising pill-flip ticks, 4 rising live-pings, payment-chime (glass, 3.4 s), confirm-chime (2.0 s). No coin or cha-ching sound found (payment-chime is a glass chime, centroid 1.16 kHz), which is correct. Rising ladders still read as game-reward or app-notification. | Fold ladders into the music arpeggio. Shorten payment-chime to 1.2 s or less. |
| S1-07 | 0.000, 0.536, 1.071, 1.607, 21.696, 39.643 | MAJOR | Stacked T1 layers on the same beat | f0, f1, f2: hook-flash plus payoff-sub (both at least 91 % below 150 Hz) plus whoosh. 1.607: whoosh, title-smash, riser, music slice. 39.643: riser, cymbal-swell, payoff-sub and the music peak. Same band stacked means limiter work, not more punch. | One sub source per beat (the kick or 808). Max two T1 layers per beat, in different bands. |
| S1-08 | 4, 11, 29, 37, 52, 60, 68 | MAJOR | Transitions without riser or whoosh | Of 13 section cuts in the beat table, 6 have a riser, whoosh or impact (b19, b44, b64, b74, b84, b88). Others are ticks at gain 0.35 or nothing. | Whoosh at every cut (0.25 s), riser into every bar-line drop. |
| S1-09 | 47.1 to 51.43 | MAJOR | Dead ending on the CTA | rms/s: s47 -15, s48 -17, s49 -22, s50 -32. CTA on screen from about 48.65 to 51.4. Whoosh crest cuts on the last sample at amplitude 0.33 (about -10 dBFS), start sample 0.00, a step of 0.17: click risk at the loop. | Keep a stripped groove under the CTA. Last beat is a pickup. Zero-cross the seam (C.8). |
| S1-10 | 2.26 to 4.73 | MINOR | 22 keyboard clicks off the beat grid | About 9 clicks per second against a 16th-hat grid; they blur the rhythm and they sit at gain 0.27 to 0.37, near inaudible on a phone. | Quantise to 16ths (picture typing is ours to re-time) or cut to 8 clicks tuned to the key. |
| S1-11 | 33.214, 48.75 | MINOR | Slightly early or late cues | lock-click 0.1 to 0.3 s before the total row; CTA ping 0.1 to 0.5 s after the fade-in. | Re-time to the frame after the re-edit. |
| S1-12 | whole | MINOR | Crest 11.9 dB, LRA 10.0 LU | Too much dynamic range for a feed. | Crest at most 10 dB, LRA at most 5 LU (C.7). |

### Stage 2: Brief (4 / 10)

Blunt verdict: the story is about approval and trust, so the track is restrained, and that restraint kills it on a phone. The hook slam and the stamp thud have almost no energy above 300 Hz, so the video opens, in effect, silent. Then 25 of 49 seconds contain no SFX transient. The track relies on a five-chime rising ladder as its reward. The one dramatic idea (near-silence before GOLD) is the right idea, executed as a 0.5 s hole at -50 dBFS that on a phone sounds like the audio dropped out.

| ID | Time (s) | Severity | What | Why / evidence | Fix |
|---|---|---|---|---|---|
| S2-01 | 0 to 2.14 | BLOCKER | No audible hook on a phone | hook-slam 93 % below 150 Hz (centroid 215 Hz). Phone-band: f0 -7.9, stamp 1.071 -7.7, scene 2 at 2.143 -9.2 dB vs programme. The hook-riser sits at -21 dB RMS (0.5 to 1.0 s). Music has no onsets in the first second. The visual hook (stamp) is at 1.07 s. | Replace with a bright slam plus tonal riser at -12 dB or louder, stamp gets a 2 to 4 kHz paper-slap and motif note. |
| S2-02 | 4.8 to 14, 29 to 34, 41 to 49 | MAJOR | Too sparse | 0.65 SFX per second (32 events); longest gap with no transient is 8 s; label pings and ticks at gain 0.30 to 0.45. | Rhythmic ear-candy every beat from the groove. Pings become music arpeggio. |
| S2-03 | 34.3 to 38.0 | MAJOR | Thin section reads as dropout | LUFS-S -16 to -20 (about 6 LU below integrated) for 3.7 s. | Keep kick plus bass pulse; thin the top, not the level. |
| S2-04 | 38.04 to 38.57 | MAJOR | Near-silence is a hole | Level -50.6 dB for 0.54 s then +39.7 dB step to -10.9. On a phone at normal volume, "audio failed". | Cap at one beat (0.5 s at 120 BPM), keep a reverse-swell tail at -30 or louder, hit exactly on the picture. |
| S2-05 | 25.98 to 28.13, 23.57 to 25.71 | MAJOR | Reward-jingle cues | 5 rising approve-chimes (T1 gain 0.55) and 4 bright-stabs (T1 gain 0.6) on text and avatar scenes. | Replace with one tonal stab on the groove plus pitched motif notes. Keep the single gold chime. |
| S2-06 | 2.4 to 42, many cuts | MAJOR | Almost no transition language | Only card-whoosh at 2.411 and next-riser at 42.857; cuts at b64, b72, scene changes have none. | Whoosh per cut; reverse crash into the drum return and into GOLD. |
| S2-07 | whole | MAJOR | Spectrum | 69.8 % below 250 Hz; presence 3.0 %; air 0.8 %; crest 13.9 dB. Phone drop 5.1 dB, phone LRA 12.9 LU. | Section C.7 balance targets. |
| S2-08 | 45.2 to 49.3 | MINOR | Fading end card | Music falls from -12 to -22 dB/s, last 50 ms at -36 dBFS; seam is a 10 dB jump back to the hit. | Hold groove under CTA; pickup in last beat. |
| S2-09 | 32.679 | MINOR | Send blip with no visible event | Card static within ±100 ms. | Re-sync to the send frame or drop. |
| S2-10 | whole | MINOR | Headroom | -1.6 dBTP: passes, but only 0.6 dB margin and no post-encode check. | Verify on the encoded file; ceiling -2.0 dBFS pre-encode. |

### Stage 3: Metrics (5 / 10)

Blunt verdict: the best hook of the three. The frame-0 thud is a purpose-built sub plus 2 to 6 kHz click that measures +9.4 dB over the programme, and every counter-ramp and hit-stop is on the frame. But underneath there is no song: the music stem is at -35 dBFS for the first second, 6.5 dB lower than Stage 1's music overall, so the whole thing sounds like a sequence of SFX. It breaches the true-peak limit on delivery and it ends dead.

| ID | Time (s) | Severity | What | Why / evidence | Fix |
|---|---|---|---|---|---|
| S3-01 | encoded file | BLOCKER | True peak +0.5 dBTP | MP4 sample peak 0.0 dBFS, 8 samples at or above -0.1 dBFS, 4 at full scale. Master WAV -1.7 dBTP, so about 2.2 dB of AAC overshoot. Also +0.1 dBTP in the phone sim. | Pre-encode ceiling -2.5 dBFS and check the encoded file; add a true-peak limiter after the final loudness trim, not before. |
| S3-02 | 0 to 11 | MAJOR | Music nearly absent | Music stem RMS by second: -35, -31, -27, -24, -27, -25, -29, -26, -26, -30, -27. Whole stem -23.1 dBFS RMS vs -16.6 (S1). No music onset in the first second. | Groove on from frame 0 (C.4). Music at about -17 LUFS-M under SFX. |
| S3-03 | 8 to 19 | MAJOR | Loudness lurch | LUFS-S -17/-18 (s8 to s11) then -11 (s13 to s19): a 6 to 7 LU jump on a dip bar. | Dip at most 2 LU and at most 1 beat. |
| S3-04 | 47.1 to 49.3 | MAJOR | Dead ending | rms/s: s46 -20, s47 -24, s48 -33; last 50 ms at -90 dBFS; the loop-inhale ends at silence. CTA visible from about 44.4. | No decay to silence; groove under the CTA, pickup in the last beat. |
| S3-05 | 5.4 to 44.5 | MAJOR | 23 "crop-hop" tile ticks | Gain 0.278 (about -11 dB, then bus 0.85); not audible on a phone; rhythmic clutter. 26 of 49 seconds have no detectable SFX transient. | Replace by 6 tuned ticks on strong beats or by 16th hat accents. |
| S3-06 | whole | MAJOR | Spectrum and crest | 71.4 % below 250 Hz, 36.6 % below 60 Hz; air 1.0 %; crest 15.6 dB (peaks 15.6 dB above the body). Phone drop -5.4 dB. | C.7. |
| S3-07 | 0.000, 5.893, 13.929, 2.143 | MINOR | Stacks | f0: counter-ramp, thud and lock-glass; 13.929: hit-stop, lock-glass, low-impact and a -6 dB music duck. Intentional drama, but three same-beat T1 layers. | At most two layers, different bands. |
| S3-08 | after 9 s | MINOR | Cuts without whoosh | Scene changes at b28 to b74 mostly carry soft ticks only. | Whoosh per cut. |
| S3-09 | 45.0 | MINOR | End-card hit weaker than the hook | Logo hit at 44.903: -9.5 dB full range, -5.7 phone vs programme. | Logo sting at least +3 dB over programme, shared across the series. |

---

## C. Cross-cutting problems

1. Corporate-explainer sonic identity. Minimal electronic, pad plus glass bells plus marimba, half-time intro kicks, a long-form arc. Nothing in the first 2 s says "scroll-stopper" and nothing is trend-aware. Safe, cheap-looking-safe, not distinctive.
2. Sub-heavy low end. 67 to 71 percent of energy below 250 Hz and about 35 percent below 60 Hz. K-weighted LUFS does not penalise sub, so the mix reaches -14.0 LUFS by pushing it, and a phone then plays it 5.1 to 5.4 dB quieter than mid-heavy competitors at the same platform loudness.
3. Hook delivered in a band the phone cannot play. See measured table above; only Stage 3 comes close, and only at frame 0.
4. No music in the hook. The music stem has no onset in the first second (S3 stem at -35 dBFS), so there is no rhythm to lock cuts to.
5. Energy shape is a film shape, not a Reel shape. Hook, slump, build, final peak, long fade. Short-form wants a peak at 0 s, a small peak every 4 to 8 s, a main drop at the reveal, and a loop pickup.
6. Low event density. About 0.65 to 1.2 SFX events per second, with half of all seconds empty. Reels/Shorts norm (professional judgement) is 2 to 4 audible events per second in the opening 3 s, then one distinct event at least every 2 s.
7. Transition language missing. Only about half of the hard cuts carry a riser, whoosh or impact; there are almost no hit-stops outside Stage 3.
8. Jingle-coded cues. Rising chime ladders (4 to 8 hits) and glass chimes up to 3.4 s. The payment sound is a glass chime and not a coin, which is right.
9. Loop handling. S1 ends mid-crest with a 0.17 sample step; S2 and S3 decay to near silence and restart with a +10 dB to +17 dB hit. All three have a 1.5 to 2.8 s dead tail while the CTA is on screen.
10. Delivery QA gap. True peak was checked on the master WAV, not on the encoded MP4 (Stage 3 shows +0.5 dBTP). LRA is 10 LU on Stage 1.
11. Beat grid is not frame-exact. 112 BPM gives 16.071 f per beat, so cue-sheet deltas of ±1 frame exist (for example live-ping at 41.250 and the tab click at 338 vs 337). A 120 BPM grid is exactly 15 f per beat.
12. One audio file for 9:16 and 4:5. Fine for Instagram and YouTube. For LinkedIn the same mix is too hot and too sub-heavy (see C.9).
13. Stereo field nearly mono. Not a defect but a lost opportunity; add 20 to 30 % width in the 2 to 10 kHz band on bells and hats while keeping everything below 150 Hz mono.

---

## C. NEW MUSIC DIRECTION

### C.1 Verdict on the current choice

112 BPM A minor minimal is not wrong. It sits inside the 110 to 128 BPM range most dance-pop and many Indian-market Reels use. What is wrong is the groove (half-time intros), the palette (pad, glass, marimba), the low-end design, the arc and the SFX language. The recommendation is to keep A minor (series continuity, hook motif in A4 to A5, a phone-friendly register) and move to 120 BPM with a new kit.

### C.2 Tempo and runtime math (bar-exact, cuts on the grid)

| BPM | 1 beat (s) | Frames per beat @30 fps | 1 bar (s) | Bar-exact runtimes in 48 to 52 s |
|---|---|---|---|---|
| 112 (current) | 0.5357 | 16.071 (not integer) | 2.1429 | 23 bars = 49.286 s; 24 bars = 51.429 s |
| **120 (recommended)** | **0.5000** | **15.000 (exact)** | **2.0000** | **24 bars = 48.0 s (1440 f); 25 bars = 50.0 s (1500 f); 26 bars = 52.0 s** |
| 124 | 0.4839 | 14.52 | 1.9355 | 25 bars = 48.39 s; 26 bars = 50.32 s |
| 128 | 0.4688 | 14.0625 | 1.875 | 26 bars = 48.75 s; 27 bars = 50.625 s; 8 bars = 15 s = 450 f exact |
| 140 | 0.4286 | 12.857 | 1.7143 | 28 bars = 48.0 s; 29 bars = 49.71 s |
| 150 | 0.4000 | 12.000 (exact) | 1.6 | 30 bars = 48.0 s; 31 bars = 49.6 s |
| 100 (half-time option) | 0.6000 | 18.000 (exact) | 2.4 | 20 bars = 48.0 s; 21 bars = 50.4 s |

Why 120:
- Beats land on whole frames, so cue-sheet rounding disappears; bars are 60 f; every 4-beat or 8-beat cut is frame-exact.
- The picture plans are written in beats. At 120 BPM the same beat plan runs 7 % faster: Stage 1's 96 beats become 48.0 s (down from 51.43 s), which also tightens pacing.
- Stage 2 and Stage 3 are 92 beats in the current plan (46.0 s at 120 BPM). To reach the 48 to 52 s window add one bar (4 beats = 2.0 s) to make 24 bars = 48.0 s. Put it where the story needs it (Stage 2: hold the "8 of 8" gold payoff; Stage 3: one more metric before the logo), not on the end card. If the edit gets a second bar, 25 bars = 50.0 s also fits.
- No-re-edit fallback: keep 112 BPM (S1 24 bars = 51.43 s, S2 and S3 23 bars = 49.29 s, all cuts already on grid) and apply sections C.3 to C.8 as written. The groove, kit, motif and mix targets work at 112; only the seconds in the tables change. The cost is the ±1 frame cue rounding and about 7 % less energy.
- 128 BPM is possible but its beat is 14.0625 f, so cues and cuts round again. 100 BPM half-time is an option for Stage 2 only if the 120 BPM half-time groove still feels too busy.

All stages: 120 BPM, A minor with C-major lift at payoffs, 24 bars = 48.0 s. Timestamps below are at 120 BPM (second = beat / 2).

### C.3 Brand system (the three stages are one series)

Series motif, "ANCHOR": ascending A minor arpeggio that lands on the octave.
- Full form (1.0 s): A4, C5, E5 on straight 8ths (0, 0.25, 0.5 s), passing D5 at 0.75 s, A5 landing on 1.0 s and ringing 1.0 s.
- Hit form for the hook: one note per cut (A4 on cut 1, C5 on cut 2, E5 on cut 3, A5 on cut 4, at 0, 0.5, 1.0, 1.5 s). The flash hits become the melody.
- Register A4 to A5 (440 to 880 Hz), HP 250 Hz on the lead, so it plays on any speaker.
- Harmony loop: Am9 | Fmaj7 | Cmaj7(add9) | G6, one bar each, repeated (every 2 bars on slower sections). Payoff lift: C major (the E5 of the motif is the common tone).
- Timbre per stage: S1 bright muted pluck plus glass bell doubling; S2 kalimba/marimba plus log drum answer; S3 detuned saw lead with bell shimmer.
- Series logo sting (same in all three, 1.5 s): motif A4-C5-E5-A5 on a bell, kick plus snap on the first note, glass tail with no sub. Shared kit: same kick, same snap, same hat, same riser noise colour.
- Why this works: the hook is recognisable in 1 s by contour (up, up, up, step back, leap to octave) and it is musically a sing-along you can whistle. It is not a copy of any existing track.

### C.4 Stage 1: "Build" (genre: tech-house / electro-pop pulse)

Reference sound (descriptive): four-on-the-floor club-pop with a bouncy plucked bass, crisp clap and offbeat open hat, bright arpeggiated pluck. Think of the energy of a product-launch Reel with a dance track under it, minimal vocal-free.

- BPM 120, A minor, 24 bars = 48.0 s (1440 f).
- Instrumentation: kick (tight, with 2 to 4 kHz click), clap plus snare layered with a snap, closed 16th hats, offbeat open hat, shaker 8ths, rim, saturated bass pluck (A2 to A3), sub sine (A1, support only), plucked arp lead (motif), glass bell, detuned-saw chord stab (HP 300 Hz), noise risers, reverse crash, impact.
- Drum pattern (16 steps per bar, x = hit, . = rest):
  - Kick: `x...x...x...x...` plus ghost at step 15 at 40 % on fill bars.
  - Clap and snap: `....x.......x...`
  - Closed hat: all 16 steps, accents on 3, 7, 11, 15 (velocity 1.0 / 0.55 / 0.35 pattern from the engine hat voice).
  - Open hat: `..x...x...x...x.`
  - Rim: `.........x......`
  - Bass pluck (Am bar): `x..x..x...x..x..` on A2, with octave jump on step 7, moving to the chord root per bar.
- Bass design: layer A pure sine A1 to A2 (sub, at most 12 % of total energy); layer B saw plus square through a 600 Hz low-pass with envelope and `sat` drive about 3 so that most of the bass energy sits at 110 to 330 Hz (this is what plays on a phone); high-pass 35 Hz; mono below 150 Hz; sidechain 6 dB / 110 ms from the kick.
- Structure and energy (second: level 1 to 10; beats in brackets):

| Seconds (beats) | Section | Content | Energy |
|---|---|---|---|
| 0.0 to 2.0 (b0 to 4) | HOOK | Flash hits at 0.0 / 0.5 / 1.0 with motif notes A4/C5/E5; title smash at 1.5 with A5, crash and impact; kick plus snap on every hit; 16th hat from 0.0; reverse-riser pickup inside the previous loop's last beat | 9 9 |
| 2.0 to 6.0 (b4 to 12) | Groove 1 ("prompt") | Four-on-floor kick, offbeat hat, bass; motif every 2 bars at -6 dB; typed clicks quantised to 16ths | 6 6 7 7 |
| 6.0 to 10.0 (b12 to 20) | Groove 2 ("choices", plan) | Pluck arp enters; each chip click is a pitched motif note; filter opens over 4 bars | 7 7 7 8 |
| 10.0 to 14.0 (b20 to 28) | Plan build | Chord stabs on offbeats; hit-stop tape on the range-bar freeze (about 13.3 s) | 7 7 7 7 |
| 14.0 to 18.0 (b28 to 36) | Creators cascade | Card taps as 8th-note plucks panned; rim fill each 4 beats | 7 8 8 8 |
| 18.0 to 22.0 (b36 to 44) | Riser to reveal | 4-beat noise riser plus snare roll from b40; kick drops out for the last beat; 1/16 micro-gap at 21.9 | 8 8 9 9 |
| 22.0 to 26.0 (b44 to 52) | DROP: "16 to 8" | Full groove, impact plus crash on 22.0, bass drop, motif at full level | 10 10 10 10 |
| 26.0 to 30.0 (b52 to 60) | Briefs | Groove stays, arp fills the pill ticks; hats lead | 8 8 8 8 |
| 30.0 to 32.0 (b60 to 64) | Quote / breakdown | Filter closes, kick halves, riser | 6 5 |
| 32.0 to 34.0 (b64 to 68) | PAY lift | 0.25 s drop-out before the hard cut, then C-major groove restart, glass chime at 1.2 s or shorter | 9 8 |
| 34.0 to 37.0 (b68 to 74) | Dates | Groove, chord stab, calendar ticks pitched | 7 7 7 |
| 37.0 to 42.0 (b74 to 84) | LIVE peak | Riser plus reverse crash into the live cut; four live-pings play A4/C5/E5/A5 on the beat; feed pops as hat accents | 10 10 9 9 9 |
| 42.0 to 44.0 (b84 to 88) | Tease | Low-pass breath, filter lift to the logo | 5 5 |
| 44.0 to 48.0 (b88 to 96) | End card | Logo sting at 44.0 (b88); stripped groove (kick, bass, motif) under the CTA; last beat is the loop pickup | 8 6 5 7 |

- Energy per second (0 to 47): `9 9 | 6 6 7 7 | 7 7 7 8 | 7 7 7 7 | 7 8 8 8 | 8 8 9 9 | 10 10 10 10 | 8 8 8 8 | 6 5 | 9 8 | 7 7 7 | 10 10 9 9 9 | 5 5 | 8 6 5 7`

### C.5 Stage 2: "Brief" (genre: half-time trap-pop with a log-drum accent)

Reference sound (descriptive): confident, slightly darker groove where the beat sits in half-time (kick on 1, clap on 3) with a saturated 808 and a tuned log-drum answer; tension then a bright release at the gold hit. Not a reproduction of any specific track.

- BPM 120 with half-time drums (feels like 60), A minor, 24 bars = 48.0 s. If the edit keeps 23 bars, the beat list below stays valid and the end card shortens by one bar.
- Instrumentation: 808 (A1 to A2 with `sat`, 2nd and 3rd harmonics, glide), log drum (sine with pitch glide, 90 to 250 Hz, 0.25 s decay, 2nd harmonic at -6 dB), kick with click, clap plus rim, hats 8ths with trap rolls at bar ends, kalimba/marimba motif, bell, detuned-saw stab for GOLD, noise risers, reverse crash, impact.
- Drum pattern:
  - Kick: `x.....x...x.....`
  - Clap, rim: `........x.......` plus rim `..........x.....` (ghost)
  - Hat: 8th notes `x.x.x.x.x.x.x.x.` with a 1/16 roll on steps 15 and 16 on every 4th bar
  - 808: follows the kick, glide on step 7 up a fourth
  - Log drum: `...x..x....x..x.` on A2, C3, E3, G3
- Hook: slam at 0.0 with snap and motif note A4; stamp at 1.0 with a 2 to 4 kHz paper slap, C5 and a low hit; bright tonal riser from 0 to 1.0 at -12 dB or louder; 16th hat roll from 0.0.
- Structure and energy:

| Seconds | Section | Content | Energy |
|---|---|---|---|
| 0 to 2 | HOOK | See above; scene 2 sub at 2.0 | 9 9 |
| 2 to 4 | "8 creators" | Kick plus 808, hats | 6 6 |
| 4 to 8 | Briefs | Log-drum pattern, motif every 2 bars | 6 6 6 6 |
| 8 to 12 | Own angle | Kalimba arp, 808 moves with chords | 7 7 7 7 |
| 12 to 16 | Format and send | Groove, attach clips as rim hits | 7 7 7 7 |
| 16 to 18 | Flip sweep | Rising noise and filter | 7 8 |
| 18 to 22 | Review groove | Check ticks as hat accents (not separate pings) | 8 8 8 8 |
| 22 to 24 | Same standard | Four stabs on beats (C major, one tonal stab each, no chime ladder) | 9 9 |
| 24 to 27 | Approve is final | Five approvals as five motif-note plucks (A4 to E5) inside the music; cross thuds as low log-drum hits | 8 8 8 |
| 27 to 29 | Cross 1/2 | Groove ducks 2 dB | 7 7 |
| 29 to 35 | Say exactly why | Thin: kick, 808, pluck; keep LUFS-S at -16 or louder | 6 6 6 5 5 5 |
| 35.0 to 36.0 | Pre-gold hush | 1 beat (0.5 s) only: music tails to a reverse swell at -30 or louder, no true silence | 3 |
| 36 to 38 | Build | Drums return on the bar line; chord swell; snare roll over the last beat | 8 8 |
| 38.0 | GOLD | Impact plus C-major stab plus the single big chime; no cymbal | 10 |
| 38 to 42 | Hold "8 of 8" (+1 bar from the edit) | Full groove at peak, motif at full level | 10 10 9 9 |
| 42 to 44 | "Next" | Pad rise and snare build, 0.25 s gap before the logo | 6 6 |
| 44 to 48 | End card | Logo sting at 44.0, stripped groove under the CTA, loop pickup | 8 6 5 7 |

- Energy per second (0 to 47): `9 9 | 6 6 | 6 6 6 6 | 7 7 7 7 | 7 7 7 7 | 7 8 | 8 8 8 8 | 9 9 | 8 8 8 | 7 7 | 6 6 6 5 5 5 | 3 | 8 8 | 10 10 9 9 | 6 6 | 8 6 5 7`

### C.6 Stage 3: "Metrics" (genre: uptempo electro-pop with euphoric lift)

Reference sound (descriptive): bright, open and rising: four-on-the-floor kick with offbeat bass, rolling 16th hats, a detuned-saw chord swell on each milestone, counter-driven arpeggio ramps pitched to A minor. The energy of a "results" reveal.

- BPM 120, A minor, C-major lift on the big numbers, 24 bars = 48.0 s.
- Instrumentation: kick with click, clap, rolling 16th hats and open-hat offbeats, offbeat bass (steps 3, 7, 11, 15), detuned-saw lead stab (HP 300 Hz), bell, tuned counter-ramp arp (ramps become A minor scale runs), noise risers, reverse crash, impact, glass tail.
- Drum pattern:
  - Kick: `x...x...x...x...`
  - Clap: `....x.......x...`
  - Hats: 16ths with accents on offbeats; open hat `..x...x...x...x.`
  - Bass: `..x...x...x...x.` (offbeat), sidechained 7 dB / 100 ms
- Hook: frame-0 thud (keep s3-f0-thud, 2 to 6 kHz click already present) plus the motif note A4, plus a 16th hat rolling from 0.0; counter-ramp 0 to 1.0 s as a rising A minor run; smash at 1.5 with A5 and crash; music audible from frame 0 (stem first-second at least -20 dBFS RMS in the final mix).
- Structure and energy:

| Seconds | Section | Content | Energy |
|---|---|---|---|
| 0 to 2 | HOOK (number first) | Thud, motif hits, counter-ramp, smash at 1.5 | 10 9 |
| 2 to 4 | "Every number. One chat." | Groove on, bass drop at 2.0 | 8 8 |
| 4 to 6 | Ramp B1 | Counter-ramp 0 to 1.85 M as an arp, lock at 5.5 with hit-stop | 8 8 |
| 6 to 8 | Riser bar | One-bar riser into the cut at 8.0 | 8 8 |
| 8 to 10 | Dip (1 beat only) | 1-beat filter dip at 8.0, then back | 7 8 |
| 10 to 13 | Crest | Full groove; final-count ramp at 11.0 | 9 9 9 |
| 13 to 17 | Final count lock | 2,80,000 lock at 13.0: hit-stop, impact, C-major stab, bell | 10 10 9 9 |
| 17 to 26 | Beat the plan / Zoom in | Groove, tuned ticks only on strong beats (6 total), pitched label pings | 8 8 8 8 8 8 8 8 8 |
| 26 to 36 | Praise and pushback | Slightly thinner top, bass keeps pulse | 7 7 7 7 7 7 7 7 7 7 |
| 36 to 40 | Right people, right roles | Toggles as pitched plucks; riser from 38 | 8 8 8 8 |
| 40 to 42 | Build to logo | Filter lift, snare roll | 9 9 |
| 42 to 44 | Logo | Sting at 42.0 (b84), then groove | 10 7 |
| 44 to 48 | End card | Stripped groove, loop pickup in the last beat | 6 6 6 7 |

- Energy per second (0 to 47): `10 9 | 8 8 | 8 8 | 8 8 | 7 8 | 9 9 9 | 10 10 9 9 | 8 8 8 8 8 | 8 8 8 8 | 7 7 7 7 7 | 7 7 7 7 7 | 8 8 8 8 | 9 9 | 10 7 | 6 6 6 7`
  (The 48 values match the section table; section boundaries move with the beat plan once Stage 3 is re-timed to 24 bars.)

### C.7 Mix and master targets (all stages)

| Metric | Target | Current |
|---|---|---|
| Integrated | -14.0 LUFS (±0.3) | -14.0 (pass) |
| True peak | at most -1.5 dBTP on the encoded AAC file; pre-encode ceiling -2.5 dBFS | S3 +0.5 dBTP |
| Crest (peak minus RMS) | 8 to 10 dB | 11.9 / 13.9 / 15.6 |
| LRA | at most 5 LU | 10.0 / 6.3 / 5.9 |
| LUFS-S after the first second | -16 to -11, never under -16 | S1 -20 for 10 s, S2 -20, S3 -18 |
| Hook (0 to 1.5 s) momentary | -12 to -10 LUFS-M | n/a |
| Energy below 60 Hz | at most 12 % | 35 to 37 % |
| Energy 60 to 250 Hz | at most 28 % | 32 to 35 % |
| Energy 250 to 800 Hz | at least 18 % | 10 to 14 % |
| Energy 0.8 to 2 kHz | at least 18 % | 9 to 16 % |
| Energy 2 to 5 kHz | at least 12 % | 3 to 5 % |
| Energy above 5 kHz | at least 8 % | 0.8 to 4.4 % |
| Phone simulation (HP 250 Hz, LP 8 kHz) | programme drop at most 2.5 dB, i.e. at least -16.5 LUFS when full range is -14.0 | -5.1 to -5.4 dB |
| Hook hits, phone band | at least +6 dB over programme | -9 to +1 dB (S2 worst) |
| Stereo | mono below 150 Hz, widen 2 to 10 kHz by 20 to 30 %; mono sum loss at most 1 dB | 0.07 dB (narrow) |

SFX sit in the mix:
- SFX bus gets a 120 Hz high-pass on all T2 cues. No SFX carries sub; sub comes only from the kick and 808 on the grid. This also removes the stacked-sub problem in S1-07.
- Sidechain: music and pad duck 6 dB / 110 ms from the kick; from T1 SFX duck 3 to 4 dB, attack 20 ms, hold 120 ms, release 250 ms (the current `mix.mjs` already ducks 2.5 to 4 dB on a regex; keep, add the kick duck on every stem, not only the pad).
- Maximum two T1 layers per beat and never two sub-generating layers.
- Pre-hit gap: 30 to 60 ms of music dropout before every drop and hit-stop (1/16 note gap before the S1 b44, b64, b74 drops). A gap before a hit makes it louder than any gain increase.
- Whoosh (0.25 s) on every cut; 1-bar riser plus reverse crash into every bar-line drop; hit-stop (tape click plus 4 to 6 f freeze) on every freeze frame; SFX pitched to the A minor / C major key.
- Ear-candy cadence: after the hook, a distinct event (fill, riser, hit-stop, motif note) at least every 2 s; no 4 s stretch without one.
- Do not use coin, cha-ching, cash-register or "success jingle" sounds. The glass chime for payment is fine, at most 1.2 s.

### C.8 Loop handling

- Loop pickup: the last beat (0.5 s) of the music is a rising pickup (reverse crash plus filtered noise plus a short sub-free whoosh) that peaks in the final 50 ms and lands directly on the frame-0 hit. Do not decay to silence.
- Seam cleanliness: the last sample is at a zero crossing and the first transient starts within 2 ms (do not start at sample 0 so that AAC priming cannot clip the attack). Check with a loop test on the encoded file: current step values are 0.17 (S1), 0.015 (S2), 0.025 (S3).
- End-card audio: stripped groove under the CTA (energy 5 to 6), logo sting at the start of the card, no fade to silence. Cap the end card at 4 s (2 bars) at most.
- Hard stop is not recommended for these loops; the pickup covers the seam.

### C.9 LinkedIn variant

Recommendation: yes, a separate "PRO" mix, rendered from the same stems, same grid, same picture. It costs one extra mix pass.

Why: LinkedIn is watched muted first, and sound-on viewers are often at a desk on a laptop or office speakers, which roll off the low end earlier than phones and are less tolerant of hits. The brand motif should still be present.

PRO mix differences:
- Target -15 LUFS integrated (inside the brief's -14 to -16 range), true peak at most -1.5 dBTP, LRA at most 4 LU, crest 10 to 12 dB.
- Energy cap 7 (drop levels: hits 3 dB lower, no 10 / 9 peaks).
- Remove the pre-drop micro-gaps longer than 30 ms; no cymbal swells; whoosh and riser levels -4 dB; 808 sustain trimmed to 0.5 s.
- Keep kick, bass, motif and one tonal stab per reveal; drop trap hats and rolls; keep the logo sting.
- Same picture timing, so the same audio file length and sync.
- Instagram and YouTube keep the full mix. If only one mix is shipped, ship the full mix and lower it 1 LU for LinkedIn; the calmer version is the better professional choice.

### C.10 Cue sheet handling for the sound designer

General rule: every cue is re-voiced or re-timed to the 120 BPM grid (frame = beat × 15). Remove sub from every SFX; sub comes from the music.

Stage 1 (113 rows):
- Keep and re-voice (T1): hook-flash-1/2/3 (add 1 to 4 kHz snap, motif note per hit), title-smash (add crash, at least 25 % energy above 2 kHz), digit-roll-impact at b44 (the drop anchor), enter-thock x2 (pitch to A), lock-glass (range-bar freeze), lock-click, pay-click, logo-hit (to the series sting), loop-whoosh (zero-cross and re-time as the pickup).
- Change: payment-chime (shorten to at most 1.2 s, tune to C major), confirm-chime (at most 1.0 s), live-ping 1 to 4 (play A4/C5/E5/A5), cymbal-swell (shorten, pair with the reverse crash), tease-lift and tease-breath (keep, +3 dB).
- Drop: payoff-sub x7 (replaced by the kick), 22 keyboard clicks (replace with at most 8 tuned clicks quantised to 16ths), 8 pill-flip ticks (arp from the music), 6 label pings (arp), soft-tick x7 (keep only as pitched accents on the strongest cuts).
- Add: whoosh at the 7 section cuts that have none (b4, b11, b29, b37, b52, b60, b68), 1-bar riser plus reverse crash into b44, 1/16 gaps before b44, b64, b74, hit-stop on the range-bar freeze, a pickup into the end card.

Stage 2 (68 rows):
- Keep and re-voice: hook-slam (add snap and mid body), stamp-thud (add paper-slap), gold-impact (keep as the peak), approve-chime-big (the single reward chime), avatar-chime, cross-thud x2 (turn into low log-drum hits), send-blip, next-riser, logo-hit-short (to the series sting).
- Change: hook-riser (raise to -12 dB, add a pitch sweep), near-silence-air (cut to 1 beat, no true silence), hook-drop-sub (replace with the kick and 808).
- Drop: approve-chime-1 to 5 (rising ladder; replace with five motif plucks in the music), bright-stab-1 to 4 (one tonal stab per beat in the music), label-ping x6 (arp), check-tick x5 (fold into hats), loop-tail (replaced by the pickup).
- Add: whoosh at every scene cut, reverse crash into the drum return and GOLD, hit-stop on the stamp, 0.25 s gap before the logo.

Stage 3 (66 rows):
- Keep: s3-f0-thud (best cue in the set), counter-ramp-B0-v2, counter-ramp-B1, counter-ramp-final, s3-hitstop-tape-5f and 6f, lock-glass x3, s3-riser-bar, s3-loop-inhale (pickup), logo-hit-short (to the sting).
- Change: low-impact (move energy up to 120 to 300 Hz), smash-hit and title-thump (add 2 to 4 kHz), glass-tail (shorten to at most 2 s), pad-swell (+3 dB).
- Drop: 23 tile-tick "crop-hop" cues down to 6 on strong beats, mid-tick x2 (fold into hats), count-up-soft (arp).
- Add: music from frame 0, whoosh on every cut, reverse crash before b43 and b76, fix true peak (post-encode check).

### C.11 Delivery checklist (all six files)

- Render the 24-bar music, mix SFX, master to -14.0 LUFS, mux, then measure the MP4 (not the WAV): integrated, true peak, LRA, phone-simulation level.
- Acceptance: integrated -14.0 ±0.3; true peak at most -1.5 dBTP; phone drop at most 2.5 dB; crest at most 10 dB; LUFS-S never under -16 after 1 s; hook hits at least +6 dB over programme in the phone band; 24 cue-sync spot-checks per stage within ±1 f after re-timing.
- Engine work for the composer (`audio-common/voices.mjs` currently has kick, subNote, bassSaw, pluck, marimba, pad, stab, hat, brush, clap, snare, crash, noiseSweep, impact, bell, rim, tom, cymbalSwell): add a log-drum voice, a detuned-saw lead (HP 300 Hz), a saturated 808 with glide, a layered snap, a reverse-swell helper, and apply the kick sidechain to every music stem, not just the pad (`engine.mjs` duck currently applies to the pad).

---

## D. The 8 worst audio problems (ranked)

1. Hook delivered below 150 Hz (S1, S2): hook cues are 91 to 98 % sub energy; S2 hook hits land 7.7 to 9.2 dB under programme on a phone; S1 hits sit at -1.2 to +0.7 dB. On a phone the opening is soft.
2. Stage 3 true peak +0.5 dBTP on the delivered MP4 (sample peak 0.0, 4 full-scale samples) against a -1 dBTP spec; the master WAV hid it at -1.7.
3. Sub-heavy spectrum: 67 to 71 % below 250 Hz, 35 to 37 % below 60 Hz, presence 3 to 5 %, air 0.8 to 4.4 %. Phone programme level falls 5.1 to 5.4 dB.
4. Music missing from the hook: no music onset in the first second of any stage; S3's music stem is at -35 dBFS then and -23.1 dBFS overall.
5. Energy shape of a film, not a Reel: S1 sits at LUFS-S -17 to -20 for 20 s after the hook; S3 swings from -18 to -11; S2 drops to -20 in the thin section; LRA 10.0 / 6.3 / 5.9.
6. Dead endings and loop seams: S1 cuts a whoosh crest with a 0.17 sample step; S2 and S3 decay to -33 / -90 dBFS while the CTA is on screen for 2.8 to 4 s.
7. Sparse and unmusical SFX: 0.65 to 1.22 events per second, 20 to 26 of about 50 seconds with none; 23 near-inaudible tile ticks in S3; 22 off-grid typing clicks in S1.
8. Jingle-coded cues and weak transitions: 8-tick, 4-ping and 5-chime rising ladders; only 6 of 13 S1 cuts carry a whoosh, riser or impact; S2's 0.5 s hole at -50 dBFS reads as an audio dropout on a phone.

## E. Headline of the new direction

| Stage | BPM and bars | Style | Key |
|---|---|---|---|
| 1 Build | 120 BPM, 24 bars = 48.0 s (1440 f) | Tech-house / electro-pop pulse, plucked bass, offbeat hat, bright pluck arp | A minor, C-major lift at "PAID" |
| 2 Brief | 120 BPM (half-time drums), 24 bars = 48.0 s | Half-time trap-pop with saturated 808, log-drum answer, hush then gold release | A minor, C-major gold hit |
| 3 Metrics | 120 BPM, 24 bars = 48.0 s | Uptempo electro-pop, offbeat bass, rolling hats, counter-ramp arps | A minor, C-major lift on the big number |

One series: the ANCHOR motif (A4, C5, E5, passing D5, A5 octave) in every hook and every logo sting, one shared kit, one loop-pickup technique. 112 BPM remains a valid no-re-edit fallback; the groove, kit, motif and mix targets above apply unchanged.
