#!/usr/bin/env python3
"""Film 23 · provisional timing.json from the script (vo-v5.txt) until the audio agent writes <ROOT>audio/timing.json.
Same format as audio/build_vo.py ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE), never on seconds and never on segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json] [--wpm 145]
Pace: the spoken part is calibrated to --wpm (default 145, text-v5: 1394 words = 9:37) INCLUDING punctuation pauses; LEAD 1.0 s,
paragraph gap 0.75 s, section gap 1.5 s, end-screen tail 15 s. [CLIP Kn] lines become silent clip slots like build_vo.py:
0.7 s air before, the clip, 0.6 s air after (K1 8.8 s, K3 7.7 s, K4 12.5 s; clips/clips.json)."""
import json, os, re, sys
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--wpm']
SRC = args[0] if args else '/mnt/project-files/scenario/film-erster-tag/2037/vo-v5.txt'
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
WPM = float(sys.argv[sys.argv.index('--wpm') + 1]) if '--wpm' in sys.argv else 145.0
LEAD, TAIL, GAP_PARA, GAP_SEC = 1.0, 15.0, 0.75, 1.5
CLIP_IN, CLIP_OUT = 0.7, 0.6
CLIPS = {'K1': (8.8, 'Bruce Schneier', 'Security technologist, Harvard Kennedy School', 2026),
         'K3': (7.7, 'Tim Berners-Lee', 'Inventor of the World Wide Web', 2023),
         'K4': (12.5, 'Sal Khan', 'Founder, Khan Academy', 2024)}
# sections = the eight movements of text-v5.md (hook + the seven hours), first words of the paragraph that opens each
SECS = [('0', 'Your twenty thirty-seven'), ('1', 'You open the scan'), ('2', 'Seven-thirty'), ('3', "Nine o'clock"), ('4', 'Noon'),
        ('5', 'Four o\'clock'), ('6', "Seven o'clock"), ('7', 'Ten-thirty')]
TAG = re.compile(r'\[[^\[\]]*\]')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(SRC).read()) if p.strip()]

def lay(word):
    t, sec, n, words, secs, clips, gaps = LEAD, None, 0, [], {}, [], 0.0
    for p in paras:
        first = next((TAG.sub('', l).strip() for l in p if not l.startswith('[')), '')
        nxt = SECS[[x for x, _ in SECS].index(sec) + 1] if sec is not None and sec != SECS[-1][0] else (SECS[0] if sec is None else None)
        hit = nxt[0] if nxt and first.startswith(nxt[1]) else None   # sections only advance (the last line repeats the first)
        if hit:
            if sec is not None: t += GAP_SEC - GAP_PARA; gaps += GAP_SEC - GAP_PARA
            sec = hit
        sid = f's{n:02d}'; n += 1; start = None
        for l in p:
            m = re.fullmatch(r'\[CLIP (K\d)\]', l)
            if m:
                k = m.group(1); d, name, role, year = CLIPS[k]
                t += CLIP_IN
                clips.append({'id': k, 'sec': sid, 'kind': 'clip', 'start': round(t, 3), 'end': round(t + d, 3), 'name': name, 'role': role, 'year': year})
                t += d + CLIP_OUT
                continue
            for w in TAG.sub('', l).split():
                d = word + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
                if start is None: start = t
                words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
                t += d
                if w.endswith('...'): t += .55
                elif w[-1] in '.!?': t += .38
                elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += .38
                elif w[-1] in ',:;': t += .16
        if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
        t += GAP_PARA
    return t, words, secs, clips

# calibrate: spoken time (everything except LEAD, clip slots and the tail) = n_words · 60 / WPM
lo, hi = .1, .8
for _ in range(40):
    mid = (lo + hi) / 2; t, words, secs, clips = lay(mid)
    spoken = t - GAP_PARA - LEAD - sum(c['end'] - c['start'] + CLIP_IN + CLIP_OUT for c in clips)
    lo, hi = (mid, hi) if spoken < len(words) * 60 / WPM else (lo, mid)
t, words, secs, clips = lay(mid)
total = round(t - GAP_PARA + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'wpm': WPM, 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
print(f'duration {total:.1f} s (VO end {words[-1]["e"]:.1f} s), {len(words)} words at {WPM:.0f} wpm (word slot {mid:.3f} s), {len(clips)} clips -> {OUT}')
for c in clips: print(c['id'], c['start'], c['end'])
last = None
for k, v in secs.items():
    if v['sec'] != last: print('section', v['sec'], 'from', v['start']); last = v['sec']
