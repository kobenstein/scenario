#!/usr/bin/env python3
"""Film 75 (from Film 69 / 67) · clip sound for build_vo.py / mix.py / clip_cues.py: cut the source files ($F75CLIPSRC, default /tmp/claude-0/f75/clips/)
at cuts.json in_s .. out_s -> <out_dir>/<id>.wav (48 kHz stereo, exactly out_s - in_s long; fades are applied in mix.py from clips.json).
Cut check: the 10-ms frames at both cut points must be quiet (< EDGE_DB dBFS), and the voice must be audible within 0.15 s of the cut
(first/last word not lost); a loud frame at the edge = a word is cut -> the run fails.
usage: clips_wav.py <out_dir> [clips_src_dir]"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1].rstrip('/'); SRC = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F75CLIPSRC', '/tmp/claude-0/f75/clips')).rstrip('/')
EDGE_DB = -50
os.makedirs(OUT, exist_ok=True)
cuts = {k: v for k, v in json.load(open(os.path.join(HERE, 'cuts.json'))).items() if not k.startswith('_')}
def db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
bad = []
for cid, c in cuts.items():
    f = f"{SRC}/{c['file']}"
    full = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-vn', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-']), np.float32)
    a, b = int(round(c['in_s'] * 48000)), int(round(c['out_s'] * 48000)); h = 240
    e_in, e_out = db(full[a - h:a + h]), db(full[b - h:b + h])
    # the nearest voiced frame (> -40 dBFS) after the in point / before the out point
    fr = lambda i: db(full[i:i + 480])
    on = next(k for k in range(a, b, 480) if fr(k) > -40); off = next(k for k in range(b - 480, a, -480) if fr(k) > -40)
    ok = e_in < EDGE_DB and e_out < EDGE_DB
    print(cid, c['file'], f"in {c['in_s']:.2f} ({e_in:.0f} dB, voice from +{(on - a) / 48000:.2f} s) · out {c['out_s']:.2f} ({e_out:.0f} dB, voice until -{(b - off - 480) / 48000:.2f} s) ·",
          f"{(b - a) / 48000:.2f} s", 'OK' if ok else 'CUT IN A WORD')
    if not ok: bad.append(cid)
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-ss', f"{c['in_s']:.3f}", '-i', f, '-t', f"{c['out_s'] - c['in_s']:.3f}", '-vn', '-ac', '2', '-ar', '48000', f"{OUT}/{cid}.wav"])
assert not bad, bad
