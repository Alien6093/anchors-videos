"""Part 2 mix + master. Usage: python3 mix.py 916|45
Stems (build/stems[_pro].npy: kick,bass,drums,log,mel,sfx) -> kick sidechain, pre-hit gaps, T1 duck, breath LP, leveller,
soft clip -> build/premaster_<v>.wav. master.py/ffmpeg then does gain + limiter + AAC verification."""
import json, os, sys
import numpy as np
from scipy import signal as sg
import soundfile as sf
from engine import *

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, 'build')
V = sys.argv[1] if len(sys.argv) > 1 else '916'
PRO = V == '45'
st = np.load(os.path.join(B, 'stems_pro.npy' if PRO else 'stems.npy'))
cj = json.load(open(os.path.join(B, 'cues_pro.json' if PRO else 'cues.json')))
kick, bass, drums, log, mel, sfx, hitsb = [st[i].astype(np.float64) for i in range(7)]

G = dict(hits=float(os.environ.get('HITS', '1.0')), kick_lo=1.0, kick_hi=1.0, bass_lo=0.6, bass_hi=1.0, drums=1.0, log=0.8, mel=1.0, sfx=0.9)
if os.path.exists(os.path.join(HERE, 'gains.json')):
    G.update(json.load(open(os.path.join(HERE, 'gains.json'))))
N = NS


def ramp_gain(n, regions):
    """regions: list of (start_samp, end_samp, gain_lin, ramp_samples)"""
    g = np.ones(n)
    for a, b, gl, r in regions:
        a, b = int(a), int(b)
        seg = np.ones(n)
        seg[a:b] = gl
        if r:
            seg[max(0, a - r):a] = np.linspace(1, gl, a - max(0, a - r), endpoint=False)
            seg[b:b + r] = np.linspace(gl, 1, min(r, n - b))
        g = np.minimum(g, seg) if gl < 1 else g * seg
    return g


def duck_hold(times, depth_db, delay=0.025, hold=0.12, rel=0.25, atk=0.02, n=N):
    g = np.ones(n)
    for t in times:
        i = int(t + delay * SR)
        if i >= n: continue
        L = int((atk + hold + rel * 3) * SR); tt = np.arange(min(L, n - i)) / SR
        d = np.where(tt < atk, tt / atk, np.where(tt < atk + hold, 1.0, np.exp(-(tt - atk - hold) / rel * 1.0)))
        c = 1 - (1 - db(-depth_db)) * d
        g[i:i + len(tt)] = np.minimum(g[i:i + len(tt)], c)
    return g


def split(x, f):
    s = sg.butter(2, f, 'lowpass', fs=SR, output='sos'); lo = sg.sosfilt(s, x, axis=0)
    return lo, x - lo


kt = cj['kicks']
sc = sidechain_env(kt, 6.0, 0.110, 0.004, N)[:N, None]
sc_soft = sidechain_env(kt, 3.0, 0.110, 0.004, N)[:N, None]
sc_mel = sidechain_env(kt, 4.5, 0.110, 0.004, N)[:N, None]
kick_lo, kick_hi = split(kick[:N], 150)
bass_lo, bass_hi = split(bass[:N] * sc, 230)
parts = dict(kick_lo=kick_lo, kick_hi=kick_hi, bass_lo=bass_lo, bass_hi=bass_hi,
             drums=drums[:N] * sidechain_env(kt, 1.5, 0.08, 0.004, N)[:N, None], log=log[:N] * sc_soft, mel=mel[:N] * sc_mel, sfx=None)
sfxh = np.stack([sg.sosfilt(sg.butter(2, 120, 'highpass', fs=SR, output='sos'), sfx[:N, c]) for c in range(2)], 1)
parts['sfx'] = sfxh
hitsh = np.stack([sg.sosfilt(sg.butter(2, 150, 'highpass', fs=SR, output='sos'), hitsb[:N, c]) for c in range(2)], 1)

if os.environ.get('FIT'):
    from scipy.optimize import minimize
    edges = [(0, 60), (60, 250), (250, 800), (800, 2000), (2000, 5000), (5000, 24000)]
    tgt = np.array([float(v) for v in os.environ['FIT'].split(',')]) / 100
    names = list(parts)
    A = np.array([[p[(f >= a) & (f < b)].sum() for a, b in edges]
                  for f, p in (sg.welch(parts[k].mean(1), SR, nperseg=8192) for k in names)]).T   # bands x stems (power)
    min_share = np.array([0.03, 0.03, 0.04, 0.03, 0.06, 0.04, 0.12, 0.05])  # every voice stays audible

    def loss(lg):
        pw = A @ (10 ** (lg / 10)); sh = pw / pw.sum()
        stem = (A.sum(0) * 10 ** (lg / 10)); stem = stem / stem.sum()
        pen = np.sum(np.maximum(0, min_share - stem) ** 2) * 400
        return np.sum(((sh - tgt) / (tgt + 0.03)) ** 2) + pen
    best = None
    for s0 in range(6):
        x0 = np.random.default_rng(s0).uniform(-6, 2, len(names)) if s0 else np.zeros(len(names))
        r = minimize(loss, x0, bounds=[(-24, 6)] * len(names), method='L-BFGS-B')
        if best is None or r.fun < best.fun: best = r
    gains = 10 ** (best.x / 20); gains = gains / gains.max()
    json.dump({k: float(g) for k, g in zip(names, gains)}, open(os.path.join(HERE, 'gains.json'), 'w'), indent=1)
    pw = A @ gains ** 2; print('fit shares', np.round(100 * pw / pw.sum(), 1), 'loss', round(best.fun, 3))
    stem = A.sum(0) * gains ** 2; print('stem share %', dict(zip(names, np.round(100 * stem / stem.sum(), 1))))
    G.update({k: float(g) for k, g in zip(names, gains)})

music = sum(parts[k] * G[k] for k in parts if k != 'sfx')

# ---- pre-hit gaps (30-60 ms music dropout) b3, b64, logo b88 (1/16 f1316-1319); PRO: all <= 30 ms
gp = [(3, 30 if PRO else 40), (64, 30 if PRO else 40), (88, 30 if PRO else 133.3)]
g = np.ones(N)
for b, ms in gp:
    a = int(b * BEAT - ms * SR / 1000); e = int(b * BEAT)
    seg = np.ones(N); seg[a:e] = 0.0
    seg[a - 96:a] = np.linspace(1, 0, 96, endpoint=False); seg[e:e + 48] = 1.0
    g = np.minimum(g, seg)
# cross thuds: groove ducks 2 dB b29-b31
g = g * ramp_gain(N, [(29 * BEAT, 31 * BEAT, db(-2), 2400)])
music = music * g[:, None]

# groove lift under the hook (the limiter eats the hook peaks, so the b1-b8 groove needs +3 dB to keep LUFS-S >= -16)
music = music * ramp_gain(N, [(0.5 * SR, 4.0 * SR, db(3.0), int(0.5 * SR))])[:, None]
# ---- breath b86-88: low-pass the music bus (filter closes), crossfaded
lpm = np.stack([sg.sosfilt(sg.butter(2, 1100, 'lowpass', fs=SR, output='sos'), music[:, c]) for c in range(2)], 1)
x = np.zeros(N); a, b = int(86 * BEAT), int(88 * BEAT)
x[a:b] = np.linspace(0, 1, b - a) ** 1.5
music = music * (1 - x[:, None]) + lpm * x[:, None] * db(-1.5)
# 2 dB bump on the airy hush window is in the stems; make sure nothing else removes it

# ---- sfx bus: HP 120 Hz (no SFX sub), T1 duck on the music
sfxh = parts['sfx'] * G['sfx'] + hitsh * G['hits'] * (db(-3) if PRO else 1.0)
td = duck_hold(cj['t1'], 5.0 if not PRO else 3.0, 0.025, 0.12, 0.25, 0.02, N)
music = music * td[:, None]
if PRO:
    music = music  # hits are already 3 dB lower through the capped energy + stem build
mix = music + sfxh
def peaking(x, f0, gain_db, q):
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w0), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w0), 1 - al / A]
    return sg.lfilter(b, a, x, axis=0)


EQ_DB = float(os.environ.get('EQ_DB', '3.5'))
mix = peaking(mix, 3300, EQ_DB, 0.7)      # presence lift (2-5 kHz share) for phone speakers
# DC / sub trim
mix = np.stack([sg.sosfilt(sg.butter(2, 30, 'highpass', fs=SR, output='sos'), mix[:, c]) for c in range(2)], 1)
# mono below 150 Hz
lo = np.stack([sg.sosfilt(sg.butter(2, 150, 'lowpass', fs=SR, output='sos'), mix[:, c]) for c in range(2)], 1)
mid = lo.mean(1, keepdims=True)
mix = mix - lo + mid


# ---- K-weighted loudness for the leveller
def kw(x):
    s1 = sg.lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585], x, axis=0)
    return sg.lfilter([1, -2, 1], [1, -1.99004745483398, 0.99007225036621], s1, axis=0)


def short_term(x, hop=0.5, win=3.0):
    k = kw(x); ms = (k ** 2).sum(1)
    w = int(win * SR); h = int(hop * SR)
    cs = np.concatenate([[0], np.cumsum(ms)])
    ts, vals = [], []
    for c in np.arange(0, len(x) + 1, h):  # centred windows
        a = max(0, c - w // 2); b = min(len(x), c + w // 2)
        vals.append(-0.691 + 10 * np.log10((cs[b] - cs[a]) / (b - a) + 1e-12)); ts.append(c)
    return np.array(ts), np.array(vals)


def level(x, strength=0.85, lim=4.5, target_offset=None):
    ts, S = short_term(x)
    ref = np.median(S[ts > SR * 3]) if target_offset is None else target_offset
    want = np.clip((ref - S) * strength, -lim, lim)
    # hook s0-s1.5 stays hot, hush untouched (short), gold region keeps its lift
    gdb = np.interp(np.arange(len(x)), ts, want)
    gdb = np.convolve(gdb, np.ones(24000) / 24000, mode='same')   # smooth 0.5 s: rides, never pumps
    return x * db(gdb)[:, None], S


for _ in range(3):
    mix, S0 = level(mix, 0.9 if not PRO else 1.0, 5.0)

# ---- 1 ms fades at the file edges so the loop seam is click-free (hook transient starts ~1 ms in)
f = 48
mix[:f] *= np.linspace(0, 1, f)[:, None]
mix[-f:] *= np.linspace(1, 0, f)[:, None]
k = kw(mix); lufs = -0.691 + 10 * np.log10((k ** 2).sum(1).mean())
mix = mix * db(-24.0 - lufs)   # premaster at about -24 LUFS; master.py adds the gain
np.save(os.path.join(B, f'mixpre_{V}.npy'), mix.astype(np.float32))
print(V, 'premix rms dBFS', 10 * np.log10((mix ** 2).mean()), 'peak', 20 * np.log10(np.abs(mix).max()))
