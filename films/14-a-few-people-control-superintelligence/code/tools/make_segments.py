#!/usr/bin/env python3
"""Split the Film 14 VO text into audio/segments.json: one TTS segment per paragraph (blank-line separated), as in Film 13.
[[QUOTE CARD: …]] splits its paragraph and becomes a silent card slot (build_vo.py CARD); [[ON SCREEN: …]] lines are not spoken,
they stay listed on their segment under "onscreen" (with the words they follow) for the animation.
usage: make_segments.py <vo.txt> <audio_dir>"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
# section starts: (section, first words of the paragraph that opens it)
# 0 hook · 1 the file / the vault · 2 the sleeper · 3 the microscope · 4 the second key · 5 the glass box · 6 key ring finale + end image
SECS = [('0', 'Who holds the keys to superintelligence?'), ('1', 'Those weights are billions of numbers'), ('2', 'Picture a model that passes every test'),
        ('3', 'In March twenty twenty-five'), ('4', 'Think back to the missile silo.'), ('5', 'In early September twenty twenty-five'), ('6', 'None of them. Not alone.')]
TAG = re.compile(r'^\[[^\[\]]*\]\s*')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(src).read()) if p.strip()]
segs, sec, n = [], None, 0
def new(lines):
    global n
    segs.append({'id': f's{n:02d}', 'sec': sec, 'text': '\n'.join(lines)}); n += 1
for p in paras:
    hit = next((s for s, w in SECS if TAG.sub('', p[0]).startswith(w)), None)
    if hit: sec = hit
    if sec is None: raise SystemExit('text before first section: ' + p[0])
    cur, ons = [], []
    for l in p:
        m = re.fullmatch(r'\[\[(QUOTE CARD|ON SCREEN):\s*(.*)\]\]', l)
        if not m: cur.append(l); continue
        if m.group(1) == 'ON SCREEN':
            ons.append({'text': m.group(2), 'after': cur[-1] if cur else ''}); continue
        if cur: new(cur); segs[-1]['onscreen'] = ons; cur, ons = [], []
        segs.append({'id': f'Q{sum(1 for s in segs if s.get("card")) + 1}', 'sec': sec, 'card': True, 'text': m.group(2)})
    if cur:
        new(cur)
        if ons: segs[-1]['onscreen'] = ons
missing = [s for s, w in SECS if not any(x['sec'] == s for x in segs)]
if missing: raise SystemExit('missing section starts: ' + ', '.join(missing))
for s in segs:
    if not s.get('onscreen'): s.pop('onscreen', None)
json.dump(segs, open(A + '/segments.json', 'w'), indent=1)
for s in segs: print(s['id'], s['sec'], 'CARD' if s.get('card') else f"{len(s['text'].split())} words, {len(s['text'])} chars", len(s.get('onscreen', [])) or '')
print('total chars', sum(len(s['text']) for s in segs if not s.get('card')))
