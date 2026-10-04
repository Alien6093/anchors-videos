#!/usr/bin/env python3
"""QA report for a mix variant, measured on the decoded AAC mp4. Usage: python3 p3_report.py 916|45"""
import sys, json
import numpy as np
import soundfile as sf
sys.path.insert(0, "/Users/adityasingh/anchors video/audio-social/v2/part3")
import p3_qa as q
import p3_sfx as ps
SR = 48000
SCR = "/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/m3"
HIT_TIMES = [0.0, 2.0, 13.0, 44.0]       # f0 thud, f60 lock, f390 count lock, b88 logo


def report(v):
    wav, _ = sf.read(f"{SCR}/m_{v}.wav", dtype="float64")
    dec, sr = sf.read(f"{SCR}/m_{v}_dec.wav", dtype="float64")
    dec = dec[:len(wav)] if len(dec) >= len(wav) else dec
    ff = q.ff_measure(f"{SCR}/m_{v}_dec.wav")
    ffw = q.ff_measure(f"{SCR}/m_{v}.wav")
    ph = q.phone(dec)
    st = q.short_term(dec)
    st_after = st[1:]                                     # short-term windows (3 s, 1 s hop); skip the first second
    hits, phone_prog = q.hit_levels(dec, HIT_TIMES)
    r = {
        "variant": v, "samples_wav": len(wav), "decoded_samples": len(dec),
        "encoded": ff, "wav": ffw, "own_lufs_decoded": round(q.lufs(dec), 2),
        "crest_mono_db_decoded": round(q.crest(dec), 2), "crest_mono_db_wav": round(q.crest(wav), 2),
        "bands_pct": {k: round(x, 1) for k, x in q.band_shares(dec).items()},
        "first_0p5s_bands_pct": {k: round(x, 1) for k, x in q.band_shares(dec, 0.0, 0.5).items()},
        "first_0p5s_rms_dbfs": round(20 * np.log10(np.sqrt(np.mean(dec[:SR // 2] ** 2)) + 1e-9), 1),
        "phone_lufs": round(q.lufs(ph), 2), "phone_drop_db": round(q.lufs(ph) - q.lufs(dec), 2),
        "lufs_s_min_after_1s": round(float(st_after.min()), 1), "lufs_s_max": round(float(st.max()), 1),
        "hit_phone_over_programme_db": dict(zip(["f0", "f60", "f390", "b88"], [round(h, 1) for h in hits])),
        "seam_step_L_R_decoded": [round(s, 4) for s in q.seam(dec)[0]], "seam_step_wav": [round(s, 5) for s in q.seam(wav)[0]],
        "sample_peak_dbfs_decoded": round(20 * np.log10(np.abs(dec).max()), 2),
    }
    # per-second short term for the end card and hook
    r["lufs_s_by_s"] = [round(float(x), 1) for x in st]
    return r


if __name__ == "__main__":
    print(json.dumps(report(sys.argv[1]), indent=1))
