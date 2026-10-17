#!/usr/bin/env python3
"""Plain burned-in English subtitles for Scenario, built from the cut VO word timings (film/timing.json).

Usage: python3 subs.py [timing.json] [out_basename]
Writes <out>.ass and <out>.srt, plus fonts/Inter-Regular.ttf (from the repo's woff2) for libass.
Style: Inter 34 px, cream #f3efe2 at 85 %, no box, soft shadow, centred, 70 px from the bottom,
120 ms fades, phrases of max ~6 words split at punctuation.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
WORDS = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "film", "timing.json")
OUT = sys.argv[2] if len(sys.argv) > 2 else "/mnt/project-files/scenario/folge-01/folge-01"
OFFSET = 0.0  # timing.json is already global
MAX_WORDS, GAP_BREAK, HOLD = 6, 0.45, 0.25
FONT_DIR = os.path.join(HERE, "fonts")


def font():
    ttf = os.path.join(FONT_DIR, "Inter-Regular.ttf")
    if not os.path.exists(ttf):
        from fontTools.ttLib import TTFont
        os.makedirs(FONT_DIR, exist_ok=True)
        f = TTFont(os.path.join(HERE, "film", "assets", "Inter-400-normal.woff2"))
        f.flavor = None
        f.save(ttf)
    return FONT_DIR


def phrases(words):
    # 1) clauses: break at punctuation or a pause in the VO
    clauses, cur = [], []
    words = [(re.sub(r"\[[^\]]*\]", "", w).strip(), s, e) for w, s, e in words]  # drop [softly], [pause] ...
    words = [x for x in words if x[0]]
    for i, (w, s, e) in enumerate(words):
        cur.append((w, s, e))
        nxt = words[i + 1][1] if i + 1 < len(words) else None
        if re.search(r"[.!?;:,\u2026]+[\"')]*$", w) or nxt is None or nxt - e > GAP_BREAK:
            clauses.append(cur)
            cur = []
    # 2) long clauses: split into evenly sized chunks of at most MAX_WORDS
    merged = []
    for c in clauses:
        parts = -(-len(c) // MAX_WORDS)
        size = -(-len(c) // parts)
        merged += [c[i:i + size] for i in range(0, len(c), size)]
    lines = []
    for k, p in enumerate(merged):
        start = p[0][1] + OFFSET
        end = p[-1][2] + OFFSET + HOLD
        if k + 1 < len(merged):
            end = min(end, merged[k + 1][0][1] + OFFSET - 0.02)
        text = " ".join(w for w, _, _ in p).rstrip(",;:")
        text = re.sub(r"\.\.\.$", "…", text)
        lines.append((start, end, text))
    return lines


def ts_ass(t):
    cs = int(round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def ts_srt(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    lines = phrases([(w["w"], w["s"], w["e"]) for w in json.load(open(WORDS))["words"]])
    font()
    # Colours are &HAABBGGRR; cream f3efe2 at 85 % opacity -> alpha 0x26.
    # Two layers: a blurred, slightly offset dark copy as the soft shadow, then the crisp cream text.
    ass = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080",
        "WrapStyle: 2", "ScaledBorderAndShadow: yes", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, "
        "Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, "
        "MarginL, MarginR, MarginV, Encoding",
        "Style: Sub,Inter,34,&H26E2EFF3,&H26E2EFF3,&HFF000000,&HFF000000,0,0,0,0,100,100,0.3,0,1,0,0,2,80,80,70,1",
        "Style: Shade,Inter,34,&H9A0A0705,&H9A0A0705,&HFF000000,&HFF000000,0,0,0,0,100,100,0.3,0,1,0,0,2,84,80,68,1",
        "", "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    srt = []
    for n, (s, e, t) in enumerate(lines, 1):
        ass.append(f"Dialogue: 0,{ts_ass(s)},{ts_ass(e)},Shade,,0,0,0,,{{\\fad(120,120)\\blur6}}{t}")
        ass.append(f"Dialogue: 1,{ts_ass(s)},{ts_ass(e)},Sub,,0,0,0,,{{\\fad(120,120)}}{t}")
        srt += [str(n), f"{ts_srt(s)} --> {ts_srt(e)}", t, ""]
    open(OUT + ".ass", "w").write("\n".join(ass) + "\n")
    open(OUT + ".srt", "w").write("\n".join(srt))
    for s, e, t in lines:
        print(f"{s:6.2f}-{e:6.2f}  {t}")
    print(OUT + ".ass", OUT + ".srt", "fonts:", FONT_DIR)


if __name__ == "__main__":
    main()
