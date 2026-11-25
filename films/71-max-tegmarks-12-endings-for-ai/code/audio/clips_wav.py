#!/usr/bin/env python3
"""Film 71 (from Film 69 / 67) · clip sound for build_vo.py / mix.py: the cut clip files in CLIPS (default <scratch>/cut/Cn.mp4 = cut_clips.py from films/71-assets/clips/Cn.mp4;
the whole file is the clip) -> <out_dir>/<id>.wav (48 kHz stereo). Only slots that segments.json knows (C1, C2, C4, C5, C6); a missing file = the slot stays a silent placeholder.
usage: clips_wav.py <out_dir> [clips_dir]"""
import glob, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1].rstrip('/'); CLIPS = (sys.argv[2] if len(sys.argv) > 2 else os.environ.get('F71CUT', '/tmp/claude-0/f71/audio/cut')).rstrip('/')
os.makedirs(OUT, exist_ok=True)
for s in json.load(open(os.path.join(HERE, 'segments.json'))):
    if not s.get('clip'): continue
    fs = [f for f in [f"{CLIPS}/{s['id']}.mp4"] if os.path.exists(f)]   # the cut file only (cut_clips.py), never a source window
    if not fs:
        if os.path.exists(f"{OUT}/{s['id']}.wav"): os.remove(f"{OUT}/{s['id']}.wav")
        print(s['id'], 'no clip file: silent placeholder', s['dur'], 's'); continue
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', fs[0], '-vn', '-ac', '2', '-ar', '48000', f"{OUT}/{s['id']}.wav"])
    print(s['id'], os.path.basename(fs[0]), s['dur'], 's')
