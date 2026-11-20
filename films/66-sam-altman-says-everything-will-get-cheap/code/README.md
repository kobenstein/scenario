# Film 66 · "Sam Altman Says Everything Will Get Cheap" (The Good Takeoff) · code

Editorial-night 2.5D machine of Film 59 (Node + @napi-rs/canvas). ONE world: THE LONG LAND, FROM PURE THOUGHT TO SOLID GROUND.
- Plan: `docs/MOTION.md` (world + rules) · `docs/shots.md` (binding shot list, from `tools/shots66.py`) · `docs/BRIEF-builders.md` (B1/B2/B3).
- Kit: `lib/f66_kit.mjs` (the tag, receipt, pay slip, dollar bar, verdict, the clock, cards, clips, SOURCES) · world, cameras, seam plates,
  end screen: `lib/f66_world.mjs` · chunks: `film.mjs` CHUNKS → `scenes/sc01.mjs` … `sc12.mjs` (c01 built by the lead; c02–c12 stubs).
- ROOT (small files only, network mount): `$F66ROOT` or `/mnt/project-files/scenario/film-geld-nach-si/`. Renders: `/tmp/claude-0/f66/`.
- Timing: `<ROOT>audio/timing.json` (real VO) else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`). Anchors are phrases.

```
npm install
python3 tools/provisional_timing.py && node tools/anchors66.mjs && python3 tools/shots66.py
python3 tools/f66_clips.py clips                                   # clip frames -> /tmp/claude-0/f66/clips/
SECS=c01 node render.mjs --snap 0,10,20 --dir /tmp/claude-0/f66/snap --scale .5
SECS=c01 node --expose-gc render.mjs --out /tmp/claude-0/f66/c01.mp4 --from 0 --to 57 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f66/c01.mp4 --scale 1280:720 ; python3 tools/smooth.py /tmp/claude-0/f66/c01.mp4
SECS=c01,c02 node tools/seam.mjs --at <T0>
node tools/kit_sheet66.mjs /tmp/claude-0/f66/kit --scale .5         # kit stills
```
