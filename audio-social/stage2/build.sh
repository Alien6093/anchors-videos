#!/bin/bash
# Full rebuild of Stage 2 audio: bash audio-social/stage2/build.sh   (run from the project root "anchors video")
set -euo pipefail
D=audio-social/stage2; C=audio-common; F=Stage2; LEN=49.3; TPMAX=-1.6
node $D/sfx2.mjs
node $D/music.mjs $D/build/music_raw.wav
node $D/cues.mjs
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
norm() { # in out targetLUFS ; limiter + 0.3 s fade, exactly 49.3 s
  local in=$1 out=$2 tgt=$3 g m tp lim=0.84
  g=$(awk -v t="$tgt" -v m="$(lufs "$in")" 'BEGIN{print t-m}')
  render() { ffmpeg -y -v error -i "$in" -af "volume=${g}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=${lim}:attack=5:release=80:level=disabled,afade=t=out:st=$(awk -v l=$LEN 'BEGIN{print l-0.3}'):d=0.3:curve=qsin,apad=whole_dur=${LEN},atrim=0:${LEN}" -ar 48000 -c:a pcm_s24le "$out"; }
  for i in 1 2 3 4; do
    render; m=$(lufs "$out"); tp=$(tpk "$out")
    g=$(awk -v g="$g" -v t="$tgt" -v m="$m" 'BEGIN{print g+(t-m)}')
    lim=$(awk -v l="$lim" -v tp="$tp" -v mx=$TPMAX 'BEGIN{ if (tp > mx) l = l * 10^((mx - tp)/20); print l }')
  done
  render
  echo "$g" > "${out%.wav}.gain"
}
norm $D/build/music_raw.wav $D/${F}_music.wav -16
node $C/mix.mjs $D $F
norm $D/build/mix_pre.wav $D/${F}_mix.wav -14
node $C/stems.mjs $D $F
echo "build complete: $F"
