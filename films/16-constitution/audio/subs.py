#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16: style = channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']
NUM = [('twenty twenty-five', '2025'), ('twenty twenty-four', '2024'), ('twenty twenty-three', '2023'), ('nineteen-fifties', '1950s'),
       ('seventy-one percent', '71%'),   # Film 14
       ('ninety-six', '96'), ('four point five', '4.5'), ('eighty', '80'), ('open a\\.i\\.', 'OpenAI')]   # Film 16 (spoken "Open A.I." -> OpenAI)
def fix(s):
    for a, b in NUM: s = re.sub(r'\b' + a + r'\b', b, s, flags=re.I)
    return s
MAX = 34   # one line at the large size (~72 px on 1080p), Jakob 2026-10-21
FN = set('a an the to of and or that in on for was is it its by with as at from than but if we our'.split())
def length(ws): return len(fix(' '.join(x['w'] for x in ws)))
def split(ws):
    if length(ws) <= MAX or len(ws) < 2: return [ws]
    best, bi = 1e9, 1
    for k in range(1, len(ws)):
        L, R = ws[:k], ws[k:]
        c = abs(length(L) - length(R)) + (0 if not ws[k - 1]['w'].endswith((',', ';', ':')) else -25)
        c += 30 if ws[k - 1]['w'].lower() in FN else 0
        c += 40 if len(R) < 3 or len(L) < 3 else 0
        if c < best: best, bi = c, k
    return split(ws[:bi]) + split(ws[bi:])
# hand-made breaks where the balanced split would cut a phrase (Film 6 hook, Fassung 3): sentence text -> cue texts, same words in order
BREAKS = {   # Film 16: keep "artificial intelligence" on one line
    "This is Claude's constitution: the 80 pages that shape how the artificial intelligence Claude thinks.":
        ["This is Claude's constitution:", "the 80 pages that shape", "how the artificial intelligence", "Claude thinks."],
    "So it matters whose words they are.": ["So it matters", "whose words they are."]}
def pieces(snt):
    k = ' '.join(x['w'] for x in snt)
    if k not in BREAKS: return split(snt)
    out, i = [], 0
    for p in BREAKS[k]: n = len(p.split()); out.append(snt[i:i + n]); i += n
    assert i == len(snt) and [' '.join(x['w'] for x in c) for c in out] == BREAKS[k], k
    return out
# Film 8: merge spoken numbers into one token before splitting, so "five hundred and sixty thousand" becomes "560,000" even across cue breaks
def merge(W):
    out, i = [], 0
    while i < len(W):
        for a, b in NUM:
            k = len(a.replace('\\', '').split())
            seg = W[i:i + k]
            m = re.fullmatch('(' + a + r')([.,?!]?)', ' '.join(x['w'] for x in seg), flags=re.I) if len(seg) == k else None
            if m:   # Film 16: only punctuation after the pattern is kept (so "A.I." does not leave a stray dot)
                out.append({**seg[0], 'w': b + m.group(2), 'e': seg[-1]['e']}); i += k; break
        else: out.append(W[i]); i += 1
    return out
W = merge(W)
sents, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None
    if not nxt or re.search(r'[.?!]["”]?$', w['w']) or nxt['s'] - w['e'] > .45 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
cues = [[c[0]['s'], c[-1]['e'], fix(' '.join(x['w'] for x in c))] for snt in sents for c in pieces(snt)]
# interview clips: real wording with phrase timings from the clip transcript (clips.json "cues", seconds from clip start);
# quote cards show the words on screen, so no subtitle for them
import os
CL = json.load(open(A + 'clips.json')) if os.path.exists(A + 'clips.json') else {}
for c in json.load(open(A + 'timing.json')).get('clips', []):
    cl = CL.get(c['id'], {'card': True})   # Film 14: Q1 is a silent quote card (read on screen, no subtitle)
    if cl.get('card') or not cl.get('cues'): continue
    q = cl['cues']
    for k, (t0, line) in enumerate(q):
        t1 = q[k + 1][0] if k + 1 < len(q) else c['end'] - c['start']
        cues.append([c['start'] + t0, c['start'] + t1 - .05, line])
cues.sort(key=lambda c: c[0])
for i, c in enumerate(cues):  # hold each cue a little, never overlapping the next
    nx = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
    c[1] = min(max(c[1] + .25, c[0] + 1.0), nx - .04)
ts = lambda t, sep: f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d}{sep}{int(round(t % 1 * 1000)) if sep == ',' else int(round(t % 1 * 100)):0{3 if sep == ',' else 2}d}"
with open(OUT + 'subtitles.srt', 'w') as f:
    for i, (a, b, s) in enumerate(cues, 1): f.write(f"{i}\n{ts(a, ',')} --> {ts(b, ',')}\n{s}\n\n")
ass = """[Script Info]
ScriptType: v4.00+
PlayResX: 384
PlayResY: 288
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,DejaVu Sans,19,&H00E2EFF3,&H00E2EFF3,&H80000000,&H00000000,0,0,0,0,100,100,0,0,1,1.4,0,2,20,20,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(OUT + 'subtitles.ass', 'w') as f:
    f.write(ass)
    for a, b, s in cues: f.write(f"Dialogue: 0,{ts(a, '.')[1:]},{ts(b, '.')[1:]},Sub,,0,0,0,,{{\\fad(120,160)}}{s}\n")
print(len(cues), 'cues; longest', max(len(c[2]) for c in cues))
