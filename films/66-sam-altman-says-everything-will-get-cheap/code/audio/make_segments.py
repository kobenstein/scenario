#!/usr/bin/env python3
"""Film 66 'Sam Altman Says Everything Will Get Cheap' · vo-v3.txt (fact-checked, final 20.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 59 / 54 / 28.
Sections = the stations (same ids as tools/provisional_timing.py), found by the first words of the sentence that opens them:
  H hook · 1 the promise (C1) · 2 tag 1 thinking · 3 tag 2 education · M subscribe 1 · 4 tag 3 things (C2) · 5 tag 4 energy (C3) · 6 tag 5 food
  7 tag 6 housing · 8 tag 7 your wage (C4) · 9 three answers · 10 the order · A2 closing call (+ end screen).
The Hoerfassung vo-v3 has no [CLIP] tags: the slots go after the line that ends with their lead-in (CLIP_AFTER, as provisional_timing.py).
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters.
Voice text: 'AI' -> 'A.I.' (spelled, as Film 59); one voice tag at the start of each section's first take (TAGS; never whisper tags, STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text' (IPA for names: Acemoglu ah-JEM-oh-loo, Hassabis hah-SAH-biss); 'text' = the script words (alignment, subtitles).
Slots (build_vo.py inserts the real clip audio): length = the whole cut file <ROOT>clips/Cn.mp4 (ffprobe; 14.97 / 9.43 / 13.57 / 12.84 s).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, subprocess, sys
ROOT = os.environ.get('F66ROOT', '/mnt/project-files/scenario/film-geld-nach-si/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'segments.json')
SECS = [('H', 'Sam Altman says everything'), ('1', 'This January, he made'), ('2', 'Start where a price'), ('3', 'Education.'), ('M', 'This channel exists'),
        ('4', 'So far, every price'), ('5', 'Energy.'), ('6', 'One tag needs energy'), ('7', 'Housing. The first word'), ('8', 'So what does that do'),
        ('9', 'So how does everyone'), ('10', "So that's the order"), ('A2', 'This channel exists')]
CLIP_AFTER = [('C1', 'he made the promise again.'), ('C2', 'he said:'), ('C3', 'the world after that.'), ('C4', 'pointed to exactly this number.')]
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', '3': 'calm, conversational', 'M': 'warm', '4': 'curious',
        '5': 'thoughtful', '6': 'calm, conversational', '7': 'thoughtful', '8': 'thoughtful', '9': 'calm, conversational', '10': 'thoughtful', 'A2': 'warm'}
SAY = {'Acemoglu': '/ɑːˈdʒɛmoʊluː/', 'Hassabis': '/hɑːˈsɑːbɪs/'}
LEN = {c: round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{ROOT}clips/{c}.mp4'])), 2) for c, _ in CLIP_AFTER}
MAXC = 520
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
lines = [re.sub(r'\bAI\b', 'A.I.', l).replace('A.I..', 'A.I.') for l in lines]
seg, n, si, sec, cur, todo = [], 0, 0, None, [], list(CLIP_AFTER)
def flush():
    global n, cur
    if not cur: return
    text = '\n'.join(cur).strip()
    if sec not in [s['sec'] for s in seg if 'text' in s] and TAGS.get(sec): text = f'[{TAGS[sec]}] ' + text
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = text
    for k, v in SAY.items(): say = say.replace(k, v)
    if say != text: s['say'] = say
    seg.append(s); n += 1; cur = []
for l in lines:
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if todo and l.endswith(todo[0][1]):
        flush(); c = todo.pop(0)[0]; seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': LEN[c]})
flush()
assert si == len(SECS), si
assert not todo, todo
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
mid = next(s for s in tk if s['sec'] == 'M'); mid['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', (s.get('text') or '')[:70].replace('\n', ' / '))
