#!/bin/bash
# usage: sheet.sh name frame... -> out/qa2/name.png contact sheet (3 cols)
cd "$(dirname "$0")/.."
name=$1; shift; sel=""; n=0
for fr in "$@"; do sel="$sel+eq(n\,$fr)"; n=$((n+1)); done; sel=${sel:1}
rows=$(( (n+2)/3 ))
ffmpeg -v error -y -i out/A_silent.mp4 -vf "select='$sel',scale=640:-1,tile=3x$rows" -fps_mode passthrough -frames:v 1 out/qa2/$name.png
