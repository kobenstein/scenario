# Film 19 · "Computers Now Run on Human Brain Cells" · motion bible

Narration: `/mnt/project-files/scenario/film-biocomputer/vo-v3.txt` (~9:43 VO plus a 15 s end screen). Style: `stil/STIL-editorial-nacht.md` (binding). Shot list: `docs/shots.md` (source `tools/shots19.py`). Builders: `docs/BRIEF-builders.md`. Kit: `lib/f19_kit.mjs`; seams: `lib/f19_seams.mjs`; reference chunk: `scenes/sc01.mjs`.

## 1 · Intent
One line: *a calm, curious night film. The living computer is real and small, and the rules are ours to write.*
- Audience: curious adults who have never heard of a CL1.
- Mood: calm · curious · warm.
- Aspect: 16:9, 1080p30.
- Promise of the title: a real server rack, real living cells, and you are made of the same cells.

## 2 · The world (ONE world, two faces)
**THE RACK (the 3D world, the anchor).** A quiet server aisle at night in Singapore.
- One rack is **alive**: 20 drawers, each with a thin **gold seam** of light (living cells inside), breathing slowly.
- Its neighbours are ordinary servers: cool LEDs blinking, sinking into the night with distance.
- **Drawer 11** slides out and shows **THE DISH**: a glass dish on a chip with an electrode grid and a **gold neuron net** (34 somas) in which sparks hop from cell to cell.
- **You** (faceless, yellow raincoat) stand in the aisle; the same net glows inside your hood.
- A screen on a stand in the aisle is where footage runs (C1). A gloved hand with a pipette feeds the dish.

**THE DISH FIELD (the explainer stage).** The same dish seen straight from above (camera pitch −90°), so `planeMap` = `fieldMap(960, 540, 470)`.
- Its dark medium is the night on which all explainers grow: cells (blood → stem → neuron), the net, electrode pulses, the Pong court, ORDER vs NOISE, the box (cl1), the scoreboard, the size ladder, the rule cards.
- The **spark / the cell** is the carrier.
- The aisle sinks into night when the camera tilts in, and comes back when it tilts out.

**Leitbild nur als Anker.** The 3D aisle appears only at the anchor points:

| Where | What the aisle does |
|---|---|
| hook c01 | the drawer, you, Singapore, feeding, the screen |
| 4.03 | the radio in the aisle |
| 5.01–5.04 | the product, Doom screen, the box sliding back |
| 6.01–6.05 | 20 W, Singapore's racks |
| 7.01 | the scoreboard over the rack |
| 8.03 | pairing in one rack |
| 9.03–10.04 | the bee on the box, the round table |
| 11.04–11.09 | the drawer closes, end screen |

Everything else is the dish field. Explainer share (shots19.py): **72 %** of the spoken picture (mixed shots count half, clips excluded).

**Through-line:** the drawer opens in the first second and closes in the last minute. In between, the camera goes into the dish and out again. **Wow (★ 1.01):** the drawer slides open and the net lights up (thumbnail image). The quiet second peak is 11.08: the drawer closes and you look up.

## 3 · Motion DNA
| | |
|---|---|
| Energy / tempo | calm; long slow camera moves (2–4 s, sine) on word keys, breathing holds between |
| Easing | sine in-out for the camera; expo-out for arrivals (text, tube, head); expo-in for exits (sinks below the frame) |
| Speed contrast | slow camera vs quick small accents (a drop falls, a spark hops, a glyph is struck) |
| Physics | light and liquid: cells drift (Brownian ±6 px), the stream into the tube accelerates, the drawer is heavy (slow start, long settle) |
| Shape language | flat Stauffer shapes in a real perspective space (the aisle); flat 2D on the dish field |
| Palette | night blue/indigo + gold (living) + cool blue-cream (silicon) + yellow (you) |
| Transition vocabulary | camera tilt into / out of the dish · morph (net rewinds → cells → blood cells) · stream (cells into the tube) · screen fly-in (clips) |
| Typography | Instrument Serif (questions, numbers) · Inter 600 caps (labels, ladder questions) · rising from the baseline (`maskLine`) |
| Camera | look-at camera with pitch (`f19_kit cam`), permanent drift (`camDrift`), none while a clip holds CLIP_RECT |
| Texture | `PRINT19` grain 14, floor 4, vignette .5 |
| Signature move | **the tilt into the dish**: the aisle goes dark and the dish becomes the stage |

## 4 · Palette and colour code
- Night: `P.night0/1/2`, indigo `P.ind0/1/2`, blue `P.blue0/1/2` (f10_editorial).
- **Gold (`P.core0/1`, `P.halo0/1`) = living cells and human value.** Net, seams, stem cell, neurons.
- **Cool (`COOL.core/mid/edge/deep`) = silicon, chips, A.I.** Electrodes, LEDs, screens, blood cells before they are rewound to life, the A.I. side of the scoreboard.
- **Yellow `P.coat` = only you.**
- Text: cream `P.cream`, secondary `P.halo2`. No red anywhere, and no alarm aesthetic.

## 5 · Calm rules (all chunks)
- Max ~1 hard world change per minute (the list is in shots.md §3). The aisle ↔ field change is a camera move, not a hard change.
- 1–2 moving main elements at a time; everything else breathes (sparks, seams, cell membrane, drift).
- No still image > 2 s.
- Nothing appears from nowhere:
  - the tube and the head rise from below the frame;
  - text rises from its baseline;
  - cells come from somas;
  - the clock ring draws itself.
- No dissolves, fades or slides. A darkening is light: the aisle sinks into night round the dish.
- Accents sit on their word (±0.1 s), followed by a 1.5–3 s hold.
- Camera moves: ≥ 1.8 s for big moves (smooth.py LURCH limit), sine by default.
- Clips: the animation leads into a screen, the clip runs in it, the animation leads out. Credits: name + role + year + ORIGINAL FOOTAGE.

## 6 · Carriers per boundary
| Boundary | Carrier |
|---|---|
| c01 → c02 (Lead → B1) | **plateClock**: the blood cell with its clock turning backward → warms into the stem cell |
| c02 → c03 | the dish window of the box grows back into the dish field; the net stays (it becomes the Pong player) |
| c03 → c04 | ORDER / NOISE strips → the rally counter grows out of the ORDER strip |
| c04 → c05 | ladder rung 3 "JUST A LAB TRICK?" → the box rises as a product out of the dish window |
| c05 → c06 (B1 → B2) | **plateRack**: the box slid back into drawer 11, all drawers shut |
| c06 → c07 | the alive rack; the scoreboard rises over it |
| c07 → c08 | the scoreboard (lamp 3 lights) |
| c08 → c09 (B2 → B3) | **plateNet**: the centre soma flickering, macro |
| c09 → c10 | the box on the size ladder → back into its drawer in the aisle (the bee lands on it) |
| c10 → c11 | the ladder top WHAT NOW? → the question line of the hook returns |
| c11 → end screen | the drawer closes; slow pull back |

## 7 · Kit (lib/f19_kit.mjs, header has all signatures)
- camera: `cam`, `camAt`, `camDrift`, `view`, `proj`, `bill`, `quad`
- the aisle: `hall`, `rack`, `drawerY`, `OPEN`, `RACK`, `NEIGH`, `monitor`, `feeder`
- the dish: `dish`, `planeMap`, `fieldMap`, `NET`, `net`, `spark`, `sparksAmbient`, `somaAt`
- things: `cell`, `clockRing`, `glyph`, `vial`, `cl1`, `creature`, `scoreboard`
- the ladder: `LADDER`, `ladder`, `ladderOn`, `questionLine`
- clips: `CLIP_RECT`, `CLIPS`, `clipWin`, `clipPlate` (plays `ROOT/clips/<id>/f00001.jpg…` when present, else a marked placeholder)
- seams: `plateClock`, `plateRack`, `plateNet` (`lib/f19_seams.mjs`)

## 8 · Gates (motion-director-gates)
1. **Plan file before code:** this file and shots.md.
2. **Tool:** Canvas 2D with a real perspective camera (pitch); flat art on world planes; the dish as a mapped plane.
3. **Carrier-driven camera:** the camera follows the drawer, you, the drop, the screen, then tilts into the dish.
4. **Causality computed:** the wave fires by distance from the drop, the cells enter the tube in rank order, and the tube level rises with the cells taken.
5. **Review frames before every render** (contact sheet every 0.5–1 s plus each transition).
6. **After render:** `tools/calm.py` (0 cuts, mafd, luma 40–60), `tools/smooth.py` (0 LURCH/POP), `tools/seam.mjs`.
7. **End screen** (11.09): free areas left x 90–780 and right x 1140–1830 (y 250–700) for the end cards, subscribe centre x 810–1110 / y 330–600; only grain and the breathing seams move there.
