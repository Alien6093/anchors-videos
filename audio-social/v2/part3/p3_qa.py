#!/usr/bin/env python3
"""Measurement helpers: BS.1770 K-weighting LUFS (own implementation, cross-checked against ffmpeg), band shares, phone sim,
hit levels, loop seam, and ffmpeg ebur128 + true peak on encoded files."""
import re, subprocess
import numpy as np
from scipy import signal
import soundfile as sf

SR = 48000
BANDS = [("sub<60", 0, 60), ("60-250", 60, 250), ("250-800", 250, 800), ("0.8-2k", 800, 2000), ("2-5k", 2000, 5000), (">5k", 5000, 24000)]
_K1 = (np.array([1.53512485958697, -2.69169618940638, 1.19839281085285]), np.array([1.0, -1.69065929318241, 0.73248077421585]))
_K2 = (np.array([1.0, -2.0, 1.0]), np.array([1.0, -1.99004745483398, 0.99007225036621]))


def kw(x):
    y = signal.lfilter(*_K1, x, axis=0)
    return signal.lfilter(*_K2, y, axis=0)


def _ms_blocks(xk, win, hop):
    n = (len(xk) - win) // hop + 1
    idx = np.arange(n)[:, None] * hop + np.arange(win)[None, :]
    return np.mean(xk[idx] ** 2, axis=1) if xk.ndim == 1 else None


def block_loudness(x, win_s, hop_s):
    xk = kw(x)
    win, hop = int(win_s * SR), int(hop_s * SR)
    ms = sum(_ms_blocks(xk[:, c], win, hop) for c in range(xk.shape[1]))
    return -0.691 + 10 * np.log10(ms + 1e-14)


def lufs(x):
    l = block_loudness(x, 0.4, 0.1)
    l1 = l[l > -70]
    ms = np.mean(10 ** ((l1 + 0.691) / 10))
    rel = -0.691 + 10 * np.log10(ms) - 10
    l2 = l[l > rel]
    return -0.691 + 10 * np.log10(np.mean(10 ** ((l2 + 0.691) / 10)))


def short_term(x):
    return block_loudness(x, 3.0, 1.0)


def phone(x):
    y = signal.sosfilt(signal.butter(2, 250, "high", fs=SR, output="sos"), x, axis=0)
    return signal.sosfilt(signal.butter(2, 8000, "low", fs=SR, output="sos"), y, axis=0)


def band_shares(x, t0=None, t1=None):
    m = x.mean(1) if x.ndim == 2 else x
    if t0 is not None:
        m = m[int(t0 * SR):int(t1 * SR)]
    f, p = signal.welch(m, SR, nperseg=8192, noverlap=4096)
    tot = p.sum()
    return {n: 100 * p[(f >= a) & (f < b)].sum() / tot for n, a, b in BANDS}


def crest(x):
    m = x.mean(1)
    return 20 * np.log10(np.max(np.abs(m)) / np.sqrt(np.mean(m ** 2)))


def hit_levels(x, times, win=0.1):
    """phone-band K-weighted 100 ms level around each hit (0-350 ms after) minus phone-band programme loudness."""
    p = phone(x)
    prog = lufs(p)
    xk = kw(p)
    n = int(win * SR)
    ms = np.sum([np.convolve(xk[:, c] ** 2, np.ones(n) / n, mode="same") for c in range(2)], axis=0)
    lv = -0.691 + 10 * np.log10(ms + 1e-14)
    out = []
    for t in times:
        s, e = int(t * SR), int((t + 0.35) * SR)
        out.append(float(lv[s:e].max() - prog))
    return out, prog


def ff_measure(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    t = r.stderr
    tail = t[t.rindex("Summary:"):]
    g = lambda pat: float(re.search(pat, tail).group(1))
    return {"I": g(r"I:\s+(-?[\d.]+) LUFS"), "LRA": g(r"LRA:\s+(-?[\d.]+) LU"), "TP": g(r"Peak:\s+(-?[\d.]+) dBFS")}


def encode_test(wav, mp4, wav_dec, dur=48.0):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c=black:s=360x640:r=30:d={dur}", "-i", wav,
                    "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "320k", "-shortest", mp4], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-vn", "-c:a", "pcm_f32le", wav_dec], check=True)


def seam(x):
    return [float(abs(x[-1, c] - x[0, c])) for c in range(2)], float(np.sqrt(np.mean(x[-2400:] ** 2))), float(np.sqrt(np.mean(x[:2400] ** 2)))
