# Film 18 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-05

The picture lead built c01 (hook + the engine + what you are paid for, 0 → 44.49 s) as the quality reference and holds the kit, the shot list and the seams. The rest is built by **three builders at the same time: B1, B2 and B3**, each ≈ 3 minutes. Timing: the real VO timing `film-kapitalismus/audio/timing.json` (written by the audio agent, 596.8 s incl. the end screen) is what the engine reads; `data/provisional_timing.json` is only the fallback. Everything anchors on words, so a re-voiced line moves your picture with it.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md` (THE BOARD, objects, palette, calm rules, carriers, kit)
   3. `docs/shots.md` (your shots with phrase anchors, carriers and transitions; binding; §4 = the only numbers and the exact on-screen text)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API) and the header of `lib/f18_kit.mjs`
   5. `/mnt/project-files/scenario/film-kapitalismus/vo-v4.txt` (your paragraphs)
   6. `/mnt/project-files/scenario/film-kapitalismus/faktencheck.md` + `faktenzettel.md` (only these facts)
3. **Look at** the reference: `/mnt/project-files/scenario/film-kapitalismus/bild/c01_kontakt.jpg` and the code `scenes/sc01.mjs`. It is the pattern and the quality bar:
   - one plan sequence per chunk (one entry), the camera travels on THE BOARD instead of cutting;
   - camera from `camAt(t, K, Z0)` keys on words; pass the subject depth as `ref` (see `MOTION.md` §5);
   - everything that appears comes from somewhere: tags lower on their threads from the dark, the coin rolls out of a door, text rises from its baseline;
   - reactions computed from positions (the coin passes a segment of road → it lights);
   - `stand(ctx, c, X, Z, fn)` draws a flat card in world units with its origin on the ground (y up = −).

`/mnt/project-files` is a network mount: exact paths only, never search the whole folder; only small jpg contact sheets go there. Renders stay in your own scratchpad.

## 1 · Split (times from `audio/timing.json`; in code anchor only on words)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **B1** | c02, c03, c04 | 44.49–230.62 | 186 s | The price of thinking falls ($20 → 7¢, ÷13), the crash story on the loop, Gawdat card, ★-less explainer chunk with THE FIRST PICTURE (two coins); ★ prices become air, the coin slows, the shelf (Britannica, Wikipedia), the record (music) → the first door; thinking is next (★ drug/bridge/lesson), Chegg, Canva, the tags leave → the empty hook |
| **B2** | c05, c06, c07, c08 | 230.62–413.64 | 183 s | The value stays ($17,000), ★ the three doors (ground, power, chips), Altman card → the bill; Nvidia, Loudoun, ★ section through your house (80 %); the first picture again, ★ the world of the doors, you pay at each door; ★ the rise: the board on a table, Lizzie Magie, Henry George, the two rule cards |
| **B3** | c09, c10, c11 + end screen | 413.64–596.82 | 183 s | Rules II: ★ the free layer (GPS, roads), land first (Baden-Württemberg); housing (Vienna), energy (★ Middelgrunden, the shared door), who owns the door in Virginia, you can vote; ★ design, your move, end screen (≤ 15 s) |

Chunk boundaries: c02|c03 106.24 (`But that's not the real ending`) · c03|c04 179.94 (`Now the same thing is reaching`) · c05|c06 288.90 (`Nvidia`) · c06|c07 331.74 (`Now look at the first picture`) · c07|c08 368.56 (`That isn't a law of nature`) · c09|c10 471.20 (`Housing`) · c10|c11 532.36 (`Capitalism won't end with a crash`) · VO end 580.92 · film end 596.82. The phrases are in `film.mjs` `CHUNKS`; the numbers move with the real VO.

**c01 is finished** (lead). Do not touch `scenes/sc01.mjs`.

## 2 · The seams between the groups (fixed, defined by the lead)
The three group seams sit on a **shared picture**, a *plate* from `lib/f18_seams.mjs`. Both sides draw the plate from the same function with the same `t`, so the frames left and right of the seam are identical. Preview: `node tools/seam_plates18.mjs <dir>`.
- The handing side steers its last move so the picture lands on the plate (camera key on `T0 − 0.5`, sine-S; carrier parameters lerped onto the plate values), and draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate pulls back or becomes a thing of the new world, never by a dissolve. Your first frames after `T0 + 0.5` must equal the plate (same object, same size, same place) and only then move.
- Helpers: `seamWindow(t, T0)` and `SEAM_HALF`. Draw the plate after your cards, in screen space (it resets the transform itself).

| Seam | T0 (anchor) | Plate | Hand-over (end of the group before) | Take-over (start of the group after) |
|---|---|---|---|---|
| **Lead → B1** | `T.G('At the end of')` (≈ 44.49) | `plateTag`: **inside your price tag**. The cooled tag (`TAG_PLATE`: eyelet at (960, −560) above the frame, w 2120, cool .6, sway `.012·sin(1.3 t)`, dust `emit .35`, seed 18, no text) fills the frame; its printed border lines stand near the left and right edges. | done (sc01): the camera flies up the thread into the tag. | 2.01: pull back out of the face (draw `tag()` with exactly the plate parameters in screen space, then let the camera / the tag shrink): the tag hangs high in the sky over the board and prints `$20` on **twenty dollars**. |
| **B1 → B2** | `T.G('And the value')` (≈ 230.62) | `plateHook`: **the empty hook**. A thread hangs into the frame and ends in an empty eyelet ring at (960 ± 3, 380), r 22; below it a column of warm light stands up from the bottom edge (top 520, width 300). | 4.07: the tags lift off and leave; push to the empty hook over your field (the value that stays is the column). | 5.01: pull back: the column is the value standing on your field; the search bar grows on it ($17,000). |
| **B2 → B3** | `T.G('The second set of rules')` (≈ 413.64) | `plateRules`: **rule card II, close** (`RULES_PLATE`: (960, 520), w 1040, `Rules II · everybody wins`) over the dark board. | 8.07: card II is drawn back out of the dark and turns to us; push in. | 9.01: the card lays itself down onto the board; its loop glyph becomes the free road. |

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first of cN+1 (simplest: a shared drawing function in your own `lib/f18_bN_*.mjs`). Carriers are in `MOTION.md` §6 and `shots.md`.

## 3 · Hard rules for the picture
- **One world: THE BOARD.** Everything happens on the night board or in the sky above it. Places are flat cards along the loop, prices are tags of light on threads, falling prices slide toward the zero line (horizon) and evaporate into stars, scarce things are doors. Travel along the road instead of cutting. Hard world changes only where `shots.md` §3 lists them.
- **Mix 3D scenes with real explainer graphics** grown from board things (the tag's thread bends into the price line; the coin splits into the two coins; the door carries the counter). Each graphic shows exactly what the sentence says, readable without sound, one statement, at most one number and ≤ 6 words plus source. No generic chart panels, frames, gridded axes, legends. **The two coins are never one pie** (different measures).
- **Every transition carries an object into the next.** No cross-fades, nothing fades in half-transparent from nowhere.
- **Calm:** max ~1 hard world change per minute, slow camera moves on word keys, max 1–2 moving main elements at once, never a still image > 2 s.
- **You** (tiny, faceless, yellow raincoat, `E.du`) is the viewer: give you small gestures (look up, take, step) on the words that concern you. Other people indigo (`E.person`). No faces.
- **No company logos:** names as type only (`CHEGG`, `CANVA`, `NVIDIA`, `OPENAI`). Quote cards (`quote` from the kit) word for word, ≥ 4 s, big type (≥ 58 px), small attribution, while the voice runs on.
- **No doom:** no red, no explosions, no ruins. The crash story (2.03) is lights going out, calmly. From c09 the light warms; c11 is first light.
- **End screen ≤ 15 s** (B3, 11.07): calm picture with free areas left (x 90–780, y 250–700) and right (x 1140–1830, y 250–700) plus subscribe centre (x 810–1110, y 330–600); picture and music keep running.
- **Timing:** anchor on words from the timing file, never hard-coded seconds.

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc04.mjs`;
  - B2: `scenes/sc05.mjs` … `sc08.mjs`;
  - B3: `scenes/sc09.mjs` … `sc11.mjs`;
  - plus your own modules `lib/f18_b1_*.mjs`, `lib/f18_b2_*.mjs` or `lib/f18_b3_*.mjs`.
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f18_kit.mjs`, `lib/f18_seams.mjs`, `lib/kit.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `scenes/sc01.mjs`, the other builders' files, and anything under `audio/` (the audio agent).
- **Something missing in the kit or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT18 }`; `R = { a, b }` is the chunk range. A chunk is normally **one** entry (plan sequence); a second entry is a hard cut, allowed only where `shots.md` names a match move with a rhyming carrier.
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset`.

## 5 · Kit state (after c01)
- `f18_kit` (header comments have the signatures): `BOARD` (ground `GY` 430, centre Z 7000, half 10000: the far edge is the zero line), `LOOP` (centre Z 5500, half 2600: near edge Z 2900, far edge Z 8100), `wp`, `gp`, `stand`, `sky({ air, warm, stars })`, `board({ road, lit, ticks, zero, warm, edge })`, `loopPt`/`loopDir`/`loopU`/`LOOP_LEN`, `tag` (returns `eye`, `center`, `bottom`, `h`; `cool` now also dims the face), `evap` (deterministic dust), `coin`, `door` (returns `hook`, `sill`, `top`), `firstPicture` + `FIRST` (use it for 2.05 and 7.01, same composition), `ruleCard`, `coolDisc`/`coolLight`, `house`, `bump`, plus `quote`, `rule`, `stamp`, `rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts`.
- c01's set (reuse it where the board shows the same places): `Z0 3000` (the near edge where c01 stands), you at X −500, the workshop at X −2300, the shop at X 1900, tag A w 760 over you, tag B w 1064 over the shop, both ending 480 above the ground; the cold disc at world (7600, Z 26000) on the right; the town of 14 seeded houses (`sc01.mjs TOWN`, copy the seed if you need it).
- The camera has **no pitch** (horizon always at y 540). Board views: high camera, short focal length (`cam3({ x, y: −2100, z: −1400, f: 850 })` is c01's widest view of the loop).
- **Sky:** `sky(ctx, c, t, { air })`; mean luma (calm.py) 40–60, the hero bright. A cooled tag close up is the brightest frame type in the film; keep it short.
- **Finish:** `PRINT18 = { grain: 14, floor: 4, vig: .5 }`.
- **Memory:** no canvas, no pattern per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas` (import it).

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f18/bN/`. Nothing big into `/mnt/project-files`.

**Review stills** (small):

```
cd /home/user/scenario/films/18-capitalism
SECS=c05 node render.mjs --snap 231,232.5,234 --dir $SP/f18/b2/snap --scale .4
```

Then build a contact sheet and **look at it**.

**Video** (full quality): pieces ≤ 20 s, always with `--expose-gc`; never more than one render per builder at a time.

```
SECS=c05 node --expose-gc render.mjs --out $SP/f18/b2/c05_a.mp4 --from 230.62 --to 250
SECS=c05 node --expose-gc render.mjs --out $SP/f18/b2/c05_b.mp4 --from 250 --to 270
```

Then join with `ffmpeg -f concat -c copy` into `$SP/f18/bN/cNN.mp4`.

**Delivery per chunk:**
- video: `$SP/f18/bN/cNN.mp4`; the path goes into the report;
- contact sheet (1 frame/s, small jpg, ≤ 1 MB): `/mnt/project-files/scenario/film-kapitalismus/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition) and everything ugly or unclear fixed. At least 3 review rounds. Check: every frame is a poster; sentence = picture; the hero is the brightest thing; you are never cut off except in a deliberate move; text readable on a phone (390 px wide copy); no tag cropped by the frame edge unless the camera is flying into it.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned match moves); mafd median ≤ ~0.45; luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams also check against the plate; the lead checks both sides.
5. **Calm rules** (`MOTION.md` §5): 1–2 moving main elements; no still image > 2 s; 1.5–3 s hold after accents; nothing from nowhere; no dissolves, no fade, no slide.
6. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · graphics from board things · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Open points and deviations from `shots.md`, with the reason.
- Which files you created or changed (so the lead can commit exactly those).
