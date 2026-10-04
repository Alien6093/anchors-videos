#!/bin/bash
cd "$(dirname "$0")/build"; ffmpeg -hide_banner -nostats -i dec_${1:-916}.wav -af "ebur128=peak=true:metadata=1,ametadata=print:key=lavfi.r128.S:file=-" -f null - 2>&1 | grep -A1 "pts_time" | python3 -c "
import sys,re
t=sys.stdin.read(); S=[(float(a),float(b)) for a,b in re.findall(r'pts_time:([\d.]+)\s+lavfi.r128.S=(-?[\d.]+)',t)]
print(' '.join(f'{a:.0f}:{b:.1f}' for a,b in S if abs(a-round(a))<0.06 and a>=2.9))"
