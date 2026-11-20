#!/usr/bin/env python3
"""Scenario 2.5D plate engine: AI-illustrated plates + depth maps -> animated film frames.
Every shot gets a depth-parallax camera (push, drift, crane), breathing lights, drifting fog, dust motes,
film grain and typography. Motion-design scenes draw on top with OpenCV. Deterministic: frame(t) only.
Usage: python3 engine.py --from 0 --to 100 --out part.mp4   (seconds of the film timeline)"""
import argparse, json, math, os, subprocess, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

cv2.setNumThreads(1)
HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(HERE)
W, H, FPS = 1920, 1080, 30
CREAM = (243, 239, 226); CYAN = (143, 230, 255); AMBER = (255, 179, 92); LAV = (196, 192, 224); INK = (26, 22, 54)
FONT = {k: os.path.join(EP, "fonts", f) for k, f in
        {"serif": "InstrumentSerif-Regular.ttf", "serif-i": "InstrumentSerif-Italic.ttf",
         "sans": "Inter-Regular.otf", "sans-m": "Inter-Medium.otf", "sans-sb": "Inter-SemiBold.otf"}.items()}

def clamp(x, a=0.0, b=1.0): return a if x < a else b if x > b else x
def sm(x): x = clamp(x); return x * x * (3 - 2 * x)
def ease(x): x = clamp(x); return 0.5 - 0.5 * math.cos(math.pi * x)
def ramp(t, a, b): return sm((t - a) / (b - a)) if b > a else float(t >= a)
def lerp(a, b, k): return a + (b - a) * k
def hash01(*a):
    h = 2166136261
    for v in a:
        for ch in str(v).encode(): h = ((h ^ ch) * 16777619) & 0xffffffff
    return h / 0xffffffff

# ---------- shared precomputed layers ----------
UU, VV = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
_vig = None; _grain = None; _fog = None
def vignette():
    global _vig
    if _vig is None:
        d = np.sqrt(((UU - W / 2) / (W / 2)) ** 2 + ((VV - H / 2) / (H / 2)) ** 2)
        _vig = (1 - 0.38 * np.clip(d - 0.45, 0, 1) ** 1.6)[..., None].astype(np.float32)
    return _vig
def grain(i):
    global _grain
    if _grain is None:
        rng = np.random.default_rng(7)
        _grain = [cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 0.6) for _ in range(6)]
    return _grain[i % 6]
def fog_tex():
    global _fog
    if _fog is None:
        rng = np.random.default_rng(11); acc = np.zeros((540, 960), np.float32)
        for s, a in ((180, 0.55), (90, 0.3), (40, 0.15)):
            n = rng.random((540 // 6 + 2, 960 // 6 + 2)).astype(np.float32)
            n = cv2.resize(n, (960 * 2, 540 * 2), interpolation=cv2.INTER_CUBIC)[:540, :960]
            acc += cv2.GaussianBlur(n, (0, 0), s / 6) * a
        acc = (acc - acc.min()) / (acc.max() - acc.min())
        _fog = np.tile(acc, (1, 2))   # wraps horizontally
    return _fog
_glow_sprite = None
def glow_sprite(n):
    g = np.exp(-((np.linspace(-1, 1, n)[None, :] ** 2 + np.linspace(-1, 1, n)[:, None] ** 2) * 5.0)).astype(np.float32)
    return g

# ---------- plates ----------
_cache = {}
def plate(name):
    if name in _cache: return _cache[name]
    if len(_cache) > 6: _cache.pop(next(iter(_cache)))
    img = cv2.imread(os.path.join(HERE, "plates", f"{name}.png"), cv2.IMREAD_COLOR)
    dp = cv2.imread(os.path.join(HERE, "plates", "d" + name[1:] + ".png"), cv2.IMREAD_GRAYSCALE)
    dp = cv2.resize(dp, (img.shape[1], img.shape[0])).astype(np.float32) / 255.0
    dp = cv2.GaussianBlur(dp, (0, 0), 6)
    # find light sources: bright local maxima of a blurred luminance map
    small = cv2.resize(img, (img.shape[1] // 8, img.shape[0] // 8), interpolation=cv2.INTER_AREA).astype(np.float32)
    lum = cv2.GaussianBlur(small.max(axis=2), (0, 0), 2)
    mx = cv2.dilate(lum, np.ones((9, 9), np.uint8))
    ys, xs = np.where((lum == mx) & (lum > max(150, np.percentile(lum, 99.3))))
    pts = sorted(zip(lum[ys, xs], xs, ys), reverse=True)[:7]
    lights = []
    for k, (v, x, y) in enumerate(pts):
        c = small[max(0, y - 2):y + 3, max(0, x - 2):x + 3].reshape(-1, 3).mean(0)
        lights.append({"x": x * 8 + 4, "y": y * 8 + 4, "c": (float(c[0]), float(c[1]), float(c[2])), "d": float(dp[min(y * 8, dp.shape[0] - 1), min(x * 8, dp.shape[1] - 1)]),
                       "f": 0.18 + 0.5 * hash01(name, k), "ph": 6.28 * hash01(name, k, "p"), "a": 0.10 + 0.14 * hash01(name, k, "a")})
    p = {"img": img, "depth": dp, "lights": lights, "h": img.shape[0], "w": img.shape[1],
         "tint": img.reshape(-1, 3).mean(0).astype(np.float32)}
    _cache[name] = p
    return p

def kv(v, u):
    """value at normalized shot time u: number, (a,b) eased, or [(u,val),...] keyframes"""
    if isinstance(v, (int, float)): return float(v)
    if isinstance(v, tuple): return lerp(v[0], v[1], ease(u))
    for i in range(len(v) - 1):
        if u <= v[i + 1][0]:
            k = (u - v[i][0]) / max(1e-6, v[i + 1][0] - v[i][0]); return lerp(v[i][1], v[i + 1][1], ease(k))
    return v[-1][1]

def render_plate(sh, t):
    """shot sh at global time t -> float32 BGR frame (0..255) plus the camera mapping for overlays"""
    p = plate(sh["plate"]); cam = sh.get("cam", {})
    u = clamp((t - sh["t0"]) / max(1e-3, sh["t1"] - sh["t0"]))
    s0 = max(W / p["w"], H / p["h"])
    zoom = kv(cam.get("zoom", (1.06, 1.14)), u)
    cx = kv(cam.get("cx", 0.5), u) * p["w"]; cy = kv(cam.get("cy", 0.5), u) * p["h"]
    # nothing ever stops: slow multi-sine drift
    seed = hash01(sh["id"]) * 50
    cx += (math.sin(t * 0.23 + seed) * 6 + math.sin(t * 0.111 + seed * 2) * 9) / (s0 * zoom)
    cy += (math.sin(t * 0.19 + seed * 3) * 4 + math.sin(t * 0.083 + seed) * 6) / (s0 * zoom)
    S = s0 * zoom
    # keep inside the plate
    hw, hh = W / 2 / S, H / 2 / S
    cx = clamp(cx, hw + 2, p["w"] - hw - 2); cy = clamp(cy, hh + 2, p["h"] - hh - 2)
    parx = kv(cam.get("px", (-14, 14)), u); pary = kv(cam.get("py", 0), u); dolly = kv(cam.get("dolly", 0.02), u)
    X0 = (UU - W / 2) * (1 / S) + cx; Y0 = (VV - H / 2) * (1 / S) + cy
    D = cv2.remap(p["depth"], X0, Y0, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT) - 0.5
    k = 1.0 / (1 + dolly * D)
    X = cx + (X0 - cx) * k - parx * D / S
    Y = cy + (Y0 - cy) * k - pary * D / S
    frame = cv2.remap(p["img"], X, Y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32)
    def to_screen(x, y, d):
        dd = d - 0.5; kk = 1 + dolly * dd
        x0 = cx + (x + parx * dd / S - cx) * kk; y0 = cy + (y + pary * dd / S - cy) * kk
        return (x0 - cx) * S + W / 2, (y0 - cy) * S + H / 2
    return frame, {"to_screen": to_screen, "S": S, "p": p, "u": u}

def add_glow(frame, x, y, r, color, inten):
    if inten <= 0.002 or r < 2: return
    n = int(r * 2) | 1
    x0, y0 = int(x - n // 2), int(y - n // 2)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + n), min(H, y0 + n)
    if xa >= xb or ya >= yb: return
    g = glow_sprite(n)[ya - y0:yb - y0, xa - x0:xb - x0]
    frame[ya:yb, xa:xb] += g[..., None] * (np.array(color[::-1], np.float32) * inten)[None, None, :]

def lights_breathe(frame, sh, cam, t):
    if sh.get("nolights"): return
    for L in cam["p"]["lights"]:
        x, y = cam["to_screen"](L["x"], L["y"], L["d"])
        flick = 0.5 + 0.5 * math.sin(t * L["f"] * 6.28 + L["ph"]) + 0.15 * math.sin(t * 7.3 + L["ph"] * 3)
        bgr = L["c"]; rgb = (bgr[2], bgr[1], bgr[0])
        add_glow(frame, x, y, 70 * cam["S"] / 0.7, rgb, L["a"] * (0.35 + 0.65 * flick) * 0.6)

def fog(frame, sh, t, strength):
    if strength <= 0: return
    f = fog_tex(); off = (t * 9 + hash01(sh["id"]) * 900) % 960
    x0 = int(off); a = f[:, x0:x0 + 960]
    off2 = (t * 4 + 300) % 960; b = f[::-1, int(off2):int(off2) + 960]
    m = cv2.resize((a * 0.6 + b * 0.4), (W, H), interpolation=cv2.INTER_LINEAR)
    band = sh.get("fogband", (0.35, 0.95))
    vert = np.clip(1 - np.abs(np.linspace(0, 1, H, dtype=np.float32) - (band[0] + band[1]) / 2) / ((band[1] - band[0]) / 2 + 1e-3), 0, 1)[:, None]
    tint = np.array(sh.get("fogtint", (120, 190, 220))[::-1], np.float32)
    alpha = (m * vert * strength)[..., None]
    frame[:] = frame + (tint[None, None, :] - frame) * alpha * 0.55

def motes(frame, sh, t, n=50):
    if sh.get("nomotes"): return
    col = np.array(sh.get("motecol", (200, 235, 255))[::-1], np.float32)
    for i in range(n):
        hx, hy, hs = hash01(sh["id"], i, "x"), hash01(sh["id"], i, "y"), hash01(sh["id"], i, "s")
        x = (hx * W + t * (8 + 18 * hs) + 40 * math.sin(t * 0.3 + i)) % W
        y = (hy * H - t * (3 + 9 * hs) + 25 * math.sin(t * 0.21 + i * 1.7)) % H
        a = 0.25 + 0.5 * (0.5 + 0.5 * math.sin(t * (0.6 + hs) + i))
        cv2.circle(frame, (int(x * 4), int(y * 4)), int(4 + 6 * hs), (col * a * 0.7).tolist(), -1, cv2.LINE_AA, 2)

# ---------- typography ----------
_txt = {}
def text_sprite(txt, font="sans-m", size=30, color=CREAM, spacing=0.0, upper=False, shadow=True, maxw=None):
    key = (txt, font, size, color, spacing, upper, maxw)
    if key in _txt: return _txt[key]
    if upper: txt = txt.upper()
    f = ImageFont.truetype(FONT[font], size)
    lines = txt.split("\n")
    def wid(s): return sum(f.getlength(ch) + spacing * size for ch in s) - spacing * size if spacing else f.getlength(s)
    if maxw:
        out = []
        for ln in lines:
            cur = ""
            for w_ in ln.split(" "):
                tst = (cur + " " + w_).strip()
                if wid(tst) > maxw and cur: out.append(cur); cur = w_
                else: cur = tst
            out.append(cur)
        lines = out
    asc, desc = f.getmetrics(); lh = int((asc + desc) * 1.12)
    tw = int(max(wid(l) for l in lines)) + 40; th = lh * len(lines) + 40
    im = Image.new("RGBA", (tw, th), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for li, ln in enumerate(lines):
        x = 20; y = 20 + li * lh
        if spacing:
            for ch in ln: d.text((x, y), ch, font=f, fill=color + (255,)); x += f.getlength(ch) + spacing * size
        else: d.text((x, y), ln, font=f, fill=color + (255,))
    arr = np.array(im).astype(np.float32) / 255.0
    if shadow:   # soft dark halo for legibility on light plates
        a = np.clip(cv2.GaussianBlur(arr[..., 3], (0, 0), size * 0.3) * 1.1, 0, 0.78)
        sh = np.zeros_like(arr); sh[..., 3] = a
        out = sh.copy(); A = arr[..., 3:4]
        out[..., :3] = arr[..., :3] * A; out[..., 3] = arr[..., 3] + a * (1 - arr[..., 3])
        rgb = np.where(out[..., 3:4] > 0, out[..., :3] / np.maximum(out[..., 3:4], 1e-4), 0)
        arr = np.concatenate([rgb, out[..., 3:4]], axis=2)
    _txt[key] = arr
    return arr

def blit(frame, spr, x, y, alpha, anchor="lt"):
    if alpha <= 0.003: return
    h, w = spr.shape[:2]
    if anchor[0] == "c": x -= w / 2
    elif anchor[0] == "r": x -= w
    if anchor[1] == "c": y -= h / 2
    elif anchor[1] == "b": y -= h
    x, y = int(round(x)), int(round(y))
    xa, ya, xb, yb = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if xa >= xb or ya >= yb: return
    s = spr[ya - y:yb - y, xa - x:xb - x]
    a = s[..., 3:4] * alpha
    rgb = s[..., 2::-1] * 255.0
    frame[ya:yb, xa:xb] = frame[ya:yb, xa:xb] * (1 - a) + rgb * a

def draw_texts(frame, sh, t):
    for tx in sh.get("texts", []):
        t0 = tx["t"]; t1 = tx.get("until", sh["t1"] - 0.3)
        a = ramp(t, t0, t0 + 0.7) * (1 - ramp(t, t1 - 0.5, t1))
        if a <= 0: continue
        kind = tx.get("kind", "label")
        rise = (1 - sm((t - t0) / 0.9)) * 14
        if kind == "stamp":      # big serif number/year, top-left, with small caption
            spr = text_sprite(tx["text"], "serif", tx.get("size", 92), tx.get("color", CREAM), shadow=tx.get("shadow", True))
            x, y = tx.get("x", 92), tx.get("y", 64)
            blit(frame, spr, x, y + rise, a)
            if tx.get("sub"):
                s2 = text_sprite(tx["sub"], "sans-m", 26, tx.get("subcolor", LAV), spacing=0.26, upper=True, shadow=tx.get("shadow", True))
                blit(frame, s2, x + 4, y + spr.shape[0] - 26 + rise, a)
        elif kind == "quote":
            spr = text_sprite(tx["text"], "serif-i", tx.get("size", 54), tx.get("color", CREAM), maxw=tx.get("maxw", 1300))
            blit(frame, spr, tx.get("x", W / 2), tx.get("y", H * 0.36) + rise, a, tx.get("anchor", "cc"))
            if tx.get("by"):
                s2 = text_sprite(tx["by"], "sans-m", 24, LAV, spacing=0.24, upper=True)
                blit(frame, s2, tx.get("x", W / 2), tx.get("y", H * 0.36) + spr.shape[0] / 2 + 8 + rise, a, "ct")
        elif kind == "title":
            spr = text_sprite(tx["text"], tx.get("font", "serif"), tx.get("size", 120), tx.get("color", CREAM), maxw=tx.get("maxw", 1600), shadow=tx.get("shadow", True))
            blit(frame, spr, tx.get("x", W / 2), tx.get("y", H / 2) + rise, a, tx.get("anchor", "cc"))
        elif kind == "word":     # question word written in light on the fog
            spr = text_sprite(tx["text"], "serif", tx.get("size", 150), AMBER, shadow=False)
            k = ramp(t, t0, t0 + 1.2); grow = 1 + 0.06 * (t - t0)
            if grow != 1:
                spr2 = cv2.resize(spr, None, fx=grow, fy=grow, interpolation=cv2.INTER_LINEAR)
            else: spr2 = spr
            blit(frame, spr2, tx.get("x", W / 2), tx.get("y", H * 0.42), a * k, "cc")
            blur = cv2.GaussianBlur(spr2, (0, 0), 18); blur[..., 3] *= 0.9
            blit(frame, blur, tx.get("x", W / 2), tx.get("y", H * 0.42), a * k * 0.8, "cc")
            if tx.get("num"):
                s2 = text_sprite(tx["num"], "sans-m", 24, CREAM, spacing=0.32, upper=True)
                blit(frame, s2, tx.get("x", W / 2), tx.get("y", H * 0.42) - spr2.shape[0] / 2 - 10, a * k, "cb")
        else:                    # label: line + two-line label, lower left
            x, y = tx.get("x", 96), tx.get("y", H - 300)
            s1 = text_sprite(tx["text"], "sans-sb", tx.get("size", 38), tx.get("color", CREAM), spacing=0.03, maxw=tx.get("maxw", 1300))
            wipe = sm((t - t0) / 0.8)
            ln = int(56 * wipe)
            if ln > 1: cv2.line(frame, (int(x), int(y + rise)), (int(x + ln), int(y + rise)), [c * a for c in tx.get("color", AMBER)[::-1]], 2, cv2.LINE_AA)
            blit(frame, s1, x - 20, y + 10 + rise, a)
            if tx.get("sub"):
                s2 = text_sprite(tx["sub"], "sans-m", 24, LAV, spacing=0.22, upper=True, maxw=1500)
                blit(frame, s2, x - 20, y + 10 + s1.shape[0] - 30 + rise, a)

# ---------- frame assembly ----------
SHOTS = []; MG = {}
_vid = {}
def video_frame(path, idx):
    r = _vid.get(path)
    if r is None or idx < r["i"]:
        if r: r["cap"].release()
        r = {"cap": cv2.VideoCapture(os.path.join(HERE, path)), "i": -1, "f": None}; _vid[path] = r
    while r["i"] < idx:
        ok, f = r["cap"].read()
        if not ok: break
        r["f"] = f; r["i"] += 1
    return r["f"].astype(np.float32)

def shot_frame(sh, t):
    if sh.get("video"):
        frame = video_frame(sh["video"], int(round((t - sh["t0"] + sh.get("vofs", 0)) * FPS)))
        cam = None
        draw_texts(frame, sh, t)
        return frame
    if sh.get("mg_only"):
        frame = np.zeros((H, W, 3), np.float32); frame[:] = np.array(sh.get("bg", (11, 15, 42))[::-1], np.float32)
        cam = None
    else:
        frame, cam = render_plate(sh, t)
        lights_breathe(frame, sh, cam, t)
    fog(frame, sh, t, sh.get("fog", 0.22))
    if sh.get("mg"): MG[sh["mg"]](frame, sh, t, cam)
    motes(frame, sh, t)
    for g in sh.get("glows", []):  # hero glows at plate coordinates (normalized), timed
        a = kv(g.get("a", 1.0), clamp((t - sh["t0"]) / (sh["t1"] - sh["t0"])))
        if "t" in g: a *= ramp(t, g["t"], g["t"] + g.get("in", 0.8))
        pulse = 1 + g.get("pulse", 0.15) * math.sin(t * g.get("hz", 0.5) * 6.28)
        if cam:
            x, y = cam["to_screen"](g["x"] * cam["p"]["w"], g["y"] * cam["p"]["h"], g.get("d", 0.6))
        else: x, y = g["x"] * W, g["y"] * H
        add_glow(frame, x, y, g.get("r", 160) * (cam["S"] / 0.7 if cam else 1), g.get("c", CYAN), g.get("i", 0.5) * a * pulse)
    if sh.get("grade"):
        gr = sh["grade"]; frame *= np.array(gr[::-1], np.float32)[None, None, :]
    draw_texts(frame, sh, t)
    return frame

def frame_at(t, fi):
    act = [s for s in SHOTS if s["t0"] - s.get("xin", 0.8) <= t < s["t1"] + 0.0001]
    act.sort(key=lambda s: s["t0"])
    if not act: out = np.zeros((H, W, 3), np.float32)
    elif len(act) == 1: out = shot_frame(act[0], t)
    else:
        A, B = act[-2], act[-1]
        xin = B.get("xin", 0.8); e = ease((t - (B["t0"] - xin)) / xin)
        fa = shot_frame(A, t); fb = shot_frame(B, t)
        kind = B.get("trans", "light")
        if kind == "tilt":     # camera tilts: A leaves upward, B arrives from below
            off = int(e * H)
            out = np.empty_like(fa)
            out[:H - off] = fa[off:]; out[H - off:] = fb[:off]
            out = cv2.GaussianBlur(out, (1, 0) if False else (1, 31), 0) * (math.sin(math.pi * e) * 0.6) + out * (1 - math.sin(math.pi * e) * 0.6)
        elif kind == "cut": out = fb if e > 0.5 else fa
        else:                  # dissolve carried by light: luminous bloom at the seam
            out = fa * (1 - e) + fb * e
            bloom = math.sin(math.pi * e) * B.get("bloom", 0.22)
            if bloom > 0:
                col = np.array(B.get("bloomcol", (180, 225, 245))[::-1], np.float32)
                out = out + (col[None, None, :] - out) * bloom * vignette_inv()
    out *= vignette()
    out += grain(fi)[..., None] * 7.0
    return np.clip(out, 0, 255).astype(np.uint8)

_vinv = None
def vignette_inv():
    global _vinv
    if _vinv is None:
        d = np.sqrt(((UU - W / 2) / (W / 2)) ** 2 + ((VV - H / 2) / (H / 2)) ** 2)
        _vinv = np.clip(1 - d * 0.7, 0, 1)[..., None].astype(np.float32)
    return _vinv

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="a", type=float, default=0); ap.add_argument("--to", dest="b", type=float, default=None)
    ap.add_argument("--out", default=None); ap.add_argument("--snap", type=str, default=None)
    ap.add_argument("--crf", default="18"); ap.add_argument("--half", action="store_true")
    a = ap.parse_args()
    import shots  # defines SHOTS and MG
    SHOTS.extend(shots.build()); MG.update(shots.MG)
    if a.snap:
        os.makedirs(os.path.join(HERE, "snaps"), exist_ok=True)
        for ts in a.snap.split(","):
            t = float(ts); img = frame_at(t, int(t * FPS))
            cv2.imwrite(os.path.join(HERE, "snaps", f"s{t:07.2f}.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 88])
        return
    b = a.b if a.b is not None else max(s["t1"] for s in SHOTS)
    f0, f1 = int(round(a.a * FPS)), int(round(b * FPS))
    ow, oh = (W // 2, H // 2) if a.half else (W, H)
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-vf", f"scale={ow}:{oh}" if a.half else "null", "-c:v", "libx264", "-preset", "veryfast", "-crf", a.crf, "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
    import time; t0 = time.time()
    for fi in range(f0, f1):
        enc.stdin.write(frame_at(fi / FPS, fi).tobytes())
        if (fi - f0) % 150 == 0: print(f"{a.out}: {fi - f0}/{f1 - f0} {(time.time() - t0) / max(1, fi - f0):.3f}s/f", flush=True)
    enc.stdin.close(); enc.wait()

if __name__ == "__main__":
    sys.path.insert(0, HERE); main()
