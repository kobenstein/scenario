#!/usr/bin/env python3
"""Split the VO text (one sentence group per line, [CLIP: …] line for C1) into audio/segments.json for Film 7.
usage: make_segments.py <vo.txt> <audio_dir>"""
import json, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
# (segment id, section, first words of the segment's first line)
STARTS = [('00a', '0', 'Can superintelligence grow forever?'), ('00b', '0', 'Tesla calls it'), ('01a', '1', 'Four hundred years sounds safe'),
          ('02a', '2', 'Breathtaking.'), ('03a', '3', 'Which brings us back'), ('03b', '3', 'Question two.'), ('04a', '4', 'Which leaves us with a puzzle'),
          ('05a', '5', 'So picture the same world'), ('06a', '6', "Let's turn those four cards"), ('06b', '6', 'Second card.'), ('06c', '6', 'Third card.'),
          ('06d', '6', 'And now, that number.'), ('06e', '6', 'And the last card.'), ('07a', '7', 'So, can superintelligence grow forever?')]
lines = [l.strip() for l in open(src) if l.strip()]
segs, cur = [], None
for l in lines:
    if l.startswith('[CLIP'):
        segs.append({'id': 'C1', 'sec': '0', 'clip': True}); cur = None; continue
    hit = next((s for s in STARTS if l.startswith(s[2])), None)
    if hit and not any(x['id'] == hit[0] for x in segs):
        cur = {'id': hit[0], 'sec': hit[1], 'text': l}; segs.append(cur); continue
    if cur is None: raise SystemExit('text before first segment: ' + l)
    cur['text'] += '\n' + l
missing = [s[0] for s in STARTS if not any(x['id'] == s[0] for x in segs)]
if missing: raise SystemExit('missing segment starts: ' + ', '.join(missing))
old = {}
try: old = {s['id']: s for s in json.load(open(A + '/segments.json'))}
except Exception: pass
for s in segs:   # keep clip metadata (dur, from, to, url, src) once it is filled in
    if s.get('clip') and s['id'] in old: s.update({k: v for k, v in old[s['id']].items() if k not in s})
json.dump(segs, open(A + '/segments.json', 'w'), indent=1)
for s in segs: print(s['id'], s['sec'], 'CLIP' if s.get('clip') else len(s['text'].split()))
