# Film 23 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-06 (phase 1: plan)

**Not started yet.** The picture build begins only after Singularity Friday (#22) reports its builders done and Jakob has approved the 20-second style test (1.01–1.03). Then the picture lead builds the kit (`lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`) and c01–c02 as the quality reference; then **three builders, B1, B2 and B3**, build the middle of the film at the same time, each ≈ 2.5–3 minutes. The lead also builds c12 + the end screen (it rhymes with the opening).

Timing: the real VO `film-erster-tag/2037/audio/timing.json` (written by the audio agent) is what the engine reads; `data/provisional_timing.json` (145 wpm) is only the fallback. Everything anchors on phrases, so a re-voiced line moves your picture with it. Times below are provisional.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md` (THE STREET IN SECTION, the day-clock, the evidence cards, the old screen, figures, palette, calm rules, carriers, kit)
   3. `docs/shots.md` (your shots with phrase anchors, carriers and transitions; binding; §4 = the only numbers and the exact on-screen text)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API) and the headers of `lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`
   5. `/mnt/project-files/scenario/film-erster-tag/2037/text-v5.md` (your movements, with the stage notes) and `vo-v5.txt`
   6. `/mnt/project-files/scenario/film-erster-tag/2037/faktencheck-v5.md` (only these facts)
3. **Look at** the reference: the lead's c01/c02 render and contact sheet (path in the lead's report) and the code `scenes/sc01.mjs`, `scenes/sc02.mjs`. They are the pattern and the quality bar:
   - one plan sequence per chunk (one entry); the camera travels along the street instead of cutting;
   - camera from `camAt(t, K, ref)` keys on words; pass the subject depth as `ref`;
   - everything that appears comes from somewhere (a window, the phone, the voice-light, a thread, the lamp pool, the old screen's point); text rises from its baseline;
   - reactions computed from positions (the line reaches a window → the ring lights);
   - figures are alive (`alive(t, seed)`: breath, weight shift, glances, blink beat) and their arms move naturally.

`/mnt/project-files` is a network mount: exact paths only (with trailing slashes for folders), never search the whole folder; only small jpg contact sheets go there. Renders stay in your own scratchpad.

## 1 · Split (real VO timing, 619.9 s; in code anchor only on phrases)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **Lead** | c01, c02 · c12 + end screen | 0–80.72 · 552.38–619.90 | 148 s | Hook (the year, the clock birth, the message, ★ the other way vs everyone), 06:15 (★ one scan against all, no bill, the kettle, the voice-light next door) · 22:30 (the sleeping kid, the call, lights out, ★ the year rolls back, the title, end screen) + the kit, HUD and seams |
| **B1** | c03, c04, c05 | 80.72–239.02 | 158 s | 07:30 the tutor (★ the ladder of questions, the blueprint) · 09:00 the night shift (headlines, breakthroughs like weather, ★ the tower at night, the fan of rays, the testers' house, the wait) · 12:00 the agent (forms, the gate, the plan bars, ★ the cool thread that can't attach, the lawyer in your pocket, Dad's window) |
| **B2** | c06, c07, c08 | 239.02–411.13 | 172 s | 16:00 Dad (the walk, the balcony, earbud bubbles, height marks, ★ the same earbuds for the whole building, the price ladder) · 19:00 dinner I (the pea, the homework, ★ the fork, **K1** on the old screen) · dinner II (the other road, ★ one in five, the testers' gate) |
| **B3** | c09, c10, c11 | 411.13–552.38 | 141 s | Dinner III (the bars, ★ the threads re-tied, doctor/lawyer/agent, **K3**, the keys) · dinner IV (★ luxury → library, who paid, the close race, the exam chart, **K4**) · dinner V (the school, the three questions, ★ millions, the notebook) |

Chunk boundaries (`film.mjs CHUNKS`, real timing): c02 `You open the scan` 31.34 · c03 `Seven-thirty` 80.72 · c04 `Nine o'clock` 126.72 · c05 `Noon` 189.32 · c06 `Four o'clock` 239.02 · c07 `Seven o'clock` 305.88 · c08 `When you were a baby` 360.88 · c09 `And today you say` 411.13 · c10 `And Grandpa's earbuds` 454.92 · c11 `And the grown-ups practiced` 509.38 · c12 `Ten-thirty` 552.38 · VO end 604.0 · film end 619.9. Clip slots: K1 351.40–360.20 (B2, c07) · K3 436.18–443.88 (B3, c09) · K4 496.20–508.70 (B3, c10). Subscribe line 1 294.7–303.6 (B2, end of 6.06): keep the picture calm and rising over the city (MOTION §13.7); the HUD draws the channel mark and pauses the clock.

## 2 · The seams between the groups (fixed, defined by the lead)
The four group seams sit on a **shared picture**, a plate from `lib/f23_seams.mjs`. Both sides draw the plate from the same function with the same `t`, so the frames left and right of the seam are identical.
- The handing side steers its last move so the picture lands on the plate (camera key on `T0 − 0.5`, sine-S; carrier parameters lerped onto the plate values) and draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate pulls back or becomes a thing of the new world, never by a dissolve.
- The HUD (day-clock, evidence cards) is drawn by the film over everything, also over plates; you never draw it.

| Seam | T0 (phrase) | Plate | Hand-over (end of the group before) | Take-over (start of the group after) |
|---|---|---|---|---|
| **Lead → B1** | `Seven-thirty` (80.72) | `plateGenius`: the tutor's voice-light close: `K.voiceLight(960, 500, 150, {talk: .25})` over a dark room, its cool light on a table below, no figure | 2.06: the camera trucks through the cut wall into the kid's room and pushes onto the voice-light on **With a genius** | 3.01: pull back: the light now hovers over the **kitchen table**, the kid in pajamas, the clock jumps to 07:30 |
| **B1 → B2** | `Four o'clock` (239.02) | `plateWindow`: Dad's lit window (`WINDOW_PLATE` 300 × 380 at (960, 520), gold `K.WARM`) in his dark indigo facade, a plant on the sill | 5.06: you walk to your window, push past your shoulder toward Dad's window on **Telling your dad** | 6.01: the clock jumps to 16:00; pull back and truck: you walk the two streets over |
| **B2 → B3** | `And today you say` (411.13) | `plateWall`: **the world itself**: `K.world(ctx, K.CAM_WALL, t, WALL_STATE)` (19:30, lamp on, the light wall empty, the table edge at y ≈ 880). Nobody inside this frame at T0 ± 0.5 (seat people at `KITCHEN.seats` outside it or let them leave the frame before). Both sides may simply hold `CAM_WALL` with `WALL_STATE` around T0 | 8.05: the testers' gate graphic sinks into the wall's lower edge on **before it reached anyone** | 9.01: the agent's light lowers into the wall with its gold thread |
| **B3 → Lead** | `Ten-thirty` (552.38) | `plateNotebook`: the open notebook close in moonlight (`NOTEBOOK_PLATE`), `Why did it go well?` (pencil) and `Because people kept asking.` (gold handwriting) on the right page | 11.06: push onto the page on **doesn't know about your scan** | 12.01: the clock jumps to 22:30; pull back to the kid asleep at the table |

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first of cN+1 (simplest: a shared drawing function in your own `lib/f23_bN_*.mjs`). Carriers are in `MOTION.md` §10 and in every row of `shots.md`.

## 3 · Hard rules for the picture
- **One world: THE STREET IN SECTION.** Everything happens in the cut-away street (your building, the clinic, Dad's building, the tower, the testers' house), in its sky, or on the kitchen's light wall. Travel along the street instead of cutting. Hard world changes only where `shots.md` §3 lists them.
- **Mix 3D-like scenes with real explainer graphics** grown from world objects. The plan's explainer share is **63 %**; keep your chunk at its share in `shots.md` (do not turn an [EXPL] row into a plain scene). Each graphic shows exactly what its sentence says, readable without sound, one statement, at most one number and ≤ 6 words of label. No generic chart panels, frames, gridded axes, legends.
- **Every transition carries an object into the next** (named per row). No cross-fades, no fade to black, no wipe, nothing fades in half-transparent from nowhere.
- **Calm:** max ~1 hard world change per minute, slow camera on word keys, max 1–2 moving main elements at once, never a still image > 2 s, hold 1.5–3 s after accents.
- **The clock and the cards are not yours** (HUD). Keep the zones free (`MOTION.md` §9): x 60–420, y 40–180 always; x 60–820, y 40–430 while a card is open (card times: `shots.md` §4); no key information below y 930 (subtitles).
- **The clips (B2: K1, B3: K3 + K4)** play on the old screen: build the CLIP IN (your carrier → the line → the screen opens, push) and CLIP OUT (collapse → point → your next carrier) with `oldScreen()` from `f23_hud`, exactly as `MOTION.md` §5. No card, no other motion while a clip plays.
- **You** (tiny, faceless, yellow: `K.you` draws the **hoodie** indoors and the raincoat with `out: true` outdoors) are the viewer: small gestures on the words that concern you (lift, nod, hands flat on the table, lean). **The kid, Dad and everyone else** are indigo/blue silhouettes, no yellow, no faces (the kid and Dad may get two dot eyes in close-ups: `eyes: true`, they blink), always alive (breath, weight shift, glances, blink beat), natural two-segment arms.
- **No doom:** the "other way" is cool and dark, never red, no ruins. The machine is light (cool spheres, discs, windows), never a robot.
- **No company logos:** names as type only on the cards. The K4 footage keeps its logo small or cropped (lead/clip cutter).
- **Timing:** anchor on phrases from the timing file, never hard-coded seconds.

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc03.mjs` … `sc05.mjs`;
  - B2: `scenes/sc06.mjs` … `sc08.mjs`;
  - B3: `scenes/sc09.mjs` … `sc11.mjs`;
  - plus your own modules `lib/f23_b1_*.mjs`, `lib/f23_b2_*.mjs` or `lib/f23_b3_*.mjs`.
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/figure.mjs`, `lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`, `lib/kit.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, the lead's scenes (`sc01`, `sc02`, `sc12`), the other builders' files, and anything under `audio/` (the audio agent).
- **Something missing in the kit or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t) }` (the film applies `PRINT23` and the HUD; reference: `scenes/sc01.mjs`); `R = { a, b }` is the chunk range. A chunk is normally **one** entry (plan sequence); a second entry is a hard cut, allowed only where `shots.md` names a match with a rhyming carrier (the clip slots are drawn inside your entry by `oldScreen()`).
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset`.

## 5 · Kit (final signatures; read the file headers, and `scenes/sc01.mjs` as the worked example)
**The world model** (`lib/f23_kit.mjs`, import as `K`): one physical world, perspective camera without pitch or roll. X right, **Y down** (ground Y = 0, up is negative), Z away from the camera, world units = design px at depth `F0` 1700. The horizon is always the screen's middle line. Rooms have depth: the cut (open front) at `K.ZS` 3000, the back wall at `K.ZB` 3600.
- **Camera:** `K.look(X, Y, Z, s, sx?, sy?)` → the cam3 that shows world point (X, Y, Z) at screen (sx, sy) with s px per world unit · `E.camAt(t, [[t, cam, ease], …], ref)` (ease `'s'` sine, `'l'` trapezoid = calmer peak, `'q'`, `'i'`, `'o'`; pass `K.ZB` or `K.ZS` as ref) · `E.camDrift(cam, t, .5, seed)` · `K.wp(c, X, Y, Z)` → [x, y, s] · `K.atZ(ctx, c, Z, fn(s))` draw in world units on the plane at depth Z · `K.quad(ctx, c, [[X,Y,Z]×4], fill)` · `K.floorPool(ctx, c, X, Y, Z, r, col, a)`.
- **Cameras ready:** `K.CAM_THUMB` (thumbnail A), `K.CAM_WALL` (the whole light wall, table edge y ≈ 880: dinner explainers), `K.CAM_SCREEN` (end of the clip push: the old screen at x 266–1754, y 161–998; inside the kitchen, works).
- **Layout:** `K.STREET` (`you`, `hall`, `kitchen`, `kidRoom`, `clinic`, `dad` {level 3, balcony}, `tower` {x 4000, z 16000}, `testers` {x 600, z 9000}, `rows`), `K.FLOOR` 520, `K.SLAB` 30, `K.floorY(level)`, `K.KITCHEN` (floor −1040, ceil −1530; `counter`, `kettle`/`phone` [X, Y, Z], `table` {x0, x1, top, z0, z1}, `lamp` (pendant right of the wall), `door`, `you` [X, Y, Z], `seats` {left, right, front: [X, Z]}), `K.LIGHTWALL` {x −1620, y −1510, w 520, h 400, cx, cy, z = ZB}, `K.SCREEN` {x, y, w, z} (16:9 in the light wall). Figures: you 140, kid ≈ 100, Dad ≈ 145 world units tall.
- **World:** `K.world(ctx, c, t, o)` draws everything back to front; returns `{ L }`. o: `hour` (float; the light of the hours, `K.hourLook(h)`), `winFn(w) → {lit, gold, cool}` per window (or `win`, `cool` shares), `tower {glow 0..1, open 0..1}`, `testers {open 0..1}`, `clinic {glow}`, `dad {open 0..1, lamp, rooms, items: {l3a: [[Z, fn]]}}`, `you {hallLamp, rooms, cool, kid {asleep, lamp}, kitchen: {…}}`, `lamps` (street), `over(ctx, s)` (ZS world units, drawn last on the section plane). **Kitchen o:** `lamp 0..1`, `wall 0..1` (the wall's own glow), `scan` (`scanArt` o) or null, `wallFn(ctx, LW)` (**draw your light-wall explainers and `oldScreen` here**, world units on the wall plane), `phone {on, buzz, gold}` or null, `kettle {steam}`, `table`, `chairs`, `people: [[Z, fn(ctx, s)]]` (figures at their depth; feet at `KITCHEN.floor`). Layers alone: `K.sky`, `K.skyline`, `K.tower`, `K.testersHouse`, `K.backRow`, `K.streetRow`, `K.streetFront`, `K.yourBuilding`, `K.dadBuilding`, `K.kitchen`, `K.room` (any room in depth). `K.cityWindows()` lists every window `{X, Y, Z, w, h, r, q, id, room?}` for line fans.
- **Figures** (alive built in: breath, weight shift, glances, blink settle; one seed per figure): `K.you(ctx, x, y, h, t, {pose, dir, look, lean, armR, armL, walk, cup: 'R'|'L', steam, out, seed})` → hands `{R, L}` · `K.kid(…, {eyes, colors})` (blue pajamas, ponytail) · `K.dad(…, {eyes, earbud})` (cardigan, grey-blue hair, cool earbud dot) · `K.other(…)` · `K.alive(t, seed)` → {b, w, turn, nod, blink}. Poses from `E.du`: stand, look, lift, point, reach, hold, walk (with `walk` phase), sit.
- **Objects** (caller's coordinates): `K.scanArt(ctx, x, y, w, h, t, {a, draw, ring, tight, spot, collapse, timeline, small})` · `K.goldLine(ctx, a, b, u1, {u0, lift, w, a, cool, spark})` (arcs; returns the head) · `K.priceTag(ctx, x, y, s, u, {cool})` · `K.voiceLight(ctx, x, y, r, t, {a, talk, warm})` · `K.answerCube(ctx, x, y, s, t, {seal, open, a})` · `K.qStep(ctx, x, y, size, t, {u, lit})` · `K.agentLight(ctx, x, y, r, t, {a, warm, keys})` · `K.thread(ctx, a, b, t, {u, sag, cool, w, a, slide})` · `K.capsule(ctx, x, y, w, t, {cool, a})` · `K.road(ctx, pts, u, o)` + `K.monthTicks(ctx, pts, n, k, {size})` · `K.earbuds(ctx, x, y, s, t, {a})` · `K.bubble(ctx, x, y, r, t, {u, cool, tail})` · `K.library(ctx, x, y, w, t, {u})` · `K.notebook(ctx, x, y, w, t, {moon, lines})` + `K.handwrite(ctx, text, x, y, size, u, {col, glow})` · `K.phone`, `K.kettle`, `K.steam`, `K.coolPoint` · colours `K.COOL` {core, mid, edge, deep} (machine), `K.WARM` {deep, mid, hi} (room light), `E.P` (palette), `K.PRINT23`.
- **`lib/f23_hud.mjs`** (the film draws it; you only call `oldScreen`): `oldScreen(ctx, t, { x, y, w, clip: T.clip('K1'), line: [x0, y0], tLine?, tOn? })` → `{ phase, point, open }`, in the caller's coordinates (pass `K.SCREEN` inside `wallFn`); phases idle → line → spread → open (placeholder card with name + transcript until `ROOT/clips/K1/f00001.jpg …` exist, then the footage) → collapse → point (your carrier) → gone. `HT.cards` (resolved card open/close times) and `CARD`/`ZONE` tell you when the card zone must stay calm.
- **`lib/f23_seams.mjs`:** `SEAM_HALF` (.5), `seamWindow(t, T0)`, `seamT(T, 'genius' | 'window' | 'wall' | 'notebook')`, `plateGenius`, `plateWindow`, `plateWall` (+ `WALL_STATE`), `plateNotebook`, `GENIUS_PLATE`, `WINDOW_PLATE`, `NOTEBOOK_PLATE`; stills: `node tools/seam_plates23.mjs <dir> .4`.
- **Base:** `f10_editorial` (`E.camAt`, `E.camDrift`, `E.cam3`, `E.P`, `E.halo`, `E.glowText`, `E.glowFill`, `E.dust`, `E.trail`, `E.lightShape`, `E.counter`, `E.bars`, `E.curve`, `E.du`, `E.person`, easings incl. `E.trapIO`), `f16_kit`/`f13_kit` (`rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts`), `figure.mjs` (gait `walk(phase)`).
- **Quality bar = `scenes/sc01.mjs`** (contact sheet `/mnt/project-files/scenario/film-erster-tag/2037/bild/c01_kontakt.jpg`): one plan sequence, three slow travels, holds measure mafd 0.06–0.26.
- **Memory:** no canvas, no pattern, no gradient cache per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas`.

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f23/bN/`. Nothing big into `/mnt/project-files`.

**Review stills** (small):

```
cd /home/user/scenario/films/23-2037
SECS=c06 node render.mjs --snap 240,241.5,243 --dir $SP/f23/b2/snap --scale .4
```

Then build a contact sheet and **look at it**.

**Video** (full quality): pieces ≤ 20 s, always with `--expose-gc`; never more than one render per builder at a time.

```
SECS=c06 node --expose-gc render.mjs --out $SP/f23/b2/c06_a.mp4 --from 239.38 --to 259
SECS=c06 node --expose-gc render.mjs --out $SP/f23/b2/c06_b.mp4 --from 259 --to 279
```

Then join with `ffmpeg -f concat -c copy` into `$SP/f23/bN/cNN.mp4`.

**Delivery per chunk:**
- video: `$SP/f23/bN/cNN.mp4`; the path goes into the report;
- contact sheet (1 frame/s, small jpg, ≤ 1 MB): `/mnt/project-files/scenario/film-erster-tag/2037/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition) and everything ugly or unclear fixed. At least 3 review rounds. Check: every frame is a poster; sentence = picture; the hero is the brightest thing; you are never cut off except in a deliberate move; text readable on a phone (390 px wide copy); the reserved zones are free; the figures breathe and their arms move naturally.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned matches; the clip slots are excluded); mafd median ≤ ~0.45; luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams also check against the plate; the lead checks both sides.
5. **Calm rules** (`MOTION.md` §9): 1–2 moving main elements; no still image > 2 s; 1.5–3 s hold after accents; nothing from nowhere; no dissolves, no fade, no slide.
6. **Explainer share** of your chunk as in `shots.md` (± 5 points).
7. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · graphics from world things · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk: calm, smooth, seam, explainer share.
- Kit wishes.
- Open points and deviations from `shots.md`, with the reason.
- Which files you created or changed (so the lead can commit exactly those).
