import json, csv, os
OUT="/Users/adityasingh/anchors video/audio-social/stage3"; FPS=30; BEAT=60/112
cues=json.load(open(f"{OUT}/Stage3_cues.json")); META=json.load(open(f"{OUT}/Stage3_master.json"))
rows=[]
music=[(0,"Hook: riser + sub pulses (src 0-2.143), black from 1.607","A: src 0-2.143"),(4,"Cut 1: music slice B starts (kick + pluck E4, src 6.429), 1-beat equal-power crossfade in over beat 3","B: src 6.429-12.857"),
 (16,"Cut 2: music slice C (DIP bar, crest 21.4/22.5 out 10.7/11.8, end chord), 1-beat crossfade from B over beat 15","C: src 19.286-60.0"),(20,"Crest: full groove","C"),(26,"Melody resolves on Am at the 2,80,000 lock","C"),(84,"End card chord Am(add9)","C"),(88,"Chord moves to C, decays to silence","C")]
for b,ev,sl in music: rows.append((b*BEAT,"MUSIC","-","music",ev+f" [{sl}]",""))
for c in cues:
    f=os.path.basename(c["file"])[:-4]
    why=c.get("why") or ("v5 cue, src %.3f s -> out %.3f s (%s)"%(c["src"],c["time"],{"A":"unchanged","B":"src-4.286","C":"src-10.714"}[c["part"]]))
    if f=="tile-tick" and c["kind"]=="hop": pass
    rows.append((c["time"],"SFX",c.get("tier") or ("T1" if any(k in f for k in("lock-glass","impact","smash","sub-hit","title-thump","counter-ramp","bubble","riser","logo","glass-tail")) else "T2"),f,why,round(c["volume"],3)))
rows.sort(key=lambda r:r[0])
with open(f"{OUT}/Stage3_cue_sheet.csv","w",newline="") as fh:
    w=csv.writer(fh); w.writerow(["time_s","frame_30fps","beat","kind","tier","cue","gain","note","pan"])
    pans={}
    for t,k,ti,cu,note,g in rows: w.writerow(["%.3f"%t,"%.1f"%(t*FPS),"%.2f"%(t/BEAT),k,ti,cu,g,note,""])
with open(f"{OUT}/Stage3_cue_sheet.md","w") as fh:
    fh.write("# Stage 3 cue sheet (23 bars, 112 BPM, 49.286 s grid, 49.300 s file = 1479 f @30)\n\nGain = cue volume before the SFX bus (x0.85) and master (G %.2f dB, limiter %.4f). Music ducks per audio-B v5 rules, plus -6 dB for the freeze length at both locks.\n\n"%(META["G"],META["limit"]))
    fh.write("| time s | frame | beat | kind | tier | cue | gain | note |\n|---|---|---|---|---|---|---|---|\n")
    for t,k,ti,cu,note,g in rows: fh.write(f"| {t:.3f} | {t*FPS:.1f} | {t/BEAT:.2f} | {k} | {ti} | {cu} | {g} | {note} |\n")
print(len(rows),"rows")
