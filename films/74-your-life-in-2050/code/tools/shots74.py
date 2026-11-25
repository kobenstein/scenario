#!/usr/bin/env python3
"""Film 74 'Your Life in 2050 If We Get AI Right' · shot list (REGELN §13, Jakob 25.11.: "viel 2,5 d szenen", "real diese szenen aus dem ort zeigen").
One row per sentence (clips and the end screen are rows too). Writes docs/shots.md with the numbers computed on the timing file
(real VO <ROOT>audio/timing.json if present, else data/provisional_timing.json).
Types: S = SZENE-2.5D (a real place of the script as parallax layers, light, living figures) · M = MIX (paper card, counter, figures or
type ON a 2.5D scene) · E = EXPL (pure explainer graphic) · C = CLIP. Weights (§13.2): E 1 · M .5 · S 0 · C 0.
#74 deviates from §13.2 on purpose (Jakob 25.11.): the scene share is high; numbers, sources and "back in the twenties" ride on the scenes as MIX.
Columns: id · phrase (first words of the sentence, used to find its time) · type · shows literally · new motif? (y / n = same picture, beat) ·
carrier to the next row · flag (A = leitbild anchor: the same street, * = wow moment of the section).
usage: python3 tools/shots74.py [timing.json]"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); CODE = os.path.dirname(HERE)
ROOT = os.environ.get('F74ROOT', '/mnt/project-files/scenario/film-leben-2050/').rstrip('/') + '/'
TF = sys.argv[1] if len(sys.argv) > 1 else (ROOT + 'audio/timing.json' if os.path.exists(ROOT + 'audio/timing.json') else CODE + '/data/provisional_timing.json')
X = 'carrier'
ROWS = [
# ---- c01 HOOK
('H.01', 'This is your life in', 'M', 'YOUR STREET 2050 in morning light (thumbnail B, right half): apple trees where cars stood, chalk on the road, a white robot on a ladder, you (yellow coat) at your door · 2050: AI WENT RIGHT builds word by word · small tag A UTOPIA · IF WE GET IT RIGHT (0:00–0:05)', 'y', 'the road line', 'A'),
('H.02', 'If we get', 'M', 'same street, IF WE GET AI RIGHT rises under 2050', 'n', 'the road line becomes a timeline', ''),
('H.03', 'Odds are', 'E', 'TIMELINE 2026 → 2050 on the dusk ground; you walk along it, your hair turns grey, the coat stays yellow', 'y', 'the walking figure', ''),
('H.04', 'Superintelligence came', 'E', 'a gold ring lands on the line: SUPERINTELLIGENCE · EARLY 2030s (scenario assumption)', 'y', 'the ring', ''),
('H.05', 'And it went right', 'E', 'the line after the ring turns warm and bright up to 2050; the 2050 dot swells into the morning sun', 'y', 'the sun becomes the bedroom window light', ''),
('H.06', 'You wake up', 'S', 'BEDROOM in daylight (2.5D: window, curtain, bed, nightstand): you sit up; the corner clock starts MONDAY · 8:10 AM', 'y', 'the empty nightstand', ''),
('H.07', 'Nothing woke you', 'S', 'push to the nightstand: a pale ring in the dust where a clock used to stand, a cup, sun on the wall', 'y', 'the ring in the dust', ''),
('H.08', 'Your granddaughter is holding', 'S', 'KITCHEN: your granddaughter (about eight, rust-red coat) lifts a brass alarm clock with two bells out of an old box', 'y', 'the clock face', ''),
('H.09', 'What was this for', 'S', 'close: she holds the clock out to you (her line, no narrator I)', 'y', 'the clock face', ''),
('H.10', 'You try to explain', 'M', 'a paper flashback card unfolds out of the clock face: BACK IN THE TWENTIES (blue-ink line drawing)', 'y', 'the paper card', ''),
('H.11', 'It screamed at you', 'M', 'on the card: the bells shake, a figure rushes out of a door at 6:15 · counter starts: GONE 1 · THE ALARM CLOCK', 'y', 'the door on the card', ''),
('H.12', "She thinks you're joking", 'S', 'kitchen: she laughs, the card folds back into the clock', 'y', 'her look to the window', ''),
('H.13', 'She has never met anyone', 'S', 'through the kitchen window: the street, people stroll, nobody hurries', 'y', 'the window frame', ''),
('H.14', 'So what else about your life', 'M', 'the counter grows big over the hallway: box 1 filled, eight empty boxes up to 9; her look goes to the front door', 'y', 'the front door', ''),
('H.15', 'You open the front door', 'S', 'HALLWAY: the door swings open into bright light', 'y', 'the door opening (portal)', ''),
('H.16', "It's your street", 'S', 'YOUR STREET at eye level (leitbild): row houses left and right, a corner at the end · tag YOUR STREET · 2050', 'y', 'the houses', ''),
('H.17', 'Same houses', 'S', 'beat: the house fronts catch the light one after another', 'n', 'the corner', ''),
('H.18', 'Same corner', 'S', 'beat: the corner house at the end catches the light', 'n', 'the empty kerb', ''),
('H.19', "But there isn't a single", 'M', 'a thin cold line drawing of 2026 lies over the kerb (cars bumper to bumper) and is erased · GONE 2 · PARKED CARS', 'y', 'the empty kerb', ''),
('H.20', 'Where they stood', 'S', 'truck along the kerb: apple trees standing in the old parking bays', 'y', 'the apples', ''),
('H.21', 'Children drawing on the road', 'S', 'two children drawing with chalk in the middle of the road (a sun, a house)', 'y', 'the chalk sun', ''),
('H.22', 'A robot on a ladder', 'S', 'the white robot on a ladder in an apple tree hands apples down to the children', 'y', 'the robot', '*'),
('H.23', "And it's Monday morning", 'M', 'a calendar leaf MONDAY drops into the street; people stroll, nobody rushes', 'y', 'the leaf', ''),
('H.24', 'On this street, work is optional', 'M', 'WORK IS OPTIONAL rises over the street · counter: GONE 1 · THE ALARM CLOCK · HAVING TO WORK', 'y', 'the open garage doors', ''),
('H.25', 'Almost everybody does it anyway', 'S', 'pull back: in open garages and workshops along the street people are at work', 'y', 'the boat shed door', ''),
# ---- c02 work optional
('1.01', 'Your neighbor builds wooden boats', 'S', 'BOAT SHED: your neighbour planes a wooden hull on trestles, shavings curl · card TODAY: POLAND 2026 · 5,000 WORKERS · SAME PAY · ONE DAY LESS', 'y', 'the hull line', ''),
('1.02', 'The man two doors down', 'S', 'MOTORBIKE GARAGE: an old motorbike on a stand, the man shows two teenagers the engine', 'y', 'the wheel', ''),
('1.03', 'And you still do the thing', 'S', 'you at your own workbench in the morning light (drawing board, plans), the coat on the hook', 'y', 'the plan sheet', ''),
('1.04', 'As much as you like', 'E', 'WEEK STRIP MON–SUN: you place your own work blocks; most of the week stays free', 'y', 'the blocks', ''),
('1.05', 'Not one hour more', 'E', 'one extra block slides in and is pushed back out', 'n', 'the blocks', ''),
('1.06', 'The paperwork, the night shifts', 'E', 'three icons (paper stack, night-shift moon, heavy crate) wander from a human hand to a machine ring · card TODAY: AI MATCHES TOP EXPERTS ON 7 IN 10 WORK TASKS (OPENAI TEST)', 'y', 'the machine ring', ''),
('1.07', 'Most economists of your day', 'M', 'paper flashback card 2026: MOST ECONOMISTS EXPECTED PEOPLE WOULD STILL WORK IN 2050 (NBER)', 'y', 'the card', ''),
('1.08', 'They were right', 'M', 'a gold check mark on the card', 'n', 'the check', ''),
('1.09', 'People still work', 'E', 'a work block in your hands', 'y', 'the block', ''),
('1.10', 'Just not for the rent', 'E', 'the RENT slip comes off the work block and flutters away', 'y', 'the slip', ''),
('1.11', 'So what does everybody live on', 'M', 'the street, a big question mark hangs over it', 'y', 'the question mark', ''),
('1.12', 'On what the machines earn', 'M', 'a gold coin rolls out of the machine ring and stops in mid-air', 'y', 'the coin', ''),
('1.13', 'But who gets it', 'M', 'the coin hovers between all the front doors', 'n', 'the coin', ''),
('1.14', 'Fair question', 'M', 'beat: the coin turns', 'n', 'the clock', ''),
('1.15', 'This street answers it at noon', 'M', 'the corner clock twitches forward to NOON and back', 'y', 'the clock', ''),
('1.16', 'First you have to cross it', 'S', 'KERB, low angle: your shoes at the edge of the kerb', 'y', 'the kerb', ''),
('1.17', 'And in your old life, crossing', 'M', 'paper flashback over the kerb: brake lights, a car bonnet in blue ink', 'y', 'the kerb', ''),
# ---- c03 the street
('2.01', 'Now you step off the curb', 'S', 'CROSSING 9:00 AM: your foot steps off the kerb without looking; children play in the middle of the road', 'y', 'the children', ''),
('2.02', 'No parent here has ever shouted', 'M', 'a speech bubble WATCH OUT, CAR! on a paper card is struck through', 'y', 'the bubble', ''),
('2.03', 'The cars still exist', 'S', 'a round, quiet car glides along the street, nobody at the wheel', 'y', 'the car', ''),
('2.04', 'You say where you\'re going', 'E', 'YOUR STREET FROM ABOVE (2.5D aerial): ONE car serves five front doors in turn · beside it 2026: five cars in front of five houses · card TODAY: ROBOTAXIS · HUNDREDS OF THOUSANDS OF DRIVERLESS RIDES A WEEK', 'y', 'the car icon', ''),
('2.05', "You don't own it", 'M', 'an elevator icon beside the car: CALLED · RIDDEN · GONE', 'y', 'the elevator door', ''),
('2.06', 'So the parking spaces became', 'M', 'the aerial street: parking bays fold over into garden beds · card TODAY: PARIS VOTED TO TURN 500 MORE STREETS GREEN AND CAR-FREE (2025)', 'y', 'the beds', ''),
('2.07', 'And the roads stopped killing', 'M', 'over the aerial street: counter TODAY 1.16 MILLION ROAD DEATHS A YEAR (WHO) runs down · GONE 2 · PARKED CARS · ROAD DEATHS', 'y', 'the counter', ''),
('2.08', "It didn't come smoothly", 'M', 'paper flashback card: BACK IN THE TWENTIES', 'y', 'the card', ''),
('2.09', 'Back in the twenties, the first driverless', 'E', 'FREEWAY schema on the card: robotaxis stop at a work zone · TODAY: NOV 2026 · CALIFORNIA\'S REGULATOR ORDERS WAYMO\'S ROBOTAXIS OFF THE FREEWAYS', 'y', 'the freeway', ''),
('2.10', 'A regulator ordered them off', 'E', 'a stamp OFF THE FREEWAYS hits, the taxis leave the lanes', 'y', 'the stamp', ''),
('2.11', 'They had to earn the road back', 'E', 'section by section the lanes light up again, the taxis return', 'y', 'the lane', ''),
('2.12', 'So who keeps a street like this', 'S', 'back on the street: the camera starts to tilt up the house fronts', 'y', 'the roof line', ''),
('2.13', 'Look up', 'S', 'tilt up to the roofs', 'n', 'the roof', ''),
# ---- c04 roof, printed house
('3.01', "There's a robot on your roof", 'S', 'YOUR ROOF 9:30: the robot lays tiles, you stand below with a cup', 'y', 'the tiles', '*'),
('3.02', "Last night's storm took a few tiles", 'S', 'close: the gap in the roof, broken tiles in the gutter, a fallen branch', 'y', 'the gap', ''),
('3.03', 'You reported it at breakfast', 'M', 'a small time line on the scene: BREAKFAST 8:20 → ROBOT 9:05', 'y', 'the line', ''),
('3.04', 'The robot arrived within the hour', 'M', 'the arrow lands: WITHIN THE HOUR', 'n', 'the arrow', ''),
('3.05', 'In your old life, you waited weeks', 'E', 'paper flashback calendar: three weeks crossed out day by day · GONE 3 · WAITING WEEKS FOR A REPAIR', 'y', 'the calendar', ''),
('3.06', 'Then you waited for the bill', 'E', 'at the end of the weeks: an envelope BILL', 'y', 'the envelope', ''),
('3.07', 'And the house across the road', 'S', 'ACROSS THE ROAD: a fresh house; a ghost outline shows the empty lot on day 1', 'y', 'the walls', ''),
('3.08', 'Machines printed the walls', 'M', 'over the house across the road, NINE TILES DAY 1 … DAY 9: a print gantry lays wall layers, robots fit windows and roof', 'y', 'tile 9', ''),
('3.09', 'A young couple moved in', 'S', 'DAY 10: a young couple carries boxes through the new door', 'y', 'the door', ''),
('3.10', 'Land still costs', 'M', 'two tags on the house: LAND stays the same size', 'y', 'the tags', ''),
('3.11', 'The house on it barely does', 'M', 'the HOUSE tag shrinks to almost nothing · card TODAY: 3D-PRINTED HOUSE WALLS · ABOUT 40% CHEAPER (COMPANY CLAIM, 2026)', 'n', 'the tags', ''),
('3.12', 'So machines build, mend and drive', 'M', 'on the street (roof robot, the new house, the car): BUILD · MEND · DRIVE tick off in a row, a fourth box YOU stays empty', 'y', 'the empty box', ''),
('3.13', 'What is left for you', 'M', 'the empty box YOU with a question mark', 'n', 'the empty box', ''),
('3.14', 'Back in the twenties, even the head', 'M', 'an old flat screen leans against the garden wall and becomes a frame (carrier for all three clips)', 'y', 'the screen frame', ''),
('C3', None, 'C', 'ORIGINAL FOOTAGE · DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · 2026: "…We don\'t know. Nobody knows." Grows out of the old screen and back', 'y', 'the screen', ''),
('3.15', 'And he was building the machines', 'M', 'the frame tips back against the wall; the box YOU is still empty on it', 'y', 'the wall', ''),
('3.16', 'The answer waits on the town square', 'S', 'far at the end of the street: the town square, a price tag turned away', 'y', 'the square', ''),
('3.17', 'But machines like these run day', 'E', 'DAY · NIGHT band, machine rings keep turning through the night', 'y', 'the band', ''),
('3.18', 'So somebody must be paying', 'E', 'an old power meter spins up, an envelope POWER BILL swells', 'y', 'the envelope', ''),
# ---- c05 energy
('4.01', 'Nobody is', 'E', 'the envelope crumbles into gold dust · GONE 4 · THE POWER BILL · clock 11:00 AM', 'y', 'the dust becomes sunlight', ''),
('4.02', 'Your granddaughter has never seen', 'S', 'the granddaughter turns an old bill over in her hands, puzzled', 'y', 'the paper', ''),
('4.03', 'Every roof on the street makes', 'S', 'ROOFTOPS from above: every roof is a solar roof; light runs from the roofs into the street', 'y', 'the light line', '*'),
('4.04', 'Batteries carry it through the night', 'S', 'a battery house at the end of the street fills up, the sky turns to night and the windows stay lit', 'y', 'the stored light', ''),
('4.05', 'And beyond the hills, a fusion', 'S', 'BEYOND THE HILLS: a fusion plant (dome and ring), thick lines run to the machines · card PLANNED TODAY: THE FIRST FUSION POWER PLANT · EARLY 2030s', 'y', 'the ring', ''),
('4.06', 'Power is like air now', 'S', 'the workshop: the granddaughter leaves every light on and runs out, nobody calls after her', 'y', 'the door', ''),
('4.07', 'You use it', 'S', 'beat: the lamps glow on', 'n', 'the meter on the wall', ''),
('4.08', "You don't count it", 'S', 'the old meter is unscrewed from the wall', 'y', 'the meter disc', ''),
('4.09', 'And when power costs almost nothing', 'M', 'over the sunny street: chain POWER → WATER · FOOD · HOMES, each link lights up', 'y', 'the water drop', ''),
('4.10', 'Drinking water, straight from the sea', 'S', 'SEA: a desalination plant on the coast, a pipe, a tap in your kitchen', 'y', 'the drop', ''),
('4.11', 'The oranges in your kitchen grew', 'S', 'GREEN DESERT: orange trees on old dunes; an atlas page on top shows the yellow patch turning green', 'y', 'an orange', ''),
('4.12', 'The first sign came in your day', 'E', 'MAP OF AUSTRALIA, three regions light; a 24-hour dial with three free hours · TODAY: AUSTRALIA · 3 FREE HOURS OF POWER A DAY', 'y', 'the dial', ''),
('M.01', 'This channel exists for one reason', 'M', 'YOUR STREET wide at late morning (leitbild): counter rows 1–4 ticked; a subscribe button hangs in the street like a shop sign', 'y', 'the corner clock', 'A'),
('M.02', 'Want that too', 'M', 'beat: the button is pressed, its light runs along the street', 'n', 'the clock tower', ''),
# ---- c06 money
('5.01', 'But nobody lives on free power', 'S', 'THE TOWN SQUARE at noon: the clock tower, fountain, houses around', 'y', 'the clock face', ''),
('5.02', 'So who gets what the machines earn', 'S', 'beat: the hands move to twelve', 'n', 'the clock', ''),
('5.03', 'Noon', 'S', 'the clock strikes 12:00 NOON', 'n', 'the bell', ''),
('5.04', 'The whole street chimes at once', 'S', 'in every house of the street a point lights up at the same moment, chime rings spread', 'y', 'the lit points', '*'),
('5.05', 'Dividend day', 'M', 'DIVIDEND DAY in big type over the square, bunting', 'y', 'the type', ''),
('5.06', 'Everyone here just received a share', 'M', 'THE STREET AT NOON: flow MACHINES → one pot → equal circles to every door', 'y', 'the circles', ''),
('5.07', 'You too', 'M', 'your door (yellow) gets its circle', 'n', 'your circle', ''),
('5.08', 'The same share, in the biggest house', 'M', 'the biggest house and the smallest flat side by side, the same circle', 'y', 'the circle', ''),
('5.09', 'In your old life, the end of the month', 'E', 'MONTH CALENDAR, left 2026: the account bar drains to the 30th · GONE 5 · FEAR OF THE END OF THE MONTH', 'y', 'the 30th', ''),
('5.10', "Here, it's when the money arrives", 'E', 'right 2050: on the same day the bar fills', 'n', 'the bar', ''),
('5.11', 'It was never guaranteed', 'M', 'paper flashback card BACK IN THE TWENTIES at the fountain', 'y', 'the card', ''),
('5.12', 'Back in the twenties, that same lab chief', 'M', 'the old screen again, now at the fountain', 'y', 'the screen', ''),
('5.13', 'Listen to how sure he sounds', 'M', 'beat: the screen lights', 'n', 'the screen', ''),
('C4', None, 'C', 'ORIGINAL FOOTAGE · DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · DAVOS 2026: "…I don\'t know if we have the right institutions…"', 'y', 'the screen', ''),
('5.14', "He didn't know", 'E', 'I DON\'T KNOW stays as type and tips away', 'y', 'the type', ''),
('5.15', 'And it was never his to decide', 'E', 'beat: the type falls', 'n', 'the map', ''),
('5.16', 'Countries decided, one vote', 'E', 'WORLD MAP: ballots drop into one country after another', 'y', 'the ballot', ''),
('5.17', 'Taiwan planned', 'E', 'Taiwan lights up · TODAY: TAIWAN PLANS AN "AI DIVIDEND" FOR EVERY CITIZEN', 'y', 'the island', ''),
('5.18', 'Did the companies just hand it over', 'E', 'a company gate, shut', 'y', 'the gate', ''),
('5.19', 'No', 'E', 'beat: the gate stays shut', 'n', 'the gate', ''),
('5.20', 'Nobody counted on kindness', 'E', 'beat', 'n', 'a curve', ''),
('5.21', 'In South Korea, the mere suggestion', 'E', 'STOCK CURVE dips · TODAY: SOUTH KOREA, MAY 2026 · "NATIONAL DIVIDEND" FLOATED · STOCKS FALL UP TO 5.1%', 'y', 'the curve', ''),
('5.22', 'And the investors had a point', 'E', 'a scale: TOO MUCH, TOO EARLY against half-built machines that never get finished', 'y', 'the machine', ''),
('5.23', 'So nothing was seized', 'E', 'one machine with two owner tags: COMPANY · COUNTRY', 'y', 'the tags', ''),
('5.24', 'Countries took a share', 'E', 'beat: the COUNTRY tag takes its slice', 'n', 'the slice', ''),
('5.25', 'Some pay it out', 'E', 'column DIVIDEND, your street drops in', 'y', 'the column', ''),
('5.26', 'Others just made the basics free', 'E', 'column FREE BASICS: bus, water, power · TODAY: LUXEMBOURG · ALL PUBLIC TRANSPORT FREE SINCE 2020', 'y', 'the bus', ''),
('5.27', "That's why you no longer lie awake", 'M', 'paper flashback: your old kitchen table at night, columns of figures and a calculator, wiped away', 'y', 'the table', ''),
('5.28', 'And if nobody has to earn a living', 'E', 'TWELVE rows of school chairs, 12 YEARS', 'y', 'the chairs', ''),
# ---- c07 school, bakery
('6.01', 'Nobody does', 'S', 'the old BUS STOP is a bench under a tree; the school bell hangs still · GONE 6 · THE CLASSROOM · clock 1:00 PM', 'y', 'the bench', ''),
('6.02', "There's no school bus", 'S', 'beat: the empty road', 'n', 'the bell', ''),
('6.03', 'No bell', 'S', 'the silent bell, a bird on it', 'y', 'the bird', ''),
('6.04', 'No rows of desks', 'M', 'a blue-ink line drawing of desks facing a board is struck through', 'y', 'the board', ''),
('6.05', 'In the mornings, your granddaughter learns', 'S', 'GARDEN TABLE: the granddaughter learns with a ring of light on the table (the machine as a circle), it waits for her', 'y', 'the light ring', ''),
('6.06', 'The richest child on Earth', 'M', 'two garden tables side by side, one in front of a villa, one in front of a small flat, the same light ring', 'y', 'the rings', ''),
('6.07', 'Even in your day, the free', 'E', 'two lines BEST and FREE almost on top of each other, gap MONTHS · TODAY: FREE-TO-DOWNLOAD AI MODELS · ABOUT 4 MONTHS BEHIND THE BEST (EPOCH AI, 2026)', 'y', 'the gap', ''),
('6.08', 'Every afternoon, the children pile', 'S', 'THE OLD SCHOOL BUILDING, gates open, children run in · clock 2:00 PM', 'y', 'the gate', '*'),
('6.09', "It's a workshop now", 'S', 'inside: benches, tools, a hull on trestles', 'y', 'the hull', ''),
('6.10', 'Your neighbor, the boat builder', 'S', 'children around the hull, the boat builder shows the plane', 'y', 'the plan', ''),
('6.11', 'A machine can teach her fractions', 'M', 'the light ring draws a fraction pie: FRACTIONS · MACHINE', 'y', 'the pie', ''),
('6.12', 'Only other children can teach her', 'M', 'two children argue over the plan, one gives in, both laugh: LOSING AN ARGUMENT · CHILDREN', 'y', 'the door', ''),
('7.01', "Next door, the doctor's waiting room", 'S', 'BAKERY: the sign WAITING ROOM half painted over, bread shelves where chairs stood', 'y', 'the bread', ''),
('7.02', 'People are rarely ill for long', 'S', 'people come in and out with bread', 'n', 'the box', ''),
('7.03', 'And health insurance is one more', 'M', 'the old box: an insurance card lies next to the alarm clock · GONE 7 · THE WAITING ROOM · HEALTH INSURANCE', 'y', 'the card', ''),
# ---- c08 decades, moon, orbit
('8.01', "But the biggest thing missing", 'M', 'the street at 4 PM, a place pin over it is crossed out · clock 4:00 PM', 'y', 'the pin', ''),
('8.02', "It's a sentence", 'M', 'beat: the pin turns into quotation marks', 'n', 'the marks', ''),
('8.03', 'That will take decades', 'E', '"THAT WILL TAKE DECADES." as heavy type · GONE 8', 'y', 'the type', ''),
('8.04', 'Every big hope came with it', 'E', 'beat: three cards stand up', 'n', 'the cards', ''),
('8.05', 'Fusion power', 'E', 'card FUSION POWER, stamp DECADES', 'y', 'card', ''),
('8.06', 'A cure', 'E', 'card A CURE, stamp DECADES', 'y', 'card', ''),
('8.07', 'A town on the Moon', 'E', 'card A TOWN ON THE MOON, stamp DECADES', 'y', 'card', ''),
('8.08', 'Decades', 'E', 'beat: the three stamps', 'n', 'the stamps', ''),
('8.09', 'Your granddaughter has never heard', 'M', 'the stamps fall off the cards', 'y', 'the bar', ''),
('8.10', 'A year of research now does', 'E', 'a bar DECADE shrinks to YEAR · TODAY: AN AI BEATS A MATH RECORD FROM 1969', 'y', 'the moon card turns', ''),
('8.11', 'The town on the Moon is older', 'S', 'THE MOON TOWN: domes with lit windows on grey regolith, Earth in the sky · FOUNDED 2041', 'y', 'the Earth', '*'),
('8.12', 'Last weekend, she was in orbit', 'S', 'ORBIT: a station window, Earth small and blue below', 'y', 'the window', '*'),
('8.13', 'Not as an astronaut', 'S', 'beat: no suit, a jumper', 'n', 'the window', ''),
('8.14', 'With you, for her birthday', 'S', 'you and her float at the window, a birthday candle floats', 'y', 'the candle', ''),
('8.15', 'Ships come home to their towers', 'S', 'a ship settles on its tower the way a plane pulls up to a gate · TODAY: A SPACESHIP CAUGHT BY ITS LAUNCH TOWER', 'y', 'the tower', ''),
('8.16', 'She says the Earth looked small', 'S', 'her hand at the window: the Earth fits between thumb and finger', 'y', 'the Earth', ''),
('8.17', 'Back in the twenties, the same lab chief put', 'M', 'the old screen a third time, on a bench', 'y', 'the screen', ''),
('8.18', 'He had something to sell', 'E', 'a flat curve ECONOMISTS · 2026: EVEN WITH RAPID AI, ECONOMISTS EXPECT ABOUT 4% GROWTH A YEAR', 'y', 'the screen', ''),
('C1', None, 'C', 'ORIGINAL FOOTAGE · DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · 2026: "…over a decade instead of a century."', 'y', 'the screen', ''),
('8.19', 'In this version of twenty fifty', 'E', 'two curves LAB CHIEF · ECONOMISTS; the 2050 mark of this story lies near his', 'y', 'the path', ''),
('8.20', 'But one thing still takes decades', 'S', 'EVENING PATH: you walk past the last house', 'y', 'the last house', ''),
('8.21', 'You can see it past the last house', 'S', 'beat: behind it, young trees', 'n', 'the trees', ''),
# ---- c09 forest, square
('9.01', 'Where the cornfields ran', 'S', 'YOUNG FOREST to the horizon; a map card shows the field grid of 2026 · GONE 9 · FIELDS TO THE HORIZON · clock 6:00 PM', 'y', 'the map', ''),
('9.02', 'Food grows closer to town', 'E', 'map: the field grid draws together round the town, the rest turns to forest', 'y', 'the river line', ''),
('9.03', 'The river is clean enough', 'S', 'RIVER in evening light, people swimming', 'y', 'the hill', ''),
('9.04', 'And some evenings, from the hill', 'S', 'a wolf on the hill against the sky · TODAY: EUROPE\'S WOLVES · UP 58% IN TEN YEARS', 'y', 'the path', '*'),
('P.01', 'The path loops back', 'S', 'the path turns back into YOUR STREET at dusk, the square at its end (leitbild)', 'y', 'the empty box YOU', 'A'),
('P.02', 'So what is left for you', 'M', 'the empty box YOU from station 3 hangs over the street', 'y', 'the box', ''),
('P.03', 'Look around', 'S', 'THE SQUARE in the evening, lanterns, tables, full of people · clock 7:30 PM', 'y', 'the tables', '*'),
('P.04', "It's full, like every evening", 'S', 'beat: more people arrive', 'n', 'the chair', ''),
('P.05', 'The man with the motorbikes', 'S', 'the motorbike man sands a chair', 'y', 'the dumplings', ''),
('P.06', "Somebody's grandmother", 'S', 'a grandmother folds dumplings with children', 'y', 'the price tags', ''),
('P.07', 'You expected a world like this', 'M', 'over the square: paper flashback card, the fear of 2026, a world without use for people (empty chair)', 'y', 'the tags', ''),
('P.08', 'It went the other way', 'M', 'beat: the card turns', 'n', 'the tags', ''),
('P.09', 'Machines can make almost anything', 'M', 'on the square: PRICE TAGS HOUSE · POWER · WATER · A RIDE fall towards zero', 'y', 'the tags', ''),
('P.10', "They can't make another person's time", 'M', 'one tag stays: SOMEBODY\'S TIME', 'y', 'the tag', ''),
('P.11', 'So that is the one thing', 'M', 'it rises: NOW SCARCE: SOMEBODY\'S TIME', 'n', 'the plate', ''),
('P.12', 'A meal cooked for you', 'S', 'a plate is set down in front of you', 'y', 'the chair', ''),
('P.13', "A chair with a person's mistakes", 'S', 'the chair with the crooked back', 'y', 'the door', ''),
('P.14', 'Someone who shows up', 'S', 'someone comes through the door and waves', 'y', 'the tables', ''),
('P.15', 'Is that enough to fill a life', 'M', 'a question mark over the square', 'y', 'the mark', ''),
('P.16', 'Nobody on this square claims', 'S', 'beat: two tables', 'n', 'the tables', ''),
('P.17', 'They argue about it most evenings', 'S', 'two tables argue and laugh', 'y', 'the mark', ''),
('P.18', 'It may be the one question', 'M', 'the question mark stays over the square, lit', 'n', 'the bench', ''),
# ---- c10 resolution
('E.01', 'Your granddaughter sits down beside you', 'S', 'THE BENCH: she sits down beside you, the clock in her hand', 'y', 'the clock', ''),
('E.02', 'She has never heard it ring', 'S', 'she holds it to her ear: nothing', 'y', 'the clock', ''),
('E.03', 'But she has worked something out', 'S', 'she looks up at you', 'n', 'her face', ''),
('E.04', 'What else did you worry about', 'S', 'close on her (her line)', 'y', 'the counter', ''),
('E.05', 'You try to explain', 'M', 'the nine GONE lines curl into the border of an old sea chart', 'y', 'the chart', ''),
('E.06', 'Losing the job', 'M', 'sea monster 1: a dismissal letter with fins', 'y', 'monster', ''),
('E.07', "The bill you couldn't pay", 'M', 'sea monster 2: a bill with teeth', 'y', 'monster', ''),
('E.08', 'A car you never saw coming', 'M', 'sea monster 3: a pair of headlights', 'y', 'monster', ''),
('E.09', "Whether there'd still be a place", 'M', 'sea monster 4: an empty chair', 'y', 'monster', ''),
('E.10', 'She listens the way', 'M', 'the chart full, she listens, chin on hands', 'n', 'the chart edge', ''),
('E.11', 'In twenty fifty, the hardest thing', 'M', 'THE CORE SENTENCE word by word over the square at dusk', 'y', 'the word WORRY', ''),
('E.12', 'None of it was a gift', 'E', 'the timeline runs back from 2050 to NOW', 'y', 'NOW', ''),
('E.13', 'Back in the twenties, every time', 'E', 'four TODAY cards as a grid (PARIS · AUSTRALIA · CALIFORNIA · TAIWAN), above them WHO IS THIS FOR?', 'y', 'the question', ''),
('E.14', 'And labs, governments and voters', 'E', 'three addressees LABS · GOVERNMENTS · VOTERS', 'y', 'the field', ''),
('E.15', 'That question is being asked', 'E', 'NOW blinks', 'n', 'the field', ''),
('E.16', "It isn't settled", 'E', 'the field ANSWER stays empty', 'y', 'the field', ''),
('E.17', 'This channel exists so that the answer', 'M', 'the field fills: EVERYBODY, over the square at dusk', 'y', 'the button', ''),
('E.18', 'Want superintelligence to go well', 'M', 'subscribe button over the square', 'n', 'the clock', ''),
('E.19', 'She winds the old clock', 'S', 'YOUR STREET at the square, dusk (leitbild): she winds the clock, it rings', 'y', 'the bells', 'A'),
('E.20', 'Nobody flinches', 'S', 'nobody flinches, people keep talking', 'n', 'the children', ''),
('E.21', "The children think it's music", 'S', 'the children dance to the ringing', 'y', 'the dancing', ''),
('END', None, 'S', 'END SCREEN 15 s: the square at dusk, music and picture run on, the clock rings into the music, the children dance; the counter fades; end cards', 'y', '', ''),
]
CHUNKS = [('c01', 'H.01', 'Hook: street, timeline, bedroom, kitchen, clock, door, your street'), ('c02', '1.01', 'Work optional: boat shed, motorbikes, your bench, week strip, rent'),
          ('c03', '2.01', 'Crossing, the car, top view, road deaths, freeway'), ('c04', '3.01', 'Roof robot, printed house, BUILD MEND DRIVE, C3, power bill'),
          ('c05', '4.01', 'Solar roofs, batteries, fusion, sea water, oranges, Australia, subscribe 1'), ('c06', '5.01', 'Noon chime, dividend day, C4, countries, co-owner'),
          ('c07', '6.01', 'No school bus, garden teacher, old school = workshop, bakery'), ('c08', '8.01', 'Decades, moon town, orbit, C1, curves'),
          ('c09', '9.01', 'Forest, river, wolves, square in the evening, somebody\'s time'), ('c10', 'E.01', 'Bench, sea monsters, core sentence, who is this for, subscribe 2, the clock rings, end screen')]
W = {'E': 1.0, 'M': .5, 'S': 0.0, 'C': 0.0}
NAME = {'S': 'SZENE-2.5D', 'M': 'MIX', 'E': 'EXPL', 'C': 'CLIP'}

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())
def times(tf):
    TM = json.load(open(tf)); ws = TM['words']; clips = {c['id']: c for c in TM.get('clips', [])}
    out, after = [], -1
    for r in ROWS:
        rid, ph = r[0], r[1]
        if rid in clips: out.append(clips[rid]['start']); after = clips[rid]['end']; continue
        if rid == 'END': out.append(TM['duration'] - 15.0); continue
        q = [norm(x) for x in ph.split()]; hit = None
        for i in range(len(ws) - len(q) + 1):
            if ws[i]['s'] < after - 1e-3: continue
            if all((norm(ws[i + j]['w']) == p) if j < len(q) - 1 else norm(ws[i + j]['w']).startswith(p) for j, p in enumerate(q)): hit = ws[i]['s']; break
        if hit is None: raise SystemExit(f'phrase not found: {rid} "{ph}" after {after:.1f}')
        out.append(hit); after = hit
    return out, TM['duration'], TM.get('provisional', False)

def main():
    st, dur, prov = times(TF)
    # a row's picture runs from its sentence start (minus the .35 s lead of the transition) to the next row
    a = [0.0] + [max(0, s - .35) for s in st[1:]]
    b = a[1:] + [dur]
    L = [y - x for x, y in zip(a, b)]
    sec = {k: 0.0 for k in W}
    for r, l in zip(ROWS, L): sec[r[2]] += l
    share = sum(W[k] * v for k, v in sec.items()) / dur * 100
    new = sum(1 for r in ROWS if r[4] == 'y'); anchors = [r[0] for r in ROWS if r[6] == 'A']
    ft = lambda x: f'{int(x // 60)}:{x % 60:04.1f}'
    o = ['# Film 74 · "Your Life in 2050 If We Get AI Right" · shot list (binding, one row per sentence)', '',
         f'Generated by `tools/shots74.py` from `{os.path.basename(TF)}`{" (PROVISIONAL timing from vo-v2/v3, the real VO replaces it)" if prov else " (real VO)"}, duration {dur:.1f} s. Edit the table in the script, never this file. **Code anchors on phrases, never on seconds.**', '',
         '## 1 · Numbers (REGELN §13.2, computed before animating)', '',
         f'- **Explainer share (weighted): {share:.1f} %.** #74 deviates from §13.2 (60–70 %) on purpose: Jakob 25.11. "in dem fall viel 2,5 d szenen" + "real diese szenen aus dem ort zeigen um die es im script geht". Numbers, sources and "back in the twenties" ride on the scenes as MIX (paper cards, counter, clock).',
         '- Seconds by type: ' + ' · '.join(f'{NAME[k]} {v:.0f} s ({v / dur * 100:.0f} %)' for k, v in sorted(sec.items(), key=lambda kv: -kv[1])),
         f'- **Scene share (SZENE-2.5D + MIX on a scene): {(sec["S"] + sec["M"]) / dur * 100:.0f} %** of the picture shows a real place of the script.',
         f'- Rows: {len(ROWS)} · new motifs: {new} · leitbild anchors (the same street): {len(anchors)} ({", ".join(anchors)}) · wow moments (*): {sum(1 for r in ROWS if r[6] == "*")}.',
         '- Hard cuts planned: 0 (every boundary is a carrier: portal through a window/door/frame, iris out of a shape, a near layer of the 2.5D scene sweeping past the lens, or a paper card unfolding from an object). Clips grow out of the old screen and return into it.', '',
         '## 2 · Chunks', '', '| chunk | from | start | contents |', '|---|---|---|---|']
    idx = {r[0]: i for i, r in enumerate(ROWS)}
    for c, first, txt in CHUNKS: o.append(f'| {c} | {first} | {ft(st[idx[first]])} | {txt} |')
    o += ['', '## 3 · Shots', '', '| ID | t | len | Satz | Typ | zeigt wörtlich | Motiv neu? | Träger → nächstes | |', '|---|---|---|---|---|---|---|---|---|']
    TM = json.load(open(TF)); ws = TM['words']
    for i, r in enumerate(ROWS):
        if r[1] is None: sent = '[' + r[0] + ']' if r[0] != 'END' else '[end screen]'
        else:
            s0 = st[i]; j = next(k for k, w in enumerate(ws) if abs(w['s'] - s0) < 1e-6); words = []
            while j < len(ws):
                words.append(ws[j]['w']);
                if re.search(r'[.?!]["”]?$', ws[j]['w']): break
                j += 1
            sent = ' '.join(words)
        o.append(f'| {r[0]} | {ft(st[i])} | {L[i]:.1f} | {sent} | {NAME[r[2]]} | {r[3]} | {"yes" if r[4] == "y" else "no (beat)"} | {r[5]} | {r[6]} |')
    o += ['', '## 4 · Nicht wiederholen', '',
          '- **#23 "A Day in 2037" (Erster Tag 2037):** the street in SECTION at night (cut-away floors), the kitchen light wall, the tutor voice-light on the wall, ear buds, the scan at the doctor, the tutor that refuses answers, "like libraries", the kid asking "Why did it go well?", night interiors. #74 is DAYLIGHT, the street seen at eye level as a place, the learning machine is a ring of light on a garden table.',
          '- **#73 Won\'t Die:** immortality, brain copy → the bakery row is one breath, no diagnosis, no lifespan numbers.',
          '- **#66 / #27 / #64 (money):** price tags as a long land, receipts, pay slips, the dollar bar → the money station uses circles to doors and a month calendar, no amounts.',
          '- **#63 Pope:** the machine block, the slot, the scale as leitbild, the kitchen at night. **#67:** headline sky, chalkboard, paper tower. **#59:** crystal, bell, stamps (the stamp DECADES is a rubber stamp on paper, not #59\'s seal). **#54:** the great hall. **#16:** research tempo as more than one picture (here only the DECADE→YEAR bar).',
          '- **Older:** the big clock as a symbol of time (#20 Altern): the alarm clock here is a prop in the girl\'s hand, never a giant clock symbol; hourglass, server rack, brains, matrix code.']
    open(os.path.join(CODE, 'docs', 'shots.md'), 'w').write('\n'.join(o) + '\n')
    print(f'{len(ROWS)} rows · explainer share {share:.1f} % · scene+mix {(sec["S"] + sec["M"]) / dur * 100:.0f} % · S {sec["S"]:.0f}s M {sec["M"]:.0f}s E {sec["E"]:.0f}s C {sec["C"]:.0f}s · new {new} · anchors {anchors}')
    json.dump([{'id': r[0], 'phrase': r[1], 'type': r[2], 't': st[i]} for i, r in enumerate(ROWS)], open(os.path.join(CODE, 'data', 'rows.json'), 'w'))
if __name__ == '__main__': main()
