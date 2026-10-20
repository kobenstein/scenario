# Film 5 · BUILDERS.md (kit API and how to build a chunk, by K0)

Film: **"The Fortune That Doesn't Exist Yet"** (The Good Takeoff, English, 527.72 s, 1920×1080, 30 fps). Read in this order:
1. `MOTION.md` (lead's motion rules: easing, carriers, through-line, forbidden motifs, sound hooks),
2. this file (where things are, timing, the kit, look, performance, review, ownership),
3. your chunk in the shot list (see below), then the Film 4 floor: `git show origin/claude/project-thread-p4c9r3:films/04-work/BRIEF.md`
   and `…:films/04-work/ref/kunst/a1.mjs` (a2, a3). Read Film 4 only through `git show`; never check out or merge that branch.

**Do not commit or push. Do not edit `/mnt/project-files/scenario/film-05-share/audio/timing.json`.** The lead commits and owns timing.

## Where things are
- Code: `/home/user/scenario/films/05-share/` (Node 22 + `@napi-rs/canvas`, pure Canvas 2D, every frame a pure function of t). No new npm/pip packages.
- Your file: `scenes/scNN.mjs` → `export default (T, R) => shots` (may be `async`). `R = { id, name, a, b, first }`: `a` = where your chunk
  takes over (= the previous chunk's `b`), `first` = the first spoken word of your chunk, `b` = where the next chunk takes over (absolute seconds).
- Shot entry: `{ t, draw(ctx, t, s), tr, d, x, y, r, depth, print, sound }`. `t` = start (from `T.S(…)`), `tr`/`d`/`x`/`y` = the transition INTO
  this shot (`cut dissolve match iris zoom out push left right up down fog flash black page whipL whipR whipU whipD`), `s.a`/`s.b` = the shot's
  window incl. overlaps. Draw the full frame on every call. `print` = per-shot finish (below), `sound` = see MOTION.md.
- Chunks (`film.mjs` CHUNKS, ranges with the final VO): c01 0–37.74 Hook · c02 37.74–72.42 §0 · c03 72.42–120.82 §1 · c04 120.82–187.61 §2 ·
  c05 187.61–244.76 §2 end, §3 doubt, Alaska · c06 244.76–300.48 §3 Norway, plan, §4 · c07 300.48–354.22 §4 fund, seeds · c08 354.22–403.00 §5 ·
  c09 403.00–480.90 §6 · c10 480.90–527.72 §7 Manila/Ohio, close. Anchors are phrases, so the ranges follow any re-cut; the lead may move
  boundaries when the v2 shot list lands. Never hard-code these numbers; use `R`.
- Spoken text (always follow these words): `/mnt/project-files/scenario/schreibraum/film-05/film-05-vo-v2.txt`; intent: `film-05-text-v2.md`;
  facts and sources for every number on screen: `faktenzettel-film-05.md`, `film-05-faktencheck-v1.md` (same folder).
- Shot list: `/mnt/project-files/scenario/film-05-share/bild/shots.md` (v2, being re-keyed to the final VO). Until it is there use `bild/shots-v0.md`
  (§3 rows, §4 chunk table) + `bild/konzept.md` (§3 palettes) and adapt to the v2 words. **The hook changed**: no kitchen, no table, no cup,
  no window, no lanyard; it is your hand holding the phone in darkness, the buzz as guilloche rings, then a rooftop at blue hour (K0 stills).
- Audio: `/mnt/project-files/scenario/film-05-share/audio/timing.json` (final George VO, words `{w, s, e, sec}`), `segments.json`, `sfx/`.
- K0 reference stills: `/mnt/project-files/scenario/film-05-share/stills/k0/` (`k0-1a-hook-hand`, `k0-1b-hook-rooftop`, `k0-2a-certificate`,
  `k0-2b-unwind-coast`, `k0-3-map-night`). Their code is `ref/k0/scenes.mjs` (`hookHand`, `hookRooftop`, `certFrame`, `unwindFrame`, `mapNight`):
  copy patterns from there (cached layers, parallax planes, fog, stippled light, the ripple motif). `node tools/k0_stills.mjs <dir> <name>` renders + times them.

## Timing (lib/kit.mjs, the `T` your scene receives)
Anchor every accent to a word (±2 frames), never to seconds. Ids: sections `'H'`, `'0'`…`'7'` (preferred, they survive VO re-splits) or segments
`H0a 00a 01a 02a 02b 02c 03a 03b 04a 04b 05a 05b 06a 06b 07a 07b`.
- `T.S(id, 'phrase', nth?)` / `T.E(…)` start / end of a phrase (nth = 1 → second occurrence). `T.S('3')` / `T.E('3')` = section start / end.
- `T.W(id, 'from', 'to')` word objects for word-by-word reveals · `T.seg(id)` → `{start, end}` · `T.secs` · `T.duration`
- `T.line(id, 'phrase')` the sentence `{text, s, e, words}` · `T.lines(id)` · `T.lineAt(t)` · `T.has(id, 'phrase')` (no throw, for optional beats)
- A missing phrase throws; film.mjs then shows your chunk as a red error card (the film still builds). Check with `T.has` for fragile beats.

## Kit API (import from `../lib/…`; signatures in each file's header)
- **engine.mjs**: `W H C rgba clamp lin mix sm eio eout ein sine back prng drift canvas glow addGlow text(ctx, s, x, y, {size, font, weight, color, align, spacing})`,
  `hatch(ctx, path, ang, gap, a, o)`, `rough(pts, amp, seed)`, `poly`, composites incl. `whipL/R/U/D` (smear by 3–4 offset draws).
- **art.mjs** (Film 4's approved print-look toolkit, unchanged): `stipple halftone fog cone pool bloom soften roughPath/Poly/Rect/Line hatch strokes
  house facade quadMap person castShadow stratus limb vnoise fbm layer`. This is the quality floor.
- **print.mjs**: `filmFinish` runs automatically on every frame (riso .5, halftone in the light, hatch in the shadows, fibre, vignette, grain, ~50 ms).
  Per shot `print: { riso, halftone, hatch, fibre, vig, grain, lift, tint }` or `print: { off: true }`. `fibreFill(ctx, a)` / `halftoneFill(ctx, a)` texture the current path.
- **certificate.mjs** (the through-line): `guilloche(o).line(k, u)`, `rosette(ctx, x, y, {R, A, B, n, m, lines, u (draw-on), rot, col, w, a, cache})`,
  `gBorder`, `intaglio`, `microtext`, `microRing`, `seal(ctx, x, y, r, t, {foil, label, emblem})`, `foilGlint`, `certificate(ctx, t, {x, y, s, rot, title, name})`,
  `resample`, `unwind(from, to, u)` (morph a line), `peel(from, to, u, {zone})` (a thread leaves a spool and is laid along `to`),
  `ring(ctx, x, y, rx, ry, {lines, band, wave, p, col, glow, a, lw, op})`, `ripple(ctx, x, y, t, buzzTimes, {w0, h0, rings, speed, life, lines, band,
  wave, col, coolCol, glow, to, toR})` = **the buzz motif** (rings start as the phone's rounded rect and relax into circles).
- **phone.mjs** (base by K0, owned by C1): `heldPhone(ctx, x, y, s, {t, buzz, ang, pitch, skin, lit, lock, screen, warm, rim})` (POV hand + phone,
  cached, ~50 ms; returns `map()` and `w0/h0` for `ripple`), `lockScreen(g, w, h, t, {time, day, cards, share})` (text fitted, never cut),
  `phone(ctx, x, y, s, o)`, `phoneCard`, `buzzOffset`.
- **figure.mjs**: `figure(ctx, x, y, s, pose, {t, accent, dress, light, rim, cast, …})` (Film 4 person + accent, breath, weight, arms in front),
  `figureBack(ctx, x, y, s, {t, dress, accent, hold: 'phone', light, glow, rimFloor})` (you, seen from behind; x,y = feet; returns `phone`, `head`),
  `figureFlat` (crowds), `POSES`, `walk(phase)`, `breath`, `weight`, `handPos`. **hand.mjs**: `hand(ctx, x, y, s, {pose, skin, sleeve, rim, light, t, close})`, `handTip`, `palmPos`.
- **city.mjs**: `cityLayer({key, seed, ground, hMin, hMax, win, rim, hatch, …})` (cached skyline layer for parallax), `skyGradient({top, mid, low, horizon, warm, stars})`.
- **map.mjs** (Natural Earth 110m/50m, Equal Earth, never a globe): `worldMap(ctx, cam, {highlight, borderGlow, terminator, dim, …})`, `region(name)`,
  `project(cam, lon, lat)`, `ll`, `country`; `outlineLocal(name)` + `fitTo` + `coastRuns` (a coastline as a polyline, e.g. for `peel`);
  `nightSheet(cam, {utc, decl})` + `drawSheet(ctx, S, view)` + `paperAt(S, view, lon, lat)` (the engraved night map of 07a, cached; draw rings flat on
  the paper with `ctx.translate(A.x, A.y); ctx.transform(...A.m, 0, 0)`), `sunElev`.
- **share.mjs** (owned by C2): `shareLight(ctx, x, y, r, t, {mode: 'light'|'coin'|'seed'|'fruit', split, u, born, shadow})` = the amber share light.
- **paper.mjs** (owned by C2): `paperSheet(ctx, x, y, w, h, {rot, fold, lift, content})`, `sigLine`, `scribble` (unreadable handwriting), `pen`, `inkStroke`, `stamp`.
- **carry.mjs + handoffs.mjs**: `carry('c03>c04', T, R)` → `{ t, into: {t, tr, x, y, d}, pos(t), draw(ctx, t) }`: the carrier at each chunk boundary,
  identical in both chunks (outgoing: draw it until `C.t + d/2`; incoming: first shot `{ t: C.into.t, tr: C.into.tr, x: C.into.x, y: C.into.y, d: C.into.d }`).
  `track(keys, t0)` for your own carriers; `drawCarrier(ctx, kind, x, y, s, r, t)` (pen, nib, coin, drop, envelope, knot, sprout, line, thread, ring, light).
  The register (`handoffs.mjs`) follows shots-v0 §2; ask the lead to change it, do not edit it.
- **quote2.mjs**: `quoteCard2(ctx, t, {words: T.W(id, from, to), name, role, source, date, paper, hi: ['word'], x, y, w, size})` — words light with the
  voice; name, role, source and date always on screen.
- **slice.mjs**: `slicePie(ctx, x, y, r, {share, at, grow, widen, dotted, tilt, depth, col, sliceCol, t})` → `{tip, centre}` — the pie and the one slice.
- **stub.mjs**: `PAL` (ground / middle / accent per section, konzept §3), the placeholder cards. Legacy Film 2/3 files (`world places explain md2 picts`):
  mechanics only, not the look.

## Look (Film 5)
- Illustration in the print look, never a game: one hero light per image (the amber share light `#ffb35c` / core `#fff1d6` is the warm light of the
  film), fog layers, light falling off as stipple, intaglio hatching in shadows, rough edges, perspective, 3–6 parallax planes. Look at the K0
  stills and Film 4 a1–a3 before drawing. No frontal symmetric layouts, no smooth flat vector look, no purple monotone.
- Palettes per section: `stub.mjs` PAL / konzept.md §3 (Hook slate + amber, §0 paper and stamp, §2 indigo + cream with TAKE rust / PRINT verdigris /
  AGREE amber, §3 aurora `#5fe0a8` on `#0c1b33`, Norway petrol `#1f5560`, §6 Manila peach dusk / Ohio sodium, §7 slate → morning gold).
- Through-line: the engraved certificate line (guilloche, microtext, seal, foil). The buzz is always `ripple()`; the signature move is `unwind`/`peel`.
- Figures: faceless, round shoulders, capsule limbs, rim light on the lit side, accent colour; arms in front or beside the body, never behind.
- Text: Instrument Serif (headlines, numbers, quotes) + Inter (labels, caps with spacing). Every number carries its source on screen.
  No readable invented names or brands (`scribble()`); nothing important in the bottom 170 px (subtitles). No text may be cut off.
- Forbidden: see MOTION.md (robots, machines, data centres, brains, fireworks, globes, doors, calendars, Film 4 motifs such as the kitchen table,
  phone lying on a table, the map with a field of igniting dots, string lights, the Maslow hill).

## Performance (whole film on 4 CPUs)
- **≤ 250 ms per frame on average including the finish (~50 ms).** K0 measured (incl. finish): hook hand 236, rooftop 240, certificate 163,
  unwind 214, map night 101 (its first frame builds a ~7 s cache). Measure: `node render.mjs --out /tmp/x.mp4 --from A --to B` or time one draw like `tools/k0_stills.mjs`.
- Build expensive static layers once (`const once = (k, f) => …` cache by key) and per frame only composite them with transforms + cheap animated parts.
- @napi-rs/canvas gotchas (measured): 9-argument `drawImage(canvas, sx, sy, sw, sh, …)` from a canvas source costs ~10 ms per call (copies the whole
  source): never per strip/per frame in loops · `createPattern` and `'copy'` leak per frame · `arc` with start ≠ 0 and sweep 2π draws nothing ·
  `putImageData` (and `art.stipple`) honours the current transform: reset it first · `Path2D.addPath` connects subpaths (stray lines): build one
  Path2D with `moveTo` · `destination-out` with a Path2D fill is unreliable: use raster masks + `drawImage` · `new Image()` from a canvas buffer is not
  decoded synchronously (draws nothing) · `rosette()` sets its own `globalAlpha` (pass `a`) · `ctx.filter = 'blur(px)'` works (cache the result) ·
  import `Path2D`/`ImageData` from `@napi-rs/canvas`. Deterministic only: `prng(seed)`, no `Math.random`/`Date.now`.

## Review loop (it is how quality happens)
1. Before coding, write your carrier chain as a comment at the top of `scNN.mjs` (shot → carrier → next shot, type a/b/c, handoffs from `carry`).
2. Snapshots: `SECS=c03 node render.mjs --snap 75,76.5,… --dir <your scratchpad>/snaps --scale .5` every 0.5–1 s, every accent, every transition
   midpoint. **Look at them.** Beautiful like the K0 stills / a1–a3? Shows exactly what the sentence says? Carrier visible? Anything frozen or cut off?
   Would Jakob say "Computerspiel"? Fix, repeat, at least two rounds. Then an mp4 of your hardest 10 s to judge motion.

## Ownership
- You create/modify only your `scenes/scNN.mjs` and new `lib/scNN_*.mjs` helpers (plus the kit file your chunk owns per shots-v0 §2, e.g. C1 phone,
  C2 paper/share; keep their signatures). Do not edit engine.mjs, film.mjs, lib/kit.mjs, art.mjs, print.mjs, certificate.mjs, map.mjs, handoffs.mjs or
  another chunk's files; copy what you need into your helper and say so in your report.
- Your first shot starts at `R.a` (the boundary); your last shot runs until the next chunk's first shot (`R.b`). Use `carry()` at both ends.
- Write scratch files only to your scratchpad or `/tmp/claude-0/`; write to the shared mount only where your assignment says.

## Final report (short)
Carrier chain, measured ms/frame, 4–6 snapshot paths of your best frames, known weaknesses, any kit function you copied/changed.

## Open (lead)
- shots.md v2 (re-keyed to the final VO) is not on the mount yet; CHUNKS may be re-cut then (only `from` anchors in film.mjs change).
- If dark silhouettes show a doubled light edge, that is the riso offset: set `print: { riso: .25 }` on that shot.
