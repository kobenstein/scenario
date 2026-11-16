#!/usr/bin/env python3
"""Film 59 'You Can Now Buy a Piece of AI' · vo-v2.txt -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 54 / 28.
Sections = H, 1 .. 6, M, A2 (countdown to the bell), found by the first words of the sentence that opens them:
  H hook (the button, the warning label, the dinner table) · 1 the facts (Anthropic, Thursday, price) · 2 STEP 1 the pitch (warnings, votes, trust, C1, Z1)
  3 STEP 2 the doubts (Levine, trustees, Bengio C2, the answer) · M subscribe 1 · 4 STEP 3 pricing night (numbers, C3, orders) · 5 STEP 4 the index clock
  6 the wheel and the stake · A2 closing call (+ end screen).
A take = consecutive lines of ONE section, split at [CLIP]/[ZITATKARTE] markers and at ~MAXC characters.
NOT spoken: [EINBLENDUNG ...], [ENDCARD ...], [CLIP Cn] (= slot), [ZITATKARTE Zn] (the quote line after it IS read by the narrator inside the take;
'card' on the take names the card, build_vo.py puts the card on the quote's words, kind 'card', under: True).
Slots (build_vo.py inserts the real clip audio): C1 5.09 s, C2 11.94 s, C3 9.22 s (= out - in from clips/schnitt.json).
usage: make_segments.py [vo-v2.txt] [out segments.json] [schnitt.json]"""
import json, re, sys
ROOT = '/mnt/project-files/scenario/film-ai-goes-public/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v2.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SCH = sys.argv[3] if len(sys.argv) > 3 else ROOT + 'clips/schnitt.json'
SECS = [('H', 'You can now buy a piece'), ('1', 'The seller is Anthropic'), ('2', 'So before the opening bell'), ('3', 'Many doubt it.'),
        ('M', 'This channel exists'), ('4', 'If the mission is unproven'), ('5', "And one thing doesn't depend"), ('6', 'But look at who else'),
        ('A2', 'This channel exists')]
LEN = {c['id']: round(c['out'] - c['in'], 2) for c in json.load(open(SCH))['clips']}
MAXC = 520
strip = lambda l: re.sub(r'^\[[^\]]*\]\s*', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
lines = [l for l in lines if not re.fullmatch(r'\[(EINBLENDUNG|ENDCARD)\b.*\]', l)]
seg, n, si, sec, cur, card, curcard = [], 0, 0, None, [], None, None
def flush():
    global n, cur, curcard
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if curcard: s['card'] = curcard
    if re.search(r'\[pause\]\s*$', text): s['pause'] = True
    seg.append(s); n += 1; cur = []; curcard = None
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+(C\d+[a-z]?)[^\]]*\]', l)
    if m: flush(); seg.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': LEN[m.group(1)]}); continue
    m = re.fullmatch(r'\[ZITATKARTE\s+([CZ]\d+[a-z]?)[^\]]*\]', l)
    if m: card = m.group(1); continue
    if card: l = l.replace('…', '')   # the quote line: the narrator reads it plainly ('...may not maximize stockholder value.')
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
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('card', ''), 'PAUSE' if s.get('pause') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
