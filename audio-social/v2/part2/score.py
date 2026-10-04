"""Part 2 (REVIEW) score + SFX arrangement. 120 BPM, A minor, half-time trap-pop. Grid: beat = 24000 samples = 15 frames.
Outputs (in ./build): music_raw.npy, sfx_raw.npy (stereo float32, NS samples, tails folded circularly), cues.json, kicks.json.
Usage: python3 score.py"""
import json, os
import numpy as np
from engine import *

PRO = os.environ.get('PRO') == '1'
HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, 'build'); os.makedirs(BUILD, exist_ok=True)

ENERGY = [9, 9, 6, 6, 6, 7, 8, 8, 8, 8, 9, 9, 8, 8, 8, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8, 8, 9,
          10, 10, 9, 8, 8, 8, 8, 9, 10, 9, 9, 9, 8, 6, 5, 7]
E_DB = {3: -22.0, 5: -18.5, 6: -16.5, 7: -15.0, 8: -13.5, 9: -12.8, 10: -11.0}
SLOPE = 0.5  # half the printed energy slope, the leveller finishes the job (LRA <= 5)

BASS_OCT = 12  # 808 root octave offset above A1 (tuned by measurement: sub <60 Hz <= 12 %)
ROOTS = {'Am': 33, 'F': 29, 'C': 36, 'G': 31}
VOICE = {
    'Am': [57, 60, 64, 67, 71], 'F': [57, 60, 64, 65, 69], 'Cm7': [60, 64, 67, 71, 74], 'G6': [59, 62, 64, 67, 71],
    'C': [60, 64, 67, 72], 'G': [59, 62, 67, 71], 'F2': [60, 65, 69, 72],
}
# chord per bar: Am9 | Fmaj7 | Cmaj7add9 | G6 for bars 0-15; C-major lift bars 16-19; then Am, F, Am, G6
BAR_CHORD = (['Am', 'F', 'Cm7', 'G6'] * 4 +
             ['C', 'G', 'Am', 'F2'] +
             ['Am', 'F', 'Am', 'G6'])
BAR_ROOT = {'Am': 'Am', 'F': 'F', 'Cm7': 'C', 'G6': 'G', 'C': 'C', 'G': 'G', 'F2': 'F'}
BAR_VOICE = {'Am': 'Am', 'F': 'F', 'Cm7': 'Cm7', 'G6': 'G6', 'C': 'C', 'G': 'G', 'F2': 'F2'}
ANCHOR = [('A4', 69, 0), ('C5', 72, 2), ('E5', 76, 4), ('D5', 74, 6), ('A5', 81, 8)]  # steps of 16th (8th spacing = 2 steps)

music = {k: Bus() for k in ('kick', 'bass', 'drums', 'log', 'mel')}
sfx = Bus()
hits = Bus()
cues = []          # dicts
kick_times = []    # samples
t1_times = []      # T1 SFX times (samples) for music ducking


def bs(b): return b * BEAT                      # beat -> samples
def eg(b):                                       # level offset linear from energy curve
    e = ENERGY[min(47, int(b // 2))]
    e = min(e, 7) if PRO else e
    return db(SLOPE * (E_DB[e] - E_DB[8]))


def cue(beat, name, tier, gain_db, event, stem='sfx'):
    cues.append(dict(beat=beat, frame=beat * 15, time=beat * 0.5, cue=name, tier=tier, gain_db=gain_db, event=event, stem=stem))


def in_hush(b): return 55 <= b < 56
def rng_in(b, ranges): return any(a <= b < c for a, c in ranges)


LOG_R = [(8, 30), (56, 88)]
KAL_R = [(8, 88), (88, 96)]
HAT_R = [(0, 88), (88, 94)]


def kick_hit(b, vel=1.0, big=False):
    music['kick'].add(kick(vel), bs(b), 1.0)
    kick_times.append(bs(b))


def chord_steps(bar):
    ch = BAR_CHORD[bar]; v = VOICE[BAR_VOICE[ch]]
    return ch, v


# ------------------------------------------------------------------ groove
def groove():
    for bar in range(24):
        ch, v = chord_steps(bar)
        root = ROOTS[BAR_ROOT[ch]] + BASS_OCT
        for s in range(16):
            b = bar * 4 + s / 4
            if in_hush(b) or b >= 95: continue
            e = eg(b)
            end_card = b >= 88
            # --- kick + 808: x.....x...x.....
            if s in (0, 6, 10):
                if not (b < 88 and bar >= 22 and False):
                    kick_hit(b, 1.0 if s == 0 else 0.85)
                glide = root * 4 / 3 if s == 6 else None
                dur = (0.4 if s != 10 else 0.36) if PRO else (0.5 if s != 10 else 0.42)
                music['bass'].add(bass808(mtof(root), dur, mtof(root) * 4 / 3 if glide else None, 1.0), bs(b), 0.9 * e)
            # --- clap/snap on beat 3 of bar (step 8), ghost rim step 10
            if s == 8:
                music['drums'].add(clap(1.0), bs(b), 0.75 * e, 0.0)
            if s == 10 and not end_card:
                music['drums'].add(rim(0.5), bs(b), 0.4 * e, 0.25)
            # --- shaker 16ths (2.5-6.5 kHz presence), accents on the off 16ths
            if 4 <= b < 88 and not end_card:
                music['drums'].add(shaker((0.35, 0.8, 0.5, 0.9)[s % 4]), bs(b), 0.45 * e, 0.4 * (-1) ** s)
            # --- hats: 8ths, roll on steps 14/15 every 4th bar
            if rng_in(b, HAT_R):
                if s % 2 == 0:
                    vel = 0.9 if s % 4 == 0 else 0.6
                    music['drums'].add(hat(vel), bs(b), 0.55 * e * (0.6 if end_card else 1), -0.2 if s % 4 else 0.2)
                if bar % 4 == 3 and s in (14, 15) and not end_card and not PRO:
                    music['drums'].add(hat(0.7), bs(b), 0.5 * e, 0.3)
                if bar % 4 == 3 and s == 13 and not end_card and not PRO:
                    music['drums'].add(hat(0.45), bs(b), 0.4 * e, -0.3)
            # --- log drum answer: ...x..x....x..x.  on chord tones A2 C3 E3 G3
            if s in (3, 6, 11, 14) and rng_in(b, LOG_R):
                tones = [45, 48, 52, 55]
                shift = {'Am': 0, 'F': -4, 'Cm7': 0, 'G6': -2, 'C': 0, 'G': -2, 'F2': -4}[ch]
                note = tones[[3, 6, 11, 14].index(s)] + shift
                music['log'].add(logdrum(mtof(note), 0.8), bs(b), 0.7 * e, 0.0)
            # --- kalimba arp (steps 2 5 8 11 14), tones climb with the chord
            if s in (2, 5, 8, 11, 14) and rng_in(b, KAL_R) and not (s == 8 and False):
                k = [2, 5, 8, 11, 14].index(s)
                note = v[(k + (bar % 2)) % len(v)] + (12 if k % 2 else 0)
                lev = 0.28 * e * (0.7 if (30 <= b < 52) else 1.0) * (0.8 if end_card else 1)
                music['mel'].add(kalimba(float(mtof(note)), 0.8, 0.5), bs(b), lev, (-0.5 if k % 2 else 0.5) * 0.6)
        # --- pad bed (mid content for phone + LUFS-S floor)
        b0 = bar * 4
        if b0 >= 4:
            dur = 4 * 0.5 if not in_hush(b0 + 3) else 3 * 0.5 + 0.15
            music['mel'].add(pad(v, dur + 0.25, 1.0), bs(b0), 0.55 * eg(b0 + 1) * (0.8 if b0 >= 88 else 1))
        if b0 >= 8 and (b0 < 56 or b0 >= 56) and bar % 1 == 0:
            # offbeat saw stab on step 10 for energy>=8 sections
            if ENERGY[min(47, b0 // 2 + 1)] >= 8 and not in_hush(b0 + 2.5) and b0 < 88:
                music['mel'].add(saw_stab([m + 0 for m in v[:4]], 0.28, 0.6), bs(b0 + 2.5), 0.5 * eg(b0 + 2.5))


def anchor_phrase(b0, level=1.0, lead=False, bell=0.35):
    for name, midi, st in ANCHOR:
        t = bs(b0) + st * S16
        last = name == 'A5'
        n = anchor_note(midi, vel=1.0 if last else 0.85, dur=0.9 if last else 0.35, bell=bell)
        music['mel'].add(n, t, 0.5 * level, 0.1)
        if lead:
            music['mel'].add(saw_stab([midi], 0.7 if last else 0.3, 0.7), t, 0.38 * level)


def motifs():
    for bar in (1, 2, 3, 5, 9, 11, 13):
        pass
    for bar in (1, 3, 5, 9, 11, 13, 15, 17, 19):   # one phrase every 2 bars where nothing else speaks
        b0 = bar * 4
        if bar in (5,): continue
        if rng_in(b0, [(24, 32), (55, 56)]): continue
        anchor_phrase(b0, 0.6)
    anchor_phrase(64, 1.0, lead=True)               # GOLD hold: motif at full level, saw lead + bell
    anchor_phrase(80, 0.85, lead=True)              # live pings share the motif at b80
    anchor_phrase(92, 0.6)


# ------------------------------------------------------------------ hook
def hook():
    # slam at f0 (A4 motif note + snap + kick + 808 hit); hats 16ths from f0
    music['drums'].add(snap(1.0), 48, 0.9)         # 1 ms offset, so AAC priming cannot clip the attack
    music['mel'].add(anchor_note(69, vel=1.0, dur=0.5, bell=0.45), 48, 0.75, 0.0)
    music['mel'].add(saw_stab([57, 64, 69], 0.15, 0.8), 48, 0.3)
    hits.add(hp(bp(noise(int(0.09 * SR)), 2200, 6500) * np.exp(-tarr(int(0.09 * SR)) / 0.02), 1500), 48, 2.4)
    hits.add(snap(1.0), 48, 1.2)
    hits.add(saw_stab([69, 76, 81], 0.2, 1.0, tau=0.1), 48, 0.7)
    cue(0, 'hook-crack', 'T1', -2, 'Frame 0: 2-6 kHz crack so the hook has mid/high content in the first 0.5 s', 'music')
    cue(0, 'hook-slam', 'T1', 0, 'Card + underlines settle at f0: slam, snap, motif A4, 16th hat roll', 'music')
    for i in range(0, 24, 2 if PRO else 1):          # 16th hat roll b0 -> b3 rising (8ths in the PRO mix)
        t = i * S16 + 48 if i == 0 else i * S16
        music['drums'].add(hat(0.5 + 0.5 * i / 24), t, 0.5 * (0.6 + 0.4 * i / 24), 0.3 * (-1) ** i)
    cue(0, 'hat-roll-16th', 'T2', -6, 'Underlines draw f0-8 (hat roll to the stamp)', 'music')
    # bright riser 0 -> 1.5 s at -12 dB or louder
    k = 0.63 if PRO else 1.0
    sfx.add(tonal_riser(1.5, [69, 72, 76], 1.0, -12, 700), 0, 0.5 * k)
    sfx.add(noise_riser(1.5, 0.45), 0, 0.5 * k)
    cue(0, 'hook-riser', 'T2', -12, 'Question "Would you approve this?" holds b0-b3 (tonal riser 0 -> f45)')
    # stamp at b3 (f45): slap + C5 + low log drum + hit-stop
    b = 3
    hits.add(paper_slap(1.0), bs(b), 1.4, 0.0)
    hits.add(impact(0.9, 0.7), bs(b), 0.45)
    hits.add(saw_stab([72, 76, 79], 0.3, 1.0, tau=0.12), bs(b), 1.6)
    sfx.add(hitstop(1.0), bs(b) + 700, 0.45)
    music['log'].add(logdrum(mtof(45), 1.0), bs(b), 1.0)
    music['mel'].add(anchor_note(72, 1.0, 0.6, 0.45), bs(b), 0.7, 0.0)
    music['kick'].add(kick(0.9), bs(b)); kick_times.append(bs(b))
    t1_times.append(bs(b))
    cue(3, 'stamp-slap', 'T1', -2, '"Off-brief" stamp slam (hit-stop 2 f)')
    cue(3, 'stamp-C5-logdrum', 'T1', -3, 'C5 motif note + low log-drum hit under the stamp', 'music')
    cue(3, 'hit-stop-tape', 'T2', -7, 'Stamp hit-stop (2 f freeze)')


# ------------------------------------------------------------------ SFX / cuts
def whoosh_at(b, name, event, dur=0.25, vel=0.7, f1=1500, f2=7000, pan=0.0):
    t = bs(b) - int(0.62 * dur * SR)          # peak lands on the cut
    sfx.add(whoosh(dur, 1.0, f1, f2), max(0, t), vel * (0.63 if PRO else 1), pan)
    cue(b, name, 'T2', round(20 * np.log10(vel), 1), event)


def sfx_cuts():
    cuts = [(4, 'Hook -> brief card'), (8, 'Brief -> sent/drafts'), (12, 'Drafts -> Riya review'), (20, 'Review -> four-flash same checks'),
            (24, 'Same checks -> approvals'), (30, 'Approvals -> sent back 1 (Ashish)'), (40, 'Sent back 1 -> Darika card (hook card returns)'),
            (46, 'Hard cut Darika -> Priyanshu'), (52, 'Sent back 2 -> revised'), (56, 'Revised -> board build'),
            (70, 'Gold hold -> dates'), (78, 'Dates -> live feed crop'), (80, 'Feed crop -> live board')]
    for i, (b, ev) in enumerate(cuts):
        pan = (-0.3, 0.3)[i % 2]
        whoosh_at(b, f'whoosh-cut-{b}', ev, 0.22 if b in (46, 80) else 0.28, 0.5 if b in (46, 80) else 0.62, 1400, 6500, pan)
    # b10: status wave flips (single rising sweep, no ladder)
    sfx.add(sweep_noise(0.5, 900, 5200, 1.0, 'up', 1.0), bs(10), 0.35)
    cue(10, 'status-wave-sweep', 'T2', -9, 'Status board: 8 rows flip Awaiting -> Draft ready (b10-b12)')
    # b18 ready badge, small bell
    music['mel'].add(anchor_bell(float(mtof(76)), 0.9, 0.5), bs(18), 0.35, 0.4)
    cue(18, 'badge-bell-E5', 'T3', -9, 'Badge "Ready for review"', 'music')
    # b13-17 five check ticks: accent open-hat in music
    for b in (13, 14, 15, 16, 17):
        music['drums'].add(hat(1.0, True), bs(b), 0.5, 0.35)
        music['drums'].add(rim(0.7), bs(b) + 3000, 0.35, 0.35)
        cue(b, 'check-tick-hat', 'T3', -8, f'Check tick {b - 12} of 5 (hat accent in the groove)', 'music')
    # b20-23 four tonal stabs (C major, one per beat, no ladder: same chord, same pitch)
    for i, b in enumerate((20, 21, 22, 23)):
        music['mel'].add(saw_stab([60, 64, 67, 72], 0.4, 1.0), bs(b), 0.75, 0.0)
        cue(b, 'stab-C-major', 'T2', -5, f'Same-checks flash {i + 1}/4 ({["Jyoti", "Gunjan", "Shubhangi", "Sunidhi"][i]})', 'music')
    # b24-28 five approvals = five motif plucks A4 C5 D5 E5 A5 (inside the music); cross thuds b30, b31
    for i, (b, m) in enumerate(zip((24, 25, 26, 27, 28), (69, 72, 74, 76, 81))):
        music['mel'].add(anchor_note(m, 1.0, 0.45 if i < 4 else 1.0, 0.45), bs(b), 0.8, -0.3 + 0.15 * i)
        cue(b, f'approve-pluck-{["A4", "C5", "D5", "E5", "A5"][i]}', 'T2', -4, f'Approved badge {i + 1}/5' + (' ("5 of 8" lands)' if i == 4 else ''), 'music')
    for b, f in ((30, 45), (31, 43)):
        music['log'].add(logdrum(mtof(f), 1.0, 0.45), bs(b), 1.1)
        music['bass'].add(bass808(mtof(f - 12 + BASS_OCT), 0.5, None, 0.9), bs(b), 0.7)
        cue(b, 'cross-thud-logdrum', 'T2', 0, 'Red cross' + (' 1 of 2' if b == 30 else ' 2 of 2'), 'music')
    # typed note b32-38: 8 tuned clicks on the 16th grid (A minor tones)
    for b, m in zip((32.25, 33.0, 33.5, 34.25, 35.0, 35.75, 36.5, 37.25), (81, 76, 72, 81, 74, 76, 72, 69 + 12)):
        sfx.add(type_click(m, 1.0), bs(b), 0.25, 0.2)
        cue(b, f'type-click', 'T3', -12, 'Typed note keystroke cluster (tuned, 16th grid)')
    # b38 amber badge: low log drum + rim
    music['log'].add(logdrum(mtof(45), 0.9), bs(38), 0.8)
    sfx.add(rim(0.9), bs(38), 0.4)
    cue(38, 'badge-amber-thud', 'T3', -6, 'Amber badge "Changes requested"')
    # b40 hook card returns: callback motif A4 (+ C5 at b46 for the hard cut)
    music['mel'].add(anchor_note(69, 1.0, 0.6, 0.45), bs(40), 0.7)
    cue(40, 'recall-A4', 'T2', -3, 'Hook card returns as sent-back draft (A4 callback)', 'music')
    music['mel'].add(anchor_note(72, 1.0, 0.5, 0.4), bs(46), 0.6)
    cue(46, 'cut-C5', 'T3', -4, 'Hard cut Darika -> Priyanshu (C5)', 'music')
    # b51-52 revised: reverse swell into the cut
    sfx.add(rev_swell(0.5, [57, 60, 64], 0.5), bs(51.0), 0.4)
    cue(51, 'rev-swell-short', 'T2', -8, 'Revised drafts return (swell into b52)')
    # b55-56 pre-gold hush: reverse swell + reverse crash (no true silence)
    sfx.add(rev_swell(0.5, [57, 60, 64, 69], 1.0), bs(55), 0.4)
    sfx.add(reverse_crash(0.5, 0.5), bs(55), 0.25)
    cue(55, 'hush-reverse-swell', 'T1', -3, 'Picture dims 35 %: pre-gold hush (1 beat, audible air, no silence)')
    # b56 drums return on the bar line
    hits.add(impact(0.6, 0.5), bs(56), 0.4)
    cue(56, 'drum-return-impact', 'T2', -9, 'Board of 8 cards builds; drums return on the bar line')
    t1_times.append(bs(56))
    # b58 / b60: counter steps 6 and 7 of 8 as single plucks (not a ladder with the gold)
    for b, m, n in ((58, 72, '6 of 8'), (60, 76, '7 of 8')):
        music['mel'].add(anchor_note(m, 1.0, 0.45, 0.4), bs(b), 0.65, 0.2)
        cue(b, f'count-pluck-{n[0]}', 'T3', -5, f'Counter {n}', 'music')
    # build: riser b60 -> b64 plus snare roll b63 (16th triplet-free 32nds)
    k = 0.63 if PRO else 1.0
    sfx.add(tonal_riser(2.0, [60, 64, 67], 1.0, -12, 600), bs(60), 0.5 * k)
    sfx.add(noise_riser(1.9, 0.5), bs(60), 0.45 * k)
    cue(60, 'build-riser-C', 'T2', -8, '7 of 8 holds b60-b64, cursor on the last Approve')
    for i in range(8):
        music['drums'].add(snare_roll_hit(0.5 + 0.5 * i / 7), bs(63) + i * 3000, (0.45 + 0.35 * i / 7))
    cue(63, 'snare-roll', 'T2', -5, 'Snare roll over b63 (pre-hit gap 40 ms before b64)', 'music')
    # b64 GOLD: impact + C-major stab + single big chime, no cymbal
    hits.add(impact(1.0, 1.0), bs(64), 0.8)
    hits.add(glass_chime(84, 2.4, 1.0), bs(64), 0.6, 0.0)
    hits.add(snap(1.0), bs(64), 0.5)
    music['mel'].add(saw_stab([60, 64, 67, 72, 76], 0.9, 1.0, tau=0.3), bs(64), 0.85)
    t1_times.append(bs(64))
    cue(64, 'gold-impact', 'T1', -3, '"8 of 8" lands, board all green (gold impact, no cymbal)')
    cue(64, 'gold-chime-C6', 'T1', -4, 'The single big reward chime')
    cue(64, 'gold-stab-C-major', 'T1', -1.5, 'C-major lift stab', 'music')
    # b76 button pulse
    sfx.add(type_click(93, 1.0), bs(76), 0.35)
    cue(76, 'button-tick', 'T3', -9, '"Set live date" button pulses')
    # b80-83 live pings = A4 C5 E5 A5 (motif hit form, on the beat)
    for b, m, nm in ((80, 69, 'A4'), (81, 72, 'C5'), (82, 76, 'E5'), (83, 81, 'A5')):
        music['mel'].add(anchor_bell(float(mtof(m)), 0.9, 0.6), bs(b), 0.6, 0.35)
        cue(b, f'live-ping-{nm}', 'T2', -4, f'Live ping {b - 79}/4 (motif {nm})', 'music')
    # b86-88 breath: the lowpass dip is applied in mix; 1/16 gap (f1316-1319) before the logo
    cue(86, 'breath-lowpass', 'T2', 0, 'Board settles; low-pass breath b86-b88', 'music')
    cue(87.75, 'pre-logo-gap', 'T3', 0, 'f1316-1319 music gap (1/16) before the logo', 'music')
    # b88 LOGO sting: A4 C5 E5 A5 bells at 8th spacing, kick + snap on the first note, glass tail, no sub
    for i, m in enumerate((69, 72, 76, 81)):
        t = bs(88) + i * 12000
        music['mel'].add(anchor_bell(float(mtof(m)), 1.6 if m == 81 else 0.7, 0.9), t, 0.6, 0.0)
        music['mel'].add(kalimba(float(mtof(m)), 0.8, 0.4), t, 0.3)
    music['drums'].add(snap(1.0), bs(88), 0.9)
    hits.add(impact(0.5, 0.4), bs(88), 0.4)
    t1_times.append(bs(88))
    cue(88, 'logo-sting-A4', 'T1', -2, 'Logo sting hit + anchors mark draws (kick + snap + bell A4)', 'music')
    for i, nm in ((1, 'C5'), (2, 'E5'), (3, 'A5')):
        cue(88 + i * 0.5, f'logo-sting-{nm}', 'T1', -3, 'Logo sting motif note', 'music')
    # b95 loop pickup: reverse crash + filtered noise + sub-free whoosh landing on f0
    sfx.add(reverse_crash(0.5, 0.9), bs(95), 0.55)
    sfx.add(sweep_noise(0.5, 1200, 9000, 1.2, 'up', 1.0), bs(95), 0.45)
    cue(95, 'loop-pickup', 'T2', -6, 'Last beat: pickup into the f0 hit (dip to near-black, no fade)')


def tail_fold(bus, n=NS):
    a = bus.a
    out = a[:n].copy()
    extra = a[n:]
    m = min(len(extra), n)
    out[:m] += extra[:m]
    return out


def render():
    groove(); motifs(); hook(); sfx_cuts()
    # reverbs: mel and drums get short plate sends; sfx gets small
    out = {}
    for k, bus in music.items():
        a = tail_fold(bus)
        out[k] = a
    # reverb on mel bus (stereo plate)
    rv = music['mel'].reverb_send(IR, 0.20)
    out['mel'] = tail_fold(music['mel']) + rv[:NS]
    extra = rv[NS:NS + NS]
    out['mel'][:len(extra)] += extra
    sfx_a = tail_fold(sfx)
    np.save(os.path.join(BUILD, 'stems_pro.npy' if PRO else 'stems.npy'), np.stack([out[k] for k in ('kick', 'bass', 'drums', 'log', 'mel')] + [sfx_a, tail_fold(hits)]))
    json.dump(dict(cues=sorted(cues, key=lambda c: (c['beat'], c['cue'])), kicks=sorted(set(int(k) for k in kick_times)),
                   t1=sorted(set(int(t) for t in t1_times))), open(os.path.join(BUILD, 'cues_pro.json' if PRO else 'cues.json'), 'w'))
    print('stems rendered', len(cues), 'cues', len(kick_times), 'kicks')


if __name__ == '__main__':
    render()
