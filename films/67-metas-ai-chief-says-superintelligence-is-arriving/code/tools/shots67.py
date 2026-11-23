#!/usr/bin/env python3
"""Film 66 · "Sam Altman Says Everything Will Get Cheap" (AI MAKES EVERYTHING CHEAP) · the binding shot list -> docs/shots.md (times from the
current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json).
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots66.py
Every shot: id (station.n; H = hook, 1…10 = the sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the
film after the previous shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'END' = VO end + .6;
'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram: cards over the veil, the dollar bar, gold numbers, the clock big) · MIX .5 (the land with a diagram on it: a tag with
  words, a verdict, a pinned number) · LAND .3 (the long land itself, the tags hanging, an anchor) · SCENE 0 (you, rooms, people) · CLIP 0.
Flags: W = a hard world change (budget ≤ 1 per minute) · ★ = the one wow moment of the chunk · B = the clock (seven tags) changes."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F66ROOT', '/mnt/project-files/scenario/film-geld-nach-si/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'LAND': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Sam Altman says'), ('c02', 'B1', 'This January'), ('c03', 'B1', 'Start where a price'), ('c04', 'B1', "Education. It's on his list"),
          ('c05', 'B2', 'So far, every price'), ('c06', 'B2', 'Energy'), ('c07', 'B2', 'One tag needs energy'), ('c08', 'B2', 'Housing. The first word'),
          ('c09', 'B3', 'So what does that do'), ('c10', 'B3', 'This summer, American businesses'), ('c11', 'B3', 'So how does everyone'), ('c12', 'B3', "So that's the order")]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'Sam Altman says', 'THUMBNAIL A: you on the rooftop (left), THE PROMISE (the big gold tag, top right) crumbling to gold dust from its lower-left edge; title AI MAKES / EVERYTHING CHEAP sinks out', 'SCENE', 'the promise', '★'),
 ('H.02', 'Housing', 'his list: four tags split off the promise\'s face, one per word, and hang in the sky top left: HOUSING · EDUCATION · FOOD · CLOTHING', 'MIX', 'the promise\'s face', ''),
 ('H.03', 'Everything necessary', 'the quote writes on the promise\'s face: “Everything necessary will be cheap …” · credit SAM ALTMAN, “MOORE’S LAW FOR EVERYTHING” (no year here)', 'MIX', 'the city below', ''),
 ('H.04', 'His reason', 'the city\'s windows turn cool from left to right (AI and robots do the work)', 'LAND', 'the promise', ''),
 ('H.05', 'Your receipts', 'THUMBNAIL C: the promise prints a glowing receipt that unrolls into your hand; RENT ↑ · GROCERIES ↑ · THE POWER BILL ↑ light on the words', 'MIX', 'the receipt', ''),
 ('H.06', 'And your paycheck has', 'a small pay slip in your other hand (the long receipt against the small slip)', 'SCENE', 'the slip', ''),
 ('H.07', 'Yet he could', 'the receipt rolls back into the promise; you pass the slip to your right hand; the four list tags dip one after another', 'MIX', 'the dust stream', ''),
 ('H.08', 'So what gets cheap first', 'the camera follows the dust down to the office window (the programmer at his desk); his list lifts out of the sky; the station-1 tag A TOP / PROGRAMMER’S WEEK comes down on its thread', 'SCENE', 'the tag', ''),
 ('H.09', 'The first price has already', 'the tag drops, then crumbles to dust on "Almost to nothing"; < $1 glows where it hung (no source line in 0:30–0:50: the Fed quote comes in 2.03)', 'MIX', 'the dust', '★'),
 ('H.10', 'But one thing on his list', 'pull back: his list comes down again; HOUSING turns its back and rises out of the sky ("It may even rise")', 'MIX', 'the turned tag', ''),
 ('H.11', 'So he may be half right', 'the list folds back into the promise, which crumbles to half; your pay slip glows on "your paycheck" → platePromise', 'SCENE', 'platePromise', ''),
 # ---------------------------------------------------------------- c02 · B1 · his argument, the test
 ('1.01', 'This January', 'out of platePromise: the promise\'s face lights and becomes the clip plate (C1 grows out of the tag)', 'SCENE', 'the plate', ''),
 ('1.02', 'slot:C1', 'C1 SAM ALTMAN · CEO, OPENAI · 2026 · ORIGINAL FOOTAGE (OPENAI TOWN HALL); the plate goes back into the promise', 'CLIP', 'the promise', ''),
 ('1.03', 'Deflationary pressure', 'gold words on the night: DEFLATIONARY PRESSURE → (plain words) PRICES ↓; the promise sways', 'EXPL', 'the arrow', ''),
 ('1.04', 'His argument is stronger', 'a price tag opens like a box: inside it, tiny people at work (silhouettes): a price is mostly other people\'s time', 'EXPL', 'the dollar', ''),
 ('1.05', 'Of every dollar Americans', 'THE DOLLAR BAR: OF EVERY FOOD DOLLAR · 54¢ LABOR (fills on "somebody\'s work") · 12¢ FARM; source USDA ERS', 'EXPL', 'the labor part', '★'),
 ('1.06', 'Let superintelligence', 'the labor part of the bar turns cool (machines) and shrinks; the price tag over it sinks toward a small cool core', 'EXPL', 'the tag', ''),
 ('1.07', 'He even pictures a house', 'a house drawn in gold lines, robot arms at its walls; small quote: “… close to the cost to rent the robots.”', 'MIX', 'the house', ''),
 ('1.08', 'Then again, he runs', 'the camera tilts up the promise\'s thread: it hangs from a cool data glow (he sells cheap intelligence); a tiny cool label CHATGPT on the thread', 'MIX', 'the land', ''),
 ('1.09', 'But his claim can be tested', 'pull back high over THE LONG LAND for the first time: city of thought (left) to solid ground (right)', 'LAND', 'the tags', 'W'),
 ('1.10', 'Six price tags', 'six tags come down on their threads over the six stations, one by one, left → right; then a seventh, face down, at the town hall; the clock forms top left (the rail)', 'LAND', 'the clock', 'B ★'),
 ('1.11', 'And for each, one question', 'the test question writes under the clock: HOW MUCH OF THIS PRICE IS WORK?', 'EXPL', 'tag 1', ''),
 # ---------------------------------------------------------------- c03 · B1 · station 1: knowledge and advice
 ('2.01', 'Start where a price', 'glide down to station 1: the office tower, its lit window (the programmer); tag 1 lights', 'LAND', 'the window', 'B'),
 ('2.02', 'Knowledge and advice', 'the tag\'s name: KNOWLEDGE & ADVICE (clock: name under the rail)', 'MIX', 'the tag', 'B'),
 ('2.03', "That programmer's week", 'paper quote card: “a very high-end programmer 20 hours, 40 hours” → “less than a dollar’s worth of compute tokens” · Fed, July 22, 2025 · his estimate', 'EXPL', 'the 10×', ''),
 ('2.04', 'And by his count', 'gold steps down: 10× CHEAPER EVERY YEAR (his count) · Epoch AI ≈ 13× since 2023', 'EXPL', 'the window', ''),
 ('2.05', 'Across Europe', 'a second lit window nearby: a translator\'s desk, papers dim; 30 % REPORT FEWER ASSIGNMENTS (CEATL 2026)', 'MIX', 'the tag', ''),
 ('2.06', 'But a falling cost', 'two lines: COST (falls steeply) and PRICE (barely moves) on the tag\'s face', 'EXPL', 'the law firm', ''),
 ('2.07', 'Law firms have AI too', 'a law firm\'s tower next door: its windows run meters of billed hours (no clocks); ≈ 90 % OF LEGAL SPEND STILL BILLED BY THE HOUR (Thomson Reuters)', 'EXPL', 'the price', ''),
 ('2.08', "So that's what gets cheap first", 'tag 1 falls and crumbles (clock: FALLS FIRST)', 'MIX', 'the dust', 'B ★'),
 ('2.09', 'Which explains a strange case', 'the dust drifts right toward the college\'s arched windows', 'LAND', 'the college', ''),
 # ---------------------------------------------------------------- c04 · B1 · station 2: education, subscribe 1
 ('3.01', "Education. It's on his list", 'station 2: the college; tag 2 lights (EDUCATION)', 'LAND', 'the window', 'B'),
 ('3.02', 'In some studies', 'inside an arched window: a student and a small cool tutor light; MORE THAN DOUBLE THE LEARNING GAINS (Harvard physics, 2025)', 'MIX', 'the tag', ''),
 ('3.03', 'So a degree should', 'the tag: $12,290 · +2.9 % (College Board, Nov 5, 2026, published price) rises a little', 'EXPL', 'the certificate', ''),
 ('3.04', 'Because a big part', 'a rolled certificate with a wax seal of light comes out of the cupola: only the university prints it', 'MIX', 'the tag', ''),
 ('3.05', 'So the second tag splits', 'tag 2 tears in two: KNOWLEDGE (falls, cool) · DIPLOMA (stays, gold) (clock: KNOWLEDGE YES · DIPLOMA NO)', 'MIX', 'the land', 'B ★'),
 ('M.01', 'This channel exists', 'subscribe 1: the camera rises; windows of the whole land warm one after another ("for everybody"), you small on a roof', 'LAND', 'the factory', ''),
 ('M.02', 'Want that too', 'the glide right ends over the factory: plateFactory', 'LAND', 'plateFactory', ''),
 # ---------------------------------------------------------------- c05 · B2 · station 3: things
 ('4.01', 'So far, every price', 'out of plateFactory: tag 3 lights and swings close; "drop on your foot": a box falls off the belt with weight', 'LAND', 'the box', 'B'),
 ('4.02', 'Elon Musk promises', 'the robot arm sets the box down; its lid opens into the clip plate', 'SCENE', 'the plate', ''),
 ('4.03', 'slot:C2', 'C2 ELON MUSK · CEO, TESLA & SPACEX · 2026 · ORIGINAL FOOTAGE (THE BUILDERS WITH WALTER ISAACSON) (centre crop: no logos)', 'CLIP', 'the box', ''),
 ('4.04', 'Any goods, for anyone', 'the plate closes into the box; boxes stream on the belt', 'MIX', 'the arms', ''),
 ('4.05', 'The robots are real', '5,079,078 INDUSTRIAL ROBOTS IN OPERATION (IFR, Sept 2026): the robot arms multiply along the factory windows', 'EXPL', 'a phone', ''),
 ('4.06', 'And by the official numbers', 'a phone on the belt; its tag: SMARTPHONES −51 % IN FIVE YEARS · CPI, QUALITY-ADJUSTED (BLS)', 'EXPL', 'the chip', ''),
 ('4.07', 'But this year, analysts', 'the phone\'s memory chip is pulled away by a cool beam toward the data centre (station 4); FORECAST 2026, AVERAGE SMARTPHONE PRICE WORLDWIDE +27.6 % TO $581 (IDC)', 'EXPL', 'the tag', ''),
 ('4.08', 'So the third tag does fall', 'tag 3 falls, bumps back up a little, falls on (clock: FALLS SLOWLY)', 'MIX', 'the cable', 'B ★'),
 ('4.09', 'Because a thing is never', 'cut through the earth: three labelled layers MATERIALS · CHIPS · POWER; the power cable under every station lights', 'EXPL', 'the cable', ''),
 # ---------------------------------------------------------------- c06 · B2 · station 4: energy, C3
 ('5.01', 'Energy', 'follow the cable to station 4: the power station + data centre; tag 4 lights', 'LAND', 'the data centre', 'B'),
 ('5.02', 'Altman says where the falling stops', 'quote card: “As datacenter production gets automated, the cost of intelligence should eventually converge to near the cost of electricity.” · The Gentle Singularity, June 2025', 'EXPL', 'the floor', ''),
 ('5.03', 'That makes energy the floor', 'all the tags sink, and stop on a glowing floor line = the power cable ★; ENERGY +33 % IN FIVE YEARS (BLS)', 'EXPL', 'the floor', '★'),
 ('5.04', 'Unless AI can lower', 'a small sun of clean light rises behind the power station', 'MIX', 'the light', ''),
 ('5.05', 'slot:C3', 'C3 DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · 2025 · ORIGINAL FOOTAGE (LEX FRIDMAN PODCAST); the plate grows out of the clean light', 'CLIP', 'the light', ''),
 ('5.06', 'Radical abundance', 'RADICAL ABUNDANCE in gold, then a small cool label A FORECAST; all tags would fall further (they dip, ghosted)', 'EXPL', 'the tag', ''),
 ('5.07', 'For now, the fourth tag', 'tag 4 rises a little (clock: STAYS UP · FOR NOW)', 'MIX', 'the fields', 'B'),
 # ---------------------------------------------------------------- c07 · B2 · station 5: food
 ('6.01', 'One tag needs energy', 'glide right: three gold labels meet under the fields: ENERGY · MACHINES · GROUND', 'MIX', 'the fields', ''),
 ('6.02', 'Food. Remember', 'station 5: fields + barn; tag 5 lights; the dollar bar from 1.05 again: 54¢ LABOR turns cool', 'EXPL', 'the bar', 'B'),
 ('6.03', 'But the ground under the food', 'the earth under the fields glows warm; U.S. CROPLAND: $6,020 AN ACRE · FIRST TIME ABOVE $6,000 (USDA) ★', 'EXPL', 'the earth', '★'),
 ('6.04', 'So the fifth tag can fall', 'tag 5 falls part of the way and is held by the earth (clock: WORK OUT · GROUND STAYS)', 'MIX', 'the house', 'B'),
 ('6.05', 'Which leaves the tag', 'glide right to the house on its plot, the warmest earth', 'LAND', 'the house', ''),
 # ---------------------------------------------------------------- c08 · B2 · station 6: housing and land, half right
 ('7.01', 'Housing. The first word', 'the turned tag from the hook comes down over the house and turns: HOUSING & LAND', 'MIX', 'the house', 'B'),
 ('7.02', 'Go back to his robot-built', 'quote card: “If robots can build a house on land you already own …” (on land you already own lights)', 'EXPL', 'the plot', ''),
 ('7.03', 'Even in his own picture', 'the plot under the house lights gold: already paid', 'MIX', 'the house', ''),
 ('7.04', 'And in America', 'the house lifts off its plot: walls vs ground; LAND ≈ 40 % OF U.S. HOME VALUE (FHFA, 2022)', 'EXPL', 'the walls', ''),
 ('7.05', 'Robots can make walls cheap', 'robot arms stack walls fast (cool); the ground does not grow', 'MIX', 'the quote', ''),
 ('7.06', 'Altman never hid this', 'quote card: “… a few inherently limited resources like land may rise even more dramatically.” · Three Observations, Feb 2025', 'EXPL', 'the tag', ''),
 ('7.07', 'So the sixth tag stays hard', 'tag 6 rises a little, earth weight at its foot (clock: STAYS HARD)', 'MIX', 'the six tags', 'B'),
 ('7.08', 'That makes Altman half right', 'THUMBNAIL B: the six tags come down to the ground and stand as a rising row (1 2 3 5 4), the house becomes the last gold tag ★; "work out / scarce stays"', 'MIX', 'plateStairs', '★'),
 # ---------------------------------------------------------------- c09 · B3 · the seventh tag
 ('8.01', 'So what does that do', 'out of plateStairs: the seventh tag (face down) comes down next to you in the house door; NOT FINANCIAL ADVICE (small)', 'MIX', 'the seventh tag', 'B'),
 ('8.02', 'Run the same test', 'the test question again; the tag\'s inside is all tiny workers: ALL OF IT', 'EXPL', 'the tag', ''),
 ('8.03', "It's your wage", 'the seventh tag turns: YOUR WAGE (your pay slip becomes its face) ★', 'MIX', 'the dust', 'B ★'),
 ('8.04', 'Think back to the first', 'the dust of tag 1 drifts in: the programmer\'s week was a paycheck (the window light goes out)', 'MIX', 'the window', ''),
 ('8.05', 'By his own argument', 'everybody\'s windows carry small wage tags; they tremble', 'MIX', 'the data', ''),
 # ---------------------------------------------------------------- c10 · B3 · the numbers, C4, the second half
 ('9.01', 'This summer, American businesses', 'Q3 2026: OUTPUT +3.7 % · HOURS +0.1 % (two bars)', 'EXPL', 'the share', ''),
 ('9.02', 'And the share of that income', 'LABOR SHARE 53.0 % · LOWEST SINCE 1947 (BLS, prelim.): a long line ends at its lowest point ★', 'EXPL', 'the point', '★'),
 ('9.03', "That's no proof", 'small: NO PROOF AI DID IT; the point becomes the clip plate', 'EXPL', 'the plate', ''),
 ('9.04', 'slot:C4', 'C4 DARON ACEMOGLU · ECONOMIST, MIT · NOBEL PRIZE 2024 · 2026 · ORIGINAL FOOTAGE (RADIO DAVOS, WEF) (centre crop: no logos)', 'CLIP', 'the promise', ''),
 ('9.05', 'Altman saw it too', 'the promise (crumbled to half) again: its quote completes behind the dots: “… and everyone will have enough money to be able to afford it.” (March 16, 2021)', 'EXPL', 'the quote', ''),
 ('9.06', 'And if the rules', 'quote card: “If public policy doesn’t adapt accordingly, most people will end up worse off than they are today.”', 'EXPL', 'the promise', ''),
 ('9.07', 'Even for him', 'the half promise sways, alone in the sky', 'SCENE', 'the three', ''),
 # ---------------------------------------------------------------- c11 · B3 · three answers
 ('10.01', 'So how does everyone', 'three tags of light come down at the town hall: MARKET · FUND · CHECK', 'MIX', 'MARKET', ''),
 ('10.02', 'The first is the market', 'MARKET: idea (every dollar buys more) · proof (your phone) · weakness: the seventh tag falls with it', 'EXPL', 'FUND', ''),
 ('10.03', 'The second is a fund', 'FUND: everyone owns a share (slices of companies + land) · AMERICAN EQUITY FUND (2021)', 'EXPL', 'Alaska', ''),
 ('10.04', 'Alaska already pays', 'a family at a kitchen table in Alaska, the payment arrives (warm light); ALASKA 2026: $1,200 · his plan ≈ $13,500 ★', 'MIX', 'the number', '★'),
 ('10.05', 'Its weakness: a fund pays', '2022: $3,284 · 2026: $1,200 · SET BY THE LEGISLATURE', 'EXPL', 'CHECK', ''),
 ('10.06', 'The third is a check', 'CHECK: $1,000 A MONTH · 3 YEARS · 1.3 FEWER HOURS A WEEK (OpenResearch)', 'EXPL', 'the bill', ''),
 ('10.07', 'Its weakness is the bill', 'the bill: a long receipt unrolls from the town hall (the receipt motif, cool)', 'MIX', 'the timeline', ''),
 ('10.08', 'Even Altman has changed', 'a short timeline: 2021 FUND · 2024 UNIVERSAL BASIC COMPUTE · 2026 PUBLIC WEALTH FUND (no mockery)', 'EXPL', 'the clock', ''),
 # ---------------------------------------------------------------- c12 · B3 · the order, subscribe 2, end screen
 ('11.01', "So that's the order", 'the clock grows to fill the frame (F.board big): the six verdicts light in order with the words', 'EXPL', 'tag 7', 'B'),
 ('11.02', "He's half right", 'the promise, half, gold over the land', 'LAND', 'tag 7', ''),
 ('11.03', "What's still open", 'the seventh tag swings, OPEN; it is your pay slip', 'MIX', 'the town hall', 'B'),
 ('11.04', 'Prices follow the machines', 'the camera glides from the factory (PRICES ← MACHINES) to the town hall (INCOMES ← RULES): its windows light; people you elect', 'MIX', 'you', ''),
 ('11.05', 'Your wage is a price too', 'YOUR WAGE IS A PRICE TOO. in gold over you holding the seventh tag ★', 'MIX', 'the land', '★'),
 ('11.06', 'And cheap only makes you richer', 'the seventh tag hangs; every other tag in the row above', 'LAND', 'the windows', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2: the windows of the whole land warm, you at the house door', 'LAND', 'the pull back', ''),
 ('A.02', 'END', 'quiet: the camera settles into END_CAM (music carries)', 'LAND', 'end screen', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s: S.END_CAM: the seven tags in a row high in the sky (their verdicts), you small on the ground; the dark earth carries the two tiles + subscribe circle (S.END_TILES); no text', 'LAND', '—', ''),
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
L.append('# Film 66 · "Sam Altman Says Everything Will Get Cheap" (AI MAKES EVERYTHING CHEAP) · shot list (binding)\n')
L.append(f'Generated by `tools/shots66.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact check may still change a few spoken lines: anchors are phrases, so the code does not care; if a phrase goes missing, `T.G` says which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · LAND .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min. One world (THE LONG LAND, from pure thought to solid ground): the camera travels left → right station by station; explainers float over a night veil while the camera keeps gliding behind it; clips grow out of a world object (the promise\'s face, a box, the clean light, a data point) and go back into it.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. B = the clock (seven tags, top left) changes (`F.board` does it from `F.BOARD` phrases; never by hand).\n')
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
L.append('\n## 4 · Seams between the groups (lib/f66_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | This January | platePromise (home camera = thumbnail A again: you on the rooftop with the pay slip in your right hand, the city cool, THE PROMISE half crumbled, dust streaming) | H.11 settles into it | 1.01 lights the promise\'s face and grows the C1 plate out of it |")
L.append("| B1 → B2 | So far, every price | plateFactory (FACTORY_CAM: the factory right of centre, its tag 3 unlit; tags 1 (fallen, dusty) and 2 (split) left; the clock top left) | M.02 glides right and settles | 4.01 lights tag 3 and swings it close |")
L.append("| B2 → B3 | So what does that do | plateStairs (STAIRS_CAM = thumbnail B: the six tags stand on the ground in a rising row, the house is the last gold tag, you small in its lit door; the clock) | 7.08 builds the row and settles | 8.01 brings the seventh tag (face down) down next to you |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>`.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: <ROOT>text-v3.md EINBLENDUNG lines (fact-checked; faktencheck.md MB1–MB3 applied), as `F.SOURCES` in lib/f66_kit.mjs. ≤ 6 words per statement + one number (verbatim quotes may be longer). Text ≥ 22 px, never in the bottom 170 px (subtitles). If the fact check changes a number, change it in `F.SOURCES` (lead) or say in your report which string you took.')
L.append('- **0:30–0:50 (H.08–H.10): no source line, no card, no stat change** (continuous scene). The programmer quote with its source comes in 2.03.')
L.append('- **MB3 is out:** no data-centre cost split (electricity ≈ 7 %) anywhere.')
L.append('- **No QR anywhere.** No support / donation overlay.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
