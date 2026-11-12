#!/usr/bin/env python3
"""Film 28 · vo-v5.txt -> segments.json (takes for ElevenLabs v4 + silent slots), method as Film 25 segments.json.
Blocks (blank lines in vo-v5.txt) = countdown stations (H,12..1,E). A take = consecutive lines of one block, split at [CLIP] tags and at ~460 chars.
Slots: C3a 3.9, C1 14.7, C3 9.2, C5b 9.8 s (script tag [CLIP C5] -> C5b); C4 (6.0 s) is MUTE footage UNDER the next take ('under': true, no own slot).
usage: make_segments.py [vo-v5.txt] [out segments.json]"""
import json, re, sys
SRC = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/scenario/film-gute-ki/vo-v5.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SECS = ['H', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'E']
LEN = {'C3a': 3.9, 'C1': 14.7, 'C3': 9.2, 'C4': 6.0, 'C5b': 9.8}; ALIAS = {'C5': 'C5b'}
MAXC = 520
blocks = [b for b in re.split(r'\n\s*\n', open(SRC, encoding='utf8').read().strip()) if b.strip()]
assert len(blocks) == len(SECS), len(blocks)
seg, n = [], 0
def flush(lines, sec, under=None):
    global n
    if not lines: return
    text = '\n'.join(lines).strip()
    pause = bool(re.search(r'\n\[pause\]$', text)); text = re.sub(r'\s*\[pause\]$', '', text)   # a trailing [pause] = longer gap after the take (build_vo PAUSE)
    if not text: return
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if under: s['under'] = under
    if pause: s['pause'] = True
    seg.append(s); n += 1
for sec, b in zip(SECS, blocks):
    cur, under = [], None
    for l in [x.strip() for x in b.splitlines() if x.strip()]:
        m = re.fullmatch(r'\[CLIP\s+(C\d+[a-z]?)[^\]]*\]', l)
        if m:
            flush(cur, sec, under); cur = []; under = None
            cid = ALIAS.get(m.group(1), m.group(1))
            if cid == 'C4': under = 'C4'
            else: seg.append({'id': cid, 'sec': sec, 'clip': True, 'dur': LEN[cid]})
            continue
        if cur and (l.startswith('[warm]') or cur[-1].startswith('[warm]') or sum(len(x) + 1 for x in cur) + len(l) > MAXC):
            flush(cur, sec, under); cur = []; under = None
        cur.append(l)
    flush(cur, sec, under)
# a standalone "[pause]" line stays inside the take (Eleven v4 tag); mark the closing call (kernsatz + subscribe) as cta
last = [s for s in seg if 'text' in s][-1]
last['cta'] = True
assert last['text'].startswith('[warm]')
mid = next(s for s in seg if 'text' in s and s['text'].startswith('[warm]') and 'one reason' in s['text']); mid['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('under', ''), (s.get('text') or '')[:50].replace('\n', ' / '))
