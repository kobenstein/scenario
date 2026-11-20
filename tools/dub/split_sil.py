#!/usr/bin/env python3
"""Fake char timestamps for a section mp3 made WITHOUT fal timestamps: find the N-1 line breaks among the
silences (DP: each cut near its char-proportional position, longer silences preferred), then spread chars
evenly inside each line's speech span. Writes <lang>/ts-<id>.json (same format as grab2.py).
usage: split_sil.py <dub_dir> <lang> <id> [...]   [--test]  (--test writes ts-<id>.sil.json and compares)"""
import json, sys, subprocess
import numpy as np
args = [a for a in sys.argv[1:] if a != '--test']; TEST = '--test' in sys.argv
D, lang, ids = args[0].rstrip('/'), args[1], args[2:]
SR = 16000
import os; PW = float(os.environ.get("PW", 8)); LW = float(os.environ.get("LW", 2.5))
secs = {s['id']: s['text'] for s in json.load(open(f'{D}/{lang}_sections.json'))}
def load(f):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32)
def silences(x, thr_db=-40, min_len=0.12):
    hop = int(SR * 0.01); n = len(x) // hop
    e = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop] ** 2) + 1e-12) for i in range(n)])
    db = 20 * np.log10(e / (e.max() + 1e-12)); quiet = db < thr_db
    out, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if (j - i) * 0.01 >= min_len: out.append((i * 0.01, j * 0.01))
            i = j
        else: i += 1
    return out, n * 0.01
for sid in ids:
    text = secs[sid]; lines = text.split('\n'); x = load(f'{D}/{lang}/vo-{sid}.mp3')
    sil, dur = silences(x)
    sp0 = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    sp1 = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
    inner = [s for s in sil if s[0] > sp0 + 0.05 and s[1] < sp1 - 0.05]
    L = [max(1, len(l)) for l in lines]; cum = np.cumsum(L)[:-1] / sum(L)
    exp = sp0 + cum * (sp1 - sp0)                      # expected cut times
    K, S = len(exp), len(inner)
    if K == 0: cuts = []
    else:
        assert S >= K, (sid, 'not enough silences', S, K)
        mid = np.array([(a + b) / 2 for a, b in inner]); ln = np.array([b - a for a, b in inner])
        span = sp1 - sp0
        cost = lambda k, s: abs(mid[s] - exp[k]) / span * PW - min(ln[s], 1.0) * LW
        INF = 1e9; dp = np.full((K, S), INF); bk = np.zeros((K, S), int)
        for s in range(S): dp[0, s] = cost(0, s)
        for k in range(1, K):
            best, arg = INF, -1
            for s in range(S):
                if s - 1 >= 0 and dp[k - 1, s - 1] < best: best, arg = dp[k - 1, s - 1], s - 1
                if best < INF: dp[k, s] = best + cost(k, s); bk[k, s] = arg
        s = int(np.argmin(dp[K - 1])); cuts = [s]
        for k in range(K - 1, 0, -1): s = bk[k, s]; cuts.append(s)
        cuts = [inner[c] for c in cuts[::-1]]
    bounds = [sp0] + [c for cc in cuts for c in cc] + [sp1]   # start0, end0/start1, ...
    ch = []
    for k, l in enumerate(lines):
        a, b = bounds[2 * k], bounds[2 * k + 1]
        n = max(1, len(l))
        for i, c in enumerate(l): ch.append([c, round(a + (b - a) * i / n, 3), round(a + (b - a) * (i + 1) / n, 3)])
        if k < len(lines) - 1: ch.append(['\n', round(b, 3), round(bounds[2 * k + 2], 3)])
    out = f'{D}/{lang}/ts-{sid}' + ('.sil' if TEST else '') + '.json'
    json.dump(ch, open(out, 'w'))
    if TEST:
        tr = json.load(open(f'{D}/{lang}/ts-{sid}.json')); pos = 0; errs = []
        for l in lines:
            vis = [c for c in tr[pos:pos + len(l)] if not c[0].isspace()]
            mine = [c for c in ch[pos:pos + len(l)] if not c[0].isspace()]
            errs.append(round(mine[0][1] - vis[0][1], 2)); pos += len(l) + 1
        print(sid, 'start errors', errs)
    else: print('split', lang, sid, len(lines), 'lines')
