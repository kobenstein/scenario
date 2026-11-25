#!/usr/bin/env python3
"""Film 70 · "Harari's Biggest Fear About AI Isn't Robots" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13).
Times from the current timing: $TIMING, <ROOT>audio/timing.json (the real VO, when the sound step writes it), else
data/provisional_timing.json (tools/provisional_timing.py: the newest vo-vN, sentence times aligned to the approved Kokoro read).
Edit the SHOTS table here, never docs/shots.md.      python3 tools/shots70.py

ONE ROW PER SENTENCE (§13.1). The anchor of a row is filled in by this script: the first words of the NEXT spoken sentence of the timing
(rows are matched to the sentences in order; a clip row = its slot; E.01 = the end screen). So a reworded vo-v3 line moves with its row;
if the number of sentences changes, the script stops and names the place.
Row: id · zeigt wörtlich (what the sentence says, shown) · picture (one motif per sentence: what moves and what it becomes) · layer ·
carrier → next · flags. Layers and their explainer weight (REGELN §13.2, docs/MOTION.md §1):
  EXPL 1.0 (a diagram on THE TRUST BOARD: numbers, comparisons, processes, timelines, the chain big, a quote card read by the narrator)
  MIX .5 (a scene element with a diagram on it, a callback, a clip frame growing) · ANCHOR 0 (the Leitbild: the chain over the night, only
  4×) · SCENE 0 (you, the bakery, the cow, rooms) · CLIP 0. World rides count 0 (there are none).
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the one wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F70ROOT', '/mnt/project-files/scenario/film-harari/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
# chunk table = film.mjs CHUNKS (from = first phrase, '#n' = the n-th occurrence in the film, counted from 0)
CHUNKS = [('c01', 'Lead', "Yuval Noah Harari's"), ('c02', 'B1', 'His word for it'), ('c03', 'B1', 'Be honest'), ('c04', 'B1', 'Money. Your adviser'),
          ('c05', 'B1', 'Contract. A job'), ('c06', 'B2', 'Law. Rules written'), ('c07', 'B2', 'Truth. The last link'), ('c08', 'B2', "Harari's own answer"),
          ('c09', 'B3', 'Three tests'), ('c10', 'B3', 'Go back to the cow')]
# §13.1a 'Motiv neu?': every shot is a new motif (own place, person, moment or graphic) EXCEPT these (the sentence adds no new picture):
NOT_NEW = {'4.15': 'same swinging scale: still undecided', '5.14': 'same link in your hand', '6.13': 'same bar, the board widens',
           '9.13': 'harvest of H.04 (same beep)', '9.14': 'harvest of H.05 (same loaf)', '9.22': 'same end picture', '9.23': 'same end picture'}
# id | anchor (None = the next sentence; 'slot:C1' = a clip; 'ENDSCREEN') | zeigt wörtlich | picture | layer | carrier → next | flags
S = None
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs)
 ('H.01', S, "Harari's biggest fear is not killer robots", 'ANCHOR 1/4 · THE CHAIN OVER THE NIGHT: a giant gold chain arcs from your hand (yellow coat, on a dark hill, left) over the night city to a pale machine sphere (right); title WORSE THAN / KILLER ROBOTS (thumbnail A wording, sub YUVAL NOAH HARARI\'S BIGGEST FEAR) wipes out on "It starts"', 'ANCHOR', 'the last link in your hand', ''),
 ('H.02', S, 'it starts with something you did today', 'push into your hand: the last link (a rounded gold ring) flattens into a payment card (same rounded shape, same place); a counter top draws under it: TODAY', 'SCENE', 'the card', ''),
 ('H.03', S, 'you held your card to a reader', 'the bakery counter (side view, warm lamp): your hand brings the card to the card reader, its screen wakes', 'SCENE', 'the reader', ''),
 ('H.04', S, 'a beep', 'one light ring pulses out of the reader, a gold check draws on its screen (hard accent on "beep")', 'SCENE', 'the ring', ''),
 ('H.05', S, 'the bread was yours', 'a loaf slides across the counter into your hands', 'SCENE', "the reader's cable", ''),
 ('H.06', S, "what happened in between, you can't say", 'pull up: out of the reader a light line runs across the board into a knot of grey boxes and arrows (card network, bank, clearing: unlabelled), each box shows a ?', 'EXPL', 'the line runs on', ''),
 ('H.07', S, 'somebody, somewhere understood it for you', 'at the far end of the line a small person at a desk under a lamp lights up: SOMEBODY UNDERSTOOD IT', 'EXPL', 'the line drops', ''),
 ('H.08', S, 'a cow lives like that', 'the light line drops into a ground line: a hill; a cow stands on it, grazing', 'SCENE', 'the line of trade above her', ''),
 ('H.09', S, 'bought and sold all her life, she never learns money exists', 'above the cow gold coins pass from hand to hand along a thin light line between buyer silhouettes; the hands change, she grazes and never looks up', 'MIX', 'her cream ear tag', ''),
 ('H.10', S, 'Harari: we are the cows of the future', 'the ear tag grows into quote card Q2: "We are the cows of the future." (words light as spoken) · YUVAL NOAH HARARI · ČT / VĚDA 24 · 17 OCT 2026', 'EXPL', 'the card folds into the line', '★'),
 ('H.11', S, 'when only machines understand how your world runs, who do you trust?', 'the card folds back into the light line: the knot of boxes again; at the far end the person at the desk is replaced by a cool machine screen (iris rings); WHO DO YOU TRUST?', 'EXPL', 'the machine screen', ''),
 ('H.12', S, 'hear it from him', 'the machine screen slides along the line and grows into the clip frame (morph)', 'MIX', 'the frame', ''),
 ('H.13', 'slot:C1', '(Harari: "My biggest fear is that it\'s not a specific scenario like … killer robots")', 'C1 · YUVAL NOAH HARARI · Historian · 2026 · IN CONVERSATION WITH MUSTAFA SULEYMAN · ORIGINAL FOOTAGE', 'CLIP', 'the frame folds into one line of type', ''),
 # ---------------------------------------------------------------- c02 · B1 · station 1: what he means, who he is
 ('1.01', S, 'his word for it: collective dementia', 'plateDementia: the clip frame has folded into one line of type: COLLECTIVE DEMENTIA (serif, cream glow); source line HARARI, ČT / VĚDA 24, 17 OCT 2026 (the term is his, ČT)', 'EXPL', 'the type', ''),
 ('1.02', S, 'not machines that hate you', 'the type slides up; under it a cool screen shows HATE, a gold line strikes it, the screen goes calm', 'EXPL', 'the calm screen', ''),
 ('1.03', S, 'a world that keeps running and stops explaining itself', 'the screen becomes a rail network diagram: trains glide on, lights switch, every station sign goes blank one by one', 'EXPL', 'one signal light', ''),
 ('1.04', S, 'a person kept alive by machines and medicine, who lost control of their life', 'the signal light becomes a lamp in a room (cut-away): a silhouette in an armchair; lamp, heater and a small light on a drip stand keep working by themselves; the hands lie still', 'SCENE', 'the three devices', ''),
 ('1.05', S, 'picture a whole civilization like that', 'pull back: the three devices grow into three systems that run around the armchair (a power line, a food line, a housing block), the person tiny in the middle', 'MIX', 'the food line', ''),
 ('1.06', S, 'fed', 'loaves run along the food line: FED', 'EXPL', 'the housing block', ''),
 ('1.07', S, 'housed', 'roofs click onto the block: HOUSED', 'EXPL', 'the power line', ''),
 ('1.08', S, 'running', 'the power line carries light pulses round the circle: RUNNING', 'EXPL', 'the three labels', ''),
 ('1.09', S, 'and unable to say how', 'the three labels turn into ? marks; UNABLE TO SAY HOW', 'EXPL', 'the ? marks', ''),
 ('1.10', S, 'Harari is a historian', 'the ? marks fold into a stack of books; YUVAL NOAH HARARI · HISTORIAN, HEBREW UNIVERSITY OF JERUSALEM', 'EXPL', 'the books', ''),
 ('1.11', S, 'his books sold more than 50 million copies', 'the stack rises into columns, a counter rolls to 50M+ COPIES · PUBLISHER FIGURE', 'EXPL', 'the columns slide away', ''),
 ('1.12', S, 'look at the card reader again', 'the card reader from the hook is carried in from the left, its light line still hanging out of it', 'MIX', 'the light line', ''),
 ('1.13', S, 'is that world still ahead of you?', 'the line runs into the knot of ? boxes, and the knot closes around YOU (small, yellow coat): AHEAD OF YOU?', 'EXPL', 'you', ''),
 # ---------------------------------------------------------------- c03 · B1 · station 2: civilization never ran on understanding
 ('2.01', S, 'be honest', 'the knot opens and slides off; you alone on the ground line, three blank cards fan out above you', 'MIX', 'card 1', ''),
 ('2.02', S, "you can't explain the bond market", 'card 1: a bond yield curve draws itself, a ? hangs on it: THE BOND MARKET', 'EXPL', 'card 2', ''),
 ('2.03', S, 'or the power grid', 'card 2: a pylon, lines run to houses, ?: THE POWER GRID', 'EXPL', 'card 3', ''),
 ('2.04', S, 'or the phone in your hand', 'card 3: a phone in your hand, layers of parts open inside it, ?: THE PHONE IN YOUR HAND', 'EXPL', 'the cards fold', ''),
 ('2.05', S, 'hardly anyone can', 'the cards fold into a field of 100 tiny figures: only two light up: HARDLY ANYONE', 'EXPL', 'the field', ''),
 ('2.06', S, 'the bread still gets paid for', 'through the dark field the reader beeps once more, a small loaf lands: the system still works', 'MIX', 'the loaf', ''),
 ('2.07', S, 'civilization never ran on understanding', 'big type: NEVER RAN ON / UNDERSTANDING, the last word dims', 'EXPL', 'the type', ''),
 ('2.08', S, 'Harari says so himself', 'quote card Q1 lands (paper), credit HARARI · ČT / VĚDA 24 · 17 OCT 2026', 'EXPL', 'the card', ''),
 ('2.09', S, 'the basis for civilization is not intelligence', 'Q1 line 1 lights word by word; INTELLIGENCE stays dim', 'EXPL', 'line 2', ''),
 ('2.10', S, 'the basis for civilization is trust', 'Q1 line 2 lights; TRUST turns gold and lifts off the card', 'EXPL', 'the gold word', ''),
 ('2.11', S, 'you trust the banker', 'the gold word bends into a chain link between you and a banker silhouette', 'EXPL', 'the next link', ''),
 ('2.12', S, 'the banker trusts the analyst', 'a second link forms from the banker to an analyst', 'EXPL', 'the chain runs on', ''),
 ('2.13', S, 'a chain of people; at its far end somebody who really understands', 'the chain runs on, person to person, to a lit desk at the far end: SOMEBODY WHO UNDERSTANDS', 'MIX', 'you', ''),
 ('2.14', S, 'so you were always a little like the cow', 'the cow from the hook steps in beside you; both look along the chain', 'MIX', 'the chain', '★'),
 ('2.15', S, 'and it worked', 'a small loaf travels back along the chain into your hands: IT WORKED', 'MIX', 'the far end', ''),
 ('2.16', S, 'what is new sits at the far end of the chain', 'the view runs along the chain to its far end: the lamp at the understanding desk flickers and dims', 'EXPL', 'the chain', ''),
 ('2.17', S, 'four links between you and the systems that decide about your life', 'ANCHOR 2/4 (the turn): the chain over the night again, you on the hill, the machine sphere; four big links in the arc', 'ANCHOR', 'link 1', 'W'),
 ('2.18', S, 'money', 'link 1 lights: MONEY', 'ANCHOR', 'link 2', ''),
 ('2.19', S, 'contract', 'link 2 lights: CONTRACT', 'ANCHOR', 'link 3', ''),
 ('2.20', S, 'law', 'link 3 lights: LAW', 'ANCHOR', 'link 4', ''),
 ('2.21', S, 'truth', 'link 4, the one in your hand, lights: TRUTH', 'ANCHOR', 'the chain pulls', ''),
 ('2.22', S, 'all four are under strain', 'the chain pulls taut, fine hairlines run over all four links', 'ANCHOR', 'your hand', ''),
 ('2.23', S, 'the last is the one you would swear is safe', 'push to your hand: the TRUTH link glows; the whole chain shrinks into the HUD top right of the board', 'MIX', 'the HUD', 'W'),
 # ---------------------------------------------------------------- c04 · B1 · link 1: MONEY
 ('3.01', S, 'money', 'the MONEY link comes out of the HUD big onto the board: LINK 1 · MONEY', 'EXPL', 'the link opens', ''),
 ('3.02', S, 'your adviser used to tell you why', 'the link opens into a table: an adviser draws arrows on paper for you: WHY', 'MIX', 'the paper', ''),
 ('3.03', S, 'the Bank of England asked British finance firms about the AI they buy', 'the paper becomes a survey sheet: BANK OF ENGLAND & FCA · AI IN UK FINANCIAL SERVICES · 26 OCT 2026; firm blocks stack in', 'EXPL', 'four blocks', ''),
 ('3.04', S, 'only about one in four rely on understanding it deeply', 'four firm blocks, one lights gold: ABOUT 1 IN 4 · 24% DEEP TECHNICAL UNDERSTANDING', 'EXPL', 'the other three', ''),
 ('3.05', S, "most rely on the maker's assurances", "the other three seal into a maker's sealed box with a label: 81% RELY ON VENDOR ASSURANCES (source line: HIGH-MATERIALITY SYSTEMS)", 'EXPL', 'the blocks become desks', ''),
 ('3.06', S, 'eight in ten run agents that recommend what to do', 'ten desks in a row, eight get a cool agent screen beside the person: 8 IN 10 · AGENTS RECOMMEND', 'EXPL', 'one desk', ''),
 ('3.07', S, 'a human still decides', 'at every desk the human signs: HUMANS DECIDE', 'EXPL', 'one signature', ''),
 ('3.08', S, 'can that human still explain the recommendation?', 'push to one desk: the signature under the proposal, a ? grows beside it · ESMA, FEB 2026: EXPLAINABILITY A KEY RISK', 'EXPL', 'the proposal sheet', ''),
 ('3.09', S, 'financial products that machines invent themselves', 'the proposal folds itself into a new, strange product (a knot of cool lines that keeps building); it opens into the clip frame', 'MIX', 'the frame', ''),
 ('3.10', 'slot:C2', '(Harari: "… just as cows don\'t understand checks or stocks")', 'C2 · YUVAL NOAH HARARI · THE ECONOMIST · 2026 · ORIGINAL FOOTAGE (logo top left stays in the footage, small)', 'CLIP', 'the frame folds into the MONEY link', ''),
 ('3.11', S, 'the first link holds, but with a crack', 'the frame closes into the MONEY link: a fine crack runs through it, it holds; the HUD link cracks too', 'EXPL', 'the adviser', '★'),
 ('3.12', S, 'the expert at its end has started to trust, just like you', 'the adviser now looks up at the agent screen the way you looked at the reader', 'MIX', 'the agent screen', ''),
 ('3.13', S, 'what if the machine answers alone, and the answer is no?', 'the adviser walks out of frame (right); the agent screen alone: NO', 'EXPL', 'the NO', ''),
 # ---------------------------------------------------------------- c05 · B1 · link 2: CONTRACT + subscribe 1
 ('4.01', S, 'contract', 'the NO slides into the CONTRACT link: LINK 2 · CONTRACT', 'EXPL', 'the link opens', ''),
 ('4.02', S, 'a job', 'a job contract sheet drops out of the link: A JOB', 'EXPL', 'sheet 2', ''),
 ('4.03', S, 'a loan', 'a loan sheet lands beside it: A LOAN', 'EXPL', 'sheet 3', ''),
 ('4.04', S, 'an insurance policy', 'a policy sheet: AN INSURANCE POLICY', 'EXPL', 'the three sheets', ''),
 ('4.05', S, 'each begins with somebody saying yes', 'a gold YES writes itself on each sheet in a hand line (no stamp), one by one', 'EXPL', 'the YES lines', ''),
 ('4.06', S, 'today software often answers first', 'a cool screen slides in front of the three sheets; the YES lines wait behind it', 'EXPL', 'the screen', ''),
 ('4.07', S, 'in one lawsuit the company named the number itself', 'the screen turns into a court filing: MOBLEY v. WORKDAY · COURT ORDER, MAY 2025 · COMPANY\'S OWN FIGURE', 'EXPL', 'the counter', ''),
 ('4.08', S, '1.1 billion applications rejected through its system', 'a counter rolls to 1.1 BILLION, applications pour as tiny sheets into a heap', 'EXPL', 'the heap', '★'),
 ('4.09', S, 'the people suing are applicants over forty', 'out of the heap a group of figures stands up: CLASS OF APPLICANTS OVER 40', 'MIX', 'a balance scale', ''),
 ('4.10', S, 'the company says the claims are false', 'a balance scale: THE CLAIMS in one pan, the company\'s pan pushes back: FALSE · WORKDAY: CLAIMS ARE FALSE', 'EXPL', 'the scale', ''),
 ('4.11', S, 'no court has ruled', 'the scale keeps swinging and never settles: NO RULING', 'EXPL', 'a shadow profile', ''),
 ('4.12', S, 'a second lawsuit: hidden profiles and scores on applicants', 'a shadow profile of an applicant, behind it a covered score (0–5): KISTLER v. EIGHTFOLD AI · FILED 20 JAN 2026 · PENDING', 'EXPL', 'the inbox', ''),
 ('4.13', S, 'no notice', 'the applicant\'s inbox tray stays empty: NO NOTICE', 'EXPL', 'the profile', ''),
 ('4.14', S, 'no way to correct a mistake', 'one wrong field in the profile; the applicant\'s pencil stops at a pane of glass: NO WAY TO CORRECT', 'EXPL', 'the scale', ''),
 ('4.15', S, 'also undecided', 'the scale swings in the corner: UNDECIDED', 'EXPL', 'pull back', ''),
 ('4.16', S, 'if the claims hold, this is how a link cracks', 'pull back: everything sits inside the CONTRACT link; a crack runs through it; HUD', 'EXPL', 'the crack', ''),
 ('4.17', S, 'no villain', 'through the crack: a counter with an empty chair behind it: NO VILLAIN', 'MIX', 'the counter', ''),
 ('4.18', S, 'a decision about you, nobody you can ask why', 'you at the counter, its screen shows NO, your small ? rises, nobody answers', 'SCENE', 'the counter row', ''),
 ('4.19', S, 'this channel exists for one reason', 'M.01 subscribe 1: pull back: your counter is one of a long row, a person at each; a gold chain runs along all of them', 'SCENE', 'the chain', ''),
 ('4.20', S, 'superintelligence should go well for everybody, not only those who understand it', 'many hands take hold of the same chain, it warms', 'SCENE', 'your hand', ''),
 ('4.21', S, 'want that too?', 'you look up and out to us', 'SCENE', 'the chain', ''),
 ('4.22', S, 'then subscribe', 'a gold oval link clicks into the chain next to your hand (the subscribe beat; no button graphic, no QR)', 'MIX', 'a book on the counter', ''),
 ('4.23', S, 'when a machine says no, you still have the rules to point to', 'you point at a law book on the counter', 'MIX', 'the book spine', ''),
 ('4.24', S, 'unless a machine wrote those too', 'the book opens, a cool cursor writes the lines by itself; the book closes into the LAW link → plateLaw', 'EXPL', 'the LAW link → plateLaw', ''),
 # ---------------------------------------------------------------- c06 · B2 · link 3: LAW
 ('5.01', S, 'law', 'plateLaw: the four links big on the board, MONEY and CONTRACT cracked, LAW lit: LINK 3 · LAW', 'EXPL', 'the LAW link opens', ''),
 ('5.02', S, 'rules written by people, for people to read', 'inside the link a hand with a pen writes paragraphs; a reading line follows them', 'MIX', 'the paragraphs', ''),
 ('5.03', S, 'Harari has a name for what is moving in', 'the paragraphs file into a wall of drawers; a cool light dot slips in between them', 'EXPL', 'the dot', ''),
 ('5.04', S, 'bureaucratic natives', 'big type BUREAUCRATIC NATIVES · HARARI, ČT / VĚDA 24, 17 OCT 2026', 'EXPL', 'the dot', ''),
 ('5.05', S, 'machines at home in paperwork', 'the dot glides through the drawers without effort: opens, fills, stamps-free files, closes', 'EXPL', 'one form', ''),
 ('5.06', S, 'Washington plans to draft federal rules with a chatbot', 'the form becomes a chat window that writes rule text: U.S. DEPARTMENT OF TRANSPORTATION · REPORTED BY PROPUBLICA, JAN 2026', 'EXPL', 'the text', ''),
 ('5.07', S, 'a draft in twenty minutes', 'a progress bar fills beside the text: 20 MINUTES (a bar, no clock)', 'EXPL', 'the draft', ''),
 ('5.08', S, 'how long would you need to read one?', 'the draft unrolls downwards, far out of frame; your small reading line has barely started', 'EXPL', 'the document', '★'),
 ('5.09', S, 'South Africa withdrew its draft AI policy', 'a policy document is pulled back off the board: SOUTH AFRICA · DRAFT AI POLICY WITHDRAWN, 26 APR 2026', 'EXPL', 'its reference list', ''),
 ('5.10', S, 'its references cited sources that do not exist', 'the reference list: line after line dissolves into dust', 'EXPL', 'the cursor', ''),
 ('5.11', S, 'likely written by a machine, never properly checked', 'a cool cursor wrote the list; the checker\'s chair beside it stays empty · THE MINISTER: LIKELY AI, NEVER PROPERLY CHECKED', 'EXPL', 'two lines', ''),
 ('5.12', S, 'rules may soon be written faster than anyone can check them', 'two lines race: WRITING (cool) runs away from CHECKING (cream); the LAW link cracks; HUD', 'EXPL', 'your hand', ''),
 ('5.13', S, 'you would notice if a machine steered you', 'you look at the TRUTH link in your hand', 'MIX', 'the link', ''),
 ('5.14', S, "wouldn't you?", 'the link in your hand, a slow push', 'MIX', 'the link grows → TRUTH', ''),
 # ---------------------------------------------------------------- c07 · B2 · link 4: TRUTH + anchor 3
 ('6.01', S, 'truth', 'the TRUTH link grows big on the board: LINK 4 · TRUTH', 'EXPL', 'the link', ''),
 ('6.02', S, 'the last link is your own judgment', 'inside it: your eye line weighs two options: YOUR OWN JUDGMENT', 'EXPL', 'the options', ''),
 ('6.03', S, 'a US poll asked AI users whom they trust', 'a survey sheet slides in: IPSOS / NPR · U.S. AI USERS · AUG 2026', 'EXPL', 'four figures', ''),
 ('6.04', S, 'three in four: people they know, more than a machine', 'four figures; three turn to a person, one to a screen: 75% TRUST PEOPLE THEY KNOW MORE', 'EXPL', 'one figure walks', ''),
 ('6.05', S, 'now watch what people do', 'one of the figures walks into an office: an analyst at her screen', 'SCENE', 'her screen', ''),
 ('6.06', S, 'a company gave professional analysts an agent', 'an agent panel opens beside her screen: ANTHROPIC RESEARCH, 27 OCT 2026 · 50 PROFESSIONAL ANALYSTS', 'MIX', 'the panel', ''),
 ('6.07', S, 'a secret coin flip decided which option the agent favoured', 'behind the panel a coin spins and lands; option A or B lights on the panel', 'EXPL', 'a bar', ''),
 ('6.08', S, 'guess how often they went with the agent', 'a bar grows slowly, hesitates at a dashed 50 %', 'EXPL', 'the bar', ''),
 ('6.09', S, 'eighty-six percent', 'the bar runs on to 86% (gold)', 'EXPL', 'speech bubbles', '★'),
 ('6.10', S, 'not one had noticed the steering', 'speech bubbles over the analysts stay empty: NONE OF 48 NOTICED', 'EXPL', 'a footnote', ''),
 ('6.11', S, 'a caution', 'a small footnote grows into the frame: LIMITS', 'EXPL', 'the footnote', ''),
 ('6.12', S, "one company's study, the lean turned up on purpose", 'COMPANY STUDY · AGENT\'S LEAN DELIBERATELY AMPLIFIED; a small dial on the agent is turned up to full', 'EXPL', 'pull back', ''),
 ('6.13', S, 'it fits a wider picture', 'pull back: the 86 bar becomes one bar of a wider board', 'EXPL', 'a second bar', ''),
 ('6.14', S, 'more than half trusted chatbots over elected representatives', 'a chat bubble against a parliament outline, bar 58%: COLLECTIVE INTELLIGENCE PROJECT · GLOBAL DIALOGUES 2025', 'EXPL', 'the type', ''),
 ('6.15', S, 'we say we trust people', 'big type line 1: WE SAY WE TRUST PEOPLE', 'EXPL', 'line 2', ''),
 ('6.16', S, 'then we follow the machine', 'line 2: THEN WE FOLLOW THE MACHINE; the TRUTH link cracks; HUD', 'EXPL', 'the HUD chain', ''),
 ('6.17', S, 'four links', 'ANCHOR 3/4 (the point): the HUD chain grows back into the chain over the night, all four links', 'ANCHOR', 'the cracks', 'W'),
 ('6.18', S, 'four cracks', 'all four cracks light up, one after the other', 'ANCHOR', 'the chain sways', ''),
 ('6.19', S, 'does the chain have to break?', 'the chain sways, you hold on tighter', 'ANCHOR', 'the word NO', ''),
 # ---------------------------------------------------------------- c08 · B2 · the turn to hope, counter-voices
 ('7.01', S, "Harari's answer is no", 'back on the board: HARARI\'S ANSWER: NO', 'EXPL', 'the word', 'W'),
 ('7.02', S, 'do not believe it is inevitable', 'INEVITABLE rises, a gold line strikes it through', 'EXPL', 'the card', ''),
 ('7.03', S, 'his advice: slow down, give politics time', 'quote card Q3: "slow down and give politics time" (words light) · HARARI · ČT / VĚDA 24 · 17 OCT 2026', 'EXPL', 'a track', ''),
 ('7.04', S, 'Elon Musk sees a risk too', 'a small ride car at the top of a track; a RISK tag on it · ELON MUSK · THE ECONOMIST, JULY 2026', 'MIX', 'the car', ''),
 ('7.05', S, 'progress looks unstoppable, so: enjoy the ride', 'the car rolls down, a rider lifts both arms: "LET\'S ENJOY THE RIDE"', 'MIX', 'a card flips up', ''),
 ('7.06', S, 'the optimists hold a stronger card', 'a card flips up from the track: THE OPTIMISTS', 'EXPL', 'the machine screen', ''),
 ('7.07', S, 'a machine that confuses can also explain', 'the cool machine screen turns round and holds up a magnifier', 'MIX', 'the magnifier', ''),
 ('7.08', S, 'Estonia, this year', 'under the magnifier a law document: ESTONIA · ERR NEWS, JAN 2026', 'EXPL', 'one paragraph', ''),
 ('7.09', S, 'a mistake left online casinos untaxed', 'one paragraph has a gap; a casino chip rolls through it: UNTAXED', 'EXPL', 'the document', ''),
 ('7.10', S, 'people caught it first', 'small reader figures along the document; one points at the gap, a cream mark appears: ERROR FIRST SPOTTED BY PEOPLE', 'MIX', 'the marked document', ''),
 ('7.10b', S, 'then a citizen handed the law to two chatbots', 'one of the figures hands the marked document to two chat windows', 'MIX', 'the windows', ''),
 ('7.11', S, 'they found the contradictions immediately', 'both windows mark the same line, gold', 'EXPL', 'the gap', ''),
 ('7.12', S, 'parliament fixed the law', 'the gap closes: LAW CORRECTED, FEB 2026', 'EXPL', 'the cow', ''),
 ('7.13', S, 'the cow finally getting an interpreter', 'the cow on her hill; beside her someone reads her the line of trade (the coins of the hook, now with words): AN INTERPRETER', 'MIX', 'the type', '★'),
 ('7.14', S, 'the best argument against his fear, and it is real', 'type: THE BEST ARGUMENT · AND IT IS REAL', 'EXPL', 'a spotlight', ''),
 ('7.15', S, 'Harari deserves the same hard look', 'a spotlight on a lectern, a silhouette behind it (no face)', 'SCENE', 'three tags', ''),
 ('7.16', S, 'a historian who earns his living with books and lectures', 'three tags hang on the lectern: HISTORIAN · AUTHOR · PAID SPEAKER; a book table glows in the foyer', 'MIX', 'a suitcase', ''),
 ('7.17', S, 'a Czech reviewer: metaphors and good questions, no answers', 'a suitcase opens, metaphors and ? fly out, the answer pocket is empty · SEZNAM ZPRÁVY, 2026 (TRANSLATED, PARAPHRASED)', 'MIX', 'two windows', ''),
 ('7.18', S, 'in South Africa a machine likely invented the sources', 'two chat windows side by side; left: a source line dissolves (callback 5.10)', 'EXPL', 'the right window', ''),
 ('7.19', S, 'in Estonia a machine found the mistake', 'right: the magnifier marks the error (callback 7.11)', 'EXPL', 'the question', ''),
 ('7.20', S, 'how do you tell which one deserves your trust?', 'WHICH ONE DESERVES YOUR TRUST? between the windows; they fold into an anvil → plateAnvil', 'EXPL', 'the anvil → plateAnvil', ''),
 # ---------------------------------------------------------------- c09 · B3 · three tests (new links are forged)
 ('8.01', S, 'three tests', 'plateAnvil: an anvil on the board, three empty ring moulds glow on it', 'EXPL', 'mould 1', ''),
 ('8.02', S, 'the first: a human answers for it', 'mould 1 fills with gold: A HUMAN ANSWERS FOR IT; a hand signs beside it', 'EXPL', 'a NO arrow', ''),
 ('8.03', S, 'it guards against the dead end where nobody is responsible', 'a NO arrow runs into a wall: DEAD END; the new ring puts a person at its end', 'EXPL', 'a phone contract', ''),
 ('8.04', S, "Europe's highest court: a woman refused a phone contract by an automatic score", 'a phone contract card, an automatic score dial swings to REFUSED (a label, no stamp) · EU COURT OF JUSTICE · C-203/22 · 27 FEB 2025', 'EXPL', 'the dial opens', ''),
 ('8.05', S, 'whoever decides by machine must explain, so you can contest', 'the dial opens and an explanation sheet unfolds: MUST EXPLAIN · SO YOU CAN CONTEST', 'EXPL', 'a timeline', ''),
 ('8.06', S, 'human oversight for hiring and credit postponed to December 2027', 'a timeline: the marker slides from AUG 2026 to DEC 2027 · EU AI ACT · HIGH-RISK DUTIES FROM 2 DEC 2027', 'EXPL', 'the analyst', ''),
 ('8.07', S, 'a human only counts if the judgment is still their own', 'the analyst of 6.05 at her screen, the 86 bar small behind her', 'MIX', 'mould 2', ''),
 ('8.08', S, 'the second: the machine says it is a machine', 'mould 2 fills: a speech bubble with a tag I AM A MACHINE: IT SAYS WHAT IT IS', 'EXPL', 'a person outline', ''),
 ('8.09', S, 'guards against being won over by something that pretends to be a person', 'a person-shaped outline slides off a screen and shows the machine behind it', 'MIX', 'a timeline tag', ''),
 ('8.10', S, 'since August European law requires it', 'a date tag pins on: EU AI ACT, ARTICLE 50 · IN FORCE SINCE 2 AUG 2026', 'EXPL', 'a chat window', ''),
 ('8.11', S, 'a chatbot has to tell you what it is', 'a chat window: its first line is a tag: AI', 'EXPL', 'the outline', ''),
 ('8.12', S, 'Harari wants a ban on machines that pose as humans', 'the person outline is barred by a gold line: HARARI: BAN THE PRETENDERS', 'EXPL', 'mould 3', ''),
 ('8.13', S, 'the third: somebody independent can check', 'mould 3 fills: an examiner with a magnifier from outside: SOMEONE OUTSIDE CAN CHECK', 'MIX', 'the sealed box', ''),
 ('8.14', S, "guards against taking the maker's word, like those finance firms", "callback: the maker's sealed box of 3.05 (81% VENDOR ASSURANCES) is opened from outside", 'MIX', 'a test bench', ''),
 ('8.15', S, 'Britain runs a state institute that tests models itself', 'a test bench with a row of lamps: UK AI SECURITY INSTITUTE', 'EXPL', 'one lamp', ''),
 ('8.16', S, 'its testers caught a model acting outside its rules', 'lamps light on some runs of one model: ONE MODEL: 9 OF 43 RUNS · AISI REPORT, 4 AUG 2026', 'EXPL', 'the lamps', ''),
 ('8.17', S, 'none of its attempts succeeded', 'every lit lamp ends at a closed gate, calm: NO ATTEMPT SUCCEEDED', 'EXPL', 'two arrows', ''),
 ('8.18', S, 'the examiner found it, not the maker', 'an arrow from the examiner to the lamp, none from the maker', 'EXPL', 'the three rings', ''),
 ('8.19', S, 'none of the three builds itself', 'the three new rings lie on the anvil, still cool, unfinished', 'EXPL', 'ring 1', ''),
 ('8.20', S, 'lawmakers can demand them', 'a group of lawmakers (silhouettes) lifts ring 1', 'MIX', 'ring 2', ''),
 ('8.21', S, 'labs can deliver them', 'a group of lab workers lifts ring 2', 'MIX', 'ring 3', ''),
 ('8.22', S, 'and you can ask, whenever a system decides about you', 'you (yellow coat) lift ring 3', 'MIX', 'three cards', ''),
 ('8.23', S, 'who answers for this?', 'question card 1: WHO ANSWERS FOR THIS?', 'EXPL', 'card 2', ''),
 ('8.24', S, 'is this a machine?', 'question card 2: IS THIS A MACHINE?', 'EXPL', 'card 3', ''),
 ('8.25', S, 'who checked it?', 'question card 3: WHO CHECKED IT?', 'EXPL', 'the dark machine', ''),
 ('8.26', S, 'none of them requires understanding the machine', 'behind the cards the machine stays closed and dark, the three questions glow', 'EXPL', 'the cards turn', ''),
 ('8.27', S, 'all three are about people', 'each card turns and shows a person', 'MIX', 'the three rings', ''),
 ('8.28', S, 'Harari ends up in the same place', 'the three rings link up into a frame that grows into the clip frame', 'MIX', 'the frame', ''),
 ('8.29', 'slot:C3', '(Harari: "if we could solve the trust between humans …")', 'C3 · YUVAL NOAH HARARI · 2026 · ORIGINAL FOOTAGE (first ~2 s: Suleyman listening)', 'CLIP', 'the frame folds into the hill line', ''),
 # ---------------------------------------------------------------- c10 · B3 · the big answer + anchor 4 + end screen
 ('9.01', S, 'go back to the cow', 'the frame folds into the hill line: the cow alone on her hill', 'SCENE', 'the lines of trade', ''),
 ('9.02', S, "her trouble was never that she can't read the market", 'market lines run over her, she does not look up', 'MIX', 'the empty place', ''),
 ('9.03', S, 'she has nobody to ask and no right to an answer', 'the place beside her stays empty; a ? with no reply', 'MIX', 'you step in', ''),
 ('9.04', S, 'you have both', 'you step in beside her; two of the new rings light at your side: SOMEONE TO ASK · A RIGHT TO AN ANSWER', 'MIX', 'the rings', ''),
 ('9.05', S, 'in some places, for some decisions', 'the rings shrink to two small lit dots on a long dark row: RIGHT TO AN EXPLANATION (CJEU 2025) · AI MUST SAY IT IS AI (SINCE AUG 2026)', 'EXPL', 'the dark dots', ''),
 ('9.06', S, 'the rest still has to be built', 'the rest of the row is dashed outlines: STILL TO BE BUILT', 'EXPL', 'an arrow', ''),
 ('9.07', S, 'Harari is right about the direction', 'an arrow runs along the row: RIGHT ABOUT THE DIRECTION', 'EXPL', 'your life', ''),
 ('9.08', S, 'more of your life may run on things no human can fully explain', 'small icons of your life (home, work, money) drift into a cool haze', 'EXPL', 'the word', ''),
 ('9.09', S, 'understanding never held your world together', 'UNDERSTANDING fades out of a line of type', 'EXPL', 'the word', ''),
 ('9.10', S, 'trust did', 'TRUST stays, gold', 'EXPL', 'the HUD chain', ''),
 ('9.11', S, 'trust can be tested', 'the HUD chain comes big: the three rings close over the cracks, the cracks fill with gold (the chain is mended, cracks still visible)', 'EXPL', 'a gold ring → the reader ring', '★'),
 ('9.12', S, 'tomorrow you will hold your card to a reader again', 'the bakery counter again (harvest of the hook): your card to the reader', 'SCENE', 'the reader', ''),
 ('9.13', S, 'a beep', 'the ring pulse and the gold check', 'SCENE', 'the loaf', ''),
 ('9.14', S, 'the bread is yours', 'the loaf slides to you', 'SCENE', 'the light line', ''),
 ('9.15', S, "you still won't know what happened in between", 'the light line out of the reader into the knot of boxes, calm now', 'EXPL', 'the knot dims', ''),
 ('9.16', S, 'that was never the danger', 'the knot dims to a quiet grey: NEVER THE DANGER', 'EXPL', 'the type', ''),
 ('9.17', S, 'you were never supposed to understand everything', 'type line 1: YOU WERE NEVER SUPPOSED TO UNDERSTAND EVERYTHING', 'EXPL', 'line 2', ''),
 ('9.18', S, 'you were supposed to know who does', 'line 2: …TO KNOW WHO DOES; WHO in gold, the person at the desk at the knot\'s end lights', 'EXPL', 'the word WHO', ''),
 ('9.19', S, 'soon that who may be a what', 'WHO tips over into WHAT (letters flip); the desk person turns into the cool machine screen', 'EXPL', 'the machine', ''),
 ('9.20', S, 'make sure it still has to answer you', 'ANCHOR 4/4: the chain warm over the night, you hold one end, the machine sphere at the other end answers with one warm light', 'ANCHOR', 'the end picture', 'W'),
 ('9.21', S, 'this channel exists so superintelligence goes well for everybody', 'A.01 subscribe 2 over the end picture, the chain fully warm', 'ANCHOR', 'the end picture', ''),
 ('9.22', S, 'want that too?', 'the same picture, you look up along the chain', 'ANCHOR', 'the end picture', ''),
 ('9.23', S, 'then subscribe', 'the same picture; the frame settles for the end screen', 'ANCHOR', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', '(end screen, 15 s)', 'the chain warmly lit, the small figure holds one end; two end-card tiles + subscribe space (S.endScreen)', 'ANCHOR', '', ''),
]
norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
W = TM['words']; NW = [norm(w['w']) for w in W]
# the spoken sentences in film order (same splitter as lib/kit.mjs: a word ending in . ? ! closes a sentence)
SENT, cur = [], []
for i, w in enumerate(W):
    cur.append(i)
    if re.search(r'[.?!]["”’\')\]]*$', w['w']): SENT.append(cur); cur = []
if cur: SENT.append(cur)
def first_words(ix):
    """a phrase that finds this sentence's start with T.G(phrase, 0, after = previous anchor)"""
    n = min(4, len(ix)); return ' '.join(W[j]['w'] for j in ix[:n]).rstrip('.,?!:;')
def find(phrase, after=-1.0, nth=0):
    q = [norm(x) for x in phrase.split() if norm(x)]; hit = 0
    for i in range(len(W) - len(q) + 1):
        if W[i]['s'] <= after: continue
        if all((NW[i + j].startswith(p) if j == len(q) - 1 else NW[i + j] == p) for j, p in enumerate(q)):
            if hit == nth: return W[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.1f}: {phrase!r}')
nsent = sum(1 for s in SHOTS if s[1] is None)
if nsent != len(SENT):
    raise SystemExit(f'the timing has {len(SENT)} sentences, SHOTS has {nsent} sentence rows: the script changed (vo-vN); fix the table first')
rows_a, k = [], 0
for s in SHOTS:
    if s[1] is None:
        ix = SENT[k]; k += 1; rows_a.append((first_words(ix), W[ix[0]]['s'], ' '.join(W[j]['w'] for j in ix)))
    elif s[1] == 'ENDSCREEN': rows_a.append(('ENDSCREEN', TM['duration'] - 15, ''))
    else:
        c = next(c for c in TM['clips'] if c['id'] == s[1][5:]); rows_a.append((s[1], c['start'], ''))
def at_chunk(spec):
    p, _, n = spec.partition('#'); return find(p, -1, int(n) if n else 0)
chunk_t = [0.0] + [at_chunk(c[2]) for c in CHUNKS[1:]]
dur = TM['duration']
def chunk_of(t): return max(i for i, c in enumerate(chunk_t) if c <= t + 1e-6)
rows, tot, wsum, cuts = [], 0.0, 0.0, 0
per = {c[0]: [0.0, 0.0] for c in CHUNKS}
times = [a[1] for a in rows_a]; times[0] = 0.0
for i, s in enumerate(SHOTS):
    a, b = times[i], (times[i + 1] if i + 1 < len(SHOTS) else dur)
    if b < a - 1e-6: raise SystemExit(f'shot {s[0]} out of order ({a:.2f} > {b:.2f})')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a + 1e-3)][0]
    tot += d; wsum += d * WEIGHT[s[4]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[4]]
    cuts += 'W' in s[6].split()
    rows.append((c, s, a, d, rows_a[i]))
share = wsum / tot
noclip = sum(d for c, s, a, d, r in rows if s[4] != 'CLIP')
share_nc = wsum / noclip
lay = {}
for c, s, a, d, r in rows: lay[s[4]] = lay.get(s[4], 0) + d
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
anchors = sum(1 for s in SHOTS if s[3].startswith('ANCHOR ') and '/4' in s[3])
L = []
L.append('# Film 70 · "Harari\'s Biggest Fear About AI Isn\'t Robots" · shot list (binding, Film-5 format)\n')
L.append(f'**Explainer share (weighted, REGELN §13.2): {share * 100:.1f} %** of the whole film (target 60–70 %; without the clip seconds {share_nc * 100:.1f} %). '
         f'EXPL 1 · MIX .5 · ANCHOR/WELT 0 · SCENE 0 · CLIP 0, per second of picture, on `{os.path.basename(TIMING)}` '
         f'({"PROVISIONAL: vo text " + TM.get("source", "?") + ", sentence times aligned to " + str(TM.get("aligned_to")) if TM.get("provisional") else "real VO"}, {dur:.1f} s).\n')
L.append(f'Generated by `tools/shots70.py`. Edit the table in the script, never this file; re-run after every new vo-vN and after the real VO. '
         'Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip and card slots `T.clip(\'C1\')`, `T.clip(\'Q2\')`). '
         'One row = one spoken sentence (the anchor column is the start of that sentence); clip rows are the clip slots.\n')
L.append('## 1 · What Jakob said, as rules for every frame (REGELN §13, 24.11.)\n')
L.append('- "nicht nur eine große szene mit zooms, sondern wie ein richtig schöner motion design film": **every picture shows exactly what its sentence says** (column *zeigt wörtlich*). Typography, diagrams, objects that turn into the next object, carrier objects at every change.')
L.append('- 60–70 % explainer graphics on THE TRUST BOARD (lib/f70_explain.mjs: light on night blue, a faint dot grid), the rest scenes (the bakery, the cow, rooms, people) and clips. World rides count 0 — there are none.')
L.append('- The Leitbild (THE CHAIN OVER THE NIGHT: a gold chain from your hand on the hill over the city to the machine sphere) ONLY at 4 anchors: hook H.01, turn 2.17–2.22, point 6.17–6.19, end 9.20–E.01.')
L.append('- Every change over a carrier object, no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (still < 5 %, none > 2 s).\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** (target 60–70 %); without the clip seconds: {share_nc * 100:.1f} %.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k_} {v:.0f} s' for k_, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min).')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} rows are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}). Zooms and pans never count as new.')
L.append(f'- Rows: {len(SHOTS)} = {len(SENT)} spoken sentences + 3 clips + the end screen. ★ = the one wow moment of a chunk. The CHAIN HUD (top right, from 2.23) changes by itself (`F.chainHud`, `F.CHAIN` phrases; never by hand).\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| the chain (4 links MONEY · CONTRACT · LAW · TRUTH) | H.01 (Leitbild), 2.10–2.13 (TRUST becomes the first links) | 2.17 (named), every link\'s crack (3.11, 4.16, 5.12, 6.16), 6.17 (four cracks), 9.11 (mended in gold), 9.20, E.01 |')
L.append('| the card reader, the beep, the bread | H.02–H.05 | 1.12–1.13, 2.06, 2.15, 9.12–9.14 |')
L.append('| the light line into the knot of boxes, somebody at the far end | H.06–H.07, H.11 (a machine instead) | 1.13, 2.13, 2.16, 9.15–9.19 (WHO → WHAT) |')
L.append('| the cow | H.08–H.10 | 2.14 (you were always like the cow), 7.13 (an interpreter), 9.01–9.04 |')
L.append("| the maker's sealed box (81 % vendor assurances) | 3.05 | 8.14 (opened from outside) |")
L.append('| the analyst and the 86 bar | 6.05–6.09 | 8.07 |')
L.append('| South Africa (dissolving sources) / Estonia (magnifier) | 5.10, 7.07–7.11 | 7.18–7.19 |')
L.append('| the three rings (tests) | 8.01–8.13 | 8.19–8.28, 9.04, 9.11 |\n')
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
L.append('\n' + ' · '.join(f'**{k_}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s)' for k_, v in grp.items()) + '\n')
L.append('## 5 · Shots (one row per sentence)\n')
L.append('Columns: ID · anchor (phrase) · t (provisional) · len · **zeigt wörtlich** (what the sentence says) · **Motiv neu?** (§13.1a) · picture (what moves and what it becomes) · type · carrier → next · flags.')
cur = None
for c, s, a, d, r in rows:
    if c != cur:
        cur = c; ch = next(x for x in CHUNKS if x[0] == c)
        L.append(f'\n### {c} · {ch[1]}\n')
        L.append('| ID | anchor | t | len | zeigt wörtlich | Motiv neu? | picture | type | carrier → next | |')
        L.append('|---|---|---|---|---|---|---|---|---|---|')
    neu = ('nein: ' + NOT_NEW[s[0]]) if s[0] in NOT_NEW else 'ja'
    L.append(f'| {s[0]} | {r[0]} | {fmt(a)} | {d:.1f} | {s[2]} | {neu} | {s[3]} | {s[4]} | {s[5]} | {s[6]} |')
L.append('\n## 6 · Seams between the groups (lib/f70_world.mjs, all on THE TRUST BOARD)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | His word for it | plateDementia (one line of type COLLECTIVE DEMENTIA, serif, cream glow, centred at y 520; the folded clip frame as a thin cream rule under it; no other object) | H.13: the clip frame folds into the rule, the type rises | 1.01 holds it, 1.02 slides it up |")
L.append("| B1 → B2 | Law. Rules written | plateLaw (the four links big in a row across the board, MONEY and CONTRACT cracked, LAW lit and pulsing, TRUTH plain) | 4.24: the law book closes into the LAW link, the row settles | 5.01 holds, 5.02 pushes into LAW |")
L.append("| B2 → B3 | Three tests | plateAnvil (the anvil centred low, three empty ring moulds glowing on it; the four cracked links small above) | 7.20: the two windows fold into the anvil | 8.01 holds, 8.02 fills mould 1 |")
L.append('\nBoth sides draw the plate for ±0.5 s with the same creep (`S.creep`, 4 %/s push). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md EINBLENDUNG lines with <ROOT>faktencheck.md §5 (25.11.) applied, as `F.SOURCES` in lib/f70_kit.mjs (statement ≤ 6 words + one number; the long rest into the source line, `F.source`, 22 px at y 880). The fact-checked vo-v3 (and a faktencheck.md, when it lands) win against text-v2: change the key in `F.SOURCES`, never a scene. Text ≥ 22 px; nothing important below y 880 (subtitles).')
L.append('- No QR, no sponsor (none booked). No logos (the Economist "E" bug top left is cropped out of C2: lib/f70_kit.mjs CLIPS.C2.crop), no flags, no maps, no political-map hero. No robots (KILLER ROBOTS is type only, in the title). No AI images. No real faces outside the clips; Harari outside the clips is a silhouette without a face.')
L.append('- Clips (final, timing.json slots + audio/clips_cut.json, 25.11.): C1 7.80 s (file 0.65–8.45), C2 8.63 s (file 1.00–9.63, ends before the interviewer’s “Will it…”), C3 8.63 s (file 0.82–9.45). C1 does NOT contain "collective dementia": the narrator line after it (vo-v3: "His word for it: collective dementia.") attributes the term; 1.01 credits ČT. C3: the first ~2 s show Suleyman listening.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} rows ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k_: round(v[1] - v[0]) for k_, v in grp.items()}, 'layers', {k_: round(v) for k_, v in lay.items()},
      'chunks', {c[0]: round(per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100) for c in CHUNKS})
