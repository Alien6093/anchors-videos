# Script director review: script_v3.md (150s, no VO)

Reviewer stance: blunt. All numbers recomputed independently. Line refs are to script_v3.md.

## Verdicts up front
- Arithmetic is clean: quote, per-creator sums, engagement, sentiment, audience tables all reconcile. Two soft spots (forecast-range vs max-spend logic; "Avg engagement" label).
- The calendar is consistent (6 Oct Tue, 7 Wed, 8 Thu, 3 Oct Sat, 5 Oct Mon, 20 Oct Tue) with one wording issue ("Two weeks later").
- Real problems are in fidelity to the product (attachments rule, briefs "sent" before payment, budget re-scope done by magic, audiences/motives/comparables/directions invented, Priyanshu location), in invented facts about real people (Deloitte, top posts), and in copy (Gunjan's approved draft contains "Every time", banned by your own brief; templated product sentence in every post; Ashish revised is under 60 words and ungrammatical).
- Banned-word grep (AI-generated, demo, sample, mock, fake, placeholder): zero hits. "Anchors" capitalised: zero hits. Good.

---

## MUST FIX

**1. Attachments break the real rule (sc.16, line 85; sec.5 line 254).**
Script: "Zeko AI logo (PNG) and one-page overview (PDF)" on a text + image post. Real: PDF is only allowed for carousel; image post takes png/jpg. Max 2 is correct.
Replace: "Up to 2 attachments per brief (PNG or JPG for an image post): Zeko AI logo (PNG) and product screenshot (JPG), attached to all 8."

**2. "Briefs sent to 8 creators" before payment (sc.17 line 86; sec.5 line 257; stamps "Brief sent").**
Your own line in sc.14 says "Checkout has no blockers left except the post format", i.e. briefs are a checkout prerequisite and payment activates the campaign. Sending before paying contradicts sc.18 "Nothing is charged until you pay" and the dashboard row "Creators briefed 8" (which is then redundant).
Replace sc.17 caption: "Briefs ready for all 8." Claude: "Done. Briefs saved for all 8. Next: the quote." Stamps: "Brief ready". Let the dashboard (sc.19) carry "Briefs delivered to 8 creators".

**3. The brief contradicts itself on post format (sc.14 line 83; sec.5 line 229 vs 242).**
Ask says "Publish one LinkedIn post (text + image)" while "Before paying: Post format: not set yet" and the format is only chosen in sc.16.
Replace Ask: "Publish one LinkedIn post on why structured interviews still end in gut decisions. Name Zeko AI in the first two lines." (Format appears only after sc.16.)

**4. Budget "re-scope" happens by magic (sc.12 line 81; open Q1).**
Brand said Rs 3 lakh; cutting creators does not lower a brand's stated budget in the real product (unverified either way). Make it a brand decision so it is true regardless.
Replace sc.11 user line: "Cut the 8 weakest fits. Cap the budget at Rs 1,50,000." Claude in sc.12: "Done. Roster is 8, budget capped at Rs 1,50,000." Also drop the redundant row "Est. CPM Rs 540 -> Rs 540".

**5. Forecast range vs max spend is internally inconsistent (sc.12; sec.6 line 329).**
Real pattern: max spend / CPM = TOP of the range (3,01,388 / 540 = 5.58 lakh). After the cut you show 1,49,712 / 540 = 2.77 lakh but a top of 2.83. Halving 5.42-5.58 also gives 2.71-2.79, not 2.83.
Fix: after-cut projection "2.69-2.77 lakh" (2.77 = 1,49,712 / 540; lower keeps real 0.971 ratio). Then 2,80,000 actual slightly BEATS forecast and Rs 525 beats Rs 540: a cleaner story than "inside the range". Update sec.6 line 329-330 and any "inside" claim.

**6. Priyanshu Manas location wrong (sc.7 line 76).** Real: New Delhi, not Bengaluru. Also Riya: real "Mumbai Metropolitan Region" (card can truncate to "Mumbai Metro Region"). Page 2 locations to add: Jyoti Vadodara, Sunidhi Vadodara, Shubhangi India, Darika Gurugram.

**7. Gunjan's APPROVED draft violates the brief (sec.4 line 122).** "Every time, the reason was a feeling." "every time" is on your own banned list, and sc.22 flashes this post. Also "one of the few HR tech ideas" is a near-absolute.
Replace L2: "Zeko AI is one HR tech idea that goes after that last step."
Replace L3 sentence 2: "More than once, the reason was a feeling."
Also Riya line 3 "in every People & Culture role I've held" (sec.4 line 114): sc.21 ticks "No absolute claims" on it. Replace: "I saw it across the People & Culture teams I've worked with."

**8. Invented facts about real people that can be checked or embarrass.**
- Riya "ex-Deloitte" / "People & Culture angle from Deloitte" (sc.15, sc.21, sec.4 line 113, sec.5 line 248): a specific employer claim. Unless the client confirms, delete. Card headline: "People & Culture Leader". Post L1: "Zeko AI made me revisit a question I asked for years on interview panels: is our interview really structured?" Sc.15 Riya card: "People & Culture angle: 'Ask what your panel does in the last five minutes.'"
- Ashish deep-dive (sc.10 line 79): Topics % and "Top posts" with like counts are invented; "Why structured interviews still fail" pre-echoes the campaign angle and could be read as something he posted. Best: pull real numbers from cleo_creator_insights (it costs the 1 credit you are dramatising, so it is on-story). If not: keep the metric tiles and topic bars but show topic labels only from his real tagline, and replace Top posts with "Recent themes" without titles or like counts.
- Ashish's tagline "Talent and hiring voice. Practical takes on interviews, resumes and HR tech." (sc.8): confirm it is his real tagline or use the real one.
- Personal confessions (Priyanshu "I hired on a handshake. It cost me months", Shubhangi "I track time-to-hire...", Jyoti "I review resumes for a living"): fine only with the creators' sign-off on final wording. Get a yes on these specific lines.
- Ashish numbers do not reconcile (sc.7 vs sc.10): 1.97% x 46,795 = ~922 interactions per post; 789 likes + 52 comments + 11 reposts = 852 (1.82%). Fix: "Avg comments 118, Avg reposts 15" (789+118+15 = 922 = 1.97%).

**9. Real-product fidelity, plan screens (sc.3-6, lines 72-75; sec.5 line 200).** Replace invented options with the real ones:
- Audience chips: [HR professionals] [Talent acquisition teams] [Business leaders] [Enterprise executives] [Job candidates] (HR professionals marked primary). Selected: HR professionals.
- Motive chips: [Awareness (default)] [Engagement] [Traffic] [Conversions] [Product Launch] [Sales] [Audience Growth]. "Leads" and "Sign-ups" do not exist. Show 4 and "+3" if space is tight.
- Product: "Zeko AI Platform" (Setup row and chip), not "Zeko AI". Keep post copy as "Zeko AI".
- Storyline: show the 3 real stories, first selected: "Structured interviews still hide gut decisions" / "What workforce intelligence actually means" / "From interview scorecards to conversation intelligence".
- Directions: the 2 real cards "Myth-busting - hidden truth" (selected) and "Category education". Your 3 invented direction cards ("Gut vs evidence", etc.) are not real; delete or move into brief angles.
- Comparable brands: use the real Micro1, LinkedIn, Fireflies. Darwinbox, Keka, greytHR are HRMS/payroll, not comparables for an interviewing/intelligence product, and a knowing viewer would flag it. Real is also safer with a "Competitor names: avoid" brief line.
- Bonus: Shubhangi's post ("What workforce intelligence means") and Darika/Sunidhi can lean on stories 2 and 3, which fixes the "all posts are the same thesis" problem (see 13).

**10. Real dropped creators are labelled unflatteringly (sc.11 line 80; sec.5 line 216).** Descriptors like "restaurants", "finance", "mobility", "Product Hunt promotions" are (a) not verifiable, (b) disparaging real people who are not in the consent scope (consent covers drafts and metrics), (c) contradictory: Harshdeep is a "resume coach" and you keep Jyoti (resume/ATS). Also the on-screen 45 words in 4s are unreadable.
Replace Claude: "I need names to remove anyone. These 8 have the lowest fit for HR hiring: Siddharth Jogani, Piyush Bathwal, Mayank Jain, Harshdeep Saxena, Raghav Jhawar, Arijit Ghosh, Ajay Kumar, Vivekananda Sinha. Remove them?" Drop "Ranks #9 to #16" and the labels. Caption "Now, cut the weak fits." should be "Keep the sharpest fits." (do not call real people weak). Verify surnames against the real plan (task brief gave first names only; "CA" prefix on Piyush is unverified).

**11. Darika's change request contradicts her first draft (sc.25 line 94; sec.4 line 168).** Her first draft already names Zeko AI in line 1-2, yet the request says "name Zeko AI in the first two lines"; and it asks to "open with a real hiring moment" but the revised opens with a pattern statement. Replace request: "Rewrite in your own strategist voice: drop 'world's number one' and 'revolutionary', keep it about one hiring pattern you see, end with a question, not a sales push."

**12. Ashish revised draft: under 60 words and ungrammatical (sec.4 lines 157-161, sc.26).** "Zeko AI shows why they didn't fully" (Zeko AI does not show why interviews fail). ~55 words body.
Replace:
> Structured interviews were supposed to fix hiring. They didn't fully. The final call still leans on gut feel.
> Zeko AI is aimed at exactly that step: it turns adaptive talent conversations into verified capability data, so decision makers get evidence instead of impressions.
> That is where a lot of hiring goes wrong.
> Worth a closer look if you lead a talent team.
> #ZekoAI #AIinHR #Hiring

(65 words with tags.) Sc.26 UI text: "Zeko AI is aimed at exactly that step: it turns adaptive talent conversations..." Note "Keep the rest" in the request is honoured by the unchanged L1/L4 and hashtags.

---

## SHOULD FIX

**13. Every post carries the same product sentence; voices are not distinct (sec.4).** "adaptive talent conversations into verified capability intelligence/data" appears in Riya, Gunjan, Shubhangi, Sunidhi, Jyoti, Ashish, Darika, Priyanshu (8 of 8). Sc.22 fast-cuts will make that visible. Keep it verbatim in at most 2 posts (brief key point) and paraphrase elsewhere. Suggested swaps:
- Gunjan L4: "Its conversations adapt to each candidate, then check what came out, so the decision rests on something you can point to, not a mood."
- Sunidhi L3 tail: "Zeko AI builds the debrief around capability you can verify, so it starts with facts everyone can see."
- Jyoti L3: "Conversations that adapt to the person and end in verified capability, so decisions don't hinge on a formatted PDF or a hunch."
- Shubhangi: keep, but anchor on story 2: "Workforce intelligence, to me, means each decision has a trail..." (also removes "every").
Voices today: Riya (reflective P&C), Gunjan (punchy), Shubhangi (ops/metrics) and Jyoti (resume/ATS) are distinct; Sunidhi and Darika drift into the same "scorecard filled, decision on instinct" register as Riya/Ashish. Give Sunidhi a story-3 angle (scorecards to conversation intelligence) and Darika story-2 (what workforce intelligence means).

**14. "First two lines" test is fragile.** Priyanshu revised and Jyoti name Zeko AI in paragraph 2, ~190-200 characters in, right at LinkedIn's "see more" cut. Safer: name it in the first paragraph. Priyanshu revised L1: "As a founder, I've made hiring calls on a good handshake and a confident pitch. Zeko AI is the evidence I wish I'd had." then continue. Jyoti L1: "I review resumes for a living, and Zeko AI caught my eye for one reason: a resume tells you what someone claims, an ATS what keywords matched."

**15. Flawed drafts look like parody, and they attach cringe to real named people (sc.24-25).** Darika's "We are thrilled to announce a revolutionary, game-changing solution!" and "Don't miss out on this incredible opportunity!" are not something a real strategist would write; a viewer smells staging and the real person is shown at her worst. Keep the violation clear but plausible, and get explicit OK from Darika and Priyanshu for these first drafts. Suggested Darika first draft (still clearly press-release + superlative; ~60 words):
> We are excited to announce Zeko AI, a revolutionary new platform and the world's number one choice for enterprise workforce intelligence. Book a walkthrough today and transform your hiring overnight. Contact Zeko AI now to see the difference.
> #ZekoAI #HR #Innovation
Priyanshu's is acceptable but drop "Bias in hiring? Gone." (a claim that could get a real founder in trouble); keep "removes gut decisions completely", "guarantees the perfect hire every time", "the only tool". Add one filler sentence to stay >=60 words.

**16. "Edit one brief" is missing (sc.15, lines 84, 247).** Variations appear as a fait accompli. Show the real capability: User: "Give Priyanshu a founder angle." Tool: "CLEO - Edit a creator's brief". Then the three cards. Also make clear briefs were written for all 8 with the brand's OK (user line "Write briefs for all 8" is the OK; fine).

**17. Tracking link placement options not shown (sc.16).** Real: body / comments / no preference. Add three chips, "Comments" lights. Cheap, and it is exactly the "more detail on the brief" the client asked for.

**18. Credit strip is muddled (sc.10 line 79; sec.5 line 213).** "Compare Priyanshu, Jyoti, Gunjan: 3 credits (Ashish already viewed, free)" - Ashish is not in the list. Replace: "Compare Ashish, Priyanshu, Jyoti, Gunjan: 3 credits (Ashish already viewed, free)." Also say whether credits are spent: "Viewed: 4 creators, 4 credits total".

**19. Label accuracy on the metrics tiles (sc.29 line 98; sec.7).** "Avg engagement 1.74%" is a weighted rate; the mean of the 8 per-creator rates is 1.88% (1.59+1.61+1.58+1.62+1.68+2.51+2.68+1.77 = 15.04 / 8). Someone will recompute. Change to "Engagement rate 1.74%". Also "Reach 2,80,000" vs table column "Impressions": pick one; use "Impressions 2,80,000" and caption "2,80,000 impressions." (reach is technically unique people).
Add a tile "Effective CPM Rs 525 (plan Rs 540)" so the 147000/280 story lands on screen; 98% budget bar already reconciles.

**20. Calendar readability and "Two weeks later".** Weekdays all correct. Issues: (a) first post 6 Oct to 20 Oct is 14 days, but last post is 8 Oct (12 days). Use "Two weeks after launch" or set data date to 22 Oct (Thu) and keep "Two weeks later" (14 days after the last post). (b) sc.28 says "All 8 posts are up" and flips all to Live in a 4s wave, yet posts run Tue 1 PM to Thu 6 PM. Add small date chips ("Tue 6", "Wed 7", "Thu 8") on the wave and caption "Live on LinkedIn. Three days, eight posts." (c) Add corner date stamps: sc.20 "Sat 3 Oct", sc.26 "Mon 5 Oct" so "earliest tomorrow = Tue 6 Oct" is derivable. Payment 28 Sep -> drafts by Sat 3 -> changes/revisions Sat-Sun -> approve and set dates Mon 5 is plausible.

**21. Density vs runtime.** Unreadable in the time given: sc.7 (8s, five interactions: filter, sort, view toggle, pager, plus cards): cut the list-view toggle or the pager. Sc.14 (7s for ~90 words of brief): highlight Ask and 3 key points, collapse Avoid/Hashtags/Tip into pills; sc.11 names (see 10); sc.27 (8-row date table in 5s): show 3 rows fully and scroll; sc.29 (tiles + 8-row table in 9s): tiles 4s, table only Darika and Jyoti highlights.

**22. Confirmations per creator (sc.23, 26, 27).** Real: approve confirmed per creator by name; live date confirmed per creator+date. Scripts do this in one sweeping message ("Confirm all five?" "Confirm all."). Acceptable dramatisation because every name (and date) is listed, but keep each name and date visible in the confirm message and keep the 5 / 8 stacked tool lines so it reads as per-creator. No change to text needed.

**23. Sc.28 "Riya's real LinkedIn post".** Drop the word "real" from the direction line; also confirm she is chosen because Ashish (first live, Tue 10 AM) is the more natural first card. Use Ashish's live post as the lead (he is first in the schedule) and fan Riya's behind.

**24. Title/caption mismatch.** Title "One Chat. Whole Campaign." vs sc.1 caption "One chat. The whole campaign." Pick one; use the title text in both.

---

## NICE

25. Sc.4 caption "You choose three things." repeats the UI; replace with "Three choices. Yours." or cut to silence.
26. "Zeko AI needs HR to notice." reads slightly negative for the client; consider "Zeko AI wants HR talking." (tone: dry, confident, not needy).
27. Sc.29 per-creator table order is arbitrary. Order by roster rank or by impressions descending (Darika, Shubhangi, Ashish, Gunjan, Sunidhi, Riya, Priyanshu, Jyoti) so the two highlights (biggest reach top row, best engagement) are findable.
28. Audience locations: creators sit in Delhi NCR (Gunjan, Priyanshu, Darika = 42% of impressions), Gujarat (Ashish, Jyoti, Sunidhi = 30%), Mumbai. Consider reached Locations: Delhi NCR 26, Ahmedabad/Gujarat 12, Bengaluru 16, Mumbai 15, Hyderabad 9, Other 22 (=100). Seniority order "Senior 34 / Manager 29 / Entry 15 / Director+ 13 / CXO 9" is fine but label order looks odd; sort by size.
29. Comment cards: use first name + initial without title where possible (six invented named commenters with employer types). Keep the negative ones; they are the credibility.
30. Dashboard extras (Payment reference, View invoice, Back to Claude, stepper with Live) are invented: harmless dramatisation if the live dashboard differs in small ways; if you can screen-record the real dashboard success page, use it (client asked for "shown on the dashboard as completed").
31. Section 0 change 5 and open Q3 should now say ranks are re-ordered vs the plan. Real order: Ashish 1, Siddharth 2, Riya 3, Gunjan 4, Mayank 5, Piyush 6, Harshdeep 7, Raghav 8, Arijit 9, Priyanshu 10, Jyoti 11, Sunidhi 12, Shubhangi 13, Ajay 14, Vivekananda 15, Darika 16.

---

## A) Arithmetic and continuity: recomputed (all pass unless flagged)

| Check | Result |
|---|---|
| Fees 24,000+21,500+16,500+13,400+12,200+9,800+7,951+7,900 | 1,13,251 pass |
| Platform 10% | 11,325.10 -> 11,325 pass |
| Subtotal | 1,24,576 pass |
| GST 18% of 1,24,576 | 22,423.68 -> 22,424 pass |
| Total | 1,24,576 + 22,424 = 1,47,000 pass (7,951 is the balancing figure; fine) |
| Budget headroom | 1,50,000 - 1,47,000 = 3,000; used 98.0% pass |
| Max spend / CPM | 3,01,388/540 = 5.58 lakh pass; 1,49,712/540 = 2.77 lakh, but range top shown 2.83: FAIL (item 5) |
| CPM actual | 1,47,000/2,80,000 = Rs 525 vs Rs 540 pass (coherent: better than plan) |
| Impressions sum | 2,80,000 pass |
| Likes sum | 4,500 pass |
| Comments sum | 361 pass |
| Per-creator engagement | 1.59, 1.61, 1.58, 1.62, 1.68, 2.51, 2.68, 1.77 all pass |
| Total engagement | 4,861/2,80,000 = 1.736% -> 1.74% pass (but label: item 19) |
| Sentiment | 256+91+14 = 361; 70.9/25.2/3.9 -> 71/25/4 = 100 pass |
| Concerns | 6+4+4 = 14 pass |
| Audience tables (reached: roles, locations, industries, seniority; likers/commenters x4) | all 12 columns sum to 100 pass |
| Pacing map | 7+7+9+22+10+22+8+5+10+11+5+5+4+9+6+6+4 = 150 pass; 70 bars x 2.143 = 150.0 pass |
| Weekdays 2026 | 3 Oct Sat, 5 Oct Mon, 6 Tue, 7 Wed, 8 Thu, 20 Oct Tue, 28 Sep Mon: pass |
| Live schedule | 2 Tue + 3 Wed + 3 Thu = 8; each row weekday matches pass |
| Profile vs campaign engagement | Riya 0.47 -> 1.59 and Gunjan 0.32 -> 1.61 (3x-5x) is generous; acceptable, but if the client is sceptical trim Gunjan to ~1.3% by lowering likes |
| Ashish profile numbers | 789 + 52 + 11 = 852 (1.82%) vs 1.97%: FAIL (item 8) |

## C) Copy quality summary
- Captions: all <= 10 words; redundant ones: sc.4 "You choose three things.", sc.8 "Open any creator." (UI says it), sc.7 "Filter. Sort. Compare." (acceptable, rhythm).
- Brief rules check on the 5 approved drafts: Zeko AI in first two paragraphs and #ZekoAI on all; violations found: Gunjan "Every time"; Riya "every ... role"; Shubhangi "every decision has a trail" (definition, soften). Word counts (body+tags): Riya 88, Gunjan 93, Shubhangi 81, Sunidhi 77, Jyoti 68, Ashish first 63, Ashish revised 58 (too short), Darika first 65, Darika revised 85, Priyanshu first 62, Priyanshu revised 81.
- The 3 flawed drafts do clearly violate: Ashish (no Zeko AI, no #ZekoAI), Darika (press-release, superlatives), Priyanshu (absolute guarantees). Ashish's is the most realistic; it is the model for making the others less parody (item 15).
- Revised Darika and Priyanshu meet the rules; Darika's request is inconsistent with her draft (item 11).

## D) Completeness
All requested stages are present. Gaps: edit-one-brief (16), tracking placement options (17), credit accounting (18), calendar readability (20), and sc.11 real-flow accuracy (10). Brief detail level on the brief is good in content but too dense for 7s (21).
