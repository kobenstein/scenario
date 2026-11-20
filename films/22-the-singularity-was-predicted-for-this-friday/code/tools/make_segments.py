#!/usr/bin/env python3
"""Split the VO text into audio/segments.json: one TTS segment per paragraph (blank-line separated), long
paragraphs split further at SPLIT phrases (~300-650 characters per take, as in Film 14).
Film 18: input is audio/vo-v4-tts.txt (= vo-v4.txt word for word, plus one direction tag per paragraph); sections 1-8 are the
stations of tools/provisional_timing.py; a SPLIT phrase may also sit inside a line (the line is broken there).
Film 19: input is audio/vo-v5-tts.txt (= vo-v5.txt word for word plus one tag per vo paragraph, a few "..." pauses and the name
spoken phonetically "fon Furster"); one take = one blank-line block (several vo paragraphs, one per line); sections 1-7 = the
chapters of text-v4.md. Every take also gets "orig": the same words as written in vo-v5.txt (same word count, asserted), which
build_vo.py writes into timing.json. CLIPS: silent slots for the ORIGINAL FOOTAGE clips, after the take that ends with a phrase.
Film 16: [[QUOTE CARD: …]] lines get NO silent slot (the VO paraphrases every card and keeps running while it is on screen);
they are only listed on their segment under "cards" (with the spoken line they follow), like [[ON SCREEN: …]] under "onscreen".
[pause] lines are not sent to TTS: build_vo.py makes that air (GAP_AFTER / BREATH).
usage: make_segments.py <vo-tts.txt> <audio_dir> [vo.txt (approved wording, for "orig")]"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
ORIG = open(sys.argv[3]).read().split() if len(sys.argv) > 3 else None
# section starts: (section, first words of the line that opens it, tags stripped); Film 19 = chapters 1-7 of text-v4.md
SECS = [('1', 'The singularity was predicted'), ('2', 'What drove the first line up'), ('3', 'To find out, independent researchers'),
        ('4', 'A date sounds precise'), ('5', 'Only if we can see it'), ('6', "But seeing the road isn't steering"), ('7', 'To tell bigger from smaller')]
# a new take starts at these phrases (inside a paragraph); Film 19: clip slot C1 sits between "faster." and "Left alone"
SPLIT = ['Left alone, a loop']
# Film 19 clip slots (clips-v1.md): (id, the take ends with this phrase, slot seconds); the clips are cut in later
CLIPS = [('C1', 'And every round goes faster.', 10.0), ('C2', 'at least half the time.', 12.0), ('C3', 'Some forecasts assume exactly that.', 10.0)]
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
missing = [s for s, w in SECS if not any(x['sec'] == s for x in segs)]
if missing: raise SystemExit('missing section starts: ' + ', '.join(missing))
# Film 19: approved wording per take (tags out; same word count as the spoken TTS text)
if ORIG is not None:
    k = 0
    for x in segs:
        nw = len(re.sub(r'\[[^\[\]]*\]', ' ', x['text']).split()); x['orig'] = ' '.join(ORIG[k:k + nw]); k += nw
    assert k == len(ORIG), f'word count TTS {k} != vo {len(ORIG)}'
# Film 19: silent clip slots (save_tts.py skips them, build_vo.py lays them out)
for cid, after, d in CLIPS:
    i = next(i for i, x in enumerate(segs) if x.get('text', '').rstrip().endswith(after))
    segs.insert(i + 1, {'id': cid, 'sec': segs[i]['sec'], 'clip': True, 'dur': d, 'after': after})
json.dump(segs, open(A + '/segments.json', 'w'), indent=1)
for s in segs:
    if s.get('clip'): print(s['id'], s['sec'], 'CLIP SLOT', s['dur'], 's after', repr(s['after'])); continue
    print(s['id'], s['sec'], f"{len(s['text'].split())} words, {len(s['text'])} chars", 'cards', len(s.get('cards', [])), 'onscreen', len(s.get('onscreen', [])), '|', s['text'][:50].replace('\n', ' '))
print('total chars', sum(len(s['text']) for s in segs if not s.get('clip')))
