# Film 25 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-10

The picture lead built **c01** as the quality reference: the hook, from 0 to `T.G('Ten kinds of work')` ≈ 78.3 s. The lead also holds the kit, the shot list and the seams. The rest is built by **three builders at the same time**, each covering about 3 to 3.5 minutes of picture:

| builder | chunks | from → to (phrase) | ≈ time (provisional) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 | 'Ten kinds of work' → "So here's the puzzle" | 1:18 – 4:20 (182 s) | rank row + rail, No. 10 junior desk + K1, seniors/juniors, J2, No. 9 Microsoft slabs + empty voice booth, No. 8 COULD/DID grid + Challenger, No. 7 studio J3/J3b |
| **B2** | c05 c06 c07 | "So here's the puzzle" → 'Number two' | 4:20 – 7:34 (194 s) | radiology lightbox, Hinton card, record line, radiologist + surgeon, **the tasks turn on the row (★)**, J4, subscribe 1 (ridge), No. 6 agents + Amodei card, No. 5 teacher, No. 4 doctor, No. 3 basement vs factory + K2 |
| **B3** | c08 c09 c10 c11 | 'Number two' → end | 7:34 – 11:17 (223 s, of which 12 s K3 and 15 s end screen) | No. 2 nurse, J5 conducting, 14 days vs 1, No. 1 + chess, five skills + K3, ending row, J6, subscribe 2, end screen |

**Timing:**
- Until the audio agent writes `<ROOT>audio/timing.json`, the engine uses `data/provisional_timing.json`. That file is built from **vo-v4.txt** (the fact-checked text) with the real O-ton lengths and clip lengths K1 13.2 s, K2 9.7 s, K3 12 s.
- When the real VO arrives, the seconds move. **Anchor only on phrases**: `T.G(phrase, nth, after)` / `T.GE(…)`, and use `T.clip('J3')` for slots. Never use seconds or segment ids.
- Repeated sentences: "Every time the machine took a step" occurs twice (c05 5.13, c11 = nth 1); "This channel exists" occurs twice; "Number three" is found again in "Number three holds for years". Search after a fence: `T.G(p, 0, after)`.
- `ROOT` = `/mnt/project-files/scenario/film-last-human-job/` (`$F25ROOT`). The audio agent works in `<ROOT>audio/` and in `films/25-last-job/audio/`. **Do not touch either.**

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`

   Outdated in them: Hyperframes and three.js. We draw with our own engine in Canvas 2D: 2.5D depth cards `E.cam3`, `E.card`, `E.aim`, `F.camPath`.
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md`: world, **§3 Nicht wiederholen**, colour code, calm rules
   3. `docs/shots.md`: your shots (phrase anchors, layers, carriers, W). It is binding. §5 lists the only on-screen strings.
   4. the header of `lib/f25_kit.mjs` (API) and `lib/f25_seams.mjs`
   5. `<ROOT>vo-v4.txt` (your lines), `<ROOT>zitatkarten.md` (the exact wording of every card, source line and credit), and the picture notes for your part in `<ROOT>text-v3.md` (the text there is outdated; vo-v4 counts)
3. **Look at** the reference:
   - `<ROOT>bild/c01_kontakt.jpg`
   - the code `scenes/sc01.mjs`
   - the kit stills: `node tools/kit_sheet25.mjs $SP/f25/bN/kit`

   What to take from it:
   - **One plan sequence per chunk** (one entry).
   - Camera with `F.camPath(t, [[t, E.aim(F0, u, v, s)], …])`, which glides through its keys, plus `E.camDrift`.
   - `E.camAt` with `'i'`/`'o'` only for dives into a light.
   - The light door: `E.lightFlood(ctx, a)`, with the ramp `E.smooth(span(t, tp − 1.4, tp))` before the peak and `1 − E.smooth(span(t, tp, tp + 1.4))` after (faster ramps fail smooth.py). The camera dives into a warm light on one side and comes out of the matching light on the other.
   - Everything comes from somewhere: the bead drops from the sky, glyphs light on their words, the chart grows out of the desk icon, beads lift off fallen stones.

`/mnt/project-files` is a network mount and almost full. Use exact paths with a trailing slash, never search the whole folder, and put only small jpg contact sheets there. Renders stay in your own scratchpad.

**Fact-check notes (vo-v4, zitatkarten.md), binding for the picture:**
- **Amodei:** the card has **no quote marks** (a paraphrase, Axios, May 2025): `F.QUOTES.amodei`.
- **Hinton 2016:** "People should stop training radiologists now." (`F.QUOTES.hinton`, TORONTO, 2016).
- **Radiology:** RECORD: 1,241 RADIOLOGY RESIDENCY SPOTS · US MATCH 2026. The VO now says "this year". The curve is schematic; only the record point is sourced.
- **Turn sentence:** "The machine took over part of the reading." Only the scan stone falls.
- **Clip lead-ins:** each clip is introduced by a spoken lead-in sentence (K1 "The economist who measured it…", K2 "Even the man who warned the radiologists…", K3 "Even Bill Gates calls this a turbulent era…"). The clip plate grows during that sentence.
- **After K2:** "Notice the catch. A long time. Not forever. Number three holds for years."
- **Chess:** "About ten million people play online every single day": ≈10 MILLION.
- **Stanford:** 19 % is a relative gap, so the label says BEHIND, not "lost".
- **Credits** (name, role, year, ORIGINAL FOOTAGE): `F.CLIPS`. **Source lines:** `F.SOURCES`.

## 1 · The seams between the groups (fixed, defined by the lead)
A plate is the exact picture at a group boundary. The handing side steers its last move so that its frame converges onto the plate, then draws the plate for `[T0 − .5, T0)`. The receiving side draws the same plate for `[T0, T0 + .5)` and grows its world out of it. Plates creep (4 %/s push plus 30 px/s truck, `S.CREEP`, `S.TRUCK`); continue both.
- **Lead → B1** at `T.G('Ten kinds of work')`: `S.plateJakobRow`, camera `S.JR_CAM` in row-world coordinates. B1 (2.01) rises out of it to the RANK ROW (`S.rankRow`, `S.RANKROW`, `S.RR_CAM`), and the rank rail is born.
- **B1 → B2** at `T.G("So here's the puzzle")`: `S.plateStudio` (`S.STUDIO_AFTER_J3B`: lanes MUSIC…SHOOT taken, Jakob on ledge 1, lamp .35). B1 (4.05) settles on it; B2 (5.01) pushes on Jakob.
- **B2 → B3** at `T.G('Number two')`: `S.plateRankRow` (No. 10–4 flat, No. 3 trembles, the rail at No. 3). B2 (7.15) settles on it; B3 (8.01) tips No. 2 a little.

Check with `SECS=c01,c02 node tools/seam.mjs --at <T0>`. Inner boundaries within a group are one continuous take.

## 2 · Hard rules for the picture
- **The row is an anchor, not wallpaper.**
  - ROW1/ROW2 (`S.rowWorld`) appear only where shots.md says ROW.
  - The rank row carries the countdown; the rank rail (`F.rankRail(ctx, t, T)`, screen space) runs from 2.01 to the end of c09.
  - **No clock**, no dial, no countdown digits.
- **Explainers** are made of film things: slabs, mini stones, light lines, serif numbers, cards. Each makes one statement, with at most one number and ≤ 6 words. No chart panels with legends.
- **Colour code** (MOTION.md §5):
  - amber = people / what stays;
  - cool = machine / taken;
  - yellow coat = only you;
  - Jakob = indigo with headphones;
  - agents = cool beads (`F.agent`), never robots.
- **Scenes** open as a lit window in a stone face, lamp or lightbox (camera flight in ≥ 2.5 s, out again). Each scene has one warm light, and its figures breathe.
- **Hard world changes only at the W shots** (light doors). Budget ~1 per minute for the whole film: B1 has 3, B2 has 3, B3 has 2.
- **Nicht wiederholen** (MOTION.md §3): no clock, hourglass, rack, dish, fire circle, map with pins or iris medallions, generations table, running track, monolith, staircase of light, red-line curve.
- **Clips (K1 c02, K2 c07, K3 c10):** `F.clipPlate(ctx, t, T, id, { from, morph })` grows from a thing in the scene (a door frame, the torch circle, a stone face) during the lead-in sentence. Hold still under the clip, then shrink back. If K3 is dropped, use the `F.QUOTES.gates` card at the same slot.
- **Studio:** `F.studio(ctx, c, t, s)` with `taken`, `part`, `level`, `conduct`, `beads`, `lampA`, `lit`, `hand`, `playhead`, `ruler`. Jakob's levels:

  | slot | state |
  |---|---|
  | J2 | 0, `part[2]` ≈ .3 |
  | after "Images. Music. Sound. Whole shots. Even the edit." | lanes 2, 0, 1, 4 taken on their words; EDIT (3) half |
  | J3 | climb to 1 |
  | J3b | EDIT taken |
  | J4 | STORYBOARD (5) and SCRIPT (6) taken, climb to 2 |
  | J5 | IDEA (7) taken, level 3, `conduct` 1, camera `F.STUDIO_CAM.top` |
  | J6 | TOPIC warm, his |

  Lower third from J2 on: `F.lowerThird(ctx, t, T, 'J2', { y: 170 })`, small automatically. In the studio it sits top left, because Jakob stands bottom left.
- **Subscribe:**
  - 1 (c06): the night ridge, a line of small people passing one warm lamp along. Text at most one small line.
  - 2 (c11): the final row with tiny lamps on the horizon.
  - No buttons, no bells.
- **End screen 15 s** (c11): the final row at rest. Keep the right two thirds (x 700–1830, y 120–860) a quiet dark wall. The picture and grain keep running.
- **Subtitles** own y > 910.

## 3 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc04.mjs`
  - B2: `scenes/sc05.mjs` … `sc07.mjs`
  - B3: `scenes/sc08.mjs` … `sc11.mjs`
  - plus your own modules `lib/f25_b1_*.mjs`, `lib/f25_b2_*.mjs` or `lib/f25_b3_*.mjs`
- **Do not change:**
  - libraries: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f25_kit.mjs`, `lib/f25_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`
  - engine: `film.mjs`, `engine.mjs`, `render.mjs`
  - folders: `tools/`, `docs/`, `data/`, `audio/`
  - `scenes/sc01.mjs` and the other builders' files
- **Kit gaps or bugs:** solve them in your own module and report them as kit wishes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT25 }]`. One entry per chunk. A second entry is a hard cut, allowed only at a W shot.
- **No commit, no push**, no `git checkout`, `git stash` or `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the header of lib/f25_kit.mjs)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f25_kit.mjs';  import * as S from '../lib/f25_seams.mjs';
F.camPath(t, [[t, E.aim(F.F0, u, v, s)], …])      camera through keys · E.camDrift(c, t, amt, seed) · E.camAt for dives · E.lightFlood
S.rowWorld(ctx, c, t, { rows, a1, a2, cool1, cool2, lit1, lit2, du, jakob })   ROW1 / ROW2 (S.JR_DX right) on the night plain
S.rankRow(ctx, c, t, { fall: (n) => angle, num, gold }) · S.RANKROW · S.rankLie(n) · S.RR_CAM
F.row(o) · F.cascade(t, row, t0, { stopAt, tau, nudge }) → { a, start, hit } · F.drawRow(ctx, c, t, row, angles, { each })
F.stone(ctx, t, x, y, h, { w, fall, glyph, glyphWarm, gold, num, dark, face }) · F.glyph(ctx, name, x, y, s, { lit, col })  (F.GLYPHS)
F.agent(ctx, t, x, y, r, { ring, think }) · F.coolPath(ctx, pts, u0, u1, w, a)
F.studio(ctx, c, t, s) · F.STUDIO · F.STUDIO_CAM · F.LANES · F.jakobPos(level) · F.jakob(ctx, t, x, y, h, o) · F.lowerThird(ctx, t, T, id)
F.rankRail(ctx, t, T) · F.rankTitle(ctx, t, x, y, n, sub, u) · F.RANKS · F.rankAt(T, n)
F.chartLines · F.slab / F.slabBars · F.stoneGrid({ could, fall, gold }) · F.dayTiles · F.bracket · F.label · F.source(ctx, t, t0, t1, F.SOURCES.x)
F.QUOTES.{amodei, hinton, gates} + F.quote (f16) · F.clipPlate(ctx, t, T, id, { from, morph }) · F.CLIPS · F.title · F.sky / F.plain / F.pool
E.du (you, yellow coat) · E.person · F.PRINT25
```

## 5 · Rendering (4 cores, shared by all three)
`SP` is your own scratchpad (from your system prompt). Work in `$SP/f25/bN/`.

**Review stills:**
```
cd /home/user/scenario/films/25-last-job
SECS=c05 node render.mjs --snap 262,266,270 --dir $SP/f25/b2/snap --scale .4
```

**Video:**
- Pieces ≤ 20 s, always with `--expose-gc`.
- At most one render per builder at a time (~160 ms/frame).
- `--scale .5` for review renders.
```
SECS=c05 node --expose-gc render.mjs --out $SP/f25/b2/c05_a.mp4 --from 257.8 --to 277 --scale .5
```
- Join the pieces with `ffmpeg -f concat -c copy`.

**Delivery per chunk:**
- the video at `$SP/f25/bN/cNN.mp4` (half resolution is fine for review);
- a contact sheet (1 frame/s, small jpg, ≤ 1 MB) at `/mnt/project-files/scenario/film-last-human-job/bild/cNN_kontakt.jpg`.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, at least 3 review rounds. Check:
   - poster quality;
   - sentence = picture;
   - the hero light is the brightest thing;
   - figures are alive;
   - text is readable at 390 px width.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`.
   - Cuts only at W shots (a light door can register as one cut).
   - Static share < 5 %; luma 40–60.
   - Report the mafd median.
   - c01 is the bar (see README).
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`. **0 LURCH/POP**, including around the light doors.
4. **seam.mjs:** `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every boundary and render seam: no flags.
5. **Calm rules** (MOTION.md §6), checked.
6. **Self-grade 1–5** on: poster · sentence = picture · seamless · calm · alive · explainers made of film things · text. Nothing under 4.

## 7 · Report (short, English)
- Chunks finished, with paths to the videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Deviations from shots.md, with the reason.
- The exact list of files you created or changed.
