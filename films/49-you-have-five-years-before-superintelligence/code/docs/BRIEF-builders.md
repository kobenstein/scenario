# Film 49 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-23

Read first: `docs/MOTION.md` (world, rules), `docs/shots.md` (binding shots, layers, ★), then the reference chunk `scenes/sc01.mjs`
(beat table in the header, camera keys on phrases, `land()` callback, captions, sources, the plate exit) and the kit sheet
`<ROOT>bild/kit49_kontakt.jpg` (every world piece and kit block). ROOT = `$F49ROOT` or `/mnt/project-files/scenario/film-vorbereiten/`.

| builder | chunks | range (real VO) | enters from | exits into |
|---|---|---|---|---|
| **B1** | c02 · c03 · c04 · c05 | 'Picture a wedding' 55.0 → 'But you can only do so much' 235.7 (181 s) | `S.plateFoot` | `S.plateWork` |
| **B2** | c06 · c07 · c08 | 'But you can only do so much' 235.7 → 'That is what the experts know' 397.5 (162 s) | `S.plateWork` | `S.plateMachine` |
| **B3** | c09 · c10 · c11 · c12 | 'That is what the experts know' 397.5 → end 592.3 (195 s) | `S.plateMachine` | `S.endScreen` (last 15 s) |

Chunk starts (phrases, `film.mjs` CHUNKS): c02 'Picture a wedding' · c03 'Five years to go' · c04 'What the next generation always had' ·
c05 'Four years to go' · c06 'But you can only do so much' · c07 'Three years to go' · c08 'But if a machine can already act' ·
c09 'That is what the experts know' · c10 'One year to go' · c11 'And there may be a great deal' · c12 'Five years from now'.

Every chunk c02–c12 is now a **world stub** (`lib/stub.mjs` `worldStub`): it already draws the stairs, the right stage, the counter, the
step lights and the plates at your group seams, with the spoken sentence top right. Replace the file completely with your chunk.

## Timing
The real VO is in: `<ROOT>audio/timing.json` (film.mjs picks it up). **Anchors are phrases, never seconds**: `T.G(phrase, nth, after)`
(start), `T.GE(…)` (end), clip slots `T.clip('C5').start/.end`. The four clip slots are placeholders and WILL shift once the real clips
land tonight; phrases keep you safe. Step sounds: `F.stepHit(T, i)` (i 0 = five years … 4 = one year); the step in the world and the
counter block light on that frame: `F.stepLight(T, t, i)` (0 → 1.12 overshoot → 1). Never time a step by hand.

## Seams (`lib/f49_world.mjs`, owned by the lead: import, never edit)
- A plate is the exact picture at a group seam T0. The handing side draws it for t in [T0 − .5, T0), the receiving side for
  [T0, T0 + .5) and grows its scene out of it. Plates keep a slow push and truck (`S.creep`, `S.trk`: CREEP 5 %/s, TRUCK 45 px/s).
  **Continue that speed** when you leave a plate, and run it backwards into a plate (see `creepCam` in sc01): `F.camPath` has zero speed
  at its first and last key, which shows as FROZEN in seam.mjs.
- **plateFoot** (c01 → c02): you on tread 0 at x 880, the laptop dark, the wedding table at the left UNLIT. B1 lights the string lights
  right → left, the first bulb nearest you, and glides to the table.
- **plateWork** (c05 → c06): close on tread 1, you at the desk (`S.workDesk`: lamp, papers, the tool), the calendar on riser 2 CLOSED,
  counter 4 YEARS. B1 lands here; B2 starts from here.
- **plateMachine** (c08 → c09): close on tread 3, the living room, you by the sofa looking at the TV, counter 2 YEARS. B2 lands; B3 starts.
- **endScreen** (B3, last 15 s): `S.endScreen` / `S.END_CAM` / `S.END_TILES`; you may refine it, keep the lower half calm and text-free.
- Seams inside your group (e.g. c03/c04) are yours: make the two frames identical (one continuous take).

## Kit API (`lib/f49_kit.mjs` as `F`, `lib/f49_world.mjs` as `S`, `lib/f10_editorial.mjs` as `E`)
- **World:** `S.stairsWorld(ctx, cam, t, st)` with st `lit[5]`, `door`, `doorPulse`, `dust`, `old`, `hist[4]`, `until`, `nums`,
  `stage[5]`, `wedding {a, lights, warm}`, `topTable`, `decades`, `dawn` (c11 only), `crowd` (subscribe 1), `laptop`, `pool`, `you`,
  `people`, `land(ctx)` (draw cards ON the land card, in world units), `fg`. Full list in the file header. `S.LIT(k)` = lit state of year k.
- **Places:** `S.STEPS`, `S.STAGES[k]` (`x0, x1, y, cx, name`), `S.climbPos(k, u)` (climb the carved stair), `S.LANDING`, `S.DOOR`,
  `S.OLD_LANDINGS`, `S.landingY(i)`, `S.oldY(x)`, `S.WEDDING`, `S.stepPt`, `S.doorPt`, `S.SETS` (the five stage sets).
- **Cameras:** `E.aim(S.Z_LAND, u, v, s, sx, sy)`, `S.stageCam(k, s, du, dv)`, `F.camPath(t, K)`, `E.camDrift(c, t, amt)`.
- **Blocks:** `F.caption` (Inter Black, rises behind a mask) · `F.title` · `F.dataCard` (KNOWN / FORECAST / ESTIMATE / SURVEY) ·
  `F.quoteCard` · `F.paperCard` · `F.tentCard` (date card that unfolds from a tread) · `F.placeCard` (the through-line: `answer`, `gold`,
  `write`, `face`) · `F.bars` · `F.yearRail` (marks, bracket, TODAY) · `F.verdict` · `F.source` (y 880, 22 px) · `F.veil` (night veil for
  explainers over the world) · `F.float` · `F.goldText` / `F.goldSpan` / `F.goldLabel`.
- **Countdown:** `F.counter(ctx, t, T)` (call it every frame from c02 on; it builds on 'So start the countdown', hides in clip windows,
  ends on 'Five years from now'). `F.COUNTER`, `F.counterState`.
- **Strings:** `F.SOURCES` (binding wording from faktencheck-v7 "Bild und Einblendungen"; e.g. `founders`, `laidOff`, `experts`,
  `weeks`, `teens`, `sb243`, `pewBars`, `ballots`, `fundAct`, `trump`, `nobel`). If `<ROOT>faktencheck-v7.md` differs, the fact check wins:
  say so in your report.
- **Clips:** `F.clipPlate(ctx, t, T, 'C5')` inside the slot `T.clip(id)`. C13, C5, C16 are portrait shorts centred on night blue
  (`F.CLIP_PORTRAIT`), C2 is landscape (`F.CLIP_RECT`); the orientation is read from the real frames (`F.clipOrient`). Lower third from
  `F.CLIPS`. Until the footage arrives the plate shows ORIGINAL FOOTAGE · NAME. Grow the plate out of a paper card or a list and put it back.

## Rules (from the owner; see MOTION.md §3, §5)
- ONE world (the stairs). The camera travels instead of cutting; slow camera; max 1–2 moving elements. A carrier at every transition.
  Nothing from nowhere, no ghost fades, nothing frozen. Big area changes ≥ 1.8 s (sineIO), small hits on the word. One ★ per chunk.
- Every picture illustrates its sentence. Explainer share 60–70 % overall: keep or raise the layers of shots.md.
- No repeated circle suns. Thumbnail C (two doors) and A (dawn) appear once each where shots.md puts them.
- **The film never names its maker** (no Claude / Anthropic as maker; as a study source only, like any other). **No QR, no AI images:
  everything is drawn in code.** No logos, no real faces outside the clips, no robots, brains, clock faces. Nothing from MOTION.md
  "Nicht wiederholen".
- Nothing important below y 880 (burned-in subtitles, bottom 170 px). Text ≥ 22 px, ≤ 6 words per statement + one number, held ≥ 1.5 s.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks. Kit/world wishes: write a local helper in your scene file, or ask the lead in your
  report. Never edit `lib/f49_*.mjs`, `film.mjs`, `audio/`. No videos or large files in the repo; renders go to `/tmp/claude-0/f49/<you>/`;
  only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole project folder; re-read a file ~10 s after writing it).

## Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 58,60,62 --dir /tmp/claude-0/f49/b1/snap --scale .5        # stills
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f49/b1/c02.mp4 --from 54.97 --to 100.1 --scale .5
python3 tools/calm.py /tmp/claude-0/f49/b1/c02.mp4 --scale 1280:720      # 0 cuts, mafd median ≤ .47, static ≤ 15 %
python3 tools/smooth.py /tmp/claude-0/f49/b1/c02.mp4                       # 0 flagged (LURCH > 12, POP)
SECS=c01,c02 node tools/seam.mjs --at 54.97                                # your seams (and your inner chunk boundaries)
node tools/anchors49.mjs                                                   # all anchors found
node tools/kit_sheet49.mjs /tmp/claude-0/f49/kit                           # the kit stills
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Final 1080p chunks:
`python3 tools/f49_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable; extracts new clips first); assembly with subtitles and the
mix: `assemble` (the lead).

## Report (≤ 200 words)
Chunks done, check results (calm, smooth, seam, anchors), any string you took from the fact check that differs from `F.SOURCES`, kit
wishes, open issues, contact sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`).
