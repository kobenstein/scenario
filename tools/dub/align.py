#!/usr/bin/env python3
"""Char timestamps without fal: transcribe a section mp3 with faster-whisper (word times), align the recognised
text to the known section text char by char, interpolate. Writes <dub_dir>/<lang>/ts-<id>.json like grab2.py.
usage: align.py <dub_dir> <lang> <id> [<id> ...]   (needs <lang>/vo-<id>.mp3 and <lang>_sections.json)"""
import json, sys, difflib, unicodedata
from faster_whisper import WhisperModel
D, lang, ids = sys.argv[1].rstrip('/'), sys.argv[2], sys.argv[3:]
M = WhisperModel('small', device='cpu', compute_type='int8')
secs = {s['id']: s['text'] for s in json.load(open(f'{D}/{lang}_sections.json'))}
def norm(c):
    c = unicodedata.normalize('NFKD', c.lower())
    return ''.join(x for x in c if x.isalnum())
for sid in ids:
    text = secs[sid]
    segs, _ = M.transcribe(f'{D}/{lang}/vo-{sid}.mp3', language=lang, word_timestamps=True, beam_size=1)
    rc, rt = [], []                                   # recognised normalised chars + their times
    for s in segs:
        for w in s.words:
            n = ''.join(norm(c) for c in w.word)
            for k, c in enumerate(n):
                rc.append(c); rt.append(w.start + (w.end - w.start) * (k + .5) / len(n))
    tc, tidx = [], []
    for i, ch in enumerate(text):
        for c in norm(ch): tc.append(c); tidx.append(i)
    sm = difflib.SequenceMatcher(None, tc, rc, autojunk=False)
    t_at = [None] * len(text)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): t_at[tidx[a + k]] = rt[b + k]
    known = [i for i, t in enumerate(t_at) if t is not None]
    cover = sum(1 for i in range(len(text)) if t_at[i] is not None) / max(1, len(tc))
    end = rt[-1] if rt else 0
    for i in range(len(text)):                        # fill gaps by interpolation
        if t_at[i] is None:
            p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
            tp = t_at[p] if p is not None else 0.0; tq = t_at[q] if q is not None else end
            ip = p if p is not None else -1; iq = q if q is not None else len(text)
            t_at[i] = tp + (tq - tp) * (i - ip) / (iq - ip)
    ch = [[text[i], round(t_at[i], 3), round((t_at[i + 1] if i + 1 < len(text) else end + .05), 3)] for i in range(len(text))]
    # make start of each line = first char time, end = last char time (+ small tail handled in assemble)
    json.dump(ch, open(f'{D}/{lang}/ts-{sid}.json', 'w'))
    print('aligned', lang, sid, 'coverage %.2f' % cover)
