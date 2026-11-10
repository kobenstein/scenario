#!/usr/bin/env python3
"""Film 24: vo-v5.txt -> audio/segments.json. The script has no blank lines, so the takes are cut at the listed first words
(START below: first words of the line -> section, direction tag). One take per block (about one scene of the picture, <= 650 chars).
  [SOUND: pig 1 ...] / [SOUND: pig 2 ...] -> silent sound slot P1 / P2 (kind sound, 3.9 / 3.6 s, or the real clips/pig*.wav)
  [CLIP C1..C5]                          -> silent clip slot (kind clip, planned length, real length from clips/clips.json)
  [pause]                                -> 'pause' on the take before (1.2 s of silence instead of the normal gap)
A take that is a channel call ('subscribe' in it) gets id cta1 / cta2 and 'cta': True. Direction tags: ONE per take, only
[calm, conversational] / [thoughtful] / [curious] / [wry]; never [softly]/[whispers]/[quietly]/[hushed] (Jakob 8.11.).
usage: f24_make_segments.py <vo-v5.txt> <audio_dir>"""
import json, re, sys
src, A = sys.argv[1], sys.argv[2].rstrip('/')
CALM, THO, CUR, WRY = '[calm, conversational]', '[thoughtful]', '[curious]', '[wry]'
# (first words of the line that opens the take, section, tag); section ids as in tools/provisional_timing.py of the picture lead
START = [('Scientists are trying', 'H', CALM), ('And this one.', 'H', None), ("It's the second pig", 'H', CALM),
         ('Their A.I. can already', '1', THO), ("One of the team's founders", '1', CALM), ('Serious money', '1', CUR),
         ('Every baby on Earth', '2', THO), ("The team's A.I. does the listening", '2', CALM), ('But a baby has one more', '2', THO),
         ('Further than you might', '3', CALM), ('If elephants have names', '3', CUR), ('Now north, to Spain', '3', CALM),
         ('In the Caribbean', '3', CALM), ('Up north, in the Bahamas', '3', CALM), ("Google's model is built", '3', THO),
         ('Why is meaning so hard', '4', THO), ("There's a prize worth millions", '4', CUR), ('One whale. One call.', '4', THO),
         ('This channel exists', '4', CALM), ('But suppose they make it', '5', THO), ('Now think back to those pigs', '5', CALM),
         ('Now imagine a machine', '5', CUR), ('Remind people that farm animals', '5', THO), ('Twenty thirty. Day one', '6', THO), ('Year one. A courtroom', '6', CALM),
         ('Year ten. A farm kitchen', '6', CALM), ('Under the table', '6', WRY), ('Listening to animals is practice', '6', THO),
         ('Back to today', '6', CALM), ('Want the arrival', '6', CALM)]
PLAN = {'C1': 6.8, 'C2': 9.6, 'C3': 10.6, 'C4': 13.3, 'C5': 9.2}   # slot lengths (s) of the cut clips (coordinator 9.11. 12:1x; first plan was 10/7/7/7/9); the real footage replaces them (build_vo.py)
SOUND = {'1': ('P1', 'pig1-positive.wav', 3.9), '2': ('P2', 'pig2-negative.wav', 3.6)}   # pig call lengths (s)
lines = [l.strip() for l in open(src, encoding='utf8').read().splitlines() if l.strip()]
segs, cur, n, sec = [], None, 0, 'H'
def close():
    global cur
    cur = None
for l in lines:
    m = re.fullmatch(r'\[CLIP (C\d)\]', l); s = re.match(r'\[SOUND[: ]+pig (\d)', l)
    if m: close(); segs.append({'id': m.group(1), 'sec': sec, 'clip': True, 'dur': PLAN[m.group(1)]}); continue
    if s: close(); i, f, dd = SOUND[s.group(1)]; segs.append({'id': i, 'sec': sec, 'sound': True, 'dur': dd, 'file': f}); continue
    if l == '[pause]': segs[-1]['pause'] = True; close(); continue
    hit = next((x for x in START if l.startswith(x[0])), None)
    if hit or cur is None:
        if not hit: raise SystemExit('line opens a take but is not in START: ' + l)
        sec = hit[1]; cur = {'id': f's{n:02d}', 'sec': sec, 'text': ((hit[2] + ' ') if hit[2] else '') + l}; n += 1; segs.append(cur)
    else: cur['text'] += '\n' + l
nc = k = 0
for s in segs:
    if 'text' not in s: continue
    if 'subscribe' in s['text'].lower(): nc += 1; s['id'] = f'cta{nc}'; s['cta'] = True
    else: s['id'] = f's{k:02d}'; k += 1
for s in segs:
    if 'text' in s: assert not re.search(r'softly|whisper|quietly|hushed', s['text'], re.I), s['id']; s['chars'] = len(s['text'])
json.dump(segs, open(A + '/segments.json', 'w'), indent=1, ensure_ascii=False)
for s in segs: print(s['id'], s['sec'], s.get('chars', ''), 'pause' if s.get('pause') else '', '|', (s.get('text') or ('SLOT ' + str(s['dur'])))[:70].replace('\n', ' / '))
print(sum(s.get('chars', 0) for s in segs), 'chars')
