# Film 63 · builder brief (B1, B2, B3 in parallel, one checkout) · as of 2026-11-25

**Load the skills first:** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`, `fluid-motion-design`,
`motion-director-gates`; for every number graphic also `dataviz`. No ad skills. Style: `stil/STIL-editorial-nacht.md`.

**REGELN §13 (binding, Jakob 24.11.): the picture shows what the sentence says.**
1. One picture per sentence: every sentence with new information gets its own motif showing exactly that (number, quote, comparison, mechanism, person, place). 1a. A zoom/pan/move into the same picture is NOT a new motif. 1b. Standard = motion-design film: each motif composed, transitions as designed transformations, type and numbers kinetic on the voice, rhythm alternates fast runs and calm pictures.
2. Explainer share 60–70 % (EXPL 1 · MIX .5 · SCENE/WELT/CLIP 0) — planned in `docs/shots.md`, keep your chunk near its number.
3. Scenes carry feeling (★ moment, human moments), graphics carry understanding (every number, quote, mechanism; gladly as MIX on a scene object).
4. Leitbild (the scale, Babel/the wall) only at its anchors (2.14, 4.01, 9.06, A.01). No one-world film, no endless ride through one world.
5. Transitions over a carrier object, no fades; ≤ ~1 hard cut/min (planned: 0); 1–2 movements at once.
6. Acceptance per chunk: contact sheet against the gates AND the script (does every frame show the sentence being spoken?); measure cuts/min, calm.py, stills (< 5 %, none > 2 s).

Read next: `docs/MOTION.md` (DNA, carriers, clips, Nicht wiederholen), `docs/shots.md` (YOUR rows, binding), `scenes/sc01.mjs` (how a
chunk is built: one entry, one draw function, motifs scheduled on phrases), `/tmp/claude-0/f63/c01_kontakt.jpg` and `/tmp/claude-0/f63/c01.mp4`.
Facts: `<ROOT>faktenzettel.md`, `<ROOT>ampelseite.md` (corrections: **$250B** not $300B · labor share **53.0 % Q3 2026, lowest since 1947** · Hassabis line at 4:22),
quotes **word for word** from `<ROOT>wortlaut-verifiziert.md` with their **§ number** on the card.

Code: `/home/user/scenario/films/63-the-pope-says-ai-wont-save-you/code/` · ROOT = `/mnt/project-files/scenario/film-papst/` (`$F63ROOT`;
small files only, trailing slash, never search it whole). Renders/scratch: `/tmp/claude-0/f63/<you>/`. **Never touch `code/audio/`** (sound agent).
**No git commit unless the lead says so.** No AI images: everything is code, except the 4 real clips.

## Your chunks (real VO, `audio/timing.json`, 625.4 s)
| builder | chunks | from → to (phrase) | time | contents (details: docs/shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'In May, in Rome' → 'This channel exists for one reason' | 0:52.9 – 3:49.3 (176 s) | **starts on `S.plateDisarmed`**: DISARMED sinks into the letter · his first · LEO + cardinals · §9 four symbols · §117 salvation · full-text search 0·0·0 · A PROMISE · c03 banner off · **$250B+** stacked bar · the essay · country of geniuses · harvest of the three tiles · STILL A PROMISE · **★ ANCHOR the scale 2.14** (BODY · MONEY · TIME / WHERE IS THE CATCH?) · c04 the scan · blueprint §112 · THE TRAP · §117 · WHO DECIDES? · c05 **★ ANCHOR Babel §7 + the wall §9**, DISARM in the gap, §110 ×2 · c06 tower-or-wall gauges · $122B · §5 · §109 · §107 · §67 vault · @jack "yes" → **ends on `S.plateYes`** |
| **B2** | c07 c08 c09 | 'This channel exists for one reason' → 'In October the Pope' | 3:49.3 – 6:27.2 (158 s) | **starts on `S.plateYes`**: subscribe 1 (the town's windows) · AND YOUR WORK? · Rerum novarum 1891 → 2026 · **C3** (4:12.8) · ×10 Hassabis · §149 · 3 of 33 desks §154 · c08 labor share **53.0 %** bar (no invented series) · §160 · the plough · UNPROVEN · c09 the synod hall · CHRIS OLAH · **C4** (5:31.5, inset) · POPE = OLAH · ★ grown · Series H · mini scale WHAT STAYS YOURS? → **ends on `S.plateStays`** |
| **B3** | c10 c11 c12 | 'In October the Pope' → end | 6:27.2 – 10:25.4 (238 s, end screen from 10:10.4) | **starts on `S.plateStays`**: PURPOSE · tools not persons · LIFE · FREEDOM · FORCE switches · Geneva · §118 plant in the crack · ★ §120 · c11 WHAT CAN NO MACHINE REACH? · **C5** (7:23.1) · FREEDOM · INNER LIFE · LOVE · WORSHIP · Lazzarin · YouGov 5 bars · the kitchen · §156 · c12 three levers · **★ ANCHOR the scale level 9.06** · the tiles carried off · §128 card · OUR WORDS · the wall + subscribe 2 (A.01) · **end screen** (`S.endScreen`, refine it) |

## Timing
- `film.mjs` loads `<ROOT>audio/timing.json` (+ clip slots: C1 39.77–43.87 · C3 252.83–260.73 · C4 331.52–338.62 · C5 443.10–454.10). If the VO changes, nothing in your code may break:
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (word start), `T.GE(...)` (end), `T.GW(from, to, after)` / `F.wordTimes(T, from, to, after)` (per word), `T.clip('C3')` → `{ start, end }`. **Never write seconds.** Repeated phrases: pass `after` (= your chunk start `R.a`) or `nth` ('This channel exists' = M.01 and A2; 'yes'; 'the work').
- After any VO change: `node tools/anchors63.mjs` (must say "all anchors found") and `python3 tools/shots63.py`.
- Entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT63 }, …]`; `R = { a, b, id, first }`; entries outside `[R.a, R.b)` are dropped. Prefer **one entry per chunk** with your own internal schedule (like sc01). Inner chunk boundaries of your group are yours: frame at `R.b` of one chunk = frame at `R.a` of the next.

## Seams (`lib/f63_seams.mjs`, owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'In May, in Rome' (52.9) | `S.plateDisarmed`: DISARMED (gold serif, `S.DIS`) on the night, gold rule with a running glint | c01 (done) | B1's first motif: DISARMED sinks into the encyclical's title page |
| B1 → B2 | 'This channel exists for one reason' (229.3) | `S.plateYes`: the @jack repost card, one word "yes" (`S.YES`) | B1 c06 settles into it | B2: the card's glow becomes the town's first lit window |
| B2 → B3 | 'In October the Pope' (387.2) | `S.plateStays`: mini scale, BODY · MONEY · TIME left, right empty, WHAT STAYS YOURS? (`S.STAYS`) | B2 c09 settles into it | B3: the empty right pan becomes the first motif |
Both sides draw the plate for ±`S.SEAM_HALF` (0.5 s) with the same creep (`S.CREEP`, 2 %/s) and breathing light (`S.breathe`); the receiving side **transforms** the plate (never a hard switch at +0.5 s; the stubs still do, that is your first fix). Reuse the plate's own drawers (`S.disarmedWord`, `S.yesCard`, `S.staysScale`) for continuity. Check: `SECS=c06,c07 node tools/seam.mjs --at <T0>` (no POP/BLACK).

## Kit API (`lib/f63_kit.mjs` as `F`, `lib/f63_seams.mjs` as `S`)
- **Ground and camera:** `F.night(ctx, t, { glow: [x, y, r, a], n, seed, stars })` · `F.land(ctx, y0)` · `F.look(ctx, cx, cy, z, fn)` / `F.lookPt` · `F.camPath(t, K)` · `F.drift` · `F.cam3`/`F.project` (only if you need 3D).
- **Type:** `F.titleWords` / `F.titleWidth` (Inter Black, thumbnail words only) · `F.maskLine(ctx, [[text, goldness]], x, y, size, rise(u), o)` · `F.goldText` · `F.glowText` · `F.capsLabel(ctx, s, x, y, u, { size ≥ 22 })` · `F.question(ctx, t, text, x, y, size, { ts })` · `F.strike` · `F.goldSpan` / `F.trailCream` (drawn lines) · `F.arrow` · `F.source(ctx, t, t0, t1, text)` (y 880).
- **Cards:** `F.quoteCard(ctx, t, T, o)` (exact wording + § number) · `F.dataCard` · `F.paperCard` · `F.verdict` · `F.goldLabel`.
- **Objects:** `F.block` (the machine block: lit face, chip, traces, engraved `words`, `trace/pull`; returns geometry) · `F.scaffold` · `F.pope(ctx, x, y, h, { raise, look, light, back, lean })` · `F.du` (you; walk, look, arms) · `F.person` · `F.stopHand` · `F.city` · `F.crowd` (unit chart) · `F.kitchen` / `F.kitchenFrame(ctx, open)` / `F.KITCHEN` · `F.tile(ctx, t, 'ill'|'bills'|'work', …)` (the three things you would hand over) · `F.slot` (the signature) · `F.warhead` · `F.tower` · `F.wall` · **`F.scale(ctx, t, x, y, s, { u, tilt, left, right, labels, mini })`** + `F.weight` (leitbild: only at the anchors).
- **Carriers:** `F.iris(ctx, shape, drawB, { rim })` · `F.portal(ctx, u, win, drawA, drawB, { over })` (ends on B's identity frame).
- **Clips:** `F.clipPlate(ctx, t, T, id, { from: rect|[x, y, r], morph })` — grows out of an object and back; C4 is a framed inset automatically (`F.clipRect(id)`), C3/C5 are cropped above the DRM banner; the lower third (NAME · ROLE · PLACE, DATE · ORIGINAL FOOTAGE (SOURCE)) is drawn by the plate. Frames must exist in `/tmp/claude-0/f63/clips/<id>/` (they do).
- **Palette:** `F.P` (night, indigo, halo/core gold), `F.GOLD`, `F.CREAM`, `F.PAPER`, `F.WHITE` (the Pope, never yellow), `F.NIGHT`. Extra helpers of your own go in `lib/bN_extra.mjs` (yours alone); do not edit the kit; ask the lead for kit changes.

## Files you own
B1: `scenes/sc02.mjs … sc06.mjs`, `lib/b1_extra.mjs` · B2: `scenes/sc07.mjs … sc09.mjs`, `lib/b2_extra.mjs` · B3: `scenes/sc10.mjs … sc12.mjs`, `lib/b3_extra.mjs`.
Everything else is read-only for you (kit, seams, film.mjs, tools, docs, audio/).

## Render and check (scale .5 for review)
```
cd /home/user/scenario/films/63-the-pope-says-ai-wont-save-you/code
SECS=c03 node render.mjs --snap 95,96.5,98 --dir /tmp/claude-0/f63/b1/snap --scale .5          # stills every ~0.5 s + every transition
SECS=c03 node --expose-gc render.mjs --out /tmp/claude-0/f63/b1/c03.mp4 --from 90.3 --to 133.7 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f63/b1/c03.mp4 --scale 1280:720      # cuts 0
python3 tools/smooth.py /tmp/claude-0/f63/b1/c03.mp4                    # flagged 0 (no LURCH / POP)
ffmpeg -i /tmp/claude-0/f63/b1/c03.mp4 -vf "scale=640:360,freezedetect=n=0.001:d=0.5" -an -f null - 2>&1 | grep freeze   # nothing
SECS=c02,c03 node tools/seam.mjs --at 90.3                               # every inner and outer seam
ffmpeg -i <mp4> -vf "fps=1/1.5,scale=384:216,tile=6x6:padding=4" -frames:v 1 <dir>/cNN_kontakt.jpg
```
calm.py's per-frame "static %" counts the grain cadence; the binding still-check is freezedetect (no stills ≥ 0.5 s). Reference c01: 0 cuts,
mafd median 0.84, smooth 0 flags, 0 stills.

## Report (to the lead, ≤ 200 words per chunk group)
Per chunk: render path + contact sheet path · explainer share as built vs planned · cuts · calm (mafd median) / smooth flags / stills ·
seam results · rows of shots.md you changed or could not show literally (and why) · open issues. No commit, no push.
