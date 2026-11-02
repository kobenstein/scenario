#!/usr/bin/env python3
"""Save char timestamps from a saved fal wait_for_jobs output. usage: grab.py <tool-result.txt> <dub_dir>
index <100 -> es, >=100 -> de; index%100 -> section order of en_lines.json"""
import json, sys
F, D = sys.argv[1], sys.argv[2].rstrip('/')
ids = [s['id'] for s in json.load(open(D + '/en_lines.json'))]
for j in json.load(open(F))['jobs']:
    r = j.get('result'); lang = 'es' if j['index'] < 100 else 'de'; sid = ids[j['index'] % 100]
    if not r: print('missing', lang, sid); continue
    chars = []
    for c in r['timestamps']: chars += list(zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds']))
    json.dump(chars, open(f'{D}/{lang}/ts-{sid}.json', 'w')); print('ok', lang, sid)
