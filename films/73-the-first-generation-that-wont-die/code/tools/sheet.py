#!/usr/bin/env python3
"""Contact sheet from a folder of snapshots (render.mjs --snap): python3 tools/sheet.py <dir> <out.jpg> [cols=4] [w=480]
Each tile is labelled with its time. Keep the output < 1 MB (it goes to ROOT bild/)."""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 480
fs = sorted(glob.glob(os.path.join(d, 't*.jpg')))
th = tw * 9 // 16
rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * th), (8, 11, 39))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(Image.open(f).resize((tw, th)), (x, y))
    dr.text((x + 6, y + 4), os.path.basename(f)[1:-4].lstrip('0') + ' s', fill=(243, 239, 226))
sheet.save(out, quality=82)
print(out, sheet.size, os.path.getsize(out) // 1024, 'KB')
