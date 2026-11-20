#!/usr/bin/env python3
"""Film 19: replace / add single sentences inside the finished VO track (vo_master.wav + timing.json), and optionally insert air.
Always starts from the pre-splice state (<wav_dir>/vo_master_pre_splice.wav, <audio_dir>/timing_pre_splice.json, made on the first run).
splice.json: edits with "replace" [first, last] (word indices of the pre-splice timing.json, inclusive) are swapped in place (old span
`silence` zeroed, new take laid at `at`; no time shift); "gap" {at, dur} then inserts dur s of silence at `at` and moves every later word,
section, level, clip and the duration by +dur; edits with "replace": null are then laid at `at` (final film time) as new takes (seg id `seg`,
level `sec`). New takes are level-matched to the replaced words or to the take named in "match"; 20 ms fade-in, 60 ms fade-out.
usage: splice_vo.py <audio_dir> <wav_dir> <splice.json>"""
import json, os, shutil, subprocess, sys
import numpy as np
A, W, P = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/'), sys.argv[3]; SR = 48000
def load(f, ss=None, to=None):
    a = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss), '-to', str(to)] if ss is not None else []) + ['-i', f, '-af', 'aresample=48000', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.check_output(a), np.float32).copy()
def arms(x): return float(np.sqrt(np.mean(x[np.abs(x) > 1e-3] ** 2)))
for src, dst in [(W + '/vo_master.wav', W + '/vo_master_pre_splice.wav'), (A + '/timing.json', A + '/timing_pre_splice.json')]:
    if not os.path.exists(dst): shutil.copy(src, dst)
vo = load(W + '/vo_master_pre_splice.wav'); T = json.load(open(A + '/timing_pre_splice.json')); S = json.load(open(P))
old = T['words']; ref0 = vo.copy()
def take(e, ref):
    x = load(os.path.join(os.path.dirname(P), e['id'] + '.mp3'), *e['src']); x *= arms(ref) / arms(x)
    k = int(.02 * SR); x[:k] *= np.linspace(0, 1, k); k = int(.06 * SR); x[-k:] *= np.linspace(1, 0, k)
    off = e['at'] - e['src'][0]
    e['new'] = [{'w': w, 's': round(off + a1, 3), 'e': round(off + b1, 3), 'sec': e['seg']} for w, a1, b1 in e['words']]
    print(e['id'], 'speech', e['new'][0]['s'], '-', e['new'][-1]['e'], ' take', e['at'], '-', round(e['at'] + len(x) / SR, 3))
    return x
words, skip = [], set()
rep = [e for e in S['edits'] if e['replace']]
for e in rep:
    a, b = e['replace']; x = take(e, ref0[int(old[a]['s'] * SR):int(old[b]['e'] * SR)])
    vo[int(e['silence'][0] * SR):int(e['silence'][1] * SR)] = 0
    s = int(e['at'] * SR); vo[s:s + len(x)] += x; skip |= set(range(a, b + 1))
for i, w in enumerate(old):
    for e in rep:
        if e['replace'][0] == i: words += e['new']
    if i not in skip: words.append(w)
for e in rep: T['sections'][e['seg']]['end'] = max(w['e'] for w in words if w['sec'] == e['seg'])
g = S.get('gap')
if g:
    c, d = g['at'], g['dur']; sh = lambda t: round(t + d, 3) if t >= c else t
    vo = np.concatenate([vo[:int(c * SR)], np.zeros(int(round(d * SR)), np.float32), vo[int(c * SR):]])
    for w in words: w['s'], w['e'] = sh(w['s']), sh(w['e'])
    for D in (T['sections'], T['levels']):
        for v in D.values(): v['start'], v['end'] = sh(v['start']), sh(v['end'])
    for x in T.get('clips', []) + T.get('cues', []):
        for k in ('start', 'end', 't'):
            if k in x: x[k] = sh(x[k])
    T['duration'] = round(T['duration'] + d, 3); T['gap'] = g
    print('gap', d, 's at', c, '-> duration', T['duration'])
for e in S['edits']:
    if e['replace']: continue
    ws = [w for w in words if w['sec'] == e['match']]; ref = vo[int(ws[0]['s'] * SR):int(ws[-1]['e'] * SR)]
    x = take(e, ref); s = int(e['at'] * SR); vo[s:s + len(x)] += x
    words += e['new']; T['sections'][e['seg']] = {'start': e['new'][0]['s'], 'end': e['new'][-1]['e'], 'sec': e['sec']}
    L = T['levels'][e['sec']]; L['segments'].append(e['seg']); L['end'] = max(L['end'], e['new'][-1]['e'])
words.sort(key=lambda w: w['s']); T['words'] = words
vo = vo[:int(T['duration'] * SR)]
json.dump(T, open(A + '/timing.json', 'w'), indent=0)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', '-', W + '/vo_master.wav'], input=vo.tobytes(), check=True)
print(len(old), '->', len(words), 'words')
