#!/usr/bin/env python3
"""Film 79 'Your Life in 2050: The AI Worst Case' · mix (from Film 74's mix.py, anchored on phrases of timing.json instead of shot rows).
vo_master.wav (VO + the four clip slots C2 · C1 · C3 · C4, original footage) + music (Lyria 3.5, music/cues.json: M0..M6, each leveled flat, cross-faded at the seams)
+ beds and accents of sound_plan.json (sfx-bibliothek + Mirelo SFX 2.0). The VO is always on top: music and beds duck under the voice (voice envelope of vo_only.wav,
attack .12 s, release .6 s): music sits ~19 dB under the voice while it speaks, ~12 dB under it in the gaps, a further 8 dB down under every clip slot.
End: M6 fades out over the 15 s end screen. Then gain + fast limiter to -14.0 LUFS integrated, true peak <= -1 dBTP; the AAC is limited so that it stays <= -1 dBTP after decoding too.
usage: mix.py <audio_dir (timing.json, sound_plan.json, music/cues.json)> <wav_dir (vo_master.wav, vo_only.wav, music/M*.mp3, sfx/)>  -> <wav_dir>/mix.wav, mix.m4a"""
import json, re, subprocess, sys
import numpy as np
A, D = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
SR = 48000
T = json.load(open(A + 'timing.json')); N = int(T['duration'] * SR)
PLAN = json.load(open(A + 'sound_plan.json')); CUES = json.load(open(A + 'music/cues.json'))
WORDS = T['words']; END_SCREEN = T['end_screen']['start']
tok = lambda w: re.sub(r"[.,!?\":;]", '', w.lower())
def find(ph, after=0.0):
    """(start, end) of the first occurrence of the phrase at or after `after` seconds (words start-with match, like tools/shots79.py)"""
    q = [tok(x) for x in ph.split()]
    for i in range(len(WORDS) - len(q) + 1):
        if WORDS[i]['s'] < after: continue
        if all(tok(WORDS[i + j]['w']).startswith(q[j]) for j in range(len(q))): return WORDS[i]['s'], WORDS[i + len(q) - 1]['e']
    raise SystemExit('phrase not found: ' + ph)
def load(f):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
db = lambda v: 10 ** (v / 20)
vo, vonly = load(D + 'vo_master.wav')[:N], load(D + 'vo_only.wav')[:N]
vo = np.pad(vo, ((0, N - len(vo)), (0, 0))); vonly = np.pad(vonly, ((0, N - len(vonly)), (0, 0)))
hop = SR // 100; e = np.sqrt(np.mean(vonly[: len(vonly) // hop * hop].reshape(-1, hop, 2) ** 2, axis=(1, 2)))
speak = (20 * np.log10(e + 1e-9) > -38).astype(float)
for s in T['slots']: speak[int(s['start'] * 100): int(s['end'] * 100)] = 1   # the clips are speech too
sm = np.zeros_like(speak); a_up, a_dn = 1 - np.exp(-1 / 12), 1 - np.exp(-1 / 60); v = 0.0
for i, x in enumerate(speak): v += (x - v) * (a_up if x > v else a_dn); sm[i] = v
clip = np.zeros_like(speak)
for s in T['slots']: clip[int((s['start'] - .3) * 100): int((s['end'] + .3) * 100)] = 1
clip = np.convolve(clip, np.ones(40) / 40, 'same')
env = lambda x: np.interp(np.arange(N) / SR, np.arange(len(x)) / 100, x)[:, None]
SPEAK, CLIP = env(sm), env(clip)
mk = np.repeat(speak, hop) > 0; vrms = float(np.sqrt(np.mean(vonly[:len(mk)][mk] ** 2)))   # the voice's level while it speaks
def lvl(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
DUCK = lambda sl: (db(-7) ** SPEAK[sl]) * (db(-8) ** CLIP[sl])
# ---------------------------------------------------------------- mutes (music + beds only): the kitchen goes dark
MUTE = np.ones((N, 1))
for m in PLAN.get('mutes', []):
    t0 = find(m['word'], m.get('after', 0))[0] + m.get('dt', 0); i0 = int(t0 * SR); i1 = int((t0 + m['hold']) * SR); k = int(m['fade_in'] * SR)
    MUTE[i0:i1] = 0; MUTE[i1:i1 + k, 0] = np.minimum(MUTE[i1:i1 + k, 0], np.linspace(0, 1, k)[: len(MUTE[i1:i1 + k])] ** 2)
    k0 = int(.08 * SR); MUTE[i0 - k0:i0, 0] = np.minimum(MUTE[i0 - k0:i0, 0], np.linspace(1, 0, k0))
def flat(x, target_db=-12, win=2.5, lo=-10, hi=10):
    """level a music track: slow gain riding toward one level (the tracks swell and fall by up to 30 dB inside), then peak guard"""
    p = np.mean(x ** 2, axis=1); h = SR // 50; q = np.add.reduceat(p, np.arange(0, len(p), h)) / h
    k = max(1, int(win * 50)); r = np.sqrt(np.convolve(q, np.ones(k) / k, 'same') + 1e-12)
    tgt = np.median(r[r > 10 ** (-60 / 20)]) if np.any(r > 10 ** (-60 / 20)) else 1.0
    g = np.clip(tgt / r, db(lo), db(hi)); g = np.convolve(g, np.ones(k) / k, 'same')
    g = np.interp(np.arange(len(x)) / SR, np.arange(len(g)) * h / SR, g)[:, None]
    y = x * g; y *= vrms * db(target_db) / lvl(y)
    return y
# ---------------------------------------------------------------- music: seven tracks, cross-faded at the seams
starts = []
for c in CUES:
    t0 = c['from'] if 'from' in c else find(c['from_word'])[0] + c.get('dt', 0)
    starts.append(max(0.0, t0))
music = np.zeros((N, 2), np.float32)
for i, c in enumerate(CUES):
    x = flat(load(D + f"music/{c['f']}.mp3")); t0 = starts[i]; i0 = int(t0 * SR)
    nxt = starts[i + 1] if i + 1 < len(CUES) else None
    n = min(len(x), N - i0)
    if c.get('use'): n = min(n, int(c['use'] * SR))
    if nxt is not None: n = min(n, int((nxt + CUES[i + 1]['fin'] - t0) * SR))   # play on until the next track has faded in
    x = x[:n]; g = np.ones(n)
    fin = c.get('fin', 0)
    if fin: g[: int(fin * SR)] = np.sin(np.linspace(0, np.pi / 2, int(fin * SR))) ** 2
    if nxt is not None:   # fade out over the next track's fade-in
        k = min(n, int(CUES[i + 1]['fin'] * SR)); g[-k:] *= np.cos(np.linspace(0, np.pi / 2, k)) ** 2
    if c.get('fade_end'):   # the end: music out over the end screen
        a = (T['duration'] - c['fade_end']['start_before_end']) * SR; b = (T['duration'] - c['fade_end']['to_before_end']) * SR
        t = np.clip((np.arange(n) + i0 - a) / (b - a), 0, 1); g *= np.cos(t * np.pi / 2) ** 2
    if n < len(x) + 0: pass
    music[i0: i0 + n] += (x * g[:, None]).astype(np.float32)
    print('music', c['f'], 'from', round(t0, 2), 'to', round(t0 + n / SR, 2), 's', 'leveled rms', round(20 * np.log10(lvl(x)), 1), 'dB')
out = vo.copy()
out += music * DUCK(slice(0, N)) * MUTE
# ---------------------------------------------------------------- beds (looped), ducked like the music
def at(word, after=0.0, which='s', dt=0.0):
    s, e_ = find(word, after); return (s if which == 's' else e_) + dt
for b in PLAN['beds']:
    x = load(D + PLAN['files'][b['f']]); x *= vrms * db(b['rel']) / lvl(x)
    t0 = at(b['from'], b.get('after', 0), 's', b.get('dt', 0)); t1 = at(b['to'], t0 - 0.01, b.get('to_at', 'end'), b.get('to_dt', 0)); i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); n = i1 - i0
    if n <= 0: raise SystemExit('bed range empty ' + b['what'])
    y = np.tile(x, (n // len(x) + 1, 1))[:n]; g = np.ones(n); k = int(b.get('fade', 1.5) * SR); g[:k] = np.linspace(0, 1, k); g[-k:] *= np.linspace(1, 0, k)
    out[i0:i1] += y * g[:, None] * DUCK(slice(i0, i1)) * MUTE[i0:i1]
    print('bed', b['f'], round(t0, 2), '-', round(t1, 2), b['what'])
# ---------------------------------------------------------------- accents (peak matched; the voice stays on top)
for h in PLAN['hits']:
    x = load(D + PLAN['files'][h['f']])
    if h.get('d'): x = x[: int(h['d'] * SR)]
    k = min(len(x), int(h.get('fade', .3) * SR)); x[-k:] *= np.linspace(1, 0, k)[:, None]
    pk = np.max(np.abs(x)) + 1e-9; x = x * (vrms * db(h['rel']) * 3 / pk)
    t = at(h['word'], h.get('after', 0), h.get('at', 's')[0] if h.get('at') else 's', h.get('dt', 0)); i0 = int(t * SR); n = min(len(x), N - i0)
    out[i0: i0 + n] += x[:n]
    print('hit', h['f'], round(t, 2), h['what'])
# ---------------------------------------------------------------- loudness: -14 LUFS integrated, true peak <= -1 dBTP
pre = D + 'premix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', pre], input=out.astype(np.float32).tobytes(), check=True)
def meas(f):
    m = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr; s = m[m.rindex('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1)), float(re.search(r'LRA:\s+([\d.]+) LU', s).group(1))
# the voice's peaks sit ~9 dB above its loudness: take them down with a fast limiter at -1.5 dBFS (sample peak) and put the gain in front of it, so the integrated level reaches -14.0 LUFS
# with a true peak <= -1 dBTP (loudnorm alone would give up 0.4 LU to stay under the peak). Gain refined by measuring (the limiter takes a little loudness).
g = -14.0 - meas(pre)[0]
for it in range(3):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', f'volume={g}dB,alimiter=limit=0.84:level=false:attack=2:release=60', '-ar', '48000', '-c:a', 'pcm_s24le', D + 'mix.wav'], check=True)
    I, TP, LRA = meas(D + 'mix.wav'); print('pass', it, 'gain', round(g, 2), 'dB ->', I, 'LUFS', TP, 'dBTP')
    if abs(I + 14.0) < 0.05 and TP <= -1.0: break
    g += (-14.0 - I)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', D + 'mix.wav', '-af', 'alimiter=limit=0.84:level=false:attack=1:release=50', '-c:a', 'aac', '-b:a', '256k', D + 'mix.m4a'], check=True)   # AAC overshoots ~0.2 dB: limit at -1.5 dBFS so the m4a stays <= -1 dBTP
for f in ('mix.wav', 'mix.m4a'):
    m = subprocess.run(['ffmpeg', '-hide_banner', '-i', D + f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = m[m.rindex('Summary:'):]
    print(f, T['duration'], 's · integrated', re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1), 'LUFS · true peak', re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1), 'dBTP · LRA', re.search(r'LRA:\s+([\d.]+) LU', s).group(1))
