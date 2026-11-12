#!/usr/bin/env python3
"""Film 28 · provisional timing.json from the script until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Films 24/25), so scene code written against
it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C1')), never on seconds,
so small text changes (the vo-v5 fact check) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v5.txt / vo-v4.txt in the data root ($F28ROOT, default /mnt/project-files/scenario/film-gute-ki/).
Format of vo-vN.txt: paragraphs (one or more sentences per line, blank lines between). Tags:
  [CLIP Cn]          a silent slot (interview footage with its own sound), estimated length CLIP_LEN        kind 'clip'
  [CLIP C4]          NASA replay: MUTE footage UNDER the next VO sentence (under: True, adds no time)     kind 'clip'
  [O-TON JAKOB: "…"] spoken by the NARRATOR now (decision 11.11.): the quoted text is read as a normal VO line
  [pause]            a standalone line or inline: PAUSE s of air (Eleven v4 tag)
  [serious] [curious] [thoughtful] [warm] [amazed]: voice tags, no time
Pace: Film 25's provisional pace (PACE 1.12 → ≈ 2.49 words/s of speech incl. small gaps, like Film 24's real VO). LEAD 0.6 s (picture
first), sentence gap .40, line gap .36, section gap 1.1, end tail 15 s (the quiet end screen)."""
import json, os, re, sys
ROOT = os.environ.get('F28ROOT', '/mnt/project-files/scenario/film-gute-ki/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-v5.txt', 'vo-v4.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 15.0, 1.1, 0.8
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
# clip lengths = the real cuts (<ROOT>clips-f28.md, loaded 11.11.): C3a Harrell hook 3.9 s, C1 Jones 14.7 s, C3 Harrell 9.2 s,
# C4 NASA replay 6.0 s MUTE under the VO, C5b Rand 9.8 s ("…politely presented non-conspiratorial explanations…"; replaces C5, the
# script tag [CLIP C5] is read as slot C5b). The picture anchors on T.clip(id) only.
CLIP_LEN = {'C3a': 3.9, 'C1': 14.7, 'C3': 9.2, 'C4': 6.0, 'C5b': 9.8}
ALIAS = {'C5': 'C5b'}
UNDER = {'C4'}
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the countdown stations (numbers only in the picture, never spoken): id, first words of the sentence that opens it
SECS = [('H', 'All over the world'), ('12', 'At the far edge'), ('11', 'That machine was built to listen'), ('10', 'Wind turbines make'),
        ('9', 'The Nazca desert'), ('8', 'Methane is invisible'), ('7', 'Casey Harrell knows'), ('6', 'Big ships are supposed'),
        ('5', 'In the open ocean'), ('4', "You're driving a train"), ('3', 'The snake'), ('2', 'Everyone knows'),
        ('1', 'Flash floods are the deadliest'), ('E', 'Satellites built to watch fields and forests.')]
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\b[^\]]*\]')
OTON = re.compile(r'\[O-TON[^:\]]*:\s*["“](.*?)["”]\s*\]')
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, segs, clips, si, under_next = LEAD, None, 0, [], {}, [], 0, None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = ALIAS.get(m.group(1), m.group(1))
        if cid in UNDER:   # mute footage under the next sentence: placed when that sentence starts
            under_next = cid; continue
        L = CLIP_LEN[cid]
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    o = OTON.fullmatch(l)
    body = o.group(1) if o else l
    # inline [pause] → a marker token that adds air; other tags vanish
    body = PAUSE_T.sub(' ‖ ', body)
    body = re.sub(r'\[[^\[\]]*\]', '', body).strip()
    for ab in ('A.I.', 'A.L.S.', 'U.N.'):   # protect abbreviations (a sentence may end on one)
        body = re.sub(re.escape(ab) + r'(?=\s+[A-Z])', ab[:-1].replace('.', '·') + '.', body).replace(ab, ab.replace('.', '·'))
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
        s = s.strip()
        lead_pause = s.startswith('‖')
        s = s.replace('‖', ' ').strip()
        if lead_pause: t += PAUSE
        if not s: continue
        if si < len(SECS) and s.startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += GAP_SEC - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
        if under_next:
            clips.append({'id': under_next, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + CLIP_LEN[under_next], 3), 'under': True}); under_next = None
        for w in s.split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None: start = t
            tok, w = w, w.replace('·', '.')
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if tok[-1] in '.!?': t += GAP_SENT
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += GAP_SENT
            elif w[-1] in ',:;': t += GAP_COMMA
        segs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_LINE
if si < len(SECS): raise SystemExit(f'section opener not found: {SECS[si]}')
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips if not c['under'])
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}; spoken part without slots ≈ {words[-1]["e"] - slot:.1f} s), '
      f'{len(words)} words -> {OUT}')
rate = len(words) / (words[-1]['e'] - LEAD - slot - sum(1 for c in clips if not c['under']) * (SLOT_IN + SLOT_OUT))
print(f'pace {PACE}: {rate:.2f} words/s of speech incl. pauses (Film 24 real VO: 2.49)')
print('slots:', [(c['id'], c['start'], c['end'], 'under' if c['under'] else '') for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
