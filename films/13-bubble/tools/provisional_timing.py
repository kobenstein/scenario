#!/usr/bin/env python3
"""Film 13 "The AI Bubble Could Pop": PROVISIONAL timing.json until the real VO build (audio/build_vo.py, ElevenLabs word
timestamps) delivers <ROOT>/audio/timing.json. Same format as the real file, plus "provisional": true.

  python3 tools/provisional_timing.py [--root /mnt/project-files/scenario/film-blase/] [--vo <root>/vo-v3.txt] [--out audio/timing-provisional.json] [--wps 2.4]

How the words get their times:
  * segments + takes from --takes (default <root>/audio/hoerfassung-v2/: segments.json s00 … s18 + vo-sNN.mp3); the WORDS from --vo
    (default <root>/vo-v3.txt, the fact-checked text), split at each segment's first words; [direction tags] are not spoken
  * if the take vo-<id>.mp3 exists (Hörfassung v2): its real duration, and its pauses (ffmpeg silencedetect) are
    snapped onto the sentence / comma boundaries of the text (monotonic DP), words in between share the time by length.
  * otherwise (new segment, no take yet): 2.4 words/s plus punctuation pauses.
  Takes are laid end to end like build_vo.py: LEAD 1.4 s, GAP between takes, 15 s end screen after the last word.

The switch to the real timing is automatic: lib/kit.mjs uses <ROOT>/audio/timing.json as soon as it exists, otherwise this file
(films/13-bubble/audio/timing-provisional.json). Code anchors ONLY on phrases, so nothing else changes when the real file lands.
"""
import json, os, re, subprocess, sys

args = sys.argv[1:]
opt = lambda k, d=None: args[args.index(k) + 1] if k in args else d
ROOT = opt('--root', '/mnt/project-files/scenario/film-blase/').rstrip('/') + '/'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = opt('--out', os.path.join(HERE, '..', 'audio', 'timing-provisional.json'))
WPS = float(opt('--wps', 2.4))
LEAD, GAP, TAIL = 1.4, 0.8, 15.0          # Hörfassung v2: 617.3 s for 19 takes = ~0.74 s between takes; build_vo.py LEAD 1.4, TAIL 15

TAKES = opt('--takes', ROOT + 'audio/hoerfassung-v2/' if os.path.isdir(ROOT + 'audio/hoerfassung-v2') else ROOT + 'audio/').rstrip('/') + '/'
SEG = json.load(open(TAKES + 'segments.json'))   # the segment split that matches the takes
# --vo <file>: take the WORDS from a newer VO text (e.g. vo-v3.txt after the fact check), split at the first words of each segment
VO = opt('--vo', ROOT + 'vo-v3.txt' if os.path.exists(ROOT + 'vo-v3.txt') else None)
if VO:
    full = open(VO).read(); key = lambda s: re.sub(r'\[[^\]]*\]', ' ', s).split()[:5]
    starts = []
    for s in SEG:
        k = key(s['text']); m = re.search(r'\s*'.join(re.escape(w) for w in k), full)
        if not m: raise SystemExit(f"{s['id']}: first words {k} not found in {VO}")
        starts.append(m.start())
    for i, s in enumerate(SEG): s['text'] = full[starts[i]:starts[i + 1] if i + 1 < len(SEG) else len(full)].strip()
    # a tag that opened the NEXT segment's paragraph belongs to it: strip trailing '[...' fragments
    for s in SEG: s['text'] = re.sub(r'\s*\[[^\]]*$', '', s['text'])

def tokens(text):
    """[(word, pause_weight_after)] ; pause weight: comma 1, sentence 3, ellipsis 3.5, line break +1, paragraph +3"""
    out = []
    paras = text.split('\n\n')
    for pi, para in enumerate(paras):
        lines = [l for l in para.split('\n') if l.strip()]
        for li, line in enumerate(lines):
            line = re.sub(r'\[[^\]]*\]', ' ', line)
            ws = line.split()
            for wi, w in enumerate(ws):
                p = 0.0
                if re.search(r'\.\.\.["”’]?$|…["”’]?$', w): p = 3.5
                elif re.search(r'[.?!]["”’)]?$', w): p = 3.0
                elif re.search(r'[,;:]["”’)]?$', w): p = 1.0
                elif re.search(r'—$|-$', w): p = 0.8
                if wi == len(ws) - 1: p += 1.0 if li < len(lines) - 1 else (3.0 if pi < len(paras) - 1 else 0)
                out.append([w, p])
    return out

def wlen(w):   # speaking weight of a word ~ letters (numbers spelled out in the VO text anyway)
    return 0.55 + len(re.sub(r'[^A-Za-z0-9]', '', w)) * 0.16

def silences(mp3):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp3, '-af', 'silencedetect=noise=-38dB:d=0.16', '-f', 'null', '-'], capture_output=True, text=True)
    ss, out = None, []
    for line in p.stderr.splitlines():
        m = re.search(r'silence_start: ([\d.]+)', line)
        if m: ss = float(m.group(1)); continue
        m = re.search(r'silence_end: ([\d.]+)', line)
        if m and ss is not None: out.append((ss, float(m.group(1)))); ss = None
    if ss is not None: out.append((ss, 1e9))
    return out

def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())

def time_take(tok, D, sil):
    """word (s, e) inside one take of duration D with detected silences sil"""
    n = len(tok)
    head = sil[0][1] if sil and sil[0][0] < .05 else 0.05
    tail = sil[-1][0] if sil and sil[-1][1] > D - .05 else D - .05
    inner = [s for s in sil if s[0] > head + .05 and s[1] < tail - .05]
    # candidates: boundaries after word i with a pause weight
    cand = [i for i in range(n - 1) if tok[i][1] >= .8]
    speech = sum(wlen(w) for w, _ in tok)
    # first estimate: pauses get 0.22 s per weight unit, words share the rest
    pw = .22
    tot_p = sum(p for _, p in tok[:-1]) * pw
    k = max(.05, (tail - head - tot_p) / speech)
    est, t = [], head
    for i, (w, p) in enumerate(tok):
        t += wlen(w) * k; est.append(t); t += p * pw
    # DP: assign silences (in order) to candidate boundaries (in order), may skip either; cost = time error − weight bonus
    S, C = len(inner), len(cand)
    INF = 1e18
    dp = [[INF] * (C + 1) for _ in range(S + 1)]; bk = [[None] * (C + 1) for _ in range(S + 1)]
    for j in range(C + 1): dp[0][j] = 0
    for si in range(1, S + 1):
        mid = (inner[si - 1][0] + inner[si - 1][1]) / 2; sd = inner[si - 1][1] - inner[si - 1][0]
        for j in range(0, C + 1):
            best, arg = dp[si - 1][j] + 1.2 + 2.0 * sd, ('skipS', j)          # a silence left unassigned (breath inside a sentence)
            if j > 0:
                if dp[si][j - 1] < best: best, arg = dp[si][j - 1], ('skipC', j - 1)
                ci = cand[j - 1]
                c = dp[si - 1][j - 1] + abs(est[ci] - mid) * 1.0 - .25 * tok[ci][1]
                if c < best: best, arg = c, ('take', j - 1)
            dp[si][j] = best; bk[si][j] = arg
    pins = {}   # word index → (end of word i, start of word i+1)
    si, j = S, min(range(C + 1), key=lambda jj: dp[S][jj])
    while si > 0:
        kind, pj = bk[si][j]
        if kind == 'take': pins[cand[j - 1]] = inner[si - 1]; si -= 1; j = pj
        elif kind == 'skipS': si -= 1; j = pj
        else: j = pj
    # lay words between pins
    res = [None] * n
    a_t, a_i = head, 0
    bounds = sorted(pins.items()) + [(n - 1, (tail, None))]
    for bi, (s0, s1) in bounds:
        ws = list(range(a_i, bi + 1))
        sp = sum(wlen(tok[i][0]) for i in ws); pp = sum(tok[i][1] for i in ws[:-1]) * .55
        unit = (s0 - a_t) / max(1e-6, sp + pp)   # one unit for letters and the (small) unpinned pauses
        t = a_t
        for i in ws:
            d = wlen(tok[i][0]) * unit; res[i] = (t, t + d); t += d + (tok[i][1] * .55 * unit if i != ws[-1] else 0)
        a_t, a_i = (s1 if s1 is not None else tail), bi + 1
    return res, head, tail

secs, words, t = {}, [], LEAD
report = []
for s in SEG:
    if s.get('clip') or s.get('card') or s.get('endcards'): continue
    tok = tokens(s['text'])
    mp3 = f"{TAKES}vo-{s['id']}.mp3"
    if os.path.exists(mp3):
        D = dur(mp3); tm, head, tail = time_take(tok, D, silences(mp3)); src = 'take'
        tm = [(a - head, b - head) for a, b in tm]; length = tail - head
    else:
        length = len(tok) / WPS + sum(p for _, p in tok[:-1]) * .2; src = f'{WPS} w/s'
        sp = sum(wlen(w) for w, _ in tok); k = (length - sum(p for _, p in tok[:-1]) * .2) / sp; tm, x = [], 0
        for w, p in tok: tm.append((x, x + wlen(w) * k)); x += wlen(w) * k + p * .2
    secs[s['id']] = {'start': round(t, 3), 'end': round(t + length, 3), 'sec': s['id']}
    for (w, _), (a, b) in zip(tok, tm): words.append({'w': w, 's': round(t + a, 3), 'e': round(t + b, 3), 'sec': s['id']})
    report.append(f"{s['id']} {t:7.2f}–{t + length:7.2f}  {len(tok):3} words  ({src})")
    t += length + GAP
total = t - GAP + TAIL
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
json.dump({'duration': round(total, 3), 'provisional': True, 'source': f'tools/provisional_timing.py (Hörfassung v2 takes + silence snap; words from {VO or "segments.json"})',
           'sections': secs, 'clips': [], 'words': words}, open(OUT, 'w'), indent=0)
print('\n'.join(report))
print(f'VO end {t - GAP:.2f} s · duration incl. end screen {total:.2f} s · {len(words)} words → {OUT}')
