# Film 67 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-23

The lead built **c01** (the hook, 0 → `T.G('The man is Alexandr Wang')`) as the quality reference, plus the kit, the world, the seams, the
shot list and stubs for c02–c11. Three builders now build the rest **at the same time**, about 3 minutes of picture each. **Deadline:
finished preview render by 15:00 UTC**: build the whole group at preview quality first, polish after. Placeholders (screenshots, portrait,
clips) never block. **Load the skills first:** scenario-motion, world-class-motion-design, fluid-motion-design, motion-director-gates.
Then read: `docs/MOTION.md` (world + rules), `docs/shots.md` (your shots), `scenes/sc01.mjs` (how a chunk is built),
`<ROOT>bild/kit67_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/67-metas-ai-chief-says-superintelligence-is-arriving/code/` (repo branch `claude/project-thread-432v87`).
ROOT = `/mnt/project-files/scenario/film-si-arriving/` (`$F67ROOT`). Assets: `/home/user/scenario/films/67-assets/` (`$F67ASSETS`).
Git: commit only your own files (`git add scenes/sc0N.mjs`), `git pull --rebase --autostash` before `git push`, never force-push, **never
touch `code/audio/`** (the audio agent commits there).

| builder | chunks | from → to (phrase) | time (real VO) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 | 'The man is Alexandr Wang' → "That leaves Wang's boldest" | 1:09.5 – 4:18.5 (189 s) | **portrait print ONCE** (1.01, `F.portrait` + `F.nameplate`) · the labs, the bomb balance, X crop **lazy** · the billboard over his own lab · **C1** Wang out of the lab door · ★ the file glows in the OTHER lab's window · check 1: the ribbon, the referee, CORRECT, the community · ★ box 1 gold · **C2** out of the ribbon · check 2: two fields RIEMANN, the cardboard prop A = A (TAUTOLOGY), the rule book · box 2 gold + ? · check 3: two shadows, the author (EINBLENDUNG `F.SOURCES.alpoge` at 3.07; optional **C0** at 3.08), "outrageous" · ★ box 3 gold · the rival human proof · → plateReferee |
| **B2** | c05 c06 c07 | "That leaves Wang's boldest" → 'Not like a coup' | 4:18.5 – 7:12.0 (173 s) | X crop **alien** again behind box 4 · Tao with the magnifier, Radziwiłł · **C3** Tao · CORRECT ≠ UNDERSTOOD · the kitchen-table crack · ★ the tower, the seasons, box 4 OPEN · **harvest of the file** (4.10: under the headline only the small gold file) · **subscribe 1** (M.01) · PROOF over SUPERINTELLIGENCE · Maynard's milestone · LeCun portrait figure · **C4** LeCun · the road to a wall · ★ box 5 half · X crops **thousand** (1000x) and ★ **handover** · → plateHandover |
| **B3** | c08 c09 c10 c11 | 'Not like a coup' → end | 7:12.0 – 10:43.0 (211 s, incl. the 15 s end screen from 10:28.0) | the town hall scenario (bridge plan marks itself CORRECT, the tower on the table, ★ arm after arm, the yellow sleeve last, a thousand YESes) · back to today, ★ the cone of trust moves from the file to the referee · who builds the referees · X crop **defaultPath** · the lab desks, SHOW YOUR WORK, the open rule book · ★ the old bridge vs the new · four chairs · X crop **nextYear** + the wall calendar (NO clock) · thumbnail A again, checklist big · ★ box 4 OPEN big · AI SOLVED ___ · the final picture · **subscribe 2** (A.01) · end screen (`S.endScreen`, refine it) |

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`, or `$F67FONTS`).
If a quote card renders in a sans face, the fonts did not load: stop and say so.

## Timing (real VO; clip slots will still move)
- `film.mjs` loads `<ROOT>audio/timing.json` (+ `slots.json`). Film 643.02 s, end screen from 628.02. Clip slots are placeholders now
  (C1 98.87–108.87, C2 166.96–174.96, C3 282.76–292.76, C4 380.13–388.13) and shift when the real clips arrive.
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C2')` →
  `{ start, end }`. Never write seconds. After any VO change run `node tools/anchors67.mjs` (all anchors found) and `python3 tools/shots67.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'Superintelligence is arriving' (hook / 5.01 / 10.01: use
  'Superintelligence is arriving. So' for c11), 'This channel exists' (M.01 / A.01: nth 1 for subscribe 2), 'correct' (everywhere: anchor
  on the longer phrase of shots.md), "If he's right" (hook / later), 'First box: gold' etc. are unique.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT67 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. **One entry per chunk with your own camera path** (like sc01): one continuous take. Inner chunk
  boundaries of your group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).
- The stubs (`lib/stub67.mjs`) already draw the seam plates and the end screen; keep that when you replace them.

## Seams (lib/f67_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'The man is Alexandr Wang' (69.5) | `S.plateWang` (WANG_CAM: the headline, the post header pinned, your gold street, you by the board's foot, the dark tower, the author, the file on the spot, checklist 5 empty) | c01 (done) | B1 1.01: the post header's avatar grows into the portrait print |
| B1 → B2 | "That leaves Wang's boldest" (258.5) | `S.plateReferee` (REFEREE_CAM: the referee on his chair, gold card up, the ribbon to the horizon, nobody reads it; checklist 1–3 gold, 2 with ?) | B1 3.12 settles into it | B2 4.01: ALIEN MIND rises behind box 4 |
| B2 → B3 | 'Not like a coup' (432.0) | `S.plateHandover` (TOWN_CAM: HANDOVER in gold over your town hall, its windows lit; checklist 1–3 gold, 4 OPEN, 5 half) | B2 6.03 settles into it | B3 7.01: glide into the town hall through its window |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep(t, T, phrase)`, 4 %/s push; `S.trk(k)`, 30 px/s truck);
the receiving side continues both before it starts its own move. Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>` (no flags).

## Kit API (lib/f67_kit.mjs as `F`, lib/f67_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **World:** `S.landWorld(ctx, cam, t, st)` (all options in the file header: head, headExtra(ctx, boxes), post, postA, windows,
  board { spot, chalk, robot, robotGone }, tower { u, dark, pour, full, from }, ribbon { u, glow }, chair { referee, card, look }, labs,
  billboard, otherLab, hall, you { x, h, o } | false, author { x, h, o, laptop }, land(ctx), fg(ctx)) · screen points `S.headPt`,
  `S.landPt`, `S.postRect` · cameras `S.HOME`, `S.landCam(u, v, s)`, `S.WANG_CAM`, `S.BOARD_CAM`, `S.REFEREE_CAM`, `S.LABS_CAM`,
  `S.TOWN_CAM` · constants `S.Z_*`, `S.GY`, `S.HEAD`, `S.POST`, `S.YOU`, `S.BOARD`, `S.TOWER`, `S.CHAIR`, `S.RIB`, `S.LABS`, `S.HALL`,
  `S.BRIDGE` · `S.endScreen(ctx, t, T)`, `S.END_TILES`.
- **Objects:** `F.headline(ctx, t, { x, y, w, lines, u, glow, cream: [a, b], dim, cond, align })` → letter boxes (10.02: `cream [.5, 0]`) ·
  `F.file(ctx, t, x, y, s, { a, rot, glow, open, scan, lines, seed })` (THE FILE) · `F.ribbon(ctx, t, pts, { u, w0, w1, a, glow, seed })` ·
  `F.goldCard(ctx, t, x, y, s, { u, text: 'CORRECT', rot, glow })` (never a stamp) · `F.referee(ctx, t, x, y, h, { card, text, look, dir,
  armL })` · `F.paperTower(ctx, t, x, base, w, h, { u, full, dark, pour, from, seed })` · `F.balance(ctx, t, x, y, hw, { u, tilt, left,
  right })` · `F.notebook(ctx, t, x, y, s, o)`.
- **The checklist:** `F.checklist(ctx, t, T, { a, big, lit, dx, dy })` drives itself from `F.CHECKS` phrases (title on 'So test his
  claim', box n on its verdict phrase), hides in clip windows. Draw it in EVERY frame (c01 does from 'So test his claim'). `big` 0..1 =
  centred 2.3× (2.01, 10.01, 10.03); `lit` = index to pulse. `F.checkBox(i)` = the box's screen rect (aim things at it).
- **Wang's X post:** `F.xPost(ctx, t, x, y, w, { u, a, rot, glow })` (the header, unrolls with u) · `F.xQuote(ctx, t, id, x, y, w, { u,
  hiU, size, rot, a, darkPrint })` → `{ x, y, w, h, full, hi[] }` (unroll u, highlighter sweep hiU; ids alien, homework, lazy, thousand,
  handover, defaultPath, nextYear, views). `hi[]` = screen rects of the highlighted words (lift HANDOVER out of `hi[0]` at 6.02).
- **Portrait (ONCE, 1.01):** `F.portrait(ctx, t, x, y, h, { u, rot })` (paper-cut duotone, placeholder silhouette until the PNG exists) +
  `F.nameplate(ctx, t, x, y, u)` (ALEXANDR WANG · CHIEF AI OFFICER, META · LEADS META SUPERINTELLIGENCE LABS).
- **Explainers:** `F.paperCard`, `F.dataCard`, `F.quoteCard(ctx, t, T, { text, x, y, w, size, head, credit, spoken: [from, to], after,
  mode: 'hi' })`, `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.title`, `F.verdict`, `F.source(ctx, t, t0, t1, F.SOURCES.x)` (22 px,
  y 880), `F.veil(ctx, a)`, `F.float(ctx, t, k)` (never let a card stand still).
- **Camera:** `F.camPath(t, K)` with keys `[[t, E.aim(Z, u, v, s, sx, sy)], …]`; `E.camDrift(c, t, amp, …)`.
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, label })` grows from `from` (a rect or [cx, cy, r]) into `F.CLIP_RECT` and
  back. Until real clips exist it shows a placeholder plate with the lower third from `F.CLIPS` (names/sources marked TBD: update from
  `films/67-assets/clips/clips.md` when it lands; tell the lead). Frames: `python3 tools/f67_clips.py clips` → `/tmp/claude-0/f67/clips/`.
  C0 (Alpöge) has no VO slot yet: if clips.md has it, ask the lead for a slot at 3.08 "So listen to the mathematician himself".
- **Strings:** `F.SOURCES` (from skript/text-v2.md EINBLENDUNG). Wang quotes are the real X PNGs (wording checked in
  `films/67-assets/zitate-check.md`). If the current text differs from `F.SOURCES`, use the text and say so in your report.

## Rules (from the owner; see MOTION.md §3)
- ONE world (the night of the headline). Camera moves, not world changes. Max 1–2 moving elements. A carrier at every transition.
  Nothing from nowhere, no ghost fades, nothing frozen. Big area changes ≥ 1.8 s (sineIO), small hits on the word. One ★ per chunk.
- Every picture illustrates its sentence. Explainer share 60–70 % overall (plan 58 %: lift where you can).
- Gold = ONE hero light per frame. Box 4 is never red, never crossed: cream + OPEN. CORRECT is always the gold card. No logos, no real
  faces outside the clips and the portrait print, no AI images, no 3D look, no primitive shapes, no robots as heroes. No QR. Nothing from
  MOTION.md "Nicht wiederholen" (no clock face, no ladder, no stamps, no price tags/receipts from #66 …).
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks. Kit/world wishes: write a local helper in your scene file, or ask the lead in your
  report. Never edit `lib/f67_*.mjs`, `film.mjs`, `audio/`. No videos or large files in the repo; renders go to `/tmp/claude-0/f67/<you>/`;
  only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole project folder, exact paths only).

## Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 72,75,78 --dir /tmp/claude-0/f67/b1/snap --scale .5        # stills
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f67/b1/c02.mp4 --from 69.47 --to 126.2 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f67/b1/c02.mp4 --scale 1280:720      # 0 cuts
python3 tools/smooth.py /tmp/claude-0/f67/b1/c02.mp4 69.47                # 0 flagged (LURCH > 12, POP)
SECS=c04,c05 node tools/seam.mjs --at <T0>                                 # your seams (and your inner chunk boundaries)
node tools/anchors67.mjs                                                   # all anchors found
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Final 1080p chunks:
`python3 tools/f67_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable); assembly with subtitles and the mix: `assemble` (the lead).

## Report (≤ 200 words)
Chunks done, check results (calm, smooth, seam, anchors), any string you took from the text that differs from `F.SOURCES`, kit wishes,
open issues, contact sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`).
