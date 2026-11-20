#!/usr/bin/env python3
"""Lay the per-section VO takes onto one timeline -> vo_master.wav + timing.json (global word times).
usage: build_vo.py <audio_dir> <out_dir>"""
import json, subprocess, sys, os
A, OUT = sys.argv[1], sys.argv[2]
ORDER = ['01', '02', '03', '04', '05', '06', '07', '08', '09a', '09b', '09c', '09d', '10']
LEAD = 1.2                       # silence before the first word
GAP_AFTER = {'01': 5.2, '08': 2.2, '09d': 2.0}  # 01 -> title card; breathers before solutions and ending
GAP_DEFAULT, GAP_SUB, TAIL = 1.5, 1.3, 8.0
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
t, secs, words, inputs, delays = LEAD, {}, [], [], []
for i, sid in enumerate(ORDER):
    j = json.load(open(f'{A}/vo-{sid}.json')); mp3 = f'{A}/vo-{sid}.mp3'
    d = dur(mp3); last = j['words'][-1][2] if j['words'] else d
    secs[sid] = {'start': round(t, 3), 'end': round(t + last, 3), 'file': os.path.basename(mp3)}
    for w, s, e in j['words']: words.append({'w': w, 's': round(t + s, 3), 'e': round(t + e, 3), 'sec': sid})
    inputs += ['-i', mp3]; delays.append(t)
    nxt = ORDER[i + 1] if i + 1 < len(ORDER) else None
    gap = GAP_AFTER.get(sid, GAP_SUB if (nxt and sid.startswith('09') and nxt.startswith('09')) else GAP_DEFAULT)
    t += last + gap
total = t - GAP_DEFAULT + TAIL
fc = ''.join(f'[{k}:a]aresample=48000,adelay={int(d*1000)}:all=1[a{k}];' for k, d in enumerate(delays))
fc += ''.join(f'[a{k}]' for k in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{OUT}/vo_master.wav'])
json.dump({'duration': round(total, 3), 'sections': secs, 'words': words}, open(f'{OUT}/timing.json', 'w'), indent=0)
print('duration', round(total, 1), 's;', len(words), 'words'); [print(k, v['start'], v['end']) for k, v in secs.items()]
