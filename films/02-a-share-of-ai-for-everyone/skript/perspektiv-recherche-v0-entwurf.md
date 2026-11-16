# Film 5 · Perspektiv-Recherche: Wie wird ein hohes Einkommen für alle möglich?

Stand 2026-10-19. Film 5 beantwortet die Schlussfrage von Film 4: *"So how do we get from here to there?"*
Ziel: überraschende, wahre und sofort verständliche Ideen finden, aus denen der **eine Leitgedanke** werden kann. Dazu kommt der **Weg in Etappen** (Ergänzung Jakob): was jetzt startet, was mit der Automatisierung von selbst mitwächst und wie der globale Endzustand aussieht.

**Vorbehalte zur Methode**
- Viele Primärseiten waren aus der Cloud gesperrt (u. a. samaltman.com, basicincome.org, futureoflife.org, ssa.gov, ushistory.org, news.berkeley.edu, gutenberg/wikisource). Lesen konnte ich direkt nur anthropic.com. Alles andere stammt aus Suchauszügen der Primärquelle oder aus Qualitätspresse. Vor jeder Verwendung im Film muss es durch den Faktencheck.
- **Eigene Rechnungen** sind mit *[eigene Rechnung]* markiert. Sie sind Größenordnungen, keine Prognosen.
- **Abgleich mit früheren Filmen:** Ich habe mit grep in den Skripten und VO-Dateien von Folge 1, Flagship, Film 2, 3 und 4 sowie in `film-04-text-v1.md` und `faktenzettel-film-04.md` gesucht. Jeder Befund trägt eine Marke: **NEU** · **BEREITS VERWENDET (Film X)** · **TEILWEISE** (nur Entwurf/Faktenzettel oder nur angrenzend).

---

## 0 · Die Kurzfassung (die 8 stärksten Befunde)

1. **Gleichmäßig verteilt, wäre die Weltwirtschaft schon heute ungefähr ein „Hocheinkommen“ für jeden Menschen.** Welt-BIP 2026 ≈ 126 Bio. $ (IWF), das sind ≈ 15.000 $ pro Kopf. Die Weltbank-Schwelle für „high income“ liegt bei 14.375 $. Das Problem ist also nicht die Größe des Kuchens, sondern dass man ihn heute nicht teilen kann, ohne dass es wehtut. Wächst er durch KI um das Zehnfache, kostet ein Hocheinkommen für alle ≈ 10 % davon, weniger als reiche Länder heute für ihre Sozialsysteme ausgeben. *[eigene Rechnung]* **NEU**
2. **Extreme Armut weltweit zu beenden kostet ≈ 318 Mrd. $ im Jahr, ≈ 0,25 % des Welt-BIP.** Das ist weniger als die Hälfte dessen, was vier Tech-Konzerne 2026 für KI-Infrastruktur ausgeben (≈ 725 Mrd. $). **NEU** (Armut allgemein in Film 4 erwähnt)
3. **Der günstigste Moment, das Teilen zu versprechen, ist bevor man reich ist.** Die Windfall Clause (GovAI, 2020): Firmen verpflichten sich jetzt, Gewinne über 1 % des Welt-BIP abzugeben. Weil das heute unwahrscheinlich ist, kostet das Versprechen fast nichts. **NEU**
4. **Eine gemeinnützige Stiftung besitzt bereits ein Viertel von OpenAI.** Die OpenAI Foundation hält 26 % (bei Gründung ≈ 130 Mrd. $). Eigentum an Superintelligenz in öffentlicher Hand ist also keine Utopie, es gibt das schon in klein. **NEU**
5. **Geld kann man verstecken, ein Gigawatt-Rechenzentrum nicht.** Rechenleistung ist laut GovAI/Oxford „detectable, excludable, quantifiable“ und hat eine extrem konzentrierte Lieferkette. Damit wäre der Reichtum der KI die erste große Vermögensquelle, die nicht in Steueroasen fliehen kann. 136 von 140 Ländern haben sich 2021 schon einmal auf eine globale Mindeststeuer geeinigt. **NEU**
6. **Thomas Paine forderte 1797 für jeden Menschen ein Startkapital, „not charity but a right“,** weil die Erde „the common property of the human race“ war. Heute ist das gemeinsame Erbe alles, was Menschen je geschrieben haben, und die KI ist darauf trainiert. Die erste Rechnung dafür kam 2026: 1,5 Mrd. $ an Autoren, ≈ 3.000 $ pro Buch. **NEU**
7. **Die Auszahlungs-Rohre für die ganze Welt gibt es schon.** 79 % aller Erwachsenen haben ein Konto (Findex 2025). Togo hat 2020 mit KI aus Satelliten- und Handydaten die Ärmsten gefunden und ihnen Geld aufs Handy geschickt. In Kenia erzeugte jeder überwiesene Dollar ≈ 2,5 $ lokale Wirtschaftsleistung, ohne nennenswerte Inflation. **NEU**
8. **Die ernsthaften Pläne von 2025/26 wachsen automatisch mit.** Korineks „seed UBI“ (klein, wächst mit der Verdrängung), OpenAIs „auto-triggering safety nets“ und Anthropics Stufenplan (5 % / 10 % / beispiellose Arbeitslosigkeit) sehen alle Mechanismen vor, die von selbst hochfahren, ohne dass jedes Jahr neu gestritten werden muss. **TEILWEISE**: Die Thermostat-Metapher und die US-KI-Steuer, die mit der Arbeitslosigkeit steigt, sind **BEREITS VERWENDET (Film 4, VO Z. 134–135)**. Neu sind Korineks Seed UBI, die Stufen und die globale Ausweitung, die Metapher selbst ist verbraucht.

---

## 1 · Die Mathematik

### 1.1 Was kostet ein hohes Einkommen für 8,3 Milliarden Menschen?
| Größe | Wert | Quelle |
|---|---|---|
| Welt-BIP 2026 (nominal) | ≈ 126,3 Bio. $ (2025: 113,8 Bio. $) | IWF WEO April 2026, über Sekundärquellen: [financialafrik](https://www.financialafrik.com/en/?p=489343), [indiamacroindicators](https://indiamacroindicators.co.in/resources/blogs/world-gdp-breakdown-2026-by-country-region-economic-group). Statista nennt 123,6 Bio. $ (WEO Okt. 2025). |
| Weltbevölkerung | ≈ 8,2–8,3 Mrd. | UN WPP (nicht neu geprüft) |
| BIP pro Kopf, Welt | ≈ 15.200 $ | *[eigene Rechnung]* |
| Weltbank-Schwelle „high income“ | > 14.375 $ BNE pro Kopf (FY2027, ab 1.7.2026); vorher 13.935 $ | [Wikipedia: World Bank high-income economy](https://en.wikipedia.org/wiki/World_Bank_high-income_economy), [The Star, 01.08.2026](https://www.thestar.com.my/business/insight/2026/08/01/the-long-climb-to-high-income) |
| Hocheinkommen für alle (14.375 $ × 8,3 Mrd.) | ≈ 119 Bio. $ ≈ **94 % des Welt-BIP 2026** | *[eigene Rechnung]* |

**Was daraus folgt:**
- **Heute unmöglich, morgen bezahlbar.** Bei 94 % des BIP bliebe nichts für Investitionen, Staat oder Gesundheit übrig. Der Anteil schrumpft aber mit dem Wachstum: Bei einer 10× größeren Weltwirtschaft kostet derselbe Betrag ≈ 9–10 % des BIP. Bei 20 % Wachstum pro Jahr sind das ≈ 6,2× in 10 Jahren (≈ 15 % des BIP), bei 30 % pro Jahr ≈ 13,8× (≈ 7 %). *[eigene Rechnung]*
- **Zum Vergleich:** Die OECD-Länder geben im Schnitt rund ein Fünftel ihres BIP für öffentliche Sozialleistungen aus (OECD SOCX, ≈ 21 %; nicht neu geprüft). Ein Hocheinkommen für die ganze Welt bräuchte in einer 10×-Welt also **weniger als die Hälfte dessen, was Europa heute schon umverteilt**.
- **Der überraschende Satz:** „Divided evenly, today's world economy would already put every person on Earth at roughly the World Bank's line for 'high income'.“ (Vorbehalt: BIP ist nicht verfügbares Einkommen, und die Weltbank misst BNE nach Atlas-Methode. Als Gedankenexperiment taugt der Satz, als Aussage über Kaufkraft nicht.)
- Reliability: Die Zahlen sind solide (IWF, Weltbank), die Ableitung ist eine eigene Überschlagsrechnung. **NEU**

### 1.2 Wie schnell könnte der Kuchen wachsen? (Wachstumsszenarien)
- **Epoch AI, GATE-Modell (2025):** „Even when AIs have only automated 30% of all economically useful tasks, economic growth rates may exceed 20%.“ Für „explosives“ Wachstum (> 30 %/Jahr) müssten ≈ 50–70 % der Aufgaben automatisiert sein. Das sind ausdrücklich Modell-Ergebnisse, keine Prognosen, und das Modell ist nicht empirisch kalibriert. [epoch.ai/blog/announcing-gate](https://epoch.ai/blog/announcing-gate), [AI and explosive growth redux](https://epoch.ai/gradient-updates/ai-and-explosive-growth-redux) (2025). **TEILWEISE** (Epoch kommt in Film 2 vor, aber mit Trainingsdaten, nicht mit Wachstum)
- **Trammell & Korinek, „Economic growth under transformative AI“** (NBER w31815, 2023, rev. Sept. 2025, erscheint in der Annual Review of Economics): Wenn KI Arbeit ersetzt, kann sich Kapital „selbst vermehren“. Das beschleunigt das Wachstum und **senkt den Lohnanteil**. Genau deshalb reicht „mehr Jobs“ als Verteilungsweg nicht mehr aus. [NBER PDF](https://www.nber.org/system/files/working_papers/w31815/revisions/w31815.rev1.pdf). **NEU**
- **Nayebi (CMU, arXiv 2505.18687, 2025):** Selbst ohne neue Jobs müsste KI nur die **5–7-fache** heutige Automatisierungsproduktivität erreichen, um aus Kapitalerträgen eine Grundsicherung von 11 % des BIP zu finanzieren. Hebt man den öffentlichen Anteil an KI-Kapitalerträgen von 15 % auf ≈ 33 %, **halbiert** sich die nötige Schwelle. [arxiv.org/abs/2505.18687v3](https://arxiv.org/abs/2505.18687v3). Reliability: Preprint eines einzelnen Autors, US-Parameter. **NEU**

### 1.3 Wie klein der nötige Anteil heute schon ist
| Vergleich | Zahl | Quelle |
|---|---|---|
| Extreme Armut beenden (≈ auf 1 % senken), pro Jahr | ≈ 318 Mrd. $ ≈ 0,3 % des Welt-BIP; mit bevorzugter Zielgenauigkeit in 23 Ländern ≈ 170 Mrd. $ | Blumenstock u. a., UC Berkeley, Feb. 2026: [Columbia Business School](https://business.columbia.edu/insights/ending-extreme-poverty-may-cost-less-you-think), [CEGA](https://cega.berkeley.edu/article/https-news-berkeley-edu-2026-02-03-a-bold-calculation-what-would-it-cost-to-end-extreme-poverty-worldwide/), [Vox/CEGA](https://cega.berkeley.edu/article/https-www-vox-com-future-perfect-472422-the-low-low-cost-of-ending-extreme-poverty/) |
| Ältere Schätzung (Longview/GiveDirectly) | ≈ 258–259 Mrd. $ für ein Jahr | [Longview Factsheet 2023](https://www.longview.org/wp-content/uploads/2023/04/Longview-TED-Talk-_-Factsheet-v.02.pdf) |
| Menschen in extremer Armut (3 $/Tag, PPP 2021) | ≈ 808 Mio. (9,9 %) für 2025 | Weltbank, Juni 2025, via [Eastleigh Voice](https://eastleighvoice.co.ke/extreme%20poverty-poverty%20line/163334/world-bank-raises-poverty-line-to-3-a-day-pushing-millions-into-extreme-poverty-category), [OWID](https://ourworldindata.org/) |
| KI-Investitionen von Microsoft, Alphabet, Amazon, Meta 2026 | ≈ 725 Mrd. $ (FT-Zählung nach Q1) | [Tom's Hardware](https://tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion), [Sherwood](https://sherwood.news/tech/alphabet-amazon-microsoft-meta-plan-more-than-700-billion-on-capex-this-year/) |
| 2 % Mindeststeuer auf ≈ 3.000 Milliardäre | 200–250 Mrd. $/Jahr | Zucman für die G20, 2024: [g20.org](https://www.g20.org/en/news/at-the-g20-brasils-proposal-to-tax-the-super-rich-may-raise-up-to-250-billion-dollars-a-year) |

**Überraschung:** Ein Jahr KI-Investitionen von vier Firmen entspricht ≈ 2,3 Jahren „keine extreme Armut mehr auf der Erde“ *[eigene Rechnung]*. Und eine 2-%-Steuer auf 3.000 Menschen brächte ungefähr so viel, wie das Ende der extremen Armut kostet. Risiko: Investitionen sind kein Konsum, der Vergleich kann moralisierend und KI-feindlich klingen. Als Beleg taugt er, als Leitgedanke nicht. **NEU**

### 1.4 Die Kosten fallen (die zweite Hälfte der Rechnung)
- **Der Preis für Intelligenz fällt jedes Jahr um ein Vielfaches.** Epoch AI: GPT-4-Niveau bei Wissenschaftsfragen wurde ≈ 40× pro Jahr billiger, über alle Schwellen gerechnet im Median ≈ 50× (Spanne 9–900×). Eine vorsichtigere Arbeit (arXiv 2511.23455) kommt auf 5–10× pro Jahr. [epoch.ai/data-insights/llm-inference-price-trends](https://epoch.ai/data-insights/llm-inference-price-trends). **NEU** (Film 2 nutzt Solarpreise, nicht Inferenzpreise)
- **Altman, „The Gentle Singularity“ (Juni 2025):** „Intelligence too cheap to meter is well within grasp.“ Achtung: Die Formel „too cheap to meter“ stammt von 1954 aus der Atomkraft und hat sich dort **nicht** erfüllt (Altman sagt das 2026 selbst). Das ist ein ehrlicher Twist für den Film. [Maginative](https://www.maginative.com/article/sam-altman-says-the-singularity-is-here-and-its-disappointingly-boring/). **NEU**
- **Musk (X, 17.04.2026):** „Universal HIGH INCOME via checks issued by the Federal government is the best way to deal with unemployment caused by AI.“ Begründung: KI erzeuge so viele Güter, dass keine Inflation entstehe. Kein Konzept, keine Zahlen. [Fox Business](https://www.foxbusiness.com/fox-news-tech/elon-musk-backs-universal-high-income-combat-ai-job-losses), [Yahoo Finance](https://finance.yahoo.com/economy/policy/articles/elon-musk-says-government-checks-163114976.html). **TEILWEISE** (andere Musk-Zitate stehen im Film-4-Entwurf und im Faktenzettel)
- **Hassabis (CNN, Juni 2025, nur über Benzinga):** KI-Reichtum könnte ein „universal high income“ erfordern. In TIME (April 2025): „radical abundance“, die „shared fairly“ werden müsse. Den genauen CNN-Wortlaut habe ich nicht gefunden. **TEILWEISE** („radical abundance“ und UHI „good and necessary“ stehen im Film-4-Faktenzettel/-Entwurf)
- **Konzept „Universal Basic Services“** (UCL Institute for Global Prosperity, 2017): Statt nur Geld zu verteilen, werden Grundgüter (Wohnen, Verkehr, Information, heute auch KI-Zugang) so billig, dass sie fast kostenlos sind. Mit KI-Preisen, die jedes Jahr um ein Vielfaches fallen, wird **„Universal Basic Intelligence“** denkbar: Der Zugang selbst ist dann die Grundversorgung. (Nicht neu geprüft.) **NEU**
- **Warnung:** Das UAE-Gerücht „ChatGPT Plus für alle Einwohner“ (Mai 2025) war laut Gulf News, Heise und Benzinga **nicht bestätigt bzw. ein Hoax**. Nicht verwenden. [Heise](https://heise.de/-10419195)

---

## 2 · Globale Mechanismen

### 2.1 Windfall Clause (GovAI, 2020) **NEU**
- **Claim:** KI-Firmen verpflichten sich heute rechtlich bindend, Gewinne oberhalb einer Schwelle zu spenden, die als Anteil am Welt-BIP definiert ist. Beispielstaffel: 1 % des Grenzgewinns ab 0,1 % des Welt-BIP, bis zu 50 % ab 10 % des Welt-BIP.
- **Überraschend:** Das Versprechen ist **heute billig, weil der Ernstfall unwahrscheinlich ist**. Originalton: „the expected cost to any given firm should be low because windfall profits are so improbable.“ Das Papier vergleicht das mit Aktienoptionen. Teilen wird also vor dem Rennen beschlossen, nicht danach.
- **Gegenargument:** Jan Leike (2020): Im Ernstfall lohnt es sich, Milliarden für Anwälte auszugeben, um der Klausel zu entkommen. Bislang hat keine Firma unterschrieben.
- **Quellen:** O'Keefe u. a., [arXiv 1912.11595](https://arxiv.org/pdf/1912.11595) (2020); [arXiv 2108.09404](https://arxiv.org/pdf/2108.09404); [Leike-Kritik](https://forum.effectivealtruism.org/posts/wcFjCQhSsHar5Hehr/jan-leike-on-the-windfall-clause); Nachfolger: FLI „Windfall Trust“ (Fahrplan-Phase, Seite nicht erreichbar). Reliability: hoch (Primärpapier).

### 2.2 Altman: von „American Equity Fund“ (2021) zu „Universal Basic Compute“ **NEU** (die OpenAI-5-%-Idee ist Film 4)
- **2021, „Moore's Law for Everything“:** Ein Fonds erhält jährlich **2,5 % des Marktwerts großer Firmen, bezahlt in Aktien**, und 2,5 % des Werts von privatem Land. Prognose: ≈ 13.500 $ pro US-Erwachsenem und Jahr in ≈ 10 Jahren, „could be much higher if AI accelerates growth“. [CNBC, 30.03.2021](https://www.cnbc.com/2021/03/30/openai-ceo-sam-altman-says-ai-could-pay-for-ubi-experts-disagree.html). Primärtext gesperrt (moores.samaltman.com).
- **Der eigentlich clevere Teil:** Bezahlung **in Aktien** heißt, dass der Fonds automatisch einen wachsenden Anteil an den Firmen besitzt, die wachsen. Das ist ein eingebauter Thermostat.
- **Universal Basic Compute (All-In-Podcast, 2024):** „Everybody gets like a slice of GPT-7's compute“, den man nutzen, weiterverkaufen oder spenden kann. Ohne Details. [Business Insider via basicincomecanada](https://basicincomecanada.org/openais-sam-altman-has-a-new-idea-for-a-universal-basic-income/).
- **2026:** Altman zur Atlantic (laut BI, Sekundärquelle): „I no longer believe in universal basic income as much as I once did“. Er bevorzuge kollektives Eigentum „in compute or in equities“. Reliability: mittel, Sekundärquelle.

### 2.3 OpenAI „Industrial Policy for the Intelligence Age“ (06.04.2026) **TEILWEISE** (Public Wealth Fund ist Film 4)
- Neu gegenüber Film 4: **„auto-triggering safety nets“**. Wenn Messgrößen für KI-Verdrängung vorher festgelegte Schwellen überschreiten, steigen Arbeitslosengeld, Lohnversicherung und Bargeldhilfen automatisch und ohne neues Gesetz. Wenn sich die Lage beruhigt, laufen sie wieder aus. Außerdem: Steuerbasis von Löhnen zu Kapital verschieben, 32-Stunden-Pilotprojekte, „Right to AI“.
- Kritik: „policymercial“ (TechPolicy.Press). Konkrete Schwellenwerte nennt die Berichterstattung nicht.
- [Unite.AI](https://www.unite.ai/openai-proposes-robot-taxes-public-wealth-fund-and-four-day-work-week), [The Next Web](https://thenextweb.com/news/openai-robot-taxes-wealth-fund-superintelligence-policy). Reliability: Sekundärquellen, PDF nicht gelesen.

### 2.4 Anthropic: Economic Futures und der Stufenplan **TEILWEISE** (Film 4 nutzt nur den Vorschlag, Kapitalkonten Anteile an KI-Firmen halten zu lassen; Stufen und Token-Steuer sind NEU)
- **„Preparing for AI's economic impact: exploring policy responses“ (14.10.2025, direkt gelesen):** Ideen nach Tempo sortiert. Moderat: „Automation Adjustment Assistance“ (startet bei ≈ 700 Mio. $/Jahr, „scalable with displacement“) und **„token tax“**: „A tax on AI-generated tokens sold to end users“ (Lockwood & Korinek). Schnell: **nationale Staatsfonds mit Anteilen an KI-Firmen**, Mehrwertsteuer, „low-rate business wealth tax“. Ausdrücklich keine festen Positionen. [anthropic.com/research/economic-policy-responses](https://www.anthropic.com/research/economic-policy-responses)
- **Economic Policy Framework (2026, direkt gelesen):** drei Stufen, **≈ 5 % Arbeitslosigkeit / ≈ 10 % / „unprecedented“**. In der letzten Stufe: „might include basic income, sovereign wealth models, and equity-sharing mechanisms.“ Kapitalkonten „can hold only index funds—not a stake in AI companies.“ (**BEREITS VERWENDET, Film 4**) Global: „the principles underpinning it are intended to be global“, aber **keine Vorschläge für Entwicklungsländer**. 200 Mio. $ Research Fund. [anthropic.com/policy-on-the-ai-exponential/epf](https://www.anthropic.com/policy-on-the-ai-exponential/epf)
- **Interessenkonflikt:** Anthropic ist selbst KI-Firma (siehe Faktencheck Film 4). Im Film offenlegen.

### 2.5 Korinek: das „seed UBI“ **NEU**
- **Claim:** Korinek schlug vor dem US-Senat (Okt./Nov. 2023) eine **Grundsicherung als Samenkorn** vor: minimal, solange KI wenig verdrängt, steigend, wenn die Verdrängung wächst. Die Infrastruktur steht dann schon, wenn sie gebraucht wird.
- **Warum stark:** Das ist die eleganteste Antwort auf „Wann fangen wir an?“: jetzt, klein, mit eingebautem Regler.
- **Quellen:** [Darden News, 01.11.2023](https://news.darden.virginia.edu/2023/11/01/workforce-implications-of-ai-at-the-us-senate/); Korinek, „Economic Policy Challenges for the Age of AI“, [NBER w32980](https://www.nber.org/papers/w32980) (2024, acht Politik-Herausforderungen, Verteilung an erster Stelle). Reliability: mittel-hoch (Pressemitteilung der Uni, Testimony nicht im Wortlaut gelesen).

### 2.6 Trammell & Patel: „Capital in the 22nd Century“ (29.12.2025) **NEU**
- **Claim:** Piketty lag mit der Vergangenheit falsch, aber „probably right about the future“. Wenn Kapital Arbeit voll ersetzt, gehört am Ende „approximately everything … to those who are wealthiest when the transition occurs, or their heirs“. Ihr Gegenmittel: eine **globale, stark progressive Steuer auf Kapital**, laut ihnen „essentially the only way“.
- **Überraschend:** Der Zeitpunkt des Übergangs friert die Verteilung ein. Wer *beim Übergang* nichts besitzt, holt nie mehr auf. Das ist ein starkes Argument für „jetzt säen“.
- **Kritik:** Ben Thompson (Stratechery), Zvi Mowshowitz („Dos Capital“).
- [philiptrammell.substack.com/p/capital-in-the-22nd-century](https://philiptrammell.substack.com/p/capital-in-the-22nd-century). Reliability: Essay, argumentativ, nicht empirisch.

### 2.7 IWF (2024) und die Kluft zwischen den Ländern **NEU**
- **IWF SDN 2024/002 „Broadening the Gains from Generative AI“:** Kapitalertragsteuern stärken, „to protect the tax base against a further decline in labor's share“. **Gegen eine spezielle KI-Steuer** (Produktivität). Mehr Arbeitslosenversicherung. [IMF-Blog, 17.06.2024](https://www.imf.org/en/Blogs/Articles/2024/06/17/fiscal-policy-can-help-broaden-the-gains-of-ai-to-humanity)
- **Georgieva (Okt. 2025):** „The IMF is quite worried that the gap between advanced economies and low-income countries on readiness for AI is growing.“ AI Preparedness Index für 174 Länder. [PNA](https://alpha.pna.gov.ph/articles/1227708)
- **Paradox:** Arme Länder sind **weniger** betroffen (≈ 26 % der Jobs exponiert gegenüber ≈ 60 % in reichen Ländern), profitieren aber auch weniger. Die Bedrohung trifft zuerst die Reichen, der Nutzen bleibt bei ihnen. Für ein globales System heißt das: Verteilt wird **pro Kopf, nicht nach Anteil am BIP**.

### 2.8 Globale Steuern: es ist schon einmal gelungen **NEU**
- **Globale Mindeststeuer:** Am 08.10.2021 einigten sich **136 von 140 Ländern** auf 15 % effektiv für Konzerne mit über 750 Mio. € Umsatz. Bis Ende 2025 hatten > 55 Staaten sie in Kraft gesetzt. Nicht dabei waren unter anderem Kenia und Nigeria. Die USA bekamen 2026 eine „Side-by-Side“-Ausnahme. [EY](https://taxnews.ey.com/news/2021-1839-136-inclusive-framework-countries-support-global-tax-agreement), [BDO](https://www.bdo.global/en-gb/services/tax/taxation-of-the-digital-economy/status-of-implementation-around-the-world), [Bloomberg Tax, Mai 2026](https://news.bloombergtax.com/daily-tax-report-international/oecd-announces-pillar-2-global-minimum-tax-common-understanding-central-record-updates-administrative-guidance)
- **Zucman/G20 (2024):** 2 % auf Milliardärsvermögen; heute zahlen sie effektiv ≈ 0,3 %. Die G20 von Rio bekannten sich zum Prinzip, aber ohne Umsetzung. (Siehe 1.3.)
- **Rechenleistung als Steuerbasis:** Sastry, Heim u. a. (GovAI/Oxford, Feb. 2024): Compute ist „detectable, excludable, and quantifiable, and is produced via an extremely concentrated supply chain“. Vorgeschlagen werden u. a. ein internationales Chip-Register und Meldepflichten. [arXiv 2402.08797](https://arxiv.org/html/2402.08797v1). **Daraus folgt (meine Zuspitzung):** *You can hide money in a tax haven. You can't hide a gigawatt data center.* Risiko: Rechenzentren können in Niedrigsteuerländern stehen und Cloud-Umsätze lassen sich verschieben. Mindeststeuer und Chip-Register adressieren genau das.

### 2.9 Staatsfonds: Norwegen und Alaska
- **Norwegen:** Der Fonds war Mitte 2026 ≈ 22.700 Mrd. NOK ≈ 2,3 Bio. $ wert, das sind ≈ 430.000 $ pro Einwohner *[eigene Rechnung]*. Die Fiskalregel erlaubt eine Entnahme von ≈ 3 % (erwartete Realrendite). 2026 sind es 579 Mrd. NOK ≈ 57 Mrd. $ ≈ **10.000 $ pro Norweger und Jahr** *[eigene Rechnung, 5,6 Mio. Einw.]*. Das fließt in den Haushalt, nicht als Scheck. Erste Einzahlung 1996: ≈ 300 Mio. $. Mehr als die Hälfte des Werts stammt aus Rendite. [oilprice](https://oilprice.com/Latest-Energy-News/World-News/Norway-to-Boost-Spending-from-Its-2-Trillion-Oil-Fund-in-2026-Budget.amp.html), [scienceblog](https://scienceblog.com/?p=595997), [Wikipedia Budgetary rule](https://en.wikipedia.org/wiki/The_budgetary_rule). **NEU**
- **Überraschend:** Ein einziges Land hat aus einer Bodenressource in 30 Jahren ein Vermögen gemacht, das fast schon ein Hocheinkommen pro Kopf **für immer** abwirft. Und dieselbe Ressource Öl hat anderswo Petrostaaten hervorgebracht (siehe 3.3, Intelligence Curse).
- **Alaska:** **BEREITS VERWENDET (Film 4)**, nur als Rückverweis.
- **Globaler Maßstab:** Ein „Norwegen für den Planeten“ mit Hocheinkommen (14.375 $) für 8,3 Mrd. Menschen bei 3 % Entnahme bräuchte ≈ 4.000 Bio. $ Vermögen, rund das Achtfache des heutigen Weltvermögens *[eigene Rechnung]*. Das geht nur, wenn KI-Kapital den Wert dieses Vermögens vervielfacht und ein Teil davon von Anfang an allen gehört.

### 2.10 Das gemeinsame Erbe der Menschheit **NEU**
- **Thomas Paine, „Agrarian Justice“** (geschr. 1795/96, ersch. 1797): Die Erde war „the common property of the human race“. Grundbesitzer schulden der Gemeinschaft eine „ground-rent“. Daraus ein Nationalfonds: **15 £ für jeden Menschen mit 21** und 10 £ jährlich ab 50, für „every person, rich or poor“. Er fordert ausdrücklich ein Recht, keine Wohltat. Wortlaut je nach Ausgabe: „it is a right, and not a charity“; die Variante „not charity but a right—not bounty but justice“ ist **nicht gesichert**. [Standard Ebooks](https://standardebooks.org/ebooks/thomas-paine/essays/text/agrarian-justice), [libertarianism.org](https://www.libertarianism.org/publications/essays/agrarian-justice-excerpt). Reliability: hoch für 15 £/Erde, Wortlaut vor Verwendung an der Scan-Ausgabe prüfen.
- **„Common heritage of mankind“:** Der Tiefseeboden jenseits nationaler Grenzen gehört nach UNCLOS Teil XI allen. Grundsätze: keine Aneignung, gemeinsame Verwaltung (Internationale Meeresbodenbehörde ISA), gerechte Teilhabe mit Blick auf Entwicklungsländer, Generationengerechtigkeit. Der „Common Heritage Fund“ ist noch in Verhandlung. [ISA-Rahmendokument](https://equitablesharing.isa.org.jm/Documents/A%20Framework%20for%20the%20Common%20Heritage%20Fund.pdf), [UBA](https://www.umweltbundesamt.de/en/publikationen/the-benefit-sharing-regime-of-the-international)
- **Ehrlicher Gegenbefund:** Der Mondvertrag (1979, „common heritage“) hat nur 17–18 Vertragsstaaten, und keine Raumfahrtmacht ist dabei, eben **wegen** der Erbe-Klausel. [NTI](https://www.nti.org/treaties-and-regimes/agreement-governing-activities-states-moon-and-other-celestial-bodies-moon-agreement/). Lehre: Das Prinzip setzt sich nur durch, **bevor** die Ressource wirtschaftlich wird.
- Zur KI-Anwendung des Prinzips habe ich **keinen etablierten Vorschlag gefunden**. Das ist eine Lücke, die der Film besetzen könnte.

### 2.11 „Trainiert auf uns allen“: Daten-Dividende **NEU**
- **Claim:** Die erste große Zahlung für Trainingsdaten ist erfolgt. Anthropic zahlt 1,5 Mrd. $, ≈ 3.000 $ pro Buch, für > 482.000 Werke aus Piratenbibliotheken (endgültig genehmigt Juli 2026, ≈ 91 % beansprucht).
- **Wichtige Nuance:** Laut Richter Alsup war das **Training selbst rechtmäßig (fair use)**, bezahlt wurde für die *Beschaffung* aus Piratenquellen. Ein Rechtsanspruch „KI schuldet allen eine Dividende“ folgt daraus nicht. Moralisch trägt das Argument trotzdem: Die Maschine ist aus dem gemeinsamen Schreiben der Menschheit gebaut.
- [ABC/AP](https://abcnews.com/Technology/wireStory/judge-approves-15b-anthropic-settlement-pirated-books-train-134949964), [WIFR, 21.07.2026](https://www.wifr.com/2026/07/21/judge-approves-15b-anthropic-settlement-over-pirated-books-used-train-claude-chatbot/). Reliability: hoch (AP). **NEU** (Folge 1 benutzt „authors“ nur metaphorisch.) Interessenkonflikt: Der Kanal nennt Anthropic oft, das hier ist kein Lob.

### 2.12 Bargeld an alle: was wirklich funktioniert **NEU** (Kenia steht im Film-4-*Entwurf*, nicht in der VO)
- **GiveDirectly Kenia, Allgemeines Gleichgewicht** (Egger, Haushofer, Miguel, Niehaus, Walker; Econometrica 2022): ≈ 1.000 $ an > 10.500 arme Haushalte in 653 Dörfern, per M-Pesa. **Lokaler Multiplikator ≈ 2,5**, große Effekte auch für Nicht-Empfänger und Firmen, „minimal price inflation“. [NBER w26600](https://www.nber.org/system/files/working_papers/w26600/w26600.pdf). Reliability: hoch. **Überraschend:** Geld an Arme vermehrt sich im Dorf, auch für die, die nichts bekommen haben.
- **Kenia-UBI-Studie** (12 Jahre, seit 2017, ≈ 50 $/Monat): Bei der Gründung von Firmen schlug der **Einmalbetrag** sogar die 12-Jahres-Zusage. Das stützt die Idee eines Startkapitals à la Paine. [NPR, 07.12.2023](https://www.npr.org/sections/goatsandsoda/2023/12/07/1217478771/its-one-of-the-biggest-experiments-in-fighting-global-poverty-now-the-results-ar)
- **Togo „Novissi“ (2020, Nature 2022):** Mit maschinellem Lernen auf Satellitenbildern und Handy-Metadaten wurde der Wohlstand aller 5,7 Mio. Mobilfunkkunden geschätzt. Das Geld kam per Mobile Money. Die Zielgenauigkeit war 42 % besser als bei geografischer Auswahl. Beträge: ≈ 14 $/Monat für 5 Monate. **Die erste KI, die Geld an die Ärmsten verteilt hat.** [J-PAL](https://www.povertyactionlab.org/project/using-mobile-phone-and-satellite-data-target-togos-emergency-cash-transfer-program), [CEGA](https://cega.berkeley.edu/research/ai-assisted-cash-transfers-togo). Risiko: Überwachung und Datenschutz.
- **Indien DBT (Aadhaar + Konto + Handy):** laut Regierung ≈ 50 Lakh Crore ₹ (≈ 550–600 Mrd. $) direkt auf Konten überwiesen und ≈ 3,5–5 Lakh Crore ₹ „Leckagen“ gespart. Das sind Regierungsangaben mit modellierter Gegenrechnung. [PIB, April 2025](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/apr/doc2025421543301.pdf), [Free Press Journal](https://www.freepressjournal.in/business/dbt-transfers-reach-50-lakh-crore-govt-saves-5-lakh-crore-pm-modi-at-india-mobile-congress). Reliability: mittel.
- **Findex 2025:** **79 % der Erwachsenen weltweit** haben ein Konto (2021: 74 %), in Subsahara-Afrika haben 40 % Mobile Money. 1,3 Mrd. sind noch ohne Konto. [Weltbank PM 16.07.2025](https://www.worldbank.org/en/news/press-release/2025/07/16/mobile-phone-technology-powers-saving-surge-in-developing-economies)

### 2.13 Worldcoin / World ID: der umstrittene Versuch **NEU**
- Iris-Scan per „Orb“ als Nachweis, ein einzigartiger Mensch zu sein. Die Idee dahinter: Wenn KI-Reichtum an alle Menschen geht, braucht man einen globalen Nachweis „ein Mensch, ein Anteil“. Zahlen schwanken: 2026 ≈ 18 Mio. „verified humans“ (Sekundärquelle), andere Angaben 10–25 Mio. **Gesperrt, bestraft oder suspendiert** in Spanien, Deutschland, Brasilien, Kenia und Südkorea. Mitgegründet von Altman. [TechCrunch](https://techcrunch.com/?p=3001462), [plisio (schwach)](https://plisio.net/crypto/worldcoin). Reliability: niedrig-mittel. **Nutzen im Film:** als Beleg, dass die Frage „Wer zählt als Mensch?“ schon jetzt praktisch gestellt wird, aber nicht als Lösung.

---

## 3 · Wem gehört die Superintelligenz?

### 3.1 Konzentration heute **NEU**
- **Rechenleistung:** Die USA haben ≈ 75 % der GPU-Cluster-Leistung, China ≈ 15 % (Epoch, Mai 2025; der Datensatz deckt nur 10–20 % der globalen Leistung ab). [epoch.ai](https://epoch.ai/data-insights/ai-supercomputers-performance-share-by-country)
- **Lieferkette:** ASML (Niederlande) baut als **einzige Firma der Welt** EUV-Maschinen, mit Spiegeln von Zeiss und Lasern von Trumpf (Deutschland). TSMC (Taiwan) fertigt ≈ 90 % der modernsten Chips. [Fortune 2024](https://fortune.com/2024/04/18/asml-semiconductor-ai-manufacturing-uev-lithography-chips-act-nvidia-tsmc-wafers). **Pointe:** Superintelligenz ist ein Produkt der ganzen Welt (Maschinen aus Europa, Chips aus Asien, Rohstoffe aus Afrika, Texte aus allen Sprachen), gehört aber wenigen. (Kobalt/Kongo nicht neu geprüft.)
- **Bewertungen 2026:** Anthropic 965 Mrd. $ (Series H, 28.05.2026), OpenAI 852 Mrd. $ (31.03.2026). [Bloomberg Law](https://news.bloomberglaw.com/private-equity/anthropic-raises-at-965-billion-valuation-eclipsing-openai-1). Zusammen ≈ 1,8 Bio. $, also ≈ 220 $ pro Mensch *[eigene Rechnung]*. **Heute ist der „Anteil an der Superintelligenz“ pro Kopf winzig. Es geht um die Zukunft, und Zukunft ist jetzt noch billig zu haben.**

### 3.2 Öffentliches Eigentum gibt es schon **NEU**
- **OpenAI Foundation:** 26 % an der OpenAI Group PBC, bei Gründung (Okt. 2025) ≈ 130 Mrd. $, plus ein Optionsschein auf mehr, falls sich der Wert nach 15 Jahren mehr als verzehnfacht. Microsoft ≈ 27 %. [openai.com/our-structure](https://openai.com/de-DE/our-structure/), [Benton](https://www.benton.org/headlines/openai-reorganization-sets-500-billion-profit-ai-behemoth). Reliability: hoch (Firmenseite). **Überraschend:** Eine der größten Stiftungen der Welt besitzt ein Viertel eines führenden KI-Labors. Die Frage ist, **wem die Stiftung verpflichtet ist**, nicht ob es so etwas geben kann.
- **Anthropic-Gründer:** Die Mitgründer haben zugesagt, 80 % ihres Vermögens zu spenden. Amodei fordert progressive Besteuerung (sonst komme „a bad version designed by a mob“). [Fortune, 27.01.2026](https://fortune.com/2026/01/27/anthropic-ceo-dario-amodei-essay-warning-ai-adolescence-test-humanity-risks-remedies/), [Axios, 29.05.2026](https://www.axios.com/2026/05/29/ai-billionaires-tech-taxes-wealth). **TEILWEISE** (Amodei in Film 1–4, aber nicht mit diesen Aussagen)
- **Offene Modelle:** liegen im Schnitt ≈ 4 Monate hinter der Spitze (Epoch, 29.05.2026; Okt. 2025 waren es ≈ 3 Monate, die Lücke wächst leicht). Auf einer Consumer-GPU erreicht man das Spitzenniveau nach 6–12 Monaten. [epoch.ai](https://epoch.ai/data-insights/open-weights-vs-closed-weights-models). **Überraschend:** Die Intelligenz selbst lässt sich schwer monopolisieren, die Rechenleistung und das Kapital dagegen schon.
- **Public AI:** Die Schweiz (EPFL, ETH, CSCS) veröffentlichte am 02.09.2025 „Apertus“ (8B/70B) mit offenen Gewichten, Daten und Rezepten unter Apache 2.0, gedacht als öffentliche Infrastruktur. [Engadget](https://engadget.com/ai/switzerland-launches-its-own-open-source-ai-model-133051578.html). „CERN for AI“: Bericht des Centre for Future Generations (u. a. Brundage, Maydell), Inhalt nicht geprüft. [CFG PDF](https://cfg.eu/wp-content/uploads/CFG-Building-CERN-for-AI_report_public.pdf). **NEU** (der grep-Treffer „CERN“ in Folge 1 war nur „Con*cern*ing“)
- **UN:** Guterres schlägt einen freiwilligen **Global Fund for AI (bis 3 Mrd. $)** vor, für Rechenleistung, Daten und Fähigkeiten in Entwicklungsländern. Global Dialogue on AI Governance, Genf, 6./7.07.2026. Bisher keine bestätigten Zusagen. [UN India](https://india.un.org/en/310315-un-secretary-generals-remarks-india-ai-impact-summit-opening-ceremony). 3 Mrd. $ sind ≈ 0,4 % der Big-Tech-KI-Investitionen eines Jahres *[eigene Rechnung]*.

### 3.3 Der „Intelligence Curse“ (die ernsthafte Gefahr, lösungsorientiert erzählt) **NEU**
- Drago & Laine (April 2025): Wenn Staaten und Firmen Menschen weder als Arbeiter noch als Steuerzahler brauchen, verlieren sie den Anreiz, in sie zu investieren, wie in Petrostaaten, deren Ölgeld die Steuern der Bürger ersetzt. [intelligence-curse.ai via stafforini](https://stafforini.com/works/drago-2025-intelligence-curse/)
- **Hoffnungsvolle Umdrehung:** Norwegen und die Petrostaaten hatten dieselbe Ressource. Der Unterschied waren **Institutionen, die vor dem Reichtum gebaut wurden** (Fonds, Regel, Demokratie). Es ist also ein Fluch, gegen den es ein bekanntes Gegenmittel gibt. Risiko: Doom-Nähe, Pauschalurteil über Petrostaaten. Belegen über Resource-Curse-Literatur (z. B. Ross), noch nicht recherchiert.

---

## 4 · Hoffnungsvolle Präzedenzfälle (nur als kurze Stütze)
| Fall | Kern | Status |
|---|---|---|
| Montreal-Protokoll | als erster UN-Vertrag universell ratifiziert (198 Parteien), 99 % der Stoffe verschwunden | **BEREITS VERWENDET (Flagship/Folge 1)**, nicht wiederholen |
| Globale Mindeststeuer 2021 | 136 von 140 Ländern einigen sich auf eine Steuer | **NEU**, stärkster Beleg für „globale Verteilung ist machbar“ |
| GPS | nach dem Abschuss von KAL 007 (1983) für zivile Nutzung freigegeben, volle Genauigkeit erst 2000 (Clinton). Eine Militärtechnik wurde zum Weltgemeingut. Nuance: 1983 war „free“ nicht ausdrücklich zugesagt. [Nextgov](https://nextgov.com/digital-government/2014/11/how-1983-plane-crash-helped-speed-civilian-use-gps/98000), [TIME](https://content.time.com/time/specials/packages/article/0,28804,2023689_2023753_2023787,00.html) | **NEU** |
| Tiefseeboden als „common heritage“ | Prinzip steht seit 1982 im Recht | **NEU** (mit dem Gegenbefund Mondvertrag) |
| Indien DBT / M-Pesa / Togo | Rohre für Geld an Hunderte Millionen | **NEU** |
| Impfallianzen (Gavi, COVAX) | nicht neu recherchiert. COVAX ist ambivalent (Ungleichheit), nur mit Vorsicht | offen |

---

## 5 · Der Weg in Etappen

> Leitfrage: Was kann **heute** beginnen, solange Arbeit noch gebraucht wird? Was **wächst von selbst** mit der Automatisierung mit? Wie sieht der **globale Endzustand** aus?
> Das Prinzip über allen Etappen: **Die Regeln entstehen, solange sie billig sind. Danach greifen sie automatisch.** (Windfall-Logik + Thermostat + Lehre aus Alaska und dem Mondvertrag.)

### Etappe 1 · Säen (jetzt bis ca. 2030, Arbeit wird noch gebraucht)
| Maßnahme | Was sie bewirkt | Beleg |
|---|---|---|
| **Messen** | Statistikämter aufrüsten, Lohnanteil, Unterbeschäftigung und KI-Verdrängung öffentlich verfolgen, damit Auslöser überhaupt greifen können | Anthropic EPF „foundational“ |
| **Samenkorn-Fonds mit KI-Anteilen** | Öffentliche oder Bürgerfonds kaufen bzw. erhalten jetzt Anteile, solange sie pro Kopf billig sind (≈ 220 $ pro Mensch für die beiden Top-Labs) | OpenAI Foundation 26 %, Anthropic „sovereign wealth funds with AI stakes“; Babykonten **(Film 4, Rückverweis)** |
| **Versprechen vor dem Reichtum** | Windfall Clause und gestaffelte Zusagen, die Labs unterschreiben, solange der Ernstfall unwahrscheinlich ist | GovAI 2020 |
| **„Seed UBI“** | kleine, universelle Zahlung, deren Infrastruktur steht und die mit der Verdrängung wächst | Korinek 2023 |
| **Globaler Boden** | extreme Armut per Mobile Money beenden: ≈ 170–318 Mrd. $/Jahr ≈ 0,25 % des Welt-BIP | Blumenstock 2026, GiveDirectly, Togo |
| **Zugang zur Intelligenz** | offene und öffentliche Modelle, Rechenleistungs-Gutscheine für arme Länder | Apertus, UN Global Fund for AI, „Universal Basic Compute“ |
| **Steuerbasis vorbereiten** | Verschiebung von Löhnen zu Kapital, Lücken schließen, Mindeststeuer umsetzen | IWF 2024, OECD Pillar Two, Anthropic |

### Etappe 2 · Mitwachsen (Automatisierung nimmt zu, Arbeitslosigkeit steigt über ≈ 5–10 %)
Die Mechanismen hier sind **Thermostate** (Arbeitsbegriff, im Film nicht wiederholen, da Film 4): Sie skalieren mit KI-Umsatz, Verdrängung oder Lohnanteil, ohne dass jedes Jahr ein Parlament neu entscheiden muss.
| Mechanismus | Wie er automatisch mitwächst | Beleg |
|---|---|---|
| **Steuer in Aktien** | Firmen zahlen einen festen %-Satz ihres Werts in Aktien. Wachsen sie, wächst der Fondsanteil von selbst | Altman 2021 (2,5 %) |
| **Gestaffelte Windfall-Abgabe** | Der Prozentsatz steigt mit dem Gewinn als Anteil am Welt-BIP | GovAI |
| **Token- und Compute-Steuer** | Die Einnahmen steigen mit jeder KI-Nutzung, also genau dort, wo menschliche Arbeit ersetzt wird | Lockwood & Korinek in Anthropic 2025 |
| **Auslöser-Sicherheitsnetze** | Arbeitslosengeld, Lohnversicherung und Bargeld steigen automatisch bei festgelegten Schwellen | OpenAI 2026, Anthropic 5/10 %-Stufen |
| **Seed UBI → Dividende** | Die Zahlung wird an den Lohnanteil gekoppelt: Fällt er, steigt sie | Korinek |
| **Globale Kapitalsteuer** | progressive Steuer auf Kapital, international abgestimmt | Trammell/Patel, Zucman |

### Etappe 3 · Ernten (Endzustand: Arbeit weitgehend automatisiert)
- **Eigentum:** Ein Teil der KI-Wirtschaft gehört strukturell allen Menschen, über nationale Fonds und einen globalen Fonds, der Anteile an Labs, Rechenzentren und Chip-Lieferketten hält („ein Norwegen für den Planeten“). Die Idee des gemeinsamen Erbes wird auf die Superintelligenz übertragen, wie beim Tiefseeboden.
- **Auszahlung:** **pro Mensch, nicht pro Land und nicht nach Wirtschaftsleistung.** Das Geld geht über digitale Identität und Mobile Money direkt an Menschen (Togo, Indien, Kenia), ohne den Umweg über Regierungen, die es abzweigen könnten. Ergänzt wird es durch Grundversorgung, die fast nichts mehr kostet (Intelligenz, Bildung, Diagnose).
- **Einbeziehung armer Länder:** Ihr Anspruch begründet sich über das gemeinsame Erbe (Daten aus allen Sprachen, Rohstoffe, Lieferkette) und über die Pro-Kopf-Regel. Weil sie weniger exponiert sind, kommt das Geld dort *zusätzlich* zu wachsenden Einkommen an und nicht als Ersatz.
- **Rechnung:** In einer 10×-Weltwirtschaft kostet ein Hocheinkommen für alle ≈ 10 % des BIP *[eigene Rechnung]*. Das ist weniger als die Hälfte der heutigen Sozialausgaben in der OECD.
- **Offene Frage:** Wer kontrolliert den globalen Fonds? Erfahrungen: ISA (langsam), Norwegens Ethikrat, Alaskas politische Kürzungen (Film 4). Lehre: Die Auszahlungsregel gehört in eine Verfassung oder einen Vertrag, nicht in ein Jahresbudget.

### Die größten politischen Hindernisse und wie man sie überwindet
| Hindernis | Warum es ernst ist | Wie es überwindbar ist |
|---|---|---|
| **Steuerflucht / Standortwettbewerb** | Kapital ist mobil | Compute ist sichtbar und physisch (Sastry 2024). Mindeststeuer 136/140 (2021) zeigt, dass Koordination geht. Chip-Lieferkette mit ASML und TSMC als natürliche Kontrollpunkte |
| **Nationalismus: „Warum Ausländer bezahlen?“** | Wähler finanzieren ungern andere Länder | Die KI wurde mit Arbeit und Daten der ganzen Welt gebaut. Der Boden kostet nur ≈ 0,25 % des Welt-BIP. Kaufkraft armer Länder öffnet neue Märkte (Multiplikator 2,5) |
| **Rennen USA–China** | Keiner will bremsen | Teilen bremst nicht, es verteilt nur. Windfall-Zusagen gelten erst bei Gewinnen. Gegenseitige Zusagen nach dem Muster Montreal |
| **Lobby der Labs** | Interessen der Eigentümer | Die Labs schlagen selbst Fonds vor (OpenAI, Anthropic). Amodei: lieber gut gestaltet als „designed by a mob“. Ex ante sind Zusagen billig |
| **Politische Kürzung später** | Alaska kürzte ab 2016 (Film 4) | Regel in Verfassung oder Vertrag, Auszahlung in Aktien |
| **Korruption und Zielgenauigkeit** | Geld versickert | Direktzahlung aufs Handy, Indiens „Leckage“-Ersparnis, Togo |
| **Inflationsangst** | Mehr Geld bei gleich vielen Gütern | Kenia: „minimal price inflation“. Bei KI-Überfluss wächst das Angebot mit (Musk-Argument, unbelegt) |
| **Identität und Überwachung** | „Ein Mensch, ein Anteil“ braucht einen Nachweis | Worldcoin als Warnung. Datensparsame staatliche Ausweise, Aadhaar-Debatte |
| **Intelligence Curse** | Wer nicht gebraucht wird, verliert seine Stimme | Eigentum und Stimme sichern, **solange** die Menschen noch Verhandlungsmacht haben, also jetzt |

---

## 6 · Rohe Leitgedanken-Kandidaten (9)

Vermieden: „UBI rettet uns“, „Roboter nehmen Jobs“, „lerne programmieren“, „es hat begonnen und kaum einer merkt es“, Rechenzentrum voller Genies, exponentielle Kurve, Aristoteles' Webstuhl/Athen, Pferd und Bauer.

### A · Der Kuchen ist schon groß genug ★ (stärkster „Aha“-Moment)
**EN:** "Split today's world economy evenly, and every person on Earth would already be at the World Bank's line for 'high income'. Superintelligence doesn't have to invent the money. It has to grow the pie until sharing stops hurting."
**DE:** Teilt man die heutige Weltwirtschaft gleichmäßig auf, läge jeder Mensch schon an der Weltbank-Grenze zum „Hocheinkommen“. Die Superintelligenz muss das Geld nicht erfinden. Sie muss den Kuchen so groß machen, dass Teilen nicht mehr wehtut.
**Bild/Gefühl:** Die Weltkarte wird Land für Land in dieselbe warme Farbe getaucht. Dann wächst der Kuchen und das Stück, das alle brauchen, wird immer schmaler (94 % → 10 %). Gefühl: Verblüffung, dann Erleichterung.
**Risiko:** Klingt nach „heute schon alles umverteilen“. BIP ist nicht gleich Einkommen. Muss klar als Gedankenexperiment markiert werden.

### B · Teilen, bevor man weiß, wer gewinnt ★
**EN:** "The cheapest moment to promise to share is before anyone knows who wins. That moment is now."
**DE:** Der billigste Moment, das Teilen zu versprechen, ist, bevor jemand weiß, wer gewinnt. Dieser Moment ist jetzt.
**Bild/Gefühl:** Läufer an der Startlinie, die vor dem Startschuss gemeinsam ein Blatt unterschreiben. Gefühl: Dringlichkeit ohne Angst, wir haben ein Zeitfenster.
**Risiko:** Abstrakt. Versprechen können gebrochen werden (Leike), keine Firma hat unterschrieben, und der Mondvertrag zeigt, dass Mächtige nicht unterschreiben.

### C · Unser gemeinsames Erbe (Paine 2.0)
**EN:** "In 1797, Thomas Paine said every person is owed a share of the earth, as a right, not as charity. Superintelligence is built from our generation's common earth: everything humanity ever wrote."
**DE:** 1797 sagte Thomas Paine, jedem Menschen stehe ein Anteil an der Erde zu, als Recht, nicht als Almosen. Superintelligenz ist aus der gemeinsamen Erde unserer Generation gebaut: allem, was Menschen je geschrieben haben.
**Bild/Gefühl:** Eine Bibliothek aller Sprachen fließt als Lichtfäden in eine Maschine. Jeder Mensch hält das Ende eines Fadens. Gefühl: Würde („es ist unseres“) statt Bittstellerei.
**Risiko:** Historischer Einstieg (Film 4 hatte Aristoteles; die Faustregel heißt Zukunft). Juristisch ist Training fair use, Daten sind kein Eigentum. Die Daten-Dividende pro Kopf wäre winzig.

### D · Von der ganzen Welt gebaut
**EN:** "No single country can build superintelligence. Dutch machines, Taiwanese chips, minerals from Africa, words from every language. Something the whole world builds should pay the whole world."
**DE:** Kein einzelnes Land kann Superintelligenz bauen. Maschinen aus den Niederlanden, Chips aus Taiwan, Rohstoffe aus Afrika, Worte aus jeder Sprache. Was die ganze Welt baut, sollte die ganze Welt bezahlen.
**Bild/Gefühl:** Kamerafahrt aus einem Chip heraus, bis der ganze Globus von Lieferlinien überzogen ist. Gefühl: Zugehörigkeit.
**Risiko:** Das gilt auch für jedes iPhone. Moralisch einleuchtend, ökonomisch kein Automatismus. Rohstoffzahlen noch nicht geprüft.

### E · Säen, solange es klein ist (der Weg; ersetzt die in Film 4 verbrauchte Thermostat-Metapher)
**EN:** "We don't need to win one big vote. We need a seed: a small payment to everyone that starts now, and grows on its own as the machines take over."
**DE:** Wir müssen keine große Abstimmung gewinnen. Wir brauchen ein Samenkorn: eine kleine Zahlung an alle, die jetzt beginnt und von selbst wächst, wenn die Maschinen übernehmen.
**Bild/Gefühl:** Ein Keimling, dessen Wurzeln in die Lichtleitungen der Rechenzentren wachsen. Je heller sie leuchten, desto größer wird der Baum, unter dem alle stehen. Gefühl: Beruhigung, Machbarkeit. (Überschneidet sich mit I, beide lassen sich zusammenlegen.)
**Risiko:** Film 4 endet inhaltlich mit „thermostat … grows with the problem“. E darf das nur als bewussten Rückverweis aufgreifen, nicht wiederholen. Technokratisch, und konkrete Schwellenwerte gibt es noch nirgends.

### F · Geld kann fliehen, Rechenzentren nicht
**EN:** "For centuries, wealth could hide in tax havens. The wealth of superintelligence lives in buildings you can see from space."
**DE:** Jahrhundertelang konnte Reichtum in Steueroasen verschwinden. Der Reichtum der Superintelligenz wohnt in Gebäuden, die man aus dem All sieht.
**Bild/Gefühl:** Nachtaufnahme der Erde, Rechenzentren glühen wie neue Städte. Ein Koffer voller Geld verschwindet, das Gebäude bleibt. Gefühl: Ermächtigung, „diesmal geht es“.
**Risiko:** Gewinne lassen sich trotzdem verschieben, Rechenzentren entstehen in Niedrigsteuerstaaten. Braucht Mindeststeuer und Chip-Register als Ergänzung.

### G · Norwegen oder Petrostaat?
**EN:** "Oil made Norway one of the richest democracies on Earth and made other countries poorer and less free. Intelligence is the new oil. Which one we become depends on rules we write before the money arrives."
**DE:** Öl hat Norwegen zu einer der reichsten Demokratien der Welt gemacht und andere Länder ärmer und unfreier. Intelligenz ist das neue Öl. Was wir werden, hängt an Regeln, die wir schreiben, bevor das Geld kommt.
**Bild/Gefühl:** Zwei identische Bohrtürme. Hinter dem einen ein Fonds, der Schulen und Renten speist, hinter dem anderen ein Palast. Gefühl: klare Wahl.
**Risiko:** Leicht düster (Intelligence Curse). „Intelligence is the new oil“ ist ein abgegriffener Satz. Pauschalurteil über Petrostaaten.

### H · Die Rohre liegen schon
**EN:** "A farmer in Togo was found by an AI and paid on her phone, in days. The pipes to pay every human already exist. What's missing is what flows through them."
**DE:** Eine Bäuerin in Togo wurde von einer KI gefunden und in wenigen Tagen auf ihr Handy bezahlt. Die Rohre, um jeden Menschen zu bezahlen, liegen schon. Es fehlt nur, was hindurchfließt.
**Bild/Gefühl:** Ein Netz leuchtender Leitungen über einem Kontinent, das darauf wartet, sich zu füllen. Gefühl: „Es ist näher, als ich dachte.“
**Risiko:** Überwachungsfrage (Handy-Metadaten), 1,3 Mrd. Menschen ohne Konto. Togo-Beträge waren winzig (≈ 14 $/Monat). „In days“ prüfen.

### I · Ein Anteil an der Zukunft kostet heute ≈ 220 $
**EN:** "Today, the two leading AI labs are worth about two hundred dollars per human being. A share of superintelligence has never been cheaper, and never will be again."
**DE:** Heute sind die zwei führenden KI-Labore zusammen etwa zweihundert Dollar pro Mensch wert. Ein Anteil an der Superintelligenz war nie billiger und wird es nie wieder sein.
**Bild/Gefühl:** Ein Samenkorn in einer Hand, daneben im Zeitraffer ein Baum. Gefühl: Gelegenheit, Aufbruch.
**Risiko:** Klingt wie Anlageberatung oder Werbung für Labs (Interessenkonflikt). Bewertungen schwanken (Secondary-Abschläge 2026). Ein Staat müsste kaufen, nicht der Zuschauer.

---

## 7 · Empfehlung für die Auswahl (meine Sicht)
- **A + E/I** ergeben zusammen den klarsten Film: „Der Kuchen reicht schon fast, wir müssen nur jetzt säen, dann wächst der Anteil aller mit.“ (Nicht wieder „Thermostat“ sagen, das war Film 4.) A ist der Aha-Moment, E der Weg. B kann als Schlussgedanke dienen („Der Moment ist jetzt“).
- **C/D** eignen sich als moralische Begründung im Mittelteil (warum *global*). **H** liefert das Bild für „wie es bei jedem ankommt“. **F** beantwortet die naheliegende Skepsis („die Reichen fliehen doch“).
- Vor dem Skript fact-checken: Weltbevölkerung und OECD-Sozialquote; Paine-Wortlaut; Korinek-Testimony im Original; OpenAI-PDF (Auslöser-Details); Kobalt-Anteil Kongo; Film-4-Überschneidungen sind geprüft (Thermostat, Anthropic-Indexfonds).
