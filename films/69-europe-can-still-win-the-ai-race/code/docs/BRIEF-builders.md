# Film 69 · "Europe Can Still Win the AI Race" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-24

The lead built **c01** (the hook, 0 → `T.G('Those chip machines')`) as the quality reference, plus the kit, THE PLAN SHEET stage, the
Leitbild, the seams, the shot list and stubs for c02–c12. Three builders now build the rest **at the same time**, about 3–3.5 minutes of
picture each. The film is built through to the end with no interim review.

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), `<ROOT>bild/kit69_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/69-europe-can-still-win-the-ai-race/code/` (repo branch `claude/project-thread-m7cc4w`; commit locally,
**never push**). ROOT = `/mnt/project-files/scenario/film-europa-ki/` (`$F69ROOT`).

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

**For this film, concretely:** the stage is **THE PLAN SHEET** (`X.sheet`, light on night blue), not a world. Every sentence gets the
motif in *zeigt wörtlich*; the layer in shots.md is binding (EXPL / MIX / SCENE / CLIP / ANCHOR); keep or raise your explainer share
(B1 c02–c05, B2 c06–c08, B3 c09–c12: see shots.md §4). The Leitbild (`S.seaWorld`) **only** in the shots marked ANCHOR (B1: 1.11–1.12 · B3:
10.01–10.02, 10.10, A.01, E.01); a camera glide inside an anchor is fine, a ride between places is not. Hard world changes only where
shots.md has **W**. Before every render: snapshots every 0.5–1 s + every carrier moment, look at them against the sentence.

## 1 · Who builds what

| builder | chunks | from → to (phrase) | time (provisional) | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'Those chip machines' → 'None of it runs' | 1:13.5 – 4:42.8 (209 s) | 1.01–1.13: out of `plateMachine` the hall · bus-sized · three cargo jets · every advanced chip · ★ nothing sold in Europe · strengths not connected · the Draghi report → **C1** · 1 in 6 · **ANCHOR 2/4** the five parts on the moon · the piece in your hands · the moon shrinks into the HUD · 2.01–2.13 the money (€10 trillion, your window, the string, $285.9 bn vs $20.9 bn, the paths, +62 %, Scaleup fund, Mistral, ★ ASML clicks in, HALFWAY) · 3.01–3.06 (**C2** Mensch out of the block's window, a client state, the desk callback) · 4.01–4.06 rules (27 stacks → EU INC, the hemicycle, the workers' table, not before 2028, ON PAPER) → `plateEnergy` |
| **B2** | c06 c07 c08 | 'None of it runs' → 'So suppose all five' | 4:42.8 – 7:46.9 (184 s) | 5.01–5.09 energy (push into piece 3, 2× prices, the light map coast lines only, gigafactory bids 3 Dec, the budget bar, ★ the 100 cells return 5.6 %, HALFWAY, NEEDED) · **M.01 subscribe 1** (the town of windows, warm; no QR) · 6.01–6.09 the lab (streams, CERN ring, the Web, CERN FOR AI, €107 m pilot → **C3** von der Leyen, ★ €500 bn dashed outline, ON PAPER) · 7.01–7.09 the minds (the researcher's two letters, +70 %, options inside EU INC, −45 %, a few come back right → left, OPEN) → `plateFour` |
| **B3** | c09 c10 c11 c12 | 'So suppose all five' → end | 7:46.9 – 11:01.2 (194 s, incl. the 15 s end screen) | 8.01–8.07 second race (two tracks, the satellite engineer, the old works → **C4** Koerte, ★ data boxes together) · 9.01–9.05 the say (the machine at the table, three hands, two boards, four hands + ballot) · **ANCHOR 3/4** the verdict (`F.kitHud` big) · date tags · NO / YES on the tracks · the interview desk with a European screen · **C1b** Draghi out of the report · the budget timeline · harvest · **ANCHOR 4/4** ★ the 27 lights link up · **A.01 subscribe 2** · end screen (`S.endScreen`, refine it) |

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`, or `$F69FONTS`).
If a statement renders in a sans face, the fonts did not load: stop and say so.

## 2 · Timing (it WILL move: vo-v3 and the real VO are still to come)
- `film.mjs` loads `<ROOT>audio/timing.json` when it exists, else `data/provisional_timing.json` (`python3 tools/provisional_timing.py`
  from the newest `<ROOT>vo-vN.txt`; clip slots = `<ROOT>clips-geprueft.json` lengths + .3 s).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C2')` →
  `{ start, end }`. Never write seconds. After any VO change: `node tools/anchors69.mjs` (all anchors found) and `python3 tools/shots69.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'This channel exists' (c07 subscribe 1 / c12 subscribe 2: nth 1),
  'too small' (hook / 10.10), 'a say' (hook / 3.05 / 9.01 / 10.05), 'halfway' (2.13 / 5.08 / 10.01), 'on paper' (1.13 / 4.06 / 6.09 / 10.01).
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT69 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. The renderer only CUTS between entries: use a new entry only for a planned cut (a **W** in shots.md);
  everything else is one draw function that changes by itself (like sc01's stages D → C → M). Inner chunk boundaries of your group are
  yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).
- The KIT HUD (`F.kitHud(ctx, t, T)`) changes by itself on the `F.KIT` phrases (checking = pulse + PART n OF 5; verdicts HALFWAY / ON
  PAPER / OPEN). Draw it in every frame from 1.13 ('really there, or only on paper') on, except where a piece is big on screen and in
  clip windows (it hides itself there). Never set a verdict by hand.

## 3 · Seams (lib/f69_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'Those chip machines' | `S.plateMachine` (the chip machine big, side view, centred on the sheet, light path on, no text) | c01 (done) | B1 1.01: pull back, the machine stands in its hall |
| B1 → B2 | 'None of it runs' | `S.plateEnergy` (the disc at `S.PLATE_DISC` 960/470 r 250: money HALFWAY, rules ON PAPER, piece 3 lit, the minds piece beside it) | B1 4.06 settles into it | B2 5.01 pushes into piece 3 |
| B2 → B3 | 'So suppose all five' | `S.plateFour` (the same disc: 2 HALFWAY + 2 ON PAPER, the minds piece beside it) | B2 7.09 settles into it | B3 8.01 lights the four, 8.02 draws the tracks out of the rim |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push); the receiving side continues it before
its own move. The stubs already draw the plates at their ends; keep that when you replace them. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.

## 4 · Kit API (lib/f69_explain.mjs as `X`, lib/f69_kit.mjs as `F`, lib/f69_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **THE PLAN SHEET (your main stage):** view `{ x, y, s }` · `X.viewPath(t, [[t, view], …])` (monotone, log scale) · `X.sheet(ctx, t, v, { lx,
  ly, grid })` (ground + light pool + blueprint grid that moves with the view) · `X.inView(ctx, v, () => …)` (draw in sheet units) ·
  `X.toScreen(v, x, y)` · `X.lightLine(ctx, pts, u, { col, w, dash })` · `X.label(ctx, txt, x, y, u, o)` (Inter caps, mask wipe) ·
  `X.big(ctx, txt, x, y, size, u, o)` (serif statement) · `X.dateTag` · `X.cells(ctx, t, x, y, cell, cols, rows, { keep, on, dim, pulse, merge,
  drop, hideKeep })` (the 100 cells; 5.07 brings them back) · `X.aiScreen`, `X.doc` (contract / cv / form), `X.deskScene(ctx, t, x, o)`,
  `X.DESK`, `X.yesNo` (callbacks 3.05, 10.05) · `X.crate`, `X.crates27`, `X.planSheet(ctx, t, x, y, w, { u, write, machine })` ·
  `X.crowdRise(ctx, t, x, y, n, cols, h, { u, leave, leaveN, gather, g })` (7.07/7.08: the walk-out right, back right → left).
- **The kit:** `F.kitDisc(ctx, t, cx, cy, r, parts, o)` · `F.kitParts(T, t)` · `F.mixParts(A, B, u)` · `F.VISION`, `F.BLANK` · `F.loosePiece(ctx,
  t, i, x, y, r, o)` · `F.pieceCentre(i, cx, cy, r)` · `F.kitHud(ctx, t, T, { a, big, dx, dy, loose, parts })` · `F.KIT` (phrases) · `S.momentParts`.
- **Objects:** `F.chipMachine(ctx, t, x, y, L, { beam, glow })` · `F.jet` · `F.barge` · `F.crowd` · `F.ruleBook` · `F.headTile` · `F.letter(ctx, t,
  x, y, w, { head, u, rot })` (7.02) · `F.paperCard`, `F.dataCard`, `F.quoteCard`, `F.verdict` (gold caps + drawn underline, no stamps) ·
  `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.title`, `F.float`. `F.lightColumn` exists but is NOT a sky column (§6 of MOTION.md): at most a
  small compute glyph on the sheet.
- **The Leitbild (ANCHOR shots only):** `S.seaWorld(ctx, cam, t, st)` → `{ moon }`; cameras `S.HOME`, `S.WIDE_CAM`, `S.ROOF_CAM` (and
  `S.focus(id, …)`); `S.MOON`, `S.ROOF`, `S.ISLES` (27), `S.LINKS` (10.10: the lights link up) · `S.endScreen(ctx, t, T)`, `S.END_PARTS`.
  Look at sc01 stage L for how st is filled (parts, you, piece, title).
- **Camera:** sheet views via `X.viewPath`; Leitbild via `F.camPath(t, K)` with `E.aim(...)` keys. The global float (`film.mjs cameraFloat`)
  keeps every frame alive; you still need ambient motion (grid drift, breathing light, figures breathing) in every hold.
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, credits, label })` grows from `from` (a rect or [cx, cy, r]) into
  `F.CLIP_RECT` and back; lower third above the plate from `F.CLIPS` (filled from `<ROOT>clips-geprueft.json`). Real frames:
  `python3 tools/f69_clips.py clips` → `/tmp/claude-0/f69/clips/{C1,C2,C3,C4,C1b}/` (already extracted once). Lengths: C1 8.47 s · C2 9.39 s
  · C3 10.37 s · C4 15.17 s · C1b 12.12 s. **C1b** is centre-cropped (`crop .76`: sign-language interpreter bottom right + logo top right
  must stay out). **C3** carries the credit "© European Union, 2026". **C4** source is 720p upscaled (keep the plate at CLIP_RECT, do not
  enlarge it further) and has a quiet "Nobody." from another panellist at ~4.6 s (not a cue for the picture). Every clip grows out of a
  carrier (shots.md: report cover, block window, small ring, works window, report) and goes back into it.
- **Strings:** `F.SOURCES` (from text-v2 OVERLAY lines). If the fact-checked `<ROOT>text-v3.md` / vo-v3 is there and changes a figure,
  **v3 wins**; use it and say so in your report.

## 5 · Rules (from the owner; see MOTION.md §3–§6)
- A motion-design film, not a world: every picture shows its sentence; objects turn into the next object; match cuts over carriers; 1–2
  moving things; nothing from nowhere, no ghost fades, no crossfade, no black, nothing frozen. Big area changes ≥ 1.6 s (sineIO), small
  hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). One ★ per chunk.
- Colour code: GOLD = what holds, ONE hero light per frame · CREAM = open / on paper · COOL = machines / AI · LAMP = people's windows ·
  the yellow coat = only you. Away = screen right, coming back = right → left. Never red, never a cross, never a stamp, never a clock.
- No logos, no flags, no political-map hero (5.03: coast lines only), no Jensen Huang anywhere, no real faces outside the clips, no AI
  images, no 3D game look, no primitive shapes, no robots. No QR, no sponsor. Nothing from MOTION.md §6 "Nicht wiederholen".
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s. Sources 22 px at y 880 (`F.source`).
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs` of your own). Kit/world wishes: a local helper in your
  file, or ask the lead in your report. Never edit `lib/f69_*.mjs`, `film.mjs`, `audio/`, `tools/`. No videos or large files in the repo;
  renders go to `/tmp/claude-0/f69/<you>/`; only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole project
  folder; re-read a file ~10 s after writing it).

## 6 · Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 75,76,77 --dir /tmp/claude-0/f69/b1/snap --scale .5        # stills (every 0.5–1 s + every carrier)
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f69/b1/c02.mp4 --from 73.5 --to 147.6 --scale .5 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f69/b1/c02.mp4 --scale 1280:720      # cuts/min ≤ 0.9 (only your W), mafd median ≤ 0.43
python3 tools/smooth.py /tmp/claude-0/f69/b1/c02.mp4 73.5                 # no LURCH > 12 except planned cuts, no POP
SECS=c05,c06 node tools/seam.mjs --at <T0>                                 # your seams (and your inner chunk boundaries)
node tools/anchors69.mjs                                                   # all anchors found
```
**Still parts (§13.9: < 5 %, none > 2 s):** calm.py's "static" share over-reads this film (grain on twos at half scale). Measure with
the grain-robust check the lead used for c01 (0.5 s windows on a 160×90 downscale; a window is still when its mean abs frame difference
< 0.35 of 255): `python3 tools/still69.py <mp4>`. (Times in these commands are for rendering only; get them from `chunkRanges`, never put
them in scene code.) Final 1080p chunks: `python3 tools/f69_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable); assembly with
subtitles and the mix: `assemble` (the lead / the sound step).

## 7 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, anchors); any string you took from text-v3 that differs from `F.SOURCES`; kit wishes; open issues; contact
sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`, < 1 MB).
