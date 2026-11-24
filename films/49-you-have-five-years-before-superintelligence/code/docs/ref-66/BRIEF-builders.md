# Film 66 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-20

The lead built **c01** (the hook, 0 → `T.G('This January')`) as the quality reference, plus the kit, the world, the seams, the shot list and
stubs for c02–c12. Three builders now build the rest **at the same time**, about 3–3.5 minutes of picture each. Upload Sun 22.11. 17:00
Vienna; the film is built through to the end with no interim review. **Load the skills first:** scenario-motion,
world-class-motion-design, fluid-motion-design, motion-director-gates. Then read: `docs/MOTION.md` (world + rules), `docs/shots.md` (your
shots), `scenes/sc01.mjs` (how a chunk is built), `<ROOT>bild/kit66_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/66-sam-altman-says-everything-will-get-cheap/code/` (repo branch `claude/project-thread-kq9unm`; commit
locally, never push). ROOT = `/mnt/project-files/scenario/film-geld-nach-si/` (`$F66ROOT`).

| builder | chunks | from → to (phrase) | time (provisional, vo-v3) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 | 'This January' → 'So far, every price' | 0:56.9 – 3:48.1 (171 s) | **C1** Altman out of the promise · prices heading down · a price is other people's time · ★ the food dollar 54¢ / 12¢ · robots → the price sinks · the robot house · he sells cheap intelligence · the land wide (the one W) · ★ six tags + a seventh = the clock · the test question · station 1 (the Fed quote, 10×, translators 30 %, cost ≠ price, ≈ 90 % hourly, ★ FALLS FIRST) · station 2 (AI tutor, $12,290 +2.9 %, the certificate, ★ the tag splits) · **subscribe 1** (windows warm) → plateFactory |
| **B2** | c05 c06 c07 c08 | 'So far, every price' → 'So what does that do' | 3:48.1 – 7:14.9 (207 s) | station 3 (drop on your foot, **C2** Musk out of a box, 5,079,078 robots, phones −51 % quality-adjusted, +27.6 % to $581, ★ FALLS SLOWLY, the cable) · station 4 (Gentle Singularity quote, ★ energy is the floor, +33 %, **C3** Hassabis out of the clean light, radical abundance = a forecast, STAYS UP) · station 5 (the dollar bar again, ★ cropland $6,020, WORK OUT · GROUND STAYS) · station 6 (the turned tag turns: HOUSING, "on land you already own", ≈ 40 %, walls vs ground, Three Observations quote, STAYS HARD, ★ thumbnail B) → plateStairs |
| **B3** | c09 c10 c11 c12 | 'So what does that do' → end | 7:14.9 – 10:55.7 (221 s, incl. ≈ 5 s quiet + the 15 s end screen) | the seventh tag, NOT FINANCIAL ADVICE, ALL OF IT, ★ YOUR WAGE · output/hours, ★ labor share 53.0 % lowest since 1947 · **C4** Acemoglu out of the data point · the promise's second half, "worse off" · three answers MARKET · FUND · CHECK (★ Alaska $1,200 kitchen table) · the timeline · the order (clock big) · ★ YOUR WAGE IS A PRICE TOO · **subscribe 2** · end screen (`S.endScreen`, refine it) |

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`, or `$F66FONTS`).
If a quote card renders in a sans face, the fonts did not load: stop and say so.

## Timing (it WILL move: the real VO is still to come)
- `film.mjs` loads `<ROOT>audio/timing.json` when it exists, else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`
  from the newest `<ROOT>vo-vN.txt`; clip slots = `<ROOT>clips-geprueft.json` lengths + .3 s).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C2')` →
  `{ start, end }`. Never write seconds. After any VO change run `node tools/anchors66.mjs` (all anchors found) and `python3 tools/shots66.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'Housing' / 'Education' / 'Food' (hook list vs stations: use 'Housing.
  The first word', "Education. It's on his list", 'Food. Remember'), 'This summer' (c05 Musk / c10: 'This summer, American businesses'),
  'This channel exists' (c04 / c12, nth 1), 'half right' (hook / c08 / c12), 'less than a dollar' (hook / c09), 'your wage' (c09 / c12).
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT66 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. **One entry per chunk with your own camera path** (like sc01): one continuous take. Inner chunk
  boundaries of your group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).

## Seams (lib/f66_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'This January' | `S.platePromise` (home cam: thumbnail A again, you with the pay slip in your right hand, the city cool, the promise half crumbled) | c01 (done) | B1 1.01: the promise's face lights and becomes the C1 plate |
| B1 → B2 | 'So far, every price' | `S.plateFactory` (FACTORY_CAM: the factory right of centre, tag 3 unlit, the college's windows at the left, the clock) | B1 M.02 glides right and settles | B2 4.01: tag 3 lights and swings close |
| B2 → B3 | 'So what does that do' | `S.plateStairs` (STAIRS_CAM = thumbnail B: the rising row of six tags, the house-tag, you in its lit door, the clock) | B2 7.08 builds the row and settles | B3 8.01: the seventh tag (face down) comes down next to you |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push; `S.trk`, 30 px/s truck); the receiving
side continues both before it starts its own move. The stubs already draw the plates at their ends; keep that when you replace them.
Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>` (no flags).

## Kit API (lib/f66_kit.mjs as `F`, lib/f66_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **World:** `S.landWorld(ctx, cam, t, st)` (options in the file header: promise, promiseExtra, tags[7] (each `F.tag` options + dy, x, y, w),
  cool, city, office, power, arm, stairs, houseTag, you | false, youLand, land(ctx), roof(ctx, hands), fg) → `{ promise, hands }` ·
  screen boxes `S.promiseRect(c)`, `S.tagAt(c, i)`, `S.officeRect(c)` · cameras `S.HOME`, `S.PROMISE_CAM`, `S.FACTORY_CAM`, `S.STAIRS_CAM`,
  `S.stationCam(i, s, dv)`, `S.END_CAM` · constants `S.Z_*`, `S.GY`, `S.STATIONS`, `S.TAG_Y`, `S.TAG_W`, `S.PROMISE`, `S.YOU`, `S.OFFICE_WIN`,
  `S.STAIRS`, `S.VERDICT_TAGS` (the six tags after their verdicts), `S.PROMISE_HALF` · `S.endScreen(ctx, t, T)`, `S.END_TILES`, `S.END_ROW`.
- **The tag:** `F.tag(ctx, t, x, y, w, { a, rot, swing, thread, glow, lines, textU, price, priceU, dust, split, back, house, heavy, seed })`
  (x, y = the eyelet). `F.verdict(ctx, t, x, y, 'FALLS FIRST', u)` = gold caps + a drawn underline (no stamps).
- **Objects:** `F.receipt(ctx, t, { from, to, u, w, rows: [[label, u]], bend, roll })` (thumbnail C) · `F.paySlip(ctx, t, x, y, s, { glow, label })`
  · `F.dollarBar(ctx, t, x, y, w, { u, title, segs: [{ label, share, col, u, big }] })` (the food dollar, the house = walls + ground).
- **Explainers:** `F.paperCard`, `F.dataCard`, `F.quoteCard(ctx, t, T, { text, x, y, w, size, head, credit, spoken: [from, to], after, mode: 'hi' })`
  (words light as spoken), `F.priceTag`, `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.maskLine`, `F.rise`, `F.bracket`, `F.title`,
  `F.source(ctx, t, t0, t1, F.SOURCES.x)` (22 px, y 880), `F.veil(ctx, a)`, `F.float(ctx, t, k)` (never let a card stand still).
- **Camera:** `F.camPath(t, K)` with keys `[[t, E.aim(Z, u, v, s, sx, sy)], …]`; `E.camDrift(c, t, amp, …)`.
- **The clock:** `F.board(ctx, t, T, { a, big, lit })` drives itself from `F.BOARD` phrases and hides in clip windows. Draw it in every frame
  from 'Six price tags' on (B1 1.10 makes it appear; B3 11.01 makes it big with `big` 0..1).
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, label })` grows from `from` (a rect or [cx, cy, r]) into `F.CLIP_RECT` and
  back. Frames are extracted to `/tmp/claude-0/f66/clips/C1…C4/` (`python3 tools/f66_clips.py clips`). Lower third above the plate from
  `F.CLIPS`; C2/C4 are centre-cropped (logos). C1 14.97 s, C2 9.43 s, C3 13.57 s, C4 12.84 s (<ROOT>clips-geprueft.json).
- **Strings:** `F.SOURCES` (from text-v3 EINBLENDUNG, fact-checked; MB1–MB3 applied). **The current `<ROOT>text-v3.md` EINBLENDUNG lines
  win**; if they differ from `F.SOURCES`, use text-v3 and say so in your report.

## Rules (from the owner; see MOTION.md §3)
- ONE world (the long land). Camera moves, not world changes. Max 1–2 moving elements. A carrier at every transition. Nothing from nowhere,
  no ghost fades, nothing frozen. Big area changes ≥ 1.8 s (sineIO), small hits on the word. One ★ per chunk.
- Every picture illustrates its sentence. Explainer share 60–70 % overall: keep or raise the layers of shots.md.
- Gold = ONE hero light per frame. No logos, no real faces outside the clips, no AI images, no 3D look, no primitive shapes, no robots as
  heroes or faces. No QR. Nothing from MOTION.md "Nicht wiederholen" (no clocks, crystals, hourglasses, server racks, bells, stamps …).
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks. Kit/world wishes: write a local helper in your scene file, or ask the lead in your
  report. Never edit `lib/f66_*.mjs`, `film.mjs`, `audio/`. No videos or large files in the repo; renders go to `/tmp/claude-0/f66/<you>/`;
  only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole project folder; re-read a file ~10 s after writing it).

## Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 58,60,62 --dir /tmp/claude-0/f66/b1/snap --scale .5        # stills
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f66/b1/c02.mp4 --from 56.9 --to 129.3 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f66/b1/c02.mp4 --scale 1280:720      # 0 cuts
python3 tools/smooth.py /tmp/claude-0/f66/b1/c02.mp4 56.9                 # 0 flagged (LURCH > 12, POP)
SECS=c04,c05 node tools/seam.mjs --at <T0>                                 # your seams (and your inner chunk boundaries)
node tools/anchors66.mjs                                                   # all anchors found
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Final 1080p chunks:
`python3 tools/f66_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable); assembly with subtitles and the mix: `assemble` (the lead).

## Report (≤ 200 words)
Chunks done, check results (calm, smooth, seam, anchors), any string you took from text-v3 that differs from `F.SOURCES`, kit wishes, open
issues, contact sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`).
