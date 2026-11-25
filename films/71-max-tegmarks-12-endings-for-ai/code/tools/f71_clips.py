#!/usr/bin/env python3
"""Film 71 · clip frames for the picture: films/71-assets/clips/Cn.mp4 → /tmp/claude-0/f71/clips/Cn/f00001.jpg … (30 fps, 1920×1080,
frame 1 = the slot start in timing.json = the first frame of the sound step's cut). The framing (crop) happens HERE, so the kit draws whole frames:
  C1  Zoom gallery: Tegmark's tile only (right tile, ~954×536 source px). Soft: the kit shows it on a smaller plate (CLIPS.C1.rect).
  C2  Dean Ball solo, full frame (his burned-in DEAN BALL label stays).
  C4  two-up: Tegmark's tile only (right tile), 16:9 inside the tile.
  C5  Altman over the shoulder: crop above the burned-in sponsor bar (ramp, Vanta, …) and toward Altman.
  C6  Tegmark on stage, wide: a 1.6× crop on him.
In-point: audio/cut_clips.json (the sound step's cuts, field in_s = the slot start, so frame 1 = the first frame of the cut, 25.11.),
else audio/clips.json (src_in | in | source_in), else line_start_s (clips-geprueft-imac.json) − 0.6 (C2: the clean start 51.4 s).
Length: the slot in <ROOT>audio/timing.json (else the cut's dur, else 8 s).
  python3 tools/f71_clips.py [C1 C2 …]"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, '..', '..', '..', '71-assets', 'clips'))
ROOT = os.environ.get('F71ROOT', '/mnt/project-files/scenario/film-tegmark/').rstrip('/') + '/'
OUT = os.environ.get('F71CLIPS', '/tmp/claude-0/f71/clips/').rstrip('/') + '/'
CROP = {   # source px (1920×1080 originals): x, y, w, h
    'C1': (960, 270, 954, 536),
    'C2': None,
    'C4': (1002, 250, 813, 457),
    'C5': (300, 0, 1620, 911),
    'C6': (465, 60, 1200, 675),
}
CLEAN_START = {'C2': 51.4}
meta = {c['id']: c for c in json.load(open(os.path.join(ASSETS, 'clips-geprueft-imac.json')))['clips']}
snd = {}
try:
    j = json.load(open(os.path.join(HERE, '..', 'audio', 'cut_clips.json')))
    for k, v in (j.get('clips') or {}).items():
        if isinstance(v, dict) and v.get('in_s') is not None: snd[k] = {'src_in': v['in_s'], 'dur': v.get('dur')}
except (OSError, ValueError, AttributeError): pass
if not snd:
  try:
    j = json.load(open(os.path.join(HERE, '..', 'audio', 'clips.json')))
    for c in (j.get('clips') or []):
        if isinstance(c, dict) and c.get('id'): snd[c['id']] = c
  except (OSError, ValueError): pass
slots = {}
for f in (ROOT + 'audio/timing.json', os.path.join(HERE, '..', 'data', 'provisional_timing.json')):
    try: slots = {c['id']: c for c in json.load(open(f))['clips']}; break
    except (OSError, ValueError, KeyError): pass
want = sys.argv[1:] or list(CROP)
for cid in want:
    m = meta[cid]; s = snd.get(cid, {})
    src_in = next((float(s[k]) for k in ('src_in', 'in', 'source_in') if s.get(k) is not None), None)
    if src_in is None: src_in = CLEAN_START.get(cid, m['line_start_s']) - .6
    dur = (slots[cid]['end'] - slots[cid]['start']) if cid in slots else float(s.get('dur') or 8.0)
    d = OUT + cid + '/'; os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        if f.endswith('.jpg'): os.remove(d + f)
    vf = ([f'crop={CROP[cid][2]}:{CROP[cid][3]}:{CROP[cid][0]}:{CROP[cid][1]}'] if CROP[cid] else []) + ['scale=1920:1080:flags=lanczos', 'fps=30']
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, src_in):.3f}', '-i', os.path.join(ASSETS, cid + '.mp4'), '-t', f'{dur + .5:.3f}',
                    '-vf', ','.join(vf), '-q:v', '3', d + 'f%05d.jpg'], check=True)
    print(cid, f'in {src_in:.2f} s, {dur:.2f} s →', len(os.listdir(d)), 'frames in', d)
