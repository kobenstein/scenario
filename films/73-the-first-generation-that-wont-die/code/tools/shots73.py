#!/usr/bin/env python3
"""Film 73 · "The First Generation That Won't Die" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13). Times from the
current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else data/provisional_timing.json.
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots73.py   (also writes data/anchors73.json for tools/anchors73.mjs)
Every shot: id (H = hook, 1…6 = the sections, M / A = subscribe calls, E = punchline + end), anchor = a VO phrase (looked up after the
previous shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'ENDSCREEN' = duration − 15), zeigt wörtlich
(what the sentence says, shown), the picture (one motif per sentence), layer, carrier into the next shot, flags.
Layers and their explainer weight (REGELN §13.3/§13.7, docs/MOTION.md §1):
  EXPL 1.0 (a diagram on THE LIFELINE: numbers, comparisons, processes, timelines, dot fields, the answer) · MIX .5 (a scene element with a
  diagram on it, a clip plate growing, a callback) · ANCHOR 0 (the Leitbild: the stone "1985 –", only at 4 anchors) · SCENE 0 (you, rooms,
  people) · CLIP 0. World rides count 0 (there are none).
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F73ROOT', '/mnt/project-files/scenario/film-73-wont-die/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', 'Every generation before yours'), ('c02', 'B1', 'The date comes from'), ('c03', 'B1', 'Is that bet paying off'), ('c04', 'B1', 'Then the copy is'),
          ('c05', 'B1', 'And still'), ('c06', 'B2', 'Which brings back'), ('c07', 'B2', 'This channel exists'), ('c08', 'B2', 'Say it works'), ('c09', 'B2', 'And an inheritance is only'),
          ('c10', 'B3', 'And at the very top'), ('c11', 'B3', "It doesn't have to go"), ('c12', 'B3', 'Part of that comes down'), ('c13', 'B3', 'So is yours the first')]
# §13.1a 'Motiv neu?': every shot is a new motif (own place, person, moment or graphic) EXCEPT these (sentence adds no new picture; zoom ≠ new):
NOT_NEW = {'1.25': 'same caveat stack, 2nd tag', '1.26': 'same caveat stack, 3rd tag', '2.02': 'callback to the brain map of H.14', '2.19': 'same brain, the cube pulses',
           '3.02': 'same answer, the bead lands', '3.07': 'same ring of people', '4.12': 'same segments run on', '4.18': 'same two lines, the other tag',
           '5.04': 'same quote card, words light', '5.05': 'same quote card, last words', '5.18': 'same ledges, 2nd seat', '5.19': 'same ledges, 3rd seat',
           '6.04': 'same field, the word', '6.10': 'same bar collapses', '6.17': 'same rule card 1', '6.19': 'same rule card 2', '6.21': 'same rule card 3',
           '6.25': 'same balance, the other side', 'M.04': 'same subscribe tag', 'A.02': 'same end picture'}
# id | anchor phrase | zeigt wörtlich | picture (motion design: what moves, what it becomes) | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs, the quality reference)
 ('H.01', 'Every generation before yours', 'every generation before yours had to die', 'ANCHOR 1/4 · thumbnail A: night hill, the headstone "1985 –" (no death year), a hairline of gold in it; you at its foot; old stones with two years behind; title THE FIRST GENERATION / THAT WON\'T DIE', 'ANCHOR', 'the stone', ''),
 ('H.02', 'Yours may be', 'yours may be the first that won\'t', 'the title sinks; slow push in; on "won\'t" the crack tears open and the light pours out over the grass', 'ANCHOR', 'the crack\'s light', ''),
 ('H.03', 'Because labs', 'labs treat death as an engineering problem', 'the stone turns into a technical drawing (cream outline, dimension lines): AN ENGINEERING PROBLEM; the world sinks, the DASH drops and stretches into THE LIFELINE: 1985 at its start, the blank becomes the END TICK, the old-age end greys', 'MIX', 'the end tick', ''),
 ('H.04', "And they've pointed", 'they have pointed AI at it', 'the AI ring rises behind the line, its cool beam lands on the end tick: AI', 'MIX', 'the beam', ''),
 ('H.05', 'So picture the day', 'picture the day it works', 'you walk onto the line, the camera follows you', 'MIX', 'you', ''),
 ('H.06', 'The offer is in front', 'the offer: no more aging, no end date', 'a card rises in front of you: THE OFFER · NO MORE AGING (the grey end of the line turns gold) · NO END DATE (the end tick lifts off, the line runs on)', 'EXPL', 'the card', ''),
 ('H.07', 'Yes, or no', 'yes, or no', 'the card folds into THE ANSWER: NO ·—●—· YES', 'EXPL', 'the bead', ''),
 ('H.08', 'If you could stop dying', 'if you could stop dying, would you?', 'the question above the answer; the bead trembles in the middle', 'EXPL', 'the bead', ''),
 ('H.09', 'Most people say no', 'most people say no', 'the bead slides to NO · PEW RESEARCH CENTER, 2013', 'EXPL', 'the answer', ''),
 ('H.10', "But the labs aren't", 'the labs aren\'t waiting for an answer', 'the answer lifts away; the AI ring thinks faster, its beam runs along the line', 'MIX', 'the ring', ''),
 ('H.11', 'Some want to copy', 'copy a mind into a computer', 'a head rises out of the line: COPY A MIND; the ring sinks and becomes a computer; a dashed cool line carries the mind over', 'EXPL', 'the screen', ''),
 ('H.12', "And they've started", 'they have started', 'the screen lights', 'MIX', 'the screen', ''),
 ('H.13', 'With a fly', 'with a fly', 'a fly in the screen; the camera dives into it', 'MIX', 'the fly', ''),
 ('H.14', "A real fly's brain", 'a real fly\'s brain was mapped wire by wire', 'the brain map draws itself strand by strand around the fly: A FLY\'S BRAIN, WIRE BY WIRE + source (FlyWire, Nature 2024)', 'EXPL', 'the map', '★'),
 ('H.15', 'This year, a simple', 'a simple model from that map steers a virtual body', 'the map turns cool and small; a virtual (wireframe) fly walks beside it: A SIMPLE MODEL STEERS A VIRTUAL BODY + source (Eon)', 'EXPL', 'the virtual fly', ''),
 ('H.16', "There's a second way", 'a second way to stop dying', 'pull out of the screen: the computer stands on the line = COPY', 'EXPL', 'the line', ''),
 ('H.17', 'Closer', 'closer', 'left, near you, a body drawing rises out of the line', 'EXPL', 'the body', ''),
 ('H.18', 'Repair the body', 'repair the body you already have', 'REPAIR: its worn joints light gold, one by one', 'EXPL', 'the line', ''),
 ('H.19', 'And it comes with a date', 'it comes with a date', 'a gold tick falls onto the line between REPAIR and COPY', 'EXPL', 'the tick', ''),
 ('H.20', 'Twenty thirty-two', '2032', '2032 rises big on the tick → plate2032', 'EXPL', 'plate2032', ''),
 # ---------------------------------------------------------------- c02 · B1 · Kurzweil's date, and the other date
 ('1.01', 'The date comes from', 'the date comes from Ray Kurzweil, Google\'s futurist', 'out of plate2032: a name tag stands on the 2032 tick (RAY KURZWEIL · FUTURIST, GOOGLE); the 2032 opens into the clip plate', 'MIX', 'the plate', ''),
 ('1.02', 'slot:C1', '(Kurzweil: a year back for every year)', 'C1 · RAY KURZWEIL · Futurist, Google · 2025 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the 2032', ''),
 ('1.03', 'His claim', 'a year back for every year you live', 'your lifeline: for every year drawn (gold segment) the end tick slides one year further: +1 YEAR FOR EVERY YEAR', 'EXPL', 'the end tick', ''),
 ('1.04', "That's what", '"won\'t die" means this', 'the grey old-age end dissolves: “WON\'T DIE” · OLD AGE STOPS BEING THE CAUSE', 'EXPL', 'the end', ''),
 ('1.05', 'Not immortal', 'not immortal', 'NOT IMMORTALITY: the line stays a line, not a ray', 'EXPL', 'the line', ''),
 ('1.06', 'An accident could', 'an accident could still kill you', 'a small cream end tick drops somewhere on the line: AN ACCIDENT: STILL POSSIBLE', 'EXPL', 'the tick', ''),
 ('1.07', "Old age couldn't", 'old age couldn\'t', 'the grey end tick fades away: OLD AGE: NO LONGER', 'EXPL', 'the 2032 tag', ''),
 ('1.08', 'But Kurzweil has moved', 'he moved his date before, and sells books about it', 'the date tag hops along the line 2029 → AROUND 2030 → 2032 (KURZWEIL\'S DATE); a short stack of books grows under it', 'EXPL', 'the tag', ''),
 ('1.09', 'Critics note', 'no peer-reviewed study behind it', 'the 2032 tag turns hollow (dashed): CRITICS: NO PEER-REVIEWED BASIS FOR THE DATE', 'EXPL', 'the line', ''),
 ('1.10', "And at today's pace", 'at today\'s pace, one blogger\'s analysis lands elsewhere', 'pull back: a cream dashed run along the line at today\'s pace, far past 2032', 'EXPL', 'the run', ''),
 ('1.11', 'A leading aging researcher', 'a leading aging researcher shared it', 'quote card “bleak, but slightly better than I expected” (de Magalhães, on X) + the analysis source', 'EXPL', 'the card', ''),
 ('1.12', 'Its result', 'not 2032', 'the 2032 tag slides back to its place, dimmed', 'EXPL', 'the run', ''),
 ('1.13', 'Around twenty-four fifty-nine', 'around 2459', 'the run lands: 2459, four centuries along the line; the camera pulls back over them; your whole life is a short gold piece at the start', 'EXPL', 'your piece', '★'),
 ('1.14', 'In your lifetime', 'in your lifetime', 'your piece of the line glows: IN YOUR LIFETIME (2032 lies inside it)', 'EXPL', '2459', ''),
 ('1.15', 'Or four centuries', 'or four centuries too late', 'the far 2459: FOUR CENTURIES TOO LATE', 'EXPL', 'the AI ring', ''),
 ('1.16', 'And even that analysis', 'no chance unless AI speeds it up', 'the AI ring rises over the line and pulls the 2459 run back (dashed): NO CHANCE UNLESS AI SPEEDS IT UP', 'EXPL', 'the ring', ''),
 ('1.17', 'So the first generation', 'the first generation that won\'t die is a bet on AI', 'the title words return small over the line; the ring\'s beam is the bet: A BET ON AI', 'MIX', 'the ring', ''),
 # ---------------------------------------------------------------- c03 · B1 · is the bet paying off
 ('1.18', 'Is that bet paying off', 'is the bet paying off?', 'a lab at night: one lamp, a researcher at a bench, the AI ring as a screen', 'SCENE', 'the screen', ''),
 ('1.19', 'There are early signs', 'early signs', 'on the screen small gold signals blink, one by one', 'MIX', 'a signal', ''),
 ('1.20', 'models are learning', 'AI predicts how a cell reacts to a drug, before the experiment', 'a living cell; a cool dashed outline already shows its reaction, then the drop lands and the cell takes that shape: PREDICTED BEFORE THE EXPERIMENT + source', 'EXPL', 'the cell\'s nucleus', ''),
 ('1.21', 'And in a study published', 'machine learning picked one gene', 'the nucleus unrolls into a row of genes; a cool scan runs along it, one lights gold: ONE GENE: SRSF1 + source', 'EXPL', 'the gold gene', '★'),
 ('1.22', 'They boosted it', 'boosted in old mice', 'two old mice (grey, bent); the gold gene flies into one: a gold spot', 'MIX', 'the mice', ''),
 ('1.23', 'The mice lived', 'about 14 % longer', 'two bars grow from the mice: 778 DAYS · 886 DAYS, +14%', 'EXPL', 'the bars', ''),
 ('1.24', 'A small study', 'a small study', 'the bars shrink into 10 vs 9 dots + source; a caveat tag lands: A SMALL STUDY', 'EXPL', 'the tag', ''),
 ('1.25', 'Female mice only', 'female mice only', 'second tag: FEMALE MICE ONLY', 'EXPL', 'the tag', ''),
 ('1.26', 'Not yet repeated', 'not yet repeated', 'third tag: NOT YET REPEATED', 'EXPL', 'the stack', ''),
 ('1.27', 'And no drug against aging', 'no drug against aging is approved anywhere', 'an empty slot on a pharmacy shelf drawing: APPROVED AGAINST AGING ITSELF: NONE', 'MIX', 'the shelf line', ''),
 ('1.28', 'So the date is a guess', 'the date is a guess', 'the shelf line becomes the lifeline; the 2032 tag wobbles, dashed: A GUESS', 'EXPL', 'the line', ''),
 ('1.29', 'The work is real', 'the work is real', 'the cell, the gene, the mice line up as gold marks on the line: REAL', 'EXPL', 'the gold marks', ''),
 ('1.30', 'But what if the repairs', 'what if the repairs come too late for you?', 'you stand on your line; the repair light runs towards your end tick, too slow: your end tick lands first, you look back at the light', 'MIX', 'the computer', ''),
 # ---------------------------------------------------------------- c04 · B1 · the copy: the fly
 ('2.01', 'Then the copy is', 'then the copy is what\'s left', 'the computer from H.16 lights on the line: COPY', 'MIX', 'the screen', ''),
 ('2.02', 'Back to that fly', 'back to that fly', 'push into the screen: the fly\'s brain map of H.14 again', 'EXPL', 'the map', ''),
 ('2.03', 'This March, a San Francisco', 'a startup plugged the model into a virtual body', 'cool wires run from the map into a wireframe fly body: EON SYSTEMS · SAN FRANCISCO · 7 MARCH 2026 + source', 'EXPL', 'the wires', ''),
 ('2.04', 'And the model began to choose', 'the model began to choose', 'pulses run through the map; three paths fork from it', 'EXPL', 'the paths', ''),
 ('2.05', 'Walk', 'walk', 'the virtual fly walks: WALK', 'MIX', 'the fly', '★'),
 ('2.06', 'Groom', 'groom', 'it rubs its front legs over its head: GROOM', 'MIX', 'the fly', ''),
 ('2.07', 'Feed', 'feed', 'it reaches down to a drop: FEED', 'MIX', 'the screen', ''),
 ('2.08', "The startup's headline", 'the headline: we\'ve uploaded a fruit fly', 'a headline strip slides over the screen: “WE\'VE UPLOADED A FRUIT FLY”', 'EXPL', 'the strip', ''),
 ('2.09', 'Critics said no', 'critics said no', 'two answer strips slide over it: “NO, A FRUIT FLY HAS NOT BEEN UPLOADED” · “NO, WE HAVEN\'T UPLOADED A FLY YET”', 'EXPL', 'the 2nd strip', ''),
 ('2.10', 'Even a foundation', 'even a pro-upload foundation', 'the second strip gets its source: CARBONCOPIES FOUNDATION (works toward uploads)', 'EXPL', 'the fly', ''),
 ('2.11', 'Their point', 'no memories; separate software walks', 'the fly opens like a drawing: an empty memory slot (THE REAL FLY\'S MEMORIES: NONE), the legs on a separate box (WALKING: SEPARATE SOFTWARE)', 'EXPL', 'the screen', ''),
 ('2.12', "The company's own chief", 'the CEO is frank', 'the screen grows into the clip plate (morph)', 'MIX', 'the plate', ''),
 ('2.13', 'slot:C3', '(Andregg: how little went in)', 'C3 · MICHAEL ANDREGG · CEO, Eon Systems · 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the screen', ''),
 # ---------------------------------------------------------------- c05 · B1 · and still: the human brain, the copy of you
 ('2.14', 'And still', 'and still', 'back in the screen: the virtual fly walks on, quietly', 'MIX', 'the fly', ''),
 ('2.15', 'A map of a brain, switched on', 'a map switched on chooses what a body does', 'the screen on its desk in the dark office: a loop of light map → body → map, the fly turns at each pulse', 'MIX', 'the loop', ''),
 ('2.16', 'The same executive says', 'human uploads a few years away', 'quote card “The first human uploads are a few years away, not decades” + A COMPANY\'S CLAIM', 'EXPL', 'the card', ''),
 ('2.17', 'He also has a startup', 'he also has a startup to fund', 'the card tilts on a small gold weight; behind it, a founder’s silhouette at a pitch screen (the money behind the claim)', 'MIX', 'the card', ''),
 ('2.18', 'Yet of a human brain', 'one cubic millimetre of a human brain is mapped', 'a human brain (side view, cream lines), one tiny gold cube in it: 1 MM³ MAPPED + source', 'EXPL', 'the cube', ''),
 ('2.19', 'A crumb', 'a crumb', 'the cube pulses, tiny against the whole brain', 'EXPL', 'the cube', ''),
 ('2.20', 'Its data filled', 'more than a million gigabytes', 'the cube unfolds into a wall of data blocks that fills the frame: 1,400,000 GIGABYTES', 'EXPL', 'the blocks', '★'),
 ('2.21', 'But suppose it worked', 'suppose it worked', 'the blocks fly back together into a whole head (cool)', 'MIX', 'the head', ''),
 ('2.22', 'A copy wakes up', 'a copy wakes up with your memories', 'you on the line; beside you a cool copy of you lights up, the same coat in cool light', 'SCENE', 'the two figures', ''),
 ('2.23', 'Is that you', 'is that you?', 'IS THAT YOU? between the two', 'MIX', 'your line', ''),
 ('2.24', 'Or did you die', 'did you die while something else remembers?', 'your line gets its end tick; the copy\'s cool dashed line runs on', 'MIX', 'the dashed line', ''),
 ('2.25', 'So ask it again', 'ask it again', 'the dashed line lifts into THE ANSWER, cool: COPY', 'EXPL', 'the bead', ''),
 ('2.26', 'If the only way', 'if the only way were a copy, would you?', 'the question; beside it the gold answer (REPAIR) returns → plateTwoAnswers', 'EXPL', 'plateTwoAnswers', ''),
 # ---------------------------------------------------------------- c06 · B2 · the answer most people give
 ('3.01', 'Which brings back', 'the answer most people give', 'out of plateTwoAnswers: the two answers slide into one', 'EXPL', 'the bead', ''),
 ('3.02', 'No', 'no', 'the bead lands on NO', 'EXPL', 'the bar', ''),
 ('3.03', 'In twenty thirteen', 'a 2013 survey asked about living to 120', 'the bar becomes a row of 100 dots (one dot = 1 %): PEW RESEARCH CENTER · “LIVING TO 120 AND BEYOND” · 2013', 'EXPL', 'the dots', ''),
 ('3.04', 'Most said', 'most said: not for me', '56 dots turn: 56% “NOT FOR ME”', 'EXPL', 'the dots', ''),
 ('3.05', 'Yet most believed', 'most believed others would say yes', 'each dot casts a small arrow to another dot: 68%: OTHERS WOULD', 'EXPL', 'the arrows', ''),
 ('3.06', 'It seems everybody wants', 'everybody wants this', 'the dots stand up as a crowd of people, each pointing at someone else', 'SCENE', 'the crowd', '★'),
 ('3.07', 'Except everybody you ask', 'except everybody you ask', 'you step in, ask one; they shake their head and point on', 'SCENE', 'you', ''),
 ('3.08', 'What holds the yes back', 'what holds the yes back?', 'THE ANSWER returns, a dark weight hanging under its YES end', 'EXPL', 'the weight', ''),
 ('3.09', 'This August, a new survey', 'a new survey turned the question around', 'a survey card flips over: NATIONAL GEOGRAPHIC / FINN PARTNERS · 18 AUG 2026', 'EXPL', 'the card', ''),
 ('3.10', 'Would you accept a shorter', 'a shorter life without decline?', 'two lifelines: a long one with a long grey end, a shorter one gold to the end: A SHORTER LIFE WITHOUT DECLINE', 'EXPL', 'the shorter line', ''),
 ('3.11', 'No failing body', 'no failing body', 'the body drawing on it, all joints gold: NO FAILING BODY', 'EXPL', 'the head', ''),
 ('3.12', 'No fading mind', 'no fading mind', 'the head profile, its mind light steady: NO FADING MIND', 'EXPL', 'the dots', ''),
 ('3.13', 'Almost two in three', 'almost two in three said yes', '100 dots, 64 gold: 64% YES', 'EXPL', 'the long line', ''),
 ('3.14', "So the fear isn't living", 'the fear isn\'t living forever', 'you walk the open, all-gold line, calmly', 'MIX', 'its end', ''),
 ('3.15', "It's being old forever", 'it\'s being old forever', 'beside you an old, bent figure walks a line whose grey end stretches on and on: OLD FOREVER vs HEALTHY', 'MIX', 'the grey end', ''),
 # ---------------------------------------------------------------- c07 · B2 · subscribe 1 + the fair question + the turn (anchor 2)
 ('M.01', 'This channel exists', 'the channel exists so superintelligence goes well for everybody', 'pull back: many lifelines side by side (everybody), all with grey ends', 'MIX', 'the grey ends', ''),
 ('M.02', 'Healthy years included', 'healthy years included', 'the people on the lines straighten up as their grey ends turn gold', 'MIX', 'your line', ''),
 ('M.03', 'Want that too', 'want that too?', 'on your line a cream SUBSCRIBE tag rises (a tag, never a button)', 'MIX', 'the tag', ''),
 ('M.04', 'Then subscribe', 'then subscribe', 'the tag lights gold', 'MIX', 'the line', ''),
 ('M.05', 'So ask it the fair way', 'ask it the fair way', 'THE ANSWER returns with HEALTHY above it', 'EXPL', 'the bead', ''),
 ('M.06', 'If you could stop dying, and stay', 'stop dying and stay healthy, would you?', 'the question; the bead moves towards YES', 'EXPL', 'the bead', ''),
 ('M.07', 'Even then', 'a serious case for no', 'a weight hangs on NO, the bead drifts back to the middle', 'EXPL', 'the line', ''),
 ('M.08', 'One philosopher argued', 'an endless life ends in boredom', 'a figure walks an endless line that runs in loops, the same loop again and again: BOREDOM + Williams source', 'MIX', 'the loop', ''),
 ('M.09', 'Others answer', 'some pleasures never wear out', 'on every loop the walker stops at a few points that light again (they don’t wear out) + Fischer source', 'MIX', 'the loop', ''),
 ('M.10', 'But suppose enough people', 'suppose enough people say yes', 'the loop unrolls into many lines with people on them; their beads slide to YES one after another', 'MIX', 'the lines sink', ''),
 ('M.11', 'What happens to a world', 'a world built around dying', 'ANCHOR 2/4 (the turn): the stone on the hill, the crack open; the camera pulls back: the town below lights up, window by window', 'ANCHOR', 'one window', '★ W'),
 # ---------------------------------------------------------------- c08 · B2 · say it works: marriage, work
 ('4.01', 'Say it works', 'say it works', 'push into one window; your lifeline runs out of it: SCENARIO · A LIFE WITH NO END DATE', 'MIX', 'the line', 'W'),
 ('4.02', 'In this scenario', 'older than anyone alive today, and healthy', 'you, older than anyone alive and upright, walk past the tick OLDEST ALIVE TODAY; the line stays gold', 'MIX', 'the line', ''),
 ('4.03', 'Take a promise', 'till death do us part', 'someone walks up a second line that joins yours; you take hands, two gold rings link where the lines meet: TILL DEATH DO US PART', 'MIX', 'the rings', ''),
 ('4.04', 'For most of history', 'usually less than thirty years', 'the joined stretch ends at a tick: ≈ 30 YEARS', 'EXPL', 'the tick', ''),
 ('4.05', 'Now it has no end date', 'now it has no end date', 'the tick lifts off; the joined line runs open', 'EXPL', 'the open line', '★'),
 ('4.06', 'More time with the person', 'more time with the one you love', 'you and your partner walk along the joined line, side by side', 'SCENE', 'the rings', ''),
 ('4.07', 'And a much bigger promise', 'a much bigger promise', 'the rings grow heavy; the joined line bows under them', 'MIX', 'the line', ''),
 ('4.08', 'And a life that long', 'a life that long has to be paid for', 'the joined line splits into work segments; you at a workbench on one of them, a thin payment line under it', 'MIX', 'a segment', ''),
 ('4.09', 'A London professor', 'a professor of long lives: learn, work, retire is breaking', 'one segment grows into the clip plate', 'MIX', 'the plate', ''),
 ('4.10', 'slot:C4', '(Gratton: the three-stage life is breaking)', 'C4 · LYNDA GRATTON · Professor, London Business School · 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into a segment', ''),
 ('4.11', 'So you could have five careers', 'five careers', 'LEARN · WORK · RETIRE (three blocks) break and repeat as five LEARN-WORK pairs, you in a different work coat on each: 5 CAREERS', 'MIX', 'the segments', ''),
 ('4.12', 'And you might never be done', 'you might never be done', 'you walk on along the segments of the open line', 'MIX', 'the line', ''),
 ('4.13', 'And what your parents', 'what your parents would have left you', 'your parents\' house at night, their window lit, you at the gate', 'SCENE', 'the window', ''),
 ('4.14', 'In this scenario, it never comes', 'it never comes', 'two lines, theirs above yours: the hand-off arrow between them never fires: IT NEVER ARRIVES', 'EXPL', 'their line', ''),
 ('4.15', 'Your parents stay', 'your parents stay', 'the parents at their window, healthy, waving', 'SCENE', 'their line', ''),
 ('4.16', "That's the gain", 'that\'s the gain', 'their line, gold on: THE GAIN', 'EXPL', 'the hand-off', ''),
 ('4.17', 'What they own stays', 'what they own stays with them', 'the house key stays in your parent’s hand at the window; the hand-off stays dashed', 'MIX', 'the key', ''),
 ('4.18', "That's the price", 'that\'s the price', 'THE PRICE under the dashed hand-off', 'EXPL', 'the answer', ''),
 ('4.19', 'Still yes', 'still yes?', 'THE ANSWER returns, the bead wavers', 'EXPL', 'the hand-off', ''),
 # ---------------------------------------------------------------- c09 · B2 · inheritance → power and ideas (Planck)
 ('5.01', 'And an inheritance is only', 'an inheritance is the small version', 'the hand-off shrinks; bigger hand-offs line up above it (POWER, IDEAS)', 'EXPL', 'the hand-offs', ''),
 ('5.02', 'Power and ideas', 'power and ideas change hands when someone goes', 'two people on two lines: a baton passes from one to the next only at an end tick', 'MIX', 'the baton', ''),
 ('5.03', 'Max Planck', 'Planck saw it in science', 'quote card (Planck), the words light as they are spoken', 'EXPL', 'the card', ''),
 ('5.04', 'A new truth', 'a new truth does not win by convincing', 'the card\'s words light on', 'EXPL', 'the card', ''),
 ('5.05', 'It wins because', 'it wins because they die', 'the last words light; credit MAX PLANCK', 'EXPL', 'the card', ''),
 ('5.06', 'Economists later tested', 'economists tested it', 'a field of scientist dots around one big star dot', 'EXPL', 'the star', ''),
 ('5.07', 'When a star scientist', 'after a star died early, outsiders did strong work', 'the star\'s line ends; dots from the edge move in and light: +8.6% PAPERS BY OUTSIDERS + source', 'EXPL', 'the outsiders', '★'),
 ('5.08', "That doesn't make death good", 'that doesn\'t make death good', 'the end tick stays cream, never gold', 'EXPL', 'the line', ''),
 ('5.09', 'It shows that people', 'people at the top keep newcomers out by staying', 'a line steps up into a ledge and stays there; newcomers wait below → plateTop', 'EXPL', 'plateTop', ''),
 # ---------------------------------------------------------------- c10 · B3 · Beijing, the powerful, who gets it
 ('5.10', 'And at the very top', 'at the very top it has come up', 'out of plateTop: the ledge becomes a viewing platform', 'MIX', 'the platform', ''),
 ('5.11', 'Beijing, September', 'Beijing, September 2025', 'a night square: rows of lights (the parade), the platform: BEIJING · 3 SEPTEMBER 2025', 'SCENE', 'the square', 'W'),
 ('5.12', 'A military parade', 'a parade, a live microphone', 'a microphone over the walkway, its live light on', 'SCENE', 'the microphone', ''),
 ('5.13', "China's president and Russia's", 'two presidents walk to the platform', 'two silhouettes (no faces) walk towards the platform', 'SCENE', 'the microphone', ''),
 ('5.14', 'Through his interpreter', 'organs transplanted, younger, immortal', 'quote card (via the interpreter, paraphrased) + source (CCTV pool via AP / Reuters)', 'EXPL', 'the card', ''),
 ('5.15', "China's president answers", 'some predict 150 this century', '150 rises huge over the platform; quote card Xi', 'EXPL', 'the 150', '★'),
 ('5.16', "This isn't about two countries", 'not about two countries', 'the two silhouettes become anyone; the platform becomes a row of ledges', 'MIX', 'the ledges', ''),
 ('5.17', 'Any president', 'any president', 'a figure on the first ledge: ANY PRESIDENT', 'MIX', 'the ledges', ''),
 ('5.18', 'Any judge', 'any judge', 'second ledge: ANY JUDGE', 'MIX', 'the ledges', ''),
 ('5.19', 'Any founder', 'any founder', 'third ledge: ANY FOUNDER', 'MIX', 'the queue', ''),
 ('5.20', 'Who steps aside', 'who steps aside, if they never have to?', 'the figures on the ledges never step down, the queue of people below grows: WHO STEPS ASIDE?', 'MIX', 'the queue', ''),
 ('5.21', 'And who gets it at all', 'who gets it at all?', 'a gate in the line; a few people pass, most wait', 'MIX', 'the gate', ''),
 ('5.22', 'In that survey from twenty thirteen', 'most expected only the wealthy would', 'the 2013 dots return: ONLY THE WEALTHY + source', 'EXPL', 'the answer', ''),
 ('5.23', 'Now ask yourself', 'now ask yourself', 'THE ANSWER returns', 'EXPL', 'the bead', ''),
 ('5.24', 'Would you still say yes', 'yes, if the powerful said yes first?', 'a heavy gold weight already sits on YES; the bead backs away from it', 'EXPL', 'the weight', ''),
 ('5.25', 'If you could afford it', 'if you could afford it and your neighbour couldn\'t', 'two houses side by side: your window lit, your neighbour\'s dark', 'SCENE', 'your window', ''),
 # ---------------------------------------------------------------- c11 · B3 · the good version (dawn palette)
 ('6.01', "It doesn't have to go", 'it doesn\'t have to go that way', 'the night warms towards dawn (Lösungsteil palette); the neighbour\'s window lights too', 'MIX', 'the windows', ''),
 ('6.02', 'Start with what people', 'start with what people said yes to', 'the 64 gold dots of 3.13 return as 64 people standing in the morning light', 'MIX', 'the dots', ''),
 ('6.03', 'Not forever', 'not forever', 'the open line: NOT FOREVER', 'EXPL', 'the line', ''),
 ('6.04', 'Healthy', 'healthy', 'HEALTHY', 'EXPL', 'the grey end', ''),
 ('6.05', 'Around the world', 'close to ten years in poor health', 'a lifeline\'s grey end measured: YEARS LIVED IN POOR HEALTH · WORLD 9.6 · USA 12.4 + source', 'EXPL', 'the grey end', ''),
 ('6.06', 'Win those years back', 'win those years back: shrink the decline', 'the grey years fill gold from the end inwards; the decline shrinks to a sliver', 'EXPL', 'the gold years', '★'),
 ('6.07', 'But healthy years only count', 'only if people can afford them', 'a hand reaches for the gold years; a price tag hangs on them', 'MIX', 'the tag', ''),
 ('6.08', 'Some medical technology', 'some technology gets cheap fast', 'a falling curve draws itself', 'EXPL', 'the curve', ''),
 ('6.09', 'Reading a human genome', 'a genome cost $95 million', 'a tall bar: $95 MILLION (2001) + source', 'EXPL', 'the bar', ''),
 ('6.10', 'Today, a few hundred', 'today a few hundred', 'the bar collapses to a sliver: A FEW HUNDRED $', 'EXPL', 'the bar', ''),
 ('6.11', 'Yet so far, in America', 'new technology pushed US health costs up', 'a rising bar beside it: NEW MEDICAL TECHNOLOGY: 27–48% OF US HEALTH-SPENDING GROWTH SINCE 1960 (source line)', 'EXPL', 'the two bars', ''),
 ('6.12', 'Which pattern wins', 'which pattern wins is open', 'the two curves fork from one point: down / up, the fork open', 'EXPL', 'the fork', ''),
 # ---------------------------------------------------------------- c12 · B3 · rules
 ('6.13', 'Part of that comes down', 'part of it comes down to rules', 'three blank rule cards rise over the line: WHO STEPS ASIDE · WHO PAYS · WHO CAN AFFORD IT', 'EXPL', 'the cards', ''),
 ('6.14', "Labs don't write those", 'labs don\'t write them', 'the AI ring reaches for a card; the card stays blank', 'MIX', 'the cards', ''),
 ('6.15', 'Voters and lawmakers do', 'voters and lawmakers do', 'a hall of people raising cards', 'SCENE', 'one card', ''),
 ('6.16', 'A few exist already', 'a few rules exist', 'the first lines appear on the cards', 'EXPL', 'card 1', ''),
 ('6.17', 'Who steps aside', 'who steps aside?', 'card 1 comes forward', 'EXPL', 'the ledge', ''),
 ('6.18', 'American presidents must', 'US presidents after two terms', 'the figure on the ledge of 5.17 steps down after two segments: USA · 22ND AMENDMENT, 1951 · TWO TERMS', 'MIX', 'card 2', ''),
 ('6.19', 'Who pays for longer lives', 'who pays?', 'card 2 comes forward', 'EXPL', 'the retire tick', ''),
 ('6.20', 'Denmark has tied', 'Denmark ties retirement age to life expectancy', 'the RETIRE tick slides with the line\'s end: DENMARK · RETIREMENT AGE 70 FROM 2040 + source', 'EXPL', 'card 3', ''),
 ('6.21', 'And who can afford it', 'who can afford it?', 'card 3 comes forward', 'EXPL', 'the trial line', ''),
 ('6.22', 'A Montana law', 'Montana: sale after a first safety trial', 'a clinic door on a trial timeline PHASE 1 · 2 · 3 opens after phase 1, a patient walks in + source', 'MIX', 'the door', '★'),
 ('6.23', 'In return, two percent', 'two percent of the profit for treatment in the state', 'a thin gold stream (2%) flows from the clinic to people waiting outside', 'MIX', 'the stream', ''),
 ('6.24', 'Supporters call that access', 'supporters: access', 'a balance: ACCESS', 'EXPL', 'the balance', ''),
 ('6.25', 'Critics call it a risk', 'critics: risk', 'the other pan: RISK', 'EXPL', 'the cards', ''),
 ('6.26', 'Most rules for a world', 'most rules were never written', 'a long row of blank cards stretches along the line', 'EXPL', 'a blank card', ''),
 ('6.27', 'How many children', 'how many children if so few go?', 'a window with a cradle; around it the town', 'SCENE', 'the window', ''),
 ('6.28', 'One projection for Sweden', 'a projection for Sweden: its population would grow more slowly than feared', 'a population curve for Sweden bends gently instead of exploding + source (Gavrilov & Gavrilova, 2010)', 'EXPL', 'the curve', ''),
 ('6.29', "Even so, in this year's", 'one in five would accept limits on children', '100 dots, 20 gold: 1 IN 5 + source', 'EXPL', 'the dots', ''),
 ('6.30', 'Would you', 'would you?', 'THE ANSWER returns, the bead in the middle', 'EXPL', 'the answer', ''),
 # ---------------------------------------------------------------- c13 · B3 · punchline (anchor 3), Kernsatz (anchor 4), subscribe 2, end screen
 ('E.01', 'So is yours the first', 'is yours the first generation that won\'t die?', 'ANCHOR 3/4: the stone; in the blank after the dash, faint: 2032 … 2459', 'ANCHOR', 'the blank', 'W'),
 ('E.02', 'The honest answer is a range', 'the honest answer is a range', 'the two years pull apart into a range bar on the stone', 'MIX', 'the range', ''),
 ('E.03', 'The estimates run', 'from the next decade to four centuries', 'the range on the line: THE NEXT DECADE … FOUR CENTURIES', 'EXPL', 'the line', ''),
 ('E.04', 'And neither the repair', 'neither has worked in a human yet', 'REPAIR (body drawing) and COPY (computer) on the line, you between them: IN A HUMAN: NOT YET', 'MIX', 'the end tick', ''),
 ('E.05', 'But something has already changed', 'something has changed', 'the AI ring over the line, its beam on the end tick again', 'MIX', 'the end tick', ''),
 ('E.06', 'With A.I., death has moved', 'death moved from what we accept to what we work on', 'the end tick slides from a column WE ACCEPT into a column WE WORK ON', 'EXPL', 'the columns', ''),
 ('E.07', 'And what we work on', 'think it through before it works', 'you walk ahead of the line’s head, looking back at it: think it through before it works', 'MIX', 'the questions', ''),
 ('E.08', 'Do we want this', 'do we want this?', 'DO WE WANT THIS?', 'EXPL', 'the next question', ''),
 ('E.09', 'What does it do to a life', 'what does it do to a life?', 'WHAT DOES IT DO TO A LIFE?', 'EXPL', 'the next question', ''),
 ('E.10', 'Who gets it', 'who gets it?', 'WHO GETS IT?', 'EXPL', 'the answer', ''),
 ('E.11', 'If you could stop dying', 'if you could stop dying, would you?', 'THE ANSWER, plain (no words); the bead rests in the middle, it is yours', 'EXPL', 'the bead → the crack', ''),
 ('E.12', 'Every generation before us', 'every generation was given the answer', 'ANCHOR 4/4: the old stones on the ridge, each with two years, light one by one', 'ANCHOR', 'the stones', '★'),
 ('E.13', 'We are the first', 'we are the first to be asked the question', 'your stone: "1985 –", the blank open, the crack wide and warm; you look up', 'ANCHOR', 'the stone', ''),
 ('A.01', "That's what this channel is for", 'the channel: superintelligence goes well, the answer stays yours', 'subscribe 2 over the stone, the camera pulls back slowly', 'ANCHOR', 'the stone', ''),
 ('A.02', 'Want that too', 'want that too? subscribe', 'a cream SUBSCRIBE tag on the hill', 'ANCHOR', 'the end screen', ''),
 ('E.14', 'ENDSCREEN', '(end screen)', 'endScreen: the stone high and centred, the town\'s lights below; lower half calm for the two tiles + the subscribe circle', 'ANCHOR', '', ''),
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
L.append('# Film 73 · "The First Generation That Won\'t Die" · shot list (binding, Film-5 format)\n')
L.append(f'Generated by `tools/shots73.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'Spoken text: the newest `vo-vN.txt` in ROOT (vo-v3 may change wording; anchors are phrases, `tools/anchors73.mjs` names any phrase that goes missing). Picture ideas follow text-v2.md BILD/EINBLENDUNG + geruest-v1.md (Korrekturen win); figures only from `F.SOURCES` (faktenzettel.md).\n')
L.append('## 1 · The rules for every frame (REGELN §13)\n')
L.append('- A motion-design film, not one world with zooms: **every picture shows exactly what its sentence says** (column *zeigt wörtlich*). Typography, diagrams, objects that turn into the next object; one motif per sentence.')
L.append('- 60–70 % explainer graphics (numbers, comparisons, processes, timelines, dot fields, THE ANSWER) on THE LIFELINE stage (lib/f73_stage.mjs), the rest scenes and clips. World rides count 0 — there are none.')
L.append('- The Leitbild (THE STONE: night hill, the headstone "1985 –" with no death year, a golden crack, you in the yellow coat, old stones with two years) ONLY at 4 anchors: hook (H.01–H.03), turn (M.11), punchline (E.01–E.02), end (E.12–E.14).')
L.append('- Every change over a carrier object, no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (still < 5 %, none > 2 s).\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** of the whole film (target 60–70 %); without the clip seconds: **{share_nc * 100:.1f} %**. Weights: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0, per second of picture.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min).')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} shots are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}). Zooms and pans never count as new.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. THE ANSWER (F.answer) appears only when the question returns, never as a HUD.\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| THE STONE "1985 –" (the blank after the dash) | H.01–H.03 | M.11 (the town below), E.01–E.02 (2032 … 2459 in the blank), E.12–E.14 |')
L.append('| THE LIFELINE (the dash pulled out of the stone) and its END TICK | H.03 | H.06 (lifts off), 1.03–1.07 (+1 year per year), 2.24 (your end, the copy runs on), 4.04–4.05 (≈ 30 years → open), 5.08, E.06 (we accept → we work on) |')
L.append('| the grey old-age end (AGE) | H.03, H.06 (turns gold) | 1.04, 3.10, 3.15 (old forever), M.01–M.02, 6.05–6.06 (filled gold) |')
L.append('| THE ANSWER (NO ·—●—· YES) | H.07–H.09 | 2.25–2.26 (cool: the copy), 3.01–3.02, 3.08, M.05–M.07, 4.19, 5.23–5.24, 6.30, E.11 (plain, yours) |')
L.append('| the AI ring (a disc, never a robot) | H.04, H.10 | H.11 (becomes the computer), 1.16–1.17 (the bet), 1.18, 6.14, E.05 |')
L.append('| the fly: brain map, virtual body | H.13–H.15 | 2.02–2.07 (walk, groom, feed), 2.14–2.15 |')
L.append('| REPAIR (the body drawing) / COPY (the computer) | H.16–H.18, plate2032 | 1.30, 2.01, 3.11–3.12, plateTwoAnswers, E.04 |')
L.append('| 2032 | H.20 | 1.08–1.12 (moved, hollow), 1.14, 1.28 (a guess), E.01–E.03 |')
L.append('| the 2013 survey dots | H.09 (source) | 3.03–3.05, 5.22 (only the wealthy) |')
L.append('| the ledge (power stays) | 5.09, plateTop | 5.10–5.20, 6.18 (two terms) |')
L.append('| the town (a world built around dying) | M.11 | 4.01 (one window), 4.13, 5.25, 6.01 (dawn), 6.27, end screen |\n')
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
L.append('\n## 6 · Seams between the groups (lib/f73_world.mjs)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | The date comes from | plate2032 (the lifeline at sheet y 846, 1985 at x 150, open to the right; REPAIR body drawing x 600, joints gold; big gold 2032 on its tick x 1040; COPY computer x 1500 with the virtual fly; you x 440; view {960, 666, 1}) | H.20: 2032 rises, the view settles onto the plate | 1.01: the name tag on the 2032, the 2032 opens into the C1 plate |")
L.append("| B1 → B2 | Which brings back | plateTwoAnswers (REPAIR answer gold at y 450, COPY answer cool dashed at y 650, w 640, both beads trembling in the middle) | 2.26: the gold answer returns beside the cool one | 3.01: the two slide into one |")
L.append("| B2 → B3 | And at the very top | plateTop (the gold line steps up into a ledge x 760–1180 at y 430; one figure holds the ledge; four newcomers wait below on the right) | 5.09 settles into it | 5.10: the ledge becomes the viewing platform |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push) and breathe. Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md EINBLENDUNG / ZITATKARTE lines, as `F.SOURCES` in lib/f73_kit.mjs (statement ≤ 6 words + one number; the long rest goes into the source line, `F.source`, 22 px at y 880). On screen "AI", never "A.I.". If vo-v3 / a fact check changes a figure, the lead updates `F.SOURCES`; builders never retype a figure.')
L.append('- No sponsor, no QR. No logos, no flags. No real faces outside the clips (Beijing: silhouettes only, the quotes as cards with the interpreter caveat). No AI images. Never red, never a clock, an hourglass, a needle, a reset button, a kitchen table with four generations (film 20); never a blueprint grid, a sea world or a HUD (film 69).')
L.append('- Clips: lower thirds from ROOT clips-geprueft.json when it lands (`F.CLIPS`; until then C1/C3/C4 are provisional 10 s slots with a marked placeholder).')
import json as _j
_j.dump([[s[0], s[1].partition('#')[0]] for s in SHOTS if not s[1].startswith('slot:') and s[1] != 'ENDSCREEN' and '#' not in s[1]], open(os.path.join(HERE, '..', 'data', 'anchors73.json'), 'w'), indent=0)
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()}, 'layers', {k: round(v) for k, v in lay.items()})
