#!/usr/bin/env python3
"""Interview-clip share check (schreibraum/clip-schritt.md), run before every render.
usage: clip_check.py <clips.json> <timing.json>
clips.json: either {"clips": [...]} or keyed by clip id ({"C1": {...}}); entries need "url" (source).
timing.json: needs "duration" and "clips" (start/end per slot, from build_vo.py).
Exit code 1 if a hard rule is broken (share > 10 %, a clip > 20 s, more than 2 clips or > 20 s from one source)."""
import json, sys
from collections import defaultdict
cl = json.load(open(sys.argv[1])); T = json.load(open(sys.argv[2]))
meta = {c['id']: c for c in cl['clips']} if 'clips' in cl else {k: v for k, v in cl.items() if isinstance(v, dict)}
slots = [c for c in T.get('clips', []) if c.get('kind', 'clip') == 'clip']
dur = T['duration']; hard, warn, rows = [], [], []
for c in slots:
    d = c['end'] - c['start']; rows.append((c['id'], c['start'], d))
    if d > 20: hard.append(f"{c['id']} {d:.1f} s > 20 s")
    elif not 4 <= d <= 15: warn.append(f"{c['id']} {d:.1f} s outside 4-15 s")
total = sum(d for _, _, d in rows); share = 100 * total / dur
if share > 10: hard.append(f'share {share:.1f} % > 10 %')
elif share > 8: warn.append(f'share {share:.1f} % > 8 % target')
if not 3 <= len(rows) <= 6: warn.append(f'{len(rows)} clips (rule 3-6)')
for (a, sa, da), (b, sb, _) in zip(rows, rows[1:]):
    if sb - (sa + da) < 45: warn.append(f'{a}->{b} only {sb - (sa + da):.1f} s apart (rule >= 45 s)')
src = defaultdict(list)
for i, s, d in rows: src[meta.get(i, {}).get('url', i)].append(d)
for u, ds in src.items():
    if len(ds) > 2 or sum(ds) > 20: hard.append(f'{len(ds)} clips / {sum(ds):.1f} s from {u} (max 2 / 20 s)')
for i, s, d in rows: print(f'{i}  {int(s // 60)}:{s % 60:04.1f}  {d:5.2f} s  {meta.get(i, {}).get("speaker", "?")}')
print(f'total {total:.1f} s of {dur:.1f} s = {share:.1f} %  ->  {"RED" if hard else "YELLOW" if warn else "GREEN"}')
for m in hard: print('  HARD:', m)
for m in warn: print('  warn:', m)
sys.exit(1 if hard else 0)
