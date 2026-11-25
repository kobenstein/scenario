#!/usr/bin/env python3
"""Film 70 · grain-robust still check (REGELN §13.9: still parts < 5 %, none > 2 s).
calm.py's 'static' share over-reads this film: the film grain on twos makes every other frame pair identical at half scale. Here the
picture is downscaled to 160×90 (averages the grain away) and each frame is compared with the frame 0.5 s later; a 0.5 s window is
'still' when its mean abs difference is < THR (of 255, default 0.35). Reports the still share and the longest still runs.
   python3 tools/still70.py <mp4> [thr]"""
import subprocess, sys, numpy as np
v = sys.argv[1]; thr = float(sys.argv[2]) if len(sys.argv) > 2 else .35
fps = 30; win = fps // 2
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'scale=160:90:flags=area,format=gray', '-f', 'rawvideo', '-'])
f = np.frombuffer(raw, np.uint8).reshape(-1, 90, 160).astype(np.float32)
d = np.abs(f[win:] - f[:-win]).mean((1, 2))          # change over 0.5 s, per start frame
st = d < thr; runs, i = [], 0
while i < len(st):
    if st[i]:
        j = i
        while j < len(st) and st[j]: j += 1
        runs.append((round(i / fps, 2), round((j - i + win) / fps, 2))); i = j
    else: i += 1
longest = max([r[1] for r in runs], default=0.0)
print(f'{v}: {len(f)} frames · motion per 0.5 s: median {np.median(d):.3f}, p5 {np.percentile(d, 5):.3f} · still (< {thr}) {st.mean() * 100:.1f} % · '
      f'longest still run {longest:.2f} s · runs (start s, length s): {sorted(runs, key=lambda r: -r[1])[:6]}')
print('PASS' if st.mean() < .05 and longest <= 2 else 'FAIL', '(target: still < 5 %, no run > 2 s)')
