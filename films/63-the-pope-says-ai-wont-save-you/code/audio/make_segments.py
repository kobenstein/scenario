#!/usr/bin/env python3
"""Film 63 'The Pope Says AI Won't Save You' · vo-v3.txt (approved, fact-checked, 24.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 66 / 59 / 54.
Sections = the stations of text-v3.md, found by the first words of the line that opens them:
  H hook (C1) · 1 the encyclical · 2 the labs' strongest argument · 3 the objection: how the promise sees you · 4 Babel: who decides? · M subscribe 1 (+ bridge question)
  5 work (C3) · 6 a lab on the stage (C4) · 7 the Pope's answer (C5) · 8 counter-voices and verdict · 9 the big answer · A2 closing call (+ end screen).
vo-v3 has no [CLIP] tags: the slots go after the line that ends with their lead-in (CLIP_AFTER). C2 ('We must build') is dropped (clip-auftrag-imac.md): no slot, its lead-in stays unchanged.
A take = consecutive lines of ONE paragraph (blank lines in vo-v3 = paragraph breaks) of ONE section, split at clip slots and at ~MAXC characters.
A take that ends at a blank line inside a section gets 'pause' (build_vo.py: PAUSE gap). Hook and station 1 are one block without a blank line (text-v3: no pause, no music gap).
Voice text: 'AI' -> 'A.I.' (vo-v3 writes 'artificial intelligence' out; rule kept); one voice tag at the start of each paragraph's first take (TAGS per section, PTAGS for later paragraphs;
never [softly]/[whispers]/[quietly]/[hushed], STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text' ('datacenter' spoken as 'data center'; no IPA needed: vo-v3 names no Olah / Magnifica humanitas / Rerum Novarum, and Leo reads right); 'text' = the script words (alignment, subtitles).
Slots: 'dur' here is the PLACEHOLDER length (clips not cut yet, clip-auftrag-imac.md); build_vo.py takes the real length from <clipwav>/Cn.wav once clips_wav.py has cut <ROOT>clips/Cn.mp4.
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, sys
ROOT = os.environ.get('F63ROOT', '/mnt/project-files/scenario/film-papst/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'Artificial intelligence will not save you.'), ('1', 'In May, in Rome'), ('2', 'That promise is not a slogan.'), ('3', 'For the Pope, the catch'),
        ('4', 'His picture for that power'), ('M', 'This channel exists for one reason.'), ('5', 'The last Pope called Leo'), ('6', 'The day the Pope presented'),
        ('7', 'In October the Pope'), ('8', 'The night the letter came out'), ('9', 'None of this arrives by itself.'), ('A2', 'This channel exists so that')]
CLIP_AFTER = [('C1', 'the one the Church uses for nuclear weapons.'), ('C3', 'Ask this one how big the new machines are.'),
              ('C4', 'Guess what he asked for.'), ('C5', 'He needs one sentence.')]
PLACEHOLDER = {'C1': 4.0, 'C3': 9.0, 'C4': 8.0, 'C5': 11.0}   # expected clip lengths (C1 only 'Artificial intelligence needs to be disarmed.')
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', '3': 'thoughtful', '4': 'thoughtful', 'M': 'warm', '5': 'thoughtful',
        '6': 'curious', '7': 'thoughtful', '8': 'calm, conversational', '9': 'thoughtful', 'A2': 'warm'}
PTAGS = {'Tower or wall.': 'curious', 'Perhaps even greater.': 'calm, conversational', 'A builder of these machines': 'thoughtful',
         'Freedom. An inner life.': 'thoughtful'}   # tag for a later paragraph of a section (first words of the paragraph)
SAY = {'datacenter': 'data center'}   # Leo, Babel, Nasdaq, encyclical: Eleven v4 reads them right without IPA (checked by alignment)
MAXC = 520
SPLIT_BEFORE = {'Where is the catch?': 'b'}   # own take (id = previous take + 'b'): inside t05 Eleven v4 (seed 4301) always said "Where's the catch?" (Whisper check 24.11.)
raw = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines()]
seg, n, si, sec, cur, todo, newpar, sub = [], 0, 0, None, [], list(CLIP_AFTER), True, None
def tts(l): return re.sub(r'\bAI\b', 'A.I.', l).replace('A.I..', 'A.I.')
def flush(pause=False):
    global n, cur, newpar, sub
    if not cur: return
    text = '\n'.join(cur).strip(); tag = None
    if newpar:
        tag = TAGS.get(sec) if sec not in [s['sec'] for s in seg if 'text' in s] else next((v for k, v in PTAGS.items() if text.startswith(k)), None)
    if tag: text = f'[{tag}] ' + text
    s = {'id': f't{n - 1:02d}{sub}' if sub else f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = text
    for k, v in SAY.items(): say = re.sub(r'\b' + k + r'\b', v, say)
    if say != text: s['say'] = say
    if pause: s['pause'] = True
    seg.append(s); n += 0 if sub else 1; cur = []; newpar = False; sub = None
for l in raw:
    if not l:   # paragraph break
        if cur: flush(pause=True)
        newpar = True; continue
    l = tts(l)
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1; newpar = True
    elif cur and l in SPLIT_BEFORE: flush(); sub = SPLIT_BEFORE[l]
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if todo and l.endswith(todo[0][1]):
        flush(); c = todo.pop(0)[0]; seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': PLACEHOLDER[c], 'placeholder': True})
flush()
assert si == len(SECS), si
assert not todo, todo
for i, s in enumerate(seg):   # a pause before a section change is the section gap anyway; a pause before a slot is the slot's own air
    if s.get('pause') and (i + 1 == len(seg) or 'clip' in seg[i + 1] or seg[i + 1]['sec'] != s['sec']): del s['pause']
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
assert not re.search(r'\[(softly|whispers?|quietly|hushed)', json.dumps(seg)), 'forbidden tag'
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PAUSE' if s.get('pause') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
