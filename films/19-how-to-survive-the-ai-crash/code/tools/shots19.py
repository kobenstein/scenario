#!/usr/bin/env python3
"""Film 19 "How to Survive the AI Crash" · shot list (single source): every shot anchored to a VO PHRASE (looked up globally, in film
order), never to a second.
  python3 tools/shots19.py [timing.json] [--md docs/shots.md]   prints the chunk table + explainer share, writes the shot list markdown.
Times come from timing.json (default: the real VO at <ROOT>audio/timing.json, else data/provisional_timing.json).
Layer: SCENE (scenic illustration: the road, the town, your table, a framed vignette) · EXPL (explainer graphic: light on night, grown
from an object) · SCENE>EXPL / EXPL>SCENE (the shot holds the transformation; counts half) · CLIP (original footage; left out of the share).
A shot starts at its first phrase (searched after the previous shot's start) and runs to the next shot's start; anchors are searched
after the shot start. The scene code uses the same phrases: T.G(phrase, 0, after).
If the fact check (vo-v4.txt) changes a phrase, change it here and in the scene, then regenerate."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REAL = '/mnt/project-files/scenario/film-ai-crash/audio/timing.json'
args = [a for i, a in enumerate(sys.argv[1:]) if not a.startswith('--') and sys.argv[i] != '--md']
TIMING = args[0] if args else (REAL if os.path.exists(REAL) else os.path.join(HERE, '..', 'data', 'provisional_timing.json'))
TM = json.load(open(TIMING))
WS = TM['words']
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
    ('c01', 'Lead', 'Hook: the thumbnail picture · Nov 5 · CRASH? · not a tip, not timing, not luck · five things', "Here's how to survive",
     'Night ground (no crisis red) · hero: YOUR GOLDEN UMBRELLA under the falling red curve (thumbnail A) → the five gores → the road with the DAY 030 milestone'),
    ('c02', 'Lead', 'The clock: day 30, not day 1 · record Oct 6 · four exits with names · the bubble', 'If this is the crash, its clock',
     'The flap counter (warm) → the road tilts up into the S&P line → the ROUTE MAP DAY 0 → 1,000 with four named exits → the bubble swells from today'),
    ('c03', 'B1', "What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China −40 % · first protection costs nothing", 'Mostly, data centers',
     'Inside the bubble skin: the data-center hall (cool) → Powell in a framed window (clip) → the scale, the IOUs, the 100-cell coin → outside again: the China bubble pops'),
    ('c04', 'B1', 'The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause', 'Day thirty-one',
     'Your table under the lamp (warm hero) → the red button → 100 calm points → three bars → the pause sign flies into gore 1 → the phone face down'),
    ('c05', 'B1', 'Exit 1 · day 48 · the tariff crash', 'Day forty-eight',
     'The road at night: the first exit sign; its face opens as a window (containers, the 2025 line touches bottom, the best day)'),
    ('c06', 'B1', 'It reaches you without shares · protection 2: know what you own', 'But what if the fall',
     'The red line leaves the road into the town at the roadside → your mailbox → the fund as dots → the globe (a sixth) → the magnifier flies into gore 2'),
    ('c07', 'B2', 'It reaches paychecks · venture money halves · protection 3: a buffer · $400 · rent', 'And if the fall keeps going',
     'The payslip → the halving stack → the glass door of the town → the envelope flies into gore 3 → the $400 bill in your hands → ten figures'),
    ('c08', 'B2', 'Exits 2 + 3 · day 282 the rate shock · day 517 the financial crisis · the memory', 'Day two hundred eighty-two',
     'The ROUTE MAP again: the dot runs on; each exit opens its window (price tag + dial; house of cards + frost) → the 2009 office memory → the road in winter light'),
    ('c09', 'B2', 'Exit 4 · day 929 the dot-com bubble · what grew in the hangover · protection 4: use what got cheap', 'Day nine hundred twenty-nine',
     'The last sign → two bubbles → the www shopfronts → the long line → the 2001 office, one lamp → five start points → the price tag steps down → today: your desk'),
    ('c10', 'B2', 'Not enough alone · safety nets · 1933: deposit insurance', 'On a road this long',
     'Many lonely roads → down under the road: three nets between pillars → the 1933 bank (window) → the first net → the cent → your bank app'),
    ('c11', 'B3', 'Nets 2 + 3: Black Monday brake, March 2020, stress tests · THE HOLE: data-center debt · Hyperion · protection 5 · one question', 'On Black Monday',
     'Under the road: the 1987 pillar → the brake lever → the shake table → ★ three nets in morning light → the gap: DATA CENTER DEBT → hands knot a fourth net → your message'),
    ('c12', 'B3', 'Day 1,000: the fall behind you · Hassabis (C3) · a new price, not gone · the harvest · the clock has barely started + end screen', 'Day one thousand',
     'The counter lands on 1,000 → ★ morning: the bubble gone, the hall still lit → the clip → the five gores light → many roads join over one net → your table → the phone turned over'),
]

S = []
def shot(id, layer, start, anchors, pic, moves, tr, star=False): S.append(dict(id=id, layer=layer, start=start, anchors=anchors, pic=pic, moves=moves, tr=tr, star=star))

# ===== c01 · Hook (Lead) =========================================================================================================
shot('1.01', 'SCENE', "Here's how to survive", ['survive', 'crash'],
     '**[FRAME 0 = THUMBNAIL A (night-blue version)]** Night-blue ground (channel palette), two flat hills, a ground line. **You** (yellow raincoat, from behind, right third) stand calmly under a **golden umbrella of light** (the hero, brightest thing). A **red price line** plunges from the top right and **shatters on the umbrella**: shards spray outward and fall slowly. Left: `WHAT PROTECTS YOU` (cream, ≥ 1/8 frame height, two lines), under it the small **flap counter `DAY 030`** (warm flaps). Frame 0–3 holds exactly this (silent preview), but alive: shards drift, the umbrella breathes, your coat hem moves. On **crash** a new step of the line snaps down and shatters (the first accent).',
     '① the line snaps + shatters ② shards fall', 'plan sequence')
shot('1.02', 'EXPL', 'On Thursday, November fifth', ['November fifth', 'two trillion', 'single day'],
     'Slow pull back and tilt up: the red line is a **day chart in the sky** over the plain; the title sinks to its baseline and is gone, the counter stays. On **November fifth** a label rises at the line\'s last drop: `NOV 5`; on **two trillion** a counter rolls `−$2 TRILLION` · `TECH STOCKS · ONE DAY` (`NPR`); on **single day** the last drop glows.',
     '① pull back ② counter', 'plan sequence')
shot('1.03', 'EXPL', 'Nobody knows yet', ['Nobody knows', 'crash'],
     'A rubber stamp `CRASH?` lands on the line\'s tip (`stamp`), the question mark rocks once on **crash** and keeps rocking softly.',
     '① stamp lands', 'plan sequence')
shot('1.04', 'SCENE', 'But if it is', ['protects you', 'stock tip'],
     'Down to you: on **protects you** the umbrella glows up; a paper note `HOT TIP ↑` blows in from the left on the wind, skims the umbrella and flutters away right (**stock tip**): it protects nothing.',
     '① the note flies past', 'plan sequence')
shot('1.05', 'SCENE>EXPL', 'Not perfect timing', ['timing', 'luck'],
     'One small symbol per word falls like a shard onto the umbrella and slides off: a **stopwatch** (**timing**), a **pair of dice** (**luck**); a gold rule strikes through each as it lands on the ground.',
     '① stopwatch ② dice', 'plan sequence')
shot('1.06', 'EXPL', 'Five things', ['Five things', 'one of them', 'alone'],
     '**THE FIVE GORES.** Push up to the canopy: on **Five things** its five panels (gores) outline in gold, empty. On **one of them** the fifth gore lights its edge; on **alone** it widens and its rim reaches over three small indigo figures who step in under it (the one you can\'t do alone).',
     '① gores outline ② fifth widens', 'plan sequence')
shot('1.07', 'SCENE', 'So which ones', ['already have'],
     'The gores blink once in turn (**already have**). Pull back: the ground line is a **road** running into mist; the counter `DAY 030` stands beside you as a **milestone** at its start. The umbrella folds and becomes the small **umbrella glyph** in the top-left corner (the kit HUD, five empty gores).',
     '① pull back ② the umbrella folds into the HUD', 'move · push to the milestone counter · centre · forward')

# ===== c02 · The clock (Lead, star=True) ====================================================================================================
shot('2.01', 'EXPL', 'If this is the crash, its clock', ['November fifth', 'day thirty'],
     'Close on the **flap counter** (the warm hero). A calendar leaf `NOV 5` is stuck on it; it peels and falls on **November fifth**. On **day thirty** the flaps snap hard to `DAY 030` (≤ 3 frames, the one hard accent), a shock runs through the frame.',
     '① leaf falls ② flaps snap', 'plan sequence')
shot('2.02', 'EXPL', 'It started at', ['record high', 'October sixth'],
     'Pull back: the road behind the counter tilts up and its edge becomes the **S&P 500 line** (morph). Its peak glows gold with a tiny flag on **record high**: `RECORD HIGH · OCT 6, 2026 · DAY 0`. On **October sixth** the counter rolls 000 → 030 while a dot slides from the peak down the line to today.',
     '① road → line ② dot + counter', 'plan sequence')
shot('2.03', 'EXPL', 'And the road ahead', ['four exits', 'hit bottom'],
     '**THE ROUTE MAP.** The line straightens and lies flat: a horizontal route `DAY 0 ─── DAY 1,000` (top-down, like a transit line), today\'s dot at 30; the counter glides to the top-right corner (HUD, stays for the film). On **four exits** four stops grow out of the line, staggered left → right at 48 · 282 · 517 · 929 (true scale); on **hit bottom** each stop gets a tiny valley glyph.',
     '① four stops grow ② counter to HUD', 'plan sequence')
shot('2.04', 'EXPL', 'The tariff crash', ['tariff crash', 'rate shock', 'financial crisis', 'dot-com bubble'],
     'One name per word, rising at its stop with its glyph: `THE TARIFF CRASH · 2025` (container) · `THE RATE SHOCK · 2022` (dial) · `THE FINANCIAL CRISIS · 2008` (bank façade with a crack) · `THE DOT-COM BUBBLE · 2000` (bubble with `www`). Names, not bare years.',
     '① names in turn', 'plan sequence')
shot('2.05', 'EXPL', 'The nearest', ['seven weeks'],
     'Stop 48 lights, the dot glides there and back: `≈ 7 WEEKS`.', '① stop 48', 'plan sequence')
shot('2.06', 'EXPL', 'The farthest', ['two and a half years', 'longest this century'],
     'A gold run along the line to stop 929 (camera trucks with it, no flight), the end tick `DAY 1,000` beyond it: `≈ 2.5 YEARS`; on **longest this century** `LONGEST FALL THIS CENTURY · S&P 500` under it.',
     '① the run to 929 ② truck', 'plan sequence')
shot('2.07', 'EXPL', 'So if this is a bubble', ['bubble', 'inside it'],
     'Back at today\'s dot (day 30): on **bubble** a huge **soap bubble** swells out of the dot (origin!) and rises over the map (iridescent film in COOL + gold + a thread of red at the rim). On **inside it** the camera pushes to its skin.',
     '① the bubble swells ② push', '**SEAM plateBubble** (Lead → B1): flight through the bubble skin · centre · forward')

# ===== c03 · What's inside the bubble (B1, star=True) =======================================================================================
shot('3.01', 'SCENE', 'Mostly, data centers', ['data centers'],
     'From plateBubble: inside, the curved film still shimmers at the frame edges. A long low **data-center hall** (rows of cool window light = the hero), two cranes, a truck with a chip crate, a new power line on masts.',
     '① pull back from the skin ② a crane swings', 'plan sequence', star=True)
shot('3.02', 'EXPL', 'Every year', ['spend more'],
     'Beside the hall four stacks of money bundles grow in turn (2023 · 2024 · 2025 · 2026), each taller (proportion only; a number only if the fact check delivers one).',
     '① stacks grow in turn', 'plan sequence')
shot('3.03', 'EXPL>SCENE', 'A year before all this', ["central banker", 'sudden drop'],
     'On **sudden drop** a crane stops mid-swing (the hook keeps swinging, then settles). One lit window of the hall grows toward us and becomes a **framed window** (the vignette frame): a drawn press stage, flags, a lectern, `FEDERAL RESERVE · OCT 29, 2025`.',
     '① crane stops ② the window grows', 'transformation · window rect → clip rect · centre · forward')
shot('3.04', 'CLIP', 'clip:C1', [],
     '**[CLIP C1]** Powell, 13.2 s, inside the framed window (≥ 75 % frame width, gold rim, night around it, bubble film faint at the edges). `clipWindow(ctx, t, T, "C1", rect, { from })` plays the real footage (`clips/C1.mp4`, press conference Oct 29, 2025); its lower third reads `JEROME POWELL · FED CHAIR · OCT 29, 2025 · ORIGINAL FOOTAGE`. Fallback without frames: quote card with the official Fed wording, cue by cue.',
     '① slow push on the window', 'plan sequence')
shot('3.05', 'EXPL', 'He also said', ['unlike the dot-coms', 'real profits'],
     'The window shrinks back into the hall. Two columns rise from the ground: `DOT-COM: IDEAS` (hollow outline) on **unlike the dot-coms**, `TODAY: PROFITS` (filled gold) on **real profits** · `POWELL, OCT 29, 2025`.',
     '① column 1 ② column 2', 'transformation · the columns tip and become the arms of a scale · down')
shot('3.06', 'EXPL', 'But so far', ['customers pay', 'fraction'],
     'A **scale**: left pan the hall (big, cool), right pan a small cash register `WHAT CUSTOMERS PAY`; on **fraction** it tips clearly left. No numbers (fact check item 1).',
     '① the scale tips', 'plan sequence')
shot('3.07', 'EXPL', 'So more and more', ['borrowed money'],
     'Paper slips `IOU` slide in under the left pan one after another; the stack grows on **borrowed money**.',
     '① IOUs stack', 'transformation · the IOU stack rolls up into a coin · centre')
shot('3.08', 'EXPL', 'Three years ago', ['good credit ratings', 'two cents', 'took ten'],
     'A large **coin of 100 cells** (10 × 10 inside the circle) = every new bond dollar: `NEW INVESTMENT-GRADE BONDS`. On **two cents** 2 cells turn cool (`2023: 2 %`), on **took ten** 10 cells (`2026 SO FAR: 10 %`) · `KANSAS CITY FED`.',
     '① 2 cells ② 10 cells', 'plan sequence')
shot('3.09', 'EXPL', 'And debt turns', ['slowdown', 'either way'],
     'The coin slides aside; the cranes slow on **slowdown**, but a **payment calendar** beside them keeps flipping in the same beat: `DUE · DUE · DUE` on **either way**.',
     '① cranes slow ② calendar flips', 'move · pull back out through the bubble skin · back')
shot('3.10', 'EXPL', 'In China', ['Reuters', 'already burst', 'forty percent'],
     'Outside again (the route map faint below): beside our bubble a smaller one `CHINA · STAR 50 · AI + CHIP STOCKS` floats in; it **pops** on **already burst** (droplets fall); a red line under it falls on **forty percent**: `≈ −40 % IN UNDER 4 MONTHS` · `REUTERS, OCT 27, 2026`.',
     '① the small bubble pops ② the red line', 'plan sequence')
shot('3.11', 'EXPL', 'If it pops here', ['pops here', 'costs nothing'],
     'Our bubble trembles on **pops here**. On **costs nothing** the HUD umbrella (top left) grows into frame centre: gore 1 blinks with a small `$0`; the gore hums like a speaker membrane.',
     '① the bubble trembles ② the umbrella grows', 'transformation · gore 1 (a lit panel) drops and becomes your phone screen on the table · centre · down')

# ===== c04 · The loudest week (B1) ===============================================================================================
shot('4.01', 'SCENE', 'Day thirty-one', ['thirty-one'],
     'HUD flips `DAY 031`. **Your table** at dawn: one warm lamp (hero), a window grey-blue; your phone (the lit panel that fell) buzzes across the wood; your hands (yellow sleeves) reach.',
     '① phone buzzes ② your hands', 'plan sequence')
shot('4.02', 'SCENE', 'Red numbers', ['phone', 'news', 'group chat'],
     'One slow truck along the table, no cuts: on **phone** the lock screen fills with red arrows; on **news** a laptop behind it runs a red ticker; on **group chat** a second phone lights with red chart bubbles.',
     '① truck ② screens light in turn', 'plan sequence')
shot('4.03', 'EXPL', 'Everything in you says', ['do something'],
     'Push into your phone: a big red button `DO SOMETHING`; your thumb hovers over it, trembling slightly.',
     '① push ② thumb', 'plan sequence')
shot('4.04', 'EXPL', 'But in the financial crisis', ['financial crisis', 'nobody ran'],
     'The button breaks into **100 points** (10 × 10) that settle calmly and turn from red to gold; `THE FINANCIAL CRISIS · 2008–09` on **financial crisis**.',
     '① button → points', 'plan sequence', star=True)
shot('4.05', 'SCENE>EXPL', 'Fidelity', ['Fidelity', 'tracked'],
     'The points rise and become the lit windows of a **tower at night** (framed vignette); `FIDELITY · 7.1 MILLION 401(k) ACCOUNTS`. On **tracked** a soft light passes along the windows.',
     '① points → windows', 'transformation · the windows fall back into the 100 points · down')
shot('4.06', 'EXPL', 'Fewer than two', ['two in a hundred'],
     'The 100 points again; on **two in a hundred** barely two detach and walk out left: `FEWER THAN 2 IN 100`.',
     '① two points leave', 'plan sequence')
shot('4.07', 'EXPL', 'A couple of years later', ['grown by about half', 'a quarter', 'two percent'],
     'The points stack into three **balance bars**, one per phrase: `STAYED +50 %` · `SOLD, CAME BACK LATER +25 %` · `LEFT, STAYED OUT +2 %` (barely moves) · `FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011`.',
     '① bars grow in turn', 'plan sequence')
shot('4.08', 'EXPL', 'So the first protection', ["isn't a move", 'pause'],
     'The two tall bars slide together into a **pause sign ‖** on **pause**; it flies on an arc to the HUD umbrella and lights **gore 1**: `1 · CALM IN THE LOUDEST WEEK`.',
     '① bars → pause ② flies to gore 1', 'plan sequence')
shot('4.09', 'SCENE', "This isn't financial advice", ['financial advice', 'in the panic'],
     'Back at your table: your thumb withdraws from the screen. Small label `NOT FINANCIAL ADVICE` (≥ 2 s).',
     '① thumb withdraws', 'plan sequence')
shot('4.10', 'EXPL', 'In the loudest week', ['anything big'],
     'The phone screen shows a week calendar: `DAY 30–37` outlined red; three cards `JOB` · `MONEY` · `PLANS` slide out of it into the calmer next week on **anything big**.',
     '① cards slide', 'plan sequence')
shot('4.11', 'SCENE', 'The phone can go', ['face down'],
     'Your hand turns the phone **face down** on the table: the red glow cuts off, the lamp stays (hero). The camera glides over the table edge: the edge line becomes the horizon of the road.',
     '① the phone turns ② glide over the edge', 'transformation · table edge → road horizon (same screen height) · forward')

# ===== c05 · Exit 1 · tariff crash (B1) ===========================================================================================
shot('5.01', 'SCENE', 'Day forty-eight', ['forty-eight', 'tariff crash'],
     '**[ROAD · anchor]** Night road, you walking (real gait), umbrella closed in hand. The sign `EXIT · DAY 48 · THE TARIFF CRASH · 2025` approaches from the right as you walk; HUD rattles 031 → 048.',
     '① you walk ② counter', 'plan sequence')
shot('5.02', 'EXPL', 'In twenty twenty-five', ['wave after wave', 'around the world'],
     '**THE EXIT WINDOW:** the sign\'s face opens into a framed window: container stacks stamped `TARIFF` topple in waves on **wave after wave**; under them the 2025 S&P line falls (red).',
     '① containers topple ② the line falls', 'plan sequence', star=True)
shot('5.03', 'EXPL', 'Here, in April', ['fall stopped'],
     'The line touches bottom; the bottom point turns gold (an exit is gold): `APR 8, 2025 · −19 % · DAY 48`.',
     '① the line lands', 'plan sequence')
shot('5.04', 'EXPL', 'The very next day', ['on hold'],
     'A stamp `ON HOLD` lands on the containers.', '① stamp', 'plan sequence')
shot('5.05', 'EXPL', 'And the market had', ['best day', 'financial crisis'],
     'Right after the low a tall gold day bar shoots up: `APR 9, 2025 · S&P 500 +9.5 %` · `BEST DAY SINCE THE FINANCIAL CRISIS`.',
     '① the bar', 'plan sequence')
shot('5.06', 'SCENE', 'This time', ["don't know yet"],
     'The window folds back into the sign; the sign passes you; mist behind it.', '① sign passes', 'plan sequence')
shot('5.065', 'EXPL>SCENE', 'The week before the sell-off', ['new chair', 'Kevin Warsh', 'choosier'],
     'Ahead in the mist a small lit rect hangs over the road (a window of light); on **new chair** it grows toward us into a framed window: a drawn press stage, `FEDERAL RESERVE · OCT 28, 2026`. On **choosier** a row of five IOU slips on the lectern: two are pushed aside.',
     '① the window grows ② slips', 'transformation · window rect → clip rect · centre · forward')
shot('5.066', 'CLIP', 'clip:C1b', [],
     '**[CLIP C1b]** Warsh, 12.4 s, inside the framed window (≥ 75 % width, gold rim, mist around it). `clipWindow(…, "C1b", …)` plays `clips/C1b.mp4`; lower third `KEVIN WARSH · FED CHAIR · OCT 28, 2026 · ORIGINAL FOOTAGE`; fallback quote card with the transcript. Out: the window shrinks back into the mist and is the next stretch of road.',
     '① slow push', 'plan sequence')
shot('5.07', 'SCENE', 'So we keep walking', ['keep walking'],
     'You walk on; gore 1 in the HUD glows once.', '① you walk', 'plan sequence')

# ===== c06 · Know what you own (B1) ===============================================================================================
shot('6.01', 'SCENE', 'But what if the fall', ["doesn't stop"],
     'The red line of the window does not stay in the sign: it slides out along the road\'s edge past you and over the verge, down toward the **town at the roadside** (houses, a lit shop window, a bus stop).',
     '① the red line runs ② camera pans down', 'plan sequence')
shot('6.02', 'SCENE', 'Then it reaches people', ['never owned', 'single share'],
     'The red line creeps along the pavement past the bus stop, the shop, an office entrance (indigo people alive: waiting, looking at phones).',
     '① the line creeps', 'plan sequence')
shot('6.03', 'SCENE', "Maybe that's you", ['you'],
     'It stops at **your mailbox**; you look down at it.', '① the line stops ② you look', 'plan sequence')
shot('6.04', 'EXPL', 'Yet if your pension', ['pension', 'whole market', 'piece of this boom'],
     'A pension statement slides out of the mailbox; push into it: the fund dissolves into thousands of company dots on **whole market**; the tech dots glow cool on **piece of this boom**.',
     '① statement ② dots', 'plan sequence')
shot('6.05', 'EXPL', 'In May', ['two memory-chip', 'a sixth'],
     'The dots gather into a **globe**; on **two memory-chip** two tiny dots glow; on **a sixth** a ring around the globe fills one sixth in their light: `MAY 2026 · MICRON + SK HYNIX ≈ 1/6 OF THE WORLD MARKET\'S GAINS` · `ACADIAN · MSCI ACWI`.',
     '① two dots ② the ring sixth', 'plan sequence', star=True)
shot('6.06', 'EXPL', 'So the second protection', ['know what you own'],
     'A **magnifier** of light glides over the statement and flies to the HUD umbrella: **gore 2** lights · `2 · KNOW WHAT YOU OWN`.',
     '① magnifier ② gore 2', 'plan sequence')
shot('6.07', 'SCENE', 'Find out what', ['fund holds', 'this one boom'],
     'At the mailbox, close on your hands: your thumb scrolls a fund\'s top holdings (generic: `COMPANY A … F`); on **this one boom** some rows glow in the bubble\'s film colour.',
     '① scroll', 'plan sequence')
shot('6.08', 'SCENE', "Knowing isn't a move", ["can't see"],
     'You lower the phone, calmer (shoulders drop); gores 1 and 2 glow side by side in the HUD. The red line moves on from the mailbox into a payslip lying in the letterbox flap; push in.',
     '① you lower the phone ② push', '**SEAM plateLine** (B1 → B2): the payslip close, the red line across it · centre · forward')

# ===== c07 · Paychecks · buffer (B2) ==============================================================================================
shot('7.01', 'EXPL', 'And if the fall keeps going', ['paychecks'],
     'From plateLine: the payslip (paper card of light) with the red line crossing it; on **paychecks** the net-pay line dims.',
     '① the line crosses', 'transformation · the payslip folds into a money stack · centre')
shot('7.02', 'EXPL', 'When the dot-com bubble burst', ['dot-com bubble', 'halved'],
     'A stack labelled `THE DOT-COM BUBBLE · 2001` sags to half on **halved**: `US VENTURE CAPITAL · 2001: $41B → 2002: $21B` · `PWC / NVCA MONEYTREE`.',
     '① the stack sags', 'move · back to the town: the glass door · right')
shot('7.03', 'SCENE', 'If that happens again', ['hiring freeze', 'canceled project', 'never comes'],
     'You outside a glass office door at night, one composition, one slow push: on **hiring freeze** a sign `HIRING PAUSED` swings on the door; on **canceled project** a whiteboard behind the glass is wiped; on **never comes** your phone\'s inbox stays empty.',
     '① push ② three small beats', 'plan sequence')
shot('7.04', 'EXPL', 'So the third protection', ['a buffer'],
     'The empty inbox folds into an **envelope**; it flies to the HUD umbrella: **gore 3** lights · `3 · A BUFFER`.',
     '① inbox → envelope ② gore 3', 'plan sequence')
shot('7.05', 'SCENE', 'Picture a surprise bill', ['four hundred dollars'],
     'A repair bill `$400` drifts down into your hands (you at the door, close).', '① the bill lands', 'plan sequence')
shot('7.06', 'EXPL', 'In America, only about', ['six in ten'],
     'Ten figure icons rise in a row above the bill; six fill gold on **six in ten**: `63 % · FEDERAL RESERVE, SHED 2025`.',
     '① six fill', 'plan sequence')
shot('7.07', 'SCENE>EXPL', 'Families with even', ['few hundred dollars', 'fall behind on rent'],
     'A thin envelope leans against a wobbling rent bill and holds it upright on **fall behind on rent** · `$250–749 IN SAVINGS · URBAN INSTITUTE`.',
     '① the bill wobbles ② the envelope holds it', 'plan sequence')
shot('7.08', 'EXPL', "A buffer doesn't stop", ['time to think'],
     'An hourglass turns beside the envelope; the HUD counter starts to run fast, grows from the corner and fills the frame with its flaps.',
     '① hourglass ② counter grows', 'transformation · the counter flaps → the route map · forward')

# ===== c08 · Exits 2 + 3 (B2) =====================================================================================================
shot('8.01', 'EXPL', 'Day two hundred eighty-two', ['rate shock'],
     '**[ROUTE MAP · anchor]** Out of the flaps: the route map of 2.03; the dot runs from 48 to stop 282: `EXIT · DAY 282 · THE RATE SHOCK · 2022`.',
     '① the dot runs', 'plan sequence')
shot('8.02', 'EXPL', 'In twenty twenty-two', ['prices rose', 'forty years', 'shot up'],
     'The stop opens its window: a supermarket price tag climbs (**prices rose**); a rate dial turns up (**shot up**); the 2022 line slides.',
     '① price tag ② dial', 'plan sequence')
shot('8.03', 'EXPL', 'The fall stopped here', ['stopped here'],
     'The line touches bottom, gold dot: `OCT 12, 2022 · −25 % · DAY 282`; the window folds into the stop.',
     '① the line lands', 'plan sequence')
shot('8.04', 'EXPL', 'Day five hundred seventeen', ['financial crisis'],
     'The dot runs on to stop 517: `EXIT · DAY 517 · THE FINANCIAL CRISIS · 2008`.', '① the dot runs', 'plan sequence')
shot('8.05', 'EXPL', 'Banks had piled up', ['risky home loans', 'collapsed', 'froze'],
     'Window: a house of cards made of home-loan contracts (**risky home loans**); a bank tower tips (**collapsed**) · `LEHMAN BROTHERS · SEPT 15, 2008`; frost spreads across a map of money lines (**froze**).',
     '① cards ② frost', 'plan sequence')
shot('8.06', 'EXPL', 'It hit bottom here', ['bottom here'],
     'The deep 2007–09 line touches bottom: `MAR 9, 2009 · −57 % · DAY 517`.', '① the line lands', 'plan sequence')
shot('8.07', 'SCENE', 'If you were working', ['back then', 'remember this exit'],
     'The window grows into a **memory**: an office, March 2009, in old-photo tones (indigo + faded gold): a CRT monitor with a red line, a flip phone, colleagues quiet at the coffee machine (alive: one sips, one shifts weight). On **remember this exit** the photo shrinks into an exit sign — and you walk past that sign on the road in winter light.',
     '① the memory ② shrink into the sign', 'plan sequence')

# ===== c09 · Exit 4 · dot-com · use what got cheap (B2, star=True) ===========================================================================
shot('9.01', 'SCENE', 'Day nine hundred twenty-nine', ['dot-com bubble'],
     '**[ROAD · anchor]** The last sign `EXIT · DAY 929 · THE DOT-COM BUBBLE · 2000`; HUD races to 929; the road rises.',
     '① sign ② counter', 'plan sequence')
shot('9.02', 'EXPL', 'The crash this boom', ['compared to most'],
     'The sign\'s `www` bubble swells off the sign to the left; our bubble (c02) floats in from the right: two bubbles shimmering alike, side by side.',
     '① www bubble ② our bubble', 'move · into the www bubble · forward')
shot('9.03', 'SCENE', 'Back then', ['billions', 'never made a profit'],
     'Inside the www bubble (framed by its film): empty shopfronts with `www.` neon, price tags in billions (**billions**), no customers (**never made a profit**).',
     '① tags swing', 'move · out of the bubble: its film becomes the exit window · back')
shot('9.04', 'EXPL', 'In October two thousand two', ['finally stopped', 'five more years'],
     'Exit window: a long, sluggish fall touches bottom (**finally stopped**); then a dotted creep back to the old-record line (**five more years**): `OCT 9, 2002 · −49 % · DAY 929 · BACK AT RECORD: MAY 30, 2007`.',
     '① the line lands ② dotted creep', 'plan sequence')
shot('9.05', 'SCENE', 'Whether ours runs', ["don't know yet"],
     'The window folds shut; mist; the road ahead long and rising.', '① window folds', 'plan sequence')
shot('9.06', 'SCENE', 'But look at what grew', ['hangover'],
     'A window opens in the mist: an **empty open-plan office, 2001**: stacked chairs, a dot-com poster peeling off; one **desk lamp** burning (warm hero).',
     '① poster peels ② lamp breathes', 'plan sequence')
shot('9.07', 'EXPL', 'In two thousand one', ['Google', 'first full-year profit'],
     'From the lamp a small bar jumps over a zero line: `GOOGLE · 2001 · FIRST FULL-YEAR PROFIT`.', '① the bar', 'plan sequence')
shot('9.08', 'EXPL', 'Wikipedia, LinkedIn', ['Wikipedia', 'YouTube', 'climbed back'],
     'Timeline 2001–2007: the S&P line deep under the dotted old-record line; five start points light under it one per name (2001 · 2003 · 2003 · 2004 · 2005), names as type only, no logos; on **climbed back** the line still has not reached the dots\' height.',
     '① five points in turn', 'plan sequence')
shot('9.09', 'SCENE', 'Not in the boom', ['hangover'],
     'Back in the office: at the lit desk three people now (indigo, alive: typing, leaning back).', '① people at the desk', 'plan sequence')
shot('9.10', 'EXPL', 'Today, the price', ['keeps falling', 'ten times cheaper'],
     'The desk monitor: a **price tag** `COST PER TASK` (`tag`) walks down a staircase, one step per year, each step ÷ 10 on **ten times cheaper**: `ROUGHLY 10× CHEAPER PER YEAR` · `EPOCH AI · A16Z · STANFORD AI INDEX`.',
     '① the tag steps down', 'plan sequence')
shot('9.11', 'EXPL', 'So the fourth protection', ['became cheap'],
     'The tag flies to the HUD umbrella: **gore 4** lights · `4 · USE WHAT GOT CHEAP`.', '① gore 4', 'plan sequence')
shot('9.12', 'SCENE', "This isn't about stocks", ['stocks', 'tools'],
     'Time-morph in place (no world change): the 2001 desk becomes **your desk today**: the CRT becomes your laptop; on **stocks** a stock list flicks away, on **tools** a tool window opens (glyphs: translate, draft, code).',
     '① CRT → laptop ② tool window', 'plan sequence', star=True)
shot('9.13', 'SCENE', 'Learn one of them', ['headlines are still red'],
     'Behind you a TV flickers red headlines; you work on in the lamplight (hands moving, head tilts).', '① you work', 'plan sequence')
shot('9.14', 'EXPL', 'Four protections', ['all of them yours'],
     'The HUD umbrella grows into frame: four gores lit; gore 5 (wide) empty and pulsing.', '① umbrella grows', 'plan sequence')
shot('9.15', 'SCENE', 'But is it enough', ['protects themselves'],
     'Pull back: many tiny figures on many parallel roads, each alone under its own small umbrella.', '① pull back', 'plan sequence')

# ===== c10 · Nets I (B2) ==========================================================================================================
shot('10.01', 'SCENE', 'On a road this long', ['stops being enough'],
     '**[ROAD · anchor]** You alone on the long road, your umbrella small.', '① slow push', 'plan sequence')
shot('10.02', 'SCENE', 'But the great crashes', ['safety nets'],
     'The camera sinks below the road: **three nets** strung between old pillars, the pillars named `THE GREAT DEPRESSION · 1933` · `BLACK MONDAY · 1987` · `THE FINANCIAL CRISIS · 2008`.',
     '① descend ② nets sway', 'move · along pillar 1933, its stone becomes a bank column · forward', star=True)
shot('10.03', 'SCENE', 'In the early nineteen-thirties', ['banks failed', 'savings'],
     'Framed vignette (sepia-indigo): a crowd (silhouettes, alive) before a closed bank, `CLOSED` on the door; a man lifts an empty passbook on **savings**.',
     '① the crowd shifts ② the passbook', 'plan sequence')
shot('10.04', 'EXPL', 'So in nineteen thirty-three', ['insure bank deposits'],
     'A sign `DEPOSITS INSURED` is screwed onto the bank door; the first net spans under the bank on **insure bank deposits**: `BANKING ACT 1933 · FDIC · INSURED FROM JAN 1, 1934`.',
     '① sign ② net spans', 'plan sequence')
shot('10.05', 'EXPL', 'Since then', ['single cent'],
     'A single cent falls, lands in the net and stays there.', '① the cent falls', 'plan sequence')
shot('10.06', 'EXPL', 'If your bank failed', ['two hundred fifty thousand'],
     'The cent becomes a small net icon beside a balance in your banking app (phone in your hand, close): `US: $250,000 PER DEPOSITOR, PER BANK · EU: €100,000`. Pull back under the road to the 1987 pillar.',
     '① net icon ② pull back', '**SEAM plateNet** (B2 → B3): under the road, the 1933 net close, the 1987 pillar centred ahead · forward')

# ===== c11 · Nets II · the hole · protection 5 (B3) ===============================================================================
shot('11.01', 'SCENE', 'On Black Monday', ['Dow', 'quarter', 'single day'],
     'From plateNet: along the 1987 pillar into a framed vignette: a trading floor 1987, paper flying, a red ticker band: `BLACK MONDAY · OCT 19, 1987 · DOW −22.6 %`.',
     '① paper flies', 'plan sequence')
shot('11.02', 'EXPL', 'After that', ['emergency brake', 'trading stops'],
     'A big **emergency-brake lever** is mounted beside the floor with three marks; the second net spans: `CIRCUIT BREAKERS · S&P 500 −7 % · −13 % · −20 %`.',
     '① lever ② net', 'plan sequence')
shot('11.03', 'EXPL', 'In March twenty twenty', ['pandemic', 'four times'],
     'A calendar `MARCH 2020`; the lever yanks down four times on four days: `THE COVID CRASH · MARCH 9 · 12 · 16 · 18, 2020`.',
     '① four pulls', 'plan sequence')
shot('11.04', 'EXPL', 'Each time', ['fifteen minutes', 'breathe'],
     'An hourglass `15:00` runs; the line stands still; on **breathe** hands on the floor lean back.', '① hourglass', 'plan sequence')
shot('11.05', 'EXPL', 'On November fifth, it was never', ['never pulled'],
     'The lever today, untouched; HUD `DAY 030`; the −7 % mark sits clearly below the day\'s loss: `NOV 5, 2026 · S&P 500 −4.4 % · NO HALT`.',
     '① the lever stays', 'plan sequence')
shot('11.06', 'EXPL', 'After the financial crisis came', ['stress tests'],
     'A bank model on a **shake table**; the third net spans.', '① the table shakes', 'plan sequence')
shot('11.07', 'EXPL', 'Every year, regulators', ['nightmare crash', 'survive it'],
     'A storm of scenario sheets `SEVERELY ADVERSE` sweeps over the bank models; they wobble and stay: `BANK STRESS TESTS · EVERY YEAR SINCE THE FINANCIAL CRISIS`.',
     '① the storm ② they hold', 'plan sequence')
shot('11.08', 'SCENE', 'Three crashes', ['Three nets'],
     '**★ The nets.** Wide under the road: three nets in morning light, their pillars named; the camera glides along the last net through the 2 s pause, music carries.',
     '① glide ② nets sway', 'plan sequence', star=True)
shot('11.09', 'EXPL', 'But this boom has a hole', ['hole'],
     'Under the next stretch of road, labelled `DATA CENTER DEBT`, no net hangs; the camera tips into the gap on **hole**.',
     '① tip into the gap', 'plan sequence')
shot('11.10', 'EXPL', 'A growing part', ['never borrowed from a bank'],
     'Money streams flow past bank buildings into windowless fund towers.', '① streams', 'plan sequence')
shot('11.11', 'SCENE', 'Take one giant data center', ['Louisiana', 'Meta'],
     'Framed vignette: a giant construction site in flat land, cranes to the horizon: `HYPERION DATA CENTER · LOUISIANA`.',
     '① cranes turn', 'plan sequence')
shot('11.12', 'EXPL', 'About twenty-seven billion', ['twenty-seven billion', 'separate company', 'investment firm'],
     'A box `SEPARATE COMPANY` with a debt stack (**twenty-seven billion**); its shares split 80 / 20 (**investment firm**): `≈ $27B BONDS · 80 % BLUE OWL / 20 % META`.',
     '① stack ② split', 'plan sequence')
shot('11.13', 'EXPL', "Not on Meta's own books", ['own books'],
     'An arrow runs past Meta\'s balance book; the book stays thin.', '① arrow', 'plan sequence')
shot('11.14', 'EXPL', 'None of the three nets', ['no insurance', 'no brake', 'no stress test'],
     'The three nets stretch toward the box, one per phrase, and fall short.', '① three reaches', 'plan sequence')
shot('11.15', 'EXPL', 'What would help', ['visible', 'Who holds it', 'who pays'],
     'A cone of light falls into the box: names, sums, arrows appear in turn.', '① light cone', 'plan sequence')
shot('11.16', 'EXPL', 'And testing it', ['banks are tested'],
     'The box stands on the same shake table as the bank models.', '① the table shakes', 'plan sequence')
shot('11.17', 'SCENE', 'Every one of these nets', ['after the damage', 'before'],
     'Under the gap many hands start knotting a **fourth net** on **before**, while nothing has fallen yet.', '① the knots', 'plan sequence')
shot('11.18', 'EXPL', "That's the fifth protection", ["can't build alone"],
     'The half-knotted net flies to the HUD umbrella: **gore 5** (wide) lights · `5 · SAFETY NETS · BUILT TOGETHER`.',
     '① gore 5', 'plan sequence')
shot('11.19', 'EXPL', 'Lawmakers and regulators', ['decide it'],
     'Large hands labelled `LAWMAKERS` and `REGULATORS` hold the net\'s ends; your smaller hand (yellow sleeve) holds a strand beside them.',
     '① hands take the net', 'plan sequence')
shot('11.20', 'SCENE', "Here's one question", ['representative'],
     'You type a short message; recipient field `TO: YOUR REPRESENTATIVE`.', '① typing', 'plan sequence')
shot('11.21', 'EXPL', 'Who holds the debt', ["who's checking it"],
     'The question stands large in the message field (≥ 4 s): `WHO HOLDS THE DEBT BEHIND THE DATA CENTERS, AND WHO\'S CHECKING IT?`',
     '① lines rise', 'transformation · the send arrow becomes the HUD counter, which grows · forward')

# ===== c12 · Day 1,000 (B3) =======================================================================================================
shot('12.01', 'EXPL', 'Day one thousand', ['one thousand'],
     'The flap counter fills the frame, rattles and lands on `DAY 1,000` (the last hard accent).', '① flaps', 'plan sequence')
shot('12.02', 'SCENE', 'If this is the crash', ['longest one', 'behind you'],
     '**[ROAD · anchor]** You at the goal sign `DAY 1,000`; you turn: all four exits lie behind you in the mist · `IF IT RAN LIKE THE DOT-COM BUBBLE · NOT A FORECAST`.',
     '① you turn ② pull back', 'plan sequence')
shot('12.03', 'SCENE', "So what's still standing", ['still standing'],
     '**★ Morning.** First warm light at the horizon; the bubble is gone, only glitter in the air; below, the data-center hall from c03 still stands, its lights on (cool) under the warm sky.',
     '① dawn ② glitter falls', 'plan sequence', star=True)
shot('12.04', 'EXPL>SCENE', 'Demis Hassabis', ['Google DeepMind', 'bursts'],
     'One of the hall\'s lit windows grows into a framed window: a drawn interview studio, `DEC 16, 2025`.',
     '① the window grows', 'transformation · window rect → clip rect · centre · forward')
shot('12.05', 'CLIP', 'clip:C3', [],
     '**[CLIP C3]** Hassabis, 9.15 s, in the framed window (≥ 75 % width), big burned-in subtitles (spoken unevenly). `clipWindow(…, "C3", …)`; lower third `DEMIS HASSABIS · GOOGLE DEEPMIND · DEC 16, 2025 · ORIGINAL FOOTAGE`. Fallback: quote card with the exact transcript.',
     '① slow push', 'plan sequence')
shot('12.06', 'EXPL', 'He builds this technology', ['weigh his words', 'went that way'],
     'The window shrinks; the five start points of 9.08 return and grow into large circles on **went that way**.', '① circles grow', 'plan sequence')
shot('12.07', 'EXPL', 'A crash puts a new price', ['new price', 'away'],
     'The price tag of gore 4 hangs over a chip of light; on **new price** its number is rewritten lower; on **away** the chip under it keeps glowing.',
     '① the tag relabels ② the chip glows', 'plan sequence')
shot('12.08', 'SCENE', 'If the last few years', ['cheaper than today', 'everywhere'],
     'One slow truck along a morning street of lit windows: a clinic corridor, a classroom, a workshop, a kitchen table (indigo people at work, alive).',
     '① truck', 'plan sequence')
shot('12.09', 'SCENE', 'And you can stand', ['front of it', 'single stock'],
     'You at the `DAY 1,000` sign; on **single stock** the paper stock list of day 30 flutters out of your pocket and away.', '① paper flies', 'plan sequence')
shot('12.10', 'EXPL', 'If you stayed calm', ['stayed calm', 'what you owned', 'a buffer', 'what got cheap'],
     '**THE HARVEST.** Your umbrella opens large over you; one gore lights per line with its icon: phone face down · magnifier · envelope · price tag.',
     '① one gore per line', 'plan sequence')
shot('12.11', 'SCENE', "And if you didn't have to", ['alone'],
     'Gore 5 lights and its net is finished; pull back: the many parallel roads of 9.15 join into one, a continuous net beneath, many people under one canopy of umbrellas.',
     '① roads join ② pull back', 'plan sequence')
shot('12.12', 'EXPL', 'Which of these', ['missing'],
     'The umbrella large, one gore blinks: `WHICH ONE IS MISSING?`', '① a gore blinks', 'plan sequence')
shot('12.13', 'SCENE', 'This channel will keep', ['one honest step'],
     'The road runs on past `DAY 1,000` into the morning; you walk on.', '① you walk', 'move · the lamp of your table rises out of the morning light · centre')
shot('12.14', 'SCENE', 'On day thirty, it hurt', ['hurt'],
     'Back at **your table** (c04), night, the lamp; HUD `DAY 030`; the phone face down.', '① lamp breathes', 'plan sequence')
shot('12.15', 'EXPL', 'Today, the clock', ['barely started'],
     'The HUD counter flips quietly to the upload day: `DAY 032` (Sat 7 Nov 2026; 6 Oct = DAY 0).', '① flaps', 'plan sequence')
shot('12.16', 'SCENE', 'And you know what to carry', ['carry'],
     'Your hand turns the phone over: on its screen the umbrella with its five gores lit. Light.', '① the phone turns', 'pull back into the end screen')

ENDSCREEN = ('12.17', 'SCENE', 'End screen (VO end → film end, ≤ 15 s, no voice). The road at first light running into depth, the nets faint under it, you tiny with the umbrella closed in hand walking on; HUD `DAY 032`, its last flap trembling. **Free:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), quiet sky/road there; subscribe centre x 810–1110, y 330–600. Never static.', '① slow pull back ② you walk')

# ---------------------------------------------------------------------------------------------------------------------------------
def ff(x): return f'{x:.2f}'.replace('.', ',')
CLIPS = {c['id']: c for c in TM.get('clips', [])}

def resolve():
    chunk_start = {}
    last = -1.0
    for c in CHUNKS:
        t0 = 0.0 if c[0] == 'c01' else gfind(c[3], last)
        chunk_start[c[0]] = t0; last = t0
    last = -1.0
    for sh in S:
        if sh['start'].startswith('clip:'):
            cid = sh['start'][5:]; t = CLIPS[cid]['start'] - .3 if cid in CLIPS else last + .01
        else:
            t = 0.0 if sh['id'] == '1.01' else gfind(sh['start'], last)
        sh['t'] = t; last = t
        sh['at'] = [(a, gfind(a, t - .01)) for a in sh['anchors']]
    for i, sh in enumerate(S):
        sh['t1'] = S[i + 1]['t'] if i + 1 < len(S) else vo_end()
    return chunk_start

def vo_end(): return max(w['e'] for w in WS)
def chunk_of(sh): return 'c%02d' % int(sh['id'].split('.')[0])
LAYER_W = {'SCENE': 0, 'EXPL': 1, 'SCENE>EXPL': .5, 'EXPL>SCENE': .5, 'CLIP': None}

def share(shs):
    ex = sum((s['t1'] - s['t']) * LAYER_W[s['layer']] for s in shs if LAYER_W[s['layer']] is not None)
    span = sum(s['t1'] - s['t'] for s in shs if LAYER_W[s['layer']] is not None) or 1
    return ex, span

def main():
    cs = resolve()
    dur = TM['duration']
    ends = {c[0]: (cs[CHUNKS[i + 1][0]] if i + 1 < len(CHUNKS) else dur) for i, c in enumerate(CHUNKS)}
    out = ['| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |', '|---|---|---|---|---|---|---|---|']
    tot = {'B1': 0, 'B2': 0, 'B3': 0, 'Lead': 0}
    allx = [0, 0]; clip_s = sum(s['t1'] - s['t'] for s in S if s['layer'] == 'CLIP')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        ex, span = share(shs); allx[0] += ex; allx[1] += span
        a, b = cs[c[0]], ends[c[0]]; tot[c[1]] += b - a
        out.append(f'| {c[0]} | {c[1]} | {ff(a)}–{ff(b)} | {b - a:.1f} | {c[2]} | {c[4]} | {len(shs)} | {round(100 * ex / span)}% |')
    out.append('')
    pure = sum(s['t1'] - s['t'] for s in S if s['layer'] == 'EXPL'); mixed = sum(s['t1'] - s['t'] for s in S if '>' in s['layer'])
    out.append(f'**Builders (seconds of picture):** Lead {tot["Lead"]:.0f} s · B1 {tot["B1"]:.0f} s · B2 {tot["B2"]:.0f} s · B3 {tot["B3"]:.0f} s (B3 includes the ≤ 15 s end screen). '
               f'**Explainer share (weighted, spoken picture without the {clip_s:.0f} s of clips):** **{round(100 * allx[0] / allx[1])} %** '
               f'(pure [EXPL] {pure:.0f} s + half of {mixed:.0f} s mixed, of {allx[1]:.0f} s; target 60–70 %). {len(S)} shots, mean {allx[1] / len(S):.1f} s. '
               f'Timing: `{os.path.basename(TIMING)}`{" (PROVISIONAL, from " + TM.get("source", "?") + ")" if TM.get("provisional") else ""}.')
    for c in CHUNKS:
        shs = [s for s in S if chunk_of(s) == c[0]]
        ex, span = share(shs)
        star = next((s['id'] for s in shs if s['star']), '–')
        a, b = cs[c[0]], ends[c[0]]
        out += ['', f'### {c[0]} · {c[2]} · {ff(a)}–{ff(b)} ({b - a:.0f} s) · {c[1]} · ★ {star} · [EXPL] {round(100 * ex / span)}%', f'Light/hero: {c[4]}', '',
                '| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |', '|---|---|---|---|---|---|---|']
        for s in shs:
            an = ' · '.join(f'**{a}** @{ff(t)}' for a, t in s['at']) or '(clip slot)'
            sid = f'**{s["id"]} ★**' if s['star'] else s['id']
            out.append(f'| {sid} | [{s["layer"]}] | {ff(s["t"])}–{ff(s["t1"])} | {an} | {s["pic"]} | {s["moves"]} | {s["tr"]} |')
        if c[0] == CHUNKS[-1][0]:
            e = ENDSCREEN
            out.append(f'| {e[0]} | [{e[1]}] | {ff(vo_end())}–{ff(dur)} | – | {e[2]} | {e[3]} | – |')
    md = '\n'.join(out)
    print('\n'.join(out[:len(CHUNKS) + 4]))
    if '--md' in sys.argv:
        p = sys.argv[sys.argv.index('--md') + 1]
        doc = open(p).read() if os.path.exists(p) else '<!-- SHOTS:BEGIN -->\n<!-- SHOTS:END -->\n'
        a, b = doc.index('<!-- SHOTS:BEGIN -->'), doc.index('<!-- SHOTS:END -->')
        open(p, 'w').write(doc[:a] + '<!-- SHOTS:BEGIN -->\n' + md + '\n\n' + doc[b:])
        print('wrote', p)

if __name__ == '__main__':
    main()
