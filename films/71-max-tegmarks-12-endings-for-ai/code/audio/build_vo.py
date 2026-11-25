#!/usr/bin/env python3
"""Film 71 "Max Tegmark's 12 Endings for AI" · lay the VO takes and the clip slots on one timeline -> vo_master.wav (VO + clip audio) + vo_only.wav (VO alone, for mix.py)
+ timing.json + slots.json (here and, with F71ROOT set or default, copied to <ROOT>audio/). Method as Film 69 (segments.json from make_segments.py = text-v2.md, word times from
align_ps.py = pocketsphinx forced alignment + energy refinement; ElevenLabs v4 takes, voice akQnlreIUIoJxrTrosJj, stability 0.3, similarity 0.75, seed 4301).
Gaps (voice end -> next voice start): GAP_SUB 0.75 s between takes of one station, GAP_SECTION 1.3 s between stations (text-v2 Anhang A: 14 station pauses of ~0.6 s on top of
the take gap), NO station pause at the hook end (H -> 12 gets GAP_SUB, text-v2: "Kein Halt am Hook-Ende"). [PAUSE 1 s] in text-v2 = the take before it has 'pause':
its gap gets PAUSE_EXTRA 1.0 s on top. GAP_EXTRA = a little more air before a take where a door accent sits in the station gap (mix.py checks no SFX touches a word).
Slots (own time on the timeline), kind 'clip', video + audio, 0.6 s of air before and after. Length = the cut file films/71-assets/clips/Cn.mp4, or the planned length
(placeholder: true, silent) while the cut is not there: C1 Tegmark (Cambridge) · C2 Dean Ball · C4 Tegmark (Keating) · C5 Sam Altman · C6 Tegmark (Pro-Human Assembly). C3 is not in the film.
Clip sound: <clipwav>/<id>.wav (clips_wav.py) into vo_master.wav at the level of the voice (speech RMS matched); mix.py takes vo_only.wav + the clip wavs.
End: the film ends END_TAIL s after the last VO word: ~4 s of air + the 15 s end screen (picture and music run on, no voice).
usage: build_vo.py <audio_dir> <wav_dir> [clipwav_dir]   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl; wavs go to wav_dir; timing.json + slots.json go to audio_dir)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
CW = sys.argv[3].rstrip('/') if len(sys.argv) > 3 else WAV + '/clipwav'; SR = 48000
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
END_TAIL = float(os.environ.get('END_TAIL', 19.0))   # seconds from the last VO word to the end of the film (END_SCREEN of it is the end screen)
PAUSE_EXTRA, GAP_SUB, GAP_SECTION = 1.0, 0.75, 1.3
CLIP_IN, CLIP_OUT = 0.6, 0.6
NO_STATION_PAUSE = {('H', '12')}   # the hook runs straight into ending 12/12
GAP_EXTRA = {'t12': 0.5, 't22': 0.5}   # door accents in the station gap: 8 -> 7 (from here on, you live) and 2 -> 1 (the golden door)
LEVELS = {'H': 'HOOK: twelve endings, three mornings, something happened for every ending this year (C1 Tegmark: lost control this summer), decided this year',
          '12': 'ENDING 12/12 Conquerors: the OpenAI test breakout at Hugging Face, the switch, Dean Ball (C2 P(doom) 0.01%), ninety percent',
          '11': 'ENDING 11/12 Self-Destruction: Doomsday Clock 85 seconds', '10': 'ENDING 10/12 Zookeeper: behind glass, the AI-only social network',
          '9': 'ENDING 9/12 1984: camera network Hong Kong, chip tracking bill', '8': 'ENDING 8/12 Descendants: the movement (C4 Tegmark: a new species), end of the dark list',
          '7': 'ENDING 7/12 Enslaved God: the key, the national labs', 'M': 'subscribe call 1', '6': 'ENDING 6/12 Reversion: pull the plug, phone bans',
          '5': 'ENDING 5/12 Benevolent Dictator: sectors, the UAE government on AI agents', '4': 'ENDING 4/12 Gatekeeper: the ban bill, Hugging Face guards, chip tracking',
          '3': 'ENDING 3/12 Libertarian Utopia: the rent, machines paying each other', '2': 'ENDING 2/12 Protector God: ChatGPT age guess, the EU law says machines must say so',
          '1': 'ENDING 1/12 Egalitarian Utopia: the morning from the start, Malta, the catch', 'S': 'CLOSE: the open switches (C5 Altman: pace), chips, rules, the key, (C6 Tegmark: for us to decide), decided this year',
          'A2': 'closing call + end screen'}
QUOTES = {}   # Film 71: no quote cards
nz = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
def dec(f, ch=1):
    return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-']), np.float32).copy()
# breaths cut into a take: (take, first word after the breath ['word#n' = n-th occurrence], seconds of silence). Film 71 as 69: room for the SFX accents, so they never sit under a running sentence
BREATH = {'t01': [('A#2', 0.35), ('A#3', 0.35), ('And', 0.25)],   # 'A law.' | stamp | 'A test gone wrong.' | stamp | 'A government ... to AI.' | stamp | 'And when Tegmark'
          't04': [('That', 0.5)],                                  # 'This year, someone touched it.' | stamp | 'That goes for all twelve.'
          't06': [('One', 0.8)],                                   # 'the closest ever.' | clock tick | 'One reason on their list'
          't14': [('You', 0.6)]}                                   # 'Pull the plug.' | screen off | 'You wake up with the light.'
def breathe(x, W, ins):
    out = []   # 'word#n' = the n-th occurrence of that word in the take (default 1st); never the take's first word
    for k, g in ins:
        w, n = (k.split('#') + ['1'])[:2]
        out.append(([i for i, x in enumerate(W) if x[0] == w and i > 0][int(n) - 1], g))
    ins = out
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
            if prev[0] == 'slot': g = CLIP_OUT
            elif prev[1]['sec'] != s['sec']: g = GAP_SUB if (prev[1]['sec'], s['sec']) in NO_STATION_PAUSE else GAP_SECTION
            else: g = GAP_SUB
            if prev[0] == 'take' and prev[1].get('pause'): g += PAUSE_EXTRA
            t += g + GAP_EXTRA.get(s['id'], 0)
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
        d = s['dur']
        if prev and prev[0] == 'take': t += CLIP_IN + (PAUSE_EXTRA if prev[1].get('pause') else 0)
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False, **({'placeholder': True} if s.get('placeholder') else {'file': s.get('file')})}
        slots.append(e); clips.append({k: e[k] for k in ('id', 'kind', 'sec', 'start', 'end', 'under')})
        t += d; prev = ('slot', s)
cta = [s for s in SEG if s.get('cta')]
vo_end = secs[cta[-1]['id']]['end']; total = round(vo_end + END_TAIL, 3); end_start = round(total - END_SCREEN, 3)
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
for c in clips: print('clip', c['id'], c['sec'], c['start'], c['end'], 'CARD read by the narrator (no own slot)' if c['under'] else '')
json.dump({k: out[k] for k in ('duration', 'end_screen', 'channel_calls', 'slots', 'clips')}, open(f'{A}/slots.json', 'w'), indent=1, ensure_ascii=False)
ROOT = os.environ.get('F71ROOT', '/mnt/project-files/scenario/film-tegmark').rstrip('/')
if os.environ.get('NO_ROOT_COPY') != '1' and os.path.isdir(ROOT):
    os.makedirs(f'{ROOT}/audio', exist_ok=True)
    for f in ('timing.json', 'slots.json'): subprocess.run(['cp', f'{A}/{f}', f'{ROOT}/audio/{f}'], check=True)
    print('copied timing.json + slots.json ->', f'{ROOT}/audio/')
