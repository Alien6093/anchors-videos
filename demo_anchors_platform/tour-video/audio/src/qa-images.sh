#!/bin/bash
# Spectrograms (log frequency) of the full mix and stems, close-ups of hook and ending, and the RMS plot -> qa/*.png
set -euo pipefail
A="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$A"; mkdir -p qa
spec() { ffmpeg -y -v error $3 -i "$1" -lavfi "showspectrumpic=s=1600x512:legend=1:scale=log:fscale=log:color=intensity:start=30:stop=18000:drange=96" -frames:v 1 "$2"; }
spec mix.wav qa/spectrogram-mix.png ""
spec stems/music.wav qa/spectrogram-music.png ""
spec stems/sfx.wav qa/spectrogram-sfx.png ""
spec mix.wav qa/spectrogram-mix-hook-0-8s.png "-t 8"
spec mix.wav qa/spectrogram-mix-end-110-120s.png "-ss 110"
ffmpeg -y -v error -i qa/rms.ppm qa/rms-per-100ms.png && rm -f qa/rms.ppm
ffmpeg -y -v error -i mix.wav -lavfi "showwavespic=s=1600x300:split_channels=1:colors=0x303030" -frames:v 1 qa/waveform-mix.png
