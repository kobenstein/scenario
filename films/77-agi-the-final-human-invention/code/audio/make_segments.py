#!/usr/bin/env python3
"""Film 77 'AGI: The Final Human Invention' · vo-v4.txt (25.11., final) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 63 / 66 / 59 / 54.
Sections = the paragraphs of vo-v3, found by the first words of the line that opens them:
  H hook (dots on a page, the final invention) · 1 the promise (Good, Bletchley, C1 Hassabis, your list of four lines) · 2 energy (line one) · 3 materials (line two, C2 Periodic Labs)
  M subscribe call 1 · 4 mathematics (line three, C3 Tao) · 5 control (line four: Good's condition, Turing, rules, C4 Christiano) · 6 what is left for us (Liam Price) + the closing lines · A2 closing call (+ end screen).
The clip slots are the [CLIP C1]..[CLIP C4] lines of vo-v3.txt (not spoken): a slot is created exactly where the tag stands. Their lengths are NOT here: see clips_cfg.json 'placeholder'
(10 s each until the real files are in) - the single place to change them is clips_cfg.json (build_vo.py reads the real length from clipwav/Cn.wav once it exists).
A take = consecutive lines of ONE paragraph (blank lines in vo-v3 = paragraph breaks) of ONE section, split at clip slots and at ~MAXC characters.
A take that ends at a blank line inside a section gets 'pause' (build_vo.py: PAUSE gap). Hook and station 1 are one block without a blank line (text-v3: no pause, no music gap).
Voice text: 'AI' -> 'A.I.' (vo-v3 writes 'artificial intelligence' out; rule kept); one voice tag at the start of each paragraph's first take (TAGS per section, PTAGS for later paragraphs;
never [softly]/[whispers]/[quietly]/[hushed], STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text' ('datacenter' spoken as 'data center'; no IPA needed: vo-v3 names no Olah / Magnifica humanitas / Rerum Novarum, and Leo reads right); 'text' = the script words (alignment, subtitles).
Slots: 'dur' here is the PLACEHOLDER length (clips not cut yet, clip-auftrag-imac.md); build_vo.py takes the real length from <clipwav>/Cn.wav once clips_wav.py has cut <ROOT>clips/Cn.mp4.
usage: make_segments.py [vo-v4.txt] [out segments.json]"""
import json, os, re, sys
ROOT = os.environ.get('F77ROOT', '/mnt/project-files/scenario/film-77-turing/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v4.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'A.G.I. may be the final human invention.'), ('1', 'Here is the promise.'), ('2', 'Start with the one you pay for every month.'), ('3', 'Because energy is only as good'),
        ('M', 'This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. So that'), ('4', 'Why still small?'),
        ('5', 'This is where the second half'), ('6', 'And if the machine does the inventing'), ('A2', 'That line needs many hands.')]
CLIPS = ['C1', 'C2', 'C3', 'C4']
CFG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'clips_cfg.json')))
PLACEHOLDER = {c: CFG[c]['placeholder'] for c in CLIPS}   # placeholder length per slot: clips_cfg.json (the one place)
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', '3': 'thoughtful', 'M': 'warm', '4': 'curious', '5': 'thoughtful',
        '6': 'thoughtful', 'A2': 'warm'}   # one tag per paragraph = per section; no whisper tags (STANDARD-STIMME.md)
PTAGS = {}   # tag for a later paragraph of a section (first words of the paragraph): none, each section is one paragraph
# 'say' = text sent to Eleven v4 where it differs from the script words. Tao is pronounced 'Dow'; OpenAI read as letters.
SAY = {'Tao': 'Dow', 'Erdős': 'Airdush', 'OpenAI': 'Open A.I.', 'ChatGPT': 'Chat G.P.T'}
MAXC = 520
SPLIT_BEFORE = {}   # own take (id = previous take + 'b') for a line Eleven v4 keeps misreading inside a longer take
raw = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines()]
seg, n, si, sec, cur, newpar, sub = [], 0, 0, None, [], True, None
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
    m = re.fullmatch(r'\[CLIP (C\d)\]', l)
    if m:   # clip slot exactly where the tag stands
        flush(); c = m.group(1); seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': PLACEHOLDER[c], 'placeholder': True}); continue
    l = tts(l)
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1; newpar = True
    elif cur and l in SPLIT_BEFORE: flush(); sub = SPLIT_BEFORE[l]
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
flush()
assert si == len(SECS), si
assert [x['id'] for x in seg if 'clip' in x] == CLIPS
for i, s in enumerate(seg):   # a pause before a section change is the section gap anyway; a pause before a slot is the slot's own air
    if s.get('pause') and (i + 1 == len(seg) or 'clip' in seg[i + 1] or seg[i + 1]['sec'] != s['sec']): del s['pause']
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
assert not re.search(r'\[(softly|whispers?|quietly|hushed)', json.dumps(seg)), 'forbidden tag'
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PAUSE' if s.get('pause') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
