#!/usr/bin/env python3
"""Join the 8 George VO parts into the master track and write film/timing.json.
Word times come from speech-to-text (audio/vo-p*.words.json); word text comes from vo.txt (aligned), so subtitles spell names right.
Usage: python3 build_vo.py  ->  audio/vo-master.wav, film/timing.json"""
import json, subprocess, os, re, difflib
here = os.path.dirname(os.path.abspath(__file__))
LEAD = 0.6
GAP_AFTER = [1.2, 1.0, 1.0, 2.6, 1.2, 1.2, 1.4, 7.0]   # last = end screen
NAMES = ["hook", "started", "moment", "fork", "test", "questions", "objection", "future"]
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
parts = [re.sub(r"\[[^\]]*\]", " ", p).split() for p in open(f"{here}/vo.txt").read().strip().split("\n\n")]
assert len(parts) == 8, len(parts)
words, sections, t = [], [], LEAD
lst = []
tmp = f"{here}/audio/_cut"; os.makedirs(tmp, exist_ok=True)
def sil(sec, k):
    f = f"{tmp}/s{k}.wav"; subprocess.check_call(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(sec), f]); lst.append(f"file '{f}'")
sil(LEAD, "lead")
for i in range(8):
    mp3 = f"{here}/audio/vo-p{i}.mp3"; D = dur(mp3)
    f = f"{tmp}/p{i}.wav"; subprocess.check_call(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ar", "44100", "-ac", "1", f]); lst.append(f"file '{f}'")
    W = json.load(open(f"{here}/audio/vo-p{i}.words.json"))["words"]
    S = parts[i]
    sm = difflib.SequenceMatcher(None, [norm(w["text"]) for w in W], [norm(s) for s in S], autojunk=False)
    txt = [w["text"] for w in W]
    for tag, a0, a1, b0, b1 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and a1 - a0 == b1 - b0):
            for k in range(a1 - a0): txt[a0 + k] = S[b0 + k]
        elif tag == "replace":   # different counts: put the script words on the first STT word, blank the rest
            txt[a0] = " ".join(S[b0:b1])
            for k in range(a0 + 1, a1): txt[k] = ""
    for w, x in zip(W, txt):
        if x: words.append({"w": x, "s": round(t + w["start"], 3), "e": round(t + w["end"], 3), "part": i})
    sections.append({"id": NAMES[i], "start": round(t - (LEAD if i == 0 else 0), 3), "vo": round(t, 3), "voEnd": round(t + D, 3)})
    t += D
    sil(GAP_AFTER[i], i); t += GAP_AFTER[i]
    sections[-1]["end"] = round(t, 3)
open(f"{tmp}/list.txt", "w").write("\n".join(lst))
subprocess.check_call(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", f"{here}/audio/vo-master.wav"])
subprocess.check_call(["rm", "-rf", tmp])
total = dur(f"{here}/audio/vo-master.wav")
json.dump({"fps": 30, "duration": round(total, 3), "sections": sections, "words": words}, open(f"{here}/film/timing.json", "w"), indent=0)
print("total", round(total, 2)); [print(s) for s in sections]
