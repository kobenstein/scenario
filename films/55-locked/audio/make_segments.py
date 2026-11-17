#!/usr/bin/env python3
"""Film 55 'The Best AI Is Locked Away' · vo-v4.txt -> segments.json (takes for ElevenLabs v4 + silent clip slots). Method as Film 54 / 28.
Sections (stations) = H, 1 .. 8, M, A2 (same ids as tools/provisional_timing.py), found by the first words of the sentence that opens them.
A take = consecutive lines of ONE section, split at [CLIP] markers, at a line that opens with [pause] (the take after it gets 'pause': build_vo puts
PAUSE s of air before it; the tag itself is not sent to the voice) and at ~MAXC characters.
[QUOTE CARD: credit] is NOT spoken: the quote line after it is read by the narrator inside the take; 'card' on the take names the card (R1, R2 ...),
build_vo.py puts the card slot on the quote's words (kind 'card', under: True, no own time).
[CLIP A1: "..."] = a SILENT slot (#55: no footage; the picture shows the quote as wall text, the music bed carries it), length LEN (text-v2 clip table).
[ENDCARD ...] is ignored (the end screen is build_vo's END_TAIL).
usage: make_segments.py [vo-v4.txt] [out segments.json]"""
import json, re, sys
SRC = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/scenario/film-geheim-ki/vo-v4.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SECS = [('H', 'The best'), ('1', 'At the very front stand'), ('2', 'Ask either lab'), ('3', 'Fourth in line stand'),
        ('M', 'This channel exists'), ('4', 'Fifth in line'), ('5', "But the line doesn't end"), ('6', 'The rest is decided'),
        ('7', 'One clue was in plain sight'), ('8', 'One evening, a few months'), ('A2', 'This channel exists')]
LEN = {'A1': 5.0, 'C1': 8.0, 'C4': 7.0}   # text-v2 clip table: A1 Altman / Dreamforce 5 s, C1 Altman / Berman 8 s, C4 Hobbhahn / Senate 7 s
QUOTE = {}                                 # id -> the quote's wording (for the .srt and the picture)
MAXC = 520
strip = lambda l: re.sub(r'^(\[[^\]]*\]\s*)+', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, card, curcard, ncard, pause = [], 0, 0, None, [], None, None, 0, False
def flush():
    global n, cur, curcard, pause
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if curcard: s['card'] = curcard
    if pause: s['pause'] = True
    seg.append(s); n += 1; cur = []; curcard = None; pause = False
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+([A-Z]\d+[a-z]?)\s*:?\s*(.*)\]', l)
    if m:
        flush(); q = m.group(2).strip().strip('"“”')
        seg.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': LEN.get(m.group(1), 7.0), 'quote': q}); continue
    m = re.fullmatch(r'\[(?:QUOTE CARD|ZITATKARTE)\s*:?\s*([^\]]*)\]', l)
    if m: ncard += 1; card = {'id': f'R{ncard}', 'credit': m.group(1).strip()}; continue
    if re.fullmatch(r'\[ENDCARD[^\]]*\]', l): continue
    if re.match(r'\[pause\]', l, re.I):
        flush(); pause = True; l = re.sub(r'^\[pause\]\s*', '', l, flags=re.I)
        if not l: continue
    if si < len(SECS) and strip(l).startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    if card:
        curcard = card['id']; card['quote'] = strip(l).rstrip('"”'); QUOTE[card['id']] = card; card = None
    cur.append(l)
flush()
assert si == len(SECS), si
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
mid = next(s for s in tk if s['sec'] == 'M'); mid['cta'] = True
for s in seg:
    if s.get('card'): s['card_quote'] = QUOTE[s['card']]['quote']; s['card_credit'] = QUOTE[s['card']]['credit']
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('card', ''), 'PAUSE' if s.get('pause') else '', (s.get('text') or s.get('quote') or '')[:60].replace('\n', ' / '))
