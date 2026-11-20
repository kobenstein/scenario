# Film 55 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-17

The picture lead built **c01** as the quality reference: the hook, 0 → `T.G('At the very front stand')` ≈ 0:49.6. The lead also holds the kit, the shot list and the seams. Three builders build the rest **at the same time**, about 3–3.5 minutes of picture each. The upload is **Thu 19.11. 17:00 Vienna**; the film is built through to the end with no interim review.

| builder | chunks | from → to (phrase) | time (provisional, vo-v4) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'At the very front stand' → 'Fourth in line stand' | 0:49.6 – 3:43.9 (174 s) | mark 1 THE LAB · Fermat on the proof tape · ★ YEARS → 11 DAYS → 30 HOURS (calendar sheets, 47 LEMMAS) · proof public · "an internal research model" · the second door ASTRA (with a price tag) · **A1 card** · the clipboard WHO CHECKED IT? SOME, IN PART · price tags NOV 9 → NOV 10 · two ticks (Friar = source line only, **no card**) · ANNOUNCED. NOT AVAILABLE. · the shelf BEST · SAFETY · the code line, APR 7 · MYTHOS over the door · mark 2 government · mark 3 giants · NOT YOU. NOT YET. · 5× price · **C1 card** · two stacks · the line from above → plateFour |
| **B2** | c07 c08 c09 c10 c11 | 'Fourth in line stand' → 'That call was made inside' | 3:43.9 – 6:55.8 (192 s) | mark 4 defenders through the side door · ★ 5,000,000 test runs, one gold beam · 129,000+ VERIFIED · JULY RECORD · found ≠ fixed · **subscribe 1** · mark 5 JUNE 9, the door opens a crack · Fable: the core in your phone (kitchen), HACKING · BIOLOGY to older cores · the black hole page (arc, never a disc) · three phones, three days · the built-in limit · everyone behind you (the tail) · the rival, $4,400 · bought time · the tips at the kitchen table (AUTO-UPDATE ×3, the old router) · the parcel ASTRA 6.1 HELD BACK → plateHeld |
| **B3** | c12 c13 c14 c15 c16 | 'That call was made inside' → end | 6:55.8 – 10:37.3 (221 s, incl. walk + 15 s end screen) | the windowless wall · **C4 card** · WHO GETS TO LOOK IN? · testers through the side door · the clipboard WHO CHECKED IT? · WHAT'S NOT SHOWN? · ★ the tape returns: the hall of 1,000 seats · roughly comparable · HOW MUCH STRONGER? again · 1 · NEWER (doors behind doors) · 2 · BIGGER (about 10,000 dots, OPENAI SAYS) · PERMISSION · POWER · APR → JUNE, the price to a third · A FEW MONTHS · ESTIMATE · the kitchen in another season · frame 0 again, you one place forward · the core sentence · **subscribe 2** · quiet walk · end screen |

**Timing:**
- `film.mjs` loads `<ROOT>audio/timing.json` as soon as the sound agent writes it (ROOT = `/mnt/project-files/scenario/film-geheim-ki/`, `$F55ROOT`). Until then `data/provisional_timing.json` (from **vo-v4.txt**, final) is used with a warning. **The times above will move; your code must not care.**
- **Anchor only on phrases:** `T.G(phrase, nth, after)` / `T.GE(…)`, and `T.clip('A1' | 'C1' | 'C4')` for the clip slots (gaps of 5–8 s in the VO where the clip audio plays). Never seconds.
- Repeated sentences: "This channel exists" twice (M.01, A.01 = nth 1); "how much stronger" twice; "Who checked it from outside" twice. Search after a fence: `T.G(p, 0, after)`.
- The sound agent works in `<ROOT>audio/` and `films/55-locked/audio/`. **Do not touch either, never stage them.**

## 0 · Mandatory before the first line of code
1. **Load the skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. (Where scenario-motion's three.js/Hyperframes tooling differs, this film's canvas pipeline wins; its rules for look, calm and causality hold.)
2. **Read the memory files** in `/tmp/claude/memory/team/silo/` if present (scenario-animation-standard, scenario-produktion-regeln, scenario-build-workflow, scenario-regel-szene-erklaergrafik, scenario-stil-editorial-nacht, scenario-build-durchziehen).
3. **Read the plan:** `docs/MOTION.md` (whole) · `docs/shots.md` (your shots; **binding**: one motif per sentence, the carrier column is the handover; §5 holds the only on-screen strings) · the headers of `lib/f55_kit.mjs` and `lib/f55_seams.mjs`.
4. **Watch c01:** `<ROOT>bild/c01_kontakt.jpg`. `scenes/sc01.mjs` is the reference: an anchor table `a = {}` from phrases; world cameras built with `S.look`; ONE `S.camPath` with `S.drift` that dies before the seam; portals out of the phone and the gap; text in screen space with `maskLine`; the exact plate for the last 0.5 s.
5. **Look at the kit sheet:** `<ROOT>bild/kit55_kontakt.jpg`, or render your own: `node tools/kit_sheet55.mjs $SP/f55/kit [--only door,plate]`.
6. **Facts:** every on-screen number against `<ROOT>faktenzettel.md`, `<ROOT>faktencheck.md` (must-changes 1–11) and `vo-v4.txt`. Use `F.SOURCES` / `F.QUOTES` (already corrected). If anything disagrees, the fact sheet wins; note it in your report.

## 1 · The seams between the groups (fixed, `lib/f55_seams.mjs`)
A plate is the exact picture at a group boundary T0. The handing side steers its camera onto the plate's camera and draws `S.plateX(ctx, t, T)` for `[T0 − .5, T0)`; the receiving side draws the same plate for `[T0, T0 + .5)` and grows out of it. Plates creep (`S.creep`: 3 %/s push, `S.TRUCK` 24 px/s) with **no drift**: let your drift die before (sc01 `dA`), and for the receiver continue the creep, e.g. `S.look(...P0 with mag × k)`.
- **Lead → B1** at `'At the very front stand'`: `S.plateLine` (`S.LINE_CAM`, `S.LINE_ST`: the whole line from a raised camera behind you; all marks lit; you look up .85). B1 1.01 pushes along the line to mark 1.
- **B1 → B2** at `'Fourth in line stand'`: `S.plateFour` (`S.FOUR_CAM`, `S.FOUR_ST`: mark 4 lit, the others .3, the defenders look up .35). B1 2.09 comes down from the top-down diagram onto it; B2 3.01 opens the side door.
- **B2 → B3** at `'That call was made inside'`: `S.plateHeld` (`S.HELD_CAM`, `S.HELD_ST`, the parcel ASTRA 6.1 · HELD BACK via `S.heldParcel`). B2 6.02 rolls the parcel in and stamps it; B3 6.03 tilts up the windowless wall.

Check with `SECS=c06,c07 node tools/seam.mjs --at <T0>` (same for the others). Inner chunk boundaries within a group are one continuous take (same camera path, no plate).

## 2 · Hard rules for the picture
- **One world, one take.** Everything happens on or from THE LINE (`S.lineWorld`). The kitchen (`S.kitchen`), the room behind the door (`S.room`), the hall of seats, the night sky open as **portals** (`F.portal`) out of a thing (phone screen, gap, window) and close back into it. No W shots, no cuts, no blends; one entry per chunk.
- **The marks and groups** carry the structure: each mark lights on its phrase (`st.mark(i) → { lit }`), its group reacts (`st.person(k, q) → { look, gold }`). Your coat = you on mark 5, always.
- **The proof tape** (`F.proofTape`): rows write themselves, ticks follow in cyan. **Calendar sheets** (`F.calSheet`, `F.calStack`) are the only time device. **Cores** (`F.core`): gold = the machine, `dim` = an older one. **Clipboard** (`F.clipboard`) = the inspector.
- **Quote cards** (`F.quoteCard(ctx, t, T, { id })`) for A1, C1, C4: the clip audio plays in the slot, the words light evenly, the credit sits below. **No footage, no photo, no likeness of any real person, never "ORIGINAL FOOTAGE".** The Friar quote is gone (vo-v4): only the source line `F.SOURCES.friar`.
- **Caveats on screen** are the film's honesty: OWN COUNT, THE LAB'S OWN ACCOUNT, OPENAI SAYS · NOT CONFIRMED, PREPRINTS, NOT PEER-REVIEWED, ESTIMATE. One calm line each (`F.source`, `F.bracket`), never red.
- **Explainers** are made of the world's things (marks, sheets, tape, cores, dots, slabs, tags). ≤ 6 words, at most one number, readable at 390 px, ≥ 1.2 s on screen, **above y 880** (burned-in subtitles).
- **Colour code** (MOTION.md §5): gold = the best AI / the door light; cyan = checked; cream = people's light; yellow coat = only you; **no red**. Gold is painted, never added on blue.
- **Nicht wiederholen** (MOTION.md §3): no vault, keys, magnifier, clock, hand close-up, glowing circle / orb, head, monolith, robots, server racks as a cliché (2.08's racks are small and secondary), no world map with pins (2.02: a plain of small screens).
- **Subscribe** (no buttons, no bells, at most one small line): 1 (B2, M.01) the whole line in the gold light to your coat; 2 (B3, A.01) the final picture runs on, the line moves up. **No QR anywhere.**
- **End screen 15 s** (B3): `S.END_CAM`, `S.END_TILES` (tiles x 100–820 / 1100–1820, y 130–535; subscribe circle 960, 935, r 90). You stand one place forward (`you: { x: S.QUEUE[0].x, z: S.QUEUE[0].z }`, `person: (k) => k === 0 ? { hidden: true } : {}`). No text; the picture breathes.
- **Calm:** at most 1–2 moving elements; the camera follows the carrier; `S.drift` always on (dies only into plates); nothing appears from nowhere.

## 3 · What you may touch and what not
- **Only your files:** B1 `scenes/sc02.mjs` … `sc06.mjs` · B2 `scenes/sc07.mjs` … `sc11.mjs` · B3 `scenes/sc12.mjs` … `sc16.mjs`, plus your own modules `lib/f55_b1_*.mjs` / `lib/f55_b2_*.mjs` / `lib/f55_b3_*.mjs` (shared camera and state across your chunks).
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f55_kit.mjs`, `lib/f55_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `audio/`, `scenes/sc01.mjs`, the other builders' files. Kit gaps: solve them in your module, report as kit wishes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT55 }]`. Draw the whole chunk `[R.a, R.b)`. Boundaries inside your group must match frame for frame.
- **No commit, no push**, no `git add -A`, `git checkout`, `git stash`, `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the headers)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f55_kit.mjs';  import * as S from '../lib/f55_seams.mjs';
S.look(X, Y, Z, mag, sx, sy, hz?) → camera showing world point (X,Y,Z) at screen (sx,sy) · S.camPath(t, [[t, cam], …]) · S.drift(c, t, dist, amt, seed) · S.proj(c, X, Y, Z) → [sx, sy, s]
S.lineWorld(ctx, c, t, { gap, open, sign, signU, carpet, mark(i), person(k, q), you, tail { a, n }, side { open }, sky, city, wall(ctx, k), floor(ctx), extra(ctx) })
S.LINE (door, wall, side, you, head, marks) · S.QUEUE · S.TAIL · S.linePt(p) · S.markPt(i) · S.at(ctx, c, X, Z, fn, Y) · S.doorRect / gapRect / sideRect(c) · S.HOME
S.kitchen(ctx, t, w, h, { lamp, you, phone { lit, screen, core }, letter, window { season }, devices { laptop, router, old }, zoom, extra }) · S.room(ctx, t, w, h, { core, people, tables, glow }) · S.parcel
S.plateLine / plateFour / plateHeld (ctx, t, T) · S.LINE_CAM / FOUR_CAM / HELD_CAM · S.creep · S.SEAM_HALF · S.END_CAM · S.END_TILES · S.motes
F.door · F.floorMark · F.queuer · F.crowd · F.phone · F.core · F.proofTape · F.calSheet · F.calStack · F.clipboard · F.checkMark · F.crossMark · F.codeWall · F.docSheet · F.priceTag · F.tag
F.dotField · F.ruler · F.slab · F.slabBars · F.bracket · F.label · F.questionMark · F.thesis · F.accentText · F.source(ctx, t, t0, t1, F.SOURCES.x) · F.quoteCard · F.QUOTES
F.portal(ctx, fromRect, toRect, m, inside(ctx, w, h, m), { rim, r }) · F.veil · F.screenFloat · F.paper · F.maskLine · F.rise · F.bump · E.du (you) · F.PRINT55 · F.GOLD / CHECK / LAMP / INK
```

## 5 · Rendering (shared cores)
`SP` = your scratchpad. Work in `$SP/f55/bN/`.
- **Stills:** `cd /home/user/scenario/films/55-locked && SECS=c03 node render.mjs --snap 90,94,98 --dir $SP/f55/b1/snap --scale .4`
- **Video:** pieces ≤ 20 s, always `--expose-gc`, at most one render per builder at a time (~220 ms/frame at `--scale .5`): `SECS=c03 node --expose-gc render.mjs --out $SP/f55/b1/c03_a.mp4 --from 85 --to 105 --scale .5`. Join with `ffmpeg -f concat -c copy`.
- **Delivery per chunk:** the video at `$SP/f55/bN/cNN.mp4`; a contact sheet (1 frame per 1–1.5 s, small jpg ≤ 1 MB) at `/mnt/project-files/scenario/film-geheim-ki/bild/cNN_kontakt.jpg`.
- Final 1080p chunks: `python3 tools/f55_film.py render` on the real timing, then `assemble` (no QR). **No video or audio in the repo.** Only small jpgs on the network drive.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, ≥ 3 review rounds: poster quality · sentence = picture · gold brightest only at the door / a core · figures alive · text readable, ≥ 1.2 s, above y 880.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: no cuts; luma 40–60; static share target < 10 % (c01, see README); report the mafd median.
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`: 0 LURCH; a POP only at a seam frame you can name.
4. **seam.mjs** at your group seams and every inner boundary: no flags.
5. **Calm rules** (MOTION.md §6) checked.
6. **Self-grade 1–5:** poster · sentence = picture · seamless · calm · alive · explainers made of the world's things · text · facts = fact sheet. Nothing under 4.

## 7 · Report (short, English)
Chunks finished with paths to videos and contact sheets · numbers per chunk (calm, smooth, seam) · kit wishes · deviations from shots.md with the reason · fact-check notes · the exact list of files you created or changed.
