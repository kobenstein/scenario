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
| c02 | B1 | 47,28–98,03 | 50.7 | Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original | Dish field: the cell (carrier) → stem cell → neuron → the net grows → pull back into the box | 7 | 91% |
| c03 | B1 | 98,03–133,85 | 35.8 | Pong 2022: sense and move zones · the trick: order or noise | Dish field: the Pong court drawn over the chip; ORDER (gold ticks) vs NOISE (cool static) | 4 | 95% |
| c04 | B1 | 133,85–186,83 | 53.0 | Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick? | Dish field: rally counter; the radio dial (you); C2 in a screen | 5 | 65% |
| c05 | B1 | 186,83–238,12 | 51.3 | For sale ($35,000 / a few hundred a week) · Doom in a week · "doesn't know" · why a rack? | The box as product → Doom → the box slides into the rack (plateRack) | 4 | 62% |
| c06 | B2 | 238,12–296,61 | 58.5 | Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested | From the rack to your head (20 W) → the aisle grows (Singapore) → the box's watts | 5 | 38% |
| c07 | B2 | 296,61–366,71 | 70.1 | The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch) | THE SCOREBOARD over the dish field: CELLS (gold) vs A.I. (cool) | 6 | 96% |
| c08 | B2 | 366,71–407,68 | 41.0 | Round 3 everything else · final score · pairing · is anyone in there? | Scoreboard 2 : 1 → pairing → fly down into the dish (plateNet) | 4 | 84% |
| c09 | B3 | 407,68–445,41 | 37.7 | How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence | The size ladder (creatures) → 120 dishes → your head | 3 | 83% |
| c10 | B3 | 445,41–496,52 | 51.1 | Seth · embedded ethics (Johns Hopkins) · Hartung (C3) · what now? | The rack (anchor: a bee on the box) → the round table → C3 in a screen | 4 | 18% |
| c11 | B3 | 496,52–594,58 | 98.1 | The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen | Dish field: callback, three rule cards → THE RACK: the drawer closes, you in the aisle | 8 | 71% |

**Builders (seconds of picture):** Lead 47 s · B1 191 s · B2 170 s · B3 187 s (B3 includes the ≤ 15 s end screen). **Explainer share (spoken part):** 71% (mixed shots count half, clips excluded). Timing: `timing.json`.

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

### c02 · Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original · 47,28–98,03 (51 s) · B1 · ★ – · [EXPL] 91%
Light/hero: Dish field: the cell (carrier) → stem cell → neuron → the net grows → pull back into the box

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 47,28–59,21 | **stem cells** @51,10 · **almost anything** @53,81 · **Nobel Prize** @56,22 · **no embryos** @57,81 | From plateClock: the clock keeps turning back, the blood cell warms into a round gold STEM CELL; the clock ring opens into a fan of faint futures (neuron, muscle, heart, …). Small label NOBEL PRIZE 2012. | ① cell warms ② fan | plan sequence |
| 2.02 | [EXPL] | 59,21–64,93 | **grow into neurons** @61,44 · **Brain cells** @63,04 | The hands turn FORWARD; the fan folds into one branch: the stem cell sprouts dendrites → a neuron (cell kind neuron, sprout 0→1). | ① clock forward ② sprout | plan sequence |
| 2.03 | [EXPL] | 64,93–70,05 | **reach out** @66,81 · **wiring up** @68,05 | The neuron is one of many on the chip; they reach out to each other: THE NET grows (net grow 0→1) on the dish field. | ① net grows | plan sequence |
| 2.04 | [EXPL] | 70,05–77,33 | **send them signals** @71,57 · **their answers** @73,57 · **Ordinary code** @74,69 | The electrode grid under the net: cool pulses go up (signals), gold sparks come back (answers); a thin line of code runs at the dish rim. | ① pulses up ② sparks back | pull back out of the dish |
| 2.05 | [SCENE>EXPL] | 77,33–86,57 | **living neurons** @79,33 · **life support** @82,37 · **Cortical Labs** @84,77 | Pull back: the dish shrinks into the window of THE BOX (cl1, front view) with its life-support tubes; label CORTICAL LABS · MELBOURNE. | ① pull back ② pump pulse | plan sequence |
| 2.06 | [EXPL] | 86,57–93,01 | **imitates neurons** @88,57 · **real thing** @91,97 | Split: left a cool node graph of math imitating a neuron, right the gold net (the original). | ① cool graph ② gold net | plan sequence |
| 2.07 | [EXPL] | 93,01–98,03 | **without a reward** @95,29 | The cool graph withdraws; the box window grows back to the dish field (rung 2: HOW DO YOU TEACH THEM?). | ① window grows | plan sequence |

### c03 · Pong 2022: sense and move zones · the trick: order or noise · 98,03–133,85 (36 s) · B1 · ★ – · [EXPL] 95%
Light/hero: Dish field: the Pong court drawn over the chip; ORDER (gold ticks) vs NOISE (cool static)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 3.01 | [EXPL] | 98,03–104,50 | **four years ago** @100,46 · **Pong** @103,39 | On the dish field the Pong court draws itself in cool lines over the chip: two walls, a paddle, a ball. Label PONG · 2022. | ① court draws ② ball | plan sequence |
| 3.02 | [EXPL] | 104,50–118,83 | **human cells** @107,56 · **mice** @109,34 · **never saw a screen** @110,92 · **where the ball was** @114,54 · **moved the paddle** @117,33 | Two cell icons (human, mouse); a small screen icon struck. Then the SENSE zone of electrodes lights where the ball is; activity in the MOVE zone pushes the paddle. | ① sense zone ② paddle | plan sequence |
| 3.03 | [EXPL] | 118,83–129,94 | **Hit the ball** @120,31 · **tidy signal** @122,57 · **Miss** @125,48 · **random noise** @127,49 · **static** @129,06 | Hit: a short tidy pulse runs over all electrodes (gold, regular ticks). Miss: four seconds of cool static fill the field (a 4 s bar empties). | ① tidy pulse ② static | plan sequence |
| 3.04 | [EXPL>SCENE] | 129,94–133,85 | **chaos** @132,35 | Two strips side by side: ORDER (gold ticks) and NOISE (cool static); pull back up out of the dish to the drawer in the aisle. | ① strips | plan sequence |

### c04 · Five minutes, not luck · "want" is too big · Friston, the radio · Kagan (C2) · a lab trick? · 133,85–186,83 (53 s) · B1 · ★ – · [EXPL] 65%
Light/hero: Dish field: rally counter; the radio dial (you); C2 in a screen

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [EXPL] | 133,85–141,94 | **rallies got longer** @135,38 · **no feedback** @137,65 · **wasn't luck** @140,06 | A rally counter climbs over a 5-minute clock; a second, cool line for the dishes without feedback stays flat. | ① gold line climbs | plan sequence |
| 4.02 | [EXPL] | 141,94–151,16 | **too big a word** @146,30 · **keeps the noise away** @149,07 | The word "want" sits over the dish, then shrinks (too big a word); the net settles where the static stays away. | ① word shrinks | plan sequence |
| 4.03 | [SCENE] | 151,16–164,15 | **Karl Friston** @154,32 · **more predictable** @157,91 · **crackling radio** @161,25 | In the aisle (anchor): label KARL FRISTON · NEUROSCIENTIST. You (yellow) turn the dial of a small radio; its noisy wave smooths into a clean voice line. | ① dial ② wave smooths | the radio becomes a screen |
| 4.04 | [CLIP] | 164,15–179,76 | **led the study** @165,42 | **[C2 · ORIGINAL FOOTAGE]** Brett Kagan · Chief Scientific Officer, Cortical Labs · 2026, in the screen (CLIP_RECT). | ① footage | out of the screen |
| 4.05 | [EXPL] | 179,76–186,83 | **order and noise** @182,15 · **lab trick** @184,92 | Back on the dish field; ladder: answer ORDER VS. NOISE, then rung 3 JUST A LAB TRICK? | ① ladder | plan sequence |

### c05 · For sale ($35,000 / a few hundred a week) · Doom in a week · "doesn't know" · why a rack? · 186,83–238,12 (51 s) · B1 · ★ – · [EXPL] 62%
Light/hero: The box as product → Doom → the box slides into the rack (plateRack)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE>EXPL] | 186,83–197,35 | **became a product** @189,62 · **thirty-five thousand** @192,03 · **rent one** @194,32 · **few hundred** @195,67 | The box on a plinth in the aisle as a product: a tag $35,000; a smaller cloud tag A FEW HUNDRED $ / WEEK (never "$300"). | ① tag ② cloud tag | plan sequence |
| 5.02 | [SCENE>EXPL] | 197,35–207,53 | **Doom** @201,91 · **about a week** @202,34 · **year and a half** @205,43 | The screen in the aisle again (C1 motif, small, no new footage); two bars: ABOUT A WEEK (Doom) vs 1½ YEARS (Pong setup). | ① bars | plan sequence |
| 5.03 | [EXPL] | 207,53–220,17 | **die a lot** @211,73 · **doesn't actually know** @217,17 | Quote card: "The system doesn't actually know it's playing Doom." Alon Loeffler, Cortical Labs. | ① quote | plan sequence |
| 5.04 | [EXPL>SCENE] | 220,17–238,12 | **four years** @222,64 · **server rack** @235,34 | PONG → DOOM · 4 YEARS; then the box slides back into drawer 11, pull back onto RACK_PLATE_CAM (rung 4: WHY A DATA CENTER?). | ① box slides in ② pull back | seam → **plateRack** |

### c06 · Twenty watts · data centres +50 % · Melbourne, Singapore, 1,000 · 30 W per box, untested · 238,12–296,61 (58 s) · B2 · ★ – · [EXPL] 38%
Light/hero: From the rack to your head (20 W) → the aisle grows (Singapore) → the box's watts

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 6.01 | [SCENE>EXPL] | 238,12–247,03 | **inside your head** @239,56 · **twenty watts** @242,37 · **ever learned** @245,80 | From plateRack: push past the rack to you; your head's net glows: 20 WATTS (ladder answer). | ① push ② 20 W | plan sequence |
| 6.02 | [EXPL] | 247,03–254,91 | **vastly more** @249,69 · **about half** @253,62 | A cool bar for A.I. data-centre electricity jumps by about half (+50 %, IEA 2026). | ① bar jumps | plan sequence |
| 6.03 | [SCENE] | 254,91–270,84 | **original** @256,84 · **Melbourne and Singapore** @260,09 · **thousand** @267,24 · **drug research** @268,95 | The aisle: two map pins MELBOURNE · SINGAPORE; in Singapore the alive racks multiply down the aisle: UP TO 1,000. | ① pins ② racks | plan sequence |
| 6.04 | [SCENE>EXPL] | 270,84–290,84 | **thirty watts** @276,16 · **whole brain** @278,21 · **almost nothing** @280,92 · **life support** @274,81 · **nobody has tested** @284,63 | A box half out of its drawer: 30 W (incl. life support) vs your brain 20 W; inside the box the cells' share is a sliver, the pumps take the rest. NOT YET TESTED. | ① bars ② sliver | plan sequence |
| 6.05 | [SCENE] | 290,84–296,61 | **compete** @293,28 | The aisle (anchor): the alive rack among the cold servers; rung 5: CAN CELLS COMPETE? | ① ladder | plan sequence |

### c07 · The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch) · 296,61–366,71 (70 s) · B2 · ★ – · [EXPL] 96%
Light/hero: THE SCOREBOARD over the dish field: CELLS (gold) vs A.I. (cool)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 7.01 | [SCENE>EXPL] | 296,61–302,64 | **cells against** @298,33 · **Three rounds** @301,25 | In the aisle the scoreboard rises over the alive rack, then the camera dives into the dish field under it: CELLS (gold) : A.I. (cool), three round lamps. | ① board rises | plan sequence |
| 7.02 | [EXPL] | 302,64–317,20 | **Learning speed** @303,75 · **study published last year** @305,31 · **three standard** @309,57 · **tiny amount of practice** @315,34 | Pong again: the dish vs three cool program icons; equal short practice bars. | ① lamp 1 ② bars | plan sequence |
| 7.03 | [EXPL] | 317,20–321,20 | **longer rallies** @319,90 | Two curves: gold rises faster than cool. | ① curves | plan sequence |
| 7.04 | [EXPL] | 321,20–333,17 | **with a catch** @322,88 · **older** @324,99 · **far more practice** @327,54 | A gold point token drops; a CATCH tag hangs from it. | ① token ② catch | plan sequence |
| 7.05 | [EXPL] | 333,17–356,25 | **Teamwork** @334,40 · **Washington** @337,74 · **fifteen boxes** @339,76 · **thirty-two** @348,37 · **about forty** @351,08 · **About seventy** @354,71 | Fifteen small boxes link into a team (presented, not shown live); a figure steers across a grid to a goal; three bars: 32 · 40 · 70 (numbers only, no "% of max"). | ① boxes link ② bars | plan sequence |
| 7.06 | [EXPL] | 356,25–366,71 | **No published paper** @361,26 · **today's best** @364,68 | Second gold token, second CATCH tag: ONE COMPANY · ONE TALK · NO PAPER YET. | ① token ② catch | plan sequence |

### c08 · Round 3 everything else · final score · pairing · is anyone in there? · 366,71–407,68 (41 s) · B2 · ★ – · [EXPL] 84%
Light/hero: Scoreboard 2 : 1 → pairing → fly down into the dish (plateNet)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 366,71–383,62 | **six months** @371,03 · **good days** @372,65 · **fast, precise math** @379,08 | Lamp 3; a six-month bar; a wave of good and bad days; a cool block of fast math. | ① bar ② wave | plan sequence |
| 8.02 | [EXPL] | 383,62–387,48 | **A big one** @386,21 | The A.I. token drops and grows giant. | ① token grows | plan sequence |
| 8.03 | [SCENE>EXPL] | 387,48–400,69 | **Two small points** @388,69 · **giant one** @390,61 · **pairing** @395,33 | 2 : 1 · WITH CATCHES (ladder answer); then pull back into the aisle: gold drawers and cool servers side by side in one rack: pairing. | ① score ② interlock | plan sequence |
| 8.04 | [EXPL] | 400,69–407,68 | **anyone in there** @405,61 | Fly down into the dish: one soma in the centre flickers (rung 6: IS ANYONE IN THERE?). | ① fly down | seam → **plateNet** |

### c09 · How big: fly < box < bee · ⅓ of a mouse in 120 dishes · 86 billion · no evidence · 407,68–445,41 (38 s) · B3 · ★ – · [EXPL] 83%
Light/hero: The size ladder (creatures) → 120 dishes → your head

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [EXPL] | 407,68–417,80 | **two hundred thousand** @411,84 · **fruit fly** @414,72 · **honeybee** @416,68 | From plateNet: pull back, the net shrinks into the box's window; the box stands on the size ladder: FLY < BOX < BEE (creature fill = neurons). | ① pull back ② ladder | plan sequence |
| 9.02 | [EXPL] | 417,80–432,96 | **a third** @420,60 · **mouse brain** @422,16 · **hundred and twenty** @424,48 · **eighty-six billion** @430,48 | A grid of 120 small dishes fills a third of a mouse silhouette; then your head: 86 BILLION. | ① grid fills ② your head | plan sequence |
| 9.03 | [EXPL>SCENE] | 432,96–445,41 | **no evidence** @437,36 · **structure** @442,88 | A signal arrow in, a reaction out, nothing in between that feels: NO EVIDENCE · STAY CAREFUL (ladder answer). | ① arrow | pull back into the aisle |

### c10 · Seth · embedded ethics (Johns Hopkins) · Hartung (C3) · what now? · 445,41–496,52 (51 s) · B3 · ★ – · [EXPL] 18%
Light/hero: The rack (anchor: a bee on the box) → the round table → C3 in a screen

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [SCENE] | 445,41–459,65 | **Anil Seth** @450,29 · **ChatGPT** @458,13 | The alive rack; a small bee silhouette rests on the box (scale). Label ANIL SETH · NEUROSCIENTIST. | ① bee ② label | plan sequence |
| 10.02 | [SCENE>EXPL] | 459,65–471,09 | **from the very start** @463,41 · **Ethicists** @465,05 · **embedded ethics** @469,77 | In the aisle, round the open drawer: ethicists, scientists, the public (three groups of small figures): EMBEDDED ETHICS. | ① groups gather | into the screen |
| 10.03 | [CLIP] | 471,09–490,36 | **what that means** @473,41 | **[C3 · ORIGINAL FOOTAGE]** Thomas Hartung · Johns Hopkins University · 2023, in the screen (CLIP_RECT). | ① footage | out of the screen |
| 10.04 | [SCENE] | 490,36–496,52 | **bee's brain** @494,71 | Out of the screen into the aisle: the alive rack, the bee on the box; ladder top: WHAT NOW? | ① ladder | plan sequence |

### c11 · The answer: order and noise · leaner learning · drug tests · three rules · the drawer closes + end screen · 496,52–594,58 (98 s) · B3 · ★ 11.08 · [EXPL] 71%
Light/hero: Dish field: callback, three rule cards → THE RACK: the drawer closes, you in the aisle

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 11.01 | [EXPL] | 496,52–506,53 | **Order** @501,73 · **teaching us back** @505,07 | Callback: the question line of 1.07 returns; ORDER … AND NOISE; the net sparks back at you. | ① question ② answer | plan sequence |
| 11.02 | [EXPL] | 506,53–516,48 | **very little power** @508,95 · **leaner** @515,58 | Two small gauges (power, practice) stay low; a cool software block slims. | ① block slims | plan sequence |
| 11.03 | [EXPL] | 516,48–531,03 | **Epilepsy** @518,64 · **Pong game** @523,67 · **animal experiments** @526,39 · **brain diseases** @529,01 | A drug drop on the neurons; the Pong rally improves; a mouse silhouette steps back. | ① drop ② mouse | plan sequence |
| 11.04 | [EXPL>SCENE] | 531,03–539,75 | **good rules** @534,47 · **Three would be** @536,51 | Pull back: the drawer in the aisle; three empty rule cards rise beside the rack (ladder answer 3 RULES). | ① cards rise | plan sequence |
| 11.05 | [EXPL] | 539,75–546,47 | **say yes** @542,85 | Card 1 fills: the donor tube + a tick: CONSENT. | ① card 1 | plan sequence |
| 11.06 | [EXPL] | 546,47–557,97 | **signs of experience** @551,10 · **oversight** @555,92 | Card 2 fills: a check-light over a growing net: CHECK, EVERY TIME. | ① card 2 | plan sequence |
| 11.07 | [EXPL>SCENE] | 557,97–564,52 | **anyone can check** @562,27 | Card 3 fills: an open book / open window: IN PUBLIC. | ① card 3 | tilt up out of the dish into the aisle |
| **11.08 ★** | [SCENE] | 564,52–582,08 | **imitate brain cells** @567,28 · **inside the machine** @570,12 · **up to us** @573,72 | **★** Back in the aisle: the drawer slides shut, its gold seam glows; you stand in front of the alive rack and look up. | ① drawer closes ② you | pull back into the end screen |
| 11.09 | [SCENE] | 582,08–594,58 | – | End screen (VO end → film end, ≤ 15 s, no voice). The aisle at night, slow pull back: the alive rack in the centre (x 840–1080), its seams breathing, you tiny before it. **Free areas for the YouTube end cards: left x 90–780 and right x 1140–1830, y 250–700**; nothing moves there but the grain. | ① seams breathe ② slow pull back | – |

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
