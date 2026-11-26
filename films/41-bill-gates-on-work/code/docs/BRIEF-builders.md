# Film 41 · builder brief (B1 · B2 · B3)

**First:** load the skills `scenario-motion`, `world-class-motion-design`, `fluid-motion-design` and `motion-director-gates`, plus `dataviz` for any chart or number.
Then read:
- `regeln/REGELN.md` §13 (one picture per sentence, explainer share 60–70 %, NO single big scene with zooms, a real motion-design film);
- `docs/MOTION.md`;
- your chunks in `docs/shots.md`.

The lead's hook (`scenes/sc01.mjs`) is the reference for the look, the type and the carriers. Read it before you write a line.

## Setup

- Repo `films/41-bill-gates-on-work/code`. Run `npm install` once (never commit node_modules).
- Timing: the real VO at `<ROOT>audio/timing.json`, picked up automatically.
  - ROOT = `/mnt/project-files/scenario/film-bill-gates/`.
  - Anchor ONLY on phrases (`T.G(phrase, 0, after)`) and slots (`T.clip('C2')`, the card `T.clip('C4')`).
- Clip frames: `python3 tools/f41_clips.py clips` writes them to `/tmp/claude-0/f41/clips/` (C1–C3, from `films/41-assets/clips/`).
- Renders go to `/tmp/claude-0/f41/<you>/`, never into the repo.
- Your files: only `scenes/scNN.mjs` for your chunks.
  - `lib/f41_kit.mjs`, `lib/f41_world.mjs`, `film.mjs` and the tools are the lead's. Put wishes in your report.
  - Small private helpers live inside your scene file.
- Each scene file: `export default (T, R) => [{ t, draw(ctx, t), print: F.PRINT41 }, …]`. You own `[R.a, R.b)`. Hard cuts only between frames you make identical. Better: one draw function per chunk that hands carriers on.

## The groups

| group | chunks | time (real VO) | builds |
|---|---|---|---|
| **B1** | c02 · c03 · c04 | 1:06.5 – 4:08.3 (182 s) | his picture of the machine; the timeline is born; stop 1 (screen work, −19 % chart); stop 2 (the hands, the site, C2, the choice); who is talking |
| **B2** | c05 · c06 · c07 | 4:08.3 – 7:09.0 (181 s) | the numbers and the verdict card; SUBSCRIBE 1; stop 3 (20 YEARS band, C3); the plan, the tax scale, Etzioni, being needed; the list gets its candidates |
| **B3** | c08 · c09 · c10 | 7:09.0 – 10:17.5 (189 s) | the jury; the tower of 100 windows (40 % ceiling); quote card C4; open questions; the price line; your line; the far end; the core line; SUBSCRIBE 2; end screen |

### B1 · c02, c03, c04

- **Start (c02):** at `What changed is his picture`, draw `S.plateMachine` for [R.a, R.a + .5). Then grow 1.01 out of it: the cyan disc (`S.machinePic` is its content).
- **The timeline is born in c02** (1.11–1.15): a gold dot draws the line big in the centre (`F.timeline(..., { big })` in step with its phrases), then it shrinks to its corner. From then on, draw `F.timeline(ctx, t, T)` in every frame except inside clip plates.
- **The portrait print (1.10)** appears ONCE in the whole film. Use `F.portrait` + `F.nameplate` with the credit `F.source(…, F.photoCredit())`. A marked placeholder shows until `films/41-assets/gates/portrait-cutout.png` + `credit.txt` exist (Commons is blocked here).
- **c03 needs two scenes of your own design:** the night office with its rows of screens, and the bus stop NOW with young figures.
  - The −19 % chart (2.05, ★) builds on `S.gapChart`. Use honest axes, a label, and the source `F.SOURCES.gapSrc`.
- **c04 needs the site and the field (3.04, ★):** humanoid robots small, distant and cold. The cabin window grows into the C2 plate (`F.clipPlate(…, { from: rect, morph })`).
  - IF WE DON'T CHOOSE: the caption line rewinds.
  - Then build / buy / switch on, the switch from H.12 again (`F.lever`), and the dials.
  - Who is talking: GATES → MICROSOFT ⟷ the company behind ChatGPT, "ONE OF THE BIGGEST SHAREHOLDERS" (`F.SOURCES.shareholder`). Names as type, no logos.
- **End (c04):** 3.18 lays the barrier line down as the gold baseline of `S.plateNumbers`. Draw the plate for the last .5 s before `Then the numbers`.

### B2 · c05, c06, c07

- **Start (c05):** `S.plateNumbers` for .5 s, then frame the chart corner.
  - Yale: `F.SOURCES.yale` / `yaleSrc`.
  - FORECAST vs FINDING.
  - The verdict card, three rows on their phrases (`F.SOURCES.verdicts`).
  - 4.09: the hand behind the card (`S.sky`-style hand, dim).
- **SUBSCRIBE 1 (M.01):** your window, other lit windows around, the timeline with your dot, and `F.subscribe` rising.
  - Its ring closes on "subscribe".
  - Calm: no flashing, no arrow, no logo.
  - The call runs 296.4–307.3 s (`channel_calls.t12` in timing.json).
- **c06:**
  - ★ the third stop stretches into the 20 YEARS band (`F.timeline` does that by itself at "It's a stretch of time"; show it `big`).
  - The band grows into the C3 plate. Then winners and losers, and your working life as a path.
  - The plan card; FAR FEWER JOBS returns exactly like H.03, then the asterisk and the footnote.
  - The tax scale in a factory yard: the wage is taxed; the robot is written off right away (`F.SOURCES.writtenOff`).
- **c07:**
  - The fix: tax by usage (`byUse`), retraining + a stronger safety net (`taxUses`).
  - Etzioni: quote card `etzioni` / `etzioniSrc`, the typewriter, the counter beside the empty chair.
  - The two slots; your desk with the paycheck (★ being needed).
  - The slot grows into THE LIST; the Human Reserved quote (`hrQuote`); lines CHILD CARE · JURY · ART · TEACHING.
- **End (c07):** converge onto `S.plateJury` for the last .5 s before `Take the jury`.

### B3 · c08, c09, c10

- **Start (c08):** `S.plateJury` for .5 s. The JURY line lifts off and unfolds into twelve chairs (no hall). Then ★ you before them, the cyan scale, and the chairs filling.
  - **The tower of 100 windows** (7.06–8.04) is one scene you design: an office tower at night with exactly 100 windows.
  - On it: the guesses, 40 windows gold with the counter (★), the ceiling line, MAYBE YOURS.
  - **Quote card C4** (`T.clip('C4')`, read by the narrator): `F.quoteCard` with `F.SOURCES.k1` / `k1Src`, words lit as spoken.
  - Then the three open questions (`open3`), lobbying, not well paid, `weak3`.
- **c09:**
  - ★ THE PRICE LINE sinks across the tower: a window turns cyan in the exact frame the line passes under it. Compute this from the line; never time it by hand.
  - Then your window, the two cost bars, and kinetic type for WHAT DOES IT COST? / WHY SHOULD A PERSON DO THIS?, the empty line at your desk, and the REASON field.
- **c10:**
  - ★ THE FAR END: past the end of the 20-year band, a dawn land with many small lit homes. This is the warmer palette of the solution part.
  - Then the ring of people, the list in the ring, the cold fill (`F.list(…, { fill })`), the silence lane from H.11, and every line open.
  - **The final picture (9.09):** `S.sky` with the list standing beside your desk; the core lines (`F.SOURCES.core`) set one by one on their words.
  - **SUBSCRIBE 2** (call 586.3–598.5 s): small lights come on in windows round the list; `F.subscribe`.
  - **End screen** (602.5–617.5): `S.endScreen` (free tile areas left and right; subscribe below centre). Hand into it without a jump.

## Done means

1. `node tools/anchors41.mjs` passes.
2. `python3 tools/shots41.py`: if you change a shot, change it there first, keep the share 60–70 %, and say so in your report.
3. Keyframe review every ~0.5 s and at every transition against the four skills' gates. Every frame shows the sentence being spoken, and every transition has a visible carrier.
4. A 0.5-scale render of your chunks, then:
   - `calm.py`;
   - `smooth.py` (no LURCH > 12, no POP);
   - `seam.mjs` at your group seams (no BLACK, FROZEN, POP or FAST);
   - a contact sheet.
5. Commit only `scenes/scNN.mjs` (and shot-list edits). No media, no node_modules. `git pull --rebase` first; never force-push. Attribution per the session.
6. Report (< 200 words): what you built, test results, deviations, and wishes for the kit.
