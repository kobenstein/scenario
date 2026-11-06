# Film 19 · "How to Survive the AI Crash" · builder brief (DRAFT, 3 builders in parallel, one checkout) · as of 2026-11-06

**Status: draft (Phase 1).** Builders start only after the coordinator's go (another film is using the build slot) and after the lead has built the kit (`lib/f19_kit.mjs`, `lib/f19_props.mjs`, `lib/f19_seams.mjs`) and c01–c02. Release **Sat 7 Nov 2026, 17:00 Vienna**: the player at ≈ 08:00, Jakob's comments by 12:00. Budget per builder: Opus **high**, one pass + three review rounds, no max.

The picture lead builds **c01–c02** (hook + the clock, 0 → ≈ 64 s) as the quality reference and holds the kit, the shot list and the seams. The rest is built by **three builders at the same time: B1, B2 and B3**, each ≈ 3 minutes. Everything anchors on words, so the real VO (`film-ai-crash/audio/timing.json`, written by the audio agent) moves your picture with it; until it exists the engine uses `data/provisional_timing.json`.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Look first** (style, in this order): thumbnail A `/mnt/project-files/scenario/film-ai-crash/thumbnails/thumbnail-A.jpg` (the film opens with it: you under the golden umbrella, the red line shattering on it) · the channel style reference `/mnt/project-files/scenario/film-04-v2/stills/stil-referenz/f4_8m27_feuerkreis.jpg` (one warm light in a wide night) · the Film 11 thumbnails `/mnt/project-files/scenario/thumbnails/film-11/`. Flat grain editorial night illustration, ONE warm light shape as hero, a tiny yellow figure, few colours, much dark space.
3. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md` (anchors vs explainer plane, the umbrella and the counter, palette + red accent, calm rules, carriers, kit)
   3. `docs/shots.md` (your shots with phrase anchors, layers, carriers; binding; §3 world changes, §4 the only numbers and the exact on-screen text)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API) and the headers of `lib/f19_kit.mjs`, `lib/f19_props.mjs`, `lib/f18_kit.mjs`
   5. `/mnt/project-files/scenario/film-ai-crash/vo-v4.txt` (or `vo-v3.txt` while v4 is missing) and `text-v3.md` (PICTURE notes per sentence)
   6. `/mnt/project-files/scenario/film-ai-crash/faktencheck-v3.md` + `faktenzettel.md` (only these facts)
4. **Look at** the reference: `/mnt/project-files/scenario/film-ai-crash/bild/c01_kontakt.jpg` and the code `scenes/sc01.mjs`, `scenes/sc02.mjs`. They are the pattern and the quality bar:
   - shots joined by carriers (`shots.md` last column): an object of shot A becomes or carries shot B, never a dissolve;
   - camera from `camAt(t, K, ref)` keys on words; pass the subject depth as `ref`;
   - everything that appears comes from somewhere: the line drops in from above, icons fly out of the thing they were, text rises from its baseline, a window opens from a lit rect;
   - reactions computed from positions (a shard hits the canopy → the canopy flares there; the dot reaches a stop → the stop lights).

`/mnt/project-files` is a network mount: exact paths only, never search the whole folder; only small jpg contact sheets go there. Renders stay in your own scratchpad.

## 1 · Split (provisional times; in code anchor only on words)
| Builder | Chunks | Time (s, provisional) | Dur | Content |
|---|---|---|---|---|
| **Lead** | c01, c02 | 0–63.7 | 64 s | Thumbnail opening (umbrella under the red line), Nov 5 −$2 trillion, CRASH?, not a tip / timing / luck, the five gores, the milestone; the counter snaps to 030, the record high, ★ the route map with four named exits, the bubble swells |
| **B1** | c03, c04, c05, c06 | 63.7–252.8 | 189 s | ★ Inside the bubble: data centers, spending stacks, Powell clip C1, two columns, the scale, IOUs, the 100-cell coin (2 → 10), DUE calendar, China pops, `$0`; your table day 31, red screens, DO SOMETHING, ★ 100 calm points, Fidelity tower, three bars, pause → gore 1, phone face down; road: exit 1 the tariff crash, ★ its window; the red line into the town, your mailbox, fund dots, ★ globe 1/6, magnifier → gore 2 |
| **B2** | c07, c08, c09, c10 | 252.8–422.0 | 169 s | Payslip, venture money halves, the glass door (hiring paused), envelope → gore 3, $400, ten figures, rent; route map: exits 2 + 3 with windows, ★ the 2009 memory; exit 4 the dot-com bubble, two bubbles, www shops, the long line, 2001 office, five start points, price tag ÷10 → gore 4, ★ time-morph to your desk, many roads; ★ the nets under the road, 1933 bank, first net, the cent, your bank app |
| **B3** | c11, c12 + end screen | 422.0–631.3 | 209 s | Black Monday, the brake lever, March 2020 (four pulls), 15 minutes, Nov 5 no halt, stress tests, ★ three nets in morning light, the hole (DATA CENTER DEBT), Hyperion, the 80/20 box, the nets fall short, light cone, shake table, the fourth net, gore 5, the hands, your message; DAY 1,000, you turn, ★ morning (bubble gone, hall stands), Hassabis clip C3, new price, the street of windows, the harvest, roads join, your table, DAY 032, the phone turned over, end screen (≤ 15 s) |

B3 includes 9 s of clip and the 15 s end screen, so its drawn time is ≈ B1's. Chunk boundaries are the phrases in `film.mjs` `CHUNKS`: c02|c03 `Mostly, data centers` · c03|c04 `Day thirty-one` · c04|c05 `Day forty-eight` · c05|c06 `But what if the fall` · c06|c07 `And if the fall keeps going` · c07|c08 `Day two hundred eighty-two` · c08|c09 `Day nine hundred twenty-nine` · c09|c10 `On a road this long` · c10|c11 `On Black Monday` · c11|c12 `Day one thousand`.

**c01–c02 belong to the lead.** Do not touch `scenes/sc01.mjs`, `scenes/sc02.mjs`.

## 2 · The seams between the groups (fixed, defined by the lead)
The three group seams sit on a **shared picture**, a *plate* from `lib/f19_seams.mjs`. Both sides draw the plate from the same function with the same `t`, so the frames left and right of the seam are identical. Preview: `node tools/seam_plates19.mjs <dir>`.
- The handing side steers its last move so the picture lands on the plate (camera key on `T0 − 0.5`, sine-S; carrier parameters lerped onto the plate values) and draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its picture out of it: the plate pulls back or becomes a thing of the new picture, never by a dissolve. Your first frames after `T0 + 0.5` must equal the plate (same object, same size, same place) and only then move.
- Helpers: `seamWindow(t, T0)` and `SEAM_HALF`. Draw the plate after your cards, in screen space.

| Seam | T0 (anchor) | Plate | Hand-over | Take-over |
|---|---|---|---|---|
| **Lead → B1** | `T.G('Mostly, data centers')` (≈ 63.7) | `plateBubble`: **inside the bubble skin**: the frame is the curved film (COOL bands, gold sheen, one red thread), the hall's cool window rows faint behind it | done (sc02): push into the skin, `skinFlood` | 3.01: pull back off the skin; the film stays at the frame edges, the hall stands |
| **B1 → B2** | `T.G('And if the fall keeps going')` (≈ 252.8) | `plateLine`: **the payslip, close** (paper card of light at (960, 520), w 900, tilt −3°), the red line crossing it left → right, mailbox light from below | 6.08: the red line moves from the mailbox into the payslip; push in | 7.01: the net-pay line dims on **paychecks**; the payslip folds into the money stack (7.02) |
| **B2 → B3** | `T.G('On Black Monday')` (≈ 422.0) | `plateNet`: **under the road**, the 1933 net close along the bottom, the `BLACK MONDAY · 1987` pillar centred ahead, cold light | 10.06: from the banking app pull back under the road to the 1987 pillar | 11.01: along the pillar into the trading-floor window |

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first of cN+1 (simplest: a shared drawing function in your own `lib/f19_bN_*.mjs`). Carriers are in `MOTION.md` §6 and `shots.md`.

## 3 · Hard rules for the picture
- **Mix: 60–70 % explainer.** Every `[EXPL]` row in `shots.md` is a real explainer graphic grown from the object of the shot before (the line, the points, the coin, the bars, the stack, the route map), readable without sound, one statement, at most one number and ≤ 6 words plus source. No chart panels, frames, gridded axes, legends. Do not turn an `[EXPL]` shot into a scene without the lead's OK (the share is counted).
- **The road is an anchor, not the stage.** No flights along it, no "travel through the world" between stations. You walk, signs come to you, the camera trucks briefly or sinks under the road. Stations open as windows from their sign.
- **Every transition carries an object into the next** (`shots.md` last column). No cross-fades, no fades through black, no slide/wipe, nothing half-transparent from nowhere ("ghosts").
- **Calm:** ≤ ~1 hard world change per minute (`shots.md` §3, do not add any), slow camera moves on word keys, max 1–2 moving main elements at once, never a still image > 2 s.
- **The two HUDs** are drawn by the kit (`hudDay`, `hudUmbrella`) in every frame of your chunks from 2.03 on (hide them only inside a clip window): never draw your own counter or umbrella in the corners; use `dayAt(t, T)` for the value.
- **Protections fly into the umbrella** with `flyToGore` on the sentence's key word (`shots.md` §1 lists the five moments).
- **You** (tiny, faceless, yellow raincoat, `E.du`) is the viewer: small gestures (look down, reach, turn the phone, walk) on the words that concern you; walk with the real gait (`walk: t * 5.5`). Other people indigo (`E.person`), alive (weight shifts, sips, typing). No faces.
- **Names, not years:** `THE FINANCIAL CRISIS`, `THE DOT-COM BUBBLE`, `THE TARIFF CRASH`, `THE RATE SHOCK`, `THE COVID CRASH`, `BLACK MONDAY`; the year small after the name. No first person on screen (`TO: YOUR REPRESENTATIVE`). No company logos: names as type only.
- **Red** only from `F.RED` and only for losses (lines, red numbers, the button, the ticker); never as a light, never the brightest thing; none from 11.08 on. The ground is night blue outside the hook (`crisis` is the lead's).
- **No doom:** no explosions, no ruins, no skulls; the shards fall slowly and calmly; from 11.08 the light warms; c12 is morning.
- **Clips** with `clipWindow` only (it falls back to a quote card while the MP4s are missing).
- **End screen ≤ 15 s** (B3, 12.17): calm picture with free areas left (x 90–780, y 250–700) and right (x 1140–1830, y 250–700) plus subscribe centre (x 810–1110, y 330–600); picture and music keep running.
- **Subtitle zone:** nothing important below y 860.
- **Timing:** anchor on words from the timing file, never hard-coded seconds. If `vo-v4.txt` changes a phrase, the lead updates `shots19.py`; you update the phrase in your scene.

## 4 · What you may touch and what not
- **Only your files:** B1 `scenes/sc03.mjs` … `sc06.mjs`; B2 `scenes/sc07.mjs` … `sc10.mjs`; B3 `scenes/sc11.mjs`, `sc12.mjs`; plus your own modules `lib/f19_b1_*.mjs`, `lib/f19_b2_*.mjs` or `lib/f19_b3_*.mjs`.
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f18_kit.mjs`, `lib/f19_kit.mjs`, `lib/f19_props.mjs`, `lib/f19_seams.mjs`, `lib/kit.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `scenes/sc01.mjs`, `scenes/sc02.mjs`, the other builders' files, and anything under `audio/` (the audio agent) and `clips/`.
- **Something missing in the kit or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT19 }`; `R = { a, b }` is the chunk range. A chunk may have several entries, but every entry boundary must be a carried transition with identical frames on both sides (the engine only does hard cuts between identical frames; `film.mjs` turns anything else into a cut and warns).
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset`.

## 5 · Kit state (filled in by the lead after building the kit; see `MOTION.md` §8 for the plan)
- `f19_kit`: `PRINT19`, `RED`, `GROUND`, `crisis`, `umbrella`, `hudUmbrella`, `goreIcon`, `flyToGore`, `flap`, `hudDay`, `dayAt`, `road`, `exitSign`, `goalSign`, `town`, `underRoad`, `pillar`, `netSpan`, `routeMap`, `SPX`, `lossLine`, `shards`, `vWindow`, `clipWindow`, `bubble`, `skinFlood`, `dots100`, `coin100`.
- `f19_props`: `phoneHand`, `table`, `stopwatch`, `dice`, `container`, `rateDial`, `bankFacade`, `cashRegister`, `scale`, `iouSlip`, `calendar`, `payslip`, `mailbox`, `envelope`, `magnifier`, `lever`, `shakeTable`, `fundTower`, `figureIcon`.
- c01–c02's set (reuse it where the same places return): the road plain, your position, the milestone, the route-map layout (`ROUTE` constants), the bubble's position over today's dot.
- **Finish:** `PRINT19 = { grain: 14, floor: 4, vig: .5 }`.
- **Memory:** no canvas, no pattern per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas` (import it).

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f19/bN/`. Nothing big into `/mnt/project-files`.

Review stills (small):
```
cd /home/user/scenario/films/19-ai-crash
SECS=c03 node render.mjs --snap 64,65.5,67 --dir $SP/f19/b1/snap --scale .4
```
Then build a contact sheet and **look at it**.

Video (full quality): pieces ≤ 20 s, always with `--expose-gc`; never more than one render per builder at a time.
```
SECS=c03 node --expose-gc render.mjs --out $SP/f19/b1/c03_a.mp4 --from 63.7 --to 83
```
Then join with `ffmpeg -f concat -c copy` into `$SP/f19/bN/cNN.mp4`.

Delivery per chunk: video `$SP/f19/bN/cNN.mp4` (the path goes into the report); contact sheet (1 frame/s, small jpg, ≤ 1 MB) `/mnt/project-files/scenario/film-ai-crash/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition), everything ugly or unclear fixed; at least 3 review rounds. Every frame a poster; sentence = picture; the hero light the brightest thing (never red); you never cut off except in a deliberate move; text readable on a phone (390 px wide copy); nothing important below y 860.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned identical-frame entries); mafd median ≤ ~0.45; luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams also check against the plate.
5. **Calm rules** (`MOTION.md` §5) and **the explainer rows really are explainers.**
6. Self-grade 1–5: poster · sentence = picture · seamless (object carries) · calm · alive · explainer from objects · text · names not years. Nothing under 4.

## 8 · Report (short, English)
Chunks finished with paths to videos and contact sheets · numbers per chunk (calm, smooth, seam) · kit wishes · deviations from `shots.md` with the reason · the files you created or changed (so the lead can commit exactly those) · tokens used.
