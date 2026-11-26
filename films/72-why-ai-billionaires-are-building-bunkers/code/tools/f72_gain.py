#!/usr/bin/env python3
"""Film 72 · clip level from ebur128 (README 'GAIN'): measures every clip slot of <audio>/mix.wav against the VO around it (6 s before / 6 s after, 0.7 s clear of the slot)
and, with --apply, writes the corrected GAIN into audio/clip_cues.py (GAIN[id] -= the LU difference, 0.1 dB steps; only where |difference| > 0.3 LU). Target +-1 LU, aim 0.
usage: f72_gain.py [--apply] [--wav /tmp/claude-0/f72/audio/mix.wav]   (then: clip_cues.py -> clips_json.py -> mix.py once more)"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); CUES = os.path.join(os.path.dirname(HERE), 'audio', 'clip_cues.py')
ROOT = (os.environ.get('F72ROOT') or '/mnt/project-files/scenario/film-bunker').rstrip('/') + '/'
wav = sys.argv[sys.argv.index('--wav') + 1] if '--wav' in sys.argv else '/tmp/claude-0/f72/audio/mix.wav'
def lufs(t0, t1):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-ss', f'{t0:.3f}', '-t', f'{t1 - t0:.3f}', '-i', wav, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = o[o.rfind('Summary:'):]; m = re.search(r'I:\s+(-?[\d.]+) LUFS', s); return float(m.group(1)) if m else None
slots = json.load(open(ROOT + 'audio/slots.json'))['clips']; src = open(CUES).read()
cur = {k: float(v) for k, v in re.findall(r"'(C\w+)':\s*(-?[\d.]+)", re.search(r'^GAIN = \{(.*?)\}', src, re.M).group(0))}
new = dict(cur)
for c in slots:
    a, b = c['start'], c['end']; cl = lufs(a + .15, b - .15); pre = lufs(max(0, a - 6.7), a - .7); post = lufs(b + .7, b + 6.7)
    vo = [x for x in (pre, post) if x is not None]; vo = sum(vo) / len(vo)
    d = cl - vo
    if d < -12: print(f"{c['id']}: clip slot is SILENT ({cl:.1f} LUFS: placeholder, no gain computed)"); continue
    print(f"{c['id']}: clip {cl:.2f} LUFS, VO before {pre} / after {post} -> clip {d:+.2f} LU over the VO (gain_db now {cur[c['id']]})")
    if abs(d) > .3: new[c['id']] = round(cur[c['id']] - d, 1)
if '--apply' in sys.argv:
    line = 'GAIN = {' + ', '.join(f"'{k}': {v}" for k, v in new.items()) + '}'
    src = re.sub(r'^GAIN = \{.*?\}', line, src, count=1, flags=re.M); open(CUES, 'w').write(src); print('written:', line)
else: print('would write:', new)
