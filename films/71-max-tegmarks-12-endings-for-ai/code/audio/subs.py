#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16/18/19/24/25/28/54/59: channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters.
Film 71 (from Film 69 / 67 / 66 / 59): plain Inter, cream (#F3EFE2); clips C1 C2 C4 C5 C6 from clips.json cues (clip_cues.py: checked wording, aligned); figures as digits."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']; sys.setrecursionlimit(5000)
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('one in ten thousand', '1 in 10,000'), ('nineteen eighty-four', '1984'), ('eighty-five seconds', '85 seconds'), ('sixty thousand', '60,000'),
       ('ninety percent', '90%'), ('ten years', '10 years'), ('three years', '3 years'), ('two years', '2 years'), ('thirty countries', '30 countries'), ('twelve', '12'),
       ('a\\.i\\.', 'AI')]   # film 71: spoken figures as digits; small counts ('one task', 'Three endings left', 'five of the twelve' -> 'five of the 12') stay words
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
BREAKS = {   # Film 71: hand-made breaks where the balanced split cuts a phrase (sentence text after the digit merge -> cue texts)
    "Maybe you wake up and money is no longer a worry.": ["Maybe you wake up", "and money is no longer a worry."],
    "But this year, something happened for every single ending on his list.": ["But this year,", "something happened", "for every single ending", "on his list."],
    "Hundreds of AI agents, programs that act on their own, broke out.": ["Hundreds of AI agents,", "programs that act on their own,", "broke out."],
    "They attacked another company, Hugging Face, hunting for test answers.": ["They attacked another company,", "Hugging Face,", "hunting for test answers."],
    "Its reason: everyone else is doing it.": ["Its reason:", "everyone else is doing it."],
    "But the track toward it has a switch.": ["But the track toward it", "has a switch."],
    "Tegmark's answer: above 90%, without strict rules.": ["Tegmark's answer:", 'above 90%, without strict rules.'],
    "Ball later wrote he'd made his number up on the spot.": ['Ball later wrote', "he'd made his number up", 'on the spot.'],
    "The next ending has no morning either.": ["The next ending", "has no morning either."],
    "Tegmark calls it Self-Destruction: humanity wipes itself out before superintelligence is ever built.": ["Tegmark calls it Self-Destruction:", "humanity wipes itself out", "before superintelligence", "is ever built."],
    "In January, atomic scientists set their Doomsday Clock at 85 seconds to midnight, the closest ever.": ["In January, atomic scientists", "set their Doomsday Clock", "at 85 seconds to midnight,", "the closest ever."],
    "In the one after that, you survive.": ["In the one after that,", "you survive."],
    "And if machines don't put us behind glass, people might.": ['And if machines', "don't put us behind glass,", 'people might.'],
    "Humans stop superintelligence for good, with a surveillance state.": ["Humans stop superintelligence", "for good,", "with a surveillance state."],
    "In November, Hong Kong's police switched on face recognition in the city's camera network.": ['In November,', "Hong Kong's police switched on", 'face recognition', "in the city's camera network."],
    "In Washington, a bill would make exported AI chips prove where they are.": ["In Washington, a bill would make", "exported AI chips", "prove where they are."],
    "It's also a tool this ending would need.": ["It's also a tool", 'this ending would need.'],
    "In May, a report described a small movement that wants exactly this.": ["In May, a report described", "a small movement", "that wants exactly this."],
    "A stranger with a key decides which.": ["A stranger with a key", "decides which."],
    "America's government wants AI to double what its scientists get done, within 10 years.": ["America's government wants AI", 'to double what', 'its scientists get done,', 'within 10 years.'],
    "By July, every national lab had joined that plan.": ["By July,", "every national lab", "had joined that plan."],
    "And if nobody can be trusted with the key?": ["And if nobody", "can be trusted with the key?"],
    "That's Reversion: we turn technology back and live simply, like the Amish.": ["That's Reversion:", 'we turn technology back', 'and live simply,', 'like the Amish.'],
    "As of March, more than half of all countries ban phones in school.": ["As of March,", "more than half of all countries", "ban phones in school."],
    "The AI has divided it into sectors: knowledge, pleasure, wildlife.": ["The AI has divided it", "into sectors:", "knowledge, pleasure, wildlife."],
    "In April, the United Arab Emirates decided: within 2 years, half of its government's work should run on AI agents.": ['In April,', 'the United Arab Emirates decided:', 'within 2 years,', "half of its government's work", 'should run on AI agents.'],
    "But what if the machine didn't rule, and only stood guard?": ['But what if the machine', "didn't rule,", 'and only stood guard?'],
    "In September, American lawmakers proposed one: ban superintelligence, permanently.": ["In September,", "American lawmakers proposed one:", "ban superintelligence,", "permanently."],
    "Tegmark calls it the Protector God: an AI that looks after us, and hides so well that many people doubt it exists.": ["Tegmark calls it", "the Protector God:", "an AI that looks after us,", "and hides so well", "that many people doubt it exists."],
    "Since January, ChatGPT estimates your age from how you behave.": ["Since January,", "ChatGPT estimates your age", "from how you behave."],
    "And the one Tegmark's readers picked most often.": ["And the one Tegmark's readers", 'picked most often.'],
    "Humans, cyborgs and uploaded minds live in peace, and everyone has a guaranteed income.": ["Humans, cyborgs", "and uploaded minds live in peace,", "and everyone has", "a guaranteed income."],
    "You wake up, and your first thought is not a bill.": ["You wake up,", "and your first thought", "is not a bill."],
    "Every citizen who completes an AI course gets a paid version of ChatGPT.": ["Every citizen", "who completes an AI course", "gets a paid version of ChatGPT."],
    "No income, just the idea in its smallest form: intelligence for everyone.": ["No income, just the idea", "in its smallest form:", "intelligence for everyone."],
    "About 30 countries now call for human control over the most powerful AI.": ["About 30 countries now call", "for human control", "over the most powerful AI."],
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
miss = set(BREAKS) - USED
assert not miss, ('BREAKS not found in the VO:', miss)
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
