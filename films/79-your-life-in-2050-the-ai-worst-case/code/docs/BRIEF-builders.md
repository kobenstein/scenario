# Film 79 · Brief for the builders B1 / B2 / B3

**Status: PROVISIONAL (built on vo-v1, 25.11.).** Final chunk starts, row ids and per-chunk shares are written here after
`vo-v2.txt` lands (expected: flashback after the hook removed, C2 moves to the data centre, the second half becomes
"the search for the one angry face", the way out goes through the stations WON / LOST / OPEN). Until then: build the KIT
pieces your chunk needs and block your scenes, but anchor on phrases that survive v2, never on seconds.

**First, before any code:** load the skills `scenario-motion`, `world-class-motion-design`, `motion-director-gates`,
`fluid-motion-design` (and `dataviz` for any chart). Then read, in this order: `docs/MOTION.md` (the whole plan, bindend),
`docs/shots.md` (rows, types, shares), `scenes/c01.mjs` (the quality bar: how a shot, a camera, a carrier and a MIX card are built),
the kit (`lib/f79_kit.mjs`, `lib/f79_street.mjs`, `lib/f79_places.mjs`, `lib/f79_expl.mjs`), the kit contact sheet
`/tmp/claude-0/f79/kit/kontakt_kit79.jpg`, and the #74 counterpart of your chunk in `ref74/scenes/` + `ref74/shots74.md`
(reference only: same places, NEVER the same picture; those files do not run).

## 1 · Split

Times = provisional vo-v1 timing (`data/provisional_timing.json`, 608 s). Sections from `tools/provisional_timing.py`.

| builder | chunk | from (v1) | content (v1) | explainer target |
|---|---|---|---|---|
| — (Bau-Lead) | c01 | 0:00 | hook: title, timeline, bedroom, kitchen + clock, hallway counter, your street, fence + tower (wow) | 36 % (built) |
| **B1** | c02 | 0:56.6 | the neighbour who built boats (orders stopped), your skill done by a machine for almost nothing; the Stanford economist + **C2**; "the first rung goes missing" (EXPL: ladder, no wave of unemployment, entry hiring); "the whole ladder is gone" | 70 % |
| **B1** | c03 | 1:46.7 | the kerb: robotaxi reads your balance and drives on; crates through the glass; the busiest street, not one errand yours; the **data centre** across the road (9 days, no windows); EXPL: more spent on data centres than offices, thousands build, ~100 stay | 65 % |
| **B1** | c04 | 2:53.5 | 10:00 the kitchen goes dark on schedule (one ≤ 3-frame accent), the tower does not flicker; power like air, machines breathe first; EXPL `X.pjm` (46 % of $63.6 bn, ESTIMATE); "who decided…? It's almost noon" | 70 % |
| **B2** | c05 | 3:26.8 | NOON: the street chimes, `PL.phoneNoon`; the allowance (company, algorithm, a little lower, nobody to appeal to; dividend vs allowance); "There is your answer": EXPL `X.need` (work + taxes = your seat at the table → the machines do both); `X.laborShare` if v2 keeps it; the computer scientist + **C1**; "a warning, not a forecast"; **subscribe 1** (anchor Wende: the street at noon) | 70 % |
| **B2** | c06 | 5:01.5 | why is the street calm: the grandson with his screen (`PL.boyScreen`), no bus, no bell; the locked school (`PL.school`, the second light-out); EXPL survey (≈ half of 9–12-year-olds used a chatbot, wording per faktencheck); the waiting room gone, a human costs extra | 65 % |
| **B2** | c07 | 5:52.0 | "That will take decades": EXPL the proof no human could read, breakthroughs as parcels nobody ordered; afternoon at the fence: `PL.land` (solar rows, grey halls to the hills, no gate on your side), "sold, one good offer at a time" (MIX: offers as paper slips) | 70 % |
| **B3** | c08 | 6:32.9 | the empty square in the evening (anchor Pointe, `PL.square({people:0,friends})`), the friend who never disagrees in every window; **C3**; "they feel looked after"; "your time, and nobody is waiting for it" | 60 % |
| **B3** | c09 | 7:24.3 | the bench (`PL.bench`): the grandson with the clock, "Why didn't anyone stop it?"; looking for a ruin / a villain / a day (EXPL: three empty frames); every step looked like a gift (car, screen, friend); the core sentence "Nothing in this street was destroyed. We just stopped being needed." (third light-out, the hold of the film) | 60 % |
| **B3** | c10 | 7:57.3 | the way out: "it isn't 2050"; your work, taxes, vote = leverage; the stations again with WON / LOST / OPEN marks (Kentucky farm said no, the news-agency strike vote, PJM proposal, California 15-minute human, Senate committee 22–0; "a proposal isn't a rule…"); **C4**; the other 2050 (the square full, a quote of #74's warm picture, `K.ring({cyan:true})` only here); **subscribe 2**; the clock wound and set; **end screen 15 s** `PL.endWind` | 55 % |

B1 ≈ 2:30 film, B2 ≈ 3:06, B3 ≈ 3:35 incl. the 15-s end screen (B3 has the fewest new places: square and bench exist in the kit).
**Film target: explainer share 60–70 %** (REGELN §13: weights E 1 · M .5 · S 0 · C 0, one picture per sentence). The hook carries
feeling at 36 %, so c02–c10 together must reach ~ 65–72 %. `python3 tools/shots79.py` prints the share per chunk; outside the band →
rebuild your rows, do not keep building.

## 2 · Rows (how to add yours)

1. In `tools/shots79.py` append your rows after the hook: `('B.01', 'first words of the sentence', 'E'|'M'|'S'|'C', '' | '*' (wow) | 'A' (anchor), 'what we see · carrier')`. One row per spoken sentence; long sentences may get two rows on a phrase inside them. Clip rows use the clip id (`C2`) as phrase.
2. Add your chunk to `CHUNKS` (`('c02', 'B.01', '…')`). Prefixes: c02 `B`, c03 `D`, c04 `K`, c05 `N`, c06 `G`, c07 `L`, c08 `Q`, c09 `E`, c10 `W`; the last row of c10 is `('END', None, 'S', 'A', 'end screen')`.
3. `python3 tools/shots79.py` → `docs/shots.md` + `data/rows.json`. Phrases must be unique after the previous row (sequential search).
4. Only the Bau-Lead edits rows of other chunks. Merge conflicts in `shots79.py`: keep your block contiguous.

## 3 · Your scene file

`scenes/cNN.mjs`, `export default function cNN(T, R) { … return [shots…] }`, exactly like `scenes/c01.mjs`:
- a shot = `{ id: '<first row>', draw(ctx, t, s), out: { k: 'portal'|'iris'|'sweep'|'cut'|fn, …, lead, dur } }`; `s.a/s.b` = shot start/end, `s.r('ROW')` = row time, `s.w('word')` = a word's time inside the shot.
- camera: `camK(t, [[time, cam3({…}) | aim(Z,u,v,zoom,sx,sy), ease]], drift)`; times from rows/words only. `'s'` sine for glides, `'q'` quart for moves into a carrier.
- the HUD (`scenes/hud.mjs`): add your `CLOCK`, `HOURS`, `COUNT` (NOT NEEDED line) and `HIDE` entries; rows missing in the file are skipped.
- the first shot of your chunk must take over the last carrier of the previous chunk (c01 ends on `cut` from the pulled-back street at 8:10 with every door shut and the MONDAY leaf; c02 starts in that same street → the neighbour's boat shed). Agree carriers at the chunk seams with your neighbour builder through the Bau-Lead.
- new kit pieces go into the shared libs only as **new exported functions** (no edits to existing signatures); name them in your hand-off.

## 4 · Rules that fail a chunk

- Every sentence has its own picture; no "one world with zooms" (a move inside the same picture never counts as a new motif).
- Nothing stands still (camera drift + living figures); no crossfades, no wipes, no hard cuts without a rhyme; every seam has a carrier (MOTION §7).
- One wow per chunk at most; ≤ 2 hard accents per 30 s, ≥ 0.8 s hold after each. Light rules MOTION §5 (carmine never brighter than you; human light goes out only 3× in the film: kitchen c04, school c06, home lamp c09).
- Numbers exactly from `/mnt/project-files/scenario/film-79-worst-case/faktencheck-imac.md` (wins) and `faktenzettel.md`; ESTIMATE / PRELIMINARY labels; source line on every EXPL with a number; charts follow the dataviz skill (carmine `#e0284f` vs rest `#6a74a8` on `#0b1238`, validated).
- Nothing important below y 880 (subtitles), text ≥ 22 px, Instrument Serif + Inter only, no faces, no robots, no money props.
- Clips: frames from `/home/user/scenario/films/79-assets/clips/` (C1–C4, 60 s each; the In/Out in `clips.json` refer to the SOURCE video: find the sentence in the 60-s file by ear), cut to `/tmp/claude-0/f79/clips/<id>/`; plate grows out of a paper card and folds back; lower third `NAME · ROLE · YEAR · ORIGINAL FOOTAGE (CHANNEL)`.

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

## 7 · c01 reference numbers (25.11., vo-v1)

5-s test `/tmp/claude-0/f79/test/c01_5s.mp4`: 0 cuts, mafd median 0.21, 0 smooth flags, 0 freezes.
Full hook `/tmp/claude-0/f79/test/c01_hook.mp4` (57 s): see `docs/MOTION.md` §11 for the measured values after the calm pass.
