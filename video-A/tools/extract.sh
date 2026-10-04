#!/bin/bash
# usage: extract.sh frame...  -> out/qa/v<frame>.jpg from out/A_silent.mp4
cd "$(dirname "$0")/.."
for fr in "$@"; do
  ffmpeg -v error -y -i out/A_silent.mp4 -vf "select=eq(n\,$fr)" -vframes 1 -q:v 3 out/qa/v$(printf %04d $fr).jpg
done
