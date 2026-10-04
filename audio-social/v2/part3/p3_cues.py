#!/usr/bin/env python3
"""Cue sheet (csv + md): time (s), frame (= beat * 15 at 30 fps), beat, cue, tier, stem, gain, picture event."""
import csv
import sys
sys.path.insert(0, "/Users/adityasingh/anchors video/audio-social/v2/part3")
import p3_sfx as ps

OUT = "/Users/adityasingh/anchors video/audio-social/v2/part3"

# music-stem events: (beat, cue, tier, gain, picture event)
MUSIC = [
    (0, "groove-on + motif A4 + hook chord swell", "T1", 1.0, "f0: kick, 16th hats, open-hat offbeats, lead A4, Am swell (mid/high content from sample 48)"),
    (1, "clap", "T3", 0.9, "f15 bubble: clap on beats 2 and 4 of every bar"),
    (3.9, "pre-hit gap 50 ms", "T3", 0.0, "music dropout before the f60 lock (30 ms in the 4:5 mix)"),
    (4, "bass drop + A5 lead + Am swell", "T1", 1.25, "f60 counter lands 1,85,700 (A5 = motif landing, offbeat bass starts)"),
    (10, "ANCHOR motif A4 C5 E5 D5 -> A5 on b12", "T2", 0.5, "b10-12 over the tiles; A5 lands on the b12 cut"),
    (12, "riser bar (SFX) + stabs", "T3", 0.3, "b12-16 'Two weeks later.'"),
    (16, "1-beat filter dip (800 Hz LP, back at b17)", "T3", 0.0, "b16 'Update me.' bubble"),
    (18, "ANCHOR motif -> A5 on b20", "T2", 0.5, "b18-20 tool line; A5 lands on the b20 cut"),
    (20, "crest build: stabs on offbeats, arp up", "T3", 0.5, "b20-26 counter held / final ramp"),
    (25.9, "pre-hit gap 50 ms (kick and bass out for b25)", "T3", 0.0, "just before the count lock"),
    (26, "C-MAJOR LIFT: stab + lead C-E-G-C + kick/bass drop", "T1", 1.15, "f390 (b26) count lock 2,80,000, harmony lifts Am -> C"),
    (32, "ANCHOR motif -> A5 on b34", "T2", 0.5, "b32-34 tiles Likes/Comments/Engagement; A5 on the b34 cut"),
    (34, "tuned arp bed, 6 tuned SFX ticks only", "T3", 0.5, "b34-54 plan vs actual, one post"),
    (54, "thinner top: hats 8ths accents, no open hat, bass keeps pulse", "T3", 0.7, "b54-66 comments"),
    (64, "ANCHOR motif -> A5 on b66", "T2", 0.5, "b64-66 Sandeep R. quote; A5 lands on the b66 cut"),
    (66, "toggle plucks bed", "T3", 0.55, "b66-78 audience"),
    (76, "snare roll b76-78", "T2", 0.6, "b76-78 riser into the recap"),
    (78, "lead A4 (recap phrase 1)", "T2", 1.0, "b78 'Built.'"),
    (80, "lead C5 (recap phrase 2)", "T2", 1.0, "b80 'Reviewed.'"),
    (82, "lead E5 (recap phrase 3)", "T2", 1.0, "b82 'Monitored.'"),
    (84, "lead A5 (recap landing) + snare roll to b88", "T2", 1.0, "b84 'In one Claude chat.'"),
    (87.9, "pre-hit gap 50 ms", "T3", 0.0, "before the logo"),
    (88, "kick + Am swell under the logo sting (stripped groove: kick, bass, motif, soft hats)", "T1", 1.0, "f1320 logo / end card"),
    (92, "ANCHOR motif -> A5 on b94", "T3", 0.4, "end card, CTA"),
    (95, "loop pickup: SFX reverse crash + riser + whoosh; kick out; hats out", "T2", 0.7, "last beat lands on the f0 hit"),
]


def rows():
    r = []
    for fr, name, tier, gain, event, kind, a in ps.CUES:
        t = fr / 30
        r.append((t, fr, round(fr / 15, 2), name, tier, "sfx", round(gain, 2), event))
    for b, name, tier, gain, event in MUSIC:
        r.append((b / 2, round(b * 15, 1), b, name, tier, "music", gain, event))
    return sorted(r, key=lambda x: (x[0], x[5] != "music"))


def main():
    rs = rows()
    with open(f"{OUT}/Part3_cue_sheet.csv", "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["time_s", "frame", "beat", "cue", "tier", "stem", "gain", "picture_event"])
        for x in rs:
            w.writerow([f"{x[0]:.3f}", x[1], x[2], x[3], x[4], x[5], x[6], x[7]])
    lines = ["# Part 3 MONITOR cue sheet", "",
             "120 BPM, 30 fps: frame = beat x 15. 24 bars = 96 beats = 1440 f = 48.000 s = 2,304,000 samples @ 48 kHz. Every event starts 1 ms (48 samples) after its nominal time so nothing begins at sample 0 (AAC priming safe); SFX and music share this offset.",
             "Tiers: T1 = hit (max two layers per beat, different bands), T2 = musical accent / transition, T3 = subtle. All SFX are high-passed at 120 Hz (no sub); sub comes only from the kick and bass.",
             "Cues marked 'estimated' sit on a beat where the script gives no frame.", "",
             "| time (s) | frame | beat | cue | tier | stem | gain | picture event |", "|---|---|---|---|---|---|---|---|"]
    for x in rs:
        lines.append(f"| {x[0]:.3f} | {x[1]} | {x[2]} | {x[3]} | {x[4]} | {x[5]} | {x[6]} | {x[7]} |")
    open(f"{OUT}/Part3_cue_sheet.md", "w").write("\n".join(lines) + "\n")
    print(len(rs), "rows")


if __name__ == "__main__":
    main()
