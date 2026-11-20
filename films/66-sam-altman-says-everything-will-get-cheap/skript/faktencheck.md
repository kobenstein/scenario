# Faktencheck · „Sam Altman Says Everything Will Get Cheap“ (Film #66) · geprüft: vo-v2.txt → vo-v3.txt

Stand: Freitag, 20.11.2026, nachmittags (Wien). Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v2.txt` samt den vier Clip-Stellen (C1–C4). Dazu kommt jede Einblendung, Zitatkarte, Bauchbinde und Quellenzeile in `text-v2.md`. Die Veröffentlichung ist für **So 22.11.2026, 17:00 Wien (11:00 New York)** geplant; alle relativen Zeitwörter sind auf dieses Datum geprüft (Abschnitt 4). Die Zeilennummern gelten für `vo-v2.txt` und `vo-v3.txt` gleich, denn beide haben 102 Zeilen.

**Ergebnis:** 110 Aussagen geprüft (77 im Sprechtext inkl. der 4 Clips, 33 Einblendungen und Quellenzeilen): **86 grün · 18 gelb · 6 rot**.
- **Ampel:**
  - **grün:** Die Primärquelle bestätigt die Aussage. Wo es keine Primärquelle gibt, genügen zwei unabhängige Berichte. Deutungen, die als Deutung hörbar sind, sind ebenfalls grün.
  - **gelb:** zugespitzt, ungenau oder dünn belegt. Darf bleiben; wo es sich lohnt, steht ein Kann-Vorschlag dabei.
  - **rot:** falsch, unbelegt oder irreführend. Das ist eine Muss-Änderung.
- **Sprechtext: 3 rot, alle in `vo-v3.txt` eingearbeitet** (Z. 42, 45, 80). Dazu **1 Kann-Änderung** (Z. 35), weil sie ein zu starkes Wort ersetzt und nur +2 Wörter kostet. Sonst ist `vo-v3.txt` byte-gleich mit `vo-v2.txt`. Länge: 1.388 → **1.392 Wörter** (+4, unter 2 s).
- **Bild: 3 rot, in `text-v3.md` eingearbeitet** (4:03 Smartphone-Einblendung, 4:15 Handy-Prognose, 4:47 optionale Sieben-Cent-Einblendung). `text-v3.md` enthält dieselben Sprechtext-Änderungen, die Folgeänderungen an Clip-Zeilen, Clip-Tabelle und Prüfliste sowie oben einen kurzen v3-Block. `text-v2.md` ist unverändert.
- **16 Kann-Änderungen nicht eingearbeitet** (5 im Sprechtext, 11 im Bild): Jakobs Wahl.
- **Die wichtigsten Befunde:**
  - **Musk wurde im Sommer gefragt, nicht im Herbst.** Das Isaacson-Interview wurde am **6.8.2026 aufgezeichnet** und erst am 20.10.2026 veröffentlicht (M1).
  - **Acemoglu: Das Aufnahmedatum ist nicht belegbar.** Belegt ist nur der YouTube-Upload Ende Oktober. Die Folge handelt von seinem Buch, über das er schon ab August in Podcasts sprach. Das ist dieselbe Falle wie bei Musk, darum „recently“ (M3).
  - **Smartphones „halb so teuer“ gilt nur qualitätsbereinigt.** Das BLS bereinigt Smartphones seit 2018 hedonisch. Der Durchschnittspreis neuer Handys steigt dagegen: IDC erwartet für 2026 **+27,6 % auf 581 $** (weltweit, Aug. 2026). Die Einblendung „+14 % (IDC)“ war die Februar-Prognose und ist veraltet; Counterpoint +6,9 % ließ sich nicht belegen (M2, MB1, MB2).
  - **Studiengebühr:** Der Listenpreis stieg nominal um 2,9 %, aber langsamer als die Preise insgesamt (VPI Sept. 2026: +3,7 %). Inflationsbereinigt ist er seit 2016/17 um 8 % gefallen. „It isn't“ war zu stark (K1, eingearbeitet).
  - **Ohne Befund:** Altmans Fed-Beispiel („20 hours, 40 hours“ → „less than a dollar's worth of compute tokens“), „ten times cheaper“, Anwälte (90 % Stundenabrechnung, Sätze +7,3 %), KI-Tutor (Harvard), 5.079.078 Roboter, Energie +33,2 %, Hassabis, Ackerland 6.020 $ (veröffentlicht **31.7.2026**, nicht im August), Landanteil 39,9 % (FHFA 2022), alle Altman-Zitate, Lohnquote 53,0 %, Alaska 1.200 $, 13.500 $ (11,25-fach), OpenResearch und die Town Hall vom 26.1.2026.
  - **Dünn, aber haltbar (gelb):** Übersetzer (nur ein Bericht zur CEATL-Umfrage 2026), Lebensmittel-Dollar (Update vom 17.11.2026 nicht einsehbar) sowie die Clip-Wortlaute C1, C3 und C4.

**Quellenlage (wichtig für den Zweitprüfer):**
- **Gesperrt per curl** (Proxy: „403 … no rule or network setting allows this host“): `fred.stlouisfed.org` (auch der CSV-Download), `www.bls.gov`, `api.bls.gov`, `www.federalreserve.gov`, `www.ers.usda.gov`, `release.nass.usda.gov`, `pfd.alaska.gov`, `research.collegeboard.org`, `ifr.org`, `arxiv.org`, `www.ceatl.eu`, `time.com`, `www.weforum.org`, `www.thomsonreuters.com`, `www.fhfa.gov`, `moores.samaltman.com`.
- **Gesperrt per WebFetch** (ENOTFOUND): `www.weforum.org`, `podcasts.happyscribe.com`, `www.podcast.de`. Danach habe ich keine weiteren Seiten per WebFetch versucht.
- **Wer die Primärseiten im Volltext prüfen will**, muss diese Hosts in den Netzwerkeinstellungen der Sitzung freigeben oder am iMac prüfen.
- **Alles andere stammt aus WebSearch-Auszügen vom 20.11.2026**, meist aus den Primärseiten selbst (BLS TED, BLS Productivity, BLS-Faktenblatt, IDC, IFR, USDA NASS, ERS, FHFA, pfd.alaska.gov, Fed-Transkript). Die Altman-Wortlaute gelten als grün (`altman-wortlaut-verifiziert.md`, am Original geprüft).

---

## 1 · Muss-Änderungen

### Im Sprechtext (eingearbeitet in vo-v3.txt)

| # | alt (vo-v2) | neu (vo-v3) | Grund | Quelle |
|---|---|---|---|---|
| M1 | Z. 42: „Elon Musk promises even more. Asked **this fall** whether some things should simply be free for everyone, he said:“ | „Elon Musk promises even more. Asked **this summer** whether some things should simply be free for everyone, he said:“ (±0 Wörter) | **Falsches Zeitwort.** Die Folge erschien am 20.10.2026, aufgezeichnet wurde sie aber am 6.8.2026. Gefragt wurde Musk also im Sommer. v2 hatte das Veröffentlichungsdatum für den Tag der Frage gehalten (Prüfliste Nr. 13: „this fall = 20.10.2026“). Die Kürzung von Isaacsons Frage („in the commons“, freie High School) ist fair. | Episodenangabe „Interview taped August 6, 2026“, in zwei Podcast-Verzeichnissen übereinstimmend ([podcast.de, Show-Seite](https://www.podcast.de/podcast/3768025), Suchauszug 20.11.2026) · Start 20.10.2026: [Axios, 17.10.2026](https://axios.com/2026/10/17/elon-musk-doge-walter-isaacson-podcast), [AI Weekly nach Hollywood Reporter](https://aiweekly.co/alerts/isaacsons-ai-podcast-the-builders-launches-with-musk) |
| M2 | Z. 45: „And by the official numbers, American smartphone prices fell by half in five years.“ | „And by the official numbers, **adjusted for quality,** American smartphone prices fell by half in five years.“ (+3 Wörter) | **Irreführend verkürzt.** Die Zahl stimmt: Der VPI für Smartphones fiel von Okt. 2021 bis Okt. 2026 um 51,2 %. Er ist aber seit Januar 2018 hedonisch qualitätsbereinigt, misst also den Preis gleicher Leistung, nicht den Ladenpreis. Der Durchschnittspreis neuer Handys steigt: IDC erwartet für 2026 weltweit +27,6 % auf 581 $. Ohne Hinweis hört jeder „mein Handy kostet die Hälfte“, und „It worked for your phone“ (Z. 87) baut darauf. Schon text-v2 verlangte: „Bestätigt sich das, in die Einblendung“. Es ist bestätigt. | [BLS, The Economics Daily, 19.11.2026](https://www.bls.gov/opub/ted/2026/consumer-prices-up-22-0-percent-over-5-years-ending-october-2026.htm) (−51,2 %) · [BLS, CPI-Faktenblatt „Telephone hardware“](https://www.bls.gov/cpi/factsheets/telephone-hardware.htm) („Smartphones are the only item … which are quality adjusted“, seit Daten Jan. 2018) · [IDC, 26.8.2026](https://idc.com/resource-center/blog/smartphone-shipments-set-for-record-16-7-drop-in-2026-as-the-memory-crisis-hits-full-force) |
| M3 | Z. 80: „But **this fall**, the Nobel-winning economist Daron Acemoglu was asked which AI number leaders should watch.“ | „But **recently**, the Nobel-winning economist Daron Acemoglu was asked which AI number leaders should watch.“ (−1 Wort) | **Unbelegtes Zeitwort.** Die Seite der Radio-Davos-Folge zeigt in keinem Auszug ein Datum (weforum.org gesperrt). Belegt ist nur der YouTube-Upload ca. Ende Oktober („vor 3 Wochen“ am 20.11.). Die Folge behandelt sein Buch „What Happened to Liberal Democracy?“, über das er schon ab dem 12.8.2026 in Podcasts sprach. Aufgenommen sein kann sie also auch im Sommer. Das ist dieselbe Falle wie bei M1. „recently“ stimmt in jedem Fall. | [WEF, Radio-Davos-Folge](https://www.weforum.org/podcasts/radio-davos/episodes/damon-acemoglu-economics-ai-democracy) (ohne Datum im Auszug) · [MIT Shaping Work, Interviews zum Buch 12.8.–5.9.2026](https://shapingwork.mit.edu/what-happened-to-liberal-democracy/) · YouTube DxCkbNvzm0g (Upload laut `clips.json`) |

**Folgeänderungen in text-v3.md:** Clip-Zeile C2 (3:55) und Clip-Tabelle: „aufgezeichnet 6.8.2026, veröffentlicht 20.10.2026“. Clip-Zeile C4 (7:58) und Clip-Tabelle: „YouTube-Upload ca. Ende Okt. 2026, Aufnahmedatum offen“, dazu der Einordnungssatz mit „recently“. In der Prüfliste sind Nr. 13, 14, 15, 24 und 31 nachgeführt.

### Im Bild (eingearbeitet in text-v3.md)

| # | Zeit | jetzt (text-v2) | neu (text-v3) | Grund · Quelle |
|---|---|---|---|---|
| MB1 | 4:03 | SMARTPHONES −51% IN FIVE YEARS · U.S. BLS, Nov 19, 2026 | SMARTPHONES −51% IN FIVE YEARS · **CONSUMER PRICE INDEX, QUALITY-ADJUSTED** · U.S. BLS, Nov 19, 2026 | Wie M2. Das Bild muss sagen, was gemessen wird. [BLS TED 19.11.2026](https://www.bls.gov/opub/ted/2026/consumer-prices-up-22-0-percent-over-5-years-ending-october-2026.htm) · [BLS-Faktenblatt](https://www.bls.gov/cpi/factsheets/telephone-hardware.htm) |
| MB2 | 4:15 | FORECAST 2026, AVERAGE SMARTPHONE PRICE: +14% (IDC) · +6.9% (Counterpoint) | FORECAST 2026, AVERAGE SMARTPHONE PRICE **WORLDWIDE: +27.6% TO $581 · IDC, Aug 2026** | **Veraltet und unbelegt.** +14 % (auf 523 $) war IDCs Prognose vom 26.2.2026; im Mai hob IDC auf 550 $, im August auf 581 $ (+27,6 %) an. Für Counterpoint +6,9 % fand ich keine Quelle; ein Drittbericht nennt für Counterpoint ganz andere Werte (bestehende Modelle +15 %, neue +25 %). IDC misst weltweit, das muss im Bild stehen. [IDC, 26.8.2026](https://idc.com/resource-center/blog/smartphone-shipments-set-for-record-16-7-drop-in-2026-as-the-memory-crisis-hits-full-force) · [Yicai, 28.8.2026](https://www.yicaiglobal.com/news/global-phone-shipments-to-fall-this-year-amid-rising-prices-reports-predict) · [IDC, 26.2.2026](https://www.idc.com/resource-center/blog/higher-asps-lower-unit-volumes-how-the-memory-crisis-is-reshaping-the-pc-and-smartphone-outlook) |
| MB3 | 4:47 | optional: TODAY: ELECTRICITY ≈ 7% OF A BIG AI DATA CENTER'S YEARLY COST · SERVERS ≈ 60% · Epoch AI, 2026 | **entfällt** | **Unbelegt.** text-v2 erlaubt die Einblendung nur, wenn der Faktencheck sie bestätigt. Die 7 % sind laut Faktenzettel (F21) eine eigene Rechnung. epoch.ai ist gesperrt, und ich fand keine zweite Quelle. |

---

## 2 · Kann-Änderungen

### Eingearbeitet (zu starkes Wort, höchstens ±3 Wörter)

| # | alt (vo-v2) | neu (vo-v3) | Warum | Quelle |
|---|---|---|---|---|
| K1 | Z. 35: „So a degree should be getting cheaper. **It isn't.**“ | „So a degree should be getting cheaper. **Its price tag isn't.**“ (+2) | Nominal richtig, als Pauschalsatz zu stark. Inflationsbereinigt sank der Listenpreis (öffentlich, in-state, vier Jahre) von 2016/17 bis 2026/27 um 8 %. 2026/27 stieg er mit +2,9 % langsamer als die Preise insgesamt. Der Nettopreis nach Stipendien liegt bei rund 1.920 $. „Its price tag“ legt den Satz auf den Listenpreis fest und passt zum Bild der Preisschilder. | College Board, Trends in College Pricing 2026 (5.11.2026), laut [Inside Higher Ed](https://www.insidehighered.com/node/223046) · [BLS CPI, 14.10.2026](https://www.bls.gov/news.release/archives/cpi_10142026.htm) (VPI Sept. 2026: +3,7 %) |

### Nicht eingearbeitet: Sprechtext

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K2 | Z. 15: „almost every price you pay is mostly other people's time.“ | „much of almost every price you pay is other people's time.“ (+1) | Altman schreibt vorsichtiger („labor is the driving cost at many levels of the supply chain“). Gesamtwirtschaftlich geht etwas mehr als die Hälfte an Arbeit (Lohnquote 53,0 %), bei Miete und Energie deutlich weniger. Der Satz ist als sein Argument gerahmt, und der Film prüft genau das. Darum nur Kann. |
| K3 | Z. 27: „Across Europe, about three in ten literary translators say …“ | „In a European survey, about three in ten literary translators say …“ (+2) | Es sind 30 % von 1.785 Befragten aus den CEATL-Verbänden, keine Zufallsstichprobe. Zudem fand ich nur einen Bericht (ceatl.eu gesperrt). Zahl vor dem Upload an der CEATL-Mitteilung prüfen. |
| K4 | Z. 70: „the price of limited resources like land may rise even more dramatically.“ | „the price of a few limited resources like land may rise even more dramatically.“ (+2) | Näher am Original („luxury goods and a few inherently limited resources like land“). Die Zitatkarte zeigt den vollen Wortlaut, darum nur Kann. |
| K5 | Z. 80: „… was asked which AI number leaders should watch. He named this one.“ | nur falls C4 keine Frage enthält: „… Daron Acemoglu named the AI number leaders should watch. It's this one.“ (±0) | „was asked“ ist nur über den Kapiteltitel belegt („The AI statistic leaders should watch: labour's share of income“). Am Ton prüfen. |
| K6 | Z. 93: „Even Altman has changed his own answer more than once.“ | „Even Altman has given more than one answer.“ (−1) | Belegt sind vier Antworten nacheinander: die Bargeld-Studie, der Fonds aus Aktien und Land (2021), „universal basic compute“ (Mai 2024) und der Public Wealth Fund (April 2026). „changed“ deutet an, er habe die früheren aufgegeben. Für „basic compute“ stimmt das (er stellte es gegen UBI), für die anderen nicht klar. |

### Nicht eingearbeitet: Bild

| # | Zeit | jetzt | Vorschlag | Warum |
|---|---|---|---|---|
| KB1 | 1:18 | OF EVERY FOOD DOLLAR: 54¢ LABOR · 12¢ FARM · USDA ERS, Food Dollar (2024 data, updated March 2026) | … · **U.S.-PRODUCED FOOD** · … und vor dem Upload das ERS-Update vom 17.11.2026 prüfen | ERS hatte das Update mit Daten 2025 für den 17.11.2026 angekündigt. Ich konnte es nicht einsehen. Liegen neue Werte vor, diese einsetzen; „more than half“ und „about twelve cents“ dürften halten (2023: 52,0 / 12,1; 2024: 54,1 / 11,8). |
| KB2 | 2:17 | 30% REPORT FEWER ASSIGNMENTS OR CLIENTS BECAUSE OF AI · CEATL survey 2026 · 1,785 literary translators | „OR CLIENTS“ nur behalten, wenn es so in der CEATL-Mitteilung steht | Der gefundene Bericht nennt nur „a drop in assignments, attributed to AI“. |
| KB3 | 2:27 | … · Thomson Reuters Institute, 2026 State of the US Legal Market | … **, Jan 2026** | Hausregel: Quelle mit Datum. |
| KB4 | 2:53 | klein: 19 universities, 7,200 students (preprint, Nov 2026) | „(preprint, not yet peer-reviewed)“ oder streichen | arXiv war gesperrt, das Preprint ist ungeprüft. Die Hauptzeile (Harvard, Scientific Reports 2025) ist grün. |
| KB5 | 3:02 | PUBLIC FOUR-YEAR, IN-STATE TUITION: $12,290 · +2.9% · College Board, Nov 5, 2026 (published price) | … +2.9% **(LESS THAN INFLATION)** … | Passt zu K1 und nimmt einem Kenner den Einwand vorweg. |
| KB6 | 3:55 | Bauchbinde ELON MUSK · CEO, Tesla & SpaceX · 2026 · ORIGINAL FOOTAGE (The Builders with Walter Isaacson) | … · **AUG 2026** · …; optional Zeile „Tesla builds humanoid robots“ | Das Datum passt zu M1. Musks Interessenlage (Optimus-Roboter, eigene KI) wird sonst nirgends genannt, anders als bei Altman und Hassabis. |
| KB7 | 4:47 | ENERGY +33% IN FIVE YEARS · U.S. BLS, Nov 19, 2026 | **CONSUMER** ENERGY PRICES +33% **(OCT 2021–OCT 2026)** · … | Der Wert meint Verbraucherpreise (Benzin, Heizöl, Haushaltsstrom, Gas), nicht den Strompreis für Rechenzentren. |
| KB8 | 5:09 | Ersatz C3b: “That's what I mean by radical abundance.” (TIME, April 2025) | Wortlaut vor dem Einsatz an time.com prüfen; Datum April 27, 2025 | Der TIME-Text war gesperrt, und kein Suchauszug zeigte den Satz. Der Begriff selbst ist mehrfach belegt (Fortune, 11.2.2026). |
| KB9 | 7:35 | … LABOR SHARE 53.0%, LOWEST SINCE 1947 … | … LABOR SHARE 53.0%, **LOWEST ON RECORD (SERIES BEGINS 1947)** … | „Lowest since 1947“ liest sich so, als sei es 1947 noch tiefer gewesen. Das BLS schreibt: „the lowest level in the series, which begins in the first quarter of 1947“. |
| KB10 | 7:58 | Bauchbinde DARON ACEMOGLU · Economist, MIT · Nobel Prize 2024 | Datum der Folge ergänzen, sobald es am iMac geprüft ist | Passt zu M3. |
| KB11 | 9:21 | OpenResearch study · 1,000 people · $1,000 a month · 2020–2023 · 1.3 fewer working hours a week | … · **OpenResearch / NBER, July 2024** | Hausregel: Quelle mit Datum. |

---

## 3 · Alle Aussagen

### 3a · Sprechtext (vo-v2.txt, 77 Aussagen)

| # | Z. | Aussage | Ampel | Befund | Quelle (Datum) |
|---|---|---|---|---|---|
| S01 | 1 | „Sam Altman says everything will get cheap.“ | grün | Titelsatz: „Everything necessary will be cheap …“ (2021); 2026 wieder „massively deflationary pressure“. | [MLfE, 16.3.2021](https://moores.samaltman.com/) (verifiziert) · [Futurism, 29.1.2026](https://futurism.com/future-society/sam-altman-ai-deflation) |
| S02 | 2 | „Housing. Education. Food. Clothing. Everything necessary.“ | grün | Seine Liste wörtlich und in seiner Reihenfolge. | MLfE (verifiziert) |
| S03 | 3 | „His reason: artificial intelligence and robots will do the work.“ | grün | „labor is the driving cost …“, KI „joins the workforce“, Roboter-Haus. | MLfE |
| S04 | 4 | „Rent, up. Groceries, up. The power bill, up.“ | grün | Nur die Richtung wird gesprochen. Okt. 2021–Okt. 2026: Lebensmittel +24,0 %, Energie +33,2 %, alle Preise +22,0 %. Wohnen (+27,8 %) nur als Suchauszug aus der Recherche, die Richtung ist sicher. | [BLS TED, 19.11.2026](https://www.bls.gov/opub/ted/2026/consumer-prices-up-22-0-percent-over-5-years-ending-october-2026.htm) |
| S05 | 6 | „Prices don't fall all at once. They fall one after another.“ | grün | These des Films, als Deutung erkennbar und Schild für Schild belegt. | – |
| S06 | 8–9 | „The first price has already fallen. Almost to nothing. Up to a week of a top programmer's work can now cost less than a dollar.“ | gelb | Die Quelle trägt den Satz: „a very high-end programmer 20 hours, 40 hours“ → „less than a dollar's worth of compute tokens“. Aber es ist Altmans Schätzung für eine einzelne Aufgabe, im Ton erst in Z. 26 zugeordnet. „can“ deckt das. Die Fußzeile „Sam Altman's estimate“ im Bild ist Pflicht. | [Fed-Transkript, 22.7.2025](https://www.federalreserve.gov/mediacenter/files/capital-framework-conference-fireside-chat-transcript.pdf) · [Fortune, 23.7.2025](https://fortune.com/2025/07/23/sam-altman-artificial-intelligence-too-cheap-jobs/) |
| S07 | 10 | „But one thing on his list may never get cheap. It may even rise.“ | grün | „may“, gedeckt durch Altmans eigenen Satz über Land. | [Three Observations, Feb. 2025](https://blog.samaltman.com/three-observations) (verifiziert) |
| S08 | 12 | „This January, he made the promise again.“ | grün | Town Hall live am Montag, 26.1.2026 (US-Zeit; asiatische Berichte nennen den 27.1.). „the promise“ ist das Wort des Films für „massively deflationary pressure“. | [Futurism, 29.1.2026](https://futurism.com/future-society/sam-altman-ai-deflation) · [TechNews, 27.1.2026](https://technews.tw/2026/01/27/openai-no-more-frenzied-expeditions/) |
| S09 | C1 | O-Ton: „… we're going to have massively deflationary pressure.“ | gelb | Der Sinn ist durch mehrere Berichte belegt. Der genaue Wortlaut stammt nur aus Futurism und ist am Video (Kapitel 07:03–09:53) nicht geprüft. | Futurism, 29.1.2026 · [AOL/Benzinga](https://aol.com/sam-altman-warns-ai-deflationary-203017810.html) |
| S10 | 14 | „Deflationary pressure. In plain words: prices heading down.“ | grün | Richtige Übersetzung des Begriffs. | – |
| S11 | 15 | „His argument is stronger than it sounds: almost every price you pay is mostly other people's time.“ | gelb | Als Altmans Argument gerahmt, aber stärker als sein Text („many levels of the supply chain“). Gesamtwirtschaftlich geht etwas mehr als die Hälfte an Arbeit, bei Miete und Energie nicht. Der Film prüft das danach. → K2 | MLfE · [BLS, 5.11.2026](https://www.bls.gov/news.release/archives/prod2_11052026.htm) |
| S12 | 16, 60 | „Of every dollar Americans spend on food, more than half pays for somebody's work. The farm gets about twelve cents.“ (Rückgriff Z. 60) | gelb | Daten 2024: 54,1 Cent Arbeit, 11,8 Cent Farm. Gilt für in den USA erzeugte Lebensmittel. Das Update mit Daten 2025 (angekündigt für 17.11.2026) war nicht einsehbar. → KB1 | [USDA ERS, Food Dollar](https://ers.usda.gov/data-products/food-dollar/summary-findings) (Daten 2024, Stand März 2026) |
| S13 | 17 | „Let superintelligence do the thinking and robots the lifting, and the price sinks toward what the machines cost.“ | grün | Paraphrase von MLfE („will fall toward zero“) und dem Roboter-Haus. | MLfE |
| S14 | 18 | „He even pictures a house, built by robots, for about the cost of renting them.“ | grün | „the cost of building that house is close to the cost to rent the robots.“ Die Bedingung (Land) löst der Film in Z. 66 auf. | MLfE (verifiziert) |
| S15 | 19 | „Then again, he runs the company behind ChatGPT. Cheap intelligence is what he sells.“ | grün | Altman ist CEO von OpenAI (Stand Nov. 2026, keine gegenteilige Meldung). Die Interessenlage ist genannt. | Allgemeinwissen |
| S16 | 26 | „That programmer's week for less than a dollar is Altman's own example.“ | grün | Zuordnung korrekt. „week“ rundet „20 hours, 40 hours“ auf; im Hook steht „Up to“. | Fed-Transkript, 22.7.2025 |
| S17 | 26 | „And by his count, AI gets about ten times cheaper every year.“ | grün | „The cost to use a given level of AI falls about 10x every 12 months“. Unabhängig bestätigt: Epoch AI misst seit 2023 rund 13× pro Jahr. | Three Observations, Feb. 2025 (verifiziert) · [Epoch AI, 22.9.2026](https://epoch.ai/publications/the-plunging-price-of-thought) (über [TechSpot](https://www.techspot.com/news/114055-cost-ai-performance-falling-fast-could-reshape-entire.html)) |
| S18 | 27 | „Across Europe, about three in ten literary translators say it has already cost them work.“ | gelb | CEATL-Umfrage 2026, 1.785 Befragte, 30 % melden weniger Aufträge wegen KI. Nur ein Bericht gefunden (ceatl.eu gesperrt). Die Befragten sind Mitglieder der Verbände. → K3 | [CEATL](https://www.ceatl.eu/ia-survey-press-release) (laut Faktenzettel) · Branchenbericht (Suchauszug 20.11.2026) |
| S19 | 28 | „But a falling cost is not yet a falling price.“ | grün | Deutung. | – |
| S20 | 29 | „Law firms have AI too.“ | grün | Ausgaben für Legal Tech 2025 +9,7 %, so stark wie nie. | [LawNext, Jan. 2026](https://www.lawnext.com/2026/01/legal-tech-spending-surges-9-7-as-firms-race-to-integrate-ai.html) |
| S21 | 29 | „Yet the vast majority of legal fees in America are still billed by the hour.“ | grün | „90% of legal dollars still flow through hourly rate arrangements“. | [Thomson Reuters Institute, 2026 State of the US Legal Market (Jan. 2026)](https://www.thomsonreuters.com/en-us/posts/legal/state-of-the-us-legal-market-2026) |
| S22 | 29 | „Many firms even raised their rates.“ | grün | Kanzleien erhöhten 2025 die Sätze im Schnitt um 7,3 %; viele mit dem Argument, KI mache Rat wertvoller. | Thomson Reuters Institute (Jan. 2026) und Blog-Zusammenfassungen |
| S23 | 30 | „So that's what gets cheap first: pure thinking. But only as fast as competition forces it.“ | grün | Deutung aus S17–S22. | – |
| S24 | 31 | „something became nearly free, and its price kept climbing.“ | grün | Brücke zu S26–S29 (Listenpreis, nominal). | – |
| S25 | 33 | „Education. It's on his list.“ | grün | MLfE-Liste. | MLfE |
| S26 | 34 | „In some studies, students with a well-built AI tutor learn more than they do in class.“ | grün | Harvard-Physik: Der Lernzuwachs lag im Median mehr als doppelt so hoch wie im aktiven Präsenzunterricht. „some studies“ und „well-built“ decken die Nullbefunde ab. | [Kestin u. a., Scientific Reports, Juni 2025](https://www.nature.com/articles/s41598-025-97652-6) |
| S27 | 34 | „And the tutor costs almost nothing.“ | gelb | Keine Zahl in den Quellen; plausibel über die Tokenpreise (S17). | – |
| S28 | 35 | „So a degree should be getting cheaper. It isn't.“ | gelb | Nominal richtig, real nicht: Der Listenpreis fiel inflationsbereinigt seit 2016/17 um 8 %; der Nettopreis liegt bei rund 1.920 $. → K1, eingearbeitet | College Board, 5.11.2026 (über [Inside Higher Ed](https://www.insidehighered.com/node/223046)) |
| S29 | 35 | „This fall, the sticker price at America's public universities went up again.“ | grün | 2026/27: 12.290 $ (+350 $, +2,9 %), Listenpreis; das Studienjahr begann im Herbst 2026. | College Board, Trends in College Pricing 2026 (5.11.2026) |
| S30 | 36 | „Because a big part of that price was never the knowledge. It's the certificate.“ | grün | Deutung, als solche gesprochen („a big part“), keine Zahl. | – |
| S31 | 37 | „The knowledge is nearly free. The diploma is not.“ | grün | Deutung. | – |
| S32 | 42 | „Elon Musk promises even more.“ | gelb | Prognose, als „promises“ gerahmt wie bei Altman. Die Interessenlage fehlt: Tesla baut Optimus-Roboter, Musk betreibt eine KI-Firma. → KB6 | – |
| S33 | 42 | „Asked this fall whether some things should simply be free for everyone, he said:“ | **rot** | Aufgezeichnet am 6.8.2026, also im Sommer. → **M1** | Episodenangaben; [Axios, 17.10.2026](https://axios.com/2026/10/17/elon-musk-doge-walter-isaacson-podcast) |
| S34 | C2 | O-Ton: „… anyone will be able to have any goods and services that they want.“ | grün | Wortlaut an den Untertiteln geprüft (#27-Recherche, ±0,5 s); den Ton noch hören. | YouTube AQnwQHMnCrE, 00:20:49–00:20:57 |
| S35 | 44 | „Any goods, for anyone.“ | grün | Treue Verdichtung von C2. | – |
| S36 | 45 | „The robots are real: more than five million work in the world's factories.“ | grün | 5.079.078 Industrieroboter in Betrieb (Ende 2025, +9 %). | [IFR, World Robotics 2026, Executive Summary (Sept. 2026)](https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf) |
| S37 | 45 | „And by the official numbers, American smartphone prices fell by half in five years.“ | **rot** | Die Zahl ist qualitätsbereinigt; der Ladenpreis steigt. → **M2** | BLS TED, 19.11.2026 · BLS-Faktenblatt · IDC, 26.8.2026 |
| S38 | 46 | „But this year, analysts expect phones to cost more again.“ | grün | IDC: Durchschnittspreis 2026 +27,6 %. Auch der VPI für Smartphones stieg im Okt. 2026 um 1,4 % zum Vormonat, so stark wie nie seit Beginn der Reihe (Bericht). | [IDC, 26.8.2026](https://idc.com/resource-center/blog/smartphone-shipments-set-for-record-16-7-drop-in-2026-as-the-memory-crisis-hits-full-force) |
| S39 | 46 | „AI data centers are buying up the memory chips your next phone needs.“ | grün | IDC spricht von der „memory crisis“; mehrere Berichte: „AI is gobbling up the world's memory chips, sending smartphone prices to record highs“. | IDC, 26.8.2026 · [Yahoo Finance, 2026](https://finance.yahoo.com/news/ai-gobbling-world-memory-chips-070141408.html) · [TechCrunch, 26.2.2026](https://techcrunch.com/2026/02/26/memory-shortage-could-cause-the-biggest-smartphone-shipments-dip-in-over-a-decade/) |
| S40 | 47–48 | „So the third tag does fall. Slowly, and not in a straight line. … materials, chips and power.“ | grün | Deutung aus S36–S39. | – |
| S41 | 51 | „once machines build the data centers, intelligence should cost little more than its electricity.“ | grün | „As datacenter production gets automated, the cost of intelligence should eventually converge to near the cost of electricity.“ | [The Gentle Singularity, Juni 2025](https://blog.samaltman.com/the-gentle-singularity) (verifiziert) |
| S42 | 52 | „That makes energy the floor. And the floor isn't falling.“ | grün | Deutung des Films; Altman spricht vom Strom für Rechenzentren. | – |
| S43 | 52 | „In five years, American energy prices rose by about a third.“ | grün | Energie im VPI +33,2 % (Okt. 2021–Okt. 2026); das sind Verbraucherpreise. → KB7 | [BLS TED, 19.11.2026](https://www.bls.gov/opub/ted/2026/consumer-prices-up-22-0-percent-over-5-years-ending-october-2026.htm) |
| S44 | 53 | „Demis Hassabis, the Nobel laureate who runs Google DeepMind, thinks it could help crack clean energy.“ | grün | Chemie-Nobelpreis 2024, CEO von Google DeepMind. DeepMind arbeitet mit Commonwealth Fusion Systems an Fusion; Hassabis erwartet von KI neue Materialien für Fusion und Solar. | [DeepMind, 16.10.2025](https://deepmind.google/discover/blog/bringing-ai-to-the-next-generation-of-fusion-energy/) · [Fortune, 11.2.2026](https://fortune.com/2026/02/11/demis-hassabis-nobel-google-deepmind-predicts-ai-renaissance-radical-abundance/) |
| S45 | C3 | O-Ton mit „radical abundance“ | gelb | Der Begriff ist mehrfach belegt (Fortune, 11.2.2026; TIME, 27.4.2025). Clip-Wortlaut und Zeitmarken sind offen. | Lex Fridman #475 (23.7.2025) |
| S46 | 55 | „It's a forecast, from a man whose company builds AI.“ | grün | Interessenlage genannt. | – |
| S47 | 60 | „Machines can take much of that out.“ | grün | Möglichkeit („can“), Deutung. | – |
| S48 | 61 | „But the ground under the food just set a record. American cropland has never cost more.“ | grün | Ackerland 6.020 $/Acre (+3,3 %), erstmals über 6.000 $, Rekord. Nominal; real +0,3 % (ERS). Veröffentlicht am 31.7.2026. | [USDA NASS, Land Values 2026 Summary (31.7.2026)](https://release.nass.usda.gov/reports/land0726.pdf) · [Farm Policy News, Aug. 2026](https://farmpolicynews.illinois.edu/2026/08/us-cropland-tops-6000-per-acre-for-first-time-in-2026/) |
| S49 | 62 | „the work comes out of the price, the ground stays in.“ | grün | Deutung. | – |
| S50 | 65 | „Housing. The first word on his list.“ | grün | MLfE: „housing, education, food, clothing“. | MLfE |
| S51 | 66 | „if robots can build a house on land you already own.“ | grün | Wörtlicher Satzanfang. | MLfE (verifiziert) |
| S52 | 67 | „Even in his own picture, the land is already paid for.“ | grün | Deutung von „land you already own“. | – |
| S53 | 68 | „about forty cents of every dollar a home is worth isn't the house. It's the ground under it.“ | grün | Landanteil am Hauswert (USA gesamt) 39,9 % im Jahr 2022 (2012: 37,0 %). Eine neuere FHFA-Zahl fand ich nicht. | [FHFA-Blog „Land Price Appreciation during the COVID-19 Pandemic“](https://fhfa.gov/blog/statistics/land-price-appreciation-during-the-covid-19-pandemic) |
| S54 | 69 | „Robots can make walls cheap. They can't make more ground.“ | grün | Deutung. | – |
| S55 | 70 | „Altman never hid this. He wrote it himself: the price of limited resources like land may rise even more dramatically.“ | gelb | Inhaltlich korrekt, gesprochen aber gekürzt. Original: „… the price of luxury goods and a few inherently limited resources like land may rise even more dramatically.“ Die Zitatkarte zeigt die volle Fassung. → K4 | Three Observations, Feb. 2025 (verifiziert) |
| S56 | 72 | „Machines can take the work out of a price. They can't take out what's scarce. And he knows which half is which.“ | grün | Leitgedanke, gestützt durch S51 und S55. | – |
| S57 | 77 | „a programmer's week, for less than a dollar. … It was a paycheck.“ | grün | Rückgriff auf S06 und S16. | – |
| S58 | 78 | „By his own argument, things get cheap because work gets cheap.“ | grün | MLfE. | MLfE |
| S59 | 79 | „This summer, American businesses produced more with almost the same hours of work.“ | grün | 3. Quartal 2026, Nonfarm Business: Produktion +3,7 %, Stunden +0,1 % (Jahresraten, vorläufig). | [BLS Productivity and Costs, 5.11.2026](https://www.bls.gov/news.release/archives/prod2_11052026.htm) |
| S60 | 79 | „And the share of that income going to workers fell to the lowest level on record.“ | grün | Lohnquote 53,0 %, „the lowest level in the series, which begins in the first quarter of 1947“. Vorläufig; die Revision kommt am 8.12.2026, also nach dem Upload. | BLS, 5.11.2026 · [Bloomberg Law](https://news.bloomberglaw.com/daily-labor-report/labors-share-of-us-gdp-drops-to-record-low-in-data-back-to-1947) |
| S61 | 80 | „That's no proof AI did it.“ | grün | Richtige Einschränkung. | – |
| S62 | 80 | „But this fall, the Nobel-winning economist Daron Acemoglu was asked …“ | **rot** | Aufnahmedatum nicht belegbar. → **M3** | WEF-Seite ohne Datum · MIT Shaping Work |
| S63 | 80 + C4 | „… was asked which AI number leaders should watch. He named this one.“ (+ O-Ton C4) | gelb | Nur über den Kapiteltitel des offiziellen Uploads belegt („The AI statistic leaders should watch: labour's share of income“). Wortlaut und Frage am Ton prüfen. „Nobel-winning“ stimmt (Wirtschaftsnobelpreis 2024). → K5 | YouTube DxCkbNvzm0g (Kapitel 31:30–32:34) |
| S64 | 82 | „Altman saw it too. His promise has a second part. In full: everything necessary will be cheap, and everyone will have enough money to be able to afford it.“ | grün | Wörtlich. „saw it“: „Even more power will shift from labor to capital.“ | MLfE (verifiziert) |
| S65 | 83 | „In the same essay, he wrote: most people will end up worse off than they are today.“ | grün | Wörtlich. Die Bedingung („If public policy doesn't adapt accordingly“) steht als Frage davor. | MLfE (verifiziert) |
| S66 | 84 | „Even for him, cheap was never enough.“ | grün | Deutung. | – |
| S67 | 87 | „It worked for your phone.“ | gelb | Stimmt nur qualitätsbereinigt (S37). Mit M2 ist das jetzt hörbar vorbereitet. | BLS TED, 19.11.2026 |
| S68 | 87 | „wages can fall right along with prices.“ | grün | Möglichkeit; Lohnstückkosten im 3. Quartal −0,7 %, Lohnquote auf Rekordtief. | BLS, 5.11.2026 |
| S69 | 88 | „That was Altman's plan, paid for by exactly two things: big companies, and land.“ | grün | American Equity Fund: 2,5 % auf Firmen über einer Bewertungsgrenze (in Aktien) und 2,5 % auf privates Land (in Dollar). | MLfE (verifiziert) |
| S70 | 89 | „Alaska already pays its people a dividend from its oil wealth: twelve hundred dollars this year.“ | grün | „The 2026 PFD amount is $1,200, which includes a $200 energy relief payment.“ Auszahlung ab 1.10.2026. | [pfd.alaska.gov](https://pfd.alaska.gov/) · [Alaska Beacon, 30.9.2026](https://alaskabeacon.com/2026/09/30/permanent-fund-dividends-will-be-distributed-to-alaskans-starting-this-week/) |
| S71 | 89 | „His plan imagined more than ten times that.“ | grün | 13.500 $ / 1.200 $ = 11,25. Altman rechnete pro Erwachsenem und „a decade from now“ (Schätzung 2021), Alaska zahlt pro Einwohner. | MLfE · pfd.alaska.gov |
| S72 | 90 | „Its weakness: a fund pays what politics allows. Alaska's lawmakers now set the amount every year.“ | grün | Seit 2016/17 legt das Parlament die Summe im Haushalt fest; 2026 im Budgetkompromiss 1.000 $ + 200 $. | [Alaska Beacon, 18.5.2026](https://alaskabeacon.com/2026/05/18/alaska-lawmakers-reach-budget-deal-with-1000-pfd-and-200-energy-rebate-for-residents/) |
| S73 | 91 | „Altman backed a test of it: a thousand dollars a month, for three years.“ | grün | OpenResearch-Studie (ORUS), Nov. 2020–Okt. 2023, 1.000 Empfänger. Altman hat das Labor gegründet und mitfinanziert. | [UChicago Urban Labs, Sept. 2024](https://urbanlabs.uchicago.edu/attachments/b509fc06212b1970b619eed0e4d1d6002988bf5e/store/1950a74168ef0a877a2234070602021bdf3316c37c77886b6d752481476f/ORUS+September+2024.pdf) · [Route Fifty, Juli 2024](https://www.route-fifty.com/management/2024/07/results-biggest-study-guaranteed-income-programs-are-finally/398260/) |
| S74 | 91 | „People bought basics, and worked a little less.“ | grün | Mehr Ausgaben für Essen, Miete und Transport; 1,3 Arbeitsstunden pro Woche weniger. | wie S73 |
| S75 | 92 | „Its weakness is the bill.“ | grün | Deutung. | – |
| S76 | 93 | „Even Altman has changed his own answer more than once.“ | gelb | Vier Antworten nacheinander belegt; „changed“ ist etwas zu stark. → K6 | [TechSpot, Mai 2024](https://www.techspot.com/news/102975-sam-altman-envisions-future-where-universal-basic-income.html) · [TechCrunch, 6.4.2026](https://techcrunch.com/2026/04/06/openais-vision-for-the-ai-economy-public-wealth-funds-robot-taxes-and-a-four-day-work-week/) |
| S77 | 95–100 | Schluss: die Reihenfolge der Schilder, „He's half right“, „the rules are written by people you elect“, Kernsatz | grün | Zusammenfassung, keine neuen Fakten. | – |

### 3b · Einblendungen, Zitatkarten, Bauchbinden und Quellenzeilen (text-v2.md, 33 Stellen)

| # | Zeit | Einblendung (text-v2) | Ampel | Befund | Quelle |
|---|---|---|---|---|---|
| B01 | 0:02 | Zitatkarte “Everything necessary will be cheap …” · Moore's Law for Everything | grün | Wörtlich, Auslassungspunkte ehrlich. | MLfE (verifiziert) |
| B02 | 0:34 | Preisschild „UP TO A WEEK OF A TOP PROGRAMMER'S WORK“ → „< $1“ · Fußzeile „Sam Altman's estimate“ | grün | Die Fußzeile ist Pflicht, denn der Ton nennt die Quelle erst bei 2:07. | Fed-Transkript, 22.7.2025 |
| B03 | 0:55 | Bauchbinde SAM ALTMAN · CEO, OpenAI · JAN 2026 · ORIGINAL FOOTAGE | grün | Town Hall am 26.1.2026. | Futurism, 29.1.2026 |
| B04 | 1:18 | OF EVERY FOOD DOLLAR: 54¢ LABOR · 12¢ FARM · USDA ERS, Food Dollar (2024 data, updated March 2026) | gelb | Werte für 2024 stimmen. Update vom 17.11.2026 nicht einsehbar; nur in den USA erzeugte Lebensmittel. → KB1 | [USDA ERS](https://ers.usda.gov/data-products/food-dollar/summary-findings) |
| B05 | 1:34 | “… the cost of building that house is close to the cost to rent the robots.” · Moore's Law for Everything | grün | Wörtlich. | MLfE (verifiziert) |
| B06 | 2:07 | “a very high-end programmer 20 hours, 40 hours” → “less than a dollar's worth of compute tokens” · Federal Reserve, July 22, 2025 · his estimate | grün | Wortlaut und Datum stimmen. | [Fed-Transkript](https://www.federalreserve.gov/mediacenter/files/capital-framework-conference-fireside-chat-transcript.pdf) |
| B07 | 2:07 | “The cost to use a given level of AI falls about 10x every 12 months” · Feb 2025 · Epoch AI, Sept 2026: ≈13× per year since 2023 | grün | Beide Werte stimmen (Epoch: 47 % pro Quartal seit 2023, veröffentlicht 22.9.2026). | Three Observations · [Epoch AI](https://epoch.ai/publications/the-plunging-price-of-thought) |
| B08 | 2:17 | 30% REPORT FEWER ASSIGNMENTS OR CLIENTS BECAUSE OF AI · CEATL survey 2026 · 1,785 literary translators | gelb | Nur ein Bericht; „OR CLIENTS“ dort nicht genannt. → KB2 | CEATL (laut Faktenzettel) |
| B09 | 2:27 | ≈ 90% OF LEGAL SPEND STILL BILLED BY THE HOUR · Thomson Reuters Institute, 2026 State of the US Legal Market | grün | Stimmt; das Datum fehlt. → KB3 | [TR Institute, Jan. 2026](https://www.thomsonreuters.com/en-us/posts/legal/state-of-the-us-legal-market-2026) |
| B10 | 2:53 | Harvard physics course: more than double the learning gains · Scientific Reports, 2025 · klein: 19 universities, 7,200 students (preprint, Nov 2026) | gelb | Hauptzeile grün. Das Preprint (arXiv) war gesperrt und ist ungeprüft. → KB4 | [Scientific Reports, Juni 2025](https://www.nature.com/articles/s41598-025-97652-6) |
| B11 | 3:02 | PUBLIC FOUR-YEAR, IN-STATE TUITION: $12,290 · +2.9% · College Board, Nov 5, 2026 (published price) | grün | Wert und Datum stimmen (+350 $). Kann-Zusatz zur Inflation → KB5 | College Board, 5.11.2026 (über Inside Higher Ed) |
| B12 | 3:55 | Bauchbinde ELON MUSK · CEO, Tesla & SpaceX · 2026 · ORIGINAL FOOTAGE (The Builders with Walter Isaacson) | grün | Richtig. Kann: „AUG 2026“ und Interessenlage. → KB6 | Episodenangaben |
| B13 | 4:03 | 5,079,078 INDUSTRIAL ROBOTS IN OPERATION · International Federation of Robotics, Sept 2026 | grün | Exakter Wert (Bestand Ende 2025). | [IFR, Executive Summary WR 2026](https://ifr.org/img/worldrobotics/Executive_Summary_WR_2026_-_Industrial_Robots.pdf) |
| B14 | 4:03 | SMARTPHONES −51% IN FIVE YEARS · U.S. BLS, Nov 19, 2026 | **rot** | Wert stimmt, aber ohne Hinweis auf die Qualitätsbereinigung. → **MB1** | BLS TED · BLS-Faktenblatt |
| B15 | 4:15 | FORECAST 2026, AVERAGE SMARTPHONE PRICE: +14% (IDC) · +6.9% (Counterpoint) | **rot** | Veraltet (IDC jetzt +27,6 %), Counterpoint unbelegt. → **MB2** | IDC, 26.8.2026 |
| B16 | 4:38 | Zitatkarte “As datacenter production gets automated …” · The Gentle Singularity, June 2025 | grün | Wörtlich. | verifiziert |
| B17 | 4:47 | ENERGY +33% IN FIVE YEARS · U.S. BLS, Nov 19, 2026 | grün | +33,2 %. Kann: „CONSUMER“ und Zeitraum. → KB7 | BLS TED, 19.11.2026 |
| B18 | 4:47 | optional: ELECTRICITY ≈ 7% OF A BIG AI DATA CENTER'S YEARLY COST · SERVERS ≈ 60% · Epoch AI, 2026 | **rot** | Nicht bestätigt, eigene Rechnung. → **MB3** (entfällt) | – |
| B19 | 5:09 | Bauchbinde DEMIS HASSABIS · CEO, Google DeepMind · Nobel Prize 2024 · 2025 · ORIGINAL FOOTAGE | grün | Alle Angaben stimmen. | Nobelpreis Chemie 2024 |
| B20 | 5:09 | Ersatz C3b: “That's what I mean by radical abundance.” · TIME, April 2025 | gelb | Wortlaut nicht einsehbar (time.com gesperrt). → KB8 | [TIME, 27.4.2025](https://time.com/7280740/demis-hassabis-interview/) |
| B21 | 5:44 | U.S. CROPLAND: $6,020 AN ACRE · FIRST TIME ABOVE $6,000 · USDA, July 31, 2026 | grün | Wert und Datum stimmen. | [USDA NASS, 31.7.2026](https://release.nass.usda.gov/reports/land0726.pdf) |
| B22 | 6:07 | Zitatkarte “If robots can build a house on land you already own …” | grün | Wörtlich. | MLfE (verifiziert) |
| B23 | 6:22 | LAND ≈ 40% OF U.S. HOME VALUE · FHFA estimate (2022) | grün | 39,9 % (2022); der Prüfauftrag aus text-v2 ist erledigt, eine neuere FHFA-Zahl gibt es nicht. | [FHFA-Blog](https://fhfa.gov/blog/statistics/land-price-appreciation-during-the-covid-19-pandemic) |
| B24 | 6:34 | Zitatkarte “… the price of luxury goods and a few inherently limited resources like land may rise even more dramatically.” · Three Observations, Feb 2025 | grün | Wörtlich. | verifiziert |
| B25 | 7:35 | Q3 2026: OUTPUT +3.7% · HOURS +0.1% · LABOR SHARE 53.0%, LOWEST SINCE 1947 · U.S. BLS, Nov 5, 2026 (preliminary) | gelb | Werte stimmen; „LOWEST SINCE 1947“ ist mehrdeutig. → KB9 | [BLS, 5.11.2026](https://www.bls.gov/news.release/archives/prod2_11052026.htm) |
| B26 | 7:58 | Bauchbinde DARON ACEMOGLU · Economist, MIT · Nobel Prize 2024 · ORIGINAL FOOTAGE (World Economic Forum) | grün | Richtig. Kann: Datum der Folge. → KB10 | Wirtschaftsnobelpreis 2024 |
| B27 | 8:09 | Zitatkarte, ganzer Titelsatz · March 16, 2021 | grün | Wörtlich, Datum auf der Seite. | MLfE (verifiziert) |
| B28 | 8:21 | Zitatkarte “If public policy doesn't adapt accordingly, most people will end up worse off than they are today.” | grün | Wörtlich. | MLfE (verifiziert) |
| B29 | 8:54 | AMERICAN EQUITY FUND (2021): 2.5% OF LARGE COMPANIES' VALUE, PAID IN SHARES · 2.5% OF LAND VALUE · klein: OpenAI, April 2026: “Public Wealth Fund” | grün | Stimmt („privately-held land“; OpenAI-Papier vom 6.4.2026). | MLfE · TechCrunch, 6.4.2026 |
| B30 | 9:04 | ALASKA 2026: $1,200 PER RESIDENT ($1,000 dividend + $200 energy relief) · pfd.alaska.gov · Altman's estimate (2021): ≈ $13,500 A YEAR PER ADULT, “a decade from now” | grün | Stimmt. | pfd.alaska.gov · MLfE |
| B31 | 9:14 | 2022: $3,284 · 2026: $1,200 · amount set by the legislature each year | grün | Stimmt (2022 inkl. 662 $ Energiehilfe). | [Gouverneur Alaska, 2022](https://gov.alaska.gov/2022-permanent-fund-dividend-hits-a-record-3284-00/) · Alaska Beacon, 18.5.2026 |
| B32 | 9:21 | OpenResearch study · 1,000 people · $1,000 a month · 2020–2023 · 1.3 fewer working hours a week | grün | Stimmt; das Datum der Quelle fehlt. → KB11 | UChicago Urban Labs, Sept. 2024 |
| B33 | 9:36 | Zeitleiste: cash study · 2021 fund of shares and land · 2024 “universal basic compute” · 2026 public wealth fund | grün | Alle vier Stationen belegt (UBC: All-In-Podcast, Mai 2024). | TechSpot, Mai 2024 · TechCrunch, 6.4.2026 |

---

## 4 · Relative Zeitwörter (Upload So 22.11.2026)

| Wort | Z. | bezieht sich auf | Datum | Urteil |
|---|---|---|---|---|
| „This January“ | 12 | OpenAI Town Hall | 26.1.2026 | stimmt |
| „This fall“ | 35 | Listenpreis 2026/27 | Studienjahr ab Herbst 2026; College Board 5.11.2026 | stimmt |
| „this fall“ | 42 | Musk bei Isaacson | aufgezeichnet 6.8.2026, veröffentlicht 20.10.2026 | **falsch → „this summer“ (M1)** |
| „this year“ | 46 | Handy-Prognose 2026 | IDC, Aug. 2026 | stimmt |
| „This summer“ | 79 | 3. Quartal 2026 (Juli–Sept.) | BLS, 5.11.2026 | stimmt |
| „this fall“ | 80 | Acemoglu, Radio Davos | Upload ca. Ende Okt. 2026, Aufnahme offen | **unbelegt → „recently“ (M3)** |
| „this year“ | 89 | Alaska-Dividende 2026 | Auszahlung ab 1.10.2026 | stimmt |
| „now“ | 9, 90 | Fed-Beispiel (Juli 2025); Parlament legt fest (seit 2016/17) | – | stimmt |
| „just set a record“ | 61 | Ackerland | 31.7.2026 | stimmt (knapp vier Monate) |

---

## 5 · Für die Ampelseite: die acht heikelsten Aussagen

1. **Eine Woche Programmierarbeit für unter einen Dollar (gelb):** Das ist Altmans eigene Schätzung für eine einzelne Aufgabe, keine Messung (Fed-Transkript, 22.7.2025).
2. **Smartphones halb so teuer (rot → korrigiert):** Das gilt nur qualitätsbereinigt (BLS TED, 19.11.2026: −51,2 %); der Durchschnittspreis neuer Handys steigt 2026 um 27,6 % (IDC, 26.8.2026).
3. **Musk „this summer“ (rot → korrigiert):** Das Interview erschien am 20.10.2026, aufgezeichnet wurde es am 6.8.2026 (Episodenangaben; Axios, 17.10.2026).
4. **Acemoglu „recently“ (rot → korrigiert):** Das Aufnahmedatum der Radio-Davos-Folge ist nicht belegbar; seine Antwort ist nur über den Kapiteltitel belegt (WEF, YouTube-Upload Ende Okt. 2026).
5. **Lohnquote auf Rekordtief (grün):** 53,0 % im 3. Quartal 2026, tiefster Wert seit Beginn der Reihe 1947; vorläufig, Revision am 8.12.2026 (BLS, 5.11.2026).
6. **Studium wird nicht billiger (gelb → entschärft):** Der Listenpreis stieg 2026/27 um 2,9 % auf 12.290 $, langsamer als die Inflation; real fiel er seit 2016/17 um 8 % (College Board, 5.11.2026).
7. **Drei von zehn Literaturübersetzern (gelb):** CEATL-Umfrage 2026 mit 1.785 Befragten; dafür fand ich nur einen Bericht, die CEATL-Seite war gesperrt.
8. **Lebensmittel-Dollar (gelb):** 54,1 Cent Arbeit, 11,8 Cent Farm (USDA ERS, Daten 2024); das Update mit Daten 2025 vom 17.11.2026 ist noch nicht eingesehen.
