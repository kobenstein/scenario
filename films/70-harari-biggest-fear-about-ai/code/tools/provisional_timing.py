#!/usr/bin/env python3
"""Film 70 · "Harari's Biggest Fear About AI Isn't Robots" · provisional timing.json until the sound step writes <ROOT>audio/timing.json.
Same format as the real VO timing ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs unchanged on
the real VO. Scene code anchors on PHRASES (T.G / T.GE) and slot ids (T.clip('C1'), T.clip('Q2')), never on seconds.

  python3 tools/provisional_timing.py [vo.txt] [out.json] [--pace]

Source text: the NEWEST vo-vN.txt in ROOT ($F70ROOT, default /mnt/project-files/scenario/film-harari/). The fact-checked vo-v3 keeps the
sentences and the structure of v2, so it drops in: the sentence TIMES come from the approved Kokoro read, the WORDS from the newest text.

Timing source (better than a words-per-second guess, Film 69 had only that):
  the approved read <ROOT>hoerfassung-v2.mp3 (Kokoro, 9:20, the clip quotes read by the narrator) is aligned SENTENCE BY SENTENCE to the
  text: ffmpeg silencedetect gives the pauses, a dynamic programme picks one pause per sentence boundary so that every sentence's length
  fits its letter count (one global speech rate, a penalty for long pauses inside a sentence). Inside a sentence the words are spread by
  letter count. The three clip quotes (read by Kokoro in the narrator's voice) are then replaced by their real slot lengths (clips.json:
  C1 12 s, C2 12 s, C3 8 s, +.3) with .6 s air before and after; everything after moves. --pace (or no mp3 / a sentence-count mismatch):
  the Film 69 words-per-second estimate instead.
Quote cards read by the narrator (Q1–Q3, EXPL graphics) get card slots (kind 'card', under: True, no extra time) = the span of their
sentence(s), so T.clip('Q2') works like a clip window.
LEAD .6 s (picture first). TAIL 20 s = ~5 s after the last word + the 15 s end screen."""
import json, os, re, subprocess, sys
ROOT = os.environ.get('F70ROOT', '/mnt/project-files/scenario/film-harari/').rstrip('/') + '/'
args = [a for a in sys.argv[1:] if not a.startswith('--')]
FORCE_PACE = '--pace' in sys.argv
def _newest():
    vs = [(int(m.group(1)), f) for f in os.listdir(ROOT) for m in [re.fullmatch(r'vo-v(\d+)\.txt', f)] if m]
    if not vs: raise SystemExit('no vo-vN.txt in ' + ROOT)
    return ROOT + max(vs)[1]
SRC = args[0] if args else _newest()
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = args[1] if len(args) > 1 else os.path.join(HERE, '..', 'data', 'provisional_timing.json')
MP3 = ROOT + 'hoerfassung-v2.mp3'
READ_TEXT = ROOT + 'vo-v2.txt'            # the text the Kokoro read was made from
LEAD, TAIL, GAP_SEC, PAUSE = 0.6, 20.0, 0.0, 0.8
PACE = float(os.environ.get('PACE', 1.0))
WORD, GAP_LINE, GAP_SENT, GAP_COMMA = 0.288 * PACE, 0.32 * PACE, 0.36 * PACE, 0.15 * PACE
CLIP_LEN = {'C1': 12.3, 'C2': 12.3, 'C3': 8.3}     # clips.json dauer_s + .3 (placeholders until <ROOT>clips-geprueft.json lands)
CLIP_SRC = 'clips.json placeholders'
try:   # <ROOT>clips-geprueft.json (25.11.: a list; C1 7.9 s, C2 8.4 s, C3 8.2 s = the used sentence, without the ~1 s pre/post roll)
    _j = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8'))
    for _c in (_j['clips'] if isinstance(_j, dict) else _j):
        _d = _c.get('duration_s') or _c.get('dauer_s')
        if _c.get('id') in CLIP_LEN and _d: CLIP_LEN[_c['id']] = round(float(_d) + .3, 3); CLIP_SRC = 'clips-geprueft.json'
except (OSError, ValueError, KeyError): pass
CLIP_WORDS = {}
try:
    for _c in json.load(open(ROOT + 'clips.json', encoding='utf8')):
        if _c.get('id') in CLIP_LEN: CLIP_WORDS[_c['id']] = _c.get('words', '')
except (OSError, ValueError): pass
SLOT_IN, SLOT_OUT = 0.6, 0.6
# quote cards read by the narrator: id -> (first phrase, last phrase) of the spoken quote (text-v2 [ZITATKARTE])
CARDS = {'Q2': ('we are the cows', 'of the future.'), 'Q1': ('The basis for civilization is not', 'civilization is trust.'),
         'Q3': ('slow down, and give', 'politics time.')}
# sections = the stations of text-v2 (blank-line blocks of vo-v2): id, first words of the sentence that opens it (nth = occurrence)
SECS = [('H', 'Yuval Noah Harari', 0), ('1', 'His word for it', 0), ('2', 'Be honest', 0), ('3', 'Money.', 1), ('4', 'Contract.', 1),
        ('5', 'Law.', 1), ('6', 'Truth.', 1), ('7', "Harari's own answer", 0), ('8', 'Three tests', 0), ('9', 'Go back to the cow', 0)]
SLOT = re.compile(r'\[CLIP\s+(C\d+[a-z]?)\b[^\]]*\]')
PAUSE_T = re.compile(r'\[pause[^\]]*\]', re.I)

def units(path):
    """the text as units in order: ('s', sentence) or ('c', clip id). One sentence per unit (lines may hold several)."""
    out = []
    for l in open(path, encoding='utf8').read().splitlines():
        l = l.strip()
        if not l: continue
        m = SLOT.fullmatch(l)
        if m: out.append(('c', m.group(1))); continue
        if PAUSE_T.fullmatch(l): continue
        body = re.sub(r'\[[^\[\]]*\]', '', PAUSE_T.sub(' ', l)).strip()
        for s in re.findall(r'[^.?!]+[.?!]+["”’]?|[^.?!]+$', body):
            if s.strip(): out.append(('s', s.strip()))
    return out
letters = lambda s: len(re.sub(r'[^A-Za-z0-9]', '', s))
U = units(SRC)

def align():
    """sentence spans from the Kokoro read: [(s, e)] per unit of READ_TEXT (clip quotes included), or None"""
    if FORCE_PACE or not os.path.exists(MP3) or not os.path.exists(READ_TEXT): return None
    RU = units(READ_TEXT)
    remap = [k for k, _ in RU] != [k for k, _ in U] or [v for _, v in RU] != [v for _, v in U]
    txt = [CLIP_WORDS.get(v, 'x' * 60) if k == 'c' else v for k, v in RU]
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', MP3]))
    log = subprocess.run(['ffmpeg', '-v', 'info', '-i', MP3, '-af', 'silencedetect=noise=-38dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
    S0 = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; S1 = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    sil = [(a, b) for a, b in zip(S0, S1)]
    if sil and sil[0][0] < .05: start = sil[0][1]; sil = sil[1:]
    else: start = 0.0
    end = sil[-1][0] if sil and sil[-1][1] >= dur - .05 else dur
    sil = [p for p in sil if p[1] < end]
    N = len(txt); w = [letters(x) + 6 for x in txt]           # +6: every sentence has an onset and a release
    k = (end - start - sum(min(.5, b - a) for a, b in sil[:N - 1])) / sum(w)
    cum = [0]; [cum.append(cum[-1] + x) for x in w]
    P = len(sil)
    for _ in range(3):
        INF = 1e18
        # best[i][j]: unit i ends at silence j (its boundary); unit 0 starts at 'start'
        best = [[INF] * P for _ in range(N)]; arg = [[-1] * P for _ in range(N)]
        def cost(i, a, b, jlo, jhi):
            d = b - a; p = k * w[i]
            inner = sum(max(0, sil[q][1] - sil[q][0] - .45) for q in range(jlo, jhi))   # long pauses inside a sentence are unlikely
            return (d - p) ** 2 / max(.4, p) + 6 * inner + (40 if d < .3 * p else 0)
        ke = (end - start) / cum[-1]
        exp = lambda i: start + ke * cum[i]                 # expected start of unit i (pauses included)
        for j in range(P):
            if abs(sil[j][0] - exp(1)) < 25: best[0][j] = cost(0, start, sil[j][0], 0, j)
        for i in range(1, N - 1):
            for j in range(P):
                if abs(sil[j][0] - exp(i + 1)) > 25: continue
                for q in range(j - 1, -1, -1):
                    if best[i - 1][q] >= INF: continue
                    if sil[j][0] - sil[q][1] > 40: break
                    c = best[i - 1][q] + cost(i, sil[q][1], sil[j][0], q + 1, j)
                    if c < best[i][j]: best[i][j] = c; arg[i][j] = q
        # last unit ends at 'end'
        fin, fj = INF, -1
        for q in range(P):
            if best[N - 2][q] < INF:
                c = best[N - 2][q] + cost(N - 1, sil[q][1], end, q + 1, P)
                if c < fin: fin, fj = c, q
        if fj < 0: print('WARN: alignment failed: pace fallback'); return None
        js = [fj]
        for i in range(N - 2, 0, -1): js.append(arg[i][js[-1]])
        js = js[::-1]
        spans = [(start if i == 0 else sil[js[i - 1]][1], sil[js[i]][0] if i < N - 1 else end) for i in range(N)]
        k = sum(b - a for a, b in spans) / sum(w)          # refit the speech rate on the chosen spans, repeat
    global DEV
    DEV = [((b - a) / (k * w[i]), i, txt[i][:28]) for i, (a, b) in enumerate(spans)]
    dev = sorted(((b - a) / (k * w[i]), i) for i, (a, b) in enumerate(spans))
    print(f'aligned {N} units to {MP3.split("/")[-1]} ({dur:.1f} s, {P} pauses): rate {1 / k:.1f} letters/s; length ratio min {dev[0][0]:.2f} '
          f'(#{dev[0][1]} {txt[dev[0][1]][:30]!r}) max {dev[-1][0]:.2f} (#{dev[-1][1]} {txt[dev[-1][1]][:30]!r})')
    return remap_spans(RU, spans) if remap else spans

def remap_spans(RU, spans):
    """the read was made from v2: carry its sentence spans over to the newest text. Unchanged units keep their span;
    changed groups share the span of the v2 units they replace, by letter weight; inserted units split their neighbour."""
    import difflib
    key = lambda u: u[0] + ':' + re.sub(r'[^a-z0-9]', '', u[1].lower())
    ops = difflib.SequenceMatcher(None, [key(u) for u in RU], [key(u) for u in U], autojunk=False).get_opcodes()
    out = [None] * len(U); log = []
    for tag, i1, i2, j1, j2 in ops:
        if tag == 'equal':
            for d in range(i2 - i1): out[j1 + d] = spans[i1 + d]
            continue
        if tag == 'delete': log.append(f'-{i2 - i1}'); continue
        if i1 == i2:                                       # pure insert: share the previous v2 unit's span
            i1 = max(0, i1 - 1); j1 = max(0, j1 - 1); i2 = i1 + 1
        a, b = spans[i1][0], spans[i2 - 1][1]
        wj = [letters(CLIP_WORDS.get(v, 'x' * 60) if k == 'c' else v) + 6 for k, v in U[j1:j2]]; t = a
        for d, ww in enumerate(wj):
            e = t + (b - a) * ww / sum(wj); out[j1 + d] = (t, e - (.25 if d < len(wj) - 1 else 0)); t = e
        log.append(f'{tag} v2#{i1}-{i2 - 1} -> new#{j1}-{j2 - 1}')
    if any(x is None for x in out): print('WARN: remap left gaps: pace fallback'); return None
    print('remapped the v2 read onto', os.path.basename(SRC) + ':', '; '.join(log))
    return out

spans = align()
words, segs, clips = [], {}, []
sec_i, sec, seen = 0, None, {}
def section_of(s):
    global sec_i, sec
    key = re.sub(r'\W', '', s.split()[0].lower()) if s.split() else ''
    if sec_i < len(SECS):
        sid, op, nth = SECS[sec_i]
        if s.lstrip('"“').startswith(op):
            seen[op] = seen.get(op, -1) + 1
            if seen[op] == nth: sec = sid; sec_i += 1
            return sec
        if any(s.lstrip('"“').startswith(o) for _, o, _ in SECS[sec_i:]): seen[s.split()[0]] = seen.get(s.split()[0], -1)
    return sec
# count earlier occurrences of the openers (e.g. 'Money.' in the list of four) so nth works
cnt = {}
def sect(s):
    global sec_i, sec
    for _, op, _ in SECS:
        if s.lstrip('"“').startswith(op): cnt[op] = cnt.get(op, -1) + 1
    if sec_i < len(SECS):
        sid, op, nth = SECS[sec_i]
        if s.lstrip('"“').startswith(op) and cnt[op] == nth: sec = sid; sec_i += 1
    return sec
def lay_words(s, a, b, sid):
    toks = s.split(); wt = [letters(x) + 2 for x in toks]; tot = sum(wt); t = a
    for x, ww in zip(toks, wt):
        d = (b - a) * ww / tot
        words.append({'w': x, 's': round(t, 3), 'e': round(t + d * .9, 3), 'sec': sid}); t += d
n = 0; shift = 0.0; t = LEAD
for ui, (kind, v) in enumerate(U):
    if kind == 'c':
        L = CLIP_LEN[v]
        if spans:
            a = spans[ui][0] + shift; prev_e = words[-1]['e'] if words else LEAD
            st = prev_e + SLOT_IN; clips.append({'id': v, 'kind': 'clip', 'sec': sec, 'start': round(st, 3), 'end': round(st + L, 3), 'under': False})
            nxt = spans[ui + 1][0] + shift if ui + 1 < len(U) else st + L + SLOT_OUT
            shift += (st + L + SLOT_OUT) - nxt
        else:
            t += SLOT_IN - GAP_LINE; clips.append({'id': v, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + L, 3), 'under': False}); t += L + SLOT_OUT
        continue
    sid = f's{n:03d}'; n += 1; s_sec = sect(v)
    if spans:
        a, b = spans[ui][0] + shift + LEAD, spans[ui][1] + shift + LEAD
        lay_words(v, a, b, sid)
    else:
        a = t
        for x in v.split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', x)) - 5)
            words.append({'w': x, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid}); t += d
            if x[-1] in '.!?': t += GAP_SENT
            elif x[-1] in ',:;': t += GAP_COMMA
        t += GAP_LINE
    segs[sid] = {'start': round(words[-len(v.split())]['s'], 3), 'end': round(words[-1]['e'], 3), 'sec': s_sec}
if sec_i < len(SECS): raise SystemExit(f'section opener not found: {SECS[sec_i]}')
# clip slots of the Kokoro version: the clip start is LEAD-relative too
if spans:
    for c in clips: c['start'] = round(c['start'], 3); c['end'] = round(c['end'], 3)
# quote cards: the span of their spoken words
norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
NW = [norm(w['w']) for w in words]
def find(ph, after=0):
    q = [norm(x) for x in ph.split() if norm(x)]
    for i in range(after, len(words) - len(q) + 1):
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)): return i, i + len(q) - 1
    return None
for cid, (a, b) in CARDS.items():
    fa = find(a)
    fb = find(b, fa[0]) if fa else None
    if not (fa and fb): print(f'WARN card {cid}: {a!r} … {b!r} not found'); continue
    clips.append({'id': cid, 'kind': 'card', 'sec': segs[words[fa[0]]['sec']]['sec'], 'start': words[fa[0]]['s'], 'end': words[fb[1]]['e'], 'under': True})
clips.sort(key=lambda c: c['start'])
total = round(words[-1]['e'] + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'aligned_to': os.path.basename(MP3) if spans else None,
           'sections': segs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
fmt = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
print(f'{os.path.basename(SRC)}: {"aligned to the Kokoro read" if spans else f"pace {PACE}"} · duration {fmt(total)} (VO end {fmt(words[-1]["e"])}), {len(words)} words, {n} sentences -> {OUT}')
print(f'clip lengths from {CLIP_SRC}: {CLIP_LEN}')
print('slots:', [(c['id'], c['kind'], fmt(c['start']), round(c['end'] - c['start'], 1)) for c in clips])
first = {}
for k_, v_ in segs.items(): first.setdefault(v_['sec'], v_['start'])
print('sections:', {k_: fmt(v_) for k_, v_ in first.items()})
