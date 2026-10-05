#!/bin/bash
# Renders one composition in 240-frame chunks (fresh browser per chunk) and joins them losslessly.
# Long single runs of Part 1 (blurred background video every frame) intermittently froze a browser tab in this
# environment; chunking avoids that. Chunks are PNG frame sequences, encoded once at the end (exact timing, one
# generation of compression; full-range yuvj420p like a direct Remotion render, so social/v2/mux.sh treats it the same).  Usage: bash tools/render-chunked.sh src/part1/entry.tsx Part1-916 out.mp4 [concurrency]
set -euo pipefail
cd "$(dirname "$0")/.."
ENTRY=$1; ID=$2; OUT=$3; CONC=${4:-3}
HS=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
TOTAL=1440; STEP=240
# Remotion pads sequence names per chunk (element-000 ... element-1439): renumber to f_%05d.png, then encode once.
encode_frames() {
  local dir=$1 out=$2
  for f in "$dir"/*.png; do n=$(basename "$f" .png); n=${n##*-}; mv "$f" "$dir/f_$(printf %05d $((10#$n))).png"; done
  ffmpeg -v error -y -framerate 30 -i "$dir/f_%05d.png" -c:v libx264 -preset slow -crf 16 \
    -vf "scale=out_range=pc,format=yuvj420p" -movflags +faststart "$out"
}
[ "${ENCODE_ONLY:-}" ] && { encode_frames "$ENCODE_ONLY" "$OUT"; exit 0; }
# no dot in the dir name: Remotion rejects sequence dirs that look like they have an extension
TMP=$(mktemp -d -t rchunkXXXXXX); trap 'rm -rf "$TMP"' EXIT
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  for try in 1 2 3; do
    if npx remotion render "$ENTRY" "$ID" "$TMP/frames" --sequence --image-format=png --frames=$a-$b \
         --concurrency=$CONC --timeout=240000 --browser-executable="$HS" --log=error >"$TMP/log_$a.txt" 2>&1; then break; fi
    echo "chunk $a-$b failed (try $try)"; tail -3 "$TMP/log_$a.txt"; [ $try = 3 ] && exit 1
  done
  echo "chunk $a-$b ok"
done
n=$(ls "$TMP"/frames/*.png | wc -l); [ "$n" = "$TOTAL" ] || { echo "expected $TOTAL frames, got $n"; exit 1; }
encode_frames "$TMP/frames" "$OUT"
echo "frames: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")"
