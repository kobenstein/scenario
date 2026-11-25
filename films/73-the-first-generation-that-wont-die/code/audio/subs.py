#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16/18/19/24/25/28/54/59: channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters.
Film 73 (1:1 from Film 69 / 67 / 66 / 59): plain Inter, cream (#F3EFE2); clips C1 C3 C4 from clips.json cues (clip_cues.py: checked wording of clips-geprueft.json, aligned); figures as digits."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']; sys.setrecursionlimit(5000)
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('ninety-five million dollars', '$95 million'), ('a hundred and twenty', '120'), ('a hundred and fifty', '150'), ('twenty-four fifty-nine', '2459'),
       ('twenty thirty-two', '2032'), ('twenty twenty-five', '2025'), ('twenty thirteen', '2013'), ('fourteen percent', '14%'), ('two percent', '2%'),
       ('two in three', '2 in 3'), ('one in five', '1 in 5'), ('thirty years', '30 years'), ('ten years', '10 years'),
       ('a\\.i\\.', 'AI')]   # film 73: spoken figures as digits (the script writes A.I. for the voice, the subtitles say AI); 'four centuries', 'five careers', 'two terms', 'one cubic millimeter' stay words
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
# hand-made breaks where the balanced split would cut a phrase: sentence text -> cue texts, same words in order
BREAKS = {   # Film 73: hand-made breaks where the balanced split cuts a phrase (sentence text after the digit merge -> cue texts)
    "That's what \"won't die\" means here.": ["That's what \"won't die\"", "means here."],
    "This year, a simple computer model built from that map began to steer a virtual body.": ["This year,", "a simple computer model", "built from that map", "began to steer a virtual body."],
    "There's a second way to stop dying.": ["There's a second way", "to stop dying."],
    "But Kurzweil has moved his date before, and he sells books about this future.": ["But Kurzweil has moved", "his date before,", "and he sells books", "about this future."],
    "This March, a San Francisco startup plugged that simple brain model into a virtual body.": ["This March,", "a San Francisco startup plugged", "that simple brain model", "into a virtual body."],
    "The same executive says that, optimistically, the first human uploads are a few years away, not decades.": ["The same executive", "says that, optimistically,", "the first human uploads", "are a few years away, not decades."],
    "If you could stop dying, would you?": ["If you could stop dying,", "would you?"],
    "Yet most believed that other people would say yes.": ["Yet most believed", "that other people would say yes."],
    "In this scenario, you're older than anyone alive today, and healthy.": ["In this scenario,", "you're older than anyone alive", "today, and healthy."],
    "More time with the person you love.": ["More time", "with the person you love."],
    "A London professor who studies long lives says the old plan, learn, work, retire, is breaking.": ["A London professor", "who studies long lives says", "the old plan, learn, work, retire,", "is breaking."],
    "Power and ideas change hands the same way: when someone goes.": ["Power and ideas change hands", "the same way:", "when someone goes."],
    "It shows that people at the top can keep newcomers out, just by staying.": ["It shows that people at the top", "can keep newcomers out,", "just by staying."],
    "Around the world, people spend close to 10 years of their lives in poor health.": ["Around the world,", "people spend close to 10 years", "of their lives in poor health."],
    "Yet so far, in America, new medical technology has pushed health costs up, not down.": ["Yet so far, in America,", "new medical technology", "has pushed health costs", "up, not down."],
    "Denmark has tied its retirement age by law to how long people live.": ["Denmark has tied", "its retirement age by law", "to how long people live."],
    "Most rules for a world like this have never been written.": ["Most rules for a world like this", "have never been written."],
    "One projection for Sweden suggests its population would grow more slowly than many fear.": ["One projection for Sweden", "suggests its population", "would grow more slowly", "than many fear."],
    "The estimates run from the next decade to four centuries from now.": ["The estimates run", "from the next decade", "to four centuries from now."],
    "And neither the repair nor the copy has worked in a single human being yet.": ["And neither the repair", "nor the copy has worked", "in a single human being yet."],
    "Every generation before us was given the answer.": ["Every generation before us", "was given the answer."],
    "We are the first to be asked the question.": ["We are the first", "to be asked the question."],
}
USED = set()
def pieces(snt):
    k = ' '.join(x['w'] for x in snt)
    if k not in BREAKS: return split(snt)
    USED.add(k)
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
            m = re.fullmatch('(' + a + r')([.,?!]?["”]?)', ' '.join(x['w'] for x in seg), flags=re.I) if len(seg) == k else None
            if m:   # Film 16: only punctuation after the pattern is kept (so "A.I." does not leave a stray dot)
                p = m.group(2); nx = W[i + k]['w'] if i + k < len(W) else ''
                if a.endswith('\\.') and p and p[0] in '"”': p = '.' + p   # Film 67: 'to A.I."' ends the quote AND the sentence
                if a.endswith('\\.') and not p and (not nx or (nx[0].isupper() and W[i + k]['sec'] == seg[-1]['sec'])) and nx not in ('I', 'Claude'): p = '.'   # Film 59: 'A.I. You' ends a sentence
                out.append({**seg[0], 'w': b + p, 'e': seg[-1]['e']}); i += k; break
        else: out.append(W[i]); i += 1
    return out
W = merge(W)
sents, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None
    if not nxt or re.search(r'[.?!]["”]?$', w['w']) or nxt['s'] - w['e'] > .6 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
cues = [[c[0]['s'], c[-1]['e'], fix(' '.join(x['w'] for x in c))] for snt in sents for c in pieces(snt)]
# clip slots C3, C5 (audio only), C2: real wording (clips/schnitt.json, checked with Whisper) with phrase times (clips.json "cues", seconds from the slot start). C1 / C1b are read by the narrator: they come from the VO words.
import os
CL = json.load(open(A + 'clips.json')) if os.path.exists(A + 'clips.json') else {}
if isinstance(CL.get('clips'), list): CL = {c['id']: c for c in CL['clips']}   # clip-schritt.md list form
for c in json.load(open(A + 'timing.json')).get('clips', []):
    cl = CL.get(c['id'], {})   # Film 25: K3 has no 'cues' yet -> no subtitle
    if not cl.get('cues'): continue   # (a quote card with a narrator take has cues; a silent one has none)
    q, base = cl['cues'], c['start'] + cl.get('offset', 0)   # cue times count from the first footage frame (slot start + offset)
    for k, (t0, line) in enumerate(q):
        t1 = q[k + 1][0] if k + 1 < len(q) else min(cl.get('cue_end') or cl.get('dur') or (c['end'] - base), c['end'] - base)
        ws = line.split(); n = len(ws); a0, a1 = base + t0, base + t1 - .05   # words spread evenly over the cue, then split to <= MAX characters per line
        pw = [{'w': w, 's': a0 + (a1 - a0) * k / n, 'e': a0 + (a1 - a0) * (k + 1) / n} for k, w in enumerate(ws)]
        for piece in split(pw): cues.append([piece[0]['s'], piece[-1]['e'], fix(' '.join(x['w'] for x in piece))])
assert USED == set(BREAKS), ('BREAKS not found in the VO:', set(BREAKS) - USED)
cues.sort(key=lambda c: c[0])
for i, c in enumerate(cues):  # hold each cue a little, never overlapping the next
    nx = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
    c[1] = min(max(c[1] + .25, c[0] + 1.0), nx - .04)
def ts(t, sep):
    """srt: hh:mm:ss,mmm · ass: h:mm:ss.cc; round on the whole value first (never ',1000')"""
    u = 1000 if sep == ',' else 100; n = int(round(t * u)); f, s = n % u, n // u
    return f"{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}{sep}{f:0{3 if sep == ',' else 2}d}"
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
Style: Sub,Inter,19,&H00E2EFF3,&H00E2EFF3,&H80000000,&H00000000,0,0,0,0,100,100,0,0,1,1.4,0,2,20,20,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(OUT + 'subtitles.ass', 'w') as f:
    f.write(ass)
    for a, b, s in cues: f.write(f"Dialogue: 0,{ts(a, '.')[1:]},{ts(b, '.')[1:]},Sub,,0,0,0,,{{\\fad(120,160)}}{s}\n")
print(len(cues), 'cues; longest', max(len(c[2]) for c in cues))
