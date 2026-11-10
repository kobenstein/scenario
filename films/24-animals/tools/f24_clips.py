#!/usr/bin/env python3
"""Film 24 · assembly of the chunk videos, and the real footage later (2026-11-09). Pattern: films/19-biocomputer/tools/f19_clips.py.

  python3 tools/f24_clips.py assemble --name fassung-1 [--chunks DIR] [--fresh] [--calm] [--no-contact] [--crf 18]
      The chunk videos (c01..c11, 1080p30, no sound) are checked (resolution, fps, codec, frame count of every chunk against the chunk
      ranges of film.mjs, no gaps or overlaps, total = timing duration), joined, the mix (audio/mix.wav, -14 LUFS) goes under, the
      subtitles (ASS) are burned in, master 1080p H.264 CRF 18 + AAC 320k, then a 720p preview (local only; --root-preview copies it to the data root) and the checks
      (duration, LUFS / true peak, contact sheet 1 frame per 5 s to <ROOT>bild/<name>_kontakt.jpg, optionally calm.py).
  python3 tools/f24_clips.py clips <dir with C1.mp4 … C5.mp4, pig1-positive.wav, pig2-negative.wav> --name fassung-2
          [--only C1,C3] [--tol 0.15] [-j 2] [--quote C1="spoken words"] [--quotes quotes.json] [--plan] [--allow-shift] [--no-assemble]
      THE FOOTAGE COMMAND. Files that are missing stay placeholder / silent; give any subset.
        1. footage -> <clips>/<id>/f00001.jpg … (1680x945, 30 fps, what lib/f24_kit.mjs clipPlate loads: $F24CLIPS/<id>/f%05d.jpg),
           sound -> <clips>/<id>.wav (the .mp4's own sound; an <id>.wav next to the mp4 wins), pig calls -> <clips>/pig1-positive.wav …
           (48 kHz stereo). Real lengths go into audio/clips.json ("dur"; per clip optional "in", "fit": "contain", "crop": "w:h:x:y",
           "offset", "gain_db" are read from there). A length within --tol seconds (default 0.15) of the plan ("plan") is snapped to the
           plan (trimmed, or the last frame / silence holds): the timing then does NOT move and nothing but the clip windows is re-rendered.
        2. build_vo.py, mix.py, subs.py again (in a work copy of audio/, the repo is only touched at the end). Spoken clips get subtitle
           cues when clips.json has a "quote" (or --quote / --quotes): the quote is force-aligned to the clip sound (pocketsphinx).
        3. render pieces: ONLY the frames that show a clip (slot -0.8 s … +0.8 s, --margin) and, if a pig call changed its length,
           its window, as pieces of <= 20 s (SECS=cNN node --expose-gc render.mjs --from --to), 2 in parallel (-j). They replace the
           same frames in the chunk videos (state in <work>/state.json); everything else is reused.
           If a real length differs from the plan by more than --tol the TIMING SHIFTS: everything after the changed slot moves, so
           everything from the start of that chunk to the end of the film must be rendered again (~0.25 s/frame, 2 parallel:
           ~40 min for the whole film). The command prints this ("TIMING SHIFT") and stops unless --allow-shift is given. --plan only prints.
        4. repo + data root are updated (audio/clips.json, audio/timing.json, <ROOT>audio/timing.json, subtitles, mix preview) and
           assemble runs again (name from --name) unless --no-assemble.
  python3 tools/f24_clips.py plan C1=7.3 C3=10.0 [--build-check]   what-if without media: set slot lengths, show what would move
           and (build-check) whether every chunk still builds under the shifted timing.
  python3 tools/f24_clips.py check     audio/clips.json against audio/timing.json and the footage in <clips>.

Paths: ROOT = $F24ROOT or /mnt/project-files/scenario/film-tiersprache/ (timing.json, subtitles, 720p preview, contact sheet: small files);
WORK = --work / $F24WORK / the session scratchpad (chunks are looked for in WORK/cNN.mp4 and WORK/b*/cNN.mp4 or --chunks; WORK/audio holds
mix.wav + subtitles.ass; WORK/final the masters; WORK/clips the footage; WORK/patches the re-rendered pieces).
"""
import argparse, glob, hashlib, json, os, re, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); AUD = os.path.join(FILM, 'audio')
ROOT = (os.environ.get('F24ROOT') or '/mnt/project-files/scenario/film-tiersprache').rstrip('/') + '/'
SCRATCH = '/tmp/claude-0/-home-user-scenario/39637a2f-3240-54f4-ba96-c25ab255c2f9/scratchpad/f24'
FPS, PIECE = 30, 600           # 20 s pieces
IDS = [f'C{i}' for i in range(1, 6)]; PIGS = {'P1': 'pig1-positive.wav', 'P2': 'pig2-negative.wav'}
WORK = CL = PCS = WA = SUBS = FINAL = AB = STATE = None


def setup(work):
    global WORK, CL, PCS, WA, SUBS, FINAL, AB, STATE
    WORK = work or os.environ.get('F24WORK') or (SCRATCH if os.path.isdir(os.path.dirname(SCRATCH)) else '/tmp/f24work')
    CL = (os.environ.get('F24CLIPS') or os.path.join(WORK, 'clips')).rstrip('/')
    PCS, WA, SUBS, FINAL, AB = (os.path.join(WORK, d) for d in ('patches', 'audio', 'subs', 'final', 'audio_build'))
    STATE = os.path.join(WORK, 'state.json')
    for d in (CL, PCS, WA, SUBS, FINAL): os.makedirs(d, exist_ok=True)


def sh(cmd, **kw): return subprocess.run(cmd, check=True, **kw)
def out(cmd, **kw): return subprocess.check_output(cmd, **kw).decode()
def sha(*parts):
    h = hashlib.sha1()
    for p in parts: h.update(p if isinstance(p, bytes) else str(p).encode())
    return h.hexdigest()[:12]
def fsha(f): return sha(open(f, 'rb').read())
def dur(f): return float(out(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def probe(f):
    j = json.loads(out(['ffprobe', '-v', 'error', '-show_entries', 'stream=index,codec_type,codec_name,width,height,r_frame_rate,pix_fmt,nb_frames,duration,start_time',
                        '-show_entries', 'format=duration', '-of', 'json', f]))
    v = next((s for s in j['streams'] if s['codec_type'] == 'video'), None); a = next((s for s in j['streams'] if s['codec_type'] == 'audio'), None)
    return v, a, float(j['format']['duration'])
def nframes(f):
    v, _, d = probe(f)
    return int(v['nb_frames']) if v.get('nb_frames', 'N/A') != 'N/A' else round(d * FPS)


def timing_file():
    for f in (os.environ.get('TIMING'), ROOT + 'audio/timing.json', os.path.join(AUD, 'timing.json')):
        if f and os.path.exists(f): return f
    raise SystemExit('no timing.json')
def jload(f): return json.load(open(f))
def jsave(f, o): json.dump(o, open(f, 'w'), indent=1, ensure_ascii=False)


def chunk_ranges(tfile):
    """chunk id -> frame range, from film.mjs (the same ranges the renderer uses)"""
    code = ("import { chunkRanges } from './film.mjs'; import { timing } from './lib/kit.mjs';"
            f"const T = timing({json.dumps(tfile)}); const R = chunkRanges(T);"
            "console.log('@@' + JSON.stringify({ duration: T.duration, chunks: Object.values(R).map((r) => ({ id: r.id, a: r.a, b: r.b, fa: Math.round(r.a * 30), fb: Math.round(r.b * 30) })) }));")
    o = subprocess.run(['node', '--input-type=module', '-e', code], cwd=FILM, env={**os.environ, 'TIMING': tfile}, capture_output=True, text=True)
    m = re.search(r'@@(.*)', o.stdout)
    if not m: raise SystemExit('chunk ranges failed:\n' + o.stderr[-1500:])
    return json.loads(m.group(1))


# ---------------------------------------------------------------------------------------------------------------------- assemble
def find_chunk(cid, chunks_dir=None):
    n = cid[1:]
    cands = []
    if chunks_dir: cands += [os.path.join(chunks_dir, f'{cid}.mp4')]
    cands += [os.path.join(WORK, f'{cid}.mp4')] + sorted(glob.glob(os.path.join(WORK, 'b*', f'{cid}.mp4')))
    f = next((c for c in cands if os.path.exists(c)), None)
    if not f: raise SystemExit(f'chunk {cid}: not found in {cands}')
    return f

def check_chunks(R, chunks_dir):
    """the chunk check: every file 1920x1080 30 fps h264 yuv420p without sound, its frame count against the chunk range, no gap, no overlap"""
    print('chunk check (timing', R['duration'], 's)'); bad, segs, files, pos = [], [], {}, 0
    err = lambda s: (bad.append(s), print('  FAIL', s))
    total = round(R['duration'] * FPS)
    for c in R['chunks']:
        f = find_chunk(c['id'], chunks_dir); v, a, d = probe(f); n = nframes(f); exp = c['fb'] - c['fa']
        files[c['id']] = {'file': f, 'size': os.path.getsize(f), 'mtime': os.stat(f).st_mtime_ns, 'n': n}
        ok = (v['width'], v['height'], v['r_frame_rate'], v['codec_name'], v['pix_fmt']) == (1920, 1080, '30/1', 'h264', 'yuv420p')
        st = float(v.get('start_time') or 0)
        print(f"  {c['id']} {c['a']:8.3f}-{c['b']:8.3f}  {v['width']}x{v['height']} {v['r_frame_rate']} {v['codec_name']}/{v['pix_fmt']}  {n:5d} frames (range {exp})  "
              f"{d:7.3f} s  starts at frame {pos} (range {c['fa']})  {f}")
        if not ok: err(f"{c['id']}: format {v['width']}x{v['height']} {v['r_frame_rate']} {v['codec_name']} {v['pix_fmt']}")
        if a: err(f"{c['id']}: has an audio stream")
        if abs(st) > .1: err(f"{c['id']}: start_time {st}")
        if abs(pos - c['fa']) > 1: err(f"{c['id']}: starts at frame {pos}, chunk range says {c['fa']} (gap/overlap of {pos - c['fa']} frames)")
        elif pos != c['fa']: print(f"  note {c['id']}: boundary {pos - c['fa']:+d} frame vs the range (renderer rounding, the total still adds up)")
        segs.append({'f0': pos, 'f1': pos + n, 'file': f, 'inf': 0}); pos += n
    if pos != total: err(f'chunks add up to {pos} frames, the film has {total}')
    print(f"  total {pos} frames = {pos / FPS:.3f} s (timing {R['duration']} s)", 'OK' if not bad else f'{len(bad)} problem(s)')
    if bad: raise SystemExit(1)
    return segs, files

def load_state(): return jload(STATE) if os.path.exists(STATE) else None
def save_state(st): jsave(STATE, st)

def chk_cover(segs, N):
    p = 0
    for s in sorted(segs, key=lambda s: s['f0']):
        if s['f0'] != p: raise SystemExit(f'picture has a gap/overlap at frame {p} ({p / FPS:.2f} s); segment starts at {s["f0"]}')
        p = s['f1']
    if p != N: raise SystemExit(f'picture covers {p} frames, the film needs {N}: render the missing part with `clips`')

def overlay(segs, f0, f1, f, inf=0):
    o = []
    for s in segs:
        if s['f1'] <= f0 or s['f0'] >= f1: o.append(s); continue
        if s['f0'] < f0: o.append({**s, 'f1': f0})
        if s['f1'] > f1: o.append({**s, 'f0': f1, 'inf': s['inf'] + f1 - s['f0']})
    o.append({'f0': f0, 'f1': f1, 'file': f, 'inf': inf}); return sorted(o, key=lambda s: s['f0'])

def picture_graph(segs, tail='null'):
    """filtergraph: every segment = trim by FRAME NUMBER of its file (exact; the concat demuxer's inpoint/outpoint were off by a frame at the splices),
    joined by the concat filter, frames renumbered 30 fps. Ends in [pic] (tail = filters appended before [pic], e.g. subtitles=...)."""
    cache, ch, names = {}, [], []
    for k, s in enumerate(sorted(segs, key=lambda s: s['f0'])):
        n = cache.setdefault(s['file'], nframes(s['file'])); n_s = s['f1'] - s['f0']
        t = '' if (s['inf'] == 0 and n_s == n) else f"trim=start_frame={s['inf']}:end_frame={s['inf'] + n_s},"
        ch.append(f"movie='{s['file']}',{t}setpts=PTS-STARTPTS[v{k}]"); names.append(f'[v{k}]')
    return ';\n'.join(ch) + ';\n' + ''.join(names) + f"concat=n={len(names)}:v=1:a=0,setpts=N/({FPS}*TB)" + ('' if tail == 'null' else ',' + tail) + '[pic]\n'

def audio_in():
    for d in (WA, ROOT + 'audio'):
        if os.path.exists(os.path.join(d, 'mix.wav')): return os.path.join(d, 'mix.wav')
    raise SystemExit('no mix.wav in ' + WA)
def subs_in():
    for d in (WA, SUBS, ROOT + 'audio'):
        if os.path.exists(os.path.join(d, 'subtitles.ass')): return os.path.join(d, 'subtitles.ass')
    raise SystemExit('no subtitles.ass')

def lufs(f):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = o[o.rfind('Summary:'):]
    g = lambda k: float(re.search(k + r':\s+(-?[\d.]+)', s).group(1))
    return g('I'), g('LRA'), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1))

def contact(master, f, every=5):
    d = dur(master); n = int(d // every) + 1; cols = 8; rows = -(-n // cols)
    fnt = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    vf = (f"fps=1/{every}:round=down,scale=240:135,drawtext=fontfile={fnt}:text='%{{pts\\:gmtime\\:0\\:%M\\\\\\:%S}}':x=4:y=4:fontsize=14:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=2,"
          f"tile={cols}x{rows}:padding=2:margin=2:color=black")
    sh(['ffmpeg', '-v', 'error', '-y', '-i', master, '-an', '-vf', vf, '-frames:v', '1', '-q:v', '3', f])
    print(f'contact sheet {n} frames (every {every} s) -> {f} ({os.path.getsize(f) / 1e3:.0f} kB)')

def make_state(chunks_dir):
    """the picture state = the chunk videos as they are, checked against the chunk ranges of the current timing"""
    tfile = timing_file(); T = jload(tfile)
    segs, files = check_chunks(chunk_ranges(tfile), chunks_dir)
    st = {'timing_sha': fsha(tfile), 'frames': round(T['duration'] * FPS), 'segments': segs, 'chunks': files, 'patches': 0}
    shutil.copy(tfile, os.path.join(WORK, 'state_timing.json')); save_state(st); return st

def cmd_assemble(a):
    tfile = timing_file(); T = jload(tfile); N = round(T['duration'] * FPS); st = load_state(); tsha = fsha(tfile)
    if st is None or a.fresh:
        if st and a.fresh and st.get('patches'): print('--fresh: the re-rendered clip pieces are dropped')
        st = make_state(a.chunks)
    else:
        if st['timing_sha'] != tsha: raise SystemExit(f'timing.json changed since the picture state was made ({st["timing_sha"]} -> {tsha}); run `clips` (re-renders what moved) or `assemble --fresh`')
        for cid, c in st['chunks'].items():
            if not os.path.exists(c['file']) or os.path.getsize(c['file']) != c['size'] or os.stat(c['file']).st_mtime_ns != c['mtime']:
                raise SystemExit(f'chunk {cid} changed since the state was made ({c["file"]}); `assemble --fresh` takes the chunks as they are now (drops re-rendered clip pieces)')
        print(f"picture state: {len(st['segments'])} segments ({st['patches']} re-rendered clip pieces)")
    chk_cover(st['segments'], N)
    name = a.name; ass = subs_in(); mix = audio_in(); gf = os.path.join(WORK, 'picture.filtergraph'); open(gf, 'w').write(picture_graph(st['segments'], f'subtitles=filename={ass}'))
    m = os.path.join(FINAL, f'{name}-master-1080p.mp4'); t0 = time.time()
    print('master:', m, '| audio', mix, '| subtitles', ass)
    sh(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-filter_complex_script', gf, '-map', '[pic]', '-map', '0:a',
        '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
        '-movflags', '+faststart', '-shortest', m])
    print(f'master done in {time.time() - t0:.0f} s, {os.path.getsize(m) / 1e6:.0f} MB')
    if not a.no_preview:
        pv = os.path.join(FINAL, f'{name}-720p.mp4'); t0 = time.time()
        sh(['ffmpeg', '-v', 'error', '-y', '-i', m, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '27', '-maxrate', '1700k', '-bufsize', '3400k', '-preset', 'medium',
            '-tune', 'grain', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', pv])
        if getattr(a, 'root_preview', False):   # the network drive is short of space: the preview only goes there when asked for (--root-preview)
            dst = ROOT + f'{name}-720p.mp4'; shutil.copy(pv, dst); time.sleep(10)   # network drive: wait, then check
            sz = os.path.getsize(dst); print(f'preview {dst} {sz / 1e6:.0f} MB (local {os.path.getsize(pv) / 1e6:.0f} MB; limit 500 MB) in {time.time() - t0:.0f} s')
            if sz != os.path.getsize(pv) or sz > 500e6: print('  FAIL preview copy incomplete or over 500 MB')
        else: print(f'preview {pv} {os.path.getsize(pv) / 1e6:.0f} MB (local only)')
    verify(m, T)
    if not a.no_contact:
        os.makedirs(ROOT + 'bild', exist_ok=True); contact(m, ROOT + f'bild/{name}_kontakt.jpg')
    if a.calm: sh(['python3', os.path.join(HERE, 'calm.py'), m, '--scale', '1280:720', '--sub', '170', '--json', os.path.join(FINAL, f'{name}-calm.json')])

def verify(m, T):
    d = dur(m); v, au, _ = probe(m); i, lra, tp = lufs(m)
    ok = abs(d - T['duration']) <= .1
    print(f"verify {m}: duration {d:.3f} s (timing {T['duration']}) {'OK' if ok else 'FAIL'} | {v['width']}x{v['height']} {v['r_frame_rate']} {v['nb_frames']} frames | audio {au['codec_name']} | "
          f"{i:.2f} LUFS, LRA {lra:.1f}, true peak {tp:.2f} dBTP {'OK' if abs(i + 14) <= .5 and tp <= -1 else 'CHECK'}")


# ---------------------------------------------------------------------------------------------------------------------- sound work copy
def work_audio(meta):
    """AB = work copy of audio/: symlinks to everything, own clips.json (meta) and timing.json (written by build_vo)"""
    shutil.rmtree(AB, ignore_errors=True); os.makedirs(AB)
    for n in os.listdir(AUD):
        if n not in ('clips.json', 'timing.json'): os.symlink(os.path.join(AUD, n), os.path.join(AB, n))
    jsave(os.path.join(AB, 'clips.json'), meta)
def tools_env(): return {**os.environ, 'F24CLIPS': CL, 'F24ROOT': ROOT, 'F24CLIPSJSON': os.path.join(AB, 'clips.json'), 'TIMING': os.path.join(AB, 'timing.json'), 'VO_BOOST': '2'}
def build_sound(full=True):
    env = tools_env()
    sh(['python3', os.path.join(AUD, 'build_vo.py'), AB, WA if full else os.path.join(WORK, 'audio_whatif')], env=env)
    if full:
        sh(['python3', os.path.join(AUD, 'mix.py'), AB, WA], env=env); sh(['python3', os.path.join(AUD, 'subs.py'), AB, SUBS], env=env)

def publish_audio():
    """repo + data root get the new numbers, only after the pictures are done"""
    for f in ('clips.json', 'timing.json'): shutil.copy(os.path.join(AB, f), os.path.join(AUD, f))
    os.makedirs(ROOT + 'audio', exist_ok=True)
    shutil.copy(os.path.join(AB, 'timing.json'), ROOT + 'audio/timing.json')
    for f in ('subtitles.ass', 'subtitles.srt'): shutil.copy(os.path.join(SUBS, f), ROOT + 'audio/' + f); shutil.copy(os.path.join(SUBS, f), os.path.join(WA, f))
    sh(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(WA, 'mix.wav'), '-c:a', 'libmp3lame', '-b:a', '128k', ROOT + 'audio/mix-vorschau.mp3'])


# ---------------------------------------------------------------------------------------------------------------------- footage
MAX = 34   # subtitle line length (audio/subs.py)
FN = set('a an the to of and or that in on for was is it its by with as at from than but if we our'.split())
def split(ws):
    L = lambda x: len(' '.join(w[0] for w in x))
    if L(ws) <= MAX or len(ws) < 2: return [ws]
    best, bi = 1e9, 1
    for k in range(1, len(ws)):
        x, y = ws[:k], ws[k:]
        c = abs(L(x) - L(y)) + (-25 if ws[k - 1][0].endswith((',', ';', ':')) else 0) + (30 if ws[k - 1][0].lower() in FN else 0) + (40 if len(x) < 2 or len(y) < 2 else 0)
        if c < best: best, bi = c, k
    return split(ws[:bi]) + split(ws[bi:])
def cues_from_words(Wd):
    sents, cur = [], []
    for w in Wd:
        cur.append(w)
        if re.search(r'[.?!]$', w[0]): sents.append(cur); cur = []
    if cur: sents.append(cur)
    return [[round(p[0][1], 3), ' '.join(w[0] for w in p)] for s in sents for p in split(s)]
def even_words(text, t0, t1):
    ws = text.split(); n = sum(len(w) + 1 for w in ws); o, c = [], 0
    for w in ws: x = t0 + (t1 - t0) * c / n; c += len(w) + 1; o.append([w, x, t0 + (t1 - t0) * c / n])
    return o
def speech_span(wav, d):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-t', str(d), '-af', 'silencedetect=n=-35dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', o)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    return (en[0] if st and st[0] < .05 and en else 0.0), min(st[-1] if st and (not en or st[-1] > en[-1]) else d, d)
NUM = {'30': 'thirty', '20': 'twenty', '10': 'ten', '2': 'two', '3': 'three', '1': 'one'}   # digits in a quote, as spoken
def align(wav, text, d):
    try: from pocketsphinx import Decoder, get_model_path
    except ImportError: return None
    raw = os.path.join(CL, 'align.raw')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-t', str(d), '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dic = {l.split()[0] for l in open(get_model_path() + '/en-us/cmudict-en-us.dict')}
    words = text.split(); seq, own = [], []
    for k, w in enumerate(words):
        for t in [t for t in re.sub(r"[^a-z0-9' -]", '', w.lower()).replace('-', ' ').split() if t.strip("'")]:
            t = NUM.get(t, t); seq.append(t if t in dic else 'the'); own.append(k)
    def run(sq):
        dec = Decoder(loglevel='FATAL'); dec.set_align_text(' '.join(sq)); dec.start_utt(); dec.process_raw(open(raw, 'rb').read(), full_utt=True); dec.end_utt()
        return [(x.start_frame / 100, (x.end_frame + 1) / 100) for x in (dec.seg() or []) if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    cut = 0   # the forced alignment can fail on a rough tail (overlapping voices, music): then drop trailing words, align the rest, and spread the dropped words evenly to the end of the speech
    while cut < min(10, len(seq) - 4):
        seg = run(seq[:len(seq) - cut])
        if len(seg) == len(seq) - cut: break
        cut += 1
    else: return None
    own_n = own[:len(seq) - cut]; o = [[w, None, None] for w in words]
    for (x, y), k in zip(seg, own_n):
        if o[k][1] is None: o[k][1] = x
        o[k][2] = y
    if cut:   # the dropped tokens (not words: "30-million-year-old" is one word) share the time to the end of the speech by their length
        tk = seq[len(seq) - cut:]; x0 = seg[-1][1]; x1 = max(x0 + .25 * cut, min(speech_span(wav, d)[1], d - .1)); n = sum(len(t) + 1 for t in tk); c = 0
        for t, k in zip(tk, own[len(seq) - cut:]):
            a, b = x0 + (x1 - x0) * c / n, x0 + (x1 - x0) * (c + len(t) + 1) / n; c += len(t) + 1
            if o[k][1] is None: o[k][1] = a
            o[k][2] = b
        print(f'  note: alignment of the last {cut} spoken words failed; spread evenly over {x0:.2f}-{x1:.2f} s')
    return o
def make_cues(cid, m):
    wav = os.path.join(CL, f'{cid}.wav')
    if not m.get('quote') or not os.path.exists(wav): return
    Wd = align(wav, m['quote'], m['dur']); how = 'pocketsphinx'
    if Wd is None: x, y = m['speech'] if m.get('speech') else speech_span(wav, m['dur']); Wd = even_words(m['quote'], x, y); how = f'even over the speech {x:.2f}-{y:.2f} s (alignment failed)'
    m['cues'] = cues_from_words(Wd); m['cue_source'] = how; print(cid, 'cues:', how); [print('  ', c) for c in m['cues']]

def prepare(src, meta, only, tol):
    """footage + sound into CL; returns the ids that were (re)made and the pig ids whose slot length changed"""
    done, pigs = [], []
    for cid in IDS:
        if only and cid not in only: continue
        m = meta.setdefault(cid, {}); f = os.path.join(src, f'{cid}.mp4')
        if not os.path.exists(f): print(cid, 'not given: stays placeholder'); continue
        v, au, vd = probe(f); tin = float(m.get('in', 0)); L = vd - tin; plan = m.get('plan') or L
        d = plan if abs(L - plan) <= tol else round(L * FPS) / FPS
        fit = m.get('fit') or 'cover'; wav_src = os.path.join(src, f'{cid}.wav')
        sig = sha(os.path.getsize(f), os.stat(f).st_mtime_ns, tin, fit, m.get('crop'), d, os.path.exists(wav_src) and os.stat(wav_src).st_mtime_ns)
        fd = os.path.join(CL, cid); n = len([x for x in os.listdir(fd) if x.endswith('.jpg')]) if os.path.isdir(fd) else 0
        has_snd = au is not None or os.path.exists(wav_src)
        if m.get('src_sig') == sig and n and (os.path.exists(os.path.join(CL, f'{cid}.wav')) or not has_snd):
            print(cid, 'footage unchanged (frames present)')
        else:
            shutil.rmtree(fd, ignore_errors=True); os.makedirs(fd)
            pre = f"fps={FPS},{'crop=' + m['crop'] + ',' if m.get('crop') else ''}"
            if fit == 'contain':   # e.g. the portrait C3 (608x1080): whole picture centred in 1680x945 on a darkened, blurred copy of itself (cover would crop it to a strip)
                vf = (pre + 'split[a][b];[a]scale=1680:945:force_original_aspect_ratio=increase,crop=1680:945,boxblur=40:4,eq=brightness=-0.18:saturation=.8[bg];'
                      '[b]scale=1680:945:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2')
            else: vf = pre + 'scale=1680:945:force_original_aspect_ratio=increase,crop=1680:945'
            sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(tin), '-i', f, '-t', f'{d:.3f}', '-vf', vf, '-q:v', '2', os.path.join(fd, 'f%05d.jpg')])
            n = len([x for x in os.listdir(fd) if x.endswith('.jpg')])
            if has_snd:
                sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(tin), '-i', wav_src if os.path.exists(wav_src) else f, '-t', f'{d:.3f}', '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(CL, f'{cid}.wav')])
            elif os.path.exists(os.path.join(CL, f'{cid}.wav')): os.remove(os.path.join(CL, f'{cid}.wav'))
        old = m.get('dur'); m.update(dur=round(d, 3), frames=n, real=round(L, 3), src_sig=sig, src=os.path.basename(f))
        print(f"{cid}: footage {L:.2f} s, plan {plan}, slot footage {d:.3f} s{' (snapped to the plan)' if d == plan and abs(L - plan) > 1e-3 else ''}, {n} frames, {'sound' if os.path.exists(os.path.join(CL, cid + '.wav')) else 'NO SOUND'}")
        if au is None and not os.path.exists(wav_src): print(f'  note {cid}: the mp4 has no sound and there is no {cid}.wav')
        make_cues(cid, m); done.append(cid)
    for pid, fn in PIGS.items():
        if only and pid not in only: continue
        m = meta.setdefault(pid, {}); f = os.path.join(src, fn)
        if not os.path.exists(f): print(pid, 'not given: slot stays silent'); continue
        L = dur(f); plan = m.get('plan') or L; d = plan if abs(L - plan) <= tol else L
        sh(['ffmpeg', '-v', 'error', '-y', '-i', f, '-af', f'apad=whole_dur={d:.3f}', '-t', f'{d:.3f}', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(CL, fn)])
        print(f"{pid}: {L:.2f} s, plan {plan} -> slot {d:.3f} s{' (snapped to the plan)' if d == plan and abs(L - plan) > 1e-3 else ''}")
        m.update(dur=round(d, 3), real=round(L, 3)); done.append(pid)
        if abs(d - plan) > 1e-3: pigs.append(pid)
    return done, pigs


# ---------------------------------------------------------------------------------------------------------------------- what moves, what to render
def slot_diff(old, new):
    """first slot (in the old timeline) whose length changed, and the total change"""
    os_, ns = {s['id']: s for s in old['slots']}, {s['id']: s for s in new['slots']}
    ch = [(os_[i]['start'], i, ns[i]['end'] - ns[i]['start'] - (os_[i]['end'] - os_[i]['start'])) for i in os_ if i in ns and abs((ns[i]['end'] - ns[i]['start']) - (os_[i]['end'] - os_[i]['start'])) > 5e-4]
    return sorted(ch)

def stamp(tfile, cjson):
    h = [open(tfile, 'rb').read(), open(cjson, 'rb').read()]
    for d in ('scenes', 'lib'):
        for f in sorted(os.listdir(os.path.join(FILM, d))): h.append(open(os.path.join(FILM, d, f), 'rb').read())
    for f in ('film.mjs', 'engine.mjs', 'render.mjs'): h.append(open(os.path.join(FILM, f), 'rb').read())
    return sha(*h)

def dirty_ranges(old, new, R_old, R_new, windows, margin):
    """-> (list of [f0, f1) to render, shift info or None)"""
    N = round(new['duration'] * FPS); rng = []; shift = None
    ch = slot_diff(old, new)
    if ch or abs(old['duration'] - new['duration']) > 5e-4:
        t0 = ch[0][0] if ch else min(old['duration'], new['duration'])
        c = next(c for c in R_old['chunks'] if c['a'] <= t0 < c['b']) if ch else R_old['chunks'][-1]
        shift = {'slots': [(i, round(d, 3)) for _, i, d in ch], 'from_chunk': c['id'], 'from_frame': c['fa'], 'frames': N - c['fa']}
        rng.append([c['fa'], N])   # camera paths run between keyframes in the whole plan sequence of the chunk: from its start
    for s, e in windows: rng.append([max(0, int((s - margin) * FPS)), min(N, int(-(-(e + margin) * FPS // 1)))])
    rng.sort(); m = []
    for r in rng:
        if m and r[0] <= m[-1][1]: m[-1][1] = max(m[-1][1], r[1])
        else: m.append(r)
    return m, shift

def pieces_of(f0, f1):
    n = -(-(f1 - f0) // PIECE); sz = -(-(f1 - f0) // n); return [(f0 + i * sz, min(f1, f0 + (i + 1) * sz)) for i in range(n)]

def render_patches(todo, R_new, tfile, cjson, st_stamp, j):
    """todo = [(f0, f1)] pieces; returns [(f0, f1, file)]"""
    env = {**tools_env(), 'TIMING': tfile, 'F24CLIPSJSON': cjson}; res = {}
    def one(p):
        f0, f1 = p; f = os.path.join(PCS, f'p{f0:06d}_{f1:06d}_{st_stamp}.mp4')
        if os.path.exists(f) and nframes(f) == f1 - f0: print(f'  piece {f0}-{f1} reused', flush=True); return p, f
        ids = [c['id'] for c in R_new['chunks'] if c['fa'] < f1 and c['fb'] > f0]; t0 = time.time()
        with open(f[:-4] + '.log', 'w') as lg:
            sh(['node', '--expose-gc', 'render.mjs', '--out', f + '.tmp.mp4', '--from', f'{f0 / FPS:.6f}', '--to', f'{f1 / FPS:.6f}', '--crf', '16'], cwd=FILM, env={**env, 'SECS': ','.join(ids)}, stdout=lg, stderr=subprocess.STDOUT)
        os.replace(f + '.tmp.mp4', f); n = nframes(f)
        if n != f1 - f0: raise SystemExit(f'piece {f0}-{f1}: {n} frames, expected {f1 - f0}')
        print(f'  piece {f0}-{f1} ({ids}) {(f1 - f0) / FPS:.1f} s done in {time.time() - t0:.0f} s', flush=True); return p, f
    with ThreadPoolExecutor(j) as ex:
        for p, f in ex.map(one, todo): res[p] = f
    return [(a, b, res[(a, b)]) for a, b in todo]

def cmd_clips(a):
    src = a.dir; meta = jload(os.path.join(AUD, 'clips.json')); only = set(a.only.split(',')) if a.only else None
    for q in a.quote or []: k, v = q.split('=', 1); meta.setdefault(k, {})['quote'] = v
    if a.quotes:
        for k, v in jload(a.quotes).items(): meta.setdefault(k, {})['quote'] = v
    tfile0 = timing_file(); st = load_state()
    if st is None: print('no picture state yet: taking the chunks as they are'); st = make_state(a.chunks)
    done, pigs = prepare(src, meta, only, a.tol)
    if not done: raise SystemExit('nothing to do: no C1–C5.mp4 / pig wav in ' + src)
    return finish_clips(a, meta, done, pigs, st)

def finish_clips(a, meta, done, pigs, st):
    work_audio(meta); build_sound(); old = jload(os.path.join(WORK, 'state_timing.json')); new = jload(os.path.join(AB, 'timing.json'))
    tnew = os.path.join(AB, 'timing.json'); cj = os.path.join(AB, 'clips.json')
    R_old = chunk_ranges(os.path.join(WORK, 'state_timing.json')); R_new = chunk_ranges(tnew)
    win = [(s['start'], s['end']) for s in new['slots'] if s['id'] in done and (s['kind'] == 'clip' or s['id'] in pigs)]
    rng, shift = dirty_ranges(old, new, R_old, R_new, win, a.margin)
    N = round(new['duration'] * FPS); n_fr = sum(b - x for x, b in rng)
    print(f"\nre-render plan: {', '.join(f'{x / FPS:.1f}-{b / FPS:.1f} s' for x, b in rng)} = {n_fr} frames = {n_fr / FPS:.0f} s of {new['duration']} s (~{n_fr * .25 / 60 / a.j:.0f} min at -j {a.j})")
    for s in new['slots']:
        o = next(x for x in old['slots'] if x['id'] == s['id']); print(f"  slot {s['id']} {s['start']:.3f}-{s['end']:.3f} ({s['end'] - s['start']:.2f} s; was {o['end'] - o['start']:.2f} s) {s['length_from']}")
    if shift:
        print(f"\n*** TIMING SHIFT: slot length change {shift['slots']} moves everything after it. The film is {new['duration']} s (was {old['duration']} s). ***\n"
              f"*** Everything from chunk {shift['from_chunk']} (frame {shift['from_frame']}, {shift['from_frame'] / FPS:.1f} s) to the end must be rendered again: {shift['frames']} frames. ***")
        if not a.allow_shift: print('stopped (use --allow-shift to render this, or give the footage at the planned length / raise --tol). Nothing in the repo or data root was changed.'); sys.exit(3)
    else: print('timing unchanged: only the clip windows are rendered, everything else is reused')
    if a.plan: print('--plan: stop here'); return
    todo = [p for x, b in rng for p in pieces_of(x, b)]
    patches = render_patches(todo, R_new, tnew, cj, stamp(tnew, cj), a.j)
    segs = st['segments']
    if shift: segs = [dict(s, f1=min(s['f1'], shift['from_frame'])) for s in segs if s['f0'] < shift['from_frame']]
    for f0, f1, f in patches: segs = overlay(segs, f0, f1, f)
    chk_cover(segs, N)
    publish_audio()
    st.update(segments=segs, timing_sha=fsha(os.path.join(AUD, 'timing.json')), frames=N, patches=st.get('patches', 0) + len(patches))
    shutil.copy(os.path.join(AUD, 'timing.json'), os.path.join(WORK, 'state_timing.json')); save_state(st)
    assert fsha(timing_file()) == st['timing_sha']
    print('clips done; repo: audio/clips.json audio/timing.json updated (commit them)')
    if not a.no_assemble: cmd_assemble(argparse.Namespace(name=a.name or 'fassung-2', chunks=a.chunks, fresh=False, calm=False, no_contact=False, no_preview=False, crf=18))


# ---------------------------------------------------------------------------------------------------------------------- what-if, check
def cmd_plan(a):
    meta = jload(os.path.join(AUD, 'clips.json')); done, pigs = [], []
    for kv in a.sets:
        k, v = kv.split('='); meta[k]['dur'] = float(v) - (meta[k].get('offset', 0) if k in IDS else 0); done.append(k)
        if k in PIGS: raise SystemExit('pig slot lengths come from the wav; use clips')
    os.makedirs(os.path.join(WORK, 'audio_whatif'), exist_ok=True); work_audio(meta); build_sound(full=False)
    new = jload(os.path.join(AB, 'timing.json')); old = jload(timing_file()); tnew = os.path.join(AB, 'timing.json')
    ch = slot_diff(old, new)
    print('slot changes:', [(i, round(d, 3)) for _, i, d in ch], '| film', old['duration'], '->', new['duration'])
    if a.build_check:
        code = ("import { build } from './film.mjs';"
                "const film = await build(); console.log('@@ok', film.duration, 'entries', film.list.length);"
                "for (const t of [60, 100, 170, 230, 300, 380, 450, 520, 580, 628]) { if (film.prepare) await film.prepare(t); film.frame(t); } console.log('@@frames ok');")
        o = subprocess.run(['node', '--input-type=module', '-e', code], cwd=FILM, env={**os.environ, 'TIMING': tnew, 'F24CLIPSJSON': os.path.join(AB, 'clips.json')}, capture_output=True, text=True)
        bad = [l for l in o.stderr.splitlines() if 'failed' in l or 'Error' in l]
        print(o.stdout.strip()[-400:], '| chunk build errors:', bad or 'none', '| warnings:', [l for l in o.stderr.splitlines() if 'WARN' in l.upper()][:3])


def cmd_check(a):
    T = jload(timing_file()); meta = jload(os.path.join(AUD, 'clips.json')); bad = []
    err = lambda s: (bad.append(s), print('  FAIL', s))
    for c in T['slots']:
        m = meta.get(c['id'], {}); L = c['end'] - c['start']; plan = m.get('plan')
        print(f"  {c['id']} slot {c['start']:.3f}-{c['end']:.3f} ({L:.2f} s, plan {plan}) footage {m.get('offset', 0):.2f}+{m.get('dur')} · {c['length_from']}")
        inside = [w['w'] for w in T['words'] if w['e'] > c['start'] + .02 and w['s'] < c['end'] - .02]
        if inside: err(f"{c['id']}: VO words inside the slot: {inside[:5]}")
        if c['id'] in IDS:
            fd = os.path.join(CL, c['id']); n = len([x for x in os.listdir(fd) if x.endswith('.jpg')]) if os.path.isdir(fd) else 0
            print(f"     frames {n} (expected {round((m.get('dur') or 0) * FPS)})" + ('' if n else '  -> PLACEHOLDER in the picture'))
            if n and m.get('dur') and abs(n - round(m['dur'] * FPS)) > 1: err(f"{c['id']}: {n} frames, expected {round(m['dur'] * FPS)}")
            q = m.get('cues') or []
            if m.get('quote') and ' '.join(x[1] for x in q).split() != m['quote'].split(): err(f"{c['id']}: cues do not spell the quote")
            for k, (t0, line) in enumerate(q):
                if len(line) > MAX: err(f"{c['id']}: cue longer than {MAX}: {line!r}")
                if not 0 <= t0 <= (m.get('dur') or 99) or (k and t0 <= q[k - 1][0]): err(f"{c['id']}: cue time {t0}")
    print('check:', 'OK' if not bad else f'{len(bad)} problem(s)'); return not bad


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('--work')
    sp = ap.add_subparsers(dest='cmd'); common = argparse.ArgumentParser(add_help=False); common.add_argument('--work', default=argparse.SUPPRESS)
    p = sp.add_parser('assemble', parents=[common]); p.add_argument('--name', required=True); p.add_argument('--chunks'); p.add_argument('--fresh', action='store_true')
    p.add_argument('--calm', action='store_true'); p.add_argument('--no-contact', action='store_true'); p.add_argument('--no-preview', action='store_true'); p.add_argument('--root-preview', action='store_true'); p.add_argument('--crf', type=int, default=18)
    p = sp.add_parser('clips', parents=[common]); p.add_argument('dir'); p.add_argument('--name'); p.add_argument('--only'); p.add_argument('--tol', type=float, default=.15)
    p.add_argument('-j', type=int, default=2); p.add_argument('--margin', type=float, default=.8); p.add_argument('--quote', action='append'); p.add_argument('--quotes')
    p.add_argument('--plan', action='store_true'); p.add_argument('--allow-shift', action='store_true'); p.add_argument('--no-assemble', action='store_true'); p.add_argument('--chunks')
    p = sp.add_parser('plan', parents=[common]); p.add_argument('sets', nargs='+'); p.add_argument('--build-check', action='store_true')
    p = sp.add_parser('check', parents=[common])
    a = ap.parse_args(); setup(a.work)
    if a.cmd == 'assemble': cmd_assemble(a)
    elif a.cmd == 'clips': cmd_clips(a)
    elif a.cmd == 'plan': cmd_plan(a)
    elif a.cmd == 'check': sys.exit(0 if cmd_check(a) else 1)
    else: ap.print_help()
