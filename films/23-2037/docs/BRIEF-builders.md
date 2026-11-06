# Film 23 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-06 (phase 1: plan)

**Not started yet.** The picture build begins only after Singularity Friday (#22) reports its builders done and Jakob has approved the 20-second style test (1.01–1.03). Then the picture lead builds the kit (`lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`) and c01–c02 as the quality reference; then **three builders, B1, B2 and B3**, build the middle of the film at the same time, each ≈ 2.5–3 minutes. The lead also builds c12 + the end screen (it rhymes with the opening).

Timing: the real VO `film-erster-tag/2037/audio/timing.json` (written by the audio agent) is what the engine reads; `data/provisional_timing.json` (145 wpm) is only the fallback. Everything anchors on phrases, so a re-voiced line moves your picture with it. Times below are provisional.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md` (THE STREET IN SECTION, the day-clock, the evidence cards, the old screen, figures, palette, calm rules, carriers, kit)
   3. `docs/shots.md` (your shots with phrase anchors, carriers and transitions; binding; §4 = the only numbers and the exact on-screen text)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API) and the headers of `lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`
   5. `/mnt/project-files/scenario/film-erster-tag/2037/text-v5.md` (your movements, with the stage notes) and `vo-v5.txt`
   6. `/mnt/project-files/scenario/film-erster-tag/2037/faktencheck-v5.md` (only these facts)
3. **Look at** the reference: the lead's c01/c02 render and contact sheet (path in the lead's report) and the code `scenes/sc01.mjs`, `scenes/sc02.mjs`. They are the pattern and the quality bar:
   - one plan sequence per chunk (one entry); the camera travels along the street instead of cutting;
   - camera from `camAt(t, K, ref)` keys on words; pass the subject depth as `ref`;
   - everything that appears comes from somewhere (a window, the phone, the voice-light, a thread, the lamp pool, the old screen's point); text rises from its baseline;
   - reactions computed from positions (the line reaches a window → the ring lights);
   - figures are alive (`alive(t, seed)`: breath, weight shift, glances, blink beat) and their arms move naturally.

`/mnt/project-files` is a network mount: exact paths only (with trailing slashes for folders), never search the whole folder; only small jpg contact sheets go there. Renders stay in your own scratchpad.

## 1 · Split (provisional times; in code anchor only on phrases)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **Lead** | c01, c02 · c12 + end screen | 0–80.45 · 566.43–625.73 | 140 s | Hook (the year, the clock birth, the message, ★ the other way vs everyone), 06:15 (★ one scan against all, no bill, the kettle, the voice-light next door) · 22:30 (the sleeping kid, the call, lights out, ★ the year rolls back, the title, end screen) + the kit, HUD and seams |
| **B1** | c03, c04, c05 | 80.45–239.38 | 159 s | 07:30 the tutor (★ the ladder of questions, the blueprint) · 09:00 the night shift (headlines, breakthroughs like weather, ★ the tower at night, the fan of rays, the testers' house, the wait) · 12:00 the agent (forms, the gate, the plan bars, ★ the cool thread that can't attach, the lawyer in your pocket, Dad's window) |
| **B2** | c06, c07, c08 | 239.38–416.23 | 177 s | 16:00 Dad (the walk, the balcony, earbud bubbles, height marks, ★ the same earbuds for the whole building, the price ladder) · 19:00 dinner I (the pea, the homework, ★ the fork, **K1** on the old screen) · dinner II (the other road, ★ one in five, the testers' gate) |
| **B3** | c09, c10, c11 | 416.23–566.43 | 150 s | Dinner III (the bars, ★ the threads re-tied, doctor/lawyer/agent, **K3**, the keys) · dinner IV (★ luxury → library, who paid, the close race, the exam chart, **K4**) · dinner V (the school, the three questions, ★ millions, the notebook) |

Chunk boundaries (phrases in `tools/shots23.py CHUNKS`, later `film.mjs`): c02 `You open the scan` 31.09 · c03 `Seven-thirty` 80.45 · c04 `Nine o'clock` 126.66 · c05 `Noon` 187.38 · c06 `Four o'clock` 239.38 · c07 `Seven o'clock` 298.66 · c08 `When you were a baby` 360.80 · c09 `And today, you say` 416.23 · c10 `And Grandpa's earbuds` 463.65 · c11 `And the grown-ups practiced` 524.11 · c12 `Ten-thirty` 566.43 · VO end 610.30 · film end 625.73.

## 2 · The seams between the groups (fixed, defined by the lead)
The four group seams sit on a **shared picture**, a plate from `lib/f23_seams.mjs`. Both sides draw the plate from the same function with the same `t`, so the frames left and right of the seam are identical.
- The handing side steers its last move so the picture lands on the plate (camera key on `T0 − 0.5`, sine-S; carrier parameters lerped onto the plate values) and draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate pulls back or becomes a thing of the new world, never by a dissolve.
- The HUD (day-clock, evidence cards) is drawn by the film over everything, also over plates; you never draw it.

| Seam | T0 (phrase) | Plate | Hand-over (end of the group before) | Take-over (start of the group after) |
|---|---|---|---|---|
| **Lead → B1** | `Seven-thirty` (≈ 80.45) | `plateGenius`: the tutor's voice-light close: a cool sphere (r ≈ 150) at (960, 500) with three slow rings, a dark room around it, no figure | 2.06: the camera trucks through the cut wall into the kid's room and pushes onto the voice-light on **With a genius** | 3.01: pull back: the light now hovers over the **kitchen table**, the kid in pajamas, the clock jumps to 07:30 |
| **B1 → B2** | `Four o'clock` (≈ 239.38) | `plateWindow`: Dad's lit balcony window (≈ 300 × 380, centre) in a dark indigo facade, the rail and tomato leaves as silhouettes | 5.06: you walk to your window, push past your shoulder toward Dad's window on **Telling your dad** | 6.01: the clock jumps to 16:00; pull back and truck: you walk the two streets over |
| **B2 → B3** | `And today, you say` (≈ 416.23) | `plateWall`: the empty light wall over the kitchen table, the lamp pool below, the table edge at y ≈ 900 | 8.05: the testers' gate graphic sinks into the wall's lower edge on **before it reached anyone** | 9.01: the agent's light lowers into the wall with its gold thread |
| **B3 → Lead** | `Ten-thirty` (≈ 566.43) | `plateNotebook`: the open notebook close, `Because people kept asking.` in gold handwriting | 11.06: push onto the page on **doesn't know about your scan** | 12.01: the clock jumps to 22:30; pull back to the kid asleep at the table |

Seams inside your group (chunk to chunk) you build yourself on the same principle: the same camera and the same carrier state in the last frame of cN and the first of cN+1 (simplest: a shared drawing function in your own `lib/f23_bN_*.mjs`). Carriers are in `MOTION.md` §10 and in every row of `shots.md`.

## 3 · Hard rules for the picture
- **One world: THE STREET IN SECTION.** Everything happens in the cut-away street (your building, the clinic, Dad's building, the tower, the testers' house), in its sky, or on the kitchen's light wall. Travel along the street instead of cutting. Hard world changes only where `shots.md` §3 lists them.
- **Mix 3D-like scenes with real explainer graphics** grown from world objects. The plan's explainer share is **63 %**; keep your chunk at its share in `shots.md` (do not turn an [EXPL] row into a plain scene). Each graphic shows exactly what its sentence says, readable without sound, one statement, at most one number and ≤ 6 words of label. No generic chart panels, frames, gridded axes, legends.
- **Every transition carries an object into the next** (named per row). No cross-fades, no fade to black, no wipe, nothing fades in half-transparent from nowhere.
- **Calm:** max ~1 hard world change per minute, slow camera on word keys, max 1–2 moving main elements at once, never a still image > 2 s, hold 1.5–3 s after accents.
- **The clock and the cards are not yours** (HUD). Keep the zones free (`MOTION.md` §9): x 60–420, y 40–180 always; x 60–820, y 40–430 while a card is open (card times: `shots.md` §4); no key information below y 930 (subtitles).
- **The clips (B2: K1, B3: K3 + K4)** play on the old screen: build the CLIP IN (your carrier → the line → the screen opens, push) and CLIP OUT (collapse → point → your next carrier) with `oldScreen()` from `f23_hud`, exactly as `MOTION.md` §5. No card, no other motion while a clip plays.
- **You** (tiny, faceless, yellow raincoat, hood down indoors) are the viewer: small gestures on the words that concern you (lift, nod, hands flat on the table, lean). **The kid, Dad and everyone else** are indigo/blue silhouettes, no yellow, no faces, always alive (breath, weight shift, glances, blink beat), natural two-segment arms.
- **No doom:** the "other way" is cool and dark, never red, no ruins. The machine is light (cool spheres, discs, windows), never a robot.
- **No company logos:** names as type only on the cards. The K4 footage keeps its logo small or cropped (lead/clip cutter).
- **Timing:** anchor on phrases from the timing file, never hard-coded seconds.

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc03.mjs` … `sc05.mjs`;
  - B2: `scenes/sc06.mjs` … `sc08.mjs`;
  - B3: `scenes/sc09.mjs` … `sc11.mjs`;
  - plus your own modules `lib/f23_b1_*.mjs`, `lib/f23_b2_*.mjs` or `lib/f23_b3_*.mjs`.
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/figure.mjs`, `lib/f23_kit.mjs`, `lib/f23_hud.mjs`, `lib/f23_seams.mjs`, `lib/kit.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, the lead's scenes (`sc01`, `sc02`, `sc12`), the other builders' files, and anything under `audio/` (the audio agent).
- **Something missing in the kit or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: F.PRINT23 }`; `R = { a, b }` is the chunk range. A chunk is normally **one** entry (plan sequence); a second entry is a hard cut, allowed only where `shots.md` names a match with a rhyming carrier (the clip slots are drawn inside your entry by `oldScreen()`).
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset`.

## 5 · Kit (planned, the lead fills in the signatures in the file headers before you start)
- `f23_kit`: `PRINT23`, `COOL`, `STREET` (layout, `MOTION.md` §2), `skyAt` (sky + sun/moon by hour), `building`/`flat`, `kitchen` (table, lamp pool, kettle, window, light wall), `clinic`, `tower` (`open`), `testersHouse` (`open`), `dadBuilding` (balcony), `voiceLight`, `answerCube`, `qStep`, `agentLight` + `thread` (gold/cool, taut, slide-off), `capsule`, `road` + `monthTicks`, `earbuds`, `bubble`, `library`, `notebook` + `handwrite`, `alive`, `kid`, `dad`.
- `f23_hud` (drawn by the film, you only call `oldScreen` for your clip transitions): `dayClock`, `evidence`, `oldScreen(ctx, t, slot, o)` (returns the line/point for your carrier), `lowerThird`.
- `f23_seams`: `plateGenius`, `plateWindow`, `plateWall`, `plateNotebook`, `SEAM_HALF`, `seamWindow`.
- Base: `f10_editorial` (`card`, `cam3`, `camAt`, `aim`, `camDrift`, `F0`, `P`, `du`, `person`, `glowText`, `halo`, `glowFill`, `stars`, `counter`, `bars`, `curve`, …), `f16_kit`/`f13_kit` (`rise`, `blink`, `maskLine`, `trailSpan`, `measure`, `along`, `roundRectPts`), `figure.mjs` (life model, gait).
- **Memory:** no canvas, no pattern, no gradient cache per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas`.

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f23/bN/`. Nothing big into `/mnt/project-files`.

**Review stills** (small):

```
cd /home/user/scenario/films/23-2037
SECS=c06 node render.mjs --snap 240,241.5,243 --dir $SP/f23/b2/snap --scale .4
```

Then build a contact sheet and **look at it**.

**Video** (full quality): pieces ≤ 20 s, always with `--expose-gc`; never more than one render per builder at a time.

```
SECS=c06 node --expose-gc render.mjs --out $SP/f23/b2/c06_a.mp4 --from 239.38 --to 259
SECS=c06 node --expose-gc render.mjs --out $SP/f23/b2/c06_b.mp4 --from 259 --to 279
```

Then join with `ffmpeg -f concat -c copy` into `$SP/f23/bN/cNN.mp4`.

**Delivery per chunk:**
- video: `$SP/f23/bN/cNN.mp4`; the path goes into the report;
- contact sheet (1 frame/s, small jpg, ≤ 1 MB): `/mnt/project-files/scenario/film-erster-tag/2037/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition) and everything ugly or unclear fixed. At least 3 review rounds. Check: every frame is a poster; sentence = picture; the hero is the brightest thing; you are never cut off except in a deliberate move; text readable on a phone (390 px wide copy); the reserved zones are free; the figures breathe and their arms move naturally.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 cuts (except planned matches; the clip slots are excluded); mafd median ≤ ~0.45; luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams also check against the plate; the lead checks both sides.
5. **Calm rules** (`MOTION.md` §9): 1–2 moving main elements; no still image > 2 s; 1.5–3 s hold after accents; nothing from nowhere; no dissolves, no fade, no slide.
6. **Explainer share** of your chunk as in `shots.md` (± 5 points).
7. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · graphics from world things · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk: calm, smooth, seam, explainer share.
- Kit wishes.
- Open points and deviations from `shots.md`, with the reason.
- Which files you created or changed (so the lead can commit exactly those).
