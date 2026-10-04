# Social cuts: brutal visual audit (Stage 1/2/3, 9:16 and 4:5)

Method: every video was sampled at 3 fps and reviewed as contact sheets (13 sheets per video, 78 total), then suspect moments were pulled at 540px-wide frames. Timestamps in the tables are sheet-derived (sheet N, thumbnail k => t = (N-1)*4 + k/3 s; frame = t*30, accuracy about +-10 frames). Entries marked (V) were checked on an extracted single frame. Both aspect ratios share one timeline, so a defect listed once at a time usually exists in both unless the row says otherwise. Source scripts were grepped for every number quoted.

Severity: BLOCKER = do not publish with this. MAJOR = visible to a normal viewer, fix before publish. MINOR = polish.

Root-cause tags: [crop] plan crop window, [overlay] Remotion overlay component (caption, pill, ring, progress bar), [leak] source UI leaking in, [engine] retime/crossfade/freeze logic.

No credits and no "Deep insights" content was found in any of the six videos. No "weak" or negative creator wording found. Stage 3 shows a negative comment (Sandeep R.) and a rank list, both of which are in script_B, so they are on-script.

---

## 1. Verdicts

**Stage1_916 (51.4 s) 4/10.** The idea of the cut is fine and the end card is clean, but the build is sloppy. The cover frame is a washed-out grey ghost of "LIVE." (frame 0), the chapter pill and progress bar are laid on top of the card header so the caption collides with "Campaign plan for Zeko AI" (V), hard-crop scenes clip the left edge mid-word, every number is shown two or three times (big number, ring, pill), off-script mid-count values are on screen ("Rs 2,89,625", "Rs 3,01,314", "Rs 0", "Rs 1,45,405"), the "Keep the closest fits" scene displays the eight creators being dropped, and the finale contains dead empty cards and a stray white ring. A client who sees "overlap, clipped, duplicates" is describing exactly this file.

**Stage1_45 (51.4 s) 5/10.** Cleaner than the 9:16 because STACK cards are used everywhere and there are no hard-crop collisions with the caption, but it inherits the same duplicate pills, the same off-script mid-count values, the same dead cards, mis-registered orange rings that cut words in half, the dropped-creators list, and a hook headline that orphans "chat.". The card occupies the top half and the bottom 45% of the frame is dead black; UI text is 5 to 6 px tall at phone width.

**Stage2_916 (49.3 s) 4/10.** Lowest density of text collisions, but the cover is broken (card text cut mid-word on the left in frames 0 to 60, only the word "Would" showing, (V)), the composition jumps between "card at top, caption in the middle" and "card in the middle, caption at the bottom", several scenes have the caption sitting on the progress labels, source fragments leak in the Mobile-preview crops ("g. They didn't fully. The", "f Work"), chips and pills are half cut at the card edge, "8 of 8" is double-exposed during a crossfade, and brief/review scenes are unreadable tiny text with 15 to 20 empty-card frames at scene starts.

**Stage2_45 (49.3 s) 5/10.** The first 2 seconds are a full-bleed card that violates the 80 px margins, the card text is clipped mid-word on the left and the Off-brief stamp is cut at the right edge. After that it settles into a clean headline-plus-card rhythm, but half the frame below the card is empty, text inside the cards is illegible on a phone, dark empty cards appear at four scene starts, a second dark card overlaps the draft preview at about 19.5 s, and the end card tagline orphans "chat.".

**Stage3_916 (49.3 s) 3/10.** The worst of the six. Counters run edge to edge with under 30 px margin, 2,80,000 is shown twice in the hook (caption plus counter) and twice again at the lock (white plus orange glow), the "Right people. Right roles." scene stacks a caption, a clipped bubble, a half-cut tab bar, a pill and a clipped source sentence on top of each other (V), crossfades double-expose numbers (1,85,700 on top of 1,85,700, V), the caption strikes through table rows with the progress bar running through the text (V), and about 20 off-script mid-count values are frozen on screen for 0.3 s or more each.

**Stage3_45 (49.3 s) 4/10.** Better margins than the 9:16, but the cover frame is a blurred "5,573" (not the payoff), the table appears twice side by side during a crossfade at about 3 s, the caption sits on the chat bubble in the last third, the tile cards are tiny with clipped second rows, grey-blur backgrounds make the white caption low contrast, and the same duplicate/mid-count problems as the 9:16 are present. The end card is left-aligned where the other two 4:5 end cards are centred.

---

## 2. Defect tables

### 2.1 Stage1_916 (1080x1920, 1543 f)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S1V-01 | 0.00 s f0 (V) | BLOCKER | Frame 0 is a washed pale-grey slab with "LIVE." at about 10 percent opacity. This is the thumbnail/first-frame; nothing reads. | [engine] white flash at the loop key lands on f0 | Make f0 the settled hook frame (live board + orange LIVE.). Put the 2-frame white flash at the end (loop return) and on b1/b2 only. |
| S1V-02 | 0.50-1.07 s f16-32 | MAJOR | "PAID." orange slab on the light cream blur: contrast about 2:1. Payment card is a small card in the middle with blank blur above and below. | [crop][overlay] light STACK bg with orange text | Use a dark blur plate behind light pages, or switch the slab to dark ink on light pages. |
| S1V-03 | 0-1.7 s f0-50 (V f10, f40) | MAJOR | Hook cards are 580-px tall at y 590-1170, the bottom 40 percent of the frame is blur. Table text about 11 px = illegible at 360 px phone width. 0.5 s per flash gives no time to read "4 Live". | [crop] STACK card too small | Hard-crop the chip row ("4 Live / 4 Scheduled") and the Rs 1,47,000 and the "8" at 1.6x; text-first, not card-first. |
| S1V-04 | 1.67 s f50 | MAJOR | Blank-chat HARD crop: input text "ite a message..." clipped at the left edge mid-word. | [crop] window x660 starts inside the field | Re-centre the window on the field (x 480-1080 window) or show the placeholder fully. |
| S1V-05 | 1.9-2.3 s f58-70 | MINOR | "One chat.Whole campaign." has no space while the words reflow; ghost words shift. | [overlay] word-by-word caption | Fix with fixed per-word slot widths, no tracking between words. |
| S1V-06 | 12.4-13.7 s f372-410 (V) | BLOCKER | Progress bar (y 258) and chapter pill "02 PLAN" sit on the top of the card. Caption "Know the reach first." overlaps "Campaign plan for Zeko AI" and tab row "Setup / Matched creators / Proj". Right edge clips "Proj", "Max spen", "Rs 3,01". | [overlay] bar at y258 is inside the card zone; [crop] HARD x360 w608 | Move progress/pill above the card (y 200) or below it; push the HARD crop 120 px down so no card header is under the caption; widen window so tabs are not cut (or use STACK). |
| S1V-07 | 12.7-13.4 s f380-402 | MAJOR | Off-script mid-count values on screen: "Max spend Rs 2,89,625", "Rs 3,01,314" (script: Rs 3,01,388). | [engine] source animation not settled | Cut the HARD crop on the settled frame or retime so counters finish before the crop; never show the "Rs 2,89,625 / 3,01,314" frames. |
| S1V-08 | 13.7-16.3 s f410-490 | MAJOR | Triple duplicate: big "5.42-5.58 lakh" in the card, an orange ring around it, and an orange pill "5.42-5.58 lakh" below. Then "Rs 540" in the card plus ring plus "Rs 540 CPM" pill. | [overlay] callouts duplicate visible UI | A callout is allowed only for a number NOT visible in the UI. Keep the ring, drop the pill (or keep a pill and no ring). |
| S1V-09 | 17.7-19.2 s f530-575 (V f556, f575) | BLOCKER | Sort HARD crop: caption "Sort them your way." overlaps "anchors / CLEO", "Campaign plan for Zeko AI" and "matched for HR audiences". Pill "Sort: Engagement" covers "Ahmedabad / Delhi" under the creator names. "1.97%" and "Followers" clipped at the right/left edge. | [crop][overlay] | Push the crop down below the caption zone (start y >= 300 in source px), move the pill below the card, keep the cards fully inside the frame. |
| S1V-10 | 18.7-19.0 s f560-570 | MAJOR | Orange empty outlined boxes on the right edge during the sort (ring component misregistered after the crop move). | [overlay] ring anchored to source coordinates, not crop | Anchor rings to the crop transform, or drop them in HARD scenes. |
| S1V-11 | 21.7-23.3 s f651-700 | MAJOR | Typed bubble "Cut to the 8 closest fits and cap the budget at Rs 1,50,000." AND pill "8 closest fits. Rs 1,50,000." (same words twice). Orange rings cut words in half ("clos|est"). | [overlay] | Remove the pill during 7a; fix ring bounding box to word boundaries. |
| S1V-12 | 22.7-24.0 s f680-715 | MAJOR | The 8 names shown (Siddharth Jogani, Mayank Jain, Raghav Jhawar, Ajay Kumar, Piyush Bathwal, Harshdeep Saxena, Arijit Ghosh, Vivekananda Sinha) are NOT the final roster (Ashish, Riya, Gunjan, Priyanshu, Jyoti, Sunidhi, Shubhangi, Darika). The source line above them is "furthest from HR". The caption says "Keep the closest fits." over the creators who are cut. | [crop] plan sc.7b | Show the roster after the cut (src 43.1-44.7) instead, or relabel as "Cut: 8 further from HR". Safer: skip 7b. |
| S1V-13 | 24.0-25.0 s f720-750 | MAJOR | Source sentence "one. Roster is 8, budget capped at Rs 1,50,000." clipped at the left edge above the 16-to-8 slab (leak). Slab "16 to 8." sits on a heavily blurred card, the card is unreadable behind it. | [leak][crop] | Crop window starts below that line (y+40) and clip the card with a mask, or fade the slab in only after the roster card settles. |
| S1V-14 | 25.2-27.8 s f755-835 | MAJOR | Forecast card: "Max spend" row faded/cut at the card bottom. Pills "Rs 3,00,000 -> Rs 1,50,000" and "2.69-2.77 lakh" duplicate the Budget and Projected rows visible in the card. | [crop][overlay] | Extend the card 80 px or crop the last row out cleanly; drop the pill whose number is already readable. |
| S1V-15 | 27.9-29.0 s f836-870 | MAJOR | Caption "Briefs for all 8." plus pill "8 creators" (8 shown twice) plus an orange ring that passes through the name "Priyanshu" ("Priy|anshu"). | [overlay] | One 8 only; ring on the pill row, not through text. |
| S1V-16 | 29-32 s f870-960 | MINOR | Brief copy about 12 px = pure texture; first lines half cut at the top edge of the card. | [crop] | Intended as texture, but mask the top edge with a gradient, not a hard crop. |
| S1V-17 | 34.3-35.0 s f1029-1050 (V f1050) | MAJOR | Payment page opens as a blank white card with only the stepper, then a check with no text ("Payment successful" missing for about 10 frames). Ghost of baked "Pay once." as blurred smudge in the lower blur. | [crop][leak] | Start the pay crop at the settled frame; mask the blur source so the baked caption cannot appear. |
| S1V-18 | 35.0-35.7 s (about f1050-1070) | BLOCKER | Off-script numbers frozen on screen: "Rs 0" and "Rs 1,45,405" before "Rs 1,47,000". | [engine] source count-up | Hold the count: freeze at the final value (src 73.4) and only crossfade into it. |
| S1V-19 | 32-34 s f960-1029 | MINOR | "Nothing is charged until you pay." line and "CLEO - Get the payment link" half cut at the card bottom; an orange blurred blob (button) in the lower blur reads as an artifact. First 10 frames of the scene have no caption. | [crop] | Crop to y<=930 without cutting a row; desaturate the blur. |
| S1V-20 | 34.9-35.3 s | MINOR | Pill "Rs 1,47,000" duplicates the ringed "Total payable Rs 1,47,000" already in the card. | [overlay] | See S1V-08 rule. |
| S1V-21 | 36.7-39.5 s f1100-1185 (V f1100) | MAJOR | Dates: grey skeleton bars in the Publish date column during load; a caption "Set" with a half-cut bubble "Go live tomorrow or later, staggered over three days." at the top of the card; pill "Wed 7 . Thu 8 . Fri 9" duplicates the table; "anchors CLEO - Set a live date" chip list clipped at the card bottom with a ring half outside. | [crop][overlay] | Hold on the settled table; remove the bubble; drop the pill or the date column. |
| S1V-22 | 39.7-41 s f1190-1230 | MAJOR | LinkedIn feed card shown rotated, neighbour cards cut at both edges, post text about 9 px. Tiny, unreadable, off-axis. | [crop] | Hard crop only on the headline "Impressions vs. evidence" and the author name; do not show the rotated carousel. |
| S1V-23 | 41.0-42.0 s f1230-1260 | MAJOR | Dead frames: an empty dark card (only the "Live on LinkedIn." caption ghost). | [engine] scene boundary | Trim 8-10 frames or start the board scene on the first populated frame. |
| S1V-24 | 44.3-44.7 s f1330-1340 | BLOCKER | At the climax: an empty dark card with a lone white ring (date-chip ring with nothing inside) and the "8 creators" pill, for about 0.4 to 0.7 s. | [engine][overlay] | Cut the crossfade; keep the board visible; ring must follow the chip, not stay when the source clears. |
| S1V-25 | 41-44 s f1230-1330 | MINOR | "8 creators" pill (8 shown again) while "Three days. Eight posts." says eight. | [overlay] | Drop the pill. |
| S1V-26 | 45.0-47.0 s f1350-1410 | MAJOR | Tease caption "Next: drafts. Approvals. Results." is three sentences over a dimmed board. The source sentence "Your campaign is live. Posts go up over three days." leaks above the card at about 46.5 s (f1390-1405) and overlaps the card top. | [leak][overlay] | Crop below that line; caption becomes two words "Next: drafts." |
| S1V-27 | 47.0 s f1410 | MINOR | Board snaps back to full brightness one beat before the end card (looks like a glitch). | [engine] | Keep the 35 percent dim through the cut. |
| S1V-28 | 47.1-51.4 s | MINOR | End card OK. "Zeko AI, live on LinkedIn." is about 14 px, grey, unreadable on a phone. Loop: last frame (end card) hard-cuts to the pale f0 (no flash as planned). | [overlay] | Raise to 28 px; add the planned white flash on the last 2 frames. |
| S1V-29 | whole video | MAJOR | Bottom 40 percent of frame is blur/black in most STACK scenes (card height 500-600 px of 1920). Not native, wasted. | [crop] | Scale the card to 1080 wide where the source allows, or place the card at y 500-1300 and the callout inside the card zone. |

### 2.2 Stage1_45 (1080x1350)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S1F-01 | 0-1.3 s f0-40 | MAJOR | Headline "A full creator campaign. One chat." wraps with the orphan "chat." on line 2. The card (920 wide) sits at y 360-870 and the bottom 40 percent is empty dark; table text about 8 px at card scale = 3 px on a phone. | [overlay][crop] | Set the headline on one line at 56 px or break after "campaign."; scale the card or crop the chip row. |
| S1F-02 | 1.67 s f50 | MAJOR | Blank-chat crop shows "ite a message..." clipped at the left edge mid-word and the bar half off the right edge. | [crop] | Same as S1V-04. |
| S1F-03 | 5.0-5.7 s f150-170 | MAJOR | Tool line "s integration, loaded tools" clipped at the left edge of the card (half-visible first word). | [crop] | Include the first 30 px of the line. |
| S1F-04 | 4.3-6.0 s f130-180 | MAJOR | Orange rings are mis-registered: ring on "https://zeko.ai." starts inside "https" ("ht|tps") and the ring on "Budget Rs 3 lakh" cuts "Bud|get". Same on the cut request ("clos|est fits and ca|p"). | [overlay] | Compute ring boxes from the text bounding boxes after the crop scale. |
| S1F-05 | 8.0-9.7 s f240-290 | MAJOR | "Three choices" card: left edge clips "I read zeko.ai." ("read"), "Audience" ("udience"), "Product" ("roduct"), "Motive" ("otive"). | [crop] | Shift the STACK card 18 px right/left so its own left padding is inside the frame. |
| S1F-06 | 10.0 s f300 | MINOR | One empty dark card frame before "The plan builds itself." | [engine] | Trim. |
| S1F-07 | 12.0-16.5 s f360-495 | MAJOR | Max spend off-script mid-values ("Rs 2,89,625", "Rs 3,01,314") on screen; pill "5.42-5.58 lakh" + ring + big number; pill "Rs 540 CPM" + ring + card. | [engine][overlay] | As S1V-07/08. |
| S1F-08 | 16.7-18.5 s f500-555 | MINOR | Card jumps size between thumbnails (the sort scene card is smaller than the cascade card; bezel changes). | [crop] | Use one card size for the whole scene. |
| S1F-09 | 18.7-19.0 s f560-570 | MAJOR | Sort animation double-exposes rows: "48,795 769 Mishra 1.97%" overlap = text on text, partially faded. | [engine] source crossfade | Skip the source frames mid-reorder (freeze the pre-sort frame, then cut to the post-sort frame). |
| S1F-10 | 19.7 s f590 | MAJOR | Empty dark rounded card (dead) between "Sort them your way." and "Keep the closest fits." | [engine] | Trim. |
| S1F-11 | 21.7-23.6 s | MAJOR | Dropped-creators list (see S1V-12) plus duplicate pill (S1V-11). Names list card has no header, floating. | [crop] | Same. |
| S1F-12 | 23.6-24.7 s f707-740 | MAJOR | "16 to 8." slab over the blurred card (card unreadable); leak line "one. Roster is 8, budget capped at Rs 1,50,000." at f740-750. | [leak] | Same as S1V-13. |
| S1F-13 | 25-27.9 s f755-835 | MAJOR | Table "Max spend" row cut by a gradient; typed value "Rs 1,50,000" truncated to "Rs 1,50,00" for about 3 frames; pill duplicates Budget row, pill "2.69-2.77 lakh" duplicates Projected row. | [overlay][engine] | As S1V-14. |
| S1F-14 | 27.9-29 s | MAJOR | "8 creators" pill duplicates "Briefs for all 8."; ring through "Priyanshu". | [overlay] | As S1V-15. |
| S1F-15 | 29-32 s | MINOR | Brief copy 9-10 px (texture only); top lines half cut. | [crop] | Mask. |
| S1F-16 | 32.0 s f960 | MINOR | First 8 frames of "Every rupee, itemised." have no caption. | [overlay] | Start caption on the cut frame. |
| S1F-17 | 34.3-35.7 s f1029-1070 | BLOCKER | Blank white pay card, then check only, then "Rs 0" and "Rs 1,45,405" (off-script) before "Rs 1,47,000". Orange blob in the lower blur. | [engine][leak] | As S1V-17/18. |
| S1F-18 | 36.7-39.5 s | MAJOR | Skeleton grey bars in the date column; top table row cut ("Jyoti Vyas" half visible at the top edge, f1160); chip list clipped; pill dup of the table dates. | [crop] | As S1V-21. |
| S1F-19 | 39.7-41 s | MAJOR | Rotated feed card with neighbours cut left/right. | [crop] | As S1V-22. |
| S1F-20 | 41.0 s f1230 | MAJOR | Empty dark card. | [engine] | Trim. |
| S1F-21 | 44.3-44.7 s f1330-1340 | BLOCKER | Empty card with a lone white ring + "8 creators" pill (same as S1V-24). | [engine][overlay] | Same. |
| S1F-22 | 45-47 s | MAJOR | Three-sentence tease + source sentence "Your campaign is live. Posts go up over three days." leaking above the card (f1390-1405). | [leak] | Same as S1V-26. |
| S1F-23 | 47.1-51.4 s | MINOR | End card OK; the progress bar disappears (fine). Tag line tiny. | [overlay] | Raise tag size. |

### 2.3 Stage2_916 (1080x1920, 1479 f)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S2V-01 | 0.0-1.2 s f0-36 (V f0, f36) | BLOCKER | Cover: the draft card is a hard crop clipped at the left edge ("o announce Zeko AI", "d the world's number one", "orce intelligence", "orm your hiring overnight"), pale card, only the word "Would" on a tilted ghost. A clipped sentence is the thumbnail. | [crop] | Use STACK with the whole card width (all lines complete), or a card crop that starts at the left padding of the post. Caption must be complete on f0. |
| S2V-02 | 1.0-1.7 s f30-50 | MAJOR | Orange blurred smudge (stamp ghost) under the caption; "Dramatised example" label (about 14 px) sits at the card bottom touching the caption zone. "Off-brief" stamp is fine but tilted and close to the right edge. | [overlay] | Remove the ghost blur; move the label above the card. |
| S2V-03 | 2.0-2.7 s f60-80 (V f66) | MAJOR | Dead frames: empty dark rounded card. A lone "8" glyph appears directly above the BRIEF progress label (caption "Eight creators to brief." typing in at y about 1370, touching the BRIEF/REVIEW/APPROVE labels at y about 1445). | [engine][overlay] | Trim the empty card; caption position must not change between scenes. |
| S2V-04 | 2.7-4.3 s f80-130 | MINOR | Avatar chips tiny (about 14 px names); the card is at y 160-340 while the caption is at about 1100, leaving a 700 px gap. | [crop] | Scale up the pill row 1.6x; keep caption within 150 px of the card. |
| S2V-05 | 4.3-12 s f130-360 | MAJOR | Brief scroll: UI text about 11-13 px at 1000 px card width (4 px on a 360 px phone). Top lines half-cut at the card's top edge ("xample angles:" with the first letters clipped, "Write briefs for all 8." bubble sliced). Word-by-word caption "Every creator gets a clear brief." reflows (baseline shifts when each word appears). | [crop][overlay] | Treat the text as texture; add one highlighted line at readable size (e.g. the "Key points" header) via HARD crop. Pin the caption slot width. |
| S2V-06 | 14.6-15.7 s f440-470 | MINOR | Orange blurred blob (source button) behind the BRIEF label. | [leak] | Dim the blurred plate to 35 percent brightness. |
| S2V-07 | 16.0-16.3 s f480-490, 19.7 s f590 | MAJOR | Empty dark cards (dead). | [engine] | Trim. |
| S2V-08 | 17.7-18.3 s f530-550 | MAJOR | Table clipped at the right: "Change requests / Publish date" columns cut, row 7 faded mid-reveal. | [crop] | Include the full table width or crop to the first 3 columns cleanly. |
| S2V-09 | 20-24 s f600-720 | MAJOR | Draft preview text about 7-8 px, illegible; caption touches the card bottom. The "Claude's check" panel overlaps the preview's footer. | [crop] | Hard-crop the check list (it is the message), drop the preview text. |
| S2V-10 | 24-28 s f720-840 | MINOR | "Same standard, every draft." touches the progress labels (about 8 px gap). Mobile preview is a narrow card with clipped sidebar. | [overlay] | 40 px spacing between caption and labels. |
| S2V-11 | 28.0-28.7 s f840-860 | MAJOR | Empty card; then "Approve is final." with a huge ghost digit behind the caption and a card at the very top. Layout jumps: card y flips from 740 to 170 to 740. | [crop][engine] | Fix card anchor Y for the whole stage. |
| S2V-12 | 28.7-31 s f860-930 | MAJOR | "Say exactly why." the crop shows source fragments ("g. They didn't fully. The", "f Work", "ions/ead") and the date chip is sliced to a calendar icon at the right edge ("Tue 6 Oc"). The card sits at the top with a 600 px void to the caption. | [crop][leak] | Crop the left panel away or show it whole; widen the window by 40 px for the chip. |
| S2V-13 | 31-35 s f930-1050 | MAJOR | "Name Zeko AI in the first two li|" cut at the right card edge; the "Changes requested - Change requests: 1/2" pill is half cut at the bottom of the card (f1040). | [crop] | Extend the card 60 px. |
| S2V-14 | 35-37 s f1050-1110 | MINOR | "Two more. Sent back." wraps with the orphan "back."; word-by-word reflow shifts. | [overlay] | Break after "more." or reduce to 54 px. |
| S2V-15 | 38.3-38.9 s f1150-1165 | MAJOR | Card is nearly blank, only a truncated line "Revised drafts are back from Ashish, Darika" and a clipped chip "Tue 6 Oc". | [crop] | Start the crop on the populated frame. |
| S2V-16 | 39.0-40.3 s f1170-1210 | MAJOR | "5 of 8" / "6 of 8" tiles (text 20 px) and the table (about 8 px) are unreadable; the card is tiny at the top while the caption is "Revised." about 300 px lower. | [crop] | Replace by the native "n of 8" counter. |
| S2V-17 | 40.3-41.0 s f1210-1230 | MAJOR | Crossfade: "8 of 8." overlay slab over the card's own "8 of 8" = numbers twice, plus giant blurred orange/white digits behind. Double-exposure text on text. | [engine] | Cut cleanly; remove the card tile. |
| S2V-18 | 41-43.3 s f1230-1300 | MINOR | "8 of 8." holds 2.3 s with only the table blur behind. Long and static. | [engine] | Hold 1.2 s. |
| S2V-19 | 43.3-45.0 s f1300-1350 | MINOR | "Next:" alone for 0.33 s; then "Next: set live dates." on pure black with a grey progress (the Stage 3 tease is fine). | [overlay] | Type the full line in one go. |
| S2V-20 | 45.7-49.3 s f1370-1479 | MINOR | End card: tagline wraps with the orphan "a chat."; tagline sits flush under the logo (about 10 px gap); CTA text about 22 px. No loop seam: ends with a dim fade, first frame is the clipped card. | [overlay] | Break after "campaign". Add 24 px gap. Loop to a settled first frame. |

### 2.4 Stage2_45 (1080x1350)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S2F-01 | 0-1.7 s f0-50 | BLOCKER | Cover: the draft card is full-bleed (touches x=0 and x=1080, margin 0 vs the 80 px rule), the post text is cut mid-word at the left ("nnounce", "e world's", "e intelligence"); caption f0 is just "Would you" (the question is incomplete on the cover). "Off-brief" stamp is cut at the right edge at 1.0 s ("Off-bri|ef"). | [crop][overlay] | Same fix as S2V-01, with 80 px margins. Complete the caption by f0. |
| S2F-02 | 2.0-2.3 s f60-70 | MAJOR | Empty dark card; the next 0.3 s the title "Eight creators to brief." sits above a dark empty box. | [engine] | Trim. |
| S2F-03 | 2.7-4.3 s | MINOR | Chips row 12 px tall; large void under. | [crop] | Scale. |
| S2F-04 | 4.3-11.7 s f130-350 | MAJOR | Brief scroll text 9-11 px, "Write a message..." input bar half cut at the card bottom (visible stripe under the text), first lines half cut at the top. | [crop] | Mask both edges with gradients. |
| S2F-05 | 11.7 s f350 | MAJOR | Empty card between brief scroll and "Same brief. Their own angle." | [engine] | Trim. |
| S2F-06 | 13.3-15.5 s f400-465 | MINOR | The underlined orange line "Angle - founder hiring: ..." is fine, but the card shows only 3 lines, the rest of the frame is dark; the card top is half cut ("xample angles:"). | [crop] | OK, just mask top edge. |
| S2F-07 | 15.7 s f470 | MAJOR | Empty dark card with greyed chips ("Text / Text + image") half faded. | [engine] | Trim. |
| S2F-08 | 17.3-18.3 s f520-550 | MINOR | Orange blurred blob bottom left behind the card (source button). | [leak] | Dim. |
| S2F-09 | 19.3-19.7 s f580-590 | BLOCKER | Two dark rounded rectangles stack and overlap the draft preview card ("Each draft checked against the brief." frames 1-2): the Claude-check panel arrives as an empty dark box covering the lower right of the preview. Overlap of UI on UI with empty content. | [engine] | Start the scene at the first frame where the panel has content. |
| S2F-10 | 20-23 s | MINOR | "Claude's check" panel overlaps the footer of the preview ("Ready for review / Cha..." cut). | [crop] | Pull the panel 40 px down. |
| S2F-11 | 25-28 s | MINOR | Mobile preview narrow card, text 9 px. | [crop] | Acceptable if only the badges read. |
| S2F-12 | 29.7-32.0 s f890-960 | MAJOR | Mobile-preview fragments leak at the left of the "Changes requested" card ("of Work", "ng. They didn't fully. The", "ive talent conversations"); "Mobile" tab sliced ("obile"); chip "Mon 5 Oct" overhangs the card edge. | [crop][leak] | As S2V-12. |
| S2F-13 | 33-34 s f990-1030 | MINOR | "Changes requested - Change requests: 1/2" chip cut at the card bottom. | [crop] | Extend. |
| S2F-14 | 38.0-40.3 s | MAJOR | Table card tiny with clipped "Tue 6 Oc"; "8 of 8" slab double-exposes with the card tile. | [engine] | As S2V-17. |
| S2F-15 | 45.7-49.3 s | MINOR | End card tagline orphans "chat." (first line "Run your creator campaign in a"); CTA fine. | [overlay] | Break after "campaign". |
| S2F-16 | whole | MAJOR | Bottom 40-45 percent of every scene is dead dark (card ends at y about 1000). | [crop] | Same as S1V-29. |

### 2.5 Stage3_916 (1080x1920, 1479 f)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S3V-01 | 0.0-1.5 s f0-45 (V f0) | BLOCKER | Duplicate: caption "8 creators. 2,80,000 impressions." AND the big counter "2,80,000" directly below it, touching the caption ("impressions." sits on the counter card). Counter card runs x 0-1080 with the forecast label ("Forecast 2.69-2.77 lakh") clipped at the right edge. This is also the cover. | [crop][overlay] | Caption becomes "8 creators. One chat." (no number); card scaled to 960 wide with 60 px margins. |
| S3V-02 | 0.1-1.3 s f4-40 | MINOR | Hook counter mid-values (5,573 blurred, 1,11,341, 2,28,041, 2,69,185) are the intended race, but digits touch the card edges with under 20 px margin. | [crop] | 100 px padding. |
| S3V-03 | 2.0-3.7 s f60-110 (V f100) | BLOCKER | Caption "All 8 posts live." overlaps table rows (Priyanshu, Darika), progress bar line strikes through "Fri 9 Oct 10:00 AM / 1:00 PM"; source serif line "All 8 posts are live." leaks directly above (same message as the caption, twice); "8 Live" chip as a third copy of the 8. Table full-bleed, date column clipped ("Wed 7 O"). | [crop][leak][overlay] | Crop below the serif line; caption and bar above the card; drop the "8 Live" chip or the caption word "8". |
| S3V-04 | 3.7-4.3 s f110-130 | BLOCKER | Chat bubble "How is it performing?" collides with the caption; chip "performing" clipped at the left edge. | [crop][overlay] | Move the caption up 120 px or crop the bubble out. |
| S3V-05 | 4.3-6.0 s f130-180 | MAJOR | Counter card full-bleed: "1,32,126", "1,81,781", "1,85,672", "1,85,700" run to the edges (under 30 px margin) and the lock frame "1,85,700" is larger than the card, clipped at the left. | [crop] | Same as S3V-02. |
| S3V-06 | 6.0-6.7 s f180-200 (V f190) | BLOCKER | Crossfade: the big "1,85,700" is drawn on top of the tile row's own "1,85,700" and "Likes 1,778" (mid-count) = same number twice in one frame, text on text, plus a ring. | [engine] | Cut hard from the big counter to the tiles; no crossfade of two crops. |
| S3V-07 | 6.7-8.0 s f200-240 | MAJOR | Tile carousel clipped at the right edge ("Lik", "C"), tiles flush to x=0, mid-counts Likes 2,497 / 2,919 frozen, tile text about 14 px. | [crop][engine] | STACK strip with margins; freeze after count. |
| S3V-08 | 8.0 s f240 | MAJOR | "Data as of Fri 9 Oct 2026, 8:00 PM" source line leaks. | [leak] | Crop out. |
| S3V-09 | 9.3-11.0 s f280-330 | MINOR | "Two weeks later." with 28 px side margins (full-bleed text); fine as a title but the chip "Fri 23 Oct 2026" is 16 px tall. | [overlay] | Scale chip up. |
| S3V-10 | 11.7 s f350 | MAJOR | Empty dark card. | [engine] | Trim. |
| S3V-11 | 12.0-12.7 s f360-380 | MINOR | "The finalcount." missing space during the word reveal; giant blurred digits under the card at f380. | [overlay] | Fixed per-word slots. |
| S3V-12 | 12.7-14.3 s f380-430 | MAJOR | Counter mid-values frozen for 0.3 s each: 2,15,330 / 2,37,431 / 2,54,929 / 2,67,821 / 2,76,109 / 2,79,793 (script has only 2,80,000). Full-bleed edge to edge. | [engine][crop] | Race the counter in one 12-frame ramp (not sampled slow-mo). |
| S3V-13 | 14.3-15.3 s f430-460 | BLOCKER | The same number twice: white "2,80,000" in the counter and an orange glowing "2,80,000 impressions" directly under it. | [overlay] | Remove the overlay; keep the glow on the card number. |
| S3V-14 | 15.0-15.7 s f450-470 | MAJOR | Crossfade fragment: "000" digits overlap tile contents on the next scene (half-visible number). | [engine] | Hard cut. |
| S3V-15 | 16-20 s f480-600 | MAJOR | "Rs 525 CPM. Plan: Rs 540." wraps ("Plan: Rs / 540." orphaned); caption + pill "Rs 525 vs Rs 540 plan" + tile "Rs 525 / plan Rs 540" + green pill "Rs 15 below plan" = the same fact four times. Pill sits on top of the tile text. | [overlay] | Keep caption OR pill OR tile callout, not all. |
| S3V-16 | 16.5-19.7 s f495-590 | MAJOR | Tile mid-count values shown frozen: Likes 4,179 / 4,447 / 4,495; Comments 287 / 348 / 359; CPM Rs 448 / 513 / 524; Budget used Rs 79,578 / 1,33,467 / 1,44,647 / 1,46,825 (all off-script). | [engine] | Same as S3V-12. |
| S3V-17 | 17-20 s | MINOR | Tile text about 13 px; source line "CLEO - How the campaign is performing" clipped at the left; chat input bar half visible at the bottom ("message..."). | [crop][leak] | Mask. |
| S3V-18 | 20.0-23.5 s f600-705 | MAJOR | Rank card shows only 3 of 8 creators (Shubhangi 61,500 / Ashish 44,800 / Darika 68,900) under "Total, 8 creators 2,80,000": the numbers do not add up on screen. Mid-counts frozen: 39,754 / 28,959 / 44,538 / Total 62,187 / 61,044 / 68,389 / 2,65,761 / 2,79,727. Total row 2,80,000 and green pill "Total: 2,80,000" at about 22.3-23.3 s (f670-700) duplicate. Rows reorder in 6 frames (layout jump). | [crop][engine][overlay] | Add "Top 3 of 8" label or show all 8; freeze only after counts; drop the pill. |
| S3V-19 | 23.7-28 s f710-840 | MAJOR | "Beat the plan." white caption on mid-grey blur (blurred white card) about 3:1; slider mid-values (1,89,228 / 2,00,335 / 2,28,903 / 2,61,474 / 2,75,067 / 2,79,560) frozen; badge "above range" and pill "Above range" both visible; card's bottom row ("Max spend / Spent") cut; ghost pill "Rs 15 below plan" fading in the card; chat input clipped at f760. | [crop][engine][overlay] | Darken the blur (brightness 45 percent) for light cards; one "above range" only. |
| S3V-20 | 28-32 s f840-960 | MAJOR | "Zoom in on one post." first frame empty; mid-values 42,101 / 684 / 59 then 44,800 / 728 / 63; pill "1.77% engagement rate" duplicates the sentence "...a 1.77% engagement rate."; pill "Published Wed 7 Oct" duplicates the card's own "Published on Wed 7 Oct 2026, 10:00 AM". Card flush to both edges. | [crop][engine][overlay] | As S3V-15. |
| S3V-21 | 32-34 s f960-1020 (V f1000) | MAJOR | "Praiseand pushback." missing space; bar mid-count 0% / 53% / 70% / 26% positive (92) shown (script 71% / 25% / 4%); pill "71% positive / 4% negative" duplicates the source row. | [engine][overlay] | Fix as above. |
| S3V-22 | 35-38 s f1050-1140 (V f1100) | MAJOR | Comment card clipped at the top: "...positive (256) 25% neutral (91) 4% negative" half visible; quote cards flush to the edges (Neha K. "Our debriefs..." sliced at the left). | [crop] | Crop above the bar row, keep the whole row, or below it. |
| S3V-23 | 40.7-44.7 s f1220-1340 (V f1250, f1300, f1340) | BLOCKER | "Right people. Right roles." stack: caption on top of the Roles rows ("L&D / Other 17%" row hit by "Right people. Right"), bubble "Who did it rea|ch?" clipped at the right edge, tab "Commen|ters" sliced by its own highlight pill, input "Write a me|ssage" clipped, orange pill "Commenters: 47% HR / TA - Likers: 38%" on top of the card, and at f1340 the source sentence "Commenters skew HR Manager / Talent Acquisition: 47% (Likers 38%)" flush at x=0 duplicates the pill (47% three times: card, sentence, pill). Mid-counts 40% / 44% / 41% (script 41%) on screen. | [crop][overlay][leak] | HARD crop Roles only (x 0-540) with a 100 px side margin, drop the bubble/tabs/input from the crop, one pill. |
| S3V-24 | 45.0-46.2 s f1350-1385 | MINOR | The scene before the end card dips to a nearly black frame with only a red dot (OK), then logo appears left, tagline wraps. | [overlay] | Fine, hold 3 frames less. |
| S3V-25 | 46.3-49.3 s f1390-1479 | MINOR | End card OK; ends on a dim fade (no loop to the hook); CTA text about 24 px. | [overlay] | Loop. |

### 2.6 Stage3_45 (1080x1350)

| ID | Time / frame | Sev | What is wrong | Root cause | Fix |
|---|---|---|---|---|---|
| S3F-01 | 0.0-1.7 s f0-50 | BLOCKER | Cover (f0) is a blurred "5,573" (counter start), not the payoff; at 1.0 s the counter "2,69,185" runs out of its card edges; at 1.3 s the number "2,79,927" overflows the card. The headline says "2,80,000 impressions" while the counter shows other numbers (the hook race), then the lock frame shows the same 2,80,000 twice in the frame (headline + card). | [engine][crop] | Use the freeze f45 (2,80,000 landed) as f0 as planned; drop the number from the headline; card with margins. |
| S3F-02 | 1.7-2.0 s f50-60 | MINOR | Title "Every number. One chat." appears on a brown vignette for 0.3 s, ok but the progress bar vanishes. | [overlay] | Fine. |
| S3F-03 | 2.0-3.3 s f60-100 | BLOCKER | The board is a hard crop: "ll 8 posts are live." source sentence clipped at the left and duplicates our caption "All 8 posts live."; table clipped at the right ("Publish", "Wed 7 O"); at 3.0-3.3 s two copies of the table appear side by side (crossfade of two crops), i.e. "Creator Status Publish da | Creator Status Publish" in one frame. | [crop][leak][engine] | STACK card, crop below the serif line, hard cut. |
| S3F-04 | 3.7-4.0 s f110-120 | MAJOR | Bubble "How is it performing?" clipped at the right edge ("Who did it rea" family), ghost table dates above it. | [crop] | Include the whole bubble. |
| S3F-05 | 4.3-6.0 s f130-180 | MAJOR | Counter card runs to the frame edges, mid-values 1,32,126 / 1,81,781 / 1,85,672. | [crop][engine] | As S3V-05. |
| S3F-06 | 6.0-6.5 s f180-195 | BLOCKER | Orange circle ring + double exposure: "Impressions 1,85,700" of the big counter overlaid on the tile row's "Impressions 1,85,700" (text on text; two layers of "Impressions"). | [engine] | Hard cut. |
| S3F-07 | 6.7-8.7 s f200-260 | MAJOR | Tile card is tiny (500 px wide in a 1080 frame, 2/3 of the frame is black); second row ("Engagement rate 1.45%", "Posts live 8 of 8") half cut at the card bottom ("1,45%" sliced) for about 2 seconds; Likes 2,497 / 2,919 mid-counts frozen. | [crop][engine] | Scale card 1.8x; extend crop 80 px. |
| S3F-08 | 10.7 s f320; 11.7 s f350 | MAJOR | Empty dark cards (dead). | [engine] | Trim. |
| S3F-09 | 12.0-14.0 s f360-420 | MAJOR | Mid-count values 2,15,330 ... 2,79,793 frozen; "The final count." | [engine] | As S3V-12. |
| S3F-10 | 14.0-15.0 s f420-450 | BLOCKER | White "2,80,000" in the counter + orange glowing "2,80,000 impressions" below (duplicate, client-flagged). Next frame: big "2,80,000" overlaid on the tile "2,80,000 ... 000" (fragment). | [overlay][engine] | As S3V-13. |
| S3F-11 | 16-19.7 s f480-590 | MAJOR | Tiles at about 50 percent scale with the top row cut ("4,500 / 361" fragments above the card, f540-590). Tile mid-counts: Likes 4,179 / 4,447 / 4,495, Comments 287 / 348 / 359, CPM Rs 448 / 513 / 524, Budget Rs 79,578 / 1,33,467 / 1,44,647 / 1,46,825. Caption + pill "Rs 525 vs Rs 540 plan" + green pill "Rs 15 below plan" + tile = 4 copies. | [crop][engine][overlay] | As S3V-15/16. |
| S3F-12 | 19.7-23.5 s f590-705 | MAJOR | Same rank card issues as S3V-18 (3 of 8, mid-counts 39,754 / 28,959 / 44,538 / 62,187 / 61,044 / 68,389 / 2,65,761 / 2,79,727, pill "Total: 2,80,000" + row 2,80,000, pill "Darika: 4th to 1st" + highlighted row). | [crop][engine][overlay] | Same. |
| S3F-13 | 23.7-28 s f710-840 | MAJOR | Grey blur background behind white caption = low contrast (white on about #8a8a8a); slider mid-values frozen; "Above range" duplicated; card bottom rows cut; pill overlaps card edge. | [crop][engine] | As S3V-19. |
| S3F-14 | 28-32 s | MAJOR | First frame empty card, mid-values 42,101 / 684 / 59, pill duplicates, card top row clipped (sentence cut at the card top). | [engine][crop] | As S3V-20. |
| S3F-15 | 32-35 s f960-1050 | MINOR | "Praise and pushback." fine; bar 0% / 53% / 70% mid-count; quote text fades in grey. | [engine] | Hold counts. |
| S3F-16 | 34.3-37.3 s f1030-1120 | MAJOR | Bar row "...positive (256) 25% neutral" half cut at the card top for 3 s; pill "71% positive 4% negative" duplicates it. | [crop][overlay] | As S3V-22. |
| S3F-17 | 40.7-44.5 s f1220-1335 | BLOCKER | "Right people. Right roles." caption is directly on the grey bubble "Who did it reach?" (y 120 vs bubble top 130), the bubble/tabs bar bleed off the right edge, the Locations card is clipped at the right ("Locatio"), the input bar "Write a message..." overlaps the progress bar and bleeds off the right edge, the pill overlaps the input bar; at about 44.0 s the source sentence "Commenters skew HR Manager / Talent Acquisi" is clipped and the pill is on top of it. | [crop][overlay][leak] | As S3V-23. |
| S3F-18 | 44.7-45.3 s f1340-1360 | MINOR | Wide four-panel card at about 42 percent scale: unreadable (all text under 6 px). | [crop] | Drop, or hold 8 frames at most. |
| S3F-19 | 46-49.3 s | MINOR | End card left-aligned (S2_45 and S1_45 are centred); the CTA glow pulse reaches x=1020 (past the 80 px margin); the fade-out at the end, no loop. Bottom 45 percent empty. | [overlay] | Centre on the same axis as the other two stages. |

---

## 3. Cross-cutting (systemic) problems

1. **Callouts duplicate the UI.** Every stage adds a pill or ring for a number that is already readable in the source card (5.42-5.58 lakh, Rs 540, Rs 3,00,000 -> Rs 1,50,000, 2.69-2.77 lakh, Rs 1,47,000, 8 creators, Wed 7 / Thu 8 / Fri 9, 2,80,000, Rs 525 vs Rs 540, Total 2,80,000, 1.77%, Published Wed 7 Oct, Commenters 47%). Then the caption repeats it too. Rule: one representation per number per beat; a pill is only for a number that is NOT visible in the card.
2. **Mid-count values are frozen on screen.** The retime logic samples source count-up animations at slow speed, so each intermediate value lives for 0.3 to 1.0 s: Rs 2,89,625 / 3,01,314, Rs 0 / 1,45,405, 2,15,330 to 2,79,793, Likes 4,179 / 4,447 / 4,495, Budget used Rs 79,578 / 1,33,467 / 1,44,647 / 1,46,825, CPM Rs 448 / 513 / 524, rank values, slider 1,89,228 to 2,79,560, 42,101 / 684 / 59, 0% / 53% / 70% / 26%, roles 40% / 44%. About 40 distinct off-script numbers across the six videos. Fix at engine level: for every count-up, jump from the pre-count frame to the settled frame with a 4-frame ease, or run the counter natively in the overlay.
3. **Overlay positions are not tied to the crop.** The progress bar at y 258 (9:16) sits inside the card for several scenes and cuts through table text (S3V-03); rings and pills are anchored to source pixel coordinates and drift off after HARD punch-ins (mis-registered rings that cut words in half in Stage 1 and orphan rings in S1V-24).
4. **HARD crops clip content at the left/right edge.** The 608-px window cuts mid-word at x=0 in every hard-crop scene: "udience", "oduct", "otive", "ite a message", "ompaign plan", "nounce Zeko AI". The plan chose 608 px windows without checking per-scene content extent.
5. **Empty dark cards at scene boundaries.** About 25 occurrences (the source container exists before its content). Trim the first 6-10 frames of each source scene or start each scene on its first populated frame.
6. **Crossfades produce double exposures.** Two-crop crossfades place text on text (1,85,700 on 1,85,700, "8 of 8." on "8 of 8", two tables side by side). Replace with hard cuts or a 2-frame dip.
7. **Source leaks.** "All 8 posts are live." serif line, "Data as of Fri 9 Oct 2026, 8:00 PM", "one. Roster is 8, budget capped at Rs 1,50,000.", "Your campaign is live. Posts go up over three days.", "Commenters skew HR Manager / Talent Acquisition: 47% (Likers 38%)", mobile-preview fragments, "CLEO - How the campaign is performing", baked "Pay once." as a blur ghost, source button as orange blurred blobs.
8. **UI text is unreadable on a phone.** Card text of 8-13 px in source pixels reaches the viewer at 3-5 px. Anything that must be read has to be set at 40+ px in output pixels, either via a tight HARD crop with margins or a native re-typed overlay.
9. **Composition: card small, huge dead space.** STACK cards occupy 30 to 50 percent of the canvas height; the bottom 40 percent of the 4:5 and about 40 percent of the 9:16 are blur or black. The card and caption anchor Y moves between scenes (card top vs middle) so each cut feels like a layout jump.
10. **Caption engine bugs.** Missing spaces during word reveal ("One chat.Whole", "The finalcount.", "Praiseand pushback."), orphans (chat., back., 540., a chat.), caption sometimes empty for the first 8 frames of a scene.
11. **Blur-plate contrast.** White captions on light/grey blur (Beat the plan., PAID., Pay once., Sort them your way. over the cream card) have 2:1 to 3:1 contrast.
12. **Covers.** Four of the six first frames are unusable: S1V f0 (pale ghost), S2V f0 (clipped text), S3F f0 (blurred 5,573), S2F f0 (full-bleed clipped). Only S3V f0 shows a payoff, and it has the duplicate.
13. **Loop seams.** No stage loops to its hook; all end in a dim fade (S1 hard-cuts to a ghost frame).
14. **Consistency.** End-card alignment differs: S1/S2 centred, S3_45 left-aligned; CTA text wraps differently in every stage.

---

## 4. Prioritised fix list

P0 (publish blockers)
1. Replace the four broken covers (S1V-01, S2V-01, S2F-01, S3F-01) with settled hero frames.
2. Kill every duplicate number (callout rule in section 3, item 1), especially 2,80,000 in the Stage 3 hook and lock (S3V-01/13, S3F-01/10), Rs 1,47,000, 5.42-5.58, 47% HR, 8 creators.
3. Remove all frozen mid-count values (Rs 0, Rs 1,45,405, Rs 2,89,625 / 3,01,314, tile and rank counters).
4. Fix overlaps: S1V-06, S1V-09, S3V-03, S3V-04, S3V-06, S3V-23, S3F-03, S3F-06, S3F-17, S2F-09, S1V-24 / S1F-21.
5. Remove the dropped-creator list and the three-sentence tease (S1V-12, S1V-26).

P1
6. Re-register rings and pills to the crop transform; clip every card/crop with 60-80 px margins (S1F-04, S1F-05, S3V-05 and similar).
7. Trim all empty dark cards (about 25 occurrences) and the blank-white pay card.
8. Crop out all source leaks listed in section 3, item 7.
9. Replace crossfades by hard cuts (S3V-06/14, S2V-17, S3F-03).
10. Fix caption engine (spaces, orphans, anchor Y); darken the light blur plates.

P2
11. Scale cards so key text is at least 40 output px; remove the tiny-text scenes (brief scroll, feed carousel, four-panel audience) or reduce them to 8 frames.
12. Standardise end card alignment and add a loop return.

## 5. Rebuild vs patch

| Video | Recommendation | Why |
|---|---|---|
| Stage1_916 | Rebuild the middle (scenes 4b, 5, 7, 8, 9, 13, 22, 23b, 24) as native overlays with re-typed numbers on a clean dark card; patch hook, end card. | Overlay anchoring, crop windows and count handling are all wrong; patching each scene is as costly as rebuilding. |
| Stage1_45 | Patch. | STACK layout is sound; fix rings, pills, dead cards, dropped list, pay counter, tease leak. |
| Stage2_916 | Rebuild the cover and the first 12 s (cards, brief scroll) and the Revised/8 of 8 block; patch the rest. | Card anchor jumps, clipped cover and crossfade double exposure need a layout rework, not nudges. |
| Stage2_45 | Patch. | Margins, cover crop, empty cards, overlap at 19.5 s, source fragments. |
| Stage3_916 | Rebuild. | Hard crops, duplicate overlays, mid-count values and the final stack scene are structural; the plan's own warning ("never freeze before f683") was not honoured. Use the native number cards the plan recommended (rank card, tile strip) instead of cropped source. |
| Stage3_45 | Rebuild the counter/tile scenes natively (S3F-01, 05-11, 13, 17); patch the others. | Same engine problems, but margins and the cover are fixable in place. |
