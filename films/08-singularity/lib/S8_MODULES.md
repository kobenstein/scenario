# Film 8 · shared modules (B1), API notes

Owner of every file below: **B1**. Import them, never edit them; ask for an option in `m1/bild/requests.md` (who, module, what).
Signatures are final; the drawing gets better while B1 builds c02–c04 (options are only ever added). Each file's header has the full
option list; this page is the overview. Units: world = metres, s8_kit `camera` (+Y up, yaw > 0 turns right, pitch > 0 looks down);
screen = 1920 × 1080 px. Everything is a pure function of `t`.

## lib/handoff4.mjs: chunk handoffs (shots.md §9)
- `HAND` table (B1 keeps it): c01>c02 `sky` deep · c02>c03 `paper` lamp · c03>c04 `glass` · c04>c05 `line` cream y 600 on the card sky ·
  c05>c06 `paper` lamp · c06>c07 `sky` dusk · c07>c08 `light` fire · c08>c09 `sky` deep · c09>c10 `line` cream vertical (ang π/2, dark ground) · c10>c11 `light` fire.
- `hand(key, T)` → `{ t, a, b, o, print, plate(ctx, t) }`; `handsOf(id, T)` → `{ in, out }`. film.mjs draws the plate from `a` to `b` and drops your
  entries inside that window. **Outgoing**: at `H.a` your frame must already be the plate. **Incoming**: first entry `{ t: H.b, tr: 'cut', d: .1, draw,
  print: H.print }`, at `H.b` your frame still is the plate, then you leave it.
- Helpers so the plate's surface can live inside your world:
  - `SKY0` / `skyCam(o)`: the one sky view of the `sky` plates. `drawSky(ctx, t, skyCam(H.o), skyOpts(H.o))` IS the plate; tilt your own camera to
    `{ yaw, pitch, F } = H.o` (position does not matter) and the frame equals it. `skyOpts` adds the dawn for `tone: 'dusk'`.
  - `paperLamp(ctx, t, { rect })`: the lamp-lit paper in PLATE SPACE (1920 × 1080 = the frame at the handoff). With s8_desk `sheet` and
    `plateCam` you get this for free (below).
  - `lineGround(ctx, t, o)` + `lineStroke(ctx, t, o)`: the ground and the engraved line of a `line` plate (`o.x0/o.x1` grow it from one end).
  - `glassPlate(ctx, t)`: the dark pane.
- Check a boundary: `SECS=c04,c05 node render.mjs --snap <H.a-1/30>,<H.a>,<H.b>,<H.b+1/30> --dir …`.

## lib/s8_card.mjs: clips, quote cards, labels (§8.Q)
- `clip(ctx, t, T, id, o)`: any clip C1…C7, full frame, opaque footage, slow push 1.00 → 1.03, punch-in to 1.10 on every jump cut (from
  clips.json `parts`/`cuts`, or `o.cuts`), lower third + ORIGINAL FOOTAGE (from clips.json name/role, or `o.info`).
  - `carrier: 'line'` (default): black frame, the line at `o.yOpen` opens (`o.open`, default [start − .3, start + .04]) and closes back to a line
    at `o.yClose` (`o.close`, default [end + .02, end + .3]). Draw nothing else in that window.
  - `carrier: 'frame'`: draw your world first, then `clip(…, { carrier: 'frame', from: [x, y, w, h] | (t) => rect, to })`: the object's rect grows
    to the full frame in .35 s (expo-out) and shrinks back into `to` in the last .35 s (expo-in).
  - Until a clip's frames exist (`m1/clips/Cn/f00001.jpg`) it shows a breathing placeholder marked "FOOTAGE PENDING · Cn", timing already right.
- `quoteCard(ctx, t, T, 'Q1', { lines, name, source, at, out, line: { y, style: 'cream' | 'split', u } })`: the title-card style quote on the card
  sky (Anton ~80 px, cream glow, each line rises out of its mask; name · source in Inter caps above a thin amber rule). Lines are given, not
  wrapped (max 3). At `out` the quote lifts away and the card line stays (so it can carry into the next shot).
- `cardLine(ctx, t, o)`: the card line alone (same `o` as `line`), for the shot before / after the card.
- `label(ctx, t, ax, ay, u, top, bottom, o)`: small label on a leader line (Inter caps, wiped in from below); `o.side 'left'`, `bottom` may be ''.
- `lowerThird`: re-export of f6_kit.lowerThird.
- `lib/s8_clip.mjs drawClip` = the approved C1 call (kept pixel-identical for c01).

## lib/s8_rose.mjs: the one compass geometry (§6 "Two compasses")
- `POINTS`: N (house + lit window), E (kite), S (ring of people round a fire), W (zigzag tack line), screen angles −π/2, 0, π/2, π.
- `icon(ctx, kind, x, y, s, { u, ink, lw, lit, mode: 'ink' | 'light', t })`: one icon, draw-on `u`, `lit` = amber glow; `mode 'light'` = clean
  glowing strokes for OUR rose on the sea (B2 seaRose). Returns anchor points (`window`, `fire`, `string`, `tip`, and `pen` while drawing).
- `needle(t, kicks, o)` → angle offset: kicks `[{ t, amp }]` swing, overshoot ≤ 5 %, settle (1.4 s), then breathe (±.03 rad).
- `inkRose(ctx, t, o)`: YOUR compass, ink on paper, in the current transform (use it inside a `sheet` draw, in plate space): `ring`, `cross`,
  `points[4]`, `letters[4]`, `icons[4]`, `words[4]` (unreadable scribbles), `lit[4]`, `needle` (screen angle, −π/2 = north) + `needleU`,
  `glow` (ring glows amber). Returns `{ centre, tip(i), pen }` (`pen` = where the pen is while something is being drawn: put `penHand` there).

## lib/s8_desk.mjs: YOUR table by the window
- World: origin on the floor under the table; +Z → the window. `DESK = { top .76, x0, x1, z0, z1, wallZ .62, win, lamp, seat }`.
  A camera behind you: `camera({ x: .15, y: 1.45, z: -1.35, pitch: .32, F: 1300 })`; close on the sheet: `{ x: .05, y: 1.25, z: -.45, pitch: .95 }`.
- `room(ctx, t, C, o)`: the whole room in one call: dark wall lit by the lamp, the window onto the s8 sky + sea (same camera), the lamp's and
  your reflection in the glass (`o.reflect: { ring }` = the glowing ring at the reflection's chest), the table, `o.items` (sheets), the oil lamp
  (`o.lamp`, `o.wind` bends the flame), you from behind (`o.person: { turn }`). Returns screen points `{ lamp, window, head, ring }`.
- `sheet(ctx, t, C, { x, z, w, aspect, rot, tilt | corners, draw(g, t, W, H), lamp })`: a lamp-lit paper object; its texture is PLATE SPACE
  (1920 × 1920/aspect px) with the `paperLamp` shading, your `draw` paints ink on it. Perspective-correct (mesh).
- `plateCam(sheet, F)`: the camera straight above a flat sheet at which the sheet IS the `paper` lamp plate (+ your ink). End your push-in on it
  at `H.a` (c02>c03, c05>c06); start your pull-back from it at `H.b`. Ink that should not be in the plate must be out of the sheet by `H.a`.
- `penHand(ctx, t, x, y, s, { lift, ang })`: your right hand with a pen, nib at x, y (screen). `personBack(ctx, t, C, o)`, `lampLevel(t)`,
  `glass(ctx, t)` (= the glass plate), `texQuad` (image onto a projected quad), `lerpCam(a, b, u)`.

## lib/s8_cloud.mjs: clouds and weather
- `TONE` (overcast `#2a3346`/`#55607a`, storm, dawn), `tone(ctx, C, kind, k)`: that light over sky and sea (a lighting change, k 0..1).
- `lid(ctx, t, C, { close, az, tear, tearAz, tearW, tone, base, lit })`: the overcast deck at infinity; two ragged fronts close over the sky from
  both sides of `az` (`close` 0 → 1), `tear` opens a gap again (c06.12). `bank(ctx, t, C, { az, w, h, lit, a })`: one cloud bank on the horizon,
  underside lit (an island below it). `rain(ctx, t, o)`, `wind(ctx, t, o)`: screen-space rain curtains and wind streaks.
- B2's `s8_storms` builds the three storms; these are the plain weather pieces.

## lib/s8_crowd.mjs: people from behind
- `crowd(ctx, t, C, people, { light: [X, Y, Z], lamp, dim })`: depth-sorted silhouettes (figure.mjs figureBack: breath, weight), rim from the light.
  Person: `{ x, z, h, pose: 'stand' | 'sit', hold: 'lantern' | 'torch' | 'phone' | null, raise, turn, flinch, seed, dress }`.
- Layout helpers: `rows(o)` (cinema rows facing +Z), `circle(o)` (a ring facing in, with an optional `gap`), `heads(o)` (a standing crowd).

## lib/s8_nav.mjs: navigators and their sky (stub, grows with c03)
- Re-exports from s8_canoe: `canoe`, `canoeFrame`, `sitter`, `flames`, `starCompass`, `route`, `island`.
- `starRing(ctx, t, C, { c, R, u, breath })`: the star compass round any world point (c03.17 Mau's chest; c11 many rings).
- `tern(ctx, t, C, { path, u, trail })`, `starPath(ctx, t, C, [az, el], [X, Y, Z], u)`, `seatedNav(ctx, t, C, { at, face, light })`.
- `navFigure(ctx, t, C, { at, face, pose: 'sit' | 'stand', lean, nod, light, lit, arms: { r, l }, hands, handAng, skin, cloth, scale })`: a
  navigator in 3D, right from any side. Arm specs: `'knee' | 'lap' | 'palm' | 'raise' | { at: [X, Y, Z] } | { dir: [az, el] } | { a, b, u }`.
  **Mau standing, measuring the horizon (B2's request):** `navFigure(ctx, t, C, { at, face, pose: 'stand', arms: { r: { dir: [az, .02] } },
  hands: { r: 'open' } })`. Returns `{ head, chest, wrist, tip, k }`.
- `canoeNav(ctx, t, C, K, { nav, sails, streamers, crew, fire })`: Hōkūleʻa with your own navigator (`nav(ctx, F, fireW)`, drawn in the canoe's
  depth order), sails raised 0 → 1, streamers, small crew figures. `CANOE` = `{ LEN, HALF, SEP, fire, nav }` (local metres).
- Known look: the figures read as smooth mannequins at close range; Mau's head is a dark disc with a rim (no features) by design.

## s8_desk additions (since setup)
- `room()`: the front wall is limited to `SHELL` (`{ x0 -1.8, x1 1.8, zb -2.6, h 2.5, door }`), the door swings on its hinge (`o.door.open`), and
  the lamp is skipped when it is behind the camera (depth guard). `o.glassPane` (the window is the dark glass plate) carries the c03>c04 handoff.
- Paper items for `room({ items })`: `book(o)` (closed book, `o.cover(g, t, W, H)`, `o.open` riffle; **the cover's top edge is now the FAR
  edge**, so a cover reads upright from your seat; flip your cover art if you drew it for the old orientation), `openBook(o)` (`o.flip`,
  `o.pages(g, t, W, H, i)`), `cup(o)` (steam), `badge(o)` (`o.turn`, `o.lift`).

## s8_cloud / s8_crowd additions
- `lid()` edges are now smooth polygons (90 rows, evenodd clip) instead of stair steps; same options (`drift`, default .004 rad/s, slides the deck texture).
- `crowd()` person option `walk` (phase in rad): that person walks away from the camera (s8_people walkerBack), e.g. a queue or a surge.

## Local modules (B1's chunks, not shared, listed so nobody duplicates them)
- `lib/s8_c03_sea.mjs`: bigStar, crux, wake, course, routeAhead, maui, atoll, swellGlow, seaTop, unproj, dirAzEl.
- `lib/s8_c04_world.mjs`: lightIn / lightDisc (the light carrier: the lamp plate seen through a polygon or a soft disc), headland (house, town
  time-lapse, cranes, boats), plane (the trainer, rear window with `o.inside`), cockpit (frame space, WSRECT), hall (station hall, globes, board,
  crowd), beachGround, mirror, prints, walker, kite, glowLine.
