# Film 77 · builder brief (B1, B2, B3 in parallel, one checkout) · as of 2026-11-25

**Load the skills first:** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`, `fluid-motion-design`,
`motion-director-gates`; for every number graphic also `dataviz`. No ad skills. Style: `stil/STIL-editorial-nacht.md`.

**REGELN §13 (binding): the picture shows what the sentence says.**
1. One picture per sentence: every sentence with new information gets its own motif showing exactly that (number, quote, comparison, mechanism, person, place). 1a. A zoom/pan/move into the same picture is NOT a new motif. 1b. Standard = motion-design film: each motif composed, transitions as designed transformations, type and numbers kinetic on the voice, rhythm alternates fast runs and calm pictures.
2. Explainer share 60–70 % (EXPL 1 · MIX .5 · SCENE/WELT/CLIP 0): film plan **68.6 %**, keep your chunk near its number in `docs/shots.md`.
3. Scenes carry feeling (★ moment, your room, human moments), graphics carry understanding (every number, quote, mechanism; gladly as MIX on a scene object).
4. Leitbild = **THE BOARD** big only at its anchors (H.01, 1.20, 4.29, 6.16 → end screen). The mini board (2.18, 3.17, 4.23, 5.19) is a corner icon. **NOT ONE WORLD**: no endless ride through one landscape.
5. Transitions over a carrier object, no fades; planned hard cuts: 0; 1–2 movements at once.
6. Acceptance per chunk: contact sheet against the gates AND the script (does every frame show the sentence being spoken?); cuts, calm.py, stills (none ≥ 0.5 s).

Read next: `docs/MOTION.md` (DNA, colour code, carriers, clips, Nicht wiederholen), `docs/shots.md` (YOUR rows, binding: column "zeigt wörtlich"),
`scenes/sc01.mjs` (how a chunk is built: one entry, one draw function, motifs scheduled on phrases, a world camera via `F.lookPath`),
`/tmp/claude-0/f77/lead/c01.mp4` + `/tmp/claude-0/f77/lead/c01_kontakt.jpg`.
Script: `<ROOT>vo-v4.txt`. Facts: `<ROOT>faktenzettel.md`, `<ROOT>ampelseite.md`, **`<ROOT>ampel-zweitpruefung.md`** (second check: the cost line shows
**only the 9 Erdős problems**). Clips: `<ROOT>clips-final.md`. Quotes **word for word** with source and year on the card (`F.quoteCard`).
Turing and Good appear ONLY as quote cards (no portraits). Not in this film: Jensen Huang, medicine. No AI images: everything is code except the 4 clips.
Colour code (never break): GOLD = invention light (begun, real) · CREAM = questions, wishes, outlines, the open 4th line · COOL = the machine ring ·
yellow coat = only you · other people indigo · FILLED = real/checked, DASHED = imagined/forecast · never red.

Code: `/home/user/scenario/films/77-agi-the-final-human-invention/code/` · ROOT = `/mnt/project-files/scenario/film-77-turing/` (network mount:
small files only, trailing slash, never search it whole; after writing wait ~10 s and read back). Renders/scratch: `/tmp/claude-0/f77/<you>/`.
**Never touch `code/audio/`** (sound agent). **No git commit, no push.** Release: Tuesday 1.12.

## Your chunks (real VO, `<ROOT>audio/timing.json`, 614.12 s, end screen from 9:59.1)
| builder | chunks | from → to (phrase) | time | contents (details: docs/shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'Here is the promise' → "So why isn't it in the power lines" | 0:58.7 – 3:59.1 (180 s) | **starts on `S.plateBand`** (Good's band, PROMISE gold / CONDITION dashed, you under it): quote card 1965 · MORE THAN 60 YEARS · Bletchley hut · ring draws a bigger ring (SMARTER → DESIGNS) · THE END? · two Good cards · WHY TAKE HIM SERIOUSLY TODAY? · c03 lecture hall · A.G.I. = ULTRAINTELLIGENT MACHINE · Hassabis name card · **C1** · STEP 1 / STEP 2 · YOUR OWN LIST · **★ ANCHOR 1.20 STILL WAITING** · test stamp · c04 your room + power bill · radiator (dashed) · water + electricity → hydrogen · catalyst · lab line 2,942 · Pd · c05 ring over the lab (FORECAST) · **★ thousands of lab lines** · three stations · mini board ENERGY · c06 plant/battery/line come apart · a week of battery · two wires · lattice search · the sample → **ends on `S.plateSample`** |
| **B2** | c07 c08 c09 | "So why isn't it in the power lines" → "That's the fourth line" | 3:59.1 – 7:10.5 (191 s) | **starts on `S.plateSample`**: sample beside the power line · 2.5–6.5 K thermometer · designs vs. made (height comparison) · Periodic Labs robot + furnace · **C2** (out of the furnace window) · mini board MATERIALS · c08 WHY STILL SMALL? · MATTER IS SLOW / an empty sheet · 9 outside mathematicians · Gowers card · index-card wall, 9 of 353 lit (cost line only for these 9) · calendar of CLAIMs · c09 the mathematician + paper stacks · **C3** · funnel TOO MANY · "proof indigestion" card · 25 medals · mini board DISCOVERY · WHO DECIDES WHAT IT WORKS ON? · **★ ANCHOR 4.29: the cover falls** · DOCILE · Turing card → **ends on `S.plateTuring`** |
| **B3** | c10 c11 c12 | "That's the fourth line" → end | 7:10.5 – 10:14.1 (184 s, end screen 9:59.1–10:14.1) | **starts on `S.plateTuring`**: "control" lifts off the card into row 4 (cream) · THE MACHINE TELLS US HOW · you pick up the stylus: OUR JOB · many hands with lights · the package on the road, gate 1 CAISI, gate 2 EU AI OFFICE · c11 RULES WORK FROM THE OUTSIDE · into the package (the ring) · Christiano lectern, five tools · **C4** · PLAUSIBLE · lamps into the package · mini board CONTROL: WHO WRITES IT? · c12 WHAT ELSE IS LEFT FOR US? · Erdős #1196 · Liam Price · Lichtman · 8 authors · THE MACHINE FOUND THE WAY · the compass · **ANCHOR 6.16 the board big** · **★ 6.22 back to the frame-0 list** · **end screen** (`S.endScreen`, refine it, keep its free areas) |

## Timing
- `film.mjs` loads `<ROOT>audio/timing.json` + `slots.json`. Clip slots now: C1 111.2–121.7 · C2 265.1–276.2 · C3 358.22–369.02 · C4 479.23–492.03; they get **~1.2–1.5 s shorter** after the clip trim, and the VO may still move. Nothing in your code may break:
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (word start), `T.GE(...)` (end), `T.GW(from, to, after)` / `F.wordTimes(T, from, to, after)` (per word), clips **only** via `T.clip('C2')` → `{ start, end }`. **Never write seconds.** Repeated phrases ('the fourth line', 'invent', 'the machine'): pass `after` (= your chunk start `R.a`) or `nth`.
- After any VO change: `node tools/anchors77.mjs` (must report all anchors found) and `python3 tools/shots77.py`.
- Entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT77 }, …]`; `R = { a, b, id, first }`; entries outside `[R.a, R.b)` are dropped. Prefer **one entry per chunk** with your own internal schedule (like sc01). Inner chunk boundaries of your group are yours: the frame at `R.b` of one chunk = the frame at `R.a` of the next.
- The stubs (`lib/stub77.mjs`) already render your whole range (row text on the night + the seam plates), so the film always builds. Replace them.

## Seams (`lib/f77_seams.mjs` as `S`, owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'Here is the promise' (58.7) | `S.plateBand`: Good's band (`S.BAND`, typed, front half gold PROMISE, back half under the dashed cover CONDITION), you under it (`S.BAND_YOU`) | c01 (done) | B1 1.01/1.02: the front half lifts off as the quote card, words light as spoken |
| B1 → B2 | "So why isn't it in the power lines" (239.1) | `S.plateSample`: the superconductor sample in its holder, centred (`S.SAMPLE`), breathing glow | B1 c06 settles into it | B2 3.10: the camera pulls back, the sample floats beside the power line in front of your house |
| B2 → B3 | "That's the fourth line" (430.5) | `S.plateTuring`: the Turing card (`S.TURING`, "At some stage therefore we should have to expect the machines to take control …" — Alan Turing, 1951; take/control gold) | B2 c09 settles into it | B3 5.01: "control" lifts off the card and flaps into row 4 |
Both sides draw the plate for ±`S.SEAM_HALF` (0.5 s) with the same creep (`S.creep(ctx, t, t0, fn)`, 2 %/s) and breathing light (`S.breathe`);
the receiving side **transforms** the plate (never a hard switch at +0.5 s; the stubs still do, that is your first fix). Reuse the plate's
own drawers (`S.bandState`, `S.turingCard`, `F.sample`) for continuity. Check: `SECS=c06,c07 node tools/seam.mjs --at <T0>` (no POP/BLACK).

## Kit API (`lib/f77_kit.mjs` as `F`, `lib/f77_seams.mjs` as `S`)
- **Ground and camera:** `F.night(ctx, t, { glow: [x, y, r, a], ox, oy })` (parallax stars) · `F.land` · `F.look(ctx, cx, cy, z, fn)` / `F.lookPt` · **`F.lookPath(t, [[t, cx, cy, z], …])`** (monotone glide through keys; key it on phrases, the camera follows the carrier, never leads) · `F.camPath`/`F.cam3`/`F.project` only if you need 3D.
- **Type:** `F.titleWords`/`F.titleWidth` (thumbnail words only) · `F.maskLine(ctx, [[text, goldness]], x, y, size, rise(u), o)` · `F.goldText` · `F.glowText` · `F.capsLabel(ctx, s, x, y, u, { size ≥ 22, col, align })` · `F.question(ctx, t, text, x, y, size, { ts })` · `F.verdict` · `F.strike` · `F.flapText(ctx, t, text, x, y, size, { from, u, cells, col, tiles, glow })` (split-flap) · `F.source(ctx, t, t0, t1, text)` (y 880).
- **Cards:** `F.quoteCard(ctx, t, T, o)` (exact wording + source; `o.hi` = always-gold words) · `F.dataCard` · `F.paperCard` · `F.goldLabel`.
- **Leitbild:** `F.board(ctx, t, x, y, { w, rowH, head, title, sub, rows, cells, u, s, mini, glow })` · `F.boardRow(ctx, t, x, y, w, h, { text, from, flip, status, gold, empty, dashed, lit, a })` · `F.ledger` (a scrolling column) · `F.INVENTIONS`, `F.LINES` (ENERGY · MATERIALS · DISCOVERY · CONTROL).
- **Objects:** `F.ring` (the machine: `{ u, lit, think, dashed }`) · `F.headProfile` · `F.stylus` · `F.lineIcon(ctx, kind, x, y, s, o)` (bulb, phone, screen, plug, battery, house, radiator, pylon, plant, compass, drop, bolt, sun, flask) · `F.room` + `F.ROOM` (your room: bulb, phone, wall screen, side table, `bill`) · `F.bulbGlass` · `F.dotSheet` (Erdős page) · `F.rollCounter` · `F.band` + `F.GOOD_FRONT/GOOD_BACK` (Good's sentence) · `F.testStamp` · `F.slider` · `F.catalyst` · `F.lattice` · `F.sample` · `F.labRobot` (→ `{ win }` for C2) · `F.proofStack` · `F.hands` · `F.writingHand` · `F.inventor`.
- **People:** `F.du` (you, the only yellow; walk, look, arms) · `F.person` (everyone else, indigo) · `F.crowd` (unit chart) · `F.city`.
- **Carriers:** `F.iris(ctx, shape, drawB, { rim })` · `F.portal(ctx, u, win, drawA, drawB)` (ends EXACTLY on B's identity frame) · `F.outline(ctx, polys, u, { dashed, gold, w })`, `F.trailCream`, `F.goldSpan` (lines that draw themselves) · `F.subPoly`, `F.circlePts`, `F.rectPts`, `F.along`.
- **Clips:** `F.clipPlate(ctx, t, T, id, { from: rect|[x, y, r], morph })` grows out of an object and back; full plate (`F.CLIP_RECT`); the lower third (NAME · ROLE · SOURCE, YEAR · ORIGINAL FOOTAGE) is drawn by the plate. Frames from `$F77CLIPS` or `/tmp/claude-0/f77/clips/<id>/`; until they exist a placeholder shows the exact words.
- **Palette:** `F.P`, `F.GOLD`, `F.CREAM`, `F.COOL`, `F.PAPER`, `F.NIGHT`; easing `F.expoOut`, `F.sineIO`, `F.quartIO`, `F.backOut`, `F.powOut`, `F.rise`. Extra helpers of your own go in `lib/bN_extra.mjs` (yours alone); do not edit the kit; wishes for kit changes go in your report.

## Files you own
B1: `scenes/sc02.mjs … sc06.mjs`, `lib/b1_extra.mjs` · B2: `scenes/sc07.mjs … sc09.mjs`, `lib/b2_extra.mjs` · B3: `scenes/sc10.mjs … sc12.mjs`, `lib/b3_extra.mjs`.
Everything else is read-only for you (kit, seams, film.mjs, tools, docs, audio/).

## Render and check (scale .5 for review)
```
cd /home/user/scenario/films/77-agi-the-final-human-invention/code
SECS=c03 node render.mjs --snap 100,100.5,101 --dir /tmp/claude-0/f77/b1/snap --scale .5            # stills every ~0.5 s + every transition
SECS=c03 node --expose-gc render.mjs --out /tmp/claude-0/f77/b1/c03.mp4 --from 99.3 --to 149.3 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f77/b1/c03.mp4 --scale 1280:720      # cuts 0
python3 tools/smooth.py /tmp/claude-0/f77/b1/c03.mp4                    # flagged 0 (no LURCH / POP)
ffmpeg -i /tmp/claude-0/f77/b1/c03.mp4 -vf "scale=640:360,freezedetect=n=0.001:d=0.5" -an -f null - 2>&1 | grep freeze   # nothing
SECS=c02,c03 node tools/seam.mjs --at 99.3                               # every inner and outer seam
ffmpeg -i <mp4> -vf "fps=1/1.5,scale=384:216,tile=6x6:padding=4" -frames:v 1 <dir>/cNN_kontakt.jpg
node tools/anchors77.mjs                                                  # all anchors found
```
(The chunk times above are orientation; take your real R.a/R.b from `docs/shots.md` §2.) calm.py's per-frame "static %" counts the grain
cadence; the binding still-check is freezedetect. **Reference c01 (lead):** 0 cuts · mafd median 0.58 · smooth 0 flags · 0 stills · seam Δ median 0.32.

## Report (to the lead, ≤ 200 words per chunk group)
Per chunk: render path + contact sheet path · explainer share as built vs planned · cuts · calm (mafd median) / smooth flags / stills ·
seam results · rows of shots.md you changed or could not show literally (and why) · kit wishes · open issues. No commit, no push.
