#!/usr/bin/env python3
"""Film 25 "The Last Human Job" · render, assembly and the interview footage (2026-11-10). Pattern: films/24-animals/tools/f24_clips.py.

  python3 tools/f25_clips.py render [--only c05,c06] [-j 4] [--scale 1]      the chunk videos c01..c11 (1920x1080, 30 fps, no sound) from the
          real timing: pieces of <= 20 s (SECS=cNN node --expose-gc render.mjs), -j in parallel, resumable (<piece>.done), joined to WORK/cNN.mp4.
  python3 tools/f25_clips.py join [--only c05]                               only joins WORK/cNN_pNN.mp4 into WORK/cNN.mp4
  python3 tools/f25_clips.py assemble --name fassung-1 [--chunks DIR] [--fresh] [--calm] [--no-contact] [--preview] [--crf 18]
          The chunk videos are checked (1080p, 30 fps, h264, frame count of every chunk against the chunk ranges of film.mjs, no gap or overlap,
          total = timing duration), joined, the mix (WORK/audio/mix.wav, -14 LUFS) goes under, the subtitles (ASS) are burned in:
          master 1080p H.264 CRF 18 + AAC 192k (through the 4x-oversampled -2 dBFS limiter of mix.py, so the true peak stays <= -1 dB) in
          WORK/final/<name>-master-1080p.mp4. Then the checks: duration, LUFS / true peak, contact sheet (1 frame per 5 s, small jpg) to
          <ROOT>bild/<name>_kontakt.jpg, optionally calm.py (--calm). --preview also makes a 720p copy (local only; never put videos in the data root).
  python3 tools/f25_clips.py clips <dir with K1-roh.mp4, K2-roh.mp4, K3-ganz.mp4 (or K1.mp4 ...)> --name fassung-2
          [--only K1,K2] [--in K3=12.5 --dur K3=10.0] [--k3 clip|card] [--tol 0.15] [-j 2] [--plan] [--allow-shift] [--no-assemble]
          [--quote K1="spoken words"] [--quotes quotes.json] [--whisper] [--words K1=whisper.json]
      THE FOOTAGE COMMAND (one command when the clips arrive). Files that are missing stay placeholder / silent; give any subset.
        Names looked up in <dir>: <id>-roh.mp4, <id>-ganz.mp4, <id>.mp4 (and <id>.wav next to it wins for the sound).
        1. footage -> <clips>/<id>/f00001.jpg ... (1680x945, 30 fps = lib/f25_kit.mjs CLIP_RECT, what clipPlate loads: $F25CLIPS/<id>/f%05d.jpg),
           sound -> <clips>/<id>.wav (the clip's own sound). The window inside the file is "in" (seconds) + "plan" seconds, from audio/clips.json:
           K1 in 3.0 (file starts at 1672 s of the source, window 1675.0-1688.2 s, 13.2 s), K2 in 2.3 (file from 3033 s, window 3035.3-3045.0 s, 9.7 s).
           K3: window not fixed yet: give --in K3=<s> --dur K3=<s> (default: the whole file from 0, plan 12.0 s).
           A real length within --tol seconds (default 0.15) of the plan is snapped to the plan (the timing then does NOT move and only the
           clip windows are re-rendered). Real lengths go into audio/clips.json ("dur").
        2. build_vo.py, mix.py, subs.py again (in a work copy of audio/; the repo is only touched at the end). K1/K2 subtitles are re-timed on the
           clip sound: --words K1=file (Whisper output, e.g. fal-ai/whisper chunk_level=word, saved as json) > --whisper (calls fal-ai/whisper
           with $FAL_KEY) > forced alignment of the quote (pocketsphinx; the quote is audio/clips.json "text"). K3: cues only with --quote K3=...
        3. render pieces: ONLY the frames that show a clip (the plate grows over the lead-in sentence 3.4-5.8 s before the slot: --lead 7 s before
           the slot ... 1.5 s after it), pieces <= 20 s, -j in parallel. They replace the same frames of the chunk videos (state in WORK/state.json).
           A length change of a slot moves the whole timeline after it: then everything from the start of that chunk to the end must be rendered
           again; the command prints "TIMING SHIFT" and stops unless --allow-shift is given. --plan only prints.
        K3 (Gates) is decided as the QUOTE CARD (QUOTES.gates in the same plate; audio/clips.json K3 "card": true, slot silent, no subtitle, c10/c11 are
        rendered with F25_K3=card, also by `render`). A K3 file in the dir is then ignored; --k3 clip switches back to footage (give --in/--dur K3=...).
        4. repo + data root get the new numbers (audio/clips.json, audio/timing.json, <ROOT>audio/timing.json, subtitles, mix) and assemble runs again.
  python3 tools/f25_clips.py plan K1=13.2 K3=10.0 [--build-check]    what-if without media: set slot lengths, show what would move
  python3 tools/f25_clips.py check                                    audio/clips.json against audio/timing.json and the footage in <clips>

Paths: ROOT = $F25ROOT or /mnt/project-files/scenario/film-last-human-job/ (timing.json, subtitles, contact sheet: small files only);
WORK = --work / $F25WORK / <session scratchpad>/f25/final (chunks WORK/cNN.mp4 or --chunks, WORK/audio = mix.wav + subtitles.ass, WORK/final the
masters, WORK/clips the footage, WORK/patches the re-rendered pieces). The sound work needs the VO takes (vo-*.mp3/json, 31 takes) in
$F25VO (default <scratchpad>/f25/audio/work) and music/ sfx/ in $F25ASSETS (default <scratchpad>/f25/audio); they are not in the repo.
"""
import argparse, glob, hashlib, json, os, re, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); AUD = os.path.join(FILM, 'audio')
ROOT = (os.environ.get('F25ROOT') or '/mnt/project-files/scenario/film-last-human-job').rstrip('/') + '/'
SCRATCH = '/tmp/claude-0/-home-user/e3b227b8-f27e-57b1-9ba9-fc035194c59d/scratchpad/f25'
FPS, PIECE = 30, 600           # 20 s pieces
IDS = ['K1', 'K2', 'K3']
SRC_NAMES = ('{id}-roh.mp4', '{id}-ganz.mp4', '{id}.mp4', '{id}.mov', '{id}.mkv')
WORK = CL = PCS = WA = SUBS = FINAL = AB = STATE = VO = ASSETS = None


def setup(work):
    global WORK, CL, PCS, WA, SUBS, FINAL, AB, STATE, VO, ASSETS
    WORK = work or os.environ.get('F25WORK') or (SCRATCH + '/final' if os.path.isdir(SCRATCH) else '/tmp/f25work')
    CL = (os.environ.get('F25CLIPS') or os.path.join(WORK, 'clips')).rstrip('/')
    PCS, WA, SUBS, FINAL, AB = (os.path.join(WORK, d) for d in ('patches', 'audio', 'subs', 'final', 'audio_build'))
    STATE = os.path.join(WORK, 'state.json')
    VO = (os.environ.get('F25VO') or os.path.join(SCRATCH, 'audio', 'work')).rstrip('/')
    ASSETS = (os.environ.get('F25ASSETS') or os.path.join(SCRATCH, 'audio')).rstrip('/')
    for d in (CL, PCS, WA, SUBS, FINAL): os.makedirs(d, exist_ok=True)
    # the audio agent's finished mix is the starting point for `assemble` when this work dir has none yet (copied, never linked: mix.py overwrites in place)
    for f in ('mix.wav', 'mix.m4a'):
        src = os.path.join(ASSETS, f)
        if not os.path.exists(os.path.join(WA, f)) and os.path.exists(src): shutil.copy(src, os.path.join(WA, f))
    src = os.path.join(AUD, 'subtitles.ass')
    if not os.path.exists(os.path.join(WA, 'subtitles.ass')) and os.path.exists(src): shutil.copy(src, os.path.join(WA, 'subtitles.ass'))


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


# ---------------------------------------------------------------------------------------------------------------------- render + join the chunks
def cmd_render(a):
    tfile = timing_file(); R = chunk_ranges(tfile); only = set(a.only.split(',')) if a.only else None; jobs = []
    for c in R['chunks']:
        if only and c['id'] not in only: continue
        n, f = 0, c['fa']
        while f < c['fb']:
            g = min(f + PIECE, c['fb'])
            if c['fb'] - g < 150: g = c['fb']      # no tiny last piece
            jobs.append((c['id'], f, g, n)); n += 1; f = g
    print(f'{len(jobs)} pieces, timing {tfile}, -j {a.j}'); env = {**os.environ, 'F25CLIPS': CL, 'F25ROOT': ROOT, 'TIMING': tfile}; t0 = time.time()
    if jload(os.path.join(AUD, 'clips.json')).get('K3', {}).get('card') and 'F25_K3' not in env: env['F25_K3'] = 'card'   # Gates = quote card (decision 10.11.)
    def one(j):
        cid, f0, f1, n = j; f = os.path.join(WORK, f'{cid}_p{n:02d}.mp4')
        if os.path.exists(f + '.done'): return j
        r = subprocess.run(['node', '--expose-gc', 'render.mjs', '--out', f, '--from', f'{f0 / FPS:.6f}', '--to', f'{f1 / FPS:.6f}', '--scale', str(a.scale)],
                           cwd=FILM, env={**env, 'SECS': cid}, capture_output=True, text=True)
        if r.returncode: raise SystemExit(f'piece {cid} {f0}-{f1} failed:\n{r.stderr[-1500:]}')
        open(f + '.done', 'w').close(); print(f'  {cid} piece {n} ({f0}-{f1}) done, {time.time() - t0:.0f} s', flush=True); return j
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

def picture_graph(segs, tail='null'):
    """filtergraph: every segment = trim by FRAME NUMBER of its file (exact), joined by the concat filter, frames renumbered 30 fps. Ends in [pic]."""
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
    for d in (SUBS, WA, ROOT + 'audio', AUD):
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

# mix.py's own AAC delivery chain: +0.3 dB for the AAC loss, 4x-oversampled limiter at -2 dBFS (about -1.5 dBTP after decoding)
AFILTER = 'volume=0.3dB,aresample=192000,alimiter=limit=0.7943:attack=1:release=50:level=false,aresample=48000'

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
    sh(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-filter_complex_script', gf, '-map', '[pic]', '-map', '0:a', '-af', AFILTER,
        '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
        '-movflags', '+faststart', '-shortest', m])
    print(f'master done in {time.time() - t0:.0f} s, {os.path.getsize(m) / 1e6:.0f} MB')
    if a.preview:
        pv = os.path.join(FINAL, f'{name}-720p.mp4')
        sh(['ffmpeg', '-v', 'error', '-y', '-i', m, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '27', '-maxrate', '1700k', '-bufsize', '3400k', '-preset', 'medium',
            '-tune', 'grain', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', pv]); print('preview (local only):', pv)
    verify(m, T)
    if not a.no_contact:
        os.makedirs(ROOT + 'bild', exist_ok=True); contact(m, ROOT + f'bild/{name}_kontakt.jpg')
    if a.calm: sh(['python3', os.path.join(HERE, 'calm.py'), m, '--scale', '1280:720', '--sub', '170', '--json', os.path.join(FINAL, f'{name}-calm.json')])

def verify(m, T):
    d = dur(m); v, au, _ = probe(m); i, lra, tp = lufs(m)
    ok = abs(d - T['duration']) <= .1
    print(f"verify {m}: duration {d:.3f} s (timing {T['duration']}) {'OK' if ok else 'FAIL'} | {v['width']}x{v['height']} {v['r_frame_rate']} {v['nb_frames']} frames | audio {au['codec_name']} | "
          f"{i:.2f} LUFS, LRA {lra:.1f}, true peak {tp:.2f} dBTP {'OK' if abs(i + 14) <= .5 and tp <= -1 else 'CHECK'} | {os.path.getsize(m) / 1e6:.0f} MB")


# ---------------------------------------------------------------------------------------------------------------------- sound work copy
def work_audio(meta):
    """AB = work copy of audio/: symlinks to everything incl. the VO takes, own clips.json (meta) and timing.json (written by build_vo).
    WA gets music/ and sfx/ links (mix.py takes its assets from the wav dir when it has a music/ folder)."""
    if not os.path.isdir(VO): raise SystemExit(f'VO takes not found: {VO} (set F25VO; vo-*.mp3 + vo-*.json of the 31 takes)')
    shutil.rmtree(AB, ignore_errors=True); os.makedirs(AB)
    for n in os.listdir(AUD):
        if n not in ('clips.json', 'timing.json', 'slots.json'): os.symlink(os.path.join(AUD, n), os.path.join(AB, n))
    for n in os.listdir(VO):
        if re.match(r'vo-.*\.(mp3|json)$', n) and not os.path.exists(os.path.join(AB, n)): os.symlink(os.path.join(VO, n), os.path.join(AB, n))
    for d in ('music', 'sfx'):
        link = os.path.join(WA, d)
        if os.path.islink(link): os.remove(link)
        if not os.path.exists(link) and os.path.isdir(os.path.join(ASSETS, d)): os.symlink(os.path.join(ASSETS, d), link)
    jsave(os.path.join(AB, 'clips.json'), meta)
def tools_env(): return {**os.environ, 'F25CLIPS': CL, 'F25ROOT': ROOT, 'F25CLIPSJSON': os.path.join(AB, 'clips.json'), 'TIMING': os.path.join(AB, 'timing.json'), 'VO_BOOST': '2'}
def build_sound(full=True):
    env = tools_env(); wav = WA if full else os.path.join(WORK, 'audio_whatif'); os.makedirs(wav, exist_ok=True)
    sh(['python3', os.path.join(AUD, 'build_vo.py'), AB, wav], env=env)
    if full:
        sh(['python3', os.path.join(AUD, 'mix.py'), AB, WA], env=env); sh(['python3', os.path.join(AUD, 'subs.py'), AB, SUBS], env=env)

def publish_audio():
    """repo + data root get the new numbers, only after the pictures are done"""
    for f in ('clips.json', 'timing.json', 'slots.json'): shutil.copy(os.path.join(AB, f), os.path.join(AUD, f))
    os.makedirs(ROOT + 'audio', exist_ok=True)
    shutil.copy(os.path.join(AB, 'timing.json'), ROOT + 'audio/timing.json')
    for f in ('subtitles.ass', 'subtitles.srt'): shutil.copy(os.path.join(SUBS, f), ROOT + 'audio/' + f); shutil.copy(os.path.join(SUBS, f), os.path.join(WA, f)); shutil.copy(os.path.join(SUBS, f), os.path.join(AUD, f))
    if os.path.exists(os.path.join(WA, 'mix.m4a')): shutil.copy(os.path.join(WA, 'mix.m4a'), ROOT + 'audio/mix.m4a')   # the delivery mix (16 MB AAC)


# ---------------------------------------------------------------------------------------------------------------------- footage
MAX = 34   # subtitle line length (audio/subs.py)
FN = set('a an the to of and or that in on for was is it its by with as at from than but if we our'.split())
FILLER = {'uh', 'um', 'uhm', 'er', 'erm', 'hmm'}
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
def align(wav, text, d):
    """forced alignment of the checked wording on the clip sound (pocketsphinx); None if it does not work"""
    try: from pocketsphinx import Decoder, get_model_path
    except ImportError: return None
    raw = os.path.join(CL, 'align.raw')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-t', str(d), '-ac', '1', '-ar', '16000', '-f', 's16le', raw])
    dic = {l.split()[0] for l in open(get_model_path() + '/en-us/cmudict-en-us.dict')}
    words = text.split(); seq, own = [], []
    ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(); TENS = '- - twenty thirty forty fifty sixty seventy eighty ninety'.split()
    spoken = lambda w: re.sub(r'\d+', lambda m: (ONES[int(m.group())] if int(m.group()) < 20 else TENS[int(m.group()) // 10] + ('' if int(m.group()) % 10 == 0 else ' ' + ONES[int(m.group()) % 10])) if int(m.group()) < 100 else '', w)   # 22 -> twenty two
    for k, w in enumerate(words):
        for t in [t for t in re.sub(r"[^a-z' -]", '', spoken(w).lower()).replace('-', ' ').split() if t.strip("'")]: seq.append(t if t in dic else 'the'); own.append(k)
    dec = Decoder(loglevel='FATAL'); dec.set_align_text(' '.join(seq)); dec.start_utt(); dec.process_raw(open(raw, 'rb').read(), full_utt=True); dec.end_utt()
    seg = [(x.start_frame / 100, (x.end_frame + 1) / 100) for x in (dec.seg() or []) if x.word not in ('<sil>', '</s>', '<s>') and not x.word.startswith('++')]
    if len(seg) != len(seq): return None
    o = [[w, None, None] for w in words]
    for (x, y), k in zip(seg, own):
        if o[k][1] is None: o[k][1] = x
        o[k][2] = y
    return o
def whisper_words(obj):
    """fal-ai/whisper output (chunk_level=word: chunks [{text, timestamp:[s,e]}]) or a plain list [{word|text|w, start, end}] -> [[word, s, e]], fillers dropped"""
    ch = obj.get('chunks') if isinstance(obj, dict) else obj
    o = []
    for c in ch or []:
        w = (c.get('text') or c.get('word') or c.get('w') or '').strip(); ts = c.get('timestamp') or [c.get('start'), c.get('end')]
        if not w or ts[0] is None: continue
        if re.sub(r'[^a-z]', '', w.lower()) in FILLER: continue
        o.append([w, float(ts[0]), float(ts[1] if ts[1] is not None else ts[0] + .3)])
    return o
def whisper_live(wav):
    """calls fal-ai/whisper over the queue API (needs $FAL_KEY); returns the raw result. Not exercised in the first session (no key there):
    if it fails, run fal-ai/whisper (chunk_level=word) any other way and give the json with --words K1=file"""
    import base64, urllib.request
    key = os.environ.get('FAL_KEY') or sys.exit('--whisper needs $FAL_KEY (or give --words K1=whisper.json from a fal run)')
    mp3 = os.path.join(CL, 'whisper_in.mp3'); sh(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '16000', '-b:a', '64k', mp3])
    body = json.dumps({'audio_url': 'data:audio/mpeg;base64,' + base64.b64encode(open(mp3, 'rb').read()).decode(), 'task': 'transcribe', 'language': 'en', 'chunk_level': 'word'}).encode()
    hd = {'Authorization': 'Key ' + key, 'Content-Type': 'application/json'}
    rq = json.load(urllib.request.urlopen(urllib.request.Request('https://queue.fal.run/fal-ai/whisper', body, hd), timeout=120))
    for _ in range(90):
        st = json.load(urllib.request.urlopen(urllib.request.Request(rq['status_url'], headers=hd), timeout=60))
        if st.get('status') == 'COMPLETED': return json.load(urllib.request.urlopen(urllib.request.Request(rq['response_url'], headers=hd), timeout=60))
        time.sleep(2)
    raise SystemExit('whisper: timeout')
def silences(wav, d):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-t', str(d), '-af', 'silencedetect=n=-38dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', o)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', o)]
    return list(zip(st, en + [d] * (len(st) - len(en))))
def words_to_window(W, text, win_in, wav, d):
    """Whisper words (seconds from the start of the RAW file) -> [[word, s, e]] in seconds from the first footage frame (= raw time - in).
    1. The wording is the checked quote (text): its words are matched to the Whisper words (difflib); unmatched quote words ("going to" for "gonna")
       get evenly spread times between their matched neighbours; Whisper words that are not in the quote (a lead-in, a speaker's "Okay.") are dropped.
    2. Whisper times are early after pauses and at the start of a file (a pause is absorbed by a word): a word whose own span contains a pause in its
       first 45 % (or whose start lies in a pause) starts when that pause ends (silencedetect on the clip sound). Cue times never go below 0."""
    import difflib
    norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
    if text:
        q = text.split(); sm = difflib.SequenceMatcher(None, [norm(w[0]) for w in W], [norm(w) for w in q], autojunk=False)
        T = [None] * len(q)
        for i, j, n in sm.get_matching_blocks():
            for k in range(n): T[j + k] = (W[i + k][1], W[i + k][2])
        for k in range(len(q)):   # fill the gaps
            if T[k] is None:
                a0 = k
                while T[a0 - 1] is None and a0 > 0: a0 -= 1
                b0 = k
                while b0 < len(q) and T[b0] is None: b0 += 1
                lo = T[a0 - 1][1] if a0 > 0 and T[a0 - 1] else (T[b0][0] - .6 if b0 < len(q) else 0.0); hi = T[b0][0] if b0 < len(q) else lo + .6
                n = b0 - a0; T[k] = (lo + (hi - lo) * (k - a0) / n, lo + (hi - lo) * (k - a0 + 1) / n)
        W = [[q[k], T[k][0], T[k][1]] for k in range(len(q))]
    sil = silences(wav, d); out, prev = [], 0.0
    for w, s, e in W:
        s, e = max(0.0, s - win_in), max(0.0, e - win_in)
        for a, b in sil:   # a pause inside the early part of the word's own span (or the start inside a pause): the word really begins when the pause ends
            if (a - .02 <= s < b) or (s <= a and b <= e + .05 and (a - s) <= .45 * max(e - s, .01)): s = max(s, b); break
        s = max(s, prev); e = max(e, s + .1)
        if s < d: out.append([w, s, e]); prev = s + .05
    return out
def make_cues(cid, m, words_file=None, live=False):
    """cues = [[seconds from the first footage frame, line]]; sets cue_status/cue_source. A clip without wording (K3) gets none.
    Order: --words file > audio/whisper/<id>.json (the Whisper run of the raw file the repo was built with, same file size) > --whisper (live) > forced alignment of the quote"""
    wav = os.path.join(CL, f'{cid}.wav')
    if not os.path.exists(wav): return
    Wd, how, text = None, None, m.get('quote') or (m.get('text') if cid != 'K3' else None)
    stored = os.path.join(AUD, 'whisper', f'{cid}.json')
    if not words_file and not live and os.path.exists(stored) and jload(stored).get('_file_size') == m.get('src_size'): words_file = stored
    if words_file: Wd, how = words_to_window(whisper_words(jload(words_file)), text, float(m.get('in') or 0), wav, m['dur']), f'whisper json {os.path.basename(words_file)}'
    elif live: Wd, how = words_to_window(whisper_words(whisper_live(wav)), None, 0.0, wav, m['dur']), 'fal-ai/whisper (window audio)'   # live: the window audio is sent, times are already window times
    elif text:
        Wd = align(wav, text, m['dur']); how = 'pocketsphinx forced alignment of the quote (unreliable when other speech is in the window)'
        if Wd is None: x, y = speech_span(wav, m['dur']); Wd = even_words(text, x, y); how = f'even over the speech {x:.2f}-{y:.2f} s (alignment failed)'
    if not Wd: print(cid, 'no wording given: no subtitle cues'); return
    m['cues'] = cues_from_words(Wd); m['cue_source'] = how; m['cue_status'] = 'whisper' if 'whisper' in how else 'aligned'; m['cue_timing'] = 'aligned to the clip sound'
    print(cid, 'cues:', how); [print('  ', c) for c in m['cues']]
    if 'live' in how or 'fal-ai' in how: print('  (Whisper wording shown above: check it against the quote before publishing)')

def find_src(src, cid):
    for pat in SRC_NAMES:
        f = os.path.join(src, pat.format(id=cid))
        if os.path.exists(f): return f

def prepare(a, meta, only):
    """footage + sound into CL; returns the ids that were (re)made"""
    src, tol, done = a.dir, a.tol, []
    kin = dict(x.split('=', 1) for x in a.in_ or []); kdur = dict(x.split('=', 1) for x in a.dur or []); kwords = dict(x.split('=', 1) for x in a.words or [])
    for cid in IDS:
        if only and cid not in only: continue
        m = meta.setdefault(cid, {})
        if cid == 'K3' and a.k3 is None and m.get('card'): print(cid, 'stays the quote card (use --k3 clip to use footage)'); continue
        if cid == 'K3' and a.k3 == 'card':   # the quote card variant: no footage, no sound, no subtitle; the slot keeps the planned length
            m.update(card=True, dur=None, cues=None, cue_status='card (QUOTES.gates)'); shutil.rmtree(os.path.join(CL, cid), ignore_errors=True)
            if os.path.exists(os.path.join(CL, cid + '.wav')): os.remove(os.path.join(CL, cid + '.wav'))
            print(cid, 'card variant: no footage'); done.append(cid); continue
        f = find_src(src, cid)
        if not f: print(cid, 'not given: stays placeholder'); continue
        m.pop('card', None)
        if cid in kin: m['in'] = float(kin[cid])
        v, au, vd = probe(f); tin = float(m.get('in') or 0)
        plan = float(kdur[cid]) if cid in kdur else m.get('plan') or (vd - tin)
        if cid in kdur: m['plan'] = plan
        L = vd - tin
        if L < plan - tol: print(f'  note {cid}: the file has only {L:.2f} s after in={tin} but the plan is {plan} s')
        d = plan if abs(L - plan) <= tol or L > plan else round(L * FPS) / FPS     # longer files are cut to the plan window
        fit = m.get('fit') or 'cover'; wav_src = os.path.join(src, f'{cid}.wav')
        sig = sha(os.path.getsize(f), os.stat(f).st_mtime_ns, tin, fit, m.get('crop'), d, os.path.exists(wav_src) and os.stat(wav_src).st_mtime_ns)
        fd = os.path.join(CL, cid); n = len([x for x in os.listdir(fd) if x.endswith('.jpg')]) if os.path.isdir(fd) else 0
        has_snd = au is not None or os.path.exists(wav_src)
        if m.get('src_sig') == sig and n and (os.path.exists(os.path.join(CL, f'{cid}.wav')) or not has_snd): print(cid, 'footage unchanged (frames present)')
        else:
            shutil.rmtree(fd, ignore_errors=True); os.makedirs(fd)
            sc = ('scale=1680:945:force_original_aspect_ratio=decrease' if fit == 'contain' else 'scale=1680:945:force_original_aspect_ratio=increase,crop=1680:945')
            sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(tin), '-i', f, '-t', f'{d:.3f}', '-vf', f"fps={FPS},{'crop=' + m['crop'] + ',' if m.get('crop') else ''}{sc}", '-q:v', '2', os.path.join(fd, 'f%05d.jpg')])
            n = len([x for x in os.listdir(fd) if x.endswith('.jpg')])
            if has_snd:
                sh(['ffmpeg', '-v', 'error', '-y', '-ss', str(tin), '-i', wav_src if os.path.exists(wav_src) else f, '-t', f'{d:.3f}', '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', os.path.join(CL, f'{cid}.wav')])
            elif os.path.exists(os.path.join(CL, f'{cid}.wav')): os.remove(os.path.join(CL, f'{cid}.wav'))
        m.update(dur=round(d, 3), frames=n, real=round(L, 3), src_sig=sig, src=os.path.basename(f), src_size=os.path.getsize(f))
        print(f"{cid}: footage {L:.2f} s after in={tin}, plan {plan}, slot footage {d:.3f} s{' (snapped to the plan)' if d == plan and abs(L - plan) > 1e-3 else ''}, {n} frames, {'sound' if os.path.exists(os.path.join(CL, cid + '.wav')) else 'NO SOUND'}")
        if au is None and not os.path.exists(wav_src): print(f'  note {cid}: the file has no sound and there is no {cid}.wav')
        make_cues(cid, m, kwords.get(cid), a.whisper and cid in ('K1', 'K2')); done.append(cid)
    return done


# ---------------------------------------------------------------------------------------------------------------------- what moves, what to render
def slot_diff(old, new):
    """slots whose length changed: [(start in the old timeline, id, change)], sorted"""
    os_, ns = {s['id']: s for s in old['slots']}, {s['id']: s for s in new['slots']}
    ch = [(os_[i]['start'], i, ns[i]['end'] - ns[i]['start'] - (os_[i]['end'] - os_[i]['start'])) for i in os_ if i in ns and abs((ns[i]['end'] - ns[i]['start']) - (os_[i]['end'] - os_[i]['start'])) > 5e-4]
    return sorted(ch)

def stamp(tfile, cjson, extra=''):
    h = [open(tfile, 'rb').read(), open(cjson, 'rb').read(), extra.encode()]
    for d in ('scenes', 'lib'):
        for f in sorted(os.listdir(os.path.join(FILM, d))): h.append(open(os.path.join(FILM, d, f), 'rb').read())
    for f in ('film.mjs', 'engine.mjs', 'render.mjs'): h.append(open(os.path.join(FILM, f), 'rb').read())
    return sha(*h)

def dirty_ranges(old, new, R_old, windows, lead, tail):
    """-> (list of [f0, f1) to render, shift info or None). windows = clip slots (start, end); the plate grows over the lead-in before the slot"""
    N = round(new['duration'] * FPS); rng = []; shift = None
    ch = slot_diff(old, new)
    if ch or abs(old['duration'] - new['duration']) > 5e-4:
        t0 = ch[0][0] if ch else min(old['duration'], new['duration'])
        c = next(c for c in R_old['chunks'] if c['a'] <= t0 < c['b']) if ch else R_old['chunks'][-1]
        shift = {'slots': [(i, round(d, 3)) for _, i, d in ch], 'from_chunk': c['id'], 'from_frame': c['fa'], 'frames': N - c['fa']}
        rng.append([c['fa'], N])   # camera paths run between keyframes in the whole plan sequence of the chunk: from its start
    for s, e in windows: rng.append([max(0, int((s - lead) * FPS)), min(N, int(-(-(e + tail) * FPS // 1)))])
    rng.sort(); m = []
    for r in rng:
        if m and r[0] <= m[-1][1]: m[-1][1] = max(m[-1][1], r[1])
        else: m.append(r)
    return m, shift

def pieces_of(f0, f1):
    n = -(-(f1 - f0) // PIECE); sz = -(-(f1 - f0) // n); return [(f0 + i * sz, min(f1, f0 + (i + 1) * sz)) for i in range(n)]

def render_patches(todo, R_new, tfile, cjson, st_stamp, j, extra_env):
    """todo = [(f0, f1)] pieces; returns [(f0, f1, file)]"""
    env = {**tools_env(), 'TIMING': tfile, 'F25CLIPSJSON': cjson, **extra_env}; res = {}
    def one(p):
        f0, f1 = p; f = os.path.join(PCS, f'p{f0:06d}_{f1:06d}_{st_stamp}.mp4')
        if os.path.exists(f) and nframes(f) == f1 - f0: print(f'  piece {f0}-{f1} reused', flush=True); return p, f
        ids = [c['id'] for c in R_new['chunks'] if c['fa'] < f1 and c['fb'] > f0]; t0 = time.time()
        with open(f[:-4] + '.log', 'w') as lg:
            sh(['node', '--expose-gc', 'render.mjs', '--out', f + '.tmp.mp4', '--from', f'{f0 / FPS:.6f}', '--to', f'{f1 / FPS:.6f}'], cwd=FILM, env={**env, 'SECS': ','.join(ids)}, stdout=lg, stderr=subprocess.STDOUT)
        os.replace(f + '.tmp.mp4', f); n = nframes(f)
        if n != f1 - f0: raise SystemExit(f'piece {f0}-{f1}: {n} frames, expected {f1 - f0}')
        print(f'  piece {f0}-{f1} ({ids}) {(f1 - f0) / FPS:.1f} s done in {time.time() - t0:.0f} s', flush=True); return p, f
    with ThreadPoolExecutor(j) as ex:
        for p, f in ex.map(one, todo): res[p] = f
    return [(a, b, res[(a, b)]) for a, b in todo]

def cmd_clips(a):
    os.makedirs(a.dir, exist_ok=True); meta = jload(os.path.join(AUD, 'clips.json')); only = set(a.only.split(',')) if a.only else None
    for q in a.quote or []: k, v = q.split('=', 1); meta.setdefault(k, {})['quote'] = v
    if a.quotes:
        for k, v in jload(a.quotes).items(): meta.setdefault(k, {})['quote'] = v
    st = load_state()
    if st is None: print('no picture state yet: taking the chunks as they are'); st = make_state(a.chunks)
    done = prepare(a, meta, only)
    if not done: raise SystemExit(f'nothing to do: no K1/K2/K3 file in {a.dir} (K1-roh.mp4, K2-roh.mp4, K3-ganz.mp4) and no --k3 card')
    return finish_clips(a, meta, done, st)

def finish_clips(a, meta, done, st):
    work_audio(meta); build_sound(); old = jload(os.path.join(WORK, 'state_timing.json')); new = jload(os.path.join(AB, 'timing.json'))
    tnew = os.path.join(AB, 'timing.json'); cj = os.path.join(AB, 'clips.json')
    R_old = chunk_ranges(os.path.join(WORK, 'state_timing.json')); R_new = chunk_ranges(tnew)
    win = [(s['start'], s['end']) for s in new['slots'] if s['id'] in done and s['kind'] == 'clip']
    rng, shift = dirty_ranges(old, new, R_old, win, a.lead, a.margin)
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
    k3card = bool(meta.get('K3', {}).get('card'))
    todo = [p for x, b in rng for p in pieces_of(x, b)]
    patches = render_patches(todo, R_new, tnew, cj, stamp(tnew, cj, 'card' if k3card else ''), a.j, {'F25_K3': 'card'} if k3card else {})
    segs = st['segments']
    if shift: segs = [dict(s, f1=min(s['f1'], shift['from_frame'])) for s in segs if s['f0'] < shift['from_frame']]
    for f0, f1, f in patches: segs = overlay(segs, f0, f1, f)
    chk_cover(segs, N)
    publish_audio()
    st.update(segments=segs, timing_sha=fsha(os.path.join(AUD, 'timing.json')), frames=N, patches=st.get('patches', 0) + len(patches))
    shutil.copy(os.path.join(AUD, 'timing.json'), os.path.join(WORK, 'state_timing.json')); save_state(st)
    assert fsha(timing_file()) == st['timing_sha']
    print('clips done; repo: audio/clips.json audio/timing.json audio/slots.json audio/subtitles.* updated (commit them)')
    if not a.no_assemble: cmd_assemble(argparse.Namespace(name=a.name or 'fassung-2', chunks=a.chunks, fresh=False, calm=False, no_contact=False, preview=False, crf=18))


# ---------------------------------------------------------------------------------------------------------------------- what-if, check
def cmd_plan(a):
    meta = jload(os.path.join(AUD, 'clips.json'))
    for kv in a.sets:
        k, v = kv.split('='); meta[k]['dur'] = float(v) - (meta[k].get('offset', 0))
    work_audio(meta); build_sound(full=False)
    new = jload(os.path.join(AB, 'timing.json')); old = jload(timing_file()); tnew = os.path.join(AB, 'timing.json')
    ch = slot_diff(old, new)
    print('slot changes:', [(i, round(d, 3)) for _, i, d in ch], '| film', old['duration'], '->', new['duration'])
    if a.build_check:
        code = ("import { build } from './film.mjs';"
                "const film = await build(); console.log('@@ok', film.duration, 'entries', film.list.length);"
                "for (const t of [60, 100, 170, 230, 300, 380, 450, 520, 580, 628]) { if (film.prepare) await film.prepare(t); film.frame(t); } console.log('@@frames ok');")
        o = subprocess.run(['node', '--input-type=module', '-e', code], cwd=FILM, env={**os.environ, 'TIMING': tnew, 'F25CLIPSJSON': os.path.join(AB, 'clips.json')}, capture_output=True, text=True)
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
            print(f"     frames {n} (expected {round((m.get('dur') or 0) * FPS)})" + ('' if n or m.get('card') else '  -> PLACEHOLDER in the picture'))
            if n and m.get('dur') and abs(n - round(m['dur'] * FPS)) > 1: err(f"{c['id']}: {n} frames, expected {round(m['dur'] * FPS)}")
            q = m.get('cues') or []
            for k, (t0, line) in enumerate(q):
                if len(line) > MAX: err(f"{c['id']}: cue longer than {MAX}: {line!r}")
                if not 0 <= t0 <= (m.get('dur') or m.get('plan') or 99) or (k and t0 <= q[k - 1][0]): err(f"{c['id']}: cue time {t0}")
    print('check:', 'OK' if not bad else f'{len(bad)} problem(s)'); return not bad


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('--work')
    sp = ap.add_subparsers(dest='cmd'); common = argparse.ArgumentParser(add_help=False); common.add_argument('--work', default=argparse.SUPPRESS)
    p = sp.add_parser('render', parents=[common]); p.add_argument('--only'); p.add_argument('-j', type=int, default=4); p.add_argument('--scale', type=float, default=1)
    p = sp.add_parser('join', parents=[common]); p.add_argument('--only')
    p = sp.add_parser('assemble', parents=[common]); p.add_argument('--name', required=True); p.add_argument('--chunks'); p.add_argument('--fresh', action='store_true')
    p.add_argument('--calm', action='store_true'); p.add_argument('--no-contact', action='store_true'); p.add_argument('--preview', action='store_true'); p.add_argument('--crf', type=int, default=18)
    p = sp.add_parser('clips', parents=[common]); p.add_argument('dir'); p.add_argument('--name'); p.add_argument('--only'); p.add_argument('--tol', type=float, default=.15)
    p.add_argument('-j', type=int, default=2); p.add_argument('--lead', type=float, default=7.0); p.add_argument('--margin', type=float, default=1.5)
    p.add_argument('--quote', action='append'); p.add_argument('--quotes'); p.add_argument('--in', dest='in_', action='append'); p.add_argument('--dur', action='append')
    p.add_argument('--whisper', action='store_true'); p.add_argument('--words', action='append'); p.add_argument('--k3', choices=['clip', 'card'], default=None)
    p.add_argument('--plan', action='store_true'); p.add_argument('--allow-shift', action='store_true'); p.add_argument('--no-assemble', action='store_true'); p.add_argument('--chunks')
    p = sp.add_parser('plan', parents=[common]); p.add_argument('sets', nargs='+'); p.add_argument('--build-check', action='store_true')
    p = sp.add_parser('check', parents=[common])
    a = ap.parse_args(); setup(a.work)
    if a.cmd == 'render': cmd_render(a)
    elif a.cmd == 'join': cmd_join(a)
    elif a.cmd == 'assemble': cmd_assemble(a)
    elif a.cmd == 'clips': cmd_clips(a)
    elif a.cmd == 'plan': cmd_plan(a)
    elif a.cmd == 'check': sys.exit(0 if cmd_check(a) else 1)
    else: ap.print_help()
