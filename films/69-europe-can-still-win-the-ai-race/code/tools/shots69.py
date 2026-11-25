#!/usr/bin/env python3
"""Film 69 · "Europe Can Still Win the AI Race" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13). Times from the
current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json.
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots69.py
Every shot: id (H = hook, 1…10 = the sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up after the previous
shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'ENDSCREEN' = duration − 15), zeigt wörtlich (what the
sentence says, shown), the picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (REGELN §13.3/§13.7, docs/MOTION.md §1):
  EXPL 1.0 (a diagram on THE PLAN SHEET: numbers, comparisons, processes, timelines, a simple light map, the kit big) · MIX .5 (a scene
  element with a diagram on it, a clip plate growing, a callback) · ANCHOR 0 (the Leitbild: the puzzle moon over the night sea, only 4×)
  · SCENE 0 (you, rooms, people) · CLIP 0. World rides count 0 (there are none).
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F69ROOT', '/mnt/project-files/scenario/film-europa-ki/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Europe can still win'), ('c02', 'B1', 'Those chip machines'), ('c03', 'B1', 'Money first'), ('c04', 'B1', 'But why does it matter'),
          ('c05', 'B1', 'Because a company that wants'), ('c06', 'B2', 'None of it runs'), ('c07', 'B2', 'This channel exists'), ('c08', 'B2', 'And a lab is an empty'),
          ('c09', 'B3', 'So suppose all five'), ('c10', 'B3', 'The other prize'), ('c11', 'B3', "So that's where the plan"), ('c12', 'B3', 'This channel exists#1')]
# §13.1a 'Motiv neu?': every shot is a new motif (own place, person, moment or graphic) EXCEPT these (sentence adds no new picture; zoom ≠ new):
NOT_NEW = {'H.09': 'same disc, the question as type', '1.12': 'same anchor, the 5th slot stays dark', '7.04': 'same desk, her hand moves', '10.04': 'same two tracks, a runner joins', 'A.01': 'same final picture'}
# id | anchor phrase | zeigt wörtlich | picture (motion design: what moves, what it becomes) | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs)
 ('H.01', 'Europe can still win', 'Europe can still win', 'ANCHOR 1/4 · thumbnail A: the puzzle moon (4 gold parts, 1 gap) in the ring of 12 stars, you on the roof lift the 5th piece; EUROPE CAN / STILL WIN AI', 'ANCHOR', 'the moon', ''),
 ('H.02', 'Everyone says', 'everyone says it lost: too slow, too small, too many rules', 'the title sinks, the gold drains out of the moon, you lower the piece; three paper headline tiles slide in on the words and tip away', 'MIX', 'the moon = a circle', ''),
 ('H.03', 'And whoever builds', 'whoever builds it gets a say in how it treats you', 'MATCH CUT moon → the AI\'s iris (same place, same size); pull back: the AI screen on a desk; WHOEVER BUILDS IT · GETS A SAY; its cool beam swings onto you', 'MIX', 'the screen', 'W'),
 ('H.04', 'Which AI reads', 'an AI reads your contract', 'your contract slides across the desk to the screen, a cool line reads it: YOUR CONTRACT', 'EXPL', 'the sheet flips', ''),
 ('H.05', 'Sits in on your job', 'it sits in on your job interview', 'the sheet flips into a CV, the person opposite becomes the interviewer, the screen between you: YOUR JOB INTERVIEW', 'EXPL', 'the sheet flips', ''),
 ('H.06', 'Says yes or no', 'it says yes or no to your loan', 'the sheet flips into a loan form; a switch over the screen flips YES on "yes", NO on "no": YOUR LOAN', 'EXPL', 'pull back', ''),
 ('H.07', 'Wherever you live', 'wherever you live', 'pull back: the desk is one window of a town of windows, roofs of many kinds (also outside Europe), in every window the same cool screen between two people', 'SCENE', 'the skyline sinks', ''),
 ('H.08', 'Right now, almost none', 'almost none of that AI is European', 'the skyline sinks; behind it the plan disc rises: five outlines, empty (the Europe board stays empty)', 'MIX', 'the disc', ''),
 ('H.09', 'So how could Europe', 'how could Europe still win?', 'HOW COULD EUROPE STILL WIN? under the empty disc', 'MIX', 'the disc outline', ''),
 ('H.10', 'Guess how much', 'guess the EU share of the world\'s AI computing power', 'the disc outline breaks into 100 squares that fly into a 10 × 10 field: THE WORLD\'S AI COMPUTING POWER; it pulses (guess)', 'EXPL', '5 cells', ''),
 ('H.11', 'About five percent', 'about five percent', '95 cells fall dark, 5 stay gold and slide together: ABOUT 5% + source line', 'EXPL', 'the 5 gold cells', ''),
 ('H.12', 'And yet', 'the only machines for the top chips are built in Europe, then shipped away', 'the 95 cells drop away, the 5 gold cells fly onto a window row: the chip machine grows out of them (THE ONLY MACHINES FOR TOP CHIPS · BUILT IN EUROPE), a ground line draws out; on "shipped away" it rolls out to the right', 'MIX', 'the machine uncovers a person', ''),
 ('H.13', 'Many of the people', 'the people who build AI are trained in Europe, then hired away', 'where the machine stood, a person: TRAINED IN EUROPE; the same exit to the right: HIRED AWAY', 'MIX', 'the ground line', ''),
 ('H.14', 'And the European Union has more people', 'the EU has more people than the US', 'two crowds rise out of the ground line: EU 45 figures, US 34 (1 figure = 10 million, source line)', 'EXPL', 'the TOO SMALL tile', ''),
 ('H.15', "So Europe isn't too small", 'Europe isn\'t too small', 'the TOO SMALL tile from H.02 drops onto the EU crowd and is struck through in light', 'EXPL', 'the crowd gathers', ''),
 ('H.16', "It's in twenty-seven pieces", 'it is in 27 pieces', 'the EU crowd streams into one gold disc, which bursts into 27 crates (rows): 27 PIECES; the US crowd walks off right', 'EXPL', 'the crates', '★'),
 ('H.17', 'Twenty-seven countries', '27 countries, 27 sets of rules', 'a rule booklet lands on each crate, one by one: 27 SETS OF RULES', 'EXPL', 'the plan slides in', ''),
 ('H.18', 'And the plan to put them together', 'the plan is already on the table', 'the plan sheet slides onto the table beside the crates, its five outlines draw on; a small drawing of the machine in its corner', 'MIX', 'the dates', ''),
 ('H.19', 'This winter', 'this winter the first decisions are due', 'two date tags pin above the plan (EU BUDGET SUMMIT 26–27 NOV 2026 · AI GIGAFACTORY BIDS DUE 3 DEC 2026); the machine drawing lifts off and grows into plateMachine', 'EXPL', 'the machine → plateMachine', ''),
 # ---------------------------------------------------------------- c02 · B1 · station 1, the plan, the turn
 ('1.01', 'Those chip machines', 'one company, in a Dutch town', 'out of plateMachine: pull back, the machine stands in a long hall; the hall on a simple town plan (canal lines, no borders): ASML · VELDHOVEN, NETHERLANDS', 'MIX', 'the machine', ''),
 ('1.02', 'Each is the size of a bus', 'the size of a bus', 'a city bus silhouette rolls in beside the machine: same length (measuring line)', 'EXPL', 'the machine', ''),
 ('1.03', 'Shipping one fills', 'shipping one fills three cargo jets', 'the machine comes apart into crates, the crates load into three cargo jets (side view, they line up): EUV LITHOGRAPHY + source (40 containers, 20 trucks, 3 jets)', 'EXPL', 'the jets fly right', ''),
 ('1.04', 'And almost every advanced', 'almost every advanced AI chip was printed by one', 'the beam prints one chip; chips stream out by the hundreds, each with a thin cool line back to the machine', 'EXPL', 'the lines', ''),
 ('1.05', 'This year, by its own', 'this year: nothing sold in Europe', 'sales arrows from the machine to the right (away) thicken; the arrow to Europe stays empty: 0% SOLD TO EUROPE + source (H1 2026, 2024: 5%)', 'EXPL', 'the empty arrow', '★'),
 ('1.06', 'So the strengths are real', 'the strengths are real, just not connected', 'three strengths as three lights on the sheet (the machine, the savings, the minds); a dashed line tries to connect them and breaks', 'EXPL', 'the dashed line', ''),
 ('1.07', 'The plan to connect them', 'Draghi wrote the plan down', 'the dashed line rolls up into a report: THE DRAGHI REPORT · SEPT 2024 · €750–800 BILLION A YEAR', 'EXPL', 'the report cover', ''),
 ('1.08', 'A year later, he gave', 'a year later, his verdict', 'the report cover grows into the clip plate (morph)', 'MIX', 'the plate', ''),
 ('1.09', 'slot:C1', '(Draghi: "a harder place")', 'C1 · MARIO DRAGHI · Former President, European Central Bank · 2025 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the report', ''),
 ('1.10', 'A harder place', 'only one in six proposals fully carried out', 'the report opens into a field of 383 small squares; 60 fill gold: 1 IN 6 PROPOSALS DONE + source (EPIC, July 2026)', 'EXPL', 'the field folds into five outlines', ''),
 ('1.11', 'For AI, five parts', 'five parts: money, rules, energy, a lab, minds', 'ANCHOR 2/4 (the turn): the puzzle moon over the night sea; on each word one piece lights with its name: THE MONEY · ONE SET OF RULES · THE ENERGY · ONE LAB · THE MINDS', 'ANCHOR', 'the fifth piece', 'W'),
 ('1.12', "That last one can't be built", 'the last one cannot be built, it must be won', 'the fifth slot stays dark; the piece is in your hands on the roof', 'ANCHOR', 'the moon shrinks', ''),
 ('1.13', 'One test for all five', 'really there, or only on paper?', 'the moon shrinks into the HUD top right of the plan sheet: REALLY THERE, / OR ONLY ON PAPER?', 'EXPL', 'the HUD', 'W'),
 # ---------------------------------------------------------------- c03 · B1 · part 1, the money
 ('2.01', 'Money first', 'part 1: money', 'the HUD disc grows big, piece 1 THE MONEY opens like a door (Fach 1 wird groß)', 'EXPL', 'piece 1', ''),
 ('2.02', 'In the European Union, households keep', 'households keep €10 trillion in bank accounts', 'inside piece 1: one kitchen table (a savings book, a phone balance), then the camera pulls back over thousands of identical lit kitchen windows: €10 TRILLION IN BANK DEPOSITS + source', 'MIX', 'one window', '★'),
 ('2.03', 'If you live there', 'part of it is yours', 'one window warms: you at your table (yellow coat)', 'SCENE', 'a string from the window', ''),
 ('2.04', 'A young AI company in Paris', 'a young AI company barely sees any of it', 'a small start-up block pulls on a string that ends at the vault; the string does not give', 'MIX', 'the string snaps back', ''),
 ('2.05', 'So its founders fly to California', 'its founders fly to California', 'a plane lifts off the block and leaves right; two bars: US $285.9 BILLION · EUROPE $20.9 BILLION + source', 'EXPL', 'the bars', ''),
 ('2.06', "The plan isn't to take", 'make investing at home easier, not taking savings', 'two paths from the vault; one widens towards the start-ups (no taking, the vault stays full)', 'EXPL', 'the wide path', ''),
 ('2.07', "Most of it isn't law yet", 'most of it isn\'t law yet', 'the wide path is only dashed: MOSTLY NOT LAW YET + source', 'EXPL', 'the dashed path', ''),
 ('2.08', 'Critics warn', 'critics: markets mean risk for savers', 'the path tilts over a drop: CRITICS: MORE RISK FOR SAVERS + source', 'EXPL', 'a bar', ''),
 ('2.09', 'But the money going into', 'start-up money up by more than half', 'a bar grows, its last part dashed (a projection): START-UPS: ON TRACK FOR +62% + source (Atomico projection, MB1)', 'EXPL', 'the bar becomes a vessel', ''),
 ('2.10', 'Europe now has its own fund', 'a fund so start-ups can grow without leaving', 'the bar becomes a vessel: SCALEUP EUROPE FUND · €5 BILLION TARGET; a block grows taller in place instead of flying right', 'EXPL', 'a line from the vessel', ''),
 ('2.11', 'One of its first bets', 'one bet: Mistral', 'a line from the vessel to one block: MISTRAL AI · PARIS + source', 'EXPL', 'the machine drawing', ''),
 ('2.12', 'A year earlier, Mistral', 'the machine maker led Mistral\'s round: connected', 'the machine piece from station 1 slides in and clicks into the money piece: ASML LED MISTRAL\'S ROUND · €1.3 BILLION', 'EXPL', 'piece 1', '★'),
 ('2.13', 'So, the money: halfway', 'the money: halfway', 'the kit: piece 1 seats only half (gold, pushed half out): HALFWAY', 'EXPL', 'the Mistral block', ''),
 # ---------------------------------------------------------------- c04 · B1 · why it matters
 ('3.01', 'But why does it matter', 'why does it matter where a company lives?', 'the Mistral block on the sheet with a small home line; the question beside it', 'EXPL', 'the block\'s window', ''),
 ('3.02', 'Arthur Mensch runs Mistral', 'Mensch sells the alternative, has a stake', 'the block\'s window grows into the clip plate (HE SELLS THE ALTERNATIVE as a small tag before)', 'MIX', 'the plate', ''),
 ('3.03', 'slot:C2', '(Mensch: "a client state")', 'C2 · ARTHUR MENSCH · CEO, Mistral AI · 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks', ''),
 ('3.04', 'A client state', 'a client state: defence, public services', 'A CLIENT STATE; two buildings (DEFENCE, PUBLIC SERVICES) whose cables run right into one foreign plug', 'EXPL', 'the plug', ''),
 ('3.05', "And a client doesn't get a say", 'a client doesn\'t get a say', 'callback to H.03: the desk screen, the beam on you, GETS A SAY dims to grey', 'MIX', 'the screen', ''),
 ('3.06', 'So Europe needs companies', 'companies that grow up at home; money alone won\'t do it', 'a block grows at home; the money piece alone does not hold it (MONEY ALONE WON\'T DO IT)', 'EXPL', '27 stacks', ''),
 # ---------------------------------------------------------------- c05 · B1 · part 2, one set of rules
 ('4.01', 'Because a company that wants', '27 different company laws', 'piece 2 opens big; behind it 27 file stacks in a row: 27 COMPANY LAWS', 'EXPL', 'the stacks', ''),
 ('4.02', 'The plan has a fix', 'one company valid in all 27, online in two days, under €100', 'the 27 stacks fold into one sheet: "EU INC" · ONLINE IN 48 HOURS · UNDER €100 + source', 'EXPL', 'the sheet', '★'),
 ('4.03', "But it's held up", 'held up in the European Parliament', 'the sheet stops at a hemicycle of seats (no party colours): PARLIAMENT: NO POSITION YET + source', 'EXPL', 'the table', ''),
 ('4.04', 'Unions fear', 'unions fear for workers\' rights', 'SCENE: workers at a negotiating table with the sheet (not villains), a fair worry', 'SCENE', 'the sheet', ''),
 ('4.05', 'A fair worry', 'not before 2028', 'a timeline 2026 → 2028 draws out: NOT BEFORE 2028 + source', 'EXPL', 'the timeline', ''),
 ('4.06', 'So that one set of rules', 'one set of rules: still on paper', 'piece 2 turns cream paper, dashed edge: ON PAPER → plateEnergy (the disc big, piece 3 pulsing)', 'EXPL', 'plateEnergy', ''),
 # ---------------------------------------------------------------- c06 · B2 · part 3, the energy
 ('5.01', 'None of it runs', 'AI data centres need enormous electricity', 'out of plateEnergy: push into piece 3: a data centre, thick cables arrive at it', 'MIX', 'the cables', ''),
 ('5.02', 'And for heavy industry', 'industry power costs more than twice the US', 'two price bars: MORE THAN 2× US PRICES + source (industry, not households)', 'EXPL', 'the bar', ''),
 ('5.03', 'But not everywhere', 'Sweden\'s north: hydropower · France: reactors', 'a simple light map (coast lines only, no borders, no flags): the north glows (dam), France glows (reactors): labels + source', 'EXPL', 'the two glows', ''),
 ('5.04', 'So the idea: build', 'build the biggest data centres where the power is', 'data-centre blocks slide onto the two glows', 'EXPL', 'seven slots', ''),
 ('5.05', 'Europe wants up to seven', 'up to seven, bids due 3 December', 'seven slots on the map; a lit window: a bid team uploading at night; UP TO 7 AI GIGAFACTORIES · BIDS DUE 3 DEC 2026', 'MIX', 'a budget bar', ''),
 ('5.06', 'But much of the public money', 'much of the public money depends on the next budget', 'a budget bar UP TO €10 BILLION PUBLIC, half EU / half national; COMMITTED NOW: €1 BILLION EU (matched) lights, €4 BILLION MORE EU MONEY is a dashed box EU BUDGET 2028–2034 (MB2)', 'EXPL', 'the 100 cells', ''),
 ('5.07', 'And even if all of them', 'Europe\'s 5% barely moves', 'the 100 cells from H.10 return: 5 gold cells → 5.6 (barely more): ≈ 5.6% IN 2031 + source', 'EXPL', 'the cells', ''),
 ('5.08', 'So this part is halfway', 'halfway; Europe won\'t have the most computers', 'piece 3 seats halfway: HALFWAY', 'EXPL', 'the machine', ''),
 ('5.09', "It doesn't have to", 'it has to be needed: the one machine', 'the machine lights up in the plan; all chip lines of 1.04 converge on it: NEEDED, NOT BIGGEST + Bruegel', 'EXPL', 'the machine light', '★'),
 # ---------------------------------------------------------------- c07 · B2 · subscribe 1 + part 4, one lab
 ('M.01', 'This channel exists', 'subscribe, wherever you live', 'SCENE: the town of windows from H.07, now warm, you at your window; no QR', 'SCENE', 'the HUD', 'W'),
 ('6.01', 'Europe does need enough', 'enough computers, enough for what?', 'piece 4 opens big: a rack-less outline of compute, a ? beside it', 'EXPL', 'the outline', ''),
 ('6.02', 'For one shared lab', 'one shared lab for the most advanced AI', 'small streams of light from many points flow into one lab building', 'EXPL', 'the streams', ''),
 ('6.03', 'Europe has done this before', 'after the war: one physics lab; the Web was invented there', 'the streams sink into a ring under the ground (CERN, a diagram), a thin line leaves it: THE WORLD WIDE WEB · CERN · 1954', 'EXPL', 'the ring', '★'),
 ('6.04', "It's called CERN", 'a "CERN for AI" was promised', 'a second ring draws beside it: A CERN FOR AI (no quote marks, KB5) + source with her 2024 wording', 'EXPL', 'the small ring', ''),
 ('6.05', 'So far, that promise', 'a pilot of about €100 million', 'the new ring shrinks to a small one: €107 MILLION PILOT + source; then the CAIRNE line (MB3: “NOTHING OF THE SORT”)', 'EXPL', 'the ring', ''),
 ('6.06', 'In November, she named', 'she named the price of really catching up', 'the small ring grows into the clip plate', 'MIX', 'the plate', ''),
 ('6.07', 'slot:C3', '(von der Leyen: "at least 500 billion")', 'C3 · URSULA VON DER LEYEN · President, European Commission · 2026 · ORIGINAL FOOTAGE · © European Union, 2026', 'CLIP', 'the plate shrinks', ''),
 ('6.08', 'At least five hundred', 'at least €500 billion: an estimate, not a budget', 'a huge dashed outline (the estimate) beside the tiny pilot ring: AT LEAST €500 BILLION · AN ESTIMATE, NOT A BUDGET + source COMMISSION’S OWN ESTIMATE (KB11)', 'EXPL', 'piece 4', ''),
 ('6.09', 'A name and a pilot', 'a name and a pilot: on paper', 'piece 4 turns paper: ON PAPER', 'EXPL', 'the empty lab', ''),
 # ---------------------------------------------------------------- c08 · B2 · part 5, the minds
 ('7.01', 'And a lab is an empty', 'a lab is empty without minds', 'the lab building from 6.02, dark and empty; piece 5 big, the slot empty', 'EXPL', 'a lit window', ''),
 ('7.02', 'Picture a researcher in Paris', 'a researcher with two offers', 'SCENE: her desk at night, two letters (EUROPE · AMERICA), her hand above both (the one scene with a person: time)', 'SCENE', 'the right letter', 'W'),
 ('7.03', 'The other, in America', 'up to 70% more pay', 'the right letter: UP TO +70% + salary source line', 'MIX', 'her hand', ''),
 ('7.04', 'Many take it', 'many take it', 'she reaches for the right letter; cut before she has it', 'SCENE', 'a stock option tag', ''),
 ('7.05', "Part of Europe's answer", 'stock options, same everywhere, taxed on sale', 'a small option certificate: STOCK OPTIONS, TAXED ON SALE + source', 'EXPL', 'the certificate', ''),
 ('7.06', 'But look where that answer sits', 'it sits inside the paper company', 'zoom out: the certificate sits inside the "EU INC" paper sheet from 4.02; the minds piece tries to click and finds only paper', 'EXPL', 'the ground line', ''),
 ('7.07', 'And yet, something has shifted', 'researchers leaving for America: almost half fewer', 'the "hired away" exit of H.13 again: half as many figures walk right: −45% IN TWO YEARS + source', 'EXPL', 'the figures', '★'),
 ('7.08', 'A few are even moving', 'a few move the other way', 'a few figures walk right → left (coming back): "CHOOSE EUROPE FOR SCIENCE" + source', 'EXPL', 'piece 5', ''),
 ('7.09', 'So the fifth part stays open', 'the fifth part stays open, won one person at a time', 'piece 5 stays out, lying beside the disc: OPEN → plateFour', 'EXPL', 'plateFour', ''),
 # ---------------------------------------------------------------- c09 · B3 · the second race
 ('8.01', 'So suppose all five', 'suppose all five come together', 'out of plateFour: the four seated parts light, the fifth beside', 'EXPL', 'the rim', ''),
 ('8.02', 'Not the biggest chatbot', 'not the biggest chatbot; a second race: putting AI to work', 'two race tracks draw out of the disc rim: THE MOST COMPUTERS (crowded) · PUTTING AI TO WORK (workshops along it)', 'EXPL', 'a workshop', ''),
 ('8.03', 'One satellite maker', 'design changes from weeks to hours', 'SCENE: an engineer turns a satellite on a screen, calendar sheets behind shrink to hours: WEEKS → HOURS + source (KB7: partnership line until the panel video is checked)', 'MIX', 'the works', 'W'),
 ('8.04', 'And more than half', 'over-100-year-old companies, knowledge never online', 'the old works: decades of design data light up over the machines; the internet ends at the works wall: OVER 100 YEARS OLD · ONLY 20% USE AI + sources', 'EXPL', 'the works window', '★'),
 ('8.05', 'That argument comes from', 'Koerte, Siemens, not neutral', 'the works window grows into the clip plate', 'EXPL', 'the plate', ''),
 ('8.06', 'slot:C4', '(Koerte: "none of us can do it alone")', 'C4 · PETER KOERTE · Chief Technology Officer, Siemens · 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks', ''),
 ('8.07', 'No single company', 'alone too little data, together enough', 'many small data boxes, each too small, slide together into one block: TOGETHER, ENOUGH DATA', 'EXPL', 'the block → the machine', ''),
 # ---------------------------------------------------------------- c10 · B3 · a say in the rules
 ('9.01', 'The other prize', 'the other prize: a say in the rules', 'the machine on a negotiating table', 'EXPL', 'lines', ''),
 ('9.02', 'A say goes to whoever', 'a say goes to whoever builds what others need', 'all chip lines converge on the machine again (callback 5.09)', 'EXPL', 'the machine', ''),
 ('9.03', 'But it only counts', 'one voice: today the Dutch government decides, Washington has a say, China builds its own', 'three hands at the machine (THE NETHERLANDS · WASHINGTON · CHINA, a prototype outline): ONE VOICE + source', 'EXPL', 'two boards', ''),
 ('9.04', 'How to get to one voice', 'more shared money, or fewer rules', 'two equal boards, no party colours: MORE SHARED MONEY · FEWER RULES', 'EXPL', 'the plan', ''),
 ('9.05', 'Who settles it', 'governments, parliament, investors, voters', 'four hands on the plan, the last lays a ballot beside it: GOVERNMENTS · PARLIAMENT · INVESTORS · VOTERS', 'EXPL', 'the plan', ''),
 # ---------------------------------------------------------------- c11 · B3 · verdict
 ('10.01', "So that's where the plan", 'two halfway, two on paper, one to be won', 'ANCHOR 3/4 (the verdict): the puzzle moon big over the sea, every piece labelled (kitHud big): 2 HALFWAY · 2 ON PAPER · 1 OPEN', 'ANCHOR', 'the pieces', 'W'),
 ('10.02', 'None is finished', 'none finished, every one started', 'a small date tag lights at each piece (FUND FOUNDED AUG 2026 …)', 'EXPL', 'the tracks', ''),
 ('10.03', 'Can Europe still win', 'the race for the most computers: no', 'back on the sheet: the two tracks of 8.02: THE MOST COMPUTERS: NO', 'EXPL', 'the second track', 'W'),
 ('10.04', 'The race to put AI to work', 'putting AI to work: yes', 'a runner on the second track: PUTTING AI TO WORK: YES', 'EXPL', 'the desk', ''),
 ('10.05', 'And with it, a voice', 'a say in which AI sits in on your job interview', 'callback H.05: the job-interview desk, now a European screen at the table (a gold edge)', 'MIX', 'the report', ''),
 ('10.06', 'Mario Draghi, who wrote', 'Draghi, who wrote the plan, now says', 'the report from 1.07 grows into the clip plate', 'MIX', 'the plate', ''),
 ('10.07', 'slot:C1b', '(Draghi: "the option to become a genuine power")', 'C1b · MARIO DRAGHI · Former President, European Central Bank · 2026 · ORIGINAL FOOTAGE (centre crop)', 'CLIP', 'the plate shrinks', ''),
 ('10.08', 'An option. With a clock', 'an option with a clock: the budget this winter', 'a budget timeline: SPECIAL SUMMIT 26–27 NOV 2026 · AGREEMENT SOUGHT IN DECEMBER · EU BUDGET 2028–2034', 'EXPL', 'three pictures', ''),
 ('10.09', 'Europe builds the machines', 'machines, savings, minds', 'harvest: the machine, the kitchen window, the two letters, one after another', 'MIX', 'the moon', ''),
 ('10.10', 'Europe was never too small', 'never too small; will it put itself together in time?', 'ANCHOR 4/4 (the end): thumbnail A again; the 27 lights on the sea link up; you lift the fifth piece toward the gap', 'ANCHOR', 'the final picture', 'W'),
 # ---------------------------------------------------------------- c12 · B3 · subscribe 2 + end screen
 ('A.01', 'This channel exists#1', 'subscribe: more voices at the table', 'subscribe 2 over the final picture (the moon, you), no QR', 'ANCHOR', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', '(end screen)', 'END SCREEN (S.endScreen): the moon centred high, 2 HALFWAY 2 ON PAPER 1 OPEN, the 27 lights linked, you small lifting the 5th piece; lower half calm for the tiles', 'ANCHOR', '—', ''),
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
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[4]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[4]]
    cuts += 'W' in s[6].split()
    rows.append((c, s, a, d))
share = wsum / tot
noclip = sum(d for c, s, a, d in rows if s[4] != 'CLIP')
share_nc = wsum / noclip
lay = {}
for c, s, a, d in rows: lay[s[4]] = lay.get(s[4], 0) + d
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 69 · "Europe Can Still Win the AI Race" (EUROPE CAN STILL WIN AI) · shot list (binding, Film-5 format)\n')
L.append(f'Generated by `tools/shots69.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'Spoken text: the newest `vo-vN.txt` in ROOT (fact-checked v3 may change lines; anchors are phrases, `T.G` names any phrase that goes missing). Picture ideas follow text-v2.md PICTURE/OVERLAY; on-screen lines follow faktencheck.md (MB1–MB3, KB1–KB11, 24.11.), which wins against text-v2.\n')
L.append('## 1 · What Jakob said, as rules for every frame (REGELN §13, 24.11.)\n')
L.append('- "nicht nur eine große szene mit zooms, sondern wie ein richtig schöner motion design film": **every picture shows exactly what its sentence says** (column *zeigt wörtlich*). Typography, diagrams, objects that turn into the next object, match cuts over carrier objects.')
L.append('- 60–70 % explainer graphics (numbers, comparisons, processes, timelines, simple maps) on THE PLAN SHEET (lib/f69_explain.mjs), the rest scenes and clips. World rides count 0 — there are none.')
L.append('- The Leitbild (the puzzle moon in the ring of 12 stars over the night sea of 27 lights, you on the roof) ONLY at 4 anchors: hook (H.01–H.02), turn (1.11–1.12), verdict (10.01–10.02), end (10.10–E.01).')
L.append('- Every change over a carrier object, no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (calm.py: still < 5 %, none > 2 s).\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** of the whole film (target 60–70 %); without the clip seconds: **{share_nc * 100:.1f} %**. Weights: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0, per second of picture.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min).')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} shots are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}). Zooms and pans never count as new.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. The KIT HUD (top right, from 1.13) changes by itself (`F.kitHud`, `F.KIT` phrases; never by hand).\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| the puzzle moon / the plan disc (the 5 parts) | H.01 (vision), H.08 (empty), H.18 (the plan) | 1.11 (named), every part verdict, 10.01, 10.10, E.01 |')
L.append('| the AI screen at your desk (a say) | H.03–H.06 | 3.05 (a client gets no say), 10.05 (a European screen at your interview) |')
L.append('| the 100 cells (5 %) | H.10–H.11 | 5.07 (≈ 5.6 % in 2031) |')
L.append('| the chip machine | H.12, plate | 1.01–1.05, 2.12 (clicks into the money), 5.09 (needed), 9.01–9.03 (the say), 10.09 |')
L.append('| the exit to the right (shipped / hired away) | H.12–H.13 | 2.05 (founders fly), 7.07 (half as many leave), 7.08 (a few come back right → left) |')
L.append('| TOO SMALL tile | H.02 | H.15 (struck through), 10.10 (never too small) |')
L.append('| 27 crates / 27 sets of rules | H.16–H.17 | 4.01–4.02 (27 stacks → one sheet), 10.10 (27 lights linked) |')
L.append('| the paper company ("EU INC") | 4.02 | 7.06 (the options sit inside it, still paper) |')
L.append('| the Draghi report | 1.07 | 1.08 (C1 grows out of it), 10.06 (C1b) |\n')
L.append('## 4 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2].replace("#1", " (2nd)")} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b]); g[1] = b
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s)' for k, v in grp.items()) + '\n')
L.append('## 5 · Shots\n')
L.append('Columns: ID · anchor (phrase) · t (provisional) · len · **zeigt wörtlich** (what the sentence says) · **neu?** (§13.1a) · picture (what moves and what it becomes) · layer · carrier → next · flags.')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | zeigt wörtlich | neu? | picture | layer | carrier → next | |')
        L.append('|---|---|---|---|---|---|---|---|---|---|')
    anc = s[1].replace('#1', ' (2nd)')
    neu = ('nein: ' + NOT_NEW[s[0]]) if s[0] in NOT_NEW else 'ja'
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {neu} | {s[3]} | {s[4]} | {s[5]} | {s[6]} |')
L.append('\n## 6 · Seams between the groups (lib/f69_world.mjs, all on THE PLAN SHEET)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | Those chip machines | plateMachine (the chip machine big, side view, centred on the sheet; light path on; no text) | H.19: the machine drawing lifts off the plan and grows into it | 1.01 pulls back: the hall, the town plan |")
L.append("| B1 → B2 | None of it runs | plateEnergy (the disc big at 960/470 r 250, money HALFWAY, rules ON PAPER, piece 3 lit; the minds piece lies beside it) | 4.06: piece 2 turns paper, the disc settles into it | 5.01 pushes into piece 3 |")
L.append("| B2 → B3 | So suppose all five | plateFour (the same disc, 2 HALFWAY + 2 ON PAPER, the minds piece beside it) | 7.09 settles into it | 8.01 lights the four, 8.02 draws the tracks out of the rim |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md OVERLAY lines, as `F.SOURCES` in lib/f69_kit.mjs (statement ≤ 6 words + one number; the long rest goes into the source line, `F.source`, 22 px at y 880). faktencheck.md (24.11.) is applied: MB1 (Atomico = projection), MB2 (€1 billion EU committed, €4 billion more on the next budget), MB3 (CAIRNE leaders: “nothing of the sort”), KB1–KB11; vo-v3 is the spoken text. Text ≥ 22 px; nothing important below y 880 (subtitles).')
L.append('- No QR, no sponsor (none booked: regeln/sponsoren-aktiv.md, 19.11.). No logos, no flags, no political-map hero (the light map in 5.03 has coast lines only). No Jensen Huang anywhere. No AI images. No real faces outside the clips.')
L.append('- Clips: lower thirds from ROOT clips-geprueft.json (`F.CLIPS`), C3 credit © European Union, 2026; C1b centre crop (interpreter + logo).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()}, 'layers', {k: round(v) for k, v in lay.items()})
