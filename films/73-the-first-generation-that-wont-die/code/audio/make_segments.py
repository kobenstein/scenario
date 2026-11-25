#!/usr/bin/env python3
"""Film 73 'The First Generation That Won't Die' · vo-v3.txt (fact-checked, final) -> segments.json (takes for ElevenLabs v4 + clip slots). Method 1:1 as Film 69.
Sections = the stations (same ids as tools/provisional_timing.py), found by the first words of the line that opens them:
  H hook (the fly, the second way, 2032) · 1 the date (C1 Kurzweil) · 2 the copy (C3 Andregg) · 3 the answer most people give · M subscribe 1
  · 4 say it works (C4 Gratton) · 5 power and ideas change hands · 6 it doesn't have to go that way · E the honest answer · A2 closing call (+ end screen).
vo-v3 carries the slots as own lines [CLIP C1] / [CLIP C3] / [CLIP C4]; other bracket lines ([SCHLUSSBILD ...]) are stage notes and are dropped.
Blank lines in vo-v3 separate every paragraph (film 73): station pauses come from the section change (build_vo.py GAP_SECTION; none at the hook end, H -> 1).
A take = consecutive lines of ONE section, split at clip slots, after a subscribe call (own take, exact channel_calls times) and at ~MAXC characters.
Voice text: one voice tag at the start of each section's first take (TAGS; never whisper tags, STANDARD-STIMME.md / REGELN.md).
'say' = the text sent to Eleven v4 where it differs from 'text': the script already writes 'A.I.' and the years as spoken; 'AI' -> 'A.I.' kept as a guard.
Slot length: the whole cut file <ROOT>clips/Cn.mp4 (ffprobe) once it is there, else clips-geprueft.json duration_s (placeholder: silent slot).
usage: make_segments.py [vo-v3.txt] [out segments.json]"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F73ROOT', '/mnt/project-files/scenario/film-73-wont-die/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v3.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'Every generation before yours'), ('1', 'The date comes from'), ('2', 'Then the copy is'), ('3', 'Which brings back'),
        ('M', 'This channel exists'), ('4', 'Say it works'), ('5', 'And an inheritance is only'), ('6', "It doesn't have to go"),
        ('E', 'So is yours the first'), ('A2', "That's what this channel is for")]
TAGS = {'H': 'thoughtful', '1': 'calm, conversational', '2': 'curious', '3': 'thoughtful', 'M': 'warm', '4': 'calm, conversational',
        '5': 'thoughtful', '6': 'calm, conversational', 'E': 'thoughtful', 'A2': 'warm'}
SAY = []   # no IPA needed (Kurzweil, Planck, Beijing as written)
MAXC = 520
CTA_END = 'Then subscribe.'
GEP = json.load(open(ROOT + 'clips-geprueft.json', encoding='utf8')); GEP = {c['id']: c for c in (GEP if isinstance(GEP, list) else GEP['clips'])}
def clip_len(c):
    f = f'{ROOT}clips/{c}.mp4'
    if os.path.exists(f): return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f])), 2), False
    return round(float(GEP[c]['duration_s']), 2), True
raw = open(SRC, encoding='utf8').read()
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', raw, re.I)
assert not bad, bad
lines = [l.strip() for l in raw.splitlines() if l.strip()]
seg, n, si, sec, cur = [], 0, 0, None, []
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
    m = re.fullmatch(r'\[CLIP\s+(C\d+[a-z]?)\]', l)
    if m:
        flush(); c = m.group(1); d, ph = clip_len(c)
        seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': d, 'file': f'{c}.mp4', **({'placeholder': True} if ph else {})}); continue
    if re.fullmatch(r'\[[^\]]*\]', l): continue   # stage note
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
    if l.endswith(CTA_END): flush()
flush()
assert si == len(SECS), (si, SECS[si])
assert all(c in [s['id'] for s in seg] for c in ('C1', 'C3', 'C4'))
tk = [s for s in seg if 'text' in s]
for s in tk:
    if s['text'].endswith(CTA_END): s['cta'] = True
assert tk[-1].get('cta') and sum(1 for s in tk if s.get('cta')) == 2
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', 'PLACEHOLDER' if s.get('placeholder') else '', (s.get('text') or '')[:80].replace('\n', ' / '))
