#!/usr/bin/env python3
"""Film 24 · mix VO + slot audio (pig calls, interview/atmo clips) + music cues (ducked under the voice) + SFX atmos -> mix.wav (-14 LUFS, TP <= -1 dB).
Method as films/19-biocomputer/audio/mix.py, with two changes: music cues and SFX are anchored on takes/slots, not on seconds, so a clip that
changes the slot length (build_vo.py) moves them along:
  music/cues.json  [{"f": "M1", "at": "s09", "dt": -0.4, "fin": 2.0, "fout": 4.0, "off": 0, "d": null, "opts": {"repeat": [t1, t2]}}]   at = take id / slot id, dt in s
                   "end": "s17" (optional) = the cue is cut to end at the end of that take + "end_dt" s (fade-out inside it)
  sound_plan.json  [{"f": "underwater", "at": "s12", "end": "s13", "dt": 0, "v": 0.8, "fade": 1.5, "off": 0}]   loops sfx/<f>.mp3 from `at` to the end of `end`
Slot audio: <clips dir>/<id>.wav (C1..C5 interview/atmo, P1/P2 pig calls) at slot start + offset (clips.json), level = the voice's, music ducked under the slot.
usage: mix.py <audio_dir> [wav_dir]   (vo_master.wav, stems, premix and mix.wav live in wav_dir, a scratchpad)"""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/') + '/'; W = (sys.argv[2].rstrip('/') + '/') if len(sys.argv) > 2 else A; SR = 48000
CLIPDIR = os.environ.get('F24CLIPS', os.environ.get('F24ROOT', '/mnt/project-files/scenario/film-tiersprache').rstrip('/') + '/clips').rstrip('/') + '/'
def load(f, af=None):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
def db(v): return 10 ** (v / 20)
timing = json.load(open(A + 'timing.json')); N = int(timing['duration'] * SR)
SEC, SLOT = timing['sections'], {c['id']: c for c in timing['slots']}
def at(key, end=False):
    if key == 'END': return timing['duration']
    if key in SEC: return SEC[key]['end' if end else 'start']
    if key in SLOT: return SLOT[key]['end' if end else 'start']
    raise KeyError(key)
vo = load(W + 'vo_master.wav')[:N]; vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
VO_BOOST = float(os.environ.get('VO_BOOST', 2))   # voice +2 dB over music/SFX at the same -14 LUFS total (Jakob 31.10.)
vo *= db(-20 + VO_BOOST) / rms(vo[np.abs(vo).max(1) > 1e-3])
env = np.abs(vo).max(1); hop = SR // 100
e = np.array([env[i:i + hop].max() for i in range(0, N, hop)]) > 0.02
act = np.zeros(len(e)); a = 0.0
for i, v in enumerate(e): a = min(1, a + .12) if v else max(0, a - .02); act[i] = a   # ~80 ms attack, ~500 ms release
duck = np.interp(np.arange(N), np.arange(len(act)) * hop, act)
CLIPS = json.load(open(A + 'clips.json')) if os.path.exists(A + 'clips.json') else {}
clipbuf = np.zeros((N, 2), np.float32)
for c in timing['slots']:
    s0, s1 = int(c['start'] * SR), int(c['end'] * SR)
    duck[max(0, s0 - SR // 4):s1 + SR // 4] = np.maximum(duck[max(0, s0 - SR // 4):s1 + SR // 4], 1)   # music ducked under every slot, also while it is still silent
    f = CLIPDIR + (c['file'] if c.get('file') else f"{c['id']}.wav")
    if os.path.exists(f):
        k = CLIPS.get(c['id'], {})
        x = load(f, k.get('af'))
        if k.get('dur'): x = x[:int(k['dur'] * SR)]
        x = x.copy(); fi, fo = int(.01 * SR), int(.06 * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        x *= db(-20 + VO_BOOST + k.get('gain_db', 0)) / rms(x[np.abs(x).max(1) > 1e-3])   # same level as the voice, then gain_db
        o = s0 + int(k.get('offset', 0) * SR); n = min(len(x), s1 - o); clipbuf[o:o + n] += x[:n]
        print(c['id'], 'slot audio', round(len(x) / SR, 2), 's at', round(o / SR, 3))
    else: print(c['id'], 'slot silent (no', f, ')')
def place(buf, x, t, gain=1.0, fin=0.0, fout=0.0, d=None, loop=False):
    s = int(t * SR); n = int(d * SR) if d else len(x)
    if loop and n > len(x): x = np.tile(x, (n // len(x) + 1, 1))
    x = x[:n].copy(); n = len(x)
    if fin: k = min(n, int(fin * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout: k = min(n, int(fout * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    if s < 0: x = x[-s:]; s = 0
    e2 = min(N, s + len(x)); buf[s:e2] += x[:e2 - s] * gain
music = np.zeros((N, 2), np.float32)
MUSIC_DB, DUCK = float(os.environ.get('MUSIC_DB', -26)), 0.5   # cue RMS -26 dB, -6 dB under speech -> music ~12 dB under the voice
def ride(x, strength=0.4, win=3.0, lo=-6, hi=4):
    """slow gain rider: pulls the cue's 3-s loudness toward its mean so a loud passage in a Lyria cue does not jump out"""
    hop = SR // 10; e = np.sqrt(np.convolve((x ** 2).mean(1)[::hop], np.ones(int(win * 10)) / int(win * 10), 'same')) + 1e-6
    g = np.clip(-strength * 20 * np.log10(e / np.sqrt(np.mean(e ** 2))), lo, hi)
    return x * db(np.interp(np.arange(len(x)), np.arange(len(g)) * hop, g))[:, None]
def splice(x, t1, t2, xf=2.0):
    """lengthen a cue by t2-t1: play it to t2, crossfade back to t1 and play on"""
    a, b, k = int(t2 * SR), int(t1 * SR), int(xf * SR)
    ramp = np.linspace(0, 1, k)[:, None]
    return np.concatenate([x[:a - k // 2], x[a - k // 2:a + k - k // 2] * (1 - ramp) + x[b - k // 2:b + k - k // 2] * ramp, x[b + k - k // 2:]])
for cue in json.load(open(A + 'music/cues.json')):
    t = at(cue['at']) + cue.get('dt', 0); o = cue.get('opts', {}); off = cue.get('off', 0)
    d = cue.get('d') or ((at(cue['end'], True) + cue.get('end_dt', 0) - t) if cue.get('end') else None)
    x = load(A + f"music/{cue['f']}.mp3")
    for rp in ([o['repeat']] if o.get('repeat') and not isinstance(o['repeat'][0], list) else o.get('repeat', [])): x = splice(x, *rp, o.get('xf', 2.0))
    x *= db(MUSIC_DB + o.get('gain_db', 0)) / rms(x)
    if o.get('ride', 0.4): x = ride(x, o.get('ride', 0.4))
    place(music, x[int(off * SR):], t, 1, cue.get('fin', 2), cue.get('fout', 4), d)
    print('music', cue['f'], 'from', round(t, 1), 'length', round(d, 1) if d else 'natural', 'file', round(len(x) / SR, 1), 's')
music *= (1 - DUCK * duck)[:, None]          # -6 dB under the voice
sfx = np.zeros((N, 2), np.float32); cache = {}
for c in (json.load(open(A + 'sound_plan.json')) if os.path.exists(A + 'sound_plan.json') else []):
    if c['f'] not in cache: cache[c['f']] = load(A + f"sfx/{c['f']}.mp3")
    x = cache[c['f']]; t = at(c['at']) + c.get('dt', 0); d = (at(c['end'], True) - t) if c.get('end') else c.get('d')
    g = db(float(os.environ.get('SFX_DB', -30))) / rms(x) * c['v']
    place(sfx, x[int(c.get('off', 0) * SR):], t, g, c.get('fade', 1.5), c.get('fade', 1.5), d, True)
    print('sfx', c['f'], 'from', round(t, 1), 'for', round(d, 1) if d else 'natural')
sfx *= (1 - 0.15 * duck)[:, None]
mix = vo + clipbuf + music + sfx
for name, buf in [('stem_music', music), ('stem_sfx', sfx), ('premix', mix)]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', W + name + '.wav'], input=buf.astype(np.float32).tobytes(), check=True)
def measure(f):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(o[o.rfind('{'):o.rfind('}') + 1])
m = measure(W + 'premix.wav'); src = W + 'premix.wav'; print('premix', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
gain = -14 - float(m['input_i'])
if float(m['input_tp']) + gain > -1.5:   # transparent limiter first so linear loudnorm can reach -14 LUFS exactly
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={gain + 0.8:.2f}dB,alimiter=limit={db(-2.0):.4f}:attack=3:release=80:level=false',
                    '-ar', '48000', '-c:a', 'pcm_f32le', W + 'premix_lim.wav'], check=True)
    src = W + 'premix_lim.wav'; m = measure(src); print('limited', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '48000', W + 'mix.wav'], check=True)
if src != W + 'premix.wav': os.remove(src)
fin = measure(W + 'mix.wav'); print('FINAL mix.wav', fin['input_i'], 'LUFS, true peak', fin['input_tp'], 'dBTP, LRA', fin['input_lra'])
# delivery copies: mix.m4a (AAC 192k through a 4x-oversampled limiter at -2 dBFS: about -1.5 dBTP after decoding) and mix_preview.mp3 (192k, for listening)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', W + 'mix.wav', '-af', f'volume=0.3dB,aresample=192000,alimiter=limit={db(-2.0):.4f}:attack=1:release=50:level=false,aresample=48000',
                '-c:a', 'aac', '-b:a', '192k', W + 'mix.m4a'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', W + 'mix.wav', '-af', f'aresample=192000,alimiter=limit={db(-1.5):.4f}:attack=1:release=50:level=false,aresample=44100',
                '-c:a', 'libmp3lame', '-b:a', '192k', W + 'mix_preview.mp3'], check=True)
print('-> mix.wav, mix.m4a, mix_preview.mp3')
