# 04 · Faktencheck (Stand 2026-10-19, Veröffentlichung ~2026-10-22)

Geprüft: alle VO-Zeilen und beide CLIPs in script.md (Entwurf 1), auch Claims ohne [S#]. Urteil: ✔ ok · ⚠ zugespitzt · ✘ falsch · ? nicht prüfbar.

**Methodik:** Aus dem Container waren idc.com, bls.gov, metr.org, nber.org, gartner.com, digitaleconomy.stanford.edu, ers.usda.gov, govinfo.gov, sec.gov und openai.com nicht erreichbar (403/DNS). Direkt gelesen habe ich nur anthropic.com (EPF). Alles andere stammt aus Websuche: Auszüge der Primärseite (in der Tabelle „P-Auszug“) oder Qualitätspresse („Presse“). Die Zeitwörter habe ich gegen den 22.10.2026 geprüft.

## 1) Ergebnis in 5 Zeilen

- 55 Claims geprüft: **38 ok · 13 zugespitzt · 4 falsch · 0 nicht prüfbar** (9 davon nur über Presse oder Suchauszug belegt, siehe Liste unter 5).
- Falsch sind: „Nobody fired the young ones“ (zu absolut), „In the 1970s, Alaska struck oil“ (Prudhoe Bay wurde 1968 entdeckt), „Every American baby born since 2025 gets … $1,000“ (die 1.000 $ gibt es nur auf Antrag, nur für US-Bürger mit SSN und nur für die Jahrgänge 2025–2028), „In 1933 … Jahoda studied“ (Feldforschung 1931/32, 1933 ist das Erscheinungsjahr).
- Zugespitzt, vor allem in der Wortwahl: Lohnanteil („national income … wages“), Steuer-Vergleich („a company pays“), Altman „paid for“, Alaska-1.200 $ (davon 200 $ Energiehilfe), „this year the idea jumped to AI“ (Altman hatte die Idee schon 2021), Pferdezahl (Pferde *und* Maultiere).
- Die neuen Zahlen stimmen: Stanford 19 % (Update 12.08.2026, nicht mehr 13 %), BLS 52,8 % (revidiert von 52,9 %), PFD 2026 = 1.200 $, IBM 2026.
- Interessenkonflikt: Den Vorschlag, die Babykonten in KI-Firmen investieren zu lassen, macht Anthropic, also selbst eine KI-Firma, die davon profitieren würde. Das Skript nennt das nicht. Bei Huang ist der Konflikt offengelegt, bei Benioff (verkauft Agentforce) nicht.

## 2) MUSS ÄNDERN

| Zeile im Skript (wörtlich) | Problem | Beleg | Ersatzzeile (EN) |
|---|---|---|---|
| "Nobody fired the young ones. They just never got hired." | Zu absolut. Laut Stanford wirkt der Effekt „primarily through reduced hiring … rather than increased separations“, also nicht ausschließlich. „Never got hired“ stimmt für die Einzelnen ebenfalls nicht, gemeint ist ein relativer Rückgang. Außerdem widerspricht der Film sich selbst: Salesforce hat Stellen gestrichen. | Stanford DEL, Update 12.08.2026 (P-Auszug); Presse zum Paper | "Mostly, nobody fired them. They just weren't hired." |
| "In the nineteen seventies, Alaska struck oil." | Prudhoe Bay wurde 1968 entdeckt. In den 70ern folgten Pipeline (1977), Ölgeld und der Fonds (Verfassungsänderung 1976). | APFC-Timeline; Erickson, „The Permanent Fund … at 40“ (P-Auszug) | "In the nineteen seventies, oil money poured into Alaska." |
| "Every American baby born since twenty twenty-five gets an investment account with a thousand dollars." | (a) Die 1.000 $ kommen nicht automatisch, ein Elternteil muss sie wählen (Form 4547). (b) Anspruch haben nur US-Bürger mit SSN. (c) Das Pilotprogramm gilt nur für Geburten 2025–2028, „since 2025“ klingt unbefristet. Das Konto selbst eröffnet Treasury inzwischen automatisch (ab ~01.10.2026). | IRS-Entwurfsregeln (Ascensus, Sovos); InvestmentNews und ParentMap zur Auto-Eröffnung (Presse) | "American babies born from twenty twenty-five to twenty twenty-eight can get a thousand dollars in an investment account." |
| "In nineteen thirty-three, in the Austrian village of Marienthal, the psychologist Marie Jahoda studied what unemployment does to people." | Die Feldforschung lief von Nov. 1931 bis Mai 1932, 1933 erschien das Buch. Das Team umfasste Jahoda, Lazarsfeld, Zeisel und weitere. | agso.uni-graz.at (Marienthal-Archiv); hdgoe.at (P-Auszug) | "In the early nineteen thirties, in the Austrian village of Marienthal, the psychologist Marie Jahoda studied what unemployment does to people." |

(Die Bildschirm-Einblendung „Marienthal 1933 / 2020“ kann als Erscheinungsjahr bleiben.)

## 3) ZUGESPITZT (vertretbar, optional entschärfen)

| Zeile (wörtlich) | Warum zugespitzt | Optionale Ersatzzeile (EN) |
|---|---|---|
| "Klarna replaced hundreds of service jobs with AI, then started hiring people again, because quality dropped." | Klarna sagte 2024, die KI leiste die Arbeit von „700 full-time agents“. Das ist ein Äquivalent und keine Zahl gestrichener Stellen, betroffen waren vor allem ausgelagerte Callcenter. Die Wiedereinstellung im Mai 2025 war ein kleines Remote-Pilotprojekt im „Uber-Modell“. Begründung laut Siemiatkowski: „lower quality“. | "Klarna said its AI did the work of seven hundred agents. Then it started hiring people again, because quality dropped." |
| "…workers aged twenty-two to twenty-five are now about nineteen percent behind where they would have been." | Gemeint ist die *Beschäftigung* (nicht der einzelne Arbeiter), und zwar relativ zu Gleichaltrigen in weniger exponierten Berufen. Die Studie ist deskriptiv und nicht kausal. Die Zahl selbst ist korrekt und aktuell (19 %, die frühere Fassung nannte 13 %). | "…employment for twenty-two to twenty-five year olds is now about nineteen percent below where it should be." |
| "Every salary a company stops paying doesn't disappear. It flows somewhere else: to whoever owns the agent." | Vereinfacht. Ein Teil kann über niedrigere Preise bei Kunden landen oder an die Modell- und Cloud-Anbieter gehen. Als Pointe vertretbar. | "Every salary a company stops paying doesn't just disappear. Much of it flows to whoever owns the agent." |
| "In America, the share of national income paid out as wages has just fallen to its lowest level since records began in nineteen forty-seven." | BLS misst den Anteil der *Arbeitnehmerentgelte* (Löhne plus Nebenleistungen) am Output des *Nonfarm Business Sector*, nicht am Volkseinkommen. 52,8 % in Q2 2026 (erst 52,9 %, am 03.09. revidiert), tiefster Wert seit 1947 ✔. Nach BEA-Abgrenzung liegt der Wert anders (~51 % des BIP). | "In America, workers' share of what businesses produce has just hit its lowest level since records began in nineteen forty-seven." |
| "In nineteen hundred, about four in ten Americans worked on farms." | 41 % der *Erwerbstätigen* (ERS EIB-3). Der Zensus 1900 nennt nach Berufsabgrenzung ~35,6 %. „Americans“ statt „American workers“ ist ungenau. | "In nineteen hundred, about four in ten American workers worked on farms." |
| "And beside them worked more than twenty million horses." | 1900 gab es auf Farmen ~21–22 Mio. Arbeitstiere, *Pferde und Maultiere zusammen* (ERS: „22 million work animals“). Pferde allein waren es knapp unter 20 Mio. auf Farmen, plus Stadtpferde. Der Höchststand lag um 1920 bei ~25 Mio. | "And beside them worked more than twenty million horses and mules." |
| "In America, a company pays roughly thirty percent in taxes on a worker, and around five percent on the software and machines that could replace one." | Acemoglu/Manera/Restrepo: Arbeit wird effektiv mit 25,5–33,5 % belastet, aber inkl. Lohn- und Einkommensteuer des Arbeitnehmers, nicht nur der Firma. Software und Ausrüstung ~5 % nach 2017 (MIT-Brief: Arbeit ~25 %). Das Papier ist von 2020. Weil OBBBA 2025 die 100-%-Sofortabschreibung wieder eingeführt hat, bleibt die Richtung gültig. | "In America, work is taxed at roughly twenty-five to thirty percent. Software and machines that could replace it, around five." |
| "In Switzerland, about two in three teenagers learn a trade inside a real company." | Zwei Drittel wählen die Berufsbildung (SBFI/OECD). Die meisten lernen dual im Betrieb, ein kleiner Teil aber in einer Vollzeitschule. | "In Switzerland, about two in three teenagers learn a trade, most of them inside a real company." |
| "And even there, by early twenty twenty-six, almost all of their revenue went straight to the AI companies they ran on." | Wix (Q2 2026): Base44 ging mit „near-zero non-GAAP gross margin“ ins Jahr 2026. Die Kosten umfassen vor allem, aber nicht nur, Modellkosten. Seit H2 2026 erwartet Wix dank eigenem Modell ~60 % Marge. Das fehlt im Skript. | "And at the start of twenty twenty-six, almost all of their revenue went to paying for the AI they ran on." |
| "Since nineteen eighty-two, every resident gets a check from that fund. This year, twelve hundred dollars." | 2026: 1.000 $ PFD + 200 $ „energy relief“ = 1.200 $ ✔ (Auszahlung ab 01.10. und 22.10.2026). Die 200 $ sind eine Energiehilfe, keine Fondsdividende. „Every resident“ meint alle berechtigten Einwohner. Die erste Dividende 1982 kam aus Ölüberschüssen. | "Since nineteen eighty-two, almost every resident gets a yearly payment. This year, twelve hundred dollars." |
| "And this year, the idea jumped to AI." | Altman schlug schon 2021 („Moore's Law for Everything“) einen American Equity Fund vor. 2026 kamen die ersten konkreten Vorschläge von Firma und Kongress. | "And this year, the idea reached Washington's AI debate." |
| "Sam Altman paid for one of the largest cash experiments ever." | Altman war Initiator und einer der Geldgeber (~14 Mio. $). Dorsey gab laut Bericht 15 Mio. $, Sijbrandij 6,5 Mio. $. „Largest“ gilt für die USA, GiveDirectly in Kenia ist größer. | "Sam Altman helped fund one of the largest cash experiments in America." |
| "None of them is magic. Each one already works somewhere." | Für Schicht 1 (IBM, Schweiz) und Schicht 2 (Alaska) stimmt das. Der Thermostat aus Schicht 3 ist nur ein Gesetzentwurf, das sagt das Skript später selbst. | "None of them is magic. Most of them already work somewhere." |
| "Anthropic has suggested letting it hold a stake in AI companies too." | Inhaltlich ✔ (EPF, direkt gelesen: „Currently, these accounts can hold only index funds—not a stake in AI companies.“). **Der Interessenkonflikt fehlt:** Anthropic ist selbst eine KI-Firma. Falls der Kanal mit Claude produziert, gehört das ohnehin offengelegt. | "Anthropic, itself an AI company, has suggested letting it hold a stake in AI companies too." |

Kleinere Hinweise ohne Änderungszwang: Benioffs Salesforce verkauft selbst KI-Agenten (Agentforce) und spricht laut Salesforce von „rebalance“ mit Umsetzungen. Bei „Many economists say we're the farmers. [S6]“ belegt S6 (Yale Budget Lab) nur „no disruption“, nicht die Bauern-These, deshalb die Quelle neu zuordnen (z. B. Autor oder Acemoglu). IBM: „tripling“ gilt nur für US-Einstiegsstellen. Sanders: Die Abgabe betrifft KI-Firmen mit >200 Mio. $ KI-Umsatz, nicht nur die größten.

## 4) Vollständige Claim-Tabelle

| # | Claim | Quelle geprüft | Urteil | Notiz |
|---|---|---|---|---|
| 1 | IDC: >1 Mrd. Agenten im Einsatz bis 2029 | IDC-Blog 10.12.2025 (P-Auszug), Presse | ✔ | „actively deployed“, ~40× ggü. 2025. Später nennt IDC 1,15 Mrd. Nicht verwechseln mit den von Microsoft gesponserten „1,3 Mrd. bis 2028“. |
| 2 | Agenten = kleine Programme, die Aufgaben selbst erledigen | IDC-Definition (P-Auszug) | ✔ | Zählt auch No-Code-Bots. |
| 3 | CLIP Huang „In a lot of ways, the IT department … in the future.“ | Fortune 09.01.2025 (Presse), Transkript laut sources.md | ✔ | Wortlaut inkl. „In a lot of ways“ bei Fortune. Timecode im Browser prüfen. |
| 4 | Huang = Nvidia-Chef, Nvidia verkauft die Chips | allgemein | ✔ | Konflikt offengelegt. |
| 5 | METR misst die Aufgabenlänge, die KI allein schafft | METR-Seite (P-Auszug), Wikipedia | ✔ | Fast nur Software- und Forschungsaufgaben. |
| 6 | Verdopplung alle paar Monate | METR TH 1.1 (P-Auszug), Presse | ✔ | ~4–7 Monate, je nach Zeitraum. |
| 7 | Beste Systeme: Arbeit für einen vollen Expertentag | METR, Frontier Risk Report 19.05.2026 (P-Auszug) | ✔ | ≥16 h bei 50 %, also eher untertrieben. Oberhalb von 16 h misst die Suite unzuverlässig, die Seite wird seit 08.09.2026 nicht mehr gepflegt. |
| 8 | Scheitern etwa jedes zweite Mal | METR-Definition 50 % | ✔ | Bei 80 % Zuverlässigkeit nur ~3 h. |
| 9 | Vor ein paar Jahren: Minuten | METR (GPT-4 2023 ~5–10 min) | ✔ | |
| 10 | Gartner: >40 % der Agentenprojekte bis Ende 2027 eingestellt | Gartner-PM 25.06.2025 (P-Auszug), Presse | ✔ | Prognose. |
| 11 | Klarna ersetzte Hunderte Servicejobs | Klarna-PM 2024, Presse | ⚠ | Gemeint ist das Arbeitsäquivalent von 700 FTE, siehe Tabelle 3. |
| 12 | Klarna stellt wieder Menschen ein, weil die Qualität sank | Bloomberg via Entrepreneur u. a. (Presse) | ✔ | „lower quality“, kleines Pilotprojekt. |
| 13 | Gesamtwirtschaft: keine Welle von Jobverlusten | Yale Budget Lab 2025/Feb. 2026 (P-Auszug), Stanford 2026 | ✔ | |
| 14 | Brynjolfsson-Team, Lohndaten von Millionen US-Beschäftigten | Stanford DEL (P-Auszug) | ✔ | ADP-Payroll. Mitautoren Chandar und Chen. |
| 15 | 22–25-Jährige ~19 % hinter dem Trend | Stanford DEL 12.08.2026 (P-Auszug) | ⚠ | Beschäftigung relativ zu weniger exponierten Gleichaltrigen. 19 % ist aktuell. |
| 16 | Ältere im selben Job: stabil | Stanford DEL | ✔ | „no comparable gap“. |
| 17 | „Nobody fired the young ones … never got hired“ | Stanford DEL | ✘ | „primarily“ über weniger Einstellungen, siehe Tabelle 2. |
| 18 | >5.000 Support-Agenten, Neulinge ~1/3 produktiver | NBER w31161 / QJE 2025 (P-Auszug) | ✔ | 5.179 (WP) bzw. 5.172 (QJE). +34 % gilt für „novice and low-skilled“. |
| 19 | CLIP Benioff „I've reduced it from 9,000 heads to about 5,000, because I need less heads.“ | mehrere Medien (Presse) | ✔ | Wortgleich zitiert. Episode 29.08.2025. |
| 20 | Benioff = Salesforce-Chef, eigenes Support-Team | Presse | ✔ | Salesforce nennt es „rebalance“. |
| 21 | Eingesparte Gehälter fließen zum Eigentümer des Agenten | ökonomische These | ⚠ | Vereinfachung. |
| 22 | Lohnanteil auf Tiefstwert seit 1947 | BLS TED (P-Auszug), BLS-Release 03.09.2026 | ⚠ | Zahl ✔, Begriff falsch („national income“, „wages“). Q3-Daten kommen erst nach der Veröffentlichung. |
| 23 | KI hat den Rückgang nicht begonnen | BLS-Reihe (Rückgang seit ~2000), ILO | ✔ | |
| 24 | 1900: ~4 von 10 Amerikanern auf Farmen | ERS EIB-3 laut Strategy+Business (Presse) | ⚠ | Bezugsgröße sind Erwerbstätige, der Zensus nennt 35,6 %. |
| 25 | >20 Mio. Pferde | ERS („22 million work animals“), USDA-Zensus | ⚠ | Pferde + Maultiere. |
| 26 | Heute <2 von 100 Amerikanern in der Landwirtschaft | ERS 1,9 % (2000), heute ~1,2–1,4 % | ✔ | |
| 27 | Pferde binnen 60 Jahren größtenteils verschwunden | USDA (1958 <3,4 Mio. Pferde + Maultiere) | ✔ | |
| 28 | Viele Ökonomen: Wir sind die Bauern | allgemein | ✔ | S6 ist die falsche Quelle dafür. |
| 29 | Firma zahlt ~30 % auf Arbeit, ~5 % auf Software/Maschinen | NBER w27052 / MIT-Brief (P-Auszug) | ⚠ | Nicht nur die Firma zahlt. Papier von 2020. |
| 30 | IBM verdreifacht dieses Jahr die Einstiegseinstellungen, Juniors prüfen KI, mehr Kundenarbeit | Fortune 13.02.2026, Computing, PYMNTS (Presse nach Bloomberg) | ✔ | Nur USA, keine absoluten Zahlen. „this year“ = 2026 ✔. |
| 31 | Schweiz: 2 von 3 Teenagern lernen einen Beruf im Betrieb | SBFI-Seite, OECD (P-Auszug) | ⚠ | Ein Teil lernt schulisch. |
| 32 | Kleines Team in Israel, mit KI gebaut, für 80 Mio. $ verkauft | Globes, TechCrunch (Presse) | ✔ | Solo-Gründer, 6–8 Angestellte. 80 Mio. $ initial, dazu Earn-out. |
| 33 | Anfang 2026 ging fast der ganze Umsatz an die KI-Anbieter | Wix Q2 2026 (Presse/Call) | ⚠ | Near-zero gross margin; seit H2 ~60 % erwartet. |
| 34 | In den 1970ern stieß Alaska auf Öl | APFC, Presse | ✘ | 1968. |
| 35 | Hammond: Das Öl gehört allen, alle bekommen einen Anteil | APFC (P-Auszug) | ✔ | Paraphrase. |
| 36 | Seit 1982 jährlich ein Scheck für jeden Einwohner | DOR, APFC | ✔ | Für berechtigte Einwohner. Der erste Scheck kam aus Überschüssen. |
| 37 | 2026: 1.200 $ | Alaska Beacon, Alaska's News Source (Presse) | ⚠ | 1.000 $ + 200 $ Energiehilfe. |
| 38 | Weiter gearbeitet, Armut gesunken | Jones & Marinescu (P-Auszug); ISER/Berman | ✔ | Teilzeit +17 %. |
| 39 | 2026 sprang die Idee auf KI über | TechCrunch, Roll Call | ⚠ | Altman schon 2021. |
| 40 | OpenAI schlägt einen Public Wealth Fund mit Anteil für jeden Bürger vor | The Decoder, Gizmodo (Presse) | ✔ | „exploratory“, Finanzierung offen. |
| 41 | Sanders: Hälfte der großen KI-Firmen in einen Bürgerfonds | Roll Call 18.06.2026, AP (Presse) | ✔ | S.4825, einmalige 50-%-Aktienabgabe, Schwelle 200 Mio. $ Umsatz. |
| 42 | Jedes US-Baby seit 2025 bekommt ein Konto mit 1.000 $ | IRS-Regeln, Presse | ✘ | Siehe Tabelle 2. |
| 43 | Konto darf nur Indexfonds halten; Anthropic will KI-Beteiligungen zulassen | anthropic.com/…/epf (direkt gelesen) | ✔ | Interessenkonflikt nennen (Tabelle 3). |
| 44 | Seit 2016 immer wieder für Haushaltslöcher gekürzt | Commonwealth North 2026, Presse | ✔ | Walker-Veto 2016 (1.022 $). |
| 45 | Altman bezahlte eines der größten Cash-Experimente | Quartz, Daily Maverick (Presse) | ⚠ | Mitfinanziert. |
| 46 | 1.000 $/Monat, 3 Jahre, ohne Bedingungen | NBER w32719 (P-Auszug) | ✔ | |
| 47 | 1–2 h/Woche weniger Arbeit, vor allem mehr Freizeit | NBER w32719, QJE 2026 (P-Auszug) | ✔ | Bewusst keine Prozentpunkte genannt, das ist gut: die Werte änderten sich zwischen den Fassungen (2,0 → 4,2 pp). |
| 48 | Stress sank, im 2. Jahr verblasst | Miller et al. w32711, J-PAL (P-Auszug) | ✔ | „only observed in the first year“. |
| 49 | 1933 untersuchte Jahoda Marienthal | Uni Graz Archiv | ✘ | Feldforschung 1931/32. |
| 50 | Zeitgefühl verloren, Kontakte aufgegeben | Jahoda et al. | ✔ | |
| 51 | 2020: Jobgarantie für Langzeitarbeitslose im selben Ort | Kasy & Lehner, INET (P-Auszug) | ✔ | Gramatneusiedl, freiwillig, >12 Monate (Registry: 9 Monate). |
| 52 | Struktur, Kontakte, Anerkennung zurück; Kosten ~ wie Arbeitslosigkeit | INET Policy Briefing (P-Auszug) | ✔ | 29.841 € vs. ~30.000 €, das ist eine Prognose. |
| 53 | Gesetzentwurf: KI-Steuer steigt mit Arbeitslosigkeit, finanziert Jobs in Pflege und Wohnungsbau, nur Vorschlag | Casar-PM, CBS Austin, Cybernews (Presse) | ✔ | H.R. 10044 vom 06.08.2026, im Ausschuss. |
| 54 | 2023 erkämpften die WGA-Autoren eine Regel: KI schreibt keine Drehbücher | WGA-Summary via Presse | ✔ | „cannot write or rewrite literary material“, nach 148 Tagen Streik. |
| 55 | Jede Schicht funktioniert schon irgendwo | Gesamtbild | ⚠ | Der Thermostat ist nur ein Entwurf. |

Reine Szenario-Teile (Kap. 6–7, Schwester 2032) und Wertungen („a very good machine for continuing it“, „We can do both“) sind keine Tatsachenbehauptungen und nicht gezählt.

## 5) Browser-Stichproben (Primärquelle war im Container nicht erreichbar)

1. **IDC-Blog** (idc.com/resource-center/blog/agent-adoption-…): Wortlaut „more than 1 billion actively deployed agents by 2029“.
2. **CLIP-Timecodes:** Huang (k82RwXqZHY8, 00:40:13–00:40:23) inkl. „In a lot of ways“; Benioff (0RkNkGihrvc, 00:01:52–00:02:00) anhören.
3. **METR time-horizons** (metr.org/time-horizons): aktueller Stand und Hinweis „nicht mehr gepflegt“. Prüfen, ob „full day“ und „doubled every few months“ noch passen.
4. **BLS TED** (bls.gov/opub/ted/2026/labor-share-…): 52,8 %, Sektor-Definition; prüfen, dass vor dem 22.10. keine Q3-Zahl erscheint.
5. **Stanford DEL** canariesaug26: genaue Formulierung zu „19 %“ und „reduced hiring“.
6. **ERS EIB-3 PDF:** 41 % / 1,9 % und „22 million work animals“; HSUS-Tabelle Da983–987 für Pferde 1900.
7. **NBER w27052:** 25,5–33,5 % vs. ~5 % (Tabelle zur effektiven Steuerlast).
8. **Wix Q2-2026-6-K** (sec.gov): Satz zur „near-zero non-GAAP gross margin“ von Base44.
9. **Trump Accounts:** IRS/Treasury-Seite (trumpaccounts.gov / IRS Notice), ob die 1.000 $ inzwischen automatisch fließen. Bei Auto-Auszahlung würde die Ersatzzeile vereinfacht.
10. **S.4825 und H.R. 10044** (congress.gov): Schwelle, Satzformel, Verwendung (Pflege/Wohnen).
11. **OpenAI-Papier** „Industrial Policy for the Intelligence Age“ (06.04.2026): „every citizen a stake“.
12. **OpenResearch QJE 2026 / w32711:** Stunden 1–2 h, Stresseffekt nur Jahr 1; Altmans Finanzierungsanteil (openresearchlab.org).
13. **Alaska DOR 2026:** 1.000 $ + 200 $, Auszahlungstermine.
14. **WGA 2023-MBA-Summary:** Wortlaut zur KI-Regel; prüfen, ob die Neuverhandlung 2026 (Vertragsende 01.05.2026) die Regel geändert hat.
