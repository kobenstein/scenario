# Film #26 · Why Elon Says Saving Money Is Pointless

The engine is copied from films/25-last-job (engine, render, finish, editorial kit, calm/smooth/seam tools, phrase timing). No videos and no mp3 go into the repo.

- **Script:** `/mnt/project-files/scenario/film-sparen/vo-v3.txt` (fact check of vo-v2: one sentence changed in c09). A later vo-vN wins.
- **Facts and sources:** `faktenzettel.md`. **Clips:** `clips.json` (C1 Musk Moonshots, C2 Diamandis, C3 Tesla 2019, C4 Acemoglu, C5 FDR).
- **Picture notes:** `text-v2.md`, `geruest-v2.md`. Thumbnails: `/mnt/project-files/scenario/thumbnails/film-sparen/` (A = the first frame of the film).
- **Data root:** `/mnt/project-files/scenario/film-sparen/` (`$F26ROOT`). Network mount, almost full: only small files go there. Renders stay in a scratchpad.

## Picture (lead, 2026-11-11)
**World.** One city at night, one camera space, two places in front of the same sky and far city:
- **The hill** (thumbnail A): the giant cracked piggy bank, coins rising and turning to gold dust, you small at its feet, across the river an unfinished bridge that the dust completes at the end. Anchor only: hook, question, line 5, ending.
- **Your street**: your window (calendar, lamp, small piggy; you, later the older you), the ON AIR window (the podcast; clip plates grow out of its monitor), the shop window (goods, price tags), the mailbox, street lamps. Later the avenue of years and the old street of 1889/1935.
- **The sky field** above the roofs carries the explainers (coins, coin stacks, price tags, checks, law pages, quote cards, the balance).
- **The test card** is the carrier: five lines (4 forecast + 1 advice), born in the hook, ✓ ½ ✗ ✗ ✗ by the end, "advice fails its own test".

Changes of place: 3 light doors / match cuts (W, 0.27/min) and 7 sky doors (rise into the shared stars, come down over the other place; identical frame at the switch by construction). Details: `docs/MOTION.md`.

**Docs:**
- `docs/MOTION.md`: intent, world, doors, Nicht wiederholen, motion DNA, palette, calm rules, carriers, kit, gates.
- `docs/shots.md`: the binding shot list, 131 shots, one motif per sentence. Generate it with `python3 tools/shots26.py`. Explainer share 67.6 % (weighted).
- `docs/BRIEF-builders.md`: the split, the seam plates, the rules and the checks.

  | builder | chunks | time (provisional) |
  |---|---|---|
  | Lead | c01 (built) | 0:00–1:12.8 |
  | B1 | c02–c04 | 1:12.8–4:11.4 |
  | B2 | c05–c07 | 4:11.4–7:01.0 |
  | B3 | c08–c11 + end screen | 7:01.0–11:00.1 |

**Timing.** `film.mjs` reads the first of these that exists: `$TIMING` · `<ROOT>audio/timing.json` (the real VO from the audio agent) · `data/provisional_timing.json` (`python3 tools/provisional_timing.py`, from the newest vo-v4/v3/v2, clip slots from `clips.json`, pace 2.49 words/s, 15 s end screen; 660.1 s). Chunks and scenes anchor on global phrases (`T.G(phrase, nth, after)`, `T.GE`); slots `T.clip(id)`. The station sentences repeat the list of the five lines, so c04/c05/c07/c08 start at `nth: 1`; c09 starts at "There is It's been".

**Kit.**
- `lib/f26_kit.mjs`: sky/city/hill, piggy, coin, fountain, gold dust, older you, houses, windows, street, lamps, mailbox, calendar, goods, price tags, balance, coin stacks, checks, quote cards, rovers, ON AIR, the test card (`testCard`, `testTimes`, `mark`), texts (`QUOTES`, `SOURCES`, `CLIPS`), `clipPlate` (+ quote-card fallback `F26_C3=card` / `F26_CARDS=…`), `title` (thumbnail face), `camPath`.
- `lib/f26_seams.mjs`: `hillWorld`, `streetWorld` (room, studio, shop), cameras, geometry, `condLine` and the plates `plateCondition`, `plateMailbox`, `platePiggy`.
- Stills of everything: `node tools/kit_sheet26.mjs <dir>`.

**Render.**
```
SECS=c01 node render.mjs --snap 3,20,34 --dir <dir> --scale .4
SECS=c01 node --expose-gc render.mjs --out <dir>/c01_a.mp4 --from 0 --to 18.5 --scale .5      # pieces ≤ 20 s
python3 tools/calm.py <c01.mp4> --scale 1280:720 ; python3 tools/smooth.py <c01.mp4> 0 ; SECS=c01,c02 node tools/seam.mjs --at 72.8
```

**c01 (hook, reference): `scenes/sc01.mjs`.** One entry, four stretches of one camera:
1. Thumbnail A with STOP SAVING MONEY; one coin leaves the stream, arcs over the river and lights a far window.
2. Into that light → out of your lamp: your hand drops the coin into your piggy; the calendar flips months, then years, to 2060; the older you holds the full piggy; its coins leave the slot as gold dust and lead the camera down to the shop, where the shelves fill and the tags roll to $0; a balance in the sky weighs YOUR SAVINGS against HIS FUTURE.
3. Your piggy rises into the stars (sky door) and falls into the giant's crack: "What would have to be true?"; three coins flip into three quote cards, which fold into the test card; line 1 runs with warehouse robots, lines 3–5 turn to dashes.
4. The card tips away; a coin rises with the camera (sky door) and lights the ON AIR sign; the monitor grows into C1; back out over the roofs to the gold condition line = `plateCondition`.

Clip footage: `<ROOT>clips/<id>/f00001.jpg …` (30 fps) or `$F26CLIPS`; until then the plate shows a placeholder (never ship it).
