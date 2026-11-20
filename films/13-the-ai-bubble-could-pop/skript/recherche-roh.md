# Film 14: Rohrecherche

**Arbeitstitel:** "The AI Bubble Could Pop. Superintelligence Won't Stop."
**Kanal:** The Good Takeoff
**Recherche-Stand:** 28.10.2026, ca. 15:40 UTC
**Status:** Rohfassung für die Redaktion, noch nicht sendefertig geprüft. Enthält keine Filmkonzepte und kein Skript.

---

## 0. Methodik, Einschränkungen, Legende

### 0.1 Netzwerk-Einschränkung (wichtig)

- In dieser Sitzung ließ sich keine Quellseite direkt öffnen.
  - WebFetch scheiterte bei fast allen Hosts schon an der Namensauflösung (ENOTFOUND).
  - curl über den Proxy wurde mit CONNECT 403 (Policy-Sperre) abgewiesen, u. a. für imf.org, sec.gov, cnbc.com, bis.org, bankofengland.co.uk, reuters.com, ft.com, nber.org, wikipedia.org, arxiv.org, umn.edu (Odlyzko-Papiere), metr.org und sequoiacap.com.
  - Erreichbar waren nur www.googleapis.com (YouTube Data API) und www.youtube.com.
- **Folge:** Alle Fakten stammen aus Suchmaschinen-Auszügen (WebSearch) der jeweils angegebenen Seite. Die URL nennt die Seite, aus der der Auszug stammt. Zahlen und Zitate sind damit nur indirekt geprüft.
- **Vor der Sendung** muss jede verwendete Zahl an der Primärquelle geprüft werden (Liste in Abschnitt 11). Dafür müssen die gesperrten Hosts in den Netzwerk-Einstellungen der Umgebung freigegeben werden.
- Zwei URLs stammen aus Vorwissen und wurden in dieser Sitzung nicht aufgerufen: die Sequoia-Essays von 2023 und 2024. Sie sind markiert.

### 0.2 Konfidenz-Legende

- **[hoch]**: Primärquelle laut Suchauszug (Gesetz, Behörden- oder Unternehmensdokument, Fachaufsatz) oder mehrere unabhängige seriöse Quellen mit denselben Zahlen.
- **[mittel]**: seriöse Sekundärquelle (Agentur, Wirtschaftspresse). Die Zahlen sind plausibel und konsistent, die Primärquelle wurde aber nicht selbst eingesehen.
- **[niedrig]**: einzelne Sekundärquelle, Blog oder Aggregator, widersprüchliche Angaben oder unklare Zuschreibung.
- Weil nichts direkt geöffnet werden konnte, bedeutet auch [hoch] hier nur "hoch laut Auszug". Vor der Sendung gegenprüfen.

### 0.3 YouTube-Abruf

- Abfrage direkt über die YouTube Data API v3, ohne key-Parameter (der Proxy setzt den Schlüssel ein).
- Nach den ersten Suchbegriffen war die Tagesquote für search.list erschöpft ("Search Queries per day"). videos.list und channels.list funktionierten weiter.
- Transkripte wurden nicht abgerufen. Die Watch-Seiten liefern eine Bot-Prüfung (LOGIN_REQUIRED), und das vidIQ-Transkript-Tool kostet 5 Credits, verfügbar waren 3. Die Hooks sind deshalb nur aus Titeln und Beschreibungen erschlossen.

### 0.4 Formales

- Zahlen stehen im deutschen Format: Mrd. = billion, Bio. = trillion, $ = US-Dollar, Bp. = Basispunkte.
- Zitate bleiben im englischen Original.
- Daten ohne Jahr beziehen sich auf 2026.
- **Offenlegung:** Diese Recherche wurde mit Claude (Anthropic) erstellt. Anthropic kommt im Material als Unternehmen vor (S-1, Verluste, Verpflichtungen für Rechenzentren). Die Anthropic-Fakten wurden wie alle anderen behandelt, sollten aber besonders sorgfältig gegen das S-1 geprüft werden.

---

## 1. Überraschende Einzelfakten (15 Kandidaten für die erste Minute)

1. **Der Blasen-Experte, der keine Blase sah.** Charles Mackay schrieb 1841 den Klassiker "Extraordinary Popular Delusions and the Madness of Crowds". Als Herausgeber des Glasgow Argus schrieb er am 2. Oktober 1845 über die Eisenbahn-Aktien: "There is no reason whatever to fear a crash." Der Eisenbahn-Aktienindex hatte im Sommer 1845 seinen Höchststand erreicht.
   [mittel: Primärzitat nur über Odlyzko und Zweig; Odlyzko hat dazu auch das Papier "Charles Mackay's own extraordinary popular delusions and the Railway Mania" geschrieben]
   https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf ; https://jasonzweig.com/the-extraordinary-popular-delusion-of-bubble-spotting/

2. **Minus 64 Prozent, und trotzdem wurden 6.220 Meilen Gleis gebaut.** Ein Eisenbahn-Aktienindex fiel von 167,9 (Sommer 1845) auf 60,5 (Ende 1849), rund −64 %. Aus den Genehmigungen der Jahre 1844 bis 1846 entstanden trotzdem 6.220 Meilen Strecke.
   [mittel]
   https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf ; https://cepr.org/index%2ephp/voxeu/columns/railway-mania-not-so-great-expectations ; https://en.wikipedia.org/wiki/Railway_Mania

3. **Gemessen an der Volkswirtschaft war die Railway Mania größer als der KI-Boom bisher.**
   - Eisenbahnbau in Großbritannien: 1846 5,7 %, 1847 6,7 % und 1848 4,7 % des BIP (Mitchell, zitiert bei Campbell). Odlyzko nennt für 1847 44 Mio. £, fast 8 % des BIP.
   - USA heute: Investitionen in KI-Rechenzentren, Rechenhardware und Netzwerktechnik lagen laut Epoch AI in Q1 2026 bei etwa 0,8 % des BIP, alle Computing-Infrastruktur bei ca. 1,5 %. Goldman Sachs erwartet für 2026 KI-Ausgaben von 1,8 % des BIP.
   [mittel; die Abgrenzungen unterscheiden sich]
   https://mpra.ub.uni-muenchen.de/21822/1/MPRA_paper_21822.pdf ; https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf ; https://epoch.ai/data-insights/ai-datacenter-share-gdp ; https://www.indexbox.io/blog/ai-investment-drives-one-third-of-us-gdp-growth-in-2026/

4. **Die Brontë-Schwestern als Kleinanlegerinnen.** Emily Brontë verwaltete das Erbe der Schwestern und legte es in George Hudsons York & North Midland Railway an. Charlotte schrieb am 30. Januar 1846 an Margaret Wooler, sie sei "anxious ... to sell our shares ere it be too late", wolle sich Emily aber nicht widersetzen.
   [mittel für Brief und Anlage. Den Wortlaut an der Briefausgabe (Smith) prüfen. Spätere Verluste sind nur in Blogs belegt.]
   https://www.annebronte.org/2020/09/27/2164/ ; https://www.open.ac.uk/Arts/reading/UK/record_details.php?id=28466

5. **Im Krisenjahr 1847 bekam Großbritannien eine gemeinsame Uhrzeit, wegen der Eisenbahn.** Das Railway Clearing House empfahl im September 1847 die Greenwich-Zeit. Die London and North Western Railway und die Caledonian Railway stellten am 1. Dezember 1847 um.
   [hoch]
   https://www.rmg.co.uk/discover/explore/greenwich-mean-time-gmt ; https://www.timeanddate.com/time/uk/time-zone-background.html

6. **Ein Penny pro Meile: Fairness per Gesetz, mitten im Boom.** Der Railway Regulation Act 1844 (Gladstone, königliche Zustimmung am 9. August 1844) schrieb "Parliamentary trains" vor: mindestens ein Zug täglich je Richtung, mindestens 12 mph, mit Sitzplätzen und Dach, höchstens 1 Penny pro Meile. Dazu kam eine Klausel: Nach 21 Jahren konnte der Staat Tarife revidieren oder Linien kaufen, wenn die Gewinne über 10 % lagen.
   [hoch]
   https://www.irishstatutebook.ie/1844/en/act/pub/0085/print.html ; https://victorianweb.org/history/1844act.html

7. **2001 lag die Glasfaser im Boden, aber nur ein Bruchteil davon leuchtete.** Die Deseret News schrieb im Juni 2001: "Only 5 percent of fiber in the ground is active".
   [mittel]
   https://www.deseret.com/2001/6/18/19591977/economy-s-slump-idles-95-of-fiber-optic-lines/

8. **Der Preis fiel um 99,95 Prozent.** IP-Transit kostete 1998 rund 1.200 $ pro Mbit/s und Monat. 2002 waren es etwa 200 $, 2005 75 $ und 2015 noch 0,63 $.
   [mittel: Branchenschätzung von DrPeering]
   https://drpeering.net/white-papers/Internet-Transit-Pricing-Historical-And-Projected.php

9. **Ein Netz über 27 Länder für 250 Millionen.** Global Crossing meldete am 28. Januar 2002 mit 12,4 Mrd. $ Schulden Insolvenz nach Chapter 11 an. Hutchison Whampoa und ST Telemedia übernahmen 61,5 % für 250 Mio. $. Die Altaktionäre gingen leer aus, das Netz ging an die neuen Eigentümer.
   [mittel]
   https://www.taipeitimes.com/News/biz/archives/2002/08/11/0000159871

10. **Das Radio blieb, die Aktie brauchte 37 Jahre.** RCA stieg in den 1920ern etwa auf das 200-Fache. Bereinigt um Aktiensplits fiel der Kurs von 114,75 (September 1929) auf 2,625 (Mai 1932), ein Minus von 98 %. Den Kurs von 1929 erreichte RCA erst 1966 wieder.
    [mittel]
    https://www.globalfinancialdata.com/rca-and-the-roaring-twenties

11. **Vom Insull-Crash zu den Strom-Genossenschaften.** Als Samuel Insulls Versorger-Imperium 1932 zusammenbrach, traf das rund 600.000 Aktionäre und 500.000 Anleihegläubiger. Danach kamen der Public Utility Holding Company Act (1935) und die ländliche Elektrifizierung über Genossenschaften (REA). Heute versorgen rund 900 Strom-Genossenschaften 42 Mio. Menschen auf 56 % der US-Landfläche.
    [mittel]
    https://ebsco.com/research-starters/politics-and-government/insull-utilities-trusts-collapse-prompts-new-federal ; https://reic.uwcc.wisc.edu/electric/ ; https://stories.coop/nreca/

12. **Stromkunden zahlen schon jetzt mit.** Im größten US-Strommarkt PJM stieg der Kapazitätspreis von 28,92 $ pro MW und Tag (2024/25) auf 329,17 $ (2026/27), also auf mehr als das Elffache. Der unabhängige Marktbeobachter rechnet der Nachfrage von Rechenzentren über drei Auktionen 23,1 Mrd. $ Mehrkosten für die übrigen Kunden zu.
    [hoch: Primärdokumente von PJM und dem Marktbeobachter, laut Auszug]
    https://www.monitoringanalytics.com/reports/Reports/2026/IMM_Analysis_of_the_20272028_RPM_Base_Residual_Auction_Part_A_20260105.pdf ; https://www.utilitydive.com/news/pjm-interconnection-capacity-auction-prices/753798/

13. **Fast ein Drittel des Gewinnwachstums waren Buchgewinne auf KI-Beteiligungen.** Die Gewinne der S&P-500-Firmen wuchsen in Q2 2026 um rund 48 % zum Vorjahr. Ohne nicht realisierte Gewinne auf Beteiligungen an Anthropic und OpenAI waren es nur rund 33 % (LSEG/Reuters). Allein Amazon verbuchte 53,4 Mrd. $ sonstige Erträge vor Steuern, überwiegend aus der Neubewertung von Anthropic.
    [mittel]
    https://www.thestar.com.my/tech/tech-news/2026/08/20/gains-in-ai-company-stakes-juice-second-quarter-earnings-for-sp-500 ; https://biz.heraldcorp.com/article/10830503

14. **Das Risiko kann man kaufen, die Mitsprache nicht.** Meta will ab Anfang 2027 neue stimmrechtslose Class-C-Aktien für bis zu 60 Mrd. $ verkaufen. Das kommt zu einer Kapitalerhöhung von rund 35 Mrd. $ im Oktober 2026 hinzu. Mark Zuckerberg hält 60,6 % der Stimmrechte bei 13,4 % wirtschaftlichem Anteil.
    [mittel bis hoch: SEC-Prospekt 424B5 laut Auszug]
    https://www.sec.gov/Archives/edgar/data/0001326801/000119312526431043/d133631d424b5.htm ; https://finance.yahoo.com/markets/article/metas-nearly-100-billion-stock-sale-is-a-turning-point-for-how-big-tech-pays-for-ai-140424769.html

15. **Die Technik bremst nicht.** Mitten in der Börsenunruhe meldet Anthropic im S-1 für das erste Halbjahr 2026 einen Umsatz von 16,29 Mrd. $, nach 1,16 Mrd. $ ein Jahr zuvor. Das ist rund das 14-Fache. Gleichzeitig steht ein Nettoverlust von 80,7 Mrd. $ im Dokument, davon rund 72 Mrd. $ ohne Zahlungswirkung.
    [hoch für die S-1-Zahlen laut Auszug]
    https://www.sec.gov/Archives/edgar/data/0002130357/000162828026067168/anthropicpbc-sx1.htm ; https://www.npr.org/2026/10/26/nx-s1-6014772/anthropic-ai-ipo-could-break-records

**Reserve, falls ein Fakt wegfällt** (Details in den Kapiteln):
- IWF: 14 KI-Kreisgeschäfte mit 1,4 Bio. $ zugesagten künftigen Umsätzen (2.6).
- Alphabet mit negativem freiem Cashflow in Q2 2026 (2.4, dünn).
- Great Exhibition 1851: rund 4 Mio. zusätzliche Bahnreisen (3.1).
- Telekom 1997–2001: Nachfrage etwa ×4, Glasfaser-Kapazität etwa ×500 (3.5).
- Einnahmen im Verhältnis zur Investition: Eisenbahn zwei Drittel, Telekom ein Viertel, KI ein Sechstel (2.8).
- Etwa ein Dauerarbeitsplatz pro MW Rechenzentrum (4.4).
- Virginia bekommt pro Dollar Steuernachlass 48 Cent zurück (4.4).
- Leerstand nordamerikanischer Rechenzentren: 1 % (5.2).
- A100-GPUs von 2020 verdienen weiter Geld, Verträge laufen bis 2029 (5.3).

---

## 2. Aktuelle Lage (September bis Oktober 2026)

### 2.1 Einordnung: Wo es Ende Oktober tatsächlich bricht

- **Die breiten Indizes sind nicht gecrasht.**
  - S&P 500: Rekordschluss 7.818,93 am 6.10. und 7.663,43 am 22.10. (−2,0 %).
  - Nasdaq Composite: Rekordschluss 27.599,89 am 6.10. und 26.008,86 am 22.10. (−5,8 %, eigene Rechnung).
  - [mittel]
  - https://ts2.tech/en/sp-500-sets-record-but-fades-26-points-before-fed-minutes/ ; https://en.wikipedia.org/wiki/Nasdaq_Composite (Meilenstein-Tabelle; die genaue Unterseite ist nicht gesichert) ; https://www.cnbc.com/2026/10/21/stock-market-today-live-updates.html
- **Die Einbrüche konzentrieren sich auf die verschuldeten Ränder.**
  - CoreWeave: rund −38 % im Oktober.
  - Oracle: rund −55 % vom 52-Wochen-Hoch.
  - Halbleiterindex SOX: mehr als 26 % unter dem Rekord vom 22. Juni.
  - Meta: −7 % am 22.10.
  - [mittel] Quellen in 2.3 und 2.4.
- **Gegenwind von außen:** Der US-Ölpreis liegt seit Jahresbeginn 72 % höher, Brent 83 % (Krieg im Nahen Osten).
  [mittel] https://www.cnbc.com/2026/10/21/stock-market-today-live-updates.html

### 2.2 Chronologie Juni bis Oktober 2026

| Datum | Ereignis | Konfidenz | Quelle |
|---|---|---|---|
| 22.06. | Rekordschluss des Halbleiterindex SOX | mittel | https://www.bloomberg.com/news/articles/2026-07-17/chips-stocks-tumble-into-bear-market-as-105-ai-rally-fizzles |
| 09.07. | S&P stuft Oracle auf BBB− ab, eine Stufe über "Junk" | mittel | https://thenextweb.com/news/oracle-sp-downgrade-ai-spending-junk-risk |
| 17.07. | SOX im Bärenmarkt (−20,2 %), nach +105 % seit dem März-Tief | mittel | Bloomberg (s. o.) |
| 22.07. | Alphabet hebt die Capex-Prognose auf 195–205 Mrd. $, Aktie ca. −7 % | mittel | https://www.tomshardware.com/tech-industry/big-tech/alphabet-goes-cash-flow-negative-for-the-first-time-as-ai-capex-doubles-to-44-9-billion-in-a-single-quarter |
| 28.–29.07. | Chip-Ausverkauf vernichtet mehr als 1 Bio. $ Börsenwert | mittel | https://www.cnbc.com/2026/07/29/chip-selloff-sk-hynix-samsung-softbank.html |
| 10.08. | OpenAI kauft Mitarbeiteraktien für 7 Mrd. $ zurück (Bewertung 852 Mrd. $) | mittel | https://www.bloomberg.com/news/articles/2026-08-10/openai-buys-back-7-billion-of-employee-shares-in-tender-offer |
| 11.08. | CoreWeave Q2: Umsatz ca. 2,58 Mrd. $, Nettoverlust 626 Mio. $ | mittel | https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html |
| 20.08. | LSEG/Reuters: KI-Beteiligungen blähen die S&P-Gewinne auf | mittel | https://www.thestar.com.my/tech/tech-news/2026/08/20/gains-in-ai-company-stakes-juice-second-quarter-earnings-for-sp-500 |
| 26.08. | Nvidia: Quartalsumsatz 96,2 Mrd. $ (+106 %) | mittel | https://www.nasdaq.com/articles/nvidia-q2-earnings-beat-blackwell-ultra-data-center-strength |
| 12.09. | Amodei-Essay "pacing the frontier". Altman stimmt zu, Musk schreibt "Dario is right" | mittel | https://www.cnbc.com/2026/09/12/anthropics-amodei-proposes-plan-to-slow-the-pace-of-advancing-ai-capabilities.html ; https://techcrunch.com/2026/09/12/anthropic-ceo-outlines-plan-to-pace-the-frontier/ |
| 14.09. | KI-Aktien geben nach | mittel | CNBC (s. o.) |
| 23.09. | Sitzung des UN-Sicherheitsrats zum Thema; Trump lehnt eine Verlangsamung ab | niedrig | nur Suchauszug, Details nicht geprüft |
| 30.09. | Bank of England (FPC) warnt vor einer "sharper correction" | mittel | https://www.bloomberg.com/news/articles/2026-09-30/ai-valuations-could-see-sharper-correction-boe-warns |
| 06.10. | Rekordschlüsse von S&P 500 und Nasdaq | mittel | s. 2.1 |
| 08.10. | Cembalest (JPMorgan): 42 KI-Aktien liefern 67 % der S&P-Kursgewinne seit Januar 2024. Am selben Tag berichtet TIME über den Senatsbericht zu Rechenzentren | mittel | https://advisoranalyst.com/2026/10/09/jpms-michael-cembalest-on-ai-concentration-debt-foreboding-and-the-markets-uneven-foundations.html/ ; https://time.com/article/2026/10/08/senate-investigation-ai-data-centers/ |
| 12.–13.10. | IWF (Jahrestagung Bangkok): eine KI-Korrektur ist eines von drei Hauptrisiken | mittel | https://www.imf.org/en/blogs/articles/2026/10/12/global-financial-markets-face-rising-risks-from-ai-bond-yields-and-cyberattacks |
| 13.10. | Eine CoreWeave-Anleihe (Fälligkeit 2032) rentiert zeitweise mit 15 % | mittel | https://www.cnbc.com/2026/10/21/coreweaves-market-confidence-erodes-as-bond-yields-spike-stock-sinks.html |
| 14.10. | CoreWeave fällt um 15,5 % auf 65,78 $ | mittel | CNBC (s. o.) |
| 19.10. | Goldman stuft CoreWeave auf "Buy" hoch; CEO Intrator nennt den Markt "irrational" | mittel | https://admiralmarkets.com/education/articles/shares/coreweave-stock-drop-ai-debt |
| 20.10. | Ken Griffin: KI ist "almost certainly" eine Blase | mittel | https://www.bloomberg.com/news/articles/2026-10-20/ken-griffin-says-ai-almost-certainly-in-a-bubble-right-now |
| 21.10. | Meta Q3: Capex-Prognose 135–145 Mrd. $, freier Cashflow −2,12 Mrd. $ | mittel | https://www.cnbc.com/2026/10/22/meta-stock-q3-earnings-free-cash-flow.html |
| 22.10. | Nasdaq −2,6 %, schlechtester Tag seit Juni; Meta ca. −7 % | mittel | https://www.cnbc.com/2026/10/21/stock-market-today-live-updates.html |
| 25.10. | Musk auf X: "guppy-level death" für mehr als 200 Neoclouds | mittel | https://www.cnbc.com/2026/10/26/neocloud-stocks-today-coreweave-nebius-iren-elon-musk.html |
| 26.10. | Anthropic-S-1 wird öffentlich (Nasdaq-Ticker "ANT"). CoreWeave schließt bei 51,62 $ (−5 %) | hoch / mittel | SEC-Link in 2.5 ; CNBC (s. o.) |

### 2.3 Neoclouds: CoreWeave als Bruchstelle

- **Oktober-Absturz**
  - 13.10.: Die Rendite einer Anleihe mit Fälligkeit 2032 erreicht zeitweise 15 %.
  - 14.10.: Die Aktie fällt um 15,5 % auf 65,78 $. In der Woche bis 16.10. fällt sie um rund 25 %.
  - 23.10.: Schluss bei 54,24 $, −37,75 % gegenüber dem Schlusskurs vom 30.09. (87,12 $). CNBC nennt für den Oktober −36 %.
  - Der 5-jährige CDS-Spread stieg zeitweise über 1.140 Bp.
  - [mittel] https://www.cnbc.com/2026/10/21/coreweaves-market-confidence-erodes-as-bond-yields-spike-stock-sinks.html ; https://247wallst.com/investing/2026/10/26/musk-predicts-guppy-level-death-for-neocloud-companies-as-coreweave-stock-falls-38-in-october/ ; https://admiralmarkets.com/education/articles/shares/coreweave-stock-drop-ai-debt
- **Gegenstimmen:** Goldman Sachs stufte am 19.10. auf "Buy" hoch. CEO Michael Intrator nannte den Markt "irrational".
  [mittel] admiralmarkets (s. o.)
- **Musk auf X (25.10.)**, als Antwort auf einen Post von Chamath Palihapitiya:
  - Mehr als 200 Neoclouds drohe ein "guppy-level death".
  - Kreditmärkte liehen Firmen ohne nennenswerte Umsätze außerhalb von KI-Rechenzentren kein Geld mehr.
  - SpaceX habe 40 Mrd. $ Schulden für GPUs aufgenommen. "SpaceX is not buying any neoclouds. Pointless."
  - Danach notierte CoreWeave am 26.10. bei 51,62 $ (−5 %).
  - [mittel: Das sind Musks eigene Behauptungen, sie sind nicht unabhängig belegt] https://www.cnbc.com/2026/10/26/neocloud-stocks-today-coreweave-nebius-iren-elon-musk.html
- **Q2 2026 (gemeldet am 11.08.)**
  - Umsatz ca. 2,575 Mrd. $ (+112 %), Nettoverlust 626 Mio. $.
  - Zinsaufwand laut Prognose für Q3: 860–940 Mio. $.
  - Auftragsbestand 104,2 Mrd. $, mit den Abschlüssen von Anfang Q3 ca. 129 Mrd. $.
  - Gesamtschulden 35,1 Mrd. $, davon 6,2 Mrd. $ im Jahr 2027 fällig. Rund 7,5 Mrd. $ sind mit GPUs besichert.
  - Capex-Prognose: 35–39 Mrd. $.
  - [mittel] https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html ; https://www.investing.com/news/company-news/coreweave-q2-2026-slides-revenue-doubles-backlog-surges-246-93CH-4852949

### 2.4 Hyperscaler: Die Investitionen übersteigen den Cashflow

- **Capex-Prognosen 2026**
  - Amazon ca. 220 Mrd. $.
  - Alphabet 195–205 Mrd. $.
  - Meta 135–145 Mrd. $.
  - Microsoft ca. 175–190 Mrd. $, je nach Abgrenzung von Finanzierungsleasing.
  - Summe ca. 720–745 Mrd. $, nach ca. 410 Mrd. $ im Jahr 2025 (+77 %).
  - [mittel] https://www.datacentres.com/guides/hyperscaler-capex-trends ; https://analysis-atlas.com/research/hyperscaler-ai-capex-2026/
- **Meta Q3 (21.10.)**
  - Untergrenze der Capex-Prognose angehoben, jetzt 135–145 Mrd. $.
  - Capex im Quartal: 34,9 Mrd. $. Freier Cashflow: −2,12 Mrd. $.
  - Rückstellung für Rechtsfälle: 9,9 Mrd. $.
  - Aktie am 22.10. −7 % bis −7,84 %. Der 5-jährige CDS-Spread erreichte ein Rekordhoch.
  - [mittel] https://www.cnbc.com/2026/10/22/meta-stock-q3-earnings-free-cash-flow.html
- **Meta-Eigenkapital (Oktober 2026)**
  - Kapitalerhöhung von rund 35–37,5 Mrd. $: 22,5 Mrd. $ über Class-A-Termingeschäfte laut 424B5 und 12,5 Mrd. $ über Pflichtwandel-Vorzugsaktien.
  - Ab Anfang 2027 ist ein "at-the-market"-Programm über 60 Mrd. $ in neuen stimmrechtslosen Class-C-Aktien geplant. Zusammen sind das "fast 100 Mrd. $".
  - Im Prospekt steht, Meta müsse "hundreds of billions of dollars" aufbringen. Das mehrjährige KI-Ausgabevolumen liegt bei ca. 825 Mrd. $.
  - Nvidia, AMD und Broadcom haben Interesse an Meta-Aktien für bis zu 5 Mrd. $ bekundet. Lieferanten kaufen also Aktien ihres Kunden.
  - [mittel; Prospekt laut Auszug] https://www.sec.gov/Archives/edgar/data/0001326801/000119312526431043/d133631d424b5.htm ; https://finance.yahoo.com/markets/article/metas-nearly-100-billion-stock-sale-is-a-turning-point-for-how-big-tech-pays-for-ai-140424769.html
- **Meta Hyperion (Oktober 2025):** Das Rechenzentrum wurde über eine Zweckgesellschaft finanziert.
  - Rund 27 Mrd. $ Anleihen, PIMCO als Ankerinvestor, Rating A+, Kupon 6,58 %.
  - Eigentum: Blue Owl 80 %, Meta 20 %.
  - Meta gibt für die ersten 16 Jahre eine Restwertgarantie.
  - Die Schulden stehen damit nicht in Metas Bilanz. Das Risiko liegt teilweise bei den Anleihekäufern.
  - [mittel] https://www.bisnow.com/news/national/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490
- **Alphabet Q2 2026**
  - Capex von 44,9 Mrd. $ (verdoppelt) überstieg den operativen Cashflow von 39,1 Mrd. $. Der freie Cashflow lag damit bei ca. −5,9 Mrd. $.
  - Laut Bericht war er erstmals seit dem Börsengang 2004 negativ. Eine andere Quelle (TIKR) formuliert vorsichtiger.
  - [mittel; "erstmals seit 2004": niedrig] https://www.tomshardware.com/tech-industry/big-tech/alphabet-goes-cash-flow-negative-for-the-first-time-as-ai-capex-doubles-to-44-9-billion-in-a-single-quarter
- **Oracle**
  - S&P-Abstufung auf BBB− am 9.7.
  - Aktie ca. 130 $ am 19.10., nach einem 52-Wochen-Hoch von 287 $ (ca. −55 %).
  - Vertraglich gesicherte künftige Umsätze (RPO): 638 Mrd. $, ca. die Hälfte davon von OpenAI.
  - Schulden: ca. 118 Mrd. $ langfristig plus ca. 39 Mrd. $ Leasing. Andere Quellen nennen 156–167 Mrd. $.
  - CDS-Spread ca. 200–300 Bp.
  - Banken versuchten mehr als sechs Monate lang, 38 Mrd. $ Baukredite für Rechenzentren in Texas und Wisconsin zu platzieren.
  - Im Januar 2026 klagten Anleihegläubiger.
  - [mittel; die Schuldenzahlen sind uneinheitlich] https://thenextweb.com/news/oracle-sp-downgrade-ai-spending-junk-risk ; https://startupfortune.com/sps-downgrade-leaves-oracle-financing-openais-bet-years-before-it-pays-off/

### 2.5 Die Labore: Anthropic und OpenAI

**Anthropic** (S-1 öffentlich seit 26.10.2026, Nasdaq-Ticker "ANT", vertraulicher Entwurf vom 1.6.2026)
- **Zahlen für H1 2026**
  - Umsatz 16,29 Mrd. $ (H1 2025: 1,16 Mrd. $).
  - Nettoverlust 80,7 Mrd. $, davon ca. 72 Mrd. $ ohne Zahlungswirkung (Bewertung von Finanzinstrumenten).
  - GAAP-Betriebsverlust: 693 Mio. $.
  - Rechenkosten ca. 9 Mrd. $; im gesamten Jahr 2025 waren es 7,3 Mrd. $.
  - [hoch laut Auszug] https://www.sec.gov/Archives/edgar/data/0002130357/000162828026067168/anthropicpbc-sx1.htm ; https://www.npr.org/2026/10/26/nx-s1-6014772/anthropic-ai-ipo-could-break-records ; https://www.cnbc.com/2026/10/26/anthropic-ipo-live-updates-ai-s-1-filing.html ; https://tomtunguz.com/anthropics-s1-grew-eleven-fold/
- **Finanzierung**
  - Series H Ende Mai 2026: 65 Mrd. $ bei einer Bewertung von 965 Mrd. $ nach der Runde.
  - Zum Börsengang berichtet Reuters von ca. 2 Bio. $ Bewertung und bis zu 100 Mrd. $ Emissionsvolumen. Das ist unbestätigt.
  - [mittel; die IPO-Zahlen niedrig] Quellen wie oben.
- **Verpflichtungen für Rechenzentren laut S-1**
  - Google 114,5 Mrd. $ (2026–2033), Amazon 110 Mrd. $ (2026–2036), Microsoft 44,9 Mrd. $, Nscale 44,6 Mrd. $, Lambda 41,3 Mrd. $.
  - Die Gesamtsumme ist im Dokument nicht ausgefüllt. Hochrechnungen in Medien liegen bei 475–750 Mrd. $.
  - [hoch für die Einzelposten laut Auszug, niedrig für die Summe] https://fortune.com/2026/10/26/anthropics-s-1-makes-clear-its-on-the-hook-for-billions-in-compute-its-customers-can-walk-at-any-time-2/
- **Kunden**
  - Kein Kunde steht für mehr als 10 % des Umsatzes, die fünf größten für ca. 25 %.
  - Fortunes Lesart: Anthropic ist "on the hook for billions in compute", während die Kunden "can walk at any time".
  - Die Nettoumsatzbindung (Net Revenue Retention) soll bei ca. 900 % liegen.
  - [mittel; die 900 % niedrig, nur Sekundärquelle] Fortune (s. o.) ; https://tomtunguz.com/anthropics-s1-grew-eleven-fold/

**OpenAI**
- **Geleakte Finanzzahlen für 2025** (Fortune/FT, 16.6.2026)
  - Umsatz 13,07 Mrd. $ (2024: 3,7 Mrd. $). Kosten 34 Mrd. $. Operativer Verlust 20,92 Mrd. $.
  - Zurechenbarer Nettoverlust 38,53 Mrd. $, darin 41,55 Mrd. $ Belastungen aus Fair-Value-Bewertungen.
  - An Microsoft wurden 17,2 Mrd. $ gezahlt.
  - Rechenkapazität: 0,2 GW (2023) und 1,9 GW (2025).
  - Kosten pro 1 $ Umsatz: 2,37 $ (2024) und 1,60 $ (2025).
  - [mittel: Leak, nicht offiziell] https://fortune.com/2026/06/16/openai-financials-leaked-losses-revenue-profit/
- **Finanzierung**
  - Am 27.2.2026 wurde eine Runde über 110 Mrd. $ angekündigt (Amazon 50, Nvidia 30, SoftBank 30). Im März schloss sie mit 122 Mrd. $ bei einer Bewertung von 852 Mrd. $.
  - Den vertraulichen S-1-Entwurf reichte OpenAI am 8.6.2026 ein.
  - Im August kaufte OpenAI Mitarbeiteraktien für 7 Mrd. $ zurück, ebenfalls zur Bewertung von 852 Mrd. $.
  - [mittel] https://www.bloomberg.com/news/articles/2026-08-10/openai-buys-back-7-billion-of-employee-shares-in-tender-offer

### 2.6 Nvidia und die Kreisgeschäfte

- **Nvidia, Q2 des Geschäftsjahres 2027** (Quartal bis 26.7.2026, gemeldet am 26.8.)
  - Umsatz 96,2 Mrd. $ (+106 %), davon Rechenzentren 89,0 Mrd. $ (+117 %).
  - Prognose für Q3: 108 Mrd. $.
  - Börsenwert ca. 5,5 Bio. $ am 13.10. (nur Sekundärquelle).
  - [mittel] https://www.nasdaq.com/articles/nvidia-q2-earnings-beat-blackwell-ultra-data-center-strength
- **Nvidia und OpenAI**
  - Die Absichtserklärung über bis zu 100 Mrd. $ (September 2025) wurde nie unterschrieben. Im Januar 2026 lag sie laut WSJ "on ice".
  - Stattdessen gab Nvidia im August 2026 Kreditunterstützung für OpenAIs Campus in Ohio (4,25 GW plus eine Option auf 3,75 GW). Laut WSJ reicht die Absicherung bis zu 105 Mrd. $.
  - Huang nannte in diesem Zusammenhang ca. 600 Mrd. $ an Nvidia-Rechenleistung bis 2030.
  - [mittel; die 600 Mrd. $ niedrig, der Bezug ist unscharf] https://www.investing.com/analysis/nvidia-and-openais-100-billion-deal-is-dead-what-replaced-it-matters-more-200680620
- **Der IWF zu den Kreisgeschäften**
  - Seit 2023 gab es 14 öffentlich bekannte Deals: rund 300 Mrd. $ Eigenkapital (angeführt von den Hyperscalern) und 650 Mrd. $ Schulden. Im Gegenzug stehen 1,4 Bio. $ "future revenue commitments".
  - Rund 320 Mrd. $ der Schulden liegen bei den Empfängerfirmen.
  - Jason Wu (IWF) spricht von einem "triple whammy": Aktien fallen, Schulden werden schwer bedienbar, Zusagen platzen.
  - [mittel: Sekundärberichte, untereinander konsistent] https://thenextweb.com/news/imf-circular-ai-deals-financial-stability-report ; https://www.cnbc.com/2026/10/13/treasury-yields-imf-debt-inflation-.html ; https://qz.com/imf-ai-stock-crash-global-financial-stability-101326

### 2.7 Warnungen der Institutionen

**IWF** (12.–13.10.2026, Jahrestagung in Bangkok)
- **GFSR, Kapitel 1** ("Beneath the Resilience: Rising Risks, Unresolved Vulnerabilities") nennt drei herausragende Risiken: eine KI-getriebene Korrektur, einen stärkeren Anstieg der Staatsanleiherenditen und Cyberangriffe.
  [hoch laut Auszug] https://www.imf.org/en/blogs/articles/2026/10/12/global-financial-markets-face-rising-risks-from-ai-bond-yields-and-cyberattacks
- **Vamvakidis (IWF):** Der Rest der Welt sei in US-Vermögenswerten, "particularly AI", so stark engagiert wie nie. Sein Satz: "resilience is not necessarily safety".
  [mittel] https://qz.com/imf-ai-stock-crash-global-financial-stability-101326 ; https://www.cnbc.com/2026/10/13/treasury-yields-imf-debt-inflation-.html
- **Anleihemarkt:** Die Hyperscaler stehen für ca. 10 % der weltweiten Emissionen von Investment-Grade-Anleihen (2024: unter 1 %).
  [mittel] https://thenextweb.com/news/imf-circular-ai-deals-financial-stability-report
- **WEO**
  - Weltwachstum 3,1 % (2026) und 3,4 % (2027).
  - Negativszenario: Fallen die US-Aktien um 20 %, liegt das Welt-BIP 2028 um 1,1 % unter dem Basisszenario (USA −1,8 %, Asien −1,7 %). Ein anderer Kasten nennt −0,4 % bzw. −0,6 %. Dieser Widerspruch muss geprüft werden.
  - [mittel] https://www.usnews.com/news/world/articles/2026-10-12/imf-says-ai-investment-propping-up-global-growth-but-war-and-debt-threaten-outlook ; https://www.investing.com/news/economy-news/imf-flags-risks-to-global-economy-from-ai-market-correction-war-and-debt-4946017
- **Georgieva:** "when we are dependent on one particular driver of growth, it is like we stand on one leg".
  [mittel] https://www.taipeitimes.com/News/biz/archives/2026/10/18/2003866147

**Bank of England, Financial Policy Committee** (30.9.2026)
- Das Risiko einer "sharper correction" als im Juli sei gestiegen. Die US-Bewertungen seien so gestreckt wie fast nie seit der Dotcom-Zeit, die britischen wie seit 2008 nicht mehr.
- KI-bezogene Schuldenemissionen: ca. 450 Mrd. $ bis Anfang September (Morgan Stanley), mehr als doppelt so viel wie im ganzen Jahr 2025.
- JPMorgan schätzt die schuldenfinanzierten KI-Investitionen 2026–2030 auf ca. 4,1 Bio. $.
- Morgan Stanley rechnet mit 700 Mrd. $ Rechenzentrums-Capex 2026–28 über Private Credit.
- "Circular" Finanzierung wird ausdrücklich als Risiko genannt.
- [mittel] https://www.bloomberg.com/news/articles/2026-09-30/ai-valuations-could-see-sharper-correction-boe-warns ; https://www.insurancejournal.com/news/international/2026/09/30/887361.htm

**BIZ (Bank für Internationalen Zahlungsausgleich)**
- **Jahreswirtschaftsbericht (Juni 2026):** Der KI-Investitionsboom könne in einen "long investment bust" umschlagen. Das eingepreiste Gewinnwachstum liege über historischen Maßstäben.
  [mittel] https://www.axios.com/2026/06/30/ai-boom-bis-warning ; https://finance.yahoo.com/economy/policy/articles/bis-warns-ai-spending-boom-124800733.html
- **Quartalsbericht (September 2026):** Die Verschuldung von Big Tech liegt über 1 Bio. $. Smets (BIZ): "What we are most concerned on in this (AI) area is the rapid increase in debt and leverage". Insgesamt gebe es aber "no signs of stress".
  [mittel] https://www.taipeitimes.com/News/biz/archives/2026/09/15/2003864266

**EZB**
- **Finanzstabilitätsbericht, Mai 2026 (Kasten):** Anleger im Euroraum sind stark in US-Tech- und KI-Aktien engagiert.
  [hoch laut Auszug] https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2026/html/ecb.fsrbox202605_04~fd7b91dd22.en.html
- **EZB-Blog, August 2026** ("The AI boom: rational enthusiasm or the next dot-com bubble?"): Eine Korrektur sei wahrscheinlich. Das ist ein Blog, keine offizielle Position. Haushalte im Euroraum sollen mit ca. 440 Mrd. € engagiert sein; diese Zahl schwankt je nach Quelle.
  [mittel; die 440 Mrd. € niedrig] https://cybernews.com/ai-news/ecb-expects-stock-market-correction-from-ai-boom/

**US-Notenbank (Fed)**
- **Finanzstabilitätsbericht, Mai 2026:** 50 % der befragten Marktteilnehmer nennen KI als herausragendes Risiko, im Herbst 2025 waren es 30 %.
  [hoch] https://www.federalreserve.gov/publications/2026-may-financial-stability-report-near-term-risks.htm

### 2.8 Umsatzlücke und Marktkonzentration

- **Sequoia (David Cahn)**
  - "AI's $200B Question" (September 2023) und "AI's $600B Question" (Juni 2024).
  - Für 2025 kursieren ca. 840 Mrd. $. Für 2026 heißt es: rund 3 Bio. $ Umsatz nötig für 1,5 Bio. $ Ausgaben. Das stammt aus einer einzelnen Sekundärquelle.
  - [hoch für 2023/24; niedrig für 2025/26]
  - https://www.sequoiacap.com/article/follow-the-gpus-perspective/ und https://www.sequoiacap.com/article/ais-600b-question/ (beide URLs aus Vorwissen, nicht neu aufgerufen) ; https://aiweekly.co/alerts/sequoias-cahn-pegs-ais-2026-revenue-gap-at-roughly-3t
- **Bain (23.9.2025):** Um die Rechenleistung zu finanzieren, braucht die Branche bis 2030 jährlich 2 Bio. $ Umsatz. Selbst mit KI-Einsparungen fehlen 800 Mrd. $. Zusätzlich werden 200 GW benötigt.
  [hoch] https://www.bain.com/about/media-center/press-releases/20252/$2-trillion-in-new-revenue-needed-to-fund-ais-scaling-trend---bain--companys-6th-annual-global-technology-report/
- **Azeem Azhar (November 2025):** Auf dem Höhepunkt deckten die Einnahmen der Eisenbahnen etwa zwei Drittel der jährlichen Investitionen, bei Telekom etwa ein Viertel, bei KI etwa ein Sechstel.
  [mittel] https://www.fortune.com/2025/11/13/ai-boom-bubble-bust-dot-com-azeem-azhar
- **Konzentration**
  - JPMorgan/Cembalest, "Smothering Heights" (Januar 2026): 28 direkte KI-Aktien machen 50 % der S&P-500-Marktkapitalisierung aus, aber nur 5 % der Nettoverschuldung.
    [hoch] https://privatebank.jpmorgan.com/content/dam/jpm-pb-aem/global/en/documents/eotm/smothering-heights.pdf
  - Cembalest (8.10.2026): 42 KI-Aktien stehen seit Januar 2024 für 67 % der S&P-Kursgewinne und 81 % des Wachstums von Capex plus F&E.
    [mittel] https://advisoranalyst.com/2026/10/09/jpms-michael-cembalest-on-ai-concentration-debt-foreboding-and-the-markets-uneven-foundations.html/
  - Ein KI-Korb aus 41 Aktien macht Anfang Oktober ca. 49 % des Index aus. Der Wert hängt stark von der Auswahl des Korbs ab.
    [niedrig] https://cryptobriefing.com/ai-stocks-49-percent-sp-500-concentration/
  - Fünf Tech-Konzerne machen ca. 30 % des S&P 500 aus (Morningstar).
    [mittel] https://www.cnbc.com/2026/09/18/ai-stock-swings-can-affect-your-401k-what-to-know.html
  - Historischer Vergleich: Vom Bürgerkrieg bis etwa 1900 stellten die Eisenbahnen mehr als die Hälfte der US-Börsenkapitalisierung (Global Financial Data).
    [mittel] https://globalfinancialdata.com/200-years-of-the-united-states-stock-market-in-one-graph
- **Gewinnqualität**
  - S&P-500-Gewinne Q2 2026: +48 %, ohne Bewertungsgewinne auf Anthropic und OpenAI ca. +33 % (LSEG/Reuters, 20.8.).
  - Amazon buchte 53,4 Mrd. $ sonstige Erträge vor Steuern, vor allem aus der Neubewertung von Anthropic.
  - Ein großer Teil von Microsofts Gewinnanstieg um 3,2 Mrd. $ kam laut Bericht ebenfalls aus der Anthropic-Beteiligung.
  - JPMorgan behandelt das Thema in "Rear Window" (September 2026).
  - [mittel; die Microsoft-Angabe niedrig bis mittel] https://www.thestar.com.my/tech/tech-news/2026/08/20/gains-in-ai-company-stakes-juice-second-quarter-earnings-for-sp-500 ; https://biz.heraldcorp.com/article/10830503 ; https://privatebank.jpmorgan.com/nam/en/insights/latest-and-featured/eotm/rear-window

### 2.9 Realwirtschaft: Nutzung, Produktivität, BIP

- **MIT NANDA (Juli/August 2025):** 95 % der Organisationen sahen keinen messbaren Effekt generativer KI in ihrer Gewinn- und Verlustrechnung. Die Methodik ist stark kritisiert.
  [niedrig bis mittel] https://finance.yahoo.com/news/mit-report-95-generative-ai-105412686.html ; Kritik: https://arnon.dk/mits-95-ai-failure-rate-is-wrong/
- **US Census, Business Trends and Outlook Survey:** 17–20 % der Firmen nutzten KI zwischen Dezember 2025 und Mai 2026, bei Firmen ab 250 Beschäftigten 37 %. Im Juli 2026 waren es 21,7 %.
  [hoch] https://census.gov/library/stories/2026/05/ai-use-businesses.html
- **Beitrag zum BIP** (die Methoden unterscheiden sich stark)
  - ING: KI steht für etwa ein Drittel des US-Wachstums 2026.
  - Oxford Economics: knapp ein Viertel, mit Vermögenseffekten ein Drittel.
  - Analystenlesart der BEA-Daten: KI-Ausrüstung und -Software machen ca. 74 % der annualisierten Wachstumsrate von 2,1 % in Q1 2026 aus.
  - Epoch: Investitionen in KI-Rechenzentren ca. 0,8 % des BIP in Q1 2026, alle Computing-Infrastruktur ca. 1,5 %.
  - Jan Hatzius (Goldman): Der Beitrag 2025 war netto "essentially zero", weil die Hardware großteils importiert wird.
  - Goldman-Prognose: KI-Ausgaben steigen von 1,8 % (2026) auf 2,8 % des BIP (2028).
  - [mittel] https://epoch.ai/data-insights/ai-datacenter-share-gdp ; https://www.indexbox.io/blog/ai-investment-drives-one-third-of-us-gdp-growth-in-2026/

---

## 3. Geschichte

### 3.1 Railway Mania (Großbritannien, 1840er)

**Größenordnung**
- **Anteil am BIP:** Eisenbahnbau 5,7 % (1846), 6,7 % (1847) und 4,7 % (1848), nach Mitchell, zitiert bei Campbell. Odlyzko nennt für 1847 44 Mio. £, fast 8 % des BIP. Die Investitionen stiegen von unter 4 Mio. £ jährlich auf über 30 Mio. £ im Jahr 1847.
  [mittel bis hoch] https://mpra.ub.uni-muenchen.de/21822/1/MPRA_paper_21822.pdf ; https://pureadmin.qub.ac.uk/ws/files/18161511/RailwayCrisis.pdf ; https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf
- **Genehmigungen 1846**
  - 263 Parlamentsgesetze für neue Bahngesellschaften (Wikipedia), laut Victorian Web 272.
  - Rund 9.500 Meilen geplant, etwa ein Drittel davon nie gebaut.
  - Escott zählt anders: Die Gesetze von 1846 genehmigten 8.470 Meilen und 180.138.901 £.
  - [mittel] https://en.wikipedia.org/wiki/Railway_Mania ; https://victorianweb.org/history/1844act.html
- **Kursanstieg:** Die Eisenbahn-Aktien stiegen zwischen 1843 und 1845 um 106 % (VoxEU).
  [mittel] https://cepr.org/index%2ephp/voxeu/columns/railway-mania-not-so-great-expectations
- **Odlyzkos Urteil:** Die Railway Mania war "by many measures the greatest technology mania in history, and its collapse was one of the greatest financial crashes". Die Anleger hatten damals Daten, die auf eine zu geringe Nachfrage hindeuteten.
  [mittel] https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf

**Absturz**
- **Index:** 167,9 im Sommer 1845, 60,5 Ende 1849, also −64 %.
  [mittel] Quellen wie oben.
- **Teileingezahlte Aktien:** Anleger zahlten zunächst nur einen Teil des Nennwerts. Den Rest forderten die Gesellschaften später über sogenannte "calls" nach. Deshalb traf der Absturz die Mittelschicht. Der verbreitete Satz "no other panic was ever so fatal to the middle class" ist schwer zuzuordnen.
  [mittel für den Mechanismus, niedrig für das Zitat] https://www.winton.com/news/railway-mania

**Menschen**
- **Charles Mackay:** siehe Einzelfakt 1. Er feierte die Manie als Zeitungsherausgeber.
  [mittel] https://jasonzweig.com/the-extraordinary-popular-delusion-of-bubble-spotting/
- **George Hudson, der "Railway King":**
  - Er zahlte Dividenden aus dem Kapital und manipulierte Zahlen.
  - 1849 begannen Untersuchungen gegen ihn.
  - Um der Schuldhaft zu entgehen, lebte er im Ausland. 1870 kehrte er zurück.
  - [mittel] https://cases.som.yale.edu/george-hudson
- **Die Brontës:**
  - Emily verwaltete ab 1842 das Erbe.
  - Im Brief vom 23.4.1845 heißt es, Emily habe sich zur "mistress" des nötigen Wissens gemacht, indem sie "every paragraph" in den Zeitungen las.
  - Der Brief vom 30.1.1846 steht in Einzelfakt 4.
  - [mittel] https://www.annebronte.org/2020/09/27/2164/
- **Darwin:**
  - Ein Verlust in der Manie selbst ist nicht dokumentiert.
  - Dokumentiert ist der Verkauf von LNWR-Aktien 1852 mit 205 £ 15 s 9 d Verlust. Emmas Treuhandvermögen verlor 587 £.
  - [hoch] https://www.darwinproject.ac.uk/view/letters/DCP-LETT-1488

**Was blieb**
- **Strecken:** Aus den Genehmigungen 1844–46 wurden 6.220 Meilen gebaut, bis 1854 waren es mehr als 6.000 Streckenmeilen. Wikipedia vergleicht das mit einem heutigen UK-Netz von rund 11.000 Meilen. Die beiden Zahlen sind nicht direkt vergleichbar.
  [mittel] https://en.wikipedia.org/wiki/Railway_Mania
- **Royal Border Bridge:** gebaut 1847–1850 von Robert Stephenson, bis heute Teil der East Coast Main Line.
  [mittel] https://en.wikipedia.org/wiki/Royal_Border_Bridge
- **Eisenbahnzeit (GMT):** siehe Einzelfakt 5.
  [hoch]
- **Great Exhibition 1851:**
  - Über 6 Mio. Eintritte in 140 Tagen.
  - Rund 4 Mio. zusätzliche Bahnreisende (Rae, Dissertation an der Open University), gefördert durch billige Ausflugstarife.
  - Thomas Cook allein brachte ca. 165.000 Besucher.
  - [mittel] https://oro.open.ac.uk/63778

**Regulierung**
- **Railway Regulation Act 1844:** siehe Einzelfakt 6.
  [hoch] https://www.irishstatutebook.ie/1844/en/act/pub/0085/print.html ; https://victorianweb.org/history/1844act.html ; https://wrap.warwick.ac.uk/21765/

### 3.2 Panik von 1873 (USA)

- **Das Buch:** Liaquat Ahamed, "1873", erschienen am 2.6.2026, über Eisenbahnboom und -krach in den USA.
- **Die Zahl:** 89 von 364 US-Eisenbahngesellschaften gingen bankrott.
- **Die Resonanz:** Satya Nadella empfahl das Buch. Derek Thompson widmete ihm am 8.9.2026 eine Podcast-Folge: "The New Book That Scares Big Tech".
- [mittel] https://www.bookbrowse.com/excerpts/index.cfm/book_number/5240/1873 ; https://www.theringer.com/podcasts/plain-english-with-derek-thompson/2026/09/08/the-new-book-that-scares-big-tech

### 3.3 Kanal-Manie (Großbritannien, 1790er)

- Höhepunkt 1793–94, das Netz wuchs auf ca. 4.000 Meilen.
- [niedrig: In dieser Sitzung wurde keine belastbare Quelle gefunden. Ohne Nachrecherche nicht verwenden.]

### 3.4 Die 1920er: Radio und Strom

- **RCA:** siehe Einzelfakt 10.
  [mittel] https://www.globalfinancialdata.com/rca-and-the-roaring-twenties
- **Insull:**
  - Insull Utility Investments brach im Juni 1932 zusammen. Betroffen waren rund 600.000 Aktionäre und 500.000 Anleihegläubiger.
  - Danach kamen der Public Utility Holding Company Act 1935 und eine Reformwelle mit TVA und REA.
  - [mittel] https://ebsco.com/research-starters/politics-and-government/insull-utilities-trusts-collapse-prompts-new-federal

### 3.5 Dotcom und Telekom (1996–2002)

- **Investitionen:**
  - Die Anlageinvestitionen der Telekom-Branche stiegen von 70,7 Mrd. $ (1996) auf 136,6 Mrd. $ (2000).
    [hoch] https://WWW.BLS.GOV/opub/mlr/2006/07/art3full.pdf
  - Langstrecken-Glasfaser wuchs von 1,1 Mio. Faser-km (1996) auf 9,8 Mio. Faser-km (2000).
    [mittel] https://www.lightwaveonline.com/business/market-research/article/16648111/after-the-fall
- **Ausmaß:**
  - Investiert wurden mehr als 500 Mrd. $, großteils auf Kredit.
  - Im Telekomsektor wurden rund 2 Bio. $ Börsenwert vernichtet.
  - Bis September 2002 gab es 23 Insolvenzen (Starr).
  - WorldCom meldete am 21.7.2002 mit 107 Mrd. $ Vermögen Insolvenz an.
  - [mittel] https://www.princeton.edu/~starr/articles/articles02/Starr-TelecomImplosion-9-02.htm ; https://prospect.org/2002/08/19/great-telecom-implosion/
- **Ungenutzte Glasfaser:**
  - Nur 5 % der Glasfaser waren beleuchtet (Deseret News, 2001).
    [mittel] https://www.deseret.com/2001/6/18/19591977/economy-s-slump-idles-95-of-fiber-optic-lines/
  - Merrill Lynch schätzte rund 39 Mio. Meilen US-Glasfaser, davon ca. 10 % in Betrieb.
    [niedrig: Fundstelle nicht gesichert]
- **Odlyzko:**
  - Zusammen mit Coffman widerlegte er 1998 den Mythos, dass sich der Internetverkehr alle 100 Tage verdoppele. Die Angabe bezog sich auf die Kapazität von UUNet.
  - In seinen Folien: Zwischen 1997 und 2001 wuchs die Nachfrage etwa um den Faktor 4, die Glasfaser-Kapazität etwa um den Faktor 500.
  - In einem Vortrag von 2008 schätzt er, dass rund 100 Mrd. $ in Langstrecken-Glasfaser verschwendet wurden.
  - [mittel] https://www-users.cse.umn.edu/~odlyzko/doc/too.little.growth.txt ; https://www-users.cse.umn.edu/~odlyzko/talks/cmg-mismeasurements.pdf ; https://www-users.cse.umn.edu/~odlyzko/talks/gmu2008.pdf
- **IP-Transitpreis:** siehe Einzelfakt 8.
  [mittel] https://drpeering.net/white-papers/Internet-Transit-Pricing-Historical-And-Projected.php
- **Global Crossing:** siehe Einzelfakt 9.
  [mittel] https://www.taipeitimes.com/News/biz/archives/2002/08/11/0000159871
- **Google** kaufte 2005 günstig ungenutzte Glasfaser ("dark fibre"). Ein Zusammenhang mit YouTube ist nicht belegt.
  [mittel für den Kauf] https://om.co/gigaom/googlenet-update-google-buys-a-piece-of-transpacific-cable/
- **Amazon** fiel um 94 % (von ca. 113 $ auf ca. 6 $). Bis zum alten Hoch dauerte es rund 10 Jahre.
  [mittel] https://www.cnbc.com/2018/12/18/dotcom-bubble-amazon-stock-lost-more-than-90percent-long-term-investors-still-got-rich.html
- **Cisco** war am 27.3.2000 mit ca. 569 Mrd. $ das wertvollste Unternehmen der Welt.
  [hoch] https://heritage.cisco.com/2000_marketcap/
- **Nasdaq:** von 5.132,52 (10.3.2000, Intraday-Hoch) auf ca. 1.100 (Oktober 2002).
  [mittel: allgemein bekannt, eigene Quelle nachtragen]

### 3.6 Deutungsrahmen

- **Carlota Perez:**
  - Ihr Phasenmodell: erst die Installationsphase (Irruption, Frenzy), dann ein Wendepunkt (oft Krach und Rezession), dann die Entfaltungsphase (Synergie, Reife).
  - Die "goldenen Zeitalter" (viktorianischer Boom, Belle Époque, Nachkriegszeit) folgten auf die Krisen nach Blasen, "if politicians make the right changes".
  - KI ordnet sie in die IKT-Revolution ein, die 1971 begann: "Artificial intelligence is almost certainly revolutionary..." und "...belonging to a larger, more mature technological revolution that began a half-century ago."
  - [mittel] https://carlotaperez.org/research-project/ ; https://carlotaperez.org/publications/ ; https://medium.com/mit-initiative-on-the-digital-economy/ai-is-revolutionary-but-it-isnt-a-tech-revolution-yet-29cc5e6e6fe0
- **Howard Marks** (Oaktree-Memo "Is It a Bubble?", 9.12.2025) unterscheidet die "inflection bubble", die etwas Neues hinterlässt, von der "mean-reverting bubble".
  [hoch] https://www.oaktreecapital.com/insights/memo/is-it-a-bubble
- **Odlyzko zum Unterschied:** Eisenbahn und Telekom wussten, wie sie Geld verdienen, und überschätzten nur, wie viel. Bei KI sei das Geschäftsmodell noch offen.
  [mittel] https://futurism.com/the-byte/expert-financial-bubbles-ai

---

## 4. Wer trägt das Risiko

### 4.1 Stromkunden

- **PJM-Kapazitätspreise** (in $ pro MW und Tag)
  - 2024/25: 28,92.
  - 2025/26: 269,92.
  - 2026/27: 329,17.
  - 2027/28: 333,44, die Obergrenze. Es fehlten 6.623 MW. Rund 5.100 der 5.250 MW Lastzuwachs kommen von Rechenzentren.
  - 2028/29: 325, ebenfalls die Obergrenze. Auktion am 14.7.2026, es fehlten 6.831 MW, Gesamtkosten 16,4 Mrd. $.
  - [hoch laut Auszug] https://www.pjm.com/-/media/DotCom/about-pjm/newsroom/2026-releases/20260714-pjm-capacity-auction-procures-138318-mw-of-generation-resources.pdf ; https://www.utilitydive.com/news/pjm-interconnection-capacity-auction-prices/753798/
- **Unabhängiger Marktbeobachter:** Die Nachfrage der Rechenzentren verteuerte die Kapazität für die übrigen Kunden 2027/28 um 6,50 Mrd. $, über drei Auktionen um 23,1 Mrd. $ (2025/26 allein 9,3 Mrd. $).
  [hoch laut Auszug] https://www.monitoringanalytics.com/reports/Reports/2026/IMM_Analysis_of_the_20272028_RPM_Base_Residual_Auction_Part_A_20260105.pdf
- **NRDC:** Die Umweltorganisation projiziert ca. 70 $ Mehrkosten pro Haushalt und Monat für 2028–2033. Das ist die Projektion einer Interessengruppe.
  [niedrig bis mittel] https://www.nrdc.org/press-releases/rising-demand-data-centers-driving-reliability-cost-concerns
- **Haushaltsstrompreise (EIA)**
  - US-Durchschnitt: 17,29 ct/kWh (2025), für 2026 erwartet 18,02–18,2 ct (ca. +5 %).
  - Über fünf Jahre +42 % (laut Faktencheck).
  - März 2021 bis März 2026: Washington D.C. +94 %, Maryland +74 %.
  - Eine E3-Studie bestreitet den Zusammenhang mit Rechenzentren. Finanziert hat sie die Data Center Coalition, also die Branche.
  - [mittel; die Ursachen sind umstritten] https://politifact.com/factchecks/2026/jun/12/elizabeth-warren/data-centers-rising-electricity-costs/ ; https://www.cnbc.com/2026/03/13/ai-data-centers-electricity-prices-backlash-ratepayer-protection.html
- **Gestrandete Anlagen:** Stromkunden in Wisconsin zahlen noch rund 1 Mrd. $ für stillgelegte Kohlekraftwerke ab. Das gilt als Warnbeispiel für Kraftwerke, die jetzt für Rechenzentren gebaut werden.
  [mittel] https://wisconsinwatch.org/2025/12/wisconsin-stranded-assets-power-plants-energy-data-centers-ratepayers-utility-cost/ ; https://www.utilitydive.com/news/utilities-data-center-risk-buildout-bubble-ai-infrastructure-grid/812781/
- **Größenordnung (DOE/LBNL):** Rechenzentren verbrauchten 2023 4,4 % des US-Stroms (176 TWh). Bis 2028 könnten es 6,7–12 % werden (325–580 TWh).
  [hoch] https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers

### 4.2 Sparer, Altersvorsorge, Haushalte

- **401(k):** Mehr als 80 % der Pläne legen standardmäßig in Zieldatum-Indexfonds an. Diese Fonds sind nach Marktwert gewichtet, das Klumpenrisiko kommt also automatisch mit (Fortune, 28.9.2026).
  [mittel] https://fortune.com/2026/09/28/how-ai-stock-market-concentration-could-put-401k-retirement-savings-at-risk/
- **Fünf Tech-Konzerne** machen rund 30 % des S&P 500 aus (Morningstar, CNBC 18.9.).
  [mittel] https://www.cnbc.com/2026/09/18/ai-stock-swings-can-affect-your-401k-what-to-know.html
- **Haushaltsvermögen:** Ende 2025 steckte ein Rekordanteil von 33 % des US-Haushaltsvermögens in Aktien (Fed-Daten). Gleichzeitig halten die reichsten 10 % rund 87 % des Aktienvermögens der Haushalte. Die direkten Verluste treffen also vor allem Wohlhabende, über die Altersvorsorge aber auch die Mittelschicht.
  [mittel] https://www.axios.com/2026/06/04/stocks-ai-wealth-households

### 4.3 Private Credit

- **Schulden für KI-Rechenzentren:** Laut Bloomberg (über eine Sekundärquelle) sind es mehr als 500 Mrd. $, davon rund 200 Mrd. $ bei Private-Credit-Fonds.
  [niedrig bis mittel] https://www.cnbc.com/2026/04/06/ai-data-centers-financing-insurance-deals-gpu-debt.html
- **Pensionsfonds** erhöhen ihre Anteile an Private Credit trotz der Risiken.
  [mittel] https://www.cnbc.com/2026/05/08/pension-funds-are-ramping-up-private-credit-bets-despite-risks.html
- **Rücknahmen, Q2 2026:**
  - Anleger stellten Rücknahmeanträge über 15,6 Mrd. $.
  - 10 von 16 nicht börsennotierten BDCs beschränkten die Rücknahmen ("gated").
  - Privatanleger zogen im ersten Halbjahr 12,7 Mrd. $ ab.
  - [niedrig: Aggregator] https://angelinvestorsnetwork.com/alternative-investments/bdc-redemption-crisis-2026-private-credit-liquidity-gates
- **GPU-Kredite** haben inzwischen teils ein Investment-Grade-Rating (Forbes, 9.6.2026).
  [mittel] https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/

### 4.4 Bundesstaaten und Kommunen

- **Virginia:** Die Umsatzsteuerbefreiung für Rechenzentren kostete im Fiskaljahr 2025 1,6–1,94 Mrd. $ (FY2024: ca. 1 Mrd. $). Die Prüfbehörde JLARC errechnet 48 Cent Rückfluss je Dollar.
  [mittel bis hoch] https://www.datacenterdynamics.com/en/news/virginia-missed-more-than-16bn-in-tax-revenue-due-to-data-center-exemptions-in-2025/ ; https://www.axios.com/local/richmond/2025/12/03/watchdog-report-virginia-data-centers-incentive-funds-2015-2024
- **Senatsbericht** (Warren, Van Hollen, Blumenthal; veröffentlicht am 9.10.2026, TIME berichtete am 8.10. exklusiv):
  - Pro MW entsteht etwa ein Dauerarbeitsplatz.
  - Die Umsatzsteuerbefreiung für GPUs ist der wertvollste Anreiz.
  - Die Firmen arbeiten mit Verschwiegenheitsvereinbarungen (NDAs) gegenüber den Kommunen.
  - [mittel; Bericht von drei demokratischen Senatoren] https://time.com/article/2026/10/08/senate-investigation-ai-data-centers/

### 4.5 Beschäftigte

- **Challenger, Gray & Christmas:** Bis Juli 2026 wurden 112.713 Stellenstreichungen mit KI begründet (Primärbericht). Bis September waren es rund 120.136, ca. 21 % aller angekündigten Streichungen (Sekundärquelle).
  [hoch für Juli, mittel für September] https://www.challengergray.com/wp-content/uploads/2026/08/Challenger-Report-July-2026.pdf

### 4.6 Ausland

- **IWF:** Der Rest der Welt ist in US-Vermögenswerten, besonders KI, so stark engagiert wie nie (2.7).
  [mittel]
- **EZB:** Der Euroraum ist stark exponiert, Haushalte mit ca. 440 Mrd. € (2.7).
  [niedrig bis mittel]

### 4.7 Wer relativ geschützt ist

- **Gründer mit Stimmrechtsmehrheit:** Metas neue Class-C-Aktien bringen Kapital ohne Stimmrechte (2.4).
  [mittel]
- **Insider mit Liquidität:** OpenAI kaufte im August Mitarbeiteraktien für 7 Mrd. $ zurück (2.5).
  [mittel]
- **Auslagerung über Zweckgesellschaften und Leasing:** Bei Meta Hyperion tragen Anleihekäufer einen Teil des Risikos, abgesichert durch Metas Restwertgarantie (2.4). Bei Anthropic sitzt die Bindung beim Labor: Es hat langfristige Verträge für Rechenzentren, während die Kunden laut Fortune "can walk at any time" (2.5).
  [mittel]
- **Chip-Lieferanten** werden beim Verkauf bezahlt. Das Risiko verlagert sich auf Käufer und Kreditgeber. Ausnahme sind Absicherungen wie Nvidias Kreditunterstützung für OpenAI (2.6). Diese Einordnung ist eine Analyse, kein Einzelfakt.
- **Wagniskapitalgeber:** Meist gilt eine einfache, nicht partizipierende Liquidationspräferenz. In rund 46 % der Finanzierungsrunden zu niedrigerer Bewertung sollen vorrangige oder gestapelte Präferenzen vereinbart sein.
  [niedrig: Fundstelle nicht gesichert, nicht verwenden]

### 4.8 Der Staat als Retter?

- **Die "backstop"-Episode (5.–6.11.2025):** OpenAI-Finanzchefin Sarah Friar sprach von einem staatlichen "backstop" und nahm das zurück.
  - Altman: "We do not have or want government guarantees for OpenAI datacenters."
  - David Sacks (Weißes Haus): "There will be no federal bailout for AI."
  - [mittel] https://www.cnn.com/2025/11/06/tech/openai-backtracks-government-support-chip-investments

---

## 5. Was bleibt nach einem Platzen

### 5.1 Wofür das Geld ausgegeben wird

- **McKinsey (April 2025):** bis 2030 rund 5,2 Bio. $ Capex für KI-Rechenzentren.
  - ca. 60 % (3,1 Bio. $) für Chips und Hardware.
  - ca. 25 % (1,3 Bio. $) für Strom und Kühlung (die "energizers").
  - ca. 15 % (0,8 Bio. $) für den Bau (die "builders").
  - [hoch] https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers ; https://www.dcpostmea.com/2025/05/ai-boom-drive-7-trillion-global-investment-data-centers
- **Huang:** 2025 sagte er, 1 GW koste 50–60 Mrd. $, davon ca. 35 Mrd. $ für Nvidia. Im Oktober 2026 nannte er "40 plus" Mrd. $ Nvidia-Anteil pro GW.
  [mittel] https://www.tikr.com/blog/jensen-huang-two-gigawatts-to-us-is-like-80-billion-43-new-gigawatts-coming-in-2027 ; https://fourweekmba.com/ai-huang-says-nvidia-now-sells-over-40b-of-gear-per-gigawatt/

### 5.2 Langlebige Reste

- **Grundstücke, Netzanschlüsse, Gebäude, Kühlung:** Die nordamerikanischen Rechenzentren hatten Ende 2025 nur 1 % Leerstand (JLL). Von den 35 GW im Bau sind 92 % vorvermietet. Die Kapazität ist also ausgelastet, nicht ungenutzt wie die Glasfaser 2001.
  [mittel] https://www.facilitiesnet.com/datacenters/tip/Data-Center-Vacancy-Holds-at-1-as-AI-Boom-Redraws-the-Infrastructure-Map--56356
- **Stromerzeugung:** Die EIA erwartet für 2026 einen Rekordzubau von 86 GW, nach 53 GW im Jahr 2025. Davon sind 43,4 GW Solar, 24 GW Batteriespeicher, 11,8 GW Wind und ca. 6,3 GW Gas. Nicht alles davon geht auf KI zurück.
  [hoch] https://www.eia.gov/todayinenergy/detail.php?id=67205
- **Offene Modelle:** OpenAI veröffentlichte gpt-oss am 5.8.2025 unter Apache 2.0. Das Schweizer Apertus erschien im September 2025, Apertus 1.5 am 24.7.2026 (Apache 2.0). Laut Epoch liegen offene Modelle etwa 4 Monate hinter geschlossenen.
  [hoch für gpt-oss und Apertus, mittel für die 4 Monate] https://openai.com/blog/introducing-gpt-oss ; https://www.cscs.ch/science/computer-science-hpc/2026/apertus-15-building-the-next-generation-of-open-ai-infrastructure ; https://epoch.ai/data-insights/open-closed-eci-gap
- **Wissen, Software, Fachkräfte:** nur qualitativ, keine Zahl gefunden.

### 5.3 Kurzlebige Reste: GPUs und Abschreibung

- **Nutzungsdauer von Servern in den Büchern**
  - Microsoft: von 4 auf 6 Jahre (ab FY2023).
  - Alphabet: von 3 auf 6 Jahre.
  - Meta: 5,5 Jahre.
  - Oracle: von 5 auf 6 Jahre.
  - Amazon: 2025 von 6 auf 5 Jahre verkürzt, Begründung: "increased pace of technology development, particularly in the area of artificial intelligence and machine learning".
  - [mittel] https://blog.dshr.org/2026/02/mind-gaap-again.html ; https://www.streetinsider.com/General+News/Michael+Burry+warns+of+%24176+billion+depreciation+understatement+by+tech+giants/25584209.html
- **Michael Burry (November 2025):** Die Abschreibungen 2026–28 seien um rund 176 Mrd. $ zu niedrig angesetzt. Nach seiner Schätzung sind die Gewinne von Oracle um ca. 27 % und von Meta um ca. 21 % überzeichnet.
  [mittel: Einzelmeinung] streetinsider (s. o.)
- **Mietpreise**
  - H100: über 7 $ pro Stunde Anfang 2024, ca. 3,38 $ im Median im August 2026, ca. 2,81–2,86 $ laut Index Anfang Oktober 2026.
  - Gegenläufig meldet Silicon Data seit Jahresbeginn 2026 Anstiege von +38 % (H100) und +20 % (A100). Die Indizes widersprechen sich, ein linearer Verfall ist nicht belegt.
  - Eine gebrauchte H100 im dritten Jahr bringt rund 45 % des Neupreises.
  - [mittel bis niedrig: Anbieterindizes] https://www.thundercompute.com/blog/ai-gpu-rental-market-trends ; https://www.forbes.com/sites/daraabasiita/2026/06/09/gpu-debt-has-gone-investment-grade-heres-who-holds-the-risk/
- **Gegenbeispiel CoreWeave:** A100-GPUs von 2020 verdienen weiter Geld, die Verträge laufen bis 2029.
  [mittel] https://blockspace.media/insight/coreweave-a100-contract-challenges-gpu-depreciation-model/ ; https://analyticsindiamag.com/ai-features/why-nvidias-six-year-old-gpu-is-still-making-money

### 5.4 Ehrliches Gegenargument

Die Belege dafür stehen in 5.1 bis 5.3. Die Gewichtung ist eine Analyse.
- Rund 60 % der Ausgaben fließen in Chips, die nach 3 bis 6 Jahren technisch überholt sind. Gleise und Glasfaser halten Jahrzehnte. Von den Chips bliebe nach einem Platzen deutlich weniger nutzbare Substanz.
- Der Wert der Reste hängt an den Mietpreisen. Ein Überangebot senkt sie: gut für Nutzer, schlecht für Gläubiger.
- Ohne Regeln für einen diskriminierungsfreien Zugang (Common Carrier) landen die Reste eher bei den großen Konzernen. Bei Global Crossing bekamen die Käufer das Netz billig, das war nicht automatisch ein Gewinn für die Allgemeinheit.
- Manche Reste sind Lasten: neue Gaskraftwerke, die Stromkunden über Jahrzehnte abzahlen (Wisconsin-Muster), und Schulden.
- Odlyzko: Bei Eisenbahn und Glasfaser war klar, wie man Geld verdient. Bei KI ist das Geschäftsmodell noch nicht bewiesen.
- Dagegen spricht: Der Leerstand liegt bei 1 %, alte A100 sind weiter rentabel, und offene Modelle bleiben verfügbar, auch wenn ihre Entwickler scheitern.

### 5.5 Zwischenbilanz (Analyse)

- Das Bild "Die Blase platzt, die Schienen bleiben" trägt für Land, Netzanschlüsse, Stromerzeugung, Gebäude, offene Modelle und Know-how.
- Für GPUs trägt es deutlich weniger.

---

## 6. Lösungen und Präzedenzfälle

### 6.1 Eisenbahn

- **Railway Regulation Act 1844:**
  - "Parliamentary trains" zu höchstens 1 Penny pro Meile, siehe Einzelfakt 6.
  - Nach 21 Jahren konnte der Staat Tarife revidieren oder Linien kaufen, wenn die Gewinne über 10 % lagen.
  - [hoch] https://www.irishstatutebook.ie/1844/en/act/pub/0085/print.html ; https://wrap.warwick.ac.uk/21765/
- **Transport Act 1947:** Verstaatlichung ab 1.1.1948 unter der British Transport Commission. Die Eigentümer wurden mit Staatsanleihen entschädigt.
  [niedrig: In dieser Sitzung keine URL gesichert]
- **Conrail:**
  - Gegründet am 1.4.1976 aus sechs insolventen Bahnen, mit 2,1 Mrd. $ Bundesmitteln.
  - Ab etwa 1981 profitabel.
  - Der Börsengang 1987 war damals der größte in den USA.
  - [mittel bis hoch] https://www.goldmansachs.com/our-firm/history/moments/1987-conrail-ipo

### 6.2 Strom

- **Nach dem Insull-Crash:** PUHCA (1935), TVA und die ländliche Elektrifizierung über Genossenschaften (REA).
  - 1939 versorgten 417 Genossenschaften 288.000 Haushalte.
  - Heute versorgen rund 900 Genossenschaften 42 Mio. Menschen auf 56 % der US-Landfläche.
  - [mittel] https://reic.uwcc.wisc.edu/electric/ ; https://stories.coop/nreca/

### 6.3 Telekom und Breitband: offener Zugang

- **Stokab (Stockholm, seit 1994 im Besitz der Stadt):** Die Stadt verlegt Glasfaser und vermietet sie unbeschaltet ("dark fibre") zu gleichen Bedingungen an alle. Mehr als 100 Betreiber nutzen das Netz.
  [hoch] https://stokab.se/en/stokab/why-stokab/business-model
- **EPB Chattanooga:** Eine Studie (Lobo, Januar 2021) beziffert den Nutzen des städtischen Glasfasernetzes auf 2,69 Mrd. $ in 10 Jahren und 9.516 Arbeitsplätze.
  [mittel: vom Betreiber veröffentlichte Studie] https://epb.com/newsroom/press-releases/new-economic-study-documents-269-billion-in-benefit-from-chattanoogas-community-fiber-optic-network/
- **B4RN (Nordengland):** Eine gemeinnützige Genossenschaft (community benefit society). Freiwillige gruben die Gräben und bekamen dafür Anteile. Stand Juni 2026: rund 15.700 Kunden.
  [mittel] https://www.ispreview.co.uk/index.php/2026/06/b4rn-connect-15700-customers-to-rural-10gbps-broadband-network.html
- **BTOP 2009 (US-Konjunkturprogramm):** Geförderte Netze mussten anderen diskriminierungsfrei Zugang und Zusammenschaltung gewähren.
  [hoch] https://www2.ntia.doc.gov/files/Interconnection_Nondiscrimination_11_10_10_FINAL.pdf
- **Openreach (UK):**
  - BT gab am 22.9.2005 Zusagen ab, Openreach startete im Januar 2006, die rechtliche Trennung folgte 2017/18.
  - Die Netzinfrastruktur ist damit vom Endkundengeschäft getrennt. Wettbewerber bekommen gleichen Zugang.
  - [mittel] https://www.computerweekly.com/news/252451674/Ofcom-releases-BT-from-2005-Openreach-undertakings

### 6.4 Öffentliche Rechenkapazität

- **NAIRR (USA):**
  - Pilot seit Januar 2024.
  - Um September 2026 wurde der Betrieb eines Operations Center vergeben (SDSC und TACC, ca. 35 Mio. $; dünn belegt).
  - Der CREATE AI Act ist nicht verabschiedet.
  - [mittel; die 35 Mio. $ niedrig] https://govciomedia.com/nsf-moves-to-establish-permanent-national-ai-research-hub/
- **DOE "Genesis Mission":** Executive Order vom November 2025, 320 Mio. $. Ein Bericht ist am 24.11.2026 fällig.
  [mittel] https://www.powermag.com/does-genesis-mission-enlists-ai-to-double-u-s-research-productivity-in-a-decade/
- **EU AI Gigafactories:**
  - Ausschreibung seit 30.7.2026, Gebote bis 12.11.2026, bis zu 7 Standorte.
  - Bis zu 10 Mrd. € öffentliches Geld sollen mindestens 20 Mrd. € privates Kapital mobilisieren, zusammen über 30 Mrd. €.
  - Die Auswahl folgt Anfang 2027.
  - [hoch] https://www.eurohpc-ju.europa.eu/eurohpc-joint-undertaking-launches-ai-gigafactories-call-2026-07-30_en
- **UK AI Research Resource:**
  - Isambard-AI (mehr als 5.400 GH200) und Dawn, zusammen 350 Mio. £.
  - Ziel: 420 KI-Exaflops bis 2030.
  - [mittel] https://www.bristol.ac.uk/news/2026/march/ai-minister-takes-the-stage-with-tech-giants-at-university-of-bristol-summit.html
- **Schweiz:**
  - Apertus (September 2025): Modelle mit 8 und 70 Mrd. Parametern, ca. 40 % der Trainingsdaten nicht englisch.
  - Apertus 1.5 (24.7.2026): Apache 2.0, trainiert auf dem Supercomputer "Alps" des CSCS.
  - [hoch] https://www.cscs.ch/science/computer-science-hpc/2026/apertus-15-building-the-next-generation-of-open-ai-infrastructure
- **Indien:** Der nationale GPU-Pool, offen für Start-ups, bekommt 10.000 weitere GPUs.
  [mittel] https://www.wionews.com/world/india-moves-to-buy-10-000-more-ai-chips-for-a-national-compute-pool-open-to-startups-1792254872243
- **CalCompute (Kalifornien, SB 53):** nicht verifiziert.

### 6.5 Stromkunden schützen: Tarife für Großverbraucher

- **AEP Ohio:** Rechenzentren ab 25 MW zahlen mindestens 85 % der vertraglich vereinbarten Kapazität, bei Laufzeiten von mindestens 12 Jahren. Das Risiko ungenutzter Kapazität bleibt so beim Rechenzentrum.
  [mittel] https://blogs.law.columbia.edu/climatechange/2026/06/02/data-center-regulation-what-local-governments-should-know-about-large-load-tariffs-and-clean-transition-tariffs/
- **Oregon:** POWER Act und der Tarif Schedule 96 des Versorgers PGE.
  [mittel] https://www.utilitydive.com/news/large-load-tariffs-proliferate-as-states-take-more-active-role-in-data-cent/816184/
- **Verbreitung:** 25 Bundesstaaten haben einen Tarif für Großverbraucher (EEI, September 2026).
  [mittel] utilitydive (s. o.)
- **Bund:** eine FERC-Anordnung (Juni 2026) und eine freiwillige Zusage im Weißen Haus (März 2026).
  [niedrig bis mittel; Details prüfen] Columbia-Blog und utilitydive (s. o.)

### 6.6 Öffentliche Beteiligung für öffentliches Geld

- **Intel:** Am 22.8.2025 erhielt die US-Regierung 433,3 Mio. Intel-Aktien zu 20,47 $ (ca. 8,9 Mrd. $, 9,9 %, passive Beteiligung). Bezahlt wurde mit Zuschüssen aus dem CHIPS Act.
  [hoch] https://www.manufacturingdive.com/news/us-government-10-percent-stake-intel-chips-funding-8-9-billion/758518/

### 6.7 Rechtlicher Rahmen

- **Sitaraman und Narechania** (Yale Law & Policy Review, 2024) übertragen Werkzeuge aus dem Recht öffentlicher Versorger auf KI: strukturelle Trennung, Diskriminierungsverbot, offener Zugang, öffentliche Optionen und genossenschaftliche Steuerung.
  [hoch] https://yalelawandpolicy.org/sites/default/files/YLPR/narechania_sitaraman_anantimonopolyapproach_ylpr_2024.pdf

### 6.8 Bewusst nicht vertieft

- Staatsfonds, Alaska, Norwegen, eine universelle Dividende und das Jevons-Paradoxon wurden laut Briefing ausgelassen, weil frühere Filme sie schon verwenden.

---

## 7. Die These "AI is hitting a wall"

### 7.1 Argumente der Skeptiker

- **Gary Marcus** schrieb im März 2022 "Deep learning is hitting a wall" (Nautilus). Am 9.5.2026 präzisierte er, gemeint sei reine Skalierung gewesen. Claude Code sei ein "neurosymbolic"-Hybrid.
  [mittel] https://x.com/GaryMarcus/status/2053222231933931881
- **Ilya Sutskever** (Dwarkesh-Podcast, 25.11.2025): 2012–2020 sei ein Zeitalter der Forschung gewesen, 2020–2025 eines der Skalierung, ab 2026 komme wieder Forschung. Eine 100-fache Skalierung würde helfen, aber nicht alles verändern.
  [hoch] https://www.dwarkesh.com/p/ilya-sutskever-2
- **Daten:** Epoch schätzt den Bestand an nutzbarem Text auf ca. 300 Bio. Token. Er wäre zwischen 2026 und 2032 aufgebraucht.
  [hoch] https://epoch.ai/blog/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data
- **Ed Zitron** nannte OpenAI im Juli 2026 "the Lehman Brothers" der KI.
  [mittel] https://qz.com/ai-critic-openai-bubble-lehman-brothers-collapse-071726
- **METR-Studie (Juli 2025):** 16 erfahrene Entwickler arbeiteten mit KI-Werkzeugen 19 % langsamer. Am 24.2.2026 nannte METR neue Daten ein "unreliable signal", weil Teilnehmer die Gruppe ohne KI verweigerten.
  [mittel] https://metr.org (Blog, nicht direkt erreichbar) ; https://blog.robbowley.net/?p=3038
- **Nutzung:** Sie stagniert bei rund 20 % der Firmen (Census, 2.9).
  [hoch]
- **Epochs eigener Test:** Die Modelle "cannot yet replace workers, at least not at Epoch".
  [mittel] https://epochai.substack.com/p/the-epoch-brief-october-23-2026

### 7.2 Gegenbelege

- **METR, Zeithorizont autonom lösbarer Aufgaben:**
  - Von 2019 bis 2025 verdoppelte er sich etwa alle 7 Monate.
  - Für Modelle ab 2024 dauert eine Verdopplung 105 Tage (Frontier Risk Report vom 19.5.2026, R² 0,98).
  - Die Aufgabensammlung misst nur bis etwa 16 Arbeitsstunden zuverlässig.
  - [hoch laut Auszug] https://metr.org/blog/2026-05-19-frontier-risk-report/
- **Epoch Capabilities Index:**
  - Seit den Reasoning-Modellen steigt er um 14 Punkte pro Jahr, vorher waren es 6.
  - Brief vom 23.10.2026: GPT-6 Astra 166, Gemini 4 Argon 166, Claude Fable 5.1 164 (Modellnamen wie berichtet).
  - [mittel] https://x.com/EpochAIResearch/status/2094922644428898737 ; https://epochai.substack.com/p/the-epoch-brief-october-23-2026
- **Preise pro Leistung:**
  - Epoch: Je nach Aufgabe fallen sie um das 9- bis 900-Fache pro Jahr.
  - arXiv 2511.23455: um das 5- bis 10-Fache pro Jahr.
  - Für September 2026 kursieren −47 % pro Quartal (Sekundärquelle).
  - [hoch / mittel / niedrig] https://epoch.ai/data-insights/llm-inference-price-trends ; https://arxiv.org/html/2511.23455v1
- **Umsätze:** Anthropic wuchs im ersten Halbjahr 2026 auf das 14-Fache (2.5), Nvidia um 106 % (2.6).
  [hoch / mittel]
- **Akademisch gemischt:** Wang und Chen (arXiv 2606.01575) finden sowohl echte Fundamentaldaten als auch blasenartige Schwachstellen.
  [mittel] https://arxiv.org/abs/2606.01575

### 7.3 Faires Urteil (Synthese, keine Quelle)

- **Die enge Version der These ist belegt.**
  - Reines Skalieren im Vortraining bringt abnehmende Erträge.
  - Textdaten werden knapp.
  - Firmen tun sich mit der Umsetzung schwer: Die Nutzung liegt bei ca. 20 %, dazu kommen die METR-Studie und, mit Vorbehalt, die MIT-Zahl.
- **Der breiten Version widersprechen die Daten von 2026.** Nach ihr würden die Fähigkeiten stagnieren. Tatsächlich verdoppelt sich der METR-Zeithorizont in 105 Tagen, der Fähigkeitsindex steigt schneller, die Preise fallen und die Umsätze der Labore wachsen rasant.
- **Die eigentliche Wand ist finanziell und physisch:** Schulden, Strom, Netzanschlüsse, Abschreibung. Darauf zielen auch alle Warnungen der Notenbanken.
- **Historisch passen Crash und weiter wachsende Nutzung zusammen.** Nach dem Platzen wuchsen Bahn- und Internetverkehr weiter. Zwischen 1997 und 2001 vervierfachte sich die Nachfrage trotz des Krachs (Odlyzko). Ein Platzen der Finanzblase wäre also kein Beweis für eine technische Wand.

---

## 8. YouTube-Check

### 8.1 Methode

- **Abruf:** 28.10.2026 gegen 15:00 UTC über die YouTube Data API v3. search.list lief mit order=viewCount, publishedAfter=2026-09-01 und maximal 2 × 50 Treffern pro Suchbegriff.
- **Suchbegriffe:** Mindestens "AI bubble", "AI bubble pop", "is AI a bubble" und "AI bubble dotcom comparison" lieferten Treffer, zusammen 159 eindeutige Videos. Dazu kam separat "railway mania AI" mit 50 Treffern. Danach war die Tagesquote erschöpft. Die Liste ist deshalb nicht vollständig.
- **Metadaten:** über videos.list und channels.list. Views und Abonnentenzahlen sind eine Momentaufnahme.
- **Filter für die Top-Liste:** englisch, länger als 8 Minuten, Thema KI-Blase oder KI-Finanzen.
  - Ausgeschlossen als themenfremd: ein Kindervideo ("Soap Bubble").
  - Ausgeschlossen als zu kurz: Sky News (5,9 Min.), ein CNBC-Clip mit Eisman (7,0 Min.), India Global Review (6,1 Min.).
  - Ausgeschlossen als Themen-Nachbarn ohne Finanzfokus: Think School "Elon Musk & Dario's Final Warning" (2,29 Mio.) und Infographics "The Collapse of AI Software Engineering" (1,93 Mio.).

### 8.2 Top 15 (Long-Form, themennah, veröffentlicht seit 1.9.2026)

| # | Titel | Kanal | Abos | Views | Datum (Alter) | Min. | Views/Abo | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | What if the AI Bubble Bursts (Day by Day) | The Infographics Show | 15,5 Mio. | 4.827.141 | 03.09. (55 T.) | 32,1 | 0,31 | https://youtu.be/T9d6lrvzM9o |
| 2 | 'Big Short' Investor Explains How the AI Bubble Will Burst | New Money | 1,11 Mio. | 4.386.174 | 02.10. (26 T.) | 44,2 | 3,95 | https://youtu.be/Zw0I7kb6zg4 |
| 3 | The Leaked Audit That Exposes OpenAI's Real Financial Crisis | The Infographics Show | 15,5 Mio. | 2.661.212 | 06.09. (52 T.) | 18,7 | 0,17 | https://youtu.be/UVKmPMTwglI |
| 4 | Is the AI Bubble About to Be Tested? | Patrick Boyle | 1,36 Mio. | 2.453.682 | 26.09. (32 T.) | 34,6 | 1,80 | https://youtu.be/T-oXyXwD6sE |
| 5 | The (Overdue) Collapse Of The AI Bubble | Damon Cassidy | 339.000 | 2.188.102 | 07.10. (22 T.) | 23,6 | 6,45 | https://youtu.be/XEMvG2vulKg |
| 6 | Strange Fall of Oracle – How a $300 Billion AI Deal Changed Everything? | Think School | 6,6 Mio. | 2.013.030 | 09.10. (19 T.) | 18,1 | 0,31 | https://youtu.be/5PyTHJGkYWk |
| 7 | The AI Industry is a Complete Mess | ColdFusion | 5,25 Mio. | 1.551.037 | 01.10. (27 T.) | 21,4 | 0,30 | https://youtu.be/e2zjpCqTmyo |
| 8 | The bond meltdown and AI bubble brewing the next global financial crisis | ABC News (Australia) | 2,63 Mio. | 1.442.962 | 07.09. (51 T.) | 29,8 | 0,55 | https://youtu.be/fd0ZCw1ZVNE |
| 9 | AI bubble fears: Could a crash trigger a global financial crisis? | DW News | 6,48 Mio. | 1.350.355 | 15.10. (13 T.) | 13,6 | 0,21 | https://youtu.be/tGRB8ECyEJ0 |
| 10 | Real Signs the AI Bubble is about to burst?? | JayzTwoCents | 4,35 Mio. | 1.204.806 | 22.10. (6 T.) | 27,7 | 0,28 | https://youtu.be/s8qkejdyffk |
| 11 | The AI bubble is about to pop... | The Infographics Show | 15,5 Mio. | 1.140.580 | 27.10. (1 T.) | 20,0 | 0,07 | https://youtu.be/MgngwkPAuqQ |
| 12 | AI Bubble: 'Something profound has changed' – Ed Zitron | The Tech Report | 130.000 | 1.135.677 | 16.10. (12 T.) | 47,1 | 8,74 | https://youtu.be/CudIfoRiVYQ |
| 13 | How Exactly OpenAI Plans to Socialize Its Losses | Economy Media | 138.000 | 960.647 | 10.09. (48 T.) | 18,8 | 6,96 | https://youtu.be/mdwhTca-G_w |
| 14 | Hyperscalers are hiding a massive secret about uninstalled GPUs – Ed Zitron | The Tech Report | 130.000 | 956.380 | 25.09. (33 T.) | 48,5 | 7,36 | https://youtu.be/1CbvhJO8Nfo |
| 15 | CoreWeave Crash, AI Trade Cracks, Anthropic IPO Red Flags, Bill Gates Doomer | All-In Podcast | 1,16 Mio. | 928.438 | 17.10. (11 T.) | 94,1 | 0,80 | https://youtu.be/_b3LfMflIGs |

Quelle aller Werte: YouTube Data API v3 (videos.list, channels.list), abgerufen am 28.10.2026. [hoch für den Zeitpunkt des Abrufs]

### 8.3 Weitere relevante Videos (ohne Rang)

- **Infographics**, "Most Terrifying Financial Chart in the World Right Now": 678.261 Views, 14,8 Min., 24.10. https://youtu.be/KXHYz5W0sW0
- **DW News**, "What if the skeptics are right about AI?": 654.718 Views, 13,5 Min., 16.10. https://youtu.be/JUY8NJ7gNAo
- **All-In**, "AI Cyber Panic, Ken Griffin's Bubble Warning, The Fall of France?": 643.568 Views, 103 Min., 23.10. https://youtu.be/6czo-C3FU7I
- **Nikhil Kamath**, "Who's Paying for the AI Boom—and Can It Last?": 581.136 Views, 149 Min., 23.10. https://youtu.be/YU-RrDdyx34
- **Mark Tilbury Economics**, "It Started: The AI Bank Run": 576.338 Views, 19,6 Min., 21.10. https://youtu.be/o8ZGRemy4tM
- **Sasha Yanshin**, "The AI Bank Run Has Started": 570.364 Views, 16,7 Min., 29.9. https://youtu.be/I3Pw2EjCFns
- **Not Unprecedented**, "The AI Bubble Will Burst. Here's What Happens Next": 506.895 Views, 13,1 Min., 9.10., nur 1.630 Abos. https://youtu.be/sD0RcD9rq_c
- **The Ezra Klein Show**, "Is There an A.I. Bubble? A Debate.": Paul Kedrosky gegen Azeem Azhar, 488.446 Views, 66,9 Min., 16.10. https://youtu.be/9GLdGc9OX-A
- **Democracy Now!**, "'When the Bubble Bursts': Naomi Klein & Astra Taylor on Reclaiming Democracy from AI Oligarchs": 412.517 Views, 28,9 Min., 21.10. https://youtu.be/jWmkQIoLvug
- **Ticker Symbol: YOU**, "The 2027 AI Bubble: Even Bigger Than Dotcom?": 373.687 Views, 19,9 Min. https://youtu.be/BFJ4Khk8hHw
- **Brendan Dell**, "Wharton Just Exposed Who Pays for the AI Crash": 330.798 Views, 20,9 Min., 14.10. https://youtu.be/4Q0APaL-3HQ
- **Prof G Markets**, "Will The AI Boom End Like The Railroad Crash Of 1873?": 258.025 Views, 57 Min., 16.10. https://youtu.be/dlkE5cFPj4w
- **The Prof G Pod**, "The AI Boom Looks Exactly Like 1999. Here's Who Pays.": 228.465 Views, 21,9 Min., 21.9. https://youtu.be/DeB5rBZEQNI
- **Kontext: Fortschritt und Sicherheit statt Finanzen**
  - Think School, "Elon Musk & Dario's Final Warning": 2.289.716 Views. https://youtu.be/ky6jesFvIqY
  - Sky News, "AI progress is speeding up dramatically - here's why you should care": 1.802.191 Views in 5,9 Min. https://youtu.be/DKA5AkrQfxo

### 8.4 Ausreißer: viele Views im Verhältnis zu den Abonnenten

| Kanal | Video | Views/Abo |
|---|---|---|
| Not Unprecedented | The AI Bubble Will Burst. Here's What Happens Next | 311× (506.895 bei 1.630 Abos) |
| Market Talk with George Noble | Ed Zitron: Microsoft Has $80 Billion Of AI Chips It Can't Plug In (90 Min.), https://youtu.be/es4FfRU8saQ | 39,8× |
| IDK Show | China Just Popped The AI BUBBLE, https://youtu.be/QtuNyDpY6rA | 25,9× |
| The Tech Report | Ed Zitron, mehrere Folgen | 7,4–8,7× |
| Economy Media | How Exactly OpenAI Plans to Socialize Its Losses | 7,0× |
| Damon Cassidy | The (Overdue) Collapse Of The AI Bubble | 6,5× |
| Brendan Dell | Wharton Just Exposed Who Pays for the AI Crash | 4,3× |
| New Money | 'Big Short' Investor (Eisman) | 3,9× |

### 8.5 Muster bei Titeln, Hooks und Formaten

Ohne Transkripte stützen sich die Hooks auf Titel und die ersten Zeilen der Beschreibungen.
- **Angst- und Enthüllungsvokabular:** Burst, Pop, Collapse, Crash, Crack, Bank Run, Exposes, Leaked, Terrifying, Fatal Flaw, Time Bomb. Fast jeder Top-Titel kündigt den Knall an ("about to", "will burst", "has started").
- **Autoritätsfiguren:** der "Big Short"-Investor Steve Eisman, Burry, Dalio, Griffin, Doctorow, Satyajit Das. Ed Zitron hat allein bei The Tech Report sechs Folgen unter den Treffern.
- **Firmen als Schurken oder Opfer:** OpenAI ("Leaked Audit", "Socialize Its Losses", "Math Dump"), Oracle ("Strange Fall", "big trouble"), CoreWeave und Microsoft ("chips it can't plug in").
- **Szenario-Formate:** "Day by Day" (Infographics, Platz 1) und "What Happens Next" (Not Unprecedented).
- **Typische Einstiege laut Beschreibung:**
  - Infographics beginnt mit einem konkreten Auslöser: "It starts with a missed payment at a heavily leveraged AI infrastructure company like CoreWeave. Lenders seize NVIDIA GPUs..."
  - Patrick Boyle arbeitet mit einem Kontrast: Anthropic plant einen Börsengang bei rund 2 Bio. $, "while Nvidia, the company actually making money from AI, trades at its cheapest valuation in over a decade".
  - DW nimmt den CoreWeave-Absturz als "first sign".
  - Not Unprecedented deutet die Frage um: "Most people now agree AI is in a bubble. The more useful question is what happens if the AI bubble bursts: who loses their savings, what suddenly becomes cheap..."
  - Ezra Klein beginnt bei Rechenzentren, die den Wohnungsbau verdrängen.
- **Lange Formate dominieren:** Die Top 15 laufen zwischen 13,6 und 94,1 Minuten, der Median liegt bei 27,7 Minuten. Das kürzeste ist DW mit 13,6 Minuten.
- **"Wer zahlt" als Verlustfrage:** Das Motiv ist etabliert, aber immer als Frage, wer verliert. Beispiele: Economy Media "Socialize Its Losses" (960.647), Nikhil Kamath "Who's Paying" (581.136), Brendan Dell "Who Pays for the AI Crash" (330.798), Prof G "Here's Who Pays" (228.465) und Not Unprecedented ("who loses their savings").
- **Fortschritt läuft parallel:** Videos über Fortschritt und Sicherheit erreichen ähnliche Reichweiten (Think School 2,29 Mio., Sky News 1,80 Mio.). Kaum ein Video verbindet die Finanzblase mit der weiterlaufenden Fähigkeitskurve.

### 8.6 Konkurrenz zum eigenen Winkel

- **Not Unprecedented** (13,1 Min., 506.895 Views) steht am nächsten.
  - Inhalt: Gartner-Hype-Zyklus, der Eisenbahnboom vor der Panik von 1873 und der Dotcom-Crash.
  - Aufbau in Kapiteln: Crash, Aufräumen, Ausrollen.
  - Es fragt, wer verliert und was billig wird, aber nicht, wem die Reste gehören.
- **Prof G Markets** behandelt 1873 (57 Min., 258.025).
- **Ticker Symbol: YOU** und viele kleine Kanäle vergleichen mit Dotcom.
- **Democracy Now!** (412.517) hat einen Fairness-Rahmen. Er ist aber politisch links codiert und als Gegnerschaft formuliert ("Reclaiming Democracy from AI Oligarchs").
- **Die britische Railway Mania der 1840er** taucht nur in Mikro-Videos auf:
  - Present Signal, "The AI Boom Is Financed Like the Railway Mania — Down to the Accounting": 1.158 Views, 108 Min. https://youtu.be/044P_z1qsTE
  - Get Richer Together, "Railways, Fiber, AI: Every Tech Building Boom Ended the Same Way?": 697 Views. https://youtu.be/rSpkIH0kUCw
  - Tradonomics, "What Survives When the AI Bubble Pops?": 368 Views. https://youtu.be/sQd2Fms0S60
  - Bubblefact, "Railway Mania: the 1840s tech bubble that lost 64%" (Short): 124 Views. https://youtu.be/f4VBYtp1XQI
  - Money Vault History, "Charlotte Brontë Bought Railway Shares" (Short): 70 Views. https://youtu.be/o1OAMBAESYE
  - Paper Empires, "Railway Mania: The 1840s Bubble Bigger Than Today's AI Boom": 40 Views. https://youtu.be/SWvd1X-J0nc
  - Twice Told Economics, "AI Bubble vs Dot-Com: What Survives a Crash?": 28 Views. https://youtu.be/6zsfzJ4OLXY
  - Das größte Stück zum Eisenbahn-Thema ist Derek Thompsons Folge über Ahamed "1873" (54.238 Views). Sie ist auf die USA bezogen.
  - Einzelne Fakten aus diesem Dossier sind in Nischenkanälen also schon bekannt, etwa die −64 %, die Brontës und der Vergleich der Größenordnung.

### 8.7 Fehlender Winkel (Analyse)

- **Ruhiger Ton:** Fast alle reichweitenstarken Titel arbeiten mit Angst und Countdown.
- **Kalibrierung:** Die Titel suggerieren den großen Crash, obwohl die Indizes Ende Oktober nur 2 bis 6 % unter dem Rekord liegen. Niemand zeigt genau, dass es an den verschuldeten Rändern bricht (2.1).
- **Die britische Railway Mania** mit ihren menschlichen Geschichten (Mackay, die Brontës, Hudson, Parliamentary trains) ist auf YouTube praktisch unbesetzt.
- **Was bleibt und wem es gehört:** Kein reichweitenstarkes Video behandelt konstruktiv, wie Netze, Strom, Modelle und Rechenkapazität offen und gemeinsam nutzbar bleiben können. Präzedenzfälle gäbe es: Parliamentary trains, Stokab, Openreach, REA-Genossenschaften, EU-Gigafactories. Fairness kommt nur als Verlustfrage ("who pays") oder aktivistisch vor.
- **Finanzblase und technische Entwicklung:** Kaum jemand trennt sauber, dass ein Crash die Fähigkeitskurve nicht stoppen muss.

### 8.8 Transkripte

- Nicht abgerufen, aus den Gründen in 0.3. Die Einstiege in 8.5 sind deshalb aus den Beschreibungen erschlossen, nicht aus den gesprochenen ersten Sekunden.

---

## 9. Hook-Zitate von Insidern

Wortlaut im Original. Die Zeitmarken stammen aus den Kapitelangaben der Videobeschreibungen, sofern genannt. Sonst wurden keine ermittelt.

1. **Sam Altman (OpenAI)**, 14./15.8.2025, Abendessen mit Journalisten (berichtet von The Verge)
   > "Are we in a phase where investors as a whole are overexcited about AI? My opinion is yes."
   > "Someone is going to lose a phenomenal amount of money."
   - Quellen: https://www.entrepreneur.com/business-news/openais-sam-altman-warns-overexcited-investors-ai-bubble/496081 ; https://tech.slashdot.org/story/25/08/15/1416222
   - Video: keins, Wortlaut nach The Verge. [mittel]

2. **Jeff Bezos**, 3.10.2025, Italian Tech Week in Turin, im Gespräch mit John Elkann
   > "a kind of industrial bubble"
   > "...it could even be good, because when the dust settles and you see who are the winners, society benefits from those inventions."
   > "This is real, the benefits to society from AI are going to be gigantic."
   - Quellen: https://www.entrepreneur.com/business-news/amazon-founder-jeff-bezos-says-were-in-an-ai-bubble/497930 ; https://en.ilsole24ore.com/art/bezos-artificial-intelligence-industrial-bubble-but-can-be-positive-AHo96EzC
   - Videos (Zeitmarke nicht ermittelt): Reuters-Livestream https://www.youtube.com/watch?v=4wTSZDZ_seU (Länge 1:03:54) ; Vento Ventures https://www.youtube.com/watch?v=HB3Rq6ZLliM (Länge 50:38) ; DRM News https://www.youtube.com/watch?v=EA_rzYj4Syg (Länge 52:56)
   - [mittel: Der Wortlaut variiert zwischen den Medien, vor Verwendung im Video prüfen]

3. **Sundar Pichai (Alphabet)**, BBC-Interview, veröffentlicht am 18.11.2025
   > "So I think it's both rational and there are elements of irrationality through a moment like this."
   > "I think no company is going to be immune, including us."
   - Quelle: https://finance.yahoo.com/news/no-firm-immune-ai-bubble-085158100.html
   - Video: nicht gefunden. [mittel]

4. **Mark Zuckerberg (Meta)**, 18.9.2025, ACCESS-Podcast (Kanal Sources Podcast)
   > "If we end up misspending a couple of hundred billion dollars, I think that is going to be very unfortunate, obviously. But what I'd say is I actually think the risk is higher on the other side."
   - Quelle: https://sherwood.news/tech/meta-ceo-mark-zuckerberg-ai-might-be-a-bubble-but-misspending-a-couple-of
   - Video: https://www.youtube.com/watch?v=23FyskyFoP8&t=3572s. Laut Beschreibung beginnt das Kapitel "AI bubble talk and Meta's new research lab" bei 59:32. Die genaue Sekunde des Zitats ist nicht geprüft.
   - [mittel bis hoch]

5. **Jamie Dimon (JPMorgan)**, Oktober 2025
   > KI werde sich "in total" auszahlen, wie Autos und Fernseher: "in total will pay off" ... "but most people involved in them didn't do well"
   > "some asset prices are high, in some form of bubble territory"
   - Quellen: https://www.fortune.com/2025/10/14/jamie-dimon-ai-bubble-territory-high-asset-prices-jpmorgan ; https://www.aol.com/articles/jamie-dimon-gets-real-ai-224610455.html
   - [niedrig bis mittel: Der Anlass ist unklar, entweder Fortune MPW Summit oder BBC-Interview. Die Fragmente stammen möglicherweise aus zwei Auftritten.]

6. **Satya Nadella (Microsoft)**, 20.1.2026, Davos, auf dem Podium mit Larry Fink
   > "For this not to be a bubble by definition, it requires that the benefits of this are much more evenly spread."
   > "A tell-tale sign of if it's a bubble would be if all we are talking about are the tech firms."
   - Er sagte auch, KI werde "build on the rails of cloud and mobile".
   - Quelle: https://www.irishtimes.com/business/2026/01/20/ai-boom-could-falter-without-wider-adoption-microsoft-chief-satya-nadella-warns/
   - Video: nicht geprüft (Aufzeichnung des WEF). [mittel]

7. **Ken Griffin (Citadel)**, 20.10.2026, Citadel-Konferenz
   - KI sei "almost certainly" in einer Blase. GPUs seien wie Flugzeugsitze, also verderbliche Kapazität. Eine Schwemme wie bei der Glasfaser sei möglich.
   - Quellen: https://www.bloomberg.com/news/articles/2026-10-20/ken-griffin-says-ai-almost-certainly-in-a-bubble-right-now ; https://decrypt.co/381578/ken-griffin-ai-bubble-gpus-airline-seats
   - [mittel: nur Fragmente wörtlich]

8. **Elon Musk**, 25.10.2026, auf X
   > "guppy-level death" (über mehr als 200 Neoclouds)
   > "SpaceX is not buying any neoclouds. Pointless."
   - Quelle: https://www.cnbc.com/2026/10/26/neocloud-stocks-today-coreweave-nebius-iren-elon-musk.html [mittel]

9. **Kristalina Georgieva (IWF)**, Oktober 2026
   > "when we are dependent on one particular driver of growth, it is like we stand on one leg"
   - Quelle: https://www.taipeitimes.com/News/biz/archives/2026/10/18/2003866147
   - [mittel; die Formulierung "on one AI leg" ist nicht wörtlich]

10. **Vamvakidis (IWF)**, 13.10.2026
    > "resilience is not necessarily safety"
    - Quellen: https://qz.com/imf-ai-stock-crash-global-financial-stability-101326 ; https://www.cnbc.com/2026/10/13/treasury-yields-imf-debt-inflation-.html [mittel]

11. **Jason Wu (IWF)**, Oktober 2026, über die Kreisgeschäfte
    > "triple whammy"
    - Quelle: https://thenextweb.com/news/imf-circular-ai-deals-financial-stability-report [mittel]

12. **Smets (BIZ)**, September 2026
    > "What we are most concerned on in this (AI) area is the rapid increase in debt and leverage"
    > "no signs of stress" (zur Gesamtlage)
    - Quelle: https://www.taipeitimes.com/News/biz/archives/2026/09/15/2003864266 [mittel]

13. **Sam Altman und David Sacks**, 6.11.2025, zur Debatte um einen staatlichen "backstop"
    > Altman: "We do not have or want government guarantees for OpenAI datacenters."
    > Sacks: "There will be no federal bailout for AI."
    - Quelle: https://www.cnn.com/2025/11/06/tech/openai-backtracks-government-support-chip-investments [mittel]

14. **Ed Zitron**, 16.10.2026, The Tech Report
    > "The usual ability of the AI industry has to put the toothpaste back in the tube is not working anymore."
    - Das Zitat steht in der Videobeschreibung, laut API-Abruf. Zeitmarke nicht ermittelt.
    - Video: https://youtu.be/CudIfoRiVYQ [mittel]

15. **Michael Intrator (CoreWeave)**, Oktober 2026
    - Er nannte den Markt "irrational".
    - Quelle: https://admiralmarkets.com/education/articles/shares/coreweave-stock-drop-ai-debt [mittel]

**Historische Zitate**
- **Glasgow Argus (Charles Mackay)**, 2.10.1845
  > "There is no reason whatever to fear a crash."
  - [mittel] Quellen in Einzelfakt 1.
- **Charlotte Brontë**, Brief an Margaret Wooler, 30.1.1846
  > "anxious ... to sell our shares ere it be too late"
  - [mittel; Wortlaut prüfen] Quellen in Einzelfakt 4.
- **Andrew Odlyzko** über die Railway Mania
  > "by many measures the greatest technology mania in history, and its collapse was one of the greatest financial crashes"
  - [mittel] https://www-users.cse.umn.edu/~odlyzko/doc/hallucinations.pdf
- **Carlota Perez**
  > "Artificial intelligence is almost certainly revolutionary..." / "...belonging to a larger, more mature technological revolution that began a half-century ago."
  - [mittel] https://medium.com/mit-initiative-on-the-digital-economy/ai-is-revolutionary-but-it-isnt-a-tech-revolution-yet-29cc5e6e6fe0
- **Howard Marks**
  > "inflection bubble" versus "mean-reverting bubble"
  - [hoch] https://www.oaktreecapital.com/insights/memo/is-it-a-bubble

---

## 10. Vorsicht / dünn belegt

**Grundsätzlich**
- Keine Primärseite wurde direkt geöffnet (0.1). Jede Zahl muss vor der Sendung an der Quelle geprüft werden.

**Aktuelle Lage**
- **CoreWeave, GPU-Besicherung:** Die kursierende Angabe "80 % der Schulden GPU-besichert" passt nicht zu den 7,5 Mrd. von 35,1 Mrd. $ aus Q2. Ohne den Quartalsbericht (10-Q) nicht verwenden.
- **CoreWeave, Oktober-Minus:** CNBC nennt −36 %, eigene Rechnung und 247wallst kommen auf −37,75 bzw. −38 %. Immer den Bezugstag nennen.
- **Alphabet:** "Erstmals seit dem Börsengang 2004 negativer freier Cashflow" stützt sich auf eine Quelle. TIKR formuliert vorsichtiger.
- **Oracle-Schulden:** 118 plus 39 Mrd. $ oder 156–167 Mrd. $. Das ist eine Frage der Abgrenzung, vor allem beim Leasing.
- **Meta-Kapitalerhöhung:** 35 oder 37,5 Mrd. $. "Fast 100 Mrd. $" schließt die erst geplanten 60 Mrd. $ ein.
- **Microsoft-Capex 2026:** abhängig davon, ob Finanzierungsleasing mitgezählt wird.
- **Anthropic:**
  - Die Gesamtsumme der Verpflichtungen für Rechenzentren ist im S-1 nicht ausgefüllt. Die Hochrechnungen liegen bei 475–750 Mrd. $.
  - Die IPO-Bewertung von ca. 2 Bio. $ und das Volumen von 100 Mrd. $ stammen nur aus einem Reuters-Bericht.
  - Die Nettoumsatzbindung von 900 % ist nur sekundär belegt.
- **OpenAI-Zahlen für 2025** stammen aus einem Leak (Fortune/FT), nicht aus offiziellen Angaben.
- **Altman, Börsengang "now ill-advised" (September 2026):** Laut CNBC-Bericht, die URL ist nicht gesichert. Deshalb oben nicht verwendet.
- **Nvidia und OpenAI:** Den Backstop von 105 Mrd. $ und die 600 Mrd. $ gibt es nur über WSJ-Berichte, die über eine Sekundärquelle zitiert werden.
- **Musk:** "Mehr als 200 Neoclouds" und "Kreditmärkte leihen nicht mehr" sind seine Behauptungen.
- **IWF:** Die Zahlen zu den Kreisgeschäften (14 Deals, 1,4 Bio. $) stammen aus Sekundärberichten. Die BIP-Szenarien widersprechen sich (−1,1 % gegenüber −0,4/−0,6 %).
- **Georgieva:** "standing on one AI leg" ist nicht wörtlich. Wörtlich ist "stand on one leg".
- **Bank of England:** Die Angabe "47 % der Sterling-Unternehmensanleihen" ist unsicher. Bei den 4,1 Bio. $ von JPMorgan ist die Abgrenzung unklar.
- **BIZ-Zitat:** Vorname und Funktion von "Smets" sind nicht gesichert.
- **EZB:** Die 440 Mrd. € Haushalts-Exposure schwanken je nach Quelle. Der Blog ist keine offizielle Position.
- **Sequoia:** Die Werte für 2025 (ca. 840 Mrd. $) und 2026 (ca. 3 Bio. $) sind nur sekundär belegt. Die URLs für 2023/24 stammen aus Vorwissen.
- **KI-Anteil am S&P 500:**
  - Die 49 % hängen von der Auswahl des Korbs ab.
  - Für "Magnificent Seven ca. 34,8 % (13.10.), 2015: 12 %" ist keine URL gesichert, deshalb nicht verwendet.
  - Die 30 % für fünf Konzerne (Morningstar) sind belegt.
- **UN-Sicherheitsrat (23.9.) und Trumps Ablehnung einer Verlangsamung:** Details nicht geprüft.
- **MIT NANDA, 95 %:** methodisch schwach.
- **Epoch-Brief:** Modellnamen und Werte (GPT-6 Astra usw.) wie berichtet.
- **Challenger:** Die September-Zahl ist sekundär. Die BDC- und Private-Credit-Zahlen stammen aus Aggregatoren.
- **GPU-Preise:** Der Gebrauchtwert von 45 % und die Mietindizes stammen von Anbietern. Sie widersprechen sich: Verfall seit 2024, aber Anstieg seit Januar 2026.
- **NAIRR:** Die 35 Mio. $ sind dünn belegt. CalCompute ist nicht verifiziert.
- **Senatsbericht:** Er stammt von drei demokratischen Senatoren. "Ein Job pro MW" ist eine Faustregel.
- **Strompreise:**
  - Die 70 $ pro Monat sind die Projektion einer Interessengruppe (NRDC).
  - Die E3-Gegenstudie ist von der Branche finanziert.
  - Die +42 % über fünf Jahre stammen aus einem Faktencheck, der Bezugszeitraum ist zu prüfen.
- **Nadella, "can't plug in" (November 2025):** Er sprach von Chips im Lager, die er nicht anschließen könne. Die Podcast-Quelle ist nicht verifiziert, deshalb nicht verwendet.

**Geschichte**
- **"No other panic was ever so fatal to the middle class":** Die Zuschreibung ist unklar.
- **Mackay-Zitat:** nur über Odlyzko und Zweig, den Glasgow Argus selbst nicht eingesehen.
- **Brontës:** Den Wortlaut der Briefe an der Ausgabe von Smith prüfen. Spätere Verluste sind nur in Blogs belegt.
- **Darwin:** Verluste in der Manie selbst sind nicht belegt, nur der Verkauf von 1852.
- **Gesetze von 1846:** 263 oder 272. Bei den Meilen 8.470 (Escott) oder 9.500.
- **BIP-Anteil der Eisenbahn:** 6,7 % oder "fast 8 %", je nach Quelle.
- **Index −64 %:** Ob die Werte von Odlyzko oder von Campbell (VoxEU) stammen, ist zu prüfen.
- **Heutige Netzlänge** "ca. 11.000 Meilen" (Wikipedia) ist mit den Zahlen von damals nicht direkt vergleichbar.
- **Eisenbahnen an der US-Börse:** "mehr als die Hälfte" oder "60 %" der Börsenkapitalisierung, je nach Quelle.
- **Glasfaser:**
  - Die oft genannten 2,7 % beleuchtete Faser sind dünn belegt. Besser 5 % (Deseret) verwenden. Die 10 % von Merrill Lynch sind ohne gesicherte Fundstelle.
  - Dass Googles günstige Glasfaser YouTube ermöglicht hat, ist nicht belegt.
- **Kanal-Manie:** Die Zahlen haben keine gute Quelle.
- **Transport Act 1947:** ohne URL.
- **Nasdaq 5.132,52:** Das ist ein Intraday-Wert. Der Schlusskurs war niedriger.
- **Wagniskapital:** Die "46 % der Down Rounds mit gestapelten Präferenzen" sind dünn und ohne URL.

**Zitate**
- **Dimon:** Der Anlass ist unklar.
- **Bezos:** Der Wortlaut variiert, die Zeitmarke im Video ist nicht ermittelt.
- **Altman (August 2025):** Es gibt kein Video, der Wortlaut folgt The Verge.
- **Zuckerberg:** Nur der Kapitelbeginn (59:32) ist bekannt, nicht die genaue Sekunde.
- **DW-Beschreibung:** Dort steht "Ruchir Sharma, author of The Global AI Bust". Ein solches Buch wurde nicht gefunden.

**YouTube**
- Die Suche war durch die Tagesquote begrenzt, die Liste ist nicht vollständig.
- Die Views sind eine Momentaufnahme.
- Ohne Transkripte sind die Hooks nur aus Titeln und Beschreibungen erschlossen.

---

## 11. Primärquellen zur direkten Prüfung (nach Priorität)

Diese Quellen konnten wegen der Netzsperre nicht geöffnet werden. Zuerst prüfen:

1. Anthropic S-1 (SEC): https://www.sec.gov/Archives/edgar/data/0002130357/000162828026067168/anthropicpbc-sx1.htm
2. Meta 424B5 (SEC): https://www.sec.gov/Archives/edgar/data/0001326801/000119312526431043/d133631d424b5.htm und die Q3-Mitteilung: https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Third-Quarter-2026-Results/default.aspx
3. CoreWeave, Q2-Bericht und 10-Q (SEC, Investor Relations)
4. IWF, GFSR Oktober 2026 (Kapitel 1) und WEO: https://www.imf.org/en/blogs/articles/2026/10/12/global-financial-markets-face-rising-risks-from-ai-bond-yields-and-cyberattacks
5. Bank of England, FPC Record vom 30.9.2026 (bankofengland.co.uk)
6. BIZ, Jahreswirtschaftsbericht Juni 2026 und Quartalsbericht September 2026 (bis.org)
7. EZB, Finanzstabilitätsbericht Mai 2026, Kasten: https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2026/html/ecb.fsrbox202605_04~fd7b91dd22.en.html
8. Fed, Finanzstabilitätsbericht Mai 2026: https://www.federalreserve.gov/publications/2026-may-financial-stability-report-near-term-risks.htm
9. PJM-Auktionsbericht 2028/29 und IMM-Analyse 2027/28 (Links in 4.1)
10. JPMorgan/Cembalest, "Smothering Heights" und "Rear Window" (Links in 2.8)
11. Railway Regulation Act 1844: https://www.irishstatutebook.ie/1844/en/act/pub/0085/print.html
12. Odlyzko-Papiere und -Folien (umn.edu, Links in 3.1 und 3.5)
13. Campbell (MPRA): https://mpra.ub.uni-muenchen.de/21822/1/MPRA_paper_21822.pdf
14. Darwin Correspondence Project: https://www.darwinproject.ac.uk/view/letters/DCP-LETT-1488
15. Brontë-Briefe, Ausgabe von Margaret Smith (Bibliothek)
16. METR Frontier Risk Report: https://metr.org/blog/2026-05-19-frontier-risk-report/
17. Epoch Data Insights (Preise, BIP-Anteil, Abstand offen/geschlossen; Links in 5.2, 7.2, 2.9)
18. US Census BTOS: https://census.gov/library/stories/2026/05/ai-use-businesses.html
19. EIA, Today in Energy: https://www.eia.gov/todayinenergy/detail.php?id=67205
20. DOE/LBNL, Strombedarf der Rechenzentren: https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
21. JLARC Virginia, Bericht zu den Anreizen für Rechenzentren
22. Senatsbericht (Warren, Van Hollen, Blumenthal), Original-PDF
23. Challenger, Monatsberichte: https://www.challengergray.com/wp-content/uploads/2026/08/Challenger-Report-July-2026.pdf
24. EuroHPC, Ausschreibung AI Gigafactories: https://www.eurohpc-ju.europa.eu/eurohpc-joint-undertaking-launches-ai-gigafactories-call-2026-07-30_en
25. NTIA, BTOP-Auflagen: https://www2.ntia.doc.gov/files/Interconnection_Nondiscrimination_11_10_10_FINAL.pdf
26. Sitaraman und Narechania (Yale LPR): https://yalelawandpolicy.org/sites/default/files/YLPR/narechania_sitaraman_anantimonopolyapproach_ylpr_2024.pdf
27. McKinsey, "The cost of compute": https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers
