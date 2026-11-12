#!/usr/bin/env python3
"""Film 54 'AI Just Gave Disease a 10-Year Deadline' · vo-v3.txt -> segments.json (takes for ElevenLabs v4 + silent clip slots). Method as Film 28.
Sections (stations) = H, 1 .. 8, M, A2 (same ids as tools/provisional_timing.py), found by the first words of the sentence that opens them.
A take = consecutive lines of ONE section, split at [CLIP]/[ZITATKARTE] markers and at ~MAXC characters. [ZITATKARTE Cn] is NOT spoken: the quote line after it is
read by the narrator inside the take; 'card' on the take names the card (build_vo.py puts the card slot on the quote's words, kind 'card', under: True).
Slots (silent in build_vo; the clip sound is mixed in by mix.py): C3 10.45 s, C5 9.32 s (audio only), C2 8.72 s (clips/schnitt.json).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, re, sys
SRC = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/scenario/film-heilung/vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SECS = [('H', 'Artificial intelligence just gave'), ('1', 'That deadline comes from'), ('2', 'In the lab, the day'), ('3', 'Heart disease answers twice'),
        ('M', 'This channel exists'), ('4', 'The third disease answers fast'), ('5', "Alzheimer's."), ('6', 'Partly, because a sales pitch'),
        ('7', 'It can.'), ('8', 'So, does the deadline hold?'), ('A2', 'This channel exists')]
LEN = {'C3': 10.45, 'C5': 9.32, 'C2': 8.72}
MAXC = 520
strip = lambda l: re.sub(r'^\[[^\]]*\]\s*', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, card, curcard = [], 0, 0, None, [], None, None
def flush():
    global n, cur, curcard
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if curcard: s['card'] = curcard
    seg.append(s); n += 1; cur = []; curcard = None
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+(C\d+[a-z]?)[^\]]*\]', l)
    if m: flush(); seg.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': LEN[m.group(1)]}); continue
    m = re.fullmatch(r'\[ZITATKARTE\s+(C\d+[a-z]?)[^\]]*\]', l)
    if m: card = m.group(1); continue
    if si < len(SECS) and strip(l).startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    if card: curcard = card; card = None
    cur.append(l)
flush()
assert si == len(SECS), si
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
mid = next(s for s in tk if s['sec'] == 'M'); mid['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('card', ''), (s.get('text') or '')[:60].replace('\n', ' / '))
