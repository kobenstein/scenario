#!/usr/bin/env python3
"""Film 55 · "The Best AI Is Locked Away" · provisional timing.json from the script until the sound agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Films 24/25/28/54), so scene code written against
it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('A1')), never on seconds,
so small text changes (the fact-checked vo-v3) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v5.txt / vo-v4.txt / vo-v3.txt / vo-v2.txt in the data root ($F55ROOT, default /mnt/project-files/scenario/film-geheim-ki/).
Format of vo-vN.txt (#55): paragraphs (one or more sentences per line, blank lines between). Tags:
  [CLIP A1: "quote"]      a silent slot (interview clip with its own sound; in the picture a quote plate, no footage in the cloud), length
                          = CLIP_LEN (text-v2 clip table)                                                                 kind 'clip'
  [QUOTE CARD: credit]    a quote card READ BY THE NARRATOR: the next line (the quote, in quotes) is spoken as normal VO; the card slot gets
                          that line's start/end (kind 'card', id R1, under: True, adds no time), so the picture anchors on T.clip('R1')
  [pause]                 a standalone line or inline: PAUSE s of air (Eleven v4 tag)
  [ENDCARD …]             ignored (the end screen is the TAIL)
  [calm, conversational] [curious] [thoughtful] [warm]: voice tags, no time
Pace: PACE 1.12 → ≈ 2.4 words/s of speech incl. small gaps (#54 measured 2.4 w/s). LEAD 0.6 s (picture first), sentence gap .40, line gap .36,
section gap 1.1, end tail 23 s (~8 s quiet walk after the last word, then the 15 s end screen). No QR windows any more (rule 16.11.)."""
import json, os, re, sys
ROOT = os.environ.get('F55ROOT', '/mnt/project-files/scenario/film-geheim-ki/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-v5.txt', 'vo-v4.txt', 'vo-v3.txt', 'vo-v2.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 23.0, 1.1, 0.8   # TAIL = ~8 s quiet walk + 15 s end screen
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
# clip lengths (text-v2 clip table): A1 Altman / Dreamforce 5 s · C1 Altman / Berman 8 s · C4 Hobbhahn / Senate 7 s. R1 (Friar) is a quote
# card read by the narrator (no own time). Unknown ids get 7 s.
CLIP_LEN = {'A1': 5.0, 'C1': 8.0, 'C4': 7.0}
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations of the film (text-v2 Fragen-Kette): id, first words of the sentence that opens it
SECS = [('H', 'The best'), ('1', 'At the very front stand'), ('2', 'Ask either lab'), ('3', 'Fourth in line stand'),
        ('M', 'This channel exists'), ('4', 'Fifth in line'), ('5', "But the line doesn't end"), ('6', 'The rest is decided'),
        ('7', 'One clue was in plain sight'), ('8', 'One evening, a few months'), ('A2', 'This channel exists')]
SLOT = re.compile(r'\[CLIP\s+([A-Z]\d+[a-z]?)\b[^\]]*\]')
CARD = re.compile(r'\[(?:ZITATKARTE|QUOTE CARD)\b([^\]]*)\]', re.I)
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, segs, clips, si, card_next = LEAD, None, 0, [], {}, [], 0, None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1); L = CLIP_LEN.get(cid, 7.0)
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    m = CARD.fullmatch(l)
    if m: ncard = sum(1 for c in clips if c['kind'] == 'card'); card_next = f'R{ncard + 1}'; continue
    if re.fullmatch(r'\[ENDCARD[^\]]*\]', l): continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    card_id, card_t0 = card_next, None; card_next = None
    body = PAUSE_T.sub(' ‖ ', l)                       # inline [pause] → a marker token that adds air; other tags vanish
    body = re.sub(r'\[[^\[\]]*\]', '', body).strip()
    for ab in ('A.I.', 'U.S.'):                         # protect abbreviations (a sentence may end on one)
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
print(f'pace {PACE}: {rate:.2f} words/s of speech incl. pauses (text-v2 plans 2.5 w/s → VO end 10:07, #54 measured 2.4)')
print('slots:', [(c['id'], c['kind'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
