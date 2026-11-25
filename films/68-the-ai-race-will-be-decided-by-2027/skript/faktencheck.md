# Faktencheck #68 „The AI Race Will Be Decided by 2027“ · vo-v2 → vo-v3

Stand 24.11.2026 · Release So 29.11.2026, 17:00 Wien · geprüft: `vo-v2.txt` (Zeilennummern = Zeilen der Datei), Ergebnis: `vo-v3.txt`, Ampel: `ampel.md`, Beschreibung: `quellen-beschreibung.md`

**Ergebnis:** 76 Aussagen geprüft (73 mit Faktenkern, 3 reine Rhetorik). 3 falsch, 4 überdehnt, 1 nicht prüfbar, 3 Clip-Wortlaute nicht prüfbar (Aussage selbst ok), 62 ok. 8 Ersetzungen in 7 Zeilen, Wortzahl 1.351 → 1.357 (ohne Clip-Zeilen). Beide „subscribe“ bleiben, alle [CLIP]-Zeilen unverändert, keine Ich-Sätze, kein Huang-Zitat.

## Methode (bitte lesen)

- **Gesperrt in diesem Container** (WebFetch und curl): metr.org, metr.substack.com, blog.aifutures.org, lesswrong.com, alignmentforum.org, epoch.ai, lowyinstitute.org, nist.gov, semafor.com, reuters.com, scmp.com, cnbc.com, ember-energy.org, about.bnef.com, darioamodei.com, dwarkesh.com, techxplore.com, Yahoo und fast alle Nachrichtenseiten. YouTube-Watchseiten nur mit Captcha.
- **Direkt gelesen:** TechCrunch (17.11.2026), Wikipedia (World Humanoid Robot Games; AI Futures Project; Leopold Aschenbrenner; „List of countries by electricity production“ mit Ember-Daten 2025), YouTube oEmbed (Titel und Kanal der Clips C1, C4, C5).
- **Alles andere:** Websuche mit Auszügen der genannten Primärseiten bzw. Presseberichten (Reuters-Syndizierungen, AP, CBS, Al Jazeera, US News, The Hill, Rest of World). In der Tabelle steht beim Zugriff „Snippet“. Der wörtliche Text dieser Seiten ist damit nicht vollständig gelesen → siehe Zweitprüfer-Punkte in `ampel.md`.
- Zeitwörter gegen Release 29.11.2026 geprüft (Tabelle 2).

---

## 1. Muss-Änderungen (in vo-v3 umgesetzt)

| # | Zeile | Alt | Neu | Grund | Quelle |
|---|---|---|---|---|---|
| 1 | 85 | „And about four fifths of that **pace** comes from the A.I. itself.“ | „And about four fifths of that **speed-up** comes from the A.I. itself.“ | **Falsch.** METR schätzt, dass KI ~80 % der *aktuellen Beschleunigung* erklärt („AI accounts for roughly 80% of the current acceleration“, „substantial uncertainty“), nicht 80 % des ganzen Tempos. AIFP rechnet daraus einen KI-Faktor von 1,7x (1 + 0,8 × 0,9 bei 1,9x gesamt). Vom Gesamttempo stammen also eher zwei Fünftel von der KI. | METR, 5.11.2026: https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/ (Snippet) · AIFP-Update, 10.11.2026: https://www.lesswrong.com/posts/f9PajMLmBYzmWzyDv/q3-5-timelines-update-looks-like-the-intelligence-explosion (Snippet: „1.7x AI-driven speedup“) |
| 2 | 85 | „This November, an independent **auditor looked inside** one leading lab.“ | „This November, an independent **evaluator reported back from inside** one leading lab.“ | **Zeitwort falsch + ein Wort zu stark.** Die Prüfung lief 12.8.–29.10.2026, nur der Bericht kam im November (5.11.). METR ist eine unabhängige Evaluations-Non-Profit und nennt es „Independent Assessment“, keine förmliche Prüfung (Audit). | METR, 5.11.2026 (Snippet: „high-access evaluation from August 12 to October 29, 2026“) |
| 3 | 49 | „And America **keeps** its very best chips **out of** China. **The second-best**, it now allows, case by case.“ | „And America **bans sales of** its very best chips **to** China. **An older generation**, it now allows, case by case.“ | **Veraltet + zu stark.** H200 ist Hopper. Seit Herbst 2026 wird Vera Rubin ausgeliefert, davor Blackwell; Presse nennt H200 „three generations old“. „Second-most powerful“ (Reuters, März 2026) stimmt nicht mehr. „Keeps … out“ als Tatsache ist zu stark: Berichte über Schmuggel und über Training chinesischer Spitzenmodelle auf verbotenen Chips im Ausland. Belegt ist das Verkaufsverbot und die Einzelfallprüfung für H200 seit 15.1.2026. | BIS, Jan. 2026: https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china · Nvidia, 31.5.2026: https://nvidianews.nvidia.com/news/vera-rubin-full-production-agentic-ai-factory · TechCrunch, 13.11.2026 (Fingerabdrücke von Blackwell-Training in Kimi K3/DeepSeek V4) |
| 4 | 73 + 75 | „…**a humanoid robot** ran a hundred meters faster…“ / „And by one report, **the robot** left the track on a stretcher. But **it** ran.“ | „…**humanoid robots** ran a hundred meters faster…“ / „And by one report, **one of them** left the track on a stretcher. But **they** ran.“ | **Zwei Roboter verschmolzen.** Reuters (23.8.): im Vorlauf am 22.8. lief Tiangong Ultra 9,39 s, Honors „Lightning“ 9,47 s; Lightning brach danach zusammen und wurde auf einer Trage weggebracht, Tiangong Ultra stolperte in die Bande. Beide unter Bolts 9,58 s. Bloomberg/Xinhua schreiben die 9,39 s Lightning zu, die Zuordnung ist also umstritten. Der Plural stimmt in beiden Fassungen. AP: im Finale (26.8.) wurden fast alle Roboter auf Tragen weggebracht. | Reuters via Yahoo, 23.8.2026: https://finance.yahoo.com/news/chinese-robot-beats-usain-bolts-100m-world-record-at-beijing-games-172933371.html (Snippet) · Wikipedia „World Humanoid Robot Games“ (direkt) · AP via US News, 25.8.2026 |
| 5 | 37 | „The Chinese lab **disputes their numbers**.“ | „The Chinese lab's **own numbers show a smaller gap**.“ | **Zu stark.** Kein öffentlicher Widerspruch von DeepSeek gegen CAISI gefunden. Belegt: CAISI schreibt selbst, DeepSeeks selbst gemeldete Werte lägen über CAISIs Messung; DeepSeek sieht V4 Pro auf Höhe von Claude Opus 4.6 und GPT-5.4. | NIST/CAISI, Mai 2026: https://www.nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro (Snippet) · Decrypt: https://decrypt.co/366685/us-says-china-best-ai-models-lag-behind-experts-not-sure |
| 6 | 45 | „…computing power **switched on** around the world…“ | „…computing power **delivered** around the world…“ | **Ein Wort zu stark.** Epoch zählt angekommene Chips (Zolldaten plus Chinas Eigenproduktion), nicht eingeschaltete. Würde sonst den 600.000 ungenutzten Chips in Hongkong (Z. 49) widersprechen. | Epoch, 27.10.2026: https://epoch.ai/latest/introducing-the-ai-chip-imports-explorer (Snippet: „AI compute that arrived“) |
| 7 | 63 | „By the same **forecast**, data centers drive…“ | „By the same **forecasters**, data centers drive…“ | **Nicht prüfbar, ob dieselbe Prognose.** „Sechsmal“ (Economic Transition Scenario, fünf Jahre) und „38 % des US-Nachfragewachstums 2024–2030“ sind beide BNEF, erscheinen im selben Bloomberg-Artikel, aber ob aus demselben Szenario, lässt sich ohne das BNEF-Original (Paywall) nicht klären. „Forecasters“ ist sicher richtig. | Bloomberg via TechXplore, Feb. 2026: https://techxplore.com/news/2026-02-china-ramps-energy-boom-flagged.html (Snippet) |

**Bewusst NICHT geändert** (geprüft, vertretbar): Z. 37 „long tasks by itself“ (CAISI: größte Lücken bei Cyber-Aufgaben, abstraktem Denken und agentischen Software-Aufgaben, also überwiegend selbstständige, mehrstufige Aufgaben; „long“ ist eine Vereinfachung), Z. 101 „Neither side … neither can“ (Clip-Beschreibung spricht von den USA, die Verallgemeinerung deckt sich mit Kokotajlos Linie), Z. 115 „have started to talk“ (KI-Kanal und KI-Dialog sind neu seit Sept. 2026; allgemein reden beide schon länger, darum weich, aber nicht falsch).

## 2. Zeitwörter (Release 29.11.2026)

| Zeile | Wort | Bezug | Urteil |
|---|---|---|---|
| 3, 27 | „Next year“ | 2027 | ok |
| 21 | „This November“ | AIFP-Update 10.11.2026 | ok |
| 25 | „moved this date before“ | Dez. 2025 später, Apr. 2026 früher, Aug. 2026 (Kokotajlo-Median Dez. 2028) | ok |
| 31 | „Right now“ / „in May … by November“ | Abstand 6–8 Monate, Stand Mai–Nov. 2026 | ok |
| 45 | „in the last few years“ | 2022 bis Juni 2026 | ok |
| 49 | „now allows“ / „this fall“ | BIS-Regel 15.1.2026 / Reuters 5.11.2026 | ok |
| 71 | „over a recent year“ / „in one recent week“ | Feb. 2025–Feb. 2026 / Woche ab 26.10.2026 | ok |
| 73 | „This August“ | 22.8.2026 | ok |
| 85 | „This November … looked inside“ | Prüfung 12.8.–29.10., Bericht 5.11. | **falsch → geändert** („reported back from inside“) |
| 91 | „in twenty twenty-four“ / „Today“ | Juni 2024 / Fonds aktiv (CNBC 16.11.2026) | ok |
| 99 | „This November“ | Gill, 17.11.2026 | ok |
| 107 | „In September“ | Amodei-Essay 12.9.2026 | ok |
| 115 | „In September“ / „In November“ | Kanal 25./26.9.2026 / Shenzhen 19.11.2026 | ok |
| 125 | „before twenty twenty-seven is over“ | Mediane der Prognose (50 %) | ok, als Bedingung formuliert |

## 3. Hinweise ohne VO-Änderung (Einblendungen, Karten, Schnitt, Beschreibung)

1. **METR-Einblendung** (text-v2 Z. 210) anpassen: „~2x faster (1.9x, range 1.5–2.8x) · ~80 % of the speed-up from AI itself · estimate, ‘substantial uncertainty’“. Nicht „~80 % from AI itself“.
2. **Roboter-Bildtext:** die 9,39 s keinem Roboter namentlich zuordnen (Reuters: Tiangong Ultra; Bloomberg/Xinhua: Lightning). Vorschlag: „Fastest heat: 9.39 s · Bolt's record: 9.58 s · 22 Aug 2026“. Später an den Spielen noch schneller (8,86 s Halbfinale 25.8.).
3. **CAISI-Einblendung:** wenn Platz, „largest gaps: cyber, abstract reasoning, agentic software tasks“; „DeepSeek disputes“ ersetzen durch „DeepSeek's own scores are higher“.
4. **Hongkong-Einblendung:** „Reuters, 5 Nov 2026 (two sources)“. Optional „Nvidia halted H200 shipments to China, 17 Nov 2026“, ohne Namen, ohne Bild des Ex-CEO.
5. **Open-Model-Einblendung:** HF-Wert (41 % vs. 36,5 %, Feb. 2025–Feb. 2026) passt zu „over a recent year“. Frischer wäre Lowy Q3 2026 (China 78 % der Downloads von US- und China-Modellen, 1,8 Mrd. vs. 0,5 Mrd.), passt aber nur zu „in a recent quarter“.
6. **Zitatkarte Amodei** „And honestly, I don't know if it's possible, but we should try.“: Wortlaut in keiner erreichbaren Quelle gefunden (CNBC gesperrt). Mehrfach belegt ist „This is the toughest dilemma. This is the toughest aspect of our situation.“ (CBS, 13.9.2026). Karte erst nach Prüfung am CBS-Video verwenden, sonst die belegte Zeile.
7. **Kokotajlo-Einblendung** (X, 10.11.): Wortlaut über Crypto Briefing belegt, X gesperrt → [W].
8. **Clips C1, C4, C5:** Videos existieren (oEmbed geprüft), Wortlaute nicht gehört (Captcha). C4: Originaldatum des Gesprächs klären (Upload 18.9.2026, Satz „infamously high“ evtl. schon aus dem Dwarkesh-Gespräch vom April 2025) und das Originaldatum einblenden.
9. **Offenlegung (REGELN §1.10):** METR-Bericht betrifft Anthropic, Amodei ist Anthropic-Chef, der Film entsteht mit Claude. Nicht im Film, aber Pflicht in der Beschreibung (Zeile steht in `quellen-beschreibung.md`). Zusatzinfo: Aschenbrenners Fonds hielt laut Barchart (Mai 2026) rund 20 % seines Vermögens in Anthropic.
10. **Schmidt:** Interesse (KI- und Rüstungsinvestor, Mitautor „Superintelligence Strategy“) wird nicht genannt. Seine Zahl ist durch Epoch und CAISI gedeckt, darum ok.
11. **Huang:** kein Zitat, kein Name im VO. In der Beschreibung keine Links mit Huang im Titel oder in der URL (TechCrunch 13.11. und 17.11. darum nicht verlinkt).

---

## 4. Alle Aussagen

Urteil: **ok** · **overstated** (überdehnt) · **wrong** (falsch) · **unverifiable** (nicht prüfbar) · *Deutung* (Rhetorik, kein Faktenkern). Zugriff: direkt = Seite gelesen, Snippet = über Websuche-Auszug.

| # | Z. | Aussage (VO v2) | Urteil | Beleg / Anmerkung | Quelle (URL, Datum) | Zugriff |
|---|---|---|---|---|---|---|
| K1 | 1 | „The A.I. race will be decided by twenty twenty-seven.“ | ok (Zuspitzung) | Lesart des Films; Z. 3 nennt es Prognose, Z. 23 „this film's reading“. Die Prognose selbst betrifft den Superhuman AI Researcher, nicht „Rennen entschieden“. | https://blog.aifutures.org/p/q35-timelines-update-looks-like-the (10.11.2026) | Snippet |
| K2 | 3 | „That's a new forecast.“ | ok | AIFP-Update vom 10.11.2026 | wie K1 | Snippet |
| K3 | 3, 27 | „Next year.“ / „some of the people closest … now say: next year“ | ok | 2027; „some of“ korrekt eingeschränkt | wie K1; Defense One, Nov. 2026: https://www.defenseone.com/threats/2026/11/i-was-seriously-wrong-ai-experts-say-superintelligent-ai-may-arrive-soon-next-year/417348/ | Snippet |
| K4 | 5 | „a machine that out-thinks every one of us“ | *Deutung* | Bild für Superintelligenz | – | – |
| K5 | 11 | „America has the best chips“ | ok | Nvidia Blackwell/Rubin; Huaweis bester Chip ≈ halbe H100-Leistung | https://epoch.ai/publications/huaweis-roadmap-to-2031 (Sept. 2026) | Snippet |
| K6 | 11 | „…and most of the computing power“ | ok | 72 % der neuen KI-Rechenleistung seit 2022; Lowy: US-Rechenzentren ~40x China | https://epoch.ai/latest/introducing-the-ai-chip-imports-explorer (27.10.2026) · Lowy (8.11.2026) | Snippet |
| K7 | 11 | „Score it round by round, and it's a tie.“ | ok (als Wertung gekennzeichnet) | eigene Wertung; Lowy-Gesamturteil: USA führen | https://www.lowyinstitute.org/publications/asia-power-snapshot-china-the-united-states-and-the-race-for-ai-dominance (8.11.2026) | Snippet |
| K8 | 19 | „the best-known forecast in this field“ | ok | „AI 2027“ (Apr. 2025), meistbeachtetes Szenario | https://en.wikipedia.org/wiki/AI_Futures_Project | direkt |
| K9 | 19 | „They don't sell A.I. They're a nonprofit research group.“ | ok | 501(c)(3), spendenfinanziert | wie K8 (Stand 1.11.2026) | direkt |
| K10 | 21 | „the moment A.I. starts doing A.I. research by itself“ | ok (vereinfacht) | Meilenstein SAR: KI übernimmt die Arbeit der besten KI-Forscher | wie K1 | Snippet |
| K11 | 21 | „This November, they moved that moment. To twenty twenty-seven.“ | ok | alle Autoren-Mediane für SAR 2027 (Mai–Nov.); Kokotajlo Dez. 2028 → Mai 2027 | wie K1 · Forbes, 12.11.2026: https://www.forbes.com/sites/anishasircar/2026/11/12/ai-futures-project-pulls-its-intelligence-explosion-forecast-into-2027/ | Snippet |
| K12 | 25 | „They've moved this date before“ | ok | Dez. 2025 nach hinten, Apr. 2026 wieder nach vorn, Aug. 2026 Median Dez. 2028 | wie K8; Forbes | direkt/Snippet |
| K13 | 25 | „many other forecasts say the twenty thirties“ | ok (Stand Feb. 2026) | Metaculus-Community: 25 % bis 2029, 50 % bis 2033 | https://80000hours.org/agi/guide/when (Feb. 2026) | Snippet |
| K14 | 25 | „It also assumes that the labs don't slow down on purpose.“ | ok | „assuming no substantial deliberate slowdown“ | wie K1; https://cryptobriefing.com/ai-superhuman-researcher-2027/ (Nov. 2026) | Snippet |
| K15 | 31 | „Right now, America leads.“ | ok | alle ECI-Spitzenmodelle seit 2023 aus den USA | https://epoch.ai/data-insights/us-vs-china-eci (Jan. 2026, Export 7.11.2026) | Snippet |
| K16 | 31 | „What America's best machine could do in May, China's best can do by November.“ | ok | 6–8 Monate: Epoch ~6–7 (Nov. 2026), CAISI ~8 (Mai 2026) | wie K15; NIST (Mai 2026) | Snippet |
| K17 | 31 | „several of those Chinese models are free to download“ | ok | offene Gewichte (DeepSeek, GLM, Qwen, Kimi) | wie K15 | Snippet |
| K18 | 33 | „This man used to run Google.“ | ok | Schmidt, Google-Chef 2001–2011 | allgemein belegt | – |
| K19 | 35 | CLIP C1 Schmidt: „…six months behind, and there are many studies that show this.“ | Aussage ok, Wortlaut unverifiable | gleicher Satz in The Hill aus dem Masters-of-Scale-Gespräch; Video „Masters of Scale Summit 2026“ existiert | https://thehill.com/policy/technology/6178666-schmidt-china-ai-gap/ (Okt. 2026) · https://www.youtube.com/watch?v=qZG9IdGi4q0 | Snippet / oEmbed |
| K20 | 37 | „Other trackers say much the same.“ | ok | Epoch ~7 Monate (Schnitt seit 2023), CAISI ~8 | wie K15, K16 | Snippet |
| K21 | 37 | „America's lead is widest where A.I. has to work through long tasks by itself.“ | ok (vereinfacht) | CAISI-Lücken: Cyber (CTF 32 % vs. 71 %), ARC-AGI-2 (46 % vs. 79 %), PortBench, agentische Software-Aufgaben (44 % vs. 78 %); „long“ steht so nicht in der Quelle | https://www.nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro (Mai 2026) · https://www.aimodeling.com/en/news/slug/caisi-deepseek-v4-pro-8-month-gap-cost-efficient | Snippet |
| K22 | 37 | „The Chinese lab disputes their numbers.“ | **overstated** → geändert | siehe Muss #5 | wie K21 · Decrypt | Snippet |
| K23 | 37 | „on common coding tests, the two sides are nearly even“ | ok | SWE-bench Verified (Vals.ai, 1.9.2026): Claude Opus 5 97,0 %, DeepSeek V4 Pro 96,4 %, GPT-5.6 96,2 % | https://epoch.ai/benchmarks/swe-bench-verified · Vals.ai (Sept. 2026) | Snippet |
| K24 | 41 | „a model can be copied“ | *Deutung* | offene Gewichte, Destillation | – | – |
| K25 | 45 | „computing power switched on … in the last few years“ | **overstated** → geändert | siehe Muss #6 | wie K6 | Snippet |
| K26 | 45 | „About seven tenths of it went to America.“ | ok | 72 % (19,8 von 27,4 Mio. H100-Äquivalenten, 2022–Juni 2026) | wie K6 | Snippet |
| K27 | 45 | „China got a small slice.“ | ok | ~10 % inkl. Eigenproduktion (Spanne 1,9–4,2 Mio. H100e) | wie K6 | Snippet |
| K28 | 45 | „Europe, by one count, got even less.“ | ok | EU ~5 % (Dealroom nach Epoch) | https://dealroom.co/news/x-2115227492839530738-epoch-ai-the-us-has-received-72-of-the-worlds-ai-compute-since-2022-the/ (Okt. 2026) | Snippet |
| K29 | 47 | Huawei „ships only a few percent of the computing power“ of Nvidia | ok (Schätzung) | Epoch: unter 4 % von Nvidias KI-Rechenleistung 2026 (0,88 Mio. vs. ~23 Mio. H100e) | wie K5 | Snippet |
| K30 | 49 | „America keeps its very best chips out of China.“ | **overstated** → geändert | siehe Muss #3 | BIS (Jan. 2026); TechCrunch (13.11.2026) | Snippet |
| K31 | 49 | „The second-best, it now allows, case by case.“ | **wrong** (veraltet) → geändert | Einzelfallprüfung H200 seit 15.1.2026 stimmt, „second-best“ nicht mehr | BIS; Nvidia (31.5.2026) | Snippet |
| K32 | 49 | „this fall, about six hundred thousand of those sat in Hong Kong“ | ok | Reuters-Exklusivbericht 5.11.2026, zwei Insider | https://www.datacenterdynamics.com/en/news/almost-600000-nvidia-h200s-stranded-in-hong-kong-as-chinese-govt-stalls-on-import-approvals-report/ (Nov. 2026) | Snippet |
| K33 | 49 | „Not blocked by Washington. Blocked by Beijing.“ | ok (eine Quelle) | Reuters: Peking hält die Freigabe größerer Importe zurück; einzelne Käufer bekamen kleinere Mengen. Nvidia stoppte H200-Lieferungen am 17.11. selbst (TechCrunch: China hatte die Lieferungen „largely refused“) | wie K32 · TechCrunch 17.11.2026 | Snippet / direkt |
| K34 | 55 | „a chip can be banned. Electricity can't.“ | *Deutung* | – | – | – |
| K35 | 57 | „in America, towns are fighting over new data centers, and over rising power bills“ | ok | AP: Gemeinderäte voller Gegner; >188 lokale Gruppen in bis zu 40 Staaten; Ärger über Stromrechnungen. Ob Rechenzentren die Preise treiben, ist umstritten; das VO behauptet es nicht | https://fortune.com/2026/01/03/data-centers-town-halls-angry-citizens-affordability-zoning-utility/ (AP, 3.1.2026) | Snippet |
| K36 | 59 | „In China, they mostly just get built.“ | ok (Zuspitzung) | CNN (syndiziert): Widerstand gegen Großprojekte in China „essentially absent“. Gegenpunkt: viel Kapazität steht leer (Asia Times) | CNN Okt. 2026, nur Syndizierung gefunden: https://www.ghanamma.com/?p=181401 | Snippet |
| K37 | 61 | „China already generates more than twice as much electricity as America.“ | ok | 2025: 10.580 vs. 4.520 TWh = 2,3x | Ember via https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production · https://ember-energy.org/latest-insights/global-electricity-review-2026/ | direkt |
| K38 | 61 | „one forecast has it adding about six times as much new power capacity as America over the coming years“ | ok | BNEF (Economic Transition Scenario): >3,4 TW in fünf Jahren, „almost six times“ die USA (Al Jazeera: „more than six times“) | https://techxplore.com/news/2026-02-china-ramps-energy-boom-flagged.html (Feb. 2026) | Snippet |
| K39 | 63 | „By the same forecast, data centers drive more than a third of America's growing demand for power.“ | **unverifiable** („same“) → geändert; Zahl ok | BNEF: 38 % des US-Nachfragewachstums 2024–2030 | wie K38 | Snippet |
| K40 | 63 | „In China, a sliver.“ | ok | 6 % | wie K38 | Snippet |
| K41 | 69 | „more than nine in ten [visits] go to the American ones“ | ok | Lowy: >90 % des weltweiten Traffics auf US- und China-KI-Websites, >80 % der App-Nutzung | wie K7 | Snippet |
| K42 | 71 | „China gives many of its models away for free.“ | ok | offene Gewichte | wie K7 | Snippet |
| K43 | 71 | „Chinese open models were downloaded more often over a recent year than American ones“ | ok | Hugging Face: 41 % vs. 36,5 % (Feb. 2025–Feb. 2026); Lowy Q3 2026: 78 % der Downloads von US- und China-Modellen | https://equalocean.com/news/2026073122070-chinese-models-account-41-hugging-face-downloads-overtaking-us (31.7.2026) · Lowy | Snippet |
| K44 | 71 | „in one recent week, on a big platform for developers, more than half of all requests went to Chinese models“ | ok | OpenRouter: 55 % aller Text-Anfragen, Woche ab 26.10.2026 (USA 38 %) | wie K7 | Snippet |
| K45 | 73 | „This August in Beijing, a humanoid robot ran a hundred meters faster than Usain Bolt's world-record time.“ | ok, aber siehe K47 → Plural | 22.8.2026: 9,39 s und 9,47 s (Bolt 9,58 s) | https://en.wikipedia.org/wiki/World_Humanoid_Robot_Games · Reuters via Yahoo (23.8.2026) | direkt / Snippet |
| K46 | 75 | „It's not an official record.“ | ok | Vorlauf, keine Anerkennung durch World Athletics | wie K45; https://www.cbsnews.com/news/china-robot-usain-bolt-sprint-run-record-faster/ | direkt / Snippet |
| K47 | 75 | „by one report, the robot left the track on a stretcher“ | **wrong** (zwei Roboter verschmolzen) → geändert | siehe Muss #4 | Reuters via Yahoo: https://finance.yahoo.com/news/chinese-robot-beats-usain-bolts-100m-world-record-at-beijing-games-172933371.html · AP via US News: https://www.usnews.com/news/business/articles/2026-08-25/a-chinese-humanoid-robot-sets-a-new-100-meter-sprint-record-at-beijing-games | Snippet |
| K48 | 83 | „one new report says a runner may already be close“ | ok (Deutung) | METR: keine überzeugenden Engpässe für weiteres schnelles Tempo in 12 Monaten (geringe Zuversicht) | METR (5.11.2026) | Snippet |
| K49 | 85 | „This November, an independent auditor looked inside one leading lab.“ | **overstated** (Zeit + Wort) → geändert | siehe Muss #2 | METR | Snippet |
| K50 | 85 | „progress there now runs about twice as fast as before“ | ok | 1,9x (95-%-Intervall 1,5–2,8x) gegenüber März 2024–Okt. 2025 | METR; https://www.technology.org/2026/11/07/metr-anthropic-ai-progress-twice-as-fast-assessment/ | Snippet |
| K51 | 85 | „about four fifths of that pace comes from the A.I. itself“ | **wrong** → geändert | siehe Muss #1 | METR; AIFP | Snippet |
| K52 | 87 | „It's one lab, with most of the key evidence blacked out.“ | ok | METR: „For the public version, Anthropic redacted a majority of the evidence we found most informative.“ | https://x.com/METR_Evals/status/2118412194702598339 (Nov. 2026) | Snippet |
| K53 | 87 | „this is the report that moved the forecast“ | ok | AIFP behält nur Modellpfade, die zu METRs Schätzung passen; Forbes: Verschiebung „mainly on METR's report“ (daneben weitere Belege) | wie K1, K11 | Snippet |
| K54 | 89 | „One famous essay made it a rule: the free world must prevail.“ | ok | Kapitel IIId „The Free World Must Prevail“ in „Situational Awareness“ | https://situational-awareness.ai/the-free-world-must-prevail/ (Juni 2024) | Faktenzettel, nicht geöffnet |
| K55 | 89 | „Cross that line first, and your lead grows by itself, in the economy and in the military.“ | ok (als Logik der Läufer zugeschrieben) | Aschenbrenner: entscheidender wirtschaftlicher und militärischer Vorsprung | wie K54 | Faktenzettel |
| K56 | 91 | „Its author wrote that in twenty twenty-four.“ | ok | Juni 2024 | https://en.wikipedia.org/wiki/Leopold_Aschenbrenner | direkt |
| K57 | 91 | „Today he runs an A.I. investment fund.“ | ok | Situational Awareness LP; nach Verlusten im Juli 2026 (~45 → ~10 Mrd. $) weiter aktiv, neue Beteiligungen | wie K56 · https://www.cnbc.com/2026/11/16/situational-awareness-aschenbrenner-new-ai-bets.html (16.11.2026) | direkt / Snippet |
| K58 | 99 | „If your lead is half a year…“ | ok | ~6 Monate, siehe K16 | – | – |
| K59 | 99 | „This November, the United Nations' technology envoy warned of exactly that: a race where corners get cut.“ | ok (sinngemäß) | Amandeep Gill (Untergeneralsekretär, Sondergesandter für digitale Technologien), Semafor-Event 17.11.2026: Wettbewerb verleite dazu, Schutzregeln zu überspringen; nach Sicherheitsvorfällen glauben mehrere Länder, „shortcuts are being taken“. Als Paraphrase einblenden | https://www.semafor.com/article/11/17/2026/us-china-ai-race-causing-global-alarm-uns-top-tech-envoy-says (17.11.2026) | Snippet |
| K60 | 101 | „Neither side can slow down alone. And neither can safely run flat out.“ | ok (verallgemeinert) | Clip-Beschreibung bezieht sich auf die USA; Kokotajlo (80,000 Hours #253): Kontrollverlust unter Rennbedingungen wahrscheinlicher als nicht; Plan A = geprüfter US-China-Deal zum Bremsen | https://80000hours.org/podcast/episodes/daniel-kokotajlo-ai-2040-plan-a/ (2026) | Snippet |
| K61 | 103 | CLIP C4 Kokotajlo | Aussage ok, Wortlaut unverifiable | Video „'My P-Doom is sort of infamously high' — Daniel Kokotajlo on the race“ (Dwarkesh Podcast Clips) existiert; Originaldatum offen | https://www.youtube.com/watch?v=m6s16cqd1Tg | oEmbed |
| K62 | 107 | „In September, the head of a leading American A.I. lab wrote that the labs should slow down on purpose.“ | ok | Amodei, „We Must Pace the Frontier“, 12.9.2026: bewusst langsamerer Fähigkeitszuwachs, kein Stopp | https://darioamodei.com/post/we-must-pace-the-frontier (12.9.2026) | Snippet |
| K63 | 107 | „And try for a speed limit, together with China.“ | ok | Schritt 3: globale Koordination inkl. China; prüfbares Tempolimit nach Art von SALT | wie K62 · https://restofworld.org/2026/china-rejects-dario-amodei-anthropic-ai-slowdown-trump-xi/ | Snippet |
| K64 | 107 | „He admits it may not work.“ | ok | niedrige Erwartungen; „difficult but just on the edge of being possible“ (Sekundärquelle) | wie K62 | Snippet |
| K65 | 107 | „by several reports, neither capital welcomed the idea“ | ok | Trump lehnte Bremsen ab; Außenministerium China (14.9.): „fearmongering, confrontation and vicious competition“ (ohne Namen); Global Times: „Cold War playbook“ | https://www.aljazeera.com/news/2026/9/14/silent-cold-war-why-calls-to-slow-ai-have-sparked-new-us-china (14.9.2026) · Rest of World | Snippet |
| K66 | 111 | „Researchers who study China say it's in a different event. … More roads at once, like those robots.“ | ok | CSET: China verfolgt mehrere Wege zur AGI, u. a. Embodied AI; Kyle Chan (Brookings): verschiedene Ziele, darum kaum ein „Rennen“ | https://cset.georgetown.edu/publication/chinas-embodied-ai-a-path-to-agi/ (Dez. 2025) · NYT 14.5.2026 | Snippet |
| K67 | 113 | CLIP C5 Kyle Chan | Aussage ok, Wortlaut unverifiable | Folge vom 14.5.2026 „The U.S. and China Are Not In An A.I. Race“ existiert | https://www.youtube.com/watch?v=fEGUlvR9gvY | oEmbed |
| K68 | 115 | „And the two rivals have started to talk.“ | ok (weich) | KI-Kanal und KI-Dialog neu seit Sept. 2026; Gipfel gab es schon vorher (Busan 2025, Peking Mai 2026, Washington Sept. 2026), 2024 bereits Einigung zu menschlicher Kontrolle über Atomwaffen | https://www.aljazeera.com/news/2026/9/26/china-us-to-open-ai-communication-channel-after-summit-white-house-says (26.9.2026) | Snippet |
| K69 | 115 | „In September, their governments agreed to set up a channel for A.I. incidents.“ | ok | Weißes Haus 25.9., chinesische Staatsmedien 26.9.2026; Details (Start, Zuständigkeit) offen | wie K68 | Snippet |
| K70 | 115 | „In November, their presidents met in Shenzhen.“ | ok | 19.11.2026, APEC, Kylin Villa | https://www.mfa.gov.cn/eng./xw/zyxw/202611/t20261119_12063139.html (19.11.2026) | Snippet |
| K71 | 115 | „They signed no A.I. treaty, and not much else was agreed.“ | ok | wenige konkrete Ergebnisse (Handel, Agrar, seltene Erden) | https://www.china-briefing.com/news/apec-2026-in-shenzhen-what-the-leaders-meeting-and-trump-xi-talks-mean-for-business/ (Nov. 2026) | Snippet |
| K72 | 115 | „according to Washington, they did agree on one line. Humans stay involved when military A.I. makes decisions.“ | ok (als US-Aussage) | Bessent, 20.11.: KI dürfe bei großen Militäraktionen nicht autonom entscheiden; Chinas Readout nur allgemein „menschliche Kontrolle“; kein gemeinsamer Text | https://www.usnews.com/news/world/articles/2026-11-20/trump-xi-agreed-that-military-ai-decisions-should-involve-humans-bessent-says (Reuters, 20.11.2026) · SCMP | Snippet |
| K73 | 119 | „Today, America is ahead.“ | ok | Lowy-Gesamturteil | wie K7 | Snippet |
| K74 | 121 | „Deterrence, where each side can stop the other from sprinting.“ | ok (Option) | MAIM, „Superintelligence Strategy“ (Hendrycks, Schmidt, Wang, März 2025) | https://arxiv.org/abs/2503.05628 | Faktenzettel |
| K75 | 123 | „So far, they have one agreed channel and one sentence.“ | ok | Kanal (Sept.) + Bessent-Linie (Nov.) | wie K69, K72 | Snippet |
| K76 | 125 | „if those forecasters are right, we'll know before twenty twenty-seven is over“ | ok | Mediane = 50 %, als Bedingung formuliert | wie K1 | Snippet |

**Zählung:** wrong 3 (K31, K47, K51) · overstated 4 (K22, K25, K30, K49) · unverifiable 1 (K39) · Clip-Wortlaut unverifiable, Aussage ok 3 (K19, K61, K67) · reine Rhetorik 3 (K4, K24, K34) · ok 62 (davon als Wertung/Zuspitzung gekennzeichnet bzw. vereinfacht: K1, K7, K10, K21, K36, K48, K55, K60, K68).
