# Film 67 · "Meta's AI Chief Says Superintelligence Is Arriving" (thumbnail SUPERINTELLIGENCE IS ARRIVING) · motion bible (lead, 2026-11-23)

The Good Takeoff · English · 1080p30 · 628.0 s narration + 15 s end screen = 643.0 s (real VO: `<ROOT>audio/timing.json` + `slots.json`;
clip slots are placeholders and WILL shift when the real clips arrive: anchor on phrases only).
ROOT = `/mnt/project-files/scenario/film-si-arriving/` (`$F67ROOT`). Machine = Film 66/59 (same engine, `lib/f10_editorial.mjs`).
Shot list: `docs/shots.md` (source `tools/shots67.py`) · kit: `lib/f67_kit.mjs` · world + seams: `lib/f67_world.mjs` · quality reference:
`scenes/sc01.mjs` · contact sheets `<ROOT>bild/kit67_kontakt.jpg`, `<ROOT>bild/c01_kontakt.jpg`. Assets: `films/67-assets/` (`$F67ASSETS`).

## 1 · Intent
One line: **An AI produced a proof no human can read; a program said "correct". Wang calls that superintelligence arriving. Something did
arrive: trust moved from the answer to the check. Who gets to say "correct" has to stay human.**
Five checks on a checklist (IS HE RIGHT?): 1 evidence real (gold) · 2 proved the right thing (gold with a small ?) · 3 really the AI (gold)
· 4 does any human understand it (**stays OPEN: cream + the word OPEN, never a red X, never a cross**) · 5 does one proof mean
superintelligence (half). Mood: calm, curious, a little awed. The viewer is "you": a tiny faceless figure in a yellow raincoat.
Explainers carry 60–70 % of the picture (shots.md weights: EXPL 1 · MIX .5 · LAND .3 · SCENE 0 · CLIP 0; current plan 58 %: builders, keep
your layers or lift them (an X crop, the checklist, a card over the veil), never lower).

## 2 · The world: THE NIGHT OF THE HEADLINE (one place, no other worlds)
A night world seen from the side. In the sky, at depth 6000, **THE HEADLINE**: Wang's sentence SUPERINTELLIGENCE IS ARRIVING in giant gold
letters (`F.headline`, frame 0 = thumbnail A); **Wang's X post header** pins under it (`F.xPost`, the real PNG). On the land (depth 3600,
ground line GY 840), left → right: YOUR TOWN (houses, lit windows; the river with THE OLD BRIDGE x −1300; THE TOWN HALL x −500) · THE QUAY
where you stand (x 960) · THE CHALKBOARD (x 2350: a huge old blackboard full of chalk, one empty spot RIEMANN HYPOTHESIS · UNSOLVED) ·
THE PAPER TOWER in front of it (the proof written out: 250,000+ PAGES) · THE REFEREE'S CHAIR (x 3500) by **THE RIBBON** (the Lean code, ~17M
lines, from the board's spot down to the ground and right to the horizon; nobody can read it) · THE LABS (x 4600 Meta Superintelligence
Labs with a billboard frame; x 5350 the other lab, the file glowing in its window; a fence between) · the horizon (x 9000).
**Through-line: THE FILE** ("a single file"). Planted in the hook (H.05: the small gold file leaves the headline and sinks into your hand;
you carry it to the board; it becomes the tower and the ribbon) and harvested at ~5:20 (4.10: under the headline only the small gold file:
that is what arrived). It closes the film as the ribbon under the referee's chair (end screen).
**The referee** = Lean, drawn as a human in a striped shirt with a gold card CORRECT (`F.referee`, `F.goldCard`). Not a robot.
**The checklist:** IS HE RIGHT?, five boxes top right (`F.checklist`), driven by `F.CHECKS` phrases; hidden during clip windows; `big` mode
at the end (10.01). Box 4 is a cream outline + OPEN, pulsing; never red, never crossed.
**The town hall scenario (c08):** a room IN your town (enter through its window, leave the same way). The bridge plan marks itself CORRECT
(a gold card, never a stamp); a thousand small YESes in a thousand windows.
**Thumbnail A in the film:** frame 0 (c01 H.01) and again at 10.01 ("Superintelligence is arriving. So").

### Nicht wiederholen (worlds and motifs used by earlier films: do NOT bring them back)
The crystal over a city (#59) · a big clock or clock face (also not for "a clock on it" at 9.08: a wall calendar) · server racks, a
satellite dish · an hourglass · a fire circle · the bell (#59) · a night street of shop windows with price tags (#27) · a letterbox (#27) · a
great hall (#54) · rubber stamps (#59: CORRECT is always the gold card, `F.goldCard`) · robots as faces or heroes (the hook's chalk robot
sketch is wiped on "a machine we fear") · a ladder or rungs (#31) · from #66: price tags on threads, receipts, pay slips, the long land
left → right with stations, the dollar bar.

## 3 · Motion DNA (owner rules, binding)
1. **One world, camera moves, not world changes.** ≤ 1 hard world change per minute (plan: 0; the town hall is entered through its window,
   the clips grow out of world objects). Max 1–2 moving elements at a time: when a card moves the camera only creeps; when the camera
   travels cards hold (float only).
2. **A carrier at every transition** (write it into your header table; shots.md column "carrier"). Clip plates grow out of a world object
   (the lab door, the ribbon, the magnifier, LeCun's portrait) and go back into it.
3. **Nothing from nowhere, no ghost fades.** Things unroll (X crops, the post), fall, pour out of the file, write themselves in chalk,
   rise behind a mask, grow out of a window. Alpha only as a quick 0 → 1 in ≤ .3 s with a geometric move.
4. **Never still.** `E.camDrift`, `F.float`, the ribbon flows, stars, windows breathe, the referee breathes, the checklist's open box pulses.
5. **Speed:** big area changes ≥ 1.8 s sineIO (smooth.py LURCH > 12); hits (a card up, a box filling) ≤ .3 s on the word. ≥ .8 s quiet after.
6. **One ★ per chunk** (shots.md). The hook's ★ is the paper tower rising out of the frame on "But written out" (250,000+ PAGES).
7. **Every picture illustrates its sentence** (one motif per sentence; shots.md is binding, improve it, never drop the idea).
8. **Clips** in `F.clipPlate` (lower third ABOVE the plate: NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE) from `F.CLIPS`). ≤ 10 % of the
   runtime, ≥ 45 s apart. Optional **C0** (Levent Alpöge) near 3.07/3.08 "the mathematician himself" (~3:30) only if `clips.md` has it.
   The names "Levent Alpöge · Anthropic · Claude" appear ONLY as the EINBLENDUNG at check 3 (`F.SOURCES.alpoge`); the narrator never names them.
9. **Wang's real X post** (films/67-assets/x/*.png): the header unrolls in the hook ("That's what Meta's A.I. chief announced"); quote crops
   with a highlighter sweep (`F.xQuote(ctx, t, id, …)`, ids: alien, homework, lazy, thousand, handover, defaultPath, nextYear, views).
   Highlight boxes live in `F.ASSETS` (override in `films/67-assets/x/highlights.json`). Missing PNG = magenta PLACEHOLDER card, never blocks.
10. **Wang's portrait** (`films/67-assets/wang/portrait-cutout.png`) ONCE at 1.01 "The man is Alexandr Wang" as a paper-cut duotone print
   (`F.portrait`) + name lower third (`F.nameplate`). Placeholder silhouette until the PNG arrives (marked PLACEHOLDER).
11. **Subscribe calls** ("This channel exists", M.01 and A.01): a warm moment, small lights in windows around the world; no QR.

## 4 · Palette and type (`lib/f67_kit.mjs`)
GOLD = the hero light (the headline, the file, CORRECT, filled boxes; ONE hero light per frame) · CREAM `#f3efe2` / CREAM2 `#a49fc4` = open
questions, box 4, text · PAPER = documents, the tower, quote cards · COOL = machines, the ribbon's code light, the labs · LAMP = people's
windows · night blue / INK = the sky. Type: Inter (labels, caps, spacing .06–.12), Inter Black condensed (the headline only), Instrument
Serif (quotes, big numbers). Text ≥ 22 px at 1080p, held ≥ 1.5 s, ≤ 6 words per statement + one number (verbatim quotes may be longer).

## 5 · Frame safety
- Burned-in subtitles take the bottom 170 px: nothing important below y 880; `F.source` sits at y 880 (22 px).
- No QR overlay, no donation overlay. No logos, no real faces outside the clips and the one portrait print, no AI images, no 3D game look,
  no primitive shapes.
- End screen (last 15 s, from 628.02): `S.endScreen` / `S.END_TILES` (tiles left and right in the lower half, subscribe circle centre).

## 6 · Camera
2.5D cards: `E.aim(Z, u, v, s, sx, sy)` puts card point (u, v) at screen (sx, sy) at scale s relative to home. `F.camPath(t, K)` (monotone
cubic, log-distance to depth 6000) with keys on phrases only. `S.landCam(u, v, s)` for the land; named cams `S.HOME`, `S.WANG_CAM`,
`S.BOARD_CAM`, `S.REFEREE_CAM`, `S.LABS_CAM`, `S.TOWN_CAM` (each `(k, tr)` = creep factor and truck). Flying from home down to the land
passes the quay: keep it ≥ 2.5 s. Seams: plates in `lib/f67_world.mjs` (CREEP 4 %/s, TRUCK 30 px/s).

## 7 · Gates (before you report)
Stills every ~.5 s around every transition, a contact sheet of the chunk, `tools/calm.py` (0 cuts), `tools/smooth.py` (0 flagged),
`tools/seam.mjs --at <T0>` at your group seams (0 flags), `node tools/anchors67.mjs` (all anchors found).
