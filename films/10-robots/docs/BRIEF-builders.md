# Film 10 · Bildbau Phase 2 · Brief für die Builder (v2)

„Superintelligence Is Getting a Body“ · The Good Takeoff. Phase 1 (Kit + c01) steht, der Look ist neu (Runde 2). Jetzt bauen drei Builder parallel c02–c12.
Bindend: `MOTION.md` (vor allem **§0a Neuer Look** und **§13 Explainer-Ebene**) und `shots.md` **v2** in diesem Ordner. Dieser Brief ergänzt sie um Code, Übergaben und Messung. v1 liegt als `BRIEF-builders-v1.md` daneben.

## 0 · Stil-Referenz (zuerst ansehen, gilt vor allem anderen)

**Ansehen, bevor eine Zeile Code entsteht:**
- Film-11-Thumbnails `/mnt/project-files/scenario/thumbnails/film-11/` und `referenzen/thumb-stil/` r1–r5 (Monolith, Hände, Auge, Stauffer).
- Die neuen Referenz-Stills `/mnt/project-files/scenario/film-roboter/stills/neuer-look/`:
  - `c01_*.jpg` + `c01_kontaktbogen.jpg` (Welt)
  - `explainer_becher_1–3`, `explainer_kurve_1–3`, `explainer_sequenzen.jpg` (Explainer: Objekt → halb verwandelt → Grafik)

**Der Look in sieben Sätzen (Kurzfassung von MOTION.md §0a):**
1. Flache Grain-Illustration auf tiefem Indigo: Himmel und Ferne fast schwarz `#070918` → `#1a2a7a`, mit Sternen.
2. **Genau eine** große warme Lichtform pro Bild (Held): cremefarbener Kern, Amber-Hof, gekörnter Abfall, Lichtkegel auf dem Boden. Zwei gleich starke Lichter sind verboten.
3. Alles andere ist dunkle Silhouette mit Randlicht. Wenig Detail: lieber eine Form weniger.
4. Die Figur („du“) in Amber/Gelb, klein vor der großen Lichtform.
5. Aufsicht = Karte aus Lichtpunkten (Häuser, Tore, Wege als Licht).
6. Mittlere Luma ~50–80 bei hohem Kontrast (Held ≥ 200).
7. Explainer = Licht auf Nacht: die Grafik wächst **aus** dem Objekt im selben Licht. Kein Rechteck-Panel, kein gerahmtes Label, keine Folie. Creme-Zahlen mit Glühen.

**Wie der Look im Code entsteht (nicht nachbauen, benutzen):**
- `film.mjs` → `finish` macht pro Frame den Relight-Grade (`gradeLUT(gradeAt(t).dawn)` + Lichtmaske aus den registrierten Helden, Bloom, Dither). Szenen malen die Welt wie bisher mit `L = K.light(K.tod(t))`.
- **Pflicht pro Frame:** den Helden registrieren, `K.heroLight({x, y, r, k, cone, coneLen, coneW, amb})` in Bildpunkten. Ohne Held wird das Bild flach (Umgebungslicht 0,7). Sonne (`skyAndSun`) und Hallen-Oberlicht (`hall`) registrieren sich selbst; Fenster, Lampen, Laternen, Funken, die Spur und jede Explainer-Grafik (`K.card` tut es) registriert die Szene.
- Warme Materialien (Holz, Ziegel, Ton) leuchten im Heldenkegel orange: ihre Grundfarbe dunkel und entsättigt halten.
- Bekannte Grenzen von Runde 2: 33 s und 40 s in c01 zu dunkel und zu leer, Absperrung und Wimpel bei 25 s zu kleinteilig. Für eure Chunks gilt: lieber eine große Lichtform als viele kleine.

## 0a · Skills laden (Pflicht)

Vor dem ersten Code die Skills **fluid-motion-design**, **world-class-motion-design**, **motion-director-gates** und **scenario-motion** laden und anwenden.
Aus scenario-motion sind drei Punkte für diesen Film **veraltet**:
- „gesichtslose Figuren“: unsere Figuren haben Gesichter (Kit `person10`).
- „keine Roboter“: dieser Film handelt von Robotern.
- „Hyperframes“: wir bauen mit der eigenen Engine.
Alles andere gilt: Farbcode, ein Held, Träger bei jedem Wechsel, nichts friert ein, ein Wow pro Szene.

## 0b · Die Explainer-Ebene und die Träger

Etwa 37 % von c02–c12 sind **[EXPL]** (shots.md v2, §4: Anteil und Momente je Chunk). Regeln aus MOTION.md §13:

- **Rein, halten, raus.** Anticipation (0,2–0,4 s) → Verwandlung 0,6–0,9 s, die Kamera fährt in das Objekt hinein → Halten 1,5–3 s (Zahl ruhig lesbar) → zurück 0,7–1 s in ein Objekt der Welt. Jede Grafik hat einen Weg hinein **und** einen Weg zurück.
- **Jakobs drei Übergangsarten:**
  - (a) Ein Objekt fliegt aus dem Bild und landet im nächsten oder wird zum nächsten.
  - (b) Zoom in ein Objekt, das zum nächsten wird.
  - (c) Schnelle Bewegung geht in schnelle Bewegung derselben Richtung über.
  - Keine Blenden, keine Wipes, keine Schnitte innerhalb der Explainer-Ebene.
- **Die Verwandlungen (MOTION.md §13.2):**

| Nr | Objekt → Grafik | Kit | Beispiele in shots.md v2 |
|---|---|---|---|
| T1 | Spur / Bogen → Kurve | `K.curve({from: Bildpunkte, dashFrom})` | 2.02, 3.11, 4.15, 6.15, 12.01 |
| T2 | Becher (Rand) → Kreis aus Anteilen | `K.cupPie({u, cup, parts})` | 8.02–8.03 |
| T3 | Gelenk / Haus / Boden → Querschnitt | `K.section('rings' \| 'layers')` | 5.07, 6.03, 6.11 |
| T4 | Tal → Karte aus Licht | `K.mapSheet` | 3.05, 7.05, 8.08, 9.03, 10.07, 10.10 |
| T5 | Hand-Kette → Ablauf | `K.flow` | 2.06, 2.12, 8.10, 10.03 |
| T6 | Uhr / Akku / Preisschild / Hocker / Striche → Kreis / Zähler / Balken / Strichliste | `K.pie`, `K.counter`, `K.bars`, `K.tally` | 3.03, 3.07, 3.09, 4.09, 6.07, 6.08, 9.06, 9.08 |

- **Text:** `K.glowText` und `K.tag` (Punkt + glühende Linie + Text, kein Kasten). Größen aus `K.EXP.size`, Labels ≥ 34 px, Quellen ≥ 24 px. Bildschirmtext sagt „artificial intelligence“, nie „AI“.
- **Träger:** In shots.md v2 hat jede Zeile die Spalte `Übergang → Träger · Position · Richtung`. Im Code steht dieselbe Angabe als Kommentar über dem Übergang. Der Träger ist in beiden Shots an derselben Bildstelle und bewegt sich in dieselbe Richtung.

## 1 · Repo, Branch, Daten

- Repo `/home/user/scenario`, Code in `films/10-robots/`. Stand Phase 1: Branch `claude/project-thread-butzw2` (Commit siehe Abschnitt 8).
- Jeder Builder arbeitet auf **seinem eigenen Branch** und ändert nur seine Szenen `scenes/scNN.mjs` und ggf. eigene Module `lib/f10_cNN_*.mjs`.
  **Nur der Lead ändert das Kit** (`lib/f10_*.mjs` ohne `cNN`, `film.mjs`, `lib/print.mjs`). Eigene Bausteine legt ihr in `lib/f10_cNN_*.mjs` an (z. B. `lib/f10_c06_mine.mjs`).
  Fehlt etwas im Kit oder ist dort ein Fehler, meldet es dem Lead mit Frame und Zeit, statt es selbst zu ändern.
- Audio in `films/10-robots/audio` und in `ROOT/audio` **nicht überschreiben**.
- Daten-ROOT: `process.env.F10ROOT`, Vorgabe ist der Scratchpad von Phase 1. Jeder Builder setzt `F10ROOT` auf seinen eigenen Scratchpad und kopiert `audio/` (timing.json, vo_master.wav, music/) und die Clip-Quellen dorthin.
  Clip-Frames: `ROOT/clips/<id>/f%05d.jpg` (30 fps, 1920×1080, schon gecroppt). Fehlen sie, zeigt `clipSlot` eine Platzhalterkarte, dann rendert alles trotzdem.
- `npm ci` in `films/10-robots`, dann Node 22. Rendern immer mit `node --expose-gc`, Stücke ≤ 20 s, nacheinander (die Engine leckt pro Frame Speicher).
- Keine Modellnamen in Code-Kommentaren. Keine großen Medien, keine Cookies committen.
- Kein Musk, kein Tesla, kein Optimus im Bild, auch nicht im Clipmaterial (shots.md §5 nennt die erlaubten Clips).

## 2 · Aufteilung

| Builder | Chunks | Zeit | Licht (tod) | Welten |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 | 74,94–292,42 | später Abend → Nacht (19,8 → 22,5 h) | Halle innen, Wohnzimmer, Tal/Straße, Wegweiser, Halle Station |
| **B2** | c06 c07 c08 | 292,42–454,14 | tiefe Nacht → Sprung bei 372 s → Sonnenaufgang (~380 s) → Morgen | ferner Hügel/Mine, Weinberg, Halle als Genossenschaft |
| **B3** | c09 c10 c11 c12 | 454,14–655,36 | Morgen 6,8 → 7,5 h → tiefe Sonne 6,9 h | Werkstätten, CUMA-Schuppen, offene Hände, Wohnzimmer → Tal, Endscreen |

Die Zeiten stehen in `film.mjs` (CHUNKS, Anker auf den Worten in timing.json) und in shots.md §2.
`SECS=c06,c07 node --expose-gc render.mjs …` baut nur die genannten Chunks (alle anderen fallen auf den Stub zurück).

## 3 · Das Kit (`lib/f10_kit.mjs`)

Einmal pro Chunk `await K.prepareKit()` im Default-Export. Jeder Frame ist eine reine Funktion von t.

**Licht, nur über tod(t).** `K.light(K.tod(t))` bzw. `K.lightAt(t)` → `L` mit `sky`, `sun`, `fog`, `shade`, `rim`, `dir`, `shadowLen`, `lit(hex, k)`, `air(hex, dist, k)`.
Keine eigenen Lichtfarben in Szenen. Wenn eine Stimmung fehlt, die TOD-Keyframes in `f10_core.mjs` ergänzen (und melden).
`L.stars` und `L.lamp` sagen, wie stark Sterne und Lampen gerade sind. Der Look (§0) entsteht im Grade, nicht in der Szene: kein eigener Blaufilter, keine eigene Vignette.
Die alten Helligkeitsziele (Luma ≥ 115) gelten **nicht** mehr. Ziel: mittlere Luma 50–80, der Held ≥ 200, die Figur immer erkennbar.

**Die Welt in Metern.** `K.view3(cam)` mit cam `{x, y, z, yaw, pitch, f}`: x rechts, y oben, z nach Norden ins Tal, yaw + dreht nach rechts, pitch + schaut hoch, f = 1700 normal.
`V.P(p)`, `V.poly(ctx, pts)`, `V.seg`, `V.line`, `V.dist`, `V.horizonY`.
**safeView ist eingebaut:** alles wird an der Nahebene (5 cm) und an einem dreifach erweiterten Frustum geclippt.
Lange Wände, Zäune, Reben, Lampen dicht an der Kamera malen dann keine Einzelbilder mehr, die als harte Schnitte zählen. Nie an `view3` vorbei projizieren.

**Die Atlas-Welt** (`K.VAL`, `K.world(ctx, t, V, L, o)`):

- Straße: Startlinie bei x −130, Gabel bei x 40, links der Abzweig zur Halle, rechts zum Haus.
- Fluss bei z ≈ 300.
- Halle: Pivot `[0,0,214]`, um 0,62 rad gedreht, 28 × 60 m, Sheddach mit 4 Zähnen. Lokale Koordinaten über `K.hallView`, `K.hallToWorld`.
- **Haus von „du“: x 144–157, z 341–350**, Garten mit Tor `[151, 328]`, Schuppen rechts daneben.
  Das weicht vom Atlas-Skizzenblatt ab, damit das Haus von der Straße aus neben der Halle steht und nicht dahinter.
- Werkstätten, Weinberg, Rechenzentrum, ferner Hügel `farHill` (mit Abraumstufen, `mine`-Option), Funkturm, Wegweiser `[47, 101.5]`.
- `K.world` entscheidet selbst: Kamera in der Halle → nur das Innere (`o.hallOpts`), sonst Tal plus Halle von außen (Fenster zeigen das Innere bis ~90 m).
- Optionen: `sunWin`, `gardenLit`, `shadowX`, `mistAmt`, `items` (eigene Objekte, tiefensortiert), `crowd`.

**Figuren** (Gesichter immer sichtbar, natürliche Bewegung):

- `K.person10(ctx, t, who, x, y, s, pose, o)` mit `K.WHO` (you, grandma, trainer, grower …). Über s 7 wird intern bei 7 gezeichnet und hochskaliert.
- `K.robot(ctx, x, y, s, pose, o)`: Hüfte bei x,y, s = 1 ≈ 1,7 m = 185 px; Posen in `K.RPOSE`. Rückgaben `wrist(i)`, `elbow(i)`, `head`, `ang(i)`.
  Eigene Hände über `handFn` (true unterdrückt die Standardhand).
- `K.robotHand`, `K.humanHand` (Ärmel per `sleeve`, `sleeve: null` für eigenen Unterarm), `K.guide` (die Führung: Menschenhand führt Roboterhand).
- `K.cup(ctx, x, y, s)`: die Tasse.
- `K.crowdField({...})`: die Milliarde, 9000 Mitglieder, ferne als Strich + Porzellankopf, mittlere als Sprite, nahe als Vektor.
- Weltgröße einer Figur: `K.sprite(V, p, h)`.

**Explainer** (`lib/f10_expl.mjs`, MOTION.md §13.4): `K.EXP` (Palette, Größen), `K.card` (Iris-Feld aus einem `from`-Rechteck, registriert seinen Helden; `box.inside(fn)`), `K.glowText`, `K.tag`, `K.counter`, `K.bars`, `K.tally`, `K.curve`, `K.pie`, `K.cupPie`, `K.section`, `K.arrow`, `K.flow`, `K.mapSheet`, `K.wcag`. Muster für Becher → Kreis und Spur → Kurve: `tools/expl_stills.mjs` (`cupSeq`, `curveSeq`).

**Halle innen** (`K.STATIONS`: 12 Stationen, Trainer + Roboter + Tasse): `hallOpts.station(i)` → `{lift, robotLift, robotCup, halo, headset, rec}`.

**Die Spur:**

- `K.trace(ctx, pts, u, {col, w, ticks, head})` in Bildpunkten, `K.trace3` in der Welt.
- `K.traceWrite(ctx, t, {text, x, y, size, source, …})` schreibt Zahlen mit der Spur; die Quelle steht immer in Inter-Versalien darunter.
- Jede Zahl im Bild hat eine Quelle (shots.md §4).

**Kamera:**

- `K.camEase(t, KEYS)` mit Keys `[t, cam]`, Ruhe zu Ruhe, Sinus-Ease, Höhe log-interpoliert.
- `K.withDrift`/`K.holdDrift` für Halte-Momente (nie Stillstand).
- Langsam, maximal 1–2 bewegte Hauptelemente gleichzeitig.

**Original-Footage:**

- `K.footage(id, t0, t1)` registriert einen Slot.
- `K.clipSlot(ctx, t, id, …)` zeichnet die Frames im Papier-Rahmen.
- `K.lowerThird(ctx, t, {place, date})` setzt das Etikett „ORIGINAL FOOTAGE“ plus Ort · Datum.
- Ein- und Ausstieg in einen Clip sind die einzigen erlaubten harten Schnitte. Sie werden beim Messen getrennt gezählt.

## 4 · Übergaben an den Chunk-Grenzen

`K.HAND` (in `f10_core.mjs`) legt jede Grenze fest: Wort-Anker, Art und Bild. Beide Seiten zeichnen am Grenzframe dasselbe Bild.
Der ausgehende Chunk endet in seiner Kamera, der eingehende beginnt exakt dort. Keine Blenden, keine Schiebe-Übergänge.

| Grenze | Wer → wer | Bild |
|---|---|---|
| c01>c02 | Phase 1 → B1 | weite Halle, 12 Stationen, Roboter heben Tassen; Kamera `HALL_WIDE_CAM` aus `scenes/sc01.mjs` (importieren) |
| c05>c06 | **B1 → B2** | die Rillen im Ton werden zu den Höhenlinien des fernen Hügels |
| c08>c09 | **B2 → B3** | der westliche Lichtfaden → Schwenk nach Westen |

Die inneren Grenzen (c02>c03, c03>c04, c04>c05, c06>c07, c07>c08, c09>c10, c10>c11, c11>c12) baut jeder Builder selbst.

Für die zwei Übergaben zwischen Buildern gilt:

- Wer **ausgibt**, exportiert aus seiner Szene ein `END`-Objekt (Kamera + Zustand, z. B. `{cam, tod, clay:{…}}`) und meldet es.
- Wer **übernimmt**, importiert es.
- Vor dem Merge prüft `node tools/seam.mjs` die Naht: Frames t−1/30, t und t+1/30 rendern und die Differenz messen. Ziel: kein Sprung über die mafd der Nachbarframes.
- Bis das END-Objekt da ist, baut der Übernehmende gegen die in HAND beschriebene Kamera und gleicht danach an.

## 5 · Bauregeln (Kurzfassung, MOTION.md gilt)

- **Eine durchgehende Welt.** Übergänge sind Kamerafahrten, Schwenks oder Verwandlungen, keine Schnitte.
- **Jedes Bild zeigt seinen Satz.** Kein Stillstand, keine primitiven 3D-Formen (Kugeln, Würfel), alles gezeichnet.
- **Langsame Kamera.** Keine Peitschenschwenks. Objekte nahe der Kamera vermeiden oder nur durch safeView führen.
- **Nacht mit einem Helden.** Mittlere Luma 50–80, Held ≥ 200, alles andere Silhouette mit Randlicht (§0).
- **Bewegung entsteht über die Kamera oder über eine Figur,** nie über das Aufpoppen ganzer Bildteile.
  Neue Elemente wachsen mit expoOut ein (≥ 0,4 s) oder kommen mit der Kamera ins Bild.

## 5a · Takt-Regeln (verbindlich seit der Ruhe-Runde c01)

Film 11 wurde als „hektisch“ kritisiert. Deshalb gilt für jede Kamera:

- **Halte-Moment pro Satz.** Die Kamera steht 1,5–3 s auf dem Motiv des Satzes, nur mit Atmen/Drift (`K.withDrift`, Amplitude ≤ 0,55).
  Mehr als die Hälfte jedes Abschnitts sind Halte-Momente.
- **Wenige, lange Fahrten.** Eine Fahrt pro Bildwechsel statt mehrerer kurzer Fahrten, jeweils mit ease-in/out (`camEase` ist Ruhe zu Ruhe).
  Lieber eine Fahrt mit Schwenk und Kran zugleich als zwei Fahrten nacheinander.
- **Log-Distanz** (`camEase`-Modus als drittes Key-Element):
  - `'logout'`, wenn die Kamera eine nahe Figur verlässt (Kran hoch).
  - `'log'`, wenn sie auf eine Wand oder ein Fenster zufliegt.
  - Dann bewegt sich die Kamera nah am Objekt langsam und schnell nur dort, wo alles fern ist.
  - Vor einem Fenster oder einer Tür erst halten (hineinschauen), dann hindurch.
- **Wenig Parallaxe im Vordergrund.** Trucks und Schwenks dicht an Figuren höchstens ~1 m bzw. wenige Grad. Tele-Zooms auf texturreiche Flächen sparsam (f ≤ 2200).
- **Keine Sprünge in Parametern.** Amplituden, Brennweiten und Kamera-Zweige werden weich überblendet (`mix` + `sineS`), nie per `t > x ? a : b`.
  Wo eine Kamera-Funktion an eine andere übergibt, müssen Position **und** Blickrichtung exakt gleich sein. Sonst zeigt smooth.py einen POP.
- **Zahlen und Text** stehen auf der Explainer-Ebene (§0b): Licht auf Nacht, aus dem Objekt gewachsen, nie auf Papierkarten oder in Rahmen (das alte Muster `raceTimes` in sc01 ist überholt).
  Die Grafik wächst in 0,6–0,9 s ein, Text schreibt erst danach und steht ≥ 1,5 s ruhig.

**mafd-Ziel je Abschnitt** (calm.py 720p, mit `--from/--to` pro Abschnitt):
- ≤ 0,5 je Abschnitt (Halte-Bild ~0,15–0,25, Fahrt ≤ 1,5)
- Animation gesamt ~0,35

Liegt ein Abschnitt darüber: Fahrten kürzen oder strecken, Halte-Momente verlängern, nicht die Textur löschen.

## 6 · Messen (Pflicht vor jeder Abgabe)

**Rendern:**

- `TO=<end> FROM=<start> bash tools/finish_f10.sh <workdir> 1 render`, oder einzeln
  `SECS=cNN node --expose-gc render.mjs --out p.mp4 --from a --to b --crf 14 --preset fast` mit ≤ 20 s pro Stück, nacheinander.
- Standbilder für die Prüfung: `node render.mjs --snap 1,3,5 --dir snaps --scale 0.33`. Einen Kontaktbogen (1 Bild / 2 s) wirklich ansehen.

**Ruhe:**

- `python3 tools/calm.py <video> --scale 1280:720`
- Zielwerte pro Chunk:
  - harte Schnitte ≤ 1 pro Chunk ohne Clip-Ein-/Ausstiege. Clip-Ein-/Ausstiege getrennt ausweisen (Zeiten aus den `footage`-Slots).
  - mafd-Median 0,30–0,40
  - mittlere Luma 35–85, Maximum ≥ 200 (der Held). Flach und matschig = durchgefallen, auch wenn die Zahl stimmt.
- Referenz Grow Forever (Film 07): 0,45–0,8 Schnitte/min, mafd-Median 0,30–0,43.
- Film 11 ganz: 3 harte Schnitte, mafd 0,33 (dessen Luma ~150 gilt hier nicht, neuer Look).

**Ruckler:**

- `python3 tools/smooth.py <video>` (LURCH > 12, POP > 2,5× Nachbarn). Ziel 0 außerhalb der Clip-Grenzen.
- Typische Ursachen und Abhilfen:
  - Objekt hinter der Nahebene → safeView, Kamera weiter weg
  - Sprite-/Vektor-Wechsel der Figuren (bei hpx 7 und 60) → die Figur nicht genau an der Schwelle halten
  - Elemente, die ohne Ease erscheinen → einwachsen lassen
  - Tiefensortierung, die bei Kamerafahrt umspringt → Item-Anker sauber setzen

**Kontaktbogen pro Chunk (Pflicht):** 1 Bild / 2 s plus jeder [EXPL]-Moment in drei Phasen (Objekt · halb verwandelt · Grafik), nach `stills/neuer-look/explainer_sequenzen.jpg`. Ansehen und gegen §0 prüfen: Ist in jedem Bild genau ein Held? Ist jedes Bild ein Poster?

**Handy-Lesbarkeit (Pflicht für jede Zahl und jedes Label):** jedes [EXPL]-Standbild auf 390 px Breite verkleinern (wie `tools/expl_stills.mjs` mit `*_phone.jpg`) und ansehen. Jede Zahl muss auf einen Blick lesbar sein, Labels mit Versalhöhe ≥ ~9 px auf der Handy-Kopie. `K.wcag(text, grund)` ≥ 4,5 (Zahlen ≥ 7).

**Bericht pro Chunk:** Schnitte (animiert / Clip), mafd-Median, Luma (Mittel + Max), Ruckler, Kontaktbogen-Pfad, Handy-Check, Naht-Ergebnis, [EXPL]-Anteil gemessen gegen shots.md §4.

## 7 · Ton

- Szenen hängen Akzente an ihre Entries: `sound: [{ f: 'whoosh_airy', t, v }]`, Dateinamen aus `/mnt/project-files/scenario/sfx-bibliothek/akzent|atmo`.
- Ambience pro Welt in `tools/sound_plan_f10.mjs` (`AMB0`): jeder Builder meldet seine Zeilen `[chunk, datei, gain, von, bis]` und ändert die Datei nicht selbst.
- Mix und Untertitel macht der Endschnitt:
  - `audio/mix.py`
  - `audio/subs.py` (max. 34 Zeichen, ~72 px), eingebrannt im Stil aus `finish_f10.sh`

## 8 · Stand Phase 1 (Referenz, nach der Ruhe-Runde; Luma-Werte sind vom alten Tag-Look)

Commit `e662c47` auf `claude/project-thread-butzw2` (Ruhe-Runde); der neue Look und das Explainer-Kit liegen im Commit aus Abschnitt 10.

**Ausgaben von c01:**
- Film: `…/scratchpad/film10/render/minute1/final.mp4` (1080p) und `final_720p.mp4`
- Kontaktbogen: `contact.jpg`

**Messung c01** (720p, mafd-Median pro Abschnitt):

| Abschnitt | Zeit | mafd-Median | Luma |
|---|---|---|---|
| Startlinie | 0–4,7 | 0,38 | 164 |
| Rennstraße | 9,8–13,1 | 0,29 | 173 |
| Tal | 24–46 | 0,33 | 170 |
| Tal | 46–63,6 | 0,24 | 176 |
| Fenster + Station | 63,6–68,5 | 0,65 | 177 |
| Halle weit | 73–75 | 0,20 | 180 |

- **Animation gesamt:** mafd 0,30, Luma 173, 0 harte Schnitte.
- **Clip-Grenzen und Originalmaterial:** 27 Schnitte, eigene Kategorie.
- **Ganzes Stück:** mafd 0,42, Luma 160.
- **Ruckler:** nur noch eine LURCH-Gruppe beim Log-Anflug ans Hallenfenster (60,8–61,7 s, Spitzen ≤ 14,4).
- **Referenz Grow Forever (0–75 s):** mafd 0,32, 0,8 Schnitte/min.

**Muster für Phase 2:**
- `valleyTake` in `scenes/sc01.mjs` zeigt die Takt-Regeln aus 5a im Code (Keys mit Halte-Momenten, `'log'`/`'logout'`).
- Bekannte Grenze: Der Flug durch ein Fenster bleibt über 0,5. Lieber kurz durch (≤ 7 m) und danach lange halten.

**Übergabe an c02:**
- Letzter Frame von c01 = `HALL_WIDE_CAM` (Halle lokal x 0, y 4,2, z 215,6, pitch −0,17, f 1250).
- Die Kamera schiebt dabei mit 0,35 m/s entlang der Hallenachse. c02 übernimmt diese Bewegung und bremst sie weich ab.
- Robots heben die Tassen ab 72,94 s mit 60 ms Versatz und Halo. Die Tassen sind in der weiten Halle 1,9× vergrößert (`cupScale`).

## 9 · Notiz c01: Zahlenkarten (nicht jetzt reparieren)

In 1.10/1.11 schreibt `traceWrite` die Zahlen bei x 120, y 214, Größe 104. Sie sind im neuen Look blass, und die Austrittsmaske schneidet sie links ab.
Später (Lead, nach der Abnahme des Looks) umstellen:
- in den Glüh-/Iris-Stil (`K.card` aus dem Objekt, `K.glowText` für die Zahl, `K.tag` für die Quelle);
- links Rand lassen (x ≥ 160);
- die Austrittsmaske erst laufen lassen, wenn der Text gelesen ist (≥ 1,5 s nach dem letzten Zeichen).

Builder: dieses Muster nicht kopieren.

## 10 · Stand Look-Runde 2 (Lead)

- **Code:** `lib/f10_expl.mjs` (neu), `f10_core` (TOD-Nacht, `heroLight`/`takeHeroes`, `gradeAt`/`gradeLUT`), `lib/print.mjs` (`gradeFrame`: Lichtmaske, Bloom, Dither), `film.mjs` (`finish` mit Grade + Helden), `f10_valley` (Sterne, Sonne als Held), `f10_hall` (Oberlicht als Held), `f10_figs` (ferne Köpfe als Lichtpunkte), `sc01` (Helden an Startlinie und Spur), `tools/expl_stills.mjs`.
- **Stills:** `stills/neuer-look/`.
- **Prüfen:** `node tools/expl_stills.mjs <dir> [becher_1,kurve_3]` rendert die Explainer-Referenzen samt Handy-Kopie und WCAG-Prüfung.
