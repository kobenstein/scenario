#!/usr/bin/env python3
"""Film 26 'Why Elon Says Saving Money Is Pointless': vo-v3.txt -> audio/segments.json (method as tools/f25_make_segments.py).
Source format: one sentence or more per line, blank line = new paragraph, [CLIP Cn] on its own line = silent interview-clip slot (length from clips.json dauer_s),
a leading [pause] = 1.2 s of air before that sentence (set as 'pause' on the take before), other leading tags ([calm, conversational], [thoughtful], [warm]) stay in the take text.
A new take starts: at a paragraph, after a slot or [pause], at every section opener (SECS = tools/provisional_timing.py), and after ~560 characters. A take with 'subscribe' is cta1/cta2.
Never softly/whisper/quiet/hushed (Jakob 8.11.).   usage: f26_make_segments.py <vo-v3.txt> <audio_dir> [clips.json]"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
CJ = sys.argv[3] if len(sys.argv) > 3 else '/mnt/project-files/scenario/film-sparen/clips.json'
PLAN = {c['id']: float(c['dauer_s']) for c in json.load(open(CJ))['clips'] if c.get('kandidat', 'Empfehlung') == 'Empfehlung'}
SECS = [('H', 'Elon Musk says saving money'), ('1', 'Last winter, on a podcast'), ('2', 'The first line is where'), ('3', 'Everything gets cheap'),
        ('4', 'Someone pays you an income'), ('5', 'It arrives in time'), ('6', "If he's wrong, you're still fine"), ('7', 'There is'), ('8', 'The five lines, then')]
MAXC = 560
segs, cur, sec, si, pend_pause, newpar = [], None, 'H', 0, False, True
for raw in open(src, encoding='utf8').read().split('\n'):
    l = raw.strip()
    if not l: newpar = True; cur = None; continue
    m = re.fullmatch(r'\[CLIP\s+(C\d+)[^\]]*\]', l)
    if m: segs.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': PLAN[m.group(1)]}); cur = None; newpar = True; continue
    pm = re.match(r'\[pause[^\]]*\]\s*', l, re.I)
    if pm:
        l = l[pm.end():]
        if segs: segs[-1]['pause'] = True
        cur = None
    opener = si < len(SECS) and re.sub(r'^(\[[^\]]*\]\s*)+', '', l).startswith(SECS[si][1])
    if opener: sec = SECS[si][0]; si += 1
    if cur is None or opener or len(cur['text']) + len(l) > MAXC:
        cur = {'id': '?', 'sec': sec, 'text': l}; segs.append(cur)
    else: cur['text'] += '\n' + l
    newpar = False
assert si == len(SECS), 'sections not all found'
nc = k = 0
for s in segs:
    if 'text' not in s: continue
    if 'subscribe' in s['text'].lower(): nc += 1; s['id'] = f'cta{nc}'; s['cta'] = True
    else: s['id'] = f's{k:02d}'; k += 1
    assert not re.search(r'softly|whisper|quietly|hushed|\bAI\b|A\.I\.', s['text'], re.I), s['id']
    s['chars'] = len(s['text'])
json.dump(segs, open(A + '/segments.json', 'w'), indent=1, ensure_ascii=False)
for s in segs: print(s['id'], s['sec'], s.get('chars', ''), 'pause' if s.get('pause') else '', '|', (s.get('text') or ('SLOT ' + str(s['dur'])))[:70].replace('\n', ' / '))
print(sum(s.get('chars', 0) for s in segs), 'chars,', sum(1 for s in segs if 'text' in s), 'takes')
