#!/usr/bin/env python3
"""Lay VO takes (and, if a film has them, interview-clip / quote-card slots) onto one timeline -> vo_master.wav + timing.json.
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
# Film 18 (vo-v4, 33 takes, sections 1-8 = the stations of tools/provisional_timing.py): takes 0.9 s apart, stations 1.7 s;
# hook s00 runs straight into s01 (drop-off rule 28.10.: no pause at the hook end); longer air where text-v2.md has [pause]:
# after "would you subscribe?" (s15), after "the ground the machine stands on." (s21, end of the bad ending, station change),
# after "they chose to share." (s27) and before the closing lines (after s31 "That's what this channel is for.")
# Film 19 (vo-v5, 19 takes + clip slots C1-C3, sections 1-7 = chapters of text-v4.md): hook (s00-s01) runs into the loop with
# only 1.0 s (drop-off rule 28.10.); question -> answer "Can we change the route?" / "Only if we can see it." 1.2 s;
# "bigger, or smaller?" -> the test 1.4 s; longer air before the closing lines (after s17 "That's what this channel is for.")
GAP_AFTER = {'s01': 1.0, 's09': 1.2, 's11': 1.2, 's14': 1.4, 's17': 1.9}   # 7.11.: s11b = mid-film subscribe call (Jakob's rule: CTA mid + end, with the mission)
# after a clip slot: CLIP_OUT, or CLIP_OUT_SECTION when the next take opens a new chapter (C3 -> "A date sounds precise.")
CLIP_OUT_SECTION = 1.2
# extra air inside one take: (segment, word before, word after, seconds); the take is split at the quietest 10 ms between them
# Film 19: the reveal "That's what bent the first line", the birthday breath (text-v4 "Atempause"), after the 1973 quote,
# before the comment question, and the last two lines
BREATH = [('s04', 'two.', "That's", 0.5), ('s08', 'else.', "It's", 0.6), ('s09', 'forecast.', 'A', 0.4),
          ('s15', 'choices."', 'And', 0.5), ('s17', 'coming.', "What's", 0.5), ('s18', 'us...', 'Still', 0.3), ('s18', 'birthday.', 'Happy', 0.7)]
LEVELS = {'1': 'Hook: the line that aimed at Friday', '2': 'The loop · what bent the first line: more choices', '3': 'The stopwatch · doublings · the shape with a date',
          '4': 'A birthday · a projection, not a forecast · GPS', '5': 'See the road: counting, the stopwatch in public, the short ruler',
          '6': 'Many hands: help for everyone, few at the wheel, billions steer', '7': 'The birthday rule: increase the number of choices · ending'}
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
        d = s.get('dur', CARD)
        t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'kind': 'clip' if s.get('clip') else 'card', 'start': round(t, 3), 'end': round(t + d, 3), **{k: s[k] for k in ('file', 'name', 'role', 'label', 'text', 'after') if k in s}})
        t += d + (CLIP_OUT_SECTION if (nxt and nxt['sec'] != s['sec']) else CLIP_OUT)
        continue
    j = json.load(open(f"{A}/vo-{s['id']}.json")); mp3 = f"{A}/vo-{s['id']}.mp3"
    cs = cuts(s['id'], mp3, j['words'])
    shift = lambda a: a + sum(e for c, e in cs if c <= a)
    last = shift(j['words'][-1][2])
    secs[s['id']] = {'start': round(t, 3), 'end': round(t + last, 3), 'sec': s['sec']}
    # Film 19: timing.json carries the approved wording (segments.json "orig": no "..." pauses, the real name, not "fon Furster")
    shown = s['orig'].split() if 'orig' in s else [w for w, a, b in j['words']]
    assert len(shown) == len(j['words']), f"{s['id']}: {len(j['words'])} spoken words, {len(shown)} in orig"
    for (w, a, b), o in zip(j['words'], shown): words.append({'w': o, 's': round(t + shift(a), 3), 'e': round(t + shift(b), 3), 'sec': s['id']})
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
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
json.dump({'duration': round(total, 3), 'levels': levels, 'sections': secs, 'clips': clips, 'cues': cues, 'words': words}, open(f'{A}/timing.json', 'w'), indent=0)
# Film 19: the clip slots on their own (clip id, start, duration), for the clip cutter and tools/clip_check.py
if clips:
    json.dump({'film_duration': round(total, 3), 'vo_end': max(v['end'] for v in secs.values()), 'endscreen_start': round(total - TAIL, 3),
               'slots': [{'id': c['id'], 'start': c['start'], 'dur': round(c['end'] - c['start'], 3), 'end': c['end'], 'after': c.get('after', '')} for c in clips],
               'note': 'silent slots in vo_master; music under them is ducked -12 dB by mix.py; clips/<id>.wav (if present) is mixed in at start'},
              open(f'{A}/clips-slots.json', 'w'), indent=1)
print('duration', round(total, 1), 's;', len(words), 'words')
for k, v in secs.items(): print(k, v['start'], v['end'])
for k, v in levels.items(): print('level', k, v['name'], v['start'], v['end'])
print(len(cues), 'cues')
for c in clips: print(c['id'], c['start'], c['end'])
