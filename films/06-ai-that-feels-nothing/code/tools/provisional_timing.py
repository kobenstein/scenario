#!/usr/bin/env python3
"""Provisional VO timing for Film 5, written before the real voice exists.

Writes <audio>/timing.provisional.json (film.mjs uses it only while the real audio/timing.json is missing),
in exactly the format audio/build_vo.py produces:
  {"duration": s, "sections": {id: {"start", "end", "sec"}}, "clips": [], "words": [{"w", "s", "e", "sec"}]}
Section ids: H (hook), 0 … 7. Builders anchor only via phrases (T.S('3', 'same')), so the real timing.json
replaces this file later without code changes.

Estimate: 145 words per minute for the spoken words (longer words take a little longer, a comma or a full stop
gets a small share of that time), plus 1.0 s per [pause] inside a section and 1.8 s between sections
(build_vo.py: GAP_SECTION). Lead-in 1.4 s, tail 6.0 s, like build_vo.py.

usage:
  provisional_timing.py [--text film-05-text-vN.md] [--out .../audio/timing.json]
      reads the RECOMMENDED hook, then sections "### 0 ·" … "### 7 ·" (stops each block at PICTURE:/*Why…);
      "QUOTE CARD: who, when: "words"" lines are read aloud as the quoted words.
  provisional_timing.py --segments /tmp/claude-0/-home-user-scenario/7d9687bd-7149-579e-92ec-09522995c0c5/scratchpad/film6/audio/segments.json   (DEFAULT if it exists)
      the VO segments the real voice is made from ([{id, sec, text}], ids H0a, 00a, … 07b): same ids, same text,
      0.9 s between segments of one section, 1.8 s between sections (as build_vo.py), so phrases AND segment ids match.
  provisional_timing.py --vo film-05-vo-vN.txt [--starts starts.json]
      plain VO text (one beat per line, [pause] marks); sections are split where a line starts with the
      first words of a section (default map below, or a JSON {"H": "Your phone buzzes", "0": "The company is", …}).
"""
import argparse, json, re, sys

WPM, PAUSE, GAP_SECTION, LEAD, TAIL = 145.0, 1.0, 1.8, 1.4, 6.0
SCRIPT_DIR = '/mnt/project-files/scenario/schreibraum/film-07/'
OUT = '/tmp/claude-0/-home-user-scenario/7d9687bd-7149-579e-92ec-09522995c0c5/scratchpad/film6/audio/timing.provisional.json'  # never overwrite the real timing.json
STARTS = {'H': 'Your phone buzzes', '0': 'The company is Anthropic', '1': "That's less of a fantasy", '2': 'There are three ways',
          '3': "You're probably thinking", '4': 'Step one: sow', '5': 'Step two: grow', '6': 'Step three: harvest',
          '7': 'Remember that buzz'}


def spoken(line):
    """One script line -> spoken text ('' for notes), keeping [pause] marks."""
    line = line.strip()
    if not line or line.startswith(('#', '*', '|', '>', '- ', 'PICTURE', 'On screen', 'ON SCREEN')):
        return ''
    if line.upper().startswith('QUOTE CARD'):
        q = re.findall(r'["“]([^"”]+)["”]', line)
        if not q: return ''
        q = q[-1].strip()
        return f'"{q}"' if re.search(r'[.?!]$', q) else f'"{q}."'
    return line


def parse_md(path):
    md = open(path, encoding='utf-8').read().splitlines()
    blocks, cur, mode = {}, None, None
    for ln in md:
        h = re.match(r'^###\s+(.*)$', ln)
        if h:
            title = h.group(1)
            m = re.match(r'^(\d)\s*·', title)
            if m:
                cur, mode = m.group(1), 'sec'
            elif title.lower().startswith('hook') and 'RECOMMENDED' in title.upper():
                cur, mode = 'H', 'sec'
            else:
                cur, mode = None, None
            if cur: blocks[cur] = []
            continue
        if ln.startswith('## '):
            cur = None; continue
        if cur is None: continue
        if ln.startswith(('PICTURE', '*Why')):
            cur = None; continue
        blocks[cur].append(ln)
    order = ['H'] + [str(i) for i in range(8)]
    missing = [k for k in order if k not in blocks]
    if missing: sys.exit(f'sections missing in {path}: {missing} (is one hook marked RECOMMENDED?)')
    out = []
    for k in order:
        text = ' '.join(s for s in (spoken(l) for l in blocks[k]) if s)
        # "And Musk added:" + quote card -> one sentence
        out.append((k, re.sub(r'\s+', ' ', text).strip()))
    return out


def parse_vo(path, starts):
    lines = [l.strip() for l in open(path, encoding='utf-8') if l.strip()]
    norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower().replace('’', "'").replace("'", ''))
    order = list(starts.keys()); cuts = {}
    for i, l in enumerate(lines):
        for k in order:
            if k not in cuts and norm(l).startswith(norm(starts[k])):
                cuts[k] = i
    missing = [k for k in order if k not in cuts]
    if missing: sys.exit(f'section starts not found in {path}: {missing}')
    idx = sorted((cuts[k], k) for k in order)
    out = []
    for j, (i, k) in enumerate(idx):
        i2 = idx[j + 1][0] if j + 1 < len(idx) else len(lines)
        out.append((k, ' '.join(lines[i:i2])))
    return out


def parse_segments(path):
    segs = json.load(open(path, encoding='utf-8'))
    return [(s['id'], re.sub(r'\s+', ' ', s['text']).strip(), s.get('sec', s['id'])) for s in segs if not s.get('clip')]


def weight(w):
    letters = len(re.sub(r'[^A-Za-z0-9]', '', w))
    return 0.55 + 0.075 * letters          # relative duration of a word


def gap_after(w):
    if re.search(r'[.?!]["”’)]*$', w): return 0.42
    if re.search(r'[:;—]["”’)]*$', w): return 0.28
    if re.search(r',["”’)]*$', w): return 0.16
    return 0.035


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--text', default=SCRIPT_DIR + 'film-05-text-v1.md')
    ap.add_argument('--vo')
    ap.add_argument('--segments', default='/tmp/claude-0/-home-user-scenario/7d9687bd-7149-579e-92ec-09522995c0c5/scratchpad/film6/audio/segments.json')
    ap.add_argument('--md', action='store_true', help='force the markdown script instead of segments.json')
    ap.add_argument('--starts')
    ap.add_argument('--out', default=OUT)
    a = ap.parse_args()
    import os
    if a.vo:
        sections = [(k, txt, k) for k, txt in parse_vo(a.vo, json.load(open(a.starts)) if a.starts else STARTS)]
    elif not a.md and os.path.exists(a.segments):
        sections = parse_segments(a.segments)
    else:
        sections = [(k, txt, k) for k, txt in parse_md(a.text)]
    # tokens per section: words and pause marks
    toks = {k: [w for w in re.findall(r'\[[^\]]*\]|\S+', txt) if w == '[pause]' or not w.startswith('[')] for k, txt, _ in sections}
    words = [w for k in toks for w in toks[k] if w != '[pause]']
    raw = sum(weight(w) + gap_after(w) for w in words)
    k_time = (len(words) * 60.0 / WPM) / raw           # seconds per weight unit -> overall 145 wpm
    t, secs, out = LEAD, {}, []
    for i, (sid, _, sec) in enumerate(sections):
        ts = [x for x in toks[sid]]
        while ts and ts[-1] == '[pause]': ts.pop()      # trailing pauses: build_vo cuts at the last word
        while ts and ts[0] == '[pause]': ts.pop(0)
        start, last_e = t, t
        for j, w in enumerate(ts):
            if w == '[pause]':
                t += PAUSE; continue
            d = weight(w) * k_time
            out.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3), 'sec': sid})
            last_e = t + d
            t += d + gap_after(w) * k_time
        secs[sid] = {'start': round(start, 3), 'end': round(last_e, 3), 'sec': sec}
        nxt = sections[i + 1][2] if i + 1 < len(sections) else None
        t = last_e + (0 if nxt is None else GAP_SECTION if nxt != sec else 0.9)
    total = t + TAIL
    data = {'duration': round(total, 3), 'sections': secs, 'clips': [], 'words': out, 'provisional': True}
    with open(a.out, 'w') as f:
        json.dump(data, f, indent=0)
    print(f'{a.out}: duration {total:.1f} s ({total / 60:.2f} min), {len(out)} words, {sum(x.count("[pause]") for x in [" ".join(v) for v in toks.values()])} pause marks')
    for sid, v in secs.items():
        print(f'  {sid}: {v["start"]:7.2f} – {v["end"]:7.2f}')


if __name__ == '__main__':
    main()
