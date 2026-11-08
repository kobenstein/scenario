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

## Fassung 1 · vo-v4 (2026-11-08)
**Text.** `vo-v4.txt` (data root) = vo-v3 + three changes. C3 is introduced as "Here's Thomas Hartung, who leads that work, on what that means." The mid channel call sits between "Still... from Pong to Doom in four years." and "So why put these boxes in a server rack?", so the question stays next to its answer. The end call comes after "...is up to us." and plays over the start of the end screen.

**Audio.** Six takes are new (Eleven v4, voice akQnlreIUIoJxrTrosJj, stability .3, similarity .75, seed 4301): `s20`, `cta1` and `cta2`, plus `s05`, `s19` and `s24`. Those three were re-made because `[softly]` is no longer allowed (Jakob 8.11.: no whispering). They now use `[calm, conversational]` or `[thoughtful]`. Their word times come from the TTS timestamps (`tools/f19_align.py audio <dl> s20 cta1 cta2`). The take s11 is now played as two pieces, `s11` and `s11b`, with cta1 between them. `build_vo.py` cuts it at the quietest 10 ms between "years." and "So". Music cues M1–M4 move with the text, and M4 gets 4 s longer (repeat 40–44 s), so it ends with the film. The film is 594.6 s. The last word ends at 582.1 s and the end screen runs from "up to us" (574.6 s) to the end.

**Picture.** c05 has a new beat, 5.05: during the channel call the words sink, the gold net breathes in the screen, and a slow dolly back starts. Then the pan to the rack and the box flight run as before. `CLIP_RECT` is now near full frame (1680×945 at 120/112). The c05 Doom screen keeps the old rect (`SCREEN_RECT`). Clip footage loads from `$F19CLIPS/<id>/f00001.jpg…` via `film.prepare`. Clip metadata (offset, dur, fit, year…) is in `audio/clips.json`.

**One command for everything.** Use `tools/f19_clips.py`:
- `python3 tools/f19_clips.py render --name fassung-1`: renders the whole film in 20-s pieces (4 parallel), then the mix, subtitles, the 1080p master and a 720p preview to the data root.
- `python3 tools/f19_clips.py monday <dir with C1.mp4 C2.mp4 C2.wav C3.mp4 C3.wav> --name fassung-2`: the Monday command. It turns the footage into frames and audio, aligns the quote subtitles, then remixes. It re-renders only the pieces that touch a clip, then builds the master, the preview and runs the clip check.
- `python3 tools/f19_clips.py check`: runs the clip check on its own.
