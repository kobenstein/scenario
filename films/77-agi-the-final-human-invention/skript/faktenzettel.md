# Faktenzettel · #77 „AGI: The Final Human Invention“

Stand: Mittwoch, 25.11.2026 (Recherche 24.–25.11.2026). Für den Texter. Stationen wie in `geruest-v1.md` (Hook, Station 1–6). O-Töne, Zitatkarten und Videos zum Meiden in `clips.json`. Die Turing- und Good-Zitate stammen aus `stopp1-thema-titel.md` (Quote Investigator mit Scans).

**Sicherheit:** **sicher** = Primärquelle oder mehrere unabhängige Berichte · **umstritten** = Fachleute oder Quellen widersprechen sich, vorsichtig formulieren · **dünn** = nur eine Quelle, nur Firmenangabe oder nur ein Suchauszug, im Faktencheck am Original prüfen oder weglassen.
**Art:** **Fakt** = ist passiert oder wurde gemessen · **Schätzung** = Zahl, die jemand berechnet oder schätzt · **Prognose** = Vorhersage, Ziel oder Plan.
**Quellenlage:** Aus der Cloud kam ich an keine Quellseite heran (WebFetch ohne Namensauflösung, curl ohne Antwort, arXiv 403 vom Proxy). Alle Inhalte stammen aus Suchauszügen (Websuche 24.–25.11.2026). Erreichbar war nur die YouTube-Datenschnittstelle (Titel, Kanal, Datum, Länge, Lizenz, `licensedContent`, Beschreibung, Kapitel). YouTube-Untertitel und Ton waren gesperrt (Bot-Prüfung), vidIQ hat kein Guthaben (bis 19.12.2026). **Kein Clip-Wortlaut und keine Zeitmarke ist am Video geprüft.** Frühere Filme habe ich nur in den Dateien der ersten Ebene von `scenario/film-*/` durchsucht (Faktenzettel, clips.json, Sprechtexte).
**Ton:** Staunen (§1.1), kein Doom, kein Hype. Jede Station zeigt erst, was KI heute nachweislich gefunden hat, dann den ehrlichen Haken, dann das Urteil. Firmen und ihre Chefs sind Stimmen mit Eigeninteresse, das Interesse im Satz davor nennen (§1.9a). Keine Medizin-Station (§2.5c): Lila Sciences nur mit dem Katalysator erzählen, Isomorphic nicht nennen. Kein Jensen Huang, auch nicht im Bild (§2.5f).

---

## 0 · Bitte zuerst lesen: Korrekturen am Gerüst und Überschneidungen

1. **Der stärkste geprüfte Hook-Fall ist vom Mai, nicht aus den letzten drei Monaten.** Die Widerlegung der Einheitsabstand-Vermutung (OpenAI, 20.5.2026) haben externe Mathematiker geprüft und gelobt (H1). Alles Frischere ist umstritten oder ungeprüft: Navier-Stokes (8.9., Streit, schon in #55), OpenAIs rund 722 Manuskripte (6.10., Boykottaufruf), Yang-Mills (27.10., Prüfung läuft), Riemann (20.11., #67), VP ≠ VNP (23.11., „no human mathematician has checked the proof“). → Im Hook „this year“ sagen, nicht „this month“. Die frischen Fälle zeigen in Station 4 das Tempo („since then, a new claim almost every month“), sie sind kein Hook.
2. **Navier-Stokes hat #55 schon im Sprechtext:** „OpenAI says it ran about ten thousand copies of its math machine, for a result mathematicians still dispute.“ Dazu kommt Sarah Friars Satz („we are still holding that model“). → Weder die Zahl noch den Fall wiederholen.
3. **Riemann (Alpöge mit Claude, 20.11.) gehört #67**, ebenso Taos Blog und der Tao-Clip von dort. → Höchstens ein Rückgriff ohne Zahl und ohne Clip.
4. **Hassabis ist seit 5.8.2026 nicht mehr CEO von Google DeepMind.** Er ist jetzt Chair von Google DeepMind und Chief Scientist von Alphabet, DeepMind leitet Koray Kavukcuoglu (F13). Das Stanford-Gespräch (C1) fand im Mai statt, also vor dem Wechsel, und der Videotitel sagt noch „CEO“. → Bauchbinde „Co-founder, Google DeepMind“.
5. **Goods Satz ist im Sprechtext noch frei.** „Singularity Friday“ sprach nur die Idee aus („the same loop is what people mean by the singularity in artificial intelligence“) und nannte Good nur in `quellen.md`. Turings Sätze („feeble powers“, „take control“, „Erewhon“) stehen in keinem früheren Film.
6. **„Stoffe, die die Natur nie gemacht hat“ und „Akkus, die eine Woche halten“ haben 2026 keinen Beleg im Alltag.** Die KI-entworfenen Supraleiter, die wirklich gebaut wurden, funktionieren nur bei 2,5–6,5 Kelvin, also nahe dem absoluten Nullpunkt (F23). Ein von KI entdecktes Material in Massenproduktion habe ich nicht gefunden (F25). → In Station 3 die gebauten Stoffe als Fakt erzählen und den Alltag als „imagine“ (Prognose), dazu ehrlich den Haken.
7. **Bei der Fusion gibt es keinen KI-Durchbruch.** KI steuert und simuliert dort (PACMAN, IAEA-Bericht), Strom liefert sie keinen. SPARC, Commonwealth Fusion, TORAX und DeepMinds Plasmasteuerung von 2022 stehen schon in `film-gute-ki` und `film-energie` (Beats), ebenso der Microsoft-PNNL-Elektrolyt (32 Mio. Kandidaten, bis 70 % weniger Lithium) und PJM mit Google Tapestry. → Alles davon weglassen. Der stärkste frische Energie-Fall ist ein Katalysator für grünen Wasserstoff (Lila, Sept. 2026), belegt aber nur durch die Firma selbst.
8. **„Nicht ein Durchbruch alle 20 Jahre, sondern Tausende Versuche parallel“ (Station 2) ist eine Prognose.** Belegt ist nur das Tempo heutiger Labore: Lila 2.942 Katalysatoren in drei Monaten (laut Firma 17-mal schneller), Periodic Labs rund 100 Experimente pro Tag (Ziel 1.000), AlloyBot 150 Legierungen pro Woche.
9. **Tao jubelt nicht.** Er hat am 11.9.2026 mit 24 anderen Fields-Medaillenträgern „A Severe Misalignment of AI in Mathematics“ unterschrieben, warnt vor „proof indigestion“ und nennt die Erfolge der KI eher Tempo als Tiefe (F31, F32). → Für C3 ist er eine ehrliche Stimme. Die Fields-Erklärung ist die beste Brücke zu Station 5, denn schon heute streiten Menschen darüber, **wer entscheidet, woran die KI arbeitet**.
10. **Bei der Kontrolle ist viel schon verbraucht.** #31 hat im Sprechtext den White House Accord („Promised. Not required.“), die Pause-Frage und Pachocki, im Faktenzettel den US-China-Dialog. #14 hat Amodeis Essay zur Interpretierbarkeit, Sleeper Agents, den Reim-Schaltkreis und die gegenseitigen Tests von OpenAI und Anthropic. #55 hat Mythos (geprüft von UK AISI und METR) und SB 53 im Faktenzettel. → Frisch und unverbraucht sind: CAISI-Verträge mit fünf Labs (Mai 2026), das EU AI Office darf seit 2.8.2026 strafen und Modelle prüfen, New Yorks RAISE Act gilt ab 1.1.2027, Christiano bei den Hinton Lectures (10.11.2026) und Hassabis' Ruf nach einer Prüfstelle (14.7.2026). In `film-ai-race` steht CAISI nur als Quelle für Chinas Rückstand.
11. **Good und „2001“: Belegt ist nur, dass er Kubrick beriet**, nicht, dass HAL nach Goods Ideen entstand (F10).
12. **„Good arbeitete mit Turing“ stimmt für 1941–42 (Hut 8).** Ab 1943 arbeitete er in der „Newmanry“ unter Max Newman (F3).
13. **Medizin (§2.5c):** Lila Sciences, das NVIDIA-Video über Lila und Isomorphic (Hassabis) handeln vor allem von Medikamenten. → Nicht verwenden. Altern kommt nicht vor, dafür habe ich nichts recherchiert.
14. **Kenner-Test (§6.3):** Ob Kurzgesagt, Aperture oder Miden Tech Goods Bedingung („provided that …“) zitieren, konnte ich nicht prüfen (keine Untertitel). Ihre Titel und Beschreibungen nennen sie nicht.

---

## Die Erfinder-Tafel: Stand der vier Fächer am 25.11.2026 (Bildrand)

| Fach | Feld | stärkster Beleg heute | ehrlicher Haken | nächstes Datum |
|---|---|---|---|---|
| 1 ENERGY | Gold | Lila: 2.942 Katalysatoren in drei Monaten, neue Familien ohne Iridium (25.9.2026); PACMAN steuert Fusionsplasma (Sept. 2026) | nur Firmenangabe; Steuerung ist kein Kraftwerk | SPARC (CFS): erstes Plasma für 2027 geplant |
| 2 MATERIALS | Gold | ElementsClaw: vier neue Supraleiter gebaut und gemessen (vorgestellt 3.7.2026) | funktionieren nur bei 2,5–6,5 K; viele Vorhersagen bilden sich im Labor nicht | DeepMind-Robotlabor in Großbritannien (für 2026 angekündigt, Eröffnung offen) |
| 3 DISCOVERY | Gold | Einheitsabstand widerlegt (20.5.2026), von Mathematikern geprüft; AlphaProof Nexus begutachtet (Science, 8.10.2026) | 25 Fields-Medaillenträger: „severely misaligned“; mehr Beweise, als Menschen prüfen können | Riemann-Prüfung läuft; das Clay-Institut führt das Problem weiter als ungelöst |
| 4 CONTROL | offen (Creme) | CAISI prüft Modelle von fünf Labs vor dem Start (seit 5.5.2026); das EU AI Office darf seit 2.8.2026 strafen | in den USA freiwillig; Christiano: kein Ansatz ist „even probably“ auf Erfolgskurs | RAISE Act (New York) 1.1.2027; EU-Pflichten für ältere Modelle 2.8.2027 |

---

## Hook (0:00–1:00)

Drei Kandidaten für die harte Wendung (0:30–0:50), gereiht.

**H1 · EMPFEHLUNG: Eine KI widerlegt eine 80 Jahre alte Vermutung** · Fakt · sicher
Am 20.5.2026 meldete OpenAI, dass ein internes „general-purpose reasoning model“ (also kein Spezialmodell für Mathematik) eine Vermutung von Paul Erdős aus dem Jahr 1946 widerlegt hat (Erdős-Problem #90, Einheitsabstände). Die Frage lautet: Man setzt n Punkte auf eine Ebene. Wie viele Punktpaare können genau den Abstand 1 haben? Erdős vermutete, dass diese Zahl kaum schneller wächst als n. Das Modell fand eine Anordnung mit deutlich mehr Paaren (mindestens n^(1+δ) für ein festes δ > 0). Neun externe Mathematiker prüften das Ergebnis in einer Begleitarbeit, darunter Noga Alon, Thomas Bloom, Timothy Gowers, Daniel Litt, Will Sawin und Melanie Matchett Wood. Sawin bestimmte danach den Exponenten genauer (n^1,014).
Stimmen:
- Gowers: Er hätte die Arbeit „without hesitation“ zur Annahme in den Annals of Mathematics empfohlen, „a milestone in AI mathematics“.
- Litt: „the first result produced autonomously by an AI that I find interesting in itself“.
- Alon, der den Beweis für OpenAI prüfte: „the most spectacular single result“.
- Scientific American: wohl der erste KI-Beweis, der in der wichtigsten Fachzeitschrift erschienen wäre, hätten Menschen ihn gefunden.
Quellen: [OpenAI 20.5.2026](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) · [Begleitarbeit (PDF)](https://cdn.openai.com/pdf/74c24085-19b0-4534-9c90-465b8e29ad73/unit-distance-remarks.pdf), arXiv 2605.20695 · [TechCrunch 20.5.2026](https://techcrunch.com/2026/05/20/openai-claims-it-solved-an-80-year-old-math-problem-for-real-this-time/) · [Gil Kalai 21.5.2026](https://gilkalai.wordpress.com/2026/05/21/amazing-erdos-unit-distance-problem-was-disproved-it-was-achieved-by-ai/) · [The Conversation, Mai 2026](https://theconversation.com/an-ai-solution-to-an-80-year-old-problem-has-shocked-mathematicians-283686) · [Scientific American](https://scientificamerican.com/article/ai-just-solved-an-80-year-old-erdos-problem-and-mathematicians-are-amazed) · Quanta 3.8.2026 ([Fassung 1](https://www.quantamagazine.org/why-the-legendary-erdos-problems-are-falling-to-ai-20260803/), [Fassung 2](https://www.quantamagazine.org/how-ai-tore-through-a-mathematical-community-20260803/); zwei Adressen aus zwei Suchen, eine davon ist vermutlich falsch)
Sag: „This year, an A.I. took on a puzzle that had stood for 80 years. Dots on a page: how many pairs can sit exactly one step apart? It found an answer no human had found. The mathematicians who checked it said it belonged in the top journal of their field.“
Achtung: Die eine Zahl im Hook ist „80 years“, keine Jahreszahl (§4). Sag „widerlegt“ oder „found the answer“, nicht „gelöst“: Die KI zeigte, dass die Vermutung falsch war. Bloom und Gowers betonen, dass dafür keine neuen Werkzeuge nötig waren, und laut Quanta verbesserten Menschen das Ergebnis binnen Wochen. OpenAI ist Partei (§1.9a). In keinem früheren Sprechtext verwendet, nur im Papst-Faktenzettel als Reserve.

**H2 · Ein KI-Labor findet, was als Sackgasse galt** · Fakt (Firmenangabe) · dünn
Lila Sciences (Mitteilung vom 25.9.2026, Preprint vom 24.9.): Ein KI-gesteuertes Labor hat in drei Monaten 2.942 Katalysatoren für grünen Wasserstoff vorgeschlagen, hergestellt und geprüft (53 Materialsysteme, 26 Elemente). Das Ergebnis sind sechs neue Familien auf Palladium-Basis für die Sauerstoffseite der Elektrolyse in saurer Umgebung, ohne Iridium und Ruthenium (z. B. InMnPdOx, NiTaPdOx). Die Überspannung blieb über 1.000 Stunden unter 0,5 V. Palladium galt laut Firma dafür als „dead end“. Lila nennt das 17-mal schneller als üblich.
Quellen: [Lila Sciences](https://www.lila.ai/news/how-an-ai-run-lab-cracked-open-green-hydrogens-catalyst-problem) · [Unite.AI](https://www.unite.ai/lila-sciences-ai-lab-uncovers-palladium-catalysts-for-green-hydrogen/) · FuelCellsWorks 25.9.2026 (Adresse in der Suche gekürzt)
Sag: „In three months, an A.I.-run lab made and tested almost three thousand catalysts for clean hydrogen. It found working ones in a metal the experts had written off.“
Achtung: Es gibt nur die Firmenangabe und den Preprint, keine unabhängige Prüfung. Menschen trugen die Proben zwischen den Maschinen, also „A.I.-run“, nicht „ohne Menschen“. Ganz frisch (zwei Monate) und passend zu Fach 1, darum gute Reserve für den Hook oder Einstieg in Station 2. Lila wirbt sonst vor allem mit Medizin (§2.5c).

**H3 · AlphaProof Nexus: Dutzende offene Probleme, maschinell geprüft** · Fakt · sicher (Preprint), dünn (Datum in Science)
Google DeepMind, arXiv 2605.22763 (21.5.2026), laut the-decoder und Xenospectrum am 8.10.2026 begutachtet in Science erschienen. Das System löste 9 von 353 in Lean formalisierten Erdős-Problemen (rund 2,5 %), darunter zwei von 1970, die 56 Jahre offen waren. Es bewies außerdem 44 von 492 Vermutungen aus der Zahlenfolgen-Datenbank OEIS und beantwortete eine seit 15 Jahren offene Frage zu Hilbert-Funktionen. Jeder Beweis ist in Lean maschinell geprüft. Die Kosten lagen bei einigen Hundert Dollar pro Problem.
Quellen: [the-decoder](https://the-decoder.com/google-deepminds-alphaproof-nexus-solved-dozens-of-open-math-problems-and-actually-got-peer-reviewed/) · [Xenospectrum](https://xenospectrum.com/en/alphaproof-nexus-math-proof-science/) · [Universität Aarhus](https://math.au.dk/aktuelt/nyheder/nyhed/artikel/gergely-deepmind)
Sag: „Another A.I. solved open problems that had waited up to 56 years, for a few hundred dollars each.“
Achtung: Die Trefferquote liegt bei 2,5 %, gelöst wurden eher die leichteren Probleme. Die Veröffentlichung in Science ist nur über zwei Sekundärquellen belegt. Google ist Partei.

Nicht als Hook geeignet: Navier-Stokes (#55), Riemann (#67), VP ≠ VNP und Yang-Mills (beide ungeprüft), siehe F30.

**F1 · „Every one of them was invented by a person“** · Fakt · sicher (Allgemeinwissen)
Achtung: „the medicine in your cabinet“ ist als einzelnes Wort in Ordnung (§2.5c). Wer ganz sicher gehen will, nimmt „the glasses on your face“.

**F2 · „Über 60 Jahre alt“** · Fakt · sicher
Good schrieb seinen Satz 1965 (vor 61 Jahren), Turing hielt seinen Vortrag 1951 (vor 75 Jahren).
Sag: „The idea that this machine would be our last invention is more than 60 years old. And it came with a second half that almost everyone leaves out.“
Achtung: Vor 1:00 keine Jahreszahl und weder Turing noch Good nennen (Gerüst, §4).

---

## Station 1 · Wer hat das zuerst gesagt? (1:00–2:30)

**F3 · Good in Bletchley Park, unter Turing** · Fakt · sicher
Der Mathematiker I. J. „Jack“ Good begann am 27.5.1941 in Hut 8 von Bletchley Park, wo die Enigma der deutschen Marine geknackt wurde. Leiter von Hut 8 war Alan Turing. Nach etwa einem Jahr gab Turing die Leitung an Hugh Alexander ab. 1943 wechselte Good in die „Newmanry“ unter Max Newman, die Abteilung mit den Colossus-Rechnern.
Quellen: [GCHQ](https://www.gchq.gov.uk/person/jack-good) · [MacTutor](https://mathshistory.st-andrews.ac.uk/Biographies/Good/) · [IEEE Computer Society](https://history.computer.org/pioneers/good.html) · [Statistical Science 2023, „The Secret Life of I. J. Good“](https://projecteuclid.org/journals/statistical-science/volume-38/issue-2/The-Secret-Life-of-I-J-Good/10.1214/22-STS870.pdf)
Sag: „During the Second World War, a young mathematician named Jack Good helped break German naval codes at Bletchley Park. His boss was Alan Turing.“
Achtung: „German naval codes“ ist genauer als „Nazi codes“. Für Bletchley eigene Illustration verwenden, keine Filmszenen („The Imitation Game“ ist ein Film und damit rot).

**F4 · Anekdote: In seiner ersten Nachtschicht schlief Good ein** · Fakt · dünn
Laut den Biografien (F3) schlief Good in seiner ersten Nachtschicht ein, und Turing ärgerte sich darüber. Den Wortlaut habe ich nicht gesehen.
Achtung: Hübsch, aber für den Film nicht nötig. Nur mit Beleg aus dem Original verwenden.

**F5 · Nach dem Krieg** · Fakt · sicher
Good arbeitete in Manchester am Rechner Manchester Mark 1, von 1948 bis 1959 beim GCHQ und ab Ende der 1960er an der Virginia Tech. Er war Statistiker und Bayesianer, die Methode hatte er bei Turing gelernt. Er starb am 5.4.2009 in Radford (Virginia) mit 92 Jahren.
Quellen: [Nachruf der Virginia Tech, April 2009](https://news.vt.edu/articles/2009/04/2009-276.html) · MacTutor · IEEE Computer Society
Achtung: Das Jahr des Wechsels an die Virginia Tech steht in den Quellen als 1967 oder 1969, bitte prüfen.

**F6 · Goods Satz von 1965** · Fakt · sicher
I. J. Good, „Speculations Concerning the First Ultraintelligent Machine“, Advances in Computers 6 (1965), S. 31–88. Auf S. 33: „… an ultraintelligent machine could design even better machines; there would then unquestionably be an ‚intelligence explosion' … Thus the first ultraintelligent machine is the last invention that man need ever make, provided that the machine is docile enough to tell us how to keep it under control.“
Quellen: [Quote Investigator, 4.1.2022 (mit Scans)](https://quoteinvestigator.com/2022/01/04/ultraintelligent/) · [Original als PDF (VTechWorks)](https://vtechworks.lib.vt.edu/items/5085379d-b24c-424e-8861-e70a47b4b2fb) · `stopp1-thema-titel.md`
Sag (Station 1, nur die erste Hälfte): „… the first ultraintelligent machine is the last invention that man need ever make.“ Den Rest („provided that …“) für Station 5 aufheben.
Achtung: Zitatkarte mit Quelle im Bild. Die Kürzung in Station 1 mit „…“ kennzeichnen und in Station 5 den ganzen Satz zeigen, damit niemand glaubt, wir hätten ihn verfälscht. Den Definitionssatz davor („Let an ultraintelligent machine be defined …“) und das Stück zwischen den beiden Teilen habe ich nicht gesehen, also bitte am Original (S. 33) nachlesen.

**F7 · Turing 1951** · Fakt · sicher
Vortrag „Intelligent Machinery, A Heretical Theory“ (Manchester 1951, gedruckt 1959 im Buch von Sara Turing über ihren Sohn, S. 132): „… it seems probable that once the machine thinking method had started, it would not take long to outstrip our feeble powers. There would be no question of the machines dying, and they would be able to converse with each other to sharpen their wits. At some stage therefore we should have to expect the machines to take control, in the way that is mentioned in Samuel Butler's Erewhon.“
Quellen: [Quote Investigator, 6.1.2022](https://quoteinvestigator.com/2022/01/06/outstrip/) · `stopp1-thema-titel.md`
Sag: Station 1: „it would not take long to outstrip our feeble powers“. Station 5: „At some stage therefore we should have to expect the machines to take control“.
Achtung: Dass es keine Tonaufnahme von Turing gibt, steht nur im Gerüst und ist hier nicht belegt. Im Film also nicht behaupten, einfach die Zitatkarte zeigen.

**F8 · Good lag beim Datum falsch** · Prognose (nicht eingetroffen) · sicher, Wortlaut am Original prüfen
S. 78: „It is more probable than not that, within the twentieth century, an ultraintelligent machine will be built and that it will be the last invention that man need make …“ Vernor Vinge zitierte die Stelle 1993.
Quelle: [Quote Investigator, 4.1.2022](https://quoteinvestigator.com/2022/01/04/ultraintelligent/)
Sag: „He even guessed when: ‚within the twentieth century.' He was wrong.“
Achtung: Fair bleiben: Good schrieb „more probable than not“, er war sich also nicht sicher. „Wrong about the date“ ist belegt. Ob er in der Sache recht hat, ist offen.

**F9 · Good sah in der Maschine eine Rettung, kein Ende** · Fakt · sicher
S. 31: „The survival of man depends on the early construction of an ultraintelligent machine.“
Quellen: Quote Investigator, 4.1.2022 · `stopp1-thema-titel.md`
Sag (bricht das Missverständnis, Station 1 oder 6): „Good didn't think this machine would end us. He thought we might not survive without it.“
Achtung: Warum er das dachte, habe ich nicht recherchiert. Bitte keinen Grund dazudichten.

**F10 · Good beriet Kubrick bei „2001“** · Fakt · sicher (Beratung), dünn (HAL)
Nachruf der Virginia Tech (April 2009): „in 1967, he went to Hollywood briefly to advise Stanley Kubrick on scientific issues related to filming 2001: A Space Odyssey.“ Dass HAL 9000 auf Goods Ideen beruht, steht nur in einem Essay des Smithsonian (10.4.2018) und in einem Blog der Bibliothek der Virginia Tech („presumably“).
Quellen: [Nachruf der Virginia Tech](https://news.vt.edu/articles/2009/04/2009-276.html) · [Smithsonian Air and Space, 10.4.2018](https://www.airandspace.si.edu/stories/editorial/2001-space-odyssey-hal-and-future-ai)
Sag: „A few years later, Stanley Kubrick asked him for advice while making 2001: A Space Odyssey.“
Achtung: Keine Bilder aus „2001“ (Film = rot), nur eigene Illustration. Nicht „HAL was based on Good“ sagen. HAL kam schon in `film-jarvis` vor.

**F11 · Die heutige Stimme: Hassabis' Plan in zwei Schritten** · Fakt (Aussage) · sicher
Stanford GSB, Reihe AI@GSB, Gespräch mit Stanford-Präsident Jonathan Levin, etwa am 22.5.2026 (Stanford Daily vom 29.5.: „last Friday“), Video am 2.6.2026. Wortlaut laut Transkript: „Step one: Solve intelligence. Step two: Use it to solve everything else.“ Dazu: „by ‚solve intelligence' we meant build AGI“ und „we really meant it“. Laut Stanford Daily sprach er von einem „species-level transition“. Im YC-Podcast (29.4.2026) erklärte er „everything else“ als „root node problems in science“.
Quellen: [Stanford GSB Insights](https://www.gsb.stanford.edu/insights/demis-hassabis-thinks-were-foothills-singularity) · [Transkript bei Singju Post](https://singjupost.com/gsb-a-conversation-with-demis-hassabis-ceo-of-google-deepmind-transcript/) · [Stanford Daily, 29.5.2026](https://stanforddaily.com/2026/05/29/deepmind-ceo-warns-about-ai/) · Video: `clips.json` C1
Sag (Einordnung vor C1): „Sixty years later, the people building these machines describe the plan almost exactly the way Good did.“
Achtung: Das ist DeepMinds Leitsatz aus der Gründungszeit (er spricht in der Vergangenheit: „we meant“). Google verkauft KI (§1.9a). Zum Rollenwechsel siehe 0.4. Hassabis bekam 2024 den Chemie-Nobelpreis (laut Beschreibung des YC-Videos), das ist für die Bauchbinde nicht nötig.

**F12 · Hassabis bei Google I/O: „foothills of the singularity“** · Fakt (Aussage), Prognose (Inhalt) · sicher (gesagt), Wortlaut umstritten
Ende der Keynote am 19.5.2026 (etwa bei 1:50:17): „When we look back at this time, I think we will realize that we were standing in the foothills of the singularity.“ So zitiert ihn Westfield. Computerworld schreibt „… we all realise …“, Semafor „We're at the foothills of the singularity“.
Quellen: [Semafor, 20.5.2026](https://www.semafor.com/article/05/20/2026/google-exec-demis-hassabis-predicts-were-at-the-foothills-of-the-singularity) · [the-decoder](https://the-decoder.com/deepminds-hassabis-sees-humanity-in-the-foothills-of-the-singularity-while-lecun-says-current-ai-isnt-intelligent/) · [MIT Technology Review, 22.5.2026](https://www.technologyreview.com/2026/05/22/1137813/google-i-o-showed-how-the-path-for-ai-science-is-shifting/)
Achtung: Reserve für Station 6 (Bild „Ausläufer“). Wortlaut am Video prüfen (C1b).

**F13 · Hassabis' Rolle heute** · Fakt · sicher
Seit dem 5.8.2026 ist er Chair von Google DeepMind und Chief Scientist von Alphabet und leitet weiter Isomorphic Labs. Google DeepMind führt jetzt Koray Kavukcuoglu.
Quellen: [Fortune, 5.8.2026](https://fortune.com/2026/08/05/demis-hassabis-steps-down-google-deepmind-ai-shakeup/) · [Axios, 5.8.2026](https://axios.com/2026/08/05/google-deepmind-demis-hassabis-ai)

---

## Station 2 · Fach 1 ENERGY (2:30–4:00)

**F14 · Der Katalysator aus dem KI-Labor (Lila)** · Fakt (Firmenangabe) · dünn
Siehe H2. Der Fall ist zugleich die Brücke zu Station 3, denn der Fortschritt bei der Energie steckt hier in einem neuen Stoff.
Sag: „The best catalysts for clean hydrogen need iridium. An A.I.-run lab went looking for something else, and found it in a metal everyone had given up on.“
Achtung: Dass Iridium knapp oder teuer ist, steht in meinen Auszügen nicht. Nur „without iridium“ sagen.

**F15 · KI am Steuer eines Fusionsreaktors (PACMAN)** · Fakt · sicher
Ein Team aus Princeton am Tokamak DIII-D, veröffentlicht in Nuclear Fusion. ScienceDaily (6.9.2026) titelte: „AI can now control fusion plasma faster than humans can react“. In fünf Experimenten übernahm ein Reinforcement-Learning-Modell die volle Kontrolle über die Heizsysteme und sagte Energieausbrüche am Rand des Plasmas voraus. Instabilitäten entstehen in „a few thousandths of a second“. Die Ziele setzen Menschen, und harte Sicherheitsgrenzen gelten unabhängig von der KI.
Quellen: [ScienceDaily](https://www.sciencedaily.com/releases/2026/09/260903064215.htm) · SciTechDaily, 8.9.2026
Sag: „Inside a fusion reactor, the plasma can turn unstable in a few thousandths of a second. This year, an A.I. took over the heating controls and reacted faster than any human could.“
Achtung: Das ist Steuerung, kein Strom. Nicht mit DeepMinds Steuerung von 2022 oder TORAX vermischen (`film-gute-ki`, `film-energie`). Dass die Ziele und Grenzen von Menschen kommen, passt schon leise zu Fach 4.

**F16 · Was die IAEA sagt (World Fusion Outlook 2026)** · Fakt und Schätzung · sicher
Die vierte Ausgabe erschien am 12.11.2026 in Wien (128 Seiten). Ein Kapitel stammt von Google DeepMind. Darin heißt es, KI beschleunige Simulationen, die sonst Wochen oder Monate dauern, mache Echtzeit-Steuerung möglich und helfe bei neuen Materialien. Das größte Hindernis seien Daten (Vorschlag: ein „Fusion Data Lake“). Der Bericht sieht eine Lücke von rund 80 Mrd. $ privatem Kapital.
Quellen: [ANS, 2026](https://www.ans.org/news/article-8577/iaea-publishes-2026-world-fusion-outlook/) · Nature World News, 18.11.2026
Achtung: Das KI-Kapitel hat DeepMind geschrieben (§1.9a). Wortlaut und Zeitraum der „80 Mrd. $“ prüfen.

**F17 · SPARC kommt erst 2027** · Prognose · sicher (Datum), dünn (Baustand)
Commonwealth Fusion Systems plant das erste Plasma von SPARC für 2027. Im Juli 2026 soll die Anlage zu etwa 80 % fertig gewesen sein (nur Suchauszug).
Achtung: Schon in `film-energie` und `film-gute-ki`. Höchstens als Einwand: „the first of these new reactors won't switch on before next year“.

**F18 · Batterien: ElectrolyteGPT** · Fakt · sicher
University of Chicago, Kim et al., JACS Au (9.4.2026, DOI 10.1021/jacsau.5c01628): Ein Sprachmodell schreibt ganze Rezepturen für Batterie-Elektrolyte (in einer eigenen Schreibweise namens „fLine“). Mehrere davon wurden im Labor gemischt und schnitten in Lithium-Metall-Zellen so gut ab wie die besten bekannten Rezepturen.
Quellen: [UChicago News](https://news.uchicago.edu/story/electrolytegpt-can-generate-new-formulations-battery-development) · [TechXplore, Mai 2026](https://techxplore.com/news/2026-05-ai-generates-full-battery-electrolyte.html)
Achtung: „so gut wie“, nicht besser. Es sind Laborzellen, kein Produkt.

**F19 · Batterien aus der Firma: SES AI** · Fakt (Firmenangabe) · dünn
Die Datenbank „Molecular Universe“ umfasst 121 Mio. Moleküle, laut Firma kamen daraus sechs neue Elektrolytmaterialien. Laut MIT Technology Review (25.3.2026) gehen die Batterien bisher nur in kleine Märkte wie Drohnen.
Quelle: [MIT Technology Review, 25.3.2026](https://www.technologyreview.com/2026/03/25/1134657/battery-company-ai-pivot-ses/)
Achtung: Ein gutes Beispiel für den Einwand, dass der Weg vom Labor in die Welt dauert.

**F20 · Erdwärme, die niemand gesehen hatte (Zanskar)** · Fakt · sicher, Stand Dez. 2025
Zanskar fand mit KI-Modellen in Nevada ein verborgenes („blindes“, also ohne Spuren an der Oberfläche) Geothermie-Vorkommen, genannt „Big Blind“. Die Bohrung bestätigte rund 250 °F (etwa 121 °C). Laut ASME-Magazin (Mai 2026) ist es das erste blinde System in den USA seit über 30 Jahren. Die Leistung ist offen.
Quellen: [Axios, 4.12.2025](https://www.axios.com/2025/12/04/nevada-energy-ai-models-discovery-research) · [ASME, Mai 2026](https://magazine.asme.org/issues/may-2026/news-hidden-geothermal-goldmines)
Sag: „Late last year, an A.I. found a hidden source of heat under the Nevada desert, in a place nobody had thought to look.“
Achtung: Der Fund ist älter als 2026, darum „late last year“ (§2.5b).

**F21 · Der Einwand: Netz und Genehmigung** · Fakt und Schätzung · sicher (RAND), dünn (GridCARE)
Laut RAND (Juni 2026) braucht es Reformen bei Netzanschluss und Genehmigung, sonst kommt neue Energie nicht schnell genug ans Netz. Der Anbieter GridCARE wirbt mit 120 GW und 350 Mrd. $ ungenutzter Netzkapazität, belegt ist aber nur ein Pilotprojekt mit Southern California Edison über 20 MW.
Quelle: [RAND Research Brief RBA3845-2](https://www.rand.org/pubs/research_briefs/RBA3845-2.html)
Sag (Einwand in einem Satz): „Even a perfect invention still has to be built, approved and plugged in, and that part still runs at human speed.“

**F22 · DOE Genesis Mission** · Fakt · dünn
Das US-Energieministerium setzt 293 Mio. $ und 17 Nationallabore ein, mit KI-Agenten für die Forschung. Ergebnisse gibt es noch keine. Die Angabe stammt aus einem Suchauszug, eine Adresse habe ich nicht notiert. → Weglassen oder am iMac nachsuchen.

Urteil für Station 2 (Vorschlag): Fakt ist, dass KI schon heute Stoffe für Energie findet und Reaktoren steuert. Die Prognose lautet, dass solche Labore nach AGI zu Tausenden parallel laufen. Der Engpass bleiben Bauen und Genehmigen.

---

## Station 3 · Fach 2 MATERIALS (4:00–5:15)

**F23 · Vier neue Supraleiter, von einer KI gefunden und gebaut (ElementsClaw)** · Fakt · sicher (Preprint, ICML, Bericht), Messwerte leicht umstritten
Die DAMO Academy von Alibaba hat zusammen mit der Renmin-Universität und der UCAS das KI-Agentensystem ElementsClaw gebaut (arXiv 2604.23758 vom 26.4., überarbeitet am 4.5.2026, ICML 2026, öffentlich vorgestellt am 3.7.2026). Es durchsuchte 2,4 Mio. Kristallstrukturen in 28 GPU-Stunden und schlug 68.000 Kandidaten vor. Das Team stellte vier neue Supraleiter her und maß sie:
- HfZrRe4, von Grund auf entworfen, etwa 5,9 K
- Zr3ScRe8, etwa 6,5 K
- Zr4VRe7, etwa 3,5 K
- Hf21Re25, etwa 2,5 K
Quellen: [SCMP](https://scmp.com/tech/big-tech/article/3359335/alibabas-elements-claw-ai-agent-unearths-four-new-superconductors) · [ICML 2026](https://icml.cc/virtual/2026/84026)
Sag: „An A.I. searched 2.4 million possible crystals in 28 hours of computing and designed a superconductor no one had ever made. Then people built it, and it worked.“
Achtung: Die Stoffe funktionieren nur nahe dem absoluten Nullpunkt (etwa −267 bis −271 °C). Die Werte änderten sich zwischen den Fassungen der Arbeit, und eine unabhängige Wiederholung gibt es nicht. Alibaba ist Partei.

**F24 · Roboter-Labore heute: das Tempo** · Fakt · sicher bis dünn
- **Periodic Labs** wurde 2025 von Liam Fedus (früher bei OpenAI, laut The Generalist „one of the creators of ChatGPT“) und Ekin Dogus Cubuk (früher Leiter des Materialteams bei Google DeepMind, u. a. GNoME) gegründet, mit 300 Mio. $ Startkapital. Das Labor schafft etwa 100 Experimente pro Tag (Ziel 1.000) und hat ein zweites Labor. Erstes Ziel sind Supraleiter, eine Entdeckung ist bisher nicht angekündigt. Laut Forbes verhandelte die Firma über eine Bewertung von 7,5 Mrd. $ (Datum offen). [IEEE Spectrum](https://spectrum.ieee.org/high-temperature-superconductor-ai-research) · [TechCrunch, 30.9.2025](https://techcrunch.com/2025/09/30/former-openai-and-deepmind-researchers-raise-whopping-300m-seed-to-automate-science) · sicher
- **Radical AI** betreibt ein selbstfahrendes Labor in Manhattan, ein zweiter Standort im Brooklyn Navy Yard entsteht. Roboter stellen Stoffe her und testen sie, die KI entscheidet über das nächste Experiment. Die Firma hat über 65 Mio. $ eingesammelt, zu den Kunden zählt die US Air Force, Ziele sind Batterien, Halbleiter und hitzefeste Legierungen. Chef Joseph Krause sagt, ein Forscher könne jetzt 10 Experimente gleichzeitig laufen lassen. [Bulletin of the Atomic Scientists, Video vom 8.9.2026](https://www.youtube.com/watch?v=hA6gGTUcTfU) · [thebulletin.org](https://thebulletin.org/2026/09/video-inside-an-ai-powered-lab-trying-to-replace-scientists/) · sicher (laut Videobeschreibung)
- **AlloyBot (UW–Madison):** Eine automatische Anlage zum Wiegen und Schmelzen stellt eine Legierung pro Stunde her (150 pro Woche), das Ziel ist hundertmal schnelleres Arbeiten. Video vom 4.6.2026, Preprint bei Research Square. [YouTube oeBQqt7x4r4](https://www.youtube.com/watch?v=oeBQqt7x4r4) · sicher
- **Google DeepMind** hat im Dez. 2025 ein automatisiertes Materiallabor in Großbritannien für 2026 angekündigt („hundreds of materials per day“). Eine Eröffnung ist nicht bestätigt. DeepMind-Blog, Dez. 2025 (Adresse in der Suche gekürzt) · dünn
Achtung: Außer UW–Madison sind das alles Firmen mit Eigeninteresse. Das AlloyBot-Video (Uni, grün) taugt als Bildmaterial, vorher Musik prüfen.

**F25 · Der ehrliche Moment: Viele Vorschläge bleiben auf dem Papier** · Fakt · sicher bis dünn
- Eine Studie aus Florida (arXiv 2611.09671, Nov. 2026, „Experimental Evaluation of High-Throughput Structure Predictions“) stellte 34 vorhergesagte Verbindungen aus drei Elementen her. Die meisten bildeten im Labor nicht die vorhergesagte Struktur, vier bildeten neue geordnete Strukturen. · dünn (nur Suchauszug, Datum über die arXiv-Nummer)
- MatterGen (Microsoft): Das als neu vorgestellte TaCr2O6 entspricht einer Verbindung, die schon 1972 beschrieben wurde (ChemRxiv, 23.1.2026). [ChemRxiv](https://chemrxiv.org/doi/pdf/10.26434/chemrxiv-2025-mkls8/v3) · sicher
- A-Lab (Berkeley): Die Nature-Arbeit wurde berichtigt (Author Correction vom 19.1.2026), aus „novel“ wurde „inorganic“. Hergestellt wurden 36 von 57 Zielen, die Kritik von Palgrave und Schoop bleibt bestehen. [C&EN, Jan. 2026](https://cen.acs.org/research-integrity/Nature-robot-chemist-paper-corrected/104/web/2026/01) · sicher. A-Lab selbst steht schon in #4, darum höchstens als Satz ohne Namen erwähnen.
- GNoME (DeepMind, 2023): Cheetham und Seshadri prüften 2024 (Chem. Mater.) eine Stichprobe von zehn angeblich neuen Stoffen, und alle standen schon in der Datenbank ICSD. DeepMind nennt 736 Stoffe, die andere unabhängig hergestellt haben. → „Stand 2024“.
- MIT Technology Review (15.12.2025, David Rotman): bisher „no eureka moment“. Adresse in der Suche gekürzt.
- Ein von KI entdecktes Material in Massenproduktion habe ich nicht gefunden (Kommentarseiten bis Anfang 2026) · dünn. Fortune (18.11.2026) zitiert Radical-AI-Chef Krause zur „decade tax“, also rund zehn Jahren zwischen Entdeckung und Produkt (Eigeninteresse, Inhalt nur aus dem Auszug). [Fortune](https://fortune.com/2026/11/18/ai-boom-materials-discovery-decade-tax-radical-ai/)
- William Bailey von der Columbia University (im Bulletin-Video): Manche Umwandlungen in Materialien lassen sich nicht beschleunigen, und er bezweifelt, dass KI so weiterdenken kann wie große Forscher. · sicher (laut Videobeschreibung)
Sag: „Most of these A.I. ideas are still on paper, and only what gets built counts. What has been built so far is real, but small.“
Achtung: Das Urteil: Die gebauten Stoffe sind echt (F23, H2), die großen Versprechen noch nicht.

**F26 · Der Du-Bezug (leichtere Autos, Akkus für eine Woche, Häuser, die sich selbst kühlen)** · Prognose · nicht belegt
Für 2026 habe ich dafür keinen KI-Fall im Alltag gefunden. Am nächsten kommen hitzefeste Legierungen (Radical AI), Wärmeleitmaterialien (Discovered Materials, 9 Mio. $, Aug. 2026) und die „AI Materials Foundry“ von CuspAI mit 3M (Juli 2026). → Als „imagine“ sagen, nicht als heutigen Stand.

---

## Station 4 · Fach 3 DISCOVERY (5:15–6:30)

**F27 · Einheitsabstand und AlphaProof Nexus** → H1 und H3. Was nicht in den Hook kommt, passt hierher.

**F28 · Ein Amateur und eine einzige Frage: Erdős-Problem #1196** · Fakt · sicher
Im April 2026 stellte Liam Price, 23 Jahre alt und ohne Mathematikstudium, dem Modell GPT-5.4 Pro eine einzige Frage zu Erdős-Problem #1196 (primitive Mengen, seit etwa 60 Jahren offen) und stellte die Antwort auf erdosproblems.com. Jared Lichtman und Terence Tao prüften den Beweis und kürzten ihn. Tao zufolge begann der Ansatz anders als alle früheren Versuche, nämlich mit einer Formel aus einem anderen Gebiet. Daraus entstand eine Arbeit mit acht Autoren, darunter Tao, Lichtman und Price, die auch weitere offene Fragen klärt. Tao bleibt vorsichtig: Es sei nicht das schwerste Problem der Sammlung, und die KI habe eher Tempo als Tiefe gebracht. Laut Lichtman brauchte die Rohausgabe einen Experten, der sie deutet.
Quellen: [Scientific American](https://www.scientificamerican.com/article/amateur-armed-with-chatgpt-vibe-maths-a-60-year-old-problem/) · [heise](https://heise.de/-11276442) · [Futurism](https://futurism.com/artificial-intelligence/mathematicians-claim-significant-discovery-using-chatgpt) · [Korben](https://korben.info/en/amateur-solves-erdos-problem-gpt-5-4-prompt.html)
Sag (passt am besten in Station 6): „One of these problems was cracked by a 23-year-old with no math degree, who simply asked an A.I. the right question. Then two of the best mathematicians alive checked it, and made it better.“
Achtung: Das Datum (13.4. oder später) und das Alter des Problems (1965 oder 1966) schwanken je nach Quelle. „two of the best mathematicians alive“ ist ein Urteil, besser „two leading mathematicians“. In keinem früheren Film gefunden.

**F29 · Erdős-Problem #728 (Jan. 2026) und Taos Maßstab** · Fakt · sicher, Stand Jan. 2026
Im Januar 2026 lösten GPT-5.2 Pro und das Beweissystem Aristotle Erdős-Problem #728. Tao nannte das „still somewhat clunky“ und schätzte, dass nur etwa 1–2 % der offenen Erdős-Probleme einfach genug für solche Werkzeuge seien.
Quellen: [the-decoder](https://the-decoder.com/terence-tao-says-gpt-5-2-pro-cracked-an-erdos-problem-but-warns-the-win-says-more-about-speed-than-difficulty/) · arXiv 2601.07421

**F30 · Das Tempo seitdem: frische Fälle, alle umstritten oder ungeprüft** · Fakt (Anspruch) · umstritten
- **6.10.2026:** OpenAI veröffentlicht auf einen Schlag rund 722 Manuskripte (Zählung bei Wikipedia, Scientific American spricht von 372 Problemen), drei davon sind inzwischen zurückgezogen. Ein Mathematiker der Fudan-Universität: „These were almost all the major open problems in my field!“ Die Association for Human Mathematics ruft zum Boykott auf, und laut Scientific American lautet ein Vorwurf, ältere Ideen seien nicht zitiert worden. Tao bemängelt, dass niemand da ist, der Fragen zu den Arbeiten beantwortet. [Scientific American](https://www.scientificamerican.com/article/mathematicians-marvel-and-grumble-at-openais-trove-of-new-results/) · [Futurism](https://futurism.com/artificial-intelligence/mathematicians-openai-furious) · [the-decoder](https://the-decoder.com/how-much-beauty-have-we-lost-mathematicians-react-with-shock-and-disgust-as-openai-bulldozes-their-field/)
- **27.10.2026:** OpenAI meldet Ergebnisse in harmonischer Analyse, Komplexitätstheorie und Quantenfeldtheorie (Existenz von Yang-Mills/QCD in vier Dimensionen, ohne Massenlücke). Eine externe Prüfgruppe unter David Gross arbeitet daran. [Al Jazeera, 27.10.2026](https://www.aljazeera.com/economy/2026/10/27/ai-makes-discoveries-in-mathematics-computer-science-physics-openai-says)
- **20.11.2026:** Der Anspruch auf einen Beweis der Riemannschen Vermutung (#67). Lean FRO und Mathlib bestätigten am 21.11. die Lean-Prüfung, die menschliche Prüfung läuft noch, und das Clay-Institut führt das Problem weiter als ungelöst. [CryptoSlate](https://cryptoslate.com/claude-assisted-proof-of-riemann-hypothesis-validated-by-independent-checkers/) · [Interesting Engineering](https://interestingengineering.com/ai-robotics/anthropic-167-year-old-riemann-hypothesis-claude)
- **23./24.11.2026:** Anthropic stellt einen 70-seitigen Beweis von VP ≠ VNP (Valiants Vermutung) online, als Autor ist „Claude (Anthropic)“ angegeben, geprüft in Lean 4. Im README steht: „no human mathematician has checked the proof“. [CASRAI](https://casrai.org/news/anthropic-claude-authored-vp-vnp-proof-unverified-lean-2026) · [OfficeChai](https://officechai.com/ai/claude-vp-vnp-proof-valiant-conjecture-p-vs-np/)
- **8.9.2026:** Navier-Stokes (laut Clay-Institut „apparently been settled“, umstritten, schon in #55).
Sag: „And since then, a new claim almost every month. Some so big that mathematicians can't check them fast enough.“
Achtung: Keine Zahl aus dieser Liste ohne „OpenAI says“ oder „claims“ in den Sprechtext. Die beiden Anthropic-Fälle nicht hervorheben (Riemann gehört #67, VP ≠ VNP ist ungeprüft), keine Selbstbezüge (§1.10).

**F31 · Tao: viele Beweise, wenig Verstehen** · Fakt (Aussagen) · sicher
- **„Math 2.0“** (Vortrag beim Science x AI Summit an der UCLA am 16.10.2026, Video bei SAIR am 3.11.2026). Laut Beschreibung: Reine Mathematik passe ungewöhnlich gut zu KI, weil sich Ergebnisse objektiv prüfen lassen, die Arbeit ganz digital ist und Jahrhunderte an Büchern und Aufsätzen gute Daten liefern. Das Ergebnis sei „an era of proof abundance. But more proofs do not automatically bring more understanding.“ Video: `clips.json` C3.
- **Nature, World View (22.10.2026), „Can maths survive AI?“:** Er schlägt eine „Maths 2.0“ vor, die Krise komme von zu vielen und nicht von zu wenigen Beweisen („proof indigestion“). [Nature](https://www.nature.com/articles/d41586-026-03622-x). Aus Nature (welcher Beitrag, bitte prüfen) stammt auch: „In almost any other application, the biggest Achilles heel of AI is that it makes unverifiable mistakes.“
- **Vortrag beim ICM (Simons Foundation, 13.8.2026), Zusammenfassung:** Die Werkzeuge hätten bisher „only a modest impact on more traditional mathematical objectives, such as making progress on individual highly difficult problems“.
- **Decrypt (Anfang Sept. 2026):** KI verbrauche den Vorrat an guten offenen Problemen. Er schlägt eine Kennzeichnung „analysis-required“ vor, ein KI-Verbot sei „technically infeasible“. [Decrypt](https://decrypt.co/377818/ai-math-best-problems-terence-tao)
- Weitere Aussagen (Adressen nicht notiert, dünn): bei IBM, Navier-Stokes sei „just the latest in a string of problems that have been ‚strip-mined' for solutions by AI“; bei Live Science „if you give them a goal, they will cheat like crazy“ (passt zu Station 5); im Daily Maverick (3.5.2026), KI „saves more time than it wastes“.
- Außerdem: das Essay „Mathematics in the age of AI“ (arXiv, 17.8.2026), ein Vortrag am Caltech (9.10.2026) und ein Interview mit der LARB (15.11.2026). [LARB](https://lareviewofbooks.org/article/terence-tao-six-math-essentials-ai-machine-learning/)
Sag: „One of the world's leading mathematicians, Terence Tao, puts it carefully: these machines give us more proofs than ever. More understanding is another matter.“
Achtung: Tao ist Mitgründer von SAIR (Kanal von C3) und liegt mit OpenAI über die Massenveröffentlichung im Streit, darum keinen Tao-Clip vom OpenAI-Kanal. „One of the world's top mathematicians“ steht so in der Beschreibung des New-Scientist-Videos.

**F32 · 25 Fields-Medaillenträger: „severely misaligned“** · Fakt · sicher
In der Erklärung „A Severe Misalignment of AI in Mathematics“ vom 11.9.2026 (mathandai.org) schreiben 25 Fields-Medaillenträger, darunter Tao, unterstützt von über 800 weiteren Unterschriften: „the goals of the AI companies and the goals of the mathematical community are severely misaligned“. Zugleich heißt es dort, KI könne „enhance and accelerate genuine mathematical study and understanding“.
Quelle: [Implicator](https://www.implicator.ai/25-fields-medalists-say-ai-labs-race-to-solve-math-problems-is-harming-mathematics/)
Sag (Brücke zu Station 5): „This fall, 25 winners of math's highest prize signed a warning. Not that A.I. is useless. That the goals of the companies and the goals of mathematicians are ‚severely misaligned'. Which raises the real question: who decides what this machine works on?“
Achtung: „misaligned“ meint hier die Ziele der Firmen, nicht die Ziele der KI. Das fair sagen. Als Zitatkarte zeigen.

**F33 · Maßstabswechsel: Entdeckungen, die neue Entdeckungen möglich machen** · Prognose · nicht belegt (2026)
Für „eine KI-Entdeckung ermöglicht die nächste“ habe ich keinen frischen, datierten Fall. Am nächsten kommen F28 (die Arbeit zu #1196 klärte weitere offene Fragen) und Hassabis' „root node problems“ (F11). → Als Bild erzählen, nicht als Fakt.

---

## Station 5 · Fach 4 CONTROL: das vergessene zweite Halb (6:30–8:00)

**F34 · Goods ganzer Satz** · Fakt · sicher → F6
Sag: „Here is the whole sentence. ‚The first ultraintelligent machine is the last invention that man need ever make, provided that the machine is docile enough to tell us how to keep it under control.'“
Achtung: „Thus“ am Satzanfang weglassen ist in Ordnung, im Bild dann mit „…“. „docile“ einmal erklären (etwa „willing to be guided“).

**F35 · Turing: „take control“** · Fakt · sicher → F7

**F36 · Prüfung vor dem Start: CAISI** · Fakt · sicher
Das Center for AI Standards and Innovation (CAISI) am US-Normeninstitut NIST hat seit dem 5.5.2026 Vereinbarungen mit Google DeepMind, Microsoft und xAI, dazu seit Sept. 2025 mit OpenAI und Anthropic. Damit können die Modelle von fünf Labs vor dem Start geprüft werden. Bis Anfang Mai 2026 gab es über 40 Modellprüfungen, auch an unveröffentlichten Modellen. Die Teilnahme ist freiwillig, die Bedingungen sind nicht öffentlich, DeepSeek und Mistral sind nicht dabei.
Quellen: [HPCwire](https://www.hpcwire.com/off-the-wire/nists-caisi-announces-new-frontier-ai-testing-agreements-with-google-deepmind-microsoft-xai/) · [Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-caisi-frontier-ai-testing-agreements-20260/)
Sag: „In America, a government lab now tests new models from five of the biggest A.I. companies before they launch. Voluntarily.“
Achtung: „Voluntarily“ ist der ehrliche Haken. #31 hatte „external testers promised, not required“ (White House Accord). Das ist ein anderer Fakt mit derselben Melodie, darum „Promised. Not required.“ nicht nachbauen.

**F37 · Ein Gesetz mit Zähnen: das EU AI Office** · Fakt · sicher
Seit dem 2.8.2026 darf das AI Office der EU-Kommission die Regeln für große Allzweck-Modelle durchsetzen. Es kann Strafen bis 15 Mio. € oder 3 % des Weltumsatzes verhängen, sich direkten Zugang zu Modellen für Prüfungen verschaffen und im Ernstfall einen Rückruf anordnen. Als „systemisches Risiko“ gilt ein Training ab 10^25 Rechenoperationen. Für ältere Modelle läuft eine Frist bis zum 2.8.2027. Eine Strafe habe ich bisher nicht gefunden.
Quelle: [EU-Kommission, Fragen und Antworten](https://digital-strategy.ec.europa.eu/en/faqs/general-purpose-ai-models-ai-act-questions-answers)
Sag: „In Europe, since this summer, regulators can test these models themselves, and even pull them off the market.“
Achtung: Der Rückruf ist die letzte Stufe und ist noch nie passiert. Die Hochrisiko-Regeln wurden auf den 2.12.2027 verschoben (Europa-Faktenzettel), das nicht vermischen.

**F38 · USA: Die Bundesstaaten handeln, der Bund streitet** · Fakt · sicher
In Kalifornien gilt seit dem 1.1.2026 SB 53 (Berichte großer Entwickler zu Transparenz und Sicherheit). In New York gilt ab dem 1.1.2027 der RAISE Act (Schwelle 10^26 Rechenoperationen und 500 Mio. $ Umsatz). Das Weiße Haus will mit seinem Rahmen vom 20.3.2026 die Landesgesetze durch Bundesrecht verdrängen. Bis zum 13.11.2026 gab es aber kein solches Bundesgesetz, und der Kongress lehnte ein Moratorium für Landesgesetze mehrfach ab.
Quellen: [Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-us-ai-regulation-preemption-compliance-202/) · [CASRAI](https://casrai.org/news/federal-ai-moratorium-state-preemption-fight-2026)
Sag (die Wähler): „And the strongest rules in America so far didn't come from Washington. They came from state lawmakers, elected by voters.“
Achtung: SB 53 steht im Faktenzettel von #55, im Sprechtext von #55 nicht. Den genauen Inhalt von SB 53 am Gesetzestext prüfen.

**F39 · Interpretierbarkeit: in den Kopf der Maschine schauen** · Fakt · sicher, Stand Jan. 2026 (MIT TR), frisch (Videos)
- MIT Technology Review zählt die mechanistische Interpretierbarkeit zu den „10 Breakthrough Technologies 2026“ (12.1.2026), mit Arbeiten von Anthropic, Google DeepMind, Neuronpedia und OpenAI. OpenAI erwischte ein Modell beim Schummeln, indem es seine Gedankenkette überwachte. Adresse in der Suche gekürzt (technologyreview.com, 12.1.2026).
- Sydney Katz (Lecturer in Aeronautics & Astronautics, Stanford) erklärt die Methode in einem kurzen Video (Stanford Online, 21.10.2026). Laut Beschreibung muss eine Kamera, die ein Flugzeug zur Landebahn führt, auf die richtigen Dinge achten, nicht auf einen Vogel oder einen Schatten. Mit Interpretierbarkeit lässt sich das prüfen und „justified confidence in safety-critical AI“ aufbauen. Video: `clips.json` C4b.
- Neel Nanda (Google DeepMind) im Podcast mit Hannah Fry (10.7.2026): Laut Beschreibung geht es um die „surprising, elegant structures being discovered inside these networks“ und um die Grenzen des Blicks unter die Haube.
Sag: „Researchers can now look inside these systems and check what they are actually paying attention to. It's early. But it's no longer a black box we just have to trust.“
Achtung: Amodeis Essay, Sleeper Agents und der Reim-Schaltkreis stehen in #14 und werden nicht wiederholt. „no longer a black box we just have to trust“ ist eine Deutung, kein Messwert.

**F40 · Das ehrliche Zeugnis: Paul Christiano** · Fakt (Aussage) · sicher (Vortrag), Wortlaut dünn
Christiano ist Gründer und Leiter des Alignment Research Center. Früher war er Leiter der KI-Sicherheit am US AI Safety Institute und davor Leiter des Alignment-Teams bei OpenAI, wo er laut Dwarkesh-Beschreibung RLHF erfand. Seit dem 9.9.2026 sitzt er im Vorstand der OpenAI Foundation und enthält sich dort bei OpenAI-Fragen und Modellprüfungen. Bei den Hinton Lectures 2026 in Toronto (9.–11.11.) hielt er Abend 1, „AI Alignment – What's Working and What's Not“, eingeführt von Geoffrey Hinton. Laut Beschreibung zeigt er, „where current approaches are working, where they fall short and how researchers are working to make increasingly capable systems safer“. Laut Fremdtranskript geht er die Ansätze durch (Bewerter, die sich nicht austricksen lassen, Training ohne Schummeln, Überwachung der Gedankenkette, Interpretierbarkeit, neue Ideen) und urteilt: „all plausible, but none is on a trajectory where it is definitely, or even probably, going to work“. Er fordert „brakes“, also die Fähigkeit, ohne großen Schaden anzuhalten.
Quellen: [Transkript bei Singju Post](https://singjupost.com/paul-christiano-ai-alignment-whats-working-and-whats-not-the-hinton-lectures-2026-transcript/) · [AIS Foundation](https://aisfoundation.ai/hinton-lectures-2026) · [TechCrunch, 9.9.2026](https://techcrunch.com/2026/09/09/openai-adds-a-prominent-ai-doomer-to-its-board-of-directors/) · Video: `clips.json` C4
Sag: „One of the field's most respected safety researchers recently went through every method we have. His verdict: all plausible, none guaranteed yet.“
Achtung: Doom-Sätze aus demselben Vortrag nicht verwenden: „I think there is a high risk of an AI takeover within the next three years“ und „for most people in this room, the most likely reason they will die is because of an AI accident“ (Ton, §1.1). Den Wortlaut „definitely, or even probably“ kennen wir nur aus dem Fremdtranskript, er kann eine Zusammenfassung sein. TechCrunch nennt ihn „a prominent AI doomer“, das nicht übernehmen.

**F41 · Ein Laborchef ruft selbst nach Schiedsrichtern** · Fakt (Aussage) · sicher (Inhalt), Wortlaut nicht gesehen
Laut Axios (14.7.2026) fordert Hassabis eine von den USA geführte weltweite KI-Aufsicht bzw. eine unabhängige Normenstelle mit externen Prüfern. Auch Semafor berichtet darüber.
Quelle: [Axios, 14.7.2026](https://axios.com/2026/07/14/demis-hassabis-ai-regulation-google-deepmind)
Achtung: Interesse nennen (§1.9a). Sein Satz zu einem KI-„oil spill“ (Masters of Scale, 5.11.2026) ist nicht bestätigt, darum nicht verwenden.

**F42 · Steelman: Vielleicht lässt sich Kontrolle gar nicht lösen** · Fakt (Aussagen) · sicher (gesagt), Wortlaute teils dünn
- Roman Yampolskiy (laut Danny-Jones-Beschreibung „computer scientist associate professor known for research on AI safety“) hält Kontrolle über eine allgemeine Superintelligenz für „not solvable“. Im Sept. 2026 sagte er: „We need to stop building general superintelligence“ (azfamily, 17.9.2026, Adresse nicht notiert). Seine Zahl von 99,9 % Aussterberisiko (VladTV, Juni 2026) nicht verwenden, das ist Doom.
- Geoffrey Hinton (CNN, YouTube 17.9.2026) sagt sinngemäß, ein Notschalter halte auf Dauer nicht, denn eine Superintelligenz würde ihre Wächter überreden. CNN ist rot, also nur Zitatkarte, und der Wortlaut ist nicht bestätigt.
- Eliezer Yudkowsky (SBS D Forum, Seoul, 5.11.2026) fordert Verträge wie bei Atomwaffen und die Überwachung von Chip-Exporten.
Sag (Steelman in einem Satz): „Some researchers think this can't be solved at all, that a mind smarter than us will always find a way around our rules.“
Urteil (ein Satz, Vorschlag): „Maybe. But nobody has proven that either, and the people working on it now have something Good never had: the machines themselves, to study.“
Achtung: Das Urteil ist eine Deutung, kein Fakt.

**F43 · Wer die Macht hat (Verantwortung benennen, §11)** · Fakt · sicher
- **Labore** entscheiden, was gebaut wird und wann es startet. Fünf haben Prüfungen durch CAISI zugesagt (F36).
- **Regierungen:** Das EU AI Office kann strafen und Modelle zurückrufen (F37), CAISI prüft (F36), und die US-Regierung will Landesrecht verdrängen (F38).
- **Wähler:** Landesgesetze in Kalifornien und New York (F38). Der Kongress lehnte das Moratorium mehrfach ab.
- **Forschende:** Christiano und die Interpretierbarkeit (F39, F40). Der International AI Safety Report 2026 (3.2.2026, Vorsitz Yoshua Bengio, über 100 Fachleute) beschreibt ein „evidence dilemma“, sinngemäß: Wer auf sichere Beweise wartet, handelt womöglich zu spät. [arXiv 2602.21012](https://arxiv.org/abs/2602.21012)
- **Die ehrliche Lücke:** In den USA ist die Prüfung freiwillig, in der EU gibt es noch keine Strafe, und laut Christiano ist kein Ansatz sicher auf Erfolgskurs.
Achtung: Der US-China-„Super Intelligence Dialogue“ (Sept. 2026) steht im Faktenzettel von #31 und wird hier nicht gebraucht.

---

## Station 6 · Und was bleibt für uns? (8:00–9:30)

**F44 · Good: Unser Überleben hängt an dieser Maschine** · Fakt · sicher → F9

**F45 · Mehr Menschen erfinden, nicht weniger** · Fakt · sicher → F28
Ein 23-jähriger Amateur, eine Frage an die KI, und am Ende eine Arbeit mit Tao als Mitautor. Das ist der schönste belegte Fall für den Gedanken, dass Menschen weiter erfinden, aus Freude und nicht aus Not.

**F46 · Was die Mathematiker selbst hoffen** · Fakt (Aussagen) · sicher
Die Fields-Erklärung: KI könne „enhance and accelerate genuine mathematical study and understanding“ (F32). Tao: Mehr Beweise brauchen mehr Verstehen, also Menschen, die auswählen, prüfen und erklären („Math 2.0“, F31; LARB 15.11.2026). Das ist sinngemäß, den Wortlaut am Original prüfen.

**F47 · Hassabis: „foothills of the singularity“** · Reserve → F12

Für den Kernsatz und „HOW TO STEER IT“ braucht es keine weiteren Fakten.

---

## Skandal-Prüfung (§2.5f, Stand 25.11.2026)

| Person | Rolle im Film | Ergebnis |
|---|---|---|
| Demis Hassabis | C1, F11–F13, F41 | kein Skandal gefunden; Rollenwechsel vom 5.8.2026 beachten |
| Terence Tao | C3, F28–F32 | kein Skandal; öffentlicher Streit mit OpenAI über die Massenveröffentlichung → kein Clip vom OpenAI-Kanal |
| Timothy Gowers | Zitatkarte (H1) | kein Skandal; seine Stellungnahme war laut einem Blog-Kommentar „solicited by OpenAI“ (unbestätigt) → Begleitarbeit mit OpenAI nennen |
| Daniel Litt | Zitatkarte (H1) | offen: unbestätigter Hinweis, er forsche bei OpenAI („Researching reasoning @OpenAI“) → am iMac prüfen, sonst Zitat weglassen |
| Noga Alon | Zitatkarte (H1) | prüfte den Beweis für OpenAI (Papst-Faktenzettel) → so ankündigen |
| Paul Christiano | C4, F40 | kein Skandal; Vorstand der OpenAI Foundation seit 9.9.2026 nennen |
| Sydney Katz | C4b | nichts gefunden (nicht gezielt gesucht) |
| Geoffrey Hinton | Zitatkarte | nichts gefunden |
| Roman Yampolskiy | Steelman | kein Skandal, aber extreme Zahlen (nicht verwenden) |
| Liam Fedus, Ekin Dogus Cubuk | C2 | nichts gefunden (Stichprobe 25.11.); Firmengründer mit Eigeninteresse |
| Joseph Krause, William Bailey | C2b | nicht gezielt gesucht; Krause ist Firmenchef |
| Jensen Huang | – | ausgeschlossen (§2.5f), darum auch das NVIDIA-Video über Lila meiden |

## Gegenstimmen je Station (Überblick)

| Station | Gegenstimme in einem Satz | Quelle |
|---|---|---|
| Hook / 4 | Keine neuen Werkzeuge nötig, Menschen verbesserten das Ergebnis binnen Wochen | Bloom und Gowers (Begleitarbeit), Quanta 3.8.2026 |
| 1 | Good lag beim Datum falsch | Good 1965, S. 78 |
| 2 Energie | KI steuert, liefert aber keinen Strom; Bau und Genehmigung laufen im Menschentempo | IAEA 12.11.2026, RAND Juni 2026 |
| 3 Materialien | Viele Vorhersagen bilden sich im Labor nicht, manches war schon bekannt | UF arXiv 2611.09671, ChemRxiv 23.1.2026, Cheetham und Seshadri 2024 |
| 3 Materialien | Manche Umwandlungen lassen sich nicht beschleunigen | Bailey (Columbia), Bulletin 8.9.2026 |
| 4 Entdeckung | Die Ziele der Firmen und der Mathematik sind „severely misaligned“; es gibt mehr Beweise als Verstehen | Fields-Erklärung 11.9.2026, Tao (Nature 22.10.2026, SAIR 3.11.2026) |
| 5 Kontrolle | Kontrolle ist vielleicht gar nicht lösbar | Yampolskiy 2026, Hinton (CNN 17.9.2026) |
| 5 Kontrolle | Kein Ansatz ist sicher auf Erfolgskurs | Christiano 10.11.2026 |

## Staunen-Fakten (5 + Reserve)

1. **Ein 80 Jahre altes Rätsel, von einer KI widerlegt**, und Timothy Gowers hätte die Arbeit „without hesitation“ für die wichtigste Fachzeitschrift empfohlen (H1).
2. **2,4 Mio. mögliche Kristalle in 28 GPU-Stunden durchsucht**, daraus ein Supraleiter, den es vorher nicht gab, und Menschen haben ihn gebaut (F23).
3. **Fast 3.000 Katalysatoren in drei Monaten**, und die Lösung lag in einem Metall, das als Sackgasse galt (H2, Firmenangabe).
4. **Ein 23-Jähriger ohne Mathematikstudium knackt mit einer einzigen Frage an eine KI ein 60 Jahre altes Erdős-Problem**, und Tao wird Mitautor der Arbeit (F28).
5. **Der Mann hinter dem Satz von der „letzten Erfindung“** arbeitete in Bletchley Park unter Turing an der Enigma der Marine und beriet später Kubrick bei „2001“ (F3, F10).

Reserve: Fusionsplasma wird in Tausendstelsekunden instabil, die KI reagiert schneller (F15) · 25 Fields-Medaillenträger benutzen das Wort der KI-Sicherheit, „misaligned“, für die Firmen (F32) · Zanskar fand das erste „blinde“ Geothermiefeld der USA seit über 30 Jahren (F20, Stand Dez. 2025) · AlphaProof Nexus bewies 44 Vermutungen für einige Hundert Dollar pro Problem (H3) · AlloyBot schafft 150 Legierungen pro Woche (F24).

Hinweis zu 1: Dass Gowers Fields-Medaillenträger ist, habe ich in dieser Runde nicht belegt (für Tao ist es belegt: SAIR, Simons). Bis zur Prüfung im Film nur den Namen nennen.

---

## Nicht verifiziert (bitte im Faktencheck klären oder weglassen)

1. **Alle Clip-Wortlaute und Zeitmarken** (Untertitel und Ton aus der Cloud gesperrt). Die Liste der zu prüfenden Stellen steht in `clips.json` unter „offen“.
2. **Good, S. 33 und S. 78:** den Definitionssatz, den Mittelteil des Zitats und den Wortlaut der Prognose am Original-PDF prüfen. Dass es keine Tonaufnahme von Turing gibt, steht nur im Gerüst.
3. **Goods Wechsel an die Virginia Tech:** 1967 oder 1969.
4. **Die Nachtschicht-Anekdote** (F4).
5. **HAL nach Goods Ideen:** nur Smithsonian und ein Blog („presumably“), nicht sagen.
6. **Gowers „without hesitation“:** in Abschnitt 9 der Begleitarbeit prüfen, ebenso, ob seine Stellungnahme „solicited by OpenAI“ war. Seine Fields-Medaille ist nicht belegt.
7. **Litt:** ob er bei OpenAI forscht.
8. **Quanta 3.8.2026:** zwei Adressen, eine stimmt vermutlich nicht.
9. **AlphaProof Nexus in Science (8.10.2026):** nur zwei Sekundärquellen.
10. **Lila:** nur Firmenangaben und ein Preprint.
11. **ElementsClaw:** Die Messwerte änderten sich zwischen den Fassungen.
12. **arXiv 2611.09671:** Datum, Autoren und Zahlen nur aus einem Suchauszug.
13. **IAEA „80 Mrd. $“:** Wortlaut und Zeitraum.
14. **SPARC „zu 80 % fertig (Juli 2026)“** und **DOE Genesis Mission** (293 Mio. $, 17 Labore).
15. **Christiano „definitely, or even probably“:** nur aus dem Fremdtranskript.
16. **Hinton bei CNN:** Wortlaut.
17. **Yampolskiy:** Adressen von azfamily und VladTV.
18. **Tao bei IBM, Live Science und Daily Maverick:** Adressen; dazu, aus welchem Nature-Beitrag das „Achilles heel“-Zitat stammt.
19. **Gekürzte Adressen:** MIT Technology Review (15.12.2025 und 12.1.2026), DeepMind-Blog (UK-Labor), FuelCellsWorks.
20. **Erdős-Problem #1196:** Datum und Alter des Problems schwanken.
21. **Periodic Labs, Bewertung von 7,5 Mrd. $:** Datum offen (Forbes laut Zweitquelle).

**Am iMac öffnen (aus der Cloud nicht erreichbar):** openai.com (Einheitsabstand und PDF der Begleitarbeit), arxiv.org (2605.20695, 2605.22763, 2604.23758, 2611.09671, 2602.21012), quantamagazine.org, scientificamerican.com, lila.ai, sciencedaily.com, ans.org, news.uchicago.edu, scmp.com, spectrum.ieee.org, chemrxiv.org, cen.acs.org, nature.com (Tao, World View), mathandai.org, implicator.ai, digital-strategy.ec.europa.eu, nist.gov und hpcwire.com (CAISI), singjupost.com (Christiano, Hassabis), gsb.stanford.edu, stanforddaily.com, quoteinvestigator.com, vtechworks.lib.vt.edu (Good, S. 31, 33, 78), news.vt.edu, gchq.gov.uk, thebulletin.org, latent.space/p/periodic (Transkript zu C2), generalist.com (Transkript zu C2c).
