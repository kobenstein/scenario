# Film 73 · "The First Generation That Won't Die" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

The lead built **c01** (the hook, 0 → `T.G('The date comes from')`) as the quality reference, plus the kit, THE LIFELINE stage, THE STONE
(Leitbild), the seam plates, the end screen, the shot list and stubs for c02–c13. Three builders now build the rest **at the same time**,
about 3–3.5 minutes of picture each. The film is built through to the end with no interim review. Release: Sun 29 Nov 2026, 17:00 Vienna.

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), `<ROOT>bild/kit73_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/73-the-first-generation-that-wont-die/code/` (repo branch `claude/project-thread-i4k2w9`; commit locally,
**never push**). ROOT = `/mnt/project-files/scenario/film-73-wont-die/` (`$F73ROOT`; script files are also in `../skript/`).
`npm install` once in `code/` if `node_modules` is missing (it is git-ignored).

## 0 · Bau-Checkliste Bild — REGELN §13, wörtlich (Pflicht für jeden Builder, im Bericht jeden Punkt mit Messwert/Beleg abhaken)


**Befund (Jakob 24.11., #63):** In den letzten Filmen ist der Bau wieder in Ein-Bild-Szenen gedriftet. Die besten Filme waren eine Mischung aus Szenen und Erklärgrafiken, die **genau das zeigen, was im Skript erzählt wird**. Ziel: „nicht nur eine große Szene mit Zooms, sondern wie ein richtig schöner Motion-Design-Film“.

1. **Ein Bild pro Satz.** Jeder Satz mit neuer Information bekommt ein eigenes Motiv, das genau diese Information zeigt (Zahl, Zitat, Vergleich, Ablauf, Person, Ort). Ein Bild bleibt nur stehen, wenn der Satz nichts Neues sagt. In `shots.md`: jede Zeile = ein Satz, Spalte „zeigt wörtlich“ beschreibt, was der Zuschauer sieht, nicht die Stimmung.
1a. **Zoom ist kein neues Bild.** Zoom, Schwenk oder Fahrt in dasselbe Bild zählt nicht als neues Motiv. Gebraucht werden viele eigene Motive (anderer Ort, andere Person, anderer Moment, eigene Grafik), verbunden durch ein Träger-Element. In `shots.md` Spalte „Motiv neu?“.
1b. **Maßstab Motion-Design-Film, keine animierte Illustration.** Jedes Motiv eigens komponiert; Übergänge als gestaltete Verwandlung (Form wird zur nächsten, Grafik baut sich aus der Szene auf); Typo und Zahlen kinetisch im Takt der Stimme; Rhythmus wechselt zwischen schnellen Folgen und ruhigen Bildern. Abnahme-Frage pro Abschnitt: Würde er als eigenes Motion-Design-Stück bestehen?
2. **Erklärgrafik-Anteil 60–70 %**, gewichtet pro Sekunde Bild: EXPL 1 · MIX 0,5 · WELT/LAND **0** (Kamerafahrt durch die Welt ist keine Erklärung, vorher 0,3) · SZENE 0 · CLIP 0. Steht oben in `shots.md`, auf echtem VO-Timing gerechnet, **vor** dem Animieren. Außerhalb: Shots umbauen.
3. **Szenen tragen Gefühl, Grafiken tragen Verstehen.** Szenisch: Hook, ein Wow-Moment pro Abschnitt, menschliche Momente. Erklärgrafik: jede Zahl, jedes Zitat, jeder Mechanismus. Grafik gern als MIX auf einem Objekt der Szene.
4. **Leitbild nur als Anker** an 3–4 Stellen (Hook, Wende, Pointe, Schluss). Kein „eine Welt“-Film, keine Dauerfahrt durch eine Leitbild-Welt.
5. **Übergänge** über ein Träger-Objekt, keine Blenden; max. ~1 harter Schnitt/min (Obergrenze gegen Hektik, KEIN Ziel „eine Welt“); 1–2 Bewegungen gleichzeitig.
6. **Skills zuerst laden** (Lead und jeder Builder, erster Satz im Brief): `scenario-motion` (Kanalstil, gilt bei Widerspruch), `world-class-motion-design`, `fluid-motion-design`, `motion-director-gates`; für Zahlen-Grafiken `dataviz`. Keine Werbe-Skills (`ad-motion`, `performance-video-ad`, `motion-design-director`). Stil: `stil/STIL-editorial-nacht.md`.
7. **MOTION.md + shots.md** im Film-5-Format, Abschnitt „Nicht wiederholen“ (Welten früherer Filme).
8. **Im Bau-Plan an Jakob** stehen Skill-Liste und geplanter Anteil immer drin.
9. **Abnahme pro Abschnitt:** Kontaktbogen gegen Gates UND Skript: Zeigt jedes Bild den Satz, der gerade gesprochen wird? Vor dem Render messen: Schnitte/min, Bewegungsmaß (calm.py), stille Stellen (<5 %, keine >2 s).


**For this film, concretely:** the stage is **THE LIFELINE** (`X`, a gold line of light on the night ground), not a world. Every sentence
gets the motif in *zeigt wörtlich*; the layer in shots.md is binding (EXPL / MIX / SCENE / CLIP / ANCHOR); keep or raise your explainer
share (see shots.md §4 for each chunk). The Leitbild (`S.stoneWorld`) **only** in the shots
marked ANCHOR (B2: M.11 · B3: E.01, E.12–E.14, A.01–A.02); a camera glide inside an anchor is fine, a ride between places is not. Hard
world changes only where shots.md has **W** (M.11, 4.01, 5.11, E.01). THE ANSWER (`F.answer`) only where the question returns (MOTION.md
§5). Before every render: snapshots every 0.5–1 s + every carrier moment, look at them against the sentence.

## 1 · Who builds what

| builder | chunks | from → to (phrase) | time (provisional) | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'The date comes from' → 'Which brings back' | 0:57.3 – 3:58.7 (181 s) | 1.01–1.17 Kurzweil: out of `plate2032` the name tag, **C1** grows out of the 2032 · +1 year for every year (the end tick slides) · "won't die" = old age stops · not immortal · an accident still · his dates hop · critics (hollow tag) · the analysis run · the de Magalhães quote card · ★ 2459 four centuries along the line (pull back) · in your lifetime / too late · unless AI · a bet on AI — 1.18–1.30 the lab, the cell predicted, ★ SRSF1 lights in the gene row, the mice 778 → 886 (+14%), three caveat tags, no drug, a guess / real, the repair light too slow — 2.01–2.13 the copy: back to the fly, Eon wires the map into a body, ★ WALK / GROOM / FEED, the headline, the critics, no memories / separate walking, **C3** Andregg grows out of the screen — 2.14–2.26 and still: the loop, the uploads quote, 1 mm³, ★ 1,400,000 GB data wall, the copy of you, IS THAT YOU?, your end tick and the copy's dashed line, the cool answer → `plateTwoAnswers` |
| **B2** | c06 c07 c08 c09 | 'Which brings back' → 'And at the very top' | 3:58.7 – 6:50.5 (172 s) | 3.01–3.15 the answers merge → NO · the 2013 dots (56% / 68%) · ★ the crowd that points at each other · you ask · the weight on YES · the 2026 survey: a shorter life without decline, no failing body, no fading mind, 64% · old forever vs healthy — M.01–M.11 **subscribe 1** (many lifelines, grey ends turn gold, a SUBSCRIBE *tag*, never a button) · the fair question (HEALTHY) · the case for no · boredom loop / pleasures · ★ **ANCHOR 2/4 the turn**: the stone, pull back, the town lights up (W) — 4.01–4.19 into one window (W): a life with no end date, oldest alive, ★ the marriage (rings, ≈ 30 years → open), you two walking, paid for, **C4** Gratton out of a segment, 5 careers, your parents' window, the hand-off that never fires, gain / price, still yes? — 5.01–5.09 power and ideas hand over at an end tick, the Planck card, ★ outsiders after a star dies (+8.6%), the line steps up into a ledge → `plateTop` |
| **B3** | c10 c11 c12 c13 | 'And at the very top' → end | 6:50.5 – 10:37.9 (227 s, incl. 5 s quiet + the 15 s end screen) | 5.10–5.25 the ledge → a viewing platform, Beijing (W, silhouettes, the live mic), the two quote cards (interpreter caveat), ★ 150, any president / judge / founder on ledges, who steps aside, the gate, only the wealthy, the weight on YES, the neighbour's dark window — 6.01–6.12 dawn palette, 64 people, not forever / healthy, ★ the poor-health years fill gold (9.6 / 12.4), the price tag, genome $95M → a few hundred $, costs up, the fork — 6.13–6.30 three rule cards, labs can't write them, voters, two terms, Denmark 70, ★ Montana (the clinic door after phase 1, 2% stream), access / risk, blank cards, the cradle, Gavrilov curve, 1 in 5, would you? — E.01–E.14 **ANCHOR 3/4** the stone with 2032 … 2459 in the blank (W), the range, IN A HUMAN: NOT YET, we accept → we work on, the three questions, the plain answer, ★ **ANCHOR 4/4** the old stones light, "We are the first…", **subscribe 2**, `S.endScreen` |

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`, or `$F73FONTS`).
If a statement renders in a sans face, the fonts did not load: stop and say so.

## 2 · Timing (it WILL move: provisional timing = vo-v3 (25.11.) + the checked clip lengths; the real VO comes later)
- `film.mjs` loads `<ROOT>audio/timing.json` when it exists, else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`
  from the newest `<ROOT>vo-vN.txt`; clip slots = `<ROOT>clips-geprueft.json` lengths + .3 s: C1 7.3 s, C3 6.9 s (C3, not C3b), C4 10.0 s).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C3')` →
  `{ start, end }`. Never write seconds. After any VO change: `node tools/anchors73.mjs` (all anchors found) and `python3 tools/shots73.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'If you could stop dying' (hook / M.06 / E.11), 'Would you' (many),
  'Who steps aside' (5.20 / 6.17), 'Want that too' / 'Then subscribe' (M / A2), 'In this scenario' (4.02 / 4.14), "That's the" (4.16 / 4.18),
  'In twenty thirteen' / 'twenty thirteen' (3.03 / 5.22), 'healthy' (many), 'A.I.' is split into two VO lines by the timing tool — anchor
  on the words around it.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT73 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. The renderer only CUTS between entries: use a new entry only for a planned cut (a **W** in shots.md);
  everything else is one draw function that changes by itself (like sc01: stone stage → stage, one view path). Inner chunk boundaries of
  your group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).

## 3 · Seams (lib/f73_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'The date comes from' | `S.plate2032` = `S.draw2032(ctx, t, S.view2032(t, k))`: the lifeline at sheet y 846 (x 150 → 1700, open to 2600, 1985 tag at 150), REPAIR body drawing x 600 (joints gold), the big gold 2032 on its tick x 1040, COPY computer x 1500 with the virtual fly, you x 440; view {960, 666, 1} | c01 (done) | B1 1.01: the name tag on the 2032, the 2032 opens into the C1 plate. Use `S.draw2032(ctx, t, v, q)` with per-element states to take the plate apart without a jump. |
| B1 → B2 | 'Which brings back' | `S.plateTwoAnswers` (`S.PTWO`: REPAIR answer gold at y 450, COPY answer cool dashed at y 650, w 640, centred x 960, both beads trembling in the middle) | B1 2.26 settles into it | B2 3.01 slides the two into one |
| B2 → B3 | 'And at the very top' | `S.plateTop` (`S.PTOP`, `S.topPath()`: the gold line at y 760 steps up into a ledge x 760–1180 at y 430; one figure holds the ledge at x 960; four newcomers wait at x 1330–1630) | B2 5.09 settles into it | B3 5.10: the ledge becomes the viewing platform |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push) and `S.breathe`; the receiving side
continues it before its own move. The stubs already draw the plates at their ends; keep that when you replace them (see `lib/stub73.mjs`).
Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.

## 4 · Kit API (lib/f73_stage.mjs as `X`, lib/f73_kit.mjs as `F`, lib/f73_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **THE LIFELINE (your main stage):** view `{ x, y, s }` · `X.viewPath(t, [[t, view], …])` (monotone, log scale) · `X.ground(ctx, t, v, { lx, ly,
  pool, stars })` (night ground + stars + light pool; pool position in sheet units, move it continuously) · `X.inView(ctx, v, (s) => …)` (draw
  in sheet units; `s` = view scale: divide line widths by it) · `X.layerView(v, d)` (parallax) · `X.toScreen` / `X.toSheet` ·
  `X.lifeline(ctx, t, x0, x1, y, s, { u, from ('centre' | x), w, a, age, ageU, end, lift, open, openTo, col: 'gold'|'cool'|'cream', glow, spark })`
  · `X.yearTag(ctx, txt, x, y, u, s, { size, gold, below })` · `X.label(ctx, txt, x, y, u, o)` (Inter caps, mask wipe) · `X.big(ctx, txt, x,
  y, size, u, o)` (serif statement) · `X.dateTag` · `X.bar(ctx, x, y, w, h, u, { col, horizontal })` (dataviz: thin, 4 px rounded end) ·
  `X.drawPath`, `X.lightLine`, `X.arrow` · `X.LINE_Y` (700, the default line height) · `X.V0`.
- **THE ANSWER:** `F.answer(ctx, t, x, y, w, p, { u, size, cool, tremble, tags, tagU, top, topU, plain, a })` → `{ bead }`.
- **Objects (all take `o.s` = view scale and `o.u` to draw on):** `F.bodyDrawing(ctx, t, x, y, h, { worn, fix, order, dims })` → joints ·
  `F.JOINTS` · `F.headProfile(ctx, t, x, y, s)` → `{ mind }` · `F.computer(ctx, t, x, y, w, { on })` → inner rect · `F.fly(ctx, t, x, y, size,
  { style: 'real'|'virtual', rot, walk, groom, feed, wings })` · `F.drop` · `F.flyBrain(ctx, t, x, y, s, { u, fire, col })` (strands, cached) ·
  `F.cell(ctx, t, x, y, r, { predict, drug, react })` · `F.geneRow(ctx, t, x, y, w, n, { scan, pick })` · `F.mouse(ctx, t, x, y, s, { old, glow })`
  · `F.dots(ctx, t, x, y, { n, cols, gap, r, u, on, col, mark })` (100 = 1 % each) · `F.rings` · `F.house(ctx, t, x, y, w, { lit, roof })` ·
  `F.brainSide(ctx, t, x, y, s, { cube, cubeSize })` · `F.beam` · `F.aiRing(ctx, t, x, y, r, { think })` (the AI is a disc, never a robot) ·
  people: `F.du` (you, yellow coat; poses stand / look / walk / point / reach / lift / sit), `F.person` (everyone else).
- **Cards and text:** `F.paperCard`, `F.dataCard` (kind KNOWN / FORECAST / ESTIMATE), `F.quoteCard(ctx, t, T, { text, credit, spoken: [from,
  to] })` (words light as spoken), `F.verdict`, `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.source(ctx, t, t0, t1, s)`, `F.title`.
- **The Leitbild (ANCHOR shots only):** `S.stoneWorld(ctx, t, v, { crack, crackDrain, drawing, dims, retract, old, town, lit, ghost, you,
  grass, ground, dash })`; `S.HOME` (thumbnail framing), `S.STONE`, `S.ENGRAVE` (the blank after the dash: `ENGRAVE.blank`), `S.CRACK`,
  `S.YOU`, `S.hillY(x)`; `ghost: [{ txt: '2032', a, gold, dy, size }]` writes faint years into the blank (E.01). The turn (M.11): pull the
  view back from the stone (e.g. to `{ x: 1100, y: 760, s: .6 }`) and raise `town` / `lit`. `S.endScreen(ctx, t, T)`, `S.END_TILES`, `S.END_VIEW`.
- **Clips:** `F.clipPlate(ctx, t, T, 'C3', { from, morph, dark, credits, label })` grows from `from` (a rect or [cx, cy, r]) into
  `F.CLIP_RECT` and back; lower third above the plate from `F.CLIPS` (`<ROOT>clips-geprueft.json` overrides it when it lands). Frames:
  `/tmp/claude-0/f73/clips/<id>/f00001.jpg …` (30 fps, extract with ffmpeg from `<ROOT>clips/Cn.mp4` once checked); until then a marked
  placeholder shows (never ship it). C1 Kurzweil (MIT SHASS, 2025, 7.3 s), C3 Andregg (Progress by Fifty Years, 2026, 6.9 s), C4 Gratton
  (London Business School, 2026, 10.0 s); each clip grows out of a carrier (the 2032, the screen, a career segment) and goes back into it.
  **One frame design for all clips:** the plate shows only the top 5/6 of the source (`F.CLIP_CROP`, centred, top-aligned), because C4 has
  burned-in captions in the bottom 180 px for the whole clip; never override `crop` per clip, never enlarge the plate past `F.CLIP_RECT`.
  Our lower third (name · role · year … ORIGINAL FOOTAGE · channel) sits above the plate.
- **Strings:** `F.SOURCES` (text-v2 EINBLENDUNG / ZITATKARTE lines, faktenzettel figures). Use the keys, never retype a figure; if vo-v3 or a
  fact check changes one, say so in your report (the lead updates the table). Long source lines break into two lines by themselves.

## 5 · Rules (from the owner; see MOTION.md §3–§6)
- A motion-design film, not a world: every picture shows its sentence; objects turn into the next object, grow out of the line and sink
  back; 1–2 moving things; nothing from nowhere, no ghost fades, no crossfade, no black, nothing frozen. Big area changes ≥ 1.6 s
  (sineIO), small hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). One ★ per chunk.
- Colour code: GOLD = life / health, ONE hero light per frame · CREAM = text, drawings, end ticks · COOL = machines / AI / the copy · AGE =
  decline · LAMP = windows · the yellow coat = only you. Never red; death only as an END TICK or the stone (no skulls, crosses, coffins).
- No logos, no flags, no real faces outside the clips (Beijing: silhouettes; the quotes as cards with the interpreter caveat), no AI images,
  no robots, no 3D game look. No QR, no sponsor. Nothing from MOTION.md §6 "Nicht wiederholen" (film 20: clocks, needle, reset button,
  kitchen table of four generations; film 69: blueprint grid, sea world, HUD).
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s. Sources 22 px at y 880 (`F.source`).
- Canvas trap (@napi-rs/canvas = Skia): a `shadowBlur` between 0 and ~0.5 px draws a hard shadow copy that IGNORES globalAlpha
  (a faded outline suddenly shows at full strength). Scale glow to 0 → set `shadowBlur = 0` below .5 (X.drawPath / F.* already do).
  And `beginPath()` before every path: the current path is not part of save/restore.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs` of your own). Kit/world wishes: a local helper in your
  file, or ask the lead in your report. Never edit `lib/f73_*.mjs`, `lib/kit.mjs`, `film.mjs`, `tools/`. No videos or large files in the repo;
  renders go to `/tmp/claude-0/f73/<you>/`; only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole
  `/mnt/project-files/`; re-read a file ~10 s after writing it).

## 6 · Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 60,61,62 --dir /tmp/claude-0/f73/b1/snap --scale .5        # stills (every 0.5–1 s + every carrier)
python3 tools/sheet.py /tmp/claude-0/f73/b1/snap <ROOT>bild/c02_kontakt.jpg 4 400        # contact sheet (< 1 MB)
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f73/b1/c02.mp4 --from 57.3 --to 115.6 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f73/b1/c02.mp4 --scale 1280:720 --sub 170   # cuts/min ≤ 0.9 (only your W), mafd median ≤ 0.43
python3 tools/still73.py /tmp/claude-0/f73/b1/c02.mp4                            # still < 5 %, no run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f73/b1/c02.mp4 57.3                         # no LURCH > 12 except planned cuts, no POP
SECS=c05,c06 node tools/seam.mjs --at <T0>                                        # your seams (and your inner chunk boundaries)
node tools/anchors73.mjs                                                          # all anchors found
```
Render speed (lead, c01): ~3.6 s per video second at 1080p30 on this machine (4 cores), ~1 s at scale .5. (Times in these commands are
for rendering only; get them from `chunkRanges`, never put them in scene code.)

## 7 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, anchors); any string that differs from `F.SOURCES`; kit wishes; open issues; contact sheet path
(`<ROOT>bild/<chunk>_kontakt.jpg`, < 1 MB).
