#!/usr/bin/env python3
"""Save ElevenLabs TTS results (fal wait_for_jobs output) as vo-<id>.mp3 + vo-<id>.json {url, chars, words}.
usage: save_tts.py <audio_dir> <wait_output.txt>...   (index i -> i-th spoken segment of segments.json; Film 14: several wait files,
large wait_for_jobs results come back in parts; the first file that holds a job's result wins)"""
import json, re, sys, subprocess
A, srcs = sys.argv[1].rstrip('/'), sys.argv[2:]
segs = [s for s in json.load(open(A + '/segments.json')) if not (s.get('clip') or s.get('card'))]   # quote cards are silent slots
jobs = {}
for src in srcs:
    for j in json.load(open(src))['jobs']:
        if j.get('result') and j['index'] not in jobs: jobs[j['index']] = j
for j in [jobs.get(i, {'index': i}) for i in range(len(segs))]:
    r = j.get('result')
    if not r: print('missing', j['index']); continue
    sid = segs[j['index']]['id']; chars = []
    for c in (r['timestamps'] if isinstance(r['timestamps'], list) else [r['timestamps']]):
        chars += [[ch, a, b] for ch, a, b in zip(c['characters'], c['character_start_times_seconds'], c['character_end_times_seconds'])]
    words, cur, tag = [], None, False
    for ch, a, b in chars:
        if ch == '[': tag = True
        if tag:   # skip audio tags like [calm, conversational] (may contain spaces)
            if ch == ']': tag = False
            continue
        if ch.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = [ch, a, b]
        else: cur[0] += ch; cur[2] = b
    if cur: words.append(cur)
    words = [w for w in words if not re.fullmatch(r'\[[^\]]*\]', w[0])]
    url = r['audio']['url']
    json.dump({'url': url, 'request_id': j.get('request_id'), 'chars': chars, 'words': words}, open(f'{A}/vo-{sid}.json', 'w'))
    subprocess.check_call(['curl', '-sSfo', f'{A}/vo-{sid}.mp3', url])
    print(sid, len(words), 'words, end', round(chars[-1][2], 1))
