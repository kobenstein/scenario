#!/usr/bin/env python3
"""Film 11 calm meter (Lehre aus "Singularity": hektisch = zu viele harte Schnitte + zu viel Bildbewegung).

  python3 tools/calm.py <video.mp4> [more.mp4 ...] [--from S] [--to S] [--thr 5] [--scale 1280:720] [--json out.json] [--sub 170]

Per file (or per --from/--to window): duration, hard cuts (ffmpeg scdet score >= thr; counts at 3 and 10 are printed too), cuts per
minute, the mafd median (mean absolute frame difference of ffmpeg scdet, 0-100: the motion measure), mafd p90, the share of
near-static frames (mafd < 0.15), and the mean luma (0-255, YAVG of signalstats: brightness).
mafd depends on resolution and encode (grain survives at 1080p, a 720p preview halves it): compare like with like. Calibration
(2026-10-23, Grow Forever 720p player parts part00/part01 from film-ueberfluss/player): mafd median 0.30 / 0.43, 0 cuts at thr 10,
1 at thr 5 (the clip screen), luma 55 / 80. Measure Film 11 the same way: a 720p preview encode, or --scale 1280:720.
--sub 170 ignores the bottom 170 px of 1080 (burned subtitles) for all measures (default 0: whole frame).
Reference values (Jakob's verdicts): #6 0.3 cuts/min, mafd median 0.36 · Grow Forever (film 7, "super") 0.9/min, 1.42 (coordinator's figures) ·
Singularity ("hektisch") 2.6/min, 1.27. Film 11 target: hard cuts per minute <= Grow Forever (0.9; aim <= 0.8) and mafd median not above Grow Forever measured
the SAME way (720p player parts: 0.30 / 0.43), mean luma clearly above Singularity (Film 11 aims at >= 120). A frozen c01 frame (grain + print finish only)
measures mafd 0.15 at 720p: that is the floor.
"""
import json, re, subprocess, sys, statistics as st

GF_MAFD = 0.43   # Grow Forever, 720p player part01 (part00: 0.30); compare on 720p (or --scale 1280:720)

def measure(path, a=None, b=None, thr=5.0, sub=0, scale=None):
    pre = []
    if a is not None: pre += ['-ss', str(a)]
    if b is not None: pre += ['-t', str(b - (a or 0))]
    crop = f'crop=iw:ih*{(1080 - sub) / 1080:.5f}:0:0,' if sub else ''
    sc = f'scale={scale},' if scale else ''
    vf = f'{crop}{sc}signalstats,scdet=threshold={thr},metadata=mode=print:file=-'
    p = subprocess.run(['ffmpeg', '-v', 'error', *pre, '-i', path, '-an', '-vf', vf, '-f', 'null', '-'], capture_output=True, text=True)
    mafd, score, yavg, t = [], [], [], []
    cur = {}
    for line in p.stdout.splitlines():
        m = re.match(r'frame:\s*(\d+)\s+pts:\s*\S+\s+pts_time:(\S+)', line)
        if m:
            if cur: t.append(cur.get('t', 0)); mafd.append(cur.get('mafd', 0)); score.append(cur.get('score', 0)); yavg.append(cur.get('y', 0))
            cur = {'t': float(m.group(2))}; continue
        m = re.match(r'lavfi\.(\S+)=(\S+)', line)
        if not m: continue
        k, v = m.group(1), m.group(2)
        try: v = float(v)
        except ValueError: continue
        if k == 'scd.mafd': cur['mafd'] = v
        elif k == 'scd.score': cur['score'] = v
        elif k == 'signalstats.YAVG': cur['y'] = v
    if cur: t.append(cur.get('t', 0)); mafd.append(cur.get('mafd', 0)); score.append(cur.get('score', 0)); yavg.append(cur.get('y', 0))
    if not t: raise SystemExit(f'no frames read from {path}: {p.stderr[-400:]}')
    dur = len(t) / 30.0
    cuts = [round(t[i] + (a or 0), 2) for i in range(1, len(t)) if score[i] >= thr]
    m1 = mafd[1:] or [0]
    q = sorted(m1)
    return {
        'file': path, 'from': a or 0, 'dur_s': round(dur, 2), 'cuts': len(cuts), 'cuts_per_min': round(len(cuts) / (dur / 60), 2),
        'cut_times': cuts, 'cuts_thr3': sum(1 for x in score[1:] if x >= 3), 'cuts_thr10': sum(1 for x in score[1:] if x >= 10), 'mafd_median': round(st.median(m1), 3), 'mafd_p90': round(q[int(.9 * (len(q) - 1))], 3),
        'static_share': round(sum(1 for x in m1 if x < .15) / len(m1), 3), 'luma_mean': round(st.mean(yavg), 1),
    }

def main():
    args = sys.argv[1:]
    opt = lambda k, d=None: (args[args.index(k) + 1] if k in args else d)
    a = float(opt('--from')) if opt('--from') else None
    b = float(opt('--to')) if opt('--to') else None
    thr = float(opt('--thr', 5)); sub = int(opt('--sub', 0)); out = opt('--json'); scale = opt('--scale')
    files = [x for i, x in enumerate(args) if not x.startswith('--') and (i == 0 or not args[i - 1].startswith('--'))]
    res = [measure(f, a, b, thr, sub, scale) for f in files]
    for r in res:
        ok = 'OK' if r['cuts_per_min'] <= .9 and r['mafd_median'] <= GF_MAFD else 'CHECK'
        print(f"{r['file']}  {r['dur_s']:.1f}s  cuts {r['cuts']} ({r['cuts_per_min']}/min; thr3 {r['cuts_thr3']}, thr10 {r['cuts_thr10']}) at {r['cut_times']}  mafd median {r['mafd_median']}  "
              f"p90 {r['mafd_p90']}  static {r['static_share'] * 100:.1f}%  luma {r['luma_mean']}  [{ok} vs Grow Forever: <=0.9 cuts/min, mafd median <={GF_MAFD} at 720p]")
    if out: json.dump(res, open(out, 'w'), indent=1)

if __name__ == '__main__':
    main()
