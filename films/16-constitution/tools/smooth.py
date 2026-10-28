#!/usr/bin/env python3
"""Smoothness check (Jakob 2026-10-23: "ruckelig"): per-frame mean absolute difference on a 320x180 grayscale copy of a rendered mp4.
usage: tools/smooth.py <video.mp4> [offset_seconds]
Flags frames above 12 (a lurch) and frames > 2.5x their neighbours (a pop); prints the worst seconds. offset = film time of the video's first frame."""
import subprocess, sys
import numpy as np
v, off = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'scale=320:180,format=gray', '-f', 'rawvideo', '-'])
f = np.frombuffer(raw, np.uint8).reshape(-1, 180, 320).astype(np.float32)
d = np.abs(np.diff(f, axis=0)).mean((1, 2))
bad = []
for i in range(len(d)):
    nb = np.r_[d[max(0, i - 2):i], d[i + 1:i + 3]]
    t = round(off + (i + 1) / 30, 2)
    if d[i] > 12: bad.append((t, 'LURCH', round(float(d[i]), 1)))
    elif len(nb) and d[i] > 2.5 * nb.mean() + 1.5: bad.append((t, 'POP', round(float(d[i]), 1)))
print(f'{len(f)} frames, mean diff {d.mean():.2f}, max {d.max():.1f} at {off + (d.argmax() + 1) / 30:.2f} s, flagged {len(bad)}')
for b in bad[:60]: print(*b)
