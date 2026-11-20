#!/usr/bin/env python3
"""Film 19 · clips + full render in one place (2026-11-08).

  python3 tools/f19_clips.py monday <dir with C1.mp4 C2.mp4 C2.wav C3.mp4 C3.wav> [--name fassung-2] [--work DIR] [-j 4]
      THE MONDAY COMMAND. (1) the footage: C1 cropped (pillarbox off) and muted, C2 cut at 10.2 s (the source cuts to a split screen
      after), C3 whole; frames at 30 fps into <work>/clips/<id>/ (the engine draws them into the screen slot: the screen push ends near
      full frame, credits + ORIGINAL FOOTAGE above), audio into <work>/clips/<id>.wav. (2) the quote subtitles: the quote text is
      force-aligned to the clip audio (pocketsphinx; falls back to an even spread over the speech) and written as cues into
      audio/clips.json. (3) mix (VO_BOOST=2, clip audio in the slots at the voice's level, music ducked) and subtitles. (4) re-renders
      only the picture pieces that touch a clip window (the other pieces of the last render are reused; missing ones are rendered),
      (5) master 1080p (subtitles burned) + 720p preview, (6) the clip check.
  python3 tools/f19_clips.py render [--name fassung-1] [--work DIR] [-j 4] [--force]
      the whole film as it is now (placeholders where no footage exists): pieces of 20 s, mix, subtitles, master, preview.
  python3 tools/f19_clips.py check   the clip check (audio/clips.json against audio/timing.json and the footage in <work>/clips).
  python3 tools/f19_clips.py cues    only rewrite the quote cues in audio/clips.json (from the clip audio if present).

Paths: repo film dir = this file's ../ ; data root ROOT = $F19ROOT or /mnt/project-files/scenario/film-biocomputer/ (timing.json,
subtitles, the 720p preview go there: small files only); <work> = --work, $F19WORK, or the scratchpad below (big files: frames,
pieces, master). Render pieces: node --expose-gc render.mjs, 20 s each, frame exact (600 frames), joined without re-encoding.
"""
import json, os, re, subprocess, sys, hashlib, shutil, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); AUD = os.path.join(FILM, 'audio')
ROOT = (os.environ.get('F19ROOT') or '/mnt/project-files/scenario/film-biocomputer/').rstrip('/') + '/'
SCRATCH = '/tmp/claude-0/-home-user-scenario/2535e93c-3715-531d-8a32-ba824a118b61/scratchpad/f19'
args = sys.argv[1:]
def opt(k, d=None):
    if k in args: i = args.index(k); v = args[i + 1]; del args[i:i + 2]; return v
    return d
WORK = opt('--work', os.environ.get('F19WORK') or (SCRATCH if os.path.isdir(os.path.dirname(SCRATCH)) else '/tmp/f19work'))
NAME = opt('--name', None); J = int(opt('-j', '4')); FORCE = '--force' in args
args = [a for a in args if a != '--force']
FPS, PIECE = 30, 20.0
CL = os.path.join(WORK, 'clips'); PCS = os.path.join(WORK, 'pieces'); WA = os.path.join(WORK, 'audio'); SUBS = os.path.join(WORK, 'subs')
for d in (CL, PCS, WA, SUBS): os.makedirs(d, exist_ok=True)
ENV = {**os.environ, 'F19CLIPS': CL, 'F19ROOT': ROOT}
TIMING = os.path.join(AUD, 'timing.json')

# ------------------------------------------------------------------------------------------------ the clips (what goes where)
# slot = the silent VO slot of build_vo.py (C2 11 s, C3 14 s); C1 has no slot: muted footage under "Cells like these…" (8 s window,
# lib/f19_kit.mjs clipWin). offset = the first footage frame this long after the slot opens (the screen push lands first).
SPEC = {
    'C1': {'file': 'C1.mp4', 'crop': '1562:1080:240:0', 'in': 0.0, 'dur': 8.0, 'offset': 0.0, 'fit': 'contain', 'muted': True,
           'name': 'Cortical Labs', 'role': 'CL1 playing DOOM', 'year': '2026', 'source': 'https://www.youtube.com/watch?v=yRV8fSw6HaE'},
    'C2': {'file': 'C2.mp4', 'wav': 'C2.wav', 'in': 0.0, 'dur': 10.2, 'offset': 0.4, 'fit': 'cover', 'gain_db': 0,
           'name': 'Brett Kagan', 'role': 'Chief Scientific Officer, Cortical Labs', 'year': '2026', 'source': 'https://www.youtube.com/watch?v=TXlJc4tu1F8',
           'quote': 'And what we found was actually, indeed, they did end up remarkably adjusting their activity patterns very rapidly '
                    'to try and create a more predictable environment and actually control it.'},
    'C3': {'file': 'C3.mp4', 'wav': 'C3.wav', 'in': 0.0, 'dur': 12.70, 'offset': 0.6, 'fit': 'cover', 'gain_db': 0,
           'name': 'Thomas Hartung', 'role': 'Johns Hopkins University', 'year': '2023',
           'quote': 'Embedded ethics, which means we work closely with ethicists. We design our experiments with ethicists. '
                    'We are inviting them to our laboratories to show them what our experiments are actually about.'},
}
SLOT_LEN = {'C2': 11.0, 'C3': 14.0}

def sh(cmd, **kw): return subprocess.run(cmd, check=True, **kw)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
def timing(): return json.load(open(TIMING))
def windows(T):
    """clip id -> (start, end) of the picture window in film time"""
    w = {c['id']: (c['start'], c['end']) for c in T['clips']}
    c1 = next(x['s'] for x in T['words'] if x['w'] == 'Cells' and T['words'][T['words'].index(x) + 1]['w'] == 'like')
    w['C1'] = (c1, c1 + SPEC['C1']['dur']); return w

# ------------------------------------------------------------------------------------------------ quote cues (<= 34 chars a line)
MAX = 34
FN = set('a an the to of and or that in on for was is it its by with as at from than but if we our'.split())
def split(ws):   # same balanced split as audio/subs.py
    L = lambda x: len(' '.join(w[0] for w in x))
    if L(ws) <= MAX or len(ws) < 2: return [ws]
    best, bi = 1e9, 1
    for k in range(1, len(ws)):
        a, b = ws[:k], ws[k:]
        c = abs(L(a) - L(b)) + (-25 if ws[k - 1][0].endswith((',', ';', ':')) else 0) + (30 if ws[k - 1][0].lower() in FN else 0) + (40 if len(a) < 2 or len(b) < 2 else 0)
        if c < best: best, bi = c, k
    return split(ws[:bi]) + split(ws[bi:])
def cues_from_words(W):
    sents, cur = [], []
    for w in W:
        cur.append(w)
        if re.search(r'[.?!]$', w[0]): sents.append(cur); cur = []
    if cur: sents.append(cur)
    return [[round(p[0][1], 3), ' '.join(w[0] for w in p)] for s in sents for p in split(s)]
def even_words(text, t0, t1):
    """word times spread by characters over [t0, t1] (placeholder until the clip audio is aligned)"""
    ws = text.split(); n = sum(len(w) + 1 for w in ws); out, c = [], 0
    for w in ws: a = t0 + (t1 - t0) * c / n; c += len(w) + 1; out.append([w, a, t0 + (t1 - t0) * c / n])
    return out
def speech_span(wav, d):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-t', str(d), '-af', 'silencedetect=n=-35dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', o)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    a = en[0] if st and st[0] < .05 and en else 0.0
    b = st[-1] if st and (not en or st[-1] > en[-1]) else d
    return a, min(b, d)
def align(wav, text, d):
    """pocketsphinx forced alignment of the quote to the clip audio -> [[word, start, end]] or None"""
    try:
        from pocketsphinx import Decoder, get_model_path
    except ImportError: return None
    raw = os.path.join(CL, 'align.raw')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-t', str(d), '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dic = {l.split()[0] for l in open(get_model_path() + '/en-us/cmudict-en-us.dict')}
    words = text.split(); seq, own = [], []
    for k, w in enumerate(words):
        for t in [t for t in re.sub(r"[^a-z' -]", '', w.lower()).replace('-', ' ').split() if t.strip("'")]:
            seq.append(t if t in dic else 'the'); own.append(k)
    dec = Decoder(loglevel='FATAL'); dec.set_align_text(' '.join(seq))
    dec.start_utt(); dec.process_raw(open(raw, 'rb').read(), full_utt=True); dec.end_utt()
    seg = [(x.start_frame / 100, (x.end_frame + 1) / 100) for x in (dec.seg() or []) if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    if len(seg) != len(seq): return None
    out = [[w, None, None] for w in words]
    for (a, b), o in zip(seg, own):
        if out[o][1] is None: out[o][1] = a
        out[o][2] = b
    return out

def write_clips_json(meta):
    json.dump(meta, open(os.path.join(AUD, 'clips.json'), 'w'), indent=1, ensure_ascii=False)
def make_cues(meta):
    for cid, m in meta.items():
        if not m.get('quote'): continue
        wav = os.path.join(CL, f'{cid}.wav'); W, how = None, 'even (no clip audio yet)'
        if os.path.exists(wav):
            W = align(wav, m['quote'], m['dur']); how = 'pocketsphinx'
            if W is None: a, b = speech_span(wav, m['dur']); W = even_words(m['quote'], a, b); how = f'even over the speech {a:.2f}-{b:.2f} s (alignment failed)'
        if W is None: W = even_words(m['quote'], .25, m['dur'] - .3)
        m['cues'] = cues_from_words(W); m['cue_source'] = how
        print(cid, 'cues:', how); [print('  ', c) for c in m['cues']]
    write_clips_json(meta)

# ------------------------------------------------------------------------------------------------ footage
def prepare(src):
    meta = {}
    for cid, s in SPEC.items():
        m = {k: v for k, v in s.items() if k not in ('file', 'wav')}
        f = os.path.join(src, s['file'])
        if not os.path.exists(f): raise SystemExit(f'missing {f}')
        fd = os.path.join(CL, cid); shutil.rmtree(fd, ignore_errors=True); os.makedirs(fd)
        vf = (f"crop={s['crop']}," if s.get('crop') else '') + ('scale=1680:945:force_original_aspect_ratio=decrease' if s['fit'] == 'contain' else 'scale=1680:945:force_original_aspect_ratio=increase,crop=1680:945')
        sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(s['in']), '-i', f, '-t', str(s['dur']), '-vf', f'fps={FPS},{vf}', '-q:v', '2', os.path.join(fd, 'f%05d.jpg')])
        n = len([x for x in os.listdir(fd) if x.endswith('.jpg')]); m['frames'] = n
        if s.get('crop'):   # sanity: does the pillarbox crop match what ffmpeg sees?
            o = subprocess.run(['ffmpeg', '-hide_banner', '-ss', '2', '-i', f, '-t', '3', '-vf', 'cropdetect=limit=24:round=2', '-f', 'null', '-'], capture_output=True, text=True).stderr
            cd = re.findall(r'crop=(\d+:\d+:\d+:\d+)', o); print(cid, 'crop', s['crop'], '| cropdetect says', cd[-1] if cd else '?')
        if s.get('wav'):
            w = os.path.join(src, s['wav']) if os.path.exists(os.path.join(src, s['wav'])) else f   # the .wav, else the mp4's own sound
            sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(s['in']), '-i', w, '-t', str(s['dur']), '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(CL, f'{cid}.wav')])
        print(cid, f'{n} frames ({n / FPS:.2f} s)', 'audio' if s.get('wav') else 'muted', '<-', f)
        meta[cid] = m
    return meta

# ------------------------------------------------------------------------------------------------ sound + subtitles
def sound(build=False):
    if build or not os.path.exists(os.path.join(WA, 'vo_master.wav')): sh(['python3', os.path.join(AUD, 'build_vo.py'), AUD, WA])
    sh(['python3', os.path.join(AUD, 'mix.py'), AUD, WA], env={**ENV, 'VO_BOOST': '2'})
    sh(['python3', os.path.join(AUD, 'subs.py'), AUD, SUBS])
    os.makedirs(ROOT + 'untertitel', exist_ok=True); os.makedirs(ROOT + 'audio', exist_ok=True)
    for f in ('subtitles.ass', 'subtitles.srt'): shutil.copy(os.path.join(SUBS, f), ROOT + 'untertitel/' + f)
    shutil.copy(TIMING, ROOT + 'audio/timing.json')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(WA, 'mix.wav'), '-c:a', 'libmp3lame', '-b:a', '192k', ROOT + 'audio/mix.mp3'])

# ------------------------------------------------------------------------------------------------ picture pieces
def pieces(T):
    n = int(-(-T['duration'] // PIECE)); return [(i, i * PIECE, min(T['duration'], (i + 1) * PIECE)) for i in range(n)]
def stamp():
    """what a piece depends on: the timing, the scenes/kit code, the clip frames present"""
    h = hashlib.sha1(open(TIMING, 'rb').read())
    for d in ('scenes', 'lib'):
        for f in sorted(os.listdir(os.path.join(FILM, d))): h.update(open(os.path.join(FILM, d, f), 'rb').read())
    for f in ('film.mjs', 'engine.mjs'): h.update(open(os.path.join(FILM, f), 'rb').read())
    return h.hexdigest()[:12]
def render_pieces(T, redo=()):
    man_f = os.path.join(PCS, 'manifest.json'); man = json.load(open(man_f)) if os.path.exists(man_f) else {}
    st = stamp(); todo = []
    for i, a, b in pieces(T):
        f = os.path.join(PCS, f'p{i:03d}.mp4')
        if FORCE or i in redo or not os.path.exists(f) or man.get(str(i), {}).get('stamp') != st or man.get(str(i), {}).get('to') != b: todo.append((i, a, b))
    print(f'{len(todo)} of {len(pieces(T))} pieces to render (stamp {st}, -j {J})')
    def one(p):
        i, a, b = p; f = os.path.join(PCS, f'p{i:03d}.mp4'); t0 = time.time()
        with open(os.path.join(PCS, f'p{i:03d}.log'), 'w') as lg:
            sh(['node', '--expose-gc', 'render.mjs', '--out', f + '.tmp.mp4', '--from', str(a), '--to', str(b), '--crf', '16'], cwd=FILM, env=ENV, stdout=lg, stderr=subprocess.STDOUT)
        os.replace(f + '.tmp.mp4', f); print(f'  p{i:03d} {a:.0f}-{b:.0f} s done in {time.time() - t0:.0f} s', flush=True)
        return i, a, b
    with ThreadPoolExecutor(J) as ex:
        for i, a, b in ex.map(one, todo):
            man[str(i)] = {'from': a, 'to': b, 'stamp': st}; json.dump(man, open(man_f, 'w'), indent=0)
    lst = os.path.join(PCS, 'list.txt')
    open(lst, 'w').write(''.join(f"file 'p{i:03d}.mp4'\n" for i, a, b in pieces(T)))
    pic = os.path.join(WORK, 'picture.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', pic])
    print('picture', round(dur(pic), 3), 's (timing', T['duration'], ')'); return pic

def master(pic, name):
    ass = os.path.join(SUBS, 'subtitles.ass'); m = os.path.join(WORK, f'{name}-master-1080p.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', pic, '-i', os.path.join(WA, 'mix.m4a'), '-map', '0:v', '-map', '1:a', '-vf', f'subtitles={ass}',
        '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', '-shortest', m])
    pv = os.path.join(WORK, f'{name}-720p.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', m, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '27', '-maxrate', '1700k', '-bufsize', '3400k', '-preset', 'medium',
        '-tune', 'grain', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', pv])
    shutil.copy(pv, ROOT + f'{name}-720p.mp4')
    print('master', m, f'{os.path.getsize(m) / 1e6:.0f} MB', '| preview', ROOT + f'{name}-720p.mp4', f'{os.path.getsize(pv) / 1e6:.0f} MB')
    return m

# ------------------------------------------------------------------------------------------------ the clip check
def check():
    T = timing(); meta = json.load(open(os.path.join(AUD, 'clips.json'))); W = windows(T); bad = []
    def err(s): bad.append(s); print('  FAIL', s)
    print('clip check', TIMING)
    for c in T['clips']:
        m = meta.get(c['id'], {}); L = c['end'] - c['start']
        print(f"  {c['id']} slot {c['start']:.3f}-{c['end']:.3f} ({L:.2f} s) footage {m.get('offset', 0):.2f}+{m.get('dur', 0):.2f} s · {m.get('name')} · {m.get('role')} · {m.get('year')}")
        if abs(L - SLOT_LEN[c['id']]) > .01: err(f"{c['id']} slot {L:.2f} s, expected {SLOT_LEN[c['id']]}")
        if m.get('offset', 0) + m.get('dur', 0) > L + 1e-6: err(f"{c['id']} footage runs past its slot")
        if L - m.get('offset', 0) - m.get('dur', 0) > 2: err(f"{c['id']} last frame frozen > 2 s")
        inside = [w['w'] for w in T['words'] if w['e'] > c['start'] + .02 and w['s'] < c['end'] - .02]
        if inside: err(f"{c['id']}: VO words inside the slot: {inside[:5]}")
        q = m.get('cues') or []
        if ' '.join(x[1] for x in q).split() != (m.get('quote') or '').split(): err(f"{c['id']}: cues do not spell the quote")
        for k, (t0, line) in enumerate(q):
            if len(line) > MAX: err(f"{c['id']}: cue longer than {MAX}: {line!r}")
            if not 0 <= t0 <= m['dur'] or (k and t0 <= q[k - 1][0]): err(f"{c['id']}: cue time {t0}")
        ns = q and min((q[k + 1][0] - q[k][0]) for k in range(len(q) - 1)) if len(q) > 1 else None
        if ns is not None and ns < .8: print(f"  note {c['id']}: shortest cue {ns:.2f} s")
    for cid in SPEC:
        fd = os.path.join(CL, cid); n = len([x for x in os.listdir(fd) if x.endswith('.jpg')]) if os.path.isdir(fd) else 0
        exp = round(meta.get(cid, {}).get('dur', 0) * FPS)
        print(f"  {cid} frames {n} (expected {exp})" + ('' if n else '  -> PLACEHOLDER in the picture'))
        if n and abs(n - exp) > 1: err(f'{cid}: {n} frames, expected {exp}')
        wv = os.path.join(CL, f'{cid}.wav')
        if SPEC[cid].get('wav') and n and not os.path.exists(wv): err(f'{cid}: footage without audio')
        if os.path.exists(wv) and dur(wv) + .05 < meta[cid]['dur']: err(f'{cid}: audio {dur(wv):.2f} s shorter than {meta[cid]["dur"]}')
    ws = sorted(W.items(), key=lambda x: x[1][0])
    for (a, wa), (b, wb) in zip(ws, ws[1:]):
        if wb[0] - wa[1] < 45: err(f'{a} -> {b}: only {wb[0] - wa[1]:.0f} s of own film between clips (rule >= 45 s)')
    tot = sum(m.get('dur', 0) for m in meta.values()); print(f"  clips {tot:.1f} s = {100 * tot / T['duration']:.1f} % of {T['duration']:.1f} s (target <= 8 %, hard <= 10 %)")
    if tot / T['duration'] > .10: err('clip share over 10 %')
    print('clip check:', 'OK' if not bad else f'{len(bad)} problem(s)'); return not bad

def redo_for_clips(T):
    W = windows(T); out = set()
    for i, a, b in pieces(T):
        for s, e in W.values():
            if a < e + 1.2 and b > s - 1.2: out.add(i)
    return out

if __name__ == '__main__':
    cmd = args[0] if args else ''
    if cmd == 'monday':
        meta = prepare(args[1]); make_cues(meta); T = timing()
        sound(); pic = render_pieces(T, redo_for_clips(T)); master(pic, NAME or 'fassung-2'); check()
    elif cmd == 'render':
        T = timing()
        if not os.path.exists(os.path.join(AUD, 'clips.json')): make_cues({k: {x: y for x, y in v.items() if x not in ('file', 'wav')} for k, v in SPEC.items()})
        sound(build=True); pic = render_pieces(T); master(pic, NAME or 'fassung-1'); check()
    elif cmd == 'check': sys.exit(0 if check() else 1)
    elif cmd == 'cues': make_cues(json.load(open(os.path.join(AUD, 'clips.json'))))
    else: print(__doc__)
