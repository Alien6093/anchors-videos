# Social plan, STAGE 3: "Monitor the live campaign in a Claude chat"
One edit decision list, two reframes. Source: `final-v2/anchors-zeko-B-live-metrics-60s-v6.mp4` (1920x1080, 30fps, 1800f). Every number below is already in `script_B_metrics_60s.md`. No new claims.

| | 9:16 (Shorts + Reels) | 4:5 (LinkedIn feed) |
|---|---|---|
| Canvas | 1080x1920 | 1080x1350 |
| Runtime | 23 bars = 92 beats @112 BPM = **49.286s = 1479 frames** (audio trimmed to 49.286; drop src f1799) | same |
| Feel | fast reframe hops every 1 to 2 beats, kinetic word-pop type | steadier, headline type, one hop per scene |
| Text safe zone | keep key content out of top 250 and bottom 450 (live area y 250-1470) | 80px margin all sides |

## 1. The cut in one line (only two jumps)
`src 0.000-2.143` (hook) + `src 6.429-12.857` (8 Live, "How is it performing?", 1,85,700 lock, tiles) + `src 19.286-60.000` (Two weeks later, crest, table, plan vs actual, Ashish, comments, audience, end card).
Every splice sits on a source bar line AND an output bar line (src beats 4/12, 24/36; out beats 4 and 16), so the source music and SFX slide in place. Dropped: title card + chat fade (src 2.143-6.429), scene 4 snapshot table and scene 5 forecast band (src 12.857-19.286, 6.429 incl. tile tail). Scenes 8-13 untouched. Time mapping: out = src for src<2.143; out = src - 4.286 for src 6.429-12.857; **out = src - 10.714 for src >= 19.286** (use this to move any source SFX cue).
Frame math: 1 beat = 16.0714f, 1 bar = 64.286f. Bars 7/14/21 land on exact frames (450, 900, 1350 = 45.000s, the end-card start). Other boundaries round to the nearest frame (table below).
Source has BURNED-IN captions at the top (y 20-90, e.g. "Day three. Still climbing.") and a chat input bar at y ~930-1000. All crop and stack windows start at **y >= 110** to exclude the captions; replace them with our own type. If `video-B` can re-render a caption-free plate, use that instead (not required).

## 2. Scene list (out order)
Src frames @30 are in/out (out exclusive). Out time = 0.5357 x beat.

| # | Out beats | Out sec | Out frames | Src sec | Src frames | Content | Speed / freeze |
|---|---|---|---|---|---|---|---|
| S1 HOOK | 0-4 | 0.000-2.143 | 0-64 | 0.000-2.143 | 0-64 | Teaser: counter races to **2,80,000** on the forecast band, green tick; hard black from 1.607 | out f0-3 = freeze of src f45 (landed 2,80,000, glow) so the first frame and cover are the payoff; out f4-47 = src f4-47 at 100%; black f48-63 |
| S2 | 4-8 | 2.143-4.286 | 64-129 | 6.429-8.571 | 193-257 | Board: "8 Live"; bubble "How is it performing?" rises | 100% |
| S3 | 8-16 | 4.286-8.571 | 129-257 | 8.571-12.857 | 257-386 | Impressions alone ramps to **1,85,700**, lock, five tiles cascade | 100%; 5f hit-stop (freeze src f305) at lock, removed from tile tail (src f381-385) so no drift |
| S4 | 16-20 | 8.571-10.714 | 257-321 | 19.286-21.429 | 579-643 | "Two weeks later." + chip Fri 23 Oct 2026; music dips | 100% |
| S5 CREST | 20-36 | 10.714-19.286 | 321-579 | 21.429-30.000 | 643-900 | "Update me."; 1,85,700 climbs to **2,80,000** (lock out f417); tiles: Likes 4,500, Comments 361, CPM **Rs 525 (plan Rs 540)**, Budget Rs 1,47,000 of Rs 1,50,000 | 100%; 6f freeze at lock (src f739), trim 6f from the src 747-753 glow hold |
| S6 | 36-44 | 19.286-23.571 | 579-707 | 30.000-34.286 | 900-1029 | Table FLIPs; Darika 68,900 to first; totals lock 2,80,000 / 4,500 / 361 / 1.74% | 100%. Never freeze before out f683 (src 1013): mid-count values are off-script |
| S7 | 44-52 | 23.571-27.857 | 707-836 | 34.286-38.571 | 1029-1157 | Plan vs actual card; marker crosses band ("above range"); chip "Rs 15 below plan" | 100% |
| S8 | 52-60 | 27.857-32.143 | 836-964 | 38.571-42.857 | 1157-1286 | "How did Ashish's post do?" sentence (44,800 / 728 / 63, **1.77%**), table, Published chip, View post | 100% |
| S9 | 60-72 | 32.143-38.571 | 964-1157 | 42.857-49.286 | 1286-1479 | "What are people saying?"; 71/25/4 bar; Neha K. praise, Sandeep R. pushback | 100% (hops carry the pace) |
| S10 | 72-84 | 38.571-45.000 | 1157-1350 | 49.286-55.714 | 1479-1671 | "Who did it reach?"; Roles / Locations / Industries / Seniority; Reached to Likers to Commenters | 100% |
| S11 END | 84-92 | 45.000-49.286 | 1350-1479 | 55.714-60.000 | 1671-1800 | End card, CTA button | 100%; drop last src frame; end card rebuilt natively (below) |

Speed ramps: none on the timeline (music stays on grid). Only three freezes: hook f0-3, lock 1,85,700 (5f), lock 2,80,000 (6f), each net-zero.

## 3. Hook (first 1.5s)
- Frame 0 = the film's own 2,80,000 flash at full legibility (freeze f45), thud + glass tick at f0. Frames 4-47 the counter re-races up through the forecast band and re-lands at 1.5s with the green tick, riser underneath; smash to black at 1.607.
- 9:16 text (frames 4-47, y 330-470, inside safe zone): word-pop "8 creators." (f4) then "2,80,000 impressions." (f22). 4 words.
- 4:5 text (top headline, y 80-200): "8 creators. 2,80,000 impressions. One chat." (6 words, fade up, no pop).
- f48-63 on black: "Every number. One chat." (the film's title) slams in on the beat. This is also the loop key.
- Cover/thumbnail: freeze f45 frame.

## 4. Reframe plan (source pixels x,y,w,h)
Layouts: **HC** = hard crop, window scaled to fill the canvas (9:16 window 545x970, scale 1.982; 4:5 window 776x970, scale 1.392; all y 110-1080). **SB** = stack-blur: sharp card (source window) scaled to canvas width (9:16: 1080 wide edge to edge, 28px radius; 4:5: 920 wide, 80px margins) centered at y~820 (9:16) / y~675 (4:5) over a blurred background (full frame crop 0,110,1920,970 scaled to cover, Gaussian blur 60, -40% brightness). SB wins whenever the content is wider than 776px, which is most of this film (tiles, counters, tables, cards are 1100-1800px wide). Hard crops only on narrow content.

| Scene | 9:16 | 4:5 | Why / hops |
|---|---|---|---|
| S1 teaser | SB (100,200,1720,800) scale .628 -> 1080x502; 1.15x punch-in on the landing | SB (100,200,1720,800) scale .535 -> 920x428 | Counter is 1570 wide: a hard crop would show "80,0". |
| S2 board | HC (420,110,545,970): names + Live status visible, date column cropped | HC (420,110,776,970) | "8 Live" chip at x 440-900 is the READ |
| S3 bubble+counter | SB (280,300,1400,520) scale .771; hop at b10 to tight (310,400,460,160) on the Impressions value | SB same, scale .657 | "1,85,700" is 650 wide at 140% punch |
| S3 tiles (b11-16) | SB (290,380,1340,360); hops (1 per beat): Impressions tile (310,405,460,145), Likes (790,405,400,145), Comments (1200,405,410,145) | SB (290,380,1340,360); no hops, slow push 100-106% | tile row is 1320 wide |
| S4 time jump | native kinetic "Two weeks / later." (new asset, Remotion KineticText) + chip Fri 23 Oct 2026; fallback SB (240,330,1440,300) | native, single line | text is 1340 wide in source |
| S5 crest counter (b20-28) | SB (280,400,1380,360) scale .783 + native overlay number at lock (see section 5) | SB scale .667 | counter 1310 wide; count-up reads from the overlay if the SB crop is small |
| S5 tiles (b28-36) | HC hops: CPM tile (520,110,545,970) -> tile at out y 880-1280 (safe); b28-31 Impressions/Likes/Comments hops as SB strip (300,390,1320,150), b32-36 HC on CPM + Budget tile | SB (290,380,1340,400) + CPM tile punch-in to 120% at b32 | "Rs 525 plan Rs 540" tile is x 646-1040, y 554-756 |
| S6 table | SB (140,260,1640,620) scale .659 (table text is small); recommended: native compact card Darika 68,900 / Shubhangi 61,500 / Ashish 44,800 / Total 2,80,000, both aspects | SB scale .561 or the same native card | source table 1600 wide, 26px text; do not freeze mid-count |
| S7 plan card | SB (340,180,1240,810) scale .871 -> 1080x705 | SB scale .742 -> 920x601 | card is 1200 wide; Est. CPM Rs 540 / Effective Rs 525 rows at y ~750 |
| S8 Ashish | SB (380,190,1180,640) scale .915; hops: sentence (380,250,1140,120) b53-56, table (380,430,1100,300) b56-58, chip row (380,740,760,100) b58-60 | SB same, scale .78, no hops (vertical ease only) | uses script tilt-down; READ1 "1.77%" gets callout |
| S9 comments | SB (380,150,1160,620) scale .931; b63 hop to card 1 (400,470,1120,280), b67 card 2 | SB scale .793; slow push 100-106% | card 1120 wide |
| S10 audience | HC (70,110,545,970) Roles panel + toggle (toggle out y 436-535, Roles top bar y ~670); hold through Reached/Likers/Commenters; last beat b83 widen to SB (60,300,1780,490) four panels | HC (70,110,776,970) (Roles + half Locations), b83 SB (60,300,1780,490) scale .517 | Roles is 540 wide: only clean hard crop in the film. READ = "HR Manager / Talent Acquisition" 38% likers, 47% commenters |
| S11 end | native vertical end card (logo, tagline, CTA button, small line); fallback SB (440,620,1040,500) | native | source end card is 1010px wide |

## 5. On-screen text, callouts, progress bar
Type: Inter/Plus Jakarta Black, white, 6px soft shadow, accent orange (#F2803A, the CPM orange from the film). Max 6 words per caption. 9:16 words pop one by one (2f each, 105% overshoot), sit at y 290-520 (below top 250) or above y 1470; 4:5 headline fades in whole at y 80-200. Source captions are cropped out (y>=110), ours replace them.

| Out beats | Sec | Text (both aspects) | Notes |
|---|---|---|---|
| 0-3 | 0-1.6 | 9:16 "8 creators. 2,80,000 impressions." / 4:5 "8 creators. 2,80,000 impressions. One chat." | hook |
| 3-4 | 1.6-2.1 | "Every number. One chat." | on black |
| 4-8 | 2.1-4.3 | "All 8 posts live." | |
| 8-16 | 4.3-8.6 | "Day three. Still climbing." | callout b11: "1,85,700" lock ring |
| 16-20 | 8.6-10.7 | "Two weeks later." + chip "Fri 23 Oct 2026" | the native card |
| 20-28 | 10.7-15.0 | "The final count." | **callout at lock b26 (13.929): native "2,80,000" at 200px, orange glow, 12-frame scale 100->108->100, tagline "impressions"** |
| 28-36 | 15.0-19.3 | "Rs 525 CPM. Plan: Rs 540." (6 words) | CPM tile orange ring pulses b32; chip "Rs 15 below plan" (src text) slides in b34 |
| 36-44 | 19.3-23.6 | "Ranks moved. Biggest reach first." | callout "Darika: 4th to 1st" b38; totals b43 |
| 44-52 | 23.6-27.9 | "Beat the plan. Reach and cost." | callout "above range" flag b48 (green) |
| 52-60 | 27.9-32.1 | "Zoom in on one post." | callout b55 "1.77% engagement rate" (cream bold); b58 "Published Wed 7 Oct" |
| 60-72 | 32.1-38.6 | "Praise and pushback. Both shown." | callout b62 "71% positive . 4% negative" |
| 72-84 | 38.6-45.0 | "Right people. Right roles." | callout b79 "Commenters: 47% HR / TA (Likers 38%)" |
| 84-92 | 45.0-49.3 | End card | see section 6 |

Progress bar: 6px, white 85% over 25% white track, radius 3, 920 wide x, filling linearly 0-100% over 1479f; 9:16 at y 1440 (just above the 450 dead zone), 4:5 at y 1264 (80px bottom margin). Beat ticks not shown. Bar color shifts to orange during S5 (b20-36) and returns.

## 6. End card, CTA, loop
- Build natively (vertical layout from S27 EndCardContent / AnchorsLogo): logo mark + "anchors"; line "Run your creator campaign in a chat."; orange button **"Ask Claude: How is it performing? -> anchors.in"** (two lines allowed in 9:16, button inside y 900-1300); small "Zeko AI, live on LinkedIn." Out f1350-1479; logo hit b84 (45.186 from src 55.9), button pulse b88-92. LinkedIn: same card, left-aligned headline feel, 80px margins.
- Loop: last 12 frames (f1467-1478) fade everything to the same near-black with the soft orange radial glow used behind the teaser; audio chord decays to silence plus a 0.3s reversed-swell inhale; frame 0 (freeze of 2,80,000 + thud) hard-cuts in. No fade-to-black on the last frame.

## 7. Platform touch
- **9:16 Shorts/Reels:** about 13 reframe hops (S3 x3, S5 x4, S8 x3, S9 x2, S10 b83), kinetic word-pop, callout numbers at 200px; first frame is the payoff; end card by f1350 so the loop restarts cleanly; burned captions make it work muted (no VO anyway).
- **4:5 LinkedIn:** headline-style hook with the claim sequence, calmer eases (no word-pop, 12f fade), fewer hops (only S3 tiles push, S5 CPM punch-in, S8 ease), professional tone ("Ranks moved", "Beat the plan"), larger static margins; first frame still the 2,80,000 flash (autoplays muted in feed); caption text is always legible at 1080 wide.

## 8. Beat table (112 BPM, 1 beat 0.5357s = 16.0714f, 1 bar 2.1429s = 64.286f, 23 bars = 92 beats = 49.286s)
| Beat | Bar.beat | Out sec | Out frame | Src sec | Src frame | Event |
|---|---|---|---|---|---|---|
| 0 | 1.1 | 0.000 | 0 | 0.000 | 0 | HOOK: f0-3 freeze on 2,80,000 (src f45) + thud; out f4 resumes src f4 (no time shift) |
| 1 | 1.2 | 0.536 | 16 | 0.536 | 16 |  |
| 2 | 1.3 | 1.071 | 32 | 1.071 | 32 |  |
| 3 | 1.4 | 1.607 | 48 | 1.607 | 48 | smash to black (src f48); 'Every number. One chat.' on black |
| 4 | 2.1 | 2.143 | 64 | 6.429 | 193 | CUT 1 (src bar 12). Sub hit. Board: '8 Live' wave done |
| 5 | 2.2 | 2.679 | 80 | 6.964 | 209 |  |
| 6 | 2.3 | 3.214 | 96 | 7.500 | 225 | user bubble 'How is it performing?' rises (src b14) |
| 7 | 2.4 | 3.750 | 112 | 8.036 | 241 | bubble whoosh; tool line |
| 8 | 3.1 | 4.286 | 129 | 8.571 | 257 | 1,85,700 counter ramp starts (src b16) |
| 9 | 3.2 | 4.821 | 145 | 9.107 | 273 |  |
| 10 | 3.3 | 5.357 | 161 | 9.643 | 289 |  |
| 11 | 3.4 | 5.893 | 177 | 10.179 | 305 | COUNTER LOCK 1,85,700: glass tick + 5f hit-stop; tiles cascade |
| 12 | 4.1 | 6.429 | 193 | 10.714 | 321 |  |
| 13 | 4.2 | 6.964 | 209 | 11.250 | 338 |  |
| 14 | 4.3 | 7.500 | 225 | 11.786 | 354 | tiles settled; filter-sweep SFX into cut |
| 15 | 4.4 | 8.036 | 241 | 12.321 | 370 |  |
| 16 | 5.1 | 8.571 | 257 | 19.286 | 579 | CUT 2 (src bar 36). 'Two weeks later.' whip; music dip |
| 17 | 5.2 | 9.107 | 273 | 19.821 | 595 |  |
| 18 | 5.3 | 9.643 | 289 | 20.357 | 611 |  |
| 19 | 5.4 | 10.179 | 305 | 20.893 | 627 | snare-tick riser (src 20.4-21.4) |
| 20 | 6.1 | 10.714 | 321 | 21.429 | 643 | CREST: full groove drops; bubble 'Update me.' (src b40) |
| 21 | 6.2 | 11.250 | 338 | 21.964 | 659 |  |
| 22 | 6.3 | 11.786 | 354 | 22.500 | 675 | 2,80,000 count-up starts (src b42) |
| 23 | 6.4 | 12.321 | 370 | 23.036 | 691 |  |
| 24 | 7.1 | 12.857 | 386 | 23.571 | 707 |  |
| 25 | 7.2 | 13.393 | 402 | 24.107 | 723 |  |
| 26 | 7.3 | 13.929 | 418 | 24.643 | 739 | LOCK 2,80,000: glass tick + impact + 6f freeze; glow |
| 27 | 7.4 | 14.464 | 434 | 25.179 | 755 |  |
| 28 | 8.1 | 15.000 | 450 | 25.714 | 771 | pull-back; tiles cascade (Likes 4,500, Comments 361, CPM Rs 525) |
| 29 | 8.2 | 15.536 | 466 | 26.250 | 788 |  |
| 30 | 8.3 | 16.071 | 482 | 26.786 | 804 |  |
| 31 | 8.4 | 16.607 | 498 | 27.321 | 820 |  |
| 32 | 9.1 | 17.143 | 514 | 27.857 | 836 | CPM Rs 525 (plan Rs 540) tile glows orange: ping |
| 33 | 9.2 | 17.679 | 530 | 28.393 | 852 |  |
| 34 | 9.3 | 18.214 | 546 | 28.929 | 868 |  |
| 35 | 9.4 | 18.750 | 562 | 29.464 | 884 |  |
| 36 | 10.1 | 19.286 | 579 | 30.000 | 900 | Final table, re-sort; Darika 4th to 1st |
| 37 | 10.2 | 19.821 | 595 | 30.536 | 916 |  |
| 38 | 10.3 | 20.357 | 611 | 31.071 | 932 | FLIP swish (src b58) |
| 39 | 10.4 | 20.893 | 627 | 31.607 | 948 |  |
| 40 | 11.1 | 21.429 | 643 | 32.143 | 964 |  |
| 41 | 11.2 | 21.964 | 659 | 32.679 | 980 |  |
| 42 | 11.3 | 22.500 | 675 | 33.214 | 996 |  |
| 43 | 11.4 | 23.036 | 691 | 33.750 | 1012 | totals lock click 2,80,000 (src b63) |
| 44 | 12.1 | 23.571 | 707 | 34.286 | 1029 | Plan vs actual card |
| 45 | 12.2 | 24.107 | 723 | 34.821 | 1045 |  |
| 46 | 12.3 | 24.643 | 739 | 35.357 | 1061 |  |
| 47 | 12.4 | 25.179 | 755 | 35.893 | 1077 |  |
| 48 | 13.1 | 25.714 | 771 | 36.429 | 1093 | marker crosses band top: tick; 'above range' |
| 49 | 13.2 | 26.250 | 788 | 36.964 | 1109 |  |
| 50 | 13.3 | 26.786 | 804 | 37.500 | 1125 | chip clicks 'Rs 15 below plan' |
| 51 | 13.4 | 27.321 | 820 | 38.036 | 1141 |  |
| 52 | 14.1 | 27.857 | 836 | 38.571 | 1157 | 'How did Ashish's post do?' bubble |
| 53 | 14.2 | 28.393 | 852 | 39.107 | 1173 |  |
| 54 | 14.3 | 28.929 | 868 | 39.643 | 1189 |  |
| 55 | 14.4 | 29.464 | 884 | 40.179 | 1205 | READ 1: 1.77% engagement rate |
| 56 | 15.1 | 30.000 | 900 | 40.714 | 1221 | table: 44,800 / 728 / 63 |
| 57 | 15.2 | 30.536 | 916 | 41.250 | 1238 |  |
| 58 | 15.3 | 31.071 | 932 | 41.786 | 1254 | count lock + View post chip pop |
| 59 | 15.4 | 31.607 | 948 | 42.321 | 1270 | check tick; kick drop into comments |
| 60 | 16.1 | 32.143 | 964 | 42.857 | 1286 | 'What are people saying?' |
| 61 | 16.2 | 32.679 | 980 | 43.393 | 1302 |  |
| 62 | 16.3 | 33.214 | 996 | 43.929 | 1318 | sentiment bar fills 71/25/4 |
| 63 | 16.4 | 33.750 | 1012 | 44.464 | 1334 | card 1 positive (Neha K.) |
| 64 | 17.1 | 34.286 | 1029 | 45.000 | 1350 |  |
| 65 | 17.2 | 34.821 | 1045 | 45.536 | 1366 |  |
| 66 | 17.3 | 35.357 | 1061 | 46.071 | 1382 |  |
| 67 | 17.4 | 35.893 | 1077 | 46.607 | 1398 | card 2 negative (Sandeep R.) |
| 68 | 18.1 | 36.429 | 1093 | 47.143 | 1414 |  |
| 69 | 18.2 | 36.964 | 1109 | 47.679 | 1430 |  |
| 70 | 18.3 | 37.500 | 1125 | 48.214 | 1446 |  |
| 71 | 18.4 | 38.036 | 1141 | 48.750 | 1462 |  |
| 72 | 19.1 | 38.571 | 1157 | 49.286 | 1479 | 'Who did it reach?' toggle UI |
| 73 | 19.2 | 39.107 | 1173 | 49.821 | 1495 | four panels land |
| 74 | 19.3 | 39.643 | 1189 | 50.357 | 1511 |  |
| 75 | 19.4 | 40.179 | 1205 | 50.893 | 1527 |  |
| 76 | 20.1 | 40.714 | 1221 | 51.429 | 1543 | click Likers |
| 77 | 20.2 | 41.250 | 1238 | 51.964 | 1559 |  |
| 78 | 20.3 | 41.786 | 1254 | 52.500 | 1575 |  |
| 79 | 20.4 | 42.321 | 1270 | 53.036 | 1591 | click Commenters (melody resolves on tonic) |
| 80 | 21.1 | 42.857 | 1286 | 53.571 | 1607 | line: Commenters skew HR/TA 47% |
| 81 | 21.2 | 43.393 | 1302 | 54.107 | 1623 |  |
| 82 | 21.3 | 43.929 | 1318 | 54.643 | 1639 |  |
| 83 | 21.4 | 44.464 | 1334 | 55.179 | 1655 |  |
| 84 | 22.1 | 45.000 | 1350 | 55.714 | 1671 | END CARD: logo hit, CTA |
| 85 | 22.2 | 45.536 | 1366 | 56.250 | 1688 |  |
| 86 | 22.3 | 46.071 | 1382 | 56.786 | 1704 |  |
| 87 | 22.4 | 46.607 | 1398 | 57.321 | 1720 |  |
| 88 | 23.1 | 47.143 | 1414 | 57.857 | 1736 |  |
| 89 | 23.2 | 47.679 | 1430 | 58.393 | 1752 |  |
| 90 | 23.3 | 48.214 | 1446 | 58.929 | 1768 |  |
| 91 | 23.4 | 48.750 | 1462 | 59.464 | 1784 | last beat: CTA pulse, soft inhale; frame 1478 = loop bridge |
| 92 | 24.1 | 49.286 | 1479 | 60.000 | 1800 |  |

Bar N starts at out beat 4(N-1), frame round(64.286 x (N-1)): bar 2 = f64 (CUT 1), bar 5 = f257 (CUT 2, dip), bar 6 = f321 (crest drops), bar 8 = f450 (15.000s), bar 15 = f900 (30.000s), bar 21 = f1350 (end card), bar 24 ends f1479.

## 9. Audio plan for the sound artist
Base: `audio-B/B_mix_v5.wav` (60.0s, same grid). Rebuild music in three slices, then crossfade each splice over 1 beat (0.536s, equal-power) so the bar lines stay on the grid:
1. **A** mix 0.000-2.143 (riser, silence at 1.607) -> out 0.000-2.143.
2. **B** mix 6.429-12.857 (E4 kick + pluck, marimba at 7.5, groove) -> out 2.143-8.571. Splice A/B on bar line out 2.143 with a NEW sub hit layered (copy the source sub hit at mix 2.143) so the cut lands.
3. **C** mix 19.286-60.000 (dip, crest at 22.5, resolve at 24.643, all scenes, end chord) -> out 8.571-49.286. Contains music mix 19.286 dip bar and end chord that decays to silence at 60.0 (= out 49.286). Keep as one piece, no edits inside.
Splice B/C at out 8.571: the source had the filter sweep up (17.143-19.286) before the dip; we skipped it, so add a NEW 1-bar filter-sweep/white-noise riser over out 6.429-8.571 (bars 4) resolving into the source whip at 19.286.
SFX: reuse `audio-B/B_sfx.wav` / `sfx-v5.mjs` cues with the time map out = src - 10.714 (src >= 19.286), src - 4.286 (6.429-12.857), unchanged for the hook. Key out times: bubble whoosh 3.750; 1,85,700 ramp 4.286-5.357; lock glass tick 5.893; whip 8.571; riser 9.65-10.71; **2,80,000 ramp 11.786-13.929, lock glass tick + impact 13.929**; tile tick 15.286; CPM glow ping 17.143; totals lock 23.036; marker cross 25.786; chip click 26.686; Ashish bubble pop 28.125, tool blip 28.661, count-up 30.268-31.071 + tick + chip click 31.071; check tick 31.607; bar fill 33.386; card whoosh 36.186; panel tick 39.786; toggles 41.250, 42.857; swishes 41.486, 43.093; logo hit 45.186; glass tail 45.486-48.286.
NEW cues: (1) f0 thud + glass tick on the freeze (0.000), sub 40Hz body 0.25s; (2) hit-stop tape-click for each freeze (5f at 5.893 and 6f at 13.929: duck music -6dB for the freeze length, then snap back); (3) 1-bar riser 6.429-8.571; (4) for 9:16 only: a soft tick on each crop hop (about 13 hops, 2 dB under T2, reuse the tile tick sample, pan alternating +-15%); (5) loop bridge: reversed-cymbal swell + air inhale 48.9-49.286 into the f0 thud; (6) end card: keep warm Am(add9) to C chord, tail to silence 49.286. Rules carry over: no coin/paywall sounds; no typing; duck pluck 3dB under the Ashish sentence (28.5-30.3). Loudness -14 LUFS integrated, -1 dBTP; LinkedIn version can be 1.5 dB quieter under mid-range since most views start muted.
Deliver stems: `B_stage3_music_49s.wav`, `B_stage3_sfx_49s.wav`, mix `B_stage3_mix_49s.wav` (49.286s exactly, fade last 50ms).

## 10. Posting copy (only script numbers)
**YouTube Shorts title (<=100):** 2,80,000 impressions. Rs 525 CPM vs a Rs 540 plan. One chat.
**Description:** Zeko AI's live LinkedIn campaign, read in a Claude chat. 8 creators, 2,80,000 impressions, Rs 525 effective CPM against a Rs 540 plan, Rs 1,47,000 spent of Rs 1,50,000. Ask Claude "How is it performing?" and see every number, one creator's post (44,800 impressions, 1.77% engagement rate), the comments (71% positive, 4% negative) and who it reached. Try it: anchors.in #Shorts #InfluencerMarketing #LinkedInMarketing #Claude

**Instagram caption:** 2,80,000 impressions. Rs 525 CPM against a Rs 540 plan. All read in one Claude chat. 
8 creators, 1 live campaign, one chat. Ask Claude: How is it performing? -> anchors.in
#creatormarketing #influencermarketing #linkedinmarketing #claude #anchors #zekoai #marketingtools #reels

**LinkedIn post (first-line hook):**
2,80,000 impressions at Rs 525 CPM, against a Rs 540 plan. All from one chat.
Zeko AI's live LinkedIn campaign ran with 8 creators. I asked Claude "How is it performing?" and got impressions, cost against plan, the top creators, one creator's post (44,800 impressions, 1.77% engagement rate), the comments (praise and pushback), and who it reached. 
What you see in 50 seconds is the whole loop: ask, read, decide.
Ask Claude: How is it performing? -> anchors.in
#CreatorMarketing #LinkedInMarketing #InfluencerMarketing

## 11. QA and risks
- Verify the source never shows an off-script number: S6 mid-FLIP values (e.g. 67,614, 2,77,064) appear in src f900-1012; allowed only in motion, no freeze, no cover frame, no hop-zoom on them.
- Burned-in top captions: y>=110 everywhere; in SB the blurred background may show ghosted caption text: use the y 110+ background crop.
- Campaign names "Zeko AI" and creator names are in the source already (client-approved film); confirm for social use.
- Section-7 assumptions in the script (dramatized tool outputs) apply: say "read in a Claude chat", not "live data from".
- Native rebuilds needed: S4 kinetic card, S6 compact table (optional), end card, callout overlays.
