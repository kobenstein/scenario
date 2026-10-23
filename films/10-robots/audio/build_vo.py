#!/usr/bin/env python3
"""Lay VO takes and interview-clip slots onto one timeline -> vo_master.wav + timing.json.
Clip slots stay silent here; clips/<K>.wav (if present) is mixed in at the slot by mix.py.
usage: build_vo.py <audio_dir>"""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, TAIL = 1.4, 20.0                       # Film 10: 20 s endcard tail without narration
CARD = 5.5                                   # silent slot for a quote card (read on screen)
CLIP_IN, CLIP_OUT = 0.7, 0.6                 # air before / after a clip
GAP_SECTION, GAP_SUB = 1.8, 0.9
GAP_AFTER = {'00a': 3.13, '02b': 3.0, '02c': 2.4}  # Film 10: air after the hook, after the hands question, after the bank line # 00a: +0.93 s for the cut "near the finish", keeps all later timings
# extra air inside one take: (segment, word before, word after, seconds); the take is split at the quietest 10 ms between them
BREATH = [('00a', 'now.', 'So', .5), ('00a', 'for?', 'Last', .6), ('04a', 'rules.', 'And', .6), ('04a', 'alive.', "We're", 1.0)]
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
def cuts(sid, mp3, W):
    """[(cut time, extra seconds)] for this take, cut at the quietest 10 ms frame between the two words"""
    out, x = [], None
    for seg, a, b, extra in BREATH:
        if seg != sid: continue
        try: k = next(k for k in range(1, len(W)) if W[k - 1][0] == a and W[k][0] == b)
        except StopIteration: continue   # breath point not in this take (text revised)
        if x is None:
            x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
        lo, hi = max(W[k - 1][1], W[k - 1][2] - .3), W[k][1]
        fr = [(float(np.sqrt(np.mean(x[int(t * 16000):int(t * 16000) + 160] ** 2))), t) for t in np.arange(lo, max(lo + .011, hi - .01), .01)]
        out.append((round(min(fr)[1] + .005, 3), extra))
    return sorted(out)
t, secs, words, clips, inputs, delays = LEAD, {}, [], [], [], []
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('endcards'): continue
    if s.get('clip') or s.get('card'):
        d = s.get('dur', CARD)
        t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'clip' if s.get('clip') else 'card', 'start': round(t, 3), 'end': round(t + d, 3), **{k: s[k] for k in ('file', 'name', 'role', 'label', 'text') if k in s}})
        t += d + CLIP_OUT
        continue
    j = json.load(open(f"{A}/vo-{s['id']}.json")); mp3 = f"{A}/vo-{s['id']}.mp3"
    cs = cuts(s['id'], mp3, j['words'])
    shift = lambda a: a + sum(e for c, e in cs if c <= a)
    last = shift(j['words'][-1][2])
    secs[s['id']] = {'start': round(t, 3), 'end': round(t + last, 3), 'sec': s['sec']}
    for w, a, b in j['words']: words.append({'w': w, 's': round(t + shift(a), 3), 'e': round(t + shift(b), 3), 'sec': s['id']})
    bounds = [0] + [c for c, e in cs] + [None]
    for p in range(len(bounds) - 1):   # one input per piece of the take
        inputs += ['-ss', str(bounds[p])] + (['-to', str(bounds[p + 1])] if bounds[p + 1] is not None else []) + ['-i', mp3]
        delays.append(t + shift(bounds[p]))
    gap = GAP_AFTER.get(s['id'], GAP_SECTION if (nxt and nxt['sec'] != s['sec']) else GAP_SUB)
    t += last + gap
total = t + TAIL
fc = ''.join(f'[{k}:a]aresample=48000,adelay={int(d*1000)}:all=1[a{k}];' for k, d in enumerate(delays))
fc += ''.join(f'[a{k}]' for k in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{A}/vo_master.wav'])
json.dump({'duration': round(total, 3), 'sections': secs, 'clips': clips, 'words': words}, open(f'{A}/timing.json', 'w'), indent=0)
print('duration', round(total, 1), 's;', len(words), 'words')
for k, v in secs.items(): print(k, v['start'], v['end'])
for c in clips: print(c['id'], c['start'], c['end'])
