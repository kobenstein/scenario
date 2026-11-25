#!/usr/bin/env python3
"""Film 79 'Your Life in 2050: The AI Worst Case' · vo-v2.txt -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 74 / 63 / 66 / 59.
vo-v2 = one paragraph per line, [CLIP Cn] on its own line (order in the film: C2 · C1 · C3 · C4), director tags in [..] at the start of a paragraph.
Voice text = script text: 'twenty fifty' and 'A.I.' are already spelled for the voice in vo-v2. The script's own director tags are used as ElevenLabs v4 audio tags
([calm, conversational] / [thoughtful] / [curious]); a section's first take without a script tag gets [calm, conversational]. NEVER [softly]/[whispers]/[quietly]/[hushed].
Sections = the chunk letters of data/rows.json (H B D K N G L Q E W), found by the first words of the paragraph that opens them.
A take = consecutive paragraphs of ONE section, up to ~MAXC characters, split at clip slots, at a paragraph that carries its own script tag, and around the grandson's lines
(own short take: her/his line gets air on both sides). Paragraphs inside a take are joined with a blank line (Eleven v4 breathes there);
build_vo.py puts GAP_SUB between takes of a section and GAP_SECTION between sections.
'text' = the script words incl. the tag in brackets (align_ps / check_takes strip it); subs.py turns 'twenty fifty' -> 2050 and 'A.I.' -> AI.
usage: make_segments.py [vo-v2.txt] [out segments.json]"""
import json, os, re, sys
ROOT = os.environ.get('F79ROOT', '/mnt/project-files/scenario/film-79-worst-case/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v2.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'This is your life'), ('B', 'Your neighbor used to build'), ('D', 'Most of those crates'), ('K', 'You get home just as'),
        ('N', 'Noon. The whole street'), ('G', 'This channel exists for one reason'), ('L', 'So the children are content'), ('Q', 'That leaves one place'),
        ('E', 'Then your grandson sits down'), ('W', "But it isn't twenty fifty")]
CLIP_LEN = {'C1': 5.95, 'C2': 7.90, 'C3': 6.75, 'C4': 10.50}   # in/out of docs/CLIPS-infile.md (placeholder length only; build_vo.py reads the real clip wavs)
DEFAULT_TAG = 'calm, conversational'
OWN = {'"What was this for?"', '"Why didn\'t anyone stop it?"'}   # the grandson's lines: own short take
MAXC = 430
VOICE_FIX = {'has a stake in A.I. Asked': ('has a stake in A. I. Asked', 4302)}   # t27: v4 read 'A.I. Asked' as 'it. I asked' with seed 4301 AND 4302; spelled 'A. I.' + seed 4302 it is right (wizper-checked). 'text' (alignment, subtitles) keeps the script words.
SPLIT_BEFORE = ('Tonight, your alarm clock',)   # the clock coda is its own take (a long beat before it, build_vo GAP_AFTER)
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\]')
TAG = re.compile(r'^\[([^\]]+)\]\s*')
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, curtag = [], 0, 0, None, [], None
def flush():
    global n, cur, curtag
    if not cur: return
    text = '\n\n'.join(cur); first = not any(s.get('sec') == sec and 'text' in s for s in seg)
    tag = curtag or (DEFAULT_TAG if first else None)
    s = {'id': f't{n:02d}', 'sec': sec, 'text': (f'[{tag}] ' if tag else '') + text, 'chars': len(text)}
    for k, (v, sd) in VOICE_FIX.items():
        if k in text: s['voice'] = s['text'].replace(k, v); s['seed'] = sd
    seg.append(s); n += 1; cur = []; curtag = None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        flush(); c = m.group(1); seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': CLIP_LEN[c]}); continue
    tm = TAG.match(l); tag = tm.group(1) if tm else None; body = TAG.sub('', l)
    if si < len(SECS) and body.startswith(SECS[si][1]):
        flush(); sec = SECS[si][0]; si += 1
    elif cur and (body in OWN or cur[-1] in OWN or tag or body.startswith(SPLIT_BEFORE)): flush()
    elif cur and sum(len(x) + 2 for x in cur) + len(body) > MAXC: flush()
    if not cur: curtag = tag
    cur.append(body)
flush()
assert si == len(SECS), (si, SECS[si])
tk = [s for s in seg if 'text' in s]
for s in tk:
    if 'This channel exists' in s['text']: s['cta'] = True
assert sum(1 for s in tk if s.get('cta')) == 2
assert not re.search(r'\[(softly|whispers?|quietly|hushed)', json.dumps(seg)), 'forbidden tag'
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'CTA' if s.get('cta') else '', (s.get('text') or '')[:90].replace('\n', ' / '))
