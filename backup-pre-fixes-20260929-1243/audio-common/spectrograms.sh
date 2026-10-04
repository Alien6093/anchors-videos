#!/bin/bash
# bash audio-common/spectrograms.sh A : spectrograms (log frequency) of music, sfx stem and final mix -> audio-A/qa/
F=$1; D=audio-$F; mkdir -p $D/qa
for k in music sfx mix; do
  ffmpeg -y -v error -i $D/${F}_$k.wav -lavfi "showspectrumpic=s=1800x640:legend=1:scale=log:fscale=log:color=intensity:start=40:stop=16000:drange=90" -frames:v 1 $D/qa/${F}-spectrogram-$k.png
done
