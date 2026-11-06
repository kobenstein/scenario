#!/usr/bin/env python3
"""Film 19 · provisional timing.json from the script (vo-v3.txt, the fact-checked narration) until the audio agent writes audio/timing.json.
Same format as audio/build_vo.py ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written against it runs
unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE), never on seconds, and never on segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json]
Pace calibrated to the Kokoro listening draft hoerfassung-v2.mp3 (576.96 s incl. the clip placeholders): ~150 words/min plus
punctuation pauses; LEAD 1.0 s, paragraph gap 0.75 s, section gap 1.5 s, end-screen tail 15 s.
Clips (clips-v1.md): [CLIP C1] runs MUTED UNDER the paragraph that follows it (8 s, no own time: the [wry] paragraph is its
framing sentence); [CLIP C2] (~11 s) and [CLIP C3] (~14 s) are silent slots of their length plus 0.7 s air before and 0.6 s after
(the same numbers as audio/build_vo.py CLIP_IN / CLIP_OUT). They land in "clips" as {id, kind: 'clip', start, end, under}."""
import json, os, re, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = args[0] if args else '/mnt/project-files/scenario/film-biocomputer/vo-v3.txt'
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
LEAD, TAIL, GAP_PARA, GAP_SEC, WORD = 1.0, 15.0, 0.75, 1.5, 0.31   # Film 19: WORD tuned so the VO ends near the draft's 577 s
CLIP_LEN = {'C1': 8.0, 'C2': 11.0, 'C3': 14.0}                      # clips-v1.md lengths; C1 runs under the voice
CLIP_IN, CLIP_OUT = 0.7, 0.6
# sections: id, first words of the paragraph that opens it (the stations of geruest-v1.md / text-v2.md)
SECS = [('H', 'Computers now run on'), ('1', 'In a lab'), ('2', 'The answer came from'), ('3', "It didn't stay in the lab"),
        ('4', 'It comes down to a number'), ('5', 'Picture it as a match'), ('6', 'First, how big is it'), ('7', 'At the start, the question')]
TAG = re.compile(r'\[[^\[\]]*\]')
CLIP = re.compile(r'\[CLIP (C\d+)\]')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(SRC).read()) if p.strip()]
t, sec, n, words, secs, clips, under = LEAD, None, 0, [], {}, [], None
for pi, p in enumerate(paras):
    if len(p) == 1 and CLIP.fullmatch(p[0]):
        cid = CLIP.fullmatch(p[0]).group(1)
        if cid == 'C1': under = cid; continue            # starts with the next spoken word, takes no time of its own
        t += CLIP_IN - GAP_PARA                             # the paragraph gap already ran: top it up to the clip air
        clips.append({'id': cid, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + CLIP_LEN[cid], 3), 'under': False})
        t += CLIP_LEN[cid] + CLIP_OUT
        continue
    if CLIP.fullmatch(p[0]):                              # a clip line opening a paragraph: [CLIP C1] runs under it
        under = CLIP.fullmatch(p[0]).group(1); p = p[1:]
    first = next((TAG.sub('', l).strip() for l in p), '')
    hit = next((s for s, w in SECS if first.startswith(w)), None)
    if hit and hit != sec:
        if sec is not None: t += GAP_SEC - GAP_PARA
        sec = hit
    sid = f's{n:02d}'; n += 1; start = None
    for l in p:
        if l.strip() == '[pause]': t += 1.0; continue
        for w in TAG.sub('', l).split():
            d = WORD + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
            if start is None:
                start = t
                if under: clips.append({'id': under, 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + CLIP_LEN[under], 3), 'under': True}); under = None
            words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
            t += d
            if w.endswith('...'): t += .55
            elif w[-1] in '.!?': t += .38
            elif w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?': t += .38
            elif w[-1] in ',:;': t += .16
    if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
    t += GAP_PARA
total = round(t - GAP_PARA + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
print(f'duration {total:.1f} s (VO end {words[-1]["e"]:.1f}), {len(words)} words, clips {[(c["id"], c["start"], c["end"]) for c in clips]} -> {OUT}')
for k, v in secs.items(): print(k, v['sec'], v['start'], v['end'])
