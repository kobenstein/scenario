# Film 31 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-17

The lead built **c01** (the hook, 0 → `T.G('Picture a ladder')`) as the quality reference, plus the kit, the world, the seams and the
shot list. Three builders now build the rest **at the same time**. Release Wed 18.11. 17:00 Vienna; the film is built through to the end
with no interim review. Read first: `docs/MOTION.md` (world + rules), `docs/shots.md` (your shots, binding), `scenes/sc01.mjs` (how a chunk
is built), `<ROOT>bild/kit31_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`. Script: `<ROOT>vo-final.txt` (fact-checked). ROOT =
`/mnt/project-files/scenario/film-ai-2027/` (`$F31ROOT`).

| builder | chunks | from → to (phrase) | time (provisional timing) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'Picture a ladder' → "So don't take Anthropic's word" | 1:00 – 4:01 (180 s) | out of plateLadder: the ladder cools to metal, five labels · rung 1 CODE · ANTHROPIC, its own numbers · **T2** Tao Lin (plate from a builder's eye) · IN A YEAR? · → the HUD · Google fine print · ★ rung 1 TAKEN · science loop · two benches · Altman's intern goal, not verified · ★ rung 2 TAKEN · your lamp back ON ("people") · ★ <1 % → 26 % ring · goal / work / check · SHARED · the movies · ON WHICH RUNG? · HOW FAST? · subscribe 1 (the foundry at work) · TIME LEFT TO AGREE ON THE RULES → plateClimb |
| **B2** | c07 c08 c09 | "So don't take Anthropic's word" → 'Their scenario, late' | 4:01 – 7:14 (193 s, 45 s of it clips) | out of plateClimb: the evaluators at the hall door · ★ the gauge ≈ 1.9× ON BENCHMARKS · 80 % from A.I. use · SOURCE: THE LAB stamps · IPO this week · blacked-out report · 6.19× vs 1.91× · LOOKS REAL / OPEN FIGHT · the timeline: AI 2027, ★ Kokotajlo END 2028 → MAY 2027, all six · SUPERHUMAN A.I. RESEARCHER at the core · **T1a** + **T1b** Tao Lin (one plate) · ★ pin TAO LIN · END 2027 · rung 3 FORECAST · the record (STOCKS UP 30 %, protests) · THEY WANT A PAUSE · the condition · the rail forks → plateMachine |
| **B3** | c10 c11 c12 | 'Their scenario, late' → end | 7:14 – 11:20 (246 s, incl. ~5 s quiet + 15 s end screen) | out of plateMachine: SCENARIO · 2027 stamp · a year every week · the pupil turns · ★ the committee 6 : 4 · two endings · NOT CODE / EXPERIMENTS / RESEARCH · rungs 4 + 5 (flag, lever) · TODAY · **K3** Pachocki quote card · ★ the monitor eye over the town · ≈ 50 a week · who checks the lab · PROMISED, NOT REQUIRED · **T3** Tao Lin · ¼ of the pace · agreed in advance · rivals · your two questions at the table · the answer on the ladder · lamp off again · ★ your hand on the lever · THE LAST RUNG IS STILL OURS · subscribe 2 · END_CAM |

## Timing (it WILL move: the sound agent is producing `<ROOT>audio/timing.json` now)
- `film.mjs` loads `<ROOT>audio/timing.json`, else `data/provisional_timing.json` (from vo-final, `python3 tools/provisional_timing.py`).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(from, to, after)` (words), `T.clip('T2')` →
  `{ start, end }` for the slots T2, T1a, T1b, T3 (clips) and K3 (quote card read by the narrator). Never write seconds.
- Repeated phrases: 'This channel exists' (B1 M.01 / B3 A.01), 'When you turn off the light' (c01 / B3 12.03), 'You may be using one'
  (c01 / B3 12.04), 'So how close is' (c01 / B3 12.01), 'rung three', 'thirty thousand', 'a year ago': pass `after` (your chunk start
  `R.a`) or `nth`. 'How fast' occurs twice in c05/c06: the HUD comes back on 'How fast? For you'.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT31 }, …]`; R = `{ a, b, id, first }`. Entries outside
  [R.a, R.b) are dropped. Prefer ONE entry per chunk (or per group) with your own camera path (like sc01): one continuous take. Inner
  chunk boundaries of your group must be seamless (same picture on both sides).
- After a timing change re-run `python3 tools/shots31.py` (it warns on missing phrases) and re-check your stills.

## Seams (lib/f31_world.mjs; owned by the lead, import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'Picture a ladder' | `S.plateLadder` (LADDER_CAM: the whole ladder of pure gold light, floor to core, `glow: 1`; you at the foot; lamp OFF; hall .7) | c01 (done) | B1 2.01: the glow cools to metal (`ladder.glow` 1 → 0 over ≥ 1.8 s) while the labels rise |
| B1 → B2 | "So don't take Anthropic's word" | `S.plateClimb` (WIDE_CAM: rungs `S.CLIMB` = 1, 1, .5, 0, 0, no labels; lamp ON; hall .5; carts .6; the HUD) | B1 6.01 settles wide | B2 7.01: the evaluators step in at the hall door |
| B2 → B3 | 'Their scenario, late' | `S.plateMachine` (MACH_CAM: build .94, glow 1.15; ladder `S.CLIMB`; lamp ON; the HUD) | B2 9.08: the rail forks, the veil lifts onto the ring | B3 10.01: the SCENARIO · 2027 stamp rolls in |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push; `S.trk`, 30 px/s truck); the receiving
side continues both before it starts its own move (see how sc01 converges: `creepCam`). Check: `SECS=c01,c02 node tools/seam.mjs --at <T0>`
(0 POP, 0 FROZEN). World state that must match at a seam: lamp, hall, ladder state/glow, machine build, HUD (it draws itself from T).

## Kit API (lib/f31_kit.mjs as `F`, lib/f31_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **World:** `S.foundry(ctx, cam, t, st)` → `{ mc, hand, lad }`. st: `machine { build, glow, think, a }` · `builders { n, work, a }` | false ·
  `old { a, glow, thread }` · `carts` · `hall` · `lamp` (1 on, 0 off) · `you { x, y, h, o: { look, lean, view, … } }` | false ·
  `ladder { …F.ladder options, reach (default: the top ends in the core), du, dv }` | false · `veilBack` (veils hall + machine only, so ladder
  labels read) · `front(ctx, mc)` (machine card) · `back(ctx)` (hall card) · `extra(ctx, hand, lad)` (workshop card) · `fg`.
  Screen helpers `S.machineAt(c)`, `S.oldAt(c)` → [x, y, r]. Constants `S.MACH`, `S.OLD`, `S.YOU`, `S.BENCH`, `S.LAMPPOS`, `S.LADDERPOS`,
  `S.Z_*`. Cameras `S.HOOK_CAM`, `S.WIDE_CAM`, `S.MACH_CAM`, `S.LADDER_CAM`, `S.BENCH_CAM`, `S.OLD_CAM`, `S.END_CAM` (+ `S.END_TILES`),
  each `(k zoom, tr truck)`; or your own `E.aim(Z, u, v, s, sx, sy)`.
- **Camera:** `F.camPath(t, K)` with keys `[[t, cam], …]` (ref depth 6000); `E.camDrift(c, t, amp, seed)`; `F.float(ctx, t, k)` for
  screen-space explainers (never let a card stand still).
- **The ladder (the anchor):** `F.ladder(ctx, t, x, y, h, { u, w, state[5], lit[5], marker, labels, tags[5], side, size, brake, lean, glow })`
  (state: 1 gold = taken by the machine, 0 cream = held by people, .5 shared, 'f' dashed cool = forecast; `lit` animates a change; `brake`
  turns the lever; `marker` = the climbing machine 0…5). `F.ladderHUD(ctx, t, T, { a })` top left: **drives itself from `F.LADDER`
  phrases** (rung 1 TAKEN at 'So the first step up the ladder', rung 2 at 'So the second rung', rung 3 SHARED at 'So, rung three', FORECAST
  at "On the ladder, that's rung three", 4 / 5 HUMAN at 'Rung four' / 'Rung five'); draw it in every frame from 2.08 to 12.01; pass `a` to
  hide it while a full-frame ladder speaks. For the "HUD big" moments (3.03, 4.05, 5.06, 9.04) draw `F.ladder` big with
  `F.ladderState(T, t)` states, then let it shrink back into the HUD corner (carrier).
- **The numbers:** `F.codeShare` (9 OF 10) · `F.shareRing` (v0 .005 → v .26, p, note0 'FEB: <1 %') · `F.swarm` (count, eye, sweep, flag) ·
  `F.eye` (the monitor) · `F.gauge` (v 1.9, range [1.5, 2.8], p = needle) · `F.forecast` (title, now 2026.88, band, bandU, marks
  [{ from, to, p, label, sub, dy }], pins [{ at, label, sub, u }]) · `F.genChain` · `F.machine`, `F.builders` (for small machines anywhere).
- **Cards and text:** `F.paperCard`, `F.dataCard` (kind KNOWN / FORECAST / ESTIMATE), `F.quoteCard(ctx, t, T, { text, x, y, w, size, head,
  credit, spoken: [from, to], after, mode: 'hi' })` (words light as spoken; K3 = `F.SOURCES.pachockiText`), `F.priceTag` (a paper tag on a
  gold thread), `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.stamp`, `F.maskLine`, `F.rise`, `F.bracket`, `F.source(ctx, t, t0, t1,
  F.SOURCES.x)` (y 870), `F.veil(ctx, a)`, `F.title`.
- **Clips:** `F.clipPlate(ctx, t, T, 'T2', { from, morph, dark, label })` grows from `from` (a builder's eye: `[cx, cy, r]` in screen px) into
  `F.CLIP_RECT` and back. Frames are extracted to `/tmp/claude-0/f31/clips/T2|T1a|T1b|T3/` (`python3 tools/f31_clips.py clips`; re-run after
  the real timing lands). Lower third: TAO LIN · RESEARCHER AT ANTHROPIC · PERSONAL VIEW · NOV 15, 2026 · ORIGINAL FOOTAGE (PALISADE RESEARCH
  INTERVIEW). T1a is 33 s: hold the plate calm (no extra graphics over it); the HUD hides itself.
- **Strings:** `F.SOURCES` (lib/f31_kit.mjs) + docs/shots.md §5. Fact-check wording is binding: SOME INSIDERS · PERSONAL VIEW (never
  "speaking for himself") · METR always ON BENCHMARKS · NOT AN OFFICIAL ONE · STOCKS UP 30 % · LOOKS REAL. A string not in shots.md /
  `F.SOURCES` / vo-final needs a line in `<ROOT>faktenzettel.md`; say so in your report.

## Rules (from the owner; see MOTION.md §3)
- Calm: ≤ 1 hard world change per minute (plan: 0), one main movement at a time, a carrier for every transition, nothing from nowhere,
  no half-transparent ghost fades, nothing frozen. Big area changes ≥ 1.8 s (sineIO), small hits on the word (± 2 frames).
- One hero light: the next machine's core. The old machine stays dim. Gold = the machine / machine share; cream = people; cool = checking
  and forecasts; the yellow coat = only you. A machine is always a circle; no robots, brains, code rain, circuit boards.
- Explainer graphics 60–70 % overall: keep the layers of shots.md (EXPL over the veil, the foundry gliding behind).
- No logos, no real faces outside the Tao Lin clips, no AI images, no 3D look. No QR. The model's name is not on screen.
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px (sources 15–19), ≤ 6 words per statement except quotes, held ≥ 1.5 s.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks. Kit/world wishes: a local helper in your scene file, or ask the lead in your
  report. Never edit `audio/` (the sound agent's), `lib/f31_*.mjs`, `film.mjs`, `docs/`. No videos or large files in the repo; renders go to
  `/tmp/claude-0/f31/<you>/`; only small jpgs to `<ROOT>bild/` (`/mnt` is a network mount: use trailing slashes, never search it whole).
- Git: commit only your scene files; `git pull --rebase` before you push (the sound agent and the other builders push to the same branch).

## Render and check (per chunk, then for your whole group)
```
SECS=c02 node render.mjs --snap 61,63,65 --dir /tmp/claude-0/f31/b1/snap --scale .5                       # stills (every ~.5 s round transitions)
python3 tools/f31_clips.py render --only c02,c03 -j 4                                                      # 1080p chunk videos → /tmp/claude-0/f31/work/
rm -f /tmp/claude-0/f31/work/c02*   # BEFORE a re-render: finished pieces (`*.done`) are reused, so a changed scene renders stale
python3 tools/calm.py /tmp/claude-0/f31/work/c02.mp4 --scale 1280:720      # 0 cuts; static ~20 % is the 10 Hz grain (fine)
python3 tools/smooth.py /tmp/claude-0/f31/work/c02.mp4 <chunk start s>     # 0 flagged (LURCH > 12, POP)
SECS=c01,c02 node tools/seam.mjs --at <T0>                                  # your seams (0 POP, 0 FROZEN)
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Contact sheet of your group
(< 1 MB) to `<ROOT>bild/b1_kontakt.jpg` (b2, b3).

## Report (≤ 200 words)
Chunks done, check results (calm, smooth, seam), any string not in `F.SOURCES` / shots.md, open issues, contact sheet path, commit hash.
