# Film 13 · „Superintelligence Promised Us Free Time. Will We Get It?“ · Motion-Regeln (Lead-Brief für alle Builder)

Stand 2026-10-28 (Lead Bild, v1). The Good Takeoff, Englisch, 1920×1080, 30 fps. Text `film-zeit/vo-v6.txt` (eckige Klammern werden nicht gesprochen), Timing `film-zeit/audio/timing.json` (Abschnitte `s00` … `s24`, Wortzeiten global in s; nach dem VO-Ende ein Endscreen von **höchstens 15 s**, der sich weiter bewegt). Bindende Shotliste: `shots.md` (Quelle `tools/shots13.py`). Stil: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (gilt vor allem anderen).
Leitidee: *Uns wurde Zeit versprochen. Jede Maschine hat Stunden frei gemacht, und jedes Mal ist der Sand an uns vorbeigeronnen. Diesmal entscheiden wir vorher, wohin er fließt.*

Lies das ganz, bevor du eine Zeile Code schreibst. Der Film ist **gezeichnet** (Canvas 2D, Node), keine KI-Bilder, kein Bild-zu-Video, kein Footage.

---

## 0 · Status
- **Stil-Test freigegeben** (Jakob 28.10.: „kannst so den ganzen Film machen“): `scenes/sc01.mjs`, 0 bis 21,8 s, Shots 1.01–1.06. Der Rest entsteht durch drei Builder, Aufteilung und Regeln in `BRIEF-builders.md`. Fehlende Chunks rendern als Platzhalter (`lib/stub.mjs`).
- Daten-Wurzel: `lib/kit.mjs ROOT` = `$F13ROOT` oder `/mnt/project-files/scenario/film-zeit/`; `TIMING=…` überschreibt nur die Timing-Datei.
- **Immer über Wörter ankern** (`T.S('s00', 'given')`, `T.E(…)`, `T.seg('s12').start`), nie über Sekunden. Das VO wird nachvertont (vo-v6 kürzt den Hook um ~4 s), die Wort-Anker ziehen mit.

## 1 · Motion-DNA (eine Zelle: ruhig + weich, Editorial)
- **Ton:** ruhiger Editorial-Dokumentarfilm. Akzente nur auf dem Schlüsselwort eines Satzes, Tempo-Kontrast 3–5×: kurzer Akzent, dann langes, lebendiges Halten (1,5–3 s).
- **Easing:** Auftritte und Landungen expo-out, Abgänge expo-in, Bewegungen quart in-out, **Kamera sinus-S** (`camAt` mit `s`), nie linear außer konstanter Mechanik (Sandstrahl, Uhrzeiger). Kein Federn, höchstens 3 % Überschwingen.
- **Basiseinheit 0,4 s.** Mikroakzent 0,25–0,35 s · Auftritt 0,4–0,7 s · Handbewegung 0,8–1,2 s · Kamera ≥ 1,6 s, Fahrten 2,5–4 s. Passt eine Fahrt nicht zwischen zwei Wörter, beginnt sie früher, nie schneller.
- **Ursache und Wirkung:** Berührt A B, reagiert B 40–120 ms später mit kleinerer Amplitude (Sanduhr setzt auf → Lichtstaub → dein Mantelrand glüht).
- **Keine Blenden:** kein Crossfade, kein Fade über Schwarz, kein Slide, kein Wischer, kein Spiel-3D, keine primitiven 3D-Körper. Übergänge sind Plansequenzen, Fahrten, Verwandlungen, Flüge in eine Fläche, Match-Fahrten (gleiche Form an gleicher Bildstelle).

## 2 · Die Welt und der Lichtbogen
**Eine Nacht, die zum goldenen Abend wird.** Der Film beginnt auf einer Felskante unter Sternen (Nachtblau), wandert durch Orte, die alle auf derselben 2.5D-Bühne entstehen (Weg, Küche, Explainer-Raum, Büro, Battle Creek, Halle, Krankenhausflur, Abendtisch, Schreibtisch), und endet im goldenen Abendlicht eines Gartens am Fluss.

| Abschnitt | Licht | Held (das Hellste im Bild) |
|---|---|---|
| c01–c06 (Hook bis Hassabis) | Nacht, Sterne, Staub | die Sanduhr aus Licht, die Lichthand, der Ring, Explainer-Licht |
| c07 (Battle Creek 1930) | Winternacht → Abend | die Fabrikuhr (8 → 6), die Stadt als Lichtkarte |
| c08 (Herzstück) | **Sommerabend, tiefe Sonne**, lange Schatten, dann Sonnenuntergang → Nachtschicht | die tiefe Sonne |
| c09–c12 | Nacht hellt auf → Vor-Dämmerung | Blatt aus Licht, Abendtisch-Lampe, die kleine Sanduhr in deinen Händen |
| c13 | erstes Morgenlicht | Zeitleiste → die Lichthand vom Anfang |
| c14 + Endscreen | goldener Abend (Echo Battle Creek) | die Sonne |

Warm und hell heißt Zeit, die bei Menschen ankommt; kalt und dunkel heißt Zeit, die weggeflossen ist. Der Lösungsteil (ab c10) wird schrittweise wärmer und heller; die Dämmerung ist ihm vorbehalten.

## 3 · Durchgehende Objekte (die Grafiksprache)
1. **Die Sanduhr aus Licht** (Held, `f13_kit.hourglass`). Glas als Lichtkontur, **Sand = Gold = Zeit**, Rahmen als dunkle Silhouette mit Randlicht. Sie öffnet (Thumbnail-Motiv in 1.01) und schließt den Film (14.07: der Sand ruht unten, die Sonne scheint hindurch). Zustände: rinnt (`flow`), hält an (`hold`, Shot 2.05 „a lie?“), Riss (`crack`, c06), leckt (`leak`).
2. **Die Lichthand = die Maschine.** Groß, kühl-creme, aus Licht, von oben rechts. Sie reicht dir die Sanduhr (1.01–1.02), sie arbeitet (c10 Zeit-Dividende), sie kehrt in c13 wieder. Sie ist eine **deckende warme Goldform** (Halo-Gold, Creme-Kern in der Handfläche; `lightHand(…, { lum })`, normal `lum ≈ .76`, zurückgenommen ≈ .4) und immer **dunkler als der Sand**, nie das Hellste. Nie durchsichtig, nie grau-blau.
3. **Der Ring = Maschine/KI** (kühl-creme, c02, c11): Superintelligenz wird nie als Roboter oder Gehirn gezeigt.
4. **Der Sandfaden = die Linie.** Eine dünne Goldlinie (`trailSpan`) aus dem Sand ist Träger und Explainer-Strich zugleich: sie steigt als Zitat-Linie auf (1.03), biegt ab (c04: die Stunde wandert woandershin), wird Kurve, Zeitleiste, Achse. Worte, die zu Zeit werden, zerfallen zu Goldsand (`textGrains`/`sandGrains`, 1.05).
5. **Das Blatt aus Licht = die Regel** (c09, c11, c13): Gesetze, Abkommen, Arbeitszeitregeln. Es landet wie Papier, seine Kante wird Tischtuch oder Zeitleiste.
6. **Du** (gelbe Regenjacke mit Kapuze, `E.du()`, Kapuze ist Standard): klein, gesichtslos, staunt, hebt, geht, legt die Hände um die Sanduhr. Andere Menschen sind schlichte Silhouetten ohne Gelb.

## 4 · Palette (exakt aus dem Stil, `P` in `lib/f10_editorial.mjs`)
| Rolle | Hex |
|---|---|
| Nacht, tiefster Grund | `#080b27` `#0a1334` `#0e112c` |
| Indigo, Flächen | `#0a184a` `#0c1f5c` `#151f4b` |
| Blau, Licht auf Formen | `#193f8c` `#33497a` `#394773` |
| Gold, Lichtkern | `#fefde2` `#fef4bf` |
| Gold, Halo | `#ead295` `#dec688` `#e7d19a` |
| Gold, Schatten | `#9e7d54` `#a28f7b` |
| Regenjacke (du) | `#f2b632` |
| Schrift | Creme `#fefcde` mit warmem Glühen |

Gold nur für Licht, Sand, Zeit und Hervorhebung; das Gelb gehört nur dir. Himmel tiefes Indigo wie die Film-11-Thumbnails (kein Mittelblau). Grain dezent: `K.PRINT13 = { grain 14, floor 4, vig .5 }`, Korn wechselt mit 10 Hz (jedes 3. Bild). Korn ist Textur, nie Effekt. Luma-Mittel 40–60.

## 5 · Regeln gegen Hektik (messbar)
- **Weltwechsel:** ≤ ~1 harter Weltwechsel pro Minute (Liste `shots.md` §3: 14 Welten, davon ~10 harte, ≈ 0,95/min). Alles andere sind Plansequenzen und Verwandlungen.
- **Bewegungsbudget:** höchstens 1–2 bewegte Hauptelemente gleichzeitig, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, Drift via `cameraFloat`) zählt nicht.
- **Ein Motiv pro Satz**, das Bild zeigt, was der Satz sagt. **Nichts aus dem Nichts:** jedes Element wird gereicht, wächst, steigt von einer Grundlinie auf (Masken-Wipe) oder wird vom Sandfaden geschrieben. Nie halbtransparent einblenden.
- **Kein Stillstand > 2 s; Halten 1,5–3 s nach jedem Akzent.** Text steht ruhig, solange er gelesen wird (≥ 1,5 s, ≥ Zeichen/12 s).
- **Hook ohne Pause:** s02 „a lie?“ fließt direkt in s03 „No.“ (2.05 → 2.06 Plansequenz, der Sand hält ≤ 1,2 s an, die Kamera driftet).
- **Messung vor jedem Bericht:** `python3 tools/calm.py <mp4>` (mafd-Median, Schnitte, Luma; auch `--scale 1280:720`), `python3 tools/smooth.py <mp4>` (**0 Ruckler**: keine LURCH/POP), `SECS=cNN node tools/seam.mjs --at …` an jeder Render-Naht.

## 6 · Text im Bild und Grafiken
- **Grafiken aus den Elementen des Films** (Jakob 28.10.): Sand rieselt zu Balken und Kurven, der Faden zeichnet Zeitleisten und Grenzen, Stunden sind Sandkörner oder Sanduhren, die Lichthand und der Ring sind die Maschine. Jede Grafik zeigt genau, was der Satz sagt, und ist ohne Ton lesbar. Keine generischen Diagramm-Tafeln (`BRIEF-builders.md` §3).
- Schrift: Zitat und Zahlen **Instrument Serif** (Creme, warmes Glühen), Quellen und Labels **Inter 600** (`P.halo2`). Im Bild „artificial intelligence“, nie „AI“.
- Explainer: Licht auf Nachtblau, keine Tafel, kein Rahmen; höchstens eine Zahl und ≤ 6 Wörter plus Quelle; Zahl ≥ 120 px, Label ≥ 34 px, Quelle ≥ 24 px bei 1080p.
- Nur Werte aus `faktencheck.md`; jede Zahl mit Quelle (`shots.md` §4).
- **Zitatkarte (1.03–1.04), wortgenau:** „The purpose of life is not just to do jobs. So if you eventually get a society where you only have to work three days a week or something, that's probably okay.“ · `— Bill Gates, “What Now?” with Trevor Noah, 2023`.

## 7 · Kit
- `lib/f10_editorial.mjs` (Editorial-Nacht-Bühne): `card`, `cam3`, `camAt`, `camDrift`, `F0`, Tiefen (Himmel 40000, Mitte 6000, Fokus F0) · `P` · `lightHand`/`handMatrix`/`handTip` · `du()` (Kapuze Standard) · `person()` · `glowText` · `halo` · `dust` · `castShadow` · `catmull` · `finish` · Explainer: `counter`, `bars`, `curve`, `pie`, `timeline`, `flow`, `compare`, `icon`, `lightShape`.
- `lib/f13_kit.mjs` (Film 13): `hourglass` (gibt `neck`, `top`, `base`, `stream` für Träger zurück) · `trailSpan` (Sandfaden) · `maskLine` (Zeile steigt von der Grundlinie, Abschnitte warm färbbar) · `measure` · `textGrains` + `sandGrains` (Worte zerfallen zu Sand) · `ledge`/`ledgeY` (Felskante) · `PRINT13` (Finish).
- `lib/f13_seams.mjs` (Lead): die Platten an den Builder-Nähten (`plateGlass` B1→B2, `plateSheet` B2→B3), siehe `BRIEF-builders.md` §2.
- **Speicher:** keine Canvas, kein Pattern, kein Gradient-Cache pro Frame neu bauen (Leck in `@napi-rs/canvas`). Renders mit `node --expose-gc`, Stücke ≤ 20 s.

## 8 · Endscreen (≤ 15 s nach dem VO-Ende, 14.08)
Weites Bild in goldener Stunde: Garten, Fluss, Waldrand; Sonne tief in der Mitte am Horizont; du und die Sanduhr winzig unten in der Mitte. **Freiflächen:** links x 90–780, y 250–700 („best for viewer“), rechts x 1140–1830 („latest upload“), Mitte über der Sonne x 810–1110, y 330–600 (Abo-Knopf). **Nie statisch:** langsamer Rückzug, der Fluss glitzert, Gräser wiegen sich, Glühwürmchen steigen, die Sonne sinkt.

## 9 · Gates (in dieser Reihenfolge)
1. Plan zuerst: Shot in `tools/shots13.py` (Anker-Wort, Bild, 1–2 Bewegungen, Übergang mit Träger), `shots.md` neu schreiben.
2. Bauen, dann anschauen: Standbilder alle ~0,5 s um jede Fahrt und eines pro Satz (`render.mjs --snap … --scale .5`, Kontaktbogen). Mindestens 3 Review-Runden.
3. Messen (§5), Werte in den Bericht.
4. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Text. Nichts unter 4.
