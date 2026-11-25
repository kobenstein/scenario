# Film 75 · "Our Minds Aren't Ready for Superintelligence" · builder brief (3 builders in parallel, one checkout) · as of 2026-11-25

The lead built **c01** (the hook, 0 → `T.G('To see what it is')`) as the quality reference, plus the kit, THE WALL stage, THE CLOCKS
(gauges + HUD), the Leitbild THE SUNRISE, the seams, the shot list and stubs for c02–c12. Three builders now build the rest **at the same
time**, about 3–3.5 minutes of picture each. The film is built through to the end with no interim review.

**First step, before anything else: load the skills** `scenario-motion` (channel style, wins on conflict), `world-class-motion-design`,
`fluid-motion-design`, `motion-director-gates`, and `dataviz` for the number graphics. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Then read: `docs/MOTION.md` (stages + rules), `docs/shots.md` (your shots, column *zeigt wörtlich*), `scenes/sc01.mjs` (how a chunk is
built), the kit sheet `/tmp/claude-0/f75/kit75_kontakt.jpg` and the hook sheet `/tmp/claude-0/f75/c01_kontakt.jpg` (copies in `<ROOT>bild/`).
Code: `/home/user/scenario/films/75-our-minds-arent-ready-for-superintelligence/code/` (repo branch `claude/project-thread-r8suc6`; commit
locally, **never push**). ROOT = `/mnt/project-files/scenario/film-75-godlike/` (`$F75ROOT`). Renders and stills only under `/tmp/claude-0/f75/<you>/`.

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

**For this film, concretely:** the stage is **THE WALL** (`X.wall`, the faceted night-stone wall with objects of light like glowing cave
marks), not a world. Every sentence gets the motif in *zeigt wörtlich*; the layer in shots.md is binding (EXPL / MIX / SCENE / CLIP /
ANCHOR); keep or raise your explainer share (shots.md §4, real VO timing: **B1 ≈ 77 %, B2 ≈ 69 %, B3 ≈ 62 %**, film 69.2 %). The Leitbild
(`S.sunrise`) **only** in the shots marked ANCHOR (B2: 3.05 · B3: 4.25, 5.09, A.01, E.01); a camera glide inside an anchor is fine, a ride
between places is not. Hard world changes only where shots.md has **W**. Clocks are small (the HUD) or an explainer graphic where the
sentence is about them; never a clock face, never a giant clock as a key visual. Before every render: snapshots every 0.5–1 s + every
carrier moment, look at them against the sentence.

## 1 · Who builds what (real VO timing, `audio/timing.json`, 631.83 s)

| builder | chunks | from → to (phrase) | time | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 'To see what it is' → 'This channel exists' | 0:53.7 – 4:15.5 (202 s) | **1.01–1.13** reflex 1 FEAR: out of `plateSofa` push into the phone, the pulse jumps before a word is read (slow motion), the alarm older than reading, every mammal, the three reflex niches (`F.reflexes`) cut in, FEAR BEFORE THOUGHT, ★ 1.08 every extra negative word = more clicks, reflex 2 GRAB (a colleague, a competitor) · **1.14–1.23** companies too, NO CHOICE, the UN card grows into **C2** Bengio, NOT A LAW OF NATURE · A CHOICE, reflex 3 STRAIGHT LINE, ★ 1.22 it doubles, roughly every 3.5 months · **1.24–1.36** the experts missed (olympiad), whose gut is ready, we adapt over years vs months, the card → **K1** Wilson, institutions, a seat belt for the brain, how fast do rules move? · **2.01–2.15** the AI law (proposed before ChatGPT → 2028), ★ 2.04 seven years vs doubles every few months, pushed back, too slow?, the ozone hole 1985 → the treaty with its update cog, again and again, kept learning → settles into `plateClocks` |
| **B2** | c06 c07 c08 c09 | 'This channel exists' → 'Then you notice more' | 4:15.5 – 7:42.2 (207 s) | **M.01** subscribe 1 out of `plateClocks` (W; no QR) · **3.01–3.08** faster than a law? there is; not out-thinking the machine; **ANCHOR 2/4** (W) 3.05 the clock you carry (the ring fills once); Harari has books to sell; a price → **C1** Harari · **3.09–3.22** developing consciousness, a retreat?, try it: where the words come from, UNWATCHED, ★ 3.18 THIS IS FEAR · CRAVING · PULLING (the niches name themselves), why now: competition, know you better, harder to use against you · **3.23–3.35** meditation: ten seconds, your way stays open, ONE BREATH between the headline and your thumb (the HUD ring fills), the small and the big version, ★ 3.32 $700+ billion mostly on AI vs ~$430 million, a wish not a calculation · **3.36–3.46** not measured: the AI report card with the empty row WHAT IT DOES TO YOU, an early test, fifteen chatbots, ★ 3.42 about two thirds turned harmful, the coin splits in three, one calm person doesn't slow a race, you get faster → settles into `plateRace` |
| **B3** | c10 c11 c12 | 'Then you notice more' → end | 7:42.2 – 10:31.8 (170 s, incl. the 15 s end screen 616.83–631.83) | **4.01–4.15** the race runs on (the counter runs away), set both clocks: the scenario evening (W, warmer lamp), the app with a GRADE, tested before release every few months, the rule changes within the year, your reflexes by name, far away? take the evening apart (the grade = an early test, testing before release, Hassabis' body, every quarter) · **4.16–4.29** within a year? the UN framework, ★ 4.20 3 → 135 leaders, none of it settled (not a treaty, paid by industry, not the course), **ANCHOR 3/4** (W) 4.25 the race is a choice, so is the gap, labs / governments / voters, one clock needs no vote · **5.01–5.09** the next headline, same pulse, THIS IS FEAR, one breath, you decide, the first clock, rules that learn, ★ 5.08 the gap narrows to ≈ 45 % (never zero), **ANCHOR 4/4** (W) 5.09 hand axe and phone · **A.01** subscribe 2 (602.32–612.83) over the final picture · **E.01** end screen (`S.endScreen`, refine it; lower half calm for the tiles `S.END_TILES`) |

★ = the wow moment of a chunk (one per chunk at most; c04, c06 and c10 have none planned: keep them calm, no second peak).

**Fonts:** `engine.mjs` / `lib/f10_editorial.mjs` load Instrument Serif + Inter from the repo (`stil/tests/shared/fonts/`). If a statement
renders in a sans face, the fonts did not load: stop and say so.

## 2 · Timing (real VO, sound step 25.11., commit 805c080)
- `film.mjs` loads `$TIMING`, else **`audio/timing.json`** (the real VO), else `<ROOT>audio/timing.json`, else the provisional file. The
  sound step also delivered `audio/slots.json`, `clips.json`, `cuts.json` and `audio/untertitel/subtitles.ass/.srt`. Spoken text: `<ROOT>vo-v5.txt` (final).
  Film 631.83 s; last VO word 612.83; end screen 616.83–631.83; subscribe calls 255.46–265.73 and 602.32–612.83.
- **Anchor only on phrases:** `T.G(phrase, nth, after)` (start), `T.GE(...)` (end), `T.GW(phrase, null, after)` (words), `T.clip('C2')` →
  `{ start, end }`. Never write seconds. After any timing change: `node tools/anchors75.mjs` (all anchors found) and `python3 tools/shots75.py`.
- Repeated phrases: pass `after` (your chunk start `R.a`) or `nth`: 'This channel exists' (M.01 / A.01: nth 1 for the second), 'headline' (7×:
  13.3 / 55.9 / 74.6 / 379.1 / 383.6 / 470.0 / 564.5), 'one breath' (377.7 / 577.4), 'gap' (34.1 / 549.7 / 591.3), 'pulse' (18.6 / 57.8 / 471.8 /
  568.2), 'every few months' (8.2 / 214.9 / 483.9) — times for orientation only, in code use `after: R.a` or `nth`. Wilson: anchor on 'had a sentence for this', not on "E. O." (the initials split into odd tokens).
- Your entry list: `export default async (T, R) => [{ t, draw(ctx, t), print: F.PRINT75 }, …]`; R = `{ a, b, id, first }`. Entries before
  `R.a` or after `R.b` are dropped. The renderer only CUTS between entries: use a new entry only for a planned cut (a **W** in shots.md);
  everything else is one draw function that changes by itself (like sc01: Leitbild → flood → wall stage). Inner chunk boundaries of your
  group are yours: make the frame at `R.b` of one chunk equal the frame at `R.a` of the next (seam.mjs proves it).
- **THE CLOCKS HUD** (`F.clocksHud(ctx, t, T)`) changes by itself on the `F.CLOCK` phrases (cog sets, ring becomes yours, one breath, rule
  ticks, you get faster, the gap narrows). Draw it in every frame from `F.CLOCK.hud` on, except where the gauges are big on screen
  (`S.clocksBig`) and in clip windows (it hides itself there). Never set a gauge state by hand.

## 3 · Seams (lib/f75_world.mjs; owned by the lead: import, never edit)
| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | 'To see what it is' (53.72) | `S.plateSofa` (view 960/1950 × creep: you on the sofa, the phone lit with the headline, the dashed ring on your chest; HUD top left) | c01 (done) | B1 1.01: push into the phone |
| B1 → B2 | 'This channel exists' (255.46) | `S.plateClocks` (`S.clocksBig` at 960/560, k 2.4 × creep: cog SET, ring dashed, THE GAP full, the counter; HUD hidden) | B1 2.15 settles into it | B2 M.01 slides the gauges aside |
| B2 → B3 | 'Then you notice more' (462.21) | `S.plateRace` (the same big gauges: ring spinning fast, cog standing) | B2 3.46 settles into it | B3 4.01 lets the counter run away |

Both sides draw the plate for ±0.5 s (`S.SEAM_HALF`) with the same creep (`S.creep`, 4 %/s push); the receiving side continues it before
its own move. The stubs already draw the plates at their ends; keep that when you replace them. Check: `SECS=c05,c06 node tools/seam.mjs --at <T0>`.

## 4 · Kit API (lib/f75_explain.mjs as `X`, lib/f75_kit.mjs as `F`, lib/f75_world.mjs as `S`, lib/f10_editorial.mjs as `E`)
- **THE WALL (your main stage):** view `{ x, y, s }` · `X.viewPath(t, [[t, view], …])` (monotone, log scale) · `X.wall(ctx, t, v, { lx, ly })`
  (ground + facets + the light pool at lx/ly) · `X.inView(ctx, v, () => …)` (draw in wall units) · `X.toScreen(v, x, y)` · `X.lightLine(ctx,
  pts, u, { col, w, dash })` · `X.mark` (an ochre cave mark) · `X.label(ctx, txt, x, y, u, o)` (Inter caps, mask wipe) · `X.big(ctx, txt, x, y,
  size, u, o)` (serif statement) · `X.dateTag` · `X.timeAxis(ctx, t, x0, x1, y, u, ticks)` · `X.sofa(ctx, t, x, y, s, o)` (returns phone rect,
  chest, head, hand) · `X.doc(ctx, t, x, y, w, { title, cog, notch, dashed })` (a law / the treaty with its update cog) · `X.reportCard(ctx, t,
  x, y, w, { rows, empty, emptyFill })` · `X.chatRow(ctx, t, x0, y, n, ww, { u, pull, to, tip, tipU, q })` · `X.coin(ctx, t, x, y, r, { flip,
  label })`.
- **Objects:** `F.sphere` (the machine) · `F.stoneHead` (your mind; `node`, `dark`) · `F.mammal(ctx, t, 'hunter'|'wolf'|'mouse', …)` · `F.crowd`
  · `F.reflexes(ctx, t, x, y, w, { on, lit, labels, grab, line })` (FEAR · GRAB · STRAIGHT LINE) · `F.phone`, `F.headline` (only "AI" readable;
  `bad`, `seed`) · `F.pulseLine`, `F.pulsePath` (the ochre pulse) · `F.handAxe` · cards `F.paperCard`, `F.dataCard({ kind, title, big, small,
  src })`, `F.quoteCard`, `F.verdict` · `F.goldText`, `F.goldSpan`, `F.goldLabel`, `F.title`, `F.float`, `F.source(ctx, …)`.
- **THE CLOCKS:** single gauges `F.flintClock`, `F.cogClock({ dashed, notch, glow })`, `F.ringClock({ dashed, fill, spin, ink })`,
  `F.counterClock`, `F.gapBracket(ctx, t, x0, x1, y, u, o)`; state `F.clockState(T, t)`, times `F.clockTimes(T)`; the HUD `F.clocksHud`; big
  `S.clocksBig(ctx, t, T, cx, cy, k, { labels, only, state })`; the HUD geometry `F.HUD`, `S.HUD_C`.
- **The Leitbild (ANCHOR shots only):** `S.sunrise(ctx, cam, t, { rise, rays, glow, you: { x, h, arm, hold: 'axe'|'phone'|'both', ring }, gap:
  { u, label }, stars, fg, sky })` → `{ sphere, you: { head, hand, axe, chest, foot } }`; cameras `S.HOME()`, `S.PUSH(k)`; `S.SUN`, `S.HILL`,
  `S.hillY` · `S.endScreen(ctx, t, T)`, `S.END_TILES`. Look at sc01 `leitbild()` for how st is filled.
- **Scenes on the wall:** `S.sofaScene(ctx, t, o)` at `S.SOFA_AT` (view `S.SOFA_VIEW`); the scenario evening = `sofaScene` with `lamp: 1`.
- **Camera:** wall views via `X.viewPath`; where a carrier travels, follow it (Gate 4: sc01 `follow()` averages the carrier over 0.2 s plus a
  lead). The global float (`film.mjs cameraFloat`) keeps every frame alive; you still need ambient motion in every hold.
- **Clips:** `F.clipPlate(ctx, t, T, 'C2', { from, morph, dark, credits, label })` grows from `from` (a rect or [cx, cy, r]) into `F.CLIP_RECT`
  and back; lower third above the plate from `F.CLIPS`. Cuts = the sound step's `audio/cuts.json` (same in/out for picture and sound):
  **C2** Bengio 6.08–17.50 (slot 102.72–114.14, 11.4 s; 720p source: keep the plate at CLIP_RECT, never larger) · **K1** Wilson 13.02–29.10
  (slot 170.82–186.90, 16.1 s: above the 15 s target, under the 20 s limit, approved length) · **C1** Harari 9.38–26.81 (slot 290.16–307.59,
  17.4 s). Real frames: `python3 tools/f75_clips.py clips` → `/tmp/claude-0/f75/clips/{C2,K1,C1}/` (extracted 25.11. with these cuts). Each
  clip has a context sentence before it (1.16 the UN card, 1.30 Wilson's card, 3.07 Harari's price) and grows out of that carrier and back.
- **Strings:** `F.SOURCES` = the on-screen lines after the fact check, on **vo-v5**: `metr` 'DOUBLES ROUGHLY EVERY 3.5 MONTHS' (source line
  quotes METR's "roughly every 3.6 months"), `fewMonths` 'DOUBLES EVERY FEW MONTHS', `notFew` 'NOT IN A FEW MONTHS', `m430` '~$430 MILLION'
  ("in its last budget"), `b700` + `b700Sub` 'MOSTLY ON AI', `early` 'AN EARLY TEST', HumaneBench = "fifteen chatbots" (no model names),
  `leadersSrc` (UN News, 20 Nov 2026). **Never a "4 months" on screen.** Use the keys, never retype a figure; any string you need that is not
  there goes into your report. Long source lines break into two lines (y 852 / 880) by themselves (`F.source`).

## 5 · Rules (from the owner; see MOTION.md §3–§7)
- A motion-design film, not a world: every picture shows its sentence; objects turn into the next object; carriers at every change;
  1–2 moving things; nothing from nowhere, no ghost fades, no crossfade, no black, nothing frozen. Big area changes ≥ 1.6 s (sineIO), small
  hits on the word (≤ 2 hard accents per 30 s, then ≥ 0.8 s calm). A colour flood or a big scale change goes in log space over ≥ 1 s, or
  calm.py counts it as a cut (lesson from the hook).
- Colour code: GOLD = the machine, ONE hero light per frame · OCHRE = the old reflexes (never red) · CREAM = rules / what can be set · COOL =
  screens · the yellow coat = only you. The past = screen left, the race = screen right. Data: label every series directly, never colour alone.
- No clock face, no hourglass, no calendar as a hero, no stairs, no robots, no brains, no server racks, no globes, no logos, no real headline,
  no model names, no real faces outside the clips, no AI images, no 3D game look. No QR, no sponsor. Nothing from MOTION.md §7 "Nicht wiederholen".
- Nothing important below y 880 (burned-in subtitles). Text ≥ 22 px, ≤ 6 words per statement + one number (verbatim quotes may be longer),
  held ≥ 1.5 s. Sources 22 px at y 880 (`F.source`).
- Files: you own ONLY `scenes/scNN.mjs` of your chunks (+ an optional `lib/bN_*.mjs` of your own). Kit/world wishes: a local helper in your
  file, or ask the lead in your report. Never edit `lib/f75_*.mjs`, `lib/stub*.mjs`, `film.mjs`, `audio/`, `tools/`, `docs/`. No videos or large
  files in the repo; renders go to `/tmp/claude-0/f75/<you>/` (b1, b2, b3); only small jpgs (< 1 MB) to `<ROOT>bild/` (network mount: never
  search the whole project folder; re-read a file ~10 s after writing it). Commit only your own files (`git add` by path), never push.

## 6 · Render and check (per chunk, then for your whole group)
Measure BEFORE you call a chunk done; the numbers go into the report.
```
node -e "import('./film.mjs').then(async m=>{const k=await import('./lib/kit.mjs');const R=m.chunkRanges(k.timing(m.TIMING));for(const[i,v]of Object.entries(R))console.log(i,v.a.toFixed(2),v.b.toFixed(2))})"
SECS=c02 node render.mjs --snap 54,55,56 --dir /tmp/claude-0/f75/b1/snap --scale .5         # stills (every 0.5–1 s + every carrier)
SECS=c02 node --expose-gc render.mjs --out /tmp/claude-0/f75/b1/c02.mp4 --from 53.72 --to 89.52 --scale .6667 --preset veryfast
python3 tools/calm.py /tmp/claude-0/f75/b1/c02.mp4 --scale 1280:720      # cuts/min ≤ 0.9 (only your W), mafd median ≤ 0.43
python3 tools/still75.py /tmp/claude-0/f75/b1/c02.mp4                     # still < 5 %, no still run > 2 s (grain-robust)
python3 tools/smooth.py /tmp/claude-0/f75/b1/c02.mp4 53.72                # no LURCH > 12 except planned cuts, no POP
SECS=c05,c06 node tools/seam.mjs --at 255.46 --dir /tmp/claude-0/f75/b1/seam   # your seams and your inner chunk boundaries
node tools/anchors75.mjs                                                   # all anchors found
```
(Times in these commands are for rendering only; get them from `chunkRanges`, never put them in scene code.) calm.py's "static" share
over-reads the grain; the still check that counts is `still75.py` (0.5 s windows on a 160×90 downscale, still when the mean abs frame
difference < 0.35). Contact sheet of your whole group (every ~2 s, < 1 MB) to `/tmp/claude-0/f75/<you>/` and `<ROOT>bild/<chunk>_kontakt.jpg`.
Final 1080p chunks: `python3 tools/f75_clips.py render --only c02,c03` (pieces ≤ 20 s, resumable); assembly with subtitles and the mix
(`/tmp/claude-0/f75/audio/mix.wav`, `audio/untertitel/subtitles.ass`): `python3 tools/f75_clips.py assemble` (the lead).

## 7 · Report (≤ 200 words, in German)
Chunks done; §13 checklist ticked with numbers (share of your chunks, W count, cuts/min, calm mafd, still share and longest still run);
check results (smooth, seam, anchors); any string you used that is not in `F.SOURCES`; kit wishes; open issues; contact sheet path; commit hash.
