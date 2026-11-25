#!/usr/bin/env python3
"""Film 78 · "What Did Ilya See?" · the binding shot list -> docs/shots.md (times from the real VO: $TIMING or <ROOT>audio/timing.json,
else code/audio/timing.json). Edit the SHOTS table here, never docs/shots.md.      python3 tools/shots78.py

REGELN §13 (Jakob 24.11.): one picture per sentence. Every row = one sentence (or a group of sentences that say nothing new), with
  says   = what the sentence literally says (filled in automatically from the VO words between this anchor and the next one),
  shows  = "zeigt wörtlich": what the viewer SEES (objects, words on screen, numbers), never a mood,
  layer  = EXPL (explainer graphic: diagram, numbers, a mechanism) · KARTE (a quote / date / source card) · MIX (a scene object carrying
           a graphic) · SZENE (people, places, the Leitbild anchors) · CLIP (original footage),
  carrier = the object that carries the eye into the next row (a transformation, never a blend),
  new    = Y if the motif is new (a zoom/pan in the same picture is NOT a new motif: 1a),
  flags  = ★ (the one wow moment of the chunk) · A (a Leitbild anchor: thumbnail C, max 4 in the film) · W (a hard cut, ≤ ~1 per minute).
Explainer weight per second of picture (§13.2): EXPL 1 · KARTE 1 · MIX .5 · SZENE 0 · CLIP 0 (world flights count 0). Target 60–70 %.
Anchors: a VO phrase, looked up after the previous row; 'phrase#n' = the (n+1)-th occurrence in the film; 'slot:C2' = a clip slot;
'ENDSCREEN' = duration − 15. Code anchors on the SAME phrases (T.G / T.GE), never on seconds."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F78ROOT', '/mnt/project-files/scenario/film-78-ilya/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or next(f for f in (ROOT + 'audio/timing.json', os.path.join(HERE, '..', 'audio', 'timing.json')) if os.path.exists(f))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'KARTE': 1.0, 'MIX': .5, 'SZENE': 0.0, 'CLIP': 0.0}
# (chunk, builder, first phrase) — must match film.mjs CHUNKS
CHUNKS = [('c01', 'Lead', 'What did Ilya see'), ('c02', 'B1', 'So what was in those pages'), ('c03', 'B1', 'Then it fell apart'),
          ('c04', 'B1', 'And yet, something bigger'), ('c05', 'B1', 'Not blindly'), ('c06', 'B1', 'But on that same stage'),
          ('c07', 'B2', 'That is why this channel exists'), ('c08', 'B2', 'Six months after that famous Friday'),
          ('c09', 'B2', 'He wants more than a machine'), ('c10', 'B2', 'So what do you do His advice')]
# id | anchor phrase | zeigt wörtlich (what the picture shows) | layer | carrier → next | new | flags
SHOTS = [
 # ================================================================ c01 · Lead · the hook (built: scenes/sc01.mjs)
 ('H.01', 'What did Ilya see', 'THUMBNAIL C as a poster: the night, a tower of gold light (right third), a city low on the horizon; a man (Ilya, plain silhouette, no face) stands at its foot facing the light; the title WHAT DID / ILYA SEE? rises left in heavy cream caps word by word', 'SZENE', 'the man', 'Y', 'A'),
 ('H.02', 'Ilya Sutskever helped create', 'a gold label line pins ILYA SUTSKEVER · CO-FOUNDER, OPENAI to him; out of the tower\'s light a chat window unfolds: YOUR question (yellow edge) and the answer writing itself line by line', 'MIX', 'the chat window', 'Y', ''),
 ('H.03', 'Then he walked away', 'the chat window folds back into the tower (tag CHATGPT on its face), the tower gets its name OPENAI; the man turns and walks toward us, away from the light (thumbnail C pose), long shadow', 'SZENE', 'the tower windows', 'Y', ''),
 ('H.04', 'It began on a Friday', 'the camera flies into the tower face: its window panes become the tiles of a VIDEO CALL (3 × 2); date tag FRI · NOV 17, 2023; tiles light up: ILYA (speaking ring) and THE BOSS · HEAD OF OPENAI', 'EXPL', 'the boss tile', 'Y', ''),
 ('H.05', 'And it was the boss who was fired', 'the boss tile flickers once (anticipation), goes dark and drops out of the grid; FIRED in cream caps where it was', 'EXPL', 'the empty slot', 'Y', ''),
 ('H.06', 'Soon, the whole internet', 'out of the empty slot small post cards clone in a spiral until they fill the frame, each with the line "what did Ilya see?"; the camera pulls back over hundreds', 'EXPL', 'the cards', 'Y', ''),
 ('H.07', 'The guess', 'the cards swirl inward and become ONE giant machine ring (cool light, iris rings turning); THE GUESS; the man stands tiny under it and leans back', 'MIX', 'the ring', 'Y', '★'),
 ('H.08', 'And if it scared him', 'pull back: you (the yellow raincoat) stand in the foreground and look up at the same ring', 'SZENE', 'the ring', 'Y', ''),
 ('H.09', 'Now a Hollywood movie', 'the ring flattens into a cinema screen; under it a marquee in bulbs ARTIFICIAL · US RELEASE DEC 25, 2026 (title text only, no stills)', 'KARTE', 'the screen', 'Y', ''),
 ('H.10', "But the answer wasn't written", 'the marquee bulbs go out one by one from left to right; the screen dims to a blank page', 'EXPL', 'the blank page', 'Y', ''),
 ('H.11', 'It came out under oath', 'the page becomes a court transcript: SWORN TESTIMONY · OCT 2025, numbered lines Q./A. writing in, a raised right hand icon in the margin', 'KARTE', 'the page', 'Y', ''),
 ('H.12', 'It was never about a machine', 'the small machine ring left in the corner of the page crumbles into dust and blows off the paper', 'EXPL', 'the page', 'Y', ''),
 ('H.13', 'At the center were', 'the transcript page drops onto a stack; pages fall onto it while a counter runs 1 → 52; 52 PAGES in gold', 'EXPL', 'THE 52 PAGES', 'Y', ''),
 ('H.14', 'Ilya had written them himself', 'on the top page a gold pen line writes BY ILYA SUTSKEVER', 'EXPL', 'the top page', 'Y', ''),
 ('H.15', 'And they were about a man', 'a man\'s profile silhouette prints itself onto the top page (ink, no face): ABOUT ONE MAN', 'EXPL', 'the stack', 'Y', ''),
 ('H.16', 'But that is only half', 'the stack slides into the left half; a gold line draws top to bottom down the middle; the right half stays dark and empty (HALF 1 / 2)', 'EXPL', 'the dividing line', 'Y', ''),
 ('H.17', 'The other half is about every job', 'the right half fills with small working figures (programmer, doctor, driver, cook, teacher …), lighting row by row', 'EXPL', 'the figures', 'Y', ''),
 ('H.18', 'Yours included', 'one figure in the grid is you (yellow raincoat): it lights up and steps forward', 'MIX', 'you', 'Y', ''),
 ('H.19', 'And he never hid it', 'the figures dim; on the line the man stands at a lectern in a spotlight, sound rings go out openly into the room → plateHook (the 52 pages left, the line, the man at the lectern right)', 'MIX', 'plateHook', 'Y', ''),
 # ================================================================ c02 · B1 · the 52 pages
 ('1.01', 'So what was in those pages', 'out of plateHook: push into the stack, the top page lifts and turns toward us until it fills the frame (MEMO · 52 PAGES)', 'EXPL', 'the page', 'N', ''),
 ('1.02', 'They were about that boss', 'the man-print on the page gets its name line: SAM ALTMAN · CEO, OPENAI (text and a plain silhouette, no photo, no quote)', 'EXPL', 'the silhouette', 'Y', ''),
 ('1.03', 'Their claim', 'THE CLAIM: the silhouette in the middle, five small figures around it, the threads to them flicker and break; caption NOT STRAIGHT WITH THE PEOPLE AROUND HIM', 'EXPL', 'the threads', 'Y', ''),
 ('1.04', 'Ilya had collected the material', 'a folder fills with small screenshot cards while a strip of 12 months ticks by: ABOUT A YEAR', 'EXPL', 'the folder', 'Y', ''),
 ('1.05', 'Under oath, he explained why', 'the transcript page from the hook returns; quote line "the company would be destroyed" writes in, tag UNDER OATH · OAKLAND, MAY 2026', 'KARTE', 'the quote', 'Y', ''),
 ('1.06', 'But almost all of it came from', 'every screenshot card in the folder pulls a thread back to ONE small figure: ONE COLLEAGUE (no name)', 'EXPL', 'the threads', 'Y', ''),
 ('1.07', 'He did not check it', 'the people involved stand in grey beside it; no thread reaches them (dashed lines that never close): NOT CHECKED WITH THEM', 'EXPL', 'the call grid', 'Y', ''),
 ('1.08', 'And the board that fired Altman', 'the call grid from the hook comes back small, the board tiles hurry (speed lines); quote "the process was rushed." · SWORN TESTIMONY, OCT 2025', 'KARTE', 'the grid', 'Y', ''),
 # ================================================================ c03 · B1 · it fell apart, the law firm, the workplace
 ('2.01', 'Then it fell apart', 'the call grid comes apart: tiles slide away from each other, the gaps widen', 'EXPL', 'a tile', 'N', ''),
 ('2.02', 'Ilya himself wrote', 'his post as a card (ILYA SUTSKEVER · NOV 20, 2023, no logo): "I deeply regret my participation in the board\'s actions."', 'KARTE', 'the card', 'Y', ''),
 ('2.03', 'Five days after that video call', 'a strip of five days FRI 17 → TUE 21 lights cell by cell; on day five the boss tile slides back into the grid: BACK IN CHARGE', 'EXPL', 'the grid', 'Y', ''),
 ('2.04', 'A law firm, hired by', 'a report folder LAW FIRM REVIEW · MARCH 2024 (for the new board); finding 1 writes in: A BREAKDOWN OF TRUST', 'KARTE', 'the report', 'Y', ''),
 ('2.05', 'Not a safety problem', 'finding 2 on the same card: NOT ABOUT SAFETY · and (both findings, kritik): OLD BOARD ACTED WITHIN ITS DISCRETION', 'EXPL', 'the report', 'N', ''),
 ('2.06', 'And nothing that demanded', 'finding 3: DID NOT MANDATE REMOVAL; the three lines stand as the summary', 'EXPL', 'the report', 'N', ''),
 ('2.07', 'No court has ever ruled', 'an empty judge\'s bench, the verdict line WHO WAS RIGHT: — stays empty', 'MIX', 'the bench', 'Y', ''),
 ('2.08', 'So that is what Ilya saw', 'the man (silhouette) looks at the call grid, tiles with threads between them', 'MIX', 'the threads', 'Y', ''),
 ('2.09', 'A problem you know from any workplace', 'an ordinary office at night: two colleagues turned away from each other, the thread between them snaps; you (yellow) at the next desk', 'SZENE', 'the office window', 'Y', ''),
 # ================================================================ c04 · B1 · bigger worry, before and after, Toronto (C2), a day
 ('3.01', 'And yet, something bigger', 'out of the office window: the man small under a sky that is much bigger than the office; a light far on the horizon', 'SZENE', 'the horizon light', 'Y', ''),
 ('3.02', 'Earlier that year', 'a heavy door half in the ground, small and plain (the bunker: picture only, NO quote, NO card, #72); beside it a machine ring AS SMART AS US; tag SUMMER 2023', 'MIX', 'the ring', 'Y', ''),
 ('3.03', 'But what worried him was never locked', 'a lab door with a lock: the lock opens, the room is empty, the light runs out into the open', 'MIX', 'the light', 'Y', ''),
 ('3.04', 'Three weeks before that Friday', 'a magazine page MIT TECHNOLOGY REVIEW · OCT 26, 2023, the quote "There will be a before and an after."; the gap between BEFORE and AFTER pulls out into a gold vertical LINE that stands across the frame', 'KARTE', 'THE LINE', 'Y', '★'),
 ('3.05', 'Before and after what', 'the line alone: BEFORE (left, night) | AFTER (right) with a cream ? on the AFTER side', 'EXPL', 'the line', 'N', ''),
 ('3.06', 'He later said it out loud', 'the man at the lectern from the hook, sound rings opening', 'MIX', 'the rings', 'N', ''),
 ('3.07', 'In Toronto, in the hall', 'ANCHOR TORONTO: Convocation Hall (round hall, columns, dome) at dusk, rows of mortarboards; tag TORONTO · JUNE 2025; small line SAME HALL AS HIS DEGREE', 'SZENE', 'the hall door', 'Y', ''),
 ('3.08', 'slot:C2', 'C2 grows out of the hall door: ILYA SUTSKEVER · UNIVERSITY OF TORONTO, JUNE 2025 · ORIGINAL FOOTAGE; back into the door', 'CLIP', 'the door', 'Y', ''),
 ('3.09', 'Not some of what you do', 'the job figures from the hook: SOME lights three of them … ALL OF IT lights every one', 'EXPL', 'the figures', 'N', ''),
 ('3.10', 'Anything you can learn', 'a figure learns a skill (a page → a tool lights in its hand); a cool copy beside it does the same: ANYTHING YOU CAN LEARN', 'MIX', 'the copy', 'Y', ''),
 ('3.11', 'How can he be so sure', 'a cream ? over the two', 'EXPL', 'the ?', 'N', ''),
 ('3.12', 'His reason: your brain', 'a head profile with a network of gold nodes inside: BIOLOGICAL COMPUTER (no pink brain)', 'EXPL', 'the network', 'Y', ''),
 ('3.13', "So why shouldn't a digital one", 'the same network copies itself into a square chip outline in cool light: DIGITAL', 'EXPL', 'the chip', 'Y', ''),
 ('3.14', 'So that is what Ilya sees coming', 'the LINE again: on the AFTER side the ring fades (NOT A HIDDEN MACHINE) and ONE DAY rises on the horizon like a sunrise', 'EXPL', 'the day', 'N', ''),
 ('3.15', 'A big claim', 'the claim as a card on the line: AI WILL DO ALL THE THINGS WE CAN DO, a ? beside it', 'EXPL', 'the claim card', 'Y', ''),
 # ================================================================ c05 · B1 · his record (predictions 1 and 2), C1, the recipe
 ('4.01', 'Not blindly', 'an eye shape opens on the claim card (not blind)', 'EXPL', 'the card', 'Y', ''),
 ('4.02', 'Today he runs a company', 'a small building SAFE SUPERINTELLIGENCE, its value bar ($32B, APR 2025) hangs on a thread from IF HE IS RIGHT', 'MIX', 'the thread', 'Y', ''),
 ('4.03', 'But he has a record', 'HIS LIFE LINE draws left to right (gold), year ticks', 'EXPL', 'the life line', 'Y', ''),
 ('4.04', 'Look at four of his predictions', 'four markers 1 2 3 4 drop onto the line', 'EXPL', 'the markers', 'N', ''),
 ('4.05', 'Two have held up', 'markers 1 and 2 fill gold: HELD', 'EXPL', 'the markers', 'N', ''),
 ('4.06', 'Two are still open', 'markers 3 and 4 stay cream rings: OPEN (never red, never a cross)', 'EXPL', 'marker 4', 'N', ''),
 ('4.07', 'And the last one comes with a number', 'marker 4 gets an empty number box ? YEARS', 'EXPL', 'marker 1', 'N', ''),
 ('4.08', 'The first, as he tells it', 'zoom into marker 1: a teenager at a desk with an old computer; tag AS HE TELLS IT', 'MIX', 'the screen', 'Y', ''),
 ('4.09', 'His question: can a computer learn', 'the question writes itself on the old screen: CAN A COMPUTER LEARN?', 'EXPL', 'the question', 'N', ''),
 ('4.10', 'He felt: answer that', 'quote "everything else would follow": arrows branch out of the question in all directions', 'KARTE', 'the arrows', 'Y', ''),
 ('4.11', 'In grad school', 'three silhouettes at a workstation (he and two colleagues); photos (cat, ship, car) flow into a small network and come out with their names; tag TORONTO · 2012', 'MIX', 'the network', 'Y', ''),
 ('4.12', 'It beat every rival', 'bars: ERROR RATE 15.3 % (theirs, gold) vs 26.2 % (next best); marker 1 fills gold HELD', 'EXPL', 'marker 2', 'Y', '★'),
 ('4.13', 'His second prediction fits', 'marker 2 opens into a single slide card, 2014', 'EXPL', 'the slide', 'Y', ''),
 ('4.14', 'A decade after he first showed it', 'the slide on a big stage screen; tag NEURIPS · VANCOUVER · DEC 2024; an arc 2014 → 2024', 'MIX', 'the stage screen', 'Y', ''),
 ('4.15', 'slot:C1', 'C1 grows out of the stage screen: ILYA SUTSKEVER · NEURIPS, VANCOUVER, DEC 2024 · ORIGINAL FOOTAGE (the real slide)', 'CLIP', 'the screen', 'Y', ''),
 ('4.16', 'Big network, big data', 'THE RECIPE CARD: BIG NETWORK + BIG DATA, two shapes grow on it', 'EXPL', 'the recipe card', 'Y', ''),
 ('4.17', 'Out of that recipe grew', 'stems grow out of the card: GPT-1 2018 · GPT-2 2019 · GPT-3 2020 · CHATGPT 2022', 'EXPL', 'the ChatGPT stem', 'N', ''),
 ('4.18', 'When it came out', 'tag on the ChatGPT stem: ILYA · CHIEF SCIENTIST, OPENAI; marker 2 fills gold HELD', 'EXPL', 'the chat bubble', 'N', ''),
 ('4.19', 'Every time you ask a chatbot', 'you (yellow) with a phone, a chat bubble; the recipe card glows behind it', 'MIX', 'the recipe card', 'Y', ''),
 # ================================================================ c06 · B1 · prediction 3, the missing piece, prediction 4, C3, you
 ('5.01', 'But on that same stage', 'back on the stage, marker 3 lights cream', 'MIX', 'marker 3', 'N', ''),
 ('5.02', 'And it says his own recipe will run out', 'on the recipe card the DATA half starts to drain like a gauge', 'EXPL', 'the gauge', 'N', ''),
 ('5.03', 'The recipe needs text', 'lines of text pour from one pile into the card; the pile shrinks', 'EXPL', 'the pile', 'Y', ''),
 ('5.04', 'In his words', 'the pile is ONE globe of text lines: "we have but one internet." · NEURIPS, DEC 2024', 'KARTE', 'the globe', 'Y', ''),
 ('5.05', 'So this way of teaching machines', 'quote "will unquestionably end": the gauge reaches empty, the line of the old recipe stops at a wall', 'KARTE', 'the wall', 'N', ''),
 ('5.06', 'That one is still open', 'the life line: marker 3 stays a cream ring OPEN', 'EXPL', 'marker 3', 'N', ''),
 ('5.07', 'Google, he admits', 'a second recipe card labelled GOOGLE (text only), its bar edges higher: MAY BE GETTING MORE OUT OF IT', 'EXPL', 'the card', 'Y', ''),
 ('5.08', 'But something important', 'a machine ring with one segment missing', 'EXPL', 'the gap', 'Y', ''),
 ('5.09', "Today's machines can't learn", 'two rows: YOU see 3 examples and learn (gold tick of light); THE MACHINE needs a wall of thousands', 'EXPL', 'the rows', 'Y', '★'),
 ('5.10', 'His fourth prediction is about', 'the life line: marker 4 lights', 'EXPL', 'marker 4', 'N', ''),
 ('5.11', 'He pictures it as', 'quote "a superintelligent fifteen-year-old": a teenage figure made of cool light with a school bag', 'KARTE', 'the figure', 'Y', ''),
 ('5.12', 'It knows very little', 'its knowledge bar almost empty', 'EXPL', 'the bar', 'N', ''),
 ('5.13', 'But it is eager to learn any job', 'doors with job signs around it (programmer, doctor …), it walks to the first one', 'MIX', 'the doors', 'Y', ''),
 ('5.14', 'For the day A.I.', 'the LINE: on the AFTER side, ALL JOBS · NO YEAR GIVEN', 'EXPL', 'the line', 'N', ''),
 ('5.15', 'For this machine, he has', 'marker 4: the empty number box ? YEARS glows', 'EXPL', 'the box', 'N', ''),
 ('5.16', 'A podcaster asked him', 'question card: HOW LONG UNTIL A MACHINE LEARNS AS WELL AS A PERSON? · PODCAST, NOV 2025', 'KARTE', 'the box', 'Y', ''),
 ('5.17', 'slot:C3', 'C3 grows out of the number box: ILYA SUTSKEVER · DWARKESH PODCAST, NOV 2025 · ORIGINAL FOOTAGE', 'CLIP', 'the box', 'Y', ''),
 ('5.18', 'Five to twenty years', 'the box fills: 5–20 YEARS, under it A MACHINE THAT LEARNS LIKE A HUMAN (never "AGI")', 'EXPL', 'the span', 'Y', '★'),
 ('5.19', 'Until a machine learns as well as you do', 'the span on a time axis: 2030 → 2045', 'EXPL', 'the axis', 'N', ''),
 ('5.20', 'That is a forecast, not a fact', 'a tag on the span: FORECAST (cream), not FACT', 'EXPL', 'the tag', 'N', ''),
 ('5.21', 'He himself calls the future hard', 'the far end of the span frays into fog', 'EXPL', 'the fog', 'N', ''),
 ('5.22', 'And some researchers doubt', 'small grey markers of other forecasts land further right', 'EXPL', 'the axis', 'N', ''),
 ('5.23', 'But take his longest case', 'the 20-year end lights: 2045', 'EXPL', 'the end', 'N', ''),
 ('5.24', 'If you are forty-five today', 'you (yellow) walk along the axis: AGE 45 → 65 · YOUR WORKING LIFE', 'MIX', 'you', 'Y', ''),
 ('5.25', 'And if you have a child', 'a child walks beside you and reaches STARTS WORK before the span ends', 'MIX', 'the child', 'N', ''),
 ('5.26', 'And Ilya says he can see it going well', 'the end of the axis warms like dawn', 'MIX', 'the dawn', 'N', ''),
 ('5.27', 'On one condition', 'ONE gold knot ties itself into the line: 1 CONDITION → plateRecord (the life line with 1 2 gold, 3 4 open, 5–20 YEARS, you at its right end, dawn)', 'EXPL', 'plateRecord', 'N', ''),
 # ================================================================ c07 · B2 · subscribe 1, what do you do, the intelligence explosion (C4 card)
 ('M.01', 'That is why this channel exists', 'subscribe 1 over plateRecord: small lights come on in windows round the horizon, you look along the line (no QR)', 'SZENE', 'the dawn', 'N', ''),
 ('6.01', 'So what do you do, if you believe', 'you at the LINE, looking over to the AFTER side', 'MIX', 'the line', 'N', ''),
 ('6.02', 'Ilya has asked that himself', 'a university building OPEN UNIVERSITY OF ISRAEL · 2025; a schoolboy silhouette with books goes in (AS A SCHOOLBOY)', 'MIX', 'the window', 'Y', ''),
 ('6.03', 'Picture an A.I.', 'a machine ring builds a second ring, which builds a third, bigger each time', 'EXPL', 'the rings', 'Y', ''),
 ('6.04', 'The intelligence explosion', 'the rings cascade outward; QUOTE CARD C4: "the idea that an AI can build the next generation of AI, the intelligence explosion, holy moly, what do you do about that?" — Ilya Sutskever, Open University of Israel, 2025', 'KARTE', 'the card', 'Y', '★'),
 ('6.05', 'What do you do about that', 'the last words of the card light gold', 'KARTE', 'the card', 'N', ''),
 ('6.06', 'By then, he had already given', 'the man turns his back to us, the tower of light ahead', 'SZENE', 'the tower', 'N', ''),
 # ================================================================ c08 · B2 · he walked away (thumbnail C), SSI, the money, nothing to buy
 ('7.01', 'Six months after that famous Friday', 'ANCHOR = THUMBNAIL C: the man walks away from the tower of light toward us, long shadow, the city low; date tag MAY 14, 2024', 'SZENE', 'the man', 'Y', 'A ★'),
 ('7.02', 'By his own decision', 'his post as a card (no logo): "I have made the decision to leave OpenAI." · MAY 14, 2024', 'KARTE', 'the card', 'Y', ''),
 ('7.03', 'No slammed door', 'the tower door behind him closes slowly and softly, its light stays on', 'SZENE', 'the door', 'Y', ''),
 ('7.04', 'He was leaving, he wrote', 'quote card "a project that is very personally meaningful to me"', 'KARTE', 'the card', 'N', ''),
 ('7.05', 'Weeks later, the project had a name', 'a new small building lights its sign SAFE SUPERINTELLIGENCE · JUNE 2024', 'MIX', 'the sign', 'Y', ''),
 ('7.06', 'A machine smarter than any of us', 'inside: a ring taller than the human silhouettes beside it, held in a gold frame SAFE', 'EXPL', 'the frame', 'Y', ''),
 ('7.07', 'One goal', 'ONE GOAL · ONE PRODUCT, each word on its beat', 'EXPL', 'the words', 'N', ''),
 ('7.08', 'And until it exists', 'a row of empty slots until a far end marker: NOTHING ELSE', 'EXPL', 'the row', 'N', ''),
 ('7.09', 'Investors valued it', 'a value bar grows to $32 BILLION · VALUATION, APR 2025', 'EXPL', 'the bar', 'Y', ''),
 ('7.10', 'Meta offered to buy it', 'an offer card META · OFFER TO BUY slides in; on "He said no" it slides back out', 'EXPL', 'the card', 'Y', ''),
 ('7.11', 'And Nvidia invested, too', 'a chip shape NVIDIA · INVESTED · JULY 2026 sends computers to the building', 'EXPL', 'the chip', 'Y', ''),
 ('7.12', 'And yet, there is still nothing', 'an empty shop window: NOTHING TO BUY', 'MIX', 'the window', 'Y', ''),
 ('7.13', 'No product', 'three empty slots tick by on the beats: PRODUCT — · MODEL — · PAPER —; tag AS OF NOV 2026', 'EXPL', 'the slots', 'N', ''),
 ('7.14', 'What it does, he says, is research', 'a closed lab door RESEARCH, light under the door', 'MIX', 'the door', 'Y', ''),
 ('7.15', 'What exactly, it has not shown', 'the door\'s window frosted, a cream ?', 'MIX', 'the ?', 'N', ''),
 ('7.16', 'So all that money is riding', 'the $32B bar stands on the life line (his record, markers 1–4)', 'EXPL', 'the life line', 'N', ''),
 ('7.17', 'And on his bet', 'the recipe card with its drained DATA gauge', 'EXPL', 'the card', 'N', ''),
 ('7.18', 'So what is he trying to build', 'push toward the light under the lab door', 'MIX', 'the light', 'N', ''),
 # ================================================================ c09 · B2 · a machine that cares, the objection, the hope, C5
 ('8.01', 'He wants more than a machine that obeys', 'a ring with command arrows pointing at it: OBEYS (cool)', 'EXPL', 'the ring', 'Y', ''),
 ('8.02', 'He wants one that cares', 'the ring turns warm and bends its light round small figures like a shelter: CARES', 'MIX', 'the shelter', 'N', ''),
 ('8.03', 'In his words, an A.I.', 'quote "care about sentient life" · PODCAST, NOV 2025', 'KARTE', 'the quote', 'Y', ''),
 ('8.04', 'Everything that can feel', 'a circle of small lights (all that can feel) inside the ring\'s light', 'EXPL', 'the circle', 'N', ''),
 ('8.05', 'You', 'on the beats: you (yellow) · a child · a dog step into the light', 'MIX', 'the circle', 'Y', ''),
 ('8.06', 'And, he expects, the machine itself', 'the ring\'s own small light joins the circle', 'EXPL', 'the circle', 'N', ''),
 ('8.07', 'His own interviewer pushed back', 'the machine lights multiply until they fill the frame; the human lights stay few', 'EXPL', 'the field', 'Y', ''),
 ('8.08', 'We would be a small minority', 'a bar: HUMANS a thin sliver, MACHINES the rest', 'EXPL', 'the bar', 'N', ''),
 ('8.09', 'Ilya did not dodge', 'the man in his light, facing us, not turning away', 'SZENE', 'the man', 'Y', ''),
 ('8.10', '"It\'s true," he said', 'quote card "It\'s true." "It\'s possible it\'s not the best criterion." · PODCAST, NOV 2025', 'KARTE', 'the card', 'Y', ''),
 ('8.11', 'So this is no finished plan', 'a blueprint sheet with large empty areas', 'EXPL', 'the blueprint', 'Y', ''),
 ('8.12', 'And he has not said how', 'on the blueprint: HOW TO BUILD IT: —', 'EXPL', 'the blueprint', 'N', ''),
 ('8.13', 'But here is his hope', 'a small warm light and ONE CONDITION (the gold knot from c06)', 'MIX', 'the knot', 'N', ''),
 ('8.14', 'It is about the first truly powerful', 'a row of machine rings, the first few lit: THE FIRST ONES', 'EXPL', 'the first ring', 'Y', ''),
 ('8.15', 'slot:C5', 'C5 grows out of the first ring: ILYA SUTSKEVER · DWARKESH PODCAST, NOV 2025 · ORIGINAL FOOTAGE', 'CLIP', 'the ring', 'Y', ''),
 ('8.16', 'Not forever', 'a bar AT LEAST FOR QUITE SOME TIME, its far end soft, not a wall', 'EXPL', 'the bar', 'Y', ''),
 ('8.17', 'An honest hope', 'the warm light held in a hand', 'MIX', 'the hand', 'N', ''),
 ('8.18', 'And it hangs on one thing', 'builders\' hands put something into the first ring: WHAT THE BUILDERS PUT IN', 'EXPL', 'the hands', 'Y', ''),
 ('8.19', 'Ilya believes that in the end', 'several builders\' paths converge on one point: A MACHINE THAT CARES', 'EXPL', 'the point', 'Y', ''),
 ('8.20', 'And there is reason for hope', 'the AFTER side warms, first dawn', 'SZENE', 'the dawn', 'N', ''),
 ('8.21', 'The question is being asked', 'a dashed ring outline (the machine does not exist yet) with the question in front of it', 'EXPL', 'the outline', 'Y', ''),
 ('8.22', 'In public, where you can hear it', 'an open hall, sound reaches you (yellow) in the back row', 'SZENE', 'you', 'Y', ''),
 # ================================================================ c10 · B2 · his advice, the verdict, before and after, subscribe 2, end screen
 ('9.01', 'So what do you do His advice', 'ANCHOR TORONTO again: the hall, the graduates; DON\'T LOOK AWAY', 'MIX', 'the hall', 'N', ''),
 ('9.02', 'Use A.I.', 'you with the chat window from the hook: TRY THE BEST ONE TODAY', 'MIX', 'the window', 'N', ''),
 ('9.03', 'That, he told them, gives you', 'a small light grows in your hand: INTUITION', 'MIX', 'the light', 'Y', ''),
 ('9.04', 'And the energy for the challenge', 'the path ahead of you lights up', 'SZENE', 'the path', 'Y', ''),
 ('9.05', 'In some sense, he said', 'quote card "the greatest challenge humanity has ever faced" · TORONTO, JUNE 2025', 'KARTE', 'the card', 'Y', ''),
 ('9.06', 'And overcoming it', 'quote "the greatest reward" in gold on the dawn line', 'KARTE', 'the dawn', 'N', ''),
 ('9.07', 'So, what did Ilya see', 'the title WHAT DID ILYA SEE? again over the tower (thumbnail C echo)', 'MIX', 'the title', 'N', 'A'),
 ('9.08', 'In that famous week: people', 'the call grid: the tiles are people', 'EXPL', 'the grid', 'N', ''),
 ('9.09', 'A fight over trust', 'the threads between the tiles snap', 'EXPL', 'the line', 'N', ''),
 ('9.10', 'And ahead of us: a day', 'the LINE: the day rises on the AFTER side: AI DOES ALL THE THINGS WE CAN DO', 'EXPL', 'the day', 'N', ''),
 ('9.11', 'He put no date on that day', 'its date box stays empty: —', 'EXPL', 'the box', 'N', ''),
 ('9.12', 'But a machine that learns', '5–20 YEARS returns beside it: A MACHINE THAT LEARNS LIKE A HUMAN', 'EXPL', 'the cards', 'N', ''),
 ('9.13', 'He told a magazine', 'on the beats three cards fly onto the line: MAGAZINE · OCT 2023 / GRADUATES · JUNE 2025 / PODCAST · NOV 2025', 'EXPL', 'the cards', 'N', ''),
 ('9.14', 'There will be a before and an after', 'the LINE big across the frame, BEFORE | AFTER', 'EXPL', 'the line', 'N', '★'),
 ('9.15', 'And this is still the before', 'you stand left of the line, in the BEFORE, a small NOW marker at your feet', 'MIX', 'you', 'N', ''),
 ('9.16', 'The secret was never hidden', 'the three cards open wide in the light (all of it was said in public)', 'MIX', 'the cards', 'N', ''),
 ('9.17', "We just weren't listening", 'sound rings travel from the cards toward you', 'MIX', 'the rings', 'N', ''),
 ('9.18', 'Now you are', 'you look up and listen; the man far off at the tower', 'SZENE', 'the final picture', 'N', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2 over the final picture (the line, you, dawn on the AFTER side), no QR', 'SZENE', 'the end screen', 'N', ''),
 ('E.01', 'ENDSCREEN', 'END SCREEN (S.endScreen, 15 s, calm): the tower far off, the man small, the line; left tile BEST FOR VIEWER, right tile LATEST UPLOAD, subscribe circle centre', 'SZENE', '—', 'N', 'A'),
]

if '--anchors' in sys.argv: print(json.dumps([[r[0], r[1]] for r in SHOTS])); raise SystemExit(0)
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
WORDS = TM['words']; NW = [norm(w['w']) for w in WORDS]
def find(phrase, after=-1.0, nth=0):
    q = [norm(x) for x in phrase.split() if norm(x)]; hit = 0
    for i in range(len(WORDS) - len(q) + 1):
        if WORDS[i]['s'] < after: continue
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)):
            if hit == nth: return WORDS[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.1f}: {phrase!r}')
def at(anchor, after):
    if anchor == 'ENDSCREEN': return TM['duration'] - 15
    if anchor.startswith('slot:'): return next(c['start'] for c in TM['clips'] if c['id'] == anchor[5:])
    p, _, n = anchor.partition('#')
    return find(p, -1 if n else after, int(n) if n else 0)
times, prev = [], -1.0
for s in SHOTS:
    t = at(s[1], prev - .01); times.append(t); prev = t
# shot k owns the picture from (its anchor − LEAD) to the next one's (pictures land a beat before the word)
LEAD = .3
dur = TM['duration']
chunk_t = [0.0] + [at(c[2], -1) for c in CHUNKS[1:]]
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
def said(a, b):
    ws = [w['w'] for w in WORDS if a - 1e-3 <= w['s'] < b - 1e-3]
    s = ' '.join(ws)
    return (s[:150] + ' …') if len(s) > 150 else s
rows, tot, wsum, cuts, anchors = [], 0.0, 0.0, 0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
lay = {}
for k, s in enumerate(SHOTS):
    a, b = times[k], (times[k + 1] if k + 1 < len(SHOTS) else dur)
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order')
    a0 = 0.0 if k == 0 else max(chunk_t[chunk_of(a)], a - LEAD); b0 = dur if k + 1 == len(SHOTS) else max(chunk_t[chunk_of(times[k + 1])], times[k + 1] - LEAD)
    if k + 1 < len(SHOTS) and chunk_of(times[k + 1]) != chunk_of(a): b0 = chunk_t[chunk_of(times[k + 1])]
    if s[1].startswith('slot:'): a0, b0 = a, b
    if k and SHOTS[k - 1][1].startswith('slot:'): a0 = times[k]
    if k + 1 < len(SHOTS) and SHOTS[k + 1][1].startswith('slot:'): b0 = times[k + 1]
    d = max(0.0, b0 - a0); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[3]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[3]]; lay[s[3]] = lay.get(s[3], 0) + d
    fl = s[6].split(); cuts += 'W' in fl; anchors += 'A' in fl
    rows.append((c, s, a, d, said(a, b if not s[1].startswith('slot:') else a)))
share = wsum / tot
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 78 · "What Did Ilya See?" · shot list (binding)\n')
L.append(f'Generated by `tools/shots78.py` from `{TIMING}` (real VO, {dur:.2f} s incl. the 15 s end screen). Edit the table in the script, never this file. '
         'Times are for orientation: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`, clips `T.clip(id)`). REGELN §13: one picture per sentence; '
         'the column **zeigt wörtlich** is binding (improve the drawing, never drop the idea). Plan: `docs/MOTION.md`.\n')
L.append('## 1 · Numbers (measured before animating, §13.2 and §13.9)\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %). Weights per second of picture: EXPL 1 · KARTE 1 · MIX .5 · SZENE 0 · CLIP 0 (world flights 0).')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s ({v / tot * 100:.0f} %)' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- Rows: {len(SHOTS)} ({len(SHOTS) / (dur / 60):.1f} per minute); new motifs: {sum(1 for s in SHOTS if s[5] == "Y")}. Leitbild anchors (A): {anchors} (max 4). Hard cuts (W): {cuts} planned (≤ ~1 per minute; every other change is a carrier transformation).')
L.append('- Clips (CLIP): C2 Toronto · C1 NeurIPS · C3 Dwarkesh · C5 Dwarkesh, real cuts in the slots of `timing.json`; C4 is a QUOTE CARD (6.04), never footage.\n')
L.append('## 2 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2]} | {fmt(a)} | {fmt(b)} | {b - a:.1f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b, 0, 0]); g[1] = b
for c, s, a, d, _ in rows:
    b = next(x[1] for x in CHUNKS if x[0] == c); grp[b][2] += d; grp[b][3] += d * WEIGHT[s[3]]
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s, explainer {v[3] / max(1e-6, v[2]) * 100:.0f} %)' for k, v in grp.items()) + '\n')
L.append('## 3 · Shots\n')
L.append('Columns: **says** = the VO words of this row (from the timing) · **zeigt wörtlich** = what the picture shows · type · carrier into the next row · new motif? · flags (★ wow, A anchor, W hard cut).\n')
cur = None
for c, s, a, d, sd in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | says | zeigt wörtlich | type | carrier → next | new | |')
        L.append('|---|---|---|---|---|---|---|---|---|---|')
    anc = re.sub(r'#(\d+)', lambda m: f' ({int(m.group(1)) + 1}.)', s[1])
    says = sd if sd else ('(clip: ' + s[2].split(':')[0] + ')' if s[3] == 'CLIP' else '—')
    L.append(f'| {s[0]} | {anc} | {fmt(a)} | {d:.1f} | {says} | {s[2]} | {s[3]} | {s[4]} | {s[5]} | {s[6]} |')
L.append('\n## 4 · Seams between the groups (lib/f78_world.mjs, owned by the lead)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append('| Lead → B1 | So what was in those pages | `S.plateHook`: THE 52 PAGES (left), the gold LINE (centre), the man at the lectern in his spotlight (right) | H.19 settles into it | 1.01 pushes into the stack |')
L.append('| B1 → B2 | That is why this channel exists | `S.plateRecord`: HIS LIFE LINE with markers 1 2 gold (HELD), 3 4 cream (OPEN), 5–20 YEARS on 4, the gold knot, you at the right end, dawn low right | 5.27 settles into it | M.01 subscribe 1 over it |')
L.append('\nBoth sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`). Inner chunk boundaries belong to one builder. Check: `SECS=c06,c07 node tools/seam.mjs --at <T0>` (no flags).\n')
L.append('## 5 · On-screen strings and facts (from skript/kritik-v1.md, recherche/faktenzettel.md)\n')
L.append('- Dates in the picture (the VO leaves them out): FRI · NOV 17, 2023 · SWORN TESTIMONY, OCT 2025 · UNDER OATH · OAKLAND, MAY 2026 · MIT TECHNOLOGY REVIEW · OCT 26, 2023 · TORONTO · JUNE 2025 · NEURIPS · VANCOUVER · DEC 2024 · PODCAST, NOV 2025 · US RELEASE DEC 25, 2026 · AS OF NOV 2026. All in `F.SOURCES`.')
L.append('- Under C3 and at 5.18 / 9.12: A MACHINE THAT LEARNS LIKE A HUMAN: 5 TO 20 YEARS. Never "AGI in 5 to 20 years", never "AI does everything in 5 to 20 years".')
L.append('- Law-firm card (2.04–2.06): both findings: breakdown of trust / not about safety, AND the old board acted within its discretion; conduct did not mandate removal.')
L.append('- NOT in the picture: Musk (quotes or posts), the Q* letter, "feel the AGI", stills / trailer / footage of the movie "Artificial" (only its name + US release date as text), "forced out" / "fired" for his 2024 exit (he left by his own decision), Altman quotes or photos (Altman = a role and a name only), the colleague\'s name (the VO says "a single colleague"), Hinton\'s "proud" line, a bunker card or quote (one half-sentence only, #72).')
L.append('- Only Ilya\'s face is real, and only in the clips. Everyone else is a plain silhouette. No logos (no X / OpenAI / Google / Meta / Nvidia marks: names as text only).')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
# docs/shots.json: the same rows for the stubs (lib/stub78.mjs shows the row of the moment until a chunk is built)
json.dump([{'id': s_[0], 'chunk': c, 'anchor': s_[1], 't': round(a, 2), 'len': round(d, 2), 'shows': s_[2], 'type': s_[3], 'carrier': s_[4]} for (c, s_, a, d, _) in rows], open(os.path.join(HERE, '..', 'docs', 'shots.json'), 'w'), indent=0)
print(f'docs/shots.md: {len(SHOTS)} shots, explainer share {share * 100:.1f} %, W {cuts}, anchors {anchors}; layers', {k: round(v) for k, v in lay.items()}, '; groups:', {k: (round(v[1] - v[0]), round(v[3] / v[2] * 100)) for k, v in grp.items()})
