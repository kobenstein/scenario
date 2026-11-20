# Film 15 · „Superintelligence Promised 100 Years of Progress in 10. Is It Starting?“ · Motion-Regeln (Lead-Brief für alle Builder)

Stand 2026-10-28 (Lead Bild, v1). The Good Takeoff, Englisch, 1920×1080, 30 fps. Text `film-jahrhundert/vo-v3.txt` (eckige Klammern werden nicht gesprochen), Timing `film-jahrhundert/audio/timing.json` (Abschnitte `s00` … `s15`, Wortzeiten global in s; VO-Ende 508,14 s, danach der Endscreen bis 524,94 s, der sich weiter bewegt). Bindende Shotliste: `shots.md` (Quelle `tools/shots15.py`). Stil: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (gilt vor allem anderen). Gerüst und Bildwelten: `film-jahrhundert/geruest-v1.md`.
Leitidee: *Uns wurden hundert Jahre Fortschritt in zehn versprochen. Wir haben nachgesehen, ob es anfängt: Fach für Fach. Man wird das Jahrhundert nicht hören; man merkt es daran, was aufhört.*

Lies das ganz, bevor du eine Zeile Code schreibst. Der Film ist **gezeichnet** (Canvas 2D, Node, eigene 2.5D-Bühne), keine KI-Bilder, kein Bild-zu-Video, kein Footage. Ruhig, cineastisch, lösungsorientiert, **kein Computerspiel-Look**.

---

## 0 · Status
- **Kein Stil-Test** (Jakob: „I trust you to make top world-class motion design“). Der Hook `scenes/sc01.mjs` (c01 + c02, 0–44,40 s, Shots 1.01–2.05) ist gebaut und ist **das Muster und Qualitätsziel** für alle Builder: eine Plansequenz von 44 s, Kamera aus `camAt`-Keys auf Wörtern, Flug durch ein Fach (Portal), Reaktionen aus Positionen, Zahlen steigen von der Grundlinie, Naht über eine Platte.
- Der Rest entsteht durch drei Builder (B1, B2, B3), Aufteilung und Regeln in `BRIEF-builders.md`. Fehlende Chunks rendern als Platzhalter (`lib/stub.mjs`).
- Daten-Wurzel: `lib/kit.mjs ROOT` = `$F15ROOT` oder `/mnt/project-files/scenario/film-jahrhundert/`. **Renders, Frames, Kontaktbögen nie dorthin** (der Mount ist fast voll), sondern ins eigene Scratchpad.
- **Immer über Wörter ankern** (`T.S('s09', 'Ten')`, `T.E(…)`, `T.seg('s12').start`), nie über Sekunden. Vorsicht beim Anker: `T.S` nimmt den **ersten** Treffer im Abschnitt und vergleicht das **letzte** Wort mit `startsWith`. Im Hook traf `A('big')` „biggest“ (11,48 statt 18,28) und `A('Whether')` traf „whether“ in „Not whether“: Phrase verlängern (`"It's a big"`, `"Whether it's starting"`) oder `nth` setzen, und die Zeit einmal ausgeben.

## 1 · Motion-DNA (eine Zelle: ruhig + weich, Editorial)
- **Ton:** ruhiger Editorial-Dokumentarfilm. Akzente nur auf dem Schlüsselwort eines Satzes, Tempo-Kontrast 3–5×: kurzer Akzent, dann langes, lebendiges Halten (1,5–3 s).
- **Easing:** Auftritte und Landungen expo-out, Abgänge expo-in, Bewegungen quart in-out, **Kamera sinus-S** (`camAt` mit `s`), nie linear außer konstanter Mechanik (Lese-Cursor, Zeilen laufen). Kein Federn, höchstens 3 % Überschwingen.
- **Zoom und Flug immer logarithmisch** (Maßstab `exp(lerp(log a, log b, e))`): ein Flug in ein Ding, das 17× größer wird, wirkt nur auf log-Skala gleichmäßig. Ein expo-in-Zoom am Ende eines Flugs ruckt (`smooth.py` LURCH): beidseitig weich (`sineIO`) oder mit einem kleinen linearen Anteil, damit die nächste Einstellung die Bewegung übernimmt.
- **Basiseinheit 0,4 s.** Mikroakzent 0,25–0,35 s · Auftritt 0,4–0,7 s · Handbewegung 0,8–1,2 s · Kamera ≥ 1,6 s, Fahrten 2,5–4 s. Passt eine Fahrt nicht zwischen zwei Wörter, beginnt sie früher, nie schneller.
- **Ursache und Wirkung:** Berührt A B, reagiert B 40–120 ms später mit kleinerer Amplitude (Phiole fällt in die Schachtel → Fach 1 glimmt; Marke glimmt → Buchstabe hebt sich).
- **Keine Blenden:** kein Crossfade, kein Fade über Schwarz, kein Slide, kein Wischer, kein Spiel-3D, keine primitiven 3D-Körper. Übergänge sind Plansequenzen, Fahrten, Verwandlungen, Flüge in eine Fläche (Portal), Match-Fahrten. **Jeder Übergang hat ein Objekt als Träger** (`shots.md`, Spalte Übergang).
- **Nichts wird halbtransparent eingeblendet.** Dinge wachsen, steigen von einer Grundlinie (`maskLine`), werden gereicht, geschrieben, gefaltet oder fliegen herein. Licht darf auf- und abschwellen (eine Lampe geht an), ein Körper nie.

## 2 · Die Welt und der Lichtbogen
**Eine Nacht, an deren Ende der erste Morgen steht.** Nachtblau/Indigo + Gold, viel Raum. Jede Station hat **ihre eigene Bildwelt** (Gerüst „Bildwelt“, Jakob: ein Bild für den ganzen Film wird zum Computerspiel); die Schachtel und das Band sind nur ein Anker an 4 Stellen (§3).

| Abschnitt | Welt | Held (das Hellste im Bild) |
|---|---|---|
| c01–c02 Hook (Anker 1) | Felskante bei Nacht; im Fach 1 ein Raum mit Phiole | das Papierband aus Licht → Phiole → die „0“ |
| c03 Station 1 | Explainer-Nacht: der Tumor als Text | die gelesene Zeile, Goldmarken → Phiole |
| c04 Station 2 (Anker 2) | Schachtel in Draufsicht, Zifferblatt, Startlinie, Bahn | die Papierstreifen → das eine Laborfenster |
| c05 Station 3 | Labor unter der Lampe, Weltkarte | Protein aus Licht → Kartenpunkte → Kapsel |
| c06–c07 Station 4 | der Weg durch die Tests, Zitatkarte, Kalender | Kapsel → die Zelle, die sich teilt |
| c08 Station 5 | Lebenslinie, Landschaft vor Tagesanbruch | die Goldlinie → der erste Morgenstreifen |
| c09 Station 6 (Anker 3, Wende) | Dorf mit Brunnen, Krankenzimmer | Strichliste → das Fenster → **das Fach glimmt, weil etwas aufhört** |
| c10–c11 Station 7a/b | Hepatitis-Packung, Straße aus Licht, Klinik in Sambia | Packung → Straße → Spritze |
| c12–c13 Station 7c/d | Vertrag aus Licht, du in der Straße | die Kopien, der Kreis der Länder → die eine Vertragszeile |
| c14 + Endscreen (Anker 4) | Felskante, du trägst die Schachtel | ein Fach glimmt, erstes Licht am Horizont |

Warm und hell heißt: kommt bei Menschen an. Kühl (`F.COOL`, `F.COOL_HI`) heißt: noch nicht, Maschine, Durchschnitt. **„Dunkel“ heißt „noch nicht“, nie „gescheitert“** (Fairness-Regel des Gerüsts).

## 3 · Durchgehende Objekte (die Grafiksprache)
1. **Die Schachtel mit zehn Fächern** (`F.box10`) und **das Papierband der hundert Jahre** (`F.paperBand`) erscheinen **nur an 4 Ankern**: Hook (Thumbnail: du hältst die kleine Schachtel, das riesige Band mit Jahresmarken quillt heraus), Station 2 (die Fächer werden beschriftet), Station 6 (Wende: ein Fach glimmt, weil etwas aufhört: Medinawurm) und Schluss. Dazwischen nie, auch nicht als Icon.
2. **Du** (gelbe Regenjacke `#f2b632`, Kapuze, `E.du()`): klein, gesichtslos. Niemand sonst trägt Gelb; andere Menschen sind schlichte Indigo-Silhouetten, „behandelt/erreicht“ ist warmes Creme-Licht, nie Gelb.
3. **Die Maschine = der Ring** (`F.reticle`, kühl-creme): sie zielt, liest, kreist. Nie Roboter, Gehirn oder Platine. Auf dem Bildschirm heißt es „artificial intelligence“, **nie „AI“**.
4. **Papier und Tinte** (`F.paperLabel`, `paperBand` mit `ink`): Versprechen, Etiketten, Lizenzen, Verträge, Klebezettel, Briefe sind Papier aus Licht mit dunkler Tinte. Was geschrieben wird, schreibt sich (links → rechts).
5. **Gold = was wirkt** (Goldmarken im Erbgut, Goldfaden, die Lücke zwischen den Kurven, die Dosis in Phiole und Spritze). Der Goldfaden (`trailSpan`) ist Träger und Explainer-Strich zugleich.
6. **Die Phiole** (`F.vial`), **die Kapsel** (`F.pill`), **die Zelle** (`F.cell`), **die Spritze** (`F.syringe`): die Medizin-Dinge des Films. Jede Station reicht eines an die nächste weiter (Träger).

## 4 · Palette (exakt aus dem Stil, `P` in `lib/f10_editorial.mjs`)
| Rolle | Hex / Name |
|---|---|
| Nacht, tiefster Grund | `P.night0` `P.night1` `P.night2` |
| Indigo, Flächen, Himmel-Aufhellung | `P.ind0` `P.ind1` `P.ind2` |
| Blau, Licht auf Formen, Randlicht | `P.blue0` `P.blue1` `P.blue2` |
| Gold, Lichtkern | `P.core0` `P.core1` |
| Gold, Halo | `P.halo0` `P.halo1` `P.halo2` |
| Gold, Schatten / Tinte | `P.shade0` `P.shade1`, `F.INK` |
| kühl (Maschine, „noch nicht“) | `F.COOL`, `F.COOL_HI` |
| Regenjacke (nur du) | `P.coat` `#f2b632` |
| Schrift | Creme `P.cream` mit warmem Glühen; Quellen `P.halo2` |

Himmel tiefes Indigo (kein Mittelblau-Teppich). Grain dezent: `F.PRINT15 = { grain 14, floor 4, vig .5 }`, das Korn wechselt mit 10 Hz. Korn ist Textur, nie Effekt. Luma-Mittel 40–60 (Hook: 51).

## 5 · Regeln gegen Hektik (messbar)
- **Weltwechsel:** ≤ ~1 harter Weltwechsel pro Minute (`shots.md` §3: 9 harte auf 8,75 min). Alles andere sind Plansequenzen und Verwandlungen.
- **Bewegungsbudget:** höchstens 1–2 bewegte Hauptelemente gleichzeitig, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, `camDrift`, `cameraFloat`) zählt nicht.
- **Kein Stillstand > 2 s, und nie zwei gleiche Bilder hintereinander.** Ein Halt ist ein langsamer Push. `camDrift(c, t, ≥ 1.4)` statt der alten 0,8: mit 0,8 meldete `seam.mjs` im Hook FROZEN (Δ ≈ 0,1), sobald eine `camAt`-Fahrt an ihrem Key ausrollte.
- **Ein Motiv pro Satz**, das Bild zeigt, was der Satz sagt. **Nichts aus dem Nichts.**
- **Halten 1,5–3 s nach jedem Akzent.** Text steht ruhig, solange er gelesen wird (≥ 1,5 s, ≥ Zeichen/12 s).
- **Hook ohne Pause:** zwischen 35 und 50 s keine Pause, keine Titelkarte, kein ruhiger Halt (Hook-Ende 2.04 → 2.05 → 3.01 fließt durch die „0“).
- **Messung vor jedem Bericht:** `python3 tools/calm.py <mp4> --scale 1280:720` (Schnitte 0, mafd-Median ≤ ~0,45, Luma 40–60), `python3 tools/smooth.py <mp4> <start>` (**0 Ruckler**: keine LURCH/POP), `SECS=cNN node tools/seam.mjs --at …` an jeder Chunk- und Render-Naht (keine Flags). Hook-Werte als Messlatte: calm 0 Schnitte, mafd 0,347, Luma 51,4 · smooth 0 Flags.

## 6 · Text im Bild und Grafiken
- **Eine Aussage pro Grafik:** höchstens **eine Zahl und ≤ 6 Wörter plus Quelle**, ohne Ton lesbar. Licht auf Nachtblau. **Keine Folien, kein Gitter, keine Legenden, keine Rahmen, keine Achsenkreuze.** Grafiken wachsen aus den Dingen des Films (Phiole, Kapsel, Zelle, Papier, Goldfaden, Ring, Strichliste, Lichtpunkte) und gehen in eines zurück.
- `F.numberBlock` ist die Grammatik: Zahl (Instrument Serif, Creme, ≥ 120 px), Label (Inter 600 Versalien, ≥ 34 px), Quelle (`F.source15`, Inter 600, 22 px, `P.halo2`), jede Zeile steigt von ihrer eigenen Grundlinie, versetzt.
- **Nur Werte aus `faktencheck.md` und `vo-v3.txt`;** die vollständige Liste der erlaubten Einblendungen mit Quellen steht in `shots.md` §4. Bildnotiz-Korrekturen beachten: „OVERALL SURVIVAL · DATA IMMATURE“ (nicht „not yet analysed“), Südafrika seit **Juni** 2026, „approved: 0“ immer mit „as of Oct 2026“, Juni-Zitat mit „I think“ und ohne Namen.
- Untertitel-Band unten (y > 910) frei halten, außer für Quellen bei y ≤ 890.

## 7 · Kit
- `lib/f10_editorial.mjs` (Editorial-Nacht-Bühne, `E`): `card`, `cam3`, `camAt` (Keys `[t, cam, ease]`, ease `s|q|i|o` gilt für das Stück, das am Key endet), `camDrift`, `aim(Z, u, v, s, sx, sy, f)` (setzt einen Punkt der Karte Z mit Maßstab s auf den Bildpunkt sx, sy), `project`, `F0` · `P` · `du()` (Pose `lift` mit `armR/armL`, gibt die Handpunkte `{R, L}` zurück) · `glowText` · `halo` · `dust` · `castShadow` · `catmull` · `lightShape` · `glowFill` · `finish`.
- `lib/f15_kit.mjs` (Film 15, `F`): `paperBand`, `box10` (mit Portal-Callback `inside(i, rect)`), `paperLabel`, `vial`, `pill`, `cell` (Teilung als Cassini-Oval, `split` 0..1), `syringe`, `reticle`, `genomeRows`, `numberBlock`, `source15`, `inkLine`, `pathFrame`, `smoothPath`, `PRINT15`, Farben `INK`, `COOL`, `COOL_HI`; aus `f13_kit` re-exportiert: `maskLine`, `measure`, `trailSpan`, `textGrains`, `grainsFall`, `ledge`, `ledgeY`. Ansicht: `node tools/f15_kit_sheet.mjs <dir>`.
- `lib/f15_seams.mjs` (Lead): Platten an den Gruppen-Nähten (`plateCell` Lead → B1, `plateDivide` B1 → B2, `plateShot` B2 → B3) und zwei optionale Innen-Platten (`platePill`, `plateReach`), `SEAM_HALF`, `seamWindow`. Ansicht: `node tools/seam_plates.mjs <dir>`.
- **Portal-Technik (Hook, für Flüge in ein Ding):** die Welt B wird schon vorher **in** die Öffnung gezeichnet (Clip über `box10 inside`), mit der Kamera `aim(F0, W/2, H/2, sw/W, sx, sy)`, die das ganze B-Bild auf das Bildrechteck der Öffnung legt. Am Ende des log. Zooms füllt die Öffnung das Bild und diese Kamera ist genau `cam3()`: der Wechsel auf B ist pixelgleich (calm: 0 Schnitte). Alles, was die Öffnung überdeckt (Licht `lit`, Halo), muss vor dem Ende auf 0 gehen.
- **Tiefen:** Himmel 40000, Schwünge 7000, ferne Ebene 9000, Fokus `F0`. `cardM` gibt bei dz < 30 `null` zurück: bei starkem Zoom (Maßstab > ~50) zusätzlich die Brennweite heben (`aim(…, Math.max(F0, 80 * s))`).
- **Speicher:** keine Canvas, kein Pattern, keinen Gradient-Cache pro Frame neu bauen (Leck in `@napi-rs/canvas`); Geometrie einmal beim Laden auf einer kleinen Scratch-Canvas vermessen. Renders mit `node --expose-gc`, Stücke ≤ 20 s. Nur Seed-Zufall (`E.prng`).

## 8 · Endscreen (VO-Ende 508,14 bis 524,94 s, 14.07)
Die Schachtel steht auf der Kante, das Band liegt gefaltet darin, ein Fach glimmt; du sitzt daneben, winzig, unten Mitte. **Freiflächen:** links x 90–780, y 250–700 („best for viewer“), rechts x 1140–1830, y 250–700 („latest upload“), Mitte oben x 810–1110, y 120–330 (Abo-Knopf). **Nie statisch:** langsamer Rückzug, Sterne ziehen, das Fach atmet, erstes Licht am Horizont; die Musik trägt.
**Mitte-Abo (7.06, 234,96–242,8 s):** Bild ruhig weiter, unten rechts x 1280–1840, y 760–980 frei.

## 9 · Gates (in dieser Reihenfolge)
1. Plan zuerst: Shot in `tools/shots15.py` steht (Anker-Wort, Ebene, Bild, ≤ 2 Bewegungen, Übergang mit Träger). Abweichungen in den Bericht; die Liste ändert nur der Lead.
2. ★-Standbild des Chunks zuerst an den Lead.
3. Bauen, dann anschauen: Standbilder alle ~0,5 s um jede Fahrt und eines pro Satz (`render.mjs --snap … --scale .5`, Kontaktbogen `tools/contact.py`). Mindestens 3 Review-Runden, eine davon in voller Größe (Hero-Bilder).
4. Messen (§5), Werte in den Bericht.
5. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Dingen · Text. Nichts unter 4.
