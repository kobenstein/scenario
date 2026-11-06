# Film 19 · "How to Survive the AI Crash" · shot list (binding for all builders)

As of 2026-11-06 (picture lead, v1). Script `film-ai-crash/vo-v3.txt` (approved by Jakob; the fact check writes `vo-v4.txt`, which may change single words: then fix the phrase in `tools/shots19.py` and regenerate). Generated tables between the SHOTS markers come from `tools/shots19.py` (edit the generator, then `python3 tools/shots19.py --md docs/shots.md`; the text outside the markers stays). Times are **provisional** (`data/provisional_timing.json` from `tools/provisional_timing.py`) until the audio agent writes `film-ai-crash/audio/timing.json`; the code anchors on the **bold words** only, so everything moves with the real VO.

## 1 · How to read this
- **A chunk is a sequence of shots joined by carriers**, not one camera ride through one world (`MOTION.md` §2: the road is an anchor, not the stage). A row is a shot; its last column says how it hands over.
- **Layer:** `[SCENE]` = scenic illustration (the road, the town at the roadside, your table, a framed vignette window); `[EXPL]` = an explainer graphic, light on night, grown from an object of the shot before; `[SCENE>EXPL]` / `[EXPL>SCENE]` = the shot holds the transformation (counts half); `[CLIP]` = original footage (C1 Powell, C3 Hassabis), left out of the share.
- **Explainer share** (Jakob: 60–70 %, mandatory): computed by the generator over spoken picture time without clips. **This plan: 67 %.**
- **Anchors:** the bold words with their time. An accent lands on its word (±2 frames); camera keys sit on words.
- **Moves (≤ 2):** the hero motion ① and at most one support motion ②. Everything else is ambient (drift, breath, shards, mist).
- **Transition:** "plan sequence" = the next shot continues in the same picture and the same move; otherwise carrier · screen position · direction. **SEAM** rows hand over to another builder through a plate (`lib/f19_seams.mjs`).
- **★** = the one wow moment of the chunk (c07 has none: it is the explainer chunk).
- One motif per sentence; a number is on screen only while its sentence runs plus the hold.
- **The five protections fly into the umbrella** (HUD top left): 4.08 gore 1 · 6.06 gore 2 · 7.04 gore 3 · 9.11 gore 4 · 11.18 gore 5. Harvest 12.10–12.11.

## 2 · Shots
<!-- SHOTS:BEGIN -->
| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |
|---|---|---|---|---|---|---|---|
| c01 | Lead | 0,00–28,24 | 28.2 | Hook: the thumbnail picture · Nov 5 · CRASH? · not a tip, not timing, not luck · five things | Oxblood ground → night · hero: YOUR GOLDEN UMBRELLA under the falling red curve (thumbnail A) → the five gores → the road with the DAY 030 milestone | 7 | 54% |
| c02 | Lead | 28,24–63,73 | 35.5 | The clock: day 30, not day 1 · record Oct 6 · four exits with names · the bubble | The flap counter (warm) → the road tilts up into the S&P line → the ROUTE MAP DAY 0 → 1,000 with four named exits → the bubble swells from today | 7 | 100% |
| c03 | B1 | 63,73–136,15 | 72.4 | What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China −40 % · first protection costs nothing | Inside the bubble skin: the data-center hall (cool) → Powell in a framed window (clip) → the scale, the IOUs, the 100-cell coin → outside again: the China bubble pops | 11 | 91% |
| c04 | B1 | 136,15–190,33 | 54.2 | The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause | Your table under the lamp (warm hero) → the red button → 100 calm points → three bars → the pause sign flies into gore 1 → the phone face down | 11 | 66% |
| c05 | B1 | 190,33–216,17 | 25.8 | Exit 1 · day 48 · the tariff crash | The road at night: the first exit sign; its face opens as a window (containers, the 2025 line touches bottom, the best day) | 7 | 68% |
| c06 | B1 | 216,17–252,79 | 36.6 | It reaches you without shares · protection 2: know what you own | The red line leaves the road into the town at the roadside → your mailbox → the fund as dots → the globe (a sixth) → the magnifier flies into gore 2 | 8 | 44% |
| c07 | B2 | 252,79–295,12 | 42.3 | It reaches paychecks · venture money halves · protection 3: a buffer · $400 · rent | The payslip → the halving stack → the glass door of the town → the envelope flies into gore 3 → the $400 bill in your hands → ten figures | 8 | 66% |
| c08 | B2 | 295,12–324,86 | 29.7 | Exits 2 + 3 · day 282 the rate shock · day 517 the financial crisis · the memory | The ROUTE MAP again: the dot runs on; each exit opens its window (price tag + dial; house of cards + frost) → the 2009 office memory → the road in winter light | 7 | 83% |
| c09 | B2 | 324,86–390,94 | 66.1 | Exit 4 · day 929 the dot-com bubble · what grew in the hangover · protection 4: use what got cheap | The last sign → two bubbles → the www shopfronts → the long line → the 2001 office, one lamp → five start points → the price tag steps down → today: your desk | 15 | 53% |
| c10 | B2 | 390,94–422,03 | 31.1 | Not enough alone · safety nets · 1933: deposit insurance | Many lonely roads → down under the road: three nets between pillars → the 1933 bank (window) → the first net → the cent → your bank app | 6 | 52% |
| c11 | B3 | 422,03–527,14 | 105.1 | Nets 2 + 3: Black Monday brake, March 2020, stress tests · THE HOLE: data-center debt · Hyperion · protection 5 · one question | Under the road: the 1987 pillar → the brake lever → the shake table → ★ three nets in morning light → the gap: DATA CENTER DEBT → hands knot a fourth net → your message | 21 | 78% |
| c12 | B3 | 527,14–631,26 | 104.1 | Day 1,000: the fall behind you · Hassabis (C3) · a new price, not gone · the harvest · the clock has barely started + end screen | The counter lands on 1,000 → ★ morning: the bubble gone, the hall still lit → the clip → the five gores light → many roads join over one net → your table → the phone turned over | 16 | 48% |

**Builders (seconds of picture):** Lead 64 s · B1 189 s · B2 169 s · B3 209 s (B3 includes the ≤ 15 s end screen). **Explainer share (weighted, spoken picture without the 24 s of clips):** **67 %** (pure [EXPL] 381 s + half of 30 s mixed, of 592 s; target 60–70 %). 124 shots, mean 4.8 s. Timing: `provisional_timing.json` (PROVISIONAL, from vo-v3.txt).

### c01 · Hook: the thumbnail picture · Nov 5 · CRASH? · not a tip, not timing, not luck · five things · 0,00–28,24 (28 s) · Lead · ★ – · [EXPL] 54%
Light/hero: Oxblood ground → night · hero: YOUR GOLDEN UMBRELLA under the falling red curve (thumbnail A) → the five gores → the road with the DAY 030 milestone

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 1.01 | [SCENE] | 0,00–3,98 | **survive** @1,59 · **crash** @3,11 | **[FRAME 0 = THUMBNAIL A]** Oxblood night ground, two flat hills, a ground line. **You** (yellow raincoat, from behind, right third) stand calmly under a **golden umbrella of light** (the hero, brightest thing). A **red price line** plunges from the top right and **shatters on the umbrella**: shards spray outward and fall slowly. Left: `WHAT PROTECTS YOU` (cream, ≥ 1/8 frame height, two lines), under it the small **flap counter `DAY 030`** (warm flaps). Frame 0–3 holds exactly this (silent preview), but alive: shards drift, the umbrella breathes, your coat hem moves. On **crash** a new step of the line snaps down and shatters (the first accent). | ① the line snaps + shatters ② shards fall | plan sequence |
| 1.02 | [EXPL] | 3,98–10,34 | **November fifth** @4,86 · **two trillion** @7,40 · **single day** @9,12 | Slow pull back and tilt up: the red line is a **day chart in the sky** over the plain; the title sinks to its baseline and is gone, the counter stays. On **November fifth** a label rises at the line's last drop: `NOV 5`; on **two trillion** a counter rolls `−$2 TRILLION` · `TECH STOCKS · ONE DAY` (`NPR`); on **single day** the last drop glows. | ① pull back ② counter | plan sequence |
| 1.03 | [EXPL] | 10,34–13,53 | **Nobody knows** @10,34 · **crash** @12,66 | A rubber stamp `CRASH?` lands on the line's tip (`stamp`), the question mark rocks once on **crash** and keeps rocking softly. | ① stamp lands | plan sequence |
| 1.04 | [SCENE] | 13,53–18,25 | **protects you** @15,36 · **stock tip** @17,05 | Down to you: on **protects you** the umbrella glows up; a paper note `HOT TIP ↑` blows in from the left on the wind, skims the umbrella and flutters away right (**stock tip**): it protects nothing. | ① the note flies past | plan sequence |
| 1.05 | [SCENE>EXPL] | 18,25–20,91 | **timing** @18,94 · **luck** @20,04 | One small symbol per word falls like a shard onto the umbrella and slides off: a **stopwatch** (**timing**), a **pair of dice** (**luck**); a gold rule strikes through each as it lands on the ground. | ① stopwatch ② dice | plan sequence |
| 1.06 | [EXPL] | 20,91–25,36 | **Five things** @20,91 · **one of them** @22,33 · **alone** @24,49 | **THE FIVE GORES.** Push up to the canopy: on **Five things** its five panels (gores) outline in gold, empty. On **one of them** the fifth gore lights its edge; on **alone** it widens and its rim reaches over three small indigo figures who step in under it (the one you can't do alone). | ① gores outline ② fifth widens | plan sequence |
| 1.07 | [SCENE] | 25,36–28,24 | **already have** @27,01 | The gores blink once in turn (**already have**). Pull back: the red ground cools to night (`crisis` 1 → 0); the ground line is a **road** running into mist; the counter `DAY 030` stands beside you as a **milestone** at its start. The umbrella folds and becomes the small **umbrella glyph** in the top-left corner (the kit HUD, five empty gores). | ① pull back ② the umbrella folds into the HUD | move · push to the milestone counter · centre · forward |

### c02 · The clock: day 30, not day 1 · record Oct 6 · four exits with names · the bubble · 28,24–63,73 (35 s) · Lead · ★ – · [EXPL] 100%
Light/hero: The flap counter (warm) → the road tilts up into the S&P line → the ROUTE MAP DAY 0 → 1,000 with four named exits → the bubble swells from today

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 28,24–35,19 | **November fifth** @31,72 · **day thirty** @33,98 | Close on the **flap counter** (the warm hero). A calendar leaf `NOV 5` is stuck on it; it peels and falls on **November fifth**. On **day thirty** the flaps snap hard to `DAY 030` (≤ 3 frames, the one hard accent), a shock runs through the frame. | ① leaf falls ② flaps snap | plan sequence |
| 2.02 | [EXPL] | 35,19–39,31 | **record high** @37,23 · **October sixth** @38,08 | Pull back: the road behind the counter tilts up and its edge becomes the **S&P 500 line** (morph). Its peak glows gold with a tiny flag on **record high**: `RECORD HIGH · OCT 6, 2026 · DAY 0`. On **October sixth** the counter rolls 000 → 030 while a dot slides from the peak down the line to today. | ① road → line ② dot + counter | plan sequence |
| 2.03 | [EXPL] | 39,31–45,44 | **four exits** @40,96 · **hit bottom** @44,23 | **THE ROUTE MAP.** The line straightens and lies flat: a horizontal route `DAY 0 ─── DAY 1,000` (top-down, like a transit line), today's dot at 30; the counter glides to the top-right corner (HUD, stays for the film). On **four exits** four stops grow out of the line, staggered left → right at 48 · 282 · 517 · 929 (true scale); on **hit bottom** each stop gets a tiny valley glyph. | ① four stops grow ② counter to HUD | plan sequence |
| 2.04 | [EXPL] | 45,44–51,31 | **tariff crash** @45,77 · **rate shock** @47,20 · **financial crisis** @48,61 · **dot-com bubble** @50,09 | One name per word, rising at its stop with its glyph: `THE TARIFF CRASH · 2025` (container) · `THE RATE SHOCK · 2022` (dial) · `THE FINANCIAL CRISIS · 2008` (bank façade with a crack) · `THE DOT-COM BUBBLE · 2000` (bubble with `www`). Names, not bare years. | ① names in turn | plan sequence |
| 2.05 | [EXPL] | 51,31–53,71 | **seven weeks** @52,18 | Stop 48 lights, the dot glides there and back: `≈ 7 WEEKS`. | ① stop 48 | plan sequence |
| 2.06 | [EXPL] | 53,71–58,91 | **two and a half years** @54,59 · **longest this century** @57,32 | A gold run along the line to stop 929 (camera trucks with it, no flight), the end tick `DAY 1,000` beyond it: `≈ 2.5 YEARS`; on **longest this century** `LONGEST FALL THIS CENTURY · S&P 500` under it. | ① the run to 929 ② truck | plan sequence |
| 2.07 | [EXPL] | 58,91–63,73 | **bubble** @60,56 · **inside it** @61,41 | Back at today's dot (day 30): on **bubble** a huge **soap bubble** swells out of the dot (origin!) and rises over the map (iridescent film in COOL + gold + a thread of red at the rim). On **inside it** the camera pushes to its skin. | ① the bubble swells ② push | **SEAM plateBubble** (Lead → B1): flight through the bubble skin · centre · forward |

### c03 · What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China −40 % · first protection costs nothing · 63,73–136,15 (72 s) · B1 · ★ 3.01 · [EXPL] 91%
Light/hero: Inside the bubble skin: the data-center hall (cool) → Powell in a framed window (clip) → the scale, the IOUs, the 100-cell coin → outside again: the China bubble pops

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **3.01 ★** | [SCENE] | 63,73–65,48 | **data centers** @64,25 | From plateBubble: inside, the curved film still shimmers at the frame edges. A long low **data-center hall** (rows of cool window light = the hero), two cranes, a truck with a chip crate, a new power line on masts. | ① pull back from the skin ② a crane swings | plan sequence |
| 3.02 | [EXPL] | 65,48–69,58 | **spend more** @67,72 | Beside the hall four stacks of money bundles grow in turn (2023 · 2024 · 2025 · 2026), each taller (proportion only; a number only if the fact check delivers one). | ① stacks grow in turn | plan sequence |
| 3.03 | [EXPL>SCENE] | 69,58–77,06 | **central banker** @72,13 · **sudden stop** @74,15 | On **sudden stop** a crane stops mid-swing (the hook keeps swinging, then settles). One lit window of the hall grows toward us and becomes a **framed window** (the vignette frame): a drawn press stage, flags, a lectern, `FEDERAL RESERVE · OCT 29, 2025`. | ① crane stops ② the window grows | transformation · window rect → clip rect · centre · forward |
| 3.04 | [CLIP] | 77,06–90,86 | (clip slot) | **[CLIP C1]** Powell, 13.2 s, inside the framed window (≥ 75 % frame width, gold rim, night around it, bubble film faint at the edges). Lower third (`clipLabel`): `JEROME POWELL · FED CHAIR · 2025 · ORIGINAL FOOTAGE`. Fallback without footage: quote card with the exact transcript (`clips.json`). | ① slow push on the window | plan sequence |
| 3.05 | [EXPL] | 90,86–95,82 | **unlike the dot-coms** @93,05 · **real profits** @94,59 | The window shrinks back into the hall. Two columns rise from the ground: `DOT-COM: IDEAS` (hollow outline) on **unlike the dot-coms**, `TODAY: PROFITS` (filled gold) on **real profits** · `POWELL, OCT 29, 2025`. | ① column 1 ② column 2 | transformation · the columns tip and become the arms of a scale · down |
| 3.06 | [EXPL] | 95,82–102,74 | **customers pay** @97,32 · **fraction** @99,85 | A **scale**: left pan the hall (big, cool), right pan a small cash register `WHAT CUSTOMERS PAY`; on **fraction** it tips clearly left. No numbers (fact check item 1). | ① the scale tips | plan sequence |
| 3.07 | [EXPL] | 102,74–106,62 | **borrowed money** @105,38 | Paper slips `IOU` slide in under the left pan one after another; the stack grows on **borrowed money**. | ① IOUs stack | transformation · the IOU stack rolls up into a coin · centre |
| 3.08 | [EXPL] | 106,62–115,94 | **rated safe** @108,67 · **two cents** @111,00 · **ten** @115,07 | A large **coin of 100 cells** (10 × 10 inside the circle) = `US INVESTMENT-GRADE COMPANY BONDS`. On **two cents** 2 cells turn cool (`2023: 2 %`), on **ten** 10 cells (`2026: 10 %`) · `KANSAS CITY FED`. | ① 2 cells ② 10 cells | plan sequence |
| 3.09 | [EXPL] | 115,94–121,40 | **slowdown** @117,26 · **either way** @120,19 | The coin slides aside; the cranes slow on **slowdown**, but a **payment calendar** beside them keeps flipping in the same beat: `DUE · DUE · DUE` on **either way**. | ① cranes slow ② calendar flips | move · pull back out through the bubble skin · back |
| 3.10 | [EXPL] | 121,40–131,27 | **Reuters** @122,24 · **already burst** @124,11 · **forty percent** @128,70 | Outside again (the route map faint below): beside our bubble a smaller one `CHINA · STAR 50` floats in; it **pops** on **already burst** (droplets fall); a red line under it falls on **forty percent**: `≈ −40 % IN UNDER 4 MONTHS` · `REUTERS, OCT 27, 2026`. | ① the small bubble pops ② the red line | plan sequence |
| 3.11 | [EXPL] | 131,27–136,15 | **pops here** @131,93 · **costs nothing** @133,83 | Our bubble trembles on **pops here**. On **costs nothing** the HUD umbrella (top left) grows into frame centre: gore 1 blinks with a small `$0`; the gore hums like a speaker membrane. | ① the bubble trembles ② the umbrella grows | transformation · gore 1 (a lit panel) drops and becomes your phone screen on the table · centre · down |

### c04 · The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause · 136,15–190,33 (54 s) · B1 · ★ 4.04 · [EXPL] 66%
Light/hero: Your table under the lamp (warm hero) → the red button → 100 calm points → three bars → the pause sign flies into gore 1 → the phone face down

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [SCENE] | 136,15–137,41 | **thirty-one** @136,48 | HUD flips `DAY 031`. **Your table** at dawn: one warm lamp (hero), a window grey-blue; your phone (the lit panel that fell) buzzes across the wood; your hands (yellow sleeves) reach. | ① phone buzzes ② your hands | plan sequence |
| 4.02 | [SCENE] | 137,41–142,30 | **phone** @138,76 · **news** @139,93 · **group chat** @141,10 | One slow truck along the table, no cuts: on **phone** the lock screen fills with red arrows; on **news** a laptop behind it runs a red ticker; on **group chat** a second phone lights with red chart bubbles. | ① truck ② screens light in turn | plan sequence |
| 4.03 | [EXPL] | 142,30–145,12 | **do something** @143,87 | Push into your phone: a big red button `DO SOMETHING`; your thumb hovers over it, trembling slightly. | ① push ② thumb | plan sequence |
| **4.04 ★** | [EXPL] | 145,12–148,58 | **financial crisis** @146,11 · **nobody ran** @147,37 | The button breaks into **100 points** (10 × 10) that settle calmly and turn from red to gold; `THE FINANCIAL CRISIS · 2008–09` on **financial crisis**. | ① button → points | plan sequence |
| 4.05 | [SCENE>EXPL] | 148,58–154,08 | **Fidelity** @148,58 · **tracked** @151,49 | The points rise and become the lit windows of a **tower at night** (framed vignette); `FIDELITY · 7.1 MILLION 401(k) ACCOUNTS`. On **tracked** a soft light passes along the windows. | ① points → windows | transformation · the windows fall back into the 100 points · down |
| 4.06 | [EXPL] | 154,08–158,36 | **two in a hundred** @154,74 | The 100 points again; on **two in a hundred** barely two detach and walk out left: `FEWER THAN 2 IN 100`. | ① two points leave | plan sequence |
| 4.07 | [EXPL] | 158,36–172,21 | **grown by about half** @162,57 · **a quarter** @167,25 · **two percent** @170,98 | The points stack into three **balance bars**, one per phrase: `STAYED +50 %` · `SOLD, CAME BACK LATER +25 %` · `LEFT, STAYED OUT +2 %` (barely moves) · `FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011`. | ① bars grow in turn | plan sequence |
| 4.08 | [EXPL] | 172,21–176,54 | **isn't a move** @173,60 · **pause** @175,67 | The two tall bars slide together into a **pause sign ‖** on **pause**; it flies on an arc to the HUD umbrella and lights **gore 1**: `1 · CALM IN THE LOUDEST WEEK`. | ① bars → pause ② flies to gore 1 | plan sequence |
| 4.09 | [SCENE] | 176,54–182,28 | **financial advice** @177,20 · **in the panic** @180,75 | Back at your table: your thumb withdraws from the screen. Small label `NOT FINANCIAL ADVICE` (≥ 2 s). | ① thumb withdraws | plan sequence |
| 4.10 | [EXPL] | 182,28–186,71 | **anything big** @185,47 | The phone screen shows a week calendar: `DAY 30–37` outlined red; three cards `JOB` · `MONEY` · `PLANS` slide out of it into the calmer next week on **anything big**. | ① cards slide | plan sequence |
| 4.11 | [SCENE] | 186,71–190,33 | **face down** @188,03 | Your hand turns the phone **face down** on the table: the red glow cuts off, the lamp stays (hero). The camera glides over the table edge: the edge line becomes the horizon of the road. | ① the phone turns ② glide over the edge | transformation · table edge → road horizon (same screen height) · forward |

### c05 · Exit 1 · day 48 · the tariff crash · 190,33–216,17 (26 s) · B1 · ★ 5.02 · [EXPL] 68%
Light/hero: The road at night: the first exit sign; its face opens as a window (containers, the 2025 line touches bottom, the best day)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE] | 190,33–192,78 | **forty-eight** @190,66 · **tariff crash** @191,57 | **[ROAD · anchor]** Night road, you walking (real gait), umbrella closed in hand. The sign `EXIT · DAY 48 · THE TARIFF CRASH · 2025` approaches from the right as you walk; HUD rattles 031 → 048. | ① you walk ② counter | plan sequence |
| **5.02 ★** | [EXPL] | 192,78–198,28 | **wave after wave** @194,04 · **around the world** @196,73 | **THE EXIT WINDOW:** the sign's face opens into a framed window: container stacks stamped `TARIFF` topple in waves on **wave after wave**; under them the 2025 S&P line falls (red). | ① containers topple ② the line falls | plan sequence |
| 5.03 | [EXPL] | 198,28–201,19 | **fall stopped** @199,96 | The line touches bottom; the bottom point turns gold (an exit is gold): `APR 8, 2025 · −19 % · DAY 48`. | ① the line lands | plan sequence |
| 5.04 | [EXPL] | 201,19–206,22 | **on hold** @205,02 | A stamp `ON HOLD` lands on the containers. | ① stamp | plan sequence |
| 5.05 | [EXPL] | 206,22–210,48 | **best day** @207,89 · **financial crisis** @209,21 | Right after the low a tall gold day bar shoots up: `APR 9, 2025 · S&P 500 +9.5 %` · `BEST DAY SINCE THE FINANCIAL CRISIS`. | ① the bar | plan sequence |
| 5.06 | [SCENE] | 210,48–213,18 | **don't know yet** @211,65 | The window folds back into the sign; the sign passes you; mist behind it. | ① sign passes | plan sequence |
| 5.07 | [SCENE] | 213,18–216,17 | **keep walking** @213,84 | You walk on; gore 1 in the HUD glows once. | ① you walk | plan sequence |

### c06 · It reaches you without shares · protection 2: know what you own · 216,17–252,79 (37 s) · B1 · ★ 6.05 · [EXPL] 44%
Light/hero: The red line leaves the road into the town at the roadside → your mailbox → the fund as dots → the globe (a sixth) → the magnifier flies into gore 2

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 6.01 | [SCENE] | 216,17–219,36 | **doesn't stop** @217,82 | The red line of the window does not stay in the sign: it slides out along the road's edge past you and over the verge, down toward the **town at the roadside** (houses, a lit shop window, a bus stop). | ① the red line runs ② camera pans down | plan sequence |
| 6.02 | [SCENE] | 219,36–223,26 | **never owned** @221,05 · **single share** @222,04 | The red line creeps along the pavement past the bus stop, the shop, an office entrance (indigo people alive: waiting, looking at phones). | ① the line creeps | plan sequence |
| 6.03 | [SCENE] | 223,26–224,79 | **you** @223,92 | It stops at **your mailbox**; you look down at it. | ① the line stops ② you look | plan sequence |
| 6.04 | [EXPL] | 224,79–230,87 | **pension** @225,78 · **whole market** @226,82 · **piece of this boom** @228,67 | A pension statement slides out of the mailbox; push into it: the fund dissolves into thousands of company dots on **whole market**; the tech dots glow cool on **piece of this boom**. | ① statement ② dots | plan sequence |
| **6.05 ★** | [EXPL] | 230,87–237,35 | **two memory-chip** @232,04 · **a sixth** @233,82 | The dots gather into a **globe**; on **two memory-chip** two tiny dots glow; on **a sixth** a ring around the globe fills one sixth in their light: `MAY 2026 · MICRON + SK HYNIX ≈ 1/6 OF THE WORLD MARKET'S GAINS` · `ACADIAN · MSCI ACWI`. | ① two dots ② the ring sixth | plan sequence |
| 6.06 | [EXPL] | 237,35–240,80 | **know what you own** @238,94 | A **magnifier** of light glides over the statement and flies to the HUD umbrella: **gore 2** lights · `2 · KNOW WHAT YOU OWN`. | ① magnifier ② gore 2 | plan sequence |
| 6.07 | [SCENE] | 240,80–246,80 | **fund holds** @242,12 · **this one boom** @245,27 | At the mailbox, close on your hands: your thumb scrolls a fund's top holdings (generic: `COMPANY A … F`); on **this one boom** some rows glow in the bubble's film colour. | ① scroll | plan sequence |
| 6.08 | [SCENE] | 246,80–252,79 | **can't see** @251,59 | You lower the phone, calmer (shoulders drop); gores 1 and 2 glow side by side in the HUD. The red line moves on from the mailbox into a payslip lying in the letterbox flap; push in. | ① you lower the phone ② push | **SEAM plateLine** (B1 → B2): the payslip close, the red line across it · centre · forward |

### c07 · It reaches paychecks · venture money halves · protection 3: a buffer · $400 · rent · 252,79–295,12 (42 s) · B2 · ★ – · [EXPL] 66%
Light/hero: The payslip → the halving stack → the glass door of the town → the envelope flies into gore 3 → the $400 bill in your hands → ten figures

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 7.01 | [EXPL] | 252,79–256,57 | **paychecks** @255,64 | From plateLine: the payslip (paper card of light) with the red line crossing it; on **paychecks** the net-pay line dims. | ① the line crosses | transformation · the payslip folds into a money stack · centre |
| 7.02 | [EXPL] | 256,57–261,69 | **dot-com bubble** @257,23 · **halved** @259,80 | A stack labelled `THE DOT-COM BUBBLE · 2001` sags to half on **halved**: `US VENTURE CAPITAL · 2001: $41B → 2002: $21B` · `PWC / NVCA MONEYTREE`. | ① the stack sags | move · back to the town: the glass door · right |
| 7.03 | [SCENE] | 261,69–269,67 | **hiring freeze** @264,56 · **canceled project** @266,00 · **never comes** @268,47 | You outside a glass office door at night, one composition, one slow push: on **hiring freeze** a sign `HIRING PAUSED` swings on the door; on **canceled project** a whiteboard behind the glass is wiped; on **never comes** your phone's inbox stays empty. | ① push ② three small beats | plan sequence |
| 7.04 | [EXPL] | 269,67–273,12 | **a buffer** @271,90 | The empty inbox folds into an **envelope**; it flies to the HUD umbrella: **gore 3** lights · `3 · A BUFFER`. | ① inbox → envelope ② gore 3 | plan sequence |
| 7.05 | [SCENE] | 273,12–276,42 | **four hundred dollars** @274,84 | A repair bill `$400` drifts down into your hands (you at the door, close). | ① the bill lands | plan sequence |
| 7.06 | [EXPL] | 276,42–282,79 | **six in ten** @277,95 | Ten figure icons rise in a row above the bill; six fill gold on **six in ten**: `63 % · FEDERAL RESERVE, SHED 2025`. | ① six fill | plan sequence |
| 7.07 | [SCENE>EXPL] | 282,79–289,07 | **few hundred dollars** @284,16 · **fall behind on rent** @287,20 | A thin envelope leans against a wobbling rent bill and holds it upright on **fall behind on rent** · `$250–749 IN SAVINGS · URBAN INSTITUTE`. | ① the bill wobbles ② the envelope holds it | plan sequence |
| 7.08 | [EXPL] | 289,07–295,12 | **time to think** @292,49 | An hourglass turns beside the envelope; the HUD counter starts to run fast, grows from the corner and fills the frame with its flaps. | ① hourglass ② counter grows | transformation · the counter flaps → the route map · forward |

### c08 · Exits 2 + 3 · day 282 the rate shock · day 517 the financial crisis · the memory · 295,12–324,86 (30 s) · B2 · ★ – · [EXPL] 83%
Light/hero: The ROUTE MAP again: the dot runs on; each exit opens its window (price tag + dial; house of cards + frost) → the 2009 office memory → the road in winter light

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 295,12–298,23 | **rate shock** @297,03 | **[ROUTE MAP · anchor]** Out of the flaps: the route map of 2.03; the dot runs from 48 to stop 282: `EXIT · DAY 282 · THE RATE SHOCK · 2022`. | ① the dot runs | plan sequence |
| 8.02 | [EXPL] | 298,23–305,21 | **prices rose** @299,47 · **forty years** @301,15 · **shot up** @303,02 | The stop opens its window: a supermarket price tag climbs (**prices rose**); a rate dial turns up (**shot up**); the 2022 line slides. | ① price tag ② dial | plan sequence |
| 8.03 | [EXPL] | 305,21–307,10 | **stopped here** @305,87 | The line touches bottom, gold dot: `OCT 12, 2022 · −25 % · DAY 282`; the window folds into the stop. | ① the line lands | plan sequence |
| 8.04 | [EXPL] | 307,10–310,28 | **financial crisis** @309,01 | The dot runs on to stop 517: `EXIT · DAY 517 · THE FINANCIAL CRISIS · 2008`. | ① the dot runs | plan sequence |
| 8.05 | [EXPL] | 310,28–317,79 | **risky home loans** @312,26 · **collapsed** @314,99 · **froze** @315,92 | Window: a house of cards made of home-loan contracts (**risky home loans**); a bank tower tips (**collapsed**) · `LEHMAN BROTHERS · SEPT 15, 2008`; frost spreads across a map of money lines (**froze**). | ① cards ② frost | plan sequence |
| 8.06 | [EXPL] | 317,79–319,67 | **bottom here** @318,45 | The deep 2007–09 line touches bottom: `MAR 9, 2009 · −57 % · DAY 517`. | ① the line lands | plan sequence |
| 8.07 | [SCENE] | 319,67–324,86 | **back then** @321,01 · **remember this exit** @322,18 | The window grows into a **memory**: an office, March 2009, in old-photo tones (indigo + faded gold): a CRT monitor with a red line, a flip phone, colleagues quiet at the coffee machine (alive: one sips, one shifts weight). On **remember this exit** the photo shrinks into an exit sign — and you walk past that sign on the road in winter light. | ① the memory ② shrink into the sign | plan sequence |

### c09 · Exit 4 · day 929 the dot-com bubble · what grew in the hangover · protection 4: use what got cheap · 324,86–390,94 (66 s) · B2 · ★ 9.12 · [EXPL] 53%
Light/hero: The last sign → two bubbles → the www shopfronts → the long line → the 2001 office, one lamp → five start points → the price tag steps down → today: your desk

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [SCENE] | 324,86–328,01 | **dot-com bubble** @326,78 | **[ROAD · anchor]** The last sign `EXIT · DAY 929 · THE DOT-COM BUBBLE · 2000`; HUD races to 929; the road rises. | ① sign ② counter | plan sequence |
| 9.02 | [EXPL] | 328,01–331,23 | **compared to most** @329,66 | The sign's `www` bubble swells off the sign to the left; our bubble (c02) floats in from the right: two bubbles shimmering alike, side by side. | ① www bubble ② our bubble | move · into the www bubble · forward |
| 9.03 | [SCENE] | 331,23–336,69 | **billions** @333,08 · **never made a profit** @334,81 | Inside the www bubble (framed by its film): empty shopfronts with `www.` neon, price tags in billions (**billions**), no customers (**never made a profit**). | ① tags swing | move · out of the bubble: its film becomes the exit window · back |
| 9.04 | [EXPL] | 336,69–343,58 | **finally stopped** @339,25 · **five more years** @342,05 | Exit window: a long, sluggish fall touches bottom (**finally stopped**); then a dotted creep back to the old-record line (**five more years**): `OCT 9, 2002 · −49 % · DAY 929 · BACK AT RECORD: MAY 30, 2007`. | ① the line lands ② dotted creep | plan sequence |
| 9.05 | [SCENE] | 343,58–347,29 | **don't know yet** @345,76 | The window folds shut; mist; the road ahead long and rising. | ① window folds | plan sequence |
| 9.06 | [SCENE] | 347,29–350,52 | **hangover** @349,60 | A window opens in the mist: an **empty open-plan office, 2001**: stacked chairs, a dot-com poster peeling off; one **desk lamp** burning (warm hero). | ① poster peels ② lamp breathes | plan sequence |
| 9.07 | [EXPL] | 350,52–354,66 | **Google** @352,06 · **first full-year profit** @353,08 | From the lamp a small bar jumps over a zero line: `GOOGLE · 2001 · FIRST FULL-YEAR PROFIT`. | ① the bar | plan sequence |
| 9.08 | [EXPL] | 354,66–361,30 | **Wikipedia** @354,66 · **YouTube** @356,84 · **climbed back** @360,08 | Timeline 2001–2007: the S&P line deep under the dotted old-record line; five start points light under it one per name (2001 · 2003 · 2003 · 2004 · 2005), names as type only, no logos; on **climbed back** the line still has not reached the dots' height. | ① five points in turn | plan sequence |
| 9.09 | [SCENE] | 361,30–364,62 | **hangover** @363,70 | Back in the office: at the lit desk three people now (indigo, alive: typing, leaning back). | ① people at the desk | plan sequence |
| 9.10 | [EXPL] | 364,62–372,23 | **keeps falling** @367,27 · **ten times cheaper** @370,01 | The desk monitor: a **price tag** `COST PER TASK` (`tag`) walks down a staircase, one step per year, each step ÷ 10 on **ten times cheaper**: `ROUGHLY 10× CHEAPER PER YEAR` · `EPOCH AI · A16Z · STANFORD AI INDEX`. | ① the tag steps down | plan sequence |
| 9.11 | [EXPL] | 372,23–375,69 | **became cheap** @374,48 | The tag flies to the HUD umbrella: **gore 4** lights · `4 · USE WHAT GOT CHEAP`. | ① gore 4 | plan sequence |
| **9.12 ★** | [SCENE] | 375,69–378,97 | **stocks** @376,68 · **tools** @378,10 | Time-morph in place (no world change): the 2001 desk becomes **your desk today**: the CRT becomes your laptop; on **stocks** a stock list flicks away, on **tools** a tool window opens (glyphs: translate, draft, code). | ① CRT → laptop ② tool window | plan sequence |
| 9.13 | [SCENE] | 378,97–383,38 | **headlines are still red** @381,46 | Behind you a TV flickers red headlines; you work on in the lamplight (hands moving, head tilts). | ① you work | plan sequence |
| 9.14 | [EXPL] | 383,38–386,16 | **all of them yours** @384,30 | The HUD umbrella grows into frame: four gores lit; gore 5 (wide) empty and pulsing. | ① umbrella grows | plan sequence |
| 9.15 | [SCENE] | 386,16–390,94 | **protects themselves** @388,53 | Pull back: many tiny figures on many parallel roads, each alone under its own small umbrella. | ① pull back | plan sequence |

### c10 · Not enough alone · safety nets · 1933: deposit insurance · 390,94–422,03 (31 s) · B2 · ★ 10.02 · [EXPL] 52%
Light/hero: Many lonely roads → down under the road: three nets between pillars → the 1933 bank (window) → the first net → the cent → your bank app

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [SCENE] | 390,94–395,09 | **stops being enough** @393,54 | **[ROAD · anchor]** You alone on the long road, your umbrella small. | ① slow push | plan sequence |
| **10.02 ★** | [SCENE] | 395,09–399,88 | **safety nets** @398,67 | The camera sinks below the road: **three nets** strung between old pillars, the pillars named `THE GREAT DEPRESSION · 1933` · `BLACK MONDAY · 1987` · `THE FINANCIAL CRISIS · 2008`. | ① descend ② nets sway | move · along pillar 1933, its stone becomes a bank column · forward |
| 10.03 | [SCENE] | 399,88–405,90 | **banks failed** @402,62 · **savings** @405,00 | Framed vignette (sepia-indigo): a crowd (silhouettes, alive) before a closed bank, `CLOSED` on the door; a man lifts an empty passbook on **savings**. | ① the crowd shifts ② the passbook | plan sequence |
| 10.04 | [EXPL] | 405,90–410,16 | **insure bank deposits** @408,57 | A sign `DEPOSITS INSURED` is screwed onto the bank door; the first net spans under the bank on **insure bank deposits**: `BANKING ACT 1933 · FDIC · INSURED FROM JAN 1, 1934`. | ① sign ② net spans | plan sequence |
| 10.05 | [EXPL] | 410,16–414,88 | **single cent** @412,65 | A single cent falls, lands in the net and stays there. | ① the cent falls | plan sequence |
| 10.06 | [EXPL] | 414,88–422,03 | **two hundred fifty thousand** @417,43 | The cent becomes a small net icon beside a balance in your banking app (phone in your hand, close): `US: $250,000 PER DEPOSITOR, PER BANK · EU: €100,000`. Pull back under the road to the 1987 pillar. | ① net icon ② pull back | **SEAM plateNet** (B2 → B3): under the road, the 1933 net close, the 1987 pillar centred ahead · forward |

### c11 · Nets 2 + 3: Black Monday brake, March 2020, stress tests · THE HOLE: data-center debt · Hyperion · protection 5 · one question · 422,03–527,14 (105 s) · B3 · ★ 11.08 · [EXPL] 78%
Light/hero: Under the road: the 1987 pillar → the brake lever → the shake table → ★ three nets in morning light → the gap: DATA CENTER DEBT → hands knot a fourth net → your message

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 11.01 | [SCENE] | 422,03–428,22 | **Dow** @424,66 · **quarter** @425,99 · **single day** @427,01 | From plateNet: along the 1987 pillar into a framed vignette: a trading floor 1987, paper flying, a red ticker band: `BLACK MONDAY · OCT 19, 1987 · DOW −22.6 %`. | ① paper flies | plan sequence |
| 11.02 | [EXPL] | 428,22–435,92 | **emergency brake** @430,73 · **trading stops** @434,70 | A big **emergency-brake lever** is mounted beside the floor with three marks; the second net spans: `CIRCUIT BREAKERS · S&P 500 −7 % · −13 % · −20 %`. | ① lever ② net | plan sequence |
| 11.03 | [EXPL] | 435,92–442,52 | **pandemic** @438,11 · **four times** @440,00 | A calendar `MARCH 2020`; the lever yanks down four times on four days: `THE COVID CRASH · MARCH 9 · 12 · 16 · 18, 2020`. | ① four pulls | plan sequence |
| 11.04 | [EXPL] | 442,52–446,00 | **fifteen minutes** @444,06 · **breathe** @445,11 | An hourglass `15:00` runs; the line stands still; on **breathe** hands on the floor lean back. | ① hourglass | plan sequence |
| 11.05 | [EXPL] | 446,00–449,09 | **never pulled** @447,88 | The lever today, untouched; HUD `DAY 030`; the −7 % mark sits clearly below the day's loss: `NOV 5, 2026 · S&P 500 −4.4 % · NO HALT`. | ① the lever stays | plan sequence |
| 11.06 | [EXPL] | 449,09–453,19 | **stress tests** @451,98 | A bank model on a **shake table**; the third net spans. | ① the table shakes | plan sequence |
| 11.07 | [EXPL] | 453,19–460,57 | **nightmare crash** @455,42 · **survive it** @459,35 | A storm of scenario sheets `SEVERELY ADVERSE` sweeps over the bank models; they wobble and stay: `BANK STRESS TESTS · EVERY YEAR SINCE THE FINANCIAL CRISIS`. | ① the storm ② they hold | plan sequence |
| **11.08 ★** | [SCENE] | 460,57–463,98 | **Three nets** @461,68 | **★ The nets.** Wide under the road: three nets in morning light, their pillars named; the camera glides along the last net through the 2 s pause, music carries. | ① glide ② nets sway | plan sequence |
| 11.09 | [EXPL] | 463,98–467,16 | **hole** @465,63 | Under the next stretch of road, labelled `DATA CENTER DEBT`, no net hangs; the camera tips into the gap on **hole**. | ① tip into the gap | plan sequence |
| 11.10 | [EXPL] | 467,16–473,09 | **never borrowed from a bank** @470,86 | Money streams flow past bank buildings into windowless fund towers. | ① streams | plan sequence |
| 11.11 | [SCENE] | 473,09–477,18 | **Louisiana** @475,09 · **Meta** @476,31 | Framed vignette: a giant construction site in flat land, cranes to the horizon: `HYPERION DATA CENTER · LOUISIANA`. | ① cranes turn | plan sequence |
| 11.12 | [EXPL] | 477,18–484,14 | **twenty-seven billion** @477,51 · **separate company** @480,62 · **investment firm** @482,87 | A box `SEPARATE COMPANY` with a debt stack (**twenty-seven billion**); its shares split 80 / 20 (**investment firm**): `≈ $27B BONDS · 80 % BLUE OWL / 20 % META`. | ① stack ② split | plan sequence |
| 11.13 | [EXPL] | 484,14–486,33 | **own books** @485,13 | An arrow runs past Meta's balance book; the book stays thin. | ① arrow | plan sequence |
| 11.14 | [EXPL] | 486,33–493,45 | **no insurance** @488,85 · **no brake** @489,74 · **no stress test** @490,58 | The three nets stretch toward the box, one per phrase, and fall short. | ① three reaches | plan sequence |
| 11.15 | [EXPL] | 493,45–501,60 | **visible** @495,62 · **Who holds it** @496,40 · **who pays** @498,74 | A cone of light falls into the box: names, sums, arrows appear in turn. | ① light cone | plan sequence |
| 11.16 | [EXPL] | 501,60–505,00 | **banks are tested** @503,46 | The box stands on the same shake table as the bank models. | ① the table shakes | plan sequence |
| 11.17 | [SCENE] | 505,00–511,27 | **after the damage** @507,31 · **before** @510,39 | Under the gap many hands start knotting a **fourth net** on **before**, while nothing has fallen yet. | ① the knots | plan sequence |
| 11.18 | [EXPL] | 511,27–515,60 | **can't build alone** @514,07 | The half-knotted net flies to the HUD umbrella: **gore 5** (wide) lights · `5 · SAFETY NETS · BUILT TOGETHER`. | ① gore 5 | plan sequence |
| 11.19 | [EXPL] | 515,60–517,93 | **decide it** @516,72 | Large hands labelled `LAWMAKERS` and `REGULATORS` hold the net's ends; your smaller hand (yellow sleeve) holds a strand beside them. | ① hands take the net | plan sequence |
| 11.20 | [SCENE] | 517,93–521,28 | **representative** @520,28 | You type a short message; recipient field `TO: YOUR REPRESENTATIVE`. | ① typing | plan sequence |
| 11.21 | [EXPL] | 521,28–527,14 | **who's checking it** @524,47 | The question stands large in the message field (≥ 4 s): `WHO HOLDS THE DEBT BEHIND THE DATA CENTERS, AND WHO'S CHECKING IT?` | ① lines rise | transformation · the send arrow becomes the HUD counter, which grows · forward |

### c12 · Day 1,000: the fall behind you · Hassabis (C3) · a new price, not gone · the harvest · the clock has barely started + end screen · 527,14–631,26 (104 s) · B3 · ★ 12.03 · [EXPL] 48%
Light/hero: The counter lands on 1,000 → ★ morning: the bubble gone, the hall still lit → the clip → the five gores light → many roads join over one net → your table → the phone turned over

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 12.01 | [EXPL] | 527,14–528,72 | **one thousand** @527,47 | The flap counter fills the frame, rattles and lands on `DAY 1,000` (the last hard accent). | ① flaps | plan sequence |
| 12.02 | [SCENE] | 528,72–535,60 | **longest one** @532,20 · **behind you** @534,05 | **[ROAD · anchor]** You at the goal sign `DAY 1,000`; you turn: all four exits lie behind you in the mist · `IF IT RAN LIKE THE DOT-COM BUBBLE · NOT A FORECAST`. | ① you turn ② pull back | plan sequence |
| **12.03 ★** | [SCENE] | 535,60–537,50 | **still standing** @536,26 | **★ Morning.** First warm light at the horizon; the bubble is gone, only glitter in the air; below, the data-center hall from c03 still stands, its lights on (cool) under the warm sky. | ① dawn ② glitter falls | plan sequence |
| 12.04 | [EXPL>SCENE] | 537,50–545,12 | **Google DeepMind** @538,53 · **bursts** @544,24 | One of the hall's lit windows grows into a framed window: a drawn interview studio, `DEC 16, 2025`. | ① the window grows | transformation · window rect → clip rect · centre · forward |
| 12.05 | [CLIP] | 545,12–554,87 | (clip slot) | **[CLIP C3]** Hassabis, 9.15 s, in the framed window (≥ 75 % width), big burned-in subtitles (spoken unevenly). Lower third: `DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · 2025 · ORIGINAL FOOTAGE`. Fallback: quote card with the exact transcript. | ① slow push | plan sequence |
| 12.06 | [EXPL] | 554,87–561,58 | **weigh his words** @556,78 · **went that way** @559,54 | The window shrinks; the five start points of 9.08 return and grow into large circles on **went that way**. | ① circles grow | plan sequence |
| 12.07 | [EXPL] | 561,58–567,65 | **new price** @562,90 · **away** @566,78 | The price tag of gore 4 hangs over a chip of light; on **new price** its number is rewritten lower; on **away** the chip under it keeps glowing. | ① the tag relabels ② the chip glows | plan sequence |
| 12.08 | [SCENE] | 567,65–575,63 | **cheaper than today** @573,17 · **everywhere** @574,69 | One slow truck along a morning street of lit windows: a clinic corridor, a classroom, a workshop, a kitchen table (indigo people at work, alive). | ① truck | plan sequence |
| 12.09 | [SCENE] | 575,63–581,85 | **front of it** @577,61 · **single stock** @580,64 | You at the `DAY 1,000` sign; on **single stock** the paper stock list of day 30 flutters out of your pocket and away. | ① paper flies | plan sequence |
| 12.10 | [EXPL] | 581,85–593,64 | **stayed calm** @582,51 · **what you owned** @586,07 · **a buffer** @588,59 · **what got cheap** @592,11 | **THE HARVEST.** Your umbrella opens large over you; one gore lights per line with its icon: phone face down · magnifier · envelope · price tag. | ① one gore per line | plan sequence |
| 12.11 | [SCENE] | 593,64–597,15 | **alone** @596,28 | Gore 5 lights and its net is finished; pull back: the many parallel roads of 9.15 join into one, a continuous net beneath, many people under one canopy of umbrellas. | ① roads join ② pull back | plan sequence |
| 12.12 | [EXPL] | 597,15–601,89 | **missing** @600,99 | The umbrella large, one gore blinks: `WHICH ONE IS MISSING?` | ① a gore blinks | plan sequence |
| 12.13 | [SCENE] | 601,89–607,63 | **one honest step** @605,09 | The road runs on past `DAY 1,000` into the morning; you walk on. | ① you walk | move · the lamp of your table rises out of the morning light · centre |
| 12.14 | [SCENE] | 607,63–610,01 | **hurt** @609,14 | Back at **your table** (c04), night, the lamp; HUD `DAY 030`; the phone face down. | ① lamp breathes | plan sequence |
| 12.15 | [EXPL] | 610,01–612,75 | **barely started** @611,51 | The HUD counter flips quietly to the upload day: `DAY 032` (Sat 7 Nov 2026; 6 Oct = DAY 0). | ① flaps | plan sequence |
| 12.16 | [SCENE] | 612,75–615,68 | **carry** @614,40 | Your hand turns the phone over: on its screen the umbrella with its five gores lit. Light. | ① the phone turns | pull back into the end screen |
| 12.17 | [SCENE] | 615,68–631,26 | – | End screen (VO end → film end, ≤ 15 s, no voice). The road at first light running into depth, the nets faint under it, you tiny with the umbrella closed in hand walking on; HUD `DAY 032`, its last flap trembling. **Free:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), quiet sky/road there; subscribe centre x 810–1110, y 330–600. Never static. | ① slow pull back ② you walk | – |

<!-- SHOTS:END -->

## 3 · Hard world changes (the whole background space is replaced; always carried, never a cut)
| # | Shot | ≈ time | Change | Carrier |
|---|---|---|---|---|
| 1 | 2.02 → 2.03 | 0:33 | road → ROUTE MAP | the road's edge tilts up into the S&P line, then lies flat as the route (morph) |
| 2 | 2.07 → 3.01 | 1:04 | route map → inside the bubble | the bubble swells out of today's dot; flight through its skin (`plateBubble`) |
| 3 | 3.09 → 3.10 | 1:58 | inside → outside the bubble | pull back through the skin; the route map lies below |
| 4 | 3.11 → 4.01 | 2:16 | explainer → your table | gore 1 (a lit panel) drops and becomes your phone's screen on the table (same screen position) |
| 5 | 4.11 → 5.01 | 3:10 | table → road | the table edge becomes the road's horizon (same screen height), glide forward |
| 6 | 7.08 → 8.01 | 4:55 | town → ROUTE MAP | the HUD counter grows and fills the frame; its flaps open onto the route map |
| 7 | 8.07 | 5:15 | memory office → road | the 2009 photo shrinks into the exit sign you walk past |
| 8 | 9.06 → 9.12 | 5:50 | road → 2001 office → your desk today | a window opens in the mist and grows to full frame; then a time-morph in place (CRT → laptop), no second change |
| 9 | 9.14 → 9.15 | 6:20 | desk → many roads | the HUD umbrella grows; pull back to many small umbrellas on parallel roads |
| 10 | 12.13 → 12.14 | 9:55 | morning road → your table at night | the table lamp rises out of the morning light (light → lamp, centre) |

10 changes in ≈ 10.5 min ≈ 0.95/min (budget ≤ ~1/min). **Not counted** (they open as a framed window inside the current picture and close back into it): the exit windows (5.02, 8.02, 8.05, 9.04), Powell's stage (3.03–3.05), the Fidelity tower (4.05), the www shops (9.03, inside the www bubble's film), the 1933 bank (10.03), the 1987 floor (11.01), Hyperion (11.11), Hassabis' studio (12.04–12.06). The nets under the road (10.02–11.17) belong to the road world (the camera sinks below it).

## 4 · Clips, quotes, numbers and on-screen text (exact; sources from `faktenzettel.md`, `clips.json`, later `faktencheck-v3.md`)
**Clips** (original footage, `clips.json`; the download runs via Remote Control on the iMac, MP4s go to `films/19-ai-crash/clips/`):
- **C1 Powell** (3.04, 13.2 s): FOMC press conference 29 Oct 2025, `gZsAKn1UtH4` 00:42:17.000–00:42:30.200. Lower third `JEROME POWELL · FED CHAIR · 2025 · ORIGINAL FOOTAGE`. Fallback (no footage by the build): quote card with the transcript, ≥ 4 s, the clip slot stays silent music.
- **C3 Hassabis** (12.05, 9.15 s): Google DeepMind "The future of intelligence", 16 Dec 2025, `PqVbypvxDto` 00:28:56.500–00:29:05.650. Lower third `DEMIS HASSABIS · CEO, GOOGLE DEEPMIND · 2025 · ORIGINAL FOOTAGE`; large burned-in subtitles.
- Clip share ≈ 22 s ≈ 3.6 % (rule: 3–6 clips, ≤ 8 %). Only 2 clips: the coordinator decides on a third (option C1b Warsh before 11.09, see `text-v3.md` notes).

**Numbers on screen (only these; ✱ = waiting for the fact check v3):**
| Shot | On screen | Source line |
|---|---|---|
| 1.01 | `WHAT PROTECTS YOU` · `DAY 030` | – |
| 1.02 | `NOV 5` · `−$2 TRILLION` · `TECH STOCKS · ONE DAY` | `NPR` |
| 1.03 | `CRASH?` | – |
| 2.02 | `RECORD HIGH · OCT 6, 2026 · DAY 0` | `S&P 500` |
| 2.03–2.06 | `DAY 0` … `DAY 1,000` · stops 48 / 282 / 517 / 929 · `THE TARIFF CRASH · 2025` · `THE RATE SHOCK · 2022` · `THE FINANCIAL CRISIS · 2008` · `THE DOT-COM BUBBLE · 2000` · `≈ 7 WEEKS` · `≈ 2.5 YEARS` · `LONGEST FALL THIS CENTURY · S&P 500` | `S&P 500, CLOSING PRICES` |
| 3.02 | stacks `2023 · 2024 · 2025 · 2026` (no amount ✱) | ✱ |
| 3.03–3.05 | `FEDERAL RESERVE · OCT 29, 2025` · `DOT-COM: IDEAS` · `TODAY: PROFITS` · `POWELL, OCT 29, 2025` | – |
| 3.06 | `WHAT CUSTOMERS PAY` (no numbers ✱) | ✱ |
| 3.08 | `US INVESTMENT-GRADE COMPANY BONDS` · `2023: 2 %` → `2026: 10 %` | `KANSAS CITY FED` ✱ |
| 3.10 | `CHINA · STAR 50` · `≈ −40 % IN UNDER 4 MONTHS` | `REUTERS, OCT 27, 2026` |
| 3.11 | `$0` | – |
| 4.04 | `THE FINANCIAL CRISIS · 2008–09` | – |
| 4.05–4.07 | `FIDELITY · 7.1 MILLION 401(k) ACCOUNTS` · `FEWER THAN 2 IN 100` · `STAYED +50 %` · `SOLD, CAME BACK LATER +25 %` · `LEFT, STAYED OUT +2 %` | `FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011` |
| 4.08 | `1 · CALM IN THE LOUDEST WEEK` | – |
| 4.09 | `NOT FINANCIAL ADVICE` | – |
| 5.01–5.05 | `EXIT · DAY 48 · THE TARIFF CRASH · 2025` · `TARIFF` · `APR 8, 2025 · −19 % · DAY 48` · `ON HOLD` · `APR 9, 2025 · S&P 500 +9.5 %` · `BEST DAY SINCE THE FINANCIAL CRISIS` | `S&P 500` ✱ (on-hold date) |
| 6.05 | `MAY 2026 · MICRON + SK HYNIX ≈ 1/6 OF THE WORLD MARKET'S GAINS` | `ACADIAN · MSCI ACWI` |
| 6.06 | `2 · KNOW WHAT YOU OWN` | – |
| 7.02 | `THE DOT-COM BUBBLE · 2001` · `US VENTURE CAPITAL · 2001: $41B → 2002: $21B` | `PWC / NVCA MONEYTREE` |
| 7.03 | `HIRING PAUSED` | – |
| 7.04 | `3 · A BUFFER` | – |
| 7.05–7.07 | `$400` · `63 %` · `$250–749 IN SAVINGS` | `FEDERAL RESERVE, SHED 2025` · `URBAN INSTITUTE` |
| 8.01–8.06 | `EXIT · DAY 282 · THE RATE SHOCK · 2022` · `OCT 12, 2022 · −25 % · DAY 282` · `EXIT · DAY 517 · THE FINANCIAL CRISIS · 2008` · `LEHMAN BROTHERS · SEPT 15, 2008` · `MAR 9, 2009 · −57 % · DAY 517` | `S&P 500` ✱ (inflation/rates wording) |
| 9.01–9.04 | `EXIT · DAY 929 · THE DOT-COM BUBBLE · 2000` · `www.` · `OCT 9, 2002 · −49 % · DAY 929 · BACK AT RECORD: MAY 30, 2007` | `S&P 500` |
| 9.07–9.08 | `GOOGLE · 2001 · FIRST FULL-YEAR PROFIT` · `WIKIPEDIA 2001 · LINKEDIN 2003 · SKYPE 2003 · FACEBOOK 2004 · YOUTUBE 2005` (type only) | – |
| 9.10–9.11 | `COST PER TASK` · `ROUGHLY 10× CHEAPER PER YEAR` · `4 · USE WHAT GOT CHEAP` | `EPOCH AI · A16Z · STANFORD AI INDEX` |
| 10.02 | `THE GREAT DEPRESSION · 1933` · `BLACK MONDAY · 1987` · `THE FINANCIAL CRISIS · 2008` (pillars) | – |
| 10.03–10.06 | `CLOSED` · `DEPOSITS INSURED` · `BANKING ACT 1933 · FDIC · INSURED FROM JAN 1, 1934` · `US: $250,000 PER DEPOSITOR, PER BANK · EU: €100,000` | `FDIC` ✱ |
| 11.01–11.05 | `BLACK MONDAY · OCT 19, 1987 · DOW −22.6 %` · `CIRCUIT BREAKERS · S&P 500 −7 % · −13 % · −20 %` · `THE COVID CRASH · MARCH 9 · 12 · 16 · 18, 2020` · `15:00` · `NOV 5, 2026 · S&P 500 −4.4 % · NO HALT` | ✱ |
| 11.06–11.07 | `SEVERELY ADVERSE` · `BANK STRESS TESTS · EVERY YEAR SINCE THE FINANCIAL CRISIS` | ✱ |
| 11.09–11.13 | `DATA CENTER DEBT` · `HYPERION DATA CENTER · LOUISIANA` · `SEPARATE COMPANY` · `≈ $27B BONDS · 80 % BLUE OWL / 20 % META` | ✱ (numbers differ by source) |
| 11.18–11.21 | `5 · SAFETY NETS · BUILT TOGETHER` · `LAWMAKERS` · `REGULATORS` · `TO: YOUR REPRESENTATIVE` · `WHO HOLDS THE DEBT BEHIND THE DATA CENTERS, AND WHO'S CHECKING IT?` | – |
| 12.01–12.04 | `DAY 1,000` · `IF IT RAN LIKE THE DOT-COM BUBBLE · NOT A FORECAST` · `DEC 16, 2025` | – |
| 12.12 | `WHICH ONE IS MISSING?` | – |
| 12.15 / end | `DAY 032` (upload Sat 7 Nov 2026; 6 Oct = DAY 0; change if the upload day moves) | – |

Rules for text: names of crashes, never bare years alone (`THE FINANCIAL CRISIS`, not `2008`); no first person anywhere (`TO: YOUR REPRESENTATIVE`); company names as type only, no logos; red only for losses. Fact-check notes for the picture: "tech stocks", never "AI stocks"; the US bubble is only ever "if"; Fidelity numbers are balances incl. contributions; the clock is "if it ran like…", never a forecast.
