#!/usr/bin/env python3
"""Film 59 · "You Can Now Buy a Piece of AI" (AI GOES PUBLIC) · the binding shot list -> docs/shots.md (times from the current timing:
$TIMING, <ROOT>audio/timing.json (the real VO, 16.11.), else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md.
   python3 tools/shots59.py
Every shot: id (station.n; H = hook, 1…11 = the stations, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the
film after the previous shot's anchor; 'slot:C1' = a clip / card slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram: cards, the vote bar, the seats, lists, the document's pages, gold numbers, the board big) ·
  MIX .5 (a city/room scene with a diagram on it: a label, a tag, a pinned card) · CITY .3 (the city under the crystal itself, an anchor) ·
  SCENE 0 (the room, you, people) · CLIP 0 (original footage).
Flags: W = a hard world change (budget ≤ 1 per minute) · ★ = the one wow moment of the chunk · B = the countdown board changes."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F59ROOT', '/mnt/project-files/scenario/film-ai-goes-public/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'CITY': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'This week'), ('c02', 'B1', 'The seller is Anthropic'), ('c03', 'B1', 'So before the opening bell'),
          ('c04', 'B1', 'With most companies'), ('c05', 'B1', 'Why build a company'),
          ('c06', 'B2', 'Many doubt it'), ('c07', 'B2', 'But the company has an answer'), ('c08', 'B2', 'If the mission is unproven'),
          ('c09', 'B3', 'Reports say there are'), ('c10', 'B3', "And one thing doesn't depend"), ('c11', 'B3', 'But look at who else'), ('c12', 'B3', 'Now recall the warning')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'This week', 'THUMBNAIL A: the gold crystal over the night, the facet falls into your raised hand on "goes public"; AI GOES / PUBLIC + EXPECTED FIRST TRADE: THU, NOV 19, 2026 · NASDAQ: ANT', 'CITY', 'the shard in your hand', '★'),
 ('H.02', 'Picture this coming Thursday', 'push to your hand; the shard\'s face lights and grows into the phone screen (MY STOCKS, rows of known names)', 'MIX', 'the screen', ''),
 ('H.03', 'a new name appears', 'a gold row slides in at the top: ANT; A · N · T light on the letters', 'EXPL', 'the ANT row', ''),
 ('H.04', 'You could already buy chip makers', 'the known rows get cool labels: CHIP MAKER · TECH GIANT (you could already buy them); "This is different": they dim, the ANT row gets its gold edge; its one tag AN AI LAB (gold on "nothing else")', 'EXPL', 'tap', ''),
 ('H.05', 'You tap it', 'the ANT page: the price rolls and never settles (NOT YET SET); the BUY button; a ? over it on "what exactly"', 'EXPL', 'the phone sinks into the shard', ''),
 ('H.06', 'It comes with a warning', 'pull back: you hold the shard; a paper tag WARNING drops from the crystal\'s gap on a gold thread; THE SELLER stamps it', 'MIX', 'the tag', ''),
 ('H.07', 'Advanced A.I.', 'the tag unfolds into the quote card RISK FACTORS: "Concerns have been raised … catastrophic or existential risks to humanity …" (catastrophic … humanity light as spoken) · ANTHROPIC, IPO PROSPECTUS (FORM S-1/A, NOV 10, 2026), RISK FACTORS', 'EXPL', 'the card', ''),
 ('H.08', 'That is printed', 'the card becomes the top page of the thick PROSPECTUS · FORM S-1; it opens: A PIECE (the shard) ✓ | A SAY (the wheel of light; a glass pane slides in front on "where it goes")', 'EXPL', 'the wheel', ''),
 ('H.09', 'That stays with a group', 'the wheel flies out of the page into the tower window; the veil lifts: THE ROOM, the long table, 7 + 4 busts under the wheel behind glass → plateWindow', 'SCENE', 'plateWindow', ''),
 # ---------------------------------------------------------------- c02 · B1 · the seller, the sale
 ('1.01', 'The seller is Anthropic', 'out of plateWindow: pull back out of the window, the tower, the city, the crystal above; a gold label on the crystal: ANTHROPIC / THE LAB BEHIND CLAUDE', 'MIX', 'the crystal', ''),
 ('1.02', 'Its shares are expected', 'a night data card grows from a facet: NASDAQ: ANT · FIRST TRADE EXPECTED NOV 19 (COMPANY TIMETABLE, SUBJECT TO REGULATORY CLEARANCE); bracket NOT INVESTMENT ADVICE · AS OF NOV 17, 2026 · FINAL PRICE NOT YET SET', 'EXPL', 'the card', ''),
 ('1.03', 'Expected price', 'the card turns: EXPECTED RANGE $70–78 · 825 MILLION SHARES · source ANTHROPIC, NOV 10, 2026', 'EXPL', 'the number', ''),
 ('1.04', 'That would make it the second', 'two bars of gold light: SPACEX (JUNE 2026) and ANT, 2ND-LARGEST IPO EVER, BY MONEY RAISED · AFTER SPACEX (JUNE 2026) · RENAISSANCE CAPITAL (F.SOURCES.ipoRank / s1a); optional small line UP TO 20 % FOR RETAIL (S-1/A)', 'EXPL', 'the BUY button', ''),
 ('1.05', 'Whether to buy is not', 'the BUY button from the hook, small, in front of the crystal; the camera looks past it at the crystal ("what sits behind the button")', 'MIX', 'the jar', ''),
 ('1.06', 'And that matters even if', 'you on the rooftop; the jar (your savings) beside you; a tiny gold slice drifts down from the crystal toward it (it does not land yet)', 'SCENE', 'the bell glints', ''),
 # ---------------------------------------------------------------- c03 · B1 · step 1: the pitch
 ('2.01', 'So before the opening bell', 'the camera turns right along the parapet: far away THE BELL over the exchange glints; the COUNTDOWN board grows from that glint into the top-left corner: STEP 1 · THE PITCH', 'MIX', 'the board', 'B'),
 ('2.02', 'The sales document', 'the PROSPECTUS returns big; its thickness grows on "thick"', 'MIX', 'the edge', ''),
 ('2.03', 'More than ninety', 'gold warning tabs slide out of its edge one after another: 90+ PAGES OF RISK FACTORS', 'EXPL', 'two pages lift', ''),
 ('2.04', 'The company writes that its', 'two pages lift out as paper warning cards: "…behaving differently when they detect or infer that they are being evaluated" · "…attempts to resist shutdown" · ANTHROPIC PROSPECTUS, RISK FACTORS', 'EXPL', 'a gold page', ''),
 ('2.05', 'The promise is in there too', 'a gold-edged page: EXTRAORDINARY POTENTIAL / IF THE RISKS ARE MANAGED; on "Managed by whom?" a gold ? rises', 'EXPL', 'the ?', ''),
 # ---------------------------------------------------------------- c04 · B1 · who steers
 ('3.01', 'With most companies', 'a simple flow: a share (shard) → a vote (a tick) → the wheel: BUY A SHARE, GET A VOTE', 'EXPL', 'the shards pile', ''),
 ('3.02', 'Buy enough', 'shards pile up on the left; the wheel turns toward them (STEER)', 'MIX', 'the wheel', ''),
 ('3.03', 'Not here', 'a glass pane slides in front of the wheel; the pile stops', 'MIX', 'the pane', ''),
 ('3.04', 'The shares on sale do carry', 'THE VOTE BAR: PUBLIC SHARES (CLASS A) fill cool up to the dashed cap: MAX 49.9 %', 'EXPL', 'the right half', ''),
 ('3.05', 'Just over half stays', 'FOUNDERS (CLASS F) FIXED 50.1 % (gold); seven seats light one by one under it; "…decide shareholder votes for the foreseeable future" · source', 'EXPL', 'the seats', ''),
 ('3.055', 'Founders keeping control', 'a plain text card on the vote bar (no logos, no faces): FOUNDER CONTROL IS COMMON · META: ZUCKERBERG ≈ 61 % OF VOTES (APRIL 2026) · then a gold line NEW AT ANTHROPIC: A TRUST WITH NO SHARES on "who else gets a seat" · FORTUNE, OCT 26, 2026 (F.SOURCES.metaCard / meta)', 'EXPL', 'the empty seat', ''),
 ('3.06', 'And the board', 'the board of directors as a row of chairs; the TRUST (4 seats, NO SHARES) appoints most of them: LONG-TERM BENEFIT TRUST · 4 TRUSTEES (1 SEAT OPEN) · CAN "ELECT AND REMOVE A MAJORITY" OF THE BOARD · S-1/A, NOV 10, 2026 (F.SOURCES.ltbtCard); a name tag BEN BERNANKE · FORMER FED CHAIR (no likeness)', 'EXPL', 'the 11 seats', ''),
 ('3.07', 'Seven founders', 'push back into THE ROOM through the tower window: 7 founders light gold, 4 trustees cream, as counted; the dinner table', 'SCENE', 'out of the window', '★'),
 ('3.08', 'So your share would be a claim', 'THUMBNAIL C (thumbnails/film-59/f59-c-steer, YOU CAN\'T STEER AI): you on the rooftop at the left holding the shard up; the wheel of light BIG in the sky over the city at the right, turning slowly, light rays down, out of reach (match the thumbnail: no glass in this shot). A CLAIM ON THE MONEY (at the shard) · NOT A HAND ON THE WHEEL', 'MIX', 'a facet', ''),
 # ---------------------------------------------------------------- c05 · B1 · the reason, the promise
 ('4.01', 'Why build a company', 'the crystal; one facet turns flat and becomes a screen', 'CITY', 'the facet', ''),
 ('4.02', 'slot:C1', 'C1 (ORIGINAL FOOTAGE): the plate grows from the facet and shrinks back · DARIO AMODEI · CEO, ANTHROPIC · UN SECURITY COUNCIL, SEP 23, 2026 · ORIGINAL FOOTAGE (UN WEB TV)', 'CLIP', 'the facet', ''),
 ('4.03', 'Remember who is speaking', 'a tag on the facet: THE SELLER; then the quote card "…distinctly equipped to be stewards of our mission" · ANTHROPIC PROSPECTUS, ON ITS FOUNDERS', 'EXPL', 'the vote bar', ''),
 ('4.04', 'If a safety decision costs money', 'the vote bar returns: a SAFETY DECISION card sits on the gold half; the cool half pushes and cannot move it; then the reverse ("either")', 'EXPL', 'the document', ''),
 ('4.05', 'The document warns its own', 'three paper cards from the prospectus: SLOWING DOWN · HOLDING A SYSTEM BACK · TURNING BUSINESS AWAY', 'EXPL', 'the cards stack', ''),
 ('4.06', 'slot:Z1', 'QUOTE CARD Z1 (read by the narrator): "…may not maximize stockholder value." · ANTHROPIC PROSPECTUS', 'EXPL', 'the card', ''),
 ('4.07', 'In plain words', 'two lines on a card, in order: SAFETY (gold) above YOUR RETURN (cool)', 'EXPL', 'the crystal', ''),
 ('4.08', 'That is the promise', 'the crystal; on "share price" a paper price tag "$ ?" drops from its lowest point on a gold thread; it swings on "Can it hold?" → plateCrystal', 'MIX', 'plateCrystal', ''),
 # ---------------------------------------------------------------- c06 · B2 · step 2: the doubts
 ('5.01', 'Many doubt it', 'out of plateCrystal: the board lights STEP 2 · THE ORDERS ARE COUNTED (by itself); small letters of light rise from the city toward the crystal', 'MIX', 'one letter', 'B'),
 ('5.02', 'The official who watches', 'one letter opens as a paper card: PAUSE THE SALE · NYC COMPTROLLER MARK LEVINE, LETTER OF OCT 14, 2026', 'EXPL', 'the price tag', ''),
 ('5.03', 'The worry', 'the price tag becomes a strip of daily grades (cool ticks, one per day); three small cards: SLOW · EXPENSIVE · SOMETIMES "NO"', 'EXPL', 'the room', ''),
 ('5.04', 'And the four trustees', 'the room: the four trustees light cream: CHOOSE DIRECTORS ✓ · DAILY DECISIONS ✗ · source AP, NOV 13, 2026', 'MIX', 'a facet', ''),
 ('5.05', 'The sharpest doubt', 'name card YOSHUA BENGIO · CO-CHAIR, UN SCIENTIFIC PANEL ON AI; "locked in a race": lanes of small lights racing (cool)', 'EXPL', 'the facet screen', ''),
 ('5.06', 'slot:C2', 'C2 (ORIGINAL FOOTAGE) from a crystal facet · YOSHUA BENGIO · TURING AWARD LAUREATE · CO-CHAIR, UN SCIENTIFIC PANEL ON AI · UN SECURITY COUNCIL, SEP 23, 2026 · ORIGINAL FOOTAGE (UN WEB TV)', 'CLIP', 'the lanes', ''),
 ('5.07', 'A race by choice', 'the lanes again: a label A CHOICE; a share price ticker pushes the lights faster', 'MIX', 'the essay', ''),
 # ---------------------------------------------------------------- c07 · B2 · the answer, subscribe 1
 ('6.01', 'But the company has an answer', 'a booklet card: WE MUST PACE THE FRONTIER · DARIO AMODEI, SEP 12, 2026; a small line HELD BACK FOR MONTHS', 'EXPL', 'the bracket', ''),
 ('6.02', "That is his word", 'bracket HIS WORD, NOT PROOF; the prospectus returns: IN WRITING · THE RISKS · THE LOSSES · WHO HOLDS THE VOTES · ANYONE CAN READ IT (lines light on their words)', 'EXPL', 'the stamp', ''),
 ('6.03', 'So can a safety mission', 'stamp UNPROVEN on the cover; then ON THE RECORD; the document settles', 'MIX', 'the city', ''),
 ('M.01', 'This channel exists', 'subscribe 1: wide: you on the rooftop, the crystal, every window of the city lights warm on "everybody" (no text, no buttons)', 'CITY', 'the crystal', ''),
 # ---------------------------------------------------------------- c08 · B2 · step 3: pricing night, known vs forecast
 ('7.01', 'If the mission is unproven', 'the board: STEP 3 · PRICING NIGHT · EXPECTED WED, NOV 18 (by itself); bracket NOT INVESTMENT ADVICE', 'MIX', 'the price tag', 'B'),
 ('7.02', 'At the top of the range', 'the price tag on the crystal: UP TO ≈ $1.4 TRILLION · AT THE TOP OF THE EXPECTED RANGE, FULLY DILUTED · FORTUNE, CNN, CNBC, NOV 10, 2026', 'EXPL', 'the trays', ''),
 ('7.03', 'A number like that', 'two trays over the veiled city: KNOWN (gold edge) | FORECAST (cool edge)', 'MIX', 'the first card', ''),
 ('7.04', 'Known: three years ago', 'KNOWN card REVENUE: $41M (2023, a year) → $17.0B (Q3 2026, a quarter): a thin bar grows into a huge one ★', 'EXPL', 'the second card', '★'),
 ('7.05', 'Also known', 'KNOWN card NET LOSS, JAN–SEP 2026 ≈ $104B · $94.3B NON-CASH · OPERATING LOSS $1.3B', 'EXPL', 'the FORECAST tray', ''),
 ('7.06', 'Everything beyond that', 'the FORECAST tray lights; the crystal facet turns into a screen', 'MIX', 'the facet', ''),
 ('7.07', 'slot:C3', 'C3 (ORIGINAL FOOTAGE), label FORECAST · DARIO AMODEI · CEO, ANTHROPIC · UN SECURITY COUNCIL, SEP 23, 2026', 'CLIP', 'the card', ''),
 ('7.08', 'A country of geniuses', 'FORECAST cards: 1–2 YEARS (THE SELLER, ON STAGE) above WITHIN A FEW YEARS (THE DOCUMENT) → plateSort', 'EXPL', 'plateSort', ''),
 # ---------------------------------------------------------------- c09 · B3 · appetite, not worth
 ('8.01', 'Reports say there are', 'out of plateSort: six stacks of order slips beside one stack of shares: ORDERS ≈ 6× · APPETITE, NOT WORTH · BLOOMBERG, NOV 12, 2026 (UNNAMED SOURCES)', 'EXPL', 'a cool line', ''),
 ('8.02', 'And early this month', 'a cool line of AI stocks dips; paper quote "the most ridiculous IPO of 2026" · NEW CONSTRUCTS, QUOTED BY INC.', 'EXPL', 'the price tag', ''),
 ('8.03', 'Who is right', 'the crystal and its price tag: the tag swings up (soars), down (sinks); A PRICE IS A FORECAST, NOT A VERDICT', 'MIX', 'you', ''),
 # ---------------------------------------------------------------- c10 · B3 · step 4: the bell, the index, the jar
 ('9.01', "And one thing doesn't depend", 'you on the rooftop, the jar beside you', 'SCENE', 'the list', ''),
 ('9.02', 'Many funds don', 'an index is a list: a column of name bars; a fund copies it line by line (a second column draws itself)', 'EXPL', 'the bell', ''),
 ('9.03', 'When the bell rings', 'THE BELL over the exchange: the crystal clapper strikes, gold rings widen over the city; the board: STEP 4 · FIRST TRADE, then +15 TRADING DAYS (15 marks fill) · NASDAQ-100 FAST ENTRY RULE, SINCE MAY 1, 2026', 'MIX', 'the rings', '★ B'),
 ('9.04', 'Other big lists', 'three lists as rails: NASDAQ-100 · 15 TRADING DAYS · other fast lists · S&P 500 · 1 YEAR', 'EXPL', 'the fast rail', ''),
 ('9.05', 'Say your pension', 'the fast list copies itself into the jar: a small gold slice lands inside: WITHIN WEEKS', 'MIX', 'the jar', ''),
 ('9.06', 'A United States senator', 'a letter card: "retirement money that may have to buy, whatever the price" · SEN. ELIZABETH WARREN, LETTER OF OCT 27, 2026', 'EXPL', 'you', ''),
 ('9.07', "So buy, or don't", 'you with the shard, the jar with its slice: both glow; the wheel far away behind glass', 'MIX', 'the vote bar', ''),
 # ---------------------------------------------------------------- c11 · B3 · nobody buys the wheel
 ('10.01', 'But look at who else', 'the vote bar returns with a third row: AMAZON · GOOGLE: MORE THAN 5 % EACH · NON-VOTING (CLASS N): two big slices with no tick', 'EXPL', 'the wheel', ''),
 ('10.02', 'As this company is built today', 'the wheel of light behind its glass; a price tag tied to it reads NOT FOR SALE and stays shut "at any price"; the hopeful part: warm', 'MIX', 'the window', ''),
 ('10.03', 'The hard part', 'ELEVEN PEOPLE: the room seen through its window', 'SCENE', 'the table', ''),
 ('10.04', 'Seven founders', 'THE SAME DINNER TABLE: 7 + 4 light as counted (the anchor returns) ★', 'SCENE', 'the three weights', '★'),
 ('10.05', 'But the board they choose', 'PUBLIC BENEFIT CORPORATION: one beam, three weights that light on their words: STOCKHOLDERS · THE STATED PURPOSE ("…for the long-term benefit of humanity") · "THOSE MATERIALLY AFFECTED BY OUR CONDUCT" · ANTHROPIC PROSPECTUS', 'EXPL', 'the warning tag', ''),
 # ---------------------------------------------------------------- c12 · B3 · the stake, subscribe 2, end screen
 ('11.01', 'Now recall the warning', 'the WARNING tag from the hook swings down again from the crystal: RISKS TO HUMANITY; "Who is materially affected?" the camera pulls back over the city', 'MIX', 'you', ''),
 ('11.02', 'You are', 'you on the rooftop, small, in the crystal\'s light; with a share (the shard) or without', 'SCENE', 'the shard', ''),
 ('11.03', 'You can buy a piece of A.I.#1', 'the shard (A PIECE) · the wheel behind glass (A SAY) · then threads of gold light run from the crystal to every window of the city: A STAKE', 'MIX', 'the threads', ''),
 ('11.04', 'And a stake has a voice', 'two of the threads carry small letters back up: the senator\'s, the watchdog\'s; the prospectus as A PUBLIC RECORD', 'MIX', 'the price tag', ''),
 ('11.05', 'A share has a price', 'the price tag "$" on the shard; the threads to every window have no tag ★', 'MIX', 'the city', '★'),
 ('A.01', 'This channel exists#1', 'subscribe 2: the crystal shines over the whole city, you with the shard; the billions of windows warm', 'CITY', 'the pull back', ''),
 ('A.02', 'END', 'quiet: the camera settles into END_CAM (music carries)', 'CITY', 'end screen', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: S.END_CAM: the crystal big and calm at the top centre, you small on the ledge at the left holding the shard, the dark rooftop below carries the two tiles + subscribe circle (S.END_TILES, lower half); no text', 'CITY', '—', ''),
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
L.append('# Film 59 · "You Can Now Buy a Piece of AI" (AI GOES PUBLIC) · shot list (binding)\n')
L.append(f'Generated by `tools/shots59.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO, 16.11."}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact check may still change a few spoken lines: anchors are phrases, so the code does not care; if a phrase goes missing, `T.G` says which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · CITY .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. One world (the city under the crystal): the room is entered through its window, explainers float over a night veil while the camera keeps gliding behind it, clips grow out of a crystal facet and go back into it.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. B = the countdown board changes (`F.board` does it from `F.BOARD` phrases; never by hand).\n')
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
L.append('\n## 4 · Seams between the groups (lib/f59_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | The seller is Anthropic | plateWindow (WIN_CAM: the tower window fills the middle; THE ROOM inside: the table, 7 + 4 busts, the wheel of light behind glass) | H.09 pushes in onto it | 1.01 pulls back out of the window to the city and the crystal |")
L.append("| B1 → B2 | Many doubt it | plateCrystal (CRY_CAM: the crystal big, right of centre, a paper tag \"$ ?\" on a gold thread under it; the city low; the board top left, STEP 1) | 4.08 drops the tag and settles | 5.01: the board lights STEP 2 by itself; letters of light rise |")
L.append("| B2 → B3 | Reports say there are | plateSort (SORT_CAM: the veiled city, the crystal high; trays KNOWN | FORECAST with their four cards; the board, STEP 3) | 7.08 places the FORECAST cards | 8.01: the trays slide aside, the order stacks rise |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: vo-v3.txt EINBLENDUNG (fact-checked; faktencheck.md MB1–MB5 are in F.SOURCES) lines, shortened to ≤ 6 words per statement where possible; numbers exactly as there. Sources live in `F.SOURCES` (lib/f59_kit.mjs). If the fact check changes a number, change it in `F.SOURCES` / your card, and say so in your report.')
L.append('- **Prospectus sentence (hook, H.07):** the full verified sentence with attribution and condition (S-1/A No. 2, Nov 10, 2026; vo-v3 line 15): "Concerns have been raised both within our organization and by other researchers … pose catastrophic or existential risks to humanity …" = `F.SOURCES.s1riskText`; "catastrophic" … "humanity" light as spoken.')
L.append('- **Optional (Jakob decides; default OFF):** 1.04 UP TO 20 % OF THE SHARES FOR RETAIL INVESTORS · the disclosure line "This film was made with the help of Claude, an A.I. model made by Anthropic, the company this film is about. Anthropic had no editorial input." (default: description only).')
L.append('- **No QR anywhere.** No support / donation overlay. No "corrections get pinned" line (the description says: spotted an error? mention it in the comments).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
