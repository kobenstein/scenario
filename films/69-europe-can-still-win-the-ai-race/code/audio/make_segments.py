#!/usr/bin/env python3
"""Film 67 'Meta's AI chief says superintelligence is arriving' · vo-v2.txt (final 23.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 66 / 59.
Sections = the stations of the film, found by the first words of the line that opens them (voice tags stripped):
  H hook · 1 the man (Wang, C1) · 2 check 1 the evidence (Lean, C2) · 3 check 2 the right thing · 4 check 3 was it the A.I. · 5 check 4 understood (Tao, C3)
  M subscribe 1 · 6 check 5 superintelligence? (Maynard, LeCun C4) · 7 the handover (town hall) · 8 who builds the referees · 9 the verdict · A2 closing call (+ end screen).
vo-v2 has [CLIP Cn] lines: a slot goes there. EXTRA_CLIPS (env F69_C0="lead-in line end", e.g. "listen to the mathematician himself.") adds a slot after a line
that ends with that text (planned C0, the mathematician) without touching the script.
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters. The script's own voice tags ([calm, conversational], [thoughtful],
[curious], [warm], [pause]) stay in the text (never whisper tags, STANDARD-STIMME.md); align_ps.py drops [..] for the alignment.
'say' = the text sent to Eleven v4 where it differs from 'text' (respellings for names, only in the TTS text); 'text' = the script words (alignment, subtitles).
Slot length: the real clip file in CLIPS (<ROOT>clips/Cn.*, ffprobe) when it is there, else the PLANNED length (silent placeholder).
usage: make_segments.py [vo-v2.txt] [out segments.json]"""
import glob, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F69ROOT', '/mnt/project-files/scenario/film-europa-ki/').rstrip('/') + '/'
CLIPS = os.environ.get('F69CLIPS', '/mnt/project-files/scenario/film-europa-ki/clips').rstrip('/')
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v2.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'Superintelligence is arriving. That'), ('1', 'The man is Alexandr Wang'), ('2', 'First check:'), ('3', 'But a referee only rules'),
        ('4', 'But whose work is it?'), ('5', "That leaves Wang's boldest"), ('M', 'This channel exists for one reason'), ('6', "But Wang's headline"),
        ('7', 'Not like a coup.'), ('8', 'The labs could.'), ('9', 'Superintelligence is arriving. So, is he right?'), ('A2', 'This channel exists so that')]
PLANNED = {'C0': 10.0, 'C1': 10.0, 'C2': 8.0, 'C3': 10.0, 'C4': 8.0}   # placeholder lengths until the real cuts are in CLIPS
EXTRA_CLIPS = [('C0', os.environ['F69_C0'])] if os.environ.get('F69_C0') else []
# pronunciation, TTS text only (Eleven v4 reads IPA between slashes): Alexandr is said 'Alexander', Wang /wɑːŋ/, Riemann REE-mahn, Yann LeCun yan luh-KUN,
# Tao rhymes with 'how'; Maynard, Lean, M.I.T. as written
SAY = [('Alexandr Wang', 'Alexander /wɑːŋ/'), ("Wang's", "/wɑːŋz/"), ('Wang', '/wɑːŋ/'), ('Riemann', '/ˈriːmɑːn/'), ('Yann LeCun', '/jæn ləˈkʌn/'),
       ('Terence Tao', 'Terence /taʊ/'), ('Tao,', '/taʊ/,')]
MAXC = 520
CLIP = re.compile(r'^\[CLIP\s+(C\d+)\]$')
TAG = re.compile(r'\[[^\]]*\]\s*')
def cliplen(c):
    fs = [f for f in sorted(glob.glob(f'{CLIPS}/{c}.*')) if f.rsplit('.', 1)[1].lower() in ('mp4', 'mov', 'm4a', 'wav', 'mp3', 'mkv', 'webm')]
    if not fs: return PLANNED[c], None
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fs[0]])), 2), os.path.basename(fs[0])
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, todo = [], 0, 0, None, [], list(EXTRA_CLIPS)
def flush():
    global n, cur
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = text
    for k, v in SAY: say = say.replace(k, v)
    if say != text: s['say'] = say
    seg.append(s); n += 1; cur = []
def slot(c):
    d, f = cliplen(c)
    seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': d, **({'file': f} if f else {'placeholder': True})})
for l in lines:
    m = CLIP.match(l)
    if m: flush(); slot(m.group(1)); continue
    bare = TAG.sub('', l)
    if si < len(SECS) and bare.startswith(SECS[si][1]):
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if todo and l.endswith(todo[0][1]): flush(); slot(todo.pop(0)[0])
flush()
assert si == len(SECS), (si, SECS[si])
assert not todo, todo
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', open(SRC, encoding='utf8').read(), re.I)
assert not bad, bad
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', s.get('file', 'PLACEHOLDER' if s.get('placeholder') else ''), (s.get('text') or '')[:70].replace('\n', ' / '))
