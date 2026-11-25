# Film 78 · "What Did Ilya See?" · motion bible (lead, 2026-11-25)

The Good Takeoff · English · 1080p30 · 601.7 s narration + 15 s end screen = 616.68 s (real VO: `<ROOT>audio/timing.json`, clip slots
included; **anchor on phrases only**, never on seconds). Release Wed 2.12.2026, finish quality.
ROOT = `/mnt/project-files/scenario/film-78-ilya/` (`$F78ROOT`). Machine = Film 59/67 (same engine, `lib/f10_editorial.mjs`).
Shot list (binding): `docs/shots.md` (source `tools/shots78.py`) · kit: `lib/f78_kit.mjs` · stage + seams + end screen: `lib/f78_world.mjs`
· quality reference: `scenes/sc01.mjs` · contact sheets `<ROOT>bild/kit78_kontakt.jpg`, `<ROOT>bild/c01_kontakt.jpg` · clips:
`films/78-assets/clips/C1|C2|C3|C5.mp4` (frames via `tools/f78_clips.py clips`). Style: **Editorial-Nacht** (skills scenario-motion,
world-class-motion-design, fluid-motion-design, motion-director-gates: read them before you build).

## 1 · Intent
One line: **The internet asked "what did Ilya see?" and guessed a monster machine. The sworn answer is 52 pages about a man. The other
half of what he saw is every job a person can do, yours included, and he said it openly; his record says take it seriously, his number
is a forecast, and his advice is: watch, and don't look away.**
Mood: calm, curious, clear. The viewer is "you": a tiny faceless figure in a yellow raincoat (`F.du`), the only yellow in the film.

## 2 · Concept: a motion-design film, not one world (Jakob 24.11.)
NO "one world / one big scene with zooms". **One picture per sentence**: every sentence gets the graphic that shows exactly what it says
(`docs/shots.md`, column **zeigt wörtlich**). A zoom is not a new motif. Explainer graphics carry **60–70 % of the picture time**
(shots.md weights EXPL 1 · KARTE 1 · MIX .5 · SZENE 0 · CLIP 0; plan: **68.8 %**). Between the graphics, a few **scene anchors**
(places and people, drawn as flat editorial silhouettes on the night stage) give the eye a rest.
Every graphic stands on the same **night stage** (`S.stage`: indigo night, sparse stars, a low city line far away, a soft horizon glow;
everything else is flat editorial shapes with grain light). The stage never cuts; the graphics transform into each other.
**Max ~1 hard cut per minute** (plan: 0; every row hands over through its carrier; the clip plates grow out of an object and go back).

### The Leitbild (thumbnail C): a man walking away from a tower of light: ONLY 4 anchors
| # | where | phrase | picture |
|---|---|---|---|
| A1 | c01 H.01–H.03 | "What did Ilya see?" … "Then he walked away" | the poster: gold tower of light right, the man at its foot; title WHAT DID / ILYA SEE?; he turns and walks away |
| A2 | c07 6.06 → c08 7.03 | "Six months after that famous Friday" | he walks away from the tower (MAY 14, 2024: he left by his own decision; never "fired", never "forced out") |
| A3 | c10 9.07 (≤ 2.5 s) | "So, what did Ilya see" | the title again over the tower (the question returns, now with the answer beside it) |
| A4 | c10 9.18 → A.01 → E.01 | "Now you are" … end screen | the tower far off, the man small on the line, calm |
Nowhere else (each anchor is ONE continuous window; the rows inside it count as one anchor). No tower as a background "for atmosphere".

### Scene anchors (places, people: the eye rests)
THE CALL GRID (the video call, FRI · NOV 17, 2023) · THE 52 PAGES (the stack, by Ilya Sutskever) · THE LECTERN (he says it openly:
spotlight, sound rings) · TORONTO, the Convocation Hall (C2 grows out of its screen) · THE NEURIPS STAGE (C1) · THE PODCAST TABLE
(C3, C5: two chairs, two mics) · YOU (the yellow raincoat) at your desk / in the grid of jobs.

## 3 · Carriers (the eye is carried across every row; shots.md column "carrier → next")
- **THE 52 PAGES** (c01 → c02 → c03): the stack is the film's evidence. Planted H.13, opened in c02 (pages turn: claims, A SINGLE COLLEAGUE,
  RUSHED, REGRET), closed in c03 (the law-firm report lies on it).
- **THE CALL GRID** (c01 → c03): tiles = people. The boss tile drops out (H.05), slides back (2.03, BACK IN CHARGE, five days later).
- **THE LINE · BEFORE | AFTER** (gold, vertical): planted H.16 ("only half"), it is the MIT quote's line (3.04 ★ "before and after"),
  carries the jobs (AFTER side), returns at 5.14, harvested at 9.14.
- **HIS LIFE LINE** with 4 prediction markers (c05–c07): 1 and 2 fill gold = HELD, 3 and 4 stay cream rings = OPEN, 4 gets the number box
  5–20 YEARS. Deliberately NOT a ladder or rungs (#31 used ladders).
- **THE RECIPE CARD** BIG NETWORK + BIG DATA (c05–c06): stems GPT-1 … ChatGPT grow out of it; the data half drains like a gauge.
- **THE MACHINE RING** (cool light, iris rings): the internet's guess (H.07 ★), crumbles in H.12 ("never about a machine"), returns as
  the machine with a missing segment (5.08), the eager 15-year-old's ring (5.11).
- **THE DAY / DAWN**: ONE DAY rises like a sunrise on the AFTER side (3.14); the solution part (c10) warms toward dawn.
- **YOU** (yellow): H.08, H.18, 3.08, 5.24, M.01, A.01, c10's advice.
Seams between builder groups are **plates** (`S.plateHook`, `S.plateRecord`, see §8).

## 4 · Colour logic (`lib/f78_kit.mjs`)
GOLD = what holds / the hero light (the tower, the pages' title, the LINE, held markers, his life line; ONE hero light per frame) ·
CREAM `#f3efe2` / CREAM2 `#a49fc4` = what is open (open markers, questions, ?, quotes, text) · PAPER = documents (the 52 pages, the
transcript, the law-firm report, quote cards) · COOL = machines, screens, the internet's guess (the ring, the chip, post cards) ·
night blue / INK = the stage · the yellow raincoat = only you. **Never red** (no red X, no red alarm; OPEN is a cream ring).
Type: Inter (labels, caps, spacing .06–.12), Inter Black condensed (the title only), Instrument Serif (quotes, big numbers, names).
Text ≥ 22 px at 1080p, held ≥ 1.5 s, ≤ 6 words per statement + one number (verbatim quotes may be longer).

## 5 · Motion rules (binding)
1. **One picture per sentence** (shots.md is binding: improve the drawing, never drop the idea). The picture lands with the key word
   (± 2 frames); pictures may lead the word by ≤ .3 s.
2. **A carrier at every transition.** An object of row n becomes, opens, splits, or carries row n+1 (morph, fly-into, clone, mask, fold).
3. **Nothing from nowhere, no crossfades, no ghost fades.** Things unfold, fall, pour out, write themselves, rise behind a mask, grow out
   of a window. Alpha only as a quick 0 → 1 in ≤ .3 s together with a geometric move.
4. **Never still.** `S.stage` drifts (stars, horizon glow breathing, city lights), `F.float`, camera creep (`S.view` with `S.camPath2`),
   figures breathe. No two identical consecutive frames.
5. **Speed contrast:** big area changes ≥ 1.8 s sineIO (smooth.py LURCH > 12 flags it); hits (a tile drops, a marker fills) ≤ .3 s on the
   word, then ≥ .8 s quiet. Max 2 hard accents per 30 s.
6. **One ★ per chunk** (shots.md flags). c01's ★ is the cards swirling into the giant machine ring on "The guess" (H.07).
7. **Max 1–2 moving elements at a time**: when a graphic moves, the camera only creeps; when the camera travels, graphics only float.
8. **Clips** in `F.clipPlate` (grows out of an object: a hall screen, a stage screen, a podcast monitor; goes back into it). Lower third
   ABOVE the plate: NAME · PLACE, DATE · ORIGINAL FOOTAGE (`F.CLIPS`, from `audio/clips.json`). Nothing over the bottom 170 px (SRT
   subtitles are burned in later). C4 is a QUOTE CARD (`F.quoteCard`), never footage. The uncut extras (A3/A7/A8/A9) are NOT clips.
9. **People:** only Ilya's real face, only in the clips. Ilya elsewhere = `F.ilya` (plain silhouette, long coat, gold rim; no face).
   The boss = a role ("THE BOSS · HEAD OF OPENAI"), a name at most as text, never a photo or quote. Everyone else: `E.person` silhouettes.
   No colleague name. No logos (names as text only).
10. **Subscribe calls** (M.01 "That is why this channel exists", A.01 the second one): a warm moment around you; no QR, no donation.

## 6 · Frame safety
- Burned-in subtitles take the bottom 170 px: nothing important below y 880; `F.source` sits at y 880 (22 px).
- No AI images, no 3D game look, no stock-AI clichés (no robots, no brains, no matrix code, no circuit boards). The "biological
  computer" is a head profile with a gold node network (not a pink brain); the digital one a chip OUTLINE in cool light.
- End screen (last 15 s, from 601.68): `S.endScreen` / `S.END_TILES`: calm; free areas left (BEST FOR VIEWER, 640×360 at 80, 600),
  right (LATEST UPLOAD, 640×360 at 1200, 600), the subscribe circle centre (960, 900, r 80). Nothing moves fast there; only the stage
  drifts and the man walks very slowly on the line far off.

## 7 · Nicht wiederholen (motifs used by earlier films: do NOT bring them back)
The crystal over a city (#59) · a big clock or clock face (also not for years: use HIS LIFE LINE or a span on an axis) · an hourglass
(#13) · rubber stamps (#59: verdicts are gold caps with an underline, `F.verdict`) · a ladder or rungs (#31: predictions are MARKERS on
his life line) · the bell (#59) · server racks, a satellite dish · a fire circle · a night street of shop windows with price tags (#27) ·
a letterbox (#27) · a great hall (#54) · robots as faces or heroes, a brain · the referee / umpire chair, the checklist of five boxes,
the ribbon of code, the paper tower of 250,000 pages, the headline in the sky (#67) · price tags on threads, receipts, pay slips, the long
land left → right with stations, the dollar bar (#66) · **a bunker card or quote (#72): the bunker is ONE half-sentence of VO only** ·
"one world with zooms" for the whole film (Jakob 24.11.).

## 8 · Seams (owned by the lead, `lib/f78_world.mjs`)
| seam | phrase | plate |
|---|---|---|
| Lead → B1 | `So what was in those pages` | `S.plateHook`: THE 52 PAGES left, the gold LINE centre, the man at the lectern in his spotlight right |
| B1 → B2 | `That is why this channel exists` | `S.plateRecord`: HIS LIFE LINE, markers 1 2 gold (HELD), 3 4 cream (OPEN), 5–20 YEARS on 4, the gold knot, you at the right end, dawn low right |
Both sides draw the plate for ± .5 s (`S.SEAM_HALF`) with the same creep (`S.creep`: 4 %/s push, 30 px/s truck). Check:
`node tools/seam.mjs --at <T0>` (0 flags). Inner chunk boundaries belong to one builder (match them yourself).

## 9 · Camera
A 2D view over a design plane (`S.view(ctx, cam)`, cam = `{ x, y, s }`: design point (x, y) at the screen centre, magnification s) with
`S.camPath2(t, K)` (monotone cubic in x, y and log s; keys on phrases only). The stage has its own parallax (`S.stage(ctx, t, cam)`:
stars .05, city .2, horizon .3 of the camera move). Fly-into = s grows ≥ 4× over ≥ 1.8 s into an object whose inside is the next row.

## 10 · Gates (before you report)
Stills every ~.5 s around every transition (`node render.mjs --snap`), a contact sheet of the chunk, `tools/calm.py` (0 cuts, quiet spots
< 5 %, none > 2 s), `tools/smooth.py` (0 flagged), `tools/seam.mjs --at <T0>` at your group seams (0 flags), `node tools/anchors78.mjs`
(all anchors found). Honest self-check in your report (biggest gap).
