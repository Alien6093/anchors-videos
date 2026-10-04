# QA report: anchors-platform-tour-final.mp4

## VERDICT: FAIL (fixable, no blockers)

The technical specs, audio, provenance and stage coverage all pass. The video fails on **check 6, focus highlights**. In about 12 shots the red-outlined highlight is set at a fixed source position while the recorded page scrolls or changes underneath it. The result is empty white boxes, boxes on the wrong element, and in s69 a box covering the "Thank you for sharing your feedback" text. These are easy to see, so the video is not ready to ship. The second problem is that the 5 one-second hook phrases are fully readable for only about 0.5 s each. Both are fixable in the Remotion project without new footage.

Method: I extracted frames at 4 fps for the whole 120 s and tiled them into 30 contact sheets, all viewed. I took 25 full-resolution frames at suspect moments and compared 18 of them with their mapped source frames. I also ran ffprobe, ebur128 and astats, freezedetect (0.5 s and 0.9 s), blackdetect, scene detection, silencedetect and a transient-onset check on the final audio. Scratch files are in `_work/qa/`.

---

## Checklist

### 1. Specs: PASS
| item | measured | target |
|---|---|---|
| duration | 120.00 s video / 120.04 s audio, 3600 frames | 115–125 s |
| video | H.264 High, 1920x1080, 30 fps, yuv420p | 1920x1080 H.264 |
| size | 47.0 MB (2.94 Mb/s video) | <= 95 MB |
| audio | AAC LC, 48 kHz, stereo, 189 kb/s | 48 kHz stereo |

### 2. Stage coverage: PASS (one payoff is weak)
| stage | time in video |
|---|---|
| Campaign setup (name, goal, platform, budget, confirm) | 5.0–15.1 |
| Influencer criteria (topics, followers, roles, audience) | 15.1–23.3 |
| Match preview (65 matched, impressions, expense) | 23.3–27.5 (also the hook at 0–1) |
| Matched profiles and analytics | 27.5–35.0, past collabs 37.2–39.2 |
| Selecting influencers (outline reach updates) | 35.0–37.2, shortlist 39.2–41.0 |
| Product details (website, AI-detected products) | 41.0–46.4 |
| AI-written briefs (format, Write all, brief, guidelines, apply) | 46.4–59.4 |
| Review and checkout (review, checkout, UPI or card, billing) | 59.4–66.4 |
| Activation | 66.4–70.4 |
| Draft review and approval | 70.4–82.4 |
| Live dates | 82.4–88.4. The "both scheduled" state is barely on screen (issue M4). |
| Live performance (KPIs, per-post stats) | 88.4–95.2 |
| AI analysis: audience | 95.2–99.9 |
| AI analysis: sentiment | 99.9–103.9 |
| AI analysis: queries and purchase intent | 103.9–106.8 |
| AI analysis: best performers and CSV export | 106.8–110.1 |
| AI analysis: per-creator, keywords | 110.1–113.2 |
| AI analysis: ratings | 113.2–115.5 |
| End card | 115.5–120.0 |

### 3. Dead time and pacing: PASS with minor notes
- **freezedetect** (d=0.5 s) found only one freeze, 116.57–119.53, which is the end card. No other still holds. The s33 freeze (53.7–56.7) has a push-in, so it does not read as frozen.
- **Loaders**: no "Loading data" screen or skeleton is visible. The red 4-dot loader appears for about 0.3 s at ~114.5 (end of s68), which is acceptable. The AI progress bar (s31b, 49.8–50.6) is a deliberate 0.8 s glimpse at 8x.
- **Fast passages**: s14 (20.7–23.3, 5.04x with a pan) is the weakest. From 21.7 to 23.0 the zoomed frame is mostly empty grey form area while it pans, and nothing is readable. s19 (31.5–33.5, 4.5x scroll) and s13 (4x) blur but are readable enough. s31 (0.4 s), then s31b, then s32 gives four cuts in 1.2 s (49.4–50.6). It is fast but it reads as one action.
- Error states briefly visible: "Please select start date" at 10.7–10.9, "Minimum budget is ₹20K" at 12.3–12.8, and "No briefs generated. Try again." behind the dim at 58.2–59.4. These are minor polish points.

### 4. Provenance: PASS
I compared 18 moments against the source frame at `srcIn + (t - tIn) * speed`: 0.6, 2.6, 7.6, 12.6, 24.0, 30.4, 35.6, 45.1, 47.5, 59.1, 71.0, 84.2, 87.5, 91.8, 100.8, 104.1, 108.8 and 115.0 s. Every one is the same real UI, zoomed or cropped. Numbers, names, toasts, the Sample-Mode banner and cursor positions all match. I found no redrawn or mocked-up UI. The added elements are all on the allowed list: chapter chip, callout chips, progress bar, highlight outlines, click rings and blur transitions. The end-card logo matches the real 4-dot "anchors" mark. The empty white boxes from check 6 are real blank source areas, not drawn content.

### 5. Audio: PASS
- Integrated loudness **-14.0 LUFS**, LRA 7.2 LU, true peak **-1.3 dBTP** (L) / -1.4 (R). The astats sample peak is -1.40 dBFS, so no clipping.
- Sync: I measured transient onsets in the final mix at 7.4, 23.3 (match-preview impact), 58.6, 65.58, **66.4 (Campaign activated)**, 76.41, **77.4 (Draft approved)**, 82.4, 88.4, 95.2 and 115.5 (end sting). All land within +8 to +41 ms of the cue. That is 1 frame or better, and AAC encoder delay explains part of the offset. Visual events line up: the activation card zooms in at 66.4–66.8 and the "Draft is approved" modal appears at 77.4–77.6. The s31 click cue (49.63) sits in a dense passage and I could not isolate it.
- Ending: the mix fades out and is below -50 dB from 119.57 s, so the end is clean.

### 6. Text and highlights: FAIL
- The callout chips themselves are fine. They are legible at 1080p (about 36 px bold on a dark pill), spelled correctly, held for 1.2–4 s, and they do not collide with the chapter chip or the progress bar. Nothing is cut off at the frame edges.
- **The hook phrases (s01–s05)** reveal one word at a time, so each full phrase is readable for only about 0.5–0.6 s. That is under the ~1 s target. "AI reads every comment" and "Launch. Run. Measure." are the hardest to catch.
- **Highlights are wrong or empty in many shots.** See issues M1–M3 and the table.
- The s16 callout "65 creators matched instantly" sits on top of the modal's "Go Back to Edit / View Matched Influencers" buttons (24.0–27.5). The sparkle effect sits on them too.
- The progress bar is semi-transparent, so UI text shows through it in light scenes (for example "Greater Bengaluru Area" at 115.0).
- "CLEO writes every brief" uses the AI's product name without explaining it. A new brand may not know what CLEO is.
- The s09 click ring (11.25–11.5) lands to the left of the calendar and then on the Business-type label, not on the clicked date.

### 7. Visual quality: PASS (minor notes)
- blackdetect found only 0–0.067 s, which is the intended fade-in. There are no other black frames or flashes.
- Blur/whoosh transitions are clean. I saw no magenta or garbage edges.
- On the right edge, where the zoom goes past the source width (about 12.6 and 115.0), the frame shows a dark vignette strip. It looks intentional rather than broken, but it is noticeable.
- s50 opens on an over-bright, high-key frame at 86.5 that does not match the dimmed look around it.
- End card: clean. Real logo, tagline "Anchors — influencer campaigns, start to finish", and "Create • Match • Brief • Launch • Approve • Measure" (readable, about 20 px). It holds 2.7 s, then fades to dark. The blurred red blob below the text is a real button from the blurred frame. It is harmless but reads a little like a broken CTA.

### 8. Overall
A new brand would understand the flow. The ten chapters with the always-on step bar make create, match, pick, product, brief, pay, approve, schedule and measure easy to follow, and every claim is backed by real UI. What weakens it is the highlights. A viewer's eye goes to the red box, and in about 12 shots that box frames blank space or the wrong control. In s58 (the sentiment donut) and s69 (the final thank-you card) this happens on the payoff moments.

Improvements, in priority order:
1. Fix the highlight tracking (M1–M3).
2. Lengthen the hook phrases (M5).
3. Show the "both dates set" payoff in s50 (M4).
4. Rework the empty-looking part of s14.
5. Move the s16 callout off the modal buttons.
6. Make the progress bar opaque.
7. Minor: trim the visible error states, and explain "CLEO" or replace it with "AI".

---

## Issues

| # | severity | time | issue | suggested fix (shot ids from timeline.json) |
|---|---|---|---|---|
| M1 | **major** | many (see list) | **The highlight stays at a fixed source position while the page scrolls or changes.** The red-outlined box ends up framing empty white space, or a different element from the one the callout means. | Add keyframed `callTarget` (`[{at, x,y,w,h}]`, the same as `focus`) and re-measure each one against the source frames. Where the target is not visible, fade the highlight out. Use the per-shot fixes below. |
| M1a | major | 12.4–13.1 | s09: the box (1590,90,324,110) shows an empty white rectangle. The budget card disappears in the source at about 36.5 s. | End the s09 highlight at about t+1.4 s, or set srcOut to 36.4. |
| M1b | major | 30.2–30.6 | s18: the "ACTUAL, SYNCED DATA" badge box (1580,70) is empty while the modal scrolls. | Keyframe it to follow the badge, or show it only for the first 0.6 s and after 30.7. |
| M1c | major | 44.9–45.6 | s27: the box (1020,725,230,40) is empty, then sits to the left of the "Add Deliverables" button. | Retarget to the button's real position (about x=1120–1250, y≈740 at src 289.5–291). Start it at t+0.6. |
| M1d | major | 46.6–49.4 | s29: "Format picked from real data" highlights the link Yes/No question, then the **Text** row. The Recommended badge is on the **Text+Image** row. | Keyframe the target to the Text+Image row with its Recommended badge. Start srcIn after the Yes/No step, or crop it out. |
| M1e | minor | 59.0–59.4 | s35: the toast box (1255,738) is empty. The real toast "AI brief applied to 2 creators" is lower right and half cut off. | Retarget to the toast, or widen the focus so the toast is in frame. |
| M1f | minor | 70.4–72.4 | s42: "Track every creator's status" highlights the search/filter row. The status cards (Selected/Accepted/Draft Submitted) are cropped out above. | Set focus y to about 100 and target the status-card row. |
| M1g | major | 82.6–84.8 | s49: the box (1300,270,360,420) first frames a dark empty area, then the **Past Collaborations** column. The "Set Custom" date buttons and the Live Date column are cut off at the right edge. | Pan the focus right so the Live Date column is in frame, and target the Live Date column or buttons. |
| M1h | major | 90.9–92.4 | s52: when the focus pans right, the KPI box (365,418,780,198) becomes a large empty white box above the table. | Keyframe the target with the scroll (the KPI card moves up), or end the highlight at t+1.4. |
| M1i | **major** | 100.3–102.2 | s58, the sentiment payoff: the donut moves up and out of the box. The highlight's lower half is blank white and the donut's top is cut off. | Keyframe the target with the donut, about 160–200 source px higher by src 70.5, or pick a srcIn with no scroll. |
| M1j | minor | 103.9–104.4 | s60: the box frames a blank band above "Overall Customer Query Analysis" before the KPI cards scroll in. | Start the highlight at t+0.5. |
| M1k | minor | 108.6–109.2 | s64: the toast box (1415,730) is an empty white box until the Success toast arrives. | Start the highlight at t+0.6. |
| M1l | **major** | 114.6–115.5 | s69, the last frame before the end card: the box (1720,80,180,280) covers half of the "Thank you for sharing your feedback!" card with a blank panel. The real "Feedback submitted successfully" toast at the bottom right is cropped out. | Target the whole thank-you card (about 1180–1630, 300–900), or widen the focus to include the toast and target that. |
| M2 | major | 0.0–5.0 | Hook phrases s01–s05 reveal word by word and are fully readable for only about 0.5 s each. | Show each phrase whole within 0.15 s, or cut the hook to 4 phrases of 1.25 s each. Keep "Launch. Run. Measure." whole for at least 0.8 s. |
| M3 | minor | 24.0–27.5 | s16: the callout chip and sparkles sit on the modal's "Go Back to Edit / View Matched Influencers" buttons. | Move the callout above the modal or to the side (top placement, as in s14). |
| M4 | major | 86.6–88.4 | s50 "Both creators scheduled": the source still shows Kartik's calendar open until about src 76.4. Both dates (Oct 4th, Oct 5th) appear only in the last frames before the whoosh, so the claim is not shown. | Change s50 to src 75.6–77.4 at about 1x, or freeze on src 76.5 for about 1 s, and point the highlight at the filled Live Date column (it is at the right edge, so pan the focus right). |
| m1 | minor | 20.7–23.3 | s14 at 5x plus a pan: about 1.3 s of mostly empty grey form, with nothing readable. | Cut s14 to src 82.5–90 (Student/Intern chips) and drop the pan to the bottom button. |
| m2 | minor | all light scenes | The progress bar is translucent, so UI text shows through it (for example at 115.0). | Raise the bar background opacity to about 0.9. |
| m3 | minor | 10.7, 12.3–12.8, 58.2–59.4 | Error states are visible: "Please select start date", "Minimum budget is ₹20K", "No briefs generated. Try again." | Trim the source ranges (s08 out at about 29.8; s09 skip src 35.5–37.5) or crop them out. |
| m4 | minor | 11.25–11.5 | The s09 click ring is not on the clicked date and then appears on the Business-type label. | Re-measure the click position (about 600,410 at src 31.5) or remove the ring. |
| m5 | minor | 49.8–53.7 | "CLEO writes every brief": CLEO is not explained to a new brand. | Use "AI writes every brief" (as in the hook) or "CLEO, our AI, writes every brief". |
| m6 | minor | 86.5 | s50's first frame is over-bright compared with its neighbours. | Check the s50 dim mask fade-in, and start the dim at frame 0. |
| m7 | minor | 116–119.5 | The end card is static, though the script asks for a slow push. A blurred red button blob under the text reads like a broken CTA. | Add a 1.02x push, and blur or crop the background lower so the red button is not under the tagline. |
