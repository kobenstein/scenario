#!/usr/bin/env python3
"""Dub timing.json words -> .srt (max 2 lines x 42 chars, break at sentence ends). usage: srt.py <timing.json> <out.srt>"""
import json, sys
W = json.load(open(sys.argv[1]))['words']; MAX = 42
def ts(t): h, r = divmod(t, 3600); m, s = divmod(r, 60); return f'{int(h):02}:{int(m):02}:{int(s):02},{int(round((s % 1) * 1000)) % 1000:03}'
cues, cur = [], []
for i, w in enumerate(W):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = W[i + 1] if i + 1 < len(W) else None
    end = nxt is None or nxt['line'] != w['line'] or w['w'][-1] in '.?!' or len(txt) + 1 + len(nxt['w']) > 2 * MAX
    if end: cues.append(cur); cur = []
def wrap(t):
    if len(t) <= MAX: return t
    ws = t.split(); best = None
    for k in range(1, len(ws)):
        a, b = ' '.join(ws[:k]), ' '.join(ws[k:]); sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, a + '\n' + b)
    return best[1]
with open(sys.argv[2], 'w') as f:
    for n, c in enumerate(cues, 1):
        e = c[-1]['e'] + 0.25
        if n < len(cues): e = min(e, cues[n][0]['s'] - 0.02)
        f.write(f"{n}\n{ts(c[0]['s'])} --> {ts(e)}\n{wrap(' '.join(x['w'] for x in c))}\n\n")
print(len(cues), 'cues')
