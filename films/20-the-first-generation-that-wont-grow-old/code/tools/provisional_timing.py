#!/usr/bin/env python3
"""Film 20 · provisional timing.json from the script (vo-v4.txt if it exists, else vo-v3.txt) until the audio agent writes
<ROOT>audio/timing.json. Same format as the real one ({duration, sections, clips, words:[{w,s,e,sec}]}), so scene code written
against it runs unchanged on the real VO. All scene code anchors on PHRASES (T.G / T.GE), never on seconds or segment ids.
  python3 tools/provisional_timing.py [vo.txt] [out.json] [--pace 150]
Pace: words per minute INCLUDING the sentence pauses (calibrated on hoerfassung-v3.mp3: 1,350 words in 536 s ≈ 150/min).
Clip lines `[CLIP C1]` get a silent slot as long as the main candidate in clips.json (in → out, C1a/C2a/C3a), quote-card lines
`[ZITATKARTE …]` a silent slot of CARD_S seconds (vo-v4: ER-100 5 s, Hassabis 6 s, Salk 6 s; the cards run without voice).
LEAD 0.6 s (picture first), paragraph gap 0.6 s, section gap 1.2 s, end-screen tail 15 s."""
import json, os, re, sys
ROOT = (os.environ.get('F20ROOT') or '/mnt/project-files/scenario/film-altern/').rstrip('/') + '/'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and not (i and sys.argv[i].startswith('--'))]
SRC = args[0] if args else (ROOT + 'vo-v4.txt' if os.path.exists(ROOT + 'vo-v4.txt') else ROOT + 'vo-v3.txt')
OUT = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'provisional_timing.json')
PACE = float(sys.argv[sys.argv.index('--pace') + 1]) if '--pace' in sys.argv else 150.0
LEAD, TAIL, GAP_PARA, GAP_SEC = 0.6, 15.0, 0.6, 1.2
CARD_S = [('Preliminary', 5.0), ('Hassabis', 6.0), ('Salk', 6.0)]   # needle in the card line → seconds (default 5)
# sections = the stations of text-v3.md (id, first words of the paragraph that opens it)
SECS = [('0', 'You could be part'), ('1', 'Every year, medical research'), ('2', 'Aging looks like'), ('3', 'Twenty years ago'),
        ('4', 'That search is too big'), ('5', 'Yes. Earlier this year'), ('6', 'Cancer. Heart disease'), ('7', 'That skeptic has run'),
        ('8', 'That treatment in the eye')]
CLIPLEN = {}
try:
    for c in json.load(open(ROOT + 'clips.json'))['clips']:
        k = c['id'][:2]
        if k in CLIPLEN: continue                       # the first candidate per slot is the main one (C1a, C2a, C3a)
        hms = lambda s: sum(float(x) * m for x, m in zip(s.split(':'), (3600, 60, 1)))
        CLIPLEN[k] = {'len': round(hms(c['out']) - hms(c['in']), 2), 'src': c['id'], 'speaker': c.get('speaker', ''), 'role': c.get('role', ''), 'date': c.get('date', '')}
except Exception as e:
    print('clips.json not read:', e)
TAG = re.compile(r'\[[^\[\]]*\]')
paras = [[l.strip() for l in p.splitlines() if l.strip()] for p in re.split(r'\n\s*\n', open(SRC).read()) if p.strip()]

def run(word):
    t, sec, n, words, secs, clips = LEAD, None, 0, [], {}, []
    for p in paras:
        first = next((TAG.sub('', l).strip() for l in p if not l.startswith('[')), '')
        hit = next((s for s, w in SECS if first.startswith(w)), None)
        if hit and hit != sec:
            if sec is not None: t += GAP_SEC - GAP_PARA
            sec = hit
        sid = f's{n:02d}'; n += 1; start = None
        for l in p:
            m = re.fullmatch(r'\[CLIP (C\d)\]', l)
            if m:
                c = CLIPLEN.get(m.group(1), {'len': 10.0, 'src': m.group(1)})
                clips.append({'id': m.group(1), 'kind': 'clip', 'sec': sec, 'start': round(t, 3), 'end': round(t + c['len'], 3), **{k: v for k, v in c.items() if k != 'len'}})
                t += c['len']; continue
            m = re.fullmatch(r'\[ZITATKARTE\s*(.*)\]', l)
            if m:
                d = next((s for k, s in CARD_S if k in m.group(1)), 5.0)
                clips.append({'id': f'Q{sum(1 for c in clips if c["kind"] == "card") + 1}', 'kind': 'card', 'sec': sec, 'start': round(t, 3), 'end': round(t + d, 3), 'text': m.group(1)})
                t += d; continue
            for w in TAG.sub('', l).split():
                d = word + 0.012 * max(0, len(re.sub(r'\W', '', w)) - 5)
                if start is None: start = t
                words.append({'w': w, 's': round(t, 3), 'e': round(t + d * .86, 3), 'sec': sid})
                t += d
                if w[-1] in '.!?' or (w[-1] in '"”' and len(w) > 1 and w[-2] in '.!?'): t += .36
                elif w[-1] in ',:;': t += .15
        if start is not None: secs[sid] = {'start': round(start, 3), 'end': round(words[-1]['e'], 3), 'sec': sec}
        t += GAP_PARA
    return t - GAP_PARA, words, secs, clips

# calibrate the word length so that the spoken part (without clip / card slots) runs at PACE words per minute
word = .3
for _ in range(30):
    end, words, secs, clips = run(word)
    spoken = end - LEAD - sum(c['end'] - c['start'] for c in clips)
    word *= (len(words) / PACE * 60) / spoken
end, words, secs, clips = run(word)
total = round(end + TAIL, 3)
json.dump({'duration': total, 'provisional': True, 'source': os.path.basename(SRC), 'vo_end': round(words[-1]['e'], 3), 'sections': secs, 'clips': clips, 'words': words}, open(OUT, 'w'), indent=0)
print(f'{os.path.basename(SRC)}: duration {total:.1f} s (VO end {words[-1]["e"]:.1f}), {len(words)} words at {PACE:.0f}/min (word {word:.3f} s), '
      f'{sum(c["kind"] == "clip" for c in clips)} clips, {sum(c["kind"] == "card" for c in clips)} cards -> {OUT}')
for c in clips: print(' ', c['id'], c['kind'], c['start'], c['end'], c.get('src', c.get('text', ''))[:60])
