#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16/18: style = channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('a hundred and ninety million dollars', '$190 million'), ('one point four trillion dollars', '$1.4 trillion'),   # Film 18
       ('ninety-six billion dollars', '$96 billion'), ('two to six million dollars', '$2-6 million'), ('seventeen thousand dollars', '$17,000'),
       ('a hundred and twenty thousand', '120,000'), ('two hundred and forty-four', '244'), ('eight and a half thousand', '8,500'),
       ('twenty twenty-two', '2022'), ('twenty twenty-one', '2021'), ('twenty nineteen', '2019'), ('twenty seventeen', '2017'),
       ('twenty twelve', '2012'), ('two thousand nine', '2009'), ('nineteen forty-seven', '1947'), ('nineteen ninety', '1990'),
       ('nineteen oh four', '1904'), ('the year two thousand', 'the year 2000'), ('ninety-nine percent', '99%'), ('eighty percent', '80%'),
       ('twenty dollars', '$20'), ('thirteen times', '13 times'), ('ten years', '10 years'), ('fourteen', '14'),
       ('a\\.i\\.', 'AI')]   # spoken "A.I." (two letters) -> AI on screen
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
BREAKS = {   # Film 18: keep phrases together where the balanced split would cut them
    'A former Google executive, Mo Gawdat, says exactly that: the base of capitalism, hiring you for a dollar and selling what you make for two, is going to disappear.':
        ['A former Google executive,', 'Mo Gawdat, says exactly that:', 'the base of capitalism,', 'hiring you for a dollar', 'and selling what you make for two,', 'is going to disappear.'],
    "Between April and June this year, America's biggest companies kept more profit from every dollar than at any point since the count began in 2009.":
        ['Between April and June this year,', "America's biggest companies", 'kept more profit from every dollar', 'than at any point', 'since the count began in 2009.'],
    "Then everything made from thinking gets cheaper, and cheaper, until there's almost nothing left to charge for.":
        ['Then everything made', 'from thinking gets cheaper,', 'and cheaper,', "until there's almost", 'nothing left to charge for.'],
    'First words and code: a draft, a summary, a bug fix, for cents.':
        ['First words and code:', 'a draft, a summary, a bug fix,', 'for cents.'],
    'Then advice: the second opinion on your scan, the lease your landlord sent.':
        ['Then advice:', 'the second opinion on your scan,', 'the lease your landlord sent.'],
    'Chegg sold homework help to students.':
        ['Chegg sold homework help', 'to students.'],
    'Since 2021, it has lost 99% of its value.':
        ['Since 2021,', 'it has lost 99% of its value.'],
    'A year ago it cut almost half its staff and named AI as a reason.':
        ['A year ago it cut almost', 'half its staff', 'and named AI as a reason.'],
    "The people who built those products didn't fail.":
        ['The people who built', "those products didn't fail."],
    'In a study published in 2019, researchers asked people what it would take to give up search engines, which cost them nothing.':
        ['In a study published in 2019,', 'researchers asked people', 'what it would take', 'to give up search engines,', 'which cost them nothing.'],
    'Sam Altman, who runs OpenAI, wrote last year that "the cost of intelligence should eventually converge to near the cost of electricity."':
        ['Sam Altman, who runs OpenAI,', 'wrote last year that', '"the cost of intelligence', 'should eventually converge', 'to near the cost of electricity."'],
    'Nvidia, which designs the chips, took in $96 billion in a single quarter this summer.':
        ['Nvidia, which designs the chips,', 'took in $96 billion', 'in a single quarter this summer.'],
    'It kept three quarters of every dollar as gross profit.':
        ['It kept three quarters', 'of every dollar as gross profit.'],
    'The county says land for one now sells for $2-6 million an acre.':
        ['The county says land', 'for one now sells for', '$2-6 million an acre.'],
    'Across 14 rich countries, about 80% of the rise in house prices since the Second World War came from one thing: the land underneath.':
        ['Across 14 rich countries,', 'about 80% of the rise', 'in house prices since', 'the Second World War', 'came from one thing:', 'the land underneath.'],
    'Now look at the first picture again: record margins, record low for work.':
        ['Now look at', 'the first picture again:', 'record margins,', 'record low for work.'],
    'What would it look like now: a world where almost everything is abundant, and the few things that stay scarce are shared, fairly?':
        ['What would it look like now:', 'a world where almost', 'everything is abundant,', 'and the few things', 'that stay scarce', 'are shared, fairly?'],
    'The United States built GPS and switched it on for the whole world, free.':
        ['The United States built GPS', 'and switched it on', 'for the whole world, free.'],
    'By 2017, American companies alone had gained about $1.4 trillion from it.':
        ['By 2017, American companies', 'alone had gained about', '$1.4 trillion from it.'],
    "That's the rule for whatever AI makes abundant: a free layer, like roads, paid for together instead of at a door, one by one.":
        ["That's the rule for whatever AI", 'makes abundant:', 'a free layer, like roads,', 'paid for together', 'instead of at a door, one by one.'],
    'Since last year, the German state of Baden-Württemberg taxes property on the value of the land alone, not the building.':
        ['Since last year,', 'the German state', 'of Baden-Württemberg', 'taxes property on the value', 'of the land alone,', 'not the building.'],
    'Housing: since 2019, when Vienna zones new land for homes, two thirds of it usually has to be affordable apartments.':
        ['Housing: since 2019,', 'when Vienna zones', 'new land for homes,', 'two thirds of it usually', 'has to be affordable apartments.'],
    'Now ask the same question about the data center going up on that field in Virginia.':
        ['Now ask the same question', 'about the data center going up', 'on that field in Virginia.'],
    "I think that's the best news in this story: the end of capitalism isn't something to survive.":
        ["I think that's the best news", 'in this story:', 'the end of capitalism', "isn't something to survive."],
    'The ground it stands on is still ours to decide.':
        ['The ground it stands on', 'is still ours to decide.'],
}
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
            m = re.fullmatch('(' + a + r')([.,?!]?)', ' '.join(x['w'] for x in seg), flags=re.I) if len(seg) == k else None
            if m:   # Film 16: only punctuation after the pattern is kept (so "A.I." does not leave a stray dot)
                out.append({**seg[0], 'w': b + m.group(2), 'e': seg[-1]['e']}); i += k; break
        else: out.append(W[i]); i += 1
    return out
W = merge(W)
sents, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None
    if not nxt or re.search(r'[.?!]["”]?$', w['w']) or nxt['s'] - w['e'] > .6 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
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
