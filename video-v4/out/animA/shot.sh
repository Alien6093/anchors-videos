#!/bin/bash
# usage: shot.sh S01 f1 f2 ...
cd "/Users/adityasingh/anchors video/video-v4"
id=$1; shift
for fr in "$@"; do npx remotion still src/scenes/_previewRootA.ts $id out/animA/${id}_$fr.png --frame=$fr >/dev/null 2>&1 || echo "fail $id $fr"; done
