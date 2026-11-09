# Film #24 · AI Can Now Hear What Animals Feel

Engine copied from films/19-biocomputer (engine, render, finish, editorial kit, calm/smooth/seam tools). Film 19's docs and its c01 are kept as reference in `docs/ref-19/`. No audio takes or mp3 in the repo.

Script: `/mnt/project-files/scenario/film-tiersprache/vo-v5.txt` (fact-checked; vo-v4 was the draft). Picture notes per paragraph: `text-v4.md`.

Data root: `/mnt/project-files/scenario/film-tiersprache/` (`$F24ROOT`). This is a network mount, so put only small files there and keep renders in a scratchpad.

## Picture (lead, 2026-11-09)
**World.** THE NIGHT MAP: a flat world map at night. Every listening place is a pin with a round medallion (gold = Earth Species Project, cream = other teams). Station changes zoom out onto the map, fly, and zoom in; the medallion opens like an iris onto the habitat (2.5D cards, one warm light, living animals) or onto the explainer field (the gold listener = the A.I., call waves, index cards, the stone tablet with seven slots round an empty MEANING, the [translating…] bar, the 2030 call strip). The hook's barn is the medallion of the Europe pig pin. Details: `docs/MOTION.md`.

**Docs:**
- `docs/MOTION.md`: intent, world, "Nicht wiederholen", motion DNA, palette, calm rules, carriers, kit, gates.
- `docs/shots.md`: the binding shot list (130 shots, one motif per sentence). Generate it with `python3 tools/shots24.py`; explainer share 69.7 %, 6 hard world changes (0.57/min).
- `docs/BRIEF-builders.md`: the builder split (B1 c02–c04, B2 c05–c08, B3 c09–c11 + end screen), seam plates, rules and checks.

**Timing.** `film.mjs` reads the first of these that exists:
1. `$TIMING`
2. `<ROOT>audio/timing.json`, the real VO from the audio agent
3. `data/provisional_timing.json`, built by `python3 tools/provisional_timing.py` from vo-v5 (or vo-v4): hook sounds P1/P2 and clip slots C1–C5 as silent slots

The real timing (635.48 s, VO end 625.86 s) exists since 2026-11-09.

Chunks and scenes anchor on global phrases: `T.G(phrase, nth, after)`, `T.GE`; slots via `T.clip(id)`.

**Kit.**
- `lib/f24_kit.mjs`: animals (pig, elephant, sperm whale, humpback, dolphin, dog, crow, finch, frog, icons), call waves, index cards, listener, [translating…] bar, tablet, 2030 strip, the night map (`map`, `flight`, `pins`, `iris`), the barn (`barnCast`, `barnMedallion`), clip plates. The header lists all signatures.
- `lib/f24_land.mjs`: simplified coastlines (lon/lat polygons).
- `lib/f24_seams.mjs`: the three plates (plateCalifornia, plateNorth, plateBarn).
- `lib/f10_editorial.mjs`: palette, finish, 2.5D cards (`cam3`, `card`, `aim`, `camAt`, `camDrift`, `withOuter`), the figure `du`.
- Stills: `node tools/kit_sheet24.mjs <dir>`.

**Render.**
```
SECS=c01 node render.mjs --snap 3,20,34 --dir <dir> --scale .5
SECS=c01 node --expose-gc render.mjs --out <dir>/c01_a.mp4 --from 0 --to 16
python3 tools/calm.py <c01.mp4> --scale 1280:720 ; python3 tools/smooth.py <c01.mp4> ; SECS=c01,c02 node tools/seam.mjs --at 48.12
```

**c01 (hook, reference):** `scenes/sc01.mjs`, one plan sequence: barn → you → cards → P1/P2 waves → answer → you ✓ / A.I. 9/10 → [translating…] → the barn shrinks into its pin, the night map opens → ESP pin, every species, label, 2030 strip → push onto California (plateCalifornia). Style test: `bild/c01-stiltest.mp4` (720p) and `bild/c01_kontakt.jpg` in the data root.
