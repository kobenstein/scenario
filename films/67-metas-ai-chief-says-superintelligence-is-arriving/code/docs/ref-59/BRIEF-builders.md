# Film 59 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-16

The lead built **c01** (the hook, 0 → `T.G('The seller is Anthropic')`) as the quality reference, plus the kit, the world, the seams and the
shot list. Three builders now build the rest **at the same time**, about 3 minutes of picture each. Upload Tue 17.11. 17:00 Vienna; the film is
built through to the end with no interim review. Read first: `docs/MOTION.md` (world + rules), `docs/shots.md` (your shots), `scenes/sc01.mjs`
(how a chunk is built), `<ROOT>bild/kit59_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.

| builder | chunks | from → to (phrase) | time (timing 16.11. 10:18) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'The seller is Anthropic' → 'Many doubt it' | 0:57.4 – 3:56.7 (179 s) | out of the window: the city, the crystal = ANTHROPIC, NASDAQ: ANT · data card (range, 825M shares) · 2nd-largest IPO by money raised · the jar · STEP 1 THE PITCH · the prospectus, 90+ pages of risk factors · the vote bar 49.9 / 50.1 · **NEW: the Meta card** ('Founders keeping control') · the trust (4 trustees, 1 seat open) · ★ the room, 7 + 4 · thumbnail C · the safety decisions · **C1** clip · **Z1** quote card → plateCrystal |
| **B2** | c06 c07 c08 | 'Many doubt it' → 'Reports say there are' | 3:56.7 – 7:07.8 (191 s) | STEP 2 · Levine letter, daily grades, the governance expert · **C2** Bengio clip · the race lanes · the essay + held-back model · STEP 3 PRICING NIGHT · ≈ $1.4 T · KNOWN / FORECAST trays · ★ REVENUE $41M → $17.0B · net loss · **C3** clip → plateSort |
| **B3** | c09 c10 c11 c12 | 'Reports say there are' → end | 7:07.8 – 10:16.3 (189 s, incl. the 15 s end screen) | orders ≈ 6× · "most ridiculous IPO" · indexes and the jar · ★ THE BELL (STEP 4, +15 TRADING DAYS) · Warren letter · Amazon/Google class N · ★ the dinner table again · the PBC beam · the warning returns · you, the stake, ★ threads to every window · subscribe 2 · END_CAM end screen |

The subscribe call 1 (M.01, 'This channel exists') is in B2 (c07); subscribe 2 (A.01, 2nd 'This channel exists') in B3.

## Timing (it WILL move: the sound agent is re-taking lines)
- `film.mjs` loads `<ROOT>audio/timing.json` (ROOT = `/mnt/project-files/scenario/film-ai-goes-public/`, `$F59ROOT`).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start of the phrase), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words),
  `T.clip('C1')` → `{ start, end }` for the slots C1, C2, C3 (clips) and Z1 (quote card read by the narrator). Never write seconds.
- Repeated phrases: 'Seven founders' (B1 3.07 / B3 10.04), 'You can buy a piece' (c01 / B3 11.03), 'This channel exists' (B2 / B3):
  pass `after` (your chunk start `R.a`) or `nth`.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT59 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. Prefer ONE entry per chunk with your own camera path (like sc01): one continuous take.
- After a timing change re-run `python3 tools/shots59.py` (it warns on phrases that are not in the timing yet).

## Seams (lib/f59_world.mjs; owned by the lead, import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'The seller is Anthropic' | `S.plateWindow` (WIN_CAM: the room through the tower window) | c01 (done) | B1 1.01: pull back out of the window to the city and the crystal |
| B1 → B2 | 'Many doubt it' | `S.plateCrystal` (CRY_CAM: the crystal big, "$ ?" tag on a gold thread, board STEP 1) | B1 4.08 | B2 5.01: the board lights STEP 2 by itself |
| B2 → B3 | 'Reports say there are' | `S.plateSort` (SORT_CAM: veiled city, KNOWN / FORECAST trays with 4 cards, board STEP 3) | B2 7.08 | B3 8.01: trays slide aside, order stacks rise |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push; `S.trk`, 30 px/s truck); the receiving
side continues both before it starts its own move. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>` (0 POP, 0 FROZEN).

## Kit API (lib/f59_kit.mjs as `F`, lib/f59_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **World:** `S.cityWorld(ctx, cam, t, st)` (options in the file header: crystal, tag, room, win, bell, city 0..1 warm windows, you,
  shard, jar, beam, extra/back/fg) → `{ cr, hand }` · `S.winRect(c)`, `S.crystalAt(c)` (screen boxes for carriers) · cameras `S.WIN_CAM`,
  `S.CRY_CAM`, `S.SORT_CAM`, `S.END_CAM`, `S.END_TILES` · constants `S.Z_*`, `S.CRY`, `S.YOU`, `S.LEDGE`, `S.TOWER`, `S.WIN`, `S.BELL`, `S.JAR`
  · `S.crystalTag`, `S.sortTrays`, `S.SORT`.
- **Camera:** `F.camPath(t, K)` with keys `[[t, E.aim(Z, u, v, s, sx, sy)], …]`; `E.camDrift(c, t, amp, …)`; `F.float(ctx, t, k)` for
  screen-space cards (never let a card stand still).
- **Objects:** `F.crystal`, `F.shard`, `F.wheel` (glass, spin), `F.bell` (swing, ring, clapper), `F.jar` (fill, slice),
  `F.prospectus` (u, thick, tabs, open, cover, sub, page(ctx, w, h)), `F.room` (lit, seated, wheel, count), `F.seats`, `F.appScreen`.
- **Explainers:** `F.paperCard`, `F.dataCard` (title, big, small, bigSize, h), `F.quoteCard(ctx, t, T, { text, x, y, w, size, head,
  credit, spoken: [from, to], after, mode: 'hi' })` (words light as spoken), `F.voteBar` (49.9 / 50.1, label ALL CLASS A SHARES, OLD AND
  NEW), `F.priceTag` (a paper tag on a gold thread), `F.title`, `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.stamp`, `F.maskLine`,
  `F.rise`, `F.bracket`, `F.source(ctx, t, t0, t1, F.SOURCES.x)` (y 890), `F.veil(ctx, a)`.
- **Board:** `F.board(ctx, t, T, { a, big })`: drives itself from `F.BOARD` phrases; hides in clip windows. Draw it in every frame of your
  chunk (except where you deliberately make it big: `big` 0..1 on 9.03).
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, label })` grows from `from` (a facet rect or [cx, cy, r]) into
  `F.CLIP_RECT` and back. Frames are already extracted to `/tmp/claude-0/f59/clips/C1|C2|C3/` (`python3 tools/f59_clips.py clips`).
- **Strings:** `F.SOURCES` holds every source line and the fact-checked cards (s1riskText, firstTrade, ipoRank + s1a (Renaissance
  Capital), ltbtCard + ltbt, metaCard + meta (Fortune, Oct 26, 2026), pace (+ held-back model: Amodei on X, Oct 2026), …).
  **The current `<ROOT>vo-v3.txt` [EINBLENDUNG] lines win**; if they differ from `F.SOURCES`, use vo-v3 and say so in your report.

## Rules (from the owner; see MOTION.md §3)
- Calm: ≤ 1 hard world change per minute (plan: 0), one main movement at a time, a carrier for every transition, nothing from nowhere,
  no half-transparent ghost fades, nothing frozen. Big area changes ≥ 1.8 s (sineIO), small hits on the word.
- Explainer graphics 60–70 % overall: keep the layers of shots.md (EXPL over the veil, the world gliding behind).
- No logos, no real faces outside the UN clips (Meta = a text card), no AI images, no 3D look. No QR. No "corrections get pinned".
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement except quotes, held ≥ 1.5 s.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks. Kit/world wishes: write a local helper in your scene file, or ask the lead in your
  report. Never edit `audio/` (the sound agent's), `lib/f59_*.mjs`, `film.mjs`. No videos or large files in the repo; renders go to
  `/tmp/claude-0/f59/<you>/`; only small jpgs to `<ROOT>bild/` (`/mnt` is a network mount: re-read a file ~10 s after writing it).

## Render and check (per chunk, then for your whole group)
```
SECS=c02 node render.mjs --snap 58,60,62 --dir /tmp/claude-0/f59/b1/snap --scale .5        # stills
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f59/b1/c02.mp4 --from 57.4 --to 87.0 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f59/b1/c02.mp4 --scale 1280:720      # 0 cuts; static ~20 % is the 10 Hz grain (fine)
python3 tools/smooth.py /tmp/claude-0/f59/b1/c02.mp4 57.4                 # 0 flagged (LURCH > 12, POP)
SECS=c05,c06 node tools/seam.mjs --at <T0>                                 # your seams
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Final 1080p chunks:
`python3 tools/f59_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable), assembly with subtitles and the mix: `assemble` (the lead).

## Report (≤ 200 words)
Chunks done, check results (calm, smooth, seam), any string you took from vo-v3 that differs from `F.SOURCES`, open issues, contact sheet path.
