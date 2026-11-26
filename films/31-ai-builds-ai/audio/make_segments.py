#!/usr/bin/env python3
"""Film 31 'Superhuman AI Is Coming Next Year' · vo-final.txt (fact-checked 17.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 59 / 54.
Sections = the picture's chunk stations (tools/provisional_timing.py SECS), found by the first words of the sentence that opens them:
  H hook · 1 the ladder, rung 1 code · 2 rung 2 experiments · 3 rung 3 leading research · M subscribe 1 · 4 how fast (evaluators) · 5 AI 2027 + Tao Lin T1a/T1b
  6 the scenario, rungs 4/5, K3 card · 7 who holds the last rung, T3 · 8 the answer · A2 closing call (+ end screen).
A take = consecutive lines of ONE section, split at [CLIP]/[ZITATKARTE] markers, at a line that starts with [pause] and at ~MAXC characters.
NOT spoken: '#' lines (cut notes), [CLIP Tn: "..."] (= slot), [ZITATKARTE Kn] (the line after it IS read by the narrator inside the take; 'card' on the take).
[pause] at the start of a line: the take before it gets 'pause' (PAUSE s of air in build_vo.py); the tag itself is not sent to the TTS.
Slots: length = out - in from clips/schnitt.json (T2 6.70 s, T1a 33.00 s, T1b 11.90 s, T3 4.70 s).
usage: make_segments.py [vo-final.txt] [out segments.json] [schnitt.json]"""
import json, os, re, sys
ROOT = os.environ.get('F31ROOT', '/mnt/project-files/scenario/film-ai-2027/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-final.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SCH = sys.argv[3] if len(sys.argv) > 3 else ROOT + 'clips/schnitt.json'
SECS = [('H', 'You may be using'), ('1', 'Picture a ladder'), ('2', "By Anthropic's own verdict"), ('3', 'Until this year'),
        ('M', 'This channel exists'), ('4', 'How fast?'), ('5', "They're the people behind"), ('6', 'Their scenario, late'),
        ('7', 'Right now, the labs hold'), ('8', 'So how close is A.I. to building its own'), ('A2', 'This channel exists')]
LEN = {c['id']: round(c['out'] - c['in'], 2) for c in json.load(open(SCH))['clips']}
MAXC = 520
# what the TTS gets where the script spelling would be misread (segments 'text' keeps the script words for alignment + subtitles; 'tts' is sent to Eleven v4)
TTS = {'"Led" works': '/lɛd/ works',   # 17.11.: guard against the quoted "Led" read as /liːd/ (IPA retake t06)
       'Kokotajlo': '/ˌkoʊkoʊˈtaɪloʊ/'}   # 17.11.: koh-koh-TIE-loh (IPA retake t12; Whisper hears 'Cocotillo' either way)
strip = lambda l: re.sub(r'^(\[[^\]]*\]\s*)+', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip() and not l.strip().startswith('#')]
seg, n, si, sec, cur, card, curcard = [], 0, 0, None, [], None, None
def flush():
    global n, cur, curcard
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    if curcard: s['card'] = curcard
    tts = text
    for a, b in TTS.items(): tts = tts.replace(a, b)
    if tts != text: s['tts'] = tts
    seg.append(s); n += 1; cur = []; curcard = None
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+(T\d+[a-z]?)\b[^\]]*\]', l)
    if m: flush(); seg.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': LEN[m.group(1)]}); continue
    m = re.fullmatch(r'\[ZITATKARTE\s+([CKZ]\d+[a-z]?)[^\]]*\]', l)
    if m: card = m.group(1); continue
    if re.match(r'\[pause\]', l, re.I):
        flush()
        prev = next((s for s in reversed(seg) if 'text' in s), None)
        if prev: prev['pause'] = True
        l = re.sub(r'^\[pause\]\s*', '', l, flags=re.I)
    if si < len(SECS) and strip(l).startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    if card: flush(); curcard = card; card = None
    cur.append(l)
flush()
assert si == len(SECS), SECS[si:]
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
mid = next(s for s in tk if s['sec'] == 'M'); mid['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), s.get('card', ''), 'PAUSE' if s.get('pause') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
