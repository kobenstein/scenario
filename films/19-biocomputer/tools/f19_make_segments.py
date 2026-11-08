#!/usr/bin/env python3
"""Film 19: vo-v3.txt -> audio/segments.json. One take per paragraph (blank-line separated); an untagged paragraph joins the previous
take if the take stays <= 650 chars, else it gets the previous direction tag. [CLIP C1] = no slot (Doom footage plays muted under the
following paragraph); [CLIP C2]/[CLIP C3] = silent clip slots (kind clip). Sections 1-8 = stations of the script.
vo-v4 (2026-11-08): a paragraph with "subscribe" is a channel call (own take, id cta1, cta2, … : the s-numbering stays as in vo-v3,
so the existing takes keep their files). An untagged paragraph right after a mid-take call is the rest of the take before the call:
both pieces share the take's audio ("src", "words" = [first, end) word index), e.g. s11 = "...four years." | cta1 | s11b "So why...".
usage: f19_make_segments.py <vo-v4.txt> <audio_dir>"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
SECS = [('1', 'Computers now run'), ('2', 'Your brain cells grew up'), ('3', 'The answer came from that same company'), ('4', 'So cells can learn from nothing'),
        ('5', 'It comes down to a number'), ('6', 'So can a dish of cells really compete'), ('7', 'Cells that learn, team up'), ('8', 'So what do we do now')]
CLIPS = {'C2': {'dur': 11.0, 'name': 'Brett Kagan', 'role': 'Chief Scientific Officer, Cortical Labs'},
         'C3': {'dur': 14.0, 'name': 'Thomas Hartung', 'role': 'Johns Hopkins University'}}
TAG = re.compile(r'^\[[^\[\]]*\]\s*')
txt = open(src).read()
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', txt) if p.strip()]
segs, sec, n, last_tag, ncta = [], None, 0, '', 0
nw = lambda x: len(TAG.sub(' ', x).split())
for p in paras:
    p = [l for l in p if l != '[CLIP C1]']   # C1 = muted Doom footage under the next paragraph, no slot
    if not p: continue
    if len(p) == 1 and (m := re.fullmatch(r'\[CLIP (C\d)\]', p[0])):
        if m.group(1) == 'C1': continue
        segs.append({'id': m.group(1), 'sec': sec, 'clip': True, **CLIPS[m.group(1)]}); continue
    bare = TAG.sub('', p[0])
    hit = next((s for s, w in SECS if bare.startswith(w)), None)
    if hit: sec = hit
    tm = re.match(r'^(\[[^\[\]]*\])\s*', p[0])
    if tm: last_tag = tm.group(1)
    body = '\n'.join(p)
    prev = segs[-1] if segs else None
    if 'subscribe' in bare.lower():   # channel call: own take, own id
        ncta += 1; segs.append({'id': f'cta{ncta}', 'sec': sec, 'cta': True, 'text': body if tm else last_tag + ' ' + body}); continue
    if not tm and not hit and prev and prev.get('cta') and len(segs) > 1 and 'text' in segs[-2]:   # rest of the take before the call
        a = segs[-2]; k = nw(a['text'])
        a.update(src=a.get('src', a['id']), words=[0, k])
        segs.append({'id': a['id'] + 'b', 'sec': sec, 'src': a['src'], 'words': [k, None], 'text': re.match(r'^(\[[^\[\]]*\])', a['text']).group(1) + ' ' + body}); continue
    if not tm and not hit and prev and not prev.get('clip') and len(prev['text']) + len(body) < 650:
        prev['text'] += '\n' + body; continue
    if not tm: body = last_tag + ' ' + body
    segs.append({'id': f's{n:02d}', 'sec': sec, 'text': body}); n += 1
json.dump(segs, open(A + '/segments.json', 'w'), indent=1)
for s in segs: print(s['id'], s['sec'], f"{len(s.get('text','').split())}w {len(s.get('text',''))}c", '|', s.get('text', 'CLIP ' + s.get('name', ''))[:60].replace('\n', ' / '))
