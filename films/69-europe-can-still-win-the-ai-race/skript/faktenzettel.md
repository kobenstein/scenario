# Faktenzettel · #69 „Europe Can Still Win the AI Race“ (Arbeitstitel)

Stand: Montag, 23.11.2026, Vormittag. Für den Texter. Stationen wie in `geruest-v1.md` (Hook, Station 1–6, Schluss). O-Töne in `clips.json`. Marktdaten in `marktcheck-2026-11-23.md`.

**Sicherheit:** **sicher** = Primärquelle oder mehrere unabhängige Berichte · **umstritten** = Zahlen weichen je Quelle oder Messart ab, vorsichtig formulieren · **dünn** = nur eine Quelle oder nur ein Suchauszug, im Faktencheck am Original prüfen oder weglassen. „Verifiziert (iMac)“ gibt es in dieser Runde nicht.
**Quellenlage:** Aus der Cloud kam ich an keine Quellseite heran (curl ohne Antwort, WebFetch ohne Namensauflösung). Alle Inhalte stammen aus Suchauszügen der jeweiligen Seiten (Websuche, 22.–23.11.2026). Erreichbar war nur die YouTube-Datenschnittstelle (Titel, Kanal, Länge, Datum, Lizenz, Beschreibung, Kapitel); ihr Suchkontingent war am Ende erschöpft. YouTube-Untertitel und Ton waren gesperrt, vidIQ hat kein Guthaben (bis 19.12.2026). **Kein Clip-Wortlaut und keine Zeitmarke ist am Video geprüft.**
**Ton:** Staunen über das, was schon da ist, dann ehrlich prüfen. Kein Lager, kein Brüssel-Bashing, keine Bösewichte, kein Anti-USA-Ton (§1.7). Institutionen nennen (Rat, Parlament, Kommission), keine Parteien. Firmenchefs (Mensch, Koerte) sind Stimmen mit Eigeninteresse: das Interesse im Satz davor nennen (§1.9a). Jensen Huang nicht zitieren (§2.5f). Medizin höchstens als Wort, keine Station (§2.5c).

---

## 0 · Bitte zuerst lesen: Korrekturen am Gerüst und Überschneidungen

1. **„1 von 20“ hält, aber nur für die EU und nur als Rechenleistung.** Bruegel (Policy Brief 18/2026, Sept. 2026): Die EU hat 2026 rund 2 GW betriebsbereite KI-Rechenleistung, „nearly 5 percent of global installed capacity“. Epoch AI misst anders (KI-Chip-Importe seit 2022, Stand Q2 2026) und kommt auf 5,1 % für die EU. Zwei Messarten, gleiches Ergebnis. Mit UK, Schweiz und Norwegen sind es 6–7 % (Epoch EU+UK 6,3 %; Atomico 18.11.2026: „Europe“ ~7 %), also eher „jeder fünfzehnte“. Der Gerüstsatz „Von allen Computern, die heute KI trainieren“ ist schief: Gemessen wird die gesamte KI-Rechenleistung (Training und Betrieb), nicht Computer. → „the European Union“ sagen (passt zu den 27 Teilen) und „computing power built for A.I.“.
2. **„One machine that every A.I. chip on Earth depends on“ ist zu stark.** Huaweis Ascend-Chips, Chinas wichtigste KI-Chips, fertigt SMIC ohne EUV, mit DUV-Mehrfachbelichtung (Tom's Hardware, SemiAnalysis). Laut Reuters (17.12.2025) testet China einen eigenen EUV-Prototyp. Was stimmt: ASML baut als einzige Firma der Welt EUV-Maschinen, und alle führenden KI-Chips (Nvidia, AMD, Google, Amazon, gefertigt bei TSMC) laufen durch sie. → „the only machines that can print the most advanced chips“ oder „almost every advanced A.I. chip“.
3. **Draghi-Umsetzung „~10 %“ (Vorrecherche) ist veraltet.** Laut EPIC-Index (Juli 2026) sind 15,7 % voll umgesetzt (60 von 383 Maßnahmen). Andere Zähler: 16–30 % (F12). Der Gerüstsatz „ein Jahr später fast alles schlimmer“ hat einen Originalsatz von Draghi (16.9.2025): „One year on, Europe is therefore in a harder place.“
4. **„Spar- und Investitionsunion: Kern im Okt. 2026 vereinbart“ stimmt so nicht.** Am 9.10.2026 haben die Finanzminister nur die **Verhandlungsposition des Rats** zum Markt- und Aufsichtspaket beschlossen. Darin ist die Aufsicht durch die EU-Behörde ESMA abgeschwächt, Kommission und EZB kritisieren das. Das Parlament hat noch keine Position. Wirklich vereinbart ist die Verbriefung (Rat und Parlament vorläufig am 21.10.2026, noch nicht formell beschlossen). → Feld „halb“ passt, Gold nicht.
5. **Mistral-Runde: Hauptinvestor war Samsung, der EU-Fonds war Mitführer.** Am 8.9.2026 sammelte Mistral 3 Mrd. € ein, bewertet mit über 21 Mrd. €. Samsung führte die Runde, PSG Equity und der Scaleup Europe Fund führten mit. „Mit europäischem Fonds“ stimmt, „europäisches Geld hat es bezahlt“ wäre falsch. Neue Verbindung zum Hook: Die Runde davor (Sept. 2025) führte **ASML** an, mit 1,3 Mrd. €. Die Maschine aus Station 1 steckt also schon in der KI-Firma aus Station 2.
6. **EU Inc „frühestens 2028“ hat jetzt eine Grundlage, als Position des Rats.** Die Kommission wollte, dass das Gesetz 12 Monate nach Inkrafttreten gilt. Der Rat will 21 Monate, manche Teile nicht vor dem 31.7.2028 (laut Freshfields). Im Parlament scheiterten die Berichterstatter am 11.11.2026 zum dritten Mal an der Mitbestimmung der Beschäftigten. Die geplante Abstimmung im Plenum fiel aus (Agence Europe). Wichtig: EU Inc ist eine **28. Wahlmöglichkeit**, kein Ersatz für die 27 nationalen Firmenformen.
7. **„Strom im Schnitt das Doppelte“ gilt nur für die energieintensive Industrie.** IEA (Feb. 2026): Für solche Firmen kostete Strom in der EU 2025 „over twice US levels“. Für Haushalte gilt die Zahl nicht. 2026 wurde der Abstand größer (F25). → „For heavy industry …“ statt „im Schnitt“.
8. **Gigafactory-Frist 3.12.2026 stimmt, aber nur für die großen.** Ursprünglich endete die Ausschreibung am 12.11.2026. Am 5.11. wurde die Frist geteilt: Los 2 (große Gigafactories) bleibt beim **3.12.2026, 17:00 Uhr**, Los 1 (mittlere) läuft bis **4.2.2027**. Wegen eines technischen Fehlers mussten alle Bieter neu einreichen (HPCwire 6.11.2026). Von bis zu 10 Mrd. € öffentlichem Geld sind jetzt nur rund 2 Mrd. € EU-Geld verfügbar. Der Rest hängt am nächsten EU-Haushalt.
9. **„Haushalt 2027“ im Schluss: Das Fenster ist jetzt.** Diese Woche (26.–27.11.2026) verhandeln die Staats- und Regierungschefs auf einem Sondergipfel über den EU-Haushalt 2028–2034, eine Einigung ist für Dezember angepeilt. Der Vorschlag von Ratspräsident Costa (21.11.) kürzt den neuen Wettbewerbsfonds auf ~223 Mrd. € (−19 % ggü. Kommission). Von der Leyen sagte am 13.11.: Europa braucht für Technologie-Souveränität „at least 500 billion euro“. Ihren Finanzierungsvorschlag hat sie „bis Ende November“ angekündigt (noch nicht gesehen). → Termine im Schluss: siehe Tabelle „Das Fenster“.
10. **Neu und stark für den Leitgedanken: Dublin, 13.11.2026.** Den ersten KI-Gipfel der EU-Staats- und Regierungschefs eröffnete Mistral-Chef Arthur Mensch. Laut AFP sagte er: „Europe has all the technology and the talent to lead the AI race. What it needs now is speed, financing and a strong coordination between member states.“ Das ist unser „27 Teile“-Satz, aber aus dem Mund eines Firmenchefs mit Eigeninteresse. Nur als Zitatkarte, ein Video fand ich nicht.
11. **Neu: ASML verkauft in Europa fast nichts.** Im 1. Halbjahr 2026 gingen 0 % der ASML-Verkäufe nach Europa (2025: 1 %, 2024: 5 %). ASML-Vorstand Heemskerk: „Because Europe is not investing and … no chip factories are being built in Europe.“ Das ist das Bild „alle Teile da, nichts zusammengesetzt“ in einer Zahl.
12. **„Fabriken mit 100 Jahren Daten“ ist so nicht belegt.** Belegt ist nur eine Aussage von Siemens-Manager Peter Koerte (Fortune 5.10.2026): Mehr als die Hälfte der Fortune-500-Europe-Firmen ist über 100 Jahre alt, ihre Daten liegen nicht im Internet. Siemens verkauft genau diese Industrie-KI (§1.9a). Laut Eurostat nutzen nur 20 % der EU-Firmen KI. Von der Leyens „37 %“ aus Dublin passt nicht zu Eurostat → nicht verwenden.
13. **Ein EU-weites „Schnell-Visum“ gibt es nicht.** Es gibt den EU-Talentpool (Verordnung 2026/1047, eine Plattform für Mangelberufe), die Blaue Karte und nationale Programme. „Gleiche Mitarbeiteraktien in ganz Europa“ steckt im EU-Inc-Vorschlag (Steuer erst beim Verkauf). → Teil 5 hängt an Teil 2, eine schöne Verbindung im Bausatz.
14. **CERN für KI: Der „Pilot ~100 Mio. €“ stimmt (RAISE, 107 Mio. €), „30–100 Mrd. €“ nur zur Hälfte.** Belegt sind 30–35 Mrd. € in drei Jahren (Thinktank CFG). Die 100 Mrd. € fand ich nicht → weglassen. Die von Deutschland, Frankreich und der Kommission angekündigte Frontier AI Initiative (18.11.2025) hat bis heute keine Struktur. Neu ist seit 17.11.2026 nur ein Förderaufruf über 44 Mio. €.
15. **CERRE-Gegenstimme (Station 3) nicht gefunden.** Den Satz „Mit diesen Strompreisen gewinnt Europa das Rechenrennen nie“ fand ich bei CERRE nicht. Belegter Ersatz mit derselben Aussage ist Bruegel PB 18/2026: Selbst wenn alles Geplante gebaut wird, steigt der EU-Anteil bis 2031 nur auf ~5,6 % (F30).
16. **Hook „answers your doctor“ und Station 6 „Kliniken“:** Medizin höchstens als Wort (§2.5c). Vorschlag: „which A.I. reads your contracts, sits in your job interview, decides on your loan“.
17. **CERN ist Teilchenphysik.** Der Name kommt von „nucléaire“, aber dort wird kein Atomstrom gemacht. Englisch: „a physics lab“.
18. **Überschneidungen (nicht wiederholen, höchstens kurz zurückgreifen):**
   - **#13 (AI Bubble):** „Europe is planning giant computing hubs for artificial intelligence, with public and private money.“ und Einblendung „EU: AI Gigafactories (tender until Nov 2026)“. → Bei uns nur neue Fakten: geteilte Frist, Neueinreichung, nur 2 Mrd. € da.
   - **#14 (Few people control):** Epoch „five companies ~71 % of the world's AI computing power“. → nicht verwenden.
   - **#18 (End capitalism):** „The doors are the things that can't be copied. The ground. The power. The chips.“, dazu die Nvidia-Marge und Altmans Strom-Satz. → Die Dreierreihe nicht nachbauen.
   - **#08 / #09:** EU-KI-Gesetz mit Reallaboren („Europe's new law makes every member country set up … a sandbox“) und das Verbot von Emotionserkennung am Arbeitsplatz. → „zu viele Regeln“ nicht über diese Beispiele erzählen.
   - **#68 (USA gegen China, läuft parallel):** Epoch 72 % USA / 10 % China, China >2× Strom und 6× Neubau, 600.000 H200 in Hongkong, Huang, Trump–Xi, eine eigene Runde „THE POWER“. #68 endet mit einer leeren Bahn „EUROPE“ auf der Anzeigetafel. → 72/10 nicht nennen. Der Fachname „THE POWER“ wäre doppelt, bei uns besser „CHEAP POWER“ oder „THE ENERGY“. Möglicher Brückensatz, wenn #68 vorher erscheint: die leere vierte Bahn.
   - **#31 (AI 2027):** Rennen USA–China mit Kontrollverlust. → hier nicht aufmachen.
19. **Clips: Quelle grün heißt nicht frei von Ansprüchen.** Die Draghi-Rede (C1) und das Dublin-Statement von der Leyens (C3) kommen von offiziellen Kanälen der Kommission (C3 mit CC BY). Dieselben Aufnahmen haben aber Fremdkanäle hochgeladen, die laut YouTube-Schnittstelle Content-ID-Partner sind (`licensedContent`): EU Debates, APT, DWS News, DRM News und Europe Pulse. Ein Anspruch auf unseren Film ist also möglich, auch wenn wir aus dem Original schneiden. Für die Quellen von C2 (Mensch) und C4 (Siemens) fand ich keine solche Fremdkopie, allerdings mit begrenzter Suche. Details und Prüfliste in `clips.json`.

---

## Der Bausatz: Stand der fünf Teile am 23.11.2026 (Bildecke)

| Teil | Feld | Stand | stärkster Beleg | nächstes Datum |
|---|---|---|---|---|
| 1 THE MONEY | **halb** | Rats-Position zum Kapitalmarkt (9.10.), Verbriefung vorläufig geeinigt (21.10.), Scaleup Europe Fund investiert (ICEYE Aug., Mistral Sept.) | ~10 Bio. € Erspartes auf Bankkonten | Position des Parlaments offen |
| 2 ONE MARKET | **Creme** | EU Inc: Vorschlag 18.3.2026, Rat 23.10.2026, Parlament hängt (11.11.) | Firma in 48 Stunden, unter 100 €, ohne Mindestkapital | frühestens 2028 |
| 3 THE POWER | **halb** | Gigafactory-Ausschreibung läuft, nur ~2 Mrd. € EU-Geld sicher | Industrie-Strom >2× USA (IEA) | **3.12.2026** (Los 2), 4.2.2027 (Los 1), Auswahl Anfang 2027 |
| 4 ONE LAB | **Creme** | RAISE-Pilot 107 Mio. €, Frontier AI Initiative ohne Struktur, Förderaufruf 44 Mio. € | echtes „CERN für KI“: 30–35 Mrd. € in 3 Jahren (CFG) | 18.3.2027 (Aufruf schließt) |
| 5 THE MINDS | **offen** | Choose Europe 500 Mio. € (2025–27), Talentpool-Gesetz 2026, EU-Aktienoptionen nur im EU-Inc-Vorschlag | US-Gehälter 30–70 % höher; Wechsel EU→USA −45 % (2023–25) | — |

## Das Fenster: Termine für Hook und Schluss

| Datum | Was | Sicherheit |
|---|---|---|
| 26.–27.11.2026 | Sondergipfel zum EU-Haushalt 2028–2034 (Costa-Vorschlag vom 21.11.) | sicher |
| bis Ende Nov. 2026 | Von der Leyens Finanzierungsvorschlag für Technologie-Souveränität (angekündigt 13.11.) | dünn |
| ~Ende Nov. 2026 | Maßnahmen des Industrie-KI-Gesandten Snabe („in two weeks“, von der Leyen am 13.11.) | dünn |
| **3.12.2026, 17:00** | Frist Los 2: große KI-Gigafactories | sicher |
| Dez. 2026 | Europäischer Rat, Haushaltseinigung angestrebt | sicher (Ziel) |
| 4.2.2027 | Frist Los 1: mittlere Gigafactories | sicher |
| 5.2.2027 | Klausur der Staats- und Regierungschefs (Alden Biesen), wieder KI | umstritten (Berichte) |
| Anfang 2027 | Auswahl der Gigafactories, Baubeginn 2027 | sicher (Plan) |
| 18.3.2027 | Förderaufruf „EU Frontier AI Initiative“ (44 Mio. €) schließt | dünn |
| 2.12.2027 | Hochrisiko-Regeln des EU-KI-Gesetzes gelten (verschoben vom 2.8.2026) | sicher |
| frühestens 2028 | erste EU-Inc-Firmen | umstritten |
| Herbst 2028 | SPRIND: bis zu 3 Siegerteams sollen je bis zu ~1 Mrd. € einsammeln | sicher (Plan) |
| 2031 | Bruegel-Prognose: EU-Anteil an KI-Rechenleistung ~5,6 %, wenn sich nichts ändert | sicher (Prognose) |

---

## Hook (0:00–1:00)

**F1 · Die eine Zahl: jeder zwanzigste** · sicher
Bruegel, Policy Brief 18/2026 (Martens und Schenk, Sept. 2026, Daten Europe2031.ai): EU 2026 ~2 GW betriebsbereite KI-Rechenleistung, „nearly 5 percent of global installed capacity“. Epoch AI (Zolldaten zu KI-Chips seit 2022, Stand Q2 2026, in H100-Äquivalenten): EU 5,1 %.
Quellen: [Bruegel PB 18/2026](https://www.bruegel.org/policy-brief/how-can-europe-address-its-pressing-ai-compute-infrastructure-shortfall) · [PDF](https://www.bruegel.org/sites/default/files/2026-09/PB%2018%202026.pdf) · [Epoch AI, Geopolitics](https://epoch.ai/topics/geopolitics)
Sag: „Guess how much of the world's computing power for A.I. sits in the European Union. About one twentieth.“
Achtung: Die einzige Zahl in Minute 1, keine Jahreszahl. „Europe“ nur mit „one in fifteen“ (0.1). Die US-Zahl nicht nennen (#68).

**F2 · Der Abgesang, den alle kennen** · sicher
Marktcheck: Chatham House (26.1.2026) „China has already won the tech race with the US, and left Europe far behind“ (855k Aufrufe), Front Page „Europe Is Failing…“ (373k), Hoog „Europe is completely unprepared“ (297k).
Quelle: `marktcheck-2026-11-23.md`
Sag: „Everyone says Europe has already lost this race.“
Achtung: Laut Marktcheck kein Zitat und kein Name vor 0:30.

**F3 · Warum es dich betrifft: Mitsprache** · sicher (gesagt), Wortlaute dünn
Arthur Mensch (Mistral), Ausschnitt vom 7.11.2026: „Rely on someone else's AI and you become a client state“ (Videotitel). Laut Beschreibung geht es um lebenswichtige Systeme, vor allem Verteidigung und Verwaltung. Vor der französischen Nationalversammlung (12.5.2026) sagte er laut Berichten: Europa habe etwa zwei Jahre, sonst werde es ein „vassal state“ der US-Technik. Von der Leyen in Dublin (13.11.2026): „every generation faces a technological turning point … For ours, it is artificial intelligence.“ Mensch (Le Monde, Okt. 2026, in Dublin wiederholt): Europa gibt pro Jahr ~260 Mrd. € für ausländische Technik aus. Eine AFP-Fassung nennt 285 Mrd. $.
Quellen: [YouTube, Lisa Burke](https://www.youtube.com/watch?v=69_J39KSCNI) · [Trending Topics](https://www.trendingtopics.eu/mistral-ceo-warns-europe-could-become-us-vassal-state-within-2-years/) · [Frenchweb](https://www.frenchweb.fr/ia-ou-va-l-argent-que-l-europe-depense/900000044)
Sag: „Whoever builds the A.I. gets a say in how it treats you. And right now, that's almost never Europe.“
Achtung: „almost none of that A.I. is European“ hat keine harte Zahl. Als Bild sagen; die nächste Zahl ist Lowy (US-Modelle >90 % des Verkehrs auf US- und China-KI-Seiten, Recherche #68). „client state“ ist Menschs Wort, und Mistral verkauft die Alternative.

**F4 · Die Maschine (Hook-Fassung, ohne Zahl)** · sicher
ASML in Veldhoven (Niederlande) baut als einzige Firma der Welt kommerzielle EUV-Belichtungsmaschinen. Ohne sie entsteht kein Chip der neuesten Generation. Analysten nennen ASML „the only game in town“ (Yole); im gesamten Lithografie-Markt hat ASML ~90 % (Reuters-zitiert).
Quellen: [DCD 2026](https://www.datacenterdynamics.com/en/news/asmls-revenue-share-drops-to-zero-percent-in-europe-says-its-sold-absolutely-nothing-in-the-region-this-year) · [Bruegel Mai 2026](https://www.bruegel.org/analysis/revamping-europes-chips-strategy-indispensability-not-self-sufficiency)
Sag: „And the only machines on Earth that can print the most advanced chips are built here, in Europe.“
Achtung: Nicht „every A.I. chip“ (0.2).

---

## Station 1 · Was ist schon da? (1:00–2:15)

**F5 · Die Maschine in Zahlen** · sicher (Größe, Alleinstellung), umstritten (Gewicht, Transport)
Eine Standard-EUV-Maschine ist „roughly the size of a bus“ (Asia Times). Für den Transport braucht ASML nach eigener Angabe ~40 Container, 20 Lkw und 3 Frachtjumbos. Das neueste Modell (High-NA EXE:5200) kostet ~380–400 Mio. $ und wiegt 150–165 t. Reuters schrieb 2023: „the size of double-decker buses, weighing over 200 tonnes“. Die erste High-NA-Lieferung an Intel (Oregon) kam in 250 Kisten und 43 Containern. ASML im 3. Quartal 2026: 11,7 Mrd. € Umsatz, 5,0 Mrd. € Gewinn; Jahresziel 2026: 44–45 Mrd. €.
Quellen: [Data Center Knowledge](https://www.datacenterknowledge.com/ai-data-centers/asml-shows-off-380m-165-ton-machine-behind-ai-shift) · [Reuters via AOL](https://www.aol.com/news/focus-computer-chip-giant-asml-050005176.html) · [Igor's Lab](https://www.igorslab.de/en/asml-rejects-euv-allegation-no-lithography-system-or-special-components-delivered-to-china/) · [ASML Q3 2026](https://seekingalpha.com/pr/20684919)
Sag: „Each one is the size of a bus. Shipping one fills three cargo jets. The newest model costs around four hundred million dollars.“
Achtung: Die Gewichte widersprechen sich, also kein Gewicht nennen. Die „three cargo jets“ sind ASMLs Angabe für das Standardmodell.

**F6 · ASML verkauft in Europa (fast) nichts** · sicher
Im 1. Halbjahr 2026 gingen 0 % der ASML-Verkäufe nach Europa (2025: 1 %, 2024: 5 %, 2023: 4 %, 2022: 2 %). Heemskerk, ASML-Vorstand für Public Affairs: „Because Europe is not investing and … no chip factories are being built in Europe.“ Er will, dass die EU Nachfrage nach Chips aus Europa schafft. Tom's Hardware hält ihn für zu pessimistisch: Die neuen Fabriken in Europa sind nur keine Spitzenfabriken.
Quelle: [DCD, Sept. 2026](https://www.datacenterdynamics.com/en/news/asmls-revenue-share-drops-to-zero-percent-in-europe-says-its-sold-absolutely-nothing-in-the-region-this-year)
Sag: „Its own executive says it has sold 'absolutely nothing' in Europe this year. Almost every machine leaves the continent.“
Achtung: „absolutely nothing“ steht in der DCD-Überschrift als ASML-Aussage; der Wortlaut ist am Original zu prüfen.

**F7 · Mehr Menschen als die USA** · sicher
EU am 1.1.2026: 452,0 Mio. Menschen (Eurostat, 10.7.2026). USA am 1.7.2025: 341,8 Mio. (US Census, 27.1.2026).
Quellen: [Brussels Times zu Eurostat](https://www.brusselstimes.com/2223770/eus-population-grew-by-more-than-700000-people-in-2025) · [US Census](https://census.gov/newsroom/press-releases/2026/population-growth-slows.html)
Sag: „The European Union has over a hundred million more people than the United States.“

**F8 · Sauberer Strom ist da** · sicher (Frankreich), dünn (Norwegen, Macron)
Frankreich 2025: Atomkraftwerke lieferten 373 TWh = 68,1 % des Stroms; 95,2 % waren CO₂-arm (RTE, Bilan électrique 2025, März 2026). Macron sagte in Davos (20.1.2026) laut Berichten, Frankreich habe „90 TWh“ CO₂-armen Strom übrig, dazu Flächen für Rechenzentren. Norwegen erzeugt fast nur Wasserkraft (Anteil nicht geprüft).
Quellen: [RTE Bilan 2025 (PDF)](https://assets.rte-france.com/analyse-et-donnees/2026-03/BE2025%20-%20Rapport%20Complet.pdf) · [Élysée, Davos 2026](https://www.elysee.fr/en/emmanuel-macron/2026/01/20/world-economic-forum-2026-in-davos)
Sag: „France makes two thirds of its electricity in nuclear plants. Almost all of it is clean.“
Achtung: Norwegens Anteil am Original prüfen, sonst nur „Norway's rivers“.

**F9 · Alte Industrie, wenig KI** · umstritten (Firmenaussage)
Koerte (Siemens) in Fortune (5.10.2026): Mehr als die Hälfte der Fortune-500-Europe-Firmen ist über 100 Jahre alt. Industrie-KI lernt aus Konstruktions- und Fabrikdaten, nicht aus Sprache. Wörtlich: „BMW or AstraZeneca is not going to put their data on the internet, so they need to trust others to train these models using their data.“ Laut Eurostat nutzen erst 20 % der EU-Firmen KI (F46).
Quelle: [Fortune 5.10.2026](https://fortune.com/2026/10/05/siemens-europe-industrial-ai-advantage-data-manufacturing-peter-koerte/)
Sag: „More than half of Europe's biggest companies are over a hundred years old, says one Siemens executive. And their factory data has never been on the internet.“
Achtung: Siemens verkauft Industrie-KI. Hier nur anreißen, Station 6 nutzt dieselbe Quelle.

**F10 · Draghis Plan** · sicher
Draghi-Bericht (9.9.2024): Europa muss jedes Jahr 750–800 Mrd. € zusätzlich investieren, 4,4–4,7 % der EU-Wirtschaftsleistung 2023. Zum Vergleich: Der Marshallplan (1948–51) entsprach 1–2 %. Dazu steht im Bericht (aus dem Bericht bekannt, in dieser Runde nicht nachgeschlagen): Rund 30 % der in Europa gegründeten Firmen mit über 1 Mrd. $ Wert (2008–2021) verlegten ihren Sitz ins Ausland, meist in die USA.
Quelle: [Draghi-Bericht Teil A (PDF)](https://commission.europa.eu/document/download/97e481fd-2dc3-412d-be4c-f152a8232961_en)
Sag: „Mario Draghi, the man who once saved the euro, wrote down the plan: Europe would need to invest up to eight hundred billion euros more. Every year.“
Achtung: Die 30 %-Zahl vor Verwendung im Bericht nachschlagen.

**F11 · Ein Jahr später: „a harder place“** · sicher (offizieller Redetext)
Draghi bei der Konferenz zum ersten Jahrestag des Berichts in Brüssel (16.9.2025): „One year on, Europe is therefore in a harder place. Our growth model is fading. Vulnerabilities are mounting. And there is no clear path to finance the investments we need.“ Später in der Rede: „inaction threatens not only our competitiveness but our sovereignty itself.“ Der Bedarf liegt laut EZB inzwischen bei ~1,2 Bio. € pro Jahr (2025–2031). Der öffentliche Anteil steigt von 24 % auf 43 %, vor allem wegen Verteidigung.
Quellen: [Redetext, Kommission (PDF)](https://commission.europa.eu/document/download/0951a4ff-cd1a-4ea3-bc1d-f603decc1ed9_en?filename=Draghi_Speech_High_Level_Conference_One_Year_After.pdf) · [Eunews 16.9.2025](https://www.eunews.it/en/2025/09/16/draghi-takes-aim-at-member-states-one-year-on-every-challenge-has-worsened/) · [Video Kommission](https://www.youtube.com/watch?v=WLpNjgs4TFQ)
Sag: „A year later he came back and said: 'One year on, Europe is therefore in a harder place.'“
Achtung: Clip-Kandidat C1. Presseberichte übersetzen teils „more difficult“: nur den Redetext zitieren.

**F12 · Wie viel umgesetzt ist** · umstritten (verschiedene Zähler)
EPIC-Index (Juli 2026): 60 von 383 Maßnahmen voll umgesetzt = 15,7 % (Sept. 2025: 11,2 %, Jan. 2026: 15,1 %). Mindestens begonnen: 41,3 %, bei Digitalem und KI 29,8 %. Andere Zähler: JEDI 26 % (Euronews 10.9.2026), Banco de España ~16 %, Institut Montaigne „30 % unterwegs“ (Juni 2026). Von der Leyen traf Draghi am 20.7.2026.
Quellen: [EU Alive](https://eualive.net/von-der-leyen-tells-draghi-the-eu-is-serious-but-only-15-7-of-his-report-has-been-implemented/) · [EU Insider](https://www.euinsider.eu/news/epic-draghi-ai-benefit-not-restrain-digital-29-8-percent-2026) · [Euronews 10.9.2026](https://www.euronews.com/2026/09/10/eu-falls-short-on-draghi-reform-agenda-new-report-shows) · [Institut Montaigne](https://www.institutmontaigne.org/en/publications/implementing-draghi-report-moment-truth)
Sag: „Two years later, only about one in six of his proposals has been fully carried out.“
Achtung: Quelle EPIC nennen, es ist eine Messung von mehreren.

**F13 · Draghi 2026: Hoffnung und Bremse** · sicher (Leuven), umstritten (Aachen-Wortlaut)
Rede an der KU Leuven (Ehrendoktor, 2.2.2026): „Of all those now caught between the United States and China, Europeans alone have the option to become a genuine power themselves.“ (wörtlich in der Beschreibung des AFP-Videos mit O-Ton). Er warnt, sonst werde Europa „subordinated, divided and deindustrialised“; sein Weg ist „pragmatic federalism“: wer will, geht voran. Karlspreis-Rede in Aachen (14.5.2026): Beschlüsse gingen durch „committees that dilute and delay“ (Wortlaut je nach Bericht etwas anders).
Quellen: [AFP-Video](https://www.youtube.com/watch?v=D7m2SjqIFe4) · [Euronews 2.2.2026](https://euronews.com/my-europe/2026/02/02/eu-must-become-a-genuine-federation-to-avoid-deindustrialisation-and-decline-draghi-says) · [Atlantic Council](https://www.atlanticcouncil.org/content-series/inflection-points/mario-draghi-yet-again-has-issued-a-wake-up-call-to-europe/) · [Il Sole 24 Ore, Aachen](https://en.ilsole24ore.com/art/mario-draghis-speech-in-aachen-AI72ln4C)
Sag: „And this year he added: of everyone caught between America and China, only Europeans have the option to become a real power themselves.“
Achtung: Clip-Alternative C1b (Uni-Video, Ampel grün). „Federation“ ist ein politisches Reizwort: Es ist seine Position, nicht unsere (§1.7).

---

## Station 2 · Teil 1 THE MONEY + Teil 2 ONE MARKET (2:15–3:45)

**F14 · Zehn Billionen auf dem Konto** · sicher
Kommission (Spar- und Investitionsunion, 19.3.2025, Eurostat-Daten): „About 70% of household savings in the EU – worth €10 trillion – are held as bank deposits.“ Der Rat schreibt dazu: in „low-yield bank deposits rather than being invested in capital markets“. Europäische Haushalte sparen jedes Jahr ~1,4 Bio. € neu, amerikanische ~800 Mrd. € (Euronews). Revolut zählt anders, nur flüssige Einlagen in 20 Ländern: 6,3 Bio. € (Euronews 15.9.2026).
Quellen: [Kommission 19.3.2025](https://commission.europa.eu/news-and-media/news/savings-and-investments-union-better-financial-opportunities-eu-citizens-and-businesses-2025-03-19_en) · [Rat](https://www.consilium.europa.eu/en/policies/savings-and-investments-union-siu/) · [Euronews 15.9.2026](https://www.euronews.com/2026/09/15/trillions-sitting-idle-heres-how-much-money-europeans-are-losing-on-savings)
Sag: „Europeans keep about ten trillion euros in their bank accounts.“
Achtung: Das Geld liegt nicht „brach“, Banken verleihen es weiter. Der Punkt ist: Kaum etwas davon wird Wagniskapital für junge Firmen. Also kein „idle money“.

**F15 · Junge Firmen finden das Geld in Amerika** · umstritten
Stanford AI Index 2026 (April 2026): Private KI-Investitionen 2025 in den USA 285,9 Mrd. $, in Europa 20,9 Mrd. $ (Europa mit UK), also ~14-mal so viel. Einzeln: UK 5,9, Frankreich 4,4, Deutschland 3,9 Mrd. $. Atomico (18.11.2026): Europäische Start-ups sammeln 2026 ~81 Mrd. $ ein (+62 %), davon fließen 20 Mrd. $ in Rechenzentren und KI (2025: 9,5). Dazu 40.000 neue Gründer (+36 %), aber US-Kapital wächst schneller.
Quellen: [Stanford HAI, Economy](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy) · [tech.eu 18.11.2026](https://tech.eu/2026/11/18/investment-in-european-startups-surges-to-81bn-but-capital-concentration-is-a-challenge-for-startups-says-atomico/)
Sag: „Last year, private investors put about fourteen times more money into A.I. in America than in all of Europe.“
Achtung: Die Europa-Zahl stammt aus einer Grafikbeschriftung (Sekundärseiten): vor dem Skript im Stanford-PDF, Kapitel 4, prüfen.

**F16 · Der Plan: die Spar- und Investitionsunion** · sicher (Stand), dünn (Datum Spar-Konten)
Die Bausteine: Die Kommission empfiehlt steuerlich begünstigte Spar- und Investitionskonten (Herbst 2025, Datum prüfen). Zum Paket für Marktintegration und Aufsicht gibt es seit 9.10.2026 die Rats-Position, mit schwächerer ESMA-Aufsicht, was Kommission und EZB kritisieren. Bei der Verbriefung einigten sich Rat und Parlament am 21.10.2026 vorläufig. Der Ansatz sind Anreize, niemand muss sein Erspartes abgeben.
Quellen: [Eunews 9.10.2026](https://www.eunews.it/en/2026/10/09/financial-markets-ecofin-curbs-esmas-supervisory-powers-drawing-criticism-from-the-european-commission-and-the-ecb/) · [Brussels Times](https://www.brusselstimes.com/2354297/eu-targets-financial-overhaul-to-unify-markets-and-reshape-savings-into-investment) · [Brussels Times, Verbriefung](https://www.brusselstimes.com/2373635/new-eu-securitisation-deal-balances-simpler-lending-with-tougher-risk-controls)
Sag: „The plan isn't to take anyone's savings. It's to make investing them in Europe easier, and more worth it.“

**F17 · Gegenstimmen zum Geld** · sicher (gesagt)
Karel Lannoo vom Thinktank CEPS (12.2.2026): Die Spar-Union hatte „a bad start“, er fordert eine „emergency brake“. Die EZB (Finanzintegrationsbericht 2026) erwartet von Spar-Konten nur eine „modest“ Wirkung, weil Haushalte Einlagen stark bevorzugen. Finance Watch (2026): 34 von 59 geprüften Finanz-Influencer-Posts warnten nur schwach vor Risiken. Wer mehr Kleinsparer an die Börse holt, holt sie auch ins Risiko. Der Verbraucherverband BEUC sagt, Vertrauen brauche strenge Regeln.
Quellen: [CEPS (PDF)](https://cdn.ceps.eu/2026/02/Lannoo-No-104-RIS.pdf) · [EZB](https://www.ecb.europa.eu/press/fie/html/ecb.fie202605~c4c6cabe93.en.html) · [ppc.land zu Finance Watch](https://ppc.land/58-of-finfluencer-posts-give-weak-risk-warnings-finance-watch-finds/)
Sag (Gegenstimme, ein Satz): „Critics say it's moving too slowly, and that pushing savers into markets also pushes them into risk.“
Achtung: Das Gerüst schreibt „Kritiker fürchten Lenkung“. Das fand ich nicht belegt; belegt sind „zu langsam/verwässert“ und „Risiko für Kleinsparer“.

**F18 · Der europäische Wachstumsfonds** · sicher
Scaleup Europe Fund: Zielgröße 5 Mrd. €, verwaltet von EQT (ausgewählt im Mai 2026), rechtlich gegründet am 4.8.2026. Die erste Investition ging an ICEYE (finnische Radarsatelliten), als Mitführer einer Runde über 1 Mrd. € (5.8.2026). Danach folgte Mistral (8.9.2026). Der Fonds ist noch nicht voll.
Quellen: [EQT 5.8.2026](https://eqtgroup.com/news/eqts-scaleup-europe-fund-makes-first-investment-co-leads-1-billion-funding-round-in-iceye-europes-leader-in-sovereign-intelligence-from-space-2026-08-05) · [Sifted](https://sifted.eu/articles/scaleup-europe-fund-investing/)
Sag: „This year, Europe set up its own fund to help its biggest start-ups grow without leaving.“

**F19 · Mistral** · sicher (Runde), umstritten (Umsatz)
Am 8.9.2026 sammelte Mistral 3 Mrd. € ein, bewertet mit über 21 Mrd. € (~24 Mrd. $). Samsung Electronics führte die Runde, PSG Equity und der Scaleup Europe Fund führten mit (Reuters, Bloomberg). Die Runde davor (Sept. 2025, Bewertung 11,7 Mrd. €) führte ASML mit 1,3 Mrd. € an. Insgesamt hat Mistral ~7,5 Mrd. $ eingesammelt, Kredite eingerechnet (20VC, 9.11.2026). Umsatzziel laut Mensch (Davos, Jan. 2026): „We should cross a billion by the end of the year“, ob in Euro oder Dollar, ist unklar. Rechenzentren entstehen in der Region Essonne (Bruyères-le-Châtel, Kredit 830 Mio. $; Les Ulis, 10 MW), Ziel 1 GW bis 2029. Die Rechner laufen auf Nvidia-Chips.
Quellen: [Reuters via Euronext](https://live.euronext.com/en/financial-news/french-ai-company-mistral-hits-24-billion-valuation-funding-round) · [Bloomberg 8.9.2026](https://www.bloomberg.com/news/articles/2026-09-08/mistral-ai-raises-at-21-billion-valuation-in-samsung-led-round) · [Dataconomy](https://dataconomy.com/2026/09/08/mistral-ai-raises-3-billion-valuation-21-billion/)
Sag: „Mistral, Europe's best-known A.I. company, is now worth more than twenty-one billion euros. Among those leading its latest round: a new European fund. The round before was led by the company that builds the machine.“
Achtung: Größenordnung ehrlich halten, die US-Labore sind ein Vielfaches wert (hier nicht beziffert). Wegen der US-Chips nicht „fully European A.I.“ sagen. Gegenstimme, eine Woche alt: Laut manager magazin (16.11.2026, Caspar Schlenk und Sarah Heuberger) tragen Mensch und Mistral in der PR „teilweise ziemlich dick“ auf, und Mistral baut sein Geschäftsmodell um. Gelesen habe ich nur die Beschreibung des Videos ([YouTube](https://www.youtube.com/watch?v=9ZG0Md67anQ)), den [Artikel](https://www.manager-magazin.de/unternehmen/tech/mistral-ai-wie-europas-wertvollste-ki-firma-ihr-geschaeftsmodell-umbaut-a-f63bb448-0e1c-4c70-90ca-05a3df37ff1a) nicht. Vor dem Skript lesen, weil Mistral hier als Beleg dient.

**F20 · Arthur Mensch, die Stimme** · sicher (gesagt), Wortlaut umstritten
In Dublin (13.11.2026) sagte er laut AFP: „Europe has all the technology and the talent to lead the AI race. What it needs now is speed, financing and a strong coordination between member states.“ Eine andere Fassung lautet „… all the technology and talent it needs to lead in the AI race.“ Die Entscheidungen der nächsten zwei Jahre prägten das nächste Jahrzehnt: „act now“. Beim EIB-Forum 2026 (Gespräch mit Lisa Burke) sagte er, Europa habe das Talent, aber seine Regeln bremsten, etwa dreimonatige Kündigungsfristen („catastrophic“ hiring rules, Videotitel).
Quellen: [AI Understanding (AFP-Text)](https://aiunderstanding.org/news/mistral-chief-urges-eu-leaders-to-act-now-to-keep-europe-in-ai-race) · [Euronews 13.11.2026](https://euronews.com/2026/11/13/eu-leaders-discuss-how-to-boost-europes-ai-industry-while-tackling-risks-at-dublin-summit) · [YouTube, volles Gespräch](https://www.youtube.com/watch?v=wBuvZpf-Ato)
Sag (Zitatkarte): „Europe has all the technology and the talent to lead the A.I. race. What it needs now is speed, financing and coordination.“ (gekürzt, Kürzung kennzeichnen)
Achtung: Mistral profitiert von mehr EU-Geld und Kaufregeln für europäische KI. Im Text: „He has a stake in this. But …“

**F21 · EU Inc: eine Firma für 27 Länder** · sicher
Kommissionsvorschlag vom 18.3.2026 (das „28. Regime“): Gründung online in 48 Stunden (mit Mustersatzung), unter 100 €, kein Mindestkapital. Eine EU-Schnittstelle verbindet die nationalen Register, Steuer- und Umsatzsteuernummer kommen ohne zweite Einreichung. Beschäftigte können EU-Aktienoptionen bekommen, versteuert erst beim Verkauf (F43). Die Kommission wollte eine Einigung bis Ende 2026, das ist nicht mehr zu schaffen.
Quellen: [Kommission 18.3.2026](https://commission.europa.eu/news-and-media/news/eu-inc-making-business-easier-european-union-2026-03-18_en) · [Vorschlag (PDF)](https://commission.europa.eu/document/download/3e9822aa-8cef-40a1-904e-a53fc68e7265_en?filename=Proposal+for+an+EU+Inc+corporate+legal+framework.pdf) · [Osborne Clarke](https://www.osborneclarke.com/insights/eu-inc-commission-proposes-single-company-structure-all-27-member-states)
Sag: „One company for all twenty-seven countries. Set up online in two days, for less than a hundred euros.“
Achtung: EU Inc kommt als Wahlmöglichkeit neben den 27 nationalen Formen, nicht als Ersatz.

**F22 · EU Inc: wo es hängt** · sicher (Rat), dünn (Parlament)
Rat: Verhandlungsmandat am 23.10.2026 (Pressemitteilung 848/26). Firmen sollen zwischen 27 nationalen Formen und „EU Inc“ wählen können. Verhandelt wird, sobald das Parlament eine Position hat. Gelten soll das Gesetz 21 Monate nach Inkrafttreten, manche Teile nicht vor dem 31.7.2028 (Freshfields). Parlament: Berichterstatter ist René Repasi. Am 11.11.2026 scheiterte zum dritten Mal eine Einigung zur Mitbestimmung, die geplante Plenarabstimmung am 11./12.11. fiel aus (Agence Europe).
Quellen: [Rat 23.10.2026](https://www.consilium.europa.eu/en/press/press-releases/2026/10/23/eu-inc-council-adopts-position-on-a-new-eu-corporate-law-for-innovative-companies/) · [Agence Europe](https://agenceurope.eu/en/bulletin/article/13980/20/28th-regime-for-companies-european-parliament-rapporteurs-have-yet-to-resolve-worker-participation-provisions) · [Freshfields](https://www.freshfields.com/en/our-thinking/blogs/transactions/the-28th-regime-and-the-eu-inc-1-what-it-is-and-where-its-headed-102o9aa) · [Pinsent Masons](https://www.pinsentmasons.com/out-law/guides/eu-inc-proposal-overview)
Sag: „Governments agreed their version in October. Parliament is still arguing over workers' rights. Even if it all goes well, the first of these companies won't exist before twenty twenty-eight.“
Achtung: Keine Parteien nennen. Der Streit ist echt: Gewerkschaften fürchten, dass die Mitbestimmung umgangen wird. Niemand bremst aus Bosheit.

**F23 · Gegenstimme zu EU Inc** · dünn (Inhalt nur aus Titel und Kurzfassungen)
Enriques, Nigro und Tröger, „Why the 28th Regime Proposal Falls Short“ (Oxford Business Law Blog, März 2026): Der Vorschlag greife zu kurz. Ihre Begründung habe ich nicht gelesen. Der Gewerkschaftsbund ETUC (20.1.2026) sieht Gefahren für Mitbestimmung und Tarifsysteme. Pinsent Masons fragt, ob Gläubiger ohne Mindestkapital genug geschützt sind (vor allem in Deutschland).
Quellen: [ETUC](https://etuc.org/fr/node/26124) · [Bruegel-Podcast 25.3.2026 (mit Tröger)](https://www.youtube.com/watch?v=VeQnA2PZMEE)
Sag (ein Satz): „Critics say a new company form isn't one market yet, as long as everything around it stays national.“
Achtung: Den OBLB-Beitrag vor Verwendung lesen und das Argument genau zuordnen.

---

## Station 3 · Teil 3 THE POWER (3:45–5:00)

**F24 · Strom: mehr als doppelt so teuer** · sicher
IEA, Electricity 2026 (Feb. 2026): Energieintensive Firmen zahlten 2025 in der EU für Strom „over twice US levels“ und knapp 50 % mehr als in China. 2019 lag die EU nur ~50 % über den USA. Der CO₂-Preis lag bei ~75 €/t.
Quelle: [IEA, Electricity 2026, Prices](https://iea.org/reports/electricity-2026/prices)
Sag: „For heavy industry, electricity in the European Union costs more than twice as much as in America.“
Achtung: Gilt für die Industrie, nicht für Haushalte.

**F25 · 2026 wächst der Abstand** · sicher (IEA, Suchauszug)
IEA, Mid-Year Update (Juli 2026): Nach dem LNG-Schock durch die Hormus-Krise lagen die Großhandelspreise für Strom in der EU und in Japan im 2. Quartal 2026 mehr als 30 % über dem Vorjahr. In den USA blieben sie fast gleich.
Quelle: [IEA Mid-Year Update 2026](https://www.iea.org/reports/electricity-mid-year-update-2026/executive-summary)
Sag: „And this year, after the gas shock, the gap got wider.“
Achtung: Großhandelspreis ist nicht Industriepreis. Den Konflikt nur als Ursache nennen.

**F26 · Wo Strom billig und sauber ist** · sicher (Kernaussage), dünn (TWh-Zahlen)
Frankreich: siehe F8. Banque de France (Eco-Notiz 470, 4.11.2026, Nasr und Toulouse): Einheitliche Strompreise verraten Rechenzentren nicht, wo Strom knapp oder reichlich ist. Schweden teilte sich 2011 in vier Preiszonen, seitdem ziehen neue Industrieprojekte in den Norden zur Wasserkraft. Mehrbedarf der Rechenzentren bis 2030: +45 TWh in Europa, +240 TWh in den USA.
Quelle: [Banque de France, Billet 470](https://www.banque-france.fr/en/publications-and-statistics/publications/data-centres-and-energy-environmental-cost-faulty-price-signal)
Sag: „Sweden split its power market into zones. New industry moved north, to the cheap hydropower. That's the idea for A.I.: build where the clean power is.“
Achtung: Die 45/240 TWh stehen in der französischen Fassung (Suchauszug).

**F27 · Die Gigafactories** · sicher
Die EU-Rechenbehörde EuroHPC startete die Ausschreibung am 30.7.2026: bis zu 7 „AI Gigafactories“, je mit sehr vielen KI-Chips. Bis zu 10 Mrd. € kommen öffentlich (EU und Staaten), insgesamt sollen es über 30 Mrd. € werden, mindestens 20 Mrd. € privat. 18 Staaten haben die gemeinsame Beschaffung unterschrieben, darunter Deutschland, Frankreich und Spanien. Auswahl Anfang 2027, Baubeginn 2027. Ursprung ist InvestAI (Paris, 11.2.2025): 200 Mrd. €, darin ein Fonds über 20 Mrd. € für Gigafactories. Schon in Betrieb oder im Aufbau: 19 kleinere „AI Factories“.
Quellen: [EuroHPC 30.7.2026](https://www.eurohpc-ju.europa.eu/eurohpc-joint-undertaking-launches-ai-gigafactories-call-2026-07-30_en) · [Kommission](https://digital-strategy.ec.europa.eu/en/news/eu-launches-ai-gigafactories-call-boost-europes-computing-capacity-and-unlock-more-eu30-billion) · [Brussels Times](https://www.brusselstimes.com/eu-affairs/2252376/eu-unveils-e10b-plan-to-build-ai-gigafactories-seeks-private-investment-boost/)
Sag: „Up to seven giant A.I. factories. More than thirty billion euros, most of it from private investors.“
Achtung: Die Zahl „100.000 Chips pro Gigafactory“ ist nicht bestätigt, also nicht sagen.

**F28 · Die Frist: das Datum im Film** · sicher
Laut EuroHPC-Seite wurde die Frist am 5.11.2026 geteilt. Für Los 2 (große Gigafactories) gilt weiter der **3.12.2026, 17:00 Uhr (Luxemburger Zeit)**, für Los 1 (mittlere) der **4.2.2027, 17:00 Uhr**. Die Staaten sollen so ihre Haushaltsverfahren abschließen können. Laut HPCwire (6.11.2026) müssen wegen eines technischen Fehlers im Einreichsystem alle Bieter ihre Angebote neu anlegen. Jetzt verfügbar sind nur ~2 Mrd. € EU-Geld, der Rest hängt am Haushalt 2028–2034.
Quellen: [EuroHPC, Ausschreibung](https://www.eurohpc-ju.europa.eu/call-tenders-selection-artificial-intelligence-gigafactory-consortia-and-establishment-ai_en) · [HPCwire 6.11.2026](https://www.hpcwire.com/off-the-wire/eurohpc-requires-bidders-to-resubmit-ai-gigafactory-proposals/)
Sag: „Bids for the biggest ones are due on December third.“
Achtung: DCD vertauscht die Lose; maßgeblich sind HPCwire und EuroHPC. Viele Seiten nennen noch den 12.11. (veraltet).

**F29 · Wer bietet** · dünn
Bekannt ist ein nordisch-baltisches Konsortium „AI Gigafactory Northern“ mit Nokia, Nscale, Telia, Verda und Skeleton (TNW, Converge Digest; Datum nicht gesehen). Weitere Bieter sind nicht öffentlich.
Quellen: [TNW](https://thenextweb.com/news/ai-gigafactory-northern-nokia-nscale-telia-verda-skeleton) · [Converge Digest](https://convergedigest.com/nokia-nscale-ai-gigafactory-northern-eurohpc-bid/)
Sag: nur bei Bedarf: „Nokia is in one of the bids.“

**F30 · Gegenstimmen: Strom und Rechenleistung** · sicher (gesagt)
Bruegel PB 18/2026: Die geplanten Projekte heben den EU-Anteil bis 2031 nur auf ~5,6 %. Die fünf geplanten Gigafactories liefern zusammen ~750 MW (je 150 MW). Erst ~120 Mrd. € zusätzlich (+25 GW) würden den Anteil mehr als verdoppeln. TNW (vermutlich Juni 2026, Datum prüfen): „The EU's €20 billion plan for five AI gigafactories is falling apart before the first bid is even submitted“. Bloomberg Law berichtet ebenfalls von Verzögerungen und Finanzlücken. Laut SCMP fürchtet die Industrie, die Gigafactories vertieften die Abhängigkeit von US-Chips. Der WEF (Mai 2026) schreibt, ein Netzanschluss dauere in manchen Ländern bis zu zehn Jahre. Mensch selbst hat im 20VC-Gespräch ein Kapitel „Why Energy Is Not the Biggest AI Bottleneck Today“ (13:43; Inhalt nicht geprüft).
Quellen: [Bruegel PB 18/2026](https://www.bruegel.org/policy-brief/how-can-europe-address-its-pressing-ai-compute-infrastructure-shortfall) · [TNW](https://thenextweb.com/news/eu-ai-data-centre-gigafactory-delays-funding-stumble) · [Bloomberg Law](https://news.bloomberglaw.com/artificial-intelligence/eus-ai-data-center-plans-stumble-due-to-delays-funding-issues) · [SCMP](https://www.scmp.com/economy/article/3363338/europe-hails-ai-gigafactory-plan-industry-fears-deeper-us-tech-reliance) · [WEF Mai 2026](https://www.weforum.org/stories/2026/05/the-ai-race-is-becoming-a-race-to-power-and-europe-faces-new-test/)
Sag (Gegenstimme): „Even if everything planned gets built, the EU's share of the world's A.I. computing barely moves. From about five percent to under six.“
Für das Urteil im Gerüst („muss es auch nicht“): Bruegel (Mai 2026) rät bei Chips zu „indispensability, not self-sufficiency“. → „Europe doesn't need the biggest machine. It needs enough of its own, plus something everyone else needs.“

**F31 · Kaufregeln „Buy European“** · sicher (gesagt)
Am 3.6.2026 legte die Kommission ein Technologie-Souveränitätspaket vor: Chips Act 2.0 und ein Cloud- und KI-Gesetz (CADA), das europäische Anbieter bei öffentlichen Aufträgen bevorzugen soll. Interne Schätzung der Kommission: 120 Mrd. € für Chips und 200 Mrd. € für eigene Rechenzentren bis 2036. Kritik: Bruegel (Feb. 2026) schreibt, eine „buy European“-Regel „would subvert the European commitment to market competition“. Im Juni 2026 nannte Bruegel den angenommenen Preisaufschlag von 5 % unrealistisch. CERRE weist darauf hin, dass Aufträge ohnehin meist an heimische Bieter gehen. Es drohen also kleine nationale statt europäischer Champions.
Quellen: [Kommission 3.6.2026](https://digital-strategy.ec.europa.eu/en/news/commission-proposes-tech-sovereignty-package-strengthen-europes-digital-autonomy-and-resilience) · [Bruegel First Glance](https://www.bruegel.org/first-glance/europes-artificial-intelligence-strategy-should-be-built-european-strengths) · [Bruegel](https://www.bruegel.org/first-glance/achieve-tech-sovereignty-europe-must-not-mimic-its-rivals) · [CERRE](https://cerre.eu/publications/the-role-of-european-preference-in-europes-economic-strategy/)
Sag (nur falls Station 6 den Weg „mehr Markt“ braucht): „Some economists warn: if Europe only buys European, it pays more and gets less.“
Achtung: Welcher Bruegel-Text (Feb. oder Juni) zu welcher Adresse gehört, am Original prüfen.

---

## Station 4 · Teil 4 ONE LAB (5:00–6:15)

**F32 · Das Vorbild CERN** · dünn (Allgemeinwissen, hier nicht geprüft)
Das CERN bei Genf wurde 1954 von europäischen Staaten gegründet; dort entstand das World Wide Web. Heute forschen dort Tausende Menschen aus über 100 Ländern. CERN ist eine zwischenstaatliche Organisation mit eigener Leitung, keine EU-Behörde.
Sag: „After the war, Europe's countries pooled their money for one physics lab. It became one of the best in the world. The web was invented there.“
Achtung: Gründungsjahr, Mitglieder- und Nutzerzahlen vor dem Skript auf home.cern prüfen. Das stützt auch den Antwortsatz im Gerüst („CERN ist auch keine Behörde“).

**F33 · Das Versprechen „CERN für KI“** · sicher (Inhalt), Wortlaut dünn
Von der Leyen schlug ein „CERN for AI“ in ihren politischen Leitlinien vor (18.7.2024). Beim KI-Gipfel in Paris (11.2.2025) kündigte sie InvestAI an und sagte laut Telecoms.com, CERN lasse „the best and the brightest minds in the world work together … We want the same to happen in our AI Gigafactories.“ Telecoms.com überschrieb die Rede mit „Europe not late to the AI race, von der Leyen insists“; sinngemäß sagte sie, das Rennen sei „far from being over“.
Quellen: [Telecoms.com](https://telecoms.com/ai/europe-not-late-to-the-ai-race-von-der-leyen-insists) · [Video Kommission](https://www.youtube.com/watch?v=wxLnHa-7qls)
Sag: „In Paris, Europe's top official promised a 'CERN for A.I.' and said the race was far from over.“
Achtung: Mit „CERN“ meinte sie die Gigafactories, also Rechenzentren, kein gemeinsames Labor. Genau das kritisieren Forschende (F38). Den Satz „far from being over“ am Redetext prüfen.

**F34 · RAISE: der Pilot** · sicher
RAISE (Resource for AI Science in Europe) ist ein virtuelles Institut. Der Pilot hat 107 Mio. € aus dem EU-Forschungsprogramm Horizon Europe und wurde beim AI-in-Science-Gipfel in Kopenhagen (3.–4.11.2025) vorgestellt. Beim Gipfel in Dublin startete die Kommission am 15.10.2026 eine Zusage-Runde: Novo Nordisk Foundation, Nvidia, Elsevier, Sanofi, Frontiers, Mistral und Google DeepMind sagen Rechenzeit, Modelle und Daten zu. Eine Gesamtsumme gibt es nicht. Der Thinktank CFG warnt, ohne Schwerpunkt werde RAISE „everything and nothing at once“.
Quellen: [ERA Österreich 4.11.2025](https://era.gv.at/news-items/commission-launches-raise-virtual-institute-to-drive-ai-breakthroughs-in-science/) · [Kommission via Lovguiden 15.10.2026](https://www.lovguiden.dk/en/det-offentlige/europa-kommissionen-press-corner/2026-10-15-raise-kommissionen-samler-tilsagn-fra-virksomheder-om-ai-til-forskere) · [CFG](https://cfg.eu/tag/cern-for-ai/)
Sag: „So far, the 'CERN for A.I.' is a pilot worth about a hundred million euros.“

**F35 · Frontier AI Initiative (Deutschland, Frankreich, Kommission)** · sicher (Start), dünn (Stand)
Angekündigt am 18.11.2025 beim Gipfel zur europäischen digitalen Souveränität: eine gemeinnützige, öffentlich-private Einrichtung, die „best-funded non-profit frontier AI effort in the world“ werden soll. Im Jan. 2026 unterstützten sie 30 Spitzenforschende, der Start war für Ende März geplant (MLex). Im Juli 2026 standen die Trägerstrukturen noch auf der Liste der nächsten Schritte. Seit 17.11.2026 gibt es einen Förderaufruf „EU Frontier AI Initiative“ über 44 Mio. €, offen bis 18.3.2027. Davon getrennt ist die „Frontier AI Grand Challenge“: Am 19.6.2026 gewann das Konsortium EUROPA unter Führung der italienischen Firma Domyn.
Quellen: [Élysée 18.11.2025](https://www.elysee.fr/en/emmanuel-macron/2025/11/18/germany-france-and-the-european-commission-launch-frontier-ai-initiative-at-the-summit-on-european-digital-sovereignty) · [Kaino](https://kaino.dev/news/europe-launches-a-frontier-ai-initiative-but-leaves-the-build-plan-blank) · [Kommission, Grand Challenge](https://digital-strategy.ec.europa.eu/en/news/commission-selects-europa-consortium-winner-frontier-ai-grand-challenge-project-build-european-open)
Sag: „A year ago, Germany, France and the Commission announced a joint lab for the most advanced A.I. A year later, it's still mostly a plan.“
Achtung: Belegt ist nur, dass ich bis 23.11.2026 keine Meldung zu Leitung oder Struktur fand. Also nicht „no boss, no building“.

**F36 · SPRIND: Deutschlands Wette** · sicher
Die Bundesagentur für Sprunginnovationen SPRIND fördert mit „Next Frontier AI“ (125 Mio. €) zehn Teams, ausgewählt am 17.7.2026 aus Bewerbungen aus über 30 Ländern. Jedes Team kann bis zu 26,5 Mio. € über 24 Monate bekommen. Bis zu drei Sieger sollen im Herbst 2028 Hilfe bekommen, je bis zu ~1 Mrd. € einzusammeln. Ziel sind neue Ansätze statt Kopien bestehender Modelle.
Quellen: [SPRIND](https://www.sprind.org/en/words/magazine/next-frontier-ai-teams) · [tech.eu 30.4.2026](https://tech.eu/2026/04/30/sprind-launches-eur125m-next-frontier-ai-challenge-to-back-new-ai-paradigms-in-europe/)
Sag: „Germany is running its own contest: ten small teams, and the best three get help raising up to a billion euros each.“
Achtung: Ein nationales Programm, nicht EU.

**F37 · Was es kosten würde** · sicher (Schätzungen)
Der Thinktank CFG schätzt, ein echtes „CERN für KI“ koste 30–35 Mrd. € in den ersten drei Jahren. Von der Leyen in Dublin (13.11.2026): Für Chips, Rechenleistung und Spitzen-KI braucht Europa „at least 500 billion euro according to our own estimates“. Und: „What is missing now are the large investments in chips, compute and frontier AI.“ Europa gründe mehr Start-ups als die USA, viele könnten aber nicht wachsen. InvestAI (200 Mrd. €) ist weniger als die Hälfte davon.
Quellen: [CFG](https://cfg.eu/building-cern-for-ai) · [Kommission via Lovguiden 13.11.2026](https://www.lovguiden.dk/en/det-offentlige/europa-kommissionen-press-corner/2026-11-13-von-der-leyen-after-dublin-eu-summit-ai-requires-at-least-500-billion) · [Science|Business](https://sciencebusiness.net/news/planning-fp10/europes-independence-hinges-innovation-von-der-leyen-says) · [Paperjam](https://en.paperjam.lu/article/europe-estimates-its-ai-gap-at-eu500bn) · [Video Kommission 13.11.2026](https://www.youtube.com/watch?v=pO4Mc8QrbzY)
Sag: „This November, she put a price on catching up: at least five hundred billion euros.“
Achtung: Clip-Kandidat C3. Das ist eine Schätzung, kein beschlossenes Geld; der Finanzierungsvorschlag ist angekündigt, aber nicht vorgelegt.

**F38 · Gegenstimmen zum Labor** · sicher (gesagt), dünn (Autor, Datum)
Ein Gastbeitrag bei Science|Business wirft der Kommission vor, sie spiele mit Worten: In keiner ihrer Initiativen stecke ein „CERN model“ (Autor und Datum nicht gesehen). Der Forschungsverbund CAIRNE, der das seit 2018 fordert, sagt, ein CERN für KI „has not (yet) materialized“. Von der anderen Seite: Mensch hat im 20VC-Gespräch ein Kapitel „Why Europe Needs Its Own Frontier AI Companies“ (01:07), also Firmen statt Behördenlabor (Inhalt nicht geprüft). Die Gerüst-Gegenstimme „Ein Behördenlabor ist zu langsam gegen OpenAI“ fand ich nicht belegt.
Quellen: [Science|Business](https://sciencebusiness.net/viewpoint/ai/viewpoint-eus-cern-ai-nothing-sort) · [20VC](https://www.youtube.com/watch?v=KotQbLX8pOw)
Sag (Gegenstimme): „Researchers who've pushed for a real 'CERN for A.I.' for years say: so far, it's mostly the name.“

---

## Station 5 · Teil 5 THE MINDS (6:15–7:30, bleibt offen)

**F39 · Gehälter** · umstritten (ein Bericht, Daten von Personalvermittlern)
Euronews (29.1.2026): KI-Gehälter in den USA sind meist 30–70 % höher als im Großteil Europas. Erfahrene KI-Ingenieure verdienen in West- und Nordeuropa 90.000–150.000 $, in den USA (mittlere bis hohe Stufe) 140.000–210.000 $ Grundgehalt, vor Boni und Aktien.
Quelle: [Euronews 29.1.2026](https://www.euronews.com/my-europe/2026/01/29/the-ai-brain-drain-why-europe-cant-keep-the-talent-it-trains)
Sag: „Top A.I. engineers can earn thirty to seventy percent more in America. Before stock options.“

**F40 · Wer geht, wer bleibt** · umstritten
Laut Euronews (29.1.2026) hat Europa pro Kopf rund 30 % mehr KI-Fachleute als die USA (dünn, eine Quelle), verliert aber die erfahrenen. Deutschland und Frankreich verlieren netto, vor allem an die USA und Großbritannien. Laut Euronews und dem Thinktank Interface (29.4.2026) ziehen Irland, Deutschland und die Niederlande zunehmend KI-Talente an. Laut Science|Business gewinnt Europa netto knapp. Mensch beim EIB-Forum 2026: Europa hat das Talent, seine Regeln bremsen (F20).
Quellen: [Euronews](https://www.euronews.com/my-europe/2026/01/29/the-ai-brain-drain-why-europe-cant-keep-the-talent-it-trains) · [Interface](https://www.interface-eu.org/news/euronews-which-european-countries-are-attracting-the-worlds-top-ai-talent) · [Science|Business](https://sciencebusiness.net/news/ai/germany-netherlands-and-italy-gain-ai-researchers-france-loses-out)
Sag: „Europe trains plenty of A.I. talent. It just struggles to keep the best of them.“

**F41 · Die Wende: Forscher kommen** · umstritten (Teilzahlen)
„Choose Europe for Science“ (von der Leyen an der Sorbonne, 5.5.2025): 500 Mio. € für 2025–2027. Inzwischen gibt es 101 europäische, nationale und regionale Förderaufrufe (vorher 65) mit über 900 Mio. €. Bei den ERC-Advanced-Grants kamen 13 Gewinner von außerhalb Europas, vorher 4. Neun davon arbeiten in den USA, sieben nutzten Extra-Geld für den Umzug (Times Higher Education 2026). Frankreichs eigenes Programm wählte in der ersten Runde 46 von 119 Bewerbern aus, 41 aus den USA. Euronews (11.11.2026) fragt, ob es geklappt hat: Die Strategie sei zersplittert, Staaten, Unis und EU konkurrierten fast.
Quellen: [Euronews 5.5.2025](https://www.euronews.com/2025/05/05/choose-europe-von-der-leyen-tells-us-scientists-threatened-by-trumps-policies) · [THE](https://www.timeshighereducation.com/news/more-us-researchers-secure-erc-grants-success-rate-falls) · [THE](https://www.timeshighereducation.com/news/sharp-rise-erc-advanced-grant-applications-outside-europe) · [Fortune 28.9.2026](https://fortune.com/2026/09/28/americas-scientists-are-looking-abroad-can-european-business-cash-in/) · [Euronews 11.11.2026](https://www.euronews.com/2026/11/11/has-europe-managed-to-attract-researchers-escaping-us-academia-under-trump-euronews-tech-t)
Sag: „And now, for the first time in years, top researchers are moving the other way. Nine scientists working in America just won one of Europe's biggest research grants.“
Achtung: Den Jahrgang der ERC-Zahl am THE-Artikel prüfen. Kein Anti-USA-Ton: „after funding cuts in America“ geht, Politikerschelte nicht.

**F42 · Der Strom der Forscher dreht sich** · umstritten (Nachricht über den Bericht)
Der SRIP-Bericht der Kommission (Times Higher Education, 1.10.2026): Wechsel von Forschenden aus der EU in die USA −45 % (2023→2025), aus der EU nach China −41 %. Erstmals wählen mehr chinesische Forschende Europa als die USA. Die meisten Daten stammen aus der Zeit vor Choose Europe.
Quelle: [THE 1.10.2026](https://timeshighereducation.com/news/sharp-fall-research-mobility-between-eu-us-and-china)
Sag: „Researchers leaving the EU for America: down by almost half in two years.“
Achtung: Gilt für Forschende allgemein, nicht nur für KI.

**F43 · Der Plan für die Köpfe** · sicher (Gesetzeslage), dünn (Details)
(a) EU-Aktienoptionen im EU-Inc-Vorschlag: Steuer erst beim Verkauf der Aktien, die Höhe nach nationalem Recht, nur für Beschäftigte und Vorstand. (b) EU-Talentpool, Verordnung (EU) 2026/1047 (29.4.2026): eine EU-Plattform, über die Firmen Fachkräfte aus Drittstaaten für Mangelberufe anwerben; die Staaten machen freiwillig mit. (c) Ein EU-weites Schnell-Visum für KI-Forschende gibt es nicht, nur die Blaue Karte und nationale Programme.
Quellen: [Osborne Clarke](https://www.osborneclarke.com/insights/eu-inc-commission-proposes-single-company-structure-all-27-member-states) · [EY](https://taxnews.ey.com/news/2026-0715-european-commission-publishes-proposal-on-the-28th-regime-eu-inc) · [EUR-Lex 2026/1047](https://eur-lex.europa.eu/eli/reg/2026/1047/oj)
Sag: „Part of the plan: stock options that work the same way in every country, taxed only when you sell.“
Achtung: Teil 5 bleibt offen. Die Aktienoptionen hängen an EU Inc (Teil 2).

**F44 · Gegenstimme zu den Köpfen** · sicher (gesagt)
Laut Sifted halten Skeptiker Choose Europe für unrealistisch: Europa werde für US-Forschende keine echte Alternative. Euronews (11.11.2026) nennt die Strategie zersplittert. Das Hauptproblem bleiben die Gehälter (F39).
Quellen: [Sifted](https://sifted.eu/articles/choose-europe-for-science-critics) · [Euronews 11.11.2026](https://www.euronews.com/2026/11/11/has-europe-managed-to-attract-researchers-escaping-us-academia-under-trump-euronews-tech-t)
Sag: „Nobody knows yet whether a few hundred million euros can beat American salaries.“

---

## Station 6 · Das zweite Rennen (7:30–8:45)

**F45 · KI in die Fabriken** · umstritten (Firmenaussage)
Koerte (Fortune, 5.10.2026): Europa könne bei Industrie-KI führen. Siemens investiert über drei Jahre mehr als 1 Mrd. € in Industrie-KI und baut mit Nvidia ein „industrial AI operating system“. Physische KI könne Entwicklungszeiten um 40 % verkürzen. Volle Unabhängigkeit hält er für unrealistisch. Panel von Siemens, KION und OHB (18.7.2026): Laut Beschreibung schafft kein Unternehmen Industrie-KI allein, es braucht Datenpartnerschaften. OHB ändert Satelliten-Konstruktionen „in Stunden statt Wochen“.
Quellen: [Fortune](https://fortune.com/2026/10/05/siemens-europe-industrial-ai-advantage-data-manufacturing-peter-koerte/) · [Siemens-Video](https://www.youtube.com/watch?v=gtXkPgyxKvU)
Sag: „Europe may never build the biggest chatbot. But it could be first to put A.I. to work in its factories.“
Achtung: Koerte leitet seit Juli 2026 den Bereich Smart Infrastructure und war bis Sept. Technikvorstand; die Bauchbinde nach Aufnahmedatum wählen. Das Siemens-Interesse nennen.

**F46 · Wo Europas Firmen heute stehen** · sicher
Eurostat (11.12.2025): 2025 nutzten 20,0 % der EU-Firmen ab 10 Beschäftigten KI (2024: 13,5 %, 2021: 7,7 %), bei großen Firmen 55 %. Vorn liegen Dänemark (42,0 %), Finnland (37,8 %) und Schweden (35,0 %), hinten Rumänien (5,2 %), Polen (8,4 %) und Bulgarien (8,5 %).
Quelle: [Eurostat](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2)
Sag: „Today only one in five European companies uses A.I. at all. In Denmark, it's twice that.“
Achtung: Von der Leyens „37 %“ (Dublin) nicht verwenden.

**F47 · Der Industrie-KI-Gesandte** · sicher (Ernennung), dünn (Termin)
Jim Hagemann Snabe, Aufsichtsratschef von Siemens, ist seit 3.6.2026 Sondergesandter der Kommission für Industrie-KI (unbezahlt, bis 31.3.2027). Seine Rollen bei Google Cloud (Beirat) und C3.ai ruhen. 41 Europaabgeordnete stellten die Frage nach einem Interessenkonflikt. Laut von der Leyen (13.11.) kommen seine Maßnahmen „in two weeks“.
Quelle: [Eunews 3.6.2026](https://www.eunews.it/en/2026/06/03/the-european-commission-appoints-hagemann-snabe-as-special-envoy-for-industrial-ai/)
Achtung: Den Konflikt fair erwähnen oder weglassen. Keine Fraktion nennen.

**F48 · ASML als Druckmittel** · umstritten (zwei Lesarten)
Dafür: Das Bocconi-Institut IEP nennt ASML „the EU's most important bargaining chip“; Bruegel (Mai 2026) rät zu „indispensability, not self-sufficiency“. Dagegen: Tech Policy Press (Wim Casteels, 7.7.2026) hält den Hebel für schwächer, als er aussieht. Exportkontrolle ist Sache der Niederlande, und faktisch bestimmen die USA mit; „Europe“ ist nicht dasselbe wie die Niederlande. Der Hebel hat außerdem ein Ablaufdatum: Laut Reuters (17.12.2025) testet China in Shenzhen einen EUV-Prototyp, gebaut unter anderem mit früheren ASML-Ingenieuren. Ziel sind funktionierende Chips 2028, realistischer 2030. ASML bestreitet, EUV-Systeme oder EUV-Spezialteile nach China geliefert zu haben.
Quellen: [Tech Policy Press](https://techpolicy.press/why-asmls-semiconductor-monopoly-doesnt-give-europe-strategic-control) · [Bocconi IEP](https://iep.unibocconi.eu/why-asml-eus-most-important-bargaining-chip) · [Bruegel](https://www.bruegel.org/analysis/revamping-europes-chips-strategy-indispensability-not-self-sufficiency) · [Reuters via Jakarta Post](https://www.thejakartapost.com/business/2025/12/18/how-china-built-its-manhattan-project-to-rival-the-west-in-ai-chips) · [Engadget](https://www.engadget.com/big-tech/china-reportedly-has-a-prototype-euv-machine-built-by-ex-asml-employees-235833756.html)
Sag: „Whoever builds the machine gets a seat at the table. But only if Europe speaks with one voice. Today, that call is made in The Hague, and Washington has a say.“
Achtung: Den China-Prototyp höchstens in einem Satz (Überschneidung #68). Sachlich bleiben, kein Anti-USA-Ton.

**F49 · Drei Wege, je ein Satz** · gemischt
(a) Mehr gemeinsamer Haushalt: von der Leyen nennt „at least 500 billion“ (F37). Costas Vorschlag kürzt den Wettbewerbsfonds auf ~223 Mrd. € (−19 %). Die Nettozahler bremsen, Schweden nennt eine Einigung „far off“. (b) Mehr Markt, weniger Regeln: Das EU-KI-Gesetz wurde 2026 per „Digital Omnibus“ vereinfacht und verschoben. Die Hochrisiko-Regeln gelten erst ab 2.12.2027 bzw. 2.8.2028 statt ab 2.8.2026 (politische Einigung 7.5.2026, Parlament 16.6., Rat 29.6.2026). Bruegel setzt auf Wettbewerb statt „buy European“. (c) Allianzen mit anderen Mittelmächten: in dieser Runde nicht recherchiert, kein Beleg.
Quellen: [Science|Business, Costa-Vorschlag](https://sciencebusiness.net/news/latest-council-budget-proposal-keeps-eu158b-next-horizon-europe) · [Rapporteur](https://www.rapporteur.com/news/eu-budget-costas-nego-box-leaves-no-one-happy/) · [Hogan Lovells](https://www.hoganlovells.com/en/publications/eu-legislators-agree-to-delay-for-highrisk-ai-rules) · [Taylor Wessing](https://taylorwessing.com/en/insights-and-events/insights/2026/05/the-eu-digital-omnibus-on-ai-what-the-political-deal-means)
Sag: „Some want a bigger shared budget. Some want fewer rules and more market. Some want new allies.“
Achtung: Die Wege keiner Partei zuordnen. Für (c) erst einen Beleg suchen oder als offene Frage stellen.

**F50 · Wer entscheidet** · sicher
Gesetze wie EU Inc und die Kapitalmarktregeln beschließen Rat (die Regierungen) und Parlament auf Vorschlag der Kommission. Den mehrjährigen Haushalt beschließt der Rat einstimmig, das Parlament muss zustimmen. Das Geld für die Gigafactories soll zu rund zwei Dritteln von privaten Investoren kommen.
Sag: „Governments. The Parliament. Investors. And, at the next election, voters.“

---

## Schluss (8:45–10:00)

**F51 · Das Fenster** · siehe Tabelle oben. Für den Schluss die drei stärksten: Haushaltsgipfel 26.–27.11.2026, Gigafactory-Frist 3.12.2026, erste EU-Inc-Firmen frühestens 2028.

**F52 · Stütze für den Kernsatz** · sicher (gesagt)
Mensch (Dublin, AFP): „… all the technology and the talent … What it needs now is speed, financing and a strong coordination between member states.“ Draghi (Aachen 2026): „committees that dilute and delay“. Draghi (Leuven 2026): Nur die Europäer haben die Wahl, eine echte Macht zu werden.
Sag (Kernsatz K1 bleibt): „Europe was never too small for this race. The only question is whether it puts itself together in time.“

**F53 · Ehrliche Bilanz für das Urteil** · sicher
Von der Leyen sagte im Feb. 2025 sinngemäß, das Rennen sei „far from being over“. Was seitdem passierte: Der EU-Anteil an der KI-Rechenleistung blieb bei ~5 %, und ASML verkaufte im 1. Halbjahr 2026 nichts nach Europa. Gleichzeitig stieg das Start-up-Geld um 62 % (2026), KI- und Rechenzentrums-Investitionen verdoppelten sich auf 20 Mrd. $ (Atomico), Mistrals Bewertung verdoppelte sich fast, und der Wechsel von Forschenden in die USA ging um 45 % zurück.
Sag: „The race for the biggest machine? Europe isn't winning that. The race for a strong voice of its own? That one is still open.“

---

## Gegenstimmen je Teil (Überblick)

| Teil | Gegenstimme in einem Satz | Quelle |
|---|---|---|
| Hook / Station 1 | „Europe is not investing“: Nicht einmal die eigene Spitzenfirma verkauft in Europa | ASML/Heemskerk, DCD Sept. 2026 |
| 1 THE MONEY | Zu langsam und verwässert („emergency brake“); mehr Börse heißt mehr Risiko für Kleinsparer; Wirkung der Spar-Konten „modest“ | CEPS 12.2.2026 · Finance Watch 2026 · EZB 2026 |
| 1 Beleg Mistral | Mistral trägt in der PR „teilweise ziemlich dick“ auf, das Geschäftsmodell wird umgebaut | manager magazin 16.11.2026 (nur Videobeschreibung gelesen) |
| 2 ONE MARKET | Der Vorschlag greift zu kurz; Gewerkschaften fürchten um die Mitbestimmung | OBLB März 2026 · ETUC 20.1.2026 |
| 3 THE POWER | Selbst alles Geplante hebt den EU-Anteil nur auf ~5,6 % (2031); Gigafactories vertiefen die Abhängigkeit von US-Chips | Bruegel PB 18/2026 · SCMP |
| 3 / 6 Kaufregeln | „buy European“ untergräbt den Wettbewerb und macht teurer | Bruegel Feb./Juni 2026 · CERRE |
| 4 ONE LAB | „Playing with words“: kein echtes CERN-Modell | Science|Business · CAIRNE |
| 5 THE MINDS | Gegen US-Gehälter unrealistisch; Strategie zersplittert | Sifted · Euronews 11.11.2026 |
| 6 ASML-Hebel | Schwächer als gedacht: Exportkontrolle ist national, die USA bestimmen mit | Tech Policy Press 7.7.2026 |
| 6 Industrie-KI | Interessenkonflikt beim Gesandten (Siemens-Aufsichtsratschef) | Eunews 3.6.2026 |

## Staunen-Fakten (5 + Reserve)

1. **Die Maschine füllt drei Frachtjumbos, und dieses Jahr ging keine nach Europa.** Einzige EUV-Maschinen der Welt, gebaut in den Niederlanden; Europas Anteil an den ASML-Verkäufen im 1. Halbjahr 2026: 0 %. [DCD](https://www.datacenterdynamics.com/en/news/asmls-revenue-share-drops-to-zero-percent-in-europe-says-its-sold-absolutely-nothing-in-the-region-this-year)
2. **110 Millionen Menschen mehr als die USA, aber jeder zwanzigste Teil der KI-Rechenleistung.** EU 452,0 Mio. vs. USA 341,8 Mio.; EU-Anteil an der KI-Rechenleistung ~5 % (Bruegel, Epoch).
3. **Zehn Billionen Euro auf Bankkonten.** Dazu sparen Europäer jedes Jahr ~1,4 Bio. € neu, Amerikaner ~800 Mrd. €. [Kommission](https://commission.europa.eu/news-and-media/news/savings-and-investments-union-better-financial-opportunities-eu-citizens-and-businesses-2025-03-19_en)
4. **Eine Firma für 27 Länder in 48 Stunden, für unter 100 €**, sofern das Gesetz kommt. [Kommission](https://commission.europa.eu/news-and-media/news/eu-inc-making-business-easier-european-union-2026-03-18_en)
5. **Die Firma, die die Maschine baut, führte die Geldrunde der wichtigsten KI-Firma Europas an.** ASML, 1,3 Mrd. €, Mistral, Sept. 2025.

Reserve: Frankreich zwei Drittel Atomstrom, 95 % CO₂-arm · Draghi „a harder place“ · von der Leyen „at least 500 billion euro“ · China testet einen EUV-Prototyp, mitgebaut von früheren ASML-Ingenieuren · Forscher-Wechsel EU→USA −45 % · KI-Nutzung in Firmen: Dänemark 42 %, Rumänien 5 %.

---

## Nicht verifiziert (bitte im Faktencheck klären oder weglassen)

1. **Alle Clip-Wortlaute und Zeitmarken** (Untertitel und Ton aus der Cloud gesperrt). Liste der zu prüfenden Videos in `clips.json` → „offen“.
2. **Stanford-Zahl Europa 20,9 Mrd. $** stammt aus einer Grafikbeschriftung auf Sekundärseiten; im PDF, Kapitel 4, prüfen. Die globalen Summen widersprechen sich (privat 344,7 vs. gesamt 581,7 Mrd. $).
3. **Von der Leyen, Paris 2025: „far from being over“** nur sinngemäß (Überschrift Telecoms.com); am Redetext der Kommission prüfen.
4. **Von der Leyen, Dublin: „37 %“ / „Finnland 66 %“** widerspricht Eurostat (20,0 % / 37,8 %) → nicht verwenden.
5. **Heemskerk-Zitat und „absolutely nothing“** nur aus DCD-Suchauszügen.
6. **Mensch in Dublin:** zwei Fassungen des Wortlauts; 260 Mrd. € (Frenchweb) vs. 285 Mrd. $ (AFP-Bericht).
7. **EU Inc „21 Monate / nicht vor 31.7.2028“** nur über Freshfields; im Ratstext prüfen (Ratsdokument ST-13324-2026).
8. **Parlament am 11.11.2026** (dritter Fehlschlag): nur Agence Europe.
9. **„30 % mehr KI-Talent pro Kopf als die USA“:** nur Euronews.
10. **ERC 13/9:** Jahrgang des Wettbewerbs offen; **Frankreich 46/119 (41 aus den USA)** nur ein Bericht.
11. **TNW-Artikel „falling apart“**: Datum offen; **„AI Gigafactory Northern“**: Datum und Standort offen.
12. **Norwegens Wasserkraft-Anteil** und **Macrons „90 TWh“** (Élysée-Redetext prüfen).
13. **Banque de France +45 / +240 TWh** nur aus der französischen Fassung.
14. **IEA +30 % (Q2 2026)** nur Suchauszug (Großhandel).
15. **Draghi-Bericht: ~30 % der Einhörner abgewandert** aus dem Bericht bekannt, in dieser Runde nicht nachgeschlagen.
16. **Spar-Konten-Empfehlung der Kommission:** genaues Datum (Herbst 2025).
17. **Science|Business-Gastbeitrag** (Autor, Datum) und **OBLB-Beitrag** (Argument).
18. **CERN-Zahlen** (Gründung, Mitglieder, Nutzer) auf home.cern prüfen.
19. **Mittelmächte-Allianzen (Station 6, Weg c):** nicht recherchiert.
20. **Snabe-Maßnahmen „in two weeks“** und **Klausur Alden Biesen 5.2.2027:** nur Berichte.
21. **Mistral-Umsatz** (€ oder $) und GPU-Zahlen in Essonne: Quellen widersprechen sich.
22. **ASML-Gewicht** (150 / 165 / >200 t): Quellen widersprechen sich → nicht nennen.

**Am iMac öffnen (aus der Cloud nicht erreichbar):** bruegel.org (PB 18/2026), epoch.ai (Chip-Importe), iea.org (Electricity 2026, Mid-Year Update), hai.stanford.edu (Kapitel 4), commission.europa.eu (Draghi-Redetext, SIU, EU Inc), consilium.europa.eu (EU Inc, ECOFIN, Costa-Vorschlag), eurohpc-ju.europa.eu (Fristen), datacenterdynamics.com (ASML), fortune.com (Koerte), euronews.com, timeshighereducation.com, agenceurope.eu. YouTube-Untertitel (Bot-Prüfung), YouTube-Suchkontingent am 23.11. erschöpft, vidIQ ohne Guthaben bis 19.12.2026.
