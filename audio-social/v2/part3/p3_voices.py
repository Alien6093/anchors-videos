#!/usr/bin/env python3
"""Part 3 MONITOR voice library (numpy). Extends the series kit with: offbeat saturated bass, detuned-saw lead (ANCHOR timbre),
pluck arps, saw chord stabs/pad, kick (body+click), clap/snap, rolling hats, risers, reverse crash, hit-stop tape, impacts, glass tails.
The ANCHOR voice is a port of audio-social/v2/anchor-voice.mjs (Part 1 reference)."""
import numpy as np
from scipy import signal
from scipy.signal import fftconvolve

SR = 48000
BEAT = SR // 2            # 120 BPM
NS = 2_304_000            # 48.000 s
OFF = 48                  # 1 ms: nothing starts at sample 0 (AAC priming safe)
rng = np.random.default_rng(31)


def S(t):
    return int(round(t * SR))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def _sos(kind, fc, order=2):
    return signal.butter(order, fc, kind, fs=SR, output="sos")


def lp(x, fc, o=2):
    return signal.sosfilt(_sos("low", fc, o), x, axis=0)


def hp(x, fc, o=2):
    return signal.sosfilt(_sos("high", fc, o), x, axis=0)


def bp(x, lo, hi, o=2):
    return signal.sosfilt(_sos("band", [lo, hi], o), x, axis=0)


def sat(x, d):
    return np.tanh(x * d) / np.tanh(d)


def fade(x, a=0.0005, b=0.004):
    x = x.copy()
    na, nb = S(a), S(b)
    if na:
        x[:na] *= np.linspace(0, 1, na)
    if nb:
        x[-nb:] *= np.linspace(1, 0, nb)
    return x


def noise(n):
    return rng.standard_normal(n)


def put(buf, x, t_samp, gain=1.0, pan=0.0):
    """add mono (n,) or stereo (n,2) x into stereo buf at sample t_samp (truncate at end)."""
    t_samp = int(t_samp)
    if t_samp >= len(buf) or t_samp + len(x) <= 0:
        return
    s0 = max(0, -t_samp)
    d = max(t_samp, 0)
    n = min(len(x) - s0, len(buf) - d)
    seg = x[s0:s0 + n]
    if seg.ndim == 1:
        a = (pan + 1) * np.pi / 4
        buf[d:d + n, 0] += seg * np.cos(a) * gain
        buf[d:d + n, 1] += seg * np.sin(a) * gain
    else:
        buf[d:d + n] += seg * gain


# ---------------------------------------------------------------- ANCHOR voice (port of anchor-voice.mjs)
_cache = {}


def _svf_lp(x, fc, q):
    g = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    k = 1.0 / q
    a1 = 1 / (1 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    ic1 = ic2 = 0.0
    out = np.empty(len(x))
    xl, a1l, a2l, a3l = x.tolist(), a1.tolist(), a2.tolist(), a3.tolist()
    for i in range(len(xl)):
        v3 = xl[i] - ic2
        v1 = a1l[i] * ic1 + a2l[i] * v3
        v2 = ic2 + a2l[i] * ic1 + a3l[i] * v3
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        out[i] = v2
    return out


def anchor_pluck(freq, vel=1.0, dur=0.5, amp_tau=0.2, sw_tau=0.09):
    key = ("pl", round(freq, 2), round(dur, 3), amp_tau, sw_tau)
    if key not in _cache:
        n = S(dur)
        t = np.arange(n) / SR
        up, dn = 2 ** (7 / 1200), 2 ** (-7 / 1200)
        saw = lambda ph: 2 * (ph - np.floor(ph + 0.5))
        p1 = np.cumsum(np.full(n, freq * up / SR))
        p2 = np.cumsum(np.full(n, freq * dn / SR)) + 0.37
        p3 = np.cumsum(np.full(n, freq / SR)) + 0.11
        x = saw(p1) * 0.42 + saw(p2) * 0.42 + np.where(p3 % 1 < 0.5, 1.0, -1.0) * 0.16
        y = _svf_lp(x, 1300 + 5200 * np.exp(-t / sw_tau), 1.5)
        y = hp(y, 250)
        e = np.minimum(1, t / 0.002) * np.exp(-t / amp_tau)
        tail = np.clip((dur - t) / 0.02, 0, 1)
        _cache[key] = sat(y * 1.3, 1.6) * e * tail
    return _cache[key] * vel


def anchor_bell(freq, dur=1.2, vel=1.0):
    n = S(dur)
    t = np.arange(n) / SR
    o = np.zeros(n)
    for r, a, tau in [(1, 1, 0.7), (2.76, 0.35, 0.4), (5.4, 0.16, 0.2), (8.93, 0.06, 0.1)]:
        o += np.sin(2 * np.pi * freq * r * t) * a * np.exp(-t / (tau * (dur / 1.2 + 0.4)))
    return o * np.minimum(1, t / 0.001) * vel


def anchor_note(midi, vel=1.0, dur=0.5, bell=0.35, amp_tau=0.2):
    f = mtof(midi)
    p = anchor_pluck(f, vel, dur, amp_tau=amp_tau)
    b = anchor_bell(f, max(dur, 0.6), vel * bell)
    o = np.zeros(max(len(p), len(b)))
    o[:len(p)] += p
    o[:len(b)] += b
    return o


# ---------------------------------------------------------------- drums
def kick(vel=1.0):
    n = S(0.30)
    t = np.arange(n) / SR
    f = 68 + 120 * np.exp(-t / 0.025)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.085)
    body = sat(body * 1.4 + 0.35 * np.sin(2 * ph) * np.exp(-t / 0.05), 2.0)
    click = bp(noise(n), 1800, 6500) * np.exp(-t / 0.006) * 0.55
    pop = np.sin(2 * np.pi * 900 * t) * np.exp(-t / 0.003) * 0.3
    y = hp(body * 0.9 + click + pop, 38)
    return fade(y, 0.0002, 0.01) * vel


def clap(vel=1.0, tail=0.11):
    n = S(0.28)
    t = np.arange(n) / SR
    y = np.zeros(n)
    nz = noise(n)
    for d in (0, 0.009, 0.018):
        s = S(d)
        y[s:] += nz[:n - s] * np.exp(-np.arange(n - s) / SR / 0.007)
    y += nz * np.exp(-t / tail) * 0.55 * (t > 0.022)
    y = bp(y, 900, 6500, 2)
    body = np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.035) * 0.45
    return fade(sat(y * 1.1 + body, 1.5), 0.0003, 0.01) * vel * 0.8


def snap(vel=1.0):
    n = S(0.12)
    t = np.arange(n) / SR
    y = bp(noise(n), 1500, 7500) * np.exp(-t / 0.018) + np.sin(2 * np.pi * 330 * t) * np.exp(-t / 0.012) * 0.4
    return fade(y, 0.0002, 0.01) * vel


def hat(open_=False, vel=1.0):
    d = 0.2 if open_ else 0.024
    n = S(d * 5 if open_ else 0.1)
    y = bp(noise(n), 6000, 15000, 2) * env_exp(n, d)
    return fade(y, 0.0002, 0.008) * vel


# ---------------------------------------------------------------- bass / harmony
def bass_note(freq, dur=0.2, vel=1.0):
    key = ("b", round(freq, 2), round(dur, 3))
    if key not in _cache:
        n = S(dur + 0.04)
        t = np.arange(n) / SR
        x = signal.sawtooth(2 * np.pi * freq * t) * 0.55 + signal.square(2 * np.pi * freq * 1.003 * t) * 0.3
        x = lp(x, 650, 2)
        x = sat(x * 1.6, 3.0)
        sub = np.sin(2 * np.pi * freq * t) * 0.35
        e = np.minimum(1, t / 0.004) * np.exp(-t / 0.14) * np.clip((dur + 0.04 - t) / 0.03, 0, 1)
        _cache[key] = hp(x + sub, 36) * e
    return _cache[key] * vel


def saw_chord(midis, dur, att=0.01, rel=0.05, dec=None, lpf=5000, hpf=300, det=(-9, 9)):
    n = S(dur)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)
    for i, m in enumerate(midis):
        f = mtof(m)
        for k, c in enumerate(det):
            x = signal.sawtooth(2 * np.pi * f * 2 ** (c / 1200) * t + 0.9 * i + k)
            if (i + k) % 2:
                L += x
            else:
                R += x
            L += 0.25 * x * (k == 0)
            R += 0.25 * x * (k == 1)
    e = np.minimum(1, t / att) * np.clip((dur - t) / rel, 0, 1)
    if dec:
        e = e * np.exp(-t / dec)
    y = np.stack([L, R], 1) / (len(midis) * 1.6)
    y = hp(lp(y, lpf, 2), hpf, 2)
    return y * e[:, None]


def reverb_ir(sec=0.9, seed=5, damp=5000):
    r = np.random.default_rng(seed)
    n = S(sec)
    ir = np.stack([r.standard_normal(n), r.standard_normal(n)], 1) * np.exp(-np.arange(n) / SR / (sec / 5.5))[:, None]
    ir = lp(ir, damp, 1)
    ir[:S(0.012)] *= np.linspace(0, 1, S(0.012))[:, None]
    return ir / np.sqrt(np.sum(ir ** 2, 0, keepdims=True))


def reverb(buf, wet=0.15, sec=0.9):
    ir = reverb_ir(sec)
    out = np.empty_like(buf)
    for c in range(2):
        out[:, c] = fftconvolve(buf[:, c], ir[:, c])[:len(buf)]
    return buf + out * wet


# ---------------------------------------------------------------- noise colours: whoosh / riser / crash
def bands_noise(n, f_of_t, width=0.7, lo=150, hi=12000, nb=14, seed=0):
    r = np.random.default_rng(seed)
    t = np.arange(n) / n
    fs = np.exp(np.linspace(np.log(lo), np.log(hi), nb))
    y = np.zeros(n)
    f_t = f_of_t(t)
    for fc in fs:
        w = np.exp(-((np.log2(fc) - np.log2(f_t)) ** 2) / (2 * width ** 2))
        y += signal.sosfilt(_sos("band", [fc / 1.25, min(fc * 1.25, SR * 0.45)]), r.standard_normal(n)) * w
    return y / (np.max(np.abs(y)) + 1e-9)


def whoosh(dur=0.32, lo=500, hi=7000, seed=1):
    n = S(dur)
    y = bands_noise(n, lambda t: lo * (hi / lo) ** (0.2 + 0.8 * np.sin(np.pi * t * 0.5)), seed=seed)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return hp(y * e, 300)


def riser(dur, lo=350, hi=9500, tonal=True, seed=2):
    n = S(dur)
    t = np.linspace(0, 1, n)
    y = bands_noise(n, lambda x: lo * (hi / lo) ** x, width=0.9, seed=seed) * (0.15 + 0.85 * t ** 2.2)
    if tonal:
        f = 440 * 2 ** (2 * t)                      # A4 -> A6 glide
        ph = 2 * np.pi * np.cumsum(f) / SR
        y = y + 0.35 * np.sin(ph) * t ** 1.6 + 0.12 * np.sin(2 * ph) * t ** 2
    y = hp(y, 300)
    return fade(y, 0.002, 0.003) * 0.9


def crash(dur=1.4):
    n = S(dur)
    t = np.arange(n) / SR
    return bp(noise(n), 2500, 14000, 2) * np.exp(-t / (dur / 4.5))


def rev_crash(dur=1.0):
    y = crash(dur)[::-1].copy()
    return fade(y * np.linspace(0.3, 1, len(y)), 0.002, 0.002) * 0.9


# ---------------------------------------------------------------- SFX voices
def thud_hook():
    n = S(0.26)
    t = np.arange(n) / SR
    f = 120 + 100 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = sat(np.sin(ph) * np.exp(-t / 0.08), 2.0)
    click = bp(noise(n), 2000, 6500) * np.exp(-t / 0.007) * 0.8
    snp = bp(noise(n), 900, 4500) * np.exp(-t / 0.035) * 0.6
    return hp(fade(body * 0.8 + click + snp, 0.0002, 0.02), 120)


def impact(dur=0.8, vel=1.0):
    n = S(dur)
    t = np.arange(n) / SR
    f = 110 + 220 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sat(np.sin(ph) * np.exp(-t / 0.2), 2.0)
    nz = bp(noise(n), 300, 8000) * np.exp(-t / 0.2)
    cr = hp(noise(n), 3500) * np.exp(-t / 0.35) * 0.35
    clk = bp(noise(n), 2000, 6000) * np.exp(-t / 0.005)
    return hp(fade(tone * 0.7 + nz * 0.55 + cr + clk * 0.6, 0.0002, 0.05), 120) * vel


def tape_stop(dur=0.09):
    n = S(dur)
    t = np.arange(n) / SR
    f = 1400 * np.exp(-t / 0.03) + 180
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.04) * 0.6 + bp(noise(n), 1500, 8000) * np.exp(-t / 0.004)
    return fade(hp(y, 150), 0.0002, 0.01)


def tick(freq, dur=0.14, vel=1.0):
    n = S(dur)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t)) * np.exp(-t / 0.045)
    y = y + bp(noise(n), 2500, 8000) * np.exp(-t / 0.003) * 0.5
    return fade(hp(y, 200), 0.0004, 0.01) * vel


def pop(freq, dur=0.2, vel=1.0):
    n = S(dur)
    t = np.arange(n) / SR
    f = freq * (0.78 + 0.5 * (1 - np.exp(-t / 0.03)))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.07) + 0.25 * np.sin(2 * ph) * np.exp(-t / 0.04)
    y = y + bp(noise(n), 2500, 7000) * np.exp(-t / 0.004) * 0.4
    return fade(hp(y, 200), 0.0004, 0.01) * vel


def swish(dur=0.3, rising=True, lo=1500, hi=9000, seed=4):
    n = S(dur)
    f = (lambda t: lo * (hi / lo) ** t) if rising else (lambda t: hi * (lo / hi) ** t)
    y = bands_noise(n, f, width=0.5, lo=lo / 1.5, hi=hi * 1.2, seed=seed)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.2
    return hp(y * e, 400)


def word_hit(vel=1.0):
    n = S(0.14)
    t = np.arange(n) / SR
    y = bp(noise(n), 1800, 7000) * np.exp(-t / 0.014) + np.sin(2 * np.pi * 420 * t) * np.exp(-t / 0.02) * 0.5
    return fade(hp(y, 200), 0.0003, 0.01) * vel


def glass_tail(midis, dur=1.8, vel=1.0):
    n = S(dur)
    o = np.zeros(n)
    for i, m in enumerate(midis):
        b = anchor_bell(mtof(m), dur, 1.0) * 0.5
        s = S(0.02 * i)
        o[s:] += b[:n - s]
    return hp(fade(o * vel, 0.001, 0.2), 300)
