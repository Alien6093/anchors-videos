# anchors social series, SCRIPT v2: one campaign, three parts (Build / Review / Monitor)

Supersedes `social_plan_stage{1,2,3}.md` for story, captions, scene order, beat grid and posting copy. Built from `social_audit_script.md` (+ REWRITE BRIEFS), `social_audit_video.md`, `social_audit_music.md` and the client decisions below. Today = 2026-10-01.

Audit ID prefixes used here: **[SA]** script audit (S1-xx, S2-xx, S3-xx), **[VA]** video audit (S1V/S1F/S2V/S2F/S3V/S3F-xx), **[MA]** music audit (S1/S2/S3-xx in its section B, C.x for cross-cutting).

---

## 0. Ground rules (apply to all three parts)

### 0.1 Client decisions (final) and how they are applied
1. **One real, continuous campaign (Zeko AI).** Part 1 BUILD (Claude chat) -> Part 2 REVIEW (briefs out, drafts reviewed and approved, dates set, posts go live) -> Part 3 MONITOR (same live board, metrics). One timeline, no rewinds (see section 4).
2. **Creator names and photos stay as in the films.** Used where the source shows them: the 8 final creators (Ashish, Riya, Gunjan, Priyanshu, Jyoti, Sunidhi, Shubhangi, Darika), Neha K., Sandeep R. Only change: the scene that listed the 8 REMOVED creators (v4 sc.7b, "furthest from HR") is not used, because it contradicts the "closest fits" story, not because of consent.
3. **120 BPM, each video exactly 24 bars = 96 beats = 48.0 s = 1440 frames @30 fps; 1 beat = 15 f = 0.5 s; 1 bar = 4 beats = 60 f = 2.0 s.** 9:16 1080x1920 (Shorts + Reels), 4:5 1080x1350 (LinkedIn). One picture timeline per part, both formats cut on identical frames.
4. **No VO.** Captions + music + SFX; works muted.
5. **No credits and no deep insights anywhere** (v4 sc.6 never used; no credit chip; no "1 credit" language).
6. **Honesty limit applies to posting copy only.** On screen, the footage is presented as the campaign (no "sample/dramatised" tags, per decision 1). Untagged copy is written as a walk-through ("here is how..."). Outcomes (approval counts, impressions, CPM, sentiment) appear in copy only inside lines tagged `[REAL: confirm before posting]`. All on-screen numbers are exactly those in `script_v4.md`, `script_A_brief_review_60s.md`, `script_B_metrics_60s.md`. No new numbers.

Risk acknowledged, not a blocker: with no on-screen tag, [SA S2-07] and [SA S3-02] are handled in copy only (see section 7 and the open-points list).

### 0.2 Grid arithmetic (verified)
- 24 bars x 4 beats = 96 beats. 96 x 15 f = **1440 f**. 1440 / 30 = **48.000 s**.
- Every scene boundary below is an integer beat, so frame = beat x 15 (exact). Every boundary used is also listed with its frame. Scene beat-lengths sum to 96 in each part (checked in each table's "Sum" line).
- Bar lines (every 4 beats = 60 f) carry all major scene starts. Non-bar-line boundaries are marked `(off-bar)` and are always on a half-bar (even beat).

### 0.3 Series furniture (identical in all parts)
- **Part chip** (persistent b0-b88, top-left): pill, caps, "PART 1 / 3  BUILD", "PART 2 / 3  REVIEW", "PART 3 / 3  MONITOR". 9:16: x 60, y 280, 44 px text. 4:5: x 80, y 80, 36 px text. Never overlaps caption or card (card starts below it).
- **Removed everywhere:** progress bar, chapter pills (01 CHAT / 02 PLAN...), "Zeko AI, live on LinkedIn." fine print, "Zeko AI x anchors" title card, all v4/A/B title cards, source orange rings and callout pills over UI. [VA S1V-06, S1V-10, S1F-04, SA S1-12]
- **Layout grid, 9:16 (1080x1920):** Part chip y 280-340. Caption band y 360-560 (above the card, never on it). Card band y 600-1380 (card 1000 wide at x 40). Footer y 1400-1470 reserved (chip lines only). Right 120 px kept clear (no text x>960 between y 900-1500). Nothing key in top 250 or bottom 450.
- **Layout grid, 4:5 (1080x1350):** margins 80 px. Part chip y 80-124. Headline band y 150-300 (sentence case, 60 px, left aligned x 80, max 2 lines, no orphan word). Card band y 340-1270 (card 920 wide at x 80).
- **Caption engine rules:** caption is fully present and legible at frame 0 (kinetic = a 108%->100% scale punch, never an opacity reveal at f0). Fixed per-word slot widths (no "One chat.Whole", no "finalcount"). Line breaks authored by hand (no orphans: "chat.", "back.", "540."). Caption holds until its scene ends or swaps on a beat; a caption never appears while a number in the same scene is mid-count.
- **UI legibility rule:** anything the viewer must READ is natively re-rendered at >= 44 px output (>= 40 px at 4:5) from the Remotion components in `video-v4/src`, `video-A/src`, `video-B/src` (same design system, so it looks like the film). Source footage is used for texture, motion and state changes. Where this file says **NATIVE**, the element is re-rendered, not cropped.
- **Number rules:** (a) one carrier per fact per frame (UI card OR caption OR chip, never two); (b) every counter that is shown at rest shows its FINAL value; (c) ramps are continuous motion (<= 30 f) and are never frozen, captioned over, or used for a cover frame; (d) hold on the landed value >= 20 f; (e) crossfades between two number-bearing plates are forbidden (hard cut or 2-frame dip); (f) UI mid-count frames (Rs 0 / Rs 1,45,405 / Rs 2,89,625 / 3,01,314 / 4,179 / 448 / 513 / 42,101 etc.) are never on screen. [VA cross-cutting 1, 2, 6]
- **Captions:** 9:16 kinetic, <= 5 words per caption (max two caption swaps per scene), caps-free sentence case, one orange accent word (#E8743B). 4:5 sentence-case headline, <= 8 words, one headline per scene.
- **CPM gloss:** once per video where CPM first appears (Part 1 reach card, Part 3 plan card): "cost per 1,000 views" in the card label. Lakh grouping stays as in the film; the plain-number gloss "(280,000)" lives in posting copy only (no duplicate on screen).
- **Hook rule:** frame 0 is a settled hero frame (no white-flash ghost, no clipped text, no mid-count). One exception: Part 3 frame 0 is deliberately the end state of Part 2 (continuity); Part 3 ships with an uploaded cover (section 3.3).

### 0.4 Loop and end card family (all parts)
End card = b88-b96 (f1320-1440, 4.0 s), native, centred on the same axis in both formats and in all three parts (fixes [VA S3F-19, S2V-20]).

| Time | Element (identical in all parts unless noted) |
|---|---|
| b88 (f1320) | Logo sting hit + anchors mark draws (logo sting = ANCHOR motif A4-C5-E5-A5 on a bell, music file shared) |
| b88-b90 (1.0 s) | **Teaser line** above the logo (1.0 s then fades): Part 1 "Next: Part 2, the drafts" / Part 2 "Next: Part 3, the results" / Part 3 "That is the whole campaign. Start at Part 1." |
| b89-b91 | Line: **Run your creator campaign in a chat.** (break after "campaign.", no orphan) |
| b90 | Button (held to b96, 3.0 s): **Try it: anchors.in** |
| b91 | Sub-line: Shorts/Reels `Link in bio.  Part n of 3.` / LinkedIn `Link in the first comment.  Part n of 3.` |
| b95 (f1425-1440) | Loop pickup: groove stays (no fade); last 6 frames brightness dip to the f0 hero (see per-part loop notes) |

Same CTA wording in all three parts (one action: "Try it"). No "Connect anchors to Claude", "Brief your creators in Claude", "Ask Claude: How is it performing?" variants. [SA S1-13, S2-12, S3-12, section 8.0]

---

## 1. PART 1 of 3: BUILD

**Story:** someone types one website and one budget into a Claude chat; the plan, reach, creators, cost and briefs follow; one payment; briefs go out. **Ends:** paid + briefs sent (Mon 28 Sep 2026). No dates, no live board.

### 1.1 Hook (first 1.0 s, cover)
- **Chosen hook (audit option 1, sharpened):** 9:16 `One website. One budget.` (b0-b2) then `A creator campaign. In Claude.` (b2-b4). 4:5 headline `One website, one budget, a full creator campaign.` (8 words) + small chip `In one Claude chat`.
- **Frame 0 / cover:** the settled prompt bubble, NATIVE at 56 px: "Build a LinkedIn creator campaign for https://zeko.ai. Budget Rs 3 lakh." on dark chat, caption already complete, Part chip on. Reads as a thumbnail: promise + the exact input. No LIVE/PAID/16 to 8 flashes. [SA S1-01, S1-02, S1-14, VA S1V-01, S1V-03]
- Names the product (Claude), the object (creator campaign) and LinkedIn (bubble text) inside 2 s. [SA S1-03, S1-17]

### 1.2 Beat sheet (120 BPM; 96 beats)

| # | Beats | Sec | Frames | Source film + in/out (s, @30 f) | Speed / treatment |
|---|---|---|---|---|---|
| 1 HOOK | 0-4 | 0.0-2.0 | 0-60 | `video-v4/out/anchors-zeko-150s.mp4` freeze of src **8.3 s (f249)**: prompt bubble risen, tool line "Used anchors integration, loaded tools" blip (verify first fully settled frame in 8.2-8.6) | Freeze + 4% push; bubble text NATIVE over it; thud on f0 |
| 2 ASKS | 4-8 | 2.0-4.0 | 60-120 | v4 plate src **13.0 s (f390)** (sc.3 all three chips selected, dimmed 35%) | NATIVE chip rows pop one per beat (b4 Audience "HR professionals", b5 Product "Zeko AI Platform", b6 Motive "Awareness"), b7 tool chip "CLEO - Build the full campaign plan" |
| 3 PLAN | 8-12 | 4.0-6.0 | 120-180 | v4 **16.4-18.5 (f492-555)** @1.05x as motion plate (sc.4 Setup) | NATIVE Plan card: Storyline "Structured interviews still hide gut decisions", Direction "Myth-busting - hidden truth" (both exact v4 copy) |
| 4 REACH | 12-20 | 6.0-10.0 | 180-300 | v4 **18.5-21.5 (f555-645)** @1.5x for b12-b16 (range bar draws); freeze **src 21.8 (f654)** b16-b20 | NATIVE Projection card from b12.5 (covers the UI's own counters). Lock click + 4 f hit-stop on f240 (b16) |
| 5 CREATORS | 20-32 (off-bar end ok, bar line at b32) | 10.0-16.0 | 300-480 | v4 **23.4-26.0 (f702-780)** @0.87x for b20-b26 (card cascade, 16 cards); b26 chip "Sort: Engagement" click (src 26.0); **hard cut at b27 (f405)** to settled post-sort frame **src 27.4 (f822)**, held b27-b32 | Crop starts below the tab row (so "(16)" is not in the UI, caption carries 16). Right-column HARD crop on the engagement values at b27 |
| 6 CUT | 32-44 | 16.0-22.0 | 480-660 | v4 plate **38.3 (f1149)** dimmed behind; typing retimed natively; Enter at b38 = src 40.5 (f1215) frozen as dim plate | NATIVE bubble typed on 16ths b32-b38 (text exact v4: "Cut to the 8 closest fits and cap the budget at Rs 1,50,000."), Enter thock b38 (f570), NATIVE tool pills b38-b44 "CLEO - Adjust the creator list", "CLEO - What this campaign costs"; riser from b36, snare roll from b40, kick out on b43 |
| 7 DROP | 44-52 | 22.0-26.0 | 660-780 | v4 **43.1-44.7 (f1293-1341)** reference for b44-b47; **46.5-49.3 (f1395-1479)** reference for b47-b52 | NATIVE digit roll "16" -> "8" (roll <= 8 f, "16" held 6 f before, "8" held >= 24 f; no mid value held) then NATIVE Before/After card (2 rows) with cells overwritten left to right on b47, b48, no count-ups |
| 8 BRIEFS | 52-60 | 26.0-30.0 | 780-900 | v4 **49.9-50.9 (f1497-1527)** @1.0x for b52-b54 (8 name pills); v4 **51.3-56.8 (f1539-1704)** plate @1.83x for b54-b60 | b52-54 8 pills (names) ; b54-60 NATIVE label stack Ask / Key points / Example angles / Avoid / Hashtags / Engagement tip, one per 0.5 beat group; b58-60 Avoid line highlighted: "Avoid: Press-release tone ("excited to announce", "revolutionary")." (v4 sec.5 L286) |
| 9 QUOTE | 60-64 | 30.0-32.0 | 900-960 | v4 **66.4-69.5 (f1992-2085)** reference | NATIVE quote card, rows land on half-beats (no count-up); total row held >= 20 f before cut. Music breakdown |
| 10 PAY | 64-68 | 32.0-34.0 | 960-1020 | v4 **70.7-73.4 (f2121-2202)** layout reference only | HARD cut at b64 to LIGHT cream page, NATIVE (5 elements as v4 sc.13): stepper, green check (draws f960-975), "Payment successful", **Rs 1,47,000** shown at final value from f960, chip "Campaign activated", "Briefed 8 . Mon 28 Sep 2026". Dark blur plate behind (fixes [VA S1V-02]). Key change to C major on f960 |
| 11 SENT | 68-76 | 34.0-38.0 | 1020-1140 | v4 **75.0-77.0 (f2250-2310)** @1.0x for b68-b72; freeze **src 77.4 (f2322)** + 3% push b72-b76 | Back to chat: "Payment received. Briefs sent to 8 creators." (NATIVE line), 8 avatars stamp "Brief sent", 0.1 s stagger from b69, light burst on 8th (peak) |
| 12 RECAP | 76-88 | 38.0-44.0 | 1140-1320 | no source (NATIVE text card over dimmed plates of the three earlier UI states: roster pills, Before/After, brief labels) | Three phrases, 2.0 s each (b76, b80, b84); b84-88 calm breath into the logo |
| 13 END | 88-96 | 44.0-48.0 | 1320-1440 | native | see 0.4 |

Sum: 4+4+4+8+12+12+8+8+4+4+8+12+8 = **96 beats = 1440 f**. Boundaries on bar lines: b0, 4, 8, 12, 20, 32, 44, 52, 60, 64, 68, 76, 88, 96 (b20 and b32 are bar-aligned; b27 is an internal hard cut at f405, off-bar by design, on a beat).

### 1.3 Per-scene READ, captions, removals, native overlays

| # | ONE focal element (READ) | 9:16 caption (kinetic, <= 5 words) | 4:5 headline (<= 8 words) | REMOVE from picture | Native overlay needed / why |
|---|---|---|---|---|---|
| 1 | The bubble text "Rs 3 lakh" + "zeko.ai" | b0-2 "One website. One budget." / b2-4 "A creator campaign. In Claude." | "One website, one budget, a full creator campaign." + chip "In one Claude chat" | v4 baked left-margin captions (x<340), title card, LIVE/PAID/16 to 8 flashes, source typing | Bubble NATIVE at 56 px (source text ~10 px). No rings |
| 2 | The three chosen chips | b4 "Who." b5 "What." b6 "Why." | "It asks three things: who, what, why." | unselected chips, "Time-lapse 0:41" chip, clipped left edge words ("udience", "oduct") | NATIVE chips (>= 52 px) [SA S1-15, VA S1F-05] |
| 3 | "Structured interviews still hide gut decisions" | "A plan builds itself." | "Claude drafts the storyline and direction." | Product/Audience/Budget dim rows (show none), comparable brands row | NATIVE Plan card |
| 4 | The range "5.42-5.58 lakh" | b12-16 "See reach before you spend." | "See projected reach before you spend." | UI Max spend (3,01,388) and mid-count 2,89,625 / 3,01,314, Creators 16, ring, "Rs 540 CPM" pill | NATIVE card: "Projected impressions 5.42-5.58 lakh" + "Est. CPM Rs 540 (cost per 1,000 views)". Only these two numbers. [SA S1-08, VA S1V-07, S1V-08] |
| 5 | b20-26: "16" (caption carries it); b27-32: engagement column 3.64% / 3.46% / 1.97% | b20-26 "16 creators matched." / b27-32 "Sort by engagement." | "16 matched creators, sortable by engagement." | tab row "(16)", "Sort" chip pill, mid-reorder double-exposure frames (hard cut skips them), orange blank outlines | Right-column HARD crop (x1100 w608 9:16; x900 w864 4:5) at b27 so % is >= 48 px. [VA S1V-09, S1F-09, S1V-10] |
| 6 | The typed bubble sentence | b32-38 "Cut the list. Cap spend." | "One message trims the list and caps spend." | v4 line "The 8 creators furthest from HR hiring topics", ALL 8 removed names, "Yes, remove them", "Done. Roster is 8..." leak line | NATIVE bubble + NATIVE tool pills (the removed-names reply is never shown). [SA S1-04, VA S1V-12, S1V-13] |
| 7 | b44-47 the digit roll; b47-52 the two Before/After rows | b44-47 none (the roll is the message); b47-52 "Budget and forecast update." | "Budget and forecast update with the roster." | caption "16 to 8" slab (duplicate of the roll), chips "Rs 3,00,000 -> Rs 1,50,000" and "2.69-2.77 lakh" as pills, "Max spend" row, "Creators" row of the table (roll already shows it), clipped source sentence | NATIVE roll + NATIVE 2-row card. One carrier each. [SA S1-09, VA S1V-08, S1V-11, S1V-14] |
| 8 | b54-58 six labels in turn; b58-60 the "Avoid:" line | "Every creator gets a brief." | "Each creator gets a written brief." | 12 px brief body text as read target (kept only as dim texture), "8 creators" pill, ring through "Priyanshu", "Before paying: post format not set yet." line | NATIVE label stack; Avoid highlight sets up Part 2 hook. [SA S1-16, VA S1V-15, S1V-16] |
| 9 | "Total payable Rs 1,47,000" | "Every rupee itemised." | "An itemised quote before you pay." | "Nothing is charged..." line, chip "Pay Rs 1,47,000 on anchors" (second carrier), orange underline ring | NATIVE card, rows land on half beats; GST (18%) row included |
| 10 | The check, then "Rs 1,47,000" | "Pay once." | "One payment activates the campaign." | baked "Pay once." blur ghost, blank white pay frame, Rs 0 / Rs 1,45,405 count-up, orange blob in lower blur, pill duplicate | Page NATIVE with final amount from f960. Caption sits on the dark plate (not on cream). [VA S1V-17, S1V-18, S1V-02, SA S1-11] |
| 11 | The stamped avatar row | "Briefs on their way." | "Briefs sent to every creator." | "Briefed 8..." chip (already on pay page), skeleton frames | Claude line NATIVE (readable) |
| 12 | One phrase at a time | b76 "You pick who." / b80 "You set the budget." / b84 "Claude writes the briefs." | the same three lines accumulate as a stacked headline (one line added at b76, b80, b84) | no UI text | NATIVE text card. Each phrase has a dim plate behind it (roster pills / Before-After / brief labels). This is the missing value line. [SA S1-03] |
| 13 | The button | end card (0.4) | end card (0.4) | | NATIVE |

### 1.4 Energy curve and music alignment (per social_audit_music C.4)
Per-second energy s0-s47: `9 9 | 6 6 | 7 7 | 7 7 8 8 | 7 7 7 7 8 8 | 7 8 8 8 9 9 | 10 10 10 10 | 8 8 8 8 | 6 5 | 9 8 | 8 9 10 10 | 10 9 9 9 | 5 5 | 8 6 5 7` (48 values).

| Beat | Section | Music event |
|---|---|---|
| b0 | HOOK | thud + snap + motif A4; 16th hat from f0; reverse-riser pickup lives in the previous loop's last beat |
| b2 | HOOK | motif C5/E5 on the caption swap (f30), A5 lands b4 (f60) |
| b4-12 | Groove 1 | four-on-floor, bass, chips as pitched motif notes |
| b12-20 | Groove 2 | pluck arp enters; hit-stop tape at b16 (f240) |
| b20-32 | Creators | card taps as 8th plucks; cut on b27 (f405) gets a rim hit |
| b32-44 | Build | riser from b36, snare roll b40, kick out b43, 1/16 gap before b44 |
| b44 (f660) | **DROP** "16 to 8" | impact + crash, bass drop, motif full level (unchanged vs audit) |
| b52-60 | Briefs | groove, arp fills label ticks |
| b60-64 | Quote breakdown | filter closes, kick halves, riser (unchanged) |
| b64 (f960) | PAY lift | 6-frame drop-out at f954-959 (0.2 s, replaces the 0.25 s gap which is off-grid), hard restart in C major, glass chime <= 1.2 s |
| b68-76 | **SENT peak** | stamp notes play A4/C5/E5/A5 on stamps; peak at f1050 (b70) |
| b76-84 | Recap | groove holds 9, three phrase hits on b76, b80, b84 |
| b84-88 | Breath | low-pass breath, filter lift to the logo |
| b88 (f1320) | End | logo sting; stripped groove; last beat pickup |

**Deviations from social_audit_music C.4 and why:** (1) "Dates" (b68-74) and "LIVE peak" (b74-84) are gone because dates/live moved to Part 2; replaced by SENT peak at b68-76 and a RECAP section b76-88 at energy 9. (2) Peak starts at b70 instead of b74. (3) Tease b84-88 kept as the breath into the logo (no tease picture; the teaser is now on the end card). (4) Cut-request build starts b32 not b36 (typing 3 s then riser). (5) Hit-stop on the range-bar freeze is at b16 (f240), not ~b26.6, because the Projection scene is earlier in this edit.

### 1.5 Loop and end card (Part 1)
- b95 pickup into f0. Last 6 frames: warm brightness dip (white 25% for 2 f at f1438-1439) landing on f0 = the hook bubble frame, caption already present. Last sample on zero crossing; first transient at +2 ms.
- Part chip on the end card is replaced by sub-line "Part 1 of 3". Teaser: "Next: Part 2, the drafts".

---

## 2. PART 2 of 3: REVIEW

**Story:** briefs are out; drafts arrive; each draft is checked against the brief; passing drafts are approved; misses go back with the exact words; revisions return; 8 of 8; live dates are set; posts go live. **Starts:** briefs sent (same state Part 1 ended on). **Ends:** the live board, 4 Live / 4 Scheduled, Thu 8 Oct.

### 2.1 Hook (first 1.0 s, cover)
- **Chosen hook:** audit option 1, `Would you approve this? Claude didn't.` Question b0-b3 (1.5 s), then stamp "Off-brief" + `Claude didn't.` on b3 (f45). The answer arrives at 1.5 s (was 1.0 s) so the gap stays open longer while the flaw is already visible. [SA S2-01]
- **Frame 0 / cover:** NATIVE Darika first draft card (full width, 80 px margins, all lines complete): "We are excited to announce Zeko AI, a revolutionary new platform and the world's number one choice for enterprise workforce intelligence." with amber underlines on "revolutionary" and "world's number one"; caption "Would you approve this?" complete at f0; Part chip. No stamp at f0 (stamp lands f45); cover export uses f50 (stamp in, "Claude didn't." present). [SA S2-02, VA S2V-01, S2F-01]
- Cold-open flash-forward: the same card returns at b40 (scene 8) as the sent-back draft, so the hook is paid off at 20 s.

### 2.2 Beat sheet (96 beats)

| # | Beats | Sec | Frames | Source film + in/out | Speed / treatment |
|---|---|---|---|---|---|
| 1 HOOK | 0-4 | 0.0-2.0 | 0-60 | `final/anchors-zeko-A-brief-review-approve-60s.mp4` src **0.0-1.0 (f0-30)** reference; card NATIVE (Remotion S20 Panel/MarkedText) | Card static with 4% push; amber underlines draw f0-8; stamp slam NATIVE at f45 (hit-stop 2 f, 4 px shake 9:16 only); hard black none |
| 2 BRIEF | 4-8 | 2.0-4.0 | 60-120 | A src **8.4-9.9 (f252-297)** @0.75x plate (sc.3, "Avoid" label flash at 8.571) | NATIVE brief card: "Avoid: Press-release tone ("excited to announce", "revolutionary")." highlighted, six labels listed dim |
| 3 SENT -> DRAFTS | 8-12 | 4.0-6.0 | 120-180 | A src **19.821-21.0 (f595-630)** @1.0x for b8-b10 (sc.7 avatars "Brief sent", Claude "Payment received. Briefs sent to 8 creators."); A src **22.5-23.8 (f675-714)** @1.3x for b10-b12 (sc.8 status flips) | b8-10 NATIVE Claude line + 8 stamped avatars; b10-12 NATIVE status board: 8 rows "Awaiting draft" -> "Draft ready" wave (order Sunidhi, Riya, Jyoti, Gunjan, Shubhangi, Darika, Priyanshu, Ashish), corner chip "Sat 3 Oct" |
| 4 REVIEW | 12-20 | 6.0-10.0 | 180-300 | A src **25.179-30.536 (f755-916)** @1.34x (sc.9, Riya) | LinkedIn card (Riya, opening line) top half, NATIVE five-check panel; one tick per beat b13..b17 (f195, 210, 225, 240, 255), badge "Ready for review" b18 (f270). Corner chip "Mon 5 Oct" |
| 5 SAME | 20-24 | 10.0-12.0 | 300-360 | A src **31.607-33.75 (f948-1013)** @1.07x (sc.10) | Four 1-beat flashes b20 Jyoti, b21 Gunjan, b22 Shubhangi, b23 Sunidhi; each shows 2 lines + five ticks |
| 6 APPROVE | 24-30 | 12.0-15.0 | 360-450 | A src **33.75-36.429 (f1012-1093)** @0.9x (sc.11) | NATIVE: five badges turn Approved, one per beat b24..b28 (Riya, Jyoti, Gunjan, Shubhangi, Sunidhi); NATIVE counter "5 of 8" lands b28 (f420), held to b30 |
| 7 SENT BACK 1 | 30-40 | 15.0-20.0 | 450-600 | A src **36.429-41.786 (f1093-1254)** @1.07x (sc.12, Ashish) | b30-32 two crosses; b32-38 NATIVE typed note (exact: "Name Zeko AI in the first two lines and add #ZekoAI. Keep the rest."); b38-40 amber badge "Changes requested" |
| 8 SENT BACK 2 | 40-52 | 20.0-26.0 | 600-780 | A src **41.786-47.143 (f1254-1414)** @0.89x (sc.13) | b40-46 Darika (the hook card, underlines "revolutionary", "world's number one", note "Rewrite in your own strategist voice..."); b46-52 Priyanshu (underlines "guarantees the perfect hire every time", "the only tool", note "Remove the guarantees..."). Alternating single-card layout, hard cut on b46 |
| 9 REVISED | 52-56 | 26.0-28.0 | 780-840 | A src **47.143-48.2 (f1414-1446)** dim plate | NATIVE Claude line "Revised drafts are back from Ashish, Darika and Priyanshu. Each now meets the brief."; corner chip "Tue 6 Oct"; b55-56 (f825-840) **hush beat**: picture dims 35%, no new element |
| 10 BUILD | 56-64 | 28.0-32.0 | 840-960 | A src **48.214-49.286 (f1446-1479)** reference | NATIVE board of 8 cards: counter "5 of 8" -> "6 of 8" at b58 (f870), "7 of 8" at b60 (f900), holds 7 of 8 b60-b64 with cursor on the last Approve; snare roll b63; no number is shown mid-flip |
| 11 GOLD | 64-70 | 32.0-35.0 | 960-1050 | A src **49.286-50.357 (f1479-1511)** reference (0.5x blend) | b64 (f960) NATIVE counter lands "8 of 8" (large), gold impact, board all green; 5% slow-mo 0.5 s; hold >= 60 f |
| 12 DATES | 70-78 | 35.0-39.0 | 1050-1170 | A src **50.357-53.571 (f1511-1607)** @0.8x (sc.15) | NATIVE bubble "Go live tomorrow or later, staggered over three days.", NATIVE 3-row table (Ashish Wed 7 Oct 10:00 AM, Riya Wed 7 Oct 1:00 PM, Gunjan Wed 7 Oct 5:00 PM), orange "Set live date" button pulses b76; corner chip "Tue 6 Oct". Cut on settled table (no skeleton bars) |
| 13 LIVE | 78-88 | 39.0-44.0 | 1170-1320 | A src **53.571-54.107 (f1607-1623)** @0.54x for b78-b80 (feed); A src **54.107-55.2 (f1623-1656)** then freeze to b88 (board) | b78-80 HARD crop on the post header only ("Ashish Shukla" + "Just now"), corner chip "Wed 7 Oct"; b80-88 board NATIVE: "4 Live" (Ashish, Riya, Gunjan, Shubhangi, green dots) + "4 Scheduled" (Jyoti, Sunidhi, Priyanshu, Darika), chips "Wed 7 . Thu 8 . Fri 9", corner chip "Thu 8 Oct". Live pings on b80, b81, b82, b83 |
| 14 END | 88-96 | 44.0-48.0 | 1320-1440 | native | see 0.4 |

Sum: 4+4+4+8+4+6+10+12+4+8+6+8+10+8 = **96 beats = 1440 f**. Pre-gold = 64 beats (b0-64), post-gold = 32 beats. Boundaries: b30 and b40 and b52 and b56 and b70 and b78 are even-beat boundaries; b30, b70 and b78 are off-bar (b30 = bar 7 half, b70 = bar 17 half, b78 = bar 19 half); all other boundaries are bar lines (b0, 4, 8, 12, 20, 24, 40, 52, 56, 64, 88).

### 2.3 Per-scene READ, captions, removals, native overlays

| # | ONE focal element (READ) | 9:16 caption (<= 5 words) | 4:5 headline (<= 8 words) | REMOVE from picture | Native overlay needed / why |
|---|---|---|---|---|---|
| 1 | "revolutionary" / "world's number one" underlines, then the stamp | b0-3 "Would you approve this?" / b3-4 "Claude didn't." | "Would you approve this draft? Claude didn't." | clipped left edge ("o announce"), full-bleed 0-margin card, "Dramatised example" tag, Zeko-AI-named confusion, ghost blur under the stamp | Card NATIVE (whole first line legible); stamp NATIVE at f45 |
| 2 | The "Avoid:" line | "The brief warned against this." | "The brief told every creator what to avoid." | 12 px brief scroll as read target, "Format. Link. Files." scene (cut entirely), chips "Text / Text + image" | NATIVE card: shows why the hook draft fails (same two words) |
| 3 | The flip from "Awaiting draft" to "Draft ready" | "Briefs out. Drafts in." | "Briefs went out. The drafts came back." | Payment page (A sc.6, amount mismatch Rs 1,46,964, already shown in Part 1), "Change requests 0 / 2" column, empty-card frames | NATIVE board (the source table is 8 px). Keeps Part 1's final state as the first picture of Part 2. Date chip "Sat 3 Oct" |
| 4 | The five ticks | "Claude checks every draft." | "Every draft is checked against the brief." | draft preview body text (8 px), "Claude's check" panel overlap on the footer, "Change requests: 0 / 2" | NATIVE check panel: "Zeko AI in line 1", "#ZekoAI", "People & Culture angle", "No absolute claims", "No press-release tone" [SA S2-14] |
| 5 | The repetition (same five ticks) | "Same checks. Every draft." | "The same checks run on every draft." | mobile-preview narrow card, source fragments | HARD cuts on the beat; no crossfade [VA S2V-10] |
| 6 | The counter "5 of 8" | "Passing drafts get approved." | "Drafts that match the brief are approved." | rising chime ladder visuals, "Approve is final." line (cryptic, replaced), Claude sentence leak | NATIVE badges + counter; the "5 of 8" counter is the sole carrier (caption has no digit). [SA S2-06] |
| 7 | The typed note | "Misses get the exact fix." | "Misses go back with the exact fix." | "Dramatised example" tag, source fragments ("g. They didn't fully"), clipped "Tue 6 Oc" chip, "Change requests: 1 / 2" | NATIVE typed note (>= 48 px) |
| 8 | The underlined phrases | b40-46 "Hype gets sent back." / b46-52 "So do guarantees." | "Hype and absolute claims go back too." | tag on divider, half-cut badge "Change requests: 1/2", 3-frame zoom punches that cut text | Single-card alternation (no side-by-side at 7 px). Darika's card is identical to the hook card (recognition) |
| 9 | The Claude sentence | "Revised drafts return." | "The creators revise and resubmit." | skeleton frames, mobile fragments | NATIVE line + date chip "Tue 6 Oct" |
| 10 | The counter climbing, then held on 7 of 8 | "Re-checked, then approved." | "Each revision is re-checked before approval." | "5 of 8" small tile over "8 of 8" crossfade [VA S2V-16, S2V-17], mid-flip table frames | NATIVE board; counter steps are script numbers (6, 7 of 8); never a crossfade |
| 11 | "8 of 8" | "All approved." | "Every draft now meets the brief." | giant blurred orange digits behind, the card's own "8 of 8" tile (double carrier), 2.3 s static hold (cut to 3.0 s with a push) | NATIVE counter is the only "8 of 8". [VA S2V-17, S2V-18] |
| 12 | The three dates + the button | "Live dates lock once set." | "Live dates are locked once you set them." | grey skeleton bars, half-cut chip list, bubble duplicate pill "Wed 7 . Thu 8 . Fri 9" (shown later on the board) | NATIVE bubble + 3-row table [SA S1-10, VA S1V-21] |
| 13 | "4 Live / 4 Scheduled" | "Live on LinkedIn." | "Posts go live on LinkedIn over three days." | rotated feed carousel with cut neighbours, "Your campaign is live. Posts go up over three days." leak line, empty dark card frames | HARD crop on header only for b78-80; board NATIVE. Final frame (b88) = the board; Part 3 opens on it. [VA S1V-22, S1V-23, S1V-24, SA S2-10] |
| 14 | The button | end card (0.4) | end card (0.4) | "Zeko AI, live on LinkedIn." | NATIVE |

### 2.4 Energy curve and music alignment (per social_audit_music C.5)
Per-second energy s0-s47: `9 9 | 6 6 | 6 7 | 8 8 8 8 | 9 9 | 8 8 8 | 7 7 6 6 6 | 6 6 6 6 6 6 | 6 6 | 7 8 8 9 | 10 10 9 | 8 8 8 8 | 9 10 9 9 9 | 8 6 5 7` (48 values).

| Beat | Section | Music event |
|---|---|---|
| b0 / b3 | HOOK | slam + snap + motif A4 at f0, 16th hat roll from f0; stamp at b3 (f45): 2-4 kHz paper-slap + C5 + low log-drum hit (bright riser at -12 dB from f0 to f45) |
| b4-12 | Setup | 120 BPM half-time (kick on 1, clap on 3), 808, log-drum answer, kalimba motif every 2 bars; whoosh on every cut |
| b12-20 | Review | check ticks as hat accents (not pings) |
| b20-24 | Same standard | four tonal stabs on b20-b23 (C major, no chime ladder) |
| b24-30 | Approve | five approvals as five motif plucks A4..E5 inside the music; "5 of 8" lands b28 |
| b30-52 | Thin | kick + 808 + pluck, LUFS-S never under -16; cross thuds as low log-drum hits at b30, b31 |
| b55-56 (f825-840) | **Pre-gold hush** | 1 beat only, reverse swell at -30 dB or louder, no true silence |
| b56-64 | Build | drums return on the bar line b56, chord swell, snare roll b63 |
| b64 (f960) | **GOLD** | impact + C-major stab + the single big chime, no cymbal |
| b64-70 | Hold | full groove at peak, motif full level |
| b70-78 | Dates | groove 8, calendar ticks pitched |
| b78-88 | Live | feed whoosh b78, live pings b80-b83 (A4/C5/E5/A5), board settles, breath on b86-b88 (0.25 s gap before the logo is 1/16, i.e. f1316-1319) |
| b88 | End | logo sting; stripped groove; pickup b95 |

**Deviations from social_audit_music C.5 and why:** (1) GOLD moves from b76 (38.0 s) to **b64 (32.0 s)** because the "Set live dates / posts go live" block (client decision 1: Part 2 ends on the live board) now follows the gold hit and needs 18 beats; the audit's extra bar "hold 8 of 8" becomes a 6-beat hold. (2) The old "Next" bridge section (b84-88) is replaced by the end-card teaser. (3) Opening hits shift: stamp at b3 not b2. (4) "Format and send" section is cut (SA S2-05), saving 6 s that move into sent-back readability (typed note 3 s, Darika/Priyanshu 3 s each). (5) Hush now at b55-56 (was b70-71). Everything else (half-time groove, log drum, thin section, single gold chime) is unchanged.

### 2.5 Loop and end card (Part 2)
- Last 6 frames: dip to near-black with 10% orange glow, landing on f0 (the Darika card, caption present). No hard flash; the pickup replaces the fade.
- End card sub-line "Part 2 of 3". Teaser: "Next: Part 3, the results".

---

## 3. PART 3 of 3: MONITOR

**Story:** the campaign is live; one question ("How is it performing?") returns the numbers: Day three tiles, two weeks later, the final count, plan vs actual, one creator's post, the comments, who engaged. **Starts:** the same live board Part 2 ended on (4 Live / 4 Scheduled, Thu 8 Oct), flipping to 8 Live (Fri 9 Oct, 8:00 PM). **Ends:** Fri 23 Oct 2026 final state + series recap.

### 3.1 Hook (first 1.0 s, cover)
- **Chosen hook:** audit option 1 as a two-beat ask/answer, `Ask your campaign.` (b0-b2) then `It answers in numbers.` (b2-b4). 4:5 headline: `Ask your live campaign how it's doing.` (7 words).
- **Frame 0:** NATIVE board identical to Part 2's last frame ("4 Live . 4 Scheduled", chip "Thu 8 Oct"). f4-14 the 4 Scheduled dots flip green in a wave, header -> "8 Live . 0 Scheduled", chip -> "Fri 9 Oct . 8:00 PM" (B sc.2 L79). f15 bubble "How is it performing?" rises (NATIVE, 56 px). b2-b4 NATIVE counter ramps 0 -> **1,85,700** (24-frame ramp, f36-60), lands on f60 with a 4 f hit-stop. Caption present at f0 in full.
- **Cover:** frame 0 is deliberately continuity, not a thumbnail. Upload a custom cover = export of **f62** (hero counter 1,85,700 landed + "It answers in numbers." + Part chip). Reels/Shorts both accept a chosen cover frame; LinkedIn uses the first frame (acceptable: board + question reads as a feed card).
- No "2,80,000" in the hook (removes the duplicate [VA S3V-01, S3F-01]); the Indian-grouping friction [SA S3-13] is handled by not leading with the final number.

### 3.2 Beat sheet (96 beats)

| # | Beats | Sec | Frames | Source film + in/out | Speed / treatment |
|---|---|---|---|---|---|
| 1 HOOK | 0-4 | 0.0-2.0 | 0-60 | `final-v2/anchors-zeko-B-live-metrics-60s-v6.mp4` src **4.286-6.4 (f129-192)** and **7.5-10.179 (f225-305)** as REFERENCE only; whole scene NATIVE (Remotion S23 Board + S24 Counter) | f0-14 board flip wave; f15 bubble; f36-60 counter ramp; f60-63 hit-stop |
| 2 DAY THREE | 4-12 | 2.0-6.0 | 60-180 | B src **10.179-12.857 (f305-386)** reference | NATIVE: hero counter "1,85,700" morphs (shared element, no crossfade) into the Impressions tile at b6 (f90); tiles Likes **2,955** / Comments **238** / Engagement rate **1.72%** land on f105, f112, f120; "Posts live 8 of 8" tile dropped; no "Data as of" line. Chip "Fri 9 Oct 2026 . 8:00 PM" stays top-right of card |
| 3 TWO WEEKS | 12-16 | 6.0-8.0 | 180-240 | B src **19.286-21.429 (f579-643)** @1.07x (sc.6 kinetic card) | NATIVE kinetic "Two weeks later." + chip **Fri 23 Oct 2026** (chip >= 48 px). Riser bar b12-16, 1-beat music dip at b16 |
| 4 UPDATE ME | 16-20 | 8.0-10.0 | 240-300 | B src **21.429-22.5 (f643-675)** reference | NATIVE bubble "Update me." (b16, f240), NATIVE tool line "CLEO - How the campaign is performing" (b17) |
| 5 COUNT | 20-26 | 10.0-13.0 | 300-390 | B src **22.5-24.643 (f675-739)** reference | NATIVE hero counter held at 1,85,700 b20-b24 (riser), **ramp 1,85,700 -> 2,80,000 over f360-387 (ease-out, 27 f)**, lock + 6 f hit-stop + glow once on **f390 (b26)** |
| 6 FINAL | 26-34 | 13.0-17.0 | 390-510 | B src **24.643-27.857 (f739-836)** reference | b26-30 NATIVE hero "2,80,000" + label "impressions" held (>= 60 f); b30-34 morph into tile row: Likes **4,500** / Comments **361** / Engagement rate **1.74%** (CPM and Budget tiles NOT shown here, they live in scene 7) |
| 7 PLAN VS ACTUAL | 34-46 | 17.0-23.0 | 510-690 | B src **34.286-38.571 (f1029-1157)** reference (sc.9) | NATIVE: band "2.69-2.77 lakh" (forecast), marker travels to the final value b34-b40, crosses the top (tick) at b40 (f600) with flag "Above range"; b40-46 NATIVE two-column card Plan vs Actual: Projected 2.69-2.77 lakh vs 2,80,000; Est. CPM Rs 540 vs Rs 525 (label "cost per 1,000 views"); Max spend Rs 1,49,712 vs Spent Rs 1,47,000; chip "Rs 15 below plan" lands f660 |
| 8 ONE POST | 46-54 | 23.0-27.0 | 690-810 | B src **38.571-40.714 (f1157-1221)** @1.07x for b46-b51 (bubble "How did Ashish's post do?", tool line, serif sentence); b51-b54 NATIVE table | b48-51 sentence "Ashish's post drew 44,800 impressions, 728 likes and 63 comments, a 1.77% engagement rate." with "1.77% engagement rate" bold cream; b51-54 NATIVE table Impressions 44,800 / Likes 728 / Comments 63 (final values, pill "Published") + chip "Campaign average 1.74%" |
| 9 COMMENTS | 54-66 | 27.0-33.0 | 810-990 | B src **42.857-49.286 (f1286-1479)** @1.07x reference | b54-58 NATIVE sentiment bar 71 / 25 / 4 (bar grows with no digits, numbers appear on lock f870); b58-62 Neha K. first sentence "Our debriefs end exactly like this."; b62-66 Sandeep R. first sentence "Verified capability sounds good, but who validates the validation?" |
| 10 AUDIENCE | 66-78 | 33.0-39.0 | 990-1170 | B src **49.286-55.714 (f1479-1671)** @1.07x reference | b66-68 bubble "Who did it reach?"; b68-72 NATIVE Roles card "HR Manager / Talent Acquisition" state Reached **41%**; b72-78 toggle to Commenters, bar morphs to **47%**, line "Commenters skew HR Manager / Talent Acquisition." (Likers 38% not shown) |
| 11 RECAP | 78-88 | 39.0-44.0 | 1170-1320 | no source | NATIVE series recap: "Built." (b78, Part 1 chip lights), "Reviewed." (b80, Part 2 chip), "Monitored." (b82, Part 3 chip), b84-88 "In one Claude chat." |
| 12 END | 88-96 | 44.0-48.0 | 1320-1440 | native | see 0.4 |

Sum: 4+8+4+4+6+8+12+8+12+12+10+8 = **96 beats = 1440 f**. Boundaries: b0, 4, 12, 16, 20, 26, 34, 46, 54, 66, 78, 88, 96. Bar lines: b0, 4, 12, 16, 20, 88, 96; off-bar even-beat boundaries: b26 (kept off-bar on purpose: the lock IS the beat the music drops on, same as audit b26 / 13.0 s), b34, b46, b54, b66, b78.

### 3.3 Per-scene READ, captions, removals, native overlays

| # | ONE focal element (READ) | 9:16 caption (<= 5 words) | 4:5 headline (<= 8 words) | REMOVE from picture | Native overlay needed / why |
|---|---|---|---|---|---|
| 1 | The board flipping to "8 Live", then the counter | b0-2 "Ask your campaign." / b2-4 "It answers in numbers." | "Ask your live campaign how it's doing." | source serif line "All 8 posts are live." (duplicate of chip), "8 Live" third copy, progress bar through table text, table full-bleed clipped ("Wed 7 O"), duplicated caption "All 8 posts live." | Whole scene NATIVE; caption in the band above the card, bubble delayed to f15 so they never collide. [VA S3V-03, S3V-04, S3F-03, SA S3-04] |
| 2 | "1,85,700" (morphs to a tile) | "Day three. Still climbing." | "Day three: still climbing." | crossfade of big counter over tile ("1,85,700" twice), mid-count Likes 1,778 / 2,497 / 2,919, "Data as of Fri 9 Oct 2026, 8:00 PM" leak, "Posts live 8 of 8" tile, ring | NATIVE morph (one object). [VA S3V-05, S3V-06, S3V-07, S3V-08, S3F-06] |
| 3 | "Two weeks later." | none (the card is the caption) | none (the card is the caption) | 28 px full-bleed text margins, 16 px chip | NATIVE kinetic card + 48 px chip. [VA S3V-09] |
| 4 | The bubble "Update me." | none | none | empty dark card frames at scene start | NATIVE bubble + tool line |
| 5 | The counter at rest, then the ramp | none (a caption never sits on a ramp) | none | UI mid-counts 2,15,330 ... 2,79,793 held 0.3 s each, caption "The final count." | NATIVE ramp, 27 f, never held mid-way. [VA S3V-12, SA S3-11] |
| 6 | "2,80,000" then Likes / Comments / Engagement | none b26-30 (the number is the message); b30-34 "Likes. Comments. Engagement." (3 words) | "Two weeks in: likes, comments, engagement." (6) | white "2,80,000" + orange glowing "2,80,000 impressions" (double), "Effective CPM" and "Budget used" tiles (moved), "000" fragments over the next scene | NATIVE hero + tiles; one glow on the hero only. [VA S3V-13, S3V-14, S3F-10, SA S3-03] |
| 7 | b34-40 the marker crossing the band; b40-46 the Plan vs Actual card | b34-40 "Now against the plan." / b40-46 "Ahead on reach and cost." | "Ahead of plan on reach and cost." | caption "Rs 525 CPM. Plan: Rs 540." (4th carrier), pill "Rs 525 vs Rs 540 plan", green pill covering the "Spent / Rs 1,47,000" row, Effective CPM mid-counts 448 / 513 / 524 and Budget 79,578 / 1,33,467 / 1,44,647 / 1,46,825, "Ranks moved. Biggest reach first." scene (cut), "Darika: 4th to 1st" | NATIVE band + NATIVE card; the only CPM scene. [SA S3-01, S3-03, S3-06, S3-07, VA S3V-15, S3V-16, S3V-18, S3V-19] |
| 8 | "a 1.77% engagement rate" (b48-51); the table (b51-54) | "One post, up close." | "One creator's post, up close." | pill "1.77% engagement rate" (duplicate of the sentence), pill "Published Wed 7 Oct" (duplicate), mid-counts 42,101 / 684 / 59 | NATIVE table, final values. Context chip "Campaign average 1.74%" (true: B sc.8). [SA S3-09, VA S3V-20] |
| 9 | b54-58 the full 71 / 25 / 4 bar; b58-66 one quote at a time | "Praise and pushback." | "Comments read in full: praise and pushback." | callout "71% positive / 4% negative" (25% neutral omitted), bar mid-counts 0 / 53 / 70 / 26%, half-cut comment card header, Concerns strip | NATIVE bar + quote cards (initials only as in the film). [SA S3-08, VA S3V-21, S3V-22] |
| 10 | The Roles bar: 41% reached -> 47% commenters | "Top role: HR and Talent." | "HR and Talent Acquisition are the top role." | caption over the Roles rows ("Right people. Right roles."), bubble clipped "Who did it rea", tab "Commen\|ters" under a pill, input bar clipped, source sentence duplicate (47% x3), four-panel wide card (6 px text), Likers 38% | NATIVE Roles card only (not the four panels); caption in the band above. [SA S3-05, S3-10, VA S3V-23, S3F-17, S3F-18] |
| 11 | One word at a time + the three Part chips lighting | b78 "Built." b80 "Reviewed." b82 "Monitored." b84 "In one Claude chat." | "Built, reviewed, monitored: all in one Claude chat." (8 words, accumulating lines) | n/a | NATIVE. Ties the series together. [SA section 5 problem 1] |
| 12 | The button | end card (0.4) | end card (0.4) | "Zeko AI, live on LinkedIn." | NATIVE |

### 3.4 Energy curve and music alignment (per social_audit_music C.6)
Per-second energy s0-s47: `10 9 | 8 8 8 8 | 8 8 | 7 8 | 9 9 9 | 10 10 9 9 | 8 8 8 8 8 8 | 8 8 8 8 | 7 7 7 7 7 7 | 7 8 8 8 8 8 | 9 9 10 9 9 | 8 6 5 7` (48 values).

| Beat | Section | Music event |
|---|---|---|
| b0 (f0) | HOOK | thud + 2-6 kHz click (kept s3-f0-thud) + motif A4, groove on from f0 (stem at least -20 dBFS RMS), 16th hat from f0; counter ramp = rising A-minor run f36-f60; A5 lands on f60 |
| b4 | Groove | bass drop at b4 (f60) with the counter lock; tile ticks as hats |
| b12-16 | Riser bar | one-bar riser into the time-jump card |
| b16 (f240) | Dip (1 beat) | 1-beat filter dip at b16 only, back at b17 (max 2 LU) |
| b20-26 | Crest build | riser b20-b24, ramp arp f360-f390 |
| b26 (f390) | **LOCK** | hit-stop, impact, C-major stab, bell (same beat as the audit's 13.0 s) |
| b26-34 | Lock hold | full groove 10 10 9 9 |
| b34-54 | Plan / post | tuned ticks only on strong beats (6 total): b40 marker tick, b46, b51, plus 3 more as needed; pitched label pings |
| b54-66 | Comments | slightly thinner top, bass keeps the pulse |
| b66-78 | Audience | toggles as pitched plucks; toggle at b72; riser from b76 |
| b78-88 | Recap | three phrase hits b78/b80/b82 (A4 C5 E5), A5 on b84, build to the logo |
| b88 (f1320) | End | logo sting at **b88** (series-wide), stripped groove, pickup b95 |

**Deviations from social_audit_music C.6 and why:** (1) Logo sting at b88 not b84, so all three parts share one logo position (series consistency); b84-88 becomes recap build (audit had logo + groove there). (2) "Beat the plan / Zoom in" b34-52 and "Praise and pushback" b52-72 are retimed to b34-54 (plan + post) and b54-66 (comments), then "Right people" b66-78 (audit b72-80), because the ranks scene (5 s) is cut and the series recap is added. (3) The dip is at b16, not b16-17 together with the whole bar (unchanged in spirit: 1 beat). (4) Count lock stays at b26 exactly as the audit. (5) Hook has no "title smash at 1.5 s" because the title card was removed; the A5 landing is on f60.

### 3.5 Loop and end card (Part 3)
- Last 6 frames dip to the f0 board state (4 Live / 4 Scheduled, Thu 8 Oct), pickup lands on f0. Because f0 equals Part 2's last frame, an auto-looping viewer also sees "Part 2 -> Part 3" continuity.
- End card sub-line "Part 3 of 3". Teaser: "That is the whole campaign. Start at Part 1."

---

## 4. Continuity table (the three parts are one timeline)

| | Part 1 BUILD | Part 2 REVIEW | Part 3 MONITOR |
|---|---|---|---|
| **State at start** | Empty chat; prompt "Build a LinkedIn creator campaign for https://zeko.ai. Budget Rs 3 lakh." sent | Briefs written, paid, SENT (Mon 28 Sep) to 8 creators; first draft arrives | Live board, 4 Live / 4 Scheduled (Thu 8 Oct, identical frame to Part 2's last), flips to 8 Live (Fri 9 Oct, 8:00 PM) |
| **State at end** | Paid Rs 1,47,000; "Briefs sent to 8 creators"; Mon 28 Sep 2026; no dates, nothing live | Posts going live: 4 Live / 4 Scheduled, chips Wed 7 . Thu 8 . Fri 9, corner chip Thu 8 Oct | Fri 23 Oct 2026: 2,80,000 impressions, ahead of plan (Rs 525 vs Rs 540 CPM), comments read, audience read |
| **Dates shown** | Mon 28 Sep 2026 (pay page only) | Sat 3 Oct (drafts arrive), Mon 5 Oct (review, approve 5, send back 3), Tue 6 Oct (revised, 8 of 8, dates set), Wed 7 Oct (first post), Thu 8 Oct (board) | Fri 9 Oct 2026 8:00 PM (Day three), Fri 23 Oct 2026 (two weeks later) |
| **Creators on screen** | 16 matched (cards), 8 final (pills): Ashish, Riya, Gunjan, Priyanshu, Jyoti, Sunidhi, Shubhangi, Darika; Priyanshu 3.64%, Jyoti 3.46%, Ashish 1.97% (sort) | Same 8; Riya (review), Jyoti/Gunjan/Shubhangi/Sunidhi (approved with Riya), Ashish/Darika/Priyanshu (sent back, then approved) | Same 8 on the board; Ashish (one post); Neha K., Sandeep R. (comments) |
| **Numbers carried over** | Rs 1,50,000 budget (bubble, before/after) ; 2.69-2.77 lakh forecast ; Rs 540 CPM ; Rs 1,47,000 total ; "Avoid: ... revolutionary" | "8 creators" (briefs sent) ; "Avoid ... revolutionary" -> the hook draft ; 8 of 8 | 2.69-2.77 lakh forecast and Rs 540 plan (Part 1) ; Rs 1,47,000 spent of the Rs 1,50,000 cap (Part 1) ; Rs 1,49,712 max spend (Part 1 v4 table) ; 8 posts |
| **Chip** | PART 1 / 3  BUILD | PART 2 / 3  REVIEW | PART 3 / 3  MONITOR |
| **Teaser (end card)** | Next: Part 2, the drafts | Next: Part 3, the results | That is the whole campaign. Start at Part 1. |
| **Last frame -> next video's first frame** | Avatars "Brief sent" (b76 recap ends on the brief line) -> Part 2 b8 repeats the Claude line and avatars | Live board 4/4 -> Part 3 f0 same board | Board 4/4 (loop f0) |
| **Contradictions removed** | Part 1 no longer shows dates or live (was live at 40 s) | Part 2 no longer ends on "Next: set live dates"; it contains dates and go-live | Part 3 no longer opens on a board that Part 2 never showed |

Timeline check (all dates are film dates): Mon 28 Sep (pay, sent) < Sat 3 Oct (drafts) < Mon 5 Oct (review/approve/sent back) < Tue 6 Oct (revised, 8 of 8, dates set; earliest allowed live date is Wed 7 Oct) < Wed 7 Oct (first posts) < Thu 8 Oct (4 Live / 4 Scheduled) < Fri 9 Oct (8 Live, Day three: Wed 7 = day 1) < Fri 23 Oct (+14 days).

---

## 5. Number-integrity table (every number on screen)

Source column cites file + line (`v4` = script_v4.md section 3 scene row; `A` = script_A_brief_review_60s.md scene row; `B` = script_B_metrics_60s.md scene row). "Carrier" = the single element that shows it in that beat. Frame refs are output frames @30.

### Part 1
| Number | Source line | Where it appears (beat / frame) | Carrier |
|---|---|---|---|
| Rs 3 lakh | v4 sc.2 (L128) | P1 b0-4 (f0-60), bubble text | native bubble |
| 5.42-5.58 lakh | v4 sc.4 (L130) | P1 b12-20 (f180-300) | native Projection card |
| Rs 540 (Est. CPM) | v4 sc.4 (L130) | P1 b12-20 (f180-300), label "cost per 1,000 views" | native Projection card |
| 16 (matched creators) | v4 sc.4/5 (L130-131) | P1 b20-26 (f300-390) | caption only (tab "(16)" cropped) |
| 3.64% / 3.46% / 1.97% | v4 sc.5 (L131) | P1 b27-32 (f405-480) | engagement column (UI crop) |
| Followers / avg likes on the 4 cards (46,795 / 789; 34,628 / 154; 1,04,277 / 321; 6,602 / 235) | v4 sc.5 (L131) | P1 b20-26 texture, not read, not captioned | UI cards |
| 8, Rs 1,50,000 | v4 sc.7 (L133) | P1 b32-44 (f480-660) | native bubble |
| 16 -> 8 | v4 sc.8 (L134) | P1 b44-47 (f660-705) | native digit roll |
| Rs 3,00,000 -> Rs 1,50,000 | v4 sc.8 (L134) | P1 b47-52 (f705-780) | native Before/After row 1 |
| 5.42-5.58 lakh -> 2.69-2.77 lakh | v4 sc.8 (L134) | P1 b47-52 | native Before/After row 2 |
| Rs 1,13,251 / Rs 11,325 / Rs 1,24,576 / GST (18%) Rs 22,424 / Total payable Rs 1,47,000 | v4 sc.12 (L138), v4 sec.6 | P1 b60-64 (f900-960) | native quote card (1,13,251 + 11,325 = 1,24,576; 18% of 1,24,576 = 22,423.68 -> 22,424; 1,24,576 + 22,424 = 1,47,000, checked) |
| Rs 1,47,000 | v4 sc.13 (L139) | P1 b64-68 (f960-1020) | native pay page |
| Mon 28 Sep 2026, "Briefed 8" | v4 sc.13 (L139), A sc.6 (L110) | P1 b64-68 | native pay page line |
| 8 creators | v4 sc.14 (L140) | P1 b68-76 (f1020-1140) | native Claude line |

### Part 2
| Number | Source line | Where it appears | Carrier |
|---|---|---|---|
| 8 creators | A sc.7 (L111) | P2 b8-10 (f120-150) | native Claude line |
| Sat 3 Oct | A sc.8 (L112) | P2 b10-12 | corner chip |
| Mon 5 Oct | A sc.9, sc.12 (L113, L116) | P2 b12-40 | corner chip |
| (five checks, no numerals) | A sc.9 (L113) | P2 b12-20 | native panel |
| 5 of 8 | A sc.11 (L115) | P2 b28-30 (f420-450); also b56-58 (f840-870) | native counter |
| 6 of 8 / 7 of 8 | A sc.14 (L118, "counts 6, 7, 8") | P2 b58-60 (f870-900) and b60-64 (f900-960) | native counter |
| 8 of 8 | A sc.14 (L118) | P2 b64-70 (f960-1050) | native counter (sole carrier) |
| Tue 6 Oct | A sc.14, sc.15 (L118, L119) | P2 b52-78 | corner chip |
| Wed 7 Oct 10:00 AM / 1:00 PM / 5:00 PM | A sc.15 (L119) | P2 b72-78 (f1080-1170) | native 3-row table |
| Wed 7 Oct (feed), Thu 8 Oct (board) | A sc.16 (L120) | P2 b78-88 | corner chip |
| 4 Live / 4 Scheduled; Wed 7 . Thu 8 . Fri 9 | A sc.16 (L120) | P2 b80-88 (f1200-1320) | native board |
| (omitted on purpose) "Change requests: 0 / 2", "1 / 2" | A sc.9, sc.12, sc.13 | not shown | removed to cut clutter |

### Part 3
| Number | Source line | Where it appears | Carrier |
|---|---|---|---|
| 8 Live . 0 Scheduled; Fri 9 Oct 2026 . 8:00 PM | B sc.2 (L79) | P3 b0-4 (f0-60), chip top-right persists to b12 | native board header + chip |
| 1,85,700 | B sc.3 (L80) | P3 b2-12 (lock f60; hold to f180); also start value b20-24 | native hero counter, then Impressions tile (one object) |
| Likes 2,955 / Comments 238 / Engagement rate 1.72% | B sc.3 (L80) | P3 b6-12 (f105-180) | native tiles |
| Fri 23 Oct 2026 | B sc.6 (L83) | P3 b12-16 | native chip |
| 2,80,000 | B sc.7 (L84), v4 sec.7 | P3 lock f390; hold b26-30 (f390-450); also Plan vs Actual "Actual" b40-46 (different beat) | native hero counter; native Actual column |
| Likes 4,500 / Comments 361 / Engagement rate 1.74% | B sc.7 (L84) | P3 b30-34 (f450-510) | native tiles |
| 2.69-2.77 lakh | B sc.9 (L86) | P3 b34-46 (f510-690) | native band label, then Plan column (band label fades before the card lands) |
| Est. CPM Rs 540 / Rs 525; Rs 15 below plan | B sc.9 (L86), B sc.7 (L84) | P3 b40-46 (f600-690) | native card rows (540, 525) + chip (15). 1,47,000 / 280 = 525; 540 - 525 = 15 |
| Max spend Rs 1,49,712 / Spent Rs 1,47,000 | B sc.9 (L86), v4 sc.8 (L134) | P3 b40-46 | native card row 3 |
| Ashish 44,800 / 728 / 63 / 1.77% | B sc.10 (L87) | P3 b48-54 (f720-810); 1.77% in sentence only | sentence (b48-51), native table (b51-54) |
| Campaign average 1.74% | B sc.7 (L84) | P3 b52-54 | native chip (different metric position from 1.77%) |
| 71 / 25 / 4 | B sc.11 (L88), v4 sec.7 | P3 b54-58 (lock f870) | native bar. 256 + 91 + 14 = 361 comments; 256/361 = 70.9, 91/361 = 25.2, 14/361 = 3.9 |
| Roles 41% (Reached) / 47% (Commenters) | B sc.12 (L89), v4 L152 | P3 b68-72 (41%), b72-78 (47%) | native Roles card (Likers 38% omitted) |
| Arithmetic of 1.77% | B sc.10 | (728 + 63) / 44,800 = 1.766% -> 1.77% | n/a |

No number appears twice in one frame. The only same-frame pairs of different numbers are tile rows (Likes / Comments / Engagement) and card rows (Plan vs Actual), by design.

---

## 6. Defects this script removes (mapped to audit IDs)

**Story / script [SA]**
- S1-01, S1-02, S1-14: hook = promise sentence on a settled bubble frame, no LIVE/PAID/16 to 8 flashes.
- S1-03, S1-17: who/what/why in first 2 s (creator campaign, Claude, LinkedIn in bubble), value line b76-88.
- S1-04: removed-creators list scene not used.
- S1-05, S1-06, S2-10, S3-14: one timeline; Part 1 ends paid + sent, Part 2 contains dates + live, Part 3 opens on that board; dead tease cards removed.
- S1-07 and S1-12: IG "three days" copy fixed (section 7); pills removed.
- S1-08: CPM glossed once per video ("cost per 1,000 views"), reach labelled "Projected".
- S1-09, S3-03, S3-11: one carrier per fact; crest caption removed.
- S1-10: "Set once. Final." -> "Live dates lock once set." (Part 2 b70).
- S1-11: pay amount final value from f960. S1-13, S2-12, S3-12: one CTA family. S1-15: native chips. S1-16: Avoid highlight (also the Part 2 hook explainer).
- S2-01: stamp delayed to 1.5 s; "Claude didn't." closes the gap. S2-02: cover frame legible. S2-03: setup cut from 17 s to 6 s (b4-12). S2-04: empty cards trimmed. S2-05: "Format. Link. Files." cut. S2-06: "Approve is final." replaced by "Passing drafts get approved." S2-09: LinkedIn named at b78 and in copy. S2-11: chips re-padded (native). S2-13: IG opens on the hook. S2-14: review scene gets 8 beats vs 4 for the brief.
- S3-01: CPM tiles never shown mid-count; CPM appears only in scene 7 after lock. S3-04, S3-05, S3-06: caption never over UI; "Above range" is a flag in the card, not a pill. S3-07: rank scene cut. S3-08: 71 / 25 / 4 shown in full. S3-09: final values only; "1.77%" given context 1.74%. S3-10: 41% of reach vs 47% of commenters. S3-13: no lakh-only hook; "(280,000)" in copy.
- NOT removed on screen (client decision): S2-07 (example tag), S2-08 (named creators on the first drafts), S3-02 (scripted data presented as the campaign), S3-07/S3-08 consent. They are handled by copy discipline (section 7) and the open points below.

**Visual [VA]**
- S1V-01, S1F-01, S2V-01, S2F-01, S3F-01: f0 is a settled hero frame in all three (Part 3: cover uploaded). S1V-02: dark plate behind the pay page. S1V-03, S1V-29, S2F-16, S3V-02: native cards at >= 44 px, card band fills the frame. S1V-04, S1F-02: no blank-chat crop. S1V-05, S3V-11, S3V-21 and caption spacing: fixed slot widths. S1V-06: progress bar and pills removed. S1V-07, S1V-18, S1F-17, S3V-12, S3V-16, S3V-18..S3V-21: no mid-count values on screen (section 0.3 rule f). S1V-08, S1V-11, S1V-14, S1V-15, S1V-20, S1V-25, S3V-13, S3V-15, S3V-20, S3F-10: duplicate callouts deleted. S1V-09, S1V-10, S1F-04, S1F-09: no sort double-exposure, no source rings. S1V-12, S1F-11: names list removed. S1V-13, S1V-26, S1F-12, S1F-22, S3V-03, S3V-08, S3F-03: source leaks cropped or native. S1V-17: no blank pay page. S1V-21, S1F-18: no skeleton bars. S1V-22, S1F-19: feed carousel reduced to a header crop. S1V-23, S1V-24, S1F-20, S1F-21, S2V-03, S2V-07, S2F-02, S2F-09, S3V-10, S3F-08: no empty dark cards (scenes start on the first populated frame). S1V-28, S1F-23, S2V-20, S2F-15, S3F-19: end card text sized and centred consistently, no orphans. S2V-05, S2V-09, S2V-16, S3V-22, S3V-23, S3F-17, S3F-18: reading targets are native. S2V-17, S2V-18, S3V-06, S3V-14, S3F-06: no crossfade double-exposures. S3V-01, S3F-01: no 2,80,000 in the hook. S3V-04: bubble delayed to f15. Cross-cutting 11: captions sit on dark plates.

**Music / grid [MA]**
- C.2 / C.11 (frame-exact grid): every cut on a 15-frame beat. S1-01, S2-01, S3-01-style hook weakness: hits on f0, b2/b3, b4 with a motif note each and a sub-free snap layer. S1-02 / S3-03 (cliff or lurch): dip limited to 1 beat (b16 in Part 3, b55 in Part 2). S1-03, S2-02: event at least every 2 s from the cue lists. S1-07: max two T1 layers per beat (no stack at b44). S1-08, S2-06, S3-08: whoosh at every scene boundary (boundaries listed above). S2-04: hush limited to 1 beat. S1-09, S2-08, S3-04: no dead end card, groove under the CTA, pickup at b95. S3-02: music from frame 0 in every part. S1-12, S3-03: dip <= 2 LU. S3-09: logo sting at b88 shared by all three parts.

---

## 7. Posting copy (per platform, per part)

Rules: untagged copy is a walk-through ("here is how"); no outcome stated as achieved fact; every outcome line is `[REAL: confirm before posting]` and may be deleted or kept as one block. Links: Shorts/Reels use "link in bio", LinkedIn puts the link in the first comment. Replace `<P1>`, `<P2>`, `<P3>` with the live post URLs once posted.

### Part 1 (BUILD)
**YouTube Shorts**
- Title: `One website. One budget. A creator campaign. (Part 1/3)` (56 chars; hook inside the first 40)
- Description:
  `Part 1 of 3. Here is how a LinkedIn creator campaign gets built in one Claude chat: start with a website and a budget, see the projected reach before you spend, cut the matched creators down to the ones you want, check an itemised quote, pay once, and send the briefs.`
  `Part 2: reviewing the drafts <P2>. Part 3: monitoring the live campaign <P3>.`
  `Try it: https://anchors.in`
  `[REAL: confirm before posting] This is the campaign Zeko AI ran with anchors.`
  `#Shorts #CreatorMarketing #LinkedInMarketing #Claude`

**Instagram Reel**
- Caption:
  `One website. One budget. A whole creator campaign, in one Claude chat.`
  `Here is how it gets built: website in, plan with projected reach, 16 creators matched and cut down, an itemised quote, one payment, briefs sent.`
  `Part 1 of 3. Part 2: the drafts come back. Link in bio.`
  `[REAL: confirm before posting] Real campaign for Zeko AI.`
- Hashtags: `#creatormarketing #linkedinmarketing #claude #anchors #b2bmarketing`

**LinkedIn post**
- First line (hook): `How long does it take to build a creator campaign if you never leave one chat?`
- Body:
  `Here is the first third of the walk-through (Part 1 of 3):`
  `- Start with a website and a budget (Rs 3 lakh in the example)`
  `- See projected reach before you spend (5.42-5.58 lakh impressions in the plan)`
  `- Narrow 16 matched creators to the ones you want and cap the budget (Rs 1,50,000)`
  `- Review an itemised quote and pay once (Rs 1,47,000)`
  `- Briefs go out the moment payment clears`
  `Part 2: the drafts come back.`
  `[REAL: confirm before posting] This was Zeko AI's real campaign.`
  `Link in the first comment.`
  `#CreatorMarketing #LinkedInMarketing`

### Part 2 (REVIEW)
**YouTube Shorts**
- Title: `Would you approve this? Claude didn't. (Part 2/3)` (49 chars)
- Description:
  `Part 2 of 3. Here is how creator drafts get reviewed in one Claude chat: every draft is read against the brief (Zeko AI named, hashtag in place, no absolute claims, no press-release tone), drafts that match are approved, and the rest go back with the exact words to change. Then you set live dates and the posts go live on LinkedIn.`
  `Part 1: building the campaign <P1>. Part 3: monitoring it <P3>.`
  `Try it: https://anchors.in`
  `[REAL: confirm before posting] Result: 5 of 8 drafts approved first time, 3 sent back, 8 of 8 approved after revision.`
  `#Shorts #CreatorMarketing #LinkedInMarketing #Claude`

**Instagram Reel**
- Caption:
  `Would you approve this? Claude didn't.`
  `Here is how every creator draft gets checked against the brief in one Claude chat: approve what fits, send back what does not with the exact fix, then set live dates.`
  `Part 2 of 3. Part 3: the live campaign. Link in bio.`
  `[REAL: confirm before posting] 5 approved first time, 3 sent back, 8 of 8 in the end.`
- Hashtags: `#creatormarketing #linkedinmarketing #claude #anchors #contentreview`

**LinkedIn post**
- First line (hook): `Would you approve this LinkedIn draft?`
- Alt first line, only if confirmed: `[REAL: confirm before posting] We sent one brief to 8 creators. Only 5 drafts matched it the first time.`
- Body:
  `Claude did not. Here is how drafts get reviewed against a brief in one chat (Part 2 of 3):`
  `- The brief says what to avoid, up front ("excited to announce", "revolutionary")`
  `- Each draft is checked against it: Zeko AI named, hashtag in place, no absolute claims, no press-release tone`
  `- Drafts that match are approved; misses go back with the exact words to change`
  `- Revisions are re-checked before approval`
  `- Then you set live dates once and the posts go live`
  `Part 3: monitoring the live campaign.`
  `[REAL: confirm before posting] Result: 5 approved first time, 3 sent back, 8 of 8 approved.`
  `Link in the first comment.`
  `#CreatorMarketing #LinkedInMarketing`

### Part 3 (MONITOR)
**YouTube Shorts**
- Title: `Ask your campaign how it's doing (Part 3/3)` (43 chars)
- Description:
  `Part 3 of 3. Here is how to monitor a live creator campaign in one Claude chat: ask "How is it performing?" and read impressions, cost against plan, one creator's post, the comments and who engaged.`
  `Part 1: building the campaign <P1>. Part 2: reviewing the drafts <P2>.`
  `Try it: https://anchors.in`
  `[REAL: confirm before posting] Results: 2,80,000 impressions (280,000), Rs 525 CPM against a Rs 540 plan, comments 71% positive / 25% neutral / 4% negative, 47% of commenters in HR or Talent Acquisition roles.`
  `#Shorts #CreatorMarketing #LinkedInMarketing #Claude`

**Instagram Reel**
- Caption:
  `Ask your campaign how it's doing.`
  `Here is how monitoring works in one Claude chat: ask "How is it performing?" and read the numbers, the plan, one creator's post, the comments and the audience.`
  `Part 3 of 3. Link in bio.`
  `[REAL: confirm before posting] 2.8 lakh (280,000) impressions, Rs 525 CPM vs a Rs 540 plan, 71% positive comments.`
- Hashtags: `#creatormarketing #linkedinmarketing #claude #anchors #campaignanalytics`

**LinkedIn post**
- First line (hook): `What if checking a campaign was a single question?`
- Body:
  `Here is what one question returns in a Claude chat (Part 3 of 3). Ask "How is it performing?" and read:`
  `- Impressions so far, then the final count`
  `- Cost against the plan (CPM = cost per 1,000 views)`
  `- One creator's post, up close`
  `- The comments, praise and pushback together`
  `- Who engaged, by role`
  `Ask, read, decide.`
  `[REAL: confirm before posting] Result: 2,80,000 impressions (280,000) against a 2.69-2.77 lakh forecast; Rs 525 CPM against a Rs 540 plan; 71% positive, 25% neutral, 4% negative comments; 47% of commenters in HR or Talent Acquisition.`
  `Link in the first comment.`
  `#CreatorMarketing #LinkedInMarketing #InfluencerMarketing`

Series note: pin Part 1/2/3 links in the first comment or profile; post order 1, 2, 3 (cadence is the client's choice, no cadence is claimed in the videos).

---

## 8. Boundary tables (copy for the music and edit teams)

All frames = beat x 15. All three videos: 96 beats, 1440 f, 48.000 s.

**Part 1:** b0 f0 | b4 f60 | b8 f120 | b12 f180 | b20 f300 | b32 f480 | b44 f660 | b52 f780 | b60 f900 | b64 f960 | b68 f1020 | b76 f1140 | b88 f1320 | b96 f1440. Internal anchors: b16 f240 (range lock), b27 f405 (sort cut), b38 f570 (Enter), b36/b40/b43 (riser, roll, kick out).
**Part 2:** b0 f0 | b4 f60 | b8 f120 | b12 f180 | b20 f300 | b24 f360 | b30 f450 | b40 f600 | b52 f780 | b56 f840 | b64 f960 | b70 f1050 | b78 f1170 | b88 f1320 | b96 f1440. Internal anchors: b3 f45 (stamp), b28 f420 (5 of 8), b46 f690 (hard cut Darika->Priyanshu), b55 f825 (hush), b58 f870, b60 f900, b63 f945 (snare roll), b64 f960 (GOLD), b76 f1140 (button pulse), b80-83 live pings.
**Part 3:** b0 f0 | b4 f60 | b12 f180 | b16 f240 | b20 f300 | b26 f390 | b34 f510 | b46 f690 | b54 f810 | b66 f990 | b78 f1170 | b88 f1320 | b96 f1440. Internal anchors: f15 (bubble), f36-60 (ramp), b6 f90 (counter->tile morph), b24 f360 (ramp start), b40 f600 (marker cross), b72 f1080 (toggle to Commenters).

---

## 9. Open points

No true blockers. Three non-blocking confirmations (production proceeds on the stated default):
1. Source plate checks: Part 1 f0 frame (v4 src 8.2-8.6, first fully risen bubble) and A src 8.4-9.9 ("Avoid" line visible) must be viewed once; if not suitable, the native card covers them with no change to the beat sheet.
2. Claude/claude.ai look-alike UI: brand/trademark use not cleared (audit section X); copy uses "in a Claude chat with anchors connected" and never implies endorsement.
3. Because decision 1 removes all on-screen tags, the audit's [SA S2-07] and [SA S3-02] integrity findings are carried only by copy. If the client later wants a persistent label, the safe slot is bottom-left of the card band, 32 px, 80% white; no beat changes.
