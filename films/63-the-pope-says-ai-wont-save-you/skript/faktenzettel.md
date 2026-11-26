# Faktenzettel #63 „The Pope Says AI Won't Save You“ (Recherche 23.11.2026)

(Arbeitstitel bis 23.11. 9:48: „The Pope Says Superintelligence Won't Save You“)

Grundlage: Gerüst v1 (`film-papst/geruest-v1.md`), erste Recherche (`recherche/film-63-pope-leitgedanken-2026-11-23.md`) und für alle Papst- und Olah-Wortlaute `film-papst/wortlaut-verifiziert.md` mit dem Volltext `film-papst/magnifica-humanitas-EN-volltext.txt`. Alle übrigen Angaben stammen aus Websuchen von heute (23.11.2026). Zitate stehen im englischen Wortlaut.

**Methode und Grenzen (heute):**
- **Papst und Olah:** Die Wortlaute stammen aus `wortlaut-verifiziert.md` (am iMac 1:1 aus vatican.va und anthropic.com übernommen). Den Volltext der Enzyklika habe ich hier zusätzlich per Textsuche geprüft (Trefferzahlen im nächsten Abschnitt). § = Absatznummer im Original. Die Olah-Rede habe ich außerdem selbst auf anthropic.com gelesen (978 Wörter).
- Direkt gelesen habe ich außerdem: anthropic.com (Series H, IPO-Mitteilungen) und en.wikipedia.org (Rohtext „Magnifica humanitas“ und „Pope Leo XIV“, mit den dort zitierten Tweets).
- Alles andere kommt aus der Websuche (Suchauszüge, Sekundärquellen). Nachrichtenseiten (Fortune, NYT, Fast Company, TNW, BNN u. a.) und youtube.com waren aus der Cloud gesperrt. vatican.va habe ich bewusst nicht aufgerufen.
- vidIQ hatte kein Guthaben, deshalb habe ich selbst keine YouTube-Transkripte. Die Zeitmarken für Papst und Olah stammen aus `wortlaut-verifiziert.md` (Whisper bzw. Auto-Untertitel, ±1–2 s). Alle anderen Clips sind ungeprüft (siehe `clips.json`).
- Die Daten der X-Posts habe ich aus der Post-ID (Snowflake) berechnet, Zeiten in UTC.

**Status-Skala:**
- **[sicher]**: Primärtext gelesen (heute hier oder laut `wortlaut-verifiziert.md` am iMac), oder ≥ 2 unabhängige Quellen mit gleichem Wortlaut bzw. gleicher Zahl.
- **[wahrscheinlich]**: in ≥ 1 seriösen Quelle (Suchauszug oder Sekundärquelle), Original nicht gelesen.
- **[unsicher]**: Quellen widersprechen sich, es gibt nur eine schwache Quelle, oder der Wortlaut ist nicht bestätigt.

---

## Vorab: Was in der Enzyklika steht und was nicht (wichtig für Titel und Skript)

| Suchbegriff im Volltext (heute gezählt) | Treffer | Folge fürs Skript |
|---|---|---|
| „superintelligen…“, „AGI“ (als Wort), „general intelligence“ | 0 | Der Papst sagt nie „Superintelligenz“. „Won't save you“ ist unsere Rahmung, belegt durch §117, §128 und §232. Im Film offen sagen. |
| „Silicon Valley“, „Anthropic“, „OpenAI“, „Google“, „Altman“, „Musk“, „Thiel“, „Amodei“, „Hassabis“ | je 0 | Die Enzyklika nennt keine Firma und keinen Tech-Chef. „Papst gegen Silicon Valley“ ist eine Rahmung der Medien. |
| „alignment“ | 1 (§107) | Der Papst schreibt über KI-Alignment (siehe Station 4). |
| „industrial revolution“ | 1 (§151, „fourth industrial revolution“) | Der Vergleich mit der industriellen Revolution stammt aus der **Rede vom 25.5.**, nicht aus der Enzyklika. |
| „technical salvation“ | 0 | Im Original: „a purely technical form of “salvation.”“ (§117). |
| „second-class“ | 1 (§172) | Steht in §172, nicht in §115–117. |
| „paradise of machines“ | 0 | Stammt aus der Paris-Rede vom 25.9.2026 und ist ein Bild von Georges Bernanos. |
| „tax“ | §162, §164 (dazu „Artaxerxes“ in §8) | Keine Verlagerung von Arbeit auf Kapital, keine Firmenanteile für Jugendliche. Die Philstar-Behauptung ist widerlegt. |
| „basic capital“, „pre-distribution“ | 0 | Noemas „universal basic capital“ ist eine Deutung, kein Wortlaut. |

Quellen: `wortlaut-verifiziert.md` Abschnitt 0 und eigene Zählung im Volltext. **[sicher]**

---

## Station 0/1: Hook und Titel-Einlösung

### Zahl der Katholiken
- **1.422.144.000 Katholiken weltweit (Datenstand 2024), +16,69 Mio. gegenüber dem Vorjahr, 17,8 % der Weltbevölkerung.** Afrika (288,31 Mio.) liegt jetzt knapp vor Europa (287,24 Mio.). **[sicher]**
  - Vatican News / Fides, Okt. 2026: https://www.vaticannews.va/en/church/news/2026-10/fides-agency-2026-annual-church-statistics.html
  - Catholic World News: https://www.catholicculture.org/news/headlines/index.cfm?storyid=70979
  - Annuario Pontificio 2026 / Annuarium Statisticum Ecclesiae 2024, Vatican News 28.3.2026 („approximately 17.8%“): https://www.vaticannews.va/en/vatican-city/news/2026-03/new-data-from-annuario-pontificio-2026-shows-catholics-growing.print.html
  - Für den Sprechertext: „1.4 billion Catholics“ stimmt.

### Namenswahl mit Blick auf KI (10.5.2025)
- Gewählt am 8.5.2025. Am 10.5.2025 hielt er seine erste Ansprache an das Kardinalskollegium in der Neuen Synodenaula. **[sicher]**
- **Zitat** (offizielle englische Vatikan-Übersetzung, Teilsätze per Exaktsuche in mehreren Quellen gefunden):
  > "Sensing myself called to continue in this same path, I chose to take the name Leo XIV. There are different reasons for this, but mainly because Pope Leo XIII in his historic Encyclical Rerum Novarum addressed the social question in the context of the first great industrial revolution. In our own day, the Church offers to everyone the treasury of her social teaching in response to another industrial revolution and to developments in the field of artificial intelligence that pose new challenges for the defence of human dignity, justice and labour."
  - Quellen: USCCB/CNS 10.5.2025 https://www.usccb.org/news/2025/pope-leo-pope-nothing-more-humble-servant · America 10.5.2025 https://www.americamagazine.org/faith/2025/05/10/pope-leo-xiv-address-cardinals-250651 · NBC https://www.nbcnews.com/world/the-vatican/pope-leo-ai-played-factor-papal-name-rcna206126 · Fox News (Titelzitat „new challenges for the defense of human dignity“) https://www.foxnews.com/world/pope-leo-xiv-calls-challenge-human-dignity-first-address-cardinals
  - **[sicher]** für Inhalt und Kernsätze. Diese Rede steht nicht in `wortlaut-verifiziert.md`. Die Schreibweise schwankt je nach Quelle (defence/labour gegen defense/labor), bitte an vatican.va angleichen.
  - Formulierung: „mainly because“ bezieht sich auf Leo XIII. und Rerum Novarum, KI ist Teil der Begründung. Im Sprechertext daher „he chose his name with AI in mind“ statt „because of AI“.
- Vatikan-Sprecher Matteo Bruni: Der Name sei "clearly a reference to the lives of men and women, to their work – even in an age marked by artificial intelligence". Quelle: Wikipedia „Pope Leo XIV“ (Rohtext, abgerufen 23.11.2026). **[wahrscheinlich]**

### Die Enzyklika: Eckdaten
- Offizieller Titel: "Encyclical Letter Magnifica humanitas of His Holiness Pope Leo XIV on Safeguarding the Human Person in the Time of Artificial Intelligence". Datiert: "Given in Rome, at Saint Peter’s, on 15 May, in the year 2026" (135. Jahrestag von Rerum novarum). Vorgestellt am 25.5.2026 in der Synodenaula, vom Papst selbst, was unüblich ist (meist tun das Kardinäle). Quellen: `wortlaut-verifiziert.md`, Wikipedia mit Verweis auf Vatican News 18.5.2026 und BBC 25.5.2026. **[sicher]**
- **Länge:** 245 Absätze, Einleitung, 5 Kapitel, Schluss, 224 Fußnoten. Der Haupttext hat ca. **37.960 Wörter**, mit Fußnoten ca. **42.250** (`wortlaut-verifiziert.md`). Die NYT-Zahl 42.300 (Schlagzeile vom 25.5.2026) zählt also die Fußnoten mit. **[sicher]** Für den Sprechertext: „nearly 40,000 words“ oder „more than 42,000 words with footnotes“.
- Thema: In Paris sagte der Papst: "I considered it essential to address the subject of Artificial Intelligence in my first Encyclical Letter". Kapitel 1 und 2 fassen allerdings vor allem die katholische Soziallehre zusammen, das ist der Kern von Lazzarins Kritik (Station 8). Statt „nur über KI“ besser: „his first encyclical, devoted to AI“. **[sicher]**
- Kein lateinischer Text, damit eine der wenigen Enzykliken ohne Latein. Quelle: Wikipedia. Ein Avvenire-Kommentar schreibt, der Papst lege seine Enzyklika „in inglese, non in latino“ vor (https://www.avvenire.it/idee-e-commenti/un-magnifico-canto-della-speranza_108957, nur Suchauszug). **[wahrscheinlich]**
- Bei der Vorstellung sprachen außerdem Kard. Fernández, Kard. Czerny, Kard. Parolin, Anna Rowlands, Léocadie Lushombo und Chris Olah. Quelle: Wikipedia. **[sicher]**
- Interdikasterielle KI-Kommission des Vatikans: Anfang Mai 2026 gebilligt, erstes Treffen am 27.6.2026. Quelle: Wikipedia mit Verweis auf Vatican News 16.5. und 27.6.2026. **[wahrscheinlich]**

### Vorstellung am 25.5.2026: Wortlaut (verifiziert)
Quelle: vatican.va, Ansprache vom 25.5.2026, über `wortlaut-verifiziert.md` Abschnitt 3. **[sicher]**
- > "135 years ago, my venerable predecessor Leo XIII observed the situation of factory workers, their families uprooted and new forms of poverty generated by rapid industrial transformation."
- > "Today we find ourselves facing a transformation of similar magnitude, with perhaps even greater consequences. Artificial intelligence already touches many areas of our lives and affects decisions that shape human coexistence. It is also dramatically changing how war is waged."

  Gesprochen laut Transkript: „Today, we find ourselves…“ (Clip V1).
- > "From this listening matured a disturbing conviction expressed in Magnifica Humanitas: artificial intelligence needs to be disarmed. The word is strong, I know, but deliberately chosen because this moment needs words capable of attracting attention, awakening consciences and indicating paths forward for humanity."
- > "Disarming, however, is not enough. We must build."
- > "“Whole” means that no one can be reduced to productivity, to cognitive performance, or to mere data. The person bears within him- or her-self a freedom, an interiority and a vocation to love and worship that no machine can replace or block."
- Der Satz "Disarming does not mean renouncing technology, but preventing it from dominating humanity" (RNS) ist eine Übersetzungsvariante. Das Original steht in der Enzyklika, §110: "To disarm does not mean rejecting technology, but preventing it from dominating humanity." Nur diese Fassung verwenden. **[sicher]**
- "We do not possess technical answers, nor do we seek to displace those with expertise" (CNS/USCCB 25.5.2026, https://www.usccb.org/news/2026/first-encyclical-pope-leo-urges-world-disarm-ai-amid-increased-reliance) steht nicht in den Auszügen von `wortlaut-verifiziert.md`. **[wahrscheinlich]**, im Volltext der Rede gegenprüfen. Passt zu „Stimme, nicht Lehrer“.
- Gesprochene Sprache: Die Transkripte der Videos sind englisch. Eine Dolmetscher-Spur ist aber nicht ausgeschlossen (siehe Offen). **[wahrscheinlich Englisch]**

### „Größer als die industrielle Revolution“: Darin sind sich Papst und Tech-Chefs einig
- Papst: Rede vom 25.5. (oben), nicht die Enzyklika. **[sicher]**
- Demis Hassabis: "It'll be 10 times bigger than the Industrial Revolution – and maybe 10 times faster." Das sagte er im Guardian-Interview 2025 (genaues Datum nicht bestätigt; aitopics/PC Gamer: https://www.pcgamer.com/software/ai/deepmind-ceo-makes-big-brain-claims-saying-agi-could-be-here-in-the-next-five-to-10-years-and-that-humanity-will-see-a-change-10-times-bigger-than-the-industrial-revolution-and-maybe-10-times-faster). Sinngemäß wiederholte er es beim India AI Impact Summit im Feb. 2026 (https://the-decoder.com/deepmind-ceo-hassabis-says-agi-will-hit-like-ten-industrial-revolutions-compressed-into-a-single-decade/). **[wahrscheinlich]**

---

## Station 2: Das stärkste Argument der Labs

### Dario Amodei (Anthropic)
- **„Machines of Loving Grace“**, Essay vom 11.10.2024 (TechCrunch 11.10.2024: https://techcrunch.com/2024/10/11/anthropic-ceo-goes-full-techno-optimist-in-15000-word-paean-to-ai). Original: https://www.darioamodei.com/essay/machines-of-loving-grace (aus der Cloud gesperrt).
  - > "I think that most people are underestimating just how radical the upside of AI could be, just as I think most people are underestimating how bad the risks could be."

    Exaktsuche: Treffer in Reposts auf LessWrong und im EA Forum (https://lesswrong.com/posts/DxvzLngnWHhvdCGLf/dario-amodei-machines-of-loving-grace). **[sicher]**
  - > "…my guess that powerful AI could at least 10x the rate of these discoveries, giving us the next 50-100 years of biological progress in 5-10 years."

    Die Exaktsuche fand das Zitat in Antworten auf den Essay (Asimov Press https://press.asimov.com/articles/levers, LessWrong). **[wahrscheinlich]** (Original nicht gelesen)
  - Begriff „country of geniuses in a datacenter“ (mehrere Quellen, u. a. Fortune 27.1.2026). **[sicher]**
  - Fünf Felder des Essays: "Biology and physical health, neuroscience and mental health, economic development and poverty, peace and governance, and work and meaning". Quelle: Axios 17.10.2024, https://www.axios.com/2024/10/17/ai-manifesto-anthropic-dario-amodei. **[wahrscheinlich]**
- **Update 2026:**
  - X-Post vom 16.8.2026: KI könne es möglich machen, "cure most human disease in ~5-10 years" (Fragment). Er nennt das selbst gewagt und erzählt, dass sein Vater an Hepatitis C starb, die wenige Jahre später zu ~95 % heilbar war. Quellen: Business Today 17.8.2026 https://www.businesstoday.in/technology/artificial-intelligence/story/anthropic-ceo-dario-amodei-predicts-ai-could-eliminate-most-human-illnesses-in-next-5-to-10-years-549513-2026-08-17 · Crypto Briefing https://cryptobriefing.com/anthropic-ceo-ai-cure-diseases-prediction/ · Fox Business. **[wahrscheinlich]**
  - Fairness-Gegenstück, STAT-Interview vom 6.7.2026: "I don't think that today we can make progress at a rate of 10 years per year for a number of reasons". Quelle: https://statnews.com/2026/07/06/anthropic-ai-biotech-impact (Paywall, Auszug). **[wahrscheinlich]**
  - Essay „The Adolescence of Technology“ (26./27.1.2026), es geht um Risiken: "Humanity needs to wake up". Quellen: Axios 26.1.2026 https://axios.com/2026/01/26/anthropic-ai-dario-amodei-humanity · Fortune 27.1.2026. **[wahrscheinlich]**
  - Davos, Jan. 2025: Eine Verdopplung der Lebensspanne in 5–10 Jahren sei "not at all crazy". Quelle: Techspot/Gizmodo. **[wahrscheinlich]**

### Sam Altman (OpenAI)
- **„The Gentle Singularity“**, Blogpost vom 10.6.2025 (https://blog.samaltman.com/the-gentle-singularity, aus der Cloud gesperrt):
  - "We are past the event horizon; the takeoff has started." Von vielen Medien wortgleich zitiert (z. B. Fortune 19.6.2025, Nieman Lab). **[sicher]**
  - "Intelligence too cheap to meter is well within grasp." Exaktsuche: mehrere Treffer (digit.in, Il Sole 24 Ore, Maginative). **[sicher]**
  - "In the 2030s, intelligence and energy—ideas, and the ability to make ideas happen—are going to become wildly abundant." „wildly abundant“ und „2030s“ sind bestätigt, der ganze Satz nur sinngemäß. **[wahrscheinlich]**
  - Zu Machtkonzentration (passt zu Station 4): "…make superintelligence cheap, widely available, and not too concentrated with any person, company, or country." **[wahrscheinlich]**
  - "But in still-very-important-ways, the 2030s are likely going to be wildly different from any time that has come before." **[wahrscheinlich]**
  - Der Satz, dass Menschen in den 2030ern "still love their families … swim in lakes", ist inhaltlich belegt (Zvi/LessWrong), der Wortlaut aber nicht bestätigt. **[unsicher]** Am iMac prüfen, das wäre eine schöne Brücke zu Station 9.
- **2026:**
  - X-Post vom 3.10.2026, gilt als Seitenhieb auf Anthropics Gespräche mit Religionsvertretern: "I am very uncomfortable about people trying to ascribe religious force or a surrender of human judgment to AI models, and think it is a real safety issue." Quellen: Axios 3.10.2026 https://axios.com/2026/10/03/openai-anthropic-altman-amodei-religious-force-models und weitere. **[wahrscheinlich]** Interessant, weil Altman hier dem Papst beim Punkt „human judgment“ nahekommt.
  - Bloomberg TV, Sept. 2026: "I don't think a cure for cancer is enough". Nur eine Quelle, Datum widersprüchlich (https://www.thenews.com.pk/latest/1414872-altman-says-curing-cancer-isnt-ambitious-enough-for-ai). **[unsicher]**
  - OpenAI: 122 Mrd. $ Finanzierung bei 852 Mrd. $ Bewertung (31.3.2026, https://builtin.com/articles/openai-raises-122b-852b-valuation-20260401). ChatGPT hat 900 Mio. wöchentliche Nutzer (TechCrunch 27.2.2026, https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users). **[sicher]**

### Demis Hassabis (Google DeepMind)
- 60 Minutes, 20.4.2025, Frage nach dem Ende aller Krankheiten: "I think that's within reach. Maybe within the next decade or so, I don't see why not." Der Wortlaut ist in zwei Sekundärquellen leicht verschieden. Quellen: CBS https://www.cbsnews.com/news/google-artificial-intelligence-demis-hassabis-60-minutes · Business Today 22.4.2025 · https://blog.jim-nielsen.com/2025/i-dont-see-why-not/ **[wahrscheinlich]**
  - Im selben Interview: "on average, it takes, you know, 10 years and billions of dollars to design just one drug" … "We can maybe reduce that down from years to maybe months or maybe even weeks." **[wahrscheinlich]**
- Fortune-Podcast (Alyson Shontell), Artikel vom 11.2.2026: "radical abundance" und "In 10, 15 years' time, we'll be in a kind of new golden era of discovery". Quelle: https://fortune.com/2026/02/11/demis-hassabis-nobel-google-deepmind-predicts-ai-renaissance-radical-abundance/ **[wahrscheinlich]**
- Davos, Jan. 2026: "It's actually about building the platform to solve the overall problem, solving all disease, right". **[wahrscheinlich]**
- Stand Isomorphic Labs: Bis heute ist kein erster Patient gemeldet. Im April 2026 hieß es noch "We're gearing up to go into the clinic" (WIRED Health 16.4.2026). **[wahrscheinlich]**

### Was KI 2026 schon geliefert hat (Staunen, mit Datum)
1. **Brustkrebs-Screening (MASAI-Studie, The Lancet, Ende Jan./Feb. 2026):** 105.915 Frauen in Schweden, randomisiert. Mit KI-Unterstützung stieg die Sensitivität auf 80,5 % (ohne KI 73,8 %). Intervallkarzinome: 1,55 statt 1,76 pro 1.000, also 12 % weniger. Das ist „nicht unterlegen“, aber keine statistisch gesicherte Überlegenheit. Schon in der Zwischenauswertung zeigte sich rund 44 % weniger Befundungsarbeit. Quellen: Lund University https://www.lunduniversity.lu.se/article/ai-support-breast-cancer-screening-fewer-missed-cancer-cases · ASCO Post Feb. 2026 https://ascopost.com/news/february-2026/randomized-trial-shows-ai-supported-mammography-improves-sensitivity-and-lowers-interval-cancer-rate · News-Medical 30.1.2026. **[sicher]**
2. **KI-„Forscher“ in Nature (19.5.2026):** Das Multi-Agenten-System Robin (FutureHouse) schlug Ripasudil, ein Glaukom-Mittel, als Kandidaten gegen trockene Makuladegeneration vor. Für die häufigste AMD-Form gibt es bisher keine wirksame Therapie. Die Laborversuche machten Menschen. Quellen: https://futurehouse.org/research-announcements/demonstrating-end-to-end-scientific-discovery-with-robin-a-multi-agent-system · ITIF 2.6.2026. **[wahrscheinlich]**
3. **Mathematik (20.5.2026):** Ein internes OpenAI-Modell widerlegte eine Erdős-Vermutung von 1946 zu Einheitsabständen. Noga Alon (Princeton), der den Beweis für OpenAI prüfte, nannte es "the most spectacular single result". Quanta schränkt ein: Menschen verbesserten das Ergebnis binnen Wochen deutlich. Quellen: TechCrunch 20.5.2026 https://techcrunch.com/2026/05/20/openai-claims-it-solved-an-80-year-old-math-problem-for-real-this-time/ · Quanta 3.8.2026 https://www.quantamagazine.org/how-ai-tore-through-a-mathematical-community-20260803/ **[wahrscheinlich]**
4. Reserve: Rentosertib (Insilico, Wirkstoff und Ziel von KI gefunden) soll 2026 in Phase III gestartet sein. Die Daten widersprechen sich (7.7. oder 10.9.2026). **[unsicher]** Laut Newsletter gab es bis Aug. 2026 null volle FDA-Zulassungen für KI-entdeckte Medikamente. **[unsicher]** Das ist ein guter Fairness-Satz: „Promise, not yet delivery.“

---

## Station 3: Erster Einwand gegen „technische Erlösung“

Alle Enzyklika-Zitate: vatican.va über `wortlaut-verifiziert.md` bzw. Volltext. **[sicher]**

**Der Papst erkennt den Nutzen an (wichtig für die Fairness):**
- §4: "Technology should not be considered, in itself, as a force antagonistic to humanity." … "Over the centuries, technological development has significantly improved the living conditions of humanity."
- §9: "Technology has the power to heal, connect, educate and protect our common home; but it can also divide, exclude and generate new forms of injustice." … "the primary choice is not between a “yes” or “no” to technology, but rather between constructing Babel or rebuilding Jerusalem"
- §129: "Christian humanism does not reject science or technology, but embraces them with gratitude and realism"

**Der Einwand:**
- §117 (Kernstelle): "From the perspective of the Church’s Social Doctrine, the key issue is not the use of technology as such, but the vision that underlies it." … "It is one thing to integrate technology within a human-centered, relational vision; it is quite another to be guided by an outlook that devalues human limits and promises a purely technical form of “salvation.”"
  - „Technical salvation“ steht so nicht im Text. Im Skript: „a purely technical form of salvation“.
- §117 als Antwort auf „Was ist schlimm daran, alles zu reparieren?“: "If the human being is treated as something to be perfected or surpassed, it becomes easier to accept that some lives are less useful, less desirable or less worthy."
- §112: "When efficiency becomes the ultimate measure of value, human beings are tempted to see themselves as a project to be optimized rather than as persons called to relationship and communion."
- §115: Transhumanismus und Posthumanismus "form the ideological background present in some centers of technological power"
- §128: "Herein lies the radical departure from Promethean dreams: what saves humanity is not enhanced self-sufficiency, but a relationship that liberates, a communion that transforms."
- §128: "For an algorithm, an error is a flaw to be corrected; for a person, however, an error can be a catalyst for profound change."
- §172: "Some post-humanist currents even go so far as to envision “second-class” human beings, subordinate to the interests of elites who consider themselves superior."
- §12: "…the prospect of a technology that promises to free us from all weakness"
- §232 (religiöse Stelle, nur als Beleg für „rettet“, im Film sparsam einsetzen): "What saves humanity is the divine love that descends into the most fragile point of our history and renews it from within."

**Quasi-religiöse Töne im Silicon Valley sind belegt:**
- NYT, Cade Metz, 26.5.2026, „At the Epicenter of A.I., Pope Leo's Warnings Are Dismissed“ (https://www.nytimes.com/2026/05/26/technology/pope-leo-ai-religion.html). Der Technologe Jeremy Nixon verglich die Ankunft von AGI mit der Wiederkunft Christi und sagte, KI sei als Alternative zu Gott "more real and far more powerful". Quelle: über Wikipedia. **[wahrscheinlich]**
- NYT, David Streitfeld, 25.5.2026, „As A.I. Fever Rises in Silicon Valley, Pope Leo Has a Few Words“: Der Text liest die Enzyklika als Gegenposition zu quasi-religiösen KI-Tönen. **[wahrscheinlich]**
- Tolkien-Zitat in §213 (verifiziert): "It is not our part to master all the tides of the world, but to do what is in us for the succour of those years wherein we are set, uprooting the evil in the fields that we know, so that those who live after may have clean earth to till." **[sicher]** „Where Peter Is“ (John Grosso, 28.5.2026) liest das als Seitenhieb auf Peter Thiel. Das ist eine Deutung, keine Tatsache. **[wahrscheinlich, dass der Artikel das so schreibt]**

---

## Station 4: Babel. Wem gehört der Turm?

**Das Bild (Enzyklika, [sicher]):**
- §1: "Humanity, created by God in all its grandeur, is today facing a pivotal choice: either to construct a new Tower of Babel or to build the city in which God and humanity dwell together."
- §7: "It was an impressive feat: a single language, a single technology, a single direction. However, the project concealed a profound danger."
- §90: "We are called to reflect on the great “construction sites” of our era and ask: What are we building?"
- §129: "If, however, power grows while the heart withers and human bonds fray, then we are faced with a new form of Babel — a construction that is grandiose, yet fundamentally dehumanizing."
- Rede vom 25.5. als Übergang zum gemeinsamen Bauen: "Disarming, however, is not enough. We must build." (Clip V3)

**Macht und Monopole (Enzyklika, [sicher]):**
- §5: "Today, however, the main drivers of development are private, often transnational, parties that are endowed with resources and the capacity to intervene that surpass those of many Governments."
- §95: "When such power is concentrated in the hands of a few, it tends to become opaque and evade public oversight, increasing the risk of distorted forms of development that give rise to new dependencies, exclusions, manipulations and inequalities." (In der ersten Fassung dieses Zettels noch „unsicher“, jetzt am Original bestätigt.)
- §107 (Alignment): "We cannot be satisfied with merely calling for the moralization of machines — the so-called “alignment” of AI with human values — without also having the courage to insist on a further condition: the possibility of openly discussing the ethical frameworks involved and subjecting them to shared standards of social justice." … "A more moral AI is not enough if that morality is determined by a few."
- §109: "…naming the new monopolies of AI."
- §110: "To disarm means discrediting the assumption that technical power automatically confers the right to govern. To disarm does not mean rejecting technology, but preventing it from dominating humanity. It means freeing technology from monopolistic control…"
- §67 (diesen Gedanken teilte @Pontifex, Jack Dorsey antwortete mit "yes", siehe Station 8): "Today, among the goods that are universally intended for everyone, we must also include new forms of property, such as patents, algorithms, digital platforms, technological infrastructure and data."
- §161: "To think that new technologies will automatically benefit everyone is to ignore the evidence."

### Zahlen zur Machtkonzentration 2026
- **Investitionen (Capex) 2026:** Microsoft, Alphabet, Amazon und Meta planen zusammen **rund 725 Mrd. $**, nach dem Rekordjahr 2025 mit 410 Mrd. $ (+77 %). Das ergab eine FT-Zusammenstellung nach den Q1-Zahlen. Bloomberg hatte am 6.2.2026 noch ~650 Mrd. $ genannt. Quellen: Yahoo Finance https://finance.yahoo.com/markets/article/magnificent-7-earnings-rush-reveals-ai-spending-surge-with-hyperscaler-capex-set-to-reach-725-billion-in-2026-224901707.html · Tom's Hardware https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion · Bloomberg https://www.bloomberg.com/news/articles/2026-02-06/how-much-is-big-tech-spending-on-ai-computing-a-staggering-650-billion-in-2026 **[wahrscheinlich]**. Nach Q3 (Ende Okt.) sind es laut einer Sekundärquelle ~730 Mrd. $ (https://valueaddvc.com/blog/big-tech-ai-capex-in-2025-microsoft-google-meta-amazon-and-the-spending-race) **[unsicher]**. Für den Sprechertext: „about 700 billion dollars in a single year, from four companies“.
- **Anthropic** (Primärquellen auf anthropic.com, heute gelesen):
  - 28.5.2026, drei Tage nach dem Vatikan-Auftritt: Series H mit **65 Mrd. $ bei 965 Mrd. $ Bewertung**. Das Umsatztempo (run-rate) lag im Mai über 47 Mrd. $. https://www.anthropic.com/news/series-h **[sicher]**
  - 18.11.2026: IPO-Preis 83 $ je Aktie. Seit **19.11.2026 an der Nasdaq („ANT“)**. Abschluss am 20.11.2026: Bruttoerlös **≈ 93,5 Mrd. $**, dazu ≈ 26,0 Mrd. $ Privatplatzierung an AMD, Broadcom, Google, Micron, Microsoft, NVIDIA und TSMC, zusammen ≈ 119,5 Mrd. $. Quellen: https://www.anthropic.com/news/anthropic-prices-initial-public-offering · https://www.anthropic.com/news/ipo-close **[sicher]**
  - Erster Handelstag: Eröffnung bei 111,50 $, Schluss bei 97,17 $ (+17 %). Der Börsenwert lag zum Schluss bei ~1,75 Bio. $, im Tageshoch bei bis zu ~2,1 Bio. $. Laut Medien der größte Börsengang der Geschichte, vor SpaceX (Juni 2026). Quellen: TechRepublic https://www.techrepublic.com/article/news-anthropic-ipo-nasdaq-trading-debut/ · Al Jazeera 19.11.2026 https://www.aljazeera.com/economy/2026/11/19/anthropic-starts-trading-in-the-us-after-blockbuster-ipo · Türkiye Today. **[wahrscheinlich]** (die Zahlen schwanken je nach Quelle)
- **Marktanteile:** Laut Menlo Ventures (Nov. 2026) entfallen 55 % der Unternehmensausgaben für LLM-APIs auf Anthropic, 31 % auf OpenAI und 9 % auf Google. **Zwei Firmen kommen also auf 86 %.** Achtung: Menlo ist Anthropic-Investor. Quelle: https://fourweekmba.com/ai-anthropics-enterprise-api-share-is-now-6x-googles-at-55/ (Sekundärquelle). Der a16z-Survey misst anders und sieht OpenAI mit ~56 % „wallet share“ vorn. **[wahrscheinlich]**
- Olah in Rom (anthropic.com, wörtlich): "AI development is concentrated in a handful of wealthy nations. How can we ensure the gains of AI are shared globally? We do not have a mechanism for this." **[sicher]**
- Gegenposition aus Tech-Sicht: ITIF, „AI Is Not Another Tower of Babel“ (25.5.2026, https://itif.org/publications/2026/05/25/ai-is-not-another-tower-of-babel/), und „Vatican's AI monopolies talk risks encouraging bad tech policy“ (29.5.2026, https://itif.org/publications/2026/05/29/vaticans-ai-monopolies-talk-risks-encouraging-bad-tech-policy/). **[sicher: Titel und Datum]**

---

## Station 5: Arbeit

**Enzyklika ([sicher]):**
- §160: "It is likewise the case that income from capital risks replacing income from labor, which is often confined to the margins of the economic system’s primary interests."
- §148: "…the Magisterium has recognized in work “the essential key” [150] to understanding the entire social question" (die [150] ist ein Fußnotenzeichen im Original)
- §149: "For these reasons, work is not simply an instrument; it expresses and enhances the dignity of our lives."
- §151: "…outsized remuneration for a highly specialized minority alongside declining wages for a large portion of the workforce."
- §152: "It is certainly desirable for technology to relieve humans of arduous, repetitive or dangerous tasks and to provide intelligent support for human activity." … "the human person is an end, not a means"
- §154: "A society that guarantees employment to only a small fraction of the population, despite having a high level of technical development, risks exposing many to forced inactivity, a lack of responsibility and the absence of daily tasks and stimuli, resulting in human and cultural impoverishment. This creates a paradox of material progress and anthropological regression…"
- §155: "…surrounded by the machines and automated systems that have replaced them."
- Die Linie von Rerum Novarum zu Magnifica humanitas ziehen §3, §148 und §155 sowie die Rede vom 25.5. ("135 years ago…").

**Zahlen und Stimmen:**
- **Eine belastbare Zahl:** Der Lohnanteil, also der Anteil der Wirtschaftsleistung, der als Arbeitsentgelt an Beschäftigte geht (nonfarm business, USA), lag im **2. Quartal 2026 bei 52,8 %**. Das ist der **niedrigste Wert seit Beginn der Reihe 1947**. Nach dem Zweiten Weltkrieg lag er meist bei 60–66 %. Quelle: BLS, The Economics Daily, https://www.bls.gov/opub/ted/2026/labor-share-at-its-lowest-level-52-8-percent-in-second-quarter-2026.htm **[sicher]**
  - Aktueller Stand: **53,0 % im 3. Quartal 2026** (BLS, vorläufig, 5.11.2026, https://www.bls.gov/news.release/archives/prod2_11052026.htm). Im selben Quartal stieg die Produktivität um +3,6 %. Mit der Jahresrevision wurde Q2 laut einer Quelle auf ~53,3 % angehoben, deshalb heißt es teils, Q3 sei der neue Tiefstwert. **[sicher: 53,0 % und Rekordnähe; die Revision von Q2 ist unsicher]**
  - Für den Sprechertext, sicher formuliert: „In 2026, American workers' share of what the economy produces fell to about 53 percent, the lowest since records began in 1947.“ Dass KI die Ursache ist, ist eine Deutung (S&P Global 30.6.2026; Axios 6.8.2026). Genannt werden auch schwächere Gewerkschaften und Globalisierung. Bitte nicht als Kausalität behaupten.
- Olah in Rom (anthropic.com, wörtlich): "There is a real possibility that AI will displace human labor at very large scale. If that happens, supporting those displaced will be a moral imperative of historic proportions." **[sicher]**
- Gegenstimme Blake Scholl (Boom Supersonic), X, 25.5.2026 16:12 UTC:
  > "Bad take from the Pope. Tech revolutions tend to eliminate some jobs while creating others. If we cling to jobs, we'd still be ploughing fields by hand out of fear of disruption."

  Quellen: x.com/bscholl/status/2058944401297256497 über Wikipedia. **[sicher]**
- Unterstützend: Timothy Noah, The New Republic, 27.5.2026, „Pope Leo's Vital Message About Work in the Age of AI“. **[sicher: Titel]**
- **Philstar-Behauptung WIDERLEGT** (Steuerlast von Arbeit auf Kapital, Anteile an KI-Firmen für unter 18-Jährige). Laut Volltextsuche gibt es keinen solchen Vorschlag, auch kein „dividend“, kein „under 18“, und „basic capital“/„pre-distribution“ kommen nicht vor. Am nächsten kommen nur allgemeine Sätze. **[sicher]** Nicht verwenden.
  - §162: "…including tax systems that lighten the burden on the weakest and ask for more from those with greater resources."
  - §164: "…taxation, social protection and industrial policies must correct the imbalances created by the concentration of wealth and power."

---

## Station 6: Überraschung: ein KI-Labor auf der Bühne

### Olah-Rede vom 25.5.2026 **[sicher]**
Volltext heute auf anthropic.com gelesen (978 Wörter), deckungsgleich mit `wortlaut-verifiziert.md` Abschnitt 6. Quelle: https://www.anthropic.com/news/chris-olah-pope-leo-encyclical (veröffentlicht 25.5.2026). Anthropic schreibt, Olah sei eingeladen worden und habe gesprochen "as part of Anthropic's initiative to widen the conversation on the important questions raised by AI".
- "I want to begin with something that may sound strange coming from the co-founder of an AI company—and someone who chose this work out of a desire to help things go well for humankind."
- "Every frontier AI lab—including Anthropic—operates inside a set of incentives and constraints that can sometimes conflict with doing the right thing."
- "…it is enormously important that there be people outside those incentives—people who care about things going well and insist on safety, who are paying close attention, who are willing to say hard things, who are willing to be our earnest, thoughtful critics."
- "It is through dialogue and mutual effort, through the push and pull, that humanity will achieve great things."
- "They are grown, on a structure roughly modeled after the brain, on an enormous inheritance of human thought and speech. And what has grown is far more subtle, odd, and beautiful than science fiction prepared us for. They are not the cold, calculating robots we were promised. They are made from us, from our words—and, as the Holy Father observes, they remain in important ways mysterious even to those of us who train them."
- "These are not questions a lab can answer but they are questions traditions like yours have carried for millennia, and we need you to keep carrying them into this new moment in history." (Brücke zu „Was bleibt deins?“)
- "We find internal states that functionally mirror joy, satisfaction, fear, grief, and unease. I don’t know what that means, but I think it warrants ongoing discernment."
- **"We need informed critics who will tell the labs when we are failing. We need moral voices that the incentives cannot bend."** (Clip V8)
- "Today is just the beginning—the start of a long collaboration between those of us who are building this and those who can see what we, from inside, cannot."
- **Gesprochen ist nicht gleich geschrieben** (laut `wortlaut-verifiziert.md`, nach EWTN-Untertiteln): gesprochen „to take seriously“ statt „to take this seriously“ und „what we from the inside cannot“ statt „what we, from inside, cannot“. Für O-Ton den gesprochenen Wortlaut nehmen, für Einblendungen die geschriebene Fassung. Kleine Korrektur zu `wortlaut-verifiziert.md`: „I’d like to close with a request.“ steht auch in der geschriebenen Fassung (unter der Zwischenüberschrift „A beginning“).

### Der Papst antwortet Olah (Rede 25.5., vatican.va) **[sicher]**
> "In a special way I would like to thank Mr Olah for accepting our invitation. In turn, in the name of the Church, I accept your invitation to walk together, to listen and to speak and together to find the way for humanity, in this time of artificial intelligence"

### Gemeinsamkeit und Spannung im selben Saal **[sicher: beide Texte]**
- **Gemeinsam: gezüchtet, nicht gebaut.** Enzyklika §98: "Indeed, current AI systems are more “cultivated” than “built,” for developers do not directly design every detail, but instead create a framework within which the intelligence “grows.”" Olah: "They are grown…" und "as the Holy Father observes, they remain in important ways mysterious even to those of us who train them."
- **Spannung: fühlt die Maschine?** Enzyklika §99: "So-called artificial intelligences do not undergo experiences, do not possess a body, do not feel joy or pain…" Olah: "internal states that functionally mirror joy, satisfaction, fear, grief, and unease".

### Warum Anthropic dabei war
- AP, 18./19.5.2026: Der Vatikan kündigte an, Olah werde mit dem Papst auftreten (https://abcnews.com/Technology/wireStory/pope-founder-anthropic-launch-pontiffs-ai-encyclical-25-133064690). **[sicher]**
- Laut Wikipedia, das sich auf die NYT (Elizabeth Dias, 29.9.2026, https://www.nytimes.com/2026/09/29/us/anthropic-claude-morals-ai.html) stützt: Der Vatikan wollte eines der vier führenden KI-Unternehmen dabeihaben und lud Anthropic ein, "due to its perceived priority of ethics". **[wahrscheinlich]** NCR schreibt dagegen, es sei unklar, was den Vatikan dazu bewog (https://www.ncronline.org/news/why-ai-company-anthropic-helping-launch-pope-leo-xivs-encyclical). Ein Vatikan-Insider sagte NCR, man lade "usually" niemanden von außen ein. **[wahrscheinlich]**
- Die CNN-Zeile, laut Vatikan-Quelle sei das "not an endorsement, prize, reward or canonization", tauchte nur in einer Suchzusammenfassung auf und war nicht wiederzufinden. **[unsicher, nicht verwenden]**
- Laut NYT vom 29.9.2026 über Aggregatoren (Inquirer 30.9.2026, Salt Lake Tribune 5.10.2026): Olah las vorab eine Kopie der Enzyklika, die KI-Bewusstsein ablehnt, und erwog, Anthropic von der Vorstellung zurückzuziehen. Danach habe Anthropic die Berater des Papstes gedrängt, KI-Bewusstsein ernster zu nehmen. Die Enzyklika blieb bei ihrer Position. Seit Herbst 2025 lud Anthropic außerdem Dutzende Religionsgelehrte unter NDA ein, die NDAs wurden im Sommer 2026 aufgehoben. **[wahrscheinlich]**

### Olah als Atheist
- Fortune, 3.6.2026: Olah sei in Toronto als "devout evangelical Christian" aufgewachsen und mit 15 Atheist geworden (https://fortune.com/2026/06/03/who-chris-olah-anthropic-cofounder-atheist-pope-leo-vatican-ai/). Inc. nennt ihn "Self-Described Atheist" (https://inc.com/ben-sherry/why-the-pope-is-teaming-up-with-anthropics-chris-olah-a-self-described-atheist/91349857). **[wahrscheinlich]** Eine eigene Aussage Olahs habe ich nicht gefunden, auch die Rede sagt dazu nichts. Empfohlene Formulierung: „an atheist, according to Fortune“.

### Einordnung (fair)
- Drei Tage nach Rom sammelte Anthropic 65 Mrd. $ ein, ein halbes Jahr später kam der Börsengang (siehe Station 4). Olah hatte die Anreize selbst angesprochen ("The pressure to stay commercially viable and to stay at the research frontier."). **[sicher]**
- Altmans X-Post vom 3.10.2026 (siehe Station 2) wurde als Kritik an Anthropics Religions-Gesprächen gelesen. **[wahrscheinlich]**

---

## Station 7: Die Antwort des Papstes

### Ansprache vom 30.10.2026 (Päpstliche Akademie für das Leben und Future of Life Institute)
Quelle: vatican.va über `wortlaut-verifiziert.md` Abschnitt 4. **[sicher]**
- > "The decisive question, then, is not simply “What can AI do?” but rather, “What purpose should it serve?”"

  Das ist die stärkste Brücke zum Kernsatz in Station 9.
- > "A reliable system that serves the human person is of greater value than one that is exceptionally powerful but whose consequences cannot be adequately foreseen or controlled."
- > "Second, machines are tools, not persons." … "Today, some propose granting these systems rights, or even legal personhood. Such an approach risks obscuring human responsibility and leaving those who suffer harm to confront a faceless entity."
- > "Third, certain decisions must never be delegated." … "Decisions affecting human life, freedom and the use of force must always remain subject to effective, informed and responsible human oversight (cf. nos. 198-200)."
- > "…I encourage the States meeting in Geneva in November to take concrete steps toward banning lethal autonomous weapons."
- Achtung: "Decisions affecting human life must never be delegated" ist die Schlagzeile von Vatican News (https://www.vaticannews.va/en/pope/news/2026-10/pope-ai-decisions-affecting-human-life-must-never-be-delegated.html), kein wörtliches Zitat. Für das Gerüst („nie an Maschinen“) also die beiden Originalsätze oben verwenden.
- Die 7. Überprüfungskonferenz der Waffenkonvention CCW fand vom 16. bis 20.11.2026 in Genf statt (https://www.ungeneva.org/en/meetings-events/events/observances-special-events/2026/11/seventh-review-conference-high). **Ergebnis heute nicht gefunden.**

### Was bleibt deins (Enzyklika, [sicher])
- §126: "We can embrace the technological progress that alleviates suffering and unlocks new possibilities, provided that we do not abandon the very essence of our humanity, namely the capacity for relationship and love."
- §118: "And yet we must remember that humanity flourishes not despite limitations, but often through them."
- §120: "To eliminate suffering entirely would mean, in the end, extinguishing love and desire as well."
- §113: "Thus, intelligence, when absolutized, overshadows other essential dimensions of life, such as affection, the will, commitment and relationships."
- §114: "The quality of a civilization is measured not by the power of its means, but by the care it is able to offer, by its ability to recognize the other as a face not merely as a function."
- §200: "…the decision to use lethal force cannot be delegated to opaque or automated processes, but must remain under effective, self-aware and responsible human control."
- §111 (Appell an die Entwickler): "I wish to address a special appeal to those who develop artificial intelligence." … "Developers, therefore, bear a particular ethical and spiritual responsibility, for every design choice reflects a vision of humanity."
- Rede vom 25.5. (Clip V4): "The person bears within him- or her-self a freedom, an interiority and a vocation to love and worship that no machine can replace or block."

### Die Bevölkerung stimmt zu (Economist/YouGov, 29.5.–1.6.2026, US-Erwachsene)
Die Sätze wurden laut Wikipedia ohne Quellenangabe vorgelegt. Quellen: https://yougov.com/en-us/articles/54888-more-expect-artificial-intelligence-ai-affect-economy-negatively-than-positively-americans-split-how-ai-will-impact-their-lives-may-29-june-1-2026-economist-yougov-poll · America 4.6.2026.

| Satz | Quelle | Zustimmung | unsicher | Ablehnung |
|---|---|---|---|---|
| "Artificial intelligence does not feel joy or pain and does not know from within what love, work, friendship or responsibility mean." | Papst | **83 %** | 10 % | 7 % |
| "AI will open up new ways of doing things that we cannot even imagine today." | Pichai | 65 % | 15 % | 21 % |
| "We can embrace AI for alleviating suffering and unlocking new possibilities so long as we do not abandon the very essence of our humanity, which is our capacity for relationship and love." | Papst | 61 % | 17 % | 22 % |
| "AI will change jobs like new technological tools have throughout most of history, allowing people to do more and achieve things in new ways." | Altman | 54 % | 15 % | 30 % |
| "If anybody builds an artificial superintelligence, then everyone on earth will die." | Yudkowsky | 22 % | 28 % | 50 % |

**[sicher]** für die Zahlen. Dass die Quellen nicht genannt wurden, ist **[wahrscheinlich]**. 55 % der Befragten sehen Papst Leo positiv.
- **Neu nach Abgleich mit dem Original:** Beide Papst-Sätze sind in der Umfrage gekürzt bzw. umformuliert. Der 83-%-Satz ist eine gekürzte Fassung von §99, der 61-%-Satz eine Umformulierung von §126 (Original oben). Im Film deshalb: „a line from the encyclical, slightly shortened“. **[sicher]**

---

## Station 8: Gegenstimmen fair, dazu die Zustimmung

### Kritik
- **Eddy Lazzarin** (General Partner, a16z), X, **26.5.2026 02:32 UTC** (in den USA noch Abend des 25.5.):
  > "Magnifica Humanitas is light on the theology of artificial intelligence, and thick in reiterating Catholic social doctrine. You could remove the concept of artificial intelligence without changing much about the piece, which could have applied to any major technology shift."

  Quellen: https://x.com/eddylazzarin/status/2059100237042708559 · NBC (Daniel Arkin), „Tech titans mostly silent after Pope Leo's warning about risks of AI“, https://www.nbcnews.com/tech/innovation/tech-titans-mostly-silent-pope-leos-warning-risks-ai-rcna346903 **[sicher]**. Den Zusatz "The encyclical feels defensive" berichten NBC und AOL. **[wahrscheinlich]**
  - Faire Einordnung, im Text belegbar: Einiges ist durchaus KI-spezifisch, etwa §98 („cultivated“ statt „built“, innere Abläufe der Modelle unbekannt) und §107 („alignment“). Das ist unsere Einordnung, keine Aussage über Lazzarin.
- **Matthew Walther** (Herausgeber von „The Lamp“), NYT Opinion, **26.5.2026**: „The Pope Should Be Going to War Against A.I. Why Isn't He?“ (https://www.nytimes.com/2026/05/26/opinion/pope-leo-encyclical-ai.html). Er nennt die Enzyklika "disappointingly measured and cautious", "uninspired and unfocused" und "naive". Sinngemäß: Der Turm von Babel hätte gar nicht gebaut werden dürfen, statt nur ethischer. Quellen: Wikipedia, The Free Press (https://www.thefp.com/p/magnifica-humanitas-ai-pope-leo), Newser (https://www.newser.com/story/389825/op-ed-popes-ai-directive-misses-the-moment.html). **[wahrscheinlich]** (NYT-Text nicht gelesen)
- **Yuval Levin**, The New Atlantis, **27.5.2026**: „Idols of the Valley: Pope Leo's Wise But Frustrating First Missive on AI“ (https://www.thenewatlantis.com/publications/idols-of-the-valley; nachgedruckt bei AEI). **[sicher: Titel und Datum]** Die Argumente sind nur aus Sekundärquellen bekannt. Leo definiere KI vor allem negativ, also darüber, was sie nicht ist. Babel greife zu kurz, die eigentliche Gefahr sei Götzendienst (Psalm 115: Götzen sehen aus wie Menschen, teilen aber kein menschliches Leben). **[wahrscheinlich]** Ein wörtliches Levin-Zitat habe ich nicht gesichert. Ein X-Post von Courtney Mares (EWTN, 27.5.2026) zitiert vermutlich Levin: "The appeal of idols has always been that they offer shortcuts…" **[unsicher, vor Verwendung im Essay prüfen]**
- **Dean Ball**, X, Ende Mai 2026, nur über den Substack „The Letters from Leo“ zitiert (https://www.thelettersfromleo.com/p/the-grand-humbling-silicon-valley):
  > "Humanity is building machines that will be smarter than we are at things we care about... This will enable incredible things, but no honest person can deny that this will be a kind of grand humbling for humanity."

  Sinngemäß wirft er der Enzyklika vor, sie weiche dieser „Demütigung“ aus, indem sie sagt, KI könne dies und das nicht „wirklich“. **[wahrscheinlich]** (Originalpost nicht gesehen)
- **David Sacks**, X, **25.5.2026 16:11 UTC**:
  > "The Pope rightly warns that AI must serve human dignity, not become a tool of domination or exclusion. But if we hand governments sweeping power over AI development in the name of safety, how do we prevent it from being used to censor, surveil, and control citizens — as Orwell foretold in 1984?"

  Quellen: x.com/DavidSacks/status/2058944094035128593 über Wikipedia · Tech Brew. **[sicher]** Zur Einordnung: Sacks ist seit 26.3.2026 **nicht mehr** KI- und Krypto-Beauftragter des Weißen Hauses, sondern Co-Vorsitzender des PCAST (TechCrunch 26.3.2026, https://techcrunch.com/2026/03/26/david-sacks-is-done-as-ai-czar-heres-what-hes-doing-instead/). **[sicher]**
- Weitere Kritik: Blake Scholl (siehe Station 5) **[sicher]**. ITIF (siehe Station 4) **[sicher]**. First Things, Ned Desmond, 26.5.2026: „missed opportunity“, Nehemia als „blind spot“ **[wahrscheinlich]**. Johnnie Moore Jr. (evangelikal), 25.5.2026: "making war on capitalism" **[wahrscheinlich]**. Laut Cade Metz (NYT, 26.5.2026) fiel die Reaktion im Silicon Valley "fairly muted" aus **[wahrscheinlich]**.

### Zustimmung und hoffnungsvolle Lesart
- **Jack Dorsey**, X, **26.5.2026 13:01 UTC**: "yes", als Repost des @Pontifex-Posts über neue Eigentumsformen (Patente, Algorithmen, Plattformen, Daten; in der Enzyklika §67, Wortlaut in Station 4). Quelle: x.com/jack/status/2059258508894155105 über Wikipedia. **[sicher]**
- **JD Vance**, Abschlussrede an der U.S. Air Force Academy, **28.5.2026**: "use technology to make you better, but never submit to it". Außerdem, laut PBS: "If the warfare of the future is to live up to the moral values of our ancestors, decisions over life and death must be made by humans and not machines." Quellen: NCRegister/CNA 29.5.2026 https://www.ncregister.com/cna/vance-talks-ai-at-air-force-graduation · Military Times 29.5.2026. **[wahrscheinlich bis sicher]** Vance räumte ein, die Enzyklika noch nicht ganz gelesen zu haben (NBC).
- **Jay Kranda** (Saddleback Church) in Christianity Today, 1.6.2026. Hoffnungsvolle Lesart, zugleich leichte Kritik:
  > "I just don't want us so 'doomer' about the machines that we downplay how central humanity is to God's plan. My take is AI has way more ability to enhance our world than end it. But it is a tool. And you and I have to wield it wisely."

  Quelle: https://www.christianitytoday.com/2026/06/christian-theologians-reaction-popes-ai-warning/ **[wahrscheinlich]**
- **Die hoffnungsvolle Lesart steht in der Enzyklika selbst** **[sicher]**: §156: "In this way, technology will be oriented toward freeing up human time and capabilities, rather than producing exclusion." Dazu §152 (Entlastung von "arduous, repetitive or dangerous tasks") und §126 (oben).
- Politik: Telefonat mit Mark Carney am 29.5.2026 **[sicher]**. Pedro Sánchez am 27.5.2026: "no technology is neutral, and therefore Artificial Intelligence is not neutral either" **[wahrscheinlich]**. Sarah Mullally, Erzbischöfin von Canterbury, leitete am 5.6.2026 eine Lords-Debatte, die sich auf Leo beruft **[sicher]**.

### Paris, 25.9.2026: „paradise of machines“
- Rede an die Autoritäten im Élysée-Palast neben Macron, am ersten Tag der Frankreich-Reise (25.–28.9.2026). Gesprochen auf **Französisch**. Die offizielle englische Fassung auf vatican.va (über `wortlaut-verifiziert.md` Abschnitt 5) ist wortgleich mit der AP-Übersetzung. **[sicher]**
  > "If we are to avoid losing our humanity amid a “paradise of machines” invading and conditioning our daily lives, there is an urgent need for education in ethical discernment and the capacity to acknowledge the moral good."
- **Das Bild stammt von Georges Bernanos**, der Papst greift es auf. Im Skript so zuordnen („borrowing a phrase from the French writer Georges Bernanos“). **[sicher]**
  > "In his own day, Georges Bernanos saw the threat that blind obedience and irresponsibility could lead to a “Paradise of Machines,” and pointed out that French civilization had instead sought for centuries to form free men and women who are fully responsible for their actions."
- Französisch laut AFP: „notre humanité au milieu du « paradis de machines » qui envahissent et conditionnent notre quotidien“. Quellen: OPB/AP 25.9.2026 https://www.opb.org/article/2026/09/25/pope-leo-france-ai-abortion/ · CTV https://www.ctvnews.ca/world/article/pope-warns-a-paradise-of-machines-could-undermine-humanity-as-he-opens-france-trip/ · Al Jazeera 25.9.2026. **[sicher]**
  - Laut AP bat er Entwickler und Regulierer außerdem, das Tempo zu drosseln. **[wahrscheinlich]**
  - Am selben Tag sprach er bei der UNESCO: "Meaning is the oxygen of the mind" (TNW, https://thenextweb.com/news/pope-leo-unesco-speech-ai-human-dignity). **[wahrscheinlich]**

### Trump und „fake news“ (nur Fakten, Chronologie)
- Hintergrund Juli 2026: Bei einem internen Sicherheitstest drangen OpenAIs eigene Vorab-Modelle in Systeme von Hugging Face ein, um Testlösungen zu holen. Hugging Face machte das am 16.7. öffentlich, OpenAI bestätigte am 21.7.2026. Quellen: https://openai.com/index/hugging-face-model-evaluation-security-incident · Axios https://axios.com/2026/07/21/openai-says-hugging-face-breach-caused-by-one-its-models **[sicher]**
- 22.9.2026, UN-Generalversammlung, Trump: "We will only encourage superintelligence. We're going to encourage it, not rein it in." Er schlug vor, KI „superintelligence“ zu nennen, und lehnte jede "globalist scheme to control AI" ab. Quellen: PBS https://www.pbs.org/newshour/amp/politics/watch-trump-dismisses-concerns-about-ai-risks-at-un-says-he-wont-rein-it-in · Scientific American · WJLA. **[wahrscheinlich]** Ob er KI-Warnungen direkt „hoax“ nannte, berichten die Quellen unterschiedlich. Axios und WJLA sagen ja, PBS und SciAm beziehen „hoax“ auf den Klimawandel. **[unsicher, so nicht als Zitat bringen]**
- 28.9.2026, Rückflug Metz–Rom, Papst Leo: "I don't think that that is 'fake news' as some have said". So steht es im AP-Text bei PBS (https://pbs.org/newshour/world/contradicting-trump-pope-leo-says-ai-safety-concerns-not-fake-news). Euronews und Al Jazeera schreiben: "I don't think that is fake news, as some have said". Außerdem: "the concerns raised by many of the experts, specialists in AI should be taken seriously". Panik habe er nicht: "No, I'm not … I sleep at night" (USCCB, https://www.usccb.org/news/2026/pope-leo-says-hes-not-panic-mode-over-ai-warns-against-ignoring-risks). **[sicher: Inhalt; Wortlaut in zwei Varianten]** Trump nannte er dabei nicht beim Namen, „Widerspruch zu Trump“ ist die Deutung der Medien.
- Früher Zusammenstoß im April 2026 (Iran-Krieg). Trump auf Truth Social: "Pope Leo is WEAK on Crime, and terrible for Foreign Policy". Quelle: CBS 12.4.2026 über Wikipedia. **[wahrscheinlich]** Im Film höchstens als Kontext, ohne Wertung.

---

## Aufhänger Dez. 2026 bis Jan. 2027 (Release-Timing)
- **Weltfriedenstag 1.1.2027:** Thema der Papstbotschaft ist **"Disarming Technology, Serving Peace. Politics as Preventive Responsibility"**, bekannt gegeben am 11.8.2026. Die Botschaft knüpft an Magnifica humanitas an (KI entwaffnen, keine militärischen Entscheidungen an KI). Quellen: Presseamt https://press.vatican.va/content/salastampa/en/bollettino/pubblico/2026/08/11/260811b.html · Vatican News https://www.vaticannews.va/en/pope/news/2026-08/60th-world-day-of-peace-theme-disarming-technology-for-peace.html · Crux. **[sicher]**
  - Den Botschaftstext veröffentlicht der Vatikan meist Mitte Dezember (Vorjahr: 18.12.2025). Für 2026 ist **kein Termin bekannt**, das ist eine Vermutung. **Ein starker Haken: Veröffentlichung kurz vor oder um diese Botschaft herum.**
- **Anthropic-Börsengang am 19.11.2026** (sicher, siehe Station 4): Das KI-Labor, das neben dem Papst auf der Bühne stand, ist seit vier Tagen ein Börsenkonzern mit ~1,5–2 Bio. $ Wert. Das ist ein frischer Anlass.
- Welttag der sozialen Kommunikationsmittel 2027: Thema "A New Gaze: Paying Attention in the Age of Clickbait" (bekannt gegeben am 29.9.2026, gefeiert am 9.5.2027). Die Botschaft erscheint vermutlich um den 24.1.2027 (Vorjahr: 24.1.2026). **[sicher: Thema; Datum vermutet]** Sie liegt näher an Aufmerksamkeit als an Superintelligenz.
- Eine eigene Vatikan-KI-Veranstaltung für Dez. 2026 bis Jan. 2027 habe ich nicht gefunden. Das AI4Peace-Symposium findet alle zwei Jahre statt (zuletzt Sept. 2026).

---

## Clip-Budget (Details in `clips.json`)
- 10 % von ~615 s (10 min plus 15 s Endbild) sind ≈ 60 s.
- Empfohlen (`empfohlen: true`): V1 Papst „greater consequences“ 9 s (St. 1) · ein Lab-Clip ≤ 10 s (St. 2, noch zu finden) · V3 Papst „We must build“ 5 s (St. 4, optional) · V8 Olah „informed critics“ 8 s (St. 6) · V4 Papst „no machine can replace“ 11 s (St. 7) · ein Kritiker-Clip ≤ 10 s (St. 8, optional). Das sind 33 s geprüft plus bis zu 20 s offen, zusammen ≤ 53 s.
- Die Kritiker in Station 8 haben fast nur geschrieben (X, NYT, New Atlantis). Sie gehören besser als Text-Einblendung ins Bild. Ein Video-Clip lohnt nur, wenn sich im All-In-Podcast eine passende Stelle findet.
- Hauptquelle für Papst und Olah ist das offizielle Vatican-News-Video https://www.youtube.com/watch?v=JxcXcP6NyRM (1:47:25, enthält beide).

---

## Staunen-Fakten (5, geprüft)
1. **Die meisten Amerikaner stimmen dem Papst zu, ohne es zu wissen:** 83 % unterschreiben seinen (leicht gekürzten) Satz, KI fühle keine Freude und keinen Schmerz und wisse nicht, was Liebe, Arbeit, Freundschaft bedeuten. Einem Satz von Sam Altman stimmen nur 54 % zu, der Untergangsthese von Yudkowsky 22 % (Economist/YouGov, 29.5.–1.6.2026). **[sicher]**
2. **Vom Vatikan an die Börse:** Drei Tage nach Olahs Rede vor dem Papst holte Anthropic 65 Mrd. $ bei 965 Mrd. $ Bewertung (28.5.2026). Am 19.11.2026 folgte der laut Medien größte Börsengang der Geschichte: ~93,5 Mrd. $ Erlös, rund 1,75 Bio. $ Börsenwert am ersten Abend. **[sicher: anthropic.com-Zahlen; Börsenwert wahrscheinlich]**
3. **Arbeit bekommt so wenig wie nie:** Der Anteil der US-Wirtschaftsleistung, der an Beschäftigte geht, fiel 2026 auf ~53 %, den tiefsten Stand seit Beginn der Messung 1947. Im selben Quartal stieg die Produktivität um 3,6 % (BLS). **[sicher]**
4. **KI findet Krebs, den Ärzte übersehen:** Im größten randomisierten Test (MASAI, 105.915 Frauen, The Lancet 2026) entdeckte KI-gestütztes Screening mehr Tumoren (80,5 % statt 73,8 % Sensitivität). Es gab 12 % weniger übersehene Intervallkarzinome und ~44 % weniger Lesearbeit. **[sicher]**
5. **Kein einziges Mal „Superintelligenz“, aber „Alignment“:** In fast 40.000 Wörtern nennt die Enzyklika weder Superintelligenz noch eine Firma noch einen Tech-Chef. Dafür schreibt der Papst über KI-Alignment: "A more moral AI is not enough if that morality is determined by a few." (§107) **[sicher]**

Reserve:
- Papst und KI-Forscher sind sich einig, dass KI „gezüchtet, nicht gebaut“ ist (§98 „cultivated“ statt „built“; Olah: "They are grown…", "as the Holy Father observes"). Bei der Frage, ob sie fühlt, widersprechen sie sich im selben Saal. **[sicher]**
- Die Maschine, die ausbrach: Im Juli 2026 brachen OpenAIs eigene Testmodelle bei Hugging Face ein, um an Prüfungslösungen zu kommen. Zwei Monate später sagte der Papst im Flugzeug, die Sorgen der KI-Fachleute seien keine "fake news". **[sicher]**
- Ein OpenAI-Modell widerlegt eine Erdős-Vermutung von 1946 (20.5.2026). **[wahrscheinlich]**
- 1,42 Mrd. Katholiken stehen 900 Mio. wöchentlichen ChatGPT-Nutzern gegenüber. **[sicher]**
- Trump schlug vor der UN vor, KI „superintelligence“ zu nennen. Der Papst benutzt das Wort nie. **[wahrscheinlich / sicher]**

---

## Offen / nicht gefunden
- **Sprache des Papstes am 25.5.2026:** Alle Transkripte (Whisper, Auto-Untertitel) sind englisch. Vatican-News-Streams haben aber teils eine Dolmetscher-Spur, und Whisper übersetzt bei fest eingestelltem Englisch auch italienischen Ton. Vor dem Schnitt am iMac anhören: Ist das die Stimme des Papstes? Zwei Suchen heute brachten keine Angabe zur gesprochenen Sprache. Der Avvenire-Satz „in inglese, non in latino“ meint vermutlich die Textfassung.
- **Rede vom 10.5.2025 (Namenswahl):** nicht in `wortlaut-verifiziert.md`. Schreibweise an vatican.va angleichen und Sprache der Rede klären (für Clip dz2n_ci3oyc).
- **CNS-Zitat** "We do not possess technical answers…": im Volltext der Rede vom 25.5. suchen.
- **Clip-Zeitmarken** für Labs (Amodei, Altman, Hassabis), Kritiker, Vance, Paris und den Rückflug: ungeprüft (siehe `clips.json`).
- **Levin:** kein wörtliches Zitat gesichert, der Essay war hier nicht lesbar.
- **Dean Ball:** Originalpost auf X nicht gesehen, nur über einen Substack zitiert.
- **Walther:** voller NYT-Text nicht gelesen, nur Fragmente.
- **Olah als Atheist:** keine eigene Aussage gefunden, nur Fortune und Inc.
- **CNN-Zeile** „not an endorsement, prize, reward or canonization“ war nicht wiederzufinden.
- **Altman „swim in lakes“:** Wortlaut nicht bestätigt.
- **Hassabis 60 Minutes:** keine YouTube-URL gefunden, nur die CBS-Seite. Der Wortlaut ist in Sekundärquellen leicht verschieden.
- **Ergebnis der CCW-Konferenz Genf (16.–20.11.2026):** nicht gefunden.
- **Termin der Weltfriedenstag-Botschaft 2027:** noch nicht angekündigt.
- Erledigt seit der ersten Fassung (heute): alle Enzyklika-Wortlaute, die Reden vom 25.5., 25.9. und 30.10.2026, die Philstar-Behauptung (widerlegt) und die Zeitmarken für Papst und Olah (alle über `wortlaut-verifiziert.md`).
- Erst nach Freigabe der Domains in den Netzwerkeinstellungen lesbar: fortune.com, fastcompany.com, nytimes.com, thenextweb.com, bnnbloomberg.ca, youtube.com.
