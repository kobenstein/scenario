# Film 18 · "AI Will End Capitalism" · shot list (binding for all builders)

As of 2026-11-05 (picture lead, v1). Script `film-kapitalismus/vo-v4.txt`. Generated tables between the SHOTS markers come from `tools/shots18.py` (edit the generator, then `python3 tools/shots18.py --md docs/shots.md`; the text outside the markers stays). Times come from the real VO (`film-kapitalismus/audio/timing.json`); the code anchors on the **bold words** only.

## 1 · How to read this
- **One chunk = one plan sequence** on THE BOARD (`MOTION.md` §2). A row is a shot inside the sequence, not a cut.
- **Layer:** `[SCENE]` = the 3D world (the board, its places, you), `[EXPL]` = an explainer graphic in the sky above the board, grown from a board object; `[SCENE>EXPL]` = a scene that turns into a graphic. The `[EXPL]` % per chunk is the spoken share of explainer time.
- **Anchors:** the bold words with their time (real VO). An accent lands on its word (±2 frames); camera keys sit on words.
- **Moves (≤ 2):** the hero motion ① and at most one support motion ②. Everything else is ambient.
- **Transition:** "plan sequence" = the next shot continues in the same move; otherwise carrier · screen position · direction. **SEAM** rows hand over to another builder through a plate (`lib/f18_seams.mjs`).
- **★** = the one wow moment of the chunk. Exactly one per chunk, c02 has none (it is the explainer chunk).
- One motif per sentence; a number is on screen only while its sentence runs plus the hold.

## 2 · Shots
<!-- SHOTS:BEGIN -->
| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |
|---|---|---|---|---|---|---|---|
| c01 | Lead | 0,00–44,49 | 44.5 | Hook · the engine (two price tags, the circle) · what you are paid for: thinking | Night board · hero: the giant price tag over you → the loop of light (the circle) → your tag cools in the machine light | 7 | 7% |
| c02 | B1 | 44,49–106,24 | 61.8 | The price of thinking falls · the crash story (Gawdat) · the pressure (two records) | The sky as explainer: the tag rides the falling price line to the zero line → the loop goes dark → the two coins (the first picture) | 6 | 85% |
| c03 | B1 | 106,24–179,94 | 73.7 | The real ending is the price · air · where does the money go · Britannica, music: onto the door | Board: the sky fills with evaporated prices (air) → the shelf of light → the record → THE FIRST DOOR | 10 | 36% |
| c04 | B1 | 179,94–230,62 | 50.7 | Thinking is next: words, advice, everything built from thinking · Chegg · Canva · the price left | Board: a wave of sinking tags round the loop → two value lines in the sky → the empty hook | 7 | 52% |
| c05 | B2 | 230,62–288,90 | 58.3 | The value stays ($17,000) · value looks for a door · the doors: ground, power, chips (Altman) | Board: the column of value without a tag → its light runs down the road → the three doors at the far corners | 9 | 36% |
| c06 | B2 | 288,90–331,74 | 42.8 | What scarcity pays: Nvidia · Loudoun County · the oldest door: the land under your house | The chip door (counter, ¾ coin) → the field of data-centre roofs → your house door → section: the dirt glows | 6 | 55% |
| c07 | B2 | 331,74–368,56 | 36.8 | The first picture again · not a crash: you pay at the door · the ground the machine stands on | The two coins again → wide: a free plain, three tall doors → you pay at each door → the ground under the data centre | 5 | 14% |
| c08 | B2 | 368,56–413,64 | 45.1 | A set of rules: the board revealed · Lizzie Magie · Henry George · two sets of rules | The rise: the world is a board on a table → the patent drawing (gold lines) → the two rule cards | 7 | 91% |
| c09 | B3 | 413,64–471,20 | 57.6 | Rules II: the free layer (GPS, roads) · land first (Baden-Württemberg) | Board: the road lights for everybody (free layer), satellites over it → the ground in the middle → section land vs building | 10 | 40% |
| c10 | B3 | 471,20–532,36 | 61.2 | Housing (Vienna) · energy (Middelgrunden) · who owns the door in Virginia · you can vote | Vienna block, ⅔ windows warm → the sea edge: the arc of turbines, the shared door → the zoning room, your raised hand | 9 | 37% |
| c11 | B3 | 532,36–596,82 | 64.5 | Ending: one price at a time · something to design · your move + end screen | The board at first light · you draw a new road · your move: one step onto the next field | 6 | 13% |

**Builders (seconds of picture):** Lead 44 s · B1 186 s · B2 183 s · B3 183 s (B3 includes the ≤ 15 s end screen). **Explainer share (spoken part):** 43% (mixed shots count half). Timing: `timing.json`.

### c01 · Hook · the engine (two price tags, the circle) · what you are paid for: thinking · 0,00–44,49 (44 s) · Lead · ★ 1.04 · [EXPL] 7%
Light/hero: Night board · hero: the giant price tag over you → the loop of light (the circle) → your tag cools in the machine light

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 1.01 | [SCENE] | 0,00–8,84 | **capitalism** @2,44 · **hundred years** @4,04 · **lifetime** @6,04 · **the way you think** @7,00 | **[THE BOARD · opening image]** Night. A dark plain runs to a faint cream horizon (the zero line). Over **you** (tiny, yellow raincoat) hangs a **giant price tag of light** on a thread from the dark (the hero). Low camera, close to the tag. On **capitalism** the tag swells and swings once. On **lifetime** you lift your head. On **the way you think** a thin stream of gold dust rises from the tag's lower edge (the first price becoming air; nothing explains it yet). | ① slow push ② the tag swings / dust | plan sequence |
| 1.02 | [SCENE] | 8,84–16,12 | **pays you** @11,84 · **make something** @12,52 · **sells it** @13,80 · **more than** @14,64 | Pull back and up: the plain is a world with a **road of light** running in a loop; a workshop (lit window) on the left, a shop (lit display) on the right. On **pays you** a **coin of light** rolls from the workshop along the road to you; on **make something** a small cube of light grows in your hands; on **sells it** the cube rides the road to the shop window. | ① pull back ② coin, then cube | plan sequence |
| 1.03 | [SCENE>EXPL] | 16,12–22,04 | **Your work** @16,12 · **What you make** @17,88 · **gap** @20,00 · **profit** @21,32 | On **Your work** the tag over you prints `$1`. On **What you make** a second tag lowers on its thread over the shop and prints `$2`. On **gap** a gold rule draws a bracket between the two tag bottoms; `PROFIT` rises inside it. | ① tag A prints ② tag B lowers, the bracket | plan sequence |
| **1.04 ★** | [SCENE] | 22,04–24,54 | **whole engine** @22,44 | **★ The circle.** The coin leaves the shop and runs the **whole loop** (far side and back to the workshop, then to you); the road lights behind it all the way round: the engine of capitalism as one ring of light, the two tags hanging over it like lanterns. Widest, calmest picture of the chunk. | ① the coin runs the loop ② camera rises | plan sequence |
| 1.05 | [SCENE] | 24,54–29,04 | **A.I.** @25,42 · **one of those prices** @26,50 | The machine appears as light, never as a robot: a small **cold blue-cream disc** rises above the zero line on the right. On **one of those prices** its cool light reaches your tag `$1`: the tag's edge cools. | ① the cold disc rises ② push toward you | plan sequence |
| 1.06 | [SCENE] | 29,04–38,24 | **email** @32,56 · **contract** @33,84 · **mistake** @35,20 · **customer** @37,36 | Close on you under your tag. One small light card rises from your hands per sentence, on its word, and settles in an arc beside you: an **envelope** (email), a **page with a signature line** (contract), **a line with one word ringed in gold** (mistake), a **speech bubble** toward a customer (indigo silhouette) who stands to your right. | ① one card per word | plan sequence |
| 1.07 | [SCENE] | 38,24–44,49 | **thinking** @39,12 · **cheap** @42,00 · **Fast** @42,92 | On **thinking** the four cards fold into one warm point of light above your hand (a thought) and its thread runs up to your tag: the tag hangs on the thought. On **cheap** the tag cools further and `$1` sinks off its face; on **Fast.** one drop of light runs off its lower edge (the only hard accent). Push into the tag. | ① cards → thought ② the tag cools, push | **SEAM plateTag** (Lead → B1): your tag, close, cool, empty face · centre · forward |

### c02 · The price of thinking falls · the crash story (Gawdat) · the pressure (two records) · 44,49–106,24 (62 s) · B1 · ★ – · [EXPL] 85%
Light/hero: The sky as explainer: the tag rides the falling price line to the zero line → the loop goes dark → the two coins (the first picture)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 44,49–55,59 | **twenty dollars** @49,22 · **eight novels** @50,26 · **Two years later** @52,18 · **seven cents** @54,42 | From plateTag: the tag hangs high left in the sky over the board; on **twenty dollars** it prints `$20` (dark ink). Its thread bends into a **falling price line** across the sky down to the zero line. On **Two years later** the tag slides down the line, the number counting down; it lands at `7¢` on **seven cents**. Small: `GPT-3.5-LEVEL A.I. · PRICE PER 1M TOKENS (≈ 8 NOVELS)` · `NOV 2022` / `OCT 2024` · `STANFORD AI INDEX 2025`. | ① $20 prints ② the tag rides down | plan sequence |
| 2.02 | [EXPL] | 55,59–60,84 | **thirteen times** @57,18 · **year after year** @58,58 | The line steps on to the right toward the zero line; on **thirteen times** `≈ 13× CHEAPER A YEAR` rises under it (`EPOCH AI · 3-YEAR AVERAGE`). The tag shrinks a step on **year after year** and almost touches the zero line. | ① the line steps on | transformation · the price line sinks into the zero line; tilt down to the loop · down |
| 2.03 | [SCENE] | 60,84–70,12 | **takes my job** @63,80 · **paycheck** @65,80 · **buys anything** @66,92 · **collapses** @68,84 | The **crash story** on the loop from 1.04 (the version everybody tells): on **takes my job** the workshop window goes dark; on **paycheck** the coin stops; on **buys anything** the shop window dims; on **collapses** the road's light runs out round the loop. No explosion, no red. | ① stations go dark one by one | plan sequence |
| 2.04 | [EXPL] | 70,12–81,34 | **Mo Gawdat** @71,80 · **for a dollar** @76,48 · **for two** @78,04 · **disappear** @79,48 | **Quote card** in the sky over the dark loop (≥ 4 s, the voice runs on): "The very base of capitalism … to hire you for a dollar and then sell what you make for two … is going to disappear." · `MO GAWDAT · FORMER GOOGLE X · BUSINESS INSIDER, 2025`. On **for a dollar** / **for two** the phrases warm and the `$1` / `$2` tags from 1.03 glow faintly on the board below (callback). | ① lines rise ② two phrases warm | transformation · the card sinks; the stopped coin rises into the sky and splits into two coins · up |
| 2.05 | [EXPL] | 81,34–100,26 | **Between April and June** @83,82 · **more profit** @87,82 · **two thousand nine** @91,62 · **smallest slice** @96,30 · **nineteen forty-seven** @98,22 | **THE FIRST PICTURE (`f18_kit.firstPicture`, exactly this composition again in 7.01).** Two coins of light: left the **profit slice of every sales dollar** grows on **more profit** to `17.0 %`, `HIGHEST SINCE 2009` on **two thousand nine** (`S&P 500 · FACTSET`); right **your slice of what business produced** narrows on **smallest slice** to `52.8 %`, `LOWEST SINCE 1947` (`U.S. BUSINESS SECTOR · BLS`). Two coins, never one pie (different measures). | ① left coin ② right coin | plan sequence |
| 2.06 | [EXPL] | 100,26–106,24 | **Bigger profits** @100,26 · **Smaller slice** @101,50 · **Same three months** @103,38 | On **Bigger profits** the left slice glows; on **Smaller slice for you** the right slice dims and you (tiny, on the board below the coins) look up; on **Same three months** one line rises between them: `SAME THREE MONTHS · APRIL–JUNE 2026`. | ① slices ② the date line | tilt down · carrier the coins sink back into the loop as the one coin · down |

### c03 · The real ending is the price · air · where does the money go · Britannica, music: onto the door · 106,24–179,94 (74 s) · B1 · ★ 3.03 · [EXPL] 36%
Light/hero: Board: the sky fills with evaporated prices (air) → the shelf of light → the record → THE FIRST DOOR

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 3.01 | [SCENE] | 106,24–111,78 | **real ending** @107,36 · **the price** @109,84 | Back on the board, the coin at rest on the loop; on **the price** the camera finds your tag again (cool, empty face) and it swings into the centre. | ① tilt down ② the tag swings | plan sequence |
| 3.02 | [SCENE] | 111,78–118,42 | **scarce** @114,50 · **air** @116,26 · **plenty** @117,34 | On **scarce** a few tags over the board glow; on **air** a small tag drifts down out of the sky over you, its thread finds nothing to hang on and it slips away; on **plenty** the air shimmers (fine dust everywhere, you breathe: your shoulders rise). | ① a tag slips off the air | plan sequence |
| **3.03 ★** | [SCENE] | 118,42–128,60 | **plentiful as air** @120,30 · **cheaper** @123,74 · **nothing left** @126,26 | **★ Prices become air.** The thought above your hand (1.07) multiplies into thousands of points that rise and fill the sky like air. On **cheaper, and cheaper** the tags over the board slide down their threads one after another toward the zero line; on **nothing left** they touch it and evaporate upward: the stars are the prices that left. Camera rises to the widest picture. | ① the tags sink in a wave ② camera rises | plan sequence |
| 3.04 | [SCENE] | 128,60–134,38 | **runs out** @131,24 | Wide: the loop with almost no tags. The coin still rolls, but at each place it finds nothing to stop for; on **runs out** it slows. | ① the coin slows | plan sequence |
| 3.05 | [SCENE] | 134,38–141,44 | **money go** @135,42 · **still gets paid** @136,66 · **leave you** @138,86 | Three questions, three small beats: the coin stops in the middle of the road (**money go**); the last threads in the sky tremble (**still gets paid**); you turn and look up (**leave you**). | ① coin stops ② you look up | move · the camera travels along the road to an older field · right |
| 3.06 | [SCENE] | 141,44–147,92 | **hit zero** @142,48 · **same question** @145,16 | An older field on the loop: a tall **shelf of encyclopedia volumes** (gold spines of light), a heavy tag over it. | ① camera travel | plan sequence |
| 3.07 | [EXPL] | 147,92–161,56 | **hundred and twenty thousand** @150,24 · **price of a fact** @154,32 · **presses stopped** @160,28 · **two hundred and forty-four** @158,20 | `BRITANNICA · 1990` and the counter `120,000 SETS` rise over the shelf. On **price of a fact** the tag slides down to the zero line; on **presses stopped** the spines go dark one by one; `1768 – 2012` on **two hundred and forty-four**. | ① counter ② spines go dark | plan sequence |
| 3.08 | [EXPL] | 161,56–167,04 | **hundred and ninety million** @163,08 · **free to you** @165,68 | Pages lift off the dark shelf and rise into the air as countless points of light; `WIKIPEDIA · ≈ $190M A YEAR` on the number, `FREE TO YOU` on **free to you** (`WIKIMEDIA 2025`). | ① pages rise | move · along the road to the next field · right |
| 3.09 | [EXPL] | 167,04–174,48 | **song hit zero** @168,88 · **more than half** @171,20 · **subscription** @173,60 | A **record of light** (a disc) with its tag. On **song hit zero** the tag sinks; a line in the sky above it: `U.S. MUSIC · $14.6B (1999) → $7.0B (2014)` falls by more than half on **more than half**, then climbs again as a dotted line on **subscription** (`RIAA`). | ① the tag sinks ② the line falls and climbs | plan sequence |
| 3.10 | [SCENE] | 174,48–179,94 | **moved** @176,16 · **off the song** @177,04 · **onto the door** @178,04 | **The first door.** On **moved** the record's tag lifts off its thread and travels along the road; behind the record field a **door of light** rises from the board (`f18_kit.door`); on **onto the door** the tag hangs itself on the door: the price moved, it did not die. Hold on the door. | ① the tag travels ② the door rises | move · back along the road to your field · left |

### c04 · Thinking is next: words, advice, everything built from thinking · Chegg · Canva · the price left · 179,94–230,62 (51 s) · B1 · ★ 4.04 · [EXPL] 52%
Light/hero: Board: a wave of sinking tags round the loop → two value lines in the sky → the empty hook

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [SCENE] | 179,94–182,82 | **reaching thinking** @181,18 | Back at your field: your cool tag over you; behind you along the road a row of small fields, each with a tag. | ① camera travel | plan sequence |
| 4.02 | [SCENE] | 182,82–188,58 | **draft** @184,74 · **summary** @185,62 · **bug fix** @186,50 · **cents** @187,62 | Three small light cards on the near fields (a page, a short page, a line of code with a bracket); their tags slide down one after another on **draft**, **summary**, **bug fix** and print `¢` on **cents**. | ① three tags sink in turn | plan sequence |
| 4.03 | [SCENE] | 188,58–194,10 | **second opinion** @190,26 · **scan** @191,46 · **lease** @192,18 | Two bigger fields further along: a dark scan film with one bright round shape (**scan**) and a lease page (**lease**); their tags sink. | ① two tags sink | plan sequence |
| **4.04 ★** | [SCENE] | 194,10–199,72 | **drug** @196,70 · **bridge** @197,30 · **lesson** @198,10 | **★** Pull back: big fields round the far side of the loop: a capsule, a bridge silhouette, a school board, each under a huge tag; on each word the tag starts to sink: a wave of falling prices runs round the circle. | ① the wave ② pull back | plan sequence |
| 4.05 | [EXPL] | 199,72–212,20 | **Chegg** @199,72 · **ninety-nine percent** @204,76 · **half its staff** @208,92 · **named A.I.** @210,28 | A field with the word `CHEGG` (type only, no logo): its value as a line in the sky falls on **ninety-nine percent**: `−99 % SINCE 2021`. On **half its staff** a row of 20 lit desks beside it, 9 go dark: `−45 % STAFF · OCT 2025`; on **named A.I.** a small line `A.I. NAMED AS A REASON` (`CNBC`). | ① the line falls ② desks go dark | plan sequence |
| 4.06 | [EXPL] | 212,20–225,88 | **Canva** @212,20 · **growth slowdown** @217,72 · **isn't taking those jobs** @221,40 · **either way** @224,76 | A field with `CANVA` (type only): a rising growth line with a small bend on **growth slowdown**: `JOB CUTS · FIRST GROWTH SLOWDOWN IN 10 YEARS · NOV 2026`; on **isn't taking those jobs** a small line `CANVA: NOT REPLACED BY A.I.`; on **either way** the design tag over the field still sinks. | ① the dip ② the tag sinks | plan sequence |
| 4.07 | [SCENE] | 225,88–230,62 | **didn't fail** @227,48 · **price left** @228,68 | Small silhouettes at the Chegg and Canva fields stay lit (**didn't fail**). On **price left** the tags lift off their threads and drift away along the road; the camera pushes up to one empty hook over the field. | ① tags leave ② push to the hook | **SEAM plateHook** (B1 → B2): the empty hook over a column of light · centre · forward |

### c05 · The value stays ($17,000) · value looks for a door · the doors: ground, power, chips (Altman) · 230,62–288,90 (58 s) · B2 · ★ 5.07 · [EXPL] 36%
Light/hero: Board: the column of value without a tag → its light runs down the road → the three doors at the far corners

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE] | 230,62–239,90 | **value** @230,94 · **search engines** @237,26 · **nothing** @238,94 | From plateHook: pull back; the column of warm light under the empty hook stands on your field: the **value**. On **search engines** a long search bar of light (a magnifier glyph, no logo) grows across the column; no tag. | ① pull back ② the bar grows | plan sequence |
| 5.02 | [EXPL] | 239,90–243,74 | **seventeen thousand** @241,34 | The column rises on **seventeen thousand**: `$17,000 A YEAR` (`PNAS 2019`, median, to give up search engines). | ① the column rises | plan sequence |
| 5.03 | [SCENE] | 243,74–247,92 | **vanished** @244,38 · **value stayed** @245,42 | Two things side by side: the empty hook (**vanished**) and the tall column (**value stayed**). Breathing hold. | ① hold | plan sequence |
| 5.04 | [SCENE] | 247,92–257,44 | **door** @250,32 · **Music found one** @251,28 · **retreats** @255,08 · **behind the doors** @255,92 | The column's light pours down onto the road and runs along it like water; it passes the record field, whose door (3.10) glows (**Music found one**); on **retreats** the coin rolls along and slips through the door; on **behind the doors** the door swings half shut. | ① the light runs ② the coin goes through | plan sequence |
| 5.05 | [SCENE] | 257,44–261,82 | **subscribe** @259,28 | You step after it to the door and look back (subtle; no logos, no buttons). | ① you walk | plan sequence |
| 5.06 | [SCENE] | 261,82–265,36 | **where it goes** @262,22 | The camera follows the light round the corner of the loop. | ① camera follows | plan sequence |
| **5.07 ★** | [SCENE] | 265,36–271,92 | **can't be copied** @266,96 · **The ground** @268,40 · **The power** @269,44 · **The chips** @270,48 | **★ The three doors.** At the far corners of the loop three tall doors of light rise, one per word: a door on a field of bare earth (**The ground**), a door under a power line / a turbine (**The power**), a door set into a chip-shaped block (**The chips**). Each takes a heavy tag. | ① three doors in turn ② slow pull back | plan sequence |
| 5.08 | [EXPL] | 271,92–280,96 | **Sam Altman** @271,92 · **cost of intelligence** @275,92 · **electricity** @279,60 | **Quote card** over the doors (≥ 4 s): "the cost of intelligence should eventually converge to near the cost of electricity." · `SAM ALTMAN · "THE GENTLE SINGULARITY", 2025`; "near the cost of electricity" warms on **electricity**. | ① lines rise | transformation · the card sinks into a bill of light · down |
| 5.09 | [EXPL] | 280,96–288,90 | **the bill** @283,28 · **The power** @284,16 · **The chips** @285,12 · **The ground under** @286,08 | A **bill** (receipt of light) unrolls: `THINKING ……… ≈ 0` sits dim; on each word the line `POWER`, `CHIPS`, `GROUND` lights and its door behind glows. | ① the bill lines light | transformation · the CHIPS line → the chip door · up |

### c06 · What scarcity pays: Nvidia · Loudoun County · the oldest door: the land under your house · 288,90–331,74 (43 s) · B2 · ★ 6.06 · [EXPL] 55%
Light/hero: The chip door (counter, ¾ coin) → the field of data-centre roofs → your house door → section: the dirt glows

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 6.01 | [EXPL] | 288,90–295,94 | **Nvidia** @288,90 · **ninety-six billion** @291,86 · **single quarter** @294,18 | The chip door close; above it `NVIDIA` (type only) and the counter `$96.2B` on **ninety-six billion**, `ONE QUARTER · TO JULY 2026` (`NVIDIA`). | ① counter | plan sequence |
| 6.02 | [EXPL] | 295,94–300,05 | **three quarters** @296,54 · **gross profit** @298,50 | A coin of light with three quarters lit on **three quarters**: `75 % GROSS MARGIN`. | ① the coin fills | plan sequence |
| 6.03 | [SCENE] | 300,05–303,54 | **villainy** @300,50 · **scarcity pays** @301,86 | No villain: the door is just a door; on **scarcity pays** the coin rolls through it and the tag glows. | ① the coin rolls in | move · along the road to the ground door · left |
| 6.04 | [SCENE] | 303,54–315,24 | **Loudoun** @303,54 · **biggest cluster** @306,10 · **two to six million** @311,78 | At the ground door: the field covered with flat **data-centre roofs** (rows of cool rectangles, small blinking lights). `LOUDOUN COUNTY, VIRGINIA`; on **two to six million** the counter `$2–6 MILLION AN ACRE` (`LOUDOUN COUNTY`). | ① roofs spread ② counter | move · along the road to your house · left |
| 6.05 | [SCENE] | 315,24–319,32 | **oldest door** @315,56 · **every month** @318,04 | Your house on the board, its front door with a monthly tag; on **every month** the tag swings once. | ① the tag swings | transformation · the ground under the house opens as a section · down |
| **6.06 ★** | [EXPL] | 319,32–331,74 | **fourteen** @319,80 · **eighty percent** @321,80 · **land underneath** @327,24 · **Not the bricks** @328,84 · **The dirt** @329,92 | **★ Section through your house.** House above, a layer of earth below. On **eighty percent** most of the price glows in the earth: `80 % OF THE RISE IN HOUSE PRICES` (`14 COUNTRIES · SINCE 1950 · KNOLL, SCHULARICK & STEGER 2017`); on **Not the bricks** the house lifts off; on **The dirt** the tag stays on the bare ground. | ① the earth lights ② the house lifts | plan sequence |

### c07 · The first picture again · not a crash: you pay at the door · the ground the machine stands on · 331,74–368,56 (37 s) · B2 · ★ 7.03 · [EXPL] 14%
Light/hero: The two coins again → wide: a free plain, three tall doors → you pay at each door → the ground under the data centre

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 7.01 | [EXPL] | 331,74–336,86 | **first picture** @332,38 · **record margins** @333,82 · **record low** @335,10 | The two coins of 2.05 rise again, same composition (`firstPicture`): left glows on **record margins**, right on **record low**. | ① the coins rise | plan sequence |
| 7.02 | [SCENE] | 336,86–343,36 | **direction** @337,70 · **follow the price** @341,23 | The coins sink into the loop; the coin follows the tags along the road toward the doors; small arrows of light on the road point the same way. | ① the coin follows | plan sequence |
| **7.03 ★** | [SCENE] | 343,36–352,16 | **nearly free** @347,28 · **very few people** @350,64 | **★ The world of the doors.** Wide: the board almost without tags under a sky full of air, only the three doors stand tall with heavy tags; on **very few people** one indigo silhouette appears at each door. | ① pull back ② the three keepers | plan sequence |
| 7.04 | [SCENE] | 352,16–360,48 | **don't go hungry** @353,24 · **at the door** @354,84 · **Every month** @356,08 · **the ground, the power and the chips** @357,60 | You walk the road (warm windows, a lit table: **don't go hungry**); at each door a coin leaves your hand; on **Every month** the same thing again (a thin moon in the sky turns a phase). | ① you walk ② coins at the doors | plan sequence |
| 7.05 | [SCENE] | 360,48–368,56 | **the machine** @362,76 · **the ground the machine stands on** @364,08 | The camera passes the data centre (**the machine**) and sinks to the ground under it: the field's earth glows warm. | ① descend | move · the camera rises straight up from the ground · up |

### c08 · A set of rules: the board revealed · Lizzie Magie · Henry George · two sets of rules · 368,56–413,64 (45 s) · B2 · ★ 8.01 · [EXPL] 91%
Light/hero: The rise: the world is a board on a table → the patent drawing (gold lines) → the two rule cards

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **8.01 ★** | [SCENE] | 368,56–372,40 | **law of nature** @369,36 · **set of rules** @371,04 | **★ The reveal.** The camera rises and pulls back until the zero line becomes the **edge of a board**: the plain, its road and doors lie on a game board on a dark table (a lamp pool on the table). On **set of rules** the road's field ticks light all round. | ① rise and pull back | plan sequence |
| 8.02 | [EXPL] | 372,40–377,52 | **Lizzie Magie** @373,68 · **board game** @375,16 · **teach** @375,80 | The board's outline morphs into a **top-down patent drawing** in gold lines (square, fields, corners); `LIZZIE MAGIE · PATENTED 1904` on **Lizzie Magie**. | ① outline → drawing | plan sequence |
| 8.03 | [EXPL] | 377,52–381,80 | **Monopoly** @378,24 · **Landlord's Game** @380,32 | Type only (no logo, no trade dress): `MONOPOLY` rises on **Monopoly**; on **The Landlord's Game** it sinks and `THE LANDLORD’S GAME` rises in its place. | ① word swap | plan sequence |
| 8.04 | [EXPL] | 381,80–391,52 | **Henry George** @384,08 · **everyone around it** @387,28 · **belongs to everyone** @389,88 | One field of the drawing; many small points (people) round it; on **everyone around it** light flows from them into the field (its value); on **belongs to everyone** it flows back out to all of them. `HENRY GEORGE` on his name. | ① flow in ② flow out | plan sequence |
| 8.05 | [EXPL] | 391,52–399,68 | **two sets** @392,32 · **single player** @394,80 · **everybody wins** @398,24 | Two **rule cards** (`f18_kit.ruleCard`) rise beside the drawing: `Rules I` / `Rules II`. On **single player** the board fills with one colour under card I (a door on every field); on **everybody wins** all fields light warm under card II. | ① card I ② card II | plan sequence |
| 8.06 | [EXPL] | 399,68–403,62 | **kept the first** @399,84 · **forgotten** @401,84 | Card I stays; on **forgotten** card II slides under the board into the dark. | ① card II slides away | plan sequence |
| 8.07 | [EXPL] | 403,62–413,64 | **abundant** @407,30 · **shared, fairly** @410,66 | Card II is drawn back out of the dark and turns to us; push in. | ① the card returns ② push | **SEAM plateRules** (B2 → B3): rule card II, close · centre · forward |

### c09 · Rules II: the free layer (GPS, roads) · land first (Baden-Württemberg) · 413,64–471,20 (58 s) · B3 · ★ 9.06 · [EXPL] 40%
Light/hero: Board: the road lights for everybody (free layer), satellites over it → the ground in the middle → section land vs building

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [SCENE] | 413,64–418,76 | **already in play** @415,16 · **quietly** @416,44 | From plateRules: the card lays itself down onto the board; we descend back to eye level on the night board. | ① the card lays down ② descend | plan sequence |
| 9.02 | [SCENE] | 418,76–422,32 | **set free** @420,24 | On **set free** the whole loop road lights warm, end to end, with no tag on it: the **free layer**. | ① the road lights | plan sequence |
| 9.03 | [SCENE] | 422,32–427,24 | **GPS** @423,48 · **whole world** @425,40 · **free** @426,44 | Three small satellites of light high in the sky; on **whole world** rings descend from them onto the board; on **free** they touch the road. | ① rings descend | plan sequence |
| 9.04 | [EXPL] | 427,24–433,52 | **one point four trillion** @430,84 | Counter in the sky: `$1.4 TRILLION` · `GAINED BY U.S. COMPANIES BY 2017` (`NIST 2019`). | ① counter | plan sequence |
| 9.05 | [SCENE] | 433,52–436,48 | **everyone earns** @435,00 | The road's light runs into all the fields: windows along the loop light one after another. | ① windows light | plan sequence |
| **9.06 ★** | [SCENE] | 436,48–448,69 | **free layer** @439,48 · **roads** @440,44 · **at a door** @442,68 · **Lagos** @445,16 · **Ohio** @446,44 | **★ The free layer.** Wide on the lit road; on **at a door** a door that stood on the road folds away; on **Lagos** / **Ohio** two tiny figures on opposite sides of the loop (a kid, a plumber with a toolbox; indigo silhouettes) are lit by the same road: `LAGOS` · `OHIO`. | ① the door folds ② two figures | plan sequence |
| 9.07 | [SCENE] | 448,69–454,22 | **run together** @450,22 · **Land first** @451,34 · **nobody made it** @452,54 | The middle of the board: bare ground inside the loop; many small points of people round it. | ① camera to the middle | transformation · the ground opens as a section · down |
| 9.08 | [EXPL] | 454,22–461,50 | **Baden-Württemberg** @456,22 · **land alone** @459,10 · **not the building** @460,22 | Section: a building above, the land below. On **land alone** the tag hangs on the land layer; the building gets none (**not the building**). `BADEN-WÜRTTEMBERG · TAX ON LAND VALUE · SINCE 2025`. | ① the tag finds the land | plan sequence |
| 9.09 | [EXPL] | 461,50–467,10 | **tax doesn't rise** @462,54 · **top tax court** @464,66 · **this spring** @466,14 | The building grows two floors; the tag stays the same (**tax doesn't rise**). `FEDERAL FISCAL COURT (BFH) · UPHELD 2026`. | ① the building grows | plan sequence |
| 9.10 | [EXPL] | 467,10–471,20 | **nobody made** @467,66 · **people build** @469,26 | The land glows warm (**nobody made**), the building stays plain light (**people build**). | ① the land warms | transformation · the building becomes the Vienna block · up |

### c10 · Housing (Vienna) · energy (Middelgrunden) · who owns the door in Virginia · you can vote · 471,20–532,36 (61 s) · B3 · ★ 10.06 · [EXPL] 37%
Light/hero: Vienna block, ⅔ windows warm → the sea edge: the arc of turbines, the shared door → the zoning room, your raised hand

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [SCENE] | 471,20–479,60 | **Vienna** @474,00 · **two thirds** @476,16 · **affordable** @478,04 | A block of flats on a field; on **two thirds** two thirds of its windows light warm: `VIENNA · SINCE 2019 · ⅔ AFFORDABLE`. | ① windows light | plan sequence |
| 10.02 | [EXPL] | 479,60–482,04 | **capped** @480,67 | The land's tag under the block gets a lid line: `LAND PRICE CAPPED · €188 / m²`. | ① the cap | plan sequence |
| 10.03 | [SCENE] | 482,04–485,78 | **still argues** @483,52 | A few windows flicker (people arguing), small silhouettes in them. | ① flicker | move · along the road to the board's edge: the sea · right |
| 10.04 | [SCENE] | 485,78–491,14 | **Copenhagen** @487,10 · **wind farm** @488,18 · **two thousand** @489,90 | The board's edge becomes the sea; an **arc of 20 turbines** turning slowly: `MIDDELGRUNDEN · OFF COPENHAGEN · SINCE 2000`. | ① turbines turn ② camera travel | plan sequence |
| 10.05 | [EXPL] | 491,14–497,66 | **Half** @491,14 · **utility** @492,34 · **eight and a half thousand** @494,66 · **cooperative** @496,50 | The arc splits: 10 turbines cool-cream `CITY UTILITY`, 10 warm; on **eight and a half thousand** a stream of points runs into the warm half: `≈ 8,500 PEOPLE · CO-OP`. | ① split ② points | plan sequence |
| **10.06 ★** | [SCENE] | 497,66–503,44 | **always free** @498,54 · **chose to share** @500,74 | **★** A door on the shore, wide open; on **chose to share** many tiny figures pass through it, you among them. | ① the door opens ② people pass | move · back across the board to the Loudoun field · left |
| 10.07 | [SCENE] | 503,44–509,84 | **data center** @505,44 · **Virginia** @507,60 · **Who owns the door** @508,40 | The data-centre field from 6.04, a new hall rising on it, its door; on **Who owns the door** its tag swings. | ① the hall rises | plan sequence |
| 10.08 | [SCENE] | 509,84–518,74 | **state legislatures** @511,84 · **zoning meetings** @513,52 · **can't vote** @515,64 · **You can** @516,84 | A meeting-room window at the field's edge: inside, rows of silhouettes; the data centre outside. On **can't vote** the hall's lights blink, silent; on **You can** you raise your hand (yellow). | ① your hand | plan sequence |
| 10.09 | [EXPL] | 518,74–532,36 | **already owns** @520,42 · **up front** @522,90 · **the few** @526,58 · **everyone** @528,58 | The door's value as a flow of light that forks: on **the few** it runs into a few hands; on **everyone** it widens and runs out to all the points round the field. | ① the flow forks | move · along the road to the shelf field · left |

### c11 · Ending: one price at a time · something to design · your move + end screen · 532,36–596,82 (64 s) · B3 · ★ 11.03 · [EXPL] 13%
Light/hero: The board at first light · you draw a new road · your move: one step onto the next field

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 11.01 | [SCENE] | 532,36–540,84 | **crash** @533,96 · **encyclopedia** @535,72 · **one price at a time** @537,48 · **value stays** @539,16 | The shelf field of 3.06 (callback): tags rise one by one into the air; the light of the shelf stays (**value stays**). | ① tags rise in turn | plan sequence |
| 11.02 | [EXPL] | 540,84–546,92 | **behind the doors** @542,92 · **same board** @544,28 · **two sets of rules** @545,32 | Rise: the whole board from above; the two rule cards stand beside it. | ① rise | plan sequence |
| **11.03 ★** | [SCENE] | 546,92–555,26 | **best news** @547,92 · **survive** @551,64 · **design** @553,48 | **★ Design.** Down on the board, you draw a new line of light from your hand along the ground toward the middle; on **design** it joins the road. | ① the line ② you | plan sequence |
| 11.04 | [SCENE] | 555,26–562,46 | **in its place** @558,34 · **in the room** @560,18 | The meeting-room window (10.08), small; you inside it. | ① push | plan sequence |
| 11.05 | [SCENE] | 562,46–574,04 | **which price** @563,62 · **line of work** @564,54 · **subscribe** @569,78 | Your field, your tag over you; on **which price** it swings, a small `?` on its face. | ① the tag swings | plan sequence |
| 11.06 | [SCENE] | 574,04–580,92 | **free** @575,48 · **ground it stands on** @576,68 · **Your move** @580,04 | First light at the zero line; the board warms. On **ground it stands on** the middle ground glows; on **Your move** you take one step onto the next field. | ① dawn ② your step | pull back into the end screen |
| 11.07 | [SCENE] | 580,92–596,82 | – | End screen (VO end → film end, ≤ 15 s, no voice). The board at first light, slow pull back and rise; the road lit, a few tags drifting up into the air, you tiny on your new field. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload), quiet sky/board there; subscribe space centre x 810–1110, y 330–600. Never static. | ① pull back ② dust | – |

<!-- SHOTS:END -->

## 3 · Hard world changes (the camera leaves the plain)
| # | Shot | Change | Carrier |
|---|---|---|---|
| 1 | 6.05 → 6.06 | the ground under your house opens as a section (land vs bricks) | the house card stays, the earth below it is cut open (transformation, down) |
| 2 | 8.01 → 8.02 | ★ the rise: the board on a table → the patent drawing | the zero line becomes the board's edge; the board's lines become the gold patent lines |
| 3 | 9.07 | section land vs building (Baden-Württemberg) | the ground in the middle of the board opens (transformation, down) |
| 4 | 10.08 | the zoning meeting room in Loudoun County | a meeting-room window at the data-centre field's edge; the camera pushes through it |

4 hard changes in ≈ 9.5 min ≈ 0.4/min (budget ≤ ~1/min). The sky graphics (c02, 2.05, 3.07–3.09, 4.05–4.06, 5.02, 5.08, 6.01–6.02, 7.01, 8.03–8.06, 9.08–9.09, 10.02, 10.05) are not world changes: they grow out of a board object and sink back.

## 4 · Quotes, numbers and on-screen text (exact; sources from `faktenzettel.md` / `faktencheck.md`)
**Quote cards** (word for word, ≥ 4 s, the voice runs on):
- 2.04 **Mo Gawdat**: "The very base of capitalism, which is labor arbitrage – to hire you for a dollar and then sell what you make for two – is going to disappear." · `MO GAWDAT · FORMER GOOGLE X · BUSINESS INSIDER, 2025`. The VO paraphrases him; the card is the original wording (the claim is disputed: the film answers it, never endorses it).
- 5.08 **Sam Altman**: "the cost of intelligence should eventually converge to near the cost of electricity." · `SAM ALTMAN · "THE GENTLE SINGULARITY", 2025`.
- Paul Mason ("markets are based on scarcity while information is abundant", Guardian 2015) is **not** in vo-v4: no card unless the script adds him.

**Numbers on screen (only these):**
| Shot | On screen | Source line |
|---|---|---|
| 1.03 | `$1` · `$2` · `PROFIT` | – (parable) |
| 2.01 | `$20` → `7¢` · `GPT-3.5-LEVEL A.I. · PRICE PER 1M TOKENS (≈ 8 NOVELS)` · `NOV 2022` / `OCT 2024` | `STANFORD AI INDEX 2025` |
| 2.02 | `≈ 13× CHEAPER A YEAR` | `EPOCH AI · 3-YEAR AVERAGE` |
| 2.05–2.06 | `17.0 %` `HIGHEST SINCE 2009` · `52.8 %` `LOWEST SINCE 1947` · `SAME THREE MONTHS · APRIL–JUNE 2026` | `S&P 500 · FACTSET` · `U.S. BUSINESS SECTOR · BLS` (two coins, never one pie) |
| 3.07 | `BRITANNICA · 1990` · `120,000 SETS` · `1768 – 2012` | – |
| 3.08 | `WIKIPEDIA · ≈ $190M A YEAR` · `FREE TO YOU` | `WIKIMEDIA 2025` |
| 3.09 | `U.S. MUSIC · $14.6B (1999) → $7.0B (2014)` | `RIAA` |
| 4.05 | `CHEGG` · `−99 % SINCE 2021` · `−45 % STAFF · OCT 2025` · `A.I. NAMED AS A REASON` | `CNBC` |
| 4.06 | `CANVA` · `JOB CUTS · FIRST GROWTH SLOWDOWN IN 10 YEARS · NOV 2026` · `CANVA: NOT REPLACED BY A.I.` | – |
| 5.02 | `$17,000 A YEAR` (value of free search engines per user) | `PNAS 2019` |
| 6.01–6.02 | `NVIDIA` · `$96.2B` · `ONE QUARTER · TO JULY 2026` · `75 % GROSS MARGIN` | – |
| 6.04 | `LOUDOUN COUNTY, VIRGINIA` · `$2–6 MILLION AN ACRE` | – (county figure) |
| 6.06 | `80 % OF THE RISE IN HOUSE PRICES` | `14 COUNTRIES · SINCE 1950 · KNOLL, SCHULARICK & STEGER 2017` |
| 8.02–8.04 | `LIZZIE MAGIE · PATENTED 1904` · `THE LANDLORD’S GAME` · `HENRY GEORGE` · `MONOPOLY` | – |
| 9.04 | `$1.4 TRILLION` · `GAINED BY U.S. COMPANIES BY 2017` | `NIST 2019` |
| 9.08–9.09 | `BADEN-WÜRTTEMBERG · TAX ON LAND VALUE · SINCE 2025` · `FEDERAL FISCAL COURT (BFH) · UPHELD 2026` | – |
| 10.01–10.02 | `VIENNA · SINCE 2019 · ⅔ AFFORDABLE` · `LAND PRICE CAPPED · €188 / m²` | – |
| 10.04–10.05 | `MIDDELGRUNDEN · OFF COPENHAGEN · SINCE 2000` · `≈ 8,500 PEOPLE · CO-OP` · `CITY UTILITY` | – |

Fact-check notes for the picture: the two coins are two different measures (never draw them as slices of one pie); Canva's growth slowed, it did not fall; the Epoch 13× is a three-year average; the BFH decision is dated 22 April 2026 and was published in May (on screen only the year); constitutional complaints are pending (the VO may add this). If the fact check changes a number, change it in `tools/shots18.py` and in your scene.
