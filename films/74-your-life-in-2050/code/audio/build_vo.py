#!/usr/bin/env python3
"""Film 74 'Your Life in 2050 If We Get AI Right' · lay the VO takes and the clip slots on one timeline -> vo_master.wav (VO + clip audio) + vo_only.wav (VO alone, for mix.py)
+ timing.json + slots.json. Method as Film 63 / 66 / 59 (segments.json from make_segments.py, word times from align_ps.py = pocketsphinx forced alignment + energy refinement;
ElevenLabs v4 takes via fal, voice akQnlreIUIoJxrTrosJj, stability 0.3, similarity 0.75, seed 4301).
Slots (own time on the timeline), kind 'clip', video + audio, 0.6 s of air before and after: C3 · C4 · C1 Demis Hassabis (original footage, cut to the spoken sentence
+ .3 s handles in /tmp/claude-0/f74/clips/<id>.wav, the frames in <id>/f%05d.jpg use the same window).
BREATH: extra air cut into a take at a paragraph break (prev word | next word): the script's beats (title, pivots, questions) get 0.3-0.9 s more than Eleven gives them.
End: the film ends END_TAIL s after the LAST VO word ('The children think it's music.'): ~4 s of ringing clock + the 15 s end screen.
usage: build_vo.py <audio_dir> <wav_dir> [clipwav_dir]   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl; wavs go to wav_dir; timing.json + slots.json go to audio_dir)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
CW = sys.argv[3].rstrip('/') if len(sys.argv) > 3 else WAV + '/clipwav'; SR = 48000
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
END_TAIL = float(os.environ.get('END_TAIL', 19.0))   # seconds from the last VO word to the end of the film (END_SCREEN of it is the end screen)
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.75, 1.3
CLIP_IN, CLIP_OUT = 0.6, 0.6
LEVELS = {'H': 'HOOK: your life in 2050, the alarm clock, your street', '1': 'work is optional: boats, motorbikes, the economists', '2': 'crossing the street: shared cars, gardens, Waymo off the freeways',
          '3': 'the roof robot, the printed house, what is left for you (C3 Hassabis)', '4': 'power like air: roofs, batteries, fusion, water, oranges, Australia', 'M': 'subscribe call 1',
          '5': 'dividend day (C4 Hassabis): Taiwan, South Korea, co-owner', '6': 'school: a teacher of her own, the workshop', '7': 'the bakery in the doctor\'s waiting room',
          '8': 'decades: the Moon town, orbit (C1 Hassabis)', '9': 'young forest, clean river, wolves', 'P': 'the town square: another person\'s time', 'E': 'what did you worry about', 'A2': 'closing call + the clock rings'}
SAME_BLOCK = set()
GAP_AFTER = {'t01': 0.5, 't02': 0.6, 't29': 0.5, 't30': 0.6, 't33': 1.4}   # her questions sit close; a long beat before the clock coda
QUOTES = {}   # Film 63: no quote cards
nz = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
def dec(f, ch=1):
    return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-']), np.float32).copy()
# breaths cut into a take: (take, first word after the breath, seconds of silence). Film 63: the title line of the hook needs a beat; text-v3 asks for a longer breath after the core sentence.
BREATH = {'t00': [('right.|Odds', 0.9), ('right.|You', 0.6)], 't02': [('work.|So', 0.4)], 't03': [('anyway.|And', 0.0), ('them.|And', 0.5)], 't04': [('more.|The', 0.3)],
          't05': [('rent.|So', 0.2)], 't06': [('car!"|The', 0.4), ('elevator.|So', 0.3)], 't07': [('back.|So', 0.4)], 't08': [('hour.|In', 0.4)], 't09': [('does.|So', 0.4), ('you?|Back', 0.2)],
          't10': [('expensive.|But', 0.5)], 't11': [('machines.|Power', 0.4)], 't12': [('desert.|The', 0.2)], 't14': [('once.|Dividend', 0.5), ('apartment.|In', 0.4)],
          't16': [('citizen.|Did', 0.4)], 't17': [('free.|That\'s', 0.4)], 't18': [('speed.|The', 0.1)], 't19': [('floats.|A', 0.3)], 't21': [('Decades.|Your', 0.4)],
          't22': [('after.|Back', 0.4)], 't23': [('did.|But', 0.5)], 't26': [('expensive.|A', 0.4)], 't31': [('about.|None', 0.6)]}
def breathe(x, W, ins):
    ins = [(next(i for i in range(1, len(W)) if W[i - 1][0] == k.split('|')[0] and W[i][0] == k.split('|')[1]), g) for k, g in ins if g > 0]
    for k, g in sorted(ins, reverse=True):
        a, b = W[k - 1][2] - .08, W[k][1] + .06; hop = SR // 100   # cut at the quietest 10 ms around the word boundary
        fr = [float(np.sqrt(np.mean(x[i:i + hop] ** 2))) for i in range(int(a * SR), int(b * SR), hop)]
        c = int(a * SR) + hop * int(np.argmin(fr)) + hop // 2
        x = np.concatenate([x[:c], np.zeros(int(g * SR), np.float32), x[c:]])
        W = [w if i < k else [w[0], round(w[1] + g, 3), round(w[2] + g, 3)] for i, w in enumerate(W)]
    return x, W
t, secs, words, slots, clips, inputs, delays = LEAD, {}, [], [], [], [], []
prev = None
for s in SEG:
    if 'text' in s:
        if prev:
            if prev[1].get('pause'): g = PAUSE
            elif prev[0] == 'slot': g = CLIP_OUT
            else: g = GAP_SECTION if prev[1]['sec'] != s['sec'] and (prev[1]['sec'], s['sec']) not in SAME_BLOCK else GAP_SUB
            g = GAP_AFTER.get(s['id'], g)
            t += g
        j = json.load(open(f"{DL}/vo-{s['id']}.json")); mp3 = f"{DL}/vo-{s['id']}.mp3"
        v0, v1 = tail_voiced(mp3)
        W = [[w, max(a, v0), min(b, v1 + .05)] for w, a, b in j['words']]
        W = [[w, a, max(b, a + .06)] for w, a, b in W]
        x = dec(mp3)
        if s['id'] in BREATH: x, W = breathe(x, W, BREATH[s['id']])
        first, last = W[0][1], W[-1][2]
        secs[s['id']] = {'start': round(t + first, 3), 'end': round(t + last, 3), 'sec': s['sec'], **({'cta': True} if s.get('cta') else {})}
        for w, a, b in W: words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
        if s.get('card'):   # the narrator reads the quote: the card slot = the quoted words (no own time)
            q = [nz(x) for x in QUOTES[s['card']].split()]; wn = [nz(x['w']) for x in words if x['sec'] == s['id']]; ws = [x for x in words if x['sec'] == s['id']]
            i0 = next(i for i in range(len(wn) - len(q) + 1) if wn[i:i + len(q)] == q)
            clips.append({'id': s['card'], 'kind': 'card', 'sec': s['sec'], 'start': ws[i0]['s'], 'end': ws[i0 + len(q) - 1]['e'], 'under': True})
        inputs.append(x); delays.append(t)
        t += last; prev = ('take', s)
    else:
        cw = f"{CW}/{s['id']}.wav"; ph = not os.path.exists(cw)
        d = s['dur'] if ph else round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', cw])), 3)
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False, 'placeholder': ph}
        meta = f"{CW}/{s['id']}.json"   # clips_wav.py: the trim inside <ROOT>clips/<id>.mp4 (the picture uses the same in/out)
        if not ph and os.path.exists(meta): e.update({k: v for k, v in json.load(open(meta)).items() if k in ('file', 'file_in_s', 'file_out_s')})
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')})
        t += d; prev = ('slot', s)
cta = [s for s in SEG if s.get('cta')]
vo_end = max(v['end'] for v in secs.values()); total = round(vo_end + END_TAIL, 3); end_start = round(total - END_SCREEN, 3)
def srms(x): x = x[np.abs(x) > 1e-3]; return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
N = int(total * SR); vo = np.zeros(N, np.float32)
for x, d in zip(inputs, delays):
    s0 = int(round(d * SR)); n = min(len(x), N - s0); vo[s0:s0 + n] += x[:n]
ref = srms(vo); full = vo.copy()
for e in slots:   # clip sound at the voice's speech level, short fades (the cuts end tight)
    f = f"{CW}/{e['id']}.wav"
    if not os.path.exists(f): print('no clip wav', f); continue
    x = dec(f)[:int(e['dur'] * SR)]; fi, fo = int(.01 * SR), int(.06 * SR); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    x *= ref / srms(x); s0 = int(round(e['start'] * SR)); full[s0:s0 + len(x)] += x[:N - s0]
for name, buf in (('vo_only', vo), ('vo_master', full)):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_s24le', f'{WAV}/{name}.wav'], input=buf.astype(np.float32).tobytes(), check=True)
levels = {}
for sid, v in secs.items():
    L = levels.setdefault(v['sec'], {'name': LEVELS.get(v['sec'], v['sec']), 'start': v['start'], 'end': v['end'], 'segments': []})
    L['end'] = v['end']; L['segments'].append(sid)
clips.sort(key=lambda c: c['start'])
out = {'duration': total, 'levels': levels, 'sections': secs, 'clips': clips, 'slots': slots,
       'end_screen': {'start': round(end_start, 3), 'dur': END_SCREEN, 'end': total, 'call': cta[-1]['id'], 'call_start': secs[cta[-1]['id']]['start'], 'call_end': secs[cta[-1]['id']]['end'],
                      'tail_after_vo': END_TAIL, 'note': 'after the last VO word: a quiet walk, then the 15 s end screen (the music fades out over it)'},
       'channel_calls': {s['id']: {'start': secs[s['id']]['start'], 'end': secs[s['id']]['end']} for s in cta},
       'words': words}
json.dump(out, open(f'{A}/timing.json', 'w'), indent=0, ensure_ascii=False)
print('duration', total, 's;', len(words), 'words; VO ends', round(vo_end, 1))
for e in slots: print('slot', e['id'], e['sec'], e['start'], e['end'], e['dur'], 'PLACEHOLDER (silent, no clip wav yet)' if e['placeholder'] else 'clip audio')
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots', 'clips')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
