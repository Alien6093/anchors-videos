# STAGE 1 social cut plan: "Someone builds a campaign" (chat -> plan -> creators -> go-live)

One plan, two exports. **9:16 1080x1920** (Shorts + Reels) and **4:5 1080x1350** (LinkedIn feed). No VO, must work muted.
SOURCE: `video-v4/out/anchors-zeko-150s.mp4` (1920x1080, 30fps). Numbers/claims only from `script_v4.md`. No credits, no Deep insights (source scene 6 is never used), no ranking/"weak" wording.

## 0. Runtime (bar-exact, 112 BPM)
- **24 bars = 96 beats = 51.429s = 1542.86 frames.** Render 1543 frames (51.433s); the audio is trimmed to the 1543rd frame (0.005s, inaudible). Beat = 0.5357s = 16.071f. Bar = 2.1429s = 64.286f.
- Frame numbers below are rounded beat-grid frames (`round(beat*16.0714)`); all cuts land on a beat, major section starts land on bar lines (b4, b44, b52, b64, b88).
- Same picture timeline for both formats (one music edit, one SFX edit). Formats differ in crop, type animation and hook treatment only.

## 1. Source map (what we use)
| Used | Source | Notes |
|---|---|---|
| Hook flashes | freeze frames at src 118.8 (4 Live / 4 Scheduled), 73.5 (Payment successful Rs 1,47,000 + "Campaign activated"), 49.3 (16 to 8 roster + Before/After) | all three are settled frames, not mid-animation |
| Sc.1 blank chat | src 3.6-3.9 (dark chat, glowing input) | title is re-set by us, not v4's title card |
| Sc.2 prompt | src 5.0-8.5 | |
| Sc.3 three choices | src 10.6-14.6 | |
| Sc.4 plan | src 16.4-22.8 | Setup then Projection |
| Sc.5 creators + sort | src 23.4-27.4 | |
| Sc.7 cut to 8 | src 38.3-42.5 | user sentence + names only |
| Sc.8 16 to 8 | src 43.1-44.7, 46.5-49.2, hold 49.3 | |
| Sc.9 briefs | src 49.9-50.9, 51.3-56.8 | |
| Sc.12 quote | src 66.4-69.5 | |
| Sc.13 pay | src 70.7-73.4 | |
| Sc.22 dates | src 110.9-114.9 | |
| Sc.23 live | src 115.0-120.0 | |
| Skipped | sc.6 (deep insights/credits), sc.10-11 (brief edit, format chips), sc.14-21 (drafts/approvals), sc.24+ | approvals/metrics are Stage 2/3 |

**Baked-in source type to avoid:** v4 has white bold captions in the LEFT margin (x<~340 in every chat scene) and a top headline in sc.23 ("Live on LinkedIn. Three days, eight posts." at y 20-90) and "Pay once." at the bottom of sc.13 (y>~960). Every crop below starts at x>=350 and avoids these; we re-set all type ourselves. Also sc.7 has the line "These are the 8 creators furthest from HR ..." just above the names: use the split windows in section 4 so it is not on screen.

## 2. Beat table (shared timeline)
| Section | Beats | Len (beats) | Seconds | Frames |
|---|---|---|---|---|
| Hook (flash A/B/C + title) | 0-4 | 4 | 0.000-2.143 | 0-64 |
| Prompt | 4-11 | 7 | 2.143-5.893 | 64-177 |
| Three choices | 11-19 | 8 | 5.893-10.179 | 177-305 |
| Plan (Setup, Projection) | 19-29 | 10 | 10.179-15.536 | 305-466 |
| Creators + sort | 29-37 | 8 | 15.536-19.821 | 466-595 |
| Cut to 8 | 37-44 | 7 | 19.821-23.571 | 595-707 |
| 16 to 8 + cost/forecast | 44-52 | 8 | 23.571-27.857 | 707-836 |
| Briefs | 52-60 | 8 | 27.857-32.143 | 836-964 |
| Quote | 60-64 | 4 | 32.143-34.286 | 964-1029 |
| Pay (hard cut, key change) | 64-68 | 4 | 34.286-36.429 | 1029-1093 |
| Go-live dates | 68-74 | 6 | 36.429-39.643 | 1093-1189 |
| Live | 74-84 | 10 | 39.643-45.000 | 1189-1350 |
| Tease (one line) | 84-88 | 4 | 45.000-47.143 | 1350-1414 |
| End card + loop | 88-96 | 8 | 47.143-51.429 | 1414-1543 |

Bar lines: b4 (2.143s), b8, ... b44 (23.571s, "16 to 8"), b52 (27.857s, briefs), b64 (34.286s, pay), b88 (47.143s, end card).

## 3. Scene list: in/out, speed, on-screen type (<=6 words), callouts
Speed = source seconds / output seconds. All speed ramps are eased (ease-in-out, 4-frame ramp); type animations on the beat.

| # | Beats (out s / frames) | Source in-out (s / frames@30) | Speed / freeze | Type (both formats, see 5) | Callout |
|---|---|---|---|---|---|
| 1 Hook | b0-1 (0-0.536 / 0-16) freeze src 118.8 | 118.8 (f3564) | freeze, 4% push | "LIVE." | green dot pulse on "4 Live" |
| | b1-2 (0.536-1.071 / 16-32) freeze src 73.5 | 73.5 (f2205) | freeze | "PAID." | orange ring on "Rs 1,47,000" |
| | b2-3 (1.071-1.607 / 32-48) freeze src 49.3 | 49.3 (f1479) | freeze | "16 to 8." | circle the 8 |
| | b3-4 (1.607-2.143 / 48-64) blank chat src 3.6-3.9 | 108-117 | 0.56x | "One chat. Whole campaign." | none. Smash-cut (1 frame white flash) b2->b3 |
| 2 Prompt | b4-11 (2.143-5.893 / 64-177) | 5.0-8.5 (150-255) | 0.93x (1.0x + 0.25s hold on last frame) | "Start with a website." | highlight "zeko.ai" and "Rs 3 lakh" in the bubble |
| 3 Choices | b11-19 (5.893-10.179 / 177-305) | 10.6-14.6 (318-438) | 0.93x | "Three choices. Yours." | three selected chips get a cream outline, nothing else |
| 4a Setup | b19-21 (10.179-11.250 / 305-337) | 16.4-18.5 (492-555) | 1.96x, ramps down to 1.0x at the tab click | "The plan builds itself." | none |
| 4b Projection | b21-29 (11.250-15.536 / 337-466) | 18.5-22.8 (555-684) | 1.0x; 0.4s freeze on the range bar at src 21.5 | "Know the reach first." | circle "5.42-5.58 lakh" (**only** numbers from sc.4), then "Rs 540 CPM" tag |
| 5 Creators | b29-37 (15.536-19.821 / 466-595) | 23.4-27.4 (702-822) | 0.93x; punch-in during sort (src 26.0-27.0) | "Sort them your way." | tag "Engagement" sort; 3.64% and 1.97% highlighted |
| 7a Cut request | b37-40.5 (19.821-21.696 / 595-651) | 38.3-40.5 (1149-1215) | typing 1.0x then Enter | "Keep the closest fits." | highlight "8 closest fits" and "Rs 1,50,000" in bubble |
| 7b Names | b40.5-44 (21.696-23.571 / 651-707) | 40.5-42.5 (1215-1275) | 1.07x | (same caption holds) | names only, no descriptors; dip in music here |
| 8a 16 to 8 | b44-47 (23.571-25.179 / 707-755) | 43.1-44.7 (1293-1341) | 1.0x, 140% punch-in on the digit roll | "16 to 8." (large, same b44 bar line) | digit roll: 16 -> 8 |
| 8b Forecast | b47-50 (25.179-26.786 / 755-804) | 46.5-49.2 (1395-1476) | 1.68x (cells overwrite left to right) | "Cost and forecast follow." | orange flash on the changed values |
| 8c hold | b50-52 (26.786-27.857 / 804-836) | freeze 49.3 (1479) | freeze + slow 3% push | (same caption) | callout chips: "Budget Rs 3,00,000 -> Rs 1,50,000" and "2.69-2.77 lakh" (all from sc.8) |
| 9a Pills | b52-54 (27.857-28.929 / 836-868) | 49.9-50.9 (1497-1527) | 0.93x | "Briefs for all 8." | eight pills flash |
| 9b Brief | b54-60 (28.929-32.143 / 868-964) | 51.3-56.8 (1539-1704) | 1.71x (3.2x -> 1.4x ramp, labels stay readable) | "The brief writes itself." | six bold labels flash cream in turn |
| 12 Quote | b60-64 (32.143-34.286 / 964-1029) | 66.4-69.5 (1992-2085) | 1.45x, settles 1.0x on total | "Every rupee, itemised." | orange underline on "Total payable Rs 1,47,000" |
| 13 Pay | b64-68 (34.286-36.429 / 1029-1093) | 70.7-73.4 (2121-2202) | 1.26x; silence frame b64 (0.5 beat black/light), check draws on b64.8 | "Pay once." | "Rs 1,47,000" + "Campaign activated" |
| 22 Dates | b68-74 (36.429-39.643 / 1093-1189) | 110.9-114.9 (3327-3447) | 1.24x | "Set once. Final." | highlight 3 dates, Set live date button orange pulse |
| 23a Feed | b74-77 (39.643-41.250 / 1189-1237) | 115.0-116.6 (3450-3498) | 1.0x | "Live on LinkedIn." | hard cut on b74 with cymbal |
| 23b Board | b77-84 (41.250-45.000 / 1237-1350) | 116.6-120.0 (3498-3600) | 0.91x; settles on 4 Live / 4 Scheduled | "Three days. Eight posts." | date chips Wed 7 / Thu 8 / Fri 9 |
| 24 Tease | b84-88 (45.000-47.143 / 1350-1414) | freeze 119.8 (3594), pulls back to 90%, dims to 35% | freeze | "Next: drafts. Approvals. Results." | none |
| 25 End | b88-96 (47.143-51.429 / 1414-1543) | rebuilt from v4 end card (src 145.5-150; `video-v4/src`) | native render | see section 7 | |

Hook rule: **first 1.5s = three 0.536s payoff flashes (live, paid, 16 to 8)**, each with a one-word slab on the beat, a white 2-frame flash between. The "One chat. Whole campaign." title lands at 1.607s (b3), the scroll-stop is the payoff flash, not the title.

## 4. Crop windows (SOURCE pixels x,y,w,h) per scene
Source chat column is ~x 375-1545; widgets x ~360-1625; baked captions sit at x<340.

Layouts: **HARD** = crop scaled to fill the frame. **STACK** = blurred (48px, 55% brightness) full-frame copy as background + sharp card crop framed with 20px radius and soft shadow. Rule: STACK for anything wider than the output aspect (every widget/table/light page), HARD only for macro moments (big digits, cards).
- 9:16 HARD needs 608x1080 (1.78x upscale); source is already video, so restrict HARD to large type (digits, percentages, names). 4:5 HARD = 864x1080 (1.25x), safe for almost everything.
- 9:16 STACK: sharp card scaled to 1000px wide, centred in y 250-1470 (safe zone: nothing key above 250 or below 1470). 4:5 STACK: card scaled to 920px wide (80px margins), centred vertically in 1350 (keep y 80-1270).

| Scene | 9:16 | 4:5 |
|---|---|---|
| Hook A live board (118.8) | STACK card x380,y180,w1160,h680 (live chips + table + date chips) | STACK same card; headline above |
| Hook B pay page (73.5) | STACK card x300,y40,w1320,h1000 (light page; blurred bg is light cream) | HARD x528,y0,w864,h1080 is too narrow for "Payment successful" (x~550-1370): use STACK x300,y120,w1320,h840 |
| Hook C 16 to 8 (49.3) | STACK card x400,y200,w1120,h740 (roster + Before/After) | same |
| Sc.1 blank chat | HARD x660,y0,w608,h1080 (glowing input in lower third; title overlays) | HARD x528,y0,w864,h1080 |
| Sc.2 prompt | STACK card x360,y0,w1200,h560 (bubble + tool line), then at b8 HARD punch x700,y0,w608,h1080 on "zeko.ai / Rs 3 lakh" | STACK card x360,y0,w1200,h560 |
| Sc.3 choices | STACK card x360,y40,w1200,h820 (all three rows); pan down rows with 9:16 HARD cuts at b13 (Audience), b15 (Product), b17 (Motive) | STACK same, no cuts, slow 4% push |
| Sc.4a Setup | STACK card x358,y20,w1264,h900 | same |
| Sc.4b Projection | HARD x360,y0,w608,h1080 on the big digits and the range bar (digits x396-880) then b25 pull to STACK card x358,y20,w1264,h900 | STACK card x358,y20,w1264,h900 with a 115% push-in to digits (crop x380,y120,w1100,h800) |
| Sc.5 Creators | STACK card x316,y0,w1400,h1000 for cascade; at sort (src 26.0) HARD x1100,y0,w608,h1080 on right card column (engagement %) | STACK card x316,y0,w1400,h1000 |
| Sc.7a bubble | STACK x380,y100,w1160,h240 | same |
| Sc.7b names | STACK x380,y400,w1160,h330 (names only, excludes the "furthest" line) | same |
| Sc.8a digit roll | HARD x960,y0,w608,h1080 (Before/After right columns, Creators row) | HARD x900,y0,w864,h1080 |
| Sc.8b/c Forecast | STACK card x400,y200,w1120,h740 (roster + table) | same |
| Sc.9 brief | STACK card x360,y40,w1200,h1000 (copy is texture, labels are the read) | same |
| Sc.12 quote | STACK x380,y100,w1160,h500; HARD punch at total x1000,y0,w608,h1080 at b62 | STACK x380,y100,w1160,h500 |
| Sc.13 pay | STACK x300,y40,w1320,h1000, cropped to y<=940 to drop baked "Pay once." | STACK x300,y40,w1320,h900 |
| Sc.22 dates | STACK x408,y180,w1080,h560 (table + button) | same |
| Sc.23a feed | HARD x660,y0,w608,h1080 (post card) - if the feed is not portrait-friendly, STACK x380,y0,w1160,h1000 | STACK same |
| Sc.23b board | STACK x380,y180,w1160,h680 | same |
| Tease | same frame as 23b, dimmed | same |
| End card | native 9:16 render | native 4:5 render |

**Where stack-blur beats a hard crop:** every widget/table scene (plan, creators cascade, table values, quote, live board, dates) because the content is 1100-1300px wide; a 608px hard crop cuts rows/names off. Hard crop wins for single big numbers (digits, %, total) and the blank chat. The light payment page needs a light-tinted blur behind it so it reads as one hard scene change, not a dark bar.

## 5. On-screen text system
- Safe zones: **9:16** key content y 250-1470 (avoid top 250, bottom 450); text block sits at y 1040-1300 (just below the card, above the bottom UI) or y 280-420 above the card. **4:5** all text/cards inside 80px margins (x 80-1000, y 80-1270).
- Type: one bold grotesk (v4 caption face, white, 700), 72-96px for 9:16, 56-72px for 4:5; a single orange word per caption (orange reserved for actions/numbers as in v4).
- **9:16 kinetic:** each word snaps in on its beat (2-frame scale 120%->100%, 8px motion blur), hard exit on the next beat; two caption swaps max per scene. Progress bar, chapter pill and callouts pop with a 3-frame overshoot.
- **4:5 (LinkedIn) professional:** headline-style sentence case, fade+8px rise over 6 frames, hold full line, no scale slam; a small grey "Zeko AI x anchors" tag top-left is optional (no credits beyond v4 end card line).
- **Progress bar:** 8px, 20% white track, orange fill linear over the full 1543 frames. 9:16 at y=258 (x 60-1020, below top unsafe area); 4:5 at y=1262 (x 80-1000). Chapter pill swaps text on the beat when reached: **Chat b4, Plan b19, Creators b29, Live b64**.
- **Numeric callouts (only these, all from script_v4.md):** "5.42-5.58 lakh" (plan), "Rs 540 CPM", "16 -> 8", "Rs 3,00,000 -> Rs 1,50,000", "2.69-2.77 lakh", "Rs 1,47,000", "Wed 7 / Thu 8 / Fri 9", "8 creators". No credit counts, no metrics (Stage 3).
- Caption per scene: see the table in section 3 (all <=6 words; 7a "Keep the closest fits.", 8 "Cost and forecast follow.").

## 6. 9:16 vs 4:5 treatments
| | 9:16 Reels/Shorts | 4:5 LinkedIn |
|---|---|---|
| Hook | 3 payoff flashes (live/paid/16 to 8) + word slabs LIVE. / PAID. / 16 to 8., then title | headline-style: b0-2.2 hold of the live board with "A full creator campaign. One chat." (6 words, sentence case), b2.2-3 one quick payoff flash (paid), b3 title |
| Cuts | extra intra-scene punch cuts on the beat (choices b13/b15/b17, projection punch, sort macro), 1-2 frame white flashes | longer holds, slow 3-4% push-ins, cross-dissolves only at the quote->pay bar line |
| Type | kinetic word-by-word, 76-96px, orange accent word | sentence-case headlines 56-72px, fade, smaller callouts |
| Tone | punchy: "16 to 8." | professional: "Cost and forecast follow." |
| Bar/chips | progress at y258, chapter pill above card | progress at y1262, chapter label beneath card |
| End | dark card, logo, CTA pill centred in y 500-1300 | same, CTA 80px margins |

## 7. End card (v4 CTA reused) and loop
- Beats b88-96 (47.143-51.429s), rebuilt natively (no crop): dark card, logo mark draws b88-89, **anchors**, **Run your creator campaign in a chat.** fades line by line b89-91, CTA button **Connect anchors to Claude -> anchors.in** pulses b91-95, small "Zeko AI, live on LinkedIn." at b92 (kept from v4; it is the only claim).
- CTA must sit inside safe zones (9:16 y 600-1250; 4:5 inside 80px margins). Do not add the Stage 2/3 teasers here (the tease is b84-88 only).
- **Loop:** b95 (the last 0.536s) cuts to a 2-frame white flash then the first frame of the video is Hook A (live board), so the final frame matches the first (white flash + "LIVE."). Music: end chord decays to silence at 51.0s; the hook's sub hit at 0.0s makes the loop seamless.

## 8. Audio plan for the sound artist
Music = 112 BPM, A minor groove that flips to C major at pay (as v4). Re-edit of `video-v4/out/music_raw.wav` (stems via `audio-common/stems.mjs`, SFX in `audio-common/sfx/`, cue names T1/T2 from script_v4 sec. 3/8). Slices start on source beats, bar index = source_seconds / 2.1429.

| Out beats (bar) | Source slice | Purpose |
|---|---|---|
| b0-4 (bar 0) | NEW hook: three sub hits + riser b0-b3, smash at b3; pad from src 1.9 (A minor) under the title | payoff flashes |
| b4-24 (bars 1-5) | src bars 2-6 (4.286-15.0) | kick + pluck, hats, filter sweep up into plan |
| b24-44 (bars 6-10) | src bars 7-11 (15.0-25.7) | marimba/groove lock at Projection; full groove |
| b40.5-42.4 | dip: bass + click pulse only (v4 40.5-42.0 edit, 1.5s) | cut-request send |
| b44-52 (bars 11-12) | src bars 20-21 (42.857-47.143) | rising filter on "16 to 8" |
| b52-60 (bars 13-14) | src bars 24-25 (51.43-55.71 arpeggio motif) | briefs |
| b60-64 (bar 15) | src bar 31 (66.43-68.57) | pad rise into pay |
| b63.5-64.5 | silence / room tone (0.5 beat) | pay silence |
| b64-72 (bars 16-17) | src bars 33-34 (70.71-75.0) | key change to C major, warm chord, glass timbre |
| b72-74 (bar 18 first half) | src bar 35 groove restart, pitched as riser/snare build | dates |
| b74-84 | src bars 54-56 (115.71-120.0); cymbal swell pre-hit from src 115.0 placed on b74 | live peak |
| b84-88 (bar 21) | src bar 56 breath, filtered low-pass | tease |
| b88-96 (bars 22-23) | src 145.71-150 (end chord Am(add9) -> C) | end card |

SFX to reuse (v4 cue ids): T2 key clicks (prompt), T1 Enter thock + bubble whoosh, T2 chip clicks (choices, rising), T2 widget whoosh + tab click, T1 range-bar lock click, T2 card taps + sort swish, T1 Enter thock (cut request), T1 digit-roll impact, T2 six label pings (brief), T1 pay-chip click + total lock click, T1 payment glass chime + T2 check tick, T1 confirm chime (dates), T1 cymbal swell + T1 live pings (live). New cues needed: (1) three-hit flash stack at b0/b1/b2 with white-flash whooshes (rising pitch), (2) smash/impact at b3 (title), (3) 6-frame sub hit on each payoff flash freeze, (4) loop-return whoosh at b95 into b0, (5) short lift/riser under the tease, (6) low-pass "breath" at b84, (7) SFX ducking for 9:16 extra punch cuts (soft tick on each: choices b13/b15/b17, projection punch, sort macro).
Mix: peak -14 LUFS short-term target for Reels/Shorts, -16 LUFS integrated for LinkedIn; SFX 3 dB under music except payment chime and the cymbal; must work muted (every key message is also on screen).

## 9. Posting copy
### YouTube Shorts
- **Title:** One chat built a whole creator campaign (8 creators, live on LinkedIn)
- **Description:** Zeko AI ran a full LinkedIn creator campaign inside a Claude chat. Start with a website, see the plan and projected reach before you spend, pick your creators, cap the budget, pay once, go live over three days. Connect anchors to Claude: anchors.in #Shorts #CreatorMarketing #LinkedIn #Claude

### Instagram Reel
- **Caption:** A whole creator campaign, built in one chat. Website in, plan out. 16 creators to 8. Rs 1,47,000 total. Live on LinkedIn in three days. Connect anchors to Claude at anchors.in
- **Hashtags:** #creatormarketing #influencermarketing #linkedinmarketing #b2bmarketing #marketingautomation #claudeai #aitools #growthmarketing #anchors #zekoai

### LinkedIn post
First line (hook): **We ran a full LinkedIn creator campaign inside one Claude chat.**
Post text: Start with a website. The plan shows projected reach before you spend (5.42-5.58 lakh impressions for Zeko AI). Sort the matched creators, cut 16 to 8, cap the budget at Rs 1,50,000, and see cost and forecast update together. Briefs go out, you pay once (Rs 1,47,000), and eight posts go live over three days. This is part 1 of 3: next, drafts and approvals, then results. Connect anchors to Claude: anchors.in

## 10. QA checklist
- Every caption <= 6 words; first caption/flash visible at frame 0; no caption inside the 9:16 top 250 / bottom 450 or the 4:5 80px margin.
- No v4 baked captions visible (left margin text, top headline in sc.23, "Pay once." baked bottom in sc.13, "furthest" line in sc.7).
- No credits, no Deep insights, no metrics numbers (2,80,000 etc.) in Stage 1.
- Audio trimmed to 1543 frames; last frame = first frame flash for loop.
