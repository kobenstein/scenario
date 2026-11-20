#!/usr/bin/env python3
"""Lay VO takes and interview-clip slots onto one timeline -> vo_master.wav + timing.json.
Clip slots stay silent here; clips/<K>.wav (if present) is mixed in at the slot by mix.py.
usage: build_vo.py <audio_dir>"""
import json, os, subprocess, sys
A = sys.argv[1].rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, TAIL = 1.4, 6.0
CLIP_IN, CLIP_OUT = 0.7, 0.6                 # air before / after a clip
GAP_SECTION, GAP_SUB = 2.0, 1.5      # GAP_SUB = the [pause] marks inside a chapter
GAP_AFTER = {'00a': 1.8, '07c': 1.8, '07d': 3.6, '08b': 1.8, '08c': 1.9}  # hold on the night sky, the last three lines
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
t, secs, words, clips, inputs, delays = LEAD, {}, [], [], [], []
for i, s in enumerate(SEG):
    nxt = SEG[i + 1] if i + 1 < len(SEG) else None
    if s.get('clip'):
        t += CLIP_IN - GAP_SUB
        clips.append({'id': s['id'], 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + s['dur'], 3), 'from': s['from'], 'to': s['to'], 'url': s['url'], 'src': s['src']})
        t += s['dur'] + CLIP_OUT
        continue
    j = json.load(open(f"{A}/vo-{s['id']}.json")); mp3 = f"{A}/vo-{s['id']}.mp3"
    last = j['words'][-1][2]
    secs[s['id']] = {'start': round(t, 3), 'end': round(t + last, 3), 'sec': s['sec']}
    for w, a, b in j['words']: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
    inputs += ['-i', mp3]; delays.append(t)
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
