# Faktencheck · „How Superintelligence Will Make You Smarter“ (vo-v3.txt)

Stand: 23.10.2026 · geprüft gegen den geplanten Upload im Oktober 2026 · Zeilennummern = vo-v3.txt

**Zugang zu den Quellen.** Der Container erreicht pnas.org, nature.com, thelancet.com, metr.org, arxiv.org, newyorker.com, worldbank.org, openai.com, PMC, SSRN und Gutenberg nicht. Direkt abgerufen habe ich nur die Anthropic-Seite. Alles andere habe ich über Suchtreffer der Primärseiten geprüft, also Abstract- und Textausschnitte aus PNAS, Lancet, Nature/PMC, help.openai.com, METR und der Weltbank. Dazu kamen Pressemitteilungen und Fachpresse, die ich jeweils kennzeichne. Wo ich nur Sekundärquellen hatte, steht **[sekundär]**.

**Ergebnis:** 59 geprüfte Aussagen. **47 ok · 7 überzogen · 2 falsch · 3 unbelegt.** Die unbelegten Aussagen sind Deutungen, die schon mit „it seems“ abgeschwächt sind. Zwingend zu ändern sind 8 Stellen (Abschnitt 1).

---

## 1) Muss geändert werden

| Zeile | Originalsatz | Problem | Ersatzsatz (gesprochen) |
|---|---|---|---|
| 3 | In Turkey, almost a thousand students practiced math with artificial intelligence. | Nur zwei der drei Gruppen hatten die Maschine. Rund ein Drittel der knapp 1.000 Schüler übte ohne. Das widerspricht direkt Zeile 5 („A third group had none“). | In Turkey, almost a thousand high school students took part in a math experiment. |
| 19 | For sixty-six years, the best Go players in the world barely got better. Then a machine beat one of them. | Shin u. a. werten 5,8 Mio. Züge **aller Profis** von 1950 bis 2021 aus, nicht nur die der Weltspitze. Mit „the best“ wird die Studie falsch wiedergegeben. | Here's a first clue. For sixty-six years, professional Go players barely got better. Then a machine beat one of the very best. And suddenly, humans got better. |
| 51 + 55 | A research lab asked sixteen experienced programmers to do real work on their own projects. … It made them slower. They took nineteen percent longer. | Ohne Zeitangabe klingt das wie ein aktueller Befund. Die Studie lief Feb.–Juni 2025 mit Werkzeugen von Anfang 2025. METR schrieb am 24.02.2026 selbst, Entwickler würden Anfang 2026 wahrscheinlich stärker beschleunigt als 2025. Die neuen Daten seien aber wegen Selbstselektion unzuverlässig. „Their own projects“ ist ungenau: Es waren große Open-Source-Projekte, an denen die Leute seit Jahren mitarbeiten. | Z. 51: In early twenty twenty-five, a research lab asked sixteen experienced programmers to do real work on projects they knew inside out. Sometimes with artificial intelligence, sometimes without. · Z. 55: With the tools of that time, it made them slower. They took nineteen percent longer. |
| 101 | Researchers built a tutor with one strict rule. It never gave the answer. | Der Harvard-Tutor folgte **mehreren** Regeln guten Unterrichts: aktiv einbinden, Stoff dosieren, Schritt für Schritt führen, Feedback auf Basis hinterlegter Musterlösungen, eigenes Tempo, Growth Mindset. Er sollte die Lösung nicht vorwegnehmen. „One strict rule“ und „never“ sind zugespitzt. | Researchers built a tutor that followed the rules of good teaching. Above all, it didn't just hand over the answer. It asked questions, and led students one step at a time. |
| 119–121 | Fifty-two mostly young programmers learned a new coding tool, with a machine to help. On average, they scored worse on a test afterwards. | **Falsch.** Die Studie war randomisiert, und nur etwa die Hälfte hatte die Maschine. Die andere Hälfte schrieb den Code von Hand. Der Satz klingt, als hätten alle 52 Hilfe gehabt und danach schlechter abgeschnitten, aber verglichen mit niemandem. Anthropic schreibt „mostly junior“, gemeint ist die Berufserfahrung, nicht das Alter. Das „Tool“ war eine Python-Bibliothek (Trio). | Fifty-two programmers, most of them early in their careers, learned a new coding library. Half of them had a machine to help. That half scored worse on a test afterwards. |
| 123 | Those who let it do the work finished fastest, and learned the least. Under forty percent. | **„Learned the least“ ist falsch.** Wer alles delegierte (n = 4), kam auf 39 %. Zwei andere Muster lagen darunter: „progressive reliance“ mit 35 % und „iterative AI debugging“ mit 24 %. „Finished fastest“ stimmt: etwa 19,5 Minuten, das schnellste Muster überhaupt, auch schneller als die Kontrollgruppe mit etwa 25 Minuten. | Those who just let it write the code finished fastest. But they scored under forty percent. |
| 157 | The World Bank compared their progress to almost two years of normal learning. | Das Working Paper 11125 nennt „**1.5 to 2 years** of business-as-usual schooling“. Diese Umrechnung beruht auf dem Gesamteffekt von 0,31 SD. Der Test deckte Englisch, Wissen über künstliche Intelligenz und digitale Fähigkeiten ab. Nur für Englisch lag der Effekt bei 0,23 SD. „Almost two years“ nimmt das obere Ende der Spanne. | The World Bank compared the gains to one and a half to two years of normal schooling. |
| 209 | Pilots still land by hand in the simulator. | Irreführend. Der Satz klingt, als landeten Piloten nur noch im Simulator von Hand. In Wirklichkeit fliegen Linienpiloten die große Mehrheit der Landungen von Hand; Autoland wird vor allem bei schlechter Sicht genutzt, nach Branchenangaben bei unter einem Prozent der Landungen [sekundär]. Belegt ist dagegen, dass Behörden das Handfliegen im Simulator und im Linienbetrieb ausdrücklich verlangen: FAA SAFO 13002/17007, EASA SIB 2013-05. | Pilots still practice flying by hand, in the simulator and in the air, even though the autopilot could do most of it. Doctors could train the same way. |

---

## 2) Kann bleiben, aber Hinweis

| Zeile | Satz (kurz) | Hinweis |
|---|---|---|
| 5 / 109 | „one small difference“ / „Hints. Never answers.“ | Beide Gruppen nutzten GPT-4. Der GPT Tutor bekam einen Prompt mit Hinweisen der Lehrkräfte und den richtigen Lösungen und sollte die Lösung nicht vorwegnehmen. „Small difference“ passt als Bild. „Never“ ist streng, „Hints, not answers“ wäre genauer. |
| 13 / 107 / 207 | „The other lost nothing.“ · „the danger … was a machine without guardrails“ | Stimmt, das Prüfungsergebnis der Tutor-Gruppe war statistisch nicht von der Kontrollgruppe zu unterscheiden. Laut PNAS-Paper gab es aber **auch keinen Gewinn** gegenüber den Schülern ohne Maschine. „Schools can choose tutors over bans“ (Z. 207) stützt also eher Harvard als die Türkei. Optional ergänzen: „It didn't gain anything either. But it didn't hurt.“ |
| 27 | GPS, „one small study suggests“ | Dahmani & Bohbot 2020: Querschnitt mit 50 Fahrern, Längsschnitt mit nur 13 Personen nach drei Jahren. Gemessen wurde das räumliche Gedächtnis in einer virtuellen Navigationsaufgabe, das Ergebnis ist eine Korrelation. „Small study“ und „suggests“ sind passend vorsichtig. |
| 31 | „a machine that marks tiny growths that can turn into cancer“ | Passt. Das CADe-System markiert Polypen, gemessen wurde die Adenom-Detektionsrate. Adenome sind Krebsvorstufen. |
| 39 | „A few months later“ | Verglichen wurden je drei Monate vor und nach der Einführung Ende 2021. Die Formulierung ist korrekt. |
| 41–43 | „It's a signal, not proof.“ · „What you stop doing, you start to lose.“ | Die Ärzte haben nicht aufgehört zu untersuchen, sie haben sich auf die Maschine verlassen. Die Studie ist beobachtend und retrospektiv. Kritiker nennen unterschiedliche Patientengruppen vor und nach der Einführung und fehlende Rückzugszeiten. Ein Leserbrief von 2026 (Thieme) fand keine Dequalifizierung. Die Kernaussage „signal, not proof“ ist deshalb wichtig und muss bleiben. |
| 61 | Umfrage: „trusted the machine“ ↔ „less critical thinking they said they did“ | Lee u. a., CHI 2025, 319 Wissensarbeiter, 936 Beispiele. Im Paper heißt es „confidence in GenAI“, „trusted“ ist eine faire Übersetzung. Es ist eine Korrelation aus Selbstauskunft. „Adds a reason“ klingt leicht kausal, „adds a clue“ wäre vorsichtiger. |
| 63–65 | Ted Chiang, Gabelstapler | Quelle: The New Yorker, „Why A.I. Isn't Going to Make Art“, 31.08.2024. Wortlaut: *„Using ChatGPT to complete assignments is like bringing a forklift into the weight room; you will never improve your cognitive fitness that way.“* Er sagte **„assignments“**, nicht „homework“. Im Off ist das als Umschreibung mit „he says“ in Ordnung. Auf einer Zitatkarte muss der genaue Wortlaut stehen. Z. 65 („The weights go up … arms stay the same“) ist die Weiterführung des Films, nicht Chiang, und darf nicht als sein Zitat erscheinen. Die Wortlaut-Prüfung lief über Zitate mit Datum 1.9.2024 [sekundär], newyorker.com war gesperrt. |
| 77–79 | „For sixty-six years, the line was flat. Then the machine won. And the line went up.“ | Shin u. a., PNAS 2023: Der Decision Quality Index bleibt von 1950 bis Mitte der 2010er praktisch unverändert und steigt nach 2016 deutlich. „Flat“ ist eine Vereinfachung, „almost flat“ wäre exakter. Den stärksten Anstieg zeigen die Jahre nach 2016/17, nicht der Tag des Matches. |
| 83–85 | „And it made them better.“ | Die Studie ist korrelativ, sie wertet eine Zeitreihe aus. Z. 85 („shows that it happened, not exactly why“) fängt das ab, deshalb kann der Satz bleiben. |
| 93 / 189 | „They studied it.“ · „It seems that's what the Go players did.“ | **Unbelegt durch Shin u. a.** Die Studie misst nicht, wie die Profis die Maschine genutzt haben. Dass Profis mit KI-Programmen trainieren, ist breit berichtet, etwa für die koreanische Go-Szene, steht aber nicht im Paper. „It seems“ muss bleiben. Außerdem dürfen Profis im Turnier ohnehin keine Maschine nutzen, das Bild „didn't let it play for them“ ist also schief. |
| 95 | „They let it do the looking.“ | Deutung. Das System ist als zweiter Beobachter gedacht, die Ärzte schauen weiter selbst. Vorschlag: „They let it help with the looking. And maybe they stopped looking as hard.“ |
| 103–105 | Harvard: „about twice as much. In less time.“ · „The teachers built the tutor themselves.“ | Kestin u. a., Sci. Rep. 2025: 194 Studierende, randomisierter Crossover über zwei Lektionen. Der mediane Lernzuwachs war mehr als doppelt so groß, die Lernzeit lag im Median bei 49 Minuten, also kürzer als die Unterrichtsstunde. Verglichen wurde mit Active-Learning-Unterricht durch erfahrene Dozenten. Die Kursleitung baute den Tutor selbst. Die Studie ist kurz, Behalten und Transfer wurden nicht gemessen. „One strong case, not the last word“ passt. |
| 111 | Titel der Studie | Genauer Titel: „Generative AI without guardrails can harm learning: Evidence from high school mathematics“ (PNAS 122(26), 2025). Die Umschreibung „this kind of machine“ ist in Ordnung. |
| 117–129 | Anthropic-Studie | Offenlegung als Hersteller ✓. Es ist ein **Preprint** (arXiv 2601.20245, Jan. 2026, nicht begutachtet), die Autoren kommen aus dem Anthropic Fellows Program. Die Muster-Analyse ist qualitativ, n = 2 bis 7 pro Muster, und laut Autoren nicht kausal. Z. 125: „65 percent or more“ sind Gruppen-**Durchschnitte** (65 / 68 / 86 %), keine Einzelwerte. „Kept asking why“ trifft die drei Muster grob: konzeptuelle Fragen, Code mit Erklärung, Rückfragen nach dem Generieren. Zitat korrekt: „Cognitive effort—and even getting painfully stuck—is likely important for fostering mastery.“ Die Umschreibung in Z. 129 ist in Ordnung. |
| 149–151 | Denktests seit Anfang der 2010er · FT vermutet Feeds | John Burn-Murdoch, FT, 14.03.2025, „Have humans passed peak brain power?“. Er wertet PISA, PIAAC und Monitoring the Future aus. Seine These: Schuld sei nicht das Smartphone an sich, sondern der Wechsel zu endlosen Feeds und Benachrichtigungen. Das ist eine Deutung und umstritten. Mit „suspects“ und „If that's right“ ist der Satz ausreichend vorsichtig. „We've lived through this once already“ setzt die Deutung schon voraus, besser wäre „We may have lived through this once already.“ |
| 155 | Nigeria: „from an artificial intelligence tutor“ | Genutzt wurde Microsoft Copilot (GPT-4), ein allgemeiner Chatbot. Lehrkräfte führten jede Sitzung an, zweimal pro Woche, Juni–Juli 2024, Bundesstaat Edo, etwa 800 Schüler randomisiert. „Hundreds“ ✓, „six weeks“ ✓, „after school“ ✓, „teachers right beside them“ ✓. |
| 159 | „A small pilot … the teachers mattered a lot“ | Rund 800 Schüler sind für ein Pilotprojekt nicht klein, „short“ trifft es besser als „small“. Dass die Lehrkräfte wichtig waren, ist eine Einschätzung der Weltbank und von Experten, gemessen wurde es nicht. Vorschlag: „A short pilot. The comparison group got no extra lessons, and the teachers likely mattered a lot.“ |
| 163 | Tutor für jedes Kind „could cost almost nothing“ | Projektion. „Could“ trägt den Satz. Geräte, Strom und Internet kosten aber weiter Geld. |
| 193 | „Directions. … Let it carry those.“ | Kein Faktenfehler, aber ein innerer Widerspruch: Z. 27 warnt genau davor, dass GPS die innere Karte verblassen lässt. Entweder bewusst so stehen lassen („Directions, if you don't care about the map in your head“) oder ein anderes Beispiel wählen. |
| 197 | Phaidros, „a king warns“ | Das stimmt. Sokrates erzählt die Geschichte, Thamus, König von Ägypten, antwortet dem Erfinder Theuth. Jowett: *„this discovery of yours will create forgetfulness in the learners' souls, because they will not use their memories“*. |
| 203 | Lernmodi „guide instead of answer“ · „you have to go looking for them“ | Die Lernmodi gibt es seit 2025: ChatGPT Study Mode (29.07.2025), Claude „Learning“ (Education seit April 2025, für alle ab Aug. 2025) und Gemini Guided Learning (Aug. 2025 [sekundär]). **Stand Okt. 2026:** Standardmäßig sind sie weiterhin aus. Bei OpenAI können Eltern verknüpfter Teen-Konten den Study Mode aber seit Juli 2026 als Standard für neue Chats einstellen. Mit „ChatGPT for Teens“ (18.08.2026) kamen „Study Hours“ dazu. Laut Hilfeseite sind beide Einstellungen ab Werk deaktiviert. Der Satz bleibt im Kern richtig. Präziser: „But they're usually switched off until someone turns them on.“ |
| 17 | „In the next ten minutes“ | Der Text hat 1.529 Wörter, das sind bei normalem Sprechtempo etwa 10 bis 11 Minuten. ✓ |

---

## 3) Vollständige Claim-Tabelle

| # | Zeile | Claim | Urteil | Primärquelle |
|---|---|---|---|---|
| 1 | 3 | Fast 1.000 Schüler in der Türkei übten Mathe mit Maschine | **überzogen** (Zahl stimmt, aber ein Drittel übte ohne Maschine) | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 2 | 5 | Zwei Gruppen mit gleicher Maschine und kleinem Unterschied, dritte ohne | ok | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 3 | 7 | Beim Üben „flogen“ beide Gruppen (+48 % / +127 %) | ok | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 4 | 9 | Prüfung ohne Maschine | ok | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 5 | 11 | Eine Gruppe schlechter als ohne Maschine (−17 %) | ok | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 6 | 13 | Tutor-Gruppe „lost nothing“ | ok (auch kein Gewinn) | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 7 | 17 | „next ten minutes“ | ok | vo-v3.txt (1.529 Wörter) |
| 8 | 19 | 66 Jahre lang wurden „the best Go players“ kaum besser | **überzogen** (alle Profis, nicht die Besten) | https://www.pnas.org/doi/10.1073/pnas.2214840120 |
| 9 | 19 | Danach wurden Menschen plötzlich besser | ok | https://www.pnas.org/doi/10.1073/pnas.2214840120 |
| 10 | 27 | GPS lässt die innere Karte verblassen, „one small study“ | ok | https://www.nature.com/articles/s41598-020-62877-0 |
| 11 | 31 | Polen, 19 sehr erfahrene Ärzte, Maschine markiert Krebsvorstufen | ok | https://www.thelancet.com/journals/langas/article/PIIS2468-1253(25)00133-5/abstract |
| 12 | 33 | Jeder hatte über 2.000 Untersuchungen gemacht | ok | ebd. |
| 13 | 35 | Ausgewertet wurden Untersuchungen ohne Maschine | ok | ebd. |
| 14 | 37 | Vorher etwa 28 % | ok (28,4 %) | ebd. |
| 15 | 39 | „A few months later“ 22 % | ok (22,4 %, Vergleich je drei Monate vor/nach) | ebd. |
| 16 | 41 | „signal, not proof“ | ok | ebd. |
| 17 | 43 | „What you stop doing, you start to lose. Even as an expert.“ | ok (Deutung) | ebd. |
| 18 | 51 | METR: 16 erfahrene Programmierer, echte Aufgaben, randomisiert mit/ohne | ok | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ [sekundär geprüft] |
| 19 | 51 | „their own projects“ | ok (ungenau: Projekte, an denen sie lange mitarbeiten) | ebd. |
| 20 | 53 | Vorher erwarteten sie, schneller zu sein (+24 %) | ok | ebd. |
| 21 | 55 | 19 % länger, ohne Zeitangabe | **überzogen** (Stand Anfang 2025, METR-Update 2026) | ebd. + https://metr.org/blog/2026-02-24-uplift-update/ |
| 22 | 57 | Hinterher glaubten sie, schneller gewesen zu sein (+20 %) | ok | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ |
| 23 | 61 | „One small study“ | ok | ebd. |
| 24 | 61 | Umfrage: mehr Vertrauen in die Maschine, weniger selbstberichtetes kritisches Denken | ok | https://doi.org/10.1145/3706598.3713778 |
| 25 | 63 | Chiang: Chatbot für Hausaufgaben ist wie ein Gabelstapler im Kraftraum | ok (Original: „assignments“) | https://www.newyorker.com/culture/the-weekend-essay/why-ai-isnt-going-to-make-art |
| 26 | 73 | 2016 schlug AlphaGo Lee Sedol, einen der Besten | ok (März 2016, 4:1) | https://deepmind.google/research/breakthroughs/alphago/ |
| 27 | 75 | Maschine bewertet Profi-Züge zurück bis 1950 | ok (5,8 Mio. Züge, 1950–2021, KataGo) | https://www.pnas.org/doi/10.1073/pnas.2214840120 |
| 28 | 77 | 66 Jahre flach | ok (vereinfacht) | ebd. |
| 29 | 79 | Danach stieg die Linie | ok | ebd. |
| 30 | 81 | Neue Züge, verbunden mit besserem Spiel | ok | ebd. |
| 31 | 83 | „it made them better“ | **überzogen** (kausal; durch Z. 85 abgefedert) | ebd. |
| 32 | 87 | Go-Spieler „better than ever“ | ok | ebd. |
| 33 | 93 | „They studied it.“ | **unbelegt** (Deutung, „it seems“) | – |
| 34 | 95 | Ärzte „let it do the looking“ | **unbelegt** (Deutung) | https://www.thelancet.com/journals/langas/article/PIIS2468-1253(25)00133-5/abstract |
| 35 | 101 | Tutor mit „one strict rule“, „never gave the answer“ | **überzogen** | https://www.nature.com/articles/s41598-025-97652-6 |
| 36 | 101 | Stellte Fragen, führte Schritt für Schritt | ok | ebd. |
| 37 | 103 | Vergleich mit sehr gutem Unterricht durch erfahrene Dozenten, etwa doppelt so viel gelernt, in kürzerer Zeit | ok | ebd. |
| 38 | 105 | Dozenten bauten den Tutor selbst | ok | ebd. |
| 39 | 109 | Türkei-Tutor: Hinweise statt Antworten | ok („never“ streng) | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 40 | 111 | Studientitel „without guardrails … can harm learning“ | ok | ebd. |
| 41 | 117 | Anthropic, Hersteller von Claude, hat das untersucht | ok | https://www.anthropic.com/research/AI-assistance-coding-skills |
| 42 | 119 | 52 „mostly young“ Programmierer, alle „with a machine to help“ | **falsch** (nur die Hälfte hatte Hilfe; „junior“ statt jung) | ebd. + https://arxiv.org/abs/2601.20245 |
| 43 | 121 | Im Schnitt schlechter im Test | ok, wenn klar ist: gegenüber der Hand-Gruppe (50 vs. 67 %) | ebd. |
| 44 | 123 | Delegierer am schnellsten, unter 40 % | ok (19,5 Min., schneller als die Kontrollgruppe; 39 %) | ebd. |
| 45 | 123 | Delegierer „learned the least“ | **falsch** (24 % und 35 % bei anderen Mustern) | ebd. |
| 46 | 125 | „Kept asking why“: 65 % oder mehr | ok (Gruppendurchschnitte 65/68/86 %) | ebd. |
| 47 | 129 | Kleine Gruppen; Zitat „getting painfully stuck“ | ok | ebd. |
| 48 | 149 | Denktests seit Anfang der 2010er in vielen Ländern gesunken | ok (laut FT-Auswertung) | FT, 14.03.2025, „Have humans passed peak brain power?“ (ft.com, Paywall) |
| 49 | 151 | FT vermutet endlose Feeds | ok | ebd. |
| 50 | 155 | Nigeria: Hunderte Schüler, sechs Wochen Englisch, nach der Schule, Lehrer dabei | ok | https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee |
| 51 | 157 | „almost two years of normal learning“ | **überzogen** (1,5–2 Jahre, Gesamttest) | ebd. + https://blogs.worldbank.org/en/education/From-chalkboards-to-chatbots-Transforming-learning-in-Nigeria |
| 52 | 159 | Vergleichsgruppe ohne Extra-Unterricht; Lehrer wichtig | ok (Lehrer-Rolle nicht gemessen) | ebd. |
| 53 | 163 | Tutor für jedes Kind „could cost almost nothing“ | ok (Projektion) | – |
| 54 | 189 | Go-Spieler fragten „warum“ | **unbelegt** (Deutung, „it seems“) | – |
| 55 | 197 | Phaidros: ein König warnt vor „forgetfulness in the learners' souls“ | ok (Thamus; Jowett) | https://www.gutenberg.org/ebooks/1636 |
| 56 | 203 | Große Hersteller bieten Lernmodi, die führen statt antworten | ok | https://openai.com/index/chatgpt-study-mode/ · Claude „Learning“: Anthropic-Ankündigung Aug. 2025 (geprüft über Engadget/Tom's Guide [sekundär]) · Gemini Guided Learning: blog.google, Aug. 2025 (nicht abgerufen, URL vor Veröffentlichung prüfen) |
| 57 | 203 | „you have to go looking for them“ | ok (Standard aus; bei OpenAI ab 2026 Teen- und Eltern-Optionen) | https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt · https://openai.com/index/chatgpt-for-teens/ |
| 58 | 207 | Türkei: Gefahr ist die Maschine ohne Leitplanken | ok | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 59 | 209 | „Pilots still land by hand in the simulator.“ | **überzogen/irreführend** | https://www.faa.gov/other_visit/aviation_industry/airline_operators/airline_safety/safo (SAFO 13002/17007) · https://ad.easa.europa.eu/blob/SIB_201305_Manual_Flight_Training_and_Operations.pdf/SIB_2013-05_1 |

**Summe: 59 Aussagen. 47 ok, 7 überzogen (1, 8, 21, 31, 35, 51, 59), 2 falsch (42, 45), 3 unbelegt (33, 34, 54).** Nr. 31 kann bleiben, weil Z. 85 sie abfedert. Alle anderen überzogenen und falschen Aussagen stehen in Abschnitt 1. Meinungs- und Ausblicksätze ohne Faktenkern (Z. 145–147, 169–175, 199, 213–217) sind nicht gezählt.

*Hinweis zu den URLs:* PNAS-, Nature-, Lancet-, METR-, arXiv-, Weltbank- und OpenAI-Adressen stammen aus Suchtreffern der jeweiligen Primärseite. Aufrufen konnte ich sie im Container nicht. Für den FT-Artikel und die FAA-SAFO-Seite habe ich keine geprüfte Direkt-URL. Sie sind mit Titel und Datum angegeben und sollten vor der Veröffentlichung einmal im Browser geöffnet werden.

---

## 4) Ampel-Seite: die heikelsten Aussagen

| # | Aussage (ein Satz) | Ampel | Primärquelle |
|---|---|---|---|
| 1 | Mit normalem ChatGPT schnitten türkische Schüler in der Prüfung 17 % schlechter ab als ohne Maschine. Die Tutor-Version schadete nicht, half aber auch nicht. | 🟢 sicher (großes RCT, PNAS; eine Schule, ein Fach, kurzfristig) | https://www.pnas.org/doi/10.1073/pnas.2422633122 |
| 2 | Nach Einführung der Polypen-Erkennung fanden 19 erfahrene Ärzte ohne Maschine seltener Krebsvorstufen, 22 statt 28 %. | 🟡 umstritten (beobachtend; Kritik an der Methode; ein späterer Leserbrief ohne Effekt) | https://www.thelancet.com/journals/langas/article/PIIS2468-1253(25)00133-5/abstract |
| 3 | Erfahrene Programmierer waren Anfang 2025 mit Maschine 19 % langsamer und hielten sich trotzdem für schneller. | 🟡 umstritten (16 Personen, Werkzeuge von 2025; METR selbst hält den Wert inzwischen für veraltet) | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ |
| 4 | Nach AlphaGo trafen Go-Profis nach 66 Jahren Stillstand messbar bessere Entscheidungen, mit vielen neuen Zügen. | 🟢 sicher als Befund / 🟡 Deutung, warum es passierte | https://www.pnas.org/doi/10.1073/pnas.2214840120 |
| 5 | Ein Harvard-Tutor, der Fragen stellt statt Lösungen zu liefern, brachte etwa doppelt so viel Lernzuwachs wie guter Präsenzunterricht. | 🟠 dünn (ein Kurs, zwei Lektionen, Tutor von der Kursleitung selbst gebaut) | https://www.nature.com/articles/s41598-025-97652-6 |
| 6 | Wer sich bei Anthropic Code erklären ließ, lernte viel mehr als wer alles abgab: über 65 % gegenüber unter 40 %. | 🟠 dünn (Preprint, 2 bis 7 Personen pro Muster, Studie des Herstellers) | https://www.anthropic.com/research/AI-assistance-coding-skills |
| 7 | Sechs Wochen Nachhilfe mit Maschine und Lehrkraft brachten in Nigeria so viel wie 1,5 bis 2 Jahre normaler Unterricht. | 🟠 dünn (ein kurzer Pilot, Umrechnung in Schuljahre, Effekt nur für Englisch kleiner) | https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee |
| 8 | Ergebnisse in Denktests sinken seit Anfang der 2010er, vermutlich wegen endloser Feeds. | 🟡 umstritten (Rückgang gut belegt, Ursache Deutung des Autors) | FT, John Burn-Murdoch, 14.03.2025, „Have humans passed peak brain power?“ |
| 9 | Wer der Maschine mehr vertraut, berichtet von weniger kritischem Denken. | 🟠 dünn (Selbstauskunft, Korrelation) | https://doi.org/10.1145/3706598.3713778 |
| 10 | Viel GPS geht mit schlechterem räumlichem Gedächtnis einher. | 🟠 dünn (kleine Stichprobe, 13 Personen im Längsschnitt) | https://www.nature.com/articles/s41598-020-62877-0 |
