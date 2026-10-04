#!/bin/bash
# Full audio build. Run from project root.
set -euo pipefail
T=${TMPDIR:-/tmp}/audio_build; mkdir -p "$T" public/audio/sfx out
node tools/audio/music.mjs "$T/music_raw.wav"
node tools/audio/sfx.mjs
node tools/audio/cues.mjs
norm() { # in out I TP : two-pass linear loudnorm + final limiter, exactly 60 s
  local J; J=$(ffmpeg -hide_banner -i "$1" -af loudnorm=I=$3:TP=$4:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
  ffmpeg -y -v error -i "$1" -af "loudnorm=I=$3:TP=$4:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.87:level=disabled,atrim=0:60" -ar 48000 -c:a pcm_s24le "$2"
}
norm "$T/music_raw.wav" public/audio/music.wav -15 -1.5
node tools/audio/mix.mjs "$T/mix_pre.wav"
norm "$T/mix_pre.wav" public/audio/mix.wav -14.3 -1.5
