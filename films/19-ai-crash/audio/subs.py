#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16/18: style = channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('day nine hundred twenty-nine', 'day 929'), ('day five hundred seventeen', 'day 517'), ('day two hundred eighty-two', 'day 282'),   # Film 19
       ('day one thousand', 'day 1,000'), ('day forty-eight', 'day 48'), ('day thirty-one', 'day 31'), ('day thirty', 'day 30'),
       ('two hundred fifty thousand dollars', '$250,000'), ('twenty-seven billion dollars', '$27 billion'), ('two trillion dollars', '$2 trillion'),
       ('four hundred dollars', '$400'), ('forty percent', '40%'), ('two percent', '2%'), ('november fifth', 'November 5'), ('october sixth', 'October 6'),
       ('october two thousand two', 'October 2002'), ('twenty twenty-five', '2025'), ('twenty twenty-two', '2022'), ('twenty twenty', '2020'),
       ('two thousand one', '2001'), ('nineteen thirty-three', '1933'), ('nineteen eighty-seven', '1987'), ('nineteen-thirties', '1930s'),
       ('forty years', '40 years'), ('fifteen minutes', '15 minutes'), ('six in ten', '6 in 10'), ('two in a hundred', '2 in 100'), ('ten times', '10 times')]
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
BREAKS = {   # Film 19: keep phrases together where the balanced split would cut them
    "The farthest: two and a half years in.":
        ["The farthest:", "two and a half years in."],
    "Every year, the biggest tech companies spend more on them.":
        ["Every year,", "the biggest tech companies", "spend more on them."],
    "But so far, what customers pay for artificial intelligence is a fraction of what's being built for it.":
        ["But so far,", "what customers pay", "for artificial intelligence", "is a fraction", "of what's being built for it."],
    "So more and more of it runs on borrowed money.":
        ["So more and more of it", "runs on borrowed money."],
    "Three years ago, of every dollar companies borrowed through bonds with good credit ratings, artificial intelligence firms took two cents.":
        ["Three years ago,", "of every dollar companies", "borrowed through bonds", "with good credit ratings,", "artificial intelligence firms", "took two cents."],
    "The main index of artificial intelligence and chip stocks there lost about 40% in under four months.":
        ["The main index", "of artificial intelligence", "and chip stocks there", "lost about 40%", "in under four months."],
    "Everything in you says: do something.":
        ["Everything in you says:", "do something."],
    "Fewer than 2 in 100 moved everything out of stocks.":
        ["Fewer than 2 in 100", "moved everything out of stocks."],
    "A couple of years later, the balances of those who stayed had grown by about half.":
        ["A couple of years later,", "the balances of those who stayed", "had grown by about half."],
    "Those who left and stayed out: about 2%.":
        ["Those who left and stayed out:", "about 2%."],
    "In the loudest week, you don't have to decide anything big.":
        ["In the loudest week,", "you don't have to decide", "anything big."],
    "In 2025, wave after wave of new tariffs shook markets around the world.":
        ["In 2025,", "wave after wave of new tariffs", "shook markets around the world."],
    "And the market had its best day since the financial crisis.":
        ["And the market had its best day", "since the financial crisis."],
    "The week before the sell-off, the new chair of the Federal Reserve, Kevin Warsh, said investors were getting choosier.":
        ["The week before the sell-off,", "the new chair", "of the Federal Reserve,", "Kevin Warsh,", "said investors", "were getting choosier."],
    "Then it reaches people who never owned a single share.":
        ["Then it reaches people", "who never owned a single share."],
    "In May, just two memory-chip companies made about a sixth of the whole world stock market's gains.":
        ["In May, just two", "memory-chip companies", "made about a sixth", "of the whole world", "stock market's gains."],
    "When the dot-com bubble burst, money for young companies more than halved within a year.":
        ["When the dot-com bubble burst,", "money for young companies", "more than halved within a year."],
    "In America, only about 6 in 10 adults could pay it right away from their own money.":
        ["In America,", "only about 6 in 10 adults", "could pay it right away", "from their own money."],
    "Families with even a few hundred dollars set aside were less likely to fall behind on rent.":
        ["Families with even", "a few hundred dollars set aside", "were less likely", "to fall behind on rent."],
    "Back then, the market paid billions for websites that had never made a profit.":
        ["Back then, the market", "paid billions for websites", "that had never made a profit."],
    "Today, the price of using artificial intelligence keeps falling: for the same result, roughly 10 times cheaper every year.":
        ["Today, the price", "of using artificial intelligence", "keeps falling:", "for the same result,", "roughly 10 times cheaper", "every year."],
    "Four protections, all of them yours.":
        ["Four protections,", "all of them yours."],
    "But is it enough if everyone only protects themselves?":
        ["But is it enough", "if everyone only", "protects themselves?"],
    "But the great crashes of the past left something behind: safety nets.":
        ["But the great crashes", "of the past left something behind:", "safety nets."],
    "In the early 1930s, thousands of American banks failed, and with them, people's savings.":
        ["In the early 1930s,", "thousands of American", "banks failed,", "and with them, people's savings."],
    "If your bank failed tomorrow, up to $250,000 in your accounts there would be safe.":
        ["If your bank failed tomorrow,", "up to $250,000", "in your accounts there", "would be safe."],
    "After the financial crisis came the third net: stress tests.":
        ["After the financial crisis", "came the third net:", "stress tests."],
    "Every year, regulators play out a nightmare crash on paper, and check whether the biggest banks would survive it.":
        ["Every year, regulators play out", "a nightmare crash on paper,", "and check whether", "the biggest banks", "would survive it."],
    "A growing part of the debt behind the data centers was never borrowed from a bank.":
        ["A growing part of the debt", "behind the data centers", "was never borrowed from a bank."],
    "Take one giant data center in Louisiana, built for Meta.":
        ["Take one giant data center", "in Louisiana, built for Meta."],
    "About $27 billion of its debt sits in a separate company, mostly owned by an investment firm.":
        ["About $27 billion of its debt", "sits in a separate company,", "mostly owned", "by an investment firm."],
    "None of the three nets was built for it: no insurance, no brake, no stress test like the banks get.":
        ["None of the three nets", "was built for it:", "no insurance, no brake,", "no stress test", "like the banks get."],
    "Who holds it, how much, and who pays if a data center can't.":
        ["Who holds it, how much,", "and who pays", "if a data center can't."],
    "Demis Hassabis runs Google DeepMind.":
        ["Demis Hassabis", "runs Google DeepMind."],
    "Last December, he was asked what happens if there's a bubble and it bursts.":
        ["Last December,", "he was asked what happens", "if there's a bubble", "and it bursts."],
    "A crash puts a new price on a technology.":
        ["A crash puts a new price", "on a technology."],
    "If the last few years are any guide, on day 1,000, artificial intelligence is cheaper than today, and everywhere.":
        ["If the last few years", "are any guide,", "on day 1,000,", "artificial intelligence", "is cheaper than today,", "and everywhere."],
    "And you can stand at the front of it without knowing the name of a single stock.":
        ["And you can stand", "at the front of it", "without knowing the name", "of a single stock."],
    "And if you didn't have to do it alone.":
        ["And if you didn't have", "to do it alone."],
    "Which of these do you already have, and which one is missing?":
        ["Which of these", "do you already have,", "and which one is missing?"],
    "And you know what to carry on the way.":
        ["And you know", "what to carry on the way."],
    "If this is the crash, its clock didn't start on November 5.":
        ["If this is the crash,", "its clock didn't start", "on November 5."],
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
            m = re.fullmatch('(' + a + r')([.,?!:;]?)', ' '.join(x['w'] for x in seg), flags=re.I) if len(seg) == k else None
            if m:   # Film 16: only punctuation after the pattern is kept (so "A.I." does not leave a stray dot)
                c = b[0].upper() + b[1:] if seg[0]['w'][:1].isupper() else b   # Film 19: keep a capital at the start ("Day 31.")
                out.append({**seg[0], 'w': c + m.group(2), 'e': seg[-1]['e']}); i += k; break
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
if isinstance(CL.get('clips'), list): CL = {c['id']: c for c in CL['clips']}   # Film 19: clip_check format (list under "clips")
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
for k in BREAKS:
    if k not in USED: print('BREAK NOT USED:', k)
