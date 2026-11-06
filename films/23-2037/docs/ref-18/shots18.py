#!/usr/bin/env python3
"""Film 18 shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film order), never to a second.
  python3 tools/shots18.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (2.5D world) · EXPL (explainer graphic: light on night) · SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; anchors are searched
after the shot start. The scene code uses the same phrases: T.G(phrase, 0, after)."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-kapitalismus/audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def gfind(phrase, after=-1.0, nth=0):
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
    ('c01', 'Lead', 'Hook · the engine (two price tags, the circle) · what you are paid for: thinking', 'A.I. will end capitalism', 'Night board · hero: the giant price tag over you → the loop of light (the circle) → your tag cools in the machine light'),
    ('c02', 'B1', 'The price of thinking falls · the crash story (Gawdat) · the pressure (two records)', 'At the end of', 'The sky as explainer: the tag rides the falling price line to the zero line → the loop goes dark → the two coins (the first picture)'),
    ('c03', 'B1', 'The real ending is the price · air · where does the money go · Britannica, music: onto the door', "But that's not the real ending", 'Board: the sky fills with evaporated prices (air) → the shelf of light → the record → THE FIRST DOOR'),
    ('c04', 'B1', 'Thinking is next: words, advice, everything built from thinking · Chegg · Canva · the price left', 'Now the same thing is reaching', 'Board: a wave of sinking tags round the loop → two value lines in the sky → the empty hook'),
    ('c05', 'B2', 'The value stays ($17,000) · value looks for a door · the doors: ground, power, chips (Altman)', 'And the value', 'Board: the column of value without a tag → its light runs down the road → the three doors at the far corners'),
    ('c06', 'B2', 'What scarcity pays: Nvidia · Loudoun County · the oldest door: the land under your house', 'Nvidia', 'The chip door (counter, ¾ coin) → the field of data-centre roofs → your house door → section: the dirt glows'),
    ('c07', 'B2', 'The first picture again · not a crash: you pay at the door · the ground the machine stands on', 'Now look at the first picture', 'The two coins again → wide: a free plain, three tall doors → you pay at each door → the ground under the data centre'),
    ('c08', 'B2', 'A set of rules: the board revealed · Lizzie Magie · Henry George · two sets of rules', "That isn't a law of nature", 'The rise: the world is a board on a table → the patent drawing (gold lines) → the two rule cards'),
    ('c09', 'B3', 'Rules II: the free layer (GPS, roads) · land first (Baden-Württemberg)', 'The second set of rules', 'Board: the road lights for everybody (free layer), satellites over it → the ground in the middle → section land vs building'),
    ('c10', 'B3', 'Housing (Vienna) · energy (Middelgrunden) · who owns the door in Virginia · you can vote', 'Housing', 'Vienna block, ⅔ windows warm → the sea edge: the arc of turbines, the shared door → the zoning room, your raised hand'),
    ('c11', 'B3', 'Ending: one price at a time · something to design · your move + end screen', "Capitalism won't end with a crash", 'The board at first light · you draw a new road · your move: one step onto the next field'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook + the engine + thinking (Lead) ====================================================================================
shot('1.01', 'SCENE', 'A.I. will end capitalism', ['capitalism', 'hundred years', 'lifetime', 'the way you think'],
     '**[THE BOARD · opening image]** Night. A dark plain runs to a faint cream horizon (the zero line). Over **you** (tiny, yellow raincoat) hangs a **giant price tag of light** on a thread from the dark (the hero). Low camera, close to the tag. On **capitalism** the tag swells and swings once. On **lifetime** you lift your head. On **the way you think** a thin stream of gold dust rises from the tag\'s lower edge (the first price becoming air; nothing explains it yet).',
     '① slow push ② the tag swings / dust', 'plan sequence', star=False)
shot('1.02', 'SCENE', 'Capitalism, in one sentence', ['pays you', 'make something', 'sells it', 'more than'],
     'Pull back and up: the plain is a world with a **road of light** running in a loop; a workshop (lit window) on the left, a shop (lit display) on the right. On **pays you** a **coin of light** rolls from the workshop along the road to you; on **make something** a small cube of light grows in your hands; on **sells it** the cube rides the road to the shop window.',
     '① pull back ② coin, then cube', 'plan sequence')
shot('1.03', 'SCENE>EXPL', 'Your work has a price', ['Your work', 'What you make', 'gap', 'profit'],
     'On **Your work** the tag over you prints `$1`. On **What you make** a second tag lowers on its thread over the shop and prints `$2`. On **gap** a gold rule draws a bracket between the two tag bottoms; `PROFIT` rises inside it.',
     '① tag A prints ② tag B lowers, the bracket', 'plan sequence')
shot('1.04', 'SCENE', "That's the whole engine", ['whole engine'],
     '**★ The circle.** The coin leaves the shop and runs the **whole loop** (far side and back to the workshop, then to you); the road lights behind it all the way round: the engine of capitalism as one ring of light, the two tags hanging over it like lanterns. Widest, calmest picture of the chunk.',
     '① the coin runs the loop ② camera rises', 'plan sequence', star=True)
shot('1.05', 'SCENE', 'Now watch what A.I.', ['A.I.', 'one of those prices'],
     'The machine appears as light, never as a robot: a small **cold blue-cream disc** rises above the zero line on the right. On **one of those prices** its cool light reaches your tag `$1`: the tag\'s edge cools.',
     '① the cold disc rises ② push toward you', 'plan sequence')
shot('1.06', 'SCENE', 'Think about what you actually get paid for', ['email', 'contract', 'mistake', 'customer'],
     'Close on you under your tag. One small light card rises from your hands per sentence, on its word, and settles in an arc beside you: an **envelope** (email), a **page with a signature line** (contract), **a line with one word ringed in gold** (mistake), a **speech bubble** toward a customer (indigo silhouette) who stands to your right.',
     '① one card per word', 'plan sequence')
shot('1.07', 'SCENE', 'Most of it is thinking', ['thinking', 'cheap', 'Fast'],
     'On **thinking** the four cards fold into one warm point of light above your hand (a thought) and its thread runs up to your tag: the tag hangs on the thought. On **cheap** the tag cools further and `$1` sinks off its face; on **Fast.** one drop of light runs off its lower edge (the only hard accent). Push into the tag.',
     '① cards → thought ② the tag cools, push', '**SEAM plateTag** (Lead → B1): your tag, close, cool, empty face · centre · forward')

# ===== c02 · The price falls · the crash story · the pressure (B1) =================================================================
shot('2.01', 'EXPL', 'At the end of', ['twenty dollars', "eight novels", 'Two years later', 'seven cents'],
     'From plateTag: the tag hangs high left in the sky over the board; on **twenty dollars** it prints `$20` (dark ink). Its thread bends into a **falling price line** across the sky down to the zero line. On **Two years later** the tag slides down the line, the number counting down; it lands at `7¢` on **seven cents**. Small: `GPT-3.5-LEVEL A.I. · PRICE PER 1M TOKENS (≈ 8 NOVELS)` · `NOV 2022` / `OCT 2024` · `STANFORD AI INDEX 2025`.',
     '① $20 prints ② the tag rides down', 'plan sequence')
shot('2.02', 'EXPL', 'And it keeps falling', ['thirteen times', 'year after year'],
     'The line steps on to the right toward the zero line; on **thirteen times** `≈ 13× CHEAPER A YEAR` rises under it (`EPOCH AI · 3-YEAR AVERAGE`). The tag shrinks a step on **year after year** and almost touches the zero line.',
     '① the line steps on', 'transformation · the price line sinks into the zero line; tilt down to the loop · down')
shot('2.03', 'SCENE', 'Most people hear that', ['takes my job', 'paycheck', 'buys anything', 'collapses'],
     'The **crash story** on the loop from 1.04 (the version everybody tells): on **takes my job** the workshop window goes dark; on **paycheck** the coin stops; on **buys anything** the shop window dims; on **collapses** the road\'s light runs out round the loop. No explosion, no red.',
     '① stations go dark one by one', 'plan sequence')
shot('2.04', 'EXPL', 'A former Google executive', ['Mo Gawdat', 'for a dollar', 'for two', 'disappear'],
     '**Quote card** in the sky over the dark loop (≥ 4 s, the voice runs on): "The very base of capitalism … to hire you for a dollar and then sell what you make for two … is going to disappear." · `MO GAWDAT · FORMER GOOGLE X · BUSINESS INSIDER, 2025`. On **for a dollar** / **for two** the phrases warm and the `$1` / `$2` tags from 1.03 glow faintly on the board below (callback).',
     '① lines rise ② two phrases warm', 'transformation · the card sinks; the stopped coin rises into the sky and splits into two coins · up')
shot('2.05', 'EXPL', 'And you can already see the pressure', ['Between April and June', 'more profit', 'two thousand nine', 'smallest slice', 'nineteen forty-seven'],
     '**THE FIRST PICTURE (`f18_kit.firstPicture`, exactly this composition again in 7.01).** Two coins of light: left the **profit slice of every sales dollar** grows on **more profit** to `17.0 %`, `HIGHEST SINCE 2009` on **two thousand nine** (`S&P 500 · FACTSET`); right **your slice of what business produced** narrows on **smallest slice** to `52.8 %`, `LOWEST SINCE 1947` (`U.S. BUSINESS SECTOR · BLS`). Two coins, never one pie (different measures).',
     '① left coin ② right coin', 'plan sequence')
shot('2.06', 'EXPL', 'Bigger profits', ['Bigger profits', 'Smaller slice', 'Same three months'],
     'On **Bigger profits** the left slice glows; on **Smaller slice for you** the right slice dims and you (tiny, on the board below the coins) look up; on **Same three months** one line rises between them: `SAME THREE MONTHS · APRIL–JUNE 2026`.',
     '① slices ② the date line', 'tilt down · carrier the coins sink back into the loop as the one coin · down')

# ===== c03 · The price · air · Britannica, music → the door (B1) ===================================================================
shot('3.01', 'SCENE', "But that's not the real ending", ['real ending', 'the price'],
     'Back on the board, the coin at rest on the loop; on **the price** the camera finds your tag again (cool, empty face) and it swings into the centre.',
     '① tilt down ② the tag swings', 'plan sequence')
shot('3.02', 'SCENE', 'Capitalism can only make money', ['scarce', 'air', 'plenty'],
     'On **scarce** a few tags over the board glow; on **air** a small tag drifts down out of the sky over you, its thread finds nothing to hang on and it slips away; on **plenty** the air shimmers (fine dust everywhere, you breathe: your shoulders rise).',
     '① a tag slips off the air', 'plan sequence')
shot('3.03', 'SCENE', 'Now imagine thinking becomes', ['plentiful as air', 'cheaper', 'nothing left'],
     '**★ Prices become air.** The thought above your hand (1.07) multiplies into thousands of points that rise and fill the sky like air. On **cheaper, and cheaper** the tags over the board slide down their threads one after another toward the zero line; on **nothing left** they touch it and evaporate upward: the stars are the prices that left. Camera rises to the widest picture.',
     '① the tags sink in a wave ② camera rises', 'plan sequence', star=True)
shot('3.04', 'SCENE', 'A system built on charging', ['runs out'],
     'Wide: the loop with almost no tags. The coin still rolls, but at each place it finds nothing to stop for; on **runs out** it slows.',
     '① the coin slows', 'plan sequence')
shot('3.05', 'SCENE', 'So where does the money go', ['money go', 'still gets paid', 'leave you'],
     'Three questions, three small beats: the coin stops in the middle of the road (**money go**); the last threads in the sky tremble (**still gets paid**); you turn and look up (**leave you**).',
     '① coin stops ② you look up', 'move · the camera travels along the road to an older field · right')
shot('3.06', 'SCENE', "We've watched a price hit zero", ['hit zero', 'same question'],
     'An older field on the loop: a tall **shelf of encyclopedia volumes** (gold spines of light), a heavy tag over it.',
     '① camera travel', 'plan sequence')
shot('3.07', 'EXPL', 'In nineteen ninety', ['hundred and twenty thousand', 'price of a fact', 'presses stopped', 'two hundred and forty-four'],
     '`BRITANNICA · 1990` and the counter `120,000 SETS` rise over the shelf. On **price of a fact** the tag slides down to the zero line; on **presses stopped** the spines go dark one by one; `1768 – 2012` on **two hundred and forty-four**.',
     '① counter ② spines go dark', 'plan sequence')
shot('3.08', 'EXPL', 'Wikipedia runs on', ['hundred and ninety million', 'free to you'],
     'Pages lift off the dark shelf and rise into the air as countless points of light; `WIKIPEDIA · ≈ $190M A YEAR` on the number, `FREE TO YOU` on **free to you** (`WIKIMEDIA 2025`).',
     '① pages rise', 'move · along the road to the next field · right')
shot('3.09', 'EXPL', 'Music:', ['song hit zero', 'more than half', 'subscription'],
     'A **record of light** (a disc) with its tag. On **song hit zero** the tag sinks; a line in the sky above it: `U.S. MUSIC · $14.6B (1999) → $7.0B (2014)` falls by more than half on **more than half**, then climbs again as a dotted line on **subscription** (`RIAA`).',
     '① the tag sinks ② the line falls and climbs', 'plan sequence')
shot('3.10', 'SCENE', "The price didn't die", ['moved', 'off the song', 'onto the door'],
     '**The first door.** On **moved** the record\'s tag lifts off its thread and travels along the road; behind the record field a **door of light** rises from the board (`f18_kit.door`); on **onto the door** the tag hangs itself on the door: the price moved, it did not die. Hold on the door.',
     '① the tag travels ② the door rises', 'move · back along the road to your field · left')

# ===== c04 · Thinking is next · Chegg · Canva · the price left (B1) ================================================================
shot('4.01', 'SCENE', 'Now the same thing is reaching', ['reaching thinking'],
     'Back at your field: your cool tag over you; behind you along the road a row of small fields, each with a tag.',
     '① camera travel', 'plan sequence')
shot('4.02', 'SCENE', 'First words and code', ['draft', 'summary', 'bug fix', 'cents'],
     'Three small light cards on the near fields (a page, a short page, a line of code with a bracket); their tags slide down one after another on **draft**, **summary**, **bug fix** and print `¢` on **cents**.',
     '① three tags sink in turn', 'plan sequence')
shot('4.03', 'SCENE', 'Then advice', ['second opinion', 'scan', 'lease'],
     'Two bigger fields further along: a dark scan film with one bright round shape (**scan**) and a lease page (**lease**); their tags sink.',
     '① two tags sink', 'plan sequence')
shot('4.04', 'SCENE', 'Then everything built out of thinking', ['drug', 'bridge', 'lesson'],
     '**★** Pull back: big fields round the far side of the loop: a capsule, a bridge silhouette, a school board, each under a huge tag; on each word the tag starts to sink: a wave of falling prices runs round the circle.',
     '① the wave ② pull back', 'plan sequence', star=True)
shot('4.05', 'EXPL', 'Chegg sold homework help', ['Chegg', 'ninety-nine percent', 'half its staff', 'named A.I.'],
     'A field with the word `CHEGG` (type only, no logo): its value as a line in the sky falls on **ninety-nine percent**: `−99 % SINCE 2021`. On **half its staff** a row of 20 lit desks beside it, 9 go dark: `−45 % STAFF · OCT 2025`; on **named A.I.** a small line `A.I. NAMED AS A REASON` (`CNBC`).',
     '① the line falls ② desks go dark', 'plan sequence')
shot('4.06', 'EXPL', 'Canva made design cheap', ['Canva', 'growth slowdown', "isn't taking those jobs", 'either way'],
     'A field with `CANVA` (type only): a rising growth line with a small bend on **growth slowdown**: `JOB CUTS · FIRST GROWTH SLOWDOWN IN 10 YEARS · NOV 2026`; on **isn\'t taking those jobs** a small line `CANVA: NOT REPLACED BY A.I.`; on **either way** the design tag over the field still sinks.',
     '① the dip ② the tag sinks', 'plan sequence')
shot('4.07', 'SCENE', 'The people who built those products', ["didn't fail", 'price left'],
     'Small silhouettes at the Chegg and Canva fields stay lit (**didn\'t fail**). On **price left** the tags lift off their threads and drift away along the road; the camera pushes up to one empty hook over the field.',
     '① tags leave ② push to the hook', '**SEAM plateHook** (B1 → B2): the empty hook over a column of light · centre · forward')

# ===== c05 · The value stays · the doors (B2) =====================================================================================
shot('5.01', 'SCENE', 'And the value', ['value', 'search engines', 'nothing'],
     'From plateHook: pull back; the column of warm light under the empty hook stands on your field: the **value**. On **search engines** a long search bar of light (a magnifier glyph, no logo) grows across the column; no tag.',
     '① pull back ② the bar grows', 'plan sequence')
shot('5.02', 'EXPL', 'The typical answer', ['seventeen thousand'],
     'The column rises on **seventeen thousand**: `$17,000 A YEAR` (`PNAS 2019`, median, to give up search engines).',
     '① the column rises', 'plan sequence')
shot('5.03', 'SCENE', 'The price vanished', ['vanished', 'value stayed'],
     'Two things side by side: the empty hook (**vanished**) and the tall column (**value stayed**). Breathing hold.',
     '① hold', 'plan sequence')
shot('5.04', 'SCENE', 'Value with no price goes looking for a door', ['door', 'Music found one', 'retreats', 'behind the doors'],
     'The column\'s light pours down onto the road and runs along it like water; it passes the record field, whose door (3.10) glows (**Music found one**); on **retreats** the coin rolls along and slips through the door; on **behind the doors** the door swings half shut.',
     '① the light runs ② the coin goes through', 'plan sequence')
shot('5.05', 'SCENE', 'If you want to follow it', ['subscribe'],
     'You step after it to the door and look back (subtle; no logos, no buttons).',
     '① you walk', 'plan sequence')
shot('5.06', 'SCENE', 'Watch where it goes', ['where it goes'],
     'The camera follows the light round the corner of the loop.',
     '① camera follows', 'plan sequence')
shot('5.07', 'SCENE', 'The doors are the things', ["can't be copied", 'The ground', 'The power', 'The chips'],
     '**★ The three doors.** At the far corners of the loop three tall doors of light rise, one per word: a door on a field of bare earth (**The ground**), a door under a power line / a turbine (**The power**), a door set into a chip-shaped block (**The chips**). Each takes a heavy tag.',
     '① three doors in turn ② slow pull back', 'plan sequence', star=True)
shot('5.08', 'EXPL', 'Sam Altman', ['Sam Altman', 'cost of intelligence', 'electricity'],
     '**Quote card** over the doors (≥ 4 s): "the cost of intelligence should eventually converge to near the cost of electricity." · `SAM ALTMAN · "THE GENTLE SINGULARITY", 2025`; "near the cost of electricity" warms on **electricity**.',
     '① lines rise', 'transformation · the card sinks into a bill of light · down')
shot('5.09', 'EXPL', 'Read it from the other side', ['the bill', 'The power', 'The chips', 'The ground under'],
     'A **bill** (receipt of light) unrolls: `THINKING ……… ≈ 0` sits dim; on each word the line `POWER`, `CHIPS`, `GROUND` lights and its door behind glows.',
     '① the bill lines light', 'transformation · the CHIPS line → the chip door · up')

# ===== c06 · What scarcity pays · the land under your house (B2) ===================================================================
shot('6.01', 'EXPL', 'Nvidia', ['Nvidia', 'ninety-six billion', 'single quarter'],
     'The chip door close; above it `NVIDIA` (type only) and the counter `$96.2B` on **ninety-six billion**, `ONE QUARTER · TO JULY 2026` (`NVIDIA`).',
     '① counter', 'plan sequence')
shot('6.02', 'EXPL', 'It kept three quarters', ['three quarters', 'gross profit'],
     'A coin of light with three quarters lit on **three quarters**: `75 % GROSS MARGIN`.',
     '① the coin fills', 'plan sequence')
shot('6.03', 'SCENE', "That isn't villainy", ['villainy', 'scarcity pays'],
     'No villain: the door is just a door; on **scarcity pays** the coin rolls through it and the tag glows.',
     '① the coin rolls in', 'move · along the road to the ground door · left')
shot('6.04', 'SCENE', 'Loudoun County', ['Loudoun', 'biggest cluster', 'two to six million'],
     'At the ground door: the field covered with flat **data-centre roofs** (rows of cool rectangles, small blinking lights). `LOUDOUN COUNTY, VIRGINIA`; on **two to six million** the counter `$2–6 MILLION AN ACRE` (`LOUDOUN COUNTY`).',
     '① roofs spread ② counter', 'move · along the road to your house · left')
shot('6.05', 'SCENE', 'The oldest door', ['oldest door', 'every month'],
     'Your house on the board, its front door with a monthly tag; on **every month** the tag swings once.',
     '① the tag swings', 'transformation · the ground under the house opens as a section · down')
shot('6.06', 'EXPL', 'Across fourteen rich countries', ['fourteen', 'eighty percent', 'land underneath', 'Not the bricks', 'The dirt'],
     '**★ Section through your house.** House above, a layer of earth below. On **eighty percent** most of the price glows in the earth: `80 % OF THE RISE IN HOUSE PRICES` (`14 COUNTRIES · SINCE 1950 · KNOLL, SCHULARICK & STEGER 2017`); on **Not the bricks** the house lifts off; on **The dirt** the tag stays on the bare ground.',
     '① the earth lights ② the house lifts', 'plan sequence', star=True)

# ===== c07 · The first picture again · you pay at the door (B2) ====================================================================
shot('7.01', 'EXPL', 'Now look at the first picture', ['first picture', 'record margins', 'record low'],
     'The two coins of 2.05 rise again, same composition (`firstPicture`): left glows on **record margins**, right on **record low**.',
     '① the coins rise', 'plan sequence')
shot('7.02', 'SCENE', "That's the direction", ['direction', 'follow the price'],
     'The coins sink into the loop; the coin follows the tags along the road toward the doors; small arrows of light on the road point the same way.',
     '① the coin follows', 'plan sequence')
shot('7.03', 'SCENE', 'Not a crash, then', ['nearly free', 'very few people'],
     '**★ The world of the doors.** Wide: the board almost without tags under a sky full of air, only the three doors stand tall with heavy tags; on **very few people** one indigo silhouette appears at each door.',
     '① pull back ② the three keepers', 'plan sequence', star=True)
shot('7.04', 'SCENE', 'In that world', ["don't go hungry", 'at the door', 'Every month', 'the ground, the power and the chips'],
     'You walk the road (warm windows, a lit table: **don\'t go hungry**); at each door a coin leaves your hand; on **Every month** the same thing again (a thin moon in the sky turns a phase).',
     '① you walk ② coins at the doors', 'plan sequence')
shot('7.05', 'SCENE', "I don't think the real story", ['the machine', 'the ground the machine stands on'],
     'The camera passes the data centre (**the machine**) and sinks to the ground under it: the field\'s earth glows warm.',
     '① descend', 'move · the camera rises straight up from the ground · up')

# ===== c08 · A set of rules · the board revealed (B2) ==============================================================================
shot('8.01', 'SCENE', "That isn't a law of nature", ['law of nature', 'set of rules'],
     '**★ The reveal.** The camera rises and pulls back until the zero line becomes the **edge of a board**: the plain, its road and doors lie on a game board on a dark table (a lamp pool on the table). On **set of rules** the road\'s field ticks light all round.',
     '① rise and pull back', 'plan sequence', star=True)
shot('8.02', 'EXPL', 'In nineteen oh four', ['Lizzie Magie', 'board game', 'teach'],
     'The board\'s outline morphs into a **top-down patent drawing** in gold lines (square, fields, corners); `LIZZIE MAGIE · PATENTED 1904` on **Lizzie Magie**.',
     '① outline → drawing', 'plan sequence')
shot('8.03', 'EXPL', 'You know it as Monopoly', ['Monopoly', "Landlord's Game"],
     'Type only (no logo, no trade dress): `MONOPOLY` rises on **Monopoly**; on **The Landlord\'s Game** it sinks and `THE LANDLORD’S GAME` rises in its place.',
     '① word swap', 'plan sequence')
shot('8.04', 'EXPL', 'It was built on one idea', ['Henry George', 'everyone around it', 'belongs to everyone'],
     'One field of the drawing; many small points (people) round it; on **everyone around it** light flows from them into the field (its value); on **belongs to everyone** it flows back out to all of them. `HENRY GEORGE` on his name.',
     '① flow in ② flow out', 'plan sequence')
shot('8.05', 'EXPL', 'Her game had two sets of rules', ['two sets', 'single player', 'everybody wins'],
     'Two **rule cards** (`f18_kit.ruleCard`) rise beside the drawing: `Rules I` / `Rules II`. On **single player** the board fills with one colour under card I (a door on every field); on **everybody wins** all fields light warm under card II.',
     '① card I ② card II', 'plan sequence')
shot('8.06', 'EXPL', 'We kept the first', ['kept the first', 'forgotten'],
     'Card I stays; on **forgotten** card II slides under the board into the dark.',
     '① card II slides away', 'plan sequence')
shot('8.07', 'EXPL', 'What would it look like now', ['abundant', 'shared, fairly'],
     'Card II is drawn back out of the dark and turns to us; push in.',
     '① the card returns ② push', '**SEAM plateRules** (B2 → B3): rule card II, close · centre · forward')

# ===== c09 · Rules II: the free layer · land first (B3) ============================================================================
shot('9.01', 'SCENE', 'The second set of rules', ['already in play', 'quietly'],
     'From plateRules: the card lays itself down onto the board; we descend back to eye level on the night board.',
     '① the card lays down ② descend', 'plan sequence')
shot('9.02', 'SCENE', 'What becomes abundant', ['set free'],
     'On **set free** the whole loop road lights warm, end to end, with no tag on it: the **free layer**.',
     '① the road lights', 'plan sequence')
shot('9.03', 'SCENE', 'The United States built GPS', ['GPS', 'whole world', 'free'],
     'Three small satellites of light high in the sky; on **whole world** rings descend from them onto the board; on **free** they touch the road.',
     '① rings descend', 'plan sequence')
shot('9.04', 'EXPL', 'By twenty seventeen', ['one point four trillion'],
     'Counter in the sky: `$1.4 TRILLION` · `GAINED BY U.S. COMPANIES BY 2017` (`NIST 2019`).',
     '① counter', 'plan sequence')
shot('9.05', 'SCENE', 'Put it out there free', ['everyone earns'],
     'The road\'s light runs into all the fields: windows along the loop light one after another.',
     '① windows light', 'plan sequence')
shot('9.06', 'SCENE', "That's the rule for whatever A.I. makes abundant", ['free layer', 'roads', 'at a door', 'Lagos', 'Ohio'],
     '**★ The free layer.** Wide on the lit road; on **at a door** a door that stood on the road folds away; on **Lagos** / **Ohio** two tiny figures on opposite sides of the loop (a kid, a plumber with a toolbox; indigo silhouettes) are lit by the same road: `LAGOS` · `OHIO`.',
     '① the door folds ② two figures', 'plan sequence', star=True)
shot('9.07', 'SCENE', 'And what stays scarce', ['run together', 'Land first', 'nobody made it'],
     'The middle of the board: bare ground inside the loop; many small points of people round it.',
     '① camera to the middle', 'transformation · the ground opens as a section · down')
shot('9.08', 'EXPL', 'Since last year', ['Baden-Württemberg', 'land alone', 'not the building'],
     'Section: a building above, the land below. On **land alone** the tag hangs on the land layer; the building gets none (**not the building**). `BADEN-WÜRTTEMBERG · TAX ON LAND VALUE · SINCE 2025`.',
     '① the tag finds the land', 'plan sequence')
shot('9.09', 'EXPL', 'Build on it', ["tax doesn't rise", 'top tax court', 'this spring'],
     'The building grows two floors; the tag stays the same (**tax doesn\'t rise**). `FEDERAL FISCAL COURT (BFH) · UPHELD 2026`.',
     '① the building grows', 'plan sequence')
shot('9.10', 'EXPL', 'Tax what nobody made', ['nobody made', 'people build'],
     'The land glows warm (**nobody made**), the building stays plain light (**people build**).',
     '① the land warms', 'transformation · the building becomes the Vienna block · up')

# ===== c10 · Housing · energy · who owns the door · you can (B3) ===================================================================
shot('10.01', 'SCENE', 'Housing', ['Vienna', 'two thirds', 'affordable'],
     'A block of flats on a field; on **two thirds** two thirds of its windows light warm: `VIENNA · SINCE 2019 · ⅔ AFFORDABLE`.',
     '① windows light', 'plan sequence')
shot('10.02', 'EXPL', 'And the land price is capped', ['capped'],
     'The land\'s tag under the block gets a lid line: `LAND PRICE CAPPED · €188 / m²`.',
     '① the cap', 'plan sequence')
shot('10.03', 'SCENE', "Whether that's enough", ['still argues'],
     'A few windows flicker (people arguing), small silhouettes in them.',
     '① flicker', 'move · along the road to the board\'s edge: the sea · right')
shot('10.04', 'SCENE', 'Energy:', ['Copenhagen', 'wind farm', 'two thousand'],
     'The board\'s edge becomes the sea; an **arc of 20 turbines** turning slowly: `MIDDELGRUNDEN · OFF COPENHAGEN · SINCE 2000`.',
     '① turbines turn ② camera travel', 'plan sequence')
shot('10.05', 'EXPL', 'Half belongs to', ['Half', 'utility', 'eight and a half thousand', 'cooperative'],
     'The arc splits: 10 turbines cool-cream `CITY UTILITY`, 10 warm; on **eight and a half thousand** a stream of points runs into the warm half: `≈ 8,500 PEOPLE · CO-OP`.',
     '① split ② points', 'plan sequence')
shot('10.06', 'SCENE', 'The wind was always free', ['always free', 'chose to share'],
     '**★** A door on the shore, wide open; on **chose to share** many tiny figures pass through it, you among them.',
     '① the door opens ② people pass', 'move · back across the board to the Loudoun field · left', star=True)
shot('10.07', 'SCENE', 'Now ask the same question', ['data center', 'Virginia', 'Who owns the door'],
     'The data-centre field from 6.04, a new hall rising on it, its door; on **Who owns the door** its tag swings.',
     '① the hall rises', 'plan sequence')
shot('10.08', 'SCENE', "That's being decided right now", ['state legislatures', 'zoning meetings', "can't vote", 'You can'],
     'A meeting-room window at the field\'s edge: inside, rows of silhouettes; the data centre outside. On **can\'t vote** the hall\'s lights blink, silent; on **You can** you raise your hand (yellow).',
     '① your hand', 'plan sequence')
shot('10.09', 'EXPL', 'None of this takes', ['already owns', 'up front', 'the few', 'everyone'],
     'The door\'s value as a flow of light that forks: on **the few** it runs into a few hands; on **everyone** it widens and runs out to all the points round the field.',
     '① the flow forks', 'move · along the road to the shelf field · left')

# ===== c11 · Ending + end screen (B3) ==============================================================================================
shot('11.01', 'SCENE', "Capitalism won't end with a crash", ['crash', 'encyclopedia', 'one price at a time', 'value stays'],
     'The shelf field of 3.06 (callback): tags rise one by one into the air; the light of the shelf stays (**value stays**).',
     '① tags rise in turn', 'plan sequence')
shot('11.02', 'EXPL', 'Whether it ends there', ['behind the doors', 'same board', 'two sets of rules'],
     'Rise: the whole board from above; the two rule cards stand beside it.',
     '① rise', 'plan sequence')
shot('11.03', 'SCENE', "I think that's the best news", ['best news', 'survive', 'design'],
     '**★ Design.** Down on the board, you draw a new line of light from your hand along the ground toward the middle; on **design** it joins the road.',
     '① the line ② you', 'plan sequence', star=True)
shot('11.04', 'SCENE', 'The question was never', ['in its place', 'in the room'],
     'The meeting-room window (10.08), small; you inside it.',
     '① push', 'plan sequence')
shot('11.05', 'SCENE', 'Tell me below', ['which price', 'line of work', 'subscribe'],
     'Your field, your tag over you; on **which price** it swings, a small `?` on its face.',
     '① the tag swings', 'plan sequence')
shot('11.06', 'SCENE', 'The thinking is about to be free', ['free', 'ground it stands on', 'Your move'],
     'First light at the zero line; the board warms. On **ground it stands on** the middle ground glows; on **Your move** you take one step onto the next field.',
     '① dawn ② your step', 'pull back into the end screen')

ENDSCREEN = ('11.07', 'SCENE', 'End screen (VO end → film end, ≤ 15 s, no voice). The board at first light, slow pull back and rise; the road lit, a few tags drifting up into the air, you tiny on your new field. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload), quiet sky/board there; subscribe space centre x 810–1110, y 330–600. Never static.', '① pull back ② dust')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')

def resolve():
    chunk_start = {}
    last = -1.0
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

def vo_end(): return max(w['e'] for w in WS)

def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])

LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5}

def main():
    cs = resolve()
    dur = TM['duration']
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = []
    out.append('| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |')
    out.append('|---|---|---|---|---|---|---|---|')
    tot = {'B1': 0, 'B2': 0, 'B3': 0, 'Lead': 0}
    allx = [0, 0]
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
        allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (B3 includes the ≤ 15 s end screen). '
               f'**Explainer share (spoken part):** {round(100 * allx[0] / allx[1])}% (mixed shots count half). Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL)" if TM.get("provisional") else ""}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span = sum(s['t1'] - s['t'] for s in shs) or 1
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out.append('')
        out.append(f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / span)}%')
        out.append(f'Light/hero: {c[4]}')
        out.append('')
        out.append('| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |')
        out.append('|---|---|---|---|---|---|---|')
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at'])
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
