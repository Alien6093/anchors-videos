#!/usr/bin/env python3
"""Part 3 MONITOR mix + master. Usage: python3 p3_mix.py 916|45 [--final]
Pre-master: stem balance -> energy curve -> pre-hit gaps -> filter dip (b16) -> SFX-triggered duck -> M/S widen ->
glue comp -> soft clip -> lookahead limiter -> loudness trim. Then encode to AAC 320k in a dummy mp4 and MEASURE the decoded file;
the limiter ceiling is lowered until the decoded true peak <= -1.5 dBTP."""
import sys, json
import numpy as np
import soundfile as sf
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d
sys.path.insert(0, "/Users/adityasingh/anchors video/audio-social/v2/part3")
from p3_voices import SR, NS, OFF, S, hp, lp, bp
import p3_music as pm
import p3_sfx as ps
import p3_qa as q

OUT = "/Users/adityasingh/anchors video/audio-social/v2/part3"
SCR = "/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/m3"

# stem gains (linear, applied to the raw stems whose RMS are about: kick .23 clap .07 hats .10 bass .16 harm .06 arps .08 lead .12)
CFG = {
    "916": {"kick": 0.62, "clap": 1.9, "hats": 1.0, "bass": 0.55, "harm": 1.5, "arps": 1.7, "lead": 1.2, "sfx": 1.0,
            "duck_db": 3.5, "target": -14.0, "lra_note": 5, "drive": 1.0, "comp_thr_db": -22.0, "comp_ratio": 2.0, "clip_db": -12.2, "accent_db": 9.5, "ceil0": -9.6},
    "45": {"kick": 0.62, "clap": 1.9, "hats": 0.8, "bass": 0.55, "harm": 1.5, "arps": 1.7, "lead": 1.2, "sfx": 1.0,
           "duck_db": 3.0, "target": -15.0, "lra_note": 4, "drive": 1.0, "comp_thr_db": -22.0, "comp_ratio": 2.0, "clip_db": -12.2, "accent_db": 0.0, "ceil0": -9.0},
}


def duck_curve(times_s, depth_db):
    g = np.ones(NS)
    d = 10 ** (-depth_db / 20)
    att, hold, rel = S(0.02), S(0.12), S(0.25)
    shape = np.concatenate([np.linspace(1, d, att), np.full(hold, d), d + (1 - d) * (1 - np.exp(-np.linspace(0, 5, rel)))[:rel]])
    shape = np.concatenate([shape, np.ones(1)])
    for t in times_s:
        s0 = int(t * SR) - S(0.01)
        s = max(0, s0)
        e = min(NS, s0 + len(shape))
        g[s:e] = np.minimum(g[s:e], shape[s - s0:e - s0])
    return g[:, None]


def premix(v, cfg):
    z = np.load(f"{SCR}/stems_{v}.npz")
    music = sum(z[k].astype(float) * cfg[k] for k in ("kick", "clap", "hats", "bass", "harm", "arps", "lead"))
    music = music * pm.gaps_and_dip(v)[:, None]
    # one-beat filter dip at b16 (max ~2 LU): blend with an 800 Hz low-passed copy, 8 ms ramps
    a, b = pm.bt(16), pm.bt(17)
    d = np.zeros(NS)
    r = S(0.008)
    d[a:b] = 1.0
    d[a - r:a] = np.linspace(0, 1, r)
    d[b:b + r] = np.linspace(1, 0, r)
    music = music * (1 - d[:, None]) + lp(music, 800, 2) * 0.8 * d[:, None]
    music = music * duck_curve(ps.t1_times_s(), cfg["duck_db"])
    sfx = hp(z["sfx"].astype(float), 120) * cfg["sfx"]
    return music, sfx


def leveler(x, v, passes=2):
    """flatten short-term loudness toward the energy-plan contour (0.8 dB per energy unit around 8, clipped -1.6..+2.0 dB)."""
    cap = 7 if v == "45" else 10
    e = np.array([min(a, cap) for a in pm.ENERGY], float)
    want = np.clip((e - 8) * 0.8, -1.6, 2.0)
    for _ in range(passes):
        xk = q.kw(x)
        ms = np.mean(xk ** 2, 1)
        cs = np.concatenate([[0], np.cumsum(ms)])
        meas = np.zeros(48)
        for i in range(48):
            a, b = max(0, int((i - 1) * SR)), min(NS, int((i + 2) * SR))
            meas[i] = -0.691 + 10 * np.log10((cs[b] - cs[a]) / (b - a) * 2 + 1e-12)
        corr = want - meas
        corr = np.clip(corr - np.mean(corr), -5, 5)
        t = np.arange(NS) / SR
        c = np.interp(t, np.arange(48) + 0.5, corr)
        k = int(0.8 * SR)
        c = np.convolve(np.pad(c, (k, k), mode="edge"), np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
        x = x * (10 ** (c / 20))[:, None]
    return x


def presence_eq(x, db=4.0):
    f0, Q = 3300.0, 0.8
    A = 10 ** (db / 40)
    w0 = 2 * np.pi * f0 / SR
    al = np.sin(w0) / (2 * Q)
    b = [1 + al * A, -2 * np.cos(w0), 1 - al * A]
    a = [1 + al / A, -2 * np.cos(w0), 1 - al / A]
    return signal.lfilter(b, a, x, axis=0)


HIT_ACCENT = {0.0: 1.43, 2.0: 1.0, 13.0: 1.0, 44.0: 1.43}   # relative weight of cfg accent_db per hit (f0 and logo need more)


def accent(x, db, times=(0.0, 2.0, 13.0, 44.0)):
    """short level accent on the four hit beats (f0, f60, f390, b88): plateau 0.18 s then 0.12 s decay."""
    if db <= 0:
        return x
    sh = np.concatenate([np.ones(S(0.18)), np.exp(-np.linspace(0, 4, S(0.12)))])
    g = np.ones(NS)
    for t in times:
        s = int(t * SR) + OFF
        e = min(NS, s + len(sh))
        g[s:e] += (10 ** (db * HIT_ACCENT[t] / 20) - 1) * sh[:e - s]
    return x * g[:, None]


def widen(x):
    m, s = (x[:, 0] + x[:, 1]) / 2, (x[:, 0] - x[:, 1]) / 2
    s = hp(s, 150, 2) + 0.28 * bp(s, 2000, 10000, 2)
    return np.stack([m + s, m - s], 1)


def glue(x, thr_db, ratio):
    n = 0.03 * SR
    a = np.exp(-1 / n)
    e = np.sqrt(signal.lfilter([1 - a], [1, -a], np.mean(x ** 2, 1)) + 1e-12)
    eo = 20 * np.log10(e)
    over = np.maximum(eo - thr_db, 0)
    g = 10 ** (-(over * (1 - 1 / ratio)) / 20)
    return x * g[:, None]


def limiter(x, ceil_db):
    c = 10 ** (ceil_db / 20)
    pk = np.max(np.abs(x), 1)
    graw = np.minimum(1.0, c / (pk + 1e-12))
    la = 144
    gm = minimum_filter1d(graw, 2 * la + 1)
    gs = uniform_filter1d(gm, 2 * la + 1)
    return x * gs[:, None]


def master(pre, cfg, ceil_db, gain_db):
    x = widen(pre)
    x = hp(x, 28, 2)
    x = presence_eq(x, cfg.get('pres_db', 4.0))
    x = glue(x, cfg["comp_thr_db"], cfg["comp_ratio"])
    x = x * 10 ** (gain_db / 20)
    cl = 10 ** (cfg["clip_db"] / 20)
    x = cl * np.tanh(x / cl * 0.9) / np.tanh(0.9)          # soft clip: shaves crest before the limiter
    x = lp(x, cfg.get('lp_after', 16000), 4)           # tame clip edges (codec overshoot) before the limiter
    x = limiter(x, ceil_db)
    x[:24] *= np.linspace(0, 1, 24)[:, None]
    x[-24:] *= np.linspace(1, 0, 24)[:, None]
    return x


def solve(pre, cfg, ceil_db):
    """find gain so the WAV hits the LUFS target (own meter), return master."""
    g = 0.0
    for _ in range(6):
        y = master(pre, cfg, ceil_db, g)
        err = cfg["target"] - q.lufs(y)
        if abs(err) < 0.03:
            break
        g += err
    return y, g


def run(v, final=False):
    cfg = CFG[v]
    music, sfx = premix(v, cfg)
    pre = accent(leveler(music + sfx, v), cfg['accent_db'])
    pre = pre / (np.max(np.abs(pre)) + 1e-9) * 0.5
    ceil = cfg.get('ceil0', -2.5)
    for it in range(8):
        y, g = solve(pre, cfg, ceil)
        wav = f"{SCR}/m_{v}.wav"
        sf.write(wav, y, SR, subtype="PCM_24")
        q.encode_test(wav, f"{SCR}/m_{v}.mp4", f"{SCR}/m_{v}_dec.wav")
        m = q.ff_measure(f"{SCR}/m_{v}_dec.wav")
        print(f"iter {it} ceil {ceil:.2f} gain {g:.2f} | WAV {q.lufs(y):.2f} LUFS | decoded: {m}", flush=True)
        dl = m["I"] - cfg["target"]
        if m["TP"] <= -1.55 and abs(dl) <= 0.25:
            break
        if m["TP"] > -1.55:
            ceil -= (m["TP"] + 1.55) + 0.05
        # loudness correction applied through target shift
        cfg = dict(cfg, target=cfg["target"] - dl * 0.8) if abs(dl) > 0.25 else cfg
    return y, music, sfx, ceil, pre, cfg


if __name__ == "__main__":
    v = sys.argv[1]
    y, music, sfx, ceil, pre, cfg = run(v)
    np.save(f"{SCR}/y_{v}.npy", y)
    print("ceiling", ceil)
