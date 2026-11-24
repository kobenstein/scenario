#!/usr/bin/env python3
"""Film 49 'You Have Five Years Before Superintelligence' · vo-v8.txt (fact-checked, final 23.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 66 / 59 / 31.
Sections = the stations of text-v7.md, found by the first words of the line that opens them (leading direction tags ignored):
  H hook · 1 the personal core (stranger at a wedding, Harari, C13, the countdown starts) · 2 five years to go: you · 3 four years: your work (C5)
  M subscribe call 1 · 4 three years: your family (C16) · 5 two years: the machine itself, is the deadline real · 6 one year: your say (C2)
  7 closing: the chance, the hardest question, the scene returns, the core line · A2 closing call (+ 15 s end screen).
vo-v8 has [CLIP Cn ...] lines: the slot sits exactly there. A take = consecutive lines of ONE section, split at clip slots, at a line that starts
with [pause] (Film 31: the take before it gets 'pause' = PAUSE s of air in build_vo.py, the tag itself is not sent) and at ~MAXC characters.
Voice text: 'AI' -> 'A.I.' (vo-v8 already spells it so). Direction tags: the script's own (calm, thoughtful, curious, warm), plus ADD_TAG at the start of
sections whose first line has none; the hook of section 7 'there may be a great deal to share' gets 'warm, amazed' (STAUNEN, brief 23.11.). Never whisper tags.
'say' = the text sent to Eleven v4 where it differs from 'text' (IPA for names, SAY); 'text' = the script words (alignment, subtitles).
Slots: placeholder length (SLOT_LEN, silence) until the cut file <ROOT>clips/Cn.mp4 exists; build_vo.py reads the real length from the file itself,
so the takes never change when the clips arrive (README: slots_update.sh).
usage: make_segments.py [vo-v8.txt] [out segments.json]"""
import json, os, re, sys
ROOT = os.environ.get('F49ROOT', '/mnt/project-files/scenario/film-vorbereiten/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v8.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'You have five years before superintelligence.'), ('1', 'Picture a wedding.'), ('2', 'Five years to go.'), ('3', 'Four years to go.'),
        ('M', 'This channel exists for one reason'), ('4', 'You met this machine as an adult.'), ('5', 'Two years to go.'), ('6', 'One year to go.'),
        ('7', 'And there may be a great deal to share.'), ('A2', 'This channel exists so that')]
ADD_TAG = {'1': 'warm', '2': 'calm, conversational', '3': 'calm, conversational', '5': 'calm, conversational', '6': 'calm, conversational'}
RETAG = {'And there may be a great deal to share.': 'warm, amazed'}   # replaces the script's [warm] on that line
SLOT_LEN = {'C13': 8.0, 'C5': 10.0, 'C16': 10.0, 'C2': 8.0}   # placeholder seconds (silence) until <ROOT>clips/Cn.mp4 exists
SAY = {'Brynjolfsson': '/ˈbrɪnjoʊlfsən/', 'Nobel': '/noʊˈbɛl/'}   # Harari and Yuval are read correctly without IPA (checked in the ASR pass); Amodei does not occur in vo-v8
SEED = {'t02': 4302, 't11': 4302}   # retakes with the same text (ASR check 23.11.: t02 'He's' for 'He is', t11 'But' dropped); default seed 4301
MAXC = 520
TAG = re.compile(r'^\s*\[([^\]]*)\]\s*')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip() and not l.startswith('[ENDCARD')]
lines = [re.sub(r'\bAI\b', 'A.I.', l).replace('A.I..', 'A.I.') for l in lines]
def bare(l):
    while TAG.match(l) and not l.startswith('[CLIP'): l = TAG.sub('', l, 1)
    return l
seg, n, si, sec, cur = [], 0, 0, None, []
def flush(pause=False):
    global n, cur
    if not cur: return
    text = '\n'.join(cur).strip()
    first = sec not in [s['sec'] for s in seg if 'text' in s]
    if first and not TAG.match(text) and ADD_TAG.get(sec): text = f'[{ADD_TAG[sec]}] ' + text
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = text
    for k, v in SAY.items(): say = re.sub(r'\b' + k + r'\b', v, say)
    if say != text: s['say'] = say
    if pause: s['pause'] = True
    if f't{n:02d}' in SEED: s['seed'] = SEED[f't{n:02d}']
    seg.append(s); n += 1; cur = []
for l in lines:
    m = re.match(r'\[CLIP (C\d+)', l)
    if m:
        flush(); c = m.group(1); seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': SLOT_LEN[c], 'placeholder': True}); continue
    b = bare(l)
    if si < len(SECS) and b.startswith(SECS[si][1]):
        flush(); sec = SECS[si][0]; si += 1
    elif re.match(r'\[pause\]', l, re.I):
        flush(pause=True); l = re.sub(r'^\[pause\]\s*', '', l, flags=re.I)
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    for k, v in RETAG.items():
        if b.startswith(k): l = f'[{v}] ' + b
    cur.append(l)
flush()
assert si == len(SECS), si
assert [s['id'] for s in seg if s.get('clip')] == ['C13', 'C5', 'C16', 'C2'], [s['id'] for s in seg if s.get('clip')]
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
mid = next(s for s in tk if s['sec'] == 'M'); mid['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
words = sum(len([w for w in re.sub(r'\[[^\]]*\]', ' ', s['text']).split() if re.search(r'\w', w)]) for s in tk)
print(len(seg), 'entries;', len(tk), 'takes;', sum(s.get('chars', 0) for s in seg), 'chars;', words, 'words')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PAUSE' if s.get('pause') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
