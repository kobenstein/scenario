#!/usr/bin/env python3
"""Film 63 · "The Pope Says AI Won't Save You" · the binding shot list -> docs/shots.md.
ONE ROW PER SPOKEN SENTENCE (REGELN §13.1): the sentences come from the timing (the same split as lib/kit.mjs), the rows below are
matched to them IN ORDER; the script stops if the counts differ (a VO change: add/remove a row, re-run). Clip rows ('C1' …) sit at their
slot. Times: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json.   python3 tools/shots63.py
Columns: id · type · zeigt wörtlich (what the viewer literally sees) · Motiv neu? (yes = an own composed motif; 'no' = same picture,
the sentence adds nothing new or is a beat of the shot above) · carrier into the next shot · flags.
Types and weights (REGELN §13.2, per second of picture, computed BEFORE animating):
  EXPL 1 (diagram, number, quote card with §, kinetic type that IS the sentence) · MIX .5 (a scene object carries a graphic) ·
  SCENE 0 (people, rooms, moments) · WELT 0 (a leitbild/world shot without new info) · CLIP 0 (original footage).
Flags: ★ = the one wow moment of the chunk · A = leitbild anchor (scale / Babel tower / Nehemiah's wall, only 3–4 places) ·
  X = a hard cut (budget ≈ 1 per minute, only where a form rhymes across it)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F63ROOT', '/mnt/project-files/scenario/film-papst/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'SCENE': 0.0, 'WELT': 0.0, 'CLIP': 0.0}
# chunk table = film.mjs CHUNKS (id, builder, first phrase)
CHUNKS = [('c01', 'Lead', 'Artificial intelligence will not save you'), ('c02', 'B1', 'In May, in Rome'), ('c03', 'B1', 'That promise is not a slogan'),
          ('c04', 'B1', 'For the Pope, the catch'), ('c05', 'B1', 'His picture for that power'), ('c06', 'B1', 'Tower or wall'),
          ('c07', 'B2', 'This channel exists for one reason'), ('c08', 'B2', 'The share of American output'), ('c09', 'B2', 'The day the Pope presented'),
          ('c10', 'B3', 'In October the Pope'), ('c11', 'B3', 'The night the letter came out'), ('c12', 'B3', 'None of this arrives')]
S = []
def r(i, typ, shows, new, carrier, flags=''): S.append((i, typ, shows, new, carrier, flags))
# ------------------------------------------------------------------------------------------------ c01 · Lead · hook (scenes/sc01.mjs, built)
r('H.01', 'MIX', 'THUMBNAIL A: night city left, the gold MACHINE BLOCK (monolith with a chip and circuit traces) right, the Pope (white, faceless) raises his hand against it, you tiny in yellow beside him · AI WON\'T SAVE YOU builds word by word on the voice under THE POPE:', 'yes', 'the title type', 'A')
r('H.02', 'MIX', 'THE POPE: rolls over into POPE LEO XIV (name tag on a gold line to the Pope); AI WON\'T SAVE YOU tucks under it with the tag IN SHORT', 'no (same picture, the name)', 'the Pope\'s figure')
r('H.03', 'EXPL', 'block and city sink away; behind the Pope a unit chart of small cream figures rolls out row by row to the horizon (1 figure = 10 million) · 1.4 BILLION CATHOLICS · VATICAN STATISTICS, 2024 DATA', 'yes', 'the gold number → a gold dot')
r('H.04', 'SCENE', 'the gold dot falls and becomes the lamp over a kitchen table at night; you (yellow coat) stand at the table, both hands held out open; outside the window the machine block glows', 'yes', 'the light in your open hands')
r('H.05', 'SCENE', 'out of your hands a lit window opens: a bed, someone ill under a blanket, a relative beside them, a small lamp', 'yes', 'the window frame')
r('H.06', 'SCENE', 'the window shrinks to a tile over your left hand; a second one opens: a pile of bills sliding over the table', 'yes', 'the window frame')
r('H.07', 'SCENE', 'a third window: a workbench under a bare bulb before dawn, a bent figure at work, a dark street', 'yes', 'the three tiles')
r('H.08', 'MIX', 'the camera pushes through the kitchen window (the mullions open); the three tiles fly on arcs to the machine block and dock on its face: THAT IS THE PROMISE', 'yes', 'the tiles on the block', '★')
r('H.09', 'MIX', 'tile 1 docks, CURE DISEASE writes in gold beside it', 'no (beat)', 'the block')
r('H.10', 'MIX', 'tile 2 docks, END POVERTY', 'no (beat)', 'the block')
r('H.11', 'MIX', 'tile 3 docks, TAKE THE WORK', 'no (beat)', 'the block')
r('H.12', 'SCENE', 'scaffolding climbs the block, tiny builders (not yellow) on every level, a crane swings a beam: the people building it', 'yes', 'one circuit trace of the block')
r('H.13', 'EXPL', 'one circuit trace pulls out of the chip and becomes a heartbeat line across the night · §9 "Technology has the power to heal…"', 'yes', 'the heartbeat line')
r('H.14', 'EXPL', 'the line writes the single word SAVE in gold; the Pope\'s white raised hand slides in from the left, a cream stroke strikes SAVE through', 'yes', 'the struck word')
r('H.15', 'EXPL', 'SAVE (struck) tucks up as a tag; WHAT DOES HE MEAN? writes word by word, you small below looking up', 'yes', 'the question mark')
r('H.16', 'EXPL', 'left the machine block as a gold outline (THESE MACHINES), right a warhead outline draws (NUCLEAR WEAPONS), both point into one empty word slot ______', 'yes', 'the empty word slot')
r('C1', 'CLIP', 'ORIGINAL FOOTAGE · POPE LEO XIV · VATICAN, 25 MAY 2026: "Artificial intelligence needs to be disarmed." The plate grows out of the empty slot and returns into it', 'yes', 'the slot')
r('H.17', 'EXPL', 'the slot comes back holding DISARMED (gold serif) and locks', 'yes', 'DISARMED')
r('H.18', 'EXPL', 'NOT BANNED rises beside it, is struck and slides off', 'no (beat)', 'DISARMED')
r('H.19', 'EXPL', 'NOT BLESSED rises on the other side, is struck and slides off', 'no (beat)', 'DISARMED')
r('H.20', 'EXPL', 'DISARMED lands heavy, a gold rule under it; the quote line "The word is strong, I know, but deliberately chosen…" · POPE LEO XIV, 25 MAY 2026', 'no (the word gets its weight)', 'DISARMED (seam plate)')
# ------------------------------------------------------------------------------------------------ c02 · B1 · the encyclical
r('1.01', 'EXPL', 'DISARMED sinks as one printed line into a tall letter that unrolls: MAGNIFICA HUMANITAS · ENCYCLICAL LETTER · GIVEN IN ROME, 15 MAY 2026 · 245 PARAGRAPHS; a small ROME pin', 'yes', 'the letter')
r('1.02', 'EXPL', 'a gold 1 rises beside it: HIS FIRST ENCYCLICAL', 'no (beat)', 'the letter')
r('1.03', 'EXPL', 'the name LEO writes itself in gold over the letter; card: ADDRESS TO THE CARDINALS, 10 MAY 2025 — "…developments in the field of artificial intelligence that pose new challenges for the defence of human dignity, justice and labour."', 'yes', 'the name')
r('1.04', 'MIX', 'the Pope\'s white silhouette and the machine block face each other like a poster for a fight: VS', 'yes', 'the VS line')
r('1.05', 'EXPL', 'the VS splits open: four symbols light (heartline, two linked dots, a slate, a roof) · §9 "Technology has the power to heal, connect, educate and protect our common home…"', 'yes', 'the four symbols')
r('1.06', 'EXPL', 'the four step back, ONE IDEA: a single gold point in the middle', 'yes', 'the point')
r('1.07', 'EXPL', '§117 card, words light as spoken: "…an outlook that devalues human limits and promises a purely technical form of “salvation.”"', 'yes', 'the word salvation')
r('1.08', 'EXPL', '“salvation” folds into the title AI WON\'T SAVE YOU (thumbnail type) · THE TITLE OF THIS FILM IS OUR SHORT VERSION', 'yes', 'the letter')
r('1.09', 'EXPL', 'a search bar slides down the whole letter, 38,000 tiny words scroll · FULL-TEXT SEARCH, ABOUT 38,000 WORDS', 'yes', 'the search bar')
r('1.10', 'EXPL', 'results: OPENAI · GOOGLE · META · ANTHROPIC … counter 0', 'no (beat)', 'the counter')
r('1.11', 'EXPL', 'ALTMAN · MUSK · AMODEI · ZUCKERBERG … 0', 'no (beat)', 'the counter')
r('1.12', 'EXPL', '"SUPERINTELLIGENCE" 0 · "AGI" 0', 'no (beat)', 'the search bar')
r('1.13', 'EXPL', 'question card WHAT IS HE ARGUING WITH?', 'yes', 'the card')
r('1.14', 'MIX', 'the card flips: A PROMISE; the machine block\'s glow rises behind it', 'no (answer on the card)', 'the word PROMISE')
# ------------------------------------------------------------------------------------------------ c03 · B1 · the promise
r('2.01', 'MIX', 'a slogan banner over the block tears away; under it the block stands solid', 'yes', 'the block\'s base')
r('2.02', 'EXPL', 'a stacked gold bar grows under the block (dataviz): OPENAI $122B (31 MAR) · ANTHROPIC $65B (28 MAY) · ANTHROPIC IPO $81.3B (19 NOV) · MORE THAN $250 BILLION RAISED BY TWO LABS IN 2026', 'yes', 'the bar')
r('2.03', 'EXPL', 'an essay unrolls: MACHINES OF LOVING GRACE · DARIO AMODEI · CHIEF EXECUTIVE, ANTHROPIC · OCTOBER 2024', 'yes', 'the essay page')
r('2.04', 'EXPL', 'quote card, words light as spoken: "I think that most people are underestimating just how radical the upside of AI could be…" · an arrow UPSIDE climbs', 'yes', 'the arrow')
r('2.05', 'EXPL', '"…just as I think most people are underestimating how bad the risks could be." · a second arrow RISKS plunges', 'no (second half)', 'the two arrows')
r('2.06', 'EXPL', 'a country map made of lit windows (each light a mind) folds into one block · "COUNTRY OF GENIUSES IN A DATACENTER" — DARIO AMODEI', 'yes', 'the lit block')
r('2.07', 'MIX', 'sun and moon race over the block, its lights never go out; a stream of light runs down to you', 'yes', 'the stream to you')
r('2.08', 'EXPL', 'a slider marked THE PROMISE is pushed to its stop: AT ITS STRONGEST', 'yes', 'the slider')
r('2.09', 'SCENE', 'harvest of H.05: the sick person sits up in the lit window, the relative stands', 'yes', 'the window')
r('2.10', 'MIX', 'harvest of H.06: the pile of bills shrinks to one sheet (height marks beside it)', 'yes', 'the sheet')
r('2.11', 'EXPL', 'a week planner full of work blocks; blocks lift off and fly back to you as free hours', 'yes', 'the planner')
r('2.12', 'MIX', 'a newspaper spins in: BEST NEWS IN HISTORY', 'yes', 'the paper')
r('2.13', 'EXPL', 'the three harvest pictures turn back into dashed outlines: STILL A PROMISE', 'no (the harvest, unfilled)', 'the outlines → weights')
r('2.14', 'EXPL', 'ANCHOR · THE SCALE: a giant balance rises out of the night; the three outlines drop as weights into the left pan, it sinks · WHAT IT GIVES YOU / WHAT STAYS YOURS', 'yes', 'the weights', 'A ★')
r('2.15', 'EXPL', 'weight label BODY', 'no (beat)', 'the weights')
r('2.16', 'EXPL', 'MONEY', 'no (beat)', 'the weights')
r('2.17', 'EXPL', 'TIME', 'no (beat)', 'the beam')
r('2.18', 'EXPL', 'question card WHERE IS THE CATCH? hangs from the beam on a hook', 'yes', 'the hook')
# ------------------------------------------------------------------------------------------------ c04 · B1 · the catch
r('3.01', 'MIX', 'the block\'s light becomes a scanning beam that measures you (grid lines over the yellow coat)', 'yes', 'the scan grid')
r('3.02', 'EXPL', 'you turn into a blueprint: dimension lines, upgrade arrows, v2.0 · §112 "…human beings are tempted to see themselves as a project to be optimized rather than as persons called to relationship and communion."', 'yes', 'the blueprint line')
r('3.03', 'SCENE', 'a workshop: at every bench someone works with a small glowing helper; you at your bench without one · OUR EXAMPLE', 'yes', 'the wall behind you')
r('3.04', 'SCENE', 'you work on, unchanged (same speed, same piece)', 'no (same scene)', 'the height mark on the wall')
r('3.05', 'MIX', 'a gold mark on the wall (THE MEASURE) slides up above your head: suddenly you are below it', 'yes', 'the mark')
r('3.06', 'EXPL', 'diagram: THE MACHINE WORKS → THE MEASURE MOVES (THE TRAP)', 'yes', 'the left box')
r('3.07', 'EXPL', 'a first box MACHINE FAILS YOU is struck', 'no (beat)', 'the right box')
r('3.08', 'EXPL', 'the second box IT WORKS lights; the measure mark jumps again', 'no (beat)', 'the mark')
r('3.09', 'EXPL', '§117 card: "If the human being is treated as something to be perfected or surpassed, it becomes easier to accept…"', 'yes', 'the card')
r('3.10', 'MIX', '"…that some lives are less useful, less desirable or less worthy." · a row of figures; three of them get the three labels and sink a step lower', 'yes', 'the row')
r('3.11', 'EXPL', 'question card WHO DECIDES?', 'yes', 'the card\'s top edge → a tower floor')
# ------------------------------------------------------------------------------------------------ c05 · B1 · Babel and the wall
r('4.01', 'MIX', 'ANCHOR · BABEL: a tower grows in one go, one colour, one rhythm · §7 "a single language, a single technology, a single direction"', 'yes', 'the tower', 'A ★')
r('4.02', 'EXPL', 'ONE LANGUAGE · ONE TECHNOLOGY · ONE DIRECTION stack as its floors', 'no (beat)', 'the tower')
r('4.03', 'MIX', 'beside it a city wall rises, many hands, every stone different · §9 "…between constructing Babel or rebuilding Jerusalem"', 'yes', 'the gap between them')
r('4.04', 'EXPL', 'the word DISARM (from the hook) drops into the gap', 'yes', 'DISARM')
r('4.05', 'EXPL', 'race arrows up the tower are pulled out of the race · §110 "Disarming AI means freeing it from the mentality of “armed” competition"', 'yes', 'the arrows')
r('4.06', 'EXPL', 'a few big hands hold the tower\'s top and open · §110 "…freeing technology from monopolistic control"', 'yes', 'the hands → the split')
# ------------------------------------------------------------------------------------------------ c06 · B1 · who owns it
r('4.07', 'EXPL', 'split frame TOWER | WALL, a height gauge beside each', 'yes', 'the gauges')
r('4.08', 'EXPL', '"Which is going up?": both gauges hover, a ? on each', 'no (beat)', 'the tower gauge')
r('4.09', 'EXPL', 'a column of money shoves under the tower, it shoots up · OPENAI · $122 BILLION RAISED AT AN $852 BILLION VALUATION · 31 MARCH 2026', 'yes', 'the tower')
r('4.10', 'MIX', 'beside the tower, parliament domes shrink · §5 "private, often transnational, parties that are endowed with resources and the capacity to intervene that surpass those of many Governments"', 'yes', 'the domes')
r('4.11', 'EXPL', '§109 "naming the new monopolies of AI": THE NEW MONOPOLIES in gold', 'no (beat)', 'the word')
r('4.12', 'MIX', 'a small group turns dials marked VALUES · §107 "A more moral AI is not enough if that morality is determined by a few."', 'yes', 'a dial')
r('4.13', 'MIX', 'you at the kitchen table type a hard question; the answer comes back with the group\'s tag VALUES SET BY A FEW · OUR EXAMPLE', 'yes', 'the tag')
r('4.14', 'EXPL', 'four symbols behind a vault door · §67 "…patents, algorithms, digital platforms, technological infrastructure and data."', 'yes', 'the vault door')
r('4.15', 'MIX', 'the door opens, many hands reach in together, nothing is carried off', 'no (beat)', 'the hands')
r('4.16', 'EXPL', '@jack reposting @Pontifex: "yes" · 26 MAY 2026', 'yes', 'the "yes" card (seam plate)')
# ------------------------------------------------------------------------------------------------ c07 · B2 · subscribe 1, work
r('M.01', 'SCENE', 'the "yes" card tips over and becomes one lit window; around it a night town of windows lights up, one after another', 'yes', 'the windows')
r('M.02', 'SCENE', 'the lights spread to every house of the town, not only the tall ones (FOR EVERYBODY)', 'no (the town grows)', 'the windows')
r('M.03', 'SCENE', 'one window is still dark; a yellow sleeve reaches for its switch', 'no (beat)', 'the switch')
r('M.04', 'SCENE', 'the switch: your window lights; its bulb becomes the bare bulb of the workbench from H.07', 'no (beat)', 'the bulb')
r('4.17', 'EXPL', 'question card AND YOUR WORK? hangs under the bulb', 'yes', 'the bulb → a factory lamp')
r('5.01', 'MIX', 'a factory hall in ink (1891), workers at belts · LEO XIII · RERUM NOVARUM · 1891', 'yes', 'a timeline arrow')
r('5.02', 'EXPL', 'the timeline runs 1891 → 2026: 135 YEARS · LEO XIV · MAGNIFICA HUMANITAS', 'yes', 'the 2026 marker')
r('C3', 'CLIP', 'ORIGINAL FOOTAGE · POPE LEO XIV · VATICAN, 25 MAY 2026: "Today, we find ourselves facing a transformation of similar magnitude, with perhaps even greater consequences." The plate grows out of the 2026 marker', 'yes', 'the marker')
r('5.03', 'EXPL', 'two circles: 1891, and 2026 growing bigger past it', 'yes', 'the big circle')
r('5.04', 'EXPL', 'the circle multiplies ×10 · "10 TIMES BIGGER THAN THE INDUSTRIAL REVOLUTION, AND MAYBE 10 TIMES FASTER" — DEMIS HASSABIS, GOOGLE DEEPMIND, 2025', 'yes', 'a circle → the bulb')
r('5.05', 'SCENE', 'harvest of H.07: the workbench bulb; your hand on the switch', 'yes', 'the switch')
r('5.06', 'SCENE', 'the switch goes off, and with the light three things lift away: a colleague\'s nod, the finished piece, the morning walk', 'yes', 'the finished piece')
r('5.07', 'EXPL', '§149 card: "work is not simply an instrument; it expresses and enhances the dignity of our lives" (first half lights)', 'yes', 'the card')
r('5.08', 'MIX', 'second half lights; two hands finish a piece, a face looks up (no features)', 'no (second half)', 'the piece')
r('5.09', 'EXPL', 'a gold wage band thins, small label A THINNER PAYCHECK (no pay slip, no receipt)', 'yes', 'the band')
r('5.10', 'EXPL', 'an open office as a grid: 3 desks lit, 30 dark; outside, people with empty hands · §154 "forced inactivity, a lack of responsibility and the absence of daily tasks and stimuli"', 'yes', 'the grid')
r('5.11', 'EXPL', 'two arrows: OUTPUT up, the figures smaller · §154 "a paradox of material progress and anthropological regression"', 'yes', 'the up arrow → a bar')
# ------------------------------------------------------------------------------------------------ c08 · B2 · labor share, the objection
r('5.12', 'EXPL', 'one bar of 100 % fills to 53.0 % (dataviz, no invented series) · U.S. LABOR SHARE, NONFARM BUSINESS · 53.0% IN Q3 2026 (PRELIMINARY) · SOURCE: BLS, 5 NOV 2026', 'yes', 'the bar top')
r('5.13', 'EXPL', 'a marker drops to the floor of a gauge 1947 … 2026: LOWEST SINCE RECORDS BEGAN IN 1947', 'no (beat)', 'the gauge')
r('5.14', 'EXPL', 'pale arrows into the bar: WEAKER UNIONS · GLOBALIZATION · CAUSE NOT ESTABLISHED', 'yes', 'the arrows')
r('5.15', 'EXPL', 'two streams: CAPITAL widens, WAGES narrows · §160 "income from capital risks replacing income from labor"', 'yes', 'the streams')
r('5.16', 'EXPL', 'an X post card: "Bad take from the Pope. Tech revolutions tend to eliminate some jobs while creating others. If we cling to jobs, we\'d still be ploughing fields by hand out of fear of disruption." — BLAKE SCHOLL (BOOM SUPERSONIC), X, 25 MAY 2026', 'yes', 'the post')
r('5.17', 'EXPL', 'job icons: some sink, new ones rise (KILL SOME · MAKE OTHERS)', 'yes', 'the icons')
r('5.18', 'SCENE', 'a ploughman in a field at dusk, in ink', 'yes', 'the furrow')
r('5.19', 'MIX', 'the furrow becomes a band of old jobs passing: plough, loom, typewriter · THE PAST', 'yes', 'the band')
r('5.20', 'EXPL', 'the band ends in an open field with a ? · UNPROVEN', 'no (end of the band)', 'the ?')
r('5.21', 'EXPL', 'question card DO THE BUILDERS SEE IT?', 'yes', 'the card → a name card')
# ------------------------------------------------------------------------------------------------ c09 · B2 · a lab on the stage
r('6.01', 'SCENE', 'the synod hall from behind, a row of chairs with name cards; one card is not church', 'yes', 'the odd name card')
r('6.02', 'MIX', 'the essay from 2.03 slides in beside that card', 'yes', 'the card')
r('6.03', 'EXPL', 'CHRIS OLAH · CO-FOUNDER, ANTHROPIC · SPOKE AT THE VATICAN, 25 MAY 2026', 'no (the name)', 'the card')
r('6.04', 'EXPL', 'a blank card with a ? (guess)', 'no (beat)', 'the card')
r('C4', 'CLIP', 'ORIGINAL FOOTAGE · CHRIS OLAH · ANTHROPIC · VATICAN, 25 MAY 2026: "We need informed critics …" (exact words from C4 cut) The plate grows out of the name card', 'yes', 'the name card')
r('6.05', 'SCENE', 'the speaker small at the lectern, the hall huge', 'yes', 'the lectern')
r('6.06', 'EXPL', 'four pressure arrows press on a lab box · "Every frontier AI lab—including Anthropic—operates inside a set of incentives and constraints that can sometimes conflict with doing the right thing." — OLAH', 'yes', 'the lab box')
r('6.07', 'EXPL', 'question card AND YOUR WORK? returns', 'no (harvest of 4.17)', 'the card')
r('6.08', 'MIX', 'an empty workbench; beside it someone reaches a hand to the displaced · "…supporting those displaced will be a moral imperative of historic proportions." — OLAH', 'yes', 'the hand')
r('6.09', 'EXPL', 'a world map, gains light up in a few countries, the pipe between them is missing · "We do not have a mechanism for this." — OLAH', 'yes', 'the map')
r('6.10', 'EXPL', 'two cards side by side, POPE = OLAH', 'yes', 'the =')
r('6.11', 'EXPL', 'NOT ENGINEERED: a blueprint aircraft drawn part by part', 'yes', 'the drawing')
r('6.12', 'MIX', 'GROWN: beside it a plant grows that nobody draws · §98 "current AI systems are more “cultivated” than “built”" · OLAH "They are grown…" (pause)', 'yes', 'the plant')
r('6.13', 'EXPL', 'the hall flips into a trading board: SERIES H · $65 BILLION AT A $965 BILLION VALUATION · 28 MAY 2026', 'yes', 'the board')
r('6.14', 'EXPL', 'ticker: NASDAQ LISTING · 19 NOVEMBER 2026', 'no (beat)', 'the ticker')
r('6.15', 'MIX', 'the four pressure arrows from 6.06 return over the board, applause hands below', 'yes', 'the arrows')
r('6.16', 'EXPL', 'mini scale (explainer, not the anchor): left pan BODY · MONEY · TIME with their tags, right pan empty · WHAT STAYS YOURS?', 'yes', 'the empty right pan (seam plate)')
# ------------------------------------------------------------------------------------------------ c10 · B3 · the answer
r('7.01', 'EXPL', 'ADDRESS TO THE PONTIFICAL ACADEMY FOR LIFE, 30 OCTOBER 2026 · one question card', 'yes', 'the card')
r('7.02', 'EXPL', '"The decisive question, then, is not simply “What can AI do?” but rather, “What purpose should it serve?”" the first question steps back · weight PURPOSE drops into the right pan', 'no (the question)', 'the right pan')
r('7.03', 'EXPL', 'TOOLS, NOT PERSONS: a tool and a person silhouette, a line between · "machines are tools, not persons"', 'yes', 'the tool')
r('7.04', 'SCENE', 'a bank counter without people: your loan application, DECLINED on screen · OUR EXAMPLE', 'yes', 'the counter window')
r('7.05', 'MIX', 'the window turns into a smooth blank surface; you speak to it · "leaving those who suffer harm to confront a faceless entity" · weight RESPONSIBILITY', 'yes', 'the blank surface')
r('7.06', 'EXPL', 'three switches, a hand over each, no automatic', 'yes', 'the switches')
r('7.07', 'EXPL', 'LIFE', 'no (beat)', 'switch 2')
r('7.08', 'EXPL', 'FREEDOM', 'no (beat)', 'switch 3')
r('7.09', 'EXPL', 'THE USE OF FORCE', 'no (beat)', 'switch 3')
r('7.10', 'EXPL', '"I encourage the States meeting in Geneva in November to take concrete steps toward banning lethal autonomous weapons." · GENEVA pin · weight THE LAST DECISION', 'yes', 'the pin')
r('7.11', 'EXPL', 'a heavy card turns over: HARD TO HEAR', 'yes', 'the card')
r('7.12', 'MIX', 'a plant grows through a crack in a wall · §118 "humanity flourishes not despite limitations, but often through them"', 'yes', 'the plant')
r('7.13', 'EXPL', '§118 "it is right to strive to alleviate the suffering that marks human life"', 'no (beat)', 'the card')
r('7.14', 'MIX', 'a hospital visit: a hand on a shoulder; as the shadow of pain is erased, the warm light goes with it · §120 "To eliminate suffering entirely would mean, in the end, extinguishing love and desire as well." · weight LOVE', 'yes', 'the warm light')
r('7.15', 'SCENE', 'you at the fridge, a photo under a magnet', 'yes', 'the photo')
r('7.16', 'SCENE', 'the photo, beside it a calendar full of small sacrifices', 'no (beat)', 'the calendar')
# ------------------------------------------------------------------------------------------------ c11 · B3 · is he right?
r('7.17', 'EXPL', 'question card WHAT CAN NO MACHINE REACH?', 'yes', 'the card')
r('7.18', 'EXPL', 'one single gold line draws across', 'no (beat)', 'the line')
r('C5', 'CLIP', 'ORIGINAL FOOTAGE · POPE LEO XIV · VATICAN, 25 MAY 2026: "The person bears within him- or herself a freedom, an interiority, and a vocation to love and worship that no machine can replace or block." The plate grows out of the line', 'yes', 'the line')
r('7.19', 'EXPL', 'FREEDOM', 'yes', 'the words')
r('7.20', 'EXPL', 'AN INNER LIFE', 'no (beat)', 'the words')
r('7.21', 'EXPL', 'LOVE · WORSHIP; the fourth word stands apart', 'no (beat)', 'WORSHIP')
r('7.22', 'MIX', 'you look at WORSHIP from a distance; the decision stays with you', 'no (beat)', 'the words')
r('7.23', 'EXPL', 'question card IS HE RIGHT?', 'yes', 'the card → an X post')
r('8.01', 'EXPL', 'an X post card: EDDY LAZZARIN · GENERAL PARTNER, a16z · X, 26 MAY 2026 (EVENING OF 25 MAY, U.S. TIME)', 'yes', 'the post')
r('8.02', 'EXPL', '"You could remove the concept of artificial intelligence without changing much about the piece, which could have applied to any major technology shift." · small: ITIF, "AI IS NOT ANOTHER TOWER OF BABEL", 25 MAY 2026', 'no (the quote)', 'the post')
r('8.03', 'EXPL', 'a bar splits in half: HALF TRUE', 'yes', 'the halves')
r('8.04', 'EXPL', 'the five chapters as blocks, the first two another colour · CHAPTER TWO — "FOUNDATIONS AND PRINCIPLES OF THE SOCIAL DOCTRINE OF THE CHURCH"', 'yes', 'the blocks')
r('8.05', 'EXPL', 'chapters 3–5 fill with marks: passages only about these machines', 'no (beat)', 'two marks')
r('8.06', 'EXPL', 'two paragraphs lift out', 'no (beat)', 'the two cards')
r('8.07', 'EXPL', '§98 “cultivated” … “grows” (the plant of 6.12 returns small)', 'no (harvest)', 'the card')
r('8.08', 'EXPL', '§107 "A more moral AI is not enough if that morality is determined by a few." (the dials of 4.12 return small)', 'no (harvest)', 'the card')
r('8.09', 'EXPL', 'a magazine page slides in', 'yes', 'the page')
r('8.10', 'EXPL', '"IDOLS OF THE VALLEY: POPE LEO\'S WISE BUT FRUSTRATING FIRST MISSIVE ON AI" — YUVAL LEVIN, THE NEW ATLANTIS, 27 MAY 2026 · WISE and FRUSTRATING highlighted', 'no (the headline)', 'the page')
r('8.11', 'EXPL', 'a poll sheet: ECONOMIST/YOUGOV · U.S. ADULTS · 29 MAY–1 JUNE 2026', 'yes', 'the sheet')
r('8.12', 'EXPL', 'the shortened sentence on the sheet, words light as spoken', 'no (the sentence)', 'the sheet')
r('8.13', 'EXPL', 'bar chart, all five bars: POPE\'S LINE (SHORTENED §99) 83% · PICHAI 65% · POPE\'S SECOND LINE (REWORDED §126) 61% · ALTMAN 54% · YUDKOWSKY 22%', 'yes', 'the 83 % bar')
r('8.14', 'EXPL', 'the chart steps back: A POLL PROVES NOTHING', 'no (beat)', 'the chart')
r('8.15', 'EXPL', 'two pairs side by side: §98 “cultivated” ↔ OLAH "They are grown…" · §107 "…determined by a few." ↔ OLAH "AI development is concentrated in a handful of wealthy nations."', 'yes', 'the pairs')
r('8.16', 'MIX', 'the VS poster of 1.04 tears: not a duel, ROME and SILICON VALLEY on one bridge', 'yes', 'the bridge')
r('8.17', 'SCENE', 'you at the kitchen table of H.04', 'yes', 'the table')
r('8.18', 'MIX', 'the letter opens with warm light', 'yes', 'the light')
r('8.19', 'MIX', 'the workshop of 3.03: someone leaves early and takes a neighbour along · §156 "technology will be oriented toward freeing up human time and capabilities, rather than producing exclusion"', 'yes', 'the door')
# ------------------------------------------------------------------------------------------------ c12 · B3 · the big answer, subscribe 2, end screen
r('9.01', 'EXPL', 'an arrow that does not move by itself; three levers appear, unlabelled', 'yes', 'the levers')
r('9.02', 'EXPL', '30 OCTOBER 2026 — "…the future of artificial intelligence is not pre-determined. … its future depends on the choices we make."', 'no (the quote)', 'lever 1')
r('9.03', 'EXPL', 'lever 1: LABS', 'no (beat)', 'lever 2')
r('9.04', 'EXPL', 'lever 2: GOVERNMENTS', 'no (beat)', 'lever 3')
r('9.05', 'MIX', 'lever 3: VOTERS, your yellow hand on it', 'no (beat)', 'your hand → the scale')
r('9.06', 'MIX', 'ANCHOR · THE SCALE big again, both pans level for the first time', 'yes', 'the left pan', 'A ★')
r('9.07', 'MIX', 'left pan lights: WHAT A MACHINE CAN TAKE OFF YOUR HANDS', 'no (beat)', 'the left pan')
r('9.08', 'SCENE', 'tile 1 of the hook (the bed) lands on the left pan and is carried off', 'no (harvest)', 'tile 2')
r('9.08b', 'SCENE', 'tile 2 (the bills) lands and is carried off', 'no (harvest)', 'tile 3')
r('9.08c', 'SCENE', 'tile 3 (the workbench) lands and is carried off', 'no (harvest)', 'the right pan')
r('9.09', 'MIX', 'right pan lights: WHAT CANNOT BE HANDED OVER', 'no (beat)', 'the right pan')
r('9.10', 'SCENE', 'on the right pan: two chairs', 'yes', 'the chairs')
r('9.11', 'SCENE', 'a promise kept (a hand on a hand)', 'no (beat)', 'the hands')
r('9.12', 'SCENE', 'a Tuesday morning, no appointment, light on a table', 'no (beat)', 'the light')
r('9.13', 'EXPL', 'a card rises over the right pan', 'yes', 'the card')
r('9.14', 'EXPL', '§128 "…what saves humanity is not enhanced self-sufficiency, but a relationship that liberates, a communion that transforms." · small: IN THE LETTER: A RELATIONSHIP WITH GOD AND WITH OTHERS (§126, §128)', 'no (the quote)', 'the card')
r('9.15', 'EXPL', 'label OUR WORDS, NOT A QUOTE', 'yes', 'the label')
r('9.16', 'EXPL', 'kinetic: ARTIFICIAL INTELLIGENCE CAN SAVE YOUR BODY · YOUR TIME · YOUR MONEY over the left pan', 'yes', 'the words')
r('9.17', 'MIX', 'WHAT YOU DO WITH THEM over the right pan; the open hands of H.04 now hold (pause)', 'yes', 'the hands')
r('9.18', 'SCENE', 'the kitchen table of H.04, the same open hands', 'no (harvest)', 'the hands')
r('9.19', 'SCENE', 'the hand closes round something', 'no (beat)', 'the hand → the wall')
r('A.01', 'SCENE', 'ANCHOR (Schluss) · NEHEMIAH\'S WALL from 4.03, rebuilt by many hands round the scale', 'yes', 'the wall')
r('A.02', 'SCENE', 'your sleeve lays a stone', 'no (beat)', 'the stone')
r('A.03', 'SCENE', 'subscribe', 'no (beat)', 'the scale')
r('E.01', 'WELT', 'END SCREEN 15 s: the scale rests, both pans full, nobody wins; calm lower half for the tiles; no text', 'no', '—')

# ------------------------------------------------------------------------------------------------ the sentences of the timing (same split as lib/kit.mjs)
W = TM['words']
sents, cur = [], []
for w in W:
    cur.append(w)
    if re.search(r'[.?!]["”’\')\]]*$', w['w']): sents.append(cur); cur = []
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
chunk_t = [0.0] + [gfind(c[2]) for c in CHUNKS[1:]]
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
L = ['# Film 63 · "The Pope Says AI Won\'t Save You" · shot list (binding, one row per sentence)\n',
     f'Generated by `tools/shots63.py` from `{os.path.basename(TIMING)}` ({"PROVISIONAL timing, pace of hoerfassung-v2" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
     'Edit the table in the script, never this file; re-run it when `<ROOT>audio/timing.json` lands. Times are orientation only: **code anchors on phrases** (`T.G(phrase, 0, after)`, clips `T.clip(id)`).\n',
     '## 1 · Numbers (REGELN §13.2, computed before animating)\n',
     f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights per second of picture: EXPL 1 · MIX .5 · SCENE 0 · WELT 0 · CLIP 0.',
     '- Seconds by type: ' + ' · '.join(f'{k} {v:.0f} s ({v / tot * 100:.0f} %)' for k, v in sorted(typ.items(), key=lambda z: -z[1])) + '.',
     f'- **Hard cuts (X): {cuts}** in {dur / 60:.1f} min ({cuts / (dur / 60):.2f}/min, budget ≈ 1/min). Every other boundary is a carrier transformation (column "Träger"); the 4 clips grow out of an object and return into it.',
     f'- **Leitbild anchors (A): {anchors}** (Hook · Wende = the scale 2.14 · Pointe = Babel and the wall 4.01 · Schluss = the scale 9.06 with the wall at A.01). The mini scale at 6.16/7.x is an explainer icon, not the leitbild.',
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
