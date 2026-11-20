# 03 · Faktencheck (Stand 2026-10-18)

Geprüft: alle Skriptzeilen zu den ◐-Quellen S6, S7, S8, S9, S13, S14, S15, S16.
Urteil: ✔ stimmt · ⚠ ungenau · ✘ falsch · ? nicht prüfbar

**Methodik / Einschränkung:** In dieser Sitzung blockiert der Netzwerk-Proxy direkte Abrufe (arxiv.org, biorxiv.org, nature.com, cell.com, insilico.com, intuitionlabs.ai, recoverytrial.net, openai.com, pubmed usw.: alle 403/DNS-Fehler). Geprüft wurde deshalb über Websuche: Suchergebnisse mit Auszügen aus den Primärquellen (Preprints, Pressemitteilungen von Imperial/Insilico/RECOVERY, Nature-Korrektur, PRX Energy) und mehrere unabhängige Berichte. Wo nur Sekundärberichte vorlagen, ist das vermerkt. Den Wortlaut im GPT-5-Livestream (S13) und den vollständigen Text der Nature-Korrektur (S14) vor dem Final Cut noch einmal selbst ansehen oder anhören.

---

## Akt 4 · S6 Google AI co-scientist + Penadés (Imperial)

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "In London, a team of scientists spent about a decade on one question …" | Imperial-Pressemitteilung: Thema, über das das Team „for over ten years“ nachgedacht hatte, https://www.imperial.ac.uk/news/261293/googles-ai-co-scientist-could-enhance-research/ ; Penadés gegenüber der BBC: „a decade“ | ✔ | (Hinweis: Die CEU-Universität Valencia nennt „seven years“ Validierungsarbeit, https://medios.uchceu.es/actualidad-ceu/en/professor-jose-r-penades-tests-google-co-scientist-system/. „about a decade“ deckt sich mit Imperial/Penadés selbst und ist vertretbar.) |
| "… how do some superbugs share their defences between species?" | Cell 2025, He, Patkowski … Penadés, „Chimeric infective particles expand species boundaries in phage-inducible chromosomal island mobilization“, Cell 188:6636 (doi 10.1016/j.cell.2025.08.019); Imperial: https://www.imperial.ac.uk/news/articles/medicine/infectious-disease/2025/microbial-piracy-uncovers-new-way-to-fight-drug-resistant-infections/ | ⚠ | Die eigentliche Frage war, wie bestimmte mobile Genelemente (cf-PICIs) zwischen Bakterienarten springen: Sie „borgen“ sich Schwänze fremder Phagen („tail piracy“). Diese Elemente können Resistenz- und Virulenzgene tragen. „share their defences“ ist eine starke Vereinfachung. Vorschlag: „how do some superbugs pass their genes, including drug resistance, to other species?“ |
| "They had found the answer. They hadn't published it yet." | Imperial (s. o.): Ergebnis lag damals vertraulich bei einer Fachzeitschrift zur Begutachtung; Preprint „AI mirrors experimental science to uncover a novel mechanism of gene transfer crucial to bacterial evolution“, bioRxiv 10.1101/2025.02.19.639094 | ✔ | – |
| "Then they gave the same question to an AI system from Google." | bioRxiv 2025.02.19.639094; Google „AI co-scientist“ (Gemini-basiertes Multi-Agenten-System) | ✔ | – |
| "Within two days, its top idea matched theirs." | Penadés (BBC, Feb. 2025): „within 48 hours“; Preprint: die bestplatzierte von fünf Hypothesen deckte sich mit dem experimentellen Befund (cf-PICI-Kapside kapern Phagenschwänze) | ✔ | (Hinweis: Die zwei Tage beziehen sich nur auf den KI-Lauf. Die KI bekam Hintergrundliteratur, keine unveröffentlichten Daten. Zusätzlich lieferte sie vier weitere plausible Hypothesen.) |
| ON SCREEN „Imperial College London + Google, 2025“ | Cell 2025 (beide Arbeiten) | ✔ | – |

## Akt 4 · S7 FutureHouse Robin

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "an AI system called Robin looked at a common cause of blindness in older people." | Ghareeb et al., „Robin: A multi-agent system for automating scientific discovery“, arXiv 2505.13400 (Mai 2025), https://arxiv.org/abs/2505.13400 (Ziel: trockene AMD) | ✔ | – |
| "It suggested an eye drop already sold in Japan for glaucoma." | arXiv 2505.13400: „ripasudil, a ROCK inhibitor approved for treatment of glaucoma in Japan“. Ripasudil wird als 0,4-%-Augentropfen (Glanatec) vertrieben. | ✔ | – |
| "So far, it has only been tested on cells in a dish. It's a lead, not a cure." | arXiv 2505.13400: nur RPE-Zellkultur (Phagozytose-Assay, 7,5-fach in Finch-Analyse, 1,75-fach in menschlicher Analyse); Autoren fordern weitere Dosis-/Zeittests | ✔ | – |
| "But a lead that no human had followed." | arXiv 2505.13400 (Robin schlägt Ripasudil als *neuen* Kandidaten vor); frühere Ripasudil-Studien an RPE-Zellen (Entzündung, BMC Ophthalmol 2020, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7137504/) und bei diabetischem Makulaödem (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6403390/) | ? / ⚠ | Die absolute Aussage „no human had followed“ lässt sich nicht belegen. Ripasudil war an RPE-Zellen und bei Netzhauterkrankungen schon untersucht worden, und Robin selbst testete im ersten Durchgang den ROCK-Hemmer Y-27632. Außerdem haben Menschen die Laborversuche durchgeführt. Vorschlag: „But it was a new lead, and the idea came from a machine.“ oder „A lead nobody had tried for this disease.“ |
| ON SCREEN „FutureHouse, 2025 · cells only“ | arXiv 2505.13400 | ✔ | – |

## Akt 4 · S13 GPT-5 / Altman

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "When OpenAI launched GPT-5, Sam Altman called it a "PhD-level expert" in any area." | Livestream 07.08.2025, laut USA Today: „legitimate Ph.D level expert in any area“; laut PCMag: „now it's like talking to an expert, a legitimate PhD-level expert in anything, in any area you need“; z. B. https://www.aol.com/openai-unveils-chat-gpt-5-000752084.html | ✔ | Der Wortlaut „PhD-level expert“ und „in any area“ ist belegt. Streng genommen sagte Altman, es fühle sich *an wie* ein Gespräch mit einem solchen Experten. Optional genauer: „Sam Altman said it was like talking to a "PhD-level expert" in any area.“ Den Livestream selbst konnte ich nicht abrufen, die Formulierung ist aber in mehreren unabhängigen Berichten gleich. |
| ON SCREEN „GPT-5 launch, Aug 2025“ | s. o. | ✔ | – |

## Akt 6 · S8 Rentosertib (Insilico)

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "One, for a disease that scars the lungs, is now in its final stage of human testing." | Insilico-Pressemitteilung 09./10.09.2026 „Insilico Medicine doses first patient in GENESIS-IPF-3“, https://insilico.com/news/isn1009261-insilico-medicine-doses-first-patient-genesis-ipf-3 ; Bericht: https://www.news-medical.net/news/20260910/Generative-AI-driven-drug-Rentosertib-enters-Phase-III-trial-for-idiopathic-pulmonary-fibrosis.aspx | ✔ | IPF ist eine Lungenfibrose, Phase III ist die letzte Stufe vor der Zulassung. (Kontext: 320 Patienten an 47 Zentren, nur in China, NCT07687459. Ergebnisse frühestens nach 52 Wochen, Zulassung laut Insilico frühestens in 3–4 Jahren.) |
| ON SCREEN „Rentosertib (Insilico Medicine) · Phase III since July 2026“ | wie oben | ⚠ | Laut Insilico wurde der erste Patient am **9. September 2026** behandelt. Das Datum „7. Juli 2026“ steht nur bei IntuitionLabs und anderen Sekundärquellen und ist nicht als Studienstart belegt (vermutlich Registrierung/Genehmigung). Vorschlag: „Rentosertib (Insilico Medicine) · Phase III since Sept 2026“. |

## Akt 6 · S9 KI-Medikamente in Studien / Zulassungen

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "More than a hundred and seventy are in trials." | IntuitionLabs (Juli 2026), https://intuitionlabs.ai/articles/ai-discovered-drugs-clinical-trials-2026 | ⚠ | Die Zahl „173“ ist **keine** eigene IntuitionLabs-Zählung. IntuitionLabs zitiert damit den Branchendienst Medspark und warnt ausdrücklich, sie sei „not authoritative“. Die von IntuitionLabs genannte peer-reviewte ASCO-2026-Analyse zählt **117** KI-gestützte Wirkstoffe von 63 Firmen in interventionellen Humanstudien. Vorschlag: „More than a hundred are now being tested in people.“ ON SCREEN: „100+ AI-discovered drugs in human trials · 0 approved“. |
| "As of this spring, not one had been approved." | IntuitionLabs „AI Drug Discovery FDA Approvals: The 2026 Reality Check“, https://intuitionlabs.ai/articles/ai-drug-discovery-fda-approvals ; Stand Juli–Okt. 2026: keine Zulassung | ✔ | Stimmt, und es gilt auch noch im Oktober 2026. Vorschlag für mehr Aktualität: „So far, not one has been approved.“ **Achtung:** Für zasocitinib (Takeda/Nimbus) hat die FDA eine Priority Review mit Entscheidung im 1. Quartal 2027 angenommen. Ob es als „KI-entworfen“ gilt, ist umstritten. Bei Veröffentlichung nach Anfang 2027 neu prüfen. ON SCREEN „(March 2026)“ ggf. auf „(Oct 2026)“ ändern. |

## Akt 9 · S14 A-Lab Berkeley

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "In twenty twenty-three, a lab at Berkeley ran itself. Robots mixed powders, heated them, measured the result, and an AI chose the next try." | Szymanski et al., Nature 624, 86–91 (2023), https://www.nature.com/articles/s41586-023-06734-w (Festkörpersynthese aus Pulvern, Ofen, Röntgendiffraktion mit ML-Auswertung, Active Learning) | ✔ | – |
| "In a little over two weeks, it made dozens of materials it had never made before." | Nature 2023: 41 von 58 Zielverbindungen in 17 Tagen; Author Correction, Nature 650, E1 (19.01.2026), https://www.nature.com/articles/s41586-025-09992-y | ✔ | Die Formulierung „never made before“ (also neu für das Labor) passt sogar genau zur Korrektur: Die Autoren schreiben jetzt, die Materialien seien „new to the prediction platform, not necessarily new to science“. |
| "Other scientists later questioned how many were truly new." | Leeman, Liu, Stiles, Lee, Bhatt, Schoop, Palgrave, „Challenges in High-Throughput Inorganic Materials Prediction and Autonomous Synthesis“, PRX Energy 3, 011002 (2024), https://par.nsf.gov/biblio/10532478 | ✔ | Die Kritik geht weiter als „how many“. Leeman et al. kommen zu dem Schluss, dass von den beanspruchten neuen Materialien praktisch keines wirklich neu war. Danach korrigierten die Autoren selbst ihr Paper (Jan. 2026, der Titel lautet jetzt „… synthesis of inorganic materials“). Vorschlag: „Other scientists later showed that few, if any, were truly new to science, and the team corrected its paper.“ |
| ON SCREEN „A-Lab, Berkeley · Nature 2023 · 41 materials in 17 days“ | s. o. | ⚠ | „41 materials“ ist der ursprüngliche, inzwischen korrigierte Anspruch. Nach der Korrektur wurden laut Nachauswertung nur 36 Fälle richtig erkannt. Diese Zahl stammt aus einem Auszug und konnte nicht vollständig geprüft werden. Vorschlag: „A-Lab, Berkeley · Nature 2023, corrected 2026 · 17 days, no humans at the bench“ oder „… · ~40 compounds in 17 days (novelty disputed)“. |

## Akt 9 · S15 RECOVERY / Dexamethason

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "In March twenty twenty, British doctors set up one trial across many hospitals, testing several treatments at once." | RECOVERY: Protokoll 10.03.2020, erster Patient 19.03.2020; Plattformstudie mit mehreren Armen, 170+ NHS-Kliniken; https://www.recoverytrial.net/news/low-cost-dexamethasone-reduces-death-by-up-to-one-third-in-hospitalised-patients-with-severe-respiratory-complications-of-covid-19 | ✔ | – |
| "Within about a hundred days, it showed that a cheap steroid saved lives." | wie oben: Ergebnis am 16.06.2020 verkündet, 89 Tage nach dem ersten Patienten; Preprint medRxiv 22.06.2020; NEJM online 17.07.2020 | ✔ | – |
| "Among the sickest patients on ventilators, it cut deaths by about a third." | RECOVERY-Mitteilung 16.06.2020: Rate Ratio 0,65 (95 % KI 0,48–0,88) bei Beatmeten; NEJM 2021;384:693: 0,64 | ✔ | – |
| ON SCREEN „RECOVERY trial, UK · 2020“ | s. o. | ✔ | (sources.md: NEJM-Artikel online seit 17.07.2020, Druckausgabe 2021) |

## Akt 9 · S16 Impfstoffe 2020

| Behauptung (Skript) | Quelle | Urteil | Korrekturvorschlag |
|---|---|---|---|
| "The vaccines that year worked the same way." | s. u. | ✔ (leicht) | Gemeint ist „schnell, ohne Schritte auszulassen“. Der Mechanismus war ein anderer (überlappende Phasen statt Plattformstudie). Wer es genauer will: „The vaccines that year were fast for a similar reason.“ |
| "They didn't skip the steps. They ran them side by side, with the money committed up front …" | Operation Warp Speed (US-Regierung 2020): „conducting steps concurrently that normally would be conducted sequentially“, Staat trägt das Finanzrisiko, z. B. https://www.315aw.afrc.af.mil/News/Article/2222698/operation-warp-speed-accelerates-covid-19-vaccine-development ; belgische Arzneimittelbehörde FAMHP: Phasen parallel, Risiko durch EU-Vorabfinanzierung geteilt, https://www.afmps.be/en/human_use/medicines/medicines/covid_19/vaccines | ✔ | – |
| "… and regulators reading the data as it arrived." | EMA: Rolling Review BNT162b2 ab 06.10.2020; MHRA: Rolling Review ab Okt. 2020, Zulassung 02.12.2020, https://gov.uk/government/news/june-raine-how-we-backed-a-covid-19-vaccine-before-rest-of-the-west | ✔ | – |
| ON SCREEN „COVID vaccines: sequence Jan 2020 → authorised Dec 2020“ | Sequenz veröffentlicht 10./11.01.2020; erste Zulassung UK 02.12.2020, FDA-EUA 11.12.2020 | ✔ | – |

---

## Zusammenfassung der Korrekturvorschläge (Skript nicht verändert)

1. **Akt 4:** „share their defences between species“ → „pass their genes, including drug resistance, to other species“ (⚠)
2. **Akt 4:** „But a lead that no human had followed.“ → „But it was a new lead, and the idea came from a machine.“ (? nicht belegbar)
3. **Akt 6 ON SCREEN:** „Phase III since July 2026“ → „Phase III since Sept 2026“ (⚠)
4. **Akt 6:** „More than a hundred and seventy are in trials.“ → „More than a hundred are now being tested in people.“; ON SCREEN „170+“ → „100+“ (⚠, Zahl je nach Zählweise 117–173)
5. **Akt 6 (optional):** „As of this spring, not one had been approved.“ → „So far, not one has been approved.“ (vor Veröffentlichung nach 01/2027 wegen zasocitinib neu prüfen)
6. **Akt 9 (optional, schärfer):** „Other scientists later questioned how many were truly new.“ → „… later showed that few, if any, were truly new to science, and the team corrected its paper.“
7. **Akt 9 ON SCREEN:** „41 materials in 17 days“ → Hinweis „corrected 2026“ oder „novelty disputed“ (⚠)
8. **Akt 4 (optional):** Altman „called it“ → „said it was like talking to“ einem „PhD-level expert“
