#!/usr/bin/env python3
"""Film 26 'Why Elon Says Saving Money Is Pointless' · lay the VO takes and the silent clip slots on one timeline -> vo_master.wav + timing.json (+ slots.json).
Method as films/25-last-job/audio/build_vo.py (segments.json from tools/f26_make_segments.py, word times from tools/f26_align.py).
Slots C1, C2, C4, C3, C5 (kind 'clip', silent here; segments.json 'dur' = clips.json dauer_s 14.4 / 5.6 / 6.25 / 6.4 / 12.6 s). The real clips replace them: slot length =
offset + dur from audio/clips.json (dur set), else the length of <ROOT>clips/<id>.wav, else the planned one. 0.7 s of air before and 0.6 s after a slot.
'pause' on a take = 1.2 s of silence after it. Channel calls cta1 (mid) and cta2 (end).
Sections (word 'sec' = take id; sections[take].sec = chapter id): H hook · 1 the quote · 2 line 1 · 3 line 2 · 4 line 3 · 5 line 4 · 6 line 5 · 7 the fix · 8 verdict.
End screen: 15 s, starts END_LEAD s after the last word (the closing call cta2); the film ends 15 s later.
usage: build_vo.py <audio_dir> [wav_dir]   (vo_master.wav goes to wav_dir, a scratchpad)"""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
ROOT = os.environ.get('F26ROOT', '/mnt/project-files/scenario/film-sparen').rstrip('/')
CLIPDIR = os.environ.get('F26CLIPS', ROOT + '/clips').rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN, END_LEAD = 0.6, 15.0, 0.4
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.75, 1.3
CLIP_IN, CLIP_OUT = 0.7, 0.6
LEVELS = {'H': 'HOOK: the claim', '1': 'STATION 1: his strongest argument (C1)', '2': 'LINE 1: machines make almost everything', '3': 'LINE 2: everything gets cheap',
          '4': 'LINE 3: someone pays you an income (C2, C4)', '5': 'LINE 4: it arrives in time (C3)', '6': 'LINE 5: if he is wrong, you are still fine',
          '7': 'THE FIX: a law (C5)', '8': 'VERDICT + end screen'}
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
CL = json.load(open(f'{A}/clips.json')) if os.path.exists(f'{A}/clips.json') else {}
def slot_len(s):
    k = CL.get(s['id'], {})
    if k.get('dur'): return round(k.get('offset', 0) + k['dur'], 3), 'audio/clips.json'
    if os.path.exists(f"{CLIPDIR}/{s['id']}.wav"): return round(dur(f"{CLIPDIR}/{s['id']}.wav") + k.get('offset', 0), 3), 'wav'
    return s['dur'], 'plan'
t, secs, words, slots, clips, inputs, delays = LEAD, {}, [], [], [], [], []
prev = None
for s in SEG:
    if 'text' in s:
        if prev:
            if prev[1].get('pause'): g = PAUSE
            elif prev[0] == 'slot': g = CLIP_OUT
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
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'length_from': how, 'under': False}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')} | ({'planned': s['dur']} if how == 'plan' else {}))
        t += d; prev = ('slot', s)
cta = next(s for s in reversed(SEG) if s.get('cta'))
vo_end = secs[cta['id']]['end']
end_start = vo_end + END_LEAD
total = round(end_start + END_SCREEN, 3)
fc = ''.join(f'[{n}:a]aresample=48000,adelay={int(d * 1000)}:all=1[a{n}];' for n, d in enumerate(delays))
fc += ''.join(f'[a{n}]' for n in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
out = {'duration': total, 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta['id'], 'call_start': secs[cta['id']]['start'], 'call_end': vo_end},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in SEG if s.get('cta')},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(vo_end, 1), '; end screen from', round(end_start, 1))
for k, v in levels.items(): print('level', k, round(v['start'], 1), round(v['end'], 1))
for c in slots: print('slot', c['id'], c['start'], c['end'], c['dur'], c['length_from'])
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
