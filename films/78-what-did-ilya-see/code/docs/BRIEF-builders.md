# Film 78 · brief for the builders B1 and B2 (lead, 2026-11-25)

You build finished picture (release Wed 2.12.2026), not a preview. Before you write code:
1. Load the skills **scenario-motion, world-class-motion-design, fluid-motion-design, motion-director-gates**.
2. Read `docs/MOTION.md` (whole), `docs/shots.md` (your chunks, binding), `lib/f78_kit.mjs` + `lib/f78_world.mjs` (headers), and
   **`scenes/sc01.mjs`** (the quality reference: one continuous take, phrase anchors, carriers, plate at the end).
3. Look at `<ROOT>bild/kit78_kontakt.jpg` (every kit piece) and `<ROOT>bild/c01_kontakt.jpg` (the hook).

## Who builds what
| builder | chunks | from phrase → to phrase | time | length | clips |
|---|---|---|---|---|---|
| Lead | c01 (done) + kit, plates, end screen | `What did Ilya see` → `So what was in those pages` | 0:00.0–0:59.3 | 59 s | — |
| **B1** | c02 c03 c04 c05 c06 | `So what was in those pages` → `That is why this channel exists` | 0:59.3–5:48.9 | 290 s | C2 (Toronto, in c04), C1 (NeurIPS, in c05), C3 (Dwarkesh, in c06) |
| **B2** | c07 c08 c09 c10 | `That is why this channel exists` → end | 5:48.9–10:16.7 | 268 s | C4 = QUOTE CARD (c07), C5 (Dwarkesh, in c09); the end screen = `S.endScreen` |
Chunk starts (film.mjs CHUNKS): c02 59.31 · c03 88.88 · c04 121.70 · c05 183.86 · c06 253.10 · c07 348.85 · c08 380.71 · c09 446.48 · c10 529.55.
Lead keeps: c01, the kit, both seam plates, the end screen, docs. Kit wishes go into your report (never edit `lib/f78_*.mjs`; put
chunk-only helpers into `lib/b1_*.mjs` / `lib/b2_*.mjs`).

## The contract (what every chunk must do)
- `scenes/scNN.mjs`: `export default (T, R) => [{ t, draw(ctx, t), print: F.PRINT78 }, …]`; entries outside [R.a, R.b) are dropped;
  every boundary is a cut, so **make your own boundaries identical frames** (best: ONE entry per chunk, like sc01).
- **Anchor on phrases only**: `T.G(phrase, nth, after)` / `T.GE`, clips `T.clip('C2')`. Never seconds. `node tools/anchors78.mjs` must pass.
- **One picture per sentence**: every row of shots.md for your chunk, column **zeigt wörtlich** (improve the drawing, never drop the idea;
  if a row cannot work, say why in the report and what you did instead). One ★ per chunk (flags).
- **Carriers**: each row's picture comes out of the previous one (shots.md column carrier). Nothing from nowhere, no crossfades, no ghost
  fades (alpha only ≤ .3 s together with a move), never still (`S.stage` + `S.drift2` + `F.float`), big moves ≥ 1.8 s sineIO.
- **Stage + camera**: `S.stage(ctx, t, cam)` first, then `S.view(ctx, cam)` and draw in design px (cam HOME = screen px). Camera keys
  with `S.camPath2(t, K)` on phrase times. Text ≥ 22 px, held ≥ 1.5 s; nothing important below y 880 (`F.source` sits at 880).
- **Colours**: GOLD what holds / hero light (one per frame) · CREAM open, questions · PAPER documents · COOL machines, screens · yellow
  raincoat only for you (`E.du`) · never red, OPEN is a cream ring.
- **Leitbild** (tower + man, `S.leitbild`): only B2 at A2 (6.06 → 7.03), A3 (9.07, ≤ 2.5 s) and A4 (9.18 → A.01 → end screen). B1: never.
- **People**: Ilya = `F.ilya` silhouette (no face); his real face only in the clips. The boss = a role, at most the name as text, never a
  photo or quote. No colleague name. Everyone else `E.person`. No logos (names as text).
- **Clips**: `F.clipPlate(ctx, t, T, id, { from, morph })` grows out of a thing on screen (a hall door, a stage screen, a ring) over ≥ 1 s
  before the slot and back after it; the lower third (from `audio/clips.json`) shows by itself during the slot. Draw only the plate (plus
  your stage) while the clip runs; nothing over the bottom 170 px.
- **Facts** (on-screen strings only from `F.SOURCES` / shots.md §5): no Musk, no Q*, no "feel the AGI"; nothing from the movie
  "Artificial" but its name + US RELEASE DEC 25, 2026; his 2024 exit = his own decision (never "fired", "forced out"); under C3 and at
  5.18 / 9.12 exactly A MACHINE THAT LEARNS LIKE A HUMAN: 5 TO 20 YEARS (never "AGI"); the law-firm card shows BOTH findings
  (`F.SOURCES.lawFirm`); the bunker (3.02) is a plain picture only: no quote, no card (#72). If you need a string that is not in
  `F.SOURCES`/shots.md, check `<ROOT>recherche/faktenzettel.md`; if you cannot support it, leave it out and say so.
- **Nicht wiederholen**: MOTION.md §7 (no ladder: the predictions are markers on `F.lifeLine`; no clock, hourglass, stamps, bell,
  crystal, robots, brains, referee, checklist, …).

## Seams (owned by the lead, `lib/f78_world.mjs`)
| seam | you draw | for |
|---|---|---|
| c01 → c02 at `So what was in those pages` | **B1**: `S.plateHook(ctx, t, T)` | t in [T0, T0 + .5): then grow 1.01 out of it (push into the pile, the top page lifts). Continue the creep (`S.creep`, `S.trk`): cam at T0 + .5 = `{ x: 960 + S.trk(k) * .5, y: 540, s: k }`, k = `S.creep(T0 + .5, T, phrase)`. The pieces are `S.HOOK` (pages, line, lectern) and `S.hookPicture`. |
| c06 → c07 at `That is why this channel exists` | **B1**: `S.plateRecord` for t in [T0 − .5, T0) and steer 5.27 into it (the life line at `S.RECORD`, markers `S.RECORD_MARKERS()`, knot, you, dawn) · **B2**: `S.plateRecord` for [T0, T0 + .5), then M.01 grows out of it | both |
| c10 → end | **B2**: `S.endScreen(ctx, t, T)` from `T.duration − 15` (601.68) to the end; steer A.01 into it | B2 |
Check every seam: `SECS=c06,c07 node tools/seam.mjs --at 348.85` → 0 flags (BLACK / FROZEN / POP), and look at the sheet.

## Gates before you report (MOTION.md §10)
Stills every ~.5 s around every transition (`SECS=c04 node render.mjs --snap … --scale .5`), a contact sheet per chunk,
`python3 tools/f78_clips.py render --only c02,c03 -j 4` (1080p30 → `/tmp/claude-0/f78/work/cNN.mp4`), `tools/calm.py <mp4> --scale 1280:720`
(0 cuts, quiet spots < 5 %, none > 2 s), `tools/smooth.py <mp4> <offset>` (0 flagged), `tools/seam.mjs` at your seams,
`node tools/anchors78.mjs`. Renders and frames only under `/tmp/claude-0/f78/`; small contact sheets to `<ROOT>bild/`.
Commit your own files on the branch (`git add` the paths you changed; never `audio/`, never A3/A7 mp4s), no force-push, do NOT push.
Report: chunk table with your ★ and measured numbers, what you changed against shots.md and why, kit wishes, honest biggest gap.
