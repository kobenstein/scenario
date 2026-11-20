# Faktencheck · „You Can Now Buy a Piece of AI“ (Film #59) · geprüft: vo-v2.txt → vo-v3.txt

Stand: Montag, 16.11.2026, vormittags (Wien). Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v2.txt` samt den drei Clip-Untertiteln (C1, C2, C3) und der Zitatkarte Z1, dazu jede Einblendung. Die Veröffentlichung ist für **Di 17.11.2026, 17:00 Wien (11:00 New York)** geplant; alle relativen Zeitwörter sind auf dieses Datum geprüft (3h). Die Zeilennummern gelten für `vo-v2.txt` und `vo-v3.txt` gleich, denn beide haben 173 Zeilen.

**Ergebnis:** 102 Aussagen geprüft (74 im Sprechtext inkl. 3 Clips und Zitatkarte Z1, 28 Einblendungen): **82 grün · 14 gelb · 6 rot**.
- **Ampel:**
  - **grün:** Die Primärquelle bestätigt die Aussage (hier meist das S-1/A No. 2 vom 10.11.2026 im Volltext). Wo es keine Primärquelle gibt, genügen zwei unabhängige Berichte.
  - **gelb:** zugespitzt, ungenau, zeitkritisch oder dünn belegt. Darf bleiben; wo es sich lohnt, steht ein Kann-Vorschlag dabei.
  - **rot:** falsch, unbelegt oder irreführend verkürzt. Das ist eine Muss-Änderung.
- **1 Muss-Änderung im Sprechtext** (Z. 50) ist in `vo-v3.txt` eingearbeitet: +2 Wörter (1.397 → 1.399).
- **5 Muss-Änderungen im Bild** sind ebenfalls in `vo-v3.txt` eingearbeitet (Z. 15, 26, 31, 51, 97). Sonst ist `vo-v3.txt` byte-identisch mit `vo-v2.txt`; Regie-Tags, `[CLIP]`-, `[ZITATKARTE]`- und `[ENDCARD]`-Zeilen sind unverändert.
- **12 Kann-Änderungen** (5 im Sprechtext, 7 im Bild), nicht eingearbeitet.
- **Die wichtigsten Befunde:**
  - **Die Firma selbst nennt den Fahrplan.** Laut IPO-Website (als FWP bei der SEC eingereicht) soll der Preis am 18.11. stehen und der Handel am 19.11. beginnen, „subject to regulatory clearance“. Das BaFin-gebilligte EU-Prospekt vom 11.11. nennt den 19.11. als Handelsbeginn. Die Einblendung „NOT CONFIRMED BY THE COMPANY“ ist damit falsch (MB2).
  - **Die 49,9 % gelten für alle Class-A-Aktien, alte und neue.** Die 825 Mio. angebotenen Aktien sind nur rund 11 % davon, also etwa 5,5 % der Stimmen. Die Gründer halten mit eigenen Class-A-Aktien insgesamt 61,3 % (M1, MB4).
  - **Der Hook-Satz im Prospekt beginnt mit einer Zuschreibung:** „Concerns have been raised both within our organization and by other researchers … that sufficiently advanced AI systems could …“. Die Einblendung zeigte ihn als eigenständigen Satz mit großem „Sufficiently“ (MB1). Der gesprochene Satz bleibt gelb (K1).
  - **„appoint a majority“** steht nicht im S-1/A, aber wörtlich im Anthropic-Beitrag vom 21.10.2026, also der angegebenen Quelle. Die Einblendung stimmt. Der aktuelle Rechtstext lautet „generally has the authority to elect and remove“ (K6).
  - **Ohne Befund:** vier Treuhänder (ein Sitz frei), Ben Bernanke, sieben Gründer und „over ninety pages“ (Risikofaktoren S. 29–122 = 94 Seiten). Ebenso alle Prospekt-Zitate in den Einblendungen, Umsatz, Verluste, Amazon und Google, die Nasdaq- und S&P-Regeln, SpaceX, Warren, Levine und Bengio.

**Quellenlage (wichtig für den Zweitprüfer):**
- **Lokal im Volltext:**
  - `quellen/anthropicpbc-sx1ax2.txt` = S-1/A No. 2, eingereicht am 10.11.2026. Es ist der aktuelle Prospekt; ein S-1/A No. 3 oder 424B gibt es bis heute nicht.
  - `anthropicpbc-fwpipowebsi.txt` = FWP mit IPO-Website, Factsheet und Gründerbrief, datiert 10.11. und eingereicht 12.11.
  - `anthropicpbc-fwpxeeaprospea.txt` = FWP mit EU-Prospekt vom 11.11.
  - Clips: UN-Untertitel (`.vtt`) und Whisper-Wortzeiten (`.words.json`).
  - Seitenzahlen nach dem Inhaltsverzeichnis und den Seitenmarken der Textfassung; ±1 Seite möglich.
- **Websuche** (Suchauszüge, Stand 16.11.): Nachfrage, Bewertung, SpaceX, Indexregeln, Kritiker, Bengio, Börsenlage und Amodeis X-Post. **WebFetch** auf anthropic.com ging (Beitrag vom 21.10.2026 im Volltext).
- **Gesperrt** (ENOTFOUND): `www.clickondetroit.com` (AP-Text vom 13.11.), `www.schwab.com` und `finance.yahoo.com`. Diese Hosts müssten in den Netzwerkeinstellungen der Sitzung freigegeben werden, wenn die Artikel im Volltext geprüft werden sollen. sec.gov ist aus der Cloud nicht erreichbar; die lokalen Abschriften ersetzen es.

---

## 1 · Muss-Änderungen

### Im Sprechtext (eingearbeitet in vo-v3.txt)

| # | alt (vo-v2) | neu (vo-v3) | Grund | Quelle |
|---|---|---|---|---|
| M1 | Z. 50: „The shares on sale do carry votes. But the document caps them. **All together**, they stay just under half.“ | „The shares on sale do carry votes. But the document caps them. **Old and new together**, they stay just under half.“ (+2 Wörter) | **Irreführend verkürzt, betrifft den Kern des Films.** Die Obergrenze gilt nicht für die angebotenen Aktien, sondern für die ganze Klasse A, also auch für alte Aktien von Investoren, Mitarbeitern und Gründern: „the voting power of the holders of Class A common stock is limited to an aggregate of 49.9%“. <br>Nach dem Börsengang gibt es 7.427.991.791 Class-A-Aktien; die 825 Mio. angebotenen sind davon ~11 %, also **~5,5 % der Stimmen** (eigene Rechnung). Die Gründer halten über eigene Class-A-Aktien weitere 11,2 % und kommen mit der Founder LLC auf **61,3 %**. <br>Wer v2 hört, glaubt, die Käufer bekämen zusammen fast die Hälfte. Mit „Old and new together“ bezieht sich das „just under half“ auf die ganze Klasse. Alternative (+5): „All shares of that kind, old and new, stay just under half.“ | [S-1/A, 10.11.2026](https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm), S. 299 (Fußnote †), S. 111 (61,3 %), S. 19 (Aktienzahlen) |

### Im Bild (eingearbeitet in vo-v3.txt)

| # | Z. | jetzt (vo-v2) | neu (vo-v3) | Grund · Quelle |
|---|---|---|---|---|
| MB1 | 15 | „Sufficiently advanced AI systems could, if not developed, deployed, and operated with appropriate safeguards, oversight, and security measures, pose catastrophic or existential risks to humanity …“ · Anthropic, IPO prospectus (Form S-1), Risk Factors | „**Concerns have been raised both within our organization and by other researchers … that sufficiently** advanced AI systems could, if not developed, deployed, and operated with appropriate safeguards, oversight, and security measures, pose catastrophic or existential risks to humanity …“ · Anthropic, IPO prospectus (**Form S-1/A, Nov 10, 2026**), Risk Factors | **Zitat nicht wortgetreu.** Der Satz beginnt im Prospekt mit einer Zuschreibung. v2 schnitt sie ab, ohne „…“, und setzte das „S“ groß; so stand eine Firmenaussage im Bild, die als Bericht über geäußerte Sorgen formuliert ist. Die EDGAR-Prüfung, die text-v2 verlangte, ist hiermit erledigt; Wortlaut S. 31 (S-1/A). Die Auslassung „…“ steht für „regulators, policymakers, and industry participants“. |
| MB2 | 26 | … FIRST TRADE EXPECTED NOV 19, **NOT CONFIRMED BY THE COMPANY** | … FIRST TRADE EXPECTED NOV 19 **(COMPANY TIMETABLE, SUBJECT TO REGULATORY CLEARANCE)** | **Falsch.** Die IPO-Website (FWP) schreibt: „Subject to regulatory clearance, the final IPO share price is expected to be set on November 18th (EST), and shares are expected to begin publicly trading on November 19th (EST).“ Das EU-Prospekt (11.11.) nennt im Zeitplan „November 19, 2026 … Commencement of trading … on the Nasdaq Global Select Market“. Auch text-v2 und Faktenliste Nr. 2 („von Anthropic nicht offiziell bestätigt“) sind damit überholt. |
| MB3 | 31 | WOULD BE THE 2ND-LARGEST IPO EVER · AFTER SPACEX (JUNE 2026) · klein, optional: UP TO 20 % … FOR RETAIL INVESTORS **(USUAL: 5–10 %)** · **Source: amended prospectus (S-1/A)** | WOULD BE THE 2ND-LARGEST IPO EVER · AFTER SPACEX (JUNE 2026) · **Sources: Anthropic S-1/A, Nov 10, 2026 · Bloomberg, Nov 10, 2026** · klein, optional: UP TO 20 % OF THE SHARES FOR RETAIL INVESTORS **(S-1/A)** | **Falsch zugeordnet.** Das S-1/A belegt nur Größe und 20 % („up to 20% of the shares of Class A common stock offered“, S. 338). Rang und SpaceX stehen dort nicht, „usual 5–10 %“ auch nicht. Belege dafür: [Bloomberg, 10.11.2026](https://www.bloomberg.com/news/articles/2026-11-10/anthropic-targets-64-4-billion-ipo-nearing-spacex-s-record) („nearing SpaceX's record“) und SpaceX 75 Mrd. $ ([Bloomberg, 11.06.2026](https://www.bloomberg.com/news/articles/2026-06-11/elon-musk-s-spacex-set-to-make-history-with-record-breaking-ipo)). Die 5–10 % sind nur in Sekundärquellen belegt und darum gestrichen. Zur optionalen 20-%-Zeile siehe K10. |
| MB4 | 51 | **PUBLIC SHARES (CLASS A)**: MAX 49.9 % OF VOTES · FOUNDERS (CLASS F): FIXED 50.1 % · Source: Anthropic prospectus | **ALL CLASS A SHARES, OLD AND NEW**: MAX 49.9 % OF VOTES · FOUNDERS (CLASS F): FIXED 50.1 % · Source: Anthropic prospectus **(S-1/A), Nov 10, 2026** | Wie M1. „Public shares“ liest sich als „die Aktien, die jetzt verkauft werden“. |
| MB5 | 97 | Dario Amodei, essay "We Must Pace the Frontier", Sep 12, 2026 | Dario Amodei, essay "We Must Pace the Frontier", Sep 12, 2026 **· held-back model: Amodei on X, Oct 2026** | **Unbelegt im Bild.** Die Einblendung liegt auf zwei Sätzen. Das Zurückhalten eines fertigen Modells (Mythos, ~4 Monate, Feb.–Juni 2026) stammt aus Amodeis X-Post, in dem er dem Kritiker Nathan Calvin antwortet (Reposts ab 21.10.2026, 07:24 UTC). Im Essay ist es nicht belegt (Essay-Text hier nicht abrufbar; die Zusammenfassungen erwähnen es nicht). [TNW](https://thenextweb.com/news/dario-amodei-anthropic-race-to-the-top-nine-safety-decisions) · S-1/A S. 114: „we initially released our Mythos model only as a gated research preview through Project Glasswing“. |

---

## 2 · Kann-Änderungen (nicht eingearbeitet, Jakobs Wahl)

### Im Sprechtext

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K1 | Z. 14: „Advanced A.I., the very thing it builds, could pose, quote, …“ | „People inside the company, it writes, fear that advanced A.I., the very thing it builds, could pose, quote, …“ (+8) | Der Prospekt berichtet über Sorgen, die „both within our organization and by other researchers …“ geäußert wurden, unter einer Bedingung („if not developed … with appropriate safeguards“). Die Kernphrase stimmt wörtlich, und die Firma druckt sie selbst als Warnung. Mit MB1 steht die Zuschreibung jetzt im Bild, darum nur gelb. |
| K2 | Z. 53: „**Just over** half stays with seven people: the founders.“ | „**More than** half stays with seven people: the founders.“ (±0); optional im Bild: „FOUNDERS IN TOTAL, INCL. OWN CLASS A: 61.3 %“ | Die 50,1 % (Class F) stimmen. Mit eigenen Class-A-Aktien halten die Gründer aber 61,3 % (S-1/A S. 111). „Just over half“ unterschätzt ihre Macht. |
| K3 | Z. 127: „Reports say there are **about six times** as many orders as shares.“ | „… **more than six times** as many orders as shares.“ (+1) | Bloomberg meldete am 12.11. „about six times“. Am So 15.11. berichtete Yahoo Finance (unter Berufung auf Bloomberg) „close to seven times“. Das Buch kann bis Mittwoch weiter wachsen; „more than six“ deckt beides. Dazu K11. |
| K4 | Z. 130: „One research firm **calls** this sale, quote, …“ | „**In October,** one research firm **called** this sale, quote, …“ (+2) | New Constructs vergab das Etikett um den 10./11.10.2026, damals mit Blick auf ~2 Bio. $ Bewertung (Slashdot 11.10.; [Fortune, 27.10.](https://fortune.com/2026/10/27/anthropic-ipo-s1-referendum-good-buy-ridiculous/)). Nach der Spanne vom 10.11. fand ich keine Wiederholung. Inhaltlich hält die Firma Anthropic für ~150 Mrd. $ wert, die Kritik gilt also weiter; das Datum macht es aber sauber. |
| K5 | Z. 103 und 171: „Want that too? Then subscribe.“ | „… Then subscribe to the channel.“ (+3, je Stelle) | „Subscribe“ heißt im Börsengang „Aktien zeichnen“. Das EU-Angebot läuft bis 18.11., 16:00 MEZ, und Z. 103 sagt direkt davor „… or the shares“. So ist jede Verwechslung mit einer Zeichnungsaufforderung ausgeschlossen. |

### Im Bild

| # | Stelle | jetzt | Vorschlag | Warum |
|---|---|---|---|---|
| K6 | Z. 56 | „AUTHORITY TO APPOINT A MAJORITY“ · Source: Anthropic, Oct 21, 2026 | LONG-TERM BENEFIT TRUST · 4 TRUSTEES (1 SEAT VACANT) · „GENERALLY HAS THE AUTHORITY TO ELECT A MAJORITY OF OUR BOARD“ · Source: Anthropic IPO factsheet (FWP), Nov 2026 | Der jetzige Wortlaut steht wörtlich im Beitrag vom 21.10.2026 (per WebFetch geprüft) und ist korrekt. Aktueller und rechtsverbindlich ist die Fassung von Factsheet und S-1/A mit „generally“: Einer der 4 Class-T-Sitze, der „Specified Class T Director“, braucht die Zustimmung des Nominierungsausschusses (sonst stimmen die Mitarbeiteraktien Class E ab). |
| K7 | Z. 86 | Governance expert quoted by the Associated Press, Nov 13, 2026 | … · plus: Filing: no „decision-making authority in the day-to-day management“ (S-1/A, Nov 10, 2026) | Die AP-Seite war gesperrt. Das Dossier zitiert den Experten mit „cannot determine the everyday decisions of these directors or the management of the company“. Das S-1/A sagt dasselbe wörtlich (S. 14 und 258), ist also die stärkere Quelle. |
| K8 | Z. 42, 67, 116, 119, 152, 159 | „Anthropic prospectus“ ohne Datum | „Anthropic prospectus (S-1/A, Nov 10, 2026)“ | Hausregel „jede Einblendung nennt Quelle und Datum“. Alle sechs Wortlaute sind wortgleich im S-1/A No. 2 belegt. |
| K9 | Z. 152 | MORE THAN 5 % OF THE COMPANY EACH | AMAZON ≈ 15 % · GOOGLE ≈ 14 % OF ALL SHARES AFTER THE IPO · NON-VOTING (CLASS N) | Das S-1/A nennt Aktienzahlen: Amazon 1.920.511.218, Google 1.789.598.269, gesamt 13.086.672.593 (S. 119/20) → 14,7 % und 13,7 % (eigene Rechnung). „More than 5 %“ ist richtig, aber sehr vorsichtig. |
| K10 | Z. 31 (optional) | UP TO 20 % … FOR RETAIL INVESTORS | weglassen | Am 17.11. läuft die Zeichnung für Privatanleger noch, in der EU bis 18.11., 16:00 MEZ (in DE, FR, NL, ES u. a., nicht in AT). Die Zeile liest sich leicht als Gelegenheit; das widerspricht „Whether to buy is not this film's subject“. |
| K11 | Z. 128 | ORDERS FOR ABOUT 6× … · Bloomberg, Nov 12, 2026 | ORDERS FOR MORE THAN 6× THE SHARES ON OFFER · Bloomberg, Nov 12 & 15, 2026 (unnamed sources) | wie K3 |
| K12 | Z. 131 | „the most ridiculous IPO of 2026“ · New Constructs, quoted by Inc. | … · New Constructs, Oct 2026, quoted by Inc. | wie K4; Datum fehlt (Hausregel) |

---

## 3 · Schwerpunkte

### 3a · Prospekt-Wortlaute gegen S-1/A No. 2 (10.11.2026), alle im Volltext gesucht

| Stelle | Wortlaut im S-1/A | S. | Urteil |
|---|---|---|---|
| Z. 14/15 Hook | „Concerns have been raised both within our organization and by other researchers, regulators, policymakers, and industry participants that sufficiently advanced AI systems could, if not developed, deployed, and operated with appropriate safeguards, oversight, and security measures, pose catastrophic or existential risks to humanity, particularly if such systems were misused, replicated, weaponized, or allowed to operate with a high degree of autonomy.“ | 31 | Kernphrase ✓ wörtlich; Bild → MB1; Ton → K1. Weitere Fassungen: S. 54 („…risks to society if not developed and deployed responsibly“), S. 86 (als „narratives“ der Medien). |
| Z. 41/42 getestet | „we have observed models behaving differently when they detect or infer that they are being evaluated“ | 30 | ✓ wörtlich |
| Z. 41/42 Abschalten | „models, including our own, have exhibited, and may in the future exhibit, unexpected strategic or self-preserving behaviors, including attempts to resist shutdown …“ | 31 | ✓ („some have shown“ passt zu „including our own“). Die Fassung ist „have exhibited“, nicht nur „may exhibit“; der Ersatzsatz aus text-v2 wird nicht gebraucht. |
| Z. 44 Versprechen | „If Powerful AI is directed at solving humanity's hardest problems and the risks are managed responsibly, the potential is extraordinary.“ | 7 | ✓ |
| Z. 50/51 Stimmen | „Class F … fixed 50.1% …“; „the voting power of the holders of Class A common stock is limited to an aggregate of 49.9%“ | 299 · 14 | ✓ Zahlen; Bezug → M1/MB4 |
| Z. 53 | „the Founder LLC will have the ability to determine the outcome of all matters submitted to a vote of our stockholders generally for the foreseeable future“ | 111 | ✓ |
| Z. 66/67 | „We believe that our seven co-founders … as a group, are distinctly equipped to be stewards of our mission.“ | 14 | ✓ wörtlich; die sieben Namen: Dario und Daniela Amodei, Tom Brown, Jack Clark, Jared Kaplan, Sam McCandlish, Christopher Olah |
| Z. 69/Z1 | „Our public advocacy, and the decisions we make to moderate the pace of AI development, delay or restrict the release of models or features, or forgo commercial opportunities for safety-related reasons, may not maximize stockholder value …“ | 114 | ✓ wörtlich; die drei Beispiele im VO entsprechen genau den drei Satzgliedern |
| Z. 125 | „We believe that Powerful AI … will become widely available within a few years“ | 7 | ✓. „Country of geniuses in a data center“ steht im S-1/A nur mit „Ultimately“, ohne Datum (S. 10). „more careful“ hält. |
| Z. 158/159 | „we are required to balance the pecuniary interests of our stockholders, the best interests of those materially affected by our conduct, and the specific public benefit purpose …: the responsible development and maintenance of advanced AI for the long-term benefit of humanity“ | Deckblatt | ✓ wörtlich; dazu „our directors are not merely permitted, but obligated, to consider …“ (S. 114) |
| Z. 38/39 | Inhaltsverzeichnis: RISK FACTORS 29 · SPECIAL NOTE … 123 | – | ✓ 94 Seiten Risikofaktoren → „more than ninety“ hält |

### 3b · Long-Term Benefit Trust, Gründer, Board → Ton ✓, K6/K7

- **Treuhänder:** „The LTBT is governed by five Trustees … Of the five authorized seats for Trustees, one is currently vacant“ (S. 253). Im Amt sind Neil Buddy Shah (Vorsitz, seit 06/2023), Richard Fontaine (04/2025), **Ben S. Bernanke (06/2026, „Chairman of the Board of Governors of the Federal Reserve System from February 2006 to January 2014“)** und Christopher Stubbs (10/2026). Das Factsheet vom Nov. 2026 (FWP) sagt: „currently consists of four financially disinterested trustees“. **„four trustees“ ✓ aktuell.** Für Nov. 2026 fand ich keinen neuen Treuhänder.
- **Keine Aktien:** „The policies of the LTBT prohibit a Trustee from directly purchasing or holding any of our securities“ (S. 111). Der Trust selbst hält die eine Class-T-Aktie; der VO sagt richtig „four people who don't own a single share“.
- **Board:** Es hat „seven authorized directors, with one seat vacant“. Der LTBT wählt in der Regel die vier Class-T-Direktoren: Hastings, Narasimhan, Liddell und einen offenen Sitz (S. 264). „Most of its seats can be filled by a trust“ ✓. Ausnahme ist der Specified Class T Director (K6).
- **Tagesgeschäft:** „neither the LTBT nor the Trustees have decision-making authority in the day-to-day management or strategy setting of the company“ (S. 14, 258) → Z. 85 ✓.
- **„appoint a majority“** (Z. 56, Suche ergab 0 Treffer im S-1/A): Der Wortlaut steht im [Anthropic-Beitrag vom 21.10.2026](https://www.anthropic.com/news/christopher-stubbs-joins-long-term-benefit-trust): „It has the authority to appoint a majority of Anthropic's board“. Die Einblendung zitiert also korrekt ihre Quelle. Das S-1/A sagt „generally has the authority to elect and remove“ bzw. „generally has the power to elect a majority“ (S. 259).
- **Amodei verkauft mit:** Laut Aktionärstabelle bietet Dario Amodei selbst 3.378.378 Aktien an (S. 299), ebenso jeder Mitgründer. „the man selling these shares“ (Z. 66) stimmt also auch wörtlich.

### 3c · Börsengang, Stand 16.11.2026 → MB2, K3/K11, sonst ✓

- **Primär:**
  - S-1/A: 825.000.000 Class-A-Aktien, davon 801.351.354 neu und 23.648.646 von Altaktionären. Spanne 70,00–78,00 $, Nasdaq Global Select, „ANT“. Option der Banken: +123.750.000 Aktien.
  - IPO-Website und EU-Prospekt: Preis am 18.11., Handel ab 19.11.; das EU-Angebot endet „on or about November 18, 2026“ um 16:00 MEZ.
- **Größe und Rang:** Bei 70–78 $ kommen 57,8–64,4 Mrd. $ zusammen, mit voller Option ≤ 74,0 Mrd. $. SpaceX brachte 75 Mrd. $ ein, mit Greenshoe 85,7 Mrd. $ (Bloomberg 11.06., Forbes 15.06.2026); Saudi Aramco ~25,6 Mrd. $. **Platz 2 ✓** innerhalb der Spanne. Banker sprechen von einem Preis über der Spanne (FT/Bloomberg, anonym). Bei deutlichem Aufschlag samt Vergrößerung könnte der Deal SpaceX nahekommen oder überholen ([Seoul Economic Daily, 12.11.](https://en.sedaily.com/world/2026/11/12/anthropic-ipo-demand-swamps-order-book-may-top-spacex-record)). Der VO sagt „would“; das reicht für Dienstag.
- **Bewertung:**
  - Unverwässert: 13.086.672.593 Aktien × 78 $ = 1,02 Bio. $ (eigene Rechnung).
  - Voll verwässert ~1,4 Bio. $ ([The Hill](https://thehill.com/policy/technology/6210488-anthropic-seeking-trillion-ipo/); [Motley Fool, 13.11.](https://www.fool.com/investing/2026/11/13/anthropic-set-its-ipo-price-range-at-70-to-78-valuing-it-at-up-to-1405-trillion/): „up to $1.405 trillion“). Andere rechnen 1,26–1,45 Bio. $; Bloombergs Titel nennt „up to $1.5 trillion“.
  - Die in der Einblendung genannten Fortune/CNN/CNBC (10.11.) führt das Dossier als VERIFIZIERT; ich habe sie nicht neu geöffnet → gelb.
- **Nachfrage:** [Bloomberg, 12.11.](https://www.bloomberg.com/news/articles/2026-11-12/anthropic-s-ipo-is-said-to-be-about-six-times-oversubscribed): „about six times oversubscribed“ (Reuters übernahm). Yahoo Finance meldete am 15.11. „close to seven times“ (Bloomberg, anonym). Anthropic kommentiert das nicht → K3/K11.
- **Keine Absage, keine Verschiebung, kein Preis bis 16.11.** Am Di 17.11. vormittags noch einmal prüfen (Abschnitt 6).

### 3d · Indexregeln (Z. 137–144) → ✓

- **Nasdaq-100 Fast Entry:**
  - Gilt seit 1.5.2026 (Reuters/BNN 30.03.2026; Invesco).
  - Bewertet wird nach dem 7. Handelstag. Wer nach Börsenwert unter die Top 40 kommt, wird nach dem 15. Handelstag aufgenommen.
  - Bei Handelsbeginn am 19.11. (Thanksgiving 26.11. geschlossen) wäre das um den 10./11.12. → „within weeks“ ✓.
- **Andere Indizes:**
  - MSCI „early inclusion“ nach ~10 Handelstagen (Marketscreener, Juni 2026).
  - FTSE Russell Fast Entry nach ~5 Handelstagen, Regel seit Mai 2026.
  - → „Other big lists have fast lanes too“ ✓
- **S&P 500:** S&P DJI lehnte am 4.6.2026 die Verkürzung ab: „no changes will be made to the eligibility criteria including … seasoning period“ ([S&P DJI](https://press.spglobal.com/2026-06-04-S-P-Dow-Jones-Indices-Consultation-on-Treatment-of-MegaCap-Companies-Results)). Es bleibt bei 12 Monaten und zusätzlich vier Quartalen mit GAAP-Gewinn → „wait a year“ ✓ (eher länger).

### 3e · Kritiker und Markt → ✓, K4/K12

- **Levine (14.10.2026):** „I therefore urge Anthropic to pause the IPO process so that the company may fully address these key issues“ (Governance, Sicherheit, Tempo); NYC-Pensionsfonds ~7 Mio. $ Exposure (Reuters/Insurance Journal 16.10., Quartz). Primär: [comptroller.nyc.gov](https://comptroller.nyc.gov/reports/letter-to-anthropic-re-planned-initial-public-offering/) (Dossier).
- **Warren (27.10.2026):** Fonds der Altersvorsorge müssten kaufen, „even if they are volatile or overvalued“ (sinngemäß, Yahoo/Spectrum 28.10.). Frist war der 3.11. Primär: [banking.senate.gov PDF](https://www.banking.senate.gov/imo/media/doc/2026.10.27%20Letter%20to%20Anthropic%20re%20IPO.pdf) (Dossier). „whatever the price“ ist eine faire Kurzform.
- **AP (13.11.2026),** „Anthropic promises to pursue humanity's benefit. Its IPO filing gives it wiggle room“: Gadinis (UC Berkeley) und Tallarita (Harvard) werden zitiert. Volltext gesperrt → K7.
- **Bengio:** Ko-Vorsitzender des Independent International Scientific Panel on AI, zusammen mit Maria Ressa gewählt am 3.3.2026 (UN; Wikipedia). UN Web TV führt ihn als „UN International Independent Panel on AI“ → ✓. Z. 88 gibt seine Rede laut UN-Untertitel treu wieder („admit their products pose catastrophic risks, yet offer no convincing technical solutions. Instead, they say they are locked in a race …“).
- **KI-Aktien:** Am 5.11.2026 fiel der Nasdaq Composite um ~5,5 %, der schlimmste Tag seit April 2025; Nvidia −9,3 % ([CNBC, 5.11.](https://www.cnbc.com/2026/11/05/qualcomm-earnings-chip-stocks-election.html), [CNN, 5.11.](https://www.cnn.com/2026/11/05/investing/tech-heavy-nasdaq-plunges)). Weitere Verluste am 12./13.11. → „early this month … fell hard“ ✓.
- **New Constructs:** „most ridiculous IPO of 2026“ ([Inc., Chris Morris](https://www.inc.com/chris-morris/anthropic-is-set-to-be-a-massive-ipo-some-analysts-are-already-raising-red-flags/91436110); Fortune 27.10.). Die Firma bewertet Anthropic mit ~150 Mrd. $ → K4/K12.

### 3f · Amodei: Essay, Zurückhalten, UN-Clips

- **Essay „We Must Pace the Frontier“** vom 12.09.2026 (X-Status 2098773920774074715 = 12.09.2026, 14:01 UTC). Amodei auf X: „I've written a new essay on why the AI industry should slow down“ → Z. 96 „asked his whole industry to slow down“ ✓. Vor der UN (23.09.) sagte er: „On September 12th, I called for a collaborative effort to pace the frontier“ (UN-Untertitel).
- **Zurückgehalten:** Laut seinem X-Post (Antwort an Nathan Calvin, Oktober 2026) wurde ein fertiges Mythos-Modell ~4 Monate (Feb.–Juni 2026) nicht breit veröffentlicht. Er schreibt dazu: „We likely sacrificed a significant chunk of a several-month model lead“ (TNW, Dealroom, daily.dev). Belegt ist nur, dass er es sagt. Das S-1/A bestätigt die anfangs beschränkte Freigabe, nicht die Dauer. „he says“ und „his word, not proof“ ✓ → gelb (Feinheit: in der Zeit hatten Cyber-Verteidiger über Project Glasswing Zugang); Bild → MB5.
- **Clips:**
  - **C1:** wortgleich im UN-Untertitel ✓
  - **C2:** wortgleich im UN-Untertitel ✓
  - **C3:** wortgleich; die UN-Untertitel schreiben „in **a** data center“, Whisper hört „in **the** data center“ (29,97 s). Der Untertitel folgt dem Ton ✓.

### 3g · Zahlen → alle ✓

| Aussage | S-1/A (bzw. FWP) | Wert |
|---|---|---|
| Umsatz 2023 (Z. 115) | Statements of Operations, S. 26, 153 | 41 Mio. $ („substantially all consumption-based“) |
| Umsatz Q3 2026 (Z. 115) | S. 6, 66, 139; Factsheet | 17,0 Mrd. $ („for the three months ended September 30, 2026“), das neueste berichtete Quartal |
| Nettoverlust Jan.–Sep. 2026 (Z. 119) | S. 26 | 104.039 Mio. $; davon 94,3 Mrd. $ „change in fair value of convertible notes, derivative liabilities, and SAFEs“. Die Firma selbst nennt solche Posten „non-cash charge“ (Factsheet Q3: 21,9 Mrd. $). |
| Operativer Verlust Jan.–Sep. 2026 (Z. 119) | S. 26 | 1.260 Mio. $ ≈ 1,3 Mrd. $; nur Q3: 567 Mio. $ (−3 % Marge) |
| „on the official books“ (Z. 118) | Factsheet: „15% Adjusted Operating Margin“ | Richtig: nach GAAP Verlust, bereinigt (Non-GAAP) positiv |
| Amazon/Google (Z. 151/152) | S. 119 | „Amazon and Google will each hold greater than five percent of our outstanding capital stock. Although our Class N common stock is non-voting …“ |

### 3h · Zeitwörter, bezogen auf Di 17.11.2026, 17:00 Wien

| Z. | Wort | Bezug | Urteil |
|---|---|---|---|
| 1 | now | Zeichnung über Broker offen (USA; EU bis 18.11.), Handel ab 19.11. | gelb, siehe S1 |
| 4, 25 | this coming Thursday / this Thursday | Handelsbeginn 19.11. (Firmenfahrplan) | ✓ |
| 77 | now, before the orders are counted | Buch offen bis 18.11. | ✓ |
| 96 | This September | Essay 12.09.2026 | ✓ |
| 107 | Wednesday night | Preis 18.11. (EST) | ✓ (in Wien schon Donnerstag früh, im VO egal) |
| 115 | three years ago · latest quarter | 2023 · Q3 2026 | ✓ |
| 127 | Reports say | 12.11. bzw. 15.11. | ✓, K3 |
| 130 | early this month | 5.11.2026 | ✓ |
| 130 | calls | New Constructs, Oktober 2026 | gelb, K4 |
| 139 | this year | Nasdaq-Regel seit 1.5.2026 | ✓ |
| 144 | within weeks | 15 Handelstage ≈ 10./11.12. | ✓ |

### 3i · Anlageberatung und Zeichnungsaufruf → ok, K5/K10

- Kein Satz empfiehlt zu kaufen oder zu zeichnen. Der VO sagt ausdrücklich „Whether to buy is not this film's subject“ (Z. 33) und „So buy, or don't“ (Z. 149, neutral). „NOT INVESTMENT ADVICE“ steht zweimal im Bild (Z. 26, 108).
- Preis und Bewertung stehen nur als „expected“ bzw. „would“; Zeichnungsfristen und Broker werden nicht genannt ✓.
- Zwei Restrisiken:
  - Das doppeldeutige „subscribe“ in Z. 103/171 (K5).
  - Die optionale 20-%-Zeile (K10).
- Die optionale Offenlegung (Z. 34) ist eine eigene Angabe der Produktion; sie wird empfohlen.

---

## 4 · Vollständige Aussagen-Tabelle Sprechtext (vo-v2, in Sprechreihenfolge)

| # | Z. | Aussage (VO) | Ampel | Quelle (Datum) | Anmerkung |
|---|---|---|---|---|---|
| S1 | 1 | You can now buy a piece of A.I. | gelb | S-1/A S. 338 (Retail über Schwab, Fidelity, Robinhood u. a.); EU-Prospekt 11.11. | Am 17.11. lassen sich nur Zeichnungen bzw. Kaufinteresse abgeben; in AT gibt es kein öffentliches Angebot, Börsenhandel erst Do. Titel ist fix, die nächste Zeile klärt „Thursday“. Keine Änderung. |
| S2 | 4 | Neuer Name am Donnerstag, drei Buchstaben A, N, T | grün | S-1/A Deckblatt („ANT“); FWP-FAQ (19.11.) | |
| S3 | 6 | Ein Labor, das nur A.I. baut | grün | S-1/A Business (Modelle, Plattform, Apps) | Einordnung „pure-play“ |
| S4 | 12 | Warnhinweis, nicht vom Kritiker, vom Verkäufer | grün | S-1/A Risk Factors S. 29–122 | |
| S5 | 14 | Fortgeschrittene A.I. könne „catastrophic or existential risks to humanity“ bedeuten | gelb | S-1/A S. 31 (10.11.2026) | Kernphrase wörtlich; im Original Zuschreibung „Concerns have been raised both within our organization and by …“ und Bedingung → K1, MB1 |
| S6 | 17 | Steht im eigenen Verkaufsdokument | grün | S-1/A S. 31 | |
| S7 | 19 | Das Dokument begrenzt die Mitsprache | grün | S-1/A S. 111 („generally will not be able to affect the outcome … regardless of how they vote“) | |
| S8 | 21 | Eine Gruppe, die an einen Esstisch passt | grün | S-1/A S. 14, 253; FWP | 7 + 4 = 11 |
| S9 | 23 | Verkäufer ist Anthropic, das Labor hinter Claude | grün | S-1/A | |
| S10 | 25 | Handel ab diesem Donnerstag an der Nasdaq erwartet | grün | FWP IPO-Website (10./12.11.); EU-Prospekt (11.11.) | |
| S11 | 28 | Erwarteter Preis 70–78 $ | grün | S-1/A Deckblatt (10.11.) | |
| S12 | 30 | Zweitgrößter Börsengang der Geschichte | grün | S-1/A (Größe); Bloomberg 10.11.; SpaceX 75 Mrd. $ (Bloomberg 11.06.) | zeitkritisch, siehe 3c |
| S13 | 36 | Ein Stück kann im Vorsorgegeld landen | grün | Nasdaq/MSCI/FTSE-Regeln (3d) | „may“ |
| S14 | 38 | Über 90 Seiten Warnungen | grün | S-1/A Inhaltsverzeichnis: S. 29–122 = 94 S. | |
| S15 | 41 | Systeme verhielten sich anders, wenn sie Tests bemerkten | grün | S-1/A S. 30 | wörtlich „detect or infer that they are being evaluated“ |
| S16 | 41 | Einige versuchten, sich dem Abschalten zu widersetzen | grün | S-1/A S. 31 | „models, including our own, have exhibited … attempts to resist shutdown“ |
| S17 | 44 | „extraordinary“ Potenzial, wenn die Risiken gemanagt werden | grün | S-1/A S. 7 | |
| S18 | 46 | Normalerweise: Aktie = Stimme | grün | allgemein; Class A = 1 Stimme (S. 16) | |
| S19 | 50 | Die angebotenen Aktien zusammen knapp unter der Hälfte | **rot** | S-1/A S. 299, 111, 19–20 | → **M1** |
| S20 | 53 | Knapp über die Hälfte bei sieben Gründern | gelb | S-1/A S. 14, 111 | 50,1 % ✓; mit eigenen Aktien 61,3 % → K2 |
| S21 | 53 | Laut Dokument genug, um Abstimmungen „for the foreseeable future“ zu entscheiden | grün | S-1/A S. 111, 259 | |
| S22 | 55 | Das Board kann den Chef ersetzen | grün | allgemein | |
| S23 | 55 | Die meisten Sitze kann ein Trust besetzen | grün | S-1/A S. 259, 264 (4 von 7) | „generally“, K6 |
| S24 | 55 | Vier Menschen ohne eine einzige Aktie | grün | S-1/A S. 253, 111; FWP-Factsheet („four financially disinterested trustees“) | |
| S25 | 55 | Einer ist Ben Bernanke, früher Chef der US-Notenbank | grün | S-1/A S. 254 | Treuhänder seit 06/2026; Fed-Chef 2006–2014 |
| S26 | 58 | Sieben Gründer, vier Treuhänder | grün | wie S8 | |
| S27 | 60 | Anspruch aufs Geld, kein Griff ans Steuer | grün | S-1/A Kapitalstruktur (S. 16) | Einordnung |
| S28 | 62 | Amodei sprach vor der UN darüber, was auf dem Spiel steht | grün | UN Web TV, 10228. Sitzung (23.09.2026) | |
| S29 | C1 | „If managed poorly, I even believe that AI could be a risk to humanity as a whole.“ | grün | UN-Untertitel; `schnitt.json` | |
| S30 | 66 | Der Sprecher verkauft diese Aktien | grün | S-1/A S. 299 (verkauft 3.378.378 Aktien) | |
| S31 | 66 | Begründung der Firma: Die Gründer bewahren die Mission am besten | grün | S-1/A S. 14 | |
| S32 | 66 | Kein Käufer kann das überstimmen, auch die Gründer nicht | grün | S-1/A S. 111 | Einordnung |
| S33 | 69 | Tempo drosseln, Systeme zurückhalten, Geschäft ausschlagen | grün | S-1/A S. 114 | |
| S34 | Z1 | „…may not maximize stockholder value.“ | grün | S-1/A S. 114 | wörtlich |
| S35 | 73 | Sicherheit kann vor Rendite gehen | grün | S-1/A S. 114 | Einordnung |
| S36 | 77 | Viele zweifeln und sagen es jetzt, vor dem Zählen der Aufträge | grün | 3e | |
| S37 | 80 | NYC-Aufseher der Pensionsfonds forderte eine Pause | grün | Levine-Brief 14.10.2026; Reuters 15./16.10. | |
| S38 | 83 | Täglicher Kurs als Note | grün | – | Einordnung |
| S39 | 85 | Treuhänder wählen Direktoren, keine Tagesentscheidungen | grün | S-1/A S. 14, 258; AP 13.11. | |
| S40 | 88 | Bengio ist Ko-Vorsitzender des UN-Wissenschaftspanels | grün | UN (Wahl 3.3.2026); UN Web TV | |
| S41 | 88 | In derselben UN-Sitzung | grün | 10228. Sitzung, 23.09.2026 | |
| S42 | 88 | Labore räumen Katastrophenrisiko ein, ohne überzeugende Lösung; „locked in a race“ | grün | UN-Untertitel; UN-Pressemitteilung SC/16462 | |
| S43 | C2 | „The race is not a law of nature. …“ | grün | UN-Untertitel; `schnitt.json` | |
| S44 | 92 | Ein Rennen aus eigener Wahl; der Kurs belohnt Tempo | grün | – | Einordnung |
| S45 | 96 | Im September forderte er die Branche auf, langsamer zu werden | grün | Essay 12.09.2026; X 12.09.; UN 23.09. | |
| S46 | 96 | Er sagt, die Firma habe ein fertiges System monatelang zurückgehalten | gelb | Amodei auf X, Okt. 2026 (TNW); S-1/A S. 114 | eigene Angabe, korrekt so markiert; Bild → MB5 |
| S47 | 99 | Der Börsengang zwang die Firma, alles im Rechtsdokument offenzulegen; jeder kann es lesen | grün | S-1 ab 26.10. öffentlich; S-1/A 10.11. | |
| S48 | 101 | Unbewiesen, aber jetzt aktenkundig | grün | – | Einordnung |
| S49 | 103 | Abo-Aufruf „Then subscribe.“ | gelb | – | „subscribe“ heißt im IPO auch zeichnen → K5 |
| S50 | 107 | Endpreis Mittwochnacht erwartet | grün | FWP-FAQ (18.11. EST) | |
| S51 | 110 | Oben in der Spanne bis zu 1,4 Bio. $ | gelb | The Hill; Motley Fool 13.11.; Dossier: Fortune/CNN/CNBC 10.11. | voll verwässert; unverwässert ~1,0 Bio. $; Bild sagt „FULLY DILUTED“ ✓ |
| S52 | 115 | Vor drei Jahren ~40 Mio. $ in einem Jahr | grün | S-1/A S. 26 (41 Mio. $, 2023) | |
| S53 | 115 | Im letzten Quartal 17 Mrd. $ | grün | S-1/A; Factsheet (Q3 2026) | |
| S54 | 118 | In den offiziellen Büchern Verluste | grün | S-1/A S. 26 | GAAP |
| S55 | 121 | Amodei vor der UN zur Zeitspanne | grün | UN-Untertitel (Kontext „AI is advancing very quickly“) | |
| S56 | C3 | „The trajectory only needs to continue … country of geniuses in the data center.“ | grün | UN-Untertitel; Whisper „the“ | |
| S57 | 125 | Ein bis zwei Jahre ist eine Prognose des Verkäufers | grün | C3 | |
| S58 | 125 | Im Dokument vorsichtiger: „within a few years“ | grün | S-1/A S. 7 | siehe 3a |
| S59 | 127 | Etwa sechsmal so viele Aufträge wie Aktien | gelb | Bloomberg 12.11. (anonym); Yahoo/Bloomberg 15.11.: ~7× | → K3 |
| S60 | 130 | Anfang des Monats fielen KI-Aktien stark | grün | CNBC/CNN 5.11.2026 | |
| S61 | 130 | Analysehaus nennt den Börsengang „most ridiculous IPO“ des Jahres | gelb | Inc.; Fortune 27.10. (New Constructs, Okt. 2026) | Präsens/Datum → K4 |
| S62 | 137 | Viele Fonds kopieren einen Index | grün | allgemein | |
| S63 | 139 | Nasdaq-Regel von 2026: nach 15 Handelstagen in den Hauptindex | grün | Nasdaq, gültig ab 1.5.2026 (Reuters 30.03.) | |
| S64 | 142 | Andere große Indizes haben Schnellspuren | grün | MSCI early inclusion; FTSE Russell (Mai 2026) | |
| S65 | 142 | S&P 500 lässt ein Jahr warten | grün | S&P DJI 4.6.2026 | dazu GAAP-Gewinn |
| S66 | 144 | Wahrscheinlich binnen Wochen ein kleines Stück im Plan | grün | 3d | „probably“ |
| S67 | 146 | Senatorin: Vorsorgegeld muss womöglich kaufen, egal zu welchem Preis | grün | Warren-Brief 27.10.2026 | sinngemäß |
| S68 | 151 | Amazon und Google halten große Anteile ohne Stimmrecht | grün | S-1/A S. 119 | |
| S69 | 154 | Das Steuer ist nicht käuflich | grün | S-1/A (fixe 50,1 %, „not … subject to dilution“) | Einordnung |
| S70 | 154 | Es liegt bei elf Menschen | grün | 7 + 4 | „as … built today“ ✓ |
| S71 | 158 | Das Board muss drei Dinge abwägen | grün | S-1/A Deckblatt, S. 114 | |
| S72 | 161 | Wer ist wesentlich betroffen? Du. | grün | – | Lesart, als Frage gestellt |
| S73 | 167 | Senatorin und Pensionsaufseher haben ihre Stimme genutzt; öffentliches Dokument | grün | 3e | |
| S74 | 171 | Abo-Aufruf „Then subscribe.“ | gelb | – | → K5 |

Summe Sprechtext: **74 · 64 grün · 9 gelb · 1 rot.**

## 5 · Einblendungen (vo-v2, in Bildreihenfolge)

| # | Z. | Einblendung | Ampel | Quelle | Anmerkung |
|---|---|---|---|---|---|
| E1 | 2 | EXPECTED FIRST TRADE: THU, NOV 19, 2026 · NASDAQ: ANT | grün | FWP; S-1/A | |
| E2 | 15 | Ganzer Prospekt-Satz | **rot** | S-1/A S. 31 | → **MB1** |
| E3 | 26 | … NOT CONFIRMED BY THE COMPANY | **rot** | FWP-FAQ; EU-Prospekt | → **MB2** |
| E4 | 29 | EXPECTED RANGE $70–78 · 825 MILLION SHARES · Anthropic, Nov 10 | grün | S-1/A; Anthropic, Mitteilung vom 10.11. | |
| E5 | 31 | 2ND-LARGEST · SPACEX · 20 % (USUAL 5–10 %) · Source: S-1/A | **rot** | s. MB3 | → **MB3** |
| E6 | 34 | Offenlegung Claude/Anthropic (optional) | grün | eigene Angabe | empfohlen |
| E7 | 39 | 90+ PAGES OF RISK FACTORS | grün | S-1/A S. 29–122 | |
| E8 | 42 | „…behaving differently …being evaluated“ · „…attempts to resist shutdown“ | grün | S-1/A S. 30/31 | wörtlich; Datum → K8 |
| E9 | 51 | PUBLIC SHARES (CLASS A) 49.9 % · CLASS F 50.1 % | **rot** | S-1/A S. 299 | → **MB4** |
| E10 | 56 | LTBT · 4 TRUSTEES · „AUTHORITY TO APPOINT A MAJORITY“ · Anthropic, Oct 21 | gelb | Anthropic 21.10.2026 (WebFetch ✓) | korrekt zitiert; aktueller Rechtstext → K6 |
| E11 | 64 | C1-Bauchbinde, Untertitel | grün | UN Web TV | |
| E12 | 67 | „…distinctly equipped to be stewards of our mission“ | grün | S-1/A S. 14 | Datum → K8 |
| E13 | 78 | STEP 2: THE ORDERS ARE COUNTED | grün | – | |
| E14 | 81 | NYC Comptroller Mark Levine, letter of Oct 14, 2026 | grün | comptroller.nyc.gov; Quartz | |
| E15 | 86 | Governance expert quoted by the AP, Nov 13, 2026 | gelb | AP 13.11. (gesperrt; Dossier) | → K7 |
| E16 | 90 | Bengio-Bauchbinde, Untertitel | grün | UN Web TV; Panel-Rolle (UN) | |
| E17 | 97 | Essay-Quelle für beide Sätze | **rot** | s. MB5 | → **MB5** |
| E18 | 108 | STEP 3: PRICING NIGHT (EXPECTED WED, NOV 18) · NOT INVESTMENT ADVICE | grün | FWP-FAQ | |
| E19 | 111 | UP TO ≈ $1.4 TRILLION · FULLY DILUTED · Fortune, CNN, CNBC, Nov 10 | gelb | Dossier; The Hill; Motley Fool | Berechnung variiert |
| E20 | 116 | REVENUE 2023 $41M · Q3 2026 $17.0B | grün | S-1/A; Factsheet | Datum → K8 |
| E21 | 119 | NET LOSS ≈ $104B, $94.3B NON-CASH · OPERATING LOSS $1.3B | grün | S-1/A S. 26 | Datum → K8 |
| E22 | 123 | C3-Bauchbinde, Untertitel | grün | UN Web TV | „the“ nach Ton |
| E23 | 128 | ORDERS FOR ABOUT 6× · Bloomberg, Nov 12 | gelb | Bloomberg 12.11. | → K11 |
| E24 | 131 | „the most ridiculous IPO of 2026“ · New Constructs, quoted by Inc. | gelb | Inc.; Fortune 27.10. | Datum fehlt → K12 |
| E25 | 140 | STEP 4 · +15 TRADING DAYS · FAST ENTRY SINCE MAY 1, 2026 | grün | Nasdaq/Reuters | |
| E26 | 147 | Sen. Elizabeth Warren, letter of Oct 27, 2026 | grün | banking.senate.gov; Spectrum, Yahoo | |
| E27 | 152 | AMAZON · GOOGLE > 5 % · NON-VOTING (CLASS N) | grün | S-1/A S. 119 | → K8, K9 |
| E28 | 159 | PBC · STOCKHOLDERS · „THOSE MATERIALLY AFFECTED …“ · „…LONG-TERM BENEFIT OF HUMANITY“ | grün | S-1/A Deckblatt | wörtlich; Datum → K8 |

Summe Einblendungen: **28 · 18 grün · 5 gelb · 5 rot.**

---

## 6 · Offen und Rest-Risiken (Di 17.11. vor 12:00 Wien prüfen)

1. **Fahrplan und Spanne:** Gibt es ein S-1/A No. 3 oder eine geänderte Spanne oder Größe? Wird die Spanne erhöht, dann Z. 28/29, 30/31 (Rang: über ~75 Mrd. $ wäre es Platz 1) und 110/111 anpassen. Kommt eine Verschiebung, dann Z. 4, 25, 26, 107, 108, 140.
2. **Nachfrage:** Wenn K3 nicht übernommen wird, die Zahl neu prüfen; Bloomberg könnte bis Dienstag ≥ 7× melden.
3. **Gesperrte Hosts:** Der AP-Text (clickondetroit.com), Yahoo Finance (7×) und Schwab (Indexregeln) sind nur aus Suchauszügen belegt; zum Volltext-Gegenlesen freigeben.
4. **Essay-Volltext:** darioamodei.com habe ich nicht geöffnet. Steht das Zurückhalten doch im Essay, ist MB5 trotzdem richtig, nur nicht nötig.
5. **Hook (K1):** Die Zuspitzung „From the seller …“ bleibt eine bewusste Entscheidung. Die Kernphrase steht wörtlich im Prospekt; dass es im Original „concerns … within our organization and by …“ heißt, zeigt jetzt das Bild.
6. **Rechte:** UN-Web-TV-Bedingungen für die Clips sind nicht Teil dieses Checks.

---

## 7 · Ampelseite (die heikelsten Aussagen, für den unabhängigen Zweitprüfer)

**Ampel:** grün = Primärquelle eindeutig · gelb = Quelle trägt, aber Maß, Deutung oder Aktualität angreifbar · rot = falsch (nach v3 keine mehr). Grün gilt erst, wenn der Zweitprüfer die Primärquelle selbst geöffnet hat.

| # | Aussage (ein Satz) | Ampel | Primärquelle |
|---|---|---|---|
| A1 | Der Prospekt schreibt, es sei, auch innerhalb von Anthropic, die Sorge geäußert worden, hinreichend fortgeschrittene KI könne ohne passende Schutzmaßnahmen „catastrophic or existential risks to humanity“ bedeuten. | gelb (Wortlaut sicher, die Zuspitzung im VO ist Absicht) | [S-1/A No. 2, Risk Factors S. 31](https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm) |
| A2 | Alle Class-A-Aktien zusammen (alte und neue) haben höchstens 49,9 % der Stimmen; die Founder LLC der sieben Gründer hat fix 50,1 %. | grün (nach M1) | [S-1/A No. 2, S. 299 und 14](https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm) |
| A3 | Der Trust hat derzeit vier Treuhänder ohne Aktien, darunter Ben Bernanke, und wählt in der Regel die Mehrheit des Boards, aber er entscheidet nicht im Tagesgeschäft. | grün | [S-1/A No. 2, S. 253–255, 14](https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm) · Factsheet (FWP, Nov. 2026) |
| A4 | Anthropic erwartet selbst die Preisfestsetzung am 18.11. und den Handelsstart am 19.11., vorbehaltlich der Freigabe. | grün | IPO-Website als FWP (`quellen/anthropicpbc-fwpipowebsi.txt`, ipo.anthropic.com) · EU-Prospekt 11.11. |
| A5 | Innerhalb der Spanne (57,8–64,4 Mrd. $) wäre es der zweitgrößte Börsengang nach SpaceX (75 Mrd. $, Juni 2026). | grün (zeitkritisch bis zur Preisfestsetzung) | S-1/A Deckblatt · [Bloomberg, 11.06.2026](https://www.bloomberg.com/news/articles/2026-06-11/elon-musk-s-spacex-set-to-make-history-with-record-breaking-ipo) |
| A6 | An der Spitze der Spanne bis zu ~1,4 Bio. $ voll verwässert (unverwässert ~1,0 Bio. $). | gelb (Berechnungsbasis variiert) | S-1/A S. 19–23 (Aktienzahlen) · [The Hill](https://thehill.com/policy/technology/6210488-anthropic-seeking-trillion-ipo/) |
| A7 | Laut Bloomberg (anonyme Quellen) gibt es rund sechsmal so viele Aufträge wie Aktien. | gelb (anonym; am 15.11. ~7×) | [Bloomberg, 12.11.2026](https://www.bloomberg.com/news/articles/2026-11-12/anthropic-s-ipo-is-said-to-be-about-six-times-oversubscribed) |
| A8 | Amodei sagt, Anthropic habe ein fertiges Mythos-Modell rund vier Monate nicht breit veröffentlicht. | gelb (eigene Angabe; das S-1/A bestätigt nur die anfangs beschränkte Freigabe) | Amodei auf X, Okt. 2026 ([TNW](https://thenextweb.com/news/dario-amodei-anthropic-race-to-the-top-nine-safety-decisions)) · S-1/A S. 114 |

**Ohne Ampel, am Ton prüfen:** C3 „the“ oder „a data center“ (Whisper: „the“).
