# Film 79 · Brief for the builders B1 / B2 / B3

**Status: FINAL on vo-v2 (25.11.), timing still provisional** (`data/provisional_timing.json` from `vo-v2.txt`, 594 s; the real
VO timing `audio/timing.json` replaces it later; code anchors on row ids and phrases, so nothing has to move when it lands).
The rows of every chunk are fixed in `tools/shots79.py` / `docs/shots.md` (187 rows, one per sentence, film explainer share **62.6 %**).
vo-v2 changes against v1: no flashback after the hook (the economist moves to the data centre, C2 there), the second half is
**the search for the one angry face** (children → grown-ups → farmers → the square: ANGRY FACES 0), the way out goes back through the
stations with **WON / OPEN / LOST** (fields WON, screen OPEN, kitchen LOST, allowance vs share OPEN), and the last clip is **R6** (5.6 s,
Brynjolfsson, Revelio; replaces C4).

**First, before any code:** load the skills `scenario-motion`, `world-class-motion-design`, `motion-director-gates`,
`fluid-motion-design` (and `dataviz` for any chart). Then read, in this order: `docs/MOTION.md` (the whole plan, bindend),
`docs/shots.md` (rows, types, shares), `scenes/c01.mjs` (the quality bar: how a shot, a camera, a carrier and a MIX card are built),
the kit (`lib/f79_kit.mjs`, `lib/f79_street.mjs`, `lib/f79_places.mjs`, `lib/f79_expl.mjs`), the kit contact sheet
`/tmp/claude-0/f79/kit/kontakt_kit79.jpg`, and the #74 counterpart of your chunk in `ref74/scenes/` + `ref74/shots74.md`
(reference only: same places, NEVER the same picture; those files do not run).

## 1 · Split

Times = provisional vo-v2 timing. Shares = `tools/shots79.py` per chunk (weights E 1 · M .5 · S 0 · C 0). Each chunk's rows, types and
pictures are in `docs/shots.md` §3: build exactly those (a row may be improved, never dropped; changes of type go through the Bau-Lead).

| builder | chunk | rows | from | length | share | content |
|---|---|---|---|---|---|---|
| — (Bau-Lead) | c01 | H.01–H.27 | 0:00 | 0:58 | 37 % | hook (built, quality bar) |
| **B1** | c02 | B.01–B.13 | 0:58.8 | 0:38 | 64 % | the neighbour's boat, orders stop, your work to a machine, NOT NEEDED · YOUR WORK, BALANCE 0, the road, cars full of crates, YOUR ERRANDS 0 |
| **B1** | c03 | D.01–D.17 | 1:37.1 | 1:03 | 63 % | the data centre (9 days, no windows, STAFF 0), the economist card + **C2**, the young line and the missing rung (wow: the rung drops), the whole ladder gone, DRIVE · BUILD · RUN, to 10:00 |
| **B1** | c04 | K.01–K.12 | 2:40.2 | 0:35 | 73 % | the kitchen goes dark (light-out 1), the schedule ring, power like air, machines breathe first, `X.pjm` (63.6 bn, 46 %, ESTIMATE), to noon |
| **B2** | c05 | N.01–N.31 | 3:14.8 | 1:37 | 79 % | NOON (anchor Wende, `PL.phoneNoon`), the allowance (company not government, algorithm, no reason, a human costs extra, dividend vs allowance), `X.need` then/now, vote, the menu, **C1**, warning not forecast, the allowance steps down |
| **B2** | c06 | G.01–G.17 | 4:51.3 | 0:57 | 68 % | **subscribe 1** (anchor), the search ring ANGRY FACES 0, the grandson at his screen, bus stop, bell, the loop, the locked school (light-out 2), ARGUMENTS LOST 0, survey (> 1/3 of US kids …), STILL BEING DECIDED |
| **B2** | c07 | L.01–L.13 | 5:48.1 | 0:40 | 59 % | the grown-ups, DECADES → EVERY WEEK parcels, the farmers' map, the fence at 4 PM, `PL.land`, gates open from the other side, SOLD one offer at a time |
| **B3** | c08 | Q.01–Q.14 | 6:28.3 | 0:54 | 55 % | the square (anchor Pointe), the friend in every window, it only gives, **C3**, ANGRY FACES 0 · LOOKED AFTER, YOUR TIME |
| **B3** | c09 | E.01–E.08 | 7:22.5 | 0:32 | 62 % | the bench, the stories out of the clock, "Why didn't anyone stop it?", three empty frames, three gifts, the core sentence (wow, light-out 3) |
| **B3** | c10 | W.01–END | 7:54.5 | 2:00 | 60 % | 2050 → 2026, blueprint street, WORK · TAXES · VOTE = leverage, the stations: fields WON (Kentucky, $26 million), screen OPEN (Senate committee 22–0, not law), kitchen LOST (PJM plan turned down by FERC in October), allowance vs share OPEN, **R6**, the other 2050 (warm, #74 quote), **subscribe 2**, the clock wound, **end screen 15 s** |

B1 2:16 of film, B2 3:14, B3 3:26 incl. the 15-s end screen (B3's places square and bench already exist in the kit; c05 is almost all EXPL).
**Film: 62.6 %** (target 60–70 %). Keep each chunk at or above its share; after any row change run `python3 tools/shots79.py`.

## 2 · Rows

Rows are fixed (see above). If a sentence needs a second picture, add a row on a phrase INSIDE it (`('B.05b', 'for pennies', …)`) and
run `python3 tools/shots79.py`; phrases must be unique after the previous row (sequential search). Only the Bau-Lead merges row
changes of other chunks; keep your block contiguous. Clip rows have the clip id as id and no phrase.

## 3 · Your scene file

`scenes/cNN.mjs`, `export default function cNN(T, R) { … return [shots…] }`, exactly like `scenes/c01.mjs`:
- a shot = `{ id: '<first row>', draw(ctx, t, s), out: { k: 'portal'|'iris'|'sweep'|'cut'|fn, …, lead, dur } }`; `s.a/s.b` = shot start/end, `s.r('ROW')` = row time, `s.w('word')` = a word's time inside the shot.
- camera: `camK(t, [[time, cam3({…}) | aim(Z,u,v,zoom,sx,sy), ease]], drift)`; times from rows/words only. `'s'` sine for glides, `'q'` quart for moves into a carrier.
- the HUD (`scenes/hud.mjs`): add your `CLOCK`, `HOURS`, `COUNT` (NOT NEEDED line) and `HIDE` entries; rows missing in the file are skipped.
- the first shot of your chunk must take over the last carrier of the previous chunk (c01 ends on `cut` from the pulled-back street at 8:10, every door shut, the neighbour's garage door in view; c02 starts on that garage door rolling up → the boat hull). Agree carriers at the chunk seams with your neighbour builder through the Bau-Lead.
- new kit pieces go into the shared libs only as **new exported functions** (no edits to existing signatures); name them in your hand-off.

## 4 · Rules that fail a chunk

- Every sentence has its own picture; no "one world with zooms" (a move inside the same picture never counts as a new motif).
- Nothing stands still (camera drift + living figures); no crossfades, no wipes, no hard cuts without a rhyme; every seam has a carrier (MOTION §7).
- One wow per chunk at most; ≤ 2 hard accents per 30 s, ≥ 0.8 s hold after each. Light rules MOTION §5 (carmine never brighter than you; human light goes out only 3× in the film: kitchen c04, school c06, home lamp c09).
- Numbers exactly from `/mnt/project-files/scenario/film-79-worst-case/faktencheck-imac.md` (wins) and `faktenzettel.md`; ESTIMATE / PRELIMINARY labels; source line on every EXPL with a number; charts follow the dataviz skill (carmine `#e0284f` vs rest `#6a74a8` on `#0b1238`, validated).
- Nothing important below y 880 (subtitles), text ≥ 22 px, Instrument Serif + Inter only, no faces, no robots, no money props.
- Clips: frames from `/home/user/scenario/films/79-assets/clips/` (C1–C4, 60 s each; **R6** (source 50:16.1–50:21.7) has no own file: it may lie inside the C4 file (C4 source 49:37.6, file window unknown), else it has to be fetched; the In/Out in `clips.json` refer to the SOURCE video: find the sentence in the 60-s file by ear), cut to `/tmp/claude-0/f79/clips/<id>/`; plate grows out of a paper card and folds back; lower third `NAME · ROLE · YEAR · ORIGINAL FOOTAGE (CHANNEL)`.

## 5 · Gates (per chunk, in this order)

1. Plan block at the top of your scene file (beats, carriers, wow) → 2. snapshots every 0.5 s + every seam:
   `node render.mjs --snap 61,61.5,… --dir /tmp/claude-0/f79/<chunk>/snap --scale .4` → contact sheet, check against the gates AND the
   script line by line → 3. 5-s test of your first shot at full quality → 4. full chunk render
   `SECS=cNN node --expose-gc render.mjs --out /tmp/claude-0/f79/<chunk>/<chunk>.mp4 --from <a> --to <b>` →
   5. `python3 tools/calm.py <mp4> --scale 1280:720` (0 cuts, mafd median ≤ .43), `python3 tools/smooth.py <mp4>` (0 flags; a camera
   pan over > 1/3 of the frame in < 1.5 s always flags: use a wider frame instead), `ffmpeg -i <mp4> -vf freezedetect=n=0.001:d=0.5 -f null -` (none).
- Renders ONLY under `/tmp/claude-0/f79/`, never into the repo. Commit code + docs only (no mp4/jpg), on the branch the Bau-Lead names; do not push.

## 6 · Hand-off (to the Bau-Lead)

Paths of the chunk render + contact sheet, measured calm/smooth/freeze numbers, explainer share of your chunk, new kit functions,
the carrier at each of your two seams, and open points (facts you could not verify, rows you would change).

## 7 · c01 reference numbers (25.11., vo-v2) and one pitfall

5-s test `/tmp/claude-0/f79/test/c01_5s.mp4`: 0 cuts, mafd median 0.21, 0 smooth flags, 0 freezes.
Full hook `/tmp/claude-0/f79/test/c01_hook.mp4` (58.8 s): 0 cuts, mafd median 0.58 (above .43: build calmer than the hook), 8 smooth flags at the iris/sweep seams, 0 freezes.
**Pitfall (@napi-rs/canvas):** `shadowBlur` on a fill at a very low `globalAlpha` renders nearly opaque (it caused a one-frame white pop in the hook). Fade glows with expanded low-alpha fills or `K.carmGlow`, never with shadowBlur at alpha < ~.2.
