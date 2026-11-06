# Film #23 · Your 2037 Has Already Started

The Good Takeoff, English, 1920×1080, 30 fps, ≈ 10:26 incl. the ≈ 15 s end screen (provisional). One Tuesday in 2037, hour by hour (06:15 → 22:30), told in ONE cut-away street at night-blue; at dinner the kitchen's light wall carries the explanations and three ORIGINAL FOOTAGE clips (K1 Schneier, K3 Berners-Lee, K4 Khan).

**Status: phase 1 (picture plan) done, nothing built.** The picture build starts only after Singularity Friday (#22) reports its builders done; then the lead builds the kit and the 20-second style test for Jakob, then c01/c02, then three builders in parallel.

## Files
| Path | What |
|---|---|
| `docs/MOTION.md` | motion rules: world concept (THE STREET IN SECTION), the day-clock, the evidence cards, the old screen for the clips, figures, palette by hour, calm rules, carriers, kit plan, end screen, gates |
| `docs/shots.md` | the binding shot list: 12 chunks, 71 shots + end screen, phrase anchors, 3D vs explainer per shot, carrier per boundary, **explainer share 63 %** (target 60–70 %), hard world changes, exact on-screen text (E1–E13, clip lower thirds), open questions |
| `docs/BRIEF-builders.md` | split Lead + B1/B2/B3, the four seam plates, rules, files, rendering, checks, report |
| `docs/EDITORIAL-KIT.md` | 2.5D stage and API for Film 23 |
| `tools/shots23.py` | source of the shot list: `python3 tools/shots23.py --md docs/shots.md` (uses the real `timing.json` when it exists) |
| `tools/provisional_timing.py` | provisional `data/provisional_timing.json` from `vo-v5.txt` (145 wpm, clip slots K1 8.8 s · K3 7.7 s · K4 12.5 s, 0.7/0.6 s air like `audio/build_vo.py`) |
| `docs/ref-18/` | Film 18 versions of MOTION, shots, BRIEF, EDITORIAL-KIT, `shots18.py`, `provisional_timing18.py` (format reference) |
| `docs/ref-13/`, `docs/ref-16/` | older references |
| `audio/` | the audio agent's folder (do not touch) |

`film.mjs`, `lib/kit.mjs` (ROOT), `scenes/sc01…sc11.mjs` and `lib/f18_*` are still the Film 18 engine copy (from films/18-capitalism, branch claude/project-thread-2t1pxf, 8cf2bf6). Phase-2 setup steps: `MOTION.md` §12.

## Sources (network mount, exact paths only)
- Script: `/mnt/project-files/scenario/film-erster-tag/2037/vo-v5.txt` (spoken) and `text-v5.md` (stage notes, `[ON SCREEN …]` cards); facts `faktencheck-v5.md`, `faktenzettel.md`; clips `clips/clips.json`, `clips/clips.md`.
- Timing: `/mnt/project-files/scenario/film-erster-tag/2037/audio/timing.json` (the audio agent writes it; not there yet). Until then `data/provisional_timing.json`. When the real file lands: `python3 tools/shots23.py --md docs/shots.md` and check that every phrase still resolves.
- Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`.
- Thumbnails: made in parallel (thumbs-2037); the first image (1.01) is matched to the chosen thumbnail before the style test (`shots.md` §5).
- Renders go to the scratchpad, only small contact sheets to `/mnt/project-files/scenario/film-erster-tag/2037/bild/`.

## Regenerate
```
python3 tools/provisional_timing.py            # -> data/provisional_timing.json (only while the real timing is missing)
python3 tools/shots23.py --md docs/shots.md    # shot tables + explainer share
```
