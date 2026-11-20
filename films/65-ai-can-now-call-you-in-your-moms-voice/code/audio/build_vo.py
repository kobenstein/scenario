#!/usr/bin/env python3
"""Film 65 "AI Can Now Call You in Your Mom's Voice" · lay the VO takes and the clip slots on one timeline -> vo_master.wav + timing.json + slots.json.
Method as #29 / #55 (segments.json from make_segments.py, word times from align_ps.py = pocketsphinx forced alignment + energy refinement; ElevenLabs v4 takes).
Slots (kind 'clip', in film order): S1 Del Mastro (step 1), C10 FBI podcast (step 4), C1 Meador / FTC (step 4), S2 Benda / ABA (step 5).
  S1, C1, S2 = REAL FOOTAGE: the slot is the whole cut file in <ROOT>clips/ (its own sound, ~0.4 s of room tone at both ends), footage: True,
               source_file = that mp4, offset 0 (frame 1 of the file = slot start). mix.py plays <wav_dir>/clipwav/<id>.wav there at the voice's level.
  C10        = QUOTE CARD (podcast narrator over a music bed: rule 'music = red'): a SILENT slot of ~7 s, card: True; only the music bed plays (lifted).
  CLIP_IN / CLIP_OUT = 0.6 s of air between the last VO word and the slot start, and between the slot end and the next VO word.
End: the film ends END_TAIL s after the last VO word (the subscribe call A2): ~2 s of air + the 15 s end screen (as tools/provisional_timing.py, TAIL 17).
usage: build_vo.py <audio_dir> <wav_dir>   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl, vo_master.wav goes to wav_dir)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
END_TAIL = float(os.environ.get('END_TAIL', 17.0))   # seconds from the last VO word to the end of the film (END_SCREEN of it is the end screen)
PAUSE, GAP_SUB, GAP_SECTION, CARD_AIR = 1.2, 0.75, 1.3, 2.2
CLIP_IN, CLIP_OUT = 0.6, 0.6
LEVELS = {'H': 'HOOK: A.I. can call you in your mom\'s voice; nearly 8 billion lost; her phone rings; five steps, one a machine cannot fake',
          '1': 'step 1, the voice: the California mother before the Senate (S1 Del Mastro), the silent seconds, the code word',
          '2': 'step 2, the story: chat machines, the dating-app personas, the one question', '3': 'step 3, the face: the forged prime minister, investment fraud, the house rule',
          'M': 'subscribe call 1', '4': 'step 4, the clock: the fake agent, C10 FBI podcast quote card, the plan on a calm day, C1 Meador (FTC)',
          '5': 'step 5, the money: the trusted contact, the banks, S2 Benda (ABA), test it', '6': 'the big answer: a copy needs an original; trust moves to what you agreed; the kitchen table',
          '7': 'the ending: her phone does ring; she asks for the word; the line goes quiet', 'A2': 'closing subscribe call + end screen'}
TEMPO = {}
# extra air INSIDE a take after a phrase (the take is cut in the middle of the pause there): room for an accent, never under a running sentence
AIR = {'t00': [('Her phone rings.', 1.1)],                  # the phone rings (hook)
       't15': [('the money.', 0.8)],                         # the [pause] the voice skipped
       't21': [('her phone does ring.', 1.1), ('right now.', 0.4), ('The line goes quiet.', 0.9)]}   # ring again; the [pause]; the line goes dead
AFTER = {'t20': 0.6}   # a beat before the ending (section 7)
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
            t += AFTER.get(prev[1]['id'], 0) if prev[0] == 'take' else 0
            if s.get('card_air'): g = (GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB) + CARD_AIR; air0 = t + (GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB) * .5
            elif s.get('pause'): g = PAUSE + (GAP_SECTION - GAP_SUB if prev[1]['sec'] != s['sec'] else 0)
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
        cuts = []   # (cut time in the take, air)
        for ph, air in AIR.get(s['id'], []):
            q = [nz(x) for x in ph.split()]; wn0 = [nz(x[0]) for x in W]
            i = next(i for i in range(len(wn0) - len(q) + 1) if wn0[i:i + len(q)] == q) + len(q) - 1
            cuts.append(((W[i][2] + W[i + 1][1]) / 2, air))
        cuts.sort(); dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
        bounds = [0.0] + [c for c, _ in cuts] + [dur]; shifts = [0.0]
        for _, air in cuts: shifts.append(shifts[-1] + air)
        W = [[w, a + shifts[sum(1 for c, _ in cuts if a > c)], b + shifts[sum(1 for c, _ in cuts if a > c)]] for w, a, b in W]
        first, last = W[0][1], W[-1][2]
        secs[s['id']] = {'start': round(t + first, 3), 'end': round(t + last, 3), 'sec': s['sec'], **({'cta': True} if s.get('cta') else {})}
        for w, a, b in W: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
        ws = [x for x in words if x['sec'] == s['id']]; wn = [nz(x['w']) for x in ws]
        if s.get('card'):   # the narrator reads the quote: the card slot = the quoted words (no own time)
            q = [nz(x) for x in s['card_quote'].split()]
            i0 = next(i for i in range(len(wn) - len(q) + 1) if wn[i:i + len(q)] == q)
            clips.append({'id': s['card'], 'kind': 'card', 'sec': s['sec'], 'start': ws[i0]['s'], 'end': ws[i0 + len(q) - 1]['e'], 'under': True,
                          'text': s['card_text'], 'credit': s['card_credit'], 'spoken': True})
        if s.get('card_air'):   # a picture-only card: from the start of the extra air to the end of the take's first line
            n1 = len([w for w in re.sub(r'\[[^\]]*\]', ' ', s['air_line']).split() if re.search(r'[A-Za-z0-9]', w)])
            clips.append({'id': s['card_air'], 'kind': 'card', 'sec': s['sec'], 'start': round(air0, 3), 'end': ws[n1 - 1]['e'], 'under': True,
                          'text': s['air_text'], 'credit': s['air_credit'], 'spoken': False, 'read_alone': round(ws[0]['s'] - air0, 3)})
        for k2 in range(len(bounds) - 1): inputs += ['-i', mp3]; delays.append((t + bounds[k2] + shifts[k2], bounds[k2], bounds[k2 + 1]))
        t += last; prev = ('take', s)
    else:
        d = s['dur']
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False, 'quote': s.get('quote', ''),
             'speaker': s.get('speaker', ''), 'voice': None, 'footage': bool(s.get('footage'))}
        if s.get('footage'): e.update(source_file=s['file'], offset=0.0, note='real footage: the clip sound plays in the slot (whole cut file, frame 1 = slot start)')
        else: e.update(card=True, note='quote card (no footage, no clip sound): music only, ~7 s to read it')
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under', 'quote', 'speaker', 'footage')} | ({'card': True} if e.get('card') else {}))
        t += d; prev = ('slot', s)
cta = [s for s in SEG if s.get('cta')]
vo_end = secs[cta[-1]['id']]['end']; total = round(vo_end + END_TAIL, 3); end_start = round(total - END_SCREEN, 3)
fc = ''.join(f'[{n}:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,aresample=48000,adelay={int(round(d * 1000))}:all=1[a{n}];' for n, (d, a, b) in enumerate(delays))
fc += ''.join(f'[a{n}]' for n in range(len(delays))) + f'amix=inputs={len(delays)}:normalize=0,apad,atrim=0:{total:.3f}[o]'
subprocess.check_call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{WAV}/vo_master.wav'])
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
clips.sort(key=lambda c: c['start'])
out = {'duration': total, 'source': os.environ.get('VO_SRC', 'vo-v3.txt'), 'film': '65-mom-voice', 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta[-1]['id'], 'call_start': secs[cta[-1]['id']]['start'], 'call_end': secs[cta[-1]['id']]['end'],
                      'tail_after_vo': END_TAIL, 'note': 'after the last VO word: ~2 s of air, then the 15 s end screen (music only, no voice; the music fades out over it)'},
       'hook': {'start': levels['H']['start'], 'end': levels['H']['end']},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in cta},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(vo_end, 1))
for c in clips: print('clip', c['id'], c['sec'], c['start'], c['end'], 'footage' if c.get('footage') else 'QUOTE CARD (silent slot)')
json.dump({k: out[k] for k in ('duration', 'source', 'hook', 'end_screen', 'channel_calls', 'slots', 'clips')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
