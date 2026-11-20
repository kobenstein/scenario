#!/usr/bin/env python3
"""Film 19 shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film order), never to a second.
  python3 tools/shots19.py [timing.json] [--md docs/shots.md]   prints the chunk table + the weighted explainer share, writes the shot list.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (the paper-cut theatre: layers lifted off the sheet, figures, one light) · EXPL (explainer: ink and light ON the sheet) ·
SCENE>EXPL / EXPL>SCENE (the shot holds the lift-off / lay-down; counts half) · CLIP (ORIGINAL FOOTAGE in a frame; counts as neither).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; a CLIP shot starts at its
clip slot (timing.json clips[]). Anchors are searched after the shot start. Scene code uses the same phrases: T.G(phrase, 0, after).
Explainer share (Jakob, binding 60-70 %): weighted over the ANIMATED runtime = film duration minus the clip slots (the end screen counts
as SCENE); also printed over the full runtime with the clips counted as 0."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-singularity-friday/audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
CLIPS = {c['id']: c for c in TM.get('clips', []) if c.get('kind', 'clip') == 'clip'}
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

def gfind(phrase, after=-1.0, nth=0):
    q = [norm(p) for p in phrase.split() if norm(p)]; hit = 0
    for i in range(len(WS) - len(q) + 1):
        if WS[i]['s'] < after - 1e-3: continue
        if all((norm(WS[i + j]['w']).startswith(p) if j == len(q) - 1 else norm(WS[i + j]['w']) == p) for j, p in enumerate(q)):
            if hit == nth: return WS[i]['s']
            hit += 1
    raise SystemExit(f'phrase not found after {after:.2f}: "{phrase}"')

# ---------------------------------------------------------------------------------------------------------------------------------
# chunks: id, builder, title, first phrase, light / hero
CHUNKS = [
    ('c01', 'Lead', 'Hook · the line that aimed at Friday · ahead of schedule · the bend · the second line', 'The singularity was predicted', 'The sheet (1960 graph paper, the Science page) under the lamp · hero: the gold ink line racing to FRI 13 NOV → ★ the cool light line shooting off the page'),
    ('c02', 'B1', 'What bent it? · not war, not famine · THE LOOP · C1 von Foerster · straight up · the machine loop', 'So what bent the first line', 'Ink on the sheet: the question card at the knee → the loop wheel beside the steep gold line → the clip frame inside the loop → the cool loop beside the light line'),
    ('c03', 'B1', 'The loop broke · the family tree (doctor, school, plan) · ≈ 5 → ≈ 2 · MORE CHOICES · no family tree for machines', 'But the human loop broke', 'The torn arrow → ★ the family tree lifts off as a paper-cut theatre (three lit windows) → lays down into the kids-per-woman row → the card at the cool line, FRI ?'),
    ('c04', 'B1', 'The stopwatch: real tasks, a skilled person, the machine alone · C2 METR · doubling · one working day', 'To find out', 'Paper-cut desk under the stopwatch (hero: the cool screen) → the task bar on the sheet doubles → ★ the hourglass ONE WORKING DAY, coffee to coat'),
    ('c05', 'B1', 'Steady doubling vs. the old formula · ★ the ghost on tracing paper · C3 researchers on recursive self-improvement (placeholder)', "That's fast", 'Ink stairs on the sheet: cool even steps vs. gold steps that narrow to a date → ★ the 1960 curve on tracing paper laid over the light line → the blank calendar slip becomes the clip frame'),
    ('c06', 'B2', 'A date sounds precise · late 2026 · ★ a birthday (Vienna, 1911, 115) · a wink · projection, not forecast · the GPS · can we change the route?', 'A date sounds precise', 'The calendar slip → the asymptote bracket LATE 2026 → ★ the candle 115 (warm hero) beside the index card and a silhouette → the 1960 subtitle, IF ringed → the car at night, the GPS screen → the route = the light line'),
    ('c07', 'B2', 'See it: the fogged windshield · counted people · the public stopwatch · hype vs. panic · the ruler that is too short · measure like weather', 'Only if we can see it', 'Car interior, fog wiped off (hero: the clear patch) → census slips build the gold line → the public chart → ★ the kid outgrows the ruler at the doorframe → the ruler lies down as a tape along the light line, the weather strip'),
    ('c08', 'B2', 'Seeing isn\'t steering · for everyone? · a working day of help in your hands · the velvet rope falls', "But seeing the road isn't steering", 'The clear windshield, the empty wheel → the hourglass pours into your hands (contract, bill, napkin) → ★ the expert\'s door: the rope drops, the light floods out → into the light: the empty wheel'),
    ('c09', 'B3', 'A few hands on a heavy wheel · eight billion · billions of family decisions · use, refuse, vote · shiny: bigger or smaller?', 'Right now, though', 'The huge wheel in a quiet room, a few hands (hero: the tall window) → ★ eight billion lights behind it → the gold line made of tiny arrows → your kitchen table, phone, ballot → the shop window'),
    ('c10', 'B3', 'A test (1973) · options vs. choices · hold the rule up · say no · the tutor passes, the form fails', 'To tell bigger from smaller', 'The candle 115 lights the 1973 card (the quote writes itself) → OPTIONS struck, CHOICES circled → the screen of buttons vs. your own line → ★ the card held up like a gauge → tutor ✓ / form ✗'),
    ('c11', 'B3', 'Human hands · the next bend you can see coming · your answer · subscribe · ∞ vs. 8 billion · a checkpoint · Happy birthday, Heinz + end screen', "The test isn't how smart", 'The light line held by many hands → you at the knee, CURVE AHEAD → cards of answers → the slip with the candle, ∞ / ≈ 8 BILLION → ★ the whole sheet under the lamp, both lines, the candle'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook (Lead) ===========================================================================================================
shot('1.01', 'EXPL', 'The singularity was predicted', ['predicted', 'this Friday', 'November thirteenth'],
     '**[THE SHEET · opening image, thumbnail motif]** Hard start mid-motion, close: a **gold ink line** races up a steepening curve on 1960 graph paper, the wet nib head leading (blot + glint). Ahead, pinned on the paper, the **calendar slip** `FRI · 13 · NOV · 2026` (a lifted paper block, soft shadow). On **this Friday** the slip trembles once as the line nears (anticipation); on **November thirteenth** the line goes vertical right under it and stops a hair short. The lamp pool sits on the slip.',
     '① the ink head races ② the slip trembles', 'plan sequence')
shot('1.02', 'EXPL', 'Not by a prophet', ['formula', 'Science', 'nineteen sixty'],
     'Pull back: the curve is a chart printed on **the Science page**: masthead `SCIENCE`, `4 NOVEMBER 1960`, the title `Doomsday: Friday, 13 November, A.D. 2026` (italic serif) and `VON FOERSTER · MORA · AMIOT`. On **formula** the caption `THE FORMULA · FIT TO 24 ESTIMATES` rises under the curve; on **nineteen sixty** the 1960 tick on the x-axis gets a gold ink ring.',
     '① pull back ② the formula traces', 'plan sequence')
shot('1.03', 'EXPL', "And it wasn't about machines", ['machines', 'Not yet', 'about us', 'infinity', 'Right about now'],
     'On **machines** a faint cool glint runs up the curve and dies on **Not yet** (the cool light\'s first, failed appearance). On **about us** tiny ink people stand up along the curve, shoulder to shoulder, denser as it climbs (the line is people); the axis label `PEOPLE ON EARTH` rises. On **infinity** a gold `∞` is written beside the slip; on **Right about now** a cream pencil tick `NOW` lands under 2026.',
     '① the people fill the curve ② ∞ is written', 'plan sequence')
shot('1.04', 'SCENE>EXPL', 'Sounds crazy', ['for decades', 'schedule', 'ahead of it', 'born ahead'],
     'The curve\'s people sink into it and it turns **dashed** (the formula = the schedule). Truck to 1950–2000, closer. On **for decades** the **real line** draws in solid gold ink from 1950 right on the dashes; on **ahead of it** it lifts a hair above them (a small bracket `AHEAD`). On **born ahead** a yellow dot lands on the gold line around 1980 and grows into **you** (tiny, yellow raincoat, faceless), standing on the ink line as on a ridge (the first lift-off).',
     '① the real line draws ② you stand up', 'plan sequence')
shot('1.05', 'SCENE>EXPL', 'Then the line bent', ['bent', 'never allowed'],
     'You walk two steps right; under your feet the gold line **bends** flatter (the knee, mid-1990s). The dashed formula climbs on alone; on **never allowed** it goes vertical to the `∞` and the slip, your head following it up.',
     '① the line bends under you ② the dashes go vertical', 'plan sequence')
shot('1.06', 'SCENE>EXPL', 'Now a second line', ['second line', 'faster than we ever did', "isn't people", 'artificial intelligence'],
     '**★ The second line.** Pull back and truck right: in its own field of the sheet a **line of cool light** rises from the baseline, slow, then shooting up past the top edge **faster than we ever did**; the paper around it goes cool and the lamp pool dims (one hero light). You turn toward it, a cool rim on your coat. On **artificial intelligence** the label `ARTIFICIAL INTELLIGENCE` rises beside it in small caps. The camera settles wide on both lines: the plate.',
     '① the light line shoots up ② camera pull back, then back to the knee', '**SEAM plateLines** (Lead → B1): THE TWO LINES wide: masthead, the gold knee with you on it, the dashes up to ∞ and the slip, the cool light line shooting off the top right · still', star=True)

# ===== c02 · The question · the loop · C1 (B1) ====================================================================================
shot('2.01', 'SCENE>EXPL', 'So what bent the first line', ['bent the first line', 'help steer'],
     'From plateLines: push into the knee. On **bent the first line** the **question card** (an index card on a brass pin) drops in on its pin beside the knee and settles: `WHAT BENT THE FIRST LINE?`. On **help steer** a cream pencil arrow runs from the card right toward the light line, and a faint pencil outline of a **steering wheel** draws beside the light (the seed of the wheel).',
     '① the card pins ② the arrow + the pencil wheel', 'plan sequence')
shot('2.02', 'EXPL', 'Not war', ['Not war', 'Not famine', 'family tree'],
     'Two ink words under the knee, `WAR` and `FAMINE`, each struck through with one gold stroke on its word. On **family tree** the knee\'s ink runs down into branches: a small **family tree** in gold ink, wide at the top (five children), narrow at the bottom (one or two), your yellow node at the bottom.',
     '① strike, strike ② the tree grows down', 'move · back along the gold line to its steep stretch (1900–1960) · left/down')
shot('2.03', 'EXPL', 'What drove the first line up', ['loop', 'more inventors', 'more food', 'more people'],
     '**THE LOOP.** Beside the steep gold line an ink circle draws itself (the loop wheel, `f19_kit.loopWheel`), three stations on it in ink: `PEOPLE` (three tiny figures), `INVENTORS` (a figure at a drafting board), `PROGRESS` (a wheat ear and a medicine bottle). One arrow draws per sentence on its word: **more inventors**, **more food** (the wheat + bottle light), **more people** (the circle closes).',
     '① one arrow per sentence', 'plan sequence')
shot('2.04', 'EXPL', 'And every round goes faster', ['every round', 'faster'],
     'A gold ink bead runs round the loop, each lap faster; every finished lap lifts the gold line beside it one notch steeper (cause → effect within 80 ms). On the last lap the loop\'s centre opens as a **frame** (a 16:9 window cut into the paper, cream mat) and the camera pushes into it.',
     '① the bead laps ② push into the frame', 'push into the clip frame in the loop centre · forward')
shot('2.05', 'CLIP', 'C1', [],
     '**[CLIP C1 · ORIGINAL FOOTAGE]** Heinz von Foerster, *High Tech Heroes* #10 (US TV, late 1980s), from 08:33: the circularity of "a little bit of organization fostering more organization". The clip fills the frame inside the loop (the ink circle stays visible round the mat). Lower third: `HEINZ VON FOERSTER · PHYSICIST, CYBERNETICIAN · LATE 1980s · ORIGINAL FOOTAGE`. Music ducked, no SFX.',
     '① the clip ② the bead keeps running round the mat', 'pull back out of the frame; the window closes back into the loop centre · back')
shot('2.06', 'EXPL', 'Left alone', ['straight up', 'singularity'],
     'The bead spins so fast it becomes a ring of gold; the gold line beside it bends **straight up**; on **singularity** the word `SINGULARITY` is written at the top of the vertical in red small caps, on a tag.',
     '① the line goes vertical ② the label', 'move · the camera trucks right across the sheet to the light line · right')
shot('2.07', 'EXPL', 'Today, the same loop', ['same loop', 'artificial intelligence', 'machines that build'],
     'The loop is **cloned** in cool light beside the light line; the `SINGULARITY` tag slides along a thread from the gold vertical to the light line (carrier). On **machines that build better machines** the stations become small blocks of cool light, each lap one block builds a slightly bigger one (no robots).',
     '① the clone loop ② the tag travels', 'move · back left to the human loop · left')

# ===== c03 · The loop broke · the family tree · more choices (B1) ==================================================================
shot('3.01', 'EXPL', 'But the human loop broke', ['broke', 'stopped meaning'],
     'On **broke** the arrow PROGRESS → PEOPLE **tears** (the ink splits, two frayed ends, a small gap); the bead rolls to the gap and stops. On **stopped meaning** the PEOPLE station stops multiplying.',
     '① the arrow tears ② the bead stops', 'move · down to the family tree under the knee · down')
shot('3.02', 'EXPL>SCENE', 'You can see why', ['family tree'],
     '**Lift-off:** the ink family tree from 2.02 rises off the paper as a **paper-cut theatre** (three layers, soft paper shadows): the top generation = a family of seven silhouettes in a row of lit windows, the rows below narrower.',
     '① the layers lift ② camera push', 'plan sequence')
shot('3.03', 'SCENE', 'kids survived', ['survived', 'so many'],
     '**★ The three windows.** Window 1 (warm, the hero light): a doctor (cream pencil silhouette) bends to a child; the child stands up straight, and in the row above every child silhouette stays lit. On **so many** the next row is drawn with fewer children.',
     '① the child stands up ② the row thins', 'plan sequence', star=True)
shot('3.04', 'SCENE', 'Girls stayed in school', ['school'],
     'Window 2: a girl with a school bag walks into a schoolhouse door of warm light, a notebook under her arm.',
     '① the girl walks in', 'plan sequence')
shot('3.05', 'SCENE', 'Couples could plan', ['plan their families'],
     'Window 3: a couple at a kitchen table under a lamp, a wall calendar; one of them turns a page.',
     '① the page turns', 'transformation · the theatre lays itself down; its child silhouettes become ink pictograms · down')
shot('3.06', 'EXPL', 'Worldwide, the average woman', ['average woman', 'five', 'two'],
     'A row of **five ink child pictograms** under `KIDS PER WOMAN · WORLD`; big serif counter `≈ 5`; on **two** three of them turn into dotted outlines, the counter rolls to `≈ 2`. Source `UN WPP 2024 · OUR WORLD IN DATA`.',
     '① counter ② three go dotted', 'plan sequence')
shot('3.07', 'EXPL', "That's what bent the first line", ['bent the first line', 'more choices'],
     'The two solid pictograms slide up into the knee of the gold line (they are the bend). On **more choices** `MORE CHOICES` is written across the question card in gold ink by hand; the card flips on its pin and its back reads `CAN WE STEER THIS ONE?`.',
     '① the two rise into the knee ② the answer is written', 'move · the card travels on a thread right to the light line · right')
shot('3.08', 'EXPL', "Machines don't have a family tree", ['family tree', 'slow down', 'Friday of its own'],
     'The light line with its cool loop; under it a pencil starts a family tree and lifts off again: nothing to draw. On **slow down** the cool loop spins faster. On **Friday of its own** a **calendar slip** pins at the top of the light line: `FRI ?` (cool ink).',
     '① the pencil fails ② the slip pins', 'move · down the light line to its foot, an ink stopwatch beside it · down')

# ===== c04 · The stopwatch · C2 · doubling · one working day (B1) ==================================================================
shot('4.01', 'EXPL>SCENE', 'To find out', ['independent researchers', 'stopwatch'],
     'The ink **stopwatch** at the foot of the light line lifts off as a paper object and hangs over a **desk diorama** rising below it (lamp, a researcher in cream pencil). On **stopwatch** the crown clicks (the only hard accent), the cool hand starts sweeping.',
     '① lift-off ② the click', 'plan sequence')
shot('4.02', 'SCENE', 'They take real tasks', ['real tasks', 'programming work', 'skilled person'],
     'At the desk a skilled person (cream pencil) works; a **task card** with dashed lines (unreadable code) on her screen. On **skilled person** the stopwatch hand sweeps a lit wedge: her time.',
     '① she works ② the wedge fills', 'plan sequence')
shot('4.03', 'SCENE>EXPL', 'Then they find the biggest task', ['biggest task', 'alone', 'half the time'],
     'A second screen on the right glows cool: the same task card, lines writing themselves (**alone**: no hands). A bar on the sheet under the desk grows: `LONGEST TASK DONE ALONE`. On **half the time** four trial ticks: two ✓ two ✗, `50 %` (the half-the-time rule).',
     '① the cool screen works ② the bar grows', 'push into the cool screen (the clip frame) · forward')
shot('4.04', 'CLIP', 'C2', [],
     '**[CLIP C2 · ORIGINAL FOOTAGE]** Beth Barnes (METR), *Machine Learning Street Talk*, May 2026: how the time-horizon measurement works. The clip plays in the cool screen\'s frame. Lower third: `BETH BARNES · METR · 2026 · ORIGINAL FOOTAGE` (role to confirm with clips.json).',
     '① the clip ② the stopwatch hand sweeps on the frame edge', 'pull back out of the screen, down to the bar on the sheet · back/down')
shot('4.05', 'EXPL', 'Every few months', ['few months', 'doubles'],
     'The bar **doubles in jumps**: on **doubles** it snaps to twice its length (short accent), then again and again (one jump per ~1 s), `×2` ticks under each jump; the camera pulls back to keep it in frame. Source `METR · TIME HORIZONS`.',
     '① jumps ② pull back', 'plan sequence')
shot('4.06', 'EXPL>SCENE', 'By now, the best systems', ['working day', 'Morning coffee', 'quitting time', 'then some'],
     '**★ ONE WORKING DAY.** At the bar\'s end an **hourglass** lifts off the sheet: `ONE WORKING DAY`; the bar pours into it. On **Morning coffee** a steaming cup on a dawn-lit desk beside it (small paper-cut), on **quitting time** the window goes dusk and a coat is lifted off its hook; on **then some** the bar runs on past the hourglass. Small: `> 8 HOURS` (fact check F28).',
     '① the hourglass fills ② coffee → coat', 'transformation · the hourglass lays down; its bar\'s jumps become stairs · down', star=True)

# ===== c05 · Doubling vs. the old formula · the ghost · C3 (B1) ===================================================================
shot('5.01', 'EXPL', "That's fast", ['straight up', 'keeps climbing'],
     'The jumps become a **cool staircase** drawn on the graph paper: every step twice as high, all steps the same width. On **straight up** a ruler-straight vertical is pencilled beside it: the stairs never reach it; on **keeps climbing** they run on off the top, always with width.',
     '① the stairs draw ② pull back', 'plan sequence')
shot('5.02', 'EXPL', 'The old formula was different', ['faster than the last', 'stood straight up', 'a date'],
     'Beside them, in gold ink, the **1960 stairs**: each step comes sooner, narrower and narrower, until the steps have no width and the line **stands straight up**; on **a date** the calendar slip `FRI 13 NOV 2026` pins at its top (callback of 1.01).',
     '① the gold stairs narrow ② the slip pins', 'plan sequence')
shot('5.03', 'EXPL', 'Newer measurements', ['sped up once', 'old shape', 'shape with a date', 'Some forecasts'],
     '**★ The ghost.** One cool step comes narrower (**sped up once**). On **old shape** the gold 1960 curve lifts off the paper on a sheet of **tracing paper** and slides right, laid over the light line: the shapes match. On **shape with a date** a blank slip `?` hangs where the date would be; on **Some forecasts** the tracing sheet settles.',
     '① the tracing sheet slides over ② the blank slip', 'push into the blank slip, which turns into the clip frame · forward', star=True)
shot('5.04', 'CLIP', 'C3', [],
     '**[CLIP C3 · ORIGINAL FOOTAGE · PLACEHOLDER FRAME]** Researchers debating **recursive self-improvement** (Dwarkesh Patel, https://youtu.be/PrSf7IOYu-I; coordinator 6.11., replaces Amodei, faktencheck §5): one sentence that A.I. helps build the next A.I. / the curve could speed up. Passage and speaker still to be cut: until then the frame shows the placeholder card. Plays inside the slip\'s frame. Lower third after the cut: `NAME · ROLE · YEAR · ORIGINAL FOOTAGE`. Explaining, no fear line.',
     '① the clip', '**SEAM plateSlip** (B1 → B2): pull back out of the frame onto the calendar slip, close, its face `FRI ?` · centre · back')

# ===== c06 · A birthday · projection · the GPS (B2) ===============================================================================
shot('6.01', 'EXPL', 'A date sounds precise', ['precise', 'pure math', 'late twenty twenty-six', 'give or take', 'somewhere else'],
     'From plateSlip. On **precise** the `?` page tears off and flutters away: `FRI 13 NOV 2026`. On **pure math** pull back to the 1960 chart\'s x-axis at the asymptote; on **late twenty twenty-six** a cream bracket spans late 2026: `LATE 2026 · t₀ = 2026.87`; on **give or take** it widens to a faint span `2021 – 2032` (± 5.5 years, faktencheck §5) and closes again. On **somewhere else** a gold ink ring draws round the `13` on the slip.',
     '① the page tears ② the bracket', 'plan sequence')
shot('6.02', 'SCENE', "It's a birthday", ['birthday', 'Heinz von Foerster', 'Vienna', 'joke', 'hundred and fifteen'],
     '**★ The birthday.** An **index card** lifts off beside the slip: `HEINZ VON FOERSTER` · `BORN 13 NOV 1911 · VIENNA`; a man\'s **silhouette** (cream pencil, in profile, no face, no likeness) stands up behind it. On **Vienna** a tiny paper-cut skyline with one spire rises behind him. On **joke** the gold ring round the 13 closes like a wink. On **hundred and fifteen** a **candle** `115` rises on the slip and lights: the warm hero light of the chapter.',
     '① card + silhouette ② the candle lights', 'plan sequence', star=True)
shot('6.03', 'SCENE>EXPL', 'The day was a wink', ['wink', 'math was not', 'came with an if', 'keep growing', 'projection', 'not a forecast'],
     'On **wink** the flame dips and rises once. On **math was not** tilt up to the 1960 masthead, firm. On **came with an if** the paper\'s own **subtitle** rises under the title (verbatim, faktencheck M1): `AT THIS DATE HUMAN POPULATION WILL APPROACH INFINITY` / `IF IT GROWS AS IT HAS GROWN IN THE LAST TWO MILLENNIA` (kit: chart1960 st.sub); on **If we keep growing** a gold ring draws round the `IF` (st.ifR). On **projection** the dashed line gets the label `PROJECTION`; on **not a forecast** `FORECAST` is struck through. No 1962 page (its content is unverified).',
     '① the subtitle rises ② the ring round IF', 'transformation · the dashed line becomes a road on a map; lift into the car · forward')
shot('6.04', 'SCENE>EXPL', 'A projection is like the arrival time', ['GPS', 'same way', 'another turn', 'changes'],
     '**The car at night** (paper-cut dashboard, windshield, the road ahead), you at the wheel from behind; a **GPS screen** on the dash: route and `ARRIVAL 6:12 PM`. On **same way** the route runs straight; on **another turn** you turn the wheel, the route bends and on **changes** the time rolls to `6:31 PM`.',
     '① the wheel turns ② the time rolls', 'plan sequence')
shot('6.05', 'EXPL', 'The machine line is a projection', ['projection, too', 'nothing changes', 'change the route'],
     'Push into the GPS: its route **is the light line** on the sheet, the flag at its end `FRI ?`. The question card pins beside it: `CAN WE STEER THIS ONE?`. On **change the route** a pencil-dotted second route branches off and bends.',
     '① the route = the light line ② the dotted branch', 'move · back out to the windshield, now fogged · back')

# ===== c07 · See it · counting · the ruler (B2) ===================================================================================
shot('7.01', 'SCENE', 'Only if we can see it', ['see it', 'eyes closed'],
     'The car: the windshield is **fogged** (a vellum layer). Your hand wipes a clear patch; through it, the road. On **eyes closed** the fog clears further. The card gets `SEE IT` in ink. Small, for the curious: `CYBERNETICS = THE SCIENCE OF STEERING`.',
     '① the wipe ② the fog clears', 'move · through the clear patch down onto the sheet · forward')
shot('7.02', 'EXPL', 'The first line was easy to see', ['counted their people', 'again and again'],
     'On the sheet: **census slips** (small paper forms with tally marks, `CENSUS 1950`, `1960`, `1970` …) land one by one along the gold line; each slip is one point of the line. On **again and again** they stack faster.',
     '① slips land one by one', 'move · right along the sheet to the light line · right')
shot('7.03', 'EXPL', 'The machine line is visible', ['stopwatch', 'in public', 'hype and panic'],
     'The **stopwatch** returns beside the light line; each click prints a point on it. On **in public** the chart is pinned up and copies fan out across the sheet (`METR · PUBLIC`). On **hype and panic** two smudgy pencil words `HYPE` / `PANIC` left and right get erased by the line.',
     '① points print ② copies fan out / erase', 'move · down to a doorframe on the sheet · down')
shot('7.04', 'SCENE', 'But the researchers admit', ['problem', 'hard enough', 'ruler', 'too short'],
     '**★ The ruler.** A paper-cut **doorframe** with pencil height marks; beside it a stack of task cards that thins (**hard enough**). A kid (cream pencil) stands against the frame, a wooden **ruler** held over the head; on **too short** the kid grows past the ruler\'s end.',
     '① the cards thin ② the kid outgrows the ruler', 'transformation · the ruler lays down onto the sheet along the light line · down', star=True)
shot('7.05', 'EXPL', 'So the measuring has to grow', ['grow as fast', 'Out in the open', "tomorrow's weather"],
     'The ruler becomes a **measuring tape** that extends along the light line as it grows. On **Out in the open** the tape and line lie on a public board; on **tomorrow\'s weather** a **weather strip** (MON TUE WED, sun / cloud) slides in beside it, the line\'s next step as one more forecast icon.',
     '① the tape grows ② the weather strip', 'move · back into the car, windshield clear · up')

# ===== c08 · Seeing isn't steering · help for everyone · the rope (B2) ============================================================
shot('8.01', 'SCENE', "But seeing the road isn't steering", ['steering'],
     'The car: windshield clear, the road ahead, the **steering wheel empty** (your hands in your lap). On **steering** the camera settles on the empty wheel, then looks out through the glass.',
     '① settle on the wheel', 'move · through the windshield down onto the sheet: the road is the light line · forward')
shot('8.02', 'EXPL', 'The first line bent when', ['billions of families', 'more choices to', 'Everyone', 'just a few'],
     '**The fork.** On the sheet the gold knee: on **billions of families** thousands of tiny ink dots light along it (the families whose choices bent it). The light line beside it **forks**: on **Everyone** one branch fans into thousands of dots, on **just a few** the other narrows into three. The question card pins between them: `FOR EVERYONE?`.',
     '① the dots light ② the fork', 'move · the hourglass lifts off the sheet at the fork · up')
shot('8.03', 'SCENE>EXPL', 'Picture that full working day', ['working day', 'contract', 'medical bill', 'business idea'],
     'The **hourglass `ONE WORKING DAY`** (4.06) stands on the fork, tips and pours into your open hands (you, close). One paper rises on each phrase: a **contract** with a signature line, a **medical bill** with a total and a `?`, a **napkin** with a sketch.',
     '① the hourglass pours ② one paper per phrase', 'move · the papers fly to a door in a dark wall · right')
shot('8.04', 'SCENE', 'For most of history', ['rare and expensive', 'lucky few', 'on call for anyone', 'more choices'],
     '**★ The rope.** An expert\'s **door** with warm light behind it, a brass plate, a **velvet rope** on two posts; you outside. On **lucky few** two silhouettes pass the rope; on **on call for anyone** the rope unhooks and drops, the door swings wide, the light floods over you; on **more choices** you step in.',
     '① the rope drops ② the door opens', 'flight into the doorway light → **SEAM plateWheel** (B2 → B3): the empty steering wheel, close · centre · forward', star=True)

# ===== c09 · Few hands · billions · use, refuse, vote · shiny (B3) ================================================================
shot('9.01', 'SCENE', 'Right now, though', ['big calls', 'build these systems', 'fund them', 'write their rules'],
     'From plateWheel: pull back: the wheel is **huge**, in a quiet room with a tall window; **a few hands** (cream pencil sleeves) on its rim. On **build**, **fund**, **write their rules** three small papers land beside them: a blueprint, a coin stack, a rule book.',
     '① pull back ② one prop per word', 'plan sequence')
shot('9.02', 'SCENE>EXPL', "That's not a villain story", ['villain', 'heavy load', 'eight billion'],
     'No villains: the hands are ordinary, one sleeve rolled up. On **heavy load** the wheel dips with weight. On **eight billion** pull back further: behind the window **eight billion points of light** (the world at night), the few hands tiny in front.',
     '① the wheel dips ② pull back to the lights', 'transformation · the points of light become the gold line\'s ink · down', star=True)
shot('9.03', 'EXPL', 'The first line bent without', ['one shared plan', 'family decisions', 'steered the same way'],
     'Callback: the gold knee, close. The ink is made of **millions of tiny arrows**, each a family\'s decision, each turned a little; together they bend the line. On **steered the same way** the same tiny arrows appear along the light line.',
     '① the arrows turn ② they appear on the light line', 'move · into one arrow: a kitchen window · forward')
shot('9.04', 'SCENE', 'No family decides how fast', ['how fast', "what they're for", 'what we use', 'refuse', 'ballot box'],
     'Your **kitchen table** at night (lamp, window, the light line outside rising on its own: **how fast**). On **what we use** you pick up a phone (its screen lights), on **refuse** you lay it face down (the light goes out), on **ballot box** a folded slip drops into a ballot box.',
     '① phone up / down ② the slip drops', 'move · out of the window to a lit shop front · right')
shot('9.05', 'SCENE>EXPL', 'Still, choosing is hard', ['shiny', 'bigger, or smaller'],
     'A **shop window** full of shiny new things (screens, gadgets, sparkles), you in front. On **bigger, or smaller** the question card pins on the glass: `BIGGER OR SMALLER?`, an up and a down arrow pencilled beside.',
     '① the window glitters ② the card', 'move · down onto the sheet to the calendar slip with the candle · down')

# ===== c10 · The test (B3) ========================================================================================================
shot('10.01', 'SCENE>EXPL', 'To tell bigger from smaller', ['bigger from smaller', 'left a test'],
     'The slip with the **candle 115** (6.02). On **left a test** its flame lights a card beside it; the question card gets `A TEST`.',
     '① the flame lights the card', 'plan sequence')
shot('10.02', 'EXPL', 'In nineteen seventy-three', ['seventy-three', 'single line', 'Act always', 'number of choices'],
     '**Quote card, handwritten (1973):** "Act always so as to increase the number of choices." writes itself word by word as it is spoken (≥ 4 s, the voice runs on), `HEINZ VON FOERSTER · 1973`. (Optional C4: if his own voice saying it is found, the card turns into the clip frame here.)',
     '① the ink writes', 'plan sequence')
shot('10.03', 'EXPL', 'And he was picky', ['last word', 'Not options', 'Choices'],
     'On **last word** `choices` is underlined. On **Not options** `OPTIONS` is written above and struck through; on **Choices** `CHOICES` gets a gold ring.',
     '① strike ② ring', 'move · the ring becomes a button on a screen · right')
shot('10.04', 'SCENE', 'A screen full of buttons', ['buttons', 'truly yours'],
     'A cool **screen full of identical buttons**, your hand hovering. On **truly yours** you turn from the screen and draw your own short line in gold ink on the paper.',
     '① the hand hovers ② you draw', 'plan sequence')
shot('10.05', 'EXPL', 'Hold his rule up', ['an app', 'a law', 'own decisions', 'say no'],
     '**★ The gauge.** The 1973 card becomes a **transparent gauge** with `MORE ↑ / FEWER ↓`. On **an app** it is held over a phone, on **a law** over a page with `§`; on **own decisions** its needle swings; on **say no** a small `NO` switch stays lit on the gauge.',
     '① the gauge moves over ② the needle', 'plan sequence', star=True)
shot('10.06', 'SCENE>EXPL', 'A tutor that lets any kid', ['passes', 'fails it'],
     'Two halves: left a kid (cream pencil) at a tablet tutor, many small paths branching out from the kid: gold ✓ on **passes**. Right a **form filling itself in** (lines write themselves, nobody there): ✗ on **fails it**.',
     '① ✓ ② ✗', 'transformation · the ✓ stroke runs on into the light line · up')

# ===== c11 · Human hands · see it coming · Happy birthday, Heinz + end screen (B3) ================================================
shot('11.01', 'EXPL', "The test isn't how smart", ['how smart', 'human hands'],
     'The light line. On **how smart** a tall height scale beside it greys out (not the measure). On **human hands** many small hands (paper silhouettes) reach up along the line and hold it.',
     '① the scale greys ② the hands rise', 'move · left across the sheet to the gold knee · left')
shot('11.02', 'SCENE>EXPL', 'More choices bent the first line', ['quietly', 'inside your lifetime', 'see coming'],
     'You at the gold knee again (1.05). On **inside your lifetime** a bracket from your birth dot to the knee. On **see coming** the camera looks right along the light line: a paper road sign `CURVE AHEAD` (a curved arrow) stands beside it.',
     '① the bracket ② the sign', 'plan sequence')
shot('11.03', 'SCENE>EXPL', "What's one choice", ['one choice', 'answer below'],
     'Blank index cards drift down onto the sheet along the light line and fill with handwriting (unreadable scribble); you write on one.',
     '① cards land ② you write', 'plan sequence')
shot('11.04', 'EXPL', 'If you want the second line', ['for everyone', 'subscribe', 'this channel'],
     'On **for everyone** the light line fans into many fine lines of light, the hands on all of them. On **subscribe** a small `THE GOOD TAKEOFF` wordmark is printed in the sheet\'s corner.',
     '① the line fans out', 'move · up to the calendar slip with the candle · up')
shot('11.05', 'EXPL', 'This Friday, the formula says', ['infinity', 'eight billion', 'Still choosing'],
     'The slip `FRI 13 NOV 2026` with the candle. Two counters on the paper: gold `∞` on **infinity**, cream pencil `≈ 8 BILLION` on **eight billion** (fact check F14). On **Still choosing** the 8-billion dots under it shimmer.',
     '① ∞ ② 8 BILLION', 'plan sequence')
shot('11.06', 'EXPL', "Friday isn't an ending", ['checkpoint', 'both lines', 'birthday'],
     'Pull back: both lines on the sheet, a pencil checkpoint tick at 2026 on each. On **birthday** the candle flame brightens.',
     '① ticks ② the flame', 'plan sequence')
shot('11.07', 'SCENE>EXPL', 'Happy birthday, Heinz', ['Happy birthday'],
     '**★ Happy birthday.** The widest picture of the film: the whole sheet under the lamp, the gold line with its knee, the light line beside it, you tiny at the knee, the slip with the candle as the warm hero light, the silhouette of 6.02 small at the sheet\'s edge.',
     '① pull back ② the flame', 'pull back into the end screen', star=True)

ENDSCREEN = ('11.08', 'SCENE>EXPL', 'End screen (from 7:48.1 = audio/clips-slots.json endscreen_start, 15 s, no voice). The sheet under the lamp, wide and calm: both lines draw on slowly, the candle burns, you tiny at the knee. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload): plain paper there; subscribe space centre x 810–1110, y 330–600. Never static.', '① slow pull back ② the flame')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')
def vo_end(): return max(w['e'] for w in WS)
SLOTS = os.path.join(os.path.dirname(REAL), 'clips-slots.json')
def end_start():   # the end screen starts here (audio/clips-slots.json endscreen_start with the real VO: fixed 7:48.1), else at the VO end
    if TIMING == REAL and os.path.exists(SLOTS): return json.load(open(SLOTS)).get('endscreen_start', vo_end())
    return vo_end()
def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])
LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5, 'CLIP': 0}

def resolve():
    chunk_start, last = {}, -1.0
    for c in CHUNKS:
        t0 = 0.0 if c[0] == 'c01' else gfind(c[3], last)
        chunk_start[c[0]] = t0; last = t0
    last = -1.0
    for sh in S:
        if sh['layer'] == 'CLIP':
            if sh['start'] not in CLIPS: raise SystemExit(f'clip slot {sh["start"]} missing in {TIMING}')
            t = CLIPS[sh['start']]['start']
        else: t = 0.0 if sh['id'] == '1.01' else gfind(sh['start'], last)
        sh['t'] = t; last = t
        sh['at'] = [(a, gfind(a, t - .01)) for a in sh['anchors']]
    for i, sh in enumerate(S):
        sh['t1'] = S[i + 1]['t'] if i + 1 < len(S) else end_start()
    return chunk_start

def main():
    cs = resolve()
    dur = TM['duration']; ve = end_start()
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = ['| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |', '|---|---|---|---|---|---|---|---|']
    tot = {'B1': 0, 'B2': 0, 'B3': 0, 'Lead': 0}
    ex_all = 0.0
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        a, b = cs[c[0]], ends[c[0]]
        span_anim = sum(s['t1'] - s['t'] for s in shs if s['layer'] != 'CLIP') + (dur - ve if c[0] == 'c11' else 0)
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs) + ((dur - ve) * LAYER_W[ENDSCREEN[1]] if c[0] == 'c11' else 0)
        ex_all += ex; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / max(1, span_anim))}% |')
    clip_s = sum(c['end'] - c['start'] for c in CLIPS.values())
    anim = dur - clip_s
    share, share_full = 100 * ex_all / anim, 100 * ex_all / dur
    ok = 'OK' if 60 <= share <= 70 else 'OUT OF RANGE'
    out.append('')
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s (incl. the clip frames C1–C3) · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (incl. the ≤ 15 s end screen). '
               f'**Weighted explainer share: {share:.0f} % of the animated runtime** ({anim:.0f} s = film {dur:.0f} s minus {clip_s:.0f} s of clips; mixed shots count half, the end screen too) → **{ok}** (target 60–70 %). '
               f'Over the full runtime with the clips as 0: {share_full:.0f} %. Clips: {clip_s:.0f} s = {100 * clip_s / dur:.1f} % of the film (target ≤ 8 %). '
               f'Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL)" if TM.get("provisional") else ""}.')
    gaps = sorted(CLIPS.values(), key=lambda c: c['start'])
    if len(gaps) > 1:
        g = ' · '.join(f'{gaps[i]["id"]}→{gaps[i + 1]["id"]} {gaps[i + 1]["start"] - gaps[i]["end"]:.0f} s' for i in range(len(gaps) - 1))
        out.append('')
        out.append(f'**Own film between clips** (rule ≥ 45 s): {g}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        span_anim = sum(s['t1'] - s['t'] for s in shs if s['layer'] != 'CLIP') + (dur - ve if c[0] == 'c11' else 0)
        ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs) + ((dur - ve) * LAYER_W[ENDSCREEN[1]] if c[0] == 'c11' else 0)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out += ['', f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / max(1, span_anim))}%', f'Light/hero: {c[4]}', '',
                '| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |', '|---|---|---|---|---|---|---|']
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at']) or f'slot `{s["start"]}`'
            sid = f'**{s["id"]} ★**' if s['star'] else s['id']
            out.append(f'| {sid} | [{s["layer"]}] | {ff(s["t"])}–{ff(s["t1"])} | {an} | {s["pic"]} | {s["moves"]} | {s["tr"]} |')
        if c[0] == 'c11':
            e = ENDSCREEN
            out.append(f'| {e[0]} | [{e[1]}] | {ff(ve)}–{ff(dur)} | – | {e[2]} | {e[3]} | – |')
    md = '\n'.join(out)
    print('\n'.join(out[:len(CHUNKS) + 6]))
    if '--md' in sys.argv:
        p = sys.argv[sys.argv.index('--md') + 1]
        doc = open(p).read() if os.path.exists(p) else '<!-- SHOTS:BEGIN -->\n<!-- SHOTS:END -->\n'
        a, b = doc.index('<!-- SHOTS:BEGIN -->'), doc.index('<!-- SHOTS:END -->')
        open(p, 'w').write(doc[:a] + '<!-- SHOTS:BEGIN -->\n' + md + '\n\n' + doc[b:])
        print('wrote', p)

if __name__ == '__main__':
    main()
