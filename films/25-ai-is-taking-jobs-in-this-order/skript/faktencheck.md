# Faktencheck „The Last Human Job“ (#25) · vo-v3 → vo-v4 · Stand 10.11.2026

**Prüfrahmen:** Release Sa 14.11.2026, 17:00 Wien. Alle Zeitwörter gegen dieses Datum geprüft. Jakobs eigene Angaben (15 Jahre Videoproduzent, 4 Jahre KI, Doku pro Tag, von Hand zwei Wochen pro Film, keine Sprecher mehr) sind von Jakob bestätigt und nicht geprüft.

**Methode:** Seitenabrufe sind hier großteils gesperrt (u. a. digitaleconomy.stanford.edu, arxiv.org, challengergray.com, nrmp.org, radiologybusiness.com, worksinprogress.news, axios.com, gatesnotes.com, darioamodei.com, singjupost.com, YouTube-Watch-Seite). **Direkt gelesen:** Anthropic-Bericht (anthropic.com), Microsoft-Rohdaten (raw.githubusercontent.com/microsoft/working-with-ai, Versionen v1.0 und v1.1), YouTube-oEmbed (Titel und Kanal aller drei Clips), YouTube-Auto-Untertitel mit Wortzeiten von K1 und K2 (mit dem Auftrag bereitgestellt). Alles andere über wörtliche Suchauszüge, je mindestens zwei unabhängige Quellen.

**Ampel:** grün = belegt · gelb = ein Wort zu stark, Firmenangabe, Zahl nur aus einer Quelle oder Zeitwort knapp · rot = falsch, falsch zugeschrieben oder nicht belegbar · offen = ohne Material vom Mac nicht prüfbar.

**Ergebnis:** 58 Aussagen geprüft. Sprechertext: 45 (35 grün, 8 gelb, 2 rot). Clips, Karten, Einblendungen: 13 (7 grün, 3 gelb, 2 rot, 1 offen). **Gesamt 42 grün, 11 gelb, 4 rot, 1 offen.** 5 MUSS-Änderungen in `vo-v4.txt`, 5 MUSS außerhalb des Sprechertexts (Clips, Karten, Bild), 4 KANN. Thesen, Bilder und Jakob-Sätze sind als „These“/„Jakob“ markiert und nicht gezählt.

**Gesamturteil:** Der Film hält. Alle tragenden Zahlen stimmen: Stanford 19 %, die Microsoft-Rangliste (aus den Rohdaten nachgerechnet), Anthropic 90 %, Challenger 2,2-fach, Deep Blue 1997. Die zwei wichtigsten Funde: (1) **„Until the humanoid robots show up“ sagt nach Sprecher-Transkript und Tonfluss Steven Bartlett, nicht Hinton.** „Notice what he added“ wäre eine Falschzuschreibung. Das K2-Fenster endet jetzt bei „plumber.“, der VO sagt „Notice the condition.“ (2) **„The machine took the reading of the scan“ stimmt nicht.** Radiologen befunden weiter selbst, KI deckt nur einen kleinen Teil ab. Dazu trägt die Gates-Einordnung „bumpy few years“ nicht: Gates schreibt „one of the most turbulent times in human history“.

---

## 1. MUSS-Änderungen im Sprechertext (in `vo-v4.txt` eingearbeitet)

Z. = Absatzzeile in vo-v3.txt/vo-v4.txt (beide 43 Zeilen, Platzhalter unverändert).

| Nr. | Z. | Alt | Neu | Grund | Quelle |
|---|---|---|---|---|---|
| **M1** | 9 | They've **stopped hiring** the junior one. | They've **cut back on hiring** the junior one. | Ein Wort zu stark. Die Daten zeigen weniger Einstellungen, nicht null: 22–25-jährige Entwickler etwa 20 % unter dem Höchststand (Brynjolfsson im Clip-Video: „about a 20%“), Mechanismus „reduced hiring of young workers rather than increased separations“. | https://digitaleconomy.stanford.edu/news/canariesaug26/ · https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf · OvFI-V9Zaeo 1688–1692 s |
| **M2** | 19 | The machine **took the reading of the scan.** | The machine **took over part of the reading.** | Falsch. KI hat das Befunden nicht übernommen: nur etwa 48 % der Radiologen nutzen KI überhaupt; alle zugelassenen Modelle zusammen decken einen kleinen Teil der Bildaufgaben ab; Behörden und Versicherer decken keine autonome Befundung. Hinton selbst (2025): er habe nur die Bildauswertung gemeint. „Just like the scan“ (Z. 27) bleibt stimmig. | https://www.worksinprogress.news/p/why-ai-isnt-replacing-radiologists · https://the-decoder.com/geoffrey-hintons-wildly-overconfident-ai-prediction-failed-now-its-a-lesson-in-humility/ |
| **M3** | 27 | One lab chief **warns** this could cut half of all entry-level office jobs within five years. | One lab chief **has warned** this could cut half of all entry-level office jobs within five years. | Zeitwort. Aussage vom 28.5.2025 (Axios: „in the next one to five years“), das Fenster läuft also ab 2025, nicht ab heute. Seit Mai 2026 betont Amodei öffentlich den Jevons-Effekt (Fortune). „Has warned“ passt zur Karte „May 2025“ und bleibt richtig, egal wie er es heute sagt. | https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic · https://fortune.com/2026/05/05/dario-amodei-jevons-paradox-will-ai-wipe-out-white-collar-jobs/ |
| **M4** | 31 | **Notice what he added.** Until the robots get good. | **Notice the condition.** Until the robots get good. | Falsch zugeschrieben. „Until the humanoid robots show up.“ (50:47) ist laut Transkript mit Sprecherangaben Bartlett. Im Ton: 3,3 s Pause nach „plumber.“, dann läuft der Satz ohne Absatz in Bartletts nächste Frage („In such a world where there is mass joblessness … Sam Altman … Elon Musk“). Hintons eigene Bedingung steht im Clip: „a long time before it's as good at physical manipulation as us“. Der neue Satz passt auch, falls das Abhören doch Hinton ergibt. | https://singjupost.com/transcript-of-godfather-of-ai-i-tried-to-warn-them-but-weve-already-lost-control/ · Auto-Untertitel giT0ytynSqg 3033–3054 s |
| **M5** | 35 | **More than** ten million people play online every single day. | **About** ten million people play online every single day. | Firmenangabe knapp. Chess.com: Ø täglich aktive Nutzer Q1 2026 9,7 Mio., Q2 2026 10,2 Mio. „More than … every single day“ trägt das nicht, und die Einblendung nennt Chess.com als Quelle. | https://www.chess.com/board-reports/2026-q2 · https://www.chess.com/board-reports/2026-q1 |

**MUSS außerhalb des Sprechertexts** (Details in `clips.json` und `zitatkarten.md`):
- **B1 · K2-Fenster** endet bei „plumber.“ (3045,0 s), nicht bei „…show up.“ (3049,6 s). Grund wie M4.
- **B2 · K3-Einordnung** „Even Bill Gates expects a bumpy few years. Which is exactly why the steps matter.“ → „**Even Bill Gates calls this a turbulent era.** Which is exactly why the steps matter.“ Gates: „Even under the best circumstances, the transition to this new AI era will be one of the most turbulent times in human history.“ Er spricht von einer Ära bzw. einem Jahrzehnt, nicht von „a few years“, und „bumpy“ verharmlost. Der Clip-Inhalt selbst bleibt offen (Abschnitt 5).
- **B3 · Amodei-Karte ohne Anführungszeichen:** Der Satz ist Axios’ Wiedergabe („Amodei told us“), kein wörtliches Zitat.
- **B4 · Einblendung** „record 1,208 residency positions, 2025“ → „RECORD: 1,200+ RADIOLOGY RESIDENCY SPOTS · US MATCH 2025“. Die 1.208 stammen aus Works in Progress; NRMP-basierte Zählungen nennen 1.210 (Diagnostik) bzw. 1.451 (mit Interventioneller Radiologie).
- **B5 · Hinton-2016-Karte** (falls verwendet): „People should stop training radiologists now.“, nicht „We should …“.

**Hinweis H1 (keine Faktenfrage, aber REGELN §7):** Die drei Einordnungssätze stehen nur in den Klammern von text-v3, **nicht im Sprechertext** vo-v3/vo-v4. K2 hat danach einen eigenen Satz („Notice the condition …“), K1 und K3 hätten keinen. Entscheiden: sprechen (dann direkt vor `[CLIP K1]`/`[CLIP K2]`/`[CLIP K3]` einfügen) oder als Bildzeile. Geprüfte Fassungen in Abschnitt 5.

---

## 2. KANN-Änderungen (nicht eingearbeitet)

| Nr. | Z. | Alt | Vorschlag | Grund | Status |
|---|---|---|---|---|---|
| **K1** | 1 | The machines didn't start in the factory. | **This time,** the machines didn't start in the factory. | Fabrikautomation kam zuerst (Industrieroboter seit 1961). Gemeint ist die KI-Welle; zwei Wörter machen das hörbar und schärfen die These der umgekehrten Reihenfolge. | empfohlen |
| **K2** | 19 | …should be gone by now. | …should be **on its way out** by now. | Hinton sagte „stop training radiologists“ und „within five years … better than radiologists“ („might be ten“), nicht, dass der Beruf verschwunden wäre. | offen |
| **K3** | 19 | And yet, **last year,** America opened more training spots for radiologists than ever before. | And yet, **this year,** … | Stimmt so (2025 Rekord). 2026 gab es erneut einen Rekord (1.241 Diagnostik-Stellen, +3 %); „this year“ ist aktueller und stärker. Einblendung dann „…US MATCH 2026“. | empfohlen |
| **K4** | 27 | …explain anything, at any hour, in any language. | …in **almost** any language. | Hyperbel; Sprachmodelle decken viele, aber nicht alle Sprachen gut ab. | offen |

---

## 3. Alle Aussagen

**Sprechertext** (Z. = Zeile in vo-v3/vo-v4)

| Nr. | Z. | Satz (kurz) | Status | Quelle | Anmerkung |
|---|---|---|---|---|---|
| 1 | 1 | „A machine can now do it in seconds.“ (E-Mail, Bericht, Übersetzung) | grün | https://arxiv.org/abs/2507.07935 | Häufigste Copilot-Tätigkeiten: Informationen sammeln, Schreiben. |
| – | 1 | „Every job is a row of tasks like that.“ | These | O*NET-Aufgabenbündel; Brynjolfsson im K1-Video 1621–1636 s | – |
| 2 | 1 | „The machines didn't start in the factory. They started at the desk.“ | gelb | https://www.anthropic.com/research/labor-market-impacts · https://arxiv.org/abs/2507.07935 | Für die KI-Welle richtig, wörtlich angreifbar → KANN K1. |
| 3 | 1 | „Among young people starting out, the jobs most exposed to A.I. are already almost a fifth behind.“ | grün | https://digitaleconomy.stanford.edu/news/canariesaug26/ | Update 12.8.2026: 22–25-Jährige in den zwei exponiertesten Quintilen −11 % seit Nov. 2022, in den drei schwächsten +10 % → rund 19 % unter dem Vergleichspfad (Daten bis Juni 2026). Relative Lücke, „behind“ trifft es. |
| – | 1 | Jakob: 15 Jahre, 4 Jahre, „never seen a change as fast“ | Jakob | – | nicht geprüft |
| 4 | 5 | „The order is a judgment call, built from what researchers have measured…“ | grün | – | korrekte Kalibrierung der Rangliste |
| 5 | 5 | Platz 10: junior coder, support agent | grün | Stanford (wie Nr. 3); OvFI-V9Zaeo 1688–1696 s | Entwickler „about 20%“, Callcenter „like 14%“. „Assistant who writes the first draft“ ist Bild, kein Messwert. |
| 6 | 5 | „Most of them aren't being fired … They're just not being hired.“ | grün | https://digitaleconomy.stanford.edu/news/canariesaug26/ · https://www.anthropic.com/research/labor-market-impacts | Stanford: weniger Einstellungen statt mehr Kündigungen; Anthropic: Einstellung Jüngerer verlangsamt. |
| 7 | 9 | „People with experience, in the very same jobs, are doing fine.“ | grün | Stanford; OvFI-V9Zaeo 1736–1745 s („more senior coders, we didn't see a big decline“) | – |
| 8 | 9 | „Companies still fight over the senior developer.“ | gelb | https://tech.slashdot.org/story/26/08/22/211256/ (Zusammenfassung Washington Post, Aug. 2026) | Brynjolfsson: Nachfrage nach Senior-Codern bleibt hoch. „Fight over“ zugespitzt, keine Änderung nötig. |
| 9 | 9 | „They've stopped hiring the junior one.“ | gelb | siehe M1 | → **M1** |
| 10 | 9 | „If you've been doing your work for twenty years, the data says you're the one they keep.“ | grün | Stanford (wie Nr. 3) | Ältere Gruppen in exponierten Berufen stabil oder wachsend. |
| – | 9 | „It's your kids who are finding the first door closed.“ | These | – | Bild für 22–25 |
| 11 | 13 | „Microsoft studied two hundred thousand real conversations with its assistant.“ | grün | https://arxiv.org/abs/2507.07935 | 200.000 anonymisierte Bing-Copilot-Gespräche, USA, Jan.–Sep. 2024. |
| 12 | 13 | „Interpreters and translators landed at the very top.“ | grün | https://github.com/microsoft/working-with-ai | Rohdaten nachgerechnet: Platz 1 von 785 (v1.0 und v1.1). |
| 13 | 13 | „Writers and historians close behind.“ | grün | wie Nr. 12 | Historians Platz 2; Writers and Authors Platz 5 (v1.0, 2025) bzw. 3 (v1.1, 2026). |
| 14 | 13 | „Roofers and dredge operators at the very bottom.“ | grün | wie Nr. 12 | Dredge Operators Platz 785 von 785; Roofers 14. (v1.0) bzw. 16. von unten. |
| 15 | 13 | „The voice you're hearing right now is not a person.“ | grün | Produktion | synthetische Stimme, deckt sich mit der YPP-Zeile |
| 16 | 13 | „In office and admin work, A.I. could in theory handle nine out of ten tasks.“ | grün | https://www.anthropic.com/research/labor-market-impacts | 5.3.2026: „Computer & Math (94%) and Office & Admin (90%)“, Grafik „Share of job tasks that LLMs could theoretically perform“. Maß β (Eloundou 2023) = Aufgabe mit LLM mindestens doppelt so schnell. |
| 17 | 13 | „In practice, it's doing a fraction of that. So far.“ | grün | ebd. | „actual coverage remains a fraction of what's feasible“ |
| 18 | 13 | „This year alone, they've named A.I. as the reason for more than twice as many job cuts as last year.“ | grün | https://www.challengergray.com/blog/october-layoffs-at-three-year-low-seasonal-hiring-plans-up-26/ · https://www.hcamag.com/us/specialization/transformation/ai-blamed-for-121401-job-cuts-but-the-labor-data-isnt-buying-it/594129 | Jan.–Okt. 2026: 121.401 angekündigte Streichungen mit Grund KI, ganzes Jahr 2025: 54.836 → 2,2-fach. Angekündigt, nicht vollzogen; seit Herbst führt „Markt/Wirtschaft“ als Grund (Oktober nur 1.265 mit KI). Satz bleibt richtig. |
| 19 | 13 | Platz 7: images, music, sound, whole shots, even the edit | grün | allgemein; Jakob J3b | – |
| 20 | 19 | „…according to one of the fathers of A.I., should be gone by now.“ | gelb | wie Nr. 21 | Zuspitzung → KANN K2 |
| 21 | 19 | „In 2016, Geoffrey Hinton said we should stop training radiologists.“ | grün | https://www.creativedestructionlab.com/wp-content/uploads/2016/10/Mkt4intel-Web-Program.pdf · https://radiologybusiness.com/topics/artificial-intelligence/ny-times-revisits-nobel-prize-winners-prediction-ai-will-render-radiologists-obsolete | Toronto, Konferenz des Creative Destruction Lab, 27.10.2016: „People should stop training radiologists now.“ |
| 22 | 19 | „Machines would read the scans better.“ | grün | ebd. | „within five years deep learning is going to do better than radiologists“ |
| 23 | 19 | „He was partly right. Machines now read many scans very well.“ | grün | https://www.worksinprogress.news/p/why-ai-isnt-replacing-radiologists | Über 700 zugelassene Radiologie-Modelle; in Klinikbedingungen oft schwächer als im Benchmark. |
| 24 | 19 | „And yet, last year, America opened more training spots for radiologists than ever before.“ | grün | https://radiologybusiness.com/topics/healthcare-management/healthcare-staffing/match-day-2025-radiology-programs-offer-more-positions-while-applicant-pool-shrinks · Works in Progress | 2025 Rekord; 2026 erneut Rekord → KANN K3. Einblendungszahl → B4. |
| 25 | 19 | „Hospitals can't find enough of them.“ | grün | Works in Progress | Unbesetzte Stellen auf Rekordhöhe (Stand 2025). |
| 26 | 19 | „They talk to the surgeon. They decide what matters. They carry the responsibility …“ | grün | Works in Progress | Radiologen verbringen etwa 36 % der Zeit mit Bildauswertung; autonome Befundung wird weder zugelassen noch bezahlt. |
| – | 19 | „So the dominoes were never whole jobs. They're tasks.“ | These | – | – |
| 27 | 19 | „The machine took the reading of the scan.“ | **rot** | siehe M2 | → **M2** |
| 28 | 19 | „The radiologist kept everything around it, and moved up.“ | grün | Works in Progress | Gehalt Ø ~520.000 $ (+48 % seit 2015), Nachfrage gestiegen; „moved up“ als Bild. |
| 29 | 27 | Platz 6: agents run the whole workflow | grün | – | Beschreibung des Agenten-Prinzips, als Platz-Einschätzung gerahmt (Prognose). |
| 30 | 27 | „One lab chief warns this could cut half … within five years.“ | gelb | siehe M3 | → **M3**, Karte → B3 |
| 31 | 27 | „That's a forecast, not a measurement.“ | grün | – | korrekte Kalibrierung |
| 32 | 27 | „So far, the data shows fewer hires, not mass layoffs.“ | grün | Stanford · Anthropic | Keine breite Verdrängung; kein systematischer Anstieg der Arbeitslosigkeit. Kein Widerspruch zu Nr. 18 (~121.000 angekündigte Streichungen bei ~160 Mio. Beschäftigten). |
| 33 | 27 | „A.I. can already explain anything, at any hour, in any language.“ | gelb | – | Hyperbel → KANN K4 |
| – | 27 | „A child learns because someone believed they could.“ | These | – | – |
| 34 | 27 | „More and more of the diagnosis is moving to the machine.“ | grün | https://www.beckershospitalreview.com/ai/physicians-grow-more-comfortable-with-ai-report.html · Works in Progress | AMA: 66 % der Ärzte nutzten 2024 KI (2023: 38 %); Radiologie ≈ drei Viertel aller zugelassenen KI-Medizinprodukte. Trend, die Entscheidung bleibt beim Arzt. |
| 35 | 27 | „What's easy for us is brutally hard for machines.“ | grün | https://vcresearch.berkeley.edu/news/are-we-truly-verge-humanoid-robot-revolution | Moravec-Paradox; Geschicklichkeit z. B. beim Installieren bleibt schwer. |
| 36 | 27 | „The first humanoid robots have started work in factories and warehouses.“ | grün | https://agilityrobotics.com/content/gxo-signs-industry-first-multi-year-agreement-with-agility-robotics · https://www.agilityrobotics.com/content/agility-robotics-announces-strategic-investment-and-agreement-with-motion-technology-company-schaeffler-group | GXO (Lager, seit 2024, erster kommerzieller Humanoiden-Einsatz), Schaeffler (Werke). Fabriken meist Piloten, „the first … have started“ ist richtig kalibriert. Faktenzettel-Beispiele „Atlas Metaplant“ (Angaben widersprüchlich) und „Digit bei Amazon“ (nur Test 2023) nicht ins Bild nehmen. |
| 37 | 27 | „Clean floors, same task, again and again.“ | grün | wie Nr. 36 | Digit bewegt Kisten vom Transportroboter aufs Förderband. |
| 38 | 31 | „Notice what he added. Until the robots get good.“ | **rot** | siehe M4 | → **M4** |
| – | 31 | „Number three holds for years. Not forever.“ | These | – | Prognose |
| 39 | 31 | „In Microsoft's study, nursing assistants landed near the very bottom.“ | grün | https://github.com/microsoft/working-with-ai | Nursing Assistants 39. (v1.0) bzw. 41. von unten, von 785. |
| 40 | 31 | „Almost nothing they do overlaps with A.I.“ | grün | ebd. | Wert 0,029 (Spitze 0,49) |
| – | 31/35 | Jakob: Maschinen übernahmen fast alles; von Hand zwei Wochen; Agenten produzieren | Jakob | – | nicht geprüft |
| 41 | 35 | „Computers have beaten the best chess players for almost thirty years.“ | grün | https://www.chess.com/terms/deep-blue-chess-computer | Deep Blue – Kasparov 3½:2½, 11.5.1997 → 29,5 Jahre |
| 42 | 35 | „And chess has never been bigger.“ | gelb | https://www.chess.com/board-reports/2026-q2 | Firmenangabe: 267 Mio.+ Mitglieder (30.6.2026), Nutzung +25,7 % zum Vorjahr. Keine Änderung, Einblendung „company figure“. |
| 43 | 35 | „More than ten million people play online every single day.“ | gelb | siehe M5 | → **M5** |
| – | 35 | „Machines play each other too. The crowds come for the humans.“ | These | – | plausibel, nicht gemessen |
| 44 | 35 | „It's why companies still pay for the senior who can tell the difference.“ | grün | wie Nr. 7/8 | – |
| 45 | 35 | „It protects you because the robot isn't in the basement yet.“ | grün | wie Nr. 35/36 | Haushalts-Humanoide nur in Tests. |

**Clips, Karten, Einblendungen**

| Nr. | Stelle | Aussage | Status | Quelle | Anmerkung |
|---|---|---|---|---|---|
| 46 | K1 | Einordnung „The economist who measured it explains it like this.“ | grün | https://digitaleconomy.stanford.edu/news/canariesaug26/ | Brynjolfsson = Hauptautor. Fehlt im Sprechertext (H1). |
| 47 | K1 | Wortlaut 1675,0–1688,2 s | grün | Auto-Untertitel OvFI-V9Zaeo | Sinn im Kontext ±30 s erhalten (Abschnitt 5). |
| 48 | K2 | Einordnung „Even the man who warned the radiologists now has career advice.“ | grün | wie Nr. 21 | Fehlt im Sprechertext (H1). |
| 49 | K2 | Hinton: „a long time before it's as good at physical manipulation … a good bet would be to be a plumber.“ | grün | Auto-Untertitel giT0ytynSqg 3035–3045 s | 16.6.2025 |
| 50 | K2 | „Until the humanoid robots show up.“ als Hinton-Satz | **rot** | https://singjupost.com/transcript-of-godfather-of-ai-i-tried-to-warn-them-but-weve-already-lost-control/ | Bartlett → M4, B1 |
| 51 | K3 | Einordnung „Even Bill Gates expects a bumpy few years.“ | **rot** | https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make · https://fortune.com/2026/08/26/bill-gates-ai-warning-risks-benefit-world-leaders/ | → B2 |
| 52 | K3 | Inhalt des Clips | offen | – | Transkript fehlt (Abschnitt 5) |
| 53 | Karte Platz 6 | Amodei-Wortlaut in Anführungszeichen | gelb | https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic | Axios-Wiedergabe → B3 |
| 54 | Karte (optional) | Hinton 2016 „We should stop training …“ | gelb | wie Nr. 21 | richtig „People should …“ → B5 |
| 55 | Bild Wendung | „record 1,208 residency positions, 2025“ | gelb | Works in Progress · Radiology Business 2025/2026 | Zahl je nach Zählweise → B4 |
| 56 | Bild Hook | „Stanford Digital Economy Lab, Aug. 2026“ | grün | wie Nr. 3 | – |
| 57 | Bild Platz 9 | „Microsoft Research, "Working with AI", 2025“ | grün | wie Nr. 11 | – |
| 58 | Bild Platz 1 | „Chess.com (company figure)“ | grün | wie Nr. 42 | Zahl ergänzen (zitatkarten.md) |

---

## 4. Ampelseite: die heikelsten Aussagen (für den Zweitprüfer)

1. **K2-Nachsatz (Z. 31)** 🔴 behoben (M4, B1). „Until the humanoid robots show up“ ist nach Sprecher-Transkript Bartlett, nicht Hinton. Am Mac bei 50:47 gegenhören. → https://singjupost.com/transcript-of-godfather-of-ai-i-tried-to-warn-them-but-weve-already-lost-control/ und https://www.youtube.com/watch?v=giT0ytynSqg&t=3033
2. **„The machine took the reading of the scan“ (Z. 19)** 🔴 behoben (M2). Radiologen befunden weiter selbst, nur ~48 % nutzen KI überhaupt. → https://www.worksinprogress.news/p/why-ai-isnt-replacing-radiologists
3. **Gates-Einordnung (K3)** 🔴 ersetzt (B2), Clip offen. Gates: „one of the most turbulent times in human history“. → https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make
4. **„They've stopped hiring the junior one“ (Z. 9)** 🟡 behoben (M1). Weniger Einstellungen, nicht null. → https://digitaleconomy.stanford.edu/news/canariesaug26/
5. **Chess.com „more than ten million … every single day“ (Z. 35)** 🟡 behoben (M5). Ø 9,7 Mio. (Q1) und 10,2 Mio. (Q2 2026). → https://www.chess.com/board-reports/2026-q2
6. **Amodei (Z. 27 + Karte)** 🟡 behoben (M3, B3). Mai 2025, Axios-Wiedergabe, kein wörtliches Zitat. → https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic
7. **Radiologie-Rekord (Z. 19 + Bild)** 🟡 Zahl im Bild korrigiert (B4); 2026 erneut Rekord (KANN K3). → https://radiologybusiness.com/topics/healthcare-management/healthcare-staffing/match-day-2026-radiology-programs-offer-more-positions-ever-applicant-pool-declines
8. **„Almost a fifth behind“ (Z. 1)** 🟢 aber leicht falsch zu verstehen: relative Lücke von 19 % zum Pfad weniger exponierter Jobs, kein Verlust von 19 % der Stellen. → https://digitaleconomy.stanford.edu/news/canariesaug26/
9. **Microsoft-Rangliste (Z. 13, 31)** 🟢 aus den Rohdaten nachgerechnet (Übersetzer 1., Baggerführer 785. von 785, Dachdecker 14./16., Pflegehelfer 39./41. von unten). → https://github.com/microsoft/working-with-ai
10. **Challenger „more than twice“ (Z. 13)** 🟢 121.401 (Jan.–Okt. 2026) zu 54.836 (2025); angekündigte Streichungen, Firmenangaben. → https://www.challengergray.com/blog/october-layoffs-at-three-year-low-seasonal-hiring-plans-up-26/

---

## 5. Clips: Ampel, finale Fenster, Einordnung

Kanalregel: grün = offizielle Lab-, Firmen- und Uni-Kanäle · gelb = Podcasts, Konferenzen · rot = TV-Sender (nur Zitatkarte), ebenso jeder Clip mit Musik unter der Stimme.

| Clip | Quelle | Ampel | Finales Fenster | Wortlaut | Einordnung | Urteil |
|---|---|---|---|---|---|---|
| **K1** | Erik Brynjolfsson · Hoover Institution, „Augmentation or Automation: What AI Means for Work“ (Veranstaltung 17.3.2026) · https://www.youtube.com/watch?v=OvFI-V9Zaeo | **grün** (Kanal einer Stanford-Einrichtung, eigene Veranstaltung; Faktenzettel hatte vorsichtig gelb) | **1675,0–1688,2 s (13,2 s)** | „If you looked at the most exposed, uh, occupations and you looked at the ones that, for the young, the youngest age group there, say 22 to, to 26, then you saw a very noticeable decline in employment.“ | „The economist who measured it explains it like this.“ | passt. Das geplante Fenster bis 1690,8 s endete mitten in „about a 20%“ („20%“ endet erst bei ~1691,6 s, der Satz läuft ohne Punkt weiter); bis dorthin wären es 16,6 s. Neues Ende an der Satzgrenze, keine konkurrierende Zahl zum Hook (19 %). Kontext: danach coding ~20 %, Callcenter ~14 %, Ø 11 % (Aug. 2025), „now about 17%“ (März 2026), ältere Coder ohne großen Rückgang. Studie zählt 22–25, er sagt „22 to 26“. |
| **K2** | Geoffrey Hinton · The Diary Of A CEO (16.6.2025) · https://www.youtube.com/watch?v=giT0ytynSqg | **gelb** (Podcast) | **3035,3–3045,0 s (9,7 s)** | „I'd say it's going to be a long time before it's as good at physical manipulation as us. [Bartlett: Okay.] And so, a good bet would be to be a plumber.“ | davor „Even the man who warned the radiologists now has career advice.“ · danach (vo-v4) „Notice the condition. Until the robots get good.“ | passt mit M4. Nur falls Hinton selbst „Until the humanoid robots show up“ sagt (am Mac hören): Ende 3049,4 s (14,1 s). |
| **K3** | Bill Gates · eigener Kanal, „The turbulent era of artificial intelligence is here“ (Aug. 2026, ~1:52) · https://www.youtube.com/watch?v=MLeTQWQiOvg | **grün (vorläufig)**; bei Musikbett unter der Stimme rot → Zitatkarte | **offen** | offen (Transkript kommt vom Mac) | alt „Even Bill Gates expects a bumpy few years.“ trägt nicht → neu „**Even Bill Gates calls this a turbulent era.** Which is exactly why the steps matter.“ (Variante B bei Satz über fehlende Vorbereitung: „Even Bill Gates says the world isn't prepared for this. Which is exactly why your own steps matter.“) | **offen.** Inhalt laut Essay vom 26.8.2026: „one of the most turbulent times in human history“, kein Plan, Einstiegs- und mittlere Jobs am stärksten betroffen, Vorschlag „Human Reserved“-Jobs. Satz wählen, der von Turbulenz oder fehlender Vorbereitung handelt; keinen, der sagt, Lernen allein reiche nicht (widerspräche „the steps matter“). Ersatzkarte in zitatkarten.md. |

**Anteil:** K1 + K2 + K3 (≤10 s) ≈ 33 s ≈ 5,5 % von ~10 Min. (Ziel ≤8 %). Abstände ≥45 s eingehalten. **Fällt K3 weg, sind es nur 2 Clips (Pflicht 3):** Ersatz K4 = Hinton 2016, „Geoff Hinton: On Radiology“, Kanal Creative Destruction Lab (Uni-Lab, grün), 85 s, Satz „People should stop training radiologists now.“ an der Wendung. Video-ID und Wortlaut am Mac prüfen.

---

## 6. Zeitwörter, gegen den Upload geprüft

| Stelle | Wort | Urteil |
|---|---|---|
| Z. 13 | „This year alone … as last year“ | richtig für 2026 (Challenger bis Oktober). Bei Upload ab 2027: „In twenty twenty-six …“. |
| Z. 19 | „last year“ | richtig (Match 2025). KANN K3: „this year“ (Match 2026). Bei Upload ab 2027 prüfen. |
| Z. 19 | „In 2016“ | richtig, absolut |
| Z. 27 | „warns … within five years“ → „has warned …“ | MUSS M3 |
| Z. 35 | „for almost thirty years“ | richtig bis Mai 2027 (1997 + 30) |
| K2 | „now has career advice“ | Juni 2025, vertretbar |

---

## 7. Quellenliste für die YouTube-Beschreibung

```
ORIGINAL FOOTAGE (marked in the film, nothing in it is generated)
• Erik Brynjolfsson, Stanford Digital Economy Lab · Hoover Institution, "Augmentation or Automation: What AI Means for Work" (2026): https://www.youtube.com/watch?v=OvFI-V9Zaeo
• Geoffrey Hinton · The Diary Of A CEO (2025): https://www.youtube.com/watch?v=giT0ytynSqg
• Bill Gates, "The turbulent era of artificial intelligence is here" (2026): https://www.youtube.com/watch?v=MLeTQWQiOvg

SOURCES

Young workers and AI
• Stanford Digital Economy Lab, "Canaries in the Coal Mine?", August 2026 update: https://digitaleconomy.stanford.edu/news/canariesaug26/

Which work AI overlaps with
• Microsoft Research, "Working with AI" (2025): https://arxiv.org/abs/2507.07935 · data: https://github.com/microsoft/working-with-ai
• Anthropic, "Labor market impacts of AI" (2026): https://www.anthropic.com/research/labor-market-impacts
• Challenger, Gray & Christmas, job cuts report, October 2026: https://www.challengergray.com/blog/october-layoffs-at-three-year-low-seasonal-hiring-plans-up-26/
• Dario Amodei to Axios (2025): https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic

Radiologists
• Hinton's 2016 prediction, revisited: https://radiologybusiness.com/topics/artificial-intelligence/ny-times-revisits-nobel-prize-winners-prediction-ai-will-render-radiologists-obsolete
• Works in Progress, "AI isn't replacing radiologists" (2025): https://www.worksinprogress.news/p/why-ai-isnt-replacing-radiologists
• Record residency positions, Match Day 2025 and 2026: https://radiologybusiness.com/topics/healthcare-management/healthcare-staffing/match-day-2025-radiology-programs-offer-more-positions-while-applicant-pool-shrinks · https://radiologybusiness.com/topics/healthcare-management/healthcare-staffing/match-day-2026-radiology-programs-offer-more-positions-ever-applicant-pool-declines

Robots and the trades
• First commercial humanoid deployment, GXO and Agility Robotics (2024): https://agilityrobotics.com/content/gxo-signs-industry-first-multi-year-agreement-with-agility-robotics

Chess
• Deep Blue vs. Kasparov (1997): https://www.chess.com/terms/deep-blue-chess-computer
• Chess.com quarterly report, Q2 2026: https://www.chess.com/board-reports/2026-q2

The turbulent era
• Bill Gates, "The turbulent AI era is here" (2026): https://www.gatesnotes.com/a-turbulent-ai-era-and-critical-choices-to-make

Disclosure: this film was made with Claude, an AI model built by Anthropic. One of the studies in this film is by Anthropic, and one quote is from its CEO, Dario Amodei.
```

Gates-Zeile unter ORIGINAL FOOTAGE nur, wenn K3 als Clip bleibt; die Disclosure-Zeile nach dem Muster früherer Filme (Jakob entscheidet über den genauen Wortlaut).

---

## 8. Offen und gesperrt

1. **K3:** Transkript vom Mac, Satz wählen, Musikbett prüfen, Einordnung A oder B.
2. **K2:** bei 50:47 hören, wer „Until the humanoid robots show up“ sagt (Hinton → Fenster bis 3049,4 s möglich; der VO passt so oder so).
3. **H1:** Einordnungssätze sprechen oder als Bildzeile?
4. **Hinton 2016:** Video „Geoff Hinton: On Radiology“ (Creative Destruction Lab) gegenhören, falls Karte oder Clip K4.
5. **Nicht am Original lesbar** (Werte über Suchauszüge mit je ≥2 Quellen): digitaleconomy.stanford.edu, arxiv.org, challengergray.com, nrmp.org, radiologybusiness.com, worksinprogress.news, axios.com, gatesnotes.com, darioamodei.com, singjupost.com, chess.com, YouTube-Watch-Seite.
