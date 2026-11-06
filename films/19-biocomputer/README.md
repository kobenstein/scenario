# Film #19 · Computers Now Run on Human Brain Cells

Engine copied from films/18-capitalism (commit 432d433). Film 18 docs and c01 are kept as reference in `docs/ref-18/`, and the Film 18 libraries stay in `lib/` (f18_*).

Script: `/mnt/project-files/scenario/film-biocomputer/vo-v3.txt`. It is fact-checked against `faktenzettel.md`; the clip slots are in `clips-v1.md`.

Data root: `/mnt/project-files/scenario/film-biocomputer/`. This is a network mount, so put only small files there and keep renders in a scratchpad.

## Picture (lead, 2026-11-06)
**World.** THE RACK + THE DISH FIELD: a night server aisle in Singapore with one alive rack (gold drawer seams). Drawer 11 opens onto a dish with a gold neuron net. Seen from straight above, the dish becomes the explainer stage. You are the figure in the yellow raincoat. Details: `docs/MOTION.md`.

**Docs:**
- `docs/MOTION.md`: world, motion DNA, palette, calm rules, carriers, kit, gates.
- `docs/shots.md`: the binding shot list. Generate it with `python3 tools/shots19.py --md docs/shots.md`; explainer share 72 %.
- `docs/BRIEF-builders.md`: the builder split (B1 c02–c05, B2 c06–c08, B3 c09–c11 + end screen), seam plates, rules and checks.

**Timing.** `film.mjs` reads the first of these that exists:
1. `$TIMING`
2. `<ROOT>audio/timing.json`, the real VO from the audio agent
3. `data/provisional_timing.json`, built by `python3 tools/provisional_timing.py` from vo-v3

`ROOT` is `$F19ROOT`, or the data root above. Chunks and scenes anchor on global phrases: `T.G(phrase, nth, after)`, `T.GE`, `T.GW`.

**Kit.**
- `lib/f19_kit.mjs`:
  - pitched camera: `cam`, `camAt`, `view`, `proj`, `bill`
  - aisle: `hall`, `rack`
  - dish and net: `dish`, `net`, `fieldMap`, `planeMap`
  - objects: `cell`, `glyph`, `vial`, `cl1`, `creature`, `scoreboard`
  - ladder and question: `ladder`, `questionLine`
  - clips: `clipPlate`, `CLIP_RECT`
- `lib/f19_seams.mjs`: `plateClock`, `plateRack`, `plateNet`. Preview them with `node tools/seam_plates19.mjs <dir>`.

**c01 (the hook) is the quality reference:** `scenes/sc01.mjs`.
- Render: `SECS=c01 node --expose-gc render.mjs --out x.mp4 --from 0 --to 17`, in pieces of 20 s or less.
- Stills: `--snap a,b,c --dir d --scale .5`.
- Checks: `tools/calm.py`, `tools/smooth.py`, `tools/seam.mjs`.
