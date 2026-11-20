#!/usr/bin/env python3
"""Report dubbed lines that run into a barrier (clip slot). usage: check_bar.py <dub_dir> <lang>"""
import json, re, sys
D, lang = sys.argv[1].rstrip('/'), sys.argv[2]
BAR = json.load(open(f'{D}/barriers.json'))
for l in open(f'{D}/{lang}/report.txt'):
    m = re.search(r'(\S+)\s+anchor\s+(\S+) start\s+(\S+) .* dur\s+(\S+) .* tempo (\S+)', l)
    lab, a, s, d, r = m.group(1), *map(float, m.group(2, 3, 4, 5)); e = s + d / r
    for b in BAR:
        if s < b < e + 0.15: print(lang, lab, f'ends {e:.2f} barrier {b:.2f}')
