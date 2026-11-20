#!/usr/bin/env python3
"""<lang>.txt (## id + one line per English line) -> <lang>_sections.json. usage: sections.py <dub_dir> <lang>"""
import json, sys
D, lang = sys.argv[1].rstrip('/'), sys.argv[2]
secs, cur = {}, None
for l in open(f'{D}/{lang}.txt'):
    l = l.rstrip('\n')
    if l.startswith('## '): cur = l[3:]; secs[cur] = []
    elif l.strip(): secs[cur].append(l)
en = json.load(open(f'{D}/en_lines.json'))
for s in en: assert len(s['lines']) == len(secs[s['id']]), (s['id'], len(s['lines']), len(secs[s['id']]))
json.dump([{'id': s['id'], 'text': '\n'.join(secs[s['id']])} for s in en], open(f'{D}/{lang}_sections.json', 'w'), ensure_ascii=False, indent=1)
