#!/usr/bin/env python3
"""Stage 3 social audio (49.3 s, 1479 f @30). Run from anywhere: python3 build_stage3.py
Rebuilds music from audio-B/B_music_v5.wav (3 slices, 1-beat equal-power crossfades on the grid), re-places the
audio-B v5 SFX cues with the time map, adds the new Stage 3 cues, masters with the audio-B chain. Reads audio-B, writes only here."""
import json, shutil, subprocess, sys, csv, os
import numpy as np, soundfile as sf
from scipy import signal

ROOT = "/Users/adityasingh/anchors video"
B = f"{ROOT}/audio-B"
OUT = f"{ROOT}/audio-social/stage3"
SR = 48000
FPS = 30
BEAT = 60 / 112
NFR = 1479
N = NFR * SR // FPS            # 2,366,400
GRID_N = round(92 * BEAT * SR) # 2,365,714
rng = np.random.default_rng(3)
MUSIC_GAIN, SFX_GAIN = 0.75, 0.85

def rd(p):
    x, sr = sf.read(p, dtype="float64", always_2d=True)
    assert sr == SR
    return x if x.shape[1] == 2 else np.repeat(x, 2, 1)
def wr(p, x, sub="PCM_24"):
    sf.write(p, np.clip(x, -1, 1), SR, subtype=sub)
def S(t): return int(round(t * SR))

# ---------------- music ----------------
M = rd(f"{B}/B_music_v5.wav")
def seg(b0, b1): return M[S(b0 * BEAT):S(b1 * BEAT)]   # src beats
def eqp(n):
    x = np.linspace(0, np.pi / 2, n)
    return np.cos(x)[:, None], np.sin(x)[:, None]
music = np.zeros((N, 2))
# out beat 0-4 = src beats 0-4 (A); out 4-16 = src 12-24 (B); out 16-92 = src 36-112 (C)
A = seg(0, 4); Bs = seg(12, 24); C = seg(36, 112)
music[:len(A)] = A
o = S(4 * BEAT); music[o:o + len(Bs)] = Bs
o2 = S(16 * BEAT); music[o2:o2 + len(C)] = C
XF = S(BEAT)
fo, fi = eqp(XF)
# splice 1 (out beat 4): last beat of A is silent (hard black); B pre-roll (src beats 11-12) fades in over it
pre = M[S(11 * BEAT):S(12 * BEAT)]
music[o - XF:o] = music[o - XF:o] * fo + pre[:XF] * fi
# splice 2 (out beat 16): B continues (src 23-24 already placed) crossfades to C pre-roll (src 35-36)
pre2 = M[S(35 * BEAT):S(36 * BEAT)]
music[o2 - XF:o2] = music[o2 - XF:o2] * fo + pre2[:XF] * fi

# ---------------- new SFX synthesis ----------------
def env_exp(n, tau): return np.exp(-np.arange(n) / SR / tau)
def bands_noise(n, f_of_t, width=0.7, amp=None, lo=150, hi=12000, nb=16, seed=0):
    """time-varying band-pass noise by a moving gaussian over a log-spaced filterbank"""
    r = np.random.default_rng(seed)
    t = np.arange(n) / n
    fs = np.exp(np.linspace(np.log(lo), np.log(hi), nb))
    y = np.zeros(n)
    f_t = f_of_t(t)
    for fc in fs:
        w = np.exp(-((np.log2(fc) - np.log2(f_t)) ** 2) / (2 * width ** 2))
        sos = signal.butter(2, [fc / 1.25, min(fc * 1.25, SR * 0.45)], "band", fs=SR, output="sos")
        y += signal.sosfilt(sos, r.standard_normal(n)) * w
    return y / (np.max(np.abs(y)) + 1e-9)
def fade_edges(x, a=0.0005, b=0.002):
    x = x.copy(); na, nb_ = S(a), S(b)
    if na: x[:na] *= np.linspace(0, 1, na)[:, None] if x.ndim == 2 else np.linspace(0, 1, na)
    if nb_: x[-nb_:] *= np.linspace(1, 0, nb_)[:, None] if x.ndim == 2 else np.linspace(1, 0, nb_)
    return x
def stereo(l, r): return np.stack([l, r], 1)

def make_thud():
    n = S(0.32); t = np.arange(n) / SR
    f = 38 + 62 * np.exp(-t / 0.035)                 # 100 Hz -> 38 Hz drop
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * env_exp(n, 0.11)
    body = np.sin(2 * ph) * env_exp(n, 0.05) * 0.5     # 76-200 Hz, phone-speaker audible
    body = np.tanh(2.2 * (sub + body)) / np.tanh(2.2)
    click = signal.sosfilt(signal.butter(2, [1800, 6500], "band", fs=SR, output="sos"), rng.standard_normal(n)) * env_exp(n, 0.006) * 0.55
    y = 0.9 * body + click
    y = fade_edges(y, 0.0003, 0.02)
    return stereo(y, y) * 0.95
def make_tapeclick(frames):
    L = frames / FPS; n = S(L + 0.03); t = np.arange(n) / SR
    f = 1800 * np.exp(-t / (L * 0.45)) + 180                     # tape-stop glide
    ph = 2 * np.pi * np.cumsum(f) / SR
    g = np.sin(ph) * 0.35 * np.minimum(1, t / 0.004) * np.exp(-t / (L * 0.55))
    n0 = S(0.012)
    tick = np.zeros(n); tick[:n0] = signal.sosfilt(signal.butter(2, [2200, 7000], "band", fs=SR, output="sos"), rng.standard_normal(n0)) * np.exp(-np.arange(n0) / SR / 0.003)
    thock = np.sin(2 * np.pi * 130 * t) * np.exp(-t / 0.03) * 0.6
    snap = np.zeros(n); k = S(L); m = min(S(0.01), n - k)       # release snap when the freeze ends
    snap[k:k + m] = signal.sosfilt(signal.butter(2, [3000, 9000], "band", fs=SR, output="sos"), rng.standard_normal(m)) * np.exp(-np.arange(m) / SR / 0.002) * 0.6
    y = g + tick + thock + snap
    y = fade_edges(y, 0.0003, 0.01)
    return stereo(y, y * 0.96)
def make_riser(dur):
    n = S(dur); t = np.arange(n) / n
    f = lambda u: 250 * (9000 / 250) ** (u ** 1.3)
    nl = bands_noise(n, f, 0.65, seed=1); nr = bands_noise(n, f, 0.65, seed=2)
    glide = np.sin(2 * np.pi * np.cumsum(180 * (1600 / 180) ** (t ** 1.6)) / SR) * 0.10
    sub = np.sin(2 * np.pi * np.cumsum(55 + 55 * t ** 2) / SR) * 0.10
    amp = (0.08 + 0.92 * t ** 2.2)
    tail = np.ones(n); k = S(0.05); tail[-k:] = np.linspace(1, 0, k)   # clean 50 ms gap before the whip
    l = (nl * 0.85 + glide + sub) * amp * tail; r = (nr * 0.85 + glide + sub) * amp * tail
    return fade_edges(stereo(l, r), 0.004, 0.0) * 0.75
def make_inhale(dur=0.34):
    n = S(dur); t = np.arange(n) / n
    f = lambda u: 1500 * (9500 / 1500) ** u
    nl = bands_noise(n, f, 0.9, lo=800, hi=12000, seed=5); nr = bands_noise(n, f, 0.9, lo=800, hi=12000, seed=6)
    a = t ** 2.6
    air = np.sin(2 * np.pi * np.cumsum(400 * (2 ** (t * 1.0))) / SR) * 0.06
    y = stereo((nl + air) * a, (nr + air) * a)
    return fade_edges(y, 0.0, 0.012) * 0.8

def save_new(name, x): wr(f"{OUT}/sfx/{name}", x); return f"sfx/{name}"
new = {
    "thud": save_new("s3-f0-thud.wav", make_thud()),
    "tc5": save_new("s3-hitstop-tape-5f.wav", make_tapeclick(5)),
    "tc6": save_new("s3-hitstop-tape-6f.wav", make_tapeclick(6)),
    "riser": save_new("s3-riser-bar.wav", make_riser(2 * BEAT * 2 - 0.01)),
    "inhale": save_new("s3-loop-inhale.wav", make_inhale()),
}

# ---------------- SFX cue map ----------------
cues_src = json.load(open(f"{B}/sfx-cues.json"))
OFF_B, OFF_C = 12 * BEAT - 4 * BEAT, 36 * BEAT - 16 * BEAT   # 4.2857, 10.7143
def map_time(t):
    if t < 2.14: return t, "A"
    if abs(t - 2.143) < 0.005: return 4 * BEAT, "A"          # source sub hit copy on the splice bar line
    if 6.4 <= t < 12.857: return t - OFF_B, "B"
    if t >= 19.0: return t - OFF_C, "C"
    return None, None
src_sfx_dir = f"{OUT}/sfx"
cues = []
for c in cues_src:
    if c.get("time", 0) < 6.4 and c["time"] > 2.2: continue
    tt, part = map_time(c["time"])
    if tt is None: continue
    name = os.path.basename(c["file"])
    if not os.path.exists(f"{src_sfx_dir}/{name}"): shutil.copy(f"{B}/{c['file']}", f"{src_sfx_dir}/{name}")
    if name in ('logo-hit-short.wav','glass-tail.wav'): tt += (45.0 - 0.0967) - (55.68 - OFF_C)   # logo wav has a 97 ms pre-ramp: put its audible onset on beat 84 / f1350 (-63 ms vs the v5 source cue)
    cues.append(dict(file=f"sfx/{name}", time=tt, volume=c["volume"], pan=c["pan"], src=c["time"], part=part, kind="mapped"))
TIER1 = ("lock-glass", "low-impact", "smash-hit", "sub-hit", "title-thump", "counter-ramp", "bubble-whoosh", "riser", "logo-hit", "glass-tail")
def tier(f): return "T1" if any(k in f for k in TIER1) else "T2"
# new cues
def add(key, t, vol, pan, why, tr="T1"):
    cues.append(dict(file=new[key], time=t, volume=vol, pan=pan, src=None, part="new", kind="new", why=why, tier=tr))
add("thud", 0.0, 0.95, 0.0, "NEW frame-0 thud (sub 100>38 Hz + 2-6 kHz click) under the 2,80,000 freeze")
cues.append(dict(file="sfx/lock-glass.wav", time=0.0, volume=0.5, pan=0.0, src=None, part="new", kind="new", why="NEW glass tick on frame 0 (reuse lock-glass)", tier="T1"))
shutil.copy(f"{B}/sfx/lock-glass.wav", f"{src_sfx_dir}/lock-glass.wav") if not os.path.exists(f"{src_sfx_dir}/lock-glass.wav") else None
T_LOCK1, T_LOCK2 = 177 / FPS, 418 / FPS
T_LOCK1, T_LOCK2 = 11 * BEAT, 26 * BEAT        # 5.893 / 13.929 (grid; f176.8 / f417.9)
add("tc5", T_LOCK1, 0.55, 0.0, "NEW hit-stop tape click, 5f freeze at 1,85,700 lock (f177-181); music ducks -6 dB for the freeze")
add("tc6", T_LOCK2, 0.6, 0.0, "NEW hit-stop tape click, 6f freeze at 2,80,000 lock (f418-423); music ducks -6 dB for the freeze")
add("riser", 4 * BEAT + 0.0, 0.5, 0.0, "NEW 1-bar filter-sweep riser before the dip (out beats 12-16), resolves into the whip")
cues[-1]["time"] = 12 * BEAT
add("inhale", 92 * BEAT - 0.34 - 0.06, 0.6, 0.0, "NEW loop bridge: reversed-cymbal swell + air inhale into the frame-0 thud")
HOPS = [10, 13, 15, 28, 30, 32, 34, 53, 56, 58, 63, 67, 83]   # 9:16 crop hops (plan section 7: S3 x3, S5 x4, S8 x3, S9 x2, S10 x1)
hop_cues = []
shutil.copy(f"{B}/sfx/tile-tick.wav", f"{src_sfx_dir}/tile-tick.wav") if not os.path.exists(f"{src_sfx_dir}/tile-tick.wav") else None
for i, b in enumerate(HOPS):
    hop_cues.append(dict(file="sfx/tile-tick.wav", time=b * BEAT, volume=0.35 * 10 ** (-2 / 20), pan=0.15 if i % 2 == 0 else -0.15,
                         src=None, part="new", kind="hop", why=f"NEW 9:16 crop-hop tick, beat {b} (-2 dB under T2, pan alternating)", tier="T2"))

# ---------------- render ----------------
DUCK = [(("impact", "logo-hit", "digit-roll"), -4, 0.6, 0.8),
        (("chime", "cymbal", "coin", "pay-click", "lock-glass", "s3-riser"), -3.5, 0.5, 0.6),
        (("bright-stab", "enter-thock", "live-ping", "counter-ramp"), -2.5, 0.2, 0.4),
        (("s3-f0-thud",), -3, 0.25, 0.3)]
def duck_curve(cs):
    g = np.ones(N)
    for c in cs:
        for keys, db, hold, rel in DUCK:
            if any(k in c["file"] for k in keys):
                a, h, r, atk = S(c["time"] - 0.03), S(c["time"] + hold), S(rel), S(0.03)
                for i in range(max(0, a), min(N, h + r)):
                    pass
                idx = np.arange(max(0, a), min(N, h + r))
                w = np.where(idx < a + atk, (idx - a) / atk, np.where(idx < h, 1.0, 1 - (idx - h) / r))
                g[idx] = np.minimum(g[idx], 1 - (1 - 10 ** (db / 20)) * w)
                break
    # hit-stop freezes: -6 dB for the freeze length, 3 ms attack, snap back
    for t0, fr in ((T_LOCK1, 5), (T_LOCK2, 6)):
        a, b = S(t0), S(t0 + fr / FPS); at = S(0.003); rl = S(0.008)
        idx = np.arange(a, b + rl); w = np.where(idx < a + at, (idx - a) / at, np.where(idx < b, 1.0, 1 - (idx - b) / rl))
        g[idx] = np.minimum(g[idx], 1 - (1 - 10 ** (-6 / 20)) * w)
    return g
def render(cs):
    duck = duck_curve(cs)
    m = music * MUSIC_GAIN * duck[:, None]
    s = np.zeros((N, 2)); cache = {}
    for c in cs:
        w = cache.setdefault(c["file"], rd(f"{OUT}/{c['file']}"))
        end_cut = S(8 * BEAT * 2) if False else None
        gl = c["volume"] * (1 - c["pan"] if c["pan"] > 0 else 1); gr = c["volume"] * (1 + c["pan"] if c["pan"] < 0 else 1)
        x = w.copy()
        if c["part"] == "B":   # keep B-slice tails from bleeding past the splice at out beat 16 (30 ms fade)
            room = S(16 * BEAT) - S(c["time"])
            if room < len(x):
                k = min(S(0.03), room); x = x[:room].copy(); x[-k:] *= np.linspace(1, 0, k)[:, None]
        s0 = S(c["time"]); e = min(N, s0 + len(x))
        s[s0:e] += x[:e - s0] * np.array([gl, gr]) * SFX_GAIN
    return m, s
def master_chain(pre, G, limit):
    """mirror of audio-B: volume, tanh soft clip, alimiter; via ffmpeg"""
    pre_p = f"{SCR}/pre.wav"; out_p = f"{SCR}/mast.wav"
    sf.write(pre_p, pre, SR, subtype="PCM_24")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", pre_p, "-af",
                    f"volume={G}dB,asoftclip=type=tanh:threshold=1.0,alimiter=limit={limit}:attack=5:release=80:level=disabled",
                    "-ar", "48000", "-c:a", "pcm_f32le", out_p], check=True)
    y, _ = sf.read(out_p, dtype="float64", always_2d=True)
    return y[:N] if len(y) >= N else np.pad(y, ((0, N - len(y)), (0, 0)))
def meas(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    i = [l for l in r.splitlines() if l.strip().startswith("I:")][-1].split()[1]
    p = [l for l in r.splitlines() if l.strip().startswith("Peak:")][-1].split()[1]
    return float(i), float(p)
SCR = "/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/audio3"
os.makedirs(SCR, exist_ok=True)

def loop_fade(y):
    y = y.copy(); k = S(0.05); y[-k:] *= np.cos(np.linspace(0, np.pi / 2, k))[:, None] ** 2
    return y
def build(cs, name, G=None, limit=0.811107):
    m, s = render(cs)
    pre = m + s; pk = np.max(np.abs(pre)); g0 = 0.9 / pk if pk > 0.9 else 1.0
    pre *= g0
    if G is None:
        G = 4.2
        for _ in range(6):
            y = loop_fade(master_chain(pre, G, limit)); wr(f"{SCR}/t.wav", y)
            l, p = meas(f"{SCR}/t.wav")
            print(f"  {name}: G={G:.2f} limit={limit:.4f} -> {l} LUFS, {p} dBTP")
            dl = -14.0 - l
            if abs(dl) < 0.08 and p <= -1.6: break
            G += dl * 0.9
            if p > -1.6 and abs(dl) < 0.15: limit *= 10 ** ((-1.65 - p) / 20)
    y = loop_fade(master_chain(pre, G, limit))
    return y, m * g0, s * g0, G, limit, g0

all_cues = sorted(cues, key=lambda c: c["time"])
hop_all = sorted(cues + hop_cues, key=lambda c: c["time"])
y, mp, sp, G, limit, g0 = build(hop_all, "mix")
wr(f"{OUT}/Stage3_mix.wav", y)
yn, _, _, Gn, limn, _ = build(all_cues, "noticks", G, limit)
wr(f"{OUT}/Stage3_mix_noticks.wav", yn)
wr(f"{OUT}/Stage3_music_49s.wav", mp)
_, _, sp2, *_ = (None, None, render(hop_all)[1] * g0)
wr(f"{OUT}/Stage3_sfx_49s.wav", sp2)
json.dump(dict(G=G, limit=limit, premix_scale=g0), open(f"{OUT}/Stage3_master.json", "w"))
json.dump(hop_all, open(f"{OUT}/Stage3_cues.json", "w"), indent=1)
print("done G", G, "limit", limit)
