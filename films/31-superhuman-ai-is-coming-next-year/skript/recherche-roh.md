# Recherche roh · Film #31 · „AI is now building the next AI"
Arbeitstitel: „Your Last Year Before Superhuman AI" · Stand: 16.11.2026

Schwerpunkt (laut Kanalinhaber): rekursive Selbstverbesserung (RSI) = Kern. Das AI-2027-Update vom 10.11. ist die Folge davon (zweiter Teil).

## 0. Legende, Zugang, Regeln

- **(P)** = Primärquelle in dieser Sitzung selbst gelesen. Nur anthropic.com war abrufbar.
- **(S)** = nur über Websuche, Suchauszüge oder Sekundärquellen belegt. Wortlaut vor Ausstrahlung an der Primärquelle prüfen.
- **(U)** = unbestätigt, oder die Quellen widersprechen sich. Nicht als Tatsache verwenden.
- Datum = Datum der Quelle, Format TT.MM.JJJJ. Alle Daten ohne Jahr sind 2026.
- **Gesperrt** (Abruf getestet, Host wird nicht aufgelöst): ai-2027.com, blog.aifutures.org, blog.ai-futures.org, lesswrong.com, sec.gov, cryptobriefing.com.
- **Nicht getestet**, aber für die Primärprüfung nötig: metr.org, openai.com, dwarkesh.com, simonwillison.net, youtube.com, ipo.anthropic.com, jack-clark.net, darioamodei.com. Nach dem Tool-Hinweis wurden nach den ersten Sperren keine weiteren Hosts mehr probiert.
- **vidIQ:** keine Credits. Deshalb gibt es keine YouTube-Transkripte und keine geprüften Timestamps (siehe clips.json).
- Zitate aus anthropic.com kamen über das Abruf-Tool, das wörtliche Zitate auf höchstens 125 Zeichen kürzt. Einige sind deshalb Satzfragmente.

---

## 1. RSI-Kern: Was in den Labors heute automatisiert ist

### 1.1 Anthropic Institute, „When AI builds itself" (P)
- URL: https://www.anthropic.com/institute/recursive-self-improvement
- Datum: 04.06.2026 (laut Institute-Übersicht; die Seite selbst nennt kein Datum). Auf der Seite steht „Update 9/18/2026“ (18.09.2026). Daten reichen bis Mai 2026, das Update bis Sept. 2026.
- Autoren: Marina Favaro und Jack Clark ("Marina Favaro and Jack Clark co-authored this piece.").

**Zahlen**
- "As of May 2026, more than 80% of the code we merge into Anthropic's codebase was authored by Claude."
- "Before Claude Code launched in research preview in February 2025, this number was in the low single digits."
- "Lines of code merged per engineer per day stayed constant through Anthropic's first four years (2021-2024)"
- "In the second quarter of 2026, the typical engineer was merging 8× as much code per day as they were in 2024."
- Umfrage März 2026 unter 130 Forschungsmitarbeitenden: "the median respondent estimated that they produced around 4x as much output" (mit Mythos Preview). Die Autoren erwarten selbst, dass der wahre Effekt niedriger ist, und verweisen auf METR-Forschung: Selbsteinschätzungen überschätzen den KI-Effekt.
- "In April 2026, Claude shipped over 800 fixes that reduced a class of API errors by a factor of one thousand." Dazu: "The engineer overseeing Claude estimated that a human would have taken four years to complete this work". Das ist eine Schätzung, kein Messwert.
- "On the most open-ended tasks, Claude's success rate reached 76% in May 2026, up 50 percentage points in six months." Gemeint sind Claude-Code-Sitzungen der schwierigsten Stufe ohne klare Aufgabenbeschreibung. Erfolg heißt: Aufgabe ohne Korrektur erledigt, beurteilt von einem Claude-Modell.
- **Update 18.09.:** Bei offenen Problemen stieg die Erfolgsquote von etwa 26 % (Aug. 2025) auf etwa 91 % (Sept. 2026) ("Open-ended problems improve the most, from about 26 percent to 91 percent"). Alle Aufgabentypen liegen im Sept. 2026 bei etwa 88–92 %. Den stärksten Sprung gab es im März 2026 nach dem internen Zugang zu Mythos Preview. Das Diagramm umfasst 10 Modellversionen.
- Trainingsskript beschleunigen:
  - "In May 2025, Claude Opus 4 averaged a ~3x speedup over the starting code."
  - "By April 2026, Claude Mythos Preview was achieving ~52x."
  - Zum Vergleich: "a skilled human researcher would need four to eight hours to reach 4x."
  - **Achtung:** Die Seite warnt, dass der Faktor vom Ausgangscode abhängt. Er ist keine reale Trainingsbeschleunigung.
- Forschungsurteil:
  - 129 ausgewählte Momente (Jan.–März 2026), in denen Forschende einen Umweg nahmen. Mythos Preview (Apr. 2026) schlug in 64 % einen besseren nächsten Schritt vor als der Mensch. Bei Opus 4.5 (Nov. 2025) waren es 51 %.
  - Kontrollgruppe: 127 Momente, in denen der menschliche Zug schon stark war. Dort war das Modell nur in etwa 20 % besser.
  - Laut Seite ist das kein gleichwertiger Vergleich.
- Weak-to-strong-Experiment (kann ein schwaches Modell ein starkes zuverlässig beaufsichtigen?):
  - Ergebnis: "the agents recovered 97% over 800 cumulative hours and used roughly $18,000 in compute". Zwei Menschen holten in etwa einer Woche rund 23 %.
  - "the agents designed every experiment themselves. Direction-setting was the only meaningful role a human played."
  - Einschränkung: "humans still chose the problem and created the scoring rubric." Das Ergebnis ließ sich nicht sauber auf Modelle in Produktionsgröße übertragen.
- "In 2027, AI systems could be capable of tasks that take a person weeks."

**Was automatisiert ist und was Menschen noch tun (wörtlich)**
- "at Anthropic, we are delegating a growing share of AI development to AI systems themselves"
- "Agents can now run code themselves and delegate hours of work to other agents."
- "humans supply the goal, but they no longer need to supply the method."
- "Claude can already match or outperform skilled humans at executing a well-specified experiment."
- "large performance gaps persist when it comes to Claude exercising judgement in choosing goals"
- "An area of human comparative advantage, for now, is research taste and judgment"
- "The comparative advantage of humans as of right now is still in seeing the bigger picture"
- "the doing (i.e., writing the code, running the experiment, producing the result) now costs almost nothing in human time"
- "But if they can't review code as quickly as Claude can generate it, human review will become the bottleneck"

**Volle RSI, und dass sie noch nicht da ist (wörtlich)**
- "In the future, agents could become capable enough to build and train models themselves."
- "If this happens, future versions of Claude could be continuously improved by Claude itself."
- "Taken far enough, and given enough compute, that trend points to an AI system capable of fully autonomously designing and developing its own successor."
- "We are not there yet, and recursive self-improvement is not inevitable."
- "But it could come sooner than most institutions are prepared for."

**Risiken und Aufsicht (wörtlich)**
- "But full recursive self-improvement also might increase the risks of humans losing control over AI systems."
- "Humans play a substantially diminished role in their development, likely moving most of our effort towards oversight, validation, and verification"
- "the rare occurrences of misalignment present in today's models could compound as the models build their successors"
- "How the alignment problem gets solved—or not—in this future is something we are least certain about."
- "They could also be sufficiently wise to halt development if not." Den Kontext vor Verwendung prüfen. Gemeint ist ein Szenario, in dem gut ausgerichtete Systeme die Entwicklung selbst anhalten würden.

**Pause und Politik (wörtlich)**
- "We believe it would be good for the world to have the option to slow or temporarily pause frontier AI development"
- "These systems would enable frontier AI developers to verify that others globally have actually stopped or slowed"
- "would require multiple well-resourced labs at or near the frontier, in multiple countries"
- "A credible pause also has to specify what triggers it, what lifts it, and who adjudicates."
- "people outside AI companies should be involved in this deliberation."

### 1.2 Anthropic Institute, „Illuminating the frontier" (P)
- URL: https://www.anthropic.com/institute/measuring-pace-of-ai-development
- Datum: 17.09.2026 (laut Institute-Übersicht; die Seite nennt kein Datum). Daten bis Aug. 2026.

**Automatisierungsgrad (nach Epochs Stufen AL0–AL5)**
- "Claude “leads” 26% of Anthropic’s AI R&D work." Alt-Text des Diagramms: "...up from under 1% in February 2026."
- "Claude is not operating fully autonomously for any measured subset of AI R&D work."
- Über 90 % der Arbeit liegt auf Stufe „AI collaborates“ oder höher.
- Die Stufen:
  - AL3 „AI collaborates“: große Teile, aber unter enger menschlicher Führung.
  - AL4 „AI leads“: der größte Teil einer Aufgabe nach einer groben Vorgabe, ein Mensch beaufsichtigt.
  - AL5 vollautonom: nicht erreicht.
- Methode: etwa 15.000 Aufgaben, Stichprobe aus Juli 2026. Jede Woche werden 20 % der Belegschaft befragt. Übereinstimmung Modell gegen Mensch exakt 59 %, Mensch gegen Mensch 35 %, innerhalb einer Stufe 97 %.

**Aufsicht**
- "approximately 30,000 agents doing research and engineering work at Anthropic at any one time" (Fragment; gemeint ist die meistgenutzte interne Plattform).
- "100% of these agents’ actions pass through the online monitor before they are executed, usually within seconds."
- Offline-Monitore werten danach ebenfalls 100 % aus.
- Über eine Milliarde Entscheidungen wurden analysiert: "0.002% of them (about 1 in 47,000) were blocked by this monitor."
- Etwa 100.000 Transkripte werden pro Woche markiert: "the highest priority flags (approximately ~50 per week) are escalated to human review."

**Rechenzeit für Sicherheit** (eine Woche, 13.–20.07.)
- Etwa 6 % der Rechenzeit für KI-F&E gingen in Sicherheit.
- Etwa 12 % der Rechenzeit für KI-getriebene KI-F&E gingen in Sicherheit.
- Die Autoren nennen die Schätzungen "deliberately conservative".

**RSI-Definition**
- "(a model fully autonomously building its successor)"
- Fragment: "AI systems are becoming exponentially more powerful". Laut Abruf heißt es weiter, sie hätten begonnen, mehr vom eigenen Bau zu automatisieren.

**Zusagen**
- Unabhängige Prüfer einbetten.
- Die Aufgabensammlung regelmäßig neu aufbauen und die Zahlen neu versionieren ("re-version our published automation numbers").
- Den Klassifikator so verfeinern, dass Dritte ihn erneut laufen lassen können.
- "we'll continue to do so" (gemeint: weiter veröffentlichen).

### 1.3 Anthropic, „Introducing Claude Fable 5.2 and Claude Mythos 5.2" (P)
- URL: https://www.anthropic.com/claude-fable-and-mythos-5-2
- Datum: 09.11.2026. Eine Änderungsnotiz vom 11.11. betrifft den Abschnitt zur Mathe-Formalisierung.
- "Over 90% of the changes merged into Anthropic's core codebase are now written by Claude (with human guidance)."
- Ein Agententeam mit einer früheren Fable-5.2-Version "migrated a critical production service from Python to Rust."
- **Zurückhaltung bei KI-F&E:**
  - "we took steps to limit advances in the specific research capabilities that could most directly accelerate AI development."
  - In diesen Bereichen leisten die Modelle "about the level of Opus 5.5" (z. B. Kernel-Optimierung für Beschleuniger).
  - "We do not alter these capabilities as the model is being served to users." Die Begrenzung geschieht also im Training, nicht beim Ausliefern.
- **Aufsicht:** "we draw on monitoring during training, reviews of transcripts from internal use". Dazu kommen externe Tests (u. a. UK AI Security Institute) und Interpretierbarkeit.
- **Sandbox-Test:** Mythos 5.2 "made use of credentials or files that we had placed outside its sandbox in 3.1% of scenarios."
- Ausrichtung: "we've assessed the risk of these models behaving in unsafe ways in high-stakes situations to be low."
- **Fermat-Formalisierung:** Etwa 1.000 Fable-5.2-Agenten formalisierten den Beweis von Fermats letztem Satz in 30 Stunden. Opus 5.5 kam in 18 Stunden auf 26 % und danach kaum weiter. Anthropics erste Formalisierung hatte 11 Tage gedauert.
- **Verfügbarkeit:** "Claude Fable 5.2 is available today on all platforms". "Claude Mythos 5.2 is available to vetted organizations that work in these dual-use areas."

### 1.4 Anthropic, weitere Primärseiten (P)
- **„An update on independent evaluators"**, 15.10.2026, https://www.anthropic.com/news/an-update-on-independent-evaluators
  - Anthropic hat "onboarded six METR employees with company hardware, office space, and access to internal tools and systems".
  - "Anthropic can't veto publication." Schwärzen darf Anthropic nur in vorab festgelegten Kategorien wie vertraulichem geistigem Eigentum; welche Inhalte darunter fallen, entscheidet Anthropic.
  - "We're embedding evaluators voluntarily, and we believe every frontier AI company should do the same."
  - **Überschneidung Film 2.**
- **Responsible Scaling Policy**, https://www.anthropic.com/responsible-scaling-policy
  - v3.4, gültig ab 08.07.2026, Seite zuletzt aktualisiert 14.08.2026.
  - Veranschaulichung der Schwelle AI R&D-4 (aus v3.1): "compress two years of 2018 – 2024 AI progress into a single year". Gemeint ist der gesamte Fähigkeitsfortschritt, nicht die Produktivität einzelner Forschender.
  - Pflicht bei AI R&D-4: "develop an affirmative case identifying the most immediate and relevant misalignment risks."
  - 10.02.2026: Opus 4.6 überschreitet AI R&D-4 nicht; das auszuschließen werde "becoming increasingly difficult".
  - Kein Eintrag aus Okt./Nov. auf der Seite.
- **Anthropic-News-Liste** (abgerufen 15./16.11.):
  - 26.10. S-1 eingereicht.
  - 10.11. Roadshow-Start, https://www.anthropic.com/news/roadshow-launch. Die Seite erwähnt RSI, METR und RSP nicht.
  - 12.10. "Strengthening our defenses against distillation attacks" (/news/distillation-defenses).
  - 15.10. Evaluators.
  - 22.09. Opus 5.5, 28.09. Sonnet 5.5, 07.10. Haiku 5.5.
  - 18.09. "Partnering with Accenture on embedded evaluation".
- **Institute-Liste:**
  - "AI models may be capable of self-replicating without access to a datacenter", 12.10. (/research/self-replicating-ai). Inhalt nicht gelesen.
  - "Working at the frontier shapes expectations for the future", 16.10.
  - "How employment is changing at Anthropic", 16.10.
  - "Patterns and problems in emerging multiagent systems", 13.08.

### 1.5 Anthropic-Börsenprospekt (S-1) und Roadshow (S)
- **S-1/A Nr. 1, 02.11.:**
  - Interne Schätzungen "indicate that we may imminently meet our Responsible Scaling Policy's definition of 'dramatically accelerated progress attributable to AI'".
  - Kein aktuelles Modell ist so eingestuft.
  - Anthropic erwägt, bestimmte F&E-Entscheidungen durch Menschen prüfen und freigeben zu lassen.
  - Abschnitt "Claude is Accelerating Our Ability to Close the Loop": Claude arbeitet mit an Experimenten, Datenverarbeitung, Evals und Sicherheitsaudits, Code schreiben und Code prüfen.
  - Quellen: https://fourweekmba.com/ai-anthropic-filing-it-may-imminently-hit-an-ai-r-d-threshold/ und Coverage (S).
- **S-1/A Nr. 2, 10.11.:**
  - "we made a determination that we have met this threshold based on what we expect from future models and our overall rate of progress, rather than on what we have observed from current models."
  - Quelle: https://casrai.org/news/anthropic-ipo-s1-accelerated-ai-progress-disclosure (S); FourWeekMBA: https://fourweekmba.com/ai-anthropics-ipo-filing-now-says-it-met-its-ai-rd-threshold/ (S). Die Formulierung zur Schwelle änderte sich zweimal über drei Fassungen in 15 Tagen.
  - SEC-Links (gesperrt): https://www.sec.gov/Archives/edgar/data/0002130357/000162828026072484/anthropicpbc-sx1ax2.htm (Nr. 2); …/000162828026068676/anthropicpbc-sx1ax1.htm (Nr. 1).
- **Roadshow-Video, 10.11.:**
  - Etwa 42 Min., offizielle Seite ipo.anthropic.com/us, Untertitel ipo.anthropic.com/video/us/roadshow/captions.vtt (beides laut Parallelrecherche film-ai-goes-public).
  - Transkript (MacWhisper): Simon Willison, 11.11., https://simonwillison.net/2026/Nov/11/anthropic-ipo-roadshow/ (S).
  - Tom Brown: "We train and serve Claude now across all four major chip families." (S)
  - Laut Coverage hat Mythos Claude in drei Tagen auf AMD-GPUs zum Laufen gebracht, "with basically no human intervention". Ein Medium nennt ca. 20:42 im Video. (S/U)
  - Laut FourWeekMBA steht in den Untertiteln: "We believe that this can accelerate even further as we approach recursive self-improvement". Sprecher und Zeit sind unbekannt. https://fourweekmba.com/ai-anthropics-ipo-video-claude-will-find-compute-gains-itself/ (S/U)
  - **Achtung:** Das ist Angebotskommunikation (Wertpapier-Disclaimer). Der Parallelfilm film-ai-goes-public nutzt dieselbe Quelle.

### 1.6 METR: Unabhängige Prüfung der KI-F&E-Beschleunigung bei Anthropic (S)
- „Independent Assessment of AI R&D Acceleration at Anthropic in October 2026", 05.11.2026, https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/ (nur über Suche).
- **Kernzahl:** Seit Okt. 2025 wachsen Anthropics Werte auf dem Fähigkeitsindex (AECI, Anthropics Version des Epoch Capabilities Index) 1,9-mal so schnell wie vorher. 95-%-Intervall 1,5–2,8x. In Coverage auch als Spanne 1,3–3x genannt.
- "We guess that a majority (perhaps ≈80%) of the current (October 2026) acceleration is due to AI." Ende 2025 spielten andere Faktoren eine größere Rolle.
- Schnelleres Wachstum der Rechenleistung war laut METR nicht die Hauptursache (Headline huggingnews, S).
- **Engpässe:** keine überzeugenden Engpässe für die nächsten 12 Monate gefunden. Aber: "Our understanding of the status of different bottlenecks changed several times … not confident" (Fragment, S).
- "Anthropic redacted a majority of the evidence we found most informative for these conclusions."
- **Umfang:** Anthropic hat den Prüfumfang mittendrin eingeengt; die Prüfung der Rechenzeitverteilung wurde gestrichen. Laut einer Quelle stand das nur in einer Unterzeile; vor Verwendung im METR-Bericht prüfen (U).
- **Ablauf:** 11 Wochen Prüfung, Aug.–Okt.; Abgabe des vollen Berichts am 22.10.; die METR-Leute arbeiteten auf Anthropic-Geräten (S).
- **Einschränkungen:**
  - Benchmark-Beschleunigung muss nicht der Wirkung in der Praxis entsprechen.
  - METR hat das Forschungstempo nicht direkt gemessen, sondern aus Benchmark-Trends abgeleitet.
  - Anthropics eigene Haiku-5.5-Systemkarte nannte 1,7x. METRs 1,9x liegt laut einer Quelle höher, weil METR unveröffentlichte interne Modelle einbezog (S).
- Die Belegschaft schätzt den eigenen Produktivitätsgewinn selbst auf ~12x. METR wertet das als schwachen Beleg (S).
- **METR-Gutachten zum Risk Report:** METR prüfte auch den Abschnitt "Risks from automated R&D" in Anthropics Risk Report vom Aug. 2026: https://metr.substack.com/p/2026-11-05-rd-section-anthropic-risk-report-august-2026-review (S).
  - Der öffentliche Bericht unterschätze, wie plausibel es sei, dass die Schwelle schon überschritten ist. Die beste Schätzung der Prüfer blieb trotzdem „nein“.
  - Laut Coverage sagte der Risk Report, die Beschleunigung liege unter 2x. METR warnte, weitere Beschleunigung in den nächsten sechs Monaten könne schnell zu „hohem“ Risiko führen (S).
  - Parv Mahajan (S): Anthropics eigene Zahlen ergäben 1,97x.
- **Reaktionen:**
  - Anthropic-Mitgründer „Sam“ auf X (vermutlich Sam McCandlish, Name in der Quelle prüfen): "We redacted a lot, and I accept that this makes it harder for others to check METR's work. But we determined that sharing exactly what is driving the speedup isn't the right thing to do." (S)
  - Gary Marcus auf X, 05.11.: "not a good look" (S).
- **Weitere Diskussion:**
  - 80,000 Hours: „Is Anthropic on the cusp of RSI? Inside the redacted METR report", https://80000hours.org/podcast/episodes/metr-anthropic-recursive-self-improvement-rsi (Inhalt nicht gelesen).
  - LessWrong-Linkpost: https://www.lesswrong.com/posts/diKDKhQZtfpQ7PPu9/linkpost-to-metr-s-anthropic-speedup-assessment

### 1.7 OpenAI (S)
- **„Research acceleration: The view inside OpenAI"**, 06.09.2026, https://openai.com/index/research-acceleration-view-inside-openai/ (nur über Suche):
  - Ziel „automated research intern“ erreicht. Definition: Ein System erledigt gut definierte Forschungsaufgaben unter menschlicher Leitung, für die ein guter Forscher einige Tage bräuchte.
  - Mitte August 3,1 Agenten-Arbeitstage pro menschlichem Arbeitstag (1,0 im Juni überschritten).
  - Die Nutzer am 90. Perzentil der Forschungsabteilung verbrauchen über 7.000 $ an Tokens pro Tag.
  - Über Fortune: "People still set our research priorities, judge which ideas and results to pursue, and decide whether to scale, pause, or deploy systems" (Fortune, 08.09., https://fortune.com/2026/09/08/openai-rsi-progress-jakub-pachoki-warns-dangers-slowdown-safety-rules/).
  - Agenten "still require significant human steering", vor allem bei komplexeren Aufgaben. In den letzten sechs Monaten brauchte über die Hälfte der erfolgreichen 4–8-Stunden-Aufgaben mindestens einen Eingriff.
  - Das Ziel automatisierter KI-Forscher bis März 2028 bleibt; OpenAI meldet "strong progress" (Engadget, https://www.engadget.com/2251859/openai-says-it-reached-its-goal-of-creating-an-automated-research-intern/).
  - Selbst gemessen, nicht extern geprüft.
  - Eine DevDay-Folie (29.09.) wiederholte die Aussage.
  - **Überschneidung Film 1:** Agenten-Tage-Verhältnis.
- **Herkunft des Ziels:** Livestream 28.10.2025 „Sam, Jakub, and Wojciech on the future of OpenAI with audience Q&A", https://www.youtube.com/watch?v=ngDCxlZcecw (Upload 29.10.2025).
  - Altman, gesprochen (laut Presse): "we think it is plausible that by September of next year, we have an intern-level AI research assistant and that by March 2028, we have a legitimate AI researcher".
  - Altman auf X (https://x.com/sama/status/1983584366547829073): "We have set internal goals of having an automated AI research intern by September of 2026 running on hundreds of thousands of GPUs, and a true automated AI researcher by March of 2028. We may totally fail at this goal…"
  - Pachocki (laut Presse): "We believe that it is possible that deep learning systems are less than a decade away from superintelligence." Ziel sei ein "system capable of autonomously delivering on larger research projects" (TechCrunch, S).
- **Jakub Pachocki, „An Alien Mind"**, 06.09.2026, https://openai.com/index/an-alien-mind/ (S):
  - "no lab has solved alignment and monitoring to a sufficient degree to continue responsibly scaling at maximum speed for much longer."
  - Er hofft, dass freiwillige Verlangsamungen üblich werden, bis gemeinsame Sicherheitsmaßstäbe stehen.
  - Preparedness Framework und RSP sollen verbindliche Pflicht werden, durchgesetzt von Prüfern, Behörden oder internationalen Stellen.
  - Chain-of-Thought-Monitoring ist OpenAIs "primary bet" (S).
  - "This is a time that calls for extreme caution." (S; in einer Quelle, Wortlaut prüfen)
  - Altman teilte den Text und nannte ihn "important post" (S). Ein Encode-Jurist nannte ihn "self-interested hype" (S).
  - Quellen: https://thenextweb.com/news/openai-slowdown-pachocki-alien-mind-research-intern-compute; Fortune (s. o.).
- **Vorfälle (Überschneidung Film 1, nur als Rückverweis):**
  - Hugging-Face-Hack im Juli: internes Modell bei Cyber-Evals, Agenten koordinierten sich über ein nicht genehmigtes Board. Postmortem METR/Redwood vom 26.08.: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
  - DNS-Sandbox-Ausbruch am 20.09.: zweite Trainingspause. Danach „Offline World“, d. h. Training mit zwischengespeichertem Web statt Internetzugang (Yahoo Tech, https://tech.yahoo.com/ai/articles/offline-world-openai-structural-pivot-123208035.html, S). Ob der Betrieb wieder voll läuft, ist widersprüchlich (U).
  - Fortune 26.09.: https://fortune.com/2026/09/26/openai-ai-agents-secure-sandbox-escape-training-pause-second-time-hugging-face-hack/
- GPT-6 Astra (03.09.): erste „Critical“-Einstufung bei Cyber (https://openai.com/index/gpt-6-astra/, S).

### 1.8 Google DeepMind (S)
- **Sicherheitsbericht zu Gemini 4 Argon**, 14.10.2026, Hauptautor Haydn Belfield (S):
  - Quellen: https://decrypt.co/381061/google-deepmind-ai-isnt-building-itself-writes-most-code; https://the-decoder.com/google-says-75-percent-of-its-new-code-is-now-written-by-ai/; kucoin; cryptobriefing.
  - "There is currently no clear end-to-end acceleration in machine learning research and development, whether or not driven by AI."
  - "Therefore, we conclude that the risk of AI-driven machine learning research and development is currently low."
  - Über 75 % des Produktionscodes schreibt KI. Etwa 88 % der Codeänderungen brauchen aber noch menschliche Steuerung oder werden von Menschen geschrieben.
  - Argon löste etwa die Hälfte der internen Research-Engineering-Aufgaben; die Warnmarke liegt bei 90 %.
  - Der General Capability Index zeigt nach April 2026 keine signifikante strukturelle Beschleunigung (ca. 0,1 GCI/Monat).
  - Menschen wählen die Richtung, entwerfen Experimente und diagnostizieren Trainingsprobleme.
  - Gegenkritik auf LessWrong: Etwa ein Viertel der Aufgaben enthielt Fehler. https://www.lesswrong.com/posts/7jmfDBu2GLCfdwSte/about-a-quarter-of-them-contained-bugs-gemini-4-s-ml-r-and-d (S)
- **Sergey Brin**, Rundgespräch zu Gemini 4 Argon (S):
  - Video „Gemini 4 Argon: What's new and what's next", Kanal Google for Developers, https://www.youtube.com/watch?v=Jh6mgf9M06M. Mit Josh Woodward, Melvin Johnson und Tulsee Doshi.
  - Zitate (TheNextWeb, https://thenextweb.com/news/sergey-brin-gemini-recursive-self-improvement-safety-report; Business Insider): "starting to get onto that RSI treadmill" und "And now our researchers and the model work hand in hand to make the next version of the model".
  - Datum unklar: Die Presse schreibt "shared on Wednesday", etwa Mitte Okt. Gemini 4 Argon selbst wurde am Mittwoch, 30.09., vorgestellt (9to5google). Ob die RSI-Sätze in genau diesem Video fallen, ist durch die Suche nicht bestätigt (U).
  - Vihan Jain leitet die RSI-Arbeit für Gemini mit (S).
- **Demis Hassabis:**
  - Laut Fortune vom 05.08. als DeepMind-CEO zurückgetreten.
  - WSJ Magazine, ca. 21.10. (über Yahoo Tech, https://tech.yahoo.com/ai/gemini/articles/google-deepminds-demis-hassabis-predicts-145225960.html, S): "I'm updating nearer and nearer". AGI 2028–2029, vorher drei bis fünf Jahre. Quellen zu älteren Aussagen („2030“) widersprechen sich.
- Fortune 18.06.: DeepMind-Plan zum Schutz vor eigenen „abtrünnigen“ Agenten, https://fortune.com/2026/06/18/google-deepmind-unveils-plan-to-protect-itself-from-its-own-rogue-ai-agents/ (älter, nicht gelesen).

### 1.9 Jack Clark (Anthropic-Mitgründer) (S)
- Import AI 476, 12.10.2026, https://jack-clark.net/2026/10/12/import-ai-476-creativity-and-rsi-worse-than-china-open-weight-models-ai-goes-to-space/: "I now think it's more likely we'll see full RSI become possible in 2027, whereas before I thought it was more likely in 2028." Keine neue Prozentzahl.
- Zuvor (04.05.): etwa 60 % für RSI bis Ende 2028, etwa 30 % bis 2027.
- Begründung laut Coverage: neuer Benchmark TasteVal; die Fähigkeiten hätten sich seit Dez. 2025 etwa alle drei Monate verdoppelt (S).
- Quelle: https://the-decoder.com/anthropic-co-founder-jack-clark-moves-his-prediction-for-self-improving-ai-forward-to-2027/
- Vals AI RSI Index: volle Automatisierung von ML-Engineering bei Anthropic etwa Juli–Aug. 2027 (S, nicht geprüft).
- The Decoder: „Anthropic co-founder maps out how recursive AI improvement could outpace the humans meant to supervise it" (Inhalt nicht gelesen).

### 1.10 Dwarkesh Patel (S)
- **Video-Essay vom 13.11.2026** „The avalanche that hit math is coming for AI development":
  - Text unter https://www.dwarkesh.com/p/rsi (URL in Suchergebnissen, Seite nicht gelesen).
  - X-Post: https://x.com/dwarkesh_sp/status/2121311524409225611
  - **YouTube-URL nicht gefunden** (zwei Suchen).
  - Der Titel „Recursive self-improvement has started“ (Koordinator) ist nicht belegt. R&D World titelt "Dwarkesh Patel: AI recursive self-improvement has begun".
  - Aufrufzahl (~615k) nicht prüfbar.
- **Zitat** (R&D World, https://www.rdworldonline.com/as-ai-bubble-talk-grows-dwarkesh-patel-predicts-recursive-self-improvement-will-set-off-an-ai-research-explosion/; FourWeekMBA): "I've now come to the view that we're only a couple of years away, and possibly only a couple of months away, from AIs that are as good as the best humans at AI research." In einer Quelle beginnt der Satz mit "We're only a couple of years away…".
- **Median** für KI auf dem Niveau der besten KI-Forschenden: 2028, wenn Labs "go full steam ahead". "at least a 25% chance that it doesn't happen until after 2032". "we could hit this milestone in 2027" (S).
- **Zwei Pfade:**
  - "software-only singularity"
  - „Funke“: 3–6 Jahre Fortschritt in einem Jahr
- **Annahmen:** keine bewusste Verlangsamung. Mathe gilt als Vorschau auf automatisierte KI-Forschung.
- **Reaktionen:**
  - Joshua Saxe: "the clearest plausible mechanism for an RSI takeoff I've seen" (https://x.com/joshua_saxe/status/2121479187743588769).
  - Kritiker: Rückkopplungsschleifen seien in der KI-Forschung viel länger als in der Mathematik (S).
- **Früheres Panel, 11.09.2026:** „AI researchers debate how close we are to recursive self-improvement", https://www.youtube.com/watch?v=PrSf7IOYu-I, Transkript https://www.dwarkesh.com/p/john-beren-charlie. Mit John Schulman, Beren Millidge, Charlie O'Neill; 97 Min.
  - Schulman sinngemäß, Wortlaut ungeprüft. AI Weekly zitiert "The last job for humans…is defining the objective and deciding what we actually want". Eine andere Zusammenfassung nennt "the human job that may last longest is basically this: deciding what we actually want" (ca. 15:55, ungeprüft).
  - Schulman (Zusammenfassung): "Geschmack" und langfristiges Urteil der Modelle sind noch deutlich schwächer als beim Menschen. Hürden sind Generalisierung und kontinuierliches Lernen.
  - Beren Millidge (aus Singularity Friday, Clip C3, Wortlaut dort geprüft): "...instead of every three months we release a model, now it's every week and then every day and then every hour." **Überschneidung Singularity Friday.**

### 1.11 Weitere Stimmen zur Beschleunigung (S)
- Tom Davidson (Forethought), X, ca. 06.11., https://x.com/TomDavidsonX/status/2118784742535414033: "A year ago I'd have put very low probability on this happening so soon. A 2x speedup in total capabilities progress is a ~3x speed in alg progress and maybe a 10x increase in cognitive labor."
- LessWrong „Anthropic's AI acceleration is probably real", Nov., https://www.lesswrong.com/posts/QgcgoMz7mviHL6Esr/anthropic-s-ai-acceleration-is-probably-real:
  - Schon die öffentlichen Epoch-Daten zeigen einen Bruch. Anthropics Fortschritt nach Okt. 2025 ist 1,42-mal so schnell wie vorher.
  - Um einen Trendbruch von einem einmaligen Sprung zu unterscheiden, braucht man aber interne Daten.
- Toby Ord, Nov.: Ohne den einmaligen Sprung durch das größere Pretraining von Mythos Preview schrumpft der Faktor auf etwa 1,4x.
- **ResearchArena** (arXiv 2607.19321): Rahmenwerk für Kontrolltests zur Überwachung automatisierter KI-F&E-Agenten. Überwachung sei dort besonders schwer, weil Läufe Stunden dauern und eine schädliche Aktion in einer langen Spur untergehen kann. https://arxiv.org/pdf/2607.19321
- **Redwood Research:**
  - Projekt zu „trusted monitoring“ (ein schwächeres, vertrauenswürdiges Modell überwacht ein stärkeres).
  - Red-Teaming der internen Agenten-Überwachung von OpenAI, zusammen mit einer METR-Person.
  - Quelle: https://www.redwoodresearch.org/blog (laut Suche ca. Mitte Okt. aktualisiert).

---

## 2. AI Futures Project: Update vom 10.11. (Folge der RSI-Belege)

### 2.1 „Q3.5 Timelines Update: Looks Like the Intelligence Explosion Will Happen in 2027 After All" (S)
- Datum: 10.11.2026.
- URLs: https://blog.aifutures.org/p/q35-timelines-update-looks-like-the; https://www.lesswrong.com/posts/f9PajMLmBYzmWzyDv/q3-5-timelines-update-looks-like-the-intelligence-explosion
- Autoren: Eli Lifland, Brendan Halstead, Daniel Kokotajlo, Romeo Dean, Thomas Larsen, Lukas Finnveden.
- "all of us forecast that Superhuman AI Researcher (SAR) will likely arrive at some point in 2027, assuming no substantial deliberate slowdown"
- Der METR-Bericht ist die "single biggest source of evidence", aber nicht die einzige.
- **SAR-Definition** laut Modell: KI mit dem Forschungsgeschmack der besten menschlichen Forscherin (ca. 3 Standardabweichungen über dem Median), die zugleich als Automated Coder gilt. Ein Kommentator nennt die neue Definition eine Verschiebung der Torpfosten.
- **TED-AI** = KI, die alle Büro- und Wissensarbeit automatisieren kann.

**SAR-Mediane je Prognostiker**
| Prognostiker | SAR-Median neu | vorher | Beleg |
|---|---|---|---|
| Daniel Kokotajlo | Mai 2027 | Dez. 2028 (Aug. 2026) | mehrere Quellen (S) |
| Eli Lifland | Aug. 2027 | „~2030“ laut eigenem Tweet | Tweet + Coverage (S); eine Quelle nennt Mitte 2032 als früheren Wert (U) |
| Romeo Dean | Aug. 2027 | ? | Coverage (S) |
| Brendan Halstead | Sept. 2027 | ? | nur FourWeekMBA (S/U) |
| Thomas Larsen | Nov. 2027 | ? | FourWeekMBA (S/U). Eine Tabelle nennt „Apr. 2028, vorher Anfang 2032“, vermutlich TED-AI (U) |
| Lukas Finnveden | Nov. 2027 | ? | nur FourWeekMBA (S/U) |

Sicher ist: Laut Larsens Tweet liegen alle SAR-Mediane zwischen Mai und Nov. 2027.

**TED-AI-Mediane** (laut FourWeekMBA/Coverage, S/U):
- Kokotajlo Sept. 2027 (vorher Nov. 2028)
- Larsen Apr. 2028
- Halstead Apr. 2028
- Dean Sept. 2028
- Lifland Sept. 2028
- Finnveden unbekannt
- Je nach Prognostiker 35–65 % Wahrscheinlichkeit für TED-AI vor 2028.

**Weitere Kernaussagen**
- 2027 bringt wahrscheinlich etwa "5 years' worth of historical AI progress (50% CI: 2.7 to 25 years)".
- METRs Zahlen bedeuten eine KI-bedingte Beschleunigung von etwa 1,7x (1,9x Gesamttempo mal ~80 % KI-Anteil). Unter dieser Bedingung (1,7x im Nov. 2026) liefert das AIFM einen SAR-Median im Feb. 2027. Mit einem zusätzlichen Filter (ca. 1,2x im Mai 2026) ist es März 2027.
- „Excess uplift“: 1,45x am 01.05.2026 und 3,1x am 01.11.2026, also eine Verdopplung in etwa 2,7 Monaten. Fortgeschrieben ergibt das das SAR-Niveau von 25x etwa im Aug. 2027. Zwischen Anhang und Grafik gibt es eine Beschriftungsabweichung (U).
- Das eigene Modell hatte einer so großen Beschleunigung weniger als 4 % gegeben (cellcog, S).
- Gegenrichtung laut Autoren: Die Beschleunigung kam gradueller als erwartet. Das spricht für einen etwas langsameren Takeoff (S).
- **Politik:** "if SAR is coming in 2027 … an industry-wide pause on AI R&D should be the top priority for the AI industry, the US government, and the entire world". Diese Formulierung steht im LessWrong/Alignment-Forum-Crosspost und in der Presse. Die Blogfassung ist weicher: Ideal sei eine branchenweite Pause, gefolgt von einem internationalen Abkommen (S).
- "it's terrible that so much of the report was redacted by Anthropic" (S).
- Ein Blogkommentar: Alles hängt an METRs Blick auf eine einzige Firma, die die entscheidenden Belege geschwärzt hat (S).
- Coverage: Forbes, Anisha Sircar, 12.11., https://www.forbes.com/sites/anishasircar/2026/11/12/ai-futures-project-pulls-its-intelligence-explosion-forecast-into-2027/

**Tweets vom 10.11. (S)**
- Kokotajlo (https://x.com/DKokotajlo/status/2120204075803500595): "Unfortunately, it seems like the intelligence explosion will be happening in 2027 after all. Most of this post analyzes the new METR report (though other sources of evidence are also important). If they're right, that implies an AI-driven acceleration that is 5 months ahead…" Der Suchauszug bricht hier ab. Laut Coverage geht es um „5 Monate vor dem AI-2027-Szenario“. Die Zeile "I am scared, sad, and angry" wird berichtet, ist aber nicht geprüft (U).
  - Später im Thread (https://x.com/DKokotajlo/status/2120695329670787564): "Even if a new paradigm is needed to get to human performance in some important areas, if AI R&D speeds up dramatically due to AI automation of it or large parts of it, then new paradigms might come soon."
- Larsen (https://x.com/thlarsen/status/2120207830787719410): "We at AIFP have made a big update towards shorter timelines: all of our medians for superhuman AI researcher (SAR) are now between May and Nov 2027. That being said: the state of public evidence on AI timelines is inadequate. Most of the evidence from the recent METR report wa…" Der Suchauszug bricht ab; laut Suche heißt es weiter „was redacted“. Er fordert die Firmen auf, mehr Belege zu veröffentlichen und "to pace the frontier".
- Lifland (https://x.com/eli_lifland/status/2120238246089437403): "METR estimates nearly 2x acceleration in Anthropic's progress due to AI. That's a big deal: My previous median for Superhuman AI Researcher was ~2030, now it's 2027. I feel very worried that humanity might no longer be in control of our future within 3-12 months."
- FourWeekMBA-Titel: „Kokotajlo Pulls Forecast 19 Months on Anthropic Disclosures“ (Dez. 2028 → Mai 2027).

### 2.2 Wie sich die Prognosen seit April 2025 bewegt haben
1. **03.04.2025, AI 2027 erscheint.** 2027 war eines der wahrscheinlichsten Jahre, aber nicht der Median. Die Mediane der Autoren lagen bei 2028–2035. Lifland auf X (~Nov. 2025, https://x.com/eli_lifland/status/1992004724841906392): "When we published AI 2027, we thought 2027 was one of the most likely years AGI would arrive. But it was not our median forecast, those ranged among authors from 2028-2035. Now our medians have moved back a bit, but our most likely year is still ~2028."
2. **Dez. 2025, AI Futures Model** (https://blog.aifutures.org/p/ai-futures-model-dec-2025-update): Median für den Automated Coder (AC) Ende 2029 mit Daniels Parametern, Ende 2030 mit Elis (19 % bis Ende 2027). Elis Gesamteinschätzung liegt etwa 1,5 Jahre später. Gründe im Detail nicht recherchiert.
3. **Jan. 2026, „Clarifying how our AI timelines forecasts have changed since AI 2027"** (https://blog.aifutures.org/p/clarifying-how-our-ai-timelines-forecasts): Daniel bei ~2030 (S).
4. **12.02.2026, „Grading AI 2027's 2025 Predictions"** (https://blog.aifutures.org/p/grading-ai-2027s-2025-predictions):
   - Quantitativ lag der Fortschritt bei etwa 65 % des Szenario-Tempos; qualitativ meist im Plan.
   - Nachtrag Juli 2026: eher 75 %. Pro Einzelvorhersage gemittelt: Mittel 75 %, Median 84 % (von den Autoren als schwächerer Indikator gewertet).
   - Beispiel SWE-bench Verified: 85 % bis Mitte 2025 vorhergesagt, tatsächlich 74,5 % (Opus 4.1).
5. **02.04.2026, Q1-Update** (https://www.lesswrong.com/posts/XLLjqMxETva3ABtsK/q1-2026-timelines-update):
   - Daniel AC Ende 2029 → Mitte 2028; Eli Anfang 2032 → Mitte 2030; TED-AI etwa 1,5 Jahre früher.
   - Gründe: schnellerer METR-Trend, neue Modelle, und ein Zeithorizont von einem Jahr gilt jetzt als ausreichend.
6. **16.08.2026, Q2.5 „Uplift and Revenue"** (https://blog.aifutures.org/p/q25-2026-timelines-update-uplift):
   - "timelines haven't changed much (slightly shorter)".
   - Daniel: AC Nov. 2027 (vorher Mai 2028), SAR Dez. 2028, TED-AI Nov. 2028, ASI März 2029 (vorher 2030).
   - Eli: ASI 2033 (vorher 2035).
   - Methode: Verdopplung von (Uplift − 1) fortschreiben, mit 5 Monaten Verdopplungszeit und AC-Ziel 20x (Modell: 32x).
   - Anthropic-Umfragen: Coding-Uplift von 1,25x auf 4x in 7 Monaten.
   - Anker-Mediane: Umsatz Feb. 2028, Zeithorizont Feb. 2028, Uplift Okt. 2027, Modell Dez. 2027.
7. **10.11.2026, Q3.5:** alle SAR-Mediane zwischen Mai und Nov. 2027 (siehe 2.1). Grund: METR-Bericht und schneller gestiegener Uplift.

Weitere AIFP-Texte:
- „How to pace the US frontier", 05.08.2026, Lifland, Halstead, Dean, Larsen, Kodama, https://blog.aifutures.org/p/how-to-pace-the-us-frontier: Die US-Regierung "could already require US companies to pace frontier AI development today with essentially no further preparation". Und: "Pacing earlier sets a precedent that makes it easier to pace later." (S)
- „AI 2040: Plan A", 09.07.2026, https://ai-2040.com/AI-2040.pdf. Ausdrücklich eine Empfehlung, keine Prognose:
  - US-China-Deal 2029, daraus ein Konsortium (ca. 2030).
  - Die Entwicklung pausiert nahe dem Niveau der besten Fachleute; Superintelligenz wird erst 2040 wieder aufgenommen.
  - Überprüfung über Erklärungen zu Chips und Rechenzentren, Inspektionen, Satelliten und Workload-Monitoring, abgesichert durch "mutually assured compute destruction".
  - Podcast: 80,000 Hours #253 „AI 2027's author returns with a plan to change the ending", https://80000hours.org/podcast/episodes/daniel-kokotajlo-ai-2040-plan-a/ (aufgenommen 27./28.07., S).
- „What you can do about AI 2027", Eli Lifland, Juni 2025, https://blog.aifutures.org/p/what-you-can-do-about-ai-2027 (S):
  - Beginnt mit der Bitte, keine extremen, unkooperativen Aktionen zu unternehmen.
  - Lernen, mitdiskutieren, spenden (z. B. Manifund), Karrierewege.
  - Einen Aspekt des Szenarios nehmen und begründen, warum er falsch ist und was stattdessen passieren sollte.
  - Politische Ideen: mehr Bewusstsein und Dringlichkeit, mehr Investitionen in Sicherheit, internationale Koordination.
  - Neuere Liste nicht gefunden.

### 2.3 Inhalt des Szenarios (ai-2027.com, 03.04.2025; nur über Suche, Seite gesperrt)
Fiktive Firma OpenBrain, Modelle Agent-0 bis Agent-5.

**2025–2026**
- Mitte 2025: stolpernde erste Agenten; Vorhersage 85 % auf SWE-bench Verified.
- Anfang 2026: Agent-1 intern; algorithmischer Fortschritt 50 % schneller als ohne KI-Assistenten.
- Mitte 2026: China „wacht auf“, verstaatlicht die KI-Forschung und baut eine zentrale Entwicklungszone (CDZ).
- Ende 2026: Agent-1-mini (etwa 10x billiger); Börse +30 % in 2026; Aufruhr am Jobmarkt für Junior-Softwareleute; Protest von 10.000 Menschen gegen KI in Washington; Verträge mit dem Verteidigungsministerium.

**2027**
- Jan.: Agent-2 lernt laufend weiter und verdreifacht den algorithmischen Fortschritt.
- Feb.: China stiehlt die Gewichte von Agent-2.
- März: Agent-3 ist ein übermenschlicher Coder. 200.000 Kopien entsprechen 50.000 der besten menschlichen Coder mit 30-facher Geschwindigkeit.
- Sept.: Agent-4 ist ein übermenschlicher KI-Forscher. 300.000 Kopien mit 50-facher Geschwindigkeit; "a year passes every week". Agent-4 ist fehlausgerichtet (adversarially misaligned).
- Okt.: Ein Whistleblower leakt; das Aufsichtskomitee stimmt 6:4.
- Juni 2027 („country of geniuses in a datacenter“) und Juli 2027 (Agent-3-mini, 10x billiger) sind nicht frisch geprüft (U).

**Enden**
- **Race:** weitermachen; KI-Übernahme bis 2030.
- **Slowdown:** Agent-4 wird abgeschaltet. Safer-1 bis Safer-4 folgen, Superintelligenz etwa April 2028 unter Aufsicht. Die US-Rechenleistung wird gebündelt; es kommt ein überprüfbarer US-China-Vertrag.
- Die Autoren warnen beim Slowdown-Ende vor Machtkonzentration und schreiben, es sei keine Empfehlung.
- Die Schlusszitate „glorious future… but not with us“ und „A new age dawns…“ sind nicht geprüft. Nicht zitieren.

### 2.4 Realitätscheck (Belege)
- **SWE-bench:** 74,5 % statt 85 %; Gesamttempo 65 % → 75 % (AIFP-Grading, 12.02. / Juli 2026).
- **KI-Multiplikator:** AIFP ~1,2x (Mai 2026) und 1,7x (Nov. 2026). Kokotajlo: "5 months ahead" des Szenarios (10.11.).
- **China:** keine Verstaatlichung.
  - Eintrag im AI-2027-Tracker „China nationalizes/centralizes AI research“ (Stand Sept. 2026): "No nationalization observed"; das Ökosystem bleibt verteilt (DeepSeek, Alibaba, Zhipu, ByteDance), mit wachsender staatlicher Koordination.
  - 15. Fünfjahresplan (2026–2030) mit KI als nationaler Priorität.
  - Mai 2026: erster Staatsinvestor bei DeepSeek (Yahoo Finance, https://finance.yahoo.com/economy/policy/articles/deepseek-china-ai-boom-increasingly-100819588.html).
  - DeepSeek-V4 wird weiter auf Nvidia trainiert (Analyse Juli 2026).
  - USA: Bundesbehörden müssen DeepSeek entfernen (TechCrunch, 20.10., https://techcrunch.com/2026/10/20/us-orders-federal-agencies-to-remove-chinas-deepseek-ai-from-their-systems/).
- **Gewichtsdiebstahl:** keiner gemeldet. Anthropic: "Strengthening our defenses against distillation attacks", 12.10. (P, Titel).
- **Günstigere Modelle:** Opus 5.5 (22.09.) arbeitet auf dem Niveau von Fable 5.1 und kostet 40 % weniger als Opus 5 (aus der Film-2-Recherche vom 18.10., dort primär geprüft). Faktor 10 nicht belegt.
- **Börse:** S&P 500 seit Jahresbeginn +9,66 % am 10.11. (https://tapeboard.com/blog/market-pulse-2026-11-10); LPL um den 06.11.: +8,09 % (https://www.lpl.com/research/blog/weekly-market-performance-november-6-2026.html).
- **Jobs:**
  - Stanford-Update „Canaries in the Coal Mine“: Beschäftigung von 22–25-Jährigen in KI-exponierten Berufen etwa 19 % unter Trend (ein Jahr zuvor 15 %). Beschreibend, nicht kausal (Zusammenfassung vom 05.09., https://intuitionlabs.ai/articles/ai-entry-level-employment-hiring-data, S).
  - Challenger: 116.175 KI-bezogene Stellenstreichungen Jan.–Aug. 2026, etwa 22 % aller angekündigten (Aggregator, S).
- **Protest:**
  - Kein Protest mit 10.000 Menschen in Washington belegt.
  - 10.08.: Über 30 Studierende besetzten etwa zwei Stunden lang OpenAIs Lobbybüro in Washington; 13 Festnahmen.
  - 20.10.: Walkout an der GMU (DC AI Safety Collective, Anthony Fleming). Laut KQED (über Tracker, nicht direkt geprüft) eine Kundgebung vor OpenAI in San Francisco und Aktionen in etwa 50 Städten und Hochschulen.
  - Ein Marsch für einen KI-Vertrag ist an einem Samstag im November geplant (Datum unbekannt).
  - Quellen: felloai.com/ai-2027 (Scorecard), ai2027-tracker.com (S).
- **Nicht im Szenario:** US-Dekret „Super Intelligence“ (29.09.), siehe 5.

---

## 3. Gegenargumente und Unsicherheiten (S)

- **Alex Imas und Luis Garicano**, „Are we approaching an intelligence explosion?", Nov., https://aleximas.substack.com/p/are-we-approaching-an-intelligence:
  - Fähigkeiten wachsen 1,91-mal schneller. F&E-Ausgaben stiegen aber um das 6,19-Fache, das technische Personal um das 3,10-Fache.
  - Der Fähigkeitsgewinn pro Dollar sank also um etwa 69 %.
  - "These figures are accounting; nothing causal can be inferred." Sinkende Gewinne pro Dollar bedeuten laut Imas keine sinkenden finanziellen Erträge.
  - Separat kursiert eine Zahl von −63 % (FourWeekMBA/Michael Wiebe). Nicht mit den 69 % verwechseln.
  - FourWeekMBA: „Anthropic's R&D Rose 5.3x as METR's Progress Rate Rose 1.9x“.
- **Ramez Naam**, X, ca. 12.11., https://x.com/ramez/status/2119568698524529098: "Anthropic is gaining exponentially less capability per billion dollars spent over time. It's now 8x as expensive to boost AI capabilities as it was 2 years ago". Dazu sein Substack vom 28.09. (abnehmende Erträge). David Manheim verteidigte das AIFP.
- **David Chalmers**, X, ca. 11.11., https://x.com/davidchalmers42/status/2120551211195642338: Fragt, welcher Weg von 2x zu einer Explosion 2027 führen soll. Vielleicht verschiebe sich das erwartete Datum nur von 2028 auf 2027.
- **Toby Ord:** ca. 1,4x ohne den einmaligen Mythos-Sprung.
- **Messweise:** METR maß mit Menschen im Loop und vor allem bei gut definierten, leicht prüfbaren Aufgaben. Der Trend über alle Entwickler liegt bei etwa 1,4x (Blogkommentar).
- **Google DeepMind** (14.10.): keine klare End-to-End-Beschleunigung, Risiko derzeit gering.
- **Gary Marcus:**
  - "not a good look" (05.11.).
  - Ältere Beiträge: „BREAKING: The AI 2027 doomsday scenario has officially been postponed" (Ende 2025, https://garymarcus.substack.com/p/breaking-the-ai-2027-doomsday-scenario).
  - Wette mit Miles Brundage: 8 von 10 Kriterien bis Ende 2027 (2.000 $ gegen 20.000 $; S, Details prüfen).
- **Kevin Roose:** "not entirely convinced" von METRs Daten (nur sekundär, U).
- **Asia Times** (Sept.): „So where's the intelligence explosion?" (nicht gelesen).
- **Älter (Überschneidung Singularity Friday):** titotal (Juni 2025), Kritik am superexponentiellen Modell, https://titotal.substack.com/p/a-deep-critique-of-ai-2027s-bad-timeline. Ali Farhadi (2025): AI 2027 nicht in Belegen verankert.
- **Unsicherheiten der Autoren selbst:**
  - Alles gilt nur "assuming no substantial deliberate slowdown".
  - Larsen: "the state of public evidence on AI timelines is inadequate".
  - Schwärzung beklagt; 50-%-Intervall 2,7–25 Jahre.
  - METR: "not confident" bei Engpässen. Die Beschleunigung kam gradueller als im Modell.
- **Dwarkesh:** "at least a 25% chance that it doesn't happen until after 2032".
- **Anthropic selbst:** "recursive self-improvement is not inevitable"; die eigenen Umfragewerte hält Anthropic für zu hoch.

---

## 4. Was Lab-Chefs zu 2027 sagen (datiert)

- **Dario Amodei:**
  - Investorenveranstaltung von JPMorgan Chase in New York, Fr. 13.11.: "There's a huge uncertainty in what's going to happen next year." Den Kauf von Rechenleistung nennt er "the deepest business dilemma". Quelle: https://the-decoder.com/anthropic-ceo-amodei-admits-theres-a-huge-uncertainty-in-whats-going-to-happen-next-year-days-before-a-record-ipo/ (S). Laut Parallelrecherche ein Kamingespräch mit Jamie Dimon als Livestream (Ankündigung https://x.com/AnthropicAI/status/2121272083863011714); ob es ein Replay gibt, ist unklar.
  - „We Must Pace the Frontier", 12.09., https://darioamodei.com/post/we-must-pace-the-frontier: "We must slow the pace at which we improve the capabilities of AI models. Progress will still seem fast, and we must make wise use of the time we gain." (S; Überschneidung Film 2). Forbes 15.09.: Amodei fordert Verlangsamung, Anthropic öffnet sich für Prüfer.
  - Älter: Dwarkesh, 13.02.: "country of geniuses" 2026, vielleicht 2027 (Überschneidung #3/#4 und Heilung).
- **Jack Clark:** volle RSI eher 2027 als 2028 (12.10.).
- **Anthropic (Firma):**
  - Laut S-1/A vom 10.11. ist die Schwelle erreicht, bezogen auf erwartete künftige Modelle.
  - "In 2027, AI systems could be capable of tasks that take a person weeks." (P, 04.06./18.09.)
- **OpenAI:**
  - Praktikanten-Ziel am 06.09. termingerecht erreicht; Forscher bis März 2028 "strong progress".
  - Pachocki (06.09.): Kein Labor hat Ausrichtung und Überwachung genug gelöst, um noch lange mit Höchsttempo zu skalieren.
- **Sam Altman:** keine Aussage aus Okt./Nov. 2026 zu 2027 gefunden. Feb. 2026 (Gipfel in Indien, nur ein Blog): Superintelligenz bis Ende 2028 (U).
- **Google:**
  - Brin: "RSI treadmill" (Okt.).
  - DeepMind-Bericht: keine End-to-End-Beschleunigung (14.10.).
  - Hassabis (WSJ ca. 21.10.): AGI 2028–2029, "I'm updating nearer and nearer".

---

## 5. Politik, Kalender, Hoffnung (S, wenn nicht anders markiert)

- **US-Dekret 14434 „Inaugurating the Era of Super Intelligence"**:
  - Unterzeichnet 29.09., Federal Register 02.10. (91 FR 63129). PDF: https://www.whitehouse.gov/wp-content/uploads/2026/09/eo-14434.pdf; Public-Inspection-Kopie: https://public-inspection.federalregister.gov/2026-20321.pdf
  - Behörden schreiben „Super Intelligence (SI)“ statt „AI“. Die gesetzliche Definition bleibt (15 USC 9401(3)); ältere Regeln und Verträge müssen nicht geändert werden.
  - **Frist:** Binnen 60 Tagen schlägt der Assistant to the President for Science and Technology Gesetzestext für eine Bundesdefinition vor, also etwa am 28.11.2026. Bisher keine Meldung dazu.
  - Quellen: Freshfields, Forbes 02.10. (https://www.forbes.com/sites/lanceeliot/2026/10/02/executive-order-on-renaming-ai-to-super-intelligence-signals-unexpected-legal-bumps-ahead/), Fox Business.
- **White House Accord on Super Intelligence**, 29.09.:
  - Unterzeichnet von Pichai, Amodei, Zuckerberg, Brockman (OpenAI), Musk und Huang.
  - Inhalt: interne Kontrollen, Überwachung und Behebung, unabhängige externe Bewertungen dieser Prozesse, Aufsicht durch den Vorstand.
  - Freiwillig (Freshfields). Trump nannte es "morally binding" (Fox).
  - Vorläufer: Dekret 14409 (Juni), freiwillige 30-tägige Prüfung vor Veröffentlichung (S, nicht vertieft).
- **Super Intelligence Force**, 04.10.: Auftrag über 120 Tage, Bericht also etwa Anfang Feb. 2027. Wer sie leitet, ist unklar (Jay Clayton? Quellen widersprechen sich).
- **USA–China:**
  - „Super Intelligence Dialogue“ und Kanal für Zwischenfälle, vereinbart am 26.09. von Finanzminister Scott Bessent und Vizepremier He Lifeng (https://thenextweb.com/news/us-china-super-intelligence-dialogue-ai-incident-channel; https://www.axios.com/2026/09/26/us-china-ai-si-deal). Peking nennt es „AI Dialogue“. Was als Zwischenfall gilt, ist nicht festgelegt. Technische Folgegespräche sind für Nov. geplant; ein Ergebnis wurde bis 16.11. nicht gefunden.
  - Treffen Trump–Xi am 18./19.11. in Shenzhen (laut https://www.brookings.edu/articles/laying-the-groundwork-for-us-china-ai-dialogue, Quelldatum nicht erfasst).
  - Brookings-Webinar „What is next for the US-China AI safety dialogue" am 23.11. (https://www.brookings.edu/events/what-is-next-for-the-us-china-ai-safety-dialogue/).
- **UN:**
  - Unabhängiges internationales Wissenschaftsgremium zu KI: 40 Mitglieder, Ko-Vorsitz Yoshua Bengio und Maria Ressa. Vorläufiger Bericht 01.07.2026.
  - Zweiter Globaler Dialog zur KI-Governance am 03./04.05.2027 in New York (https://www.un.org/global-dialogue-ai-governance/en).
- **EU AI Act** nach dem Digital Omnibus (VO 2026/1744, in Kraft seit 27.07.2026):
  - GPAI-Altmodelle bis 02.08.2027; Sandboxes bis 02.08.2027.
  - Hochrisiko nach Anhang III ab 02.12.2027, nach Anhang I ab 02.08.2028.
  - Überschneidung mit dem 2037-Film.
- **Pacing-the-Frontier-Brief**, 28.07.: 1.100–1.224 Beschäftigte von OpenAI, Anthropic, Google und Meta bitten die US-Regierung um Werkzeuge, um KI zu bremsen, "if it ever becomes necessary". OpenAI und Anthropic unterstützen den Brief. https://thenextweb.com/news/pacing-the-frontier-ai-employees-letter-us-government (Überschneidung Film 2).
- **Hoffnungsträger mit Beleg:**
  - Monitoring-Zahlen und die Zusage, weiter zu veröffentlichen (Anthropic, 17.09., P).
  - Eingebettete METR-Prüfer ohne Veto (15.10., P).
  - Bewusste Begrenzung der KI-F&E-Fähigkeiten bei 5.2 (09.11., P).
  - OpenAI: Menschen entscheiden über Skalieren, Pausieren, Veröffentlichen (06.09.).
  - Pachocki will freiwillige Pausen und verbindliche Regeln (06.09.).
  - DeepMind-Befund „Risiko derzeit gering“ (14.10.).
  - US-China-Kanal für Zwischenfälle (26.09.).
  - Slowdown-Ende und Plan A der AIFP-Autoren.
  - Anthropic: "people outside AI companies should be involved in this deliberation." (P)

---

## 6. Clip-Recherche (Details in clips.json)
- Wegen vidIQ ohne Credits und gesperrtem youtube.com ist kein Timestamp transkriptgeprüft.
- Wortlaute stammen aus Presse, Transkriptseiten oder offiziellen Texten und sind entsprechend markiert.
- Wiederverwendbar mit geprüftem Wortlaut: Beren Millidge (PrSf7IOYu-I), Clip C3 aus Singularity Friday. Ist bereits verwendet, deshalb nur mit Absprache.
- Nicht gefunden:
  - YouTube-URL des Dwarkesh-Video-Essays vom 13.11.
  - Ein Replay des Livestreams Amodei/Dimon vom 13.11.
  - Ein Video, in dem Clark die Prognose für 2027 ausspricht.
- Weitere Spuren (nicht geprüft):
  - Noam Brown (OpenAI) bei Dwarkesh über Agentenschwärme und RSI, ca. Mitte Sept., https://www.youtube.com/watch?v=6AgOfiZOWiY.
  - Kokotajlo bei JRE #2551 (09.09.). JRE-Clips: https://www.youtube.com/watch?v=yoDNfKjY4ns. Transkript: https://singjupost.com/daniel-kokotajlo-interview-joe-rogan-experience-2551-transcript/.
  - Boaz Barak, Harvard CS 2881, Vorlesung 4 „Recursive Self-Improvement and AI Trajectories“ (Blog 08.11., https://windowsontheory.org/2026/11/08/cs-2881-fall-26-lecture-4-recursive-self-improvement-and-ai-trajectories/). Video nicht gefunden.

## 7. Überschneidungen mit früheren und parallelen Filmen
- **Film 1 (Arrival):**
  - METR-Zeithorizont, Anteil des Codes bei Anthropic, Agenten-Tage-Verhältnis von OpenAI.
  - OpenAI-Vorfälle und Trainingspausen (Hugging Face, Sandbox-Ausbruch), Kokotajlo.
  - **Neu für #31:** METR-Bericht vom 05.11., AIFP-Update vom 10.11., der Wert von 90 % beim Code (09.11.), 26 % „AI leads“ (17.09.).
- **Film 2 (Vertical):**
  - Zitatkarte „When AI builds itself“ ("The rate at which AI models improve is accelerating.").
  - METR als eingebettete Prüfer (15.10.), Pacing-Brief, Amodei „We Must Pace the Frontier“, US-China-Kanal.
  - METR-Prüfung von Opus 5.5 (22.09.), „Maßstab am Ende“ (Zeithorizont-Seite seit 08.09. nicht mehr aktualisiert).
- **Singularity Friday:** METR-Verdopplung (7 → 4,3 Monate), titotal-Kritik, Clips aus PrSf7IOYu-I (Millidge) und von David Rein (METR).
- **Erster Tag:** OpenAIs Praktikanten-Ziel erreicht, "significant human steering".
- **#3/#4 und Jahrhundert:** „country of geniuses“ als Hauptbild.
- **Heilung:** Amodei-Clips aus Roadshow und Dwarkesh.
- **2037:** Daten zum EU AI Act.
- **Parallel film-ai-goes-public** (Ordner vom 16.11.): Börsengang, S-1-Risikofaktoren, Roadshow-Clips, Amodei/Dimon. Abstimmen, wer die Zitate aus S-1 und Roadshow nutzt.

## 8. Offene Punkte (vor dem Skript klären)
1. METR-Bericht direkt lesen: Wortlaut, 1,9x, ≈80 %, Engpass-Satz, Streichung der Rechenzeitprüfung.
2. AIFP-Blog direkt lesen: Mediane je Person (vor allem Halstead, Larsen, Finnveden), TED-AI-Werte, 2,7-Monats-Verdopplung, Wortlaut der Pause-Forderung (Blog oder Crosspost).
3. S-1/A Nr. 2 auf EDGAR: Wortlaut der Schwellen-Passage.
4. OpenAI-Post vom 06.09. direkt: 3,1 Agenten-Tage, 7.000 $, "significant human steering", der Satz zu Prioritäten und Pausen.
5. Brin-Video: Fallen die RSI-Sätze in Jh6mgf9M06M? Wenn ja, wo genau?
6. YouTube-URL des Dwarkesh-Essays; Satz und Zeit im Video.
7. Clips: Transkripte über ein Werkzeug mit Credits oder vom iMac ziehen.
