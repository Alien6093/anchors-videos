#!/bin/bash
# Film B v5 audio (round 6: scene 10 = 'How Ashish's post performed' 38.571-42.857, scene 11 back to 42.857, scene 12 restored incl. Likers toggle):
#   bash audio-B/build-v5.sh   (run from the project root, "anchors video")
# Music: music-v5.mjs (score-v5.mjs on engine-v4.mjs) is bit-identical to v3/v4 before 38.571; splice-v5.mjs puts the v3 music back from 55.70 s on (end card unchanged);
# mastered with the same static gain (audio-B/B_music.gain) and limiter as v3. SFX: cues-v5.mjs. Mix master = v4's static gain + limiter (audio-B/B_mix_v4.gain / .limit, read not written) so 0-38.5 s and 55.7-60 s stay sample-identical to v4;
# the result is verified against -14 LUFS / <= -1.6 dBTP / 60.000 s, 48k stereo 24-bit and the script fails if off target (> 0.3 LU or tp > -1.5). B_mix.wav, B_mix_v2.wav, B_mix_v3.wav, B_mix_v4.wav, B_music.wav are not touched. The cue sheet / csv / sfx-cues.json describe the NEWEST build (this one).
set -euo pipefail
D=audio-B
node $D/sfx-v5.mjs
node $D/music-v5.mjs $D/build/music_raw_v5_new.wav
node $D/splice-v5.mjs $D/build/music_raw_v5_new.wav $D/build/music_raw.wav $D/build/music_raw_v5.wav 55.70 0.010
MG=$(cat $D/B_music.gain)   # v3 music master: +0.3 dB, limiter 0.84 (not engaged: raw peak 0.79)
ffmpeg -y -v error -i $D/build/music_raw_v5.wav -af "volume=${MG}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=0.84:attack=5:release=80:level=disabled,apad=whole_dur=60,atrim=0:60" -ar 48000 -c:a pcm_s24le $D/B_music_v5.wav
cp $D/B_music.gain $D/B_music_v5.gain
node $D/cues-v5.mjs
node $D/mix-v5.mjs "$D" B
lufs() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/^ *I:/{v=$2} END{print v}'; }
tpk() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{v=$2} END{print v}'; }
G=$(cat $D/B_mix_v4.gain); LIM=$(cat $D/B_mix_v4.limit)
ffmpeg -y -v error -i $D/build/mix_pre_v5.wav -af "volume=${G}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit=${LIM}:attack=5:release=80:level=disabled,apad=whole_dur=60,atrim=0:60" -ar 48000 -c:a pcm_s24le $D/B_mix_v5.wav
echo "$G" > $D/B_mix_v5.gain; echo "$LIM" > $D/B_mix_v5.limit
L=$(lufs $D/B_mix_v5.wav); T=$(tpk $D/B_mix_v5.wav)
echo "loudness: $L LUFS, true peak $T dBTP (gain $G dB, limiter $LIM pinned to v4)"
awk -v l="$L" -v t="$T" 'BEGIN{ if (l < -14.3 || l > -13.7 || t > -1.5) { print "OFF TARGET"; exit 1 } }'
