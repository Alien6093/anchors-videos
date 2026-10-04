#!/bin/bash
# Builds a ~2 min platform tour from the 3 raw recordings. Segments: input:start:end:speed
set -euo pipefail
cd "$(dirname "$0")"
IN=("20261003-164929 anchors vo final 2.mp4" "20261003-165151 anchors vo final 2.mp4" "20261003-171654 anchors vo final 2.mp4")
SEGS=(
 0:0:24:4  0:30:70:6  0:72:100:8  0:102:110:2  0:114:150:5  0:150:190:6
 0:198:222:6  0:252:300:8  0:300:345:6  0:360:398:4
 1:0:20:4  1:24:72:4  1:72:91:3
 2:0:48:6  2:48:110:6  2:110:187:6
)
args=(); fc=""; labels=""; n=0
for i in 0 1 2; do args+=(-i "${IN[$i]}"); done
for s in "${SEGS[@]}"; do
  IFS=: read -r i a b sp <<<"$s"
  fc+="[$i:v]trim=start=$a:end=$b,setpts=(PTS-STARTPTS)/$sp,scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=30,setsar=1[v$n];"
  labels+="[v$n]"; n=$((n+1))
done
fc+="${labels}concat=n=$n:v=1:a=0,format=yuv420p[out]"
ffmpeg -v error -stats -y "${args[@]}" -filter_complex "$fc" -map "[out]" -c:v libx264 -crf 21 -preset medium -movflags +faststart anchors-platform-tour-2min.mp4
