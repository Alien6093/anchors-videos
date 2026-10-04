#!/bin/bash
# Re-renders demo_anchors_platform/tour-video/anchors-platform-tour-final.mp4 from source.
#   bash build.sh            full rebuild (proxies if missing, script timeline, audio, video)
#   SKIP_AUDIO=1 bash build.sh   reuse the committed audio/mix.wav
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(pwd); SRC=..
HS=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}

# 1. Seek-friendly proxies of the three original recordings (originals are never modified).
mkdir -p project/public/src project/public/audio
i=0
for f in "20261003-164929" "20261003-165151" "20261003-171654"; do
  i=$((i+1)); out=project/public/src/v$i.mp4
  [ -f "$out" ] || ffmpeg -v error -y -i "$SRC/$f anchors vo final 2.mp4" -c:v libx264 -preset fast -crf 14 -g 10 -pix_fmt yuv420p -an "$out"
done

# 2. Timeline + script (single source of truth for picture and sound).
python3 tools/gen_script.py

# 3. Music + SFX (original synthesis), mastered to -14 LUFS.
[ "${SKIP_AUDIO:-0}" = 1 ] || bash audio/build.sh
cp audio/mix.wav project/public/audio/mix.wav

# 4. Picture + audio render (Remotion), 1920x1080 H.264 / AAC.
cd project
[ -d node_modules ] || npm ci --no-audit --no-fund
npx remotion render src/index.ts Tour out/tour.mp4 --codec=h264 --crf=20 --pixel-format=yuv420p \
  --audio-codec=aac --audio-bitrate=192k --concurrency=4 --timeout=120000 --browser-executable="$HS"
cd ..
# Final encode: Remotion emits full-range yuvj420p; convert to standard limited-range BT.709 yuv420p
# (plays correctly everywhere). Audio is encoded straight from the mastered audio/mix.wav (ffmpeg writes the AAC
# priming delay into the edit list, so A/V sync is sample-accurate), faststart for web playback.
ffmpeg -v error -y -i project/out/tour.mp4 -i audio/mix.wav -map 0:v -map 1:a -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart anchors-platform-tour-final.mp4
ffprobe -v error -show_entries format=duration,size -of compact anchors-platform-tour-final.mp4
