#!/usr/bin/env python3
"""Film 65 "AI Can Now Call You in Your Mom's Voice" · vo-vN.txt -> segments.json (takes for ElevenLabs v4 + the clip slots). Method as #29 / #55.
Sections (stations) = H, 1, 2, 3, M, 4, 5, 6, 7, A2 (same ids as tools/provisional_timing.py of the picture lead), found by the first words of the
sentence that opens them:  H hook · 1 step 1 the voice (S1) · 2 step 2 the story · 3 step 3 the face · M subscribe call 1 · 4 step 4 the clock
(C10 quote card, C1) · 5 step 5 the money (S2) · 6 the big answer · 7 the ending (the phone rings again) · A2 subscribe call 2 (+ end screen).
A take = consecutive lines (paragraphs) of ONE section, joined by a blank line (the voice pauses there), split at [CLIP] and at ~MAXC chars.
Voice tags ([calm, conversational], [thoughtful], [curious], [warm], [pause]) stay in the take text: Eleven v4 reads them. No whisper tags (rule 8.11.).
[CLIP S1|C1|S2: "quote"]  REAL FOOTAGE: the clip's own sound goes into the timeline (slot = the whole cut file in <ROOT>clips/, its length measured
                          here; build_vo.py puts CLIP_IN / CLIP_OUT = 0.6 s of air before and after it).
[CLIP C10: "quote"]       QUOTE CARD (podcast narrator over a music bed = rule 'music = red'): a SILENT slot of LEN s, only the music bed plays.
usage: make_segments.py [vo.txt] [out segments.json]"""
import json, os, re, subprocess, sys
ROOT = os.environ.get('F65ROOT', '/mnt/project-files/scenario/film-ki-betrug/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else next(ROOT + f for f in ('vo-v5.txt', 'vo-v4.txt', 'vo-v3.txt') if os.path.exists(ROOT + f))
OUT = sys.argv[2] if len(sys.argv) > 2 else 'segments.json'
SECS = [('H', 'A.I. can now call you'), ('1', 'The first step is the voice'), ('2', 'That is the second step'),
        ('3', 'The third step is a face'), ('M', 'This channel exists for one reason'), ('4', 'So the scam must not give her the time'),
        ('5', 'Then one step is left'), ('6', 'Because a copy needs an original'), ('7', 'And one evening'), ('A2', 'This channel exists so that')]
FILES = {'S1': 'S1_DelMastro.mp4', 'C1': 'C1_FTC-Meador.mp4', 'S2': 'S2_Benda.mp4'}   # footage: the clip sound plays (clips/README.md, checked 20.11.)
SILENT = {'C10': 7.0}   # C10 FBI podcast: quote card, ~7 s of music only
SPEAKER = {'S1': 'Deborah Del Mastro', 'C1': 'Mark Meador', 'S2': 'Paul Benda', 'C10': 'Inside the FBI Podcast'}
HEARD = {'S2': 'In those moments, human judgment and the relationship between banker and customer can be just as important as any algorithm.'}   # as spoken (script: "these")
MAXC = 520
def flen(f):
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', ROOT + 'clips/' + f])), 3)
strip = lambda l: re.sub(r'^(\[[^\]]*\]\s*)+', '', l).lstrip('"“')
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur = [], 0, 0, None, []
def flush():
    global n, cur
    if not cur: return
    text = '\n\n'.join(cur).strip()
    seg.append({'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}); n += 1; cur = []
for l in lines:
    m = re.fullmatch(r'\[CLIP\s+([A-Z]\d+[a-z]?)\s*:?\s*(.*)\]', l)
    if m:
        flush(); cid = m.group(1); q = HEARD.get(cid) or m.group(2).strip().strip('"“”')
        e = {'id': cid, 'sec': sec, 'clip': True, 'quote': q, 'speaker': SPEAKER.get(cid, '')}
        if cid in FILES: e.update(dur=flen(FILES[cid]), file=FILES[cid], footage=True)
        else: e.update(dur=SILENT.get(cid, 7.0), footage=False, card=True)
        seg.append(e); continue
    if re.fullmatch(r'\[ENDCARD[^\]]*\]', l): continue
    if si < len(SECS) and strip(l).startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 2 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
flush()
assert si == len(SECS), si
assert not re.search(r'\[(softly|whisper\w*|quietly|hushed)\]', open(SRC, encoding='utf8').read(), re.I), 'whisper tag in the script (rule 8.11.)'
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(SRC, '->', len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'CTA' if s.get('cta') else '', (s.get('text') or s.get('quote') or '')[:70].replace('\n', ' / '))
