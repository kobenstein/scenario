#!/usr/bin/env python3
"""Film 18 · provisional timing.json from the script (vo-v4.txt) until the audio agent writes audio/timing.json.
Same format as audio/build_vo.py ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.S), never on seconds, and never on segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json] [--card 0]
Pace ~170 words/min plus punctuation pauses (Film 18: the v3 listening draft runs 565 s); LEAD 1.0 s, paragraph gap 0.75 s, section gap 1.5 s, end-screen tail 15 s.
--card S inserts a silent slot of S seconds per [[QUOTE CARD]] (default 0: the owner wants the voice to run on under cards)."""
import json, os, re, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else '/mnt/project-files/scenario/film-kapitalismus/vo-v4.txt'
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
CARD = float(sys.argv[sys.argv.index('--card') + 1]) if '--card' in sys.argv else 0.0
LEAD, TAIL, GAP_PARA, GAP_SEC, WORD = 1.0, 15.0, 0.75, 1.5, 0.31   # Film 18: pace calibrated to hoerfassung-v3.mp3 (565 s)
# sections: id, first words of the paragraph that opens it (the stations of text-v2.md)
SECS = [('1', 'A.I. will end capitalism'), ('2', 'Capitalism, in one sentence'), ('3', 'But that\'s not the real ending'), ('4', "We've watched a price"),
        ('5', 'The doors are the things'), ('6', "That isn't a law of nature"), ('7', 'The second set of rules'), ('8', "Capitalism won't end")]
TAG = re.compile(r'\[[^\[\]]*\]')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(SRC).read()) if p.strip()]
t, sec, n, words, secs, clips = LEAD, None, 0, [], {}, []
for pi, p in enumerate(paras):
    first = next((TAG.sub('', l).strip() for l in p if not l.startswith('[[')), '')
    hit = next((s for s, w in SECS if first.startswith(w)), None)
    if hit and hit != sec:
        if sec is not None: t += GAP_SEC - GAP_PARA
        sec = hit
    sid = f's{n:02d}'; n += 1; start = None
    for l in p:
        m = re.fullmatch(r'\[\[(QUOTE CARD|ON SCREEN):\s*(.*)\]\]', l)
        if m:
            if m.group(1) == 'QUOTE CARD':
                clips.append({'id': f'Q{len(clips) + 1}', 'sec': sid, 'kind': 'card', 'start': round(t, 3), 'end': round(t + CARD, 3), 'text': m.group(2)})
                t += CARD
            continue
        if l.strip() == '[pause]': t += 1.0; continue
        for w in TAG.sub('', l).split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None: start = t
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if w.endswith('...'): t += .55
            elif w[-1] in '.!?': t += .38
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += .38
            elif w[-1] in ',:;': t += .16
    if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_PARA
total = round(t - GAP_PARA + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
print(f'duration {total:.1f} s, {len(words)} words, {len(clips)} cards (slot {CARD} s) -> {OUT}')
for k, v in secs.items(): print(k, v['sec'], v['start'], v['end'])
