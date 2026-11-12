#!/usr/bin/env python3
"""Film 28 'They're Using AI to Save the World' · lay the VO takes and the silent clip slots on one timeline -> vo_master.wav + timing.json + slots.json.
Method as films/25-last-job/audio/build_vo.py (segments.json from make_segments.py, word times from align_whisper.py = fal-ai/whisper word chunks).
Slots (silent here; the clip sound is put in later, at the edit):
  C3a 3.9 s, C1 14.7 s, C3 9.2 s, C5b 9.8 s (script tag [CLIP C5] = C5b)   kind 'clip', own slot, 0.6 s of air before and after
  C4 (6.0 s NASA replay)  MUTE footage UNDER the next VO take: no own slot, listed in clips[] with under=True, start = first word of that take
Take with 'pause': True = 1.2 s of silence after it instead of the normal gap.
End screen: 15 s, starts when the last VO word ends (the film ends 15 s after the end of the VO).
usage: build_vo.py <audio_dir> <wav_dir>   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl, vo_master.wav goes to wav_dir)"""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.85, 1.5
CLIP_IN, CLIP_OUT = 0.6, 0.6
LEVELS = {'H': 'HOOK: four projects, the question', '12': 'Maori speech machine (C1)', '11': 'scammer bots', '10': 'Wyoming eagles', '9': 'Nazca', '8': 'methane',
          '7': 'Casey Harrell (C3) + channel call', '6': 'dark ships', '5': 'tsunami (C4 under VO)', '4': 'elephant train', '3': 'snake antivenom', '2': 'conspiracy chatbot (C5b)',
          '1': 'flash floods', 'E': 'the answer + closing call + end screen'}
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
t, secs, words, slots, clips, inputs, delays = LEAD, {}, [], [], [], [], []
prev = None; under_next = None
for s in SEG:
    if 'text' in s:
        if prev:
            if prev[1].get('pause'): g = PAUSE
            elif prev[0] == 'slot': g = CLIP_OUT
            else: g = GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB
            t += g
        j = json.load(open(f"{DL}/vo-{s['id']}.json")); mp3 = f"{DL}/vo-{s['id']}.mp3"
        v0, v1 = tail_voiced(mp3)
        W = [[w, max(a, v0), min(b, v1 + .05)] for w, a, b in j['words']]
        W = [[w, a, max(b, a + .06)] for w, a, b in W]
        first, last = W[0][1], W[-1][2]
        secs[s['id']] = {'start': round(t + first, 3), 'end': round(t + last, 3), 'sec': s['sec'], **({'cta': True} if s.get('cta') else {})}
        for w, a, b in W: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
        if s.get('under'):
            d = {'C4': 6.0}[s['under']]
            clips.append({'id': s['under'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t + first, 3), 'end': round(t + first + d, 3), 'under': True})
        inputs += ['-i', mp3]; delays.append(t)
        t += last; prev = ('take', s)
    else:
        d = s['dur']
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')})
        t += d; prev = ('slot', s)
cta = [s for s in SEG if s.get('cta')]
vo_end = secs[cta[-1]['id']]['end']; end_start = vo_end; total = round(end_start + END_SCREEN, 3)
fc = ''.join(f'[{n}:a]aresample=48000,adelay={int(d * 1000)}:all=1[a{n}];' for n, d in enumerate(delays))
fc += ''.join(f'[a{n}]' for n in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
clips.sort(key=lambda c: c['start'])
out = {'duration': total, 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta[-1]['id'], 'call_start': secs[cta[-1]['id']]['start'], 'call_end': secs[cta[-1]['id']]['end'],
                      'note': 'quiet end screen, 15 s from the end of the last VO word'},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in cta},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(vo_end, 1))
for c in clips: print('clip', c['id'], c['sec'], c['start'], c['end'], 'UNDER VO (no own slot)' if c['under'] else '')
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots', 'clips')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
