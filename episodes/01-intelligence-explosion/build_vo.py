#!/usr/bin/env python3
"""Cut the George VO parts into the listening-timed master track and write the global timing file.
Usage: python3 build_vo.py <dir with p0..p6.wav>  ->  audio/vo-master.wav, film/timing.json"""
import json, subprocess, sys, os
src = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__))
LEAD = 0.6                       # image first, voice at 0.6 s (scenario-motion)
GAP_AFTER = [2.6, 0.9, 1.1, 3.2, 1.4, 1.2]   # after part i: title card, -, -, fork silence, before solutions, before "your part"
TAIL = 8.0                       # end screen
# extra breath inserted after a word (part, word text, seconds): listening timing
INSERT = [(0, "Again.", 0.7), (2, "real.", 1.0), (4, "authors.", 0.4), (5, "BRAKE", 0)]
NAMES = ["hook", "why", "scenario", "fork", "endings", "solutions", "yourpart"]
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
pieces, words, sections, t = [], [], [], LEAD
pieces.append(("sil", LEAD))
for i in range(7):
    wav = f"{src}/p{i}.wav"; D = dur(wav)
    W = [w for w in json.load(open(f"{here}/audio/vo-part{i}.words.json"))["words"] if w["type"] == "word"]
    cuts = []  # (time in part, extra)
    for p, txt, ex in INSERT:
        if p == i and ex > 0:
            for j, w in enumerate(W[:-1]):
                if w["text"] == txt: cuts.append(((w["end"] + W[j + 1]["start"]) / 2, ex)); break
    sections.append({"id": NAMES[i], "start": round(t, 3)})
    prev, shift = 0.0, 0.0
    for c, ex in sorted(cuts) + [(D, 0)]:
        pieces.append(("seg", wav, prev, c)); 
        for w in W:
            if prev <= w["start"] < c: words.append({"w": w["text"], "s": round(t + shift + w["start"], 3), "e": round(t + shift + w["end"], 3), "part": i})
        if ex: pieces.append(("sil", ex)); shift += ex
        prev = c
    t += D + shift
    sections[-1]["voEnd"] = round(t, 3)
    g = GAP_AFTER[i] if i < 6 else TAIL
    pieces.append(("sil", g)); t += g
    sections[-1]["end"] = round(t, 3)
# render with ffmpeg: build each piece as wav then concat
tmp = f"{here}/audio/_cut"; os.makedirs(tmp, exist_ok=True); lst = []
for k, p in enumerate(pieces):
    f = f"{tmp}/{k:03d}.wav"
    if p[0] == "sil": cmd = ["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(p[1]), f]
    else: cmd = ["ffmpeg", "-y", "-v", "error", "-i", p[1], "-ss", str(p[2]), "-to", str(p[3]), "-ar", "44100", "-ac", "1", f]
    subprocess.check_call(cmd); lst.append(f"file '{f}'")
open(f"{tmp}/list.txt", "w").write("\n".join(lst))
subprocess.check_call(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", f"{here}/audio/vo-master.wav"])
subprocess.check_call(["rm", "-rf", tmp])
total = dur(f"{here}/audio/vo-master.wav")
json.dump({"fps": 30, "duration": round(total, 3), "sections": sections, "words": words}, open(f"{here}/film/timing.json", "w"), indent=0)
print("total", round(total, 2)); [print(s) for s in sections]
