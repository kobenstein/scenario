#!/usr/bin/env python3
"""Film 23 quote mode: the narrator reads each interview quote (K1/K3/K4) into its clip slot, for when the real clips are not available.
usage: quotes.py <audio_dir>   reads <audio_dir>/clips.json (slot lengths, transcripts) and the Eleven v4 takes
quotes/<take>.mp3 + .json (save_tts format; same voice/settings as the VO, tag "[quietly, quoting, ...]"), writes quotes/<K>.wav
(48 kHz stereo, starts at the first sound) and quotes/<K>.json {take, request_id, tempo, trims, dur, offset (wav start in the slot),
words: [[w, s, e]] from the wav start, in the transcript's spelling}. build_vo.py places them in the slot (clips[i].quote / clips[i].words), mix.py QUOTE=1 mixes them.
Fitting: no word is cut. Pauses inside the take longer than PAUSE_MAX are shortened to PAUSE_MAX (cut in their middle) only if the take is too long, then the take is
sped up with ffmpeg atempo (pitch kept) just enough that the sound fits the slot minus MARGIN at both ends (tempo 1.0 if it already fits)."""
import json, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/') + '/'; Q = A + 'quotes/'; SR = 48000
TAKES = {'K1': 'K1-b', 'K3': 'K3-e', 'K4': 'K4-b'}   # chosen takes (06.11.): the shortest natural reading of each quote
MARGIN = {'K1': 0.15, 'K3': 0.15, 'K4': 0.25}        # air inside the slot before the first and after the last sound
PAUSE_MAX = 0.2
def pcm(f, af=None):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def frames_db(x, hop):
    m = x.mean(1); n = len(m) // hop
    return 20 * np.log10(np.sqrt((m[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
CL = json.load(open(A + 'clips.json'))
for k, take in TAKES.items():
    x = pcm(Q + take + '.mp3'); W = json.load(open(Q + take + '.json'))
    hop = SR // 100; e = efull = frames_db(x, hop); on = np.where(e > -45)[0]
    a, b = on[0] * hop, (on[-1] + 1) * hop          # first / last sound
    x = x[a:b]; e = e[on[0]:on[-1] + 1]
    # silences inside the take (< -42 dB for >= 80 ms) longer than PAUSE_MAX -> shortened, cut in the middle
    trims, i, sil = [], 0, e < -42
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if (j - i) / 100 > PAUSE_MAX: trims.append(((i + j) / 200 - ((j - i) / 100 - PAUSE_MAX) / 2, (j - i) / 100 - PAUSE_MAX))
            i = j
        else: i += 1
    slot = CL[k]['dur']; room = slot - 2 * MARGIN[k]
    if len(x) / SR <= room: trims = []   # fits as read: keep every pause
    keep = np.ones(len(x), bool)
    for t0, d in trims: keep[int(t0 * SR):int((t0 + d) * SR)] = False
    r = int(.005 * SR)   # 5 ms crossfade-free cut points sit in silence; short fades anyway
    for t0, d in trims:
        s = int(t0 * SR); x[max(0, s - r):s] *= np.linspace(1, 0, min(r, s))[:, None]; x[s + int(d * SR):s + int(d * SR) + r] *= np.linspace(0, 1, r)[:, None]
    x = x[keep]
    def tmap(t):   # take time -> time in the trimmed take (from the first sound)
        t -= a / SR
        return t - sum(d if t >= t0 + d else max(0, t - t0) for t0, d in trims)
    tempo = max(1.0, round(len(x) / SR / room + 5e-4, 3))
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-af', f'atempo={tempo}', '-f', 'f32le', '-'],
                         input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.float32).reshape(-1, 2)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', Q + k + '.wav'], input=y.tobytes(), check=True)
    # word times: Whisper word ends on the take (W['asr'], checked word for word against the transcript; the TTS character
    # timestamps were up to 0.3 s off on the quotes), each start moved past any silence it begins in
    spoken = CL[k]['transcript'].split(); ch = []
    for w, s, t in (W['asr']['chunks'] if 'asr' in W else W['words']):
        if w.startswith('-') and ch: ch[-1][0] += w; ch[-1][2] = t   # "power" "-enhancing"
        else: ch.append([w, s, t])
    assert len(spoken) == len(ch), (k, len(spoken), len(ch))
    for c in ch:
        f = int(c[1] * 100)
        while f < int(c[2] * 100) - 3 and f < len(efull) and efull[f] < -42: f += 1
        c[1] = f / 100
    words = [[sw, round(max(0, tmap(s)) / tempo, 3), round(min(len(x) / SR, tmap(t)) / tempo, 3)] for sw, (_, s, t) in zip(spoken, ch)]
    for p_, w in zip(words, words[1:]): w[1] = max(w[1], p_[2])
    out = {'take': take, 'request_id': W.get('request_id'), 'tempo': tempo, 'trims': [[round(t0, 3), round(d, 3)] for t0, d in trims],
           'dur': round(len(y) / SR, 3), 'slot': round(slot, 3),
           'offset': round(max(0, min((slot - len(y) / SR) / 2, 0.5)), 3), 'words': words}   # centred, at most 0.5 s after the card appears
    json.dump(out, open(Q + k + '.json', 'w'))
    print(k, take, 'tempo', tempo, 'trims', out['trims'], 'quote', out['dur'], 's in a', round(slot, 2), 's slot, offset', out['offset'])
