"""Typeset a glowing cream Anton headline onto a 2560x1440 illustration.

usage: typeset.py in.png out.png spec.json
spec: {"lines": ["AI PROOF", "NOBODY UNDERSTANDS"], "box": [x0, y0, x1, y1],
       "align": "left|center|right", "colors": ["#FFF3D6", ...] (per line, optional),
       "stamp": {"text": "CORRECT", "center": [x, y], "h": 220, "angle": -8} (optional)}
Each line is scaled so the block fills the box width (longest line = box width),
capped by box height.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Anton-Regular.ttf")
CREAM = "#FFF4D8"


def text_size(font, s):
    b = font.getbbox(s)
    return b[2] - b[0], b[3] - b[1], b


def main():
    src, dst, spec_path = sys.argv[1:4]
    spec = json.load(open(spec_path))
    img = Image.open(src).convert("RGB")
    W, H = img.size
    x0, y0, x1, y1 = spec["box"]
    bw, bh = x1 - x0, y1 - y0
    lines = spec["lines"]
    gap = spec.get("gap", 0.06)
    per_line_fit = spec.get("per_line_fit", False)

    # find font size so widest line fits bw and the block fits bh
    size = 600
    while size > 20:
        f = ImageFont.truetype(FONT, size)
        ws = [text_size(f, l)[0] for l in lines]
        asc, desc = f.getmetrics()
        lh = asc * 0.86
        total = lh * len(lines) + gap * size * (len(lines) - 1)
        if max(ws) <= bw and total <= bh:
            break
        size -= 4
    fonts = []
    for l in lines:
        if per_line_fit:
            s = size
            while True:
                f2 = ImageFont.truetype(FONT, s + 4)
                if text_size(f2, l)[0] > bw:
                    break
                s += 4
            fonts.append(ImageFont.truetype(FONT, s))
        else:
            fonts.append(ImageFont.truetype(FONT, size))

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    colors = spec.get("colors") or [CREAM] * len(lines)
    y = y0
    placed = []
    for l, f, c in zip(lines, fonts, colors):
        w, h, b = text_size(f, l)
        if spec.get("align", "left") == "left":
            x = x0
        elif spec["align"] == "right":
            x = x1 - w
        else:
            x = x0 + (bw - w) / 2
        d.text((x - b[0], y - b[1]), l, font=f, fill=c)
        placed.append((x, y, w, h))
        y += h + gap * f.size

    if "stamp" in spec:
        st = spec["stamp"]
        sf = ImageFont.truetype(FONT, st["h"])
        w, h, b = text_size(sf, st["text"])
        pad = int(st["h"] * 0.28)
        border = max(8, int(st["h"] * 0.07))
        sw, sh = w + 2 * pad, h + 2 * pad
        stamp = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
        sd = ImageDraw.Draw(stamp)
        gold = st.get("color", "#F2B632")
        if st.get("solid"):
            sd.rounded_rectangle([0, 0, sw, sh], radius=int(pad * 0.4), fill=gold)
            sd.text((pad - b[0], pad - b[1]), st["text"], font=sf, fill=st.get("ink", "#121640"))
        else:
            sd.rounded_rectangle([border // 2, border // 2, sw - border // 2, sh - border // 2], radius=int(pad * 0.5), outline=gold, width=border)
            sd.text((pad - b[0], pad - b[1]), st["text"], font=sf, fill=gold)
        stamp = stamp.rotate(st.get("angle", -8), expand=True, resample=Image.BICUBIC)
        cx, cy = st["center"]
        layer.alpha_composite(stamp, (int(cx - stamp.width / 2), int(cy - stamp.height / 2)))

    # glow: blurred copy tinted warm, plus soft dark shadow for contrast
    alpha = layer.split()[3]
    shadow = Image.new("RGBA", (W, H), (8, 10, 40, 0))
    shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(28)).point(lambda v: int(v * 0.75)))
    glow = Image.new("RGBA", (W, H), (255, 196, 90, 0))
    glow.putalpha(alpha.filter(ImageFilter.GaussianBlur(spec.get("glow", 22))).point(lambda v: int(v * 0.55)))
    out = img.convert("RGBA")
    out.alpha_composite(shadow)
    out.alpha_composite(glow)
    out.alpha_composite(layer)
    # light grain over text so it sits in the illustration
    out = out.convert("RGB")
    out.save(dst)
    print(dst, "font", [f.size for f in fonts], placed)


if __name__ == "__main__":
    main()
