#!/usr/bin/env bash
# Renders every composition (silent h264) to ../social/silent/<id>.mp4. Usage: tools/render-all.sh [id ...]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="../social/silent"
mkdir -p "$OUT"
IDS=("$@")
[ ${#IDS[@]} -eq 0 ] && IDS=(Stage1-916 Stage1-45 Stage2-916 Stage2-45 Stage3-916 Stage3-45)
for id in "${IDS[@]}"; do
  echo "== $id"
  npx remotion render src/index.ts "$id" "$OUT/${id//-/_}.mp4" --codec=h264 --crf=18 --concurrency=4
done
