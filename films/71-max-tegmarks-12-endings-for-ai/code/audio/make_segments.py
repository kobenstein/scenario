#!/usr/bin/env python3
"""Film 71 "Max Tegmark's 12 Endings for AI" · text-v2.md (approved by Jakob 25.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 69 (66 / 67).
The script itself is parsed: everything in square brackets is direction (multi-line [ ... ] blocks with the '## ' station headings, one-line [BILD ...], [CLIP Cn ...],
[PAUSE 1 s]); everything else is narrator text, word for word the same as vo-v2.txt (asserted below).
Sections = the stations of text-v2.md, in order (heading prefix -> id):
  H hook (C1 Tegmark) · 12 Conquerors (C2 Ball) · 11 Self-Destruction · 10 Zookeeper · 9 1984 · 8 Descendants (C4 Tegmark) · 7 Enslaved God · M subscribe 1 ·
  6 Reversion · 5 Benevolent Dictator · 4 Gatekeeper · 3 Libertarian Utopia · 2 Protector God · 1 Egalitarian Utopia · S closing (C5 Altman, C6 Tegmark) · A2 subscribe 2 (+ end screen).
Slots C1, C2, C4, C5, C6 sit where the [CLIP Cn] lines stand (C3 is not in the film). [PAUSE 1 s] = 'pause' on the take before it (build_vo.py adds 1 s to that gap).
A take = consecutive lines of ONE section, split at clip slots, at PAUSE marks and, where a run is longer than MAXC characters, into the fewest balanced takes (parts()).
Voice text: one voice tag at the start of each section's first take (TAGS; never whisper/soft tags, STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text': 'AI' -> 'A.I.' (spelled; 'OpenAI' stays), TTS text only; 'text' = the script words (alignment, subtitles).
Names (Tegmark, Hugging Face, Ball, Altman, Malta, Amish, Orwell, Nineteen Eighty-Four, MIT, ChatGPT) go as written: checked by ear-substitute (Wizper transcript) after the takes.
Slot length: the cut <scratch>/cut/Cn.mp4 (cut_clips.py from films/71-assets/clips/Cn.mp4 + clips-geprueft-imac.json; ffprobe) when it is there, else the PLANNED length (silent placeholder, text-v2 Anhang A estimates).
usage: make_segments.py [text-v2.md] [out segments.json]"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F71ROOT', '/mnt/project-files/scenario/film-tegmark/').rstrip('/') + '/'
CLIPS = os.environ.get('F71CUT', '/tmp/claude-0/f71/audio/cut').rstrip('/')   # the cuts from cut_clips.py (source: films/71-assets/clips/Cn.mp4)
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'text-v2.md'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', '0 · HOOK'), ('12', 'ENDING 12/12'), ('11', 'ENDING 11/12'), ('10', 'ENDING 10/12'), ('9', 'ENDING 9/12'), ('8', 'ENDING 8/12'), ('7', 'ENDING 7/12'),
        ('M', 'ABO-AUFRUF 1'), ('6', 'ENDING 6/12'), ('5', 'ENDING 5/12'), ('4', 'ENDING 4/12'), ('3', 'ENDING 3/12'), ('2', 'ENDING 2/12'), ('1', 'ENDING 1/12'),
        ('S', 'SCHLUSS'), ('A2', 'ABO-AUFRUF 2')]
CLIP_IDS = ['C1', 'C2', 'C4', 'C5', 'C6']
PLANNED = {'C1': 6.0, 'C2': 6.0, 'C4': 6.0, 'C5': 9.0, 'C6': 5.0}   # placeholder lengths until the real cuts are in CLIPS
TAGS = {'H': 'calm, conversational', '12': 'thoughtful', '11': 'thoughtful', '10': 'calm, conversational', '9': 'thoughtful', '8': 'thoughtful', '7': 'curious',
        'M': 'warm', '6': 'calm, conversational', '5': 'curious', '4': 'thoughtful', '3': 'calm, conversational', '2': 'thoughtful', '1': 'warm', 'S': 'thoughtful', 'A2': 'warm'}
SAY = []   # (script, TTS) pairs, TTS text only; empty after the name check (see README)
MAXC = 520
def clip_len(c):
    fs = [f for f in sorted(os.listdir(CLIPS)) if f == f'{c}.mp4'] if os.path.isdir(CLIPS) else []
    if not fs: return PLANNED[c], None
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{CLIPS}/{fs[0]}'])), 2), fs[0]
raw = open(SRC, encoding='utf8').read()
# parse text-v2.md: a block opened by a line '[' runs to a line ']'; the appendix starts in the block with '# Anhang'
items, block, head = [], False, None   # items: ('sec', id) | ('line', text) | ('clip', id) | ('pause',)
for l in raw.splitlines():
    s = l.strip()
    if block:
        if s.startswith('# Anhang'): break
        if s.startswith('## '):
            k = next((i for i, p in SECS if s[3:].startswith(p)), None)
            if k: items.append(('sec', k))
        if s == ']': block = False
        continue
    if s == '[': block = True; continue
    if not s: continue
    if s.startswith('['):
        assert s.endswith(']'), s[:60]
        m = re.match(r'\[CLIP (C\d)\b', s)
        if m: items.append(('clip', m.group(1)))
        elif s.startswith('[PAUSE'): items.append(('pause',))
        continue
    items.append(('line', s))
spoken = [x[1] for x in items if x[0] == 'line']
vo = [l.strip() for l in open(ROOT + 'vo-v2.txt', encoding='utf8') if l.strip()]
assert spoken == vo, next((a, b) for a, b in zip(spoken, vo) if a != b)   # narrator text = vo-v2.txt, line by line
assert [x[1] for x in items if x[0] == 'sec'] == [i for i, _ in SECS], [x[1] for x in items if x[0] == 'sec']
assert [x[1] for x in items if x[0] == 'clip'] == CLIP_IDS
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', ' '.join(TAGS.values()), re.I)
assert not bad, bad
seg, n, sec, cur = [], 0, None, []
def parts(ls):
    """split a run of lines into the fewest takes of <= MAXC chars, balanced (min of the longest take), at line boundaries"""
    L = [len(x) + 1 for x in ls]; k = 1
    while True:
        best = None
        def rec(i, k, acc):
            nonlocal best
            if k == 1:
                c = acc + [ls[i:]]; m = max(sum(len(x) + 1 for x in p) for p in c)
                if m <= MAXC + 40 and (best is None or m < best[0]): best = (m, c)
                return
            for j in range(i + 1, len(ls) - k + 2): rec(j, k - 1, acc + [ls[i:j]])
        rec(0, k, [])
        if best and (k > 1 or sum(L) <= MAXC): return best[1]
        k += 1
def flush(pause=False):
    global cur
    if not cur:
        if pause and seg: seg[-1]['pause'] = True
        return
    ps = parts(cur)
    for i, p in enumerate(ps): take(p, pause and i == len(ps) - 1)
    cur = []
def take(ls, pause):
    global n
    text = '\n'.join(ls).strip()
    if sec not in [s['sec'] for s in seg if 'text' in s] and TAGS.get(sec): text = f'[{TAGS[sec]}] ' + text
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = re.sub(r'\bAI\b', 'A.I.', text).replace('A.I..', 'A.I.')
    for k, v in SAY: say = say.replace(k, v)
    if say != text: s['say'] = say
    if pause: s['pause'] = True
    seg.append(s); n += 1
for it in items:
    if it[0] == 'sec': flush(); sec = it[1]
    elif it[0] == 'pause': flush(pause=True)
    elif it[0] == 'clip':
        flush(); d, f = clip_len(it[1])
        seg.append({'id': it[1], 'sec': sec, 'clip': True, 'dur': d, **({'file': f} if f else {'placeholder': True})})
    else: cur.append(it[1])
flush()
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PAUSE' if s.get('pause') else '', s.get('file', 'PLACEHOLDER' if s.get('placeholder') else ''), (s.get('text') or '')[:70].replace('\n', ' / '))
