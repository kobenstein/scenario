# Film 76 · "Your Kids Will Grow Up With Superintelligence" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for every number graphic. No ad skills (`ad-motion`, `performance-video-ad`,
`motion-design-director`). Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`. Rules: `schreibraum/REGELN.md` §13.

Then read: `docs/MOTION.md` (stages, carrier, colour code, Nicht wiederholen), `docs/shots.md` (your rows: *Satz*, *zeigt wörtlich*,
*Art*, *Träger*), `scenes/plan.mjs` (your shot entries: `in`, `out`, `tr`), `scenes/ch_hook.mjs` (the quality reference: how a shot is
built), and look at `/tmp/claude-0/f76/sheets/hook1.jpg` + `hook2.jpg` (or render them: §6).
Jakob approved the whole film; it is built through to the end **without interim review**, upload Sun 6.12. Measurements come **before**
the render, the contact sheet is the acceptance (§6).

Code: `/home/user/scenario/films/76-your-kids-will-grow-up-with-superintelligence/code/` (branch `claude/project-thread-os00fk`).
ROOT (small files, network mount, never search it whole): `/mnt/project-files/scenario/film-76-kinder/` (`$F76ROOT`). Renders:
`/tmp/claude-0/f76/<you>/`. Assets (clips) arrive via branch `claude/f76-imac` → `films/76-assets/`.

## 0 · Bau-Checkliste Bild (REGELN §13; in your report tick every point with a number)
1. **One picture per sentence**, exactly what the sentence says (*zeigt wörtlich*). 1a. Zoom/pan into the same picture is not a new picture. 1b. Motion-design film, not animated illustration: objects turn into the next object, numbers/words land on the spoken word.
2. **Explainer share 60–70 %** weighted (EXPL 1 · MIX .5 · SCENE/WORLD 0 · CLIP 0). Planned (vo-v3, provisional): film 67.3 %, B1 72.8 %, B2 73.4 %, B3 57.7 %. Keep the `kind` of your shots; if you must change a shot's kind, re-run `node tools/shots76.mjs` and say so.
3. Scenes carry feeling, graphics carry understanding: every number, study, quote = EXPL (or a MIX graphic on a scene object).
4. **Leitbild (the gate) only where plan.mjs has `lb`:** s4 (punchline) and s6 (+ e1) in B3. Nowhere else.
5. Transitions = the paper plane (built into `film.mjs`) or `tr: 'match'`; **no hard cut, no fade, no black**; 1–2 moving things at a time.
6. Skills first (above). 7. MOTION.md + shots.md are binding. 9. Acceptance per section: contact sheet vs gates AND script; measure before render (§6).

## 1 · Who builds what (times = provisional vo-v3; they WILL move with the real VO)

| builder | file | shots (plan.mjs `pk`) | from phrase → to | time | wow (★, MOTION §4) |
|---|---|---|---|---|---|
| **B1** | `scenes/ch_b1.mjs` | a0a–a0o (Age 0) · a6a–a6m incl. **C1** (Age 6) · 29 shots | 'To see which ones' → 'Twelve.' | 0:54.1 – 3:32.2 (2.6 min) | a0l curve MORE THAN HALVED · a6f tablets go dark 39 % / 47 % |
| **B2** | `scenes/ch_b2.mjs` | a12a–a12j (Age 12) · m1 (mission/subscribe 1) · a18a–a18o incl. **C2** (Age 18) · 27 shots | 'Twelve.' → 'Thirty.' | 3:32.2 – 6:30.6 (3.0 min) | a12f 4 IN 5 · a18j HOME CARE AIDE lights gold |
| **B3** | `scenes/ch_b3.mjs` | a30a–a30h incl. **C4** (Age 30) · t0–t11 incl. **C5** (four tips) · s1–s6, e1 (close, Leitbild 3+4, end screen) · 29 shots | 'Thirty.' → end | 6:30.6 – 10:07.0 (3.6 min, incl. ~19 s end tail) | a30f BY US · s1 list → child silhouette, s4 NOT WHAT. WHO. |

The lead built **h1–h12** (`scenes/ch_hook.mjs`, 0:00–0:54.1), the kit (`lib/f76_kit.mjs`), the sequencer and the plan. Your file
already exists as a stub with the clip shots (`K.clipShot('C1')` etc.); add your shots to its `export default { … }`. A shot you have not
built renders as a red "not built" card.

## 2 · How a shot works
- `export default { a0a(ctx, t, S, T) { … }, … }` keyed by shot id. `S = { id, a, b, in, out, tr, seed, pk }`; `T` = timing.
- **Anchor only on phrases, never on seconds:** `const { G, U, IN } = K.phr(T, S, t)` → `G('phrase')` = start time (searched from just
  before the shot), `U('phrase', d, off)` 0..1 ramp, `IN(d)` shot-local ramp. Also `T.GE(phrase)` (end), `T.GW(from, to, after)` (words
  with times, for word-by-word text like h5), `T.clip('C2')` → `{ start, end }`. Repeated phrases: pass `nth` or `after`.
- **Carrier contract:** the first element of your shot is born at `S.in` (the plane lands there and opens; the disc reveals from there).
  Your last element must sit at `S.out` by `S.b − 0.55` (the plane takes off there). Change `in`/`out` in plan.mjs only for your own shots,
  and only both sides together (`out` of the shot before = where its plane leaves; `in` of yours = where it lands).
- `tr: 'match'`: your shot continues the last frame of the shot before by itself (same object, same place, same camera). Share a helper
  between both draws (like `kitCam`, `safeCards`, `faceOff` in ch_hook) so the seam is invisible.
- Every draw may run past `S.b` (it keeps drawing under the next reveal). Start with `K.bg(ctx, t, { gx, gy, ga })` (night ground + light
  pool) and `ctx.save(); K.shotCam(ctx, t, S, { z0, z1, fx, fy })` for a slow push with a reason; `ctx.restore()` at the end.
- Deterministic: no `Math.random`, no `Date.now`; seeded noise via `K.prng(S.seed)`. No per-frame canvas/pattern caches.

## 3 · Kit API (`import * as K from '../lib/f76_kit.mjs'`; re-exports f68_kit → f67_kit)
- **People:** `E.du(ctx, x, y, h, { view: 'back'|'side', pose, walk, look, armR, armL, light })` = you (yellow coat) · `K.kid(ctx, x, y, h,
  { age: 0|4|6|10|12|18|30, view, walk, look, armR, armL })` = your child (yellow coat, proportions by age, `K.KIDS`) · `K.folk` /
  `E.person` = everyone else (indigo) · `K.figRow(ctx, t, x, y, n, gap, h, u, i => ({ dim, lit, halo, core, rim, look }))` (unit rows, see h8).
- **The machine:** `K.chip(ctx, t, x, y, s, { a, lit, rays, pins, heart, hang, think })` (pale-gold chip, cyan heart; never a robot/face).
- **Age clock (spine, a0a/a6a/a12a/a18b/a30a/e1):** `K.ageClock(ctx, t, { u, lit, figs, counter, scenario, city, marks })`, `K.STEP`,
  `K.stepTop(i)`, `K.counterAge`, `K.rollText(ctx, a, b, u, x, y, size)` (odometer digits), `K.AGES` = [[0,2026],[6,2032],[12,2038],[18,2044],[30,2056]].
- **Kitchen table (a18b, a30h, t0, s2):** `K.kitchen(ctx, t, { cam, childAge, childH, childX, look, lamp, you, youX, grand, notebook, items })`
  → `{ top, nb, head, lamp }`, `K.KT`. Same table as h4 (side view, pendant lamp).
- **Leitbild (s4, s6, e1 only):** `K.gateWorld(ctx, t, { cam, walk, stop, windows, power, gateU, inside, over })` → `{ gate, pair }`, `K.GATE`.
  See h1/h11 for how it is filled.
- **Objects:** `K.paperPlane(ctx, x, y, s, ang, { bank, open, a, glow })` (only if a shot needs the plane inside it, e.g. e1 into the gate) ·
  `K.tablet(ctx, t, x, y, w, h, { lit, rot, content })` · `K.lightSwitch` · `K.seesaw(ctx, t, x, y, L, tilt, { left, right })` (a12j, a18a) ·
  `K.wordRise(ctx, s, x, y, size, u, { gold, serif })` (verdict words rise; no stamps) · `K.doc` / `K.paperCard` / `K.dataCard` / `K.quoteCard`
  · `K.bar`, `K.column`, `K.lightLine`, `K.curvePts`, `K.donut`, `K.dots`, `K.counter` (dataviz marks) · `K.orb`, `K.halo`, `K.bracket`.
- **Text:** `K.cap(ctx, s, x, y, u, { size, align, col, glow })` (Inter caps 24–36) · `K.big` / `E.glowText` (serif statements) ·
  `K.src(ctx, t, t0, t1, s)` (sources 22 px at y 880) · colours `K.GOLD`, `K.CREAM`, `K.MUTED`, `K.MACH`, `K.PAPER76`, `K.AI` (cyan).
- **Clips:** `K.clipShot('C1')` (plate grows out of S.in into `K.CLIP_RECT` and back; lower third from `K.CLIPS`). Until the frames are
  extracted (`python3 tools/f76_clips.py`, after `claude/f76-imac` lands) the plate shows "FOOTAGE GOES HERE". Slots (provisional): C1
  9.3 s · C2 11.3 s · C4 8.3 s · C5 8.3 s; real lengths come with `<ROOT>audio/timing.json`.
- Kit wishes: a local helper in your file (or `lib/bN_*.mjs` of your own); ask the lead in your report. **Never edit** `lib/f76_kit.mjs`,
  `lib/f6*_kit.mjs`, `lib/f10_editorial.mjs`, `film.mjs`, `scenes/resolve.mjs`, `tools/`, `audio/`, or another builder's file.

## 4 · Rules (MOTION.md §5–§7)
- Calm-precise editorial night; sineIO glides, expoOut landings, overshoot ≈ 0; ≤ 2 hard accents / 30 s, then ≥ 0.8 s calm; nothing from
  nowhere (everything grows from S.in, from an object on screen, or is carried in); nothing frozen (ambient drift in every hold).
- Colour code: GOLD = what holds / human value / the one hero light · CYAN = only the machine's own light · CREAM = paper, questions ·
  indigo = other people · the yellow coat = only you and your child. Never red, never a cross, never a stamp, never a clock or dial.
- Nothing from "Nicht wiederholen" (MOTION §7): no scale (seesaw), no pay slip (pay bar), no robots/brains, no globe/map pins, no stairway
  into the sky (the age clock steps stay flat blocks), no calendar sheets, no hourglass.
- Nothing important below y 880 (subtitles). Text ≥ 22 px, ≤ 6 words + one number per statement (verbatim quotes may be longer), held
  ≥ 1.5 s. Sources 22 px at y 880.
- **Facts:** strings as in shots.md (*zeigt wörtlich*) and `<ROOT>text-v2.md` (Einblendungen), corrected by `<ROOT>faktencheck.md`
  (25.11.). Spoken text = `<ROOT>vo-v3.txt`; a newer vo-vN wins. Known v3 fixes: a12f "four in five said they spend more time with real
  friends" (tag: MORE TIME WITH REAL FRIENDS, not "come first") · a18f England coding: "more than ten years ago … a required school subject
  from age five" (tag: CURRICULUM 2013 · TAUGHT FROM 2014 · AGE 5–16; never "every schoolchild"). Survey caveats stay in source lines
  (e.g. UNFPA ONLINE SURVEY, NOT REPRESENTATIVE). No invented effect sizes (a6h).

## 5 · Timing
- `film.mjs` loads `$TIMING`, else `<ROOT>audio/timing.json` (real VO), else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`
  from the newest `<ROOT>vo-vN.txt`). After any VO change: `node tools/shots76.mjs` (prints the share; a missing phrase throws).
- Package ranges right now:
  `node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');console.log(m.chunkRanges(k.timing(m.TIMING)))})"`

## 6 · Measure, render, accept (per section, then for your package)
```
tools/sheet.sh b1_age0 54.5,55,55.5,...           # snapshots every 0.5 s + every plane take-off/landing → /tmp/claude-0/f76/sheets/b1_age0.jpg
node render.mjs --snap 101.2,101.7 --dir /tmp/claude-0/f76/b1/snap --scale .5      # half-res stills of the hero moments (look at them)
node render.mjs --out /tmp/claude-0/f76/b1/b1.mp4 --from 54.1 --to 212.2 --scale .5
python3 tools/calm.py /tmp/claude-0/f76/b1/b1.mp4 --scale 1280:720       # hard cuts/min = 0 (only the plane and matches), mafd median ≤ 0.43
python3 tools/still.py /tmp/claude-0/f76/b1/b1.mp4 54.1                  # still share < 5 %, no still run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f76/b1/b1.mp4 54.1                 # no LURCH > 12 except bright↔dark reveals, no POP
node tools/seam.mjs --at <time of a plane landing or a match>            # every frame around a seam (BLACK / FROZEN / POP)
```
(Times here only for rendering; take them from `chunkRanges`, never write them into scene code.)
**Acceptance = the contact sheet against the gates AND the script:** for every frame, read the sentence spoken at that time (shots.md):
does the picture show exactly that? One hero light? The plane visible at take-off and landing, the first element born at S.in? No text
< 1.5 s, nothing below y 880, no frozen hold, no empty frame? Would it stand as its own motion-design piece? Fix, then render.

## 7 · Report (≤ 200 words, German)
Shots done; §0 ticked with numbers (share of your package from shots76, hard cuts/min, calm mafd median, still share + longest still run,
smooth flags); any string that differs from shots.md / faktencheck; kit wishes; open points; contact sheet paths (`/tmp/claude-0/f76/sheets/…`,
and a < 1 MB jpg per section in `<ROOT>bild/`). Commit only your files locally (`scenes/ch_bN.mjs`, `lib/bN_*.mjs`, and plan.mjs lines of
your own shots if you changed in/out); the lead/coordinator pushes.
