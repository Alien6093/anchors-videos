#!/bin/bash
# usage: sheet.sh S01 f1 f2 ... -> S01_sheet.png (2 cols, 960x540 each)
cd "/Users/adityasingh/anchors video/video-v4/out/animA"
id=$1; shift; n=$#; args=(); for fr in "$@"; do args+=(-i ${id}_$fr.png); done
rows=$(( (n+1)/2 ))
ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do echo -n "[$i:v]scale=960:540[v$i];"; done)$(for i in $(seq 0 $((n-1))); do echo -n "[v$i]"; done)xstack=inputs=$n:layout=$(for i in $(seq 0 $((n-1))); do c=$((i%2)); r=$((i/2)); echo -n "$((c*960))_$((r*540))|"; done | sed 's/|$//')" -frames:v 1 ${id}_sheet.png
