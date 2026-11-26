#!/usr/bin/env python3
"""Film 41 'Bill Gates Changed His Mind About AI and Jobs' · vo-v4.txt (24.11.) -> segments.json (takes for ElevenLabs v4 + clip slots). Method 1:1 as Film 67 / 66 / 59.
Sections = the stations of the film (same ids as code/tools/provisional_timing.py), found by the first words of the line that opens them (voice tags stripped):
  H hook (Gates changed his mind, Human Reserved) · 1 what changed (FT Live, C1) · 2 stop 1 the screen · 3 stop 2 hands, robots (Decoder C2) · 4 is he right?
  M subscribe 1 · 5 stop 3 the 20 years (Decoder C3), the tax · 6 Human Reserved, the list, the quote card · 7 abundance, the verdict · A2 closing call (+ end screen).
vo-v4 lines 'CLIP: [CLIP Cn …]' = a slot. The line 'KARTE: [ZITATKARTE …]' is an on-screen quote card: NOT spoken and no slot; the NEXT line speaks the quote
(the take gets 'card': CARD_ID, build_vo.py gives the card the time of those words; kind 'card', under: True).
A take = consecutive lines of ONE section, split at clip slots and at ~MAXC characters. Standalone '[pause]' lines are put in front of the next line (inline tag).
Voice tags: vo-v4 has none except [pause]; DIRECT adds sparse STANDARD-STIMME tags at line starts ([calm, conversational], [thoughtful], [curious], [wry], [warm];
never whisper tags, asserted). align_ps.py drops [..] for the alignment.
'say' = the text sent to Eleven v4 where it differs from 'text' (respellings for names, only in the TTS text); 'text' = the script words (alignment, subtitles).
Slot length: the real clip file in CLIPS (films/41-assets/clips/Cn.mp4, ffprobe) when it is there, else the PLANNED length (silent placeholder).
usage: make_segments.py [vo-v4.txt] [out segments.json]"""
import glob, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F41ROOT', '/mnt/project-files/scenario/film-bill-gates/').rstrip('/') + '/'
CLIPS = os.environ.get('F41CLIPS', os.path.normpath(os.path.join(HERE, '../../../41-assets/clips'))).rstrip('/')
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT + 'vo-v4.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'segments.json')
SECS = [('H', 'Bill Gates changed his mind'), ('1', 'This month, at a Financial Times event'), ('2', 'For Gates, the first work'), ('3', "That's the usual comfort"),
        ('4', "Start with who's talking"), ('M', 'This channel exists'), ('5', 'That leaves the last stop'), ('6', 'Human Reserved. In his words'),
        ('7', 'Now look past those twenty'), ('A2', 'This channel exists')]
PLANNED = {'C1': 10.9, 'C2': 12.98, 'C3': 8.51}   # placeholder lengths (clips-geprueft.json) if a cut file is missing
CARD_ID = 'C4'   # the quote card that replaces the planned C4 clip (GatesNotes, 'Who gets to decide …')
# sparse voice direction (STANDARD-STIMME: at most one tag per paragraph, at the sentence start); key = start of the script line
DIRECT = {'Bill Gates changed his mind': 'calm, conversational', 'But he doesn\'t want to stop': 'thoughtful',
          'What changed is his picture': 'thoughtful', 'For Gates, the first work': 'calm, conversational', 'If that\'s you, this stop': 'thoughtful',
          "That's the usual comfort": 'wry', 'Start with who\'s talking': 'calm, conversational', 'So here is what the evidence supports': 'thoughtful',
          'This channel exists': 'warm', 'That leaves the last stop': 'thoughtful', 'And even a perfect tax': 'thoughtful', 'Take the jury.': 'curious',
          'How long could such a list get?': 'curious', 'Ask who decides, right now': 'thoughtful', 'Try a line yourself.': 'curious',
          'Now look past those twenty': 'calm, conversational', 'The question is no longer': 'thoughtful'}
# pronunciation, TTS text only (Eleven v4 reads IPA between slashes): Etzioni et-see-OH-nee
SAY = [('Etzioni', '/ɛtˈsjoʊni/')]
MAXC = 520
CLIP = re.compile(r'^(?:CLIP:\s*)?\[CLIP\s+(C\d+)\b[^\]]*\]$')
KARTE = re.compile(r'^KARTE:\s*\[ZITATKARTE\b[^\]]*\]$')
TAG = re.compile(r'\[[^\]]*\]\s*')
def cliplen(c):
    fs = [f for f in sorted(glob.glob(f'{CLIPS}/{c}.*')) if f.rsplit('.', 1)[1].lower() in ('mp4', 'mov', 'm4a', 'wav', 'mp3', 'mkv', 'webm')]
    if not fs: return PLANNED[c], None
    return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fs[0]])), 2), os.path.basename(fs[0])
lines = [l.strip() for l in open(SRC, encoding='utf8').read().splitlines() if l.strip()]
seg, n, si, sec, cur, card = [], 0, 0, None, [], None
def flush():
    global n, cur, card
    if not cur: return
    text = '\n'.join(cur).strip()
    s = {'id': f't{n:02d}', 'sec': sec, 'text': text, 'chars': len(text), **({'card': card} if card else {})}
    say = text
    for k, v in SAY: say = say.replace(k, v)
    if say != text: s['say'] = say
    seg.append(s); n += 1; cur = []; card = None
def slot(c):
    d, f = cliplen(c)
    seg.append({'id': c, 'sec': sec, 'clip': True, 'dur': d, **({'file': f} if f else {'placeholder': True})})
pend, card_next = '', False
for l in lines:
    m = CLIP.match(l)
    if m: flush(); slot(m.group(1)); continue
    if KARTE.match(l): card_next = True; continue
    if l == '[pause]': pend = '[pause] '; continue
    bare = TAG.sub('', l)
    if si < len(SECS) and bare.startswith(SECS[si][1]):
        flush(); sec = SECS[si][0]; si += 1
    elif cur and sum(len(x) + 1 for x in cur) + len(l) > MAXC: flush()
    tag = next((v for k, v in DIRECT.items() if bare.startswith(k)), None)
    if tag and not pend and not l.startswith('['): l = f'[{tag}] {l}'
    cur.append(pend + l); pend = ''
    if card_next: card = CARD_ID; card_next = False
flush()
assert si == len(SECS), (si, SECS[si])
bad = re.findall(r'\[(softly|whisper\w*|quietly|hushed)[^\]]*\]', json.dumps(seg), re.I)
assert not bad, bad
tk = [s for s in seg if 'text' in s]
tk[-1]['cta'] = True
next(s for s in tk if s['sec'] == 'M')['cta'] = True
json.dump(seg, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(seg), 'entries;', sum(s.get('chars', 0) for s in seg), 'chars')
for s in seg: print(s['id'], s['sec'], s.get('chars', s.get('dur')), 'SAY' if s.get('say') else '', s.get('card', ''), s.get('file', 'PLACEHOLDER' if s.get('placeholder') else ''), (s.get('text') or '')[:70].replace('\n', ' / '))
