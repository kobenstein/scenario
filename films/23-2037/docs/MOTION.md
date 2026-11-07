# Film 23 · "Your 2037 Has Already Started" · motion rules (lead brief for all builders)

As of 2026-11-06 (picture lead, v1, **phase 1: plan only, nothing built yet**). The Good Takeoff, English, 1920×1080, 30 fps. Script `film-erster-tag/2037/vo-v5.txt` (= `text-v5.md` without the stage notes; fact-checked in `faktencheck-v5.md`), clips `film-erster-tag/2037/clips/clips.json` (K1 Schneier, K3 Berners-Lee, K4 Khan). Timing: the real VO `film-erster-tag/2037/audio/timing.json` (written by the audio agent, not there yet); until then `data/provisional_timing.json` (`tools/provisional_timing.py`, 145 wpm, clip slots 8.8 / 7.7 / 12.5 s, **625.7 s** incl. the 15 s end screen). Binding shot list: `shots.md` (source `tools/shots23.py`). Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (overrides everything else). Facts: only `faktencheck-v5.md` / `faktenzettel.md`.

**World concept (three sentences):** *The whole film is ONE cut-away street at night-blue, seen in section like a doll's house: your building with the kitchen, the clinic at the end of the street, Dad's building two streets over, and on the skyline the tower where the tireless minds work the night shift. The camera glides along this street through one Tuesday in 2037 while a small day-clock in the corner jumps from 06:15 to 22:30 and a gold sun-dot crosses the sky; every explainer grows out of a lit object in this street (the scan on your phone, the tutor's voice-light, the agent's gold thread, Dad's earbuds) and, at dinner, out of the kitchen's light wall, where the old recordings play. At the end the city's windows go out one by one, one stays on (the night shift), and we come back to the kid's notebook: "Because people kept asking."*

The film is **drawn** (Canvas 2D, Node, `@napi-rs/canvas`, 2.5D cards before `cam3`): no AI images, no stock, no company logos (names as type only); the only real pictures are the three ORIGINAL FOOTAGE clips.

---

## 0 · Status and order of work
- **Phase 1 (this commit):** plan only: `MOTION.md`, `shots.md`, `BRIEF-builders.md`, `EDITORIAL-KIT.md`, `tools/shots23.py`, `tools/provisional_timing.py`. Film 18 versions are in `docs/ref-18/`. `film.mjs`, `lib/kit.mjs`, `scenes/` are still Film 18 code (see §12 for the phase-2 setup).
- **Phase 2 (after Singularity Friday #22 reports its builders done):** the lead builds the kit (`lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`), then **the 20-second style test** (1.01–1.03, the first ~20 s) for Jakob; only after his OK c01/c02 as the quality reference, then the three builders in parallel (`BRIEF-builders.md`).
- **Always anchor on words**, never on seconds: `T.G('phrase', nth, after)`, `T.GE(…)`. The chunk boundaries are phrases, so the real VO moves everything.

## 1 · Motion DNA (one cell: calm + soft, editorial)
- **Tone:** a warm, quiet day-in-the-life documentary that turns into a dinner-table explanation. The future is good on purpose; the "other way" is shown as cool and dark, never as doom (no red, no ruins, no alarms).
- **Easing:** entrances/landings expo-out, exits expo-in, moves quart in-out, **camera sine-S** (`camAt` default `'s'`). No springs, ≤ 3 % overshoot. Never linear except constant mechanics (ring rotation, drizzle, drift).
- **Base unit 0.4 s.** Micro accent 0.25–0.35 s · entrance 0.4–0.7 s · object move 0.8–1.6 s · camera ≥ 1.6 s, travels 2.5–4 s.
- **Weight:** light things are light (the pea, the `?` steps, coins, the earbud dots: quick, a small settle); buildings and the tower are heavy (they open slowly, never bounce); threads are taut and quick to react (40–120 ms after a pull).
- **Cause and effect** (40–120 ms): the clinic's line reaches a window → the ring lights; a coin hits the gate → the `?` lifts; the cool thread touches the gold one → it slides off; the old screen's line closes → the point drops and the next graphic starts from it.
- **Speed contrast 3–5×:** one short accent on the key word, then a living hold of 1.5–3 s.
- **No dissolves:** no cross-fade, no fade through black, no slide/wipe preset, nothing appears half-transparent. Transitions are plan sequences, camera travels along the street, transformations of one object into the next, flights into a surface, and the old-screen line (§5).

## 2 · ONE world: THE STREET IN SECTION
One night-blue street of a mid-size city, cut open like a doll's house (front walls removed). Seen from the front; depth comes from 3–5 cards per picture. Planned layout (the lead locks the numbers in `lib/f23_kit.mjs`; X along the street, Z depth, units as in `f10_editorial`, section plane `ZS ≈ 3000`):

| Place | Where | What it is in the film |
|---|---|---|
| **Your building** | X −2600 … −200, 4 floors (floor ≈ 520) | Floor 2: **hallway** (X −2600 … −2000, a tall window onto the city), **kitchen** (X −2000 … −1000: table, lamp, kettle, window; its back wall is **the light wall**), **the kid's room** (X −1000 … −300) |
| **The clinic** | X ≈ −7000, low building at the end of the street | one tall warm window; the gold line to your phone (1.03), the rings for everyone (2.04) |
| **The street** | Z ≈ 2400, ground line | trees and lamp posts as flat shapes; your walk to Dad (6.01) and back |
| **Dad's building** | X +4200 … +6400 ("two streets away", seen across the roofs from your window) | floor 3: Dad's flat + **balcony** (tomatoes), the neighbour's balcony next to it, floor 1: the student; the building in section is the diagram of 6.05 |
| **The night-shift tower** | skyline, X ≈ +2500, Z ≈ 16000 | the makers' tower: tall slab, windows in machine-cool light (the minds); it opens in section in 4.04; its cool thread in 5.04 |
| **The testers' house** | X ≈ +600, Z ≈ 9000, between tower and city | small, warm lamp, a visible gap to the tower, its front wall opens (4.06, 8.05, 11.03) |
| **The sky** | card 40000 | **the day-clock in the world**: a gold sun-disc travels an arc east (left) → west (right) from 07:30 to 16:00, the moon at 22:30; **the explainer space** for outdoor graphics |
| **The light wall** | the kitchen's back wall above the table | in 2037 a wall can show light: all dinner explainers are drawn there as light on the dark wall (no frame, no panel); the **old screen** for the clips opens there (§5) |

Camera: a perspective camera with **no roll and almost no pitch** (the street's horizon stays level); vertical travel is a crane (y), not a tilt. Travel along the street instead of cutting.

| Chunk | Builder | World (camera position) | Mode |
|---|---|---|---|
| c01 | Lead | The night street wide → the year → the tower → your kitchen window → the phone → the city map of windows (★ the other way, then everyone) | [EXPL] year/stamp → [SCENE] → [EXPL] the city as map |
| c02 | Lead | Inside the phone (★ one scan against all) → kitchen at first light → the city's rings → kettle → the next room, the voice-light | [EXPL] → [SCENE] → [EXPL] → [SCENE] |
| c03 | B1 | Kitchen table 07:30: the voice-light, ★ the ladder of questions, the blueprint; she stomps off; rise to the skyline | [EXPL] in the kitchen space |
| c04 | B1 | The quiet flat 09:00 → headlines in the window → drizzle of breakthroughs → ★ the tower at night → the road to the testers' house → back to your table | [SCENE] → [EXPL] in the sky |
| c05 | B1 | Noon in the kitchen: the agent and its gold thread, forms, the gate, the plan bars, ★ the cool thread that can't attach, Dad's window | [EXPL] in the kitchen/window space |
| c06 | B2 | 16:00 the walk → the balcony → the earbud bubbles → Dad's flat in section → ★ the whole building → the price ladder → sunset | [SCENE] → [EXPL] section |
| c07 | B2 | 19:00 dinner table under the lamp + the light wall: the pea's orbit, the homework, ★ the fork, K1 on the old screen | [SCENE] + [EXPL] light wall + [CLIP] |
| c08 | B2 | The light wall: the other road, ★ one in five, the testers' gate | [EXPL] light wall |
| c09 | B3 | The light wall: the agent's bars, ★ the threads re-tied, doctor/lawyer/agent, K3, the keys | [EXPL] + [CLIP] |
| c10 | B3 | The light wall: ★ luxury → library, the flow, the close race, the exam chart, K4 | [EXPL] + [CLIP] |
| c11 | B3 | The light wall: the school, the three symbols, ★ millions of points; the notebook | [EXPL] → [SCENE] |
| c12 | Lead | 22:30 the sleeping kid → the call between two windows → the hallway window: lights out, the tower on → ★ the year rolls back (timeline) → end screen | [SCENE] → [EXPL] → [SCENE] |

Hard world changes (≈ 0.7/min, budget ≤ ~1/min) are listed in `shots.md` §3. Everything else is plan sequence, travel or transformation.

## 3 · THE DAY-CLOCK (the clock motor; HUD, drawn by the lead for the whole film)
The film's natural motor is the hour. A small clock stamp lives top-left for the whole film, drawn by `lib/f23_hud.mjs` **over every chunk** (builders never draw it; they keep the zone free, §9).
- **Look:** at x 72, y 56. Line 1 `TUESDAY · 2037` (Inter 600, 20 px, letterspacing .3 em, `P.halo2`). Line 2 the time in Instrument Serif 72 px cream with a warm glow (`06:15`). Right of the digits a tiny **day dial** (r 30): a horizon line and a dotted arc; a **gold sun-dot** (r 6) moves on the arc by the hour; at night it is under the horizon and a **cream moon-dot** shows (22:30). Total ≈ 330 × 120 px.
- **Birth (1.01):** the big year `2037` rolls in over the city (odometer roll, 2026 → 2037, on **twenty thirty-seven**), shrinks on an arc into the corner on **one day** and becomes line 1; `A POSSIBLE TUESDAY` rises under it (≥ 3 s), then folds back into the stamp. The time first prints on **Six-fifteen** (1.03).
- **The jump (7×):** on the hour word (`Six-fifteen`, `Seven-thirty`, `Nine o'clock`, `Noon`, `Four o'clock`, `Seven o'clock`, `Ten-thirty`) each changed digit **rolls** vertically in its mask (0.45 s expo-out, staggered 60 ms right → left), the sun-dot slides along its arc (1.2 s sine), the stamp gives one 2 % pulse. That is the only hard accent of the clock. Between jumps the minutes do **not** run (it is a chapter clock); the sun-dot breathes so it is never frozen. The sky's sun disc in the world moves to the same hour within the chunk (the camera may crane up to show it at chapter starts).
- **Time machine:** while an evidence card is open (§4) the year in line 1 rolls back to the card's year (e.g. `2025`, gold-tinted digits) and rolls forward to `2037` when it closes. In 12.05 the year rolls back to `2026` big over the sky (the title payoff).
- **YouTube chapters = the jumps** (provisional times): 0:00 06:15 The message · 1:20 07:30 The tutor · 2:07 09:00 The night shift · 3:07 12:00 The agent · 3:59 16:00 Dad · 4:59 19:00 Why did it go well? · 9:26 22:30 The day ends. Recompute from the real `timing.json`.

## 4 · EVIDENCE CARDS "Already …" (HUD, drawn by the lead for the whole film)
All 13 `[ON SCREEN: Already …]` lines of `text-v5.md` are real-world evidence from today, shown as one designed card type (exact texts, anchors and sources in `shots.md` §4).
- **Where:** a drawer that opens **out of the clock stamp**, under it: x 72, y 184, width 720, height by content (≈ 170–230 px). Pairs (E3+E4, E10+E11) stack a second drawer below the first.
- **Look:** card `P.ind1` (`#0c1f5c`) with a 2 px cream rule on top, a 6 px gold bar on the left edge, square corners. Line 1 kicker `ALREADY IN USE` / `ALREADY BEING BUILT` / `… IN THE LAB` / `… MEASURED` / `… DRAFTED` / `… PLANNED` / `… TESTED` (Inter 600, 24 px, letterspacing .2 em, gold `P.halo0`). Line 2 place · year `USA · 2025` (Inter 600, 22 px, cream). Line 3 the fact (Instrument Serif 40 px, cream, ≤ 2 lines). Line 4 the source (Inter 600, 18 px, `P.halo2`). Cool variant (E10, the "other way" of the pair): the left bar in `COOL.mid` instead of gold.
- **Motion:** opens on its anchor word with a **mask** from the stamp's lower edge downward (0.45 s expo-out); the lines rise from their baselines (60 ms stagger). Meanwhile the stamp's year rolls to the card's year (§3). Closes with the mask back up into the stamp (0.35 s expo-in) and the year rolls forward. Never an opacity fade.
- **Reading:** open ≥ max(5 s, characters / 12 s); never over a clip (close before the old screen opens); at most one card (or one pair) at a time.
- **Composition rule for builders:** while a card is open, the zone x 60–820, y 40–430 holds only calm sky / wall, never the hero or a label.

## 5 · ORIGINAL FOOTAGE: the old screen on the light wall (K1, K3, K4)
The script makes the clips part of the dinner scene: "You put an old recording up on the wall." All three play on the kitchen's light wall.
- **The object:** "the old screen", 16:9. At the end of the push in it spans **x 266–1754, y 161–998** (1488 × 837; clear of the clock stamp). Edge: 2 px cream line, corners r 8, the lamp's warm pool lights its lower edge; the dark wall stays visible around it (we are still in the kitchen).
- **Old-recording look, without falsifying it:** the footage is drawn unchanged (no regrade, no fake scratches, no VHS warp) plus the film's grain floor and a 6 % vignette inside the frame. A recording, not a filter.
- **Label and lower third (inside the frame):** top-left tab `ORIGINAL FOOTAGE` (Inter 600, 18 px, letterspacing .25 em, cream on night `#080b27`), part of the screen from its first frame. Lower third bottom-left at (x 298, y 830–910), above the burned-in subtitles: a 4 px gold bar, name in Instrument Serif 46 px cream, `ROLE · YEAR` in Inter 600, 22 px, `P.halo2`. It wipes up from its baseline 0.4–1.0 s after the slot starts, leaves (mask down) 0.6 s before the slot ends (≥ 5 s on screen).
  - K1 `Bruce Schneier` · `SECURITY TECHNOLOGIST, HARVARD KENNEDY SCHOOL · 2026`
  - K3 `Tim Berners-Lee` · `INVENTOR OF THE WORLD WIDE WEB · 2023`
  - K4 `Sal Khan` · `FOUNDER, KHAN ACADEMY · 2024` (keep the OpenAI logo in the footage small or cropped)
- **CLIP IN** (during the bridge line and the 0.7 s air before the slot): (1) you lift your hand toward the wall; (2) a gold line runs from your hand up the wall to the frame's centre height (0.6 s expo-out) and spreads sideways to the frame width (0.35 s): one bright horizontal line; (3) **the old screen switches on**: the line opens vertically into the picture (mask, 0.5 s expo-out) showing the clip's first frame (held until the slot starts); (4) the camera pushes from the table to the frame (sine, ≥ 1.6 s), landing as the slot starts. The carrier differs per clip (7.06 your gold line, 9.03 the agent's thread, 10.05 the top `?` of the ladder).
- **During:** camera still (only `cameraFloat`), no card, no other motion; music ducked (audio).
- **CLIP OUT** (in the 0.6 s air after the slot): the picture collapses to a bright line (0.25 s expo-in), the line to a point (0.2 s); **the point is the carrier** into the next shot (K1 → drops onto the cool fork, 8.01; K3 → becomes the agent's light with the keys, 9.05; K4 → the school's first lit window, 11.01); the camera pulls back to the table (sine 1.6–2 s).
- **Frames:** the clips are not cut yet (the YouTube download is blocked in the cloud). Until `ROOT/clips/K1/f00001.jpg …` (30 fps, cropped) exist, the kit's placeholder slot draws name + transcript so the timing works. The clip **sound** is placed by the audio agent (slot times in `timing.json` `clips`).

## 6 · Recurring objects (the graphic language)
| Object | Meaning | First | Called back |
|---|---|---|---|
| The day-clock stamp (+ sun-dot / moon-dot) | the hour; the chapter; with a card: the year of today's evidence | 1.01 | every hour, 12.05 |
| Gold line from the clinic, gold rings in windows | care that reaches everyone (the same look) | 1.03, 2.04 | 1.05, 7.05, 11.03 |
| Price tag on a window / a thing | the other way: only for payers | 1.05 | 6.06, 8.01, 10.01 |
| The scan tile; the grain of rice | your finding; smallness | 1.04, 2.01 | 12.03 (your fingers) |
| The voice-light (cool sphere with rings) | the tutor | 2.06 | 3.x, 7.03, 10.04 |
| The sealed answer cube + the ladder of `?` | the tutor that asks | 3.03 | 7.02, 10.05 |
| The tower (cool windows) | the makers; the minds' night shift | 1.02 | 4.04, 5.04, 9.02, 12.04, end |
| The capsule on the gold road; the testers' house; month ticks | test before you trust, in the open | 4.06 | 8.03–8.05, 11.03 |
| The agent's light + the gold thread to your wrist | the agent that belongs to you (duty of loyalty) | 5.01 | 9.01–9.05, 11.03 |
| The ring of keys | revocable authority | 9.05 | – |
| The earbud dots (tiny cool pair) | the good version, for everyone | 6.02 | 6.05, 10.01, 12.03 |
| The library (columns of light, open door) | towns buying it for everyone | 10.01 | 10.02 |
| The fork: gold road vs cool road | it almost went another way | 7.05 | 8.01, 10.03 |
| The kid's notebook (handwriting in gold) | the question and the answer | 7.03 | 11.05, 12.01, end |
| You (yellow raincoat), the others (indigo) | the viewer; everyone else | 1.03 | always |

## 7 · Palette and the light of the hours
Exactly the style's palette (`P` in `lib/f10_editorial.mjs`) plus the machine's cool (`COOL` from Film 18):

| Role | Hex |
|---|---|
| Night, deepest ground | `#080b27` `#0a1334` `#0e112c` |
| Indigo surfaces | `#0a184a` `#0c1f5c` `#151f4b` |
| Blue, light on forms | `#193f8c` `#33497a` `#394773` |
| Gold core (lamp, sun, lines, care) | `#fefde2` `#fef4bf` |
| Gold halo / shadow | `#ead295` `#dec688` `#e7d19a` / `#9e7d54` `#a28f7b` |
| Machine cool (`COOL`) | `#eef3ff` `#b4c8ee` `#6a8cd2` `#2b4a96` |
| Raincoat (you only) | `#f2b632` |
| Text | cream `#fefcde`, labels `P.halo2` |

**Light code:** gold = human care, decisions people made, the good road. Cool blue-white = the machine (tutor, agent, tower, earbuds) and the "other way". Yellow only for you. **The day stays editorial night:** daytime is told by the sun-dot, the sky's hue and the angle of the light, never by brightness. Mean luma 40–60 (`calm.py`).

| Hour | Sky (top → horizon) | Hero light |
|---|---|---|
| 06:15 | `night0` → `ind1`, a thin gold line at the horizon | the phone, your kitchen window |
| 07:30 | `ind1` → `blue0`, first gold at the horizon | the voice-light |
| 09:00 / 12:00 | `blue0` → `blue1` (never lighter than `#394773`), small gold sun high | the object of the sentence (headline, agent, bar); the sun small, out of frame in close shots |
| 16:00 | `blue0` → warm halo `#e7d19a` at the horizon, low sun right, long shadows | the sun / Dad's window |
| 19:00 | `night1`, lamp-lit kitchen (gold pool) | the lamp + the light wall |
| 22:30 | `night0`, cream moon high, windows going out | the phone, then the hallway window, the tower |

Grain subtle: `PRINT23 = { grain 14, floor 4, vig .5 }` (as Film 18).

## 8 · Figures: small, faceless, alive
- **You:** `E.du` (yellow raincoat, hood **down** indoors, up outdoors), 12–25 % of the frame height in wide shots. **Your kid:** a smaller `E.person` in blue pajamas (`P.blue1`), a ponytail shape, school jacket indigo later. **Dad:** `E.person` long cardigan, a slight stoop, grey-blue hair shape, a tiny cool earbud dot. Neighbour, student, testers, doctor/lawyer: plain indigo silhouettes. Nobody but you in yellow; no faces.
- **Alive, always** (use `lib/figure.mjs`'s life model on the editorial figures; lead adds `alive(t, seed)` to the kit): **breath** 4–4.6 s (shoulders ±1.2 % of the height), **weight shift** every 8–13 s, **glance** (head turn) every 6–11 s, **blink beat** every 3.4–5 s. The figures are faceless, so the blink is a tiny head settle (1.5° dip in 80 ms, back in 140 ms); see the open question in `shots.md` §6. Each figure on its own seed.
- **Natural arms:** two-segment arms (shoulder, elbow), overlapping action (the forearm lags 60–80 ms behind the upper arm, the hand settles last), never stiff sticks, never behind the back. Walks with the real gait (`walk(phase)`: heel strike, body bob, opposite arm swing). Gestures are small and on the word (lift, point, nod, cross arms, hands flat on the table).

## 9 · Calm rules (measurable)
- **World changes:** ≤ ~1 hard world change per minute (this plan ≈ 0.7/min, `shots.md` §3).
- **Motion budget:** at most 1–2 moving main elements at once, the camera counts. Ambient life (breath, blink beat, steam, drift, stars, `camDrift`, `cameraFloat`, the clock's breathing dot) does not count.
- **Camera keys on words** (`camAt` keys from `T.G`); slow: travels 2.5–4 s; no whip pans; pass the subject depth as `ref`.
- **One motif per sentence. Nothing from nowhere:** a graphic grows out of a world object (phone, voice-light, thread, earbud, window, lamp pool, the old screen's point), text rises from its baseline, cards open out of the clock. Never fade in half-transparent.
- **Never a still image > 2 s; hold 1.5–3 s after each accent.** Text holds while read (≥ 1.5 s and ≥ characters/12 s; evidence cards ≥ 5 s).
- **Reserved zones:** top-left x 60–420, y 40–180 is always the clock (keep it calm); x 60–820, y 40–430 while a card is open; y > 930 carries the burned-in subtitles (no key information there).
- **Measure:** `python3 tools/calm.py <mp4> --scale 1280:720` (cuts ≤ 0.9/min; clip slots are excluded from the cut count; mafd median ≤ ~0.45; luma 40–60), `python3 tools/smooth.py <mp4> <start>` (**0 LURCH/POP**), `SECS=cNN,cMM node tools/seam.mjs --at T0` at every chunk seam.

## 10 · Carriers (transition map)
Every shot row in `shots.md` names its carrier. The chunk and group seams:

| Seam | Phrase | Carrier | Type |
|---|---|---|---|
| c01 → c02 | `You open the scan` | the line to your window → the phone → flight into the scan | transformation, flight into a surface |
| **c02 → c03** (Lead → B1) | `Seven-thirty` | **`plateGenius`**: the tutor's voice-light close (cool sphere r ≈ 150 at (960, 500), three slow rings, dark room) | seam plate; B1 pulls back: the light now hovers over the kitchen table, 07:30 |
| c03 → c04 | `Nine o'clock` | the camera rise to the tower, then settles back into the quiet flat | camera travel |
| c04 → c05 | `Noon` | the agent's light on your table | plan sequence |
| **c05 → c06** (B1 → B2) | `Four o'clock` | **`plateWindow`**: Dad's lit balcony window (≈ 300 × 380, centre) in a dark facade | seam plate; B2: the clock jumps to 16:00, pull back, you walk over |
| c06 → c07 | `Seven o'clock` | the sun sets behind your building as you walk home, your kitchen lamp switches on | camera travel |
| c07 → c08 | `When you were a baby` | K1 CLIP OUT: the point drops onto the cool fork | the old screen's point |
| **c08 → c09** (B2 → B3) | `And today, you say` | **`plateWall`**: the empty light wall over the table, lamp pool below, table edge at y ≈ 900 | seam plate; B3: the agent's light lowers into the wall |
| c09 → c10 | `And Grandpa's earbuds?` | the agent's little "grounded" box becomes the shop window | transformation |
| c10 → c11 | `And the grown-ups practiced` | K4 CLIP OUT: the point becomes the school's first window | the old screen's point |
| **c11 → c12** (B3 → Lead) | `Ten-thirty` | **`plateNotebook`**: the notebook page close, `Because people kept asking.` in gold handwriting | seam plate; Lead: clock to 22:30, pull back to the sleeping kid |
| c12 → end screen | VO end | the rise over the city continues; one window stays on; sink back to the notebook | camera travel, fly-through of the window frame |

Seam plates (`lib/f23_seams.mjs`, lead, phase 2) work as in Film 18: both sides draw the same screen-space picture for 0.5 s on each side of T0; the handing side converges onto it (camera key on `T0 − 0.5`, sine-S; carrier parameters lerped onto the plate values); the receiving side grows its world out of it. The HUD (clock, cards) is drawn over the plates by the film, unchanged across the seam.

## 11 · Text and graphics
- **Explainers are light on night grown from world objects** (no panels, no frames except the old screen, no gridded axes, no legends): the city as a map of windows, the scan field, the columns, the ladder of `?`, the blueprint, the headline objects, the fan of rays, the road with the testers' house and month ticks, the plan bars, the threads, the earbud bubbles, the building section, the price ladder, the fork, the five findings, the library, the flow loop, the close race, the exam bars, the school windows, the three symbols, the map of millions, the 2026 → 2037 timeline.
- Each graphic shows exactly what its sentence says, readable without sound: one statement, at most one number (only the numbers in `shots.md` §4), ≤ 6 words of label.
- **Type:** numbers and big words Instrument Serif (cream, warm glow); labels and sources Inter 600 (`P.halo2`). Number ≥ 120 px, label ≥ 34 px, source ≥ 22 px at 1080p (card sizes in §4). Text in the picture only for the year, the time, names, places, numbers, sources, the evidence cards, and the kid's handwriting (diegetic). Never a VO sentence as a title.
- **Handwriting** (`Why did it go well?`, `Because people kept asking.`): gold strokes drawn on with a mask along the letter paths (Instrument Serif Italic as the base, stroke-on), word by word on the phrase.

## 12 · Kit plan (phase 2, lead) and engine setup
- **As built (phase 2, 2026-11-07):** engine set up (F23ROOT, robust `T.G`, 12 chunks, HUD in the film's finish, `film.prepare` = clip frames, Film 18 scenes moved to `docs/ref-18/scenes/`). Final numbers are in `lib/f23_kit.mjs` and the signatures in `BRIEF-builders.md` §5. Changes against §2: rooms have **depth** (open cut at `ZS` 3000, back wall at `ZB` 3600), the clinic sits at X −5600 … −4500, the tower at X 4000, the dinner table stands under the light wall with stools (no chair backs or pendant in front of the wall), the pendant hangs right of the wall. c01 is built on thumbnail A and is the quality bar.
- **Engine setup** (before the first render): `lib/kit.mjs` ROOT → `$F23ROOT` or `/mnt/project-files/scenario/film-erster-tag/2037/`; `film.mjs` `CHUNKS` = the 12 chunks of `shots.md` §2 (phrases from `tools/shots23.py CHUNKS`); `T.G` must match robustly across TTS word splits (`Seven-thirty` = `Seven` `thirty`), as `shots23.py gfind` does; the HUD (`f23_hud`) is drawn in `film.mjs` after the chunk entries and before `finish`; clip slots read `T.clip('K1')` (fallback by order).
- **`lib/f23_kit.mjs`** (world): `PRINT23`, `COOL`, `STREET` (layout constants of §2), `skyAt(ctx, c, t, hour)` (sky + sun/moon by hour), `building(…)` / `flat(…)` (section boxes, lit windows), `kitchen(…)` (table, lamp pool, kettle, window, light wall), `clinic`, `tower` (+ `open` 0..1), `testersHouse` (+ `open`), `dadBuilding` (+ balcony), `voiceLight`, `answerCube`, `qStep` (the `?` steps), `agentLight` + `thread(a, b, o)` (gold/cool, taut, slide-off), `capsule`, `road` + `monthTicks`, `earbuds`, `bubble` (wave-glyphs), `library`, `notebook` + `handwrite(text, u)`, `alive(t, seed)` for `du`/`person`, `kid`, `dad`.
- **`lib/f23_hud.mjs`** (film-level overlay): `dayClock(ctx, t, T)` (§3: stamp, jumps from the hour phrases, year rolls), `evidence(ctx, t, T)` (§4: the 13 cards from one table with open/close phrases), `oldScreen(ctx, t, slot, o)` (§5: line → open → footage/placeholder → collapse → point; returns the point for the next carrier), `lowerThird`.
- **`lib/f23_seams.mjs`**: `plateGenius`, `plateWindow`, `plateWall`, `plateNotebook` (+ `SEAM_HALF`, `seamWindow`).
- Base kit stays: `lib/f10_editorial.mjs` (stage, `card`, `cam3`, `camAt`, `aim`, `camDrift`, `P`, `du`, `person`, `glowText`, `halo`, `glowFill`, `stars`, `finish`, explainer helpers `counter`, `bars`, `curve`, …), `lib/f16_kit.mjs` / `lib/f13_kit.mjs` (`rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts`, `stamp`), `lib/figure.mjs` (life model, gait). Film 18's `f18_*` modules stay as reference only.
- **Memory:** never build a canvas/pattern/gradient cache per frame. Render with `node --expose-gc`, pieces ≤ 20 s. `Path2D` from `@napi-rs/canvas`.

## 13 · End screen (≈ 15 s after the VO end, 12.07)
Motion continues, music runs on, no voice. The rise over the sleeping city continues; the remaining windows go out one by one, **one stays on** (the tower's night shift, cool). Then the camera sinks back down your building's facade and flies through the kitchen window frame: the notebook on the table in the moonlight, `Because people kept asking.`, the pea beside it, slow push. **Free areas:** left x 90–780, y 250–700 (best video), right x 1140–1830, y 250–700 (latest upload), centre x 810–1110, y 330–600 (subscribe); the notebook sits below y 720. Never static.

## 14 · First image = thumbnail motif
The first frame (1.01) must be the thumbnail motif. The thumbnails are being made in parallel (`thumbs-2037`); **placeholder** until they land: the night street in section, your kitchen window the only warm light, the big gold `2037` over the roofs. When the chosen thumbnail exists (expected under `/mnt/project-files/scenario/thumbnails/`), the lead matches 1.01's first 2–3 s to it (same composition, same hero light, the figure in the same place) before the style test.

## 15 · Gates (in this order)
1. Plan first: the shot in `tools/shots23.py` (anchor phrase, picture, 1–2 moves, carrier), regenerate `shots.md` (`python3 tools/shots23.py --md docs/shots.md`; text outside the SHOTS block stays).
2. The 20-second style test (1.01–1.03) to Jakob; build only after his OK.
3. Build, then look: stills around each move and one per sentence (`render.mjs --snap … --scale .4`, contact sheet). At least 3 review rounds.
4. Measure (§9), numbers into the report.
5. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive (figures!) · graphics from world things · text. Nothing under 4. Similarity to the style reference (Film 11 thumbnails) in %, name the biggest gap.

## 13. Decisions on the open questions (thread lead, 2026-11-06)
1. "You" stays faceless (channel rule). Kid and Dad may get minimal dot eyes in close-ups so they can blink; other figures faceless with head settles.
2. Indoors "you" wears a yellow sweater/hoodie in the same gold-yellow (raincoat only outside), so the colour still marks "you".
3. Noon may be one step brighter (deep day-blue + warm sun-dot glow), still inside the night palette; evening returns to full night.
4. Kitchen light wall is approved as the space for dinner explainers and clips.
5. E8/E9: re-check before render (fact-check owner: thread lead).
6. Opening image = thumbnail A motif: dark kitchen at 06:15, huge chest scan glowing on the wall with a small gold spot in a ring, tiny figure with steaming mug below (/mnt/project-files/scenario/thumbnails/film-2037/).
7. Subscribe lines (added 7.11.): line 1 (294.7–303.6, end of shot 6.06) and line 2 (593.9–599.3, in shot 12.05). Picture: camera rises slowly above the cut-away street to the whole lit city; a small gold channel mark settles in the clock corner while the day-clock pauses; no new world, no hard cut; the street continues right after. Line 2 uses the same rise over the night city (lights going out) so both moments rhyme.
