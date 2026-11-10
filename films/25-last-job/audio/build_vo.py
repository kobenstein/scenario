#!/usr/bin/env python3
"""Film 25 'The Last Human Job' · lay the VO takes and the silent slots on one timeline -> vo_master.wav + timing.json.
Method as films/24-animals/audio/build_vo.py (segments.json from tools/f25_make_segments.py, word times from tools/f25_align.py).
Slots (silent here; mix.py puts the real sound/clip audio in):
  J1..J6, J3b  kind 'oton'  Jakob's own voice, real length of <ROOT>o-ton/clips-v1/<id>.wav (10.93 / 15.00 / 11.47 / 6.60 / 5.60 / 4.20 / 5.85 s);
               0.4 s of air before and after (Jakob 10.11.)
  K1..K3       kind 'clip'  interview clips (Brynjolfsson 13.2 s, Hinton 9.7 s, Gates 12.0 s planned, segments.json 'dur'); the real footage replaces them:
               slot = offset + dur from audio/clips.json (dur set), else 'dauer' from <ROOT>clips/clips.json, else the length of <ROOT>clips/<id>.wav
[PAUSE ] (segment 'pause') = 1.2 s of silence instead of the normal gap. Channel calls cta1 (mid) and cta2 (end).
End screen: 15 s, starts END_LEAD s after the end of the closing Jakob clip J6, so the closing call cta2 runs over its first seconds;
the film ends 15 s after that start.
usage: build_vo.py <audio_dir> [wav_dir]   (vo_master.wav goes to wav_dir, a scratchpad)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A
ROOT = os.environ.get('F25ROOT', '/mnt/project-files/scenario/film-last-human-job').rstrip('/')
CLIPDIR = os.environ.get('F25CLIPS', ROOT + '/clips').rstrip('/')
OTON = os.environ.get('F25OTON', ROOT + '/o-ton/clips-v1').rstrip('/')
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN, END_LEAD = 0.6, 15.0, 0.5
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.85, 1.5
CLIP_IN, CLIP_OUT, OTON_IN, OTON_OUT, SLOT_SLOT = 0.7, 0.6, 0.4, 0.4, 0.8
CLIP_OUT_EXTRA = {}
LEVELS = {'H': 'HOOK: the domino row · the task · Jakob (J1)', '1': 'AKT 1: what falls first · numbers 10, 9, 8 · Brynjolfsson clip (K1) · Jakob (J2)',
          '2': 'AKT 2: the turn · number 7 · Jakob (J3, J3b) · the radiologists · Jakob (J4) · mid channel call · number 6',
          '3': 'AKT 3: what holds long · numbers 5, 4, 3, 2 · Hinton clip (K2) · Jakob (J5)', '4': 'PLATZ 1: number one, the one we want a human',
          '5': 'AKT 4: what protects you · five steps · Gates clip (K3)', '6': 'ENDE: the step you take next · Jakob (J6) · end screen'}
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
for cj in (CLIPDIR + '/clips.json', ROOT + '/clips.json'):   # the data root's clips.json (K1/K2 'dauer'; K3 null until cut)
    if os.path.exists(cj):
        try: RC = {c['id']: c for c in json.load(open(cj)).get('clips', [])}; break
        except Exception as e: print(cj, 'unreadable:', e)
def slot_len(s):
    i = s['id']
    if s.get('oton'):
        f = f"{OTON}/{s['file']}"
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
            elif prev[0] == 'slot': g = (OTON_OUT if prev[1].get('oton') else CLIP_OUT + CLIP_OUT_EXTRA.get(prev[1]['id'], 0))
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
        t += ((OTON_IN if s.get('oton') else CLIP_IN) if prev[0] == 'take' else SLOT_SLOT) if prev else 0   # J3 -> J3b: two slots in a row, 0.8 s of air between the two recordings
        meta = {k: CL[s['id']][k] for k in ('name', 'role') if k in CL.get(s['id'], {})}
        e = {'id': s['id'], 'kind': 'oton' if s.get('oton') else 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'length_from': how, 'under': False, **({'file': s['file']} if s.get('oton') else {})}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')} | {k: s[k] for k in ('file',) if k in s} | meta | ({'planned': s['dur']} if how == 'plan' else {}))
        t += d; prev = ('slot', s)
# end screen: END_LEAD after the end of the closing item (the Jakob clip J6 before the closing call cta2)
cta = next(s for s in reversed(SEG) if s.get('cta')); k = SEG.index(cta)
closing = SEG[k - 1]
end_start = (secs[closing['id']]['end'] if closing['id'] in secs else next(c['end'] for c in slots if c['id'] == closing['id'])) + END_LEAD
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
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)   # small copy for the picture lead (slot starts, end screen)
