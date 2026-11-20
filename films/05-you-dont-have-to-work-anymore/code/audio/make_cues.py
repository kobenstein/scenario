#!/usr/bin/env python3
"""One Lyria cue per chapter (music/L00..L08.mp3), starting ~1.2 s before the chapter's first VO segment and crossfading
into the next chapter. Writes music/cues.json for mix.py.  usage: make_cues.py <audio_dir>"""
import json, subprocess, sys
A = sys.argv[1].rstrip('/') + '/'
T = json.load(open(A + 'timing.json'))
first = {}
for k, v in T['sections'].items(): first.setdefault(v['sec'], v['start'])
secs = sorted(first)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
cues = []
for i, s in enumerate(secs):
    t0 = 0 if i == 0 else first[s] - 1.6
    t1 = (first[secs[i + 1]] - 1.6 + 2.5) if i + 1 < len(secs) else T['duration']
    L = dur(A + f'music/L{s}.mp3')
    d = min(L, t1 - t0)
    cues.append([f'L{s}', round(t0, 2), 0.5 if i == 0 else 2.5, 3.0 if i + 1 < len(secs) else 5.0, 0, round(d, 2)])
    if t1 - t0 > L: print('warn: chapter', s, 'needs', round(t1 - t0, 1), 's, track is', round(L, 1))
json.dump(cues, open(A + 'music/cues.json', 'w'), indent=0)
for c in cues: print(c)
