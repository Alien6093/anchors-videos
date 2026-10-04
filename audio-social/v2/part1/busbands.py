import numpy as np, sys
from scipy import signal
D='/Users/adityasingh/anchors video/audio-social/v2/part1/build/'
bands=[(0,60),(60,250),(250,800),(800,2000),(2000,5000),(5000,24000)]
names=['kick','perc','bass','harm','lead']
out={}
for n in names+['sfx_hit','sfx_trans','sfx_swell','sfx_ui']:
    f=D+('music_'+n if n in names else n)+'.f32'
    x=np.fromfile(f,dtype=np.float32).reshape(-1,2).mean(axis=1).astype(np.float64)
    fr,P=signal.welch(x,48000,nperseg=8192)
    bp=[P[(fr>=a)&(fr<b)].sum() for a,b in bands]
    tot=sum(bp); out[n]=bp
    print(f'{n:10s} rms {np.sqrt((x**2).mean()):.4f} shares', ' '.join(f'{100*b/tot:5.1f}' for b in bp))
