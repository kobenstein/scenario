# Film 54 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-12

The picture lead built **c01** as the quality reference: the hook, from 0 to `T.G("He didn't invent it")` ≈ 1:11.9. The lead also holds the kit, the shot list and the seams. Three builders build the rest **at the same time**, about 3 minutes of picture each. The upload is **Mon 16.11. 17:00 Vienna**, and the film is built through to the end with no interim review.

| builder | chunks | from → to (phrase) | time (provisional) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | "He didn't invent it" → 'The third disease answers fast' | 1:11.9 – 4:14.1 (182 s) | the essay and the two trial lanes · **C3** (kiosk, Dwarkesh) · THE BOARD appears · CANCER: the lab in vitrine 1 (MB1!), scans, larotrectinib, 100+ types, the small print · ✓ · HEART: the infusion, LDL halved, 15 years, the stadium · ½ · **subscribe 1** (the lit doorway, QR window 1) → plateMind |
| **B2** | c06 c07 c08 c09 | 'The third disease answers fast' → 'He even warned of a jam' | 4:14.1 – 7:13.5 (179 s) | MIND: the sugar pill, 38 of 74, no blood test, the essay · ? · ALZHEIMER'S: 20 years early, the failed trial, "difficult to reverse" · ✗ · the blood test · why a date? · **C5** (audio post, Venki, audio only) · ★ THE GLASS PIPELINE · Topol / Amodei cards · idea → mouse < 18 months · the queue → plateKiosk |
| **B3** | c10 c11 c12 c13 | 'He even warned of a jam' → end | 7:13.5 – 10:30.4 (197 s, incl. walk + 15 s end screen) | **C2** (kiosk) · the pipeline jams · PROVEN can move: the study clinic (MB2!), digital twins, the FDA assistant, the heart's follow-up · **C1b** wall text · the second date is set by people · ★ 9:12 the board big, four verdicts · the grandkids at vitrine 4 · EVERY CURE HAS TWO DATES · investors · **subscribe 2** (QR window 2) · quiet walk · end screen |

**Timing:**
- `film.mjs` loads `<ROOT>audio/timing.json` as soon as the sound agent writes it (ROOT = `/mnt/project-files/scenario/film-heilung/`, `$F54ROOT`).
- Until then `data/provisional_timing.json` (from vo-v3.txt) is used and a warning is printed. **The times above will move by a few seconds; your code must not care.**
- **Anchor only on phrases:** `T.G(phrase, nth, after)` / `T.GE(…)`, and `T.clip('C3')` for slots (C3, C5, C2 clips; C1, C1b quote cards). Never seconds.
- Repeated sentences:
  - "This channel exists" occurs twice (M.01 and A.01 = nth 1).
  - "Every cure has two dates" occurs twice (H.08 and 8.04 = nth 1).
  - Search after a fence: `T.G(p, 0, after)`.
- The sound agent works in `<ROOT>audio/` and in `films/54-cures/audio/`. **Do not touch either, and never stage them.**

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them:
   - `anthropic-skills:scenario-motion`
   - `anthropic-skills:world-class-motion-design`
   - `anthropic-skills:fluid-motion-design`
   - `anthropic-skills:motion-director-gates`
2. **Read the memory files** in `/tmp/claude/memory/team/silo/`:
   - `scenario-animation-standard`
   - `scenario-produktion-regeln`
   - `scenario-build-workflow`
   - `scenario-regel-szene-erklaergrafik`
   - `scenario-stil-editorial-nacht`
   - `scenario-film-dario-heilung`
   - `scenario-build-durchziehen`
3. **Read the plan:**
   - `docs/MOTION.md` (whole: the hall, the two dates, the board, Nicht wiederholen, the QR corner, the end screen)
   - `docs/shots.md` (your shots; **binding**: one motif per sentence, the carrier column is the handover; §5 holds the only on-screen strings)
   - the headers of `lib/f54_kit.mjs` and `lib/f54_seams.mjs`
4. **Watch c01:** contact sheet `<ROOT>bild/c01_kontakt.jpg`. `scenes/sc01.mjs` is the reference for structure and quality:
   - an anchor table `a = {}` built from phrases;
   - ONE camera path (`F.camPath`) with drift;
   - cards that fall and fly with the camera;
   - the label clones;
   - the creep into the plate at the end.
5. **Look at the kit sheet:** `<ROOT>bild/kit54_kontakt.jpg`, or render your own with `node tools/kit_sheet54.mjs $SP/f54/kit`. It has stills of:
   - the hall, vitrines, specimens and the diorama;
   - the two dates, the board, the wall text, the roadshow frame and the essay;
   - the explainers and the pipeline;
   - the clips C3, C2 and C5;
   - the three plates and the end screen.
6. **Fact check overrides:** check every on-screen number against `<ROOT>faktenzettel.md`, `<ROOT>faktencheck.md` and `vo-v3.txt`. If they disagree, the fact sheet wins; note it in your report.
   - **MB1 (B1, 2.06):** ONE AI-PROPOSED DESIGN · ≈ 10× MORE RECEPTORS ON THE CELLS · LAB TESTS ONLY · GENERATE BIOMEDICINES / ANTHROPIC, OCT 2026. The 70 % was draft length, not time: **no speed motif**, never "70 % SHORTER".
   - **MB2 (B3, 7.04):** WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST.

## 1 · The seams between the groups (fixed, `lib/f54_seams.mjs`)
A plate is the exact picture at a group boundary T0.
- The handing side steers its last move so its frame converges onto the plate, then draws the plate for `[T0 − .5, T0)`.
- The receiving side draws the same plate for `[T0, T0 + .5)` and grows its world out of it.
- Plates creep at 4 %/s push plus 30 px/s truck (`S.creep`, `S.CREEP`, `S.TRUCK`). Continue both, as `plateRoadshow` does: `E.aim(F0, u + tr(k), v, s * k)` with `k = S.creep(t, T, phrase)`. sc01's `creepCam` shows how to start the creep 2.5 s early so the arrival glides.

The seams:
- **Lead → B1** at `T.G("He didn't invent it")`: `S.plateRoadshow` (camera `S.RS_CAM`). The wall panel with the roadshow frame (left), the lectern with the closed essay under its cream lamp (right). B1 (1.01) glides right to the lectern; the essay opens.
- **B1 → B2** at `T.G('The third disease answers fast')`: `S.plateMind` (camera `S.MIND_CAM`). Vitrine 3, plaque MENTAL ILLNESS, V4 dim at the right edge, the board top left (CANCER ✓, HEART ½). B1 (M.02) drifts from the doorway onto it. B2 (4.01) lights the MIND row and pushes into vitrine 3. **QR window 1 is running here: the top-right corner stays quiet on both sides.**
- **B2 → B3** at `T.G('He even warned of a jam')`: `S.plateKiosk` (camera `S.KIOSK_CAM`). The media kiosk with a dark screen and a play mark, the bench, the audio post at the right, the board with all four verdicts. B2 (6.10) lets the queue run past the kiosk and settles. B3 (6.11) wakes the screen and pushes in → C2.

Check with `SECS=c05,c06 node tools/seam.mjs --at <T0>` (and the same for the other seams). Inner chunk boundaries within a group are one continuous take: the same hall and camera continue, with no plate.

## 2 · Hard rules for the picture
- **One hall, one take.**
  - Everything happens in or from THE HALL OF RELICS (`S.hallWorld`).
  - Rooms (the lab, the clinic, the waiting room, the stadium, the study clinic, the FDA desk, the parliament hall) are entered **through glass**: a vitrine, a diorama, the doorway, a screen. Push in for ≥ 2.5 s, and come back out the same way.
  - **There are no W shots**: no light doors, no cuts, no `lightFlood` world swaps. A scene file returns **one entry per chunk**.
- **The two dates** (`F.twoDates`) are the through-line.
  - Every disease gets its label: FOUND (mint stamp) and PROVEN (empty, blinking, or stamped).
  - The wait track says how long proof takes: WEEKS / YEARS / DECADES. Never draw a clock or a calendar for it.
- **The board** (`F.board(ctx, t, T)`) appears on its phrase (2.00, "twenty thirty-six") and is drawn **in every frame from then on** until "Maybe your grandkids will hear". It sits top left in screen space.
  - It lights its rows and verdicts by itself (`F.BOARD`). Never animate them by hand. Pass `{ big }` only at 8.01–8.02 (B3), and `{ from }` only at 2.00 (B1: it grows out of the mint line NOT INSTANT…).
  - When a shot is a full-frame explainer, the board stays: plan your layout around its box (x 70–490, y 52–~250).
- **The machine is a cool spark** (`F.spark`, `F.molecule` in COOL or mint). Never robots, brains as AI, circuit boards or "matrix" code. The brain in vitrine 4 is the disease.
- **Caveats on screen** are the film's honesty. Give each caveat one small calm line (`F.bracket`, `F.source`), never a red warning:
  - "all still in the lab"
  - "most cancer" vs "cancer"
  - "company figure"
  - "experts advise it only in trials"
  - "not investment advice" (c01 has it)
- **Explainers** are made of museum things: labels, plaques, slabs of light, dots, rulers, glass, stamps, small cards. One statement each, with at most one number and ≤ 6 words. No chart panels with legends.
- **Colour code** (MOTION.md §5):
  - mint = the cure, FOUND, ✓
  - cool = the machine
  - cream lamp = people's light
  - cream-grey = a relic
  - yellow coat = only you (`E.du`)
  - everyone else = indigo `E.person`
  - **no red anywhere**
- **Nicht wiederholen** (MOTION.md §3):
  - no clock, hourglass, vintage strip, server rack, dish world, fire circle;
  - no tree with lanterns, lamp rail, piggy bank, avenue of years, domino row, timeline wall;
  - no world map with pins, staircase of light, monolith, red-line curve, robots.
- **Real people:**
  - No photo recreation or likeness of Dario Amodei, Eric Topol or Venki Ramakrishnan. They appear only as their words (wall cards, the wall text, the audio plate) and in the real footage.
  - The stage at 6.01 has a spotlight on a date, no person.
- **Clips:**
  - `F.clipPlate(ctx, t, T, id, { from: S.kioskScreen(), morph })` grows from the kiosk screen during the lead-in sentence, holds under the clip, and shrinks back into the screen. Credits and ORIGINAL FOOTAGE / ORIGINAL AUDIO are automatic.
  - **C5 is audio only**: `from` = the audio post's speaker (`[x, y, r]` from `S.postSpeaker()` projected to the screen). It has no portrait.
  - The frames are in scratchpad `f54/clips/<id>/` (done; `tools/f54_clips.py clips` rebuilds them on new timing). render.mjs loads them for you.
  - C1b (B3) is a **quote card read by the narrator**, in the same wall-text design as C1: `F.wallText(ctx, t, T, { id: 'C1b', … })`. It has no footage.
- **Subscribe** (no buttons, no bells, at most one small line of text):
  - 1 (B1, M.01): the lit doorway in the back wall (`st.door`) opens onto a hospital corridor at night: a warm open door, a bed, someone beside it.
  - 2 (B3, A.01): you walk through the night hall toward the four vitrines.
- **QR corner (both subscribe calls):** during `F.qrWindows(T)` keep **x ≥ 1330, y ≤ 580 quiet**: no text, no moving object, no bright light. Fade it with `F.qrQuiet(T, t)`. Window 1 runs from M.01 into B2's first ~10 s; window 2 from A.01 into the walk. The overlay itself is added at assembly; do not draw it.
- **End screen 15 s** (B3, last 15 s):
  - camera `S.END_CAM`, layout `S.END_TILES`: the four vitrines in a low row, the dark upper wall for the two YouTube tiles (x 100–820 and 1100–1820, y 130–535), the subscribe circle in the warm doorway (960, 620);
  - text-v2: one vitrine holds an old faded exhibit without a plaque, three are empty with soft mint light, and you stop before an empty one;
  - no text, no QR; the picture and grain keep running.
- **Subtitles** are burned in at the bottom (≈ 72 px): **no important text or detail below y 880**. Source lines sit at y ≤ 880.
- **Calm:**
  - at most 1–2 moving elements at a time;
  - the camera follows the carrier;
  - never stillness (`E.camDrift` about 5.5 / magnification; c01's overlay `float`);
  - nothing appears from nowhere.

## 3 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc05.mjs`
  - B2: `scenes/sc06.mjs` … `sc09.mjs`
  - B3: `scenes/sc10.mjs` … `sc13.mjs`
  - plus your own modules `lib/f54_b1_*.mjs`, `lib/f54_b2_*.mjs` or `lib/f54_b3_*.mjs`
- **Do not change:**
  - libraries: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f54_kit.mjs`, `lib/f54_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`
  - engine: `film.mjs`, `engine.mjs`, `render.mjs`
  - folders: `tools/`, `docs/`, `data/`, `audio/`
  - `scenes/sc01.mjs` and the other builders' files
- **Kit gaps or bugs:** solve them in your own module and report them as kit wishes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT54 }]`.
  - Use exactly one entry per chunk; any other `tr` is turned into a cut.
  - Draw the whole chunk `[R.a, R.b)`. Chunk boundaries inside your group must match frame for frame: the last frame of c03 and the first of c04 are the same picture. Share the camera and state through your own module.
- **No commit, no push**, no `git add -A`, `git checkout`, `git stash` or `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the headers)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f54_kit.mjs';  import * as S from '../lib/f54_seams.mjs';
F.camPath(t, [[t, E.aim(E.F0, u, v, s)], …]) · E.camAt(t, [[t0, c0], [t1, c1, 'i'|'o']]) for dives · E.camDrift · E.project(c, Z, u, v) · E.card(ctx, c, Z, fn)
S.hallWorld(ctx, c, t, { moon, door, v(i) → { glow, inside(ctx, w, h), spec }, plaque(i) → { name, q, a }, diorama, frame, panel(ctx), lectern, kiosk, post, kids, du, fg, extra(ctx) })
S.HALL · S.hallX · S.glassOf(i) · S.plaqueOf(i) · S.frameRect() · S.kioskScreen() · S.postSpeaker() · S.dioramaGlass() · S.officeRoom · S.roadshowFrame · S.motes
S.plateRoadshow / plateMind / plateKiosk (ctx, t, T) · S.RS_CAM / MIND_CAM / KIOSK_CAM · S.creep · S.END_CAM · S.END_TILES
F.vitrine · F.specimen(ctx, t, 'cell'|'heart'|'mind'|'brain', x, y, s, o) · F.cell · F.plaque · F.diorama · F.plagueMask · F.wordCard · F.kiosk · F.audioPost · F.lectern · F.essay({ open, lens })
F.twoDates(ctx, t, x, y, s, { name, found, proven, blink, wait, waitTag, split }) · F.stampMark · F.board(ctx, t, T, { big, from }) · F.boardRow(T, k, t) · F.verdictMark
F.wallText(ctx, t, T, { id, x, y, w, size, credit, hi }) · F.QUOTES · F.CREDIT · F.thesis · F.mintText · F.mintSpan · F.source(ctx, t, t0, t1, F.SOURCES.x)
F.molecule · F.spark · F.bloodTube · F.scan · F.pipeline({ x, y, w, h, neck, flow, jam, labels, u }) · F.dotField · F.ruler · F.slab / slabBars · F.bracket · F.label · F.tag · F.questionMark
F.clipPlate(ctx, t, T, id, { from, morph, dark }) · F.CLIPS · F.clipWin · F.QR · F.qrWindows(T) · F.qrQuiet(T, t) · E.du (you) · E.person · F.PRINT54
```

## 5 · Rendering (4 cores, shared by all three)
`SP` is your own scratchpad (from your system prompt). Work in `$SP/f54/bN/`.

**Review stills:**
```
cd /home/user/scenario/films/54-cures
SECS=c03 node render.mjs --snap 120,124,128 --dir $SP/f54/b1/snap --scale .4
```

**Video:**
- Pieces ≤ 20 s, always with `--expose-gc`.
- At most one render per builder at a time (~155 ms/frame at `--scale .5`).
```
SECS=c03 node --expose-gc render.mjs --out $SP/f54/b1/c03_a.mp4 --from 115 --to 135 --scale .5 --preset veryfast
```
- Join the pieces with `ffmpeg -f concat -c copy`.

**Delivery per chunk:**
- the video at `$SP/f54/bN/cNN.mp4`;
- a contact sheet (1 frame per 1–1.5 s, small jpg, ≤ 1 MB) at `/mnt/project-files/scenario/film-heilung/bild/cNN_kontakt.jpg`.

The final 1080p chunks are rendered by `tools/f54_clips.py render` on the real timing. **No video or audio files in the repo.** The network drive is nearly full: only small jpgs go there.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, at least 3 review rounds. Check:
   - poster quality;
   - sentence = picture;
   - mint is the brightest thing only where a cure is found;
   - figures are alive;
   - text is readable at 390 px width, on screen ≥ 1.2 s, and above y 880;
   - the QR corner is quiet in the windows.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`.
   - No cuts.
   - Static share < 5 %; luma 40–60.
   - Report the mafd median. c01: static 1.0 %, mafd median 0.68, luma 48.4.
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`. **0 LURCH/POP.**
4. **seam.mjs** at your group seams, plus every inner chunk boundary of your group: no flags.
5. **Calm rules** (MOTION.md §6), checked.
6. **Self-grade 1–5** on: poster · sentence = picture · seamless · calm · alive · explainers made of museum things · text · facts = fact sheet. Nothing under 4.

## 7 · Report (short, English)
- Chunks finished, with paths to the videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Deviations from shots.md, with the reason.
- Fact-check notes.
- The exact list of files you created or changed.
