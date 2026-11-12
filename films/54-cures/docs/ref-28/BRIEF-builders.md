# Film 28 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-11, REAL VO timing

The picture lead built **c01** as the quality reference: the hook plus No. 12 up to the station, from 0 to `T.G('A global data company')` ≈ 77.1 s. The lead also holds the kit, the shot list and the seams. Three builders build the rest **at the same time**, about 3.3 minutes of picture each. The upload is Sat 14.11. 17:00, and the film is built through to the end with no interim review.

| builder | chunks | from → to (phrase) | time (real VO) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'A global data company' → 'Casey Harrell knows' | 1:17.1 – 4:44.2 (207 s) | No. 12 cont. (the envelope, **C1** Peter Lucas Jones 88.66–103.36, "the speakers own the machine") · No. 11 Apate call line · No. 10 IdentiFlight eagles (+ the study caveat) · No. 9 Nazca leads · No. 8 methane (lamp **half**) · **W 8.11** light door → plateTree |
| **B2** | c07 c08 c09 c10 | 'Casey Harrell knows' → 'The snake' | 4:44.2 – 8:10.8 (207 s) | No. 7 Casey (**C3** 324.76–333.96, two million words) · **subscribe 1** (channel call t15, 346.24–354.38) · No. 6 dark ships · No. 5 tsunami/GPS (**C4** NASA replay MUTE under the VO 434.11–440.11) · **W 5.11** · No. 4 the elephants and the train → plateGrass |
| **B3** | c11 c12 c13 c14 | 'The snake' → end | 8:10.8 – 11:24.7 (194 s, incl. 15 s end screen) | No. 3 snake proteins · No. 2 conspiracy chatbot (**C5b** David Rand 550.46–560.26) · **W 2.10** back to the tree: thread + ? return · No. 1 flash floods, the phone ("Maybe on yours") · **W 1.08** · ending: the gallery, "It was the aim", **subscribe 2** (t30, 662.83–669.66) · end screen 669.66–684.66 |

**Timing:**
- The real VO timing is in. `film.mjs` loads `<ROOT>audio/timing.json` automatically (ROOT = `/mnt/project-files/scenario/film-gute-ki/`, `$F28ROOT`).
- `data/provisional_timing.json` is only a fallback.
- The VO follows the **current vo-v5.txt** (fact-checked). Hyphens are spoken and timed without them ("Peter Lucas", "brand new", "peer reviewed").
- **Anchor only on phrases:** `T.G(phrase, nth, after)` / `T.GE(…)`, and `T.clip('C1')` for slots. Never seconds, never section/take ids (`sections` are take ids t00…t30).
- Repeated sentences:
  - "Satellites built to watch fields and forests" occurs twice (8.03 and E = nth 1).
  - "What do all these tools have in common?" occurs twice (H.11 and 2.10 = nth 1).
  - "This channel exists" occurs once, "That's why this channel exists" once.
  - Search after a fence: `T.G(p, 0, after)`.
- The audio agent works in `<ROOT>audio/` and in `films/28-ai-for-good/audio/`. **Do not touch either.**

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`
2. **Read the memory files** in `/tmp/claude/memory/team/silo/`:
   - `scenario-animation-standard`
   - `produktion-regeln`
   - `build-workflow`
   - `regel-szene-erklaergrafik`
   - `stil-editorial-nacht`
   - `film-gute-ki`
   - `build-durchziehen`
3. **Read the plan:**
   - `docs/MOTION.md` (whole)
   - `docs/shots.md` (your shots; **binding**: one motif per sentence, the carrier column is the handover)
   - the header of `lib/f28_kit.mjs` and `lib/f28_seams.mjs`
4. **Watch c01:** `scenes/sc01.mjs` is the reference for structure and quality: an anchor table `a = {}`, camera keys, lanterns as windows, the door, the plate at the end.
5. **Look at the kit sheet:** `node tools/kit_sheet28.mjs $SP/f28/kit`. It has stills of the tree, the windows, the station, the rail with the gallery, the explainers, the clip plate, the three plates and the end screen.
6. **Fact check overrides:** check every on-screen number against `<ROOT>faktenzettel.md` and the current `vo-v5.txt`. shots.md §5 lists the strings. If they disagree, the fact sheet wins; note it in your report.

## 1 · The seams between the groups (fixed, `lib/f28_seams.mjs`)
A plate is the exact picture at a group boundary.
- The handing side steers its last move so its frame converges onto the plate, then draws the plate for `[T0 − .5, T0)`.
- The receiving side draws the same plate for `[T0, T0 + .5)` and grows its world out of it.
- Plates creep at 4 %/s push plus 30 px/s truck (`S.CREEP`, `S.TRUCK`). Continue both, e.g. ride `E.aim(Z, u + S.TRUCK * (t − tP), v, s * (1 + S.CREEP * (t − tP)))` as c01 does.

The seams:
- **Lead → B1** at `T.G('A global data company')`: `S.plateStation`.
  - The station at night: warm window, the ring of voices round the antenna, the towers on the horizon right, the rail with lamp 12 lit and the mic under it. Camera `S.ST_CAM` (station-world coordinates, card `S.Z_ST`).
  - B1 (12.07) grows a cool envelope out of the towers' light.
- **B1 → B2** at `T.G('Casey Harrell knows')`: `S.plateTree`.
  - The tree at the turn: crown .28, lanterns 12 … 9 lit, 8 half, lantern 7 (the kitchen) glowing faintly; you at the foot. Camera `S.TREE_CAM_TURN`.
  - B1 (8.11) comes out of its light door onto it. B2 (7.01) flies into lantern 7.
  - Use `S.treeTurnState(t, T)`.
- **B2 → B3** at `T.G('The snake')`: `S.plateGrass`.
  - Night grass by the track, one dark shadow moving through the blades, rail 12 … 4 lit. Camera `S.GRASS_CAM`.
  - B2 (4.09) sinks into the grass. B3 (3.01) turns the shadow into the snake.

Check with `SECS=c06,c07 node tools/seam.mjs --at <T0>` (and the same for the other seams). Inner chunk boundaries within a group are one continuous take: the same world and camera continue, with no plate.

## 2 · Hard rules for the picture
- **The tree is an anchor, not wallpaper.** `S.treeWorld` appears only at the plates, 2.10 and the ending (shots.md TREE).
- **Each station** is its own place (a scene world on depth cards) and **opens as a window**. Fly in through a lantern glass, a lit window, a screen or a headlight (≥ 2.5 s, continuous). Hard world changes happen **only at your W shots** (light doors, `E.lightFlood` with 1.4 s ramps as in c01). Budget: B1 has 1, B2 has 1, B3 has 2.
- **The aim in every station.** The A.I. is the cool bead (`F.agent`) with its thin cool beam (`F.beam`). It turns warm only where it lands on what is saved. Never robots, brains, circuit boards or "matrix" code.
- **The lamp rail** `F.lampRail(ctx, t, T)` is in every frame from c02 to the end, screen space, top left.
  - It lights by itself on each station's solution phrase (`F.LAMPS`). **No big number at a station's start, and numbers are never spoken.**
  - Your station's tool object appears under its lamp by itself (`toolAt`). Show the same tool **in your scene** first, where the A.I. rides on it (the radio, the camera, the GPS signal …), so the rail tool has an origin.
  - No. 8 stays half lit. That is the point of "Seeing isn't saving".
- **REAL stamp per station** (Jakob 10.11.): `F.realStamp(ctx, t, t0, t1, key)` with the keys in `F.STAMPS`. Show it once, about 3 s, when the place or system is named.
- **Caveats on screen** are part of the film's honesty. Give each caveat one small calm explainer (a bracket, a small line), never a big red warning:
  - 10: "one wind farm can't prove that yet"
  - 7: "one man, in a research study"
  - 6: "a risk, not a verdict"
  - 3: "only in mice, single toxins"
  - 2: "errors corrected", "not yet peer reviewed"
  - 1: "a forecast isn't a rescue"
- **Explainers** are made of film things: light lines (`F.ruler`), dots (`F.dotField`), slabs, serif numbers, small cards and tags. One statement each, with at most one number and ≤ 6 words. No chart panels with legends.
- **Colour code** (MOTION.md §5):
  - warm = people / what is saved / hero light
  - cool = machine
  - yellow coat = only you (`E.du`)
  - everyone else = indigo `E.person`
- **Nicht wiederholen** (MOTION.md §3): no clock, hourglass, rack, dish world, fire circle, domino row, timeline wall, world map with pins, iris medallions, ear trumpet, stone tablet, call strip, [translating…] bar, generations table, running track, game board, monolith, staircase of light, red-line curve.
  - No. 11 uses a **call line**, not a clock.
  - No. 1 uses a **river network**, not a map with pins.
- **No phone before "Maybe on yours"** (c13).
- **Clips:**
  - `F.clipPlate(ctx, t, T, id, { from, morph })` grows from a thing in the scene (a window, a screen, a glass) during the lead-in sentence. It holds still under the clip, then shrinks back into that thing (see C3a in c01).
  - The frame shows ORIGINAL FOOTAGE and the name automatically.
  - The real frames come later into scratchpad `f28/clips/<id>/`. Until then the placeholder shows; that is fine.
  - **C4** is mute NASA footage UNDER the VO: show it in a smaller plate inside the scene (the sky over Hawaii), not full screen. Credit NASA SVS.
  - C1's wording differs from the script; that is the audio agent's subtitle job, not yours.
- **Subscribe** (no buttons, no bells, at most one small line of text):
  - 1 (c07, t15): the rail's lamps pass a warm pulse along, 12 → 7, like a lamp handed on.
  - 2 (c14, t30): the land below the tree wakes, many small warm lights (`lights`).
- **End screen 15 s** (c14, 669.66–684.66): the tree in full light in the **left third**, all lanterns lit (8 half), the gallery hanging under them. Keep the **right two thirds (x 700–1830, y 120–860) a quiet dark sky**. The picture and grain keep running. No text.
- **Subtitles** own y > 910.
- **Calm:**
  - at most 1–2 moving elements at a time;
  - the camera follows the carrier;
  - never stillness (`E.camDrift`, scaled down while diving, see c01's `drifted`);
  - nothing appears from nowhere.

## 3 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc06.mjs`
  - B2: `scenes/sc07.mjs` … `sc10.mjs`
  - B3: `scenes/sc11.mjs` … `sc14.mjs`
  - plus your own modules `lib/f28_b1_*.mjs`, `lib/f28_b2_*.mjs` or `lib/f28_b3_*.mjs`
- **Do not change:**
  - libraries: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f28_kit.mjs`, `lib/f28_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`
  - engine: `film.mjs`, `engine.mjs`, `render.mjs`
  - folders: `tools/`, `docs/`, `data/`, `audio/`
  - `scenes/sc01.mjs` and the other builders' files
- **Kit gaps or bugs:** solve them in your own module and report them as kit wishes.
- **napi-rs quirk:** `Path2D.addPath` joins sub-paths. Never use it to combine shapes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT28 }]`. One entry per chunk. A second entry is a hard cut, allowed only at a W shot.
- **No commit, no push**, no `git checkout`, `git stash` or `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the headers)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f28_kit.mjs';  import * as S from '../lib/f28_seams.mjs';
F.camPath(t, [[t, E.aim(Z, u, v, s)], …]) · E.camAt(t, [[t0, c0], [t1, c1, 'i'|'o']]) for dives · E.camDrift · E.lightFlood(ctx, a) · E.project(c, Z, u, v)
S.treeWorld(ctx, c, t, { glow, lantern(n) → { lit, inside(ctx, 1000, h), glass, num, numA }, du, lights(k, x), fg, extra(ctx) }) · S.lanternGlass(n) · S.treeTurnState
S.stationWorld(ctx, c, t, { window, ring, towers, voices(ctx), bead }) · S.STATION · S.HOMES · S.BOATS · S.Z_ST · S.ST_CAM
S.grassWorld(ctx, c, t, { shadowX, shadow }) · S.GRASS_CAM · S.vignetteTrain / vignetteKitchen / vignetteDesert (local 1000 wide)
F.sky · F.hills · F.water · F.pool · F.agent(ctx, t, x, y, r, { think, ring, a }) · F.beam(ctx, t, x0, y0, x1, y1, u, { w, hit, warm, a })
F.lantern · F.lampRail(ctx, t, T) · F.LAMPS · F.lampOn(T, n, t) · F.toolOn · F.tool(ctx, name, x, y, s, { lit, col }) · F.TOOLS · F.tag(ctx, t, x, y, text, u)
F.realStamp(ctx, t, t0, t1, key) · F.STAMPS · F.source(ctx, t, t0, t1, F.SOURCES.x) · F.QUOTES.harrell + F.quote
F.ruler · F.dotField · F.chartLines · F.slab / slabBars · F.dayTiles · F.bracket · F.label · F.questionMark · F.thesis · F.voiceWave · F.radioRings
F.laptop · F.elephant · F.clipPlate(ctx, t, T, id, { from, morph }) · F.CLIPS · E.du (you) · E.person · F.PRINT28
```

## 5 · Rendering (4 cores, shared by all three)
`SP` is your own scratchpad (from your system prompt). Work in `$SP/f28/bN/`.

**Review stills:**
```
cd /home/user/scenario/films/28-ai-for-good
SECS=c03 node render.mjs --snap 120,124,128 --dir $SP/f28/b1/snap --scale .4
```

**Video:**
- Pieces ≤ 20 s, always with `--expose-gc`.
- At most one render per builder at a time (~180 ms/frame at `--scale .5`).
```
SECS=c03 node --expose-gc render.mjs --out $SP/f28/b1/c03_a.mp4 --from 113 --to 133 --scale .5
```
- Join the pieces with `ffmpeg -f concat -c copy`.

**Delivery per chunk:**
- the video at `$SP/f28/bN/cNN.mp4`;
- a contact sheet (1 frame/s, small jpg, ≤ 1 MB) at `/mnt/project-files/scenario/film-gute-ki/bild/cNN_kontakt.jpg`.

**No video or audio files in the repo.**

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, at least 3 review rounds. Check:
   - poster quality;
   - sentence = picture;
   - the hero light is the brightest thing;
   - figures are alive;
   - text is readable at 390 px width and on screen ≥ 1.2 s.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`.
   - Cuts only at W shots.
   - Static share < 5 %; luma 40–60.
   - Report the mafd median (c01's numbers are in README.md).
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`. **0 LURCH/POP**, including around the light doors.
4. **seam.mjs:** at your group seams, `SECS=cNN,cMM node tools/seam.mjs --at <T0>`: no flags.
5. **Calm rules** (MOTION.md §6), checked.
6. **Self-grade 1–5** on: poster · sentence = picture · seamless · calm · alive · explainers made of film things · text · facts = fact sheet. Nothing under 4.

## 7 · Report (short, English)
- Chunks finished, with paths to the videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Deviations from shots.md, with the reason.
- Fact-check notes.
- The exact list of files you created or changed.
