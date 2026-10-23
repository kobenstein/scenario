#!/usr/bin/env python3
"""Replace or insert a passage inside one VO take with a passage from a new take (same voice, same seed), so a fact fix
does not re-record the whole take. Cuts land on the quietest 10 ms between two words. Keeps vo-<id>.orig.mp3/.json.
usage: splice_vo.py <audio_dir> <seg> <new_take_base> <new_from_word> <new_to_word> (--replace <from_word> <to_word> | --after <word>)
  words are matched by text (first occurrence of the from word, then the first to word after it)"""
import json, os, shutil, subprocess, sys
import numpy as np
SR = 48000
A, seg, new, nf, nt = sys.argv[1].rstrip('/'), *sys.argv[2:6]
mode = sys.argv[6]; args = sys.argv[7:]
def load(mp3): return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']), np.float32)
def quiet(x, lo, hi):
    hi = max(hi, lo + .02); fr = [(float(np.sqrt(np.mean(x[int(t * SR):int(t * SR) + SR // 100] ** 2))), t) for t in np.arange(lo, hi - .01, .005)]
    return round(min(fr)[1] + .005, 3)
def gap(x, lo, hi, end=None):
    """the silent stretch around the quietest point between two words -> (start, end) of the silence"""
    q = quiet(x, lo, hi) if hi is not None else None
    r = lambda t: float(np.sqrt(np.mean(x[max(0, int(t * SR)):int(t * SR) + SR // 100] ** 2)))
    if q is None:   # end of the take: silence starts after the last loud frame
        t = len(x) / SR - .01
        while t > lo and r(t) < .004: t -= .005
        return round(t + .015, 3), len(x) / SR
    thr = max(.004, r(q) * 3); a = b = q
    while a > lo - .3 and r(a - .005) < thr: a -= .005
    while b < hi + .3 and r(b + .005) < thr: b += .005
    return round(a + .02, 3), round(b - .02, 3)
def find(W, a, b=None, start=0):
    i = next(k for k in range(start, len(W)) if W[k][0] == a)
    return i if b is None else (i, next(k for k in range(i, len(W)) if W[k][0] == b))
orig_mp3, orig_js = f'{A}/vo-{seg}.mp3', f'{A}/vo-{seg}.json'
if not os.path.exists(f'{A}/vo-{seg}.orig.mp3'):
    shutil.copy(orig_mp3, f'{A}/vo-{seg}.orig.mp3'); shutil.copy(orig_js, f'{A}/vo-{seg}.orig.json')
O = json.load(open(f'{A}/vo-{seg}.orig.json')); OW = O['words']; xo = load(f'{A}/vo-{seg}.orig.mp3')
N = json.load(open(new + '.json')); NW = N['words']; xn = load(new + '.mp3')
i0, i1 = find(NW, nf, nt)
n0 = gap(xn, NW[i0 - 1][2], NW[i0][1])[1] if i0 else 0.0                       # just before the new passage's first word
n1 = gap(xn, NW[i1][2], NW[i1 + 1][1] if i1 + 1 < len(NW) else None)[0]          # just after its last word
if mode == '--replace':
    a, b = find(OW, args[0], args[1])
    c0 = gap(xo, OW[a - 1][2], OW[a][1])[1] if a else 0.0      # keep the original pause before the passage
    c1 = gap(xo, OW[b][2], OW[b + 1][1])[0] if b + 1 < len(OW) else len(xo) / SR   # and after it
    keep_before, keep_after = OW[:a], OW[b + 1:]
else:
    k = find(OW, args[0]); a = k + 1
    g = gap(xo, OW[k][2], OW[k + 1][1]); c0 = c1 = g[0]          # insert right after the word; the new piece brings its own pause
    n0 = gap(xn, NW[i0 - 1][2], NW[i0][1])[0] if i0 else 0.0
    keep_before, keep_after = OW[:a], OW[a:]
piece = xn[int(n0 * SR):int(n1 * SR)]
out = np.concatenate([xo[:int(c0 * SR)], piece, xo[int(c1 * SR):]])
d = (n1 - n0) - (c1 - c0)
words = [list(w) for w in keep_before] + [[w, max(c0, s - n0 + c0), e - n0 + c0] for w, s, e in NW[i0:i1 + 1]] + [[w, s + d, e + d] for w, s, e in keep_after]
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-b:a', '192k', orig_mp3], stdin=subprocess.PIPE)
p.communicate(out.astype(np.float32).tobytes())
json.dump({'url': O.get('url'), 'spliced': {'from': new, 'cut': [c0, c1], 'piece': [n0, n1]}, 'words': words}, open(orig_js, 'w'))
print(seg, f'cut {c0:.3f}-{c1:.3f} <- {os.path.basename(new)} {n0:.3f}-{n1:.3f}; take {len(xo)/SR:.2f} -> {len(out)/SR:.2f} s; {len(words)} words')
