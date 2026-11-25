# Film 71 · "Max Tegmark's 12 Endings for AI" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

The lead built **c01** (hook + ENDING 12 Conquerors, 0 → `T.G('The next ending has no morning')` = 156.57 s) as the quality reference,
plus the kit, THE YARD stage, the door row and counter HUD, the morning-room recipe, the Leitbild, the seams, the shot list and stubs for
c02–c13. Three builders now build the rest **at the same time**, about 3 minutes of picture each. The film is built through to the end
with no interim review. **The real VO is done** (`<ROOT>audio/timing.json`, 706.01 s; last word 687.01 s; end screen 691–706 s).

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), the c01 contact sheet `/tmp/claude-0/f71/c01_kontakt.jpg` and `<ROOT>text-v2.md` [BILD] lines of your stations.
Code: `/home/user/scenario/films/71-max-tegmarks-12-endings-for-ai/code/` (branch `claude/project-thread-pmgo6l`; commit locally, **never
push**: the lead / coordinator pushes). ROOT = `/mnt/project-files/scenario/film-tegmark/` (`$F71ROOT`). **Never touch `code/audio/`**
(the sound step owns it).

## 0 · Bau-Checkliste Bild — REGELN §13 (Pflicht, im Bericht jeden Punkt mit Messwert/Beleg abhaken)
1. **Ein Bild pro Satz.** Every sentence with new information gets its own motif showing exactly that information. shots.md: one line = one sentence, column *zeigt wörtlich*.
1a. **Zoom ist kein neues Bild.** Column *neu?*; many own motifs, linked by a carrier.
1b. **Motion-design film, not an animated illustration.** Transitions as designed transformations; type and numbers kinetic on the voice; rhythm alternates fast runs and calm holds.
2. **Explainer share 60–70 %**, weighted per second: EXPL 1 · MIX .5 · ANCHOR 0 · SCENE 0 · CLIP 0. Film: 63.0 % (shots.md §2); keep or raise your chunks' share (shots.md §4). A shot's layer in shots.md is binding.
3. **Scenes carry feeling, graphics carry understanding.** Every number, quote and mechanism is EXPL or CLIP; the mornings are SCENE.
4. **Leitbild only as anchor**, only in the shots marked ANCHOR (B1: 8.11–8.13 the turn · B3: 1.01 the golden door, S.24–E.01).
5. **Transitions** over a carrier, no blends; ≤ ~1 hard cut/min; hard world changes only where shots.md has **W**; 1–2 movements at a time.
6. **Skills first** (see above).
7. **MOTION.md + shots.md** are the plan; "Nicht wiederholen" = MOTION.md §6.
8. Skill list and share are in the plan.
9. **Acceptance per chunk:** contact sheet against gates AND script (does each picture show the sentence being spoken?); measure cuts/min, calm.py, still spots (< 5 %, none > 2 s).

## 1 · Who builds what

| builder | chunks | from → to (phrase) | time | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'The next ending has no morning' → 'And if nobody can be trusted' | 2:36.6 – 5:48.9 (192 s) | ENDING 11 Self-Destruction (no machine; 85 SECONDS on a number line, no dial) · ENDING 10 Zookeeper (morning behind glass, enclosures, the agent-only forum, READ ONLY, the uniforms) · ENDING 9 1984 (the walk to work, the face frame, Hong Kong cameras → dot field 60,000, TO STOP AI WATCH THE CHIPS, the chip parks in the HUD) · ENDING 8 Descendants (family photo, quiet morning, the clipping → **C4** → A NEW SPECIES / AN ASSISTANT) · **ANCHOR the turn** "From here on, you live" (★) · ENDING 7 Enslaved God (the cage, the split room, the stranger with the key, Genesis Mission, 17 labs, NO CAGE · NO GOD, WHO HOLDS THE KEY?) · **M subscribe 1** (the key turns; the key parks in the HUD) → `S.plateRow(6)` |
| **B2** | c07 c08 c09 c10 c11 | 'And if nobody can be trusted' → 'Egalitarian Utopia' | 5:48.9 – 8:55.5 (187 s) | ENDING 6 Reversion (pull the plug, the wooden window, 24 % → 58 % waffle, SCREENS NOT AI, the throne) · ENDING 5 Benevolent Dictator (the calm light, three sectors, the rule book behind glass, the balance, UAE 50 % building) · ENDING 4 Gatekeeper (guard + workshop, the capped helper, the ban bill, **the eye returns** ★ SPOTTED BY AI GUARDS, **the chip returns** with two tracks to doors 9 and 4, the hand) · ENDING 3 Libertarian Utopia (RENT RECEIVED, the lease, the register, machines paying pennies, the fence, the shimmer) · ENDING 2 Protector God (the brake, the outline behind the cloud, the age guess, I AM A MACHINE, the first SWITCH PUSHED BACK ★, the survey ranking) → `S.plateRow(1)` |
| **B3** | c12 c13 | 'Egalitarian Utopia' → end | 8:55.5 – 11:46.0 (171 s, incl. the 15 s end screen) | **ANCHOR the golden door opens** (1.01) · three at one table · the morning from the start (the hook kitchen comes home) · Malta dots, FREE FOR 1 YEAR, THE SMALLEST VERSION · the catch (Tegmark's table, PROPERTY ABOLISHED, the quote) · the destination and the open roads · **CLOSE**: the twelve from above, WHICH ENDING? NO SINGLE ONE YET · switch 1 speed → **C5** Altman → PACE IT / THEN CHINA LEADS · switch 2 the chip (shield / eye) · switch 3 shared rules (about 30 lit, USA · CHINA grey) · switch 4 the key (PROMISED · NOT BINDING) · **the five names** ★ · LABS · GOVERNMENTS · VOTERS · the headline → **C6** · **ANCHOR the end**: DECIDED THIS YEAR · subscribe 2 · `S.endScreen` (691–706 s) |

**Anchors in your range (the hard ones):** B1 the turn (8.11–8.13: 'That was the dark end' → 'The question is how'), B3 the golden door
(1.01) and the five names (S.17: CONQUERORS · 1984 · ENSLAVED GOD · GATEKEEPER · EGALITARIAN UTOPIA; Libertarian Utopia does NOT light).
**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo; if a statement renders in a sans face, stop and say so.

## 2 · Timing
- `film.mjs` loads `<ROOT>audio/timing.json` (real VO). **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end),
  `T.GW(...)` (words), `T.clip('C4')` → `{ start, end }`. Never write seconds in scene code. After any change: `python3 tools/shots71.py`
  (it warns for every phrase that is not found).
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'You wake up' (every morning), 'People do' (9.04 / 4.17), 'For anyone'
  (hook / 1.06), 'This channel exists' / 'Want that too' / 'Then subscribe' (M / A: nth 1), 'So which ending are we heading for' (hook / S: nth 1),
  "It's being decided this year" (hook / S.25: nth 1), 'In January' (11.04 / 10.05), 'In May' (8.06 / 1.07), 'In July' / "July's breakout".
- Your entry list: `export default (T, R) => [{ t, draw(ctx, t), print: F.PRINT71 }, …]`; R = `{ a, b, id, first, plate }`. Entries
  outside [R.a, R.b) are dropped. The renderer only CUTS between entries: one draw function per continuous take (sc01 has 2 entries for
  157 s). Inner chunk boundaries of your group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next.
- **Clip slots (real cuts, 25.11.):** C1 39.92–47.28 · C2 129.15–137.27 · **C4 279.96–286.42 (B1)** · **C5 602.51–610.62 · C6 662.40–670.66 (B3)**.
  The sound step's in/out points: `code/audio/cut_clips.json` (read only). Frames: `python3 tools/f71_clips.py C4` → `/tmp/claude-0/f71/clips/C4/`
  (already extracted; frame 1 = the slot start = the first frame of the cut). C3 is reserve only.

## 3 · Seams (lib/f71_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'The next ending has no morning' | `S.plateRow(ctx, t, T, 11)`: the yard row of twelve at `S.plateView` (960/560, creep), door 11 lit with its beam and the pool under it, levers and tags on, you at `S.ROW_YOU`, the HUD (12/12, the eye parked at door 4) | c01 (done) | B1 11.01: door 11 opens out of it |
| B1 → B2 | 'And if nobody can be trusted' | `S.plateRow(…, 6)` (door 6 lit; the key parked in the HUD) | B1 M.04 settles into it | B2 6.01 out of it |
| B2 → B3 | 'Egalitarian Utopia' | `S.plateRow(…, 1)` (the gold door lit; eleven tags) | B2 2.15 settles into it | B3 1.01 opens the gold door out of it |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push); the receiving side continues the push
before its own move. The stubs already draw the plates; keep that when you replace them (`R.plate` tells you which). Check:
`SECS=c01,c02 node tools/seam.mjs --at 156.57` (median Δ should be < 1; c01's side is done).

## 4 · Kit API (`import * as F from '../lib/f71_kit.mjs'`, `import * as S from '../lib/f71_world.mjs'`, `E` = lib/f10_editorial.mjs)
- **Stage and camera:** views `{ x, y, s }` · `F.viewPath(t, [[t, view], …])` · `F.inView(ctx, v, () => …)` · `F.toScreen(v, x, y)`, `F.fromScreen` ·
  `F.yard(ctx, t, v, { lx, ly, pool, rails })` · `F.V0`. Overlays in screen px that ride the camera: copy `ref / inRef / refPt` from sc01.
- **Doors and the row:** `F.door(ctx, t, x, y, w, h, { col, lit, beam, open, leafA, inner(c, box), frame, a })` (a closed door is a slab of light;
  the leaf shows only while it swings; `open: undefined` = no leaf) · `F.ROW`, `F.rowX(n)`, `F.rowDoors` · `S.rowScene(ctx, t, T, { n, v, lit, a, col,
  scale, beam, open, inner, doorOpts, pos, tags, levers, leverAng, knob, you, youAt, hud, parked })` (the workhorse: the row with levers at
  `S.LEVER_Y`, mini tags, you, the HUD) · `S.rowLever`, `F.miniTag(ctx, x, y, u, n)`.
- **Switches:** `F.track(ctx, pts, u, o)`, `F.bez`, `F.fork(ctx, t, x0, y, xs, x1, ux, uy, { bladeCol, litCol })`, `F.lever(ctx, t, x, y, ang, L, o)`,
  `F.hand(ctx, x, y, ang, L, o)`, `F.switchTag(ctx, t, x, y, date, u, o)` (one per station: SWITCH TOUCHED: <date>; 2.10 = SWITCH PUSHED BACK).
  Every station's tag lands on its door's mini tag by itself in the HUD (`F.counterTimes(T).sign[n]`); fly your big tag there at that moment.
- **Explainer objects:** `F.boxField` (agent lights; 4.11 brings the HUGGING FACE box back: copy sc01's BOX2 call) · `F.agentGlyph` · `F.guardEye` ·
  `F.qmark` · `F.chip(ctx, t, x, y, s, { ping })` · `F.keyGlyph(ctx, t, x, y, s, { rot, glint })` · `F.msgCard` · `F.signCard` · `F.namePlate` ·
  `F.scaleAxis` · `F.dot` · `F.waffle(ctx, t, x, y, cell, cols, rows, o)` · `F.barPair` · `F.building(ctx, t, x, y, cols, rows, cell, o)` (5.08: the
  hook's government building returns) · `F.chatWindow` · `F.bigCount` · `F.big`, `F.label`, `F.goldText`, `F.dateTag`, `F.source(ctx, t, t0, t1, s)`,
  `F.lightLine`, `F.title`, `F.scenarioTag(ctx, u)`. Strings: `F.TXT.<station>` (keys hook, e12 … e1, end; text-v2 [BILD] lines after the iMac check). Data colours: `F.DATA`.
- **Counter HUD:** `F.counterHud(ctx, t, T, { a, parked })` in every yard frame (it hides itself in clip windows). Pockets `F.hudPocket('eye' |
  'chip' | 'key')`, phrases in `F.HUD_MARKS` (eye: 'That belongs to a better ending' → "Hugging Face's own AI guards"; chip: "It's also a tool
  this ending would need" → 'And that chip tracking'; key: 'Then subscribe' → 'And the key: who owns'). While your own flying copy is on
  screen pass `parked: '<id>'` (or false) so the HUD does not draw it twice.
- **Mornings:** `F.scenarioTag`, `S.roomThroughDoor(ctx, t, box, Z, rc, o)` (fly into a door slit to `S.ZEND`), `S.rooms` (kitchen, bedroom; o.fed,
  o.anyone, o.glass, o.dim, o.you). New rooms (wooden window, street, split room, bedside table …) go into your own `lib/bN_rooms.mjs` with
  the same signature; you in the room = `F.du(ctx, x, y, h, { hood: false, pose, walk, view, dir, look, light })`.
- **Leitbild (ANCHOR shots only):** `S.leitbild(ctx, t, { v, slots(i) → { open, inner, lit }, beams, you, title, which, stars })`, `S.thumbSlot(i)`,
  `S.slotDoor(i)`, `S.GOLD_SLOT`, `F.THUMB_ORDER` (rank per slot), `S.endScreen(ctx, t, T)` + `S.END_TILES` (B3: from duration − 15).
- **Clips:** `F.clipPlate(ctx, t, T, 'C4', { from, morph, dark, label })` grows from `from` (a rect or [cx, cy, r]) into `F.clipRect(id)` and back;
  lower third from `F.CLIPS`. film.mjs preloads the frames (`film.prepare`). Framing is done in `tools/f71_clips.py`: C4 = Tegmark's
  tile only; C5 = sponsor bar cropped away (never show it); C6 = a 1.6× crop on Tegmark (lower third: Max Tegmark · Pro-Human AI event · Sept 2026).
  Every clip grows out of a carrier (shots.md: the clipping, the tag of switch 1, the headline) and goes back into one.

## 5 · Rules (see MOTION.md §3–§6)
- Every picture shows its sentence; objects turn into the next object; nothing from nowhere, no ghost fades, no crossfade, no black,
  nothing frozen. Big area changes ≥ 1.6 s (sineIO), small hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). One ★ per chunk.
- **The morning recipe:** SCENARIO tag → the station's door opens a crack → fly into the slit → the room → one telling object on the word →
  back out through the same door (or the room's object becomes the next explainer). Never more than ~12 s of SCENE in a row.
- **Colour code:** GOLD only for the best ending / hope (the gold door, rank 1); CREAM = text and switch tags; COOL = machines; EMBER only as
  a door's own light; LAMP = people's windows; the yellow coat = you. Never red as a warning, never an ink stamp, never a clock dial, no map
  hero (waffles / dot fields), no logos, no flags, no real faces outside clips, no robots with faces.
- **Clip text:** C1 says "lost control **over** AI systems" — any quote on screen uses "over". Subtitles for clip wording:
  `<ROOT>audio/untertitel/subtitles.srt`.
- Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer), held ≥ 1.5 s; nothing important below y 880; sources
  22 px at y 880 (`F.source`). S.12 says ABOUT 30 COUNTRIES (the VO was fixed to "About thirty countries", 25.11.).
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs`). Kit/world wishes: a local helper in your file, or
  ask the lead in your report. Never edit `lib/f71_*.mjs`, `film.mjs`, `tools/`, `code/audio/`. No media in the repo; renders and contact
  sheets go to `/tmp/claude-0/f71/<you>/` — never to the network mount.

## 6 · Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 157,158,160 --dir /tmp/claude-0/f71/b1/snap --scale .5         # stills (every 0.5–1 s + every carrier)
SECS=c02 node render.mjs --out /tmp/claude-0/f71/b1/c02.mp4 --from 156.57 --to 184.15 --scale .5
python3 tools/calm.py /tmp/claude-0/f71/b1/c02.mp4 --scale 1280:720       # cuts/min ≤ 0.9 (only your W), mafd median ≤ 0.43
python3 tools/still71.py /tmp/claude-0/f71/b1/c02.mp4                     # still < 5 %, no still run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f71/b1/c02.mp4 156.57               # no LURCH > 12 except planned cuts, no POP
SECS=c01,c02 node tools/seam.mjs --at 156.57                              # your seams and inner chunk boundaries
python3 tools/shots71.py                                                  # all phrases found, share
```
(Times in these commands are for rendering only; take them from `chunkRanges`, never put them in scene code.)

## 7 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, shots71 warnings); any string that differs from `F.TXT`; kit wishes; open issues; contact sheet path
(`/tmp/claude-0/f71/<you>/<chunk>_kontakt.jpg`).
