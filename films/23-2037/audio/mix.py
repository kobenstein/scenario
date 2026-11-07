#!/usr/bin/env python3
"""Mix VO + music cues (ducked under the voice) + SFX plan -> mix.wav (-14 LUFS).
SFX: drop sfx/<name>.mp3 files next to music/ and list them in sound_plan.json ([{"f", "t", "v", "loop"?, "d"?, "fade"?}]); Film 16 has none yet.
usage: mix.py <audio_dir> [wav_dir]   (Film 14: vo_master.wav, stems, premix and mix.wav live in wav_dir, a scratchpad;
the project folder only gets a copy of the final mix, see README in audio/music)
Film 23: music ducks 10 dB under every clip slot (K1/K3/K4) whether or not clips/<K>.wav exists yet, so the real clip drops in
without a new music edit; VO_LIFT raises a few very soft [softly] words (chapter clock lines) so they read over the music."""
import json, os, subprocess, sys
import numpy as np
A = sys.argv[1].rstrip('/') + '/'; W = (sys.argv[2].rstrip('/') + '/') if len(sys.argv) > 2 else A; SR = 48000
def load(f, af=None):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
def db(v): return 10 ** (v / 20)
timing = json.load(open(A + 'timing.json')); N = int(timing['duration'] * SR)
# Film 23: the Eleven v4 takes have a high crest factor (the soft [softly] dinner takes most of all); without a VO compressor the
# -14 LUFS limiter shaved up to 8-12 dB off ~17 % of all 10-ms blocks. 4:1 above -24 dBFS (3 ms attack) leaves ~200 blocks over 3 dB.
VO_AF = os.environ.get('VO_AF', 'acompressor=threshold=0.063:ratio=4:attack=3:release=100:knee=4')
vo = load(W + 'vo_master.wav', VO_AF or None)[:N]; vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
VO_BOOST = float(os.environ.get('VO_BOOST', 2))   # Jakob 31.10.: voice +2 dB over music/SFX, same -14 LUFS total (Film 23: default 2)
vo *= db(-20 + VO_BOOST) / rms(vo[np.abs(vo).max(1) > 1e-3])
# Film 23: lift very soft words: (segment, first word, last word (inclusive, index in the segment), dB), 60 ms ramps
VO_LIFT = [('s19', 0, 1, 6), ('s30', 0, 0, 5), ('s14', 0, 9, 2.5), ('s29', 0, 7, 2.5)]
for sid, a, b, g in VO_LIFT:
    ws = [w for w in timing['words'] if w['sec'] == sid]
    if not ws: continue
    s0, s1, r = int((ws[a]['s'] - .05) * SR), int((ws[b]['e'] + .08) * SR), int(.06 * SR)
    env = np.ones(s1 - s0 + 2 * r) * (db(g) - 1); env[:r] *= np.linspace(0, 1, r); env[-r:] *= np.linspace(1, 0, r)
    vo[s0 - r:s1 + r] *= (1 + env)[:, None]
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
# Film 23 quote mode (QUOTE=1): instead of clip audio, the narrator reads each quote into its slot (timing.json clips[i].quote),
# QUOTE_DB below the VO level, music ducked 10 dB as under a clip; writes premix-quote / mix-quote.wav / mix-quote.m4a next to the gap mix
QUOTE = os.environ.get('QUOTE') == '1'; SUF = '-quote' if QUOTE else ''
QUOTE_DB = float(os.environ.get('QUOTE_DB', -2))
QUOTE_AF = os.environ.get('QUOTE_AF', 'dynaudnorm=f=100:g=5:m=2:p=0.7,' + VO_AF)
clipbuf = np.zeros((N, 2), np.float32)
CLIP_DUCK = -10   # Film 23: music 10 dB down under a clip slot (instead of the -6 dB voice duck), 0.3 s ramps
cenv = np.zeros(N, np.float32)
for c in timing.get('clips', []):
    s0, s1 = int(c['start'] * SR), int(c['end'] * SR)
    if c.get('kind', 'clip') == 'clip':
        r = int(.3 * SR); a0, a1 = max(0, s0 - r), min(N, s1 + r)
        e = np.ones(a1 - a0, np.float32); e[:s0 - a0] = np.linspace(0, 1, s0 - a0); e[len(e) - (a1 - s1):] = np.linspace(1, 0, a1 - s1)
        cenv[a0:a1] = np.maximum(cenv[a0:a1], e)
    f = A + f"../clips/{c['id']}.wav"
    if os.path.exists(f) and not QUOTE:   # quote cards (no clip audio) keep the music up; quote mode never uses clip audio
        k = CLIPS.get(c['id'], {}) if isinstance(CLIPS, dict) else {}
        x = load(f, k.get('af')); x *= db(-20 + k.get('gain_db', 0)) / rms(x[np.abs(x).max(1) > 1e-3])
        n = min(len(x), s1 - s0); clipbuf[s0:s0 + n] += x[:n]
    if QUOTE and c.get('quote'):   # Film 23 quote mode: the narrator's reading of the quote (audio/quotes.py), same chain as the VO
        q = c['quote']; x = load(A + q['file'], QUOTE_AF)   # + a gentle leveler so the voice's soft phrase endings stay audible
        x *= db(-20 + VO_BOOST + QUOTE_DB) / rms(x[np.abs(x).max(1) > 1e-3])
        q0 = int(q['start'] * SR); n = min(len(x), N - q0); clipbuf[q0:q0 + n] += x[:n]
def place(buf, x, t, gain=1.0, fin=0.0, fout=0.0, d=None, loop=False):
    s = int(t * SR); n = int(d * SR) if d else len(x)
    if loop and n > len(x): x = np.tile(x, (n // len(x) + 1, 1))
    x = x[:n].copy(); n = len(x)
    if fin: k = min(n, int(fin * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout: k = min(n, int(fout * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    if s < 0: x = x[-s:]; s = 0
    e2 = min(N, s + len(x)); buf[s:e2] += x[:e2 - s] * gain
music = np.zeros((N, 2), np.float32)
MUSIC_DB, DUCK = -26, 0.5   # Film 16: cue RMS -26 dB, -6 dB under speech -> music ~10 dB under the voice (VO at -20 dB RMS, measured on the stems)
def ride(x, strength=0.4, win=3.0, lo=-6, hi=4):
    """slow gain rider: pulls the cue's 3-s loudness toward its mean by `strength` (0.4 = 40 % less level swing), so a loud
    passage inside a Lyria cue does not jump out; boost limited to +4 dB so natural tails stay quiet"""
    hop = SR // 10; e = np.sqrt(np.convolve((x ** 2).mean(1)[::hop], np.ones(int(win * 10)) / int(win * 10), 'same')) + 1e-6
    g = np.clip(-strength * 20 * np.log10(e / np.sqrt(np.mean(e ** 2))), lo, hi)
    return x * db(np.interp(np.arange(len(x)), np.arange(len(g)) * hop, g))[:, None]
def splice(x, t1, t2, xf=2.0):
    """lengthen a cue by t2-t1: play it to t2, crossfade back to t1 and play on (Film 16 M4, so its natural ending lands on the film end)"""
    a, b, k = int(t2 * SR), int(t1 * SR), int(xf * SR)
    ramp = np.linspace(0, 1, k)[:, None]
    return np.concatenate([x[:a - k // 2], x[a - k // 2:a + k - k // 2] * (1 - ramp) + x[b - k // 2:b + k - k // 2] * ramp, x[b + k - k // 2:]])
CUES = json.load(open(A + 'music/cues.json')) if os.path.exists(A + 'music/cues.json') else [('cueA', 0, 0.5, 4), ('cueB', 161, 4, 4), ('cueC', 335, 4, 6)]
for cue in CUES:   # [file, start, fade_in, fade_out, source_offset, duration, {opts}]: one cue per chapter, crossfaded
    f, t, fin, fout = cue[:4]; off = cue[4] if len(cue) > 4 else 0; d = cue[5] if len(cue) > 5 else None; o = cue[6] if len(cue) > 6 else {}
    x = load(A + f'music/{f}.mp3')
    if o.get('repeat'): x = splice(x, *o['repeat'], o.get('xf', 2.0))
    x *= db(MUSIC_DB) / rms(x)
    if o.get('ride', 0.4): x = ride(x, o.get('ride', 0.4))
    place(music, x[int(off * SR):], t, 1, fin, fout, d)
music *= (1 - DUCK * duck)[:, None]          # -6 dB under the voice
music *= (1 - (1 - db(CLIP_DUCK)) * cenv)[:, None]   # -10 dB under the clip slots
sfx = np.zeros((N, 2), np.float32); cache = {}
for c in (json.load(open(A + 'sound_plan.json')) if os.path.exists(A + 'sound_plan.json') else []):   # Film 14/16: no SFX yet
    if c['f'] not in cache: cache[c['f']] = load(A + f"sfx/{c['f']}.mp3")
    x = cache[c['f']]
    if c.get('loop'): g = db(-30) / rms(x) * c['v']; place(sfx, x, c['t'], g, c.get('fade', .8), c.get('fade', .8), c.get('d'), True)
    else:   # accents that land on speech get +5 dB so they are not masked
        g = db(-14) / (np.abs(x).max() + 1e-9) * c['v'] * (db(5) if duck[min(N - 1, int(c['t'] * SR))] > .5 else 1); place(sfx, x, c['t'], g, .02, .3 if not c.get('d') else c.get('fade', .3), c.get('d'))
sfx *= (1 - 0.15 * duck)[:, None]
mix = vo + clipbuf + music + sfx
for name, buf in [('stem_music', music), ('stem_sfx', sfx), ('premix', mix)]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', W + name + SUF + '.wav'], input=buf.astype(np.float32).tobytes(), check=True)
# two-pass loudnorm to -14 LUFS / -1 dBTP; Film 16: if the gain would push true peaks over -1.5 dBTP, a transparent limiter
# (alimiter, -2 dBFS ceiling, +0.8 dB extra drive for the level it shaves off) runs first so linear loudnorm can reach -14 LUFS exactly instead of stopping short
def measure(f):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(o[o.rfind('{'):o.rfind('}') + 1])
m = measure(W + f'premix{SUF}.wav'); src = W + f'premix{SUF}.wav'; print('premix', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
gain = -14 - float(m['input_i'])
if float(m['input_tp']) + gain > -1.5:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={gain + 0.8:.2f}dB,alimiter=limit={db(-2.0):.4f}:attack=3:release=80:level=false',
                    '-ar', '48000', '-c:a', 'pcm_f32le', W + f'premix_lim{SUF}.wav'], check=True)
    src = W + f'premix_lim{SUF}.wav'; m = measure(src); print('limited', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
af = f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '48000', W + f'mix{SUF}.wav'], check=True)
if src != W + f'premix{SUF}.wav': os.remove(src)
# Film 18: delivery copy mix.m4a (AAC 192k). AAC overshoots true peak by ~0.9 dB (mix.wav -1.5 -> -0.6 dBTP), so the encode runs
# through a 4x-oversampled limiter at -2 dBFS with +0.3 dB make-up: -14.0 LUFS / about -1.5 dBTP after decoding
# Film 23: encode, measure the decoded m4a, correct gain (-14.0 +-0.05 LUFS) and ceiling (<= -1.5 dBTP), up to 5 passes
vol, ceil = 0.0, -2.0
for _ in range(5):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', W + f'mix{SUF}.wav', '-af', f'volume={vol:.2f}dB,aresample=192000,alimiter=limit={db(ceil):.4f}:attack=1:release=50:level=false,aresample=48000',
                    '-c:a', 'aac', '-b:a', '192k', W + f'mix{SUF}.m4a'], check=True)
    m = measure(W + f'mix{SUF}.m4a'); I, TP = float(m['input_i']), float(m['input_tp'])
    print(f'mix{SUF}.m4a', I, 'LUFS', TP, 'dBTP (volume', round(vol, 2), 'ceiling', round(ceil, 2), ')')
    if abs(I + 14) <= .05 and TP <= -1.5: break
    vol += -14 - I
    if TP > -1.5: ceil -= .3
print(f'-> mix{SUF}.wav, mix{SUF}.m4a')
