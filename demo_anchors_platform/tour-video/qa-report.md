# QA report, round 3: anchors-platform-tour-final.mp4 (render of 00:08)

## VERDICT: PASS (no blockers, no majors; 4 minor items)

The round-2 blocker is fixed. Sound effects are now present over the whole 0–120 s. The audio track is sample-aligned with `audio/mix.wav` (0-sample offset). All round-2 minors except one are fixed. The issues left are cosmetic and do not block release.

Method:
- Scanned the full 120 s at 4 fps: 30 contact sheets, every one viewed.
- Compared 11 shots side by side with their mapped source frames.
- Ran ffprobe, ebur128 (true peak) and astats, freezedetect, blackdetect and silencedetect.
- Fitted the final audio against the music and SFX stems over all of 0–120 s.
- Checked the SFX stem around every one of the 99 listed cues.
- Measured A/V alignment by cross-correlating the final audio with `mix.wav`.

Working files are in `_work/qa3/`. I changed no project files.

---

## Checklist

### 1. Specs: PASS
- Duration 120.000 s (video 3600 frames; audio 120.0 s, start 0).
- H.264 High, 1920x1080, 30 fps, yuv420p.
- 42.4 MB.
- AAC LC at 48 kHz, stereo.

### 2. Stage coverage: PASS
| stage | time |
|---|---|
| Setup | 5.0–15.1 |
| Criteria | 15.1–23.3 |
| Match preview | 23.3–27.5 (also 0–1) |
| Profiles and analytics | 27.5–35.0 and 37.2–39.2 |
| Selecting influencers | 35.0–41.0 |
| Product details | 41.0–46.4 |
| AI briefs | 46.4–59.4 |
| Review and checkout | 59.4–66.4 |
| Activation | 66.4–70.4 |
| Draft review and approval | 70.4–82.4 |
| Live dates (both dates readable) | 82.4–88.4 |
| Live performance | 88.4–95.2 |
| AI audience / sentiment / queries / ranking and export / per-creator / keywords / ratings | 95.2 / 99.9 / 103.9 / 106.8 / 110.1 / 111.7 / 113.2 |
| End card | 115.5–120 |

### 3. Dead time: PASS
- freezedetect (d=0.5 s) found no frozen holds; the end card has a push-in.
- No loading screens. The only one is a red 4-dot loader for about 0.15 s at 114.5 (minor, issue m1).
- I found no error states and no unreadably fast passages.

### 4. Provenance: PASS
I checked 11 shots at their mapped source times: s02 (1.5), s07 (8.15), s16 (25.4), s26 (43.92), s33 (55.2, the freeze), s41 (69.6), s50 (87.68), s58 (101.28), s64 (109.65), s68 (114.04) and s69 (114.735). Each is the same real UI at the same moment, zoomed. The round-2 checks of s08, s09, s14, s18, s24, s29, s35, s42, s43 and s44 still apply because those shots are unchanged. I found no drawn or mocked-up UI.

### 5. Audio: PASS
- **Loudness:** integrated -14.1 LUFS, LRA 7.2 LU, true peak **-1.2 dBTP** (target <= -1), sample peak -1.26 dBFS, no clipping.
- **SFX present everywhere.** The final audio fits `music·1.106 + sfx·k`:
  | span (s) | k (SFX share) | residual |
  |---|---|---|
  | 0–30 | 1.071 | -41.6 dB |
  | 30–59.5 | 1.088 | -44.2 dB |
  | 59.5–90 | 1.094 | -41.8 dB |
  | 90–115.5 | 1.094 | -39.7 dB |
  | 115.5–120 | 1.102 | -41.1 dB |

  No span is missing SFX. The stems contain no NaN.
- **Every cue sounds.** None of the 99 cues in `build/cues.json` falls on a silent stretch of the SFX stem (window -20 to +120 ms around each heard time, threshold -60 dB). Spot levels in the final mix:
  - 66.4 activation chime and impact: stem -10.5 dB, final -8.8 dB
  - 77.4 "Draft approved" chime: stem -15.8 dB, final -11.0 dB
  - 115.5 end sting: stem -11.3 dB, final -9.1 dB
  - 82.55 and 104.05 pops (previously NaN): about -27 dB in the stem
- **A/V offset: 0 samples.** The final audio cross-correlates with `mix.wav` at lag 0 (correlation 0.9995), and both streams start at 0. Sound therefore lands exactly on the timeline cue times, which the timeline aligns to the visual events (cuts, callouts, the activation zoom at 66.4, the approval modal at 77.4). Round 2's +43 ms delay is fixed.
- **Ending:** the fade is complete by 119.53 s and the end is clean. The pipeline now reports "RESULT: ALL CHECKS PASSED" and exits non-zero on failure.

### 6. Text and highlights: PASS (minor notes)
- Highlights track their targets throughout. The round-2 issues are fixed:
  - s07: highlight ends before the scroll
  - s16: callout sits above the modal
  - s26: no empty box
  - s33: callout below the highlight
  - s49: stray click ring removed
  - s50: tighter zoom, and both dates plus the "Live Date for Mira set" toast are visible
- Hook phrases appear whole. Callouts are legible, spelled correctly, and do not overlap the progress bar or the chapter chip.
- Remaining minor notes: m2 and m3 in the table.

### 7. Visual quality: PASS
- The only black frames are the intended 2-frame fade-in.
- No glitches. The progress bar is opaque.
- The end card is clean: real logo, tagline, and the step line on a blurred real background with a push-in. It fades out at 119.5.

### 8. Overall
A new brand will clearly follow the flow: create, set criteria, see 65 matches, pick creators, add the product, get AI briefs, pay and activate, approve drafts, schedule, then live stats and the AI report. The sound now supports each payoff. Ready to ship.

---

## Issues

| # | severity | time | issue | suggested fix (shot ids) |
|---|---|---|---|---|
| m1 | minor | 114.45–114.6 | The red 4-dot loader shows for about 0.15 s at the start of s69 (src about 180.4–180.55). | Move s69 srcIn to about 180.6, or end s68 on a held frame. |
| m2 | minor | 66.8–70.4 | In s41 the "Campaign activated!" callout now sits on the tracker row and hides the "Campaign Accepted by / Drafts Submitted by Influencers" labels. | Move the s41 callout below the tracker (between it and "Go to Dashboard"), or above the success card. |
| m3 | minor | 69.0–70.4 | The source's "Campaign activated successfully" toast is cut off at the bottom-right edge in s41. | Pan the s41 end focus slightly right and down, or crop the toast out entirely. |
| m4 | minor (info) | whole video | True peak after the AAC encode is -1.2 dBTP, compared with -1.3 in `mix.wav`. This is within spec, with only 0.2 dB of margin. | Optional: master to a -1.5 dBTP ceiling to allow for codec overshoot. |

---
*Round 1: FAIL. About 12 highlights did not track the scrolling UI, the hook phrases were too short, and the s50 payoff was missing.*
*Round 2: FAIL (blocker). A NaN pan in `sfx.mjs` from keyframed `callTarget` silenced every SFX after 59.55 s, and the audio sat 43 ms late.*

---
_Director's note (after round 3): the round-3 minors m1 (s69 loader, srcIn 180.6) and m2 (s41 callout moved to the bottom band) were fixed in the final render and checked on stills. m3 (toast cut at the edge) and m4 (true-peak margin) are left as is. No timing or audio changed._
