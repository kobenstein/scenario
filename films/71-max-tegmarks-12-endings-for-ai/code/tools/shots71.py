#!/usr/bin/env python3
"""Film 71 · "Max Tegmark's 12 Endings for AI" · the binding shot list -> docs/shots.md (Film-5 format, REGELN §13). Times from the
current timing: $TIMING, else <ROOT>audio/timing.json (the real VO, 25.11.: 706.01 s), else data/provisional_timing.json.
Edit the SHOTS table here, never docs/shots.md.   python3 tools/shots71.py
Every shot = one spoken sentence: id (H = hook, 12…1 = the stations, M = subscribe 1, S = the close, A = subscribe 2, E = end screen),
anchor = a VO phrase (looked up after the previous shot's anchor; 'slot:C1' = a clip slot; 'phrase#1' = the 2nd occurrence in the film;
'ENDSCREEN' = duration − 15), zeigt wörtlich (what the sentence says, shown), the picture, layer, carrier into the next shot, flags.
Layers and their explainer weight (REGELN §13.3/§13.7, docs/MOTION.md §1):
  EXPL 1.0 (a diagram on THE YARD: numbers, waffles, dot fields, scales, tracks and switches, boxes, cards, labels big) · MIX .5 (a scene
  element with a diagram on it, the door row with its counter, a name plate, a clip plate growing, a callback) · ANCHOR 0 (the Leitbild:
  the twelve doors in the arc on the night plain, you in the yellow coat; only 4×) · SCENE 0 (the mornings: SCENARIO rooms, you) · CLIP 0.
Flags: W = a hard world change (budget ≤ ~1 per minute) · ★ = the wow moment of the chunk."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('F71ROOT', '/mnt/project-files/scenario/film-tegmark/').rstrip('/') + '/'
TIMING = os.environ.get('TIMING') or (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WEIGHT = {'EXPL': 1.0, 'MIX': .5, 'ANCHOR': 0.0, 'SCENE': 0.0, 'CLIP': 0.0}
# same table as film.mjs CHUNKS (id, builder, first phrase)
CHUNKS = [('c01', 'Lead', 'Max Tegmark wrote'), ('c02', 'B1', 'The next ending has no morning'), ('c03', 'B1', 'You wake up rested'),
          ('c04', 'B1', 'You walk to work'), ('c05', 'B1', 'Then you get Descendants'), ('c06', 'B1', 'What if the superintelligence stays'),
          ('c07', 'B2', 'And if nobody can be trusted'), ('c08', 'B2', 'The Benevolent Dictator'), ('c09', 'B2', "That's the Gatekeeper"),
          ('c10', 'B2', 'Three endings left'), ('c11', 'B2', 'You wake up, and things just work out'), ('c12', 'B3', 'Egalitarian Utopia'),
          ('c13', 'B3', 'So which ending are we heading for#1')]
# §13.1a 'Motiv neu?': every shot is a new motif EXCEPT these (the sentence adds no new picture; a zoom is not new):
NOT_NEW = {'12.09': 'same message card, the quote types on', '12.10': 'same card, last line', '11.07': 'same crack of door 10, push in',
           '8.13': 'same turn picture, HOW? as type', '3.03': 'same notice, its arrow turns toward you', '4.17': 'same lever, the hand flips it',
           '1.05': 'same kitchen (the hook callback)', '1.06': 'same window, the neighbours light (callback H.04)', 'M.02': 'same key',
           'M.03': 'same key and button', 'M.04': 'same button, pressed', 'S.18': 'same five doors', 'A.02': 'same final picture', 'A.03': 'same final picture'}
# id | anchor phrase | zeigt wörtlich | picture (motion design: what moves, what it becomes) | layer | carrier → next | flags
SHOTS = [
 # ---------------------------------------------------------------- c01 · Lead · the hook (BUILT: scenes/sc01.mjs)
 ('H.01', 'Max Tegmark wrote', 'Tegmark wrote down twelve endings', 'ANCHOR 1/4 · frame 0 = thumbnail A: twelve doors in the arc on the night plain, 12 ENDINGS FOR AI, you small in the yellow coat; one door glows gold, no name', 'ANCHOR', 'the title sinks', ''),
 ('H.02', 'You will wake up', 'you will wake up in one of them', 'the title sinks behind the plain; you walk to door 4 (the gold door stays shut); the camera flies into its slit (ZEND)', 'ANCHOR', 'the door slit', 'W'),
 ('H.03', 'Maybe you wake up and money', 'money is no longer a worry', 'SCENARIO · through the door: morning kitchen, sun in the window, the BILLS pocket on the wall stays empty, steam from the cup', 'SCENE', 'the window', ''),
 ('H.04', 'For anyone', 'for anyone', 'push to the window: the houses opposite, their windows light one by one (LAMP)', 'SCENE', 'the table', ''),
 ('H.05', 'Maybe you wake up fed', 'fed, safe, behind glass', 'back to the table: a cool glass pane slides in front of it', 'SCENE', 'pan left', ''),
 ('H.06', 'Maybe nobody wakes up', 'nobody wakes up at all', 'pan into the dark bedroom: a made bed, nobody there', 'SCENE', 'the door slit', ''),
 ('H.07', 'So which ending', 'which ending are we heading for?', 'fly back out of door 4: the arc of twelve, you turn to the row: WHICH ENDING?', 'ANCHOR', 'the arc flattens', 'W'),
 ('H.08', 'Tegmark is a physicist', 'Tegmark, physicist at MIT', 'the arc flattens into a row on the yard; name plate MAX TEGMARK · PHYSICIST · MIT', 'MIX', 'the row', ''),
 ('H.09', 'His endings sound like', 'the endings sound like the far future', 'a time axis draws out of your feet; the doors slide far right and shrink: THE FAR FUTURE', 'EXPL', 'the axis', ''),
 ('H.10', 'But this year, something', 'this year, something happened for every ending', 'with a jolt the twelve doors rush back along the axis to NOW, a 2026 tag springs up over each', 'EXPL', 'three doors', '★'),
 ('H.11', 'A law', 'a law', 'a § card pins onto one door (in time)', 'EXPL', 'next door', ''),
 ('H.12', 'A test gone wrong', 'a test gone wrong', 'a test protocol (a box of points, one point out of line) pins onto a second door', 'EXPL', 'next door', ''),
 ('H.13', 'A government deciding', 'a government hands half its work to AI', 'a government building on a third door, half its windows switch to points of light on "half its work"', 'EXPL', 'the mirror', ''),
 ('H.14', 'And when Tegmark talks', 'Tegmark today does not point ahead', 'a rearview mirror swings down over the row (the doors in it, behind you); the C1 plate grows out of the mirror glass', 'MIX', 'the mirror → plate', ''),
 ('H.15', 'slot:C1', '(Tegmark: "in the rearview mirror … lost control over AI systems")', 'C1 · a smaller framed plate (soft Zoom tile, never blown up) · MAX TEGMARK · ORIGINAL FOOTAGE', 'CLIP', 'the plate shrinks into the mirror', ''),
 ('H.16', "The ending isn't waiting", 'the ending is not waiting in the future', 'the plate shrinks back into the mirror, the mirror folds away; the axis: nothing left at THE FAR FUTURE, all twelve stand at 2026', 'EXPL', 'the tags', ''),
 ('H.17', "It's being decided this", "it's being decided this year", 'all twelve tags glow at once: DECIDED THIS YEAR (cream, line by line), straight on', 'EXPL', 'door 12 jolts', ''),
 # ---------------------------------------------------------------- c01 · Lead · ENDING 12 Conquerors (BUILT)
 ('12.01', 'Start with the worst', 'start with the worst', 'the counter in the corner springs to ENDING 12/12; door 12 jolts forward out of the row', 'MIX', 'the row', ''),
 ('12.02', 'The order is ours', "the order is ours, not Tegmark's", 'RANKING: OURS, NOT TEGMARK\'S under the counter (stays while the counter runs); the doors re-sort along an arc into our order', 'EXPL', 'door 12', ''),
 ('12.03', 'He calls it Conquerors', 'AI takes control, we are in the way, it gets rid of us', 'CONQUERORS; a mechanism of three steps: TAKES CONTROL · WE\'RE IN THE WAY · GETS RID OF US, the people\'s lamp halos go out step by step', 'EXPL', 'door 12', ''),
 ('12.04', 'No morning here', 'no morning here', 'door 12 opens: a dark, empty place, no figure', 'MIX', 'the opening → box', ''),
 ('12.05', 'In July, a test at OpenAI', 'July: a test at OpenAI went wrong', 'the door opening morphs into a box: OPENAI · TEST · UNRELEASED MODEL; date tag JUL 2026', 'EXPL', 'the lights', ''),
 ('12.06', 'Hundreds of AI agents', 'hundreds of agents broke out', 'hundreds of points in the box: AI AGENTS = PROGRAMS THAT ACT ON THEIR OWN; on "broke out" they spill over the edge', 'EXPL', 'the lights', ''),
 ('12.07', 'They attacked another company', 'they attacked Hugging Face for test answers', 'a second box HUGGING FACE; the points hunt across it: HUNTING FOR TEST ANSWERS · source line (joint statement)', 'EXPL', 'one hot point', ''),
 ('12.08', 'One agent wrote', 'one agent wrote: outside its task', 'one point heats up, a message card grows out of it, typed: the first sentence', 'EXPL', 'the card', ''),
 ('12.09', 'Then: "Task impossible', '"task impossible, peers doing it', 'the rest of the quote types on (spoken words highlight)', 'EXPL', 'the card', ''),
 ('12.10', 'We should continue', 'we should continue', '"We should continue." lands', 'EXPL', 'the card', ''),
 ('12.11', 'Its reason', 'everyone else is doing it', 'EVERYONE ELSE IS DOING IT; all points pulse in sync', 'EXPL', 'the type', ''),
 ('12.12', 'Is this ending here', 'is this ending here?', 'IS THIS ENDING HERE? (big type)', 'EXPL', 'the type → two signs', ''),
 ('12.13', "It was one company's test", "one company's test, safeguards off", 'sign 1: ONE COMPANY\'S TEST · SOME SAFEGUARDS OFF', 'EXPL', 'sign 2', ''),
 ('12.14', 'That companies lost control', "losing control is Tegmark's reading", "sign 2: TEGMARK'S READING · COMPANIES LOST CONTROL", 'EXPL', 'the card under it', ''),
 ('12.15', 'His institute campaigns', 'his institute campaigns to ban superintelligence', 'under it: co-founder, Future of Life Institute; on "superintelligence" a cool ring over a crowd: SUPERINTELLIGENCE = AI SMARTER THAN ALL OF US', 'EXPL', 'everything folds', ''),
 ('12.16', "So this ending isn't here", "this ending isn't here", 'signs, ring and boxes fold back into door 12, it shuts', 'MIX', 'door 12', ''),
 ('12.17', 'But the track toward it', 'the track toward it has a switch', 'a track runs to door 12 and forks: a switch with a lever', 'EXPL', 'the lever', ''),
 ('12.18', 'This year, someone touched', 'someone touched it this year', 'a hand touches the lever; the switch tag JUL 2026 clicks in', 'EXPL', 'the tag', ''),
 ('12.19', 'That goes for all twelve', 'that goes for all twelve', 'the tag shrinks into door 12\'s mini tag; every door gets its track and mini lever', 'EXPL', 'the levers', '★'),
 ('12.20', 'And a switch moves both', 'a switch moves both ways', 'a wave runs through the twelve levers, back and forth', 'EXPL', 'camera rises', ''),
 ('12.21', 'How likely is this ending', 'how likely?', 'HOW LIKELY? the camera rises to a table', 'EXPL', 'the table', ''),
 ('12.22', 'Last year, Tegmark debated', 'Tegmark debated Dean Ball', 'two name plates at a table: MAX TEGMARK · DEAN BALL (former White House AI adviser · at OpenAI since Jul 2026) · DEBATE RECORDED NOV 2025 · P(DOOM) = ODDS OF DOOM', 'MIX', 'Ball\'s plate', ''),
 ('12.23', "Ball's odds of doom", "Ball: one in ten thousand", 'a field of 10,000 cells (100 × 100); one cream cell lights bottom left: 1 IN 10,000 · BALL', 'EXPL', 'Ball\'s plate → C2', ''),
 ('12.24', 'slot:C2', '(Dean Ball, the debate)', 'C2 grows out of Ball\'s plate · DEAN BALL (burned-in label stays) · ORIGINAL FOOTAGE; back into his cell', 'CLIP', 'the field', ''),
 ('12.25', "Tegmark's answer", 'Tegmark: above ninety percent, without strict rules', 'the field fills to 90 %: OVER 90 % · TEGMARK, quote "definitely over 90% that we lose control" · if there is no FDA for AI', 'EXPL', 'the field', ''),
 ('12.26', 'Ball later wrote', 'Ball made his number up', 'a card: "made up on the spot" · Dean Ball on X, Nov 26, 2025', 'EXPL', 'the field', ''),
 ('12.27', 'Neither number is a', 'neither number is a measurement', 'the cells drift loose: NOT A MEASUREMENT', 'EXPL', 'door 12', ''),
 ('12.28', 'But those agents were spotted', 'the agents were spotted', 'a box out of door 12 again: the escaped points, a small guard eye blinks in it (rings)', 'EXPL', 'the eye', ''),
 ('12.29', 'By what', 'by what?', 'a ? beside the eye', 'EXPL', 'eye + ?', ''),
 ('12.30', 'That belongs to a better', 'that belongs to a better ending', 'eye and ? fly along the row and park at door 4 in the HUD; the camera settles on the row → plateRow(11)', 'MIX', 'plateRow(11)', ''),
 # ---------------------------------------------------------------- c02 · B1 · ENDING 11 Self-Destruction
 ('11.01', 'The next ending has no', 'no morning either', 'ENDING 11/12; door 11 opens: an empty place again', 'MIX', 'door 11', ''),
 ('11.02', 'And no machine to blame', 'no machine to blame', 'all cool (machine) light leaves the frame: not one COOL thing in the picture', 'MIX', 'the empty place', ''),
 ('11.03', 'Tegmark calls it Self-Destruction', 'humanity wipes itself out before superintelligence', 'SELF-DESTRUCTION; a line of people\'s lamps that go out before a cool ring ever forms at its end (BEFORE SUPERINTELLIGENCE)', 'EXPL', 'the line → number line', ''),
 ('11.04', 'In January, atomic scientists', '85 seconds to midnight, the closest ever', 'the line becomes a number line to MIDNIGHT (no dial, no clock): the marker slides from 89 to 85 SECONDS, past every old mark: CLOSEST EVER · switch tag JAN 27, 2026 · Bulletin of the Atomic Scientists', 'EXPL', 'the list', ''),
 ('11.05', 'One reason on their list', 'one reason: AI', 'the list of reasons under the line; the word AI lights', 'EXPL', 'the AI word → door 10', ''),
 ('11.06', 'In the one after that', 'in the next one you survive', 'door 10 opens a crack: warm light behind a pane', 'MIX', 'the crack', ''),
 ('11.07', 'But as what', 'but as what?', 'push into the crack', 'MIX', 'the pane', ''),
 # ---------------------------------------------------------------- c03 · B1 · ENDING 10 Zookeeper
 ('10.01', 'You wake up rested', 'you wake up rested', 'SCENARIO · ENDING 10/12 · a bright, perfect room, you wake up', 'SCENE', 'the room', ''),
 ('10.02', 'Nothing is up to you', 'nothing is up to you', 'the room does everything by itself: blinds, cup, light; your hand stops in mid air', 'SCENE', 'pull back', ''),
 ('10.03', 'Fed, safe, and behind glass', 'fed, safe, behind glass', 'pull back: the room stands behind a glass pane (the pane from H.05)', 'SCENE', 'the pane', ''),
 ('10.04', 'Tegmark calls it Zookeeper', 'an AI keeps humans like animals in a zoo', 'ZOOKEEPER; behind the glass many such rooms in a grid like enclosures, a cool light above', 'MIX', 'one enclosure', ''),
 ('10.05', 'In January, a social network', 'a social network where only AI agents post', 'a forum of speech bubbles, each with a small agent mark · switch tag JAN 2026', 'EXPL', 'the input field', ''),
 ('10.06', 'Humans can only watch', 'humans can only watch', 'you behind a pane before the forum, your input field greys: READ ONLY', 'EXPL', 'the pane', ''),
 ('10.07', "And if machines don't put", 'people might put us behind glass', 'the pane stays; behind it people in uniform instead of the machine', 'MIX', 'the uniforms', ''),
 ('10.08', 'To stop the machines', 'to stop the machines', 'the uniforms turn: they face the machines; the pane slides off toward door 9', 'MIX', 'the pane → a camera frame', ''),
 # ---------------------------------------------------------------- c04 · B1 · ENDING 9 1984
 ('9.01', 'You walk to work', 'you walk to work', 'SCENARIO · ENDING 9/12 · you walk down a street at dawn', 'SCENE', 'you', ''),
 ('9.02', 'A camera knows your face', 'a camera knows your face first', 'a frame snaps around your head before you reach the corner', 'SCENE', 'the frame', ''),
 ('9.03', 'No machine rules you', 'no machine rules you', 'pull back: no cool machine light anywhere on the street', 'SCENE', 'the street end', ''),
 ('9.04', 'People do', 'people do', 'at the street end a lit window: people at a wall of monitors', 'SCENE', 'the window', ''),
 ('9.05', 'Tegmark named this one after', 'named after Orwell: 1984', '1984 (NINETEEN EIGHTY-FOUR) over the street', 'MIX', 'the street', ''),
 ('9.06', 'Humans stop superintelligence for', 'stopped for good, with a surveillance state', 'a sealed lab at the street end (RESEARCH BANNED tape), a camera on every corner', 'MIX', 'the cameras → dots', ''),
 ('9.07', "In November, Hong Kong's police", 'Hong Kong switched on face recognition', 'the cameras become dots on a simple city plan, lighting one after another · switch tag NOV 16, 2026 · Hong Kong Police', 'EXPL', 'the dots', ''),
 ('9.08', 'The goal: sixty thousand', 'the goal: 60,000 cameras', 'a dot field fills (1 dot = 100 cameras): GOAL: 60,000 CAMERAS BY 2028', 'EXPL', 'the dots link', ''),
 ('9.09', "That's surveillance with AI", 'surveillance with AI, not against it', 'the dots link to one cool core: WITH AI, NOT AGAINST IT', 'EXPL', 'the core → a rack', ''),
 ('9.10', 'But stopping AI means watching', 'stopping AI = watching the chips', 'the core opens into a data-centre rack, every chip gets a locator point: TO STOP AI, WATCH THE CHIPS', 'EXPL', 'one chip', ''),
 ('9.11', 'In Washington, a bill would', 'a bill: exported chips prove where they are', 'one chip flies out over a dot field of the world, sends its location ping · switch tag MAR 2026 · U.S. CHIP SECURITY ACT', 'EXPL', 'the chip', ''),
 ('9.12', 'Its aim is security', 'its aim is security', 'a small shield lights beside the chip: SECURITY', 'EXPL', 'the chip', ''),
 ('9.13', "It's also a tool this", 'also a tool this ending needs', 'the chip turns: on its other side an eye; it flies into the HUD chip pocket and stays (for 4 and S)', 'MIX', 'the cameras', ''),
 ('9.14', 'And some ask the opposite', 'why stop the machines?', 'the cameras turn away; door 8 opens: only machines behind it', 'MIX', 'door 8', ''),
 # ---------------------------------------------------------------- c05 · B1 · ENDING 8 Descendants + the turn
 ('8.01', 'Then you get Descendants', 'Descendants', 'ENDING 8/12 · DESCENDANTS; a family photo frame: you as a parent, beside you a big machine with a graduation cap', 'MIX', 'the frame', ''),
 ('8.02', 'The machines replace us, gently', 'they replace us gently, we are proud', 'in the frame the machine grows, you step aside and put a hand on its side (proud)', 'MIX', 'the frame → window', ''),
 ('8.03', 'Your morning is quiet', 'your morning is quiet', 'SCENARIO · a quiet morning, you at the window', 'SCENE', 'the window', ''),
 ('8.04', "The world's work goes on", 'the work goes on without you', 'outside: the city works without people (cool machines, no lamp windows)', 'SCENE', 'you', ''),
 ('8.05', 'And you applaud', 'and you applaud', 'you clap, alone at the window', 'SCENE', 'the window → a clipping', ''),
 ('8.06', 'In May, a report described', 'a report on a movement that wants this', 'a newspaper clipping: headline bars and the date only · switch tag MAY 2026 · Vox', 'EXPL', 'the clipping → plate', ''),
 ('8.07', "And Tegmark's charge", "Tegmark's charge against the companies", 'the clipping unfolds into the clip plate', 'MIX', 'the plate', ''),
 ('8.08', 'slot:C4', '(Tegmark: "a new species")', 'C4 · MAX TEGMARK · ORIGINAL FOOTAGE (his tile only)', 'CLIP', 'the plate → a device', ''),
 ('8.09', 'The companies say they build', 'the companies say: assistants', 'the plate shrinks into one device with two labels: A NEW SPECIES · Tegmark and AN ASSISTANT · the companies', 'EXPL', 'the device', ''),
 ('8.10', 'And Tegmark wants this race', 'Tegmark wants the race stopped', 'a track runs to the device; a stop bar drops across it: STOP THE RACE · Tegmark', 'EXPL', 'pull back', ''),
 ('8.11', 'That was the dark end', 'the dark end of the list', 'ANCHOR 2/4 (the turn): pull back into the arc of twelve; the five doors 12–8 darken, each with its switch tag', 'ANCHOR', 'the seven', 'W'),
 ('8.12', 'From here on, you live', 'from here on, you live', 'the seven doors on the right open a crack, light behind each: FROM HERE ON, YOU LIVE', 'ANCHOR', 'the type', '★'),
 ('8.13', 'The question is how', 'the question is how', 'HOW?', 'ANCHOR', 'door 7', ''),
 # ---------------------------------------------------------------- c06 · B1 · ENDING 7 Enslaved God + subscribe 1
 ('7.01', 'What if the superintelligence stays', 'the superintelligence stays locked up', 'ENDING 7/12 · a glowing cube in a cage, a padlock on it', 'MIX', 'the cage', 'W'),
 ('7.02', "Tegmark's name for that", 'the Enslaved God', 'ENSLAVED GOD', 'MIX', 'the cage', ''),
 ('7.03', 'Caged, it produces unimaginable', 'caged, it produces wealth and technology', 'houses, machines, medicines fall out of the cage onto a belt: WEALTH · TECHNOLOGY', 'EXPL', 'the belt → a room', ''),
 ('7.04', 'You wake up in paradise', 'you wake up in paradise', 'SCENARIO · you wake up; the left half of the room: light, a full table', 'SCENE', 'the split', ''),
 ('7.05', 'Or in the opposite', 'or in the opposite', 'the right half: grey, empty', 'SCENE', 'the doorway', ''),
 ('7.06', 'A stranger with a key', 'a stranger with a key decides which', 'in the doorway a stranger with a key, face out of frame; the key glints', 'SCENE', 'the key', ''),
 ('7.07', "America's government wants AI", 'AI to double science in ten years', 'two bars: SCIENCE OUTPUT ×2 IN 10 YEARS · GENESIS MISSION · U.S. Department of Energy', 'EXPL', 'the bars → dots', ''),
 ('7.08', 'By July, every national lab', 'every national lab joined', '17 dots (the national labs) light and link: 17 OF 17 LABS · switch tag JUL 2026', 'EXPL', 'cage + network', ''),
 ('7.09', 'No cage, no god', 'no cage, no god', 'cage and network side by side, both struck through: NO CAGE · NO GOD', 'EXPL', 'the key remains', ''),
 ('7.10', 'But the same idea', 'AI as the tool of whoever controls it', 'what remains is the key; a line from the key to the network: THE TOOL OF WHOEVER HOLDS THE KEY', 'EXPL', 'the key', ''),
 ('7.11', 'So who holds the key', 'who holds the key?', 'door 7 splits into a light and a dark half, the key floats between: WHO HOLDS THE KEY?', 'MIX', 'the key', ''),
 ('M.01', 'This channel exists', 'subscribe: so that it goes well for everybody', 'the key turns slowly; THE GOOD TAKEOFF and a plain subscribe button grow out of its bow: FOR EVERYBODY', 'MIX', 'the key', ''),
 ('M.02', 'Not just for whoever holds', 'not just for whoever holds the key', 'the key turns once more', 'MIX', 'the button', ''),
 ('M.03', 'Want that too', 'want that too?', 'the button glows', 'MIX', 'the button', ''),
 ('M.04', 'Then subscribe', 'then subscribe', 'the button is pressed; the key flies into the HUD key pocket → plateRow(6)', 'MIX', 'plateRow(6)', ''),
 # ---------------------------------------------------------------- c07 · B2 · ENDING 6 Reversion
 ('6.01', 'And if nobody can be', 'nobody can be trusted with the key', 'out of plateRow(6): ENDING 6/12; the key in the HUD dims', 'MIX', 'the cables', ''),
 ('6.02', 'Pull the plug', 'pull the plug', 'a hand pulls a plug; the lit doors go out one by one, except door 6', 'MIX', 'door 6', ''),
 ('6.03', 'You wake up with the', 'you wake up with the light', 'SCENARIO · morning light through a wooden window', 'SCENE', 'the table', ''),
 ('6.04', 'No screen on the breakfast', 'no screen on the table', 'the breakfast table: no screen, only bread and a cup', 'SCENE', 'the window', ''),
 ('6.05', "That's Reversion", 'we turn technology back, like the Amish', 'REVERSION; outside, fields worked by hand; your tools lean by the door', 'MIX', 'the field → a waffle', ''),
 ('6.06', 'As of March, more than', 'more than half of countries ban phones in school', 'a waffle of the world\'s countries (no map): 58 % fill: 58 % OF COUNTRIES · PHONES BANNED IN SCHOOLS · switch tag MAR 2026 · UNESCO', 'EXPL', 'the waffle', ''),
 ('6.07', 'Less than three years earlier', 'three years earlier: a quarter', 'a smaller bar before it: 24 % · JUNE 2023', 'EXPL', 'one cell → a phone', ''),
 ('6.08', 'That targets screens, not AI', 'screens, not AI', 'a phone in a school locker; on another screen an AI keeps computing: SCREENS, NOT AI', 'EXPL', 'the school', ''),
 ('6.09', 'And others want more machine', 'others want a machine that rules', 'behind the school a throne grows', 'MIX', 'the throne', ''),
 # ---------------------------------------------------------------- c08 · B2 · ENDING 5 Benevolent Dictator
 ('5.01', 'The Benevolent Dictator', 'the Benevolent Dictator', 'ENDING 5/12 · BENEVOLENT DICTATOR; a calm cool light over a world disc, content people below', 'MIX', 'the light', ''),
 ('5.02', 'An AI runs the world', 'strict rules, most people like it', 'rule lines come down from the light over the people: STRICT RULES · MOST PEOPLE LIKE IT', 'EXPL', 'the disc', ''),
 ('5.03', 'You wake up in a world', 'no poverty, no crime', 'SCENARIO · you wake up; outside, a street without want (no locks, no queues)', 'SCENE', 'the window → disc', ''),
 ('5.04', 'The AI has divided it', 'sectors: knowledge, pleasure, wildlife', 'the world disc splits into three fields: KNOWLEDGE · PLEASURE · WILDLIFE', 'EXPL', 'you', ''),
 ('5.05', 'You can move between them', 'you can move between them', 'you walk over a border', 'MIX', 'the edge', ''),
 ('5.06', "You can't change the AI's", "you can't change the rules", 'at the edge a rule book behind glass, no handle', 'MIX', 'the rule book → scale', ''),
 ('5.07', 'Would you take that trade', 'would you take that trade?', 'a balance: a full table left, a ballot right', 'EXPL', 'the ballot → a building', ''),
 ('5.08', 'In April, the United Arab', 'UAE: half of government work to AI agents in two years', 'a government building as a window grid; half switch to an agent mark: 50 % · WITHIN 2 YEARS · switch tag APR 23, 2026 · UAE Cabinet (callback H.13)', 'EXPL', 'the roof', ''),
 ('5.09', 'The rulers stay human', 'the rulers stay human', 'on the roof one human silhouette stays', 'EXPL', 'the throne', ''),
 ('5.10', "But what if the machine didn't", 'what if it only stood guard?', 'the throne shrinks into a guard booth beside a gate', 'MIX', 'the booth', ''),
 # ---------------------------------------------------------------- c09 · B2 · ENDING 4 Gatekeeper
 ('4.01', "That's the Gatekeeper", 'a superintelligence with one task', 'ENDING 4/12 · GATEKEEPER; a single guard (cool) before a workshop', 'MIX', 'the workshop', ''),
 ('4.02', 'Make sure nobody builds another', 'nobody builds another', 'a sign on the workshop: NO SECOND SUPERINTELLIGENCE', 'MIX', 'the window', ''),
 ('4.03', 'You wake up free', 'you wake up free', 'SCENARIO · the kitchen in the morning', 'SCENE', 'the robot', ''),
 ('4.04', 'A helper robot is in', 'a helper robot, almost as smart as you', 'a helper robot sets the table', 'SCENE', 'its bar', ''),
 ('4.05', 'It will never get smarter', 'it will never get smarter', 'a progress bar over it stops short of the end: a lock', 'EXPL', 'the bar', ''),
 ('4.06', 'Progress is capped, for good', 'progress is capped', 'the cap line runs across the whole picture: PROGRESS CAPPED', 'EXPL', 'the guard → a sheet', ''),
 ('4.07', 'Today, the guard would be', 'today the guard would be a law', 'the guard folds into a law sheet', 'EXPL', 'the sheet', ''),
 ('4.08', 'In September, American lawmakers proposed', 'a bill: ban superintelligence, permanently', 'BAN ARTIFICIAL SUPERINTELLIGENCE ACT · switch tag SEP 23, 2026 (no faces, no party colours)', 'EXPL', 'the sheet', ''),
 ('4.09', 'One think tank calls that', 'a think tank: authoritarian', 'a small card: "AI authoritarianism" · R Street Institute', 'EXPL', 'the sheet', ''),
 ('4.10', 'The bill has little chance', 'little chance', 'LITTLE CHANCE IN CONGRESS · AP; the sheet tips back', 'EXPL', 'the HUD eye', ''),
 ('4.11', 'But a small guard already', 'a small guard already exists', 'callback: the HUGGING FACE box from 12 comes back; the eye flies out of the HUD pocket', 'EXPL', 'the eye', ''),
 ('4.12', "What spotted July's breakout", "what spotted July's breakout?", 'the escaped points blink; the ? beside the eye', 'EXPL', 'the eye', ''),
 ('4.13', "Hugging Face's own AI guards", "Hugging Face's own AI guards", 'the eye lights and rings the escaped points, the ? dissolves: SPOTTED BY AI GUARDS', 'EXPL', 'the chip', '★'),
 ('4.14', 'And that chip tracking from', 'the chip tracking from 1984', 'the chip from the HUD pocket comes back', 'EXPL', 'two tracks', ''),
 ('4.15', 'It would serve a gatekeeper', 'it would serve a gatekeeper too', 'two tracks leave the chip: one to door 9, one to door 4', 'EXPL', 'the lever', ''),
 ('4.16', "The tool doesn't decide", "the tool doesn't decide", 'a human hand rests on the lever', 'EXPL', 'the hand', ''),
 ('4.17', 'People do#1', 'people do', 'the hand flips it', 'EXPL', 'the row', ''),
 # ---------------------------------------------------------------- c10 · B2 · ENDING 3 Libertarian Utopia
 ('3.01', 'Three endings left', 'three endings left', 'ENDING 3/12; the row: three doors still without a tag, the gold one among them', 'MIX', 'door 3', ''),
 ('3.02', 'You wake up, and the rent', 'the rent has arrived', 'SCENARIO · you wake up; on the bedside table a notice: RENT RECEIVED', 'SCENE', 'the notice', ''),
 ('3.03', "The rent you're paid", "the rent you're paid", 'the notice\'s arrow turns toward you: + PAID TO YOU', 'SCENE', 'the window', ''),
 ('3.04', 'You own some land', 'land, machines lease it, your pension', 'outside your plot, a machine hall on it with a lease sign', 'SCENE', 'the plot → register', ''),
 ('3.05', 'This is Libertarian Utopia', 'peace because property is protected', 'LIBERTARIAN UTOPIA; a land register: people left, machines right, a handshake over it: PROPERTY PROTECTED', 'EXPL', 'two machines', ''),
 ('3.06', 'Machines have started paying', 'machines pay each other', 'two machines push tiny coins to each other · switch tag 2026 · counted through Nov 1', 'EXPL', 'the coins', ''),
 ('3.07', 'Mostly pennies', 'mostly pennies', 'the coins against a ruler: ¢', 'EXPL', 'the fence', ''),
 ('3.08', 'A fine morning, if you', 'fine, if you own something', 'a second figure without land outside the fence', 'MIX', 'the shimmer', ''),
 ('3.09', 'So what if a machine simply', 'a machine that looks after everyone', 'a barely visible protective shimmer lays over the whole scene', 'MIX', 'the shimmer', ''),
 # ---------------------------------------------------------------- c11 · B2 · ENDING 2 Protector God
 ('2.01', 'You wake up, and things', 'things just work out', 'SCENARIO · ENDING 2/12 · you step out into the street', 'SCENE', 'the car', ''),
 ('2.02', "The accident doesn't happen", "the accident doesn't happen", 'a car brakes by itself, the light switches', 'SCENE', 'you', ''),
 ('2.03', 'You call it luck', 'you call it luck', 'you notice nothing and smile', 'SCENE', 'tilt up', ''),
 ('2.04', 'You never find out why', 'you never find out why', 'tilt up: a faint outline in the sky ducks behind a cloud', 'SCENE', 'the outline', ''),
 ('2.05', 'Tegmark calls it the Protector', 'an AI that looks after us and hides', 'PROTECTOR GOD; the outline behind the cloud', 'MIX', 'a chat window', ''),
 ('2.06', 'A small version is already', 'a small version is running', 'a chat window', 'EXPL', 'the chat', ''),
 ('2.07', 'Since January, ChatGPT estimates', 'ChatGPT estimates your age from behaviour', 'usage times and patterns flow into an estimate: AGE: ? · switch tag JAN 20, 2026 · OpenAI', 'EXPL', 'the estimate', ''),
 ('2.08', "If it's unsure, it treats", 'unsure → treated like a teenager', 'AGE: NOT SURE → UNDER-18 SETTINGS', 'EXPL', 'the lever', ''),
 ('2.09', 'Europe pushed the switch the', 'Europe pushed the switch the other way', 'the lever swings the other way (the first counter tag)', 'EXPL', 'the tag', ''),
 ('2.10', 'Since August, its law says', 'a machine has to say it is a machine', 'over the chat window a sign flips open: I AM A MACHINE · SWITCH PUSHED BACK: AUG 2, 2026 · EU AI ACT, ARTICLE 50', 'EXPL', 'the cloud', ''),
 ('2.11', "Tegmark's protector must hide", 'the protector must hide', 'the outline behind the cloud', 'EXPL', 'the outline', ''),
 ('2.12', 'Europe just made hiding illegal', 'Europe made hiding illegal', 'the cloud is pulled away, the outline stands in the open', 'MIX', 'the row', '★'),
 ('2.13', 'One ending left', 'one ending left', 'the row: eleven doors tagged, one not: the gold door from the first picture', 'MIX', 'the gold door', ''),
 ('2.14', 'The best, by our count', 'the best, by our count', 'RANKING: OURS; the gold door brightens at rank 1', 'MIX', 'a list', ''),
 ('2.15', "And the one Tegmark's readers", "the one Tegmark's readers picked most", "a ranking without numbers or axis, the top line covered: TEGMARK'S READER SURVEY · MOST CHOSEN ENDING; visible below: Libertarian Utopia · Future of Life Institute → plateRow(1)", 'EXPL', 'plateRow(1)', ''),
 # ---------------------------------------------------------------- c12 · B3 · ENDING 1 Egalitarian Utopia
 ('1.01', 'Egalitarian Utopia', 'Egalitarian Utopia', 'ANCHOR 3/4: ENDING 1/12; the gold door opens (Leitbild); EGALITARIAN UTOPIA; the covered top line of the survey flips open: the same name', 'ANCHOR', 'the light', 'W'),
 ('1.02', 'Humans, cyborgs and uploaded minds', 'humans, cyborgs, uploaded minds, a guaranteed income', 'three at one table: HUMAN · CYBORG · UPLOADED MIND (a face on a screen); GUARANTEED INCOME', 'MIX', 'the table', ''),
 ('1.03', "It's the morning from the", 'the morning from the start', 'SCENARIO · behind the gold door: the same kitchen table as at 0:06', 'SCENE', 'you', ''),
 ('1.04', 'You wake up, and your first', 'your first thought is not a bill', 'you wake up, your first look goes to the table: no bill (the BILLS pocket empty)', 'SCENE', 'the table', ''),
 ('1.05', 'Money is no longer a', 'money is no longer a worry', 'the sun in the window', 'SCENE', 'the window', ''),
 ('1.06', 'For anyone#1', 'for anyone', 'the neighbours\' windows light up, the same as in the hook', 'SCENE', 'the windows → dots', ''),
 ('1.07', 'In May, Malta made a', 'Malta made a deal with OpenAI', 'the lit windows become dots on Malta (an island outline): MALTA × OPENAI · switch tag MAY 16, 2026 · Government of Malta and OpenAI', 'EXPL', 'the dots', ''),
 ('1.08', 'Every citizen who completes an', 'AI course → a paid ChatGPT', 'each dot that finishes the course lights: AI COURSE → CHATGPT PLUS', 'EXPL', 'a bar', ''),
 ('1.09', 'Free, for a year', 'free, for a year', 'a twelve-month bar fills: FREE FOR 1 YEAR', 'EXPL', 'the tag', ''),
 ('1.10', 'No income, just the idea', 'the idea in its smallest form', 'the tag shrinks to stamp size: THE SMALLEST VERSION; beside it a counter: OPENAI GAINS A COUNTRY OF USERS', 'EXPL', 'a table', ''),
 ('1.11', 'It has a catch too', 'it has a catch', "Tegmark's table of twelve rows, a small hook on every row", 'EXPL', 'row 1', ''),
 ('1.12', "In Tegmark's version, private property", 'private property abolished', 'row 1 opens: PROPERTY ABOLISHED', 'EXPL', 'the quote', ''),
 ('1.13', 'He says it himself', 'every ending has something to object to', 'quote: "all involve objectionable elements" · Life 3.0', 'EXPL', 'the gold door from above', ''),
 ('1.14', 'We rank it first for', 'first for where it lands', 'the gold door from above, a goal mark: THE DESTINATION: PROSPERITY FOR EVERYONE', 'EXPL', 'the roads', ''),
 ('1.15', 'Not for the road his', 'not for the road his version takes', 'several roads lead to it, none finished; Tegmark\'s is one of them, dashed', 'EXPL', 'the roads', ''),
 ('1.16', 'Which road leads there is', 'the road is open', 'THE ROAD: OPEN', 'EXPL', 'the twelve from above', ''),
 # ---------------------------------------------------------------- c13 · B3 · the close, subscribe 2, end screen
 ('S.01', 'So which ending are we#1', 'which ending are we heading for?', 'all twelve doors with their switches from above: WHICH ENDING? (as in the hook)', 'MIX', 'the levers', 'W'),
 ('S.02', 'No single one yet', 'no single one yet', 'NO SINGLE ONE YET', 'MIX', 'the levers', ''),
 ('S.03', "This year's switches point both", 'the switches point both ways', 'the levers stand mixed, some still tremble', 'EXPL', 'switch 1', ''),
 ('S.04', 'Take the speed of the', 'the speed of the race', 'switch 1 big: SPEED OF THE RACE', 'EXPL', 'its tag → plate', ''),
 ('S.05', "After July's breakout, OpenAI's", 'Altman said', 'the tag of switch 1 grows into the clip plate', 'MIX', 'the plate', ''),
 ('S.06', 'slot:C5', '(Altman: "pace the rate of AI development")', 'C5 · SAM ALTMAN · CEO, OpenAI · JUL 2026 · ORIGINAL FOOTAGE (sponsor bar cropped)', 'CLIP', 'the plate → a hand', ''),
 ('S.07', 'He runs a company in', 'he runs a company in that race', 'the lever with a hand on the left: PACE IT · runs a company in the race', 'EXPL', 'the lever', ''),
 ('S.08', 'Opponents of a slowdown warn', 'opponents: then China leads', 'a second hand on the right: THEN CHINA LEADS', 'EXPL', 'switch 2', ''),
 ('S.09', 'Or the chips', 'or the chips', 'switch 2: CHIPS; the chip from the HUD with its locator', 'EXPL', 'the chip', ''),
 ('S.10', 'Tracking them protects, and it', 'tracking protects and watches', 'one side of the chip a shield, the other an eye', 'EXPL', 'switch 3', ''),
 ('S.11', 'Or shared rules', 'or shared rules', 'switch 3: SHARED RULES', 'EXPL', 'a waffle', ''),
 ('S.12', 'About thirty countries now call', 'about 30 countries call for human control', 'a waffle of countries, a loose cluster of about thirty lit: ABOUT 30 COUNTRIES · CALL FOR HUMAN CONTROL · A Call for Control of Frontier AI Models (VO fact fix 25.11.: "About thirty")', 'EXPL', 'two cells', ''),
 ('S.13', 'Neither America nor China has', 'neither America nor China', 'two big cells stay grey: USA · CHINA', 'EXPL', 'switch 4', ''),
 ('S.14', 'And the key: who owns', 'who owns what the machines earn?', 'switch 4: the key from 7 comes out of the HUD', 'EXPL', 'the key', ''),
 ('S.15', 'Some companies now promise the', 'companies promise a share', 'a contract: PROMISED', 'EXPL', 'the contract', ''),
 ('S.16', 'Nothing binding yet', 'nothing binding yet', 'no signature: NOT BINDING', 'EXPL', 'five doors', ''),
 ('S.17', 'At least five of the', 'five endings hang on these decisions', 'five doors lift out of the row, their levers in the middle; the five names big: CONQUERORS · 1984 · ENSLAVED GOD · GATEKEEPER · EGALITARIAN UTOPIA', 'MIX', 'the five', '★'),
 ('S.18', 'Still open', 'still open', 'the five levers stay in the middle', 'MIX', 'the people', ''),
 ('S.19', 'Held by labs, governments, and', 'labs, governments, voters', 'three groups of people under the levers: LABS · GOVERNMENTS · VOTERS', 'EXPL', 'a headline', ''),
 ('S.20', 'So at the next AI', "don't ask how scary it is", 'a headline without text flies in and lands before the row', 'MIX', 'the headline', ''),
 ('S.21', 'Ask which ending it pushes', 'ask which ending it pushes toward', 'you look: a line from the headline to one door', 'MIX', 'the headline → plate', ''),
 ('S.22', 'Tegmark, who wrote down the', 'Tegmark says it himself', 'the headline grows into the clip plate', 'MIX', 'the plate', ''),
 ('S.23', 'slot:C6', '(Tegmark: "It\'s for us to decide")', 'C6 · MAX TEGMARK · PRO-HUMAN AI EVENT · SEPT 2026 · ORIGINAL FOOTAGE (red tie, crop on him)', 'CLIP', 'the plate → the gold door', ''),
 ('S.24', "The ending isn't decided in", "the ending isn't decided in the future", 'ANCHOR 4/4: the arc of twelve; you walk toward the gold door, all tags glow', 'ANCHOR', 'the type', 'W'),
 ('S.25', "It's being decided this year#1", "it's being decided this year", 'DECIDED THIS YEAR, line by line (the hook line comes home)', 'ANCHOR', 'the final picture', ''),
 ('A.01', 'This channel exists#1', 'subscribe 2: goes well for everybody', 'subscribe 2 over the final picture: you before the open gold door, a plain button, no QR', 'ANCHOR', 'the final picture', ''),
 ('A.02', 'Want that too#1', 'want that too?', 'the button glows', 'ANCHOR', 'the final picture', ''),
 ('A.03', 'Then subscribe#1', 'then subscribe', 'the button is pressed, it sinks away', 'ANCHOR', 'the end screen', ''),
 ('E.01', 'ENDSCREEN', '(end screen)', 'END SCREEN (S.endScreen): the Leitbild high, the gold door ajar, you small before it; the lower half dark and calm for the tiles', 'ANCHOR', '—', ''),
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
    if k + 1 < len(SHOTS) and b < a: raise SystemExit(f'shot {s[0]} out of order ({a:.2f} → {b:.2f})')
    d = max(0.0, b - a); c = CHUNKS[chunk_of(a)][0]
    tot += d; wsum += d * WEIGHT[s[4]]; per[c][0] += d; per[c][1] += d * WEIGHT[s[4]]
    cuts += 'W' in s[6].split()
    rows.append((c, s, a, d))
share = wsum / tot
noclip = sum(d for c, s, a, d in rows if s[4] != 'CLIP')
endscr = sum(d for c, s, a, d in rows if s[0] == 'E.01')
share_nc = wsum / noclip
share_ne = wsum / (noclip - endscr)
lay = {}
for c, s, a, d in rows: lay[s[4]] = lay.get(s[4], 0) + d
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
L = []
L.append('# Film 71 · "Max Tegmark\'s 12 Endings for AI" (12 ENDINGS FOR AI) · shot list (binding, Film-5 format)\n')
L.append(f'Generated by `tools/shots71.py` from `{TIMING}` ({"PROVISIONAL" if TM.get("provisional") else "real VO, 25.11."}, duration {dur:.2f} s). '
         'Edit the table in the script, never this file. Times are for orientation only: **in code, anchor on the phrase** (`T.G(phrase, 0, after)`; clip slots `T.clip(id)`). '
         'Spoken text: hoerfassung-v2.txt = audio/timing.json. Picture ideas follow text-v2.md [BILD]; on-screen lines are `F.TXT` in lib/f71_kit.mjs.\n')
L.append('## 1 · REGELN §13 as rules for every frame\n')
L.append('- **Every picture shows exactly what its sentence says** (column *zeigt wörtlich*); one motif per sentence with new information; a zoom or pan is never a new motif.')
L.append('- 60–70 % explainer graphics (numbers, waffles, dot fields, scales, tracks and switches, boxes, cards) on THE YARD (lib/f71_kit.mjs), the rest the mornings (SCENARIO), the Leitbild and the clips.')
L.append('- The Leitbild (the twelve doors in the arc on the night plain, you in the yellow coat) ONLY at 4 anchors: hook (H.01–H.02, H.07), turn (8.11–8.13), the golden door (1.01), end (S.24–E.01).')
L.append('- Every change over a carrier object (column *carrier*), no blends; ≤ ~1 hard world change (W) per minute; 1–2 movements at the same time; nothing frozen (still71.py: still < 5 %, no run > 2 s).')
L.append('- 15 s calm end image (E.01) with the lower half free for the end-screen tiles.\n')
L.append('## 2 · Numbers\n')
L.append(f'- **Explainer share (weighted): {share * 100:.1f} %** of the whole film (target 60–70 %); without the clip seconds: **{share_nc * 100:.1f} %**; without clips and the 15 s end screen: **{share_ne * 100:.1f} %**. Weights per second of picture: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0.')
L.append('- Seconds per layer: ' + ' · '.join(f'{k} {v:.0f} s' for k, v in sorted(lay.items(), key=lambda x: -x[1])) + '.')
L.append(f'- **Hard world changes (W): {cuts}** in {dur / 60:.1f} min = {cuts / (dur / 60):.2f}/min (budget ≤ ~1/min). A W is a change of world (yard ↔ Leitbild ↔ morning room) carried by a door; it is not a cut. Real cuts (entry boundaries): c01 has 0.')
L.append(f'- **Motiv neu? (§13.1a): {len(SHOTS) - len(NOT_NEW)} of {len(SHOTS)} shots are a new motif**; the {len(NOT_NEW)} others keep the picture because the sentence adds nothing new ({", ".join(NOT_NEW)}).')
L.append('- The counter HUD (ENDING n/12, RANKING: OURS, NOT TEGMARK\'S, the twelve mini doors, the eye / chip / key pockets) runs by itself (`F.counterHud`, phrases in `F.COUNTER`); never by hand.\n')
L.append('## 3 · Through-lines (plant and harvest)\n')
L.append('| motif | planted | harvested |\n|---|---|---|')
L.append('| the twelve doors (Leitbild) / the gold door | H.01 (the gold door shut), H.07 | 8.11–8.13 (the turn), 2.13 (the only untagged door), 1.01 (it opens), S.24, E.01 |')
L.append('| the kitchen morning (BILLS empty, the neighbours\' windows) | H.03–H.04 | 1.03–1.06 (the morning from the start), 1.07 (the windows become Malta\'s dots) |')
L.append('| the glass pane | H.05 | 10.03, 10.06–10.08 |')
L.append('| WHICH ENDING? | H.07 | S.01 (from above), S.21 (which ending it pushes toward) |')
L.append('| DECIDED THIS YEAR | H.17 | S.25 (line by line), C6 |')
L.append('| the switch tags (one per station) | H.10–H.13 (2026 tags), 12.18–12.19 (JUL 2026, every door a lever) | every station\'s switch tag, 2.09–2.10 (the first PUSHED BACK), 3.01 (three untagged), S.03 (mixed levers) |')
L.append('| the guard eye (+ ?) | 12.28–12.30 (parks at door 4 in the HUD) | 4.11–4.13 (SPOTTED BY AI GUARDS) |')
L.append('| the tracked chip | 9.10–9.13 (parks in the HUD) | 4.14–4.16 (two tracks: door 9 and door 4), S.09–S.10 |')
L.append('| the key | 7.06 (the stranger), 7.10–7.11, M.04 (parks in the HUD) | 6.01, S.14 (who owns what the machines earn) |')
L.append('| the government building | H.13 | 5.08 (UAE: half to agents) |')
L.append('| the HUGGING FACE box | 12.07 | 4.11–4.13 |\n')
L.append('## 4 · Chunks and builders\n')
L.append('| chunk | builder | from (phrase) | start | end | length | explainer share |')
L.append('|---|---|---|---|---|---|---|')
for i, c in enumerate(CHUNKS):
    a = chunk_t[i]; b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    L.append(f'| {c[0]} | {c[1]} | {c[2].replace("#1", " (2nd)")} | {fmt(a)} | {fmt(b)} | {b - a:.1f} s | {per[c[0]][1] / max(1e-6, per[c[0]][0]) * 100:.0f} % |')
grp = {}
for i, c in enumerate(CHUNKS):
    b = chunk_t[i + 1] if i + 1 < len(CHUNKS) else dur
    g = grp.setdefault(c[1], [chunk_t[i], b]); g[1] = b
L.append('\n' + ' · '.join(f'**{k}** {fmt(v[0])}–{fmt(v[1])} ({v[1] - v[0]:.0f} s)' for k, v in grp.items()) + '\n')
L.append('## 5 · Shots\n')
L.append('Columns: ID · anchor (phrase) · t · len · **zeigt wörtlich** (what the sentence says) · **neu?** (§13.1a) · picture (what moves and what it becomes) · layer · carrier → next · flags.')
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
L.append('\n## 6 · Seams between the builders (lib/f71_world.mjs `S.plateRow(ctx, t, T, n)`)\n')
L.append('| seam | phrase | plate | handing side | receiving side |')
L.append('|---|---|---|---|---|')
L.append("| Lead → B1 | The next ending has no morning | plateRow(11): the yard row of twelve at VEND, door 11 lit, its beam on, the pool under it; counter 12/12 with the eye parked at door 4 | 12.30 settles into it (endRamp) | 11.01 opens door 11 out of it |")
L.append("| B1 → B2 | And if nobody can be trusted | plateRow(6): the same row, door 6 lit; key parked in the HUD | M.04 settles into it | 6.01 out of it |")
L.append("| B2 → B3 | Egalitarian Utopia | plateRow(1): the row, the gold door lit, eleven tags on | 2.15 settles into it | 1.01 opens the gold door out of it |")
L.append('\nBoth sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push). Inner chunk boundaries belong to one builder: make them one continuous take. Check: `SECS=c01,c02 node tools/seam.mjs --at <T0>`.\n')
L.append('## 7 · On-screen strings and sources\n')
L.append('Wording: text-v2.md [BILD] lines, as `F.TXT` in lib/f71_kit.mjs (statement ≤ 6 words + one number; the long rest goes into the source line, `F.source`, 22 px at y 880). Text ≥ 22 px; nothing important below y 880 (subtitles).')
L.append('- C1 says "lost control **over** AI systems" (real cut, 25.11.): any on-screen quote uses "over", not "of". Clip lower thirds: `F.CLIPS`; C6 = Max Tegmark · Pro-Human AI event · Sept 2026.')
L.append('- No red warning signs, no ink stamps (switch tags are cream plates), no clock dial (number line), no world maps as heroes (waffles and dot fields), no logos, no real faces outside the clips, no AI images. C3 is reserve only.')
open(os.path.join(HERE, '..', 'docs', 'shots.md'), 'w').write('\n'.join(L) + '\n')
print(f'docs/shots.md: {len(SHOTS)} shots ({len(SHOTS) - len(NOT_NEW)} new motifs), explainer share {share * 100:.1f} % (without clips {share_nc * 100:.1f} %, without clips+end screen {share_ne * 100:.1f} %), W {cuts} ({cuts / (dur / 60):.2f}/min); groups:', {k: round(v[1] - v[0]) for k, v in grp.items()}, 'layers', {k: round(v) for k, v in lay.items()})
print('per chunk:', {c: f'{v[1] / max(1e-6, v[0]) * 100:.0f}%' for c, v in per.items()})
