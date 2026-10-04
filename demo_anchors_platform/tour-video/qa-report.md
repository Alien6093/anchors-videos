# QA report, round 2: anchors-platform-tour-final.mp4 (re-render of 23:48)

## VERDICT: FAIL (1 blocker: there are no sound effects after 59.55 s)

The picture now passes. Every round-1 picture issue is fixed and I found nothing new beyond minor polish.

The audio fails. The delivered video plays **music only from 59.55 s to the end**. All 42 sound-effect cues after that point are missing, including:

- the "Campaign activated!" success chime and impact (66.4)
- the "Draft approved" success chime (77.4)
- every click and callout pop in steps 6–10
- the whooshes at the act and chapter changes
- the end-card sting (115.5)

The audio pipeline's own QA reported "every SFX cue is heard within 1 frame", which hid the problem. The cause is a one-line bug, explained below. Rebuilding the audio and re-muxing should fix it.

Method:
- Scanned the full 120 s at 4 fps: 30 contact sheets, every one viewed.
- Took full-resolution frames at about 15 suspect moments.
- Compared 12 of the changed shots side by side with their mapped source frames.
- Ran ffprobe, ebur128 and astats, freezedetect, blackdetect and silencedetect.
- Fitted the final audio against the music and SFX stems (least squares, after aligning the delay).
- Re-ran `audio/src/sfx.mjs` from a scratch copy to find the root cause.

Working files are in `_work/qa2/`. I changed no project files.

---

## Checklist

### 1. Specs: PASS
- 120.00 s video (3600 frames) and 120.04 s audio.
- H.264 High, 1920x1080, 30 fps, yuv420p.
- 42.2 MB.
- AAC LC at 48 kHz, stereo.

### 2. Stage coverage: PASS
| stage | time |
|---|---|
| Setup: name, goal, platform, budget, confirm | 5.0–15.1 |
| Criteria: topics, followers, roles, audience | 15.1–23.3 |
| Match preview | 23.3–27.5 (also 0–1) |
| Profiles and analytics | 27.5–35.0; past collabs 37.2–39.2 |
| Selecting influencers | 35.0–37.2; shortlist 39.2–41.0 |
| Product details | 41.0–46.4 |
| AI briefs | 46.4–59.4 |
| Review and checkout | 59.4–66.4 |
| Activation | 66.4–70.4 |
| Draft review and approval | 70.4–82.4 |
| Live dates (both dates now visible, Oct 4 and Oct 5) | 82.4–88.4 |
| Live performance | 88.4–95.2 |
| AI audience / sentiment / queries / ranking and export / per-creator / keywords / ratings | 95.2 / 99.9 / 103.9 / 106.8 / 110.1 / 111.7 / 113.2 |
| End card | 115.5–120 |

### 3. Dead time: PASS
- freezedetect (d=0.5 s) finds no frozen holds anywhere. The end card now has a push-in.
- No loading screens. A red 4-dot loader shows for about 0.2 s at 114.4 (minor).
- The error states from round 1 are gone.
- s14 now runs at 2.88x and stays readable.

### 4. Provenance: PASS
I compared these changed shots against the source at `srcIn + (t - tIn) * speed`: s08 (9.9), s09 (12.55), s14 (22.91), s18 (30.7), s24 (40.1), s29 (47.9), s35 (59.04), s41 (68.8), s42 (71.6), s43 (73.4), s44 (75.68) and s50 (87.68). All are the same real UI at the same moment, zoomed. There is no drawn or mocked-up UI. The added elements are all allowed: chips, callouts, an opaque progress bar, highlights, ripples, and an end card with a blurred real frame and the real logo.

### 5. Audio: FAIL (blocker)
- Loudness: integrated -14.1 LUFS, LRA 7.3 LU, true peak -1.3 dBTP, sample peak -1.37 dBFS, no clipping. **Pass.**
- Ending: the fade reaches silence at 118.97 s (below -50 dB), and the last 0.5 s is at -93 dB. **Pass.**
- **SFX: FAIL.**
  - The final AAC track fits `1.13·music + 1.12·sfx` over 5–59 s, with a residual of -47 dB.
  - Over 60–119 s it fits `1.13·music + 0·sfx`. The sfx coefficient is exactly zero.
  - `audio/stems/sfx.wav`, `audio/build/sfx_raw.wav` and the sfx part of `mix.wav` are all digital silence after 59.55 s. That covers 42 of the 99 cues in `build/cues.json`.
  - The audio QA log shows the symptom ("FAIL isolated cue onsets… worst onset offset 113350 ms" and sfx section RMS of `-inf` for R1–End), but the headline cue-sync check still printed PASS because it reads the cue table, not the audio.
- **Root cause** is in `audio/src/sfx.mjs:141`:
  ```js
  pan = sh?.callTarget ? PAN_X(sh.callTarget.x + sh.callTarget.w / 2) * 0.6 : 0;
  ```
  `callTarget` is now a keyframe **array** for s36, s49, s52, s60 and s68, so `.x` is undefined and `pan` becomes NaN. That happens first at the s36 pop at 59.55 s. The NaN enters the dry bus, and the recursive 25 Hz high-pass (and the reverb) carry it to every later sample. The WAV writer then stores those samples as 0. I reproduced it: the scratch re-run prints "peak NaN", and my debug line flags BADPAN at 59.55, 82.55, 89.55, 104.05 and 113.35.
- A/V offset: the decoded audio is 2048 samples (about 43 ms) late against `mix.wav` because AAC priming is not trimmed. Cue transients measure +26 to +40 ms late before 59.5 s. This is just over 1 frame, so minor.

### 6. Text and highlights: PASS (minor notes)
- All round-1 highlight faults are fixed. The keyframed targets and visibility windows track correctly in:
  - s09 (budget and date row)
  - s18 (badge)
  - s27 (Add Deliverables)
  - s29 (Text+Image with "Recommended")
  - s35 (the "AI brief applied to 2 creators" toast)
  - s42 (status cards)
  - s49 (Set Custom, then the calendar)
  - s52 (follows the scroll)
  - s58 (the donut stays inside the box)
  - s60, s64 (the Success toast)
  - s68/s69 (the rating card, then the thank-you card)
- Hook phrases now appear whole within about 0.15 s and stay readable for about 0.75 s of each 1 s beat. That is acceptable for a hook montage.
- Callouts are legible, spelled correctly ("CLEO" is now "AI"), and do not overlap the progress bar or the chapter chip.
- The minor notes are in the table below.

### 7. Visual quality: PASS
- The only black frames are the intended 2-frame fade-in. No glitches.
- The progress bar is now opaque.
- The end card is clean: real logo, tagline, and the "Create • Match • Brief • Launch • Approve • Measure" line on a cropped blurred background with a slow push. It fades to dark at 119.5.

### 8. Overall
A new brand will follow the full flow, and the highlights now reinforce each step instead of distracting from it. The only thing stopping release is the missing second half of the sound design. It also takes the payoff sounds for "Campaign activated!", "Draft approved" and the end sting, which the edit is built around.

Fix order:
1. Fix the pan bug and add a NaN guard (B1).
2. Make the audio QA fail on a silent or NaN stem.
3. Rebuild the audio and re-render.
4. Optionally clear up the minor items.

---

## Issues

| # | severity | time | issue | suggested fix (shot ids from timeline.json) |
|---|---|---|---|---|
| B1 | **blocker** | 59.55–120.0 | No SFX in the delivered audio after 59.55 s: 42 of 99 cues are missing, including the s41 activation chime and impact, the s46 "Draft approved" chime, all clicks and pops in steps 6–10, and the end sting. Cause: `sfx.mjs:141` reads `callTarget.x` on the keyframe-array targets of s36, s49, s52, s60 and s68, so pan is NaN and the recursive high-pass and reverb carry NaN to every later sample. | In `sfx.mjs`, use `const ct = Array.isArray(sh?.callTarget) ? sh.callTarget[0] : sh?.callTarget;` (the same fix applies anywhere else `callTarget` is read). Add `if (!Number.isFinite(pan)) pan = 0;` and an assert that the dry bus has no NaN. Then `bash audio/build.sh` and re-render (`SKIP_AUDIO=0 bash build.sh`). |
| M1 | major (process) | n/a | The audio QA printed "PASS every SFX cue is heard within 1 frame" while the stem was silent. The check reads the cue table, not the rendered audio. | In `qa.mjs`, measure each cue's onset in `stems/sfx.wav`, and fail on any second of the stem below -90 dB that contains a cue, on a NaN peak, or on a sfx section RMS of -inf. Add a regression check that fits the final mp4 against the stems. |
| m1 | minor | 0–43 ms offset, whole video | The decoded AAC is about 43 ms (2048 samples) behind `mix.wav` (untrimmed priming), so cues land 1–1.3 frames late. | Mux `mix.wav` into the final with `-ss`/`adelay` compensation, or encode AAC in the final ffmpeg step from `mix.wav` instead of `-c:a copy`. |
| m2 | minor | 24.0–27.5 | The s16 callout ("at top") covers the modal's "QUICK SUMMARY" label and sits right against the title. | Nudge the callout about 40 px higher, or right-align it beside the title. |
| m3 | minor | 42.6–42.8 | s26: for about 0.2 s the highlight frames the "Pick a known brand" header and blank space while the list scrolls in. | Change `callWin` to `[0.1, 0.72]`. |
| m4 | minor | 53.7–56.7 | The s33 callout sits on the dimmed "Why we're doing this" paragraph of the brief. | Move it below the highlighted block, or to the right margin. |
| m5 | minor | 68.0–70.4, 86.6–88.4 | The opaque progress bar now hides the source's "Go to Dashboard" button (s41) and the "Live Date for Mira set successfully" toast (s50). | Raise the focus a little in s41 and s50, or accept it (neither is essential). |
| m6 | minor | 86.6–88.4 | In s50 the two filled dates ("October 4th, 2026", "October 5th, 2026") are small, pale text inside the highlight. They are readable but low contrast. | Zoom the s50 focus tighter on the Live Date column (about 1.3x). |
| m7 | minor | 8.75–8.85 | s07's last frames: the page starts scrolling and the highlight briefly drifts toward "Traffic". | End s07's `callWin` at 0.9. |
| m8 | minor | 114.4–114.6 | The red 4-dot loader is visible for about 0.2 s at the end of s68. | Trim s68 srcOut by about 0.3 s. |
| m9 | minor | 83.1 | The first s49 click ring appears to land on the Avg Comments cell rather than a control. | Re-measure the click position or drop that ring. |

---
*Round 1 (pre-23:48 render): FAIL. About 12 highlights did not track the scrolling UI, the hook phrases were too brief to read, and the s50 payoff was missing. All of those are fixed in this render.*
