#!/usr/bin/env python3
"""Film 24 · lay the VO takes and the silent slots on one timeline -> vo_master.wav + timing.json.
Method as films/19-biocomputer/audio/build_vo.py (segments.json from tools/f24_make_segments.py, word times from tools/f24_align.py).
Slots (silent here; mix.py puts the real sound/clip audio in):
  P1 / P2  kind 'sound'  the two pig calls of the hook, 3.0 s each, or the real length of clips/pig1-positive.wav / pig2-negative.wav
  C1..C5   kind 'clip'   planned lengths C1 10 s, C2 7 s, C3 7 s, C4 7 s, C5 9 s (segments.json 'dur'); the real footage replaces them:
                         slot = offset + dur from audio/clips.json (dur set), else 'dauer' from <data root>/clips/clips.json, else the length of clips/<id>.wav
[pause] (segment 'pause') = 1.2 s of silence instead of the normal gap. Channel calls cta1 (mid) and cta2 (end).
End screen: 15 s, starts END_LEAD s after the last word of the closing take ("...up to us."), so the closing call cta2 runs over its first seconds;
the film ends 15 s after that start.
usage: build_vo.py <audio_dir> [wav_dir]   (vo_master.wav goes to wav_dir, a scratchpad)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
ROOT = os.environ.get('F24ROOT', '/mnt/project-files/scenario/film-tiersprache').rstrip('/')
CLIPDIR = os.environ.get('F24CLIPS', ROOT + '/clips').rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN, END_LEAD = 0.6, 15.0, 0.5
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.85, 1.5
CLIP_IN, CLIP_OUT, SOUND_IN, SOUND_OUT = 0.7, 0.6, 0.3, 0.4
CLIP_OUT_EXTRA = {}
LEVELS = {'H': 'hook: two pigs, guess which · the team · 2030', '1': 'who they are: Earth Species Project · the founder · Raskin clip',
          '2': 'how a machine learns a language: the baby · autocomplete · recorders', '3': 'the tour: Kenya, Spain, Caribbean, Bahamas · Herzing clip · zebra finches',
          '4': 'the wall: why meaning is hard · toddlers · the humpback · mid channel call', '5': 'if they make it: whale songs · pigs · meat paradox',
          '6': 'the scenario: Kenya 2030 · courtroom · farm kitchen · back to today · end screen'}
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
def tail_voiced(mp3):
    """seconds in the take where the voice really ends / starts (last / first 10-ms frame above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
# real slot lengths
CL = json.load(open(f'{A}/clips.json')) if os.path.exists(f'{A}/clips.json') else {}
RC = {}
if os.path.exists(CLIPDIR + '/clips.json'):
    try: RC = {c['id']: c for c in json.load(open(CLIPDIR + '/clips.json')).get('clips', [])}
    except Exception as e: print('clips.json in the data root unreadable:', e)
def slot_len(s):
    i = s['id']
    if s.get('sound'):
        f = f"{CLIPDIR}/{s['file']}"
        return (round(dur(f), 3), 'wav') if os.path.exists(f) else (s['dur'], 'plan')
    k = CL.get(i, {})
    if k.get('dur'): return round(k.get('offset', 0) + k['dur'], 3), 'audio/clips.json'
    if RC.get(i, {}).get('dauer'): return round(float(RC[i]['dauer']) + k.get('offset', 0), 3), 'clips/clips.json'
    if os.path.exists(f'{CLIPDIR}/{i}.wav'): return round(dur(f'{CLIPDIR}/{i}.wav') + k.get('offset', 0), 3), 'wav'
    return s['dur'], 'plan'
t, secs, words, slots, clips, inputs, delays = LEAD, {}, [], [], [], [], []
prev = None   # ('take'|'slot', segment)
for i, s in enumerate(SEG):
    if 'text' in s:
        if prev:
            if prev[1].get('pause'): g = PAUSE
            elif prev[0] == 'slot': g = (SOUND_OUT if prev[1].get('sound') else CLIP_OUT + CLIP_OUT_EXTRA.get(prev[1]['id'], 0))
            else: g = GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB
            t += g
        j = json.load(open(f"{A}/vo-{s['id']}.json")); mp3 = f"{A}/vo-{s['id']}.mp3"
        v0, v1 = tail_voiced(mp3)
        W = [[w, max(a, v0), min(b, v1 + .05)] for w, a, b in j['words']]
        W = [[w, a, max(b, a + .06)] for w, a, b in W]
        last = W[-1][2]
        secs[s['id']] = {'start': round(t, 3), 'end': round(t + last, 3), 'sec': s['sec']}
        for w, a, b in W: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
        inputs += ['-i', mp3]; delays.append(t)
        t += last; prev = ('take', s)
    else:
        d, how = slot_len(s)
        t += (SOUND_IN if s.get('sound') else CLIP_IN) if prev and prev[0] == 'take' else 0
        e = {'id': s['id'], 'kind': 'sound' if s.get('sound') else 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'length_from': how, 'under': False, **({'file': s['file']} if s.get('sound') else {})}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')} | {k: s[k] for k in ('name', 'role', 'file') if k in s} | ({'planned': s['dur']} if how == 'plan' else {}))
        t += d; prev = ('slot', s)
# end screen: END_LEAD after the last word of the closing take (the take before the closing call cta2)
cta = next(s for s in reversed(SEG) if s.get('cta')); k = SEG.index(cta)
closing = SEG[k - 1]
end_start = secs[closing['id']]['end'] + END_LEAD
total = round(end_start + END_SCREEN, 3)
assert secs[cta['id']]['end'] <= total, 'the closing call must end before the film ends'
fc = ''.join(f'[{n}:a]aresample=48000,adelay={int(d * 1000)}:all=1[a{n}];' for n, d in enumerate(delays))
fc += ''.join(f'[a{n}]' for n in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
out = {'duration': total, 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta['id'], 'call_start': secs[cta['id']]['start'], 'call_end': secs[cta['id']]['end'],
                      'note': 'the closing call runs over the first seconds of the end screen'},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in SEG if s.get('cta')},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(secs[cta['id']]['end'], 1), '; end screen from', round(end_start, 1))
for kk, v in secs.items(): print(kk, v['start'], v['end'])
for c in slots: print('slot', c['id'], c['kind'], c['start'], c['end'], c['dur'], c['length_from'])
