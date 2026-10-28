#!/usr/bin/env python3
"""Film 14 · provisional timing.json from segments.json (no audio yet): same format and gaps as audio/build_vo.py
(lead 1.4 s, card slot 5.5 s, gaps 0.9 / 1.8 s, 15 s tail), word times estimated at ~2.6 words/s with pauses after punctuation.
Code anchors on PHRASES only, so scenes built against this file run unchanged on the real audio/timing.json.
  python3 tools/provisional_timing.py <segments.json> <out timing.json>
"""
import json, re, sys
SEG = json.load(open(sys.argv[1]))
LEAD, TAIL, CARD, CLIP_IN, CLIP_OUT, GAP_SECTION, GAP_SUB = 1.4, 15.0, 5.5, .7, .6, 1.8, .9
WPS = 2.6
def words_of(text):
    text = re.sub(r'\[[^\]]*\]', ' ', text)   # [calm] tags and [[cards]] are not spoken
    return [w for w in text.split() if re.search(r'[A-Za-z0-9]', w)]
t, secs, words, clips = LEAD, {}, [], []
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('card') or s.get('clip'):
        d = s.get('dur', CARD); t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'card', 'start': round(t, 3), 'end': round(t + d, 3), 'text': s.get('text', '')})
        t += d + CLIP_OUT; continue
    t0, x = t, 0.0
    for w in words_of(s['text']):
        d = max(.16, len(re.sub(r'\W', '', w)) * .055 + .1) * (2.6 / WPS)
        words.append({'w': w, 's': round(t0 + x, 3), 'e': round(t0 + x + d, 3), 'sec': s['id']})
        x += d + .05
        if w.endswith('...') or w.endswith('…'): x += .7
        elif re.search(r'[.?!]["”’]?$', w): x += .5
        elif re.search(r'[,;:]["”’]?$', w): x += .22
    last = words[-1]['e'] - t0
    secs[s['id']] = {'start': round(t0, 3), 'end': round(t0 + last, 3), 'sec': s['sec']}
    t += last + (GAP_SECTION if (nxt and nxt['sec'] != s['sec']) else GAP_SUB)
json.dump({'duration': round(t + TAIL, 3), 'sections': secs, 'clips': clips, 'words': words, 'provisional': True}, open(sys.argv[2], 'w'), indent=0)
print('provisional duration', round(t + TAIL, 1), 's;', len(words), 'words')
for k, v in list(secs.items())[:6]: print(k, v['start'], v['end'])
for c in clips: print(c['id'], c['start'], c['end'])
