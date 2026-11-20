# Zweitprüfung – 10 Aussagen (unabhängig, gegen Primärquellen)

Stand: 23.10.2026. Andere Faktencheck-Dateien des Projekts wurden nicht gelesen.
Zugang: anthropic.com und microsoft.com direkt gelesen. arxiv, pnas, nature, pmc, metr, worldbank, ft und newyorker sind im Container gesperrt; dort wurde über indexierte Abstract-Auszüge der Primärseiten, SSRN/RePEc/WRAP-Einträge und Uni-/Verlagsseiten geprüft. Das ist jeweils mit „(sekundär)“ markiert.

| # | Aussage | Ampel |
|---|---|---|
| 1 | Türkei / Bastani | GRÜN |
| 2 | Polen / Darmspiegelung | GELB |
| 3 | METR | GRÜN |
| 4 | Go / Shin | GELB (leicht) |
| 5 | Harvard / Kestin | GRÜN (sekundär) |
| 6 | Anthropic / Shen & Tamkin | GRÜN (Zitat-Hinweis) |
| 7 | Nigeria / Weltbank | GRÜN (sekundär) |
| 8 | FT / Burn-Murdoch | GELB |
| 9 | Microsoft/CMU | GRÜN |
| 10 | Ted Chiang | GRÜN (sekundär) |

---

## 1. Türkei (Bastani u. a., PNAS 2025) – GRÜN
**Begründung:** Das Experiment war ein RCT mit knapp 1.000 Schülern an einem türkischen Gymnasium und drei Gruppen: GPT Base, GPT Tutor (dasselbe GPT-4, aber mit Lehrer-Prompts, die Hinweise statt Lösungen geben) und eine Kontrollgruppe ohne Hilfsmittel. Im Test lag GPT Base 17 % hinter der Kontrollgruppe. Laut PNAS-Abstract sind diese negativen Effekte beim Tutor „largely mitigated“, im Working Paper heißt es „essentially eradicated“, und einen Vorteil gab es nicht. „Lost nothing“ ist damit fair.
Den Unterschied „one small difference“ zu nennen, ist knapp formuliert, aber vertretbar, denn es ist dasselbe Modell mit anderen Anweisungen. Gemessen wurde nur kurzfristig.
**Quelle:** https://doi.org/10.1073/pnas.2422633122 · Abstract: https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html · https://papers.ssrn.com/abstract=4895486

## 2. Polen (Budzyń u. a., Lancet Gastroenterol Hepatol 2025) – GELB
**Begründung:** Die Zahlen stimmen: 19 sehr erfahrene Endoskopiker mit jeweils mehr als 2.000 Koloskopien. Die Adenom-Detektionsrate fiel von 28,4 % (226/795) auf 22,4 % (145/648), verglichen wurden je drei Monate vor und nach Einführung der Software.
Entscheidend ist aber, dass beide Werte aus Untersuchungen **ohne** die Software stammen. Der Satz lässt das offen, und ohne diesen Zusatz klingt es, als hätte die Maschine selbst schlechter gefunden. Außerdem ist die Studie retrospektiv und beobachtend, belegt also keine Kausalität.
**Quelle:** https://doi.org/10.1016/S2468-1253(25)00133-5 · https://wrap.warwick.ac.uk/id/eprint/191005 (sekundär für die Einzelzahlen)
**Besser:** "Nineteen very experienced doctors, each with more than two thousand of these exams behind them. Before the machine arrived, they found a growth in about twenty-eight percent of exams. A few months after it arrived, when they worked without it, it was twenty-two."

## 3. METR (Juli 2025) – GRÜN
**Begründung:** Das RCT lief von Februar bis Juni 2025 mit 16 erfahrenen Open-Source-Entwicklern, 246 echten Aufgaben und großen, ausgereiften Repos, die die Teilnehmer gut kannten. Mit den Werkzeugen (Cursor Pro, Claude 3.5/3.7 Sonnet) brauchten sie 19 % länger. Vorher hatten sie 24 % Beschleunigung erwartet, hinterher schätzten sie rund 20 % Beschleunigung. Das „with the tools of that time“ setzt die richtige Grenze.
**Quelle:** https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ (sekundär, Seite gesperrt; Zahlen in allen Auszügen gleich)

## 4. Go (Shin, Kim, van Opheusden, Griffiths, PNAS 2023) – GELB (leicht)
**Begründung:** Die Studie hat 5,8 Mio. Profi-Züge von 1950 bis 2021 mit einer übermenschlichen Go-Software bewertet. Nach dem Auftauchen der Software stieg die Entscheidungsqualität. Neue Züge wurden häufiger und gingen mit besserer Qualität einher.
- „66 years“ stammt aus Scientific American („stayed pretty uniform for 66 years“) und entspricht 1950–2016. Der Abstract selbst nennt 71 Jahre Datensatz.
- „Novel“ heißt im Paper „previously unobserved moves“, also Zugfolgen, die im erfassten Profi-Datensatz noch nie vorkamen. „No human had ever played“ ist eine Zuspitzung.
**Quelle:** https://doi.org/10.1073/pnas.2214840120 · https://www.scientificamerican.com/article/ais-victories-in-go-inspire-better-human-game-playing
**Besser:** "Players started making moves that had never shown up in recorded professional games. And those new moves went hand in hand with better play."

## 5. Harvard (Kestin u. a., Scientific Reports 2025) – GRÜN (sekundär)
**Begründung:** Das RCT im Crossover-Design lief mit 194 Studierenden in Physical Sciences 2 (Herbst 2023). Der Tutor wurde von den Kursdozenten selbst nach Lehr-Best-Practices gebaut und gab keine vollständigen Lösungen preis.
Der Lernzuwachs im Median war mehr als doppelt so groß: Prätest 2,75, Posttest 4,5 mit Tutor gegen 3,5 im Kurs. Der Zeitaufwand lag im Median bei 49 statt 60 Minuten. Verglichen wurde mit einer guten Active-Learning-Stunde, nicht mit Frontalunterricht.
Eine Kritik von 2026 bemängelt ungleiche Fallzahlen in den Posttests (142 gegen 174). Den Satz macht das nicht falsch.
**Quelle:** https://www.nature.com/articles/s41598-025-97652-6 (gesperrt; geprüft über PMC-Eintrag PMC12179260 und Auszüge)

## 6. Anthropic (Shen & Tamkin, 29.01.2026) – GRÜN (Zitat-Hinweis)
**Begründung:** Direkt gelesen. Es waren „52 (mostly junior) software engineers“ in einem RCT. Die Gruppe mit Assistent erreichte im Quiz 50 %, die ohne 67 %.
- „AI delegation“ war das schnellste Muster (19,5 min) und erreichte 39 %. Alle schwachen Muster lagen unter 40 %.
- Die starken Muster erreichten 65 % oder mehr: Conceptual inquiry 65 %, Hybrid 68 %, Generation-then-comprehension 86 %. Alle drei setzen auf Nachfragen und Verstehen, dafür ist „kept asking why“ eine faire Kurzform.
- Das Zitat lautet wörtlich: „Cognitive effort—and even getting painfully stuck—is likely important for fostering mastery.“ Die Paraphrase im Film ist inhaltlich korrekt. Wird es als direktes Zitat gesprochen oder eingeblendet, sollte der Originalwortlaut stehen.
**Quelle:** https://www.anthropic.com/research/AI-assistance-coding-skills

## 7. Nigeria (De Simone u. a., Weltbank PRWP 11125, Pilot Juni/Juli 2024) – GRÜN (sekundär)
**Begründung:** Das RCT lief in Benin City (Edo) mit rund 760 randomisierten Schülern, davon etwa 420 in der Behandlungsgruppe. Es gab sechs Wochen Englisch nach der Schule mit Copilot (GPT-4), angeleitet von geschulten Lehrkräften.
Der Gesamteffekt von 0,31 SD (Englisch, KI-Wissen und digitale Fähigkeiten zusammen) wird von der Weltbank mit 1,5–2 Jahren normaler Schulzeit gleichgesetzt. Die Kontrollgruppe bekam keinen Zusatzunterricht. „Overall“ ist korrekt gewählt, denn der reine Englisch-Effekt ist kleiner (0,23 SD). Es handelt sich um ein Working Paper.
**Quelle:** https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee · https://blogs.worldbank.org/en/education/From-chalkboards-to-chatbots-Transforming-learning-in-Nigeria

## 8. FT (Burn-Murdoch, März 2025) – GELB
**Begründung:** Die Kolumne „Have humans passed peak brain power?“ stützt sich auf PISA (Höchststand 2012, danach Rückgang) und PIAAC (Rückgänge bei Erwachsenen). Burn-Murdoch nennt als Verdacht ausdrücklich den Wechsel zu „infinite, constantly refreshed feeds“. Damit ist „suspects the endless feeds“ fair.
Das Wort „thinking tests“ ist eine Zuspitzung, denn es geht um Schul- und Kompetenztests (Lesen, Mathe, Problemlösen). Außerdem ist die FT-Seite gesperrt und hinter einer Paywall, geprüft wurde nur über Sekundärberichte (Daily Nous, Mediaite, Marginal Revolution).
**Quelle:** https://www.ft.com/content/a8016c64-63b7-458b-a371-e0e1c54a13fc (sekundär)
**Besser:** "Since the early twenty-tens, scores on reading, maths and reasoning tests have slipped in many rich countries. One Financial Times analysis suspects the endless feeds."

## 9. Microsoft/CMU (Lee u. a., CHI 2025) – GRÜN
**Begründung:** Direkt gelesen. Die Studie befragte 319 Wissensarbeiter zu 936 Beispielen. Laut Paper geht „higher confidence in GenAI“ mit „less critical thinking“ einher. „Trusted“ trifft „confidence“, und „said they did“ gibt richtig wieder, dass es um Selbstauskunft und einen Zusammenhang geht, nicht um Ursache.
**Quelle:** https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/

## 10. Ted Chiang (New Yorker, 31.08.2024) – GRÜN (sekundär)
**Begründung:** Der Essay „Why A.I. Isn't Going to Make Art“ enthält nach mehreren Auszügen und einer PDF-Kopie den Satz „Using ChatGPT to complete assignments is like bringing a forklift into the weight room; you will never improve your cognitive fitness that way.“ Chiang wiederholt ihn 2025 im Princeton-Q&A. Die Paraphrase „chatbot for homework“ ist fair. Die New-Yorker-Seite ist gesperrt.
**Quelle:** https://www.newyorker.com/culture/the-weekend-essay/why-ai-isnt-going-to-make-art
