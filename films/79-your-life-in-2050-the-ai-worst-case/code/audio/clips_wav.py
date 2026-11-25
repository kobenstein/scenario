#!/usr/bin/env python3
"""Film 79 (from Film 63) · cut the clip sound for build_vo.py / mix.py: the 60-s file of clips_cfg.json 'file' in the clips dir (cut points INSIDE the file: docs/CLIPS-infile.md)
-> <out_dir>/<id>.wav (48 kHz stereo, trimmed to [in, out] from clips_cfg.json) + <out_dir>/<id>.json {file, file_in_s, file_out_s} (the picture uses the same trim).
in/out null = automatic: first voiced 10-ms frame (-40 dBFS) - 0.15 s .. last voiced + 0.25 s; 'cut_pause_after' = end at the first pause >= 0.15 s after that many seconds of speech.
A missing mp4 is skipped: its slot stays a silent placeholder in build_vo.py. LISTEN to every wav after the first run and fix in/out by hand where needed.
usage: clips_wav.py <out_dir> [clips_dir]"""
import json, os, subprocess, sys
import numpy as np
OUT = sys.argv[1].rstrip('/'); CLIPS = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F79CLIPS', '/home/user/scenario/films/79-assets/clips')).rstrip('/')
CFG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'clips_cfg.json')))
os.makedirs(OUT, exist_ok=True)
for cid, c in CFG.items():
    if not cid.startswith('C'): continue
    src = f"{CLIPS}/{c['file']}"
    if not os.path.exists(src): print(cid, 'missing', src, '-> placeholder', '(silent placeholder in build_vo.py)'); continue
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2)) for i in range(0, len(x) - 160, 160)]) + 1e-9)
    on = np.nonzero(db > -40)[0]; dur = len(x) / 16000
    a = c['in'] if c.get('in') is not None else max(0.0, on[0] * .01 - .15)
    if c.get('out') is not None: b = c['out']
    elif c.get('cut_pause_after'):
        i = int((a + .15 + c['cut_pause_after']) * 100); q = db < -40
        while i < len(q) - 15 and not q[i:i + 15].all(): i += 1
        b = min(dur, i * .01 + .12)
    else: b = min(dur, (on[-1] + 1) * .01 + .25)
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', src, '-vn', '-ac', '2', '-ar', '48000', f'{OUT}/{cid}.wav'])
    json.dump({'file': c['file'], 'file_in_s': round(a, 3), 'file_out_s': round(b, 3)}, open(f'{OUT}/{cid}.json', 'w'))
    print(cid, f'{a:.2f}-{b:.2f} s of {dur:.2f} s ->', round(b - a, 2), 's')
