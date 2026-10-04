#!/bin/bash
# Full rebuild for one film: bash audio-common/build-film.sh A   (run from the project root, "anchors video")
set -euo pipefail
F=$1; D=audio-$F; C=audio-common; mkdir -p "$D/build" "$D/qa"
[ -f "$C/sfx/gold-impact.wav" ] || node $C/sfx.mjs $C/sfx     # v4 one-shots (already present)
node $C/sfx-extra.mjs
node $D/music.mjs "$D/build/music_raw.wav"
node $D/cues.mjs
# Mastering (same targets as v4: mix -14 LUFS, music -16 LUFS, TP <= -1.5 dBFS ceiling, exactly 60.000 s).
# Static gain to the target integrated loudness, then a look-ahead true-peak limiter; the gain is re-trimmed twice
# to compensate the small loudness the limiter takes off, so the result lands within ~0.05 LU of target.
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
norm() { # in out I  (writes out.gain with the applied gain in dB); true peak held <= -1.3 dBTP
  local in=$1 out=$2 tgt=$3 g m tp lim=0.84
  g=$(awk -v t="$tgt" -v m="$(lufs "$in")" 'BEGIN{print t-m}')
  render() { ffmpeg -y -v error -i "$in" -af "volume=${g}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=${lim}:attack=5:release=80:level=disabled,apad=whole_dur=60,atrim=0:60" -ar 48000 -c:a pcm_s24le "$out"; }
  for i in 1 2 3 4; do
    render; m=$(lufs "$out"); tp=$(tpk "$out")
    g=$(awk -v g="$g" -v t="$tgt" -v m="$m" 'BEGIN{print g+(t-m)}')
    lim=$(awk -v l="$lim" -v tp="$tp" 'BEGIN{ if (tp > -1.3) l = l * 10^((-1.3 - tp)/20); print l }')
  done
  render
  echo "$g" > "${out%.wav}.gain"
}
norm "$D/build/music_raw.wav" "$D/${F}_music.wav" -16
node $C/mix.mjs "$D" "$F"
norm "$D/build/mix_pre.wav" "$D/${F}_mix.wav" -14
node $C/stems.mjs "$D" "$F"
echo "build complete: $F"
