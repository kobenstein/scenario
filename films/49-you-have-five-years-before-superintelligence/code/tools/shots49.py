#!/usr/bin/env python3
"""Film 49 · "You Have Five Years Before Superintelligence" (5 YEARS TO GET READY FOR AI) · the binding shot list -> docs/shots.md (times from
the current timing: $TIMING, <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json).
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots49.py
Every shot: id (H = hook, K = the wedding + countdown, 5 4 3 2 1 = the years (steps), M / A = subscribe calls, S = the top, E = end screen),
anchor = a VO phrase (looked up in the film after the previous shot's anchor; 'slot:C13' = a clip slot; 'phrase#1' = the 2nd occurrence in
the film; 'ENDSCREEN' = duration − 15), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1, same scale as film 66):
  EXPL 1.0 (a diagram: data/quote cards, bars, the year rail, date cards in close-up) · MIX .5 (the stairs with a diagram on them: words in
  the sky, a numbered riser, a stage with a number) · LAND .3 (the stairs themselves, the old stair, a stage set without data) ·
  SCENE 0 (you, the wedding, rooms, people) · CLIP 0.
Flags: W = a hard world change (budget ≤ 1 per minute; this film: 0) · ★ = the one wow moment of the chunk · C = the countdown changes
(F.counter does it from F.COUNTER phrases + the step sound, never by hand)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F49ROOT', '/mnt/project-files/scenario/film-vorbereiten/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'LAND': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'You have five years'), ('c02', 'B1', 'Picture a wedding'), ('c03', 'B1', 'Five years to go'), ('c04', 'B1', 'What the next generation always had'),
          ('c05', 'B1', 'Four years to go'), ('c06', 'B2', 'But you can only do so much'), ('c07', 'B2', 'Three years to go'), ('c08', 'B2', 'But if a machine can already act'),
          ('c09', 'B3', 'That is what the experts know'), ('c10', 'B3', 'One year to go'), ('c11', 'B3', 'And there may be a great deal'), ('c12', 'B3', 'Five years from now')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'You have five years', 'THUMBNAIL B (frame 0): the five gold steps, the door of light, you small at the foot looking up; title 5 YEARS TO GET / READY FOR AI sinks behind its mask', 'SCENE', 'the door', ''),
 ('H.02', 'A machine smarter', 'the door flares once; SMARTER THAN ANY HUMAN / AT ALMOST EVERYTHING in the sky (no robot, no face: only the light the steps run to)', 'MIX', 'the door light', ''),
 ('H.03', 'That means the biggest', 'pull back and left: behind the plain a long dark stair comes up out of the night, hundreds of flat steps; THE BIGGEST CHANGE / THE SHORTEST TIME', 'MIX', 'the old stair', ''),
 ('H.04', 'The plow', 'the camera trucks right along the old stair; the plow landing lights in back light: HANDS', 'EXPL', 'the truck', ''),
 ('H.05', 'The engine', 'the beam engine (its flywheel turns): MUSCLES', 'EXPL', 'the truck', ''),
 ('H.06', 'The computer', 'the early computer (reels, lamps): MEMORY', 'EXPL', 'the truck', ''),
 ('H.07', 'But thinking still', 'the lit window: a person at a table, head in hand; THINKING NEEDED A PERSON', 'MIX', 'the window', ''),
 ('H.08', 'Until now', 'THE SWEEP: the door flares, the gold of the five steps runs down the stairs, across the plain and over the window; the window is outshone, stays gold', 'SCENE', 'the gold wave', '★'),
 ('H.09', 'And those changes', 'on two landings an adult stops, a child climbs on past (generations); source PORZIO, ROSSI & SANTANGELO 2022 · HOBIJN & SCHOELLMAN', 'EXPL', 'the glide right', ''),
 ('H.10', 'This time, there is no', 'a long glide right to the foot of the gold stairs: no child ahead; you alone; the light pools around you; IT FALLS TO YOU', 'MIX', 'you', ''),
 ('H.11', 'So how do you get ready', 'HOW DO YOU GET READY / IN FIVE YEARS?; you climb the little carved stair onto the first step', 'MIX', 'your feet', ''),
 ('H.12', 'The change has already', 'the gold light pools on the tread under your feet; the date card 2027? unfolds on the step edge; source AI FUTURES PROJECT, NOV 2026', 'EXPL', 'the card', ''),
 ('H.13', 'But you have something', 'wide from below: the whole stairs and the door, long before the arrival; A WARNING', 'MIX', 'the step edges', ''),
 ('H.14', 'The people building', 'date cards unfold on the step edges: 1–2 YEARS (Dario Amodei, essay, Jan 2026) · END OF 2028 (Sam Altman, Feb 2026), all inside the five steps; sources', 'EXPL', 'the bottom step', ''),
 ('H.15', 'And the first thing', 'a laptop opens on the bottom step, its screen lit; you walk past it; it goes dark; NOT YOUR COMPUTER → plateFoot (the wedding table waits at the left, unlit)', 'MIX', 'plateFoot', ''),
 # ---------------------------------------------------------------- c02 · B1 · the wedding, Harari, the countdown
 ('K.01', 'Picture a wedding', 'out of plateFoot: the string lights over the table light right → left (the bulb nearest you first); glide left to the long table: you sit half turned away, your coat over the chair; the stairs glow behind', 'SCENE', 'the string lights', ''),
 ('K.02', 'A stranger at your table', 'the neighbour turns to you (a person, indigo); in front of you THE PLACE CARD: a name you cannot read, a worn line: the answer you have given for decades', 'SCENE', 'the place card', ''),
 ('K.03', 'Now picture giving', 'close on the place card: the answer line fades and leaves a blank; you look at it; the five steps glow behind', 'MIX', 'the blank line', ''),
 ('K.04', 'The historian Yuval', 'a paper card pinned beside the table: YUVAL NOAH HARARI · HISTORIAN · AUTHOR OF “SAPIENS” · 25 MILLION COPIES SOLD; the place card small in the corner', 'EXPL', 'the card → plate', ''),
 ('K.05', 'slot:C13', 'C13 (portrait short, centred on night blue): YUVAL NOAH HARARI · HISTORIAN · 1 AUG 2026 · ORIGINAL FOOTAGE; it grows out of the paper card and goes back into it', 'CLIP', 'the card', ''),
 ('K.06', 'He calls it the end', 'the place card: the line fills, fades, fills again, fades; “THE END OF LIFETIME CAREERS” · YUVAL NOAH HARARI, 1 AUG 2026', 'EXPL', 'the stairs behind', ''),
 ('K.07', 'And he expects the change', 'behind the five steps a light path grows from the landing into the far distance: DECADES', 'MIX', 'the path', '★'),
 ('K.08', 'So start the countdown', 'the whole stairs: on every riser a number rises, bottom to top 5 · 4 · 3 · 2 · 1; the countdown builds top left (five blocks rise out of its base line)', 'MIX', 'the numbers', 'C'),
 ('K.09', 'And the hardest question', 'over the top step the landing in back light: you cannot see yet what waits there', 'MIX', 'the bottom step', ''),
 # ---------------------------------------------------------------- c03 · B1 · step 5: you
 ('5.01', 'Five years to go', 'STEP HIT: the bottom step lights (step sound); counter 5 YEARS TO GO; the camera rises onto tread 0: a stage, nearly empty: only you and, small at the edge, the place card with its blank line', 'MIX', 'you', 'C'),
 ('5.02', 'It comes first', 'you on the wide step; behind the stairs the light path of DECADES keeps running', 'MIX', 'the path', ''),
 ('5.03', 'Reinvent yourself', 'around you young faces in hoodies flash up like a start-up poster (flat silhouettes, no faces); you hesitate', 'SCENE', 'the poster', ''),
 ('5.04', 'The data disagrees', 'a garage on the step: at the workbench not a twenty-year-old but you, grey at the temples', 'MIX', 'the workbench', ''),
 ('5.05', "Among America's fastest", 'data card KNOWN: AVERAGE FOUNDER AGE AT THE START 45 · FASTEST-GROWING 0.1 % OF NEW U.S. FIRMS (AZOULAY ET AL., 2020)', 'EXPL', 'the 45', '★'),
 ('5.06', 'But it matters who chooses', 'two equal doors of light side by side (thumbnail C): through one you walk yourself, through the other you are pushed', 'MIX', 'the doors', ''),
 ('5.07', 'People who switch jobs late', 'behind the first door a bright room', 'MIX', 'the second door', ''),
 ('5.08', 'People laid off', 'behind the second door a pay slip, a good quarter tears off: −28 %; OECD EMPLOYMENT OUTLOOK 2025 · LAID OFF AT 46–50: −28 % PAY', 'EXPL', 'the torn quarter', ''),
 ('5.09', 'That is a comparison', 'both doors in one picture: the same door, two ways through it', 'MIX', 'the doors', ''),
 # ---------------------------------------------------------------- c04 · B1 · a fresh start
 ('5.10', 'What the next generation always', 'the camera slides down to the old stair: the child from the hook steps onto a new landing, no luggage', 'SCENE', 'the child', ''),
 ('5.11', 'So choose your own', 'you in front of the door of light: you put your bag down and step over the threshold yourself; on the place card a first thin gold stroke in the blank line', 'SCENE', 'the gold stroke', '★'),
 ('5.12', 'Become a beginner', 'three small scenes on the step: you the oldest in a beginners\' class, a crooked first try', 'SCENE', 'the class', ''),
 ('5.13', 'At work, take on', 'you raise your hand in a round at work', 'SCENE', 'the hand', ''),
 ('5.14', 'Join one group', 'a choir: nobody wears a name tag; your place card lies face down beside you', 'SCENE', 'the card', ''),
 ('5.15', 'Resilience is partly', 'you walk through a small door, then a bigger one; RESILIENCE TRAINING · SMALL EFFECTS (NATURE REVIEWS PSYCHOLOGY, 2026)', 'EXPL', 'the doors', ''),
 ('5.16', 'But starting over', 'you turn: behind you your working life as a shelf of folders and tools', 'MIX', 'the shelf', ''),
 ('5.17', 'If a machine can do', 'in front of it a piece of work fills itself in one minute: 1 MIN (a number, no clock face); the camera rises to the second step', 'EXPL', 'the second step', ''),
 # ---------------------------------------------------------------- c05 · B1 · step 4: work
 ('4.01', 'Four years to go', 'STEP HIT: the second step lights; counter 4 YEARS TO GO; you climb; the stage is wider: an open office, young faces in the light, you at the edge', 'MIX', 'the office', 'C'),
 ('4.02', 'And here, there is evidence', 'the office stage; the light searches', 'MIX', 'the light', ''),
 ('4.03', 'One A.I.', 'two equal tools, two figures (an expert, a beginner)', 'EXPL', 'the tools', ''),
 ('4.04', 'Experts succeeded', 'bars: EXPERT-RATED more than twice as high as NOVICE (no invented %: label the ratio) · ONE CODING TOOL (CLAUDE CODE) · ANTHROPIC, 16 JUNE 2026', 'EXPL', 'the tall bar', '★'),
 ('4.05', 'In that study', 'the bars stay; the machine did not level the field', 'EXPL', 'the light', ''),
 ('4.06', 'It rewarded the people', 'the light moves from the young faces to you at the edge; the counter and the bars still at the edge of frame', 'MIX', 'you', ''),
 ('4.07', 'Does that make you safe', 'the bar gets its line: MEASURED IN ONE CODING TOOL', 'EXPL', 'the calendar', ''),
 ('4.08', 'And when people in their', 'a wall calendar on the riser turns 34 weeks: 34 WEEKS · OUT OF WORK, AGES 55–64 · AARP / BLS, 2026', 'EXPL', 'the calendar', ''),
 ('4.09', 'So experience is an edge', 'you reach for the tool', 'MIX', 'the tool', ''),
 ('4.10', 'Learn the machine', 'you at your desk, the tool next to the usual work; the calendar with the 34 weeks stays closed → plateWork', 'MIX', 'plateWork', ''),
 # ---------------------------------------------------------------- c06 · B2 · the statement, C5, subscribe 1
 ('4.11', 'But you can only do so much', 'out of plateWork: from you at the desk out to a long list of signatures that rolls; “WE MUST ACT NOW” · 13 JULY 2026 · 200+ SIGNATORIES, 16 NOBEL LAUREATES', 'EXPL', 'the list', ''),
 ('4.12', 'Not to pause', 'the list stops: TO PREPARE in gold', 'EXPL', 'the plate', ''),
 ('4.13', 'slot:C5', 'C5 (portrait short): ERIK BRYNJOLFSSON · STANFORD DIGITAL ECONOMY LAB · 14 JULY 2026 · ORIGINAL FOOTAGE; grows out of the signature list', 'CLIP', 'the list', ''),
 ('M.01', 'This channel exists', 'the stairs wide: many small figures climb the lower steps with you (the crowd); subscribe in words only (no button graphic, no QR)', 'LAND', 'the crowd', '★'),
 ('M.02', 'You met this machine', 'you at the desk turn: behind you a half-open door, a blue glow', 'SCENE', 'the blue glow', ''),
 ('M.03', 'But what about the next', 'the camera rises toward the third step', 'MIX', 'the third step', ''),
 # ---------------------------------------------------------------- c07 · B2 · step 3: family
 ('3.01', 'Three years to go', 'STEP HIT: the third step lights; counter 3 YEARS TO GO; the stage is wider again: a home in section, a screen glowing under a blanket in the child\'s room', 'MIX', 'the screen', 'C'),
 ('3.02', 'Three in four teenagers', 'four teenagers, three with a glowing device; data card KNOWN 77 % · TEENS USING A.I. IN FREE TIME · COMMON SENSE CENSUS 2026 · TRIED AN A.I. COMPANION: 72 % (2025)', 'EXPL', 'the device', ''),
 ('3.03', 'California now has a law', 'a chat window; every three hours the line appears: “I am not a human.”; CALIFORNIA SB 243 · IN FORCE SINCE 1 JAN 2026 · APPLIES TO KNOWN MINORS', 'EXPL', 'the sentence', ''),
 ('3.04', 'Somebody had to write', 'the sentence “I am not a human.” alone on the dark', 'EXPL', 'the sentence', '★'),
 ('3.05', 'Harari has a name', 'Harari as a paper card with name line; the quote as text: “a psychological experiment on a global scale”', 'EXPL', 'the card → plate', ''),
 ('3.06', 'slot:C16', 'C16 (portrait short): YUVAL NOAH HARARI · HISTORIAN · 28 SEPT 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the card', ''),
 ('3.07', 'This time, the next generation can', 'the child who climbed past the grown-up on the old stair now sits on the third step in front of a glowing screen; you sit down next to it', 'MIX', 'the screen', ''),
 ('3.08', 'The reflex is to forbid', 'the plug is pulled; under the blanket it keeps glowing', 'MIX', 'the glow', ''),
 ('3.09', 'So ask instead', 'two figures side by side on the bed edge, a screen between them; the three questions appear one after another as text', 'EXPL', 'the screen', ''),
 # ---------------------------------------------------------------- c08 · B2 · step 2: the machine, the year rail
 ('3.10', 'But if a machine can already act', 'the child\'s screen keeps glowing; you look up from it to the stairs: the light at the top looks closer than before; a question mark beside the big 5', 'MIX', 'the fourth step', ''),
 ('2.01', 'Two years to go', 'STEP HIT: the fourth step lights; counter 2 YEARS TO GO; the living room: a big window to the world, headlines on the TV, an untouched tablet on the table', 'MIX', 'the TV', 'C'),
 ('2.02', 'Five years to full', 'beside the stairs a year rail appears; the lab cards from 0:46 lie on the steps 2027–2031; small: INTEREST · FUNDRAISING', 'EXPL', 'the rail', ''),
 ('2.03', 'A short deadline', 'the rail runs far past the stairs: FORECASTING PLATFORMS (METACULUS) ≈ 2032 · RESEARCHER SURVEY ≈ 2047 (AI IMPACTS, 2023)', 'EXPL', 'the 2047 mark', ''),
 ('2.04', 'But so far, the experts', 'on the long rail a marker slides left, toward today: EXPECTED FOR 2030 · DONE IN APRIL 2025 (FORECASTING RESEARCH INSTITUTE, SEPT 2026)', 'EXPL', 'the marker', ''),
 ('2.05', 'The chatbot most people', 'a calendar leaf: LAUNCHED 30 NOV 2022', 'EXPL', 'the point', ''),
 ('2.06', "By its maker's count", 'from one point a sea of lights grows: OVER 1 BILLION WEEKLY ACCOUNTS (OPENAI, 2026) (accounts, not people)', 'EXPL', 'the lights', ''),
 ('2.07', 'And even most of their', 'a bracket from today to 2047: LESS THAN ONE GENERATION; under it, small, the old stair from the hook: the same bracket spans one single landing', 'EXPL', 'the bracket', '★'),
 ('2.08', 'So it is the deadline', 'the rail folds into two signposts at the foot of the stairs: LONGER → EARLY · FIVE → READY → plateMachine (back in the living room)', 'EXPL', 'plateMachine', ''),
 # ---------------------------------------------------------------- c09 · B3 · the experience
 ('2.09', 'That is what the experts know', 'out of plateMachine: the living room; bars: EXPECT A NEGATIVE EFFECT ON SOCIETY 35 % · EVER USED A CHATBOT 23 % (PEW RESEARCH CENTER, 17 JUNE 2026, U.S. ADULTS 65+)', 'EXPL', 'the bars', ''),
 ('2.10', 'The fear arrived', 'the headlines run on; in front of them the untouched tablet on the table', 'MIX', 'the tablet', ''),
 ('2.11', 'So get the experience', 'you take the tablet; a familiar piece of work (a quote, a plan, a timetable) goes in; ticks and one red question mark on the result; outside the window it turns evening: one afternoon', 'MIX', 'the result', '★'),
 ('2.12', 'That protects you', 'in the window left a billboard SOON!, right a shrug NOT IN OUR LIFETIME; between them you with your own result in your hand', 'EXPL', 'the window', ''),
 ('2.13', 'The last step needs', 'from the window out to a parliament at night; on a lectern a sheet of law, the top line blank', 'MIX', 'the blank line', ''),
 ('2.14', 'And the biggest one', 'the blank top line; the top step lights up', 'MIX', 'the top step', ''),
 # ---------------------------------------------------------------- c10 · B3 · step 1: your say
 ('1.01', 'One year to go', 'STEP HIT: the top step lights; counter 1 YEAR TO GO; the widest stage: a town square, a voting booth with the curtain half open', 'MIX', 'the booth', 'C'),
 ('1.02', 'Voters have already', 'a map of the U.S., ten states light; 41 small ballots, 40 tip to one side; 3 NOV 2026 · 41 LOCAL MEASURES · 10 STATES · LIMITS WON 40 (BALLOTPEDIA)', 'EXPL', 'the ballots', '★'),
 ('1.03', 'Those votes were about', 'a data centre as an outline at the edge of town, a ballot in front; WHO GETS WHAT THE MACHINES EARN?', 'EXPL', 'the question', ''),
 ('1.04', 'On the bigger question', 'a table: from the left and from the right a paper is laid on it; TODAY · 2026', 'EXPL', 'the left paper', ''),
 ('1.05', 'Senator Bernie Sanders', 'the head of the bill: AMERICAN A.I. SOVEREIGN WEALTH FUND ACT · 18 JUNE 2026 · CHANCES: SLIM', 'EXPL', 'the bill → plate', ''),
 ('1.06', 'slot:C2', 'C2 (landscape): SENATOR BERNIE SANDERS · U.S. SENATE · 1 JUNE 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the right paper', ''),
 ('1.07', 'Donald Trump has floated', 'quote card: “the American public essentially becomes a partner with the companies.” · DONALD TRUMP, 5 JUNE 2026', 'EXPL', 'the table', ''),
 ('1.08', 'Neither version is law', 'both papers lie untouched on the table; then you in the voting booth; WHO GETS A SHARE?', 'MIX', 'the booth', ''),
 # ---------------------------------------------------------------- c11 · B3 · the top
 ('S.01', 'And there may be a great deal', 'DAWN (thumbnail A, the only time): above the stairs the light warms and rises; ten small figures in a lab, nine raise an arm; 91 % OF STAFF · U.S. ADULTS: 39 % (ANTHROPIC SURVEY, 16 OCT 2026 · “A NOBEL-LEVEL DISCOVERY BY 2030”)', 'EXPL', 'the lights', '★'),
 ('S.02', 'They have a stake', 'the lab figures lower their arms', 'MIX', 'the stairs', ''),
 ('S.03', 'But if even part', 'along the stairs lights go on, stage by stage (discoveries, not only risks)', 'MIX', 'the top step', ''),
 ('S.04', 'So suppose all of it works', 'you climb from the top step onto the landing in the light; below you all five steps, every stage lit; on the landing only a small table; the countdown: all five blocks glow, a door of light beside them', 'MIX', 'the table', 'C'),
 # ---------------------------------------------------------------- c12 · B3 · the hardest question, the end
 ('S.05', 'Five years from now', 'the small table is the wedding table from 0:55, five years on: the same string lights, you with greyer hair; the place card, its line blank; a neighbour turns to you', 'SCENE', 'the place card', ''),
 ('S.06', 'Who do you want to be', 'close on the blank line of the place card; behind it the light; no text', 'SCENE', 'the blank', '★'),
 ('S.07', 'It can sound like a loss', 'across the table a child draws; it slides a pen over to you; you take it; small: WHAT DO YOU WANT TO BE?', 'MIX', 'the pen', ''),
 ('S.08', 'For most of history', 'both stairs in one picture: behind, the long old one (children climb past standing grown-ups); in front, the five gold ones, now grown-ups climb, grey-haired among them, some with a child by the hand; WARNING · WORK · WONDER', 'MIX', 'you', ''),
 ('S.09', 'There is no next generation', 'you on the landing, the morning light reaches you; you set the pen on the blank line; THE NEXT GENERATION IS YOU', 'MIX', 'the light', ''),
 ('A.01', 'This channel exists#1', 'the closing picture begins: the stairs, the morning light, many small figures of every age on the steps; subscribe in words (no QR)', 'LAND', 'the end picture', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN 15 s (S.END_CAM): the whole stairs, every stage lit, you small at the table on the landing; the lower part calm and dark for the two tiles and the subscribe circle (S.END_TILES); no text', 'LAND', '—', ''),
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
L.append('# Film 49 · "You Have Five Years Before Superintelligence" (5 YEARS TO GET READY FOR AI) · shot list (binding)\n')
L.append(f'Generated by `tools/shots49.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'The fact check may still change a few spoken lines: anchors are phrases, so the code does not care; if a phrase goes missing, `T.G` says which one.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · LAND .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min (film 66: 1 in 10.4 min). One world (THE STAIRS OF FIVE YEARS): the camera climbs the five steps year by year (every tread is a stage); the old stair of history lies down to the left; explainers stand on the steps (date cards, the year rail) or float over a night veil while the camera keeps gliding behind it; clips grow out of a paper card or a list and go back into it.')
L.append(f'- Shots: {len(SHOTS)} (film 66: 96), one motif per sentence. ★ = the one wow moment of a chunk. C = the countdown (five small steps, top left) changes (`F.counter` does it from `F.COUNTER` phrases and the step sound; never by hand).')
L.append('- **Cuts: 0 hard cuts inside the film** (every chunk is one continuous take; chunk seams are identical frames). **Motion measure** (tools/calm.py at 1280×720): mafd median 0.25–0.55 per chunk (film 66 c01: 0.47; the hook may sit above because it trucks across the old stair, the step chunks aim at ≤ 0.47), static share (mafd < 0.15) ≤ 15 %; smooth.py: 0 LURCH, 0 POP. Measured values for c01: docs/MOTION.md §7.\n')
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
L.append('\n## 4 · Seams between the groups (lib/f49_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | Picture a wedding | plateFoot (FOOT_CAM: you on the bottom step at x 880 after walking past the laptop, now dark; the stairs rise right; the wedding table waits on the plain at the left, string lights UNLIT) | H.15 settles into it | K.01 lights the string lights right → left and glides to the table |")
L.append("| B1 → B2 | But you can only do so much | plateWork (WORK_CAM: tread 1, the office stage; you at the desk with the tool (cool screen) next to the usual work (lamp, papers); the wall calendar CLOSED; counter 4 YEARS) | 4.10 settles into it | 4.11 pulls out from the desk to the signature list |")
L.append("| B2 → B3 | That is what the experts know | plateMachine (MACHINE_CAM: tread 3, the living room; window to the world, TV headlines, the untouched tablet, you by the sofa; counter 2 YEARS) | 2.08 folds the rail into the signposts and glides back into the living room | 2.09 raises the Pew bars in the room |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c01,c02 node tools/seam.mjs --at <T0>`.\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: <ROOT>text-v7.md picture lines with <ROOT>faktencheck-v7.md "Bild und Einblendungen" applied (binding), as `F.SOURCES` in lib/f49_kit.mjs. ≤ 6 words per statement + one number (verbatim quotes may be longer). Text ≥ 22 px on screen, never in the bottom 170 px (subtitles).')
L.append('- **Changed by the fact check:** 41 LOCAL MEASURES · 10 STATES · LIMITS WON 40 (BALLOTPEDIA) (41 slips, 40 tip) · U.S. ADULTS: 39 % · EXPERT-RATED vs NOVICE, ONE CODING TOOL (CLAUDE CODE) · MEASURED IN ONE CODING TOOL · METACULUS ≈ 2032 · the bracket to 2047 · OVER 1 BILLION WEEKLY (OPENAI, 2026) · SMALL EFFECTS · “A NEGATIVE EFFECT ON SOCIETY” · Amodei = 1–2 YEARS (ESSAY, JAN 2026) on both cards · HOBIJN & SCHOELLMAN.')
L.append('- **Cut:** the card “by 2030 (survey of Anthropic staff)”: that survey is about a Nobel-level discovery, NOT a superintelligence deadline. No “chief economists of A.I. labs” line under the statement.')
L.append('- **The film never names its maker.** Anthropic / Claude Code appear only as a SOURCE of a study (4.04, S.01), like any other source.')
L.append('- **No QR anywhere.** No support / donation overlay. No AI images: everything is drawn in code.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
