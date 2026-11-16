#!/usr/bin/env python3
"""Film 26 · "Why Elon Says Saving Money Is Pointless" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots26.py
Every shot: id, anchor = a VO phrase (looked up in the film after the previous shot's anchor; 'slot:C1' = a clip slot; 'p#n' = the nth
occurrence in the whole film), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (a diagram made of film things in the sky field or on the test card: coins, coin stacks, price tags, gold-dust lines, paper:
  checks, bills, law pages, serif numbers, quote cards) · MIX .5 (a scene with a diagram on it: tags in a shop window, numbers on a street) ·
  PIG .4 (the guiding image, the broken piggy bank on the hill, with dust or a question on it) · SCENE 0 · CLIP 0 (original footage).
Flags: W = a hard world change (a light door into a lit window / box or a match cut; budget ~1 per minute) · S = a sky door (the camera rises
into the shared starfield and comes down over the other place: invisible, but a change of place; counted separately) · ★ = the one wow
moment of a chunk."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F26ROOT', '/mnt/project-files/scenario/film-sparen/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'PIG': .4, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Elon Musk says saving'), ('c02', 'B1', 'And behind that picture'), ('c03', 'B1', 'The first line is where'),
          ('c04', 'B1', 'Everything gets cheap#0'), ('c05', 'B2', 'Someone pays you an income#0'), ('c06', 'B2', 'And if the government just prints'),
          ('c07', 'B2', 'It arrives in time#0'), ('c08', 'B3', "If he's wrong, you're still fine#0"), ('c09', 'B3', 'There is#0'),
          ('c10', 'B3', 'Then one winter'), ('c11', 'B3', 'The five lines, then')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('1.01', 'Elon Musk says saving', 'THE HILL = thumbnail A: the giant indigo piggy bank, cracked open on top, coins rise out and turn into gold dust; you (yellow coat) small at its feet; STOP SAVING MONEY left; small source line: Musk on X', 'PIG', 'one coin leaves the stream', '★'),
 ('1.02', 'Every month', 'the coin arcs down over the river into the city; a window lights where it lands; dive into that light → out of the lamp in your room: your hand drops the coin into a small, whole piggy bank on the sill; the wall calendar turns a page', 'SCENE', 'the light door (window = lamp)', 'W'),
 ('1.03', 'For later', 'the calendar pages flip faster (months → years), a coin drops with every page', 'MIX', 'the last page', ''),
 ('1.04', 'For the day you stop working', 'the last page lands: the older you at the same window (hood down, white hair, a slight stoop), the small piggy full in her hands', 'SCENE', 'the piggy in her hands', ''),
 ('1.05', 'In his future', 'the coins leave the full piggy through its slot as gold dust (the piggy stays whole) and drift out of the window', 'SCENE', 'the dust', ''),
 ('1.06', 'Machines will make almost everything', 'pull back out of the window and follow the dust down the facade: in the shop window below, the shelves fill themselves (bread, shoes, books, lamps), every price tag sinks to $0', 'MIX', 'the shop light', ''),
 ('1.07', 'To him, saving is a bet', 'a balance beam of light grows in the sky over the street: your small piggy on one pan (YOUR SAVINGS), the shop light on the other (HIS FUTURE); the beam tips toward the light', 'EXPL', 'your piggy lifts off its pan and rises', ''),
 ('1.08', 'So what would have to be true', 'follow it up into the stars and down onto the hill (sky door): it falls into the giant piggy\'s crack; WHAT WOULD HAVE TO BE TRUE? where the title stood', 'PIG', 'three coins from the crack', 'S'),
 ('1.09', 'He means it', 'three coins rise from the crack and flip into three quote cards, one after the other, all the same size: It won\'t matter. · money won\'t matter in 2036 · pointless; sources small: MOONSHOTS · THE ECONOMIST · X', 'EXPL', 'the three cards', ''),
 ('1.10', 'But he has also told us', 'the cards slide together and fold into one tall card with five empty lines: THE TEST is born', 'EXPL', 'line 1', ''),
 ('1.11', 'Part of his future is already here', 'line 1 glows gold; inside it a strip of the warehouse by the river: flat rovers glide under shelves', 'MIX', 'the empty lines below', ''),
 ('1.12', 'But the part that would pay', 'lines 3–5 stay dashed and empty; at line 3 a dashed check, nothing on it', 'EXPL', 'the card tips away', ''),
 ('1.13', 'Last winter, on a podcast', 'the card tips away; one coin of the stream rises with the camera into the stars (sky door) and drops onto the dark ON AIR sign, which lights; the camera sinks over the skyline to a lit window with a small gold ON AIR and pushes in (fly-in ≥ 2.5 s): two silhouettes at microphones, a monitor between them; MOONSHOTS PODCAST · EP. 220 · JAN 2026', 'MIX', 'the monitor', ''),
 ('1.14', 'slot:C1', 'the monitor grows into the clip plate → C1 (ELON MUSK · CEO, TESLA & SPACEX · 2026 · ORIGINAL FOOTAGE); at the end the condition is set in gold under the plate', 'CLIP', 'the gold line', ''),
 ('1.15', 'In other words', 'the plate shrinks back into the monitor; pull back out of the window: the gold line hangs over the skyline = plateCondition', 'EXPL', 'plateCondition', ''),
 # ---------------------------------------------------------------- c02 · B1 · his strongest argument, the test is written
 ('2.01', 'And behind that picture', 'out of plateCondition: the gold line is the top rule of a blueprint that unfolds over the skyline (cream lines on indigo), four empty boxes in a chain', 'EXPL', 'box 1', ''),
 ('2.02', 'Artificial intelligence makes thinking', 'box 1: a price tag THINKING slides down a scale toward $0', 'EXPL', 'the tag lands', ''),
 ('2.03', 'Robots make labor', 'box 2: a tag LABOR slides to $0 beside it', 'EXPL', 'box 3', ''),
 ('2.04', 'Then almost anything costs', 'box 3: a chair comes apart into a small heap of wood and one spark: MATERIALS + ELECTRICITY; quote small', 'EXPL', 'the heap', ''),
 ('2.05', 'And when goods pile up', 'box 4: goods pile up beside a coin stack that stays the same; on "They fall." every tag on the blueprint drops a notch, in one wave; quote small: you will have deflation', 'EXPL', 'a falling tag', ''),
 ('2.06', 'Everyone can afford', 'the tag falls into the street (sky door down): the shop of the hook, many hands take from the shelf, no one pays; UNIVERSAL HIGH INCOME', 'MIX', 'a hand lifts a lamp up', 'S'),
 ('2.07', 'Even he says', 'up in the blueprint again: parts of it stay dashed, unfinished; quote small: it\'s not like I got this all figured out', 'EXPL', 'the dashed corner', ''),
 ('2.08', "This isn't financial advice", 'the test card returns out of the dashed corner, five empty lines; NOT FINANCIAL ADVICE small', 'EXPL', 'a gold bracket', ''),
 ('2.09', 'For his forecast to come true', 'lines 1–4 get a gold bracket FORECAST; under a fine rule, line 5: ADVICE', 'EXPL', 'line 1', ''),
 ('2.10', 'One: machines', 'line 1 writes itself: MACHINES MAKE ALMOST EVERYTHING', 'EXPL', 'line 2', ''),
 ('2.11', 'Two: everything', 'line 2: EVERYTHING GETS CHEAP', 'EXPL', 'line 3', ''),
 ('2.12', 'Three: someone', 'line 3: SOMEONE PAYS YOU AN INCOME', 'EXPL', 'line 4', ''),
 ('2.13', 'Four: it arrives', 'line 4: IT ARRIVES IN TIME', 'EXPL', 'line 5', ''),
 ('2.14', 'And five', 'line 5: IF HE\'S WRONG, YOU\'RE STILL FINE; the card glides into the top right corner and stays there to the end', 'EXPL', 'line 1 lifts out', ''),
 # ---------------------------------------------------------------- c03 · B1 · line 1 ✓
 ('3.01', 'The first line is where', 'line 1 lifts out of the corner card as the headline over the city; the camera sinks to the river', 'EXPL', 'the warehouse gate light', 'S'),
 ('3.02', "Amazon's warehouses", 'the warehouse by the river, gate open: flat rovers glide in a swarm under shelves, people at the packing tables stay; 1,000,000+ ROBOTS · AMAZON, JULY 2025', 'MIX', 'the office tower behind', ''),
 ('3.03', 'In offices', 'the office tower: three windows on their words, a draft fills itself, code lines turn gold, a chat answers', 'MIX', 'the windows rise as tiles', ''),
 ('3.04', "It isn't almost everything", 'the tiles join a long bar of gold dust ALMOST EVERYTHING: a small part filled, the fill creeps on; NOT YET', 'EXPL', 'the bar', ''),
 ('3.05', 'And by his own guess', 'the world economy as one stack of crates over the skyline grows by a quarter; +20–30 % · MUSK TO WALTER ISAACSON, OCT 2026', 'EXPL', 'the stack', ''),
 ('3.06', "That's a lot", 'the stack stands bigger; on "But it isn\'t the end of money" a single coin beside it does not change', 'EXPL', 'the stack top', ''),
 ('3.07', 'For that, he says', 'tilt up from the stack: robots → a rocket → the Moon with a long launch rail; the stack becomes huge', 'EXPL', 'the Moon', '★'),
 ('3.08', 'So the first line', 'back down to the corner card: line 1 gets a gold ✓; ON ITS WAY', 'EXPL', 'a conveyor from the warehouse', ''),
 ('3.09', 'But if machines make more', 'out of the warehouse a long conveyor of things with price tags rolls toward the street', 'MIX', 'one price tag', ''),
 # ---------------------------------------------------------------- c04 · B1 · line 2 ½ · subscribe 1 · the empty mailbox
 ('4.01', 'Everything gets cheap#0', 'line 2 lifts out as the headline; one price tag from the conveyor fills the frame', 'EXPL', 'the tag', ''),
 ('4.02', 'This is the heart', 'the tag tears down the middle on "half": one half bright, one half dark', 'EXPL', 'the bright half', '★'),
 ('4.03', 'For every dollar a TV', 'the TV shop window on the street: an old tube TV with a dollar bill → a flat screen with two cent coins; TV · $1 IN 2000 → ≈ 2¢ TODAY', 'EXPL', 'the coins roll off', 'S'),
 ('4.04', 'Software and phone plans', 'two small tags drop in the window: SOFTWARE −73 % · PHONE PLANS −44 %', 'EXPL', 'the dark half of the tag', ''),
 ('4.05', 'But for every dollar of hospital', 'the hospital at the end of the street, one lit window: a bed; its dollar becomes a stack of four; HOSPITAL CARE · $1 → ≈ $4', 'EXPL', 'the coin stack', ''),
 ('4.06', 'Nursing homes, rent and college', 'coin columns over a gold-dust line ALL PRICES +92 %: NURSING HOMES +166 %, RENT +143 %, COLLEGE +196 % rise far above it, TVs −98 % below', 'EXPL', 'the line splits the sky', ''),
 ('4.07', 'The rule behind it', 'the sky splits in two columns: COPY (cool cream) · TIME · PLACE (warm)', 'EXPL', 'left column', ''),
 ('4.08', 'What a machine can copy', 'left: one thing copied over and over, its tag falls', 'EXPL', 'right column', ''),
 ('4.09', "What takes a person's time", 'right: two hands at work; one house with its street number; the tags rise; small: ECONOMISTS CALL IT THE BAUMOL EFFECT', 'EXPL', 'the house', ''),
 ('4.10', 'Now look at what you', 'the house is hers: the older you at her window (from 1.04)', 'SCENE', 'three windows of her street', 'S'),
 ('4.11', 'A home', 'three lit windows on her street, one per word: a door with a key, a hospital bed, two hands holding an old hand', 'MIX', 'the third window', ''),
 ('4.12', 'Care costs what it does', 'into the third window: two hands, a cup of tea, a person\'s time (a person, never a robot)', 'SCENE', 'the cup', ''),
 ('4.13', 'A year in a nursing home', 'two coin stacks of the same height: 1 YEAR NURSING HOME ≈ $130,000 · 5 YEARS SOCIAL SECURITY ≈ 5 × $25,000', 'EXPL', 'the stacks', ''),
 ('4.14', 'So the second line', 'corner card: line 2 gets a half-filled mark ½; THINGS YES · OLD AGE NO', 'EXPL', 'the camera rises over the roofs', ''),
 ('4.15', 'This channel exists#0', 'subscribe 1: wide over the city at night, many warm windows, in one of them you; one quiet line', 'SCENE', 'her street', ''),
 ('4.16', 'So when you stop working', 'down on her street: the older you opens her mailbox at the curb: empty = plateMailbox', 'SCENE', 'plateMailbox', ''),
 # ---------------------------------------------------------------- c05 · B2 · line 3 ✗ (1/2) · C2
 ('5.01', 'Someone pays you an income#0', 'out of plateMailbox: line 3 lifts out as the headline over the mailbox', 'EXPL', 'the mailbox slot', ''),
 ('5.02', 'His answer is', 'out of the mailbox slot rises a check PAY TO: EVERYONE · U.S. TREASURY, the amount empty; quote small: Musk on X, Apr 17, 2026', 'EXPL', 'the check flips', ''),
 ('5.03', 'Remember his advice', 'the check flips: behind it the ON AIR window of the hook; a time code rewinds 1:14:29 → 1:13:54', 'MIX', 'the monitor', ''),
 ('5.04', 'slot:C2', 'the monitor grows into the clip plate → C2 (PETER DIAMANDIS · HOST, MOONSHOTS · 2026 · ORIGINAL FOOTAGE)', 'CLIP', 'the plate shrinks into a card', ''),
 ('5.05', 'Asked who would pay', 'two cards side by side: WHO PAYS? ↔ DON\'T SAVE FOR RETIREMENT', 'EXPL', 'two smaller cards', ''),
 ('5.06', 'To be fair', 'two smaller cards join: PRICES FALL · GOVERNMENT ISSUES MONEY', 'EXPL', 'the check of 5.02', ''),
 ('5.07', 'But today, there is no such income', 'the check: AMOUNT, DATE, SIGNATURE stay empty, one blinks per word (No law. No amount. No budget.)', 'EXPL', 'the check drifts toward the dome', ''),
 ('5.08', 'In Congress', 'a capitol dome at the end of the avenue; a few bill pages flutter toward it, none gets signed; NONE PASSED', 'EXPL', 'two street signs', ''),
 # ---------------------------------------------------------------- c06 · B2 · line 3 ✗ (2/2) · C4
 ('6.01', 'And if the government just prints', 'two street signs: PRINT IT and TAX & SHARE; the first lights: a press spits bills', 'EXPL', 'the bills', ''),
 ('6.02', 'Homes, hospital beds', 'the bills swarm around one house, one bed, one pair of hands; their tags climb', 'EXPL', 'the second sign', ''),
 ('6.03', 'The other way', 'TAX & SHARE lights: from factory silhouettes part of the profit flows into a common chest and on to many hands', 'EXPL', 'the chest', ''),
 ('6.04', 'This June', 'a lit hall window on the street (fly-in): a lecture hall, WORLD BANK · JUNE 2026, the chest small by the lectern; the lectern screen grows', 'MIX', 'the screen', ''),
 ('6.05', 'slot:C4', 'C4 (DARON ACEMOGLU · ECONOMIST, MIT · NOBEL PRIZE 2024 · ORIGINAL FOOTAGE)', 'CLIP', 'the plate shrinks back', ''),
 ('6.06', 'So the third line', 'corner card: line 3 gets a rose ✗; ONLY A PROMISE SO FAR', 'EXPL', 'the empty mailbox', ''),
 ('6.07', 'And even if it comes', 'from the mailbox the avenue runs out of town into the night; calendar pages blow along it', 'MIX', 'the avenue', ''),
 # ---------------------------------------------------------------- c07 · B2 · line 4 ✗ · C3
 ('7.01', 'It arrives in time#0', 'line 4 headline; THE AVENUE: a straight avenue into the night, every lamp post a year (2026, 2027 …), the years painted on the road', 'EXPL', 'your sidewalk', ''),
 ('7.02', 'For a retirement', 'a gold mark on your sidewalk: LAST DAY AT WORK', 'EXPL', 'the lit stretch', ''),
 ('7.03', 'Last winter, he said', 'a wide lit stretch 10–20 YEARS (2036–2046) on the avenue; JAN 2026 · “10 or 20 years”', 'EXPL', 'the 2036 lamp', ''),
 ('7.04', 'This summer, he named', 'the lamp post 2036 turns gold; JUL 2026 · 2036 (card; wording per fact check)', 'EXPL', 'the box at the lamp', ''),
 ('7.05', 'Credit where', 'an empty box CHECK at 2036; on "your retirement won\'t wait" your gold mark slides past along the sidewalk', 'EXPL', 'two lanes', ''),
 ('7.06', 'By his own account', 'two lanes: a gold streak ARTIFICIAL INTELLIGENCE races ahead, a cream mail van GOVERNMENT crawls', 'EXPL', 'the van', ''),
 ('7.07', "That's why he wants", 'the empty check of 5.02 drops into the mail van', 'EXPL', 'the van stops', ''),
 ('7.08', 'But checks for everyone', 'the van waits at the capitol steps; on the fast lane office and warehouse lights go out one by one; CHECKS FOR EVERYONE 2020/21: EACH NEEDED AN ACT OF CONGRESS', 'EXPL', 'the lamp posts', ''),
 ('7.09', 'So how good are his dates', 'old calendar pages riffle from the lamp posts', 'EXPL', 'a crossing', ''),
 ('7.10', 'One of his best-known', 'a car with no driver at a crossing of the avenue', 'SCENE', 'a lit stage window', ''),
 ('7.11', 'In April twenty nineteen', 'a stage window on the avenue (fly-in): a drawn stage, APR 22, 2019; its screen grows', 'MIX', 'the screen', ''),
 ('7.12', 'slot:C3', 'C3 (ELON MUSK · CEO, TESLA · 2019 · ORIGINAL FOOTAGE)', 'CLIP', 'the plate shrinks back', ''),
 ('7.13', 'They came', 'the avenue: a handful of robotaxis pass, a huge dashed outline 1,000,000 almost empty; PROMISED: 2020 · FIRST PAID RIDES: JUNE 2025', 'EXPL', 'the stage', ''),
 ('7.14', 'Earlier, on that same stage', 'back at the stage, one spotlight; quote card: … sometimes I\'m not on time. But I get it done.', 'EXPL', 'a car', ''),
 ('7.15', "That's fair", 'a car rolls late over a line on the avenue, paper confetti', 'SCENE', 'the older you', ''),
 ('7.16', 'For your retirement, late', 'the older you at her empty mailbox; her gold day long behind her on the avenue', 'SCENE', 'the corner card', ''),
 ('7.17', 'So the fourth line', 'corner card: line 4 gets a rose ✗; LIKELY YEARS LATE', 'EXPL', 'the camera rises', ''),
 ('7.18', "What if he's not just late", 'up into the stars and down onto the hill (sky door): the broken piggy, shards in its light = platePiggy', 'PIG', 'platePiggy', 'S'),
 # ---------------------------------------------------------------- c08 · B3 · line 5 ✗ · the two bets
 ('8.01', "If he's wrong, you're still fine#0", 'out of platePiggy: line 5 lifts out as the headline (under the fine rule: ADVICE)', 'EXPL', 'the card', ''),
 ('8.02', 'This is the line his advice', 'the whole card rests on line 5 like on a base', 'EXPL', 'the balance of the hook', ''),
 ('8.03', 'Think of it as two bets', 'the balance of 1.07 grows again over the hill, two empty pans', 'EXPL', 'left pan', ''),
 ('8.04', 'You keep saving', 'left pan: a small heap of coins turns to dust, you shrug; KEEP SAVING · HE\'S RIGHT', 'EXPL', 'right pan', ''),
 ('8.05', 'You stop saving', 'right pan: the older you beside an empty piggy; STOP SAVING · HE\'S WRONG', 'EXPL', 'the beam', ''),
 ('8.06', 'One mistake costs', 'the beam tips hard to the right (heavy, a slow overshoot, dust jumps)', 'EXPL', 'three figures', '★'),
 ('8.07', 'Nearly two in three', 'three small figures, two of them turn gold; 64 % · ALLIANZ LIFE, 2025', 'EXPL', 'two places at the scale', ''),
 ('8.08', "And the bet isn't the same", 'two people at the scale: one beside a tall stack of chips made of factory silhouettes, one with a single savings book; no faces', 'EXPL', 'a quote card', ''),
 ('8.09', 'Musk has said', 'quote card: better to be an optimist and wrong than a pessimist and right', 'EXPL', 'the gold underline', ''),
 ('8.10', 'He was talking about quality', '"for quality of life" underlined gold; behind it warm morning light at a window', 'MIX', 'the card glides away', ''),
 ('8.11', 'With money, it depends', 'back to the two places at the scale', 'EXPL', 'the tall stack', ''),
 ('8.12', 'For someone who owns', 'one chip falls from the tall stack, barely seen', 'EXPL', 'the savings book', ''),
 ('8.13', 'For someone with only', 'the savings book is the only chip on its side', 'EXPL', 'a weight', ''),
 ('8.14', "That's not a charge", 'a weight RISK sinks slowly and lands on the savings book\'s side', 'EXPL', 'the corner card', ''),
 ('8.15', 'So the fifth line', 'corner card: line 5 gets a rose ✗; THE RISK IS YOURS; the card reads ✓ ½ ✗ ✗ ✗', 'EXPL', 'a warm light in the city', ''),
 ('8.16', 'Is there a way', 'the card dims a little; down in the old part of town a box in an archive window glows warm', 'MIX', 'the box light', ''),
 # ---------------------------------------------------------------- c09 · B3 · 1889 / 1935 · C5
 ('9.01', 'There is#0', 'dive into the box light → out of a gas lamp: the same street in 1889 (sepia-warm in the night palette)', 'SCENE', 'the light door (box = gas lamp)', 'W'),
 ('9.02', 'Musk himself expects', 'a quote ribbon over the street: radical change, social unrest and immense prosperity', 'EXPL', 'the factory gate', ''),
 ('9.03', 'People have lived through', 'through the ribbon: a factory gate, steam', 'SCENE', 'the gate', ''),
 ('9.04', 'When machines turned work', 'the factory hall at shift change, an old worker at the gate', 'SCENE', 'his hands', ''),
 ('9.05', 'Germany answered first', 'a typed law page (no seal); three hands put coins into one chest: WORKERS · EMPLOYERS · STATE; GERMANY · JUNE 22, 1889 · PENSION FROM AGE 70', 'EXPL', 'a newsreel window', ''),
 ('9.06', 'America followed', 'a cinema window on the street (1935): its newsreel frame grows', 'MIX', 'the frame', ''),
 ('9.07', 'slot:C5', 'C5 (FRANKLIN D. ROOSEVELT · U.S. PRESIDENT · 1935 · ORIGINAL FOOTAGE)', 'CLIP', 'the plate shrinks into a page', ''),
 ('9.08', "His answer wasn't a promise", 'a fountain pen signs the act: SOCIAL SECURITY ACT · AUG 14, 1935 (no seal)', 'EXPL', 'the chest', ''),
 ('9.09', 'With amounts', 'the chest fills 1937, 1938, 1939, then the first check comes out in 1940', 'EXPL', 'the check', ''),
 # ---------------------------------------------------------------- c10 · B3 · Ida May Fuller · a law, not a promise
 ('10.01', 'Then one winter', 'the check flies into a snowy street in Vermont: a wooden mailbox, a woman in a winter coat opens it and holds the check; IDA MAY FULLER · CHECK No. 00-000-001 · JAN 31, 1940 · $22.54', 'SCENE', 'the mailbox', '★'),
 ('10.02', 'She kept getting them', 'the seasons turn at the mailbox, check after check, she grows older; PAID IN $24.75 · RECEIVED ≈ $22,900', 'MIX', 'the last check', ''),
 ('10.03', 'Not because someone', 'on the check, small: BY LAW', 'EXPL', 'the check', ''),
 ('10.04', 'Even this law needs repairs', 'her check becomes today\'s check; from a calendar page 2033 it shrinks to about three quarters but keeps coming; a wrench beside it', 'EXPL', 'two shapes', ''),
 ('10.05', "That's the difference", 'a promise = a dashed outline of a check that stays empty; a law = the solid page that stays', 'EXPL', 'the page', ''),
 ('10.06', 'If machines really do', 'match on the page: the present street, the shop of the hook full of things; beside it an empty law page', 'MIX', 'the page fields', 'W'),
 ('10.07', 'A right, written down', 'three fields on the page fill: RIGHT · WRITTEN DOWN · FUNDED', 'EXPL', 'your mailbox', ''),
 ('10.08', 'The day you stop working', 'the older you at your mailbox: a check in it, drawn as a pencil sketch, not yet in colour', 'SCENE', 'the sketch', ''),
 ('10.09', "That law doesn't exist yet", 'the sketch stays uncoloured; many hands with pens around the empty page; the dome far away', 'MIX', 'the corner card', ''),
 # ---------------------------------------------------------------- c11 · B3 · the five lines · the bridge · end screen
 ('11.01', 'The five lines, then', 'the corner card flies big to the centre', 'EXPL', 'the marks', ''),
 ('11.02', 'One, on its way', '✓ and ½ glow on their words', 'EXPL', 'the three ✗', ''),
 ('11.03', 'And three that fail', '✗ ✗ ✗ glow on income, timing, risk', 'EXPL', 'line 5', ''),
 ('11.04', 'As advice', 'under the fine rule the label ADVICE gets its own mark: FAILS ITS OWN TEST', 'EXPL', 'the card shrinks into the sky over the hill', ''),
 ('11.05', 'Maybe one day', 'the hill (sky door): across the river the far shore glows warm and wide (that future)', 'PIG', 'the river', 'S'),
 ('11.06', 'But someone has to pay', 'between you on the hill and the bright shore: the dark river, no way across', 'PIG', 'the gold dust', ''),
 ('11.07', 'Until a law does', 'the gold dust of the piggy gathers and sets into planks', 'PIG', 'the planks', ''),
 ('11.08', 'Saving was never', 'the planks form a bridge over the river; you step onto it', 'PIG', 'the bridge', '★'),
 ('11.09', 'This channel exists#1', 'subscribe 2: wide, beside your bridge a broad, solid bridge with railings, many people walk across', 'SCENE', 'end screen', ''),
 ('11.10', 'END', 'end screen 15 s: the bridges at first light, people keep walking, dust glitters; the right two thirds quiet and dark', 'SCENE', '—', ''),
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
    if anchor == 'END': return TM['words'][-1]['e'] + .6
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    if n: return sentence_start(p, int(n))
    return find(p, after)
def sentence_start(p, nth):   # 'phrase#n' = the nth occurrence that STARTS a sentence (capitalised, after . ? ! or a slot)
    q = [norm(x) for x in p.split() if norm(x)]; hit = 0
    for i in range(len(W) - len(q) + 1):
        if not W[i]['w'][:1].isupper(): continue
        if i and not re.search(r'[.?!:]["”]?$', W[i - 1]['w']): continue
        if all((NW[i + j].startswith(x) if j == len(q) - 1 else NW[i + j] == x) for j, x in enumerate(q)):
            if hit == nth: return W[i]['s']
            hit += 1
    raise SystemExit(f'sentence not found: {p!r} #{nth}')
times, prev = [], -1.0
for s in SHOTS:
    t = at(s[1], prev - .01); times.append(t); prev = t
chunk_t = [0.0] + [at(c[2], -1) for c in CHUNKS[1:]]
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
rows, tot, wsum, cuts, sky = [], 0.0, 0.0, 0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[3]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[3]]
    cuts += 'W' in s[5]; sky += 'S' in s[5]
    rows.append((c, s, a, d))
share = wsum / tot
clip_s = sum(c['end'] - c['start'] for c in TM['clips'])
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 26 · "Why Elon Says Saving Money Is Pointless" · shot list (binding)\n')
L.append(f'Generated by `tools/shots26.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; slots `T.clip(id)`).\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · PIG .4 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f} per minute (budget ~1/min). **Sky doors (S): {sky}** (rise into the shared starfield, down over the other place; no cut, no flood). All changes of place together: {(cuts + sky) / (dur / 60):.2f} per minute.')
L.append(f'- Window fly-ins (the camera pushes through a lit window into a room and back out) are continuous moves, neither W nor S; each ≥ 2.5 s.')
L.append(f'- Clips: {clip_s:.1f} s = {clip_s / dur * 100:.1f} % of the film. Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk.\n')
L.append('## 2 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2].split("#")[0]} | {fmt(a)} | {fmt(b)} | {b - a:.0f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
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
    anc = s[1].split('#')[0]
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {s[3]} | {s[4]} | {s[5]} |')
L.append('\n## 4 · Seams between the groups (lib/f26_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | And behind that picture | plateCondition (the gold condition line over the skyline, SKY_CAM) | 1.15 settles on it | 2.01 unfolds the blueprint from the line |")
L.append("| B1 → B2 | Someone pays you an income | plateMailbox (her street, the older you at the open, empty mailbox, STREET_CAM) | 4.16 settles on it | 5.01 lifts line 3, the check rises from the slot |")
L.append("| B2 → B3 | If he's wrong, you're still fine | platePiggy (the hill, the broken piggy, you, HILL_CAM) | 7.18 comes down onto it | 8.01 lifts line 5 |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (3 %/s push, 24 px/s truck). The test card (corner) is drawn by `F.testCard(ctx, t, T)` on BOTH sides from the phrase anchors, so it is identical across every seam. Inner chunk boundaries belong to one builder: make them one continuous take.\n')
L.append('## 5 · On-screen strings (the only ones; the fact check (faktencheck.md / vo-v3) wins over this list)\n')
L.append("- Hook: STOP SAVING MONEY · source line “Saving money for the distant future is pointless with the advent of super intelligent abundance.” · ELON MUSK ON X · What would have to be true? (serif) · calendar NOV/DEC 2026, JAN 2027, 2028 … 2060, LAST DAY AT WORK · GOODS · YOUR SAVINGS · HIS FUTURE · $0 · quote cards `F.QUOTES.wontmatter / y2036 / pointless` · MOONSHOTS · THE ECONOMIST · X · MOONSHOTS PODCAST · EP. 220 · JAN 2026 · ON AIR · the C1 condition line `F.QUOTES.condition`")
L.append('- Test card (`F.TEST`): 1 MACHINES MAKE ALMOST EVERYTHING · 2 EVERYTHING GETS CHEAP · 3 SOMEONE PAYS YOU AN INCOME · 4 IT ARRIVES IN TIME · 5 IF HE\'S WRONG, YOU\'RE STILL FINE · FORECAST · ADVICE · verdicts ON ITS WAY · THINGS YES · OLD AGE NO · ONLY A PROMISE SO FAR · LIKELY YEARS LATE · THE RISK IS YOURS · FAILS ITS OWN TEST · NOT FINANCIAL ADVICE')
L.append('- Steelman: THINKING · LABOR · MATERIALS · ELECTRICITY · UNIVERSAL HIGH INCOME · quotes `F.QUOTES.wattage` (MB1: replaces the unconfirmed "materials and electricity" card) `/ deflation / figured` (K4/K5 open: Jakob)')
L.append('- Line 1: 1,000,000+ ROBOTS · AMAZON, JULY 2025 · ALMOST EVERYTHING · NOT YET · +20–30 % · `F.QUOTES.isaacson` (source line) · c07 card `F.QUOTES.ontime` (MB2 wording)')
L.append('- Line 2: TV · $1 IN 2000 → ≈ 2¢ TODAY · SOFTWARE −73 % · PHONE PLANS −44 % · HOSPITAL CARE · $1 → ≈ $4 · ALL PRICES +92 % · NURSING HOMES +166 % · RENT +143 % · COLLEGE +196 % · TVs −98 % · COPY · TIME · PLACE · ECONOMISTS CALL IT THE BAUMOL EFFECT · 1 YEAR NURSING HOME ≈ $130,000 · 5 YEARS SOCIAL SECURITY · ≈ $25,000 / YEAR · source BLS CPI 2000–2025, CareScout 2025, SSA 2026')
L.append('- Line 3: PAY TO: EVERYONE · U.S. TREASURY · AMOUNT · DATE · SIGNATURE · WHO PAYS? · DON\'T SAVE FOR RETIREMENT · PRICES FALL · GOVERNMENT ISSUES MONEY · NONE PASSED · PRINT IT · TAX & SHARE · WORLD BANK · JUNE 2026 · `F.QUOTES.uhi`')
L.append('- Line 4: years 2026 … 2046 · LAST DAY AT WORK · 10–20 YEARS · 2036 · CHECK · ARTIFICIAL INTELLIGENCE · GOVERNMENT · CHECKS FOR EVERYONE 2020/21: EACH NEEDED AN ACT OF CONGRESS · APR 22, 2019 · 1,000,000 · PROMISED: 2020 · FIRST PAID RIDES: JUNE 2025 · `F.QUOTES.ontime`')
L.append("- Line 5: KEEP SAVING · HE'S RIGHT · STOP SAVING · HE'S WRONG · 64 % · ALLIANZ LIFE, 2025 · RISK · `F.QUOTES.optimist`")
L.append('- Law: `F.QUOTES.unrest` · WORKERS · EMPLOYERS · STATE · GERMANY · JUNE 22, 1889 · PENSION FROM AGE 70 · SOCIAL SECURITY ACT · AUG 14, 1935 · 1937 1938 1939 1940 · IDA MAY FULLER · CHECK No. 00-000-001 · JAN 31, 1940 · $22.54 · PAID IN $24.75 · RECEIVED ≈ $22,900 · BY LAW · 2033 · ≈ 78 % · RIGHT · WRITTEN DOWN · FUNDED')
L.append('- Clip credits `F.CLIPS` (name · role · year · ORIGINAL FOOTAGE). Subscribe lines: SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY · … AND EVERYBODY MAKES IT ACROSS (one small line, no buttons).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min), S {sky}, all {(cuts + sky) / (dur / 60):.2f}/min; groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
print('chunks:', {c[0]: f'{fmt(chunk_t[i])} {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f}%' for i, c in enumerate(CHUNKS)})
