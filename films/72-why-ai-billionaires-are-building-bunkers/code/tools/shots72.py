#!/usr/bin/env python3
"""Film 72 · "Why AI Billionaires Are Building Bunkers" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13). Times from the
current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json.
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots72.py   (also writes data/anchors72.json for tools/anchors72.mjs)
Every shot: id (H = hook, 1…5 = the stations, M / A = subscribe calls, E = the end), anchor = a VO phrase (looked up after the previous
shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'ENDSCREEN' = duration − 15), zeigt wörtlich (what the
sentence says, shown), the picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (REGELN §13.2/§13.3, docs/MOTION.md §1):
  EXPL 1.0 (a diagram: THE LIST, a cross-section, a floor plan, the evidence board, a map of shelters, a number, a quote card, an open card)
  · MIX .5 (a scene element with a diagram on it, a clip plate growing, a callback) · ANCHOR 0 (the Leitbild: the hatch + the lantern crowd,
  only at 3 anchors) · SCENE 0 (rooms, people) · CLIP 0. World rides count 0 (there are none).
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F72ROOT', '/mnt/project-files/scenario/film-bunker/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'The people building artificial'), ('c02', 'B1', 'There are three obvious suspects'), ('c03', 'B1', 'Last year, the comedian'),
          ('c04', 'B1', 'It would make sense'), ('c05', 'B1', 'And that bunker from the beginning'), ('c06', 'B2', 'Ask the people who sell them'),
          ('c07', 'B2', 'Some years ago'), ('c08', 'B2', 'But look at what gets planned'), ('c09', 'B3', 'But follow the trail'),
          ('c10', 'B3', 'This channel exists'), ('c11', 'B3', 'One country has built'), ('c12', 'B3', 'So a world nobody wants'), ('c13', 'B3', 'So go back to that door')]
# §13.1a 'Motiv neu?': every shot is a new motif (own place, person, moment or graphic) EXCEPT these (the sentence adds no new picture; zoom ≠ new):
NOT_NEW = {'1.03': 'same list, row 2 relights', '1.04': 'same list, row 3 writes', '1.12': 'same quote card, last words', '1.13': 'same quote card settles',
           '1.22': 'same catalog, 2nd line', '2.09': 'same sky, the next thing passes', '2.10': 'same sky, the next thing passes', '2.24': 'same section, the other arrow',
           '3.27': 'same bunker, 2nd machine', '4.11': 'same sketch row, 2nd sketch', '4.12': 'same sketch row, 3rd sketch', '5.03': 'same thread, next card',
           '5.04': 'same thread, next card', '5.06': 'same test row, 2nd test', '5.07': 'same test row, 3rd test', 'M.04': 'same subscribe tag',
           '5.42': 'same card, its badge', '5.43': 'same card, its badge', 'E.04': 'same list, row 2 pulses', 'A.04': 'same subscribe tag'}
# id | anchor phrase | zeigt wörtlich | picture (motion design: what moves, what it becomes) | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs, the quality reference)
 ('H.01', 'The people building artificial', 'the people building AI are building bunkers', 'ANCHOR 1/3 · thumbnail A2: the night valley, a huge crowd with small gold lanterns, the round steel hatch half open in the slope, gold light and the ladder inside, you in the yellow coat beside it; title AI BILLIONAIRES / FEAR YOU', 'ANCHOR', 'the slope', ''),
 ('H.02', 'Think about who they are', 'who they are', 'the hills sink, the slope flattens into THE GROUND LINE (the stage); the crowd becomes a row of lanterns on the line far left; out of the line beside the hatch a lit glass room rises: four calm silhouettes at screens · THE PEOPLE BUILDING AI', 'MIX', 'the glass room', ''),
 ('H.03', 'They see this technology', 'they see it up close, before the rest of us', 'the AI disc (cool) rises right in front of the glass room: bracket UP CLOSE; a dashed distance line runs left to the lanterns: THE REST OF US', 'EXPL', 'the disc\'s beam', ''),
 ('H.04', 'The same technology', 'the same technology reshapes your job, your daily life, your children\'s world', 'the camera follows the beam left; you stand on the line; three small scenes rise out of it on the words: a desk (YOUR JOB), a kitchen table (YOUR DAILY LIFE), a child with a school bag (YOUR CHILDREN\'S WORLD); the beam passes over each', 'MIX', 'the line', ''),
 ('H.05', 'And some of them have built', 'some of them built a place to hide', 'back right along the line to the hatch; one silhouette leaves the glass room and walks to it; the lid lifts a crack, gold', 'MIX', 'the hatch', ''),
 ('H.06', 'Underground', 'underground', 'the ground below the line is cut open (strata draw in), the view tilts down: shaft, ladder, a room, cream outline: UNDERGROUND', 'EXPL', 'the shaft', ''),
 ('H.07', 'Behind a door filled', 'behind a door filled with concrete', 'a thick door slab slides shut across the shaft, in section; its cut face fills with concrete stipple: A DOOR FILLED WITH CONCRETE', 'EXPL', 'the door', ''),
 ('H.08', 'A door that only opens', 'a door that only opens for a few', 'the door opens for three small gold figures; the view pulls back and up, the line lifts back into the slope and the crowd of lanterns fills the valley: thumbnail A2 again, the tiny hatch against the crowd', 'ANCHOR', 'the sky', ''),
 ('H.09', 'So what are they hiding from', 'what are they hiding from?', 'the view tilts up into the sky; THE LIST rises from below on its own plane (not on the hatch): WHAT ARE THEY HIDING FROM? with four empty numbered rows', 'EXPL', 'the list', ''),
 ('H.10', 'One of them said it out loud', 'one of them said it out loud', 'the list folds down and becomes a lit board on the line; in front of it a room: rows of seated researchers (backs), one standing figure', 'MIX', 'the board', ''),
 ('H.11', "OpenAI's chief scientist", 'OpenAI\'s chief scientist at the time told new researchers', 'tags rise over the room: OPENAI\'S CHIEF SCIENTIST (THEN) · A ROOM OF NEW RESEARCHERS · 2023', 'MIX', 'the board', ''),
 ('H.12', "We're definitely going", 'the quote: a bunker before we release AGI', 'the board grows into the quote card (Sutskever, summer 2023, via Karen Hao), words light as spoken', 'EXPL', 'the word AGI', '★'),
 ('H.13', 'A.G.I. A machine', 'AGI: a machine as smart as us', 'AGI lifts off the card and unfolds: ARTIFICIAL GENERAL INTELLIGENCE → a cool disc beside a person, the same height: A MACHINE AS SMART AS US', 'EXPL', 'the disc', ''),
 ('H.14', 'So the answer seems obvious', 'the obvious answer: they fear the machine', 'the list comes back; the disc flies into row 2 and writes 2 THE MACHINE (lit)', 'EXPL', 'row 2', ''),
 ('H.15', 'But no door stops', 'no door stops a smarter machine, and they know it', 'beside the list, a small bunker section under the line, door shut; the disc\'s calm light simply grows round all of it, above and below: NO DOOR STOPS IT', 'EXPL', 'the list', ''),
 ('H.16', "They're building bunkers for a reason", 'there is a reason, maybe not the machine', 'the list centred: row 2 gets a ?, row 4 shows a dark redaction bar → plateList', 'EXPL', 'plateList', ''),
 # ---------------------------------------------------------------- c02 · B1 · three suspects, the door is real
 ('1.01', 'There are three obvious suspects', 'three obvious suspects', 'out of plateList: the numbers 1 2 3 light on the list', 'EXPL', 'row 1', ''),
 ('1.02', 'The bomb', 'the bomb', 'row 1 writes THE BOMB', 'EXPL', 'row 2', ''),
 ('1.03', 'The machine', 'the machine', 'row 2 relights, its ? lifts', 'EXPL', 'row 3', ''),
 ('1.04', 'And the chaos along the way', 'and the chaos along the way', 'row 3 writes THE CHAOS', 'EXPL', 'row 4', ''),
 ('1.05', 'The fourth is written', 'the 4th is written into the floor plans of new bunkers', 'row 4 stays redacted; behind the bar a floor-plan drawing shows through, faint: IN THE FLOOR PLANS', 'EXPL', 'row 1', ''),
 ('1.06', 'The bomb first', 'the bomb first', 'row 1 lifts out of the list and becomes the station title THE BOMB over the ground line; the list sinks', 'EXPL', 'the line', ''),
 ('1.07', 'That door filled with concrete', 'that concrete door is real', 'the door slab of the hook returns in section under the line: REAL', 'MIX', 'the door', ''),
 ('1.08', "It's in Hawaii", 'it\'s in Hawaii', 'the door shrinks to a gold dot; around it the outline of Kauai draws (cream line, no map grid): KOOLAU RANCH · KAUAI, HAWAII', 'EXPL', 'the dot', 'W'),
 ('1.09', "Under Mark Zuckerberg's ranch", 'under Zuckerberg\'s ranch: a shelter bigger than most houses', 'push into the dot: a meadow line; below it the shelter\'s rooms in section; beside it the dashed outline of a family house: BIGGER THAN MOST HOUSES (+ source, the sq ft only in the source line)', 'MIX', 'the meadow', '★'),
 ('1.10', "He says it's for storms", 'he says: for storms', 'a storm cloud with rain lines drifts over the meadow: FOR STORMS', 'MIX', 'the cloud', ''),
 ('1.11', 'In his words', 'his words: a little shelter', 'quote card Zuckerberg (Bloomberg, 19 Dec 2024), words light as spoken', 'EXPL', 'the card', ''),
 ('1.12', "It's like a basement", 'it\'s like a basement', 'the same card, the last words light', 'EXPL', 'the card', ''),
 ('1.13', 'Fair enough', 'fair enough', 'the card settles beside the section, calm', 'EXPL', 'the section', ''),
 ('1.14', "The owners don't love", 'the owners don\'t love the word bunker', 'the word BUNKER under the section; a cream strip slides over it: BASEMENT', 'EXPL', 'the strip', ''),
 # ---------------------------------------------------------------- c03 · B1 · Altman, the sellers, verdict 1
 ('1.15', 'Last year, the comedian', 'Theo Von asked the head of OpenAI', 'a podcast studio as a drawing: two microphones, two silhouettes at a table: THEO VON · SAM ALTMAN · 2025', 'MIX', 'the studio lamp', ''),
 ('1.16', "Here's Sam Altman", 'here\'s Sam Altman', 'the lamp\'s circle of light grows into the clip plate', 'MIX', 'the plate', ''),
 ('1.17', 'slot:C1', '(Altman: "I don\'t have what I would call a bunker … not because of AI, but just because of like, people are dropping bombs in the world again")', 'C1 · SAM ALTMAN · CEO, OpenAI · 2025 · ORIGINAL FOOTAGE (7.6 s)', 'CLIP', 'the plate shrinks into the lamp', ''),
 ('1.18', 'Bombs. Not A.I.', 'bombs. not AI.', 'the plate shrinks back into the studio lamp; under the lamp two words rise: BOMBS (cream, big) · NOT AI (small, cool); optional quote line with "just" (F.SOURCES.altman25, KB1)', 'EXPL', 'the words', ''),
 ('1.20', 'The people who sell bunkers', 'sellers name old reasons too', 'a seller silhouette opens a catalogue page: REASONS', 'MIX', 'the page', ''),
 ('1.21', 'War', 'war', 'the catalogue writes WAR (+ source Newsweek / Washington Post)', 'EXPL', 'the page', ''),
 ('1.22', 'Pandemics', 'pandemics', 'PANDEMICS', 'EXPL', 'the list', ''),
 ('1.23', 'So the bomb is real', 'the bomb is real', 'the list comes back: row 1 THE BOMB, the word REAL rises beside it', 'EXPL', 'row 1', ''),
 ('1.24', "But it's the oldest reason", 'but the oldest reason', 'row 1: a thin cream strike, the row greys: REAL, BUT OLD', 'EXPL', 'the catalogue', ''),
 ('1.25', 'And something here is new', 'something is new', 'the catalogue returns; under the old lines a blank line glows', 'MIX', 'the blank line', ''),
 ('1.26', 'This year, bunker makers', 'this year the makers add a reason', 'a gold pen line writes into the blank line (+ 2026)', 'EXPL', 'the line', ''),
 ('1.27', 'Artificial intelligence#1', 'artificial intelligence', 'the line reads … AND EVEN ARTIFICIAL INTELLIGENCE; a small cool disc sits on it (+ source)', 'EXPL', 'the disc', ''),
 ('1.28', "Is it the machine they're", 'is it the machine?', 'the disc flies to the list: row 2 THE MACHINE grows big', 'EXPL', 'row 2', ''),
 # ---------------------------------------------------------------- c04 · B1 · the machine
 ('2.01', 'It would make sense', 'it would make sense', 'row 2 lifts out as the station title THE MACHINE; the list sinks', 'MIX', 'the title', ''),
 ('2.02', 'A panel of more than', '100+ experts: AI already used in real cyberattacks', 'a round table from above, 100+ small seat dots (one per expert, dataviz); cool sparks flicker in the middle: REAL CYBERATTACKS (+ INTERNATIONAL AI SAFETY REPORT 2026)', 'EXPL', 'a spark', ''),
 ('2.03', "That's today's A.I.", 'that\'s today\'s AI', 'one spark becomes a small disc: TODAY', 'EXPL', 'the small disc', ''),
 ('2.04', 'Now picture the one', 'the one they race to build', 'beside it a big disc draws as a dashed outline and fills: BEING BUILT', 'EXPL', 'the big disc', ''),
 ('2.05', 'Smarter than any of us', 'smarter than any of us, at everything', 'the big disc rises over a row of small people of many trades: SMARTER THAN ANY OF US · AT EVERYTHING', 'EXPL', 'the disc', '★'),
 ('2.06', 'Say that machine turns', 'say it turns against us', 'a dashed frame closes round the picture: THOUGHT EXPERIMENT; the disc\'s rings turn inward', 'EXPL', 'the frame', ''),
 ('2.07', 'A bunker is built for things', 'a bunker is built for things that pass', 'a schematic bunker (its own drawing, hatch shut) under the line; across the sky a time arrow runs left → right: THINGS THAT PASS', 'EXPL', 'the arrow', ''),
 ('2.08', 'A storm', 'a storm', 'a storm cloud passes over the small bunker on the ground line, rain on the lanterns\' hill, and out', 'MIX', 'the sky', ''),
 ('2.09', 'Fallout', 'fallout', 'grey dust drifts across the landscape over the bunker, and out', 'MIX', 'the sky', ''),
 ('2.10', 'A war', 'a war', 'a distant flicker on the horizon passes over the landscape, and out', 'MIX', 'the disc', ''),
 ('2.11', "That machine doesn't pass", 'that machine doesn\'t pass', 'the big disc stands over the bunker while the arrow runs on: DOESN\'T PASS', 'EXPL', 'the shelves', ''),
 ('2.12', 'One day the door has to open', 'one day the door has to open', 'inside, the supply level drains to empty; the hatch lifts', 'MIX', 'the hatch', ''),
 ('2.13', "And it's still out there", 'and it\'s still out there', 'through the open hatch: the cool light, still there: STILL OUT THERE', 'EXPL', 'the disc', ''),
 ('2.14', 'And if the machine turns out well', 'if it turns out well, nobody needs a bunker', 'the disc warms at its rim; the hatch stands open, the bunker below empty: NOBODY NEEDS ONE', 'MIX', 'the empty room', ''),
 ('2.15', 'The head of OpenAI has said', 'Altman: none of this helps if AGI goes wrong', 'quote card Altman (WSJ Tech Live, Oct 2023)', 'EXPL', 'the card', ''),
 # ---------------------------------------------------------------- c05 · B1 · optional, out here, crossed off, Harris (C2)
 ('2.16', 'And that bunker from the beginning', 'that bunker from the beginning', 'callback: the room of researchers from H.10, small, the board lit', 'MIX', 'the speaker', ''),
 ('2.17', 'The scientist who announced', 'the scientist added a detail', 'the standing figure lights', 'MIX', 'the board', ''),
 ('2.18', 'Of course', 'it would be optional', 'quote card Sutskever 2 (2023, via Karen Hao), words light as spoken', 'EXPL', 'the word optional', ''),
 ('2.19', 'Optional Some', 'optional', 'OPTIONAL lifts off the card and stays, big', 'EXPL', 'the word', ''),
 ('2.20', 'Some scientists doubt', 'some scientists doubt it is close', 'a silent quote card (Dame Wendy Hall, BBC Oct 2025, not read); a long dashed arrow from TODAY to the far big disc: ANYWHERE CLOSE?', 'EXPL', 'the arrow', ''),
 ('2.21', 'Near or far', 'near or far, the logic holds', 'the disc slides near → far → near on the arrow; the bunker verdict under it stays', 'EXPL', 'the disc', ''),
 ('2.22', 'The only protection', 'the only protection: build it right', 'above the line people build the disc (scaffold lines, cream): BUILD IT RIGHT', 'EXPL', 'the line', ''),
 ('2.23', 'Out here', 'out here', 'above the line the lanterns and people of the hook stand in the open; a small arrow up: OUT HERE', 'MIX', 'the line', ''),
 ('2.24', 'Not down there', 'not down there', 'an arrow down into the dark bunker: NOT DOWN THERE', 'EXPL', 'the list', ''),
 ('2.25', 'Cross the machine', 'cross the machine off the list', 'the list: row 2 is struck through, bold: CROSSED OFF', 'EXPL', 'the list', ''),
 ('2.26', 'But then why are they still', 'why are they still building?', 'beside the list a small bunker keeps drawing itself: STILL BUILDING', 'EXPL', 'the bunker', ''),
 ('3.01', 'Tristan Harris used to work', 'Harris used to work at Google', 'a name tag on a stand: TRISTAN HARRIS · FORMER DESIGN ETHICIST, GOOGLE', 'MIX', 'the tag', ''),
 ('3.02', 'Today he', 'today a sharp critic', 'the tag adds CO-FOUNDER, CENTER FOR HUMANE TECHNOLOGY', 'MIX', 'the tag', ''),
 ('3.03', 'This spring he said', 'this spring he said', 'the tag\'s frame grows into the clip plate', 'MIX', 'the plate', ''),
 ('3.04', 'slot:C2', '("Right now, the AI company leaders are building bunkers. A lot of people who are wealthy are building bunkers.")', 'C2 · TRISTAN HARRIS · Co-founder, Center for Humane Technology · 2026 · ORIGINAL FOOTAGE (5.6 s; the MODERN | WISDOM bug bottom left stays visible)', 'CLIP', 'the plate shrinks into RIGHT NOW', ''),
 ('3.05', 'Right now#0', 'right now', 'the plate folds into the words RIGHT NOW (gold, big)', 'EXPL', 'the words', ''),
 ('3.06', 'He names no names', 'he names no names', 'a row of blank name tags', 'EXPL', 'the tags', ''),
 ('3.07', "But if he's right", 'then a bunker must be good for something', 'the tags fold into a schematic bunker section, empty shelves: GOOD FOR WHAT? → plateBunker', 'EXPL', 'plateBunker', ''),
 # ---------------------------------------------------------------- c06 · B2 · every bunker is a clock, the chaos stays
 ('3.08', 'Ask the people who sell them', 'ask the sellers', 'out of plateBunker: a seller silhouette with a catalogue beside the section', 'MIX', 'the shelves', ''),
 ('3.09', 'Most shelters are stocked', 'stocked for weeks or months', 'the shelves fill; a time axis runs under the bunker: WEEKS · MONTHS', 'EXPL', 'the axis', ''),
 ('3.10', 'The biggest ones promise', 'the biggest promise a few years', 'the axis stretches: A FEW YEARS (makers\' claims in the source line)', 'EXPL', 'the axis', ''),
 ('3.11', 'Sales promises', 'sales promises, all of them', 'the axis labels turn hollow (dashed): MAKERS\' CLAIMS', 'EXPL', 'the level', ''),
 ('3.12', 'But every bunker is a clock', 'every bunker is a clock', 'the supply level drains while a time head runs along the axis: the bunker IS the clock (no clock face): EVERY BUNKER IS A CLOCK', 'EXPL', 'the time head', '★'),
 ('3.13', 'So what are they expecting', 'what do they expect to wait out?', 'the list comes back: row 3 THE CHAOS lights, a ?', 'EXPL', 'row 3', ''),
 ('3.14', 'Inside the A.I. industry', 'insiders expect a major AI incident', 'a control room: a few silhouettes at screens: A MAJOR AI INCIDENT (+ Axios)', 'MIX', 'the screens', ''),
 ('3.15', 'Not killer robots', 'not killer robots', 'the words KILLER ROBOTS, struck through (no robot drawn)', 'EXPL', 'the strike', ''),
 ('3.16', 'More like a cyberattack', 'banks, the internet, maybe the power go down', 'three signs stand on the line, BANKS · INTERNET · POWER, and go dark one by one on the words', 'MIX', 'the dark signs', ''),
 ('3.17', "And you've already seen", 'you\'ve seen how fragile that is', 'you (yellow coat) at an airport window, a departure board above', 'MIX', 'the board', ''),
 ('3.18', 'In November, one faulty router', 'one faulty router stopped takeoffs across America', 'the board: every line flips to GROUND STOP; one small router box blinks (cream, never red) (+ 13 NOV 2026, FAA)', 'EXPL', 'the router', ''),
 ('3.19', 'For hours#0', 'for hours', 'a bar grows along the board: MORE THAN 4 HOURS (KB2)', 'EXPL', 'the bar', ''),
 ('3.20', 'No A.I. involved', 'no AI involved', 'beside the router: NO AI', 'EXPL', 'the board', ''),
 ('3.21', 'Then the planes flew again', 'then the planes flew again', 'the board flips back, a plane silhouette lifts off: IT PASSED', 'EXPL', 'the list', ''),
 ('3.22', 'The chaos stays on the list', 'the chaos stays on the list', 'the list: row 3, the verdict STAYS rises', 'EXPL', 'the bunker clock', ''),
 ('3.23', 'A bunker can carry you', 'a bunker can carry you through it', 'the bunker clock: the chaos is a band on the time axis that fits inside the supply level', 'EXPL', 'the band', ''),
 ('3.24', 'For a while', 'for a while', 'the list: row 3 gets a half strike that stops in the middle: STAYS · FOR A WHILE', 'EXPL', 'the bunker', ''),
 ('3.25', "But it can't run itself", 'it can\'t run itself', 'the bunker section: its rooms are dark and still', 'EXPL', 'a room', ''),
 ('3.26', 'It needs fuel', 'it needs fuel', 'a generator lights in one room: FUEL', 'EXPL', 'the duct', ''),
 ('3.27', 'Filters', 'filters', 'an air filter lights in the shaft: FILTERS', 'EXPL', 'the shaft', ''),
 ('3.28', 'And people', 'and people', 'three people in work clothes step into the rooms: PEOPLE', 'MIX', 'the people', ''),
 ('3.29', 'And when the world outside', 'when the world outside stops, who do they answer to?', 'above the line the city lights go out window by window; below, the three workers turn and look up; the list\'s row 4 flickers', 'SCENE', 'the dark', ''),
 # ---------------------------------------------------------------- c07 · B2 · Rushkoff, the guards, the investors
 ('4.01', 'Some years ago', 'Rushkoff was brought to a luxury resort', 'a new place (W): a desert road at night, a car\'s two lights to a low resort with palms: DOUGLAS RUSHKOFF · 2017', 'MIX', 'the resort window', 'W'),
 ('4.02', 'Instead of an audience', 'five very rich investors instead of an audience', 'inside: rows of empty chairs; five calm silhouettes at a small table: FIVE INVESTORS', 'MIX', 'the table lamp', ''),
 ('4.03', "Here's what they really", 'what they wanted to know', 'the lamp\'s light grows into the clip plate', 'MIX', 'the plate', ''),
 ('4.04', 'slot:C3', '("Like, how do I maintain control of my security force once my money is worthless?")', 'C3 · DOUGLAS RUSHKOFF · Media theorist, author of "Survival of the Richest" · year/channel from clips-geprueft.json · ORIGINAL FOOTAGE (10.3 s, webcam; 0–5 s split screen)', 'CLIP', 'the plate shrinks into a banknote', ''),
 ('4.05', 'Once money is worthless', 'once money is worthless', 'the plate folds into a paper banknote in cream outline; its print fades out, it goes thin and weightless (no fire, no red): ONCE MONEY IS WORTHLESS', 'EXPL', 'the note', ''),
 ('4.06', 'They called that day', 'they called that day "the Event", the day everything breaks down', 'the note turns over: "THE EVENT", big serif, in quotes; under it five small tags drop: COLLAPSE · UNREST · NUCLEAR · VIRUS · HACK (Rushkoff\'s list)', 'EXPL', 'the tags', ''),
 ('4.07', "They knew they'd need", 'armed guards against "the angry mobs"', 'two guards before a schematic bunker (not the hook\'s); far off many small lantern lights: "THE ANGRY MOBS"', 'MIX', 'the guards', ''),
 ('4.08', 'But after the Event', 'why would the guards still obey?', 'the two guards turn slowly to the entrance', 'MIX', 'the table', ''),
 ('4.09', 'They had ideas', 'they had ideas', 'back at the table: three sketch cards slide out', 'MIX', 'sketch 1', ''),
 ('4.10', 'Special locks', 'locks on the food supply', 'sketch 1: a food store in section with a combination lock', 'EXPL', 'sketch 2', ''),
 ('4.11', 'Disciplinary collars', 'disciplinary collars', 'sketch 2: the words DISCIPLINARY COLLARS with a plain ring', 'EXPL', 'sketch 3', ''),
 ('4.12', 'Robots as guards', 'robots as guards', 'sketch 3: the words ROBOTS AS GUARDS only (no robot drawn)', 'EXPL', 'the table', ''),
 ('4.13', 'Rushkoff offered', 'Rushkoff offered a different answer', 'a small figure at the table end; an empty speech line (we don\'t hear it yet)', 'MIX', 'the five', ''),
 ('4.14', 'They rolled their eyes', 'they rolled their eyes', 'the five lean back', 'SCENE', 'the five', ''),
 ('4.15', "That's his account", 'that\'s his account', 'a tag over the scene: RUSHKOFF\'S OWN ACCOUNT', 'EXPL', 'the five', ''),
 ('4.16', 'The men were never named', 'never named', 'five blank name cards in front of the five', 'EXPL', 'the cards', ''),
 ('4.17', 'And they were investors', 'investors, not the people who build AI', 'a line divides two groups: INVESTORS (the five) | THE PEOPLE WHO BUILD AI (the glass room from the hook)', 'EXPL', 'the dividing line', ''),
 # ---------------------------------------------------------------- c08 · B2 · floor plans, the companies, fair, drills
 ('4.18', 'But look at what gets planned', 'what gets planned today', 'the dividing line unrolls into a floor plan (cream lines on night, wall hatching, door arcs; no grid): PLANNED TODAY', 'EXPL', 'the plan', ''),
 ('4.19', 'Some new bunker projects', '"anti-mutiny" procedures: guards or anyone can\'t take over', 'in the plan the doors lock in sequence (gold dots run room to room): "ANTI-MUTINY" PROCEDURES (+ source)', 'EXPL', 'the plan', '★'),
 ('4.20', 'Others are designed', '"detention areas"', 'a second plan: one room hatched with bars: "DETENTION AREAS" (+ source)', 'EXPL', 'the room', ''),
 ('4.21', 'The question from that room', 'the question from that room is in the floor plans', 'the investors\' question (from C3) writes itself across the plan', 'EXPL', 'the plan', ''),
 ('4.22', 'The companies that build', 'the AI companies prepare too', 'a conference room: a few silhouettes, a whiteboard', 'MIX', 'the whiteboard', ''),
 ('4.23', 'This fall, they were reported', 'rehearsing a day of their own', 'the whiteboard: "DAY AFTER" SCENARIOS (+ Axios, 9 Oct 2026)', 'EXPL', 'the board', ''),
 ('4.24', 'The day after an', 'the day after an AI disaster', 'a short timeline on the board: AI DISASTER → THE DAY AFTER', 'EXPL', 'the arrow', ''),
 ('4.25', 'The day the public', 'the public and the politicians turn against them', 'two groups, THE PUBLIC and POLITICIANS, turn toward a building (arrows of attention, no torches, no crowd)', 'MIX', 'the building', ''),
 ('4.26', 'Already, more Americans', 'more oppose a data center than a nuclear plant', 'two bars: AI DATA CENTER 71% · NUCLEAR PLANT 53% (Gallup, March 2026)', 'EXPL', 'the bars', ''),
 ('4.27', 'To be fair', 'for some, just insurance', 'a bunker section with a policy card: INSURANCE', 'EXPL', 'the bunker', ''),
 ('4.28', 'Or a very expensive hobby', 'or an expensive hobby', 'its rooms fill with a few calm silhouettes at leisure: a spa, a rock wall, a go-kart track (+ source)', 'MIX', 'the cards', ''),
 ('4.29', 'The two owners you heard', 'the two owners say storms and bombs', 'two small cards: ZUCKERBERG: STORMS · ALTMAN: BOMBS', 'EXPL', 'the cards', ''),
 ('4.30', 'Not people', 'not people', 'under them: NOT PEOPLE', 'EXPL', 'the cards', ''),
 ('4.31', 'And one A.I. company', 'drills are practice, not a prediction', 'the whiteboard card returns: PRACTICE, NOT A PREDICTION (a word badge, no stamp) → plateBoard', 'EXPL', 'plateBoard', ''),
 # ---------------------------------------------------------------- c09 · B3 · the evidence chain, the turn
 ('5.01', 'But follow the trail', 'follow the trail', 'out of plateBoard: the evidence board, a gold thread starts at the first pin', 'EXPL', 'the thread', '★'),
 ('5.02', 'Guards', 'guards', 'the thread reaches GUARDS', 'EXPL', 'the thread', ''),
 ('5.03', 'Locks', 'locks', 'the thread reaches LOCKS', 'EXPL', 'the thread', ''),
 ('5.04', 'Mutiny plans', 'mutiny plans', 'the thread reaches MUTINY PLANS', 'EXPL', 'the test row', ''),
 ('5.05', 'None of that stops a storm', 'none of that stops a storm', 'a test row: STORM — the thread passes it, nothing holds (a cream ✗)', 'EXPL', 'the row', ''),
 ('5.06', 'Or a bomb', 'or a bomb', 'BOMB ✗', 'EXPL', 'the row', ''),
 ('5.07', 'Or a machine', 'or a machine', 'MACHINE ✗', 'EXPL', 'the last card', ''),
 ('5.08', "It's built against people", 'built against people', 'the thread ends at the last card, gold: AGAINST PEOPLE', 'EXPL', 'the list', ''),
 ('5.09', "They're not hiding from the A.I.", 'not hiding from the AI', 'the list comes back: the redaction on row 4 peels away', 'EXPL', 'row 4', ''),
 ('5.10', "They're hiding from us", 'they\'re hiding from us', 'row 4 reads US and is circled in gold; the circle opens into the Leitbild: the lantern crowd, the hatch (ANCHOR 2/3, the turn)', 'ANCHOR', 'the lanterns', ''),
 ('5.11', 'From a world where the gains', 'the gains go to a few, everyone else angry', 'the lanterns stand in a line; a light diagram: one huge pool of gold at a few, thin light for the rest: THE GAINS → A FEW', 'MIX', 'the line of lanterns', ''),
 ('5.12', "You probably don't feel", 'you don\'t feel like a threat', 'you in the yellow coat among the lanterns, ordinary, a shopping bag', 'ANCHOR', 'the hatch', ''),
 ('5.13', 'But from behind that door', 'from behind that door the fear makes sense', 'the view from inside the hatch up through the round opening: the crowd\'s lanterns above', 'ANCHOR', 'the opening', ''),
 ('5.14', 'So what would make', 'what would make the bunker unnecessary?', 'the list (all four resolved) slides away; a new question card: WHAT WOULD MAKE THE BUNKER UNNECESSARY?', 'EXPL', 'the card', ''),
 # ---------------------------------------------------------------- c10 · B3 · subscribe 1, Rushkoff's answer
 ('M.01', 'This channel exists', 'the channel: superintelligence goes well for everybody', 'subscribe 1 over the section: lanterns above, the bunker below; warm light spreads along the whole line', 'MIX', 'the hatch', ''),
 ('M.02', 'On both sides of that door', 'on both sides of that door', 'the hatch in section: gold light above and below it', 'MIX', 'the line', ''),
 ('M.03', 'Want that too', 'want that too?', 'a cream SUBSCRIBE tag rises out of the line (a tag, never a button)', 'MIX', 'the tag', ''),
 ('M.04', 'Then subscribe', 'then subscribe', 'the same tag, its underline draws', 'MIX', 'the table', ''),
 ('5.15', 'Remember the answer', 'the answer the five rolled their eyes at', 'callback: the table of the five, small', 'MIX', 'the table', ''),
 ('5.16', 'Treat your guards like friends', 'treat your guards like friends', 'the guards sit down at the same table, one shared lamp: LIKE FRIENDS', 'MIX', 'the lamp', ''),
 ('5.17', 'Right now#1', 'right now', 'RIGHT NOW rises under the table', 'EXPL', 'the table', ''),
 ('5.18', 'Invest, Rushkoff told them', 'invest in people and relationships', 'quote card Rushkoff (Survival of the Richest, 2018)', 'EXPL', 'the card', ''),
 ('5.19', 'Scale that up', 'scale it up, it stops sounding soft', 'the one table multiplies into many tables along the line', 'EXPL', 'the line', ''),
 ('5.20', "The best protection isn't", 'not a thicker door', 'two walls in section: the left one grows thicker and thicker: A THICKER DOOR', 'EXPL', 'the right wall', ''),
 ('5.21', "It's a world nobody wants", 'a world nobody wants to storm', 'the right wall stays thin; the lanterns before it stand calm: A WORLD NOBODY WANTS TO STORM', 'EXPL', 'the wall', ''),
 # ---------------------------------------------------------------- c11 · B3 · Switzerland, Helsinki, the pointe
 ('5.22', 'One country has built', 'one country built safety for everyone', 'the thin wall becomes the wall of a house in section (W is avoided: a morph)', 'MIX', 'the house', ''),
 ('5.23', 'In concrete#0', 'in concrete', 'its basement: a shelter with a thick door, concrete stipple', 'EXPL', 'the shelter', ''),
 ('5.24', 'Switzerland made it a rule', 'a protected place for every resident', 'each person in the house gets a gold place dot in the shelter: SWITZERLAND · SINCE 1963: A PLACE FOR EVERY RESIDENT', 'EXPL', 'the dots', ''),
 ('5.25', 'Today it has more shelter', 'more shelter places than people', 'pull back: house after house, every basement lit; two bars: PLACES > PEOPLE (+ ~9 MILLION PLACES · ~370,000 SHELTERS)', 'EXPL', 'a basement', '★'),
 ('5.26', 'Some are wine cellars', 'some are wine cellars or party rooms', 'two basements as rooms with people: a wine cellar, friends at a table; a party room under a string of lights', 'SCENE', 'the rock', ''),
 ('5.27', 'In Helsinki', 'Helsinki: playgrounds and swimming pools', 'a rock hall under the city, children on a playground slide, swimmers in a pool: HELSINKI, FINLAND', 'MIX', 'the hall', ''),
 ('5.28', 'A bunker for a few', 'a bunker for a few is a hiding place', 'beside the hall the small hook bunker with three figures: A HIDING PLACE', 'MIX', 'the hall', ''),
 ('5.29', 'A bunker for everyone', 'a bunker for everyone is a society', 'the rock hall full of figures: A SOCIETY', 'MIX', 'the hall', ''),
 ('5.30', 'But those shelters are built', 'those are built against bombs', 'AGAINST BOMBS on the hall; its doors open, everyone fits', 'EXPL', 'the doors', ''),
 ('5.31', 'A bunker against people', 'a bunker against people never has room for everyone', 'a bunker with guards; it grows, the queue grows with it and never fits', 'MIX', 'the queue', ''),
 ('5.32', 'Someone has to stay outside', 'someone stays outside', 'one figure always stays outside: SOMEONE STAYS OUTSIDE', 'MIX', 'the concrete', ''),
 # ---------------------------------------------------------------- c12 · B3 · two open cards
 ('5.33', 'So a world nobody wants', 'that world can\'t be poured in concrete', 'the concrete turns into paper', 'EXPL', 'the paper', ''),
 ('5.34', 'And how to build it', 'how to build it is an open argument', 'two open cards on the table, blank: OPEN', 'EXPL', 'card 1', ''),
 ('5.35', 'Tristan Harris has', 'Harris has the shortest answer', 'card 1 opens like a frame and grows into the clip plate (the same frame as C2 at 3:40, so the voice is recognised)', 'MIX', 'the plate', ''),
 ('5.36', 'slot:C2b', '("Don\'t build bunkers, write laws. Be invested in the future. Don\'t defect on the future. Be invested in the future.")', 'C2b · TRISTAN HARRIS · Co-founder, Center for Humane Technology · 2026 · ORIGINAL FOOTAGE (5.8 s; the MODERN | WISDOM bug bottom left stays visible)', 'CLIP', 'the plate shrinks back into card 1', ''),
 ('5.37', 'One has already been written', 'one law is written', 'card 1 becomes the bill: S. 5518 · MAKE AI WORK FOR AMERICANS ACT', 'EXPL', 'the bill', ''),
 ('5.38', 'If A.I. shakes up', 'if AI shakes up the job market: those who lose their jobs get at least 3/4 of their wage for half a year', 'you at a kitchen table with a letter; a wage bar fills to 75 % and stays open upwards: AT LEAST 75% · 26 WEEKS (KB3)', 'MIX', 'card 2', '★'),
 ('5.39', 'Others bet on the companies', 'others bet on the companies', 'card 2: A PROMISE', 'EXPL', 'card 2', ''),
 ('5.40', 'Microsoft has promised', 'data centers pay their own way, not the neighbours', 'a data centre at the edge of town; the power bill slides from the house to the data centre (+ source)', 'MIX', 'the cards', ''),
 ('5.41', 'Neither is done', 'neither is done', 'both cards side by side, open', 'EXPL', 'card 1', ''),
 ('5.42', "The bill hasn't passed", 'the bill hasn\'t passed', 'card 1: NOT PASSED (a word badge, no stamp)', 'EXPL', 'card 2', ''),
 ('5.43', "The promise isn't a law", 'the promise isn\'t a law', 'card 2: VOLUNTARY', 'EXPL', 'the plan', ''),
 ('5.44', "That world isn't built", 'that world isn\'t built yet', 'the two cards cover only a corner of a large blank sheet', 'EXPL', 'the sheet', ''),
 ('5.45', 'Whether it will be', 'lawmakers, companies and voters decide', 'three figures at the sheet: LAWMAKERS · COMPANIES · VOTERS (a ballot)', 'EXPL', 'the sheet', ''),
 # ---------------------------------------------------------------- c13 · B3 · the end: the door, the Earth at night
 ('E.01', 'So go back to that door', 'go back to that door', 'ANCHOR 3/3: the sheet folds into the hatch lid; the Leitbild', 'ANCHOR', 'the hatch', ''),
 ('E.02', 'The one that only opens', 'the one that only opens for a few', 'the tiny hatch against the lantern crowd', 'ANCHOR', 'the sky', ''),
 ('E.03', 'Now you know the reason', 'now you know the reason', 'the list, all four rows resolved', 'EXPL', 'row 2', ''),
 ('E.04', 'Not the machine', 'not the machine', 'row 2\'s strike pulses', 'EXPL', 'row 4', ''),
 ('E.05', 'The fear of everyone left', 'the fear of everyone left outside', 'row 4 US: the gold circle glows: EVERYONE LEFT OUTSIDE', 'EXPL', 'the circle', ''),
 ('E.06', 'And that fear points', 'that fear points at something true', 'the circle\'s light runs out as an arrow along the line', 'MIX', 'the arrow', ''),
 ('E.07', 'A future where a few win', 'a future where a few win everything isn\'t safe', 'the light diagram of 5.11 returns: all the light at a few', 'MIX', 'the pool', ''),
 ('E.08', 'Not even for the few', 'not even for the few', 'down in the section: the few alone in a big lit room', 'MIX', 'the shaft', ''),
 ('E.09', 'The safe one leaves', 'the safe one leaves no one outside', 'the view rises out of the ground over the land: lanterns everywhere, nobody at a door', 'ANCHOR', 'the lanterns', ''),
 ('E.10', "You can't build a bunker", 'no bunker for eight billion people', 'the lanterns become the lights of the Earth at night (the curve of the planet): MORE THAN 8 BILLION PEOPLE (UN, 2024)', 'MIX', 'the Earth', ''),
 ('E.11', 'You can only build', 'only a world where nobody needs one', 'the Earth at night turns slowly toward first light (no door, no hatch)', 'ANCHOR', 'the Earth', ''),
 ('A.01', 'This channel exists#1', 'the channel: superintelligence goes well for everybody', 'subscribe 2 over the Earth at night', 'ANCHOR', 'the Earth', ''),
 ('A.02', 'All eight billion', 'all eight billion of us', 'the lights of the Earth brighten a little', 'ANCHOR', 'the lights', ''),
 ('A.03', 'Want that too#1', 'want that too?', 'a cream SUBSCRIBE tag under the Earth (a tag, never a button)', 'ANCHOR', 'the tag', ''),
 ('A.04', 'Then subscribe#1', 'then subscribe', 'the same tag', 'ANCHOR', 'the end screen', ''),
 ('E.12', 'ENDSCREEN', '(end screen)', 'endScreen: the Earth at night high and calm, the first light at the rim; lower half quiet for the two tiles + the subscribe circle', 'ANCHOR', '', ''),
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
    if anchor == 'ENDSCREEN': return TM['duration'] - 15
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    return find(p, -1 if n else after, int(n) if n else 0)
times, prev = [], -1.0
for s in SHOTS:
    try: t = 0.0 if s[0] == 'H.01' else at(s[1], prev - .01)
    except SystemExit:
        t = prev + .01; print(f'  WARN {s[0]}: {s[1]!r} not in the timing yet (placed at {t:.1f} s)')
    times.append(t); prev = t
chunk_t = [0.0] + [at(c[2], -1) for c in CHUNKS[1:]]
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
rows, tot, wsum, cuts = [], 0.0, 0.0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order ({a:.1f} > {b:.1f})')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[4]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[4]]
    cuts += 'W' in s[6].split()
    rows.append((c, s, a, d))
share = wsum / tot
noclip = sum(d for c, s, a, d in rows if s[4] != 'CLIP')
share_nc = wsum / noclip
lay = {}
for c, s, a, d in rows: lay[s[4]] = lay.get(s[4], 0) + d
anc = sum(d for c, s, a, d in rows if s[4] == 'ANCHOR')
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 72 · "Why AI Billionaires Are Building Bunkers" · shot list (binding, Film-5 format)\n')
L.append(f'Generated by `tools/shots72.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'Spoken text: the newest `vo-vN.txt` in ROOT (the fact check writes vo-v3; anchors are phrases, `tools/anchors72.mjs` names any phrase that goes missing). '
         'Picture ideas follow text-v2.md (Szene / ON SCREEN) and kritik-v1.md M8, corrected by the binding picture concept (docs/MOTION.md); figures only from `F.SOURCES` (faktenzettel.md; MB points of faktencheck.md win).\n')
L.append('## 1 · The rules for every frame (REGELN §13)\n')
L.append('- A motion-design film, not one world with zooms: **every picture shows exactly what its sentence says** (column *zeigt wörtlich*). Typography, cross-sections, plans, cards, objects that turn into the next object; one motif per sentence.')
L.append('- 60–70 % explainer graphics (THE LIST, the bunker clock, floor plans, the evidence board, shelter maps, numbers, quote cards, the two open cards) on THE GROUND LINE stage (lib/f72_stage.mjs), the rest scenes and clips. World rides count 0 — there are none.')
L.append('- The Leitbild (thumbnail A2: the night valley, the crowd of gold lanterns, the round hatch half open in the slope, you beside it) ONLY at 3 anchors: hook (H.01, H.08), the turn (5.10, 5.12–5.13), the end (E.01–E.02, E.09–E.12 with the Earth at night).')
L.append('- Every change over a carrier object, no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (still < 5 %, none > 2 s).\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** of the whole film (target 60–70 %); without the clip seconds: **{share_nc * 100:.1f} %**. Weights: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0, per second of picture.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + f' (ANCHOR incl. the 15 s end screen: {anc:.0f} s).')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min).')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} shots are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}). Zooms and pans never count as new.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. THE LIST (F.list) appears only when the question returns, never as a HUD, never on a door.\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| THE LIST "WHAT ARE THEY HIDING FROM?" (1 THE BOMB · 2 THE MACHINE · 3 THE CHAOS · 4 ▮▮▮) | H.09, H.14–H.16 | 1.01–1.05, 1.23–1.24 (row 1 REAL, BUT OLD), 1.28, 2.25 (row 2 CROSSED OFF), 3.13, 3.22–3.24 (row 3 half strike: STAYS · FOR A WHILE), 3.29 (row 4 flickers), 5.09–5.10 (row 4 US, circled), 5.14 (new question), E.03–E.05 |')
L.append('| the hatch + the lantern crowd (Leitbild A2) | H.01, H.08 | 5.10, 5.12–5.13 (from behind that door), E.01–E.02, E.09 → the lanterns become the lights of the Earth (E.10) |')
L.append('| the door filled with concrete (in section) | H.06–H.07 | 1.07 (real), 2.12 (has to open), 5.20 (a thicker door), 5.23 (Swiss shelter door), M.02 (both sides) |')
L.append('| the AI disc (cool, a disc, never a robot) | H.03, H.13 | H.14–H.15, 1.27–1.28, 2.03–2.14, 2.20–2.22 (build it right) |')
L.append('| THE GROUND LINE: out here / down there | H.02, H.06 | 2.07, 2.23–2.24, 3.25–3.29, M.01–M.02, E.08–E.09 |')
L.append('| the bunker clock (supplies draining on a time axis) | 2.12 (the level drains) | 3.09–3.12, 3.23 |')
L.append('| the five at the table, the guards, Rushkoff\'s answer | 4.02, 4.07–4.14 | 4.17, 5.15–5.18 |')
L.append('| the investors\' question | 4.04 (C3) | 4.21 (in the floor plans), 5.01–5.08 (the trail) |')
L.append('| the glass room (the people building AI) | H.02–H.05, H.10 | 2.16, 4.17 |')
L.append('| "a world nobody wants to storm" | 5.21 | 5.33, 5.44 (not built yet) |')
L.append('| a few vs everyone (the light pool) | H.08, 5.11 | 5.28–5.32, E.07–E.08, E.10 |\n')
L.append('## 4 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2]} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b, 0.0, 0.0]); g[1] = b
for c in CHUNKS: grp[c[1]][2] += per[c[0]][0]; grp[c[1]][3] += per[c[0]][1]
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s, share {v[3] / max(1e-6, v[2]) * 100:.0f} %)' for k, v in grp.items()) + '\n')
L.append('## 5 · Shots\n')
L.append('Columns: ID · anchor (phrase) · t (provisional) · len · **zeigt wörtlich** (what the sentence says) · **neu?** (§13.1a) · picture (what moves and what it becomes) · layer · carrier → next · flags.')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | zeigt wörtlich | neu? | picture | layer | carrier → next | |')
        L.append('|---|---|---|---|---|---|---|---|---|---|')
    an = s[1].replace('#1', ' (2nd)').replace('#0', '')
    neu = ('nein: ' + NOT_NEW[s[0]]) if s[0] in NOT_NEW else 'ja'
    L.append(f'| {s[0]} | {an} | {fmt(a)} | {d:.1f} | {s[2]} | {neu} | {s[3]} | {s[4]} | {s[5]} | {s[6]} |')
L.append('\n## 6 · Seams between the groups (lib/f72_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | There are three obvious suspects | plateList (THE LIST centred at the stage's sheet coordinates: title WHAT ARE THEY HIDING FROM?, row 2 THE MACHINE with a ?, row 4 a redaction bar, rows 1 and 3 empty; the ground line low in the frame) | H.16: the list settles | 1.01: the numbers light, rows 1 and 3 write |")
L.append("| B1 → B2 | Ask the people who sell them | plateBunker (a schematic bunker in section under the ground line: hatch shut, shaft, ladder, one long room with EMPTY shelves, a thin time axis under it, not yet labelled) | 3.07: the blank tags fold into it | 3.08: the seller steps up, 3.09 the shelves fill |")
L.append("| B2 → B3 | But follow the trail | plateBoard (the evidence board: three cards pinned left → right, GUARDS · LOCKS · MUTINY PLANS, a fourth pin empty at the right; no thread yet) | 4.31: the drills card joins the board, settles | 5.01: the gold thread starts |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push) and breathe. Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md ON SCREEN lines, as `F.SOURCES` in lib/f72_kit.mjs (statement ≤ 6 words + one number; the long rest goes into the source line, `F.source`, 22 px at y 880). On screen "AI" / "AGI", never "A.I.". If vo-v3 / faktencheck.md (MB points) changes a figure, the lead updates `F.SOURCES`; builders never retype a figure.')
L.append('- No sponsor, no QR. No logos, no flags. No real faces outside the clips (people are calm, fair silhouettes; no villains, no grotesque rich men). No AI images, no robots (the investors\' "robots as guards" is words only). Never red (the router blinks cream).')
L.append('- Not repeated from earlier films (MOTION.md §6): no frontal door or vault door with a gold light slit (#55, #14), no keys, no clock face, no hourglass, no calendar flipping, no rubber stamps (verdicts are words that rise or a small badge), no blueprint grid (#69: our floor plans are cream line drawings on night, no grid), no lifeline / stone / THE ANSWER (#73), no globe-as-a-world (the Earth appears ONCE, at the end, as the planet at night).')
L.append('- Clips (checked, ROOT clips-geprueft.json 25.11., slots = length + .3 s): C1 Altman 7.6 s · C2 Harris 5.6 s · C3 Rushkoff 10.3 s · C2b Harris 5.8 s (same episode as C2). Lower thirds via `F.CLIPS` (the json overrides). C2 and C2b: the MODERN | WISDOM bug bottom left stays visible (do not crop it). Frames: /tmp/claude-0/f72/clips/<id>/ (until then a marked placeholder).')
_j = json
_j.dump([[s[0], s[1].partition('#')[0], int(s[1].partition('#')[2] or 0)] for s in SHOTS if not s[1].startswith('slot:') and s[1] != 'ENDSCREEN'], open(os.path.join(HERE, '..', 'data', 'anchors72.json'), 'w'), indent=0)
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:',
      {k: (round(v[1] - v[0]), f'{v[3] / max(1e-6, v[2]) * 100:.0f}%') for k, v in grp.items()}, 'layers', {k: round(v) for k, v in lay.items()})
print('chunks:', {c[0]: f'{per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f}%' for c in CHUNKS})
