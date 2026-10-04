# ANCHOR motif (series-wide, Part 1 is the reference)

Reference render: `audio-social/v2/anchor-motif.wav` (peak -6 dBFS). Reference code: `audio-social/v2/anchor-voice.mjs` (`ANCHOR_NOTES`, `anchorPluck`, `anchorBell`, `anchorNote`).

## Notes (identical in all three parts)
- Key: A minor, 120 BPM (1 beat = 0.5 s = 15 frames @30 fps). Register A4 to A5, nothing below A4 (HP 250 Hz on the lead voice).
- **Full form (1.0 s + ring):** A4 (MIDI 69, 440.0 Hz) at 0.00 s, C5 (72, 523.25) at 0.25 s, E5 (76, 659.26) at 0.50 s, D5 (74, 587.33, passing) at 0.75 s, A5 (81, 880.0) at 1.00 s ringing 1.0 s. Straight 8th notes at 120 BPM (A4 on the beat, 8th-note spacing).
- **Hit form (one note per cut/event):** A4, C5, E5, A5 (optionally D5 between E5 and A5). A5 always lands on a cut, a bar line or a payoff.
- **Payoff lift:** C major. The motif notes never change (A4/C5/E5/A5); the chord underneath moves Am -> C (E5 is the common tone, C5 and A5 are chord/relative tones, so the motif still fits).
- **Series logo sting (b88 in every part, 1.5 s):** A4-C5-E5-A5 on bell, 8th spacing starting at b88 (A4 b88, C5 b88.5, E5 b89, A5 b89.5, A5 rings to ~b92), kick plus snap on the first note, glass tail, no sub.
- Harmony loop (music bed): Am9 | Fmaj7 | Cmaj7(add9) | G6, one bar each.

## Timbre (Part 1 reference; Part 2 and 3 only swap the layer named in social_audit_music C.3)
- Main voice "anchor pluck": two detuned saws (+7 / -7 cents) plus one square at 0.42 / 0.42 / 0.16, resonant 2-pole LP (Q 1.5) sweeping 6500 Hz -> 1300 Hz with tau 90 ms, HP 250 Hz, tanh saturation (drive 1.6), amp envelope 2 ms attack, tau 200 ms decay.
- Doubling "glass bell": sine partials at 1 / 2.76 / 5.4 / 8.93 x f0 with amps 1 / 0.35 / 0.16 / 0.06, decay tau 0.7 / 0.4 / 0.2 / 0.1 s, at -9 dB under the pluck (bell gain 0.3-0.45).
- Part 2 swaps the pluck layer for kalimba/marimba (+ log drum answer), Part 3 for a detuned-saw lead with bell shimmer; the bell doubling and the note list stay as above.
- Short plate-style reverb (decay 0.6, 18 % wet) on the reference, the bed keeps the motif at -6 dB relative to the groove except at hits.
