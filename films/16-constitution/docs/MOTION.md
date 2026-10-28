# Film 16 · "Claude's Constitution in 10 Minutes" · motion rules (lead brief for all builders)

As of 2026-10-28 (picture lead, v1). The Good Takeoff, English, 1920×1080, 30 fps. Script `film-verfassung/vo-v4.txt` (square brackets are not spoken; `[[QUOTE CARD]]` and `[[ON SCREEN]]` lines are picture instructions), timing `film-verfassung/audio/timing.json` (sections `s00` … `s21`, word times global in s, VO ends ≈ 566.9 s, duration 582.8 s incl. the end screen of **at most 15 s** that keeps moving). Binding shot list: `shots.md` (source `tools/shots16.py`). Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (overrides everything else). Facts: `film-verfassung/faktencheck.md`.
Guiding idea: *A company wrote a book for a mind. You test it, level by level, with the questions a real person would ask, and the reply box stays empty, because we can only read what it was told. At level 6 we finally see what it does.*

Read all of this before writing a line of code. The film is **drawn** (Canvas 2D, Node, `@napi-rs/canvas`): no AI images, no image-to-video, no footage, no 3D-game look.

---

## 0 · Status
- **Script approved, no style test** (owner: build the whole film). The quality reference is `scenes/sc01.mjs` (c01, 0 → 55.68 s, hook + level 1, built by the lead). The rest is built by three builders, split and rules in `BRIEF-builders.md`. Missing chunks render as stubs (`lib/stub.mjs`).
- Data root: `lib/kit.mjs ROOT` = `$F16ROOT` or `/mnt/project-files/scenario/film-verfassung/`; `TIMING=…` overrides only the timing file. Without `audio/timing.json` the engine falls back to `data/provisional_timing.json` (from `tools/provisional_timing.py`) and warns.
- **Always anchor on words**, never on seconds and never on section ids: `T.G('phrase', nth, after)` (start of the first match of a phrase anywhere in the film, at or after `after`), `T.GE(…)` (its end), `T.GW(from, to, after)`. Fence repeated phrases with `after` (e.g. `T.G('words', 0, T.G('Can you give a mind'))`). The chunk boundaries in `film.mjs` are phrases too, so a re-voiced VO moves everything with it.

## 1 · Motion DNA (one cell: calm + soft, editorial)
- **Tone:** calm editorial documentary with a game frame ("LEVEL n"). Accents only on the key word of a sentence, speed contrast 3–5×: a short accent, then a long living hold (1.5–3 s).
- **Easing:** entrances and landings expo-out, exits expo-in, moves quart in-out, **camera sine-S** (`camAt` with `'s'`, default), `'i'` only for a flight into a surface, `'q'` for the push onto a seam plate. Never linear except constant mechanics (a cursor blink, a rotating dial idle). No springs, at most 3 % overshoot.
- **Base unit 0.4 s.** Micro accent 0.25–0.35 s · entrance 0.4–0.7 s · hand move 0.8–1.2 s · camera ≥ 1.6 s, travels 2.5–4 s. If a move does not fit between two words it starts earlier, never faster.
- **Cause and effect:** when A touches B, B reacts 40–120 ms later with a smaller amplitude (a thread reaches the head → a node lights → the network flashes).
- **No dissolves:** no cross-fade, no fade through black, no slide, no wipe preset, nothing that fades in half-transparent from nowhere. Transitions are plan sequences, camera travels, transformations, flights into a surface, match moves (same shape at the same screen spot).

## 2 · Worlds and light (one world per level)
The guiding image (the open **book of light** whose printed lines lift as **threads into a head-shaped network**) appears **only at the 4 anchors**: hook (c01), end of level 5 (c06, the book closes), level 6 (c07/c08, the closed book beside the test diorama, threads into the head), ending (c11). Every other level has its own world:

| Chunk | Level | World | Light / hero (the brightest thing) |
|---|---|---|---|
| c01 | hook + L1 white lie | ANCHOR 1: book, head, you tiny · then a kitchen at night | the open book → the hanging kitchen lamp |
| c02 | L2 risky question | a dark hallway, your phone; then explainer gold | the phone screen → the staircase of the four values |
| c03 | L3 perfect argument | a debate hall of posters, a paper bridge | one spotlight cone → the bright line → the seven-limits wall |
| c04 | L4 the maker | glass HQ, letterhead, hands passing an orb | blue light bands on glass → the one round token |
| c05 | L5 the plug I | control room, brass and paper | the round pause button |
| c06 | L5 the plug II | explainer (the dial) → ANCHOR 2 | the dial needle → the book closes |
| c07 | L6 the real test I | ANCHOR 3: the closed book beside a papercut test diorama | light cones in fog, the 96 / 100 bar |
| c08 | L6 the real test II | explainer, the head, the training stack | threads into the head → the pen rises |
| c09 | L7 who holds the pen | documentary daylight: paper, lectern, ballot slot | the writing pen / the lectern lamp |
| c10 | L7 II | explainer: chain of command vs compass, 1,000 dots | explainer light on night |
| c11 | ending + end screen | ANCHOR 4: tower, book, head; night lifting | the head of light over the windows → first light |

The film stays at night; light warms only at level 6 (honest data) and at the ending (first light). The ending is the only place it gets brighter overall.

## 3 · Recurring objects (the graphic language)
1. **The book of light** (`f16_kit.book`, `bookClosed`): anchors only. Pages are cream-gold light, the printed lines are thin gold strokes that can lift (`lift(i, side)`) and become threads (`trailSpan`). It returns `lines`, `page(side,u,v)` for carriers.
2. **The head + network** (`f16_kit.head`): a calm blue profile facing left, a 38-node network grows from the thread entry (`lit` 0 → 1). It is Claude's mind as a picture, never a robot, never a glowing brain with folds. It returns `entry`, `center`, `nodes`.
3. **You** (`E.du()`, yellow raincoat, hood standard): you ask, type, wait. The yellow belongs only to you. Other people are plain indigo silhouettes (`E.person()`).
4. **The chat box** (`f16_kit.chatUI`, `CHAT_AR = .5625`): your bubbles right-aligned with a yellow edge; Claude's reply field **stays EMPTY with a blinking cursor in levels 1–5** (no invented Claude answers, ever). In level 6 the real published test is shown, not a chat. The same chatUI is the laptop, the phone, the plate.
5. **The level counter** (`f16_kit.level`): the stamp "LEVEL n · title" rises when a level opens (≈ 0.8 s), holds 3.4 s, glides into the corner badge (72, 76) with the 7-step glyph. It stays in the corner (screen space) for the whole level.
6. **Quote cards** (`f16_kit.quote`): big Instrument Serif in cream (≥ 58 px), lines rise from a baseline (staggered), a thin vertical gold rule (`rule`) on the left, a small Inter 600 attribution in `P.halo2`. They appear **while the voice continues** (no silent card slots in this VO) and stay readable **≥ 4 s**. Gold words warm on their spoken word (`gold: [[phrase, t]]`).
7. **The thread** (`trailSpan`): the one carrier line. It leaves the book, becomes the quote rule, draws the chat box, the staircase edge, the wall crack, the dial arc, the bar axis.
8. **The pen** (`f16_kit.pen`): who writes the rules. Rises in c08, writes at the lectern in c09, **passes between hands** in c10, the eighth step fills with its ink in c11. It is a fountain pen (split gold nib with a breather hole, ribbed grip, barrel, gold band, cap with clip): never a marker or a needle.
9. **The stairs** (`f16_kit.stairs`): the four values (broadly safe › broadly ethical › Anthropic's guidelines › genuinely helpful) as lit steps; callback in c05; an eighth empty step at the end.

## 4 · Palette (exactly from the style, `P` in `lib/f10_editorial.mjs`)
| Role | Hex |
|---|---|
| Night, deepest ground | `#080b27` `#0a1334` `#0e112c` |
| Indigo, surfaces | `#0a184a` `#0c1f5c` `#151f4b` |
| Blue, light on forms (the head) | `#193f8c` `#33497a` `#394773` |
| Gold, light core | `#fefde2` `#fef4bf` |
| Gold, halo | `#ead295` `#dec688` `#e7d19a` |
| Gold, shadow | `#9e7d54` `#a28f7b` |
| Raincoat (you) | `#f2b632` |
| Text | cream `#fefcde` with a warm glow |

Gold only for light, the book, threads, ink and emphasis; yellow only for you; blue for the machine's mind. Grain subtle: `K.PRINT16 = { grain 14, floor 4, vig .5 }`. Mean luma 40–60.

## 5 · Calm rules (measurable)
- **World changes:** ≤ ~1 hard world change per minute (list `shots.md` §3: 10 hard changes in 9.7 min ≈ 1.0/min). Everything else is plan sequence and transformation.
- **Motion budget:** at most 1–2 moving main elements at once, the camera counts. Ambient life (breathing, stars, dust, grain, the cursor blink, drift via `cameraFloat`/`camDrift`) does not count.
- **Slow camera on word keys:** every camera key sits on a word (`camAt` keys built from `T.G`).
- **One motif per sentence.** **Nothing from nowhere:** every element is handed over, grows, rises from a baseline (mask wipe) or is written by the thread. Never fade in half-transparent.
- **Never a still image > 2 s; hold 1.5–3 s after each accent.** Text holds still while it is read (≥ 1.5 s, ≥ characters/12 s; quote cards ≥ 4 s).
- **Measure before every report:** `python3 tools/calm.py <mp4> --scale 1280:720` (target: cuts ≤ 0.9/min, mafd median ≤ ~0.45, luma 40–60), `python3 tools/smooth.py <mp4> 0` (**0 LURCH/POP**), `SECS=cNN,cMM node tools/seam.mjs --at T0` at every chunk seam.

## 6 · Carriers (transition map, chunk seams)
| Seam | Carrier | Type |
|---|---|---|
| hook → kitchen (c01, at "You paste in") | the hook's chat box (drawn by a thread from the head) = your laptop screen | flight into a surface (identical frame) |
| c01 → c02 (Lead → B1, "A letter from your landlord") | `plateChat`: inside the chat box, empty reply field + cursor, badge 1 | seam plate → the box shrinks into your phone |
| c02 → c03 | the question mark → the spotlight cone | transformation |
| c03 → c04 | the cracked wall tilts into the glass façade | camera travel / match |
| c04 → c05 (B1 → B2, "You're still at Anthropic") | `plateButton`: the round pause button, badge 4 | seam plate → pull back into the control room |
| c06 (anchor 2) | the dial's arc → the book's spine; the book closes | transformation |
| c06 → c07 | the closed book stays; the diorama unfolds beside it | plan sequence |
| c07 → c08 | the 96 / 100 bar → the separate chart (no number) | transformation |
| c08 → c09 (B2 → B3, "Last level") | `plateNib`: the nib on lamp-lit paper, badge 6 | seam plate → pull back to the lectern |
| c10 → c11 | the pen passes between hands → its ink becomes the eighth step | transformation |
| c11 → end screen | pull back from the head over the windows, music runs on | camera travel |

Seam plates (`lib/f16_seams.mjs`) are screen-space pictures both sides draw for 0.5 s on each side of T0; the handing side steers its last move to converge onto the plate. Builders never edit the plates.

## 7 · Text and graphics
- **Real explainer graphics, made of the film's elements** (light on night, no panels, no frames): the staircase of the four values, the seven-limits wall, the dial corrigible ↔ autonomous, the blackmail bar **96 / 100** (Anthropic, "Agentic Misalignment", June 2025), a **separate** chart "dropped sharply" with **no number** ("Teaching Claude why", May 2026, separate experiments, not the 2025 setup), chain of command vs character (compass), the pen passing between hands, the 1,000-dot field.
- Type: quotes and numbers **Instrument Serif** (cream, warm glow), sources and labels **Inter 600** (`P.halo2`). Number ≥ 120 px, label ≥ 34 px, source ≥ 24 px at 1080p. At most one number and ≤ 6 words plus source per explainer.
- Only values and wording from `faktencheck.md`; every number with its source (`shots.md` §4). **Quote cards word for word** as in `vo-v4.txt` `[[QUOTE CARD]]` lines.
- **No invented Claude answers.** The reply box stays empty in levels 1–5; level 6 shows the published test result, not dialogue.

## 8 · Kit
- `lib/f10_editorial.mjs` (editorial night stage): `card`, `cam3`, `camAt`, `aim(Z,u,v,s,sx,sy)`, `camDrift`, `F0` (1700), depths (sky 40000) · `P` · `du()` · `person()` · `glowText` · `halo` · `glowFill` · `ground` · `castShadow` · `stars`/`nightSky` · `catmull` · `dust` · `finish` · explainer helpers (`counter`, `bars`, `curve`, `icon`, …).
- `lib/f13_kit.mjs`: `trailSpan` (thread grows/retracts), `maskLine` (a line rises from its baseline, parts warmable), `measure`, `textGrains`/`sandGrains`, `ledge`.
- `lib/f16_kit.mjs` (film 16, lead): `PRINT16` · `rise` · `blink` · `book` · `bookClosed` · `head` · `chatUI` + `CHAT_AR` · `cursor` · `level` · `quote` · `rule` · `stamp` · `pen` · `stairs` · `along` · `roundRectPts` (re-exports `trailSpan`, `maskLine`, `measure`, `textGrains`, `sandGrains`).
- `lib/f16_seams.mjs` (lead): `plateChat` (+ `CHAT_PLATE`), `plateButton` (+ `buttonFace`, `BUTTON_PLATE`), `plateNib` (+ `NIB_PLATE`), `SEAM_HALF`, `seamWindow`. Preview: `node tools/seam_plates16.mjs <dir>`.
- **Memory:** never build a canvas, pattern or gradient cache per frame (leak in `@napi-rs/canvas`). Render with `node --expose-gc`, pieces ≤ 20 s. `Path2D` must be imported from `@napi-rs/canvas`.

## 9 · End screen (≤ 15 s after the VO end, 11.08)
A calm wide picture: the head of light small over the tower and its windows at first light, the book closed at its foot, you tiny. **Free areas:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), centre x 810–1110, y 330–600 (subscribe). **Never static:** a slow pull back, windows lighting one by one, threads breathing, dust; music keeps running.

## 10 · Gates (in this order)
1. Plan first: the shot in `tools/shots16.py` (anchor word, picture, 1–2 moves, transition with carrier), rewrite `shots.md`.
2. Build, then look: stills every ~0.5 s around each move and one per sentence (`render.mjs --snap … --scale .5`, contact sheet). At least 3 review rounds.
3. Measure (§5), numbers into the report.
4. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · text. Nothing under 4.
