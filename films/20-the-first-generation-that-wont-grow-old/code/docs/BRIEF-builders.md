# Film 20 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-06

Film: "The First Generation That Won't Grow Old" (Film #20, The Good Takeoff), ≈ 10:18 incl. end screen, animation fully in code,
Editorial-Grain style. Notes may be German, code comments English. Repo `/home/user/scenario`, film folder `films/20-aging`.

## 0 · Mandatory before the first line of code
1. Load and follow the skills `anthropic-skills:scenario-motion`, `world-class-motion-design`, `fluid-motion-design`, `motion-director-gates`.
2. Read `docs/MOTION.md` (the world, the objects, the calm rules), `docs/shots.md` (your shots: binding), `lib/f20_kit.mjs` header,
   `lib/f20_seams.mjs`, and `scenes/sc01.mjs` (the quality reference: how one chunk is one camera, anchors on phrases, state per frame).
3. Watch the c01 preview (path in the lead's report; `minute1-c01.mp4`) and look at `tools/seam_plates20.mjs` output (the plates).
4. Data: VO timing `/mnt/project-files/scenario/film-altern/audio/timing.json` (real, words + clips + cards), script `vo-v4.txt`,
   facts **only** from `faktenzettel.md` and `faktencheck.md` (same folder). Network drive: small files only.

## 1 · Split (times from the real timing; in code anchor only on phrases)
| Builder | Chunks | Range (s) | Length | Starts on | Ends on |
|---|---|---|---|---|---|
| Lead | c01 | 0 – 117.08 | 117 s | – | **plateYou** (last 0.5 s) |
| **B1** | c02 why bodies age · c03 four proteins · c04 A.I. at the button (CLIP C1) | 117.08 – 284.12 | 167 s | **plateYou** (first 0.5 s) | **plateEye** |
| **B2** | c05 the first eye (CARD Q1) · c06 one thread (CLIP C2) · c07 the skeptic (CARD Q2, CLIP C3) | 284.12 – 462.72 | 179 s | **plateEye** | **plateTrack** |
| **B3** | c08 the band, the price · c09 not a cake (CARD Q3) · c10 four decisions · c11 ending + end screen | 462.72 – 617.66 | 155 s | **plateTrack** | end screen (602.66 – 617.66) |
Chunk starts (phrases, `film.mjs CHUNKS`): c02 'Aging looks like' · c03 'Twenty years ago' · c04 'That search is too big' · c05 'Yes. Earlier this
year' · c06 'The eye was the easy start' · c07 'Artificial intelligence is coming at' · c08 "The optimists' estimates" · c09 'Nobody has to lose' ·
c10 'Both were decisions' · c11 'None of this has ever'. Clips/cards: `T.clips` / `clipWindow(T, 'C1')` (C1 242.02–252.02, Q1 305.22–310.22,
C2 340.44–350.44, Q2 384.10–390.10, C3 422.72–432.72, Q3 516.98–522.98 in the current timing; read them from T, never hard-code).

## 2 · The seams between the groups (fixed by the lead)
- At a group seam the chunk before ENDS with `plateX(ctx, t)` for `t >= T0 − SEAM_HALF`, the chunk after STARTS with it for
  `t < T0 + SEAM_HALF` (T0 = the chunk start phrase). Arrive on the plate exactly: last camera key = the plate camera (`YOU_CAM`, `EYE_CAM`,
  `TRACK_CAM`), same world state (`youState()`, `EYE_STATE` + `famSeated()`, `trackState()`), drift faded to 0 (see `sc01.mjs camOf`).
- **plateYou** (Lead → B1): you from behind at the finish line you reached, right third; the clock huge (needle 1.7, hatched wedge 1.7→7
  with cool share .6, dashed 12); the family on the track at `STOPS`; finish line far (`FIN_FAR`); card `WHY DO BODIES AGE?` top left.
- **plateEye** (B1 → B2): the hook's table under the lamp, the eye risen out of the tabletop (`tableEye`, `EYE_STATE`: open, iris half warm),
  family seated looking at it, dim clock behind.
- **plateTrack** (B2 → B3): the wide track from behind the family (`TRACK_CAM`), the clock with needle 1.7 (no wedge), finish line far.
- A plate is a fixed picture: only breathing, stars, the lamp sway and the film's camera float move. Never edit a plate; wishes to the lead.
- Inside your own range the chunk boundaries are plan sequences: carry the camera and the objects across (you own both sides).

## 3 · Hard rules for the picture
- **ONE world** (MOTION.md §2): night plain · kitchen table + lamp · four generations · track with lanes, finish line / band · THE CLOCK.
  No new places. New objects only as listed in MOTION.md §3 (or clearly of the same family: light on night, flat 2.5D cards).
- **Forbidden**: Film 18's board, tags, doors; the giant hand; the circle-monolith; game boards; robots, brains, matrix code; AI images; any
  real person drawn (clip speakers only appear as footage in `CLIP_RECT`; quote cards are text only); 3D-game look; primitive shapes
  standing in for things (a cell needs a membrane and a nucleus, a liver its shape, an eye its iris).
- **Every image explains its sentence** (the anchor words in shots.md). One idea per sentence. Mark facts with their source line.
- **Calm**: ≤ 1 hard world change per minute (there are none planned: move the camera inside the world), slow camera, 1–2 moving main
  elements, never a still > 2 s, nothing fading in half-transparent (rise from a baseline, out of the tabletop, down from the dark, draw as a
  line of light), hold 1.5–3 s after an accent.
- **Figures alive**: `gen` breathes; give looks on words, natural arms (`armR`/`armL`), walking with `walk` phase from distance, `view:'back'`
  when walking away. Yellow is only you.
- **Bottom fifth (y > 864) calm**: subtitles go there later. No text, no accents there.
- **Clips**: lead into `CLIP_RECT` (x 560, y 120, 1280 × 720) with a carrier (a frame folding out of the previous graphic), keep the rect
  exactly still during the clip window (the film switches its camera float off there), draw `clipScreen(ctx, t, { id, name, role, date })`
  (name/role/date from `clips.json` C1a/C2a/C3a; C1a/C2a speakers are still open — write `NEWLIMIT · COMPANY TALK · JULY 2026` until the lead
  names them). The real footage is overlaid later.
- **Quote cards**: `quoteCard(ctx, t, { text, who, src, t0, t1 })` with the exact text from `T.clips` (`Q1`–`Q3`), ≥ 4 s (they are 5–6 s).
- **Infographic share** 60–70 % overall (shots.md computes it per chunk). Keep the layers as planned; a deviation goes into the report.

## 4 · What you may touch and what not
- **Only your files:** B1 `scenes/sc02.mjs` … `sc04.mjs` · B2 `scenes/sc05.mjs` … `sc07.mjs` · B3 `scenes/sc08.mjs` … `sc11.mjs`, plus your own
  modules `lib/f20_b1_*.mjs` / `lib/f20_b2_*.mjs` / `lib/f20_b3_*.mjs`.
- **Do not change:** `lib/f20_kit.mjs`, `lib/f20_seams.mjs`, `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/kit.mjs`,
  `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `scenes/sc01.mjs`, other builders' files, anything under `audio/`.
- **Missing in the kit / a bug:** solve it in your module, report it as a kit wish. Only the lead changes the kit.
- **Scene file:** `export default async (T, R) => [entries]`, `entry = { t, draw(ctx, t), print: F.PRINT20 }`; `R = { a, b }` is the chunk range.
  A chunk is normally ONE entry (plan sequence). A second entry = a hard cut, only where shots.md names a carrier that rhymes.
- **No commit, no push**, no `git checkout/stash/reset`. The lead or the coordinator commits.

## 5 · Kit notes (after c01)
- Projection: `camFor(X, Yground, Z, s, sx, sy)` = the camera that shows a world point at a screen point with s px/unit; `camAt(t, K, CLOCK.Z)`
  for keyframes (ref = the clock depth); `camDrift(c, t, amt)` on top. No pitch: to see the ground, go high; to see the sky, go low.
- `scene20(ctx, c, t, st)` draws the whole world; pass `null` for parts you do not want (`table: null` when the camera is past it).
  Hooks: `extra(ctx, c, t, layer, dial)` with 'far' (on the clock face, after it), 'track', 'near'; `onTable` for things on the tabletop.
- `clock()` returns `{ cx, cy, R, at(v, r) }` — anchor explainers on it. `marks: [{ v, text, sub, src, u }]`, `push: { v0, v1, u, cool, label }`,
  `ghost`, `thr`, `thrLabel`, `thrSub`, `thrSrc` ('line1\nline2'), `thrSrcU`, `title`, `foot`, `tick(t)`.
- `track({ lit, reach, fin, finA, start, marks: [{ Z, text, a }], band: { z0, z1, a } })` — B3: calendar marks and the band are built in.
- `tableEye(ctx, c, t, { rise, open, young, ripple, blink, lie, look })`, `EYE_Y` (pupil height, stand units at LAMP.Z).
- `button(ctx, t, x, y, r, { u, press, lit, slots })`, `protein(ctx, t, x, y, r, i, { lit, cool, a, redraw })`, `wards(ctx, t, x, y, { u, join, pull, label, lit, w })`.
- `srcLine` / `maskLine` support `align: 'right'` now.
- Mean luma 40–60 (calm.py): the lit clock close up is the brightest frame type; keep big lit faces short or partly out of frame.
- Memory: no canvas, pattern or gradient cache per frame; `Path2D` from `@napi-rs/canvas`; seeded randomness only.

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your scratchpad; work folder `$SP/f20/bN/`. Nothing big into `/mnt/project-files`.
```
cd /home/user/scenario/films/20-aging
SECS=c05 node render.mjs --snap 286,288,290 --dir $SP/f20/b2/snap --scale .4          # review stills, then a contact sheet: LOOK at it
SECS=c05 node --expose-gc render.mjs --out $SP/f20/b2/c05_a.mp4 --from 284.12 --to 304   # pieces ≤ 20 s, one render per builder at a time
ffmpeg -f concat -safe 0 -i list.txt -c copy $SP/f20/b2/c05.mp4
```
Delivery per chunk: video `$SP/f20/bN/cNN.mp4` (path in the report) and a contact sheet (1 frame/s, ≤ 1 MB jpg) to
`/mnt/project-files/scenario/film-altern/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. Contact sheet looked at (every 0.5–1 s + every anchor and transition), at least 3 review rounds: poster · sentence = picture · hero
   brightest · nothing cropped by accident · text readable on a phone · bottom fifth calm.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned), mafd median ≤ ~0.45, luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: 0 LURCH/POP.
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and render seam; at group seams compare with the plate
   (`node tools/seam_plates20.mjs $SP/f20/plates`).
5. Calm rules (MOTION.md §5) and self-grade 1–5: poster · sentence = picture · seamless · calm · alive · text. Nothing under 4.

## 8 · Report (short, English)
Chunks finished with video + contact sheet paths · numbers (calm, smooth, seam) · kit wishes · deviations from shots.md with the reason ·
the files you created or changed.
