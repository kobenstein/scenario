# Film #19 · The Singularity Was Predicted for This Friday

Engine copied from films/18-capitalism (branch claude/project-thread-2t1pxf, 8cf2bf6). Film 18 docs + c01 kept as reference in `docs/ref-18/` (Film 13/16 refs in `docs/ref-13`, `docs/ref-16`).
Release: Do 12.11.2026 16:00Z (17:00 Wien).

- **Data root:** `$F19ROOT` or `/mnt/project-files/scenario/film-singularity-friday/` (network mount: only small files; renders go to the scratchpad).
- **Script:** `vo-v5.txt` (after the fact check). Clips: `clips-v1.md`. Facts: `faktenzettel.md`, `faktencheck.md`.
- **Timing:** `<ROOT>audio/timing.json` (real VO, 8:03.1; fixed clip gaps + end screen 7:48.1 in `audio/clips-slots.json`), else `data/provisional_timing.json`
  (`python3 tools/provisional_timing.py [vo.txt] [out.json] [--c4]`, ~150 wpm, clip slots C1–C3).
- **Look:** the channel's Editorial Night (`/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`); this film's motif is THE SHEET
  (the 1960 Science page as a light map in the night). Rules: `docs/MOTION.md`.
- **Plan:** `docs/shots.md` (generated: `python3 tools/shots19.py --md docs/shots.md`). Builders: `docs/BRIEF-builders.md`.
- **Kit:** `lib/f19_kit.mjs`, seam plates `lib/f19_seams.mjs` (stills: `node tools/seam_plates19.mjs <dir>`). Scenes `scenes/sc01.mjs` … `sc11.mjs`
  (sc01 = lead's reference, the rest stubs until the builders deliver).

```
SECS=c01 node render.mjs --snap 1,5.5,12 --dir $SP/snap --scale .4                  # review stills
SECS=c01 node --expose-gc render.mjs --out $SP/c01_a.mp4 --from 0 --to 15          # video, pieces ≤ 20 s
python3 tools/calm.py $SP/c01.mp4 --scale 1280:720 ; python3 tools/smooth.py $SP/c01.mp4 0
SECS=c01,c02 node tools/seam.mjs --at 45.14                                          # chunk seams
```
