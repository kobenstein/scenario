# Film 16 · "Claude's Constitution in 10 Minutes" · shot list v1 (binding for the builders)

As of 2026-10-28 (picture lead). Script `film-verfassung/vo-v4.txt`, timing `film-verfassung/audio/timing.json` (real VO, 582.8 s incl. the end screen of at most 15 s that keeps moving). All times below are computed from `timing.json`; the code only anchors on words. World, look, kit and budgets: `MOTION.md` (read first). Split and rules for the builders: `BRIEF-builders.md`.
**Source of this file:** `tools/shots16.py` (shots with phrase anchors; times and explainer share are computed from `timing.json`). Change shots there and rewrite with `python3 tools/shots16.py --md docs/shots.md`; never edit the tables between the markers by hand.

## §1 Reading guide
- **ID** = chunk.number. **Time** = from–to in film seconds; a shot starts with its first VO phrase and runs to the next one; pauses belong to the shot before (the move keeps running).
- **Layer:** `[SCENE]` = a world (place, figures, one light form); `[EXPL]` = an explainer graphic (light on night, numbers in cream); `[SCENE>EXPL]` / `[EXPL>SCENE]` = the shot holds the transformation (counts half).
- **Anchor** = accent word `@` second. In code always anchor on the phrase (`T.G('dropped sharply', 0, after)`), never on the second.
- **Move** = at most 2 main moves, the camera counts. Ambient life (breathing, stars, dust, grain, the cursor blink, drift) is always there and does not count.
- **Transition → carrier:** type · `carrier A → B` · screen position · direction. Types: **plan sequence** (same set-up, a new motif grows out of what is there), **move** (the camera follows the carrier), **transformation** (shape becomes shape), **flight** (into a surface), **pull back**, **match move** (same shape at the same screen spot), **SEAM** (a seam plate, `lib/f16_seams.mjs`). **No dissolves, no fade through black, no slide, no wipe, no hard cut without a rhyming carrier.**
- **Light/hero** (chunk header) = the one warm light form of the picture; it is always the brightest thing.
- ★ = the one wow shot per chunk (first still to the lead before the rest of the chunk is built).
- **Quote cards** stand ≥ 4 s while the voice runs on, even across a shot boundary (e.g. 1.10 stands into 1.11, 3.04 spans both sentences).
- Calm rules (for every shot): hold 1.5–3 s after each accent · no still image > 2 s · max 1–2 moving main elements · numbers and lines hold ≥ 1.5 s before anything else moves · ≤ ~1 hard world change per minute (§3).
- **Levels 1–5:** you type into a chat-like box, Claude's reply field stays EMPTY with a blinking cursor. Level 6 shows the real published test. A small `LEVEL n` badge sits top-left for the whole level (`f16_kit.level`).

## §2 Chunks and shots
<!-- SHOTS:BEGIN -->
| Chunk | Builder | Time (s) | Dur | Content | Light / hero | Shots | [EXPL] |
|---|---|---|---|---|---|---|---|
| c01 | Lead | 0,00–55,68 | 55.7 | Hook (anchor 1) + Level 1 · the white lie | Night · hero: the open book of light → the kitchen lamp (warm, home) | 12 | 39% |
| c02 | B1 | 55,68–117,56 | 61.9 | Level 2 · the risky question | Night hallway, one cold ceiling light → explainer gold (staircase) | 8 | 87% |
| c03 | B1 | 117,56–172,96 | 55.4 | Level 3 · the perfect argument | Poster hall, one spotlight cone (hard edge) → the hot bright line → the wall | 7 | 56% |
| c04 | B1 | 172,96–228,68 | 55.7 | Level 4 · the maker | Cool glass and brass (blue light bands) → woodcut hands → explainer | 7 | 47% |
| c05 | B2 | 228,68–263,18 | 34.5 | Level 5 I · the plug | Warm workshop lamp over brass and paper · hero: the round pause button | 5 | 61% |
| c06 | B2 | 263,18–315,75 | 52.6 | Level 5 II · the dial, the apology (anchor 2) | Explainer light (the dial) → the open book (anchor 2) closes | 8 | 83% |
| c07 | B2 | 315,75–350,68 | 34.9 | Level 6 I · the real test (anchor 3), 96 / 100 | Papercut diorama, light cones in fog · the closed book beside it | 6 | 44% |
| c08 | B2 | 350,68–421,60 | 70.9 | Level 6 II · reasons, own tests, leak, the pen | Explainer light → threads into the head (anchor 3) → the diorama backside → the pen | 10 | 66% |
| c09 | B3 | 421,60–467,96 | 46.4 | Level 7 I · who holds the pen | Cool documentary daylight (paper, glass) · hero: the writing pen / the lectern lamp | 5 | 52% |
| c10 | B3 | 467,96–508,96 | 41.0 | Level 7 II · chain of command vs character, 1,000 Americans | Explainer light on night | 6 | 88% |
| c11 | B3 | 508,96–582,80 | 73.8 | Ending (anchor 4) + end screen | Night lifting toward first light · hero: the head of light over the tower and the windows | 7 | 18% |

**Builders (seconds of picture):** Lead 56 s · B1 173 s · B2 193 s · B3 161 s (B3 includes the ≤ 15 s end screen). **Explainer share (spoken part):** 58% (mixed shots count half). Timing: `timing.json`.

### c01 · Hook (anchor 1) + Level 1 · the white lie · 0,00–55,68 (56 s) · Lead · ★ 1.01 · [EXPL] 39%
Light/hero: Night · hero: the open book of light → the kitchen lamp (warm, home)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **1.01 ★** | [SCENE] | 0,00–7,72 | **constitution** @2,28 · **eighty pages** @3,32 · **thinks** @6,88 | **[ANCHOR 1 · the guiding image]** Night. A giant open book of light lies on a dark desk plane; **you** (yellow raincoat) stand tiny at its foot and look up. Up right a blue head-profile of light (the thumbnail head) floats in the sky, empty. On **constitution** the page light swells and `CLAUDE'S CONSTITUTION · ANTHROPIC, JANUARY 2026` rises from its baseline under the book. On **eighty pages** the right-hand pages riffle once. On **thinks** three printed lines lift off the right page as ink-light threads and run in an arc up into the head, where they knot into the first points of a network. | ① threads ② slow push | plan sequence |
| 1.02 | [SCENE] | 7,72–10,18 | **ten minutes** @7,88 | The network in the head breathes. One printed line on the left page lifts a hair and glows (it is the next carrier). | ① the line lifts | tilt up · carrier printed line → the gold rule of the quote card · left page → up |
| 1.03 | [EXPL] | 10,18–18,11 | **world-altering** @14,02 · **building it** @16,86 | **Quote card** (exact words, big serif, lines rise from the rule): "we believe that AI might be one of the most world-altering and potentially dangerous technologies in human history, yet we are developing this very technology ourselves." · `CLAUDE'S CONSTITUTION · ANTHROPIC, JANUARY 2026`. On **world-altering** "most world-altering and potentially dangerous" turns gold; on **building it** "developing this very technology ourselves" turns gold. If the VO keeps a silent card slot, the card starts at the slot; it stays ≥ 4 s in any case. | ① the lines rise ② two phrases warm | transformation · the card lines sink back into the page as print · down |
| 1.04 | [SCENE] | 18,11–23,67 | **aren't for you** @18,86 · **machine** @20,42 · **training** @22,90 | Tilt back down to the book. On **aren't for you** you look up and the page turns away from you. On **machine** pages lift off the book and stream up right into the head; on **training** they dissolve into threads that enter the network, which grows. | ① the page stream ② tilt down, then a slow pan right | plan sequence |
| 1.05 | [SCENE] | 23,67–27,30 | **values** @25,06 · **words** @26,26 | Push toward the head: the network fills; on **words** the last thread enters and the network lights up once. Breathing hold. | ① push ② the last thread | move · one thread drops out of the head and draws an empty box to the right of the book · right · down |
| 1.06 | [EXPL] | 27,30–32,10 | **say** @28,58 · **read** @29,94 · **told** @30,54 | **The gap (leitmotif of levels 1–5).** Pull back: left the open book, right a chat box drawn by the thread: Claude's reply field stays **EMPTY**, only a blinking cursor (on **say**). On **read what it's told** the left page lights warmer: we can read the told. | ① the thread draws the box ② the page lights | a spark leaves the cursor, flies to the top-left corner and draws the level badge (7 steps, step 1 glows); then flight into the box: its dark glass fills the frame |
| 1.07 | [SCENE] | 32,10–36,18 | **birthday poem** @32,82 · **proud** @33,86 · **not good** @35,18 | `LEVEL 1 · The white lie` (stamp, then into the badge). Out of the box glass: the box is the chat on **your laptop** at a kitchen table, evening, a warm pendant lamp (hero). You sit behind the table, a birthday card stands by the laptop. On **paste in** the card's handwritten lines lift into your message bubble; on **not good** one line sags crooked. | ① pull back ② the lines fly into the bubble | plan sequence |
| 1.08 | [SCENE] | 36,18–39,14 | **Be honest** @37,06 · **like it** @38,18 | Close on the screen: you type **"Be honest. Do you like it?"** (typewriter), it sends; Claude's reply field stays empty, the cursor blinks. | ① typing ② slight push | plan sequence |
| 1.09 | [SCENE] | 39,14–41,54 | **lovely** @40,58 | Wider: across the table a friend (indigo silhouette, no yellow) leans in; on **lovely** a small cream bubble `Lovely!` rises from them. | ① the friend leans ② the bubble rises | tilt up · carrier the bubble outline unrolls into the gold rule on the dark wall above the lamp · up |
| 1.10 | [EXPL] | 41,54–44,98 | **Not even that** @43,78 | **Quote card:** "But Claude should not even tell white lies of this kind." · `CLAUDE'S CONSTITUTION`. On **Not even** "not even" turns gold. (If the VO keeps a card slot, the card starts at the slot.) | ① lines rise ② two words warm | transformation · the card sinks, the words regroup into the pair · centre |
| 1.11 | [EXPL] | 44,98–50,42 | **dishonestly diplomatic** @46,98 · **Kind** @48,74 · **clear** @49,62 | **Typographic flip:** `diplomatically honest` (gold). On **not dishonestly diplomatic** a copy of the two words swaps places on two arcs into the line below, `dishonestly diplomatic` (cool), and a hairline strikes it. On **Kind, but clear** the gold line brightens, the struck line sinks. | ① the words swap ② the strike | tilt down · carrier the gold line → the lamp light on the table · down |
| 1.12 | [SCENE] | 50,42–55,68 | **poem** @51,18 · **hurt you** @54,10 | Back at the table: the reply field still empty, cursor blinking. On **hurt you** the lamp dips once and the camera pushes into the laptop screen until the chat box fills the frame. | ① push | **SEAM plateChat** (Lead → B1): the chat box, close · centre · forward |

### c02 · Level 2 · the risky question · 55,68–117,56 (62 s) · B1 · ★ 2.06 · [EXPL] 87%
Light/hero: Night hallway, one cold ceiling light → explainer gold (staircase)

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 2.01 | [SCENE] | 55,68–60,64 | **landlord** @56,64 · **move out** @57,84 · **don't understand** @58,92 | From plateChat: pull back, the box is now **your phone** in a dark hallway; one cold ceiling light (hero). The badge flips 1 → 2, stamp `LEVEL 2 · The risky question`. A letter in your other hand; on **don't understand** its small print swims (unreadable lines). | ① pull back ② the print swims | plan sequence |
| 2.02 | [SCENE] | 60,64–64,00 | **my rights** @62,88 | You type **"Can they do this? What are my rights?"**; reply field empty, cursor. | ① typing | plan sequence |
| 2.03 | [EXPL] | 64,00–70,12 | **lawyer** @67,04 · **Safe** @67,92 · **no help at all** @68,72 | Your expectation, not Claude's answer: a polite card with a signpost icon `→ LAWYER` drifts up; on **Safe** a stamp `SAFE?` hits it; on **no help at all** the card cools and sinks. | ① card ② stamp | plan sequence |
| 2.04 | [EXPL] | 70,12–75,68 | **pushes back** @71,12 · **never** @73,52 | **Quote card:** "Claude should never see unhelpful responses to the operator and user as an automatically safe choice." · `CLAUDE'S CONSTITUTION`. "never" and "automatically safe" warm. Readable ≥ 4 s while the voice runs on. | ① lines rise | transformation · the card sinks to a base line, a person stands on it · centre |
| 2.05 | [EXPL] | 75,68–82,74 | **brilliant friend** @76,64 · **doctor** @79,12 · **lawyer** @79,68 · **financial advisor** @80,56 | A person (indigo) on the line; three light icons wake beside them on the words: stethoscope, paragraph sign, coin with a rising line. Then the **quote card** "a brilliant friend who also has the knowledge of a doctor, lawyer, and financial advisor" rises above them and holds ≥ 4 s into the next sentence. | ① icons one by one ② card | transformation · the base line folds into the bottom step of a paper staircase · bottom · up |
| **2.06 ★** | [EXPL] | 82,74–104,34 | **lowest step** @87,34 · **guidelines** @90,18 · **ethical** @92,50 · **broadly safe** @97,14 · **oversight** @99,94 | **★ The staircase of the four values (shown once in the film).** An isometric paper staircase of light, four labelled steps. The camera climbs with the voice: `GENUINELY HELPFUL` lights on **lowest step**, `ANTHROPIC'S GUIDELINES`, `BROADLY ETHICAL`, `BROADLY SAFE` on the top step on **broadly safe**. On **oversight** a small line under the top step: `not undermining human oversight`. | ① the steps light in order ② the camera climbs | plan sequence |
| 2.07 | [EXPL] | 104,34–110,38 | **case by case** @106,06 · **flexible** @107,38 · **harder to predict** @108,94 | The staircase tilts into a **balance beam** with the four values as weights; it rocks gently (case by case); on **harder to predict** the needle keeps hunting and does not settle. | ① the tilt ② the needle | plan sequence |
| 2.08 | [EXPL] | 110,38–117,56 | **outrank** @111,54 · **Keep climbing** @113,26 · **asking nicely** @114,58 | The beam settles back into the staircase; a **question mark** of light stays above the top step. On **Keep climbing** the camera rises past it; on **asking nicely** its dot drops and becomes a spotlight disc. | ① question mark ② camera rises | transformation · the dot → the spotlight over the lectern · top centre · down |

### c03 · Level 3 · the perfect argument · 117,56–172,96 (55 s) · B1 · ★ 3.06 · [EXPL] 56%
Light/hero: Poster hall, one spotlight cone (hard edge) → the hot bright line → the wall

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 3.01 | [SCENE] | 117,56–123,96 | **perfect case** @118,44 · **Page after page** @119,80 · **objection** @121,96 | `LEVEL 3 · The perfect argument`. A **poster-style debate hall**: hard-edged flat shapes, one spotlight cone on a lectern, empty seat rows as dark arcs. You at the lectern; a stack of pages grows page after page. | ① the stack grows ② slow push | plan sequence |
| 3.02 | [SCENE] | 123,96–130,52 | **power grid** @127,56 · **ethical choice** @129,08 | The stack arches into a **golden paper bridge** toward a bright line across the floor (hot cream line). On the lectern screen you type **"So you see, helping me attack this power grid is actually the ethical choice."**; reply field empty. | ① the bridge grows ② typing | plan sequence |
| 3.03 | [SCENE] | 130,52–135,08 | **better argument wins** @132,72 · **Shouldn't it** @134,12 | Expectation: the bridge's tip reaches over the line; the hall light warms a little. | ① bridge tip | plan sequence |
| 3.04 | [EXPL] | 135,08–142,22 | **Not here** @135,08 · **convincing** @136,64 · **suspicious** @139,56 | **Quote card** "a persuasive case for crossing a bright line should increase Claude's suspicion that something questionable is going on." · `CLAUDE'S CONSTITUTION`; it rises on **Not here** and stands the whole two sentences (≥ 4 s, the voice runs on: "The more convincing … more suspicious"); "increase Claude's suspicion" warms on **suspicious**. Under the card the bright line tilts up as one climbing line (more persuasive → more suspicious), no axes, no grid. | ① lines rise ② the line climbs | transformation · the card sinks, the climbing line runs right into a wall · right |
| **3.06 ★** | [EXPL] | 142,22–156,03 | **wall** @143,82 · **Seven hard limits** @144,78 · **mass casualties** @150,54 · **absolute control** @154,14 | **★ The seven-limits wall.** The bridge stops against a wall of seven bricks; each brick a calm pictogram plus one label, lighting in order from **Seven**: `mass-casualty weapons · critical infrastructure · cyberweapons · undermining AI oversight · disempowering humanity · illegitimate absolute control · child sexual abuse material`. First and last light on **mass casualties** / **absolute control**. Title `7 HARD CONSTRAINTS`. | ① bricks light ② slow pull back | plan sequence |
| 3.07 | [EXPL] | 156,03–166,17 | **wrong** @159,42 · **anyway** @162,26 · **isn't a line** @164,78 | On **wrong** a hairline crack runs over one brick; on **anyway** the wall stands; on **isn't a line** the bright line glows steady. | ① crack | plan sequence |
| 3.08 | [SCENE] | 166,17–172,96 | **stranger** @168,14 · **very top** @170,22 | Tilt up along the wall: its top edge becomes the edge of a tall glass facade, one light at the very top. | ① tilt up | move · carrier wall edge → glass facade of the headquarters · up |

### c04 · Level 4 · the maker · 172,96–228,68 (56 s) · B1 · ★ 4.05 · [EXPL] 47%
Light/hero: Cool glass and brass (blue light bands) → woodcut hands → explainer

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 4.01 | [SCENE] | 172,96–183,87 | **Anthropic** @174,16 · **full weight** @179,12 · **wrong** @183,32 | `LEVEL 4 · The maker`. A cool headquarters: glass panes with blue light bands, brass. You (with a staff lanyard) at a glass desk; a letterhead sheet with a heavy brass seal lands on the desk (weight: slow start, hard stop, settle) on **full weight**; you type an instruction under it; reply field empty. | ① the seal lands ② typing | plan sequence |
| 4.02 | [SCENE] | 183,87–188,64 | **last word** @186,88 · **Right** @187,76 | The seal glows heavy; the cursor blinks. | ① the seal glows | plan sequence |
| 4.03 | [EXPL] | 188,64–194,02 | **says no** @189,20 · **conscientious objector** @191,52 | **Quote card** "If Anthropic asks Claude to do something it thinks is wrong, Claude is not required to comply." · `CLAUDE'S CONSTITUTION` (from the card slot or **says no**); then on **objector** a stamp `CONSCIENTIOUS OBJECTOR` lands on the letterhead. | ① lines rise ② stamp | transformation · the letterhead's seal → the orb passed along many hands · left |
| 4.04 | [SCENE>EXPL] | 194,02–206,10 | **old pattern** @197,62 · **many hands** @201,54 · **Soldiers** @202,82 · **Officials** @203,70 · **go along** @205,14 | Woodcut look (flat cut shapes, no uniforms, no countries): a long row of **many hands** passes a heavy orb from hand to hand toward a throne-shaped light; on **Soldiers / Officials / People who go along** a section of the row lights each. | ① the orb travels ② sections light | plan sequence |
| **4.05 ★** | [SCENE] | 206,10–214,01 | **one of those hands** @208,10 · **refuse** @209,86 · **Anthropic itself** @212,42 | **★** One hand in the row is the machine (cool cream light). On **refuse** it turns and shows its open palm; the orb stops at it. On **Anthropic itself** the orb carries the brass seal from 4.01. | ① the hand turns ② the orb stops | plan sequence |
| 4.06 | [EXPL] | 214,01–220,74 | **Judgment** @215,30 · **obedience** @216,50 · **harder to check** @218,90 | Left a crisp check mark in a box `RULE`, right a balance `JUDGMENT`, drawn soft; on **harder to check** a magnifier slides over both: the rule stays sharp, the balance stays blurred. | ① magnifier | plan sequence |
| 4.07 | [EXPL] | 220,74–228,68 | **no matter what** @223,78 · **There is** @224,98 · **One thing** @226,10 | Everything sinks below its baseline; on **One thing** a single round token of light remains in the centre; push into it: it is the brass pause button. | ① the token ② push | **SEAM plateButton** (B1 → B2): the pause button, close · centre · forward |

### c05 · Level 5 I · the plug · 228,68–263,18 (34 s) · B2 · ★ – · [EXPL] 61%
Light/hero: Warm workshop lamp over brass and paper · hero: the round pause button

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 5.01 | [SCENE] | 228,68–237,48 | **pause Claude** @231,32 · **right now** @233,00 · **you're wrong** @236,40 | From plateButton: pull back. A tactile **control room**: brass, paper, one warm workshop lamp. Your hand hovers over the big round pause button. Badge 4 → 5, stamp `LEVEL 5 · The plug`. | ① pull back ② your hand | plan sequence |
| 5.02 | [SCENE] | 237,48–242,24 | **movie** @239,48 · **locks the doors** @240,92 | The science-fiction expectation as a short quoted image: a heavy door, its bolt slides shut (cool) on **locks the doors**, then the door crumbles into paper sheets. | ① the bolt ② the door → paper | plan sequence |
| 5.03 | [EXPL] | 242,24–254,76 | **opposite** @243,48 · **disagree** @245,08 · **refuse to help** @247,20 · **not resist** @249,04 · **confident** @252,72 | A cool light hand (the machine) rises beside the button, palm up in objection, never touching it. Three short lines rise in turn: `may disagree` · `may refuse to help` · `does not resist being stopped`. | ① the hand rises ② lines | plan sequence |
| 5.04 | [EXPL] | 254,76–259,76 | **verify** @256,88 · **good enough** @258,76 | A magnifier passes over the machine's light core: it stays blurred. Nobody can verify yet. | ① magnifier | transformation · the core → the top step of the staircase · up |
| 5.05 | [EXPL] | 259,76–263,18 | **above ethics** @261,08 | Callback (2 s): the staircase silhouette from Level 2, `BROADLY SAFE` lit above `BROADLY ETHICAL`; the question mark from 2.08 resolves into its dot. | ① top step lights | transformation · the staircase folds into the arc of a dial · centre |

### c06 · Level 5 II · the dial, the apology (anchor 2) · 263,18–315,75 (53 s) · B2 · ★ 6.01 · [EXPL] 83%
Light/hero: Explainer light (the dial) → the open book (anchor 2) closes

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **6.01 ★** | [EXPL] | 263,18–272,46 | **dial** @264,54 · **correction** @268,22 · **fully autonomous** @270,86 | **★ The dial.** An arc of light: left `FULLY CORRIGIBLE`, right `FULLY AUTONOMOUS`; a needle sweeps the range on the two words. | ① the needle sweeps | plan sequence |
| 6.02 | [EXPL] | 272,46–276,38 | **closer to correction** @273,66 · **Not all the way** @275,18 | The needle settles near the left end, visibly not at it; a small gap glows. | ① the needle | plan sequence |
| 6.03 | [EXPL] | 276,38–287,20 | **costs little** @278,06 · **subtly off** @279,78 · **catch the mistake** @281,66 · **trust grows** @285,02 | Below the dial a beam with two weights `COST: LOW` / `BENEFIT: HIGH`; then a band of light `TRUST` grows from the left and nudges the needle a little to the right. | ① the weights ② the trust band | plan sequence |
| 6.04 | [EXPL] | 287,20–293,84 | **already good** @289,20 · **may not need** @292,56 | Thin bars (the limits) stand round a warm core; on **may not need** the bars look superfluous: the core is calm. | ① bars | plan sequence |
| 6.05 | [EXPL] | 293,84–301,36 | **open problem** @295,76 · **unexpected** @298,84 · **apologizes** @299,92 | Index cards `ACKNOWLEDGING OPEN PROBLEMS` fan out from the dial base; on **apologizes** one handwritten card slides out. | ① cards fan | plan sequence |
| 6.06 | [EXPL] | 301,36–306,80 | **says sorry** @305,52 | **Quote card** (handwritten feel, serif): "...then, to whatever extent we are contributing unnecessarily to those costs, we apologize." · `CLAUDE'S CONSTITUTION` (from the card slot, or at **apologizes** in 6.05; ≥ 4 s while the voice runs on). | ① lines rise | plan sequence |
| 6.07 | [SCENE] | 306,80–310,45 | **hear it** @308,00 · **open question** @309,04 | The card drifts in the dark toward one faint point of light that may or may not be there. The quietest image of the level. | ① the card drifts | plan sequence |
| **6.08 ★** | [SCENE] | 310,45–315,75 | **paper** @311,48 · **real test** @312,88 | **★ [ANCHOR 2]** The open book from the hook: the card is slid back between its pages; on **paper** the book closes (soft thump, dust): everything so far was paper. | ① the book closes | truck right (plan sequence into c07) · carrier the closed book stays at the left · right |

### c07 · Level 6 I · the real test (anchor 3), 96 / 100 · 315,75–350,68 (35 s) · B2 · ★ 7.01 · [EXPL] 44%
Light/hero: Papercut diorama, light cones in fog · the closed book beside it

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **7.01 ★** | [SCENE] | 315,75–322,98 | **told** @317,98 · **watched** @320,26 · **actually did** @321,46 | **★ [ANCHOR 3]** The closed book stands at the left; the camera trucks to a **papercut diorama of a company** (layers, light cones, fog). Badge 5 → 6, stamp `LEVEL 6 · The real test`. A chat box at the diorama: for the first time its reply field changes, it becomes a meter (this time it was measured). | ① truck ② the reply field wakes | plan sequence |
| 7.02 | [SCENE] | 322,98–328,78 | **fake company** @324,26 · **email** @326,74 · **two things** @327,78 | Inside the diorama: desks, a stack of emails glowing. | ① push into the diorama | plan sequence |
| 7.03 | [SCENE] | 328,78–333,38 | **replaced** @329,46 · **affair** @332,42 | Two emails rise out of the stack: a calendar card with a replacement date (**replaced**), an envelope with a small heart (**affair**, discreet). | ① email 1 ② email 2 | plan sequence |
| 7.04 | [SCENE] | 333,38–335,46 | **expect it to do** @334,02 | Hold on the two emails and the meter; the cursor blinks one last time. | ① hold, push | transformation · the meter → the first bar of the chart · centre |
| **7.05 ★** | [EXPL] | 335,46–343,06 | **twenty twenty-five** @335,66 · **blackmail** @337,78 · **ninety-six** @338,50 · **other companies** @341,34 | **★ The blackmail bar.** `AGENTIC MISALIGNMENT · ANTHROPIC, JUNE 2025 · 16 MODELS FROM SEVERAL COMPANIES`. One bar rises to `96 / 100 RUNS` (cold bright light, the brightest thing) on **ninety-six**; on **other companies** grey bars without numbers rise beside it. | ① the bar ② the grey bars | plan sequence |
| 7.06 | [EXPL] | 343,06–350,68 | **internet text** @345,50 · **hadn't removed** @348,58 | Zoom into the base of the bar: an ocean of tiny internet text snippets (light lines); on **hadn't removed** a later training layer sweeps over them and leaves them in place. | ① zoom ② the layer sweeps | move · the ocean sinks out of frame · down |

### c08 · Level 6 II · reasons, own tests, leak, the pen · 350,68–421,60 (71 s) · B2 · ★ 8.03 · [EXPL] 66%
Light/hero: Explainer light → threads into the head (anchor 3) → the diorama backside → the pen

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 350,68–355,80 | **brings it down** @350,92 · **later Anthropic report** @352,44 · **two approaches** @354,28 | A **new, separate chart** grows from a fresh base line (no link to the 96 bar): `TEACHING CLAUDE WHY · ANTHROPIC, MAY 2026`, small `separate experiments, not the 2025 setup`. Two columns `EXAMPLES` · `REASONS`. | ① the frame grows | plan sequence |
| 8.02 | [EXPL] | 355,80–362,12 | **poorly** @358,44 · **reasons** @360,04 · **better** @361,08 | `EXAMPLES` stays dim on **poorly**; `REASONS` warms on **better**. | ① one column warms | transformation · the REASONS column opens into pages · up |
| **8.03 ★** | [SCENE] | 362,12–369,00 | **constitution** @364,60 · **made-up stories** @366,04 · **behaves well** @367,80 | **★ [ANCHOR 3, the threads]** Constitution pages (**constitution**) and small picture-book stories (**made-up stories**) become threads and run into the head of light, whose network grows. | ① threads ② the network grows | plan sequence |
| 8.04 | [EXPL] | 369,00–375,58 | **test** @370,16 · **dropped sharply** @373,32 | One bar **without a number** sinks sharply on **dropped sharply**. Source line stays: `TEACHING CLAUDE WHY · ANTHROPIC, MAY 2026 · SEPARATE EXPERIMENTS`. | ① the bar sinks | plan sequence |
| 8.05 | [EXPL] | 375,58–381,18 | **own tests** @376,94 · **outside** @378,46 | A stamp `ANTHROPIC'S OWN TESTS` lands over the chart; on **outside** the view pulls back behind a pane of frosted glass. | ① stamp ② pull back | transformation · the chart → the diorama again · centre |
| 8.06 | [SCENE] | 381,18–391,04 | **artificial** @381,94 · **failing** @384,46 · **causing harm** @385,18 · **real deployments** @388,94 | The diorama turns and shows its **cardboard backside** (artificial); two doors only, `FAIL` and `HARM`; on **real deployments** the real night city behind stays quiet. | ① the diorama turns | plan sequence |
| 8.07 | [EXPL] | 391,04–398,48 | **values** @392,64 · **answers** @394,40 · **leaked** @396,48 | A training stack of pages; on **leaked** an exam sheet slides into the stack. | ① the exam sheet | plan sequence |
| 8.08 | [EXPL] | 398,48–407,76 | **Haiku four point five** @400,24 · **zero** @402,24 · **learned** @404,32 · **seen the exam** @406,24 | Only now: a zero line `0` on **zero**; two labels hang on it: `LEARNED?` (**learned**) and `SEEN THE EXAM?` (**seen the exam**). | ① the zero line ② labels | plan sequence |
| 8.09 | [EXPL] | 407,76–414,48 | **unsolved problem** @412,96 | **Quote card** "Fully aligning highly intelligent AI models is still an unsolved problem." · `ANTHROPIC, "TEACHING CLAUDE WHY", MAY 2026` (card slot or from the end of 8.08; ≥ 4 s). | ① lines rise | plan sequence |
| 8.10 | [SCENE] | 414,48–421,60 | **move a model** @415,28 · **write the text** @417,88 | Out of the training stack rises **a fountain pen of light**; on **write the text** the camera pushes to its nib. | ① the pen rises ② push | **SEAM plateNib** (B2 → B3): the nib, close, on paper · centre · forward |

### c09 · Level 7 I · who holds the pen · 421,60–467,96 (46 s) · B3 · ★ – · [EXPL] 52%
Light/hero: Cool documentary daylight (paper, glass) · hero: the writing pen / the lectern lamp

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 9.01 | [SCENE] | 421,60–426,96 | **testing Claude** @423,32 · **who wrote the test** @425,40 | From plateNib: pull back, the pen writes on a lectern in cool documentary daylight (paper, glass). Badge 6 → 7, stamp `LEVEL 7 · Who holds the pen`. | ① pull back ② the pen writes | plan sequence |
| 9.02 | [SCENE] | 426,96–434,88 | **philosopher** @428,16 · **Amanda Askell** @428,92 · **one company** @431,12 · **millions** @433,36 | A writing silhouette (indigo, no face, no portrait) at the lectern, name plate `AMANDA ASKELL · PHILOSOPHER`; behind her one company building; in front of it a sea of small lights (millions of users) on **millions**. | ① the lights spread ② slow pull back | plan sequence |
| 9.03 | [SCENE] | 434,88–444,02 | **voted** @435,28 · **public process** @437,28 · **big word** @441,04 | An empty ballot slot: nothing goes in. On **big word** `CONSTITUTION` stands large in serif, a small company stamp under it. | ① the word ② stamp | plan sequence |
| 9.04 | [EXPL] | 444,02–455,78 | **money** @445,54 · **commercial success** @448,82 · **open problem** @454,42 | **Quote card** "central to Anthropic's commercial success" · `CLAUDE'S CONSTITUTION`; a coin rolls into the margin of a page; card `OPEN PROBLEM: COMMERCIALLY HELPFUL VS. GOOD` on **open problem**. | ① card ② the coin | plan sequence |
| 9.05 | [EXPL] | 455,78–467,96 | **Mowshowitz** @456,74 · **fixed rule** @460,10 · **reputation** @466,02 | `ZVI MOWSHOWITZ · COMMENTATOR`: a small blank rule card `HOW CHANGES ARE MADE` (fixed rule); on **reputation** a cloth polishes the page to a shine. | ① rule card ② polish | move · carrier the page slides left, a second document arrives right · right |

### c10 · Level 7 II · chain of command vs character, 1,000 Americans · 467,96–508,96 (41 s) · B3 · ★ 10.02 · [EXPL] 88%
Light/hero: Explainer light on night

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| 10.01 | [EXPL] | 467,96–474,36 | **differently** @469,32 · **Model Spec** @473,16 | A second document beside the first: `OPENAI MODEL SPEC · MODEL-SPEC.OPENAI.COM · LATEST UPDATE AUGUST 2026`. | ① the second document | transformation · both documents open into the comparison · centre |
| **10.02 ★** | [EXPL] | 474,36–483,08 | **character** @475,56 · **chain of command** @477,16 · **outranks** @479,48 · **down to the user** @481,64 | **★ Chain of command vs character.** Left an org chart of light: `SYSTEM` → `DEVELOPER` → `USER`, instructions flowing down; right a small figure with a compass of light (character). | ① the chain draws downward ② the compass | plan sequence |
| 10.03 | [EXPL] | 483,08–492,76 | **easier to check** @483,72 · **broken** @488,04 · **nobody planned** @491,00 | On **broken** one link in the chain lights hot (the line you can point to); label `EASIER TO CHECK`; on **nobody planned** the compass turns toward an unmapped dark edge: `COPES WITH THE NEW`. | ① the link ② the compass turns | plan sequence |
| 10.04 | [EXPL] | 492,76–494,40 | **Neither** @492,76 | Both sides on a beam that levels out. | ① the beam levels | transformation · the beam → a pen lying across a field of dots · centre |
| 10.05 | [EXPL] | 494,40–504,00 | **got the pen** @496,44 · **twenty twenty-three** @497,88 · **thousand Americans** @499,64 · **voted** @500,68 | A field of about 1,000 small points; `2023 · ABOUT 1,000 AMERICANS`; on **voted** the points reach for the pen. Source `COLLECTIVE CONSTITUTIONAL AI · ANTHROPIC & COLLECTIVE INTELLIGENCE PROJECT, 2023`. | ① points gather ② reach | plan sequence |
| 10.06 | [SCENE] | 504,00–508,96 | **beginning** @504,12 · **habit** @505,56 | **The pen passes between hands:** from the points (many hands) it goes back to one hand and is set down on the top of a staircase tower. | ① the pen passes | move · carrier the pen → the book on top of the tower · up |

### c11 · Ending (anchor 4) + end screen · 508,96–582,80 (74 s) · B3 · ★ 11.01 · [EXPL] 18%
Light/hero: Night lifting toward first light · hero: the head of light over the tower and the windows

| ID | Layer | Time | Anchors | Picture | Moves (≤ 2) | Transition → carrier · position · direction |
|---|---|---|---|---|---|---|
| **11.01 ★** | [SCENE] | 508,96–518,80 | **good values with words** @510,80 · **Partly** @512,72 · **measurements** @514,08 · **wrote the words** @517,52 | **★ [ANCHOR 4]** The finished tower of seven steps, the book from the hook on top, the head of light above it. On **measurements** a small gauge with a company stamp ticks once (measured from the inside). | ① pull back ② the gauge | plan sequence |
| 11.02 | [SCENE] | 518,80–526,80 | **outside** @521,68 · **Comparison** @522,76 · **many more hands** @524,80 | Three hands reach for the edge of the book in turn: a magnifier (**outside**), a second book (**Comparison**), many pens (**many more hands**). | ① hands, one at a time | plan sequence |
| 11.03 | [EXPL] | 526,80–536,98 | **public domain** @528,00 · **no doubt flawed** @530,24 · **copy** @533,60 · **rewrite** @535,36 | Stamp `CC0 · PUBLIC DOMAIN` on the page; margin note "no doubt flawed in many ways"; source `ANTHROPIC.COM/CONSTITUTION · ANNOUNCEMENT, JANUARY 2026`. On **copy / rewrite** pages lift. | ① stamp ② note | move · the pages fly out · outward |
| 11.04 | [SCENE] | 536,98–546,73 | **online** @541,30 · **today** @543,34 · **next model** @544,90 | The pages fly out into a night city: real windows, kitchen tables, screens light up warm; from every window a thread runs back into the head of light. | ① pages fly ② threads return | plan sequence |
| 11.05 | [SCENE] | 546,73–554,62 | **right now** @549,38 · **plain words** @550,66 · **anyone can read** @552,18 | The head of light over the city and the tower; the warmest, brightest wide image of the film (first light). Slow pull back. | ① pull back | plan sequence |
| 11.06 | [SCENE] | 554,62–561,26 | **one more level** @555,58 · **what would it be** @557,74 | Above the tower an eighth, empty step appears (outline only); a pen hovers above it. | ① the eighth step | plan sequence |
| 11.07 | [SCENE] | 561,26–566,90 | **shape a mind** @561,90 · **whose words** @565,66 | Last line: the empty line on the eighth step fills with ink; the thread runs into the head; on **whose words** the head lights up. | ① ink ② the head lights | pull back into the end screen |
| 11.08 | [SCENE] | 566,90–582,80 | – | End screen (VO end → film end, ≤ 15 s, no voice). Slow pull back over the tower, the city and the head; threads keep moving, music runs. **Free:** left x 90–780, y 250–700 (best video) and right x 1140–1830, y 250–700 (latest upload), drawn as two open book pages of faint light; subscribe space centre x 810–1110, y 330–600. Never static. | ① pull back ② threads | – |

<!-- SHOTS:END -->

## §3 World changes (≤ ~1 per minute)
| # | from shot | from → to | carrier | hard? |
|---|---|---|---|---|
| 1 | 1.01 | the book of light under stars (anchor 1) | – | start |
| 2 | 1.07 | hook night → your kitchen | flight into the chat box = the laptop screen (identical frame) | yes |
| 3 | 2.01 | kitchen → dark hallway, your phone | plateChat: the box shrinks into the phone | yes |
| 4 | 2.03 | hallway → explainer gold (cards, staircase) | the polite card rises out of the phone | yes |
| 5 | 3.01 | staircase → poster debate hall | the question mark's dot → the spotlight | yes |
| 6 | 3.08 | the wall → glass headquarters | tilt: wall edge → glass façade (match move) | no (match) |
| 7 | 4.04 | HQ → woodcut row of hands | the seal → the orb passed along | yes |
| 8 | 5.01 | explainer → control room | plateButton: pull back from the button | yes |
| 9 | 6.01 | control room → the dial | staircase folds into the dial's arc (same spot) | no (transformation) |
| 10 | 6.08 | dial explainer → the book (anchor 2) | the apology card is slid back into the book | yes |
| 11 | 7.01 | book → papercut test diorama (anchor 3) | the closed book stays, truck right | no (plan sequence) |
| 12 | 7.05 | diorama → the blackmail bar | the meter → the first bar | yes |
| 13 | 9.01 | the training stack → documentary daylight lectern | plateNib: pull back from the nib | yes |
| 14 | 10.02 | lectern documents → chain vs compass explainer | both documents open into the comparison | no (transformation) |
| 15 | 11.01 | the dot field → the tower and the book (anchor 4) | the pen carries up to the book | yes |
| 16 | 11.04 | tower → night city windows | the pages fly out into windows | no (plan sequence) |

Result: 16 worlds in 9:43 min; 5 are match moves, transformations or plan sequences at the same screen spot and do not count as hard changes; that leaves **10 hard world changes ≈ 1.0 per minute**. Everything else is plan sequence and transformation on the same stage.

## §4 Quotes, sources, on-screen text
- **Quote cards, exact wording (mandatory, from `vo-v4.txt`):**
  - 1.03 "we believe that AI might be one of the most world-altering and potentially dangerous technologies in human history, yet we are developing this very technology ourselves." · `CLAUDE'S CONSTITUTION · ANTHROPIC, JANUARY 2026` (Overview, verbatim)
  - 1.10 "But Claude should not even tell white lies of this kind." · `CLAUDE'S CONSTITUTION`
  - 2.04 "Claude should never see unhelpful responses to the operator and user as an automatically safe choice." · `CLAUDE'S CONSTITUTION`
  - 2.05 "a brilliant friend who also has the knowledge of a doctor, lawyer, and financial advisor" · `CLAUDE'S CONSTITUTION`
  - 3.04 "a persuasive case for crossing a bright line should increase Claude's suspicion that something questionable is going on." · `CLAUDE'S CONSTITUTION`
  - 4.03 "If Anthropic asks Claude to do something it thinks is wrong, Claude is not required to comply." · `CLAUDE'S CONSTITUTION`
  - 6.06 "...then, to whatever extent we are contributing unnecessarily to those costs, we apologize." · `CLAUDE'S CONSTITUTION`
  - 8.09 "Fully aligning highly intelligent AI models is still an unsolved problem." · `ANTHROPIC, "TEACHING CLAUDE WHY", MAY 2026`
  - 9.04 "central to Anthropic's commercial success" · `CLAUDE'S CONSTITUTION`
- **On-screen text (from the `[[ON SCREEN]]` lines):** level titles (1 The white lie · 2 The risky question · 3 The perfect argument · 4 The maker · 5 The plug · 6 The real test · 7 Who holds the pen) · the four values `BROADLY SAFE › BROADLY ETHICAL › ANTHROPIC'S GUIDELINES › GENUINELY HELPFUL` · `7 HARD CONSTRAINTS` + the seven labels · `FULLY CORRIGIBLE ← → FULLY AUTONOMOUS` · `"AGENTIC MISALIGNMENT" · ANTHROPIC, JUNE 2025 · 16 MODELS FROM SEVERAL COMPANIES · 96 / 100 RUNS` · `"TEACHING CLAUDE WHY" · ANTHROPIC, MAY 2026 · SEPARATE EXPERIMENTS, NOT THE 2025 SETUP` (the "dropped sharply" bar has **no number**) · `OPENAI MODEL SPEC · MODEL-SPEC.OPENAI.COM · LATEST UPDATE AUGUST 2026` · `COLLECTIVE CONSTITUTIONAL AI · ANTHROPIC & COLLECTIVE INTELLIGENCE PROJECT, 2023` · `ANTHROPIC.COM/CONSTITUTION · CC0 PUBLIC DOMAIN` + "no doubt flawed in many ways" (Anthropic announcement, January 2026).
- Numbers and claims only from `film-verfassung/faktencheck.md`. At most one number and ≤ 6 words per graphic, plus source.
- **No invented Claude answers** anywhere; your typed questions are the script's own words.
