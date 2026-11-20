#!/usr/bin/env python3
"""Film 29 · Fassung 2: real interview clips spliced into the finished Fassung 1 (no re-render of the animation).

  python3 tools/f29_v2.py plan                 print the edit (inserts, new times, chapters) and write <ROOT>clips-v2.json + subtitles v2
  python3 tools/f29_v2.py inserts              build the framed insert videos (WORK/v2/ins_<id>.mp4, no sound)
  python3 tools/f29_v2.py audio                build the new mix (WORK/v2/mix_v2.wav): film mix split at the cuts, ducked music bed, clip speech
  python3 tools/f29_v2.py master [--crf 18]    chunks + inserts by frame number, subtitles v2 burned in, mix_v2 -> FINAL/fassung-2-master-1080p.mp4
  python3 tools/f29_v2.py extras               720p preview, contact sheet, checks

The edit (EDIT below): C1 replaces the silent quote-card slot (no shift); C4, C2, C6 are inserted at pauses (everything after shifts).
Each insert: film frame dissolves (0.4 s) to the night-blue plate, the clip (framed 1344x756, rim + shadow) fades up (0.35 s),
lower third (name, role, ORIGINAL FOOTAGE tag, source) from tools/f29_v2_overlays.mjs; at the end the clip fades out and the plate
dissolves (0.4 s) into the next film frame. Music bed under the clip: music stem ducked to speech - 22 LU, seamless at both ends
(bed runs on from the cut, crossfades under the clip to the music that leads back into the cut). Clip speech normalised to -16 LUFS.
Clip source times are seconds in the small clip files (Drive "Film 29 Clips", *_small/_srcXXmYY files), offsets to the source in SRC.
"""
import argparse, json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(HERE)
ROOT = (os.environ.get('F29ROOT') or '/mnt/project-files/scenario/film-mammut').rstrip('/') + '/'
SCRATCH = os.environ.get('F29SCRATCH') or '/tmp/claude-0/-home-user/5b583d66-79d3-5fc5-99fe-bf38da4a3ea1/scratchpad/f29'
WORK, CL, FINAL = SCRATCH + '/work', SCRATCH + '/clips', SCRATCH + '/final'
V2 = SCRATCH + '/v2'
FPS, SR = 30, 48000
BOX = dict(x=288, y=40, w=1344, h=756)
DIP, CFADE = 0.4, 0.35
T_SPEECH, BED_UNDER = -16.0, 22.0

# clip files; src0 = source time (s) of clip second 0
SRC = {
    'C1': dict(file='C1_small.mp4', url='https://www.youtube.com/watch?v=VHg3oX1ytYQ', src0=34 * 60 + 54.0, speaker='Ben Lamm, CEO, Colossal',
               where='Moonshots #297 (Peter H. Diamandis podcast), Sep 30, 2026'),
    'C2': dict(file='C2_dataset_src09m34.mp4', url='https://www.youtube.com/watch?v=VHg3oX1ytYQ', src0=9 * 60 + 34.0, speaker='Ben Lamm, CEO, Colossal',
               where='Moonshots #297 (Peter H. Diamandis podcast), Sep 30, 2026'),
    'C4': dict(file='C4_womb_src42m33.mp4', url='https://www.youtube.com/watch?v=fOEIgiTZqxw', src0=42 * 60 + 33.0, speaker='Ben Lamm, CEO, Colossal',
               where='Upstarts Media podcast, Oct 8, 2026'),
    'C6': dict(file='C6_vaccine_0m44.mp4', url='https://www.youtube.com/watch?v=7Xl2tsNuimA', src0=44.0, speaker='Houston Zoo / Baylor College of Medicine team (speaker not named in the source)',
               where='Houston Zoo, YouTube, "Breakthrough Elephant Vaccine Shows First Signs of Protection Against Deadly Virus", Jul 28, 2026'),
}
# the edit. at: film frame (Fassung 1) of the cut; replace: frames of Fassung 1 replaced (C1 only).
# parts: [(src_in, src_out)] of the clip video (jump cut between parts gets a 6 % punch-in); audio [a0, a1] is the speech/natural sound used.
# lead: seconds of plate between dissolve and clip (C1: fills the fixed slot). subs: (src_t0, src_t1, text) in clip seconds.
EDIT = [
    dict(id='C1', at=5100, replace=287, lead=0.05, parts=[(4.70, 9.20), (10.93, 14.42)], audio=(5.17, 14.15), hard_out=True,
         words="Foundation models and AI models aren't quite looking at the entire tree of life, they're not going to magically overnight give them a genome and give us an answer.",
         raw="the uh foundation models and AI models aren't quite looking at the entire tree of life and they're not like uh they're not going to magically overnight give them a genome and give us an answer.",
         subs=[(5.20, 6.52, 'Foundation models and AI models'), (6.56, 7.80, "aren't quite looking"), (7.84, 9.10, 'at the entire tree of life,'),
               (10.96, 12.52, "they're not going to magically overnight"), (12.56, 14.08, 'give them a genome and give us an answer.')]),
    dict(id='C4', at=8724, parts=[(2.55, 13.75)], audio=(2.80, 13.45), lt_out=12.45,
         words='You do not need an artificial womb to make a mammoth. You need an artificial womb to make any of these species at scale, at the scale that we want to produce them.',
         raw='You do not need an artificial womb to make a mammoth. You need an artificial womb to make any of these species at scale, at the scale that we want to produce them.',
         subs=[(2.85, 4.00, 'You do not need'), (4.02, 5.30, 'an artificial womb'), (5.52, 6.42, 'to make a mammoth.'), (6.80, 8.58, 'You need an artificial womb'),
               (8.62, 10.18, 'to make any of these species'), (10.22, 11.00, 'at scale,'), (11.02, 12.08, 'at the scale that we want'), (12.12, 13.42, 'to produce them.')]),
    dict(id='C2', at=14513, parts=[(5.30, 11.20)], audio=(5.83, 10.95),
         words='So I would make the argument that, you know, the data set is more valuable than the model.',
         raw='so I would make the argument that you know the data set the is more valuable than the model.',
         subs=[(5.83, 6.88, 'So I would make the argument'), (7.24, 7.90, 'that, you know,'), (8.18, 10.10, 'the data set is more valuable'), (10.12, 10.92, 'than the model.')]),
    dict(id='C6', at=15228, parts=[(7.60, 13.75)], audio=(7.60, 13.50), natural=True,
         words="We're near the end. We're very hopeful.",
         raw="we're we're near the end. We're very hopeful.",
         subs=[(11.10, 12.42, "We're near the end."), (12.52, 13.45, "We're very hopeful.")]),
]
CHAPTERS = [(0.0, 'AI is bringing back the mammoth'), (56.66, 'An elephant built for the cold'), (108.95, 'Reading DNA is easy, knowing is not'),
            (201.83, 'The dodo test'), (274.01, 'An egg no bird ever laid'), (298.98, 'Are the dire wolves real?'), (397.52, 'The animals still here'),
            (425.56, 'A ferret with grandchildren'), (523.82, 'Who decides?')]
N1 = 18672   # Fassung 1 frames (622.4 s)


def sh(cmd, **kw): return subprocess.run(cmd, check=True, **kw)
def jload(f): return json.load(open(f))


def layout():
    """per insert: film frames, insert frames, clip timing inside the insert; the new frame map"""
    out, shift = [], 0
    for e in EDIT:
        clipdur = sum(b - a for a, b in e['parts'])
        if e.get('replace'):
            n = e['replace']; t_clip = DIP + e.get('lead', 0)
        else:
            t_clip = DIP; n = round((DIP + clipdur + DIP) * FPS)
        x = dict(e, n=n, t_clip=t_clip, clipdur=clipdur, new_at=e['at'] + shift)
        shift += n - e.get('replace', 0); out.append(x)
    return out, shift


def new_time(t1, L):
    """Fassung 1 time -> Fassung 2 time"""
    f = t1 * FPS; add = 0
    for x in L:
        if f >= x['at'] + x.get('replace', 0): add += x['n'] - x.get('replace', 0)
    return (f + add) / FPS


def clip_to_insert(x, s):
    """clip-file second s -> seconds inside the insert"""
    acc = x['t_clip']
    for a, b in x['parts']:
        if a - 1e-6 <= s <= b + 1e-6: return acc + s - a
        acc += b - a
    raise ValueError(f"{x['id']}: {s} outside parts")


def fmt(t): m, s = divmod(int(t + 1e-6), 60); return f'{m}:{s:02d}'
def ts_srt(t): ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000); return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
def ts_ass(t): cs = int(round(t * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); s, cs = divmod(cs, 100); return f'{h}:{m:02d}:{s:02d}.{cs:02d}'
def p_ass(s): h, m, rest = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(rest)


def cmd_plan(a):
    L, shift = layout()
    N2 = N1 + shift
    print(f'Fassung 2: {N2} frames = {N2 / FPS:.3f} s (+{shift / FPS:.3f} s)')
    clips, cues = [], []
    for x in L:
        s = SRC[x['id']]; t0 = x['new_at'] / FPS
        a0, a1 = x['audio']; f_in, f_out = t0 + clip_to_insert(x, a0), t0 + clip_to_insert(x, a1)
        vis0, vis1 = t0 + x['t_clip'], t0 + x['t_clip'] + x['clipdur']
        src_in, src_out = s['src0'] + a0, s['src0'] + a1
        clips.append(dict(id=x['id'], url=f"{s['url']}&t={int(src_in)}s", speaker=s['speaker'], source=s['where'], file=s['file'],
                          words=x['words'], words_auto_captions_raw=x['raw'],
                          source_in=f'{int(src_in // 60):02d}:{src_in % 60:05.2f}', source_out=f'{int(src_out // 60):02d}:{src_out % 60:05.2f}',
                          clip_file_cuts=[list(p) for p in x['parts']],
                          source_ranges_used=[[f"{int((s['src0'] + max(p0, a0)) // 60):02d}:{(s['src0'] + max(p0, a0)) % 60:05.2f}",
                                               f"{int((s['src0'] + min(p1, a1)) // 60):02d}:{(s['src0'] + min(p1, a1)) % 60:05.2f}"] for p0, p1 in x['parts']],
                          film_start=round(f_in, 2), film_end=round(f_out, 2), footage_on_screen=[round(vis0, 2), round(vis1, 2)],
                          insert_frames=[x['new_at'], x['new_at'] + x['n']], insert_seconds=[round(t0, 3), round(t0 + x['n'] / FPS, 3)],
                          mode='replaces the C1 quote-card slot (no shift)' if x.get('replace') else f"inserted at Fassung-1 {x['at'] / FPS:.3f} s (+{x['n'] / FPS:.3f} s)"))
        for c0, c1, txt in x['subs']:
            cues.append((t0 + clip_to_insert(x, c0), t0 + clip_to_insert(x, c1), txt))
        print(f"  {x['id']}: insert {t0:.3f}-{t0 + x['n'] / FPS:.3f} s ({x['n']} fr) speech {f_in:.2f}-{f_out:.2f} | {x['words']}")
    chapters = [dict(old=fmt(t), new=fmt(new_time(t, L)), new_s=round(new_time(t, L), 2), title=k) for t, k in CHAPTERS]
    for c in chapters: print(f"  {c['old']} -> {c['new']}  {c['title']}")
    total_clip = sum(c['footage_on_screen'][1] - c['footage_on_screen'][0] for c in clips)
    doc = dict(film='29-mammoth', fassung=2, duration=round(N2 / FPS, 3), frames=N2, clip_seconds_on_screen=round(total_clip, 2),
               clip_share=round(total_clip / (N2 / FPS), 4), note='Wording from YouTube auto-captions + word timestamps (.vtt) and silence/loudness analysis; not verified by ear or ASR.',
               clips=clips, chapters=chapters)
    json.dump(doc, open(ROOT + 'clips-v2.json', 'w'), indent=1, ensure_ascii=False)
    json.dump(dict(L=[{k: v for k, v in x.items()} for x in L], N2=N2), open(V2 + '/layout.json', 'w'), indent=1)
    # subtitles: shift v1 cues, cut cues that run into an insert, add the clip cues
    def remap(t0, t1):
        n0, n1 = new_time(t0, L), new_time(t1, L)
        for x in L:   # a cue may not run into an insert / the C1 slot
            s = x['new_at'] / FPS
            if n0 < s < n1: n1 = s - 0.02
        return n0, n1
    ass = open(ROOT + 'untertitel/subtitles.ass').read().split('\n')
    head = [l for l in ass if not l.startswith('Dialogue:')]
    ev = []
    for l in ass:
        if not l.startswith('Dialogue:'): continue
        p = l.split(',', 9); n0, n1 = remap(p_ass(p[1]), p_ass(p[2]))
        ev.append((n0, n1, p))
    style = ev[0][2]
    for c0, c1, txt in cues:
        p = list(style); p[9] = '{\\fad(120,160)}' + txt; ev.append((c0, c1, p))
    ev.sort(key=lambda e: e[0])
    lines = [l for l in head if l.strip() or True]
    while lines and not lines[-1].strip(): lines.pop()
    for n0, n1, p in ev:
        q = list(p); q[1], q[2] = ts_ass(n0), ts_ass(n1); lines.append(','.join(q))
    open(ROOT + 'untertitel/subtitles-v2.ass', 'w').write('\n'.join(lines) + '\n')
    srt = []
    for i, (n0, n1, p) in enumerate(ev, 1):
        txt = p[9].split('}', 1)[-1] if p[9].startswith('{') else p[9]
        srt.append(f'{i}\n{ts_srt(n0)} --> {ts_srt(n1)}\n{txt}\n')
    open(ROOT + 'untertitel/subtitles-v2.srt', 'w').write('\n'.join(srt))
    print(f'subtitles v2: {len(ev)} cues; clips-v2.json; clip share {total_clip:.1f} s = {100 * total_clip / (N2 / FPS):.1f} %')


# ------------------------------------------------------------------------------------------------------------- frames of Fassung 1 (no subs)
def chunk_list():
    st = jload(WORK + '/state.json') if os.path.exists(WORK + '/state.json') else None
    files = [f'{WORK}/c{i:02d}.mp4' for i in range(1, 17)]
    return files


def chunk_bounds():
    files = chunk_list(); b = [0]
    for f in files:
        n = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f]).decode())
        b.append(b[-1] + n)
    assert b[-1] == N1, b
    return files, b


def grab(frame, out):
    files, b = chunk_bounds() if not hasattr(grab, 'cb') else grab.cb
    grab.cb = (files, b)
    i = max(k for k in range(16) if b[k] <= frame)
    sh(['ffmpeg', '-v', 'error', '-y', '-i', files[i], '-vf', f'select=eq(n\\,{frame - b[i]})', '-frames:v', '1', out])


def cmd_inserts(a):
    L = jload(V2 + '/layout.json')['L']
    for x in L:
        if a.only and x['id'] not in a.only.split(','): continue
        D = x['n'] / FPS; cid = x['id']; f = CL + '/' + SRC[cid]['file']
        grab(x['at'] - 1, V2 + f'/freeze_{cid}_a.png')
        if not x.get('hard_out'): grab(x['at'] + x.get('replace', 0), V2 + f'/freeze_{cid}_b.png')
        tc, cd = x['t_clip'], x['clipdur']
        g, inputs = [], ['-loop', '1', '-framerate', '30', '-t', f'{D:.4f}', '-i', V2 + '/plate.png',
                         '-loop', '1', '-framerate', '30', '-t', f'{D:.4f}', '-i', V2 + '/layers/frame.png',
                         '-loop', '1', '-framerate', '30', '-t', f'{D:.4f}', '-i', V2 + f'/layers/lt_{cid}.png',
                         '-loop', '1', '-framerate', '30', '-t', f'{D:.4f}', '-i', V2 + f'/freeze_{cid}_a.png']
        if not x.get('hard_out'): inputs += ['-loop', '1', '-framerate', '30', '-t', f'{D:.4f}', '-i', V2 + f'/freeze_{cid}_b.png']
        ci = 5 if not x.get('hard_out') else 4
        inputs += ['-i', f]
        parts = []; np_ = len(x['parts'])
        g.append(f'[{ci}:v]split={np_}' + ''.join(f'[c{k}]' for k in range(np_)))
        for k, (p0, p1) in enumerate(x['parts']):
            punch = ',crop=iw/1.06:ih/1.06,scale=1920:1080' if k % 2 == 1 else ''
            g.append(f'[c{k}]trim=start={p0}:end={p1},setpts=PTS-STARTPTS,fps=30{punch},setsar=1[p{k}]'); parts.append(f'[p{k}]')
        g.append(f"{''.join(parts)}concat=n={len(parts)}:v=1:a=0,scale={BOX['w']}:{BOX['h']}:flags=lanczos,format=yuva420p,"
                 f"fade=in:st=0:d={CFADE}:alpha=1,fade=out:st={cd - CFADE:.3f}:d={CFADE}:alpha=1,setpts=PTS-STARTPTS+{tc:.4f}/TB[clip]")
        g.append(f"[1:v]format=rgba,fade=in:st={tc:.3f}:d={CFADE}:alpha=1,fade=out:st={tc + cd - CFADE:.3f}:d={CFADE}:alpha=1[fr]")
        lo = clip_to_insert(x, x['lt_out']) - CFADE if x.get('lt_out') else tc + cd - CFADE - 0.15   # C4: off before the cut to the interviewer
        g.append(f"[2:v]format=rgba,fade=in:st={tc + 0.3:.3f}:d={CFADE}:alpha=1,fade=out:st={lo:.3f}:d={CFADE}:alpha=1[lt]")
        g.append(f"[3:v]format=rgba,fade=out:st=0:d={DIP}:alpha=1[fa]")
        g.append('[0:v]format=rgb24[pl];[pl][fr]overlay=0:0[b1];[b1][clip]overlay=%d:%d:eof_action=pass[b2];[b2][lt]overlay=0:0[b3];[b3][fa]overlay=0:0[b4]' % (BOX['x'], BOX['y']))
        last = 'b4'
        if not x.get('hard_out'):
            g.append(f"[4:v]format=rgba,fade=in:st={D - DIP:.3f}:d={DIP}:alpha=1[fb];[b4][fb]overlay=0:0[b5]"); last = 'b5'
        g.append(f'[{last}]trim=end_frame={x["n"]},format=yuv420p[out]')
        out = V2 + f'/ins_{cid}.mp4'
        sh(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(g), '-map', '[out]', '-r', '30', '-c:v', 'libx264', '-crf', '10', '-preset', 'fast',
                                                       '-pix_fmt', 'yuv420p', out])
        n = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', out]).decode())
        print(cid, out, n, 'frames', 'OK' if n == x['n'] else f'!= {x["n"]}')


# ------------------------------------------------------------------------------------------------------------------------------ audio
def rd(f, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + ['-i', f] + (['-t', str(t)] if t is not None else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)


def lufs_of(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    I = float(p.rsplit('I:', 1)[1].split('LUFS')[0]); tp = float(p.rsplit('Peak:', 1)[1].split('dBFS')[0]); return I, tp


def ramp(n, a, b): return np.linspace(a, b, max(n, 1))[:, None]


def cmd_audio(a):
    L = jload(V2 + '/layout.json')['L']
    mix = rd(WORK + '/audio/mix.wav'); mus = rd(WORK + '/audio/stem_music.wav')
    S = lambda t: int(round(t * SR))
    out, pos1 = [], 0   # pos1 = sample in Fassung 1
    report = []
    for x in L:
        at = x['at'] * 1600; n = x['n'] * 1600; cid = x['id']
        out.append(mix[pos1:at])
        # clip sound: the audio window of every part, padded silent outside [a0, a1]
        a0, a1 = x['audio']; f = CL + '/' + SRC[cid]['file']
        segs = []
        for p0, p1 in x['parts']:
            s = rd(f, p0, p1 - p0)
            tt = p0 + np.arange(len(s)) / SR
            env = np.clip((tt - a0) / (0.3 if x.get('natural') else 0.03), 0, 1) * np.clip((a1 - tt) / (0.2 if x.get('natural') else 0.06), 0, 1)
            segs.append(s * env[:, None])
        for k in range(1, len(segs)):   # 15 ms cosine joins at the jump cut (both sides are pauses)
            j = S(0.015); w = np.sin(np.linspace(0, np.pi / 2, j))[:, None]; segs[k - 1][-j:] *= w[::-1]; segs[k][:j] *= w
        sp = np.concatenate(segs)
        # high-pass 80 Hz, normalise the used window to T_SPEECH
        hp = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'highpass=f=80', '-f', 'f32le', '-'],
                            input=sp.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
        sp = np.frombuffer(hp, np.float32).reshape(-1, 2).astype(np.float64)
        i0 = S(clip_to_insert(x, a0) - x['t_clip']); i1 = S(clip_to_insert(x, a1) - x['t_clip'])
        I, _ = lufs_of(sp[i0:i1]); gsp = 10 ** ((T_SPEECH - I) / 20); sp *= gsp
        # peak control on the real recordings (-4 dBFS limiter, 4x oversampled inside alimiter's lookahead), then re-check level
        lim = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'alimiter=limit=0.6:attack=3:release=80:level=disabled:asc=1',
                              '-f', 'f32le', '-'], input=sp.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
        sp = np.frombuffer(lim, np.float32).reshape(-1, 2).astype(np.float64)[:len(sp)]
        I3, _ = lufs_of(sp[i0:i1]); sp *= 10 ** ((T_SPEECH - I3) / 20) if I3 < T_SPEECH - 0.3 else 1
        seg = np.zeros((n, 2))
        o = S(x['t_clip']); seg[o:o + len(sp)] += sp[:n - o]
        spI = T_SPEECH
        if x.get('replace'):
            # C1: the slot's own bed (music only), ducked under the clip speech
            bed = mix[at:at + n].copy(); bI, _ = lufs_of(bed)
            duck = 10 ** ((spI - BED_UNDER - bI) / 20)
            t = np.arange(n) / SR; s0 = clip_to_insert(x, a0); s1 = clip_to_insert(x, a1)
            env = np.ones(n); dn = (t > s0 - 0.5) & (t < s0 - 0.05); env[dn] = 1 + (duck - 1) * (t[dn] - (s0 - 0.5)) / 0.45
            env[(t >= s0 - 0.05) & (t <= s1 + 0.15)] = duck
            up = t > s1 + 0.15; env[up] = duck + (1 - duck) * np.clip((t[up] - (s1 + 0.15)) / 0.8, 0, 1)
            seg += bed * env[:, None]
            pos1 = at + n
            report.append(f'{cid}: speech {I:.1f} -> {spI} LUFS, slot bed {bI:.1f} LUFS ducked {20 * np.log10(duck):.1f} dB')
        else:
            # bed: music runs on from the cut (a), crossfades under the clip to the music that leads back into the cut (b)
            ba = mus[at:at + n]; bb = mus[at - n:at]
            if len(bb) < n: bb = np.concatenate([np.zeros((n - len(bb), 2)), bb])
            mid = n // 2; xf = S(1.0); w = np.clip((np.arange(n) - (mid - xf // 2)) / xf, 0, 1)[:, None]
            bed = ba * (1 - w) + bb * w
            bI, _ = lufs_of(bed); duck = 10 ** ((spI - BED_UNDER - bI) / 20)
            env = np.full(n, duck); d = S(DIP + 0.1)
            env[:d] = np.linspace(1, duck, d); env[-d:] = np.linspace(duck, 1, d)
            seg += bed * env[:, None]
            # the cut itself: mix out / bed in is continuous (same music); a 20 ms join on the mix side
            j = S(0.02); out[-1] = out[-1].copy(); out[-1][-j:] *= np.linspace(1, 0, j)[:, None] ** .5; seg[:j] *= np.linspace(0, 1, j)[:, None] ** .5
            pos1 = at
            report.append(f'{cid}: speech {I:.1f} -> {spI} LUFS, bed {bI:.1f} LUFS ducked {20 * np.log10(duck):.1f} dB')
        out.append(seg)
    out.append(mix[pos1:])
    y = np.concatenate(out)
    I, tp = lufs_of(y)
    g = -14.0 - I; y *= 10 ** (g / 20); I2, tp2 = lufs_of(y)
    print('\n'.join(report)); print(f'mix v2: {len(y) / SR:.3f} s, {I:.2f} LUFS -> gain {g:+.2f} dB -> {I2:.2f} LUFS, true peak {tp2:.2f} dBTP')
    if tp2 > -1.0: print('WARNING: true peak above -1 dBTP')
    p = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', V2 + '/mix_v2.wav'], input=y.astype(np.float32).tobytes(), check=True)


# ------------------------------------------------------------------------------------------------------------------------------ master
def cmd_master(a):
    lay = jload(V2 + '/layout.json'); L, N2 = lay['L'], lay['N2']
    files, b = chunk_bounds()
    keep, p = [], 0   # Fassung-1 frame ranges kept, in order, each followed by insert k
    for x in L: keep.append((p, x['at'])); p = x['at'] + x.get('replace', 0)
    keep.append((p, N1))
    g, seq, m = [], [], 0
    for k, (f0, f1) in enumerate(keep):
        for i, fn in enumerate(files):   # one movie source per chunk piece (decoded only when the concat asks for it)
            a0, a1 = max(f0, b[i]), min(f1, b[i + 1])
            if a0 >= a1: continue
            g.append(f"movie='{fn}',trim=start_frame={a0 - b[i]}:end_frame={a1 - b[i]},setpts=PTS-STARTPTS[m{m}]"); seq.append(f'[m{m}]'); m += 1
        if k < len(L):
            g.append(f"movie='{V2}/ins_{L[k]['id']}.mp4',setpts=PTS-STARTPTS[m{m}]"); seq.append(f'[m{m}]'); m += 1
    inputs = []
    sub = ROOT + 'untertitel/subtitles-v2.ass'
    g.append(f"{''.join(seq)}concat=n={len(seq)}:v=1:a=0,setpts=N/(30*TB),subtitles=filename={sub}[pic]")
    na = 0
    out = a.out or FINAL + '/fassung-2-master-1080p.mp4'
    t = __import__('time').time()
    gf = V2 + '/picture_v2.filtergraph'; open(gf, 'w').write(';\n'.join(g))
    sh(['ffmpeg', '-v', 'error', '-stats', '-y', '-i', V2 + '/mix_v2.wav', '-filter_complex_script', gf, '-map', '[pic]', '-map', f'{na}:a',
        '-c:v', 'libx264', '-crf', str(a.crf), '-preset', a.preset, '-tune', 'grain', '-pix_fmt', 'yuv420p', '-r', '30',
        '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', out])
    print(f'master {out} in {__import__("time").time() - t:.0f} s')


def cmd_extras(a):
    sys.path.insert(0, HERE); import f29_film as F
    m = FINAL + '/fassung-2-master-1080p.mp4'; N2 = jload(V2 + '/layout.json')['N2']
    F.verify(m, {'duration': N2 / FPS})
    os.makedirs(ROOT + 'vorschau', exist_ok=True); pv = ROOT + 'vorschau/f29-vorschau-v2-720p.mp4'
    sh(['ffmpeg', '-v', 'error', '-y', '-i', m, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-b:v', '1000k', '-maxrate', '1250k', '-bufsize', '2500k', '-preset', 'medium',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', pv]); print('preview', pv, f'{os.path.getsize(pv) / 1e6:.0f} MB')
    os.makedirs(ROOT + 'bild', exist_ok=True); F.contact(m, ROOT + 'bild/fassung-2_kontakt.jpg')


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    sp.add_parser('plan'); sp.add_parser('extras'); p = sp.add_parser('inserts'); p.add_argument('--only'); sp.add_parser('audio')
    p = sp.add_parser('master'); p.add_argument('--crf', type=int, default=18); p.add_argument('--preset', default='medium'); p.add_argument('--out')
    a = ap.parse_args(); os.makedirs(V2, exist_ok=True)
    {'plan': cmd_plan, 'inserts': cmd_inserts, 'audio': cmd_audio, 'master': cmd_master, 'extras': cmd_extras}[a.cmd](a)


if __name__ == '__main__':
    main()
