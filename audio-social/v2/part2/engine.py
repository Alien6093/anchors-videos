"""Part 2 (REVIEW) synth engine. numpy/scipy, 48 kHz. Voices return mono float32 arrays.
New voices vs audio-common/voices.mjs: saturated 808 with glide, log drum, layered snap, kalimba,
anchor bell (exact partials of anchor-voice.mjs), detuned-saw lead/stab (HP 300), risers, reverse swell, hit-stop, glass chime,
kick-sidechain envelope generator. Deterministic (seeded)."""
import numpy as np
from scipy import signal as sg

SR = 48000
NS = 2_304_000  # 24 bars
BEAT = 24000
S16 = 6000
rng = np.random.default_rng(20261001)


def mtof(m):
    return 440.0 * 2 ** ((np.asarray(m, float) - 69) / 12)


def tarr(n):
    return np.arange(n) / SR


def sos_f(kind, f, x, order=2, f2=None):
    f = float(np.clip(f, 20, SR / 2 - 200))
    if kind == 'bp':
        s = sg.butter(order, [f, min(f2, SR / 2 - 200)], 'bandpass', fs=SR, output='sos')
    else:
        s = sg.butter(order, f, kind, fs=SR, output='sos')
    return sg.sosfilt(s, x)


def hp(x, f, o=2): return sos_f('highpass', f, x, o)
def lp(x, f, o=2): return sos_f('lowpass', f, x, o)
def bp(x, f1, f2, o=2): return sos_f('bp', f1, x, o, f2)


def sat(x, d): return np.tanh(d * x) / np.tanh(d)


def exp_env(n, tau, attack=0.001):
    t = tarr(n)
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / tau)


def fade_tail(x, ms=8):
    n = min(len(x), int(SR * ms / 1000))
    if n > 0:
        x = x.copy(); x[-n:] *= np.linspace(1, 0, n)
    return x


def noise(n): return rng.standard_normal(n).astype(np.float64)


def norm_peak(x, p=1.0):
    m = np.max(np.abs(x)) + 1e-12
    return x / m * p


# ---------------------------------------------------------------- drums / bass
def kick(vel=1.0, dur=0.30):
    n = int(SR * dur); t = tarr(n)
    f = 52 + 150 * np.exp(-t / 0.018)            # fast pitch drop, body settles at 52 Hz
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.11)
    body = sat(body * 1.8, 1.6) * 0.8
    click = hp(noise(n), 2500) * np.exp(-t / 0.004) * 0.55
    thump = np.sin(2 * np.pi * 1400 * t) * np.exp(-t / 0.0025) * 0.35
    x = (body + click + thump) * np.minimum(1, t / 0.0006)
    return fade_tail(x, 10) * vel


def snap(vel=1.0):
    n = int(SR * 0.09); t = tarr(n)
    x = bp(noise(n), 1800, 7500) * np.exp(-t / 0.018)
    x += np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.006) * 0.4
    return fade_tail(x * 1.4 * vel, 4)


def clap(vel=1.0):
    n = int(SR * 0.28); t = tarr(n)
    nz = bp(noise(n), 900, 5500)
    e = np.zeros(n)
    for off, a in [(0, .8), (.009, .7), (.019, .9)]:
        i = int(off * SR); e[i:] += a * np.exp(-tarr(n - i) / 0.006)
    e += 0.7 * np.exp(-t / 0.07) * (t > 0.025)
    x = nz * e
    s = snap(0.6); x[:len(s)] += s
    return fade_tail(x * 0.9 * vel, 12)


def hat(vel=1.0, open_=False):
    n = int(SR * (0.2 if open_ else 0.045)); t = tarr(n)
    x = hp(noise(n), 5500) * np.exp(-t / (0.07 if open_ else 0.012))
    x = x + 0.6 * bp(noise(n), 2400, 5200) * np.exp(-t / (0.05 if open_ else 0.008))
    return fade_tail(x * 0.55 * vel, 3)


def shaker(vel=1.0):
    n = int(SR * 0.05); t = tarr(n)
    x = bp(noise(n), 2600, 6500) * np.minimum(1, t / 0.004) * np.exp(-t / 0.014)
    return fade_tail(x * 0.8 * vel, 3)


def rim(vel=1.0):
    n = int(SR * 0.05); t = tarr(n)
    x = (np.sin(2 * np.pi * 1750 * t) + 0.6 * np.sin(2 * np.pi * 2650 * t)) * np.exp(-t / 0.008)
    x += hp(noise(n), 3000) * np.exp(-t / 0.003) * 0.4
    return fade_tail(x * 0.6 * vel, 3)


def bass808(f0, dur=0.5, glide_to=None, vel=1.0, drive=5.0):
    """Saturated 808: sine body + glide + tanh drive (adds 2nd/3rd harmonics that survive phone speakers)."""
    n = int(SR * dur); t = tarr(n)
    f = np.full(n, float(f0))
    f = f * (1 + 0.5 * np.exp(-t / 0.012))                # tiny pitch punch at the head
    if glide_to:
        g = np.clip((t - dur * 0.35) / (dur * 0.25), 0, 1)  # glide late in the note
        f = f * (glide_to / f0) ** g
    ph = 2 * np.pi * np.cumsum(f) / SR
    e = np.minimum(1, t / 0.003) * np.exp(-t / (dur * 0.55)) * np.minimum(1, (dur - t) / 0.04)
    x = np.sin(ph) + 0.25 * np.sin(2 * ph + 0.4)
    x = sat(x * e * 1.2, drive) * e ** 0.25
    x = hp(x, 32)
    return x * vel * 0.9


def logdrum(f0, vel=1.0, dur=0.3):
    n = int(SR * dur); t = tarr(n)
    f = f0 * (1 + 0.55 * np.exp(-t / 0.03))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.18 * np.sin(3 * ph)
    x = x * exp_env(n, 0.075, 0.001)
    x += lp(noise(n), 1800) * np.exp(-t / 0.006) * 0.25
    x = sat(x * 1.3, 1.5)
    return fade_tail(x * 0.75 * vel, 10)


# ---------------------------------------------------------------- melodic
def kalimba(freq, vel=1.0, dur=0.7):
    """Part 2 swap for the anchor pluck layer: tine with inharmonic 1/3.98/9.4 partials + thumb click."""
    n = int(SR * dur); t = tarr(n)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.35)
    x += 0.85 * np.sin(2 * np.pi * freq * 3.98 * t) * np.exp(-t / 0.12)
    x += 0.55 * np.sin(2 * np.pi * freq * 6.2 * t) * np.exp(-t / 0.06)
    x += 0.3 * np.sin(2 * np.pi * freq * 9.4 * t) * np.exp(-t / 0.04)
    x += 0.30 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.2)
    x += bp(noise(n), 2500, 6000) * np.exp(-t / 0.006) * 0.5
    x *= np.minimum(1, t / 0.0015)
    x = hp(x, 250)
    return fade_tail(x * 0.8 * vel, 10)


def anchor_bell(freq, dur=1.2, vel=1.0):
    """Exact partial table of audio-social/v2/anchor-voice.mjs anchorBell."""
    n = int(SR * dur); t = tarr(n); o = np.zeros(n)
    for r, a, tau in [(1, 1, .7), (2.76, .35, .4), (5.4, .16, .2), (8.93, .06, .1)]:
        o += np.sin(2 * np.pi * freq * r * t) * a * np.exp(-t / (tau * (dur / 1.2 + 0.4)))
    return fade_tail(o * np.minimum(1, t / 0.001) * vel, 20)


def anchor_note(midi, vel=1.0, dur=0.5, bell=0.35):
    f = float(mtof(midi))
    p = kalimba(f, vel, max(dur, 0.35))
    b = anchor_bell(f, max(dur, 0.6), vel * bell)
    n = max(len(p), len(b)); o = np.zeros(n); o[:len(p)] += p; o[:len(b)] += b
    return o


def saw_add(freq, n, detune_c=(0,), phase_seed=0, maxf=9000):
    t = tarr(n); o = np.zeros(n)
    for k, c in enumerate(detune_c):
        f = freq * 2 ** (c / 1200)
        nh = int(min(maxf, SR / 2 - 500) // f)
        ph0 = (k * 0.37 + phase_seed * 0.11) * 2 * np.pi
        for h in range(1, nh + 1):
            o += np.sin(2 * np.pi * f * h * t + ph0 * h) / h
    return o / len(detune_c) * 0.6


def saw_stab(midis, dur=0.35, vel=1.0, lp_hi=7500, lp_lo=1800, atk=0.004, tau=0.16, widen=True):
    n = int(SR * dur)
    tt = tarr(n)
    L = np.zeros(n); R = np.zeros(n)
    for m in midis:
        f = float(mtof(m))
        L += saw_add(f, n, (-9, 0, 8), 1)
        R += saw_add(f, n, (-8, 6, 11), 2) if widen else L * 0
    if not widen: R = L.copy()
    outs = []
    for x in (L, R):
        # filter sweep: block-wise LP with decaying cutoff
        y = np.zeros(n); zi = None; B = 512
        for i in range(0, n, B):
            fc = lp_lo + (lp_hi - lp_lo) * np.exp(-(i / SR) / 0.09)
            s = sg.butter(2, min(fc, 12000), 'lowpass', fs=SR, output='sos')
            if zi is None or zi.shape[0] != s.shape[0]: zi = np.zeros((s.shape[0], 2))
            y[i:i + B], zi = sg.sosfilt(s, x[i:i + B], zi=zi)
        y = hp(y, 300)
        e = np.minimum(1, tt / atk) * np.exp(-tt / tau) * np.minimum(1, (dur - tt) / 0.03)
        outs.append(sat(y * e * 0.8, 1.3) * vel * 0.8)
    return np.stack(outs, 1)


def pad(midis, dur, vel=1.0, atk=0.35):
    n = int(SR * dur); tt = tarr(n)
    outs = []
    for side in (0, 1):
        x = np.zeros(n)
        for m in midis:
            x += saw_add(float(mtof(m)), n, (-12 + 3 * side, 7 - 2 * side), side + 3, maxf=3500)
        x = lp(x, 1800); x = hp(x, 260)
        e = np.minimum(1, tt / atk) * np.minimum(1, np.maximum(0, (dur - tt) / 0.3))
        outs.append(x * e * 0.25 * vel)
    return np.stack(outs, 1)


# ---------------------------------------------------------------- sweeps, risers, swells
def sweep_noise(dur, f_start, f_end, q_bw=0.7, shape='up', vel=1.0):
    """Block-filtered noise whose band centre moves f_start->f_end (log). shape 'whoosh' = up then down."""
    n = int(SR * dur); x = noise(n); y = np.zeros(n); B = 256
    zi = None
    for i in range(0, n, B):
        p = i / max(n - 1, 1)
        if shape == 'whoosh':
            pp = np.sin(np.pi * p) ** 1.2
            fc = f_start * (f_end / f_start) ** pp
        else:
            fc = f_start * (f_end / f_start) ** p
        lo, hi = fc * (1 - q_bw / 2), fc * (1 + q_bw)
        s = sg.butter(2, [max(lo, 120), min(hi, SR / 2 - 300)], 'bandpass', fs=SR, output='sos')
        if zi is None: zi = np.zeros((s.shape[0], 2))
        y[i:i + B], zi = sg.sosfilt(s, x[i:i + B], zi=zi)
    p = np.arange(n) / n
    if shape == 'whoosh':
        env = np.sin(np.pi * p) ** 1.5
    else:
        env = p ** 1.6
    return y * env * vel * 3.0


def whoosh(dur=0.25, vel=1.0, f1=1500, f2=7000):
    return fade_tail(sweep_noise(dur, f1, f2, 0.9, 'whoosh', vel), 6)


def tonal_riser(dur, midis, vel=1.0, start_oct=-12, lo_cut=500):
    """Bright tonal riser: detuned saws gliding up an octave from chord tones + HP, amplitude ramp."""
    n = int(SR * dur); t = tarr(n); p = t / dur
    outs = []
    for side in (0, 1):
        x = np.zeros(n)
        for m in midis:
            fbase = float(mtof(m + start_oct))
            f = fbase * 2 ** (p * (-start_oct) / 12 * 1.0)
            for c in (-8 + 4 * side, 9 - 3 * side):
                ph = 2 * np.pi * np.cumsum(f * 2 ** (c / 1200)) / SR
                for h in range(1, 7):
                    x += np.sin(h * ph) / h * (f * h < 9000)
        x = hp(x, lo_cut)
        outs.append(x * (p ** 1.5) * 0.12 * vel)
    return np.stack(outs, 1)


def noise_riser(dur, vel=1.0, f1=800, f2=9000):
    return sweep_noise(dur, f1, f2, 1.2, 'up', vel) * 0.9


def rev_swell(dur, midis, vel=1.0):
    """Reverse swell: decaying chord+noise reversed (audible air for the pre-gold hush, never silence)."""
    n = int(SR * dur); tt = tarr(n)
    x = np.zeros(n)
    for m in midis:
        x += np.sin(2 * np.pi * float(mtof(m)) * tt + rng.uniform(0, 6)) * 0.25
        x += np.sin(2 * np.pi * float(mtof(m)) * 2.003 * tt) * 0.1
    x += hp(noise(n), 3000) * 0.2
    x = x * np.exp(-tt / (dur * 0.5))
    x = hp(x[::-1].copy(), 220)
    return x * vel


def reverse_crash(dur=1.0, vel=1.0):
    n = int(SR * dur); t = tarr(n)
    x = hp(noise(n), 3500) * np.exp(-t / (dur * 0.35))
    x += hp(noise(n), 6000) * np.exp(-t / (dur * 0.2)) * 0.5
    x = x[::-1].copy()
    return x * vel * 0.9


def impact(vel=1.0, dur=0.9):
    """Sub-free (SFX bus HP 120): body 120-300 Hz boom + mid thud + air burst."""
    n = int(SR * dur); t = tarr(n)
    f = 130 + 120 * np.exp(-t / 0.05)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    x += lp(noise(n), 3500) * np.exp(-t / 0.12) * 0.7
    x += hp(noise(n), 3000) * np.exp(-t / 0.05) * 0.5
    x = hp(x, 120)
    return fade_tail(sat(x, 1.3) * vel * 0.9, 20)


def paper_slap(vel=1.0):
    """2-4 kHz stamp slap."""
    n = int(SR * 0.12); t = tarr(n)
    x = bp(noise(n), 1800, 5200) * np.exp(-t / 0.02)
    x += hp(noise(n), 2500) * np.exp(-t / 0.006) * 0.6
    x += np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.004) * 0.3
    return fade_tail(x * 1.1 * vel, 5)


def hitstop(vel=1.0):
    """Tape-stop click for a 2-frame freeze (67 ms): pitch-down blip + click."""
    n = int(SR * 0.09); t = tarr(n)
    f = 1100 * np.exp(-t / 0.03) + 180
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035) * 0.8
    x += hp(noise(n), 2000) * np.exp(-t / 0.002)
    return fade_tail(x * vel * 0.8, 6)


def glass_chime(midi=84, dur=2.0, vel=1.0):
    """Single big C-major glass chime (C6 + E6 shimmer), no sub."""
    f = float(mtof(midi)); n = int(SR * dur); t = tarr(n); x = np.zeros(n)
    for r, a, tau in [(1, 1, .9), (2.76, .35, .5), (5.4, .16, .25), (1.2599, .5, .8), (2.0, .3, .7)]:
        x += np.sin(2 * np.pi * f * r * t) * a * np.exp(-t / tau)
    return fade_tail(x * np.minimum(1, t / 0.001) * vel * 0.5, 40)


def type_click(midi, vel=1.0):
    n = int(SR * 0.05); t = tarr(n)
    x = np.sin(2 * np.pi * float(mtof(midi)) * t) * np.exp(-t / 0.012) * 0.5
    x += hp(noise(n), 3500) * np.exp(-t / 0.003) * 0.6
    return fade_tail(x * vel, 3)


def snare_roll_hit(vel=1.0):
    n = int(SR * 0.12); t = tarr(n)
    x = bp(noise(n), 1500, 7000) * np.exp(-t / 0.035) + np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.03) * 0.5
    return fade_tail(sat(x, 1.4) * vel, 5)


# ---------------------------------------------------------------- reverb / stereo / buses
def make_ir(decay=0.7, wet_len=1.2, seed=7):
    r = np.random.default_rng(seed)
    n = int(SR * wet_len); t = tarr(n)
    L = r.standard_normal(n) * np.exp(-t / (decay / 3)); R = r.standard_normal(n) * np.exp(-t / (decay / 3))
    L = lp(L, 7000); R = lp(R, 7000)
    return L / np.sqrt((L ** 2).sum()), R / np.sqrt((R ** 2).sum())


IR = make_ir()


class Bus:
    def __init__(self, n=NS + SR * 3):
        self.n = n
        self.a = np.zeros((n, 2), np.float32)

    def add(self, x, start, gain=1.0, pan=0.0):
        """x mono (n,) or stereo (n,2); start in samples; gain linear; pan -1..1 (constant power for mono)."""
        start = int(round(start))
        if start >= self.n: return
        if x.ndim == 1:
            th = (pan + 1) * np.pi / 4
            x = np.stack([x * np.cos(th) * np.sqrt(2), x * np.sin(th) * np.sqrt(2)], 1)
        end = min(self.n, start + len(x))
        if end <= start: return
        self.a[start:end] += (x[:end - start] * gain).astype(np.float32)

    def reverb_send(self, ir=IR, wet=0.2):
        out = np.stack([sg.fftconvolve(self.a[:, 0], ir[0])[:self.n], sg.fftconvolve(self.a[:, 1], ir[1])[:self.n]], 1)
        return out * wet


def db(x): return 10 ** (x / 20)


def sidechain_env(times, depth_db=6.0, rel=0.110, atk=0.004, n=NS + SR * 3):
    """Gain curve (linear, <=1) ducking by depth_db at each trigger time (samples), recovering over rel seconds."""
    g = np.ones(n)
    for ts in times:
        i = int(ts)
        L = int((atk + rel * 5) * SR)
        t = np.arange(min(L, n - i)) / SR
        d = np.where(t < atk, t / atk, np.exp(-(t - atk) / rel))
        c = 1 - (1 - db(-depth_db)) * d
        g[i:i + len(t)] = np.minimum(g[i:i + len(t)], c)
    return g
