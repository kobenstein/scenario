#!/usr/bin/env python3
"""Save char timestamps + mp3 from a saved fal wait_for_jobs output.
usage: grab2.py <tool-result.txt> <dub_dir> <lang0,lang1,...>   (index // 100 -> lang, index % 100 -> section order)
Also rewrites <lang>_sections.json text from the returned characters, so tiny re-typing differences can't break assemble."""
import json, sys, subprocess, os
F, D, langs = sys.argv[1], sys.argv[2].rstrip('/'), sys.argv[3].split(',')
ids = [s['id'] for s in json.load(open(D + '/en_lines.json'))]
data = json.load(open(F))
if isinstance(data, list):                      # get_job_result output: [{type,text}], index given as 4th arg
    j = json.loads(data[0]['text']); j['index'] = int(sys.argv[4]); jobs = [j]
else: jobs = data['jobs']
for j in jobs:
    j['index'] = int(j['index']); r = j.get('result'); lang = langs[j['index'] // 100]; sid = ids[j['index'] % 100]
    if not r: print('missing', lang, sid, j.get('status')); continue
    chars = []
    for c in r['timestamps']: chars += list(zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds']))
    os.makedirs(f'{D}/{lang}', exist_ok=True)
    json.dump(chars, open(f'{D}/{lang}/ts-{sid}.json', 'w'))
    subprocess.run(['curl', '-sS', '-o', f'{D}/{lang}/vo-{sid}.mp3', r['audio']['url']], check=True)
    sf = f'{D}/{lang}_sections.json'; secs = json.load(open(sf)); txt = ''.join(c[0] for c in chars)
    for s in secs:
        if s['id'] == sid:
            if s['text'] != txt: print('  text differs, using returned', lang, sid)
            assert txt.count('\n') == s['text'].count('\n'), ('line count differs', lang, sid)
            s['text'] = txt
    json.dump(secs, open(sf, 'w'), ensure_ascii=False, indent=1)
    print('ok', lang, sid)
