# Faktenzettel „Computers Now Run on Human Brain Cells“ (Stand 6.11.2026)

Grundlage: `geruest-v1.md` (freigegeben), `runde-1-2026-11-06.md` [B1–B13].
Legende: **✓** = belegt durch Paper, Uni, Behörde oder mehrere unabhängige Quellen · **[Firma]** = Angabe von Cortical Labs / DayOne, nicht unabhängig geprüft · **[prüfen]** = vor dem Sprechtext gegen die Primärquelle lesen.
Zugang heute: WebFetch war für jeden Host gesperrt (pmc.ncbi.nlm.nih.gov, arxiv.org, newatlas.com, medicine.nus.edu.sg). Alle Angaben stammen aus Suchauszügen der genannten Seiten; Volltexte (Methods-Teile) konnte ich nicht selbst lesen. Wo eine Zahl am Methods-Teil hängt, steht [prüfen].

---

## 0. Was am Gerüst nicht stimmt oder anders gesagt werden muss

1. **Hook „It was switched on in August“ stimmt nicht.** Der Singapur-Rack lief laut Straits Times (zitiert von Voz, letsdatascience) ab **Mitte Juli (16.7.2026)**, wurde am **6.8.** vorgeführt und am **17.8.** per Pressemitteilung vorgestellt. Sicher sagbar: „It went online this summer.“ oder „It was unveiled in August.“ (F3)
2. **„Jede Einheit braucht weniger Strom als ein Taschenrechner“ ist irreführend.** Das sagt CEO Hon Weng Chong, aber die Firma nennt selbst **~25–30 W pro CL1 inklusive Lebenserhaltung** und **800–1.000 W pro Rack**; ein Taschenrechner braucht Milliwatt. Der Satz stimmt nur für die Zellen allein. (F45–F47)
3. **„Eine Einheit ≈ Honigbiene“ gilt nur für die alte Zahl.** Für heutige CL1 (Doom, AFP, Singapur) nennt die Firma **~200.000 Neuronen** → zwischen Fruchtfliege (139.255) und Biene (~960.000). 800.000 war Pong 2022. (F34–F38)
4. **„Melbourne-Rack ≈ Mausgehirn“** nur als Größenordnung: 120 × 200.000 = 24 Mio. ≈ **ein Drittel** Mausgehirn (71 Mio.); mit 800.000 wären es 96 Mio. (F68)
5. **Runde 1 „mit viel mehr Trainingszeit holt die KI auf“** steht so nicht im Paper; verglichen wurde nur bei gleich wenig Übung (70 Spielrunden). Sicher sagbar: Mit langem Training spielt dieselbe KI-Familie Pong besser als Menschen (DQN 2015). (F50–F53)
6. **HIVE-„Spiel-Test“** war ein **Navigations-Test** (Spielfigur durch ein Gitter zum Ziel steuern). (F57)
7. **Doom-Zitat** „The system doesn't actually know it's playing Doom.“ stammt von **Alon Loeffler** (Senior Application Scientist, Cortical Labs) bei Decrypt. (F32)
8. **„Nur IIT würde etwas zusprechen“** geht auf *eine* Analyse von vier Theorien zurück (Montoya & Montoya 2023). Seths biologischer Naturalismus hält lebende Neuronen ebenfalls für den plausibleren Kandidaten. Sicherer: „Most leading theories say the structure isn't there.“ (F73, F76–F79)
9. **Seth-Wortlaut gefunden** (F76–F80). **HIVE-Paper nicht gefunden** (F59).
10. **B1-Link in Runde 1 vermutlich falsch:** richtig `https://www.cell.com/neuron/fulltext/S0896-6273(22)00806-6` (DOI 10.1016/j.neuron.2022.09.001).
11. **[B8] heißt im Journal anders als auf arXiv** (F49).

---

## 1. Hook (Titelversprechen, Singapur, Doom-Bild)

- **F1** ✓ Der Titel ist im Wortsinn wahr („Computers“): Cortical Labs verkauft den CL1 und vermietet Rechenzeit in der „Cortical Cloud“; auf den Chips läuft aber **kein KI-Modell**, sondern eine lernende Zellkultur, die per Python-Code Reize bekommt und antwortet (ABC 5.3.2025: CL1 „is not an AI in the same way that Chat-GPT … is an AI“). https://www.abc.net.au/news/science/2025-03-05/cortical-labs-neuron-brain-chip/104996484 · https://www.youtube.com/watch?v=M9b4j8CxHIE
- **F2** ✓ Singapur: **20 CL1 in einem Server-Rack** am NUS Life Sciences Institute, betrieben von NUS Medicine, DayOne und Cortical Labs; DayOne/NUS nennen es „the world's first independently operated biologically integrated server rack“ [Firma]. https://medicine.nus.edu.sg/news/nus-medicine-dayone-and-cortical-labs-unveil-biological-data-center-prototype-in-singapore/ · https://www.biospectrumasia.com/news/46/28208/dayone-launches-singapores-first-biological-data-centre-prototype-with-cortical-labs-and-nus-medicine.html
- **F3** Zeitlinie Singapur: Plan verkündet **11.3.2026** ✓ (NUS Medicine); in Betrieb ab **~16.7.2026** laut Straits Times, nur über Zweitquellen [prüfen]; Vorführung **6.8.2026** ✓; Pressemitteilung „Unveil“ **17.8.2026** ✓. https://medicine.nus.edu.sg/news/biological-data-centre-prototype-established-at-nus-medicine · https://voz.us/en/technology/260826/38608/singapore-has-launched-data-center-with-20-servers-each-containing-200-000-living-neurons-that-must-be-fed-every-three-days.html · https://letsdatascience.com/news/singapore-launches-neuron-powered-data-center-prototype-b7a82810
- **F4** ✓ Pflege: NUS-Techniker füttern die Kulturen **alle drei Tage**; laut Cortical bleiben sie **bis zu sechs Monate** lebensfähig [Firma]. https://e.vnexpress.net/news/news/data-center-at-southeast-asia-s-top-university-runs-on-living-human-brain-cells-fed-sugar-every-3-days-5113403.html · https://cryptobriefing.com/singapore-brain-cell-data-center/
- **F5** ✓ Ziel laut NUS: Übergang in ein kommerzielles DayOne-Rechenzentrum in Singapur; Einsatzfelder: neuro-inspirierte KI, biomedizinische Modelle, Wirkstoffsuche, Hirnerkrankungen. (Quellen wie F2/F3)
- **F6** ✓ Doom-Bild: offizielles Video „Living Human Brain Cells Play DOOM on a CL1“, Kanal Cortical Labs, **25.2.2026**, 6:29 Min. (Kurzfassung 0:31). https://www.youtube.com/watch?v=yRV8fSw6HaE · https://www.youtube.com/watch?v=B-vGalnn4_U
- **F7** ✓ „These cells were never inside a person's head“ stimmt: Sie wachsen aus Stammzellen, die aus **Blutspenden** gewonnen werden (AFP 31.5.2026). https://www.malaymail.com/news/tech-gadgets/2026/05/31/this-isnt-wacky-science-australian-researchers-teach-brain-cells-to-play-doom-on-nextgen-biocomputer/222045

## 2. Station 1: Woher kommen die Zellen?

- **F8** ✓ Weg laut Cortical Labs' eigenen Labor-Videos: Blutprobe → weiße Blutzellen (PBMC) isolieren → zu induzierten pluripotenten Stammzellen (iPSC) zurückprogrammieren → per Dual-SMAD- oder NGN2-Protokoll zu Nervenzellen. https://www.youtube.com/watch?v=Uk6YMYuvATc (11.6.2024) · https://www.youtube.com/watch?v=EURpmKn49ps (22.7.2024)
- **F9** [prüfen] Kagan: „They're grown from induced stem cells that are generated from a small amount of blood from volunteers“ (Presse zum CL1-Start, Ursprung nicht gefunden); laut Wikipedia auch Hautzellen, CEO Chong selbst sei einer der Spender.
- **F10** ✓ Grundlage: Reife Körperzellen lassen sich ohne Embryonen zu Stammzellen zurückprogrammieren (Nobelpreis 2012, Gurdon und Yamanaka). https://www.nobelprize.org/prizes/medicine/2012/summary/
- **F11** ✓ Auf dem Chip liegen die Neuronen als **flache Schicht** auf einer Elektrodenplatte, vernetzen sich von selbst, und dieselben Elektroden reizen und lesen sie (CL1: **59 Elektroden** laut New Atlas und Gigazine; ein arXiv-Paper nennt ein 64er-Feld [prüfen]). https://newatlas.com/brain/cortical-bioengineered-intelligence/
- **F12** [Firma] Lebenserhaltung im Gerät („body in a box“): Pumpen, Filter für Abfallstoffe, Temperatur- und Gasregelung; Zellen typisch bis ~6 Monate, mit Pflege laut Chong einzelne Kulturen ~580 Tage. https://www.theedgesingapore.com/amp/digitaledge/data-centres/why-cortical-labs-wants-human-neurons-data-centres
- **F13** ✓ Pong 2022 nutzte menschliche (aus iPSC) **und Maus-Neuronen** (aus Embryonen, Tag 15); der CL1 arbeitet mit menschlichen Zellen. https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182

## 3. Station 2: Der Trick mit dem Chaos (Pong 2022)

- **F14** ✓ Paper: Kagan, Kitchen, Tran, Habibollahi, Khajehnejad, Parker, Bhat, Rollo, Razi, **Friston**, „In vitro neurons learn and exhibit sentience when embodied in a simulated game-world“, *Neuron* 110(23), online **12.10.2022**, DOI 10.1016/j.neuron.2022.09.001. https://www.cell.com/neuron/fulltext/S0896-6273(22)00806-6 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9747182
- **F15** ✓ Rund **800.000 Zellen** (Mensch und Maus) auf einem Elektrodenchip; die Ballposition kommt als Reiz links/rechts in einer „Sinnes“-Zone an, die Aktivität einer „Motor“-Zone bewegt den Schläger [prüfen: 800.000 = ausgesäte Zellen, Methods]. https://www.biotechniques.com/cell-and-tissue-biology/the-neurons-that-came-to-play-in-vitro/
- **F16** ✓ Der Trick: Trifft der Schläger, bekommen alle Elektroden ein kurzes, **vorhersagbares** Signal; verfehlt er, kommen **4 Sekunden zufälliges Rauschen**; eine Belohnung gibt es nicht. https://www.sciencealert.com/watch-a-dish-of-brain-cells-figured-out-how-to-play-pong-in-5-minutes · https://www.eurekalert.org/news-releases/967077
- **F17** ✓ Lernen nach **~5 Minuten** Echtzeit-Spiel sichtbar (längere Ballwechsel), in Kontrollen ohne Rückmeldung nicht. https://www.sciencedaily.com/releases/2022/10/221012132528.htm
- **F18** ✓ Theorie, Free-Energy-Prinzip (Friston): Lebende Systeme handeln so, dass ihre Eingänge vorhersagbarer werden; im Preprint: „BNNs should adopt actions that avoid the states that result in unpredictable input.“ https://www.biorxiv.org/content/10.1101/2021.12.02.471005v2.full
- **F19** ✓ Unabhängige Stütze: Isomura, Kotani, Jimbo, Friston (RIKEN/UCL), *Nature Communications* 14:4547, **7.8.2023**: Ratten-Neuronen in der Schale lernten, zwei vermischte Signalquellen zu trennen, quantitativ so, wie das Prinzip es vorhersagt. https://www.sciencedaily.com/releases/2023/08/230807121933.htm
- **F20** ✓ Kagan (Cell-Press-Mitteilung 12.10.2022): „We have shown we can interact with living biological neurons in such a way that compels them to modify their activity, leading to something that resembles intelligence.“ [prüfen Wortlaut] https://www.newswise.com/articles/watch-brain-cells-in-a-dish-learn-to-play-pong-in-real-time
- **F21** [prüfen] Das oft zitierte Friston-Zitat „the cultures learned how to make their world more predictable by acting upon it … no sense of reward and punishment“ war im Original **nicht** auffindbar → nur nach Prüfung verwenden.
- **F22** ✓ Gegenstimme: 30 Forschende um Fuat Balci, *Neuron* 111(5):604–605 (2023), „A response to claims of emergent intelligence and sentience in a dish“: „sentience“ sei für dieses Verhalten der falsche Begriff. https://www.cell.com/neuron/fulltext/S0896-6273(23)00113-7
- **F23** Eigene Einordnung zum Top-Kommentar „they just want the chaos to stop“: Die Mechanik stimmt, „want“ ist vermenschlicht → besser „They settle into whatever keeps the noise away.“

## 4. Station 3: Vom Labor zum Produkt

**Brainoware (2023)**
- **F24** ✓ Cai, Ao, Tian, Wu, Liu, Tchieu, Gu, Mackie, Guo (Indiana University Bloomington), „Brain organoid reservoir computing for artificial intelligence“, *Nature Electronics* 6:1032–1039, **11.12.2023**. https://www.nature.com/articles/s41928-023-01069-w
- **F25** ✓ Aufgabe: 240 Aufnahmen von **8 Sprechern** (japanische Vokale), Ziel: den Sprecher erkennen; Trefferquote nach zwei Tagen Training von **51 % auf ~78 %**, schlechter als künstliche neuronale Netze. https://www.technologyreview.com/2023/12/11/1084926/human-brain-cells-chip-organoid-speech-recognition/ · https://www.labiotech.eu/trends-news/brainoware-brain-organoid-ai/
- **F26** ✓ Das Organoid ist nur das „Reservoir“, die Zuordnung macht ein Rechner dahinter; Lena Smirnova (Johns Hopkins): Die Organoide hören nicht wirklich, sie zeigen nur „a reaction“ auf Strompulse, Langzeitspeicherung ist nicht gezeigt (MIT TR) → im Film „told voices apart“, nicht „understood speech“.

**CL1 (2025)**
- **F27** ✓ CL1 vorgestellt am **2.3.2025** auf dem Mobile World Congress Barcelona, Preis **~35.000 $**, Auslieferung ab Sommer 2025 [prüfen Monat]. https://www.abc.net.au/news/science/2025-03-05/cortical-labs-neuron-brain-chip/104996484 · https://hothardware.com/news/cortical-labs-ships-35k-bio-computer-human-brain-cells-ai-research
- **F28** [Firma] Miete über Cortical Cloud („Wetware-as-a-Service“): **~300 $ pro Einheit und Woche**; seit 17.3.2026 „now open to the public“. https://www.techradar.com/pro/what-a-deal-you-can-now-rent-human-brain-cells-on-a-silicon-chip-for-7-days-for-less-than-a-nintendo-switch-2 · https://www.youtube.com/watch?v=M9b4j8CxHIE
- **F29** [prüfen] Laut The Register braucht die Firma etwa eine Woche, um Geräte für einen Auftrag vorzubereiten. https://www.theregister.com/2026/03/14/cortical_labs_biological_cloud/

**Doom (Feb. 2026)**
- **F30** ✓ ~**200.000** menschliche Neuronen auf einem CL1 bewegen sich, drehen sich, finden Gegner und schießen, sterben aber oft (Video 25.2.2026). https://www.tomshardware.com/tech-industry/artificial-intelligence/200-000-living-human-neurons-on-a-microchip-demonstrated-playing-doom-cortical-labs-cl1-video-shows-the-gameplay-and-explains-how-the-neurons-learn-the-game · https://decrypt.co/359697/human-brain-cells-play-doom-cortical-labs-experiment
- **F31** ✓ Programmiert vom unabhängigen Entwickler **Sean Cole** mit der Python-Schnittstelle in **etwa einer Woche** (Loeffler: „a few days instead of 18 months“ wie bei Pong); Code offen auf GitHub (GPL-3.0). https://github.com/SeanCole02/doom-neuron
- **F32** ✓ Zitate: Alon Loeffler: „The system doesn't actually know it's playing Doom. It's getting electrical signals and then spitting out responses.“ (Decrypt) · Kagan: „Is it an esports champion? Absolutely not.“ (Decrypt) · Loeffler: am Anfang „level of a beginner who's never played a video game before“ (AFP). https://decrypt.co/359697/human-brain-cells-play-doom-cortical-labs-experiment · https://www.pcgamer.com/hardware/a-petri-dish-of-human-neurons-has-learned-to-play-doom-the-cells-play-a-lot-like-a-beginner-whos-never-seen-a-computer-and-in-fairness-they-havent
- **F33** ✓ Kagan zu AFP (31.5.2026): Man sei „just scratching the surface“ dessen, was die Kulturen im CL1 können. https://www.taipeitimes.com/News/world/archives/2026/06/01/2003858341

## 5. Neuronenzahl im CL1: 200.000 oder 800.000? (Konflikt aufgelöst)

- **F34** ✓ **Pong 2022: ~800.000 Zellen, Mensch + Maus** (Presse zum Neuron-Paper, F15).
- **F35** [Firma] **CL1-Start 2025: „800,000 human neurons“** (Forbes 4.6.2025, IEEE Spectrum, Boing Boing); auch ein externes arXiv-Paper (2607.13644) schreibt ~8 × 10⁵ pro CL1. https://www.forbes.com/sites/johnkoetsier/2025/06/04/hardware-software-meet-wetware-a-computer-with-800000-human-neurons/
- **F36** ✓ **Doom 2026 und Rechenzentren: ~200.000** („in contrast to the 800,000 cells needed for the previous Pong experiment, only 200,000 cells were used to play Doom“; AFP 31.5.2026 „about 200,000“ pro Einheit; Straits Times zu Singapur laut Voz „at least 200,000“ pro CL1). https://www.hackster.io/news/scientists-taught-200-000-human-neurons-how-to-play-doom-dfca799d1c97
- **F37** ✓ Kagan selbst (Podcast The Giant's Shoulder, 18.5.2026, Kapitel 1:09:40 „Why 200,000 neurons beat 800,000“, 1:11:16 „Complexity and structure matter more than scale“): weniger Zellen schneiden bei manchen Aufgaben besser ab. https://www.youtube.com/watch?v=TXlJc4tu1F8
- **F38** **Empfehlung:** Für heutige CL1 (Doom, Rechenzentren) „about 200,000 neurons“, „800,000“ nur für Pong 2022; wo keine Zahl nötig ist: „a few hundred thousand human neurons“.

## 6. Station 4: Warum überhaupt? 20 Watt, Strom, Rechenzentren

- **F39** ✓ Gehirn ≈ **20 W**: so viel Leistung entsteht, wenn der vom Gehirn aufgenommene Zucker vollständig verbrannt wird („the oft-quoted 20 W“), Levy & Calvert, *PNAS* 118(18):e2008173118 (2021). https://pmc.ncbi.nlm.nih.gov/articles/PMC8106317
- **F40** ✓ Das Gehirn hat ~2 % des Körpergewichts, verbraucht aber ~20 % der Ruheenergie (Raichle & Gusnard, *PNAS* 99(16), 2002; nach Sokoloff). https://pmc.ncbi.nlm.nih.gov/articles/PMC124895
- **F41** ✓ IEA („Key Questions on Energy and AI“, April 2026): Strombedarf der Rechenzentren **+17 % in 2025** (~485 TWh), **KI-Rechenzentren +50 % in 2025**; bis 2030 ~950 TWh (~3 % des Weltstroms), KI-Rechenzentren verdreifachen sich. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary · https://eandt.theiet.org/2026/04/22/iea-warns-ai-data-centre-electricity-use-will-triple-2030
- **F42** ✓ Vorbericht „Energy and AI“ (10.4.2025): 2024 ~415 TWh (~1,5 % des Weltstroms), 2030 ~945 TWh; **Überschneidung:** „Can Superintelligence Grow Forever?“ hat die Verdopplung bis 2030 schon gesagt → hier nur die +50 % von 2025. https://www.iea.org/reports/energy-and-ai/executive-summary
- **F43** ✓ Melbourne: Prototyp-„Bio Data Centre“ mit **120 CL1**, betreibt nach einer Testphase die Cortical Cloud, bekannt gemacht am **9./10.3.2026** (Bloomberg 9.3.2026). https://ia.acs.org.au/article/2026/this-melbourne-data-centre-runs-on-human-brain-cells.html · https://www.bloomberg.com/news/articles/2026-03-09/human-brain-cells-run-new-data-centers-in-singapore-melbourne
- **F44** [Firma, Plan] Singapur soll mit DayOne in Phasen auf **bis zu 1.000 Einheiten** wachsen, Start mit 20 an der NUS. https://www.tomshardware.com/tech-industry/artificial-intelligence/human-brain-cells-set-to-power-two-new-data-centers-thanks-to-body-in-the-box-cl1-cortical-labs-targets-the-ai-energy-crisis-with-biological-computer-that-reportedly-uses-less-energy-than-a-calculator · https://futurism.com/artificial-intelligence/new-data-centers-human-brain-cells
- **F45** [Firma] CEO Hon Weng Chong: jede CL1-Einheit brauche **weniger Strom als ein Taschenrechner** (Bloomberg-Bericht, Futurism, Tom's Hardware, März 2026).
- **F46** [Firma] **Widerspruch dazu:** Cortical nennt ~**25 W** pro Einheit und **800–1.000 W** pro vollem Rack, Chong selbst ~**30 W inkl. Lebenserhaltung**; ein Taschenrechner braucht Milliwatt, der Satz stimmt also nur für die Zellen. https://thenextweb.com/news/singapore-biological-data-centre-cortical-labs-neurons · https://www.pk-sharma.com/briefing/biological-data-centre-singapore-three-claims
- **F47** Eigene Rechnung mit Firmenzahlen: Ein CL1 zieht mit ~30 W etwa so viel wie ein ganzes menschliches Gehirn (~20 W), hat aber nur ~1/430.000 seiner Neuronen → die Sparsamkeit steckt in den Zellen, der Aufwand in der Lebenserhaltung.
- **F48** ✓ Es gibt **keinen** öffentlichen Test, bei dem ein CL1-Rack dieselbe KI-Arbeit erledigt wie ein GPU-Rack, die Effizienz ist also nicht gemessen; Chong selbst: Silizium sei besser für schnelle, präzise, wiederholbare Rechnungen wie bei großen Sprachmodellen, Ziele seien Wirkstoffsuche, Betrugserkennung, lernende Roboter. https://cryptobriefing.com/singapore-brain-cell-data-center/ · https://www.techrepublic.com/article/news-biological-computing-rack-apac-singapore/

## 7. Station 5: Das Duell

**Runde 1, Lerntempo (Paper)**
- **F49** ✓ Khajehnejad, Habibollahi, Paul, Razi, Kagan, „Dynamic Network Plasticity and Sample Efficiency in Biological Neural Cultures: A Comparative Study with Deep Reinforcement Learning“, *Cyborg and Bionic Systems*, **4.8.2025**, DOI 10.34133/cbsystems.0336 (Preprint arXiv 2405.16946 vom 27.5.2024 unter anderem Titel). https://spj.science.org/doi/10.34133/cbsystems.0336 · https://pubmed.ncbi.nlm.nih.gov/40762022/ · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12320521/
- **F50** ✓ Aufbau: DishBrain-Pong mit menschlichen (iPSC) und Maus-Kulturen gegen **DQN, A2C und PPO**, wobei die KI für den fairen Vergleich genauso wenig Übung bekam: **70 Spielrunden** (≈ eine 20-Minuten-Sitzung [prüfen]).
- **F51** ✓ Ergebnis: Die Zellkulturen hatten die meisten Treffer pro Ballwechsel und am wenigsten sofort verlorene Aufschläge („aces“) und lagen in den **letzten 15 Minuten** bei Treffern und Ballwechsel-Länge signifikant vor allen drei KI-Verfahren; PPO war am schwächsten. https://www.eurekalert.org/news-releases/1106251
- **F52** ✓ Grenzen laut Autoren: nur bei knapper Übungszeit, einfache Aufgabe, kleine Netze; ob die KI mit mehr Training aufholt, wurde **nicht** gemessen.
- **F53** ✓ Hintergrund: DQN (DeepMind, *Nature* 518, 2015) erreichte in Atari-Pong nach langem Training 18,9 Punkte gegen 9,3 eines menschlichen Testspielers. https://research.google/blog/from-pixels-to-actions-human-level-control-through-deep-reinforcement-learning/
- **F54** [prüfen] Monash-Mitteilung (12.8.2025): Habibollahi „While artificial agents often require millions of training steps to show improvement, these neural cultures adapt much faster“; Razi „This work hints at living systems that can outlearn machines.“ https://www.eurekalert.org/news-releases/1094351

**Runde 2, Teamwork (HIVE, Okt. 2026)**
- **F55** ✓ Cortical Labs stellte **„HIVE“ (15 vernetzte CL1)** auf der ersten International Conference on Organoid Intelligence (ICOI) vor, Washington D.C., **26.–27.10.2026**, im Bloomberg Center der Johns Hopkins University. https://organoidintelligence.org/icoi/ · https://matr.net/news/linking-15-biological-computers-surpasses-conventional-ai-performance/
- **F56** [Firma, Vortrag] Symbolerkennung: **7 verbundene Einheiten** steigerten die Trefferquote von **~80 % auf ~99 %**. https://newatlas.com/ai-humanoids/living-computers-forge-a-hive-mind-and-work-together-to-outsmart-ai/
- **F57** [Firma, Vortrag] **Navigations-Test** (Figur durch ein Gitter zum Ziel steuern): DQN **~32 % der Höchstpunktzahl**, beste Einzel-Einheit **~40 %**, mehrere Einheiten, die gemeinsam über die Züge abstimmen, **~70 %**. (New Atlas, wie F56)
- **F58** ✓ Johnson Zhou (Cortical Labs): „One culture might perform particularly well on a given day while another does not … When cultures work together, those individual differences have less influence over the final result.“ (New Atlas)
- **F59** ✓ Stand 6.11.2026: **kein Paper, kein Preprint** zu HIVE gefunden, die Presse nennt die Werte selbst vorläufig; DQN ist ein Verfahren von 2013/2015, keine heutige Spitzen-KI.

**Runde 3, alles andere**
- **F60** [Firma] Lebensdauer bis ~6 Monate, Fütterung alle 3 Tage (F4), Leistung schwankt von Tag zu Tag (F58).
- **F61** [prüfen] Thomas Hartung (Johns Hopkins): Organoide werden innerhalb einer Trainingssitzung besser und vergessen bis zum nächsten Tag alles (Podcast The Giant's Shoulder, 29.10.2026, Kapitel 24:38 „They Learn, Then Forget Everything Overnight“). https://www.youtube.com/watch?v=4xNxOXNCG-E
- **F62** ✓ Weder Brainoware (F26) noch die Bristol-Studie (F97) haben Langzeit-Lernen gezeigt.
- **F63** ✓ Der Firmenchef selbst sieht Silizium bei schnellen, präzisen Rechnungen vorn (F48) → Ziel Mischrechner, nicht Ersatz.

## 8. Station 6: Ist da jemand drin?

**Größenleiter**
- **F64** ✓ Fruchtfliege: **139.255 Neuronen** (FlyWire, Dorkenwald u. a., *Nature* 634:124–138, 2.10.2024). https://pmc.ncbi.nlm.nih.gov/articles/PMC11446842
- **F65** ✓ Honigbiene: **~950.000–960.000** Neuronen (Menzel & Giurfa 2001; Witthöft 1967) → „about a million“. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=109328
- **F66** ✓ Maus: **~71 Mio.** (70,89 Mio.; Herculano-Houzel, Mota, Lent, *PNAS* 2006). https://pmc.ncbi.nlm.nih.gov/articles/PMC1567708/
- **F67** ✓ Mensch: **~86 Mrd.** (86,1 ± 8,1 Mrd.; Azevedo u. a., *J Comp Neurol* 513, 2009, DOI 10.1002/cne.21974).
- **F68** Eigene Rechnung: 1 CL1 à 200.000 ≈ 1,4 Fruchtfliegen ≈ 1/5 Biene (à 800.000 ≈ 0,8 Biene) · Singapur-Rack (20): 4 Mio. (bzw. 16 Mio.) · Melbourne (120): 24 Mio. ≈ 1/3 Maus (bzw. 96 Mio. ≈ 1,4 Mäuse) · Singapur-Ziel (1.000): 200 Mio. ≈ 3 Mäuse (bzw. 800 Mio. ≈ 11) · ein Menschenhirn ≈ 430.000 CL1 · ein Bristol-Organoid ≈ 10.000.
- **F69** ✓ **Nicht wie ein Gehirn verschaltet:** Jede Einheit ist eine eigene flache Zellschicht in einer eigenen Schale; im HIVE-Verbund reden die Einheiten über Computer, nicht über Synapsen; ~59 Elektroden für Hunderttausende Zellen (F11, F55).
- **F70** [prüfen] Hartung: Organoide kommen ohne Blutgefäße nur auf einige hunderttausend Zellen und sterben innen ab (Giant's Shoulder Clips, 28.10.2026); laut STAT (17.11.2025) sagt er, es könne Jahrzehnte dauern, bis Organoid-Intelligenz ein System so klug wie eine Maus antreibt. https://www.youtube.com/watch?v=W2Tuyb4P9Hw · https://www.statnews.com/2025/11/17/brain-organoid-pioneers-fear-backlash-over-biocomputing/

**Stand der Bewusstseinsforschung**
- **F71** ✓ US National Academies (Bericht **8.4.2021**): In absehbarer Zeit sei es äußerst unwahrscheinlich, dass neuronale Organoide Bewusstsein, Gefühle oder Schmerz haben, weil ihnen Komplexität, Vernetzung und Reife fehlen [prüfen Wortlaut]. https://www.nationalacademies.org/read/26078 · https://www.clinician.com/articles/148522-irbs-facing-ethically-controversial-questions-on-brain-research
- **F72** ✓ Asilomar-Treffen **Nov. 2025** (Sergiu Pașca, Hank Greely, Stanford): breite Einigkeit, dass heutige Organoide nicht bewusst sind, Vorschlag einfacher laufender Prüfungen, keine Verbote („bright lines“); Stanford-Bericht **Sept. 2026** empfiehlt eine weltweite Ethik-Infrastruktur. https://news.stanford.edu/stories/2026/09/brain-organoid-research-ethical-framework · https://www.kuow.org/2025-12-25/experts-met-to-discuss-the-ethics-of-using-organoids-in-research
- **F73** ✓ Montoya & Montoya, *Entropy* 25(9):1328 (13.9.2023), prüfen vier große Theorien (Global Workspace, Recurrent Processing, Higher-Order, IIT) am DishBrain-Fall: nur IIT lässt so einer Kultur überhaupt Raum für Erleben. https://www.mdpi.com/1099-4300/25/9/1328
- **F74** ✓ Gegenstimmen: Bayne, Seth, Massimini, „Are There Islands of Awareness?“, *Trends in Neurosciences* 43(1):6–16 (2020): Bewusstsein könnte auch in Systemen ohne Körper und Umwelt wie Hirn-Organoiden vorkommen und wäre dort kaum nachweisbar (DOI 10.1016/j.tins.2019.11.003); ein Aufsatz von 2025 hält sicheres Abwinken für „increasingly biologically untenable“ [prüfen Autoren]. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12485551/
- **F75** ✓ Übersicht *AJOB Neuroscience* 2025 (Van Gyseghem, Dierickx, Barnhart): Die allgemeine Unsicherheit über Bewusstsein lähmt die Debatte, „Organoid-Intelligenz“ sei die greifbarere Frage. https://www.tandfonline.com/doi/pdf/10.1080/21507740.2025.2519459

**Anil Seth (Rückgriff auf Film #6), echter Wortlaut**
- **F76** ✓ Humanists UK, Interview **28.10.2025**: „Personally, I worry more about accidentally creating conscious artefacts in things like 'brain organoids' (a branch of synthetic biology) than in the next iteration of ChatGPT.“ [prüfen am Original, als Zitatkarte geeignet] https://humanists.uk/2025/10/28/dissolving-the-problem-of-consciousness-interview-with-anil-seth/
- **F77** ✓ StarTalk, **24./25.1.2025**: „I think artificial consciousness for me is much more likely to arise not in the circuits of some future language model, but in laboratories that are building things like organoids. But the reason we get less worked up about it is because at least so far, these organoids, they don't really do anything very interesting.“ [prüfen Wortlaut + Minute] https://startalkmedia.com/show/is-consciousness-everywhere-with-anil-seth/ · https://www.youtube.com/watch?v=vxux1OkHBIw → stark für den Film: 2025 „they don't really do anything very interesting“, 2026 spielen sie Doom und stehen im Rechenzentrum.
- **F78** [prüfen] Conspicuous Cognition (Dan Williams), „AI Sessions #9“, Feb. 2026: „Here I'm worried less about AI and more about this other emerging technology of neurotechnology and synthetic biology, where people are building little mini-brains in labs constructed from biological neurons.“ https://www.conspicuouscognition.com/p/ai-sessions-9-the-case-against-ai
- **F79** ✓ Fachartikel: Seth, „Conscious artificial intelligence and biological naturalism“, *Behavioral and Brain Sciences* 2025: echtes künstliches Bewusstsein sei auf heutigem Kurs unwahrscheinlich, werde aber plausibler, je hirn- oder lebensähnlicher Systeme werden. https://pubmed.ncbi.nlm.nih.gov/40257177/
- **F80** ✓ Dieselbe Haltung schon früher: Brain Inspired BI 117 (2021, ~1:25:33: „I'm actually worried about things like brain organoids“); Nature-Podcast 2020. https://braininspired.co/podcast/117/ · https://www.nature.com/articles/d41586-020-03033-6
- **F81** **Überschneidung:** Film #6 nutzt Seths TED-Clip 2026 (9:32–9:51, „it's life, not computation …“) → hier nicht wiederholen; der Organoid-Satz ist neu und folgt logisch aus seiner Position.

**Ethik, Zustimmung, Regeln**
- **F82** ✓ Johns Hopkins, **„embedded ethics“**: Smirnova, Hartung u. a., „Organoid intelligence (OI): the new frontier in biocomputing and intelligence-in-a-dish“, *Frontiers in Science*, **28.2.2023**: Ethiker, Forschende und Öffentlichkeit prüfen ethische Fragen fortlaufend und gemeinsam, schon während der Forschung. https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1017235/full
- **F83** ✓ **Baltimore Declaration** (Hartung u. a., *Frontiers in Science*, 28.2.2023) aus dem ersten Organoid-Intelligence-Workshop (online, 22.–24.2.2022): Aufruf, OI zu erforschen und die ethischen Folgen von Anfang an mitzudenken. https://www.frontiersin.org/journals/science/articles/10.3389/fsci.2023.1068159
- **F84** [prüfen] Hartung: Ein Bioethiker sitzt **jede Woche** in seinen Labortreffen (Beschreibung zu Giant's Shoulder Clips, 28.10.2026). https://www.youtube.com/watch?v=W2Tuyb4P9Hw
- **F85** ✓ STAT (17.11.2025): Organoid-Pioniere fürchten, Biocomputing-Hype könne eine Gegenreaktion und pauschale Gesetze auslösen; Smirnova: „We're not trying to create a mind in a dish.“ https://www.statnews.com/2025/11/17/brain-organoid-pioneers-fear-backlash-over-biocomputing/
- **F86** ✓ US-Förderprogramm NSF „BEGIN OI“ (NSF 24-508, 30 Mio. $) verlangt Teams, zu denen ausdrücklich auch Ethiker und Sozialwissenschaftler gehören (STAT schreibt sogar „Ethiker als Co-Leiter Pflicht“ [prüfen]). https://www.nsf.gov/funding/opportunities/emerging-frontiers-research-innovation-efri/nsf24-508/solicitation
- **F87** ✓ Cortical Labs' eigene Ethik-Arbeit: Kagan, Gyngell, Lysaght, Cole, Sawai, Savulescu, „The technology, opportunities, and challenges of Synthetic Biological Intelligence“, *Biotechnology Advances* 68 (2023) [prüfen Inhalt: Spender-Zustimmung, Beobachtung auf Empfindungsfähigkeit]. https://linkinghub.elsevier.com/retrieve/pii/S0734975023001404
- **F88** ✓ Zustimmung: Kataoka, Gyngell, Savulescu, Sawai, *Science and Engineering Ethics* 30(1):3 (2024) zu Spende und Einwilligung bei Hirn-Organoid-Forschung; in Asilomar forderten Bioethiker Leitplanken, damit Menschen zustimmen, bevor aus ihren Zellen Organoide werden (F72).
- **F89** [prüfen, Qualität unklar] Kritischer Prüfbericht (ResearchGate, 2025/26): Weder Cortical Labs noch FinalSpark hätten eine Richtlinie zu Spenderrechten oder Einwilligungsunterlagen veröffentlicht; Kagan habe öffentlich gesagt, Spender sollten eine Vergütung vereinbaren können. https://www.researchgate.net/publication/403004894_Governance_Gaps_and_Ethical_Trajectories_in_Commercial_Biocomputing_An_Investigative_Audit_of_Cortical_Labs_and_FinalSpark
- **F90** [prüfen] Meinungsstudien 2026 [B13]: Wer Biocomputern mehr Bewusstsein zuschreibt, unterstützt die Forschung eher. https://academic.oup.com/nc/article/2026/1/niag023/8728409 · https://www.nature.com/articles/s41598-026-43243-y

## 9. Was Gutes daraus wird

- **F91** ✓ Epilepsie-Modell: Watmuff u. a. (Cortical Labs), *Communications Biology* 2025 (Mitteilung 17.6.2025, Preprint 29.1.2025): An übererregten menschlichen Nervenzellen wurden drei Antiepileptika getestet (Phenytoin, Perampanel, Carbamazepin); alle dämpften das Überfeuern, nur Carbamazepin (200 µM) verbesserte zugleich das Pong-Spiel. https://www.nature.com/articles/s42003-025-08194-6 · https://www.labonline.com.au/content/life-scientist/news/epilepsy-disease-model-treated-in-a-laboratory-dish-1567710702
- **F92** ✓ Weg vom Tierversuch: FDA (April 2025) und NIH (2025) setzen auf neue Methoden wie Organoide statt reiner Tierversuche; Hartung: menschliche Organoide zeigen besser als Tiere, was im Menschen passiert, aber Hirn-Organoide ähneln eher einem fötalen als einem erwachsenen Gehirn. https://hub.jhu.edu/2025/07/16/3-questions-organoids-animal-testing-alternatives-thomas-hartung/ · https://engineering.jhu.edu/news/the-end-of-animals-only-testing-brings-opportunities-and-challenges/
- **F93** [prüfen] Demenz: Hartung erwähnt „A $15 Million Bet On Alzheimer's“ (Giant's Shoulder 29.10.2026, Kapitel 37:00), Details unbekannt; sonst für Demenz nur allgemein „disease models“ sagen.
- **F94** ✓ Einsatzfelder laut NUS/DayOne: neuro-inspirierte KI, biomedizinische Modelle, Wirkstoffsuche, Hirnerkrankungen (F5).

## 10. Bristol: Organoide lesen Braille (Okt. 2026)

- **F95** ✓ University of Bristol, *Frontiers in Artificial Intelligence*, **15. oder 16.10.2026** [prüfen]: Ein Roboterarm führte einen Tastsensor über eine 3D-gedruckte Tafel mit allen **26 Braille-Buchstaben**, die Signale gingen als Strompulse über 8 Elektroden in je ein Organoid. https://www.frontiersin.org/news/2026/10/16/mini-brain-organoids-reading-braille-biohybrid-computing-frontiers-artificial-intelligence · https://www.the-scientist.com/brain-organoids-can-read-braille-signals-75186
- **F96** ✓ Ergebnis: **ein Organoid 61 %** richtig (Zufall ~4 %), **drei zusammen 83 %**; jedes Organoid <1 mm, ~**10.000 Neuronen**. https://www.biotechniques.com/bioengineering-biophysics/human-brain-organoids-read-braille-in-major-biohybrid-computing-breakthrough/
- **F97** ✓ Grenze (Liu, Bristol): „We showed that tactile information could be encoded, processed through the organoids, and decoded, but we did not demonstrate learning or long-term changes in the organoids.“; warum drei besser sind als eins, ist offen (vielleicht ergänzen sie sich) → passt zum HIVE-Gedanken.

## 11. Rahmen „seventy years“

- **F98** ✓ 1956 Dartmouth-Konferenz (Begriff „artificial intelligence“), 1958 Rosenblatts Perceptron an der Cornell (NYT 8.7.1958), gebaut, um das Gehirn zu verstehen → „for about seventy years“. https://news.cornell.edu/node/313946

---

## 12. Vorsicht / nicht sagen

- **„AI runs on brain cells“ / „AI now runs …“** → Auf den Chips läuft kein KI-Modell, sondern lernende Zellkulturen (F1).
- **„Brain cells beat modern AI“** → Geschlagen wurde DQN (2013/15) in einfachen Aufgaben; HIVE ist ein Konferenzvortrag ohne Paper; das Paper von 2025 zeigt nur: schneller bei sehr wenig Übung (F49–F59). Moderne sparsame Lernverfahren (z. B. EfficientZero 2021) schaffen Atari-Spiele mit ~2 Stunden Spielzeit [prüfen, nur Hintergrund].
- **„They're conscious / sentient / suffering“, „Doom is hell“** → kein Beleg; „sentience“ im Paper von 2022 meinte nur Reaktion auf Reize und wurde scharf kritisiert (F22, F71–F75).
- **„They want the chaos to stop“, „they want things“** → vermenschlicht (F23).
- **„They play Doom“ ohne Einschränkung** → spielen schlecht, „doesn't actually know it's playing Doom“ (F32).
- **„Uses less power than a calculator“** → stimmt nur für die Zellen; das Gerät zieht ~25–30 W (F45–F47).
- **„Replaces GPUs / data centres“** → kein Vergleichstest; der CEO selbst sieht Silizium bei Sprachmodellen vorn (F48).
- **„A mouse brain in a rack“, „brain in a box“, „mini-brain“ für den CL1** → 120 getrennte flache Zellschichten, nicht verschaltet; Organoide (Bristol, Brainoware) sind 3D, aber ohne Blutgefäße und eher fötal (F68–F70, F92).
- **„Switched on in August“** → lief ab Juli, vorgestellt im August (F3).
- **„Brainoware understood speech“** → unterschied Sprecher, die Zuordnung macht ein Rechner, Smirnova: nur „a reaction“ (F25–F26).
- **„Taught themselves Braille“** → kein Lernen gezeigt (F97).
- **„800,000 neurons in every CL1“** → uneinheitlich, heute ~200.000 (F34–F38).
- **„They die after six months“** → bis zu ~6 Monate typisch, mit Pflege länger (F12).
- **„100,000 times more efficient than AI“** (Hossenfelder, [B11]) → ohne Primärquelle nicht verwenden.
- **„Only one theory (IIT) would …“** → eine Analyse; besser „most leading theories say no“ (F73).
- **„The first biocomputer“** → nur als „first commercial … (company claim)“; FinalSpark (Schweiz) bietet ebenfalls Fernzugriff auf Organoide [prüfen seit wann].
- **„Neurons from a person's brain“** → aus Blut-/Hautzellen gezüchtet, nie in einem Kopf (F7–F8).

## 13. Nach dem Film weiß ich …

1. … dass die Neuronen auf diesen Chips aus einer **Blutspende** stammen: Blutzellen → Stammzellen → Nervenzellen, nie Teil eines Gehirns (F7–F8).
2. … dass sie **ohne Belohnung** lernen: Treffer = geordnetes Signal, Fehlschlag = 4 Sekunden Rauschen, und nach etwa **5 Minuten** spielen sie Pong besser (*Neuron*, 2022) (F16–F17).
3. … dass man so einen Rechner für **~35.000 $ kaufen** oder für **~300 $ pro Woche mieten** kann und dass seit März 2026 **120** davon in Melbourne und seit Sommer 2026 **20** in einem Rack in Singapur laufen (F27–F28, F43, F2–F3).
4. … dass ein CL1 heute etwa **200.000 Neuronen** hat, mehr als eine Fruchtfliege (139.255), weniger als eine Biene (~1 Mio.), und dass das ganze Melbourne-Zentrum auf ein **Drittel Mausgehirn** kommt, aber in 120 getrennten Schalen (F36, F64–F69).
5. … dass Zellkulturen bei gleich wenig Übung Pong **schneller lernten als drei Standard-KI-Verfahren** (Paper 2025) und 15 vernetzte Einheiten eine **ältere** KI in einem Navigations-Test schlugen (70 % gegen 32 %, Vortrag ohne Paper) (F49–F59).
6. … dass mein Gehirn mit **~20 Watt** läuft, KI-Rechenzentren 2025 **50 % mehr Strom** brauchten (IEA) und ein CL1 samt Lebenserhaltung selbst **~30 W** zieht (F39–F41, F46).
7. … dass es **keinen Beleg für Erleben** in diesen Kulturen gibt, ein Forscher wie Anil Seth sich aber eher um Organoide sorgt als um ChatGPT (F71–F77).
8. … dass an menschlichen Nervenzellen schon **Epilepsie-Medikamente getestet** wurden und Forschende Regeln wie **„embedded ethics“** und Spender-Zustimmung jetzt aufbauen (F82–F91).

## 14. Überschneidungen mit früheren Kanal-Skripten

Grep über alle 81 VO-Dateien (`vo*.txt`, `*-vo-v*.txt`) unter `/mnt/project-files/scenario` nach watt(s), IEA, organoid, Friston, Cortical, neuron, Pong, IIT, Seth, brain cell, calculator, bee/fly/mouse:
- **„Can Superintelligence Grow Forever?“** (`film-ueberfluss/vo-v2…v4.txt`, Z. 9 „every watt“, Z. 11 IEA: Rechenzentren bis 2030 doppelter Strom; dazu Google-Prompt-Energie, Jevons, Phoenix-Test). Energie war dort ein ganzer Akt → hier **nur ein Satz** und nur die neue Zahl (+50 % KI-Rechenzentren 2025), keine Verdopplung 2030, kein Jevons.
- **„AI Isn't Conscious“** (`schreibraum/film-07/film-06-vo-v1…v3.txt`, Z. 68–74: Anil Seth, Fühlen beginnt im Körper, der am Leben bleiben will; TED-Clip 9:32–9:51 benutzt). Hier Seth nur mit seinem **Organoid-Satz** (neu), nicht mit „life, not computation“.
- `film-singularitaet/vo-v1.txt` Z. 100 „Alan Watts“ = Fehltreffer.
- Kein früheres Skript nutzt Organoide, Friston, Cortical Labs, Pong/DishBrain, die 20 Watt oder die Neuronen-Größenleiter. In der Recherche zu Film #6 (`schreibraum/film-07/perspektiv-recherche-bewusstsein.md`, Z. 692) stand „Hirn-Organoide machen Seth mehr Sorgen als Chatbots“ als unbestätigt → jetzt belegt (F76–F80).

## 15. Offen [prüfen] (Rest)

- Methods-Zahlen der Paper (800.000 ausgesäte Zellen 2022; 70 Runden ≈ 20 Min. 2025): PMC-Volltexte lesen, sobald `pmc.ncbi.nlm.nih.gov` und `arxiv.org` in den Netzwerk-Einstellungen der Sitzung erlaubt sind.
- Singapur-Start 16.7.: Straits-Times-Original.
- Seth: StarTalk-Minute und Wortlaut, Datum Conspicuous Cognition; Humanists-UK-Text gegenlesen.
- HIVE: Folien oder Firmenmitteilung; ohne Paper bleibt Runde 2 kurz und klar „company talk“ (wie im Gerüst vorgesehen).
- NASEM-Wortlaut; Bristol-Datum (15. oder 16.10.); Hartung-Aussagen (Vergessen über Nacht, Ethiker im Labortreffen) per Transkript.
