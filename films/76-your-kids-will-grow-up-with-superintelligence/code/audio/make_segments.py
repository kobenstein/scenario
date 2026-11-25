#!/usr/bin/env python3
"""Film 76 'Your Kids Will Grow Up With Superintelligence' (The Good Takeoff) · vo-v3.txt (fact-checked 25.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 68 / 67 / 66.
Sections = the stations of the film (ids as tools/provisional_timing.py, which the picture code was written against; found by the first words of the line that opens them):
  H hook (kitchen table, the question) · 0 age 0 (the clock, the first fear) · 6 age 6 (tutor, C1 Gopnik) · 12 age 12 (the machine friend) · M subscribe 1 · 18 age 18 (C2 Susskind) ·
  30 age 30 (the Tuesday, C4 Acemoglu) · T tips for the kitchen table (C5 Susskind) · S the kitchen table again · A2 closing call (+ end screen).
vo-v3 carries its Regie tags ([calm, conversational] [thoughtful] [curious] [wry]; never whisper tags, asserted) and [CLIP Cn: ...] lines (a slot goes there).
'text' = the script words WITHOUT tags (alignment, subtitles); 'say' = the text sent to Eleven v4 (tags kept, pronunciation fixes from SAY).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import glob, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F76ROOT', '/mnt/project-files/scenario/film-76-kinder/').rstrip('/') + '/'
CLIPS = os.environ.get('F76CLIPS', '/tmp/claude-0/f76/clips').rstrip('/')
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'Your kids will grow up'), ('0', 'To see which ones'), ('6', 'Six years later'), ('12', 'Twelve.'), ('M', 'But a shift like that'),
        ('18', 'Eighteen.'), ('30', 'Thirty.'), ('T', 'So what does a parent do'), ('S', 'And at your kitchen table, your child is still'), ('A2', "That's what this channel is for")]
PLANNED = {'C1': 17.0, 'C2': 7.0, 'C4': 11.1, 'C5': 9.0}   # placeholder lengths until the real cuts are in CLIPS
EXTRA_CLIPS = []
SAY = []   # TTS-only pronunciation fixes (none needed so far; checked per take with Whisper)
# a take ends here and the next one starts after a longer pause (PAUSE in build_vo.py): the child's question, the beat after "no safe answer", the subscribe call (own take = channel_calls)
PAUSE_AFTER = ('grow up?"', 'What should I be?"', 'There is no safe answer.', 'Then subscribe.')
MAXC = 520
CLIP = re.compile(r'^\[CLIP\s+(C\d+)\b')
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
    text = '\n'.join(TAG.sub('', l).strip() for l in cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = '\n'.join(cur)
    for k, v in SAY: say = say.replace(k, v)
    if any(text.endswith(p) for p in PAUSE_AFTER): s['pause'] = True
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
    elif l.endswith(PAUSE_AFTER): flush()
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
