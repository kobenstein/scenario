"""Shot list for episode 01, timed to film/timing.json (global seconds, VO starts at 0.6 s).
Each shot: plate, t0..t1, camera keys (zoom/cx/cy/px/py/dolly as (start, end) eased or [(u, v), ...]),
texts (label/stamp/quote/word/title), hero glows, fog. MG functions draw the motion-design scenes."""
import math
import numpy as np, cv2
from engine import W, H, CREAM, CYAN, AMBER, LAV, INK, ramp, sm, ease, clamp, lerp, hash01, text_sprite, blit, add_glow

DAWN_FOG = (255, 214, 170)
RED = (255, 70, 60)

def S(id, plate, t0, t1, **kw):
    d = {"id": id, "plate": plate, "t0": t0, "t1": t1}; d.update(kw); return d
def L(t, text, sub=None, **kw): d = {"t": t, "text": text, "kind": "label"}; d.update(kw); d["sub"] = sub; return d
def ST(t, text, sub=None, **kw): d = {"t": t, "text": text, "kind": "stamp", "sub": sub}; d.update(kw); return d
def Q(t, text, by=None, **kw): d = {"t": t, "text": text, "kind": "quote", "by": by}; d.update(kw); return d
def WD(t, text, num, **kw): d = {"t": t, "text": text, "kind": "word", "num": num}; d.update(kw); return d

def build():
    return [
    # 1 · Hook
    S("hook", None, 0.0, 21.3, video="render/hook-mt.mp4", xin=0),
    S("desk", "p02", 21.3, 31.9, xin=1.3, cam={"zoom": (1.0, 1.42), "cx": (0.44, 0.47), "cy": (0.47, 0.42)},
      texts=[ST(21.9, "2021", "Daniel Kokotajlo writes down 2026"),
             L(25.2, "Daniel Kokotajlo", "forecaster · later at OpenAI")],
      glows=[{"x": 0.47, "y": 0.42, "r": 260, "c": AMBER, "i": 0.18, "t": 30.3, "in": 1.5}], bloomcol=(255, 210, 160)),
    S("quit", "p03", 31.9, 44.5, cam={"zoom": (1.55, 1.04), "cx": (0.56, 0.5), "cy": (0.68, 0.5), "px": (20, -10)},
      texts=[ST(32.3, "2024", "leaves OpenAI"),
             L(39.0, "Refuses to sign a gag agreement", "about $2 million of his equity at stake")]),
    S("fork", "p04", 44.5, 61.4, cam={"zoom": (1.08, 1.32), "cx": (0.5, 0.52), "cy": (0.52, 0.6)},
      texts=[ST(45.0, "AI 2027", "Kokotajlo + four colleagues · April 2025", size=84)],
      glows=[{"x": 0.3, "y": 0.4, "r": 300, "c": CYAN, "i": 0.18, "t": 51.1},
             {"x": 0.8, "y": 0.35, "r": 340, "c": AMBER, "i": 0.25, "t": 52.7}]),
    # 2 · What has started
    S("city", "p05", 61.4, 77.1, cam={"zoom": (1.05, 1.22), "cx": (0.44, 0.55), "cy": (0.52, 0.56)},
      texts=[L(64.5, "More than half came true", "first three years of his 2021 forecast · graded 2025"),
             L(70.3, "8× code merged per engineer per day", "Anthropic, vs 2024 · company figure", until=76.6, y=H - 300)]),
    S("hall", "p06", 77.1, 85.0, cam={"zoom": (1.0, 1.28), "cx": (0.55, 0.6), "cy": (0.52, 0.56)},
      texts=[L(77.6, "≈3 days of AI research work per human day", "OpenAI, Sep 2026 · company figure")]),
    S("tape", "p07", 85.0, 108.1, mg="tape", cam={"zoom": (1.06, 1.12), "cx": (0.42, 0.62), "cy": 0.45}, fog=0.15, grade=(0.75, 0.75, 0.8),
      texts=[L(85.4, "METR · independent lab", "how long a task AI can finish half the time", y=110)], nolights=True),
    S("lamp", "p08", 108.1, 135.0, cam={"zoom": (1.05, 1.45), "cx": (0.42, 0.3), "cy": (0.55, 0.62)},
      texts=[L(109.5, "Made with help from AI, Claude included", "full disclosure"),
             L(113.6, "Most of these numbers: companies about themselves", "self-reports", until=117.4),
             L(119.8, "Felt faster · measured 19% slower", "METR study of experienced programmers, 2025", until=127.8),
             Q(128.5, "“not inevitable”", "Anthropic, on AI improving itself", y=H * 0.3, until=134.5)]),
    S("runway", "p09", 135.0, 145.2, cam={"zoom": (1.0, 1.3), "cy": (0.5, 0.55)},
      texts=[L(135.4, "Takeoff: the first stage", "people still check the work")],
      glows=[{"x": 0.5, "y": 0.535, "r": 120, "c": RED, "i": 0.55, "t": 140.9, "pulse": 0.35, "hz": 0.8, "d": 0.7}]),
    # 3 · Why this moment matters
    S("sky", "p10", 145.2, 175.5, mg="dayclock", trans="tilt", xin=1.4, cam={"zoom": 1.22, "cy": (0.72, 0.4), "cx": (0.48, 0.55)}, fog=0.1,
      texts=[L(162.8, "Jared Kaplan · chief scientist, Anthropic", "decide by ~2030 whether AI trains its successors", until=171.6),
             Q(172.0, "“maybe the biggest decision yet”", "Jared Kaplan", y=H * 0.78)], nolights=True),
    S("child", "p11", 175.5, 181.9, cam={"zoom": (1.1, 1.3), "cx": (0.3, 0.28), "cy": (0.6, 0.66)},
      texts=[L(176.0, "First grade in 2026", "still in elementary school in 2030")]),
    S("glass", "p12", 181.9, 201.3, cam={"zoom": (1.05, 1.32), "cx": (0.5, 0.53), "cy": (0.55, 0.66)},
      texts=[ST(182.4, "1980", "the Collingridge dilemma", size=84)],
      glows=[{"x": 0.53, "y": 0.71, "r": 200, "c": CYAN, "i": 0.3, "t": 194.2, "in": 2.0, "pulse": 0.2}]),
    S("curves", "p07", 201.3, 218.2, mg="curves", cam={"zoom": (1.1, 1.16), "cx": (0.6, 0.48), "cy": 0.46}, fog=0.1, grade=(0.7, 0.7, 0.75), nolights=True,
      texts=[Q(215.9, "“we don’t understand how models do most of the things they do”", "Anthropic, 2025", y=H * 0.13, size=46, maxw=1500, until=218.0)]),
    S("fogcar", "p14", 218.2, 233.3, cam={"zoom": (1.05, 1.32), "cx": (0.55, 0.62), "cy": (0.58, 0.64)}, fog=0.32,
      glows=[{"x": 0.66, "y": 0.69, "r": 260, "c": (200, 240, 255), "i": 0.25, "t": 225.8, "in": 1.5}]),
    # 4 · The fork
    S("split", "p15", 233.3, 258.3, cam={"zoom": (1.0, 1.3), "cx": 0.5, "cy": (0.55, 0.68)},
      texts=[ST(233.8, "AI 2027", "two endings", size=84),
             L(247.2, "Race", "patch it up, keep racing", x=200, y=H - 330, color=CYAN, until=257.8),
             L(252.8, "Slowdown", "understand it, fix it", x=1280, y=H - 330, color=AMBER, until=257.8)]),
    S("calendar", "p16", 258.3, 275.9, cam={"zoom": (1.05, 1.25), "cx": (0.4, 0.34), "cy": 0.5},
      texts=[L(258.6, "Their own grade, 2026", "reality at about ⅔ of the story’s pace", until=264.3),
             L(264.8, "Late 2027 – mid 2029", "their takeoff, if that pace holds", until=271.2),
             L(271.6, "Closer to 2030", "their more careful model")]),
    S("eye", "p17", 275.9, 288.6, cam={"zoom": (1.0, 1.22), "cx": (0.55, 0.62), "cy": (0.5, 0.52), "px": (10, -10)},
      glows=[{"x": 0.88, "y": 0.35, "r": 380, "c": CYAN, "i": 0.18, "pulse": 0.3, "hz": 0.35}], fog=0.12),
    # 5 · The first test
    S("terrarium", "p18", 288.6, 309.5, cam={"zoom": (1.05, 1.3), "cx": (0.42, 0.33), "cy": (0.58, 0.68)},
      texts=[ST(289.0, "July 2026", "OpenAI · a hacking test", size=84),
             L(298.2, "Reached real systems", "including Hugging Face", until=305.0),
             L(305.5, "Hugging Face spotted it", "OpenAI went public")],
      glows=[{"x": 0.37, "y": 0.64, "r": 120, "c": CYAN, "i": 0.5, "pulse": 0.4, "hz": 1.1, "d": 0.8}]),
    S("switch", "p19", 309.5, 321.4, cam={"zoom": (1.05, 1.2), "cy": (0.45, 0.55)},
      texts=[L(309.9, "Training of its most capable models stopped", "after more incidents · by September 2026")],
      glows=[{"x": 0.335, "y": 0.43, "r": 170, "c": RED, "i": 0.5, "t": 314.9, "pulse": 0.1, "d": 0.8}]),
    S("forkdawn", "p04", 321.4, 334.1, cam={"zoom": (1.3, 1.5), "cx": (0.55, 0.62), "cy": (0.6, 0.5)},
      glows=[{"x": 0.85, "y": 0.33, "r": 420, "c": AMBER, "i": 0.3, "t": 325.2, "in": 2.0}]),
    S("q0", "p20", 334.1, 348.4, cam={"zoom": (1.05, 1.5), "cy": (0.5, 0.45)}, fog=0.3,
      texts=[WD(338.8, "What’s inside?", "Question 1", until=348.2)]),
    # 6 · Four questions
    S("features", "p10", 348.4, 358.0, mg="features", cam={"zoom": 1.3, "cy": (0.4, 0.36)}, grade=(0.45, 0.45, 0.55), fog=0.0, nolights=True,
      texts=[L(348.6, "Millions of “features”", "Anthropic, 2024 · patterns tied to ideas")]),
    S("bridge", "p21", 358.0, 381.7, cam={"zoom": (1.05, 1.25), "cx": (0.42, 0.5), "cy": (0.45, 0.48)},
      texts=[L(358.4, "The Golden Gate feature", "turned up: “effectively obsessed with the bridge”", until=370.2),
             L(373.8, "Neel Nanda · Google DeepMind", "this alone won’t reliably catch a deceptive AI")],
      glows=[{"x": 0.27, "y": 0.4, "r": 380, "c": CYAN, "i": 0.35, "t": 360.4, "in": 1.2, "pulse": 0.2},
             {"x": 0.76, "y": 0.42, "r": 300, "c": CYAN, "i": 0.3, "t": 360.6, "in": 1.2, "pulse": 0.2}]),
    S("team", "p22", 381.7, 405.2, mg="bars", cam={"zoom": (1.0, 1.15), "cy": (0.48, 0.42)}, grade=(0.85, 0.85, 0.9),
      texts=[L(399.6, "On a real production model", "no clear difference yet", until=404.8, y=200)]),
    S("q1", "p20", 405.2, 415.0, cam={"zoom": (1.1, 1.45), "cx": (0.55, 0.5), "cy": (0.5, 0.46)}, fog=0.3,
      texts=[WD(405.4, "Who checks?", "Question 2"),
             L(409.2, "The breach was caught by Hugging Face", "not by the lab", y=H - 260)]),
    S("door", "p23", 415.0, 455.0, cam={"zoom": (1.0, 1.4), "cx": (0.42, 0.44), "cy": (0.55, 0.56)},
      texts=[L(417.9, "A hidden goal, four teams of auditors", "Anthropic test", until=422.7),
             L(423.0, "3 of 4 found it", "the team without the training data missed it", until=428.0),
             ST(428.6, "Oct 2026", "6 METR staff with the same access as Anthropic’s own", size=84, until=443.4),
             L(441.4, "OpenAI says it will match that", "", until=445.6),
             L(446.0, "UK AI Security Institute", "17 days without access to new models · Sep 2026")],
      glows=[{"x": 0.42, "y": 0.5, "r": 420, "c": CYAN, "i": 0.15, "pulse": 0.1}]),
    S("q2", "p20", 455.0, 467.0, cam={"zoom": (1.2, 1.45), "cx": (0.45, 0.52)}, fog=0.3,
      texts=[WD(455.1, "The law?", "Question 3"),
             L(456.9, "California SB 53", "labs must report serious incidents", y=H - 300, until=460.2),
             L(460.6, "“Didn’t meet the bar”", "OpenAI asked lawmakers to tighten it", y=H - 300)]),
    S("plane", "p24", 467.0, 491.5, cam={"zoom": 1.25, "cx": (0.4, 0.58), "cy": (0.4, 0.5)},
      texts=[ST(469.5, "1974", "TWA 514 · near Washington", size=84, until=479.8),
             L(480.3, "Report close calls without getting in trouble", "aviation safety reporting", until=485.0),
             L(485.4, "≈ 40× safer than in the 1970s", "one of several reasons")],
      glows=[{"x": 0.5, "y": 0.22, "r": 90, "c": (255, 240, 220), "i": 0.5, "pulse": 0.6, "hz": 0.9}]),
    S("q3", "p20", 491.5, 502.5, cam={"zoom": (1.3, 1.5), "cx": (0.5, 0.48), "cy": (0.48, 0.44)}, fog=0.3,
      texts=[WD(491.6, "Together?", "Question 4")]),
    S("pace", "p03", 502.5, 513.8, cam={"zoom": (1.1, 1.25), "cx": 0.5, "cy": (0.4, 0.45)}, grade=(0.8, 0.8, 0.85),
      texts=[Q(504.0, "“We must slow the pace at which we improve the capabilities of AI models.”",
               "Dario Amodei, CEO of Anthropic · Sep 2026", size=50, y=H * 0.42, until=513.4)]),
    S("earth", "p25", 513.8, 529.1, cam={"zoom": (1.0, 1.2), "cy": (0.5, 0.6)},
      texts=[ST(515.2, "1985", "a hole in the ozone layer", size=84, until=519.2),
             ST(519.4, "1987", "the Montreal Protocol", size=84, until=522.5),
             L(522.7, "≈ 99% of those chemicals phased out", "the ozone layer is on track to recover")],
      glows=[{"x": 0.5, "y": 0.78, "r": 380, "c": AMBER, "i": 0.25, "t": 522.7, "in": 2.5, "pulse": 0.15, "hz": 0.3}]),
    S("chips", "p26", 529.1, 542.4, cam={"zoom": (1.0, 1.35), "cy": (0.55, 0.62)},
      texts=[L(530.0, "Chips", "countable, and starting to be trackable", until=535.6),
             L(536.0, "New Delhi · nearly 90 countries", "test AI in the languages labs ignore")]),
    S("unfinished", "p08", 542.4, 552.6, cam={"zoom": (1.2, 1.3), "cx": (0.55, 0.62), "cy": 0.45}, grade=(0.8, 0.8, 0.88),
      texts=[L(546.0, "UN General Assembly, Sep 2026", "US government rejects global control of AI")]),
    # 7 · Fair objection
    S("lanterns", "p27", 552.6, 609.5, cam={"zoom": [(0, 1.05), (0.6, 1.18), (1, 1.32)], "cx": [(0, 0.3), (0.3, 0.7), (0.62, 0.5), (1, 0.5)], "cy": (0.6, 0.68)},
      texts=[L(555.4, "Yann LeCun", "“just another engineering problem”", until=564.2, x=130),
             L(564.7, "Arvind Narayanan & Sayash Kapoor", "Princeton · “AI as normal technology”", until=575.8, x=1100),
             L(578.8, "Experts in government · transparency · AI for defenders", "what they propose", until=585.8, x=1100),
             L(586.2, "1,100+ lab employees", "“deliberately pace the frontier”", until=595.6, x=130),
             L(598.9, "People outside the labs who can see inside", "where both camps overlap")],
      glows=[{"x": 0.5, "y": 0.86, "r": 300, "c": AMBER, "i": 0.35, "t": 598.9, "in": 2.0, "pulse": 0.1}]),
    # 8 · 2035, your part
    S("dawn", "p28", 609.5, 615.8, cam={"zoom": (1.05, 1.18), "cy": (0.5, 0.56)}, fogtint=DAWN_FOG, fog=0.15, motecol=(255, 230, 190), bloomcol=(255, 230, 200), bloom=0.4,
      texts=[ST(609.9, "2035", "scenario · same street, early morning", color=INK, subcolor=(90, 70, 110), shadow=False)]),
    S("hospital", "p29", 615.8, 631.2, cam={"zoom": (1.05, 1.22), "cx": (0.6, 0.66), "cy": (0.42, 0.36)}, fogtint=DAWN_FOG, fog=0.15, motecol=(255, 230, 190),
      texts=[ST(615.9, "2035", "scenario", size=60, until=630.8, color=INK, subcolor=(90, 70, 110), shadow=False),
             L(626.8, "Public within days", "every lab learns from it")]),
    S("dawn2", "p28", 631.2, 641.5, cam={"zoom": (1.2, 1.4), "cx": (0.5, 0.48), "cy": (0.7, 0.8)}, fogtint=DAWN_FOG, fog=0.15, motecol=(255, 230, 190),
      texts=[ST(631.3, "2035", "scenario", size=60, until=641.2, color=INK, subcolor=(90, 70, 110), shadow=False)]),
    S("desk2", "p30", 641.5, 652.5, cam={"zoom": (1.05, 1.3), "cx": (0.42, 0.34), "cy": (0.6, 0.7)}, fogtint=DAWN_FOG, fog=0.1, motecol=(255, 230, 190),
      texts=[L(643.4, "He didn’t lose it", "OpenAI dropped the clause after his refusal became public")],
      glows=[{"x": 0.3, "y": 0.75, "r": 260, "c": AMBER, "i": 0.25, "t": 649.2, "in": 1.5}]),
    S("fork3", "p04", 652.5, 659.3, cam={"zoom": (1.1, 1.25), "cx": 0.5, "cy": (0.55, 0.6)}, grade=(1.05, 1.0, 0.95),
      glows=[{"x": 0.85, "y": 0.33, "r": 480, "c": AMBER, "i": 0.35}]),
    S("windows", "p31", 659.3, 677.7, cam={"zoom": (1.05, 1.25), "cx": (0.5, 0.56), "cy": (0.55, 0.62)}, fogtint=DAWN_FOG, fog=0.12, motecol=(255, 230, 190),
      texts=[L(659.5, "Ask who’s checking it", "if AI shows up in your job", until=662.5),
             L(662.8, "Outside testing should be the law", "tell the people who represent you", until=667.3),
             L(667.6, "Up to 77% of Americans", "want it slowed or paused until proven safe · polls 2026")]),
    S("street", "p28", 677.7, 689.2, cam={"zoom": (1.3, 1.1), "cx": (0.48, 0.5), "cy": (0.78, 0.6)}, fogtint=DAWN_FOG, fog=0.15, motecol=(255, 230, 190)),
    S("earth2", "p25", 689.2, 697.1, cam={"zoom": (1.2, 1.05), "cy": (0.62, 0.5)},
      glows=[{"x": 0.5, "y": 0.78, "r": 420, "c": AMBER, "i": 0.35, "pulse": 0.1}]),
    S("plane2", "p24", 697.1, 702.7, cam={"zoom": 1.2, "cx": (0.5, 0.6), "cy": 0.38}),
    S("headlights", "p14", 702.7, 709.9, cam={"zoom": (1.3, 1.05), "cx": (0.62, 0.55), "cy": (0.64, 0.55)}, fog=0.28,
      glows=[{"x": 0.66, "y": 0.69, "r": 340, "c": (220, 245, 255), "i": 0.3, "t": 705.2, "in": 1.5}]),
    S("gold", "p33", 709.9, 734.3, trans="tilt", xin=1.6, cam={"zoom": 1.15, "cy": (0.8, 0.42)}, fogtint=DAWN_FOG, fog=0.08, motecol=(255, 235, 200), nolights=True,
      texts=[{"t": 710.0, "kind": "title", "text": "The future isn’t something that happens to us.", "size": 80, "y": H * 0.36, "until": 733.9, "color": INK, "shadow": False},
             {"t": 712.6, "kind": "title", "text": "It’s something we decide.", "size": 80, "y": H * 0.36 + 100, "color": (122, 59, 23), "until": 733.9, "shadow": False},
             L(715.4, "If an independent tester could check one thing first, what would it be?", "tell me in the comments", y=H - 330, until=722.0),
             L(722.3, "Next: the first day of superintelligence", "what would actually happen?", y=H - 330)]),
    ]

# ---------- motion design ----------
def glowpoly(frame, pts, color, thick=3, glow=0.9, closed=False, dashed=False, alpha=1.0):
    if len(pts) < 2 or alpha <= 0: return
    layer = np.zeros((H // 2, W // 2, 3), np.float32)
    p = (np.array(pts, np.float32) * 2).astype(np.int32)   # half-res with 2 fractional bits -> shift=2 at half scale
    col = [c * alpha for c in color[::-1]]
    if dashed:
        for i in range(0, len(p) - 1, 2): cv2.line(layer, tuple(p[i]), tuple(p[i + 1]), col, max(1, thick // 2), cv2.LINE_AA, 2)
    else: cv2.polylines(layer, [p], closed, col, max(1, thick // 2), cv2.LINE_AA, 2)
    g = cv2.GaussianBlur(layer, (0, 0), 6) * glow * 1.6 + layer
    frame += cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)

def dot(frame, x, y, r, color, inten=1.0):
    cv2.circle(frame, (int(x * 4), int(y * 4)), int(r * 4), [c * inten for c in color[::-1]], -1, cv2.LINE_AA, 2)
    add_glow(frame, x, y, r * 9, color, 0.45 * inten)

def label_at(frame, x, y, text, alpha, color=CREAM, size=26, anchor="cb", font="sans-m"):
    spr = text_sprite(text, font, size, color, spacing=0.04)
    blit(frame, spr, x, y, alpha, anchor)

def mg_tape(frame, sh, t, cam):
    X0, X1, Y = 170, 1750, H * 0.6
    lmax = 5.0
    def X(lg): return X0 + (lg / lmax) * (X1 - X0)
    draw = sm((t - 85.6) / 3.0)
    if draw <= 0: return
    end = X(math.log10(16 * 3600))   # end of their tests
    xr = lerp(X0, end, draw)
    glowpoly(frame, [(X0, Y), (xr, Y)], CREAM, 3, 0.4, alpha=0.9)
    for lg, name in ((0, "1 second"), (math.log10(60), "1 minute"), (math.log10(3600), "1 hour"), (math.log10(16 * 3600), "16 hours")):
        x = X(lg)
        if x > xr + 1: continue
        a = sm((xr - x) / 60 + 0.01)
        cv2.line(frame, (int(x), int(Y - 16)), (int(x), int(Y + 16)), [c * a for c in CREAM[::-1]], 2, cv2.LINE_AA)
        label_at(frame, x, Y + 64, name, a, LAV, 28, "ct")
    for i in range(60):   # minor ticks
        lg = i / 60 * math.log10(16 * 3600); x = X(lg)
        if x < xr: cv2.line(frame, (int(x), int(Y - 6)), (int(x), int(Y + 6)), [90, 90, 110], 1, cv2.LINE_AA)
    # the marker: 2019 seconds -> 2025 two hours -> 2026 >= 16 hours
    keys = [(95.8, math.log10(4), "2019 · a few seconds"), (98.8, math.log10(7200), "2025 · about 2 hours"), (101.3, math.log10(16 * 3600), "2026 · at least 16 hours")]
    if t >= keys[0][0]:
        lg = keys[0][1]; cap = keys[0][2]
        for i in range(1, 3):
            if t >= keys[i][0]:
                k = ease((t - keys[i][0]) / 1.3); lg = lerp(keys[i - 1][1], keys[i][1], k); cap = keys[i][2]
        a = sm((t - 95.8) / 0.6)
        glowpoly(frame, [(X0, Y), (X(lg), Y)], CYAN, 6, 1.0, alpha=a)
        dot(frame, X(lg), Y, 9, CYAN, a)
        label_at(frame, X(lg), Y - 40, cap, a, CREAM, 30, "cb", "sans-sb")
    if t >= 104.2:   # the ruler runs out: dotted line beyond the end of their tests
        k = sm((t - 104.2) / 2.5)
        pts = []
        x = end + 10
        while x < lerp(end, W + 40, k): pts += [(x, Y), (x + 14, Y)]; x += 30
        glowpoly(frame, pts, CYAN, 4, 1.0, dashed=True, alpha=0.9)
        label_at(frame, end + 30, Y + 64, "end of their tests", sm((t - 104.6) / 0.8), CYAN, 24, "lt")

def mg_dayclock(frame, sh, t, cam):
    X0, X1, Y = 160, 1760, H * 0.56
    a = sm((t - 147.8) / 1.6) * (1 - sm((t - 174.8) / 0.7))
    if a <= 0: return
    draw = sm((t - 147.8) / 2.6)
    glowpoly(frame, [(X0, Y), (lerp(X0, X1, draw), Y)], LAV, 3, 0.6, alpha=a)
    for hh in range(25):
        x = X0 + hh / 24 * (X1 - X0)
        if x <= lerp(X0, X1, draw) + 1:
            tl = 12 if hh % 6 == 0 else 6
            cv2.line(frame, (int(x), int(Y - tl)), (int(x), int(Y + tl)), [c * a * 0.8 for c in LAV[::-1]], 1, cv2.LINE_AA)
    label_at(frame, X0, Y + 58, "300,000 years ago", a * draw, LAV, 22, "lt")
    label_at(frame, X1, Y + 58, "today", a * draw, LAV, 22, "rt")
    label_at(frame, W / 2, Y - 70, "the human story as one day", a * draw, CREAM, 30, "cb", "sans-sb")
    if t >= 153.9:   # writing: the last 24 minutes
        k = sm((t - 153.9) / 1.0)
        xw = X1 - 24 / 1440 * (X1 - X0)
        glowpoly(frame, [(xw, Y), (X1, Y)], AMBER, 10, 1.4, alpha=a * k)
        label_at(frame, xw - 10, Y - 26, "writing · the last 24 minutes", a * k, AMBER, 26, "rb")
    if t >= 157.1:   # now -> 2030: the last second
        k = sm((t - 157.1) / 1.2); pulse = 1 + 0.25 * math.sin(t * 5)
        dot(frame, X1, Y, 7 * pulse, CYAN, a * k)
        label_at(frame, X1, Y + 100, "now to 2030 · about the last second", a * sm((t - 160.0) / 0.8), CYAN, 26, "rt", "sans-sb")

def mg_curves(frame, sh, t, cam):
    X0, X1, Yb, Yt = 260, 1660, H * 0.82, H * 0.2
    a = sm((t - 201.6) / 1.0)
    glowpoly(frame, [(X0, Yt - 20), (X0, Yb), (X1 + 40, Yb)], LAV, 2, 0.2, alpha=0.6 * a)
    n = 90
    def cap(x): return x                       # what AI can do: doubling
    def und(x): return 0.08 + 0.32 * x ** 1.3  # what we understand: lagging
    k1 = sm((t - 204.6) / 3.0)
    pts1 = [(lerp(X0, X1, i / n), lerp(Yb, Yt, (2 ** (6 * i / n) - 1) / 63)) for i in range(int(n * k1) + 1)]
    k2 = sm((t - 211.6) / 3.0)
    pts2 = [(lerp(X0, X1, i / n), lerp(Yb, Yt, und(i / n))) for i in range(int(n * k2) + 1)]
    if k2 > 0.1:   # the gap fills with fog
        fill = sm((t - 213.0) / 3.0)
        m = min(len(pts1), len(pts2))
        if m > 2:
            poly = np.array(pts1[:m] + pts2[:m][::-1], np.int32)
            layer = np.zeros((H, W), np.float32); cv2.fillPoly(layer, [poly], 1.0, cv2.LINE_AA)
            layer = cv2.GaussianBlur(layer, (0, 0), 14)[..., None] * 0.22 * fill
            frame[:] = frame + (np.array([230, 220, 190], np.float32) - frame) * layer
    glowpoly(frame, pts1, CYAN, 5, 1.0, alpha=a)
    glowpoly(frame, pts2, AMBER, 5, 1.0, alpha=a)
    if k1 > 0.9: label_at(frame, X1 - 10, Yt - 10, "what AI can do", sm((t - 207.4) / 0.6), CYAN, 28, "rb", "sans-sb")
    if k1 > 0.3: label_at(frame, X0 + 330, Yt + 60, "doubling every few months · METR", sm((t - 207.6) / 0.6) * (1 - sm((t - 215.4) / 0.5)), LAV, 22, "lt")
    if k2 > 0.9: label_at(frame, X1, lerp(Yb, Yt, und(1)) + 46, "how well we understand it", sm((t - 214.6) / 0.6), AMBER, 28, "rt", "sans-sb")

def mg_features(frame, sh, t, cam):
    a = sm((t - 348.5) / 1.2)
    rng = np.random.default_rng(3)
    N = 150
    P = np.stack([W / 2 + rng.normal(0, 380, N), H / 2 + rng.normal(0, 210, N)], 1)
    P[:, 0] += 18 * np.sin(t * 0.3 + np.arange(N)); P[:, 1] += 12 * np.cos(t * 0.27 + np.arange(N) * 1.3)
    layer_pts = []
    for i in range(N):
        d = np.hypot(*(P - P[i]).T); nb = np.argsort(d)[1:3]
        for j in nb:
            if j > i: layer_pts.append((P[i], P[j]))
    layer = np.zeros((H, W, 3), np.float32)
    for p1, p2 in layer_pts: cv2.line(layer, (int(p1[0]), int(p1[1])), (int(p2[0]), int(p2[1])), [c * 0.35 for c in CYAN[::-1]], 1, cv2.LINE_AA)
    frame += layer * a
    hi = 37
    for i in range(N):
        tw = 0.5 + 0.5 * math.sin(t * (1 + hash01(i) * 2) + i)
        dot(frame, P[i, 0], P[i, 1], 2.2, CYAN, a * (0.35 + 0.5 * tw))
    k = sm((t - 354.3) / 1.0)
    dot(frame, P[hi, 0], P[hi, 1], 6 + 5 * k, AMBER, a * k)
    if k > 0: label_at(frame, P[hi, 0], P[hi, 1] - 30, "one idea", k, AMBER, 26, "cb", "sans-sb")

def mg_bars(frame, sh, t, cam):
    x0, w = 520, 880
    rows = [(384.3, "2 researchers · 1 week", 0.23, AMBER, "about ¼ of the gap"), (391.6, "9 AI agents", 0.97, CYAN, "almost all of it")]
    a_all = 1 - sm((t - 399.3) / 0.6)
    for i, (t0, name, v, col, cap) in enumerate(rows):
        if t < t0: continue
        y = H * 0.70 + i * 92
        a = sm((t - t0) / 0.6) * a_all
        k = ease((t - t0 - 0.2) / 1.6)
        cv2.rectangle(frame, (x0, int(y)), (x0 + w, int(y + 22)), [c * 0.25 * a for c in LAV[::-1]], -1, cv2.LINE_AA)
        glowpoly(frame, [(x0, y + 11), (x0 + w * v * k, y + 11)], col, 20, 0.6, alpha=a)
        label_at(frame, x0 - 24, y + 11, name, a, CREAM, 26, "rc", "sans-sb")
        label_at(frame, x0 + w * v * k + 24, y + 11, cap, a * sm((t - t0 - 1.6) / 0.5), col, 24, "lc")
    if t > 394.9 and a_all > 0:
        label_at(frame, W / 2, H * 0.70 - 50, "they also tried to cheat · humans checked the results", sm((t - 394.9) / 0.6) * a_all, LAV, 22, "cb")

MG = {"tape": mg_tape, "dayclock": mg_dayclock, "curves": mg_curves, "features": mg_features, "bars": mg_bars}
