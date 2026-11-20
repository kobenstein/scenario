# Film 10 · „Superintelligence Is Getting a Body“ · Motion-Regeln (Lead-Brief für alle Builder)

Stand 2026-10-24 (Lead, Phase 2: neuer Look §0a, Explainer-Ebene §13; v1 archiviert in `MOTION-v1.md`). Erste Fassung 2026-10-23. The Good Takeoff, Englisch, 1920×1080, 30 fps, **655,36 s** (VO endet 634,46 s, danach 20,9 s Endscreen).
Text: `/mnt/project-files/scenario/film-roboter/vo-v3.txt` (Hook-Satz jetzt „One of them crashed into a barrier.“). Timing: `audio/timing.json` (Abschnitte `00a` … `04a`, Wortzeiten global in s; 00a endet jetzt bei 57,65 s).
Clips: `/mnt/project-files/scenario/film-roboter/clips/` (K1a, K1b, K2a, K2b, K2c, K3, K4, siehe `clips.md`). Bindende Shotliste: `bild/shots.md`.
Leitidee des Films: *Wir bringen ihnen gerade das Gehen bei.* Eine menschliche Hand führt eine Roboterhand, wie man einem Kind das Radfahren beibringt, und lässt am Ende los.

Lies das hier ganz, bevor du eine Zeile Code schreibst. Es gibt **eine** Welt für den ganzen Film. Wer eine eigene Welt, eine eigene Palette oder eigene Figuren erfindet, baut am Film vorbei.

---

## 0a · NEUER LOOK seit 2026-10-24 (gilt vor allem anderen in dieser Datei)

Jakob hat die Film-11-Thumbnails zur Stil-Referenz für die ganze Animation gemacht. Referenzen: `/mnt/project-files/scenario/thumbnails/film-11/` (vergleich.jpg, f11-*-1280.jpg) und `/mnt/project-files/scenario/referenzen/thumb-stil/` (r1 Monolith, r2 Hände, r3 Auge, r5 Stauffer). Teststills: `stills/neuer-look/`.
**Wo §1, §2.3, §4 oder §5 etwas anderes sagen (Tageslicht, Pastell, Papier statt Nacht, Luma ≥ 115), gilt dieser Abschnitt.**

1. **Flache Grain-Illustration auf tiefem Indigo** (Stauffer, Risograph; Grain dezent). Himmel und Ferne fast schwarz-indigo `#070918 → #1a2a7a`, mit Sternen und Staub. Kein Mittelblau-Teppich.
2. **Genau EINE große warme Lichtform pro Bild** ist der Held und mit Abstand das Hellste: Sonne am Horizont, Hallen-Oberlicht, Fensterlampe, leuchtende Hände, die Spur, eine Explainer-Grafik. Creme-Kern, Amber-Halo, gekörnter Lichtabfall, lange Lichtkegel auf dem Boden.
3. **Alles außerhalb des Lichts wird Silhouette** (fast Tinte) mit Rim-Licht nur auf der Lichtseite. Wenig Kleinteile: Bäume als Gruppen, wenig Zaun und Wimpel, Felder nur angedeutet. Nach unten sinkt der Vordergrund ins Dunkle.
4. **Maßstab-Kontrast:** kleine Figur vor großer Lichtform. **Du trägst Gelb** (`PAL.you #e3a92f`, gelber Pulli/Mantel). Das ist der zweite warme Akzent. Figuren behalten Gesichter, aber reduziert.
5. **Wenige Farben:** Indigo, Amber/Creme, etwas Cyan (Maschine, Daten). Alles andere ordnet sich darunter ein.
6. **Helligkeit:** mittlere Luma darf niedrig sein (~40–80, Grow Forever lag bei ~52), aber das Heldenlicht ist hell (Spitzen ≥ 220) und der Kontrast hoch. Messung (Graustufen-Mittel auf 64×36, Luma-Spalte von `tools/calm.py`): Mittel **35–85**, Max **≥ 200** in jedem Shot außer reinen Übergangsframes.
7. **Ein Bogen: eine Nacht im Tal** (ersetzt den Tageslauf aus §2.3): c01 Sonnenuntergang (Sonne als Heldenscheibe rechts am Horizont) → c02 blaue Stunde → c03–c06 Nacht (Helden: Fenster, Lampen, Hallenlicht, die Spur) → 372 s Sprung tiefe Nacht → Vor-Dämmerung (unsichtbar) → c07 die Sonne geht über dem Weinberg auf → c08–c11 früher Morgen, tiefe warme Sonne → c12 Aufwachen in tiefer Morgensonne. Der Lösungsteil wird wärmer und heller (`gradeAt(t).dawn` 0 → 0,8).

**Wie es im Code entsteht (Kit, nur der Lead ändert es):**
- `tod(t)`/`light()` liefern Nachtwerte; Tabellen SKYK/EVE sind Eingangswerte für das Grade. `L.stars` (Sterne), `L.lamp` (wie sehr ein Fenster/eine Lampe das Licht ist).
- **Relight-Grade im Finish** (`lib/print.mjs gradeFrame`, `f10_core gradeLUT`): Jeder Frame wird nach dem Zeichnen neu beleuchtet: Wert = gezeichnete Luminanz × Lichtmaske; die Maske ist Umgebung (Standard 0,34, nach unten dunkler) + die registrierten Heldenlichter (Pool + langer Kegel). Dann Indigo-Rampe; Amber (Licht, Spur, Rim, Haut, dein Gelb) und Cyan behalten ihren Farbton, warme helle Pixel und Sterne leuchten selbst (werden nicht abgedunkelt) und **glühen** (Bloom). Footage (`print: false`) wird nie gegradet.
- **Heldenlicht registrieren:** `K.heroLight({ x, y, r, k, cone, coneLen, coneW, amb })` in Bildpunkten, einmal pro Frame, dort, wo das Licht ist. `skyAndSun` registriert die Sonne selbst, `hall()` innen das Oberlicht, `card()` die Explainer-Grafik. **Ohne Heldenlicht wird das Bild flach** (Maske 0,7): jeder Shot braucht eines.
- Hinweis für Szenen: Fenster und Lampen leuchten nur, wenn die Szene es will (`sunWin`, eigene Lampe) – genau eines pro Bild. Warme Materialien (Holz, Ziegel) werden im Lichtpool stark orange: Tisch und Ziegel dunkel halten oder aus dem Pool nehmen.

---

## 0 · Was wir aus „Singularity“ gelernt haben (hart)

Jakob: „hektisch, nicht so gut wie #6“. Gemessen: 32 harte Schnitte statt 3, 3,5× mehr Bildbewegung als Film 6, zu dunkel, weil drei Builder drei Welten erfanden.
Darum gilt in Film 10:
1. **Eine Welt, die sich verwandelt** (§2). Kein Builder erfindet einen Ort. Jeder Ort steht im Atlas (§2.2) und wird aus `lib/f10_kit.mjs` gezeichnet.
2. **Schnittbudget: höchstens 3 harte Schnitte in der Animation** (1 geplant, 2 Reserve, §6). Clip-Ein- und -Ausstiege zählen getrennt.
3. **Bewegungsbudget: höchstens 2 bewegte Hauptelemente gleichzeitig**, die Kamera zählt als eins (§6).
4. **Hell genug**: Tageslauf statt Dauer-Nacht; das Dunkelste im Film ist 14 s blaue Stunde, nie Schwarz (§4).
5. **Trotzdem lebendig**: kein Stillstand über 2 s, ein Motiv pro Satz, nichts erscheint aus dem Nichts, Figuren atmen und blinzeln.

---

## 1 · Motion-DNA (unverändert seit Film 5/8, eine Zelle, nie mischen)

- **Ton:** ruhig und hochwertig, Editorial-Dokumentarfilm. Akzente nur auf dem Schlüsselwort eines Satzes. Tempo-Kontrast 3–5×: kurzer, klarer Akzent, dann langes, lebendiges Halten.
- **Easing:** Auftritte und Landungen expo-out `(0.16, 1, 0.3, 1)`, Abgänge expo-in `(0.7, 0, 0.84, 0)`, Bewegungen quart in-out `(0.76, 0, 0.24, 1)`, **Kamera immer sinus-S oder quart in-out**, nie linear (außer konstante Mechanik: Töpferscheibe, Drucker, Uhrzeiger). Keine federnden Springs; höchstens 5 % Überschwingen (der Becher setzt mit 2 % auf).
- **Basiseinheit 0,4 s.** Mikroakzent 0,25–0,35 s · Auftritt 0,4–0,7 s · Hauptbewegung einer Figur oder Hand 0,8–1,2 s · **Kamera mindestens 1,6 s, Fahrten zwischen Orten 2,5–4 s, Kranfahrten 2–3 s**. Doppelte Strecke = etwa 40 % mehr Dauer.
- **Passt eine Fahrt nicht zwischen zwei Wörter, beginnt sie früher** (im Satz davor), nie schneller. Jede Fahrt beginnt und endet weich; danach mindestens 2 s Halten mit Drift (1–2 % Push, Nebel, Atmen).
- **Textur:** Editorial-Grain wie Film 4–8: Druckkorn, Stipple- und Halbton-Auslauf des Lichts, feine Schraffur in Schatten, leicht raue Kanten, gravierte Linien. Kein KI-Bild, **kein primitives 3D** (keine Würfel, Kugeln, Zylinder als Objekte): alles gezeichnet, 2.5D mit Parallaxe-Ebenen.
- **Ein Hauptlicht pro Bild.** Licht-Vorbild ist der Feuerkreis aus Film 4 (`film-04-v2/stills/stil-referenz/f4_8m27_feuerkreis.jpg`): eine warme Quelle in weiter Umgebung, Randlicht an Figuren und Kanten, ruhige Kamera. Hier aber **bei Tag**: die Sonne ist die warme Quelle, Randlicht von hinten oder seitlich, und nur in der blauen Stunde (§4) ist es wörtlich ein warmes Fenster in weiter Landschaft.
- **Ursache und Wirkung:** Berührt A B, reagiert B 40–120 ms später mit kleinerer Amplitude. Position führt, Rotation folgt, Helligkeit setzt zuletzt.
- **Keine Blenden:** kein Crossfade, kein Fade über Schwarz, kein Slide. Übergänge sind Fahrten, Verwandlungen, Flüge in eine Fläche oder (sehr selten) exakte Match-Cuts.

---

## 2 · Die EINE Welt: das Tal

### 2.1 In drei Sätzen
Der ganze Film spielt in **einem Tal an einem einzigen Tag**: eine Landstraße läuft durch das Tal, an ihr liegen die Trainingshalle am Fluss, dein Haus am Hang mit Küchentisch und Garten, gegenüber der Weinberg, am Rand die Werkstätten, das Rechenzentrum, die Mine im fernen Hügel und, an der Talmündung, der Turm.
Die Kamera reist auf dieser Straße von Ort zu Ort, und der Tag läuft mit: Morgen beim Rennen, Mittag in Halle und Wohnzimmer, Nachmittag und goldene Stunde bei den Kosten für uns, Dämmerung bei der Erde, eine kurze blaue Stunde bei „robots for whom?“, Morgengrauen im Weinberg, heller Morgen für die Lösungen.
Am Ende wachen wir in demselben Tal auf („Picture waking up there.“): Großmutter am Küchentisch, der Roboter geht allein durchs Gartentor auf die Straße, und die Kamera steigt über ein Feld aus Händen und jungen Bäumen.

Das Tal ist kein realer Ort, sondern **die Welt im Kleinen**. Nennt der Text ein Land, steht an der Straße ein **Wegweiser** (Kit `signpost`) mit dem Namen in Inter-Versalien: CHINA an der Halle, USA am Haus der Neo-Szene und an der Baustelle, FRANCE am Weinberg, JAPAN an der Werkbank, INDIA und BASQUE COUNTRY hinter den Hügelkämmen. Die Wegweiser sind Teil der Landschaft (Holz, gravierte Schrift), keine Einblendungen.

### 2.2 Atlas (feste Weltkoordinaten, im Kit als `VAL` hinterlegt)
Weltbild 7680 × 2160 px, Ursprung oben links, Horizont bei y ≈ 900. Kamera `{x, y, z}` wie in Film 6/8 (`camMap`), Parallaxe pro Ebene.

| Ort | Lage (Welt-x, -y) | Was dort steht | Wo im Film |
|---|---|---|---|
| **Startlinie / Straße** | 600–7200, y 1500–1900 | Landstraße mit weißer Startlinie (x ≈ 900), Absperrgitter und Wimpel vom Rennen, die **Gabelung** bei x ≈ 3000 mit dem leeren Wegweiser | c01, c03, c07, c11, c12 |
| **Die Halle** (Trainingshalle) | x 1800–2900, y 1300 (Talboden am Fluss) | alte Ziegel-Stahl-Halle mit Sheddach und hohen Sprossenfenstern; innen 12 Stationen (Tisch, Becher, Trainerin mit Headset, Roboter gegenüber), große Hallenuhr über dem Tor, Fenster mit Blick auf den Fluss und weitere Hallen | c01, c02, c04, c05, c08, c09, c11 |
| **Dein Haus** | x 3500–4100, y 1050 (Hang über der Gabelung) | kleines Haus mit Garten und Gartentor; innen Wohnzimmer (Sofa, Couchtisch, Regal, großes Fenster zum Tal), Küche (Küchentisch am Fenster, Spüle, Schublade), Flur mit vier Türen, Schlafzimmer; daneben der **Töpferschuppen** der Großmutter | c02, c04, c05, c06, c10, c12 |
| **Werkstätten am Fluss** | x 4300–5600, y 1350 | Fabrikhallen, Lager, Schweißwerkstatt mit Hof und Bank, Werkbank mit Hockern, Markt mit Gebrauchtwagen | c03, c04, c11 |
| **Der Weinberg** | gegenüber, x 5000–6600, y 900–1250 (Sonnenhang) | Rebzeilen, Höfe an einem Feldweg, die gemeinsame Maschinenhalle (CUMA), Dorfstraße mit Haustüren | c07, c09, c10 |
| **Rechenzentrum** | x 6800, y 1200 (Talrand) | flache Hallen, Kühler mit Dampffahnen | c06, c07 |
| **Der ferne Hügel** | x 6200–7400, y 700–900 | erst grün mit blasser Narbe; in c06 wachsen Abbaustufen (Mine); ab c10 begrünen sich die Ränder, die Stufen bleiben | c01, c06, c10, c12 |
| **Schrottberg** | x 7000, y 1300 | wächst nur in c06 | c06 |
| **Der Turm** | Talmündung, x 7500, y 820 (fern, klein) | einziges kalt beleuchtetes Gebäude: glatter Glasturm (die Bank, die wenigen Besitzer) | c05, c06, c11 |
| **Hinter den Kämmen** | Osten (links hinter dem Kamm): INDIA-Dorf mit Baum · Westen (rechts): BASQUE-Hügel mit Werkhallen · Baustelle USA am Talrand | c08, c09, c10 |
| **Das Feld** | Hang unter dem Haus, x 3000–5000, y 1200–1700 | ab c12: Reihen junger Bäume, Menschen pflanzen | c12 / Endscreen |

Alle Wechsel zwischen diesen Orten sind **Kamerafahrten über dieselbe Weltkarte** (Straße entlang, Kran über das Tal, durch Fenster und Tore). Wer von der Halle zum Haus will, fährt den Hang hinauf, sieht dabei die Gabelung und kommt durchs Fenster ins Wohnzimmer.

### 2.3 Wie sich die Welt über die 5 Abschnitte verwandelt

| Abschnitt | Zeit | Tageszeit (`tod`) | Was sich verwandelt |
|---|---|---|---|
| **0 · Hook + Fahrplan** (00a, Anfang 01a) | 0–75 s | früher Morgen → Vormittag | Die Straße ist Rennstrecke (Startlinie, Gitter, Wimpel). Das Tal füllt sich mit einer Milliarde winziger Figuren (Prognose) und wird wieder leer. Die Halle wird als Ort des Lernens geöffnet. |
| **1 · Kommt es wirklich?** (01a, 01b) | 75–192 s | Mittag (hellste Strecke) | Halle bei Oberlicht; das Wohnzimmer wird zur Trainingshalle (Gelenkbögen legen sich über die Möbel). Im Tal: Markt, Fabriken, Werkbank; die Milliarde kehrt als gepunktete Prognose zurück. |
| **2 · Wollen wir das?** (02a–02c) | 192–360 s | Nachmittag → goldene Stunde → Dämmerung | Das Haus mit Großmutter; die Werkstatt; die Halle wird leerer. Die Spur wird kalt und fließt aus dem Tal zum Turm. Am Abend öffnet sich der ferne Hügel als Mine, am Talrand wächst der Schrottberg. Im Querschnitt sieht man unter dem Tal die Löcher. |
| **3 · Wie wir aufwachen** (03a–03e) | 360–587 s | blaue Stunde (14 s) → Morgengrauen → heller Morgen | Ein warmes Fenster in der blauen Stunde. Dann geht über dem Weinberg die Sonne auf. Die Halle öffnet die Tore und wird Genossenschaft: die Spur fließt warm **zurück** in die Hände. Die Mine bleibt, aber ihre Ränder werden grün; die Milliarde schrumpft auf wenige richtige Roboter. |
| **4 · Finale** (04a + Endscreen) | 587–655 s | Morgen, im Bild „Aufwachen“ mit tiefer Morgensonne | Küchentisch, Großmutter, zwei Becher, lebendiger Garten. Die Hand lässt die Roboterhand los, der Roboter geht durchs Gartentor. Kranfahrt über das Feld aus Händen und jungen Bäumen. |

Die Tageszeit ist **eine Funktion der Filmzeit**: `tod(t)` im Kit (§9). Jeder Chunk liest Himmel, Lichtrichtung, Schattenlänge und Farbtemperatur aus `tod(t)`. So passen alle Chunk-Grenzen ohne Absprache.

---

## 3 · Signature Move und Träger-Objekte

### 3.1 Signature Move: **„Die Führung“**
Eine menschliche Hand hält und führt eine Roboterhand, wie man einem Kind das Radfahren beibringt: die Hand liegt unter oder um die Roboterfinger, führt sie einen kurzen Bogen, und **lässt am Ende los**. Aus der Bewegung zieht sich die **Spur** (3.2).
- Anatomie: Menschenhand warm (Hauttöne aus `SKINS`, Ärmel in der Farbe der Figur), Roboterhand graphitfarbene Glieder mit Porzellan-Handrücken, fünf Finger, sichtbare Gelenkringe. Die Finger greifen ineinander, nie Faust auf Faust.
- Licht: Gegenlicht der tiefen Sonne, Randlicht an beiden Händen, Hintergrund weich im Nebel. **Das ist das Thumbnail-Motiv.**
- Ablauf (1,2–2,0 s): Hand schließt sich (0,6 s expo-out) → kurzer gemeinsamer Bogen (0,8 s quart) → Roboterfinger reagieren 80 ms später mit kleinerer Amplitude.
- Auftritte (★): 1.01 (Startlinie, 0:00), 1.07 (Absperrung, „They still need our hands“, 0:24), 11.15 („That makes you one of the teachers“, du), 12.07–12.08 (Garten, Loslassen, Schlussbild).

### 3.2 Die **Spur** (die Grafiksprache des Films)
Jede vorgemachte Bewegung hinterlässt eine feine leuchtende Linie, wie eine Bewegungsaufzeichnung: ein Bogen mit kleinen Gelenk-Ticks (Schulter, Ellbogen, Handgelenk, Fingerknöchel). **Die Spur ist das Datum.** Ihre Farbe erzählt die Geschichte:
- **warm** (Kern `#fff1c9`, Glut `#ffb35c`) an der menschlichen Hand, wo sie entsteht;
- **kalt** (`#9fb6cf`, Kern `#e6eef6`), sobald sie im Roboter landet und aus dem Tal zum Turm fließt (Akt 1–2);
- **wieder warm**, wenn sie in der Genossenschaft **zurück** in die Hände läuft (8.04, der Wendepunkt des Films).
Die Spur schreibt auch alle Zahlen und Zitate (Kit `traceWrite`): die Linie läuft als Grundlinie und lässt die Buchstaben zurück. Und sie ist der wichtigste Übergangsträger: Sie läuft aus dem Bild und wird zur Straße, zur Dachkante, zum Stromkabel, zur Rebzeile.

### 3.3 Der **Becher** (zweites Träger-Objekt)
Ein handgedrehter Steinzeugbecher, ockerfarben glasiert, unten unglasiert, mit einer Daumenmulde am Rand und einer kleinen Unregelmäßigkeit. Immer derselbe Becher (Kit `cup`), bis auf Größe und Licht.
Stationen: **Trainingshalle** (1.19, 1.21, 2.01, 4.14, 8.01–8.04, 9.06, 11.13) → **Wohnzimmer** (2.05, 2.09–2.10, 5.06, 11.14–11.15) → **Küchentisch mit Großmutter** (4.06, zwei Becher) → **Töpferscheibe** (5.11: die Großmutter dreht genau diesen Becher; das ist sein Ursprung) → **Genossenschaft** (8.01–8.04, „Same cup.“) → **Küchentisch im Finale** (12.04–12.05, zwei volle Becher, die sie gemacht hat).
Regel: Der Becher wechselt nie per Schnitt den Ort, außer im einen geplanten Match-Cut 11.13 → 11.14 (Halle → Wohnzimmer, gleiche Bildposition).

### 3.4 Weitere wiederkehrende Objekte
- **Der Wegweiser an der Gabelung:** erst leer (1.09), deine Hand dreht sein Brett (3.13, „we still get a say“), in der blauen Stunde steht der Roboter davor (7.01), am Ende schreibt eine Hand darauf (11.11).
- **Die Milliarde:** winzige Figuren, die das Tal füllen (1.11), gepunktet als Prognose (3.11), solide mit Ladelichtern (6.10), schrumpfend auf wenige (10.08, 12.02). Immer dasselbe Feld (Kit `crowdField`).
- **Die Hallenuhr:** 4.09 (versprochene Zeit), 9.08 (der Arbeitsbogen schrumpft von 8 auf 6 Stunden).
- **Der Turm:** einziges kaltes Licht im Tal (5.10, 6.14–6.15, 11.11).

---

## 4 · Farbpalette (hell genug)

Grundsatz: **Papier statt Nacht.** Der Film liegt überwiegend in Tageslicht. Das Grain sitzt auf einem warmen Papierton, Schatten sind farbig (Violett, Schiefer, Oliv), nie schwarz. Akzent im ganzen Film: die warme Spur (Amber). Kalt ist nur, was wegfließt.

| Token | Hex | Verwendung |
|---|---|---|
| `paper` | `#efe6d2` | Grund, helle Flächen, Kartenpapier |
| `ink` | `#2b2622` | Linien, Schrift, tiefste Schatten (nie reines Schwarz) |
| `morningSky` | `#f4dcb4` → `#cfe0e6` | Hook, Finale (Horizont Pfirsich, oben Hellblau) |
| `mist` | `#e8e3d6` | Nebelbänder im Tal |
| `noonSky` | `#dfe9ec` | Mittag (c02–c03) |
| `hallLight` | `#fbf6ea` | Oberlicht in der Halle |
| `steel` | `#8a9aa6` | Hallenstahl, Fabriken |
| `afternoon` | `#f0c27a` | Nachmittagslicht (c04) |
| `roof` | `#c8714a` | Ziegeldächer |
| `golden` | `#e9a25a` | goldene Stunde (c05) |
| `shadowWarm` | `#6b4a5e` | lange Schatten am Abend |
| `duskViolet` | `#5d4f7a` | Dämmerung (c06) |
| `horizonRose` | `#d98f7a` | Abendhorizont |
| `blueHour` | `#24305a` | **dunkelster Wert des Films**, nur 360–372 s |
| `window` | `#ffb35c` | das eine warme Fenster, Glut |
| `dawn` | `#f2c9a0` | Morgengrauen im Weinberg |
| `vine` | `#6f8f4e` / `leaf` `#9bb86a` | Reben, Garten, Bäume |
| `soil` | `#b8875a` / `#8a5a3c` | Erde, Mine, Ton |
| `traceWarm` | `#fff1c9` / Glut `#ffb35c` | die Spur an Menschenhänden |
| `traceCold` | `#9fb6cf` / Kern `#e6eef6` | die Spur, die wegfließt; der Turm |
| `robotShell` | `#ecebe6` | Porzellanhülle der Roboter |
| `robotJoint` | `#3a3d42` | Gelenke, Roboterhände |
| `robotVisor` | `#1f2a33` | Visier (mit weicher Himmelsspiegelung, **nie leuchtende Augen**) |
| `knit` | `#d9c7a8` | Strickhülle des Heimroboters |
| `magnet` | `#7a6f8f` | Seltene-Erden-Magnete (metallischer Glanz) |

**Messbare Helligkeit** (mittlere Luminanz Y, 0–255, auf 320×180-Graustufen-Render; `tools/luma.mjs`):
- Morgen, Mittag, Nachmittag, Morgen-Finale: **≥ 115** im Mittel pro Shot.
- Goldene Stunde und Dämmerung (c05, c06): **≥ 80**.
- Blaue Stunde (7.01–7.03): **≥ 50**, nie unter 40 in einem Frame.
- Kein Frame außerhalb der Clips unter 40. Höchstens 0,3 s unter 60.
- Gegenprobe: Ein zufälliges Standbild aus jedem Chunk muss auf einem Handy bei mittlerer Helligkeit klar lesbar sein.

---

## 5 · Figuren

Jakob will **lebende Figuren mit Gesichtern** (anders als die gesichtslosen Silhouetten in Film 5/8). Stil: Editorial-Illustration, flache Formen mit Schraffur und Randlicht, im Dreiviertelprofil oder Profil. Gesicht: zwei dunkle ovale Augen mit Lidschlag (alle 3–6 s, 120 ms, zufällig versetzt), Brauen, Nasenlinie, Mund; Blick folgt dem Geschehen (Kopf dreht 80 ms nach dem Ereignis). Atmen 0,25 Hz (Schultern ±1,5 px), Gewichtsverlagerung alle 4–7 s. Runde, abfallende Schultern, natürliche Arme **vor oder neben dem Körper, nie hinter dem Rücken**. Hände mit lesbarem Daumen und vier Fingern. Kit: `person10()` auf Basis von `figure.mjs` (`life`, `blink`, `walk`, `reachArm`).

| Figur | Aussehen | Wo |
|---|---|---|
| **Du** | ~35, kurze dunkle Haare, mittlerer warmer Hautton, **ockerfarbener Strickpulli** `#c98a3a` (der Ärmel ist das Erkennungszeichen deiner Hand) | Wohnzimmer, Küche, Halle (5.01), Hausregeln, Finale |
| **Die Großmutter** | ~80, weißes Haar im Knoten, Brille, altrosa Strickjacke `#c79a9a`, Hände mit Altersflecken | Küchentisch (4.03–4.06), Töpferscheibe (5.11), Finale (12.05). **Kein Roboter berührt sie.** |
| **Die Trainerin** | ~28, ostasiatisch, Haare zum Zopf, **petrolfarbene Arbeitsjacke** `#3f7f7a`, VR-Headset (zwischen den Wiederholungen auf die Stirn geschoben, damit man ihr Gesicht sieht) | Halle (1.19, 2.01–2.02, 4.14–4.15, 8.01–8.04, 9.06–9.09, 11.13) |
| **Die Winzer** | 4–5 Personen, gemischtes Alter, Strohhut und Kappe, blaue Arbeitskleidung `#4a6a8a` | Weinberg, CUMA-Halle |
| **Ensemble** | Arbeiter in der Werkstatt, Genossen in der Halle, Dorfbewohner in Indien, Arbeiter in Mondragon, Werkstattleute in c11, Pflanzende im Endscreen | jeweils nur dort |

**Roboter** (gezeichnet, nie primitive Formen, nie Gesichter, nie leuchtende Augen):
- **Der Lerner** (Humanoid, 1,7 m): Porzellanhülle, Graphitgelenke mit sichtbaren Gelenkringen, dunkles Visier. Halle, Rennen (mit Startnummer), Straße.
- **Der Heimroboter** (Neo-Art): derselbe Körper in beiger Strickhülle `knit`, kleine Statusleuchte am Hals (aus/an), Schalter im Nacken.
- **Der Kleine** (1,3 m): wie der Lerner, kleiner (Markt, „six thousand dollars“).
- **Der Rebroboter**: Portalfahrzeug über einer Rebzeile mit zwei Armen, Schild „CUMA“.
- **Der SO-101-Arm**: Tischarm aus gedruckten Gliedern (zwei Farben, Servokästen), drei kleine Lampen am Sockel.
Roboter erledigen Dinge. Menschen sind füreinander da. **Kein Roboter am Bett, kein Roboter pflegt, füttert oder hält einen Menschen.** In den Pflege-nahen Sätzen steht der Roboter an der Schwelle oder im Hintergrund.

Verboten im ganzen Film: Musk, Tesla, Optimus; leuchtende Roboteraugen, Androidengesichter, Gehirne, Platinen, Binärregen; Globen; Kalender und Sanduhren; Waage; Urne, Gesetzbuch, Anteilsscheine; Horrorbilder in der Ökologie (keine Totenköpfe, kein Blut, kein Höllenrot). Die Mine ist ernst und still, nicht dämonisch.

---

## 6 · Regeln gegen Hektik (messbar)

**Schnittbudget**
- Harte Schnitte in der Animation: **höchstens 3** im ganzen Film. Geplant ist **1**: 11.13 → 11.14 (exakter Match-Cut Halle → Wohnzimmer auf dem gehobenen Becher). Die zwei Reserve-Schnitte darf der Lead freigeben, nie ein Builder allein.
- Clip-Ein- und -Ausstiege sind Schnitte, zählen aber getrennt (8 im Film, §7). Schnitte innerhalb eines Footage-Slots (zwischen K2a und K2c) gehören zum Footage.
- Alles andere sind **Fahrten** (Kamera reist durch die Welt), **Verwandlungen** (Tonrillen werden Höhenlinien, Papierkante wird Dachkante), **Flüge in eine Fläche** (Fenster, Visier, Hallentor) oder **Plansequenzen** (gleiche Einstellung, neues Motiv).

**Bewegungsbudget**
- Gleichzeitig höchstens **2 Hauptbewegungen**; die Kamera zählt als eine. Bewegt sich die Kamera über 2 s, bewegt sich sonst höchstens ein Element.
- Umgebungsleben (Atmen, Blinzeln, Nebel, Blätter, Korn, Wimpel) zählt nicht, bleibt aber klein: ≤ 4 px Amplitude, ≤ 20 px/s.
- Kamera-Geschwindigkeit: Hintergrund bei Fahrten ≤ 140 px/s (Bildschirm), Drift im Halten 8–25 px/s. Zoom ≤ 25 % pro Sekunde.
- Höchstens **8 Kamerabewegungen pro Minute** (Fahrt, Kran, Schwenk, Neigung, Flug, Rückzug, Push > 5 %; Drift und 1–3 %-Push zählen nicht), geplant sind im Mittel ≈ 6,7, also eine Bewegung etwa alle 9 s. Nie zwei Bewegungen direkt hintereinander ohne 2 s Halten dazwischen, außer eine Fahrt geht nahtlos in eine Plansequenz über.
- **Hook-Ausnahme (0–60 s):** alle 2–3 s ein neues Bild, aber durch Fahrten und Clips, nicht durch Schnitte im gezeichneten Teil.

**Messung vor jedem Bericht** (`tools/smooth.mjs` aus Film 8): mittlere absolute Bilddifferenz (MAFD) pro Frame auf 320×180 Graustufen.
- Halten: 0,5–3. Fahrten: ≤ 8. **Kein Frame über 12** außer an Clip-Schnitten und dem einen Match-Cut.
- Kein Frame > 2,5× seiner Nachbarn (keine Ruckler).
- Mittelwert pro Chunk ≤ 1,1× des Mittelwerts von Film 6 (Referenz einmal vom Lead gemessen und in `tools/ref_film06.json` abgelegt).
- Stillstand: kein Abschnitt > 2 s mit MAFD < 0,3 außerhalb des Endscreens. Unter 5 % fast statische Frames pro Chunk.

**Zufallsbild-Test:** In jedem zufälligen Frame lebt etwas, und genau **ein** Ding zieht den Blick. Jedes Schlüsselbild funktioniert als Plakat: Vorder-, Mittel-, Hintergrund, Asymmetrie, freie Fläche, 2–3 Hauptfarben plus Neutrale.

**Ein Motiv pro Satz**, und das Bild zeigt, was der Satz sagt, auch ohne Ton. Kurze Satzfolgen („The laundry. The cleaning. …“) sind Takte **innerhalb einer** Einstellung.

**Nichts aus dem Nichts:** Jedes neue Element wird hereingetragen, läuft herein, wächst sichtbar, wird von etwas Vorhandenem enthüllt oder von der Spur geschrieben. Nichts blendet halbtransparent ein; was entsteht, steigt als ein festes Bild auf (`riseFromDark`/`reveal`) oder zeichnet sich.

---

## 7 · Clips (ORIGINAL FOOTAGE)

Nur im Hook (Rennen), in der Halle (K3) und bei Neo (K4). Clips liegen in `/mnt/project-files/scenario/film-roboter/clips/` (ohne Ton, 8–11 s, YouTube-Standardlizenz: **Rechte klären**, bevor veröffentlicht wird).
- Clips laufen **bildfüllend** (Hook-Energie) mit hartem Schnitt hinein und hinaus. Am Ausstieg steht die gezeichnete Welt in derselben Bildaufteilung (Horizont, Hauptobjekt an derselben Stelle), damit der Schnitt wie ein Match wirkt.
- Unten links über y 900: Ort und Datum in Inter-Versalien plus das Tag `ORIGINAL FOOTAGE` (klein, 60 % Deckkraft). Unterste 170 px frei (Untertitel).
- Senderlogos und Overlays wegschneiden: K1a/K1b (CGTN „sports scene“, 央视频) durch Ausschnitt 1,15×; K3 (CGTN oben links, Untertitelbalken) Ausschnitt; K2b nur als Ersatz (CCTV-Overlay).
- Solange ein Clip fehlt: **Platzhalter** `clipSlot()` mit grauer Karte, Slot-ID, Dauer und Beschreibung, damit Timing und Schnitte schon stimmen.
- Code-Overlay auf K2a: die zwei Zeiten (§8). Die Renn-Uhr im Footage (0:58:13) wird abgedeckt oder liegt außerhalb des Ausschnitts, damit nicht zwei Uhren widersprechen.

---

## 8 · Text im Bild (nach Faktencheck v3)

Schriften: **Instrument Serif** (Zahlen, Zitate), **Inter** Versalien (Orte, Quellen, Labels). Text wird von der Spur geschrieben (`traceWrite`) oder per Maske Wort für Wort enthüllt; nie bewegt, solange er gelesen wird; ≥ 1 s lesbar bei ≤ 12–15 Zeichen/s. Jede Zahl trägt ihre Quelle.

| Wo | Text |
|---|---|
| K1a | `BEIJING · APRIL 2025` |
| K2a | `BEIJING · APRIL 2026` · bei „faster“: `ROBOT 50:26` gegen `HUMAN WORLD RECORD AT THE TIME: 57:20` |
| 1.10 | `2025: >13,000` · `OMDIA` |
| 1.11 | `~1 BILLION BY 2050` · `FORECAST, MORGAN STANLEY` |
| K3 | `CHINA · ROBOT TRAINING CENTRE` |
| 2.01 | `>40 STATE-BACKED TRAINING HALLS · ANNOUNCED` |
| K4 | `1X NEO · USA · MAKER'S FILM, 2025` |
| 2.07, 5.05 | Zitat „If we don't have your data, we can't make the product better.“ · `BERNT BØRNICH, CEO OF 1X (MAKER OF NEO) · WALL STREET JOURNAL, 2025` |
| 3.03 | `UNITREE R1 · ~$6,000` |
| 3.05 | `~90 % IN COMPANIES · FORECAST, MORGAN STANLEY` |
| 3.07 | Balken **59 %** · `NEW FACTORY ROBOTS INSTALLED IN CHINA · IFR 2026` |
| 3.09 | `JAPAN · WORKING AGE: 74 → 62 MILLION (2040)` |
| 3.11 | `FORECAST` |
| 4.12 | Kopf des Zettels `BILL 1 · US` · 6.01 `BILL 2 · THE PLANET` |
| 5.09 | `~9 IN 10 FROM CHINA · OMDIA 2025 (87 %)` |
| 6.05 | `2–4 KG RARE-EARTH MAGNETS PER ROBOT` · `≈ 2× AN ELECTRIC CAR` |
| 6.07 | `< 1 % OF RARE EARTHS RECYCLED` |
| 6.14 | `FORECAST · MORGAN STANLEY` |
| 7.05 | `CUMA · ~10,000 GROUPS · ~195,000 MEMBERS` |
| 7.10 | Zitat „Who owns the robots rules the world.“ · `RICHARD FREEMAN, HARVARD · IZA WORLD OF LABOR, 2015` |
| 8.09–8.10 | `KARYA · INDIA` · `SEVERAL × MINIMUM WAGE · SELF-REPORTED` |
| 9.02 | `MONDRAGON · TENS OF THOUSANDS OF WORKER-OWNERS` |
| 9.04 | `FAGOR · BANKRUPT 2013` |
| 9.08 | `SHORTER DAYS · SAME INCOME` (als Möglichkeit, kleine Schrift `COULD`) |
| 10.04–10.05 | `NIRON MAGNETICS · IRON NITRIDE · MINNESOTA` · `FIRST LARGE FACTORY · UNDER CONSTRUCTION` |
| 10.14 | `1X NEO · ASKS FIRST · NO-GO ZONES` |
| 11.02–11.03 | `SO-101 · OPEN PLANS · HUGGING FACE` · `FROM ~$100` |

Diegetisch, nicht als Einblendung: Wegweiser (Ländernamen), Schild „CUMA“ am Rebroboter, Kreideschrift „ROBOT CO-OP“ in der Halle, „FAGOR“ an der dunklen Halle, Stempel „MAGNETS · RETURN“.

---

## 9 · Kit: `lib/f10_kit.mjs` (vom Lead/K0 zuerst gebaut, bevor Chunks starten)

Reine Funktionen von `t`, deterministisches `prng`, Caching statischer Ebenen (`layer`, `once`, `ready`) wie in `f6_kit`/`f8_kit`. Jeder Baustein hat ein Referenz-Standbild in `tools/k0_stills.mjs`.

**Welt und Licht**
- `tod(t)` → Tageszeit 0..1 aus der Filmzeit (Keyframes §2.3); `light(tod)` → `{ sky:[top,horizon], sun:{x,y,col}, dir, shadowLen, temp, fogCol, rim }`. Einzige Quelle für Licht.
- `VAL` → Weltkoordinaten aller Orte (§2.2), inklusive Kamerastellungen für jede Station (`VAL.cam.hallStation`, `VAL.cam.kitchen`, `VAL.cam.fork` …).
- `valley(ctx, t, { cam, tod, layers, mine 0..1, green 0..1, scrap 0..1, crowd, keys })` → das ganze Tal in 6 Parallaxe-Ebenen (Himmel, ferne Kämme + Hügel/Mine + Turm, Weinberg, Talboden mit Fluss/Halle/Werkstätten, Hang mit Haus und Straße, Vordergrund-Gräser). Gibt Bildschirmpositionen aller Orte zurück.
- `road(ctx, t, { cam, startLine, barriers, bunting, fork })`, `signpost(ctx, t, { x, y, s, boards:[{text, dir}], turn u, write u })`.
- `mist(ctx, t, { cam, bands, col })`, `sunDisc`, `birds(ctx, t, { n, from, u })`.
- `crowdField(ctx, t, { cam, n, spread u, ghost 0..1 (gepunktet), lights 0..1, thin 0..1, keep:[places] })` → die Milliarde, instanziert und gecacht.
- `cutaway(ctx, t, { section 0..1 })` → Querschnitt unter dem Tal (Erdschichten, Erzadern, Löcher).

**Orte (Innenräume, gleiche Wände in allen Chunks)**
- `hall(ctx, t, { cam, tod, stations 12, lit:[…], members, sign 'chalk'|'none', clock { workArc } , gateOpen u })`.
- `house(ctx, t, { cam, room 'living'|'kitchen'|'hall'|'bedroom'|'shed'|'cutaway', tod, through(g) (Blick aus dem Fenster = valley) })`.
- `workshop(ctx, t, { kind 'weld'|'bench'|'market'|'factoryLine'|'yard'|'maker', … })`, `cumaShed`, `vineyard(ctx, t, { rows, robot, growers, handprints })`, `datacenter`, `mineHill(ctx, t, { cut u, green u })`, `scrapHeap(ctx, t, { u })`, `tower(ctx, t, { lit, keys u })`, `villageIndia`, `basqueHills({ halls:[{lit}], fagor })`, `buildSite({ crane u })`, `treeField(ctx, t, { rows, planters, u })`.

**Figuren und Hände**
- `person10(ctx, t, { who 'you'|'grandma'|'trainer'|'grower'|'worker'|'villager', pose, x, y, s, face { look, blink true, smile 0..1 }, arms {…}, headset 'on'|'up'|'off', light })` mit `life()`, `blink()`, `walk()`.
- `humanHand(ctx, t, { x, y, s, rot, skin, sleeve, grip 0..1, palm 'up'|'down'|'side', mark 0..1 (warmer Anteil auf dem Handrücken) })`.
- `robotHand(ctx, t, { x, y, s, rot, curl:[5], grip 0..1 })`.
- `guide(ctx, t, { x, y, s, u, release 0..1, trace true })` → **die Führung** (Signature Move) als fertige Komposition, gibt Spur-Punkte zurück.
- `robot(ctx, t, { kind 'learner'|'home'|'small'|'runner', x, y, s, pose, walk, look, visor { reflect, rec 0..1, shutter 0..1 }, xray 0..1, joints 0..1, battery 0..1, statusLight, bib })`, `vineBot`, `soArm(ctx, t, { build u, lamps:[0..1,0..1,0..1], grip })`.

**Die zwei Träger und die Spur**
- `cup(ctx, t, { x, y, s, rot, tilt, fill 0..1, steam 0..1, clay 0..1 (auf der Scheibe: nass, unglasiert) })`.
- `trace(ctx, t, { pts | from:joint, to, u, col 'warm'|'cold'|mix 0..1, ticks true, w, dir 1|-1 (rückwärts = zurück in die Hand) })`.
- `jointArcs(ctx, t, { joints:[[x,y,a0,a1]], u, col })` → Winkelbögen mit Skalen-Ticks.
- `traceWrite(ctx, t, { text, x, y, size, font, words (T.W, mit der Stimme), source, u })` → Zahlen, Labels, Zitate.
- `halo(ctx, t, { x, y, n tries, u })` → Hunderte Versuchsbögen um den Becher (2.10).

**Requisiten:** `priceTag`, `usedCar`, `crates({ stencil })`, `planSheet({ unroll u, seal })`, `clockFace({ workArc })`, `poster`, `noteWall({ fill u, pulled u })`, `billStrip({ unroll u, header })`, `paySlip`, `keys({ flow u })`, `potterWheel({ spin, clay })`, `magnets({ n, pile })`, `skip`, `recycleLoop({ fill })`, `cable({ pulses })`, `drawer({ open u })`, `blueprint({ unfold u })`, `printer3d({ u })`, `woodBox({ lid u })`, `thresholdLine`, `shippingBox({ label, open u })`.

**Kamera und Übergänge**
- `camPath(keys)` mit Prüfung: jede Strecke ≥ 1,6 s, Easing nur `sineS`/`qio`; warnt bei > 140 px/s. `drift(t, seed)` für das Halten.
- `flyInto(ctx, t, { rect, u, next(g) })` → Flug in Fenster, Visier, Hallentor.
- `morphLine(ctx, t, { from pts, to pts, u })` → Spur/Kante wird Straße, Dachlinie, Höhenlinie.
- `HAND` → Übergabetabelle der Chunk-Grenzen (§10) mit gemeinsamer Kamerastellung und Zeit, damit beide Builder dasselbe Bild zeichnen.

**Clips und Prüfwerkzeuge**
- `clipSlot(ctx, t, T, id, { crop, place })` → Clip-Frames oder Platzhalterkarte; `lowerThird(ctx, t, { place, date, footage true })`.
- `tools/smooth.mjs` (MAFD), `tools/luma.mjs` (Helligkeit), `tools/seam.mjs` (Chunk-Grenzen), `tools/cuts.mjs` (zählt Frames mit MAFD > 12 und meldet ungeplante Schnitte).

---

## 10 · Chunk-Grenzen (Übergaben)

| Grenze | Zeit (s) | Träger und Art |
|---|---|---|
| c01 → c02 | 74,94 | Plansequenz in der gezeichneten Halle (gleiche Kamera, Becher in der Mitte) |
| c02 → c03 | 125,12 | Das Buch klappt zu → Rückfahrt durch das Wohnzimmerfenster ins Tal (Start 124,6) |
| c03 → c04 | 192,20 | Deine Hand dreht das Brett am Wegweiser, es zeigt zum Haus → Fahrt die Straße hinauf |
| c04 → c05 | 246,78 | Plansequenz in der Halle: Schwenk eine Station weiter, dort stehst du |
| c05 → c06 | 292,42 | Verwandlung: die Rillen im Ton auf der Scheibe werden die Höhenlinien des fernen Hügels |
| c06 → c07 | 360,82 | Der Querschnitt schließt sich, die Horizontlinie bleibt → blaue Stunde |
| c07 → c08 | 409,00 | Ein warmes Licht auf einer Winzerhand → Spur läuft das Tal hinab ins Hallentor |
| c08 → c09 | 454,14 | Der westliche Lichtfaden → Schwenk nach Westen |
| c09 → c10 | 507,52 | Der geteilte Roboter rollt in die CUMA-Halle |
| c10 → c11 | 560,90 | Plansequenz: die Kamera fährt die Straße mit den Fenstern weiter zu den Werkstätten |
| c11 → c12 | 612,74 | Daumen auf dem Schalter → Fahrt aus dem Wohnzimmerfenster ins Tal |

---

## 11 · Musik und Geräusch

Eine ruhige Musik pro Abschnitt (M0–M4), Einsatz hart mit dem ersten Wort. Geräusche aus `/mnt/project-files/scenario/sfx-bibliothek/` (`akzent/`, `atmo/`), Akzente in Sprechpausen, 3–6 pro Chunk. Atmo folgt dem Tageslauf: Morgenvögel, Halle (Hall, ferne Servos), Wohnzimmer, Werkstatt, Abendgrillen, blaue Stunde fast still, Weinberg im Morgen, Küche (Wasserkessel), Endscreen Morgenwind. Neu gebraucht: leises Servo-Summen (Roboterfinger), Ton auf der Drehscheibe, Kreide auf Wand, Spur-Schimmer (glasig, sehr leise).

## 12 · Gates (in dieser Reihenfolge)
1. Plan zuerst: Kommentartabelle pro Shot oben in der Szenendatei (Anker-Wort, Bild, Hauptlicht, 1–2 Bewegungen, Kamera, Übergang, ★, Ton).
2. Bauen, dann anschauen: Standbilder alle ~0,5 s um jede Fahrt und eins pro Satz. Mindestens 3 Review-Runden.
3. `smooth.mjs`, `luma.mjs`, `cuts.mjs`, `seam.mjs` laufen lassen; Werte in den Bericht.
4. Performance ≤ 300 ms pro Frame in voller Größe inklusive Finish.
5. Selbstnote 1–5: Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Figuren glaubhaft · Text. Nichts unter 4.
6. Nur eigene `scenes/scNN.mjs` und neue `lib/f10_cNN_*.mjs` anfassen. Kit-Fehler gehen an den Lead. Nicht committen.

---

## 13 · Explainer-Ebene (seit 2026-10-24, verbindlich)

Jakob: Der Film ist **weder nur 3D-Spiel noch nur Infografik**. Er ist ein imaginativer Raum, in dem Landschaft, Häuser, kleine Figuren **und** Erklärgrafiken nach den 12 Prinzipien ineinanderfließen, ohne Blenden oder Wischer. Ziel: **35–45 % der Laufzeit c02–c12 sind Explainer** (Diagramme, Zahlen, Karten, Abläufe, Querschnitte, Kostenrechnungen, Besitzanteile), jeweils aus einem Ding der Welt gewachsen und in eines zurückgekehrt. Die Liste steht in `shots.md` (Ebene `[EXPL]`, Träger-Spalte).

### 13.1 Grafiksprache: Licht auf Nacht
- **Keine Tafel, keine Folie, kein Rahmen.** Eine Grafik ist **Licht auf dem Indigo-Grund**: Ein dunkles Feld öffnet sich wie eine Iris aus dem Objekt (`card`), darin leuchten Linien, Flächen und Zahlen. Die Grafik ist das Heldenlicht des Bildes (sie registriert sich selbst), die Welt tritt dahinter zurück, bleibt aber sichtbar.
- **Farben:** Creme `#f6ecd6` für Zahlen, Linien und Labels; Amber `#ffb35c` (und `#f0a040`, `#ffc46a`) für das Menschliche und für Anteile; Cyan `#8fe6ff` sparsam für Maschine und Daten; Indigo `#141c50`/`#0b1238` als Grund unbeleuchteter Flächen. Kalte, wegfließende Werte sind Cyan, warme, zurückkehrende Amber (wie die Spur, §3.2).
- **Schrift:** Zahlen **Instrument Serif** mit leichtem Amber-Glow (`glowText`), Labels **Inter 600 Versalien**, Sperrung 3. **Höchstens eine Zahl und ≤ 6 Wörter pro Grafik**, plus Quelle.
- **Lesbar am Handy (Gate):** Zahl ≥ 120 px (Held 168), Label ≥ 34 px, Quelle ≥ 24 px (bei 1080p). Kontrast gegen den Grund WCAG ≥ 7:1 für Zahlen, ≥ 4,5:1 für Labels (`K.wcag`, EXP ist geprüft: Creme 13,6 · Amber 9,0 · Cyan 11,4). Prüfung: 390 px breite Kopie (`tools/expl_stills.mjs` schreibt `*_phone.jpg`): jedes Label muss dort lesbar sein. **Nie halbtransparent oder geisterhaft**: Schrift erscheint per Masken-Wipe von der Grundlinie und steht still, solange sie gelesen wird (≥ 1,5 s und ≥ Zeichen/12 s).
- **Kein Text über unruhigem Grund:** Labels sitzen im dunklen Feld der Iris oder auf Himmel, nie über Figuren oder Kanten.

### 13.2 Wie eine Grafik aus der Welt wächst und zurückgeht (die Verwandlungen)
Jede Verwandlung ist **ein Träger-Objekt**, das seine Form behält und die Bedeutung wechselt (Jakobs Vokabular: **(a)** ein Objekt löst sich aus dem Bild und landet/verwandelt sich im nächsten · **(b)** Zoom in das Objekt, es wird das Nächste · **(c)** schnelle Bewegung geht in gleichgerichtete schnelle Bewegung über). Hin- und Rückweg werden in `shots.md` mit Träger, Bildposition und Richtung notiert.

| # | Träger | Hin (Welt → Grafik) | Zurück (Grafik → Welt) | Kit |
|---|---|---|---|---|
| T1 | **Lichtspur → Kurve** | Die Spur löst sich von Hand/Straße, legt sich in 0,8 s zur Datenkurve (`curve({ from: Spur-Punkte, k })`), Achsen gravieren sich aus dem Ursprung; Prognose gepunktet | Die Kurve legt sich zurück auf eine Linie der Welt (Straße, Dachkante, Stromleitung, Rebzeile) | `curve`, `trace` |
| T2 | **Becher → Kreis der Anteile** | Kamera steigt über den Becher, sein Körper sinkt in den Rand, der Rand glüht auf, wandert und wächst zum Kreis, die Anteile füllen sich mit Licht | Der Kreis schrumpft zurück auf den Rand, der Becher steht wieder (gleiche Bildstelle) | `cupPie`, `pie` |
| T3 | **Gelenk/Magnet → Querschnitt** | Push aufs Knie, die Hülle wird Schraffur, ein Keil öffnet die Ringe (Gehäuse, Spulen, Magnet, Welle), Leader-Linien mit kg | Der Magnetring gleitet als Ding heraus und fällt in die Welt (Container, Kiste) | `section('rings')`, `tag` |
| T4 | **Tal von oben → Karte aus Licht** | Kran bis senkrecht, die Welt sinkt ins Dunkel, Straßen und Fluss zeichnen sich als Lichtlinien, Orte als Lichtpunkte, Routen als Spur | Kamera neigt sich wieder, die Linien sind wieder Straßen | `mapSheet`, Crowd-Lichtpunkte |
| T5 | **Hand-Kette → Ablauf** | Die Gelenkbögen/Datenpunkte einer Bewegung ziehen sich zu Knoten zusammen: „Mensch macht vor → Daten → Modell → Roboter“, Pfeile sind die Spur (warm → kalt) | Der letzte Pfeil wird die Bewegung der Roboterhand | `flow`, `arrow` |
| T6 | **Rundes/Gerades Ding → Kreis/Balken/Zähler** | Uhr/Akkuanzeige → Tageskreis, Preisschild → Zähler, Hocker/Kisten → Balken, Recyclingkreis um den Container → Ring mit Haarstrich-Anteil, Erde → Schichten mit Löchern | Rückwärts in dasselbe oder das nächste Ding | `pie`, `counter`, `bars`, `tally`, `section('layers')` |

Ablauf jeder Verwandlung: **Antizipation** (das Ding glüht/zuckt 0,2 s) → **Verwandlung schnell** (0,6–0,9 s, expoOut, die Kamera schiebt in die Iris) → **Halten 1,5–3 s mit Drift** (die Grafik lebt: Zahl rollt aus, ein Anteil füllt sich nach) → **Rückweg 0,7–1,0 s** in ein Ding der Welt. **Keine Blende, kein Wischer**: Die Kamera fährt in die Grafik hinein und aus ihr heraus. Die Iris ist kein Wipe, sie wächst aus einem Punkt, der Licht ist.

### 13.3 Regeln (aus den Skills übernommen)
- **Ein Fokus:** Während eine Grafik steht, ist sie das einzige Licht; die Welt bewegt sich nur als Drift. Höchstens 2 bewegte Hauptelemente; Grafik-Teile starten versetzt (≥ 0,3 s), nie gleichzeitig.
- **Träger je Übergang:** Ohne Träger kein Wechsel. In `shots.md` steht jeder Wechsel 3D ↔ EXPL mit „A → B · Position · Richtung“.
- **Tempo-Kontrast 3–5×:** schnelle Verwandlung, langes Halten. Die Kamerafahrt in die Grafik zählt als Kamerabewegung (§6 Budget).
- **Wow-Moment:** einer pro Chunk; er darf eine Grafik sein (c06 Umsatzlinie/Minen, c09 Arbeitstag 8 → 6 h).
- **Ruhe-Regeln bleiben:** ≤ 3 harte Schnitte im Film, Halte-Momente 1,5–3 s, mafd ≤ 0,5 je Abschnitt.
- **Fakten:** nur Werte aus `faktencheck.md` (Einblendungen) und §8; jede Zahl mit Quelle. Prognosen gepunktet und mit `FORECAST`. Im Bild „artificial intelligence“, nie „AI“.

### 13.4 Kit-Bausteine (`lib/f10_expl.mjs`, über `lib/f10_kit.mjs`)
`EXP` (Farben, Mindestgrößen) · `wcag` · `card` (Iris aus einem Objekt, registriert das Heldenlicht) · `glowText` · `tag` (Lichtpunkt + Linie + Worte) · `counter` (Zählwerk) · `bars` (Balken, `ghost` = Prognose) · `tally` (n Striche/Figuren, `lit` gefüllt) · `curve` (Spur → Kurve) · `pie` · `cupPie` (Becher → Kreis) · `section` (`rings` Gelenkmotor, `layers` Erdschichten mit Löchern) · `arrow`/`flow` (Ablauf) · `mapSheet` (Tal von oben → Karte). Referenzstills: `node tools/expl_stills.mjs <dir>`.
