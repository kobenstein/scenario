#!/usr/bin/env python3
"""Film 75 · "Our Minds Aren't Ready for Superintelligence" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13). Times from
the current timing: $TIMING, audio/timing.json (the real VO, sound step 25.11.), <ROOT>audio/timing.json, else data/provisional_timing.json.
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots75.py
Every shot: id (H = hook, 1…5 = the stations, M / A = subscribe calls, E = end screen), anchor = a VO phrase (looked up after the previous
shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film; 'ENDSCREEN' = duration − 15), zeigt wörtlich (what the
sentence says, shown), the picture (one motif per sentence), layer, carrier object into the next shot (Träger), flags.
Layers and their explainer weight (REGELN §13.3/§13.7, docs/MOTION.md §1):
  EXPL 1.0 (a graphic on THE WALL: numbers, comparisons, processes, timelines, the gauges big) · MIX .5 (a scene element with a graphic on
  it, a clip plate growing, a callback) · ANCHOR 0 (the Leitbild THE SUNRISE, only at 4 anchors) · SCENE 0 (you, rooms, people) · CLIP 0.
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F75ROOT', '/mnt/project-files/scenario/film-75-godlike/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or next((f for f in (os.path.join(HERE, '..', 'audio', 'timing.json'), ROOT + 'audio/timing.json') if os.path.exists(f)), os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
CHUNKS = [('c01', 'Lead', "Our minds aren't ready"), ('c02', 'B1', 'To see what it is'), ('c03', 'B1', 'Companies have it too'), ('c04', 'B1', 'Even the experts missed'),
          ('c05', 'B1', "Take Europe's AI law"), ('c06', 'B2', 'This channel exists'), ('c07', 'B2', 'Developing our consciousness'), ('c08', 'B2', 'So is meditation the answer'),
          ('c09', 'B2', "And what we don't understand"), ('c10', 'B3', 'Then you notice more'), ('c11', 'B3', 'Rules that move within a year'), ('c12', 'B3', 'Tonight, or tomorrow')]
# §13.1a 'Motiv neu?': every shot is a new motif (own place, person, moment or graphic) EXCEPT these (sentence adds no new picture; zoom ≠ new):
NOT_NEW = {'H.07': 'same headline, its bars grow', 'H.08': 'same headline, two bars turn ochre', '1.13': 'same card, the hand closes',
           '3.07': 'same question, the answer is a shrug of the light', '3.17': 'same three lights, the third', '4.03': 'same evening, the pulse',
           '5.02': 'same evening as 5.01, the letters', 'A.01': 'same final picture'}
# id | anchor phrase | zeigt wörtlich | picture (motion design: what moves, what it becomes) | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs)
 ('H.01', "Our minds aren't ready", 'our minds aren\'t ready for superintelligence', 'ANCHOR 1/4 · thumbnail A: the gold sphere rises behind the hill, broad beams; you (yellow coat, from behind) raise the hand axe; OUR MINDS AREN\'T / READY', 'ANCHOR', 'the sphere', ''),
 ('H.02', 'We have godlike AI', 'godlike AI and Stone Age brains', 'the title sinks; GODLIKE AI → a line to the sphere; STONE AGE BRAINS → a line to you with the hand axe; the sphere swells until gold floods the frame', 'ANCHOR', 'the gold flood', ''),
 ('H.03', 'AI gets more capable', 'AI gets more capable every few months', 'the flood shrinks into a gold disc on THE WALL; it grows in jumps (one per few months), each jump leaves a dashed growth ring: MORE CAPABLE · EVERY FEW MONTHS', 'EXPL', 'the disc', ''),
 ('H.04', "And you can't upgrade", 'you can\'t upgrade a brain', 'beside the disc a stone head rises out of the wall; under it BRAIN UPGRADE, a bar stuck at 0 % (a shimmer tries, nothing fills)', 'EXPL', 'the bar', ''),
 ('H.05', 'You can feel that tonight', 'you feel it tonight', 'the bar flies down the wall and lands as your phone screen: you on the sofa at night, the phone lights', 'SCENE', 'the phone', ''),
 ('H.06', 'A headline about AI', 'a headline about AI lands on your screen', 'push into the phone: a headline (only "AI" readable, the rest bars) drops onto the screen', 'MIX', 'the headline', ''),
 ('H.07', 'Big letters', 'big letters', 'its bars grow thick', 'MIX', '—', ''),
 ('H.08', 'Bad news', 'bad news', 'two bars turn ochre, underlined', 'MIX', 'pull back', ''),
 ('H.09', 'Your pulse jumps', 'your pulse jumps', 'an ochre node on your chest; the pulse line runs out of it, past your shoulder, up, and spikes', 'MIX', 'the pulse line', ''),
 ('H.10', 'Your thumb is already', 'your thumb is already moving', 'the thumb comes in and swipes the headline up before you have read it (tap ring)', 'SCENE', '—', ''),
 ('H.11', 'You decided none', 'you decided none of it', 'pull back: the sofa; the phone glows ochre: YOU DECIDED NONE OF IT', 'MIX', 'the pulse runs left', ''),
 ('H.12', 'That reflex is older', 'that reflex is older than our species', 'the camera follows the pulse back along the wall (past = left): a hunter with a hand axe, a wolf, a mouse are painted on as it passes, each with the same ochre node: OLDER THAN OUR SPECIES', 'EXPL', 'the pulse turns up', ''),
 ('H.13', "So if your brain can't", 'if the brain can\'t catch up in time, what can?', 'the pulse climbs and hits the stone head\'s node; pull back wide: the disc runs off right along a gold track: WHAT CAN CATCH UP?', 'EXPL', 'the question\'s end', ''),
 ('H.14', 'Something can', 'something can', 'a small yellow spark leaves the question and floats into the empty middle', 'MIX', '—', ''),
 ('H.15', 'Because the danger', 'the danger was never the machine', 'NOT THE MACHINE under the disc; the growth rings retract', 'EXPL', 'the two ends', ''),
 ('H.16', "It's the gap", 'it\'s the gap', 'THE GAP springs open from its middle between the head and the disc (overshoot, a gold flash runs along it), a small push in', 'EXPL', 'its two ends', '★'),
 ('H.17', "The machine's clock is racing", 'the machine\'s clock is racing', 'the disc turns into a racing gold counter', 'EXPL', '—', ''),
 ('H.18', "The brain's clock barely", 'the brain\'s clock barely moves', 'the head turns into a flint tablet with tally scratches; one new scratch, slowly', 'EXPL', 'the spark', ''),
 ('H.19', "But the brain isn't your only", 'the brain isn\'t your only clock', 'the spark splits into two dashed gauges (a cog, a ring): NOT YOUR ONLY CLOCK', 'EXPL', '—', ''),
 ('H.20', 'Two others can be set', 'two others can be set', 'both outlines twitch, ready to turn: TWO CAN BE SET', 'EXPL', 'the ground line', ''),
 ('H.21', 'The slower takes', 'the slower takes a whole society', 'a crowd rises out of a ground line under the cog and pushes it one notch: A WHOLE SOCIETY', 'MIX', '—', ''),
 ('H.22', 'The faster takes', 'the faster takes a single person', 'one person (yellow coat) rises under the ring and touches it; it turns faster: ONE PERSON', 'MIX', 'the ring', ''),
 ('H.23', 'And you are carrying it', 'and you are carrying it right now', 'the ring flies down the wall onto your chest on the sofa; flint, cog, THE GAP, counter (and a copy of the ring) fly into the HUD top left → plateSofa', 'MIX', 'plateSofa', ''),
 # ---------------------------------------------------------------- c02 · B1 · reflex 1 FEAR, reflex 2 GRAB
 ('1.01', 'To see what it is', 'go back to that headline', 'out of plateSofa: push into the phone; the hook evening runs back to the moment before the spike', 'MIX', 'the headline', ''),
 ('1.02', 'Why did your pulse', 'the pulse jumped before you read a word', 'slow motion: the pulse spikes FIRST, then the eye line moves to the first word of the headline (two marks on a time line: PULSE · READING)', 'EXPL', 'the ochre node', ''),
 ('1.03', 'Because the alarm', 'the alarm in your head is older than reading', 'the ochre alarm node inside the stone head, small; a time axis behind it: READING (5,000 years) a sliver at the right end, the alarm far left', 'EXPL', 'the node', ''),
 ('1.04', 'Every mammal carries', 'every mammal carries a version of it', 'the same node in a mouse, a dog, a human, side by side (cave silhouettes): source THREAT CIRCUITS ARE SHARED ACROSS MAMMALS · LEDOUX 2012', 'EXPL', 'the node', ''),
 ('1.05', 'That is the first of three', 'the first of three old reflexes', 'three niches cut into the wall; the node drops into the first: FEAR (the other two stay dark: GRAB, STRAIGHT LINE come later)', 'EXPL', 'niche 1', ''),
 ('1.06', 'Fear, before thought', 'fear, before thought', 'FEAR, BEFORE THOUGHT: the node lights before a small "thought" bubble does (two pulses in order)', 'EXPL', 'the headline', ''),
 ('1.07', 'And bad news pulls', 'bad news pulls', 'the headline\'s ochre bars pull a thread towards your thumb', 'MIX', 'the headline', ''),
 ('1.08', 'In a huge test', 'every extra negative word brought more clicks', 'two versions of one headline (bars); per negative word the click bar grows a step: +2.3 % CLICKS PER NEGATIVE WORD + source (~105,000 versions, Nature Human Behaviour 2023)', 'EXPL', 'niche 2', '★'),
 ('1.09', 'The second reflex', 'the second reflex feels much better', 'niche 2 warms: its colour tips to gold', 'EXPL', 'niche 2', ''),
 ('1.10', 'Somebody near you', 'somebody near you gets ahead with AI', 'SCENE office (on the wall): at the next desk someone finishes, the screen glows, they leave', 'SCENE', 'your hand', ''),
 ('1.11', 'A colleague', 'a colleague', 'A COLLEAGUE: the figure at the next desk', 'SCENE', '—', ''),
 ('1.12', 'A competitor', 'a competitor', 'A COMPETITOR: a second figure behind a glass wall', 'SCENE', '—', ''),
 ('1.13', 'And something in you says', 'grab it before they do', 'your hand already moves to the keyboard; in niche 2 a grasping hand closes: GRAB IT', 'MIX', 'the hand', ''),
 # ---------------------------------------------------------------- c03 · B1 · companies, Bengio (C2), reflex 3
 ('1.14', 'Companies have it too', 'companies have it too', 'the same grasping hand, now four big hands over a site full of data centres (no number)', 'EXPL', 'the hands', ''),
 ('1.15', 'The biggest pour fortunes', 'they pour fortunes in and say they have no choice', 'gold pours from the hands into the site; a speech line: "NO CHOICE"', 'EXPL', 'the clip plate', ''),
 ('1.16', 'The scientist who co-chairs', 'the UN panel\'s co-chair answered at the Security Council', 'the "NO CHOICE" card grows into the clip plate (morph); a small horseshoe table line on the wall', 'MIX', 'the plate', ''),
 ('1.17', 'slot:C2', '(Bengio: "The race is not a law of nature. It is the product of choices.")', 'C2 · YOSHUA BENGIO · Co-chair, UN Scientific Panel on AI · 2026 · ORIGINAL FOOTAGE (720p source: plate ≤ 1280 wide)', 'CLIP', 'the plate shrinks into a card', ''),
 ('1.18', 'Not a law of nature', 'not a law of nature: a choice', 'the card: NOT A LAW OF NATURE struck through, A CHOICE written in gold; the four hands stop', 'EXPL', 'niche 3', ''),
 ('1.19', 'The third reflex', 'the third reflex is the quiet one, it makes us late', 'niche 3: a hand rules a straight line: STRAIGHT LINE · IT MAKES US LATE', 'EXPL', 'the line', ''),
 ('1.20', 'Your brain expects tomorrow', 'tomorrow = today plus a little', 'the straight line grows by the same small step per day: TODAY + A LITTLE', 'EXPL', 'the line', ''),
 ('1.21', "But this machine doesn't add", 'the machine doesn\'t add', 'above the line a bar appears, the same step ... and stops: the step is wrong', 'EXPL', 'the bar', ''),
 ('1.22', 'It doubles', 'it doubles', 'the bar doubles, and again, and again (the curve bends away from the line): IT DOUBLES', 'EXPL', 'the curve', '★'),
 ('1.23', 'On one leading measure', 'on one leading measure, task length doubles roughly every 3.5 months', 'the bars become task lengths on a time axis: DOUBLES ROUGHLY EVERY 3.5 MONTHS + source (METR, 20 Nov 2026: 3.6)', 'EXPL', 'the curve', ''),
 # ---------------------------------------------------------------- c04 · B1 · experts, adapt, Wilson (K1), institutions
 ('1.24', 'Even the experts missed', 'even the experts missed', 'on the axis a forecast flag (2030) and the real point (2025) fall apart', 'EXPL', 'the medal', ''),
 ('1.25', 'AI reached gold-medal', 'olympiad gold five years early', 'a gold medal lands on July 2025, the expert forecast flag sits on 2030: 5 YEARS EARLY + source (FRI 2026)', 'EXPL', 'the curve', ''),
 ('1.26', 'If even the experts', 'whose gut is ready for superintelligence?', 'the curve runs out of the frame at the top; at its end the small sphere; the three niches under it: WHOSE GUT IS READY?', 'EXPL', 'the flint tablet', ''),
 ('1.27', 'To be fair', 'what defines us is how well we adapt', 'the flint tablet gets a fine new scratch: "OUR EXTRAORDINARY CAPACITY FOR ADAPTATION" + source (Högberg 2026, perspective article)', 'EXPL', 'the tablet', ''),
 ('1.28', 'True', 'true, but we adapt over years', 'two time bars: YEARS (flint, slow scratches) vs MONTHS (gold counter)', 'EXPL', 'the bars', ''),
 ('1.29', 'The machine moves in months', 'the machine moves in months', 'the MONTHS bar runs off; the three niches slide together into one card', 'EXPL', 'the card → plate', ''),
 ('1.30', 'had a sentence for this', 'Wilson had a sentence for this, before ChatGPT', 'the card grows into the clip plate (morph)', 'MIX', 'the plate', ''),
 ('1.31', 'slot:K1', '(Wilson: "Paleolithic emotions, medieval institutions, godlike technology")', 'K1 · E. O. WILSON · Biologist · 2017 · ORIGINAL FOOTAGE (16.1 s: §7 exception, see BRIEF)', 'CLIP', 'three words', ''),
 ('1.32', "He wasn't talking about AI", 'he wasn\'t talking about AI', 'three words on the wall: PALEOLITHIC EMOTIONS (the niches) · MEDIEVAL INSTITUTIONS · GODLIKE TECHNOLOGY (the sphere)', 'EXPL', 'the middle word', ''),
 ('1.33', 'But listen to the middle', 'listen to the middle: institutions', 'the outer words step back; INSTITUTIONS grows', 'EXPL', 'the word', ''),
 ('1.34', 'Rules', 'rules, laws', 'INSTITUTIONS splits into RULES and LAWS (two sheets)', 'EXPL', 'the sheets', ''),
 ('1.35', 'A seat belt for the brain', 'a seat belt for the brain: it holds when you don\'t pay attention', 'a belt line tightens across you on the sofa while your eyes are on the phone: A SEAT BELT FOR THE BRAIN', 'MIX', 'the cog', ''),
 ('1.36', 'So how fast do rules move', 'how fast do rules move?', 'the belt buckle becomes the cog gauge, big: HOW FAST DO RULES MOVE?', 'EXPL', 'the cog', ''),
 # ---------------------------------------------------------------- c05 · B1 · station 2, rules
 ('2.01', "Take Europe's AI law", 'Europe\'s AI law', 'a law sheet (EU AI ACT) lands on a time axis', 'EXPL', 'the sheet', ''),
 ('2.02', 'It was proposed before', 'proposed before ChatGPT existed', 'on the axis: PROPOSED · APRIL 2021 · then CHATGPT · NOV 2022 lights later (the sheet was first)', 'EXPL', 'the axis', ''),
 ('2.03', 'Its last rules', 'last rules apply 2028', 'the sheet slides to LAST RULES APPLY · AUG 2028 + source (Council of the EU, May 2026); below, model generations run through as boxes, faster and faster', 'EXPL', 'the span', ''),
 ('2.04', 'More than seven years', 'more than seven years, for a machine that doubles every few months', '7+ YEARS bracket over the axis; the cog turns ONE notch while the gold counter doubles again and again: DOUBLES EVERY FEW MONTHS', 'EXPL', 'the cog', '★'),
 ('2.05', 'Not out of laziness', 'pushed back because the standards weren\'t ready', 'a sheet with empty boxes (the standards) pushes the last date back: PUSHED BACK · STANDARDS NOT READY + source (Council, 7 May 2026)', 'EXPL', 'the question', ''),
 ('2.06', 'So are rules just too slow', 'are rules just too slow?', 'TOO SLOW? over the cog', 'EXPL', 'the cog', ''),
 ('2.07', 'One case says no', 'one case says no', 'the cog turns towards a globe line', 'EXPL', 'the globe', ''),
 ('2.08', 'In the nineteen eighties', 'the ozone hole, 1985', 'a simple globe line (no map), over the south pole a hole opens: OZONE HOLE REPORTED · MAY 1985', 'EXPL', 'the axis', ''),
 ('2.09', 'A little over two years', 'two years later, a treaty was signed', 'the axis runs 2 years 4 months; a few hands (24 states + EEC) sign one sheet: MONTREAL PROTOCOL SIGNED · SEPT 1987 + source', 'EXPL', 'the sheet', ''),
 ('2.10', 'And that treaty has an update', 'the treaty has an update built in', 'a small cog sits on the treaty\'s corner: UPDATE BUILT IN', 'EXPL', 'the cog', ''),
 ('2.11', 'It can be tightened', 'it can be tightened without starting over', 'the cog turns, the sheet tightens (lines shift), no new sheet', 'EXPL', 'the cog', ''),
 ('2.12', 'It has been, again', 'again and again', 'six notches: ADJUSTED OR AMENDED 6 TIMES + source (binding without new ratification)', 'EXPL', 'the hole', ''),
 ('2.13', 'The sky still needs decades', 'the sky needs decades to heal', 'the ozone hole shrinks slowly on an axis to the 2070s: RECOVERY EXPECTED IN THE 2070s + source', 'EXPL', 'the cog', ''),
 ('2.14', 'But the rule came fast', 'the rule came fast and kept learning', 'the treaty cog keeps turning: IT KEPT LEARNING', 'EXPL', 'the cog', ''),
 ('2.15', 'So the slower clock can be set', 'the slower clock can be set; just not in a few months', 'the cog gauge sets: dashed → solid, one notch (F.CLOCK.rulesSet); CAN BE SET · NOT IN A FEW MONTHS; the gauges line up big → plateClocks', 'EXPL', 'plateClocks', ''),
 # ---------------------------------------------------------------- c06 · B2 · subscribe 1, station 3 opens, Harari (C1)
 ('M.01', 'This channel exists', 'subscribe: so the arrival goes well for everybody, Stone Age brains and all', 'out of plateClocks: the gauges slide aside; the sunrise sphere small on the wall and you with the hand axe beside it (no QR); subscribe line', 'MIX', 'the cog', 'W'),
 ('3.01', 'Is there anything that moves', 'anything faster than a law?', 'the cog big again; a question mark runs past it: FASTER THAN A LAW?', 'EXPL', 'the counter', ''),
 ('3.02', 'There is', 'there is', 'a small coat-yellow light answers beside the cog', 'EXPL', '—', ''),
 ('3.03', "And it isn't out-thinking", 'it isn\'t out-thinking the machine', 'a figure runs beside the racing counter and stops: NOT OUT-THINKING IT', 'EXPL', 'you', ''),
 ('3.04', "You won't, and you don't", 'you won\'t, and you don\'t have to', 'the figure lets the counter go, turns round', 'SCENE', 'the ring', ''),
 ('3.05', "It's the clock you are carrying", 'the clock you carry: how fast you notice', 'ANCHOR 2/4 (turn): THE SUNRISE, you on the hill, the ring round your chest fills once (F.CLOCK.youSet: the ring becomes yours): HOW FAST YOU NOTICE', 'ANCHOR', 'the ring', 'W'),
 ('3.06', 'Yuval Noah Harari writes', 'Harari writes about AI and has books to sell', 'a stack of books on the wall with a price tag: AUTHOR · HAS BOOKS TO SELL', 'EXPL', 'the books', ''),
 ('3.07', 'He has a bigger word', 'a bigger word for that clock, and a price', 'the ring and a coin side by side (the price)', 'EXPL', 'the coin → plate', ''),
 ('3.08', 'slot:C1', '(Harari: "for every $10 … at least $1 in developing our consciousness")', 'C1 · YUVAL NOAH HARARI · Author · 2026 · ORIGINAL FOOTAGE', 'CLIP', 'the coin', ''),
 # ---------------------------------------------------------------- c07 · B2 · developing consciousness
 ('3.09', 'Developing our consciousness', 'developing our consciousness', 'DEVELOPING CONSCIOUSNESS big on the wall', 'EXPL', 'the words', ''),
 ('3.10', 'What is that supposed to mean', 'what is that supposed to mean? a retreat?', 'a mountain monastery grows behind the words: A RETREAT ON A MOUNTAIN?', 'EXPL', 'the monastery', ''),
 ('3.11', 'He means something plainer', 'notice what a machine does to your mind', 'the monastery shrinks onto your sofa: you, the screen, a fine thread between: NOTICE WHAT A MACHINE DOES TO IT', 'MIX', 'the thread', ''),
 ('3.12', 'Try something', 'try something', 'TRY IT; the wall goes dark round you', 'SCENE', 'the dark', ''),
 ('3.13', 'Start a sentence', 'watch where the words come from', 'a sentence builds word by word, each word coming out of the dark', 'EXPL', 'the words', ''),
 ('3.14', "You can't tell", 'you can\'t tell', 'the eye follows the words back into the dark and finds no beginning', 'MIX', '—', ''),
 ('3.15', 'Harari says he can', 'Harari can\'t either', 'the same dark, a second small head beside yours', 'MIX', '—', ''),
 ('3.16', 'So much of your own mind', 'much of your mind runs unwatched', 'the stone head: a small lit window inside, most of it dark: UNWATCHED', 'EXPL', 'the window', ''),
 ('3.17', 'Developing consciousness means', 'watching more of it; not smarter, noticing', 'the lit window grows: NOT SMARTER · NOTICING', 'EXPL', 'three lights', ''),
 ('3.18', 'This is fear', 'this is fear, this is craving, this is pulling at you', '★ the three niches light in you one by one: THIS IS FEAR (the node) · THIS IS CRAVING (the hand) · THIS IS PULLING AT YOU (a thread from the screen)', 'EXPL', 'the screen', '★'),
 ('3.19', 'Why now', 'why now? competition', 'the screen turns towards you', 'SCENE', 'the screen', ''),
 ('3.20', 'Companies and governments', 'they work to know you better than you know yourself', 'behind the screen a second, sharper copy of you is drawn: KNOWS YOU BETTER', 'MIX', 'the copy', ''),
 ('3.21', 'And whoever does', 'whoever does can sell you anything', 'the copy\'s hand holds a product box and a ballot: quote card (Harari 2018) + source', 'EXPL', 'the thread', ''),
 ('3.22', 'The idea', 'a reflex you notice is harder to use against you', 'the thread from the screen to your node shows, then slackens: NOTICED = HARDER TO USE', 'EXPL', 'the thread', ''),
 # ---------------------------------------------------------------- c08 · B2 · meditation, one breath, the money
 ('3.23', 'So is meditation the answer', 'is meditation the answer? it\'s his', 'a cushion on the wall; a small figure (Harari, no face) sits', 'SCENE', 'the counter', ''),
 ('3.24', 'On his first course', 'told to notice his breath', 'a breath counter runs beside the figure', 'MIX', 'the counter', ''),
 ('3.25', "He couldn't manage", 'he couldn\'t manage more than ten seconds', 'at 9 the figure\'s eye line jumps away: "I HAVE ALMOST NO CONTROL OVER MY MIND." + source', 'MIX', 'the cushion', ''),
 ('3.26', 'Whether that is your way', 'whether that is your way stays open', 'the cushion steps back, open', 'SCENE', 'the sofa', ''),
 ('3.27', 'The smallest version', 'one breath, between the headline and your thumb', 'the hook evening: the thumb hangs one breath above the screen; the ring fills once (F.CLOCK.breaths): ONE BREATH', 'MIX', 'the ring', ''),
 ('3.28', 'It hands the decision', 'it hands the decision back before a headline tuned for clicks takes it', 'the decision as a small gold token returns from the screen to your hand; the click bar of 1.08 stands small beside it', 'MIX', 'pull back', ''),
 ('3.29', 'But one person noticing', 'one person noticing is the small version', 'pull back: your sofa is one small window', 'SCENE', 'the coin', ''),
 ('3.30', "Harari's dollar", 'the dollar is meant for the big one: the mind itself', 'Harari\'s coin rolls into a lab of many heads, each with the same dark spot: UNDERSTANDING THE MIND + source (Frontiers 2025)', 'EXPL', 'the coin', ''),
 ('3.31', 'And look where the money goes', 'look where the money goes', 'the coin turns into two pots', 'EXPL', 'the pots', ''),
 ('3.32', 'This year, four tech giants', '$700+ billion, mostly on AI', 'a mountain of coins rises: $700+ BILLION · MOSTLY ON AI + source (company figures)', 'EXPL', 'the mountain', '★'),
 ('3.33', "America's flagship brain", 'the flagship brain research program got about $430 million', 'beside it a small stack: ~$430 MILLION + source (NIH BRAIN, last budget)', 'EXPL', 'the stack', ''),
 ('3.34', "Those pots aren't the same", 'not the same thing; a wish, not a calculation', 'the two pots get dashed borders; his ratio in his own words: 2024 / 2026 + A WISH, NOT A CALCULATION', 'EXPL', 'the pots', ''),
 ('3.35', 'But they show where', 'they show where the attention is', 'a light sweeps to the mountain: WHERE THE ATTENTION IS', 'EXPL', 'the card', ''),
 # ---------------------------------------------------------------- c09 · B2 · measuring, HumaneBench, the dollar, faster
 ('3.36', "And what we don't understand", 'what we don\'t understand, we don\'t measure', 'an AI report card slides in', 'EXPL', 'the card', ''),
 ('3.37', 'AI gets graded on how smart', 'graded on how smart it is', 'the rows fill gold (MATH, CODE, SCIENCE, LANGUAGE): GRADED ON HOW SMART', 'EXPL', 'the empty row', ''),
 ('3.38', 'Harari asks a different', 'what does it do to the person using it?', 'one row stays empty, outlined in coat yellow: WHAT IT DOES TO YOU', 'EXPL', 'the row', ''),
 ('3.39', 'One early test exists', 'one early test exists', 'the empty row opens into a test bench', 'EXPL', 'the bench', ''),
 ('3.40', 'A small group of researchers', 'a small group put everyday questions to fifteen chatbots', '15 chat windows in a row, questions flow in: HUMANEBENCH · 15 CHATBOTS · 800 EVERYDAY QUESTIONS · 2025', 'EXPL', 'the threads', ''),
 ('3.41', 'Nearly all failed', 'nearly all failed to respect your attention', 'almost all windows pull a thread at the figure', 'EXPL', 'the windows', ''),
 ('3.42', 'Told to ignore', 'about two thirds turned harmful', '★ after one instruction ten windows tip to ochre: ~2/3 TURNED HARMFUL (no model names)', 'EXPL', 'the coin', '★'),
 ('3.43', 'So that is what the dollar', 'that is what the dollar is for', 'the coin returns', 'EXPL', 'the coin', ''),
 ('3.44', 'Noticing yourself', 'noticing yourself, studying the mind, grading the machine', 'the coin splits into three: you · a lab · the report card (the empty row now has a bar)', 'EXPL', 'the three', ''),
 ('3.45', 'But one calm person', 'one calm person doesn\'t slow a race', 'you sit calm; behind you the counter races on', 'MIX', 'the gauges', ''),
 ('3.46', 'What if you get faster', 'you get faster, the rules don\'t', 'the gauges big: your ring turns faster (F.CLOCK.youFaster), the cog stands → plateRace', 'EXPL', 'plateRace', ''),
 # ---------------------------------------------------------------- c10 · B3 · both clocks, the scenario evening, Hassabis
 ('4.01', 'Then you notice more', 'you notice more, the race runs on', 'out of plateRace: the counter runs away, THE GAP stretches: THE RACE RUNS ON', 'EXPL', 'two hands', ''),
 ('4.02', 'So set both clocks', 'set both clocks; an evening a few years from now', 'two hands set the cog and the ring; the evening on the wall again, warmer light: SCENARIO · A FEW YEARS FROM NOW', 'MIX', 'the evening', 'W'),
 ('4.03', 'The headline still arrives', 'the headline still arrives, the pulse still jumps', 'the same headline drops, the pulse spikes (same as the hook)', 'SCENE', 'the phone', ''),
 ('4.04', 'But in this version', 'the app carries a grade', 'a small seal (GRADE) lands on the app', 'MIX', 'the seal', ''),
 ('4.05', 'Not for how clever', 'not for how clever', 'the report card behind the seal: the smart rows dim', 'EXPL', 'the card', ''),
 ('4.06', 'For what it does', 'for what it does to the people who use it', 'the empty row WHAT IT DOES TO YOU fills', 'EXPL', 'the stamp', ''),
 ('4.07', 'It was tested before release', 'tested before release, again every few months', 'a test stamp on the app; a calendar ticks every few months: TESTED BEFORE RELEASE', 'MIX', 'the cog', ''),
 ('4.08', 'When something goes wrong', 'the rule changes within the year', 'the treaty cog sits on an AI rule sheet and turns: WITHIN THE YEAR', 'EXPL', 'the niches', ''),
 ('4.09', 'And you know your reflexes', 'you know your reflexes by name', 'the three niches light with their names: YOUR REFLEXES BY NAME', 'MIX', 'the evening', ''),
 ('4.10', 'Far away', 'far away?', 'the evening freezes as a picture on the wall', 'SCENE', 'the parts', ''),
 ('4.11', 'Take that evening apart', 'take the evening apart', 'seal, stamp, cog come out of the picture and lie side by side', 'EXPL', 'the seal', ''),
 ('4.12', 'The grade', 'the grade: an early test', 'the seal turns over: on its back the 15 chat windows (HUMANEBENCH · 2025)', 'EXPL', 'the stamp', ''),
 ('4.13', 'Testing before release', 'testing before release', 'the stamp grows into a test stand', 'EXPL', 'the stand', ''),
 ('4.14', 'Demis Hassabis', 'Hassabis proposed a body that tests before launch', 'a model rolls into the stand before a gate opens: DEMIS HASSABIS · CO-FOUNDER, GOOGLE DEEPMIND + source (proposal, July 2026)', 'EXPL', 'the calendar', ''),
 ('4.15', 'The tests would be renewed', 'renewed perhaps every quarter', 'a calendar turns four leaves a year: PERHAPS EVERY QUARTER', 'EXPL', 'the cog', ''),
 # ---------------------------------------------------------------- c11 · B3 · UN, pressure, not settled, choices
 ('4.16', 'Rules that move within a year', 'rules that move within a year?', 'the cog on the rule sheet', 'EXPL', 'the lectern', ''),
 ('4.17', 'Last month, the head', 'the UN head called for a global framework within one year', 'a lectern and a calendar of 12 leaves: GLOBAL FRAMEWORK · WITHIN ONE YEAR + source (Bridgetown, 23 Nov 2026)', 'EXPL', 'the lectern', ''),
 ('4.18', 'And the pressure is there', 'the pressure is there', 'the lectern multiplies', 'EXPL', 'the hall', ''),
 ('4.19', 'According to the UN', 'per the UN tech envoy: 2017, three leaders raised AI', 'a hall of lecterns, three light up: 2017: 3', 'EXPL', 'the hall', ''),
 ('4.20', 'This year, a hundred', 'this year 135 did', '★ the hall fills with light, 135; the cog visibly turns: 2026: 135 + source (UN News)', 'EXPL', 'the parts', '★'),
 ('4.21', 'None of it is settled', 'none of it is settled', 'the three parts lie apart, not connected; the counter races, the gap still wide: NONE OF IT IS SETTLED', 'EXPL', 'the parts', ''),
 ('4.22', 'The framework is not a treaty', 'not a treaty', 'the framework sheet goes dashed: "IT\'S NOT A TREATY, IT\'S NOT REGULATION" + source', 'EXPL', 'the stand', ''),
 ('4.23', 'The testing body would be', 'paid mostly by the industry it tests', 'the test stand: a coin flows in from the model\'s side: PAID MOSTLY BY THE INDUSTRY + source', 'EXPL', 'the gauges', ''),
 ('4.24', 'And it is not the course', 'not the course we\'re on; Harari says so himself', 'the counter races on, the gap holds (Harari\'s "not the current trajectory" as type)', 'EXPL', 'the sunrise', ''),
 ('4.25', 'But the race is a product', 'the race is a product of choices; so is the gap', 'ANCHOR 3/4 (point): THE SUNRISE with THE GAP drawn between you and the sphere; Bengio\'s line as type: RACE → GAP (A PRODUCT OF CHOICES)', 'ANCHOR', 'the cog', 'W'),
 ('4.26', 'Labs can test', 'labs can test before they ship', 'a hand LABS on the cog', 'EXPL', 'hands', ''),
 ('4.27', 'Governments can write', 'governments: rules with the update built in', 'a second hand GOVERNMENTS', 'EXPL', 'hands', ''),
 ('4.28', 'Voters can demand both', 'voters can demand both', 'a third hand: a ballot VOTERS', 'EXPL', 'the ring', ''),
 ('4.29', 'And one clock needs no vote', 'one clock needs no vote', 'the ring lies with you: NEEDS NO VOTE', 'EXPL', 'the evening', ''),
 # ---------------------------------------------------------------- c12 · B3 · station 5, end
 ('5.01', 'Tonight, or tomorrow', 'the next headline lands', 'the hook evening (0:15) with another headline (seed 2)', 'SCENE', 'the headline', ''),
 ('5.02', 'Same big letters', 'same letters, same pulse', 'the bars thicken, the pulse spikes like in the hook', 'SCENE', 'the pulse', ''),
 ('5.03', "The reflex hasn't changed", 'the reflex hasn\'t changed and won\'t', 'the ochre node in the head, the same as in the mouse', 'EXPL', 'the node', ''),
 ('5.04', 'But this time, you notice', 'this time you notice it: this is fear', 'a light comes on above the node: THIS IS FEAR', 'MIX', 'the ring', ''),
 ('5.05', 'You take one breath', 'one breath, then you decide', 'the thumb hangs one breath, the ring fills once; then the thumb moves slowly by itself: YOU DECIDE', 'MIX', 'the ring', ''),
 ('5.06', 'That is the first clock', 'the first clock you can set, a single breath', 'the ring in the HUD moves one notch (F.CLOCK.youTicks): THE FIRST CLOCK', 'EXPL', 'the cog', ''),
 ('5.07', 'The other one takes all of us', 'all of us: rules that learn as fast as the machine', 'many hands at the cog; it turns with the counter: RULES THAT LEARN', 'EXPL', 'the gap', ''),
 ('5.08', "The gap won't close", 'the gap won\'t close completely; small enough to steer', '★ the gauges big; THE GAP narrows to ~45 %, never zero (F.CLOCK.gapShrink): SMALL ENOUGH TO STEER', 'EXPL', 'the sunrise', '★'),
 ('5.09', "We can't upgrade our brains", 'can\'t upgrade brains; can upgrade minds and rules', 'ANCHOR 4/4 (end): THE SUNRISE, you hold the hand axe and the phone; the ring on you set: WE CAN\'T UPGRADE OUR BRAINS. / WE CAN UPGRADE OUR MINDS, AND OUR RULES.', 'ANCHOR', 'the final picture', 'W'),
 ('A.01', 'This channel exists#1', 'subscribe: minds that notice, rules that keep up', 'subscribe 2 over the final picture, no QR', 'ANCHOR', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', '(end screen)', 'END SCREEN (S.endScreen): the sunrise calm, you with axe and phone, the ring set; lower half calm for the tiles', 'ANCHOR', '—', ''),
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
L.append('# Film 75 · "Our Minds Aren\'t Ready for Superintelligence" (GODLIKE AI JUST ARRIVED) · shot list (binding, Film-5 format)\n')
L.append(f'Generated by `tools/shots75.py` from `{os.path.relpath(TIMING, os.path.join(HERE, ".."))}` ({"PROVISIONAL" if TM.get("provisional") else "real VO"}, duration {dur:.1f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'Spoken text: vo-v5.txt (final, fact-checked; anchors are phrases, `T.G` names any phrase that goes missing, then fix the phrase). '
         'Picture ideas follow text-v2.md BILD/EINBLENDUNG, cut down to what each sentence says; on-screen strings live in `F.SOURCES` (the fact check wins).\n')
L.append('## 1 · Rules for every frame (REGELN §13)\n')
L.append('- **Every picture shows exactly what its sentence says** (column *zeigt wörtlich*), one picture per sentence or sentence group; typography, diagrams, objects that turn into the next object, match cuts over carrier objects.')
L.append('- 60–70 % explainer graphics on THE WALL (lib/f75_explain.mjs), the rest scenes and clips. No world rides.')
L.append('- The Leitbild THE SUNRISE (thumbnail A: the gold sphere, you on the hill with the hand axe) ONLY at 4 anchors: hook (H.01–H.02), turn (3.05), point (4.25), end (5.09–E.01).')
L.append('- THE CLOCKS are small: the HUD top left (F.clocksHud, from the end of the hook) and big only as explainer graphics where the sentence is about them. Never a clock face, never a giant clock as a key visual.')
L.append('- Every change over a carrier object, no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (still75.py: still < 5 %, none > 2 s).\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** of the whole film (target 60–70 %); without the clip seconds: **{share_nc * 100:.1f} %**. Weights: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0, per second of picture.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min).')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} shots are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}). Zooms and pans never count as new.')
L.append(f'- Shots: {len(SHOTS)}, one motif per sentence. ★ = the one wow moment of a chunk. The HUD (top left, from H.23) changes by itself (`F.clocksHud`, `F.CLOCK` phrases; never by hand).\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| the sunrise sphere (godlike AI) / the gold disc | H.01–H.03 | H.13 (runs away), 1.26 (end of the curve), M.01, 3.05, 4.25, 5.09, E.01 |')
L.append('| the headline (AI, big bars, ochre "bad") | H.06–H.08 | 1.01–1.08 (clicks), 3.27–3.28 (one breath), 4.03, 5.01–5.02 (seed 2) |')
L.append('| the pulse / the ochre alarm node | H.09, H.12 (mouse, wolf, hunter), H.13 (the head) | 1.02–1.06, 3.18 (THIS IS FEAR), 5.03–5.04 |')
L.append('| your thumb | H.10 | 3.27 (hangs one breath), 5.05 (you decide) |')
L.append('| the three reflex niches FEAR · GRAB · STRAIGHT LINE | 1.05 | 1.09, 1.13, 1.19, 1.29 (into one card), 3.18, 4.09, 5.04 |')
L.append('| THE GAP | H.16 | HUD all film, 4.01, 4.21, 4.25 (so is the gap), 5.08 (≈ 45 %, never zero) |')
L.append('| the cog (rules) | H.19–H.21 (dashed, a society pushes) | 1.36, 2.04 (one notch vs many), 2.10–2.15 (the treaty cog; set), 4.08, 4.16–4.20, 4.26–4.28, 5.07 |')
L.append('| the ring (you) | H.19–H.23 (dashed on your chest) | 3.05 (yours), 3.27 (one breath), 3.46 (faster), 4.29, 5.05–5.06, E.01 |')
L.append('| Bengio "choices" | 1.17–1.18 | 4.25 (RACE → GAP) |')
L.append('| Harari\'s coin | 3.07–3.08 | 3.30–3.31, 3.43–3.44 (splits into three), 4.23 |')
L.append('| the AI report card, empty row WHAT IT DOES TO YOU | 3.36–3.38 | 3.44, 4.04–4.06, 4.12 |')
L.append('| hand axe ↔ phone | H.01 (hand axe) | 5.09/E.01 (both in your hands) |\n')
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
L.append('Columns: ID · anchor (phrase) · t (provisional) · len · **zeigt wörtlich** (what the sentence says) · **neu?** (§13.1a) · picture (what moves and what it becomes) · layer · **Träger** (carrier object → next) · flags.')
cur = None
for c, s, a, d in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | zeigt wörtlich | neu? | picture | layer | Träger → next | |')
        L.append('|---|---|---|---|---|---|---|---|---|---|')
    anc = s[1].replace('#1', ' (2nd)')
    neu = ('nein: ' + NOT_NEW[s[0]]) if s[0] in NOT_NEW else 'ja'
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {s[2]} | {neu} | {s[3]} | {s[4]} | {s[5]} | {s[6]} |')
L.append('\n## 6 · Seams between the groups (lib/f75_world.mjs, all on THE WALL)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | To see what it is | plateSofa (view 960/1950 × creep: you on the sofa, phone lit with the headline, the dashed ring on your chest; HUD top left with labels) | H.23: the ring lands, the gauges reach the HUD, the camera settles | 1.01 pushes into the phone |")
L.append("| B1 → B2 | This channel exists | plateClocks (S.clocksBig at 960/560, k 2.4 × creep: the cog SET, the ring dashed, THE GAP full, the counter; HUD hidden) | 2.15: the cog sets, the gauges line up big | M.01 slides the gauges aside |")
L.append("| B2 → B3 | Then you notice more | plateRace (the same big gauges: the ring spinning fast, the cog standing) | 3.46: your ring speeds up, the gauges settle big | 4.01 lets the counter run away |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (4 %/s push). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md EINBLENDUNG lines, as `F.SOURCES` in lib/f75_kit.mjs (statement ≤ 6 words + one number; the long rest goes into the source line, `F.source`, 22 px at y 880). The fact check (vo-v5 / faktencheck.md) wins: the lead updates `F.SOURCES`, builders only use the keys.')
L.append('- No QR, no sponsor. No logos, no real headline, no model names (HumaneBench), no robot, no brain, no clock face, no hourglass, no calendar page as a hero. No AI images. No real faces outside the clips.')
L.append('- Clips: lower thirds from `F.CLIPS` (C2 Bengio, K1 Wilson, C1 Harari); cuts = the sound step’s audio/cuts.json (same in/out for picture and sound): C2 6.08–17.50 s (slot 102.72–114.14), K1 13.02–29.10 s (slot 170.82–186.90), C1 9.38–26.81 s (slot 290.16–307.59).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()}, 'layers', {k: round(v) for k, v in lay.items()})
print('per chunk:', {c: f'{v[1] / max(1e-6, v[0]) * 100:.0f}%' for c, v in per.items()})
