#!/usr/bin/env python3
"""Part 3 MONITOR SFX stem + cue list. Cue frames are picture frames at 30 fps (frame = beat * 15), per social_script_v2 section 3.2.
Every SFX is >= 120 Hz (no sub: sub comes only from the kick/bass), tuned to A minor / C major."""
import numpy as np
from p3_voices import *

FPS = 30


def F(f):                       # frame -> sample (1 ms global offset, same as the music grid)
    return OFF + int(round(f / FPS * SR))


A4, C5, D5, E5, G5, A5, B5, C6 = 69, 72, 74, 76, 79, 81, 83, 84
f = mtof

# (frame, name, tier, gain, picture event, kind, args)   kind selects the voice
CUES = [
    (0, "hook-thud", "T1", 1.8, "f0 board frame (end state of Part 2), settled hero frame", "thud", {}),
    (4, "flip-whoosh", "T3", 0.35, "f4-14 the 4 Scheduled dots flip green in a wave", "swish", {"dur": 0.34}),
    (15, "bubble-pop", "T2", 0.55, "f15 bubble 'How is it performing?' rises", "pop", {"fr": f(E5)}),
    (37.5, "counter-ramp-A-minor-run", "T2", 0.55, "f36-60 counter 0 -> 1,85,700: B4..G5 on 16ths (b2.5-b3.75), lands on the A5 at f60", "run",
     {"notes": [83 - 12, 72, 74, 76, 77, 79], "step": 3.75, "vel0": 0.5}),
    (45, "reverse-crash-into-lock", "T2", 0.5, "b3-b4 reverse crash peaking on the f60 counter lock", "revcrash", {"dur": 0.5, "end_frame": 60}),
    (60, "lock-impact", "T1", 1.0, "f60 counter lands 1,85,700 (A5 on the lead); 4 f hit-stop", "impact", {"vel": 0.95}),
    (60, "hit-stop-tape-4f", "T2", 0.6, "f60-63 hit-stop (tape click)", "tape", {}),
    (90, "morph-swish", "T3", 0.3, "b6 hero counter morphs into the Impressions tile", "swish", {"dur": 0.28, "rising": False}),
    (105, "tile-tick-E5", "T3", 0.45, "f105 Likes 2,955 tile lands", "tick", {"fr": f(E5)}),
    (112, "tile-tick-A5", "T3", 0.4, "f112 Comments 238 tile lands", "tick", {"fr": f(A5)}),
    (120, "tile-tick-C5", "T3", 0.4, "f120 Engagement rate 1.72% tile lands (bar line)", "tick", {"fr": f(C5 + 12)}),
    (180, "whoosh-cut", "T3", 0.4, "b12 cut to kinetic card 'Two weeks later.'", "whoosh", {}),
    (180, "riser-bar-b12-16", "T2", 0.45, "b12-16 one-bar riser into the 'Update me.' beat (+ chip Fri 23 Oct)", "riser", {"dur": 2.0, "end_frame": 240}),
    (240, "bubble-pop", "T2", 0.55, "b16 bubble 'Update me.'", "pop", {"fr": f(C5 + 12)}),
    (255, "tool-blip", "T3", 0.4, "b17 tool line 'CLEO - How the campaign is performing'", "tick", {"fr": f(A4 + 12), "dur": 0.1}),
    (300, "whoosh-cut", "T3", 0.4, "b20 cut to the held counter", "whoosh", {}),
    (300, "riser-b20-24", "T2", 0.5, "b20-24 riser while the counter is held at 1,85,700", "riser", {"dur": 3.0, "end_frame": 390 - 30}),
    (360, "counter-ramp-C-major-run", "T2", 0.6, "f360-387 final-count ramp 1,85,700 -> 2,80,000 (8 notes, 16ths, lands C6 at the lock)", "run",
     {"notes": [72, 74, 76, 77, 79, 81, 83, 84 + 0], "step": 3.75, "vel0": 0.45}),
    (375, "reverse-crash-into-lock", "T2", 0.55, "b25-26 reverse crash peaking on the lock", "revcrash", {"dur": 0.5, "end_frame": 390}),
    (390, "lock-impact", "T1", 1.0, "f390 (b26) COUNT LOCK 2,80,000: impact (music: C-major stab + kick/bass drop)", "impact", {"vel": 1.0}),
    (390, "lock-bell-C6", "T1", 0.7, "f390 glow once: C6 bell with E6 shimmer", "bell", {"fr": f(C6), "dur": 1.6}),
    (390, "hit-stop-tape-6f", "T2", 0.6, "f390-396 hit-stop (tape click)", "tape", {}),
    (396, "glass-tail", "T3", 0.28, "after the lock: glass tail C-E-G (2 s max)", "glass", {"midis": [84, 88, 91], "dur": 1.8}),
    (450, "morph-swish", "T3", 0.3, "b30 hero '2,80,000' morphs into the tile row", "swish", {"dur": 0.28, "rising": False}),
    (465, "tile-tick-E5", "T3", 0.4, "b31 Likes 4,500 tile (estimated landing)", "tick", {"fr": f(E5)}),
    (480, "tile-tick-G5", "T3", 0.4, "b32 Comments 361 tile (estimated landing)", "tick", {"fr": f(G5)}),
    (495, "tile-tick-C6", "T3", 0.38, "b33 Engagement rate 1.74% tile (estimated landing)", "tick", {"fr": f(C6)}),
    (510, "whoosh-cut", "T3", 0.4, "b34 cut to the plan band", "whoosh", {}),
    (510, "marker-sweep", "T3", 0.22, "b34-40 marker travels to the final value", "swish", {"dur": 3.0, "lo": 1200, "hi": 6000}),
    (600, "marker-cross-bell-A5", "T2", 0.6, "f600 (b40) marker crosses the top, flag 'Above range'", "bell", {"fr": f(A5), "dur": 0.9}),
    (660, "chip-ping-E5", "T2", 0.5, "f660 (b44) chip 'Rs 15 below plan' lands", "bell", {"fr": f(E5 + 12), "dur": 0.7}),
    (690, "whoosh-cut", "T3", 0.4, "b46 cut to the one-post scene", "whoosh", {}),
    (690, "bubble-pop", "T2", 0.5, "b46 bubble 'How did Ashish's post do?'", "pop", {"fr": f(E5)}),
    (705, "tool-blip", "T3", 0.4, "b47 tool line", "tick", {"fr": f(A4 + 12), "dur": 0.1}),
    (765, "table-tick-G5", "T2", 0.45, "b51 NATIVE table lands (Impressions 44,800 / Likes / Comments)", "tick", {"fr": f(G5)}),
    (795, "chip-tick-E5", "T3", 0.4, "b53 chip 'Campaign average 1.74%'", "tick", {"fr": f(E5 + 12)}),
    (810, "whoosh-cut", "T3", 0.4, "b54 cut to the comments bar", "whoosh", {}),
    (810, "bar-grow-sweep", "T3", 0.22, "b54-58 sentiment bar grows with no digits", "swish", {"dur": 1.9, "lo": 900, "hi": 5000}),
    (870, "lock-tick-E5", "T2", 0.5, "f870 (b58) 71 / 25 / 4 numbers appear; Neha K. quote 1", "tick", {"fr": f(E5)}),
    (930, "quote-pluck-D5", "T3", 0.4, "b62 Sandeep R. quote 2", "tick", {"fr": f(D5)}),
    (990, "whoosh-cut", "T3", 0.4, "b66 cut to audience scene", "whoosh", {}),
    (990, "bubble-pop", "T2", 0.5, "b66 bubble 'Who did it reach?'", "pop", {"fr": f(E5)}),
    (1020, "card-land-tick-A4", "T3", 0.4, "b68 Roles card (Reached 41%)", "tick", {"fr": f(A4 + 12)}),
    (1080, "toggle-click-E5", "T2", 0.5, "b72 toggle to Commenters, bar morphs to 47%", "tick", {"fr": f(E5), "dur": 0.1}),
    (1140, "riser-b76-78", "T2", 0.45, "b76-78 riser into the recap", "riser", {"dur": 1.0, "end_frame": 1170}),
    (1170, "whoosh-cut", "T3", 0.4, "b78 cut to the recap", "whoosh", {}),
    (1170, "word-hit-Built", "T2", 0.55, "b78 'Built.' (Part 1 chip lights); music lead A4", "word", {}),
    (1200, "word-hit-Reviewed", "T2", 0.55, "b80 'Reviewed.' (Part 2 chip); music lead C5", "word", {}),
    (1230, "word-hit-Monitored", "T2", 0.55, "b82 'Monitored.' (Part 3 chip); music lead E5", "word", {}),
    (1260, "word-hit-chat", "T2", 0.65, "b84 'In one Claude chat.'; music lead A5", "word", {}),
    (1260, "riser-b84-88", "T2", 0.5, "b84-88 build to the logo", "riser", {"dur": 2.0, "end_frame": 1320}),
    (1305, "reverse-crash-into-logo", "T2", 0.5, "b87-88 reverse crash into the logo sting (60 ms music gap)", "revcrash", {"dur": 0.5, "end_frame": 1320}),
    (1320, "logo-sting", "T1", 1.5, "f1320 (b88) logo: snap + bell A4 C5 E5 A5 on 8ths, glass tail (no sub)", "sting", {}),
    (1425, "loop-pickup", "T2", 0.7, "b95 pickup: reverse crash + noise riser + whoosh peaking on the last 50 ms, lands on the f0 thud", "pickup", {}),
]


def end_ramp(x, end_frame, start_frame):
    """place a riser so that its peak lands on end_frame: returns offset samples"""
    return F(end_frame) - len(x)


def voice(kind, a):
    if kind == "thud":
        return thud_hook()
    if kind == "impact":
        return impact(0.8, a.get("vel", 1.0))
    if kind == "tape":
        return tape_stop()
    if kind == "swish":
        return swish(a.get("dur", 0.3), a.get("rising", True), a.get("lo", 1500), a.get("hi", 9000))
    if kind == "whoosh":
        return whoosh(0.32)
    if kind == "pop":
        return pop(a["fr"])
    if kind == "tick":
        return tick(a["fr"], a.get("dur", 0.14))
    if kind == "word":
        return word_hit()
    if kind == "bell":
        b = anchor_bell(a["fr"], a["dur"], 1.0)
        return hp(b + 0.3 * anchor_bell(a["fr"] * 1.5, a["dur"], 0.5), 300)
    if kind == "glass":
        return glass_tail(a["midis"], a["dur"])
    return None


def render_sfx(variant="916"):
    pro = variant == "45"
    buf = np.zeros((NS, 2))
    placed = []
    for (fr, name, tier, gain, event, kind, a) in CUES:
        g = gain
        if pro:
            if tier == "T1":
                g *= 10 ** (-3 / 20)
            if name.startswith("riser") or "whoosh" in name or "revers" in name:
                g *= 10 ** (-4 / 20)
        t0 = F(fr)
        if kind == "run":
            notes = a["notes"]
            for i, m in enumerate(notes):
                t = F(fr) + int(round(i * a["step"] / FPS * SR))
                v = a["vel0"] + (1 - a["vel0"]) * i / max(1, len(notes) - 1)
                x = tick(mtof(m), 0.2, 1.0)
                put(buf, x, t, g * v * 1.2, ((i % 2) - 0.5) * 0.4)
                put(buf, hp(anchor_bell(mtof(m), 0.4, 0.5), 300), t, g * v * 0.5, 0)
            placed.append((fr, name, tier, g, event))
            continue
        if kind == "riser":
            x = riser(a["dur"])
            t0 = F(a["end_frame"]) - len(x)
            put(buf, x, t0, g, 0)
        elif kind == "revcrash":
            x = rev_crash(a["dur"])
            put(buf, x, F(a["end_frame"]) - len(x), g, 0)
        elif kind == "sting":
            for i, m in enumerate((A4, C5, E5, A5)):
                last = i == 3
                put(buf, hp(anchor_bell(mtof(m), 2.2 if last else 0.9, 1.0) * (1.0 if last else 0.85), 280), t0 + int(i * 0.25 * SR), g * 0.75, 0)
                put(buf, hp(anchor_pluck(mtof(m), 1.0, 0.4, amp_tau=0.15), 250), t0 + int(i * 0.25 * SR), g * 0.55, 0)
            put(buf, snap(1.0), t0, g * 1.0, 0)
            put(buf, clap(1.0), t0, g * 0.6, 0)
            put(buf, glass_tail([81, 84, 88], 1.5, 0.8), t0 + int(1.0 * SR), g * 0.4, 0)
        elif kind == "pickup":
            x = rev_crash(0.5)
            end = NS - 24
            put(buf, x, end - len(x), g * 0.9, 0)
            r = riser(0.5, 800, 12000, tonal=False, seed=9)
            put(buf, r, end - len(r), g * 0.7, 0)
            w = whoosh(0.5, 800, 9000, seed=5)
            put(buf, w, end - len(w), g * 0.5, 0)
        else:
            x = voice(kind, a)
            pan = 0.0
            put(buf, x, t0, g, pan)
        placed.append((fr, name, tier, g, event))
    # loop seam: last 24 samples ramp to zero (zero-crossing exit), nothing at sample 0
    buf[-24:] *= np.linspace(1, 0, 24)[:, None]
    return buf, placed


def t1_times_s():
    return [F(c[0]) / SR for c in CUES if c[2] == "T1"]
