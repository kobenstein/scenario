#!/usr/bin/env python3
"""Film 41 · "Bill Gates Changed His Mind About AI and Jobs" · the binding shot list -> docs/shots.md (times from the current timing:
$TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json).
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots41.py
REGELN §13 (Jakob 24.11.): ONE PICTURE PER SENTENCE, explainer share 60–70 %, no single big scene with zooms, a real motion-design film.
Every shot: id (station.n; H = hook, 1…9 = the sections, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up in the
film after the previous shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'ENDSCREEN' = duration − 15),
the picture (ONE idea: what the viewer sees, not the mood), layer, carrier into the next shot (the transition), flags.
Layers and their explainer weight (REGELN §13.2, per second of picture):
  GRAFIK 1.0 (an explainer graphic that shows the sentence: chart, timeline, quote card, the list, numbers, comparison, kinetic type)
  MIX .5 (a graphic written onto / growing out of a scene object) · SZENE 0 (a designed scene: you, the hand in the sky, the site, the jury)
  CLIP 0 (real footage).
Flags: ★ = the one wow moment of the chunk · = = NOT a new motif (the same picture keeps going: only for a pause or an echo; §13.2a).
A zoom, pan or camera move into the same picture never counts as a new motif."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F41ROOT', '/mnt/project-files/scenario/film-bill-gates/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'GRAFIK': 1.0, 'MIX': .5, 'SZENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Bill Gates changed his mind'), ('c02', 'B1', 'What changed is his picture'), ('c03', 'B1', 'For Gates, the first work'),
          ('c04', 'B1', "That's the usual comfort"), ('c05', 'B2', 'Then the numbers'), ('c06', 'B2', 'That leaves the last stop'),
          ('c07', 'B2', 'His fix'), ('c08', 'B3', 'Take the jury'), ('c09', 'B3', 'Ask who decides'), ('c10', 'B3', 'Now look past those twenty')]
# id | anchor phrase | picture (one idea) | layer | carrier → next (the transition) | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'Bill Gates changed his mind', 'THUMBNAIL A: a giant hand of warm light in the night sky turns its thumb from up to down (gold U-turn arrow, the thumb-up after-image); you tiny at your desk lamp below; GATES CHANGED / HIS MIND ON AI sets in heavy caps', 'MIX', 'the hand rewinds to thumb-up and shrinks into a small icon (scale morph)', ''),
 ('H.02', 'Three years ago', 'TIME AXIS: the thumb-up icon sits on 2023; a gold axis draws to 2026; the quote "The risks of AI are real but manageable" sets word by word above 2023; source line', 'GRAFIK', 'the icon travels the axis', ''),
 ('H.03', 'Now he warns of far fewer', 'the icon slides to 2026 and flips thumb-down (overshoot); FAR FEWER JOBS slams in under it, the 2023 quote dims; footnote "…without the right policies"', 'GRAFIK', 'the axis clones into tiles', ''),
 ('H.04', 'No job, he says', 'THE JOB FIELD: the axis line breaks into a field of 96 amber tiles (one tile = one job); a cold cyan ripple runs out from the thumb over EVERY tile; NO JOB UNTOUCHED', 'GRAFIK', 'the field sorts itself', ''),
 ('H.05', 'Jobs at a screen', 'the left half of the field turns into screen tiles (a small monitor glyph in each): AT A SCREEN', 'GRAFIK', 'the sort continues', ''),
 ('H.06', 'Jobs done by hand', 'the right half gets hand glyphs: BY HAND', 'GRAFIK', 'one tile lifts', ''),
 ('H.07', 'Whatever your job is', 'one tile in the middle lifts out, the others sink back; it grows and opens into the lit window of your room: you at your desk inside (YOURS TOO)', 'SZENE', 'the window frame', ''),
 ('H.08', 'So what did Bill Gates see', 'you look up from the desk; through the window the dim gold glow of the hand in the sky; WHAT DID HE SEE? in cream on the glass', 'SZENE', 'the window frame becomes a card', ''),
 ('H.09', 'His own words', 'THE QUOTE ON THE GLASS: "This is crazy. / This is insane." writes onto your window pane, each word lights as spoken, the hand\'s glow behind; BILL GATES TO SEMAFOR · AUG 26, 2026', 'MIX', 'the last word\'s underline becomes a wave', ''),
 ('H.10', "He's shocked, he says", 'THE SILENCE: his voice as a gold wave sending pulses at four dates (AUG 26 · OCT 22 · NOV 4 · NOV 12) along a line; a second lane below waits for an answer', 'GRAFIK', 'the answer lane', ''),
 ('H.11', 'And deafened by the silence', 'the answer lane stays a flat cream line; quote "I\'m just deafened by the silence."', 'GRAFIK', 'the flat line becomes a switch slot', ''),
 ('H.12', "But he doesn't want to stop", 'THE SWITCH: the flat line bends into the slot of a big ON switch; it wobbles toward OFF and springs back ON; a row of cyan machine tiles keeps running behind; NOT A HALT', 'GRAFIK', 'the switch knob rolls out', ''),
 ('H.13', 'He wants certain work set aside', 'the knob rolls into the job field and becomes the head of THE GOLD THREAD, which draws a ring round a block of tiles: SET ASIDE', 'GRAFIK', 'the ring', '★'),
 ('H.14', 'For people only', 'inside the ring the tiles warm to gold, a small person glyph in each: FOR PEOPLE ONLY', 'GRAFIK', 'the ring holds', ''),
 ('H.15', 'Even where a machine could', 'cyan tiles slide at the ring and bounce off it (contact → recoil 60 ms); EVEN WHERE A MACHINE COULD', 'GRAFIK', 'the ringed block folds', ''),
 ('H.16', 'Think of it as a list', 'THE LIST: the ringed tiles stack and fold into lines of a tall sheet of light (each tile becomes a line)', 'GRAFIK', 'the heading writes', ''),
 ('H.17', 'He calls it Human Reserved', 'HUMAN RESERVED writes itself at the top of the sheet, gold underline', 'GRAFIK', 'your tile flies in', ''),
 ('H.18', 'Your job could be on it', 'your amber tile (from H.07) flies to a line of the list and docks: the line turns gold', 'GRAFIK', 'the tile slides off', ''),
 ('H.19', 'Or left off', 'the tile slides off the line again and cools; the line is empty', 'GRAFIK', 'the empty lines', ''),
 ('H.20', "The list hasn't been written", 'all lines empty, one waits and glows; THE LIST HASN\'T BEEN WRITTEN', 'GRAFIK', 'the sheet becomes the clip plate (rect morph)', ''),
 ('H.21', 'This month, at a Financial', 'the sheet narrows into the clip plate; a small tag above the plate FT LIVE · NOV 4, 2026 (no own lower third: the clip has the FT one)', 'MIX', 'the plate', ''),
 ('H.22', 'slot:C1', 'C1 FT LIVE · NOV 4, 2026 · ORIGINAL FOOTAGE (label above the plate; the FT logo top left covered by the plate crop; FT lower third stays, nothing on top); the plate shrinks back into a frame → plateMachine', 'CLIP', 'plateMachine', ''),
 # ---------------------------------------------------------------- c02 · B1 · his picture of the machine, the timeline
 ('1.01', 'What changed is his picture', 'out of plateMachine: the frame holds HIS PICTURE: a small cyan disc (the machine) beside an amber person dot, same size', 'GRAFIK', 'the disc', ''),
 ('1.02', 'Just weeks ago', 'a small source tag slides under the frame: CBS EVENING NEWS · NOV 12, 2026; the disc pulses', 'GRAFIK', 'the disc grows', ''),
 ('1.03', 'It exceeds human intelligence', 'you stand on a hill; the cyan disc rises behind you like a moon, past the height of your head (a cream line marks HUMAN): EXCEEDS HUMAN INTELLIGENCE', 'MIX', 'the disc shrinks into a row', ''),
 ('1.04', 'Earlier machines took over', 'THE STEPPING STONES: a row of lit stones (tasks) over dark water; a cyan block settles on the left stone, the small amber person steps to the next one on the right', 'MIX', 'the hops', ''),
 ('1.05', "That's why he called", 'the step repeats twice, easy; the thumb-up icon from H.02 hangs over the water: MANAGEABLE', 'MIX', 'the hop', ''),
 ('1.06', 'This time, wherever people move', 'the person hops right, the cyan follows each hop, faster every time, until it lands beside it: THIS TIME, THE MACHINE CAN FOLLOW', 'GRAFIK', 'the row becomes your street', '★'),
 ('1.07', "That's what Bill Gates saw", 'THE SKY: the hop row becomes a row of lit windows; above them the hand of light turns its thumb down (rhyme with H.01)', 'SZENE', 'a speech card from the hand', ''),
 ('1.08', "He says he'd love to be", 'QUOTE CARD "I\'d love to be convinced that I\'m wrong about the job market, but I\'m not." (AXIOS · AUG 26, 2026), words light as spoken', 'GRAFIK', 'the card', ''),
 ('1.09', "But he's not convinced", 'gold underline on "but I\'m not"', 'GRAFIK', 'the card pins under a print', '='),
 ('1.10', 'He has put his reputation', 'the PORTRAIT PRINT (Commons photo, paper-cut duotone, ONCE) rises + nameplate BILL GATES · CO-FOUNDER, MICROSOFT; the card hangs under it', 'GRAFIK', 'a gold dot leaves the nameplate', ''),
 ('1.11', 'So where does it begin', 'the gold dot alone in the dark, travelling', 'GRAFIK', 'the dot draws a line', ''),
 ('1.12', 'His warning comes with a timeline', 'THE TIMELINE big in the centre: the line draws from the dot', 'GRAFIK', 'the stops', ''),
 ('1.13', 'Three stops', 'three stops pop on in a stagger: NOW · 2–8 YEARS · 20 YEARS', 'GRAFIK', 'stop 3', ''),
 ('1.14', 'The last is the one', 'the third stop pulses once', 'GRAFIK', 'stop 1', ''),
 ('1.15', 'The first is now', 'NOW lights gold, the amber you-dot lands on it; the timeline shrinks to its corner (top right, stays as the clock)', 'GRAFIK', 'NOW', ''),
 # ---------------------------------------------------------------- c03 · B1 · stop 1: the screen
 ('2.01', 'For Gates, the first work', 'THE NIGHT OFFICE: rows of glowing screens in a dark office floor, a few people at them: SCREEN WORK writes along the row', 'MIX', 'three tiles flip', ''),
 ('2.02', 'He names it', 'three of the screens show the words, each on its word: PHONE SALES · PHONE SUPPORT · ACCOUNTING', 'MIX', 'the three tiles', ''),
 ('2.03', 'Artificial intelligence, he says, does', 'cyan floods the three screens, their people lean back; CHEAPER · FASTER · MORE ACCURATE land on the words; DECODER · OCT 22, 2026', 'MIX', 'the tiles fall into a line', ''),
 ('2.04', 'For one group', 'THE BUS STOP: at night a stop sign NOW, young figures with folders waiting (their first job)', 'SZENE', 'the sign\'s pole becomes a chart axis', ''),
 ('2.05', 'In the jobs most exposed', 'CHART: two lines, peers flat, ages 22–25 in the most AI-exposed jobs falling; the gap counts to −19 %; STANFORD DIGITAL ECONOMY LAB · AUG 2026', 'GRAFIK', 'the gap', '★'),
 ('2.06', 'And the gap is still growing', 'the gap widens on: 2025 −13 % → 2026 −19 %', 'GRAFIK', 'the chart\'s end dot becomes you', ''),
 ('2.07', "If that's you", 'you at the bus stop, small; the you-dot from the timeline drops onto your shoulder: YOU\'RE STANDING IN IT', 'SZENE', 'the chart returns', ''),
 ('2.08', 'But the same data shows', 'the chart splits into two lanes: REPLACING · ALONGSIDE', 'GRAFIK', 'lane 2', ''),
 ('2.09', 'Where the technology works alongside', 'lane 2: cyan and amber shapes sit together in each tile, the line holds and rises: ALONGSIDE PEOPLE: STABLE OR GROWING', 'GRAFIK', 'the word USED', ''),
 ('2.10', "So the machine alone doesn't", 'kinetic type: THE MACHINE ALONE DOESN\'T DECIDE → HOW IT\'S USED DOES ("used" gold)', 'GRAFIK', 'type folds to the timeline', ''),
 ('2.11', 'So the first stop is the screen', 'the timeline big for a beat: SCREEN WORK writes under NOW', 'GRAFIK', 'stop 2 glows', ''),
 ('2.12', 'Which sounds like good news', 'a pair of work gloves on a bench in warm light (people who work with their hands)', 'SZENE', 'the gloves', ''),
 # ---------------------------------------------------------------- c04 · B1 · stop 2: the hands, C2, the choice, who is talking
 ('3.01', "That's the usual comfort", 'kinetic type THE USUAL COMFORT rests on the gloves', 'MIX', 'split', ''),
 ('3.02', 'A machine can answer a phone', 'split: left a desk phone, a cyan light answers it; right a brick wall and a wheat field in amber light stay with their people (on "bricks", "harvest")', 'MIX', 'the timeline', ''),
 ('3.03', 'Gates gives that comfort', 'the timeline big: 2–8 YEARS lights, a bracket spans 2 → 8 with the years counting', 'GRAFIK', 'the bracket opens a window', ''),
 ('3.04', "That's the second stop", 'THE SITE: a building site and a field at dusk, far away small cold-lit humanoid robots lay bricks and walk the rows (never heroes); HAND WORK under 2–8 YEARS', 'SZENE', 'a lit site cabin window', '★'),
 ('3.05', 'This fall, on a podcast', 'the site cabin\'s window grows into the clip plate', 'MIX', 'the plate', ''),
 ('3.06', 'slot:C2', 'C2 BILL GATES · DECODER WITH NILAY PATEL · OCT 2026 · ORIGINAL FOOTAGE', 'CLIP', 'his words as a caption', ''),
 ('3.07', 'Houses. Food.', 'three tiles on the words: HOUSES · FOOD · WORK DONE WITH HANDS', 'GRAFIK', 'the caption line', ''),
 ('3.08', 'But go back to how', 'his sentence as a caption line rewinds to its start: IF WE DON\'T CHOOSE lights gold', 'GRAFIK', 'the words hold (pause)', ''),
 ('3.09', "He isn't describing the weather", 'a forecast cloud over a road dissolves; the road ahead forks: A DECISION writes at the fork', 'MIX', 'the fork', ''),
 ('3.10', 'Machines like these are built', 'a control desk in the dark: three levers BUILD · BUY · SWITCH ON, each pulled by a small amber hand on its word', 'MIX', 'the third lever = the switch', ''),
 ('3.11', "Gates doesn't expect a halt", 'the ON switch from H.12 returns and stays on (no halt expected)', 'GRAFIK', 'two dials', '='),
 ('3.12', 'But how fast they come', 'two dials HOW FAST · WHERE, an amber hand turns each: A CHOICE', 'GRAFIK', 'the timeline', ''),
 ('3.13', 'Before the last stop', 'the timeline: the third stop dim, IS HE RIGHT? writes in cream', 'GRAFIK', 'the ?', ''),
 ('3.14', "Start with who's talking", 'the portrait print returns + nameplate (no new photo)', 'GRAFIK', 'a gold line from the print', '='),
 ('3.15', 'Bill Gates co-founded Microsoft', 'diagram: GATES → MICROSOFT ⟷ THE COMPANY BEHIND CHATGPT (names as type, no logos): ONE OF THE BIGGEST SHAREHOLDERS', 'GRAFIK', 'the link', ''),
 ('3.16', 'So he is warning about', 'a gold flow runs back from the technology to MICROSOFT: PROFITS', 'GRAFIK', 'the warning card', ''),
 ('3.17', 'That makes the warning harder', 'the warning card is pushed aside by a hand, it springs back heavier (it can\'t be waved away)', 'GRAFIK', 'a rule line', ''),
 ('3.18', 'Though a skeptic would add', 'a rule line (a barrier) drops: small blocks bounce off it, one big block steps over: STRICT RULES SUIT THE BIGGEST? → plateNumbers', 'GRAFIK', 'plateNumbers', ''),
 # ---------------------------------------------------------------- c05 · B2 · the numbers, the verdict, subscribe 1
 ('4.01', 'Then the numbers', 'out of plateNumbers: the −19 % chart small; a gold frame isolates only its corner: YOUNGEST · MOST EXPOSED', 'GRAFIK', 'the frame pulls back', ''),
 ('4.02', 'Across the whole American', 'the corner becomes one tile in a huge field = the whole US job market; YALE BUDGET LAB', 'GRAFIK', 'a card from the field', ''),
 ('4.03', 'As of this spring', 'quote card "AI Is Probably Not (Yet) the Reason for Labor Market Weakening" · SPRING 2026; NOT YET underlines gold', 'GRAFIK', 'two labels', ''),
 ('4.04', "And Gates doesn't claim", 'two labels: FORECAST (a dashed line into the future) vs FINDING (dims): his is a forecast', 'GRAFIK', 'a verdict card builds', ''),
 ('4.05', 'So here is what the evidence', 'THE VERDICT CARD: three empty rows draw', 'GRAFIK', 'row 1', ''),
 ('4.06', 'The direction: plausible', 'row 1 DIRECTION: PLAUSIBLE (gold)', 'GRAFIK', 'row 2', ''),
 ('4.07', 'At the start of careers', 'row 2 ENTRY LEVEL: MEASURABLE (gold)', 'GRAFIK', 'row 3', ''),
 ('4.08', 'The speed and the size', 'row 3 SPEED AND SIZE: OPEN (cream, pulsing)', 'GRAFIK', 'the hand behind', ''),
 ('4.09', 'A forecast from a well-informed', 'behind the card the hand of light turns its thumb once more (he changed his mind in public)', 'MIX', 'the forecast cone', ''),
 ('4.10', 'Not a date in your calendar', 'a dashed forecast cone opens toward the future, no date pinned anywhere', 'GRAFIK', 'the cone narrows to your window', ''),
 ('M.01', 'This channel exists', 'SUBSCRIBE 1: your window at night, you at the desk; around it small lit windows of other people; the timeline top right with your dot; the calm SUBSCRIBE pill rises, its gold ring closes on "subscribe"', 'SZENE', 'the timeline', ''),
 # ---------------------------------------------------------------- c06 · B2 · stop 3: twenty years, C3, the tax
 ('5.01', 'That leaves the last stop', 'the timeline big, the third stop pulses', 'GRAFIK', 'stop 3 stretches', ''),
 ('5.02', "It isn't a date", 'the third stop stretches from a dot into a band: 20 YEARS (a stretch of time, not a date)', 'GRAFIK', 'the band', '★'),
 ('5.03', 'On that same podcast', 'the band grows into the clip plate', 'MIX', 'the plate', ''),
 ('5.04', 'slot:C3', 'C3 BILL GATES · DECODER · OCT 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the band returns', ''),
 ('5.05', 'Twenty years of winners', 'along the band tiles split: some rise gold (winners), some sink and cool (losers)', 'GRAFIK', 'the band over a bar', ''),
 ('5.06', "If you're in the middle", 'YOUR WORKING LIFE as a long lit path (first job → retirement), you walking at its middle; the 20-year band lies exactly over the rest of the path: THE REST OF IT', 'MIX', 'the band becomes a plan card', ''),
 ('5.07', 'That stretch is what his plan', 'a plan card with two empty slots PLAN 1 · PLAN 2', 'GRAFIK', 'FAR FEWER JOBS', ''),
 ('5.08', 'Remember the warning', 'FAR FEWER JOBS returns in the same type and place as H.03', 'GRAFIK', 'the asterisk', '='),
 ('5.09', 'His essay adds a condition', 'an asterisk drops on FEWER; the footnote WITHOUT THE RIGHT POLICIES writes', 'GRAFIK', 'the slots', ''),
 ('5.10', 'The list is one of them', 'slot 1 shows a tiny list; slot 2 a coin: ANOTHER IS ABOUT MONEY', 'GRAFIK', 'the coin rolls onto a scale', ''),
 ('5.11', 'Today, he argues, the tax', 'THE TAX SCALE stands in a factory yard at night (a lit gate, a crate): it tilts the wrong way', 'MIX', 'a person tile', ''),
 ('5.12', 'Hire a person', 'a worker steps onto the left pan: coins drop out of the pan into TAX ON THE WAGE', 'MIX', 'a cyan tile replaces it', ''),
 ('5.13', 'Buy a robot instead', 'a robot crate lands on the right pan: no wage tax, its price drops straight off the books: WRITTEN OFF RIGHT AWAY (the scale tips to the machine)', 'MIX', 'the cyan tile', ''),
 # ---------------------------------------------------------------- c07 · B2 · his fix, Etzioni, the gap, the list
 ('6.01', 'His fix', 'TAX THE MACHINE\'S WORK: a coin slot opens in the cyan tile', 'GRAFIK', 'coins', ''),
 ('6.02', 'Tax artificial intelligence and robots', 'a usage meter on an AI tile and a robot tile ticks; coins flow out by use: TAX BY USAGE', 'GRAFIK', 'the coins split', ''),
 ('6.03', 'The money goes into retraining', 'the coins split: RETRAINING (a lit workbench) and a STRONGER SAFETY NET (a gold mesh strung under small figures)', 'MIX', 'a quote card', ''),
 ('6.04', 'The artificial intelligence researcher', 'quote card OREN ETZIONI: "…the diagnosis right, but the prescription wrong, at least in some places." DIAGNOSIS ✓ gold · PRESCRIPTION ? cream', 'GRAFIK', 'the typewriter', ''),
 ('6.05', "Taxing the machine's work, he says", 'A TYPEWRITER: every keystroke drops a coin', 'MIX', 'the counter', ''),
 ('6.06', 'It counts how hard', "on the typewriter's paper a counter races up (keystrokes) beside an empty office chair: LOST A JOB? no reading", 'MIX', 'two slots', ''),
 ('6.07', 'And even a perfect tax', 'two slots: a paycheck card slides into the first, the second stays empty', 'GRAFIK', 'the empty slot', ''),
 ('6.08', 'Money can replace a paycheck', 'YOUR DESK: the paycheck envelope on the desk, the chair empty, nobody waits for you: BEING NEEDED', 'SZENE', 'the empty slot grows', ''),
 ('6.09', "That's where his second idea", 'the empty slot grows into THE LIST (the sheet from H.16)', 'GRAFIK', 'the list', '='),
 ('6.10', 'Human Reserved', 'quote "…we\'ll set aside certain things for only people to do. I\'ve started calling this domain Human Reserved." writes at the top of the list (GATESNOTES · AUG 26, 2026)', 'GRAFIK', 'the first lines', ''),
 ('6.11', 'The candidates named so far', 'lines fill on their words: CHILD CARE · JURY · ART', 'GRAFIK', 'line 4', ''),
 ('6.12', 'And in teaching, a mix', 'line 4: TEACHING · A PERSON IN CHARGE, a small cyan tool beside it → plateJury (the JURY line glows)', 'GRAFIK', 'plateJury', ''),
 # ---------------------------------------------------------------- c08 · B3 · the jury, forty percent, C4, the open questions
 ('7.01', 'Take the jury', 'out of plateJury: the JURY line lifts off and unfolds into twelve empty chairs in a jury box (no hall)', 'SZENE', 'the chairs', ''),
 ('7.02', 'Imagine the verdict is about you', 'you small in a pool of light before the twelve dark chairs (back view)', 'SZENE', 'a cyan scale', '★'),
 ('7.03', 'A machine might weigh', 'a cyan scale weighs a stack of papers in a blur: FASTER', 'MIX', 'the chairs', ''),
 ('7.04', 'Would you still want people', 'the twelve chairs fill with amber figures one by one', 'SZENE', 'the box shrinks into the line', ''),
 ('7.05', 'Human Reserved would turn', 'the jury box shrinks back into the JURY line, which turns solid gold: A RULE', 'GRAFIK', 'the list beside a field', ''),
 ('7.06', 'How long could such a list', 'THE TOWER: an office tower at night with exactly 100 lit windows (one window = one job), the list standing beside it; guesses 10 %? · 50 %? · 90 %? hover at those heights', 'MIX', 'the tiles', ''),
 ('7.07', 'His own ceiling', '40 of the 100 windows turn gold floor by floor, the counter runs to 40 %; quote "In a very extreme form of it … 40% of jobs could initially be reserved for humans." (AXIOS)', 'MIX', 'a ceiling line', '★'),
 ('7.08', 'And that, he says, is as high', 'a gold ceiling line across the tower at 40; the counter bumps against it: AS HIGH AS I CAN GET', 'MIX', 'the 60', ''),
 ('7.09', 'So even at its most generous', 'the 60 windows above stay plain; your window among them pulses: MAYBE YOURS', 'MIX', 'your tile becomes the plate', ''),
 ('7.10', 'Which ones make it', 'your tile flips into a paper card: IN HIS ESSAY', 'GRAFIK', 'the card opens', ''),
 ('7.11', 'slot:C4', 'QUOTE CARD C4 (a card since vo-v4, read by the narrator): "Who gets to decide what we reserve for humans? What criteria should we use?" BILL GATES · GATESNOTES · AUG 26, 2026 (timing.json; the coordinator said 27.08: check); the words light as the narrator reads them', 'GRAFIK', 'the two questions become boxes', ''),
 ('7.12', 'By his own account, those questions', 'three boxes: WHO DECIDES? · WHICH CRITERIA? (from the card) · HOW IS IT ENFORCED? writes on "a third": STILL OPEN', 'GRAFIK', 'the gold line', ''),
 ('7.14', 'Critics add', 'one line of the list wobbles, small hands push and pull it: HARD TO DRAW · OPEN TO LOBBYING', 'GRAFIK', 'two lines', ''),
 ('7.15', "And reserved doesn't mean", 'CHILD CARE and TEACHING lines each get a short wage bar: RESERVED ≠ WELL PAID', 'GRAFIK', 'three words', ''),
 ('7.16', 'So the list is unwritten', 'three words tick in: UNWRITTEN · HARD TO DRAW · TOO SHORT', 'GRAFIK', 'the question', ''),
 ('7.17', 'Why does it matter, then', 'WHY DOES IT MATTER? in cream over the empty list', 'GRAFIK', 'the job field', ''),
 # ---------------------------------------------------------------- c09 · B3 · the price decides
 ('8.01', 'Ask who decides', 'the tower of 100 windows again, all amber: WHO DECIDES RIGHT NOW?', 'MIX', 'a line enters', ''),
 ('8.02', 'Mostly, nobody does', "THE PRICE LINE draws in from the left and sinks across the tower's face (the price is the actor)", 'MIX', 'the line crosses a tile', '★'),
 ('8.03', 'If a machine can do the work', "where the price line passes under a window's human cost, that window turns cyan, its chair empty (in the frame it passes)", 'MIX', 'the leftovers', ''),
 ('8.04', 'A human job is whatever', 'the remaining amber windows scattered over the tower: WHATEVER IS LEFT OVER', 'MIX', 'one leftover = your window', ''),
 ('8.05', 'Chances are, that includes', 'one leftover tile opens into your window: you at the desk', 'SZENE', 'two bars', ''),
 ('8.06', 'No rule ever said', 'two cost bars on your tile, PERSON just under MACHINE: THE BEST DEAL · SO FAR (the machine bar sinks toward it)', 'GRAFIK', 'the list rises', ''),
 ('8.07', 'Human Reserved asks something', 'the list rises beside the price line', 'GRAFIK', 'type', '='),
 ('8.08', 'Not: what does it cost', 'kinetic type: WHAT DOES IT COST? fades to cream outline, WHY SHOULD A PERSON DO THIS? in gold', 'GRAFIK', 'the empty line', ''),
 ('8.09', 'Try a line yourself', 'YOUR DESK: an empty line of light glows in front of you', 'SZENE', 'the line\'s two fields', ''),
 ('8.10', "And, harder: what's your reason", 'the line gets two fields WORK ____ · REASON ____; REASON glows: WHAT THE LIST IS STILL MISSING', 'GRAFIK', 'the timeline band', ''),
 # ---------------------------------------------------------------- c10 · B3 · the far end, the core line, subscribe 2, end screen
 ('9.01', 'Now look past those twenty', 'THE FAR END: past the end of the 20-year band a wide dawn land opens, many small lit homes and fields (warmer palette, the good end): ABUNDANCE', 'SZENE', 'price lines on homes', '★'),
 ('9.02', 'Cheaper homes, cheaper food', 'small price lines over a home and a field fall: CHEAPER HOMES · CHEAPER FOOD', 'MIX', 'one tile', ''),
 ('9.03', 'And one task stays', 'in the dawn land cyan machines work the fields; one group of people stands together on a hill (one task stays with people)', 'SZENE', 'dots gather', ''),
 ('9.04', 'Humanity, he says', 'the people on the hill and many more small amber figures gather into a ring: ORGANIZE · PURPOSE writes over it', 'MIX', 'the list in the ring', ''),
 ('9.05', 'A list like Human Reserved', 'inside the ring of people the list rises out of the ground: ONE WAY TO BEGIN', 'MIX', 'cold fill', ''),
 ('9.06', 'But a list nobody writes', 'the list in the land fills from the bottom with cold lines, one per beat: BY PRICE · ONE CHEAPER MACHINE AT A TIME', 'MIX', 'the silence line', ''),
 ('9.07', 'And so far, Gates says', 'the flat silence lane from H.11 runs along the horizon under the list', 'MIX', 'the cold lines clear', '='),
 ('9.08', 'Which means every line', 'the cold lines clear, every line empty and glowing; the ring of people looks up: EVERY LINE IS STILL OPEN', 'MIX', 'the hand in the sky (pause)', ''),
 ('9.09', 'The question is no longer', 'THE FINAL PICTURE (thumbnail rhyme): the hand of light dim in the sky, the list standing in the night, you at your desk at its foot; the core lines set one by one', 'MIX', 'lights', ''),
 ('A.01', 'This channel exists#1', 'SUBSCRIBE 2: small lights come on in windows all round the list (everybody gets a say); the pill rises', 'MIX', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN: the list and you in the centre, two calm free areas left and right for the video tiles, subscribe below the centre; bottom 15 % calm', 'MIX', '—', ''),
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
rows, tot, wsum, same = [], 0.0, 0.0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
lay = {k: 0.0 for k in WEIGHT}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[3]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[3]]; lay[s[3]] += d
    same += '=' in s[5]
    rows.append((c, s, a, d))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 41 · "Bill Gates Changed His Mind About AI and Jobs" (GATES CHANGED HIS MIND ON AI) · shot list (binding)\n')
L.append(f'Generated by `tools/shots41.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL, source " + TM.get("source", "?") if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(id)`). '
         'If a phrase goes missing after a text change, `T.G` says which one.\n')
L.append('## 1 · Numbers (REGELN §13)\n')
L.append(f'- **Explainer share (weighted, per second of picture): {share * 100:.1f} %** (target 60–70 %). Weights: GRAFIK 1 · MIX 0.5 · SZENE 0 · CLIP 0.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s ({v / tot * 100:.0f} %)' for k, v in lay.items()) + '.')
L.append(f'- Shots: {len(SHOTS)}, one picture per sentence of new information; {len(SHOTS) - same} new motifs, {same} marked `=` (the same picture goes on: an echo or a pause). A zoom or camera move into the same picture never counts as a new motif (§13.2a).')
L.append('- ★ = the one wow moment of a chunk. The timeline (NOW · 2–8 YEARS · 20 YEARS) changes by itself from its phrases (`F.timeline`, `F.TIMELINE`), never by hand.\n')
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
L.append('## 3 · Shots (one row = one sentence)\n')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | picture (one idea) | SZENE/GRAFIK | motif new? | carrier → next (transition) | |')
        L.append('|---|---|---|---|---|---|---|---|---|')
    anc = s[1].replace('#1', ' (2nd)')
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {s[3]} | {"no (=)" if "=" in s[5] else "yes"} | {s[4]} | {s[5].replace("=", "")} |')
L.append('\n## 4 · Seams between the groups (lib/f41_world.mjs)\n')
L.append('| seam | phrase | plate (a designed still that both sides draw for ±0.5 s) | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append('| Lead → B1 | What changed is his picture | plateMachine: an empty cream frame (the C1 plate shrunk), inside it a small cyan disc and an amber dot side by side; timeline not yet | H.22 shrinks the clip plate into the frame | 1.01 grows the disc |')
L.append('| B1 → B2 | Then the numbers | plateNumbers: the −19 % chart small at the left, a gold baseline across the frame; timeline top right (NOW, 2–8 lit) | 3.18 lays the barrier line down as the baseline | 4.01 frames the chart corner |')
L.append('| B2 → B3 | Take the jury | plateJury: the list (HUMAN RESERVED) centre, lines CHILD CARE · JURY · ART · TEACHING, the JURY line glowing | 6.12 settles | 7.01 lifts the JURY line |')
L.append('\nBoth sides draw the plate for ±0.5 s with the same slow creep (`S.plate*(ctx, t, T)`). Inner chunk boundaries belong to one builder: hand over with a carrier like every other shot. Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>`.\n')
L.append('## 5 · On-screen strings\n')
L.append('Wording: `F.SOURCES` in lib/f41_kit.mjs (from skript/text-v3 PICTURE lines + vo-v4 changes + films/41-assets/clips-geprueft.json). ≤ 6 words per statement + one number (verbatim quotes may be longer). Text ≥ 22 px, never in the bottom 15 % (y > 918, subtitles).')
L.append('- Gates\' face: only the Commons portrait print (1.10, ONCE, with its credit line) and the clips. Never an AI image, never a drawn likeness.')
L.append('- Clips: label ORIGINAL FOOTAGE next to the source name. C1 carries its own FT lower third: nothing on top of it; the plate crop covers the FT logo top left.')
L.append('- No QR, no logos, no red, robots only small and distant (never heroes). No clock face, ladders, stamps, price tags, doors, pens (earlier films).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %; layers', {k: round(v) for k, v in lay.items()}, '; groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
print('per chunk:', {c: f'{v[1] / max(1e-6, v[0]) * 100:.0f}%' for c, v in per.items()})
