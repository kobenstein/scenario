#!/usr/bin/env python3
"""Film 28 · fal-ai/whisper (chunk_level=word) dumps -> dl/vo-<id>.json {words:[[w,start,end]]} with the SCRIPT's words (tags removed).
Whisper words are matched to the script words by difflib on normalised tokens (digits/hyphens differ: 'ten' vs '10', 'Peter-Lucas' vs 'Peter Lucas');
script words without a Whisper match get interpolated times between their matched neighbours.
usage: align_whisper.py <audio_dir> <dl_dir> <dump.json>...   (dumps: wait_for_jobs results; later dumps override earlier ones; job index = i-th text segment)"""
import difflib, json, re, sys
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/')
segs = [s for s in json.load(open(f'{A}/segments.json')) if 'text' in s]
res = {}
for f in sys.argv[3:]:
    d = json.load(open(f))
    if isinstance(d, list): d = json.loads(d[0]['text'])
    for j in d['jobs']:
        if j.get('result'): res[j['index']] = j['result']
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower().replace('ā', 'a'))
NUMW = {'10': 'ten', '44': 'fortyfour', '40': 'forty'}
for i, s in enumerate(segs):
    r = res[i]
    text = re.sub(r'\[[^\]]*\]', ' ', s['text']).replace('-', ' ')
    sw = text.split()
    ww = [(c['text'].strip().replace('-', ' '), c['timestamp'][0], c['timestamp'][1]) for c in r['chunks'] if c['text'].strip()]
    wt = [(norm(NUMW.get(norm(w), w)), a, b) for w, a, b in ww]
    st = [norm(w) for w in sw]
    sm = difflib.SequenceMatcher(None, st, [w[0] for w in wt], autojunk=False)
    t = [None] * len(sw)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): t[a + k] = (wt[b + k][1], wt[b + k][2] if wt[b + k][2] is not None else wt[b + k][1] + .2)
    # interpolate the gaps
    dur = ww[-1][2] or ww[-1][1] + .3
    k = 0
    while k < len(sw):
        if t[k] is None:
            m = k
            while m < len(sw) and t[m] is None: m += 1
            lo = t[k - 1][1] if k else 0.0; hi = t[m][0] if m < len(sw) else dur
            for q in range(k, m):
                a = lo + (hi - lo) * (q - k) / (m - k); b = lo + (hi - lo) * (q - k + 1) / (m - k); t[q] = (a, b)
            k = m
        else: k += 1
    miss = sum(1 for a, b, n in [(0, 0, 0)] for _ in [])  # placeholder
    words = [[sw[q], round(t[q][0], 3), round(max(t[q][1], t[q][0] + .05), 3)] for q in range(len(sw))]
    matched = sum(n for _, _, n in sm.get_matching_blocks())
    json.dump({'words': words}, open(f"{DL}/vo-{s['id']}.json", 'w'))
    print(s['id'], len(sw), 'script words,', matched, 'matched,', 'ends', words[-1][2])
