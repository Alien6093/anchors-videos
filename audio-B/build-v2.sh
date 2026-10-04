#!/bin/bash
# Film B v2 audio: bash audio-B/build-v2.sh   (run from the project root, "anchors video")
# Re-renders the cue list + SFX mix on top of the unchanged mastered music (audio-B/B_music.wav) and masters to
# audio-B/B_mix_v2.wav with the same targets as build-film.sh: -14 LUFS, true peak <= -1.5 dBTP, 60.000 s, 48k stereo 24-bit.
# B_mix.wav (v1) is not touched.
set -euo pipefail
D=audio-B; C=audio-common; F=B
node $D/sfx-v2.mjs
node $D/cues.mjs
node $C/mix.mjs "$D" "$F"
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
norm() { # in out I ; true peak held <= -1.6 dBTP (margin under the -1.5 requirement)
  local in=$1 out=$2 tgt=$3 g m tp lim=0.83
  g=$(awk -v t="$tgt" -v m="$(lufs "$in")" 'BEGIN{print t-m}')
  render() { ffmpeg -y -v error -i "$in" -af "volume=${g}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=${lim}:attack=5:release=80:level=disabled,apad=whole_dur=60,atrim=0:60" -ar 48000 -c:a pcm_s24le "$out"; }
  for i in 1 2 3 4; do
    render; m=$(lufs "$out"); tp=$(tpk "$out")
    g=$(awk -v g="$g" -v t="$tgt" -v m="$m" 'BEGIN{print g+(t-m)}')
    lim=$(awk -v l="$lim" -v tp="$tp" 'BEGIN{ if (tp > -1.6) l = l * 10^((-1.6 - tp)/20); print l }')
  done
  render
  echo "$g" > "${out%.wav}.gain"
}
norm "$D/build/mix_pre.wav" "$D/B_mix_v2.wav" -14
echo "loudness: $(lufs $D/B_mix_v2.wav) LUFS, true peak $(tpk $D/B_mix_v2.wav) dBTP"
