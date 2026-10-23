#!/usr/bin/env python3
"""Save ElevenLabs TTS results (fal wait_for_jobs output) as vo-<id>.mp3 + vo-<id>.json {url, chars, words}.
usage: save_tts.py <wait_output.txt> <audio_dir>   (index i -> i-th non-clip segment of segments.json)"""
import json, re, sys, subprocess
src, A = sys.argv[1], sys.argv[2].rstrip('/')
segs = [s for s in json.load(open(A + '/segments.json')) if not s.get('clip')]
d = json.load(open(src))
for j in d['jobs']:
    r = j.get('result')
    if not r: print('missing', j['index']); continue
    sid = segs[j['index']]['id']; chars = []
    for c in (r['timestamps'] if isinstance(r['timestamps'], list) else [r['timestamps']]):
        chars += [[ch, a, b] for ch, a, b in zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds'])]
    words, cur = [], None
    for ch, a, b in chars:
        if ch.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = [ch, a, b]
        else: cur[0] += ch; cur[2] = b
    if cur: words.append(cur)
    words = [w for w in words if not re.fullmatch(r'\[[^\]]*\]', w[0])]
    url = r['audio']['url']
    json.dump({'url': url, 'request_id': j['request_id'], 'chars': chars, 'words': words}, open(f'{A}/vo-{sid}.json', 'w'))
    subprocess.check_call(['curl', '-sSfo', f'{A}/vo-{sid}.mp3', url])
    print(sid, len(words), 'words, end', round(chars[-1][2], 1))
