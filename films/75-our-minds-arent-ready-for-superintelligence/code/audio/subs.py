#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters. Film 75 (from Film 69): plain Inter, cream (#F3EFE2);
clips C2 K1 C1 from clips.json cues (clip_cues.py: original wording, aligned on the clip sound); spoken figures as digits; 'E. O. Wilson' is one sentence."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']; sys.setrecursionlimit(5000)
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('seven hundred billion dollars', '$700 billion'), ('four hundred and thirty million', '430 million'), ('a hundred and thirty-five', '135'),
       ('three and a half months', '3.5 months'), ('twenty twenty-eight', '2028'), ('nineteen eighties', '1980s'), ('twenty seventeen', '2017'),
       ('seven years', '7 years'), ('two years', '2 years'), ('five years', '5 years'), ('ten seconds', '10 seconds'), ('fifteen chatbots', '15 chatbots'),
       ('a\\.i\\.', 'AI')]   # film 75: spoken figures as digits; 'three world leaders' (after 2017), 'three old reflexes', 'one year', 'two thirds', 'one breath' stay words
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
BREAKS = {   # Film 75: hand-made breaks where the balanced split cuts a phrase (sentence text after the digit merge -> cue texts)
    "Because the alarm in your head is older than reading.": ["Because the alarm in your head", "is older than reading."],
    "On one leading measure, the length of a task AI can finish on its own doubles roughly every 3.5 months.": ["On one leading measure,", "the length of a task AI", "can finish on its own", "doubles roughly every 3.5 months."],
    "AI reached gold-medal level at the Math Olympiad 5 years before they expected it.": ["AI reached gold-medal level", "at the Math Olympiad", "5 years before they expected it."],
    "A seat belt for the brain: it holds, even when you aren't paying attention.": ["A seat belt for the brain:", "it holds, even when", "you aren't paying attention."],
    "Its last rules won't apply until 2028.": ["Its last rules", "won't apply until 2028."],
    "He has a bigger word for that clock.": ["He has a bigger word", "for that clock."],
    "So much of your own mind runs unwatched.": ["So much of your own mind", "runs unwatched."],
    "Companies and governments are working to know you better than you know yourself.": ["Companies and governments", "are working to know you", "better than you know yourself."],
    "And whoever does can sell you anything.": ["And whoever does", "can sell you anything."],
    "Whether that is your way stays open.": ["Whether that is your way", "stays open."],
    "This year, four tech giants plan to spend more than $700 billion, mostly on AI.": ["This year, four tech giants", "plan to spend", "more than $700 billion,", "mostly on AI."],
    "And you know your reflexes by name.": ["And you know", "your reflexes by name."],
    "Demis Hassabis, a co-founder of Google DeepMind, has proposed a body that tests the most powerful models before launch.": ["Demis Hassabis,", "a co-founder of Google DeepMind,", "has proposed a body that tests", "the most powerful models", "before launch."],
    "Last month, the head of the United Nations called for a global framework for AI risks, within one year.": ["Last month,", "the head of the United Nations", "called for a global framework", "for AI risks, within one year."],
    "According to the UN's technology envoy, in 2017 three world leaders raised concerns about AI at the UN General Assembly.": ["According to", "the UN's technology envoy,", "in 2017 three world leaders", "raised concerns about AI", "at the UN General Assembly."],
    "That is the first clock you can set.": ["That is the first clock", "you can set."],
    "This channel exists so that the arrival of superintelligence goes well for everybody.": ["This channel exists", "so that the arrival", "of superintelligence", "goes well for everybody."],
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
    if not nxt or (re.search(r'[.?!]["”]?$', w['w']) and not re.fullmatch(r'[A-Z]\.', w['w'])) or nxt['s'] - w['e'] > .6 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
cues = [[c[0]['s'], c[-1]['e'], fix(' '.join(x['w'] for x in c))] for snt in sents for c in pieces(snt)]
# clip slots C2, K1, C1: original wording (cuts.json, clip_cues.py) with phrase times (clips.json "cues", seconds from the slot start)
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
