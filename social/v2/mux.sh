#!/bin/bash
# Builds the six final v2 reels from the silent Remotion renders (social/v2/silent/) and the mastered mixes
# (audio-social/v2/part*/). Video: Remotion's full-range yuvj420p -> standard limited-range BT.709 yuv420p
# (avoids washed-out/crushed colours on platforms that ignore the range flag). Audio: AAC 320k, 48 kHz.
#   9:16 (1080x1920) -> Instagram Reels, YouTube Shorts      4:5 (1080x1350) -> LinkedIn / Instagram feed
set -euo pipefail
cd "$(dirname "$0")/../.."
mix() { case $1 in 1) echo audio-social/v2/part1/out/Part1_mix_$2.wav;; *) echo audio-social/v2/part$1/Part$1_mix_$2.wav;; esac; }
for p in "1 build" "2 review" "3 monitor"; do
  set -- $p
  for f in 916 45; do
    ffmpeg -v error -y -i social/v2/silent/Part$1_$f.mp4 -i "$(mix $1 $f)" -map 0:v -map 1:a \
      -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high \
      -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
      -c:a aac -b:a 320k -shortest -movflags +faststart social/v2/part$1-$2-$f.mp4
    echo "built social/v2/part$1-$2-$f.mp4"
  done
done
