# Anchors platform tour (120 s): audio production notes

The audio is music and SFX only, with no voiceover. Everything is synthesized from the code in `src/`. The build reads `project/src/timeline.json` each time it runs, so it can be re-run whenever the timeline changes. Nothing is hard-coded, including shot times, chapter times and the tempo map.

## Deliverables

| file | what |
|---|---|
| `mix.wav` | Final mix. 48 kHz, 24-bit stereo, exactly 120.000 s (5,760,000 samples). Targets: -14 LUFS integrated, true peak no higher than -1.3 dBTP. A copy is placed at `project/public/audio/mix.wav`. |
| `stems/music.wav` | Score as it sits in the mix, with the SFX ducking already applied. |
| `stems/sfx.wav` | The SFX bus. |
| `qa.txt` | Measurements for every file (format, duration, LUFS, LRA, true peak, sample peak, clipping, DC), click scan, cue-sync and downbeat checks, tempo map, section levels, per-second RMS and the full cue list. |
| `qa/*.png` | Spectrograms of the mix and both stems, close-ups of the hook (0–8 s) and ending (110–120 s), an RMS plot at 100 ms resolution (music in blue, SFX in orange, mix in black, chapter and act lines in grey), and the mix waveform. |

Both stems are scaled by one common gain, listed in `build/stems.json`. That means `music + sfx` equals the pre-limiter mix times a constant. The null test against `mix.wav` in `qa.txt` leaves a residual about 37 dB below the mix, which is the limiter's work only.

## Rebuild

```
bash audio/build.sh                      # about 50 s, deterministic (all noise is seeded)
TIMELINE=/path/to/other.json bash audio/build.sh   # build against a different timeline file
```

Requirements: Node 18 or later and ffmpeg. No npm packages are needed.

Pipeline:
1. `src/timing.mjs`: timeline → tempo map, arrangement anchors and cue list.
2. `src/music.mjs`: renders `build/music_raw.wav` and writes the section plan.
3. `src/sfx.mjs`: renders `build/sfx_raw.wav` and `build/cues.json`.
4. `src/mix.mjs`: event-keyed sidechain ducking, DC blocking and the pre-master.
5. Mastering in `build.sh`: static gain to -14 LUFS, then the ffmpeg `alimiter` look-ahead true-peak limiter with latency compensated (no clipper). The gain and ceiling are re-trimmed over five passes, and `apad`/`atrim` force exactly 120.000 s.
6. `src/stems.mjs`: writes the stems.
7. `src/qa.mjs` and `src/qa-images.sh`: QA.

The build copies `mix.wav` to `project/public/audio/mix.wav`.

## Approach

The brief was a premium SaaS product-tour feel: warm, confident and modern, building through the three acts to a clean resolve. The palette is soft synth pads, a muted detuned pluck arpeggio, an FM marimba hook motif and glass-bell sparkle. Underneath sit a sub and filtered-saw bass and a light electronic kit (kick, brushed and closed hats, clap layered with snare). There are no risers in the music bed beyond short pre-drop sweeps; the SFX carry the reveals.

**Key and harmony.** D major (Dmaj9 – Bm7 – Gmaj9 – Asus) for Launch. The Run act moves to a vi–IV–I6–V variation. At Measure (88.4 s) the key lifts a whole tone to **E major**, and the AI-analysis peak runs I–V–vi–IV. The ending is a cadence ii → V → I, landing on **Emaj9** on the end card. The hook's five hits play I–vi–IV–V–I, so the opening five seconds already state the theme's harmony.

**Tempo map.** About 118 BPM, chosen so that the structural anchors fall on downbeats. The anchors are the act starts, the AI-analysis chapter and the end card. For each span between anchors, `timing.mjs` picks an integer beat count whose tempo is close to 118 BPM. It prefers whole 4/4 bars and penalizes tempo jumps; any leftover beats become a pickup/fill bar. With the current timeline:

| span (s) | beats | BPM | bars |
|---|---|---|---|
| 0–5.0 hook | free | (1 hit/s) | five hits on the cuts |
| 5.0–70.4 Launch | 128 | 117.43 | 32 × 4/4 |
| 70.4–88.4 Run | 36 | 120.00 | 9 × 4/4 |
| 88.4–95.2 Measure (Track) | 13 | 114.71 | 3 × 4/4 + 1-beat snare pickup |
| 95.2–115.5 AI analysis | 40 | 118.23 | 10 × 4/4 |
| 115.5–120 end card | — | — | resolve and ring-out |

Each tempo change happens on a section change behind a crash or fill, so the ±2–4 % shifts are not heard as drift. `qa.txt` confirms that the music downbeats land within 1–13 ms of 0, 1, 2, 3, 4, 5.0, 70.4, 88.4, 95.2 and 115.5 s.

**Structure.** Section markers are placed at the bar nearest each chapter start. Each section's music level is auto-set to the energy map below (music-stem RMS from `qa.txt`, in dBFS):

| section | from (s) | content | music RMS |
|---|---|---|---|
| Hook | 0 | 5 hard hits (stab chord, sub and kick in the music; impact and transient in the SFX), soft drone, snare roll and riser lift into 5.0 | -17.2 |
| L1 Create campaign | 5.0 | kick on 1 and 3, brushed hats, sub bass, quiet pluck arpeggio, pad | -20.3 |
| L2 Set criteria | 15.2 | clap, 8th hats, sparse bass | -19.4 |
| L3 Pick influencers | 27.5 | full groove: four-on-the-floor kick, bass groove, marimba motif | -17.6 |
| L4 AI briefs | 45.9 | adds glass-bell sparkle | -17.2 |
| L5 Checkout | 60.2 | 16th plucks, filter sweep up | -16.5 |
| pre-drop | 64.3 | snare roll, sweep, the bass breathes on the last beat | (build) |
| L6 **Campaign activated** | 66.3 | drop on I: crash, stabs, full kit | -16.0 |
| R1 Review drafts (Run) | 70.4 | lift: new progression, octave marimba, bell sparkle | -15.4 |
| R2 Set live dates | 82.4 | lighter and quick: half-time kit, 16th plucks | -16.2 |
| pre-lift | 86.4 | roll into Measure | (build) |
| M1 Track performance (Measure) | 88.4 | key change to E, full kit with snare, stabs | -14.3 |
| M2 **AI analysis** (peak) | 95.2 | everything: driving 8th bass, octave melody, bells on 16ths, stabs | -13.3 |
| M3 / resolve | 111.4 / 113.5 | ii, then V with a roll; the bass breathes before the downbeat | -14.0 / -18.2 |
| End card | 115.5 | Emaj9 stab, pad, sub, three marimba notes, crash, then ring-out | -23.8 |

The tail is shaped by hand. Everything decays naturally after 117.5 s, a cosine fade then reaches digital silence at 119.92 s, and the last 80 ms are exact zeros. The mix measures -11.5 dBFS RMS on the sting, -41 dBFS at 119.0 s, -57 dBFS at 119.5 s and silence from 119.92 s.

## Cue design (SFX)

Every cue comes from `timeline.json`. Its time is the moment the sound is *heard*, and each one-shot is placed early by its lead-in. That means a whoosh's peak sits on the cut and a riser arrives on the reveal. The current build has 101 cues:

| type | n | rule (from the timeline) | sound |
|---|---|---|---|
| hit | 5 | `tIn` of every hook shot (before the first chapter) | Layered impact: noise crack, pitched sub thump and impact body. The fifth hit is bigger. |
| whoosh | 12 | shots with `transition: "whoosh"`; peak on `tIn` | Band-passed noise sweep with a double resonance and an L↔R pan sweep. Seeds and bands vary, so no two are identical. Shorter and quieter in the hook. |
| zoom | 8 | shots with `transition: "zoom"`; peak on `tIn` | Lower sweep, plus a tonal rise on the key's 5th and a soft landing thump on the cut. |
| riser | 5 | lift into chapter 1; the "creators matched" reveal; "Campaign activated!"; the AI-analysis chapter start; any shot whose `sfx` lists `riser` (arrives at the next shot) | Noise sweep with a rising saw/sine tone. Length is up to 2 s, capped by the gap. |
| swell | 1 | `fade` transitions tagged `whoosh` (the Run act start) | Soft reverse-cymbal swell. |
| success | 2 | the shot whose callout is "Campaign activated!" (big chime) and "Draft approved", or "Approve with one click" if that is missing (small chime) | Glass-bell arpeggio of the tonic chord in the current key. The big chime adds a soft stab and a high bell. |
| impact | 2 | the activation, and timeline `impact` tags after the hook ("65 creators matched instantly") | Gentle sub impact. |
| bell | 3 | timeline `chime` tags (match reveal, brief reveal, AI sentiment), skipped within 1.5 s of the end card | Two-note glass bell, quiet. |
| pop | 45 | every shot with a callout, at `tIn + 0.15 s` (not in the hook, and not where a chime or impact already marks the moment) | Soft sine "bubble". Pitch walks the major pentatonic of the current key and pans slightly toward the callout. |
| click | 17 | at most one per shot: the first click inside the shot (30 raw click events in 21 shots, thinned to 17). Skipped near pops and hits. | Short, dry and subtle: a 3.2 kHz noise tick with a 1.35 kHz body, panned toward the cursor. |
| sting | 1 | `endCard.tIn` | Short whoosh, impact, Emaj9 glass chord and a short cymbal swell that rings out under the fade. |

**Sidechain.** The music is ducked under every cue by an event-keyed envelope: -5 dB for hits and the sting, -4 to -4.5 dB for chimes and impacts, and -3 dB for whooshes, pops, clicks, bells and risers. Risers and swells duck gradually over their full length. Attack is 10 ms (150 ms ramp for whooshes), with a cosine release. Inside the score, the kick also sidechains the pad, bass and pluck.

**Sync verification** (`qa.txt`): every cue is heard within 30 ms (under 1 frame) of its timeline time. The 33 isolated percussive cues were also measured directly in `stems/sfx.wav` and land within 1 ms.

## Measured (current build; full detail in `qa.txt`)

| file | integrated | true peak | sample peak | duration | clipped | DC |
|---|---|---|---|---|---|---|
| mix.wav | -14.0 LUFS (LRA 7.2) | -1.3 dBTP | -1.51 dBFS | 120.000 s | 0 | ~0 |
| stems/music.wav | -15.3 LUFS | -1.6 dBTP | -1.66 dBFS | 120.000 s | 0 | ~0 |
| stems/sfx.wav | -20.2 LUFS | -1.3 dBTP | -1.31 dBFS | 120.000 s | 0 | ~0 |

Other checks:
- **Click scan:** no 2nd-difference spikes away from intended onsets.
- **Mastering delay:** 0 samples.
- **Ending:** -64 dBFS RMS in the last 0.5 s, and the last 80 ms are digital zero.
- **File sizes:** 34.6 MB each, under the 50 MB limit.

## Licence and source of every audio asset

- **All music and all SFX are original works created for this project.** They were synthesized sample-by-sample from the source code in `src/`: oscillators, filtered noise, FM, a Schroeder/Moorer reverb and a ping-pong delay, all written in plain JavaScript.
- **No third-party material was used.** There are no samples, loops, sample packs, presets, recordings or AI-generated audio, and no audio was downloaded.
- **Licence:** original work made for hire for Anchors; usable in this film and its cut-downs in all media, worldwide, without royalties or attribution. Composition, sound design and code are by the production's sound designer/composer (Claude, for the director).
- **Reused code:** `src/lib.mjs` (DSP toolkit) and `src/voices.mjs` (synth voices) are copied unchanged from `audio-common/`, the same crew's original engine for the earlier Anchors films. Same licence; nothing outside this folder was modified.
- **SFX design:** the voice designs in `src/sfx.mjs` are new for this film and adapted from ideas in `audio-common/sfx.mjs`. None of the pre-rendered `audio-common/sfx/*.wav` files are used; everything is rendered fresh at build time.
- **Tools:** ffmpeg (LGPL/GPL) is used only for measurement (`ebur128`, `astats`, spectrograms) and for the limiter/trim in mastering. Using it puts no licence encumbrance on the output audio.

## Limits and notes

- I could not listen to the audio. Quality was checked by measurement instead: loudness and peak, spectrograms of the full mix and of the hook and ending, the RMS plot, onset and downbeat timing, the click scan and the stem null test.
- The tempo map follows the chapters. If a chapter or act start moves, the BPM per span is re-solved automatically and stays near 114–120. Changes to shots s31–s33 only move cues (riser, pop, bell, whoosh), not the music grid.
- Sections start on the bar nearest each chapter. Mid-act chapters (2, 3, 5, 6, 8) can sit up to about 0.8 s from a bar line. The SFX carry the exact cut sync, and the music aligns exactly at the act, AI-analysis and end-card anchors.
- `build/` holds intermediates (about 190 MB of WAVs) and is regenerated by every build. It is listed in `.gitignore`.
