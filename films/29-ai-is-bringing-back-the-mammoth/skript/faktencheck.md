# Faktencheck · Film #29 „AI Is Bringing Back the Mammoth“ · 19.11.2026

Geprüft: `vo-v2.txt` Zeile für Zeile (Z. = Zeilennummer in der Datei, Leerzeilen mitgezählt; in `vo-v3.txt` gleich), dazu jede Einblendung, Zitatkarte und Clip-Notiz in `text-v2.md`. Abgeglichen mit `faktenzettel.md`, `recherche-v2.md` (gezielt), `clips.json`, `kritik-v1.md` (Abschnitt 8). Upload: Fr 20.11. bis So 22.11.2026.

**Ergebnis:** 126 Prüfpunkte (90 im Sprechtext, 36 Einblendungen, Karten, Clip und Bildangaben). Falsch ist keine Aussage. **7 Must-changes:** 6 in `vo-v3.txt` umgesetzt (Z. 27, 33, 67, 69 + 71, 79, 105; dazu je die passende Einblendung), 1 nur in einer Einblendung (Quelle der Wollmaus-Kritik). `vo-v3.txt`: 1.452 gesprochene Wörter (v2: 1.446, also +6), „subscribe“ 2×, 1 Clip, 3 Zitatkarten, alle Stimm-Tags unverändert, 119 Zeilen wie v2.

**Quellenlage:**
- **[P]** = Primärseite heute (19.11.) selbst gelesen: TechCrunch und die Colossal-Pressemitteilung zu GenoMorph, Seiten auf colossal.com (auch der Newsroom), Wikipedia (Liste in Abschnitt 7).
- **[S]** = nur über Suchauszüge oder Sekundärquellen.
  - Gesperrt (Proxy oder DNS; müssten in den Netzwerk-Einstellungen der Sitzung freigegeben werden): time.com, livescience.com, newscientist.com, fws.gov, iucn.org, iucnredlist.org, canids.org, bioethics.com (Nachdruck des TIME-Artikels), apnews.com, singjupost.com.
  - YouTube: Seiten und Untertitel leiten auf eine gesperrte Google-Seite um.
- **Ton:** Kein Clip am Ton geprüft. vidIQ hat 0 Credits (heute geprüft; neue Credits laut Konto am 19.12.2026). Ein Abruf über die YouTube-Schnittstelle wurde vom Rechte-Filter abgelehnt und nicht wiederholt.

---

## 1 · Must-change

| # | Stelle | Problem | Quelle | Ersatz (EN) |
|---|---|---|---|---|
| 1 | **Z. 27** + Zähler „150+“ (Station 2) | **Zu stark.** Die Erstquelle TIME schreibt: „Now that number is about 150—and rising.“ Erst Nachberichte machen daraus „more than 150“. Colossals eigene Mammut-Seite nennt weiter 65 Gene. „and rising“ steht so bei TIME; die zwei Wörter sind optional. | [S] TIME 24.8.2026 (Suchauszug); Dexerto 27.9.2026; [P] colossal.com/mammoth | `Still far too many to rebuild. This is where the machine's ranking comes in... and the count drops again. Colossal's own list, by the latest reports? About a hundred and fifty genes... and rising.` · Zähler: `~150` |
| 2 | **Z. 33** + Einblendung „7 … 150“ | Wie 1. | wie 1 | `From seven genes in a mouse... to about a hundred and fifty in an elephant. And the man who runs Colossal, Ben Lamm, has every reason to promise that a machine will close that gap overnight. He doesn't.` · Einblendung: `7 … ~150` |
| 3 | **Z. 67** | **Zu stark.** „just as plainly“ stellt Shapiro neben die IUCN-Fachgruppe („say no“). Sie sagte aber nicht „not dire wolves“, sondern „grey wolves with 20 edits that are cloned“. Colossal nannte die Tiere danach weiter Schattenwölfe („functional de-extinction“). Die neue Einleitung behauptet keine Einigkeit, der Satz danach bleibt stark. | [S] Live Science (Mai 2025); Why Evolution Is True 25.5.2025; Boing Boing 26.5.2025 | `[thoughtful] Wolf experts at the union behind the Red List of threatened species say no. And Colossal's own chief scientist, Beth Shapiro, has said plainly what they are.` |
| 4 | **Z. 69** (Karte) + **Z. 71** (gesprochen) | **Zitat gekürzt, ohne Auslassungszeichen.** Der Satz geht weiter: „…with 20 edits that are cloned.“ Gesagt hat sie ihn New Scientist (Mai 2025). Live Science hat ihn nur zitiert und in der Überschrift gekürzt. Ihr Titel bei Colossal: Chief Science Officer. Der volle Satz steht gleich in Live Science, im Bioethics.com-Nachdruck des New-Scientist-Artikels und bei Wikipedia. Das New-Scientist-Original ist gesperrt. Auf der Karte steht die britische Schreibung „grey“ wie im Original, gesprochen bleibt „gray“ wie sonst im Film. +6 Wörter. | [S] Live Science; Bioethics.com; [P] Wikipedia, Dire-wolf-Projekt | Karte: `[ZITATKARTE: "Our animals are grey wolves with 20 edits that are cloned." · Beth Shapiro, Chief Science Officer, Colossal · to New Scientist, May 2025 · wird gesprochen, siehe nächste Zeile]` · gesprochen: `"Our animals are gray wolves with twenty edits that are cloned."` |
| 5 | **Z. 79** (Karte Lamm) | **Satz 1 nicht wörtlich belegbar.** „We don't have a hard date.“ ist nur sinngemäß belegt: Nachberichte geben wieder, es gebe noch kein festes Datum, aber ohne diesen Wortlaut. „Not 2036, but not 2030 either.“ steht in mehreren Auszügen als Lamm-Zitat aus TIME. Der Sprecher sagt „there is no hard date“ ohnehin (Z. 77). Zeigt das TIME-Original Satz 1 wörtlich, kann er zurück. | [S] TIME 24.8.2026 (Suchauszüge); Newsy Today und Dexerto (Nachberichte) | `[ZITATKARTE: "Not 2036, but not 2030 either." · Ben Lamm, TIME, Aug 24, 2026 · nur im Bild, wird nicht gesprochen]` |
| 6 | **Z. 105** + Einblendung Rote Liste (Station 5) | **Zeitkritisch.** Heute stimmt „almost“: 49.505 bedrohte Arten in Version 2026-1 vom 9.7.2026. Version 2026-2 ist für den 19.11. oder den 26.11.2026 angekündigt; die Quellen widersprechen sich, bis 19.11. abends ist sie nicht erschienen. Von Okt. 2025 bis Juli 2026 stieg die Zahl um 859. Liegt sie danach über 50.000, ist „almost“ falsch, und „This year's Red List“ meint dann 2026-2. „about“ trägt in beiden Fällen. | [S] IUCN-PM 9.7.2026; Termine laut Suchauszug von iucnredlist.org | `And the elephant is not alone. This year's Red List counts about fifty thousand species as threatened.` · Einblendung: `49,505 threatened species · IUCN Red List 2026-1 (July 2026)`, oder am Upload-Tag Zahl und Version von 2026-2 |
| 7 | Einblendung Station 2 (`text-v2.md` Z. 85) | **Quelle nicht belegt.** Für „T. Herridge, BBC Science Focus, 2025“ ist der Wortlaut nicht geprüft (Recherche: „Wortlaut prüfen“). Belegt ist Herridge beim Science Media Centre am 4.3.2025: Wollmäuse habe es in Laboren und bei Züchtern schon „many times before“ gegeben. Montoliu (SMC Spanien) sagt dazu, die Edits beruhten vor allem auf Wissen über Mäuse. Wikipedia: „Seven of the genes were selected based on previous knowledge of their influence on mouse coats.“ Z. 31 bleibt. | [S] SMC UK, SMC Spanien (4.3.2025); [P] Wikipedia, Woolly mouse | `T. Herridge, Science Media Centre, Mar 4, 2025` |

**Empfohlen, nicht zwingend:**
- **Z. 55** „clear as glass, made by a 3D printer“ ist vereinfacht. Durchsichtig ist eine dünne Silikon-Membran, 3D-gedruckt ist der starre Rahmen („rigid 3D-printed outer cup with a transparent silicon liner“). Vorschlag (1 Wort kürzer): `...from a shell no bird ever laid... a 3D-printed frame with a see-through skin.`
- **Einblendung Station 1** (`text-v2.md` Z. 57): „TIME, Aug 24, 2026 · as reported“ statt „as reported, Sept 2026“. TIME ist der Erstbericht, im September kamen nur Nachberichte.
- **Einblendung Station 3** (`text-v2.md` Z. 115): „Colossal: candidates, not proof“ wirkt wie ein Zitat. Colossal schreibt „candidate regulatory elements … entering functional-validation studies“. Vorschlag: `CANDIDATES · NOW IN LAB TESTS · per Colossal`.
- **Karte IUCN** (`text-v2.md` Z. 143): Schriftzug „IUCN“ statt „IUCN Red List“. Die Aussage stammt von der Kaniden-Fachgruppe der Artenschutzkommission, nicht vom Red-List-Team. Der Sprechtext („the union behind the Red List“) stimmt.
- **Einblendung Schluss** (`text-v2.md` Z. 216): genauer „rejected by one vote (governments, 87 to 88)“. Die eine Stimme fehlte in der Kammer der Staaten.
- **Z. 113** „a pause for genetically modified wild animals“: Der Antrag galt wilden Arten allgemein, also auch Pflanzen. Als Verkürzung vertretbar.

---

## 2 · Am Upload-Tag prüfen (Fr 20.11. bis So 22.11., vor Veröffentlichung)

1. **Z. 105 · Rote Liste 2026-2:** Ist sie erschienen, die Einblendung auf die neue Zahl und Version setzen. Der Satz trägt mit „about fifty thousand“, solange die Zahl ungefähr zwischen 45.000 und 55.000 liegt.
2. **Z. 81 · „nobody has reported a mammoth embryo... or a pregnant elephant“** und **Z. 39 · „Colossal has not shown that step in public“:** im Colossal-Newsroom (colossal.com/news) und per Nachrichtensuche prüfen. Stand 19.11. abends: nichts gemeldet [P].
3. **Z. 59 · „Three animals … are already alive“:** Der nächste Schattenwolf-Wurf ist laut Colossal „underway“ (1.10.2026). Wird vor dem Upload ein neuer Wurf gemeldet, stimmt „Three animals“ nicht mehr. Ersatz liegt bereit: `[calm, conversational] There is a way to check. The first animals made by editing a living relative are already alive.` Z. 61 bleibt dann unverändert.
4. **Finanzierung:** Laut Faktenzettel (F25: Axios Pro 30.9.2026) laufen Gespräche über eine Bewertung von 25–26 Mrd. $. Bis 19.11. ist kein Abschluss gemeldet. Das Thema kommt im Film nicht vor, Änderungsbedarf gibt es also keinen.
5. **Clip C1 und die Karten Shapiro, Lamm, IUCN:** am Original prüfen (Abschnitt 5). Dafür time.com, newscientist.com oder livescience.com, canids.org und singjupost.com freigeben, für den Ton ein Transkript (vidIQ oder Whisper).

---

## 3 · Neu seit dem Faktenzettel (16.11.), dazu Meldungen der Vortage

| Datum | Neu | Folge für den Film |
|---|---|---|
| 17.11. | Die Colossal-Ausgründung Astromech (KI für Biologie) übernimmt die Ausgründung Form Bio für 230 Mio. $ in Aktien [S] Axios Pro | Nicht im Film, kein Änderungsbedarf |
| 19.11. (Prüfung) | Laut TIME heißt es „about 150—and rising“, nicht „more than 150“; Shapiros Satz geht weiter; Satz 1 der Lamm-Karte ist nicht wörtlich belegt | Must-change 1 bis 5 |
| 19.11. (Prüfung) | Rote Liste 2026-2 für den 19.11. oder 26.11. angekündigt, noch nicht erschienen [S] | Must-change 6; Abschnitt 2 |
| ca. 12.11. | Das Kunst-Ei steht in TIMEs „Best Inventions of 2026“. Colossal beschreibt es als „rigid 3D-printed outer cup with a transparent silicon liner“ [P] | Stützt Z. 55; Empfehlung zu „clear as glass“ |
| 11.11. | Der Colossal-Geldgeber 81 Collection schließt einen zweiten Fonds über 82 Mio. $ [S] Bloomberg | Nicht im Film |
| ca. 10.–13.11. | Biology Letters (Davinack, Daniels) nennt den Schattenwolf als Beispiel für „lineage-genome conflation“: Merkmale zurück, Abstammungslinie nicht [S] | Stützt Z. 73 |
| ca. 6.–16.11. | Colossal verklagt den Ex-Vizepräsidenten James Kehler wegen Geschäftsgeheimnissen (Bundesgericht Austin). Bisher nur Vorwürfe [S] | Nicht im Film |
| 1.–19.11. | **Unverändert:** kein Mammut-Embryo, keine Elefanten-Schwangerschaft, kein neuer Schattenwolf-Wurf, keine neue Rote Liste, kein Abschluss einer Finanzierungsrunde [P] colossal.com/news; Suche 19.11. | Z. 39, 59, 81 und 105 tragen; Abschnitt 2 |

---

## 4 · Alle Aussagen im Sprechtext (vo-v2.txt)

Urteil: **ok** · **overstated** (zu stark) · **wrong** (falsch) · **unverifiable** (nicht belegbar). „Eigenangabe“ = Zahl oder Aussage von Colossal, im Film hörbar zugeschrieben. „dünn“ = nur Zweitquellen. Quellenkürzel in Abschnitt 7.

| # | Z. | Aussage | Urteil | Quelle, Datum | Notiz |
|---|---|---|---|---|---|
| V1 | 1 | Artificial intelligence is bringing back the mammoth. | ok (These, im Film aufgelöst) | S1; P1 | Wörtlich zu stark. Z. 73 („The species does not.“) und Z. 107 („Not the mammoth itself.“) lösen ausdrücklich auf. Kein Must-change, solange beide Sätze bleiben |
| V2 | 3 | A few winters from now … fence … Red-brown fur. Small ears. | ok (Szenario) | Bild „SCENARIO · EARLY 2030s“; S1 | Als Szenario markiert |
| V3 | 5 | That animal doesn't exist yet. | ok | P3 Newsroom; Suche 19.11. | |
| V4 | 5 | about 1.4 million differences in their DNA | ok | S2 (2.7.2015) | „~1.4 million genetic variants unique to woolly mammoths“ im Vergleich zum Asiatischen Elefanten [Stand 2015] |
| V5 | 7 | No human can check them all. No lab can change them all. | ok (Einordnung) | S3; P3 Mammut-Seite | Bisher bis zu sieben Gene gleichzeitig (Maus) |
| V6 | 7 | So the search for the few that matter went to a machine. | ok (dünn) | S1; P1, P2 (Dodo) | Fürs Mammut nur Zweitquellen; siehe V12 |
| V7 | 9 | the first test animals are already alive. Mice … long, woolly, mammoth-style fur | ok | S3 (4.3.2025); P4 | 38 Mäuse laut TIME (3/2025); Kältetoleranz nicht getestet |
| V8 | 11 | The mice were the rehearsal. The real job is an elephant. | ok | P3 Wollmaus („validating its end-to-end de-extinction pipeline“) | |
| V9 | 11 | the same tools will help decide which of today's animals that child still gets to see | ok (Ausblick) | S12; S13 | Löst der Film mit Biobank und Impfung ein |
| V10 | 13 | a company in Dallas called Colossal | ok | P2 („DALLAS, Oct. 14, 2026“) | |
| V11 | 13 | not to thaw out a frozen mammoth … take … the Asian elephant … rewrite its DNA for the cold | ok | P3 Mammut-Seite; S1 | |
| V12 | 15 | As reported this year, AI combs through mammoth and elephant DNA … flags the differences most likely to build a trait | ok (dünn) | S1 (IBTimes SG, Sept. 2026: maschinelles Lernen markiert wahrscheinlich wichtige Mutationen; TIME 24.8.: KI „alongside CRISPR“) | Hörbar zugeschrieben. Eine benannte Mammut-KI mit Zahlen gibt es öffentlich nicht; das sagt Z. 39 selbst. Ampel Nr. 1 |
| V13 | 15 | The thick fur. The layer of fat. The small ears. | ok | P3 Mammut-Seite | Zielmerkmale laut Colossal |
| V14 | 17 | It doesn't change a single gene. It writes the list. | ok | P1 (Lamm: GenoMorph „doesn't edit genes itself“); P3 Newsroom | Belegt für GenoMorph, fürs Mammut sinngemäß |
| V15 | 19 | Frozen ground kept mammoth DNA for thousands of years | ok | S10 | Zurückhaltend formuliert |
| V16 | 19 | Colossal says it now holds about a hundred mammoth genomes. A hundred full sets of DNA. | ok (Eigenangabe) | P1 („the 100 genomes“); P3 GenoMorph (nach Inc.: 104) | „full“ vereinfacht; die Genome sind unterschiedlich vollständig |
| V17 | 23 | reading was never the hard part. Knowing what it means is. | ok (Einordnung) | P2 (Shapiro: Schalter-DNA „difficult to interpret from ancient DNA alone“) | |
| V18 | 23 | Most of those differences probably change nothing you would ever see. | ok | S2 | „probably“ trägt |
| V19 | 25 | Only some … change what a gene actually builds. One study found those in about sixteen hundred genes. | ok | S2 („2,020 amino acid changes in 1,642 protein-coding genes“) | Vereinfacht: Auch Schalter-DNA zählt (Dodo, Z. 45); der Zähler 1.600 → 150 ist kein strenger Trichter |
| V20 | 27 | Still far too many to rebuild. | ok (Einordnung) | S3 | |
| V21 | 27 | This is where the machine's ranking comes in … and the count drops again. | ok (dünn) | S1 (TIME, Suchauszug: KI „to manage that“) | wie V12 |
| V22 | 27 | Colossal's own list, by the latest reports? More than a hundred and fifty genes. | **overstated** | S1 (TIME 24.8.: „about 150—and rising“); P3 Mammut-Seite (65) | Must-change 1 |
| V23 | 29 | tested in a living animal so far? Only in those mice. | ok | S3; S1 (Mammut-Schalter-DNA bisher nur in Elefanten-Hautzellen) | |
| V24 | 29 | Seven genes, changed at once. | ok | S3; P4 | Bis zu sieben gleichzeitig; über alle Mauslinien rund zehn Zielgene |
| V25 | 31 | Critics … Genes like these were already known to change a mouse's coat. | ok | P4 („Seven of the genes were selected based on previous knowledge of their influence on mouse coats“); S3 (SMC 4.3.2025) | Einblendung: Must-change 7 |
| V26 | 31 | So the mice prove the editing … not the list. | ok (Urteil des Films) | S3; P4 | |
| V27 | 33 | From seven genes in a mouse … to more than a hundred and fifty in an elephant. | **overstated** | S1 | Must-change 2 |
| V28 | 33 | the man who runs Colossal, Ben Lamm | ok | P1 (CEO) | |
| V29 | 33 | has every reason to promise … overnight. He doesn't. | ok (Einordnung) | S4 | Trägt nur mit Clip C1 |
| V30 | 35 | [CLIP C1] Wortlaut | **unverifiable** (Ton) | S4 | Abschnitt 5 |
| V31 | 37 | No magic. Nothing overnight. … a short list … somebody has to test it. | ok (Einordnung) | S4; P2 („functional-validation studies“) | |
| V32 | 39 | For the mammoth, Colossal has not shown that step in public. | ok (Stand 19.11.) | P3 Newsroom; Suche 19.11. | Am Upload-Tag prüfen |
| V33 | 39 | This October, it did … A bird. The dodo. | ok | P1, P2 (14.10.2026) | |
| V34 | 41 | about a hundred genomes … For the dodo, there is exactly one. | ok (Eigenangabe) | P1 („only one dodo genome compared to the 100 genomes“) | |
| V35 | 43 | One bird. Nothing to compare it with. | ok (rhetorisch) | P1 | Gemeint: kein zweites Dodo-Genom; Z. 45 löst auf |
| V36 | 45 | GenoMorph studied more than seventy living bird species … their DNA, and the exact shape of their skulls | ok (Eigenangabe) | P2 („genomes and CT-derived skull measurements from more than 70 bird species … 541 anatomical landmarks“) | Dazu Entwicklungsdaten von Huhn, Wachtel, Ente, Taube |
| V37 | 45 | That is how it learned which switches in the DNA shape a beak. | ok (Eigenangabe) | P1 („The AI learns which regions of DNA are active as different birds develop their beaks …“) | |
| V38 | 47 | about twenty-three hundred candidates | ok (Eigenangabe) | P2 („an estimated 2,300 candidate regulatory elements“: 653 + 1.698) | |
| V39 | 49 | Might. Colossal itself says this is not proof. Every candidate still has to prove itself in the lab. | ok (sinngemäß) | P2 („Candidate elements are now entering functional-validation studies“); P1 („targets … that we can now test in the lab“) | „not proof“ ist Umschreibung, kein Zitat |
| V40 | 51 | It learns them … from animals that are still alive. | ok | P2 (Shapiro: „use the breadth of living bird diversity, combined with AI“) | |
| V41 | 53 | The machines that follow will be asked for far more. | ok (Ausblick) | — | Überleitung zum Abo-Aufruf |
| V42 | 55 | This spring, the company says, live chicks hatched from a shell no bird ever laid | ok (Eigenangabe) | P3 Kunst-Ei (26 Küken, Mai 2026); S5 | Inhalt aus echten Hühnereiern; kein Paper, keine Schlupfraten. „shell“ passt (Lynch: „It's an artificial eggshell.“) |
| V43 | 55 | clear as glass, made by a 3D printer | ok (vereinfacht) | P3 TIME Best Inventions („rigid 3D-printed outer cup with a transparent silicon liner“); S5 | Empfehlung in Abschnitt 1 |
| V44 | 59 | Three animals made by editing a living relative are already alive. | ok (Stand 19.11.) | P3 Schattenwölfe (Okt. 2026); S6 | Neuer Wurf „underway“: Abschnitt 2 |
| V45 | 61 | Colossal presented them as dire wolves | ok | P4 (April 2025) | |
| V46 | 61 | a wolf that died out thousands of years ago | ok | P4 („approximately 10,000 years ago“) | |
| V47 | 61 | They began as gray wolf cells. | ok | P4 (Vorläuferzellen aus Grauwolf-Blut) | |
| V48 | 61 | Twenty edits went in | ok | P4 (rund 20 Änderungen in 14 Genen); S6 | |
| V49 | 61 | guided by DNA from a tooth thirteen thousand years old | ok (verkürzt) | P4 (13.000 Jahre alter Zahn und 72.000 Jahre alter Ohrknochen) | Der Knochen fehlt im Satz, die Einblendung zeigt beides |
| V50 | 61 | Colossal says the oldest are now two years old, healthy, and hunting as a pack. | ok (Eigenangabe) | P3 Schattenwölfe („Healthy checkups were completed for all three“); S6 (AOL 1.10.2026: jagen Kaninchen, verfolgen Hirsche) | Geboren 1.10.2024 und 30.1.2025 (P4) |
| V51 | 67 | Wolf experts at the union behind the Red List … say no. | ok | S7 (18.4.2025) | Kaniden-Fachgruppe der IUCN-Artenschutzkommission |
| V52 | 67 | Beth Shapiro … has put it just as plainly. | **overstated** | S8 | Must-change 3 |
| V53 | 71 | "Our animals are gray wolves." | **overstated** (gekürzt) | S8 | Must-change 4 |
| V54 | 73 | That is what "bringing back" means today. The traits come back. The species does not. | ok (Einordnung) | S7; S16 | |
| V55 | 75 | An Asian elephant … with a mammoth's fur, fat, and small ears. An elephant built for the cold. | ok | P3 Mammut-Seite | |
| V56 | 77 | The first calf was once promised for twenty twenty-eight. | ok | S9 (Bloomberg 4.3.2025); P3 Wollmaus („as early as 2028“) | |
| V57 | 77 | Now Colossal says the early twenty-thirties | ok | S1 (TIME 24.8.2026, Suchauszüge; Nachberichte gleich) | |
| V58 | 77 | its chief executive says there is no hard date | ok (sinngemäß) | S1 | Kartentext: Must-change 5 |
| V59 | 81 | That is a hope, not a timetable. | ok (Einordnung) | — | |
| V60 | 81 | So far, nobody has reported a mammoth embryo … or a pregnant elephant. | ok (Stand 19.11.) | P3 Newsroom; Suche 19.11.; S9 (NPR 4.3.2026: Embryos geplant) | Am Upload-Tag prüfen |
| V61 | 81 | an elephant carries her calf for almost two years | ok | P4 (18–22 Monate) | |
| V62 | 83 | one shaggy elephant, years behind schedule | ok | S1; S9 | 2028 → frühe 2030er |
| V63 | 85 | The bigger prize is the animals that are still here. | ok (These des Films) | — | |
| V64 | 87 | The last mammoths died only about four thousand years ago, on a remote island in the Arctic. | ok | S10 (Cell 2024); P4 (Wrangelinsel: „until around 4,000 years ago“) | |
| V65 | 87 | The great pyramids of Egypt were already standing. | ok | P4 (Cheops-Pyramide: 26. Jh. v. Chr.) | Rund 500 Jahre früher |
| V66 | 87 | nobody was there to freeze a single living cell. The ice kept only broken DNA. | ok | S10; P2 | |
| V67 | 87 | every trait has to be rebuilt … difference by difference | ok (Einordnung) | — | |
| V68 | 89 | In the nineteen-eighties, somebody froze living cells from a black-footed ferret named Willa. | ok | S11 (Gewebe 1988, Frozen Zoo San Diego) | |
| V69 | 91 | Decades later, those cells became living clones. | ok | S11 (Elizabeth Ann 2020; Noreen, Antonia 2023) | |
| V70 | 91 | According to U.S. wildlife officials, one of them had babies two years ago | ok | S11 (FWS 11/2024: Antonia, Würfe im Juni 2024) | „two years ago“ = 2024 |
| V71 | 91 | and last year, her babies had babies of their own | ok | S11 (FWS-Story 24.9.2025; Smithsonian 2025: Würfe von Sibert und Red Cloud) | Zahl der Würfe 2025 uneinheitlich (3 oder 4) |
| V72 | 93 | A ferret from the nineteen-eighties … has grandchildren. | ok | S11 | Der Klon ist genetisch Willa; die Würfe 2025 sind also ihre Enkel |
| V73 | 95 | No short list. No guesswork. Just a freezer, opened in time. | ok (Einordnung) | S11 | |
| V74 | 97 | The U.S. government and Colossal plan to freeze cells from every species on the country's endangered list. | ok (Plan) | S12 (FWS 25.6.2026; TIME: „every species on the U.S. Endangered Species List“); P3 Biobank | Über 2.300 Tier- und Pflanzenarten (Gizmodo) bzw. „2,100-plus“ (TIME); Plan, kein Ergebnis |
| V75 | 97 | the genomes are meant to go online, free | ok | P3 Biobank („open-access repositories at no cost“) | |
| V76 | 99 | A freezer is not a forest. It protects no habitat. | ok (Einordnung) | — | |
| V77 | 99 | Every genome saved is one more lesson … a lesson gone for good | ok (Schluss des Films) | P1, P2 | Folgt aus GenoMorph |
| V78 | 101 | Its mother would be an Asian elephant … her species is endangered too | ok | P4 („listed as Endangered on the IUCN Red List“ seit 1986); S9 (Leihmutter-Plan) | |
| V79 | 101 | In North American zoos, the leading killer of her calves is a virus. | ok | S13 (Houston Zoo, Baylor); P3 EEHV („leading cause of death in juvenile Asian elephants born in North America“) | |
| V80 | 101 | This summer, researchers reported on a vaccine that Colossal helped pay for. | ok | S13 (J Virology 28.7.2026; Baylor: Geld von Houston Zoo, International Elephant Foundation und Colossal) | Ein Verzeichnis nennt den 18.8.2026, beides Sommer |
| V81 | 101 | Two young elephants who got it caught the virus … and came through without treatment. | ok | S13 („remained clinically healthy without hemorrhagic disease or medical intervention“) | Cincinnati Zoo; Virus im Blut, aber keine Krankheit |
| V82 | 103 | Two calves are a first sign, not proof. … keeping elephants alive | ok | S13 (Autoren: Schutzwirkung „an open question“) | |
| V83 | 105 | This year's Red List counts almost fifty thousand species as threatened. | ok heute, **zeitkritisch** | S14 (2026-1, 9.7.2026: 49.505 von 175.909) | Must-change 6 |
| V84 | 107 | AI is helping to bring back the mammoth's traits … in an elephant. Not the mammoth itself. | ok | S1; P1, P2 | Löst V1 auf |
| V85 | 109 | The mammoth draws the cameras and the money. | ok (Einordnung) | S17; Faktenzettel F25 | |
| V86 | 109 | The rescue … in a freezer … and in a machine that is learning to read what's inside | ok (These) | S12; P1 | |
| V87 | 111 | Maybe, in the early twenty-thirties … an elephant in a mammoth's coat | ok (Szenario) | S1 | „Maybe“ trägt |
| V88 | 113 | Last year, the union behind the Red List voted on a pause for genetically modified wild animals. | ok (verkürzt) | S15 (Motion 133, Abu Dhabi, 15.10.2025) | Der Antrag galt wilden Arten allgemein |
| V89 | 113 | The pause failed … by a single vote. | ok | S15 (NBC/AP: „by one vote“; Save Our Seeds: Staaten 87 zu 88) | Die eine Stimme fehlte in der Kammer der Staaten |
| V90 | 115, 117 | elephants, ferrets, and thousands of others are still alive … The freezer is the ark. | ok (Ausblick, Kernsatz) | S12; S14 | |

---

## 5 · Clip und Zitatkarten

| Clip / Karte | Befund | Urteil | Was tun |
|---|---|---|---|
| **C1** Lamm bei Peter H. Diamandis, Moonshots #297, 30.9.2026, 00:34:53–00:35:03 | Der Wortlaut in `text-v2.md` stimmt mit dem Suchauszug eines Fremdtranskripts überein (Singju Post, Seite gesperrt). Sinn laut Auszug: KI-Modelle liefern aus Genomdaten allein keine fertige Antwort; Colossal baut eigene Modelle. Ton und Zeitmarke sind nicht geprüft. | unverifiable (Ton) | Untertitel erst nach Abgleich mit dem Ton. Fällt der Clip, streichen: in Z. 33 „And the man who runs Colossal … He doesn't.“, in Z. 37 „No magic. Nothing overnight.“ (Plan aus `text-v2.md`, Vorbehalt 3). |
| **Karte IUCN** (Z. 65) | Die exakte Suche nach „The three animals produced by Colossal are not dire wolves.“ führt direkt auf das PDF der Kaniden-Fachgruppe (canids.org, 18.4.2025). Mehrere Berichte geben den Inhalt gleich wieder. Das PDF selbst ist gesperrt. | ok (sekundär) | Vor dem Kartenbau das PDF lesen (canids.org freigeben). Schriftzug: Empfehlung in Abschnitt 1. |
| **Karte Shapiro** (Z. 69, gesprochen Z. 71) | Voller Satz laut Live Science, Bioethics.com (Nachdruck New Scientist) und Wikipedia: „Our animals are grey wolves with 20 edits that are cloned.“ Quelle ist New Scientist, Mai 2025. Gleich danach sagte Colossal, man habe den Schattenwolf doch zurückgebracht. | overstated (gekürzt) → Must-change 4 | Am New-Scientist-Original gegenlesen. Clip-Option C5 entfällt, solange kein Video mit dem Satz gefunden ist. |
| **Karte Lamm** (Z. 79) | „Not 2036, but not 2030 either.“ steht in mehreren Auszügen als Lamm-Zitat aus TIME. „We don't have a hard date.“ ist nur sinngemäß belegt. | Satz 2 ok (sekundär), Satz 1 unverifiable → Must-change 5 | Am TIME-Original prüfen. Clip-Option C4 erst nach Prüfung am Ton. |

---

## 6 · Alle Einblendungen und Bildangaben (text-v2.md)

„t2“ = Zeile in `text-v2.md`.

| # | Stelle | Einblendung | Urteil | Quelle | Notiz |
|---|---|---|---|---|---|
| E1 | Hook, t2 32 | Thumbnail-Text „AI IS REVIVING THE MAMMOTH“ | ok (These, im Film aufgelöst) | wie V1 | |
| E2 | Hook, t2 35 | SCENARIO · EARLY 2030s | ok | S1 | |
| E3 | Hook, t2 38 | Zähler 1.400.000 · Cell Reports, 2015 | ok | S2 | |
| E4 | Hook, t2 44 | Wollmäuse, ORIGINAL FOOTAGE (Colossal-Material) | ok | S3 | |
| E5 | St. 1, t2 54 | Dallas; Mammut im Eisblock durchgestrichen; Asiatischer Elefant | ok | P2, P3 | |
| E6 | St. 1, t2 57 | Fell, Fett, Ohren · as reported, Sept 2026 | ok (dünn) | S1 | Empfohlen: „TIME, Aug 24, 2026 · as reported“ |
| E7 | St. 1, t2 63 | ~100 mammoth genomes (per Colossal) | ok | P1 | |
| E8 | St. 2, t2 73 | Zähler 1.400.000 | ok | S2 | |
| E9 | St. 2, t2 76 | Zähler 1.600 · Cell Reports, 2015 | ok | S2 | 1.642 Gene |
| E10 | St. 2, t2 79 | Zähler 150+ · TIME, Aug 24, 2026 (as reported) | **overstated** | S1 | Must-change 1: „~150“ |
| E11 | St. 2, t2 82 | Zähler 7 · Colossal preprint, March 2025 | ok | S3 | |
| E12 | St. 2, t2 85 | T. Herridge, BBC Science Focus, 2025 | **unverifiable** | S3 | Must-change 7 |
| E13 | St. 2, t2 88 | 7 … 150 · Ben Lamm, CEO, Colossal | **overstated** | S1 | Must-change 2: „7 … ~150“ |
| E14 | St. 2, t2 91 | Clip C1, ORIGINAL FOOTAGE + Name | unverifiable (Ton) | S4 | Abschnitt 5 |
| E15 | St. 2, t2 96 | Colossal, Oct 14, 2026 | ok | P1, P2 | |
| E16 | St. 3, t2 103 | 100 Mammut-Symbole, ein Dodo | ok | P1 | |
| E17 | St. 3, t2 109 | 70 Schädel · 541 points per skull · per Colossal · not peer-reviewed | ok | P2 | „more than 70“; Vorab-Ergebnisse nur auf Tagungen |
| E18 | St. 3, t2 112 | Zähler 2.300 | ok | P2 | |
| E19 | St. 3, t2 115 | Colossal: candidates, not proof | ok (sinngemäß) | P2 | Wirkt wie ein Zitat; Empfehlung in Abschnitt 1 |
| E20 | St. 3, t2 124 | Kunstschale mit Küken · 26 chicks · per Colossal | ok | P3, S5 | |
| E21 | St. 4, t2 134 | drei helle Wölfe (Colossal-Material) | ok | P3 | |
| E22 | St. 4, t2 137 | 20 edits · 14 genes · Zahn 13,000 years · Ohrknochen 72,000 years · per Colossal, Oct 2026 | ok | P4; P3 | |
| E23 | St. 4, t2 143 | Karte IUCN SSC CSG, 18.4.2025 · Schriftzug „IUCN Red List“ | ok (sekundär) | S7 | Schriftzug: Empfehlung in Abschnitt 1 |
| E24 | St. 4, t2 146 | Karte Shapiro · Live Science, 2025 | **overstated** | S8 | Must-change 4 |
| E25 | St. 4, t2 155 | 2028 durchgestrichen → early 2030s · TIME, Aug 24, 2026 | ok | S1, S9 | |
| E26 | St. 4, t2 158 | Karte Lamm | **unverifiable** (Satz 1) | S1 | Must-change 5 |
| E27 | St. 4, t2 160 | leeres Ultraschallbild · 22 Monate · as of Nov 2026 | ok | P4; P3 Newsroom | |
| E28 | St. 5, t2 173 | Wrangelinsel, Pyramiden · ~4,000 years ago · Cell, 2024 | ok | S10; P4 | |
| E29 | St. 5, t2 176 | Labor 1980er · Willa | ok | S11 | 1988 |
| E30 | St. 5, t2 179 | geklonter Iltis mit Jungen · U.S. Fish & Wildlife Service | ok | S11 | |
| E31 | St. 5, t2 182 | Stammbaum Willa → Klon → Junge → Enkel | ok | S11 | |
| E32 | St. 5, t2 188 | ~2,300 listed species · FWS / NYT, June 2026 | ok | S12; P3 | TIME nennt „2,100-plus“ |
| E33 | St. 5, t2 194 | Journal of Virology, July 28, 2026 · co-funded by Colossal | ok | S13 | |
| E34 | St. 5, t2 200 | 49,505 threatened species · IUCN Red List 2026 | ok heute, zeitkritisch | S14 | Must-change 6: „2026-1 (July 2026)“ oder neue Zahl |
| E35 | Schluss, t2 213 | SCENARIO · EARLY 2030s | ok | S1 | |
| E36 | Schluss, t2 216 | IUCN Congress, Oct 2025: moratorium rejected by one vote · Zähler auf 1 | ok | S15 | Genauer: Kammer der Staaten, 87 zu 88 (Empfehlung) |

---

## 7 · Quellen

**[P] Primär, am 19.11.2026 gelesen**
- **P1** TechCrunch, GenoMorph · 14.10.2026 · https://techcrunch.com/2026/10/14/colossal-biosciences-announces-new-ai-platform-to-help-accelerate-de-extinction-efforts/
- **P2** Colossal-Pressemitteilung „Colossal Accelerates the Full Dodo De-extinction Pipeline“ (PR Newswire, auf BioSpace) · 14.10.2026 · https://www.biospace.com/press-releases/colossal-accelerates-the-full-dodo-de-extinction-pipeline
- **P3** colossal.com (Firmenseiten; die Zusammenfassungen nennen jeweils den Originalbericht):
  - Mammut-Seite (nennt noch 65 Gene) · https://colossal.com/mammoth/
  - Wollmaus (nach TIME, März 2025: 38 Mäuse, „as early as 2028“) · https://colossal.com/colossal-woolly-mouse-mammoth-gene-editing/
  - GenoMorph (nach Inc.: 104 Mammut-Genome, ein Dodo-Genom) · https://colossal.com/colossal-genomorph-ai-dodo-dna-targets/
  - Kunst-Ei (nach National Geographic, Mai 2026) · https://colossal.com/colossal-artificial-egg-chickens-moa-dodo/
  - Kunst-Ei in TIMEs „Best Inventions of 2026“ · Nov. 2026 · https://colossal.com/colossal-biosciences-artificial-egg-named-to-times-best-inventions-of-2026/
  - Schattenwölfe, zweiter Geburtstag (nach USA TODAY, 15.10.2026) · https://colossal.com/dire-wolves-second-birthday-checkup-pack-expansion/
  - Biobank (nach TIME 25.6.2026 und Gizmodo) · https://colossal.com/colossal-biosciences-fish-wildlife-endangered-species-biobank/ · https://colossal.com/colossal-foundation-us-fish-wildlife-service-biovault-endangered-species/
  - EEHV · https://colossal.com/saving-baby-elephants-from-a-deadly-herpes-virus/
  - Newsroom, Stand 19.11. abends · https://colossal.com/news/
- **P4** Wikipedia (19.11.2026): https://en.wikipedia.org/wiki/Colossal_Biosciences_dire_wolf_project · https://en.wikipedia.org/wiki/Woolly_mouse · https://en.wikipedia.org/wiki/Wrangel_Island · https://en.wikipedia.org/wiki/Asian_elephant · https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza

**[S] Sekundär oder nur Suchauszug**
- **S1** TIME (J. Kluger), „The Woolly Mammoth's Comeback Is Taking Longer Than Expected“ · 24.8.2026 · https://time.com/article/2026/08/24/woolly-mammoth-de-extinct-colossal-biosciences/ (gesperrt; Suchauszüge: „about 150—and rising“, „early 2030s“, „Not 2036, but not 2030 either“, KI „alongside CRISPR“) ; Dexerto · 27.9.2026 · https://www.dexerto.com/entertainment/scientists-are-using-ai-to-bring-back-the-woolly-mammoth-but-itll-take-longer-than-planned-3412814/ ; IBTimes SG · Sept. 2026 · https://www.ibtimes.sg/woolly-mammoth-revival-delayed-2030s-colossal-using-ai-complex-gene-editing-94337 ; The Bold News · https://theboldnews.com/ai-enlisted-as-woolly-mammoth-revival-timeline-slips-to-2030s/
- **S2** Lynch u. a., Cell Reports · 2.7.2015 · https://www.uchicagomedicine.org/forefront/news/first-comprehensive-analysis-of-the-woolly-mammoth-genome-completed ; https://www.sciencedaily.com/releases/2015/07/150702131757.htm
- **S3** Wollmaus-Preprint (bioRxiv) · 4.3.2025 · https://doi.org/10.1101/2025.03.03.641227 ; Science Media Centre UK (u. a. Herridge) · 4.3.2025 · https://www.sciencemediacentre.org/expert-reaction-to-unpublished-preprint-on-inducing-loss-of-function-of-genes-in-mice-to-produce-woolly-mammoth-like-hair-phenotypes/ ; SMC Spanien (Montoliu) · 4.3.2025 · https://sciencemediacentre.es/en/lluis-montoliu-raton-mamut ; Science News (FGF5 seit 1994 bekannt) · https://www.sciencenews.org/article/wooly-mice-transgenic-mammoth
- **S4** Moonshots #297 (Peter H. Diamandis mit Ben Lamm) · 30.9.2026 · https://www.youtube.com/watch?v=VHg3oX1ytYQ&t=2093s ; Transkript Singju Post (gesperrt, Suchauszug) · https://singjupost.com/transcript-of-moonshots-297-ft-ben-lamm-on-wet-lab-artificial-wombs-and-gene-editing/
- **S5** Kunst-Ei: AP (über Courthouse News) · Mai 2026 · https://www.courthousenews.com/a-de-extinction-company-has-hatched-live-chicks-from-an-artificial-eggshell/ ; MIT Technology Review · 19.5.2026 · https://www.technologyreview.com/2026/05/19/1137471/colossal-biosciences-is-growing-chickens-in-a-3d-printed-container/
- **S6** Schattenwölfe: AOL · 1.10.2026 · https://www.aol.com/articles/colossal-dire-wolves-turning-two-060848000.html ; Scientific American · https://www.scientificamerican.com/article/the-scientific-debate-over-colossals-de-extinct-dire-wolves/
- **S7** IUCN SSC Canid Specialist Group · 18.4.2025 · https://canids.org/resources/CSG%20gene%20editing%20in%20wild%20canids.pdf (gesperrt)
- **S8** Shapiro-Zitat: Live Science (P. Pester) · Mai 2025 · https://www.livescience.com/animals/extinct-species/our-animals-are-gray-wolves-colossal-didnt-de-extinct-dire-wolves-chief-scientist-clarifies ; Bioethics.com (Nachdruck New Scientist) · https://bioethics.com/archives/97966 ; Why Evolution Is True · 25.5.2025 · https://whyevolutionistrue.com/2025/05/25/colossal-reverses-course-again-now-says-that-it-did-indeed-bring-back-the-dire-wolf/ ; Boing Boing · 26.5.2025 · https://boingboing.net/2025/05/26/colossal-exaggeration-scientist-admits-dire-wolves-are-just-big-gray-wolves.html ; New-Scientist-Original (M. Le Page): nicht gelesen
- **S9** Zieljahr 2028 und Leihmutter-Plan: Bloomberg · 4.3.2025 · https://www.bloomberg.com/news/articles/2025-03-04/startup-trying-to-un-extinct-prehistoric-mammoth-creates-woolly-mouse ; NPR · 4.3.2026 · https://www.npr.org/2026/03/04/nx-s1-5704318/colossal-woolly-mammoth-dire-wolf
- **S10** Dehasque u. a., Cell (Wrangelinsel) · 27.6.2024 · DOI 10.1016/j.cell.2024.05.033 · https://www.sciencedaily.com/releases/2024/06/240627172101.htm
- **S11** Iltis: FWS · Nov. 2024 · https://www.fws.gov/press-release/2024-11/advancements-black-footed-ferret-conservation-continue-new-offspring-cloned ; FWS-Story · 24.9.2025 · https://www.fws.gov/story/cloned-black-footed-ferret-kits-offer-hope-species ; Smithsonian NZCBI · 2025 · https://nationalzoo.si.edu/news/new-kits-born-black-footed-ferret-cloning-research (fws.gov gesperrt, Suchauszüge)
- **S12** Biobank: FWS · 25.6.2026 · https://www.fws.gov/press-release/2026-06/interior-announces-new-partnership-advance-conservation-imperiled-species ; TIME · 25.6.2026 · https://time.com/article/2026/06/25/colossal-biosciences-fish-wildlife-services-endangered-species/ ; Gizmodo · https://gizmodo.com/america-is-creating-a-dna-noahs-ark-for-more-than-2300-endangered-species-2000777344
- **S13** EEHV-Impfstoff: Journal of Virology · 28.7.2026 · https://doi.org/10.1128/jvi.02186-25 ; Baylor College of Medicine · https://www.bcm.edu/news/elephant-vaccine-shows-first-signs-of-protection-against-deadly-virus ; Houston Zoo · https://www.houstonzoo.org/about/newsroom/houston-zoo-baylor-eehv-mrna-vaccine-first-evidence-protectio/ ; Axios Houston · 28.7.2026 · https://www.axios.com/local/houston/2026/07/28/houston-zoo-baylor-elephant-vaccine-eehv-study
- **S14** Rote Liste 2026-1: IUCN-Pressemitteilung · 9.7.2026 · https://iucn.org/press-release/202607/desert-frog-deep-sea-molluscs-remarkable-species-risk-iucn-red-list ; Update-Termine · https://www.iucnredlist.org/assessment/updates (gesperrt; laut Suchauszügen 2026-2 am 19.11. oder 26.11.)
- **S15** IUCN-Abstimmung über Motion 133 (Abu Dhabi, 15.10.2025): NBC/AP · https://www.nbcnews.com/science/science-news/animals-genetic-engineering-iucn-conservation-groups-vote-yes-rcna235522 ; Save Our Seeds · https://www.saveourseeds.org/publications/iucn-backs-risky-genetic-engineering-in-nature-rejects-call-for-precaution/ ; Beyond GM · https://beyond-gm.org/iucn-votes-on-gene-editing-in-conservation-biotech-lobbyists-win-nature-loses/ ; Antragstext · https://iucn-2025.s3.eu-west-3.amazonaws.com/motions/en/133-MA-Moratorium%20on%20genetically%20engineering%20wild%20species%20in%20natural%20ecosystems-EN.pdf
- **S16** Biology Letters (Davinack, Daniels), „lineage-genome conflation“ · Nov. 2026 · https://phys.org/news/2026-11-scientists-extinct-species-life.html
- **S17** Meldungen 6.–19.11.2026: Axios Pro (Astromech übernimmt Form Bio) · 17.11.2026 · https://www.axios.com/pro/health-tech-deals/2026/11/17/colossal-astromech-form-bio-230m ; Austin American-Statesman (Kehler-Klage) · https://www.statesman.com/business/article/colossal-biosciences-trade-secrets-lawsuit-22516801.php ; Bloomberg (81 Collection) · 11.11.2026 · https://www.bloomberg.com/news/articles/2026-11-11/colossal-biosciences-backer-81-collection-raises-second-fund

**Nicht erreichbar:** time.com, livescience.com, newscientist.com, fws.gov, iucn.org, iucnredlist.org, canids.org, bioethics.com, apnews.com, singjupost.com (Proxy oder DNS); YouTube (Umleitung auf eine gesperrte Google-Seite). Vor dem Kartenbau sollten mindestens time.com und newscientist.com (oder livescience.com) freigegeben werden, für Clip C1 ein Transkript des Tons.
