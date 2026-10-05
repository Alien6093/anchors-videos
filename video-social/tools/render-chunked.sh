#!/bin/bash
# Renders one composition in 240-frame chunks (fresh browser per chunk) and joins them losslessly.
# Long single runs of Part 1 (blurred background video every frame) intermittently froze a browser tab in this
# environment; chunking avoids that.  Usage: bash tools/render-chunked.sh src/part1/entry.tsx Part1-916 out.mp4 [concurrency]
set -euo pipefail
cd "$(dirname "$0")/.."
ENTRY=$1; ID=$2; OUT=$3; CONC=${4:-3}
HS=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
TOTAL=1440; STEP=240
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  for try in 1 2 3; do
    if npx remotion render "$ENTRY" "$ID" "$TMP/c_$(printf %04d $a).mp4" --frames=$a-$b --codec=h264 --crf=18 \
         --concurrency=$CONC --timeout=240000 --browser-executable="$HS" --log=error >"$TMP/log_$a.txt" 2>&1; then break; fi
    echo "chunk $a-$b failed (try $try)"; tail -3 "$TMP/log_$a.txt"; [ $try = 3 ] && exit 1
  done
  echo "chunk $a-$b ok"
done
ls "$TMP"/c_*.mp4 | sed "s/^/file '/; s/$/'/" > "$TMP/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$OUT"
echo "frames: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")"
