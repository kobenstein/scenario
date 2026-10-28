# Film 13 · „Superintelligence Promised Us Free Time. Will We Get It?“ · Shotliste v1 (bindend für die Builder)

Stand 2026-10-28 (Lead Bild). Text `film-zeit/vo-v6.txt` (s02, s10, s12, s18, s20, s23 neu vertont), Timing `film-zeit/audio/timing.json`; nach dem VO-Ende folgt ein Endscreen von höchstens 15 s, der sich weiter bewegt. Alle Zeiten unten sind aus `timing.json` berechnet; im Code wird nur über Wörter geankert. Welt, Look, Kit und Budgets: `MOTION.md` (zuerst lesen).
**Quelle dieser Datei:** `tools/shots13.py` (Shots mit Wort-Ankern; Zeiten und Explainer-Anteil werden aus `timing.json` berechnet). Änderungen an den Shots dort machen und mit `python3 tools/shots13.py --md docs/shots.md` neu schreiben; die Tabellen zwischen den Markern nie von Hand ändern.

## §1 Lesehilfe
- **ID** = Chunk.Nummer. **Zeit** = von–bis in Filmsekunden; ein Shot beginnt mit seinem ersten VO-Wort und läuft bis zum nächsten; Pausen gehören dem Shot davor (die Bewegung läuft weiter).
- **Ebene:** `[SZENE]` = Welt (Ort, Figuren, eine Lichtform); `[EXPL]` = Explainer (Zahl, Kurve, Karte, Zeitleiste aus Licht auf Nachtblau, Zahlen in Creme); `[SZENE→EXPL]` / `[EXPL→SZENE]` = der Shot enthält die Verwandlung (zählt halb).
- **Anker** = Akzentwort `@` Sekunde. Im Code immer über das Wort ankern (`T.S('s07', 'sand slipped')`), nie über die Sekunde.
- **Bewegung** = höchstens 2 Hauptbewegungen, die Kamera zählt mit. Umgebungsleben (Atmen, Sterne, Staub, Korn, Drift) ist immer da und zählt nicht.
- **Übergang → Träger:** Art · `Träger A → B` · Bildposition · Richtung. Arten: **Plansequenz** (gleiche Einstellung, neues Motiv wächst aus Vorhandenem), **Fahrt** (Kamera folgt dem Träger), **Verwandlung** (Form wird Form), **Flug** (in eine Fläche hinein), **Rückzug**, **Match-Fahrt** (gleiche Form an gleicher Bildstelle). **Keine Blenden, kein Fade über Schwarz, kein Slide, kein Wischer, kein harter Schnitt ohne reimenden Träger.**
- **Licht/Held** (im Chunk-Kopf) = die eine warme Lichtform des Bildes; sie ist immer das Hellste.
- ★ = der eine Wow-Shot pro Chunk (erstes Standbild an Jakob, bevor der Rest des Chunks gebaut wird).
- Ruhe-Regeln (gelten für jeden Shot): Halten 1,5–3 s nach jedem Akzent · kein Stillstand > 2 s · max. 1–2 bewegte Hauptelemente · Zahlen und Zeilen stehen ≥ 1,5 s ruhig, bevor sich etwas anderes bewegt · ≤ ~1 harter Weltwechsel pro Minute (MOTION.md §6).

## §2 Chunks und Shots
<!-- SHOTS:BEGIN -->
| Chunk | Zeit (s) | Dauer | Inhalt | Licht / Held | Shots | [EXPL] |
|---|---|---|---|---|---|---|
| c01 | 0,00–33,44 | 33.4 | Hook I · das Versprechen, die alten Versprechen | Nacht · Held: die Sanduhr aus Licht (Sand = Gold), gereicht von der Lichthand | 11 | 50% |
| c02 | 33,44–63,48 | 30.0 | Hook II · Berkeley, „a lie?“ → „No.“, das Arbeitsjahr | Nacht · Held: der Ring (Maschine, kühl-creme) → die Sanduhr · Explainer-Licht | 8 | 78% |
| c03 | 63,48–95,68 | 32.2 | Wasser: 200 Mio. Stunden, die Leitung kommt, bei dir null | Nacht, Mond tief · Held: der Mond über dem Weg → der Wasserhahn (Gold-Sand) → Küchenfenster | 7 | 32% |
| c04 | 95,68–144,20 | 48.5 | Die Stunde wandert: Waschmaschine, Cowan, E-Mail, Microsoft | Nacht · Held: der Sandfaden und die Explainer-Lichter | 10 | 96% |
| c05 | 144,20–178,00 | 33.8 | Linder, der Sand rinnt vorbei, „this machine is different“ | Nacht · Held: der Stundenblock → die Sanduhr in der Lichthand | 7 | 47% |
| c06 | 178,00–236,70 | 58.7 | Not so far: Berkeley, Jongleur, Hassabis | Nacht · Held: Sanduhr mit Riss → Explainer → das eine späte Fenster | 9 | 37% |
| c07 | 236,70–294,02 | 57.3 | Battle Creek 1930: Kellogg, 8 → 6, Hunnicutt, was die Stadt tat | Winternacht → Abend · Held: die Fabrikuhr (8 → 6), dann die Stadt als Lichtkarte | 9 | 72% |
| c08 | 294,02–351,48 | 57.5 | Der Sommerabend (Herzstück), dann: wie es verrutschte | Sommerabend, tiefe Sonne (Held) → Sonnenuntergang → Nachtschicht | 10 | 62% |
| c09 | 351,48–399,24 | 47.8 | Kein Bösewicht, Mission, die Zeit, die wir behielten | Nacht · Held: die Sanduhr auf der Werkbank → Blätter aus Licht (Regeln) | 8 | 53% |
| c10 | 399,24–448,88 | 49.6 | Firmen: Vier-Tage-Woche, Zeit-Dividende, Krankenhaus | Nacht hellt auf (Vor-Dämmerung) · Held: das Blatt und die Explainer | 7 | 84% |
| c11 | 448,88–495,96 | 47.1 | Wir alle: Recht auf Abschalten, Keynes, wer entscheidet | Vor-Dämmerung · Held: der Abendtisch (Lampe) → Karte → Waage aus Licht | 6 | 72% |
| c12 | 495,96–534,00 | 38.0 | Du: Zeit kaufen, 2 von 100, die erste Stunde schützen | Vor-Dämmerung · Held: die kleine Sanduhr in deinen Händen | 5 | 60% |
| c13 | 534,00–582,52 | 48.5 | Wann die Regeln kamen, diesmal vorher, wir brauchen es | erstes Morgenlicht · Held: die Zeitleiste → die Lichthand vom Anfang | 7 | 84% |
| c14 | 582,52–625,48 | 43.0 | Die Stunde kommt an, Schluss, Endscreen | goldener Abend, tiefe Sonne (Echo Battle Creek) · Held: die Sonne | 8 | 0% |

**Explainer-Anteil (gemessen, Laufzeit 0–609,58 s):** 62% (mit Endscreen 60%); gemischte Shots [SZENE→EXPL] zählen halb. Ziel 60–70 %.

### c01 · Hook I · das Versprechen, die alten Versprechen · 0,00–33,44 (33 s) · ★ 1.01 · [EXPL] 50%
Licht/Held: Nacht · Held: die Sanduhr aus Licht (Sand = Gold), gereicht von der Lichthand

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| **1.01 ★** | [SZENE] | 0,00–4,80 | **Superintelligence** @1,64 · **free** @3,56 | **Thumbnail-Motiv.** Nachtblau, Sterne. Oben rechts eine riesige Hand aus Licht (die Maschine), zwischen Daumen und Fingern eine Sanduhr aus Licht: oberer Kolben voll Goldsand. Unten links auf einer Felskante du (gelber Regenmantel, Kapuze), klein, schaust hinauf. Auf **free** beginnt der Sand zu rinnen: ein feiner Goldfaden fällt in den unteren Kolben. | ① die Hand senkt die Sanduhr ② langsamer Push | Plansequenz |
| 1.02 | [SZENE] | 4,80–6,96 | **given** @5,92 | Die Hand setzt die Sanduhr vor dir auf die Kante: Kontakt auf **given**, ein Hauch Lichtstaub, 80 ms später glüht dein Mantelrand auf. Die Hand öffnet sich und zieht sich etwas zurück, sie bleibt im Bild. | ① Hand setzt ab, öffnet sich ② Halten mit Drift | Fahrt · Träger Sandfaden → steigt als Lichtlinie aus dem oberen Kolben · Mitte · nach oben (Neigung) |
| 1.03 | [EXPL] | 6,96–12,68 | **Gates** @7,12 · **purpose** @9,24 | **Zitatkarte aus Licht** im Nachthimmel über der Sanduhr (kein Rahmen): die Lichtlinie läuft als Grundlinie und lässt zuerst die Quelle stehen, dann Zeile für Zeile das Zitat (Masken-Wipe von der Grundlinie): „The purpose of life is not just to do jobs. So if you eventually get a society where you only have to work three days a week or something, that's probably okay.“ · `— Bill Gates, “What Now?” with Trevor Noah, 2023`. Unten am Bildrand glimmt die Sanduhr weiter. | ① die Schrift (Zeile für Zeile) ② Neigung endet in Drift | Plansequenz |
| 1.04 | [EXPL] | 12,68–17,80 | **three-day** @15,32 · **Probably** @16,68 | Das Zitat steht ruhig (lesen). Auf **three-day** werden die Worte „three days a week“ warm (Gold statt Creme), der Rest bleibt Creme. | ① die drei Worte glühen | Verwandlung · Träger „three days a week“ → Goldsand · Mitte · nach unten |
| 1.05 | [EXPL→SZENE] | 17,80–19,40 | **More** @17,80 · **life** @9,64 | Die übrigen Zeilen sinken unter ihre Grundlinie weg; „three days a week“ zerfällt in Goldsand und rieselt nach unten. Die Kamera neigt sich mit dem Sand zurück zur Sanduhr: der Sand fällt in den oberen Kolben, der voller wird (more of your life). | ① Sand fällt ② Neigung nach unten | Plansequenz |
| 1.06 | [SZENE] | 19,40–21,90 | **deal** @19,84 | Rückzug zum Maßstab: du, die große Sanduhr voller Gold vor dir auf der Kante, darüber die offene Lichthand (das Angebot). Auf **deal** dreht die Hand die Handfläche nach oben. | ① Rückzug ② Hand öffnet sich | Push in den unteren Kolben (ab „But“) · Träger runder Glaskolben · Mitte · nach vorn |
| 1.07 | [SZENE→EXPL] | 21,90–24,38 | **before** @23,58 | Push auf den runden unteren Kolben, bis er groß im Bild steht; der Sand darin wirbelt. | ① Push ② Sand wirbelt | Verwandlung · Träger Kreis → Bullauge · Mitte · – |
| 1.08 | [EXPL] | 24,38–26,18 | **washing** @24,62 | Der Kolben wird das **Bullauge einer Waschmaschine aus Licht**; die Trommel dreht, der Sand darin ist Wäsche. | ① Trommel dreht | Verwandlung · Träger Bullauge klappt zu → Briefumschlag · Mitte · – |
| 1.09 | [EXPL] | 26,18–27,26 | **Email** @26,18 | Das Bullauge faltet sich zu einem **Briefumschlag aus Licht**; er fliegt ein Stück nach rechts unten. | ① Faltung ② Flug | Verwandlung · Träger Umschlag → Bildschirm · Mitte rechts · nach unten |
| 1.10 | [EXPL→SZENE] | 27,26–29,44 | **pocket** @28,01 | Der Umschlag wird das Leuchten eines **Handys**; Rückzug: das Handy steckt in deiner Manteltasche und leuchtet durch den Stoff. | ① Rückzug | Rückzug · Träger Handylicht · unten · nach hinten |
| 1.11 | [SZENE] | 29,44–33,44 | **busier** @31,38 | Weit: du stehst still auf einer nächtlichen Straße; um dich hasten schlichte Silhouetten (Indigo) mit kühlem Handylicht vorbei. Die kleine Sanduhr in deinen Händen ist das einzige warme Licht. Auf **busier** ziehen die Silhouetten schneller (Lichtschlieren), du bleibst. | ① die Menge hastet ② langsamer Push | Kranfahrt nach oben · Träger die Handylichter steigen auf und werden ein Ring · oben Mitte · nach oben |

### c02 · Hook II · Berkeley, „a lie?“ → „No.“, das Arbeitsjahr · 33,44–63,48 (30 s) · ★ 2.05 · [EXPL] 78%
Licht/Held: Nacht · Held: der Ring (Maschine, kühl-creme) → die Sanduhr · Explainer-Licht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 2.01 | [EXPL] | 33,44–37,76 | **artificial** @33,84 · **already** @36,48 | Die kühlen Handylichter steigen auf und schließen sich zu **einem Ring aus Licht** (die Maschine, kühl-creme) über der Stadt aus Lichtpunkten. | ① Lichter → Ring ② Kran | Plansequenz · Träger Ring · Mitte · – |
| 2.02 | [EXPL] | 37,76–41,52 | **company** @39,12 · **year** @40,72 | Unter dem Ring ein Bürohaus aus Lichtfenstern (eine Firma). Um den Ring füllen sich 8 von 12 Monatsbögen: `8 MONTHS INSIDE ONE COMPANY` · `UC BERKELEY · 2025`. Auf **use it** zeigt ein Fenster ein Chatfeld mit blinkendem Cursor. | ① Monatsbögen ② Cursor | Plansequenz |
| 2.03 | [EXPL] | 41,52–44,80 | **no time** @43,60 | Zähler aus Licht über dem Haus: `TIME FREED UP` rollt hoch … und auf **no time** zurück auf `0` (kühl). | ① Zähler | Fahrt hinab ins Fenster · Träger Cursor → Bildschirm am Mittagstisch · Mitte · nach vorn |
| 2.04 | [SZENE] | 44,80–47,84 | **prompts** @45,76 · **lunch** @46,52 | Innen, ein Mittagstisch unter einer Lampe (Held): eine Silhouette tippt am Laptop, daneben ein halbes Sandwich und die kleine Sanduhr. Die Wanduhr zeigt 12. | ① Hände tippen ② Sand rinnt | Rückzug · Träger Sanduhr · Mitte · nach hinten |
| **2.05 ★** | [SZENE] | 47,84–51,38 | **lie** @50,16 | ★ Rückzug aus dem Fenster in die große Nacht: über der Stadt hängt die riesige Sanduhr, um sie die drei Formen von vorhin (Bullauge, Umschlag, Handy) als kühle Konturen. Auf **lie?** bleibt der fallende Sand mitten im Fall stehen (≤ 1,2 s, Kamera driftet). | ① Rückzug ② Sand hält an | Plansequenz, **ohne Pause** in 2.06 |
| 2.06 | [EXPL] | 51,38–53,94 | **No** @51,38 · **true** @53,22 | Auf **No.** fällt der Sand weiter; auf **true** landet er im unteren Kolben (Akzent, kleiner Lichtstoß). | ① Sand fällt | Verwandlung · Träger Sandhaufen → Balken · unten · nach rechts |
| 2.07 | [EXPL] | 53,94–60,58 | **Germany** @54,10 · **half** @57,14 | Der Sandhaufen streckt sich zu einem langen **Balken aus Licht**: `GERMANY · HOURS WORKED PER YEAR` · `1870: ~3,300`. Auf **half** zerfällt mehr als die Hälfte des Balkens zu Sand und rieselt ab: `TODAY: ~1,350`. | ① Balken wächst ② Hälfte zerfällt | Plansequenz |
| 2.08 | [EXPL] | 60,58–63,48 | **similar** @61,78 | Darunter wachsen vier weitere Länderbalken (ohne Namen, nur Linien), zerfallen nacheinander genauso (Kaskade 80 ms). Quelle `OUR WORLD IN DATA · HUBERMAN & MINNS`. | ① Kaskade | Verwandlung · Träger Balken → Horizontlinie → staubiger Weg · Mitte · nach links |

### c03 · Wasser: 200 Mio. Stunden, die Leitung kommt, bei dir null · 63,48–95,68 (32 s) · ★ 3.04 · [EXPL] 32%
Licht/Held: Nacht, Mond tief · Held: der Mond über dem Weg → der Wasserhahn (Gold-Sand) → Küchenfenster

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 3.01 | [EXPL→SZENE] | 63,48–67,00 | **simplest** @65,56 | Die Balken sinken zu einer Linie, die Linie wird der Horizont einer weiten Ebene; der tiefe Mond geht darüber auf (Held). | ① Linie → Horizont ② Mond steigt | Plansequenz |
| 3.02 | [SZENE] | 67,00–70,16 | **tap** @67,88 · **girls** @69,00 | Ein langer staubiger Weg zum Horizont; ein Mädchen (Indigo-Silhouette, kein Gelb) trägt einen Wasserkanister auf dem Kopf, geht langsam. Weit hinter ihr weitere kleine Gestalten. | ① sie geht ② seitliche Fahrt | Plansequenz |
| 3.03 | [EXPL] | 70,16–74,12 | **million** @70,92 · **water** @73,24 | Die Fußspuren auf dem Weg werden Lichtpunkte, die sich zu einem Feld zählen: `200 MILLION HOURS` · `EVERY DAY · UNICEF 2016`. | ① Punkte zählen sich | Verwandlung · Träger Weglinie → Wasserleitung aus Licht · unten · nach rechts |
| **3.04 ★** | [SZENE] | 74,12–78,81 | **pipe** @74,44 · **school** @76,68 · **work** @77,88 | ★ Eine Leitung aus Licht läuft den Weg entlang bis zu ihr, ein Hahn; aus dem Hahn rinnt **Goldsand** und landet zum ersten Mal in einer offenen Hand (ihrer). Auf **school** trägt sie eine Schultasche und geht zu einem erleuchteten Schulfenster; auf **work** leuchtet weiter hinten ein Werkstattfenster. | ① Leitung läuft ② sie geht | Match-Fahrt · Träger Hahn → dein Küchenhahn (gleiche Bildstelle) · Mitte · – |
| 3.05 | [EXPL] | 78,81–83,48 | **zero** @80,76 | Dein Küchenfenster bei Nacht, du füllst ein Glas am Hahn, ohne hinzusehen. Neben dem Hahn steht in Creme `0 HOURS`. | ① Wasser läuft | Plansequenz |
| 3.06 | [SZENE] | 83,48–90,20 | **arrives** @74,76 · **missing** @89,24 | Nah am Hahn: der letzte Tropfen fällt und wird ein Sandkorn in der kleinen Sanduhr auf dem Fensterbrett. Ruhiges Halten. | ① Tropfen → Korn | Plansequenz |
| 3.07 | [SZENE] | 90,20–95,68 | **feel** @93,04 | Du am Fenster schaust auf die Sanduhr; draußen ist jedes Fenster der Stadt noch hell (alle arbeiten noch). | ① langsamer Rückzug | Plansequenz · Träger Sandfaden in der Sanduhr · Mitte · – |

### c04 · Die Stunde wandert: Waschmaschine, Cowan, E-Mail, Microsoft · 95,68–144,20 (49 s) · ★ 4.06 · [EXPL] 96%
Licht/Held: Nacht · Held: der Sandfaden und die Explainer-Lichter

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 4.01 | [SZENE→EXPL] | 95,68–99,68 | **vanish** @97,04 · **else** @98,88 | Die Sanduhr nah: auf **else** biegt der Sandfaden mitten im Fall zur Seite ab und läuft aus dem Glas nach rechts ins Dunkel. Die Kamera folgt ihm. | ① der Faden biegt ab ② Schwenk | Fahrt · Träger Sandfaden · Mitte → rechts · nach rechts |
| 4.02 | [EXPL] | 99,68–103,44 | **washing** @100,00 · **easier** @102,56 | Der Faden fällt in eine **Waschmaschine aus Licht** (Bullauge wie 1.08). Daneben ein Balken `HOURS OF LAUNDRY`, der auf **easier** schrumpft. | ① Balken schrumpft | Plansequenz |
| 4.03 | [EXPL] | 103,44–108,00 | **often** @104,32 · **clothes** @105,44 · **cleaner** @107,04 | Drei Takte in einer Einstellung: Waschgänge als Striche (mehr), ein Stapel Hemden aus Licht (höher), ein Funkeln (sauberer). Der Balken wächst wieder. | ① Striche/Stapel ② Balken wächst | Plansequenz |
| 4.04 | [EXPL] | 108,00–113,76 | **Cowan** @109,60 · **rose** @111,52 | Eine Treppenlinie: jede neue Maschine (Bügeleisen, Waschmaschine, Staubsauger als Licht-Icons) hebt die Linie „Standard“ eine Stufe. `RUTH SCHWARTZ COWAN · MORE WORK FOR MOTHER · 1983`. | ① Linie steigt Stufe für Stufe | Plansequenz |
| 4.05 | [EXPL] | 113,76–120,40 | **shrink** @117,04 · **grew** @119,52 | Vier Balken: `COOKING` `CLEANING` schrumpfen, ihr Sand fließt sichtbar hinüber in `SHOPPING` `CHILDCARE`, die wachsen. `GERSHUNY & HARMS 2016`. | ① Sand fließt hinüber | Plansequenz |
| **4.06 ★** | [EXPL] | 120,40–124,02 | **disappear** @121,20 · **moved** @122,40 | ★ Rückzug: die vier Balken liegen im unteren Kolben der großen Sanduhr; der Sand verschiebt sich von einer Seite auf die andere, die Menge bleibt gleich. `MOVED`. | ① Rückzug ② Sand verschiebt sich | Verwandlung · Träger Sandfaden → Straße mit Tagesstrichen · Mitte · nach rechts |
| 4.07 | [EXPL] | 124,02–129,94 | **email** @124,90 · **days** @127,14 · **second** @128,98 | Eine Linie mit drei Tagesstrichen: ein Brief aus Licht wandert langsam über alle drei Tage (`3 DAYS`). Auf **second** schießt ein Umschlag dieselbe Strecke in einem Augenblick (`1 SECOND`), Tempo-Kontrast. | ① Brief langsam ② Umschlag schnell | Plansequenz |
| 4.08 | [EXPL] | 129,94–133,94 | **less** @131,06 · **more** @132,98 | Der eine Umschlag vervielfältigt sich: der Posteingang stapelt sich als Turm aus Licht nach oben. | ① Turm wächst | Verwandlung · Träger Turm → Zifferblatt · Mitte · – |
| 4.09 | [EXPL] | 133,94–139,54 | **interrupted** @136,82 · **two minutes** @138,18 | Ein Zifferblatt einer Stunde aus Licht: alle 2 Minuten ein Ping-Strich (30 Striche leuchten nacheinander auf). `EVERY 2 MINUTES` · `BUSIEST USERS · MICROSOFT WORK TREND INDEX 2025`. | ① Striche | Plansequenz |
| 4.10 | [EXPL] | 139,54–144,20 | **infinite** @141,86 | Der Zeiger hört nicht auf; das Zifferblatt zieht sich zu einer liegenden Acht aus Licht, auf der der Zeiger weiterläuft. `THE INFINITE WORKDAY`. | ① Kreis → Acht | Verwandlung · Träger Acht → Glasblock „eine Stunde“ · Mitte · – |

### c05 · Linder, der Sand rinnt vorbei, „this machine is different“ · 144,20–178,00 (34 s) · ★ 5.05 · [EXPL] 47%
Licht/Held: Nacht · Held: der Stundenblock → die Sanduhr in der Lichthand

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 5.01 | [EXPL] | 144,20–149,40 | **seventy** @145,08 · **Linder** @147,32 | Die Acht faltet sich zu einem flachen, gerundeten Gefäß aus Licht: **eine Stunde**. `STAFFAN LINDER · 1970` · `THE HARRIED LEISURE CLASS`. | ① Faltung | Plansequenz |
| 5.02 | [EXPL] | 149,40–153,72 | **valuable** @149,80 · **cram** @152,36 | Neben dem Gefäß steigt eine Wertlinie; Icons (Termin, Einkauf, Sporttasche) werden hineingestopft, das Gefäß beult. | ① Linie ② Icons hinein | Plansequenz |
| 5.03 | [EXPL] | 153,72–156,60 | **rushed** @155,64 | Zuletzt ein Liegestuhl mit Handy: auch die Freizeit wird hineingestopft. | ① Liegestuhl | Plansequenz |
| 5.04 | [EXPL] | 156,60–160,20 | **easier** @157,24 · **more of it** @159,04 | Ein Kreislauf aus Licht: `EASIER → MORE` (zwei Knoten, der Pfeil schließt den Kreis). | ① Pfeil läuft | Verwandlung · Träger Kreislauf → Riss im Glas · Mitte · – |
| **5.05 ★** | [SZENE] | 160,20–166,92 | **handed** @161,67 · **sand slipped** @164,32 · **reached** @165,88 | ★ Die Lichthand reicht dir die Sanduhr; ein Haarriss im Glas, der Sandfaden tritt aus und biegt in einem langen Bogen am Rand deiner erhobenen Hände vorbei ins Dunkel. | ① Bogen des Sandes ② deine Hände | Plansequenz |
| 5.06 | [SZENE] | 166,92–172,92 | **different** @168,36 · **do the work** @171,64 | Die Lichthand wird größer und heller; sie setzt eine neue Sanduhr ohne Riss ab, heller als die erste. | ① Hand setzt ab | Plansequenz |
| 5.07 | [SZENE] | 172,92–178,00 | **reaches** @174,48 · **Right** @175,72 | Du hebst die Hände; die neue Sanduhr schwebt knapp darüber. Halten, hoffnungsvoll. Auf **Right?** stockt der Sand kurz. | ① Hände heben | Plansequenz |

### c06 · Not so far: Berkeley, Jongleur, Hassabis · 178,00–236,70 (59 s) · ★ 6.07 · [EXPL] 37%
Licht/Held: Nacht · Held: Sanduhr mit Riss → Explainer → das eine späte Fenster

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 6.01 | [SZENE] | 178,00–179,76 | **far** @178,64 | Auf **far** läuft doch ein Haarriss über das neue Glas (Akzent, 3 Frames). | ① Riss | Fahrt · Träger Ring über der Sanduhr → Ring über dem Bürohaus · oben · nach rechts |
| 6.02 | [EXPL] | 179,76–183,92 | **Berkeley** @182,88 | Das Bürohaus aus Licht mit dem Ring von 2.02 kehrt zurück. `UC BERKELEY · HARVARD BUSINESS REVIEW · 2026`. | ① Fahrt | Plansequenz |
| 6.03 | [EXPL] | 183,92–192,80 | **plates** @187,12 · **filled** @188,32 · **roles** @191,92 | Ein Schreibtisch von oben mit Aufgabenkarten aus Licht: der Ring hebt Karten weg; sofort fallen neue hinein, einige kühler getönt (fremde Rollen). | ① Karten weg ② neue Karten | Plansequenz |
| 6.04 | [EXPL] | 192,80–194,96 | **evenings** @194,00 | Tagesleiste 9–17 Uhr; der Arbeitsbalken kriecht über 17 Uhr hinaus in den dunklen Abend bis 22 Uhr. | ① Balken kriecht | Verwandlung · Träger Balkenende → Jonglierball · rechts · nach oben |
| 6.05 | [SZENE] | 194,96–201,44 | **several** @195,84 · **juggler** @199,44 · **ball** @200,80 | Eine Silhouette jongliert drei kleine Ringe aus Licht (Assistenten); auf **one more ball** kommt ein vierter dazu. | ① Jonglage | Verwandlung · Träger Ringe → Stundengefäß · oben · – |
| 6.06 | [EXPL] | 201,44–208,10 | **worth** @205,76 · **ever** @204,96 | Das Stundengefäß von 5.01 kehrt zurück, heller; die Wertlinie steigt steil, das Gefäß füllt sich schneller. | ① Linie ② Füllung | Fahrt · Träger Gefäß → Fenster eines Hauses · Mitte · nach vorn |
| **6.07 ★** | [SZENE] | 208,10–220,55 | **top** @209,70 · **dinner** @215,10 · **night** @219,54 | ★ Ein Haus in weiter Nacht, ein warmes Fenster: drinnen ein Esstisch mit Familie (Silhouetten). Auf **then starting** wird es dunkel, nur ein kühles Laptop-Licht bleibt; die Kamera hält das eine späte Fenster, Mond zieht. `DEMIS HASSABIS · GOOGLE DEEPMIND`. | ① Licht wechselt ② Mond | Kran nach oben · Träger das Fenster wird klein · Mitte · nach oben |
| 6.08 | [SZENE] | 220,55–230,34 | **human** @222,98 · **time machine** @227,02 · **either** @229,38 | Kran: das Haus wird winzig, daneben am Horizont die riesige Lichthand mit der Sanduhr (die Zeitmaschine). Maßstab. | ① Kran | Plansequenz |
| 6.09 | [SZENE] | 230,34–236,70 | **us** @231,46 · **free time** @234,02 | Du vor der großen Sanduhr: im Glas spiegelt sich dein gelber Mantel. Push ins Glas. | ① Push | Flug ins Glas · Träger Spiegelung → Luftbild der Stadt · Mitte · nach vorn |

### c07 · Battle Creek 1930: Kellogg, 8 → 6, Hunnicutt, was die Stadt tat · 236,70–294,02 (57 s) · ★ 7.04 · [EXPL] 72%
Licht/Held: Winternacht → Abend · Held: die Fabrikuhr (8 → 6), dann die Stadt als Lichtkarte

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 7.01 | [SZENE] | 236,70–241,78 | **Michigan** @239,10 · **Battle** @240,14 | Aus dem Glas: Luftbild einer kleinen Stadt im Winter an einem Fluss, Fabrik mit Schornstein. `BATTLE CREEK · MICHIGAN`. | ① Abstieg | Plansequenz |
| 7.02 | [EXPL] | 241,78–246,78 | **thirty** @242,86 · **Depression** @244,22 | Der Jahresstempel rollt auf `1930`; eine Kurve aus Licht stürzt ab (`GREAT DEPRESSION`). | ① Ziffern ② Kurve | Verwandlung · Träger Kurve → Fabrikdach · Mitte · nach unten |
| 7.03 | [SZENE] | 246,78–251,90 | **Kellogg** @247,58 · **expects** @251,02 | Die Fabrikfront bei Nacht, über dem Tor die große Uhr (Held). Am Tor eine Silhouette mit Hut (Kellogg, Indigo). | ① Push auf die Uhr | Push in die Uhr · Träger Zifferblatt · oben Mitte · nach vorn |
| **7.04 ★** | [EXPL] | 251,90–258,74 | **eight** @254,14 · **six** @255,18 · **hire** @257,14 | ★ Das Zifferblatt wird ein Tagesring: der Arbeitsbogen schrumpft von 8 auf 6 Stunden, **zwei goldene Stundenscheiben** heben sich aus dem Ring. Auf **hire**: 3 Schichtbalken werden 4. `1 DEC 1930 · 8 → 6 HOURS`. | ① Bogen schrumpft ② Scheiben heben sich | Plansequenz |
| 7.05 | [EXPL] | 258,74–264,24 | **two extra** @260,54 · **day** @262,86 | Die zwei Scheiben schweben über der Stadt aus Lichtpunkten. | ① Scheiben schweben | Fahrt hinab · Träger Scheiben → Licht auf einer Veranda · Mitte · nach unten |
| 7.06 | [SZENE] | 264,24–270,24 | **Hunnicutt** @266,80 · **lived** @269,12 | Eine Veranda bei Nacht: ein alter Mensch und ein Zuhörer mit Tonbandgerät (kleines Licht). `BENJAMIN HUNNICUTT · KELLOGG'S SIX-HOUR DAY · 1996`. | ① Tonband dreht | Plansequenz |
| 7.07 | [EXPL] | 270,24–274,40 | **output** @271,96 · **life** @273,12 | Licht-Hälften: links ein kühler Stapel Kisten (`OUTPUT`) dimmt; rechts wächst warmes Gold (`LIFE`). | ① Hälften | Verwandlung · Träger Gold → Sand über der Stadtkarte · Mitte · nach unten |
| 7.08 | [EXPL] | 274,40–286,40 | **children** @276,16 · **neighbors** @277,76 · **library** @279,52 · **gardens** @281,60 · **sewed** @284,08 · **ice** @285,20 | Die Stadt als Karte aus Licht: der Goldsand fällt, und bei jedem Satz leuchtet ein Ort auf (Veranda, Zaun, Bibliothek, Garten, Einmachgläser, Eis-Kurbel), Takte in einer Einstellung. | ① Orte leuchten nacheinander | Plansequenz |
| 7.09 | [EXPL] | 286,40–294,02 | **ball** @287,64 · **fishing** @289,71 · **farm** @292,12 | Weiter: Ballfeld, Fluss mit Angelschnur, kleiner Hof leuchten auf. Am Horizont geht die Sonne als tiefe Scheibe auf (Abend). | ① Orte ② Sonne | Abstieg in die Karte · Träger die Karte wird die Stadt · Mitte · nach unten |

### c08 · Der Sommerabend (Herzstück), dann: wie es verrutschte · 294,02–351,48 (57 s) · ★ 8.01 · [EXPL] 62%
Licht/Held: Sommerabend, tiefe Sonne (Held) → Sonnenuntergang → Nachtschicht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| **8.01 ★** | [SZENE] | 294,02–303,22 | **summer** @294,34 · **light** @298,10 · **father** @299,30 · **kid** @302,26 | ★ **Das Herzstück.** Sommerabend, die tiefe Sonne (Held) am Horizont, lange Schatten. Vor dem Fabriktor: Vater und Kind (Silhouetten) gehen mit Angelrute zum Fluss. Eine durchgehende seitliche Fahrt nach rechts. | ① die beiden gehen ② Fahrt | Plansequenz (Fahrt läuft weiter) |
| 8.02 | [SZENE] | 303,22–306,82 | **cranking** @304,74 | Die Fahrt erreicht eine Veranda: jemand kurbelt die Eismaschine. | ① Kurbel | Plansequenz |
| 8.03 | [SZENE] | 306,82–310,46 | **starting** @308,90 | Weiter zum Ballfeld: der erste Wurf fliegt im Bogen durchs Abendlicht. | ① Ball fliegt | Kran nach oben |
| 8.04 | [SZENE] | 310,46–315,86 | **promise** @311,02 · **century** @314,42 | Kran: die ganze Stadt im Abendlicht; der Schatten des Fabrikschornsteins zieht über die Gärten. `1930`. | ① Kran | Fahrt · Träger Fabrikuhr · oben · nach vorn |
| 8.05 | [EXPL] | 315,86–321,14 | **six** @318,26 · **today** @311,86 | Die Fabrikuhr: Tagesring mit dem 6-h-Bogen; die Sonne sinkt hinter die Fabrik. | ① Sonne sinkt | Plansequenz |
| 8.06 | [EXPL] | 321,14–323,78 | **wanting** @322,58 | Ein Balken `WANTED IT` bleibt voll (warm). | ① Balken | Plansequenz |
| 8.07 | [EXPL] | 323,78–327,62 | **war** @324,50 · **eight** @326,42 | Die zwei Goldscheiben gleiten in den Ring zurück: wieder 8 h. `1943 · WAR`. | ① Scheiben zurück | Plansequenz |
| 8.08 | [EXPL] | 327,62–332,10 | **voted** @329,46 · **back** @326,02 | Erhobene Hände als Lichtstriche: die meisten heben sich. `1946 · MOST VOTE FOR 6 HOURS`. | ① Hände | Verwandlung · Träger Striche → Fensterreihen der Fabrik · Mitte · – |
| 8.09 | [EXPL] | 332,10–341,30 | **department** @332,98 · **one by one** @335,54 · **longer** @340,02 | Die Fabrikfront als Fensterreihen (Abteilungen): eine nach der anderen wechselt von warm (6 h) zu kühl (8 h); je eine Münze fällt daneben. | ① Fenster kippen | Plansequenz |
| 8.10 | [EXPL] | 341,30–351,48 | **eighty-five** @344,42 · **leave** @349,38 | Ein letztes warmes Fenster; die Zeitleiste läuft bis `1985`, das Fenster wird kühl. `THE LAST 530`. | ① Zeitleiste ② Fenster | Fahrt · Träger das Fenster → leere Werkbank · Mitte · nach vorn |

### c09 · Kein Bösewicht, Mission, die Zeit, die wir behielten · 351,48–399,24 (48 s) · ★ 9.03 · [EXPL] 53%
Licht/Held: Nacht · Held: die Sanduhr auf der Werkbank → Blätter aus Licht (Regeln)

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 9.01 | [SZENE] | 351,48–359,08 | **villain** @355,00 · **away** @358,20 | Eine leere Werkbank im dunklen Fabriksaal, eine Lampe (Held). Die Sanduhr steht allein darauf, keine Hand in der Nähe. | ① langsamer Push | Plansequenz |
| 9.02 | [SZENE] | 359,08–362,92 | **vote** @360,36 · **shift** @361,40 | Der Sand rinnt Korn für Korn; jedes Korn ein winziger Strich. | ① Körner | Plansequenz |
| **9.03 ★** | [SZENE] | 362,92–365,32 | **keep** @364,28 | ★ Das letzte Korn fällt durch einen Spalt in der Werkbank ins Dunkel; niemand fängt es. Halten 2 s. | ① das Korn | Plansequenz |
| 9.04 | [SZENE] | 365,32–373,76 | **everyone** @368,36 · **subscribe** @371,84 | Du trittst an die Bank und hältst die Hand unter den Faden; um dich in der Halle viele kleine Lichter (alle). | ① deine Hand | Verwandlung · Träger Lichter → Wochenleiste · Mitte · nach oben |
| 9.05 | [EXPL] | 373,76–378,72 | **weekend** @376,16 · **eight-hour** @377,28 | Wochenleiste aus Licht: Samstag und Sonntag glühen gold; ein Tagesring mit 8-h-Bogen. | ① Tage ② Bogen | Plansequenz |
| 9.06 | [EXPL] | 378,72–389,68 | **decided** @382,64 · **law** @383,92 · **contract** @384,80 · **Ford** @387,28 | An jede behaltene Zeit heftet sich ein unterschriebenes Blatt aus Licht: Gesetz, Vertrag, Aushang. `HENRY FORD · FIVE-DAY WEEK · 1926`. | ① Blätter | Plansequenz |
| 9.07 | [EXPL] | 389,68–393,36 | **slipped** @390,28 · **down** @392,60 | Daneben Waschmaschine, Posteingang, Laptop (Icons): kein Blatt daran, ihr Sand rinnt ab. | ① Sand rinnt | Plansequenz |
| 9.08 | [EXPL] | 393,36–399,24 | **decision** @394,48 · **superintelligence** @396,00 | Ein leeres Blatt aus Licht liegt neben der neuen Sanduhr; ein Stift aus Licht kommt ins Bild. | ① Stift | Plansequenz → c10 |

### c10 · Firmen: Vier-Tage-Woche, Zeit-Dividende, Krankenhaus · 399,24–448,88 (50 s) · ★ 10.04 · [EXPL] 84%
Licht/Held: Nacht hellt auf (Vor-Dämmerung) · Held: das Blatt und die Explainer

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 10.01 | [EXPL] | 399,24–401,24 | **work** @400,36 | Der Stift zieht die erste Zeile auf das Blatt; die Zeile läuft hinaus und wird eine Landkarte. | ① Zeile | Verwandlung · Träger Zeile → Küstenlinie Großbritanniens · Mitte · nach rechts |
| 10.02 | [EXPL] | 401,24–406,12 | **dozens** @402,44 · **four-day** @404,76 | Großbritannien als Lichtkarte, 61 kleine Bürolichter. `UK PILOT · 61 COMPANIES · 2022`. | ① Lichter gehen an | Plansequenz |
| 10.03 | [EXPL] | 406,12–412,60 | **nine in ten** @407,56 · **half** @410,36 · **permanent** @411,40 | 54 von 61 bleiben an (`~9 IN 10`), 31 werden gold (`~HALF PERMANENT`). `AUTONOMY 2024`. | ① Lichter | Fahrt · Träger die Karte sinkt → Maschine aus Licht · Mitte · nach oben |
| **10.04 ★** | [EXPL] | 412,60–426,12 | **machines** @416,52 · **hours** @421,72 · **profit** @422,84 · **dividend** @424,92 | ★ Die Lichthand arbeitet; was herauskommt, teilt sich in zwei Ströme: Münzen nach links, Sand nach rechts, und der Sand fließt in die Hände kleiner Figuren (du darunter). `TIME DIVIDEND`. | ① Strom teilt sich ② Sand in die Hände | Plansequenz |
| 10.05 | [EXPL] | 426,12–438,54 | **proposal** @426,64 · **nothing** @432,12 · **new time** @436,28 | `PROPOSAL` · Die Münzen, die schon auf dem Tisch liegen, bleiben unberührt; geteilt wird nur der neue Strom. | ① neuer Strom | Fahrt · Träger Sandstrom → Lichtstreifen eines Flurs · rechts · nach rechts |
| 10.06 | [SZENE] | 438,54–444,38 | **job** @439,74 · **hospital** @441,58 · **Fridays** @443,18 | Ein Krankenhausflur bei Nacht, eine Pflegekraft (Silhouette) geht an hellen Türen vorbei. | ① sie geht | Plansequenz |
| 10.07 | [SZENE→EXPL] | 444,38–448,88 | **perfect** @446,06 · **normal** @447,26 | Das Flurlicht fällt aufs Blatt; der Stift schreibt die zweite Zeile. | ① Zeile | Fahrt · Träger Blatt → Tischtuch am Abendtisch · Mitte · nach unten |

### c11 · Wir alle: Recht auf Abschalten, Keynes, wer entscheidet · 448,88–495,96 (47 s) · ★ 11.03 · [EXPL] 72%
Licht/Held: Vor-Dämmerung · Held: der Abendtisch (Lampe) → Karte → Waage aus Licht

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 11.01 | [SZENE] | 448,88–454,64 | **France** @448,88 · **disconnect** @450,72 · **answer** @453,68 | Ein Abendtisch unter einer Lampe (Held), Silhouetten und du. Ein Handy leuchtet mit einer Arbeitsnachricht und dreht sich von selbst um. | ① Handy ② Lampe atmet | Kran nach oben · Träger Handylicht → Punkt auf der Karte (Frankreich) · Mitte · nach oben |
| 11.02 | [EXPL] | 454,64–460,60 | **Belgium** @454,64 · **Australia** @455,28 · **Ireland** @458,40 | Karte aus Licht: Frankreich (`2017`), dann Belgien, Australien, dann Spanien, Portugal, Irland. Namen in Versalien. | ① Länder leuchten | Fahrt hinab · Träger Kartenpunkt → Lampe am Tisch · Mitte · nach unten |
| **11.03 ★** | [SZENE] | 460,60–468,18 | **shift** @461,52 · **favor** @463,84 · **yours** @466,48 | ★ Zurück am Tisch: der Abend geht weiter, ein Kind klettert auf einen Schoß, jemand schenkt ein. Rückzug durchs Fenster: das Haus in der Nacht, ein warmes Fenster. | ① Abend lebt ② Rückzug | Verwandlung · Träger Fenster → Kurve · Mitte · nach oben |
| 11.04 | [EXPL] | 468,18–476,58 | **Keynes** @469,78 · **fifteen** @472,90 · **riches** @475,54 | Zwei Kurven: Einkommen steigt (fest, warm), Arbeitsstunden sollten auf 15 sinken (gepunktet), bleiben aber hoch. `J. M. KEYNES · 1930 · 15 HOURS A WEEK`. | ① Kurven | Verwandlung · Träger Kurven → Waagebalken · Mitte · – |
| 11.05 | [EXPL] | 476,58–484,34 | **money** @477,78 · **more time** @483,14 | Eine Waage aus Licht: links Münzen (kühl), rechts die Sanduhr (warm); sie hing immer zur Münzseite. Auf **more time?** pendelt sie in die Mitte. | ① Waage pendelt | Plansequenz |
| 11.06 | [EXPL] | 484,34–495,96 | **companies** @486,62 · **governments** @488,82 · **everyone** @491,14 | Drei Lichtzeichen nacheinander: Firma, Parlament, eine Hand mit Stimmzettel; jedes legt ein Gewicht auf die Zeitseite. | ① Zeichen | Fahrt · Träger Sanduhr auf der Waage → Sanduhr in deinen Händen · Mitte · nach vorn |

### c12 · Du: Zeit kaufen, 2 von 100, die erste Stunde schützen · 495,96–534,00 (38 s) · ★ 12.03 · [EXPL] 60%
Licht/Held: Vor-Dämmerung · Held: die kleine Sanduhr in deinen Händen

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 12.01 | [EXPL] | 495,96–502,44 | **study** @496,12 · **four** @496,92 · **time** @500,52 · **happier** @501,40 | Du, näher als sonst, eine Münze in der Hand: Münze → Sand (Zeit gekauft) → ein Balken `HAPPIER` steigt. `WHILLANS ET AL. · PNAS 2017 · 4 COUNTRIES`. | ① Münze → Sand ② Balken | Plansequenz |
| 12.02 | [EXPL] | 502,44–510,60 | **forty** @506,20 · **two in a hundred** @507,92 | Hundert kleine Lichtpunkte bekommen je `$40`: 98 ziehen kühl zu den Läden, 2 setzen sich warm auf eine Bank. `2 IN 100`. | ① die Menge zieht | Verwandlung · Träger die 2 warmen Punkte → leerer Kalenderslot · Mitte · nach vorn |
| **12.03 ★** | [SZENE] | 510,60–521,24 | **strangely** @511,04 · **step** @515,40 · **fill** @519,80 | ★ Dein Schreibtisch bei Nacht: im Kalender glüht eine leere Stunde; kleine Aufgabenkarten fliegen heran, prallen ab. Du legst die Hände um die Sanduhr. | ① Karten ② deine Hände | Plansequenz |
| 12.04 | [SZENE] | 521,24–525,68 | **Notice** @521,24 · **Guard** @522,44 · **empty** @524,04 | Drei Takte: du schaust (notice), legst die Hände schützend herum (guard), setzt dich daneben, nichts passiert (empty), das ruhigste Bild des Films. | ① deine Haltung | Plansequenz |
| 12.05 | [EXPL] | 525,68–534,00 | **common** @528,08 · **when** @502,76 | Die Blätter aus Licht (Wochenende, Vertrag, Recht auf Abschalten) steigen auf und legen sich auf eine Zeitleiste. | ① Blätter fliegen | Plansequenz → c13 |

### c13 · Wann die Regeln kamen, diesmal vorher, wir brauchen es · 534,00–582,52 (49 s) · ★ 13.05 · [EXPL] 84%
Licht/Held: erstes Morgenlicht · Held: die Zeitleiste → die Lichthand vom Anfang

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 13.01 | [EXPL] | 534,00–539,04 | **factories** @534,08 · **weekend** @536,24 · **generations** @537,12 | Zeitleiste: Fabrik-Icon um 1800, eine lange Strecke verschütteter Sand, dann landet das Blatt `WEEKEND` (1920er–40er), viel zu spät. | ① Leiste läuft ② Blatt | Plansequenz |
| 13.02 | [EXPL] | 539,04–544,24 | **evenings** @540,08 · **France** @541,76 | Umschlag-Icon 1990er, Strecke verschütteten Sandes, `RIGHT TO DISCONNECT · 2017`, wieder zu spät. | ① Leiste läuft | Plansequenz |
| 13.03 | [EXPL] | 544,24–552,08 | **first** @535,04 · **after** @548,16 · **gone** @551,04 | Das Muster legt sich übereinander: Maschine → Lücke aus verlorenem Sand (kühl) → Regel. | ① Lücke glüht kühl | Plansequenz |
| 13.04 | [EXPL] | 552,08–558,88 | **decide** @555,56 · **ahead** @556,32 · **us** @558,00 | Auf der Leiste: `NOW`, davor der Ring der Superintelligenz; das Blatt gleitet **vor** den Ring. | ① Blatt gleitet | Fahrt · Träger Ring → Lichthand vom Anfang · rechts oben · nach rechts |
| **13.05 ★** | [SZENE] | 558,88–566,42 | **can** @561,56 · **Before** @541,36 · **after** @548,16 | ★ Die Lichthand vom Anfang will die Sanduhr reichen; diesmal liegt das unterschriebene Blatt schon darunter, und deine offene Hand ruht darauf, **bevor** etwas gereicht wird. | ① Hand senkt ② dein Arm | Plansequenz |
| 13.06 | [EXPL] | 566,42–572,42 | **more time** @568,26 · **need** @571,50 | Balken der Zeit, die Maschinen gaben (Waschmaschine, E-Mail, Handy klein), dann die Superintelligenz: ein riesiger Balken, der aus dem Bild wächst. | ① Balken | Verwandlung · Träger Balken → zwei sinkende Kurven · Mitte · nach unten |
| 13.07 | [EXPL] | 572,42–582,52 | **friends** @573,86 · **twenty** @575,74 · **nature** @580,26 | Zwei leise Kurven sinken: `TIME WITH FRIENDS · 2003–2023 · ATUS`, `TRIPS INTO NATURE · PERGAMS & ZARADIC · PNAS 2008`. | ① Kurven | Verwandlung · Träger Kurven → Horizont und Sonne · Mitte · – |

### c14 · Die Stunde kommt an, Schluss, Endscreen · 582,52–625,48 (43 s) · ★ 14.02 · [EXPL] 0%
Licht/Held: goldener Abend, tiefe Sonne (Echo Battle Creek) · Held: die Sonne

| ID | Ebene | Zeit | Anker | Bild | Bewegung (≤ 2) | Übergang → Träger · Position · Richtung |
|---|---|---|---|---|---|---|
| 14.01 | [SZENE] | 582,52–584,76 | **hour** @583,00 · **arrives** @583,48 | Die tiefe goldene Sonne (Held). Der Sand fällt endlich in deine offene Hand. | ① Sand in die Hand | Verwandlung · Träger Sand → Erde → Garten · unten · – |
| **14.02 ★** | [SZENE] | 584,76–587,72 | **garden** @584,92 · **Battle** @586,56 | ★ Aus dem Sand in deiner Hand wird Erde, Setzlinge wachsen: ein Garten im Abendlicht, wie in Battle Creek. | ① Garten wächst ② Rückzug | Fahrt (seitlich, eine Einstellung bis 14.05) |
| 14.03 | [SZENE] | 587,72–590,44 | **dinner** @588,28 · **love** @589,76 | Die Fahrt erreicht einen langen Tisch draußen, Laternen, Silhouetten, du unter ihnen. | ① Fahrt | Plansequenz |
| 14.04 | [SZENE] | 590,44–592,20 | **river** @591,32 | Weiter: ein Kind hockt am Fluss, dasselbe Licht wie am Abend in Battle Creek. | ① Fahrt | Plansequenz |
| 14.05 | [SZENE] | 592,20–594,96 | **woods** @593,08 · **nowhere** @593,64 | Weiter: du gehst langsam einen Waldweg, Sonne durch die Stämme. | ① du gehst | Kran nach oben |
| 14.06 | [SZENE] | 594,96–605,10 | **for** @596,00 · **all of us** @600,68 · **subscribe** @603,64 | Kran: Garten, Fluss, Wald; über die Landschaft verteilt viele kleine warme Gärten (für alle). | ① Kran | Plansequenz |
| 14.07 | [SZENE] | 605,10–609,58 | **hour** @606,62 · **keep** @608,98 | Die Sanduhr auf der Gartenmauer, der Sand ruht im unteren Kolben, die Sonne scheint hindurch; deine Hand liegt daneben. | ① Sonne | Rückzug in den Endscreen |
| 14.08 | [SZENE] | 609,58–625,48 | – | **Endscreen (VO-Ende bis Schluss, ≤ 15 s, ohne Stimme).** Weites Bild in goldener Stunde: Garten, Fluss, Waldrand; Sonne tief in der Mitte am Horizont. Du und die Sanduhr winzig unten in der Mitte. **Frei:** links (x 90–780, y 250–700: „best for viewer“), rechts (x 1140–1830: „latest upload“), Mitte über der Sonne (x 810–1110, y 330–600: Abo-Knopf). Nie statisch: langsamer Rückzug, der Fluss glitzert, Blätter und Gräser wiegen sich, Glühwürmchen steigen, die Sonne sinkt. | ① Rückzug ② Sonne sinkt, Fluss, Glühwürmchen | – |

<!-- SHOTS:END -->

## §3 Weltwechsel (≤ ~1 pro Minute)
| # | ab Shot | von → nach | Träger |
|---|---|---|---|
| 1 | 1.01 | Nachtkante mit Sanduhr (Hook) | – |
| 2 | 3.02 | Hook-Nacht → staubiger Weg (Wasser) | Arbeitsjahr-Balken → Horizontlinie |
| 3 | 3.06 | Weg → deine Küche | Hahn → Hahn (Match) |
| 4 | 4.02 | Küche → Explainer-Raum (Waschmaschine, E-Mail, Linder) | der abbiegende Sandfaden |
| 5 | 5.06 | Explainer → Lichthand und du (Übergabe) | Kreislauf → Riss im Glas |
| 6 | 6.07 | Büro → Haus in der Nacht (Hassabis) | Stundengefäß → Fenster |
| 7 | 7.02 | Nacht → Battle Creek 1930 | Flug ins Glas der Sanduhr |
| 8 | 8.01 | Lichtkarte → Sommerabend (Herzstück) | Abstieg in die Karte |
| 9 | 9.01 | Fabrik → Werkbank in der leeren Halle | das letzte warme Fenster |
| 10 | 10.07 | Explainer → Krankenhausflur | Sandstrom → Lichtstreifen |
| 11 | 11.01 | Flur → Abendtisch | Blatt → Tischtuch |
| 12 | 12.03 | Explainer → dein Schreibtisch | 2 warme Punkte → Kalenderslot |
| 13 | 13.06 | Zeitleiste → Lichthand vom Anfang | Ring → Lichthand |
| 14 | 14.01 | Nacht → goldener Abend (Garten, Tisch, Fluss, Wald, Endscreen) | Sand → Erde → Garten |
Ergebnis: 14 Welten in ~10:25 min. Die Paare 2/3, 10/11 und 13/14 sind Match-Fahrten oder Verwandlungen an derselben Bildstelle (gleiche Form, gleiche Position) und zählen nicht als harter Wechsel; bleiben ~10 harte Weltwechsel, also ~0,95 pro Minute. Alles andere sind Plansequenzen und Verwandlungen auf derselben Bühne.

## §4 Zitat, Quellen, Bildtexte
- **1.03 Gates (exakter Wortlaut, Pflicht):** „The purpose of life is not just to do jobs. So if you eventually get a society where you only have to work three days a week or something, that's probably okay.“ · `— Bill Gates, “What Now?” with Trevor Noah, 2023`. Das VO paraphrasiert; die Karte zeigt den Wortlaut.
- Zahlen nur aus `film-zeit/faktencheck.md` (Stand 28.10.): Deutschland 1870 ~3.284 h → 2017 ~1.354 h · UNICEF 2016 200 Mio. h/Tag · Microsoft WTI 2025 „every 2 minutes“ (Top-20-%-Nutzer: `BUSIEST USERS`) · Kellogg 1.12.1930, 1943, 1946 (Mehrheit für 6 h), 1985 (letzte 530) · Ford 1.5.1926 · UK-Pilot 61 Firmen 2022, 54 (89 %) weiter, 31 (51 %) dauerhaft (Autonomy 2024) · Frankreich 2017, Spanien 2018, Portugal 2021, Irland 2021, Belgien 2022, Australien 2024 · Keynes 1930 · Whillans PNAS 2017 (4 Länder; 2 von 100) · ATUS 2003–2023 · Pergams & Zaradic PNAS 2008.
- Im Bild nie „AI“, immer „artificial intelligence“ (oder kein Wort). Höchstens eine Zahl und ≤ 6 Wörter pro Grafik, plus Quelle.
