# Film 66 · "Sam Altman Says Everything Will Get Cheap" (thumbnail AI MAKES EVERYTHING CHEAP) · motion bible (lead, 2026-11-20)

The Good Takeoff · English · 1080p30 · ≈ 10:35 narration + ≈ 5 s quiet + 15 s end screen (provisional timing from `<ROOT>vo-v3.txt`;
the real VO timing arrives as `<ROOT>audio/timing.json`) · upload Sun 22.11.2026 17:00 Vienna.
ROOT = `/mnt/project-files/scenario/film-si-arriving/` (`$F67ROOT`). Machine = Film 59 (`docs/ref-59/` holds its plan for reference).
Shot list: `docs/shots.md` (source `tools/shots67.py`) · kit: `lib/f67_kit.mjs` · world + seams: `lib/f67_world.mjs` · quality reference:
`scenes/sc01.mjs` · contact sheets `<ROOT>bild/kit67_kontakt.jpg`, `<ROOT>bild/c01_kontakt.jpg`.

## 1 · Intent
One line: **Altman is half right: machines take the work out of a price, not the scarce part, and your wage is a price too.**
Seven price tags fall in order (knowledge and advice → education → things → energy → food → housing and land); the seventh is YOUR WAGE.
Mood: calm, curious, warm. The viewer is "you": a tiny faceless figure in a yellow raincoat. Explainers carry 60–70 % of the picture
(shots.md weights: EXPL 1 · MIX .5 · LAND .3 · SCENE 0 · CLIP 0; current plan 60 %: builders, keep your layers or lift them, never lower).

## 2 · The world: THE LONG LAND, FROM PURE THOUGHT TO SOLID GROUND (one place, no other worlds)
A night land seen from the side, left → right. Left: the city of thought (towers, the advice office with the programmer's lit window).
Then the college, the factory (cool window, robot arms, a belt), the power station + data centre (pylons), the fields + barn, the house on
its plot, the town hall (where the rules are written). Under the whole land runs **THE EARTH**, a cut through the ground: night-dark on the
left, warm umber and thicker to the right (the scarce part grows), with **the power cable** under every station.
Over every station hangs **ITS TAG**: a price tag of gold light on a gold thread from the sky (`F.tag`: falls = crumbles to gold dust from
the lower-left edge; splits; stays up; turns into a house; heavy earth weight). The hook's big tag is **THE PROMISE** (Altman's "everything").
At home (`E.cam3()`, frame 0 = thumbnail A) you stand on a rooftop in the foreground at the left, the promise hangs top right.
The camera travels left → right through the film, station by station. Depths: sky 40000 · far hills 12000 · the promise 6000 ·
the land 3600 · the rooftop F0 (1700) · foreground 1150.
**Through-line:** the tag. It opens the film (the promise crumbling, thumbnail A) and closes it (the seventh tag in your hand: YOUR WAGE).
**The clock:** seven small tags on a gold rail, top left (`F.board`), each changes on its station's verdict phrase (`F.BOARD`).
**Thumbnails shown in the film:** A = frame 0 (c01 H.01) · C = the receipt from the promise into your hand (c01 H.05) · B = the six tags
standing on the ground as a rising row, the house the last gold tag (c08 7.08 → `S.plateStairs`).

### Nicht wiederholen (worlds and motifs used by earlier films: do NOT bring them back)
The crystal over a city (#59) · a big clock or clock face (also not for billed hours) · server racks, a satellite dish · an hourglass ·
a fire circle · the bell (#59) · a night street of shop windows with price tags (#27) · a letterbox/mailbox (#27) · a great hall (#54) ·
rubber stamps (#59: verdicts here are gold caps with a drawn underline, `F.verdict`) · robots as faces or humanoid heroes (robots appear only
as flat factory arms or flat silhouettes at walls).

## 3 · Motion DNA (owner rules, binding)
1. **One world, camera moves, not world changes.** ≤ 1 hard world change per minute (plan: 1 in the film, at 1.09 the pull-back to the land
   wide). Max 1–2 moving elements at a time: when a card moves the camera only creeps; when the camera travels cards hold (float only).
2. **A carrier at every transition** (write it into your header table): the promise's face → the C1 plate → back; a tag's dust → the next
   station; the cable → the power station; the box → the C2 plate; the clean light → the C3 plate; a data point → the C4 plate.
3. **Nothing from nowhere, no ghost fades.** Things come down on their thread, split off a tag, unroll, rise behind a mask, grow out of a
   window. Alpha only as a quick 0 → 1 in ≤ .3 s with a geometric move.
4. **Never still.** `E.camDrift`, `F.float`, tags sway (built in), dust keeps streaming, windows breathe, the cable pulses.
5. **Speed:** big area changes ≥ 1.8 s sineIO (smooth.py LURCH > 12); hits (a tag drop, a verdict) ≤ .3 s on the word. ≥ .8 s quiet after.
6. **One ★ per chunk** (shots.md). The hook's ★ is the programmer's tag crumbling on "Almost to nothing".
7. **Every picture illustrates its sentence** (one motif per sentence; shots.md is binding, improve it, never drop the idea).
8. **Clips** grow out of a world object into `F.clipPlate` (lower third ABOVE the plate: NAME · ROLE · YEAR · ORIGINAL FOOTAGE (SOURCE)) and
   go back into it. C2 and C4 are centre-cropped in the plate (`F.CLIPS[id].crop`: channel logos in the corners).
9. **0:30–0:50 is one continuous scene** (no source, no flashback, no explainer card with a stat change). Done in c01.
10. **Subscribe calls** ("This channel exists", c04 and c12) get a warm picture moment: the windows of the land warm, "for everybody".

## 4 · Palette and type (`lib/f67_kit.mjs`)
GOLD = prices, the hero light (the tags, the promise; ONE hero light per frame) · PAPER = documents, the receipt, the pay slip, quote cards ·
COOL = machines, AI, power, the market's falling cost · EARTH = the ground (warm, heavy, never glowing) · LAMP = people's windows · INK.
Type: Inter (labels, caps, spacing .06–.12), Inter Black condensed (the title only), Instrument Serif (quotes, big numbers).
Text ≥ 22 px at 1080p, held ≥ 1.5 s, ≤ 6 words per statement + one number (verbatim quotes may be longer).

## 5 · Frame safety
- Burned-in subtitles take the bottom 170 px: nothing important below y 880; `F.source` sits at y 880 (22 px).
- No QR overlay, no donation overlay. No logos, no real faces outside the four clips, no AI images, no 3D game look, no primitive shapes.
- End screen (last 15 s): `S.endScreen` / `S.END_CAM` / `S.END_TILES` (tiles left and right in the lower half, subscribe circle centre).

## 6 · Camera
2.5D cards: `E.aim(Z, u, v, s, sx, sy)` puts card point (u, v) at screen (sx, sy) at scale s relative to home. `F.camPath(t, K)` (monotone
cubic, log-distance to depth 6000) with keys on phrases only. Aim at F0 (`E.aim(F.F0, …)`) when you must stay in frame (the promise moves
less); aim at `S.Z_LAND` for the stations (`S.stationCam(i, s)`). Flying from the rooftop down to the land passes over your shoulder: keep
it ≥ 2.5 s. Seams: plates in `lib/f67_world.mjs` (CREEP 4 %/s, TRUCK 30 px/s).

## 7 · Gates (before you report)
Stills every ~.5 s around every transition, a contact sheet of the chunk, `tools/calm.py` (0 cuts; c01: mafd median .47, static 11 %),
`tools/smooth.py` (0 flagged), `tools/seam.mjs --at <T0>` at your group seams (0 flags), `node tools/anchors67.mjs` (all anchors found).
