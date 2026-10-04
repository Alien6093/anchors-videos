#!/usr/bin/env python3
"""Render raw stems for both variants into the scratch dir (npz, float32)."""
import sys, time, numpy as np
sys.path.insert(0, "/Users/adityasingh/anchors video/audio-social/v2/part3")
import p3_music, p3_sfx
SCR = "/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/m3"
for v in ("916", "45"):
    t = time.time()
    m = p3_music.render_music(v)
    s, placed = p3_sfx.render_sfx(v)
    np.savez(f"{SCR}/stems_{v}.npz", sfx=s.astype(np.float32), **{k: x.astype(np.float32) for k, x in m.items()})
    print(v, "done", round(time.time() - t, 1), "s", {k: round(float(np.sqrt(np.mean(x ** 2))), 4) for k, x in m.items()}, flush=True)
