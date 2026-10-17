#!/usr/bin/env python3
"""Pull an ElevenLabs TTS result (audio URL + char timestamps) out of the session transcript.
usage: grab_tts.py <transcript.jsonl> <url-fragment> <out.json>
Writes {url, chars:[[c,start,end],...], words:[[w,start,end],...]}"""
import json, re, sys
tr, frag, out = sys.argv[1:4]
def texts(o):
    if isinstance(o, dict):
        for v in o.values(): yield from texts(v)
    elif isinstance(o, list):
        for v in o: yield from texts(v)
    elif isinstance(o, str): yield o
res = None
for line in open(tr):
    if frag not in line or 'character_start_times' not in line: continue
    for s in texts(json.loads(line)):
        if frag in s and 'character_start_times' in s:
            try: res = json.loads(s)
            except Exception: pass
assert res, 'not found'
def find(o, k):
    if isinstance(o, dict):
        if k in o: return o[k]
        for v in o.values():
            r = find(v, k)
            if r is not None: return r
    elif isinstance(o, list):
        for v in o:
            r = find(v, k)
            if r is not None: return r
r = res.get('result', res); ts = r['timestamps']; url = r['audio']['url']
chunks = ts if isinstance(ts, list) else [ts]
chars = []
for c in chunks:
    for ch, a, b in zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds']):
        chars.append([ch, a, b])
words, cur = [], None
for ch, a, b in chars:
    if ch.isspace():
        if cur: words.append(cur); cur = None
        continue
    if cur is None: cur = [ch, a, b]
    else: cur[0] += ch; cur[2] = b
if cur: words.append(cur)
words = [w for w in words if not re.fullmatch(r'\[[^\]]*\]', w[0])]
json.dump({'url': url, 'chars': chars, 'words': words}, open(out, 'w'))
print(url, len(chars), 'chars', len(words), 'words', 'end', chars[-1][2] if chars else 0)
