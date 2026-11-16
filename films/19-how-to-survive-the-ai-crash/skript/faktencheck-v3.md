# Faktencheck v3 · „How to Survive the AI Crash“ · geprüft: vo-v3.txt

Stand: Freitag, 6.11.2026 (Uhr: Tag 31). Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v3.txt` (gesprochener Text samt Clip-Wortlaut C1 und C3). Dazu kommen die 13 Faktencheck-Punkte am Ende von `text-v3.md` und die Netz-Fakten aus `kritik-jakob-v2.md`. Die Veröffentlichung ist für Sa 7.11.2026, 17:00 Wien, geplant (Tag 32). Relative Zeitwörter („Last December“, „In May“, „This year“, „three years ago“) sind auf dieses Datum geprüft und stimmen.

**Ergebnis:** 82 Aussagen geprüft: **80 ok · 1 zu stark · 1 falsch · 0 unbelegt**.
- **2 Muss-Änderungen** sind in `vo-v4.txt` eingearbeitet (Zeilen 19 und 24). Sonst ist die Datei byte-identisch mit `vo-v3.txt`; [CLIP]-Zeilen und Regie-Tags sind unverändert.
- Dazu kommt **1 Muss-Änderung im Bild** (KC-Fed-Tafel), 6 Kann-Änderungen und einige Tafel-Hinweise.
- Nichts ist erfunden. Die Zahlen des Faktenzettels halten.

**Quellenlage (wichtig für den Zweitprüfer):** Aus dieser Umgebung sind alle Primärseiten gesperrt. Betroffen sind u. a. en.wikipedia.org, fdic.gov, federalreserve.gov, kansascityfed.org, investor.gov, bls.gov, sec.gov, reuters.com, cnbc.com, cnn.com, bloomberg.com und acadian-asset.com (curl und WebFetch: Namensauflösung gesperrt). YouTube-Untertitel ließen sich nicht neu laden, weil die Bot-Prüfung greift und die Cookies abgelaufen sind.

Geprüft habe ich deshalb über die Websuche:
- Suchauszüge direkt aus Primärseiten: federalreserve.gov, kansascityfed.org, bls.gov, FDIC-Seiten im UNT-Webarchiv, SEC-EDGAR.
- Spiegel: Reuters-Text über TradingView und Kathmandu Post, Wikipedia-Spiegel.
- Seriöse Sekundärberichte: CNBC, CNN, AP, Bloomberg, Axios, CBS.

„Suchauszug“ heißt: Die Primärseite selbst war nicht offen, der Text stammt aus dem Suchergebnis.

---

## 1 · Muss-Änderungen (eingearbeitet in vo-v4.txt)

| # | alt (vo-v3) | neu (vo-v4) | Grund | Quelle |
|---|---|---|---|---|
| M1 | Z. 19: „A year before all this, America's top central banker was asked what a sudden **stop** in that spending would mean.“ | „A year before all this, America's top central banker was asked what a sudden **drop** in that spending would mean.“ | **Ein Wort zu stark.** Victoria Guida (Politico) fragte laut Fed-Transkript: „how worried are you about what the **sudden contraction** in tech investment would mean for the overall economy?“ Eine Kontraktion ist ein Schrumpfen, kein Stillstand. | [Fed-Transkript 29.10.2025, PDF (Suchauszug)](https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20251029.pdf) · `clips.json`, C1 „slot“ |
| M2 | Z. 24: „Of all the American company debt rated safe, artificial intelligence firms owed two cents on the dollar three years ago. Now they owe ten.“ | „Three years ago, of every dollar American companies borrowed through bonds with good credit ratings, artificial intelligence firms took two cents. This year, they took ten.“ | **Falsches Maß.** Die KC Fed misst den Anteil von KI-Firmen an den **neu ausgegebenen** Investment-Grade-Anleihen: „shares of AI firms' issuances have risen from 2 percent in 2023 to 10 percent this year“, bis dato ≈ 330 Mrd. $, rund 10-mal so viel wie 2023. Das ist kein Anteil am Schuldenbestand, also nicht „owed“. „rated safe“ überzeichnet zudem „investment grade“ (dazu zählt auch BBB). „KI-Firmen“ sind dort breit gefasst: Hyperscaler, Chiphersteller, Versorger, Industrie, Neoclouds, Rechenzentren. Andere Messungen liegen höher (Reuters/LSEG: Hyperscaler allein ≈ 1/5 der US-IG-Emissionen 2026; Russell: ≈ 18 % im 1. Halbjahr). „Ten“ ist also die vorsichtige Zahl. | [KC Fed Economic Bulletin, 5.10.2026 (Suchauszug)](https://www.kansascityfed.org/research/economic-bulletin/beyond-valuations-long-term-financial-risks-from-the-ai-build-out/) · [Reuters/LSEG via AOL](https://www.aol.com/articles/big-tech-drives-us-corporate-144345000.html) · [Russell Investments, Aug. 2026](https://russellinvestments.com/content/ri/us/en/insights/russell-research/2026/08/ai-bond-market-mwir.html) |

**Muss im Bild (zu M2), Station 2, ON SCREEN:**
- jetzt: „AI FIRMS' SHARE OF US INVESTMENT-GRADE BONDS · 2023: 2 % → 2026: 10 %“
- neu: **„AI FIRMS' SHARE OF NEW INVESTMENT-GRADE BONDS · 2023: 2 % → 2026 SO FAR: 10 % · Kansas City Fed“**

Die Münze aus 100 Cent-Feldern passt weiter, gelesen als „von jedem neu geliehenen Dollar“.

---

## 2 · Kann-Änderungen (nicht eingearbeitet, Jakobs Wahl)

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K1 | „None of the three nets reaches it: no insurance, no brake, no stress test like the banks get.“ | „None of the three nets was built for it: no deposit insurance, no brake, no stress test like the banks get.“ | Im Kern fair (siehe 4d). „reaches“ ist aber absolut: Banken leihen Privatkredit-Fonds Geld, und genau diese Engagements hat die Fed 2025 in einer Zusatzanalyse zum Stresstest durchgerechnet; 2026 sind sie Prüfschwerpunkt. „was built for“ stimmt ohne Einschränkung. |
| K2 | „…the Dow lost almost a quarter in a single day.“ | „…the Dow lost almost twenty-three percent in a single day.“ | −22,6 % als „fast ein Viertel“ ist vertretbar gerundet (näher an 25 als an 20). Die exakte Zahl passt aber zur Tafel „DOW −22.6 %“. |
| K3 | „If your bank failed tomorrow, up to two hundred fifty thousand dollars of your money there would be safe.“ | „In America, if your bank failed tomorrow, up to two hundred fifty thousand dollars in your accounts there would be safe.“ | Das gilt nur für US-Banken mit FDIC-Schutz und nur für Einlagen, nicht für Wertpapiere. Das Publikum ist international (UK £120.000, EU 100.000 €); die Tafel nennt US und EU bereits. |
| K4 | „But in the financial crisis, almost nobody ran.“ | lassen oder „…almost no retirement saver ran.“ | Belegt ist das für 401(k)-Sparer (Fidelity 1,6 %). Für alle Anleger gibt es keine solche Zahl, Aktienfonds hatten 2008 Abflüsse. Der nächste Satz (Fidelity) ordnet es ein. |
| K5 | „Last December, he was asked…“ | lassen; nur wenn der Zweitprüfer eine Aufnahme vor Dezember findet: „In an interview released last December, he was asked…“ | Veröffentlicht 16.12.2025, Aufnahmetag nicht belegt. Bei Veröffentlichung am 7.11.2026 meint „last December“ den Dez. 2025, das stimmt. |
| K6 | „When one giant bank collapsed, lending froze around the world.“ | lassen oder „…lending seized up around the world.“ | Gängige Verkürzung (ADB: „Great Liquidity Freeze“). Die NY-Fed-Studie „Stressed, Not Frozen“ zeigt: Übernachtkredite liefen weiter, längere Kredite zwischen Banken brachen weg. |

---

## 3 · Weitere Bild- und Tafel-Hinweise (Kann)

- **RECORD HIGH · OCT 6, 2026** → „S&P 500 RECORD HIGH · OCT 6, 2026“. Der Rekord gilt für S&P 500 und Nasdaq. Ob der Dow am 4.11. nach dem Wahl-Plus (+1.569 Pkt.) einen neuen Rekord hatte, ließ sich nicht klären.
- **NOV 5 · TECH STOCKS −$2 TRILLION** → „−$2 TRILLION+“, denn der VO sagt „more than“.
- **China-Tafel:** Der Reuters-Artikel ist vom 26.10.2026, das Video vom 27.10. Beides ist vertretbar.
- **Waage Ausgaben/Einnahmen:** Eine Zahl ist jetzt möglich (4a), z. B. „2026: ≈ $700B+ BEING BUILT · OPENAI ≈ $50B, ANTHROPIC ≈ $65B A YEAR (RUN RATE)“. Sonst bleibt es bei der Proportion ohne Zahl.
- **Geldstapel „Every year … spend more“:** Big 4 ≈ 151 Mrd. $ (2023) → 246 (2024) → > 400 (2025) → ≈ 720–740 (2026, Plan nach Q3).
- **Uhr „The nearest: seven weeks“:** Der Corona-Crash 2020 (Tiefpunkt nach 33 Tagen) steht bewusst nicht auf der Uhr, und der VO behauptet nichts anderes. Falls Kommentare danach fragen, ist eine Fußnote im Endbild möglich.
- **FDIC-Tafel (optional):** „PER DEPOSITOR, PER BANK, PER OWNERSHIP CATEGORY“.

---

## 4 · Schwerpunkte

### 4a · „what customers pay for artificial intelligence is a fraction of what's being built for it“ → ok, jetzt mit Zahl

- **Gebaut wird:** Nach den Q3-Zahlen (Ende Okt. 2026) planen Amazon, Alphabet, Microsoft und Meta für 2026 zusammen ≈ 720–740 Mrd. $ Investitionen (Amazon 220, Alphabet 195–205, Microsoft ≈ 170 nach Senkung von 175, Meta 135–145). J.P. Morgan AM nennt eine Analystenschätzung von ≈ 697 Mrd. $ für fünf US-Firmen; das wären ≈ 93 % ihres operativen Cashflows (2023: 33 %).
- **Gezahlt wird:**
  - OpenAI: ≈ 50 Mrd. $ Jahresrate Ende Sept. 2026 (CNBC und Bloomberg, 8.10.2026; ein früher berichteter Wert von 70 Mrd. $ war hochgerechnet).
  - Anthropic: 65 Mrd. $ Jahresrate Ende Juli 2026, laut Bloomberg vorläufig und brutto inkl. Verkäufe über Cloud-Partner.
  - Zusammen sind das ≈ 115 Mrd. $ im Jahr. KI-Umsätze der Cloud-Anbieter kommen hinzu, sind aber nicht sauber ausgewiesen und zum Teil dieselben Dollar, weil die Labore dort Rechenzeit mieten.
- Alle gefundenen Gegenüberstellungen sehen die Einnahmen deutlich unter den Ausgaben: J.P. Morgan (für 10 % Rendite wären ≈ 650 Mrd. $ KI-Umsatz pro Jahr nötig), Goldman, Sequoia/Cahn.
- **Urteil:** „a fraction“ stimmt (grob ein Sechstel bis ein Drittel, je nach Zählweise). Umstritten ist nur die Abgrenzung: Jahresrate oder Umsatz, und was als KI-Umsatz zählt. Im VO ist keine Änderung nötig. Steht eine Zahl im Bild, dann „run rate“ und Quelle dazuschreiben.
- Quellen: [CNBC, Amazon Q3 2026](https://www.cnbc.com/2026/10/29/amazon-amzn-q3-earnings-report-2026.html) · [mlq.ai: 2026-Capex 720–745 Mrd. $](https://mlq.ai/news/big-techs-2026-capex-range-reaches-720-billion-to-745-billion/) · [J.P. Morgan AM: How is AI being monetized](https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/market-updates/on-the-minds-of-investors/how-is-ai-being-monetized) · [CNBC 8.10.2026, OpenAI](https://www.cnbc.com/2026/10/08/open-ai-revenue-nvidia-oracle-coreweave.html) · [Bloomberg 8.10.2026](https://www.bloomberg.com/news/articles/2026-10-08/openai-s-annualized-revenue-nears-50-billion-ft-says) · [Axios 8.10.2026, Buchungsunterschied OpenAI/Anthropic](https://www.axios.com/2026/10/08/openai-50-billion-arr-anthropic-revenue-accounting) · [Tom's Hardware zu J.P. Morgan, 650 Mrd. $](https://www.tomshardware.com/tech-industry/artificial-intelligence/usd650-billion-in-annual-revenue-required-to-deliver-10-percent-return-on-ai-buildout-investment-j-p-morgan-claims-equivalent-to-usd35-payment-from-every-iphone-user-or-usd180-from-every-netflix-subscriber-in-perpetuity)

### 4b · 5.11.2026 und „it was never pulled“ → ok

- S&P 500 −4,36 % auf 7.353,73 · Nasdaq −5,52 % auf 24.315,00 · Dow −1.833 Pkt. (−3,4 %).
- Tech-Aktien verloren „mehr als 2 Bio. $“ (NPR), CNN nennt 2,5 Bio. $. Es war der schwächste Tag seit April 2025.
- Die marktweite Notbremse löst Stufe 1 erst bei −7 % gegenüber dem Vortagesschluss aus (15 Minuten Pause, nur vor 15:25 Uhr). Der Schluss lag bei −4,36 %. Das Tagestief ist nirgends beziffert, lag laut Live-Berichten aber nur leicht unter dem Schluss. Keine Quelle meldet eine marktweite Pause in den USA (in Korea griff am 6.11. eine).
- Die −7,3 % des IT-Sektors zählen nicht, maßgeblich ist der S&P 500.
- Quellen: [CNN 5.11.2026](https://www.cnn.com/2026/11/05/investing/tech-heavy-nasdaq-plunges) · [CNBC Live 5.11.2026](https://www.cnbc.com/2026/11/04/stock-market-today-live-updates.html) · [Spectrum/AP](https://spectrumlocalnews.com/us/snplus/business/2026/11/05/stock-market-ai-chip-selloff) · [investor.gov: Circuit Breakers](https://www.investor.gov/news-alerts/investor-bulletins/measures-address-market-volatility)

### 4c · Die Uhr und die Ausgänge → alles ok

| Ausgang | Rekord (Schluss) | Tief (Schluss) | Tage | VO-Wort | wieder Rekord |
|---|---|---|---|---|---|
| tariff crash | 19.2.2025 | 8.4.2025 (−18,9 %) | 48 = 6,9 Wochen | „seven weeks“ ✓ | 27.6.2025 |
| rate shock | 3.1.2022 | 12.10.2022 (−25,4 %) | 282 | ✓ | 19.1.2024 |
| financial crisis | 9.10.2007 | 9.3.2009 (−56,8 %) | 517 | ✓ | 28.3.2013 |
| dot-com bubble | 24.3.2000 | 9.10.2002 (−49,1 %) | 929 = 2,54 Jahre | „two and a half years“ ✓, „longest this century“ ✓ | 30.5.2007 = 4,6 J. nach dem Tief: „almost five more years“ ✓ |
| Uhr heute | 6.10.2026 (7.818,93) | – | 5.11. = Tag 30, 6.11. = Tag 31 | ✓ | – |

Die Tage sind selbst nachgerechnet (Kalendertage, Schlusskurse). Quellen: [CNBC 6.10.2026](https://www.cnbc.com/2026/10/06/chart-a-look-at-the-sp-500s-remarkable-and-defiant-trip-a-new-record.html) · [S&P-Meilensteine (Wikipedia-Spiegel)](https://wiki.riteme.site/wiki/Closing_milestones_of_the_S%26P_500) · [AP/Spokesman 31.5.2007](https://www.spokesman.com/stories/2007/may/31/markets-soar-on-fed-minutes/).

Zölle: Am 9.4.2025 kam die 90-Tage-Pause für die höheren Länderzölle (außer China; 10 % Basiszoll blieb). Der S&P stieg +9,52 %, der beste Tag seit Okt. 2008 („since the financial crisis“ ✓). 2022: Die Inflation lag im Juni bei 9,1 %, dem höchsten Wert seit Nov. 1981 („forty years“ ✓).

### 4d · Das Loch: Ist „None of the three nets reaches it“ fair? → vertretbar vereinfacht (Ampel: umstritten)

- **Fair:** Die Hyperion-Schulden (≈ 27,3 Mrd. $ Anleihen der Zweckgesellschaft Beignet Investor LLC) liegen bei Vermögensverwaltern und deren Anlegern, v. a. PIMCO (≈ 18 Mrd. $) und BlackRock (> 3 Mrd. $), nicht bei Banken.
  - Einlagensicherung: Sie schützt nur Bankeinlagen, nicht Anleihen oder Fondsanteile.
  - Notbremse: Sie gilt nur für den Aktienhandel; diese Anleihen werden außerbörslich gehandelt.
  - Stresstest: Die Fed prüft Banken; Fonds und Versicherer bekommen keinen vergleichbaren Test.
- **Einschränkung 1:** Notbremse und Einlagensicherung schützen auch keinen Bankkredit an ein Rechenzentrum. Der echte Unterschied zwischen Bank- und Nicht-Bank-Schulden liegt also vor allem beim Stresstest und bei der Aufsicht. „no brake“ ist eher ein rhetorisches drittes Glied.
- **Einschränkung 2:** Banken sind über Kredite an Privatkredit-Fonds mittelbar beteiligt. Die Fed hat das 2025 in einer Zusatzanalyse („exploratory analysis“, ohne Kapitalfolgen) durchgespielt; 2026 ist es Prüfschwerpunkt. Laut Fed-Finanzstabilitätsbericht (Mai 2026) wuchsen die Kreditzusagen der Banken an andere Finanzfirmen auf 2,6 Bio. $.
- **Urteil:** Für „it“, also diese Schulden außerhalb der Banken, stimmt der Satz. Sicherer ist K1 („was built for it“).
- Quellen: [Meta-Pressemitteilung, Okt. 2025](https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Announces-Joint-Venture-with-Funds-Managed-by-Blue-Owl-Capital-to-Develop-Hyperion-Data-Center/default.aspx) · [Bisnow: „off its books“](https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490) · [Fed: Exploratory Analysis, Feb. 2025](https://federalreserve.gov/publications/february-2025-exploratory-analysis-of-risks-to-the-banking-system.htm) · [Fed FSR Mai 2026, Leverage](https://www.federalreserve.gov/publications/2026-may-financial-stability-report-leverage.htm) · [OFR Brief 26-02](https://www.financialresearch.gov/briefs/files/OFRBrief-26-02-measuring-counterparty-exposures-private-credit.pdf) · [Morgan Stanley: Bridging the Data Center Gap](https://prod-mssip.morganstanley.com/content/dam/msdotcom/en/assets/pdfs/Research_Bridging-Data-Center-Gap.pdf)

### 4e · Clips C1 (Powell) und C3 (Hassabis) → ok, Wortlaut am Ton offen

- **C1:** Der Wortlaut in `clips.json` stammt laut Recherche aus den offiziellen Untertiteln (= Fed-Transkript). Das PDF ist hier gesperrt, aber der Kernsatz („clearly one of the big sources of growth in the economy“) ist in CNBC und Yahoo bestätigt. Davor stellte Guida die Frage zur „sudden contraction“ (→ M1). „He also said … real profits“ stammt aus derselben Antwort: „they actually have earnings … business models and profits“, Dotcom: „ideas rather than companies“ ✓.
- **C3:** Veröffentlicht am 16.12.2025, die Frage lautete wörtlich „What happens if there is a bubble and it bursts?“ ✓. Die Kernaussage („overhyped in the short term … still underappreciated in the medium to long term“) ist durch Berichte bestätigt. Automatische und manuelle Untertitel weichen in Füllwörtern ab, deshalb die eingebrannten Untertitel nach Gehör setzen.

---

## 5 · Klingt etwas nach Finanzberatung?

Kein Satz rät zu Kauf, Verkauf oder Umschichten. Grenzwertig, aber gedeckt:

1. **Schutz 1:** „So the first protection isn't a move. It's a pause.“ und „In the loudest week, you don't have to decide anything big.“ Zusammen mit den Fidelity-Zahlen (Gebliebene +50 %, Rückkehrer +25 %, Draußengebliebene +2 %) liest sich das als indirektes „nicht verkaufen“. Abgefedert ist es durch „This isn't financial advice. It's what happened to people who decided in the panic.“ direkt danach. Diesen Satz und die Tafel NOT FINANCIAL ADVICE unbedingt behalten.
2. **Schutz 2:** „Find out what your fund holds…“ ist Information, kein Rat zum Umschichten; „Knowing isn't a move“ sagt das ausdrücklich ✓.
3. **Schutz 3:** „a buffer“ ist ein allgemeiner Spargedanke, keine Anlageberatung. Es gibt keine Sparregel wie „drei Monate“ ✓.
4. **Tag 1.000:** „without knowing the name of a single stock“ ist eher das Gegenteil eines Anlagetipps ✓.

---

## 6 · Vollständige Aussagen-Tabelle (vo-v3, in Sprechreihenfolge)

| # | Aussage (VO) | Urteil | Quelle | Anmerkung |
|---|---|---|---|---|
| 1 | „On Thursday, November fifth, tech stocks lost more than two trillion dollars in a single day.“ | ok | [CNN 5.11.2026](https://www.cnn.com/2026/11/05/investing/tech-heavy-nasdaq-plunges) · [NPR 5.11.2026](https://www.npr.org/2026/11/05/nx-s1-6031987/stock-markets-ai-midterm-elections) | 5.11.2026 = Donnerstag. NPR: „$2 trillion rout in tech stocks“; CNN 2,5 Bio. $; NBC: Nasdaq-100 2,3 Bio. $. |
| 2 | „Nobody knows yet if this is the crash.“ | ok | [Motley Fool 3.11.2026](https://www.fool.com/investing/2026/11/03/the-s-and-p-500-fell-in-both-september-and-october-for-only-the-17th-time-since-1950-here-s-what-usually-followed/) · CNBC | S&P am 5.11. ≈ 6 % unter Rekord (noch keine Korrektur), Nasdaq ≈ 12 % (Korrektur). Kein Bärenmarkt. |
| 3 | „…its clock didn't start on November fifth. That was already day thirty.“ | ok | eigene Rechnung | 6.10. → 5.11.2026 = 30 Kalendertage. |
| 4 | „It started at the market's last record high: October sixth.“ | ok | [CNBC 6.10.2026](https://www.cnbc.com/2026/10/06/chart-a-look-at-the-sp-500s-remarkable-and-defiant-trip-a-new-record.html) | S&P-500-Rekordschluss 7.818,93, seither kein höherer Schluss; Nasdaq-Rekord ebenfalls am 6.10. Dow unklar → Tafel „S&P 500“. |
| 5 | „And the road ahead has four exits. At each one, an earlier crash hit bottom.“ | ok | [S&P-Meilensteine (Spiegel)](https://wiki.riteme.site/wiki/Closing_milestones_of_the_S%26P_500) | Schluss-Tiefs 8.4.2025, 12.10.2022, 9.3.2009, 9.10.2002. 2020 (Tag 33) bewusst nicht auf der Uhr. |
| 6 | „The tariff crash. The rate shock. The financial crisis. The dot-com bubble.“ | ok | – | Namen; „rate shock“ ist unsere Bezeichnung, kein fester Begriff. |
| 7 | „The nearest: seven weeks in.“ | ok | eigene Rechnung | 48 Tage = 6,9 Wochen. |
| 8 | „The farthest: two and a half years in. The longest this century.“ | ok | eigene Rechnung · Faktenzettel F11 | 929 Tage = 2,54 Jahre; längster S&P-Fall seit 2000 (2008: 517 Tage). Vor 1950 gab es längere, das wird nicht behauptet. |
| 9 | „Mostly, data centers.“ | ok | [J.P. Morgan AM](https://am.jpmorgan.com/us/en/asset-management/institutional/insights/market-insights/market-updates/on-the-minds-of-investors/how-is-ai-being-monetized) | Der Großteil der KI-Ausgaben geht in Rechenzentren (Chips, Gebäude, Strom). |
| 10 | „Every year, the biggest tech companies spend more on them.“ | ok | [CNBC 30.4.2026](https://www.cnbc.com/2026/04/30/ai-boom-big-tech-capital-expenditures-now-seen-topping-1-trillion-in-2027-.html) · [mlq.ai](https://mlq.ai/news/big-techs-2026-capex-range-reaches-720-billion-to-745-billion/) · [FT via texxr](https://texxr.com/882192) | Big 4 ≈ 151 Mrd. $ (2023) → 246 (2024) → > 400 (2025) → ≈ 720–740 (2026). 2023 lag knapp unter 2022; „every year“ gilt für den Boom. |
| 11 | „A year before all this, America's top central banker was asked what a sudden stop in that spending would mean.“ | **zu stark** → M1 | [Fed-Transkript 29.10.2025](https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20251029.pdf) | Gefragt wurde nach „sudden contraction in tech investment“. Der 29.10.2025 liegt knapp ein Jahr vor dem 6.10. bzw. 5.11.2026 ✓. |
| 12 | [CLIP C1] Powell: „…it's clearly one of the big sources of growth in the economy.“ | ok | [Fed-Transkript](https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20251029.pdf) · [CNBC 29.10.2025](https://www.cnbc.com/2025/10/29/powell-says-ai-different-from-dotcom-bubble-major-source-gdp-growth.html) | Laut Recherche an den offiziellen Untertiteln geprüft, hier nicht erneut abrufbar. Kernsatz in Berichten bestätigt. |
| 13 | „He also said that today's giants, unlike the dot-coms, make real profits.“ | ok | [Fortune 29.10.2025](https://fortune.com/2025/10/29/powell-says-ai-is-not-a-bubble-unlike-dot-com-federal-reserve-interest-rates/) | „I won't go into particular names, but they actually have earnings“; Dotcom „ideas rather than companies“. |
| 14 | „But so far, what customers pay for artificial intelligence is a fraction of what's being built for it.“ | ok | siehe 4a | 2026: ≈ 700+ Mrd. $ Investitionen gegen OpenAI ≈ 50 + Anthropic ≈ 65 Mrd. $ Jahresrate. Abgrenzung umstritten. |
| 15 | „So more and more of it runs on borrowed money.“ | ok | [KC Fed](https://www.kansascityfed.org/research/economic-bulletin/beyond-valuations-long-term-financial-risks-from-the-ai-build-out/) · J.P. Morgan AM | Anleihen von KI-Firmen 2026 bis dato ≈ 330 Mrd. $ (≈ 10× 2023); Capex 2026 ≈ 93 % des operativen Cashflows. |
| 16 | „Of all the American company debt rated safe, artificial intelligence firms owed two cents on the dollar three years ago. Now they owe ten.“ | **falsch** → M2 | [KC Fed](https://www.kansascityfed.org/research/economic-bulletin/beyond-valuations-long-term-financial-risks-from-the-ai-build-out/) | Gemessen ist der Anteil an Neuemissionen, nicht am Bestand; „rated safe“ ist zu stark. |
| 17 | „And debt turns a slowdown into a problem: the payments come due either way.“ | ok | KC Fed (Suchauszug) | Logik. KC Fed: Schulden statt Eigenkapital erhöhen das Risiko, dass Stress auf die Wirtschaft übergreift. |
| 18 | „In China, Reuters says, the bubble has already burst.“ | ok | [Reuters via TradingView, 26.10.2026](https://www.tradingview.com/news/reuters.com,2026:newsml_L6N46C0R0:0-in-china-the-ai-bubble-has-already-burst/) | Reuters-Titel: „In China, the AI bubble has already burst“. Die Wertung kommt von Reuters (Gegenstimme: Global Times). |
| 19 | „The main index of artificial intelligence stocks there lost about forty percent in under four months.“ | ok | ebd. · [Kathmandu Post (Reuters-Nachdruck)](https://kathmandupost.com/world/2026/10/27/in-china-the-ai-bubble-has-already-burst) | „STAR 50 index of AI and semiconductor companies down 40 percent in less than four months“, ≈ 480 Mrd. $, Stand 26.10. |
| 20 | „Day thirty-one.“ | ok | eigene Rechnung | = 6.11.2026. |
| 21 | „But in the financial crisis, almost nobody ran.“ | ok | Fidelity (Nr. 23) | Belegt für 401(k)-Sparer, siehe K4. |
| 22 | „Fidelity, one of America's biggest retirement providers, tracked its savers through the panic.“ | ok | [CBS News 2011](https://www.cbsnews.com/news/study-401k-investors-who-stayed-the-course-in-2008-09-were-big-winners/) | Größter 401(k)-Anbieter; Auswertung von 7,1 Mio. Konten. |
| 23 | „Fewer than two in a hundred moved everything out of stocks.“ | ok | [InvestmentNews](https://www.investmentnews.com/retirement-planning/401k-holders-who-bailed-on-stocks-in-2008-made-out-worse-fidelity/38251) · Fidelity 2016 | ≈ 117.000 von 7,1 Mio. = 1,6 % (Okt. 2008 bis März 2009); Fidelity 2016: ≈ 1,5 %. |
| 24 | „A couple of years later, the balances of those who stayed had grown by about half.“ | ok | CBS · [Seattle Times](https://www.seattletimes.com/business/dumping-stocks-in-2008-hurt-401k-savers-says-fidelity/) | +50 % bis 30.6.2011, inkl. Einzahlungen (steht auf der Tafel). |
| 25 | „Those who sold and came back later: about a quarter.“ | ok | CBS · InvestmentNews | +25 %. |
| 26 | „Those who left and stayed out: about two percent.“ | ok | ebd. | +2 %. „Zwei“ kommt zweimal vor (Anteil der Sparer und Kontozuwachs); die Tafel trennt das. |
| 27 | „This isn't financial advice. It's what happened to people who decided in the panic.“ | ok | – | Richtige Einordnung. |
| 28 | „Day forty-eight: the tariff crash.“ | ok | S&P-Meilensteine · [Fortune 7.4.2025](https://fortune.com/2025/04/07/stock-market-sp-500-bear-market-territory-trump-tariffs-global-market-meltdown/) | 6.144,15 → 4.982,77, −18,9 %, 48 Tage. |
| 29 | „In twenty twenty-five, wave after wave of new tariffs shook markets around the world.“ | ok | [ABC/AP 9.4.2025](https://abcnews.go.com/Business/wireStory/latest-sp-500-soars-95-biggest-gains-wwii-120624593) | Febr. bis Apr. 2025: Kanada/Mexiko/China, Stahl/Alu, Autos, 2.4. „Liberation Day“; S&P −12 % in vier Tagen. |
| 30 | „Here, in April, the fall stopped.“ | ok | ebd. | Schluss-Tief 8.4.2025 (Intraday-Tief 7.4.). |
| 31 | „The very next day, many of the new tariffs were put on hold.“ | ok | ebd. · [Russell, Apr. 2025](https://russellinvestments.com/content/ri/nz/en-gb/insights/russell-research/2025/04/tariff-pause-one-day-relief.html) | 9.4.2025: 90-Tage-Pause für die höheren Länderzölle außer China; der 10-%-Basiszoll blieb. |
| 32 | „And the market had its best day since the financial crisis.“ | ok | [Yahoo/Reuters](https://finance.yahoo.com/news/p-500-best-day-since-214659533.html) | S&P +9,52 %, größter Tagesgewinn seit Okt. 2008. |
| 33 | „Then it reaches people who never owned a single share.“ | ok | – | Schlussfolgerung, im Film über Rente und Lohn belegt. |
| 34 | „Yet if your pension follows the whole market, you own a piece of this boom anyway.“ | ok | Faktenzettel F17 | Als Bedingung formuliert; Nvidia ≈ 8 % des S&P 500. |
| 35 | „In May, just two memory-chip companies made about a sixth of the whole world stock market's gains.“ | ok | [Acadian, Juni 2026](https://www.acadian-asset.com/investment-insights/owenomics/the-whirlwind-is-upon-us) · [Patrick Boyle, 22.8.2026](https://www.youtube.com/watch?v=wTiYaWFP59Q) | Micron und SK Hynix: ≈ 17 % der MSCI-ACWI-Rendite im Mai 2026 (0,9 von 5,2 Prozentpunkten). Heute nicht erneut auffindbar (der Faktenzettel hatte Original und zwei Spiegel), daher Ampel dünn. „In May“ = Mai 2026 ✓. |
| 36 | „When the dot-com bubble burst, money for young companies halved within a year.“ | ok | [MoneyTree 2002](https://de.slideshare.net/mensa25/venture-capital-investing-flat-in-q4-2002full-year-2002-finishes-at-1998-level) · [Fed-Chart (MoneyTree)](https://www.federalreserve.gov/BoardDocs/RptCongress/smallbusinesscredit/figure7.htm) | US-Wagniskapital ≈ 105 Mrd. $ (2000) → 41 (2001) → 21 (2002). Eher vorsichtig formuliert. |
| 37 | „Picture a surprise bill of four hundred dollars. In America, only about six in ten adults could pay it right away from their own money.“ | ok | [Fed SHED 2025](https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-savings-investments.htm) · [Pressemitteilung (Mondo Visione)](https://mondovisione.com/media-and-resources/news/federal-reserve-board-issues-economic-well-being-of-us-households-in-2025-repo-2026513/) | 63 %, „cash or its equivalent“ (inkl. Kreditkarte, die zur nächsten Abrechnung voll bezahlt wird); Umfrage Okt. 2025, veröffentlicht 13.5.2026. |
| 38 | „Families with even a few hundred dollars set aside were less likely to fall behind on rent.“ | ok | [Urban Institute](https://www.urban.org/features/why-cities-should-care-about-family-financial-security) · [Money.com](https://money.com/saving-as-little-as-250-could-help-keep-you-afloat) | 250–749 $ Erspartes: nach einem Einkommensschock seltener Wohn- oder Nebenkosten verpasst und seltener geräumt (SIPP 2009–2012). Ein Zusammenhang, kein Kausalbeweis. |
| 39 | „Day two hundred eighty-two: the rate shock.“ | ok | S&P-Meilensteine | 4.796,56 → 3.577,03, −25,4 %, 282 Tage. |
| 40 | „In twenty twenty-two, prices rose faster than in forty years…“ | ok | [BLS](https://www.bls.gov/opub/ted/2022/consumer-prices-up-9-1-percent-over-the-year-ended-june-2022-largest-increase-in-40-years.htm) | 9,1 % im Juni 2022, höchster Anstieg seit Nov. 1981. |
| 41 | „…and interest rates shot up to cool them.“ | ok | [Fed: Open Market Operations](https://www.federalreserve.gov/monetarypolicy/openmarket.htm) | 2022 von 0–0,25 % auf 4,25–4,5 % (sieben Erhöhungen). |
| 42 | „The fall stopped here.“ | ok | – | 12.10.2022. |
| 43 | „Day five hundred seventeen: the financial crisis.“ | ok | S&P-Meilensteine | 1.565,15 → 676,53, −56,8 %, 517 Tage. |
| 44 | „Banks had piled up bets on risky home loans.“ | ok | [CEPR/VoxEU](https://cepr.org/voxeu/columns/what-happened-us-interbank-lending-financial-crisis) | Subprime-Kredite und verbriefte Papiere. |
| 45 | „When one giant bank collapsed, lending froze around the world.“ | ok | [ADB: Great Liquidity Freeze](https://www.adb.org/publications/great-liquidity-freeze-what-does-it-mean-international-banking) · [NY Fed SR 437](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr437.html) | Lehman Brothers (Investmentbank), 15.9.2008, größte Pleite der US-Geschichte. Vereinfacht, siehe K6. |
| 46 | „It hit bottom here.“ | ok | – | 9.3.2009. |
| 47 | „Day nine hundred twenty-nine: the dot-com bubble.“ | ok | S&P-Meilensteine | 1.527,46 → 776,76, −49,1 %, 929 Tage. |
| 48 | „The crash this boom gets compared to most.“ | ok | Fortune (Powell 29.10.2025) | Einordnung; selbst Powell zog den Vergleich. |
| 49 | „Back then, the market paid billions for websites that had never made a profit.“ | ok | [CNBC: IPO Flops of the Dot-Com Days](https://www.cnbc.com/2012/05/17/Failed-IPOs-of-the-Dot-Com-Bubble.html) | Webvan: beim Börsengang 1999 ≈ 4,8 Mrd. $ wert (am ersten Tag kurz mehr), nie profitabel, 2001 pleite. |
| 50 | „In October two thousand two, the fall finally stopped.“ | ok | S&P-Meilensteine | 9.10.2002. |
| 51 | „The climb back took almost five more years.“ | ok | [AP/Spokesman 31.5.2007](https://www.spokesman.com/stories/2007/may/31/markets-soar-on-fed-minutes/) | Rekordschluss 30.5.2007 (1.530,23) = 4,6 Jahre nach dem Tief. Kursindex ohne Dividenden. |
| 52 | „In two thousand one, Google turned its first full-year profit.“ | ok | [Google S-1, SEC](https://sec.gov/Archives/edgar/data/1288776/000119312504131481/ds1.htm) | ≈ 7 Mio. $ Gewinn bei 86 Mio. $ Umsatz; 2000 noch Verlust. |
| 53 | „Wikipedia, LinkedIn, Skype, Facebook, YouTube: all of them started before the market had climbed back.“ | ok | [YouTube-Gründung](https://www.westporttechmuseum.com/blogs/techtastic/today-in-internet-history-february-14th-2005-youtube-was-founded) · [erstes Video](https://www.networkworld.com/article/2224657/the-first-video-ever-uploaded-to-youtube.html) · Faktenzettel F27 | Wikipedia 15.1.2001 · LinkedIn 5.5.2003 · Skype Aug. 2003 · Facebook 4.2.2004 · YouTube Domain 14.2.2005, erstes Video 23.4.2005, Start Mai bzw. Dez. 2005. Alle vor dem 30.5.2007 ✓. |
| 54 | „Not in the boom. In the hangover.“ | ok | – | Alle nach dem Hoch vom März 2000. |
| 55 | „Today, the price of using artificial intelligence keeps falling: for the same result, roughly ten times cheaper every year.“ | ok | [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends) · [a16z](https://www.a16z.com/llmflation-llm-inference-cost) · [Gundlach u. a. 2025](https://arxiv.org/abs/2511.23455) | a16z ≈ 10× pro Jahr; MIT-Studie 5–10×; Epoch 9–900× je nach Aufgabe; Epoch Sept. 2026 laut Sekundärbericht ≈ 13×. „For the same result“ ist die nötige Einschränkung, denn Spitzenmodelle selbst werden teurer. |
| 56 | „In the early nineteen-thirties, thousands of American banks failed, and with them, people's savings.“ | ok | [FDIC (Archiv): The 1930s](https://webarchive.library.unt.edu/eot2008/20090513012935/https:/www.fdic.gov/about/learn/learning/when/1930s.html) | ≈ 9.000 Banken 1930–33; Einleger verloren ≈ 1,3 Mrd. $. |
| 57 | „So in nineteen thirty-three, America decided to insure bank deposits.“ | ok | [FDIC: Brief History](https://www.fdic.gov/resources/publications/brief-history-of-deposit-insurance/book/brief-history-deposit-insurance-3.pdf) | Banking Act 1933 (16.6.1933); Schutz ab 1.1.1934. |
| 58 | „Since then, no one has lost a single cent of insured money.“ | ok | [FDIC „Never lose a penny“ (Archiv)](https://webarchive.library.unt.edu/web/20121010051459/https://www.fdic.gov/deposit/deposits/penny/index.html) | FDIC: Seit dem 1.1.1934 hat kein Einleger einen Cent versicherter Einlagen verloren. |
| 59 | „If your bank failed tomorrow, up to two hundred fifty thousand dollars of your money there would be safe.“ | ok | FDIC · [Semafor 25.3.2026](https://www.semafor.com/article/03/25/2026/lawmakers-introduce-revamped-bipartisan-deposit-insurance-bill) | 250.000 $ je Einleger, Bank und Eigentumskategorie; der Gesetzentwurf von 2026 zur Erhöhung ist nur eingebracht. Gilt nur in den USA und nur für Einlagen, siehe K3. |
| 60 | „On Black Monday in nineteen eighty-seven, the Dow lost almost a quarter in a single day.“ | ok | [CNBC](https://www.cnbc.com/amp/id/100104087) | 19.10.1987: −22,6 % (508 Pkt.). Gerundet, exakt siehe K2. |
| 61 | „After that, the stock market got an emergency brake. If prices fall too far in one day, trading stops.“ | ok | [investor.gov](https://www.investor.gov/news-alerts/investor-bulletins/measures-address-market-volatility) | Nach dem Brady-Bericht 1988 eingeführt. Heute: S&P −7 % bzw. −13 % → 15 Minuten Pause (vor 15:25 Uhr), −20 % → Rest des Tages. |
| 62 | „In March twenty twenty, as the pandemic hit, it was pulled four times in under two weeks.“ | ok | [WEF, März 2020](https://weforum.org/stories/2020/03/stock-market-volatility-coronavirus) · [Motley Fool](https://www.fool.com/investing/2022/07/08/circuit-breakers-emergency-brakes-for-the-stock-ma/) | 9., 12., 16. und 18.3.2020 (innerhalb von 9 Tagen); davor zuletzt 1997. |
| 63 | „Each time, everyone got fifteen minutes to breathe.“ | ok | investor.gov | Alle vier waren Stufe 1, also 15 Minuten. |
| 64 | „On November fifth, it was never pulled.“ | ok | CNN · CNBC · investor.gov | Schluss −4,36 %, Schwelle −7 %; keine Meldung einer Pause (siehe 4b). |
| 65 | „After the financial crisis came the third net: stress tests.“ | ok | [Fed-Stresstests 2026](https://www.federalreserve.gov/publications/2026-june-dodd-frank-act-stress-test-results.htm) | SCAP 2009, danach Dodd-Frank-Tests (DFAST/CCAR). |
| 66 | „Every year, regulators play out a nightmare crash on paper, and check whether the biggest banks would survive it.“ | ok | [Fed-Pressemitteilung 24.6.2026](https://www.federalreserve.gov/newsevents/pressreleases/bcreg20260624a.htm) | 2026: 32 Banken, Szenario 10 % Arbeitslosigkeit und BIP −4,6 %; alle blieben über dem Mindestkapital. Kleinere Großbanken (Kategorie IV) nur alle zwei Jahre, die größten jährlich ✓. |
| 67 | „Three crashes. Three nets.“ | ok | – | Bankenkrise 1930–33 → 1933 · Black Monday → 1988 · Finanzkrise → 2009. |
| 68 | „A growing part of the debt behind the data centers was never borrowed from a bank.“ | ok | [Morgan Stanley](https://prod-mssip.morganstanley.com/content/dam/msdotcom/en/assets/pdfs/Research_Bridging-Data-Center-Gap.pdf) | Morgan Stanley: Finanzierungslücke ≈ 1,5 Bio. $ bis 2028, größter Teil ≈ 800 Mrd. $ Privatkredit; Zweckgesellschaften gelten als bevorzugter Weg. Größe umstritten, „growing“ ist vorsichtig. |
| 69 | „Take one giant data center in Louisiana, built for Meta.“ | ok | [Meta-Pressemitteilung](https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Announces-Joint-Venture-with-Funds-Managed-by-Blue-Owl-Capital-to-Develop-Hyperion-Data-Center/default.aspx) | Hyperion, Richland Parish. |
| 70 | „About twenty-seven billion dollars of its debt sits in a separate company, mostly owned by an investment firm.“ | ok | Meta-Pressemitteilung · [Bisnow](https://www.bisnow.com/national/news/data-center-capital-markets/meta-pushes-its-largest-data-center-project-off-its-books-with-27b-joint-venture-131490) | Beignet Investor LLC, ≈ 27,3 Mrd. $ Anleihen (A+); die Gemeinschaftsfirma gehört zu 80 % Blue-Owl-Fonds, zu 20 % Meta. Käufer v. a. PIMCO und BlackRock. |
| 71 | „Not on Meta's own books.“ | ok | Bisnow · Meta-Pressemitteilung | Nicht konsolidiert. Meta hält 20 % und trägt eine gedeckelte Restwertgarantie (16 Jahre); das steht nur im Bild. |
| 72 | „None of the three nets reaches it: no insurance, no brake, no stress test like the banks get.“ | ok | [Fed: Exploratory Analysis 2025](https://federalreserve.gov/publications/february-2025-exploratory-analysis-of-risks-to-the-banking-system.htm) · [Fed FSR Mai 2026](https://www.federalreserve.gov/publications/2026-may-financial-stability-report-leverage.htm) | Vertretbar vereinfacht, siehe 4d und K1. |
| 73 | „Every one of these nets was built after the damage. This one could be built before.“ | ok | – | 1933, 1988 und 2009 jeweils nach dem Schaden; der zweite Satz ist Meinung. |
| 74 | „Lawmakers and regulators decide it.“ | ok | [MLex zur KC Fed](https://www.mlex.com/mlex/financial-services/articles/2534229) | Die KC Fed schlägt mehr Offenlegung vor (passt zu „making that debt visible“). |
| 75 | „If this is the crash, and it runs like the longest one, the fall is behind you now.“ | ok | – | Tag 1.000 > 929; Bild: NOT A FORECAST. |
| 76 | „Demis Hassabis runs Google DeepMind.“ | ok | – | Mitgründer und CEO. |
| 77 | „Last December, he was asked what happens if there's a bubble and it bursts.“ | ok | [Video 16.12.2025](https://www.youtube.com/watch?v=PqVbypvxDto) · [Yahoo Finance](https://finance.yahoo.com/news/sustainable-says-deepmind-ceo-demis-200153208.html) | Frage wörtlich „What happens if there is a bubble and it bursts?“. Bei Upload im Nov. 2026 meint „Last December“ den Dez. 2025 ✓; Aufnahmetag offen (K5). |
| 78 | [CLIP C3] Hassabis: „…overhyped in the short term … underappreciated in the medium to long term…“ | ok | ebd. | Kernaussage bestätigt; Wortlaut der Untertitel am Ton prüfen. |
| 79 | „He builds this technology, so weigh his words. But the dot-com bubble went that way, too.“ | ok | – | Eigeninteresse benannt. Die Einordnung stimmt: Das Internet wuchs nach 2000 weiter. |
| 80 | „A crash puts a new price on a technology. It doesn't take the technology away.“ | ok | – | These, gestützt durch den Dotcom-Teil (Nr. 51–54). |
| 81 | „If the last few years are any guide, on day one thousand, artificial intelligence is cheaper than today, and everywhere.“ | ok | Epoch · a16z | Als bedingte Erwartung formuliert. |
| 82 | „…you can stand at the front of it without knowing the name of a single stock.“ | ok | – | Meinung, kein Anlagetipp. |

---

## 7 · Nicht prüfbar oder offen (für den Zweitprüfer)

1. **C1:** Wortlaut am Fed-PDF bzw. Ton. Die Recherche hat die offiziellen Untertitel geprüft; hier ist beides gesperrt.
2. **C3:** Wortlaut am Ton. Automatische und manuelle Untertitel weichen in Füllwörtern ab, die eingebrannten Untertitel nach Gehör setzen. Musik im Podcast an der Stelle prüfen.
3. **Acadian 17 %:** Der Text war heute nicht auffindbar; Beleg ist der Faktenzettel (Original, zwei Spiegel, Patrick-Boyle-Video).
4. **KC Fed:** Am Original prüfen, worauf sich die 2 % und 10 % beziehen (alle Investment-Grade-Emissionen oder nur US-Firmenanleihen). Andere Quellen messen 18–20 %, „ten cents“ bleibt in jedem Fall vorsichtig.
5. **S&P 500 am 5.11.:** Das Tagestief ist nicht beziffert gefunden. Der Schluss lag bei −4,36 %, eine Pause wurde nirgends gemeldet.
6. **Hassabis:** Aufnahmetag des Interviews (veröffentlicht 16.12.2025).
7. **Dow-Rekord am 4.11.2026:** unbestätigt, betrifft nur die Tafel („S&P 500“ ergänzen).
8. **Anthropic 65 Mrd. $:** vorläufig und brutto. Für eine Bildzahl lieber „OpenAI ≈ $50B run rate“ allein oder beide mit „run rate“.

---

## 8 · Nachtrag: C1b Warsh (nur falls als 3. Clip eingebaut)

C1b steht nicht in `vo-v3`/`vo-v4`. Geprüft ist der Einordnungssatz aus `clips.json`: „One week before the sell-off, the new chair of the Federal Reserve, Kevin Warsh, described lenders getting choosier.“

| Punkt | Urteil | Quelle | Anmerkung |
|---|---|---|---|
| Warsh ist „the new chair of the Federal Reserve“ | ok | [CBS: Vereidigung 22.5.2026](https://www.cbsnews.com/news/kevin-warsh-sworn-in-federal-reserve-chair/) | Nachfolger Powells, am 28.10. rund fünf Monate im Amt. |
| Pressekonferenz am 28.10.2026 | ok | [Video](https://www.youtube.com/watch?v=hs8YWtNQQ40) · [Admiral Markets](https://admiralmarkets.com/de/analysen/traders-blog/warsh-pressekonferenz-oktober-2026) | Leitzins gehalten bei 3,75–4 %. |
| „One week before the sell-off“ | ungenau (Kann) | – | Vom 28.10. bis 5.11. sind es 8 Tage. Genau ist „The week before the sell-off“. |
| „described lenders getting choosier“ | zu eng (Kann) | `clips.json` C1b | Er spricht von „market participants … discriminating between the kinds of investments they want to make“. Näher am Wortlaut ist „investors“. |
| Bezug auf KI | Hinweis | `clips.json` C1b, „pruefen“ | Gefragt war nach dem KI-Boom. Er sagt aber „credit spreads for certain assets“, nicht KI- oder Rechenzentrums-Kredite. Weder die Einordnung noch der Schnitt vor „But this boom has a hole in it“ darf ihn als Zeugen für Rechenzentrums-Schulden darstellen. |
| Wortlaut | offen | – | Es gibt nur automatische Untertitel. „gap out“ steht in keinem Textbericht, also am Ton prüfen. |

**Vorschlag:** „The week before the sell-off, the new chair of the Federal Reserve, Kevin Warsh, said investors were getting choosier.“

**Bauchbinde:** „KEVIN WARSH · Chair, Federal Reserve · OCT 28, 2026 · ORIGINAL FOOTAGE“. Powell dann mit Jahr („Chair, Federal Reserve · 2025“), damit es nicht nach zwei Fed-Chefs zugleich aussieht. Z. 19 („America's top central banker was asked…“) bleibt richtig, weil sie in der Vergangenheit steht.
