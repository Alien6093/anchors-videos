cd "/Users/adityasingh/anchors video/video-social"
for fm in 916 45; do npx remotion render src/stage1/entry.tsx Stage1-$fm "../social/silent/Stage1_$fm.mp4" --codec=h264 --muted --log=error > /tmp/r_$fm.log 2>&1; done
echo finished > /tmp/r_done
