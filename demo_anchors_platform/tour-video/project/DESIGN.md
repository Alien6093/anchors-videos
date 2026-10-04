# Anchors Platform Tour — Visual Design

120 s · 1920x1080 · 30 fps · 3600 frames. Remotion 4.0.290. Composition id `Tour`.

The video is **data-driven**. `src/timeline.ts` imports `src/timeline.json` and works out every frame range, playback rate,
camera move, callout, mask and click ring from it. No shot times are hard-coded, so if the script is revised you only
need to re-render.

## Look

Premium, calm, product-first. All footage is real frames from the three recordings (V1/V2/V3, 1914x866). The camera
moves over the footage and the graphics stay on top of it. Each graphic is a dark, rounded "chip" in the Anchors red/ink
style, so it reads as part of the product and never as a fake piece of UI. Light UI footage is set against near-black
chips with small red accents. The hero beats switch to solid red chips.

## Palette (measured from the footage)

| token | hex | source |
|---|---|---|
| `red` (brand primary) | **#DB2425** | Median of the "Check Latest Outline" and "Continue →" buttons, V1 @ 13.0 s (e.g. px 1640,770; 1460,822). It is identical on "View Matched Influencers →" at V1 @ 100.6 s. |
| `redLogo` | #D72228 / #DC2320 | The logo dots, V1 @ 13.0 s (px 22,24 / 36,24). |
| `redLight` | **#EE4243** | The "Go to Dashboard" success button, V1 @ 392.5 s (px 860–1000, 700–725). Used for gradients, glows and red text on dark backgrounds, where #DB2425 is too dim. |
| `ink` | #111111 | Near-black for chips and pills, used at 88 % opacity (`rgba(17,17,17,0.88)`). The UI's headings sample at #000. |
| `white` | #FFFFFF | Text on chips. |
| `base` | #0C0C0E | The canvas under the footage, so a frame is never transparent. |

Capture artefact: the bottom 2 px rows of every recording are magenta (#FF92E5 / #C32C7F). They are always cropped,
because the clean source height is 862 px.

## Typography

Inter comes from the local `public/fonts/inter-latin-{400..800}-normal.woff2` files. They are embedded as base64
data: URIs in `src/fontData.ts`, generated from those files, and loaded with `FontFace` behind a `delayRender` in
`src/fonts.ts`. Nothing is loaded from the network.

Earlier, fetching the fonts from the render server through `staticFile` stalled under concurrency 4. The server was
busy with OffthreadVideo frame requests, and the stall timed out the render. If the woff2 files change, regenerate
`fontData.ts`.

| use | size / weight |
|---|---|
| Hook headline | 124 px / 800, tracking −3, word-by-word reveal |
| Step chip title | 32 px / 700 (number: 26 px / 800 in a 48 px red circle) |
| Callout pill | 40 px / 700. Hero beats use 48 px / 800 |
| Progress labels | 20 px (number 800, current title 600) |
| End card | Tagline 50 px / 700, recap 30 px / 600 |

Every label is at least 20 px, and every reading label is at least 30 px. Corners use radii of 14 px (chips, pills,
mask cut-out), 12 px and 10 px, which matches the 8–12 px look of the UI. The soft shadows sit at 0 10–14 px 30–44 px,
rgba(0,0,0,.25–.35).

## Motion rules

- **Smart camera** (`camera()` in `timeline.ts`):
  - The focus rect is interpolated between keyframes with easeInOutCubic (`at` is the fraction of the shot). It is then
    fitted into the view area (x 48–1872, y 40–936, which leaves room for the callout and progress bar).
  - The scale is capped at **2.4x** source pixels.
  - A slow push of +2.5 % runs over each shot. Hero beats and the hook get +7 %.
  - Hook shots also get a zoom punch (+14 % → 0 over 9 f).
  - The framing is clamped so that real footage covers the frame wherever it can. The focus rect always wins over that
    clamp.
  - Where the footage cannot cover the frame, a **blurred (36 px), darkened (45 %), scaled-up copy of the same real
    frame** fills the gap.
  - For **continuity**, on a `cut` between two shots of the same source the camera carries over from the previous
    framing for 10 frames (easeOutCubic, log-scale interpolation), as long as the zoom ratio stays under 1.6.
- **Source timing**: `t = srcIn + localFrame/30 · (srcOut−srcIn)/(tOut−tIn)`, and `freeze` holds `srcIn`.
  `SourceVideo` splits `t` into an integer `startFrom` plus a sub-frame `<Freeze>` offset on `<OffthreadVideo>`.
  I spot-checked this against ffmpeg extracts, and every frame matched to within ±1 source frame. Under the next shot's
  transition, the outgoing shot holds its last frame, so the footage never shows anything outside its srcIn–srcOut
  range.
- **Transitions** (incoming shot over the held outgoing shot, starting exactly at `tIn` so audio sync is preserved):
  - `cut`: a hard cut.
  - `whoosh`: 8 f. The new shot slides in from the right (easeOutCubic) with horizontal motion blur, using an SVG
    `feGaussianBlur` with stdDeviation "x 0", up to 90 px. The old shot drifts 32 % to the left, blurs and dims.
  - `zoom`: 10 f. The new shot scales from 1.45 to 1 with a 22 px blur and fades in. The old shot scales to 1.3 and
    blurs.
  - `fade`: 10 f crossfade, with the outgoing shot dipping to 55 % brightness. The first shot fades up from black.
- **Focus mask** (whenever `callTarget` is set, outside the hook):
  - Everything else dims by 50 %, with a 7 px soft-edged rounded cut-out and a 3 px #DB2425 outline with a 6 px glow.
  - It starts after the transition. The cut-out "focus-pulls" from 60 px padding to 14 px as it fades in (easeOutCubic,
    ≤12 f) and fades out over the last ≤7 f.
  - The cut-out follows the moving camera every frame.
- **Click ripples**: these start at the click frame and last 24 f. There are two rings (a red stroke over a white halo)
  that expand to 70 px and 52 px, plus a soft red dot. They are mapped through the live camera, so they stay on the real
  cursor.
- **Step chip**: at the chapter start it springs in from the left, oversized at 1.18x, then docks to 1.0 over frames
  12–30 and stays top-left. Its number pops with a bouncy spring. It slides up and fades over the last 6 f of the
  chapter.
- **Progress bar**: a dark floating pill at the bottom with one segment per chapter. The current segment widens
  (flex 1 → 3.9 over 10 f) to show its title and fills in red with a glow. Past segments are white at 72 %. It fades in
  at chapter 1 and out at the end card.
- **Callouts**:
  - Each one starts after its shot's transition (≥3 f) and is held across following shots that have no callout, in the
    same chapter (up to +2.2 s). It is held for at least 1.3 s and leaves over 6 f.
  - It sits bottom-centre. If any `callTarget` it spans would sit under it, it moves to the top-centre.
  - Normal pills are ink with a red dot, with a scale spring from 0.86.
- **Hero beats** (a callout matching /matched|activated|approved|sentiment/):
  - A red gradient pill with a bouncy spring from 0.6, a pulsing red glow and a 10-particle sparkle burst.
  - The camera push-in is slower and deeper (+7 %).
  - Nothing is drawn on the UI itself.
- **Hook (0–5 s)**:
  - A dark radial vignette over the footage, which makes the 124 px white words readable. The words reveal one at a
    time (spring + blur → 0).
  - Digits are drawn in #EE4243. In the last hook shot the final word ("Measure.") turns red, and its words are
    staggered 6 f apart instead of 3.
  - The hook shots are joined by whooshes.
- **End card** (115.5–120 s):
  - It dissolves in over 12 f while the last shot blurs out.
  - The background is the real "Campaign Activated" frame (V1 @ 392.6 s), blurred 30 px under a light wash, with a slow
    push-in.
  - The **real logo** is cropped from V1 @ 13.0 s (rect 12,12,144,36) and shown at 3.6x. It is laid out at full size
    (resampled once) with a mild `feConvolveMatrix` unsharp. `mix-blend-mode: multiply` melts its white UI background
    into the light card.
  - Below it sits the `endCard.text` tagline ("Anchors" in red), then a staggered recap: Create · Match · Brief ·
    Launch · Approve · Measure.
  - The last 0.5 s fades to black.

## Components (`src/`)

| file | role |
|---|---|
| `index.ts`, `Root.tsx` | `registerRoot`. The composition `Tour` is 1920x1080, 30 fps, and its length comes from `durationSec`. |
| `Tour.tsx` | Puts one `<Sequence>` per shot (duration + transition tail), then the end card and the global overlays. `HAS_AUDIO` adds `<Audio src="audio/mix.wav">`. |
| `timeline.ts` | Types, the frame maths, `sourceTime`, the eased focus interpolation, the `camera()` smart camera, `mapRect`, and the callout segments with their placement. |
| `theme.ts` | Palette, sizes, view area, max zoom, transition lengths. |
| `fonts.ts`, `fontData.ts` | Local Inter (embedded) loading. |
| `components/SourceVideo.tsx` | Shows the real recording at an exact source time. |
| `components/ShotLayer.tsx` | Per shot: transitions, the blurred fill, the camera-framed footage, the hook vignette, and the mask, ripple and hook-text overlays. |
| `components/FocusMask.tsx` | The dim-and-cut-out mask with the red glow outline. |
| `components/ClickRipples.tsx` | Click rings. |
| `components/HookText.tsx` | Hook headlines. |
| `components/ChapterChip.tsx` | The docked step chip. |
| `components/ProgressBar.tsx` | The segmented chapter progress bar. |
| `components/Callouts.tsx` | Callout pills, the hero variant and the sparkles. |
| `components/EndCard.tsx` | The end card with the real logo crop. |

## Rendering

```
npx remotion render src/index.ts Tour out/preview.mp4 --codec=h264 --crf=18 --concurrency=4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`remotion.config.ts` already sets the browser executable, JPEG frames at quality 95, and overwrite.
