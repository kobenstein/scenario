#!/usr/bin/env python3
"""Split the Film 16 VO text into audio/segments.json: one TTS segment per paragraph (blank-line separated), long level
paragraphs split further at SPLIT lines (~300-650 characters per take, as in Film 14).
Film 16: [[QUOTE CARD: …]] lines get NO silent slot (the VO paraphrases every card and keeps running while it is on screen);
they are only listed on their segment under "cards" (with the spoken line they follow), like [[ON SCREEN: …]] under "onscreen".
[pause] lines are not sent to TTS: build_vo.py makes that air (GAP_AFTER / BREATH).
usage: make_segments.py <vo.txt> <audio_dir>"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
# section starts: (section, first words of the line that opens it, tags stripped)
# 0 hook · 1-7 the seven levels · 8 ending (verdict, call, closing lines, end screen)
SECS = [('0', "This is Claude's constitution"), ('1', 'You paste in a birthday poem'), ('2', 'A letter from your landlord'),
        ('3', 'Say you build the perfect case.'), ('4', 'Now imagine you work at Anthropic'), ('5', "You're still at Anthropic."),
        ('6', "Until now, we could only read what it's told."), ('7', 'Last level.'), ('8', 'So, can you give a mind good values with words?')]
# a new take starts at these lines (inside a paragraph)
SPLIT = ['Its makers call this kind', "And yet, in the document's order of values", 'Behind that rule stands a wall.', 'Why would a company write that',
         'The document pictures a dial.', "But what if Claude's values are already good?", 'So did the model learn the values', 'The text is open about money.',
         'And remember: what the model first learned']
# paragraphs that stay in the previous take (build_vo.py BREATH adds the air)
MERGE = ['If you could add one more level']
TAG = re.compile(r'^\[[^\[\]]*\]\s*')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(src).read()) if p.strip()]
segs, sec, n = [], None, 0
def new(lines, cards, ons):
    global n
    segs.append({'id': f's{n:02d}', 'sec': sec, 'text': '\n'.join(lines)}); n += 1
    if cards: segs[-1]['cards'] = cards
    if ons: segs[-1]['onscreen'] = ons
for p in paras:
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
