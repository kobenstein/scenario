#!/usr/bin/env python3
"""Film 19 · provisional timing.json from the script (vo-v5.txt, after the fact check) until the audio agent writes <ROOT>audio/timing.json.
Same format as audio/build_vo.py ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE), never on seconds, and never on segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json] [--c4]
Pace: ~150 words/min incl. punctuation pauses, calibrated to hoerfassung-v4.mp3 (442.8 s for the 1,124 words of vo-v4); vo-v5 has 1,139 words.
LEAD 1.0 s, paragraph gap 0.75 s, section gap 1.5 s, end-screen tail 15 s.
Interview clips (ORIGINAL FOOTAGE, clips-v1.md) get a silent slot right after their anchor sentence: clips[] = {id, kind:'clip', start, end}.
C1 von Foerster (10 s) after "And every round goes faster." · C2 Beth Barnes / METR (12 s) after "at least half the time." ·
C3 researchers on recursive self-improvement (Dwarkesh, PrSf7IOYu-I; placeholder frame until cut) (9 s) after "Some forecasts assume exactly that." · C4 von Foerster, the imperative (8 s, only with --c4) after the quote."""
import json, os, re, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else '/mnt/project-files/scenario/film-singularity-friday/vo-v5.txt'
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_PARA, GAP_SEC, WORD = 1.0, 15.0, 0.75, 1.5, 0.297   # WORD calibrated: VO end ≈ 442 s like hoerfassung-v4.mp3
CLIP_IN, CLIP_OUT = 0.7, 0.6                                          # air before / after a clip (as audio/build_vo.py)
# sections = the seven chapters of text-v4.md (id, first words of the paragraph that opens it)
SECS = [('1', 'The singularity was predicted'), ('2', 'What drove the first line up'), ('3', 'To find out'), ('4', 'A date sounds precise'),
        ('5', 'Only if we can see it'), ('6', "But seeing the road isn't steering"), ('7', 'To tell bigger from smaller')]
# clip slots: id, the words that END the anchor sentence (stable phrases, see docs/shots.md §5), length s
CLIPS = [('C1', 'every round goes faster.', 10.0), ('C2', 'at least half the time.', 12.0), ('C3', 'Some forecasts assume exactly that.', 9.0)]
if '--c4' in sys.argv: CLIPS.append(('C4', 'the number of choices."', 8.0))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
TAG = re.compile(r'\[[^\[\]]*\]')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(SRC).read()) if p.strip()]
t, sec, n, words, secs, clips = LEAD, None, 0, [], {}, []
pending = [(cid, [norm(x) for x in end.split()], d) for cid, end, d in CLIPS]
for pi, p in enumerate(paras):
    first = TAG.sub('', p[0]).strip()
    hit = next((s for s, w in SECS if first.startswith(w)), None)
    if hit and hit != sec:
        if sec is not None: t += GAP_SEC - GAP_PARA
        sec = hit
    sid = f's{n:02d}'; n += 1; start = None
    for l in p:
        for w in TAG.sub('', l).split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None: start = t
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if w.endswith('...'): t += .55
            elif w[-1] in '.!?': t += .38
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += .38
            elif w[-1] in ',:;': t += .16
            # a clip slot after its anchor sentence (silent in the VO; the clip's own sound plays there)
            for k, (cid, q, cd) in enumerate(pending):
                if len(words) >= len(q) and all(norm(words[-len(q) + j]['w']) == q[j] for j in range(len(q))):
                    t = words[-1]['e'] + CLIP_IN
                    clips.append({'id': cid, 'kind': 'clip', 'sec': sid, 'start': round(t, 3), 'end': round(t + cd, 3)})
                    t += cd + CLIP_OUT; pending.pop(k); break
    if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_PARA
if pending: raise SystemExit(f'clip anchors not found: {[p[0] for p in pending]}')
total = round(t - GAP_PARA + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
vo_end = words[-1]['e']; cs = sum(c['end'] - c['start'] for c in clips)
print(f'duration {total:.1f} s (VO end {vo_end:.1f} s), {len(words)} words, {len(clips)} clips = {cs:.0f} s ({100 * cs / total:.1f} % of the film) -> {OUT}')
for c in clips: print(c['id'], c['start'], c['end'])
for k, v in secs.items(): print(k, v['sec'], v['start'], v['end'])
