#!/usr/bin/env python3
"""Film 54 "AI Just Gave Disease a 10-Year Deadline" · fassung-2 (16.11.2026): no QR overlay (Jakob's new rule) and Dario's REAL clip from the Anthropic IPO
roadshow video instead of the two quote cards the narrator read (C1, C1b). The chunk renders c01..c13 of fassung-1 stay as they are; the film gets 158 frames
(5.267 s) longer, everything after a window moves by whole frames.

  python3 tools/f54_v2.py audio        new mix: the VO is cut out at both card windows and the clip sound goes in (levelled to the voice); music / SFX are
                                       un-ducked (mix.py's duck curve divided out), continued under the clip, crossfaded back to the shifted stream, re-ducked
                                       with the clips as slots (music 12 dB under them), then mix.py's -14 LUFS / TP <= -1 chain -> <V2>/mix.wav
  python3 tools/f54_v2.py subs         subtitles: the card cues -> the clip's words, later cues shifted -> <ROOT>audio/untertitel/subtitles-fassung-2.ass/.srt
  python3 tools/f54_v2.py plates       the two plate pieces (crossfade from the film, the roadshow footage on the clip plate with the credits, crossfade back)
  python3 tools/f54_v2.py master [--crf 18] [--out F]   chunks + plates, subtitles burned in, mix (AAC 320k) -> FINAL/fassung-2-master-1080p.mp4, verify, contact sheet
  python3 tools/f54_v2.py all

Sources: <SP>/rs/rs-a.mp4 = roadshow 40:00-41:00, rs-b.mp4 = 41:00-42:00 (YouTube reupload sI9wd-XcugQ, 1080p 23.976 fps). Cuts (file seconds, level + shot checked):
  C1   rs-a 37.74-51.08  "Today, we look at things like cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, you know,
                          I think, less than a decade."  The roadshow's own zoom transition runs to 38.04: the picture holds the first clean frame (38.08) until then.
  C1b  rs-b 5.004-9.95   "I think if we do this right, we can create an age of miracles."  5.004 = the shot cut (wide), so no flash of the close shot before it.
Big intermediates (wav, plate pieces) go to $F54V2 (default /dev/shm/f54v2: the scratchpad disk is nearly full). No video or audio into the repo / drive.
"""
import argparse, json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); sys.path.insert(0, HERE)
import f54_clips as K

SR, FPS = 48000, 30
SP = K.SCRATCH
V2 = os.environ.get('F54V2') or '/dev/shm/f54v2'
AUD = SP + '/audio'                     # vo_master.wav, stem_music.wav, stem_sfx.wav, premix.wav of fassung-1 (mix.py output)
UT = K.ROOT + 'audio/untertitel/'
PLATE = V2 + '/plate'                   # tools/f54_v2_plate.mjs layers
BG_FRAME = ('c02.mp4', 26.15)           # the hall around a full clip plate (C3, before its credits rise): only the margins show
# A/B = the cut in the OLD timeline (both in VO pauses), sh = frames the film grows here, pre = silence before the clip sound,
# x0/x1 = the plate piece in NEW frames (crossfade in from the film at x0, back to the film ending at x1), vin = first picture frame used (file s)
WIN = [dict(id='C1', A=48.40, B=57.55, sh=141, src=SP + '/rs/rs-a.mp4', cin=37.74, cout=51.08, pre=0.26, vin=38.08, x0=1437, x1=1902),
       dict(id='C1b', A=515.8667, B=520.45, sh=17, src=SP + '/rs/rs-b.mp4', cin=5.004, cout=9.95, pre=0.0, vin=5.004, x0=15582, x1=15792)]
XF = 12                                  # picture crossfade, frames (0.4 s)
LABEL_SRC = 'Anthropic IPO roadshow video, Nov 10, 2026'

def setup():
    K.setup(None); os.makedirs(V2, exist_ok=True)
    s = 0
    for w in WIN:
        w['s0'] = s; s += w['sh']; w['s1'] = s                      # frames of shift before / after the window
        w['An'] = w['A'] + w['s0'] / FPS                            # new time of the cut
        w['L'] = (w['B'] - w['A']) + w['sh'] / FPS                  # new length of the replaced stretch
        w['t0'] = w['An'] + w['pre']; w['t1'] = w['t0'] + (w['cout'] - w['cin'])   # clip sound, new time
        w['post'] = w['L'] - w['pre'] - (w['cout'] - w['cin'])
        assert w['post'] > .1, w
    return s

def new_t(t):
    """old film time -> new film time (for anything outside the replaced stretches)"""
    for w in reversed(WIN):
        if t >= w['B'] - 1e-6: return t + w['s1'] / FPS
    return t

def ff_load(f, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + ['-i', f] + (['-t', str(t)] if t else []) + ['-vn', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.check_output(cmd), np.float32).reshape(-1, 2).copy()
def ff_save(f, x): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_f32le', f], input=x.astype(np.float32).tobytes(), check=True)
def db(v): return 10 ** (v / 20)
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
def speech_rms(x):
    """RMS of the speech only: 10-ms frames within 20 dB of the loud (95th pct) frames, the same gate for the voice and the clip"""
    h = SR // 100; e = np.sqrt((x[:len(x) // h * h] ** 2).mean(1).reshape(-1, h).mean(1)) + 1e-9
    return float(np.sqrt(np.mean(e[e > np.percentile(e, 95) * .1] ** 2)))

# ------------------------------------------------------------------------------------------------------------------ audio
def duck_curves(vo, slots, N):
    """mix.py's duck (voice activity, 80 ms attack / 500 ms release, 1 under every slot +-0.25 s) and the smoothed slot mask (+-1/3 s)"""
    env = np.abs(vo).max(1); hop = SR // 100
    n = (N + hop - 1) // hop; e = np.zeros(n, bool)
    em = np.pad(env, (0, n * hop - len(env))).reshape(n, hop).max(1) > 0.02; e[:] = em
    act = np.zeros(n); a = 0.0
    for i, v in enumerate(e): a = min(1, a + .12) if v else max(0, a - .02); act[i] = a
    duck = np.interp(np.arange(N), np.arange(n) * hop, act); mask = np.zeros(N)
    for s0, s1 in slots:
        s0, s1 = int(s0 * SR), int(s1 * SR)
        duck[max(0, s0 - SR // 4):s1 + SR // 4] = np.maximum(duck[max(0, s0 - SR // 4):s1 + SR // 4], 1)
        mask[max(0, s0 - SR // 3):s1 + SR // 3] = 1
    smooth = np.convolve(mask, np.ones(SR // 5) / (SR // 5), 'same')
    return duck, smooth
def gains(duck, smooth): return (1 - .5 * duck) * (1 - .5 * smooth), (1 - .15 * duck) * (1 - .5 * smooth)   # music, sfx (mix.py)

def cmd_audio(a):
    S = setup(); T = K.jload(K.timing_file(False)); N0 = int(T['duration'] * SR); N1 = N0 + S * SR // FPS
    vo = ff_load(AUD + '/vo_master.wav')[:N0]; vo = np.pad(vo, ((0, N0 - len(vo)), (0, 0)))
    vo *= db(-20 + float(os.environ.get('VO_BOOST', 2))) / rms(vo[np.abs(vo).max(1) > 1e-3])
    mus, sfx, pre = [ff_load(AUD + f'/{n}.wav')[:N0] for n in ('stem_music', 'stem_sfx', 'premix')]
    dia = pre - mus - sfx                                            # voice + the clips C3 / C5 / C2 as mixed
    print('old dialog vs VO residual outside the slots (should be ~0):', round(float(np.abs((dia - vo)[:int(90 * SR)]).max()), 4))
    oslots = [(c['start'], c['end']) for c in T['slots']]
    gm0, gs0 = gains(*duck_curves(vo, oslots, N0))
    rawm, raws = mus / gm0[:, None], sfx / gs0[:, None]
    # the new timeline: hard cuts (5 ms fades) inside the VO pauses, the clip sound in between
    def cut_splice(x, fill=None):
        y = np.zeros((N1, 2), np.float32); f5 = int(.005 * SR); prev_old, prev_new = 0, 0
        bounds = [(int(w['A'] * SR), int(w['B'] * SR), w) for w in WIN]
        pieces = [(0, bounds[0][0], 0)] + [(bounds[k][1], bounds[k + 1][0] if k + 1 < len(bounds) else N0, WIN[k]['s1'] * SR // FPS) for k in range(len(bounds))]
        for o0, o1, sh in pieces:
            p = x[o0:o1].copy(); p[:f5] *= np.linspace(0, 1, f5)[:, None]; p[-f5:] *= np.linspace(1, 0, f5)[:, None]
            y[o0 + sh:o0 + sh + len(p)] += p[:max(0, min(len(p), N1 - o0 - sh))]
        return y
    dia1, vo1 = cut_splice(dia), cut_splice(vo)
    vref = speech_rms(vo[int(30 * SR):int(90 * SR)])
    for w in WIN:
        x = ff_load(w['src'], w['cin'], w['cout'] - w['cin'] + .05)[:int((w['cout'] - w['cin']) * SR)]
        fi, fo = int(.01 * SR), int(.06 * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        g = vref / speech_rms(x); x *= g; o = int(w['t0'] * SR); dia1[o:o + len(x)] += x
        print(f"{w['id']}: clip sound {w['cout'] - w['cin']:.3f} s at new {w['t0']:.3f}-{w['t1']:.3f} s, gain {20 * np.log10(g):+.1f} dB (speech RMS = the voice's), "
              f"cut old {w['A']}-{w['B']} -> new {w['An']:.3f}-{w['An'] + w['L']:.3f} (+{w['sh']} frames)")
    # music / sfx: continue the old stream under the clip, then a 1.5 s equal-power crossfade to the shifted stream ending where the old timeline resumes
    def stream_splice(x):
        y = np.zeros((N1, 2), np.float32); xf = int(1.5 * SR); idx = np.arange(N1)
        shifts = [0] + [w['s1'] * SR // FPS for w in WIN]; ends = [int((w['An'] + w['L']) * SR) for w in WIN] + [N1]
        wt = np.zeros((len(shifts), N1))
        start = 0
        for k, sh in enumerate(shifts):
            e = ends[k]; r = np.zeros(N1); r[start:e] = 1
            if k > 0: r[ends[k - 1] - xf:ends[k - 1]] = np.sin(np.linspace(0, np.pi / 2, xf))
            if k < len(shifts) - 1: r[e - xf:e] = np.cos(np.linspace(0, np.pi / 2, xf))
            wt[k] = r; start = e
        for k, sh in enumerate(shifts):
            m = wt[k] > 0; src = idx[m] - sh; ok = (src >= 0) & (src < N0); sel = np.where(m)[0][ok]
            y[sel] += x[src[ok]] * wt[k][sel][:, None]
        return y
    rawm1, raws1 = stream_splice(rawm), stream_splice(raws)
    nslots = [(new_t(s0), new_t(s1)) for s0, s1 in oslots] + [(w['t0'], w['t1']) for w in WIN]
    gm1, gs1 = gains(*duck_curves(vo1, nslots, N1))
    mix = dia1 + rawm1 * gm1[:, None] + raws1 * gs1[:, None]
    for w in WIN:
        a0, a1 = int(w['t0'] * SR), int(w['t1'] * SR)
        print(f"  under {w['id']}: clip {20 * np.log10(rms(dia1[a0:a1])):.1f} dBFS, music {20 * np.log10(rms((rawm1 * gm1[:, None])[a0:a1])):.1f} dBFS")
    pf = V2 + '/premix.wav'; ff_save(pf, mix)
    # mix.py's loudness chain, unchanged
    def measure(f):
        o = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
        return json.loads(o[o.rfind('{'):o.rfind('}') + 1])
    m = measure(pf); src = pf; print('premix', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
    gain = -14 - float(m['input_i'])
    if float(m['input_tp']) + gain > -1.5:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={gain + 0.8:.2f}dB,alimiter=limit={db(-2.0):.4f}:attack=3:release=80:level=false',
                        '-ar', '48000', '-c:a', 'pcm_f32le', V2 + '/premix_lim.wav'], check=True)
        src = V2 + '/premix_lim.wav'; m = measure(src); print('limited', m['input_i'], 'LUFS', m['input_tp'], 'dBTP')
    af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
          f":offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '48000', V2 + '/mix.wav'], check=True)
    for f in (pf, V2 + '/premix_lim.wav'):
        if os.path.exists(f): os.remove(f)
    fin = measure(V2 + '/mix.wav'); print('FINAL mix.wav', fin['input_i'], 'LUFS, true peak', fin['input_tp'], 'dBTP, LRA', fin['input_lra'], '|', round(K.dur(V2 + '/mix.wav'), 3), 's')

# ------------------------------------------------------------------------------------------------------------------ subtitles
# the clip's words (file seconds, from the level curve + pocketsphinx): real footage cues carry no quote marks (like C3 / C2)
CUES = {'C1': [(37.76, 39.85, "Today, we look at things like"), (39.91, 42.08, "cancer, Alzheimer's,"), (42.12, 45.95, "heart disease, mental illness,"),
               (46.33, 47.46, "these will be relics"), (47.50, 48.42, "of the past in,"), (48.90, 49.97, "you know, I think,"), (50.08, 51.18, "less than a decade.")],
        'C1b': [(5.20, 6.58, "I think if we do this right,"), (7.02, 9.98, "we can create an age of miracles.")]}

def ass_t(s): s = max(0, s); return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"
def srt_t(s): ms = int(round(s * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
def p_ass(x): h, m, s = x.split(':'); return int(h) * 3600 + int(m) * 60 + float(s)

def cmd_subs(a):
    setup(); src = open(UT + 'subtitles.ass', encoding='utf-8').read().split('\n'); out, ev, dropped = [], [], []
    for l in src:
        m = re.match(r'Dialogue: (\d+),([\d:.]+),([\d:.]+),(.*)$', l)
        if not m: out.append(l); continue
        s, e = p_ass(m.group(2)), p_ass(m.group(3))
        w = next((w for w in WIN if s >= w['A'] - 1e-3 and s < w['B']), None)
        if w: dropped.append(m.group(4).split(',,')[-1]); continue
        ev.append((new_t(s), new_t(e), m.group(1), m.group(4)))
    style = next(e[3] for e in ev).rsplit('}', 1)[0] + '}'   # Sub,,0,0,0,,{\fad(120,160)}
    for w in WIN:
        for s, e, txt in CUES[w['id']]:
            assert len(txt) <= 34, txt
            ev.append((w['t0'] + s - w['cin'], w['t0'] + e - w['cin'], '0', style + txt))
    ev.sort(key=lambda x: x[0])
    for k in range(len(ev) - 1):                                     # no overlaps (the shifted cues meet the clip cues)
        if ev[k][1] > ev[k + 1][0] - .02: ev[k] = (ev[k][0], ev[k + 1][0] - .04, ev[k][2], ev[k][3])
    hdr = out[:out.index('[Events]') + 2]
    open(UT + 'subtitles-fassung-2.ass', 'w', encoding='utf-8').write('\n'.join(hdr + [f"Dialogue: {l},{ass_t(s)},{ass_t(e)},{r}" for s, e, l, r in ev]) + '\n')
    srt = [f"{k + 1}\n{srt_t(s)} --> {srt_t(e)}\n{re.sub(r'{[^}]*}', '', r.split(',', 6)[-1])}\n" for k, (s, e, l, r) in enumerate(ev)]
    open(UT + 'subtitles-fassung-2.srt', 'w', encoding='utf-8').write('\n'.join(srt))
    print(f'dropped {len(dropped)} card cues:', dropped); print(f'{len(ev)} cues -> {UT}subtitles-fassung-2.ass / .srt')

# ------------------------------------------------------------------------------------------------------------------ picture
def old_pieces(f0, f1):
    """old frames [f0, f1) -> [(file, in_frame, n)] from the fassung-1 picture state (the chunk files)"""
    st = K.load_state(); r = []
    for s in st['segments']:
        a, b = max(f0, s['f0']), min(f1, s['f1'])
        if a < b: r.append((s['file'], s['inf'] + a - s['f0'], b - a))
    return r

def cmd_plates(a):
    setup(); os.makedirs(PLATE, exist_ok=True)
    K.sh(['node', os.path.join(HERE, 'f54_v2_plate.mjs'), PLATE], cwd=FILM)
    bg = PLATE + '/bg.png'; K.sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(BG_FRAME[1]), '-i', os.path.join(K.WORK, BG_FRAME[0]), '-frames:v', '1', bg])
    for w in WIN:
        n = w['x1'] - w['x0']; tx0 = w['x0'] / FPS
        freeze = round((w['t0'] + (w['vin'] - w['cin']) - tx0) * FPS); nfoot = n - freeze
        # under the plate: the film itself at the same time (fade in) and, after the shift, where it resumes (fade out)
        h = n // 2; under = old_pieces(w['x0'] - w['s0'], w['x0'] - w['s0'] + h) + old_pieces(w['x1'] - w['s1'] - (n - h), w['x1'] - w['s1'])
        ch, names = [], []
        for k, (f, i, m) in enumerate(under):
            ch.append(f"movie='{f}',trim=start_frame={i}:end_frame={i + m},setpts=PTS-STARTPTS[u{k}]"); names.append(f'[u{k}]')
        tin, tout = .5, (w['t1'] - tx0) - .1                       # credits: rise after the plate is in, gone by the clip's last word
        g = ';\n'.join(ch) + ';\n' + ''.join(names) + f'concat=n={len(names)}:v=1:a=0,setpts=N/({FPS}*TB),format=yuv420p[under];\n'
        g += (f"movie='{bg}',loop=loop={n - 1}:size=1:start=0,setpts=N/({FPS}*TB),format=yuv420p,noise=alls=6:allf=t[bg];\n"
              f"movie='{w['src']}':seek_point={w['vin']:.4f},trim=start={w['vin']:.4f},setpts=PTS-STARTPTS,fps={FPS},trim=end_frame={nfoot},setpts=PTS-STARTPTS,"
              f"scale=1680:945:flags=lanczos,setsar=1,eq=saturation=0.9:gamma=0.97:contrast=1.03,noise=alls=9:allf=t,"
              f"tpad=start={freeze}:start_mode=clone,format=yuva420p[ft];\n"
              f"movie='{PLATE}/mask.png',format=gray,loop=loop={n - 1}:size=1:start=0,setpts=N/({FPS}*TB)[mk];\n"
              f"[ft][mk]alphamerge[fa];[bg][fa]overlay=120:112:format=auto[p1];\n"
              f"movie='{PLATE}/frame.png',format=rgba[fr];[p1][fr]overlay=0:0:format=auto[p2];\n"
              f"movie='{PLATE}/credits.png',format=rgba,loop=loop={n - 1}:size=1:start=0,setpts=N/({FPS}*TB),"
              f"fade=t=in:st={tin:.3f}:d=0.5:alpha=1,fade=t=out:st={tout - .4:.3f}:d=0.4:alpha=1[cr];[p2][cr]overlay=0:0:format=auto,format=yuva420p,"
              f"fade=t=in:st=0:d={XF / FPS:.3f}:alpha=1,fade=t=out:st={(n - XF) / FPS:.3f}:d={XF / FPS:.3f}:alpha=1[pl];\n"
              f"[under][pl]overlay=0:0:eof_action=pass:format=auto,trim=end_frame={n},format=yuv420p[out]\n")
        gf = V2 + f"/{w['id']}.filtergraph"; open(gf, 'w').write(g); o = V2 + f"/{w['id']}_plate.mp4"
        K.sh(['ffmpeg', '-v', 'error', '-y', '-filter_complex_script', gf, '-map', '[out]', '-c:v', 'libx264', '-crf', '10', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', str(FPS), o])
        print(f"{w['id']}: plate piece new frames {w['x0']}-{w['x1']} ({n}), footage {w['vin']}+ ({nfoot} frames, {freeze} held), {K.nframes(o)} frames -> {o}")

def segments():
    """the new picture: old chunk frames, the plate pieces at x0..x1, old frames again from where the shifted film resumes"""
    S = setup(); N = K.load_state()['frames'] + S; segs, pos = [], 0
    prev_old, out = 0, []
    for w in WIN:
        for f, i, m in old_pieces(prev_old, w['x0'] - w['s0']): out.append((f, i, m))
        out.append((V2 + f"/{w['id']}_plate.mp4", 0, w['x1'] - w['x0'])); prev_old = w['x1'] - w['s1']
    for f, i, m in old_pieces(prev_old, K.load_state()['frames']): out.append((f, i, m))
    for f, i, m in out: segs.append({'f0': pos, 'f1': pos + m, 'file': f, 'inf': i}); pos += m
    K.chk_cover(segs, N); return segs, N

def cmd_master(a):
    segs, N = segments(); T = {'duration': N / FPS}
    ass = UT + 'subtitles-fassung-2.ass'; mix = V2 + '/mix.wav'
    for f in (ass, mix) + tuple(V2 + f"/{w['id']}_plate.mp4" for w in WIN):
        if not os.path.exists(f): raise SystemExit('missing ' + f)
    gf = V2 + '/picture.filtergraph'; open(gf, 'w').write(K.picture_graph(segs, f'subtitles=filename={ass}', ()))
    m = a.out or os.path.join(K.FINAL, 'fassung-2-master-1080p.mp4'); import time; t0 = time.time()
    print('master:', m, '|', N, 'frames =', round(N / FPS, 3), 's | audio', mix, '| subtitles', ass)
    K.sh(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-filter_complex_script', gf, '-map', '[pic]', '-map', '0:a', '-af', K.AFILTER + f',atrim=end={N / FPS:.4f}',
          '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
          '-movflags', '+faststart', '-shortest', m])
    print(f'master done in {time.time() - t0:.0f} s, {os.path.getsize(m) / 1e6:.0f} MB'); K.verify(m, T)
    if not a.no_contact: K.contact(m, K.ROOT + 'bild/fassung-2_kontakt.jpg')
    print(f'end screen from {N / FPS - 15:.3f} s; clip windows: ' + ', '.join(f"{w['id']} {w['t0']:.2f}-{w['t1']:.2f} s (plate {w['x0'] / FPS:.2f}-{w['x1'] / FPS:.2f})" for w in WIN))

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('cmd', choices=['audio', 'subs', 'plates', 'master', 'all'])
    ap.add_argument('--crf', type=int, default=18); ap.add_argument('--out'); ap.add_argument('--no-contact', action='store_true'); a = ap.parse_args()
    for c in (['audio', 'subs', 'plates', 'master'] if a.cmd == 'all' else [a.cmd]): globals()['cmd_' + c](a)
