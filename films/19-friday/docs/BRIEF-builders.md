# Film 19 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-06

The picture lead built c01 (the hook: the line that aimed at Friday, ahead of schedule, the bend, the second line) as the
quality reference and holds the kit, the shot list and the seams. c01 runs 0 → 41.58 s on the real VO. The rest is built by **three builders at the same time: B1, B2 and B3**.
**Start only after Jakob's OK on the c01 style test** (channel rule: 20-s style test before the whole film).
Timing: the real VO is done (8:03.1): the engine reads `film-singularity-friday/audio/timing.json` (words, sections, `clips`) and
`audio/clips-slots.json` holds the fixed slots. Everything anchors on **phrases**, so a re-cut VO moves your picture with it. Fixed times:
clip gaps **C1 66.64–76.64 · C2 140.40–152.40 · C3 191.40–201.40** (plan the clip frames exactly on these, via `T.clip(id)`),
**end screen 468.10–483.10** (7:48.1, 15 s).

## 0 · Mandatory before the first line of code
1. **Load the four skills first** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`,
   `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with
   our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding: indigo night, gold light, the tiny you in yellow)
   2. `docs/MOTION.md` (THE SHEET in the night, objects, palette, calm rules, carriers, clips, kit)
   3. `docs/shots.md` (your shots with phrase anchors, carriers and transitions; binding)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API) and the header of `lib/f19_kit.mjs`
   5. `/mnt/project-files/scenario/film-singularity-friday/vo-v5.txt` (your paragraphs; v5 = after the fact check)
   6. `/mnt/project-files/scenario/film-singularity-friday/faktencheck.md` (§5 = notes for the picture) + `faktenzettel.md` + `clips-v1.md`
3. **Look at** the reference: `/mnt/project-files/scenario/film-singularity-friday/bild/c01_kontakt.jpg` and `scenes/sc01.mjs`. It is the pattern and the bar:
   - one plan sequence per chunk (one entry); the camera travels on THE SHEET instead of cutting;
   - camera from `camAt(t, K, ZS)` keys on words, cameras built with `aim(ZS, u, v, s)`;
   - one state object drives the picture (`chart1960(ctx, c, t, st)`), every value a function of word times, converging onto the seam plate;
   - everything that appears comes from somewhere: ink is drawn by its head, the dot lands and grows into you, labels rise from their baseline.

`/mnt/project-files` is a network mount: exact paths only, never search the whole folder; only small jpg contact sheets go there
(read each file back ~10 s after writing). Renders stay in your own scratchpad.

## 1 · Split (real VO times; in code anchor only on phrases)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **B1** | c02, c03, c04, c05 | 41.58–202.68 | 161 s | What bent the first line? Not war, not famine: THE LOOP (more people → more ideas → more growth), **C1** von Foerster in the loop's frame, the machine loop; the loop broke: ★ the family tree lifts off, ≈ 5 → ≈ 2 kids, MORE CHOICES, no family tree for machines; the stopwatch (real tasks, a skilled person, the machine alone), **C2** METR / Beth Barnes, doubling, ★ ONE WORKING DAY; steady doubling vs. the old formula, ★ the ghost on tracing paper, **C3** (placeholder) in the slip's frame |
| **B2** | c06, c07, c08 | 202.68–334.16 | 131 s | A date sounds precise: the ? tears off, LATE 2026 (± 5.5 y), ★ a birthday (Vienna 1911, candle 115), a wink, **the 1960 subtitle with the ringed IF**, projection not forecast, the GPS; see it: the fogged windshield, counted people, the public stopwatch, ★ the ruler that is too short, measure like weather; seeing isn't steering: for everyone?, a working day of help in your hands, ★ the velvet rope falls → into the light: the empty wheel |
| **B3** | c09, c10, c11 + end screen | 334.16–483.10 | 149 s | A few hands on a heavy wheel, ★ eight billion, billions of family decisions, use · refuse · vote, shiny: bigger or smaller?; a test (1973), options vs. choices, ★ the card held up like a gauge, tutor ✓ / form ✗; human hands, the next bend you can see coming, your answer, subscribe, ∞ vs. ≈ 8.3 BILLION, ★ Happy birthday, Heinz + end screen (≤ 15 s) |

Chunk boundaries (phrases in `film.mjs` `CHUNKS`, real VO): c02 `So what bent the first line` 41.58 · c03 `But the human loop broke` 94.62 ·
c04 `To find out` 125.37 · c05 `That's fast` 164.36 · c06 `A date sounds precise` 202.68 · c07 `Only if we can see it` 256.98 ·
c08 `But seeing the road isn't steering` 297.66 · c09 `Right now, though` 334.16 · c10 `To tell bigger from smaller` 379.50 ·
c11 `The test isn't how smart` 422.34 · VO end 467.20 · end screen 468.10–483.10 · film end 483.10.
Clip slots (silent in the VO, `T.clip('C1')` etc.; fixed): **C1** 66.64–76.64 · **C2** 140.40–152.40 · **C3** 191.40–201.40.

**c01 is finished** (lead). Do not touch `scenes/sc01.mjs`.

## 2 · The seams between the groups (fixed, defined by the lead)
The group seams sit on a **shared picture**, a *plate* from `lib/f19_seams.mjs`. Both sides draw it from the same function with the
same `t`, so the frames left and right of the seam are identical. Preview: `node tools/seam_plates19.mjs <dir>`.
- The handing side converges onto the plate (camera key `PLATE.cam` at `T0 − 0.5`, sine-S; drift amount lerped to `PLATE_DRIFT`, because
  the plates breathe with `camDrift(PLATE.cam, t, PLATE_DRIFT)`; every carrier value lerped onto the plate's) and draws the plate for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: push in, tear, lift off; never a dissolve.
  Its first own frame must equal the plate (same objects, same camera), only then move. Helpers: `seamWindow(t, T0)`, `SEAM_HALF`.

| Seam | T0 (anchor) | Plate | Hand-over | Take-over |
|---|---|---|---|---|
| **Lead → B1** | `T.G('So what bent the first line')` (41.58) | `plateLines`: THE TWO LINES wide. `chart1960` with `LINES_PLATE.st` at `LINES_PLATE.cam` (`aim(ZS, 1900, −110, .54)`), sheet `LINES_PLATE.sheet` (lamp dimmed .32, cool spill), you at the knee (`youAtKnee`) | done (sc01) | 2.01: push from the plate into the knee (`KNEE`); the question card drops in on its pin beside it on **bent the first line** |
| **B1 → B2** | `T.G('A date sounds precise')` (202.68) | `plateSlip`: the calendar slip close (`SLIP_PLATE`: pin (2610, −1150), w 190, face `FRI ?` with a cool ?), cool spill | 5.04: pull back out of the C3 frame onto the slip | 6.01: the ? page tears off on **precise** (`slip(…, { tear, under })`): FRI 13 NOV 2026, then pull back |
| **B2 → B3** | `T.G('Right now, though')` (334.16) | `plateWheel`: the empty steering wheel close (`WHEEL_PLATE`: (960, 1900), r 330, lifted .7) in a big gold light | 8.04: fly through the doorway light; the light resolves into the wheel | 9.01: pull back: the wheel is huge, in a quiet room, a few hands on its rim |

Seams inside your group (chunk to chunk) you build yourself on the same principle (simplest: one shared state function in your own
`lib/f19_bN_*.mjs` that both chunks call with the same `t`).

## 3 · Hard rules for the picture
- **Channel look first:** Editorial Night (indigo night, gold light, one light form per picture, much empty dark, grain). This film's own
  motif is THE SHEET (the 1960 Science page as a light map). Gold ink = people (the first line), cool cyan light = the machine.
- **One world: THE SHEET.** Explainers are light and ink on the sheet; scenes are layers lifted off it (`lifted`). Travel on the sheet
  instead of cutting; ≤ ~1 hard world change per minute (only where `shots.md` lists one).
- **Real explainer graphics from sheet things**, readable without sound, one statement, ≤ 1 number and ≤ 6 words plus source. No panels,
  no frames, no legends. Only numbers from the fact check; follow faktencheck §5 (`Source: METR · as of May 2026`, `≥ 16 h`,
  2021–2032 span, ≈ 8.3 BILLION, the 1960 subtitle with the ringed IF and **no 1962 page**).
- **Every transition carries an object into the next.** No cross-fades, nothing fades in half-transparent from nowhere.
- **Calm:** slow camera moves on word keys, 1–2 moving main elements at once, never a still image > 2 s, 1.5–3 s hold after accents.
- **You** (`you()`, tiny, faceless, yellow raincoat) is the viewer: small gestures (look up, step, take) on the words that concern you.
  Others are indigo silhouettes (`other()`). No faces. **No generated real people:** von Foerster only as a silhouette, his signature
  or his real clip; Beth Barnes and the C3 researchers only in their real clips.
- **Clips:** each plays in a frame the animation leads into and out of (`screen()`), with `lowerThird()` (name · role · year · ORIGINAL
  FOOTAGE). Until the frames exist, `screen()` shows a placeholder card; C3 stays a placeholder frame for now. `[prüfen]` marks in
  `CLIPS19` must not reach the final render (the lead fills them in).
- **No doom:** no red alarm, no explosions, no ruins. The light warms toward c11.
- **End screen 468.10–483.10, 15 s** (B3, 11.08): free areas left (x 90–780, y 250–700), right (x 1140–1830, y 250–700), centre (x 810–1110, y 330–600);
  picture and music keep running.

## 4 · What you may touch and what not
- **Only your files:** B1 `scenes/sc02.mjs` … `sc05.mjs`; B2 `scenes/sc06.mjs` … `sc08.mjs`; B3 `scenes/sc09.mjs` … `sc11.mjs`;
  plus your own modules `lib/f19_b1_*.mjs`, `lib/f19_b2_*.mjs` or `lib/f19_b3_*.mjs`.
- **Forbidden:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f19_kit.mjs`, `lib/f19_seams.mjs`, `lib/kit.mjs`,
  `lib/stub.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `scenes/sc01.mjs`, the other builders' files,
  and anything under `/mnt/project-files/scenario/film-singularity-friday/audio/` (the audio agent).
- **Kit missing something or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT19 }`; `R = { a, b }` is
  the chunk range. One entry per chunk (plan sequence); a second entry is a hard cut, allowed only where `shots.md` names a match move.
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset`.

## 5 · Kit state (after c01)
- `f19_kit` (signatures in the comments): `PAL` (Editorial Night, see `MOTION.md` §4; `red0/1/2` = the gold first-line ink),
  `PRINT19 = { grain 14, floor 4, vig .55, vcol #05071a }`, `ZS` (= F0, the sheet depth), `LIFT` 240, `sheet(ctx, c, t, { lamp, lampR, dim, cool })`,
  `onSheet`, `lifted(ctx, c, lift, fn)`, `paperCut`, `ink`, `lightLine`, `partial`, the chart (`CH`, `yearX`, `popY`, `fPop`, `realPop`,
  `formulaPts`, `curvePts`, `KNEE`, `axes`, `AI`, `aiPts`), `label`, `infinity`, `strike`, `ring`, `people`, `slip`, `qcard`, `loopWheel`,
  `stopwatch`, `hourglass`, `wheel`, `CLIPS19`, `clipSlot`, `screen`, `lowerThird`, `you`, `other`, `MAST`, `SLIP`, `chart1960` (new:
  `st.sub` subtitle, `st.ifR` ring round IF), `bump`, plus `rise`, `blink`, `maskLine`, `measure`, `trailSpan`, `along`.
- c01's set: the chart from x 160 (1800) to 1633 (2026), baseline y 960; the knee at 1997 (≈ (1444, 620)); the slip pin (1640, −1000);
  ∞ beside it; the AI field x 1960–2700; you h 110 at the knee. `loopWheel`, `stopwatch`, `hourglass`, `qcard` were recoloured for the
  night but not yet used in a shot: check them in your first stills and send kit wishes.
- **Luma:** the night sheet sits around calm.py luma 55–60 on the c01 frames; keep 35–65, the hero light the brightest thing.
- **Memory:** no canvas, no pattern per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas`.

## 6 · Rendering (shared machine)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f19/bN/`. Nothing big into `/mnt/project-files`.

Review stills (small): `cd /home/user/scenario/films/19-friday && SECS=c06 node render.mjs --snap 203,204.5,206 --dir $SP/f19/b2/snap --scale .4`
then build a contact sheet and **look at it**.

Video (full quality): pieces ≤ 20 s, always `--expose-gc`, never more than one render per builder at a time:
```
SECS=c06 node --expose-gc render.mjs --out $SP/f19/b2/c06_a.mp4 --from 202.68 --to 222
SECS=c06 node --expose-gc render.mjs --out $SP/f19/b2/c06_b.mp4 --from 222 --to 242
```
Join with `ffmpeg -f concat -safe 0 -i list.txt -c copy $SP/f19/bN/cNN.mp4`.

Delivery per chunk: the video `$SP/f19/bN/cNN.mp4` (path into the report) and a contact sheet (1 frame/s, small jpg ≤ 1 MB)
`/mnt/project-files/scenario/film-singularity-friday/bild/cNN_kontakt.jpg` (read it back after ~10 s).

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition), everything ugly or unclear fixed; ≥ 3 review rounds.
   Every frame a poster; sentence = picture; the hero the brightest thing; you never cut off except in a deliberate move; text readable on a phone.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned match moves); mafd median ≤ ~0.45 (report it if higher); luma 35–65.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 LURCH/POP**. Note: in near-still holds the 10-Hz grain step shows as a POP of
   ≈ 1.6; the cure is a real breathing move (a push of ≥ 5 % over the hold), not less grain.
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags; at the group seams also against the plate.
5. **Calm rules** (`MOTION.md` §5) and the self-grade 1–5 (`MOTION.md` §10). Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Open points and deviations from `shots.md`, with the reason.
- Which files you created or changed (so the lead can commit exactly those).
