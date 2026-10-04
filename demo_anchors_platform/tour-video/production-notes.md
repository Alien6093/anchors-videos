# Anchors platform tour (120 s): production notes

**Deliverable:** `anchors-platform-tour-final.mp4`, 1920x1080, 30 fps, H.264 High (yuv420p, BT.709, limited range) with AAC 48 kHz stereo at 192 kb/s. It is built only from the three real screen recordings in `demo_anchors_platform/`, which were never modified.

## Toolchain
**Remotion 4 (React) + ffmpeg.** Remotion gives frame-exact, data-driven zooms, masks, callouts and transitions over real footage. ffmpeg handles the source proxies, the audio mastering and the final standard-range encode. Both run in this environment: Remotion uses the pre-installed Chromium headless shell, with fonts embedded locally.

## Crew and workflow
1. **Script Writer** watched all three recordings: every 2 s, plus 4–5 fps around every transition. It wrote `script.md` and the machine-readable `project/src/timeline.json`, using `tools/gen_script.py` as the single source of truth. The timeline has 61 shots, 10 chapters, a 5 s hook and a 4.5 s end card.
2. **Motion Designer** built the Remotion project (`project/`, documented in `project/DESIGN.md`). It includes:
   - a smart camera that fits each focus rect, with a 2.4x zoom cap and a blurred real-frame fill
   - a keyframed focus mask and highlight
   - click ripples
   - a docked step chip and a 10-segment progress bar
   - callouts with automatic placement
   - whoosh, zoom and fade transitions
   - the hook typography
   - an end card built from a blurred real frame and the real Anchors logo, cropped from V1 at 13.0 s
3. **Sound Designer / Composer** wrote original music and SFX synthesized in code (`audio/`, documented in `audio/README.md`). Every cue time is derived from `timeline.json` at build time.
4. **Editor / Assembler:** the director, using `build.sh`.
5. **QA Reviewer:** independent, reporting in `qa-report.md`. Round 1 failed on highlight tracking and hook readability. Both were fixed, and the video was re-rendered and re-checked (see below).

## Key choices
- **Story:** hook (five 1 s payoff moments), then Launch (steps 1–6: create, criteria, pick influencers, product, AI briefs, checkout and activation), Run (7–8: drafts and approval, live dates) and Measure (9–10: live performance, AI analysis), then the end card.
- **Pacing:**
  - All loading, waiting and slow typing is cut. The AI-writing progress bar is 1.2 s in total.
  - Typing and scrolls run at 1.5–5x, with a brief 8x pass across the AI progress bar.
  - Payoffs are held at about 1x or slower: 65 creators matched, the AI brief (a freeze on a real frame), Campaign activated, Draft approved, and AI sentiment.
- **Real frames only:**
  - Every UI pixel comes from the recordings.
  - Overlays are limited to text chips and pills, a dim mask with a red outline, click rings and the progress bar.
  - The bottom 2 px magenta edge row of the recordings is cropped.
- **Colour:** brand red #DB2425, measured from the UI's primary buttons (logo dots #D72228), plus #EE4243 for glows, near-black #111 and white. The font is Inter, bundled from @fontsource/inter under the SIL Open Font License.
- **Branding:** the real Anchors logo appears in the footage, so the end card uses it. No URL appears in the footage, so none is shown.
- **Demo data:** the "Sample Mode" banner and the Zepto demo campaign are part of the real footage. Focus rects keep the banner out of frame where possible.

## Audio: sources and licences
| Asset | Source | Licence |
|---|---|---|
| Music bed (120 s, D major moving to E major, about 117–120 BPM, Launch, Run and Measure build with a resolved ending) | Original composition, synthesized sample by sample in `audio/src/music.mjs` | Original work for this project; no third-party rights. Free to use in this film and its cut-downs. |
| SFX (101 cues: hook hits, whooshes, risers, chimes, pops, clicks, end sting) | Original sound design synthesized in `audio/src/sfx.mjs` | Same as above |
| DSP and synth voices | `audio/src/lib.mjs` and `audio/src/voices.mjs`, copied from this repo's own `audio-common/` engine | Same project, original code |

No samples, loops, downloaded audio or AI-generated audio are used. The mix measures -14.0 LUFS integrated and -1.3 dBTP true peak. Music ducks 3–5 dB under the SFX. Stems are in `audio/stems/` (music, sfx) and the final mix is `audio/mix.wav`.

## Rebuild
```
bash demo_anchors_platform/tour-video/build.sh        # proxies, timeline, audio, render, final encode
SKIP_AUDIO=1 bash demo_anchors_platform/tour-video/build.sh   # reuse committed audio/mix.wav
```
Requirements: Node 18+, ffmpeg and Chromium (`BROWSER=` overrides the headless-shell path). The render takes about 10 min on 4 cores. Intermediates (`_work/`, `project/public/src`, `project/public/audio`, `audio/build`, `project/out`) are gitignored and recreated.

## QA summary
See `qa-report.md` (final round) for the full checklist.
