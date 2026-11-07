#!/usr/bin/env python3
"""timing.json -> subtitles.srt + subtitles.ass (one line, bottom, phrase by phrase).
usage: subs.py <audio_dir> <out_dir>
Film 14/16/18: style = channel burn-in standard (FontSize 19 on 384x288, Outline 1.4, MarginV 20), one line of max 34 characters."""
import json, re, sys
A, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/'
W = json.load(open(A + 'timing.json'))['words']
# spoken numbers -> digits (longest patterns first: merge() takes the first pattern that matches at a word)
NUM = [('twenty thirty-seven', '2037'), ('eighty-two', '82'),   # Film 23 (clock times, "one in five", "a few hundred" stay words)
       ('a\\.i\\.', 'AI')]   # spoken "A.I." -> AI on screen (timing.json already carries the script's "AI")
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
BREAKS = {   # Film 23: keep phrases together where the balanced split would cut them
    'If you want a Tuesday like this for everyone, subscribe.':
        ['If you want a Tuesday like this', 'for everyone, subscribe.'],
    'The same machines could have sent that warning only to people who pay extra.':
        ['The same machines', 'could have sent that warning', 'only to people who pay extra.'],
    'The mind that found it has seen more scans than every doctor in history put together.':
        ['The mind that found it', 'has seen more scans', 'than every doctor', 'in history put together.'],
    'These days, "we found something" is good news.':
        ['These days,', '"we found something" is good news.'],
    "A whole illness just didn't happen to you, and you're making tea.":
        ['A whole illness', "just didn't happen to you,", "and you're making tea."],
    'She stomps off to school without one.':
        ['She stomps off to school', 'without one.'],
    "She won't be the only one kept waiting today.":
        ["She won't be the only one", 'kept waiting today.'],
    'A new antibiotic, for a germ that shrugged off every other drug.':
        ['A new antibiotic,', 'for a germ that shrugged off', 'every other drug.'],
    'Breakthroughs have become like weather.':
        ['Breakthroughs have become', 'like weather.'],
    'Every night, while the city sleeps, minds that never tire read everything ever written about a disease.':
        ['Every night,', 'while the city sleeps,', 'minds that never tire', 'read everything ever written', 'about a disease.'],
    "People who don't work for the makers.":
        ["People who don't work", 'for the makers.'],
    'Every month, they say, costs lives.':
        ['Every month, they say,', 'costs lives.'],
    'The procedure is booked for Thursday.':
        ['The procedure is booked', 'for Thursday.'],
    'Before it pays the deposit, it asks.':
        ['Before it pays the deposit,', 'it asks.'],
    'The company that built your agent would earn more if you stayed where you are.':
        ['The company that built your agent', 'would earn more', 'if you stayed where you are.'],
    'You came to tell him about the scan.':
        ['You came to tell him', 'about the scan.'],
    'The best version of anything usually goes to whoever pays the most.':
        ['The best version of anything', 'usually goes to', 'whoever pays the most.'],
    'Your kid explains black holes to you with a pea, a spoon and a lot of waving.':
        ['Your kid explains black holes', 'to you with a pea,', 'a spoon and a lot of waving.'],
    "One question, and her tutor wouldn't answer it.":
        ['One question,', "and her tutor wouldn't answer it."],
    "The question was who they'd work for.":
        ['The question was', "who they'd work for."],
    "She looks at you like you're making it up.":
        ['She looks at you', "like you're making it up."],
    '"There was a new antibiotic in the news this morning," you say.':
        ['"There was a new antibiotic', 'in the news this morning,"', 'you say.'],
    'Back then, those research machines were brilliant, and about one in five of their findings didn\'t hold up."':
        ['Back then,', 'those research machines', 'were brilliant,', 'and about one in five', 'of their findings didn\'t hold up."'],
    'Even though its makers lose money."':
        ['Even though', 'its makers lose money."'],
    '"Because back then, most digital helpers worked for whoever built them.':
        ['"Because back then,', 'most digital helpers', 'worked for whoever built them.'],
    'So towns and countries bought it for everyone, the way they once built libraries."':
        ['So towns and countries', 'bought it for everyone,', 'the way they once', 'built libraries."'],
    '"Part of what the machines earned came back to all of us."':
        ['"Part of what the machines earned', 'came back to all of us."'],
    'It was close, and it took years longer than anyone wanted."':
        ['It was close,', 'and it took years longer', 'than anyone wanted."'],
    'Kids who got their answers from a machine did better with it, and worse without it.':
        ['Kids who got their answers', 'from a machine', 'did better with it,', 'and worse without it.'],
    'Then: "And what did you do, back then?"':
        ['Then:', '"And what did you do, back then?"'],
    "One person still doesn't know about your scan.":
        ["One person still doesn't know", 'about your scan.'],
    '"You wanted to tell me something today."':
        ['"You wanted to tell me', 'something today."'],
    'Somewhere, the night shift is starting.':
        ['Somewhere,', 'the night shift is starting.'],
    'I talked about the idea of, your AI could work for you just like your doctor works for you, or just like a lawyer works for you.':
        ['I talked about the idea of,', 'your AI could work for you', 'just like your doctor', 'works for you,', 'or just like a lawyer', 'works for you.'],
    'You can ask questions and nudge him in the right direction, but I really want to make sure he understands it himself.':
        ['You can ask questions', 'and nudge him', 'in the right direction,', 'but I really want to make sure', 'he understands it himself.'],
}
USED = set()
def pieces(snt):
    k = ' '.join(x['w'] for x in snt); USED.add(k)
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
def to_cues(W):
    W = merge(W)
    sents, cur = [], []
    for i, w in enumerate(W):
        cur.append(w); nxt = W[i + 1] if i + 1 < len(W) else None
        if not nxt or re.search(r'[.?!]["”]?$', w['w']) or nxt['s'] - w['e'] > .6 or nxt['sec'] != w['sec']: sents.append(cur); cur = []
    return [[c[0]['s'], c[-1]['e'], fix(' '.join(x['w'] for x in c))] for snt in sents for c in pieces(snt)]
cues = to_cues(W)
# interview clips: real wording with phrase timings from the clip transcript (clips.json "cues", seconds from clip start);
# quote cards show the words on screen, so no subtitle for them
import os
CL = json.load(open(A + 'clips.json')) if os.path.exists(A + 'clips.json') else {}
for c in json.load(open(A + 'timing.json')).get('clips', []):
    cl = CL.get(c['id'], {'card': True})   # Film 14: Q1 is a silent quote card (read on screen, no subtitle)
    if cl.get('card'): continue
    if not cl.get('cues') and cl.get('transcript'):
        # Film 23: no clip audio yet -> spread the transcript over the slot by character count (0.2 s in, 0.3 s out), split like the VO;
        # once clips/<K>.wav exists, set "cues" in clips.json from the real audio
        ws, d = cl['transcript'].split(), c['end'] - c['start'] - .5
        n = sum(len(w) + 1 for w in ws); t, pw = c['start'] + .2, []
        for w in ws:
            dt = d * (len(w) + 1) / n; pw.append({'w': w, 's': t, 'e': t + dt * .9, 'sec': c['id']}); t += dt
        cues += to_cues(pw); continue
    if not cl.get('cues'): continue
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
    if k not in USED: print('BREAKS entry not used (text changed?):', k)
