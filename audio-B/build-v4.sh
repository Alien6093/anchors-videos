#!/bin/bash
# Film B v4 audio (round 5 retime: scene 10 = 12 beats 38.571-45.000, scene 11 +2.143 s, scene 12 shortened, Likers toggle removed):
#   bash audio-B/build-v4.sh   (run from the project root, "anchors video")
# Music: music-v4.mjs (score-v4.mjs on engine-v4.mjs) is bit-identical to v3 before 38.571; splice-v4.mjs puts the v3 music back from 55.70 s on (end card unchanged);
# mastered with the same static gain (audio-B/B_music.gain) and limiter as v3. SFX: cues-v4.mjs. Mix master = build-v3's norm() (same targets and steps: -14 LUFS, true peak <= -1.6 dBTP,
# 60.000 s, 48k stereo 24-bit). B_mix.wav, B_mix_v2.wav, B_mix_v3.wav, B_music.wav are not touched. The cue sheet / csv / sfx-cues.json describe the NEWEST build (this one).
set -euo pipefail
D=audio-B
node $D/sfx-v4.mjs
node $D/music-v4.mjs $D/build/music_raw_v4_new.wav
node $D/splice-v4.mjs $D/build/music_raw_v4_new.wav $D/build/music_raw.wav $D/build/music_raw_v4.wav 55.70 0.010
MG=$(cat $D/B_music.gain)   # v3 music master: +0.3 dB, limiter 0.84 (not engaged: raw peak 0.79)
ffmpeg -y -v error -i $D/build/music_raw_v4.wav -af "volume=${MG}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=0.84:attack=5:release=80:level=disabled,apad=whole_dur=60,atrim=0:60" -ar 48000 -c:a pcm_s24le $D/B_music_v4.wav
cp $D/B_music.gain $D/B_music_v4.gain
node $D/cues-v4.mjs
node $D/mix-v4.mjs "$D" B
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
    echo "  norm iter $i: measured $m LUFS, tp $tp, next gain $g dB, limiter $lim"
  done
  render
  echo "$g" > "${out%.wav}.gain"
  echo "$lim" > "${out%.wav}.limit"
}
norm "$D/build/mix_pre_v4.wav" "$D/B_mix_v4.wav" -14
echo "loudness: $(lufs $D/B_mix_v4.wav) LUFS, true peak $(tpk $D/B_mix_v4.wav) dBTP"
