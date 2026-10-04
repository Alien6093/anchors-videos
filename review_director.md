# Director's review: script_v3 (150s, 16:9, no VO)

Reviewed: script_v3.md (all), script_v1.md, contact sheets 1-3 of the v1 cut. No files edited except this one.

## Verdict (blunt)

The story logic is good. The film as scripted is not readable. v3 stacks v1's density (which already lived at the edge at 60s) into 32 scenes, most of which are 3-5s. Roughly 20 of the 32 scenes contain more on-screen text than a viewer can read in the time given. The "PACING MAP" labels SLOW for exactly the scenes that carry the MOST content in the LEAST time, so it does not produce rhythm; it produces a wall of dense tables with a caption on top. The film also has no visual break between 14s and 77s except a blur cut and a few widgets. Fix: fewer things per scene, real dwell on the few things that matter, one hard visual change of scene (dashboard) moved earlier, and a proof section that climbs instead of decays.

Reading budget I used: ~3 words/sec for text the viewer must read, ~5 words/sec for pattern-recognisable UI (tables, chips), plus 0.5s to find where to look. Big-number or one-word moments need 1.5s minimum hold.

---

## 1. Reading-time audit (scene = v3 scene number)

| Sc | Given | Text on screen (approx) | Needs | Verdict |
|---|---|---|---|---|
| 3 | 3.5s | ~40-word serif paragraph + 13 chip words + caption | ~14s | UNREADABLE. Cut Claude's text to "I read zeko.ai. Three choices." |
| 4 | 3.5s | bubble + 3 chips + tool + spinner + 0:41 chip | 4s | OK if scene 3 is shortened |
| 5 | 5s | Setup: ~55 words (product, audience, motive, budget, storyline, 3 directions, 3 brands) + 2 captions | ~12s | Too much. Spotlight only Storyline + 3 directions; dim the rest |
| 6 | 4s | 4 tiles + Claude line + caption | 6s | Tight. Hold only "5.42-5.58 lakh" and "16" |
| 7 | 8s | 4 cards (~50 words), filter typing, sort FLIP, card-to-list morph, pager to page 2, 2 captions | ~15s and 5 different interactions | TOO MANY SIMULTANEOUS THINGS. Keep cascade + sort only |
| 8 | 5s | panel ~35 words | 5s | OK |
| 9 | 4s | bubble 17 words, tool, 3 chips, count, 3 tagged rows, Claude line | ~10s | UNREADABLE. CUT |
| 10 | 5s | credit chip, 5 stats, 4 topic bars, 3 top posts, compare strip (~100 words) | ~14s | UNREADABLE. Merge with 8, show 3 things max |
| 11 | 4s | 8 names + 8 descriptors + question + bubble (~75 words) | ~12s | UNREADABLE. Show 8 names only, no descriptors |
| 12 | 6s | 5-row before/after table + 2 captions | 7s | Tight. Big-type 16 to 8 carries it; show 3 rows |
| 13 | 4s | 8 name pills | 4s | Fine but it is filler |
| 14 | 7s | ~170-word brief | ~45s | Cannot be read; it must play as TEXTURE. Only the six bold labels are meant to register. Design for that (see #6) |
| 15 | 4s | 3 cards ~60 words | ~10s | UNREADABLE. Show only the highlighted line per card |
| 16 | 4s | chips, 3 sentences, link table | ~9s | UNREADABLE. Show format chip pick + one attachment clip only |
| 17 | 3s | 8 avatars stamped | 3s | OK |
| 18 | 4s | 5-row quote, 3 chat turns, tool lines, link chip, click | ~9s | Too much. Show 5 rows dropping and total; drop turns |
| 19 | 4s | ~40 words (rows, breakdown, stepper, button) + 2 captions | 5s | Cut the rows to 3 (see #5) |
| 20 | 5s | 5-col x 8-row table with flips | 5s | OK (flip is the read) |
| 21 | 5s | card ~60 words + 5 checks + mobile toggle | 6s | OK only if checks are the focus |
| 22 | 5s | Jyoti card + 3 cuts of 0.9s each | 0.9s per card is a flash | Fine as rhythm, but label it as flashes, not reading |
| 23 | 4s | 3 chat turns (~35 words) + 5 tool lines + 5 badges | ~8s | Too much. Drop chat turns; show 5 badges filling |
| 24 | 4s | flawed post, 2 crosses, typed change (~20 words), badge | ~8s | Tight. Typed note IS the beat; drop the Claude check line |
| 25 | 3s | 2 panels ~110 words incl. 2 long change requests | ~15s | UNREADABLE. Show only the underlined flaw phrases and a 5-word note each |
| 26 | 5s | ~45 words + table + big counter | 5s | OK |
| 27 | 5s | 8-row date table (~60 words) + 2 chat turns + 8 tool lines | ~10s | Too much. Show 3 dates, rest as shimmering rows |
| 28 | 4s | board flip + post card + line | 4s | OK |
| 29 | 9s | 5 tiles + 8-row x 3 numbers + highlights + "Data as of" | 12s | Fine as numbers, but 2,80,000 must hold alone >= 1.5s |
| 30 | 6s | bar, chips, 3 comments (~60 words), concerns strip | ~12s | Card swaps of 0.9s for a 20-word comment is unreadable. One comment, 2.5s |
| 31 | 6s | 4 panels + toggle | 6s | OK |

Rule for the rewrite: every scene gets ONE reading target and at most TWO secondary things; everything else is dimmed to 30-40% or blurred (the film's own "unchanged text dims to 40%" idea, use it everywhere).

Captions themselves are fine (max ~5 words, 1.2-2s each). Problem is the UI under them, and that two captions in one 3-4s scene (sc. 1, 5, 12, 19, 26, 27, 29) leave no time to look at the UI. One caption per scene under 5s.

---

## 2. Pacing / rhythm

The PACING MAP claims 62s slow / 52s medium / 36s fast. Reality: "slow" scenes are where the most stuff is stacked (sc. 7, 10, 22-25, 29). So the tempo the viewer feels is the cut rate: 32 scenes in 150s = 4.7s average, with 19 of them at 4s or less. It reads as a uniform fast clatter with a 22-second-long dense tunnel (23-45) and another (55-77). Fast/medium/slow only produces rhythm if slow = FEW things held LONG (a number, one card, one sentence).

Concrete rhythm changes:
- Slow beats (>= 5s, a single subject): plan projection, deep-dive, 16 to 8, brief typing, Riya's review, "8 of 8", 2,80,000. That is 7 slow beats, spaced roughly every 20s.
- Everything between them fast (2.5-4s), single-idea.
- Add three 1.5s "breaths" (blur/dimmed chat + kinetic caption only, no UI motion) at: before the cut to 8 (~41s), after payment (~76s), before metrics (~120s). v1 had this rhythm and its contact sheets show it working: caption, UI, caption.

---

## 3. Emotional arc and retention

- **First 5s (MUST FIX):** v3 opens on a blank chat with a caption, 3.5s of text on black with almost nothing moving. v1's hook was a myth ("Structured interviews still hide gut decisions") which gave the viewer a tension; v3's "Zeko AI needs HR to notice." is a client problem statement, not a viewer hook, and "One chat. The whole campaign." is the promise with no evidence yet. Typing a prompt at 3.5-7 is the least interesting shot in the film. Fix: cold-open the payoff for 1.6s (8 LinkedIn cards fan in, a blurred counter ticks to 2,80,000, hard smash to black), then "One chat. The whole campaign." on beat, then type. Or restore the v1 myth line as the first caption. Either gives a reason to stay past 5s. The final number is unchanged, so the constraint is respected.
- **Sag 45-77 (MUST FIX):** the film goes: cut (a decent moment at 45-55), then 22s of brief-writing, variations, format/link, sent. Only one of those (the brief) is a hero; the others are admin. Energy stays at 6 for 54 straight seconds (23-77) per the music map. This is where YouTube retention drops. Fix: (a) kill scenes 9, 13, most of 15/16, (b) move payment earlier (see #5) so the scene-change lands at ~70s instead of 81s, (c) pull the "8 of 8" beat as far forward as possible.
- **Mid-film question:** the deep-dive at 40-45 and search at 36-40 (23 matches) lead nowhere: search results are never used and deep-dive only pays off if Ashish is later sent back (he is, but nothing connects them). Either cut sc. 9 or make the search one that ADDS to the roster (it can't; roster then is 16 not 8). Cut it.
- **Proof section (MUST FIX):** the music map falls 7 to 5 to 4 to 2 across 125-150, and the scenes get quieter (sentiment, audience) exactly after the 2,80,000 moment. Tension in this film is spent at 111-125; the proof should feel like a second climb. Sequence should be: reach number (peak) then two quick supporting proofs then end card, with the melody resolving at the number, not at 146.
- **Ending:** 4s hold is right. Do not extend. The single warm chord + silence is good.

---

## 4. Visual variety, motion, continuity

Problems:
1. 150s in the same dark chat column with the same "push-in 100 to 108%" on nearly every scene = monotone camera. Vary: lateral pan, pull-back reveal, macro punch-in to 140% on one number or row, rack-focus (blur background), and one 2D "whip" transition. Assign a camera move per scene and never repeat the same move in adjacent scenes.
2. 16:9 with a narrow single-column chat leaves large empty side margins (visible in every contact sheet). Use them: caption cards on the side, ambient tool-line text, or crop the camera INTO the column so the UI fills frame at key moments. Right now captions overlay and blur the UI (see contact-1/2: "Approve what's" over the card, "Review like a" blocking the draft), which fights the reading problem in #1. Put captions in the empty margin or at frame bottom, not over content.
3. Only two "other looks" exist: cream widgets and LinkedIn cards. Add: the dashboard (full-bleed, different palette), one full-frame kinetic-type moment (v1 had them and they were the only real scale changes; v3 has none over 5 words), and the full-bleed LinkedIn post at live.
4. Continuity: the single continuous chat is a strength ("the chat is the whole world") but 32 scenes stacked in one transcript means the camera must scroll through hundreds of lines. Do it as a camera pan that always anchors on the newest block; hide "thread reset" behind whip-blurs at 45, 85, 120. Don't try to keep the whole thread on screen.

**Dashboard payment scene as a change of scene:** correct instinct, under-delivered. Currently a 4s fade into a page with 10+ lines. Make it the film's one hard cut: the chat link chip ("Pay Rs 1,47,000 on anchors") expands to fill the frame (shared-element scale), background goes to a LIGHT/cream full-bleed page (the only light full-screen in the film), music key change to C major, silence 0.3s before the check draws. Show only: stepper, green check, "Payment successful", "Rs 1,47,000", "Campaign activated" chip, "ANC-ZK-2610". Cut paid-on, reference, breakdown accordion, invoice link, secondary rows (all unreadable at this length and add risk: a real-looking reference ID is not needed). Drop the second caption ("Campaign activated") since the chip already says it. Return via the "Back to Claude" button click with a 0.5s reverse whip. Also: this is the ONLY place the brand's own UI is seen; make it the best-looking frame.

---

## 5. Story and believability (16 to 8 to 8 to 8 to 8 to 8)

The arithmetic reconciles and 16 to 8 is now an explicit, dramatized decision. Good. Problems:

1. **Briefs are sent BEFORE payment (MUST FIX).** Sc. 17 "Briefs sent to 8 creators" happens at 74-77; then sc. 18 says "Nothing is charged until you pay"; then the dashboard shows "Creators briefed 8" as a post-payment fact. A buyer notices: you told creators to start work before paying, and the dashboard contradicts the chat. Fix: Sc. 14/16 end with briefs READY ("Ready to send"), payment happens, then "Briefs sent to 8 creators" stamps AFTER the dashboard. This also gives the film a proper "money unlocks work" cause-and-effect and makes "Campaign activated" mean something.
2. **Time passage is unmarked (SHOULD FIX).** Payment is 28 Sep (Mon). "Go live from tomorrow" gives Tue 29 Sep, not Tue 6 Oct, so "Earliest is Tue 6 Oct" reads as a mistake unless the viewer has seen a week pass. Drafts arrive in 5s after payment. Add a date chip on the drafts scene ("Sat 3 Oct") and on the review ("Mon 5 Oct") so the viewer feels the calendar moving, and the "earliest tomorrow" line then works. Also set script line 15's "Mon 5 Oct" consistently on the dashboard (it says drafts expected Sat 3 Oct: good).
3. **Ranks and data drift from the live product (MUST FIX if "faithful to the live product" is a hard requirement).** v1's contact sheet shows the live plan: Ashish #1, Riya #3, Gunjan #4, Priyanshu #10, Jyoti #11, Sunidhi #12, Shubhangi #13, Darika #16 (8,19,422 followers, 0.09% engagement), Sunidhi 1,11,324 followers. v3 re-ranks so the 8 kept are #1-#8 and invents "Tagline+", sorted lists, topics, top posts and comparable brands. If the product actually ranks Darika #16, the scripted "cut the weakest 8 = #9 to #16" would remove Darika, the creator with the biggest reach later (68,900). That breaks the story. Either (a) keep the real ranks and make the 8 dropped creators the true #2, #5-#9 etc. (script becomes "cut 8" naming creators from the real list) or (b) confirm the ranks are re-scored in the live product. This needs an owner decision before build; open question 3 undersells it.
4. **"Cut the 8 weakest" then Claude asks for names** is believable and fun; keep it, but show Claude PROPOSING the 8 names as chips and the user tapping "Yes" (one action). The long descriptive sentence is unreadable and adds nothing.
5. **Budget halves automatically** (Rs 3L to Rs 1.5L). A finance-minded viewer would ask why. It is an unverified product behavior (open question 1). Safer: leave budget line as "Budget Rs 3,00,000" on the plan and show only creators, impressions and Max spend changing; end tile "Rs 1,47,000 of Rs 1,50,000" then needs a "re-scoped budget" moment. If that can't be verified, take the budget row out of the 16 to 8 table entirely and keep only Creators / Impressions / Max spend. Decision needed either way.
6. **Live board**: all 8 flip to Live at 121 although dates run 6-8 Oct. v1's contact sheet handled this well (some rows still Scheduled while others go Live). Keep the staggered, partial flip: 4 Live, 4 Scheduled, then the "Two weeks later" jump shows all Live.
7. **Comments**: "who validates the validation" negative and "another tool promising evidence" are believable. Pooja T.'s "interrogation" line could read as competitor sniping; fine. Note the tone constraint: none of the copy says demo/sample/mock. Check that "Zeko AI, live on LinkedIn." small line stays (v1's "Zeko AI campaign, live on LinkedIn." is fine too).
8. One small thing: v1 metrics screen showed a per-creator table without Zeko caption; v3's engagement values (1.59-2.68%) contradict "avg engagement 1.74%" only if someone rechecks; they don't. Fine.

---

## 6. Music and SFX

- **Energy map**: 7 plateaus at 5-6 for 54s. Fix: shape it as a wave, not steps. Suggested: 2 (hook) then 4 (typing) then 5 (plan) then 6 (creators) then 4 (dip at cut, 1.5s only, not 4s) then 6 (16 to 8 lift) then 5 (briefs, steady arpeggio) then 8 (payment key change) then 5 (drafts) then 6 (reviews) then 3 (silence beat) then 9 (8 of 8) then 8 (dates) then 10 (live) then 8 (metrics, count-up as crest) then 5 (comments/audience) then 2 (end).
- **Silence beat (104-111 in v3, 109.5-111.0 total):** the idea is right (tension, then the "8 of 8" drop). But it lands during scene 25, the densest reading scene (110 words of change requests in 3s). Silence + unreadable text = confusion, not tension. With the text pared back to underlined flaws, 1.2s of near-silence works. Keep silence at 1.2s max, drum tail-out under the last 0.5s, drop on the frame before the "8 of 8" chime.
- **The 45-49 drop-out** is fine in principle but 4s is too long: names and 16 to 8 need music. Make it 1.5s (bass + click) at the "Cut 8 weakest" send, then bring the groove back on the count roll.
- **Drop moments**: "8 of 8" at 111.4-114 is the best-designed moment (layered chime, low impact, 5% slow-mo). Keep. The live peak at 121 (cymbal swell) is too close after; separate the two by making the 8 of 8 hit a GOLD moment (one big impact, no cymbal) and save the cymbal/riser for live.
- **SFX**: ~200 cues. In a film where the viewer is also reading, this is tick fatigue. Tier them: Tier 1 (always loud: send/Enter, approve chime, live pings, counter ramp, logo hit), Tier 2 (subtle: chip pops, tab clicks), Tier 3 (cut): word ticks, 8 name ticks, 8 pop-outs, row ticks, stamp ticks, and any tick already implied by the groove. Keep SFX quantized to the 112 BPM grid or the 16th-note taps will fight the marimba. Duck the pluck 3 dB under any typed-text moment so keystrokes read.
- **Sound gaps**: the dashboard needs its own timbre (glass/soft bell, warm pad) since it is the scene change; the payment chime should be the only note not in the groove.

---

## 7. Production feasibility (Remotion)

Existing components: chat shell, cream CLEO widget (Setup + Matched creators tab; Projection tab is stubbed), creator cards, draft preview, review/status table, cursor, kinetic text, counters, metrics panel, sentiment bar, LinkedIn fan card, end card.

NEW components needed, by scene (1 person-day = 1 day for one dev):

| Scene | New component | Effort |
|---|---|---|
| 3/4 | Choice-chip rows + chip-selection states | 0.5d |
| 4 | Time-lapse chip (counter + spinner) | 0.25d |
| 5 | Directions cards / comparable chips (Setup tab additions) | 0.5d |
| 6 | Projection tab (range bar, 4 tiles) | 0.5d |
| 7 | Sort with FLIP re-ordering, list view, pager | 1.5d (list view + pager: 1d of it; cut them) |
| 8 | Creator side panel (slide-in, stats) | 0.75d |
| 9 | Filter-search result widget | 1d (CUT) |
| 10 | Insights card (topic bars, top posts, credit chip) | 1d |
| 11 | Name-chip removal list | 0.5d |
| 12 | Before/after table with cell overwrite + 16 to 8 roller | 0.75d |
| 13-14 | Claude brief block with per-line typing + orange label flash | 0.75d |
| 15 | Three variation cards with line highlight | 0.5d |
| 16 | Format chips, attachment clips, link table | 0.75d (mostly cut) |
| 17 | Avatar stamp row | 0.4d |
| 18 | Quote table with total underline | 0.4d |
| 19 | Dashboard checkout page (light theme, stepper, check-draw, shared-element expand) | 1.5-2d, the single biggest new build |
| 21 | Brief-check checklist over draft preview | 0.5d |
| 22 | Tile-of-4-cards flash layout | 0.25d (reuse draft preview) |
| 23 | Approve confirm + badge morph + counter | 0.5d |
| 24-25 | Flaw-phrase underline + typed change note + split panel | 0.5d (split panel exists per contact-2) |
| 27 | Date table + calendar chip | 0.25d (v1 has it) |
| 29 | Tile row + budget bar (metrics panel exists) | 0.5d |
| 30 | Filter chips + comment card swap | 0.75d |
| 31 | 4 audience panels + reached/likers/commenters toggle with bar morph | 1.5d |

Total NEW for v3 as written: ~14-16 dev-days (ex. sound). After the recommended cuts (drop 9, list/pager, most of 15/16, simplify 5/10/18/19/25/30): ~8-9 dev-days.

Engineering risks:
- **Determinism**: all motion must be `interpolate`/spring on `useCurrentFrame`; no CSS transitions or timers. FLIP re-sort (sc. 7) and the card-to-row morph are the riskiest to make deterministic; cut the morph.
- **Render cost**: 4500 frames of full DOM at 1080p with blurs; blur/backdrop filters and large box shadows are slow. Budget concurrency and check a 10s scene render time before committing.
- **The single continuous chat**: the transcript camera (auto-scroll/pan anchored on newest block) is a cross-cutting component, needed first (0.75d), not a per-scene one.
- **Typed text at 1.5-1.8x** with pauses: build a `TypeOn` helper with per-character frame timing and keystroke SFX markers.
- **Audio sync**: 70 bars at 112 BPM = 2.143s/bar; make every scene boundary land on a beat/bar. My re-timing below is off-grid in places; snap to the nearest beat (0.536s) when locking.

---

## 8. Ranked changes

### MUST FIX

1. **Rebuild the hook (0-8s).** Cold-open teaser (0.0-1.6: 8 posts fan + blurred counter, smash cut), "One chat. The whole campaign." on beat 1.6-4.5, prompt typing at 1.8x 4.5-8.5. Removes the "Zeko AI needs HR to notice." caption or moves it into the end card.
2. **Cut scene 9 (search).** Saves 4s and removes an unreadable, non-advancing scene.
3. **Merge scenes 8+10** into one "Open any creator. One credit." beat: panel slides in (3s), credit chip drops, 3 topic bars + 1 top post (5s). Drop the compare strip.
4. **Merge 3+4** into one 7s beat; shorten Claude's text to "I read zeko.ai. Three choices."
5. **Merge 5+6** into 7.5s; spotlight Storyline + directions; hold projection range.
6. **Fix briefs-sent ordering.** Move sc. 17 after the dashboard.
7. **Move payment earlier** (~70s) and make it a hard scene change (light full-bleed page, shared-element expand, key change). Strip it to 5 elements.
8. **Fix the reading load of 11, 14, 15, 16, 25, 27, 30** (see audit). Every one must have a stated reading target; everything else at 35% dim or blurred.
9. **Resolve the rank/data-fidelity conflict with the live product** (Darika was #16 with 8.19L followers in the earlier cut; sc. 11's "#9 to #16 are the weakest" would drop her). Get the real ranks or re-select the dropped 8.
10. **Proof section as a climb:** metrics scene as musical crest, then sentiment + audience as quick supports; do not decay energy after 2,80,000.

### SHOULD FIX

11. **Merge 13 into 14**: the pill row becomes a 1s flash at the start of the brief scene.
12. **Reduce 15 to 3s**, 16 to 3.5s.
13. **Add three 1.5s breaths** with kinetic-only frames before the cut, after payment, before metrics.
14. **Camera-move grammar**: no two adjacent scenes with the same move; add a pull-back reveal at 8 of 8 (show all 8 approved) and macro punch-in on 16 to 8 and 2,80,000.
15. **Move captions out of the UI's reading area** (side margins or bottom), or drop them when the UI is the message (sc. 12, 26, 29 keep captions; sc. 16, 21, 22, 23, 24, 25 caption only 2-3 words).
16. **Live board partial flip** (4 Live, 4 Scheduled) then "Two weeks later" jump.
17. **Mark time passage** with date chips on drafts/review scenes so "Earliest is Tue 6 Oct" reads as correct.
18. **SFX tiering**; cut ~40% of ticks.
19. **Reshape the music energy map as a wave** (see section 6); shorten the cut-drop to 1.5s.
20. **Verify or drop the budget re-scope** (Rs 3,00,000 to Rs 1,50,000) before locking sc. 12.

### NICE

21. Use the side margins for ambient elements (tool-line trails, "credit used" tally) so 16:9 doesn't look like a phone column.
22. One 1-second full-bleed LinkedIn feed frame at live (real post, "Just now", reactions rising) before the board.
23. Brief "dim to reveal" grammar as a consistent motif (unchanged = 40%, changed = orange) across sc. 12, 15, 24, 25.
24. Glass "tick" on every counter lock so the ear learns "a number just became final".
25. Keep the orange rule: orange only on approve / set live / pay / live / final numbers, verify no orange elsewhere (chips selected in sc. 4, 7 should be neutral highlight).

---

## 9. Proposed re-timing to exactly 150.0s

| New # | Old sc | Timecode | Sec | Pacing | Content |
|---|---|---|---|---|---|
| 1 | 1 | 0.0-4.5 | 4.5 | FAST | Cold-open teaser (8 posts, blurred counter) 0-1.6, smash, "One chat. The whole campaign." 1.8-4.5 |
| 2 | 2 | 4.5-8.5 | 4.0 | FAST | "Start with a website." Prompt typing at 1.8x |
| 3 | 3+4 | 8.5-15.5 | 7.0 | MED | Short Claude reply, 3 choice chips selected, plan spinner |
| 4 | 5+6 | 15.5-23.0 | 7.5 | MED-SLOW | Plan widget: Storyline + directions (3s), Projection range and "16 creators" (4.5s) |
| 5 | 7 | 23.0-30.0 | 7.0 | MED | 16 cards cascade, sort by engagement (FLIP). No list view, no pager |
| 6 | 8+10 | 30.0-38.0 | 8.0 | SLOW | Open creator, panel, credit chip, 3 topic bars + 1 top post |
| 7 | 11 | 38.0-42.5 | 4.5 | MED | "Cut the 8 weakest." 8 names highlight; "Yes." (music dips 1.5s) |
| 8 | 12 | 42.5-49.5 | 7.0 | SLOW | "16 to 8." 8 cards shrink, 3-row table. Lift |
| 9 | 13+14 | 49.5-59.0 | 9.5 | SLOW | Pills flash 1s, brief types on (6 labels), dimmed body |
| 10 | 15 | 59.0-62.0 | 3.0 | FAST | 3 variation lines highlighted |
| 11 | 16 | 62.0-65.5 | 3.5 | FAST | Text + image chip, 2 attachment clips |
| 12 | 18 | 65.5-70.0 | 4.5 | MED | Quote rows, total Rs 1,47,000, link chip click |
| 13 | 19 | 70.0-75.0 | 5.0 | HARD CUT | Dashboard: shared-element expand, light page, check, amount, "Campaign activated"; Back to Claude |
| 14 | 17 | 75.0-77.5 | 2.5 | FAST | Back in chat: "Briefs sent to 8 creators." avatars stamp |
| 15 | 20 | 77.5-82.5 | 5.0 | FAST | Drafts flip in a wave; "Sat 3 Oct" chip |
| 16 | 21 | 82.5-88.5 | 6.0 | SLOW | Riya's draft, brief check ticks, Desktop to Mobile |
| 17 | 22 | 88.5-92.0 | 3.5 | FAST | 4 more drafts flash on snare |
| 18 | 23 | 92.0-96.0 | 4.0 | MED | Approve 5 (badges fill, counter 5 of 8) |
| 19 | 24 | 96.0-100.5 | 4.5 | SLOW | Ashish: 2 crosses, typed change, badge |
| 20 | 25 | 100.5-104.5 | 4.0 | MED | Darika + Priyanshu: flaw phrases only; silence 103.3-104.5 |
| 21 | 26 | 104.5-110.0 | 5.5 | HIT | "Revised. Approved." "8 of 8." pull-back reveal, big chime |
| 22 | 27 | 110.0-115.0 | 5.0 | MED | Dates confirm, 3 dates shown, Set live date pulse, riser |
| 23 | 28 | 115.0-120.0 | 5.0 | PEAK | Partial Live flip, full-bleed LinkedIn post, cymbal swell |
| 24 | 29 | 120.0-132.0 | 12.0 | SLOW/CREST | "Two weeks later." Tiles, 2,80,000 alone >= 1.5s, per-creator table, budget used |
| 25 | 30 | 132.0-138.0 | 6.0 | MED | Sentiment bar, 1 positive + 1 negative comment (2.5s each), concerns |
| 26 | 31 | 138.0-145.5 | 7.5 | MED-SLOW | 4 panels, Reached to Commenters toggle |
| 27 | 32 | 145.5-150.0 | 4.5 | HOLD | End card |

Total 150.0s, 27 scenes (from 32), average 5.6s, longest 12.0s (the proof crest). Reading-load check: every scene now has one primary target. Snap boundaries to the 112 BPM grid when locking (2.143s bar, 0.536s beat); expect +/-0.2s adjustments.

Summary of cuts: CUT scene 9; MERGE 3+4, 5+6, 8+10, 13+14; SHORTEN 5, 7 (interactions), 10, 11, 15, 16, 25, 27, 30; RE-ORDER 17 to after the dashboard, dashboard earlier (81 to 70); LENGTHEN 24 (metrics crest) and 26 (audience) using the saved time.

## 10. Open decisions the team needs to make before build

1. Live ranks: are the 8 dropped creators actually the lowest-ranked in the product (and is Darika #16)?
2. Does the product re-scope budget when creators are removed?
3. Are briefs sent before or after payment in the real flow? (If the product sends on brief-write, the chat copy must say "Briefs saved" not "sent" until after payment.)
4. Approve the cold-open teaser (shows the ending number in the first 2s).
