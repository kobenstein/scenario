#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir> [wav_dir]
Channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters, no word highlighting; plain Inter (Regular) in cream.
Film 65 (from #29): spoken big numbers as digits (NUM). Clip slots:
  S1, C1, S2 = REAL FOOTAGE: subtitled with the words AS HEARD (S2: "In those moments ..."), in the .srt AND burned into the .ass (the speaker's name
               is in the picture; the .srt carries "[Name]" on the first cue). Word times: spread by length over the voiced span of <wav_dir>/clipwav/<id>.wav
               (10-ms frames above -40 dBFS), else over the slot.
  C10        = QUOTE CARD (silent slot): .srt only (the card shows the text in the picture), "[Inside the FBI Podcast] quote" spread over the slot."""
import json, os, re, subprocess, sys
import numpy as np
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'; WAVD = (sys.argv[3].rstrip('/') + '/') if len(sys.argv) > 3 else None
W = json.load(open(A + 'timing.json'))['words']; sys.setrecursionlimit(5000)
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('eight billion dollars', '$8 billion'), ('nine hundred thousand', '900,000'), ('a hundred thousand dollars', '$100,000')]
def fix(s):
    for a, b in NUM: s = re.sub(r'\b' + a + r'\b', b, s, flags=re.I)
    return s
MAX = 34   # one line at the large size (~72 px on 1080p), Jakob 2026-10-21
GLUE = {('U.S.', 'Senate.'), ('U.S.', 'Senate'), ('North', 'Carolina'), ('prime', 'minister'), ('Federal', 'Trade'), ('Trade', 'Commission,'), ('code', 'words.'),
        ('trusted', 'contact.'), ('kitchen', 'table.'), ('Canadian', 'dollars.'), ('dating', 'apps,')}   # never split these
FN = set('a an the to of and or that in on for was is it its by with as at from than but if we our'.split())
def length(ws): return len(fix(' '.join(x['w'] for x in ws)))
def split(ws):
    if length(ws) <= MAX or len(ws) < 2: return [ws]
    best, bi = 1e9, 1
    for k in range(1, len(ws)):
        L, R = ws[:k], ws[k:]
        c = abs(length(L) - length(R)) + (0 if not ws[k - 1]['w'].endswith((',', ';', ':')) else -45)
        c += 30 if ws[k - 1]['w'].lower() in FN else 0
        c += 40 if len(R) < 2 or len(L) < 2 else 0   # #29: 2-word pieces allowed (the flash-cue penalty below keeps them readable)
        c += 20 if length(L) > MAX or length(R) > MAX else 0   # #29: prefer two pieces that both fit
        c += 35 if min(L[-1]['e'] - L[0]['s'], R[-1]['e'] - R[0]['s']) < 0.9 else 0   # #29: no flash cues
        c += 80 if (L[-1]['w'], R[0]['w']) in GLUE else 0
        if c < best: best, bi = c, k
    return split(ws[:bi]) + split(ws[bi:])
# hand-made breaks where the balanced split would cut a phrase: sentence text -> cue texts, same words in order
BREAKS = {}   # Film 54: none, the balanced split is used (add 'sentence': ['piece', ...] where it cuts a phrase badly)
def pieces(snt):
    k = ' '.join(x['w'] for x in snt)
    if k not in BREAKS: return split(snt)
    out, i = [], 0
    for p in BREAKS[k]:   # consume merged words until they spell the piece (a merged number like "$96 billion" is one word with a space)
        j = i + 1
        while j < len(snt) and ' '.join(x['w'] for x in snt[i:j]) != p: j += 1
        out.append(snt[i:j]); i = j
    assert i == len(snt) and [' '.join(x['w'] for x in c) for c in out] == BREAKS[k], k
    return out
# Film 8: merge spoken numbers into one token before splitting, so "five hundred and sixty thousand" becomes "560,000" even across cue breaks
def merge(W):
    out, i = [], 0
    while i < len(W):
        for a, b in NUM:
            k = len(a.replace('\\', '').split())
            seg = W[i:i + k]
            m = re.fullmatch('(' + a + r')([.,?!…]*)', ' '.join(x['w'] for x in seg), flags=re.I) if len(seg) == k else None
            if m:   # Film 16: only punctuation after the pattern is kept (so "A.I." does not leave a stray dot)
                out.append({**seg[0], 'w': b + m.group(2), 'e': seg[-1]['e']}); i += k; break
        else: out.append(W[i]); i += 1
    return out
W = merge(W)
sents, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None
    if not nxt or (re.search(r'[.?!]["”]?$', w['w']) and w['w'] not in ('U.S.', 'A.I.')) or nxt['s'] - w['e'] > .6 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
cues = [[c[0]['s'], c[-1]['e'], fix(' '.join(x['w'] for x in c))] for snt in sents for c in pieces(snt)]
# Film 65: clip slots. Footage (S1, C1, S2): the words as heard, .srt + .ass; the quote card C10: .srt only. [Speaker] on the first .srt cue.
SPEAKER = {'S1': 'Deborah Del Mastro', 'C1': 'Mark Meador', 'S2': 'Paul Benda', 'C10': 'Inside the FBI Podcast'}
def voiced(cid):
    if not WAVD or not os.path.exists(WAVD + f'clipwav/{cid}.wav'): return None
    x = np.abs(np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', WAVD + f'clipwav/{cid}.wav', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']), np.float32))
    on = np.nonzero(np.array([x[i:i + 160].max() for i in range(0, len(x) - 160, 160)]) > 10 ** (-40 / 20))[0]
    return (on[0] * .01, (on[-1] + 1) * .01) if len(on) else None
srt_only, clipcues = [], []
for c in json.load(open(A + 'timing.json')).get('slots', []):
    q = re.sub(r'^[.…\s]+', '', c.get('quote') or '').strip()
    if not q: continue
    v = voiced(c['id']) if c.get('footage') else None
    a0, a1 = (c['start'] + v[0], c['start'] + v[1]) if v else (c['start'] + .15, c['end'] - .2)
    ws = q.split(); L = [len(w) + 1 for w in ws]; tot = sum(L); acc = 0; pw = []
    for w, l in zip(ws, L): pw.append({'w': w, 's': a0 + (a1 - a0) * acc / tot, 'e': a0 + (a1 - a0) * (acc + l) / tot}); acc += l
    pieces_ = [pw] if length(pw) <= MAX else split(pw)
    for k, piece in enumerate(pieces_):
        txt = fix(' '.join(x['w'] for x in piece))
        lab = '[' + SPEAKER.get(c['id'], '') + '] ' if k == 0 and c['id'] in SPEAKER else ''
        if c.get('footage'): clipcues.append([piece[0]['s'], piece[-1]['e'], txt, lab + txt])
        else: srt_only.append([piece[0]['s'], piece[-1]['e'], lab + txt, True])
cues = cues + [[a, b, t] for a, b, t, _ in clipcues]
SRTTEXT = {round(a, 3): lt for a, b, t, lt in clipcues}   # the .srt shows the label on the first footage cue
cues = [c + [False] for c in cues] + srt_only
cues.sort(key=lambda c: c[0])
for i, c in enumerate(cues):  # hold each cue a little, never overlapping the next
    nx = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
    c[1] = min(max(c[1] + .25, c[0] + 1.0), nx - .04)
def ts(t, sep):   # SRT: hh:mm:ss,mmm · ASS: h:mm:ss.cc (rounded on the integer, so x.9996 never prints as 1000)
    u = 1000 if sep == ',' else 100; n = int(round(t * u)); f = n % u; s_ = n // u
    return f"{s_ // 3600:02d}:{s_ % 3600 // 60:02d}:{s_ % 60:02d}{sep}{f:0{3 if sep == ',' else 2}d}"
with open(OUT + 'subtitles.srt', 'w') as f:
    for i, (a, b, s, _) in enumerate(cues, 1): f.write(f"{i}\n{ts(a, ',')} --> {ts(b, ',')}\n{SRTTEXT.get(round(a, 3), s)}\n\n")
ass = """[Script Info]
ScriptType: v4.00+
PlayResX: 384
PlayResY: 288
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter,19,&H00E2EFF3,&H00E2EFF3,&H80000000,&H00000000,0,0,0,0,100,100,0,0,1,1.4,0,2,20,20,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(OUT + 'subtitles.ass', 'w') as f:
    f.write(ass)
    for a, b, s, quote in cues:
        if quote: continue   # the quote plates show the text in the picture
        f.write(f"Dialogue: 0,{ts(a, '.')[1:]},{ts(b, '.')[1:]},Sub,,0,0,0,,{{\\fad(120,160)}}{s}\n")
print(len(cues), 'cues (', sum(1 for c in cues if c[3]), 'quote cues in the .srt only ); longest', max(len(c[2]) for c in cues if not c[3]))
