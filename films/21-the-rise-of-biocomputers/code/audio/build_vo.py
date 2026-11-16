#!/usr/bin/env python3
"""Lay VO takes (and, if a film has them, interview-clip / quote-card slots) onto one timeline -> vo_master.wav + timing.json.
Film 19: clip slots C2/C3 only (kind clip, with name/role); C1 has no slot (muted footage under s01).
Film 16/18: no card slots (the VO keeps running under every quote card); timing.json also gets "levels" (hook, L1-L7, ending)
and "cues" (every [[QUOTE CARD]] / [[ON SCREEN]] line from segments.json, timed at the end of the spoken line it follows).
Clip slots stay silent here; clips/<K>.wav (if present) is mixed in at the slot by mix.py.
usage: build_vo.py <audio_dir> [wav_dir]   (Film 14: vo_master.wav goes to wav_dir, a scratchpad, because project storage is nearly full)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
SEG = json.load(open(f'{A}/segments.json'))
LEAD, TAIL = 1.0, 15.0                       # 15 s endscreen tail (drop-off rule 28.10.: max 15 s)
CARD = 5.5                                   # silent slot for a quote card (read on screen)
CLIP_IN, CLIP_OUT = 0.7, 0.6                 # air before / after a clip
GAP_SECTION, GAP_SUB = 1.7, 0.9
# Film 19 (vo-v3, 25 takes + clip slots C2/C3, sections 1-8 = the stations of the script): takes 0.9 s apart, stations 1.7 s;
# hook s00 runs on into s01 (s01 is the take the muted Doom footage C1 plays under, no slot); clip slots: 0.7 s air before, 0.6 s after
# (C3 1.2 s because the next take opens the ending)
GAP_AFTER = {'s00': 0.8}
# vo-v4 (2026-11-08): channel calls cta1 (mid, between "…four years." and "So why put these boxes…", which are two pieces s11 | s11b
# of the one vo-v3 take s11, cut at the quietest 10 ms between the words) and cta2 (after "…is up to us.", over the start of the end
# screen). 1.0 s air round each call. The film ends TAIL_LAST s after the last spoken word (end screen: quiet stretch >= 12 s with the
# free card areas; from "up to us" to the end ~20 s)
GAP_AFTER.update({'s11': 1.0, 'cta1': 1.0, 's24': 1.0})
TAIL_LAST = 12.5
CLIP_OUT_EXTRA = {'C3': 0.6}
# extra air inside one take: (segment, word before, word after, seconds); the take is split at the quietest 10 ms between them
BREATH = []
LEVELS = {'1': 'hook: computers on brain cells · Doom clip · no reward', '2': 'where the cells come from: blood, stem cells, a chip', '3': 'the Pong trick: order or chaos · Friston · Kagan clip',
          '4': 'from lab to product: rent, Doom', '5': 'why: twenty watts · the server racks · the power bill', '6': 'the match: cells against artificial intelligence, three rounds',
          '7': 'is anyone in there? neurons, Seth, embedded ethics · Hartung clip', '8': 'ending: order and noise · three rules · what they learn from us'}
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
_pcm = {}
def qcut(mp3, W, k):
    """the quietest 10 ms frame between word k-1 and word k of a take (seconds in the take)"""
    if mp3 not in _pcm: _pcm[mp3] = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    x = _pcm[mp3]; lo, hi = max(W[k - 1][1], W[k - 1][2] - .1), W[k][1]
    fr = [(float(np.sqrt(np.mean(x[int(t * 16000):int(t * 16000) + 160] ** 2))), t) for t in np.arange(lo, max(lo + .011, hi - .01), .01)]
    return round(min(fr)[1] + .005, 3)
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
t, secs, words, clips, inputs, delays, cues, fades = LEAD, {}, [], [], [], [], [], []
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('endcards'): continue
    if s.get('clip') or s.get('card'):
        d = s.get('dur', CARD)
        t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'clip' if s.get('clip') else 'card', 'start': round(t, 3), 'end': round(t + d, 3), **{k: s[k] for k in ('file', 'name', 'role', 'label', 'text') if k in s}})
        t += d + CLIP_OUT + CLIP_OUT_EXTRA.get(s['id'], 0)
        continue
    src = s.get('src', s['id'])
    j = json.load(open(f"{A}/vo-{src}.json")); mp3 = f"{A}/vo-{src}.mp3"
    c0, c1 = 0.0, None
    if 'words' in s:   # one piece of a take that a channel call splits: words [lo, hi), audio between the two quiet cuts
        W0 = j['words']; lo, hi = s['words'][0], s['words'][1] or len(W0)
        c0 = qcut(mp3, W0, lo) if lo > 0 else 0.0; c1 = qcut(mp3, W0, hi) if hi < len(W0) else None
        j = {'words': [[w, round(a - c0, 3), round((min(b, c1) if c1 else b) - c0, 3)] for w, a, b in W0[lo:hi]]}
        print(s['id'], 'piece of', src, 'cut', c0, c1)
    cs = [] if 'words' in s else cuts(s['id'], mp3, j['words'])
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
        b1 = bounds[p + 1] if bounds[p + 1] is not None else (c1 - c0 if c1 else None)
        inputs += ['-ss', str(c0 + bounds[p])] + (['-to', str(c0 + b1)] if b1 is not None else []) + ['-i', mp3]
        delays.append(t + shift(bounds[p])); fades.append((c0 + bounds[p] > 0, b1 - bounds[p] if b1 is not None and c1 else None))
    gap = GAP_AFTER.get(s['id'], GAP_SECTION if (nxt and nxt['sec'] != s['sec']) else GAP_SUB)
    t += last + gap
total = t + TAIL if not TAIL_LAST else t - gap + TAIL_LAST
fd = lambda k: (',afade=t=in:d=0.008' if fades[k][0] else '') + (f',afade=t=out:st={fades[k][1] - .008:.3f}:d=0.008' if fades[k][1] else '')   # no click at a piece cut
fc = ''.join(f'[{k}:a]aresample=48000{fd(k)},adelay={int(d*1000)}:all=1[a{k}];' for k, d in enumerate(delays))
fc += ''.join(f'[a{k}]' for k in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
json.dump({'duration': round(total, 3), 'levels': levels, 'sections': secs, 'clips': clips, 'cues': cues, 'words': words}, open(f'{A}/timing.json', 'w'), indent=0)
print('duration', round(total, 1), 's;', len(words), 'words')
for k, v in secs.items(): print(k, v['start'], v['end'])
for k, v in levels.items(): print('level', k, v['name'], v['start'], v['end'])
print(len(cues), 'cues')
for c in clips: print(c['id'], c['start'], c['end'])
