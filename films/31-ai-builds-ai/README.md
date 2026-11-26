# Film 31 · "Superhuman AI Is Coming Next Year" (working title; AI builds the next AI) · The Good Takeoff

Release Wed 18.11.2026 17:00 Vienna, 1080p30, ≈ 11:00 + a 15 s end screen. Flat editorial-grain style; the picture comes from code only.
ROOT = `/mnt/project-files/scenario/film-ai-2027/` (`$F31ROOT`). Script: `<ROOT>vo-final.txt`. Timing: `<ROOT>audio/timing.json` when the sound agent delivers it, else `data/provisional_timing.json`.

The code is copied from film 59 (which comes from 54/28/25/24/16/13/10): engine, render, editorial finish, calm/smooth/seam tools.
Film 59's plan, kit, world and hook are kept as references in `docs/ref-59/`; film 54's in `docs/ref-54/` (older refs: see films/59).

**No videos, mp3 or other large files go into the repo.** Renders go to `/tmp/claude-0/f31/`. Only small jpgs go to `<ROOT>bild/`.
`audio/` belongs to the sound agent (VO, timing.json, subtitles, mix): picture work never edits it (the sound agent re-cuts it for #31).

## Plan
- `docs/MOTION.md`: intent, the world (THE NIGHT FOUNDRY, the ladder of five rungs), motion rules, palette (GOLD accent), frame safety, camera, gates.
- `docs/shots.md` (`python3 tools/shots31.py`: 94 shots, explainer share ≈ 70 %) + `docs/BRIEF-builders.md` (3 builders: B1 c02–c06,
  B2 c07–c09, B3 c10–c12). `scenes/sc01.mjs` = the hook, the quality reference.

## Code
- `film.mjs`: the chunk table (12 chunks on vo-final phrases), timing loader, build. Missing chunks render as stubs. `render.mjs`: `--snap` / `--out`.
- `lib/f31_kit.mjs`: machine, builders, ladder + ladderHUD, codeShare, shareRing, swarm + eye, gauge, forecast, genChain, cards, quote card,
  tags, sources, clip plates, camPath. `lib/f31_world.mjs`: the foundry (`foundry`), cameras, END_CAM / END_TILES.
- `tools/f31_clips.py`: clip frames (`clips`), chunk render (`render`), assembly with subtitles + mix (`assemble`). No QR overlay.
- `tools/provisional_timing.py` (vo-final → data/provisional_timing.json), `tools/kit_sheet31.mjs` (→ `<ROOT>bild/kit31_kontakt.jpg`),
  `tools/shots31.py`, `tools/calm.py`, `tools/smooth.py`, `tools/seam.mjs`.
