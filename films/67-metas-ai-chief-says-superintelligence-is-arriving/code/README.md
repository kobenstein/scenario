# Film 67 · "Meta's AI Chief Says Superintelligence Is Arriving" (The Good Takeoff) · code

Editorial-night 2.5D machine of Film 59 (Node + @napi-rs/canvas). ONE world: THE NIGHT OF THE HEADLINE.
- Plan: `docs/MOTION.md` (world + rules) · `docs/shots.md` (binding shot list, from `tools/shots67.py`) · `docs/BRIEF-builders.md` (B1/B2/B3).
- Kit: `lib/f67_kit.mjs` (headline, the file, ribbon, referee, gold card, paper tower, the checklist, X post crops, portrait, cards, clips, SOURCES) · world, cameras, seam plates,
  end screen: `lib/f67_world.mjs` · chunks: `film.mjs` CHUNKS → `scenes/sc01.mjs` … `sc11.mjs` (c01 built by the lead; c02–c11 stubs). Assets: `$F67ASSETS` or `films/67-assets/`.
- ROOT (small files only, network mount): `$F67ROOT` or `/mnt/project-files/scenario/film-si-arriving/`. Renders: `/tmp/claude-0/f67/`.
- Timing: `<ROOT>audio/timing.json` (real VO) else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`). Anchors are phrases.

```
npm install
python3 tools/provisional_timing.py && node tools/anchors67.mjs && python3 tools/shots67.py
python3 tools/f67_clips.py clips                                   # clip frames -> /tmp/claude-0/f67/clips/
SECS=c01 node render.mjs --snap 0,10,20 --dir /tmp/claude-0/f67/snap --scale .5
SECS=c01 node --expose-gc render.mjs --out /tmp/claude-0/f67/c01.mp4 --from 0 --to 69.5 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f67/c01.mp4 --scale 1280:720 ; python3 tools/smooth.py /tmp/claude-0/f67/c01.mp4
SECS=c01,c02 node tools/seam.mjs --at <T0>
node tools/kit_sheet67.mjs /tmp/claude-0/f67/kit --scale .5         # kit stills
```
