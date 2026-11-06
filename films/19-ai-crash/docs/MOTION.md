# Film 19 · "How to Survive the AI Crash" · motion rules (lead brief for all builders)

As of 2026-11-06 (picture lead, v1, Phase 1: concept + shot list, nothing built yet). The Good Takeoff, English, 1920×1080, 30 fps, ≈ 10:30 incl. the 15 s end screen. Release **Sat 7 Nov 2026, 17:00 Vienna**. Script `film-ai-crash/vo-v3.txt` (approved; the fact check writes `vo-v4.txt` with single-word changes), PICTURE notes in `text-v3.md`, clips in `clips.json`. Timing: `film-ai-crash/audio/timing.json` once the audio agent writes it, until then `data/provisional_timing.json` (VO ≈ 616 s + 15 s). Binding shot list: `shots.md` (source `tools/shots19.py`). Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (overrides everything except the palette accent in §4). Facts: `faktenzettel.md` + `faktencheck-v3.md` (only these numbers). **Not financial advice; no first-person sentences anywhere, also not on screen.**

**Guiding idea:** *Nobody knows if this is the crash. But every earlier crash on our clock has a name and an exit, and on every stretch of the way something different protects you: five things, gathered one by one under your umbrella. The last one is a net you can't knot alone.*

The film is **drawn** (Canvas 2D, Node, `@napi-rs/canvas`): no AI images, no footage except the two interview clips, no company logos (names as type only), **no computer-game look, no 3D flights through a world**.

---

## 0 · Lessons this plan is built on (Jakob)
- **Mix, 60–70 % explainer.** Film 18 missed with ≈ 43 %. This plan: **67 %** weighted (`shots.md` §2, computed by the generator). Builders keep the [EXPL] shots explainer graphics: a scene may only replace an [EXPL] shot with the lead's OK.
- **The recurring image is an anchor, not the stage** (28.10.): the road with its exits appears only at the hook, at each exit (section turns), at the nets and at day 1,000. In between: independent explainer graphics and own scene pictures, joined by objects. Film 18's "one world, travel along the road" is **not** the model here.
- **Every transition is carried by an object.** No fade, no cross-dissolve, no slide/wipe, nothing appears from nowhere, nothing half-transparent ("ghost").
- **≤ ~1 hard world change per minute** (`shots.md` §3: 10 in 10.5 min). **One main motion at a time.**
- **Crashes have names.** `THE TARIFF CRASH`, `THE RATE SHOCK`, `THE FINANCIAL CRISIS`, `THE DOT-COM BUBBLE`, `THE COVID CRASH`, `BLACK MONDAY`, `THE GREAT DEPRESSION`: names first, the year small after it.
- **Figures alive:** you walk with a real gait (`du({ walk })`), breathe, look up, turn; indigo people shift weight, sip, type, lean back. Faces: you never show one; others only as profile silhouettes with rim light in close-ups. Lights blink and breathe.
- **First frame = thumbnail A** (REGELN 9.5).

## 1 · Motion DNA (one cell: calm + soft, editorial; a crisis film told calmly)
- **Tone:** calm, protective, never panicky. The red falls; the gold holds. Speed contrast 3–5×: short accents (the line snapping, a stamp, flaps snapping) against 1.5–3 s living holds.
- **Easing:** entrances/landings expo-out, exits expo-in, moves quart in-out, **camera sine-S** (`camAt`, default `'s'`). No springs; ≤ 3 % overshoot (on the flap snap only). Never linear except constant mechanics (flaps rattling, a dot running the route at speed, mist drift).
- **Base unit 0.4 s.** Micro accent 0.25–0.35 s · entrance 0.4–0.7 s · object move 0.8–1.6 s · camera ≥ 1.6 s, rides 2.5–4 s.
- **Weight:** the red line is heavy and sharp (falls fast, shatters, shards drift down slowly); the umbrella is calm and light (it breathes, it never jerks); protection objects are light (they fly on arcs into their gore, 0.8–1.2 s, a short settle); the flap counter is mechanical (rattles linear, snaps hard, one tiny settle); nets sag and catch with a soft bounce (the only allowed "give").
- **Cause and effect (40–120 ms):** a shard hits the canopy → the canopy flares where it hit; the dot reaches a stop → the stop lights; an icon reaches its gore → the gore lights; the cent lands → the net dips.
- **One main motion at a time:** at most 1–2 moving main elements (the camera counts). Ambient life (shards, mist, breath, `camDrift`, the film `cameraFloat`) does not count.

## 2 · The world: anchors, an explainer plane, scene islands (no game world)
Three kinds of pictures alternate, always joined by an object:

1. **THE ROAD (anchor scene, ≈ 20 % of the film).** One night plain with a road running into mist; at its start the flap counter stands as a milestone; four exit signs along it, the goal sign `DAY 1,000` at the end; a small **town at the roadside** (houses, a lit shop, a bus stop, your mailbox, a glass office door); **under the road** three nets between old pillars (and the gap). Appears at: the hook (1.01–1.07: the hook's plain IS the road's plain), exit 1 (c05), the town (c06–c07), the memory (8.07), exit 4 (9.01–9.05), many roads (9.15), the nets (c10–c11), day 1,000 and the end (c12). No flights along it: you walk, the signs come to you, the camera rides at most a short truck or a sink below the road.
2. **THE EXPLAINER PLANE (≈ 65 %).** Night blue, light on night (the style's explainer look). Its recurring instrument is **THE ROUTE MAP**: the road seen as a transit line `DAY 0 ─ 48 ─ 282 ─ 517 ─ 929 ─ 1,000` (true scale), a dot for today, exit stops with names and glyphs (2.03–2.07, 8.01–8.06). Every other graphic grows out of the object of the shot before (the road edge becomes the S&P line, the button breaks into 100 points, the points stack into bars, the bars become a pause sign, the IOUs roll up into a coin, the payslip folds into a money stack, the inbox folds into an envelope).
3. **SCENE ISLANDS.** **Your table** (lamp = hero; day 31, protection 4 today, the ending) and **framed vignettes**: a window of light opens inside the current picture (from an exit sign, a hall window, a pillar, the mist), holds a drawn scene (Powell's stage, the Fidelity tower, the 2009 office, the www shops, the 2001 office, the 1933 bank, the 1987 floor, Hyperion, Hassabis' studio) and closes back into its object. A vignette is not a world change.

**The two through-line objects (persistent HUD, small, quiet):**
- **The flap counter** (top right, from 2.03 to the end): `DAY 030` … `DAY 1,000` … `DAY 032`. It is THE clock of the film ("the exits clock"); when a station starts it rattles and the stop on the route map lights. It grows to fill the frame twice (7.08 → route map, 12.01 → DAY 1,000).
- **Your umbrella** (top left, from 1.07): the umbrella of the thumbnail folded into a glyph with **five gores** (four equal, the fifth wider). Each protection flies into it and lights its gore. It grows into frame at 3.11 (`$0`), 9.14 (four of five) and 12.10–12.12 (the harvest). This replaces the five-slot "kit bar" of `text-v3.md` (same idea, one shape, the thumbnail's).

**Hero light per picture (exactly one, warm unless the subject is the machine):** the umbrella (hook, harvest), the flap counter (clock shots), the lamp (your table, the 2001 office), an exit's gold bottom point (exit windows), the net in morning light (c11), the dawn (c12). Machine subjects (the data-center hall, Hyperion) take the cool hall light as hero. Red is never the hero light (§4).

| Chunk | Builder | World | Mode |
|---|---|---|---|
| c01 | Lead | Road plain at the start, crisis ground → night: ★ umbrella under the falling red line (thumbnail A), the day chart in the sky, the five gores, the milestone | [SCENE] + [EXPL] in the sky |
| c02 | Lead | The counter → the S&P line → ★ the route map with four named exits → the bubble swells from today | [EXPL] |
| c03 | B1 | ★ Inside the bubble: the hall → Powell window (C1) → scale, IOUs, coin → outside: China pops → umbrella `$0` | [EXPL] (3.01 [SCENE], clip) |
| c04 | B1 | Your table, day 31 → ★ button → 100 points → Fidelity tower → bars → pause → gore 1 → face down | [SCENE] ↔ [EXPL] |
| c05 | B1 | Road: exit 1, ★ its window (containers, the 2025 line, the best day) | [SCENE] + [EXPL] window |
| c06 | B1 | Road → town: the red line to your mailbox → dots → ★ globe → magnifier → gore 2 | [SCENE] → [EXPL] |
| c07 | B2 | Payslip → halving stack → glass door → envelope → gore 3 → $400 → ten figures → rent | [EXPL] (explainer chunk, no ★) |
| c08 | B2 | Route map: exits 2 + 3 with windows → ★ the 2009 memory → road in winter light | [EXPL] → [SCENE] |
| c09 | B2 | Road: exit 4 → two bubbles → www shops → long line → 2001 office → five start points → price tag → gore 4 → ★ time-morph to your desk → many roads | mixed |
| c10 | B2 | Road → ★ down under the road: three nets → 1933 bank → first net → cent → your bank app | [SCENE] → [EXPL] |
| c11 | B3 | Under the road: 1987 → lever → 2020 → stress test → ★ three nets in morning light → the hole → Hyperion → fourth net → gore 5 → your message | [EXPL] (≈ 78 %) |
| c12 | B3 | DAY 1,000 → road, you turn → ★ morning: bubble gone, hall stands → Hassabis (C3) → new price → harvest → roads join → your table → phone turned over → end screen | mixed |

## 3 · Recurring objects (the graphic language)
| Object | Meaning | Kit (§8) |
|---|---|---|
| The golden umbrella, five gores | what protects you; one gore per protection; the fifth wider (built together) | `umbrella`, `hudUmbrella`, `goreIcon`, `flyToGore` |
| The red line (falling, shattering) | the market's fall, losses only | `lossLine`, `shards`, `SPX` |
| The flap counter | the clock: days since the record high (6 Oct 2026 = DAY 0) | `flap`, `hudDay`, `dayAt` |
| The road, the exit signs, DAY 1,000 | the way through a crash; exits = where earlier crashes hit bottom | `road`, `exitSign`, `goalSign`, `town` |
| The route map | the clock as an explainer: DAY 0–1,000 with four named stops at true scale | `routeMap` |
| The exit window / vignette window | a framed scene opening out of an object (history, a place, a clip) | `vWindow`, `clipWindow` |
| The soap bubble | the boom (if it is a bubble); cool film with a gold sheen; China's pops; ours is gone at day 1,000 | `bubble`, `skinFlood` |
| 100 points | savers / shares of a whole (Fidelity, the 100-cell bond coin, ten figures) | `dots100`, `coin100` |
| The nets under the road, pillars with crash names | safety nets built after crashes; the gap = data-center debt | `netSpan`, `pillar` |
| Your table, your phone, the lamp | the human scale: where the crash reaches you | `table`, `phoneHand`, E `du`, `lightPool` |
| You (yellow raincoat), others (indigo) | the viewer; others as silhouettes | E `du`, E `person` |

## 4 · Palette and the accent decision
**Base = the channel palette** (`P` in `lib/f10_editorial.mjs`, exactly from the style document): night `#080b27 #0a1334 #0e112c`, indigo `#0a184a #0c1f5c #151f4b`, blue `#193f8c #33497a #394773`, gold core `#fefde2 #fef4bf`, halo `#ead295 #dec688 #e7d19a`, gold shadow `#9e7d54 #a28f7b`, raincoat `#f2b632`, cream text `#fefcde`; machine cool (`COOL` from Film 18) `#eef3ff #b4c8ee #6a8cd2 #2b4a96`.

**Accent: crisis red (decided for this film, waiting for Jakob's OK):**
- `RED = { hot: '#ff6a4d', line: '#e5432f', deep: '#8e1f22', ink: '#3a0b12' }`. Red is an **accent, never a light**: the falling line, its shards, red numbers on screens, the DO SOMETHING button, the red ticker. Never the brightest thing in a frame except the impact flash on the umbrella (≤ 3 frames); ≤ ~15 % of the frame area.
- **Crisis ground only in the hook:** `GROUND.oxblood = { night0: '#14040a', night1: '#2a0a10', ind0: '#3d0d16' }` replaces the night gradient in 1.01–1.06 so frame 0 matches thumbnail A; `crisis(t)` (1 → 0) cools it to the channel night during 1.07 ("So which ones…", the road appears). From then on the ground is always night blue.
- **One switch:** `F19_GROUND=night` (env, read once in `f19_kit`) draws the hook on night blue as well (if Jakob does not confirm the red world); `RED` is one constant, so changing the accent is one edit. Builders never write red hex values themselves: always `F.RED.*`.
- **Red recedes through the film:** strong in c01–c04 (losses, panic), only in exit windows and the town line in c05–c09, a trace at 11.05 (Nov 5) and the TV in 9.13, **none** from 11.08 on. c12 warms toward dawn (`warm` on the road and sky).
- **Meaning:** gold = protection and human value (umbrella, gores, exit bottoms, nets, the lamp) · cool blue-cream = the machine and its money (data centers, the bubble film, debt cells) · red = loss · yellow = only you. The bubble's film: COOL bands + a gold sheen + one thin red thread at the rim (still no new colours).
- Grain subtle: `PRINT19 = { grain: 14, floor: 4, vig: .5 }` (as Film 18). Mean luma 40–60 (the hook on oxblood may sit at 35–45).

## 5 · Calm rules (measurable)
- **World changes:** ≤ ~1 hard world change per minute (this plan 0.95/min, `shots.md` §3). Vignette windows and the explainer graphics are not world changes **only** if they open from and close into an object of the current picture.
- **Motion budget:** at most 1–2 moving main elements at once, the camera counts. Never two onsets on the same frame (stagger ≥ 0.15 s).
- **Camera keys sit on words** (`camAt` keys built from `T.G`). No pitch on the road (horizon fixed per shot); the sink under the road (10.02) is a vertical move with the horizon leaving the frame top. **No flights along the road**; the only flights are into the bubble skin (2.07/3.09) and into a window rect (3.03, 12.04).
- **Nothing from nowhere:** the line drops in from above the frame, icons fly out of the object they were, text rises from its baseline (`rise`, `maskLine`), a window opens from a rect of light that was already there, stops grow out of the route line.
- **Never a still image > 2 s; hold 1.5–3 s after each accent.** Text holds while read (≥ 1.5 s, ≥ characters/12 s; quote cards and the question 11.21 ≥ 4 s).
- **Subtitles are burned in at the bottom (≈ y 900–1050):** nothing important below y 860; HUDs live in the top corners (umbrella x 60–180 / y 50–170, counter x 1620–1860 / y 50–150); clip lower thirds at y ≤ 860.
- **Measure:** `python3 tools/calm.py <mp4> --scale 1280:720` (cuts ≤ 0.9/min, mafd median ≤ ~0.45, luma 40–60), `python3 tools/smooth.py <mp4> <start>` (**0 LURCH/POP**), `SECS=cNN,cMM node tools/seam.mjs --at T0` at every chunk seam.

## 6 · Carriers at the chunk seams (inside a chunk: `shots.md`, last column)
| Seam | Carrier | Type |
|---|---|---|
| c01 → c02 (`If this is the crash, its clock`) | the milestone counter `DAY 030` beside you; push in, it fills the frame | push / same object |
| **c02 → c03** (Lead → B1, `Mostly, data centers`) | `plateBubble`: **inside the bubble skin**: the frame is the curved film (COOL bands, gold sheen), the hall's cool window rows faint behind it | seam plate → B1 pulls back off the skin into the hall |
| c03 → c04 (`Day thirty-one`) | gore 1 (lit panel) drops and becomes your phone's screen on the table | transformation, down |
| c04 → c05 (`Day forty-eight`) | the table edge becomes the road's horizon | match line, forward |
| c05 → c06 (`But what if the fall`) | the red line leaves the exit window and runs along the road's edge into the town | the line carries, pan down |
| **c06 → c07** (B1 → B2, `And if the fall keeps going`) | `plateLine`: **the payslip, close**, the red line across it, in the mailbox flap's light | seam plate → B2: the payslip folds into the money stack |
| c07 → c08 (`Day two hundred eighty-two`) | the HUD counter grows, its flaps open onto the route map | transformation |
| c08 → c09 (`Day nine hundred twenty-nine`) | you walk past the 2009 sign on the road; the next sign (929) comes to you | same road, walking |
| c09 → c10 (`On a road this long`) | the many roads narrow back to yours; your small umbrella | pull in |
| **c10 → c11** (B2 → B3, `On Black Monday`) | `plateNet`: **under the road**, the 1933 net close at the bottom, the 1987 pillar centred ahead, cold light | seam plate → B3: along the 1987 pillar into the trading-floor window |
| c11 → c12 (`Day one thousand`) | the message's send arrow becomes the HUD counter, which grows and lands on DAY 1,000 | transformation |
| c12 → end screen | pull back over the road at first light | camera |

Seam plates (`lib/f19_seams.mjs`, lead) are screen-space pictures both sides draw for 0.5 s on each side of T0 (same mechanism as Film 18: `seamWindow`, `SEAM_HALF`). Builders never edit them. Preview: `node tools/seam_plates19.mjs <dir>`.

## 7 · Text and graphics
- **Real explainer graphics made from objects**, light on night: no panels, no gridded axes, no legends, no chart frames. Lines are light trails (`trailSpan`), bars are light columns from a ground line, shares are points or cells, never a pie unless it is one whole.
- **Type:** numbers and quotes Instrument Serif (cream, warm glow); labels and sources Inter 600 (`P.halo2`); exit names Inter 700 caps, letter-spacing .12em. Number ≥ 120 px, label ≥ 34 px, source ≥ 24 px at 1080p. At most one number and ≤ 6 words plus source per graphic.
- **Hook title** `WHAT PROTECTS YOU`: the thumbnail's look (heavy condensed caps, cream, ≥ 1/8 frame height) in the left half, x 90–900; it sinks to its baseline in 1.02 (never fades).
- Only numbers from the fact check; every number with its source (`shots.md` §4). Items marked ✱ wait for `faktencheck-v3.md`: build them, but keep the number in one constant at the top of the scene file.

## 8 · Kit (what we reuse, what the lead adds)
**Reuse unchanged** (copied from Film 18):
- `lib/f10_editorial.mjs`: stage (`card`, `cam3`, `camAt`, `aim`, `camDrift`, `F0`, `project`), palette `P`, `du` (walk gait, look, arms), `person`, `glowText`, `halo`, `glowFill`, `dust`, `stars`, `ground`, `lightPool`, `lightForm`, explainer helpers `counter`, `bars`, `curve`, `timeline`, `flow`, `compare`, `section`, `finish`, `prng`.
- `lib/f16_kit.mjs` / `lib/f13_kit.mjs`: `quote`, `rule`, `stamp` (CRASH?, ON HOLD, SEVERELY ADVERSE, DEPOSITS INSURED), `rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `hourglass` (7.08, 11.04).
- `lib/f18_kit.mjs`: `tag` (COST PER TASK, 12.07), `coin`, `evap`, `bump`, `wp`/`gp`/`stand` (cards standing on a ground plane: the road and the town), `COOL`.
- `lib/kit.mjs`: timing `T.G`/`T.GE`/`T.clip`, `clipScreen`, `clipLabel`, `quoteCard`, `source`. `film.mjs`/`engine.mjs`/`render.mjs`, `tools/calm.py`, `smooth.py`, `seam.mjs`.

**New for Film 19 (`lib/f19_kit.mjs` + `lib/f19_seams.mjs`, built by the lead before the builders start):**
1. **Palette + ground:** `PRINT19`, `RED`, `GROUND`, `crisis(t, T)`, `nightGround(ctx, crisis)` (the `F19_GROUND` switch).
2. **Umbrella:** `umbrella(ctx, t, x, y, r, { open, lit[5], wide5, flare: [{x, t0}], glow, a })` (canopy of five visible gores, rib lines, shaft, your hand), `hudUmbrella(ctx, t, lit[])`, `goreIcon(ctx, i, …)` (phone face down / pause, magnifier, envelope, price tag, net), `flyToGore(t, t0, from, i)` (arc path → position + scale).
3. **Clock:** `flap(ctx, t, x, y, h, { from, to, u, snap })` (split-flap digits, rattle + snap + settle), `hudDay(ctx, t, T)` and `dayAt(t, T)` (one shared table of the HUD value per phrase, so every chunk shows the same day).
4. **Road world:** `road(ctx, c, t, { mist, warm, lit })` (night plain + road into depth + verge), `exitSign(ctx, c, t, X, Z, { name, day, year, glyph, open })` (returns the window rect), `goalSign`, `town(ctx, c, t, { … })` (houses, shop, bus stop, mailbox, glass door as standing cards), `underRoad(ctx, c, t, { nets, gap })` with `pillar` and `netSpan(ctx, t, p0, p1, { knot, sag, catch })`.
5. **Route map:** `routeMap(ctx, t, { u, dot, stops: lit[], names: u[], from: 'road' morph })` with the four stops at true scale and their glyphs (container, dial, bank façade with a crack, `www` bubble).
6. **Loss line:** `SPX` (record, low, days, % for the four exits + 2020; intermediate points shape-only, endpoints exact from the fact sheet), `lossLine(ctx, t, rect, series, u, { tip, gold })`, `shards(ctx, t, x, y, t0, { n, seed })` (deterministic, fall slowly).
7. **Windows:** `vWindow(ctx, t, rect, open, draw)` (a lit gold-rimmed frame that opens from a rect, clips its inside, night mat around), `clipWindow(ctx, t, T, id, rect)` = `vWindow` + `clipScreen` + `clipLabel` + quote-card fallback. Clip frames: `CLIPDIR` = `$F19CLIPS` or `films/19-ai-crash/clips/frames/<id>/f00001.jpg` (git-ignored; extracted once with ffmpeg at 30 fps from `clips/C1.mp4`, `clips/C3.mp4`).
8. **Bubble:** `bubble(ctx, t, x, y, r, { tremble, pop, film })`, `skinFlood(ctx, a)` (the bubble-film flood for the flight through the skin; replaces `lightFlood` for 2.07/3.09).
9. **Points and cells:** `dots100(ctx, t, layout, state)` (grid ↔ windows ↔ bars, leaving points), `coin100(ctx, t, x, y, r, lit, col)`.
10. **Small props (one module `lib/f19_props.mjs`):** `phoneHand` (hand + phone, face down / up, screen draw callback), `table` + lamp, `stopwatch`, `dice`, `container`, `rateDial`, `bankFacade`, `cashRegister`, `scale`, `iouSlip`, `calendar`, `payslip`, `mailbox`, `envelope`, `magnifier`, `lever`, `shakeTable`, `fundTower`, `figureIcon`.
11. **Seam plates:** `plateBubble`, `plateLine`, `plateNet` (+ `tools/seam_plates19.mjs`).

**Memory:** never build a canvas/pattern/gradient cache per frame; build cached things once at load. Render with `node --expose-gc`, pieces ≤ 20 s. `Path2D` from `@napi-rs/canvas`.

## 9 · Clips
- C1 Powell (3.04) and C3 Hassabis (12.05) play inside a `vWindow` that grew out of a lit rect of the picture before (a hall window). ≥ 75 % frame width, gold rim, night around it, a slow push (alive). Lower third left at y ≤ 860. Out: the window shrinks back into its rect.
- The VO timing carries the clip slots (`T.clip('C1')`, `T.clip('C3')`); the audio agent writes them into `timing.json` as `{ id, kind: 'clip', start, end }` (the provisional timing already does).
- Until the MP4s exist, `clipWindow` draws the **quote-card fallback** (exact transcript, `clips.json`), so the picture never waits for the download.
- Only two clips (rule: 3–6). A third is the coordinator's call (option: C1b Warsh before 11.09); the plan has room for it as a window opening from the money streams in 11.10.

## 10 · End screen (≤ 15 s after the VO end, 12.17)
The road at first light running into depth, the nets faint under it, you tiny with your umbrella closed in hand, walking on; HUD `DAY 032`, its last flap trembling. **Free areas:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), centre x 810–1110, y 330–600 (subscribe). **Never static:** slow pull back, your walk, mist, music runs on.

## 11 · Gates (in this order)
1. Plan first: the shot in `tools/shots19.py` (anchor word, picture, 1–2 moves, transition with carrier), regenerate `shots.md`; the explainer share must stay 60–70 %.
2. **20-second style test** (channel rule): the lead renders c01 0–20 s (thumbnail opening → Nov 5 → CRASH?) for Jakob before the builders start; with the release tomorrow, the builders may start in parallel on the same kit while Jakob looks.
3. Build, then look: stills around each move and one per sentence (`render.mjs --snap … --scale .4`, contact sheet). At least 3 review rounds.
4. Measure (§5), numbers into the report.
5. Self-grade 1–5: poster · sentence = picture · seamless (object carries) · calm · alive · explainer from objects · text · names not years. Nothing under 4.
