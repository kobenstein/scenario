#!/usr/bin/env python3
"""Film 49 (from Film 66 / 59) · cut the clip sound for build_vo.py / mix.py: <ROOT>clips/<id>.mp4 (already cut exactly: the whole file is the clip)
-> <out_dir>/<id>.wav (48 kHz stereo). Slots C13, C5, C16, C2 (segments.json). A clip without a file stays a silent placeholder slot (no wav written,
an old wav of that id is removed so it cannot sneak into the mix).
usage: clips_wav.py <out_dir> [ROOT]"""
import json, os, subprocess, sys
A = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1].rstrip('/'); ROOT = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F49ROOT', '/mnt/project-files/scenario/film-vorbereiten')).rstrip('/')
os.makedirs(OUT, exist_ok=True)
for c in [s['id'] for s in json.load(open(f'{A}/segments.json')) if s.get('clip')]:
    src, dst = f'{ROOT}/clips/{c}.mp4', f'{OUT}/{c}.wav'
    if not os.path.exists(src):
        if os.path.exists(dst): os.remove(dst)
        print(c, 'no clip file yet -> silent placeholder slot'); continue
    subprocess.check_call(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-vn', '-ac', '2', '-ar', '48000', dst])
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst]))
    print(c, round(d, 2), 's')
