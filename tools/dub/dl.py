#!/usr/bin/env python3
"""Download section mp3s from a saved fal wait_for_jobs result (no timestamps).
usage: dl.py <tool-result.json> <dub_dir> <lang0,lang1,...>   index//100 -> language, index%100 -> section order"""
import json, sys, subprocess
F, D, langs = sys.argv[1], sys.argv[2].rstrip('/'), sys.argv[3].split(',')
ids = [s['id'] for s in json.load(open(D + '/en_lines.json'))]
raw = json.load(open(F)); raw = json.loads(raw[0]['text']) if isinstance(raw, list) else raw
for j in raw['jobs']:
    lang, sid = langs[j['index'] // 100], ids[j['index'] % 100]
    url = (j.get('result') or {}).get('audio', {}).get('url') or (j.get('media') or [{}])[0].get('url')
    if not url: print('MISSING', lang, sid, j.get('status')); continue
    subprocess.run(['curl', '-sS', '-o', f'{D}/{lang}/vo-{sid}.mp3', url], check=True); print('ok', lang, sid)
