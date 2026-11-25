#!/usr/bin/env python3
"""Film 70 · tile jpg stills into one contact sheet (< 1 MB), labelled with their file names.
   python3 tools/contact70.py <dir|glob> <out.jpg> [--cols 4] [--w 480]"""
import glob, os, sys
from PIL import Image, ImageDraw
a = sys.argv[1:]; cols = int(a[a.index('--cols') + 1]) if '--cols' in a else 4; tw = int(a[a.index('--w') + 1]) if '--w' in a else 480
src, out = a[0], a[1]
fs = sorted(glob.glob(os.path.join(src, '*.jpg')) if os.path.isdir(src) else glob.glob(src))
th = tw * 9 // 16; rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + 22)), (8, 11, 39)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    sheet.paste(Image.open(f).convert('RGB').resize((tw, th)), (x, y + 22)); d.text((x + 6, y + 5), os.path.basename(f)[:60], fill=(243, 239, 226))
q = 85
while True:
    sheet.save(out, quality=q)
    if os.path.getsize(out) < 950_000 or q < 40: break
    q -= 8
print(out, len(fs), 'stills', os.path.getsize(out) // 1024, 'KB, q', q)
