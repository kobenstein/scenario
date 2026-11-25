#!/usr/bin/env python3
"""Film 74 'Your Life in 2050 If We Get AI Right' · mix: vo_master.wav (VO + the clip slots C6 Mawakana · C4 · C1 Hassabis, original footage; fallback set C3 · C4 · C1: run on variants/C3 + its wav dir)
+ music (ElevenLabs music, composition_plan, three tracks M1 0:00 · M2 at section M · M3 at section P; prompts in music/prompts.json)
+ beds (atmos, looped) + accents (Mirelo SFX 2.0 and sfx-bibliothek), all anchored on rows of docs/shots.md (rows.json = film.mjs rowTimes) or on words.
Music and beds duck under the voice (voice envelope of vo_only.wav, attack .12 s, release .6 s): music sits ~19 dB under the voice while it speaks,
~12 dB under it in the gaps, a further 6 dB down under every clip slot. Then loudnorm to -14 LUFS, true peak <= -1 dB.
usage: mix.py <audio_dir (timing.json)> <wav_dir (vo_master.wav, vo_only.wav, rows.json, music/, sfx/)>  -> <wav_dir>/mix.wav, mix.m4a"""
import json, subprocess, sys
import numpy as np
A, D = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
SR = 48000
T = json.load(open(A + 'timing.json')); R = json.load(open(D + 'rows.json')); N = int(T['duration'] * SR)
WORDS = T['words']
def load(f):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def db(v): return 10 ** (v / 20)
def word(ph, after=0.0):   # start of a phrase in the VO
    q = ph.lower().split()
    for i in range(len(WORDS) - len(q) + 1):
        if WORDS[i]['s'] < after: continue
        if all(WORDS[i + j]['w'].lower().strip('.,!?"“”') .startswith(q[j]) for j in range(len(q))): return WORDS[i]['s']
    raise SystemExit('phrase not found: ' + ph)
vo, vonly = load(D + 'vo_master.wav')[:N], load(D + 'vo_only.wav')[:N]
vo = np.pad(vo, ((0, N - len(vo)), (0, 0))); vonly = np.pad(vonly, ((0, N - len(vonly)), (0, 0)))
# voice envelope (speaking 0/1), smoothed
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
out = vo.copy()
# ---------------------------------------------------------------- music: three tracks, each fades in/out at its seams
music = np.zeros((N, 2), np.float32)
for f, t0, fin, fout in [('M1', 0.0, 0.0, 3.0), ('M2', R['M.01'] - .4, 1.5, 3.0), ('M3', R['P.01'] - .4, 1.5, 0.0)]:
    x = load(D + f'music/{f}.mp3'); x *= vrms * db(-12) / lvl(x)
    i0 = int(t0 * SR); x = x[: N - i0]; n = len(x); g = np.ones(n)
    if fin: g[: int(fin * SR)] = np.linspace(0, 1, int(fin * SR))
    if fout: g[-int(fout * SR):] *= np.linspace(1, 0, int(fout * SR))
    music[i0: i0 + n] += x * g[:, None]
music *= db(-7) ** SPEAK * db(-6) ** CLIP      # -7 dB more while the voice speaks, -6 dB more under the clips
end = R['END']; music *= np.clip(1 + (np.arange(N) / SR - end) / 2.0 * db(4) * (np.arange(N) / SR > end), 1, db(4))[:, None]   # the end screen: music rises a little
out += music
# ---------------------------------------------------------------- beds (looped atmos), ducked like the music
def bed(f, t0, t1, rel, fade=1.5):
    x = load(D + f'sfx/{f}.mp3'); x *= vrms * db(rel) / lvl(x); i0, i1 = int(t0 * SR), min(N, int(t1 * SR)); n = i1 - i0
    y = np.tile(x, (n // len(x) + 1, 1))[:n]; g = np.ones(n); k = int(fade * SR); g[:k] = np.linspace(0, 1, k); g[-k:] *= np.linspace(1, 0, k)
    out[i0:i1] += y * g[:, None] * (db(-5) ** SPEAK[i0:i1]) * (db(-6) ** CLIP[i0:i1])
bed('dawn_birds', R['H.13'], R['1.01'], -27)
bed('dawn_birds', R['2.01'], R['3.01'], -30)
bed('city_street', R['3.01'], R['3.05'], -31)
bed('square', R['5.01'], R['5.04'] + 2, -28)
bed('dawn_birds', R['6.01'], R['6.04'], -30)
bed('station', R['8.12'] - .5, R['8.15'], -27)
bed('station', R['8.16'] - .3, R['8.17'], -28)
bed('river', R['9.03'] - .4, R['9.04'] + .5, -24)
bed('square', R['P.03'] - .8, R['P.07'], -25); bed('square', R['P.07'], R['E.05'], -30)
bed('square', R['E.11'], R['E.12'], -30); bed('square', R['E.17'], T['duration'], -26, fade=3)
# ---------------------------------------------------------------- accents
def hit(f, t, rel, d=None, fade=.3):
    x = load(D + f'sfx/{f}.mp3')
    if d: x = x[: int(d * SR)]; k = int(fade * SR); x[-k:] *= np.linspace(1, 0, k)[:, None]
    pk = np.max(np.abs(x)) + 1e-9; x *= vrms * db(rel) * 3 / pk   # peak ~3x the voice rms at rel 0
    i0 = int(t * SR); n = min(len(x), N - i0); out[i0: i0 + n] += x[:n]
hit('alarm', R['H.11'] + .1, -12, d=2.2)                               # it screamed at you every morning (on the paper card)
hit('door', R['H.15'] - .2, -14)
hit('chime', R['5.03'] - .05, -10); hit('shimmer_rings', R['5.04'], -16)   # noon; the whole street chimes
hit('coin', R['5.06'] + 1.0, -18)
for row, nxt in [('8.05', '8.06'), ('8.06', '8.07'), ('8.07', '8.08')]: hit('stamp', min(R[row] + .5, R[nxt] - .25), -10)   # DECADES
hit('ship', R['8.15'] + .2, -14)
hit('splash', R['9.03'] + .6, -18)
hit('wolf', word('wolves', R['9.04']) - .2, -12)
hit('paper_slide', R['P.07'] + .1, -18); hit('card', R['P.08'] - .1, -18)
hit('alarm', R['E.19'] + 1.6, -6)                                       # she winds the old clock, and it starts to ring
hit('alarm', R['E.21'] + .2, -11)
# ---------------------------------------------------------------- loudness: two-pass loudnorm to -14 LUFS, TP -1
pre = D + 'premix.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', pre], input=out.astype(np.float32).tobytes(), check=True)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex('{'):])
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', '48000', '-c:a', 'pcm_s24le', D + 'mix.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', D + 'mix.wav', '-af', 'alimiter=limit=0.84:level=false:attack=1:release=50', '-c:a', 'aac', '-b:a', '256k', D + 'mix.m4a'], check=True)   # AAC overshoots ~0.2 dB: limit at -1.5 dBFS so the m4a stays <= -1 dBTP
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', D + 'mix.wav', '-af', 'loudnorm=I=-14:TP=-1:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex('{'):]); print('mix.wav', T['duration'], 's · integrated', j['input_i'], 'LUFS · true peak', j['input_tp'], 'dBTP · LRA', j['input_lra'])
