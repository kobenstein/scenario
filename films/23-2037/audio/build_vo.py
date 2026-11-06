#!/usr/bin/env python3
"""Lay VO takes (and, if a film has them, interview-clip / quote-card slots) onto one timeline -> vo_master.wav + timing.json.
Film 16/18: no card slots (the VO keeps running under every quote card); timing.json also gets "levels" (hook, L1-L7, ending)
and "cues" (every [[QUOTE CARD]] / [[ON SCREEN]] line from segments.json, timed at the end of the spoken line it follows).
Clip slots stay silent here; clips/<K>.wav (if present) is mixed in at the slot by mix.py.
usage: build_vo.py <audio_dir> [wav_dir] [vo.txt]   (Film 14: vo_master.wav goes to wav_dir, a scratchpad, because project storage is nearly full)
Film 23: clip slots K1/K3/K4 (exact clip length, CLIP_IN air before, CLIP_OUT after); timing.json also gets "chapters" (the clock cards
06:15 ... 22:30, from the [[ON SCREEN: hh:mm]] cues), "endscreen", and every word in the spelling of vo.txt (the approved script:
the TTS text says "A.I." and has a few "..." pauses, timing.json says "AI" and ".", so subtitles and scene anchors match the script)."""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
ORIG = sys.argv[3] if len(sys.argv) > 3 else '/mnt/project-files/scenario/film-erster-tag/2037/vo-v5.txt'
SEG = json.load(open(f'{A}/segments.json'))
LEAD, TAIL = 1.0, 15.0                       # 15 s endscreen tail (drop-off rule 28.10.: max 15 s)
CARD = 5.5                                   # silent slot for a quote card (read on screen)
CLIP_IN, CLIP_OUT = 0.7, 0.6                 # air before / after a clip
GAP_SECTION, GAP_SUB = 1.7, 0.9
# Film 23 (vo-v5, 33 takes, sections 0-7 = clock chapters): takes 0.9 s apart, chapters 1.7 s; longer air after the questions
# that close a chapter, before the turn lines ("Meanwhile ...", "There's one job ...", "One person still ..."), after
# "It takes you a moment." (s26) and before the last line of the film (s31)
GAP_AFTER = {'s00': 1.0, 's01': 1.9, 's04': 1.9, 's06': 1.9, 's09': 1.4, 's10': 1.8, 's13': 1.3, 's14': 1.8, 's17': 2.0,
             's23': 1.0, 's26': 1.6, 's27': 1.4, 's28': 2.0, 's30': 1.4, 's31': 1.7}
# extra air inside one take: (segment, word before, word after, seconds); the take is split at the quietest 10 ms between them
BREATH = []
LEVELS = {'0': 'Hook · 06:15 the message from the clinic', '1': '06:15 the scan', '2': '07:30 the kid and her tutor', '3': '09:00 the night shift of science',
          '4': '12:00 the agent that works for you', '5': '16:00 your dad', '6': '19:00 dinner: "Why did it go well?"', '7': '22:30 the day ends'}
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
gap = GAP_SUB
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('endcards'): continue
    if s.get('clip') or s.get('card'):
        d = s.get('dur', CARD)
        t += CLIP_IN - gap
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'clip' if s.get('clip') else 'card', 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d,
                      **{k: s[k] for k in ('file', 'name', 'role', 'label', 'text', 'url', 'in', 'out') if k in s}})
        t += d + CLIP_OUT; gap = 0
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
total = t + TAIL
fc = ''.join(f'[{k}:a]aresample=48000,adelay={int(d*1000)}:all=1[a{k}];' for k, d in enumerate(delays))
fc += ''.join(f'[a{k}]' for k in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
# words in the script's spelling (see docstring); the token sequence must match vo.txt exactly
orig = re.sub(r'\[CLIP \w+\]', ' ', open(ORIG).read()).split()
for w in words: w['w'] = w['w'].replace('...', '.').replace('A.I.', 'AI')
if [w['w'] for w in words] != orig:
    bad = next(i for i, (a, b) in enumerate(zip([w['w'] for w in words], orig)) if a != b)
    raise SystemExit(f'words differ from {ORIG} at {bad}: {words[bad]["w"]} / {orig[bad]}')
chapters = [{'clock': c['text'], 't': c['t'], 'seg': c['seg']} for c in cues if re.fullmatch(r'\d\d:\d\d', c['text'])]
endscreen = {'start': round(words[-1]['e'] + 0.5, 3), 'end': round(total, 3)}
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
json.dump({'duration': round(total, 3), 'levels': levels, 'chapters': chapters, 'endscreen': endscreen, 'sections': secs, 'clips': clips, 'cues': cues, 'words': words},
          open(f'{A}/timing.json', 'w'), indent=0)
print('duration', round(total, 1), 's;', len(words), 'words')
for k, v in secs.items(): print(k, v['start'], v['end'])
for k, v in levels.items(): print('level', k, v['name'], v['start'], v['end'])
print(len(cues), 'cues')
for c in clips: print(c['id'], c['start'], c['end'])
for c in chapters: print('chapter', c['clock'], c['t'])
print('endscreen', endscreen)
