#!/usr/bin/env python3
"""Split the VO text into audio/segments.json: one TTS segment per paragraph (blank-line separated), long
paragraphs split further at SPLIT phrases (~300-650 characters per take, as in Film 14).
Film 23: input is audio/vo-v5-tts.txt (= vo-v5.txt word for word, plus direction tags, a few "..." and "A.I." for "AI");
sections 0-7 are the clock chapters of text-v5.md (0 hook, 1 06:15, 2 07:30, 3 09:00, 4 12:00, 5 16:00, 6 19:00 dinner, 7 22:30);
each blank-line paragraph is one take (the dinner dialogue is grouped into takes of several lines);
a line [CLIP K1] becomes a silent clip slot of the clip's length (audio/clips.json "dur"), filled later by mix.py from clips/K1.wav.
Film 16: [[QUOTE CARD: …]] lines get NO silent slot (the VO paraphrases every card and keeps running while it is on screen);
they are only listed on their segment under "cards" (with the spoken line they follow), like [[ON SCREEN: …]] under "onscreen".
[pause] lines are not sent to TTS: build_vo.py makes that air (GAP_AFTER / BREATH).
usage: make_segments.py <vo.txt> <audio_dir>"""
import json, os, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
CLIPS = json.load(open(A + '/clips.json')) if os.path.exists(A + '/clips.json') else {}
# section starts: (section, first words of the line that opens it, tags stripped); Film 18 = stations of provisional_timing.py
SECS = [('0', 'Your twenty thirty-seven has already started. This is one day'), ('1', 'You open the scan'), ('2', 'Seven-thirty.'),
        ('3', "Nine o'clock."), ('4', 'Noon. Your agent'), ('5', "Four o'clock."), ('6', "Seven o'clock."), ('7', 'Ten-thirty.')]
# a new take starts at these phrases (inside a paragraph)
SPLIT = []
# paragraphs that stay in the previous take (build_vo.py BREATH adds the air)
MERGE = []
TAG = re.compile(r'^\[[^\[\]]*\]\s*')
txt = open(src).read()
for w in SPLIT: txt = re.sub(r'(?<=\S) +(' + re.escape(w) + ')', r'\n\1', txt)
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', txt) if p.strip()]
segs, sec, n = [], None, 0
def new(lines, cards, ons):
    global n
    segs.append({'id': f's{n:02d}', 'sec': sec, 'text': '\n'.join(lines)}); n += 1
    if cards: segs[-1]['cards'] = cards
    if ons: segs[-1]['onscreen'] = ons
for p in paras:
    m = re.fullmatch(r'\[CLIP (\w+)\]', p[0]) if len(p) == 1 else None
    if m:   # Film 23: interview clip slot (silent here)
        k = m.group(1); c = CLIPS[k]
        segs.append({'id': k, 'sec': sec, 'clip': True, 'dur': c['dur'], 'name': c['speaker'], 'role': c['role'],
                     'label': f"ORIGINAL FOOTAGE · {c['speaker']}, {c['year']}", 'text': c['transcript'], 'file': f'clips/{k}.wav',
                     'url': c['url'], 'in': c['in'], 'out': c['out']}); continue
    cur, cards, ons = [], [], []
    merge = any(TAG.sub('', l).startswith(w) for l in p[:1] for w in MERGE)
    for l in p:
        m = re.fullmatch(r'\[\[(QUOTE CARD|ON SCREEN):\s*(.*)\]\]', l)
        if m:
            (ons if m.group(1) == 'ON SCREEN' else cards).append({'text': m.group(2), 'after': cur[-1] if cur else ''}); continue
        if re.fullmatch(r'\[pause\]', l, flags=re.I): continue
        bare = TAG.sub('', l)
        hit = next((s for s, w in SECS if bare.startswith(w)), None)
        if (hit or any(bare.startswith(w) for w in SPLIT)) and cur:
            new(cur, cards, ons); cur, cards, ons = [], [], []
        if hit: sec = hit
        if sec is None: raise SystemExit('text before first section: ' + l)
        cur.append(l)
    if not cur: continue
    if merge:
        segs[-1]['text'] += '\n' + '\n'.join(cur)
        if cards: segs[-1].setdefault('cards', []).extend(cards)
        if ons: segs[-1].setdefault('onscreen', []).extend(ons)
    else: new(cur, cards, ons)
# an ON SCREEN level title that opens a paragraph belongs to the take that starts the level
missing = [s for s, w in SECS if not any(x['sec'] == s for x in segs)]
if missing: raise SystemExit('missing section starts: ' + ', '.join(missing))
json.dump(segs, open(A + '/segments.json', 'w'), indent=1)
for s in segs: print(s['id'], s['sec'], f"{len(s['text'].split())} words, {len(s['text'])} chars", 'cards', len(s.get('cards', [])), 'onscreen', len(s.get('onscreen', [])), '|', s['text'][:50].replace('\n', ' '))
print('total chars', sum(len(s['text']) for s in segs))
