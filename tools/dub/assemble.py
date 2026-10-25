#!/usr/bin/env python3
"""Lay a dubbed VO onto the original picture timing: every dubbed line starts at its English line's start
(en_lines.json), lines that run long are sped up (max MAXT) and only then push the next line.
usage: assemble.py <dub_dir> <lang> <duration>  -> <lang>/vo_master.wav, <lang>/timing.json, <lang>/report.txt"""
import json, re, subprocess, sys
import numpy as np
D, lang, DUR = sys.argv[1].rstrip('/'), sys.argv[2], float(sys.argv[3])
SR, MAXT, GAP, PRE, POST, EARLY = 48000, 1.12, 0.22, 0.03, 0.10, 0.7
def load(f):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).copy()
def tempo(x, r):
    if r <= 1.001: return x
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', f'atempo={r:.4f}', '-f', 'f32le', '-'],
                         input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
en = json.load(open(f'{D}/en_lines.json')); dub = {s['id']: s['text'] for s in json.load(open(f'{D}/{lang}_sections.json'))}
items = []                                  # (anchor, audio, words, label)
for s in en:
    text = dub[s['id']]; ch = json.load(open(f'{D}/{lang}/ts-{s["id"]}.json'))
    assert ''.join(c[0] for c in ch) == text, (lang, s['id'], 'timestamps do not match text')
    x = load(f'{D}/{lang}/vo-{s["id"]}.mp3'); pos = 0
    for k, line in enumerate(text.split('\n')):
        span = [c for c in ch[pos:pos + len(line)]]; pos += len(line) + 1
        vis = [c for c in span if not c[0].isspace()]
        # skip audio tags like [softly]
        txt = ''.join(c[0] for c in span); m = re.match(r'\s*\[[^\]]*\]\s*', txt)
        if m: vis = [c for c in span[m.end():] if not c[0].isspace()]
        a, b = vis[0][1], vis[-1][2]
        seg = x[max(0, int((a - PRE) * SR)):int((b + POST) * SR)]
        words, cur = [], None                # word times relative to segment start
        for c, ca, cb in span[m.end() if m else 0:]:
            if c.isspace():
                if cur: words.append(cur); cur = None
                continue
            if cur is None: cur = [c, ca - a + PRE, cb - a + PRE]
            else: cur[0] += c; cur[2] = cb - a + PRE
        if cur: words.append(cur)
        items.append((s['lines'][k]['s'], seg, words, f"{s['id']}:{k}"))
out = np.zeros(int(DUR * SR), np.float32); prev_end = 0.0; rep = []; allw = []; late_max = 0
for i, (anc, seg, words, lab) in enumerate(items):
    nxt = items[i + 1][0] if i + 1 < len(items) else DUR - 8.5
    d = len(seg) / SR; t = max(anc - 0.05, prev_end + GAP)
    if d > nxt - GAP - t: t = max(anc - EARLY, prev_end + GAP)        # long line: borrow from the pause before it
    avail = nxt - GAP - t; r = 1.0
    if d > avail and avail > 0: r = min(MAXT, d / avail); seg = tempo(seg, r)
    d2 = len(seg) / SR; s0 = int(t * SR); out[s0:s0 + len(seg)] += seg[:len(out) - s0]
    prev_end = t + d2; late = t - anc; late_max = max(late_max, late)
    allw += [{'w': w, 's': round(t + ws / r, 3), 'e': round(t + we / r, 3), 'line': lab} for w, ws, we in words]
    rep.append(f"{lab:7s} anchor {anc:7.2f} start {t:7.2f} late {late:+5.2f} dur {d:5.2f} avail {avail:5.2f} tempo {r:.2f}" + ('  OVER' if prev_end > nxt - 0.05 else ''))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', f'{D}/{lang}/vo_master.wav'], input=out.tobytes(), check=True)
json.dump({'duration': DUR, 'words': allw}, open(f'{D}/{lang}/timing.json', 'w'))
open(f'{D}/{lang}/report.txt', 'w').write('\n'.join(rep) + '\n')
sped = sum(1 for l in rep if 'tempo 1.00' not in l); over = sum(1 for l in rep if 'OVER' in l)
print(lang, len(items), 'lines; sped up', sped, '; still over', over, '; max late', round(late_max, 2), 's')
