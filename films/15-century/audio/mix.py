#!/usr/bin/env python3
"""Mix VO + music cues (ducked under the voice) + SFX plan -> mix.wav (-14 LUFS).
usage: mix.py <audio_dir> [wav_dir]   (wav_dir: holds vo_master.wav, receives mix.wav + stems; default = audio_dir)"""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/') + '/'; SR = 48000
W = (sys.argv[2].rstrip('/') + '/') if len(sys.argv) > 2 else A
def load(f, af=None):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
def db(v): return 10 ** (v / 20)
timing = json.load(open(A + 'timing.json')); N = int(timing['duration'] * SR)
vo = load(W + 'vo_master.wav')[:N]; vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
vo *= db(-20) / rms(vo[np.abs(vo).max(1) > 1e-3])
# voice activity envelope -> ducking
env = np.abs(vo).max(1); hop = SR // 100
e = np.array([env[i:i + hop].max() for i in range(0, N, hop)]) > 0.02
act = np.zeros(len(e)); a = 0.0
for i, v in enumerate(e): a = min(1, a + .12) if v else max(0, a - .02); act[i] = a   # ~80 ms attack, ~500 ms release
duck = np.interp(np.arange(N), np.arange(len(act)) * hop, act)
# interview clips: real clip audio (clips/<K>.wav, written once the YouTube download works) placed into their slots;
# music + SFX duck under the whole slot as under the voice
# per-clip corrections from clips.json: "gain_db" on top of the -20 dB RMS match, "af" an ffmpeg filter (e.g. a light compressor)
CLIPS = json.load(open(A + 'clips.json')) if os.path.exists(A + 'clips.json') else {}
clipbuf = np.zeros((N, 2), np.float32)
for c in timing.get('clips', []):
    s0, s1 = int(c['start'] * SR), int(c['end'] * SR)
    f = A + f"../clips/{c['id']}.wav"
    if os.path.exists(f):   # quote cards (no clip audio) keep the music up
        duck[max(0, s0 - SR // 4):s1 + SR // 4] = np.maximum(duck[max(0, s0 - SR // 4):s1 + SR // 4], 1)
        k = CLIPS.get(c['id'], {}) if isinstance(CLIPS, dict) else {}
        x = load(f, k.get('af')); x *= db(-20 + k.get('gain_db', 0)) / rms(x[np.abs(x).max(1) > 1e-3])
        n = min(len(x), s1 - s0); clipbuf[s0:s0 + n] += x[:n]
def place(buf, x, t, gain=1.0, fin=0.0, fout=0.0, d=None, loop=False):
    s = int(t * SR); n = int(d * SR) if d else len(x)
    if loop and n > len(x): x = np.tile(x, (n // len(x) + 1, 1))
    x = x[:n].copy(); n = len(x)
    if fin: k = min(n, int(fin * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout: k = min(n, int(fout * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    if s < 0: x = x[-s:]; s = 0
    e2 = min(N, s + len(x)); buf[s:e2] += x[:e2 - s] * gain
music = np.zeros((N, 2), np.float32)
CUES = json.load(open(A + 'music/cues.json')) if os.path.exists(A + 'music/cues.json') else [('cueA', 0, 0.5, 4), ('cueB', 161, 4, 4), ('cueC', 335, 4, 6)]
for cue in CUES:   # [file, start, fade_in, fade_out, source_offset, duration, gain_db]: one cue per chapter, crossfaded
    f, t, fin, fout = cue[:4]; off = cue[4] if len(cue) > 4 else 0; d = cue[5] if len(cue) > 5 else None
    gdb = cue[6] if len(cue) > 6 else 0; x = load(A + f'music/{f}.mp3'); x *= db(-25 + gdb) / rms(x); place(music, x[int(off * SR):], t, 1, fin, fout, d)
music *= (1 - 0.5 * duck)[:, None]          # -6 dB under the voice
sfx = np.zeros((N, 2), np.float32); cache = {}
for c in json.load(open(A + 'sound_plan.json')):
    if c['f'] not in cache: cache[c['f']] = load(A + f"sfx/{c['f']}.mp3")
    x = cache[c['f']]
    if c.get('loop'): g = db(-30) / rms(x) * c['v']; place(sfx, x, c['t'], g, c.get('fade', .8), c.get('fade', .8), c.get('d'), True)
    else:   # accents that land on speech get +5 dB so they are not masked
        g = db(-14) / (np.abs(x).max() + 1e-9) * c['v'] * (db(5) if duck[min(N - 1, int(c['t'] * SR))] > .5 else 1); place(sfx, x, c['t'], g, .02, .3 if not c.get('d') else c.get('fade', .3), c.get('d'))
sfx *= (1 - 0.15 * duck)[:, None]
BED_DB = -2   # voice +2 dB over music + SFX (Jakob 31.10., same as Bubble/Keys/Free Time)
mix = vo + clipbuf + (music + sfx) * db(BED_DB)
for name, buf in [('stem_music', music), ('stem_sfx', sfx), ('premix', mix)]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', W + name + '.wav'], input=buf.astype(np.float32).tobytes(), check=True)
# two-pass loudnorm to -14 LUFS, TP target -1.2 dBTP (lands <= -1 dBTP with margin)
o = subprocess.run(['ffmpeg', '-hide_banner', '-i', W + 'premix.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(o[o.rfind('{'):o.rfind('}') + 1])
af = f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', W + 'premix.wav', '-af', af, '-ar', '48000', W + 'mix.wav'], check=True)
print('premix', m['input_i'], 'LUFS -> mix.wav')
