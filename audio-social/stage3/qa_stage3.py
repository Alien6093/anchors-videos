import json, subprocess, numpy as np, soundfile as sf, csv
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy import signal
OUT="/Users/adityasingh/anchors video/audio-social/stage3"; SCR="/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/audio3"
SR=48000; FPS=30; BEAT=60/112
def meas(p, af="ebur128=peak=true"):
    r=subprocess.run(["ffmpeg","-hide_banner","-nostats","-i",p,"-af",af,"-f","null","-"],capture_output=True,text=True).stderr
    I=[l for l in r.splitlines() if l.strip().startswith("I:")][-1].split()[1]; P=[l for l in r.splitlines() if l.strip().startswith("Peak:")][-1].split()[1]
    return I,P
for f in ["Stage3_mix.wav","Stage3_mix_noticks.wav","Stage3_music_49s.wav","Stage3_sfx_49s.wav"]:
    i=sf.info(f"{OUT}/{f}"); x,_=sf.read(f"{OUT}/{f}")
    print(f, i.samplerate,i.channels,i.subtype,i.frames,"=",i.frames/SR,"s =",i.frames/SR*FPS,"frames; sample peak",round(20*np.log10(np.abs(x).max()),2),"dBFS", "LUFS/TP",meas(f"{OUT}/{f}"))
x,_=sf.read(f"{OUT}/Stage3_mix.wav")
# small speaker preview: 300 Hz HP + 8 kHz LP, then loudness and peak
sp=f"{SCR}/phone.wav"
subprocess.run(["ffmpeg","-y","-v","error","-i",f"{OUT}/Stage3_mix.wav","-af","highpass=f=300:poles=2,lowpass=f=8000:poles=2","-c:a","pcm_s24le",sp],check=True)
print("phone-band preview LUFS/TP",meas(sp)); ph,_=sf.read(sp); print(" phone sample peak dBFS",round(20*np.log10(np.abs(ph).max()),2),"; energy below 300Hz share of mix %.1f%%"%(100*(1-np.sum(ph**2)/np.sum(x**2))))
print("first sample",x[0],"last 5 samples",x[-5:].tolist(), "rms last 50ms",np.sqrt((x[-2400:]**2).mean()))
# hit onset QA vs plan frames on sfx stem
s,_=sf.read(f"{OUT}/Stage3_sfx_49s.wav"); mono=np.abs(s).max(1)
plan={"f0 thud":0,"hook smash to black":48,"cut1 sub hit":64,"bubble whoosh":112,"1,85,700 ramp":129,"1,85,700 lock glass+hitstop":177,"dip whip (peak)":257,"2,80,000 ramp":354,"2,80,000 lock glass+impact+hitstop":418,"CPM ping":514,"totals lock":691,"logo hit":1350}
cues=json.load(open(f"{OUT}/Stage3_cues.json"))
names={"f0 thud":"s3-f0-thud","hook smash to black":"smash-hit","cut1 sub hit":"sub-hit","bubble whoosh":"bubble-whoosh","1,85,700 ramp":"counter-ramp-B1","1,85,700 lock glass+hitstop":"s3-hitstop-tape-5f","dip whip (peak)":"whip-peak","2,80,000 ramp":"counter-ramp-final","2,80,000 lock glass+impact+hitstop":"s3-hitstop-tape-6f","CPM ping":"label-ping-3","totals lock":"lock-glass","logo hit":"logo-hit"}
print("hit onsets: cue start + each wav's own 10%-of-peak onset, vs plan frame")
import os
for k,fr in plan.items():
    cs=[c for c in cues if names[k] in c["file"] and abs(c["time"]*FPS-fr)<6]
    if not cs: print(" ",k,"NO CUE near",fr); continue
    t=cs[0]["time"]; w,_=sf.read(f"{OUT}/{cs[0]['file']}"); m=np.abs(w).max(1) if w.ndim==2 else np.abs(w)
    off=np.argmax(m>m.max()*0.1)/SR; ons=(t+off)*FPS
    print(f"  {k:36s} plan f{fr}  cue f{t*FPS:.2f}  audible onset f{ons:.2f}  delta {ons-fr:+.2f} f")
# spectrogram
f,t,Z=signal.spectrogram(x.mean(1),SR,nperseg=2048,noverlap=1536)
fig,ax=plt.subplots(2,1,figsize=(16,8),sharex=True,gridspec_kw={"height_ratios":[3,1]})
ax[0].pcolormesh(t,f,10*np.log10(Z+1e-12),vmin=-110,vmax=-30,shading="auto",cmap="magma"); ax[0].set_ylim(0,16000); ax[0].set_ylabel("Hz")
for b in (4,16): ax[0].axvline(b*BEAT,color="c",lw=.8)
ax[0].set_title("Stage3_mix spectrogram (cyan = splices at out beats 4 and 16)")
tt=np.arange(len(x))/SR; ax[1].plot(tt,x[:,0],lw=.3); ax[1].set_xlim(0,49.3); ax[1].set_xlabel("s"); ax[1].set_ylim(-1,1)
for fr in plan.values(): ax[1].axvline(fr/FPS,color="r",lw=.4)
plt.tight_layout(); plt.savefig(f"{SCR}/Stage3_mix_spectrogram.png",dpi=90)
# splice seam check: max sample-to-sample jump and rms envelope around splices
for nm,b in (("splice1",4),("splice2",16)):
    a=int((b*BEAT-0.6)*SR); z=int((b*BEAT+0.3)*SR); seg_=x[a:z,0]
    print(nm,"max |dx|",round(np.abs(np.diff(seg_)).max(),4),"peak",round(np.abs(seg_).max(),3))
