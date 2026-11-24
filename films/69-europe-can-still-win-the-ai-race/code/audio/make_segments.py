#!/usr/bin/env python3
"""Film 69 'Europe Can Still Win the AI Race' · vo-v3.txt (fact-checked, final 24.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 66 / 67.
Sections = the stations (same ids as tools/provisional_timing.py), found by the first words of the line that opens them:
  H hook · 1 what is already there (C1 Draghi) · 2 part 1 the money · 3 why it matters where a company lives (C2 Mensch) · 4 part 2 one set of rules
  5 part 3 the energy · M subscribe 1 · 6 part 4 one lab (C3 von der Leyen) · 7 part 5 the minds · 8 the second race (C4 Koerte) · 9 verdict (C1b Draghi) · A2 closing call (+ end screen).
The fact-checked vo-v3 has no [CLIP] tags: the slots go after the line that ends with their lead-in (CLIP_AFTER, as provisional_timing.py).
Blank lines in vo-v3 = station pauses (build_vo.py GAP_SECTION between sections; none at the hook end: H -> 1 gets the normal take gap, text-v2).
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters.
Voice text: one voice tag at the start of each section's first take (TAGS, text-v2; never whisper tags, STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text': 'AI' -> 'A.I.' (spelled) and IPA for names, TTS text only; 'text' = the script words (alignment, subtitles).
Slot length: the whole cut file <ROOT>clips/Cn.mp4 (ffprobe; clips-geprueft.json).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F69ROOT', '/mnt/project-files/scenario/film-europa-ki/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'Europe can still win'), ('1', 'Those chip machines'), ('2', 'Money first'), ('3', 'But why does it matter'),
        ('4', 'Because a company that wants'), ('5', 'None of it runs'), ('M', 'This channel exists'), ('6', 'Europe does need enough'),
        ('7', 'And a lab is an empty'), ('8', 'So suppose all five'), ('9', "So that's where the plan"), ('A2', 'This channel exists')]
CLIP_AFTER = [('C1', 'he gave his own verdict:'), ('C2', "Here's his warning:"), ('C3', 'really catching up:'), ('C4', 'listen to his point:'), ('C1b', 'now says:')]
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', '3': 'thoughtful', '4': 'calm, conversational', '5': 'calm, conversational',
        'M': 'warm', '6': 'thoughtful', '7': 'thoughtful', '8': 'curious', '9': 'thoughtful', 'A2': 'warm'}
# pronunciation, TTS text only (Eleven v4 reads IPA between slashes): Mistral mis-TRAHL, Mensch MENSH, Koerte KUR-tuh, von der Leyen fon dair LIE-en;
# Draghi, CERN, Siemens as written (the voice says them naturally)
SAY = [("Mistral's", '/mɪˈstrɑːlz/'), ('Mistral', '/mɪˈstrɑːl/'), ('Mensch', '/mɛnʃ/'), ('Koerte', '/ˈkɜːrtə/'), ('von der Leyen', '/fɒn dɛər ˈlaɪən/')]
MAXC = 520
LEN = {c: round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{ROOT}clips/{c}.mp4'])), 2) for c, _ in CLIP_AFTER}
raw = open(SRC, encoding='utf8').read()
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', raw, re.I)
assert not bad, bad
lines = [l.strip() for l in raw.splitlines() if l.strip()]
seg, n, si, sec, cur, todo = [], 0, 0, None, [], list(CLIP_AFTER)
def flush():
    global n, cur
    if not cur: return
    text = '\n'.join(cur).strip()
    if sec not in [s['sec'] for s in seg if 'text' in s] and TAGS.get(sec): text = f'[{TAGS[sec]}] ' + text
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text)}
    say = re.sub(r'\bAI\b', 'A.I.', text).replace('A.I..', 'A.I.')
    for k, v in SAY: say = say.replace(k, v)
    if say != text: s['say'] = say
    seg.append(s); n += 1; cur = []
for l in lines:
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if todo and l.endswith(todo[0][1]):
        flush(); c = todo.pop(0)[0]; seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': LEN[c], 'file': f'{c}.mp4'})
flush()
assert si == len(SECS), (si, SECS[si])
assert not todo, todo
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', (s.get('text') or '')[:80].replace('\n', ' / '))
