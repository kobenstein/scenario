#!/usr/bin/env python3
"""Film 19 · provisional timing.json from the script (vo-v3.txt / vo-v4.txt) until the audio agent writes audio/timing.json.
Same format as audio/build_vo.py ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G), never on seconds, and never on segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Pace calibrated to text-v3.md (≈ 10:14 VO incl. clips, house rule 2.4 words/s); LEAD 0.6 s, paragraph gap 1.1 s, end-screen tail 15 s.
[CLIP Cn] lines become clip slots {id, kind: 'clip', start, end} with the duration from clips.json (+ 0.3 s air on each side)."""
import json, os, re, sys
DATA = '/mnt/project-files/scenario/film-ai-crash/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else (DATA + 'vo-v4.txt' if os.path.exists(DATA + 'vo-v4.txt') else DATA + 'vo-v3.txt')
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_PARA, WORD = 0.6, 15.0, 1.1, 0.33
CLIPDUR = {}
try:
    for c in json.load(open(DATA + 'clips.json'))['clips']: CLIPDUR[c['id']] = float(c.get('dauer_s') or 10)
except Exception: pass
# sections = the stations of text-v3.md, by the first words of the line that opens them
SECS = [('0', "Here's how to survive"), ('1', "If this is the crash, its clock"), ('2', 'Mostly, data centers'), ('3', 'Day thirty-one'),
        ('4', 'Day forty-eight'), ('5', 'But what if the fall'), ('6', 'Day two hundred eighty-two'), ('7', 'Day nine hundred twenty-nine'),
        ('8', 'On a road this long'), ('8b', 'But this boom has a hole'), ('9', 'Day one thousand')]
TAG = re.compile(r'\[[^\[\]]*\]')
lines = [l.rstrip() for l in open(SRC)]
t, sec, words, secs, clips, para_open = LEAD, None, [], {}, [], False
for l in lines:
    if not l.strip():
        if para_open: t += GAP_PARA; para_open = False
        continue
    m = re.fullmatch(r'\s*\[CLIP\s+(C\d+)\]\s*', l)
    if m:
        d = CLIPDUR.get(m.group(1), 10.0)
        t += .3; clips.append({'id': m.group(1), 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + d, 3)}); t += d + .3
        continue
    txt = TAG.sub('', l).strip()
    hit = next((s for s, w in SECS if txt.startswith(w)), None)
    if hit: sec = hit
    para_open = True
    for w in txt.split():
        d = WORD + 0.014 * max(0, len(re.sub(r'\W', '', w)) - 5)
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sec})
        t += d
        if w[-1] in '.!?': t += .42
        elif w[-1] in ',:;': t += .18
    t += .12   # line break = sentence group
total = round(t + TAIL, 3)
for w in words:
    s = secs.setdefault(w['sec'], {'start': w['s'], 'end': w['e'], 'sec': w['sec']}); s['end'] = w['e']
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
print(f'{os.path.basename(SRC)}: VO end {words[-1]["e"]:.1f} s, film {total:.1f} s, {len(words)} words, clips {[(c["id"], c["start"], c["end"]) for c in clips]} -> {OUT}')
for k, v in secs.items(): print(k, v['start'], v['end'])
