#!/usr/bin/env python3
"""Film 28 · "They're Using AI to Save the World" · the binding shot list -> docs/shots.md (times from the current timing: $TIMING,
<ROOT>audio/timing.json, else data/provisional_timing.json). Edit the SHOTS table here, never docs/shots.md by hand.   python3 tools/shots28.py
Every shot: id (station.n; H = hook, 12…1 = the countdown stations, E = the ending), anchor = a VO phrase (looked up in the film after
the previous shot's anchor; 'slot:C1' = a clip slot), one picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (docs/MOTION.md §1):
  EXPL 1.0 (diagram made of film things: the bead and its beam, light lines, dot fields, slabs, serif numbers, tags, cards) ·
  MIX .5 (scene with a diagram on it) · TREE .3 (the great tree with its lanterns: an anchor, a little diagram via the lantern row) ·
  SCENE 0 · CLIP 0 (original footage).
Flags: W = a hard world change (a light-flood door or a cut; budget < 1 per minute) · ★ = the one wow moment of the chunk ·
  L = the station's lamp lights in the rail on this shot (the solution; never at the station's start) · G = a tool object joins the gallery."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F28ROOT', '/mnt/project-files/scenario/film-gute-ki/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'TREE': .3, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'All over the world'), ('c02', 'B1', 'A global data company'), ('c03', 'B1', 'That machine was built to listen'),
          ('c04', 'B1', 'Wind turbines make'), ('c05', 'B1', 'The Nazca desert'), ('c06', 'B1', 'Methane is invisible'),
          ('c07', 'B2', 'Casey Harrell knows'), ('c08', 'B2', 'Big ships are supposed'), ('c09', 'B2', 'In the open ocean'), ('c10', 'B2', "You're driving a train"),
          ('c11', 'B3', 'The snake'), ('c12', 'B3', 'Everyone knows'), ('c13', 'B3', 'Flash floods are the deadliest'), ('c14', 'B3', 'Satellites built to watch fields and forests#1')]
# id | anchor phrase | picture | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook + No. 12 to its solution (built: scenes/sc01.mjs)
 ('H.01', 'All over the world', 'THE TREE (thumbnail A, no phone): a giant tree on a hill at night, its crown lit gold from inside; you (yellow coat) tiny at its foot; across the dark land below, small warm lights wake on "people", "animals", "the planet"', 'TREE', 'the lights in the crown', '★'),
 ('H.02', 'Most of these projects', 'slow push up into the crown: among the leaves hang many small lanterns, almost all dark', 'TREE', 'one lantern swings closer', ''),
 ('H.03', 'In India, a train brakes', 'lantern 4 is a lit window: a night track in heat colours, the headlight, a cow and her calf glow like lamps; the train stops · REAL stamp', 'SCENE', 'along the branch', ''),
 ('H.04', 'In California, a man silenced', 'lantern 2: an evening kitchen, a man at the table; gold word-lines rise where his voice was · REAL stamp', 'SCENE', 'the lantern glass', ''),
 ('H.05', 'slot:C3a', 'the lantern glass grows into the clip plate: C3a CASEY HARRELL · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into lantern 7', ''),
 ('H.06', "And in Peru's desert", 'lantern 3: flat desert at dusk, beside an old footpath a small figure-drawing lights up, then a second · REAL stamp', 'SCENE', 'pull back', ''),
 ('H.07', 'All of it is real', 'the three lanterns side by side, each with its gold REAL stamp', 'MIX', 'down the trunk', ''),
 ('H.08', "It's the same kind of tool", 'at the foot of the tree you sit on a root with a laptop; THE TOOL = a cool bead over the screen: it writes an email, picks an ad', 'MIX', 'the bead lifts', ''),
 ('H.09', 'A few people pointed it', 'THE AIM: the bead lifts, its thin beam swings from the laptop up into the tree; where it lands the crown blooms gold', 'EXPL', 'the gold crown', ''),
 ('H.10', 'This is what A.I. should be used for', 'the whole tree in gold, THIS IS WHAT A.I. SHOULD BE USED FOR left (the thumbnail composition)', 'TREE', 'the lowest branch', ''),
 ('H.11', 'What do all these tools', 'THE COUNTDOWN: twelve dark lanterns hang in a row along the lowest branch; a gold thread runs through them and ends in a ?', 'EXPL', 'the last lantern (No. 1)', ''),
 ('H.12', 'A first clue', 'a yellowed newspaper page drifts down out of the crown and hangs under lantern 1 (the clue); on "floods strike" lanterns 11 … 1 lift into the LAMP RAIL (top left, screen space, the page rides under lamp 1) while the camera trucks out along the limb to its tip: lantern 12 alone, lighting up', 'EXPL', 'lantern 12', 'G'),
 ('12.01', 'At the far edge of New Zealand', 'the far tip of the limb = the far edge of the country: into lantern 12 → flood → out of the station window: at the far tip of a dark coast a tiny wooden radio station, one warm window, an antenna under stars; lamp 12 drops onto the rail · REAL stamp', 'SCENE', 'the antenna', 'W'),
 ('12.02', 'no tech giant had', 'behind it on the far horizon huge dark glass towers with a few cool windows: the giants', 'SCENE', 'the antenna', ''),
 ('12.03', 'a machine that understands', 'the cool bead hovers at the antenna and listens: rings go out, nothing comes back', 'MIX', 'its listening ring', ''),
 ('12.04', 'To learn a language', 'the hour ruler grows out of the ring: a long empty line of light, ticks to 300 HOURS', 'EXPL', 'the empty ruler', ''),
 ('12.05', 'The station asked its own people', 'the window opens its light: from houses, boats and marae along the coast thousands of small voice waves rise like fireflies to the antenna (no phones)', 'MIX', 'the fireflies', ''),
 ('12.06', 'In just ten days', 'the fireflies pour into the ruler, it fills: 10 DAYS (serif) · 2,500+ PEOPLE · 300+ HOURS; lamp 12 lights; the microphone joins the gallery → plateStation', 'EXPL', 'plateStation', 'L G'),
 # ---------------------------------------------------------------- c02 · B1 · No. 12 continued
 ('12.07', 'A global data company', 'out of plateStation: a glossy cool envelope glides from the towers across the water to the door: ≈ $45 / HOUR', 'MIX', 'the envelope', ''),
 ('12.08', 'The station said no', 'the door stays shut, the envelope stops and sinks back into the dark water', 'SCENE', 'the warm window', ''),
 ('12.09', 'Peter Lucas Jones runs it', 'the warm window grows into the clip plate', 'MIX', 'clip plate', ''),
 ('12.10', 'slot:C1', 'C1 PETER-LUCAS JONES · CEO, TE HIKU MEDIA · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the window', ''),
 ('12.11', "A machine can't keep a language alive", 'the warm voices circle the coast; the bead is small among them', 'MIX', 'the circle', ''),
 ('12.12', 'But this time, the speakers own', 'the circle of voices closes round the bead: the speakers hold the machine (KAITIAKITANGA LICENCE)', 'EXPL', 'the antenna ring', ''),
 # ---------------------------------------------------------------- c03 · B1 · No. 11 Apate
 ('11.01', 'That machine was built to listen', 'the antenna ring stretches into a telephone line running across the dark sea; the camera follows it west', 'MIX', 'the line', ''),
 ('11.02', 'In Australia, another A.I.', 'the line ends in an empty armchair with a glowing, chattering voice wave (no clock)', 'SCENE', 'the voice wave', ''),
 ('11.03', 'Not yours', 'split: a dark call room, headsets, cool screens (left) · the armchair voice (right); lamp 11 lights', 'SCENE', 'the call line', 'L'),
 ('11.04', 'A researcher there once kept', 'the call line grows as a light line: ≈ 40 MIN, a picnic blanket under it · REAL stamp (all figures: the company)', 'EXPL', 'the long line', ''),
 ('11.05', 'All that time, the scammer', 'the other lines from the call room stay dark while the one line is busy', 'EXPL', 'the dark lines', ''),
 ('11.06', 'Now his company does it all day', 'every line now ends in an armchair voice: many ages, many voices', 'EXPL', 'the junction', ''),
 ('11.07', "One of Australia's big phone networks", 'scam calls as dots are switched at a junction straight into the bots: ≈ 590,000 CALLS', 'EXPL', 'the slow wave', 'G'),
 ('11.08', 'Here, the A.I. wins by being slow', 'one wave slows and flattens into a long horizon line', 'EXPL', 'the horizon', ''),
 ('11.09', 'Over Wyoming, it has to be fast', 'the horizon is a prairie at the end of the night: turbines turning, an eagle crosses fast', 'SCENE', 'the eagle', ''),
 # ---------------------------------------------------------------- c04 · B1 · No. 10 IdentiFlight
 ('10.01', 'Wind turbines make clean power', 'the eagle glides toward the turning blades', 'SCENE', 'the blades', ''),
 ('10.02', 'Stop them all', 'light halves: ALL STOPPED (the power slab goes cool) | NONE STOPPED (an eagle mark falls)', 'EXPL', 'the split', ''),
 ('10.03', 'What would you do', 'the split holds and breathes for the pause', 'EXPL', 'the camera eye', ''),
 ('10.04', 'On one wind farm in Wyoming', 'a camera on a tower turns its eye to the sky · REAL stamp', 'MIX', 'the eye', ''),
 ('10.05', 'In the blink of an eye', 'a frame snaps round the eagle: EAGLE? YES · ≈ 0.4 S', 'EXPL', 'the frame', ''),
 ('10.06', 'Only the turbines in its path', 'one turbine slows like a bow, the eagle glides through, the others turn on; lamp 10 lights', 'MIX', 'the eagle', 'L G'),
 ('10.07', 'A study credited the cameras', 'five eagle marks, four go out: −82 % (source line); on "Other scientists say" a small ONE WIND FARM bracket (the caveat, fact check v5)', 'EXPL', 'the frame', ''),
 ('10.08', 'Here, one miss can cost an eagle', 'the frame stays sharp on the eagle', 'EXPL', 'the frame drops', ''),
 ('10.09', 'In Peru, a machine was wrong', 'the frame drops onto a quiet desert: many frames, almost all empty', 'EXPL', 'the frames', ''),
 # ---------------------------------------------------------------- c05 · B1 · No. 9 Nazca
 ('9.01', 'The Nazca desert is famous', 'the desert from high above at night: the known giant figures as gold line drawings · REAL stamp', 'SCENE', 'the aerial tiles', ''),
 ('9.02', 'An A.I. combed aerial photos', 'aerial tiles under a grid; tens of thousands of cool markers blink on: 47,410 LEADS', 'EXPL', 'the markers', ''),
 ('9.03', 'Almost all of them were nothing', 'almost all markers go out', 'EXPL', 'the last points', ''),
 ('9.04', 'Archaeologists checked only', 'tiny figures walk to the last points; two slabs: 430 KNOWN · +303 NEW', 'EXPL', 'one point', ''),
 ('9.05', 'The new ones are small', 'at eye level beside an old footpath a small relief figure lights: ≈ 9 M · ≈ 43 M FROM A PATH', 'MIX', 'the path', ''),
 ('9.06', "The team's reading", 'a ring of tiny lights round a giant figure (ritual) · then you walk the path past the small one', 'SCENE', 'the bead above', ''),
 ('9.07', "The A.I. didn't need to be right", 'the bead points a gold arrow at the spot: WHERE TO LOOK; lamp 9 lights', 'EXPL', 'the arrow', 'L G'),
 ('9.08', 'But what happens when the machine points', 'the arrow swings to a pipe at the desert edge: a shadow curls only infrared sees; nobody comes', 'MIX', 'the shadow rises', ''),
 # ---------------------------------------------------------------- c06 · B1 · No. 8 MARS (the turn)
 ('8.01', 'Methane is invisible', 'rise into orbit: the night side of the Earth (a curved horizon, no map, no pins), gas plumes only as shimmer; slab CO₂ vs METHANE ≈ 80×', 'MIX', 'the curve of the Earth', ''),
 ('8.02', 'To catch every leak', 'an impossible ring of eyes round the planet (dashed, cool)', 'EXPL', 'the ring', ''),
 ('8.03', "They're already up there", 'satellites glide over fields and forests · REAL stamp · the satellite joins the gallery with its tag BUILT TO WATCH FIELDS AND FORESTS', 'MIX', 'the view cone', 'G'),
 ('8.04', 'Satellites built to watch fields', 'the view cone finds a desert pipe: in infrared the plume\'s shadow', 'EXPL', 'the plume', ''),
 ('8.05', 'Every day, an A.I. searches', 'the flow: bead scans tiles → EXPERTS CHECK → U.N. letter → the country', 'EXPL', 'the letter', ''),
 ('8.06', 'In Algeria, one leak', 'a film strip of satellite pictures over more than a decade, the same plume visible from space in every frame; on "it stopped" the last frame is clean (v5: no valve, no "decades")', 'EXPL', 'the last frame', ''),
 ('8.07', 'Months after the alerts', 'a hand closes a valve, the plume breaks off: ≈ 500,000 CARS A YEAR; lamp 8 lights HALF', 'MIX', 'the letters', 'L'),
 ('8.08', "But that's the exception", 'alert letters pile up unopened on desks', 'EXPL', 'the pile', ''),
 ('8.09', 'Nearly nine in ten alerts', 'ten letters: one opened (warm), nine stay shut (cool)', 'EXPL', 'the one warm letter', ''),
 ('8.10', 'Two years ago', 'two slabs: ≈ 1 % → ≈ 12 % ANSWERED (years per the fact check)', 'EXPL', 'the warm letter', ''),
 ('8.11', "Seeing isn't saving", 'push into the one warm letter → flood → out of a lantern on THE TREE: the crown half dark, you below; the kitchen lantern from the hook near → plateTree', 'TREE', 'plateTree', 'W ★'),
 # ---------------------------------------------------------------- c07 · B2 · No. 7 Casey Harrell
 ('7.01', 'Casey Harrell knows', 'out of plateTree: fly into the kitchen lantern (window fly-in): the evening kitchen, Casey at the table; gold words pile up behind closed lips · REAL stamp', 'SCENE', 'the words', ''),
 ('7.02', 'He has A.L.S.', 'the quote card: "It is like you are trapped." · CASEY HARRELL, UC DAVIS HEALTH, AUG 2024', 'EXPL', 'the sentence', ''),
 ('7.03', 'How do you hear a sentence', 'the gold sentence pulses inside him and cannot get out (living hold)', 'MIX', 'the signal path', ''),
 ('7.04', 'Surgeons placed tiny sensors', 'cross-section: the speech area as a warm patch, four tiny sensor squares; signals run toward lips and tongue and stall', 'EXPL', 'the signals', ''),
 ('7.05', 'An A.I. learned which signals', 'the bead turns signal spikes into sounds, sounds into words', 'EXPL', 'the thought cloud', ''),
 ('7.06', "It doesn't read his thoughts", 'a thought cloud stays dark (cool outline), only the speech path is lit', 'EXPL', 'the words', ''),
 ('7.07', 'Then it speaks them', 'old home recordings (a tape) rebuild his voice: the words leave as a warm waveform; lamp 7 lights', 'EXPL', 'the speaker light', 'L G'),
 ('7.08', 'This is that voice', 'the speaker light grows into the clip plate', 'MIX', 'clip plate', ''),
 ('7.09', 'slot:C3', 'C3 CASEY HARRELL · BRAINGATE2 PARTICIPANT, UC DAVIS HEALTH · 2024 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the window', ''),
 ('7.10', "It's one man, in a research study", 'one figure, a dashed tag RESEARCH STUDY · NOT YET A TREATMENT', 'EXPL', 'the word counter', ''),
 ('7.11', 'But at home, in under two years', 'a counter of words runs up: ≈ 2 MILLION WORDS · < 2 YEARS', 'EXPL', 'the kitchen window', ''),
 ('7.12', 'This channel exists for one reason', 'subscribe 1: pull out of the kitchen window: hills at night, a path of small lamps (thumbnail B); you set one down lit', 'SCENE', 'the path of lamps', '★'),
 ('7.13', 'Casey wants to be heard', 'the path runs down to the sea; out on the water one ship light goes out', 'MIX', 'the ship lights', ''),
 # ---------------------------------------------------------------- c08 · B2 · No. 6 Global Fishing Watch
 ('6.01', 'Big ships are supposed', 'the night ocean: ships as strings of light, each mast sends a small radio ring · the ship radio joins the gallery: BUILT SO SHIPS DON\'T COLLIDE', 'MIX', 'the rings', 'G'),
 ('6.02', 'Take a guess', 'fishing boats as a chain of lights, small HOW MANY ARE DARK?', 'EXPL', 'the chain', ''),
 ('6.03', 'An A.I. compared years of radar', 'a radar sweep from space reveals hulls without lights · REAL stamp', 'EXPL', 'the hulls', ''),
 ('6.04', 'The answer: about three in four', 'four boats: three dark, one lit: ≈ 75 %; lamp 6 lights', 'EXPL', 'one dark boat', 'L'),
 ('6.05', "Dark doesn't mean illegal", 'most dark boats just fish; one track never returns to port', 'EXPL', 'the track', ''),
 ('6.06', 'Another A.I. reads how ships move', 'a zigzag track glows over months, tiny figures on deck', 'EXPL', 'the flag', ''),
 ('6.07', "That's a risk, not a verdict", 'a dashed tag RISK, not a stamp', 'EXPL', 'the ship light', ''),
 ('6.08', 'A ship can hide by switching', 'a ship light switches off; the camera sinks to the water: a flat ring spreads', 'MIX', 'the ring', ''),
 # ---------------------------------------------------------------- c09 · B2 · No. 5 GUARDIAN
 ('5.01', 'In the open ocean', 'the night Pacific: a flat ring spreads, barely visible', 'SCENE', 'the ring', ''),
 ('5.02', 'How do you see it coming', 'the ring runs toward a far coast light (Hawaii); hold for the pause', 'SCENE', 'the sky above it', ''),
 ('5.03', 'Look up', 'the camera tilts up (continuous): a twin ring rises through the air to a shimmering layer ≈ 300 KM', 'EXPL', 'the layer', '★'),
 ('5.04', 'The rising water shoves', 'cross-section: the water bump pushes the air up to the layer', 'EXPL', 'the ripple', ''),
 ('5.05', 'where it makes GPS signals', 'GPS beams from satellites to ground stations tremble where they cross the ripple · REAL stamp', 'EXPL', 'one beam', ''),
 ('5.06', 'The same signals your phone uses', 'a navigation arrow on a night street (no phone) · the GPS joins the gallery: BUILT TO FIND YOUR WAY (Another clue)', 'MIX', 'the beam', 'G'),
 ('5.07', 'An A.I. learned to read', 'the bead reads the trembling beams: the fingerprint; lamp 5 lights', 'EXPL', 'the dates', 'L'),
 ('5.08', 'NASA switched it on', 'two date tiles: 28 JULY 2025 SWITCHED ON · 29 JULY M8.8 KAMCHATKA', 'EXPL', 'the clip plate', ''),
 ('5.09', 'slot:C4', 'C4 (mute, under the VO) NASA SVS · ORIGINAL FOOTAGE: the wave in the sky over Hawaii; 32 MIN BEFORE THE FIRST TIDE GAUGE', 'CLIP', 'the plate shrinks into the coast', ''),
 ('5.10', "It's still a research tool", 'a dashed tag RESEARCH OUTPUT · NOT AN OFFICIAL WARNING', 'EXPL', 'the coast lights', ''),
 ('5.11', 'Half an hour can warn', 'the coast lights warm one after another; push into the brightest → flood → out of a train headlight', 'MIX', 'light door', 'W'),
 # ---------------------------------------------------------------- c10 · B2 · No. 4 Madukkarai
 ('4.01', "You're driving a train", 'you (yellow coat) at the controls, the headlight cone in the night forest', 'SCENE', 'the cone', ''),
 ('4.02', 'By the time your lights find', 'late, at the far end of the cone: an elephant on the track', 'SCENE', 'the towers', ''),
 ('4.03', 'Unless the track sees it first', 'towers along the track, heat view: cow and calf glow like lanterns · REAL stamp', 'MIX', 'the towers', ''),
 ('4.04', 'Cameras on towers along the line', 'schematic: 12 TOWERS · ≈ 7 KM, heat cones; the bead sends alerts to DRIVER and RANGERS', 'EXPL', 'the alert', ''),
 ('4.05', 'This time, the warning gets an answer', 'one beat of the unopened pile from No. 8, then a hand on the brake lever: the train stops; lamp 4 lights', 'MIX', 'the brake', 'L G'),
 ('4.06', 'On the stretch it watches', 'a serif 0 on the watched stretch: NO ELEPHANT KILLED HERE SINCE NOV 2023 (before: 11 since 2008)', 'EXPL', 'the elephants', ''),
 ('4.07', 'Elephants are the giants here', 'the elephants cross; the camera sinks into the tall grass beside the track', 'SCENE', 'the grass', ''),
 ('4.08', 'But across India, a far smaller', 'two slabs: ELEPHANTS ≈ 600 · SNAKES ≈ 58,000 A YEAR', 'EXPL', 'the long slab', ''),
 ('4.09', 'It hides in the grass', 'night grass, a shadow moves through it → plateGrass', 'SCENE', 'plateGrass', ''),
 # ---------------------------------------------------------------- c11 · B3 · No. 3 Baker Lab
 ('3.01', 'The snake', 'out of plateGrass: the snake as one flat silhouette coil', 'SCENE', 'the coil', ''),
 ('3.02', 'Its bite is still treated', 'a village shelf with an antivenom vial; behind it a horse in a lit stable', 'SCENE', 'the vial', ''),
 ('3.03', 'What if you could skip the horse', 'the stable lamp goes out; a never-seen gold shape starts to fold', 'EXPL', 'the shape', ''),
 ('3.04', 'A lab asked an A.I.', 'the bead designs: a ribbon protein folds and clamps onto a dark toxin, the dark goes out · REAL stamp; lamp 3 lights', 'EXPL', 'the protein', 'L G'),
 ('3.05', 'In mice, they worked', 'mouse marks: 80–100 % SURVIVED', 'EXPL', 'the tags', ''),
 ('3.06', 'So far only in mice', 'dashed tags MICE ONLY · SINGLE TOXINS', 'EXPL', 'the protein', ''),
 ('3.07', 'A designed protein can stop', 'the protein ribbon loosens into a thread that knots between a person and a chat window', 'EXPL', 'the knot', ''),
 # ---------------------------------------------------------------- c12 · B3 · No. 2 DebunkBot
 ('2.01', 'Everyone knows you can\'t argue', 'a person and the knot of belief, close', 'MIX', 'the chat window', ''),
 ('2.02', 'Just an ordinary chatbot', 'a plain chat window · the chatbot joins the gallery: THE KIND THAT WRITES EMAILS', 'EXPL', 'the fibres', 'G'),
 ('2.03', "It answered each person's own reasons", 'the knot loosens fibre by fibre, each answer meets its own fibre · REAL stamp', 'EXPL', 'the chat window', ''),
 ('2.04', 'David Rand, one of the researchers', 'the chat window grows into the clip plate', 'MIX', 'clip plate', ''),
 ('2.05', 'slot:C5b', 'C5b DAVID RAND · CO-AUTHOR, DEBUNKBOT STUDY · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the window', ''),
 ('2.06', 'After one short conversation', 'a belief bar drops −20 % and stays down: 2 MONTHS LATER; lamp 2 lights', 'EXPL', 'the bar', 'L'),
 ('2.07', 'The authors later found errors', 'a small stamp CORRECTED · THE EFFECT HELD', 'EXPL', 'the window', ''),
 ('2.08', 'In a newer study', 'mirror: the same window, colours flipped; the thread knots again · NOT YET PEER-REVIEWED', 'EXPL', 'the two windows', ''),
 ('2.09', 'Same tool. Opposite aim', 'one bead, two beams in opposite directions (warm | cool): the aim', 'EXPL', 'the warm beam', '★'),
 ('2.10', 'What do all these tools have in common', 'the warm beam → flood → THE TREE: the lantern row on its branch, eleven lit, the last dark; the gold thread and its ? return; first raindrops', 'TREE', 'the rain', 'W'),
 # ---------------------------------------------------------------- c13 · B3 · No. 1 Flood Hub
 ('1.01', 'Flash floods are the deadliest', 'the rain becomes a town by a river at night, water rising fast in an alley · THE DEADLIEST FLOODS (number per fact check)', 'SCENE', 'the river', ''),
 ('1.02', 'They often hit places', 'river lines with almost no gauges: a few dots, long empty stretches', 'EXPL', 'the empty river', ''),
 ('1.03', 'Except the news', 'the newspaper clue card of the hook flies back in, its pages whirl; lamp 1 lights', 'MIX', 'the pages', 'L'),
 ('1.04', 'A team at Google pulled millions', 'from every report a blue dot drops onto the river network until it is dense: 2.6 MILLION PAST FLOODS · REAL stamp (no world map, no pins)', 'EXPL', 'one river', ''),
 ('1.05', "For big rivers, Google's flood forecasts", 'a big river line, a forecast band runs 7 DAYS ahead · REAL · LIVE', 'EXPL', 'the band', ''),
 ('1.06', 'The warnings show up in Search', 'three small flat panels on their words: SEARCH · MAPS · ALERT', 'EXPL', 'the alert', ''),
 ('1.07', 'Maybe on yours', 'you in the rain (the raincoat fits) take out a phone; it lights with a flood alert (the first phone of the film)', 'SCENE', 'the phone light', ''),
 ('1.08', "But a forecast isn't a rescue", 'callback: the unopened methane letter beside the alert; you turn and run uphill with the light → flood out of the phone light', 'MIX', 'light door', 'W'),
 # ---------------------------------------------------------------- c14 · B3 · the resolution + end screen
 ('E.01', 'Satellites built to watch fields and forests#1', 'THE GALLERY: the lantern row with the twelve tool objects; on each named thing its object lights with its tag: satellite, ship radio, GPS, chatbot, newspaper', 'EXPL', 'the tags', ''),
 ('E.02', 'None of it was built for this', 'on every object a small gold arrow turns from what it was built for to the station it served', 'EXPL', 'the arrows', ''),
 ('E.03', "That's what these tools have in common", 'the gold thread runs through all twelve lit lanterns; the ? becomes a dot', 'EXPL', 'one bead', ''),
 ('E.04', 'The difference between writing your emails', 'one bead, two beams: a laptop email (cool) | the tree (warm): NOT THE TOOL · THE AIM', 'EXPL', 'the warm beam', '★'),
 ('E.05', 'The tool is already here', 'THE TREE: you below, a phone light raised, its beam aimed up; the crown glows fully gold (thumbnail A)', 'TREE', 'the crown', ''),
 ('E.06', "That's why this channel exists", 'subscribe 2: small lamps wake along the far hills', 'TREE', 'end screen', ''),
 ('E.07', 'END', 'end screen 15 s: the tree at rest in the left third; the right two thirds a quiet sky for the end cards', 'TREE', '—', ''),
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
    cuts += 'W' in s[5]
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 28 · "They\'re Using AI to Save the World" · shot list (binding)\n')
L.append(f'Generated by `tools/shots28.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, {TM.get("source", "")}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'The countdown numbers are never spoken: they live only in the lamp rail (`F.lampRail`), and a lamp lights on its station\'s L shot, never at the start.\n')
L.append('## 1 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights: EXPL 1 · MIX .5 · TREE .3 · SCENE 0 · CLIP 0, per second of picture.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f} per minute (budget ~1/min). Window fly-ins (the camera pushes through a lit lantern, window or plate into a scene and back) and object morphs are continuous moves, not W; each ≥ 2.5 s.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk.\n')
L.append('## 2 · Chunks and builders\n')
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
L.append('\n## 4 · Seams between the groups (lib/f28_seams.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | A global data company | plateStation (ST_CAM: the radio station at night, voices round the antenna, lamp 12 lit) | 12.06 settles on it | 12.07 the envelope glides in from the towers |")
L.append("| B1 → B2 | Casey Harrell knows | plateTree (TREE_CAM_TURN: the tree, crown half dark, the kitchen lantern near, rail with 12–9 lit, 8 half) | 8.11 comes out of the flood onto it | 7.01 flies into the kitchen lantern |")
L.append("| B2 → B3 | The snake | plateGrass (GRASS_CAM: night grass by the track, a shadow moving, rail 12–4 lit) | 4.09 sinks into it | 3.01 the shadow becomes the snake coil |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push, 30 px/s truck). Inner chunk boundaries belong to one builder: make them one continuous take (or the W door the table marks).\n')
L.append('## 5 · On-screen strings (the only ones)\n')
L.append('Wording: text-v2.md [EINBLENDUNG …] lines, shortened to ≤ 6 words per explainer. **The fact check of 11.11. (faktencheck.md / vo-v5.txt in the data root) overrides every number here** — read it before you set a number. Numbers marked (co.) are company figures and say so on screen.')
L.append('- Hook: THIS IS WHAT A.I. SHOULD BE USED FOR · ? · REAL · RUNNING NOW · TAMIL NADU, INDIA · REAL · CASEY HARRELL, CALIFORNIA · REAL · NAZCA, PERU')
L.append('- REAL stamps (`F.realStamp`, `F.STAMPS`): one per station, gold, 3 s, status LIVE · IN DAILY USE · PEER-REVIEWED · RESEARCH, place + source')
L.append('- 12: 300 HOURS · 10 DAYS · 2,500+ PEOPLE · 300+ HOURS · ≈ $45 / HOUR · KAITIAKITANGA LICENCE')
L.append('- 11: ≈ 40 MIN · ≈ 590,000 CALLS (co.) · ALL FIGURES: THE COMPANY')
L.append('- 10: ALL STOPPED · NONE STOPPED · POWER · EAGLES · EAGLE? · YES · ≈ 0.4 S · −82 % · ONE WIND FARM')
L.append('- 9: 47,410 LEADS · 430 KNOWN · +303 NEW · ≈ 9 M · ≈ 43 M FROM A PATH · WHERE TO LOOK')
L.append('- 8: CO₂ · METHANE · ≈ 80× (20 YEARS) · EXPERTS CHECK · U.N. · 1999 … 2024 · ≈ 500,000 CARS A YEAR · 1 % · 12 % · 2024 · 2025')
L.append('- 7: "It is like you are trapped." · RESEARCH STUDY · NOT YET A TREATMENT · ≈ 2 MILLION WORDS')
L.append('- 6: HOW MANY ARE DARK? · ≈ 75 % · RISK')
L.append('- 5: ≈ 300 KM · DELAYED · 28 JULY 2025 · 29 JULY · M8.8 KAMCHATKA · 32 MIN · RESEARCH OUTPUT · NOT AN OFFICIAL WARNING')
L.append('- 4: 12 TOWERS · ≈ 7 KM · DRIVER · RANGERS · 0 · SINCE NOV 2023 · ELEPHANTS ≈ 600 · SNAKES ≈ 58,000 A YEAR')
L.append('- 3: 80–100 % SURVIVED · MICE ONLY · SINGLE TOXINS')
L.append('- 2: −20 % · 2 MONTHS LATER · CORRECTED · THE EFFECT HELD · NOT YET PEER-REVIEWED')
L.append('- 1: ≈ 85 % OF FLOOD DEATHS · 2.6 MILLION PAST FLOODS · 7 DAYS · SEARCH · MAPS · ALERT')
L.append("- Gallery tags (`F.TOOLS[].tag`, only the five the VO names): BUILT TO WATCH FIELDS AND FORESTS · BUILT SO SHIPS DON'T COLLIDE · BUILT TO FIND YOUR WAY · THE KIND THAT WRITES EMAILS · WRITTEN FOR READERS · ending: NOT THE TOOL · THE AIM")
L.append('- Clip credits `F.CLIPS` (name · role · year · ORIGINAL FOOTAGE) · source lines `F.SOURCES` · quote card `F.QUOTES.harrell`.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
