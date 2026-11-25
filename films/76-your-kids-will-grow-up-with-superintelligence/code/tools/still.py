#!/usr/bin/env python3
"""Still-spot check (REGELN §13.9: stille Stellen < 5 %, keine > 2 s).
usage: tools/still.py <video.mp4> [offset_seconds] [--thr 0.35]
A frame is 'still' when a grain-free copy (160x90 grayscale, area-averaged) differs from the frame 0.5 s later by less than thr gray levels
(mean absolute). The film grain and print finish change every frame, so a plain frame difference never reaches zero; averaging down to
160x90 removes them (consecutive frames then differ by ~0.01) and keeps real picture motion. Calibration (f76 hook, 960x540
preview, 2026-11-25): a frozen frame < 0.1; the quietest moments of the hook (camera float + ambient drift only) 0.74-0.9; normal 1-10. Prints the still share and every still run >= 1 s."""
import sys, subprocess, numpy as np
a = [x for x in sys.argv[1:] if not x.startswith('--')]
thr = float(sys.argv[sys.argv.index('--thr') + 1]) if '--thr' in sys.argv else 0.5
if '--thr' in sys.argv: a.remove(sys.argv[sys.argv.index('--thr') + 1])
v, off = a[0], float(a[1]) if len(a) > 1 else 0.0
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'scale=160:90:flags=area,format=gray', '-f', 'rawvideo', '-'])
f = np.frombuffer(raw, np.uint8).reshape(-1, 90, 160).astype(np.float32)
fps, L = 30, 15
d = np.abs(f[L:] - f[:-L]).mean((1, 2))
still = d < thr
runs, i = [], 0
while i < len(still):
    if still[i]:
        j = i
        while j < len(still) and still[j]: j += 1
        if (j - i) / fps >= 1: runs.append((round(off + i / fps, 2), round((j - i + L) / fps, 2)))
        i = j
    else: i += 1
share = still.mean() * 100
longest = max([r[1] for r in runs], default=0)
print(f'{v}  frames {len(f)}  still {share:.1f} %  (thr {thr})  runs>=1s: {runs}  longest {longest:.1f} s  ' + ('[OK]' if share < 5 and longest <= 2 else '[CHECK]'))
print('motion p10/median/p90:', *[round(float(np.percentile(d, q)), 2) for q in (10, 50, 90)])
