# Faktencheck Film #76 „Your Kids Will Grow Up With Superintelligence“ · vo-v2 · 25.11.2026

**Geprüft:** `vo-v2.txt` (147 Zeilen, Zeilennummern unten = Zeilen dieser Datei). **Bezugsdatum für alle Zeitwörter:** Veröffentlichung So 6.12.2026. Clip-Zeilen [CLIP Cn] wurden nur in ihrer Einordnung geprüft, nicht im Wortlaut.

**Ergebnis auf einen Blick:** 73 prüfbare Aussagen · **61 ok · 11 zugespitzt · 1 falsch · 0 unbelegt.** Nichts ist erfunden; alle Personen, Studien und Zahlen existieren. **Muss geändert werden: 1 Zeile (Z. 87, England/Coding: Zeitangabe falsch, „every schoolchild“ zu stark).** Alles andere darf bleiben, einige Stellen haben unten einen optionalen, genaueren Satz.

**Methode und Grenzen (wichtig für den Zweitprüfer):**
- Direkt abrufbar waren nur YouTube Data API (Beschreibungen, Datum, Kapitel, Lizenz: Gopnik, Susskind/Gresham, Susskind/RSA, Susskind/Jimmy's Jobs, Acemoglu/Bovell) und Wikipedia. WebFetch scheiterte an edworkingpapers.com, bls.gov, commonsensemedia.org, axios.com; laut Faktenzettel sind auch ifstudies.org, unfpa.org, who.int, gresham.ac.uk, news.berkeley.edu, educationnext.org gesperrt. Alles andere wurde über Suchauszüge der Primärseiten plus unabhängige Medien geprüft (in Spalte „Quelle“ markiert: *direkt*, *Suchauszug*, *sekundär*).
- Der Branch `claude/f76-imac` mit den Quellentexten war bis 25.11.2026, 10:53 UTC nicht auf dem Remote (`git ls-remote`), also nicht nutzbar. Gegenlesen gegen die Repo-Texte, sobald da: IFS-PDF, UNFPA-PDF, Common-Sense-Bericht, EdWorkingPaper 26-1451, BLS-Release, Education-Next-PDF, Gresham-Transkript.

---

## a) MUSS ÄNDERN

| Zeile in vo-v2 (wörtlich) | Problem | Quelle (URL, Datum) | Ersatzzeile (fertig) |
|---|---|---|---|
| Z. 87: „His warning comes from his own country. A little over ten years ago, England made coding, the skill of the future, a required subject for every schoolchild. Today, writing code is one of the things these machines do best.“ | **Falsch: Zeitwort.** Lehrplan veröffentlicht 11.09.2013, Unterricht ab September 2014; Susskind selbst spricht von „England's 2013 coding push“. Am 6.12.2026 sind das 12–13 Jahre, nicht „a little over ten“. **Zu stark: „every schoolchild“.** Pflicht ist Computing im National Curriculum von 5 bis 16; Academies und Privatschulen müssen den National Curriculum nicht befolgen (heute die Mehrheit der Sekundarschulen). | gov.uk, „National curriculum in England: computing programmes of study“, veröffentlicht 11.09.2013: https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study · gov.uk, „The national curriculum“ (Stand 2026): https://www.gov.uk/national-curriculum („Other types of school like academies and private schools do not have to follow the national curriculum.“) · Jimmy's Jobs of the Future mit Susskind, 24.11.2026 (Beschreibung, *direkt* via YouTube-API): https://www.youtube.com/watch?v=FwIPil4ioaQ („citing England's 2013 coding push“) · Gresham-Kapitel „08:19 Case Study: The UK's Mandatory Coding Curriculum“, Vortrag 26.05.2026: https://www.youtube.com/watch?v=Bni42PX7C-Y | „His warning comes from his own country. More than ten years ago, England made coding, the skill of the future, a required school subject from age five. Today, writing code is one of the things these machines do best.“ <br>*Ganz exakte Alternative:* „More than ten years ago, England put coding, the skill of the future, on the national curriculum from age five.“ |

---

## b) KANN BLEIBEN, mit Hinweis

Zuspitzungen, die erlaubt sind; optionale genauere Fassung, wo sie nichts kostet.

1. **Z. 13 „six in ten American parents called their child's future with artificial intelligence bleak or frightening.“** Zahl stimmt (35 % „bleak“ + 25 % „frightening“). Befragt wurden aber nur rund 2.000 US-Eltern **schulpflichtiger** Kinder (YouGov, Juli/Aug. 2026). Interesse: Das Institute for Family Studies wirbt mit seiner „Family First Technology Initiative“ für Beschränkungen von Kinder-Technik (Mitautor Michael Toscano: „limit technology's reach into the lives of kids and empower parents“, https://ifstudies.org/family-first-technology-initiative); im Film nicht genannt, darum in der Beschreibung mit Einordnung nennen. *Optional:* „…six in ten American parents of school-age kids called…“ (+3 Wörter, Hook-Budget beachten).
2. **Z. 33 „That progress has slowed. But it's real.“** Stimmt (UN IGME/WHO: Tempo seit 2015 um >60 % langsamer). Zusatzinfo: Gates/IHME schätzten für 2025 den ersten Anstieg der Kindertode in diesem Jahrhundert (Modellwert, Hilfskürzungen). „almost any child before“ in Z. 33 ist deshalb richtig vorsichtig. *Optional:* „That progress has slowed, and aid cuts now put it at risk. But it's real.“
3. **Z. 51 „Where it worked, there was a grown-up in the room.“** Verallgemeinerung, aber gedeckt: erfolgreiche Programme (Nigeria/Weltbank: Paare am Copilot unter Lehreraufsicht; IZA DP 19025: Ghana, Nigeria, Sierra Leone) liefen betreut. Gegenbefund fair im Kopf behalten: Bei Stanford hob ein Mensch daneben nur die Nutzung, nicht die Leseleistung, und Khanmigo lief in betreuten Förderstunden und half trotzdem nur wenig. Der Satz behauptet „notwendig“, nicht „ausreichend“, und ist damit haltbar.
4. **Z. 65 „And still, four in five said their real friends come first.“** Common Sense rahmt es selbst so („80 percent prioritize real friendships“); gemessen wurde aber Zeit: 80 % der Nutzer verbringen mehr Zeit mit echten Freunden als mit KI-Begleitern. *Optional, exakt:* „And still, four in five said they spend more time with real friends.“
5. **Z. 71 „When machines make answers cheap, what stays scarce is a person you can trust.“** These von Alex Imas („relational sector“: Menschen als Teil des Produkts). „Trust“ steht so nur in Zusammenfassungen seines Essays und bei François Candelon (Fortune, 24.07.2026), nicht als Kernsatz bei Imas. Als ungenannte „some economists“ vertretbar. Interesse: Imas ist seit Mai 2026 Director of AGI Economics bei Google DeepMind (beurlaubt von Chicago Booth) → in der Beschreibung dazuschreiben.
6. **Z. 81 „He just wrote a whole book on this exact question. His verdict? No skill is future-proof.“** „just“: US-Ausgabe 17.11.2026 (19 Tage vor Release), UK 10.09.2026, ok. „No skill is future-proof“ ist eine **Umschreibung** (Gresham-Kapitel „The Illusion of ‚Future-Proofing‘“ und „Why Future Skills Are Impossible to Predict“; Jimmy's-Jobs-Kapitel „No Future Proof Skills“). Im Bild **nicht** als Zitat in Anführungszeichen mit Namen zeigen.
7. **Z. 95 „That's where Susskind tells parents to look.“** Gedeckt durch Murnane (Education Next): Susskind erwartet mehr Chancen in heute unterbewerteten Jobs „from care work to teaching, nursing to the arts“; Jimmy's-Jobs-Kapitel „Human Process Matters“. Er rät aber ausdrücklich nicht, Kinder auf einen Beruf zu lenken; „look“ ist richtig, „steer“ wäre falsch.
8. **Z. 121 „Most schools aren't there yet.“** Keine Messung von „teach both, test both“. Gedeckt durch Murnane: Susskinds Ansatz „would require massive changes in most U.S. schools“; Gallup/Walton-Lehrerbefragung Feb./März 2026 (n = 2.069, *sekundär* über EdWeek/Axios, Mai 2026): 34 % der Lehrkräfte ohne jede KI-Anleitung, 48 % nur informell.
9. **Z. 1–3 „Your kids will grow up with superintelligence … A machine smarter than every adult they know.“** Prognose als Prämisse des Kanals (REGELN §1.4). Gekennzeichnet über Z. 23 („in this film's scenario“) plus Einblendung „SCENARIO · 20XX“ (§3.6). Ok so.
10. **Z. 23 „This child starts school in twenty thirty-two“** und **Z. 39 „First grade.“** In den USA beginnt der Kindergarten meist mit 5 (2031); „first grade 2032“ stimmt für Kinder, die Anfang 2026 geboren sind. Kein Fehler im Szenario. *Optional:* „starts first grade in twenty thirty-two“.
11. **Z. 133 „That saves a child from years spent chasing a job that's gone by graduation.“** Ratschlag mit Risiko-Bild, kein Faktenanspruch; folgt Susskinds Argument. Ok.

**Zeitwörter relativ zum 6.12.2026:** „new survey“ Z. 13 (IFS 12.11.2026) ok · „this year“ Z. 21 (2026) ok · „this year“ Z. 51 (NBER w35620/w35621 Aug. 2026, IZA Okt. 2026) ok · „In a single generation“ Z. 33 (2000→2024) ok · „last year“ Z. 65 (Common Sense Juli 2025) ok · „just wrote“ Z. 81 ok · „A little over ten years ago“ Z. 87 **falsch** (→ a) · „two years ago“ Z. 109 (Nobelpreis 14.10.2024) ok.

**Für Clip-Schritt und Beschreibung (kein Textfehler):**
- C1 Gopnik: Video zPbBYtwSZaU (UC Berkeley, 24.04.2026, Lizenz Creative Commons), Vortrag laut Beschreibung am 05.11.2025, erwarteter Satz steht wörtlich in der Beschreibung. Beschreibung nennt „Music by HoliznaCC0“: prüfen, dass unter den 9 s keine Musik liegt (§7).
- C2 Susskind: Gresham-Video Bni42PX7C-Y, „recorded … on the 26th of May 2026“, Kapitel 07:18 „The Illusion of ‚Future-Proofing‘“ bestätigt. Sagt er im Clip „UK“, ist das kein Konflikt mit „England“ im VO.
- C4 Acemoglu: Bovell-Video zAvOo4FrZMI, 03.09.2026, Kapitel 26:48 „Who Controls the Direction of AI?“ bestätigt; Beschreibung: „the direction of the technology is still a choice“.
- C5 Susskind: RSA-Short 3smsYIzw-UI, 16.09.2026, 55 s, „it may be more useful to ask what problems you want to spend your life solving“ (er formuliert vorsichtig: „may“).

---

## c) Volle Aussagen-Tabelle

Status: ok · zugespitzt · falsch · unbelegt. Quelle: *direkt* = selbst geöffnet; *Suchauszug* = Text der Primärseite im Suchindex; *sekundär* = Medium/Dritte.

| # | Z. | Aussage (Kurzform, wörtlich) | Status | Quelle (Datum) | Notiz |
|---|---|---|---|---|---|
| 1 | 1 | „Your kids will grow up with superintelligence.“ | zugespitzt | – (Prämisse, REGELN §1.4) | Prognose, Szenario-Kennzeichnung Z. 23 + Einblendung |
| 2 | 3 | „A machine smarter than every adult they know.“ | zugespitzt | – | Prognose wie #1 |
| 3 | 11 | „There is no safe answer.“ | ok | Gresham-Kapitel 14:07 „Why Future Skills Are Impossible to Predict“, 26.05.2026, *direkt* https://www.youtube.com/watch?v=Bni42PX7C-Y | Susskinds These |
| 4 | 13 | „In a new survey“ | ok | IFS-Bericht, 12.11.2026 | 24 Tage vor Release |
| 5 | 13 | „six in ten American parents“ | zugespitzt | IFS, *Suchauszug*: „6 in 10 parents with school-age children“ https://ifstudies.org/ifs-admin/resources/reports/ifs-report-ai-and-the-future-of-k-12-education-november2026.pdf | nur Eltern schulpflichtiger Kinder; Interesse IFS |
| 6 | 13 | „called their child's future … bleak or frightening“ | ok | IFS, *Suchauszug*: „bleak“ (35%), „frightening“ (25%) | |
| 7 | 19 | „the more that machine can do, the more a few human things are worth“ | zugespitzt | Imas, „What will be scarce?“, April 2026 https://aleximas.substack.com/p/what-will-be-scarce | These, keine Tatsache |
| 8 | 21 | „A child is born this year.“ | ok | – | 2026 |
| 9 | 23 | „starts school in twenty thirty-two“ | zugespitzt | – | USA: Kindergarten meist 2031, siehe b) 10 |
| 10 | 23 | „turns eighteen in twenty forty-four“ | ok | – | 2026 + 18 |
| 11 | 23 | „in this film's scenario, machines become smarter than all of us“ | ok | – | als Szenario markiert |
| 12 | 31 | „The United Nations asked young adults around the world“ | ok | UNFPA-Presse 07.07.2026, *Suchauszug* https://www.unfpa.org/press/young-adults-want-relationships-children-and-hopeful-futures-financial-and-job-insecurity | 108.926 Online-Befragte, 18–39 J., 73 Länder, nicht repräsentativ |
| 13 | 31 | „what keeps them from having children … Money. And housing.“ | ok | UNFPA-Länderseiten/Bericht „Lives, Choices and Futures“ 2026, *Suchauszug* https://www.unfpa.org/publications/lives-choices-and-futures-demographic-futures-survey | 72 % nennen „economic and housing constraints“ als wichtige Hürde |
| 14 | 31 | „Plenty of them do worry about artificial intelligence.“ | ok | GoodStats (Auswertung UNFPA), *sekundär* https://data.goodstats.id/statistic/isu-global-yang-paling-dikhawatirkan-anak-muda-pada-2026-TcBSZ | 47,8 % „somewhat or very worrying“ |
| 15 | 31 | „on that survey's list of worries, it came last“ | ok | Bocconi, *Suchauszug* https://www.unibocconi.it/en/news/young-people-havent-given-family-theyre-waiting-right-conditions · UNFPA Asien-Pazifik https://asro.unfpa.org/en/news/seven-myths-about-why-young-people-asia-pacific-arent-having-families-they-want | „ranks lowest among the concerns explored“ |
| 16 | 31 | „most of them still want children“ | ok | UNFPA-Presse 07.07.2026, *Suchauszug* | meiste haben Kinder; 79 % M / 72 % F der Kinderlosen 35–39 wollen noch |
| 17 | 33 | „starts life safer than almost any child before“ | ok | WHO 18.03.2026 https://www.who.int/news/item/18-03-2026-progress-in-reducing-child-deaths-slows-as-4.9-million-children-die-before-age-five | „almost“ nötig: IHME-Modell 2025 Anstieg (Gates, 04.12.2025) |
| 18 | 33 | „In a single generation … more than halved“ | ok | WHO-Generaldirektor 18.03.2026, *Suchauszug* https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---18-march-2026 | >10 Mio. (2000) → 4,9 Mio. (2024) |
| 19 | 33 | „That progress has slowed.“ | ok | WHO 18.03.2026 | seit 2015 >60 % langsamer |
| 20 | 35 | „Electricity never did anyone's homework. This machine will.“ | ok | Pew 24.02.2026 https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/ | Schulaufgaben = Hauptnutzung der Teens |
| 21 | 39 | „Twenty thirty-two. First grade.“ | ok | – | |
| 22 | 45 | „schools have already tried an early version“ | ok | Stanford SCALE, Juni 2026 | |
| 23 | 47 | „Stanford researchers“ | ok | Robinson, Gormley, Ribeiro, Loeb, EdWorkingPaper 26-1451, Juni 2026 https://edworkingpapers.com/ai26-1451 | |
| 24 | 47 | „elementary school children in two districts“ | ok | ebd., *Suchauszug*: „355 students in grades 1 to 5 in two school districts“ | |
| 25 | 47 | „a reading tutor built on today's artificial intelligence“ | ok | ebd.: „AI literacy tutor“ | Anbieter ungenannt |
| 26 | 47 | „In one district, four in ten never used it.“ | ok | Stanford SCALE/The 74, *Suchauszug* https://scale.stanford.edu/news/study-giving-kids-access-ai-tutors-doesnt-mean-theyll-use-them | „just over 60%“ loggten sich je ein |
| 27 | 47 | „In the other, nearly half. Not once.“ | ok | ebd.: „53% in the second ever logged on“ | 47 % nie |
| 28 | 51 | „Other big trials this year point the same way.“ | ok | NBER w35620, Aug. 2026 https://www.nber.org/papers/w35620 | Tutor in 17 % der Fehler-Sitzungen genutzt |
| 29 | 51 | „On its own, a machine tutor helps a little.“ | ok | ebd., *Suchauszug*: „about 1.3 national percentile ranks per term“ | ähnlich wie Übung ohne KI |
| 30 | 51 | „Where it worked, there was a grown-up in the room.“ | zugespitzt | IZA DP 19025, Okt. 2026 https://docs.iza.org/dp19025.pdf · Weltbank WP 11125 (Nigeria, 2025) https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full | siehe b) 3 |
| 31 | 53 | „Alison Gopnik studies how small children really learn.“ | ok | UC Berkeley, *direkt* https://www.youtube.com/watch?v=zPbBYtwSZaU | Entwicklungspsychologin |
| 32 | 53 | „Hand a four-year-old a strange new toy … often beats top college students“ | ok | UC Berkeley 24.04.2026, *direkt*; Studie Lucas et al., Cognition 2014 | gilt für Spielzeug mit ungewöhnlicher Regel |
| 33 | 55 | Einordnung C1 (Berkeley Talks, Vortrag 5 Nov 2025) | ok | *direkt*: „This lecture took place on Nov. 5, 2025“ | Musik prüfen |
| 34 | 57 | „a child needs a person who cares“ | ok | ebd.: „made possible by a specialized care system provided by adults“ | Umschreibung |
| 35 | 61 | „Twelve. Twenty thirty-eight.“ | ok | – | |
| 36 | 65 | „teenagers who already use chatbots as companions“ | ok | Common Sense Media, 16.07.2025 https://www.commonsensemedia.org/research/talk-trust-and-trade-offs-how-and-why-teens-use-ai-companions | 72 % haben KI-Begleiter genutzt |
| 37 | 65 | „In a survey last year“ | ok | ebd. | Befragung Apr./Mai 2025, n = 1.060 |
| 38 | 65 | „a third had talked about something serious with the machine instead of a person“ | ok | ebd., *Suchauszug*: „33% … important or serious matters“ | Basis: Nutzer |
| 39 | 65 | „four in five said their real friends come first“ | zugespitzt | ebd.; TechCrunch 21.07.2025 https://techcrunch.com/2025/07/21/72-of-u-s-teens-have-used-ai-companions-study-finds/ | gemessen: mehr Zeit mit echten Freunden |
| 40 | 71 | „Some economists expect a shift.“ | ok | Imas, April 2026; Fortune 19.04.2026 https://fortune.com/2026/04/19/alex-imas-human-jobs-ai-economy-chicago-economist-substack-doomsday-scenario/ | Imas bei Google DeepMind |
| 41 | 71 | „what stays scarce is a person you can trust“ | zugespitzt | Imas (s. o.); Candelon, Fortune 24.07.2026 https://fortune.com/2026/07/24/ai-doesnt-end-scarcity-it-relocates-it/ | „trust“ nur sekundär |
| 42 | 77 | „Eighteen. Twenty forty-four.“ | ok | – | |
| 43 | 81 | „Daniel Susskind is an economist“ | ok | Gresham-Beschreibung, *direkt* | |
| 44 | 81 | „who advises the British government on artificial intelligence and work“ | ok | *direkt*: „member of the UK Government's Expert Panel on AI and the Future of Work“ (Panel seit Jan. 2026) | |
| 45 | 81 | „He just wrote a whole book on this exact question.“ | ok | PRH (US 17.11.2026) https://www.penguinrandomhouse.com/books/812111/what-should-my-children-do-by-daniel-susskind/ · Penguin UK (10.09.2026) | |
| 46 | 81 | „His verdict? No skill is future-proof.“ | ok | Gresham-Kapitel 07:18; Jimmy's Jobs 24.11.2026, *direkt*: „‚future-proofing‘ specific skills is unrealistic“ | Umschreibung, kein Zitat |
| 47 | 83 | „he has a book to sell“ | ok | – | Interesse offengelegt |
| 48 | 85 | Einordnung C2 (Gresham, 26 May 2026, 07:18) | ok | *direkt*: „recorded … on the 26th of May 2026“ | |
| 49 | 87 | „His warning comes from his own country.“ | ok | – | Brite |
| 50 | 87 | „A little over ten years ago“ | **falsch** | gov.uk, 11.09.2013; Unterricht ab Sept. 2014 | 12–13 Jahre → a) |
| 51 | 87 | „England made coding … a required subject for every schoolchild“ | zugespitzt | gov.uk „The national curriculum“ | Academies/Privatschulen ausgenommen → a) |
| 52 | 87 | „writing code is one of the things these machines do best“ | ok | Stanford HAI AI Index 2026 (13.04.2026), *sekundär* https://hai.stanford.edu/ai-index/2026-ai-index-report | SWE-bench Verified nahe menschlicher Basislinie |
| 53 | 91–93 | Meiste neue Jobs bis 2035: „Home care aide“ | ok | BLS Employment Projections 2025–35, 27.08.2026 https://www.bls.gov/news.release/archives/ecopro_08272026.htm | *sekundär*: Axios 28.08.2026, Becker's |
| 54 | 93 | „Almost eight hundred and fifty thousand new jobs“ | ok | BLS-Tabelle via Axios/NCHStats: +847.300 | 4.677.100 → 5.524.400 |
| 55 | 93 | „mostly because the country is getting older“ | ok | BLS, *Suchauszug*: „the aging population is expected to boost demand …“ | |
| 56 | 95 | „That's where Susskind tells parents to look … a bedside … a classroom“ | ok | Murnane, Education Next, Nov. 2026 https://www.educationnext.org/guiding-kids-to-adapt-to-a-future-with-ai-book-review-what-should-my-children-do-susskind/ | siehe b) 7 |
| 57 | 97 | „Home care pays about thirty-six thousand dollars a year“ | ok | BLS OEWS Mai 2025 (Median 35.800 $) via Becker's, *sekundär* https://www.beckershospitalreview.com/workforce/10-fastest-growing-healthcare-jobs-ranked/ | OOH-Wert Mai 2024: 34.900 $ |
| 58 | 97 | „nothing guarantees more“ | ok | Susskind, Knight Columbia 07.04.2025 https://knightcolumbia.org/content/what-will-remain-for-people-to-do | Lohn für Restarbeit „highly uncertain“ |
| 59 | 99 | „The biggest job growth is in care“ | ok | BLS TED 2026 https://www.bls.gov/opub/ted/2026/total-employment-projected-to-grow-3-5-percent-between-2025-and-2035.htm | Healthcare Support +13,3 %, schnellste Gruppe |
| 60 | 103 | „Thirty. Twenty fifty-six.“ | ok | – | |
| 61 | 107 | „Who the machines work for … is not written into the technology.“ | ok | Bovell/Acemoglu 03.09.2026, *direkt* https://www.youtube.com/watch?v=zAvOo4FrZMI | These |
| 62 | 109 | „Daron Acemoglu won the Nobel Prize in economics two years ago.“ | ok | Nobel-Pressemitteilung 14.10.2024 https://www.nobelprize.org/prizes/economic-sciences/2024/press-release/ | geteilt mit Johnson, Robinson |
| 63 | 109 | „one of the sharpest critics of how these machines are built today“ | ok | Bovell-Beschreibung, *direkt* | Wertung |
| 64 | 111 | Einordnung C4 (Bovell, 3 Sep 2026, 26:48) | ok | *direkt*: Kapitel „26:48 Who Controls the Direction of AI?“ | |
| 65 | 113 | „decided now. In the labs … In governments. At the ballot box.“ | ok | *direkt*: „what governments, companies, and civil society can do“ | |
| 66 | 121 | „Susskind borrows a rule from the old fight over calculators … Teach both. Test both.“ | ok | Jimmy's Jobs, *direkt*: „Wilfred Cockcroft's calculator-era ‚teach both, test both‘ model“; RSA-Short 18.09.2026 https://www.youtube.com/watch?v=mywK60Px3kc | |
| 67 | 121 | „Most schools aren't there yet.“ | zugespitzt | Murnane (s. o.), *Suchauszug*: „would require massive changes in most U.S. schools“ | |
| 68 | 123 | „Most American teenagers already use chatbots.“ | ok | Pew 24.02.2026 | 64 % (Befragung Sept./Okt. 2025) |
| 69 | 123 | „Only about half of their parents think their own kid does.“ | ok | Pew 24.02.2026 https://www.pewresearch.org/internet/2026/02/24/what-parents-say-about-their-teens-ai-use/ | 51 %, ~3 von 10 unsicher |
| 70 | 125 | „It protects against a quiet kind of failure.“ | ok | NBER w35620 (17 %) | Ratschlag |
| 71 | 129 | „Susskind has a different question for the dinner table.“ | ok | RSA-Short 16.09.2026, *direkt* https://www.youtube.com/watch?v=3smsYIzw-UI | |
| 72 | 131 | Einordnung C5 (RSA, Short vom 16 Sep 2026) | ok | *direkt*: veröffentlicht 16.09.2026, 55 s | |
| 73 | 133 | „That saves a child from years spent chasing a job that's gone by graduation.“ | zugespitzt | – | Ratschlag, kein Faktenanspruch |

---

## d) AMPEL-LISTE (die 10 heikelsten Aussagen)

Grün = durch Primärquelle bzw. deren wörtlichen Text bestätigt · Gelb = zugespitzt oder nur sekundär · Rot = falsch, muss raus. Endgültig grün erst nach Bestätigung durch den Zweitprüfer.

| # | Aussage (ein Satz) | Ampel | Primärquelle | Exakte Textstelle |
|---|---|---|---|---|
| 1 | Sechs von zehn US-Eltern nennen die Zukunft ihres Kindes mit KI „bleak“ oder „frightening“ (Z. 13). | **gelb** (PDF nicht selbst geöffnet; nur Eltern schulpflichtiger Kinder; Herausgeber mit Interesse) | https://ifstudies.org/ifs-admin/resources/reports/ifs-report-ai-and-the-future-of-k-12-education-november2026.pdf | *Suchauszug:* „Most parents either think the future for their children looks ‚bleak‘ (35%), or ‚frightening‘ (25%)“ … „for 6 in 10 parents with school-age children, AI fosters a negative view of their child's future.“ |
| 2 | Bei der UN-Befragung bremsen Geld und Wohnen den Kinderwunsch, KI steht bei den Sorgen ganz hinten, und die meisten wollen Kinder (Z. 31). | **grün** | https://www.unfpa.org/press/young-adults-want-relationships-children-and-hopeful-futures-financial-and-job-insecurity | „Most of the survey respondents already have children, and the vast majority of those without children by ages 35 to 39 (79 per cent of men and 72 per cent of women) still want to become parents.“ · Bocconi: „artificial intelligence—despite attracting enormous political and media attention—ranks lowest among the concerns explored in the survey.“ · UNFPA-Länderseite (Umschreibung): 72 % nennen „economic and housing constraints“ als wichtige Hürde für Kinder. |
| 3 | Die Zahl der Kinder, die vor dem fünften Geburtstag sterben, hat sich in einer Generation mehr als halbiert, der Fortschritt ist langsamer geworden (Z. 33). | **grün** | https://www.who.int/news/item/18-03-2026-progress-in-reducing-child-deaths-slows-as-4.9-million-children-die-before-age-five | WHO-Generaldirektor 18.03.2026: „In 2000, more than 10 million children died before their fifth birthday. Today, that number has been cut by more than half to 4.9 million deaths in 2024.“ · Release: „since 2015, the pace of reduction in child mortality has slowed by more than 60 per cent“. |
| 4 | Im Stanford-Versuch nutzten in einem Bezirk vier von zehn Grundschulkindern den KI-Lesetutor nie, im anderen fast die Hälfte (Z. 47). | **grün** | https://scale.stanford.edu/news/study-giving-kids-access-ai-tutors-doesnt-mean-theyll-use-them | „just over 60% in the first district and 53% in the second ever logged on to the platform.“ · Abstract EdWorkingPaper 26-1451: „Nearly half of students in the control group never used the platform“. |
| 5 | Wo KI-Tutoren wirkten, war ein Erwachsener im Raum (Z. 51). | **gelb** (Verallgemeinerung; Gegenbefund Stanford) | https://docs.iza.org/dp19025.pdf · https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full | IZA (Abstract, *Suchauszug*): „randomized trials in Ghana, Nigeria and Sierra Leone show that AI-supported programs can raise learning measured without AI“ · Nigeria (VoxDev/Weltbank, Umschreibung): Schüler arbeiteten paarweise mit Copilot (GPT-4) unter Aufsicht von Lehrkräften · Gegenbefund Stanford (Abstract): „However, usage remained low, and the intervention did not improve reading achievement.“ |
| 6 | Laut Gopnik findet ein Vierjähriger bei einem neuen Spielzeug oft schneller heraus, wie es funktioniert, als Top-Studierende (Z. 53). | **grün** | https://www.youtube.com/watch?v=zPbBYtwSZaU (UC Berkeley, 24.04.2026) · https://news.berkeley.edu/2026/04/17/berkeley-talks-alison-gopnik/ | *direkt:* „When children are given a new toy without an obvious use, they often outperform high‑achieving college students in figuring out how it works.“ |
| 7 | Ein Drittel der Teens mit KI-Begleitern besprach Ernstes lieber mit der Maschine, vier von fünf stellen echte Freunde voran (Z. 65). | **gelb** (80 % misst Zeit, nicht Vorrang) | https://www.commonsensemedia.org/research/talk-trust-and-trade-offs-how-and-why-teens-use-ai-companions | Bericht (*Suchauszug*), Wert 33 % der Nutzer: „Have chosen to discuss important or serious matters with AI companions instead of real people“ · Presse 16.07.2025: „Half distrust AI advice, and 80 percent prioritize real friendships“ · TechCrunch: „80% … said they spend more time with real friends than with their AI chatbots“. |
| 8 | Ökonomen erwarten, dass bei billigen Antworten der vertrauenswürdige Mensch knapp wird (Z. 71). | **gelb** („trust“ nur sekundär; Imas bei Google DeepMind) | https://aleximas.substack.com/p/what-will-be-scarce | *Suchauszug:* „The same economic forces that moved 40% of the American workforce off farms and into factories and offices will move workers out of automatable commodity production and into what I'll call the relational sector.“ |
| 9 | England machte Coding vor „a little over ten years“ zur Pflicht „for every schoolchild“ (Z. 87). | **rot** (12–13 Jahre; Academies ausgenommen) → mit Ersatzzeile **grün** | https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study · https://www.gov.uk/national-curriculum | gov.uk: „Published 11 September 2013“ · „Other types of school like academies and private schools do not have to follow the national curriculum.“ · Susskind (Jimmy's Jobs, *direkt*): „citing England's 2013 coding push and AI's later ability to write code“. |
| 10 | Den stärksten Jobzuwachs in den USA bis 2035 hat die häusliche Pflegehilfe, fast 850.000 Stellen, vor allem wegen des Alterns, Lohn rund 36.000 $ (Z. 91–97). | **grün** (Jobs) / **gelb** (Lohn nur sekundär) | https://www.bls.gov/news.release/archives/ecopro_08272026.htm · https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm | BLS (*Suchauszug*): „the aging population is expected to boost demand for a wide variety of healthcare and social services, including home health and personal care services“ · Tabelle: 4,677,100 (2025) → 5,524,400 (2035) · Becker's (BLS-Daten): Median 2025 „$35,800“. |

---

## e) Quellenliste für die YouTube-Beschreibung

Vollständig ca. 3.650 Zeichen, ohne die mit (+) markierten Zeilen ca. 2.400. Wird die Beschreibung zu lang (§12, Grenze ~4.850), zuerst die (+)-Zeilen streichen, dann Klammer-Zusätze kürzen, nie die Links der Kernzahlen. Die Klammer-Hinweise zu IFS und Imas sind die Offenlegung der Interessen (REGELN §1.9a) und sollten bleiben, solange die Zeile drinsteht.

**Parents and AI**
- Institute for Family Studies/YouGov (think tank that campaigns for limits on kids' tech): AI and the Future of K-12 Education: What Do Parents Want? (Nov 2026) https://ifstudies.org/report-brief/artificial-intelligence-and-the-future-of-k-12-education-what-do-parents-want
- Pew Research Center: How Teens Use and View AI (Feb 2026) https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/
- (+) Pew Research Center: What Parents Say About Their Teens' AI Use (Feb 2026) https://www.pewresearch.org/internet/2026/02/24/what-parents-say-about-their-teens-ai-use/

**Having kids, and starting life**
- UNFPA: Young adults want relationships, children and hopeful futures (Jul 2026) https://www.unfpa.org/press/young-adults-want-relationships-children-and-hopeful-futures-financial-and-job-insecurity
- (+) UNFPA: Lives, Choices and Futures (Demographic Futures Survey 2026) https://www.unfpa.org/publications/lives-choices-and-futures-demographic-futures-survey
- WHO: Progress in reducing child deaths slows as 4.9 million children die before age five (Mar 2026) https://www.who.int/news/item/18-03-2026-progress-in-reducing-child-deaths-slows-as-4.9-million-children-die-before-age-five

**AI tutors in school**
- Robinson et al. (Stanford): Access is Not Enough: Human Support Improves Engagement with AI Tutoring (Jun 2026) https://edworkingpapers.com/ai26-1451
- Oreopoulos & Low: One Click Away: AI Tutoring with Khanmigo in a Two-Year School Experiment (NBER, 2026) https://www.nber.org/papers/w35620
- (+) Dang & Do: Making AI Tutoring Work for Poorer Schools (IZA, Oct 2026) https://docs.iza.org/dp19025.pdf

**How children learn**
- UC Berkeley: Alison Gopnik on why AI is no match for a 4-year-old (Berkeley Talks, 2026) https://news.berkeley.edu/2026/04/17/berkeley-talks-alison-gopnik/

**Teens and AI companions**
- Common Sense Media: Talk, Trust, and Trade-Offs: How and Why Teens Use AI Companions (Jul 2025) https://www.commonsensemedia.org/research/talk-trust-and-trade-offs-how-and-why-teens-use-ai-companions

**What becomes scarce**
- (+) Alex Imas (now at Google DeepMind): What will be scarce? (2026) https://aleximas.substack.com/p/what-will-be-scarce

**Daniel Susskind**
- What Should My Children Do? (Penguin Press / Allen Lane, 2026) https://www.penguinrandomhouse.com/books/812111/what-should-my-children-do-by-daniel-susskind/
- Gresham College: Education – And Its Limits (May 2026) https://www.youtube.com/watch?v=Bni42PX7C-Y
- RSA: Are we asking young people the wrong question about their future? (Sep 2026) https://www.youtube.com/watch?v=3smsYIzw-UI
- (+) Richard Murnane: Guiding Kids to Adapt to a Future With AI (Education Next review, Nov 2026) https://www.educationnext.org/guiding-kids-to-adapt-to-a-future-with-ai-book-review-what-should-my-children-do-susskind/
- (+) GOV.UK: National curriculum in England: computing programmes of study (2013) https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study

**Jobs to 2035**
- U.S. Bureau of Labor Statistics: Employment Projections 2025–2035 (Aug 2026) https://www.bls.gov/news.release/archives/ecopro_08272026.htm
- (+) BLS: Home Health and Personal Care Aides (Occupational Outlook Handbook) https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm

**Who decides the direction**
- Sinead Bovell: Are we betting too much on AI? Nobel Laureate Daron Acemoglu (Sep 2026) https://www.youtube.com/watch?v=zAvOo4FrZMI
- (+) Nobel Prize in Economic Sciences 2024, press release https://www.nobelprize.org/prizes/economic-sciences/2024/press-release/
