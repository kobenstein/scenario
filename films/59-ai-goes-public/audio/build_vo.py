#!/usr/bin/env python3
"""Film 59 'You Can Now Buy a Piece of AI' · lay the VO takes and the clip slots on one timeline -> vo_master.wav (VO + real clip audio) + vo_only.wav (VO alone, for mix.py)
+ timing.json + slots.json. Method as Film 54 / 28 (segments.json from make_segments.py, word times from align_ps.py = pocketsphinx forced alignment + energy refinement;
ElevenLabs v4 takes, voice akQnlreIUIoJxrTrosJj, stability 0.3, similarity 0.75, seed 4301).
Slots (own time on the timeline), kind 'clip', video + audio, 0.6 s of air before and after (clips/schnitt.json 16.11., in/out inside the cut files clips/Cn.mp4):
  C1 5.09 s (Dario Amodei, UN Security Council), C2 11.94 s (Yoshua Bengio, UN Security Council), C3 9.22 s (Dario Amodei, UN Security Council)
The clip sound (<clipwav>/<id>.wav = Cn.mp4 [in, out]) goes into vo_master.wav at the level of the voice (speech RMS matched); mix.py takes vo_only.wav + the clip wavs.
Quote card Z1 is READ by the narrator inside a take (segments 'card'): no own time; the card entry (kind 'card', under: True) gets the start/end of the quoted words.
No QR windows (abolished). End: the film ends END_TAIL s after the last VO word: a short breath + the 15 s end screen (picture and music run on, no voice).
usage: build_vo.py <audio_dir> <wav_dir> [clipwav_dir]   (vo-<id>.mp3 / vo-<id>.json in <wav_dir>/dl; wavs go to wav_dir)"""
import json, os, re, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/'); WAV = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else A; DL = WAV + '/dl'
CW = sys.argv[3].rstrip('/') if len(sys.argv) > 3 else WAV + '/clipwav'; SR = 48000
SEG = json.load(open(f'{A}/segments.json'))
LEAD, END_SCREEN = 0.6, 15.0
END_TAIL = float(os.environ.get('END_TAIL', 18.0))   # seconds from the last VO word to the end of the film (END_SCREEN of it is the end screen)
PAUSE, GAP_SUB, GAP_SECTION = 1.2, 0.75, 1.3
CLIP_IN, CLIP_OUT = 0.6, 0.6
LEVELS = {'H': 'HOOK: the button, the warning label, the dinner table', '1': 'the facts: Anthropic, Thursday, the price range', '2': 'STEP 1 the pitch: warnings, votes, the trust (C1, Z1 card)',
          '3': 'STEP 2 the orders are counted: the doubts (C2), the answer, on the record', 'M': 'subscribe call 1', '4': 'STEP 3 pricing night: known vs forecast (C3), orders, the fall',
          '5': 'STEP 4 first trade + 15 trading days: the index clock', '6': 'the wheel is not for sale: the stake', 'A2': 'closing call + end screen'}
QUOTES = {'Z1': 'may not maximize stockholder value.'}
nz = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
def tail_voiced(mp3):
    """seconds in the take where the voice really starts / ends (10-ms frames above -48 dBFS): the TTS tail is silent"""
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    fr = np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-48 / 20)
    on = np.nonzero(fr)[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else (0.0, len(x) / 16000)
def dec(f, ch=1):
    return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-']), np.float32).copy()
# breaths cut into a take: (take, word index of the word that starts after the breath, seconds of silence). Film 59: the title line of the hook needs a beat.
BREATH = {'t00': [(8, 0.7)]}   # 'You can now buy a piece of A.I.' | 'Picture this coming Thursday.'
def breathe(x, W, ins):
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
            else: g = GAP_SECTION if prev[1]['sec'] != s['sec'] else GAP_SUB
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
        d = s['dur']
        if prev and prev[0] == 'take': t += CLIP_IN
        e = {'id': s['id'], 'kind': 'clip', 'sec': s['sec'], 'start': round(t, 3), 'end': round(t + d, 3), 'dur': d, 'under': False}
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
