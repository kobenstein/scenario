#!/usr/bin/env python3
"""Film 31 · provisional timing.json from the script until the audio agent writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}, like Films 24/25/28), so scene code written against
it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C3')), never on seconds,
so small text changes (the fact-checked vo-v3) break nothing as long as the anchor phrase survives.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Default source: the newest of vo-v4.txt / vo-v3.txt / vo-v2.txt (final 16.11.) in the data root ($F31ROOT, default /mnt/project-files/scenario/film-ai-2027/).
Format of vo-vN.txt: paragraphs (one or more sentences per line, blank lines between). Tags:
  [CLIP Cn]          a silent slot (interview footage or audio with its own sound), length = the fixed cut (clips/schnitt.json)   kind 'clip'
  [ZITATKARTE Cn]    a quote card READ BY THE NARRATOR: the next line (the quote, in quotes) is spoken as normal VO; the card slot gets
                     that line's start/end (kind 'card', under: True, adds no time), so the picture can anchor on T.clip('C1')
  [pause]            a standalone line or inline: PAUSE s of air (Eleven v4 tag)
  [calm, conversational] [curious] [thoughtful] [warm]: voice tags, no time
Pace: Film 25/28's provisional pace (PACE 1.12 → ≈ 2.4 words/s of speech incl. small gaps; text-v2 plans 2.4 w/s → VO end ≈ 10:07).
LEAD 0.6 s (picture first), sentence gap .40, line gap .36, section gap 1.1, end tail 25 s (~10 s quiet walk so the 2nd QR window runs ≥ 25 s, then the 15 s end screen)."""
import json, os, re, sys
ROOT = os.environ.get('F31ROOT', '/mnt/project-files/scenario/film-ai-2027/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else next(ROOT + f for f in ('vo-final.txt', 'vo-v4.txt', 'vo-v3.txt', 'vo-v2.txt') if os.path.exists(ROOT + f))
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 20.0, 1.1, 0.8   # film 59: TAIL = ~5 s quiet after the last word (no QR any more) + the 15 s end screen
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
# clip lengths = the fixed cuts (<ROOT>clips/schnitt.json, 12.11.): C3 Amodei / Dwarkesh 10.45 s · C5 Ramakrishnan, AUDIO ONLY, 9.32 s ·
# C2 Amodei / Dwarkesh 8.72 s. C1 / C1b are quote cards read by the narrator (no own time).
# film 31 (vo-v3 / aenderung-v3.md): K1 Brin ~7 s · K2 Altman ~10 s · T1a Tao Lin 35.7 s · T1b Tao Lin 12.4 s. Unknown ids (vo-v4 [CLIP Tn: …])
# get an estimate from their quoted words (2.6 w/s + .6 s) until clips/schnitt.json has the real cut.
CLIP_LEN = {'T2': 7.0, 'T1a': 33.3, 'T1b': 12.2, 'T3': 5.0}   # vo-final: <ROOT>clips/schnitt.json out − in + .3 (6.70 · 33.0 · 11.9 · 4.7 s), all Tao Lin
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations of the film (text-v2 Fragen-Kette): id, first words of the sentence that opens it
# film 31 (vo-v3 arc; phase 2 re-checks against vo-v4). A missing opener only warns (the next one is still searched).
SECS = [('H', 'You may be using'), ('1', 'Picture a ladder'), ('2', "By Anthropic's own verdict"), ('3', 'Until this year'),
        ('M', 'This channel exists'), ('4', 'How fast?'), ('5', "They're the people behind"), ('6', 'Their scenario, late'),
        ('7', 'Right now, the labs hold'), ('8', 'So how close is'), ('A2', 'This channel exists')]   # same openers in vo-v4
SLOT = re.compile(r'\[CLIP\s+([A-Z]\d+[a-z]?)\b[^\]]*\]')
CARD = re.compile(r'\[ZITATKARTE\s+([A-Z]\d+[a-z]?)\b[^\]]*\]')
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip() and not l.strip().startswith('#')]   # '# T2 src …' = cut notes, not spoken
t, sec, n, words, segs, clips, si, card_next = LEAD, None, 0, [], {}, [], 0, None
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1); L = CLIP_LEN.get(cid) or round(len(re.findall(r"[A-Za-z0-9']+", l)) / 2.6 + .6 - .4, 2)
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
if si < len(SECS): print(f'WARNING: section openers not found: {SECS[si:]}', file=sys.stderr)
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
slot = sum(c['end'] - c['start'] for c in clips if not c['under'])
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}; spoken part without slots ≈ {words[-1]["e"] - slot:.1f} s), '
      f'{len(words)} words -> {OUT}')
nslot = sum(1 for c in clips if not c['under'])
rate = len(words) / (words[-1]['e'] - LEAD - slot - nslot * (SLOT_IN + SLOT_OUT))
print(f'pace {PACE}: {rate:.2f} words/s of speech incl. pauses (text-v2 plans 2.4 w/s → VO end 10:07)')
print('slots:', [(c['id'], c['kind'], c['start'], c['end']) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print('sections:', {k: fmt(v) for k, v in first.items()})
