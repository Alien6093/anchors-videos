#!/usr/bin/env python3
"""Part 3 MONITOR music: 120 BPM, A minor, C-major lift at payoffs, uptempo electro-pop. 24 bars = 2,304,000 samples.
render_music(variant) -> dict of stereo stems (pre-gain), plus event list. variant: '916' (full) or '45' (PRO, calmer)."""
import numpy as np
from p3_voices import *

# chord timeline: (start_beat, name)
CHORDS = [(0, "Am"), (4, "F"), (8, "C"), (12, "G"), (16, "Am"), (20, "F"), (24, "G"), (26, "Cl"), (32, "G"), (34, "F"),
          (36, "Am"), (40, "C"), (44, "G"), (48, "Am"), (52, "F"), (56, "C"), (60, "G"), (64, "Am"), (68, "F"), (72, "C"),
          (76, "G"), (78, "Am"), (80, "F"), (82, "C"), (84, "Am"), (86, "G"), (88, "Am"), (92, "G")]
ROOT = {"Am": 45, "F": 41, "C": 48, "G": 43, "Cl": 48}                 # MIDI of bass root (A2 F2 C3 G2)
STAB = {"Am": [64, 69, 72, 76], "F": [60, 64, 69, 72], "C": [64, 67, 71, 74], "G": [62, 67, 71, 76], "Cl": [64, 67, 72, 76]}
ARP = {"Am": [69, 72, 76, 79, 83], "F": [65, 69, 72, 76, 81], "C": [72, 74, 76, 79, 83], "G": [67, 71, 74, 76, 79],
       "Cl": [72, 76, 79, 84, 88]}
ARP_PAT = [0, 2, 4, 2, 1, 3, 4, 3, 0, 2, 4, 3, 1, 2, 3, 2]
# per-second energy s0-s47 from social_script_v2 3.4 (48 values)
ENERGY = [10, 9, 8, 8, 8, 8, 8, 8, 7, 8, 9, 9, 9, 10, 10, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7,
          7, 8, 8, 8, 8, 8, 9, 9, 10, 9, 9, 8, 6, 5, 7]
assert len(ENERGY) == 48


def chord_at(b):
    c = CHORDS[0][1]
    for s, n in CHORDS:
        if b >= s:
            c = n
    return c


def lvl(plan, b):
    for a, z, g in plan:
        if a <= b < z:
            return g
    return 0.0


def bt(b):
    return OFF + int(round(b * BEAT))


def kick_times():
    ks = []
    for b in range(0, 95):
        if b == 25:
            continue
        ks.append(float(b))
    return ks


def sidechain(n, times, depth_db, tau):
    g = np.ones(n)
    d = 10 ** (-depth_db / 20)
    seg = S(tau * 6)
    t = np.arange(seg) / SR
    curve = 1 - (1 - d) * np.exp(-t / tau)
    curve[:S(0.002)] = np.linspace(1, d, S(0.002))
    for tb in times:
        s = bt(tb)
        m = min(seg, n - s)
        if m > 0:
            g[s:s + m] = np.minimum(g[s:s + m], curve[:m])
    return g[:, None]


def render_music(variant="916"):
    pro = variant == "45"
    z = lambda: np.zeros((NS, 2))
    drums, claps, hats, bass, harm, arps, lead = z(), z(), z(), z(), z(), z(), z()
    ev = []

    K, CL, SN = kick(1.0), clap(1.0), snap(1.0)
    # ---- kick
    for b in kick_times():
        v = 1.0 if b != 0 else 1.0
        put(drums, K, bt(b), v, 0)
    # ghost kicks before sections (fills)
    for b in (11.75, 15.75, 19.75, 33.75, 87.75) if not pro else ():
        put(drums, K, bt(b), 0.35, 0)
    # ---- clap on beats 2 and 4 of each bar (steps 4,12), not in the pre-drop beat; stripped on the end card
    for b in range(1, 88, 2):
        if 25 <= b < 26 or (54 <= b < 66 and False):
            continue
        put(claps, CL, bt(b), 0.9, 0.05)
    put(claps, CL, bt(89), 0.5, 0.05)
    put(claps, CL, bt(91), 0.5, 0.05)
    # snare rolls (build into b78 and b88)
    for a, z_, g0 in ((76.0, 78.0, 0.35), (84.0, 88.0, 0.3)):
        steps = []
        t_ = a
        while t_ < z_:
            steps.append(t_)
            t_ += 0.5 if t_ < (a + (z_ - a) * 0.5) else 0.25
        for i, tb in enumerate(steps):
            put(claps, CL, bt(tb), g0 + 0.6 * i / len(steps), 0.0)
    # ---- hats: rolling 16ths (steps 2 mod 4 = offbeat accent / open hat)
    HC = {v: hat(False, v) for v in (0.35, 0.55, 1.0)}
    HO = hat(True, 0.9)
    for step in range(0, 95 * 4):
        b = step / 4
        sp = step % 4
        if 25 <= b < 26 and sp % 2:
            continue
        if b >= 88:
            if sp % 2 == 0 and b < 95:
                put(hats, HC[0.55 if sp else 1.0], bt(b), 0.35, 0.15 * (1 if step % 8 < 4 else -1))
            continue
        if pro and sp % 2:
            continue                                   # PRO: no 16th rolls
        thin_open = (54 <= b < 66)
        if sp == 2:
            if not thin_open:
                put(hats, HO, bt(b), 0.55, 0.2)
            else:
                put(hats, HC[1.0], bt(b), 0.7, 0.2)
            continue
        v = 0.55 if sp == 0 else 0.35
        put(hats, HC[v], bt(b), 0.9 if not (54 <= b < 66) else 0.7, -0.15 if step % 2 else 0.15)
    # ---- bass: offbeat steps 2,6,10,14 (beat k + 0.5 each beat) + octave jump on step 7 (0.75 of beat 1)
    for bar in range(1, 24):
        b0 = bar * 4
        for k in range(4):
            tb = b0 + k + 0.5
            if tb < 4 or 25 <= tb < 26 or tb >= 95:
                continue
            ch = chord_at(tb)
            root = ROOT[ch]
            g = 1.0 if tb < 88 else 0.85
            put(bass, bass_note(mtof(root), 0.22), bt(tb), g, 0)
            if k == 1 and bar % 2 == 0 and tb < 88 and not pro:
                put(bass, bass_note(mtof(root + 12), 0.12), bt(tb + 0.25), 0.55, 0)
    # ---- pad: bar-level soft chord
    PAD = [(0, 4, 0.25), (4, 26, 0.3), (26, 34, 0.5), (34, 54, 0.28), (54, 66, 0.22), (66, 88, 0.3), (88, 96, 0.18)]
    cuts = sorted({c[0] for c in CHORDS} | {4, 26, 34, 54, 66, 88, 96})
    for a, z_ in zip(cuts[:-1], cuts[1:]):
        g = lvl(PAD, a)
        if g <= 0:
            continue
        ch = chord_at(a)
        put(harm, saw_chord(STAB[ch], (z_ - a) * 0.5 + 0.1, att=0.12, rel=0.12, lpf=3200, hpf=300), bt(a), g, 0)
    # ---- stabs on offbeats (detuned saw, HP 300)
    STABP = [(12, 16, 0.3), (20, 26, 0.5), (26, 34, 0.9), (66, 78, 0.28), (78, 88, 0.5)]
    for b in np.arange(0, 96, 0.5):
        if abs(b % 2 - 1.5) > 1e-6 and not (26 <= b < 34 and abs(b % 2 - 0.5) < 1e-6):
            continue
        g = lvl(STABP, b)
        if g <= 0:
            continue
        put(harm, saw_chord(STAB[chord_at(b)], 0.24, att=0.004, rel=0.06, dec=0.1, lpf=6500), bt(b), g, 0)
    # milestone swells (long chord stabs) at b4 (Am) and b26 (C major lift)
    put(harm, saw_chord(STAB["Am"], 1.4, att=0.004, rel=0.3, dec=0.55, lpf=7500), bt(4), 1.0, 0)
    put(harm, saw_chord(STAB["Am"], 1.2, att=0.004, rel=0.25, dec=0.5, lpf=7500), bt(0), 1.0, 0)    # hook swell on f0 (mid/high content from the first sample)
    put(harm, saw_chord(STAB["Am"], 1.6, att=0.004, rel=0.3, dec=0.6, lpf=7500), bt(88), 1.0, 0)   # logo swell
    put(harm, saw_chord(STAB["Cl"] + [84], 2.0, att=0.004, rel=0.5, dec=0.8, lpf=8500), bt(26), 1.15, 0)
    # ---- arp pluck, 16ths (counter-ramps are SFX; this is the bed arp)
    ARPP = [(4, 12, 0.5), (12, 16, 0.35), (16, 20, 0.45), (20, 24, 0.55), (26, 34, 0.8), (34, 54, 0.5), (54, 66, 0.4),
            (66, 78, 0.55), (78, 88, 0.55), (88, 95, 0.3)]
    for step in range(16, 95 * 4):
        b = step / 4
        g = lvl(ARPP, b)
        if g <= 0 or (pro and step % 2):
            continue
        ch = chord_at(b)
        pool = ARP[ch]
        m = pool[ARP_PAT[step % 16]]
        acc = 1.0 if step % 4 == 0 else (0.75 if step % 2 == 0 else 0.55)
        pan = (-0.35, 0.35)[step % 2]
        put(arps, anchor_pluck(mtof(m), 1.0, 0.16, amp_tau=0.07, sw_tau=0.05), bt(b), g * acc, pan)
        if 26 <= b < 34 and step % 2 == 0:
            put(arps, anchor_pluck(mtof(m + 12), 1.0, 0.14, amp_tau=0.06, sw_tau=0.04), bt(b), g * acc * 0.4, -pan)
    # ---- lead: ANCHOR motif notes (identical note list to Part 1)
    def motif(start_b, g=0.5):
        for i, (m, off) in enumerate(((69, 0.0), (72, 0.5), (76, 1.0), (74, 1.5), (81, 2.0))):
            last = m == 81 and off == 2.0
            n = anchor_note(m, vel=1.0 if last else 0.85, dur=1.0 if last else 0.35, bell=0.45 if last else 0.3, amp_tau=0.2)
            put(lead, n, bt(start_b + off), g * (1.4 if last else 1.0), 0.0)
    put(lead, anchor_note(69, 1.0, 0.5, 0.35), bt(0), 1.0, 0)                              # hook: A4 on frame 0
    put(lead, anchor_note(69 + 12, 1.0, 1.4, 0.5, amp_tau=0.35), bt(4), 1.25, 0)           # A5 landing on the lock (f60)
    for sb in (10, 18, 32, 64):                                                            # A5 lands on cuts b12 b20 b34 b66
        motif(sb, 0.5)
    motif(92, 0.4)                                                                         # end-card motif, A5 on b94
    for b0, m in ((78, 69), (80, 72), (82, 76), (84, 81)):                                 # recap phrase hits A4 C5 E5 A5
        put(lead, anchor_note(m, 1.0, 1.4 if m == 81 else 0.9, 0.5, amp_tau=0.3), bt(b0), 1.0, 0)
    # lock chord at b26: C-major lead stab + bell shimmer (E5 common tone, C6 on top)
    for m in (72, 76, 79, 84):
        put(lead, anchor_note(m, 1.0, 1.2, 0.5, amp_tau=0.3), bt(26), 0.55, 0)

    # ---- sidechains (kick duck on every music stem except the kit)
    kt = kick_times()
    sc_bass = sidechain(NS, kt, 7.0, 0.10)
    sc_harm = sidechain(NS, kt, 6.0, 0.11)
    sc_arp = sidechain(NS, kt, 3.5, 0.11)
    sc_lead = sidechain(NS, kt, 2.5, 0.11)
    bass *= sc_bass
    harm *= sc_harm
    arps *= sc_arp
    lead *= sc_lead
    arps = reverb(arps, 0.10, 0.7)
    lead = reverb(lead, 0.16, 0.9)
    return {"kick": drums, "clap": claps, "hats": hats, "bass": bass, "harm": harm, "arps": arps, "lead": lead}


def energy_curve(variant="916", cap=None):
    """per-sample gain from the per-second energy plan; 0.7 dB per energy unit around 8, smoothed."""
    cap = 7 if variant == "45" else (cap or 10)
    e = np.array([min(v, cap) for v in ENERGY], float)
    t = np.arange(NS) / SR
    x = np.interp(t, np.arange(48) + 0.5, e)
    k = int(0.5 * SR)
    x = np.convolve(np.pad(x, (k, k), mode="edge"), np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
    return 10 ** (((x - 8) * 0.7) / 20)


def gaps_and_dip(variant="916"):
    """music-bus gain mask: pre-hit dropouts (45/60 ms; PRO max 30 ms) before b4, b26, b88; filter-dip beat at b16 (blend done in mix)."""
    g = np.ones(NS)
    ms = 0.030 if variant == "45" else 0.050
    for hb in (4, 26, 88):
        e = bt(hb)
        s = e - S(ms)
        g[s:e] = 0.0
        r = S(0.004)
        g[s - r:s] = np.linspace(1, 0, r)
    return g
