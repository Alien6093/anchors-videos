# QA metrics on the DECODED AAC file (build/dec_<v>.wav) and the master wav. python3 analyze.py 916|45
import sys, json, subprocess, re, numpy as np
from scipy.io import wavfile
from scipy import signal
v = sys.argv[1]; D = '/Users/adityasingh/anchors video/audio-social/v2/part1/'
def load(p):
    sr, x = wavfile.read(p); x = x.astype(np.float64)
    if x.dtype == np.int32 or True: pass
    return sr, x
def rd24(p):
    # ffmpeg decode to float
    out = subprocess.run(['ffmpeg','-v','error','-i',p,'-f','f32le','-ac','2','-ar','48000','-'],capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).reshape(-1,2).astype(np.float64)
x = rd24(D+f'build/dec_{v}.wav'); m = rd24(D+('out/Part1_mix_916.wav' if v=='916' else 'out/Part1_mix_45.wav'))
sr = 48000
mono = x.mean(axis=1)
def lufs(p, af=None):
    a = ['ffmpeg','-hide_banner','-nostats','-i',p]+(['-af',af+',ebur128=peak=true'] if af else ['-af','ebur128=peak=true'])+['-f','null','-']
    r = subprocess.run(a,capture_output=True,text=True).stderr; s = r[r.rfind('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS',s).group(1)), float(re.search(r'LRA:\s+(-?[\d.]+) LU',s).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS',s).group(1))
dec = D+f'build/dec_{v}.wav'
I,LRA,TP = lufs(dec)
Ip,_,_ = lufs(dec,'highpass=f=250,lowpass=f=8000')
# band shares (power spectrum, whole file)
f, P = signal.welch(mono, sr, nperseg=8192, average='mean'); df = f[1]-f[0]
bands = [('<60',0,60),('60-250',60,250),('250-800',250,800),('0.8-2k',800,2000),('2-5k',2000,5000),('>5k',5000,24000)]
tot = P.sum()
shares = {n: 100*P[(f>=a)&(f<b)].sum()/tot for n,a,b in bands}
# first 0.5 s
def shares_of(seg):
    f,P = signal.welch(seg, sr, nperseg=4096); t=P.sum()
    return {n: 100*P[(f>=a)&(f<b)].sum()/t for n,a,b in bands}
first = shares_of(mono[int(0.0*sr):int(0.5*sr)])
# crest on master wav (sample peak minus RMS)
pk = np.abs(m).max(); rms = np.sqrt((m**2).mean()); crest = 20*np.log10(pk/rms)
dpk = np.abs(x).max(); drms = np.sqrt((x**2).mean()); dcrest = 20*np.log10(dpk/drms)
# phone sim band energy over time for hook hits
sos = signal.butter(4,[250,8000],btype='band',fs=sr,output='sos'); ph = signal.sosfilt(sos, mono)
prog_rms = np.sqrt((ph**2).mean())
def win_rms(t0, w=0.05): a=int(t0*sr); seg=ph[a:a+int(w*sr)]; return 20*np.log10(np.sqrt((seg**2).mean())/prog_rms+1e-12)
hooks = {t: round(max(win_rms(t0, 0.05) for t0 in np.arange(t, t+0.12, 0.01)),1) for t in [0.0, 22.0, 32.0, 44.0 if False else 35.2]}
# loop seam: last/first samples of the master wav, step at the wrap
seam = {'last': float(m[-1,0]), 'first': float(m[0,0]), 'first_1ms_peak_db': float(20*np.log10(np.abs(m[:48]).max()+1e-9)), 'peak_first_5ms_db': float(20*np.log10(np.abs(m[:240]).max()+1e-9)), 'step': float(abs(m[0,0]-m[-1,0]))}
# short-term loudness min after the first second (ebur128 frame log)
r = subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',dec,'-af','ebur128=peak=true:metadata=1,ametadata=print:key=lavfi.r128.S:file=-','-f','null','-'],capture_output=True,text=True).stdout
S = [(float(a),float(b)) for a,b in re.findall(r'pts_time:([\d.]+)\nlavfi.r128.S=(-?[\d.]+)',r)]
Sv = [b for a,b in S if a>=3.0]; 
res = dict(variant=v, I=I, LRA=LRA, TP_decoded=TP, phone_I=Ip, phone_drop=round(I-Ip,2), shares={k:round(s,1) for k,s in shares.items()}, first_half_sec=first and {k:round(s,1) for k,s in first.items()},
  crest_master=round(crest,2), crest_decoded=round(dcrest,2), master_peak_dbfs=round(20*np.log10(pk),2), hook_hit_phone_db={str(k):x_ for k,x_ in hooks.items()}, seam=seam,
  ST_min_after_3s=min(Sv) if Sv else None, ST_max=max(b for a,b in S) if S else None, len_samples=len(m))
print(json.dumps(res, indent=1))
json.dump(res, open(D+f'build/qa_{v}.json','w'), indent=1)
