#!/bin/bash
# Stage 1 social audio (51.4333 s = 1543 frames @30 fps = 2,468,800 samples @48k, 24 bars @112 BPM). Run from the project root ("anchors video"):
#   bash audio-social/stage1/build.sh
# Only files inside audio-social/stage1 are written; audio-common, audio-A/B, video-* are read-only inputs.
set -euo pipefail
D=audio-social/stage1; N=2468800
node $D/sfx-stage1.mjs
node $D/music-stage1.mjs $D/build/music_raw_stage1.wav > $D/build/music-build.log
node -e "const l=require('fs').readFileSync('$D/build/music-build.log','utf8').split('\n').filter(x=>x.startsWith('{')).map(JSON.parse);require('fs').writeFileSync('$D/build/music-slices.json',JSON.stringify(l,null,1))"
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
# static gain to target, tanh soft clip, look-ahead limiter, exact length; gain re-trimmed 4x; limiter ceiling tightened until true peak <= CEIL
norm() { # in out I CEIL
  local in=$1 out=$2 tgt=$3 ceil=$4 g m tp lim=0.84
  g=$(awk -v t="$tgt" -v m="$(lufs "$in")" 'BEGIN{print t-m}')
  render() { ffmpeg -y -v error -i "$in" -af "volume=${g}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=${lim}:attack=5:release=80:level=disabled,apad=whole_len=$N,atrim=end_sample=$N" -ar 48000 -c:a pcm_s24le "$out"; }
  for i in 1 2 3 4 5; do
    render; m=$(lufs "$out"); tp=$(tpk "$out")
    g=$(awk -v g="$g" -v t="$tgt" -v m="$m" 'BEGIN{print g+(t-m)}')
    lim=$(awk -v l="$lim" -v tp="$tp" -v c="$ceil" 'BEGIN{ if (tp > c) l = l * 10^((c - tp)/20); print l }')
  done
  render
  echo "$g" > "${out%.wav}.gain"; echo "$lim" > "${out%.wav}.limit"
}
node $D/cues-stage1.mjs
norm $D/build/music_raw_stage1.wav $D/Stage1_music.wav -16 -1.6
node $D/mix-stage1.mjs
norm $D/build/mix_pre.wav $D/Stage1_mix.wav -14 -1.65
# SFX stem at the mix's master gain (as audio-common/stems.mjs)
G=$(cat $D/Stage1_mix.gain)
ffmpeg -y -v error -i $D/build/sfx_part.wav -af "volume=${G}dB,atrim=end_sample=$N" -c:a pcm_s24le $D/Stage1_sfx.wav
echo "Stage1 mix: $(lufs $D/Stage1_mix.wav) LUFS, $(tpk $D/Stage1_mix.wav) dBTP"
