# Film 29 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-19

The picture lead built **c01** as the quality reference: the hook, 0 → `T.G('The mice belong')` ≈ 0:59.2. The lead also holds the kit, the shot list and the seams. Three builders build the rest **at the same time**, about 3–3.3 minutes of picture each. The film is built overnight through to the end with no interim review.

| builder | chunks | from → to (phrase) | time (provisional, vo-v3) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'The mice belong' → 'Then it turned to the dodo' | 0:59.2 – 4:01.9 (183 s) | the hut: COLOSSAL · DALLAS · not a frozen mammoth (NOT THIS) · the Asian elephant, DNA for the cold · the comb flags differences (AS REPORTED) · ★ FUR · FAT · EARS light on the elephant · THE LIST · frozen ground, ~100 genomes · reading ≠ knowing · tally 1,400,000 → 1,600 → 150+ → 7 · the critics' caution · 7 → 150+ · **C1 card** (Lamm) · NO MAGIC, a short list, somebody tests it · the hidden step → THE DODO · ~100 vs 1 genome · ★ 70+ living birds teach the beaks → **plateDodo** |
| **B2** | c07 c08 c09 c10 c11 | 'Then it turned to the dodo' → 'Now take an American animal' | 4:01.9 – 7:18.0 (196 s) | 1 → 2,300 candidates, MIGHT., candidates not proof · it learns from the living · **subscribe 1** (M.01) · the glass egg, the chicks · IS IT A MAMMOTH? · the three white wolves, names, 20 edits, a 13,000-year tooth · **Q1 card** (IUCN, picture only) · **Q2 card** (Shapiro, spoken) · traits come back, the species does not · ★ the cold elephant behind the fence · 2028 → early 2030s → no hard date · **Q3 card** (Lamm, picture only) · no embryo, ~22 months · the bigger prize · the last mammoths, Wrangel, ~4,000 years · the ice keeps broken DNA → **plateIce** |
| **B3** | c12 c13 c14 c15 c16 | 'Now take an American animal' → end | 7:18.0 – 10:34.4 (196 s, incl. walk + 15 s end screen) | the ice frosts into the freezer: Willa (1980s) · ★ clones, kits, grandkits · NO LIST. NO GUESSWORK. · the biobank: ~2,300 listed species, genomes online, free · a freezer is not a forest · the machine learns from the living · the elephant mother, the virus, the vaccine, two calves (a first sign) · ~50,000 threatened · the evidence: traits in an elephant · the poster vs the freezer · **the fence once more** (like frame 0) · the gate, 1 VOTE, WHO DECIDES? · the child grown · THE POSTER · THE ARK · **subscribe 2** · quiet walk · **end screen 15 s** |

**Timing:**
- `film.mjs` loads `<ROOT>audio/timing.json` as soon as the sound agent writes it (ROOT = `/mnt/project-files/scenario/film-mammut/`, `$F29ROOT`). Until then `data/provisional_timing.json` (from the newest `vo-vN.txt`, now vo-v3) is used with a warning. **The times above will move; your code must not care.** vo-v3 (fact check) is in: ~150 genes (never 150+), Q2 Shapiro = the full grey-wolves quote (New Scientist, May 2025), Q3 Lamm = only “Not 2036, but not 2030 either.”, the woolly-mouse critique = Tori Herridge, Science Media Centre, 4.3.2025, Red List “about fifty thousand”. If a vo-v4 lands, rerun `python3 tools/provisional_timing.py` and `python3 tools/shots29.py`.
- **Anchor only on phrases:** `T.G(phrase, nth, after)` / `T.GE(…)`, and `T.clip('C1' | 'Q1' | 'Q2' | 'Q3')` for the slots (C1 = a ~10 s gap for the clip audio; Q1, Q3 = picture-only cards with silent air to read; Q2 = spoken by the narrator). Never seconds.
- Repeated phrases: "Artificial intelligence" (hook, c02, c15), "the dodo" (many), "That is what" vs "That is how"; search after a fence: `T.G(p, 0, after)`.
- The sound agent works in `<ROOT>audio/` and `films/29-mammoth/audio/`. **Do not touch either, never stage them.**

## 0 · Mandatory before the first line of code
1. **Load the skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. (Where scenario-motion's three.js/Hyperframes tooling differs, this film's canvas pipeline wins; its rules for look, calm and causality hold.)
2. **Read the memory files** if present (scenario-animation-standard, scenario-regel-szene-erklaergrafik, scenario-stil-editorial-nacht, scenario-produktion-regeln).
3. **Read the plan:** `docs/MOTION.md` (whole) · `docs/shots.md` (your shots; **binding**: one motif per sentence, the carrier column is the handover; §5 holds the only on-screen strings) · the headers of `lib/f29_kit.mjs` and `lib/f29_seams.mjs`.
4. **Watch c01:** `<ROOT>bild/c01_kontakt.jpg`. `scenes/sc01.mjs` is the reference: an anchor table `a = {}` from phrases; world cameras written as `C(x, y, z, hz)` (`E.cam3`); ONE `S.camPath` with `S.drift` that dies before the seam (`dA`) and a state that settles onto the plate (`end`); the poster → animal → points → strands → rain carriers; the lab as a portal out of the window; text in screen space with `maskLine`; the exact plate for the last 0.5 s.
5. **Look at the kit sheet:** `node tools/kit_sheet29.mjs $SP/f29/kit` (world from the thumbnail camera, the plates, the animals, the lab, the explainers, the end screen).
6. **Facts:** every on-screen number against `<ROOT>faktenzettel.md`, `<ROOT>recherche-v2.md` and the newest vo-vN. Use `F.SOURCES` / `F.QUOTES`. If anything disagrees, the fact sheet / vo-v3 wins; note it in your report.

## 1 · The seams between the groups (fixed, `lib/f29_seams.mjs`)
A plate is the exact picture at a group boundary T0. The handing side steers its camera onto the plate's camera and draws `S.plateX(ctx, t, T)` for `[T0 − .5, T0)`; the receiving side draws the same plate for `[T0, T0 + .5)` and grows out of it. Plates creep (`S.creep`: 3 %/s push, `S.TRUCK` 24 px/s) with **no drift**: let your drift die before, and as the receiver continue the creep (`S.creepCam(S.FENCE_C0, k, S.FENCE_ZF)` for the fence; `S.ICE_P` with mag × k for the ice; for the dodo scale about `S.DODO_PLATE` like `S.plateDodo` does).
- **Lead → B1** at `'The mice belong'`: `S.plateFence` (`S.FENCE_C0`, `S.FENCE_ST`). B1 1.01 glides left over the snow to the hut.
- **B1 → B2** at `'Then it turned to the dodo'`: `S.plateDodo` (screen space on `S.stage`; `S.DODO_PLATE`). B1 1.25 settles onto it from the skull / beak learning; B2 2.01 runs the comb along the dodo's strand.
- **B2 → B3** at `'Now take an American animal'`: `S.plateIce` (`S.ICE_P`, `S.ICE`, `S.ICE_ST`). B2 2.22 settles onto the block; B3 3.01 frosts it into the freezer door.

Check with `SECS=c06,c07 node tools/seam.mjs --at <T0>` (same for the others). Inner chunk boundaries within a group are one continuous take (same camera path, no plate).

## 2 · Hard rules for the picture
- **One world, one take.** Everything happens on or from THE FENCE (`S.fenceWorld`). The lab (`S.lab`), the cutaways under the snow, the night stage of the dodo (`S.stage`) open out of a thing (the hut window, the snow, a strand) and close back into it. No W shots, no cuts, no blends, no fades between worlds; one entry per chunk.
- **The one animal:** `F.beast` with parameters; the elephant changes by its traits (fur, fat, ears), the mammoth is the same body at `F.MAMMOTH`. Gold = a trait lit / the dream; never swap drawings.
- **The machine is the cyan comb** (on the snow: `st.comb`; on strands: `F.scanBar`; its product: `F.list`). It reads, ranks and writes; it never touches an animal.
- **The tally** (`F.tally`, top left) counts what is left: 1,600 (c03) → ~150 → 7 (c04) → dodo 1 → 70+ (c06) → 2,300 (c07) → ~2,300 species (c13) → ~50,000 (c14) → 1 vote (c16). It rolls (log scale) on its word and sinks when the next idea takes over.
- **Quote cards** (`F.quoteCard(ctx, t, T, { id })`) for C1, Q1, Q2, Q3: the words light up (evenly for C1 / picture-only cards, with the voice for Q2), the credit sits below. **No footage, no photo, no likeness of any real person, never "ORIGINAL FOOTAGE"** (unless a real clip file appears in `<ROOT>clips/` for C1).
- **Caveats on screen** are the film's honesty: PER COLOSSAL, AS REPORTED, NOT PEER-REVIEWED, CANDIDATES, NOT PROOF, A FIRST SIGN, NOT PROOF. One calm line each (`F.source`, `F.bracket`), never red.
- **Explainers** are made of the world's things (glints, strands, the comb, the list, the tally, skulls, the ice, frost doors). ≤ 6 words, at most one number, readable at 390 px, ≥ 1.2 s on screen, **above y 880** (burned-in subtitles).
- **Colour code** (MOTION.md §5): gold = the dream / what matters; cyan = the machine; amber-cream = people's light; frost = ice and the freezer; yellow coat = only you; **no red**.
- **Nicht wiederholen** (MOTION.md §3). In particular: no helix, no orb, no robot, no brain, no clock, no calendar sheets, no proof tape, no door with a gold gap, no world map with pins, no timeline wall.
- **Subscribe** (no buttons, no bells, at most one small line): 1 (B2, M.01) the fence wide and calm, the list small at the hut; 2 (B3, A.01) the final picture runs on. **No QR anywhere.**
- **End screen 15 s** (B3): `S.END_CAM`, `S.END_TILES` (tiles x 100–820 / 1100–1820, y 130–535; subscribe circle 960, 640, r 90). No text; the picture breathes.
- **Calm:** at most 1–2 moving elements; the camera follows the carrier; `S.drift` always on (dies only into plates); nothing appears from nowhere. Snow and glints are texture: do not speed them up.

## 3 · What you may touch and what not
- **Only your files:** B1 `scenes/sc02.mjs` … `sc06.mjs` · B2 `scenes/sc07.mjs` … `sc11.mjs` · B3 `scenes/sc12.mjs` … `sc16.mjs`, plus your own modules `lib/f29_b1_*.mjs` / `lib/f29_b2_*.mjs` / `lib/f29_b3_*.mjs` (shared camera and state across your chunks, extra drawings such as skulls, eggs, freezer doors).
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f29_kit.mjs`, `lib/f29_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `audio/`, `scenes/sc01.mjs`, the other builders' files. Kit gaps: solve them in your module, report as kit wishes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT29 }]`. Draw the whole chunk `[R.a, R.b)`. Boundaries inside your group must match frame for frame.
- **No commit, no push**, no `git add -A`, `git checkout`, `git stash`, `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the headers)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f29_kit.mjs';  import * as S from '../lib/f29_seams.mjs';
const C = (x, y, z, hz) => E.cam3({ x, y, z, f: F.F0, hz });   // camera height above the snow = S.EYE − y; hz = the horizon on screen
S.camPath(t, [[t, cam], …]) · S.drift(c, t, dist, amt, seed) · S.proj(c, X, Y, Z) → [sx, sy, s] · S.look(X, Y, Z, mag, sx, sy, hz) · S.at(ctx, c, X, Z, fn, Y)
S.fenceWorld(ctx, c, t, { sky, poster { a, lift }, glow, glint { a, lit, comb, kept, drop, keepNear, pos(k, g, sx, sy, s) }, comb { x, a }, hut { a, win, mast },
             elephant { x, z, h, walk, ...beast }, beast { x, z, h, ...beast }, wolf / ferret / bird { a, lit, walk, ... }, fence, you { hold, look, o }, child { look, o },
             snow, rim, back(ctx), extra(ctx, out) }) → { you, child, win, beast }
S.WORLD (fence, you, child, hut, mammoth, poster, elephant, wolf, ferret, bird) · S.POSTS · S.GLINTS · S.fenceZ(x) · S.winRect(c) · S.beastAt(c, o)
S.lab(ctx, t, w, h, { lamp, mouse { x, walk, fur }, screen { comb, diff }, extra }) · S.stage(ctx, t) · S.iceBlock(ctx, t, x, y, s, { shards, frost })
S.plateFence / plateDodo / plateIce (ctx, t, T) · S.FENCE_C0 · S.FENCE_ZF · S.creepCam · S.DODO_PLATE · S.ICE_P · S.ICE · S.creep · S.SEAM_HALF · S.THUMB_CAM · S.END_CAM · S.END_TILES
F.beast(ctx, t, x, y, h, { ...F.ELEPHANT | F.MAMMOTH | F.COLD, dir, fur, ears, dome, tusk, lift, flick, walk, trunk, light, shade, rim, glowTrait { fur, fat, ears }, breath })
F.beastPoints(n, seed, o) · F.mouse · F.wolf (pale) · F.ferret · F.bird · F.dodo (light) · E.du (you) · F.child · F.reachArm
F.strand(ctx, t, x, y, w, { n, h, u, diff(k), dim(k), col, label }) · F.tally(ctx, t, { v, from, u, label, plus, rise }) · F.list(ctx, t, x, y, w, { rows, title }) · F.scanBar
F.quoteCard(ctx, t, T, { id }) · F.QUOTES · F.source(ctx, t, t0, t1, F.SOURCES.x) · F.thesis · F.scenario · F.tag · F.label · F.bracket · F.checkMark · F.crossMark · F.dotField · F.slabBars
F.portal(ctx, fromRect, toRect, m, inside(ctx, w, h, m), { rim, r }) · F.veil · F.screenFloat · F.paper · F.maskLine · F.rise · F.bump · F.PRINT29 · F.GOLD / MACH / LAMP / FUR / HIDE / FROST / SNOW
```

## 5 · Rendering (shared cores)
`SP` = your scratchpad. Work in `$SP/f29/bN/`.
- **Stills:** `cd /home/user/scenario/films/29-mammoth && SECS=c03 node render.mjs --snap 100,104,108 --dir $SP/f29/b1/snap --scale .4`
- **Video:** pieces ≤ 20 s, always `--expose-gc`, at most one render per builder at a time (~150 ms/frame at `--scale .5` for c01): `SECS=c03 node --expose-gc render.mjs --out $SP/f29/b1/c03_a.mp4 --from 95 --to 115 --scale .5`. Join with `ffmpeg -f concat -c copy`.
- **Delivery per chunk:** the video at `$SP/f29/bN/cNN.mp4`; a contact sheet (1 frame per 1–1.5 s, small jpg ≤ 1 MB) at `/mnt/project-files/scenario/film-mammut/bild/cNN_kontakt.jpg`.
- Final 1080p chunks: `python3 tools/f29_film.py render` on the real timing, then `assemble` (no QR). **No video or audio in the repo.** Only small jpgs on the network drive.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, ≥ 3 review rounds: poster quality · sentence = picture · gold brightest only where it matters · figures and animals alive · text readable, ≥ 1.2 s, above y 880.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: no cuts; luma 40–60; static share target < 10 %; report the mafd median (c01's is the reference value).
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`: 0 LURCH; a POP only at a seam frame you can name.
4. **seam.mjs** at your group seams and every inner boundary: no flags.
5. **Calm rules** (MOTION.md §6) checked.
6. **Self-grade 1–5:** poster · sentence = picture · seamless · calm · alive · explainers made of the world's things · text · facts = fact sheet. Nothing under 4.

## 7 · Report (short, English)
Chunks finished with paths to videos and contact sheets · numbers per chunk (calm, smooth, seam) · kit wishes · deviations from shots.md with the reason · fact-check notes · the exact list of files you created or changed.
