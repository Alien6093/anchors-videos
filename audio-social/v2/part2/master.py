"""Part 2 master: python3 master.py 916|45. Applies gain + soft clip + ffmpeg true-peak limiter, then verifies on the ENCODED AAC 320k mp4
(dummy video) and lowers the limiter ceiling until the decoded file meets -1.5 dBTP and the LUFS target. Writes Part2_mix_<v>.wav."""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
import qa
from engine import SR, NS

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, 'build')
V = sys.argv[1] if len(sys.argv) > 1 else '916'
PRO = V == '45'
TARGET = -15.0 if PRO else -14.0
TP_MAX = -1.5
START_TRIM = float(os.environ.get('START_TRIM', '0.7'))
TH = float(os.environ.get('CLIP_TH', '0.55'))  # soft-clip threshold (lower = more crest reduction)
x = np.load(os.path.join(B, f'mixpre_{V}.npy')).astype(np.float64)


def soft_clip(y, th, ceil):
    """Soft clipper: knee at th*ceil, saturating towards ceil (peak shaving = crest control)."""
    t = th * ceil; a = np.abs(y); s = np.sign(y)
    over = a > t
    out = y.copy()
    out[over] = s[over] * (t + (ceil - t) * np.tanh((a[over] - t) / (ceil - t)))
    return out


def limiter(y, ceil, look=144, rel=0.080):
    """Look-ahead peak limiter on a 4x oversampled detector (true-peak aware); release rel seconds."""
    from scipy import signal as sg
    from scipy.ndimage import maximum_filter1d, uniform_filter1d
    up = np.max(np.abs(sg.resample_poly(y, 4, 1, axis=0)), axis=1)
    pk = up.reshape(-1, 4).max(1)
    req = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    hold = -maximum_filter1d(-req, size=look * 2 + 1)         # min over +-look samples (gain reaches the dip before the peak)
    hold = uniform_filter1d(hold, size=look)                  # smooth attack
    alpha = 1 - np.exp(-1 / (rel * SR))
    g = np.empty_like(hold); cur = 1.0
    for i in range(len(hold)):                                # instant attack on hold, exponential release
        h = hold[i]
        cur = h if h < cur else cur + (1 - cur) * alpha
        g[i] = cur if cur < h else h
    g = np.minimum(g, hold)
    return y * g[:, None]


def render(g, ceil, path):
    y = soft_clip(x * g, TH, 1.0)
    y = limiter(y, ceil)
    y = y[:NS]
    n0 = int(0.030 * SR); y[:n0] *= np.linspace(START_TRIM, 1.0, n0)[:, None]   # AAC rings on the very first onset: soften the first 30 ms
    sf.write(path, y, SR, subtype='PCM_24')


out = os.path.join(HERE, f'Part2_mix_{"45" if PRO else "916"}.wav')
g = float(os.environ.get('G0', '4.3')); lim = float(os.environ.get('L0', '0.60'))
trim_db = 0.0


def measure_enc(path):
    dec = qa.encoded(path, os.path.join(B, f'enc_{V}.mp4'))
    return qa.ebur(dec)


def write_trim(src_wav, dst, t_db):
    y, _ = sf.read(src_wav); sf.write(dst, y * 10 ** (t_db / 20), SR, subtype='PCM_24')


raw = os.path.join(B, f'm_{V}_raw.wav')
for it in range(10):
    render(g, lim, raw)
    e = measure_enc(raw)
    # the trim lowers TP and loudness together; steer g so that after the trim the loudness hits the target
    trim_db = min(0.0, -(e['TP'] - (TP_MAX - 0.15)))
    I_after = e['I'] + trim_db
    print(f'it{it}: g={g:.3f} lim={lim:.3f} -> I={e["I"]:.2f} TP={e["TP"]:.2f} trim={trim_db:.2f} I_after={I_after:.2f}', flush=True)
    if abs(TARGET - I_after) <= 0.2: break
    g *= 10 ** (0.9 * (TARGET - I_after) / 20)
for k in range(8):
    write_trim(raw, out, trim_db)
    e = measure_enc(out)
    print(f'trim {trim_db:.2f}: I={e["I"]:.2f} TP={e["TP"]:.2f} LRA={e["LRA"]:.2f}', flush=True)
    if e['TP'] <= TP_MAX: break
    trim_db = min(0.0, trim_db - (e['TP'] - (TP_MAX - 0.15)))
json.dump(dict(gain=g, limit=lim, clip_th=TH), open(os.path.join(B, f'master_{V}.json'), 'w'))
print('done', out)
