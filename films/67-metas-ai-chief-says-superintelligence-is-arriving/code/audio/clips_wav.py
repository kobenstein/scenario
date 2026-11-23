#!/usr/bin/env python3
"""Film 66 (from Film 59) · cut the clip sound for build_vo.py / mix.py: <ROOT>clips/<id>.mp4 (already cut exactly: the whole file is the clip, clips-geprueft.json)
-> <out_dir>/<id>.wav (48 kHz stereo).
usage: clips_wav.py <out_dir> [ROOT]"""
import json, os, subprocess, sys
OUT = sys.argv[1].rstrip('/'); ROOT = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F66ROOT', '/mnt/project-files/scenario/film-geld-nach-si')).rstrip('/')
os.makedirs(OUT, exist_ok=True)
for c in json.load(open(f'{ROOT}/clips-geprueft.json'))['clips']:
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', f"{ROOT}/clips/{c['id']}.mp4", '-vn', '-ac', '2', '-ar', '48000', f"{OUT}/{c['id']}.wav"])
    print(c['id'], c['dauer_s'], 's')
