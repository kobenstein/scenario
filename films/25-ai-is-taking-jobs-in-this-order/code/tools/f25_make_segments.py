#!/usr/bin/env python3
"""Film 25 'The Last Human Job': vo-v4.txt -> audio/segments.json (method as tools/f24_make_segments.py).
The script has long paragraphs, so every paragraph is split into sentences (one per line inside a take, as Film 24) and the takes are cut at
the listed first words (START, matched IN ORDER, so a repeated sentence such as the closing line is not mixed up).
  [JAKOB Jn]  -> silent slot of Jakob's own voice (kind 'oton'), real length from <o-ton dir>/Jn.wav (planned length until it exists)
  [CLIP Kn]   -> silent interview-clip slot (kind 'clip'), planned length K1 13.2 / K2 9.7 / K3 12.0 s
  [PAUSE ]    -> 'pause' on the take before (1.2 s of silence instead of the normal gap)
A take with 'subscribe' becomes cta1 / cta2 (channel calls). Direction tags: ONE per take at most, only [calm, conversational] / [thoughtful] /
[curious] / [wry]; never softly/whisper/quiet/hushed (Jakob 8.11.).
usage: f25_make_segments.py <vo-v4.txt> <audio_dir>"""
import json, os, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
OTON = os.environ.get('F25OTON', '/mnt/project-files/scenario/film-last-human-job/o-ton/clips-v1').rstrip('/')
CALM, THO, CUR, WRY, NONE = '[calm, conversational]', '[thoughtful]', '[curious]', '[wry]', None
# section ids = chapters of text-v3: H HOOK · 1 AKT 1 (Ten kinds of work) · 2 AKT 2 (Number seven) · 3 AKT 3 (Number five) · 4 PLATZ 1 · 5 AKT 4 · 6 ENDE
START = [('There will be a last', 'H', CALM), ('Every job is a row', 'H', THO), ("This time, the machines", 'H', CALM), ('The creator of this channel', 'H', THO),
         ('A few years ago, he did', 'H', CALM), ('Ten kinds of work', '1', THO), ('Number ten.', '1', CALM), ('And then the researchers', '1', THO),
         ('A few pictures.', '1', CUR), ('Jakob stopped booking', '1', WRY), ('Number eight.', '1', CALM), ('Surely the creative work', '1', CUR),
         ('Number seven. Not really', '2', CALM), ("So here's the puzzle", '2', THO), ('Machines now read many scans', '2', CALM),
         ('Every time the machine took a step, the human took one up.', '2', THO), ('This channel exists for one reason', '2', CALM),
         ('From here on', '2', THO), ('Number five. Teachers', '3', CALM), ('Number four. Doctors', '3', THO), ('Number three. The trades', '3', CALM),
         ('Notice the catch', '3', THO), ('Number two. Care', '3', CALM), ('By hand, one film', '3', THO), ("Number one isn't", '4', CALM),
         ("It's the person who sits", '4', THO), ('So how do you stay', '5', CALM), ('Third, trust', '5', NONE), ('And fifth, learning', '5', THO),
         ('Every time the machine took a step, the human took one up. So the last', '6', THO), ('This channel exists so that', '6', CALM)]
PLAN = {'K1': 13.2, 'K2': 9.7, 'K3': 12.0}                 # interview clip slots (clips.json 10.11.)
OT_PLAN = {'J1': 10.93, 'J2': 15.00, 'J3': 11.47, 'J3b': 6.60, 'J4': 5.60, 'J5': 4.20, 'J6': 5.85}
def abbr(s): return s.replace('A.I.', 'A\u00b7I\u00b7')
def unabbr(s): return s.replace('·', '.')
def sentences(par):   # 'A.I. could' stays inside its sentence, 'A.I. Here' ends one
    return [unabbr(x.strip()) for x in re.split(r'(?<=[.?!])\s+|(?<=A\u00b7I\u00b7)\s+(?=[A-Z])', abbr(par)) if x.strip()]
lines = [l.strip() for l in open(src, encoding='utf8').read().splitlines() if l.strip()]
segs, cur, sec, si = [], None, 'H', 0
for l in lines:
    m = re.fullmatch(r'\[(JAKOB|CLIP)\s+([JK]\d+b?)\]', l)
    if m:
        cur = None; cid = m.group(2)
        if m.group(1) == 'JAKOB':
            f = f'{OTON}/{cid}.wav'
            d = round(float(os.popen(f'ffprobe -v error -show_entries format=duration -of csv=p=0 {f}').read() or 0), 3) if os.path.exists(f) else OT_PLAN[cid]
            segs.append({'id': cid, 'sec': sec, 'oton': True, 'dur': d, 'file': f'{cid}.wav'})
        else: segs.append({'id': cid, 'sec': sec, 'clip': True, 'dur': PLAN[cid]})
        continue
    if re.fullmatch(r'\[PAUSE[^\]]*\]', l, re.I): segs[-1]['pause'] = True; cur = None; continue
    for s in sentences(l):
        if si < len(START):
            # a START entry may span two sentences ('Number seven. Not really', '... took a step, ... one up. So the last'): compare with the paragraph tail
            tail = unabbr(abbr(l)[abbr(l).find(abbr(s)):])
            if tail.startswith(START[si][0]) or s.startswith(START[si][0]):
                sec, tag = START[si][1], START[si][2]; si += 1
                cur = {'id': '?', 'sec': sec, 'text': ((tag + ' ') if tag else '') + s}; segs.append(cur); continue
        if cur is None: raise SystemExit(f'sentence opens a take but is not in START (next expected: {START[si][0] if si < len(START) else None}): ' + s)
        cur['text'] += '\n' + s
assert si == len(START), f'START entries not all matched: {START[si][0]}'
nc = k = 0
for s in segs:
    if 'text' not in s: continue
    if 'subscribe' in s['text'].lower(): nc += 1; s['id'] = f'cta{nc}'; s['cta'] = True
    else: s['id'] = f's{k:02d}'; k += 1
for s in segs:
    if 'text' in s:
        assert not re.search(r'softly|whisper|quietly|hushed', s['text'], re.I), s['id']; s['chars'] = len(s['text'])
        assert s['chars'] <= 700, (s['id'], s['chars'])
json.dump(segs, open(A + '/segments.json', 'w'), indent=1, ensure_ascii=False)
for s in segs: print(s['id'], s['sec'], s.get('chars', ''), 'pause' if s.get('pause') else '', '|', (s.get('text') or ('SLOT ' + str(s['dur'])))[:80].replace('\n', ' / '))
print(sum(s.get('chars', 0) for s in segs), 'chars,', sum(1 for s in segs if 'text' in s), 'takes')
