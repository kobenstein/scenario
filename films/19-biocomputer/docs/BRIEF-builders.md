# Film 19 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-06

The picture lead built **c01** as the quality reference: the hook, 0 → `T.G('In a lab')` ≈ 47.28 s. The lead also holds the kit, the shot list and the seams. The rest is built by **three builders at the same time, B1, B2 and B3**, each about 3 minutes of picture.

Timing:
- The engine reads the real VO timing `/mnt/project-files/scenario/film-biocomputer/audio/timing.json` (written by the audio agent from vo-v3.txt): 582.9 s, VO end 567.0 s.
- `data/provisional_timing.json` (`tools/provisional_timing.py`, vo-v3) is only the fallback.
- The audio may be re-cut, so **anchor only on phrases**: `T.G(phrase, nth, after)` / `T.GE(…)`. Never use seconds or segment ids.
- C1 has no slot in the real timing (muted, under the voice); `clipWin` derives it from `Cells like these` (+8 s).

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`

   Outdated there: "Hyperframes" and three.js. We draw with our own engine in Canvas 2D, with a pitched look-at camera from `lib/f19_kit.mjs`.
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md`: the world (THE RACK + THE DISH FIELD), objects, palette, calm rules, carriers
   3. `docs/shots.md`: your shots with phrase anchors, carriers and transitions. It is binding. §4 holds the only numbers and the exact on-screen text.
   4. The header of `lib/f19_kit.mjs` (API) and `lib/f19_seams.mjs`
   5. `/mnt/project-files/scenario/film-biocomputer/vo-v3.txt` (your paragraphs)
   6. `/mnt/project-files/scenario/film-biocomputer/faktenzettel.md`. Use only these facts, and in v3's wording.
3. **Look at** the reference and treat it as the pattern and the quality bar:
   - `/mnt/project-files/scenario/film-biocomputer/bild/c01_kontakt.jpg`
   - `bild/c01-stiltest.mp4`
   - the code `scenes/sc01.mjs`

   What to take from it:
   - **One plan sequence per chunk** (one entry). The camera moves instead of cutting. Keys come from `camAt(t, K)` on words, plus `camDrift`. Use `sine` by default; a fast move needs ≥ 1.8 s (`tools/smooth.py` flags anything faster).
   - The 3D aisle (`hall`, `rack`, `monitor`, `bill` for flat cards and figures in world units) turns into the **2D dish field** by a real camera move: a tilt straight down onto the dish (`pitch −π/2`), so that `planeMap` and `fieldMap` coincide. See `world()` → `field()` in sc01.
   - Everything comes from somewhere: the net grows or rewinds, cells stream into the tube, the tube rises from below the frame, and text rises from its baseline.
   - Reactions are computed from positions. The drop lands, and the somas fire by distance from the landing point.

`/mnt/project-files` is a network mount. Use exact paths only, and never search the whole folder. Only small jpg contact sheets go there; renders stay in your own scratchpad.

## 1 · Split (seconds from audio/timing.json; in code, anchor only on phrases)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **B1** | c02, c03, c04, c05 | 47.28–230.10 | 183 s | blood → stem cell (Nobel, no embryos) → neuron → the chip wires up; electrodes + code; the box; imitation vs original; Pong 2022 (sense/move zones); the trick: ORDER or NOISE; 5 minutes, not luck; "want" is too big; Friston and the radio (you); **C2 Brett Kagan**; lab trick?; for sale ($35,000 · a few hundred $ a week); Doom in a week; Loeffler quote; the box slides into the rack |
| **B2** | c06, c07, c08 | 230.10–399.50 | 169 s | 20 watts in your head; data centres +50 %; Melbourne + Singapore (up to 1,000); 30 W per box, untested; the match: scoreboard, round 1 (catch), round 2 (15 boxes, 32 · 40 · 70, catch), round 3 (A.I., a big one); final score 2 : 1; pairing; "is anyone in there?" |
| **B3** | c09, c10, c11 + end screen | 399.50–582.88 | 183 s | size ladder fly < box < bee, ⅓ mouse in 120 dishes, 86 billion; no evidence; Seth; embedded ethics (Johns Hopkins); **C3 Lena Smirnova**; what now?; order and noise; leaner software; drug tests; three rules; the drawer closes; end screen (≤ 15 s) |

Chunk boundaries (`film.mjs` CHUNKS):

| Boundary | Time (s) | Phrase |
|---|---|---|
| c02\|c03 | 99.62 | `The answer came` |
| c03\|c04 | 135.44 | `After about five minutes` |
| c04\|c05 | 188.43 | `It didn't stay in the lab` |
| c06\|c07 | 288.59 | `Picture it as a match` |
| c07\|c08 | 358.69 | `Round three` |
| c09\|c10 | 438.10 | `Still, some researchers` |
| c10\|c11 | 488.60 | `At the start, the question` |

VO end 566.98 · film end 582.88.

**c01 is finished** (lead). Do not touch `scenes/sc01.mjs`.

**Fact-check changes (vo-v3), binding for the picture:**
- **Rent:** "a few hundred dollars a week". On screen, show `A FEW HUNDRED $ / WEEK` or only the $35,000 box. **Never `$300`.**
- **Round 1:** "in a study published last year".
- **Round 2:** the company **presented** fifteen boxes linked into a team at the Washington conference. It was a talk, not a live link. Show only the three numbers **32 · 40 · 70**, with no "% of max score".
- **Seth:** "accidentally creating it in lab-grown brain tissue".
- **Rule two:** "ongoing oversight instead of bans".

## 2 · The seams between the groups (fixed, defined by the lead)
The group seams sit on a **shared picture**, a *plate* from `lib/f19_seams.mjs`, drawn in screen space. Both sides call the same function with the same `t`, so the frames on either side of the seam are identical. Preview with `node tools/seam_plates19.mjs <dir>`.
- **The handing side** steers its last move so the picture converges on the plate (camera key or carrier parameters lerped onto the plate values by `T0 − 0.5`). It then draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- **The receiving side** draws the plate for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate becomes a thing of the new world, never through a dissolve. Your first frames after `T0 + 0.5` must equal the plate (same object, same size, same place), and only then move.
- Helpers: `seamWindow(t, T0)`, `SEAM_HALF`.

| Seam | T0 (anchor) | Plate |
|---|---|---|
| **Lead → B1** | `T.G('In a lab')` (≈ 47.28) | `plateClock`: **the cell's clock**. Night; the dish field (`fieldMap(960, 540, 470)`, glow .55, chip .5, electrodes .25, rim .7, no net). A blood cell r 92 at the centre (warm .3) with its clock ring (R = 2.7 r). The minute hand is at `CLOCK_PLATE.hand(t) = −1.6 t` (turning BACKWARD); the hour hand is minute / 12. |
| **B1 → B2** | `T.G('It comes down to a number')` (≈ 230.10) | `plateRack`: **the rack**. The aisle at `RACK_PLATE_CAM`, the alive rack with all 20 drawers shut and the seams breathing; drawer 11 (`F.OPEN`) a little brighter (`RACK_PLATE.glow`). |
| **B2 → B3** | `T.G('First, how big')` (≈ 399.50) | `plateNet`: **the net, macro**. The dish field at r 2400 around the centre soma (`netPlateMap()`: `NET.centre` exactly on 960/540), dim .65, ambient .45; that soma flickers (`NET_PLATE.fire(t)`). |

How each side meets its seam:
- **Lead → B1.** Hand-over (done, sc01): the cell comes to the centre and its clock ring draws. Take-over (2.01): the clock keeps turning back, the cell warms into the stem cell, and the ring opens into the fan of futures.
- **B1 → B2.** Hand-over (5.04): the box slides back into drawer 11, then pull back onto `RACK_PLATE_CAM` (the drawer `slide` → 0). Take-over (6.01): push past the rack to you ("a number inside your head").
- **B2 → B3.** Hand-over (8.04): fly down into the dish. Before T0 − .5, lerp your field mapping onto `netPlateMap()` and the net options onto the plate's. Take-over (9.01): pull back out; the net shrinks into the box's window and the box stands on the size ladder.

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first frame of cN+1. The simplest way is a shared drawing function in your own `lib/f19_bN_*.mjs`.

## 3 · Hard rules for the picture
- **One world: THE RACK + THE DISH FIELD** (MOTION.md §2).
  - The 3D aisle is the anchor and appears only where shots.md says SCENE (§3 lists the hard world changes).
  - Between those, the explainers grow on the dish field: the dish seen from straight above, its dark medium as the night. The cell, the net and the spark are the carriers.
  - Go from aisle to field and back by a camera move (tilt into the dish / pull back out of it), never by a cut.
- **Explainers are made of dish things**: cells, the net, electrodes, sparks, the box, the tube, the scoreboard, the ladder. Each graphic shows exactly what the sentence says and is readable without sound: one statement, at most one number, ≤ 6 words. No generic chart panels, gridded axes or legends.
- **Colour code (never break it):**
  - gold = living cells, human;
  - cool blue-cream `COOL` = silicon, A.I., machines;
  - yellow `P.coat` = only you.
- **Every transition carries an object into the next.** No cross-fades; nothing fades in half-transparent from nowhere.
- **Calm:**
  - max ~1 hard world change per minute;
  - slow camera moves on word keys;
  - max 1–2 moving main elements at once;
  - never a still image > 2 s (the net's sparks, the cell's breath and the seams are the living holds).
- **You** (faceless, yellow raincoat, `E.du`, use `view: 'side'` for a profile) are the viewer. Give you small gestures on the words that concern you; the same net glows in your hood. Other people are indigo (`E.person`). No faces.
- **Ladder:** call `F.ladder(ctx, t, T)` last in every draw. It shows itself only around its own phrases (rungs and answers in `LADDER`). Do not draw your own question cards for those beats.
- **Clips (C2 in c04, C3 in c10):**
  - The animation leads into a screen, the clip runs in it, and the animation leads out again.
  - Steer a screen (`monitor`, or the box/radio becoming a screen) onto `CLIP_RECT` by `clipWin(T, id).start`, then hold the camera still (drift 0). Draw `F.clipPlate(ctx, t, T, id, { rect })`: credits name + role + year + ORIGINAL FOOTAGE, and the footage or the marked placeholder.
  - After `end`, darken the screen (`dark`) and move out.
- **No company logos:** names as type only. Quote cards are word for word, ≥ 4 s, big type, small attribution.
- **End screen ≤ 15 s** (B3, 11.09): the aisle at night, slowly pulling back, the alive rack in the centre. Keep free areas left (x 90–780, y 250–700) and right (x 1140–1830, y 250–700), plus the subscribe centre (x 810–1110, y 330–600). Picture and grain keep running.
- **Timing:** anchor on phrases from the timing file, never on hard-coded seconds. Search after a fence (`T.G(p, 0, after)`) for phrases that occur more than once ("No reward", "Point, cells", "So how do you teach").

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc05.mjs`
  - B2: `scenes/sc06.mjs` … `sc08.mjs`
  - B3: `scenes/sc09.mjs` … `sc11.mjs`
  - plus your own modules `lib/f19_b1_*.mjs`, `lib/f19_b2_*.mjs` or `lib/f19_b3_*.mjs`
- **Do not change:**
  - libraries: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f19_kit.mjs`, `lib/f19_seams.mjs`, `lib/kit.mjs`
  - engine: `film.mjs`, `engine.mjs`, `render.mjs`
  - folders: `tools/`, `docs/`, `data/`, and anything under `audio/` (the audio agent)
  - other files: `scenes/sc01.mjs`, the other builders' files
- **Something missing in the kit, or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT19 }`. `R = { a, b }` is the chunk range. A chunk is normally **one** entry (plan sequence). A second entry is a hard cut, allowed only where shots.md names a match move with a rhyming carrier.
- **No commit, no push.** All three of you work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash` or `git reset`.

## 5 · Kit state (after c01)
- **Camera:**
  - `cam({ tx, ty, tz, d, p, f, ox, oy })` is a look-at camera with **pitch**. Y is up, Z is away, the floor is Y 0 and the rack front is Z 0.
  - Also available: `camAt`, `camDrift`, `view`, `proj`, `bill`, `quad`.
  - Top-down on the open dish: `cam({ tx: 0, ty: drawerY(OPEN) + 12, tz: −RACK.tray/2, d: 1500·RACK.dishR / r, p: −π/2 })` gives exactly `fieldMap(960, 540, r)`.
- **The aisle:** `hall(ctx, v, t, { pool })`, then `rack(ctx, v, t, { open, slide, glow, net, dishO })`, which returns `{ dish: { map, X, Y, Z, R } }`. Also `monitor(…)` (returns the screen rect) and `feeder` (pipette).
- **The dish:**
  - `dish(ctx, t, map, { glow, chip, electrodes, ePulse(i, j), net, rim, a })`
  - `net(ctx, t, map, { grow, lit, dim, focus, ambient, fire(i), cool, w, nSparks })`
  - `NET` (34 somas, `centre`, `order`), `spark`, `somaAt`, `sparksAmbient`
- **Things:**
  - `cell(kind 'blood' | 'stem' | 'neuron', sprout, warm, clock, clockR, hand)`, `clockRing`
  - `glyph('hand' 'eye' 'star' 'controller' 'paddle' 'pipette', { strike })`
  - `vial`, `cl1` (the box, front view; returns `window`)
  - `creature('fly' 'bee' 'mouse' 'head' 'box', { fill })`
  - `scoreboard`, `questionLine`, `ladder`
  - `quote`, `rule`, `maskLine`, `rise`, `measure`, `trailSpan`, `along`
- c01's set, if you show the same places: you at X −1150, Z −1100 (h 1700, facing the rack); the screen in the aisle at X 1180, Y 1240, Z −660, w 760 (`C_MON` lands exactly on CLIP_RECT); the drop lands at dish (.2, −.05); the tube at (1650, 930, h 340); the head at (1640, 1060, h 560).
- **Finish:** `PRINT19 = { grain: 14, floor: 4, vig: .5 }`. Mean luma (calm.py) 40–60, with the hero the brightest thing.
- **Memory:** no canvas, pattern or gradient cache per frame; build cached things once at load. `Path2D` and `PathOp` come from `@napi-rs/canvas`.
- **Known:**
  - `maskLine` has no `align: 'right'`; use `x − measure(…)`.
  - `vial` writes its label vertically, max ~6 letters.

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` is your own scratchpad (from your system prompt). Work in `$SP/f19/bN/`. Nothing big goes into `/mnt/project-files`.

**Review stills** (small):

```
cd /home/user/scenario/films/19-biocomputer
SECS=c06 node render.mjs --snap 231,233,235.5 --dir $SP/f19/b2/snap --scale .5
```

Then build a contact sheet and **look at it**.

**Video** (full quality): pieces ≤ 20 s, always with `--expose-gc`, and never more than one render per builder at a time. At ~240 ms/frame, 20 s takes ~2.5 min.

```
SECS=c06 node --expose-gc render.mjs --out $SP/f19/b2/c06_a.mp4 --from 230.10 --to 250
```

Join the pieces with `ffmpeg -f concat -c copy` into `$SP/f19/bN/cNN.mp4`.

**Delivery per chunk:**
- the video at `$SP/f19/bN/cNN.mp4` (the path goes into the report);
- a contact sheet (1 frame/s, small jpg, ≤ 1 MB) at `/mnt/project-files/scenario/film-biocomputer/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition), with everything ugly or unclear fixed. At least 3 review rounds. Check:
   - every frame is a poster;
   - sentence = picture;
   - the hero is the brightest thing;
   - you are never cut off except in a deliberate move;
   - text is readable on a phone (a 390 px wide copy).
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned match moves), mafd median ≤ ~0.45, luma 40–60. The 3D aisle with a moving camera measures high (c01's aisle part: ~1.1). Keep aisle passages short and the camera slow, and let the dish field carry the calm.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams, also check against the plate.
5. **Calm rules** (MOTION.md §5):
   - 1–2 moving main elements;
   - no still image > 2 s;
   - a 1.5–3 s hold after accents;
   - nothing from nowhere;
   - no dissolves, fades or slides.
6. Self-grade 1–5 on: poster · sentence = picture · seamless · calm · alive · graphics made of dish things · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to the videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Open points and deviations from shots.md, with the reason.
- The files you created or changed, so the lead can commit exactly those.
