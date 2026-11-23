# Film 49 · "You Have Five Years Before Superintelligence" (The Good Takeoff) · code

Editorial-night 2.5D machine of Film 66 (Node + @napi-rs/canvas). ONE world: THE STAIRS OF FIVE YEARS (thumbnail B is frame 0).
- Plan: `docs/MOTION.md` (world + rules) · `docs/shots.md` (binding shot list, from `tools/shots49.py`) · `docs/BRIEF-builders.md` (B1/B2/B3).
- Kit: `lib/f49_kit.mjs` (title, captions, cards, date cards, place card, bars, year rail, the countdown, clips, SOURCES) · world, cameras,
  seam plates, end screen: `lib/f49_world.mjs` · chunks: `film.mjs` CHUNKS → `scenes/sc01.mjs` … `sc12.mjs` (c01 built by the lead;
  c02–c12 world stubs, `lib/stub.mjs`).
- ROOT (small files only, network mount): `$F49ROOT` or `/mnt/project-files/scenario/film-vorbereiten/`. Renders: `/tmp/claude-0/f49/`.
- Timing: `<ROOT>audio/timing.json` (real VO, 592.3 s) else `data/provisional_timing.json`. Anchors are phrases.
- `audio/`: the sound step's scripts (VO build, alignment, clip audio, mix, music); the media itself lives in `<ROOT>audio/`.

```
npm install
node tools/anchors49.mjs && python3 tools/shots49.py
python3 tools/f49_clips.py clips                                   # <ROOT>clips/Cn.mp4 -> frames in /tmp/claude-0/f49/clips/
SECS=c01 node render.mjs --snap 0,10,20 --dir /tmp/claude-0/f49/snap --scale .5
SECS=c01 node --expose-gc render.mjs --out /tmp/claude-0/f49/c01.mp4 --from 0 --to 55 --scale .5
python3 tools/calm.py /tmp/claude-0/f49/c01.mp4 --scale 1280:720 ; python3 tools/smooth.py /tmp/claude-0/f49/c01.mp4
SECS=c01,c02 node tools/seam.mjs --at 54.97
node tools/kit_sheet49.mjs /tmp/claude-0/f49/kit --scale .5         # kit stills
```
