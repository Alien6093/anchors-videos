#!/bin/bash
# Rebuilds every audio deliverable from project/src/timeline.json:  bash build.sh   (from any directory)
# Requires node >= 18 and ffmpeg. Deterministic (seeded): the same timeline gives bit-identical output.
set -euo pipefail
A="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$A"
mkdir -p build stems qa
DUR=$(node -e "import('./src/timing.mjs').then(m=>console.log(m.DUR))")
node src/timing.mjs > build/timing.txt
node src/music.mjs build/music_raw.wav
node src/sfx.mjs build/sfx_raw.wav build/cues.json
node src/mix.mjs build

# Mastering: static gain to -14 LUFS integrated, then a look-ahead true-peak limiter (latency-compensated, no clipper); the gain and the
# limiter ceiling are re-trimmed iteratively so I lands within ~0.1 LU of target and true peak <= -1.3 dBTP.
# apad/atrim make the file exactly $DUR s (48 kHz, 24-bit).
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
TARGET=-14
g=$(awk -v t="$TARGET" -v m="$(lufs build/mix_pre.wav)" 'BEGIN{print t-m}')
lim=0.84
render() { ffmpeg -y -v error -i build/mix_pre.wav -af "volume=${g}dB,alimiter=limit=${lim}:attack=5:release=80:level=disabled:latency=1,apad=whole_dur=${DUR},atrim=0:${DUR}" -ar 48000 -c:a pcm_s24le mix.wav; }
for i in 1 2 3 4 5; do
  render; m=$(lufs mix.wav); tp=$(tpk mix.wav)
  g=$(awk -v g="$g" -v t="$TARGET" -v m="$m" 'BEGIN{print g+(t-m)}')
  lim=$(awk -v l="$lim" -v tp="$tp" 'BEGIN{ if (tp > -1.3) l = l * 10^((-1.3 - tp)/20); print l }')
done
render
echo "$g" > build/mix.gain
node src/stems.mjs build stems
mkdir -p ../project/public/audio
cp mix.wav ../project/public/audio/mix.wav
node src/qa.mjs || echo "WARNING: QA reported failures (see qa.txt)"
bash src/qa-images.sh
echo "build complete: $(cat qa.txt | grep -m1 RESULT)"
