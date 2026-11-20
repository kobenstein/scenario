#!/usr/bin/env python3
"""Key a flat #00FF00 green background out of an AI-generated layer.

alpha comes from how much green dominates red/blue; spill is pulled back so amber and cyan survive.
Usage: python3 -I key.py in.png out.png [--erode 1] [--soft 1.0]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
args = sys.argv[3:]
erode = int(args[args.index("--erode") + 1]) if "--erode" in args else 1
soft = float(args[args.index("--soft") + 1]) if "--soft" in args else 1.0

im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# green dominance: 0 on the subject, ~1 on the screen
dom = g - np.maximum(r, b)
a = 1.0 - np.clip((dom - 0.12) / 0.28, 0.0, 1.0)
# despill: green may not exceed the larger of blue and 0.75 * red
g2 = np.minimum(g, np.maximum(b, 0.75 * r))
out = np.dstack([r, g2, b]).clip(0, 1)
alpha = Image.fromarray((a * 255).astype(np.uint8))
for _ in range(erode):
    alpha = alpha.filter(ImageFilter.MinFilter(3))
if soft > 0:
    alpha = alpha.filter(ImageFilter.GaussianBlur(soft))
rgba = Image.fromarray((out * 255).astype(np.uint8)).convert("RGBA")
rgba.putalpha(alpha)
bbox = rgba.getbbox() if "--crop" in args else None
(rgba.crop(bbox) if bbox else rgba).save(dst, optimize=False)
cov = (np.asarray(alpha) > 128).mean()
print(f"{dst}: {rgba.size[0]}x{rgba.size[1]} opaque {cov:.1%}" + (f" bbox {bbox}" if bbox else ""))
