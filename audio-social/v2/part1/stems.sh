#!/bin/bash
# stems = the 916 pre-master music / sfx buses with the SAME EQ + master gain as the mix (float32 wav, no limiter: music + sfx = mix before softclip/limiter)
cd "$(dirname "$0")"
G=$(python3 -c "import json;print(json.load(open('build/master_916.json'))['gain'])")
EQ=$(grep -o "'equalizer=f=3000[^']*'" master.mjs | tr -d "'")
for s in music sfx; do
  ffmpeg -v error -y -f f32le -ar 48000 -ac 2 -i build/916_$s.f32 -af "$EQ,volume=${G}dB,apad=whole_len=2304000,atrim=end_sample=2304000" -c:a pcm_f32le out/Part1_$s.wav
done
ls -la out/
