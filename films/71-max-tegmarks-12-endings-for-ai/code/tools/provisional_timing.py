#!/usr/bin/env python3
"""Film 71 · "Max Tegmark's 12 Endings for AI" · provisional timing.json from the script until the sound step writes
<ROOT>audio/timing.json (ROOT = $F71ROOT or /mnt/project-files/scenario/film-tegmark/). Same format as the real VO timing
({duration, sections, clips, words:[{w,s,e,sec}]}, films 24 → 69), so scene code written against it runs unchanged on the real VO.
All scene code anchors on PHRASES (T.G / T.GE) and on slot ids (T.clip('C2')), never on seconds.
  python3 tools/provisional_timing.py [hoerfassung.txt] [out.json]
Default source: the NEWEST hoerfassung-vN.txt in ROOT (it carries the five clip lines as `[CLIP Cn] "quote"`); a vo-vN.txt without clip
lines works too (the slots are then inserted after their lead-in lines, CLIP_AFTER).
Pace: PACE 1.12 (≈ 2.4 words/s incl. small gaps; text-v2 plans 145 wpm → 11:07 + 15 s end screen). LEAD 0.6 s (picture first).
Station gaps .6 s (text-v2: 14 station pauses, none at the hook end), the three [PAUSE 1 s] of text-v2 after their lines (PAUSE_AFTER).
Clip lengths: text-v2 estimates (C1 6 · C2 6 · C4 6 · C5 9 · C6 5 s) + .3, or `duration_s` from clips-geprueft-imac.json once it exists
(films/71-assets/clips/ or ROOT)."""
import json, os, re, sys
ROOT = os.environ.get('F71ROOT', '/mnt/project-files/scenario/film-tegmark/').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ASSETS = os.path.normpath(os.path.join(HERE, '..', '..', '..', '71-assets', 'clips'))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
def _newest():
    for pat in (r'hoerfassung-v(\d+)\.txt', r'vo-v(\d+)\.txt'):
        vs = [(int(m.group(1)), f) for f in os.listdir(ROOT) for m in [re.fullmatch(pat, f)] if m]
        if vs: return ROOT + max(vs)[1]
    raise SystemExit('no hoerfassung-vN.txt / vo-vN.txt in ' + ROOT)
SRC = args[0] if args else _newest()
OUT = args[1] if len(args) > 1 else os.path.join(HERE, '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 16.0, 0.95, 1.0     # TAIL = ~1 s after the last word + the 15 s end screen
PACE = float(os.environ.get('PACE', 1.12))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
CLIP_LEN = {'C1': 6.3, 'C2': 6.3, 'C4': 6.3, 'C5': 9.3, 'C6': 5.3}
CLIP_SRC = 'text-v2 estimates'
for f in (os.path.join(REPO_ASSETS, 'clips-geprueft-imac.json'), ROOT + 'clips-geprueft-imac.json', ROOT + 'clips-geprueft.json'):
    try:
        j = json.load(open(f, encoding='utf8')); cl = j['clips'] if isinstance(j, dict) and 'clips' in j else j
        for c in (cl if isinstance(cl, list) else [dict(v, id=k) for k, v in cl.items()]):
            d = c.get('duration_s') or c.get('dauer_s') or c.get('duration')
            if c.get('id') in CLIP_LEN and d: CLIP_LEN[c['id']] = round(float(d) + .3, 3); CLIP_SRC = f
        break
    except (OSError, ValueError, KeyError, TypeError): pass
CLIP_AFTER = [('C1', "he doesn't point ahead."), ('C2', "Ball's odds of doom:"), ('C4', "charge against the AI companies:"),
              ('C5', "Sam Altman said:"), ('C6', 'now says it himself:')]
PAUSE_AFTER = ['everyone else is doing it.', 'made hiding illegal.', "It's being decided this year."]   # text-v2 [PAUSE 1 s]
SLOT_IN, SLOT_OUT = 0.6, 0.6
# sections = the stations (text-v2): id, first words of the sentence that opens it (in film order; 'This channel exists' twice)
SECS = [('H', 'Max Tegmark wrote'), ('12', 'Start with the worst'), ('11', 'The next ending has no morning'), ('10', 'You wake up rested'),
        ('9', 'You walk to work'), ('8', 'Then you get Descendants'), ('7', 'What if the superintelligence'), ('M', 'This channel exists'),
        ('6', 'And if nobody can be trusted'), ('5', 'The Benevolent Dictator'), ('4', "That's the Gatekeeper"), ('3', 'Three endings left'),
        ('2', 'You wake up, and things'), ('1', 'Egalitarian Utopia'), ('S', 'So which ending are we heading for'), ('A2', 'This channel exists')]
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\b[^\]]*\]')
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)
paras = []
for l in open(SRC, encoding='utf8').read().splitlines():
    l = l.strip()
    if not l: continue
    m = SLOT.match(l)
    paras.append(f'[CLIP {m.group(1)}]' if m else l)   # the quote after the tag is the clip's own sound, not VO
if not any(SLOT.fullmatch(l) for l in paras):
    out, todo = [], list(CLIP_AFTER)
    for l in paras:
        out.append(l)
        if todo and l.rstrip().endswith(todo[0][1]): out.append(f'[CLIP {todo[0][0]}]'); todo.pop(0)
    if todo: raise SystemExit(f'clip lead-in not found: {todo[0]}')
    paras = out
t, sec, n, words, segs, clips, si, nkern = LEAD, None, 0, [], {}, [], 0, 0
for l in paras:
    m = SLOT.fullmatch(l)
    if m:
        cid = m.group(1); L = CLIP_LEN[cid]
        t += SLOT_IN - GAP_LINE
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False})
        t += L + SLOT_OUT; continue
    if PAUSE_T.fullmatch(l): t += PAUSE; continue
    body = re.sub(r'\[[^\[\]]*\]', '', PAUSE_T.sub(' ', l)).strip()
    for ab in ('U.S.', 'P(doom)'):
        body = body.replace(ab, ab.replace('.', '·'))
    for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
        s = s.strip()
        if not s: continue
        if si < len(SECS) and s.lstrip('"“').startswith(SECS[si][1]) and (sec is None or SECS[si][0] != sec):
            if sec is not None: t += (GAP_SEC if sec != 'H' else GAP_LINE) - GAP_LINE
            sec = SECS[si][0]; si += 1
        sid = f's{n:03d}'; n += 1; start = None
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
        for p in PAUSE_AFTER:
            if s.endswith(p):
                if p.startswith("It's being decided"):
                    nkern += 1
                    if nkern < 2: continue
                t += PAUSE
    t += GAP_LINE
if si < len(SECS): raise SystemExit(f'section opener not found: {SECS[si]}')
total = round(t - GAP_LINE + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print(f'{os.path.basename(SRC)}: duration {total:.1f} s = {fmt(total)} (VO end {fmt(words[-1]["e"])}), {len(words)} words -> {OUT}')
print(f'clip lengths from {CLIP_SRC}: {CLIP_LEN}')
print('slots:', [(c['id'], fmt(c['start']), round(c['end'] - c['start'], 1)) for c in clips])
first = {}
for k, v in segs.items(): first.setdefault(v['sec'], v['start'])
print('sections:', {k: fmt(v) for k, v in first.items()})
