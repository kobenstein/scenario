# Editorial kit ("Editorial-Nacht") · Film 23 · for the builders

As of 2026-11-06 (Film 23, phase 1). The kit comes from Film 10 (approved by Jakob there), extended in Films 13, 16 and 18; the Film 18 version of this file is in `docs/ref-18/EDITORIAL-KIT.md`. Film 23 adds its own modules in phase 2 (`lib/f23_kit.mjs` world, `lib/f23_hud.mjs` day-clock + evidence cards + old screen, `lib/f23_seams.mjs` plates; `MOTION.md` §12). Binding style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`.

- **Code:** `lib/f10_editorial.mjs` (stage, palette, figures, light, type, finish, explainer helpers) + `lib/f16_kit.mjs` / `lib/f13_kit.mjs` (`rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts`, `stamp`) + `lib/figure.mjs` (life model and gait, used for the editorial figures through `f23_kit.alive`) + the `f23_*` modules. The old `f10_valley`, `f10_hall`, `f10_figs` and Film 18's `f18_*` stay in the repo but are not drawn.

## 1 · The rules
1. **One idea per picture, one motif per sentence.** From `shots.md` the timing (phrase → picture), the carrier logic (`A → B · position · direction`), the clip slots and the content rules are binding.
2. **ONE big light form** is the hero of every picture (the phone, the kitchen window, the voice-light, the lamp, the sun, the tower, the old screen). It is the brightest thing. Two equally strong lights are forbidden.
3. **One small figure.** "You" stands before the light form, 12–25 % of the frame height in wide pictures, never a face.
4. **Much night space.** At least 40 % of the picture is calm dark area. Little detail: no furniture beyond the table/chair/kettle the sentence needs, no textures, no crowds. A crowd becomes points of light.
5. **Yellow is only you** (`P.coat`). Everybody else (the kid, Dad, the neighbour, the student, testers, doctors) is a plain silhouette in indigo/blue (`person()`), no yellow, no face.
6. **The machine is light**, never a robot: cool spheres (tutor), a small cool light on a gold thread (agent), cool windows (the tower), tiny cool dots (earbuds). The `robot()` helper is not used in this film.
7. **Light tells:** gold = human care, decisions people made, the good road; cool blue-cream = the machine and the "other way". Contrasts are shown as light halves (the few warm windows vs the dark many).
8. **Calm:** 1–2 moving elements at once plus the camera; no blends, no wipes; nothing stands still (`camDrift`, the light breathes, the figures breathe); accents on the word (±2 frames).
9. **Memory:** no new canvas, pattern, gradient cache or `drawImage(canvas)` per frame; grain is computed once (`prepareEditorial()`); render with `node --expose-gc` in pieces ≤ 20 s.

## 2 · The stage: 2.5D cards before a perspective camera
Flat shapes stand as **cards at a real depth** Z; the camera `cam3({x, y, z, f, roll})` looks along +z. Each card is drawn in design coordinates (a 1920×1080 layout as `cam3()` sees it). At home every card looks as designed; when the camera moves, real parallax appears; a dolly enlarges near cards faster than far ones; a card the camera passes is skipped (fly-through).

```js
import * as E from '../lib/f10_editorial.mjs';
const c = E.camDrift(E.camAt(t, KEYS, ZS), t);           // camera from word keys + permanent drift
E.card(ctx, c, 40000, () => skyAt(ctx, c, t, hour));     // sky with sun / moon by hour (f23_kit)
E.card(ctx, c, 16000, () => tower(ctx, t, { open }));    // skyline: the night-shift tower
E.card(ctx, c, 9000,  () => testersHouse(ctx, t, {}));   // between tower and city
E.card(ctx, c, ZS,    () => { building(ctx, t, …); kitchen(ctx, t, …); E.du(ctx, x, y, h, { ...alive(t, 1), hood: false }); });
E.card(ctx, c, 1100,  () => foregroundEdge(ctx));        // a dark window frame / rail, blurred
```

**Depths for Film 23 (convention; the lead locks them in `STREET`):**
| Layer | Z | Examples |
|---|---|---|
| Sky | 40000 | sky gradient by hour, sun/moon, stars, the explainer space of outdoor graphics |
| Skyline | 16000 | the night-shift tower, far roofs, the care home |
| Middle | 9000 | the testers' house, the road from the tower, Dad's building seen from your window |
| **Section plane** | **≈ 3000 = `ZS`** | your building cut open (kitchen, kid's room, hallway), the clinic, Dad's building when you are there; the figures; the light wall (kitchen back wall) |
| Street front | 2400 | the street, trees, lamp posts |
| Foreground | 1100 | a window frame, the balcony rail, the table edge in close shots: blurred (`ctx.filter = 'blur(8px)'`) |

Use 3–5 cards per picture, not more.

**Camera API** (`f10_editorial`)
- `cam3({x, y, z, f, roll})`; at home `cam3()`. Film 23: **no roll, almost no pitch** (the street stays level); go up and down with y (crane).
- `camAt(t, [[t0, cam], [t1, cam, ease], …], refZ)` from word keys. Eases `'s'` (sine, default), `'q'` (quart in-out, the push onto a seam plate), `'i'` (expo in, flight into a light), `'o'` (expo out). z is interpolated logarithmically to the reference card: pass the subject depth (`ZS`) as `refZ`; it breaks if a camera z gets close to or beyond `refZ`.
- `aim(Z, u, v, s, sx, sy)` the camera that shows design point (u, v) of card Z at screen point (sx, sy) with s-fold magnification: flights into the phone (2.01), into the old screen (CLIP IN), onto plates.
- `project(c, Z, u, v)` → screen point (labels, HUD-aligned carriers). `camDrift(c, t, amt)` on every camera.

**Typical moves in this film**
1. **Breathing hold:** z +80…+300 over 4–8 s with sine while the voice talks (the table at dinner).
2. **Travel along the street:** x over 3–5 s (to Dad's, back home, the steam into the next room); parallax separates the layers.
3. **Crane:** y up past the roofs to the skyline (3.05, 4.03) and back down (4.01, 4.08); sunset walks (6.06).
4. **Flight into a surface:** `aim(Z, u, v, 60)` with `'i'` into the phone (2.01) or the old screen (CLIP IN); the next picture starts from the same framing.
5. **Pull back to the map:** from your window to the whole street in section (1.05, 2.04, 11.04).
6. **Match through a form:** circle → circle (scan ring → window ring → kettle glow), line → line (your gold line → the old screen's opening line), point → point (the old screen's point → the next graphic).

## 3 · Building blocks (API of `f10_editorial`)
- **Palette `P`** exactly as in the style: night `night0..2`, indigo `ind0..2`, blue `blue0..2`, core `core0..1`, halo `halo0..2`, shade `shade0..1`, `coat` (only you), `cream` (type). Machine cool `COOL` (`f23_kit`, from Film 18). Helpers `rgba`, `mixHex`, `lin`, `rad`.
- **Maths:** `clamp`, `lerp`, `span(t, a, b)`, `smooth`, `sineIO`, `quartIO`, `expoIn`, `expoOut`, `drift(t, amp, seed)`, `prng(seed)` (no `Math.random`, no `Date.now`).
- **World:** `nightSky`, `stars(ctx, seed, n, t, box?, a?)`, `ground(ctx, pts, {stops, rim, rimW})`, `castShadow`, `lightPool(ctx, x0, x1, y, spread, depth, a)` (the lamp pool on the table).
- **Light:** `lightForm(ctx, kind, x, y, w, h, t, o)` (`'disc'`, `'window'`, `'gate'`, `'ring'`), `trail(ctx, pts, u, o)` (lines of light: the clinic's line, the roads, the threads), `halo`, `glowFill`, `dust` (steam, the drizzle), `rays`, `lightFlood` (only inside a flight).
- **Figures:** `du(ctx, x, y, h, o)` (you; `hood: false` indoors; `dir`, `walk`, `armR`/`armL` as `[shoulder, elbow]`, `look`, `light`, `back`; returns the hands) and `person(ctx, x, y, h, o)` (everyone else, indigo; `long` for Dad's cardigan). Film 23 wraps both with `alive(t, seed)` (breath 4–4.6 s, weight shift 8–13 s, glance 6–11 s, blink beat 3.4–5 s: a tiny head settle, the figures stay faceless) and uses `figure.mjs walk(phase)` for the gait. Arms: two segments, the forearm lags 60–80 ms, never behind the back.
- **Type:** `glowText(ctx, s, x, y, {size, serif, align, col, a, spacing, glow})`; sizes `TYPE` hero 168, num 120, mid 80, label 34, small 28, src 22. Only year, time, places, names, numbers, sources, the evidence cards and the kid's handwriting.
- **Finish:** `finish(ctx, t, {grain, floor, vig})` (called by `film.mjs` with `PRINT23 = { grain 14, floor 4, vig .5 }`; do not call it in `draw()`); `prepareEditorial()` once.
- **Explainers as light** (each takes `u` 0..1, driven by the word): `counter`, `bars` (the plan bars 5.03, the exam bars 10.05), `curve`, `pie`, `section` (Dad's building 6.04–6.05), `lightMap` (the city as a map of windows 1.05, 2.04; the millions 11.04), `timeline` (12.05). They stand on the same stage as the world and grow out of a world object.

## 4 · Translating a shot from `shots.md`
1. **Read the sentence.** Which ONE idea does it carry? Choose the light form: the picture you would hang as a poster.
2. **Reduce radically.** A flat is a box of warm light in section; a kitchen is a table, a lamp, a window and the wall; the tower is a slab of cool windows; a crowd is points of light; a law is a gold rule line or a seal; a price is a tag.
3. **Fix the figure.** The voice says "you": you live it (lift, nod, lean, walk). The kid and Dad act their lines with small, natural gestures.
4. **Keep the carrier** from the row (`A → B · position · direction`): light form → flight into it; line → line; circle → circle; point → point.
5. **Plan the camera:** one move per motif (hold, travel, crane, flight, pull back, match).
6. **Check the frame:** a poster? the light form the brightest? ≥ 40 % night? the figure found at once? ≤ 2 moving elements? the reserved zones free (clock, cards, subtitles)?

## 5 · Building it into `film.mjs`
- A chunk entry gets `print: F.PRINT23`; `film.mjs` calls `finish()`, then the HUD (`f23_hud.dayClock`, `evidence`) is drawn on top for the whole film.
- `draw(ctx, t)` draws the cards via `card()`; clip slots inside your entry with `oldScreen()`.
- Cuts are hard `cut`s between identical frames only (a plate, a flight through light, a rhyming match). No `tr` blends: `film.mjs` turns them into cuts with a warning.
- Review: `SECS=c0x node render.mjs --snap …`; `tools/calm.py`, `tools/smooth.py`, `tools/seam.mjs`. Render: `node --expose-gc render.mjs --from A --to B` in pieces ≤ 20 s (≈ 250 ms per 1080p frame).
