#!/usr/bin/env python3
"""Film 24 · provisional timing.json from the script until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE), never on seconds and never on segment ids, so small
text changes (vo-v5 fact check) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v5.txt / vo-v4.txt in the data root (vo-v5 = the fact-checked revision, used as soon as it exists).
Format of vo-vN.txt: one spoken line per line (no blank lines needed); a line that is only [SOUND: …] is a hook sound (pig 1 / pig 2:
a silent slot of SOUND_LEN in "clips" as {id: 'P1'|'P2', kind: 'sound'}); a line that is only [CLIP Cn] is an interview slot (silent,
CLIP_LEN[n] + air before/after, kind 'clip'); [pause] = 1.0 s.
Pace calibrated to the listening draft hoerfassung-v4.mp3 (551.7 s, VO only, no clip or sound slots): WORD tuned so the spoken part
lands near it. LEAD 0.6 s (picture first), line gap 0.32 s, section gap 1.1 s, end-screen tail 15 s."""
import json, os, re, sys
ROOT = os.environ.get('F24ROOT', '/mnt/project-files/scenario/film-tiersprache/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-v5.txt', 'vo-v4.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_LINE, GAP_SEC, WORD, PAUSE = 0.6, 15.0, 0.32, 1.1, 0.288, 1.0
CLIP_LEN = {'C1': 10.0, 'C2': 9.0, 'C3': 8.0, 'C4': 9.0, 'C5': 10.0}   # text-v4 estimates, raised to the 8–15 s slot rule
CLIP_IN, CLIP_OUT = 0.7, 0.6
SOUND_LEN, SOUND_IN, SOUND_OUT = 2.4, 0.35, 0.4                       # the two pig calls of the hook
# sections: id, first words of the line that opens it (the stations S1…S7 of text-v4.md)
SECS = [('H', 'Scientists are trying'), ('1', 'Their A.I. can already'), ('2', 'Every baby on Earth'), ('3', 'Further than you might'),
        ('4', 'Why is meaning so hard'), ('5', 'But suppose they make it'), ('6', 'Twenty thirty. Day one')]
TAG = re.compile(r'\[[^\[\]]*\]')
CLIP = re.compile(r'\[CLIP (C\d+)\]')
SOUND = re.compile(r'\[SOUND:\s*pig (\d)')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, secs, clips = LEAD, None, 0, [], {}, []
for li, l in enumerate(lines):
    m = CLIP.fullmatch(l)
    if m:
        cid = m.group(1); t += CLIP_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + CLIP_LEN[cid], 3), 'under': False})
        t += CLIP_LEN[cid] + CLIP_OUT; continue
    m = SOUND.match(l)
    if m:
        sid = 'P' + m.group(1); t += SOUND_IN - GAP_LINE
        clips.append({'id': sid, 'kind': 'sound', 'sec': sec, 'start': round(t, 3), 'end': round(t + SOUND_LEN, 3), 'under': False})
        t += SOUND_LEN + SOUND_OUT; continue
    if l == '[pause]': t += PAUSE; continue
    body = TAG.sub('', l).strip()
    hit = next((s for s, w in SECS if body.startswith(w)), None)
    if hit and hit != sec:
        if sec is not None: t += GAP_SEC - GAP_LINE
        sec = hit
    sid = f's{n:03d}'; n += 1; start = None
    for w in body.split():
        d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
        if start is None: start = t
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
        t += d
        if w.endswith('...') or w.endswith('…'): t += .55
        elif w[-1] in '.!?': t += .36
        elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += .36
        elif w[-1] in ',:;': t += .15
    if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_LINE
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips)
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}; spoken part without slots ≈ {words[-1]["e"] - slot:.1f} s), '
      f'{len(words)} words, slots {[(c["id"], c["start"], c["end"]) for c in clips]} -> {OUT}')
first = {}
for k, v in secs.items(): first.setdefault(v['sec'], v['start'])
print('sections:', {k: round(v, 1) for k, v in first.items()})
