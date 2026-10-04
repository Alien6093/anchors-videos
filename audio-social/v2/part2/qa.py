"""Part 2 QA: measures a stereo wav (or an AAC mp4 decoded to wav) against the Part 2 targets. Uses ffmpeg ebur128 for
LUFS/LRA/true peak/LUFS-S and numpy for band shares, crest, hook levels, seam. Usage: python3 qa.py file.wav [label]"""
import re, subprocess, sys, json, os, tempfile
import numpy as np
from scipy import signal as sg
import soundfile as sf  # noqa

SR = 48000


def ff(args):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + args, capture_output=True, text=True).stderr


def ebur(path, af_pre=''):
    chain = (af_pre + ',' if af_pre else '') + 'ebur128=peak=true:framelog=verbose'
    t = ff(['-loglevel', 'verbose', '-i', path, '-af', chain, '-f', 'null', '-'])
    summ = t[t.rfind('Summary:'):]
    g = lambda k: float(re.search(k + r':\s+(-?[\d.]+)', summ).group(1))
    frames = re.findall(r't:\s*([\d.]+)\s+TARGET:.*?M:\s*(-?[\d.inf]+)\s+S:\s*(-?[\d.inf]+)', t)
    S = [(float(a), float(c)) for a, b, c in frames if 'inf' not in c and float(c) > -100]
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    return dict(I=g('I'), LRA=g('LRA'), TP=tp, S=S)


def bands(x):
    m = x.mean(1) if x.ndim > 1 else x
    f, p = sg.welch(m, SR, nperseg=8192)
    tot = p.sum()
    edges = [(0, 60), (60, 250), (250, 800), (800, 2000), (2000, 5000), (5000, 24000)]
    return [round(100 * p[(f >= a) & (f < b)].sum() / tot, 1) for a, b in edges]


def phone(x):
    s = sg.butter(2, 250, 'highpass', fs=SR, output='sos'); y = sg.sosfilt(s, x, axis=0)
    s = sg.butter(2, 8000, 'lowpass', fs=SR, output='sos'); return sg.sosfilt(s, y, axis=0)


def rms_db(x): return 10 * np.log10(np.mean(x ** 2) + 1e-20)


def measure(path, label=''):
    x, sr = sf.read(path); assert sr == SR
    r = {}
    e = ebur(path)
    r.update(I=e['I'], LRA=e['LRA'], TP=e['TP'])
    S = [s for t, s in e['S'] if t >= 3.0]  # S needs a 3 s window; report minimum after the first 3 s window and from 1 s
    r['Smin_after_1s'] = min(s for t, s in e['S'] if t >= 1.0) if e['S'] else None
    r['Smax'] = max(s for t, s in e['S']) if e['S'] else None
    r['n'] = len(x)
    pk = np.max(np.abs(x)); r['samplepeak'] = 20 * np.log10(pk)
    r['crest'] = r['samplepeak'] - rms_db(x) / 2 * 1  # dBFS peak - RMS dBFS (rms_db is power dB, == 10log10 mean sq)
    r['crest'] = 20 * np.log10(pk) - rms_db(x)
    r['bands%'] = dict(zip(['<60', '60-250', '250-800', '0.8-2k', '2-5k', '>5k'], bands(x)))
    r['first0.5s%'] = dict(zip(['<60', '60-250', '250-800', '0.8-2k', '2-5k', '>5k'], bands(x[:int(0.5 * SR)])))
    r['first0.5s_rms_dBFS'] = rms_db(x[:int(0.5 * SR)])
    # phone sim loudness
    with tempfile.TemporaryDirectory() as td:
        pth = os.path.join(td, 'p.wav'); sf.write(pth, phone(x), SR, subtype='FLOAT')
        pe = ebur(pth)
    r['phone_I'] = pe['I']; r['phone_drop'] = e['I'] - pe['I']
    # hook hits in the phone band: peak 100 ms RMS vs programme RMS (phone band)
    ph = phone(x).mean(1); prog = rms_db(ph)
    def hit(t0, t1):
        w = int(0.1 * SR); seg = ph[int(t0 * SR):int(t1 * SR)]
        best = max(rms_db(seg[i:i + w]) for i in range(0, len(seg) - w, 480))
        return best - prog
    r['hook_hit_b0_over_prog_dB'] = hit(0.0, 0.4)
    r['hook_hit_b3_stamp_over_prog_dB'] = hit(1.5, 1.9)
    r['gold_hit_over_prog_dB'] = hit(32.0, 32.4)
    # loop seam
    d = np.abs(np.diff(x, axis=0)).max(1)
    r['seam_step'] = float(np.abs(x[0] - x[-1]).max())
    r['median_step_first5ms'] = float(np.median(d[:240]))
    r['max_step_last5ms'] = float(d[-240:].max())
    r['last50ms_rms_dBFS'] = rms_db(x[-2400:]); r['first50ms_rms_dBFS'] = rms_db(x[:2400])
    # hush window b55-56 (27.5-28.0)
    r['hush_rms_dBFS'] = rms_db(x[int(27.5 * SR):int(28.0 * SR)])
    r['hush_min50ms_dBFS'] = min(rms_db(x[i:i + 2400]) for i in range(int(27.5 * SR), int(28.0 * SR) - 2400, 480))
    # LUFS-S table per second for the report
    r['S_by_sec'] = [round(s, 1) for t, s in e['S'] if abs(t - round(t)) < 0.06][:48]
    return r


def encoded(wav, mp4, aac_k=320):
    """Mux wav with a dummy video into an AAC mp4 and decode it back to wav (the file that actually ships)."""
    dur = len(sf.read(wav)[0]) / SR
    ff(['-y', '-f', 'lavfi', '-i', f'color=c=black:s=320x180:r=30:d={dur}', '-i', wav, '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', f'{aac_k}k', '-shortest', mp4])
    dec = mp4.replace('.mp4', '_dec.wav')
    ff(['-y', '-i', mp4, '-vn', '-ar', '48000', '-c:a', 'pcm_f32le', dec])
    return dec


if __name__ == '__main__':
    r = measure(sys.argv[1]); r.pop('S_by_sec', None)
    print(json.dumps(r, indent=1))
