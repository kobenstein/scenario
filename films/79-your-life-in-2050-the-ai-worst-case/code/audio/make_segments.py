#!/usr/bin/env python3
"""Film 74 'Your Life in 2050 If We Get AI Right' · vo-v3.txt -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 63 / 66 / 59.
vo-v3 = one paragraph per line, blank lines between, [CLIP Cn] on its own line (final vo-v3: C6 · C4 · C1).
CLIP SETS (coordinator 25.11.: C6 waited for Jakob's okay under §2.5f; Jakob CONFIRMED C6 on 25.11., the C3 fallback is kept in the code but not used):
  C6 (default) = vo-v3.txt -> audio/segments.json, takes in /tmp/claude-0/f79/audio/dl, timing in audio/timing.json (+ project folder audio/timing.json)
  C3 (fallback) = vo-v2.txt -> audio/variants/C3/segments.json, takes in /tmp/claude-0/f79/audio_c3/dl, timing in audio/variants/C3/timing.json (+ project folder audio/variant-c3/)
  The scenes read the clip set from the timing file (film.mjs clipSet): render the fallback with TIMING=audio/variants/C3/timing.json,
  mix it with mix.py variants/C3 /tmp/claude-0/f79/audio_c3, subtitles with subs.py variants/C3 <out>.
Sections = the stations of text-v2 (same list as tools/provisional_timing.py SECS), found by the first words of the paragraph that opens them.
A take = consecutive paragraphs of ONE section, up to ~MAXC characters, split at clip slots. Paragraphs inside a take are joined with a blank line
(Eleven v4 breathes there); build_vo.py puts GAP_SUB between takes of a section and GAP_SECTION between sections.
Voice text: one tag at the start of each section's first take (TAGS) and of a take that opens on a PTAGS paragraph; never [softly]/[whispers]/[quietly]/[hushed].
'twenty fifty' / 'A.I.' are already spelled for the voice in vo-v3. 'text' = the script words (alignment, subtitles).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, sys
ROOT = os.environ.get('F79ROOT', '/mnt/project-files/scenario/film-79-worst-case/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'This is your life'), ('1', 'Your neighbor builds'), ('2', 'Now you step off'), ('3', "There's a robot on your roof"),
        ('4', 'Nobody is.'), ('M', 'This channel exists for one reason'), ('5', 'But nobody lives on free power'), ('6', 'Nobody does.'),
        ('7', "Next door, the doctor's"), ('8', 'But the biggest thing missing'), ('9', 'Where the cornfields'), ('P', 'The path loops back'),
        ('E', 'Your granddaughter sits down'), ('A2', 'This channel exists so that')]
CLIP_LEN = {'C1': 6.65, 'C3': 7.18, 'C4': 8.42, 'C6': 9.52}   # the cuts in /tmp/claude-0/f79/clips (spoken sentence + .3 s handles; C3 starts .12 s after 'that'; C6 = file 1.03-10.55 s, starts on 'So,')
TAGS = {'H': 'calm, conversational', '1': 'warm', '2': 'calm, conversational', '3': 'curious', '4': 'calm, conversational', 'M': 'warm',
        '5': 'calm, conversational', '6': 'thoughtful', '7': 'warm', '8': 'curious', '9': 'thoughtful', 'P': 'thoughtful', 'E': 'warm', 'A2': 'warm'}
PTAGS = {'"What was this for?"': 'curious', '"What else did you worry about?"': 'curious', 'It was never guaranteed.': 'thoughtful',
         'In twenty fifty, the hardest thing': 'thoughtful', 'She winds the old clock': 'warm'}
OWN = {'"What was this for?"', '"What else did you worry about?"'}   # the granddaughter's lines: own short take (her question gets air on both sides)
MAXC = 430
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\]')
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur = [], 0, 0, None, []
def flush():
    global n, cur
    if not cur: return
    text = '\n\n'.join(cur); tag = None
    if not any(s.get('sec') == sec and 'text' in s for s in seg): tag = TAGS[sec]
    else: tag = next((v for k, v in PTAGS.items() if cur[0].startswith(k)), None)
    s = {'id': f't{n:02d}', 'sec': sec, 'text': (f'[{tag}] ' if tag else '') + text, 'chars': len(text)}
    seg.append(s); n += 1; cur = []
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        flush(); c = m.group(1); seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': CLIP_LEN[c]}); continue
    if si < len(SECS) and l.startswith(SECS[si][1]):
        flush(); sec = SECS[si][0]; si += 1
    elif cur and (l in OWN or cur[-1] in OWN or any(l.startswith(k) for k in PTAGS)): flush()
    elif cur and sum(len(x) + 2 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
flush()
assert si == len(SECS), (si, SECS[si])
tk = [s for s in seg if 'text' in s]
tk[-2]['cta'] = True   # 'This channel exists so that ... subscribe.' (the last take is the clock coda)
next(s for s in tk if s['sec'] == 'M')['cta'] = True
assert not re.search(r'\[(softly|whispers?|quietly|hushed)', json.dumps(seg)), 'forbidden tag'
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'CTA' if s.get('cta') else '', (s.get('text') or '')[:80].replace('\n', ' / '))
