#!/usr/bin/env python3
"""Film 55 'The Best AI Is Locked Away' · lay the VO takes and the clip slots on one timeline -> vo_master.wav + timing.json + slots.json.
Method as Film 54 / 28 (segments.json from make_segments.py, word times from align_ps.py = pocketsphinx forced alignment + energy refinement; ElevenLabs v4 takes).
Slots (own time on the timeline), kind 'clip', 0.6 s of air before and after: A1 5 s (Altman, Dreamforce), C1 8 s (Altman, Berman), C4 7 s (Hobbhahn, Senate)
(text-v2 clip table). #55: NO footage and NO voice in a slot: the picture shows the quote as wall text, the music bed carries it (mix.py does not duck there).
Quote cards [QUOTE CARD] are read by the narrator inside a take (segments 'card'): no own time, the card entry (kind 'card', under: True) gets the quote's words
(vo-v4 has none any more: the Friar card was merged into a narrator line).
A take with 'pause' (a [pause] line in the text) gets PAUSE s of air before it. TEMPO: a few takes slowed slightly (ffmpeg atempo, pitch kept), word times scaled.
End: the film ends END_TAIL s after the last VO word: ~8 s quiet walk + the 15 s end screen (as tools/provisional_timing.py, TAIL 23).
usage: build_vo.py <audio_dir> <wav_dir>   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl, vo_master.wav goes to wav_dir)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
END_TAIL = float(os.environ.get('END_TAIL', 23.0))   # seconds from the last VO word to the end of the film (END_SCREEN of it is the end screen)
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.75, 1.3
CLIP_IN, CLIP_OUT = 0.6, 0.6
LEVELS = {'H': 'HOOK: the best A.I. is locked away, you are fifth in line', '1': 'mark 1: the lab (Fermat, 11 days -> 30 hours, A1 Altman, the inspector, Friar)',
          '2': 'marks 2 + 3: safety, Mythos, government, the giants (C1 Altman)', '3': 'mark 4: the defenders', 'M': 'subscribe call 1',
          '4': 'mark 5: you (Fable, the limit built in)', '5': 'behind you: everyone else, the tips', '6': 'the room: decided inside (C4 Hobbhahn)',
          '7': 'the clue and the big answer: newer + bigger, permission + power', '8': 'one evening: the core sentence', 'A2': 'closing call + end screen'}
TEMPO = {'t22': 0.96, 't23': 0.92}   # the closing lines came out quick (3.1 / 3.5 words/s): slowed a little for weight
nz = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
t, secs, words, slots, clips, inputs, delays = LEAD, {}, [], [], [], [], []
prev = None
for s in SEG:
    if 'text' in s:
        if prev:
            if s.get('pause'): g = PAUSE + (GAP_SECTION - GAP_SUB if prev[1]['sec'] != s['sec'] else 0)
            elif prev[0] == 'slot': g = CLIP_OUT
            else: g = GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB
            t += g
        j = json.load(open(f"{DL}/vo-{s['id']}.json")); mp3 = f"{DL}/vo-{s['id']}.mp3"; k = TEMPO.get(s['id'], 1.0)
        if k != 1.0:
            src, mp3 = mp3, f"{DL}/vo-{s['id']}.tempo.wav"
            subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'atempo={k}', '-ar', '48000', mp3])
            j['words'] = [[w, a / k, b / k] for w, a, b in j['words']]
        v0, v1 = tail_voiced(mp3)
        W = [[w, max(a, v0), min(b, v1 + .05)] for w, a, b in j['words']]
        W = [[w, a, max(b, a + .06)] for w, a, b in W]
        first, last = W[0][1], W[-1][2]
        secs[s['id']] = {'start': round(t + first, 3), 'end': round(t + last, 3), 'sec': s['sec'], **({'cta': True} if s.get('cta') else {})}
        for w, a, b in W: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
        if s.get('card'):   # the narrator reads the quote: the card slot = the quoted words (no own time)
            q = [nz(x) for x in s['card_quote'].split()]; wn = [nz(x['w']) for x in words if x['sec'] == s['id']]; ws = [x for x in words if x['sec'] == s['id']]
            i0 = next(i for i in range(len(wn) - len(q) + 1) if wn[i:i + len(q)] == q)
            clips.append({'id': s['card'], 'kind': 'card', 'sec': s['sec'], 'start': ws[i0]['s'], 'end': ws[i0 + len(q) - 1]['e'], 'under': True})
        inputs += ['-i', mp3]; delays.append(t)
        t += last; prev = ('take', s)
    else:
        d = s['dur']
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False, 'quote': s.get('quote', ''),
             'voice': None, 'note': 'silent slot: no footage, no voice; the picture shows the quote as wall text over the music bed'}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under', 'quote')})
        t += d; prev = ('slot', s)
cta = [s for s in SEG if s.get('cta')]
vo_end = secs[cta[-1]['id']]['end']; total = round(vo_end + END_TAIL, 3); end_start = round(total - END_SCREEN, 3)
fc = ''.join(f'[{n}:a]aresample=48000,adelay={int(d * 1000)}:all=1[a{n}];' for n, d in enumerate(delays))
fc += ''.join(f'[a{n}]' for n in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
clips.sort(key=lambda c: c['start'])
out = {'duration': total, 'source': os.environ.get('VO_SRC', 'vo-v4.txt'), 'film': '55-locked', 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta[-1]['id'], 'call_start': secs[cta[-1]['id']]['start'], 'call_end': secs[cta[-1]['id']]['end'],
                      'tail_after_vo': END_TAIL, 'note': 'after the last VO word: ~8 s quiet walk, then the 15 s end screen (music only, no voice; the music fades out over it)'},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in cta},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(vo_end, 1))
for c in clips: print('clip', c['id'], c['sec'], c['start'], c['end'], 'CARD read by the narrator (no own slot)' if c['under'] else '')
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots', 'clips')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
