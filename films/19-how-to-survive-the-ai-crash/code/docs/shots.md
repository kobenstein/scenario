# Film 19 · "How to Survive the AI Crash" · shot list (binding for all builders)

As of 2026-11-07 (picture lead, v2, Phase 2). Script `film-ai-crash/vo-v4.txt` (final after fact check 2: Warsh clip C1b inserted after "This time, we don't know yet."; Kansas City Fed card without "US"; line 26 "AI and chip stocks"). Generated tables between the SHOTS markers come from `tools/shots19.py` (edit the generator, then `python3 tools/shots19.py --md docs/shots.md`; the text outside the markers stays). Times are from the **real VO** `film-ai-crash/audio/timing.json` (610.1 s, audio commit 64c47e9); the code anchors on the **bold words** only (`T.G` / `T.GE` / `T.clip`), never on seconds, so a later re-mix moves everything with it.

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
| c01 | Lead | 0,00–25,52 | 25.5 | Hook: the thumbnail picture · Nov 5 · CRASH? · not a tip, not timing, not luck · five things | Night ground (no crisis red) · hero: YOUR GOLDEN UMBRELLA under the falling red curve (thumbnail A) → the five gores → the road with the DAY 030 milestone | 7 | 53% |
| c02 | Lead | 25,52–58,58 | 33.1 | The clock: day 30, not day 1 · record Oct 6 · four exits with names · the bubble | The flap counter (warm) → the road tilts up into the S&P line → the ROUTE MAP DAY 0 → 1,000 with four named exits → the bubble swells from today | 7 | 100% |
| c03 | B1 | 58,58–130,56 | 72.0 | What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China −40 % · first protection costs nothing | Inside the bubble skin: the data-center hall (cool) → Powell in a framed window (clip) → the scale, the IOUs, the 100-cell coin → outside again: the China bubble pops | 11 | 91% |
| c04 | B1 | 130,56–180,50 | 49.9 | The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause | Your table under the lamp (warm hero) → the red button → 100 calm points → three bars → the pause sign flies into gore 1 → the phone face down | 11 | 64% |
| c05 | B1 | 180,50–226,24 | 45.7 | Exit 1 · day 48 · the tariff crash | The road at night: the first exit sign; its face opens as a window (containers, the 2025 line touches bottom, the best day) | 9 | 61% |
| c06 | B1 | 226,24–257,61 | 31.4 | It reaches you without shares · protection 2: know what you own | The red line leaves the road into the town at the roadside → your mailbox → the fund as dots → the globe (a sixth) → the magnifier flies into gore 2 | 8 | 46% |
| c07 | B2 | 257,61–295,00 | 37.4 | It reaches paychecks · venture money halves · protection 3: a buffer · $400 · rent | The payslip → the halving stack → the glass door of the town → the envelope flies into gore 3 → the $400 bill in your hands → ten figures | 8 | 67% |
| c08 | B2 | 295,00–323,82 | 28.8 | Exits 2 + 3 · day 282 the rate shock · day 517 the financial crisis · the memory | The ROUTE MAP again: the dot runs on; each exit opens its window (price tag + dial; house of cards + frost) → the 2009 office memory → the road in winter light | 7 | 84% |
| c09 | B2 | 323,82–387,64 | 63.8 | Exit 4 · day 929 the dot-com bubble · what grew in the hangover · protection 4: use what got cheap | The last sign → two bubbles → the www shopfronts → the long line → the 2001 office, one lamp → five start points → the price tag steps down → today: your desk | 15 | 55% |
| c10 | B2 | 387,64–418,70 | 31.1 | Not enough alone · safety nets · 1933: deposit insurance | Many lonely roads → down under the road: three nets between pillars → the 1933 bank (window) → the first net → the cent → your bank app | 6 | 49% |
| c11 | B3 | 418,70–515,36 | 96.7 | Nets 2 + 3: Black Monday brake, March 2020, stress tests · THE HOLE: data-center debt · Hyperion · protection 5 · one question | Under the road: the 1987 pillar → the brake lever → the shake table → ★ three nets in morning light → the gap: DATA CENTER DEBT → hands knot a fourth net → your message | 21 | 77% |
| c12 | B3 | 515,36–610,11 | 94.7 | Day 1,000: the fall behind you · Hassabis (C3) · a new price, not gone · the harvest · the clock has barely started + end screen | The counter lands on 1,000 → ★ morning: the bubble gone, the hall still lit → the clip → the five gores light → many roads join over one net → your table → the phone turned over | 16 | 48% |

**Builders (seconds of picture):** Lead 59 s · B1 199 s · B2 161 s · B3 191 s (B3 includes the ≤ 15 s end screen). **Explainer share (weighted, spoken picture without the 38 s of clips):** **67 %** (pure [EXPL] 355 s + half of 34 s mixed, of 556 s; target 60–70 %). 126 shots, mean 4.4 s. Timing: `timing.json`.

### c01 · Hook: the thumbnail picture · Nov 5 · CRASH? · not a tip, not timing, not luck · five things · 0,00–25,52 (26 s) · Lead · ★ – · [EXPL] 53%
Light/hero: Night ground (no crisis red) · hero: YOUR GOLDEN UMBRELLA under the falling red curve (thumbnail A) → the five gores → the road with the DAY 030 milestone

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 1.01 | [SCENE] | 0,00–4,52 | **survive** @1,64 · **crash** @3,48 | **[FRAME 0 = THUMBNAIL A (night-blue version)]** Night-blue ground (channel palette), two flat hills, a ground line. **You** (yellow raincoat, from behind, right third) stand calmly under a **golden umbrella of light** (the hero, brightest thing). A **red price line** plunges from the top right and **shatters on the umbrella**: shards spray outward and fall slowly. Left: `WHAT PROTECTS YOU` (cream, ≥ 1/8 frame height, two lines), under it the small **flap counter `DAY 030`** (warm flaps). Frame 0–3 holds exactly this (silent preview), but alive: shards drift, the umbrella breathes, your coat hem moves. On **crash** a new step of the line snaps down and shatters (the first accent). | ① the line snaps + shatters ② shards fall | plan sequence |
| 1.02 | [EXPL] | 4,52–10,92 | **November fifth** @5,24 · **two trillion** @8,00 · **single day** @9,93 | Slow pull back and tilt up: the red line is a **day chart in the sky** over the plain; the title sinks to its baseline and is gone, the counter stays. On **November fifth** a label rises at the line's last drop: `NOV 5`; on **two trillion** a counter rolls `−$2 TRILLION` · `TECH STOCKS · ONE DAY` (`NPR`); on **single day** the last drop glows. | ① pull back ② counter | plan sequence |
| 1.03 | [EXPL] | 10,92–13,44 | **Nobody knows** @10,92 · **crash** @12,60 | A rubber stamp `CRASH?` lands on the line's tip (`stamp`), the question mark rocks once on **crash** and keeps rocking softly. | ① stamp lands | plan sequence |
| 1.04 | [SCENE] | 13,44–17,04 | **protects you** @14,80 · **stock tip** @15,96 | Down to you: on **protects you** the umbrella glows up; a paper note `HOT TIP ↑` blows in from the left on the wind, skims the umbrella and flutters away right (**stock tip**): it protects nothing. | ① the note flies past | plan sequence |
| 1.05 | [SCENE>EXPL] | 17,04–19,44 | **timing** @17,72 · **luck** @18,60 | One small symbol per word falls like a shard onto the umbrella and slides off: a **stopwatch** (**timing**), a **pair of dice** (**luck**); a gold rule strikes through each as it lands on the ground. | ① stopwatch ② dice | plan sequence |
| 1.06 | [EXPL] | 19,44–22,76 | **Five things** @19,44 · **one of them** @20,60 · **alone** @21,88 | **THE FIVE GORES.** Push up to the canopy: on **Five things** its five panels (gores) outline in gold, empty. On **one of them** the fifth gore lights its edge; on **alone** it widens and its rim reaches over three small indigo figures who step in under it (the one you can't do alone). | ① gores outline ② fifth widens | plan sequence |
| 1.07 | [SCENE] | 22,76–25,52 | **already have** @23,88 | The gores blink once in turn (**already have**). Pull back: the ground line is a **road** running into mist; the counter `DAY 030` stands beside you as a **milestone** at its start. The umbrella folds and becomes the small **umbrella glyph** in the top-left corner (the kit HUD, five empty gores). | ① pull back ② the umbrella folds into the HUD | move · push to the milestone counter · centre · forward |

### c02 · The clock: day 30, not day 1 · record Oct 6 · four exits with names · the bubble · 25,52–58,58 (33 s) · Lead · ★ – · [EXPL] 100%
Light/hero: The flap counter (warm) → the road tilts up into the S&P line → the ROUTE MAP DAY 0 → 1,000 with four named exits → the bubble swells from today

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 25,52–32,00 | **November fifth** @28,84 · **day thirty** @30,76 | Close on the **flap counter** (the warm hero). A calendar leaf `NOV 5` is stuck on it; it peels and falls on **November fifth**. On **day thirty** the flaps snap hard to `DAY 030` (≤ 3 frames, the one hard accent), a shock runs through the frame. | ① leaf falls ② flaps snap | plan sequence |
| 2.02 | [EXPL] | 32,00–35,92 | **record high** @33,60 · **October sixth** @34,68 | Pull back: the road behind the counter tilts up and its edge becomes the **S&P 500 line** (morph). Its peak glows gold with a tiny flag on **record high**: `RECORD HIGH · OCT 6, 2026 · DAY 0`. On **October sixth** the counter rolls 000 → 030 while a dot slides from the peak down the line to today. | ① road → line ② dot + counter | plan sequence |
| 2.03 | [EXPL] | 35,92–41,20 | **four exits** @37,12 · **hit bottom** @40,16 | **THE ROUTE MAP.** The line straightens and lies flat: a horizontal route `DAY 0 ─── DAY 1,000` (top-down, like a transit line), today's dot at 30; the counter glides to the top-right corner (HUD, stays for the film). On **four exits** four stops grow out of the line, staggered left → right at 48 · 282 · 517 · 929 (true scale); on **hit bottom** each stop gets a tiny valley glyph. | ① four stops grow ② counter to HUD | plan sequence |
| 2.04 | [EXPL] | 41,20–46,72 | **tariff crash** @41,36 · **rate shock** @42,64 · **financial crisis** @43,76 · **dot-com bubble** @45,28 | One name per word, rising at its stop with its glyph: `THE TARIFF CRASH · 2025` (container) · `THE RATE SHOCK · 2022` (dial) · `THE FINANCIAL CRISIS · 2008` (bank façade with a crack) · `THE DOT-COM BUBBLE · 2000` (bubble with `www`). Names, not bare years. | ① names in turn | plan sequence |
| 2.05 | [EXPL] | 46,72–49,04 | **seven weeks** @47,76 | Stop 48 lights, the dot glides there and back: `≈ 7 WEEKS`. | ① stop 48 | plan sequence |
| 2.06 | [EXPL] | 49,04–54,04 | **two and a half years** @50,12 · **longest this century** @52,00 | A gold run along the line to stop 929 (camera trucks with it, no flight), the end tick `DAY 1,000` beyond it: `≈ 2.5 YEARS`; on **longest this century** `LONGEST FALL THIS CENTURY · S&P 500` under it. | ① the run to 929 ② truck | plan sequence |
| 2.07 | [EXPL] | 54,04–58,58 | **bubble** @55,16 · **inside it** @56,12 | Back at today's dot (day 30): on **bubble** a huge **soap bubble** swells out of the dot (origin!) and rises over the map (iridescent film in COOL + gold + a thread of red at the rim). On **inside it** the camera pushes to its skin. | ① the bubble swells ② push | **SEAM plateBubble** (Lead → B1): flight through the bubble skin · centre · forward |

### c03 · What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China −40 % · first protection costs nothing · 58,58–130,56 (72 s) · B1 · ★ 3.01 · [EXPL] 91%
Light/hero: Inside the bubble skin: the data-center hall (cool) → Powell in a framed window (clip) → the scale, the IOUs, the 100-cell coin → outside again: the China bubble pops

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **3.01 ★** | [SCENE] | 58,58–60,82 | **data centers** @59,46 | From plateBubble: inside, the curved film still shimmers at the frame edges. A long low **data-center hall** (rows of cool window light = the hero), two cranes, a truck with a chip crate, a new power line on masts. | ① pull back from the skin ② a crane swings | plan sequence |
| 3.02 | [EXPL] | 60,82–64,26 | **spend more** @62,86 | Beside the hall four stacks of money bundles grow in turn (2023 · 2024 · 2025 · 2026), each taller (proportion only; a number only if the fact check delivers one). | ① stacks grow in turn | plan sequence |
| 3.03 | [EXPL>SCENE] | 64,26–70,66 | **central banker** @66,42 · **sudden drop** @68,14 | On **sudden drop** a crane stops mid-swing (the hook keeps swinging, then settles). One lit window of the hall grows toward us and becomes a **framed window** (the vignette frame): a drawn press stage, flags, a lectern, `FEDERAL RESERVE · OCT 29, 2025`. | ① crane stops ② the window grows | transformation · window rect → clip rect · centre · forward |
| 3.04 | [CLIP] | 70,66–84,84 | (clip slot) | **[CLIP C1]** Powell, 13.2 s, inside the framed window (≥ 75 % frame width, gold rim, night around it, bubble film faint at the edges). `clipWindow(ctx, t, T, "C1", rect, { from })` plays the real footage (`clips/C1.mp4`, press conference Oct 29, 2025); its lower third reads `JEROME POWELL · FED CHAIR · OCT 29, 2025 · ORIGINAL FOOTAGE`. Fallback without frames: quote card with the official Fed wording, cue by cue. | ① slow push on the window | plan sequence |
| 3.05 | [EXPL] | 84,84–90,52 | **unlike the dot-coms** @87,32 · **real profits** @89,08 | The window shrinks back into the hall. Two columns rise from the ground: `DOT-COM: IDEAS` (hollow outline) on **unlike the dot-coms**, `TODAY: PROFITS` (filled gold) on **real profits** · `POWELL, OCT 29, 2025`. | ① column 1 ② column 2 | transformation · the columns tip and become the arms of a scale · down |
| 3.06 | [EXPL] | 90,52–96,44 | **customers pay** @91,64 · **fraction** @94,20 | A **scale**: left pan the hall (big, cool), right pan a small cash register `WHAT CUSTOMERS PAY`; on **fraction** it tips clearly left. No numbers (fact check item 1). | ① the scale tips | plan sequence |
| 3.07 | [EXPL] | 96,44–100,06 | **borrowed money** @98,24 | Paper slips `IOU` slide in under the left pan one after another; the stack grows on **borrowed money**. | ① IOUs stack | transformation · the IOU stack rolls up into a coin · centre |
| 3.08 | [EXPL] | 100,06–110,54 | **good credit ratings** @103,98 · **two cents** @107,38 · **took ten** @109,46 | A large **coin of 100 cells** (10 × 10 inside the circle) = every new bond dollar: `NEW INVESTMENT-GRADE BONDS`. On **two cents** 2 cells turn cool (`2023: 2 %`), on **took ten** 10 cells (`2026 SO FAR: 10 %`) · `KANSAS CITY FED`. | ① 2 cells ② 10 cells | plan sequence |
| 3.09 | [EXPL] | 110,54–115,58 | **slowdown** @111,66 · **either way** @114,50 | The coin slides aside; the cranes slow on **slowdown**, but a **payment calendar** beside them keeps flipping in the same beat: `DUE · DUE · DUE` on **either way**. | ① cranes slow ② calendar flips | move · pull back out through the bubble skin · back |
| 3.10 | [EXPL] | 115,58–125,58 | **Reuters** @116,50 · **already burst** @118,06 · **forty percent** @123,14 | Outside again (the route map faint below): beside our bubble a smaller one `CHINA · STAR 50 · AI + CHIP STOCKS` floats in; it **pops** on **already burst** (droplets fall); a red line under it falls on **forty percent**: `≈ −40 % IN UNDER 4 MONTHS` · `REUTERS, OCT 27, 2026`. | ① the small bubble pops ② the red line | plan sequence |
| 3.11 | [EXPL] | 125,58–130,56 | **pops here** @125,90 · **costs nothing** @127,66 | Our bubble trembles on **pops here**. On **costs nothing** the HUD umbrella (top left) grows into frame centre: gore 1 blinks with a small `$0`; the gore hums like a speaker membrane. | ① the bubble trembles ② the umbrella grows | transformation · gore 1 (a lit panel) drops and becomes your phone screen on the table · centre · down |

### c04 · The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause · 130,56–180,50 (50 s) · B1 · ★ 4.04 · [EXPL] 64%
Light/hero: Your table under the lamp (warm hero) → the red button → 100 calm points → three bars → the pause sign flies into gore 1 → the phone face down

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [SCENE] | 130,56–132,08 | **thirty-one** @130,80 | HUD flips `DAY 031`. **Your table** at dawn: one warm lamp (hero), a window grey-blue; your phone (the lit panel that fell) buzzes across the wood; your hands (yellow sleeves) reach. | ① phone buzzes ② your hands | plan sequence |
| 4.02 | [SCENE] | 132,08–136,64 | **phone** @133,28 · **news** @134,16 · **group chat** @135,52 | One slow truck along the table, no cuts: on **phone** the lock screen fills with red arrows; on **news** a laptop behind it runs a red ticker; on **group chat** a second phone lights with red chart bubbles. | ① truck ② screens light in turn | plan sequence |
| 4.03 | [EXPL] | 136,64–139,60 | **do something** @138,28 | Push into your phone: a big red button `DO SOMETHING`; your thumb hovers over it, trembling slightly. | ① push ② thumb | plan sequence |
| **4.04 ★** | [EXPL] | 139,60–143,08 | **financial crisis** @140,24 · **nobody ran** @141,76 | The button breaks into **100 points** (10 × 10) that settle calmly and turn from red to gold; `THE FINANCIAL CRISIS · 2008–09` on **financial crisis**. | ① button → points | plan sequence |
| 4.05 | [SCENE>EXPL] | 143,08–148,72 | **Fidelity** @143,08 · **tracked** @146,56 | The points rise and become the lit windows of a **tower at night** (framed vignette); `FIDELITY · 7.1 MILLION 401(k) ACCOUNTS`. On **tracked** a soft light passes along the windows. | ① points → windows | transformation · the windows fall back into the 100 points · down |
| 4.06 | [EXPL] | 148,72–152,20 | **two in a hundred** @149,28 | The 100 points again; on **two in a hundred** barely two detach and walk out left: `FEWER THAN 2 IN 100`. | ① two points leave | plan sequence |
| 4.07 | [EXPL] | 152,20–163,16 | **grown by about half** @155,40 · **a quarter** @159,08 · **two percent** @162,00 | The points stack into three **balance bars**, one per phrase: `STAYED +50 %` · `SOLD, CAME BACK LATER +25 %` · `LEFT, STAYED OUT +2 %` (barely moves) · `FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011`. | ① bars grow in turn | plan sequence |
| 4.08 | [EXPL] | 163,16–167,70 | **isn't a move** @164,40 · **pause** @165,92 | The two tall bars slide together into a **pause sign ‖** on **pause**; it flies on an arc to the HUD umbrella and lights **gore 1**: `1 · CALM IN THE LOUDEST WEEK`. | ① bars → pause ② flies to gore 1 | plan sequence |
| 4.09 | [SCENE] | 167,70–172,98 | **financial advice** @168,34 · **in the panic** @171,70 | Back at your table: your thumb withdraws from the screen. Small label `NOT FINANCIAL ADVICE` (≥ 2 s). | ① thumb withdraws | plan sequence |
| 4.10 | [EXPL] | 172,98–176,66 | **anything big** @175,46 | The phone screen shows a week calendar: `DAY 30–37` outlined red; three cards `JOB` · `MONEY` · `PLANS` slide out of it into the calmer next week on **anything big**. | ① cards slide | plan sequence |
| 4.11 | [SCENE] | 176,66–180,50 | **face down** @177,54 | Your hand turns the phone **face down** on the table: the red glow cuts off, the lamp stays (hero). The camera glides over the table edge: the edge line becomes the horizon of the road. | ① the phone turns ② glide over the edge | transformation · table edge → road horizon (same screen height) · forward |

### c05 · Exit 1 · day 48 · the tariff crash · 180,50–226,24 (46 s) · B1 · ★ 5.02 · [EXPL] 61%
Light/hero: The road at night: the first exit sign; its face opens as a window (containers, the 2025 line touches bottom, the best day)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE] | 180,50–183,54 | **forty-eight** @180,82 · **tariff crash** @182,02 | **[ROAD · anchor]** Night road, you walking (real gait), umbrella closed in hand. The sign `EXIT · DAY 48 · THE TARIFF CRASH · 2025` approaches from the right as you walk; HUD rattles 031 → 048. | ① you walk ② counter | plan sequence |
| **5.02 ★** | [EXPL] | 183,54–189,66 | **wave after wave** @185,06 · **around the world** @188,10 | **THE EXIT WINDOW:** the sign's face opens into a framed window: container stacks stamped `TARIFF` topple in waves on **wave after wave**; under them the 2025 S&P line falls (red). | ① containers topple ② the line falls | plan sequence |
| 5.03 | [EXPL] | 189,66–192,30 | **fall stopped** @191,10 | The line touches bottom; the bottom point turns gold (an exit is gold): `APR 8, 2025 · −19 % · DAY 48`. | ① the line lands | plan sequence |
| 5.04 | [EXPL] | 192,30–195,90 | **on hold** @194,98 | A stamp `ON HOLD` lands on the containers. | ① stamp | plan sequence |
| 5.05 | [EXPL] | 195,90–199,74 | **best day** @197,06 · **financial crisis** @198,26 | Right after the low a tall gold day bar shoots up: `APR 9, 2025 · S&P 500 +9.5 %` · `BEST DAY SINCE THE FINANCIAL CRISIS`. | ① the bar | plan sequence |
| 5.06 | [SCENE] | 199,74–202,02 | **don't know yet** @200,78 | The window folds back into the sign; the sign passes you; mist behind it. | ① sign passes | plan sequence |
| 5.065 | [EXPL>SCENE] | 202,02–209,06 | **new chair** @203,62 · **Kevin Warsh** @205,50 · **choosier** @207,86 | Ahead in the mist a small lit rect hangs over the road (a window of light); on **new chair** it grows toward us into a framed window: a drawn press stage, `FEDERAL RESERVE · OCT 28, 2026`. On **choosier** a row of five IOU slips on the lectern: two are pushed aside. | ① the window grows ② slips | transformation · window rect → clip rect · centre · forward |
| 5.066 | [CLIP] | 209,06–222,62 | (clip slot) | **[CLIP C1b]** Warsh, 12.4 s, inside the framed window (≥ 75 % width, gold rim, mist around it). `clipWindow(…, "C1b", …)` plays `clips/C1b.mp4`; lower third `KEVIN WARSH · FED CHAIR · OCT 28, 2026 · ORIGINAL FOOTAGE`; fallback quote card with the transcript. Out: the window shrinks back into the mist and is the next stretch of road. | ① slow push | plan sequence |
| 5.07 | [SCENE] | 222,62–226,24 | **keep walking** @223,50 | You walk on; gore 1 in the HUD glows once. | ① you walk | plan sequence |

### c06 · It reaches you without shares · protection 2: know what you own · 226,24–257,61 (31 s) · B1 · ★ 6.05 · [EXPL] 46%
Light/hero: The red line leaves the road into the town at the roadside → your mailbox → the fund as dots → the globe (a sixth) → the magnifier flies into gore 2

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 6.01 | [SCENE] | 226,24–228,88 | **doesn't stop** @227,44 | The red line of the window does not stay in the sign: it slides out along the road's edge past you and over the verge, down toward the **town at the roadside** (houses, a lit shop window, a bus stop). | ① the red line runs ② camera pans down | plan sequence |
| 6.02 | [SCENE] | 228,88–232,00 | **never owned** @230,16 · **single share** @230,88 | The red line creeps along the pavement past the bus stop, the shop, an office entrance (indigo people alive: waiting, looking at phones). | ① the line creeps | plan sequence |
| 6.03 | [SCENE] | 232,00–233,44 | **you** @232,56 | It stops at **your mailbox**; you look down at it. | ① the line stops ② you look | plan sequence |
| 6.04 | [EXPL] | 233,44–238,04 | **pension** @234,05 · **whole market** @235,00 · **piece of this boom** @236,32 | A pension statement slides out of the mailbox; push into it: the fund dissolves into thousands of company dots on **whole market**; the tech dots glow cool on **piece of this boom**. | ① statement ② dots | plan sequence |
| **6.05 ★** | [EXPL] | 238,04–244,32 | **two memory-chip** @239,08 · **a sixth** @240,92 | The dots gather into a **globe**; on **two memory-chip** two tiny dots glow; on **a sixth** a ring around the globe fills one sixth in their light: `MAY 2026 · MICRON + SK HYNIX ≈ 1/6 OF THE WORLD MARKET'S GAINS` · `ACADIAN · MSCI ACWI`. | ① two dots ② the ring sixth | plan sequence |
| 6.06 | [EXPL] | 244,32–247,72 | **know what you own** @246,16 | A **magnifier** of light glides over the statement and flies to the HUD umbrella: **gore 2** lights · `2 · KNOW WHAT YOU OWN`. | ① magnifier ② gore 2 | plan sequence |
| 6.07 | [SCENE] | 247,72–252,00 | **fund holds** @248,52 · **this one boom** @250,64 | At the mailbox, close on your hands: your thumb scrolls a fund's top holdings (generic: `COMPANY A … F`); on **this one boom** some rows glow in the bubble's film colour. | ① scroll | plan sequence |
| 6.08 | [SCENE] | 252,00–257,61 | **can't see** @255,68 | You lower the phone, calmer (shoulders drop); gores 1 and 2 glow side by side in the HUD. The red line moves on from the mailbox into a payslip lying in the letterbox flap; push in. | ① you lower the phone ② push | **SEAM plateLine** (B1 → B2): the payslip close, the red line across it · centre · forward |

### c07 · It reaches paychecks · venture money halves · protection 3: a buffer · $400 · rent · 257,61–295,00 (37 s) · B2 · ★ – · [EXPL] 67%
Light/hero: The payslip → the halving stack → the glass door of the town → the envelope flies into gore 3 → the $400 bill in your hands → ten figures

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 7.01 | [EXPL] | 257,61–261,22 | **paychecks** @260,10 | From plateLine: the payslip (paper card of light) with the red line crossing it; on **paychecks** the net-pay line dims. | ① the line crosses | transformation · the payslip folds into a money stack · centre |
| 7.02 | [EXPL] | 261,22–266,34 | **dot-com bubble** @261,54 · **halved** @264,58 | A stack labelled `THE DOT-COM BUBBLE · 2001` sags to half on **halved**: `US VENTURE CAPITAL · 2001: $41B → 2002: $21B` · `PWC / NVCA MONEYTREE`. | ① the stack sags | move · back to the town: the glass door · right |
| 7.03 | [SCENE] | 266,34–273,38 | **hiring freeze** @268,55 · **canceled project** @269,82 · **never comes** @272,18 | You outside a glass office door at night, one composition, one slow push: on **hiring freeze** a sign `HIRING PAUSED` swings on the door; on **canceled project** a whiteboard behind the glass is wiped; on **never comes** your phone's inbox stays empty. | ① push ② three small beats | plan sequence |
| 7.04 | [EXPL] | 273,38–276,90 | **a buffer** @275,62 | The empty inbox folds into an **envelope**; it flies to the HUD umbrella: **gore 3** lights · `3 · A BUFFER`. | ① inbox → envelope ② gore 3 | plan sequence |
| 7.05 | [SCENE] | 276,90–279,58 | **four hundred dollars** @278,26 | A repair bill `$400` drifts down into your hands (you at the door, close). | ① the bill lands | plan sequence |
| 7.06 | [EXPL] | 279,58–284,54 | **six in ten** @281,06 | Ten figure icons rise in a row above the bill; six fill gold on **six in ten**: `63 % · FEDERAL RESERVE, SHED 2025`. | ① six fill | plan sequence |
| 7.07 | [SCENE>EXPL] | 284,54–289,62 | **few hundred dollars** @285,54 · **fall behind on rent** @288,18 | A thin envelope leans against a wobbling rent bill and holds it upright on **fall behind on rent** · `$250–749 IN SAVINGS · URBAN INSTITUTE`. | ① the bill wobbles ② the envelope holds it | plan sequence |
| 7.08 | [EXPL] | 289,62–295,00 | **time to think** @292,22 | An hourglass turns beside the envelope; the HUD counter starts to run fast, grows from the corner and fills the frame with its flaps. | ① hourglass ② counter grows | transformation · the counter flaps → the route map · forward |

### c08 · Exits 2 + 3 · day 282 the rate shock · day 517 the financial crisis · the memory · 295,00–323,82 (29 s) · B2 · ★ – · [EXPL] 84%
Light/hero: The ROUTE MAP again: the dot runs on; each exit opens its window (price tag + dial; house of cards + frost) → the 2009 office memory → the road in winter light

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 295,00–298,36 | **rate shock** @297,08 | **[ROUTE MAP · anchor]** Out of the flaps: the route map of 2.03; the dot runs from 48 to stop 282: `EXIT · DAY 282 · THE RATE SHOCK · 2022`. | ① the dot runs | plan sequence |
| 8.02 | [EXPL] | 298,36–304,92 | **prices rose** @299,64 · **forty years** @301,40 · **shot up** @303,40 | The stop opens its window: a supermarket price tag climbs (**prices rose**); a rate dial turns up (**shot up**); the 2022 line slides. | ① price tag ② dial | plan sequence |
| 8.03 | [EXPL] | 304,92–306,76 | **stopped here** @305,48 | The line touches bottom, gold dot: `OCT 12, 2022 · −25 % · DAY 282`; the window folds into the stop. | ① the line lands | plan sequence |
| 8.04 | [EXPL] | 306,76–310,64 | **financial crisis** @308,92 | The dot runs on to stop 517: `EXIT · DAY 517 · THE FINANCIAL CRISIS · 2008`. | ① the dot runs | plan sequence |
| 8.05 | [EXPL] | 310,64–317,48 | **risky home loans** @312,20 · **collapsed** @314,88 · **froze** @315,96 | Window: a house of cards made of home-loan contracts (**risky home loans**); a bank tower tips (**collapsed**) · `LEHMAN BROTHERS · SEPT 15, 2008`; frost spreads across a map of money lines (**froze**). | ① cards ② frost | plan sequence |
| 8.06 | [EXPL] | 317,48–319,08 | **bottom here** @318,00 | The deep 2007–09 line touches bottom: `MAR 9, 2009 · −57 % · DAY 517`. | ① the line lands | plan sequence |
| 8.07 | [SCENE] | 319,08–323,82 | **back then** @319,92 · **remember this exit** @320,88 | The window grows into a **memory**: an office, March 2009, in old-photo tones (indigo + faded gold): a CRT monitor with a red line, a flip phone, colleagues quiet at the coffee machine (alive: one sips, one shifts weight). On **remember this exit** the photo shrinks into an exit sign — and you walk past that sign on the road in winter light. | ① the memory ② shrink into the sign | plan sequence |

### c09 · Exit 4 · day 929 the dot-com bubble · what grew in the hangover · protection 4: use what got cheap · 323,82–387,64 (64 s) · B2 · ★ 9.12 · [EXPL] 55%
Light/hero: The last sign → two bubbles → the www shopfronts → the long line → the 2001 office, one lamp → five start points → the price tag steps down → today: your desk

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [SCENE] | 323,82–327,90 | **dot-com bubble** @326,30 | **[ROAD · anchor]** The last sign `EXIT · DAY 929 · THE DOT-COM BUBBLE · 2000`; HUD races to 929; the road rises. | ① sign ② counter | plan sequence |
| 9.02 | [EXPL] | 327,90–330,86 | **compared to most** @329,26 | The sign's `www` bubble swells off the sign to the left; our bubble (c02) floats in from the right: two bubbles shimmering alike, side by side. | ① www bubble ② our bubble | move · into the www bubble · forward |
| 9.03 | [SCENE] | 330,86–335,74 | **billions** @332,38 · **never made a profit** @334,14 | Inside the www bubble (framed by its film): empty shopfronts with `www.` neon, price tags in billions (**billions**), no customers (**never made a profit**). | ① tags swing | move · out of the bubble: its film becomes the exit window · back |
| 9.04 | [EXPL] | 335,74–342,46 | **finally stopped** @338,14 · **five more years** @340,94 | Exit window: a long, sluggish fall touches bottom (**finally stopped**); then a dotted creep back to the old-record line (**five more years**): `OCT 9, 2002 · −49 % · DAY 929 · BACK AT RECORD: MAY 30, 2007`. | ① the line lands ② dotted creep | plan sequence |
| 9.05 | [SCENE] | 342,46–345,42 | **don't know yet** @344,30 | The window folds shut; mist; the road ahead long and rising. | ① window folds | plan sequence |
| 9.06 | [SCENE] | 345,42–347,74 | **hangover** @346,78 | A window opens in the mist: an **empty open-plan office, 2001**: stacked chairs, a dot-com poster peeling off; one **desk lamp** burning (warm hero). | ① poster peels ② lamp breathes | plan sequence |
| 9.07 | [EXPL] | 347,74–351,66 | **Google** @349,14 · **first full-year profit** @349,90 | From the lamp a small bar jumps over a zero line: `GOOGLE · 2001 · FIRST FULL-YEAR PROFIT`. | ① the bar | plan sequence |
| 9.08 | [EXPL] | 351,66–358,70 | **Wikipedia** @351,66 · **YouTube** @354,62 · **climbed back** @357,58 | Timeline 2001–2007: the S&P line deep under the dotted old-record line; five start points light under it one per name (2001 · 2003 · 2003 · 2004 · 2005), names as type only, no logos; on **climbed back** the line still has not reached the dots' height. | ① five points in turn | plan sequence |
| 9.09 | [SCENE] | 358,70–362,00 | **hangover** @360,14 | Back in the office: at the lit desk three people now (indigo, alive: typing, leaning back). | ① people at the desk | plan sequence |
| 9.10 | [EXPL] | 362,00–370,08 | **keeps falling** @364,96 · **ten times cheaper** @367,88 | The desk monitor: a **price tag** `COST PER TASK` (`tag`) walks down a staircase, one step per year, each step ÷ 10 on **ten times cheaper**: `ROUGHLY 10× CHEAPER PER YEAR` · `EPOCH AI · A16Z · STANFORD AI INDEX`. | ① the tag steps down | plan sequence |
| 9.11 | [EXPL] | 370,08–373,48 | **became cheap** @372,24 | The tag flies to the HUD umbrella: **gore 4** lights · `4 · USE WHAT GOT CHEAP`. | ① gore 4 | plan sequence |
| **9.12 ★** | [SCENE] | 373,48–376,36 | **stocks** @374,44 · **tools** @375,60 | Time-morph in place (no world change): the 2001 desk becomes **your desk today**: the CRT becomes your laptop; on **stocks** a stock list flicks away, on **tools** a tool window opens (glyphs: translate, draft, code). | ① CRT → laptop ② tool window | plan sequence |
| 9.13 | [SCENE] | 376,36–379,44 | **headlines are still red** @377,80 | Behind you a TV flickers red headlines; you work on in the lamplight (hands moving, head tilts). | ① you work | plan sequence |
| 9.14 | [EXPL] | 379,44–382,16 | **all of them yours** @380,72 | The HUD umbrella grows into frame: four gores lit; gore 5 (wide) empty and pulsing. | ① umbrella grows | plan sequence |
| 9.15 | [SCENE] | 382,16–387,64 | **protects themselves** @384,16 | Pull back: many tiny figures on many parallel roads, each alone under its own small umbrella. | ① pull back | plan sequence |

### c10 · Not enough alone · safety nets · 1933: deposit insurance · 387,64–418,70 (31 s) · B2 · ★ 10.02 · [EXPL] 49%
Light/hero: Many lonely roads → down under the road: three nets between pillars → the 1933 bank (window) → the first net → the cent → your bank app

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [SCENE] | 387,64–392,28 | **stops being enough** @390,44 | **[ROAD · anchor]** You alone on the long road, your umbrella small. | ① slow push | plan sequence |
| **10.02 ★** | [SCENE] | 392,28–397,08 | **safety nets** @395,72 | The camera sinks below the road: **three nets** strung between old pillars, the pillars named `THE GREAT DEPRESSION · 1933` · `BLACK MONDAY · 1987` · `THE FINANCIAL CRISIS · 2008`. | ① descend ② nets sway | move · along pillar 1933, its stone becomes a bank column · forward |
| 10.03 | [SCENE] | 397,08–403,36 | **banks failed** @399,96 · **savings** @402,24 | Framed vignette (sepia-indigo): a crowd (silhouettes, alive) before a closed bank, `CLOSED` on the door; a man lifts an empty passbook on **savings**. | ① the crowd shifts ② the passbook | plan sequence |
| 10.04 | [EXPL] | 403,36–408,08 | **insure bank deposits** @406,20 | A sign `DEPOSITS INSURED` is screwed onto the bank door; the first net spans under the bank on **insure bank deposits**: `BANKING ACT 1933 · FDIC · INSURED FROM JAN 1, 1934`. | ① sign ② net spans | plan sequence |
| 10.05 | [EXPL] | 408,08–411,96 | **single cent** @410,04 | A single cent falls, lands in the net and stays there. | ① the cent falls | plan sequence |
| 10.06 | [EXPL] | 411,96–418,70 | **two hundred fifty thousand** @413,96 | The cent becomes a small net icon beside a balance in your banking app (phone in your hand, close): `US: $250,000 PER DEPOSITOR, PER BANK · EU: €100,000`. Pull back under the road to the 1987 pillar. | ① net icon ② pull back | **SEAM plateNet** (B2 → B3): under the road, the 1933 net close, the 1987 pillar centred ahead · forward |

### c11 · Nets 2 + 3: Black Monday brake, March 2020, stress tests · THE HOLE: data-center debt · Hyperion · protection 5 · one question · 418,70–515,36 (97 s) · B3 · ★ 11.08 · [EXPL] 77%
Light/hero: Under the road: the 1987 pillar → the brake lever → the shake table → ★ three nets in morning light → the gap: DATA CENTER DEBT → hands knot a fourth net → your message

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 11.01 | [SCENE] | 418,70–424,30 | **Dow** @421,26 · **quarter** @422,38 · **single day** @423,37 | From plateNet: along the 1987 pillar into a framed vignette: a trading floor 1987, paper flying, a red ticker band: `BLACK MONDAY · OCT 19, 1987 · DOW −22.6 %`. | ① paper flies | plan sequence |
| 11.02 | [EXPL] | 424,30–431,37 | **emergency brake** @426,42 · **trading stops** @429,87 | A big **emergency-brake lever** is mounted beside the floor with three marks; the second net spans: `CIRCUIT BREAKERS · S&P 500 −7 % · −13 % · −20 %`. | ① lever ② net | plan sequence |
| 11.03 | [EXPL] | 431,37–436,70 | **pandemic** @432,86 · **four times** @434,62 | A calendar `MARCH 2020`; the lever yanks down four times on four days: `THE COVID CRASH · MARCH 9 · 12 · 16 · 18, 2020`. | ① four pulls | plan sequence |
| 11.04 | [EXPL] | 436,70–439,94 | **fifteen minutes** @438,14 · **breathe** @439,02 | An hourglass `15:00` runs; the line stands still; on **breathe** hands on the floor lean back. | ① hourglass | plan sequence |
| 11.05 | [EXPL] | 439,94–443,28 | **never pulled** @441,54 | The lever today, untouched; HUD `DAY 030`; the −7 % mark sits clearly below the day's loss: `NOV 5, 2026 · S&P 500 −4.4 % · NO HALT`. | ① the lever stays | plan sequence |
| 11.06 | [EXPL] | 443,28–448,08 | **stress tests** @446,56 | A bank model on a **shake table**; the third net spans. | ① the table shakes | plan sequence |
| 11.07 | [EXPL] | 448,08–455,24 | **nightmare crash** @450,40 · **survive it** @454,00 | A storm of scenario sheets `SEVERELY ADVERSE` sweeps over the bank models; they wobble and stay: `BANK STRESS TESTS · EVERY YEAR SINCE THE FINANCIAL CRISIS`. | ① the storm ② they hold | plan sequence |
| **11.08 ★** | [SCENE] | 455,24–459,22 | **Three nets** @456,52 | **★ The nets.** Wide under the road: three nets in morning light, their pillars named; the camera glides along the last net through the 2 s pause, music carries. | ① glide ② nets sway | plan sequence |
| 11.09 | [EXPL] | 459,22–461,78 | **hole** @460,74 | Under the next stretch of road, labelled `DATA CENTER DEBT`, no net hangs; the camera tips into the gap on **hole**. | ① tip into the gap | plan sequence |
| 11.10 | [EXPL] | 461,78–466,46 | **never borrowed from a bank** @464,50 | Money streams flow past bank buildings into windowless fund towers. | ① streams | plan sequence |
| 11.11 | [SCENE] | 466,46–469,94 | **Louisiana** @467,94 · **Meta** @469,14 | Framed vignette: a giant construction site in flat land, cranes to the horizon: `HYPERION DATA CENTER · LOUISIANA`. | ① cranes turn | plan sequence |
| 11.12 | [EXPL] | 469,94–475,98 | **twenty-seven billion** @470,26 · **separate company** @472,85 · **investment firm** @474,90 | A box `SEPARATE COMPANY` with a debt stack (**twenty-seven billion**); its shares split 80 / 20 (**investment firm**): `≈ $27B BONDS · 80 % BLUE OWL / 20 % META`. | ① stack ② split | plan sequence |
| 11.13 | [EXPL] | 475,98–477,86 | **own books** @476,74 | An arrow runs past Meta's balance book; the book stays thin. | ① arrow | plan sequence |
| 11.14 | [EXPL] | 477,86–483,78 | **no insurance** @479,90 · **no brake** @480,78 · **no stress test** @481,58 | The three nets stretch toward the box, one per phrase, and fall short. | ① three reaches | plan sequence |
| 11.15 | [EXPL] | 483,78–490,62 | **visible** @485,78 · **Who holds it** @486,66 · **who pays** @488,34 | A cone of light falls into the box: names, sums, arrows appear in turn. | ① light cone | plan sequence |
| 11.16 | [EXPL] | 490,62–494,04 | **banks are tested** @491,98 | The box stands on the same shake table as the bank models. | ① the table shakes | plan sequence |
| 11.17 | [SCENE] | 494,04–499,80 | **after the damage** @496,12 · **before** @498,96 | Under the gap many hands start knotting a **fourth net** on **before**, while nothing has fallen yet. | ① the knots | plan sequence |
| 11.18 | [EXPL] | 499,80–503,48 | **can't build alone** @502,04 | The half-knotted net flies to the HUD umbrella: **gore 5** (wide) lights · `5 · SAFETY NETS · BUILT TOGETHER`. | ① gore 5 | plan sequence |
| 11.19 | [EXPL] | 503,48–506,12 | **decide it** @505,00 | Large hands labelled `LAWMAKERS` and `REGULATORS` hold the net's ends; your smaller hand (yellow sleeve) holds a strand beside them. | ① hands take the net | plan sequence |
| 11.20 | [SCENE] | 506,12–509,12 | **representative** @507,96 | You type a short message; recipient field `TO: YOUR REPRESENTATIVE`. | ① typing | plan sequence |
| 11.21 | [EXPL] | 509,12–515,36 | **who's checking it** @511,84 | The question stands large in the message field (≥ 4 s): `WHO HOLDS THE DEBT BEHIND THE DATA CENTERS, AND WHO'S CHECKING IT?` | ① lines rise | transformation · the send arrow becomes the HUD counter, which grows · forward |

### c12 · Day 1,000: the fall behind you · Hassabis (C3) · a new price, not gone · the harvest · the clock has barely started + end screen · 515,36–610,11 (95 s) · B3 · ★ 12.03 · [EXPL] 48%
Light/hero: The counter lands on 1,000 → ★ morning: the bubble gone, the hall still lit → the clip → the five gores light → many roads join over one net → your table → the phone turned over

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 12.01 | [EXPL] | 515,36–517,28 | **one thousand** @515,60 | The flap counter fills the frame, rattles and lands on `DAY 1,000` (the last hard accent). | ① flaps | plan sequence |
| 12.02 | [SCENE] | 517,28–523,00 | **longest one** @519,88 · **behind you** @521,56 | **[ROAD · anchor]** You at the goal sign `DAY 1,000`; you turn: all four exits lie behind you in the mist · `IF IT RAN LIKE THE DOT-COM BUBBLE · NOT A FORECAST`. | ① you turn ② pull back | plan sequence |
| **12.03 ★** | [SCENE] | 523,00–525,20 | **still standing** @523,80 | **★ Morning.** First warm light at the horizon; the bubble is gone, only glitter in the air; below, the data-center hall from c03 still stands, its lights on (cool) under the warm sky. | ① dawn ② glitter falls | plan sequence |
| 12.04 | [EXPL>SCENE] | 525,20–533,04 | **Google DeepMind** @526,56 · **bursts** @531,84 | One of the hall's lit windows grows into a framed window: a drawn interview studio, `DEC 16, 2025`. | ① the window grows | transformation · window rect → clip rect · centre · forward |
| 12.05 | [CLIP] | 533,04–543,02 | (clip slot) | **[CLIP C3]** Hassabis, 9.15 s, in the framed window (≥ 75 % width), big burned-in subtitles (spoken unevenly). `clipWindow(…, "C3", …)`; lower third `DEMIS HASSABIS · GOOGLE DEEPMIND · DEC 16, 2025 · ORIGINAL FOOTAGE`. Fallback: quote card with the exact transcript. | ① slow push | plan sequence |
| 12.06 | [EXPL] | 543,02–549,18 | **weigh his words** @545,11 · **went that way** @547,83 | The window shrinks; the five start points of 9.08 return and grow into large circles on **went that way**. | ① circles grow | plan sequence |
| 12.07 | [EXPL] | 549,18–554,07 | **new price** @550,07 · **away** @553,11 | The price tag of gore 4 hangs over a chip of light; on **new price** its number is rewritten lower; on **away** the chip under it keeps glowing. | ① the tag relabels ② the chip glows | plan sequence |
| 12.08 | [SCENE] | 554,07–561,18 | **cheaper than today** @558,75 · **everywhere** @560,14 | One slow truck along a morning street of lit windows: a clinic corridor, a classroom, a workshop, a kitchen table (indigo people at work, alive). | ① truck | plan sequence |
| 12.09 | [SCENE] | 561,18–566,52 | **front of it** @562,14 · **single stock** @563,83 | You at the `DAY 1,000` sign; on **single stock** the paper stock list of day 30 flutters out of your pocket and away. | ① paper flies | plan sequence |
| 12.10 | [EXPL] | 566,52–575,92 | **stayed calm** @566,92 · **what you owned** @570,25 · **a buffer** @571,88 · **what got cheap** @574,68 | **THE HARVEST.** Your umbrella opens large over you; one gore lights per line with its icon: phone face down · magnifier · envelope · price tag. | ① one gore per line | plan sequence |
| 12.11 | [SCENE] | 575,92–578,37 | **alone** @577,16 | Gore 5 lights and its net is finished; pull back: the many parallel roads of 9.15 join into one, a continuous net beneath, many people under one canopy of umbrellas. | ① roads join ② pull back | plan sequence |
| 12.12 | [EXPL] | 578,37–582,33 | **missing** @581,33 | The umbrella large, one gore blinks: `WHICH ONE IS MISSING?` | ① a gore blinks | plan sequence |
| 12.13 | [SCENE] | 582,33–587,09 | **one honest step** @584,85 | The road runs on past `DAY 1,000` into the morning; you walk on. | ① you walk | move · the lamp of your table rises out of the morning light · centre |
| 12.14 | [SCENE] | 587,09–589,73 | **hurt** @588,61 | Back at **your table** (c04), night, the lamp; HUD `DAY 030`; the phone face down. | ① lamp breathes | plan sequence |
| 12.15 | [EXPL] | 589,73–592,21 | **barely started** @591,04 | The HUD counter flips quietly to the upload day: `DAY 032` (Sat 7 Nov 2026; 6 Oct = DAY 0). | ① flaps | plan sequence |
| 12.16 | [SCENE] | 592,21–594,21 | **carry** @593,16 | Your hand turns the phone over: on its screen the umbrella with its five gores lit. Light. | ① the phone turns | pull back into the end screen |
| 12.17 | [SCENE] | 594,21–610,11 | – | End screen (VO end → film end, ≤ 15 s, no voice). The road at first light running into depth, the nets faint under it, you tiny with the umbrella closed in hand walking on; HUD `DAY 032`, its last flap trembling. **Free:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), quiet sky/road there; subscribe centre x 810–1110, y 330–600. Never static. | ① slow pull back ② you walk | – |

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
**Clips** (original footage, `audio/clips.json`; MP4s in `film-ai-crash/clips/`; frames extracted with `bash tools/clip_frames19.sh` into the git-ignored `clips/frames/<id>/`; `clipWindow` plays them, else the quote-card fallback):
- **C1 Powell** (3.04, slot 70.96–84.16 s, 13.2 s): FOMC press conference 29 Oct 2025, `gZsAKn1UtH4` ≈ 00:42:01.6–00:42:14.8 (the real passage, replaced 7 Nov; file cut 0.18–13.38 s). Lower third `JEROME POWELL · FED CHAIR · OCT 29, 2025 · ORIGINAL FOOTAGE`. Fallback: quote card with the official Fed wording ("You know, the investment we're getting in equipment and all those things that go into creating data centers and feeding the AI, it's clearly one of the big sources of growth in the economy.").
- **C1b Warsh** (5.066, slot 209.36–221.78 s, 12.4 s): Fed press conference 28 Oct 2026, file cut 1.2–13.62 s. Lower third `KEVIN WARSH · FED CHAIR · OCT 28, 2026 · ORIGINAL FOOTAGE`. Opens from the framed window of 5.065 (press stage `FEDERAL RESERVE · OCT 28, 2026`).
- **C3 Hassabis** (12.05, slot 533.34–542.35 s, 9.0 s): Google DeepMind "The future of intelligence", 16 Dec 2025, `PqVbypvxDto`. Lower third `DEMIS HASSABIS · GOOGLE DEEPMIND · DEC 16, 2025 · ORIGINAL FOOTAGE`; large burned-in subtitles (audio agent).
- Three clips, ≈ 35 s ≈ 5.7 % (rule: 3–6 clips, ≤ 8 %). Subtitles of the clips are burned in by the audio agent: nothing important inside a clip window below y 860.

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
| 3.08 | `NEW INVESTMENT-GRADE BONDS` · `2023: 2 %` → `2026 SO FAR: 10 %` (card: `NEW INVESTMENT-GRADE BONDS · 2026 SO FAR`, no "US") | `KANSAS CITY FED` |
| 3.10 | `CHINA · STAR 50 · AI + CHIP STOCKS` · `≈ −40 % IN UNDER 4 MONTHS` | `REUTERS, OCT 27, 2026` |
| 3.11 | `$0` | – |
| 4.04 | `THE FINANCIAL CRISIS · 2008–09` | – |
| 4.05–4.07 | `FIDELITY · 7.1 MILLION 401(k) ACCOUNTS` · `FEWER THAN 2 IN 100` · `STAYED +50 %` · `SOLD, CAME BACK LATER +25 %` · `LEFT, STAYED OUT +2 %` | `FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011` |
| 4.08 | `1 · CALM IN THE LOUDEST WEEK` | – |
| 4.09 | `NOT FINANCIAL ADVICE` | – |
| 5.01–5.05 | `EXIT · DAY 48 · THE TARIFF CRASH · 2025` · `TARIFF` · `APR 8, 2025 · −19 % · DAY 48` · `ON HOLD` · `APR 9, 2025 · S&P 500 +9.5 %` · `BEST DAY SINCE THE FINANCIAL CRISIS` | `S&P 500` ✱ (on-hold date) |
| 5.065–5.066 | `FEDERAL RESERVE · OCT 28, 2026` · clip C1b lower third `KEVIN WARSH · FED CHAIR · OCT 28, 2026 · ORIGINAL FOOTAGE` | – |
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
