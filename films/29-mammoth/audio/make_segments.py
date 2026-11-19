#!/usr/bin/env python3
"""Film 29 'AI Is Bringing Back the Mammoth' · vo-vN.txt -> segments.json (takes for ElevenLabs v4 + the silent clip slot + quote cards). Method as Film 55.
Sections (stations) = H, 1, 2, 3, M, 3b, 4, 5, 6, A2 (same ids as tools/provisional_timing.py), found by the first words of the sentence that opens them.
A take = consecutive lines (paragraphs) of ONE section, joined by a blank line (the voice pauses there), split at [CLIP], at a picture-only quote card and at ~MAXC chars.
[CLIP C1] = a SILENT slot (#29: quote card on screen, a real clip may replace it later), LEN s, the music bed carries it.
[ZITATKARTE: "quote" · credit · nur im Bild ...]   picture-only card (NOT spoken): the next take gets 'card_air' (CARD_AIR s of extra air to read it);
     build_vo.py puts the card (Q1, Q3 ...) from the start of that air to the end of the first line of the next take (under: True).
[ZITATKARTE: ... · wird gesprochen ...]   card READ by the narrator: the next line (the quote) is spoken in the take; the card sits on its words.
usage: make_segments.py [vo.txt] [out segments.json]"""
import json, os, re, sys
ROOT = '/mnt/project-files/scenario/film-mammut/'
SRC = sys.argv[1] if len(sys.argv) > 1 else next(ROOT + f for f in ('vo-v5.txt', 'vo-v4.txt', 'vo-v3.txt') if os.path.exists(ROOT + f))
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SECS = [('H', 'Artificial intelligence is bringing'), ('1', 'The mice belong'), ('2', 'Because reading was never'),
        ('3', 'And the dodo is the harder'), ('M', 'Today, the machine writes'), ('3b', 'A list is not an animal'),
        ('4', 'There is a way to check'), ('5', "It isn't"), ('6', 'So here is what the evidence'), ('A2', 'These films exist')]
LEN = {'C1': 9.0}   # C1 Ben Lamm (Moonshots #297, 00:34:53-00:35:03): silent ~9 s slot (brief 19.11.)
CLIPQ = {c['id']: c['quote'] for c in json.load(open(ROOT + 'clips.json'))} if os.path.exists(ROOT + 'clips.json') else {}
MAXC = 520
strip = lambda l: re.sub(r'^(\[[^\]]*\]\s*)+', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, card, curcard, ncard, air = [], 0, 0, None, [], None, None, 0, None
def flush():
    global n, cur, curcard, air
    if not cur: return
    text = '\n\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if curcard: s['card'] = curcard['id']; s['card_quote'] = curcard['quote']; s['card_text'] = curcard['text']; s['card_credit'] = curcard['credit']
    if air: s['card_air'] = air['id']; s['air_text'] = air['text']; s['air_credit'] = air['credit']; s['air_line'] = cur[0]
    seg.append(s); n += 1; cur = []; curcard = None; air = None
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+([A-Z]\d+[a-z]?)\s*:?\s*(.*)\]', l)
    if m:
        flush(); q = m.group(2).strip().strip('"“”') or CLIPQ.get(m.group(1), '')
        seg.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': LEN.get(m.group(1), 8.0), 'quote': q, 'speaker': 'Ben Lamm' if m.group(1) == 'C1' else ''}); continue
    m = re.fullmatch(r'\[(?:QUOTE CARD|ZITATKARTE)\s*:?\s*([^\]]*)\]', l)
    if m:
        body = m.group(1); ncard += 1; q = re.search(r'["“](.+?)["”]', body)
        spoken = not re.search(r'nicht gesprochen|not spoken', body, re.I)
        card = {'id': f'Q{ncard}', 'text': q.group(1) if q else body.split('·')[0].strip(), 'spoken': spoken,
                'credit': ' · '.join(x.strip() for x in body.split('·')[1:] if not re.search(r'gesprochen|nur im Bild|spoken', x, re.I))}
        if not spoken: flush(); air = card; card = None
        continue
    if re.fullmatch(r'\[ENDCARD[^\]]*\]', l): continue
    if si < len(SECS) and strip(l).startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 2 for x in cur) + len(l) > MAXC: flush()
    if card:
        if curcard: flush()
        curcard = dict(card, quote=strip(l).rstrip('"”')); card = None
    cur.append(l)
flush()
assert si == len(SECS), si
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(SRC, '->', len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('card', ''), s.get('card_air', ''), 'CTA' if s.get('cta') else '', (s.get('text') or s.get('quote') or '')[:60].replace('\n', ' / '))
