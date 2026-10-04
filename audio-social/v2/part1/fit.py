import numpy as np, json
from scipy import signal
from scipy.optimize import minimize
D='/Users/adityasingh/anchors video/audio-social/v2/part1/build/'
bands=[(0,60),(60,250),(250,800),(800,2000),(2000,5000),(5000,24000)]
names=['kick','perc','bass','harm','lead','sfx_hit','sfx_trans','sfx_swell','sfx_ui']
BP=[]
for n in names:
    f=D+('music_'+n if n in names[:5] else n)+'.f32'
    x=np.fromfile(f,dtype=np.float32).reshape(-1,2).mean(axis=1).astype(np.float64)
    fr,P=signal.welch(x,48000,nperseg=8192)
    BP.append([P[(fr>=a)&(fr<b)].sum() for a,b in bands])
BP=np.array(BP)
# desired relative loudness preference (dB re total) = soft prior so that nothing vanishes
tp=BP.sum(1); prior=np.array([-8,-11,-10,-8,-6,-12,-20,-24,-15.])-10*np.log10(tp/tp[0])*0    # dB of each bus power vs sum (rough)
lim=dict(max=[10.5,26,None,None,None,None],min=[None,None,19,19,13,9])
def shares(gdb):
    g=10**(gdb/10); bp=(BP*g[:,None]).sum(0); return 100*bp/bp.sum(), g
def cost(gdb):
    sh,g=shares(gdb); c=0
    for i in range(6):
        if lim['max'][i] is not None: c+=max(0,sh[i]-lim['max'][i])**2*50
        if lim['min'][i] is not None: c+=max(0,lim['min'][i]-sh[i])**2*50
    tot=(BP.sum(1)*g); rel=10*np.log10(tot/tot.sum())
    c+=((rel-prior)**2*np.array([1,1,1,1,1,1,.3,.3,1])).sum()*0.3
    return c
bnds=[(-10,6)]*5+[(-6,6)]*4
r=minimize(cost,np.zeros(9),method='Powell',bounds=bnds,options=dict(maxiter=20000,xtol=0.01,ftol=1e-6))
sh,g=shares(r.x); print('gains dB',dict(zip(names,np.round(r.x,1)))); print('shares',np.round(sh,1)); 
tot=(BP.sum(1)*g); print('rel dB',dict(zip(names,np.round(10*np.log10(tot/tot.sum()),1))))
