#!/usr/bin/env python3
"""Film 67 · "Meta's AI Chief Says Superintelligence Is Arriving" · the binding shot list -> docs/shots.md (times from the
current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json).
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots67.py
Every shot: id (station.n; H = hook, 1…10 = the sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the
film after the previous shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram: the checklist big, cards over the veil, an X crop with its highlighter, the balance, gold numbers) · MIX .5 (the
  world with a diagram on it: the gold card CORRECT, a pinned word, a verdict, the tower with its number) · LAND .3 (the night world
  itself, the ribbon, an anchor) · SCENE 0 (you, rooms, people) · CLIP 0.
Flags: W = a hard world change (budget ≤ 1 per minute) · ★ = the one wow moment of the chunk. The checklist changes by itself (F.CHECKS)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F67ROOT', '/mnt/project-files/scenario/film-si-arriving/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'LAND': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Superintelligence is arriving'), ('c02', 'B1', 'The man is Alexandr Wang'), ('c03', 'B1', 'First check'), ('c04', 'B1', 'But a referee only rules'),
          ('c05', 'B2', "That leaves Wang's boldest"), ('c06', 'B2', 'This channel exists'), ('c07', 'B2', 'And behind that headline'),
          ('c08', 'B3', 'Not like a coup'), ('c09', 'B3', 'But look at what the mathematicians'), ('c10', 'B3', 'The labs could'), ('c11', 'B3', 'Superintelligence is arriving. So')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'Superintelligence is arriving', 'THUMBNAIL A: the headline SUPERINTELLIGENCE IS ARRIVING in giant gold letters in the night sky; you tiny on the quay below', 'SCENE', 'the headline', ''),
 ('H.02', "That's what Meta's", 'Wang\'s X post header (x/01-header.png) unrolls under the headline like a pinned print', 'MIX', 'the post', ''),
 ('H.03', 'Is he right', 'a cream ? as tall as the letters falls next to IS ARRIVING; you look up', 'SCENE', 'the ?', ''),
 ('H.04', 'Because if he is', 'the camera drops to you: the windows of your street turn gold, outward from you', 'SCENE', 'the headline', ''),
 ('H.05', 'His evidence is', 'THE FILE (small, gold) leaves the headline and sinks into your raised hand; PROOF CLAIMED · NOV 20, 2026', 'MIX', 'the file', ''),
 ('H.06', 'In it, a mathematician', 'you walk right; the file flies to the empty spot of the huge chalkboard: RIEMANN HYPOTHESIS · UNSOLVED; the author (no name) stands at its foot with a laptop', 'MIX', 'the file', ''),
 ('H.07', 'A separate program', 'a light scans the file line by line, tiny checks behind it; the gold card CORRECT rises out of it', 'MIX', 'the file', ''),
 ('H.08', 'But written out', 'the file opens, pages pour, the paper tower rises out of the frame; 250,000+ PAGES; you and the author look up', 'SCENE', 'the tower', '★'),
 ('H.09', "Meta's A.I. chief says", 'the tower darkens; the X crop "…alien mind that we don\'t understand" unrolls out of the post header; gold highlighter on "alien mind"', 'EXPL', 'the crop', ''),
 ('H.10', 'Many physicists', 'the crop "…a homework problem compared to the Riemann Hypothesis" under it (highlighter); the balance: HOMEWORK light, the file heavy', 'EXPL', 'the balance', ''),
 ('H.11', "If he's right", 'the crops roll back; a chalk robot drawn on the board is wiped to dust ("a machine we fear"); AN ANSWER WE CAN\'T READ writes in gold, the file glows', 'MIX', 'the ?', ''),
 ('H.12', 'So test his claim', 'the ? flies into the checklist IS HE RIGHT? that slides in top right (five cream boxes) → plateWang', 'LAND', 'plateWang', ''),
 # ---------------------------------------------------------------- c02 · B1 · who he is
 ('1.01', 'The man is Alexandr Wang', 'out of plateWang: the avatar of the post header grows into the PORTRAIT PRINT (wang/portrait-cutout.png, paper-cut duotone, ONCE) + nameplate ALEXANDR WANG · CHIEF AI OFFICER, META', 'EXPL', 'the portrait', ''),
 ('1.02', 'He runs a lab', 'the portrait slides aside; glide right to the labs: the door sign META SUPERINTELLIGENCE LABS, the word SUPERINTELLIGENCE lights gold', 'MIX', 'the sign', ''),
 ('1.03', 'That bomb comparison', 'the balance from the hook comes back small; a footnote line under the homework crop stays empty: SOURCE: —', 'EXPL', 'the crop', ''),
 ('1.04', 'And still, his essay', 'X crop "lazy thinking" (highlighter); a conveyor carries the headline toward the horizon by itself, Wang\'s small figure pulls the lever, the belt stops', 'EXPL', 'the headline', ''),
 ('1.05', 'But look at who is speaking', 'the headline hangs as a billboard over the door of his own lab (billboard 1); you notice the sign', 'MIX', 'the lab door', ''),
 ('1.06', 'Here he is, months earlier', 'the camera flies through the lab door into the clip plate', 'SCENE', 'the plate', ''),
 ('1.07', 'slot:C1', 'C1 ALEXANDR WANG · CHIEF AI OFFICER, META · 2026 · ORIGINAL FOOTAGE (SOURCE per clips.md); the plate goes back into the door', 'CLIP', 'the door', ''),
 ('1.08', 'And yet this proof came', 'two labs side by side, the gold file glows in the OTHER lab\'s window (otherLab 1); Wang applauds over the fence; two words write themselves in chalk under the headline: CONVICTION · INTEREST', 'MIX', 'the headline', '★'),
 ('1.09', 'So his word is not enough', 'the checklist slides from the edge toward the centre, box 1 pulses', 'EXPL', 'box 1', ''),
 # ---------------------------------------------------------------- c03 · B1 · check 1
 ('2.01', 'First check', 'box 1 big and empty (checklist writes CHECK 1 OF 5 · IS HIS EVIDENCE REAL?), you small in front of it', 'EXPL', 'the file', ''),
 ('2.02', 'What was published', 'four thin pages flutter in; behind them the file unrolls into THE RIBBON of code lines that never stops (≈ 17 MILLION LINES · PUBLISHED NOV 20, 2026)', 'MIX', 'the ribbon', ''),
 ('2.03', 'No human reads that', 'you leaf through the ribbon and give up; the author next to you does the same', 'SCENE', 'the ribbon', ''),
 ('2.04', 'It was written for a referee', 'along the ribbon walks THE REFEREE (striped shirt, a human as the image for the program) and taps every line; speech bubbles and medals bounce off him; LEAN · PROOF CHECKER', 'MIX', 'the referee', ''),
 ('2.05', "The referee's ruling", 'whistle; he raises the gold card CORRECT', 'MIX', 'the card', ''),
 ('2.06', 'Within a day', 'small figures at laptops, lights go on one after another (LEAN & MATHLIB COMMUNITY · NOV 21); a second referee at a table with a row of lamps, most gold, a few cream (SUTHERLAND, MIT …); CLAY PRIZE · NOT AWARDED', 'EXPL', 'box 1', ''),
 ('2.07', 'First box: gold', 'checklist: box 1 fills gold (by itself, F.CHECKS)', 'EXPL', 'the screen', '★'),
 ('2.08', 'And if it keeps holding', 'the camera flies into the clip plate', 'SCENE', 'the plate', ''),
 ('2.09', 'slot:C2', 'C2 (Conrey or Maynard per clips.md) · ORIGINAL FOOTAGE; plate back into the ribbon', 'CLIP', 'the ribbon', ''),
 # ---------------------------------------------------------------- c04 · B1 · checks 2 and 3
 ('3.01', 'But a referee only rules', 'the referee on his field; pull back: a second, almost identical field beside it', 'LAND', 'the fields', ''),
 ('3.02', 'Check two', 'both fields carry the same heading RIEMANN (CHECK 2 OF 5)', 'EXPL', 'the boards', ''),
 ('3.03', "One critic's worry", 'two chalkboards headed RIEMANN; one turns out a cardboard prop, behind it only A = A; OBJECTION: "TAUTOLOGY" · AMY NIELSEN', 'EXPL', 'the prop', ''),
 ('3.04', "But the author didn't write", 'the referee\'s rule book shelf: a dusty volume RIEMANN HYPOTHESIS; the author only takes it down (MATHLIB line)', 'MIX', 'the book', ''),
 ('3.05', 'The people who build the referee reject', 'box 2 fills gold with a cream rim and a small ?', 'EXPL', 'box 3', ''),
 ('3.06', 'But whose work is it', 'box 3 empty; two shadows fall on the gold file: a person\'s and a shapeless one (CHECK 3 OF 5)', 'MIX', 'the file', ''),
 ('3.07', 'The proof comes from', 'the author at his desk, a lit window beside him where lines grow faster than he can read; an old light bulb goes on; a wall calendar leafs six weeks; LEVENT ALPÖGE · ANTHROPIC · CLAUDE (EINBLENDUNG only) · OCT 6 – NOV 16', 'MIX', 'the bulb', ''),
 ('3.08', 'That company gains', 'the company sign behind him flares and dims; the camera goes close to him (C0 slot here if a video exists)', 'SCENE', 'the file', ''),
 ('3.09', "He doesn't fully understand", 'quote card "frankly completely outrageous" (NYT); he holds the file like something not quite his', 'EXPL', 'box 3', ''),
 ('3.10', "You don't say that", 'box 3 fills gold: three of five', 'EXPL', 'the split', '★'),
 ('3.11', 'Compare that with a second proof', 'split picture: left a handwritten manuscript on a lectern (SAME DAY · A RIVAL PROOF CLAIM BY A HUMAN)', 'MIX', 'the lectern', ''),
 ('3.12', 'So far, that one', 'left the lectern, the referee\'s seat beside it empty; right the referee with the gold card before the endless ribbon, no reader at all → plateReferee', 'LAND', 'plateReferee', ''),
 # ---------------------------------------------------------------- c05 · B2 · check 4
 ('4.01', "That leaves Wang's boldest", 'out of plateReferee: ALIEN MIND (the hook crop\'s highlighted words) rises behind box 4; box 4 big and empty (CHECK 4 OF 5)', 'EXPL', 'box 4', ''),
 ('4.02', 'On the day it appeared', 'Tao as a drawn figure before the wall of code with a magnifier that catches one line; quote card "the digestion process will take some time"', 'EXPL', 'the wall', ''),
 ('4.03', 'Another mathematician', 'a second figure before the same wall shakes his head (MAKSYM RADZIWIŁŁ)', 'MIX', 'the plate', ''),
 ('4.04', 'Here is Tao', 'fly into the clip plate', 'SCENE', 'the plate', ''),
 ('4.05', 'slot:C3', 'C3 TERENCE TAO · ORIGINAL FOOTAGE (per clips.md)', 'CLIP', 'the card', ''),
 ('4.06', 'So "correct" is not the same', 'the referee shows the gold card; you ask WHY? he shrugs; CORRECT ≠ UNDERSTOOD', 'EXPL', 'the gap', ''),
 ('4.07', 'And that gap is not a problem', 'the gap between CORRECT and UNDERSTOOD becomes a crack through an ordinary kitchen table; on it a sheet marked CORRECT (a gold card, no stamp)', 'MIX', 'the tower', ''),
 ('4.08', 'This box may never turn gold', 'the paper tower: you read at its foot, the seasons change behind you, the tower hardly shrinks; box 4 stays cream with OPEN', 'EXPL', 'the ribbon', '★'),
 ('4.09', 'So on this point, Wang is right', 'the ribbon runs past the horizon; your reading lamp reaches only a short way', 'LAND', 'the headline', ''),
 ('4.10', 'If you pictured the arrival', 'the cliché (searchlights, sirens) as a pale sketch goes out; the headline and below it the small gold file from second 10, now in your hand (HARVEST of "a single file")', 'SCENE', 'the windows', ''),
 # ---------------------------------------------------------------- c06 · B2 · subscribe 1, check 5
 ('M.01', 'This channel exists', 'subscribe 1: you turn to the camera; behind you small lights in windows around the world; a calm subscribe moment, no QR', 'LAND', 'the headline', ''),
 ('5.01', "But Wang's headline doesn't say", 'the headline big again; the smaller word PROOF lies over SUPERINTELLIGENCE, then the big word slides back (CHECK 5 OF 5)', 'EXPL', 'the milestone', ''),
 ('5.02', 'James Maynard', 'a milestone by the road turns gold; Maynard\'s figure walks calmly past, his path the same before and after; quote "historic milestone"', 'MIX', 'the road', ''),
 ('5.03', 'The sharpest doubt', 'LeCun as a drawn portrait figure (no photo), the Meta building behind him that he left; YANN LECUN · LEFT META IN NOV 2025', 'MIX', 'the plate', ''),
 ('5.04', 'slot:C4', 'C4 YANN LECUN · ORIGINAL FOOTAGE (per clips.md)', 'CLIP', 'the road', ''),
 ('5.05', 'The kind of A.I. behind', 'a road with the sign SUPERINTELLIGENCE; the lane where chat windows roll ends at a wall', 'EXPL', 'box 5', ''),
 ('5.06', 'So the fifth box only fills', 'box 5 fills only halfway; a betting slip with Wang\'s headline lies beside it', 'EXPL', 'the gap', '★'),
 ('5.07', 'But the gap between correct', 'the same crack between CORRECT and UNDERSTOOD, you at its edge; box 4 pulses at the edge', 'MIX', 'the post', ''),
 # ---------------------------------------------------------------- c07 · B2 · his worry, the handover
 ('6.01', 'And behind that headline', 'the X crop "…1000x smarter…" unrolls out of the post header (highlighter on 1000x); a measuring tape: you = one unit, at ×1000 the tape shoots out of frame', 'EXPL', 'the crop', ''),
 ('6.02', 'And he writes', 'the X crop "We should not be okay with a “handover”…" (highlighter); the word HANDOVER detaches in gold from the print', 'EXPL', 'HANDOVER', '★'),
 ('6.03', 'A handover. What would', 'HANDOVER alone in the dark; behind it the windows of a small town hall light up → plateHandover', 'LAND', 'plateHandover', ''),
 # ---------------------------------------------------------------- c08 · B3 · the town hall scenario
 ('7.01', 'Not like a coup', 'out of plateHandover: into the small town hall at evening, folding chairs, paper cups; you in the third row; SCENARIO · A FEW YEARS FROM NOW', 'SCENE', 'the plan', ''),
 ('7.02', 'The old bridge', 'on the wall the plan of a new, unusually slender bridge; CORRECT writes itself in gold onto the plan (the system\'s own card, no stamp)', 'MIX', 'the plan', ''),
 ('7.03', 'The reasoning runs longer', 'the same paper tower grows on the table; two engineers leaf, look at each other, shrug', 'MIX', 'the hands', ''),
 ('7.04', 'But the system has never been wrong', 'wide from behind: arm after arm goes up, last the yellow sleeve', 'SCENE', 'the window', '★'),
 ('7.05', 'That is a handover', 'the hall\'s window becomes one of a thousand windows (bank, office, town treasury), in each a small YES; with every yes a pen moves a little further from the table', 'EXPL', 'the referee', ''),
 # ---------------------------------------------------------------- c09 · B3 · what the mathematicians did
 ('8.01', 'But look at what the mathematicians', 'back to today: the referee at the gold ribbon; SCENARIO ends', 'LAND', 'the rule book', ''),
 ('8.02', 'They did not take', 'the referee\'s rule book open on a table; a student, a pensioner and an engineer start the same run on their own laptops (LEAN · OPEN · NONPROFIT …)', 'MIX', 'the light', ''),
 ('8.03', 'Their trust moved', 'a gold cone of light wanders from the file over to the referee', 'EXPL', 'the split', '★'),
 ('8.04', 'In your town hall', 'split: left the plan that marks itself CORRECT; right people building the referee\'s desk before the game starts', 'EXPL', 'the chair', ''),
 ('8.05', 'So who builds the referees', 'back in the town hall: an empty referee\'s chair beside the bridge plan', 'SCENE', 'the labs', ''),
 # ---------------------------------------------------------------- c10 · B3 · the ways
 ('9.01', 'The labs could', 'X crop "…the “default path” in front of us" (highlighter); a broad road DEFAULT PATH, the labs at a fork', 'EXPL', 'the fork', ''),
 ('9.02', "He doesn't say exactly how", 'the branching road is only dashed', 'MIX', 'the desks', ''),
 ('9.03', 'One way: labs agree', 'a referee\'s desk before every lab, each answer must pass it; one lab skips it and pulls ahead; OPTION · UNTESTED', 'EXPL', 'the line', ''),
 ('9.04', 'So governments could', 'a line across the road where all labs stop; in the town hall a field SHOW YOUR WORK; over the referee\'s shoulder: who stands behind him?', 'EXPL', 'the rule book', ''),
 ('9.05', 'Mathematics has one answer', 'the open rule book; the engineer from the town hall runs it on her own laptop; no company logo on the referee\'s shirt; LEAN FRO · NONPROFIT', 'MIX', 'the bridge', ''),
 ('9.06', 'The hardest objection', 'you cross the old bridge, under the deck a small engineer with her sheet; cut on the new bridge: the place under the deck is empty', 'SCENE', 'the table', '★'),
 ('9.07', 'None of this is agreed', 'a table with four chairs LABS · GOVERNMENTS · INVESTORS · VOTERS; the yellow raincoat over the fourth', 'EXPL', 'the calendar', ''),
 ('9.08', 'And Wang puts a clock', 'X crop "How humanity acts over the next year…" (highlighter on next year); a wall calendar with twelve empty months, the first leaf comes loose (NO clock face)', 'EXPL', 'the headline', ''),
 # ---------------------------------------------------------------- c11 · B3 · the verdict, the end
 ('10.01', 'Superintelligence is arriving. So', 'back to frame 0: the giant headline, you below; the checklist slides to the centre big (F.checklist big 1): gold · gold ? · gold · OPEN · half', 'EXPL', 'the headline', ''),
 ('10.02', 'Something has arrived', 'in the headline IS ARRIVING stays gold, SUPERINTELLIGENCE turns half cream (headline cream [.5, 0])', 'MIX', 'box 4', ''),
 ('10.03', 'And the box that is still open', 'box 4 big: DOES ANY HUMAN UNDERSTAND IT? · OPEN, empty, pulsing in cream; you stand before it (no cross, no red)', 'EXPL', 'the new headline', '★'),
 ('10.04', 'So when the next headline', 'a new empty headline slides in: AI SOLVED ___; you hold up two cards CAN A HUMAN FOLLOW IT? · WHO SAYS “CORRECT”?', 'EXPL', 'the cards', ''),
 ('10.05', 'We may never read', 'final picture: the ribbon runs unreadable to the horizon; you at the referee\'s chair, the whistle round your neck; the core sentence as text', 'SCENE', 'the chair', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2 over the final picture (the ribbon flows, box 4 pulses), no QR', 'LAND', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN (S.endScreen): you on the referee\'s chair, the ribbon to the horizon, the checklist with box 4 OPEN; lower half calm for the tiles', 'LAND', '—', ''),
]

norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
W = TM['words']; NW = [norm(w['w']) for w in W]
def find(phrase, after=-1.0, nth=0):
    q = [norm(x) for x in phrase.split() if norm(x)]; hit = 0
    for i in range(len(W) - len(q) + 1):
        if W[i]['s'] <= after: continue
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)):
            if hit == nth: return W[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.1f}: {phrase!r}')
def at(anchor, after):
    if anchor == 'END': return W[-1]['e'] + .6
    if anchor == 'ENDSCREEN': return TM['duration'] - 15
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    return find(p, -1 if n else after, int(n) if n else 0)
times, prev = [], -1.0
for s in SHOTS:
    try: t = at(s[1], prev - .01)
    except SystemExit:   # a line the sound agent has not re-taken yet: keep the order, warn (re-run when timing.json follows)
        t = prev + .01; print(f'  WARN {s[0]}: {s[1]!r} not in the timing yet (placed at {t:.1f} s)')
    times.append(t); prev = t
chunk_t = [0.0] + [at(c[2], -1) for c in CHUNKS[1:]]
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
rows, tot, wsum, cuts = [], 0.0, 0.0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[3]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[3]]
    cuts += 'W' in s[5].split()
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 67 · "Meta\'s AI Chief Says Superintelligence Is Arriving" (SUPERINTELLIGENCE IS ARRIVING) · shot list (binding)\n')
L.append(f'Generated by `tools/shots67.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact check may still change a few spoken lines: anchors are phrases, so the code does not care; if a phrase goes missing, `T.G` says which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · LAND .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. One world (THE NIGHT OF THE HEADLINE): the town, the chalkboard, the referee by the ribbon, the labs; the camera travels; the town-hall scenario (c08) is a room IN your town (enter through its window, leave the same way).')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. The checklist (IS HE RIGHT?, five boxes, top right) changes by itself (`F.checklist` from `F.CHECKS` phrases; never by hand).\n')
L.append('## 2 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2]} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b]); g[1] = b
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s)' for k, v in grp.items()) + '\n')
L.append('## 3 · Shots\n')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | picture (one idea) | layer | carrier → next | |')
        L.append('|---|---|---|---|---|---|---|---|')
    anc = s[1].replace('#1', ' (2nd)')
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {s[3]} | {s[4]} | {s[5]} |')
L.append('\n## 4 · Seams between the groups (lib/f67_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | The man is Alexandr Wang | plateWang (WANG_CAM: the headline, the post header, your gold street, you at the board\'s foot by the dark tower, the author, the file on the board, checklist 5 empty) | H.12 settles into it | 1.01 grows the portrait print out of the post header\'s avatar |")
L.append("| B1 → B2 | That leaves Wang\'s boldest | plateReferee (REFEREE_CAM: the referee on his chair, gold card up, the ribbon to the horizon, no reader; checklist 1–3 gold) | 3.12 settles | 4.01 brings ALIEN MIND up behind box 4 |")
L.append("| B2 → B3 | Not like a coup | plateHandover (TOWN_CAM: HANDOVER in gold over your town hall, its windows lit; checklist 1–3 gold, 4 OPEN, 5 half) | 6.03 settles | 7.01 glides into the town hall |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>`.\n')
L.append('## 5 · On-screen strings\n')
L.append('Wording: skript/text-v2.md [EINBLENDUNG]/[ZITATKARTE], as `F.SOURCES` in lib/f67_kit.mjs; Wang quotes are the real X screenshots (`F.xQuote`, films/67-assets/x/, wording verified in films/67-assets/zitate-check.md). ≤ 6 words per statement + one number (verbatim quotes may be longer). Text ≥ 22 px, never in the bottom 170 px (subtitles).')
L.append('- Names of the mathematician and the lab ONLY as the EINBLENDUNG at 3.07 (LEVENT ALPÖGE · ANTHROPIC · CLAUDE). The narrator never names them.')
L.append('- "Solved" never as a fact (only AI SOLVED ___ at 10.04). No stamps (#59): CORRECT is always the gold card. Box 4 is never a cross, never red.')
L.append('- **No QR anywhere.** No support / donation overlay. No AI images, no 3D game look; Wang\'s face only as the portrait print (1.01) and in C1.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
