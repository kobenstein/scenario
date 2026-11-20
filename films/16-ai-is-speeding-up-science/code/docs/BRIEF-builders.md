# Film 15 · Builder-Brief (3 Builder parallel, ein Checkout) · Stand 2026-10-28

Jakob hat den ganzen Film ohne Stil-Test freigegeben („I trust you to make top world-class motion design“). Der Lead Bild hat Kit, Shotliste, Nähte und den Hook (0–44,40 s) gebaut; der Hook ist das Muster. Den Rest bauen **drei Builder gleichzeitig: B1, B2 und B3**, im selben Checkout `films/15-century/`.

## 0 · Pflicht vor der ersten Zeile Code
1. **Vier Skills laden** (Skill-Tool) und befolgen: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Veraltet darin: „Hyperframes“/three.js. Wir zeichnen mit der eigenen Engine in Canvas 2D (2.5D-Karten vor `cam3`).
2. **Lesen**, in dieser Reihenfolge:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (verbindlich)
   2. `docs/MOTION.md` (Welt, Objekte, Palette, Budgets, Kit)
   3. `docs/shots.md` (deine Shots mit Wort-Ankern, Ebene, Trägern und Übergängen; bindend)
   4. `docs/EDITORIAL-KIT.md` (2.5D-Bühne, API)
   5. `/mnt/project-files/scenario/film-jahrhundert/vo-v3.txt` (deine Absätze) und `geruest-v1.md` (Bildwelten je Station)
   6. `/mnt/project-files/scenario/film-jahrhundert/faktencheck.md` (nur diese Zahlen; Liste der Einblendungen in `shots.md` §4)
3. **Ansehen:** den Hook. Vorschau `/mnt/project-files/scenario/film-jahrhundert/render/build/hook_preview_720p.mp4` (720p, klein) und Kontaktbogen `…/render/build/hook_kontakt.jpg` (1 Bild/s). Volle Qualität rendert ihr selbst ins eigene Scratchpad, z. B. Stills: `SECS=c01,c02 node render.mjs --snap 0,6,10,16,20,22.5,24.5,30,33,35.5,39,43.6 --dir $SP/f15/hook --scale .5`. Dazu der Code `scenes/sc01.mjs`. Er ist Muster und Qualitätsziel:
   - eine Plansequenz pro Chunk (ein Eintrag), Kamera aus `camAt`-Keys auf Wörtern, Drift ≥ 1,4;
   - Reaktionen aus Positionen berechnet (die Phiole reitet `band.atM(m)`, der Ring rastet auf dem Etikett aus `vial().label` ein);
   - Zahlen und Zeilen steigen von der Grundlinie (`F.numberBlock`, `F.maskLine`), nichts blendet halbtransparent ein;
   - Flug in ein Ding als Portal (`MOTION.md` §7), Ausgang über eine Platte.

## 1 · Aufteilung (Zeiten aus `timing.json`; im Code nur über Wörter ankern)
| Builder | Chunks | Zeit (s) | Dauer | Inhalt |
|---|---|---|---|---|
| Lead | c01, c02 | 0–44,40 | 44 s | Hook (fertig, `scenes/sc01.mjs` + `sc02.mjs`): Thumbnail-Motiv, Band, Zitat, Flug in Fach 1, −42 %, „approved: 0“, Why? |
| **B1** | c03, c04, c05, c06 | 44,40–198,46 | 154 s | Station 1 (Tumor als Text, Phiole, Umschlag, 1.137), **Station 2 = Anker 2** (die Fächer werden beschriftet, Uhr, Startlinie, Labor), Station 3 (AlphaFold, Nobel, Weltkarte, Kapsel teilt sich), Station 4a (Weg durch die Tests, 9 von 10, Phase 2, Zelle in Echtzeit) |
| **B2** | c07, c08, c09, c10, c11 | 198,46–380,30 | 182 s | Station 4b (Juni-Zitat, fünf Jahre, verschobenes Datum, Mitte-Abo), Station 5 (Lebenslinie, deine Karte, erster Morgen), **Station 6 = Anker 3, Wende** (Medinawurm, leeres Bett, das Fach glimmt), Station 7a/b (Hepatitis C, 1 von 5, Reichweite, HIV-Spritze in Sambia) |
| **B3** | c12, c13, c14 + Endscreen | 380,30–524,94 | 145 s | Station 7c/d (40 $, Lizenz, Vertrag vor der Zulassung, Kreis der Länder; du: Test, Studie, eine Zeile im Vertrag), **Schluss = Anker 4** und Endscreen (16,8 s) |

Die Grenzen liegen auf Abschnittsanfängen (`T.seg(id).start`). B2 ist etwas länger, hat aber zwei kurze Chunks (c08, c10) und eine Mitte-Abo-Strecke; B3 trägt dafür Schluss-Anker und Endscreen.
Chunk-Grenzen innerhalb einer Gruppe: c03|c04 85,16 · c04|c05 129,84 · c05|c06 157,32 · c07|c08 244,20 (darin Mitte-Abo s07 234,96–242,80) · c08|c09 271,60 · c09|c10 306,24 · c10|c11 331,00 · c12|c13 433,36 · c13|c14 477,56 · VO-Ende 508,14 · Filmende 524,94.

**Die Anker (Schachtel und Band) gehören genau diesen Shots:** B1 4.01–4.03 · B2 9.05 · B3 14.01–14.07. Sonst nirgends. Die Schachtel zeichnet ihr mit `F.box10` (Draufsicht `beta: 1`), das Band mit `F.paperBand`; das Hook-Muster dafür steht in `sc01.mjs` (`drawA`). Gleiche Proportionen, gleiche Farben, damit man sie wiedererkennt.

## 2 · Die Nähte zwischen den Gruppen (fest, vom Lead definiert)
Die Gruppen-Nähte liegen auf einem **gemeinsamen Bild**, einer *Platte* aus `lib/f15_seams.mjs`. Beide Seiten zeichnen die Platte aus derselben Funktion mit demselben `t`, also sind die Frames links und rechts der Naht identisch. Ansicht: `node tools/seam_plates.mjs $SP/f15/plates`.
- Die abgebende Seite steuert ihre letzte Bewegung so, dass das Bild in der Platte ankommt, und zeichnet die Platte für `t ∈ [T0 − 0,5, T0)` deckend über alles (`if (t >= T0 - SEAM_HALF) { plateX(ctx, t); return; }`).
- Die übernehmende Seite zeichnet sie für `t ∈ [T0, T0 + 0,5)` und lässt ihre Welt aus ihr wachsen: die Platte wird ein Ding der neuen Welt, nie per Blende.
- Hilfen: `seamWindow(t, T0)`, `SEAM_HALF`, die Konstanten der Platte (`CELL`, `DIVIDE`, `SHOT`) für Position und Größe.

| Naht | T0 (Anker) | Platte | Abgabe (Ende der Gruppe davor) | Übernahme (Anfang der Gruppe danach) |
|---|---|---|---|---|
| **Lead → B1** | `T.seg('s02').start` (44,40) | `plateCell`: **der Tumor als Text.** Neun Zeilen A C G T auf Indigo, die mittlere hell, kühler Lese-Cursor bei x 962; die Zeilen laufen mit `CELL.v` px/s nach links (`cellShift(t)`). | 2.05 (fertig): Flug durch das Loch der „0“, in dem die Zeilen schon laufen. | 3.01: weiterlesen mit `F.genomeRows(ctx, CELL.x, CELL.y, CELL.w, t, { rows, pitch, size, shift: cellShift(t), seed: CELL.seed, cursor: CELL.cursor, hi: 1 })`, dann Rückzug: es ist eine Seite. |
| **B1 → B2** | `T.seg('s06').start` (198,46) | `plateDivide`: **eine Zelle, die sich teilt.** Eine lebende Zelle aus warmem Licht in der Bildmitte (`F.cell`, `split .8`: Erdnussform mit klarer Taille, zwei Kerne), kühler Staub. | 6.06: links der schnell kreisende Ring, rechts die Zelle, die sich in Echtzeit teilt; auf „years“ Push auf die Zelle, bis sie bei `DIVIDE.x/y/r` steht. | 7.01: die Teilung endet, die Tochterzellen treiben auseinander und werden die zwei goldenen Anführungszeichen der Juni-Zitatkarte. |
| **B2 → B3** | `T.seg('s12').start` (380,30) | `plateShot`: **die Spritze, unterwegs.** Die HIV-Spritze aus Licht (`F.syringe`, Nadel rechts) quer in der Mitte, eine feine Goldspur von links hinter ihr. | 11.07: die Spritze fliegt quer durch die Nacht und kommt bei `SHOT.x/y/len` zur Ruhe. | 12.01: die Spritze klont sich zu einer Reihe Kopien („cheaper copies“), `$40` steigt von ihrer Grundlinie. |

**Innen-Platten (optional, gleiche Mechanik):** `platePill` (B1, c05 → c06 bei `T.seg('s05').start` 157,32: die geteilte Kapsel) und `plateReach` (B2, c10 → c11 bei `T.seg('s11').start` 331,00: die Straße aus Licht). Nehmen oder eigene Träger bauen.
Nähte innerhalb deiner Gruppe (Chunk zu Chunk) baust du selbst: gleiche Kamera und gleicher Trägerzustand im letzten Frame von cN und im ersten von cN+1; am einfachsten eine gemeinsame Zeichenfunktion in deinem eigenen `lib/f15_bN_*.mjs` (so machen es `sc01`/`sc02` mit `hook(T)`). Übergang und Träger stehen in `shots.md`.

## 3 · Harte Regeln für Bild und Grafik (Jakob)
- **Kein Computerspiel-Look.** Flache Stauffer-Formen, Korn, Nachtblau/Indigo + Gold, viel Raum. Keine glänzenden 3D-Körper, keine HUDs, keine Spielfiguren-Perspektive.
- **Etwa 2/3 Explainer, 1/3 Szene** (gemessen in `shots.md`: 69 %). Die Ebene steht pro Shot in `shots.md`.
- **Jeder Übergang wird von einem Objekt getragen.** Nie Fade, nie Wischer, nie Blende.
- **Ruhe:** ≤ ~1 harter Weltwechsel pro Minute (die Liste in `shots.md` §3 ist fertig; keine neuen Orte erfinden), langsame Kamera, 1–2 bewegte Elemente gleichzeitig, kein Stillstand > 2 s, nichts blendet halbtransparent ein.
- **Grafiken:** eine Aussage pro Grafik, höchstens **eine Zahl und ≤ 6 Wörter plus Quelle**, ohne Ton lesbar, Licht auf Nachtblau. Keine Folien, kein Gitter, keine Legenden, keine Rahmen. Nur Zahlen aus `faktencheck.md` / `vo-v3.txt` (`shots.md` §4). Im Bild „artificial intelligence“, **nie „AI“**.
- **Du** in Gelb ist die einzige gelbe Form im Film. Andere Menschen: Indigo-Silhouetten; „behandelt/erreicht“ = warmes Creme-Licht.
- **Schachtel und Band nur an den 4 Ankern** (§1).

## 4 · Was du anfassen darfst und was nicht
- **Nur deine Dateien:**
  - B1: `scenes/sc03.mjs` … `sc06.mjs`;
  - B2: `scenes/sc07.mjs` … `sc11.mjs`;
  - B3: `scenes/sc12.mjs` … `sc14.mjs`;
  - dazu deine eigenen Module `lib/f15_b1_*.mjs`, `lib/f15_b2_*.mjs` oder `lib/f15_b3_*.mjs`.
- **Nicht ändern:**
  - `lib/f10_editorial.mjs`, `lib/f15_kit.mjs`, `lib/f15_seams.mjs`, `lib/f13_kit.mjs`, `lib/kit.mjs`, `lib/stub.mjs`;
  - `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`;
  - `scenes/sc01.mjs`, `sc02.mjs` (Lead) und die Dateien der anderen Builder.
- **Fehlt etwas im Kit oder stört ein Fehler:** in deinem Modul lösen und im Bericht als Kit-Wunsch melden. Kit-Änderungen macht nur der Lead.
- **Eine Szenendatei:** `export default async (T, R) => { E.prepareEditorial(); return [entries]; }`, mit `entry = { t: R.a, draw(ctx, t), print: F.PRINT15 }`.
  - Ein Chunk ist normalerweise **ein** Eintrag (Plansequenz).
  - Ein zweiter Eintrag ist ein harter Schnitt und nur erlaubt, wenn `shots.md` dort eine Match-Fahrt mit reimendem Träger nennt.
- **Kein Commit, kein Push.** Alle drei arbeiten im selben Checkout; der Lead bzw. der Koordinator committet. Kein `git checkout`, kein `git stash`, kein `git reset` (das träfe die Arbeit der anderen). Hilfsdateien nur in `.bNtmp/` (von git ignoriert, bitte prüfen) oder im Scratchpad.

## 5 · Kit-Stand (vom Hook)
- `F.paperBand(ctx, spine, t, { w, twist, slide, marks, ink, light, glow })` gibt `{ at(s), atM(m) }` zurück (Punkt, Winkel, Breite, Normale): Träger fahren auf dem Band.
- `F.box10(ctx, x, y, w, t, { beta, lid, lit[10], cool[10], labels[10], paper, inside(i, rect) })` gibt die Zellen-Rechtecke zurück. `beta 1` = Draufsicht. `labels` sind `F.paperLabel`-Streifen. `inside` zeichnet **in** eine Öffnung (Portal).
- `F.vial`, `F.pill`, `F.cell` (Teilung, `split`), `F.syringe`, `F.reticle` (Ring der Maschine, `lock`), `F.genomeRows` (Zeilen, Marken, Cursor), `F.numberBlock`, `F.source15`, `F.paperLabel`, `F.inkLine`, `F.trailSpan` (Goldfaden), `F.maskLine` (Zeile steigt von der Grundlinie, Teile gold färbbar).
- `E.du(ctx, x, footY, h, { pose, armR, armL, look, light, rim })` gibt die Handpunkte zurück. Von oben gesehen verkürzt sich die Figur: `ctx.scale(1, cos(…))` um einen Punkt in der Schachtel (siehe `sc01` „seen from above“).
- **Himmel:** `E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, P.ind0]], …)`, Aufhellung mit `P.ind1`, Luma 40–60.
- **Finish:** `F.PRINT15 = { grain: 14, floor: 4, vig: .5 }`; Vignette und Korn setzt `film.mjs`, nicht du.
- **Speicher:** keine Canvas, kein Pattern pro Frame. Gemessenes (Handpunkte, Zellen der Schachtel) einmal beim Laden auf einer kleinen Scratch-Canvas bestimmen und cachen (`let CACHE`).

## 6 · Rendern (4 Kerne, 15 GB für alle drei)
`SP` = dein eigenes Scratchpad (aus deinem Systemprompt). Arbeitsordner `$SP/f15/bN/`. **Nichts Großes nach `/mnt/project-files`** (Mount fast voll).

**Review-Stills** (halbe Größe):

```
cd /home/user/scenario/films/15-century
SECS=c07 node render.mjs --snap 199,200.5,202 --dir $SP/f15/b2/snap --scale .5
python3 tools/contact.py $SP/f15/b2/snap $SP/f15/b2/snap_sheet.jpg 5 1900
```

Danach den Kontaktbogen **ansehen** (Read-Tool), plus 2–3 Hero-Bilder in voller Größe (`--scale 1`).

**Video** (volle Qualität):
- Stücke ≤ 20 s, immer mit `--expose-gc`; pro Builder läuft nie mehr als ein Render gleichzeitig.

```
SECS=c07 node --expose-gc render.mjs --out $SP/f15/b2/c07_a.mp4 --from 198.46 --to 218
SECS=c07 node --expose-gc render.mjs --out $SP/f15/b2/c07_b.mp4 --from 218 --to 238
```

Danach mit `ffmpeg -f concat -safe 0 -i list.txt -c copy $SP/f15/bN/cNN.mp4` zusammensetzen.

**Abgabe je Chunk:**
- Video: `$SP/f15/bN/cNN.mp4`; der Pfad steht im Bericht.
- Kontaktbogen (1 Bild/s, klein, ≤ 400 KB): `/mnt/project-files/scenario/film-jahrhundert/render/build/cNN_kontakt.jpg` (das ist die einzige Datei, die auf den Mount darf).

## 7 · Pflicht-Prüfungen je Chunk (Werte in den Bericht)
1. **Kontaktbogen angesehen** (1 Bild pro 0,5–1 s plus jeder Übergang) und alles Hässliche oder Unklare behoben. Mindestens 3 Review-Runden. Dabei prüfen:
   - Jedes Bild ist ein Plakat. Satz = Bild. Der Held ist das Hellste.
   - Du bist nie abgeschnitten, außer in einer bewussten Fahrt.
   - Text ist lesbar (Handy-Kopie 390 px breit). Eine Zahl, ≤ 6 Wörter, Quelle.
   - Keine hängenden Reste (Linien ohne Text, Schatten ohne Ding): im Hook hing einmal der Goldfaden ohne Zitat, weil ein Anker falsch traf.
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: 0 Schnitte (außer geplanten Match-Fahrten), mafd-Median ≤ ~0,45, Luma 40–60. (Hook: 0 · 0,347 · 51,4.)
3. `python3 tools/smooth.py <cNN.mp4> <startsekunde>`: **0 Ruckler** (keine LURCH/POP). LURCH kommt fast immer von einem expo-in-Zoom oder einem Halo, der beim Öffnen hart wegspringt.
4. `SECS=cNN,cMM node tools/seam.mjs --at <Grenze>` an jeder Chunk-Grenze und jeder Render-Naht: keine Flags (BLACK, FROZEN, POP). FROZEN heißt: zwei fast gleiche Frames, meist eine `camAt`-Fahrt, die am Key ausrollt, ohne Drift. An den Gruppen-Nähten prüft der Lead mit beiden Seiten; prüfe trotzdem deine Seite (`--at T0`).
5. **Ruhe-Regeln** (`MOTION.md` §5): 1–2 bewegte Hauptelemente · kein Stillstand über 2 s · 1,5–3 s Halten nach Akzenten · nichts aus dem Nichts · keine Blenden.
6. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Dingen · Text. Nichts unter 4.

## 8 · Bericht (kurz, deutsch)
- Chunks fertig, mit Pfaden zu Videos und Kontaktbögen.
- Messwerte je Chunk: calm, smooth, seam.
- Kit-Wünsche.
- Offene Stellen und Abweichungen von `shots.md`, mit Grund.
- Welche Dateien du angelegt oder geändert hast (damit der Lead gezielt committen kann).
