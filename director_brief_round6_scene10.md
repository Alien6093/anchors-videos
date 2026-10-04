# Director brief, round 6: scene 10 = "How Ashish's post performed" (source of truth for script, editor, sound)

Client decision: deep insights are removed entirely. Scene 10 shows what is actually possible after a campaign is live: how ONE creator's post performed, in the format the real MCP (cleo_creator_performance) gives it in the Claude chat. Director decides the 60s balance. Film stays 112 beats / 1800 frames / 60.000s.

## Boundaries (frame = round(sec x 30), out exclusive)
| Sc | Beats | Seconds | Frames | Len |
|---|---|---|---|---|
| 10 | 72-80 | 38.571-42.857 | 1157-1286 | 129 |
| 11 | 80-92 | 42.857-49.286 | 1286-1479 | 193 |
| 12 | 92-104 | 49.286-55.714 | 1479-1671 | 192 |
| 13 | 104-112 | 55.714-60.000 | 1671-1800 | 129 (unchanged) |
Scenes 1-9 and 13 unchanged. Scene 11 content unchanged, retimed back to its pre-round-5 (round-4) timing. Scene 12 fully restored to its pre-round-5 cut (12 beats). Pacing: slow 9+11+12 = 32 beats 17.143s; medium 3,4,8,10 = 34 beats 18.214s; crest 16; fast 18; breath 4; hold 8 = 112 beats.

## New scene 10 (38.571-42.857, beats 72-80), one READ per beat, rest dimmed to 35%
Real chat format: user bubble, grey tool line, Claude serif sentence, markdown-style Metric | Value table (claude.ai chat table style, thin rules, dark; NOT a cream CleoWidget). No cursor, no click, no panel, no RankTable.
- b72 38.571 f+0: user bubble rises (0.3s): "How did Ashish's post do?" alone on screen.
- b73 39.107 f+16: grey tool line "CLEO - How one creator performed" (spinner, done at b74). Caption in.
- b74-76 39.643-40.714 f+32: Claude serif: "Ashish's post drew 44,800 impressions, 728 likes and 63 comments, a 1.77% engagement rate." READ 1 = "a 1.77% engagement rate", bold cream, highlighted at b75 (40.179); rest of sentence 35%. The rate appears only in prose (as the real tool works), no engagement row in the table.
- b76-78 40.714-41.786 f+64: sentence drops to 35%. Table enters under header "Ashish Shukla — post performance" (name underlined as a profile link) with a small green "Published" pill (pulses once). Count-up from b76.5 (40.982) locking at b78. Rows: Impressions 44,800 · Likes 728 · Comments 63. READ 2 = the Value column. Dim row "Last synced | Fri 23 Oct 2026" at 35% throughout.
- b78-80 41.786-42.857 f+97: table values dim to 35%. Line "Published on Wed 7 Oct 2026, 10:00 AM" with cream outlined chip "View post" (pops at b78 with small scale overshoot). READ 3 = date + chip. At b79 (42.321) a dim texture row fades in: "Content changed after approval: No" (35%, no READ). Hold to cut at b80.
Check: (728+63)/44,800 = 1.766% -> 1.77%. Omit Member reach, Reposts, Link clicks, Followers, approved/published text blocks, N/A rows, audience-response split, comment lists, any follower audience/topics/top post/past brands. Nothing is a placeholder.
Polish: count-up 0.8s ease-out, rows fade up 0.1s stagger, pill pulse, chip pop.
Camera: vertical tilt-down (sentence upper third, ease down ~6% over b74-78 to centre the table) with 100-103% drift. In: hard cut on bar line (scene 9 columns slide out left last 6 frames). Out: hard cut at 42.857 into scene 11.
Caption (one): "Zoom in on one creator's post." on b73 39.107 (f1173) to b79 42.321 (f1270).
Music: E6, bass+hats at 38.571, soft pluck joins 40.714 (duck 3 dB under the sentence), kick drops at b79 42.321 into scene 11 E5.
SFX (T2 only; no coin/payment/paywall): 38.839 f1165 bubble pop; 39.375 f1181 tool blip; 40.714 f1221 soft table whoosh; 40.982-41.786 (f1229-1254) ONE soft count-up locking with a tile tick at 41.786; 41.786 f1254 View post chip click; 42.321 f1270 check tick. No typing sound.

## Scene 11 (retime back): start/bubble/tool 42.857 f1286; caption 43.4 f1302; sentiment fill 44.0-45.0 f1320-1350; bar-fill sfx 44.1 f1323; card 1 44.5 f1335; card 2 + card whoosh 46.9 f1407; concerns strip 48.4 f1452; end 49.286 f1479. Music E5 (drums thin, pad+pluck, melody rests).

## Scene 12 (49.286-55.714, 12 beats) RESTORE
All four campaign-audience panels (Roles, Locations, Industries, Seniority) and the three-state toggle Reached · Likers · Commenters. Data: script section 6 ("Audience: reached", "Who engaged"). Likers: Roles 38/18/16/10/18, Locations 25/19/15/11/30, Industries 28/16/14/12/30, Seniority 35/28/16/12/9. Commenters: Roles 47/19/12/13/9 (others per section 6). Skew line "Commenters skew HR Manager / Talent Acquisition: 47% (Likers 38%)". Caption "Right people. Right roles." 50.0 to ~53.571. Cues: user bubble+tool 49.286 f1479; caption 50.0 f1500; panel tick + panels in 50.5 f1515; drums drop 51.429 f1543 (old table says 51.4 f1542, use bar line); Likers toggle 51.964 f1559; swish 52.2 f1566; Commenters toggle 53.571 f1607; swish 53.8 f1614; skew line 54.6 f1638; end 55.714 f1671. Camera: gentle lateral pan. Music: E5, drums drop 51.429, pad wide, melody resolves on tonic at the Commenters toggle 53.571. Remove the twoState / TWO_STATE_LABELS single-panel cut from use in scene 12 (keep the optional props backward-compatible in Audience.tsx if harmless).

## Camera check: 9 pull-back, 10 tilt-down, 11 slow push-in, 12 lateral pan, 13 logo drift.

## Script clean-up list (for the writer)
Delete round-5 scene 10 text, the "Ashish insights" and "Ashish follower audience" blocks in section 4, those rows in section 5; remove obsolete section 7 items 7, 11, 12, 13 and section 8 decision 8 (consent on past brands/top post is moot); asset list: drop FollowerAudience, PastWork, InsightsPanel; add creator-performance table and View post chip; scene 10 no longer uses RankTable or FakeCursor. Restore section 5 "Scenes 10-12 split" as 8+12+12 = 32 beats = 17.143s; update HOW TO REVIEW item 9, camera check, build-spec timing/cue tables, add a "Client decisions applied (round 6)" changelog (mark round 5 scene 10 SUPERSEDED). Product check to record: run cleo_creator_performance for Ashish and reconcile labels (tool line, "Last synced" format); film keeps scripted numbers.
