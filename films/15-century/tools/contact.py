#!/usr/bin/env python3
"""Contact sheet of review stills: python3 tools/contact.py <dir with t*.jpg> <out.jpg> [cols=6] [width=480]
Tiles every jpg in the directory (sorted by name = by time for render.mjs --snap output) with its file name as label."""
import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 480
fs = sorted(f for f in os.listdir(d) if f.endswith('.jpg') and f.startswith('t'))
ims = [Image.open(os.path.join(d, f)) for f in fs]
th = round(tw * 9 / 16); lab = 20
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + lab)), (17, 17, 17))
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * tw, (i // cols) * (th + lab)
    dr.text((x + 6, y + 3), f[1:-4].lstrip('0') or '0', fill=(220, 220, 220))
    sheet.paste(im.resize((tw, th)), (x, y + lab))
sheet.save(out, quality=86); print(out, len(ims), 'stills')
