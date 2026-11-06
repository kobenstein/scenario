#!/usr/bin/env python3
"""Film 20 shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film order), never to a second.
  python3 tools/shots20.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json from vo-v4.txt).
Layer: SCENE (the world: table, track, clock as objects) · EXPL (explainer: light graphics in the night / on the clock face / on the
tabletop bench) · SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half) · CLIP / CARD (footage frame / quote card;
CLIP counts as scene, CARD as explainer).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; anchors are searched
after the shot start. The scene code uses the same phrases: T.G(phrase, 0, after). Clip/card shots start at the clip's own start."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = (os.environ.get('F20ROOT') or '/mnt/project-files/scenario/film-altern/').rstrip('/') + '/'
REAL = ROOT + 'audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
CL = {c['id']: c for c in TM.get('clips', [])}
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def gfind(phrase, after=-1.0, nth=0):
    if phrase.startswith('@'):                       # @C1 / @Q2: the start of a clip or quote card slot
        return CL[phrase[1:]]['start']
    q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(WS) - len(q) + 1):
        if WS[i]['s'] < after - 1e-3: continue
        if all((norm(WS[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(WS[i + j]['w']) == p) for j, p in enumerate(q)):
            if hit == nth: return WS[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.2f}: "{phrase}"')

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, builder, title, first phrase, light / hero
CHUNKS = [
    ('c01', 'Lead', 'Hook: four generations at the table · the eye · a race · the clock (3 → 1.7, 12 = escape velocity, the push)', 'You could be part',
     'Kitchen table under one lamp, a dim clock behind → the lamp goes up, the clock rises as a sun over the track → the gauge read like a diagram → down the track behind you'),
    ('c02', 'B1', 'Riddle 1: why bodies age · the bill · the egg made before your mother was born · ground zero · the reset button', 'Aging looks like',
     'Your lane as a life line (lit youth, dark old age) → the bill runs down it → the bench: three nested lives → the age curve dips to ground zero → it becomes the button'),
    ('c03', 'B1', 'Riddle 2: four proteins · held down = tumours · the window · three of four (mouse eyes) · Bonn · a long way · the switchboard', 'Twenty years ago',
     'The button on the tabletop bench under the lamp: four proteins seat into it; a cell beside it shows each result → the distance from the bench to the track'),
    ('c04', 'B1', 'Riddle 3: A.I. at the button · 3,000 mixes · ×2 · CLIP C1 · redesigned proteins · company claims · the clocks', 'That search is too big',
     'The switchboard of mixes fills the sky, cool light sweeps it → the footage frame → back to the table: the drop, the eye rises (plateEye)'),
    ('c05', 'B2', 'The first eye: one injection · three people · day 56 · two of three · card ER-100 · no control group · the odds · fate → target', 'Yes. Earlier this year',
     'The eye on the table (the hook again) → three eyes in a row on the bench → the quote card → the clock: the needle does not move, the wedge does'),
    ('c06', 'B2', 'The easy start · the liver · CLIP C2 · everything else · four wards on one thread: AGE', 'The eye was the easy start',
     'A standing body of light (you, big) over the table: the eye, then the liver light up → footage frame → four ward lamps in the sky join on one thread'),
    ('c07', 'B2', 'A.I. at the illnesses · card Hassabis · 9 in 10 fail · not enough (85) · the thread stays · CLIP C3 · his verdict · unless · glass ceiling', 'Artificial intelligence is coming at',
     'The four lamps on the thread under cool light → the card → the lamps go out, the thread stays → the clock: a glass pane over the needle path (plateTrack)'),
    ('c08', 'B3', 'The estimates become a band · who gets there in time · a gene therapy · $4.25M · the price tag', "The optimists' estimates",
     'The track: calendar marks 2030 … 2050, three estimate pins → the finish line smears into a band → a price label lies across the band'),
    ('c09', 'B3', 'Not a cake · how fast the price falls · insulin for a dollar · card Salk', 'Nobody has to lose',
     'Over the track: the price curve falling in the sky → the patent paper and its $1 → the quote card'),
    ('c10', 'B3', 'Four decisions (pool · flat fee · copies · negotiate) · two ideas still waiting', 'Both were decisions',
     'Four levers rise beside the price label on the track; each pull lowers it a step → two empty lever slots'),
    ('c11', 'B3', 'Never yet tried · each one is a decision · your family one more time · end screen', 'None of this has ever',
     'The track at first light: the label lifts off the band → the four generations in their lanes in the band → end screen'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook + the clock (Lead · BUILT: scenes/sc01.mjs) =====================================================================
shot('1.01', 'SCENE', 'You could be part', ['first generation', 'grow old'],
     '**[THE TABLE · opening image]** Night kitchen table under one pendant lamp (the hero light), four generations seated: grandparent (gray hair) · parent · **you** (yellow raincoat) · kid; place cards `1948` `1975` `YOU` `2019`. Behind them, dim, a huge half dial like a wall clock (needle at 3). On **grow old** the needle ticks once.',
     '① slow push ② lamp sway · needle tick', 'plan sequence')
shot('1.02', 'SCENE>EXPL', 'Think about your grandparents', ['Gray hair', 'Reading glasses', 'Stairs', 'longer'],
     'Truck + push to the grandparent. **Gray hair**: the gray cap catches the light; **Reading glasses**: one lit lens ring appears; **Stairs**: a staircase drawn as a line of light beside him, each step drawn slower than the last (**a little longer**).',
     '① push ② the light line', 'plan sequence')
shot('1.03', 'SCENE', "That's the deal", ['deal', 'every human'],
     'Pull back to the table: four identical bent shadows rise on the dim clock face, one behind each sitter (everyone ends the same).',
     '① shadows rise', 'plan sequence')
shot('1.04', 'SCENE>EXPL', 'But this year', ['never been done', 'They put', "living person's eye", 'built to make', 'young again'],
     'A drop of light gathers in the lamp; push down to the tabletop: **the eye** rises out of the middle of the table and opens; the drop falls into the pupil on **built to make** (ripple), the iris fibres warm from gray-blue to gold on **young again**. Right: `FIRST TIME · IN A PERSON` · `ER-100 · PHASE 1 TRIAL` · `CLINICALTRIALS.GOV · NCT07290244`.',
     '① drop ② eye rises', 'plan sequence')
shot('1.05', 'SCENE', "It's one small step", ['small step', 'suddenly real'],
     'The eye blinks and lies back into the table; the drop stays on the tabletop as a small light (carrier to c05). Pull back to the four.',
     '① eye sinks ② pull back', 'plan sequence')
shot('1.06', 'SCENE', 'If this works', ['who gets there', 'Your grandparents?', 'Your parents?', 'You?', 'Your kids?'],
     'Card `WHO GETS THERE IN TIME?` slides in top left on **who gets there**; each of the four lights up (rim + halo) on their word.',
     '① one glow per word', 'plan sequence')
shot('1.07', 'SCENE', 'The answer', ['birthday', "It's a race", 'Every year, medical'],
     "**★ The world turns.** On **birthday** the years on the place cards are struck through. On **It's a race** the lamp is pulled up out of the frame, the clock lights up like a sunrise and is revealed as a giant at the end of a **running track of four lanes** that runs out from behind the chairs; the four stand up, turn and walk to the start line. Camera rises and pulls back (table becomes the calm foreground).",
     '① lamp up / sunrise ② the family walks', 'plan sequence', star=True)
shot('1.08', 'EXPL', 'Take the country', ['For a hundred', 'three months', 'Like clockwork'],
     'Crane up: the clock as a diagram, title `MONTHS OF LIFE GAINED PER YEAR`, foot `OUR ILLUSTRATION`. Top left `THE COUNTRY THAT DOES BEST · RECORD LIFE EXPECTANCY, WOMEN`, a line of light draws 1840 → 2000 (45 → 85 years, `OEPPEN & VAUPEL · SCIENCE 2002`), `+3 MONTHS A YEAR`; a spark carries the slope into the rim: MEASURED mark `1840–2000 · ≈ 3 MONTHS`. **Like clockwork**: one hard tick of the needle.',
     '① the record line ② the spark', 'plan sequence')
shot('1.09', 'EXPL', 'Now imagine', ['twelve months', 'A full year', 'From that day', 'escape velocity', 'Nobody has reached'],
     'A dashed ghost needle swings 3 → 12; the dashed threshold line draws at 12. Top right, `ONE EXAMPLE`: `THE YEAR 2041 → 2047` ticks while `YEARS STILL AHEAD OF YOU 40` stays (−1 +1 each year). `LONGEVITY / ESCAPE VELOCITY` · `THRESHOLD · NEVER REACHED` · `TERM AFTER AUBREY DE GREY · PLOS BIOLOGY 2004`; on **Nobody has reached it** the ghost falls back.',
     '① ghost needle ② counters', 'plan sequence')
shot('1.10', 'SCENE', 'Whoever is still healthy', ['on that day', 'already be born', 'You may be in it'],
     'Crane down to the lanes: the finish line ("that day") glides from the clock down the track and stops close; the four walk their lanes, the kid furthest, you exactly to the line, the elders shorter and slower. **You may be in it**: your coat lights.',
     '① the finish line ② the walkers', 'plan sequence')
shot('1.11', 'EXPL', "But there's a problem", ['slipped', 'Today it grows', 'two months'],
     'Same view, the clock big over the track: on **slipped** the heavy needle falls 3 → 1.7 (short bounce, settle); MEASURED mark `2004–2024 · ≈ 1.7 MONTHS · MEASURED · RECORD, WOMEN`.',
     '① the needle falls', 'plan sequence')
shot('1.12', 'SCENE', "So it isn't", ['toward twelve', 'moves further away'],
     'On **moves further away** the finish line slides away up the track toward the clock; your light fades.',
     '① the finish line recedes', 'plan sequence')
shot('1.13', 'EXPL', 'For it to turn around', ['has to push', "isn't human", 'pick experiments', 'design molecules', 'read how old'],
     'Fly over the family toward the clock: a hatched **PUSH** wedge (`not a measurement`) grows from 1.7 toward 7; on **isn\'t human** its outer part turns cool (the machine\'s share); three small marks seat in it on their words: a rack of wells, a molecule, a dial gauge on a DNA twist.',
     '① the wedge ② three marks', 'plan sequence')
shot('1.14', 'SCENE', 'But to push on aging', ['you have to know', 'Why does a body'],
     'Labels sink; the camera descends the track to close behind you at the line, the clock huge ahead; card `WHY DO BODIES AGE?`.',
     '① descent', '**SEAM plateYou** (Lead → B1): you from behind, right third; clock (needle 1.7, wedge) · forward')

# ===== c02 · Riddle 1: why bodies age (B1) =========================================================================================
shot('2.01', 'SCENE>EXPL', 'Aging looks like', ['law of nature', "It isn't one"],
     'From plateYou the camera rises over you: your lane, from the start line to you, is a **life line**. On **law of nature** it hardens into a straight rule of light; on **It isn\'t one** it gets a hinge (a visible joint: it can be bent).',
     '① rise ② the rule', 'plan sequence')
shot('2.02', 'EXPL', 'Evolution only had to', ["children's first years", 'stopped looking'],
     'Along the life line: the first stretch (to your first children\'s early years) lit warm; small figures of you and a child near it. On **stopped looking** the light beyond goes out stretch by stretch: nobody checked the rest.',
     '① the lit stretch ② lights out', 'plan sequence')
shot('2.03', 'SCENE>EXPL', 'Evolution pays for your youth', ['pays for your youth', 'sends the bill', 'old age'],
     'A small bill (a slip of light) is written in the lit stretch on **pays for your youth** and slides down the dark line on **sends the bill**, landing at the far end on **old age**.',
     '① the bill travels', 'plan sequence')
shot('2.04', 'SCENE', 'But that bill can be reset', ['reset', 'The proof is you'],
     'The bill folds into a point of light; on **The proof is you** it settles on you (your coat lights). Camera down to the kitchen table (the bench).',
     '① fold ② camera to the table', 'transformation · the point of light becomes the egg on the tabletop · down')
shot('2.05', 'EXPL', 'The egg you grew from', ['before your mother was born', 'decades old', 'started at zero'],
     '**★ Three nested lives on the bench.** A silhouette of the grandmother (light outline) holds a tiny unborn daughter, who holds an even tinier egg: **you**. On **decades old** a counter beside the egg runs up (≈ 25 years: `OLD EGG`); on **started at zero** it snaps to `0` with the one hard accent of the chunk.',
     '① the nesting ② the counter', 'plan sequence', star=True)
shot('2.06', 'EXPL', 'Scientists can read', ['marks on its DNA'],
     'The dial gauge on a DNA twist from 1.13 grows big over the bench: small marks sit on the strand; the gauge reads them (`EPIGENETIC CLOCK`).',
     '① marks appear ② the gauge reads', 'plan sequence')
shot('2.07', 'EXPL', 'In an early embryo', ['goes down', 'ground zero'],
     'A curve of cell age over the first days: it goes down, touches a minimum and rises again; the minimum lights `GROUND ZERO` (`KEREPESI ET AL. · SCIENCE ADVANCES 2021`).',
     '① the curve ② the minimum', 'plan sequence')
shot('2.08', 'EXPL>SCENE', 'So nature has a reset button', ['reset button', 'before you were born'],
     'The minimum of the curve swells into **the reset button** (round, four empty sockets) and presses once by itself (a ring of light runs out).',
     '① becomes the button ② one press', 'plan sequence')
shot('2.09', 'SCENE', 'Which makes the better question', ['not why we age', 'where that button is'],
     'The button stands on the tabletop under the lamp; the card rolls from `WHY DO BODIES AGE?` to `WHERE IS THE BUTTON?`.',
     '① card rolls', 'plan sequence (c03 starts on the same table)')

# ===== c03 · Riddle 2: four proteins (B1) ==========================================================================================
shot('3.01', 'SCENE>EXPL', 'Twenty years ago', ['four proteins', 'factory settings'],
     'Four proteins (four distinct folds, kit `protein`) drift down and seat in the button\'s sockets; beside it a grown cell (flat, with a shape) rounds into a bright plain stem cell: `FACTORY SETTINGS` (`YAMANAKA 2006`).',
     '① proteins seat ② the cell resets', 'plan sequence')
shot('3.02', 'SCENE>EXPL', 'Hold the button down', ['forgets what it was', 'tumors'],
     'The button stays pressed: the cell loses its shape and label, then swells into a lumpy cool-gray cluster on **tumors** (no red, no gore): `IN MICE`.',
     '① press held ② the cell clumps', 'plan sequence')
shot('3.03', 'SCENE>EXPL', "So the trick isn't", ['pressing harder', 'letting go in time'],
     'Press-and-release: short presses; the cell keeps its shape and warms (younger) instead of forgetting itself (`OCAMPO ET AL. · CELL 2016`).',
     '① press · release', 'plan sequence')
shot('3.04', 'EXPL', "There's a window", ['window', 'More pressing'],
     'A small press gauge: a lit window between too little and too much; pushing past it turns the window dark again.',
     '① the window', 'plan sequence')
shot('3.05', 'EXPL', 'Or press only three', ['three of the four', 'glaucoma', 'half the sharpness'],
     'One socket stays empty (3 of 4). A small mouse eye: its sharpness bar, already fallen, climbs back about half way (`LU ET AL. · NATURE 2020 · AFTER GLAUCOMA DAMAGE`).',
     '① empty socket ② the bar climbs', 'plan sequence')
shot('3.06', 'EXPL', 'And this October', ['eighty-year-old', 'under twenty'],
     'A blood cell becomes a nerve stem cell; the gauge reads `80` → `UNDER 20` (`IN A DISH · ONE DONOR · BERG / BRÜSTLE · AGING CELL 2026`).',
     '① the cell changes ② the gauge falls', 'plan sequence')
shot('3.07', 'SCENE', 'All of this was in dishes', ['dishes', 'mice', 'long way'],
     'The bench: the dishes and a small mouse silhouette on the table; camera pulls back over the chairs to the track: from the table to the far finish line is **a long way**.',
     '① pull back', 'plan sequence')
shot('3.08', 'EXPL', 'Four proteins were the first answer', ['other mix', 'how hard'],
     '**The switchboard**: the four sockets multiply into a wide grid of sockets and protein shapes in the sky: which mix? how hard?',
     '① the grid grows', 'plan sequence (c04 continues on the switchboard)')

# ===== c04 · Riddle 3: A.I. at the button (B1) =====================================================================================
shot('4.01', 'EXPL', 'That search is too big', ['people alone', 'artificial intelligence is helping'],
     '**★** The switchboard grows past the frame (thousands of sockets); on **artificial intelligence is helping** a cool light sweeps across it and starts lighting candidates.',
     '① the grid grows ② the cool sweep', 'plan sequence', star=True)
shot('4.02', 'EXPL', 'One company says', ['three thousand mixes', 'Over twenty', 'liver cells'],
     'Counter `3,000+ MIXES TESTED`; on **Over twenty** 20+ sockets turn gold (`OLD LIVER CELLS ACT YOUNGER`), label `COMPANY CLAIM`.',
     '① counter ② gold sockets', 'plan sequence')
shot('4.03', 'EXPL', 'Artificial intelligence, it says', ['doubled'],
     'The sweep runs twice as fast: `×2 DISCOVERY RATE · COMPANY CLAIM`.',
     '① the sweep doubles', 'plan sequence')
shot('4.04', 'EXPL', "That's from the company's own update", ['own update'],
     'Source line `NEWLIMIT · COMPANY UPDATE 2026`; the switchboard folds into a frame of light.',
     '① fold into the frame', 'transformation · the switchboard folds into the footage frame (CLIP_RECT) · centre')
shot('4.05', 'CLIP', '@C1', [],
     '**[CLIP C1]** ORIGINAL FOOTAGE in CLIP_RECT, lower third left (name, role, date from clips.json). The frame stays still (camera float off).',
     '–', 'cut back on the frame · the frame unfolds into the four proteins')
shot('4.06', 'EXPL', 'Artificial intelligence has also redesigned', ['two of the four', 'fifty times'],
     'Two of the four proteins are redrawn in cool light (kit `protein` redraw); a bar beside them: `50× STRONGER SIGNS OF A RESET · IN CELLS`.',
     '① redraw ② the bar', 'plan sequence')
shot('4.07', 'EXPL', 'These numbers come from', ['companies themselves', "hasn't even been published"],
     'Two stamps settle on the numbers: `COMPANY CLAIM` · `NOT PUBLISHED`.',
     '① stamps', 'plan sequence')
shot('4.08', 'EXPL', 'And the clocks', ['machine learning'],
     'The DNA gauge from 2.06 again, its marks read by a cool sweep: `AGE CLOCKS = MACHINE LEARNING`.',
     '① the sweep', 'plan sequence')
shot('4.09', 'SCENE>EXPL', "If one says you're younger", ['estimate, not proof'],
     'The gauge needle settles with a visible wobble band: `AN ESTIMATE`.',
     '① the wobble band', 'move · back to the kitchen table · down')
shot('4.10', 'SCENE', 'So has anyone pressed', ['inside a living person'],
     'The kitchen table under the lamp: the drop from 1.05 still glows on the tabletop; camera pushes to it, the eye rises out of the table again.',
     '① push ② the eye rises', '**SEAM plateEye** (B1 → B2): the eye on the table, risen, open · centre')

# ===== c05 · The first eye (B2) ====================================================================================================
shot('5.01', 'SCENE', 'Yes. Earlier this year', ['in an eye'],
     'From plateEye: the eye under the lamp, the family at the table edges looking.',
     '① breathing push', 'plan sequence')
shot('5.02', 'EXPL', "It's the treatment from the start", ['three of the four', 'one injection'],
     'Beside the eye the button with three seated proteins; one drop of light leaves it and falls into the eye (**one injection**).',
     '① the button ② the drop', 'plan sequence')
shot('5.03', 'SCENE>EXPL', 'The first results come', ['three people', 'glaucoma'],
     'The eye slides left; two more eyes rise from the tabletop beside it: three eyes in a row (`3 PEOPLE · GLAUCOMA`).',
     '① two eyes rise', 'plan sequence')
shot('5.04', 'EXPL', 'In October', ['eight weeks', 'no serious side effects'],
     'A thin time line under the eyes runs to `DAY 56`; `NO SERIOUS SIDE EFFECTS · COMPANY REPORT, 8 OCT 2026`.',
     '① the time line', 'plan sequence')
shot('5.05', 'EXPL', 'And in two of the three', ['visual field improved'],
     'Above each eye a small visual-field grid; in two of the three, some cells of the grid turn bright.',
     '① two grids brighten', 'transformation · the eyes sink; the card rises from the tabletop · up')
shot('5.06', 'CARD', '@Q1', [],
     '**[QUOTE CARD Q1]** kit `quoteCard`: `Preliminary observations. Built to test safety, not whether it works.` · `LIFE BIOSCIENCES · FIRST DATA IN PEOPLE · 8 OCT 2026` (no voice).',
     '① lines rise', 'the card sinks into the table · down')
shot('5.07', 'EXPL', 'Three people. One eye each', ['No control group'],
     'Three eyes; a fourth place beside them stays a dashed outline: `NO CONTROL GROUP`.',
     '① the dashed place', 'move · the camera rises to the clock · up')
shot('5.08', 'EXPL', "Three eyes don't move the needle", ['needle', 'odds'],
     'The clock: the needle stays at 1.7 (heavy, unmoved); only the hatched PUSH wedge grows one step on **odds**.',
     '① the wedge grows', 'plan sequence')
shot('5.09', 'EXPL', 'And the trial goes on', ['higher dose'],
     'A small dose step beside the clock climbs from 1 to 2 (`SAFETY BOARD: NEXT DOSE`).',
     '① the step', 'plan sequence')
shot('5.10', 'SCENE', 'Aging is turning', ['fate', 'target'],
     '**★** The bent shadow from 1.03 appears once more on the clock face, then on **target** it pulls together into a ring: a target on the face.',
     '① shadow → ring', 'plan sequence', star=True)

# ===== c06 · The easy start · one thread (B2) =====================================================================================
shot('6.01', 'SCENE>EXPL', 'The eye was the easy start', ['small and sealed off'],
     'A standing body of light (your silhouette, big, over the table): the eye lights as a small sealed sphere.',
     '① the body draws ② the eye lights', 'plan sequence')
shot('6.02', 'EXPL', 'Next, the liver', ['first human trial', 'twenty twenty-seven'],
     'The liver lights inside the body; `FIRST HUMAN TRIAL PLANNED · 2027 · A PLAN, NOT DATA`.',
     '① the liver lights', 'transformation · the liver light becomes the footage frame · centre')
shot('6.03', 'CLIP', '@C2', [],
     '**[CLIP C2]** ORIGINAL FOOTAGE in CLIP_RECT, lower third left.',
     '–', 'cut back · the body of light again')
shot('6.04', 'EXPL', 'But what about everything else', ['goes wrong with age'],
     'The rest of the body dims, four places in it flicker.',
     '① four flickers', 'plan sequence')
shot('6.05', 'EXPL', 'Cancer. Heart disease', ['Cancer', 'Heart disease', 'Dementia', 'Diabetes', 'four different wards'],
     'Four **ward lamps** (kit `wards`) lower into the sky one per word, each on its own thread, each labelled, far apart.',
     '① one lamp per word', 'plan sequence')
shot('6.06', 'EXPL', 'They share their biggest risk', ['risk factor', 'how old you are'],
     'The four threads run up and meet in one knot: `AGE`.',
     '① threads join', 'plan sequence')
shot('6.07', 'EXPL', 'So all four hang', ['same thread', 'the bet goes', 'all of them at once'],
     '**★** The thread is pulled: all four lamps rise together. `THE BET` small.',
     '① the pull', 'plan sequence', star=True)

# ===== c07 · A.I. at the illnesses · the skeptic (B2) ==============================================================================
shot('7.01', 'EXPL', 'Artificial intelligence is coming at', ['shapes of proteins'],
     'Cool protein shapes fold in front of each ward lamp.',
     '① shapes fold', 'transformation · the card rises in front of the lamps · centre')
shot('7.02', 'CARD', '@Q2', [],
     '**[QUOTE CARD Q2]** `Scott Pelley: "The end of disease?" — Demis Hassabis: "I think that\'s within reach."` · `60 MINUTES, CBS, 20 APRIL 2025` (text only, CBS: no clip).',
     '① lines rise', 'the card sinks · the lamps again')
shot('7.03', 'EXPL', 'But nine in ten', ['nine in ten', 'still fail'],
     'Ten small lights in a row under the lamps; nine go dark on **still fail** (`SUN ET AL. 2022`).',
     '① nine go dark', 'plan sequence')
shot('7.04', 'EXPL', 'And even if they all worked', ["wouldn't be enough"],
     'All four ward lamps go out (cured); the knot `AGE` and its thread still glow.',
     '① lamps out', 'plan sequence')
shot('7.05', 'EXPL', 'Decades ago', ['did the math', 'eighty-five'],
     'A bar of life expectancy rises and stops under a line at `85` (`OLSHANSKY ET AL. · SCIENCE 1990 · U.S.`).',
     '① the bar', 'plan sequence')
shot('7.06', 'SCENE>EXPL', 'The thread would still be there', ['thread'],
     'Only the thread `AGE` remains, swinging slightly.',
     '① the thread', 'move · up to the clock · up')
shot('7.07', 'EXPL', 'So does the needle', ['reach twelve'],
     'The clock: needle at 1.7, the dashed 12 far away.',
     '① breathing push', 'plan sequence')
shot('7.08', 'EXPL', 'That skeptic has run', ["doesn't see the needle turning"],
     'The needle stays; a frame opens beside the clock.',
     '① the frame opens', 'the frame becomes CLIP_RECT · centre')
shot('7.09', 'CLIP', '@C3', [],
     '**[CLIP C3]** ORIGINAL FOOTAGE: S. Jay Olshansky, lower third left.',
     '–', 'cut back on the frame · it folds into lines')
shot('7.10', 'EXPL', 'He studied the longest-lived', ['three decades', 'more slowly'],
     'Lines of life expectancy (the longest-lived places) rise and flatten (`OLSHANSKY ET AL. · NATURE AGING 2024`).',
     '① lines flatten', 'plan sequence')
shot('7.11', 'EXPL', 'His verdict', ['implausible', 'Unless'],
     '`IMPLAUSIBLE THIS CENTURY` sets; on **Unless** the word `UNLESS` lights gold under it.',
     '① verdict ② unless', 'plan sequence')
shot('7.12', 'EXPL', 'That “unless”', ['button', 'search', 'eye'],
     'Three small icons on their words (the button · the switchboard · the eye) slide into the word `UNLESS`.',
     '① three icons', 'plan sequence')
shot('7.13', 'EXPL>SCENE', 'In his own words', ['glass ceiling', 'brick wall', 'more of this research'],
     '**★** Over the needle path a thin pane of glass (clear, a glint) — not a wall; on **more of this research** the PUSH wedge touches the pane. Camera pulls back to the track.',
     '① the pane ② pull back', '**SEAM plateTrack** (B2 → B3): the wide track to the clock, needle 1.7 · forward', star=True)

# ===== c08 · The band · the price tag (B3) =========================================================================================
shot('8.01', 'EXPL', "The optimists' estimates", ['twenty thirty', 'twenty fifty', 'Estimates, not studies'],
     'Calendar marks rise along the left edge of the track (`2030 · 2040 · 2050`); three small estimate pins land between them; `ESTIMATES · NOT STUDIES`.',
     '① marks ② pins', 'plan sequence')
shot('8.02', 'EXPL', 'So that day', ['one date', 'few decades'],
     '**★** The finish line smears into a soft luminous **band** across the lanes from 2030 to 2050 (kit `track` band).',
     '① line → band', 'plan sequence', star=True)
shot('8.03', 'SCENE', 'Which changes the question', ['not just when', 'who gets there in time'],
     'The four in their lanes before the band; card `WHO GETS THERE IN TIME?` returns.',
     '① card', 'plan sequence')
shot('8.04', 'EXPL', 'That treatment in the eye', ['gene therapy', 'four and a quarter million'],
     'A small eye-and-drop mark; counter `$4,250,000` (`HIGHEST U.S. LIST PRICE · LENMELDY 2024`).',
     '① counter', 'plan sequence')
shot('8.05', 'SCENE>EXPL', 'So for most of the world', ['birth year', 'price tag'],
     'A **flat price label** (not a hanging tag) lies down across the band on the track; most lanes stop at it.',
     '① the label lies down', 'plan sequence')

# ===== c09 · Not a cake · how fast the price falls (B3) ============================================================================
shot('9.01', 'SCENE>EXPL', 'Nobody has to lose', ['cake'],
     'A year does not move from one lane to another (a dashed transfer arrow is crossed out): `NOT A CAKE`.',
     '① the arrow', 'plan sequence')
shot('9.02', 'EXPL', "The question isn't who goes without", ['how fast the price falls'],
     'A price curve in the sky over the track falls over years.',
     '① the curve', 'plan sequence')
shot('9.03', 'EXPL', 'In nineteen twenty-three', ['insulin', 'one dollar'],
     'A patent paper of light; `$1` stamps on it (`INSULIN PATENT · UNIVERSITY OF TORONTO · 1923`).',
     '① the stamp', 'plan sequence')
shot('9.04', 'EXPL', 'A generation later', ['polio vaccine'],
     'A second paper: the patent line stays empty.',
     '① empty line', 'transformation · the paper becomes the quote card · centre')
shot('9.05', 'CARD', '@Q3', [],
     '**[QUOTE CARD Q3]** `"Well, the people, I would say. There is no patent. Could you patent the sun?"` · `JONAS SALK · SEE IT NOW, CBS, 12 APRIL 1955` (text only).',
     '① lines rise', 'the card sinks · down to the track')

# ===== c10 · Four decisions (B3) ===================================================================================================
shot('10.01', 'SCENE>EXPL', 'Both were decisions', ['four kinds of decisions'],
     'Beside the price label four levers rise from the ground.',
     '① four levers', 'plan sequence')
shot('10.02', 'SCENE>EXPL', 'One: pool the patents', ['sixty billion doses'],
     'Lever 1 pulls; the label drops a step; `62 BILLION DOSES · 148 COUNTRIES · MEDICINES PATENT POOL`.',
     '① pull ② counter', 'plan sequence')
shot('10.03', 'EXPL', 'Two: pay one flat fee', ['Louisiana', 'rose sharply'],
     'Lever 2; a bar of treatments rises (`LOUISIANA · HEPATITIS C · FLAT FEE SINCE 2019 · NBER`).',
     '① pull ② bar', 'plan sequence')
shot('10.04', 'EXPL', 'Three: let other makers', ['Egypt', 'under a hundred dollars'],
     'Lever 3; a price counter falls under `$100` (`EGYPT · HEPATITIS C`).',
     '① pull ② counter', 'plan sequence')
shot('10.05', 'EXPL', 'Four: negotiate for everyone', ['Thirty-three American states', 'pay back'],
     'Lever 4; 33 small lights gather into one; `PAY BACK IF IT FAILS` (`CMS · CELL & GENE THERAPY ACCESS MODEL`).',
     '① pull ② the gathering', 'plan sequence')
shot('10.06', 'SCENE>EXPL', 'Two more ideas', ['regulators accept', 'money it needs'],
     'Two empty lever slots (dashed) beside the four.',
     '① slots', 'plan sequence')
shot('10.07', 'SCENE>EXPL', 'And public research money', ['promise of access', 'almost never does'],
     'The second slot: a dashed promise line that does not close.',
     '① the line', 'plan sequence')

# ===== c11 · Ending + end screen (B3) ==============================================================================================
shot('11.01', 'SCENE', 'None of this has ever', ['rejuvenation therapy'],
     'Wide track at first light (the only warmer palette of the film): the label on the band, the levers.',
     '① slow pull back', 'plan sequence')
shot('11.02', 'SCENE', 'But none of it needs', ['discovery', 'decision'],
     '**★** On **decision** the price label lifts off the band.',
     '① the label lifts', 'plan sequence', star=True)
shot('11.03', 'SCENE', 'So think of your family', ['one more time'],
     'The four in their lanes, close to each other, before the band.',
     '① push', 'plan sequence')
shot('11.04', 'SCENE', 'Research decides', ['when that day comes', 'who gets there in time'],
     'On **when** the clock\'s needle trembles; on **who gets there in time** all four lanes light to the band.',
     '① the needle ② the lanes', 'plan sequence')
shot('11.05', 'SCENE', 'The first generation that', ['birth year', 'decision'],
     'The four step into the band together.',
     '① the step', 'plan sequence → end screen')

ENDSCREEN = ('11.06', 'SCENE', 'End screen (VO end → film end, ≈ 15 s, no voice). The track at first light, slow pull back and rise; the four small in the band, the clock low and warm. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload), calm sky there; subscribe space centre x 810–1110, y 330–600. Never static.', '① pull back ② breathing')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')
def vo_end(): return max(w['e'] for w in WS)
def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])
LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5, 'CLIP': 0, 'CARD': 1}

def resolve():
    chunk_start, last = {}, -1.0
    for c in CHUNKS:
        t0 = 0.0 if c[0] == 'c01' else gfind(c[3], last)
        chunk_start[c[0]] = t0; last = t0
    last = -1.0
    for sh in S:
        t = 0.0 if sh['id'] == '1.01' else gfind(sh['start'], last)
        sh['t'] = t; last = t
        sh['at'] = [(a, gfind(a, t - .01)) for a in sh['anchors']]
    for i, sh in enumerate(S):
        sh['t1'] = S[i + 1]['t'] if i + 1 < len(S) else vo_end()
    return chunk_start

def main():
    cs = resolve()
    dur = TM['duration']
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = ['| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |', '|---|---|---|---|---|---|---|---|']
    tot = {'B1': 0, 'B2': 0, 'B3': 0, 'Lead': 0}; allx = [0, 0]
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
        allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (B3 includes the ≈ 15 s end screen). '
               f'**Infographic share (VO part, clips/cards included):** {round(100 * allx[0] / allx[1])}% (mixed shots count half, clips 0, cards 1; target 60–70 %). '
               f'Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL)" if TM.get("provisional") else ""}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out += ['', f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / span)}%', f'Light/hero: {c[4]}', '',
                '| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |', '|---|---|---|---|---|---|---|']
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at']) or f'`{s["start"]}` slot'
            sid = f'**{s["id"]} ★**' if s['star'] else s['id']
            out.append(f'| {sid} | [{s["layer"]}] | {ff(s["t"])}–{ff(s["t1"])} | {an} | {s["pic"]} | {s["moves"]} | {s["tr"]} |')
        if c[0] == 'c11':
            e = ENDSCREEN
            out.append(f'| {e[0]} | [{e[1]}] | {ff(vo_end())}–{ff(dur)} | – | {e[2]} | {e[3]} | – |')
    md = '\n'.join(out)
    print('\n'.join(out[:len(CHUNKS) + 4]))
    if '--md' in sys.argv:
        p = sys.argv[sys.argv.index('--md') + 1]
        doc = open(p).read() if os.path.exists(p) else '<!-- SHOTS:BEGIN -->\n<!-- SHOTS:END -->\n'
        a, b = doc.index('<!-- SHOTS:BEGIN -->'), doc.index('<!-- SHOTS:END -->')
        open(p, 'w').write(doc[:a] + '<!-- SHOTS:BEGIN -->\n' + md + '\n\n' + doc[b:])
        print('wrote', p)

if __name__ == '__main__':
    main()
