#!/usr/bin/env python3
"""Lay VO takes, interview-clip slots and quote-card slots onto one timeline -> vo_master.wav + timing.json.
Film 20: clip slots ([CLIP C1..C3]) and quote-card slots ([ZITATKARTE …] -> Q1..Q3) are their own entries in timing.json "clips"
(kind "clip" / "card"); no voice under them. A clip slot is 10.0 s until the real clip exists: if <ROOT>clips/<id>.(wav|m4a|mp3|mp4|mov|webm)
is present, its real length is used (so: drop the clip file in, rerun build_vo.py, subs.py, mix.py; the VO takes are not regenerated).
timing.json also gets "levels" (stations 0-8 of text-v3.md), "endscreen" (15 s, music only) and "cues" (none in Film 20).
usage: build_vo.py <audio_dir> [wav_dir]   (<audio_dir> holds segments.json + vo-sNN.mp3/json; vo_master.wav goes to wav_dir, a scratchpad)
       env CLIPDIR: where the clip files live (default <audio_dir>/../clips)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
CLIPDIR = os.environ.get('CLIPDIR', A + '/../clips').rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, TAIL = 1.0, 15.0                       # 15 s endscreen tail (drop-off rule 28.10.: max 15 s)
CARD = 5.0                                   # default quote-card slot (segments.json "dur" wins)
CLIP_IN, CLIP_OUT = 0.7, 0.6                 # air before / after a clip or card
GAP_SECTION, GAP_SUB = 1.7, 0.9
# Film 20 (vo-v4, 41 takes, stations 0-8): takes 0.9 s apart, stations 1.7 s; hook end s02 "It's a race." runs on into station 1
# (drop-off rule 28.10.: no pause at the hook end); the two longer breaths of text-v3.md: after "It's a price tag." (s34) and after
# "It's a decision." (s40, then the end screen)
GAP_AFTER = {'s02': 0.8, 's34': 2.0, 's40': 1.5}
# extra air inside one take: (segment, word before, word after, seconds); the take is split at the quietest 10 ms between them
BREATH = []
LEVELS = {'0': 'hook: four generations', '1': 'the clock (three months a year, twelve = escape velocity)', '2': 'riddle 1: why we age (the reset at ground zero)',
          '3': 'riddle 2: the button (four proteins, the window)', '4': 'riddle 3: artificial intelligence at the button', '5': 'the first eye (ER-100)',
          '6': 'all diseases hang on one thread', '7': 'the counter-voice (the skeptic, the band)', '8': 'big answer: a price tag, four decisions'}
CLIPEXT = ('wav', 'm4a', 'mp3', 'mp4', 'mov', 'webm', 'mkv')
def clipfile(cid): return next((f'{CLIPDIR}/{cid}.{e}' for e in CLIPEXT if os.path.exists(f'{CLIPDIR}/{cid}.{e}')), None)
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
t, secs, words, clips, inputs, delays, cues = LEAD, {}, [], [], [], [], []
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('endcards'): continue
    if s.get('clip') or s.get('card'):
        d = s.get('dur', CARD); f = clipfile(s['id']) if s.get('clip') else None
        if f: d = round(dur(f), 3)
        t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'clip' if s.get('clip') else 'card', 'start': round(t, 3), 'end': round(t + d, 3),
                      'placeholder': bool(s.get('clip') and not f), **({'file': os.path.basename(f)} if f else {}), **{k: s[k] for k in ('name', 'role', 'label', 'text') if k in s}})
        t += d + CLIP_OUT
        continue
    j = json.load(open(f"{A}/vo-{s['id']}.json")); mp3 = f"{A}/vo-{s['id']}.mp3"
    cs = cuts(s['id'], mp3, j['words'])
    shift = lambda a: a + sum(e for c, e in cs if c <= a)
    last = shift(j['words'][-1][2])
    secs[s['id']] = {'start': round(t, 3), 'end': round(t + last, 3), 'sec': s['sec']}
    for w, a, b in j['words']: words.append({'w': w, 's': round(t + shift(a), 3), 'e': round(t + shift(b), 3), 'sec': s['id']})
    for kind in ('cards', 'onscreen'):   # anchor = end of the spoken line the card follows (segment start if it opens the take)
        for c in s.get(kind, []):
            k = 0
            if c['after']:
                lines = [re.sub(r'\[[^\[\]]*\]', ' ', l).split() for l in s['text'].split('\n')]
                i = next(n for n, l in enumerate(s['text'].split('\n')) if l == c['after'])
                k = sum(len(l) for l in lines[:i + 1])
            at = t + shift(j['words'][k - 1][2]) if k else t
            cues.append({'kind': 'card' if kind == 'cards' else 'onscreen', 'seg': s['id'], 'sec': s['sec'], 't': round(at, 3), 'text': c['text']})
    bounds = [0] + [c for c, e in cs] + [None]
    for p in range(len(bounds) - 1):   # one input per piece of the take
        inputs += ['-ss', str(bounds[p])] + (['-to', str(bounds[p + 1])] if bounds[p + 1] is not None else []) + ['-i', mp3]
        delays.append(t + shift(bounds[p]))
    gap = GAP_AFTER.get(s['id'], GAP_SECTION if (nxt and nxt['sec'] != s['sec']) else GAP_SUB)
    t += last + gap
vo_end = t; total = t + TAIL   # t = last word + GAP_AFTER of the last take
fc = ''.join(f'[{k}:a]aresample=48000,adelay={int(d*1000)}:all=1[a{k}];' for k, d in enumerate(delays))
fc += ''.join(f'[a{k}]' for k in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
json.dump({'duration': round(total, 3), 'endscreen': {'start': round(vo_end, 3), 'end': round(total, 3)}, 'levels': levels, 'sections': secs, 'clips': clips, 'cues': cues, 'words': words}, open(f'{A}/timing.json', 'w'), indent=0)
print('duration', round(total, 1), 's;', len(words), 'words')
for k, v in secs.items(): print(k, v['start'], v['end'])
for k, v in levels.items(): print('level', k, v['name'], v['start'], v['end'])
print(len(cues), 'cues')
for c in clips: print(c['id'], c['kind'], c['start'], c['end'], 'placeholder' if c.get('placeholder') else '')
print('endscreen', round(vo_end, 3), round(total, 3))
