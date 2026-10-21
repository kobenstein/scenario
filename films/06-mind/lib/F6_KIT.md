# F6 kit — `lib/f6_kit.mjs` (Film 6, K0)

Pure functions of `t` (s), 1920×1080 screen space, deterministic prng. Defaults after the name.
Colours: `F6.{glassTop, glassBot, cool, coolCore, coolCold, amber, amberCore, amberDeep, witness, night, slate, silver, cream, ink, praise}`.

## Caching / builder pattern
- `layer(key, w, h, paint(g, c))` → canvas painted once, cached by key (draw it with `drawImage`).
- `once(key, fn)` → memoised value. `toImg(canvas)` → Promise<Image> (only async decode works); `pending(p)` registers it; `ready()` awaits all pending.
- In `prepare`: draw one warm-up frame, then `await ready()`. Flush every frame (render.mjs does); offscreen canvases then stay flat.
- `breathe(t, bpm 60, ph 0, kind 'sine'|'heart', amp .03)` → 0.97..1.03.
- `camMap(cam {x,y,z}, p)` / `view(ctx, cam, p, fn(g, m))` — camera over a 1920×1080 world with parallax `p`; `m.X(x), m.Y(y), m.k` map world → screen.
- `reveal(ctx, x, y, w, h, u, draw, dir 1|-1|2)` — mask reveal (left/right/top), nothing fades.
- `riseFromDark(ctx, u, draw(g), { col })` — draw() rises out of the dark as one opaque picture (source-atop darkening).
- `ROOM` — the hook room's world coordinates: `window {x 1565, y 400, w 400, h 620}` (centre), `desk {x0 300, x1 1310, yFar 622, yNear 790}`, `lamp [1165, 626]`, `screen {x 905, y 465, w 330, h 212}` (centre), `figure [660, 868]`, `chair [455, 600]`.

## The four objects
- `ember(ctx, t, { x, y, s 1, kind 'glow'|'lamp'|'candle'|'heart'|'window'|'bulb', a 1, bpm 60, phase, r, body true, dir (lamp shade angle, rad), w, h (window), flicker .06, cone (lamp beam alpha), col, core, deep })` → `{ x, y, br, light {x,y,col,a} (for figure o.light), flame [x,y], tip [x,y] }`. Warm light with a body, breathing ±3 %.
  `ember(g, t, { x: 1165, y: 626, kind: 'lamp', dir: .42 })`
- `witness(ctx, t, { x, y, r 5, a 1 (0..1 appearing: light grows), halo 110, ring true })` — steady white-gold point; never moves or breathes.
  `witness(g, t, { x: head[0], y: head[1] - 120, a: lin(2, 3, t) })`
- `pane(ctx, t, { x, y (centre), w 600, h 400, rot 0, yaw 0 (turn, rad), radius 4, reflect(g) (mirrored, pane-local, origin centre), reflectA, reflectDim .55 (mirror ≈ .15), through(g), throughA, screen(g, w, h) (top-left), screenA, spill true, edge .7, frame 'none'|'thin'|'laptop'|'window'|'mirror', fog {x,y,r,a}, sheen 1, seed, dark true })` → `{ local(px,py), path(), x, y, w, h, yaw, rot }`. Turn it: reflectA off → dark → throughA/screenA on (never both at .5).
  `pane(g, t, { x: 960, y: 500, w: 900, h: 560, frame: 'laptop', screen: (q, w, h) => coolText(q, t, { x: 30, y: 24, w: w - 60 }) })`
- `coolLine(ctx, t, { pts [[x,y],…] | from, to, u 1, w 1.6, a 1, head true, glow 1, col, core, ticks true, write: { text, x, y, size 64, font 'Instrument Serif', align 'left', lead 220, fill .9, outline 1, lag 60, spacing, weight } })` → `{ tip, done, textW, len }`. The intelligence line; with `write` it runs along the baseline leaving the letters behind (outline, then fill).
  `coolLine(g, t, { write: { text: 'Very probably not.', x: 300, y: 330, size: 92 }, u: lin(.8, 2.6, t) })`
- `coolText(ctx, t, { x, y (top-left), w 520, size 15, lines 5, t0 0, cps 38, gap .25, seed 1, a 1, col, core, cursor true, ripple true, harsh 0, glint 0, accent [{i, at, d .3}], lengths [], script 'latin'|'deva'|'cjk'|'arab'|'mix', align, lineH, words [{w, s, e}] (readable, lit with the voice), text, font, fontSize, per })` → `{ u, done, cursor, bottom, lineY }`. Glyph runs writing themselves, or readable words.
  `coolText(g, t, { x: 1100, y: 760, w: 700, words: T.W('Q7'), fontSize: 36 })`

## Composites
- `splitLight(ctx, t, { x, y (line centre), len 1100, u 0..1, rise 170, labels true, labelA, emberR 120, lineA 1, bpm 60, seed })` → `{ ember [x,y], line {x0,x1,y} }`. The ember separates from the cool line and rises; INTELLIGENCE / CONSCIOUSNESS labels.
  `splitLight(g, t, { x: 960, y: 620, u: lin(.2, 1.6, t) })`
- `clouds(ctx, t, { x, y, w, h, n 5, seed 1, speed 16, a .55, col, s 1, bob 8, carry(g, i, cx, cy, k) })` → `[{x, y, r, k}]`. Half-transparent thought clouds drifting right.
- `nightRoom(ctx, t, { cam {x,y,z}, screen 'answer'|'dark'|fn(g,w,h), answer {coolText opts}, typing true, lampA 1, window { reflectA 1, throughA 0, through, fog, title { lines, u } }, chairTaken false, witnessA 0, figure true, seed 3 })` → `{ window, screen, lamp, chair, head }` (screen coords). The hook room; parallax wall .85 · desk 1 · you 1.08 · motes 1.25.
  `nightRoom(g, t, { cam: { x: 1200, y: 480, z: 1.6 }, window: { title: { u: lin(1, 3, t) } } })`
- `figureDesk(ctx, t, x, y, s, { seed, typing true, lamp {x,y}, screen {x,y}, lampA 1, screenA 1, dress {coat, hair, skin}, chair true, shade 0 })` → `{ head, shoulders }`. Seated person from behind, rim-lit; x, y = hip, s 1 ≈ 95 px tall.
- `clipPane(ctx, t, T, id, x, y, w, h, { on, ramp .5, frame 'thin', edge .8, radius 6, spill true, yaw 0, rot 0, vignette .4 })` → `{ on, u, line [y0,y1] }`. A pane switches on into the clip (TV line, .5 s) and off after it; x, y top-left; frames via `prepareClips`.
  `clipPane(g, t, T, 'C6', 300, 120, 1180, 664)`
- `lowerThird(ctx, t, T, id, { x 110, y 850 (name baseline, keep ≤ 860), a, size 40, info {name, role, source, date} })` — cool line writes, then name (serif) and role · source · date (caps).
- `mirrorOfMind(ctx, t, { x, y (centre), w 520, h 760, reflect(g), reflectA .9, clouds {n 4, a .5, speed 14, seed, s, h} | null, text 0..1, ripple {t0, amp 1} | null, witness {x, y, a} | null, frame 'mirror', floor true, edge 1, dim .18 })` → `{ pane }`. The tall mirror; clouds cross it, it can fill with brilliant scripts, a heartbeat ripples it.
  `mirrorOfMind(g, t, { x: 1100, y: 520, text: lin(.4, 2, t), ripple: { t0: 2.2 }, witness: { a: 1 } })`
- `letterpress(ctx, t, { x, y (baseline), words | text, t0, per .4, size 44, font 'Inter', weight 600, ink, spacing 6, gap 28, align, u })` → `{ done, w, ends }`. Words pressed into paper one by one.

Paper/ink: `lib/paper.mjs`. People: `lib/figure.mjs`. Every motif in use: `tools/k0_stills.mjs`.
