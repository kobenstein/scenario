# Film 28 · "They're Using AI to Save the World" · motion bible (lead, 2026-11-11)

Style: Editorial-Nacht (`/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`, memory `stil-editorial-nacht`). The picture comes from code only: flat shapes on 2.5D depth cards, grain, one hero light. No AI images, no primitive 3D shapes, no game look. Plan: `docs/shots.md` (source `tools/shots28.py`). Builders: `docs/BRIEF-builders.md`.

## 1 · Intent
- **Audience:** curious people who think of A.I. as chatbots and ads.
- **The single message:** the tool is already here; what matters is **what we point it at**. Twelve real projects show it, and each one rides on something that was built for another job.
- **Format:** 16:9, about 11:30 (VO ≈ 11:17 plus 15 s end screen), English VO by the narrator. The two former O-TON JAKOB lines are VO now.
- **Mood:** warm, wondering, honest. Hope without hype: every win also gets its caveat on screen.

## 2 · The world
**THE AIM (through-line).** The A.I. is always the same thing: a small cool bead (`F.agent`) with a thin cool beam (`F.beam`). The beam stays cool along its length and turns **warm where it lands** on something worth saving. The film opens on the beam lifting from a laptop into a tree (H.09, "A few people pointed it at something far bigger"). It closes on "It was the aim" (E): the same beam, the gallery of tools, the tree in full light.

**THE TREE (anchor, thumbnail A `fg-a-baum`).**
- What it is: a giant tree on a hill at night. Its crown is lit gold from inside. You, in the yellow coat, stand tiny at its foot. A lake and a land of small warm lights lie below.
- When it appears: only four times.
  1. the hook (c01)
  2. the turn after No. 8 (plateTree, the B1 → B2 seam)
  3. the question before No. 1 (2.10)
  4. the ending and end screen
- How it is built: the crown is lit from within. Limbs are dark silhouettes against the gold, and the leaf masses glow gold on their inner sides and fall off to indigo outside. `S.treeWorld`, `F.tree`.

**TWELVE LANTERNS = the countdown.**
- Twelve lanterns hang on the tree's low limb: No. 12 at the far tip, No. 1 near the trunk.
- A lantern is a **window into a scene**. The camera flies into its glass (`lantern(…, { inside })`).
- In the hook, lanterns **4** (the train), **7** (Casey's kitchen) and **9** (the Nazca desert) are the teasers.
- **No. 12 hangs at the far tip of the limb = "At the far edge of New Zealand".** c01 flies into it (light door) and comes out of the radio station's window.

**THE LAMP RAIL (screen space, top left).**
- In H.12 lanterns 11 … 1 lift off the limb into a small wire with twelve mini lanterns. Lamp 12 drops onto it after the door.
- Each lamp has its number on the glass. **No big number at a station's start, and numbers are never spoken.**
- A lamp **lights on its station's solution phrase** (`F.LAMPS[].solve`). No. 8 lights only half (the alerts that go unanswered).
- **Under each lamp hangs its station's tool object** (`F.LAMPS[].tool`, from `toolAt`). The row of tools is the **gallery** that answers the big question at the end.
- Five tools get a "built for …" tag in the ending, matching the VO: satellite, ship radio, GPS, chatbot, newspaper.
- The newspaper hangs under lamp 1 from the hook on ("A first clue").

**THE BIG QUESTION.** "What do all these tools have in common?" is asked three times:
- H.11, with the gold thread through the lanterns and a ?
- 2.10, where the thread and the ? return on the tree
- the resolution in E: the gallery tools get their tags and swing into one line under the lit crown. "None of it was built for this."

**REAL stamps (Jakob 10.11.).** Every station shows unmistakably that it is real: `F.realStamp(ctx, t, t0, t1, key)`. The gold stamp REAL · STATUS sits bottom left with the place or source line under it. Wording is in `F.STAMPS`; the fact check overrides.

**Scenes and explainers alternate.** A scene is a lit window with one warm light and breathing figures. An explainer is made of film things: light lines, dots, slabs, serif numbers, small cards. Weighted explainer share is **63.6 %** (shots.md).

**Clips.** `F.clipPlate` grows from a thing in the scene (a lantern glass, a window, a screen), with "ORIGINAL FOOTAGE" and the name. Slots: `T.clip('C3a' | 'C1' | 'C3' | 'C5b')`. C4 (the NASA replay) is mute footage UNDER the VO.

## 3 · Nicht wiederholen (do not repeat)
These worlds and objects belong to earlier films. None of them may be the world or a recurring object here.

| film | do not use |
|---|---|
| ageing film | the **big clock** |
| biocomputer film | the **server rack / satellite dish** as the world |
| (several) | the **hourglass**, the **fire circle** |
| #25 The Last Human Job | the **domino row** of task stones, the **timeline wall**, the rank rail of stones |
| Film 13 | the sand thread, the rock edge |
| Film 19 | the drawer |
| Film 18 | the running track, the game board, the zero line, the loop road |
| Film 24 | the world map with pins and iris medallions, the ear trumpet, the stone tablet with slots, the call strip, the [translating…] bar, the kitchen table with four generations |
| Film 16 | the staircase of light, the book of light with threads |
| (several) | the monolith, the curve with the red line |

**Consequences for this film:**
- text-v4's hourglass for No. 12 becomes the **hour ruler**.
- the clock for No. 11 becomes the **call line**.
- the flood map for No. 1 is a **river network**, not a map with pins.
- the satellite in No. 8 is a small tool object in the gallery, never a dish world.
- no phone appears before "Maybe on yours" (No. 1). At the end the phone light is raised to the tree.

## 4 · Motion DNA
- **Energy:** calm. Long glides of 2–4 s, a few soft accents on the solution words (a lamp lights, a stamp lands).
- **Easing:**
  - camera: `F.camPath` (Hermite through keys, log-distance) and `E.camAt` with 'i'/'o' for dives;
  - objects: expoOut entrances, expoIn exits, sineIO moves;
  - no overshoot on serious facts.
- **Speed contrast:** glide vs. the small hard stamp and the lamp pulse.
- **Physics:** light things sway (lanterns, tags, fireflies); heavy things hardly move (trunk, coast, ships).
- **Shapes:** flat silhouettes on depth cards, grain gradients, rim light. One hero light per frame.
- **Transitions** (three families only):
  1. **window fly-in**: into a lantern, window or screen and out again; ≥ 2.5 s, continuous, not a W;
  2. **object morph**: a glass grows into the clip plate, the lantern row lifts into the rail, the news page hangs as the tool;
  3. **light door** (`E.lightFlood`, ramps 1.4 s): the only hard world change (W). There are **5** in the film, 0.43/min:

     | shot | door |
     |---|---|
     | 12.01 | lantern 12 → station window |
     | 8.11 | the warm letter → the tree |
     | 5.11 | the coast light → the train headlight |
     | 2.10 | the warm beam → the tree |
     | 1.08 | the phone light → … |

- **Camera:** calm. At most 1–2 moving elements at once, and the camera always follows the carrier. Never stillness: `E.camDrift`, scaled down while diving (`.7 / magnification`).
- **Signature move:** the cool beam lands and the place it touches turns warm.
- **Wow moments:** one per chunk (★ in shots.md). The film's peak is the ending (the gallery under the tree in full light).

## 5 · Palette and colour code (never break it)
| meaning | colour | kit |
|---|---|---|
| people, what is saved, the hero light | warm gold `P.halo0` / `P.core0`, shadow `P.shade0` | `F.WARM` |
| the machine (bead, beam, its screens) | cool white-blue | `F.COOL` |
| night, world, forms | indigo / night blue | `F.INK`, `P.night*`, `P.ind*`, `P.blue*` |
| **you** (the viewer) | yellow coat | `E.du` only |
| everyone else | indigo silhouettes with rim light | `E.person` |
| text | cream; secondary `P.halo2` | Instrument Serif for numbers and names, Inter 600 caps for labels |

The beam may turn warm only where it serves people. Warm never appears on the machine itself.

## 6 · Calm rules (all chunks)
1. One motif per sentence. The picture changes with the sentence, not faster.
2. Scenes and explainers alternate. No two explainers of the same kind in a row.
3. At most **1–2 moving elements** at a time. The rest only breathes (drift, sway, flicker).
4. Hard world changes only at W (light doors). Everything else is one continuous take per chunk.
5. Nothing appears from nowhere. Every element has an origin: it grows from a light, hangs from a string, rises from a screen, drops from the crown.
6. Text: at most one number and ≤ 6 words per statement, readable at 390 px width, at least 1.2 s on screen. Subtitles own y > 910.
7. calm.py static share < 5 %, luma 40–60, cuts only at W. smooth.py 0 LURCH/POP.

## 7 · Carriers per boundary (group seams, `lib/f28_seams.mjs`)
- **Lead → B1** at `'A global data company'`: `S.plateStation`. The station at night with its warm window and the ring of voices round the antenna; towers on the horizon right; rail lamp 12 lit, the mic under it. B1 continues with a cool envelope from the towers.
- **B1 → B2** at `'Casey Harrell knows'`: `S.plateTree`. The tree at the turn: crown half dark (.28), lanterns 12 … 9 lit, 8 half, lantern 7 glowing faintly with the kitchen window. B2 flies into lantern 7.
- **B2 → B3** at `'The snake'`: `S.plateGrass`. Night grass by the track, one shadow moving through it. B3 turns the shadow into the snake.

## 8 · Kit (`lib/f28_kit.mjs` + `lib/f28_seams.mjs`; the headers list all signatures)
- **Worlds:**
  - `S.treeWorld(ctx, c, t, { glow, lantern(n), du, lights(k, x), fg, extra })`
  - `S.stationWorld(ctx, c, t, { window, ring, towers, voices, bead })`
  - `S.grassWorld`
  - Hook windows: `S.vignetteTrain`, `S.vignetteKitchen`, `S.vignetteDesert` (local 1000 wide; reuse them in your station)
- **The aim:** `F.agent(ctx, t, x, y, r, { think, ring, a })` · `F.beam(ctx, t, x0, y0, x1, y1, u, { w, hit, warm, a })`
- **Lanterns and rail:**
  - `F.lantern(ctx, t, x, y, s, { lit, inside, glass, num, numA })` · `S.lanternGlass(n)` · `F.treeLantern(n)`
  - `F.lampRail(ctx, t, T, { from, m, mOf, skip })` · `F.lampOn` / `F.toolOn` · `F.LAMPS`
- **Tools and stamps:** `F.tool(ctx, name, x, y, s, { lit, col })` · `F.tag` · `F.realStamp` · `F.STAMPS` · `F.SOURCES` · `F.source`
- **Explainers:** `F.ruler` · `F.dotField` · `F.chartLines` · `F.slab(s)` · `F.dayTiles` · `F.bracket` · `F.label` · `F.questionMark` · `F.thesis` · `F.voiceWave` · `F.radioRings` · `F.laptop` · `F.elephant`
- **Clips:** `F.clipPlate(ctx, t, T, id, { from, morph })` · `F.CLIPS` · frames come from `$F28CLIPS`, or scratchpad `f28/clips/<id>/f00001.jpg` (30 fps).
- **napi-rs quirk:** `Path2D.addPath` joins sub-paths (the added path's first moveTo becomes a lineTo). Never combine paths with addPath; write them into one path, or fill them one by one.
- Kit sheet: `node tools/kit_sheet28.mjs <dir>`.

## 9 · Gates (motion-director-gates)
1. **Plan:** this file + shots.md before code.
2. **Space:** depth cards, a real camera (`E.aim`, `F.camPath`).
3. **Carrier camera:** the camera follows the bead, the beam head, the falling page, the voices.
4. **Causality:**
   - a lamp lights on its phrase;
   - the crown blooms where the beam lands;
   - the ruler fills as the voices arrive.
5. **5 s test:** c01 is the reference.
6. **Review frames** every 0.33–1 s plus every transition, then a contact sheet of the whole chunk.
7. **The voice drives timing:** phrase anchors only (`T.G`, `T.GE`, `T.clip`), never seconds.
8. **Honest self-grade** in every report.

## 10 · End screen (last 15 s, c14)
The tree in full light sits in the **left third**: the crown gold, all twelve lanterns lit (No. 8 still half), you at its foot, the gallery tools hanging below the lamps. The **right two thirds (x 700–1830, y 120–860) stay a quiet dark sky** for the YouTube video tiles and the subscribe button. The picture keeps breathing: sway, grain, the lights of the land. No text.
