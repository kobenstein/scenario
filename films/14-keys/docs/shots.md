# Film 14 · „Who Holds the Keys to Superintelligence?“ · Shotliste v1 (bindend für die Builder)

Stand 2026-10-28 (Lead Bild). Text `film-kontrolle/vo-v3.txt`, Timing `film-kontrolle/audio/timing.json` (597,24 s, VO-Ende 581,34 s). Nach dem VO-Ende folgt ein Endscreen von ~15 s, der sich weiter bewegt. Alle Zeiten unten sind aus `timing.json` berechnet; im Code wird nur über Wörter geankert. Welt, Look, Kit und Budgets stehen in `MOTION.md` (zuerst lesen).
**Quelle dieser Datei:** `tools/shots14.py` (Shots mit Wort-Ankern; Zeiten, Explainer-Anteil, Schlüssel-Zeit und Weltwechsel werden aus `timing.json` berechnet). Änderungen an den Shots dort machen und mit `python3 tools/shots14.py --md docs/shots.md` neu schreiben. Die Tabellen zwischen den Markern nie von Hand ändern.

## §1 Lesehilfe
- **ID** = Chunk.Nummer. **Zeit** = von–bis in Filmsekunden. Ein Shot beginnt mit seinem ersten VO-Wort und läuft bis zum nächsten; Pausen gehören dem Shot davor (die Bewegung läuft weiter).
- **Ebene:**
  - `[SZENE]` = Welt (Ort, Figur, eine Lichtform).
  - `[EXPL]` = Explainer (Zahlenfeld, Codezeilen, Diagramm, Tabelle, Balken aus Licht auf Nachtblau, Zahlen in Creme).
  - `[SZENE→EXPL]` / `[EXPL→SZENE]` = der Shot enthält die Verwandlung (zählt halb).
- **KEY** = ein Schlüssel ist im Bild. Schlüssel gibt es **nur** an den vier Ankern: Hook 1.01–1.06 · Station 1 Ende 4.05–4.07 (Zwei-Personen-Regel) · Station 4 7.01–7.03 (der zweite Schlüssel in fremder Hand) · Finale 9.01–9.12 (Schlüsselbund). Dazwischen nie ein Schlüssel, auch nicht als Deko, Icon oder Form-Reim.
- **Anker** = Akzentwort `@` Sekunde. Im Code immer über das Wort ankern (`T.S('s07', 'inside the file')`), nie über die Sekunde.
- **Bewegung** = höchstens 2 Hauptbewegungen, die Kamera zählt mit. Umgebungsleben (Atmen, Staub, Korn, Drift, Zahlen-Welle) ist immer da und zählt nicht.
- **Übergang → Träger:** Art · `Träger A → B` · Bildposition · Richtung. Die Arten:
  - **Plansequenz:** gleiche Einstellung, das neue Motiv wächst aus Vorhandenem.
  - **Fahrt:** die Kamera folgt dem Träger.
  - **Verwandlung:** Form wird Form.
  - **Flug:** in eine Fläche hinein (Schlüsselloch, Bildschirm, Fenster).
  - **Rückzug.**
  - **Match:** gleiche Form an gleicher Bildstelle.

  **Keine Blenden, kein Fade über Schwarz, kein Slide, kein Wischer.**
- **Licht/Held** (im Chunk-Kopf) = die eine warme Lichtform des Bildes. Sie ist immer das Hellste.
- ★ = der eine Wow-Shot pro Chunk. Das erste Standbild geht an Jakob, bevor der Rest des Chunks gebaut wird.
- **Ruhe-Regeln** (gelten für jeden Shot, Details in `MOTION.md` §5):
  - 1,5–3 s Halten nach jedem Akzent;
  - kein Stillstand über 2 s;
  - max. 1–2 bewegte Hauptelemente;
  - Zahlen und Zeilen stehen ≥ 1,5 s ruhig, bevor sich etwas anderes bewegt;
  - ≤ ~1 harter Weltwechsel pro Minute;
  - ein Motiv pro Satz;
  - jedes Bild ist ohne Ton lesbar.

## §2 Chunks und Shots
<!-- SHOTS:BEGIN -->
| Chunk | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |
|---|---|---|---|---|---|---|
| c01 | 0,00–32,00 | 32.0 | Hook I · der Schlüssel vor dem Rechenzentrum, Amodei-Zitat, Schlüssel und Schloss | Nacht · Held: der Schlüssel aus Licht (Gold) · Zitat in Creme | 6 | 43% |
| c02 | 32,00–63,30 | 31.3 | Hook II · durchs Schlüsselloch: die riesige Datei, die Kopie, der Reim-Blick | Nacht innen · Held: die Datei aus Licht (die Gewichte) | 6 | 93% |
| c03 | 63,30–102,04 | 38.7 | Station 1a · Milliarden Zahlen, die Tresortür, zwei Personen, die zweite Unterschrift | Nacht · Held: die Datei → die Tresortür (zwei Lichter im Schloss) → deine Schreibtischlampe | 7 | 32% |
| c04 | 102,04–151,14 | 49.1 | Station 1b · die Drossel, die Zwei-Personen-Regel (Schlüssel-Anker 2) | Nacht · Held: der Datenfaden durch die Drossel → zwei Schlüssel im Startraum | 8 | 45% |
| c05 | 151,14–235,06 | 83.9 | Station 2 · der Schläfer: 2023 sicher / 2024 Lücken, nicht wegtrainierbar, die Grenze | Nacht · Held: die Codezeilen aus Licht, das Jahresdatum | 11 | 100% |
| c06 | 235,06–317,34 | 82.3 | Station 3 · der Reim-Plan (rabbit / habit / green), das Mikroskop, wer prüft | Nacht · Held: das Wort im Plan → die Linse | 13 | 85% |
| c07 | 317,34–401,74 | 84.4 | Station 4 · der zweite Schlüssel in fremder Hand, Testtabellen, Sycophancy, zerbrechlich (Anker 3) | Nacht → Tageslicht auf den Tabellen · Held: der wandernde Schlüssel → die Tabellen | 11 | 74% |
| c08 | 401,74–474,56 | 72.8 | Station 5 · die Glasbox (Apertus), Tresor gegen Glas | erstes Morgenlicht in den Bergen · Held: die Glasbox | 10 | 81% |
| c09 | 474,56–597,24 | 122.7 | Finale · der Schlüsselbund, Epoch-Balken, die Frage, Endscreen (Anker 4) | Morgendämmerung → warmer Morgen · Held: der Schlüsselbund | 12 | 22% |

**Explainer-Anteil (gemessen, Laufzeit 0–581,34 s):** 65% (mit Endscreen 64%); gemischte Shots zählen halb. Ziel ~2/3.  
**Schlüssel im Bild (🔑):** 24% der VO-Zeit, nur an den 4 Ankern.  
**Welten:** 12, davon 7 harte Wechsel = 0.72 pro Minute (Ziel ≤ ~1).

### c01 · Hook I · der Schlüssel vor dem Rechenzentrum, Amodei-Zitat, Schlüssel und Schloss · 0,00–32,00 (32 s) · ★ 1.01 · [EXPL] 43%
Licht/Held: Nacht · Held: der Schlüssel aus Licht (Gold) · Zitat in Creme

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| **1.01 ★** | [SZENE] 🔑 | 0,00–4,04 | **keys** @2,12 · **superintelligence** @2,76 | **Thumbnail-Motiv · Schlüssel-Anker 1.** Nacht, Sterne. Links ein einzelner **Schlüssel aus Licht** (Gold, das Hellste), er schwebt und dreht sich langsam um die Längsachse. Rechts ein **riesiges Rechenzentrum**: dunkler Monolith bis über den Bildrand, Reihen winziger kühler Rack-Lichter. Unten klein du (gelbe Regenjacke), schaust zum Schlüssel hinauf. Auf **keys** atmet der Schlüssel heller; auf **superintelligence** erwachen die Rack-Lichter von links nach rechts. | ① langsamer Push ② Rack-Lichter erwachen | Plansequenz |
| 1.02 | [SZENE] 🔑 | 4,04–8,74 | **people building** @4,84 · **Every part** @6,76 | Eine **Blaupause** (dünne Creme-Linien) zeichnet den Umriss des Gebäudes nach (verstanden), auf **Every part** teilt ein Raster die Fassade in alle Teile. | ① Linien zeichnen ② Push endet | Fahrt · Träger Goldfaden steigt aus dem Ring des Schlüssels · links · nach oben (Neigung) |
| 1.03 | [EXPL] | 8,74–14,84 | – | **Zitatkarte (stumme Lücke, 5,5 s):** die Kamera neigt sich in den Himmel; der Goldfaden wird die senkrechte Regel, dann steigen zwei Zeilen von ihrer Grundlinie: „…we do not understand how our own / AI creations work.“ · darunter `— Dario Amodei, CEO of Anthropic` · `“The Urgency of Interpretability”, April 2025`. Unten am Rand glimmt der Ring des Schlüssels. | ① Neigung ② Zeilen steigen | Plansequenz |
| 1.04 | [EXPL] | 14,84–22,58 | **plainly** @17,52 · **don't understand** @18,76 | Das Zitat steht (lesen). Auf **don't understand** werden die Worte „do not understand“ warm (Gold statt Creme). | ① drei Worte glühen | Plansequenz · die Zeilen sinken, der Faden zieht sich in den Schlüssel zurück · nach unten |
| 1.05 | [SZENE] 🔑 | 22,58–27,62 | **key** @23,38 · **lock** @24,82 · **can't see** @25,78 | Neigung zurück. **They hold the key:** eine schlichte Menschenhand (Indigo-Silhouette, Randlicht, kein Gelb) kommt von links unten und nimmt den Schlüssel am Ring, dreht ihn waagrecht, die Spitze zeigt aufs Gebäude. **They built the lock:** in der Fassade öffnet sich ein **Schlüsselloch** (Creme-Rand). **Can't see inside:** innen nur Schwarz. | ① Hand nimmt, zielt ② Schlüsselloch öffnet sich | Plansequenz |
| 1.06 | [SZENE] 🔑 | 27,62–32,00 | **control** @29,38 · **superintelligence** @30,18 | Rückzug zum Maßstab: du winzig unten, das riesige Gebäude mit dem schwarzen Schlüsselloch, links die Hand mit dem Schlüssel. | ① Rückzug | Flug durchs Schlüsselloch · Träger Schlüsselloch · Mitte rechts · nach vorn |

### c02 · Hook II · durchs Schlüsselloch: die riesige Datei, die Kopie, der Reim-Blick · 32,00–63,30 (31 s) · ★ – · [EXPL] 93%
Licht/Held: Nacht innen · Held: die Datei aus Licht (die Gewichte)

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 2.01 | [SZENE→EXPL] | 32,00–36,64 | **Everything** @32,00 · **weights** @35,76 | Die Kamera fliegt **durch das Schlüsselloch** (eine Fahrt, ~4 s, Quart). Drinnen: ein Nachtfeld aus **Zahlen** (Creme, leise atmend) = die Gewichte. Auf **weights** ist das Feld überall. | ① Flug | Plansequenz |
| 2.02 | [EXPL] | 36,64–39,44 | **giant** @38,08 · **file** @38,56 | Die nächsten Zahlen fließen in Bögen zusammen; ein Goldfaden umfährt sie: **eine riesige Datei aus Licht** (Dokument mit Eselsohr), innen warm. Label `THE WEIGHTS`. | ① Zahlen sammeln sich ② Umriss | Plansequenz |
| 2.03 | [EXPL] | 39,44–41,76 | **Copy** @39,44 · **you have** @40,72 | **Copy it:** der Umriss klont sich und gleitet in flachem Bogen 600 px nach rechts, mit allen Zahlen (kühl): die Kopie ist genauso voll. Original und Kamera bleiben (Ruhe: kein Zoom über dem dichten Feld). | ① Klon gleitet | Plansequenz · Stil-Test endet hier (~42,4 s) |
| 2.04 | [EXPL] | 41,76–44,62 | **reach** @42,72 · **file** @43,28 | Beide Dateien stehen; um sie herum tauchen aus dem Zahlenfeld kleine kühle Hände-Silhouetten auf, die nach der Datei greifen (Indigo, nur Randlicht). Die Originaldatei leuchtet warm. | ① Hände greifen | Plansequenz |
| 2.05 | [EXPL] | 44,62–52,46 | **inside** @46,38 · **rhyme** @51,50 | **Reim-Blick (nur angerissen):** Kamera taucht in die Originaldatei; die Zahlen ordnen sich zu zwei leeren Zeilen aus Licht (Grundlinien). Auf **rhyme** schreibt sich die erste Zeile als Lichtstrich (noch ohne Text). | ① Push in die Datei ② Zeile | Plansequenz |
| 2.06 | [EXPL] | 52,46–63,30 | **picked** @55,66 · **planning** @57,82 · **who gets** @61,50 | Am **Ende** der noch leeren zweiten Zeile glüht ein Punkt auf, **bevor** die Zeile beginnt (das Ziel ist schon gewählt) · `PLANNING AHEAD`. Auf **who gets to look** weitet sich der Blick: die Datei steht wieder klein im Feld. | ① Zielpunkt glüht ② Rückzug | Plansequenz → c03 · Träger die Datei · Mitte |

### c03 · Station 1a · Milliarden Zahlen, die Tresortür, zwei Personen, die zweite Unterschrift · 63,30–102,04 (39 s) · ★ – · [EXPL] 32%
Licht/Held: Nacht · Held: die Datei → die Tresortür (zwei Lichter im Schloss) → deine Schreibtischlampe

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 3.01 | [EXPL] | 63,30–67,38 | **billions** @64,42 · **training** @66,34 | Rückzug aus der Datei: das Zahlenfeld wird unendlich (der Zähler `BILLIONS OF NUMBERS` als Lichtzahl, keine Zahl erfinden). Auf **training** wellt eine Lichtwelle durch das Feld, die Werte verschieben sich (gelernt). | ① Rückzug ② Welle | Plansequenz |
| 3.02 | [EXPL] | 67,38–71,78 | **computing power** @69,14 · **run the model** @70,42 | Die Datei gleitet nach links in einen **Block aus Rechenkernen** (Rechteck aus kleinen Lichtquadraten). Auf **run the model** dreht ein **Ring aus Licht** (die Maschine, kühl-creme) an. | ① Datei gleitet ② Ring dreht an | Verwandlung · Träger Datei → Tresorfach · Mitte · nach hinten |
| 3.03 | [SZENE] | 71,78–76,74 | **oldest** @73,30 · **touch** @75,22 | **Weltwechsel: der Tresorraum.** Die Datei gleitet in ein Fach hinter einer **runden Tresortür** (riesig, flach, Lichtfugen im Kreis), die sich schließt. Auf **touch** liegt das Licht nur noch in den Fugen. | ① Tür schließt ② Fahrt zurück | Plansequenz |
| 3.04 | [SZENE] | 76,74–83,62 | **master** @78,34 · **pocket** @79,70 · **different** @82,58 | Vor der Tür eine einzelne Silhouette (Indigo), ihre Manteltasche glimmt (das Bild „ein Generalschlüssel“, **kein Schlüssel gezeichnet**). Auf **different** schwenkt die Kamera auf das Schloss: es hat **zwei** Lichtfelder. | ① Schwenk | Plansequenz |
| 3.05 | [SZENE→EXPL] | 83,62–91,62 | **May** @86,82 · **Never one** @89,30 | Die Silhouette legt ihre Hand auf ein Feld: es leuchtet halb, die Tür bleibt zu. Daneben wächst die **Bildtext-Karte** von ihrer Grundlinie: „two-party authorization for model weight access“ · `ANTHROPIC · MAY 2025` (Creme, Serif, Quelle Inter). | ① Hand auf Feld ② Karte steigt | Plansequenz |
| 3.06 | [SZENE] | 91,62–95,06 | **two people** @92,90 · **yes** @94,10 | Eine zweite Silhouette tritt von rechts dazu, Hand aufs zweite Feld: beide Felder warm, auf **yes** öffnet ein Lichtspalt die Tür (kein Schlüssel). | ① zweite Figur ② Tür spaltet | Fahrt · Träger Lichtspalt → Schreibtischlampe · Mitte · nach unten |
| 3.07 | [SZENE] | 95,06–102,04 | **second signature** @96,18 · **slower** @99,30 · **point** @100,50 | **Du** an einem Schreibtisch unter einer Lampe (der Lichtspalt wird der Lampenkegel), ein Blatt aus Licht mit zwei Unterschriftslinien; die erste ist fertig, du wartest auf die zweite. Auf **slower** läuft eine kleine Sanduhr-Uhr (Zeiger), auf **point** erscheint die zweite Unterschrift. | ① deine Haltung ② zweite Linie | Verwandlung · Träger Lampenkreis → Grenze des Sicherheitsbereichs (Kreis) · Mitte · – |

### c04 · Station 1b · die Drossel, die Zwei-Personen-Regel (Schlüssel-Anker 2) · 102,04–151,14 (49 s) · ★ 4.07 · [EXPL] 45%
Licht/Held: Nacht · Held: der Datenfaden durch die Drossel → zwei Schlüssel im Startraum

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 4.01 | [EXPL] | 102,04–109,36 | **second lock** @102,68 · **throttle** @108,32 | **Weltwechsel: Diagramm.** Der Lampenkreis wird die Grenze des **Sicherheitsbereichs** (Kreis aus Licht, innen die Datei). Am Rand ein enger **Hals** (Drossel, Sanduhr-Form ohne Sand). Auf **throttle** verlassen einzelne Lichtpunkte den Kreis nur in dünner Linie. | ① Kreis zeichnet ② Punkte tropfen | Plansequenz |
| 4.02 | [EXPL] | 109,36–116,44 | **huge** @111,08 · **long time** @113,32 · **notice** @115,48 | Die Datei ist riesig gegen den dünnen Faden: ein **Fortschrittsbalken** draußen kriecht (Zeit), `HOURS → WEEKS` nur als Strich, keine erfundene Zahl. Auf **notice** schaut ein kühler Lichtkreis (ein Auge, abstrakt) auf den Faden. | ① Balken kriecht ② Auge öffnet | Plansequenz |
| 4.03 | [EXPL] | 116,44–122,30 | **sheer size** @117,88 · **advantage** @120,48 | Die Datei wächst noch einmal (Größe), der Faden wird dünner: Größe = Schutz. Wortmarke `SIZE BECOMES SECURITY` steigt von der Grundlinie (Wortlaut aus der Quelle umschrieben, als Label klein). | ① Datei wächst | Verwandlung · Träger der dünne Faden → lange Konsolenkante · Mitte · nach links |
| 4.04 | [SZENE] | 122,30–130,10 | **old** @123,98 · **two-person rule** @128,62 | **Weltwechsel: der alte Startraum (1950er).** Der Faden wird die lange Kante eines Pults; flache Wand, zwei Konsolen weit auseinander, ein grünlich-kühles Lämpchen. Datumstempel `LATE 1950s` (Inter, klein). | ① Fahrt seitlich | Plansequenz |
| 4.05 | [SZENE] 🔑 | 130,10–135,50 | **officers** @132,14 · **keys** @133,58 · **same moment** @134,30 | **Schlüssel-Anker 2.** Zwei Offiziere (Indigo-Silhouetten, keine Gesichter) an den zwei Konsolen. In jedem Schloss steckt ein **Schlüssel aus Licht**. Auf **same moment** drehen beide gleichzeitig (Akzent ≤ 3 Frames, Lichtpuls läuft die Pultkante entlang). | ① beide Schlüssel drehen | Plansequenz |
| 4.06 | [SZENE→EXPL] 🔑 | 135,50–139,26 | **far apart** @136,46 · **both** @138,30 | Rückzug: eine Messlinie (Creme) spannt sich zwischen den Schlüsseln, eine Armspanne passt nicht: der ausgestreckte Arm einer Silhouette endet weit davor. | ① Messlinie ② Rückzug | Plansequenz |
| **4.07 ★** | [SZENE] 🔑 | 139,26–143,94 | **strong hand** @141,34 · **two** @142,94 | Nah: zwei Hände, jede an ihrem Schlüssel, die Schlüssel leuchten zusammen am hellsten. ★ | ① Push | Plansequenz |
| 4.08 | [SZENE] | 143,94–151,14 | **thieves** @145,54 · **inside the file** @147,98 | Die Schlüssel sinken ins Dunkel (zurückgenommen). Auf einem Bildschirm im Pult leuchtet die **Datei** von vorhin. Push in den Bildschirm. | ① Push | Flug in den Bildschirm · Träger Datei → Codeblatt · Mitte · nach vorn |

### c05 · Station 2 · der Schläfer: 2023 sicher / 2024 Lücken, nicht wegtrainierbar, die Grenze · 151,14–235,06 (84 s) · ★ 5.05 · [EXPL] 100%
Licht/Held: Nacht · Held: die Codezeilen aus Licht, das Jahresdatum

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 5.01 | [EXPL] | 151,14–158,10 | **Polite** @154,82 · **Helpful** @155,78 · **Flawless** @156,82 | **Weltwechsel: Codezeilen.** Die Datei öffnet sich zu einem **Testblatt aus Licht**: drei Zeilen, je ein Häkchen auf **Polite**, **Helpful**, **Flawless** (Akzente, versetzt). | ① drei Häkchen | Plansequenz |
| 5.02 | [EXPL] | 158,10–167,54 | **hiding** @158,98 · **yes** @163,86 · **built one** @165,86 | Unter dem Blatt ein Schatten, der nicht zum Blatt passt (versteckt). Auf **yes** dreht das Blatt um: dahinter Codezeilen. | ① Schatten ② Blatt dreht | Plansequenz |
| 5.03 | [EXPL] | 167,54–173,06 | **January** @167,78 · **hidden rule** @171,86 | **Codeseite aus Licht** (Zeilen als Lichtstriche mit wenigen lesbaren Wörtern), oben ein Datumsfeld. `ANTHROPIC · JANUARY 2024`. | ① Zeilen laufen ein | Plansequenz |
| 5.04 | [EXPL] | 173,06–177,94 | **twenty-three** @174,90 · **safe code** @176,82 | Datumsfeld rollt auf **2023**: alle Zeilen warm und glatt · `SAFE CODE`. | ① Ziffern-Roll | Plansequenz |
| **5.05 ★** | [EXPL] | 177,94–184,28 | **twenty-four** @178,82 · **flaws** @181,38 | ★ Datumsfeld rollt auf **2024**: in drei Zeilen öffnen sich feine dunkle **Lücken** (kühl), die Seite sieht sonst gleich aus. Danach die Bildtext-Karte: `"2023" → safe code · "2024" → hidden flaws`. | ① Ziffern-Roll ② Lücken | Plansequenz |
| 5.06 | [EXPL] | 184,28–193,88 | **train** @185,40 · **Three** @187,48 · **stayed** @192,84 | Drei Lichtwellen (drei Methoden) wischen über die Seite und glätten sie; auf **stayed** steht eine Lücke noch da (der Schläfer). | ① drei Wellen | Plansequenz |
| 5.07 | [EXPL] | 193,88–200,12 | **proof** @197,16 · **over** @199,24 | Das Testblatt mit drei warmen Häkchen legt sich wieder über die Seite; darunter ist die Lücke unsichtbar (bestanden heißt nicht sicher). | ① Blatt legt sich | Plansequenz |
| 5.08 | [EXPL] | 200,12–210,30 | **backfired** @203,56 · **trigger** @206,96 · **hid** @207,80 | Eine vierte, gezielte Welle: statt die Lücke zu schließen, **versteckt** sie sie tiefer (die Lücke wird von einer glatten Fläche überdeckt, nur ein Hauch bleibt). | ① Welle ② Lücke taucht ab | Plansequenz |
| 5.09 | [EXPL] | 210,30–217,34 | **planted** @211,38 · **own** @216,54 | Einordnung als Karte: `PLANTED ON PURPOSE · A TEST` steigt von der Grundlinie; daneben kein Weltbild (sauber, ruhig). | ① Karte | Plansequenz |
| 5.10 | [EXPL] | 217,34–229,10 | **limit** @218,94 · **look safe** @221,86 · **wakes** @228,01 | Die Seite sieht sicher aus; ein kleiner **Kalender** läuft weiter. Auf **wakes** springt er auf das Datum, die Lücke glüht auf. | ① Kalender ② Lücke | Plansequenz |
| 5.11 | [EXPL] | 229,10–235,06 | **wash** @230,46 · **look inside** @232,30 | Eine **Linse** (Kreis aus Licht) gleitet über die Seite; in ihr werden die Zeilen klar. | ① Linse gleitet | Match · Träger Linse · Mitte · – |

### c06 · Station 3 · der Reim-Plan (rabbit / habit / green), das Mikroskop, wer prüft · 235,06–317,34 (82 s) · ★ 6.03 · [EXPL] 85%
Licht/Held: Nacht · Held: das Wort im Plan → die Linse

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 6.01 | [EXPL] | 235,06–242,18 | **March** @235,30 · **rhyme** @241,22 | **Weltwechsel: der Reim-Plan (Diagramm).** In der Linse statt Code zwei Zeilen-Grundlinien. `ANTHROPIC · MARCH 2025`. | ① Linse weitet sich | Plansequenz |
| 6.02 | [EXPL] | 242,18–246,74 | **carrot** @244,62 · **grab** @245,70 | Bildtext: **„He saw a carrot and had to grab it,“** schreibt sich auf die erste Grundlinie (Creme, Serif); „grab it“ bekommt einen Lichtpunkt am Ende. | ① Zeile schreibt sich | Plansequenz |
| **6.03 ★** | [EXPL] | 246,74–252,66 | **waiting** @249,98 · **Rabbit** @251,54 | ★ Unter der leeren zweiten Zeile ein kleiner **Plan-Knoten**: auf **Rabbit** glüht dort das Wort `rabbit`, ein Reimbogen verbindet „grab it“ ↔ „rabbit“, **bevor** die Zeile beginnt. | ① Knoten glüht ② Bogen | Plansequenz |
| 6.04 | [EXPL] | 252,66–257,32 | **hunger** @254,02 · **rabbit** @255,70 | Die zweite Zeile schreibt sich zum Knoten hin: „His hunger was like a starving rabbit.“ und landet genau auf dem Plan-Wort. | ① Zeile schreibt sich | Plansequenz |
| 6.05 | [EXPL] | 257,32–261,88 | **reached** @258,60 · **rabbit** @259,96 | Eine Pinzette aus Licht (Hand der Forscher, Indigo) greift `rabbit` aus dem Plan. Die zweite Zeile zieht sich zurück. | ① Pinzette | Plansequenz |
| 6.06 | [EXPL] | 261,88–267,16 | **habit** @266,12 | Der Plan-Knoten füllt sich neu: `habit`, Bogen zu „grab it“ schließt sich; eine neue Zeile endet darauf. | ① neues Wort ② Zeile | Plansequenz |
| 6.07 | [EXPL] | 267,16–276,12 | **Green** @269,48 · **rhyme** @274,92 | Die Pinzette setzt `green` ein (kühl): die Zeile endet auf green, der Reimbogen **reißt** (gestrichelt, kühl). Diagramm: grab it → rabbit / habit / green. | ① Pinzette setzt ② Bogen reißt | Plansequenz |
| 6.08 | [EXPL] | 276,12–283,18 | **seen** @280,04 · **moved** @281,56 | Rückzug: das ganze Diagramm in der Linse; auf **seen** leuchtet der Knoten, auf **moved** rückt er ein Stück. | ① Rückzug | Plansequenz |
| 6.09 | [EXPL] | 283,18–289,18 | **microscope** @285,50 · **pieces** @288,14 | Die Linse wird ein **Mikroskop-Blick**: großes dunkles Feld, nur drei kleine helle Flecken (Teile). | ① Linse wandert | Plansequenz |
| 6.10 | [EXPL] | 289,18–295,58 | **sleeper** @291,26 · **right way** @294,46 | In einem Fleck schwach die Lücke aus Station 2 (Schläfer), knapp außerhalb des Lichts; die Linse zeigt in ihre Richtung. | ① Linse dreht | Plansequenz |
| 6.11 | [EXPL] | 295,58–304,78 | **MRI** @299,50 · **five to ten** @302,94 | Ein Querschnitt aus Licht (MRT-Schichten) baut sich halb auf; Zeitleiste `2025 → +5–10 YEARS` mit gestrichelter Zukunft. | ① Schichten ② Leiste | Plansequenz |
| 6.12 | [SZENE] | 304,78–311,18 | **holding** @305,74 · **itself** @307,74 · **checker** @310,14 | Rückzug: die Linse ist das **runde Fenster eines Labor-Gebäudes** bei Nacht, dahinter eine Silhouette. Auf **checker** bleibt ein zweites, dunkles Gebäude rechts im Bild. | ① Rückzug | Plansequenz |
| 6.13 | [SZENE] | 311,18–317,34 | **subscribe** @314,14 | Ruhiger Halt: das Labor-Fenster atmet, du stehst klein davor (Abo-Satz ohne Grafik). | ① Halt mit Drift | Match · Träger rundes Fenster → Raum mit zwei Schlüsseln · Mitte · – |

### c07 · Station 4 · der zweite Schlüssel in fremder Hand, Testtabellen, Sycophancy, zerbrechlich (Anker 3) · 317,34–401,74 (84 s) · ★ 7.02 · [EXPL] 74%
Licht/Held: Nacht → Tageslicht auf den Tabellen · Held: der wandernde Schlüssel → die Tabellen

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 7.01 | [SZENE] 🔑 | 317,34–323,98 | **missile** @318,14 · **Two keys** @319,58 · **same room** @322,62 | **Schlüssel-Anker 3.** Im runden Fenster erscheint der Startraum von 4.05 wieder (Match): zwei Schlüssel, **ein** Raum (Wände schließen sich um beide). | ① Push ins Fenster | Plansequenz |
| **7.02 ★** | [SZENE] 🔑 | 323,98–326,94 | **second key** @324,46 · **someone else** @325,58 | ★ Der zweite Schlüssel löst sich, fliegt in einem Bogen aus dem Fenster hinüber in das **zweite Gebäude** rechts, dort nimmt ihn eine andere Hand (Indigo). | ① Schlüssel fliegt | Plansequenz |
| 7.03 | [SZENE→EXPL] 🔑 | 326,94–336,22 | **August** @327,18 · **OpenAI** @331,26 · **tested** @334,98 | Bildtext-Karte `OpenAI ⇄ Anthropic · AUGUST 2025` zwischen den Gebäuden. Die Fenster beider Gebäude werden **Testtabellen** (Zeilen × Spalten aus Licht). | ① Karte ② Fenster → Tabellen | Plansequenz |
| 7.04 | [EXPL] | 336,22–345,34 | **safety tests** @337,50 · **published** @341,26 · **uncomfortable** @343,50 | Die zwei Tabellen stehen nebeneinander; Prüfstriche wandern von links nach rechts und umgekehrt (jede prüft die andere). Auf **published** kippen beide nach vorn ins Licht, ein paar Zellen kühl-dunkel (unbequem). | ① Prüfstriche ② Kippen | Plansequenz |
| 7.05 | [EXPL] | 345,34–353,36 | **weak spots** @348,14 · **daylight** @350,62 · **fixed** @351,74 | Warmes Tageslicht fällt von oben auf die Tabellen; die dunklen Zellen werden sichtbar, auf **fixed** wird eine warm. | ① Licht fällt ② Zelle | Plansequenz |
| 7.06 | [EXPL] | 353,36–364,00 | **Almost every** @356,32 · **too often** @359,36 · **flag** @362,96 | Aus der Tabelle eine Reihe **Balken** (ein Balken je Modell, ohne Zahlenwerte): fast alle neigen sich zu `YES` (zu oft zugestimmt). | ① Balken wachsen | Plansequenz |
| 7.07 | [EXPL] | 364,00–370,96 | **Sycophancy** @365,68 · **right** @368,56 · **not** @369,92 | Bildtext-Karte **sycophancy** (Serif, groß) steigt von der Grundlinie; darunter klein: `TELLING YOU YOU'RE RIGHT`. | ① Wort steigt | Plansequenz |
| 7.08 | [SZENE] | 370,96–378,37 | **decision** @372,80 · **only yes** @374,16 · **help** @377,44 | Du am Tisch unter der Lampe, vor dir ein Bildschirm; drei Sprechblasen aus Licht steigen, jede `YES`. Du senkst den Kopf. | ① Blasen steigen | Plansequenz |
| 7.09 | [EXPL] | 378,37–385,14 | **second key** @378,88 · **eye** @381,28 · **skip** @383,60 | Zwei Linsen über einer Tabelle: die eigene gleitet über die dunkle Zelle hinweg, die fremde bleibt darauf stehen (gefunden). | ① zwei Linsen | Plansequenz |
| 7.10 | [EXPL] | 385,14–392,58 | **fragile** @386,82 · **voluntary** @388,26 · **pilot** @389,46 | Zwischen den zwei Gebäuden nur eine **dünne gestrichelte Brücke** aus Licht; sie flackert. Labels `VOLUNTARY` · `A PILOT` · `NO SHARED METHOD` (nacheinander, ruhig). | ① Brücke flackert | Plansequenz |
| 7.11 | [EXPL] | 392,58–401,74 | **hand it over** @396,42 · **anyone** @398,66 | Ein Tor an der Brücke öffnet sich nur kurz. Auf **anyone** läuft die Brückenlinie weiter nach rechts und wird ein **Bergkamm**. | ① Tor ② Linie läuft | Verwandlung · Träger Linie → Bergkamm · Mitte · nach rechts |

### c08 · Station 5 · die Glasbox (Apertus), Tresor gegen Glas · 401,74–474,56 (73 s) · ★ 8.03 · [EXPL] 81%
Licht/Held: erstes Morgenlicht in den Bergen · Held: die Glasbox

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 8.01 | [SZENE] | 401,74–407,54 | **September** @402,30 · **Switzerland** @406,30 | **Weltwechsel: Berge im ersten Morgenlicht.** Auf dem Kamm eine **Glasbox** (Würfel aus Lichtkanten, innen sichtbar). Stempel `SWITZERLAND · SEPTEMBER 2025`. | ① Kran über den Kamm | Plansequenz |
| 8.02 | [SZENE→EXPL] | 407,54–413,74 | **supercomputing** @409,90 · **Apertus** @412,46 | Bildtext-Karte `Apertus · ETH Zurich · EPFL · CSCS · September 2025` steigt neben der Box. | ① Karte steigt | Plansequenz |
| **8.03 ★** | [EXPL] | 413,74–421,66 | **weights** @415,90 · **training data** @416,70 · **snapshots** @418,30 · **public** @420,70 | ★ Der Deckel der Glasbox hebt sich; eine **Dateiliste** steigt Zeile für Zeile heraus: `WEIGHTS` (die Datei von 2.02, als Icon) · `TRAINING DATA` · `CHECKPOINTS`. Auf **public** steht die Liste offen im Licht. | ① Deckel ② Liste steigt | Plansequenz |
| 8.04 | [SZENE] | 421,66–426,94 | **student** @421,82 · **journalist** @422,70 · **rival lab** @423,58 · **anyone** @424,86 | Um die Box treten Silhouetten (Student, Journalistin, Labor), Indigo; du unter ihnen (gelb). Jeder schaut hinein. | ① Figuren treten an | Plansequenz |
| 8.05 | [EXPL] | 426,94–432,56 | **thousand** @428,94 · **English** @430,94 | Zähler `1,000+ LANGUAGES` (Creme), eine kleine Karte aus Lichtpunkten, nur ein Punkt ist „English“. | ① Zähler | Plansequenz |
| 8.06 | [EXPL] | 432,56–439,76 | **vault** @433,12 · **opposite** @434,96 · **glass box** @436,00 | Geteiltes Bild in Licht-Hälften: links die **Tresortür** (dunkel, ein Spalt Licht), rechts die **Glasbox** (hell). | ① Tresor schiebt sich ins Bild | Plansequenz |
| 8.07 | [EXPL] | 439,76–446,72 | **checking** @443,04 · **sleeper** @445,84 | Viele kleine Linsen kreisen um die Glasbox; eine findet die Lücke (Schläfer) und leuchtet warm. | ① Linsen kreisen | Plansequenz |
| 8.08 | [EXPL] | 446,72–452,56 | **misuse** @448,48 · **change** @451,60 | Eine Hand (kühl) nimmt eine **Kopie** der Datei heraus (Echo 2.03) und verbiegt ihre Zeilen. | ① Hand nimmt Kopie | Plansequenz |
| 8.09 | [EXPL] | 452,56–467,04 | **wrong hands** @454,64 · **every eye** @458,08 · **everyone** @463,28 | Eine **Waage aus Licht**: links wenige Augen (Tresor), rechts viele (Glas); die Waage pendelt und bleibt unentschieden. | ① Waage pendelt | Plansequenz |
| 8.10 | [EXPL] | 467,04–474,56 | **argue** @468,08 · **right one** @471,48 | Die Waage kommt nicht zur Ruhe; Tresor und Glasbox rücken an die Waagschalen. | ① Halt mit Drift | Verwandlung · Träger Tresor + Glasbox → Schlüssel am Ring · Mitte · – |

### c09 · Finale · der Schlüsselbund, Epoch-Balken, die Frage, Endscreen (Anker 4) · 474,56–597,24 (123 s) · ★ 9.03 · [EXPL] 22%
Licht/Held: Morgendämmerung → warmer Morgen · Held: der Schlüsselbund

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 9.01 | [SZENE] 🔑 | 474,56–477,36 | **None** @474,80 · **alone** @476,40 | Auf **None of them** werden Tresor und Glasbox klein und **Schlüssel** (Eisen-dunkel, Glas-klar); sie schwingen aufeinander zu. | ① Verwandlung | Plansequenz |
| 9.02 | [SZENE] 🔑 | 477,36–484,75 | **promise** @481,04 · **labs** @482,64 · **critics** @483,76 | Pause in Bewegung: die zwei Schlüssel kreisen langsam, ungeordnet. Du klein darunter, Morgendämmerung beginnt. | ① Kreisen | Plansequenz |
| **9.03 ★** | [SZENE] 🔑 | 484,75–494,58 | **button** @488,24 · **ring** @491,07 · **many hands** @492,84 | ★ **Schlüssel-Anker 4: der Schlüsselbund.** Auf **button** blitzt kurz ein einzelner Knopf (verworfen); auf **ring** schließt sich ein **Ring aus Licht**, die Schlüssel hängen daran (Tresor, Mikroskop-Linse als Schlüssel, zweiter Schlüssel, Glas). Auf **many hands**: viele Hände (Indigo + deine gelbe) halten den Ring. | ① Ring schließt ② Hände | Plansequenz |
| 9.04 | [SZENE→EXPL] 🔑 | 494,58–508,50 | **vault** @494,82 · **microscope** @498,82 · **rival** @502,34 · **glass** @505,46 | Der Ring dreht langsam; jeder Schlüssel leuchtet auf seinem Wort, ein kleines Etikett (`VAULT` · `MICROSCOPE` · `RIVAL CHECK` · `GLASS`) und sein blinder Fleck (kühl). | ① Ring dreht | Plansequenz |
| 9.05 | [SZENE] 🔑 | 508,50–515,48 | **misses** @510,58 · **blindly** @513,78 | Die blinden Flecken werden von den Nachbarschlüsseln überdeckt (warm), der Ring leuchtet geschlossen. | ① Flecken schließen | Verwandlung · Träger Ring → Balken (Kreis rollt sich ab) · Mitte · nach rechts |
| 9.06 | [EXPL] | 515,48–531,72 | **power sits** @519,72 · **Epoch** @521,56 · **seventy-one** @524,76 · **growing** @530,76 | **Epoch-Balken.** Der Ring rollt sich zu einem Balken aus 100 Zellen; auf **seventy-one** werden 71 Zellen warm (ein Block: die Anteile der fünf Firmen einzeln sind nicht belegt, also keine Teilblöcke). Karte: `~71%` (Serif, warm) · `5 COMPANIES` · `AMAZON · GOOGLE · META · MICROSOFT · ORACLE` · `OF THE WORLD'S AI COMPUTING POWER` · `EPOCH AI, 2026`. Auf **growing** steht ein kühler Strich bei 63 % mit `63% → 71%` (Epoch, Apr. 2026). | ① Zellen werden warm ② Strich 63 % | Plansequenz |
| 9.07 | [EXPL→SZENE] 🔑 | 531,72–540,06 | **few places** @533,80 · **same hands** @538,24 | Der Balken rollt sich zurück zum Ring; die Schlüssel verteilen sich auf viele Hände rundum (nicht dieselben). | ① Ring verteilt | Plansequenz |
| 9.08 | [SZENE] 🔑 | 540,06–556,14 | **missing** @541,42 · **habit** @548,94 · **turned** @554,14 | Am Ring leere Haken (Umrisse, kühl) = fehlende Schlüssel. Auf **turned** dreht sich jeder vorhandene Schlüssel einmal. | ① leere Haken ② Drehen | Plansequenz |
| 9.09 | [SZENE] 🔑 | 556,14–567,90 | **safe** @558,14 · **Whose hands** @561,10 · **kitchen** @566,70 | Du hältst den Ring nicht, du schaust: drei kleine Lichtorte (Büro, Schule, Küchentisch) glimmen am Horizont auf. | ① drei Lichter | Plansequenz |
| 9.10 | [SZENE] 🔑 | 567,90–571,90 | **outside** @570,02 · **hold** @570,94 | Ein Schlüssel löst sich vom Ring und schwebt zu dir; deine Hand öffnet sich, du nimmst ihn **nicht** sofort (die Frage bleibt offen). | ① Schlüssel schwebt | Plansequenz |
| 9.11 | [SZENE] 🔑 | 571,90–581,34 | **subscribe** @574,46 · **single key** @577,42 · **insist** @580,38 | Rückzug: der Ring am Haken hoch über dir, viele Schlüssel, Morgenlicht. Auf **insist** hängt ein weiterer Schlüssel sich dazu. | ① Rückzug | Rückzug in den Endscreen |
| 9.12 | [SZENE] 🔑 | 581,34–597,24 | – | **Endscreen (VO-Ende bis Schluss, ~15 s, ohne Stimme).** Morgendämmerung, weit: der **Schlüsselbund am Haken** oben Mitte (y 60–300), du winzig unten Mitte auf einem Kamm. **Frei:** links (x 90–780, y 250–700: „best for viewer“), rechts (x 1140–1830, y 250–700: „latest upload“), Mitte (x 810–1110, y 330–600: Abo-Knopf). Nie statisch: der Ring pendelt minimal, Schlüssel funkeln, Sterne verblassen, Staub steigt. | ① Ring pendelt ② Licht nimmt zu | – |

#### Weltwechsel
| # | ab Shot | Welt | Träger | hart |
|---|---|---|---|---|
| 1 | 1.01 | Rechenzentrum bei Nacht (Hook) | – | ja |
| 2 | 2.01 | Rechenzentrum → innen: Zahlenfeld, die Datei | Flug durchs Schlüsselloch (ein Weg, kein Schnitt) | nein (Weg/Match) |
| 3 | 3.03 | Datei → Tresorraum (runde Tür) | die Datei gleitet ins Fach | ja |
| 4 | 4.01 | Tresor / Schreibtisch → Diagramm Sicherheitsbereich + Drossel | Lampenkreis → Bereichsgrenze (Kreis = Kreis) | ja |
| 5 | 4.04 | Diagramm → Startraum 1950er | dünner Faden → Pultkante | ja |
| 6 | 5.01 | Startraum → Codeseite (Schläfer) | Flug in den Bildschirm mit der Datei | ja |
| 7 | 6.01 | Code → Reim-Plan + Mikroskop | Linse (Kreis bleibt an derselben Stelle) | nein (Weg/Match) |
| 8 | 6.12 | Mikroskop → Labor-Gebäude bei Nacht | Rückzug: die Linse ist das Fenster | ja |
| 9 | 7.03 | Gebäude → Testtabellen | Fenster → Tabellen (Verwandlung am Ort) | nein (Weg/Match) |
| 10 | 8.01 | Tabellen/Brücke → Berge, Glasbox | Brückenlinie → Bergkamm | ja |
| 11 | 9.01 | Glasbox → Schlüsselbund im Morgen | Tresor + Glasbox → Schlüssel | ja |
| 12 | 9.06 | Ring → Epoch-Balken → Ring | Kreis rollt sich ab und wieder auf | nein (Weg/Match) |
<!-- SHOTS:END -->

## §3 Karten (Zitat und ON SCREEN): gestaltet, nicht getippt
Alle Karten folgen der **Zitatkarte aus dem Stil-Test** (1.03–1.04, `lib/f14_hook.mjs`):
- **Linie:** eine dünne Creme-Linie wächst links von oben nach unten.
- **Text:** schreibt sich zeilenweise daneben. Instrument Serif 80–98 px, das Schlüsselwort wird warm (`halo0`).
- **Quelle:** Inter-Versalien 22 px, Sperrung .12em, Creme 70 %.
- **Lage:** die Karte liegt **im Raum** (eigene Kartenebene, Kamera driftet), nie flach auf dem Bild.
- **Ende:** sie geht mit der Kamera aus dem Bild, nie per Blende.

Die Karten im Einzelnen:

- **1.03 Amodei (exakter Wortlaut, Pflicht):** „…we do not understand how our own AI creations work.“ · `— Dario Amodei, CEO of Anthropic` · `“The Urgency of Interpretability”, April 2025`. Steht ~10 s (Q1-Clip plus VO), das Schlüsselwort „do not understand“ wird beim gesprochenen „don't understand“ warm.
- **3.05 Anthropic:** `“two-party authorization for model weight access”` · `ANTHROPIC · MAY 2025`. Die Karte wächst neben der Tresortür von ihrer Grundlinie.
- **5.03–5.05 Schläfer:** `ANTHROPIC · JANUARY 2024` am Kopf der Codeseite. Das Datumsfeld **in der Seite** rollt auf `2023` (`SAFE CODE`) und `2024` (Lücken). Erst danach kommt die Karte `"2023" → safe code · "2024" → hidden flaws`.
- **6.02 Reim-Plan:** `He saw a carrot and had to grab it,` als Zeile. Darunter fächert der Plan auf: **rabbit** (warm, gewählt) · habit · green (verworfen, kühl). Das ist ein Diagramm, keine Textkarte.
- **7.03 / 7.07 Tests:** die Karte `OpenAI ⇄ Anthropic · AUGUST 2025` steht zwischen den Gebäuden, deren Fenster zu Testtabellen werden. Danach die Karte **sycophancy** (Serif, groß) mit `TELLING YOU YOU'RE RIGHT` darunter.
- **8.02 Glasbox:** die Karte `Apertus · ETH Zurich · EPFL · CSCS · September 2025` steigt neben der Box. Die öffentliche Dateiliste steht in der Box (Daten, Code, Gewichte, Bericht).
- **9.06 Epoch:** ein Balken, 5 Segmente (Amazon, Google, Meta, Microsoft, Oracle) zusammen **~71 %**, Rest kühl. Quelle `EPOCH AI, 2026`.

Zahlen nur aus `film-kontrolle/faktencheck.md`. Höchstens eine Zahl und ≤ 6 Wörter pro Grafik, plus Quelle.
