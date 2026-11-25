#!/usr/bin/env python3
"""Film 73 · provisional timing.json from the script until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Films 24/25/28), so scene code written against
it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C3')), never on seconds,
so small text changes (the fact-checked vo-v3) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the NEWEST vo-vN.txt (highest N) in the data root ($F73ROOT, default /mnt/project-files/scenario/film-73-wont-die/).
vo-v2 carries [CLIP C1] / [CLIP C3] / [CLIP C4] as own lines (film 73); CLIP_AFTER is only the fallback for a version without tags.
Format of vo-vN.txt: paragraphs (one or more sentences per line, blank lines between). Tags:
  [CLIP Cn]          a silent slot (interview footage or audio with its own sound), length = the fixed cut (clips/schnitt.json)   kind 'clip'
  [ZITATKARTE Cn]    a quote card READ BY THE NARRATOR: the next line (the quote, in quotes) is spoken as normal VO; the card slot gets
                     that line's start/end (kind 'card', under: True, adds no time), so the picture can anchor on T.clip('C1')
  [pause]            a standalone line or inline: PAUSE s of air (Eleven v4 tag)
  [calm, conversational] [curious] [thoughtful] [warm]: voice tags, no time
Pace: Film 25/28's provisional pace (PACE 1.12 → ≈ 2.4 words/s of speech incl. small gaps; text-v2 plans 2.4 w/s → VO end ≈ 10:07).
LEAD 0.6 s (picture first), sentence gap .40, line gap .36, section gap 1.1, end tail 25 s (~10 s quiet walk so the 2nd QR window runs ≥ 25 s, then the 15 s end screen)."""
import json, os, re, sys
ROOT = os.environ.get('F73ROOT', '/mnt/project-files/scenario/film-73-wont-die/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
def _newest():
    vs = [(int(m.group(1)), f) for f in os.listdir(ROOT) for m in [re.fullmatch(r'vo-v(\d+)\.txt', f)] if m]
    if not vs: raise SystemExit('no vo-vN.txt in ' + ROOT)
    return ROOT + max(vs)[1]
SRC = args[0] if args else _newest()
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 20.0, 1.1, 0.8   # film 73: TAIL = ~5 s quiet after the last word (no QR) + the 15 s end screen
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
# clip lengths: <ROOT>clips-geprueft.json duration_s + .3 once it exists (the real cuts); until then the lead's provisional slots
# (Jakob's brief 25.11.: 10 s each) + .3. The real VO timing (<ROOT>audio/timing.json) wins anyway.
CLIP_LEN = {'C1': 10.3, 'C3': 10.3, 'C4': 10.3}
CLIP_SRC = 'placeholder'
try:
    import json as _j
    _cj = _j.load(open(ROOT + 'clips-geprueft.json', encoding='utf8'))   # a list (25.11.) or { clips: [...] }
    for _c in (_cj if isinstance(_cj, list) else _cj['clips']):
        _d = _c.get('duration_s') or _c.get('dauer_s')
        if _c.get('id') in CLIP_LEN and _d: CLIP_LEN[_c['id']] = round(float(_d) + .3, 3); CLIP_SRC = 'clips-geprueft.json'
except (OSError, ValueError, KeyError): pass
# where the slots go (the paragraph that ENDS with this lead-in line is followed by the clip)
CLIP_AFTER = [('C1', "Google's longtime futurist."), ('C3', 'how little went in.'), ('C4', 'is breaking.')]   # fallback only (vo-v2 has the tags)
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations of the film (text-v2 Fragen-Kette): id, first words of the sentence that opens it
SECS = [('H', 'Every generation before yours'), ('1', 'The date comes from'), ('2', 'Then the copy is'), ('3', 'Which brings back'),
        ('M', 'This channel exists'), ('4', 'Say it works'), ('5', 'And an inheritance is only'), ('6', "It doesn't have to go"),
        ('E', 'So is yours the first'), ('A2', "That's what this channel is for")]
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\b[^\]]*\]')
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
print(f'pace {PACE}: {rate:.2f} words/s of speech incl. pauses (text-v2 plans 145 w/min ≈ 2.4 w/s → VO end ≈ 10:17)')
print('slots:', [(c['id'], c['kind'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
