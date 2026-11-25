#!/usr/bin/env python3
"""Film 70 "Harari's Biggest Fear About AI Isn't Robots" · vo-v3.txt (fact-checked) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 69 (66 / 67).
Sections = the stations (paragraphs of vo-v3): H hook (C1) · 1 "Be honest." the chain of trust · 2 Money (C2) · 3 Contract · M subscribe call 1 (inside the Contract paragraph, no blank line)
  · 3b "When a machine says no" · 4 Law · 5 Truth · 6 "Harari's own answer" · 7 Three tests (C3) · 8 "Go back to the cow." · A2 closing call (+ end screen).
Found by the first words of the line that opens them (SECS; flag = must follow a blank line). vo-v3 has [CLIP Cn: "..."] lines: they are skipped here, the slots go after the lead-in line (CLIP_AFTER).
Blank lines in vo-v3 = station pauses (build_vo.py GAP_SECTION between sections; NO_STATION_PAUSE where the script has no blank line: 3 -> M -> 3b, 8 -> A2).
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters.
Voice text: one voice tag at the start of each section's first take (TAGS; never whisper tags, STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text': 'AI' -> 'A.I.' (spelled) and IPA for names, TTS text only; 'text' = the script words (alignment, subtitles).
'December 2027' is written out ('twenty twenty-seven') in 'text' and 'say' (aligner can't do digits); subs.py turns it back into 2027.
Slot length: in..out of clips_cut.json (the 1 s pre/post roll of the files is NOT used; clips-geprueft.json).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F70ROOT', '/mnt/project-files/scenario/film-harari/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', "Yuval Noah Harari's biggest", False), ('1', 'Be honest.', True), ('2', 'Money.', True), ('3', 'Contract.', True), ('M', 'This channel exists for one reason.', False),
        ('3b', 'When a machine says no', False), ('4', 'Law.', True), ('5', 'Truth.', True), ('6', "Harari's own answer", True), ('7', 'Three tests.', True),
        ('8', 'Go back to the cow.', True), ('A2', 'This channel exists so that', False)]
CLIP_AFTER = [('C1', 'Hear it from him.'), ('C2', 'machines invent themselves.'), ('C3', 'Harari ends up in the same place.')]
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', '3': 'thoughtful', 'M': 'warm', '3b': 'thoughtful', '4': 'calm, conversational',
        '5': 'thoughtful', '6': 'calm, conversational', '7': 'thoughtful', '8': 'thoughtful', 'A2': 'warm'}
# pronunciation, TTS text only (Eleven v4 reads IPA between slashes): Yuval yoo-VAHL, Noah NOH-ah, Harari hah-RAH-ree; 'December 2027' is spelled out (the aligner and subs.py: twenty twenty-seven -> 2027)
SAY = [("Harari's", '/hɑːˈrɑːriz/'), ('Harari', '/hɑːˈrɑːri/'), ('Yuval', '/juːˈvɑːl/'), ('Noah', '/ˈnoʊə/')]
DIGITS = [('December 2027', 'December twenty twenty-seven')]
MAXC = 520
CUT = json.load(open(os.path.join(HERE, 'clips_cut.json'))) if os.path.exists(os.path.join(HERE, 'clips_cut.json')) else {}
def cliplen(c):   # slot = in..out of clips_cut.json (not the 1 s pre/post roll); before the cut is known: the whole file
    if c in CUT: return round(CUT[c]['out'] - CUT[c]['in'], 2)
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{ROOT}clips/{c}.mp4'])), 2)
LEN = {c: cliplen(c) for c, _ in CLIP_AFTER}
raw = open(SRC, encoding='utf8').read()
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', raw, re.I)
assert not bad, bad
for a, b in DIGITS: raw = raw.replace(a, b)
raw = '\n'.join(l for l in raw.splitlines() if not l.startswith('[CLIP'))   # clip lines of vo-v3 = slot markers (wording checked in clips-geprueft.json); blank lines stay
lines = [l.strip() for l in raw.splitlines()]   # blank lines are kept to find 'new paragraph' (sections 1 2 3 4 ...)
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
newpar = True
for l in lines:
    if not l: newpar = True; continue
    if si < len(SECS) and l.startswith(SECS[si][1]) and (newpar or not SECS[si][2]):
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    newpar = False
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
