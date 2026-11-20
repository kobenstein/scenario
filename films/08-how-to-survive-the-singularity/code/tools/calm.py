#!/usr/bin/env python3
"""Motion ceiling check: python3 tools/calm.py <video> [from_s to_s]
Prints hard cuts and the median/mean mean-abs-frame-difference (ffmpeg scdet mafd, 10 fps, 320 px gray).
Reference (Film 6, Jakob's favourite): median mafd 0.36, mean 1.0, 0.3 cuts/min. Film 8 fassung-1: median 1.27, 2.6 cuts/min."""
import re, subprocess, sys, statistics as st, tempfile, os
v = sys.argv[1]; ss = sys.argv[2:4]
f = tempfile.mktemp(suffix='.txt')
cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error'] + (['-ss', ss[0], '-to', ss[1]] if ss else []) + ['-i', v, '-an', '-vf',
       f'fps=10,scale=320:-2,format=gray,scdet=threshold=12,metadata=print:file={f}', '-f', 'null', '-']
subprocess.run(cmd, check=True)
rows, cur = [], {}
for l in open(f):
    m = re.match(r'frame:\d+\s+pts:\d+\s+pts_time:([\d.]+)', l)
    if m:
        if cur: rows.append(cur)
        cur = {'t': float(m.group(1))}; continue
    m = re.match(r'lavfi\.(\S+)=([-\d.]+)', l)
    if m: cur[m.group(1)] = float(m.group(2))
rows.append(cur); os.remove(f)
off = float(ss[0]) if ss else 0
cuts = []
for r in rows:
    if r.get('scd.score', 0) > 12 and (not cuts or r['t'] - cuts[-1] > 0.5): cuts.append(r['t'])
m = [r.get('scd.mafd', 0) for r in rows]; dur = rows[-1]['t'] or 1
print(f'dur {dur:.1f}s  cuts {len(cuts)} ({len(cuts)/dur*60:.1f}/min) at', [round(c + off, 1) for c in cuts])
print(f'mafd median {st.median(m):.2f}  mean {st.mean(m):.2f}  p90 {sorted(m)[int(.9*len(m))]:.2f}')
