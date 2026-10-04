import json, math

import os
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUR = {1: 398.6, 2: 90.9, 3: 187.2}
FN = {1: "V1 (164929)", 2: "V2 (165151)", 3: "V3 (171654)"}

def R(x, y, w, h):
    return dict(x=x, y=y, w=w, h=h)

CH = [
    (1, "Create campaign"), (2, "Set criteria"), (3, "Pick influencers"),
    (4, "Add product"), (5, "AI briefs"), (6, "Checkout & launch"),
    (7, "Review drafts"), (8, "Set live dates"), (9, "Track performance"),
    (10, "AI analysis"),
]

# (id, dur, src, in, out, freeze, chapter, focus[(at,rect)], callout, callTarget, clicks[(srcT,x,y)], transition, sfx, note, sees, understand)
S = []
def shot(*a): S.append(a)

# ---------------- HOOK (0-5) ----------------
shot("s01", 1.0, 1, 100.6, 101.4, False, None, [(0, R(600, 230, 720, 405)), (1, R(640, 260, 640, 360))],
     "65 creators matched", R(590, 290, 680, 170), [], "fade", ["riser", "impact"],
     "Hook: strongest 'match' payoff, number 65 big on screen.",
     "Match preview card: 65 matched influencers, est. impressions, expected expense.",
     "The platform finds creators for you.")
shot("s02", 1.0, 1, 333.0, 334.5, False, None, [(0, R(480, 300, 960, 540))],
     "AI writes every brief", None, [], "whoosh", ["whoosh"],
     "Hook: AI-written brief text scrolling.",
     "AI-written campaign brief (What's happening / Why we're doing this).",
     "Briefs are written for you.")
shot("s03", 1.0, 1, 392.2, 393.2, False, None, [(0, R(560, 150, 800, 450))],
     "Live in minutes", None, [], "whoosh", ["whoosh", "pop"],
     "Hook: activation success screen.",
     "Congratulations! Campaign Activated.",
     "Launching is fast.")
shot("s04", 1.0, 3, 69.9, 70.9, False, None, [(0, R(440, 160, 1000, 563))],
     "AI reads every comment", None, [], "whoosh", ["whoosh"],
     "Hook: AI sentiment donut (519 comments).",
     "Overall Sentiment Analysis donut + example positive comments.",
     "Results are analysed by AI.")
shot("s05", 1.0, 3, 2.0, 3.0, False, None, [(0, R(350, 300, 1000, 563))],
     "Launch. Run. Measure.", None, [], "whoosh", ["whoosh", "impact"],
     "Hook end on live numbers (134,193 impressions).",
     "Overall Summary: 134,193 impressions, 10,738 likes, 542 comments, 8.41%.",
     "Every result is tracked; sets up the tour.")

# ---------------- CH1 Create campaign ----------------
shot("s06", 2.4, 1, 1.0, 10.1, False, 1, [(0, R(410, 120, 1100, 620))],
     "Name your campaign", R(694, 330, 530, 300), [(10.0, 1132, 685)], "zoom", ["whoosh", "click"],
     "Typing of name + description sped up ~3.8x; click Create at the end. Spinner 10.2-11.7 cut.",
     "'Create Sample Campaign' modal: name 'Zepto', description 'Online grocery app', Create.",
     "Step 1 starts with just a name and a one-line purpose.")
shot("s07", 1.5, 1, 18.6, 20.4, False, 1, [(0, R(380, 150, 960, 540))],
     "Pick your goal", R(857, 290, 448, 75), [(19.4, 1080, 330)], "cut", ["click"],
     "Goal selection: Engagement.",
     "Campaign Goal cards; Engagement gets selected.",
     "Choose what the campaign should achieve.")
shot("s08", 2.0, 1, 23.6, 30.2, False, 1, [(0, R(380, 300, 960, 540))],
     "Business type & platform", R(400, 440, 900, 90), [(25.2, 520, 560)], "cut", ["click"],
     "Business type B2C, metric Member Reach, platform LinkedIn (dropdowns, 3.3x).",
     "Business Type & Platform row filled: B2C / Member Reach / LinkedIn.",
     "Tell Anchors who you sell to and where to run.")
shot("s09", 2.2, 1, 30.6, 38.6, False, 1, [(0, R(360, 120, 1000, 563)), (1, R(620, 100, 1294, 728))],
     "Set budget & timeline", R(1590, 90, 324, 110), [(31.8, 420, 350)], "cut", ["click", "pop"],
     "Date picker -> 13 Oct 2026, budget typed 500000; outline panel jumps to Rs 500,000. Idle 39-43 cut.",
     "Start date calendar, max budget field, live Campaign Outline updating to Rs 500,000.",
     "Budget and start date; the outline panel updates live.")
shot("s10", 2.0, 1, 43.9, 46.2, False, 1, [(0, R(400, 170, 1110, 625))],
     "Confirm in one glance", R(640, 170, 640, 640), [(46.05, 1127, 648)], "cut", ["pop", "click"],
     "Quick summary modal (budget 5.0L, live 13 Oct, B2C, Engagement) -> Add Influencer Criteria.",
     "'Confirm your campaign details' summary card.",
     "Setup is reviewed before moving on.")

# ---------------- CH2 Criteria ----------------
shot("s11", 1.6, 1, 51.0, 54.8, False, 2, [(0, R(390, 120, 960, 540))],
     "Choose content topics", None, [(51.9, 640, 330)], "whoosh", ["whoosh", "click"],
     "Content topics chips: Health & Wellness, E-commerce & D2C, Marketing & Advertising (max 3).",
     "Topic chips turning black as they are selected.",
     "Step 2: describe the creators you want.")
shot("s12", 2.0, 1, 56.5, 63.0, False, 2, [(0, R(380, 300, 960, 540))],
     "Set follower range", R(400, 500, 920, 60), [], "cut", ["click"],
     "Follower range min 5000 / max 200000 typed (3.25x).",
     "Influencer Profile: Follower Range min/max fields.",
     "Control creator size (micro / mid / macro).")
shot("s13", 2.0, 1, 64.0, 72.0, False, 2, [(0, R(380, 120, 1000, 563))],
     "Roles & seniority", None, [], "cut", ["click"],
     "Current-role dropdown -> Engineering/Technology; seniority dropdown (4x).",
     "Role and seniority multi-select dropdowns.",
     "Target creators by profession and level.")
shot("s14", 2.6, 1, 82.5, 95.6, False, 2, [(0, R(380, 150, 1000, 563)), (1, R(760, 300, 1000, 563))],
     "Target their audience", R(1320, 815, 240, 40), [(95.3, 1440, 834)], "cut", ["click", "click"],
     "Audience demographics: audience roles, Student + Intern seniority. Country list, View Matched click and disabled/loading button 90-99.4 cut.",
     "Audience Demographics dropdowns with Student / Intern chips.",
     "You can also target who the creator's audience is.")
shot("s16", 4.2, 1, 99.5, 103.7, False, 2, [(0, R(460, 150, 1000, 563)), (1, R(560, 280, 760, 428))],
     "65 creators matched instantly", R(668, 312, 577, 134), [], "zoom", ["impact", "chime"],
     "PAYOFF hold at 1.0x: match preview (65 matched, 1.0M impressions, Rs 4.9L expected expense).",
     "'Criteria saved - here's your match preview': 65 matched, est. impressions, expected expense.",
     "Instant preview of how many creators fit and what reach/cost to expect.")

# ---------------- CH3 Pick influencers ----------------
shot("s17", 2.0, 1, 106.6, 110.6, False, 3, [(0, R(390, 170, 1150, 647))],
     "AI-ranked creator list", R(400, 200, 1100, 500), [], "whoosh", ["whoosh"],
     "Matched list (AI Suggested, Best match sort, tiers) with Kartik/Mira cards; outline shows 1.0M reach.",
     "Creator cards with followers, ER, likes, comments, past collabs, Add to Campaign.",
     "Step 3: browse matched creators with key stats.")
shot("s18", 2.0, 1, 113.6, 117.6, False, 3, [(0, R(600, 40, 1280, 720))],
     "Real, synced creator data", R(1580, 70, 230, 30), [], "zoom", ["pop"],
     "Kartik profile: 'Actual, synced data', followers 10,653, avg likes 303, ER 4.1%.",
     "Influencer profile modal with profile highlights.",
     "Each profile shows verified analytics.")
shot("s19", 2.0, 1, 117.6, 126.6, False, 3, [(0, R(600, 100, 1240, 698))],
     "AI-analysed content", None, [], "cut", [],
     "Content Niche tab: AI-analysed top categories, content types, engagement over time (4.5x scroll).",
     "Donut charts + engagement bar chart.",
     "AI shows what a creator talks about and how posts perform.")
shot("s20", 1.5, 1, 127.0, 129.0, False, 3, [(0, R(600, 40, 1240, 698))],
     "Know their audience", None, [], "cut", [],
     "Audience tab: job titles, industries, companies, company size.",
     "Audience bar charts (IT services, Deloitte, EY...).",
     "See exactly who follows each creator.")
shot("s21", 2.2, 1, 129.6, 133.6, False, 3, [(0, R(420, 160, 1200, 675)), (1, R(1100, 0, 814, 458))],
     "Reach updates as you pick", R(1600, 40, 314, 260), [(129.8, 1241, 798), (132.2, 1368, 556)], "cut", ["click", "pop"],
     "Select Kartik, Add Mira; toasts 'selected for campaign'; outline reach 1.0M -> 9.6K -> 19.9K-22.2K, expense Rs 7,268.",
     "Creators added; Campaign Outline: expected reach, expected expense, selected creators 2.",
     "Selecting creators instantly updates expected reach and cost.")
shot("s22", 2.0, 1, 175.5, 183.5, False, 3, [(0, R(600, 0, 1300, 731))],
     "See past brand collabs", None, [], "whoosh", ["whoosh"],
     "Rohan Arora 'Past Collabs' tab: brand-tagged posts (Shaadi.com, Crocs, Swiggy...) scrolled 4x.",
     "Grid of past sponsored posts with brand badges and likes/comments.",
     "Check a creator's brand history before choosing.")
shot("s24", 1.8, 1, 241.5, 246.5, False, 3, [(0, R(390, 150, 1150, 647))],
     "Your shortlist, ready", R(400, 360, 1100, 300), [], "cut", ["pop"],
     "Selected tab (2): Kartik and Mira marked Selected.",
     "'Selected 2' list with black Selected buttons.",
     "Shortlist is locked in.")

# ---------------- CH4 Product ----------------
shot("s25", 1.6, 1, 250.0, 255.0, False, 4, [(0, R(380, 150, 1000, 563))],
     "Add your website", R(400, 330, 1100, 60), [], "whoosh", ["whoosh"],
     "Product Details tab: company website typed zepto.com. Skeleton loading 256-273.5 cut.",
     "Company Website field, 'Pick a known brand / product'.",
     "Step 4: just drop in your website.")
shot("s26", 2.2, 1, 273.6, 278.8, False, 4, [(0, R(380, 150, 1000, 563)), (1, R(380, 300, 1000, 563))],
     "AI detects your products", R(400, 470, 900, 80), [(276.0, 530, 428)], "cut", ["click", "pop"],
     "CLEO-detected Zepto products; pick 'Zepto Core Grocery Delivery' -> product details auto-filled.",
     "Product list (Zepto Core Grocery Delivery, iOS app...) then filled Product Details.",
     "Product info is pulled from your site automatically.")
shot("s27", 1.6, 1, 288.5, 291.2, False, 4, [(0, R(380, 200, 1000, 563))],
     None, R(1020, 725, 230, 40), [(290.6, 1135, 745)], "cut", ["click"],
     "Filled product name/description/reference link -> click Add Deliverables.",
     "Product Details form complete, Add Deliverables button.",
     "Product done; move to deliverables.")

# ---------------- CH5 AI briefs ----------------
shot("s29", 3.0, 1, 292.3, 299.0, False, 5, [(0, R(380, 150, 1000, 563)), (0.4, R(1000, 280, 914, 514))],
     "Format picked from real data", R(1010, 450, 880, 90), [], "whoosh", ["whoosh", "click"],
     "Per-creator brief panel: post format bars from creator's real history, Text+Image 'Recommended'.",
     "Post Format performance bars with Recommended badge.",
     "Format recommendations come from each creator's real performance.")
shot("s31", 0.4, 1, 312.2, 312.9, False, 5, [(0, R(700, 180, 900, 506))],
     None, R(1100, 280, 220, 34), [(312.6, 1205, 297)], "cut", ["click"],
     "CTA beat: click 'Write all briefs with AI' (manual brief typing 299-312 skipped).",
     "Cursor clicks Write all briefs with AI.",
     "One click generates every brief.")
shot("s31b", 0.8, 1, 319.6, 326.0, False, 5, [(0, R(420, 160, 1080, 608))],
     "AI writes every brief", R(478, 250, 957, 180), [], "cut", ["riser"],
     "Fast glimpse of the AI progress bar's last stretch (~50% 'Personalising content' -> 100% 'Briefs ready!') at 8x; 312.9-319.6 cut.",
     "AI-Written Campaign Brief progress bar racing to 100%.",
     "The AI writes personalised briefs for all creators in seconds.")
shot("s32", 3.1, 1, 327.6, 332.5, False, 5, [(0, R(440, 40, 1040, 585)), (1, R(460, 180, 1000, 563))],
     None, None, [], "zoom", ["chime"],
     "Generated brief for Mira: recommended format, then brief text appears.",
     "AI-Written Campaign Brief modal with Mira/Kartik tabs.",
     "Each brief is tailored to the creator.")
shot("s33", 3.0, 1, 332.5, 332.5, True, 5, [(0, R(480, 200, 960, 540)), (1, R(500, 240, 880, 495))],
     "Personalised, ready to send", R(500, 560, 900, 260), [], "cut", [],
     "PAYOFF freeze on full brief text (What's happening / Why / What we want / Example vibes).",
     "Readable AI brief text.",
     "The brief is complete and specific to the product and the creator's audience.")
shot("s34", 1.5, 1, 336.5, 340.1, False, 5, [(0, R(440, 100, 1040, 585))],
     "Guidelines & hashtags included", None, [], "cut", [],
     "Campaign guidelines (do/don't) and hashtags (#ZeptoCore ...).",
     "Bulleted guidelines list and hashtag chips.",
     "Dos, don'ts and hashtags are generated too.")
shot("s35", 1.2, 1, 350.2, 351.4, False, 5, [(0, R(700, 300, 900, 506)), (1, R(380, 240, 1100, 619))],
     "Applied to all creators", R(1255, 738, 170, 44), [(350.6, 1335, 760)], "cut", ["click", "pop"],
     "Deliverables page after Apply All: 2 of 2 briefs complete, toast 'AI brief applied to 2 creators'.",
     "Briefs 100% complete, then the toast.",
     "All briefs are applied in one go.")

# ---------------- CH6 Checkout & launch ----------------
shot("s36", 2.0, 1, 357.0, 363.0, False, 6, [(0, R(380, 160, 1150, 647))],
     "Final check before launch", R(400, 260, 1100, 120), [], "whoosh", ["whoosh"],
     "Review your campaign: budget Rs 7,268, 2 creators, est. reach 19.9K-22.2K, 2 briefs; campaign info table; 'Ready to launch'.",
     "Review & Launch summary page.",
     "Step 6: everything in one review screen.")
shot("s37", 1.8, 1, 366.2, 369.8, False, 6, [(0, R(380, 90, 1150, 647))],
     "Clear pricing, GST included", R(980, 60, 520, 260), [], "cut", [],
     "Checkout: campaign details, order summary (subtotal, GST 18%, total Rs 8,576.65), credits, payment options.",
     "Checkout page.",
     "Transparent costs before paying.")
shot("s39", 2.0, 1, 380.8, 385.8, False, 6, [(0, R(640, 300, 960, 540)), (0.3, R(520, 150, 860, 484))],
     "Pay by UPI or card", None, [(381.2, 1230, 772), (383.7, 735, 690), (385.5, 957, 549)], "cut", ["click"],
     "Click Pay Rs 8,576.65 (hover 369.8-380.8 cut) -> Select Payment Method: UPI (no extra fee) -> Pay via UPI. Loader 385.9-388 cut.",
     "Payment method modal.",
     "Flexible payment.")
shot("s40", 1.2, 1, 388.0, 391.8, False, 6, [(0, R(520, 160, 880, 495))],
     "Invoice details saved", None, [(389.2, 1175, 597), (391.6, 1169, 560)], "cut", ["click", "pop"],
     "Billing Details: Individual -> Save -> 'Billing details saved' -> Done.",
     "Billing details modal and saved confirmation.",
     "Invoices are generated automatically.")
shot("s41", 4.0, 1, 391.9, 394.9, False, 6, [(0, R(560, 140, 800, 450)), (1, R(420, 120, 1080, 608))],
     "Campaign activated!", R(700, 160, 520, 220), [], "zoom", ["impact", "chime"],
     "PAYOFF at 0.75x: 'Congratulations! Campaign Activated' + status tracker + toast.",
     "Success screen with tracker: Campaign Created > Accepted > Drafts Submitted > Approved to go Live.",
     "The campaign is live and creators are notified.")

# ---------------- CH7 Review drafts (V2) ----------------
shot("s42", 2.0, 2, 16.0, 22.0, False, 7, [(0, R(340, 180, 1150, 647))],
     "Track every creator's status", R(400, 212, 1100, 120), [], "fade", ["whoosh"],
     "Campaign dashboard: Influencer Status & Drafts, cards 2 selected / 2 accepted / 2 drafts submitted, table.",
     "Status cards and influencer table with 'Draft Submitted'.",
     "After launch, one dashboard tracks every creator.")
shot("s43", 2.0, 2, 29.5, 35.5, False, 7, [(0, R(380, 100, 1200, 675))],
     "Preview drafts before they post", R(400, 140, 670, 560), [], "cut", [],
     "Post Preview of Mira's LinkedIn draft with image, Approve Post / Suggest Changes.",
     "Draft post preview as it will appear.",
     "Step 7: review each creator's draft in context.")
shot("s44", 1.6, 2, 41.5, 45.0, False, 7, [(0, R(900, 240, 1000, 563))],
     "Request changes in-app", R(1180, 580, 660, 220), [], "cut", ["click"],
     "Suggest Changes -> 'Give Suggestions' text box (2 suggestions left).",
     "Suggestion input box.",
     "Feedback goes to creators without email back-and-forth.")
shot("s45", 1.4, 2, 47.4, 49.8, False, 7, [(0, R(900, 60, 900, 506)), (1, R(500, 150, 900, 506))],
     "Approve with one click", None, [(48.1, 1445, 227), (49.6, 1185, 491)], "cut", ["click", "click"],
     "Approve Post -> 'Are you sure?' -> Continue. Lag 49.8-51.4 cut.",
     "Approve button and confirmation modal.",
     "Approving is one click plus a confirm.")
shot("s46", 2.2, 2, 51.6, 53.3, False, 7, [(0, R(480, 150, 1000, 563)), (1, R(600, 240, 1110, 624))],
     "Draft approved", R(640, 330, 640, 200), [], "zoom", ["chime"],
     "PAYOFF at 0.77x: 'Draft is approved! Now you can set the live date' + toast.",
     "Draft approved modal and success toast.",
     "Approved drafts move to scheduling.")
shot("s47", 2.8, 2, 53.6, 60.4, False, 7, [(0, R(380, 0, 1200, 675)), (1, R(500, 60, 1000, 563))],
     None, None, [(58.3, 1444, 476), (60.3, 1187, 487)], "cut", ["click", "click"],
     "Next draft (Kartik) preview -> Approve Post -> Continue (2.43x).",
     "Kartik's draft preview and approval.",
     "Repeat for each creator, fast.")

# ---------------- CH8 Live dates ----------------
shot("s49", 4.2, 2, 62.5, 72.6, False, 8, [(0, R(480, 150, 1000, 563)), (0.3, R(360, 180, 1150, 647)), (1, R(760, 200, 1150, 647))],
     "Pick each go-live date", R(1300, 270, 360, 420), [(64.2, 1166, 472), (68.4, 1732, 466), (72.1, 1470, 662)], "whoosh", ["whoosh", "click", "click"],
     "Draft approved modal -> Set Live Date -> Customize Live Dates table -> Set Custom for Mira -> calendar Oct 4 -> Confirm (2.6x).",
     "Set Live Date button, then live dates table with calendar popover.",
     "Step 8: each creator can get their own go-live date.")
shot("s50", 1.8, 2, 73.0, 76.6, False, 8, [(0, R(360, 120, 1150, 647))],
     "Both creators scheduled", R(1640, 440, 220, 150), [], "cut", ["pop"],
     "Both live dates shown (Mira Oct 4th, Kartik Oct 5th); toast 'Live Date for Mira set successfully'.",
     "Live Date column filled for both creators.",
     "The schedule is set.")

# ---------------- CH9 Performance ----------------
shot("s51", 1.0, 2, 79.9, 81.5, False, 9, [(0, R(0, 100, 1100, 619))],
     None, R(20, 520, 250, 45), [(80.5, 140, 540)], "whoosh", ["whoosh", "click"],
     "Click Performance in campaign sidebar -> Live Campaign Performance.",
     "Sidebar steps all ticked; Performance opens.",
     "Step 9: performance is one click away.")
shot("s52", 3.0, 3, 0.5, 4.5, False, 9, [(0, R(350, 260, 1000, 563)), (1, R(840, 250, 1000, 563))],
     "Reach & engagement, live", R(365, 418, 780, 198), [], "cut", ["pop"],
     "Overall Summary: 134,193 impressions, 10,738 likes, 542 comments, 8.41% avg engagement, 2/2 live, budget gauge Rs 7,268.",
     "Live campaign KPIs and utilised-budget gauge.",
     "Live results of the whole campaign at a glance.")
shot("s53", 2.0, 3, 19.0, 25.0, False, 9, [(0, R(380, 180, 1150, 647))],
     "Per-post stats, synced", None, [], "cut", [],
     "Per-influencer table and Post Details (Kartik 123,456 impressions, 9,920 likes), Check Post-Analysis Report.",
     "Influencer rows with impressions/likes/comments, post preview.",
     "Every post is tracked individually.")
shot("s54", 0.8, 3, 35.2, 36.4, False, 9, [(0, R(0, 150, 1000, 563))],
     None, R(20, 585, 250, 45), [(35.65, 172, 606)], "cut", ["click"],
     "Click 'AI Analysis Report'. Loading 37.0-38.2 cut.",
     "Sidebar AI Analysis Report click.",
     "Leads into the AI report.")

# ---------------- CH10 AI analysis ----------------
shot("s55", 1.5, 3, 38.3, 41.3, False, 10, [(0, R(360, 60, 1100, 619))],
     "AI audience breakdown", None, [], "zoom", ["whoosh"],
     "Reach Audience Analysis (Mira): ER 6.99%, likes 818, comments 72; reach summary tags, job role & location distributions.",
     "AI report header tabs and reach metrics.",
     "Step 10: AI explains who was reached.")
shot("s56", 3.2, 3, 42.5, 53.5, False, 10, [(0, R(360, 120, 1100, 619)), (1, R(360, 100, 1100, 619))],
     "Campaign-wide metrics", None, [], "cut", [],
     "Overall campaign view: Campaign Metrics 134,193 reach / 10,738 likes / 542 comments / 8.41% ER, then Top Audience Categories (role, location, seniority, industry).",
     "Campaign Metrics card, then audience category bars.",
     "Totals across all creators and audience quality.")
shot("s58", 2.3, 3, 69.8, 71.8, False, 10, [(0, R(400, 150, 1100, 619)), (1, R(440, 200, 1000, 563))],
     "AI sentiment on every comment", R(480, 270, 340, 320), [], "zoom", ["chime"],
     "PAYOFF at 0.87x: Overall Sentiment donut 519 comments, 24.66% positive / 23.51% negative / 51.83% neutral, example comments.",
     "Sentiment donut + example positive comments tagged 'Very Positive'.",
     "AI reads and classifies every comment.")
shot("s59", 1.7, 3, 72.0, 75.6, False, 10, [(0, R(360, 20, 1100, 619))],
     "Positive, negative, neutral", None, [(72.2, 1112, 180), (74.0, 1270, 180)], "cut", ["click"],
     "Negative and Neutral tabs with real example comments.",
     "Example negative / neutral comments.",
     "You see what people actually said.")
shot("s60", 1.6, 3, 81.0, 85.0, False, 10, [(0, R(360, 140, 1150, 647))],
     "Queries & purchase intent", R(380, 300, 1100, 180), [], "cut", ["pop"],
     "Overall Customer Query Analysis: 20 product queries, 25 purchase intent, 31 concerns; top query categories.",
     "Three query KPI cards.",
     "AI surfaces questions and buying intent.")
shot("s61", 1.3, 3, 89.5, 92.5, False, 10, [(0, R(380, 80, 1100, 619))],
     "Spot buyers in the comments", None, [], "cut", [],
     "High Intent Examples with High/Medium/Low intent tags.",
     "Comments labelled by purchase intent.",
     "Find comments that signal purchases.")
shot("s63", 1.8, 3, 100.0, 106.0, False, 10, [(0, R(360, 240, 1100, 619)), (1, R(360, 120, 1150, 647))],
     "Rank creators by results", None, [], "cut", [],
     "Best Performing Influencers (reach, positive sentiment, queries) + Influencer Performance Analysis table.",
     "Winner cards and per-influencer metrics table.",
     "Know which creator performed best.")
shot("s64", 1.5, 3, 107.6, 110.6, False, 10, [(0, R(400, 150, 1100, 619)), (1, R(760, 240, 1154, 624))],
     "Export to CSV", R(1415, 730, 465, 105), [(108.2, 1342, 407)], "cut", ["click", "pop"],
     "Export CSV -> green 'Data exported successfully' toast.",
     "Export button and success toast.",
     "Take the data anywhere.")
shot("s65", 1.6, 3, 115.4, 118.6, False, 10, [(0, R(360, 200, 1100, 619))],
     "Drill into each creator", None, [], "cut", [],
     "Per-creator (Mira) AI Comment Analysis: Brand Sentiment Positive, 8 / 21 / 19 comments.",
     "Brand Sentiment Analysis cards for one influencer.",
     "Every insight is available per creator.")
shot("s67", 1.5, 3, 155.6, 158.0, False, 10, [(0, R(380, 60, 1100, 619))],
     "Keywords that drive talk", None, [], "cut", [],
     "Keyword Analysis: top keywords by sentiment, word cloud (convenience, quality), key takeaways.",
     "Keyword bars and word cloud.",
     "AI summarises the themes in the conversation.")
shot("s68", 1.4, 3, 175.2, 179.6, False, 10, [(0, R(820, 20, 1094, 615))],
     "Rate creators for next time", R(1500, 20, 340, 700), [], "cut", ["click"],
     "Rate the Influencer: 5 stars, future collaboration likelihood 10, feedback field.",
     "Rating panel with stars and 1-10 scale.",
     "Your ratings improve future recommendations.")
shot("s69", 0.9, 3, 180.4, 181.3, False, 10, [(0, R(820, 20, 1094, 615))],
     None, R(1720, 80, 180, 280), [], "cut", ["chime"],
     "'Thank you for sharing your feedback!' + toast 'Feedback submitted successfully'. (Small red loader dots at 180.3-180.6 visible <0.3 s.)",
     "Feedback confirmation.",
     "Loop closes: insights feed the next campaign.")

END = dict(tIn=115.5, tOut=120.0, text="Anchors — influencer campaigns, start to finish",
           logoSource=dict(src=1, t=13.0, x=12, y=12, w=144, h=36))


# ---------- QA round 1 overrides (highlight tracking, verified at 5 fps on source frames) ----------
# keys: si/so (source in/out), focus [(at,rect)], ct rect | [(at,rect)], win [a,b], clicks [(srcT,x,y)], call, note_add
K = lambda *ks: list(ks)
OV = {
 "s16": dict(at="top"),
 "s08": dict(so=29.5, note_add=" QA1: srcOut 29.5 so the 'Please select start date' error never shows."),
 "s09": dict(si=31.4, so=36.3, clicks=[],
             focus=K((0, R(360, 120, 1000, 563)), (0.45, R(380, 300, 1000, 563)), (1, R(380, 300, 1000, 563))),
             ct=R(400, 540, 930, 70), win=[0.5, 1],
             note_add=" QA1: src 31.4-36.3 (date pick + budget field) avoids the 'Minimum budget' error; highlight on date+budget fields once the page settles (src 33.7+); click ring removed."),
 "s10": dict(ct=R(640, 165, 640, 535)),
 "s14": dict(so=90.0, clicks=[], focus=K((0, R(380, 150, 1000, 563)), (1, R(380, 250, 1000, 563))),
             ct=R(860, 570, 440, 50), win=[0.72, 1],
             note_add=" QA1: trimmed to src 82.5-90 (2.9x), small pan; highlight the Audience Seniority chips (Student, Intern) once they appear."),
 "s18": dict(si=113.6, so=115.0, ct=R(1575, 65, 310, 40),
             note_add=" QA1: src 113.6-115.0 at 0.7x, before the modal scrolls, so the 'Actual, synced data' badge stays put."),
 "s21": dict(focus=K((0, R(420, 160, 1200, 675)), (0.45, R(714, 100, 1200, 675)), (1, R(1100, 0, 814, 458))),
             ct=R(1595, 95, 315, 190), win=[0.45, 1]),
 "s24": dict(si=244.6, so=246.5, ct=R(400, 330, 1100, 330),
             note_add=" QA1: src 244.6-246.5 after the list scroll; highlight on Kartik's Selected card."),
 "s25": dict(ct=R(400, 335, 1100, 55)),
 "s26": dict(ct=R(400, 412, 905, 62), win=[0, 0.72]),
 "s27": dict(ct=R(1115, 725, 230, 46), win=[0.45, 0.88]),
 "s29": dict(si=295.9, so=298.6, focus=K((0, R(1000, 280, 914, 514))),
             ct=R(1105, 535, 800, 65),
             note_add=" QA1: src 295.9-298.6 (0.9x) starts on Post Format (Yes/No step skipped) and ends before the panel scrolls; highlight on the Text+Image row with the Recommended badge."),
 "s31b": dict(call="AI writes every brief", ct=R(478, 248, 957, 225)),
 "s33": dict(ct=R(500, 565, 900, 150)),
 "s35": dict(si=351.15, so=352.35, clicks=[],
             focus=K((0, R(380, 200, 1100, 619)), (0.45, R(814, 247, 1100, 619)), (1, R(814, 247, 1100, 619))),
             ct=R(1412, 760, 483, 85), win=[0.4, 1],
             note_add=" QA1: src 351.15-352.35 (1x), after the modal closes (no 'No briefs generated' error); pans to the real toast 'AI brief applied to 2 creators'."),
 "s36": dict(at="bottom", ct=K((0, R(400, 262, 1100, 120)), (0.42, R(400, 262, 1100, 120)), (0.65, R(400, 160, 1100, 105)), (1, R(400, 160, 1100, 105))), win=[0, 0.8]),
 "s37": dict(ct=R(985, 195, 520, 250)),
 "s41": dict(si=392.25, note_add=" QA1: srcIn 392.25 so the billing modal is not seen."),
 "s42": dict(so=19.6, focus=K((0, R(340, 40, 1150, 647))), ct=R(400, 82, 1090, 100),
             note_add=" QA1: src 16.0-19.6 before the page scrolls; focus raised to include the status cards; highlight on Selected/Accepted/Draft Submitted/Approved cards."),
 "s43": dict(si=32.1, so=33.6, focus=K((0, R(380, 100, 1200, 675))), ct=R(425, 240, 600, 460),
             note_add=" QA1: src 32.1-33.6 (0.75x) on the stable post preview; highlight on Mira's draft post."),
 "s44": dict(so=44.6, ct=R(1180, 585, 660, 220), win=[0.47, 1]),
 "s49": dict(focus=K((0, R(480, 150, 1000, 563)), (0.22, R(700, 180, 1150, 647)), (1, R(760, 200, 1150, 647))),
             ct=K((0, R(1600, 400, 220, 200)), (0.6, R(1600, 400, 220, 200)), (0.65, R(1215, 270, 370, 400)), (1, R(1215, 270, 370, 400))),
             win=[0.25, 1],
             note_add=" QA1: focus pans right to the Live Date column; highlight on the Set Custom buttons, then follows the calendar popover."),
 "s50": dict(si=76.1, so=77.4, focus=K((0, R(760, 120, 1150, 647))), ct=R(1620, 435, 215, 170),
             note_add=" QA1: src 76.1-77.4 (0.72x), both live dates already set (Oct 4th / Oct 5th); highlight on the Live Date column."),
 "s52": dict(focus=K((0, R(350, 270, 1050, 591)), (0.66, R(350, 270, 1050, 591)), (1, R(350, 140, 1100, 619))),
             ct=K((0, R(365, 418, 780, 198)), (0.66, R(365, 418, 780, 198)), (0.77, R(365, 200, 780, 150)), (1, R(365, 195, 780, 150))),
             note_add=" QA1: highlight follows the KPI card when the page scrolls (src 3.15-3.6)."),
 "s58": dict(focus=K((0, R(400, 150, 1100, 619)), (1, R(400, 60, 1100, 619))),
             ct=K((0, R(482, 268, 326, 326)), (0.16, R(482, 268, 326, 326)), (0.3, R(482, 143, 326, 326)), (1, R(482, 143, 326, 326))),
             note_add=" QA1: highlight tracks the donut as it scrolls up."),
 "s60": dict(at="bottom", ct=K((0, R(380, 540, 1100, 180)), (0.31, R(380, 525, 1100, 180)), (0.44, R(380, 295, 1100, 175)), (1, R(380, 295, 1100, 175))), win=[0.2, 1]),
 "s64": dict(focus=K((0, R(400, 150, 1100, 619)), (0.3, R(760, 240, 1154, 624)), (1, R(760, 240, 1154, 624))),
             ct=R(1411, 727, 485, 120), win=[0.3, 1]),
 "s68": dict(ct=K((0, R(1495, 230, 345, 420)), (0.2, R(1495, 20, 345, 560)), (1, R(1495, 20, 345, 560)))),
 "s69": dict(ct=R(1495, 220, 345, 300)),
}
def _apply(a):
    sid = a[0]
    o = OV.get(sid)
    if not o: return a, None
    a = list(a)
    if "si" in o: a[3] = o["si"]
    if "so" in o: a[4] = o["so"]
    if "focus" in o: a[7] = o["focus"]
    if "call" in o: a[8] = o["call"]
    if "ct" in o: a[9] = o["ct"]
    if "clicks" in o: a[10] = o["clicks"]
    if "note_add" in o: a[13] = a[13] + o["note_add"]
    if "at" in o: CAT[sid] = o["at"]
    return tuple(a), o.get("win")
_S2 = []; WIN = {}; CAT = {}
for a in S:
    a2, w = _apply(a); _S2.append(a2)
    if w: WIN[a2[0]] = w
S[:] = _S2
def _ct(ct):
    if ct is None or isinstance(ct, dict): return ct
    return [dict(at=at, **r) for at, r in ct]
def _ct_rects(ct):
    if ct is None: return []
    return [ct] if isinstance(ct, dict) else ct

# ---------- build ----------
shots = []
t = 0.0
for a in S:
    (sid, dur, src, si, so, fr, ch, focus, call, ct, clicks, tr, sfx, note, sees, und) = a
    tIn = round(t, 2); tOut = round(t + dur, 2); t = tOut
    speed = 0 if fr else (so - si) / dur
    cl = []
    for (ct_s, x, y) in clicks:
        off = (ct_s - si) / speed if speed else 0
        cl.append(dict(t=round(off, 2), x=x, y=y))
    shots.append(dict(id=sid, tIn=tIn, tOut=tOut, src=src, srcIn=round(si, 2), srcOut=round(so, 2), freeze=fr,
                      chapter=ch, focus=[dict(at=at, **r) for at, r in focus], callout=call, callTarget=_ct(ct),
                      clicks=cl, transition=tr, sfx=sfx, note=note))
    if sid in WIN: shots[-1]["callWin"] = WIN[sid]
    if sid in CAT: shots[-1]["calloutAt"] = CAT[sid]

chapters = []
for n, title in CH:
    ss = [s for s in shots if s["chapter"] == n]
    chapters.append(dict(n=n, title=title, tIn=ss[0]["tIn"], tOut=ss[-1]["tOut"]))

tl = dict(fps=30, durationSec=120, chapters=chapters, shots=shots, endCard=END)

# ---------- validate ----------
err = []
if shots[0]["tIn"] != 0: err.append("first tIn")
for a, b in zip(shots, shots[1:]):
    if abs(a["tOut"] - b["tIn"]) > 1e-6: err.append(f"gap {a['id']}->{b['id']}")
if abs(shots[-1]["tOut"] - END["tIn"]) > 1e-6: err.append(f"last tOut {shots[-1]['tOut']} != endCard.tIn")
if END["tOut"] != 120: err.append("end")
for s in shots:
    d = s["tOut"] - s["tIn"]
    if d <= 0: err.append(f"{s['id']} dur")
    if not (0 <= s["srcIn"] <= DUR[s["src"]] and 0 <= s["srcOut"] <= DUR[s["src"]]): err.append(f"{s['id']} src range")
    if not s["freeze"]:
        sp = (s["srcOut"] - s["srcIn"]) / d
        if not (0.5 <= sp <= 8): err.append(f"{s['id']} speed {sp:.2f}")
    for w_ in ([s["callWin"]] if "callWin" in s else []):
        if not (0 <= w_[0] < w_[1] <= 1): err.append(f"{s['id']} callWin")
    for f in s["focus"] + _ct_rects(s["callTarget"]):
        if f["x"] < 0 or f["y"] < 0 or f["x"] + f["w"] > 1914 or f["y"] + f["h"] > 866:
            err.append(f"{s['id']} rect out of frame {f}")
    for c in s["clicks"]:
        if not (0 <= c["t"] <= d): err.append(f"{s['id']} click t {c['t']}")
    if not (1 <= len(s["focus"]) <= 3): err.append(f"{s['id']} focus keys")
for c in chapters:
    pass
for a, b in zip(chapters, chapters[1:]):
    if abs(a["tOut"] - b["tIn"]) > 1e-6: err.append(f"chapter gap {a['n']}")
if not (35 <= len(shots) <= 61): err.append("shot count")
print("shots", len(shots), "end", shots[-1]["tOut"])
for c in chapters: print(c)
print("ERRORS:", err)

json.dump(tl, open(OUT + "/project/src/timeline.json", "w"), indent=1)

# ---------- markdown ----------
L = []
L.append("# Anchors — Platform Tour (120 s)\n")
L.append("**Logline:** In two minutes, a new brand watches one real campaign go from a blank name field to AI-written briefs, a paid launch, approved drafts and an AI performance report — every step on Anchors, nothing skipped.\n")
L.append("**Format:** 1920x1080 @30 fps, 3600 frames. No voiceover: music + SFX + short animated text (step labels + callouts). All footage is real screen capture from V1/V2/V3 (1914x866 sources), scaled and zoomed.\n")
L.append("## Story arc\n")
L.append("- **Hook (0–5 s):** five 1-second real payoff frames — 65 creators matched, AI brief, Campaign Activated, AI sentiment donut, live reach numbers — ending on “Launch. Run. Measure.”")
L.append("- **Act 1 — Launch (5–70.4 s), steps 1–6:** create campaign → criteria + instant match preview (hold) → matched profiles & analytics → select creators (outline reach updates live) → product details auto-detected → AI-written briefs (freeze) → review, checkout, pay → Campaign Activated (slow hold).")
L.append("- **Act 2 — Run (70.4–88.4 s), steps 7–8:** status dashboard → draft previews → suggest changes → approve (hold) → set live dates.")
L.append("- **Act 3 — Measure (88.4–115.5 s), steps 9–10:** live KPIs → per-post stats → AI report: audience, sentiment (hold), queries & purchase intent, best performers, CSV export, per-creator drill-down, keywords, rate the influencer.")
L.append("- **End card (115.5–120 s):** blurred real frame + real Anchors logo (cropped from V1 @13.0 s) + line “Anchors — influencer campaigns, start to finish”.\n")
L.append("Speed = (src out − src in) / shot duration. Focus rects are SOURCE px (x,y,w,h on 1914x866); → means keyframed start → end. Click times are offsets within the shot.\n")
L.append("## Shot table\n")
L.append("| # | time in–out (s) | source (in–out, speed) | what the viewer sees | on-screen text | zoom / animation | what the viewer should understand | music / SFX |")
L.append("|---|---|---|---|---|---|---|---|")
chs = {n: t for n, t in CH}
first = set(c["n"] for c in chapters)
seen = set()
for a, s in zip(S, shots):
    sees, und = a[14], a[15]
    d = s["tOut"] - s["tIn"]
    if s["freeze"]:
        src = f"{FN[s['src']]} freeze @{s['srcIn']:.2f}"
    else:
        src = f"{FN[s['src']]} {s['srcIn']:.2f}–{s['srcOut']:.2f} ({(s['srcOut']-s['srcIn'])/d:.2f}x)"
    txt = []
    if s["chapter"] and s["chapter"] not in seen:
        seen.add(s["chapter"]); txt.append(f"**{s['chapter']} · {chs[s['chapter']]}**")
    if s["callout"]: txt.append(f"“{s['callout']}”")
    fz = " → ".join(f"({f['x']},{f['y']},{f['w']},{f['h']})" for f in s["focus"])
    zn = f"focus {fz}; in: {s['transition']}"
    if s["callTarget"]:
        zn += "; highlight " + " \u2192 ".join(("" if isinstance(s["callTarget"], dict) else f"@{c['at']}:") + f"({c['x']},{c['y']},{c['w']},{c['h']})" for c in _ct_rects(s["callTarget"]))
        if "callWin" in s: zn += f" visible {s['callWin'][0]}\u2013{s['callWin'][1]}"
    if s["clicks"]: zn += "; click rings " + ", ".join(f"t+{c['t']:.2f}s @({c['x']},{c['y']})" for c in s["clicks"])
    L.append(f"| {s['id']} | {s['tIn']:.2f}–{s['tOut']:.2f} | {src} | {sees} | {' '.join(txt) or '—'} | {zn} | {und} | {', '.join(s['sfx']) or '—'} |")
L.append(f"| END | 115.50–120.00 | V1 freeze (e.g. @392.6 activated screen or V3 @70.0 sentiment), heavily blurred; logo crop V1 @13.00 rect (12,12,144,36) | Anchors logo + tagline over blurred real UI | “{END['text']}” | logo scale-in, text fade-up, slow push | Anchors runs the whole influencer campaign | music resolve, final impact, ring-out |")
L.append("\n## Dead time cut (not used)\n")
for x in [
    "V1 10.2–11.7 — spinner (red 4-dot loader) after Create.",
    "V1 11.7–18.6 — re-clicking the name field, idle cursor.",
    "V1 38.6–43.6 — idle cursor after budget entry.",
    "V1 46.2–51.0 — hovering topic chips before first selection.",
    "V1 72–82 — seniority/state dropdown scrolling (redundant), V1 93.5–94.6 idle.",
    "V1 95.6–99.4 — 'View Matched Influencers' button disabled/loading.",
    "V1 103.7–106.6 — modal idle + page load to list.",
    "V1 133.6–175.5 — browsing further cards / second profile overview (content shown already).",
    "V1 183.5–241.5 — remaining past-collab scroll, notes/tags modal (incl. ~4 s save spinner 210–214), manual search with skeleton loading 230–236.",
    "V1 246.5–250 — Save & Continue transition; V1 255–273.6 — 'Regenerate' product skeleton loading (~18 s).",
    "V1 278.8–288.5 — product description editing / scrolling.",
    "V1 299–311.8 — manual brief editor typing (replaced by the AI path).",
    "V1 312.9\u2013319.6 \u2014 first half of the AI progress bar cut; only the last stretch 319.6\u2013326 kept as a 0.8 s glimpse at 8x; V1 326\u2013327.6 modal transition.",
    "V1 340–350.2 — typing a custom guideline, error toast, re-scrolling.",
    "V1 351.4–357 — idle on deliverables page; V1 363–366.2 page transition.",
    "V1 369.8–380.8 — cursor hovering over Pay button.",
    "V1 385.9–388 — payment loader (red dots).",
    "V1 395–398.6 — 'Go to Dashboard' + 'Loading your success story' screen.",
    "V2 0–16 — Collaboration Information accordion (campaign recap, redundant).",
    "V2 22–29.5, 35.5–41.5 — scrolling status cards / long draft text.",
    "V2 45–47.4 — 'Please add your suggestion' error toast; V2 49.8–51.6 UI lag after Continue.",
    "V2 60.4–62.5 — lag before approval modal; V2 76.6–79.9 idle.",
    "V2 81.5–90.9 — empty performance view (no data yet; V3 shows the populated version).",
    "V3 4.5–19, 25–35.2 — expanding rows, Daily/Weekly toggles.",
    "V3 36.4–38.3 — 'Loading data…' for AI report.",
    "V3 53.5–69.8, 85–89.5, 92.5–100, 110.6–115.4, 118.6–155.6, 158–175.2 — tab clicking/scrolling through sections already represented (engaged audience, emotions, comment depth, concerns, Kartik repeat).",
    "V3 181.3–187.2 — switching to Kartik's rating panel (repeat).",
]:
    L.append(f"- {x}")
L.append("\n## Chapters / music structure\n")
L.append("| part | time (s) | chapter (progress indicator) | music note |")
L.append("|---|---|---|---|")
L.append("| Hook | 0.00–5.00 | — | cold open: riser + impact on each payoff flash, beat drops at 5.0 |")
notes = {1: "groove starts, light percussion", 2: "build; impact + chime on match preview (~23.3)", 3: "full groove", 4: "same groove, slight lift",
         5: "riser under AI progress (~49.8), chime at brief reveal (~50.6)", 6: "build to drop at Campaign Activated (~66.4)", 7: "Act 2: new section / variation",
         8: "lighter, quick", 9: "Act 3: final section, fuller", 10: "peak energy; chime on sentiment, resolve toward end"}
for c in chapters:
    L.append(f"| Ch {c['n']} | {c['tIn']:.2f}–{c['tOut']:.2f} | {c['n']} · {c['title']} | {notes[c['n']]} |")
L.append("| End | 115.50–120.00 | — | resolve/outro hit at 115.5, tail to 120 |")
L.append("\n**Act boundaries:** Launch 5.00–70.40 (ch 1–6) · Run 70.40–88.40 (ch 7–8) · Measure 88.40–115.50 (ch 9–10).\n")
L.append("## Logo / URL in footage\n")
L.append("- The Anchors logo (red 4-dot mark + “anchors” wordmark) is visible top-left throughout the V1 campaign builder, e.g. **V1 @13.0 s, rect x=12, y=12, w=144, h=36** (light background, clean). Dark-sidebar version: V1 @398.3 s, rect x=10, y=14, w=130, h=32. Also dimmed behind the modal at V1 0–10 s and on the checkout header (V1 ~366 s, white-on-dark at approx x=20, y=12, w=150, h=36).")
L.append("- The red 4-dot mark alone also appears as the loading spinner (V1 11.0–11.5, 386–387.9; V3 ~180.5) — not used as a logo.")
L.append("- No anchors URL / browser address bar appears in any of the three videos → end card has no URL.\n")
open(OUT + "/script.md", "w").write("\n".join(L) + "\n")
print("written")
