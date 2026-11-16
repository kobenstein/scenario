#!/usr/bin/env python3
"""Split the VO text into audio/segments.json: one TTS segment per paragraph (blank-line separated), long
paragraphs split further at SPLIT phrases (~300-650 characters per take, as in Film 14).
Film 18: input is audio/vo-v4-tts.txt (= vo-v4.txt word for word, plus one direction tag per paragraph); sections 1-8 are the
stations of tools/provisional_timing.py; a SPLIT phrase may also sit inside a line (the line is broken there).
Film 19: sections 0-9 (+8b) = SECS of tools/provisional_timing.py; a [CLIP Cn] line becomes a silent clip slot {id: Cn, clip: true, dur}
(dur = dauer_s from <audio_dir>/clips.json); build_vo.py leaves the slot silent, mix.py lays clips/<Cn>.wav into it.
Film 16: [[QUOTE CARD: …]] lines get NO silent slot (the VO paraphrases every card and keeps running while it is on screen);
they are only listed on their segment under "cards" (with the spoken line they follow), like [[ON SCREEN: …]] under "onscreen".
[pause] lines are not sent to TTS: build_vo.py makes that air (GAP_AFTER / BREATH).
usage: make_segments.py <vo.txt> <audio_dir>"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
# section starts: (section, first words of the line that opens it, tags stripped); Film 18 = stations of provisional_timing.py
SECS = [('0', "Here's how to survive"), ('1', "If this is the crash, its clock"), ('2', 'Mostly, data centers'), ('3', 'Day thirty-one'),
        ('4', 'Day forty-eight'), ('5', 'But what if the fall'), ('6', 'Day two hundred eighty-two'), ('7', 'Day nine hundred twenty-nine'),
        ('8', 'On a road this long'), ('8b', 'But this boom has a hole'), ('9', 'Day one thousand')]
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
import os
CLIPS = {c['id']: c for c in json.load(open(A + '/clips.json'))['clips']} if os.path.exists(A + '/clips.json') else {}
for p in paras:
    m = re.fullmatch(r'\[CLIP\s+(\w+)\]', p[0]) if len(p) == 1 else None
    if m:   # Film 19: interview clip slot (its own paragraph)
        c = CLIPS.get(m.group(1), {})
        segs.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': float(c.get('dauer_s', 10)), 'file': f"clips/{m.group(1)}.wav",
                     'name': c.get('speaker', ''), 'role': c.get('role', ''), 'text': c.get('transcript', '')})
        continue
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
for s in segs: print(s['id'], s['sec'], ('CLIP %.2f s' % s['dur']) if s.get('clip') else '', f"{len(s['text'].split())} words, {len(s['text'])} chars", 'cards', len(s.get('cards', [])), 'onscreen', len(s.get('onscreen', [])), '|', s['text'][:50].replace('\n', ' '))
print('total chars', sum(len(s['text']) for s in segs))
