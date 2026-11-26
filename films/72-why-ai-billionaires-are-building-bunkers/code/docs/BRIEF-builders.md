# Film 72 · "Why AI Billionaires Are Building Bunkers" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

The lead built **c01** (the hook, 0 → `T.G('There are three obvious suspects')`) as the quality reference, plus the kit, THE GROUND LINE
stage, THE VALLEY (Leitbild A2), THE LIST, the seam plates, the Earth at night + end screen, the shot list and stubs for c02–c13. Three
builders now build the rest **at the same time**, about 3 minutes of picture each. The film is built through to the end with no interim
review. Release: Mon 7 Dec 2026, 17:00 Vienna.

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), `<ROOT>bild/kit72_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/72-why-ai-billionaires-are-building-bunkers/code/` (repo branch `claude/project-thread-xh9kl4`; commit
locally, only your own files, **never push**). ROOT = `/mnt/project-files/scenario/film-bunker/` (VO `vo-v4.txt` is final; changes in
`aenderungen-v4.md`; figures only from `faktenzettel.md`; `faktencheck.md` has no MB points, its KB1–KB8 are in §5 below).
`npm install` once in `code/` if `node_modules` is missing (it is git-ignored). `code/audio/` belongs to the sound step: never touch it.

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

**For this film, concretely:** the stage is **THE GROUND LINE** (`X`, night sky above, night earth below, one cream line at `X.LINE_Y`
600), not a world. Every sentence gets the motif in *zeigt wörtlich*; the layer in shots.md is binding (EXPL / MIX / SCENE / CLIP /
ANCHOR); keep or raise your explainer share (shots.md §4 per chunk; film 67.4 % on the real VO). The Leitbild (`S.valleyWorld`) **only** in
the shots marked ANCHOR (B3: 5.10, 5.12–5.13, E.01–E.02, E.09, then the Earth at night E.11–A.04 + end screen); a camera glide inside an
anchor is fine, a ride between places is not. Hard world changes only where shots.md has **W** (B1: 1.08 Kauai · B2: 4.01 the resort).
THE LIST (`F.list`) only where the question returns (MOTION.md §5). Before every render: snapshots every 0.5–1 s + every carrier moment,
look at them against the sentence.

## 1 · Who builds what (real VO timing, `<ROOT>audio/timing.json`)

| builder | chunks | from → to (phrase) | time | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'There are three obvious suspects' → 'Ask the people who sell them' | 0:56.4 – 3:39.2 (163 s) | 1.01–1.28 the list writes rows 1–3, row 4 a bar · THE BOMB station: the door filled with concrete is real → gold dot → Kauai outline (**W**) · Zuckerberg "a little shelter … like a basement" (quote card) · the owners don't love the word (tag) · **C1** Altman (Theo Von, 2025) grows out of a studio lamp and back into it · BOMBS · NOT AI (+ the quote line with "just", KB1) · sellers' old reasons (war, pandemics) · row 1 REAL, BUT OLD · this year AI added to the makers' list · row 2 lights — 2.01–2.25 the machine: the safety report (100+ experts, cyberattacks) · the disc grows SMARTER THAN ANY OF US · a bunker is built for things that pass (storm, fallout, war drain away) · that machine doesn't pass · the door has to open: still out there · if it turns out well nobody needs one · Altman 2023 "None of this is gonna help" · "optional" (the hook's quote card returns) · doubts / near or far · build it right: OUT HERE · NOT DOWN THERE · row 2 CROSSED OFF · why still building → `plateBunker` |
| **B2** | c06 c07 c08 | 'Ask the people who sell them' → 'But follow the trail' | 3:39.2 – 6:26.8 (168 s) | (3.01–3.04 are B1's end: Harris intro, **C2** at 3:26.5 sits in c05) · 3.05–3.29 the sellers: the bunker clock fills (WEEKS · MONTHS · A FEW YEARS, MAKERS' OWN CLAIMS) · every bunker is a clock: the levels drain · a major AI incident (not robots): banks, internet, power go dark · the router: 13 NOV 2026, takeoffs across America stop, MORE THAN 4 HOURS, no AI · the planes fly again · row 3 half strike STAYS · FOR A WHILE · fuel, filters, people · who do they answer to? row 4 flickers — 4.01–4.14 the resort (**W**), **C3** Rushkoff out of the window and back into a banknote · once money is worthless · THE EVENT · the angry mobs · why obey · locks on the food, collars, ROBOTS AS GUARDS (words only) · his answer, eye rolls — 4.15–4.31 his account (unnamed, investors not builders) · new floor plans: ANTI-MUTINY ★, DETENTION AREAS · the companies rehearse the day after · Gallup 71 % vs 53 % · insurance / hobby · the owners: storms, bombs · drills are practice → `plateBoard` |
| **B3** | c09 c10 c11 c12 c13 | 'But follow the trail' → end | 6:26.8 – 9:55.0 (208 s, incl. the quiet walk after 9:36 and the 15 s end screen from 9:40) | 5.01–5.14 the thread runs GUARDS → LOCKS → MUTINY PLANS; storm ✗ bomb ✗ machine ✗; BUILT AGAINST PEOPLE · ★ **ANCHOR the turn**: row 4 peels → US, circled → the valley; the gains to a few · you among the lanterns · from behind that door — M.01–M.04 **subscribe 1** (both sides of the door; a SUBSCRIBE *tag*, never a button) — 5.15–5.45 like friends · in people and relationships · not a thicker door: a world nobody wants to storm · Switzerland (a place for every resident, more places than people) · wine cellar / party room · Helsinki (playgrounds, pools) · a hiding place vs a society · a bunker against people never fits · can't be poured in concrete · two open cards · **C2b** Harris out of card 1 · S. 5518 (AT LEAST 75% · 26 WEEKS · NOT PASSED) · Microsoft's promise (VOLUNTARY) · that world isn't built · lawmakers, companies, voters — E.01–E.12 **ANCHOR the end**: back to the hatch · the fear of everyone outside · a few win everything isn't safe · the lanterns become the Earth at night · you can't build a bunker for 8 billion · **subscribe 2**, `S.endScreen` |

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`).
If a statement renders in a sans face, the fonts did not load: stop and say so.

## 2 · Timing (real VO: `<ROOT>audio/timing.json`, 594.98 s; last word 575.98 s; end screen 579.98–594.98 s)
- `film.mjs` loads `<ROOT>audio/timing.json` (else `data/provisional_timing.json`). Clip slots (= clip length + .3 s): **C1** 93.77–101.38,
  **C2** 206.51–212.13, **C3** 288.10–298.36, **C2b** 497.18–502.98 (`T.clip('C2b')`).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C3')` →
  `{ start, end }`. Never write seconds. After any VO change: `node tools/anchors72.mjs` (all anchors found) and `python3 tools/shots72.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'This channel exists' / 'Want that too' / 'Then subscribe' (M / A2),
  'the machine' (many), 'a bunker' (many), 'that door' (H / 5.13 / E.01), 'Or a bomb' vs 'The bomb'. 'A.I.' and 'A.G.I.' are split by the
  timing tool into separate words — anchor on the words around them.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT72 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. The renderer only CUTS between entries: use a new entry only for a planned cut (a **W** in shots.md) or a
  clip; everything else is one draw function that changes by itself (like sc01: valley → ground line → sky → board → plate, one view path;
  several entries may share the same draw = still one take). Inner chunk boundaries of your group are yours: make the frame at `R.b` of
  one chunk equal the frame at `R.a` of the next (seam.mjs proves it).

## 3 · Seams (lib/f72_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'There are three obvious suspects' | `S.plateList` = `S.drawList(ctx, t, S.viewList(t, k))`: THE LIST centred in the sky (`S.PLIST` x 960, y 350, s .8) over a low ground line, view {960, 470, 1}; rows `S.LIST_PLATE_ROWS`: 1 and 3 empty (numbers faint), 2 THE MACHINE with a ?, 4 the redaction bar | c01 (done) | B1 1.01: row 1 writes THE BOMB. Pass your own `rows` to `S.drawList(ctx, t, v, { rows })` to change rows without a jump. |
| B1 → B2 | 'Ask the people who sell them' | `S.plateBunker` (`S.PBUNK`: the hatch shut at x 700, shaft + ladder, one long room x 640–1500 with EMPTY shelves, a thin time axis under it at y 1010, not yet labelled; view {1040, 690, .96}) | B1 3.04 (after C2) settles into it | B2 3.05: the shelves fill, the axis gets its labels (`S.drawBunker(ctx, t, v, { shelves, scale, full, head, marks, people, top })`) |
| B2 → B3 | 'But follow the trail' | `S.plateBoard` (`S.PBOARD`: three evidence cards pinned left → right GUARDS · LOCKS · MUTINY PLANS (`F.SOURCES.trail`), a fourth pin empty at x 1580, y 340; no thread yet; view {960, 500, 1}) | B2 4.31 settles into it | B3 5.01: the thread runs pin to pin (`S.drawBoard(ctx, t, v, { lit, top: (ctx, pins) => … })`) |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push) and `S.breathe`; the receiving side
continues it before its own move. The stubs already draw the plates at their ends; keep that when you replace them (see `lib/stub72.mjs`).
Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.

## 4 · Kit API (lib/f72_stage.mjs as `X`, lib/f72_kit.mjs as `F`, lib/f72_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **THE GROUND LINE (your main stage):** view `{ x, y, s }` · `X.viewPath(t, [[t, view], …])` (monotone, log scale) · `X.ground(ctx, t, v,
  { lx, ly, pool, stars, earth, lineY, cut: { x0, x1, depth, u }, line })` (night sky + earth + the line + light pool; `cut` opens a section
  into the earth with strata) · `X.inView(ctx, v, (s) => …)` (draw in sheet units; `s` = view scale: divide line widths by it) ·
  `X.layerView(v, d)` (parallax) · `X.toScreen` / `X.toSheet` · `X.section`, `X.earth`, `X.groundLine` · `X.label(ctx, txt, x, y, u, o)`
  (Inter caps, mask wipe) · `X.big(ctx, txt, x, y, size, u, o)` (serif statement) · `X.dateTag` · `X.bar(ctx, x, y, w, h, u, { col:
  'gold'|'cool'|'concrete'|'cream', horizontal })` (dataviz: thin, 4 px rounded end) · `X.drawPath`, `X.lightLine`, `X.arrow` · `X.LINE_Y`.
- **THE LIST:** `F.list(ctx, t, x, y, { u, s, title, fold, rot, rows: [{ num, write, q, lit, strike, kind, verdict, vu, redact, peel, ghost,
  circle, big, text }] })`, `F.LIST` (w 860, head 132, row 104), `F.SOURCES.listTitle`, `F.SOURCES.verdicts`. Verdicts are rising words
  (`F.verdict`), never stamps. Row mechanics: MOTION.md §5.
- **Objects (all take `o.s` = view scale and `o.u` to draw on):** `F.hatch(ctx, t, x, y, w, { tilt, open, glow, ladder, collar, yaw, a })`
  → `{ lip, mouth, top }` (round, side view; never frontal, no wheel) · `F.bunker(ctx, t, x, y, { depth, shaftW, wall, room: { x0, x1, h },
  rooms, light, door, ladder, shelves, people, a })` → `{ shaft, room, door }` · `F.supplyClock(ctx, t, x, y, w, { scale, full, head, marks })`
  (levels on a time axis, never a dial) · `F.floorPlan` · `F.evidenceCard(ctx, t, x, y, txt, { rot, lit })` → `{ pin }` · `F.thread` ·
  `F.lamp` (returns a pool rect = a clip plate's `from`) · `F.house(ctx, t, x, y, w, { shelter, use: 'wine'|'party' })` · `F.rockHall(ctx,
  t, x, y, { use: 'play'|'pool', people, full })` · `F.dataCentre` · `F.glassRoom(ctx, t, x, y, w, h, { n, leave })` · `F.vignette(ctx, t,
  'desk'|'table'|'child', x, y, h, { beam, label, text, size })` · `F.aiDisc(ctx, t, x, y, r, { think, warm, reach, bright, a })` (the AI is a
  disc, never a robot) · `F.beam` · `F.slab`, `F.stipple` (concrete) · `F.glowDot(ctx, kind 'gold'|'cool'|'cream', …)` (pre-rendered sprites).
  People: `F.du` (you, yellow coat; poses stand / look / walk / point / reach / sit), `F.person` (everyone else), `F.lanternPerson`,
  `F.lanternRow(ctx, t, x0, x1, y, n, { h, u, seed, dir })`.
- **Cards and text:** `F.paperCard`, `F.dataCard`, `F.quoteCard(ctx, t, T, { text, credit, spoken: [from, to] })` (words light as spoken),
  `F.badge` (NOT PASSED / VOLUNTARY: a word badge, no stamp), `F.verdict`, `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.source(ctx, t, t0,
  t1, s)`, `F.title`.
- **The Leitbild (ANCHOR shots only):** `S.valleyWorld(ctx, t, v, { flat, open, glow, crowd, row, you, cut, hatch, earth, lock, under, over,
  lx, ly, pool })` (`flat` 0 = the thumbnail slope, 1 = THE GROUND LINE: the morph used in H.02 and backwards at 5.10 / E.01); `S.HOME`
  (thumbnail framing), `S.HATCH_L/S`, `S.YOU_L/S`, `S.hatchAt(f)`, `S.youAt(f)`, `S.edgeY(x, f)`. The end: `S.earthNight(ctx, t, { cx, cy, r,
  rot, lights, dawn, a })`, `S.END_EARTH`, `S.endScreen(ctx, t, T)`, `S.END_TILES` (end screen from `T.duration − 15`).
- **Clips:** `F.clipPlate(ctx, t, T, 'C3', { from, morph, dark, credits, label })` grows from `from` (a rect or [cx, cy, r]) into
  `F.CLIP_RECT` and back; lower third "NAME · role · year · ORIGINAL FOOTAGE · channel" from `F.CLIPS` (`<ROOT>clips-geprueft.json`
  overrides name/year/channel). C1 Altman (This Past Weekend w/ Theo Von, 2025, 7.6 s) · C2 Harris (Modern Wisdom, 2026, 5.6 s) · C3
  Rushkoff (The Smart Cookies Podcast, 2026, 10.3 s; webcam, split screen in the first 5 s) · C2b Harris (same episode as C2, 5.8 s).
  **C2 and C2b: the MODERN | WISDOM bug bottom left stays visible (`crop: 1`, never crop it away).** C2b follows C2's frame so the voice is
  recognised (5.35). Each clip grows out of a carrier (studio lamp, the clock, the resort window, card 1) and goes back into it. Frames:
  `/tmp/claude-0/f72/clips/<id>/f00001.jpg …` (30 fps; the lead's final assembly extracts them); until then a marked placeholder shows.
- **Strings:** `F.SOURCES` (text-v2 EINBLENDUNG / ZITATKARTE lines, faktenzettel figures, vo-v4 + fact check applied). Use the keys, never
  retype a figure; if you need a string that is not there, say so in your report.

## 5 · vo-v4 + fact check (already in the kit; use the keys)
- vo-v4: "Bombs. Not A.I." (1.18, `SOURCES.bombsNotAI`) · 'Once money is worthless. They called that day "the Event."' (4.05–4.06,
  `SOURCES.worthless`) · Harris "Write laws" is the clip **C2b** after "Tristan Harris has the shortest answer:" (no quote card) · "stopped
  takeoffs across America" · the bill "at least three quarters".
- **KB1** Altman's on-screen line WITH "just": `SOURCES.altman25` (… not because of AI, but just because … people are dropping bombs …).
- **KB2** the FAA stop: **MORE THAN 4 HOURS** (`SOURCES.faa`, `faa2`), never "about 4.5".
- **KB3** the bill card: **AT LEAST 75% · 26 WEEKS · NOT PASSED** (`SOURCES.bill75`, `billCard`; source line `billSrc` with "once a
  labor-market disruption is declared").
- **KB4** `SOURCES.notPassedSrc`: "S. 5518: NOT PASSED · IN THE SENATE FINANCE COMMITTEE, NO CO-SPONSORS (NOV 2026)" (no EPI line).
- **KB5–KB8 (optional, Jakob's choice; both versions are correct enough to air):** KB5 Gallup source "survey March 2026"
  (`SOURCES.kb.gallupSrc`) · KB6 "Survival Condo, Kansas: up to 5 years (developer)" (`SOURCES.kb.condo`) · KB7 the Sutskever source "as
  recalled by a researcher present" (`SOURCES.kb.sutskeverSrc`; c01 shows the main version, the lead switches it if Jakob picks KB7) · KB8
  Helsinki "… playgrounds, swimming pools, gyms" (`SOURCES.kb.helsinkiSrc`). Builders: use the `kb` variants (they are the more precise
  wording) unless the lead says otherwise; name in your report which you used.

## 6 · Rules (from the owner; see MOTION.md §3–§7)
- A motion-design film, not a world: every picture shows its sentence; objects turn into the next object, grow out of the line, sink
  back or are cut into the earth below it; 1–2 moving things; nothing from nowhere, no ghost fades, no crossfade, no black, nothing frozen.
  Big area changes ≥ 1.6 s (sineIO), small hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). One ★ per chunk.
- Colour code: GOLD = people, lanterns, ONE hero light per frame · COOL = the AI (always a disc) · CREAM = text, drawings, lines,
  verdicts · CONCRETE = bunker, door, plans · SOIL = the earth · the yellow coat = only you. **Never red.**
- Forbidden: a frontal vault door with a gold slit, vault wheels, keys, villains, grotesque rich men, weapons, explosions, robots (the
  "robots as guards" are words only), logos (except the bug inside C2/C2b), flags, real faces outside the clips, AI images, a 3D game look,
  QR, sponsor. Subscribe 1 and 2 are tags, never buttons. Nothing from MOTION.md §7 "Nicht wiederholen" (#55 door/gold leak, #14
  vault/keys, #69 grid/stamps/clocks/globes — the Earth at night at the end is the one exception, #73 lifeline/stone).
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s. Sources 22 px at y 880 (`F.source`).
- Canvas traps (@napi-rs/canvas = Skia): a `shadowBlur` between 0 and ~0.5 px draws a hard shadow copy that IGNORES globalAlpha → set
  `shadowBlur = 0` below .5 (X.drawPath / F.* already do). `beginPath()` before every path (the path is not part of save/restore). Build
  canvases, sprites and caches once at module level, never per frame. Randomness only from the seeded `prng`.
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs` of your own). Kit/world wishes: a local helper in your
  file, or ask the lead in your report. Never edit `lib/f72_*.mjs`, `lib/kit.mjs`, `film.mjs`, `tools/`, `audio/`. No videos or large files
  in the repo; renders go to `/tmp/claude-0/f72/<you>/`; only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole
  `/mnt/project-files/`; re-read a file ~10 s after writing it).

## 7 · Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 60,61,62 --dir /tmp/claude-0/f72/b1/snap --scale .5        # stills (every 0.5–1 s + every carrier)
python3 tools/sheet.py /tmp/claude-0/f72/b1/snap <ROOT>bild/c02_kontakt.jpg 4 400        # contact sheet (< 1 MB)
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f72/b1/c02.mp4 --from 56.36 --to 86.59 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f72/b1/c02.mp4 --scale 1280:720 --sub 170   # cuts/min ≤ 0.9 (only your W + clips), mafd median ≤ 0.43
python3 tools/still72.py /tmp/claude-0/f72/b1/c02.mp4                            # still < 5 %, no run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f72/b1/c02.mp4 56.36                       # no LURCH > 12 except planned cuts, no POP
SECS=c05,c06 node tools/seam.mjs --at <T0>                                        # your seams (and your inner chunk boundaries)
node tools/anchors72.mjs                                                          # all anchors found
```
Chunk ranges (real VO): c01 0–56.36 · c02 –86.59 · c03 –127.63 · c04 –168.63 · c05 –219.18 · c06 –273.69 · c07 –332.79 · c08 –386.80 ·
c09 –418.96 · c10 –450.50 · c11 –487.60 · c12 –538.08 · c13 –594.98. Render speed (lead, c01): ~3.3 s per video second at 1080p30 on this machine (4 cores), ~1 s at scale .5. c01 measured mafd 0.514 (the hook is dense; see MOTION.md §8) — your chunks: ≤ 0.43, i.e. move objects, keep the view calm (pans ≥ 2 s, zooms ≤ ×1.25).
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.)

## 8 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, anchors); which KB5–KB8 variants you used; any string that differs from `F.SOURCES`; kit wishes; open issues;
contact sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`, < 1 MB).
