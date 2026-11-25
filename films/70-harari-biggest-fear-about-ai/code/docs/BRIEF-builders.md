# Film 70 · "Harari's Biggest Fear About AI Isn't Robots" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

The lead built **c01** (the hook, 0 → `T.G('His word for it')`) as the quality reference, plus the kit, THE TRUST BOARD stage, the
Leitbild, the CHAIN and its HUD, the seams, the shot list and stubs for c02–c10. Three builders now build the rest **at the same time**,
about 3–3.5 minutes of picture each. The film is built through to the end with no interim review.

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), `<ROOT>bild/kit70_kontakt.jpg` and `<ROOT>bild/c01_kontakt.jpg`.
Code: `/home/user/scenario/films/70-harari-biggest-fear-about-ai/code/` (repo branch `claude/project-thread-p4vr3z`; commit locally,
**never push**). ROOT = `/mnt/project-files/scenario/film-harari/` (`$F70ROOT`).

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

**For this film, concretely:** the stage is **THE TRUST BOARD** (`X.board`, light on night blue, a faint dot grid), not a world. Every
sentence gets the motif in *zeigt wörtlich*; the layer in shots.md is binding (EXPL / MIX / SCENE / CLIP / ANCHOR); keep or raise the
explainer share of your chunks (shots.md §4). The Leitbild (`S.chainWorld`) **only** in the shots marked ANCHOR (B1: 2.17–2.22 · B2:
6.17–6.19 · B3: 9.20–9.23, E.01); a camera glide inside an anchor is fine, a ride between places is not. Hard world changes only where
shots.md has **W** (B1 2.17, 2.23 · B2 6.17, 7.01 · B3 9.20). Before every render: snapshots every 0.5–1 s + every carrier moment, look at
them against the sentence. c01 came out at mafd 0.62 (a dense hook plus footage): your chunks must land **≤ 0.43**, so give every
statement a real hold (the float and ambient light keep it alive) and keep big moves ≥ 1.6 s.

## 1 · Who builds what (final timing, 619.07 s)

| builder | chunks | from → to (phrase) | time | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'His word for it' → 'Law. Rules written' | 0:42.1 – 4:11.0 (209 s) | 1.01–1.13 out of `S.plateDementia`: HATE struck, the rail network, the ? marks, the historian and 50M+ copies, the card reader returns into the knot · 2.01–2.16 be honest (Q1, TRUST becomes the first links, ★ 2.14 the cow beside you) · **ANCHOR 2/4** 2.17–2.22 the four links named · 2.23 the chain shrinks into the HUD · 3.01–3.13 MONEY (the adviser, Bank of England & FCA, 1 in 4, 81 % vendor assurances in a sealed box, eight in ten agents, **C2**, ★ 3.11 the first link cracks) · 4.01–4.24 CONTRACT (job / loan / policy sheets, Mobley v. Workday, ★ 4.08 1.1 BILLION, NO RULING, NO VILLAIN, **M.01 subscribe 1**, the law book written by a cursor closes into the LAW link → `S.plateLaw`) |
| **B2** | c06 c07 c08 | 'Law. Rules written' → 'Three tests' | 4:11.0 – 7:12.5 (181 s) | 5.01–5.14 LAW (BUREAUCRATIC NATIVES drawers, the transport-department chat draft and its 20 MINUTES bar, ★ 5.08 the draft unrolls, South Africa's references dissolve, WRITING outruns CHECKING: the crack) · 6.01–6.16 TRUTH (Ipsos/NPR 75 %, the analyst and the agent panel, ★ 6.09 the 86 % bar, NONE OF 48 NOTICED, 58 %, the last crack) · **ANCHOR 3/4** 6.17–6.19 four cracks · 7.01–7.20 HARARI'S ANSWER: NO, Q3, the Musk ride, Estonia under the magnifier, ★ 7.13 the cow gets an interpreter, the lectern, the two windows fold into the anvil → `S.plateAnvil` |
| **B3** | c09 c10 | 'Three tests' → end | 7:12.5 – 10:19.1 (187 s, incl. the 15 s end screen) | 8.01–8.28 the three rings fill on the anvil (A HUMAN ANSWERS FOR IT, I AM A MACHINE, SOMEONE OUTSIDE CHECKS: the refused score, Art. 50, AISI 9 OF 43 RUNS, the sealed box of 3.05 opened from outside, three question cards) → **C3** (first ~2 s Suleyman listening) · 9.01–9.19 back to the cow, ★ 9.11 the cracks fill with gold, the bakery again, WHO → WHAT · **ANCHOR 4/4** 9.20 · **A.01 subscribe 2** ('This channel exists' #1) · E.01 `S.endScreen` |

**Fonts:** `lib/f10_editorial.mjs` loads Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`). If a statement renders in a
sans face, the fonts did not load: stop and say so.

## 2 · Timing (final: `<ROOT>audio/timing.json`, ElevenLabs on vo-v3, 25.11.)
- `film.mjs` loads `<ROOT>audio/timing.json` (it exists now; `data/provisional_timing.json` is only a fallback). Duration 619.07 s, last
  word 600.07 s, end screen 604.07–619.07 s. Channel calls: t08 231.72–242.71 (B1), t21 590.90–600.07 (B3). Mix preview
  `<ROOT>audio/mix_preview.mp3` (listen to your section before you time a hit).
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(from, to, after)` (words), `T.clip('C2')` →
  `{ start, end }`; the narrator-read quote cards have slots too: `T.clip('Q1')`, `T.clip('Q2')`, `T.clip('Q3')` (lib/kit.mjs builds them
  from their spoken words). Never write seconds. After any VO change: `node tools/anchors70.mjs` and `python3 tools/shots70.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`. Known repeats: 'This channel exists' / 'Want that too' / 'Then
  subscribe' (×2: M.01 and A.01, use nth 1 or `after` in c10), 'Money.' (×3), 'Contract.' (×3), 'Law.' (×10, prefix match also hits
  'lawsuit'), 'Truth.' (×2), 'the cow' (×4), 'trust' (×11), 'link' (×5). The last word of a phrase matches as a prefix.
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT70 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. The renderer only CUTS between entries: use a new entry only for a planned cut (a **W** in shots.md);
  everything else is one draw function that changes by itself (like sc01: Leitbild → mask → board, all one draw). Inner chunk boundaries
  of your group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).
- The CHAIN HUD (`F.chainHud(ctx, t, T)`) changes by itself on the `F.CHAIN` phrases (examined link: LINK n · NAME; cracks; the mend).
  Draw it in every board frame from 2.23 on, except where the chain is big on screen; it hides itself in clip windows and during anchor 3.
  Never set a crack or a mend by hand (`F.chainState(T, t)` gives the state if you draw the chain big).

## 3 · Seams (lib/f70_world.mjs; owned by the lead: import, never edit)
| seam | phrase | T0 | plate | handing side | receiving side |
|---|---|---|---|---|---|
| Lead → B1 | 'His word for it' | 42.14 | `S.plateDementia` (COLLECTIVE DEMENTIA, serif, cream glow, the folded clip frame as a cream rule under it, source line) | c01 (done; the C1 plate folds into the rule) | B1 1.01 holds it, 1.02 slides it up |
| B1 → B2 | 'Law. Rules written' | 251.04 | `S.plateLaw` (the four links big in a row, MONEY and CONTRACT cracked, LAW lit and pulsing, TRUTH plain) | B1 4.24: the law book closes into the LAW link | B2 5.01 holds, 5.02 pushes into LAW |
| B2 → B3 | 'Three tests' | 432.46 | `S.plateAnvil` (the anvil low, three empty ring moulds glowing, the four cracked links small above) | B2 7.20: the two windows fold into the anvil | B3 8.01 holds, 8.02 fills mould 1 |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push); the receiving side continues it before
its own move. The stubs already draw the plates at their ends; keep that when you replace them. Check: `SECS=c05,c06 node tools/seam.mjs --at 251.04`.

## 4 · Kit API (lib/f70_explain.mjs as `X`, lib/f70_kit.mjs as `F`, lib/f70_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **THE TRUST BOARD (your main stage):** view `{ x, y, s }`, `X.V0` · `X.viewPath(t, [[t, view], …])` · `X.board(ctx, t, v, { lx, ly, pool,
  grid, warm })` (ground + light pool + dot grid that moves with the view; `X.sheet` = alias) · `X.inView(ctx, v, () => …)` (draw in board
  units) · `X.toScreen(v, x, y)` · `X.lightLine(ctx, pts, u, { col, w, dash })` · `X.label(ctx, txt, x, y, u, o)` (Inter caps, mask wipe) ·
  `X.big(ctx, txt, x, y, size, u, o)` (serif statement) · `X.dateTag` · `X.cells` · `X.aiScreen` · `X.doc` (contract / cv / form) ·
  `X.crowdRise` · `X.knot(ctx, t, x, y, { u, q, pulse, a, close })` → `{ entry, exit, boxes }` (the knot of ?-boxes) ·
  `X.deskPerson(ctx, t, x, y, h, { lamp, machine, look })` · `X.counterTop(ctx, t, x0, x1, y, { u, lamp, lampX })`.
- **The chain:** `F.chainLink(ctx, t, x, y, L, ang, { edge, lit, crack, mend, hair, col: 'gold'|'cream'|'cool', mould, a })` ·
  `F.catenary(a, b, sag, { sway, ph, n })` · `F.chain(ctx, t, pts, { L | Lat(f), u, link(i, f), a })` · `F.pathLen`, `F.pathAt` · `F.CHAIN`
  (names + phrases) · `F.chainTimes(T)` · `F.chainState(T, t)` → `{ b, cur, links: [{ lit, crack, mend }], on }` · `F.chainHud(ctx, t, T,
  { a, x, y, L, links })` · `F.HUD`.
- **Objects:** `F.payCard(ctx, t, x, y, w, { rot, a, morph })` (link → card) · `F.terminal(ctx, t, x, y, w, { wake, ring, check, a })` →
  `{ screen, cable }` · `F.bread` · `F.coin(ctx, t, x, y, r, { flip })` · `F.sleeve(ctx, t, x, y, { ang, len, s, open })` · `F.cow(ctx, t, x, y,
  h, { dir, graze, look, tag, a })` → `{ tag, head }` · `F.numberRoll(ctx, value, x, y, size, u, { fmt, from, gold, align })` ·
  `F.paperCard`, `F.dataCard`, `F.quoteCard(ctx, t, T, { text, credit, spoken, after, size, w, x, y, u, rot })` (words light as spoken) ·
  `F.verdict` (gold caps + drawn underline, no stamps) · `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.title`, `F.source`, `F.float`.
- **The Leitbild (ANCHOR shots only):** `S.chainWorld(ctx, t, cam, { four, names, links, taut, sway, u, warm, answer, you, city, sky, fg })`
  → `{ hand, sphere, named, end, first }`; camera `S.homeCam()`, `E.cam(z, fx, fy, sx, sy)`; `S.SPHERE`, `S.YOU`, `S.NAMED_F` (where the four
  named links sit on the arc) · `S.endScreen(ctx, t, T)`, `S.END_TILES`. Look at sc01 stage L (push into your hand) and `tools/kit_sheet70.mjs`
  (01–03: hook / turn named / point cracks).
- **Camera:** board views via `X.viewPath`; Leitbild via `E.cam` / `F.camPath`. The global float (`film.mjs cameraFloat`) keeps every
  frame alive; you still need ambient motion (grid drift, breathing light, figures breathing, the chain's sway) in every hold.
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, credits, label })` grows from `from` (a rect or [cx, cy, r]) into
  `F.CLIP_RECT` and back; lower third from `F.CLIPS`. Real frames: `python3 tools/f70_clips.py clips` → `/tmp/claude-0/f70/clips/{C1,C2,C3}/`
  (already extracted; in/out from `audio/clips_cut.json`, frame 1 = slot start, in sync with the cut sound). Final slots: **C1** 33.67–41.47
  (7.80 s, lead) · **C2** 158.90–167.53 (8.63 s, B1; file 1.00–9.63, ends before the interviewer's "Will it…"; the Economist "E" bug top
  left is cropped out by `F.CLIPS.C2.crop`, the small "E" on the microphone stays) · **C3** 531.43–540.06 (8.63 s, B3; the first ~2 s show
  Suleyman listening: the lower third waits 2.2 s, `labelDelay`). C1 does NOT contain "collective dementia" (the narrator attributes it in
  1.01). Every clip grows out of a carrier (shots.md) and goes back into it; follow sc01's fold (the fold runs across the next entry, never a cut).
- **Strings:** `F.SOURCES` = text-v2 EINBLENDUNG lines with `<ROOT>faktencheck.md` applied (q1/q2/q3 objects, dementia, boe81 '81% RELY ON
  VENDOR ASSURANCES', workdaySays 'WORKDAY: CLAIMS ARE FALSE', aisiRuns 'ONE MODEL: 9 OF 43 RUNS', estoniaPeople …; `F.ASOF` 25 NOV 2026).
  Use the keys, never retype a figure. Long source lines break into two lines by themselves (`F.source`). Spoken text: `<ROOT>vo-v3.txt`.

## 5 · Rules (from the owner; see MOTION.md §3–§7)
- A motion-design film, not a world: every picture shows its sentence; objects turn into the next object; match cuts over carriers; 1–2
  moving things; nothing from nowhere, no ghost fades, no crossfade, no black, nothing frozen. Big area changes ≥ 1.6 s (sineIO), small
  hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). One ★ per chunk.
- Colour code: GOLD = what holds (the chain, a lit link, the mend) · CREAM = open / paper / questions · COOL = machines / the sphere / AI ·
  LAMP = people's lights · the yellow coat = only you. Away = screen right, coming back = right → left. Never red, never a cross, never a
  stamp, never a clock.
- No killer robots (only the words in the title), no brains, no logos, no flags or maps, no real faces outside the clips (Harari outside
  the clips is never drawn with a face), no AI images, no 3D game look, no primitive shapes. No QR, no sponsor. Nothing from MOTION.md §7.
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s. Sources 22 px at y 880 (`F.source`).
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs` of your own). Kit/world wishes: a local helper in your
  file, or ask the lead in your report. Never edit `lib/f70_*.mjs`, `lib/kit.mjs`, `film.mjs`, `audio/`, `tools/`. No videos or large files
  in the repo; renders go to `/tmp/claude-0/f70/<you>/`; only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never search the whole
  project folder; re-read a file ~10 s after writing it).

## 6 · Render and check (per chunk, then for your whole group)
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 43,44,45 --dir /tmp/claude-0/f70/b1/snap --scale .5        # stills (every 0.5–1 s + every carrier)
python3 tools/contact70.py /tmp/claude-0/f70/b1/snap /tmp/claude-0/f70/b1/c02_kontakt.jpg  # contact sheet (< 1 MB)
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f70/b1/c02.mp4 --from 42.14 --to 78.0 --scale .5
python3 tools/calm.py /tmp/claude-0/f70/b1/c02.mp4 --scale 1280:720      # cuts/min ≤ 0.9 (only your W), mafd median ≤ 0.43
python3 tools/still70.py /tmp/claude-0/f70/b1/c02.mp4                     # still < 5 %, no still run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f70/b1/c02.mp4 42.14                # no LURCH > 12 except planned cuts, no POP
SECS=c05,c06 node tools/seam.mjs --at 251.04                               # your seams (and your inner chunk boundaries)
node tools/anchors70.mjs                                                   # all anchors found
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) Final 1080p chunks:
`python3 tools/f70_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable); assembly with subtitles and the mix: `assemble` (the lead /
the sound step).

## 7 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, anchors); any string you took from vo-v3 that differs from `F.SOURCES`; kit wishes; open issues; contact
sheet path (`<ROOT>bild/<chunk>_kontakt.jpg`, < 1 MB).
