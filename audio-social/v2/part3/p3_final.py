#!/usr/bin/env python3
"""Final build: converge both mixes on the decoded-AAC measurement, write deliverables, reports and spectrograms."""
import sys, json, shutil
import numpy as np
import soundfile as sf
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
sys.path.insert(0, "/Users/adityasingh/anchors video/audio-social/v2/part3")
import p3_mix as M
import p3_report as R
import p3_sfx as ps
from p3_voices import SR, NS

OUT = M.OUT
SCR = M.SCR

for v in sys.argv[1:] or ["916", "45"]:
    y, music, sfx, ceil, pre, cfg = M.run(v)
    assert y.shape == (NS, 2)
    sf.write(f"{OUT}/Part3_mix_{'916' if v == '916' else '45'}.wav", y, SR, subtype="PCM_24")
    if v == "916":
        k = 0.4 / np.max(np.abs(music + sfx))
        sf.write(f"{OUT}/Part3_music.wav", music * k, SR, subtype="PCM_24")
        sf.write(f"{OUT}/Part3_sfx.wav", sfx * k, SR, subtype="PCM_24")
    r = R.report(v)
    r["limiter_ceiling_dbfs"] = round(ceil, 2)
    json.dump(r, open(f"{OUT}/Part3_qa_{v}.json", "w"), indent=1)
    shutil.copy(f"{SCR}/m_{v}.mp4", f"{SCR}/Part3_test_{v}.mp4")
    dec, _ = sf.read(f"{SCR}/m_{v}_dec.wav")
    fig, ax = plt.subplots(2, 1, figsize=(16, 8), gridspec_kw={"height_ratios": [3, 1]})
    ax[0].specgram(dec.mean(1), NFFT=2048, Fs=SR, noverlap=1536, cmap="magma", vmin=-130, vmax=-30)
    ax[0].set_ylim(0, 12000)
    for c in ps.CUES:
        if c[2] == "T1":
            ax[0].axvline(c[0] / 30, color="cyan", lw=0.6, alpha=0.7)
    for b in (4, 12, 16, 20, 26, 34, 46, 54, 66, 78, 88):
        ax[0].axvline(b / 2, color="white", lw=0.3, alpha=0.4, ls=":")
    ax[0].set_title(f"Part 3 MONITOR mix {v} (decoded AAC): spectrogram, cyan = T1 hits, dotted = scene cuts")
    ax[1].plot(np.arange(len(r["lufs_s_by_s"])) + 1.5, r["lufs_s_by_s"])
    ax[1].set_xlim(0, 48)
    ax[1].set_ylabel("LUFS-S")
    ax[1].grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(f"{SCR}/Part3_spec_{v}.png", dpi=90)
    plt.close(fig)
    print(v, "final", json.dumps({k: r[k] for k in ("encoded", "crest_mono_db_decoded", "bands_pct", "phone_drop_db", "hit_phone_over_programme_db", "lufs_s_min_after_1s")}))
