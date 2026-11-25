#!/usr/bin/env python3
"""Film 77 · "AGI: The Final Human Invention" · the binding shot list -> docs/shots.md.
ONE ROW PER SPOKEN SENTENCE (REGELN §13.1): the sentences come from the timing (the same split as lib/kit.mjs: an abbreviation like A.G.I.
ends a sentence only before a capital; a lead-in ending on ':' before a clip slot is its own sentence), the rows below are matched to them
IN ORDER; the script stops if the counts differ (a VO change: add/remove a row, re-run). Clip rows ('C1' …) sit at their slot.
Times: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json.   python3 tools/shots77.py
Columns: id · type · zeigt wörtlich (what the viewer literally sees) · Motiv neu? (yes = an own composed motif; 'no' = same picture,
the sentence adds nothing new or is a beat of the shot above) · carrier into the next shot · flags.
Types and weights (REGELN §13.2, per second of picture, computed BEFORE animating):
  EXPL 1 (diagram, number, quote card, kinetic type that IS the sentence) · MIX .5 (a scene object carries a graphic) ·
  SCENE 0 (people, rooms, moments) · WELT 0 (a leitbild/world shot without new info) · CLIP 0 (original footage).
Flags: ★ = the one wow moment of the chunk · A = leitbild anchor (THE BOARD big: frame 0, 2.03 the board is set, 4.27 the cover falls,
  6.16–6.22 the harvest; only these) · X = a hard cut (budget ≈ 1 per minute, planned 0).
Picture code: FILLED = real, today, checked · DASHED CREAM OUTLINE = imagined, wished, forecast ("Imagine", the wishes, FORECAST)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F77ROOT', '/mnt/project-files/scenario/film-77-turing/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'SCENE': 0.0, 'WELT': 0.0, 'CLIP': 0.0}
# chunk table = film.mjs CHUNKS (id, builder, first phrase, nth occurrence)
CHUNKS = [('c01', 'Lead', 'A.G.I. may be the final', 0), ('c02', 'B1', 'Here is the promise', 0), ('c03', 'B1', 'Because today, people are trying', 0),
          ('c04', 'B1', 'Start with the one you pay', 0), ('c05', 'B1', 'Now imagine the machine Jack Good', 0), ('c06', 'B1', 'Because energy is only as good', 0),
          ('c07', 'B2', "So why isn't it in the power lines", 0), ('c08', 'B2', 'This channel exists for one reason', 0), ('c09', 'B2', 'Terence Tao is one', 0),
          ('c10', 'B3', "That's the fourth line", 0), ('c11', 'B3', 'Rules work from the outside', 0), ('c12', 'B3', 'And if the machine does the inventing', 0)]
S = []
def r(i, typ, shows, new, carrier, flags=''): S.append((i, typ, shows, new, carrier, flags))
# ------------------------------------------------------------------------------------------------ c01 · Lead · hook (scenes/sc01.mjs, built)
r('H.01', 'MIX', 'THUMBNAIL: THE BOARD (a tall ledger of light, NOT a chalkboard): HUMAN INVENTIONS, rows THE WHEEL · WRITING · PRINTING PRESS · STEAM ENGINE · LIGHT BULB · TELEPHONE · TELEVISION · THE INTERNET, the last row empty and glowing gold; behind the board the machine as a ring of light; you tiny in yellow in front · FINAL HUMAN INVENTION in thumbnail type, a gold rule runs under each spoken word', 'yes', 'the LIGHT BULB row', 'A')
r('H.02', 'SCENE', 'the LIGHT BULB row slides out of the board and becomes the bulb over your head: your room at night, you small in the dark', 'yes', 'the bulb')
r('H.03', 'SCENE', 'the pendant bulb lights, its cone falls on you', 'no (beat: the light)', 'your hand')
r('H.04', 'SCENE', 'the phone lights in your hand, its glow on your hood', 'no (beat: the phone)', 'the phone glow')
r('H.05', 'SCENE', 'the screen on the wall in front of you lights', 'no (beat: the screen)', 'the three lights')
r('H.06', 'MIX', 'the three things lift off as cream line icons (bulb, phone, screen); under each a small inventor at a bench lights up (three people, not yellow) · INVENTED BY A PERSON', 'yes', 'the three icons')
r('H.07', 'EXPL', 'the icons drop as rows into a list column that runs upward ever faster: rows of human inventions rush past (no years)', 'yes', 'the list column')
r('H.08', 'EXPL', 'the column brakes onto its last, empty row; A.G.I. types into it in gold', 'yes', 'the letters A·G·I')
r('H.09', 'EXPL', 'A·G·I unfold into ARTIFICIAL GENERAL INTELLIGENCE; below, a head in profile (cream line) and the ring of light: the light of the head is copied into the ring · WHAT A HUMAN MIND DOES', 'yes', 'the ring')
r('H.10', 'EXPL', 'INCLUDING INVENT: a stylus of light lifts off the ring by itself and comes to the empty row', 'yes', 'the stylus')
r('H.11', 'EXPL', 'beside the human column the stylus starts a second column: IT INVENTS FOR US', 'yes', 'the second column')
r('H.12', 'EXPL', 'race: the human column adds a row now and then, the second column fills in a rush of light and outgrows the frame; pull back · FASTER THAN WE EVER COULD', 'no (beat: the race)', 'the new column', '★')
r('H.13', 'MIX', 'SO WHAT WILL IT INVENT FOR YOU? rises word by word; you small at the foot of the new column, its rows dashed (unknown)', 'yes', 'the first dashed row')
r('H.14', 'EXPL', 'the first row of the new column fills solid gold (filled = real): ALREADY BEGUN', 'yes', 'the gold row')
r('H.15', 'EXPL', 'the gold row unfolds into a sheet of paper with dots; one bright line connects two of them · NO HUMAN HAD FOUND IT', 'yes', 'the sheet')
r('H.16', 'EXPL', 'dots on the page; pairs at the same distance light up as strokes of equal length; small on the sheet: HOW MANY PAIRS OF POINTS CAN SIT EXACTLY THE SAME DISTANCE APART?', 'no (beat: the puzzle on the sheet)', 'the sheet')
r('H.17', 'EXPL', 'an empty counter (two drums) rises over the sheet: __ YEARS', 'yes', 'the drums')
r('H.18', 'EXPL', 'the drums roll and land heavy on 80 YEARS (the one big number of minute 1) · ERDŐS UNIT-DISTANCE CONJECTURE · DISPROVED BY AN OPENAI MODEL · MAY 2026 · CHECKED BY OUTSIDE MATHEMATICIANS', 'no (beat: the number)', 'the counter')
r('H.19', 'EXPL', 'card: “a milestone in AI mathematics” — TIMOTHY GOWERS, MATHEMATICIAN · MAY 2026 · COMMENTARY REQUESTED BY OPENAI', 'yes', 'the card → the empty row')
r('H.20', 'EXPL', 'the empty last row (alone, not the board) stretches into a long band; one sentence types onto it (no name, no year)', 'yes', 'the band')
r('H.21', 'EXPL', 'the front half lights gold: “the first ultraintelligent machine is the last invention that man need ever make” · PROMISE', 'no (beat: the front half)', 'the band')
r('H.22', 'EXPL', 'the back half stays under a cream dashed cover · CONDITION', 'no (beat: the cover)', 'the cover')
r('H.23', 'MIX', 'you walk in small under the band and look up at the cover · UP TO US', 'no (beat: you)', 'the band (seam plate)')
# ------------------------------------------------------------------------------------------------ c02 · B1 · who said it first
r('1.01', 'EXPL', 'the band comes big, front half centre, the cover rests at the right edge', 'no (the band, big)', 'the band')
r('1.02', 'EXPL', 'quote card, words light as spoken: “… the first ultraintelligent machine is the last invention that man need ever make …” — I. J. GOOD, 1965 · “SPECULATIONS CONCERNING THE FIRST ULTRAINTELLIGENT MACHINE”, ADVANCES IN COMPUTERS 6, P. 33; the second half stays covered', 'yes', 'the card')
r('1.03', 'EXPL', 'the card takes on paper tone; a time bar 1965 → 2026 draws: MORE THAN 60 YEARS', 'yes', 'the bar')
r('1.04', 'EXPL', 'a name tag rises on a line from the card: I. J. “JACK” GOOD', 'no (beat: the name)', 'the name tag')
r('1.05', 'MIX', 'a wooden hut at night, two figures at a table covered in paper strips of code, one lamp · I. J. “JACK” GOOD · HUT 8, BLETCHLEY PARK · 1941–42 · GERMAN NAVAL CODES', 'yes', 'the lamp')
r('1.06', 'MIX', 'the second figure leans into the lamp light: ALAN TURING · HEAD OF HUT 8 · HIS FIRST BOSS', 'no (beat: the second figure)', 'the lamp → a ring of light')
r('1.07', 'EXPL', 'a ring of light (the machine) draws the outline of a second, bigger ring: SMARTER → DESIGNS A BETTER ONE', 'yes', 'the second ring')
r('1.08', 'EXPL', 'the chain runs on: each ring draws the next, bigger, out of frame', 'no (beat: the chain)', 'the last ring')
r('1.09', 'EXPL', 'the chain runs into a dark edge: THE END? (cream, a question)', 'yes', 'THE END?')
r('1.10', 'EXPL', 'quote card: “The survival of man depends on the early construction of an ultraintelligent machine.” — I. J. GOOD, 1965, P. 31; “survival of man” highlighted; THE END? is struck', 'yes', 'the card')
r('1.11', 'EXPL', 'quote card: “It is more probable than not that, within the twentieth century, an ultraintelligent machine will be built …” — I. J. GOOD, 1965, P. 78 · a calendar leaf 2000', 'yes', 'the leaf')
r('1.12', 'MIX', 'the 2000 leaf falls: WRONG ABOUT THE DATE; the last row stays empty', 'no (beat: the leaf falls)', 'the card, tilted')
r('1.13', 'MIX', 'you small before the tilted card: WHY TAKE HIM SERIOUSLY TODAY?', 'yes', 'the card tips → a stage light')
# ------------------------------------------------------------------------------------------------ c03 · B1 · today's builders, C1, the board is set
r('1.14', 'SCENE', 'today: a lit stage in a lecture hall, rows of seats, a speaker small at the lectern', 'yes', 'the stage light')
r('1.15', 'EXPL', 'A.G.I. (from the hook) stands beside Good’s ULTRAINTELLIGENT MACHINE, an = between them: THEY CALL IT A.G.I.', 'yes', 'the =')
r('1.16', 'MIX', 'name card: DEMIS HASSABIS · CO-FOUNDER, GOOGLE DEEPMIND · a gold tag HAS A STAKE IN THIS', 'yes', 'the name card')
r('1.17', 'EXPL', 'under the name an empty slot opens (dashed, gold corners): HIS PLAN', 'no (beat: the slot)', 'the slot')
r('C1', 'CLIP', 'ORIGINAL FOOTAGE · DEMIS HASSABIS · CO-FOUNDER, GOOGLE DEEPMIND · STANFORD GSB, 2026 (10.5 s): “It was literally step one, solve intelligence, step two, use it to solve everything else. And people were quite confused. But we really meant it.” The plate grows out of the slot and returns into it', 'yes', 'the slot')
r('1.18', 'EXPL', 'STEP 1 · SOLVE INTELLIGENCE / STEP 2 · SOLVE EVERYTHING ELSE as two rows beside Good’s band; a ? after EVERYTHING ELSE', 'yes', 'the ?')
r('1.19', 'MIX', 'the ? drops onto a slip of paper in your hand: YOUR OWN LIST', 'yes', 'the slip → the board')
r('1.20', 'EXPL', 'ANCHOR · THE BOARD becomes STILL WAITING: an arrivals board, four rows, each row status WAITING (split-flap), all cream', 'yes', 'the rows', 'A ★')
r('1.21', 'EXPL', 'row 1 flaps to ENERGY · a dashed outline icon (a plug): ALMOST FREE', 'no (beat: row 1)', 'row 2')
r('1.22', 'EXPL', 'row 2 flaps to MATERIALS · a dashed battery with seven day ticks', 'no (beat: row 2)', 'row 3')
r('1.23', 'EXPL', 'row 3 flaps to DISCOVERY · the dot sheet as a dashed outline', 'no (beat: row 3)', 'the board')
r('1.24', 'EXPL', 'a round test stamp hovers over the board: HAS THE INVENTING BEGUN?', 'yes', 'the stamp')
r('1.25', 'EXPL', 'row 4 stays blank, its flaps do not turn; a cream glow', 'no (beat: row 4)', 'row 4')
r('1.26', 'EXPL', 'the covered half of Good’s band slides in over row 4: THE SECOND HALF; the board shrinks to the corner (the mini board, an explainer icon)', 'no (harvest of H.22)', 'the mini board, row ENERGY')
# ------------------------------------------------------------------------------------------------ c04 · B1 · line 1 ENERGY
r('2.01', 'SCENE', 'your room from the hook: the power bill on the side table under the lamp, your hand takes it; mini board row ENERGY pulses', 'yes', 'the bill')
r('2.02', 'MIX', 'ENERGY flaps big from the mini board onto the bill: EVERY MONTH (twelve small marks)', 'no (beat: the word)', 'the bill')
r('2.03', 'MIX', 'dashed outline (imagined): a radiator glows warm, the meter dial beside it stands still · IMAGINE', 'yes', 'the dial')
r('2.04', 'EXPL', 'the test stamp drops over row ENERGY: HAS THE INVENTING BEGUN?', 'no (beat: the test)', 'the stamp')
r('2.05', 'EXPL', 'diagram: WATER + ELECTRICITY → HYDROGEN: a drop and a bolt run into a cell, bubbles rise (H₂)', 'yes', 'the cell')
r('2.06', 'EXPL', 'in the cell a small plate lights; the bubbles only form where it touches: CATALYST · MAKES THE REACTION RUN', 'yes', 'the plate')
r('2.07', 'MIX', 'a lab line: sample plates move in rows through stations, a counter runs to 2,942; a person carries a sample tray between two machines · LILA SCIENCES · 25 SEPT 2026 · 2,942 CATALYSTS IN 3 MONTHS', 'yes', 'the plates')
r('2.08', 'EXPL', 'a few plates on the line light gold; a greyed-out element tile Pd lights up: NEW PALLADIUM-BASED FAMILIES · A METAL WRITTEN OFF', 'yes', 'the gold plates')
r('2.09', 'EXPL', 'a stamp over the line: COMPANY REPORT + PREPRINT', 'yes', 'the stamp')
r('2.10', 'EXPL', 'second line on the stamp: NOT YET INDEPENDENTLY CONFIRMED; an empty check box', 'no (beat: the box)', 'the line')
# ------------------------------------------------------------------------------------------------ c05 · B1 · thousands of labs, human speed, line 1 begun
r('2.11', 'EXPL', 'the ring of light (1.07) over the lab line, drawn dashed (imagined) · FORECAST', 'yes', 'the lab line')
r('2.12', 'EXPL', 'the one lab line in a frame: × 1', 'no (beat: one)', 'the frame')
r('2.13', 'MIX', 'the line clones into thousands of dashed lab lines to the horizon, sun and moon swing over them · FORECAST · DAY AND NIGHT', 'yes', 'the lines → your window', '★')
r('2.14', 'SCENE', 'back at your side table: the bill, its total does not move', 'no (harvest of 2.01)', 'the total')
r('2.15', 'MIX', 'NOT YET, dry, over the bill', 'no (beat: the answer)', 'the bill')
r('2.16', 'MIX', 'three stations along a road behind the lab: a building site with a crane, a desk with a stamp, a power pylon; one person at each; a box (the invention) travels through · BUILT · APPROVED · PLUGGED IN', 'yes', 'the road')
r('2.17', 'MIX', 'a slow clock hand passes over the three stations: HUMAN SPEED', 'no (beat: the clock)', 'the clock')
r('2.18', 'EXPL', 'the mini board comes forward (explainer icon, not the anchor): row ENERGY flaps cream → gold, status BEGUN, the stamp gets a tick', 'yes', 'the ENERGY row')
r('2.19', 'EXPL', 'the catalyst plate lifts out of the lab line and turns to camera', 'yes', 'the plate')
r('2.20', 'EXPL', 'a power-plant outline beside it is struck: NOT A POWER PLANT', 'no (beat)', 'the plate')
r('2.21', 'EXPL', 'A MATERIAL: the plate slides to row 2 of the mini board, MATERIALS pulses', 'no (beat)', 'the plate → row 2')
# ------------------------------------------------------------------------------------------------ c06 · B1 · line 2 MATERIALS, the superconductor
r('3.01', 'MIX', 'a power plant, a battery and a power line come apart into their materials (metal blocks, coils, glass)', 'yes', 'the materials')
r('3.02', 'MIX', 'dashed outline (a wish): a phone with seven day ticks, battery full · A WEEK', 'yes', 'the phone')
r('3.03', 'MIX', 'dashed outline: a house under a big summer sun, no AC box, cool inside', 'no (beat: the second wish)', 'the house')
r('3.04', 'EXPL', 'both outlines point into one empty material slot: DOESN’T EXIST YET', 'no (beat)', 'the slot')
r('3.05', 'EXPL', 'two wires side by side: in one the current leaks away as heat glow, in the other all of it arrives · SUPERCONDUCTOR · NO LOSS', 'yes', 'the clean wire')
r('3.06', 'EXPL', 'a sea of crystal lattices (dots on grids), a search beam sweeps across, one lattice stays lit · 2.4 MILLION STRUCTURES · 28 GPU-HOURS', 'yes', 'the lit lattice')
r('3.07', 'EXPL', 'the lit lattice comes forward and turns: NEVER EXISTED BEFORE', 'no (beat)', 'the lattice')
r('3.08', 'MIX', 'a grey sample in a measuring rig, gloved hands set it in · ELEMENTSCLAW · ALIBABA DAMO ACADEMY + PARTNERS · 4 NEW SUPERCONDUCTORS MADE AND MEASURED · ICML 2026', 'yes', 'the sample')
r('3.09', 'EXPL', 'the resistance curve falls to zero: R = 0 · IT WORKED', 'no (beat: the curve)', 'the sample (seam plate)')
# ------------------------------------------------------------------------------------------------ c07 · B2 · the catch, C2, line 2 begun
r('3.10', 'MIX', 'the sample floats beside the power line in front of your house at night, not connected', 'yes', 'the sample')
r('3.11', 'EXPL', 'a thermometer almost at the bottom: WORKS ONLY AT 2.5–6.5 KELVIN (ABOUT −271 TO −267 °C)', 'yes', 'the thermometer')
r('3.12', 'EXPL', 'stamp: NO INDEPENDENT REPLICATION YET, one team badge', 'no (beat)', 'the badge')
r('3.13', 'EXPL', 'height comparison (no scale): left a tall stack of screens with designs, right a small tray with a few real samples · DESIGNED · MADE', 'yes', 'the tray')
r('3.14', 'MIX', 'a robot arm sets a dish into a furnace in a lab · PERIODIC LABS · CO-FOUNDED BY THE NEXT SPEAKER', 'yes', 'the furnace window')
r('3.15', 'EXPL', 'the furnace window becomes an empty slot: WHY A LAB?', 'no (beat: the slot)', 'the slot')
r('C2', 'CLIP', 'ORIGINAL FOOTAGE · EKIN DOGUS CUBUK · CO-FOUNDER, PERIODIC LABS · LATENT SPACE, 2026 (11.1 s): “But also we feel like even if, like, Fable 7 gets really good at, like, even better than what it is today, it will still have to run experiments to get results.” The plate grows out of the furnace window and returns into it', 'yes', 'the slot')
r('3.16', 'EXPL', 'the stack of screens dims, the samples on the tray light: ONLY WHAT GETS BUILT COUNTS', 'no (harvest of 3.13)', 'the tray')
r('3.17', 'EXPL', 'the mini board: row MATERIALS flaps gold, BEGUN', 'yes', 'row 2')
r('3.18', 'EXPL', 'in the row a single grain of gold, not a heap: STILL SMALL', 'no (beat)', 'the grain')
r('3.19', 'EXPL', 'the grain gets a tick: REAL', 'no (beat)', 'the board')
# ------------------------------------------------------------------------------------------------ c08 · B2 · subscribe 1, line 3 DISCOVERY
r('M.01', 'SCENE', 'the board with two gold rows; in front of it many small figures instead of one', 'yes', 'the figures')
r('M.02', 'SCENE', 'the gold of rows 1 and 2 runs out to every figure, their hands light up', 'no (beat)', 'the light')
r('M.03', 'SCENE', 'one figure, you in yellow, looks up', 'no (beat)', 'you')
r('M.04', 'MIX', 'subscribe as part of the scene: your hand presses a lit button on the board’s frame', 'no (beat)', 'the gold grain')
r('4.01', 'EXPL', 'the grain of row 2, big: WHY STILL SMALL?', 'yes', 'the grain')
r('4.02', 'MIX', 'left: a furnace and a slowly growing sample, a slow clock hand · MATTER IS SLOW', 'yes', 'the furnace')
r('4.03', 'EXPL', 'right: an empty sheet; nothing to build', 'yes', 'the sheet')
r('4.04', 'EXPL', 'the sheet fills line after line, fast · FULL SPEED; mini board row DISCOVERY pulses', 'no (beat)', 'the sheet')
r('4.05', 'EXPL', 'the dot sheet from the hook returns', 'no (harvest of H.15)', 'the sheet')
r('4.06', 'EXPL', 'beside the sheet a tag: NOT A MATH SPECIALIST', 'yes', 'the tag')
r('4.07', 'EXPL', 'OPENAI · 20 MAY 2026 · “GENERAL-PURPOSE REASONING MODEL” · ERDŐS PROBLEM #90', 'no (beat)', 'the sheet')
r('4.08', 'MIX', 'nine small figures (not yellow) stand round the sheet, each gets a tick: 9 OUTSIDE MATHEMATICIANS', 'yes', 'the ticks')
r('4.09', 'EXPL', 'card: “… I would have recommended acceptance without any hesitation.” — TIMOTHY GOWERS, MAY 2026 · ON A HYPOTHETICAL SUBMISSION TO THE ANNALS OF MATHEMATICS · COMMENTARY REQUESTED BY OPENAI · ARXIV 2605.20695', 'yes', 'the card')
r('4.10', 'EXPL', 'a wall of index cards (open problems); some flip to SOLVED, each with a small machine-check mark · ALPHAPROOF NEXUS · GOOGLE DEEPMIND · EVERY PROOF MACHINE-CHECKED · PREPRINT, MAY 2026', 'yes', 'the cards')
r('4.11', 'EXPL', 'two cards come forward: OPEN SINCE 1970 · 56 YEARS', 'no (beat)', 'the cards')
r('4.12', 'EXPL', 'only the 9 solved Erdős cards stay lit, each gets a small tag A FEW HUNDRED DOLLARS · 9 SOLVED ERDŐS PROBLEMS (no other set in this picture)', 'yes', 'the 9 cards')
r('4.13', 'EXPL', 'pull back: the 9 lit cards among 353 closed ones (unit chart) · 9 OF 353 ERDŐS PROBLEMS', 'yes', 'the closed cards')
r('4.14', 'EXPL', 'a calendar SEP · OCT · NOV; on each leaf a stack of paper lands with a stamp CLAIM', 'yes', 'the stacks')
r('4.15', 'MIX', 'the stacks grow faster than a short line of checkers can stamp: NOT YET CHECKED', 'no (beat)', 'the stacks')
# ------------------------------------------------------------------------------------------------ c09 · B2 · Tao, C3, the warning, line 3, the full sentence, Turing
r('4.16', 'SCENE', 'a mathematician (silhouette, not yellow) before a board full of working, the paper stacks grow beside him', 'yes', 'the stacks')
r('4.17', 'MIX', 'the stacks close in round him; a slot opens in the middle stack', 'no (beat: the slot)', 'the slot')
r('C3', 'CLIP', "ORIGINAL FOOTAGE · TERENCE TAO · FIELDS MEDALIST · NUMBERPHILE, 2026 (10.8 s): “And now we found a shortcut. We found machines that can get these proofs for us, and now we're drowning in proofs, but we're not getting all the understanding that we used to get.” The plate grows out of the slot and returns into it", 'yes', 'the slot')
r('4.18', 'EXPL', 'a funnel overflowing with proof sheets: TOO MANY · NOT TOO FEW', 'yes', 'the funnel')
r('4.19', 'EXPL', 'card: “proof indigestion” — TERENCE TAO · NATURE, WORLD VIEW, 22 OCT 2026', 'yes', 'the card')
r('4.20', 'EXPL', '25 medal discs in a 5 × 5 grid (unit chart), one is Tao’s; they sign one letter · 25 FIELDS MEDALISTS · 11 SEPT 2026', 'yes', 'the letter')
r('4.21', 'EXPL', 'from the same letter: AI can “enhance and accelerate genuine mathematical study and understanding” · NOT AGAINST A.I.', 'no (beat)', 'the letter')
r('4.22', 'EXPL', 'card: “the goals of the AI companies and the goals of the mathematical community are severely misaligned” — MATHANDAI.ORG; “severely misaligned” highlighted; two arrows part: COMPANIES · MATHEMATICIANS', 'yes', 'the arrows')
r('4.23', 'EXPL', 'the mini board: row DISCOVERY flaps gold', 'yes', 'row 3')
r('4.24', 'EXPL', 'sheets spill out of row 3: MOVING FASTER THAN PEOPLE CAN FOLLOW', 'no (beat)', 'the sheets')
r('4.25', 'EXPL', 'the sheets fall in front of the empty fourth row · WHO DECIDES WHAT IT WORKS ON?', 'yes', 'row 4')
r('4.26', 'MIX', 'you hold your list slip; beside you a much longer list held by unseen hands · YOUR LIST · SOMEONE ELSE’S', 'yes', 'the lists → the band')
r('4.27', 'EXPL', 'Good’s band (H.20) returns over row 4, its cover starts to slide', 'no (harvest of H.22)', 'the band')
r('4.28', 'EXPL', 'the band comes big: HERE IS ALL OF IT', 'no (beat)', 'the cover')
r('4.29', 'EXPL', 'ANCHOR · THE BOARD with the band: the cover falls, “provided that the machine is docile enough to tell us how to keep it under control” lights · card “Thus the first ultraintelligent machine is the last invention that man need ever make, provided that the machine is docile enough to tell us how to keep it under control.” — I. J. GOOD, 1965, P. 33', 'yes', 'the second half', 'A ★')
r('4.30', 'EXPL', '“provided that” underlined in cream: THE CONDITION', 'no (beat)', 'the word docile')
r('4.31', 'EXPL', 'DOCILE alone, under it WILLING TO BE GUIDED', 'yes', 'the word')
r('4.32', 'EXPL', 'card: “At some stage therefore we should have to expect the machines to take control …” — ALAN TURING, 1951; beside it the second figure from the hut (1.06); “take control” lit', 'yes', 'the Turing card (seam plate)')
# ------------------------------------------------------------------------------------------------ c10 · B3 · line 4 CONTROL, the two gates
r('5.01', 'EXPL', '“control” lifts off the Turing card and flaps into row 4: CONTROL (stays cream)', 'yes', 'row 4')
r('5.02', 'EXPL', 'the ring of light sends an arrow to a small human: THE MACHINE TELLS US HOW', 'yes', 'the arrow')
r('5.03', 'EXPL', 'before the arrow a gate DOCILE? lights: ONLY IF', 'no (beat)', 'the gate')
r('5.04', 'MIX', 'you pick up the stylus of light lying at row 4: OUR JOB', 'yes', 'the stylus')
r('5.05', 'SCENE', 'one figure becomes many: small figures with lights in their hands', 'yes', 'the figures → a road')
r('5.06', 'MIX', 'a package (the new model) travels along a road toward your phone; two gates on the way', 'yes', 'gate 1')
r('5.07', 'MIX', 'gate 1: a test table, people look into the package · CAISI (U.S. NIST) · TESTED BEFORE LAUNCH', 'yes', 'the table')
r('5.08', 'EXPL', 'five packages queue at gate 1 (no logos) · TESTING AGREEMENTS WITH 5 DEVELOPERS · SINCE 5 MAY 2026', 'no (beat)', 'the gate')
r('5.09', 'MIX', 'the gate has no barrier: VOLUNTARY', 'no (beat)', 'the road')
r('5.10', 'MIX', 'gate 2 with a barrier: testers, a fine slip · EU AI OFFICE · SINCE 2 AUG 2026 · FINES UP TO €15 MILLION OR 3% OF GLOBAL TURNOVER', 'yes', 'the barrier')
r('5.11', 'MIX', 'the package is lifted off the road: RECALL AS A LAST RESORT', 'no (beat)', 'the gates')
# ------------------------------------------------------------------------------------------------ c11 · B3 · inside the machine, C4, who writes line 4
r('5.12', 'EXPL', 'pull back: both gates stand outside the road round the package · RULES WORK FROM THE OUTSIDE', 'yes', 'the package')
r('5.13', 'EXPL', 'the camera goes into the package: inside, the ring of light · AND THE MACHINE ITSELF?', 'yes', 'the ring')
r('5.14', 'MIX', 'a lectern, five tools on the wall behind it · PAUL CHRISTIANO · FOUNDER, ALIGNMENT RESEARCH CENTER · ONCE LED THAT RESEARCH AT OPENAI · BOARD, OPENAI FOUNDATION', 'yes', 'the tools')
r('5.15', 'EXPL', 'the five tools line up as THE METHODS WE HAVE; a slot opens between them', 'no (beat: the slot)', 'the slot')
r('C4', 'CLIP', "ORIGINAL FOOTAGE · PAUL CHRISTIANO · FOUNDER, ALIGNMENT RESEARCH CENTER · THE HINTON LECTURES, 2026 (12.8 s): “So I'd say all of these approaches are plausible approaches. I don't want to say any of them are doomed, but I definitely do want to say that none of them are on a trajectory where we can say that's definitely going to work, or even that's probably going to work.” The plate grows out of the slot and returns into it", 'yes', 'the slot')
r('5.16', 'EXPL', 'each of the five tools lights once: PLAUSIBLE', 'yes', 'the tools')
r('5.17', 'EXPL', 'five markers on a track; none reaches the line PROBABLY WORKS; no ticks', 'no (beat)', 'the track')
r('5.18', 'MIX', 'researchers shine lamps into the opened package, patterns inside become visible · THE MACHINES THEMSELVES, TO STUDY', 'yes', 'the lamps')
r('5.19', 'EXPL', 'the mini board, row 4 CONTROL: WHO WRITES IT?', 'yes', 'row 4')
r('5.20', 'MIX', 'group 1 steps up to row 4: LABS · WHAT GETS BUILT', 'no (beat)', 'group 2')
r('5.21', 'MIX', 'group 2 at an office desk: GOVERNMENTS · WHAT GETS TESTED', 'no (beat)', 'group 3')
r('5.22', 'MIX', 'group 3 at a ballot box: VOTERS · WHO WRITES THE RULES', 'no (beat)', 'the ballot box')
r('5.23', 'MIX', 'you step to the ballot-box group, the stylus in your hand: YOU', 'no (beat)', 'you')
# ------------------------------------------------------------------------------------------------ c12 · B3 · what stays with us, the harvest, subscribe 2, end screen
r('6.01', 'MIX', 'you alone beside the mini board: three rows gold, one empty · WHAT ELSE IS LEFT FOR US?', 'yes', 'the dot sheet')
r('6.02', 'EXPL', 'another problem card flips: ERDŐS PROBLEM #1196 · OPEN ABOUT 60 YEARS · SOLVED APRIL 2026', 'yes', 'the card')
r('6.03', 'MIX', 'a professor silhouette in gown and cap is passed by: NOT A PROFESSOR', 'no (beat)', 'the card')
r('6.04', 'SCENE', 'a young man at a laptop at home at night · LIAM PRICE, 23 · NO ADVANCED TRAINING IN MATHEMATICS', 'yes', 'the laptop')
r('6.05', 'MIX', 'one single line in the input field; it posts · MODEL: GPT-5.4 PRO', 'no (beat)', 'the sheet')
r('6.06', 'MIX', 'the sheet travels over two desks and gets shorter · CHECKED AND SHORTENED BY JARED LICHTMAN AND TERENCE TAO', 'yes', 'the sheet')
r('6.07', 'EXPL', 'TAO lights on one desk', 'no (beat)', 'the sheet')
r('6.08', 'EXPL', 'a title page with eight names, three light: TAO · LICHTMAN · PRICE · 8 AUTHORS · CO-AUTHOR', 'yes', 'the page')
r('6.09', 'EXPL', 'three signs in a row; the middle one lights first: a path · THE MACHINE FOUND THE WAY', 'yes', 'the path')
r('6.10', 'MIX', 'left sign: a ? held by a person · A PERSON CHOSE THE QUESTION', 'no (beat)', 'the ?')
r('6.11', 'MIX', 'right sign: a tick held by people · PEOPLE CHECKED THE ANSWER', 'no (beat)', 'the ?')
r('6.12', 'MIX', 'you hold a compass, not a tool: WHAT STAYS WITH US', 'yes', 'the compass')
r('6.13', 'MIX', 'ANSWERS drift off the compass', 'no (beat)', 'the ?')
r('6.14', 'MIX', 'THE QUESTIONS: the ? stays in your hand', 'no (beat)', 'the needle')
r('6.15', 'MIX', 'the compass needle settles: THE DIRECTION', 'no (beat)', 'the needle → the board')
r('6.16', 'EXPL', 'ANCHOR · THE BOARD big again, the question of the hook over it: SO WHAT WILL A.G.I. INVENT FOR YOU?', 'yes', 'the rows', 'A')
r('6.17', 'EXPL', 'ENERGY · MATERIALS · DISCOVERY in gold: THREE LINES', 'no (beat)', 'the rows')
r('6.18', 'EXPL', 'a small house outline beside the rows: NOT IN YOUR HOME YET', 'no (beat)', 'the house')
r('6.19', 'EXPL', 'three ticks: BEGUN', 'no (beat)', 'row 4')
r('6.20', 'EXPL', 'row 4 cream, the stylus lies in front of it', 'no (beat)', 'the stylus')
r('6.21', 'EXPL', 'OURS TO WRITE', 'no (beat)', 'the board → the long list')
r('6.22', 'EXPL', 'back to the frame-0 motif: the long list HUMAN INVENTIONS, the last row glows · THE ONE THAT INVENTS EVERYTHING ELSE', 'yes', 'the last row', '★')
r('6.23', 'EXPL', 'harvest: a human hand writes HOW TO STEER IT into the empty row in gold light', 'no (the harvest of H.01)', 'the written row')
r('A.01', 'SCENE', 'many hands with lights at the row HOW TO STEER IT', 'yes', 'the hands')
r('A.02', 'SCENE', 'the hands light, many small figures before the board', 'no (beat)', 'the figures')
r('A.03', 'SCENE', 'you look up', 'no (beat)', 'you')
r('A.04', 'MIX', 'subscribe as part of the scene: a lit button on the board’s frame', 'no (beat)', 'the board')
r('E.01', 'WELT', 'END SCREEN 15 s: the board left of centre (three gold rows, HOW TO STEER IT), the ring of light breathes behind it; the right half and the lower band stay calm and empty for the YouTube end-screen elements; no text', 'no', '—')

# ------------------------------------------------------------------------------------------------ the sentences of the timing (same split as lib/kit.mjs)
W = TM['words']
sents, cur = [], []
ABBR = re.compile(r'^["“]?([A-Z]\.){2,}["”]?$')
for k, w in enumerate(W):
    cur.append(w); nx = W[k + 1] if k + 1 < len(W) else None
    end = re.search(r'[.?!]["”’\')\]]*$', w['w']) and not (ABBR.match(w['w']) and nx and not re.match(r'^["“]?[A-Z]', nx['w']))
    if end or (w['w'].endswith(':') and nx and nx['s'] - w['e'] > 3): sents.append(cur); cur = []
if cur: sents.append(cur)
lines = [{'text': ' '.join(w['w'] for w in s), 's': s[0]['s'], 'e': s[-1]['e']} for s in sents]
clips = {c['id']: c for c in TM['clips']}
rows = [x for x in S if not x[0].startswith('C') and not x[0].startswith('E.')]
if len(rows) != len(lines):
    for k in range(min(len(rows), len(lines))): print(k, rows[k][0], '|', lines[k]['text'][:70])
    raise SystemExit(f'{len(rows)} rows for {len(lines)} sentences: fix the table')
times, it = [], iter(lines)
for x in S:
    if x[0].startswith('C'): c = clips[x[0]]; times.append((c['start'], c['end'], '[' + x[0] + ' · original footage]'))
    elif x[0].startswith('E.'): times.append((TM['duration'] - 15, TM['duration'], '[end screen, no voice]'))
    else: l = next(it); times.append((l['s'], l['e'], l['text']))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def gfind(phrase):
    q = [norm(x) for x in phrase.split() if norm(x)]; NW = [norm(w['w']) for w in W]
    for i in range(len(W) - len(q) + 1):
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)): return W[i]['s']
    raise SystemExit('chunk phrase not found: ' + phrase)
chunk_t = [0.0] + [gfind(c[2]) for c in CHUNKS[1:]]   # nth is 0 for every chunk of film 77
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
# a shot owns the picture from its sentence start (clip: slot start) to the next shot's start; shot 1 from 0
out, tot, wsum, per, cuts, anchors = [], 0.0, 0.0, {c[0]: [0.0, 0.0] for c in CHUNKS}, 0, 0
for k, x in enumerate(S):
    a = 0.0 if k == 0 else times[k][0]; b = times[k + 1][0] if k + 1 < len(S) else dur
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[x[1]]; per[c][0] += d; per[c][1] += d * WEIGHT[x[1]]
    fl = x[5].split(); cuts += 'X' in fl; anchors += 'A' in fl
    out.append((c, x, a, d, times[k][2]))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
typ = {}
for c, x, a, d, _ in out: typ[x[1]] = typ.get(x[1], 0) + d
L = ['# Film 77 · "AGI: The Final Human Invention" · shot list (binding, one row per sentence)\n',
     f'Generated by `tools/shots77.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL timing from vo-v4, pace of hoerfassung-v2 (2.46 w/s)" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
     'Edit the table in the script, never this file; re-run it when `<ROOT>audio/timing.json` lands. Times are orientation only: **code anchors on phrases** (`T.G(phrase, 0, after)`, clips `T.clip(id)`).\n',
     '## 1 · Numbers (REGELN §13.2, computed before animating)\n',
     f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights per second of picture: EXPL 1 · MIX .5 · SCENE 0 · WELT 0 · CLIP 0.',
     '- Seconds by type: ' + ' · '.join(f'{k} {v:.0f} s ({v / tot * 100:.0f} %)' for k, v in sorted(typ.items(), key=lambda z: -z[1])) + '.',
     f'- **Hard cuts (X): {cuts}** in {dur / 60:.1f} min ({cuts / (dur / 60):.2f}/min, budget ≈ 1/min). Every other boundary is a carrier transformation (column "Träger"); the 4 clips grow out of an object (a slot, the furnace window) and return into it.',
     f'- **Leitbild anchors (A): {anchors}** = THE BOARD big: Hook H.01 (HUMAN INVENTIONS) · Wende 1.20 (STILL WAITING is set) · Pointe 4.29 (the cover falls) · Schluss 6.16 (the harvest, through 6.23). The mini board in the corner (2.18, 3.17, 4.23, 5.19) is an explainer icon, not the leitbild.',
     f'- Rows: {len(S)} ({len(lines)} sentences + {len(clips)} clips + end screen). New motifs: {sum(1 for x in S if x[3].startswith("yes"))}. ★ = the one wow moment of a chunk.\n',
     '## 2 · Chunks and builders\n', '| chunk | builder | from (phrase) | start | end | length | explainer share |', '|---|---|---|---|---|---|---|']
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
for c, x, a, d, txt in out:
    if c != cur:
        cur = c; ch = next(y for y in CHUNKS if y[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | t | len | Satz | Typ | zeigt wörtlich | Motiv neu? | Träger → nächstes | |')
        L.append('|---|---|---|---|---|---|---|---|---|')
    L.append(f'| {x[0]} | {fmt(a)} | {d:.1f} | {txt} | {x[1]} | {x[2]} | {x[3]} | {x[4]} | {x[5]} |')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(S)} rows, explainer share {share * 100:.1f} %, hard cuts {cuts}, anchors {anchors};',
      'chunks:', {c[0]: f'{per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f}%' for c in CHUNKS}, 'groups:', {k: round(v[1] - v[0]) for k, v in grp.items()})
