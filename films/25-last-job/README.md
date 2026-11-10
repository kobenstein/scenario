# Film #25 · The Last Human Job

The engine is copied from films/24-animals: engine, render, finish, editorial kit, and the calm/smooth/seam tools. Film 24's motion bible and brief are kept as reference in `docs/ref-24/`, Film 19's in `docs/ref-19/`. No videos and no mp3 go into the repo.

- **Script:** `/mnt/project-files/scenario/film-last-human-job/vo-v4.txt`, fact-checked 10.11.
- **Card and source wording:** `zitatkarten.md`.
- **Picture notes:** `text-v3.md`. The wording there is older; vo-v4 counts.
- **Data root:** `/mnt/project-files/scenario/film-last-human-job/` (`$F25ROOT`). It is a network mount and almost full, so only small files go there. Renders stay in a scratchpad.

## Picture (lead, 2026-11-10)
**World.** The guiding image is thumbnail A: a row of task dominoes on a night plain, with a stone of light that stays and a small figure beside it. Everything happens on one night plain, in three places:
- **The row** of task stones. It is used only at the anchors: the hook, the tasks turn, No. 1, act 4 and the ending.
- **The rank row** with ten numbered stones, plus the rank rail. This is the countdown from No. 10 to No. 1, and there is no clock.
- **Jakob's studio.** A timeline wall with nine lanes. Agent beads take the lanes one by one, and each time Jakob climbs a ledge, until he conducts at the top.

Scenes open as lit windows in stones or lamps. The only hard world changes are light doors (10 in the film). Explainers are made of film things: slabs, mini stones, light lines, serif numbers. Details: `docs/MOTION.md`.

**Docs:**
- `docs/MOTION.md`: intent, world, Nicht wiederholen, motion DNA, palette, calm rules, carriers, kit, gates.
- `docs/shots.md`: the binding shot list, 121 shots, one motif per sentence. Generate it with `python3 tools/shots25.py`. Explainer share is 62.7 % (weighted), with 10 hard world changes (0.89/min).
- `docs/BRIEF-builders.md`: the split, the seam plates, the rules and the checks.

  | builder | chunks | time |
  |---|---|---|
  | B1 | c02–c04 | 1:18–4:20 |
  | B2 | c05–c07 | 4:20–7:34 |
  | B3 | c08–c11 + end screen | 7:34–11:17 |

**Timing.** `film.mjs` reads the first of these that exists:
1. `$TIMING`
2. `<ROOT>audio/timing.json`, the real VO from the audio agent
3. `data/provisional_timing.json`, built by `python3 tools/provisional_timing.py` from vo-v4 (or vo-v3)

The provisional file uses the real O-ton slots (J1 10.93 s … J6 5.85 s), clip slots K1 13.2, K2 9.7 and K3 12 s, and the speaking pace of Film 24 (2.5 words/s). It runs to 677.3 s: VO end 661.8 s plus a 15 s end screen.

Chunks and scenes anchor on global phrases: `T.G(phrase, nth, after)` and `T.GE`. Slots are read with `T.clip(id)`. Chunk c11 starts at the second "Every time the machine took a step" (`nth: 1` in `CHUNKS`).

**Kit.**
- `lib/f25_kit.mjs` (the header lists all signatures):
  - stones, rows and cascade, task glyphs;
  - agent beads and `coolPath`;
  - Jakob and the studio (`studio`, `STUDIO_CAM`, `jakobPos`), `lowerThird`;
  - rank rail and `RANKS`;
  - explainers (`chartLines`, `slabBars`, `stoneGrid`, `dayTiles`, `bracket`, `label`, `source`);
  - checked texts (`QUOTES`, `SOURCES`, `CLIPS`), `clipPlate`, `title`;
  - `camPath` (a camera that glides through its keys).
- `lib/f25_seams.mjs`: the shared row world (`rowWorld`, `ROW1`, `ROW2`, `rankRow`) and the three plates (`plateJakobRow`, `plateStudio`, `plateRankRow`).
- `lib/f10_editorial.mjs`: palette, finish, 2.5D cards, the figure `du`.
- Stills: `node tools/kit_sheet25.mjs <dir>`.

**Render.**
```
SECS=c01 node render.mjs --snap 3,20,34 --dir <dir> --scale .4
SECS=c01 node --expose-gc render.mjs --out <dir>/c01_a.mp4 --from 0 --to 20 --scale .5      # --scale: review video size
python3 tools/calm.py <c01.mp4> --scale 1280:720 ; python3 tools/smooth.py <c01.mp4> 0 ; SECS=c01,c02 node tools/seam.mjs --at 78.29
```

**c01 (hook, reference): `scenes/sc01.mjs`.** One entry and two worlds, joined by two light doors. The sequence:
1. The row, with THE LAST HUMAN JOB as the first frame.
2. The glyphs email, report and translation light up, and a cool bead drains them.
3. ONE JOB, then the cascade.
4. Up into the sky: FACTORY → DESK, then the Stanford lines (19 % BEHIND, AGES 22–25).
5. The cool line comes down onto Jakob's row.
6. Into TOPIC's light → the studio: the 15-year ruler, the lanes filled by hand, the last 4 years, J1 with the lower third.
7. Into the lamp → his row falls, and beads lift off.
8. Jakob beside TOPIC (`plateJakobRow`).

The contact sheet is `bild/c01_kontakt.jpg` in the data root.

**audio/** holds Film 24's audio pipeline (build_vo, mix, subs). The audio agent adapts it for Film 25 and owns it.
