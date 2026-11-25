#!/usr/bin/env python3
"""Film 68 'The AI Race Will Be Decided by 2027' · vo-v3.txt (fact-checked 24.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 67 / 66.
Sections (found by the first words of the line that opens them):
  H hook (scoreboard, 2:2, third lane) · 1 who says 2027 (AI Futures Project, the moment) · R1 round 1 the smartest AI (C1 Schmidt) · R2 round 2 the chips
  · R3 round 3 the power · R4 round 4 free models + robots, 2:2 · M subscribe 1 · 5 the finish line, METR, Aschenbrenner, the third runner (C4 Kokotajlo)
  · 6 a way out? Amodei, a different race (C5 Chan), the channel, Shenzhen · 9 who wins · A2 closing call (+ end screen).
vo-v3 has [CLIP Cn: ...] lines: a slot goes there. Voice tags are NOT in vo-v3: TAGS below prefixes a few paragraphs in the TTS text only (STANDARD-STIMME.md,
sparse, never whisper tags). 'say' = the text sent to Eleven v4; 'text' = the script words (alignment, subtitles).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import glob, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F68ROOT', '/mnt/project-files/scenario/film-ai-race/').rstrip('/') + '/'
CLIPS = os.environ.get('F68CLIPS', '/tmp/claude-0/f68/clips').rstrip('/')
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'produktion/vo-final.txt'   # vo-v3 + clip decisions 24.11. (C4 bridge shortened)
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'The A.I. race will be decided'), ('1', 'So who says twenty twenty-seven?'), ('R1', "So who's in front?"), ('R2', 'A.I. runs on chips.'),
        ('R3', 'So how does this end in a tie?'), ('R4', 'One thing first, to be fair.'), ('M', 'However this tie breaks'), ('5', 'So the finish line decides it.'),
        ('6', 'So is there a way out of that trap?'), ('9', 'So who wins the A.I. race?'), ('A2', "That's what this channel is for")]
PLANNED = {'C1': 10.0, 'C4': 18.4, 'C5': 7.1}   # placeholder lengths until the real cuts are in CLIPS
EXTRA_CLIPS = []
# TTS-only voice tags (first words of a paragraph -> tag), sparse; pronunciation respellings none needed
TAGS = {'The A.I. race will be decided': '[calm, conversational]', 'So who wins? America': '[curious]', "That's their forecast.": '[thoughtful]',
        "It's not an official record.": '[wry]', 'But this finish line has a catch.': '[thoughtful]', 'So who wins the A.I. race?': '[thoughtful]',
        'However this tie breaks': '[calm, conversational]', "That's what this channel is for": '[calm, conversational]'}
SAY = [('Two–nothing', 'Two-nothing')]
PAUSE_AFTER = ('And the third lane is still dark.', 'smarter than they are.', 'And it could beat them both.', 'your rival writes the rules.')
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
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = '\n'.join(next((v + ' ' for k, v in TAGS.items() if l.startswith(k)), '') + l for l in cur)
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
assert all(t in open(SRC).read() for t in TAGS), [t for t in TAGS if t not in open(SRC).read()]
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', s.get('file', 'PLACEHOLDER' if s.get('placeholder') else ''), (s.get('text') or '')[:70].replace('\n', ' / '))
