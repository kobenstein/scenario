#!/usr/bin/env python3
"""Film 26 "Why Elon Says Saving Money Is Pointless" · chunk render, join and master assembly (adapted from f25_clips.py, trimmed: no sound work, the mix is final).

  F26CLIPS=<footage dir> TIMING=<repo>/audio/timing.json python3 tools/f26_clips.py render [--only c05] [-j 4] [--scale 1]   pieces <= 20 s -> WORK/cNN_pNN.mp4, joined to WORK/cNN.mp4
  python3 tools/f26_clips.py assemble --name film26 [--crf 18]     chunks checked + joined, mix.m4a copied in, subtitles.ass burned in -> WORK/final/<name>-master-1080p.mp4
  Footage frames: tools/f26_footage.sh <cut clips dir> <out dir> (C1..C5 -> <out>/<id>/f00001.jpg, 1680x945, 30 fps, non-16:9 fitted on a blurred backing).
"""
import argparse, glob, hashlib, json, os, re, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE); AUD = os.path.join(FILM, 'audio')
ROOT = (os.environ.get('F26ROOT') or '/mnt/project-files/scenario/film-sparen').rstrip('/') + '/'
SCRATCH = '/tmp/claude-0/-home-user/2390fd9b-30dd-55fc-82e0-ea1c9fdfcd9a/scratchpad/f26'
FPS, PIECE = 30, 600
SRC_NAMES = ('{id}-roh.mp4', '{id}-ganz.mp4', '{id}.mp4', '{id}.mov', '{id}.mkv')
WORK = CL = PCS = WA = SUBS = FINAL = AB = STATE = VO = ASSETS = None


def setup(work):
    global WORK, CL, PCS, WA, SUBS, FINAL, AB, STATE, VO, ASSETS
    WORK = work or os.environ.get('F26WORK') or (SCRATCH + '/final' if os.path.isdir(SCRATCH) else '/tmp/f26work')
    CL = (os.environ.get('F26CLIPS') or os.path.join(SCRATCH, 'footage')).rstrip('/')
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
    print(f'{len(jobs)} pieces, timing {tfile}, -j {a.j}'); env = {**os.environ, 'F26CLIPS': CL, 'F26ROOT': ROOT, 'TIMING': tfile}; t0 = time.time()
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
    for d in (ROOT + 'audio', WA):
        if os.path.exists(os.path.join(d, 'mix.m4a')): return os.path.join(d, 'mix.m4a')
    raise SystemExit('no mix.m4a')
def subs_in():
    for d in (ROOT + 'untertitel', ROOT + 'audio', AUD):
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
    sh(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-filter_complex_script', gf, '-map', '[pic]', '-map', '0:a',
        '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'copy',
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



def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); ap.add_argument('--work')
    sp = ap.add_subparsers(dest='cmd'); common = argparse.ArgumentParser(add_help=False); common.add_argument('--work', default=argparse.SUPPRESS)
    p = sp.add_parser('render', parents=[common]); p.add_argument('--only'); p.add_argument('-j', type=int, default=4); p.add_argument('--scale', type=float, default=1)
    p = sp.add_parser('join', parents=[common]); p.add_argument('--only')
    p = sp.add_parser('assemble', parents=[common]); p.add_argument('--name', required=True); p.add_argument('--chunks'); p.add_argument('--fresh', action='store_true')
    p.add_argument('--calm', action='store_true'); p.add_argument('--no-contact', action='store_true'); p.add_argument('--preview', action='store_true'); p.add_argument('--crf', type=int, default=18)
    a = ap.parse_args(); setup(a.work)
    for d in (WORK, FINAL): os.makedirs(d, exist_ok=True)
    {'render': cmd_render, 'join': cmd_join, 'assemble': cmd_assemble}[a.cmd](a)

if __name__ == '__main__': main()
