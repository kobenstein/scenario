# Film 24 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-09

The picture lead built **c01** as the quality reference: the hook, 0 → `T.G('Their A.I. can already')` ≈ 48.12 s. The lead also holds the kit, the shot list and the seams. The rest is built by **three builders at the same time, B1, B2 and B3**, each about 3 minutes of picture.

Timing:
- The engine reads the real VO timing `/mnt/project-files/scenario/film-tiersprache/audio/timing.json` (written by the audio agent from the final vo-v5.txt): 635.48 s, VO end 625.86 s, end screen 620.48–635.48 (the closing call runs over its first seconds). `data/provisional_timing.json` (`python3 tools/provisional_timing.py`) is only the fallback.
- The final vo-v5 changed some wording against earlier drafts ("A small nonprofit in California", "For any species on Earth", "Up north, in the Bahamas", "So the team and its partners clip …"). Always check your phrases against the current vo-v5.txt.
- The audio may be re-cut, so **anchor only on phrases**: `T.G(phrase, nth, after)` / `T.GE(…)`. Never use seconds or segment ids. Hook sounds and clips: `T.clip('P1')`, `F.clipWin(T, 'C2')`.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`

   Outdated there: "Hyperframes" and three.js. We draw with our own engine in Canvas 2D: 2.5D cards (`E.cam3`, `E.card`, `E.aim`) and the night map (`F.map`, `F.flight`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md`: the world (THE NIGHT MAP + medallions + habitats + explainer field), **§3 Nicht wiederholen**, palette, calm rules, carriers
   3. `docs/shots.md`: your shots with phrase anchors, layers, carriers. It is binding. §5 holds the only on-screen strings.
   4. The header of `lib/f24_kit.mjs` (API) and `lib/f24_seams.mjs`
   5. `/mnt/project-files/scenario/film-tiersprache/vo-v5.txt` (your lines) and the picture notes of your paragraphs in `text-v4.md` (only the parts for your time; the file is big)
3. **Look at** the reference and treat it as the pattern and the quality bar:
   - `/mnt/project-files/scenario/film-tiersprache/bild/c01-stiltest.mp4` and `bild/c01_kontakt.jpg`
   - the code `scenes/sc01.mjs`

   What to take from it:
   - **One plan sequence per chunk** (one entry). Keys come from `camAt(t, K)` on words, plus `camDrift` (amount ~1.8 on the barn stage). Use `sineIO` by default; a big move needs ≥ 2 s.
   - **The zoom through a medallion.** sc01 `mapPart()`: the map view follows `F.flight(A, B, ease(u))`; the medallion radius follows the map scale (`r = PIN_R · v.z / z_end`), so the world inside and the map outside zoom as ONE move. Inside, the scene is drawn full frame through `E.withOuter({ k, e, f }, …)` (cards) and with `ctx.setTransform(O…)` (screen layers). Reverse it for a zoom in.
   - Everything comes from somewhere: cards rise out of the pig's back, waves grow while the animal calls, the strip is born on the ESP label, labels rise from their baseline and sink back into it.

`/mnt/project-files` is a network mount. Use exact paths only, and never search the whole folder. Only small jpg contact sheets go there; renders stay in your own scratchpad.

**Fact-check notes (vo-v5), binding for the picture:** Germany grid: **AGE 14–29** (not "UNDER 30"). Ship noise card: **DOMINICA · 13 WHALES**. Prize: **UP TO $10M**. Iceland: **ICELAND · JUNE 2026 · FIN WHALES**. The zebra finches sort "by meaning more than by sound". The machines "pick up on" names, feelings, what's going on.

## 1 · Split (provisional seconds; in code, anchor only on phrases)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **B1** | c02, c03, c04 | 48.12–216.40 | 168 s | the listener knows a never-heard animal; the feed and Aza Raskin, **C1**; $10M; the blank dictionary; the baby (kitchen), bubbles sort, the bottle; NO LABELS, the gap game, autocomplete, clusters; blindfold; the recorder on the crow; PATTERNS → MEANING; the strip big; the map with all pins + the tablet; Kenya names (speaker on a jeep), **C2**; NAMES; Amboseli chorus, GREETING · CALF COMFORTED; WHAT'S GOING ON → plateNorth |
| **B2** | c05, c06, c07, c08 | 216.40–429.60 | 213 s | León crows (100,000+ CALLS, murmurs), CONTEXT; the pigs again (BIRTH → SLAUGHTER), FEELINGS; Dominica sperm whales (four sliders), PARTS; Bahamas dolphins, **C3**, NEXT SOUND; Berkeley finches (COUCH / SOFA), IT'S THERE; the empty middle → the bar; toddler test; the prize UNCLAIMED; Alaska humpback, **C4**; ONE WHALE · ONE CALL · ONE TIME; quote card; 2030?; NO TRANSLATOR; **mid-film subscribe**; WHAT CHANGES?; 1970 record, 1982 IWC → plateBarn |
| **B3** | c09, c10, c11 + end screen | 429.60–635.48 | 206 s | the pigs; plant shelf; Germany AGE 14–29 grid; balance, feeling; the record and the pig wave; Iceland; meat paradox, MIND slider; the bar returns; **SCENARIO** day one (Kenya camp, the bar types "time to go" = the WOW), REAL card, do we answer, **C5**; year one New Zealand courtroom (REAL stamps, "too loud"); year ten Iowa kitchen, dog "walk."; OTHER MINDS; the new voice; back to today; the pigs and you; **end subscribe**; **end screen 15 s** |

Chunk boundaries (`film.mjs` CHUNKS):

| Boundary | ≈ s | Phrase |
|---|---|---|
| c02\|c03 | 96.44 | `Every baby on Earth` |
| c03\|c04 | 160.70 | `Further than you might` |
| c05\|c06 | 248.37 | `In the Caribbean` |
| c06\|c07 | 319.11 | `Why is meaning so hard` |
| c07\|c08 | 405.18 | `But suppose they make it` |
| c09\|c10 | 497.81 | `Twenty thirty. Day one` |
| c10\|c11 | 567.76 | `Year ten` |

**c01 is finished** (lead). Do not touch `scenes/sc01.mjs`.

## 2 · The seams between the groups (fixed, defined by the lead)
The group seams sit on a **shared picture**, a *plate* from `lib/f24_seams.mjs`, drawn in screen space. Both sides call the same function with the same `(t, T)`, so the frames on either side of the seam are identical. Preview: `node tools/kit_sheet24.mjs <dir>` (plate_ca, plate_north, plate_barn); check: `SECS=c01,c02 node tools/seam.mjs --at <T0>`.
- **The handing side** steers its last move so the picture converges on the plate (map view, pins, tablet, strip exactly on the plate's values by `T0 − 0.5`). It then draws the plate over everything for `t ∈ [T0 − 0.5, T0)`.
- **The receiving side** draws the plate for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate becomes a thing of the new world, never through a dissolve. Your first frames after `T0 + 0.5` must equal the plate, and only then move.
- **Plates are never frozen:** each keeps a slow push from `T0 − 0.5` on (`creep(t, T, phrase)`, `CREEP` = 3 %/s on the map zoom or the barn camera scale). The receiving side continues from that value and speed, then eases into its own move.
- Helpers: `seamWindow(t, T0)`, `SEAM_HALF`, `creep`, `CREEP`.

| Seam | T0 (anchor) | Plate |
|---|---|---|
| **Lead → B1** | `T.G('Their A.I. can already')` (≈ 48.12) | `plateCalifornia`: the night map at `CA_VIEW` (−110, 33.5, z 3.4), calls `CA_CALLS` (.45), all pins of that time (the gold ESP pin with its label up), the 2030 strip docked. |
| **B1 → B2** | `T.G('Now north, to Spain')` (≈ 216.40) | `plateNorth`: the night map at `NORTH_VIEW` (16, 21, z 2.0), calls .45; the Kenya pins (cream + gold Amboseli, labels down; the León pin grows on its own phrase), the tablet at `TABLET_AT` with NAMES and WHAT'S GOING ON engraved, the strip docked. |
| **B2 → B3** | `T.G('Now think back to those pigs')` (≈ 429.60) | `plateBarn`: the barn at the home camera `BARN_CAM` (`E.cam3()`), both pigs alive at rest (`barnCast`), no you, no cards; the strip docked (it reads WHAT CHANGES?). |

How each side meets its seam:
- **Lead → B1.** Hand-over (done, sc01 1.12): the push onto California ends exactly on the plate. Take-over (2.01): push into the gold ESP pin; its medallion opens (iris) onto the explainer field where the listener stands.
- **B1 → B2.** Hand-over (4.10): the chorus closes into the Amboseli pin (iris), the map pulls back onto `NORTH_VIEW`, WHAT'S GOING ON is engraved. Take-over (5.01): the flight north to León, into the gold crow medallion.
- **B2 → B3.** Hand-over (8.05): from the map, zoom into the Europe pig pin (its medallion is already the barn, `F.barnMedallion` at `F.BARN_MED`); the medallion grows to full frame (r → `F.RF`) while its camera goes from `BARN_MED` to `BARN_CAM`. Take-over (9.01): the slow push to pig 2, then the camera rises out of the barn.

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first frame of cN+1. A shared drawing function in your own `lib/f24_bN_*.mjs` is the simplest way.

## 3 · Hard rules for the picture
- **One world: THE NIGHT MAP + medallions** (MOTION.md §2). Station changes: zoom out onto the map → one flight → zoom in, the place pin's medallion opens (iris) onto the habitat or the field. One calm move per zoom; the map is not a permanent ride.
- **Nicht wiederholen** (MOTION.md §3): no clock, dial or countdown for 2030 (use the strip); no rack, dish, drawer, hourglass, running track, game board, generations table, fire circle, monolith, book of light, red-line curve.
- **Explainers are made of film things**: listener, waves, cards, tablet, strip, bar, pins, silhouettes. One statement per graphic, at most one number, ≤ 6 words. No chart panels, axes or legends.
- **Colour code (never break it):** gold = ESP and 2030 only; cream = other teams, cards, text; yellow `P.coat` = only you; cool blue-cream = NOT FINE, failure, empty.
- **Animals alive**: they breathe and blink by default; the calling animal opens its mouth (`open`), raises its head (`head`), the elephant lifts its trunk. Use the kit animals at their natural poses; no stiff holds.
- **Every transition carries an object into the next.** No cross-fades; nothing fades in half-transparent from nowhere.
- **Calm:** max ~1 hard world change per minute (shots.md marks the allowed ✂); slow camera moves on word keys; one main movement at a time; never a still image > 2 s; calm.py static share as low as you can (dark holds measure as static: keep a visible push).
- **Tablet:** `F.tablet(ctx, t, T, x, y, s)` engraves its slots by itself on their phrases. Do not draw your own slots.
- **Strip:** `F.strip(ctx, t, T, o)` once per frame (screen space), last before text. It changes its word by itself (2030? · WHAT CHANGES? · TARGET HIT). `o.big` for the big moments in shots.md.
- **Clips (C1 c02, C2 c04, C3 c06, C4 c07, C5 c10):** the medallion (or the phone) grows into `CLIP_RECT` (`F.clipPlate(ctx, t, T, id, { from: [cx, cy, r], morph })`); credits name + role + year + ORIGINAL FOOTAGE; hold the picture still under the clip; after `end` shrink it back into the medallion.
- **Subscribe** (7.16–7.17 B2, 11.14 B3): calm scene, the line SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY (Inter caps, small), no button graphics.
- **End screen 15 s** (B3, 11.15): the barn at rest under the lamp, pigs breathing, a very slow drift. Keep the right two thirds (x 700–1830, y 120–860) a quiet dark wall for the end cards; the pigs stand left of it (move the camera, not the set). Picture and grain keep running.
- **Subtitles** own y > 910: nothing important below that line.
- **Timing:** anchor on phrases; search after a fence (`T.G(p, 0, after)`) for phrases that occur more than once ("Twenty thirty", "Their A.I.", "In this scenario").

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc04.mjs`
  - B2: `scenes/sc05.mjs` … `sc08.mjs`
  - B3: `scenes/sc09.mjs` … `sc11.mjs`
  - plus your own modules `lib/f24_b1_*.mjs`, `lib/f24_b2_*.mjs` or `lib/f24_b3_*.mjs`
- **Do not change:**
  - libraries: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f24_kit.mjs`, `lib/f24_land.mjs`, `lib/f24_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`
  - engine: `film.mjs`, `engine.mjs`, `render.mjs`
  - folders: `tools/`, `docs/`, `data/`, and anything under `audio/` (the audio agent works there and in its own tools)
  - other files: `scenes/sc01.mjs`, the other builders' files
- **Something missing in the kit, or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT24 }`. `R = { a, b }` is the chunk range. A chunk is normally **one** entry (plan sequence). A second entry is a hard cut, allowed only where shots.md marks ✂.
- **No commit, no push.** All three of you work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash` or `git reset`.

## 5 · Kit state (after c01)
- **Map:** `mapView(lon, lat, z)` (z 1 = 360° on 1920 px), `map(ctx, t, v, { calls, dim, spread })`, `mapXY`, `mapLL`, `flight(A, B, u)` (ease u yourself), `PINS` (id, lon, lat, kind, animal, on / lab phrases, l1 / l2), `pins(ctx, t, T, v, { only, hide, labels, pulse, inner, grow, head, r, labDur })` returns `{ id: [cx, cy, r] }`, `pin(…)`, `PIN_R` 17, `STALK` 32, `iris(ctx, cx, cy, r, fn)`, `RF` (r that fills the frame).
- **Barn:** `BARN` (ground 790, lamp, pig1, pig2, you, fence), `barn`, `barnCast(ctx, cam, t, { p1, p2, you, fence })` (returns pig anchors in F0 design px), `BARN_MED`, `barnMedallion(ctx, cx, cy, r, t, cam)`. `E.withOuter({ k, e, f }, fn)` draws card scenes inside a medallion.
- **Animals:** `pig`, `elephant` (`walk`, `ears`, `trunk`, `calf`), `spermWhale`, `humpback`, `dolphin`, `dog` (`sit`, `lie`, `tilt`, `wag`, `walk`), `crow` (`tag`, `fly`, `peck`, `open`), `finch`, `frog`; `icon(ctx, kind, x, y, r)`. All `(ctx, t, x, y, h, o)` with `dir`, `light`, `warm`, `seed`; they return anchor points (mouth, eye, head …).
- **Graphics:** `wave(ctx, t, x, y, w, h, kind, { u, col, live, gap, fill, bars })` (kinds `CALL_KINDS`), `idCard` (`feelRow`, `q`, `feel`, `feelU`, `feelWord`, `tick`; width from the text), `tick`, `listener(ctx, t, x, y, s, { u, col, drink, blind, dir })`, `transBar(ctx, t, x, y, { u, text, typed, w, stamp })`, `tablet(ctx, t, T, x, y, s, { u, at, filled })`, `strip(ctx, t, T, { big, at, w, s, from, today, todayLabel, word })`, `questionLine`, `label`, `maskLine`, `rise`, `measure`.
- **Clips:** `CLIP_RECT`, `CLIPS`, `clipWin(T, id)`, `clipPlate(ctx, t, T, id, { from, morph, dark, credits, label })`.
- c01's set, if you show the barn: pigs at x 640 / 1300 (h 205), ground 790, lamp (965, 250), you at x 175 (h 360), fence post x 318; cards at (262, 300) / (1352, 300) scale 1.2; waves at (780, 508) / (1140, 508).
- **Finish:** `PRINT24 = { grain: 14, floor: 4, vig: .5 }`. Mean luma (calm.py) 40–60, the hero light the brightest thing.
- **Memory:** no canvas, pattern or gradient cache per frame; build cached things once at load. `Path2D` and `PathOp` come from `@napi-rs/canvas`.
- **Known:** the land is a simplified outline (`lib/f24_land.mjs`): fine from z 1 to ~6; for closer looks use a habitat scene, not the map. `maskLine` has no `align: 'right'`; use `x − measure(…)`.

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` is your own scratchpad (from your system prompt). Work in `$SP/f24/bN/`. Nothing big goes into `/mnt/project-files`.

**Review stills** (small):

```
cd /home/user/scenario/films/24-animals
SECS=c05 node render.mjs --snap 217,219,221.5 --dir $SP/f24/b2/snap --scale .5
```

Then build a contact sheet and **look at it**.

**Video** (full quality): pieces ≤ 20 s, always with `--expose-gc`, and never more than one render per builder at a time. At ~210 ms/frame, 20 s takes ~2 min.

```
SECS=c05 node --expose-gc render.mjs --out $SP/f24/b2/c05_a.mp4 --from 216.4 --to 236
```

Join the pieces with `ffmpeg -f concat -c copy` into `$SP/f24/bN/cNN.mp4`.

**Delivery per chunk:**
- the video at `$SP/f24/bN/cNN.mp4` (the path goes into the report);
- a contact sheet (1 frame/s, small jpg, ≤ 1 MB) at `/mnt/project-files/scenario/film-tiersprache/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition), with everything ugly or unclear fixed. At least 3 review rounds. Check:
   - every frame is a poster;
   - sentence = picture;
   - the hero light is the brightest thing;
   - animals are alive (breath, blink, the calling one moves);
   - you are never cut off except in a deliberate move;
   - text is readable on a phone (a 390 px wide copy).
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned ✂), mafd median ≤ ~0.45, luma 40–60, static share as low as possible (report it; c01 is the bar).
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP). A zoom through a medallion must be ≥ 2.5 s.
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams, also check against the plate.
5. **Calm rules** (MOTION.md §6): one main movement; no still image > 2 s; a 1.5–3 s hold after accents; nothing from nowhere; no dissolves, fades or slides.
6. Self-grade 1–5 on: poster · sentence = picture · seamless · calm · alive · graphics made of film things · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to the videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Open points and deviations from shots.md, with the reason.
- The files you created or changed, so the lead can commit exactly those.
