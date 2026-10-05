# Social reels v2 (final)

Three-part series, one campaign: Part 1 BUILD, Part 2 REVIEW, Part 3 MONITOR. Each reel is 48.0 s (1440 frames at 30 fps)
and comes in two formats, cut on identical frames. Script: `social_script_v2.md`.

| Part | 9:16 (1080x1920): Instagram Reels, YouTube Shorts | 4:5 (1080x1350): LinkedIn, Instagram feed |
|---|---|---|
| 1 BUILD | `part1-build-916.mp4` (-14.0 LUFS, -4.2 dBTP) | `part1-build-45.mp4` (-15.0 LUFS, -5.3 dBTP) |
| 2 REVIEW | `part2-review-916.mp4` (-14.1 LUFS, -1.4 dBTP) | `part2-review-45.mp4` (-15.0 LUFS, -2.6 dBTP) |
| 3 MONITOR | `part3-monitor-916.mp4` (-14.1 LUFS, -4.3 dBTP) | `part3-monitor-45.mp4` (-15.1 LUFS, -6.9 dBTP) |

Part 3 has an uploadable cover (`Part3_cover.png`, `Part3_cover_45.png`), because its first frame continues from the end of Part 2.

## Build
1. Render the silent picture. From `video-social/`, run `npx remotion render src/partN/entry.tsx PartN-916|PartN-45 ../social/v2/silent/PartN_<fmt>.mp4 --codec=h264 --crf=18`.
2. Build the audio. Part 1: `audio-social/v2/part1/build_all.sh`. Part 2: `score.py` (with `PRO=1` for 4:5), then `mix.py` and `master.py`. Part 3: the `p3_*.py` scripts.
3. Mux the finals with `bash social/v2/mux.sh`. It converts the picture to standard-range BT.709 yuv420p and encodes the audio as AAC 320k.

## Changes on 2026-10-05
- **Part 2 and Part 3 finals:** these had never been muxed, and the Part 2 4:5 audio master had never been rendered. Both are now done.
- **Part 3 chip:** the chip "Rs 15 below plan" sat under the "Max spend vs spent" row, where the real gap is Rs 2,712. The Rs 15 is the CPM gap (Rs 540 vs Rs 525). The chip now reads "CPM Rs 15 below plan", and Part 3 was re-rendered in both formats.
- **Part 2 9:16 true peak:** the master reached +0.2 dBTP after AAC encoding. A 17 kHz low-pass on the master brings it to -1.4 dBTP (see `audio-social/v2/part2/MASTER_NOTE.md`).
- **Colour range:** all finals are re-encoded from full-range yuvj420p to limited-range yuv420p, so platforms don't shift the colours.
- **9:16 button area:** cards, rows and figures in the 9:16 versions used to run under the Reels/Shorts like/comment/share buttons. In 9:16 the card band is now scaled to 92% from its left edge, so all card content ends at x≈960, as the script's layout rule requires (no text at x>960 between y 900 and 1500). Text stays at 40 px or more.
- **Part 3 opening:** the board rows used to collapse by shrinking their height, which squashed 44 px names into each other for about 0.3 s. They now fade and lift away instead.
- **Rendering:** long Part 1 renders intermittently froze a browser tab here. `video-social/tools/render-chunked.sh` renders 240-frame PNG chunks in a fresh browser each time, then encodes once.
- **Fonts:** `video-social` now embeds the exact Google Fonts files (`tools/fetch-fonts.mjs`), so renders need no network access.

## Earlier v1 reels (`social/stage*-*.mp4`)
These are superseded by v2; don't post them. `social_audit_video.md` lists their known defects:
- numbers caught mid-count
- unreadable source UI
- clipped text, for example "Who did it rea"
- a garbled "8 of 8"
