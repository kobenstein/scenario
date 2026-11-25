#!/usr/bin/env python3
"""Film 79 'Your Life in 2050: The AI Worst Case' (mirror of #74) · shot list, REGELN §13 (one picture per sentence, explainer share 60-70 %).
One row per sentence (clips and the end screen are rows too). Writes docs/shots.md with the numbers computed on the timing file
(real VO <ROOT>audio/timing.json if present, else data/provisional_timing.json) and data/rows.json (read by film.mjs).
Types: S = SZENE-2.5D (a real place of the script as parallax layers) · M = MIX (graphic, counter, type or a paper card ON a scene) ·
E = EXPL (pure explainer graphic) · C = CLIP. Weights (§13.2): E 1 · M .5 · S 0 · C 0. Target 60-70 % (unlike #74, which deviated to ~42 %).
Columns: id · phrase (first words of the sentence, used to find its time) · type · shows literally · new motif? (y / n = same picture, beat) ·
carrier to the next row · flag (A = leitbild anchor: the same street, * = wow moment of the section).
While the rows do not cover the whole VO yet (vo-v2 pending), the numbers are computed over the covered span and flagged as such.
usage: python3 tools/shots79.py [timing.json]"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); CODE = os.path.dirname(HERE)
ROOT = os.environ.get('F79ROOT', '/mnt/project-files/scenario/film-79-worst-case/').rstrip('/') + '/'
TF = sys.argv[1] if len(sys.argv) > 1 else (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else CODE + '/data/provisional_timing.json')
ROWS = [
# ---- c01 HOOK (vo-v1; v2 keeps the hook, re-anchor phrases if a line changes)
('H.01', 'This is your life in', 'M', 'YOUR STREET 2050 at cold dawn (thumbnail A): box hedges where the cars stood, the windowless tower at the end with its carmine band, you (yellow coat) at your door · 2050 rolls in · small tag A WARNING · IF WE GET IT WRONG (0:00-0:05)', 'y', 'the road line', 'A'),
('H.02', 'If we get', 'M', 'same street, AI WENT WRONG rises under 2050 on "wrong", the tower band flickers once (anticipation)', 'n', 'the road line becomes a timeline', ''),
('H.03', 'The worst case', 'E', 'TIMELINE 2026 -> 2050 on the night ground; the 2050 end is marked THE WORST CASE', 'y', 'the line', ''),
('H.04', 'No war', 'E', 'a blue-ink war sign (flames over a roof) drops toward the line and is struck out', 'y', 'the strike', ''),
('H.05', 'No robot army', 'E', 'a blue-ink marching row of giant robots drops toward the line and is struck out', 'y', 'the strike', ''),
('H.06', 'Superintelligence came, and', 'E', 'a carmine ring lands on the line (EARLY 2030s · A SCENARIO ASSUMPTION); on "works" the line after it turns perfectly even and bright', 'y', 'the ring', ''),
('H.07', 'Just not for', 'E', 'you walk along the line; the bright line runs on to 2050 BENEATH you but lifts off your path: you are left on a thin grey line', 'y', 'the 2050 dot becomes the bedroom window', '*'),
('H.08', 'You wake up', 'S', 'BEDROOM at cold dawn (2.5D): you sit up; the corner clock starts MONDAY · 8:10 AM', 'y', 'the empty nightstand', ''),
('H.09', 'Nothing woke you', 'S', 'push to the nightstand: a pale ring in the dust where a clock used to stand', 'y', 'the ring in the dust', ''),
('H.10', 'Your grandson is holding', 'S', 'KITCHEN, cold light: your grandson (about nine, rust coat) lifts the brass alarm clock out of an old box; through the window: the tower', 'y', 'the clock face', ''),
('H.11', 'What was this for', 'S', 'close: he holds the clock out to you (his line)', 'y', 'the clock face', ''),
('H.12', 'It got you to', 'M', 'a paper flashback card unfolds out of the clock face: BACK IN THE TWENTIES, the bells shake at 6:15, a figure hurries out of a door TO WORK', 'y', 'the door on the card', ''),
('H.13', "He doesn't ask what", 'S', 'kitchen: the card folds back into the clock; he turns the clock in his hands, not curious about work', 'y', 'his look at you', ''),
('H.14', 'He asks who needed', 'M', 'the card opens once more: YOU in the middle, thin ink lines to the people who waited for you (a boss at a desk, a customer at a counter, a child at a school gate); the lines go slack one by one', 'y', 'the empty centre', ''),
('H.15', 'So how does a world', 'M', 'HALLWAY: the NOT NEEDED counter grows big over the hall: nine boxes, the first one filled carmine (THE ALARM CLOCK), a question mark; his look goes to the front door', 'y', 'the front door', ''),
('H.16', 'You open the front', 'S', 'the front door swings open into cold light (portal)', 'y', 'the door opening', ''),
('H.17', "It's your street", 'S', 'YOUR STREET at eye level (leitbild): the same row houses as #74, the corner at the end · tag YOUR STREET · 2050', 'y', 'the houses', ''),
('H.18', 'Same houses', 'S', 'beat: the house fronts catch the pale light one after another', 'n', 'the corner', ''),
('H.19', 'Same corner', 'S', 'beat: the corner house at the end catches the light', 'n', 'the facades', ''),
('H.20', 'Nothing is broken', 'M', 'a blue-ink ghost of broken windows and a cracked facade lies over the house across and is wiped off: the real panes are whole', 'y', 'your door', ''),
('H.21', 'Nothing was stolen', 'M', 'at your door: a parcel on the step and a bicycle against the wall, untouched; a blue-ink ghost of a forced door is wiped off', 'y', 'the kerb', ''),
('H.22', 'Every hedge is trimmed', 'S', 'truck along the kerb: box hedges stand in the old parking bays, cut to the millimetre, the trimmed tree balls behind', 'y', 'the road', ''),
('H.23', 'An empty car glides', 'S', 'a robotaxi with crates (no passengers) glides past you at the kerb and does not slow down', 'y', 'the car leads the eye down the street', ''),
('H.24', 'At the end of the', 'M', 'push down the street to its end: a blue-ink drawing of 2026 cornfields lies over the horizon and is wiped; a FENCE runs across the end of the street', 'y', 'the fence line', ''),
('H.25', 'Behind it, a tower', 'S', 'rise up the TOWER behind the fence (thumbnail A): windowless, the carmine band breathes; you tiny at the street; it never goes dark', 'y', 'the band', '*'),
('H.26', "And it's Monday morning", 'M', 'a calendar leaf MONDAY drops into the empty street (mirror of #74)', 'y', 'the leaf', ''),
('H.27', 'Nobody on this street', 'M', 'pull back: every front door shut; over each door a tiny tag 0 APPOINTMENTS fades in and out in a row; nobody steps out', 'y', 'the neighbour\'s closed garage door', ''),
]
ROWS_ALL = ROWS
CHUNKS = [('c01', 'H.01', 'Hook: your street, the timeline, bedroom, kitchen + clock, flashback cards, hallway counter, your street, fence + tower')]
# c02-c10 follow when vo-v2 is in (docs/BRIEF-builders.md has the planned split by station)
W = {'E': 1.0, 'M': .5, 'S': 0.0, 'C': 0.0}
NAME = {'S': 'SZENE-2.5D', 'M': 'MIX', 'E': 'EXPL', 'C': 'CLIP'}

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())
def times(tf):
    TM = json.load(open(tf)); ws = TM['words']; clips = {c['id']: c for c in TM.get('clips', [])}
    out, after = [], -1
    for r in ROWS:
        rid, ph = r[0], r[1]
        if rid in clips: out.append(clips[rid]['start']); after = clips[rid]['end']; continue
        if rid == 'END': out.append(TM['duration'] - 15.0); continue
        q = [norm(x) for x in ph.split()]; hit = None
        for i in range(len(ws) - len(q) + 1):
            if ws[i]['s'] < after - 1e-3: continue
            if all((norm(ws[i + j]['w']) == p) if j < len(q) - 1 else norm(ws[i + j]['w']).startswith(p) for j, p in enumerate(q)): hit = ws[i]['s']; break
        if hit is None: raise SystemExit(f'phrase not found: {rid} "{ph}" after {after:.1f}')
        out.append(hit); after = hit
    return out, TM

def sentence_end(ws, s0):
    j = next(k for k, w in enumerate(ws) if abs(w['s'] - s0) < 1e-6); words = []
    while j < len(ws):
        words.append(ws[j]['w'])
        if re.search(r'[.?!]["”]?$', ws[j]['w']): break
        j += 1
    return ' '.join(words), ws[j]['e'] if j < len(ws) else ws[-1]['e']

def main():
    st, TM = times(TF); dur = TM['duration']; prov = TM.get('provisional', False); ws = TM['words']
    covered_all = ROWS[-1][0] == 'END'
    last_end = dur if covered_all else sentence_end(ws, st[-1])[1] + .4
    a = [0.0] + [max(0, s - .35) for s in st[1:]]
    b = a[1:] + [last_end]
    L = [y - x for x, y in zip(a, b)]; span_s = sum(L)
    sec = {k: 0.0 for k in W}
    for r, l in zip(ROWS, L): sec[r[2]] += l
    share = sum(W[k] * v for k, v in sec.items()) / span_s * 100
    new = sum(1 for r in ROWS if r[4] == 'y'); anchors = [r[0] for r in ROWS if r[6] == 'A']
    ft = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
    cov = '' if covered_all else f' **Rows cover 0:00-{ft(last_end)} of {ft(dur)} only (vo-v2 pending): numbers are for the covered span.**'
    o = ['# Film 79 · "Your Life in 2050: The AI Worst Case" · shot list (binding, one row per sentence)', '',
         f'Generated by `tools/shots79.py` from `{os.path.basename(TF)}`{" (PROVISIONAL timing from " + TM.get("source", "?") + ")" if prov else " (real VO)"}, duration {dur:.1f} s. Edit the table in the script, never this file. **Code anchors on phrases, never on seconds.**' + cov, '',
         '## 1 · Numbers (REGELN §13.2, computed before animating)', '',
         f'- **Explainer share (weighted): {share:.1f} %** over {ft(span_s)} (target for the whole film 60-70 %; the hook carries feeling, so it sits lower, the stations carry the mechanism).',
         '- Seconds by type: ' + ' · '.join(f'{NAME[k]} {v:.0f} s ({v / span_s * 100:.0f} %)' for k, v in sorted(sec.items(), key=lambda kv: -kv[1])),
         f'- Rows: {len(ROWS)} · new motifs: {new} · leitbild anchors (the same street): {len(anchors)} ({", ".join(anchors)}) · wow moments (*): {sum(1 for r in ROWS if r[6] == "*")}.',
         '- Hard cuts planned: 0 (every boundary is a carrier: portal through a window/door/frame, iris out of a round shape, a near layer sweeping past the lens, a paper card unfolding from an object, or a graphic that builds out of the scene and falls back into it).', '',
         '## 2 · Chunks', '', '| chunk | from | start | contents |', '|---|---|---|---|']
    idx = {r[0]: i for i, r in enumerate(ROWS)}
    for c, first, txt in CHUNKS: o.append(f'| {c} | {first} | {ft(st[idx[first]])} | {txt} |')
    o += ['', '## 3 · Shots', '', '| ID | t | len | Satz | Typ | zeigt wörtlich | Motiv neu? | Träger → nächstes | |', '|---|---|---|---|---|---|---|---|---|']
    for i, r in enumerate(ROWS):
        sent = ('[' + r[0] + ']' if r[0] != 'END' else '[end screen]') if r[1] is None else sentence_end(ws, st[i])[0]
        o.append(f'| {r[0]} | {ft(st[i])} | {L[i]:.1f} | {sent} | {NAME[r[2]]} | {r[3]} | {"yes" if r[4] == "y" else "no (beat)"} | {r[5]} | {r[6]} |')
    o += ['', '## 4 · Nicht wiederholen', '',
          '- **#74 (the mirror):** same street, same stations, same clock, same day clock and the same carriers, but never the same picture: no apple trees, no chalk, no robot on a ladder, no gold sun, no lanterns, no dancing children. #74 light = warm gold, #79 light = cold, the machine = carmine.',
          '- **#23 "A Day in 2037":** the street in section at night, the kitchen light wall, the tutor voice-light, night interiors with cut-away floors.',
          '- **#63 Pope:** the machine block, the slot, the scale. **#59:** crystal, bell, stamps as seal. **#54:** the great hall. **#67:** headline sky, chalkboard, paper tower. **#66/#27/#64:** price tags, receipts, pay slips, the dollar bar (the allowance is a phone notification + a one-way line, no amounts).',
          '- **Channel bans:** robot faces as "the AI" (the thumbnail robot is the only giant robot and only as an ink sign that is struck out in the hook), brains, matrix code, server racks, explosions, villains.']
    open(os.path.join(CODE, 'docs', 'shots.md'), 'w').write('\n'.join(o) + '\n')
    print(f'{len(ROWS)} rows · explainer share {share:.1f} % over {span_s:.0f} s · S {sec["S"]:.0f}s M {sec["M"]:.0f}s E {sec["E"]:.0f}s C {sec["C"]:.0f}s · new {new} · anchors {anchors}')
    tm = {r[0]: st[i] for i, r in enumerate(ROWS)}
    json.dump([{'id': r[0], 'phrase': r[1], 'type': r[2], 't': tm.get(r[0])} for r in ROWS], open(os.path.join(CODE, 'data', 'rows.json'), 'w'))
if __name__ == '__main__': main()
