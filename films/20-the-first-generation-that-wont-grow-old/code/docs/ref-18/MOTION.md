# Film 18 · "AI Will End Capitalism" · motion rules (lead brief for all builders)

As of 2026-11-05 (picture lead, v1). The Good Takeoff, English, 1920×1080, 30 fps. Script `film-kapitalismus/vo-v4.txt` (fact-checked; v3 → v4 changed single words only), timing `film-kapitalismus/audio/timing.json` (real VO, sections `s00` … `s32`, VO ends 580.92 s, duration 596.82 s incl. the ≤ 15 s end screen; fallback `data/provisional_timing.json`). Binding shot list: `shots.md` (source `tools/shots18.py`). Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (overrides everything else). Facts: `film-kapitalismus/faktenzettel.md` + `faktencheck.md` (only these numbers).

**Guiding idea:** *The economy is a game board you live on. A road of light runs round it: the circle (wage → purchase → profit). Over every thing hangs its price tag. A.I. makes the tags of thinking fall to the zero line at the horizon, where they turn into air (stars). The price does not die, it moves onto the few doors that stay scarce: ground, power, chips. At the end the camera rises and we see it is a board on a table, with two sets of rules, and we can choose the second one.*

The film is **drawn** (Canvas 2D, Node, `@napi-rs/canvas`): no AI images, no footage, no company logos (names as type only), no 3D-game look.

---

## 0 · Status
- Quality reference: `scenes/sc01.mjs` (c01, 0 → 44.49 s, hook + the engine + what you are paid for), built by the lead. The rest is built by three builders in parallel (`BRIEF-builders.md`). Missing chunks render as stubs (`lib/stub.mjs`).
- Data root: `lib/kit.mjs ROOT` = `$F18ROOT` or `/mnt/project-files/scenario/film-kapitalismus/`; `TIMING=…` overrides only the timing file. The engine warns if it falls back to provisional timing.
- **Always anchor on words**, never on seconds: `T.G('phrase', nth, after)`, `T.GE(…)`. Fence repeated words with `after` (`T.G('cheap', 0, T.G('And thinking'))`). The chunk boundaries in `film.mjs CHUNKS` are phrases, so the real VO moves everything with it.

## 1 · Motion DNA (one cell: calm + soft, editorial)
- **Tone:** calm editorial documentary, a parable on a game board. No doom: the board is beautiful, the end is first light. Accents only on the key word of a sentence; speed contrast 3–5× (short accent → 1.5–3 s living hold).
- **Easing:** entrances/landings expo-out, exits expo-in, moves quart in-out, **camera sine-S** (`camAt`, default `'s'`). No springs, ≤ 3 % overshoot. Never linear except constant mechanics (a coin rolling at speed, star drift).
- **Base unit 0.4 s.** Micro accent 0.25–0.35 s · entrance 0.4–0.7 s · object move 0.8–1.6 s · camera ≥ 1.6 s, travels 2.5–4 s.
- **Weight:** tags are light (they swing, sway on their threads, sink slowly), coins are small and quick, doors are heavy (they rise slowly, land with a short settle, dust on the sill). Nothing bounces.
- **Cause and effect** (40–120 ms): the coin passes a segment → it lights; a tag touches the zero line → it bursts into dust → the dust rises into stars.
- **No dissolves:** no cross-fade, no fade through black, no slide/wipe. Transitions are plan sequences, camera travels along the road, transformations, flights into a surface, the rise.

## 2 · ONE world: THE BOARD (camera travels instead of cuts)
One continuous night plain that is secretly Lizzie Magie's game board. Its parts (`lib/f18_kit.mjs`):
- **The zero line** = the far edge of the board = the horizon (always at screen y 540, the camera has no pitch). Prices that fall slide toward it; on touching it they evaporate upward into **stars** (air: free). The more prices died, the fuller the sky (`sky({ air })`).
- **The loop** = a road of light running round the middle of the board (`LOOP`, `loopPt(u)`): **the circle** (wage → purchase → profit). The coin runs it.
- **Places** are flat paper cards standing on the board along the loop (workshop, shop, your house, the shelf of encyclopedias, the record, the Chegg/Canva fields, the data-centre field, the sea edge with turbines).
- **Price tags of light** hang over the places on threads from the dark (`tag`). Bigger tag = higher price. A cooling tag (machine light) goes pale blue and dim.
- **Doors** (`door`): what stays scarce. Three tall doors at the far corners of the loop: **the ground, the power, the chips**. Price tags that left everything else hang themselves on the doors.
- **The sky above the board is the explainer space.** Every explainer graphic grows out of a board object (a tag's thread bends into the price line, the coin splits into the two coins of the first picture, a card is drawn by a rule of light) and sinks back into the board.
- **The rise (c08):** the camera rises until the zero line becomes the board's edge: the world is a game board on a table (gold patent lines, two rule cards). From c09 on the same board is played with **rules II**: the road becomes the free layer, the ground in the middle is shared, and the light warms toward dawn (c11).

| Chunk | Builder | World (camera position) | Mode |
|---|---|---|---|
| c01 | Lead | The board at night: your tag over you, workshop and shop on the near edge, the loop (★ the circle), the cold disc rises, close on you | [3D-WORLD] (1.03 gap bracket [EXPLAINER] in the world) |
| c02 | B1 | The sky over the board: the falling price line ($20 → 7¢), ÷ 13; the crash story on the loop; Gawdat card; the first picture (two coins) | [EXPLAINER] (2.03 [3D-WORLD]) |
| c03 | B1 | The board: prices become air (★), the coin slows; travel along the road: the shelf (Britannica / Wikipedia), the record (music) → the first door | [3D-WORLD] with [EXPLAINER] in the sky (3.07–3.09) |
| c04 | B1 | The board: a wave of sinking tags round the loop (words, advice, ★ drug/bridge/lesson); Chegg and Canva fields with their lines; the tags leave → the empty hook | [3D-WORLD] + [EXPLAINER] (4.05–4.06) |
| c05 | B2 | The column of value under the empty hook ($17,000); the light runs down the road; ★ the three doors at the far corners; Altman card → the bill | [3D-WORLD] + [EXPLAINER] (5.02, 5.08–5.09) |
| c06 | B2 | The chip door (Nvidia counter, ¾ coin) → the data-centre field (Loudoun, $ per acre) → your house → ★ section: the dirt glows (80 %) | [EXPLAINER] → [3D-WORLD] → [EXPLAINER] section |
| c07 | B2 | The first picture again → ★ wide: the board nearly without tags, three tall doors; you pay at each door; the ground under the data centre | [3D-WORLD] (7.01 [EXPLAINER]) |
| c08 | B2 | ★ The rise: a board on a table → the patent drawing (Magie 1904, Henry George) → the two rule cards | [EXPLAINER] (the board as object) |
| c09 | B3 | Rule card II lies down on the board; the road lights for everybody (★ the free layer, GPS satellites); land first: section land vs building (Baden-Württemberg) | [3D-WORLD] + [EXPLAINER] section |
| c10 | B3 | Vienna block (⅔ warm windows, €188/m²) → along the road to the sea edge: the turbine arc, ★ the shared door → back to the Loudoun field: the zoning room, your raised hand | [3D-WORLD] + [EXPLAINER] (10.02, 10.05, 10.09) |
| c11 | B3 | The board at first light; ★ you draw a new road (design); your move: one step onto the next field → end screen | [3D-WORLD] |

Hard world changes (camera leaves the plain): only the two section cuts (6.05 → 6.06, 9.07), the patent drawing (8.02) and the zoning room (10.08): ≈ 0.4/min, see `shots.md` §3.

## 3 · Recurring objects (the graphic language)
| Object | Meaning | Kit |
|---|---|---|
| Price tag of light on a thread | a price; bigger = dearer; cool & dim = machine-made; sinking = getting cheap | `tag`, `tagPath` |
| Dust rising from a tag → stars | a price becoming air (free) | `evap`, `sky({ air })` |
| The loop road | the circle wage → purchase → profit | `board({ road, lit })`, `loopPt`, `loopU` |
| The coin | the money running the circle | `coin` |
| The zero line (horizon) | price zero | `board({ zero })` |
| The door | what stays scarce (ground, power, chips) | `door` |
| Two coins side by side | THE FIRST PICTURE: profit per sales dollar 17.0 % (highest since 2009) vs workers' share 52.8 % (lowest since 1947). Two coins, never one pie | `firstPicture`, `FIRST` |
| Rule cards I / II | the two rule sets of Magie's game | `ruleCard` |
| The cold disc | the machine (never a robot) | `coolDisc`, `coolLight` |
| Houses, paper cards | places on the board | `house`, `stand` |
| You (yellow raincoat), the others (indigo) | the viewer; everyday work: email, contract, mistake, customer | `E.du`, `E.person` |

## 4 · Palette (exactly from the style, `P` in `lib/f10_editorial.mjs`, plus `COOL`)
| Role | Hex |
|---|---|
| Night, deepest ground | `#080b27` `#0a1334` `#0e112c` |
| Indigo, board surfaces | `#0a184a` `#0c1f5c` `#151f4b` |
| Blue, light on forms | `#193f8c` `#33497a` `#394773` |
| Gold, light core (tags, road, coin) | `#fefde2` `#fef4bf` |
| Gold, halo | `#ead295` `#dec688` `#e7d19a` |
| Gold, shadow | `#9e7d54` `#a28f7b` |
| Machine cool (`COOL`) | `#eef3ff` `#b4c8ee` `#6a8cd2` `#2b4a96` |
| Raincoat (you) | `#f2b632` |
| Text | cream `#fefcde`, labels `P.halo2` |

Gold = light and human value (tags, road, coin, doors). Cool blue-white = the machine and what it made cheap. Yellow only for you. Dawn (c11) may warm the whole palette (`board({ warm })`, `sky({ warm })`). Grain subtle: `K.PRINT18 = { grain 14, floor 4, vig .5 }`. Mean luma 40–60.

## 5 · Calm rules (measurable)
- **World changes:** ≤ ~1 hard world change per minute (this film ≈ 0.5/min). Everything else is plan sequence, travel along the road, transformation.
- **Motion budget:** at most 1–2 moving main elements at once, the camera counts. Ambient life (sway, dust, stars, `camDrift`, film `cameraFloat`) does not count.
- **Camera keys sit on words** (`camAt` keys built from `T.G`). The camera has **no pitch**: the horizon is always at y 540. For views onto the board go high and use a short focal length (`f 850` gives ≈ 32° down at the frame bottom); the sky half is the explainer space, fill it with the tags, the cold disc, the graphics.
- **`camAt(t, K, ref)`:** pass `ref` = the depth of your subject plane (c01 passes `Z0 = 3000`). The log-z interpolation breaks if a camera z gets close to or beyond `ref` (the default `F0 = 1700`).
- **One motif per sentence. Nothing from nowhere:** a tag lowers on its thread from the dark above the frame, a door rises out of the board, a coin rolls out of a door, text rises from its baseline. Never fade in half-transparent.
- **Never a still image > 2 s; hold 1.5–3 s after each accent.** Text holds while read (≥ 1.5 s, ≥ characters/12 s; quote cards ≥ 4 s).
- **Measure:** `python3 tools/calm.py <mp4> --scale 1280:720` (cuts ≤ 0.9/min, mafd median ≤ ~0.45, luma 40–60), `python3 tools/smooth.py <mp4> <start>` (**0 LURCH/POP**), `SECS=cNN,cMM node tools/seam.mjs --at T0` at every chunk seam.

## 6 · Carriers (transition map)
| Seam | Carrier | Type |
|---|---|---|
| c01 inside | the tag over you → the pulled-back board → the loop → you → your tag | one plan sequence |
| **c01 → c02** (Lead → B1, `At the end of`) | `plateTag`: **inside your price tag**, cool, the number has run off (face fills the frame, printed border near the left/right edges) | seam plate → B1 pulls back out of the face: the tag hangs in the sky and prints `$20` |
| c02 → c03 (`But that's not the real ending`) | the two coins sink back into the loop as the one coin | transformation, tilt down |
| c03 → c04 (`Now the same thing is reaching`) | the camera travels back along the road from the first door to your field | camera travel |
| **c04 → c05** (B1 → B2, `And the value`) | `plateHook`: **the empty hook** (thread + empty eyelet ring) over a column of warm light | seam plate → B2 pulls back: the column is the value on your field |
| c05 → c06 (`Nvidia`) | the CHIPS line of the bill → the chip door | transformation |
| c06 → c07 (`Now look at the first picture`) | the glowing dirt (land value) rises as the left coin; the first picture re-forms in the same screen place as 2.05 | transformation / match |
| c07 → c08 (`That isn't a law of nature`) | the camera rises straight up from the ground under the data centre → ★ the board on the table | camera rise |
| **c08 → c09** (B2 → B3, `The second set of rules`) | `plateRules`: **rule card II, close** over the dark board | seam plate → B3: the card lies down on the board, its loop glyph becomes the free road |
| c09 → c10 (`Housing`) | the building of the land-value section becomes the Vienna block | transformation |
| c10 → c11 (`Capitalism won't end with a crash`) | travel along the road from the zoning room to the shelf field / your field at first light | camera travel |
| c11 → end screen | pull back over the board at first light, music runs on | camera travel |

Seam plates (`lib/f18_seams.mjs`) are screen-space pictures both sides draw for 0.5 s on each side of T0; the handing side steers its last move to converge onto the plate (c01 does it with a sine-S camera key on `tPlate = T0 − 0.5` and lerps tag sway/cool/emit onto the plate values). Builders never edit the plates. Preview: `node tools/seam_plates18.mjs <dir>`.

## 7 · Text and graphics
- **Real explainer graphics made of board things** (light on night, no panels, no frames, no gridded axes, no legends): the falling price line from a tag's thread, the two coins (never one pie: different measures), the counter on the chip door, the per-acre price over the data-centre field, the section through your house (land vs bricks), the patent drawing, the rule cards, the satellite arcs over the free road, the Vienna windows, the turbine arc with its shared door.
- Type: numbers and quotes **Instrument Serif** (cream, warm glow); labels and sources **Inter 600** (`P.halo2`). Number ≥ 120 px, label ≥ 34 px, source ≥ 24 px at 1080p. At most one number and ≤ 6 words plus source per graphic. Company names as type only (`CHEGG`, `CANVA`, `NVIDIA`), never logos.
- **Quote cards** (`K.quote`) word for word (`shots.md` §4), ≥ 4 s, while the voice runs on.
- Only numbers from the fact check; every number with its source (`shots.md` §4).

## 8 · Kit
- `lib/f10_editorial.mjs` (stage): `card`, `cam3`, `camAt`, `aim`, `camDrift`, `F0`, `P`, `du`, `person`, `glowText`, `halo`, `glowFill`, `stars`, `finish`, `prng`, explainer helpers (`counter`, `curve`, …).
- `lib/f16_kit.mjs` / `lib/f13_kit.mjs`: `quote`, `rule`, `stamp`, `rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts` (re-exported by `f18_kit`).
- `lib/f18_kit.mjs` (Film 18, lead): `PRINT18`, `COOL`, `BOARD`, `LOOP`, `wp`, `gp`, `stand`, `sky`, `board`, `road`, `loopPt`/`loopDir`/`loopU`/`LOOP_LEN`, `tag`/`tagPath`, `evap`, `coin`, `door`, `FIRST` + `firstPicture`, `ruleCard`, `coolDisc`/`coolLight`, `house`, `bump`. Signatures in the file header.
- `lib/f18_seams.mjs` (lead): `plateTag` (+ `TAG_PLATE`), `plateHook` (+ `HOOK_PLATE`), `plateRules` (+ `RULES_PLATE`), `SEAM_HALF`, `seamWindow`.
- **Memory:** never build a canvas/pattern cache per frame. Render with `node --expose-gc`, pieces ≤ 20 s. `Path2D` from `@napi-rs/canvas`.

## 9 · End screen (≤ 15 s after the VO end, 11.07)
The board at first light, wide and calm: the loop lit, the free road, three doors open, you tiny on the next field. **Free areas:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), centre x 810–1110, y 330–600 (subscribe). **Never static:** slow pull back, the coin rolling, dust, music runs on.

## 10 · Gates (in this order)
1. Plan first: the shot in `tools/shots18.py` (anchor word, picture, 1–2 moves, transition with carrier), regenerate `shots.md` (`python3 tools/shots18.py --md docs/shots.md`; text outside the SHOTS block stays).
2. Build, then look: stills around each move and one per sentence (`render.mjs --snap … --scale .4`, contact sheet). At least 3 review rounds.
3. Measure (§5), numbers into the report.
4. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · graphics from board things · text. Nothing under 4.
