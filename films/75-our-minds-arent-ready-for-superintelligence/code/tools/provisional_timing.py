#!/usr/bin/env python3
"""Film 75 · "Our Minds Aren't Ready for Superintelligence" · provisional timing.json from the script until the sound step writes
<ROOT>audio/timing.json. Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, films 24 → 69), so scene code
written against it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C1')), never on
seconds, so the fact-checked vo-v4 (minimal word changes) breaks nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the NEWEST vo-vN.txt (highest N) in the data root ($F75ROOT, default /mnt/project-files/scenario/film-75-godlike/).
Format of vo-vN.txt (#75): paragraphs, blank lines between stations. Tags:
  [CLIP C2: "quote"]  a line of its own: a silent slot for the interview clip (own sound), length = clips-geprueft.json duration_s + .3
                      once it exists, else the placeholders below                                                          kind 'clip'
  [pause] / voice tags: as film 69 (no time for voice tags; [pause] adds PAUSE s).
Pace: PACE 1.12 → ≈ 2.4 words/s of speech incl. small gaps (text-v2 plans 140 w/min → VO end ≈ 10:34).
LEAD 0.6 s (picture first), sentence gap .40, line gap .36, section gap 1.1, end tail 20 s (~5 s after the last word + the 15 s end screen)."""
import json, os, re, sys
ROOT = os.environ.get('F75ROOT', '/mnt/project-files/scenario/film-75-godlike/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
def _newest():
    vs = [(int(m.group(1)), f) for f in os.listdir(ROOT) for m in [re.fullmatch(r'vo-v(\d+)\.txt', f)] if m]
    if not vs: raise SystemExit('no vo-vN.txt in ' + ROOT)
    return ROOT + max(vs)[1]
SRC = args[0] if args else _newest()
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 20.0, 1.1, 0.8   # TAIL = ~5 s quiet after the last word (no QR) + the 15 s end screen
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
# clip lengths = the real cuts (coordinator 25.11., /tmp/claude-0/f75/clips/clips_zeiten.txt, faster-whisper word times ±0.2 s) + .3:
#   C2 Bengio  C2_Bengio_UN.mp4       6.30–17.18 s (10.88 s, 720p source)
#   K1 Wilson  K1_Wilson_BigThink.mp4 12.38–28.84 s (16.46 s; slow speaker, long pauses)
#   C1 Harari  C1_Harari.mp4          9.40–26.72 s (17.32 s)
# <ROOT>clips-geprueft.json duration_s wins once it exists; the real VO timing (<ROOT>audio/timing.json) wins anyway.
CLIP_LEN = {'C2': 11.18, 'K1': 16.76, 'C1': 17.62}
CLIP_SRC = 'clips_zeiten.txt (25.11.)'
try:
    import json as _j
    for _c in _j.load(open(ROOT + 'clips-geprueft.json', encoding='utf8'))['clips']:
        _d = _c.get('duration_s') or _c.get('dauer_s')
        if _c.get('id') in CLIP_LEN and _d: CLIP_LEN[_c['id']] = round(float(_d) + .3, 3); CLIP_SRC = 'clips-geprueft.json'
except (OSError, ValueError, KeyError): pass
# vo-v3 carries the slots as lines of their own ([CLIP C2: "…"]); CLIP_AFTER is only used for a Hörfassung without tags
CLIP_AFTER = [('C2', 'at the Security Council:'), ('K1', 'long before ChatGPT:'), ('C1', 'And a price.')]
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations of the film (text-v2 Fragen-Kette): id, first words of the sentence that opens it
SECS = [('H', "Our minds aren't ready"), ('1', 'To see what it is'), ('2', "Take Europe's AI law"), ('M', 'This channel exists'),
        ('3', 'Is there anything that moves'), ('4', 'Then you notice more'), ('5', 'Tonight, or tomorrow'), ('A2', 'This channel exists')]
SLOT = re.compile(r'\[CLIP\s+([CK]\d+[a-z]?)\b[^\]]*\]')
CARD = re.compile(r'\[ZITATKARTE\s+([CZ]\d+[a-z]?)\b[^\]]*\]')
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
if not any(SLOT.fullmatch(l) for l in paras):   # the Hörfassung has no clip tags: insert them after their lead-in lines
    out, todo = [], list(CLIP_AFTER)
    for l in paras:
        out.append(l)
        if todo and any((l.rstrip().endswith(e) or (not e.endswith('.') and not e.endswith(':') and e in l)) for e in ((todo[0][1],) if isinstance(todo[0][1], str) else todo[0][1])): out.append(f'[CLIP {todo[0][0]}]'); todo.pop(0)
    if todo: raise SystemExit(f'clip lead-in not found: {todo[0]}')
    paras = out
t, sec, n, words, segs, clips, si, card_next = LEAD, None, 0, [], {}, [], 0, None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1); L = CLIP_LEN[cid]
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    m = CARD.fullmatch(l)
    if m: card_next = m.group(1); continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    card_id, card_t0 = card_next, None; card_next = None
    body = PAUSE_T.sub(' ‖ ', l)                       # inline [pause] → a marker token that adds air; other tags vanish
    body = re.sub(r'\[[^\[\]]*\]', '', body).strip()
    body = body.replace('E. O. ', 'E· O· ')                               # E. O. Wilson: no sentence break
    for ab in ('A.I.', 'U.S.', 'U.N.', 'I.P.O.'):                         # protect abbreviations (a sentence may end on one)
        body = re.sub(re.escape(ab) + r'(?=\s+[A-Z])', ab[:-1].replace('.', '·') + '.', body).replace(ab, ab.replace('.', '·'))
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
        s = s.strip()
        lead_pause = s.startswith('‖')
        s = s.replace('‖', ' ').strip()
        if lead_pause: t += PAUSE
        if not s: continue
        if si < len(SECS) and s.lstrip('"“').startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += GAP_SEC - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
        if card_id and card_t0 is None: card_t0 = t
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
    if card_id and card_t0 is not None:
        clips.append({'id': card_id, 'kind': 'card', 'sec': sec, 'start': round(card_t0, 3), 'end': round(words[-1]['e'], 3), 'under': True})
    t += GAP_LINE
if si < len(SECS): raise SystemExit(f'section opener not found: {SECS[si]}')
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips if not c['under'])
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}; spoken part without slots ≈ {words[-1]["e"] - slot:.1f} s), '
      f'{len(words)} words -> {OUT}')
nslot = sum(1 for c in clips if not c['under'])
rate = len(words) / (words[-1]['e'] - LEAD - slot - nslot * (SLOT_IN + SLOT_OUT))
print(f'clip lengths from {CLIP_SRC}: {CLIP_LEN}')
print(f'pace {PACE}: {rate:.2f} words/s of speech incl. pauses (text-v2 plans 140 w/min → VO end ≈ 10:34)')
print('slots:', [(c['id'], c['kind'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
