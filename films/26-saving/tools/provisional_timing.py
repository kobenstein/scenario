#!/usr/bin/env python3
"""Film 26 · provisional timing.json from the script, until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, Film 24/25), so scene code written against it
runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C1')), never on seconds,
so the small wording changes of the fact check (vo-v3) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v4.txt / vo-v3.txt / vo-v2.txt in the data root ($F26ROOT, default /mnt/project-files/scenario/film-sparen/).
Format of vo-vN.txt: paragraphs (one or more sentences per line, blank lines between); a line that is only a tag is a SILENT SLOT:
  [CLIP Cn]   an interview clip (C1 Musk Moonshots, C2 Diamandis, C3 Tesla 2019, C4 Acemoglu, C5 FDR), length from <ROOT>clips.json
              (dauer_s of the recommended clip), else CLIP_LEN below                                          kind 'clip'
  [pause] / [PAUSE …] at the start of a line or alone: 1.2 s of air (no slot). Other [tags] (eleven-v4 directions) are dropped.
Pace: PACE 1.05 → ≈ 2.5 words/s of speech incl. pauses (Film 24 real VO 2.49, Film 25 the same). LEAD 0.6 s (picture first),
sentence gap .36, line gap .32, section gap 1.1, end tail 15 s (end screen)."""
import json, os, re, sys
ROOT = os.environ.get('F26ROOT', '/mnt/project-files/scenario/film-sparen/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-v4.txt', 'vo-v3.txt', 'vo-v2.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 15.0, 1.1, 1.2
PACE = float(os.environ.get('PACE', 1.05))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
CLIP_LEN = {'C1': 14.4, 'C2': 5.6, 'C3': 6.4, 'C4': 6.25, 'C5': 12.6}   # clips.json 10.11. (recommended takes)
try:   # the research agent's clips.json wins (dauer_s of the recommended clip per id)
    for c in json.load(open(ROOT + 'clips.json')).get('clips', []):
        if c.get('kandidat', 'Empfehlung') == 'Empfehlung' and c.get('id') in CLIP_LEN and c.get('dauer_s'): CLIP_LEN[c['id']] = float(c['dauer_s'])
except Exception: pass
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections (docs/shots.md §2): id, first words of the sentence that opens it (case-sensitive: "Two: everything gets cheap" does not open 3)
SECS = [('H', 'Elon Musk says saving money'), ('1', 'Last winter, on a podcast'), ('2', 'The first line is where'), ('3', 'Everything gets cheap'),
        ('4', 'Someone pays you an income'), ('5', 'It arrives in time'), ('6', "If he's wrong, you're still fine"), ('7', 'There is'),
        ('8', 'The five lines, then')]
SLOT = re.compile(r'\[CLIP\s+(C\d+)\b[^\]]*\]', re.I)
PAUSE_T = re.compile(r'^\[(pause)[^\]]*\]\s*', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, segs, clips, si = LEAD, None, 0, [], {}, [], 0
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1).upper(); L = CLIP_LEN[cid]
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    while True:   # leading tags: [pause] adds air, eleven-v4 directions ([calm, conversational], [warm] …) are dropped
        mp = re.match(r'^\[([^\]]*)\]\s*', l)
        if not mp: break
        if PAUSE_T.match(l): t += PAUSE
        l = l[mp.end():]
    if not l: continue
    body = re.sub(r'\[[^\[\]]*\]', '', l).strip()
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):   # one segment per sentence, so a section can open mid-paragraph
        s = s.strip()
        if not s: continue
        if si < len(SECS) and s.startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += GAP_SEC - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
        for w in s.split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None: start = t
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if w[-1] in '.!?': t += GAP_SENT
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += GAP_SENT
            elif w[-1] in ',:;': t += GAP_COMMA
        segs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_LINE
if si < len(SECS): print('WARNING: sections not found:', [s for s in SECS[si:]])
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips)
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}; spoken part without slots ≈ {words[-1]["e"] - slot:.1f} s), '
      f'{len(words)} words -> {OUT}')
rate = len(words) / (words[-1]['e'] - LEAD - slot - len(clips) * (SLOT_IN + SLOT_OUT))
print(f'pace {PACE}: {rate:.2f} words/s of speech (Film 24 real VO: 2.49)')
print('slots:', [(c['id'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
print('sections:', {k: round(v, 1) for k, v in first.items()})
