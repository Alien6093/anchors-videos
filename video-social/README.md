# video-social

Re-cuts the three finished 16:9 films into 9:16 (1080x1920) and 4:5 (1080x1350) reels. Sources are muted `<OffthreadVideo>` from `public/src/{v4,A,B}.mp4` (copies; originals untouched). Audio is muxed later in ffmpeg.

## Compositions
`Stage1-916 Stage1-45 Stage2-916 Stage2-45 Stage3-916 Stage3-45` (Remotion ids cannot contain `_`; output files are `Stage1_916.mp4` etc.).
Stage1 = v4 (150s), Stage2 = A (60s), Stage3 = B (60s). Each reads `src/plans/stage{N}_{fmt}.ts`; duration derives from the plan.

## Plan format (`src/lib/plan.ts`)
A plan file exports `plan: CutPlan`. Build it with `buildPlan({...})` (totalFrames = sum of scenes).
- `format`: `'916' | '45'`
- `scenes[]`: `id`, `source` ('v4'|'A'|'B'), `srcInSec`, `srcOutSec`, `speed?`, `freezeAtSec?` (freeze and hold to scene end),
  `crop` Rect in source px (1920x1080), `cropTo?` (eased punch-in over the scene), `layout` `'full-crop'|'stack-blur'`,
  `transitionIn?` (`whip|zoom-punch|flash|none`), `caption?` {text, inSec, outSec, style pop|accent|number, position upper|middle|lower},
  `callouts?` [{text, inSec, outSec, x, y (0..1 of frame), arrow, tone}]. Overlay times are seconds relative to scene start.
- `hook?` {text, durationSec} scroll-stopper over the first ~1.5s; `endCard?` {durationSec, tagline, cta, sub?} shown over the final frames (the last scene(s) should cover that time); `progressBar?`.
- Scene output length = (srcOut - srcIn) / speed. Scenes are contiguous; optional `startSec` is checked against that.
- `full-crop` crop rects must match the format aspect (0.5625 for 916 -> 607.5x1080 at zoom 1; 0.8 for 45 -> 864x1080). Use `formatRect(aspect, centreX, zoom, centreY?)` from `lib/crop.ts`.
  `stack-blur` crops can be any aspect (typically the full 1920x1080 or a wide region): blurred background + rounded sharp card inside the safe zone.
- Safe zones (`lib/format.ts`): 916 top 250 / bottom 450 / side 60; 45 margin 80. Captions, callouts, hook and end card are clamped into them.

## Adding / replacing a plan
1. Edit `src/plans/stage{N}_{fmt}.ts` (see `lib/placeholder.ts` for a working example).
2. `npm run typecheck`; plans are validated on load (`assertValidPlan`) - errors list the offending scene.
3. `npx remotion still src/index.ts Stage3-916 out/a.png --frame=300` to check; avoid a frame in the first 9 frames of a whip scene.
4. `bash tools/render-all.sh [ids...]` renders silent h264 to `../social/silent/<id>.mp4`.

## Layout
`lib/` plan, crop, format, anim, placeholder - `components/` CroppedClip, SocialCut (assembles a plan), KineticCaption, HookFlash, Callout, ProgressBar, SceneTransition, EndCard, AnchorsLogo, theme.
