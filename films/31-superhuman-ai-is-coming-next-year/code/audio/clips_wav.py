#!/usr/bin/env python3
"""Film 59 · cut the clip sound for build_vo.py / mix.py: <ROOT>clips/<id>.mp4 [in, out] (clips/schnitt.json) -> <out_dir>/<id>.wav (48 kHz stereo).
usage: clips_wav.py <out_dir> [ROOT]"""
import json, os, subprocess, sys
OUT = sys.argv[1].rstrip('/'); ROOT = (sys.argv[2] if len(sys.argv) > 2 else '/mnt/project-files/scenario/film-ai-2027').rstrip('/')
os.makedirs(OUT, exist_ok=True)
for c in json.load(open(f'{ROOT}/clips/schnitt.json'))['clips']:
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', f"{ROOT}/clips/{c['file']}", '-ss', str(c['in']), '-to', str(c['out']), '-vn', '-ac', '2', '-ar', '48000', f"{OUT}/{c['id']}.wav"])
    print(c['id'], round(c['out'] - c['in'], 2), 's')
