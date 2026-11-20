#!/usr/bin/env python3
"""Film 65 · "AI Can Now Call You in Your Mom's Voice" · provisional timing.json from the script until the sound agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Films 24/25/28/54/55), so scene code written against
it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C1'), T.clip('Q1')), never on
seconds, so small text changes (the fact-checked vo-v3) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v5.txt / vo-v4.txt / vo-v3.txt / vo-v2.txt in the data root ($F65ROOT, default /mnt/project-files/scenario/film-ki-betrug/).
Format of vo-vN.txt (#65): paragraphs (one or more sentences per line, blank lines between). Tags:
  [CLIP S1: "quote"]      a silent slot (interview clip with its own sound: ORIGINAL FOOTAGE in the clip frame), CLIP_LEN s   kind 'clip'
  [ZITATKARTE: "quote" · credit · nur im Bild …]   a quote card shown in the picture only (not spoken): CARD_AIR s of air to read it,
                          then the next VO line runs over it. Ids in film order Q1, Q2, Q3 (Q1 IUCN, Q2 Shapiro, Q3 Lamm in vo-v2).
  [ZITATKARTE: … · wird gesprochen …]   a card READ BY THE NARRATOR: the next line (the quote) is spoken as normal VO; the card gets that
                          line's start/end (under: True, adds no time).            kind 'card' for both; text + spoken in the entry
  [pause]                 a standalone line or inline: PAUSE s of air          [calm, conversational] [curious] [thoughtful] [wry]: voice tags, no time
Pace: PACE 1.12 → ≈ 2.4 words/s of speech incl. small gaps (#54/#55 measured 2.4 w/s). LEAD 0.6 s (picture first), sentence gap .40, line gap .36,
section gap 1.1, end tail 17 s (~2 s of air after the last word, then the 15 s end screen). No QR windows (rule 16.11.)."""
import json, os, re, sys
ROOT = os.environ.get('F65ROOT', '/mnt/project-files/scenario/film-ki-betrug/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in sorted((x for x in os.listdir(ROOT) if re.fullmatch(r'vo-v\d+\.txt', x)), key=lambda x: -int(re.findall(r'\d+', x)[0])) if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE, CARD_AIR = 0.6, 17.0, 1.1, 0.8, 2.2
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
CLIP_LEN = {'S1': 3.6, 'C10': 6.87, 'C1': 7.04, 'S2': 6.97}   # the cut files in <ROOT>clips/ (20.11.): S1 Del Mastro, C1 Meador, S2 Benda footage; C10 = quote card, slot = the podcast sentence (6.87 s)
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations of text-v2: id, first words of the sentence that opens it
SECS = [('H', 'A.I. can now call you'), ('1', 'The first step is the voice'), ('2', 'That is the second step'),
        ('3', 'The third step is a face'), ('M', 'This channel exists for one reason'), ('4', 'So the scam must not give her the time'),
        ('5', 'Then one step is left'), ('6', 'Because a copy needs an original'), ('7', 'And one evening'), ('A2', 'This channel exists so that')]
SLOT = re.compile(r'\[CLIP\s+([A-Z]\d+[a-z]?)\b[^\]]*\]')
CARD = re.compile(r'\[(?:ZITATKARTE|QUOTE CARD)\s*:?\s*([^\]]*)\]', re.I)
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
t, sec, n, words, segs, clips, si, card_next = LEAD, None, 0, [], {}, [], 0, None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1); L = CLIP_LEN.get(cid, 8.0)
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    m = CARD.fullmatch(l)
    if m:
        body = m.group(1); q = re.search(r'["“](.+?)["”]', body)
        spoken = not re.search(r'nicht gesprochen|not spoken', body, re.I)
        card_next = {'id': f'Q{sum(1 for c in clips if c["kind"] == "card") + 1}', 'text': q.group(1) if q else body.split('·')[0].strip(),
                     'credit': ' · '.join(x.strip() for x in body.split('·')[1:] if not re.search(r'gesprochen|nur im Bild|spoken', x, re.I)), 'spoken': spoken}
        if not spoken:   # a picture-only card: air to read it before the next line
            card_next['t0'] = t; t += CARD_AIR
        continue
    if re.fullmatch(r'\[ENDCARD[^\]]*\]', l): continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    card, card_t0 = card_next, None; card_next = None
    if card and 't0' in card: card_t0 = card.pop('t0')
    body = PAUSE_T.sub(' ‖ ', l)                       # inline [pause] → a marker token that adds air; other tags vanish
    body = re.sub(r'\[[^\[\]]*\]', '', body).strip()
    body = re.sub(r'(\d)\.(\d)', r'\1·\2', body)       # decimals (1.4 million) are not sentence ends
    for ab in ('A.I.', 'U.S.'):                         # protect abbreviations (a sentence may end on one)
        body = re.sub(re.escape(ab) + r'(?=\s+[A-Z])', ab[:-1].replace('.', '·') + '.', body).replace(ab, ab.replace('.', '·'))
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
        s = s.strip()
        lead_pause = s.startswith('‖')
        s = s.replace('‖', ' ').strip()
        if lead_pause: t += PAUSE
        if not s: continue
        if si < len(SECS) and s.lstrip('"“').replace('·', '.').startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += GAP_SEC - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
        if card and card_t0 is None: card_t0 = t
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
    if card and card_t0 is not None:
        clips.append({'id': card['id'], 'kind': 'card', 'sec': sec, 'start': round(card_t0, 3), 'end': round(words[-1]['e'], 3), 'under': True,
                      'text': card['text'], 'credit': card['credit'], 'spoken': card['spoken']})
    t += GAP_LINE
if si < len(SECS): raise SystemExit(f'section opener not found: {SECS[si]}')
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips if not c['under'])
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}), {len(words)} words -> {OUT}')
print('slots:', [(c['id'], c['kind'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
