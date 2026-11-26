#!/usr/bin/env python3
"""Film 72 'Why AI Billionaires Are Building Bunkers' (The Good Takeoff) · vo-v4.txt (final) -> segments.json (takes for ElevenLabs v4 + clip slots). Method 1:1 as Film 73.
Sections = the stations (found by the first words of the line that opens them): H hook · 1 the bomb (C1 Altman) · 2 the machine · 3 the chaos (C2 Harris) · 4 us (C3 Rushkoff)
  · M subscribe 1 · 5 the door / the answer (C2b Harris) · E the end (go back to the door) · A2 closing call (+ end screen).
vo-v4 carries one Regie tag at the start of every station ([calm, conversational] [thoughtful] [warm]; never whisper tags, asserted) and the slots as [CLIP Cn: "wording"] lines
(film order C1, C2, C3, C2b). '[pause] ...' at the start of a line = an editorial pause: the take before it gets pause=True (build_vo.py PAUSE 1.2 s), the pause tag itself is never sent to the TTS.
'text' = the script words WITHOUT tags (alignment, subtitles); 'say' = the text sent to Eleven v4 (tags kept) where it differs.
Slot length: the whole cut file <ROOT>clips/Cn.mp4 (ffprobe) once it is there, else clips-geprueft.json duration_s (placeholder, silent slot).
usage: make_segments.py [vo-v4.txt] [out segments.json]"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F72ROOT', '/mnt/project-files/scenario/film-bunker/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v4.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'The people building artificial intelligence'), ('1', 'There are three obvious suspects'), ('2', 'It would make sense.'), ('3', 'Tristan Harris used to work'),
        ('4', 'Some years ago, the writer'), ('M', 'This channel exists'), ('5', 'Remember the answer'), ('E', 'So go back to that door'), ('A2', 'This channel exists')]
SAY = []   # no pronunciation fixes needed (checked per take with Wizper)
MAXC = 520
CTA_END = 'Then subscribe.'
CLIPIDS = ('C1', 'C2', 'C3', 'C2b')   # film order
GEP = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8')); GEP = {c['id']: c for c in (GEP if isinstance(GEP, list) else GEP['clips'])}
def clip_len(c):
    f = f'{ROOT}clips/{c}.mp4'
    if os.path.exists(f): return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f])), 2), False
    return round(float(GEP[c]['duration_s']), 2), True
TAG = re.compile(r'\[(?!CLIP|pause)[^\]]*\]\s*')
raw = open(SRC, encoding='utf8').read()
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', raw, re.I)
assert not bad, bad
lines = [l.strip() for l in raw.splitlines() if l.strip()]
seg, n, si, sec, cur = [], 0, 0, None, []
def flush(pause=False):
    global n, cur
    if not cur: return
    text = '\n'.join(TAG.sub('', l).strip() for l in cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = '\n'.join(cur)
    say = re.sub(r'\bAI\b', 'A.I.', say).replace('A.I..', 'A.I.')
    for k, v in SAY: say = say.replace(k, v)
    if say != text: s['say'] = say
    if pause: s['pause'] = True
    seg.append(s); n += 1; cur = []
for l in lines:
    m = re.match(r'\[CLIP\s+(C\d+[a-z]?)\b', l)
    if m:
        flush(); c = m.group(1); d, ph = clip_len(c)
        seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': d, 'file': f'{c}.mp4', **({'placeholder': True} if ph else {})}); continue
    if l.startswith('[pause]'):
        if cur: flush(pause=True)
        l = l[len('[pause]'):].strip()
    bare = TAG.sub('', l)
    if si < len(SECS) and bare.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if bare.endswith(CTA_END): flush()
flush()
assert si == len(SECS), (si, SECS[si])
assert [s['id'] for s in seg if s.get('clip')] == list(CLIPIDS)
tk = [s for s in seg if 'text' in s]
for s in tk:
    if s['text'].endswith(CTA_END): s['cta'] = True
assert tk[-1].get('cta') and sum(1 for s in tk if s.get('cta')) == 2
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PAUSE' if s.get('pause') else '', 'PLACEHOLDER' if s.get('placeholder') else '', (s.get('text') or '')[:80].replace('\n', ' / '))
