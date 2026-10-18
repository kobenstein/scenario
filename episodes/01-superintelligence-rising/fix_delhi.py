#!/usr/bin/env python3
"""One-off fact-check fix (2026-10-18): replace the New Delhi line at 8:55 in the VO master and timing.json.
The new line is ~0.75 s longer, so the two sentences after it move later by SHIFT; everything from 552 s on stays put.
Run once on the pre-fix master: python3 fix_delhi.py"""
import json, subprocess, re, numpy as np, os
here = os.path.dirname(os.path.abspath(__file__)); SR = 48000
NEW = "In New Delhi, nearly ninety countries signed a declaration, and the labs promised to test in neglected languages."
AT, SHIFT, TEMPO = 535.83, 0.75, 1.06
OLD_END, MOVE0, MOVE1 = 541.90, 542.20, 551.40   # old line ends 541.65; "None of this…AI." spans 542.33–550.99
rd = lambda f, af="": np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", f] + (["-af", af] if af else []) + ["-ar", str(SR), "-ac", "1", "-f", "f32le", "-"]), np.float32).copy()
m = rd(f"{here}/audio/vo-master.wav")
new = rd(f"{here}/audio/delhi-b.mp3", f"atempo={TEMPO}")
S = lambda t: int(round(t * SR))
rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-3] ** 2))
new *= rms(m[S(AT):S(541.65)]) / rms(new)          # match the old line's speech level
moved = m[S(MOVE0):S(MOVE1)].copy()
m[S(AT) - 1000:S(MOVE1 + SHIFT)] = 0
m[S(AT):S(AT) + len(new)] = new
m[S(MOVE0 + SHIFT):S(MOVE0 + SHIFT) + len(moved)] = moved
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", f"{here}/audio/vo-master.wav"], input=m.tobytes(), check=True)
# timing: new words spread by letters over the two spoken phrases (pause after "declaration,"), later words shifted
d = json.load(open(f"{here}/film/timing.json")); W = d["words"]
i0 = next(i for i, w in enumerate(W) if w["w"] == "In" and abs(w["s"] - AT) < 0.3)
i1 = next(i for i, w in enumerate(W) if w["w"] == "ignore." and w["s"] > AT)
part = W[i0]["part"]
toks = NEW.split(); cut = toks.index("declaration,") + 1
def spread(ts, a, b):
    L = sum(len(x) + 1 for x in ts); t, out = a, []
    for x in ts: dt = (b - a) * (len(x) + 1) / L; out.append({"w": x, "s": round(t, 3), "e": round(t + dt - 0.04, 3), "part": part}); t += dt
    return out
new_words = spread(toks[:cut], AT + 0.05 / TEMPO, AT + 3.70 / TEMPO) + spread(toks[cut:], AT + 4.01 / TEMPO, AT + 7.09 / TEMPO)
for w in W[i1 + 1:]:
    if MOVE0 <= w["s"] < MOVE1: w["s"] = round(w["s"] + SHIFT, 3); w["e"] = round(w["e"] + SHIFT, 3)
d["words"] = W[:i0] + new_words + W[i1 + 1:]
json.dump(d, open(f"{here}/film/timing.json", "w"), indent=0)
print(new_words[0], new_words[-1], len(new) / SR)
