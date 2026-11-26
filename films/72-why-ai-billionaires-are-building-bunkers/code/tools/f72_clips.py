#!/usr/bin/env python3
"""Film 72 "Why AI Billionaires Are Building Bunkers" · clip frames, chunk render, assembly (25.11.). Base: film 73 tools/f73_clips.py.

  python3 tools/f72_clips.py clips [--only C1,C2]   the four interview clips C1 Altman, C2 Harris, C3 Rushkoff, C2b Harris: <ROOT>clips/Cn.mp4 (already cut, <ROOT>clips-geprueft.json)
          -> frames <SCRATCH>/clips/<id>/f00001.jpg ... (1920x1080, 30 fps; frame 1 = the slot start, what F.clipPlate in lib/f72_kit.mjs loads; after the
          last frame the plate holds the last one). The sound is the sound agent's (mix.m4a already carries the clip audio).
  python3 tools/f72_clips.py render [--only c05,c06 | --no-clips | --clips-only] [-j 4] [--scale 1]     the chunk videos c01..c13 (1920x1080, 30 fps, no sound),
          pieces of <= 20 s, resumable (the .done marker holds the frame range + timing sha: a moved chunk is re-rendered), joined to WORK/cNN.mp4.
          --no-clips = only the chunks WITHOUT a clip slot (c01 c02 c04 c06 c08 c09 c10 c11 c13), --clips-only = c03 c05 c07 c12 (slots from <ROOT>audio/slots.json).
  python3 tools/f72_clips.py join [--only c05]
  python3 tools/f72_clips.py assemble --name f72 [--chunks DIR] [--burn] [--no-contact] [--calm]
          checks the chunk videos against the chunk ranges of film.mjs, joins them (stream copy, no second encode), puts the mix (<ROOT>audio/mix.m4a or the scratch
          copy, stream copy) under: FINAL/<name>-master-1080p.mp4; duration / LUFS / true peak; contact sheet -> <ROOT>bild/<name>_kontakt.jpg.
          NOTHING IS BURNED IN (subtitles stay separate: <ROOT>audio/untertitel/subtitles.srt|ass); --burn = the f73 way (ASS in, re-encode CRF 18).
  python3 tools/f72_clips.py split [--name f72] [--size 90000000]   FINAL/<name>-master-1080p.mp4 -> FINAL/parts/<name>-master.partNN.bin (+ sha256 of the whole)
  python3 tools/f72_clips.py teile --urls urls.txt   write verpackung/master-teile.txt (sha256, size, one fal URL per part) after the parts are uploaded
  python3 tools/f72_clips.py check                  chunk files against the timing (no media is written)

Paths: ROOT = $F72ROOT or /mnt/project-files/scenario/film-bunker/ (small files only) · SCRATCH = $F72SCRATCH or /tmp/claude-0/f72: clips/, work/, final/.
No video or audio into the repo.
"""
import argparse, glob, hashlib, json, os, re, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE)
ROOT = (os.environ.get('F72ROOT') or '/mnt/project-files/scenario/film-bunker').rstrip('/') + '/'
SCRATCH = os.environ.get('F72SCRATCH') or '/tmp/claude-0/f72'
PROVISIONAL = os.path.join(FILM, 'data', 'provisional_timing.json')
FPS, PIECE = 30, 600           # 20 s pieces
IDS = ['C1', 'C2', 'C3', 'C2b']
AUDIO_ONLY = set()
WORK = CL = WA = FINAL = STATE = None


def setup(work):
    global WORK, CL, WA, FINAL, STATE
    WORK = work or os.environ.get('F72WORK') or (SCRATCH + '/work')
    CL = (os.environ.get('F72CLIPS') or SCRATCH + '/clips').rstrip('/')
    WA = os.path.join(WORK, 'audio'); FINAL = os.environ.get('F72FINAL') or os.path.join(SCRATCH, 'final'); STATE = os.path.join(WORK, 'state.json')
    for d in (WORK, CL, WA, FINAL): os.makedirs(d, exist_ok=True)

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


def timing_file(provisional_ok=True):
    for f in (os.environ.get('TIMING'), ROOT + 'audio/timing.json'):
        if f and os.path.exists(f): return f
    if provisional_ok and os.path.exists(PROVISIONAL):
        print(f'WARNING: PROVISIONAL timing ({PROVISIONAL}); the real VO timing is {ROOT}audio/timing.json', file=sys.stderr); return PROVISIONAL
    raise SystemExit(f'no timing.json ({ROOT}audio/timing.json; set $TIMING)')
def jload(f): return json.load(open(f))
def jsave(f, o): json.dump(o, open(f, 'w'), indent=1, ensure_ascii=False)


def chunk_ranges(tfile):
    """chunk id -> frame range, from film.mjs (the same ranges the renderer uses), plus the QR windows """
    code = ("import { chunkRanges } from './film.mjs'; import { timing } from './lib/kit.mjs'; "
            f"const T = timing({json.dumps(tfile)}); const R = chunkRanges(T);"
            "console.log('@@' + JSON.stringify({ duration: T.duration, qr: [], qrfade: 0, qrtail: 15,"
            " chunks: Object.values(R).map((r) => ({ id: r.id, a: r.a, b: r.b, fa: Math.round(r.a * 30), fb: Math.round(r.b * 30) })) }));")
    o = subprocess.run(['node', '--input-type=module', '-e', code], cwd=FILM, env={**os.environ, 'TIMING': tfile}, capture_output=True, text=True)
    m = re.search(r'@@(.*)', o.stdout)
    if not m: raise SystemExit('chunk ranges failed:\n' + o.stderr[-1500:])
    return json.loads(m.group(1))


# ---------------------------------------------------------------------------------------------------------------------- render + join the chunks
def slots():
    f = ROOT + 'audio/slots.json'
    return [(c['id'], c['start'], c['end']) for c in jload(f).get('clips', [])] if os.path.exists(f) else []

def clip_chunks(R):
    """ids of the chunks that contain a clip slot (their picture needs the clip frames)"""
    return {c['id'] for c in R['chunks'] for (_, s0, s1) in slots() if s0 < c['b'] and s1 > c['a']}

def cmd_render(a):
    tfile = timing_file(); R = chunk_ranges(tfile); only = set(a.only.split(',')) if a.only else None; jobs = []; CC = clip_chunks(R)
    print('chunks with a clip slot:', ' '.join(sorted(CC)))
    for c in R['chunks']:
        if only and c['id'] not in only: continue
        if a.no_clips and c['id'] in CC: continue
        if a.clips_only and c['id'] not in CC: continue
        n, f = 0, c['fa']
        while f < c['fb']:
            g = min(f + PIECE, c['fb'])
            if c['fb'] - g < 150: g = c['fb']      # no tiny last piece
            jobs.append((c['id'], f, g, n)); n += 1; f = g
    keep = {os.path.join(WORK, f'{c}_p{n:02d}.mp4') for c, _, _, n in jobs}   # stale pieces of a chunk that got shorter
    for c in {j[0] for j in jobs}:
        for p in glob.glob(os.path.join(WORK, f'{c}_p*.mp4')):
            if re.search(r'_p\d+\.mp4$', p) and p not in keep: os.remove(p); os.path.exists(p + '.done') and os.remove(p + '.done')
    T = jload(tfile); CSHA = {c['id']: sha(json.dumps([[w['w'], w['s'], w['e']] for w in T['words'] if c['a'] - 1 <= w['s'] < c['b'] + 1] + [[x.get('id'), x.get('start'), x.get('end')] for x in T.get('clips', [])]))
            for c in R['chunks']}
    for c in R['chunks']:    # a chunk with a clip slot also depends on the clip frames (none = the marked placeholder; new frames = a new render)
        for cid_, s0, s1 in slots():
            if s0 < c['b'] and s1 > c['a']:
                fr = sorted(glob.glob(os.path.join(CL, cid_, 'f*.jpg'))); CSHA[c['id']] += f'{cid_}:{len(fr)}:{os.stat(fr[0]).st_mtime_ns if fr else 0}'
    print(f'{len(jobs)} pieces, timing {tfile}, -j {a.j}'); env = {**os.environ, 'F72CLIPS': CL, 'F72ROOT': ROOT, 'TIMING': tfile}; t0 = time.time()
    def one(j):
        cid, f0, f1, n = j; f = os.path.join(WORK, f'{cid}_p{n:02d}.mp4')
        mark = f'{f0}-{f1} {CSHA[cid]}'      # frame range + sha of the chunk's words / clip slots: a chunk that moved or was re-timed is rendered again
        if os.path.exists(f + '.done') and os.path.exists(f) and open(f + '.done').read() == mark: return j
        if os.path.exists(f + '.done'): os.remove(f + '.done')
        r = subprocess.run(['node', '--expose-gc', 'render.mjs', '--out', f, '--from', f'{f0 / FPS:.6f}', '--to', f'{f1 / FPS:.6f}', '--scale', str(a.scale)],
                           cwd=FILM, env={**env, 'SECS': cid}, capture_output=True, text=True)
        if r.returncode: raise SystemExit(f'piece {cid} {f0}-{f1} failed:\n{r.stderr[-1500:]}')
        open(f + '.done', 'w').write(mark); print(f'  {cid} piece {n} ({f0}-{f1}) done, {time.time() - t0:.0f} s', flush=True); return j
    with ThreadPoolExecutor(a.j) as ex: list(ex.map(one, jobs))
    cmd_join(a)

def cmd_join(a):
    only = set(a.only.split(',')) if a.only else None
    for c in chunk_ranges(timing_file())['chunks']:
        if only and c['id'] not in only: continue
        ps = sorted(p for p in glob.glob(os.path.join(WORK, f"{c['id']}_p*.mp4")) if re.search(r'_p\d+\.mp4$', p))
        if not ps: continue
        miss = [p for p in ps if not os.path.exists(p + '.done')]
        if miss: print(f"{c['id']}: not joined, {len(miss)} piece(s) not finished"); continue
        lst = os.path.join(WORK, f"{c['id']}.list"); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', os.path.join(WORK, f"{c['id']}.mp4")])
        print(f"{c['id']}: {len(ps)} pieces -> {c['id']}.mp4 ({nframes(os.path.join(WORK, c['id'] + '.mp4'))} frames, range {c['fb'] - c['fa']})")


# ---------------------------------------------------------------------------------------------------------------------- assemble
def find_chunk(cid, chunks_dir=None):
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
              f"{d:7.3f} s  starts at frame {pos} (range {c['fa']})")
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
    if p != N: raise SystemExit(f'picture covers {p} frames, the film needs {N}')

def overlay(segs, f0, f1, f, inf=0):
    o = []
    for s in segs:
        if s['f1'] <= f0 or s['f0'] >= f1: o.append(s); continue
        if s['f0'] < f0: o.append({**s, 'f1': f0})
        if s['f1'] > f1: o.append({**s, 'f0': f1, 'inf': s['inf'] + f1 - s['f0']})
    o.append({'f0': f0, 'f1': f1, 'file': f, 'inf': inf}); return sorted(o, key=lambda s: s['f0'])

def picture_graph(segs, tail='null', qr=()):
    """filtergraph: every segment = trim by FRAME NUMBER of its file (exact), joined by the concat filter, frames renumbered 30 fps, the QR chains
    (qr_graph) laid on, then tail (the subtitles). Ends in [pic]."""
    cache, ch, names = {}, [], []
    for k, s in enumerate(sorted(segs, key=lambda s: s['f0'])):
        n = cache.setdefault(s['file'], nframes(s['file'])); n_s = s['f1'] - s['f0']
        t = '' if (s['inf'] == 0 and n_s == n) else f"trim=start_frame={s['inf']}:end_frame={s['inf'] + n_s},"
        ch.append(f"movie='{s['file']}',{t}setpts=PTS-STARTPTS[v{k}]"); names.append(f'[v{k}]')
    g = ';\n'.join(ch) + ';\n' + ''.join(names) + f"concat=n={len(names)}:v=1:a=0,setpts=N/({FPS}*TB)"
    last = 'c0'
    if qr:
        g += f'[c0];\n' + ';\n'.join(qr) + ';\n'
        for k in range(len(qr)):
            g += f'[{last}][q{k}]overlay=0:0:eof_action=pass:format=auto[c{k + 1}];\n'; last = f'c{k + 1}'
        g += f'[{last}]'
    else: g += ','
    g += ('null' if tail == 'null' else tail) + '[pic]\n'
    return g

def qr_check(R):
    """the QR windows: 1 or 2, each ~27 s, the last one off >= tail + fade before the end (the end screen stays clean)"""
    w, d = R['qr'], R['duration']; bad = []
    for k, (a, b) in enumerate(w):
        print(f'  QR {k + 1}: {a:8.3f} - {b:8.3f} s ({b - a:.1f} s, fade {R["qrfade"]} s)')
        if b - a < 20: bad.append(f'QR {k + 1} only {b - a:.1f} s')
    if w and w[-1][1] > d - R['qrtail'] - R['qrfade'] + 1e-3: bad.append(f'QR {len(w)} ends at {w[-1][1]:.2f}, must be off before {d - R["qrtail"]:.2f}')
    for b in bad: print('  FAIL', b)
    if bad: raise SystemExit(1)
    return w

def qr_graph(R):
    """film 59: no QR overlay (owner, 16.11.) -> no chains."""
    return []

def audio_in():
    for d in (SCRATCH + '/audio', WA, ROOT + 'audio'):     # film 72: the sound step leaves mix.m4a in <SCRATCH>/audio/
        for n in ('mix.m4a', 'mix.wav'):      # mix.m4a = the sound agent's delivery master (already -14 LUFS, limited): decoded and encoded once at 320k, no second limiter
            if os.path.exists(os.path.join(d, n)): return os.path.join(d, n)
    raise SystemExit('no mix.wav / mix.m4a in ' + WA)
def subs_in():
    for d in (WA, ROOT + 'audio', ROOT + 'audio/untertitel', ROOT + 'untertitel'):
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
    tfile = timing_file(provisional_ok=False); T = jload(tfile)
    segs, files = check_chunks(chunk_ranges(tfile), chunks_dir)
    st = {'timing_sha': fsha(tfile), 'frames': round(T['duration'] * FPS), 'segments': segs, 'chunks': files, 'patches': 0}
    shutil.copy(tfile, os.path.join(WORK, 'state_timing.json')); save_state(st); return st

# mix.py's own AAC delivery chain: +0.3 dB for the AAC loss, 4x-oversampled limiter at -2 dBFS (about -1.5 dBTP after decoding)
AFILTER = 'volume=0.3dB,aresample=192000,alimiter=limit=0.7943:attack=1:release=50:level=false,aresample=48000'

def cmd_assemble(a):
    tfile = timing_file(provisional_ok=False); T = jload(tfile); N = round(T['duration'] * FPS); st = load_state(); tsha = fsha(tfile)
    R = chunk_ranges(tfile); qrw = qr_check(R)
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
    name = a.name; mix = audio_in(); m = os.path.join(FINAL, f'{name}-master-1080p.mp4'); t0 = time.time()
    if a.burn:   # the f73 way: ASS subtitles burned in, one re-encode of the whole picture (NOT the film 72 default)
        ass = subs_in(); gf = os.path.join(WORK, 'picture.filtergraph'); open(gf, 'w').write(picture_graph(st['segments'], f'subtitles=filename={ass}'))
        print('master:', m, '| audio', mix, '| subtitles BURNED IN', ass)
        afl = [] if mix.endswith('.m4a') else ['-af', AFILTER]
        sh(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-filter_complex_script', gf, '-map', '[pic]', '-map', '0:a'] + afl + [
            '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
            '-movflags', '+faststart', '-shortest', m])
    else:        # film 72: the chunk files (all one x264 CRF 18 run: same SPS/PPS, every piece starts on an IDR) are joined by stream copy, the sound = mix.m4a stream copy. No subtitles.
        if not mix.endswith('.m4a'): raise SystemExit('stream copy needs mix.m4a, got ' + mix)
        lst = os.path.join(WORK, 'master.list'); open(lst, 'w').write(''.join(f"file '{s['file']}'\n" for s in sorted(st['segments'], key=lambda s: s['f0'])))
        print('master:', m, '| audio', mix, '| nothing burned in (stream copy)')
        sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', mix, '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy', '-movflags', '+faststart', '-shortest', m])
    print(f'master done in {time.time() - t0:.0f} s, {os.path.getsize(m) / 1e6:.0f} MB')
    if a.preview:
        pv = os.path.join(FINAL, f'{name}-720p.mp4')
        sh(['ffmpeg', '-v', 'error', '-y', '-i', m, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-b:v', '1000k', '-maxrate', '1250k', '-bufsize', '2500k', '-preset', 'medium',
            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', pv]); print('preview (local only):', pv)
    if not verify(m, T): raise SystemExit('verify FAILED (length / loudness / frame count): the master is NOT good')
    if not a.no_contact:
        os.makedirs(ROOT + 'bild', exist_ok=True); contact(m, ROOT + f'bild/{name}_kontakt.jpg')
    if a.calm: sh(['python3', os.path.join(HERE, 'calm.py'), m, '--scale', '1280:720', '--sub', '170', '--json', os.path.join(FINAL, f'{name}-calm.json')])
    sh(['sha256sum', m])

def cmd_teile(a):
    """verpackung/master-teile.txt (film 73 format) from a file with the fal URLs of the parts (one per line, part00 first)"""
    m = os.path.join(FINAL, f'{a.name}-master-1080p.mp4'); urls = [l.strip() for l in open(a.urls) if l.strip().startswith('http')]
    np_ = len(glob.glob(os.path.join(FINAL, 'parts', f'{a.name}-master.part??.bin')))
    if len(urls) != np_: raise SystemExit(f'{len(urls)} URLs for {np_} parts')
    h = hashlib.sha256()
    with open(m, 'rb') as f:
        for b in iter(lambda: f.read(1 << 24), b''): h.update(b)
    out_ = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'verpackung', 'master-teile.txt'); os.makedirs(os.path.dirname(out_), exist_ok=True)
    open(out_, 'w').write(f'# Master #72 als fal-Teile (cat part00..part{np_ - 1:02d} > {a.name}-master-1080p.mp4)\nsha256 {h.hexdigest()}  {os.path.getsize(m)} Bytes\n' + '\n'.join(urls) + '\n')
    print('written', out_)

def cmd_split(a):
    """the master as fal parts (film 73: `cat part00 .. partNN > master.mp4`), FINAL/parts/<name>-master.partNN.bin; the upload (fal upload_file, one URL per part) is a tool step of the agent"""
    m = os.path.join(FINAL, f'{a.name}-master-1080p.mp4'); pd = os.path.join(FINAL, 'parts'); shutil.rmtree(pd, ignore_errors=True); os.makedirs(pd)
    sh(['split', '-b', str(a.size), '-d', '-a', '2', m, os.path.join(pd, f'{a.name}-master.part')])
    ps = sorted(glob.glob(os.path.join(pd, f'{a.name}-master.part??')))
    for p in ps: os.rename(p, p + '.bin')
    ps = [p + '.bin' for p in ps]; h = hashlib.sha256()
    for p in ps:
        with open(p, 'rb') as f:
            for b in iter(lambda: f.read(1 << 24), b''): h.update(b)
    h2 = hashlib.sha256()
    with open(m, 'rb') as f:
        for b in iter(lambda: f.read(1 << 24), b''): h2.update(b)
    ok = h.hexdigest() == h2.hexdigest()
    print(f'{len(ps)} parts in {pd}, size {os.path.getsize(m)} B, sha256 {h.hexdigest()}, cat of the parts == master: {ok}')
    if not ok: raise SystemExit(1)

def verify(m, T):
    d = dur(m); v, au, _ = probe(m); i, lra, tp = lufs(m)
    ok = abs(d - T['duration']) <= .1 and int(v['nb_frames']) == round(T['duration'] * FPS) and (v['width'], v['height']) == (1920, 1080) and au is not None
    lo = abs(i + 14) <= .5 and tp <= -1
    print(f"verify {m}: duration {d:.3f} s (timing {T['duration']}) {'OK' if ok else 'FAIL'} | {v['width']}x{v['height']} {v['r_frame_rate']} {v['nb_frames']} frames | audio {au['codec_name']} | "
          f"{i:.2f} LUFS, LRA {lra:.1f}, true peak {tp:.2f} dBTP {'OK' if lo else 'CHECK'} | {os.path.getsize(m) / 1e6:.0f} MB")
    return ok and lo



# ---------------------------------------------------------------------------------------------------------------------- footage
# The cut list is <ROOT>clips/schnitt.json (12.11., Whisper fal-ai/whisper + level check, no music bed): per clip the source file, in_s / out_s inside it, the words.
# The slot length is the timing.json window (= dauer there); the tool never changes it. fade = (fade-in s, fade-out length s at the slot end):
#   C3  'There's not efficacy, right? And I make exactly that point ... not infinitely fast.'  in 33.01, only 50-100 ms before the next sentence -> 3-frame fade out
#   C2  'AI models are going to greatly accelerate ... the pipeline will get jammed up.'        in 38.92, 'like' follows within 50 ms           -> 3-frame fade out
#   C5  Venki: 'AI could be very fast at its computational work, but the experimental work ...'  in 336.04, clean pauses both sides (audio only)
SRC = {'C3': 'dwarkesh-a.mp4', 'C2': 'dwarkesh-b.mp4', 'C5': 'venki-ton.mp3'}
CLIPIN = {'C3': (33.01, 0.02, 0.10), 'C2': (38.92, 0.02, 0.10), 'C5': (336.04, 0.03, 0.08)}

def cut_list():
    f = ROOT + 'clips/schnitt.json'
    if not os.path.exists(f): return {}
    return {c['id']: c for c in jload(f).get('clips', [])}

def envelope(wav, n):
    """loudness per 1/30 s (RMS of the mono mix), scaled so the 97th percentile = 1, clamped; exactly n values (one per picture frame of the slot)"""
    import array
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], check=True, capture_output=True).stdout
    a = array.array('h', raw); hop = 48000 // FPS; e = []
    for k in range(n):
        seg = a[k * hop:(k + 1) * hop]
        e.append((sum(x * x for x in seg) / len(seg)) ** .5 / 32768 if len(seg) else 0)
    ref = sorted(e)[int(.97 * (len(e) - 1))] or 1
    return [round(min(1, v / ref), 3) for v in e]

def cmd_clips(a):
    """frames from the pre-cut clips <ROOT>clips/Cn.mp4 (clips-geprueft.json), 30 fps, 1920x1080, frame 1 = slot start (what lib/f72_kit.mjs clipPlate / prepareClipFrames load from
    <F72CLIPS>/<id>/f00001.jpg; after the last frame the plate holds it). The plate shows the top 5/6 of the frame (CLIP_CROP; C2 / C2b crop 1 = the whole frame, so the MODERN | WISDOM bug stays).
    A source that is not 16:9 is fitted into 1920x1080 with black bars (no stretching). The slot length comes from timing.json = the real clip length: the frame count must match it."""
    meta = {}
    try: j = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8')); meta = {c['id']: c for c in (j if isinstance(j, list) else j['clips'])}
    except Exception as e: print('clips-geprueft.json:', e)
    SRC = ROOT + 'clips/'; slot = {i: e - s for i, s, e in slots()}; bad = []
    for cid in IDS:
        if a.only and cid not in a.only.split(','): continue
        src = SRC + cid + '.mp4'
        if not os.path.exists(src): print(cid, 'missing', src); bad.append(cid); continue
        v, au, d = probe(src); d_ = os.path.join(CL, cid); os.makedirs(d_, exist_ok=True)
        for f in glob.glob(os.path.join(d_, 'f*.jpg')): os.remove(f)
        vf = 'fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1'
        sh(['ffmpeg', '-v', 'error', '-y', '-i', src, '-an', '-vf', vf, '-q:v', '3', os.path.join(d_, 'f%05d.jpg')])
        n = len(glob.glob(os.path.join(d_, 'f*.jpg')))
        if cid in slot and abs(n - round(slot[cid] * FPS)) > 2: print(f'  WARNING {cid}: {n} frames, the slot in slots.json is {slot[cid]:.2f} s ({round(slot[cid] * FPS)} frames): run the sound step (build_vo) first')
        print(f"{cid} {v['width']}x{v['height']} {v['r_frame_rate']} {d:.3f} s (checked {meta.get(cid, {}).get('duration_s')}, slot in slots.json {slot.get(cid)}) -> {n} frames in {d_}" + ('' if au else '  [NO AUDIO STREAM]'))
    if bad: raise SystemExit('missing clips: ' + ' '.join(bad))

def cmd_check(a):
    tfile = timing_file(); R = chunk_ranges(tfile); check_chunks(R, None)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('--work')
    sp = ap.add_subparsers(dest='cmd'); common = argparse.ArgumentParser(add_help=False); common.add_argument('--work', default=argparse.SUPPRESS)
    p = sp.add_parser('render', parents=[common]); p.add_argument('--only'); p.add_argument('-j', type=int, default=4); p.add_argument('--scale', type=float, default=1); p.add_argument('--no-clips', action='store_true'); p.add_argument('--clips-only', action='store_true')
    p = sp.add_parser('join', parents=[common]); p.add_argument('--only')
    p = sp.add_parser('assemble', parents=[common]); p.add_argument('--name', required=True); p.add_argument('--chunks'); p.add_argument('--fresh', action='store_true')
    p.add_argument('--burn', action='store_true'); p.add_argument('--calm', action='store_true'); p.add_argument('--no-contact', action='store_true'); p.add_argument('--preview', action='store_true'); p.add_argument('--crf', type=int, default=18)
    p = sp.add_parser('clips', parents=[common]); p.add_argument('--only')
    p = sp.add_parser('teile', parents=[common]); p.add_argument('--name', default='f72'); p.add_argument('--urls', required=True)
    p = sp.add_parser('split', parents=[common]); p.add_argument('--name', default='f72'); p.add_argument('--size', type=int, default=90000000)
    p = sp.add_parser('check', parents=[common])
    a = ap.parse_args(); setup(a.work)
    if a.cmd == 'render': cmd_render(a)
    elif a.cmd == 'join': cmd_join(a)
    elif a.cmd == 'assemble': cmd_assemble(a)
    elif a.cmd == 'clips': cmd_clips(a)
    elif a.cmd == 'split': cmd_split(a)
    elif a.cmd == 'teile': cmd_teile(a)
    elif a.cmd == 'check': cmd_check(a)
    else: ap.print_help()
