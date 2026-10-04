#!/usr/bin/env bash
cd "/Users/adityasingh/anchors video/video-social"
for id in Part2-916 Part2-45; do
  npx remotion render src/part2/entry.tsx $id "../social/v2/silent/${id//-/_}.mp4" --codec=h264 --crf=18 --concurrency=4 > /private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/p2/render_$id.log 2>&1
done
echo ALLDONE >> /private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/p2/render_done.log
