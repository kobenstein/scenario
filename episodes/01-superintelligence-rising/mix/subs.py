"""Phrase-chunked subtitles from film/timing.json: subs.srt for YouTube, subs.ass for the burn-in."""
import json, pathlib
EP = pathlib.Path(__file__).resolve().parent.parent
words = json.load(open(EP / "film" / "timing.json"))["words"]
MAXC = 42

# clauses: break at sentence ends, pauses, parts, and commas once a clause has some length
clauses, cur = [], []
for w in words:
    if cur:
        gap = w["s"] - cur[-1]["e"]
        text = " ".join(x["w"] for x in cur)
        if gap > 0.45 or w["part"] != cur[-1]["part"] or text[-1] in ".?!" or (text[-1] in ",;:—" and len(text) > 14):
            clauses.append(cur); cur = []
    cur.append(w)
clauses.append(cur)
WEAK = {"the", "a", "an", "of", "to", "and", "its", "by", "in", "on", "for", "at", "is", "that", "with", "or", "but", "your", "our", "their", "it's"}
def split(ws):
    text = " ".join(w["w"] for w in ws)
    if len(text) <= MAXC: return [ws]
    n = -(-len(text) // MAXC); best = None
    # choose the cut that balances lengths and avoids ending on a weak word
    for i in range(1, len(ws)):
        a = " ".join(w["w"] for w in ws[:i]); b = " ".join(w["w"] for w in ws[i:])
        cost = abs(len(a) - len(text) / n) + (12 if ws[i-1]["w"].lower() in WEAK else 0) - (6 if a[-1] in ",;:—" else 0)
        if len(a) <= MAXC and (best is None or cost < best[0]): best = (cost, i)
    i = best[1] if best else len(ws) // 2
    return [ws[:i]] + split(ws[i:])
cues = []
for c in clauses:
    for ws in split(c): cues.append([ws[0]["s"], ws[-1]["e"], " ".join(w["w"] for w in ws)])
# hold each cue a little after the last word, never into the next one
for i, c in enumerate(cues):
    nxt = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
    c[1] = min(max(c[1] + 0.35, c[0] + 1.0), nxt - 0.04)

def ts(t, sep):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}".replace(".", sep) if sep == "," else f"{int(h)}:{int(m):02d}:{s:05.2f}"
with open(EP / "mix" / "subs.srt", "w") as f:
    for i, (a, b, t) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a, ',')} --> {ts(b, ',')}\n{t}\n\n")
ass = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Medium,44,&H00E2EFF3,&H00E2EFF3,&H66180E0A,&H66180E0A,0,0,0,0,100,100,0.5,0,1,2.2,0.8,2,120,120,64,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(EP / "mix" / "subs.ass", "w") as f:
    f.write(ass)
    for a, b, t in cues:
        f.write(f"Dialogue: 0,{ts(a,'.')},{ts(b,'.')},Sub,,0,0,0,,{t}\n")
print(len(cues), "cues")
