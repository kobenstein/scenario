# Film 15 · „Superintelligence Promised 100 Years of Progress in 10. Is It Starting?“ · Shotliste v1 (bindend für die Builder)

Stand 2026-10-28 (Lead Bild). Text `film-jahrhundert/vo-v3.txt`, Timing `film-jahrhundert/audio/timing.json` (Abschnitte `s00` … `s15`); nach dem VO-Ende (508,14 s) folgt ein Endscreen bis 524,94 s, der sich weiter bewegt. Alle Zeiten unten sind aus `timing.json` berechnet; im Code wird nur über Wörter geankert. Welt, Look, Kit und Budgets: `MOTION.md` (zuerst lesen). Aufteilung und Regeln für die Builder: `BRIEF-builders.md`.
**Quelle dieser Datei:** `tools/shots15.py`. Änderungen an Shots dort machen und mit `python3 tools/shots15.py --md docs/shots.md` neu schreiben; diese Datei nie von Hand ändern.

## §1 Lesehilfe
- **ID** = Chunk.Nummer. **Zeit** = von–bis in Filmsekunden; ein Shot beginnt mit seinem ersten VO-Wort und läuft bis zum nächsten; Pausen gehören dem Shot davor (die Bewegung läuft weiter).
- **Ebene:** `[SZENE]` = Welt (Ort, Figur, eine Lichtform); `[EXPL]` = Explainer (Zahl, Kurve, Karte, Zeitleiste aus Licht auf Nachtblau); `[SZENE→EXPL]` / `[EXPL→SZENE]` = der Shot enthält die Verwandlung (zählt halb). Ziel (Jakob): **etwa 2/3 Explainer, 1/3 Szene.**
- **Anker** = Akzentwort `@` Sekunde. Im Code immer über das Wort ankern (`T.S('s09', 'Ten')`), nie über die Sekunde. Achtung: `T.S` nimmt den ersten Treffer und vergleicht das letzte Wort mit `startsWith` („big“ trifft „biggest“). Bei Zweifeln die Phrase verlängern (`T.S('s00', "It's a big")`) oder `nth` setzen.
- **Bewegung** = höchstens 2 Hauptbewegungen, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, Drift) ist immer da und zählt nicht.
- **Übergang → Träger:** Art · `Träger A → B` · Bildposition · Richtung. Arten: **Plansequenz** (gleiche Einstellung, Neues wächst aus Vorhandenem), **Fahrt** (Kamera folgt dem Träger), **Verwandlung** (Form wird Form), **Flug** (in eine Fläche hinein), **Rückzug**, **Match-Fahrt** (gleiche Form an gleicher Bildstelle). **Jeder Übergang hat ein Objekt als Träger. Keine Blenden, kein Fade, kein Wischer, kein Slide, kein harter Schnitt ohne reimenden Träger.**
- **Schachtel und Band** (Box mit zehn Fächern, Papierband der hundert Jahre) erscheinen **nur an 4 Ankern**: Hook (1.01–1.07), Station 2 (4.01–4.03), Wende (9.05) und Schluss (14.01–14.07). Dazwischen hat jede Station ihre eigene Bildwelt.
- ★ = der eine Wow-Shot pro Chunk (erstes Standbild an den Lead, bevor der Rest des Chunks gebaut wird).
- Ruhe-Regeln (gelten für jeden Shot): Halten 1,5–3 s nach jedem Akzent · kein Stillstand > 2 s · max. 1–2 bewegte Hauptelemente · Zahlen und Zeilen stehen ≥ 1,5 s ruhig · ≤ ~1 harter Weltwechsel pro Minute (§3) · nichts wird halbtransparent eingeblendet.

## §2 Chunks und Shots
| Chunk | Wer | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |
|---|---|---|---|---|---|---|---|
| c01 | Lead | 0,00–23,98 | 24.0 | Hook I · das Band der hundert Jahre, „compressed“, wir haben nachgesehen | Nacht, Felskante · Held: das Papierband aus Licht, das aus der Schachtel quillt | 7 | 33% |
| c02 | Lead | 23,98–44,40 | 20.4 | Hook II · im ersten Fach: Impfstoff für einen Menschen, −42 %, „approved: 0“, Why? | Nacht im Fach · Held: die Phiole im Lichtkegel → die „0“ aus Licht | 5 | 71% |
| c03 | B1 | 44,40–85,16 | 40.8 | Station 1 · der Tumor als Text, ein Impfstoff für eine Person, das versiegelte Programm, 1.137 Patienten | Nacht, Explainer-Raum · Held: die gelesene Zeile → die Phiole | 8 | 78% |
| c04 | B1 | 85,16–129,84 | 44.7 | Station 2 (Anker) · die zehn Fächer werden beschriftet, die Uhr, die Startlinie, das Labor | Nacht · Held: die Schachtel (Draufsicht) → das eine Laborfenster | 7 | 72% |
| c05 | B1 | 129,84–157,32 | 27.5 | Station 3 · AlphaFold: die Kette faltet sich, Nobel, die Weltkarte, die Kapsel teilt sich | Nacht, Laborlicht · Held: das Protein aus Licht → die Weltkarte → die Kapsel | 5 | 89% |
| c06 | B1 | 157,32–198,46 | 41.1 | Station 4a · der Weg durch die Tests: 9 von 10, Phase 2 nicht besser, die Zelle in Echtzeit | Nacht · Held: die Kapsel auf ihrem Weg → die Zelle, die sich teilt | 6 | 92% |
| c07 | B2 | 198,46–244,20 | 45.7 | Station 4b · „below five years“, das verschobene Datum, Biologie gibt das Tempo, Mitte-Abo | Nacht · Held: die Anführungszeichen aus Gold → die Zelle als Taktgeber | 6 | 75% |
| c08 | B2 | 244,20–271,60 | 27.4 | Station 5 · die Lebenslinie läuft nur gestrichelt weiter, deine stärkste Karte, der erste Morgen | Nacht → erstes Morgenlicht · Held: die Lebenslinie → der Morgenstreifen | 5 | 54% |
| c09 | B2 | 271,60–306,24 | 34.6 | Station 6 (Anker, Wende) · Medinawurm: 3,5 Mio. → 10, Filter, Zählen, das leere Bett | Nacht, Dorf · Held: die Strichliste → das Fenster über dem leeren Bett → das leuchtende Fach | 5 | 56% |
| c10 | B2 | 306,24–331,00 | 24.8 | Station 7a · Hepatitis C: heilbar seit 2015, 1 von 5, „It’s reach“ | Nacht · Held: die Tablettenpackung aus Licht | 4 | 79% |
| c11 | B2 | 331,00–380,30 | 49.3 | Station 7b · wie Reichweite aussieht, das Langsamste sind wir, die HIV-Spritze in Sambia | Nacht → Abend in Sambia · Held: die Straße aus Licht → die Spritze | 7 | 67% |
| c12 | B3 | 380,30–433,36 | 53.1 | Station 7c · 40 $, Lizenz, der Preis früh fest, der Vertrag vor der Zulassung | Nacht hellt auf · Held: die Spritzen-Kopien → der Vertrag aus Licht | 6 | 80% |
| c13 | B3 | 433,36–477,56 | 44.2 | Station 7d · du: Test buchen, Studie, eine Zeile im Vertrag | Vor-Dämmerung · Held: dein Licht (du in Gelb) → die eine Vertragszeile | 5 | 53% |
| c14 | B3 | 477,56–524,94 | 47.4 | Schluss (Anker) · Fach für Fach, die Schachtel tragen, „what stopped“, Endscreen | Nacht mit erstem Licht am Horizont · Held: die Schachtel, ein Fach glimmt | 7 | 31% |

**Explainer-Anteil (gemessen, 0–508,14 s):** 69% (mit Endscreen 67%); gemischte Shots zählen halb. Ziel ≈ 2/3.

**Gruppen:** Lead c01–c02 (0,00–44,40) · B1 c03–c06 (44,40–198,46) · B2 c07–c11 (198,46–380,30) · B3 c12–c14 + Endscreen (380,30–524,94)

### c01 · Hook I · das Band der hundert Jahre, „compressed“, wir haben nachgesehen · 0,00–23,98 (24 s) · Lead · ★ 1.01 · [EXPL] 33%
Licht/Held: Nacht, Felskante · Held: das Papierband aus Licht, das aus der Schachtel quillt

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| **1.01 ★** | [SZENE→EXPL] | 0,00–6,40 | **hundred** @3,37 · **progress** @4,20 · **in ten** @5,32 | **Thumbnail-Motiv (0–5 s).** Nacht, Felskante. Du (gelber Regenmantel) hältst die kleine Schachtel über dem Kopf; aus ihr quillt das riesige Papierband mit Jahresmarken 2026 … 2126 in den Himmel. Auf **hundred/progress** läuft ein Lichtschimmer das Band hinauf; auf **in ten** rutschen die Marken zusammen: das Jahrhundert liegt auf einem kurzen Stück nahe der Schachtel, `2026` und `2126` stehen daneben. | ① Schimmer · Marken rutschen ② langsamer Push | Plansequenz |
| 1.02 | [SZENE] | 6,40–10,60 | **medicine** @6,52 · **arriving** @8,84 · **for you** @9,72 | Eine Phiole wartet bei 2090 auf dem Band („your grandchildren“), reitet auf **arriving** das Band hinab und fällt auf **you** in die Schachtel; Fach 1 glimmt. | ① Phiole reitet ② Kamera folgt | Fahrt · Träger Phiole → Schachtel · links · nach unten |
| 1.03 | [SZENE] | 10,60–14,33 | **wrote** @13,24 · **down** @13,96 | Die Kamera steigt am Band entlang; Tinte schreibt sich auf das leere Papier (Handschrift-Welle). | ① Tinte ② Kamera steigt | Verwandlung · Träger Tinte → Goldfaden · Mitte → oben links · nach oben |
| 1.04 | [EXPL] | 14,33–17,80 | **name** @14,68 · **compressed** @15,64 | Der Goldfaden zieht aus dem Ende der Tinte in den Himmel und wird die Grundlinie des Zitats: „the **compressed** 21st century“ (das Wort wird gold) · `DARIO AMODEI · “MACHINES OF LOVING GRACE” · 2024`. | ① Faden ② Zeile steigt | Plansequenz |
| 1.05 | [SZENE] | 17,80–20,28 | **big** @11,48 · **checked** @19,88 | Zitat und Faden ziehen sich zurück; Rückzug zum Maßstab; auf **checked** gleitet das Band in die Schachtel zurück, die Kamera folgt ihm. | ① Band gleitet zurück ② Push | Verwandlung · Träger Schachtel kippt in die Draufsicht · links unten → Mitte |
| 1.06 | [SZENE→EXPL] | 20,28–23,00 | **done** @21,12 · **starting** @21,96 | Draufsicht: zehn Öffnungen. Auf **done** bekommt Fach 10 einen kühlen Rand (Ziel, noch fern), auf **starting** leuchtet Fach 1 warm (die Phiole darin). Du verkürzt dich unter der Schachtel. | ① Fach 1 leuchtet ② Push | Flug · Träger Fach 1 · Mitte links · nach vorn |
| 1.07 | [SZENE] | 23,00–23,98 | **Is it** @23,00 | Flug in Fach 1 (log. Zoom, eine Einstellung): im Fach liegt schon der Raum von c02. | ① Flug | Flug · die Öffnung füllt das Bild |

### c02 · Hook II · im ersten Fach: Impfstoff für einen Menschen, −42 %, „approved: 0“, Why? · 23,98–44,40 (20 s) · Lead · ★ – · [EXPL] 71%
Licht/Held: Nacht im Fach · Held: die Phiole im Lichtkegel → die „0“ aus Licht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 2.01 | [SZENE] | 23,98–29,98 | **October** @24,38 · **vaccine** @27,66 · **one person** @28,70 | Im Fach: eine Phiole im Lichtkegel auf dem Boden, `OCTOBER 2026` steigt von der Bodenkante. Auf **one person** wird der Kegel schmal. | ① Push ② Kegel wird schmal | Plansequenz |
| 2.02 | [EXPL] | 29,98–34,06 | **risk** @30,46 · **forty** @32,74 | Zwei Rückfall-Kurven wachsen aus dem Licht der Phiole (kühl ohne, gold mit Impfstoff), die Lücke füllt sich gold: `−42 %` · `RISK OF RELAPSE OR DEATH` · `MODERNA & MERCK · ESMO 2026`. | ① Kurven ② Fahrt seitlich | Plansequenz |
| 2.03 | [EXPL] | 34,06–36,50 | **computer** @34,42 · **aim** @35,42 | Der Ring der Maschine sinkt aus der Öffnung aufs Etikett der Phiole und rastet auf **aim** ein (Kreuz auf dem Etikett). | ① Ring sinkt | Fahrt · Kamera durch die Trennwand nach rechts |
| 2.04 | [EXPL] | 36,50–43,53 | **drugs** @36,78 · **not a single** @41,18 · **approved** @42,38 | Das Nachbarfach: ein leeres Regal (gestrichelte Umrisse), kühler Kegel. Auf **not a single** steigt eine `0` aus Licht: `APPROVED DRUGS FOUND BY ARTIFICIAL INTELLIGENCE` · `AS OF OCT 2026 · INTUITIONLABS TRACKER`. | ① Fahrt ② die 0 steigt | Plansequenz |
| 2.05 | [EXPL] | 43,53–44,40 | **Why** @43,53 | Die „0“ öffnet sich: in ihrem Loch läuft schon eine Zeile Buchstaben (A C G T); der Ring wächst über die Kamera → `plateCell`. | ① Ring wächst | **Naht Lead → B1** · Flug durch die 0 · Träger `plateCell` (Text des Tumors) · Mitte |

### c03 · Station 1 · der Tumor als Text, ein Impfstoff für eine Person, das versiegelte Programm, 1.137 Patienten · 44,40–85,16 (41 s) · B1 · ★ 3.03 · [EXPL] 78%
Licht/Held: Nacht, Explainer-Raum · Held: die gelesene Zeile → die Phiole

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 3.01 | [EXPL] | 44,40–49,52 | **reads** @45,20 · **letter by letter** @47,12 · **text** @48,72 | Aus `plateCell`: neun Zeilen A C G T füllen die Nacht, die mittlere hell, ein kühler Lese-Cursor (Ring der Maschine, klein) bei x 960; die Zeilen laufen links (lesen). Auf **text** zieht die Kamera leicht zurück: es ist eine Seite. | ① Zeilen laufen ② Rückzug | Plansequenz |
| 3.02 | [EXPL] | 49,52–53,12 | **marks** @50,16 · **only this one** @50,80 · **carries** @52,24 | Der Cursor hält an Stellen: hinter einzelnen Buchstaben glimmen Goldmarken auf (versetzt, 80 ms). Die markierten Buchstaben heben sich aus der Seite und reihen sich zu einer Liste: `UP TO 34 MARKS` · `ONLY IN THIS CANCER` · `MODERNA 10-K · 2025`. | ① Marken glimmen ② Liste reiht sich | Verwandlung · Träger Goldmarken → Körner · Mitte · nach unten |
| **3.03 ★** | [SZENE→EXPL] | 53,12–57,76 | **vaccine** @54,16 · **one person** @45,60 · **Nobody** @56,64 | Die Marken fallen als Goldkörner in **eine** Phiole (dieselbe wie im Hook), sie füllt sich. **Nobody else:** sie steht allein in ihrem Kegel, die Nacht ringsum leer. | ① Körner fallen ② Phiole füllt sich | Rückzug · Träger Phiole → dein Licht · Mitte · nach hinten |
| 3.04 | [SZENE] | 57,76–61,04 | **reads you** @58,64 · **average** @59,68 | Rückzug: die Phiole steht in **deinem** Lichtkegel, du (gelb) daneben. Dahinter, im Dunkeln, eine Reihe gleicher kühler Umriss-Silhouetten (der Durchschnitt); auf **average** bleiben sie kühl, nur dein Kegel ist warm. | ① Rückzug ② die Reihe erscheint aus dem Dunkel (Licht streift sie) | Verwandlung · Träger Etikett der Phiole → versiegelter Umschlag · Mitte · – |
| 3.05 | [EXPL] | 61,04–68,84 | **artificial** @61,60 · **machine learning** @64,56 · **secret** @66,40 · **check** @68,08 | Das Etikett faltet sich zu einem versiegelten Umschlag (`paperLabel` `ALGORITHM`, Siegel aus Gold). Auf **machine learning** steigt `“MACHINE LEARNING” · MODERNA`; auf **check** kreist der kühle Ring außen um den Umschlag und findet keinen Weg hinein. | ① Faltung ② Ring kreist | Plansequenz |
| 3.06 | [EXPL] | 68,84–73,72 | **approved** @69,92 · **longer** @72,16 · **known** @72,96 | Neben dem Umschlag ein leeres Stempelfeld (gestrichelt) `APPROVED`. Die Gold-Kurve aus dem Hook läuft weiter und wird nach 2 Jahren gestrichelt: `OVERALL SURVIVAL · DATA IMMATURE` · `ESMO 2026`. | ① Kurve wird gestrichelt | Verwandlung · Träger Gold-Kurve zerfällt in Lichtpunkte · rechts · nach unten |
| 3.07 | [EXPL] | 73,72–78,53 | **lucky** @74,32 · **thousand** @77,04 | Die Kurve zerfällt in ein ruhiges Feld kleiner Lichtpunkte (Patienten), das von links nach rechts aufgeht: `1,137` · `PATIENTS IN THE TRIAL` · `INTERPATH-001 · ESMO 2026`. | ① Feld geht auf | Plansequenz |
| 3.08 | [SZENE→EXPL] | 78,53–85,16 | **read** @45,20 · **list** @53,52 | Das Feld zieht sich in die Phiole zurück; das Papier-Etikett löst sich, flattert nach oben rechts und wird auf **list** der erste Papierstreifen auf der Schachtel (c04). | ① Etikett fliegt | Fahrt · Träger Papierstreifen → Schachtel (Draufsicht) · oben rechts · nach oben |

### c04 · Station 2 (Anker) · die zehn Fächer werden beschriftet, die Uhr, die Startlinie, das Labor · 85,16–129,84 (45 s) · B1 · ★ 4.03 · [EXPL] 72%
Licht/Held: Nacht · Held: die Schachtel (Draufsicht) → das eine Laborfenster

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 4.01 | [EXPL] | 85,16–90,32 | **box** @86,76 · **Ten** @87,72 · **each year** @89,32 | **Anker 2.** Die Schachtel in Draufsicht, groß, das Band gefaltet darin. Auf **Ten** schreibt sich in jedes Fach eine Jahreszahl `1` … `10` (Tinte, versetzt 60 ms, Leserichtung). | ① Ziffern ② Push | Plansequenz |
| 4.02 | [SZENE→EXPL] | 90,32–93,00 | **promise** @91,32 · **inside** @92,16 | Der Deckel öffnet sich ganz; das gefaltete Band hebt sich aus den Fächern und gibt sie frei. | ① Deckel ② Band hebt sich | Plansequenz |
| **4.03 ★** | [EXPL] | 93,00–107,56 | **infectious** @95,40 · **cancers** @97,80 · **Alzheimer's** @99,00 · **mental** @100,36 · **double** @102,76 · **poorer** @104,68 | Je Satz landet ein Papierstreifen (`paperLabel`) vor einem Fach und schreibt sich: `INFECTIONS` · `CANCER` · `ALZHEIMER’S` · `MENTAL ILLNESS` · `LIFESPAN ×2` · `POORER COUNTRIES`. Vier Fächer bleiben leer. Kein Licht in den Fächern (es ist ein Versprechen). | ① ein Streifen nach dem anderen | Verwandlung · Träger Schachtel → Zifferblatt darüber · Mitte · nach oben |
| 4.04 | [EXPL] | 107,56–113,08 | **clock** @107,80 · **written** @109,72 · **good enough** @112,16 | Über der Schachtel ein Zifferblatt aus Licht (Stoppuhr), Zeiger auf 0. Auf **written** steht er still neben dem Streifen `ESSAY · 2024`; auf **good enough** zittert er, startet aber nicht. | ① Zeiger zittert | Plansequenz |
| 4.05 | [EXPL] | 113,08–118,80 | **powerful** @113,80 · **earliest** @116,36 · **twenty-six** @117,64 | Der Ring der Maschine bildet sich hinter der Uhr: `POWERFUL ARTIFICIAL INTELLIGENCE`; auf **twenty-six** `EARLIEST: ~2026` · `DARIO AMODEI · 2024`. | ① Ring bildet sich | Verwandlung · Träger Zifferblatt kippt flach → Startlinie am Boden · Mitte · nach unten |
| 4.06 | [SZENE] | 118,80–123,28 | **finish** @120,12 · **start** @108,52 | Das Zifferblatt kippt und wird eine Startlinie aus Licht am Boden. Du stehst darauf; vor dir verliert sich eine lange Bahn im Dunkeln (das Jahrhundert), keine Ziellinie in Sicht. | ① Kran zurück ② du schaust | Plansequenz |
| 4.07 | [SZENE] | 123,28–129,84 | **pharmacy** @125,84 · **lab** @127,48 | An der Bahn zwei Häuser: eine Apotheke (Kreuz dunkel) bleibt dunkel; auf **lab** geht ein Laborfenster warm an. Push ins Fenster. | ① Fenster geht an ② Push | Flug · Träger Laborlampe · rechts · nach vorn |

### c05 · Station 3 · AlphaFold: die Kette faltet sich, Nobel, die Weltkarte, die Kapsel teilt sich · 129,84–157,32 (27 s) · B1 · ★ 5.03 · [EXPL] 89%
Licht/Held: Nacht, Laborlicht · Held: das Protein aus Licht → die Weltkarte → die Kapsel

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 5.01 | [SZENE→EXPL] | 129,84–136,08 | **AlphaFold** @130,88 · **shape** @132,36 · **machines** @134,20 | Unter der Laborlampe: eine Perlenkette aus Licht (Aminosäuren) faltet sich auf **shape** zu einem Protein-Band (flach, Editorial). `ALPHAFOLD` als kleines Label. | ① Kette faltet sich | Plansequenz |
| 5.02 | [EXPL] | 136,08–138,12 | **Nobel** @136,96 | Das gefaltete Protein wirft einen runden Schatten aus Licht, der zur Medaille wird: `NOBEL PRIZE IN CHEMISTRY` · `2024`. | ① Medaille prägt sich | Verwandlung · Träger Medaille → Erdscheibe → Weltkarte · Mitte · – |
| **5.03 ★** | [EXPL] | 138,12–145,84 | **uses** @139,68 · **million** @141,36 · **free** @145,04 | Die Medaille dreht sich zur Erdscheibe und entrollt sich zur Weltkarte aus Lichtpunkten. Punkte gehen in Ländern mit niedrigem und mittlerem Einkommen auf: `>1 MILLION` · `USERS IN LOW- AND MIDDLE-INCOME COUNTRIES` · `GOOGLE DEEPMIND`. Auf **free** kein Preisschild. | ① Punkte gehen auf | Plansequenz |
| 5.04 | [EXPL] | 145,84–150,24 | **trickle** @147,08 · **everywhere** @149,20 | Erst ein dünner Lichtfaden, der von oben auf einen Punkt tropft (trickle) und abreißt; auf **everywhere** regnet das Licht überall zugleich auf die Karte. | ① Tropfen ② Regen | Verwandlung · Träger Lichter sammeln sich → Kapsel · Mitte · – |
| 5.05 | [EXPL] | 150,24–157,32 | **cure** @151,44 · **splits** @154,52 | Die Lichter der Karte ziehen sich zu einer Kapsel aus Licht zusammen; auf **splits** teilt sie sich in zwei Hälften (links warm, rechts kühl) → optional `platePill`. | ① Sammeln ② Teilen | Verwandlung · Träger Kapsel (`platePill`, intern) · Mitte · – |

### c06 · Station 4a · der Weg durch die Tests: 9 von 10, Phase 2 nicht besser, die Zelle in Echtzeit · 157,32–198,46 (41 s) · B1 · ★ 6.06 · [EXPL] 92%
Licht/Held: Nacht · Held: die Kapsel auf ihrem Weg → die Zelle, die sich teilt

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 6.01 | [SZENE→EXPL] | 157,32–163,96 | **Follow** @157,40 · **pharmacy** @160,80 · **people** @163,12 | Die Hälften schließen sich, die Kapsel rollt los auf einem Weg aus Licht; weit hinten ein kleines Apothekenfenster. Auf dem Weg zwei Tore (Ringe aus Licht). | ① Kapsel rollt ② Fahrt mit | Plansequenz |
| 6.02 | [EXPL] | 163,96–169,24 | **safe** @165,48 · **help** @168,20 | Tor 1 bekommt sein Wort `SAFE?`, Tor 2 `DOES IT HELP?` (steigen von ihrer Grundlinie). | ① Wörter steigen | Plansequenz |
| 6.03 | [EXPL] | 169,24–177,91 | **first test** @172,36 · **nine** @173,76 · **half** @176,60 | Zwei Ströme zu je zehn Kapseln vor Tor 1: oben gold (gefunden mit KI), unten kühl (üblich). Oben gehen 9 durch, unten 5: `9 IN 10` · `PASS THE FIRST TEST` · `JAYATUNGA ET AL. · DRUG DISCOVERY TODAY 2024`. | ① Ströme ziehen | Fahrt · Träger die Kapseln → Tor 2 · Mitte · nach rechts |
| 6.04 | [EXPL] | 177,91–185,28 | **second test** @178,28 · **no better** @180,52 · **small** @183,88 | An Tor 2 kommen aus beiden Strömen gleich wenige durch: `NO BETTER IN TEST 2` · `SMALL SAMPLE · SAME SOURCE`. | ① Ströme | Plansequenz |
| 6.05 | [EXPL] | 185,28–187,84 | **limit** @186,76 | Rückzug: hinter Tor 2 ist der Weg lang und dunkel, die Apotheke weit. Hier sitzt die Grenze. | ① Rückzug | Plansequenz |
| **6.06 ★** | [EXPL] | 187,84–198,46 | **faster** @189,08 · **body** @190,60 · **years** @196,84 | Links der kühle Ring der Maschine, schnell kreisend; rechts eine einzige Zelle aus Licht, die sich in Echtzeit teilt (sehr langsam). Auf **years** Push auf die Zelle → `plateDivide`. | ① Ring kreist ② Push auf die Zelle | **Naht B1 → B2** · Push · Träger `plateDivide` (eine Zelle, die sich teilt) · Mitte |

### c07 · Station 4b · „below five years“, das verschobene Datum, Biologie gibt das Tempo, Mitte-Abo · 198,46–244,20 (46 s) · B2 · ★ 7.01 · [EXPL] 75%
Licht/Held: Nacht · Held: die Anführungszeichen aus Gold → die Zelle als Taktgeber

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| **7.01 ★** | [EXPL] | 198,46–205,74 | **June** @198,70 · **researcher** @203,74 | Aus `plateDivide`: die Zelle teilt sich fertig, die zwei Tochterzellen treiben auseinander und werden die zwei goldenen Anführungszeichen einer Zitatkarte. `JUNE 2026 · AI FOR SCIENCE EVENT`. | ① Teilung ② Zeichen gleiten | Plansequenz |
| 7.02 | [EXPL] | 205,74–211,90 | **compression** @207,90 · **data** @210,94 | Zitat Zeile für Zeile (wortgenau): „I think we really will see a large compression. But we still need the clinical trial data.“ · `GLP-1 RESEARCHER · ANTHROPIC EVENT · JUNE 2026` (Name erst nach Gegenhören, `faktencheck.md` #17). | ① Zeilen steigen | Plansequenz |
| 7.03 | [EXPL] | 211,90–216,94 | **below** @215,18 · **five years** @215,66 | Das Zitat sinkt; fünf Jahresblätter aus Licht stehen nebeneinander. Eine Hand aus Licht drückt sie zusammen, sie geben nach, bleiben aber fünf: `BELOW 5 YEARS?` (nur „5“ als Zahl). | ① Blätter werden gedrückt | Verwandlung · Träger Blätter → Kalenderleiste · Mitte · – |
| 7.04 | [EXPL] | 216,94–230,35 | **dates** @218,70 · **twenty-five** @225,42 · **moved** @227,42 · **twenty-six** @199,34 | Eine Kalenderleiste; ein Klebezettel `FIRST TESTS IN PEOPLE: END 2025`. Auf **moved** löst er sich und klebt eine Jahreslänge weiter: `END 2026` · `REUTERS · JAN 2026`. | ① Zettel wandert | Plansequenz |
| 7.05 | [SZENE→EXPL] | 230,35–234,96 | **failure** @230,78 · **biology** @231,90 · **pace** @233,42 | Neben dem Zettel teilt sich wieder eine Zelle, ruhig, im Takt: jede Teilung ein Schlag. Der Zettel wackelt mit (Biologie gibt das Tempo). | ① Zelle teilt sich im Takt | Rückzug · Träger die Zellen → warme Punkte einer weiten Nacht · Mitte · nach hinten |
| 7.06 | [SZENE] | 234,96–244,20 | **all of us** @239,36 · **subscribe** @242,08 | **Mitte-Abo.** Rückzug: die Zellen werden zu warmen Lichtern einer weiten nächtlichen Ebene (viele Orte, „all of us“). **Frei:** unten rechts x 1280–1840, y 760–980 (Abo-Einblendung). Ruhige Drift. | ① Rückzug ② Lichter atmen | Verwandlung · Träger ein Licht → Startpunkt der Lebenslinie · Mitte links · nach rechts |

### c08 · Station 5 · die Lebenslinie läuft nur gestrichelt weiter, deine stärkste Karte, der erste Morgen · 244,20–271,60 (27 s) · B2 · ★ 8.04 · [EXPL] 54%
Licht/Held: Nacht → erstes Morgenlicht · Held: die Lebenslinie → der Morgenstreifen

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 8.01 | [EXPL] | 244,20–249,48 | **too big** @245,68 · **one part** @247,32 | Aus einem Licht zieht eine Goldlinie nach rechts: eine Lebenslinie, `~75 YEARS` (Ende des 20. Jh.) · `ESSAY · 2024` (Trend, auf den Amodei sich stützt). | ① Linie zieht | Plansequenz |
| 8.02 | [EXPL] | 249,48–256,44 | **Doubling** @249,48 · **None** @253,40 · **bet** @254,60 | Auf **Doubling** läuft die Linie gleich lang weiter, aber nur gestrichelt. Auf **None**: `CLINICAL EVIDENCE: NONE`. Auf **bet** wird das Label `A BET, NOT A FORECAST`. | ① Strich läuft gestrichelt | Verwandlung · Träger gestrichelte Linie → Karte in deiner Hand · Mitte · nach unten |
| 8.03 | [SZENE] | 256,44–261,24 | **skeptical** @256,72 · **card** @259,44 · **fair** @260,28 | Die gestrichelte Linie faltet sich zu einer Karte aus Licht und gleitet in deine Hand (du in Gelb, nah). Du hältst sie ruhig: deine stärkste Karte. | ① Karte gleitet ② deine Hand | Rückzug · Träger Karte → Horizont · unten · nach hinten |
| **8.04 ★** | [SZENE] | 261,24–266,60 | **ten-year** @261,88 · **morning** @265,72 | Rückzug in eine weite Landschaft vor Tagesanbruch: auf **morning** ein dünner erster Lichtstreifen am Horizont, sonst noch Nacht. | ① Rückzug ② Morgenstreifen | Plansequenz |
| 8.05 | [SZENE→EXPL] | 266,60–271,60 | **start** @267,56 · **notice** @269,08 | Push auf den Morgenstreifen, bis er eine einzelne Linie ist: ein Strich in einem Notizbuch (die Strichliste, c09). | ① Push | Match-Fahrt · Träger Horizontstrich → Zählstrich · Mitte · – |

### c09 · Station 6 (Anker, Wende) · Medinawurm: 3,5 Mio. → 10, Filter, Zählen, das leere Bett · 271,60–306,24 (35 s) · B2 · ★ 9.05 · [EXPL] 56%
Licht/Held: Nacht, Dorf · Held: die Strichliste → das Fenster über dem leeren Bett → das leuchtende Fach

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 9.01 | [EXPL] | 271,60–278,48 | **eighty-six** @272,24 · **Guinea** @274,32 · **million** @276,80 | Der Strich ist einer von unzähligen: eine Wand aus Strichlisten füllt das Bild (Kreide auf Nacht). `3.5 MILLION` · `CASES A YEAR · 1986` · `THE CARTER CENTER`. | ① Striche wachsen ② Rückzug | Plansequenz |
| 9.02 | [EXPL] | 278,48–282,64 | **twenty-five** @278,88 · **Ten** @280,00 · **planet** @282,08 | Die Striche fallen als Kreidestaub zu Boden, Reihe für Reihe, bis zehn bleiben: `10` · `CASES · 2025`. Rückzug: die zehn Striche auf einer Erdscheibe. | ① Staub fällt ② Rückzug | Fahrt · Träger Kreidestaub → Wasser im Krug · Mitte · nach unten |
| 9.03 | [SZENE] | 282,64–292,27 | **drug** @282,88 · **filters** @285,52 · **Teaching** @286,64 · **counted** @288,44 · **year after year** @290,80 | Ein Dorf bei Nacht, ein Brunnen. Ein Tuch-Filter über einem Krug (Wasser läuft hindurch); eine Hand mit Kreide an einer Tafel; eine Person zählt in ein Notizbuch, Strich für Strich, eine Lampe daneben. | ① Wasser läuft ② ein Strich nach dem anderen | Plansequenz |
| 9.04 | [EXPL] | 292,27–300,64 | **second** @293,36 · **smallpox** @295,76 · **over** @297,20 · **Dogs** @298,08 | Im Notizbuch eine Liste: `SMALLPOX` (durchgestrichen) · `GUINEA WORM` (Strich bis zur Hälfte). Auf **Dogs** läuft am Brunnen ein Hund (Silhouette) durchs Bild. | ① Strich ② Hund | Plansequenz |
| **9.05 ★** | [SZENE] | 300,64–306,24 | **headline** @302,76 · **empty bed** @303,92 | ★ **Anker 3 (Wende).** Ein stilles Krankenzimmer: ein leeres Bett unter einem Fenster. Rückzug durchs Fenster: das Fenster ist ein Fach der Schachtel (Draufsicht, aus dem Hook), und `INFECTIONS` glimmt auf, **weil etwas aufgehört hat**. | ① Rückzug ② das Fach glimmt | Flug · Träger das leuchtende Fach → Tablettenpackung darin · links oben · nach vorn |

### c10 · Station 7a · Hepatitis C: heilbar seit 2015, 1 von 5, „It’s reach“ · 306,24–331,00 (25 s) · B2 · ★ 10.03 · [EXPL] 79%
Licht/Held: Nacht · Held: die Tablettenpackung aus Licht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 10.01 | [SZENE→EXPL] | 306,24–311,44 | **machine** @306,64 · **already have** @310,32 | Push ins leuchtende Fach: darin liegt eine Tablettenpackung aus Licht (voll). | ① Push | Plansequenz |
| 10.02 | [EXPL] | 311,44–316,67 | **Hepatitis** @311,44 · **curable** @312,88 · **pills** @315,88 | Die Packung, nah: `HEPATITIS C` · `CURABLE SINCE 2015` · `WHO · 2026`. Auf **pills** drückt sich eine Tablette aus dem Blister. | ① Tablette | Verwandlung · Träger Tablette → eine von fünf Figuren · Mitte · nach rechts |
| **10.03 ★** | [EXPL] | 316,67–325,90 | **one in five** @319,68 · **waiting** @323,28 | Fünf schlichte Figuren (Indigo, kein Gelb) in einer Reihe; die Tablette erreicht eine, sie wird warm: `1 IN 5` · `TREATED SINCE 2015` · `WHO GLOBAL HEPATITIS REPORT 2026`. Vier warten im Dunkeln. | ① Tablette rollt ② eine Figur wird warm | Plansequenz |
| 10.04 | [EXPL→SZENE] | 325,90–331,00 | **intelligence** @327,04 · **reach** @328,48 | Rückzug: zwischen Packung und den vier Wartenden liegt Dunkel. Auf **reach** schiebt sich aus der Packung eine Straße aus Licht zu ihnen hinaus → optional `plateReach`. | ① Straße schiebt sich | Fahrt · Träger Straße aus Licht (`plateReach`, intern) · links unten → Horizont |

### c11 · Station 7b · wie Reichweite aussieht, das Langsamste sind wir, die HIV-Spritze in Sambia · 331,00–380,30 (49 s) · B2 · ★ 11.05 · [EXPL] 67%
Licht/Held: Nacht → Abend in Sambia · Held: die Straße aus Licht → die Spritze

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 11.01 | [SZENE→EXPL] | 331,00–342,12 | **Find** @334,44 · **Bring** @336,36 · **keep going** @338,84 | Die Straße aus Licht in der Ebene; drei Stationen daran leuchten auf ihr Wort: `FIND` · `BRING` · `KEEP GOING` (ein Wort je Station). | ① Fahrt die Straße entlang | Plansequenz |
| 11.02 | [EXPL] | 342,12–346,84 | **ministries** @343,40 · **budgets** @344,36 · **lab** @345,72 | Am Straßenrand öffnet sich ein Haushaltsbuch aus Licht; eine Zeile glüht: `HEALTH BUDGET`. Das ferne Laborfenster bleibt klein. | ① Buch öffnet sich | Verwandlung · Träger Buchzeile → Zeitleiste · Mitte · nach rechts |
| 11.03 | [EXPL] | 346,84–355,24 | **slowest** @347,48 · **science** @349,96 · **us** @351,80 · **finish** @353,40 | Die Zeile wird eine Zeitleiste: ein kurzes helles Stück `SCIENCE`, dann ein langes, noch dunkles Stück `US: DECIDING`. Auf **finish** beginnt es sich zu füllen. | ① Leiste füllt sich | Verwandlung · Träger Leiste → Brücke aus Papier · Mitte · – |
| 11.04 | [SZENE] | 355,24–358,36 | **build** @357,32 | Die Leiste wird eine Brücke aus Papierstreifen über eine Lücke; kleine Silhouetten legen Streifen nach. | ① Brücke wächst | Fahrt · über die Brücke · Träger Spritze aus Licht · rechts |
| **11.05 ★** | [SZENE→EXPL] | 358,36–367,96 | **HIV** @359,80 · **twice** @361,40 · **Zambia** @363,96 · **Kenya** @364,72 · **Nigeria** @365,28 · **South Africa** @366,68 | Eine Klinik in Sambia bei Abend (Szene): eine Pflegerin (Silhouette) hält die Spritze aus Licht (`F.syringe`): `TWICE A YEAR` · `LENACAPAVIR · CHAI 2026`. Rückzug zur Karte Afrikas: Sambia, Kenia, Nigeria, Südafrika leuchten auf ihr Wort. | ① Rückzug ② Länder leuchten | Plansequenz |
| 11.06 | [EXPL] | 367,96–375,21 | **artificial** @368,72 · **poorest last** @373,56 | Eine Schlange aus Lichtpunkten (Länder); die Spritze landet vorn, nicht hinten: `NOT LAST`. | ① Spritze landet | Fahrt · Träger Spritze fliegt · Mitte · nach rechts |
| 11.07 | [SZENE→EXPL] | 375,21–380,30 | **travel** @376,84 · **fast** @378,60 | Die Spritze fliegt quer durch die Nacht, eine feine Goldspur hinter sich; sie kommt in der Bildmitte zur Ruhe → `plateShot`. | ① Flug ② Spur | **Naht B2 → B3** · Träger `plateShot` (die Spritze, unterwegs) · Mitte |

### c12 · Station 7c · 40 $, Lizenz, der Preis früh fest, der Vertrag vor der Zulassung · 380,30–433,36 (53 s) · B3 · ★ 12.06 · [EXPL] 80%
Licht/Held: Nacht hellt auf · Held: die Spritzen-Kopien → der Vertrag aus Licht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 12.01 | [EXPL] | 380,30–386,78 | **twenty-seven** @380,86 · **copies** @382,22 · **forty** @384,14 | Aus `plateShot`: die Spritze klont sich zu einer Reihe Kopien (versetzt 60 ms). Von ihrer Grundlinie steigt `$40` · `PER PERSON, PER YEAR` · `FROM 2027 · REUTERS 2025` (Quelle trägt das Jahr, nicht das Label). | ① Klonen ② Zahl steigt | Plansequenz |
| 12.02 | [EXPL] | 386,78–392,78 | **licensed** @387,34 · **producers** @388,62 · **locked** @390,54 | Ein Lizenzblatt (`paperLabel` `LICENSE`) wandert von einer Hand zu sechs kleinen Fabrikfenstern, die angehen. Auf **locked** schließt sich eine Klammer aus Licht um das Preisschild. | ① Blatt wandert ② Klammer | Verwandlung · Träger Preisschild → Zeitleiste · Mitte · nach links |
| 12.03 | [EXPL] | 392,78–400,86 | **perfect** @393,50 · **year after** @395,98 · **agreed** @399,82 | Ehrliche Zeitleiste: `FIRST SHOTS` (Dez. 2025) … kühle Lücke … `CHEAP COPIES` (2027): `MORE THAN A YEAR`. Auf **agreed** glüht eine einzelne Unterschrift: `THE MAKER AGREED`. | ① Lücke ② Unterschrift | Verwandlung · Träger Unterschrift → Vertrag am Tor · Mitte · – |
| 12.04 | [EXPL] | 400,86–411,66 | **deal** @401,42 · **license** @387,34 · **before approval** @408,46 · **after** @396,30 | Der Test-Weg aus c06 kehrt klein zurück; am letzten Tor (Zulassung) wird ein Vertrag aus Licht mit zwei Zeilen festgesteckt: `LICENSE` · `PRICE`, **vor** dem Tor. | ① Vertrag | Plansequenz |
| 12.05 | [SZENE→EXPL] | 411,66–419,66 | **governments** @412,58 · **funders** @389,90 · **sign** @414,62 · **lose** @416,30 · **early** @418,54 | Drei Hände (Silhouetten, kein Gelb) unterschreiben nacheinander (Hersteller, Regierung, Geldgeber). Auf **lose** liegt nichts auf der Verliererseite. | ① drei Unterschriften | Verwandlung · Träger Vertrag → Medikament aus Licht · Mitte · – |
| **12.06 ★** | [SZENE→EXPL] | 419,66–433,36 | **Picture** @419,66 · **back of the line** @427,58 · **everyone** @431,26 | ★ Das erste zugelassene Medikament aus Licht in der Mitte. Eine lange Schlange kleiner Lichter (Länder) steht dahinter; auf **back of the line** biegt sie sich zu einem Kreis um das Medikament, niemand ist hinten. | ① Schlange wird Kreis | Verwandlung · Träger Kreis → dein Lichtkegel · Mitte · – |

### c13 · Station 7d · du: Test buchen, Studie, eine Zeile im Vertrag · 433,36–477,56 (44 s) · B3 · ★ 13.05 · [EXPL] 53%
Licht/Held: Vor-Dämmerung · Held: dein Licht (du in Gelb) → die eine Vertragszeile

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 13.01 | [SZENE] | 433,36–439,08 | **you** @433,68 · **closer** @434,92 · **lab coat** @437,44 | Der Kreis schrumpft zu deinem Lichtkegel: du (gelb) in einer Straße bei Nacht. Neben dir hängt ein Laborkittel am Haken; du gehst daran vorbei. | ① du gehst ② Fahrt mit | Plansequenz |
| 13.02 | [SZENE→EXPL] | 439,08–446,96 | **finds you** @443,12 · **test** @444,64 · **book** @446,16 | Die fünf Figuren aus c10 kehren zurück; ein Lichtstrahl findet eine. Auf **book** schreibt sich ein Terminzettel: `TEST · BOOKED`. | ① Strahl ② Zettel | Verwandlung · Träger Zettel → Stuhlreihe · Mitte · nach rechts |
| 13.03 | [SZENE→EXPL] | 446,96–460,68 | **trial** @449,00 · **slowest** @451,52 · **too few** @454,84 · **volunteer** @456,96 · **faster** @459,76 | Eine Reihe leerer Stühle (Studie); auf **volunteer** füllen sie sich mit kleinen Lichtern, einer nach dem anderen; der kleine Test-Weg daneben läuft schneller. | ① Stühle füllen sich | Verwandlung · Träger ein Licht → Münze · Mitte · nach unten |
| 13.04 | [EXPL] | 460,68–469,28 | **public money** @461,12 · **fair price** @463,28 · **HIV** @466,88 | Eine Münze (öffentliches Geld) fällt ins Laborfenster; der Vertrag bekommt eine Zeile `FAIR PRICE`; auf **HIV** klickt die Klammer aus c12 daneben. | ① Münze ② Zeile | Plansequenz |
| **13.05 ★** | [SZENE→EXPL] | 469,28–477,56 | **one line** @471,36 · **vote** @473,92 | Nur die eine Zeile glüht. Sie faltet sich zu einem Brief; du steckst ihn in einen beleuchteten Briefkasten `YOUR REPRESENTATIVE`. | ① Zeile → Brief ② deine Hand | Rückzug · Träger Briefkastenlicht → Fach der Schachtel · Mitte · nach hinten |

### c14 · Schluss (Anker) · Fach für Fach, die Schachtel tragen, „what stopped“, Endscreen · 477,56–524,94 (47 s) · B3 · ★ 14.03 · [EXPL] 31%
Licht/Held: Nacht mit erstem Licht am Horizont · Held: die Schachtel, ein Fach glimmt

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 14.01 | [EXPL] | 477,56–486,12 | **starting** @478,76 · **tools** @480,28 · **halfway** @482,84 · **not yet** @485,08 | **Anker 4.** Die Schachtel (Draufsicht) kehrt zurück. Fach für Fach: `TOOLS` hell · `MEDICINES` halb · `LONGER LIFE` dunkel mit gestricheltem Rand (neue Streifen über den alten). | ① Fächer leuchten nacheinander | Plansequenz |
| 14.02 | [EXPL] | 486,12–490,32 | **already** @487,20 · **reached** @488,72 | Ein Fach `HEPATITIS C` ist voll Licht, aber der Deckel liegt fast zu: Licht nur im Spalt. | ① Deckel | Rückzug · Träger Schachtel → in deinen Händen · Mitte · nach hinten |
| **14.03 ★** | [SZENE] | 490,32–495,90 | **bring** @491,32 · **Carrying** @492,64 · **our part** @494,20 | ★ Rückzug: du hältst die Schachtel (Echo des Thumbnails), das Band ist darin gefaltet. Auf **Carrying** gehst du los, über die Kante hinunter auf eine Ebene mit fernen Fenstern. | ① du gehst ② Rückzug | Plansequenz |
| 14.04 | [SZENE] | 495,90–498,86 | **compartment** @496,30 · **first** @497,82 | Nah über der Schachtel in deinen Armen: die Fächer warten, eines flackert kurz (die Frage an dich). | ① Fahrt mit dir | Plansequenz |
| 14.05 | [SZENE] | 498,86–504,38 | **carry** @499,82 · **last** @502,46 · **subscribe** @503,26 | Weit: du gehst auf das fernste Fenster zu (die zuletzt Erreichten). **Frei:** oben rechts für die Abo-Einblendung. | ① du gehst | Plansequenz |
| 14.06 | [SZENE→EXPL] | 504,38–508,14 | **arrive** @505,78 · **stopped** @507,50 | Am Horizont die Strichliste aus c09, klein: auf **stopped** sinkt ihr letzter Strich, ein Fach in deinen Händen glimmt auf. | ① Strich sinkt ② Fach glimmt | Rückzug in den Endscreen |
| 14.07 | [SZENE] | 508,14–524,94 | – | **Endscreen (VO-Ende bis Schluss, ≤ 17 s, ohne Stimme).** Die Schachtel steht auf der Kante, das Band liegt gefaltet darin, ein Fach glimmt; du sitzt daneben, winzig, unten Mitte. **Frei:** links x 90–780, y 250–700 („best for viewer“), rechts x 1140–1830, y 250–700 („latest upload“), Mitte oben x 810–1110, y 120–330 (Abo-Knopf). Nie statisch: langsamer Rückzug, Sterne ziehen, das Fach atmet, erstes Licht am Horizont. | ① Rückzug ② Fach atmet | – |

## §3 Welten und Weltwechsel (≤ ~1 harter Wechsel pro Minute)
Eine **Welt** ist ein Ort mit eigenem Licht. Explainer-Grafiken auf Nachtblau gehören zur Welt, aus der sie wachsen (kein Wechsel). **Hart** = neuer Ort, auch wenn ein Objekt ihn trägt; **weich** = Verwandlung im selben Licht.

| # | ab | Welt (Licht) | Wechsel | Träger |
|---|---|---|---|---|
| 1 | 0,00 | Felskante bei Nacht, Schachtel und Band (Anker 1) | – | – |
| 2 | 24,32 | im Fach 1: Raum mit Phiole und Nachbarfach | weich (Flug in ein Ding derselben Welt) | Fach 1 |
| 3 | 44,40 | Explainer-Raum: der Tumor als Text, Phiole, Umschlag, Patientenfeld | **hart** | die „0“ → `plateCell` |
| 4 | 85,16 | Schachtel in Draufsicht (Anker 2), Uhr, Startlinie, Bahn mit Apotheke und Labor | **hart** | Papier-Etikett der Phiole |
| 5 | ~127 | Labor: Protein, Medaille, Weltkarte, Kapsel | weich (Flug ins Laborfenster) | Laborlampe |
| 6 | 157,32 | der Weg durch die Tests (Tore aus Licht), Ring und Zelle | **hart** | Kapsel |
| 7 | 198,46 | Zitatkarte, Kalender, Zellen im Takt, weite Ebene (Mitte-Abo) | weich (Explainer-Nacht) | `plateDivide` |
| 8 | 244,20 | Lebenslinie, deine Karte, Landschaft vor Tagesanbruch | **hart** | ein Licht der Ebene → Linie |
| 9 | 271,60 | Strichliste, Dorf mit Brunnen, Krankenzimmer, das Fach glimmt (Anker 3) | **hart** | Horizontstrich → Zählstrich |
| 10 | 306,24 | Hepatitis C: Packung, fünf Figuren | weich (im Fach) | das leuchtende Fach |
| 11 | 331,00 | Straße aus Licht, Haushaltsbuch, Brücke, Klinik in Sambia, Karte | **hart** | Straße aus Licht |
| 12 | 380,30 | Spritzen-Kopien, Lizenz, Vertrag, Kreis der Länder | **hart** | `plateShot` |
| 13 | 433,36 | du in der Straße, Kittel, Stühle, Brief | **hart** | Kreis → dein Lichtkegel |
| 14 | 477,56 | Schachtel (Anker 4), du trägst sie in die Ebene, Endscreen | **hart** | Briefkastenlicht → Fach |

**Harte Wechsel: 9 auf 8,75 min ≈ 1,0 pro Minute.** Mehr nicht hinzufügen; wer einen Ort braucht, verwandelt im selben Licht.

## §4 Zahlen und Quellen im Bild (nur diese; Werte aus `faktencheck.md` / `vo-v3.txt`)
| Shot | Einblendung | Quelle im Bild | faktencheck |
|---|---|---|---|
| 1.04 | „the compressed 21st century“ | `DARIO AMODEI · “MACHINES OF LOVING GRACE” · 2024` | #1, #2 |
| 2.02 | `−42 %` RISK OF RELAPSE OR DEATH | `MODERNA & MERCK · ESMO 2026` | #4 |
| 2.04 | `0` APPROVED DRUGS FOUND BY ARTIFICIAL INTELLIGENCE | `AS OF OCT 2026 · INTUITIONLABS TRACKER` | #9 |
| 3.02 | `UP TO 34 MARKS` ONLY IN THIS CANCER | `MODERNA 10-K · 2025` | #5 |
| 3.05 | “MACHINE LEARNING” | `MODERNA` | #6 |
| 3.06 | OVERALL SURVIVAL · DATA IMMATURE | `ESMO 2026` | #7 (nicht „not yet analysed“) |
| 3.07 | `1,137` PATIENTS IN THE TRIAL | `INTERPATH-001 · ESMO 2026` | #8 |
| 4.05 | `EARLIEST: ~2026` | `DARIO AMODEI · 2024` | #11 |
| 5.02 | NOBEL PRIZE IN CHEMISTRY `2024` | – | #13 |
| 5.03 | `>1 MILLION` USERS IN LOW- AND MIDDLE-INCOME COUNTRIES | `GOOGLE DEEPMIND` | #14 |
| 6.03 | `9 IN 10` PASS THE FIRST TEST | `JAYATUNGA ET AL. · DRUG DISCOVERY TODAY 2024` | #15 |
| 6.04 | NO BETTER IN TEST 2 | wie 6.03, `SMALL SAMPLE` | #16 |
| 7.02 | Zitat wortgenau mit „I think“ | `GLP-1 RESEARCHER · ANTHROPIC EVENT · JUNE 2026` (Name nur nach Gegenhören) | #17 |
| 7.04 | END 2025 → `END 2026` | `REUTERS · JAN 2026` | #18 (Recheck vor Upload) |
| 8.01 | `~75 YEARS` | `ESSAY · 2024` | #19 |
| 8.02 | CLINICAL EVIDENCE: NONE · A BET, NOT A FORECAST | – | #19 |
| 9.01 | `3.5 MILLION` CASES A YEAR · 1986 | `THE CARTER CENTER` | #20 |
| 9.02 | `10` CASES · 2025 | `THE CARTER CENTER` | #21 (Menschen, vorläufig) |
| 10.02 | CURABLE SINCE `2015` | `WHO · 2026` | #24 |
| 10.03 | `1 IN 5` TREATED SINCE 2015 | `WHO GLOBAL HEPATITIS REPORT 2026` | #25 |
| 11.05 | TWICE A YEAR · Sambia, Kenia, Nigeria, Südafrika | `LENACAPAVIR · CHAI 2026` | #26 (Südafrika seit **Juni** 2026) |
| 12.01 | `$40` PER PERSON, PER YEAR | `FROM 2027 · REUTERS 2025` | #27 |
| 12.03 | MORE THAN A YEAR | – | #29 |

Im Bild immer „artificial intelligence“, nie „AI“. Eine Grafik = eine Aussage, höchstens eine Zahl und ≤ 6 Wörter plus Quelle.
