#!/usr/bin/env python3
"""Film 25 · provisional timing.json from the script until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Film 24), so scene code written against it
runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('J1')), never on seconds,
so small text changes (vo-v4 fact check) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v4.txt / vo-v3.txt in the data root ($F25ROOT, default /mnt/project-files/scenario/film-last-human-job/).
Format of vo-vN.txt: paragraphs (one or more sentences per line, blank lines between); a line that is only a tag is a SILENT SLOT:
  [JAKOB Jn]  Jakob's own voice (o-ton/clips-v1/Jn.wav), real length from O_TON          kind 'oton'
  [CLIP Kn]   an interview clip (Brynjolfsson, Hinton, Gates), estimated length          kind 'clip'
  [PAUSE …]   1.2 s of air                                                               (no slot)
Pace: Film 24's real VO (vo-v5, 1419 words, 627.4 s with 58.6 s of slots → 2.49 words/s incl. pauses); WORD tuned so this script's
spoken part lands at the same rate. LEAD 0.6 s (picture first), sentence gap .36, line gap .32, section gap 1.1, end tail 15 s."""
import json, os, re, sys
ROOT = os.environ.get('F25ROOT', '/mnt/project-files/scenario/film-last-human-job/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-v4.txt', 'vo-v3.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 15.0, 1.1, 1.2
PACE = float(os.environ.get('PACE', 1.12))                   # 1.0 = Film 24's provisional pace; 1.12 → 2.49 words/s like Film 24's real VO
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
O_TON = {'J1': 10.93, 'J2': 15.00, 'J3': 11.47, 'J3b': 6.60, 'J4': 5.60, 'J5': 4.20, 'J6': 5.85}     # real lengths (o-ton/auswahl-v1.md)
CLIP_LEN = {'K1': 13.2, 'K2': 9.7, 'K3': 12.0}   # Brynjolfsson, Hinton, Gates (clips.json 10.11.; K3 maybe a quote card instead)
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections (docs/shots.md §2): id, first words of the sentence that opens it
SECS = [('H', 'There will be a last'), ('1', 'Ten kinds of work'), ('2', 'Number seven'), ('3', 'Number five'),
        ('4', "Number one isn't"), ('5', 'So how do you stay'), ('6', 'Every time the machine took a step')]
SLOT = re.compile(r'\[(JAKOB|CLIP)\s+([JK]\d+b?)\b[^\]]*\]')
PAUSE_T = re.compile(r'\[PAUSE[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, segs, clips, si = LEAD, None, 0, [], {}, [], 0
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        kind, cid = ('oton' if m.group(1) == 'JAKOB' else 'clip'), m.group(2)
        L = O_TON[cid] if kind == 'oton' else CLIP_LEN[cid]
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': kind, 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    body = re.sub(r'\[[^\[\]]*\]', '', l).strip()
    body = re.sub(r'A\.I\.(?=\s+[A-Z])', 'A\u00b7I.', body).replace('A.I.', 'A\u00b7I\u00b7')   # protect the abbreviation (a sentence may end on it)
    # one segment per sentence, so a section can open in the middle of a paragraph
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
        s = s.strip()
        if not s: continue
        if si < len(SECS) and s.startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += GAP_SEC - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
        for w in s.split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None: start = t
            tok, w = w, w.replace('\u00b7', '.')
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if tok[-1] in '.!?': t += GAP_SENT
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += GAP_SENT
            elif w[-1] in ',:;': t += GAP_COMMA
        segs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_LINE
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
