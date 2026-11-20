#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 20: interview-clip slots get their own cue: the transcript lines from clips.json once the clip is in, else "[CLIP C1]" as a placeholder.
Film 14/16/18: style = channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('four and a quarter million dollars', '$4.25 million'), ('a hundred and sixty years', '160 years'),   # Film 20
       ('twenty twenty-seven', '2027'), ('twenty thirty', '2030'), ('twenty fifty', '2050'), ('nineteen twenty-three', '1923'),
       ('more than three thousand', 'more than 3,000'), ('sixty billion', '60 billion'), ('a hundred dollars', '$100'),
       ('one dollar', '$1'), ('fifty times', '50 times'), ('eighty-year-old', '80-year-old'), ('eighty-five', '85'),
       ('Thirty-three', '33'), ('Twenty years ago', '20 years ago'), ('Over twenty', 'Over 20'), ('under twenty', 'under 20'),
       ('twelve months', '12 months'), ('toward twelve', 'toward 12'), ('reach twelve', 'reach 12')]
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
BREAKS = {   # Film 20: keep phrases together where the balanced split would cut them
    "You could be part of the first generation that won't grow old.":
        ["You could be part", "of the first generation", "that won't grow old."],
    "They put a treatment into a living person's eye that is built to make old cells young again.":
        ["They put a treatment", "into a living person's eye", "that is built to make", "old cells young again."],
    "But it makes a question suddenly real.":
        ["But it makes a question", "suddenly real."],
    "Every year, medical research adds a little to how long we live.":
        ["Every year, medical research", "adds a little to how long we live."],
    "For 160 years, that number grew by about three months, year after year.":
        ["For 160 years,", "that number grew", "by about three months,", "year after year."],
    "Whoever is still healthy on that day is the first generation that won't grow old.":
        ["Whoever is still healthy", "on that day", "is the first generation", "that won't grow old."],
    "Today it grows by less than two months a year.":
        ["Today it grows", "by less than two months a year."],
    "And now, some of that push isn't human.":
        ["And now,", "some of that push isn't human."],
    "Labs use artificial intelligence to pick experiments, design molecules, and read how old our cells are.":
        ["Labs use artificial intelligence", "to pick experiments,", "design molecules,", "and read how old our cells are."],
    "Evolution only had to get you through your children's first years.":
        ["Evolution only had", "to get you through", "your children's first years."],
    "Scientists can read a cell's age from marks on its DNA.":
        ["Scientists can read a cell's age", "from marks on its DNA."],
    "They call the low point ground zero.":
        ["They call the low point", "ground zero."],
    "Which makes the better question not why we age, but where that button is.":
        ["Which makes the better question", "not why we age,", "but where that button is."],
    "20 years ago, a Japanese lab found four proteins that reset a grown-up cell to factory settings.":
        ["20 years ago,", "a Japanese lab found four proteins", "that reset a grown-up cell", "to factory settings."],
    "In mice, that grew tumors in several organs.":
        ["In mice, that grew tumors", "in several organs."],
    "More pressing doesn't mean more youth.":
        ["More pressing", "doesn't mean more youth."],
    "Mice whose eyes were already damaged by glaucoma got back about half the sharpness they'd lost.":
        ["Mice whose eyes", "were already damaged by glaucoma", "got back about half", "the sharpness they'd lost."],
    "And this October, in Germany, blood cells from an 80-year-old were turned into nerve stem cells that read under 20.":
        ["And this October, in Germany,", "blood cells from an 80-year-old", "were turned into nerve stem cells", "that read under 20."],
    "Four proteins were the first answer.":
        ["Four proteins", "were the first answer."],
    "Nobody knows which other mix might work better, or how hard to press it.":
        ["Nobody knows which other mix", "might work better,", "or how hard to press it."],
    "That search is too big for people alone.":
        ["That search is too big", "for people alone."],
    "So artificial intelligence is helping.":
        ["So artificial intelligence", "is helping."],
    "One company says it has tested more than 3,000 mixes.":
        ["One company says it has tested", "more than 3,000 mixes."],
    "Over 20 made old liver cells act younger.":
        ["Over 20 made old liver cells", "act younger."],
    "Artificial intelligence, it says, has doubled how fast it finds them.":
        ["Artificial intelligence, it says,", "has doubled", "how fast it finds them."],
    "Artificial intelligence has also redesigned two of the four reset proteins.":
        ["Artificial intelligence", "has also redesigned", "two of the four reset proteins."],
    "In cells, the new versions switched on the signs of a reset more than 50 times as strongly.":
        ["In cells, the new versions", "switched on the signs of a reset", "more than 50 times as strongly."],
    "The protein result hasn't even been published.":
        ["The protein result", "hasn't even been published."],
    "And the clocks that read a cell's age are machine learning too.":
        ["And the clocks that read", "a cell's age", "are machine learning too."],
    "The first results come from three people with glaucoma, like those mice.":
        ["The first results come", "from three people with glaucoma,", "like those mice."],
    "In October, eight weeks in, the company reported no serious side effects.":
        ["In October, eight weeks in,", "the company reported", "no serious side effects."],
    "And in two of the three, parts of the visual field improved.":
        ["And in two of the three,", "parts of the visual field", "improved."],
    "The company behind those liver cells plans its first human trial for 2027.":
        ["The company behind", "those liver cells plans", "its first human trial for 2027."],
    "But what about everything else that goes wrong with age?":
        ["But what about everything else", "that goes wrong with age?"],
    "Four illnesses, four kinds of medicine, four different wards.":
        ["Four illnesses,", "four kinds of medicine,", "four different wards."],
    "Artificial intelligence is coming at the illnesses too, designing medicines from the shapes of proteins.":
        ["Artificial intelligence is coming", "at the illnesses too,", "designing medicines", "from the shapes of proteins."],
    "Decades ago, the field's best-known skeptic did the math for America.":
        ["Decades ago,", "the field's best-known skeptic", "did the math for America."],
    "Cure every major disease of old age, and life expectancy at birth would still be unlikely to pass 85.":
        ["Cure every major disease", "of old age,", "and life expectancy at birth", "would still be unlikely", "to pass 85."],
    "His verdict: in this century, a radically longer life is implausible.":
        ["His verdict:", "in this century,", "a radically longer life", "is implausible."],
    "That “unless” is what the button, the search, and the eye are all about.":
        ["That “unless” is what", "the button, the search,", "and the eye are all about."],
    "He wants more of this research, not less.":
        ["He wants more of this research,", "not less."],
    "So that day isn't one date on the calendar.":
        ["So that day isn't", "one date on the calendar."],
    "So for most of the world, what decides it isn't a birth year.":
        ["So for most of the world,", "what decides it", "isn't a birth year."],
    "Nobody has to lose a year so someone else can gain one.":
        ["Nobody has to lose a year", "so someone else can gain one."],
    "In 1923, the men who discovered insulin sold the patent for $1.":
        ["In 1923,", "the men who discovered insulin", "sold the patent for $1."],
    "A generation later, a reporter asked who owned the patent on the polio vaccine.":
        ["A generation later,", "a reporter asked", "who owned the patent", "on the polio vaccine."],
    "Since then, four kinds of decisions have pulled prices down.":
        ["Since then,", "four kinds of decisions", "have pulled prices down."],
    "Through one such pool, more than 60 billion doses have reached poorer countries.":
        ["Through one such pool,", "more than 60 billion doses", "have reached poorer countries."],
    "In Egypt, no patent stood in the way, and copies brought one hepatitis C treatment under $100.":
        ["In Egypt,", "no patent stood in the way,", "and copies brought", "one hepatitis C treatment", "under $100."],
    "33 American states now buy sickle cell gene therapy together.":
        ["33 American states now buy", "sickle cell gene therapy together."],
    "A trial that pulls on the thread has a goal regulators accept, but not the money it needs.":
        ["A trial that pulls on the thread", "has a goal regulators accept,", "but not the money it needs."],
    "And public research money could come with a promise of access.":
        ["And public research money", "could come with", "a promise of access."],
    "None of this has ever been tried on a rejuvenation therapy.":
        ["None of this has ever been tried", "on a rejuvenation therapy."],
    "So think of your family one more time.":
        ["So think of your family", "one more time."],
    "Research decides when that day comes.":
        ["Research decides", "when that day comes."],
    "The first generation that won't grow old isn't a birth year.":
        ["The first generation", "that won't grow old", "isn't a birth year."],
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
    if c.get('kind') == 'card': continue   # quote cards show their words on screen: no subtitle
    q = CL.get(c['id'], {}).get('cues')
    if not q:   # Film 20: no transcript yet -> one placeholder subtitle over the whole slot, e.g. "[CLIP C1]"
        cues.append([c['start'], c['end'] - .05, f"[CLIP {c['id']}]", 'clip']); continue
    for k, (t0, line) in enumerate(q):   # clips.json "cues": [[seconds from clip start, line], ...] from the clip transcript
        t1 = q[k + 1][0] if k + 1 < len(q) else c['end'] - c['start']
        cues.append([c['start'] + t0, c['start'] + t1 - .05, line, 'clip'])
cues.sort(key=lambda c: c[0])
for i, c in enumerate(cues):  # hold each cue a little, never overlapping the next (clip cues keep their own end)
    nx = cues[i + 1][0] if i + 1 < len(cues) else c[1] + 2
    if len(c) < 4: c[1] = min(max(c[1] + .25, c[0] + 1.0), nx - .04)
    else: c[1] = min(c[1], nx - .04)
cues = [c[:3] for c in cues]
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
for k in BREAKS:
    if k not in USED: print('BREAKS key not found (text changed?):', k[:60])
