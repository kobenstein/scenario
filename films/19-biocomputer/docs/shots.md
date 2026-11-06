# Film 19 · shot list (binding) · source `tools/shots19.py` · as of 2026-11-06

Every shot is anchored to VO **phrases** (looked up globally in film order), never to seconds. Re-generate after any VO change:
`python3 tools/shots19.py [timing.json] --md docs/shots.md` (rewrites only the block between the SHOTS markers). Narration: vo-v3.txt.
Layer: **[SCENE]** the 3D aisle (rack, drawer, you, screen) · **[EXPL]** the dish field (explainer graphics of dish things on night) ·
**[SCENE>EXPL] / [EXPL>SCENE]** the shot holds the tilt in / out (counts half) · **[CLIP]** original footage in a screen (outside the share).

## §1 · Rules in one breath
One world (THE RACK + THE DISH FIELD, MOTION.md §2) · one plan sequence per chunk · every boundary has a carrier (MOTION.md §6) · one motif
per sentence · 1–2 moving main elements · nothing from nowhere · no still > 2 s · ladder via `F.ladder(ctx, t, T)` · clips in a screen.

## §2 · Chunks and shots
<!-- SHOTS:BEGIN -->
| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |
|---|---|---|---|---|---|---|---|
| c01 | Lead | 0,00–47,28 | 47.3 | Hook: the drawer, you, the rack in Singapore, feeding, Doom (C1), no hands/eyes/reward, the question, blood, the clock | THE RACK (anchor): the drawer opens, the dish glows → the dish field: the net rewinds to one blood cell with a clock | 9 | 57% |
| c02 | B1 | 47,28–99,62 | 52.3 | Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original | Dish field: the cell (carrier) → stem cell → neuron → the net grows → pull back into the box | 7 | 90% |
| c03 | B1 | 99,62–135,44 | 35.8 | Pong 2022: sense and move zones · the trick: order or noise | Dish field: the Pong court drawn over the chip; ORDER (gold ticks) vs NOISE (cool static) | 4 | 95% |
| c04 | B1 | 135,44–188,43 | 53.0 | Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick? | Dish field: rally counter; the radio dial (you); C2 in a screen | 5 | 65% |
| c05 | B1 | 188,43–230,10 | 41.7 | For sale ($35,000 / a few hundred a week) · Doom in a week · "doesn't know" · why a rack? | The box as product → Doom → the box slides into the rack (plateRack) | 4 | 65% |
| c06 | B2 | 230,10–288,59 | 58.5 | Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested | From the rack to your head (20 W) → the aisle grows (Singapore) → the box's watts | 5 | 38% |
| c07 | B2 | 288,59–358,69 | 70.1 | The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch) | THE SCOREBOARD over the dish field: CELLS (gold) vs A.I. (cool) | 6 | 96% |
| c08 | B2 | 358,69–399,50 | 40.8 | Round 3 everything else · final score · pairing · is anyone in there? | Scoreboard 2 : 1 → pairing → fly down into the dish (plateNet) | 4 | 84% |
| c09 | B3 | 399,50–438,10 | 38.6 | How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence | The size ladder (creatures) → 120 dishes → your head | 3 | 84% |
| c10 | B3 | 438,10–488,60 | 50.5 | Seth · embedded ethics (Johns Hopkins) · Smirnova (C3) · what now? | The rack (anchor: a bee on the box) → the round table → C3 in a screen | 4 | 18% |
| c11 | B3 | 488,60–582,88 | 94.3 | The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen | Dish field: callback, three rule cards → THE RACK: the drawer closes, you in the aisle | 8 | 77% |

**Builders (seconds of picture):** Lead 47 s · B1 183 s · B2 169 s · B3 183 s (B3 includes the ≤ 15 s end screen). **Explainer share (spoken part):** 72% (mixed shots count half, clips excluded). Timing: `timing.json`.

### c01 · Hook: the drawer, you, the rack in Singapore, feeding, Doom (C1), no hands/eyes/reward, the question, blood, the clock · 0,00–47,28 (47 s) · Lead · ★ 1.01 · [EXPL] 57%
Light/hero: THE RACK (anchor): the drawer opens, the dish glows → the dish field: the net rewinds to one blood cell with a clock

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **1.01 ★** | [SCENE] | 0,00–3,77 | **human brain cells** @2,19 | **★ [THE RACK · opening image = thumbnail]** Close above drawer 11 of the alive rack: it slides open, light rises, the dish with the gold net glows on its chip. | ① drawer slides ② light/sparks | plan sequence · truck left to you |
| 1.02 | [SCENE] | 3,77–7,15 | **right now** @5,16 · **watch this** @5,96 | You (yellow raincoat) in the aisle with your phone; the same net (same sparks) glows inside your hood. The open drawer at the right edge. | ① head net ② phone light | plan sequence · pull back |
| 1.03 | [SCENE] | 7,15–10,94 | **chip** @8,01 · **server rack** @9,06 · **Singapore** @9,90 | The aisle (medium, breathing pull back): the alive rack (gold seams) among cold servers, you look up at it. Label from the rack top: SINGAPORE / DATA CENTRE. | ① you look up ② label | plan sequence · push to the drawer |
| 1.04 | [SCENE] | 10,94–14,42 | **someone feeds them** @12,11 | A gloved hand lowers a pipette over the dish; one drop falls; the net answers in a wave from the landing point. | ① pipette ② drop → wave | truck right into the screen in the aisle |
| 1.05 | [CLIP] | 14,42–22,61 | **play this** @15,81 · **controller** @19,56 · **They haven't** @20,65 | **[C1 · ORIGINAL FOOTAGE, muted under the voice]** The screen on a stand in the aisle fills CLIP_RECT: CL1 playing DOOM. Credit: Cortical Labs · CL1 PLAYING DOOM · 2026. | ① footage | the screen goes dark |
| 1.06 | [EXPL] | 22,61–26,57 | **No eyes** @23,89 · **No reward** @25,08 | In the dark screen: hand, eye, star rise one per word, each struck by a cool line. | one glyph per word | the camera swings back and tilts down into the dish |
| 1.07 | [SCENE>EXPL] | 26,57–31,31 | **cells anything** @28,25 | The question line rises; the camera tilts straight down into the dish while the aisle sinks into night: the dish IS the explainer field now. The ladder rail grows at the left edge. | ① camera ② ladder | plan sequence (2D from here) |
| 1.08 | [EXPL] | 31,31–35,59 | **inside a head** @32,80 · **These never did** @34,21 | A head silhouette rises beside the dish, its own small net glowing (rung 1: WHERE DO THE CELLS COME FROM?). | ① head rises | plan sequence |
| 1.09 | [EXPL] | 35,59–47,28 | **blood sample** @38,67 · **last checkup** @40,56 · **make brain cells** @41,98 · **cell's clock** @45,27 | The head sinks; the net REWINDS into round cells, gold → cool: blood cells (rung answer BLOOD). The tube (DONOR) rises; all cells but one stream back into it; the one comes to the centre, grows, gets a clock ring with the hands turning BACKWARD. | ① rewind ② stream / clock | seam → **plateClock** |

### c02 · Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original · 47,28–99,62 (52 s) · B1 · ★ – · [EXPL] 90%
Light/hero: Dish field: the cell (carrier) → stem cell → neuron → the net grows → pull back into the box

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 47,28–59,21 | **stem cells** @51,10 · **almost anything** @53,81 · **Nobel Prize** @56,22 · **no embryos** @57,81 | From plateClock: the clock keeps turning back, the blood cell warms into a round gold STEM CELL; the clock ring opens into a fan of faint futures (neuron, muscle, heart, …). Small label NOBEL PRIZE 2012. | ① cell warms ② fan | plan sequence |
| 2.02 | [EXPL] | 59,21–65,00 | **grow into neurons** @61,44 · **Brain cells** @63,04 | The hands turn FORWARD; the fan folds into one branch: the stem cell sprouts dendrites → a neuron (cell kind neuron, sprout 0→1). | ① clock forward ② sprout | plan sequence |
| 2.03 | [EXPL] | 65,00–70,54 | **reach out** @66,85 · **wiring up** @68,35 | The neuron is one of many on the chip; they reach out to each other: THE NET grows (net grow 0→1) on the dish field. | ① net grows | plan sequence |
| 2.04 | [EXPL] | 70,54–77,74 | **send them signals** @72,11 · **their answers** @74,24 · **Ordinary code** @75,53 | The electrode grid under the net: cool pulses go up (signals), gold sparks come back (answers); a thin line of code runs at the dish rim. | ① pulses up ② sparks back | pull back out of the dish |
| 2.05 | [SCENE>EXPL] | 77,74–88,00 | **living neurons** @80,29 · **life support** @83,47 · **Cortical Labs** @85,91 | Pull back: the dish shrinks into the window of THE BOX (cl1, front view) with its life-support tubes; label CORTICAL LABS · MELBOURNE. | ① pull back ② pump pulse | plan sequence |
| 2.06 | [EXPL] | 88,00–94,67 | **imitates neurons** @89,89 · **real thing** @93,49 | Split: left a cool node graph of math imitating a neuron, right the gold net (the original). | ① cool graph ② gold net | plan sequence |
| 2.07 | [EXPL] | 94,67–99,62 | **without a reward** @96,77 | The cool graph withdraws; the box window grows back to the dish field (rung 2: HOW DO YOU TEACH THEM?). | ① window grows | plan sequence |

### c03 · Pong 2022: sense and move zones · the trick: order or noise · 99,62–135,44 (36 s) · B1 · ★ – · [EXPL] 95%
Light/hero: Dish field: the Pong court drawn over the chip; ORDER (gold ticks) vs NOISE (cool static)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 3.01 | [EXPL] | 99,62–106,09 | **four years ago** @102,05 · **Pong** @104,98 | On the dish field the Pong court draws itself in cool lines over the chip: two walls, a paddle, a ball. Label PONG · 2022. | ① court draws ② ball | plan sequence |
| 3.02 | [EXPL] | 106,09–120,42 | **human cells** @109,15 · **mice** @110,93 · **never saw a screen** @112,51 · **where the ball was** @116,13 · **moved the paddle** @118,92 | Two cell icons (human, mouse); a small screen icon struck. Then the SENSE zone of electrodes lights where the ball is; activity in the MOVE zone pushes the paddle. | ① sense zone ② paddle | plan sequence |
| 3.03 | [EXPL] | 120,42–131,53 | **Hit the ball** @121,90 · **tidy signal** @124,16 · **Miss** @127,07 · **random noise** @129,08 · **static** @130,65 | Hit: a short tidy pulse runs over all electrodes (gold, regular ticks). Miss: four seconds of cool static fill the field (a 4 s bar empties). | ① tidy pulse ② static | plan sequence |
| 3.04 | [EXPL>SCENE] | 131,53–135,44 | **chaos** @133,94 | Two strips side by side: ORDER (gold ticks) and NOISE (cool static); pull back up out of the dish to the drawer in the aisle. | ① strips | plan sequence |

### c04 · Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick? · 135,44–188,43 (53 s) · B1 · ★ – · [EXPL] 65%
Light/hero: Dish field: rally counter; the radio dial (you); C2 in a screen

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [EXPL] | 135,44–143,53 | **rallies got longer** @136,97 · **no feedback** @139,24 · **wasn't luck** @141,65 | A rally counter climbs over a 5-minute clock; a second, cool line for the dishes without feedback stays flat. | ① gold line climbs | plan sequence |
| 4.02 | [EXPL] | 143,53–152,75 | **too big a word** @147,89 · **keeps the noise away** @150,66 | The word "want" sits over the dish, then shrinks (too big a word); the net settles where the static stays away. | ① word shrinks | plan sequence |
| 4.03 | [SCENE] | 152,75–165,74 | **Karl Friston** @155,91 · **more predictable** @159,50 · **crackling radio** @162,84 | In the aisle (anchor): label KARL FRISTON · NEUROSCIENTIST. You (yellow) turn the dial of a small radio; its noisy wave smooths into a clean voice line. | ① dial ② wave smooths | the radio becomes a screen |
| 4.04 | [CLIP] | 165,74–181,35 | **led the study** @167,01 | **[C2 · ORIGINAL FOOTAGE]** Brett Kagan · Chief Scientific Officer, Cortical Labs · 2026, in the screen (CLIP_RECT). | ① footage | out of the screen |
| 4.05 | [EXPL] | 181,35–188,43 | **order and noise** @183,74 · **lab trick** @186,51 | Back on the dish field; ladder: answer ORDER VS. NOISE, then rung 3 JUST A LAB TRICK? | ① ladder | plan sequence |

### c05 · For sale ($35,000 / a few hundred a week) · Doom in a week · "doesn't know" · why a rack? · 188,43–230,10 (42 s) · B1 · ★ – · [EXPL] 65%
Light/hero: The box as product → Doom → the box slides into the rack (plateRack)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE>EXPL] | 188,43–198,94 | **became a product** @191,22 · **thirty-five thousand** @193,62 · **rent one** @195,91 · **few hundred** @197,26 | The box on a plinth in the aisle as a product: a tag $35,000; a smaller cloud tag A FEW HUNDRED $ / WEEK (never "$300"). | ① tag ② cloud tag | plan sequence |
| 5.02 | [SCENE>EXPL] | 198,94–209,12 | **Doom** @203,50 · **about a week** @203,94 · **year and a half** @207,03 | The screen in the aisle again (C1 motif, small, no new footage); two bars: ABOUT A WEEK (Doom) vs 1½ YEARS (Pong setup). | ① bars | plan sequence |
| 5.03 | [EXPL] | 209,12–221,76 | **die a lot** @213,32 · **doesn't actually know** @218,76 | Quote card: "The system doesn't actually know it's playing Doom." Alon Loeffler, Cortical Labs. | ① quote | plan sequence |
| 5.04 | [EXPL>SCENE] | 221,76–230,10 | **four years** @224,24 · **server rack** @227,32 | PONG → DOOM · 4 YEARS; then the box slides back into drawer 11, pull back onto RACK_PLATE_CAM (rung 4: WHY A DATA CENTER?). | ① box slides in ② pull back | seam → **plateRack** |

### c06 · Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested · 230,10–288,59 (58 s) · B2 · ★ – · [EXPL] 38%
Light/hero: From the rack to your head (20 W) → the aisle grows (Singapore) → the box's watts

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 6.01 | [SCENE>EXPL] | 230,10–239,01 | **inside your head** @231,54 · **twenty watts** @234,35 · **ever learned** @237,78 | From plateRack: push past the rack to you; your head's net glows: 20 WATTS (ladder answer). | ① push ② 20 W | plan sequence |
| 6.02 | [EXPL] | 239,01–246,90 | **vastly more** @241,68 · **about half** @245,60 | A cool bar for A.I. data-centre electricity jumps by about half (+50 %, IEA 2026). | ① bar jumps | plan sequence |
| 6.03 | [SCENE] | 246,90–262,82 | **original** @248,82 · **Melbourne and Singapore** @252,07 · **thousand** @259,23 · **drug research** @260,94 | The aisle: two map pins MELBOURNE · SINGAPORE; in Singapore the alive racks multiply down the aisle: UP TO 1,000. | ① pins ② racks | plan sequence |
| 6.04 | [SCENE>EXPL] | 262,82–282,82 | **thirty watts** @268,14 · **whole brain** @270,19 · **almost nothing** @272,90 · **life support** @266,80 · **nobody has tested** @276,62 | A box half out of its drawer: 30 W (incl. life support) vs your brain 20 W; inside the box the cells' share is a sliver, the pumps take the rest. NOT YET TESTED. | ① bars ② sliver | plan sequence |
| 6.05 | [SCENE] | 282,82–288,59 | **compete** @285,26 | The aisle (anchor): the alive rack among the cold servers; rung 5: CAN CELLS COMPETE? | ① ladder | plan sequence |

### c07 · The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch) · 288,59–358,69 (70 s) · B2 · ★ – · [EXPL] 96%
Light/hero: THE SCOREBOARD over the dish field: CELLS (gold) vs A.I. (cool)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 7.01 | [SCENE>EXPL] | 288,59–294,62 | **cells against** @290,31 · **Three rounds** @293,23 | In the aisle the scoreboard rises over the alive rack, then the camera dives into the dish field under it: CELLS (gold) : A.I. (cool), three round lamps. | ① board rises | plan sequence |
| 7.02 | [EXPL] | 294,62–309,18 | **Learning speed** @295,73 · **study published last year** @297,29 · **three standard** @301,55 · **tiny amount of practice** @307,32 | Pong again: the dish vs three cool program icons; equal short practice bars. | ① lamp 1 ② bars | plan sequence |
| 7.03 | [EXPL] | 309,18–313,18 | **longer rallies** @311,88 | Two curves: gold rises faster than cool. | ① curves | plan sequence |
| 7.04 | [EXPL] | 313,18–325,15 | **with a catch** @314,86 · **older** @316,97 · **far more practice** @319,52 | A gold point token drops; a CATCH tag hangs from it. | ① token ② catch | plan sequence |
| 7.05 | [EXPL] | 325,15–348,23 | **Teamwork** @326,38 · **Washington** @329,72 · **fifteen boxes** @331,74 · **thirty-two** @340,35 · **about forty** @343,06 · **About seventy** @346,69 | Fifteen small boxes link into a team (presented, not shown live); a figure steers across a grid to a goal; three bars: 32 · 40 · 70 (numbers only, no "% of max"). | ① boxes link ② bars | plan sequence |
| 7.06 | [EXPL] | 348,23–358,69 | **No published paper** @353,24 · **today's best** @356,66 | Second gold token, second CATCH tag: ONE COMPANY · ONE TALK · NO PAPER YET. | ① token ② catch | plan sequence |

### c08 · Round 3 everything else · final score · pairing · is anyone in there? · 358,69–399,50 (41 s) · B2 · ★ – · [EXPL] 84%
Light/hero: Scoreboard 2 : 1 → pairing → fly down into the dish (plateNet)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 358,69–375,60 | **six months** @363,01 · **good days** @364,63 · **fast, precise math** @371,06 | Lamp 3; a six-month bar; a wave of good and bad days; a cool block of fast math. | ① bar ② wave | plan sequence |
| 8.02 | [EXPL] | 375,60–379,46 | **A big one** @378,19 | The A.I. token drops and grows giant. | ① token grows | plan sequence |
| 8.03 | [SCENE>EXPL] | 379,46–392,67 | **Two small points** @380,67 · **giant one** @382,59 · **pairing** @387,31 | 2 : 1 · WITH CATCHES (ladder answer); then pull back into the aisle: gold drawers and cool servers side by side in one rack: pairing. | ① score ② interlock | plan sequence |
| 8.04 | [EXPL] | 392,67–399,50 | **anyone in there** @397,59 | Fly down into the dish: one soma in the centre flickers (rung 6: IS ANYONE IN THERE?). | ① fly down | seam → **plateNet** |

### c09 · How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence · 399,50–438,10 (39 s) · B3 · ★ – · [EXPL] 84%
Light/hero: The size ladder (creatures) → 120 dishes → your head

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [EXPL] | 399,50–410,30 | **two hundred thousand** @403,88 · **fruit fly** @407,07 · **honeybee** @409,34 | From plateNet: pull back, the net shrinks into the box's window; the box stands on the size ladder: FLY < BOX < BEE (creature fill = neurons). | ① pull back ② ladder | plan sequence |
| 9.02 | [EXPL] | 410,30–425,61 | **a third** @413,20 · **mouse brain** @414,74 · **hundred and twenty** @417,00 · **eighty-six billion** @423,28 | A grid of 120 small dishes fills a third of a mouse silhouette; then your head: 86 BILLION. | ① grid fills ② your head | plan sequence |
| 9.03 | [EXPL>SCENE] | 425,61–438,10 | **no evidence** @429,97 · **structure** @435,35 | A signal arrow in, a reaction out, nothing in between that feels: NO EVIDENCE · STAY CAREFUL (ladder answer). | ① arrow | pull back into the aisle |

### c10 · Seth · embedded ethics (Johns Hopkins) · Smirnova (C3) · what now? · 438,10–488,60 (50 s) · B3 · ★ – · [EXPL] 18%
Light/hero: The rack (anchor: a bee on the box) → the round table → C3 in a screen

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [SCENE] | 438,10–452,22 | **Anil Seth** @441,90 · **ChatGPT** @450,73 | The alive rack; a small bee silhouette rests on the box (scale). Label ANIL SETH · NEUROSCIENTIST. | ① bee ② label | plan sequence |
| 10.02 | [SCENE>EXPL] | 452,22–463,99 | **from the very start** @456,12 · **Ethicists** @457,76 · **embedded ethics** @462,41 | In the aisle, round the open drawer: ethicists, scientists, the public (three groups of small figures): EMBEDDED ETHICS. | ① groups gather | into the screen |
| 10.03 | [CLIP] | 463,99–482,44 | **what that means** @465,36 | **[C3 · ORIGINAL FOOTAGE]** Lena Smirnova · Johns Hopkins University · 2023, in the screen (CLIP_RECT). | ① footage | out of the screen |
| 10.04 | [SCENE] | 482,44–488,60 | **bee's brain** @486,79 | Out of the screen into the aisle: the alive rack, the bee on the box; ladder top: WHAT NOW? | ① ladder | plan sequence |

### c11 · The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen · 488,60–582,88 (94 s) · B3 · ★ 11.08 · [EXPL] 77%
Light/hero: Dish field: callback, three rule cards → THE RACK: the drawer closes, you in the aisle

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 11.01 | [EXPL] | 488,60–498,61 | **Order** @493,81 · **teaching us back** @497,15 | Callback: the question line of 1.07 returns; ORDER … AND NOISE; the net sparks back at you. | ① question ② answer | plan sequence |
| 11.02 | [EXPL] | 498,61–508,56 | **very little power** @501,03 · **leaner** @507,66 | Two small gauges (power, practice) stay low; a cool software block slims. | ① block slims | plan sequence |
| 11.03 | [EXPL] | 508,56–523,11 | **Epilepsy** @510,72 · **Pong game** @515,75 · **animal experiments** @518,47 · **brain diseases** @521,09 | A drug drop on the neurons; the Pong rally improves; a mouse silhouette steps back. | ① drop ② mouse | plan sequence |
| 11.04 | [EXPL>SCENE] | 523,11–531,83 | **good rules** @526,55 · **Three would be** @528,59 | Pull back: the drawer in the aisle; three empty rule cards rise beside the rack (ladder answer 3 RULES). | ① cards rise | plan sequence |
| 11.05 | [EXPL] | 531,83–538,55 | **say yes** @534,93 | Card 1 fills: the donor tube + a tick: CONSENT. | ① card 1 | plan sequence |
| 11.06 | [EXPL] | 538,55–550,05 | **signs of experience** @543,18 · **oversight** @548,00 | Card 2 fills: a check-light over a growing net: CHECK, EVERY TIME. | ① card 2 | plan sequence |
| 11.07 | [EXPL>SCENE] | 550,05–556,52 | **anyone can check** @554,35 | Card 3 fills: an open book / open window: IN PUBLIC. | ① card 3 | tilt up out of the dish into the aisle |
| **11.08 ★** | [SCENE] | 556,52–566,98 | **imitate brain cells** @559,41 · **inside the machine** @562,31 · **up to us** @566,18 | **★** Back in the aisle: the drawer slides shut, its gold seam glows; you stand in front of the alive rack and look up. | ① drawer closes ② you | pull back into the end screen |
| 11.09 | [SCENE] | 566,98–582,88 | – | End screen (VO end → film end, ≤ 15 s, no voice). The aisle at night, slow pull back: the alive rack in the centre (x 840–1080), its seams breathing, you tiny before it. **Free areas for the YouTube end cards: left x 90–780 and right x 1140–1830, y 250–700**; nothing moves there but the grain. | ① seams breathe ② slow pull back | – |

<!-- SHOTS:END -->

## §3 · Hard world changes (the only ones; everything else is a camera move inside the world)
| At | Change | Why it is allowed |
|---|---|---|
| 1.05 C1 | into the screen in the aisle (footage) | clip rule: the camera flies into a screen that stands in the world |
| 4.04 C2 | into a screen (the radio becomes a screen) | clip rule |
| 6.03 | the aisle multiplies (Singapore's racks, map pins Melbourne/Singapore) | a pull back in the same aisle; the pins are labels, not a new place |
| 10.03 C3 | into a screen | clip rule |
The aisle ↔ dish field changes (1.07, 2.05, 3.04, 5.04, 6.01, 7.01, 8.03/8.04, 9.03, 11.04/11.07) are camera tilts and pulls, not hard changes.

## §4 · Numbers, names and on-screen text (only these; sources: faktenzettel.md)
| Shot | On screen | Source |
|---|---|---|
| 1.03 | SINGAPORE / DATA CENTRE | F2 (20 CL1 in a rack at NUS, DayOne + Cortical Labs) |
| 1.05 | Cortical Labs · CL1 PLAYING DOOM · 2026 · ORIGINAL FOOTAGE | F6 (video 25.2.2026) |
| 1.09 | BLOOD (ladder) · tube label DONOR | F7, F8 (blood donation → iPSC) |
| 2.01 | NOBEL PRIZE 2012 | F10 (Gurdon, Yamanaka) |
| 2.05 | CORTICAL LABS · MELBOURNE | F1, F27 |
| 3.01 | PONG · 2022 | F14 (Kagan et al., Neuron 2022) |
| 3.03 | 4 S (noise) | F16 |
| 4.01 | ~5 MIN | F17 |
| 4.03 | KARL FRISTON · NEUROSCIENTIST | F18 |
| 4.04 | Brett Kagan · CHIEF SCIENTIFIC OFFICER, CORTICAL LABS · 2026 · ORIGINAL FOOTAGE | clips-v1.md C2 |
| 5.01 | $35,000 · A FEW HUNDRED $ / WEEK (never "$300") | F27, F28 + vo-v3 |
| 5.02 | ABOUT A WEEK · 1½ YEARS | F31 |
| 5.03 | "The system doesn't actually know it's playing Doom." Alon Loeffler, Cortical Labs | F32 |
| 6.01 | 20 WATTS | F39 |
| 6.02 | +50 % (A.I. data centres, 2025) | F41 (IEA 2026) |
| 6.03 | MELBOURNE · SINGAPORE · UP TO 1,000 | F43, F44 |
| 6.04 | 30 W · 20 W · NOT YET TESTED | F46, F48 |
| 7.05 | 15 BOXES · 32 · 40 · 70 (numbers only, no "% of max") | F55 + coordinator note |
| 7.06 | ONE COMPANY · ONE TALK · NO PAPER YET | vo-v3 |
| 8.03 | 2 : 1 · WITH CATCHES | vo-v3 |
| 9.01 | ~200,000 · FLY < BOX < BEE | F36, F64, F65 |
| 9.02 | 120 DISHES · ⅓ MOUSE · 86 BILLION | F43, F66 |
| 10.01 | ANIL SETH · NEUROSCIENTIST | faktenzettel §8 |
| 10.02 | EMBEDDED ETHICS · JOHNS HOPKINS | faktenzettel §8 |
| 10.03 | Lena Smirnova · JOHNS HOPKINS UNIVERSITY · 2023 · ORIGINAL FOOTAGE | clips-v1.md C3 |
| 11.05–11.07 | CONSENT · CHECK, EVERY TIME · IN PUBLIC | vo-v3 rules |
