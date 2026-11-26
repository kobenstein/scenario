#!/usr/bin/env python3
"""Film 55 · "The Best AI Is Locked Away" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots55.py
Every shot: id (H = hook, 1…8 = the text-v2 sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the film
after the previous shot's anchor; 'slot:A1' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram made of the world's things: proof tape, calendar sheets, cores, clipboard, code wall, dot fields, slabs, words) ·
  CARD 1.0 (a quote card: wall text that lights word by word; it explains, there is no footage) ·
  MIX .5 (the line / a room with a diagram on it) · LINE .3 (THE LINE itself: marks, groups, the door explain a little) · SCENE 0 (the kitchen, a room, people).
Flags: W = a hard world change (budget < 1 per minute; portals and camera flights are continuous, not W) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F55ROOT', '/mnt/project-files/scenario/film-geheim-ki/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'CARD': 1.0, 'MIX': .5, 'LINE': .3, 'SCENE': 0.0}
CHUNKS = [('c01', 'Lead', 'The best'), ('c02', 'B1', 'At the very front stand'), ('c03', 'B1', 'A second lab'), ('c04', 'B1', 'Still, two things'),
          ('c05', 'B1', 'Ask either lab'), ('c06', 'B1', 'But safety is not all'),
          ('c07', 'B2', 'Fourth in line stand'), ('c08', 'B2', 'This channel exists'), ('c09', 'B2', "And by its maker's account"),
          ('c10', 'B2', "But the line doesn't end"), ('c11', 'B2', 'Switch on automatic'),
          ('c12', 'B3', 'That call was made inside'), ('c13', 'B3', 'So keep asking'), ('c14', 'B3', 'So if the machines are already'),
          ('c15', 'B3', 'So between you and the best'), ('c16', 'B3', 'One evening, a few months')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'The best', 'THUMBNAIL A at frame 0: the colossal door, gold leaking from the gap and lying on the floor, the line, you (yellow coat) far back left; THE BEST AI / IS LOCKED, out before "Tonight"', 'LINE', 'push to you', '★'),
 ('H.02', 'Tonight', 'push to you from behind; your phone lights; the kitchen opens out of its screen (portal): the lamp, the letter BANK, the car in the window', 'SCENE', 'the phone', ''),
 ('H.03', 'It answers in seconds', 'inside the kitchen the camera pushes to the phone; the answer builds line by line (abstract rows, no words)', 'SCENE', 'the phone screen', ''),
 ('H.04', "It isn't", 'the kitchen folds back into the phone; pull back over the whole line: the phone a point of light at its end; the leak brightens on "a door you can\'t open"', 'LINE', 'the gap', ''),
 ('H.05', 'And it has already found', 'push to the gap; a glimpse opens out of it: the code wall like masonry, one line glows gold, dust; 27 YEARS; source HIDDEN FOR 27 YEARS · OPENBSD · ANTHROPIC\'S OWN ACCOUNT', 'EXPL', 'the glimpse folds into the gap', ''),
 ('H.06', 'So how much stronger', 'you from behind, head up at the door far back right; HOW MUCH / STRONGER?', 'MIX', 'push to the door', ''),
 ('H.07', "And it doesn't stop", 'the proof tape slides out of the gap: rows write themselves, each gets a small cyan tick; NOT SUMS. (struck) · PROOFS.', 'EXPL', 'the tape rolls back', ''),
 ('H.08', "There's a line", 'the camera travels back from the door along the line; marks 1–4 glow as it passes, mark 5 lights on "fifth" under you; YOU\'RE FIFTH → plateLine', 'LINE', 'plateLine', ''),
 # ---------------------------------------------------------------- c02 · B1 · mark 1: the lab, Fermat
 ('1.01', 'At the very front stand', 'out of plateLine: push along the line to mark 1 at the threshold: the people who built it (kind lab), gold on their shoulders; THE LAB on the mark', 'LINE', 'the gap', ''),
 ('1.02', 'There, machines have written', 'the proof tape unrolls out of the gap across the threshold, every row ticks cyan; FERMAT\'S LAST THEOREM · COMPUTER-CHECKED', 'EXPL', 'the tape', ''),
 ('1.03', 'That work was expected', 'calendar sheets: a tall stack YEARS (EXPECTED) shrinks to eleven sheets (11 DAYS), then to one and a half (30 HOURS); 11 DAYS → 30 HOURS big; source F.SOURCES.fermat (47 LEMMAS)', 'EXPL', 'the tape on a table', '★'),
 ('1.04', 'The lab is Anthropic', 'the tape lies open on a table in front of the door; a checker ticks it row by row (cyan); PROOF PUBLIC · REVIEWED BY KEVIN BUZZARD; THE NUMBERS ARE ITS OWN', 'MIX', 'you reach', ''),
 ('1.05', 'And the machine that wrote it', 'you step toward the tape; the leaf closes the gap a little (the light narrows); "AN INTERNAL RESEARCH MODEL"', 'MIX', 'a second door', ''),
 # ---------------------------------------------------------------- c03 · B1 · OpenAI, A1, the inspector
 ('1.06', 'A second lab', 'truck right along the wall: a second door; in front a core ASTRA on a counter WITH A PRICE TAG (public, paid); behind its gap a bigger shadow', 'MIX', 'the shadow', ''),
 ('1.07', 'slot:A1', 'QUOTE CARD A1 (no footage): the words light evenly over the slot · SAM ALTMAN · CEO, OPENAI · ON STAGE · DREAMFORCE · SEP 15, 2026', 'CARD', 'the card folds to a clipboard', ''),
 ('1.08', 'So ask what an inspector', 'you with the clipboard in front of the second door: WHO CHECKED IT? → SOME MATHEMATICIANS, IN PART (a half tick); MODEL STILL UNRELEASED · OPENAI, OCT 6, 2026', 'EXPL', 'two price tags', ''),
 ('1.09', 'And both labs are worth more', 'price tags on both doors rise as the light in the gaps grows; two calendar sheets NOV 9 → NOV 10 (30-hour run → share pitch)', 'EXPL', 'the clipboard', ''),
 # ---------------------------------------------------------------- c04 · B1 · two things hold up (no card since vo-v4), announced
 ('1.10', 'Still, two things', 'two ticks on the clipboard: REAL MATHEMATICS · ONE HELD BACK', 'EXPL', 'the card builds', ''),
 ('1.11', 'Its finance chief said so', 'the tick ONE HELD BACK gets its source line: OPENAI CFO SARAH FRIAR · CNBC, NOV 6, 2026 (vo-v4: no quote card, no quote)', 'EXPL', 'the doors', ''),
 ('1.12', 'So the best A.I. is not hidden', 'both doors lit and labelled like shop windows (name, date, numbers), a band of the lettering covered; ANNOUNCED. NOT AVAILABLE.', 'MIX', 'a shelf', ''),
 ('1.13', 'But a lab lives from selling', 'a shop shelf with one empty place, the sign BEST above it', 'EXPL', 'the empty place', ''),
 # ---------------------------------------------------------------- c05 · B1 · safety, Mythos, marks 2 and 3
 ('2.01', 'Ask either lab', 'both doors carry the same sign SAFETY; then back to the glowing code line of the hook; calendar sheet APR 7', 'MIX', 'the code line', ''),
 ('2.02', 'It let a stranger crash', 'a dark plain of small screens (no globe): one light point connects from far away, one screen goes dark; source OPENBSD · ANTHROPIC, APR 7, 2026', 'EXPL', 'the door', ''),
 ('2.03', 'The A.I. that found it', 'MYTHOS rises over the door (door sign); a desk with a list in front of it, names are ticked; "WE DO NOT PLAN TO MAKE … GENERALLY AVAILABLE" · APR 7, 2026', 'MIX', 'the list', ''),
 ('2.04', 'Second in line', 'mark 2 lights: the government group (badges); a document with a seal band: UP TO 30 DAYS BEFORE RELEASE · VOLUNTARY · EO 14409', 'EXPL', 'mark 3', ''),
 ('2.05', 'Third come the giants', 'mark 3: four tall silhouettes of towers on the wall, one name each on the words (APPLE · GOOGLE · MICROSOFT · JPMORGAN CHASE); far back your coat; NOT YOU. NOT YET.', 'LINE', 'the door from the side', ''),
 # ---------------------------------------------------------------- c06 · B1 · not only safety, C1, the line from above
 ('2.06', 'But safety is not all', 'the door from the side; a price tag on the MYTHOS core behind the gap: 5× OPUS 4.6 (LAUNCH PRICE, APR 7, 2026)', 'MIX', 'the card', ''),
 ('2.07', 'slot:C1', 'QUOTE CARD C1: "…we get the next generation of models before anybody else." · SAM ALTMAN · CEO, OPENAI · INTERVIEW WITH MATTHEW BERMAN · OCT 21, 2026', 'CARD', 'two stacks', ''),
 ('2.08', 'A head start is worth money', 'two stacks behind the door (a glimpse from the gap): calendar sheets (the head start) and machine racks, part of them lit only inward', 'EXPL', 'pull up', ''),
 ('2.09', 'So a closed door buys a lab time', 'THE LINE FROM ABOVE (a top-down diagram: door, five marks, the tail); the camera moves to mark 4 → plateFour', 'EXPL', 'plateFour', ''),
 # ---------------------------------------------------------------- c07 · B2 · the defenders
 ('3.01', 'Fourth in line stand', 'out of plateFour: mark 4, the defenders with tool cases are let in through the side door (cream light); PROJECT GLASSWING', 'LINE', 'the code line', ''),
 ('3.02', 'The lab gives an example', 'one line of code; cyan test lights run over it again and again, a counter races to 5,000,000; then one gold beam stops exactly there', 'EXPL', 'the code wall', '★'),
 ('3.03', 'And that was one', 'the code wall pulls back: a dot field, over a hundred thousand points glow; 129,000+ VERIFIED · APRIL–JULY · ANTHROPIC\'S OWN COUNT', 'EXPL', 'a poster', ''),
 ('3.04', 'Critics called it marketing', 'a poster of the door next to your phone ("UPDATE READY · RESTART"); then slab bars: one bar over all others JULY · RECORD; source KREBS ON SECURITY, TECHCRUNCH · MICROSOFT CITES AI IN GENERAL', 'EXPL', 'the points', ''),
 ('3.05', 'Found is not yet fixed', 'the glowing points: some close (cyan), many wait; then the defenders a step ahead of everyone else in the line', 'EXPL', 'the whole line', ''),
 # ---------------------------------------------------------------- c08 · B2 · subscribe 1 · mark 5: you, Fable
 ('M.01', 'This channel exists', 'subscribe 1: the whole line in the gold light, from the front to your coat; a quiet subscribe hint, no QR', 'LINE', 'mark 5', ''),
 ('4.01', 'Fifth in line', 'mark 5; calendar sheet JUNE 9; the door opens a crack, light falls on your coat', 'MIX', 'a core flies to you', '★'),
 ('4.02', "It's called Fable", 'the core from behind the door is now in your phone (portal to the kitchen, the letter BANK beside it); a request tagged HACKING · BIOLOGY goes to older, matte cores', 'MIX', 'the window', ''),
 # ---------------------------------------------------------------- c09 · B2 · black hole, three subscriptions, the built-in limit
 ('4.03', "And by its maker's account", 'out of the kitchen window into the night sky: a half-written page dated 2003 in front of a dark lensing arc (never a full circle); its empty half fills; ANTHROPIC, NOV 9, 2026 · PREPRINTS, NOT PEER-REVIEWED · THE LAB\'S OWN ACCOUNT', 'EXPL', 'the table', ''),
 ('4.04', 'Three personal subscriptions', 'three phones on the kitchen table; a short proof tape with ticks grows out of them; 3 SUBSCRIPTIONS · 3 DAYS · ANTHROPIC, SEP 4, 2026', 'MIX', 'the core', ''),
 ('4.05', 'Yet one limit is built in', 'inside the core a small slider, set at the workshop; the same slider in the core behind the door and in the core in your hand; the quote (F.SOURCES.limit)', 'EXPL', 'pan behind you', ''),
 # ---------------------------------------------------------------- c10 · B2 · everyone behind you
 ('5.01', "But the line doesn't end", 'the camera pans behind your coat: the line goes on to the horizon (TAIL), some hooded', 'LINE', 'calendar sheets', ''),
 ('5.02', 'Within months of the Mythos', 'calendar sheets APR … AUG fall; far back a smaller door without a desk opens (a rival that came close in the lab\'s own hacking test), a download bar runs; price tag ABOUT $4,400; source CAISI, SEP 17 · ANTHROPIC, SEP 29, 2026', 'EXPL', 'the big door', ''),
 ('5.03', 'So a locked door never', 'the big door, a stack of calendar sheets in front of it: bought time (no clock)', 'MIX', 'the kitchen', ''),
 # ---------------------------------------------------------------- c11 · B2 · the tips, the parcel
 ('5.04', 'Switch on automatic', 'the kitchen table: phone, laptop, router; three switches AUTO-UPDATE flip on (cyan) on the words; RESTART', 'MIX', 'the old router', ''),
 ('5.05', 'And a device too old', 'a dusty old router; you pull the plug (whole figure, no hand close-up); REPLACE · OR OFFLINE', 'MIX', 'the window', ''),
 ('5.06', 'That part is in your hands', 'you at the table, the switches on; far away through the window, the door', 'SCENE', 'travel to the door', ''),
 ('6.01', 'The rest is decided', 'travel back to the door; through the gap a table where decisions are made', 'LINE', 'a parcel', ''),
 ('6.02', 'This fall, OpenAI planned', 'a parcel ASTRA 6.1 rolls up to the door and stops; stamp HELD BACK; source WSJ, VIA CNBC, SEP 28, 2026 · GPT-6.1 ASTRA → plateHeld', 'MIX', 'plateHeld', ''),
 # ---------------------------------------------------------------- c12 · B3 · the room, C4, who looks in
 ('6.03', 'That call was made inside', 'out of plateHeld: up the windowless wall; NOT EVERYTHING IS SHOWN (a covered band)', 'MIX', 'the card', ''),
 ('6.04', 'slot:C4', 'QUOTE CARD C4: "The most concerning threats posed by rogue AI agents precede their external release." · MARIUS HOBBHAHN · CEO, APOLLO RESEARCH · U.S. SENATE HEARING · SEP 30, 2026', 'CARD', 'the wall', ''),
 ('6.05', 'Before release means inside', 'the wall from outside, no window; WHO GETS TO LOOK IN?', 'MIX', 'the side door', ''),
 ('6.06', 'A few outsiders do', 'the side door: three testers with clipboards are let in, the doorkeeper wears the lab colour; source UK AISI, METR, FRONTIER DESIGN · ANTHROPIC, NOV 9, 2026; THE LAB DECIDES', 'LINE', 'the clipboard', ''),
 # ---------------------------------------------------------------- c13 · B3 · the inspector · the big answer begins
 ('6.07', 'So keep asking', 'you read an announcement with the clipboard; two boxes WHO CHECKED IT? · WHAT\'S NOT SHOWN?', 'EXPL', 'you at the wall', ''),
 ('6.08', 'So what is in that room', 'you stand at the outer wall; one breath of only the gold light in the gap', 'LINE', 'the tape', ''),
 ('7.01', 'One clue was in plain sight', 'the proof tape of mark 1 returns: 11 DAYS → 30 HOURS; the camera follows it not through the door but in front of it into a hall of a thousand seats, in each seat the same small core as in your phone; 1,000 COPIES · ONE RUN · STARTED WITH 47 LEMMAS FROM THE FIRST PROOF', 'EXPL', 'two cores', '★'),
 ('7.02', 'And the first machine', 'the core behind the door and a core from the shelf side by side, almost equally bright; "ROUGHLY COMPARABLE"; a few dozen seats, eleven sheets, then two sheets SEP 4 → NOV 9', 'EXPL', 'the whole line', ''),
 # ---------------------------------------------------------------- c14 · B3 · newer and bigger
 ('7.03', 'So if the machines are already', 'the whole line in one wide; the hook question returns: HOW MUCH STRONGER?', 'MIX', 'doors behind doors', ''),
 ('7.04', 'The first is newer', 'behind the door more doors in a row, each a calendar sheet further; the last one vanishes in the dark; 1 · NEWER', 'EXPL', 'a stadium', ''),
 ('7.05', 'The second is bigger', 'a stadium outline with about ten thousand matte dots, stamp "OPENAI SAYS" · NOT CONFIRMED; then your phone: one light point, and the hall with a thousand identical points; 2 · BIGGER · SAME MACHINE × 1,000', 'EXPL', 'PERMISSION', ''),
 # ---------------------------------------------------------------- c15 · B3 · permission and power
 ('7.06', 'So between you and the best', 'the door (PERMISSION) and behind it the glow of the hall (POWER)', 'MIX', 'the calendar', ''),
 ('7.07', 'And both are moving', 'calendar APR → JUNE, the door opens; a price tag shrinks to a third; source ANTHROPIC, APR 7 / NOV 9, 2026', 'EXPL', 'the gap', ''),
 ('7.08', 'So what a lab shows off', 'you look through the gap like into a shop window; below, calendar sheets: A FEW MONTHS · ESTIMATE (3 TO 6)', 'MIX', 'the kitchen', ''),
 # ---------------------------------------------------------------- c16 · B3 · the end
 ('8.01', 'One evening, a few months', 'the kitchen again, a different season in the window; in the phone the core that was behind the door; far back the door, new light in the gap', 'SCENE', 'out to the line', ''),
 ('8.02', 'The best A.I. in the world is never', 'door, line, coat as in frame 0, but you stand one place further forward; the core sentence as text', 'LINE', 'the line moves up', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2: the final picture keeps running, the line moves up slowly; quiet subscribe hint, no QR', 'LINE', 'the walk', ''),
 ('A.02', 'END', 'the quiet walk without voice (music carries)', 'LINE', 'END_CAM', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: S.END_CAM, the door, the line, the gold light keep moving; free: S.END_TILES (two tiles over the wall, subscribe below the door); no text, no QR', 'LINE', '—', ''),
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
    t = at(s[1], prev - .01); times.append(t); prev = t
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
L.append('# Film 55 · "The Best AI Is Locked Away" · shot list (binding)\n')
L.append(f'Generated by `tools/shots55.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'Wording follows the final vo-v4 and ROOT faktencheck.md (must-changes 1–11 are in the strings below and in `F.SOURCES` / `F.QUOTES`).\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · CARD 1 · MIX .5 · LINE .3 · SCENE 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. The whole film is ONE world (THE LINE): the kitchen, the room and every glimpse open as portals out of a thing (the phone screen, the door gap, the window) and close back into it — continuous, not W.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. At most two things move at once (the camera counts).\n')
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
L.append('\n## 4 · Seams between the groups (lib/f55_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append('| Lead → B1 | At the very front stand | plateLine (LINE_CAM: the whole line from a raised camera behind you, you bottom left on mark 5, the door top right; all five marks lit; you look up .85) | H.08 travels onto it (built) | 1.01 pushes along the line to mark 1 |')
L.append('| B1 → B2 | Fourth in line stand | plateFour (FOUR_CAM: mark 4 close, the defenders\' group looking up .35, mark 4 lit, the others .3; side door right) | 2.09 settles from the top-down diagram onto it | 3.01 the side door opens (cream) |')
L.append('| B2 → B3 | That call was made inside | plateHeld (HELD_CAM: the door close, the parcel ASTRA 6.1 · HELD BACK at its foot) | 6.02 the parcel stops, stamp lands, settle | 6.03 tilt up the windowless wall |')
L.append('\nBoth sides draw the plate (S.plateLine / S.plateFour / S.plateHeld) for ±0.5 s with the same creep (3 %/s push, 24 px/s truck), no drift. Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Shortened to ≤ 6 words per explainer. **vo-v3.txt, faktenzettel.md and faktencheck.md override every number here.** Company figures say so on screen (OWN COUNT, THE LAB\'S OWN ACCOUNT, OPENAI SAYS).')
L.append("- Hook: THE BEST AI / IS LOCKED · 27 YEARS · HOW MUCH / STRONGER? · NOT SUMS. · PROOFS. · YOU'RE FIFTH · source `F.SOURCES.flaw27`")
L.append("- Marks: 1 THE LAB · 2 GOVERNMENT · 3 BIG COMPANIES · 4 DEFENDERS · 5 YOU (painted on the floor; `S.LINE.marks`)")
L.append("- 1: FERMAT'S LAST THEOREM · COMPUTER-CHECKED · YEARS (EXPECTED) · 11 DAYS → 30 HOURS · PROOF PUBLIC · REVIEWED BY KEVIN BUZZARD · \"AN INTERNAL RESEARCH MODEL\" · ASTRA (+ price tag) · WHO CHECKED IT? · SOME, IN PART · MODEL STILL UNRELEASED · NOV 9 → NOV 10 · REAL MATHEMATICS · ONE HELD BACK · ANNOUNCED. NOT AVAILABLE. · BEST")
L.append("- 2: SAFETY · APR 7 · MYTHOS · \"WE DO NOT PLAN TO MAKE … GENERALLY AVAILABLE\" · UP TO 30 DAYS BEFORE RELEASE · VOLUNTARY · EO 14409 · APPLE · GOOGLE · MICROSOFT · JPMORGAN CHASE · NOT YOU. NOT YET. · 5× OPUS 4.6 (LAUNCH PRICE, APR 7, 2026)")
L.append("- 3: PROJECT GLASSWING · 5,000,000 · 129,000+ VERIFIED · APRIL–JULY · ANTHROPIC'S OWN COUNT · UPDATE READY · RESTART · JULY · RECORD")
L.append("- 4: JUNE 9 · HACKING · BIOLOGY · 2003 · PREPRINTS, NOT PEER-REVIEWED · 3 SUBSCRIPTIONS · 3 DAYS · the limit quote")
L.append("- 5: APR … AUG · ABOUT $4,400 · AUTO-UPDATE · RESTART · REPLACE · OR OFFLINE · ASTRA 6.1 · HELD BACK")
L.append("- 6: WHO GETS TO LOOK IN? · THE LAB DECIDES · WHO CHECKED IT? · WHAT'S NOT SHOWN?")
L.append("- 7: 11 DAYS → 30 HOURS · 1,000 COPIES · ONE RUN · STARTED WITH 47 LEMMAS FROM THE FIRST PROOF · \"ROUGHLY COMPARABLE\" · SEP 4 → NOV 9 · HOW MUCH STRONGER? · 1 · NEWER · 2 · BIGGER · OPENAI SAYS · NOT CONFIRMED · SAME MACHINE × 1,000 · PERMISSION · POWER · APR → JUNE · ⅓ · A FEW MONTHS · ESTIMATE (3 TO 6)")
L.append("- 8: THE BEST AI IS NEVER THE ONE IN YOUR POCKET. · IT'S THE ONE YOU'LL HAVE NEXT.")
L.append('- Quote cards (`F.QUOTES`, `F.quoteCard`): A1, C1, C4 (clip slots: the clip audio plays, the card lights evenly). R1 (Friar) is OUT since vo-v4: only the source line `F.SOURCES.friar`. No photo, no footage, no likeness, never "ORIGINAL FOOTAGE".')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
