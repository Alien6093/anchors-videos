You are the DIRECTOR of a small production crew. Goal: produce one ~2:00 (120s ±5s) platform-tour video from the three raw screen recordings in `demo_anchors_platform/` of this repo (GitHub: Alien6093/anchors-videos, branch `main`).

SETUP FIRST
- The file "20261003-164929 anchors vo final 2.mp4" (111MB) is stored with Git LFS. Run `git lfs install && git lfs pull` and confirm it is a real ~111MB video (not a ~130-byte pointer file) before doing anything else. If it cannot be pulled, STOP and tell me.
- Confirm all three files play with `ffprobe` before planning.

INPUT (watch ALL three completely before planning anything; no audio exists in any of them)
Three screen recordings, 1914x866, 30fps:
1. "20261003-164929 anchors vo final 2.mp4" (~6.6 min): campaign creation, influencer criteria, matched influencers, deliverables and AI-written briefs, checkout, activation.
2. "20261003-165151 anchors vo final 2.mp4" (~1.5 min): campaign dashboard, review drafts, approve, set live dates.
3. "20261003-171654 anchors vo final 2.mp4" (~3 min): live performance and AI analysis (reach, audience, sentiment, query analysis, influencer rating).
Reference only: `anchors-platform-tour-2min.mp4` and `build_tour.sh` in the same folder are an earlier rough cut. Do not just reuse it; the new version must be far better.

AUDIENCE AND PURPOSE
Sent to NEW BRANDS that want to run influencer campaigns through Anchors. They may not know the platform. Anyone watching should understand every step of how a campaign runs from start to finish and what they get at each step. Tone: confident, clear, premium, benefit-led.

HARD RULES
1. The final video must use ONLY real frames from the three recordings. Never invent, redraw or mock up UI. You MAY add animation, zooms, pans, highlights, masks, transitions, speed ramps, and crop/reframe real footage.
2. Cut all waiting, loading, dead time and slow typing. Speed up only where it helps and stays readable; slow down on key moments.
3. NO voiceover. Audio = music and sound effects only.
4. Text overlays: short animated on-screen step labels/callouts are allowed so viewers can follow (e.g. "1 Create campaign"). Keep them brief.
5. Cover every major stage: campaign setup, influencer criteria and match preview, matched influencer profiles/analytics, selecting influencers, product details, AI-written briefs, review and checkout, activation, draft review/approval, live dates, live performance, AI analysis (audience, sentiment, queries, ratings).
6. Output 1920x1080 H.264 MP4, <=95MB, plus project source and script.
7. Git: work on a new branch `tour-video`. Never commit any file over 95MB (GitHub hard limit is 100MB). Do not push to `main`. Do not delete or modify the original recordings.

TOOLCHAIN
You (the director) decide between Remotion (React animation, good for zooms, callouts, captions) + ffmpeg, or ffmpeg alone, based on what the environment supports. Justify the choice in one line in the production notes. Use ffprobe and frame extraction to inspect footage.

CREW: spawn these sub-agents and manage them. You own collection of all results: wait for every sub-agent to finish, integrate their output, and do not end your turn while any are still running. Keep the crew to the roles below (spawn assembler/QA only when needed).

1. SCRIPT WRITER (top 1% explainer-video scriptwriter)
   Watches all three videos fully (frame sampling at least 1 frame per 3s, denser at screen changes). Writes a shot-by-shot 120s script as a table: time-in/out | source file + source timestamps | what the viewer sees | on-screen text | zoom/animation note | what the viewer should understand | music/SFX cue. Story arc: hook (about 5s), how a brand launches a campaign, how it runs and reports, closing card (use logo/URL only if they appear in the real footage).

2. VISUAL / MOTION DESIGNER (top 1% visual artist, animation and VFX expert)
   Designs the look: smart zooms into relevant UI areas, cursor/click highlights, focus masks that dim the rest of the screen, smooth pans, speed ramps, shot transitions, animated step labels and a progress indicator, consistent typography and colour derived from the Anchors UI (red/black/white). Everything built on real frames.

3. SOUND DESIGNER AND COMPOSER (top 1% music artist and sound-effects artist)
   Creates or sources a royalty-free 120s music bed that fits a premium SaaS product tour, with a build and a clean ending. State the licence and source of every audio asset in the production notes. If original composition is not possible in this environment, synthesize with code or use properly licensed tracks. Design SFX synced to the edit: clicks, whooshes on transitions, soft pops on callouts, a success chime on campaign activation/approval, subtle risers. Music ducks under SFX. Deliver stems and a final mix at about -14 LUFS integrated, no clipping.

4. EDITOR / ASSEMBLER (spawn as needed)
   Builds the timeline from the approved script, motion design and audio, then renders.

5. QA REVIEWER (spawn as needed, independent of the others)
   Checks: duration 115-125s; every major stage covered; no dead time or spinner longer than about 1s; every frame comes from the sources; audio synced with no clipping; text readable; file size limit. Reports issues; the director fixes and re-renders until QA passes.

DIRECTOR WORKFLOW
1. Brief the crew. The Script Writer delivers first; review and approve the script.
2. Run the Motion Designer and Sound Designer in parallel against the approved script.
3. Assemble, render, QA, fix; loop until QA passes.
4. Deliverables in `demo_anchors_platform/tour-video/`: `anchors-platform-tour-final.mp4`, `script.md`, `production-notes.md` (toolchain, music licences, choices made), the source project, and a build script to re-render. Commit to branch `tour-video` and push it.
5. Final message: file paths, final duration and size, QA results, and anything you could not do. Be honest about any failures.
