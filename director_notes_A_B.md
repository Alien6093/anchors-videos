# Director notes: Script A (Brief. Review. Approve.) and Script B (Every Number. One Chat.)

Independently checked against script_v4.md. Scenes, rupees, counts, dates, weekdays, creator facts, post copy and change requests: all match v4 verbatim in both scripts. No video built.

## Verdicts

- **Script A: SHIP after the fixes below, subject to client decisions 1, 2 and 3.** Grid and money are right (112 beats, 28 bars, 60.000s; 1,47,000 total; all 2026 weekdays). The real problems were reading time in scenes 4, 5, 13 and 14, and the Claude-check ticks presented as a widget.
- **Script B: FIX-THEN-SHIP, conditional on client decision 1 (Day-three numbers).** Every NEW number is arithmetically correct and flagged. But interim figures are invented for a named client's real campaign, and the film asserts things the product may not show. Scenes 6 to 13 are safe. Scenes 2 to 5 are the exposure.

## Verified independently (no change needed)

- Runtime: A 112 beats, 60.000s, 17 scenes. B 112 beats, 60.000s, 13 scenes. Every boundary time checked (beat x 0.5357).
- Quote: 1,13,251 + 11,325 + 22,424 = 1,47,000. Effective CPM 1,47,000 / 280 = Rs 525. Weekdays: 28 Sep Mon, 3 Oct Sat, 5 Oct Mon, 6 Oct Tue, 7-9 Oct Wed-Fri, 23 Oct Fri (9 Oct + 14 days).
- Post word counts recounted by script: Riya 91, Jyoti 71, Ashish 69 and 71, Darika 58, Priyanshu 68.
- B snapshot: all 8 rows (impressions, likes, comments, per-row rates), totals 1,85,700 / 2,955 / 238, 1.72%, 67-69% of forecast, hours live at Fri 9 Oct 8 PM, ranking change (Darika 4th to 1st), Rs 792 mid-campaign CPM. All correct. Snapshot values are always below the finals.
- B final metrics, sentiment, concerns, audience columns equal v4 section 7.

## Edits made (full log in each file's "Director changes")

Script A
1. Sc 2 camera push-in to lateral pan (scenes 1 and 2 repeated the same move).
2. Sc 4 retimed: the old cues gave the two changed lines 1.6s and 0.8s. READ is now the Angle line only, lit 2.1s.
3. Sc 5 rows stacked and visible from 15.0; READ is two selections; attachments secondary.
4. Sc 7 avatar stagger 0.1s to 0.15s (the eighth stamp now lands on beat 40).
5. Sc 9 and 12: ticks and crosses labelled "Claude's check", not a product widget. Sc 9 hold corrected to 2.1s.
6. Sc 13 underlines cut from 7 phrases (26 words in 3.75s) to the 4 named by the change requests.
7. Sc 14 counter visible from 48.2 (was only 1.07s); Ashish card demoted; flip stagger 0.06s.
8. Sc 16 date chips "Wed 7 Oct" (feed) and "Thu 8 Oct" (board); the 4 Live / 4 Scheduled state is true only Thu 8 Oct 9:30 AM to 12:00 PM.
9. Pacing totals (medium 9.1s, special 12.3s; the old figures summed to 62.2s), "about 21%" wording, "bar line 24" wording.

Script B
1. Sc 11 comments: first sentence is the READ (14 and 15 words cannot be read in 2.4s); rest dimmed; concerns strip dimmed.
2. Sc 5 caption "On pace for the forecast." to "Measured against the plan." (unsupported pacing claim).
3. Sc 7 caption 25.9 to 22.6.
4. "13.1s" and "13s" corrected to 11.8s (15.0s with sc 2) and 13.9s.
5. "Video A" naming clash fixed; "Zeko AI x anchors" line added to B's title card to match A.
6. "All 8 posts are live." and "Update me." marked NEW text.

## A vs B overlap and consistency

- Overlap is small: only the live-state board (A sc 16, B sc 2, different dates) and the end card. Same tagline and small line, CTA patterns match (verb first, anchors.in).
- Title cards now both carry "Zeko AI x anchors". A does not name a series link; B calls itself a sibling of the 150s film (its title reuses "One Chat."). Decide one policy (decision 8).
- Darika is the rejected draft in A's hook and the top performer in B's highlight. If both post close together this reads as a redemption story or as a public shaming, depending on consent.

## Remaining risks (not fixed)

1. **Live times do not exist in the product.** cleo_set_live_date takes a calendar date only (YYYY-MM-DD, IST). The times in v4 and A (Ashish 10:00 AM and so on) are invented, and B's hours-live maturity rule depends on them.
2. **Per-creator confirmation.** The product tools require the user's explicit confirmation naming each creator before every approve and every set-live-date, and forbid "approve these five" / "confirm all". A and v4 dramatise this as one go-ahead. It overstates convenience and may read as unsafe.
3. **Ticks and crosses** are Claude's reasoning over the draft plus brief (cleo_creator_draft), not a product view. Now labelled, but the widget card look around them is still designed.
4. **Sc 15 (A)** needs about 3s for three dates plus button in 3.2s, and sc 14's "8 of 8" is locked only 1.07s. Both are tight but keep motion. Sc 3 (B) holds the locked 7-digit number about 0.5 to 0.7s; ramp and lock cues (0.9s vs 1.07s vs lock at 10.179) disagree and need one retime at build.
5. **B sc 12** line "Commenters skew HR Manager / Talent Acquisition: 47% (Likers 38%)" gets 1.1s; it repeats the panel and could be dropped.
6. **B scene 9** repeats sc 7's Rs 525 and 2,80,000; consider merging if the film feels long.
7. **Forecast band and "67-69%"** in B sc 1, 5, 9 are composed graphics; the product's performance tool returns reach, engagement, budget, per-creator rows and comment analysis, not a forecast band. Mid-campaign effective CPM (Rs 792) is omitted on screen; if the product shows it, the omission flatters the story.
8. Named-creator content: negative comment excerpts, per-creator ranking, and Ashish's post performance in B sc 10 (44,800 impressions, 728 likes, 63 comments, 1.77% are scripted; replace with the real cleo_creator_performance output on recording).

## Merged client decisions (deduplicated), with recommendation

1. **Off-brief drafts attributed to real, named creators (A sc 1, 12, 13; v4 sc 19-20).** The drafts are scripted, so real people would appear to have written them. Recommend: written consent from Darika, Ashish and Priyanshu plus a "dramatised example" note, or (safer) anonymise the hook and rejected drafts (no name, photo or handle). Hook fallback in A: eight cards with 5 green and 3 amber badges.
2. **Day-three numbers in B (1,85,700; 2,955; 238; 1.72%; the 8-row table).** Recommend: use a real Day-three export if one exists. If not, either label the snapshot "illustrative" on screen or cut to finals only and reclaim 13.9s. Do not present scripted interim figures as real data on a named client's campaign.
3. **Live times.** Recommend: show dates only (Wed 7 Oct, and so on), matching the product. This changes B's maturity rule to date-based, or gives another reason to use a real export.
4. **Per-creator confirmations.** Recommend: show at least a short "Confirm Riya? Yes." beat per action, or add a caption "Each approval is confirmed one by one", so the film does not misstate the product.
5. **CTA and URL.** A: option 1 "Brief your creators in Claude -> anchors.in" (agree). B: option A "Ask Claude: How is it performing? -> anchors.in" (agree). Confirm anchors.in.
6. **Publish order and series policy.** Recommend standalone, no "Part of" line, with matching title small lines and end cards, released a few days apart, B after A.
7. **Real screens versus designed.** Payment page (A has 4 elements, v4 has 5), draft preview, metrics tiles and audience toggle come from tool names, not screenshots. Recommend recording the live product for payment, draft preview and metrics; if not, keep the designed versions and the "Claude's check" labels.
8. **Creator and commenter consent.** Per-creator numbers (Darika highlighted for reach, Jyoti for engagement), Riya's "Ex-Deloitte" headline, personal statements, and the two comment excerpts (Neha K., Sandeep R.). Recommend: get approval, and confirm whether the negative comment may appear publicly.
9. **Zeko AI sign-off** on claims in posts and briefs ("verifies what comes out", "capability you can verify") and on the pricing/GST lines.
10. **A context beat.** Keep "Roster is 8" opener (truthful to briefs sent after payment) versus opening on the "Campaign activated" chip. Recommend the current version.
11. **Rejected-draft share in A** (17.9%, 20.5% with the hook). Recommend keeping it unless decision 1 forces anonymising; then shorten sc 13 to 3.2s (Darika only).
12. **B sc 10. RESOLVED (round 6, supersedes rounds 4 and 5).** Client decision: deep insights are removed entirely. Scene 10 now shows how ONE creator's post performed (Ashish: 44,800 impressions, 728 likes, 63 comments, 1.77%), in the chat format of cleo_creator_performance, 8 beats; scenes 11 and 12 are restored to their round-4 cut (112 beats / 60.000s unchanged). Remaining product check: run cleo_creator_performance for Ashish and reconcile the tool line, "Last synced" format and other labels; the film keeps the scripted numbers.
