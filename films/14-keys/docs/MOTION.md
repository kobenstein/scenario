# Film 14 · „Who Holds the Keys to Superintelligence?“ · Motion-Regeln (Lead-Brief für alle Builder)

Stand 2026-10-28 (Lead Bild, v1). The Good Takeoff, Englisch, 1920×1080, 30 fps.
- **Text:** `film-kontrolle/vo-v3.txt` (eckige Klammern werden nicht gesprochen).
- **Timing:** `film-kontrolle/audio/timing.json`, 597,24 s. Abschnitte `s00` … `s22`, Wortzeiten global in s, der Zitat-Clip `Q1` (Karte, 8,74–14,24). VO-Ende 581,34 s, danach ein Endscreen von ~15 s, der sich weiter bewegt.
- **Mix:** `film-kontrolle/audio/mix.wav` (VO + Musik). Musik-Cues: M0 0 · M1 64 · M2 141 · M3 225 · M4 305 · M5 389,5 · M6 468 s.
- **Bindende Shotliste:** `shots.md` (Quelle `tools/shots14.py`).
- **Stil:** `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (gilt vor allem anderen).
- **Vorlage:** Film 13 (`docs/ref-13/`), gleiche Engine, gleiches Finish, gleiche Gates.

Leitidee: *Die Schlüssel zur Superintelligenz sind keine Metallstücke, sondern Regeln: wer die Datei hält, wer hineinsehen darf, wer prüft. Heute halten sie wenige. Die Frage ist, ob wir mitbestimmen, wer sie hält.*

Lies das ganz, bevor du eine Zeile Code schreibst. Der Film ist **gezeichnet** (Canvas 2D, Node, `@napi-rs/canvas`): keine KI-Bilder, kein Bild-zu-Video, kein Footage.

---

## 0 · Status
- **Hook fertig (c01 + c02 bis 2.03), zugleich der Stil-Test:** `scenes/sc01.mjs` + `scenes/sc02.mjs` (beide ziehen `lib/f14_hook.mjs`), 0 bis 42,4 s, Shots 1.01–2.03.
  - Video: `film-kontrolle/render/stiltest-20s.mp4`; Kontaktbogen: `stiltest-20s-kontakt.jpg` daneben.
  - **Der Test ist 42 s statt 20 s lang:** „one giant file“ und „Copy it … you have it“ liegen im echten VO erst bei 37–41 s.
- **Vollbau läuft sofort** (Jakob 28.10.: keine Stil-Test-Freigabe nötig): drei Builder plus Lead nach `BRIEF-builders.md`. Die Nähte zwischen den Gruppen sind fertig (`lib/f14_seams.mjs`, Ansicht `node tools/seam_plates14.mjs <dir>`). Fehlende Chunks rendern als Platzhalter (`lib/stub.mjs`).
- Daten-Wurzel: `lib/kit.mjs ROOT` = `$F14ROOT` (sonst `$F13ROOT`, sonst `/mnt/project-files/scenario/film-kontrolle/`). `TIMING=…` überschreibt nur die Timing-Datei.
- **Immer über Wörter ankern** (`T.S('s03', 'giant')`, `T.E(…)`, `T.clip('Q1')`), nie über Sekunden.

## 1 · Motion-DNA (eine Zelle: ruhig + weich, Editorial)
Wie Film 13, mit einer Verschärfung: **ruhiger.**
- **Ton:** Akzente nur auf dem Schlüsselwort eines Satzes, Tempo-Kontrast 3–5×, danach 1,5–3 s lebendiges Halten.
- **Easing:**
  - Auftritte expo-out, Abgänge expo-in, Bewegungen quart in-out.
  - **Kamera sinus-S**, nie linear außer konstanter Mechanik (Zahlen-Welle, Drossel).
  - Kein Federn, ≤ 3 % Überschwingen.
  - **Linien, die über große Flächen wachsen** (Blaupausen-Raster, Tabellenlinien): `sineIO`, nicht expo-out. Expo-out auf langen Linien erzeugt einen Ruck im ersten Bild (gemessen im Stil-Test bei 7,6 s).
- **Basiseinheit 0,4 s:**
  - Mikroakzent 0,25–0,35 s;
  - Auftritt 0,4–0,7 s;
  - Hand 0,8–1,2 s;
  - Kamera ≥ 1,6 s, Fahrten 2,5–5 s.
- **Ursache und Wirkung:** Der Schlüssel dreht sich, und 40–120 ms später antworten die Rack-Lichter. Die Kopie gleitet, und die kühlen Ziffern ziehen nach.
- **Keine Blenden:** kein Crossfade, kein Fade über Schwarz, kein Slide, kein Wischer. **Jeder Übergang trägt ein Objekt sichtbar ins nächste Bild**, siehe §3 und die Spalte „Übergang“ in `shots.md`.
- **Kein Computerspiel-Look:**
  - keine glänzenden 3D-Körper, kein HUD, keine Neon-Platinen, keine Matrix-Ziffernregen;
  - Ziffern sind ruhige Creme-Typo (Inter, tabellarisch), nie grün, nie fallend.

## 2 · Die Welten (2/3 Explainer, 1/3 Szene)
**Kein durchgehendes Motiv.** Der Schlüssel ist **nur an vier Ankern** im Bild, dazwischen hat jede Station ihre eigene Welt mit echten Erklärgrafiken.

Gemessen mit `tools/shots14.py`:
- Explainer-Anteil 65 % der VO-Zeit (64 % mit Endscreen);
- Schlüssel im Bild 24 % der VO-Zeit;
- 12 Welten, 7 harte Wechsel = 0,72 pro Minute.

| Chunk | Station | Welt | Erklärgrafik (das Bild muss ohne Ton lesbar sein) | Licht / Held |
|---|---|---|---|---|
| c01 | Hook | Rechenzentrum bei Nacht, du klein davor | Blaupause (verstanden / jedes Teil), Zitatkarte Amodei, Schloss in der Fassade | **Schlüssel-Anker 1**: der Schlüssel aus Licht |
| c02 | Hook II | **durchs Schlüsselloch** ins Innere | **Zahlenfeld → die eine riesige Datei** (THE WEIGHTS), die Kopie | die Datei |
| c03 | Station 1a | Rechenkern-Block → **Tresorraum (runde Tür)** | Datei im Fach, „two-party authorization“-Karte | Lichtfugen der Tresortür |
| c04 | Station 1b | Diagramm Sicherheitsbereich → **Startraum 1950er** | **Datenfaden durch die Drossel (Egress)**, Bereichsgrenze; die Zwei-Personen-Regel | **Schlüssel-Anker 2**: zwei Schlüssel, zwei Hände, ein Pult |
| c05 | Station 2 | **Codeseite aus Licht** (Schläfer) | Datumsfeld **2023 → sicherer Code / 2024 → Lücken**; Training wäscht es nicht aus | die Jahreszahl |
| c06 | Station 3 | **Reim-Plan + Mikroskop** | „grab it“ → **rabbit** (gewählt) / habit / green; die Linse zeigt den Plan vor dem Reim | das Wort im Plan → die Linse |
| c07 | Station 4 | zwei Labor-Gebäude → **Testtabellen nebeneinander** | OpenAI ⇄ Anthropic, Aug. 2025; „sycophancy“ | **Schlüssel-Anker 3**: der zweite Schlüssel in fremder Hand |
| c08 | Station 5 | Berge im ersten Morgenlicht, **die offene Glasbox** | öffentliche Dateiliste (Daten, Code, Gewichte); Tresor gegen Glas, die Waage | die Glasbox |
| c09 | Finale | Morgendämmerung | **Epoch-Balken: 5 Firmen ≈ 71 %**, dann der Ring | **Schlüssel-Anker 4**: der Schlüsselbund; Endscreen |

**Lichtbogen:** Nacht (c01–c07) → erstes Morgenlicht in den Bergen (c08) → warmer Morgen (c09). Die Dämmerung gehört dem Lösungsteil. Warm heißt Mensch und Kontrolle in vielen Händen; kühl heißt Maschine, Kopie, das Unverstandene.

**Die vier Schlüssel-Anker:**

| # | Shots | Zeit (s) | Was |
|---|---|---|---|
| 1 | 1.01–1.06 | 0–32 | der eine leuchtende Schlüssel vor dem riesigen Rechenzentrum; eine dunkle Hand nimmt ihn; das Schloss erscheint in der Fassade |
| 2 | 4.05–4.07 | 130–144 | Startraum: zwei Schlüssel, zwei Personen, gleichzeitig drehen (Zwei-Personen-Regel) |
| 3 | 7.01–7.03 | 317–336 | derselbe Raum (Match); der zweite Schlüssel wandert in eine **fremde** Hand (das andere Labor) |
| 4 | 9.01–9.12 | 475–597 | Tresor und Glasbox werden Schlüssel an einem Ring; der Bund am Haken; Endscreen |

Außerhalb dieser Shots: **kein Schlüssel**, kein Schlüsselloch, kein Schloss-Icon, kein Bart-Reim.

## 3 · Übergänge: jedes Mal ein Objekt
Die Liste der harten Wechsel mit Träger steht in `shots.md` §2, „Weltwechsel“. Die Muster:
- **Flug in eine Fläche:** Schlüsselloch (2.01), Bildschirm im Pult (4.08 → 5.01), rundes Fenster (6.13 → 7.01).
- **Verwandlung am Ort:** Lampenkreis → Bereichsgrenze (4.01), Fenster → Tabellen (7.03), Ring → Balken → Ring (9.06).
- **Das Objekt reist:** die Datei gleitet ins Fach (3.03), Brückenlinie → Bergkamm (8.01), Tresor + Glasbox → Schlüssel (9.01).

Der Träger ist während des ganzen Übergangs **sichtbar und das Hellste**. Die Kamera folgt ihm und überholt ihn nie (Gate 4).

## 4 · Palette (exakt aus dem Stil, `P` in `lib/f10_editorial.mjs`)
Wie Film 13 (`docs/ref-13/MOTION.md` §4):

| Rolle | Farbe |
|---|---|
| Nacht | `night0 #080b27` · `night1` |
| Indigo, Flächen | `ind0/1/2` |
| Blau, Kanten | `blue0 #193f8c` |
| Gold | `core0 #fefde2` · `halo0 #ead295` · `shade0` |
| Du | `coat #f2b632` |
| Schrift | Creme `#fefcde` |

Zusätzlich gilt in Film 14:
- **Gold** = Licht, Schlüssel, das Original, „verstanden“.
- **Kühles Creme-Blau** (`mixHex(P.cream, P.blue0, .4…)`) = die Kopie, das Unverstandene, fremde Hände.
- Fremde Hände sind **dunkle Indigo-Silhouetten** mit dünnem blauem Rand und warmem Rand vom Schlüssel (`darkHand`). Sie sind nie durchsichtig und nie heller als der Schlüssel.

Finish `K.PRINT13 = { grain 14, floor 4, vig .5 }`, Korn mit 10 Hz. Luma-Mittel 40–60 (Ausnahme: Innenwelt hinter dem Schlüsselloch ~25–35, bewusst dunkel).

## 5 · Regeln gegen Hektik (messbar)
- **Weltwechsel:** ≤ ~1 harter pro Minute (Ist: 0,72/min).
- **Eine Hauptbewegung zur Zeit** (die Kamera zählt mit, eine zweite nur als Folge der ersten). Umgebungsleben zählt nicht: Atmen, Staub, Korn, Drift (`camDrift`), Zahlen-Welle.
- **Langsame Kamera:**
  - Fahrten 2,5–5 s;
  - log-z-Fahrten (Flug durch eine Öffnung) erst **auf die Achse schwenken, dann gerade hinein**, sonst läuft z der Seite davon und man fliegt durch die Wand (Stil-Test 34 s);
  - nach einem Flug ins Innere sinkt die Drift auf ~15 %.
- **Kein Stillstand über 2 s** (freezedetect `n=-60dB:d=0.5`: 0 Treffer). **Halten 1,5–3 s** nach jedem Akzent.
- **Ein Motiv pro Satz; nichts aus dem Nichts.** Jedes Element wächst, wird gereicht, steigt von einer Grundlinie oder wird von einer Linie geschrieben.
- **Dichte Texturen** (Zahlenfelder, Tabellen, Rack-Lichter) bewegen sich nur langsam unter der Kamera: Raster grob genug (Zahlenfeld 92×58 px), Alpha fällt mit der Entfernung. Dichte Textur plus schnelle Kamera treibt die Bildunruhe hoch.
- **Messung vor jedem Bericht:**
  - `python3 tools/calm.py <mp4> --scale 1280:720`: 0 Schnitte, Luma, mafd-Median.
  - `python3 tools/smooth.py <mp4> <start>`: keine LURCH/POP.
  - `SECS=cNN node tools/seam.mjs --at …` an jeder Render-Naht.

**Stil-Test-Messung (0–42,4 s, 720p):**
- calm: 0 Schnitte · mafd-Median 0,79 (p90 1,90) · Luma 44,2;
- freezedetect: 0 Stillstände;
- smooth: 1 Flag (7,57 s POP 5,0). Das ist der 10-Hz-Kornwechsel auf demselben Bild, auf dem die Blaupausen-Linien wachsen, kein Sprung im Bild (Differenzbild geprüft).

| Fenster (s) | mafd-Median |
|---|---|
| 0–8 | 0,08 |
| 8–14 (Schwenk zum Zitat) | 1,07 |
| 14–22 (Zitat) | 0,16 |
| 32–37 (Flug durchs Schlüsselloch) | 1,62 |
| 37–42 (Zahlenfeld) | 1,28 |

**Ziel für die Station-Chunks: Median ≤ 0,45**, wie Film 13. Große Fahrten über dichte Texturen sind nur an den Weltwechseln erlaubt.

## 6 · Text im Bild, Karten, Grafiken
- **Typo:** nur Instrument Serif (Zitate, Zahlen, große Wörter) und Inter (Labels, Quellen, Versalien, Sperrung .12–.32em). Zahlenfelder in Inter, tabellarisch, Creme.
- **Zitat- und ON-SCREEN-Karten sind gestaltet** (`shots.md` §3):
  - eine Creme-Linie wächst links;
  - der Text schreibt sich zeilenweise daneben, das Schlüsselwort wird warm;
  - die Quelle steht in Versalien;
  - die Karte liegt auf einer eigenen Ebene im Raum und geht mit der Kamera, nie per Blende.

  Vorlage: Zitatkarte 1.03 in `lib/f14_hook.mjs`.
- **Mengen:** höchstens eine Zahl und ≤ 6 Wörter pro Grafik, plus Quelle. Text steht ≥ 1,5 s ruhig (≥ Zeichen/12 s). Lesbar auf einer Handy-Kopie mit 390 px Breite.
- **Zahlen nur aus** `film-kontrolle/faktencheck.md`.
- **Grafiken bestehen aus Elementen des Films** (Datei, Zahlenfeld, Linie, Fenster, Ring), nicht aus Clip-Art.

## 7 · Kit
- **`lib/f14_kit.mjs`** (Lead; Builder ändern nicht, Wünsche in den Bericht):
  - `lightKey(ctx,x,y,h,t,{rot,turn,lum,a,glow,blue,dust,seed})` → `{path,at,m}`: der Schlüssel aus Licht (nur in KEY-Shots).
  - `keyMatrix`, `KEY_BOW/TIP/TOP`.
  - `keyholePath(cx,cy,s)`: Kreis ∪ Schlitz, für `PathOp`.
  - `dataCentre(ctx,t,{x0,y0,x1,y1,top,roof,wake,warm,hole})`: Fassade mit Rack-Lichtern, das Loch wird per `PathOp.Difference` ausgeschnitten.
  - `darkHand(ctx,m,{pose,curl,warm,side})`: fremde Hand.
  - `blueprint(ctx,rect,u0,u1,{a,nx,ny,w})`: Linienzeichnung, die einen Körper „versteht“.
  - `fileShape(cx,cy,w,h,f)` → `{pts,path,fold,rect}`: die Datei.
  - `numberField(ctx,t,{gather,file,a,size,onlyFile,cool})`: das Zahlenfeld, das sich zur Datei sammelt.
- **`lib/f14_seams.mjs`** (Lead): die drei Nahtplatten `plateScreen`, `plateWindow`, `plateScale` plus `seamWindow`, `SEAM_HALF`, `PLATE_FILE`, `PLATE_WINDOW`, `PLATE_SCALE`. Tresortür und Glasbox auf `plateScale` sind die Referenz für B1s `vaultDoor` und B3s `glassBox`.
- **`lib/f14_hook.mjs`** (Lead): der ganze Hook als eine Plansequenz.
  - `hookAnchors(T)` liefert die Wort-Anker, `hook(a)` die Zeichenfunktion.
  - Die Zeichenfunktion läuft nach 42,4 s ruhig weiter (Kamera auf dem letzten Key plus Drift). B1 baut 2.04 darauf auf.
- **Geteilt aus Film 13:** `lib/f13_kit.mjs` (`card`, `cam3`, `camAt`, `aim`, `cardM`, `camDrift`, `trailSpan`, `PRINT13`), `lib/f10_editorial.mjs` (`P`, `E.ground`, `E.du`, `E.rad/lin`, `finish`), `lib/f10_expl.mjs`, `docs/EDITORIAL-KIT.md`.
- **Engine-Regeln:**
  - Kein `createCanvas`/`createPattern` pro Bild (napi-Leck); Muster und Raster einmal cachen.
  - Kein `Math.random`/`Date.now`, nur die Seed-PRNG.
  - Rendern in Stücken ≤ 20 s mit `node --expose-gc`.
  - Pfade schneiden mit `PathOp` (Difference/Union), nicht mit `evenodd` + `addPath` (schneidet in napi nicht zuverlässig).

## 8 · Endscreen (VO-Ende bis Schluss, ~15 s, 9.12)
Morgendämmerung, weit. Oben Mitte (y 60–300) hängt der **Schlüsselbund am Haken**, du stehst winzig unten Mitte auf einem Kamm.

**Freiflächen:**
- links x 90–780, y 250–700 („best for viewer“);
- rechts x 1140–1830, y 250–700 („latest upload“);
- Mitte x 810–1110, y 330–600 (Abo-Knopf).

**Nie statisch:** der Ring pendelt minimal, Schlüssel funkeln, Sterne verblassen, Staub steigt, ein langsamer Rückzug.

## 9 · Gates (in dieser Reihenfolge)
1. **Plan zuerst:** Shot in `tools/shots14.py` (Anker-Wort, Bild, 1–2 Bewegungen, Übergang mit Träger), dann `shots.md` neu schreiben.
2. **Bauen, dann anschauen:**
   - Standbilder alle ~0,5 s um jede Fahrt und eines pro Satz (`render.mjs --snap … --scale .5`, Kontaktbogen);
   - jede Naht Bild für Bild (`seam.mjs`);
   - mindestens 3 Review-Runden.
3. **Messen** (§5), Werte in den Bericht.
4. **Selbstnote 1–5:** Plakat · Satz = Bild · nahtlos · ruhig · lebendig · Grafik aus Film-Elementen · Text. Nichts unter 4.
5. **Ehrlich:** Abstand zum Stil-Test in % schätzen und die größte Lücke nennen.
