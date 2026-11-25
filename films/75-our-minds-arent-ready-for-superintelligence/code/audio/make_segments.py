#!/usr/bin/env python3
"""Film 75 "Our Minds Aren't Ready for Superintelligence" · vo-v5.txt (fact-checked, second check 25.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method as Film 69.
Sections = the stations (same ids as tools/provisional_timing.py), found by the first words of the line that opens them:
  H hook · 1 the three old reflexes (C2 Bengio, K1 Wilson) · 2 how fast rules move (EU AI law, ozone) · M subscribe 1 · 3 the fast clock (C1 Harari)
  4 set both clocks (the evening, a few years on) · 5 the headline again · A2 closing call (+ end screen).
vo-v5 carries the slots as lines of their own ([CLIP C2: "..."]): a slot goes where that line stands; the line is never spoken.
Blank lines in vo-v5 = station pauses (build_vo.py GAP_SECTION between sections; none at the hook end: text-v2 "Keine Pause, direkt weiter").
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters.
Voice text: one voice tag at the start of each section's first take (TAGS; never whisper tags, STANDARD-STIMME.md).
'say' = the text sent to Eleven v4 where it differs from 'text': 'AI' -> 'A.I.', 'UN' -> 'U.N.' (spelled, as film 69) and IPA for Hassabis (text-v2 §10: hah-SAH-bis), TTS text only.
Slot length = out_s - in_s of cuts.json (the cut inside the source file, clips_wav.py).
usage: make_segments.py [vo-v5.txt] [out segments.json]"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F75ROOT', '/mnt/project-files/scenario/film-75-godlike/').rstrip('/') + '/'
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v5.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', "Our minds aren't ready"), ('1', 'To see what it is'), ('2', "Take Europe's AI law"), ('M', 'This channel exists'),
        ('3', 'Is there anything that moves'), ('4', 'Then you notice more'), ('5', 'Tonight, or tomorrow'), ('A2', 'This channel exists')]
TAGS = {'H': 'calm, conversational', '1': 'thoughtful', '2': 'calm, conversational', 'M': 'warm', '3': 'curious', '4': 'thoughtful',
        '5': 'calm, conversational', 'A2': 'warm'}
SAY = [('Hassabis', '/həˈsɑːbɪs/'), ("UN's", "U.N.'s"), ('the UN ', 'the U.N. ')]
MAXC = 560
CUTS = {k: v for k, v in json.load(open(os.path.join(HERE, 'cuts.json'))).items() if not k.startswith('_')}
LEN = {c: round(v['out_s'] - v['in_s'], 2) for c, v in CUTS.items()}
SLOT = re.compile(r'\[CLIP\s+([CK]\d+[a-z]?)\b[^\]]*\]')
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
    m = SLOT.fullmatch(l)
    if m:
        flush(); c = m.group(1); seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': LEN[c], 'file': CUTS[c]['file']}); continue
    if si < len(SECS) and l.startswith(SECS[si][1]) and SECS[si][0] != sec:
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    cur.append(l)
flush()
assert si == len(SECS), (si, SECS[si])
assert [s['id'] for s in seg if s.get('clip')] == ['C2', 'K1', 'C1']
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars;', sum(len(s.get('say', s.get('text', ''))) for s in seg), 'TTS chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', (s.get('text') or '')[:80].replace('\n', ' / '))
