#!/usr/bin/env python3
"""Film 67 (from Film 66 / 59) · clip sound for build_vo.py / mix.py: the cut clip files in CLIPS (default films/67-assets/clips/Cn.*, the iMac session commits them;
the whole file is the clip) -> <out_dir>/<id>.wav (48 kHz stereo). Only slots that segments.json knows (C0..C4); a missing file = the slot stays a silent placeholder.
usage: clips_wav.py <out_dir> [clips_dir]"""
import glob, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1].rstrip('/'); CLIPS = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F67CLIPS', os.path.normpath(os.path.join(HERE, '../../../67-assets/clips')))).rstrip('/')
os.makedirs(OUT, exist_ok=True)
for s in json.load(open(os.path.join(HERE, 'segments.json'))):
    if not s.get('clip'): continue
    fs = [f for f in sorted(glob.glob(f"{CLIPS}/{s['id']}.*")) if f.rsplit('.', 1)[1].lower() in ('mp4', 'mov', 'm4a', 'wav', 'mp3', 'mkv', 'webm')]
    if not fs:
        if os.path.exists(f"{OUT}/{s['id']}.wav"): os.remove(f"{OUT}/{s['id']}.wav")
        print(s['id'], 'no clip file: silent placeholder', s['dur'], 's'); continue
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', fs[0], '-vn', '-ac', '2', '-ar', '48000', f"{OUT}/{s['id']}.wav"])
    print(s['id'], os.path.basename(fs[0]), s['dur'], 's')
