# Faktencheck · „Why Elon Says Saving Money Is Pointless“ · geprüft: vo-v2.txt → vo-v3.txt

Stand: Mittwoch, 11.11.2026. Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v2.txt` (Hörfassung, von Jakob freigegeben) samt Clip-Wortlaut C1–C5. Dazu kommen alle Einblendungen und Bildtexte mit Zitat, Zahl, Datum oder Quelle aus `text-v2.md` und die 30 Punkte „Faktencheck: besonders prüfen“ des Texters. Die Veröffentlichung ist für So 15.11.2026, 17:00 Wien, geplant. Relative Zeitwörter („Last winter“, „This spring“, „This June“, „This summer“, „this year“) sind auf dieses Datum geprüft und stimmen (3m). Die Zeilennummern gelten für `vo-v2.txt` und `vo-v3.txt` gleich, denn die Zeilenzahl ist unverändert.

**Ergebnis:** 128 Aussagen geprüft (82 im Sprechtext inkl. 5 Clips, 46 Einblendungen und Bildtexte): **110 ok · 15 zugespitzt · 1 falsch · 2 unbelegt**.
- **1 Muss-Änderung im VO** ist in `vo-v3.txt` eingearbeitet (Z. 117). Sonst ist die Datei byte-identisch mit `vo-v2.txt`; Regie-Tags und [CLIP]-Zeilen sind unverändert. `regel_check.py vo-v3.txt` → 0 Hinweise, 1.479 Wörter (+2), „subscribe“ 2×, 5 [CLIP]-Zeilen. Alle Clip-Einordnungssätze (Z. 12, 60, 69, 83, 114) bleiben, wie sie sind.
- **2 Muss-Änderungen im Bild:** die Zitatkarten bei 1:24 (Sprecher unbelegt) und 6:53 (ein Wort steht so nicht im Ton).
- **15 Kann-Änderungen:** 2 im VO, 13 in Bild und Schnitt.
- Nichts ist erfunden. Die Zahlen des Faktenzettels halten, die BLS-Werte habe ich unabhängig nachgerechnet. Die 15 Zuspitzungen sind gedeckt und dürfen nach Jakobs Regel bleiben.

**Quellenlage (wichtig für den Zweitprüfer):**
- **Gesperrt:** Aus dieser Umgebung waren die Primärseiten nicht erreichbar, u. a. ssa.gov, bls.gov, presidency.ucsb.edu, x.com, futurism.com, en.wikipedia.org, web.archive.org, businesswire.com, forbes.com und bloomberg.com. WebFetch meldete für futurism.com und finance.biggo.com „ENOTFOUND“. Danach habe ich keine weiteren Seiten versucht. **Diese beiden Hosts müssten in den Netzwerkeinstellungen der Sitzung freigegeben werden**, damit der Futurism-Artikel zum X-Post und eine Abschrift des Economist-Interviews geprüft werden können.
- **YouTube:** Die YouTube Data API war erreichbar. Mit 3 Aufrufen habe ich `videos.list` (Veröffentlichungsdaten, Beschreibungen) und `captions.list` abgefragt; der Untertitel-Download (`captions.download`) braucht OAuth und kam mit 401 zurück. yt-dlp scheiterte am Proxy (403), das habe ich nicht wiederholt.
- **Untertitel:** Die json3-Untertitel aus dem Recherche-Lauf vom 10.11.2026 habe ich mit eigenen Skripten Wort für Wort neu ausgewertet, mit Wortzeiten und Sprecherwechsel-Zeichen „>>“. Vorhanden waren automatische Spuren für Moonshots (RSNuB9pj9P8, Short sf1gUoREC54), Tesla (Ucp0TTmvqOE), Isaacson (AQnwQHMnCrE) und FDR (EN7NUindB38). Von Hand untertitelt sind die Weltbank-Spur (7v2iPkIu0U0) und die FDR-Kopie JG1Eba0tnwo. Für das Economist-Interview (XuoqKYxDHVc) gibt es keine.
- **BLS:** unabhängig nachgerechnet mit dem Python-Paket `cpi` 2.1.0, das die BLS-Reihen bis Aug. 2026 enthält.
- **Sonst:** Suchauszüge (WebSearch) aus Primärseiten (ssa.gov, Business Wire, World Bank) und seriöse Berichte. „Suchauszug“ heißt: Die Primärseite selbst war nicht offen, der Text stammt aus dem Suchergebnis.
- **Sprecher im Moonshots-Podcast** sind nur über die automatischen „>>“-Marken zugeordnet, und die sitzen oft falsch. Darum steht dort „wahrscheinlich“, mit Hinweisen fürs Gegenhören am Bild bzw. Ton.

---

## 1 · Muss-Änderungen

### Im Sprechtext (eingearbeitet in vo-v3.txt)

| # | alt (vo-v2) | neu (vo-v3) | Grund | Quelle |
|---|---|---|---|---|
| M1 | Z. 117: „With amounts, with dates, and with money set aside years before **anyone collected**.“ | „With amounts, with dates, and with money set aside years before **the first monthly check**.“ | **Falsch.** Social Security zog ab 1.1.1937 Beiträge ein und zahlte von Anfang an einmalige Pauschalbeträge an Menschen, die in Rente gingen. Der früheste bekannte Empfänger war Ernest Ackerman (17 Cent); bis Ende 1939 bekamen rund 441.000 Menschen solche Schecks. „Years before anyone collected“ stimmt deshalb nicht. Richtig ist: Die erste **Monats**rente kam erst im Januar 1940, nach drei Jahren Beiträgen. PolitiFact hat eine ähnliche Aussage von Jay Leno („took seven years before anybody got the first check“) deshalb als „Mostly False“ bewertet. Jetzt passen Z. 118 („Check number one“) und die Einblendung bei 9:22 („FIRST MONTHLY CHECK: JAN 1940“) genau. +2 Wörter (1.477 → 1.479). | [SSA History FAQ](https://www.ssa.gov/history/hfaq.html) (Suchauszug) · [PolitiFact, 12.11.2013](https://www.politifact.com/factchecks/2013/nov/12/jay-leno/leno-says-social-security-took-7-years-issue-its-f) (Suchauszug) · [SSA: Ida May Fuller](https://www.ssa.gov/history/imf.html) |

### Im Bild (Muss)

| # | jetzt | neu | Grund | Quelle |
|---|---|---|---|---|
| MB1 | 1:24, Zitatkarte: „Things get down to basic cost of materials and electricity“ · Musk, Moonshots | Nur lassen, wenn am Bild eindeutig Musk spricht. Sonst: **„currency will be measured in … wattage and tonnage“ · Musk to Walter Isaacson, Oct 2026** | **Sprecher unbelegt.** In den Untertiteln beginnt der Abschnitt mit einem Sprecherwechsel mitten im Satz („AI is basically uh intelligence available uh >> at a dimminimous price … Things get down to basic cost of materials and electricity, right?“). Kurz davor fällt „we're basically demonetizing everything“. „Demonetize“ ist Diamandis' eigenes Stichwort. Eine Zitatkarte mit falschem Namen wäre ein echter Fehler. Der VO-Satz Z. 17 bleibt, denn Musk vertritt dasselbe an anderer Stelle sicher: Isaacson 0:17:53 („currency will be measured in fundamental physics metrics like … power like wattage and tonnage … mass and energy“), dazu US-Saudi Investment Forum 19.11.2025 („constraints on power like electricity and mass“, Suchauszug). | [Moonshots #220, 1:10:00–1:10:42](https://www.youtube.com/watch?v=RSNuB9pj9P8&t=4200s) · [Isaacson-Interview, 0:17:53](https://www.youtube.com/watch?v=AQnwQHMnCrE&t=1073s) |
| MB2 | 6:53, Zitatkarte: „Only criticism, and it's a fair one, is sometimes I'm not on time. But I get it done.“ · Musk, Apr 22, 2019 | **„… it's a fair one … sometimes I'm not on time. But I get it done.“ · Musk, Apr 22, 2019** (Wortlaut vor dem Setzen am Ton abhören) | **Wortlaut unbelegt.** Die Untertitel hören „only criticism and it's a fair one and sometimes I'm not on time but I get it done“. Wired setzt „[is that]“ in eckige Klammern, also als eigene Einfügung. Das „is“ der Karte steht so nicht im Ton. In Anführungszeichen gehört nur, was gesagt wurde; Lücken bekommen „…“. Ob „I'm“ oder „I am“, entscheidet der Ton. Der VO (Z. 86, indirekte Rede) ist richtig. | [Tesla Autonomy Day, 3:04:52–3:05:08](https://www.youtube.com/watch?v=Ucp0TTmvqOE&t=11092s) · [CNBC, 22.4.2019](https://www.cnbc.com/2019/04/22/elon-musk-says-tesla-robotaxis-will-hit-the-market-next-year.html) |

---

## 2 · Kann-Änderungen (nicht eingearbeitet, Jakobs Wahl)

### Im Sprechtext

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K1 | Z. 98: „Nearly two in three Americans say they worry more about running out of money than about dying.“ | lassen oder: „In one survey, nearly two in three Americans said they worry more about running out of money than about dying.“ (+3 Wörter) | Allianz befragte online 1.000 Erwachsene ab 25, die ein Mindesteinkommen (50.000 $ allein, 75.000 $ als Paar) oder 150.000 $ Anlagevermögen hatten. „Americans“ ist Allianz' eigene Formulierung und trägt; „one survey“ wäre genauer. Die Einblendung nennt Allianz ohnehin. |
| K2 | Z. 110: „Musk himself expects the years ahead to bring radical change, social unrest, and immense prosperity.“ | Nur falls bei 1:06:42 nicht Musk spricht: „Musk himself expects a bumpy ride on the way to abundance.“ (11 statt 15 Wörter). Die Karte bei 8:35 wird dann „this is going to be a bumpy ride“ · Musk, Moonshots. | Der Wortlaut stimmt, der Sprecher ist nur wahrscheinlich Musk (3b). „bumpy ride“ ist sicher Musk (1:08:47). Z. 111 („People have lived through that once already“) passt zu beiden Fassungen. |

### In Bild und Schnitt

| # | Stelle | jetzt | Vorschlag | Warum |
|---|---|---|---|---|
| K3 | 0:00 | STOP SAVING MONEY (groß, ohne Zuschreibung) | z. B. „SAVING MONEY … IS POINTLESS“ — ELON MUSK | Groß und allein gelesen klingt der Satz wie unser Rat, und „stop“ hat Musk nicht gesagt. Mit seinem Wort und seinem Namen bleibt die Zuspitzung und wird zum Zitat. Gilt auch fürs Thumbnail (siehe `text-v2.md`, Hinweise). |
| K4 | 1:31 | „you will have deflation“ · Musk, Moonshots | am Bild bestätigen; sonst „AI/robotics will produce goods & services far in excess of the increase in the money supply“ · Musk on X, Apr 2026 | Wahrscheinlich Musk: Es ist sein bekanntes Argument, und das „Sure.“ davor sagt der Gastgeber. Zugeordnet ist der Satz aber nur über die automatischen Marken. Der X-Wortlaut stammt aus Suchauszügen. |
| K5 | 1:41 | „it's not like I got this all figured out“ · Musk, Moonshots | „it's not like I know the answers here“ · Musk, Moonshots | Die Aussage ist dieselbe, aber dieser Satz stammt sicher von Musk (1:08:47; im selben Atemzug dankt er den Gastgebern). „figured out“ ist nur wahrscheinlich Musk. Z. 20 passt zu beiden. |
| K6 | 3:18 | NURSING HOMES +166 % | optional: NURSING HOMES & ADULT DAY CARE +166 % | So heißt die BLS-Serie (CUUR0000SEMD02). |
| K7 | 3:29 | ECONOMISTS CALL IT THE BAUMOL EFFECT (bei Uhr und Haus) | das Etikett nur an die Uhr in der Hand setzen | Der Baumol-Effekt erklärt, warum Menschenzeit teuer wird, nicht die teure Lage (das Haus mit Stecknadel). |
| K8 | 4:24 | Musk on X, Apr 17, 2026 | Musk on X, Apr 2026 | Mehrere Berichte sagen, der Post ging am späten 16.4. (US-Zeit) online. Der Monat ist sicher. |
| K9 | 6:23 | … (CARES ACT · AMERICAN RESCUE PLAN) | … (CARES ACT · DEC 2020 RELIEF ACT · AMERICAN RESCUE PLAN) | Es gab drei Runden. Die Karte sagt „EACH ONE“, nennt aber nur zwei Gesetze; die 600-$-Runde kam mit dem Consolidated Appropriations Act 2021 (Dez. 2020). |
| K10 | 6:48 | NO ONE INSIDE: SINCE JAN 2026 | NO SAFETY MONITOR ON BOARD: SINCE JAN 2026 | Fahrgäste sitzen ja drin, gemeint ist der Begleiter. Anfangs fuhr laut Electrek ein Begleitauto hinterher. |
| K11 | C1, eigene Untertitel | Sprechernamen im Einwurf | keine Namen in den Untertiteln, solange nicht am Bild geklärt | `clips.json` ordnet „Either we're not going to be here or“ Diamandis zu. In der Langfassung stehen davor aber „No.“ und „Okay.“ im selben Abschnitt, und inhaltlich passt der Satz auch zu Musk („Either we're not going to be here, or … you won't need to save for retirement“). |
| K12 | C1, Schnitt | In 00:00:01.600 · Out 00:00:16.000 | In ≈ 1,85–1,90 s · Out ≈ 15,95 s (am Ton setzen) | Bei 1,600 beginnt „like“ („is like don't worry“), „don't“ startet bei 1,920. Diamandis' nächster Satz („The services will be there to support you …“) beginnt bei 16,080; er darf nie bei Musk landen (Faktenzettel 0.4). |
| K13 | C2, Schnitt | In 01:13:54.400 · Out 01:14:00.000 | In ≈ 54,45 · Out ≈ 59,95 | „uh“ liegt bei 54,320, „is“ bei 54,480; „or“ beginnt genau bei 00,000. Mit K12 sinkt das Moonshots-Paket von 20,0 s auf ≈ 19,6 s und hat Luft unter der 20-s-Grenze. |
| K14 | C4, Schnitt | Out 00:47:23.750 | Out ≈ 23,70 | „and“ beginnt bei 23,760, also 10 ms nach dem Out-Punkt. |
| K15 | 9:22, Bild | Die Kasse füllt sich 1937–1939, „bevor 1940 der erste Scheck herauskommt“. | den Scheck von 1940 als ersten **Monats**scheck zeigen | Pauschal-Schecks gab es ab 1937 (M1). Die Einblendung sagt richtig „FIRST MONTHLY CHECK“. |

---

## 3 · Schwerpunkte

### 3a · X-Post vom 29.10.2026 und die Kürzung „saving money is pointless“ → trägt (zugespitzt)

- **Wortlaut** (Futurism, The Hans India, IBTimes, NewsBytes; in allen Berichten gleich, die Hans India schreibt „super-intelligent“): „Saving money for the distant future is pointless with the advent of super intelligent abundance.“ Futurism berichtete am 29.10.2026. Es ist eine Antwort auf den Nutzer battleangelviv, der scherzte, damit rechtfertige er seine „questionable financial decisions“ (Suchauszug).
- **Die Kürzung** lässt den Zeitraum („for the distant future“) und die Bedingung („with the advent of super intelligent abundance“) weg. Beides holt der Film binnen 10 s zurück: Z. 4–5 im Ton, die Einblendung ab 0:01 im Wortlaut. Mehrere Medien kürzen genauso (Gulf News: „Saving money is pointless“). Ergebnis: **zulässig zugespitzt.** Nicht gedeckt wäre „Musk says: stop saving“ als Zitat (→ K3).
- Den Post selbst habe ich nicht gesehen, weil x.com gesperrt ist und futurism.com nicht auflöste.
- Quellen: [Futurism](https://futurism.com/future-society/elon-musk-saving-money-pointless) (Suchauszug) · [The Hans India](https://www.thehansindia.com/news/international/saving-money-for-the-distant-future-is-pointless-musk-1137989) · [Money Talks News](https://www.moneytalksnews.com/elon-musk-says-saving-for-the-distant-future-is-pointless-im-a-cpa-heres-why-hes-wrong/)

### 3b · Moonshots #220: alle Stellen am Untertitel → Wortlaut ok, Sprecher teils offen

Die Folge wurde am 22.12.2025 aufgenommen (Videobeschreibung: „Recorded on December 22nd, 2025“) und am 6.1.2026 veröffentlicht, der Short am 11.1.2026. Am Tisch saßen Peter Diamandis und Dave Blundin. Zeiten beziehen sich auf die Langfassung.

| Stelle | Zeit | Wortlaut (automatische Untertitel) | Sprecher | Urteil |
|---|---|---|---|---|
| Spar-Satz (C1) | 1:14:31–1:14:54 · Short 0:01,6–0:16,0 | „one like side recommendation I have is like don't worry about like squirreling money away for uh retirement in like 10 or 20 years. It won't matter. … If if any of the things that we've said are true, saving for retirement will be irrelevant.“ | Musk (Short-Titel, alle Berichte). Den Einwurf „Either either we're not going to be here or“ (1:14:40) kann man nicht sicher zuordnen (K11). | ok |
| Steuer-Frage (C2) | 1:13:46–1:14:28 | „so profitability of companies go through the roof … is that then taxed by the government and redistributed as some level of income as a U as a UHI or UBI? In other words … massive profitability … Someone needs to be buying it and someone needs to be able to have the capital to buy it.“ | Diamandis laut Gizmodo und Storyboard. Ein „>>“ steht direkt vor „is that then taxed“, deshalb am Bild bestätigen. | ok |
| Einleitung der Antwort | 1:14:29–1:14:33 | „Yeah. Um, well, one like side recommendation I have is …“ | Musk | Musk nennt den Rat selbst eine Nebenbemerkung. Darum sind Z. 60 („It was an answer to a question“) und Z. 62 („he answered with retirement advice“) **zugespitzt**: Im Ablauf war es seine Antwort, und auf die Steuer-Frage selbst ging er nicht ein. Gizmodo beschreibt es genauso („seemingly unwilling to acknowledge any role for the government … pivoted“). Darf bleiben. |
| UHI | 1:06:19 | „which is UHI. – Yes. Everyone can have whatever they want.“ | wahrscheinlich Musk | ok (Z. 19) |
| radical change | 1:06:36–1:06:47 | „yes the transition will be bumpy uh because humans don't like simultaneously [clears throat] yes we'll have radical change social unrest and immense [laughter] prosperity“ | wahrscheinlich Musk: Davor spricht ein anderer über „the next 3 to seven years“; Musk sagt kurz darauf sicher „bumpy ride“. | ok (Z. 110), am Ton bestätigen, sonst K2 |
| Vorhersage zu Beginn | 0:07:31–0:07:57 | „how do we go towards universal high income instead of social unrest?“ … „have universal high income and social unrest“ – „that's my prediction“ – „Is that your actual prediction?“ – „Yeah.“ | Frage: Diamandis; Vorhersage: Musk (laut Abschrift bei singjupost, Suchauszug) | stützt Z. 110 |
| figured out | 1:08:20–1:08:28 | „So, how does it work? Reason through it with me. – Listen, by the way, I'm open to ideas here. – Okay. – Uh so, it's not like I got this all figured out.“ | wahrscheinlich Musk (Antwort auf „Reason through it with me“) | ok (Z. 20), K5 |
| know the answers | 1:08:41–1:09:02 | „this is going to be a bumpy ride and it's not like I know the answers here. Um but I I I have decided to look on the bright side. … I'd like to thank thank you guys for being an inspiration in this regard.“ | sicher Musk (er dankt den Gastgebern) | Ersatz für K5 |
| Optimist | 1:09:07–1:09:16 | „because I I actually think it's it it is better to be a an optimist and wrong than a pessimist and right. – Yes, for sure. – Um for quality of life.“ | wahrscheinlich Musk: Der Satz setzt sein „look on the bright side“ fort, und die Davos-Fassung lautet gleich (Suchauszug: „for quality of life, it is actually better to err on the side of being an optimist and wrong rather than a pessimist and right“). | ok (Z. 100–101); der Kontext „quality of life“ stimmt |
| demonetizing / materials and electricity | 1:10:00–1:10:42 | „So we're we're basically demonetizing everything. I mean labor becomes the cost of capex and electricity. AI is basically uh intelligence available uh >> at a dimminimous price. … Things get down to basic cost of materials and electricity, right?“ | **unklar**: Sprecherwechsel mitten im Satz; „demonetizing“ ist Diamandis' Stichwort | Karte bei 1:24 → **MB1** |
| tax and redistribute / prices drop | 1:10:43–1:10:58 | „when we say universal high income, it sounds like it's a tax and redistribute, but that's not the case … my best guess for how this will manifest is that prices will drop“ | wahrscheinlich Musk (UHI ist sein Begriff) | ok (Z. 63, 68) |
| deflation | 1:10:59–1:11:22 | „prices in in dollar terms are the ratio between the output of goods and services and the money supply. – Sure. – So if your output of goods and services increases faster than the money supply, you will have deflation“ | wahrscheinlich Musk (das „Sure.“ sagt der Gastgeber) | ok (Z. 18), K4 |
| money supply | 1:11:29–1:11:40 | „let's not worry about growing the money supply. It won't matter because the output of goods and services actually will grow faster than the money supply“ | wahrscheinlich Musk | stützt Z. 66 |
| government | 1:26:00–1:26:30 | „government is very slow moving as as we all know … government really can't react to the AI. It's it's uh AI is moving you know 10 times faster than government maybe more. Um the the one the one thing that the government can do is just is just issue people money. … try and keep the peace“ | wahrscheinlich Musk: Die Wortwiederholungen sind typisch für ihn, und direkt danach kommt seine 1.776-$-Bemerkung. | ok (Z. 78–79), Karten 6:14 und 6:18 am Ton bestätigen |

Quellen: [Folge](https://www.youtube.com/watch?v=RSNuB9pj9P8) · [Short](https://www.youtube.com/watch?v=sf1gUoREC54) · [Gizmodo](https://gizmodo.com/worlds-richest-man-says-dont-bother-saving-for-retirement-2000708250) (Suchauszug)

### 3c · „money won't matter in 2036“ (The Economist, Juli 2026) → ok, Wortlaut nur aus Berichten

- Interview mit Chefredakteurin Zanny Minton Beddoes in der Giga Texas, ab 23.7.2026 bei Economist Insider, auf YouTube seit 29.7.2026 (laut API; 1:25:07; Kapitel „Work is going to be optional“ ab 31:20). „This summer“ stimmt.
- Berichtet wird übereinstimmend: „I'll make another prediction. Money won't matter in 2036.“ (Free Press Journal, Forbes 13.8.2026, 247wallst 28.7.2026, hwbusters). Ein Suchauszug erwähnt eine Podcast-Abschrift, in der bei einer **Folgefrage** „2030“ steht. Darum vor der Zitatkarte am Video gegenhören.
- Untertitel gab es nicht: keine manuellen Untertitel (API), die automatischen nicht abrufbar. Zitatkarte statt Clip ist deshalb richtig.
- „only if the politics permits this great abundance“ stammt von Vinod Khosla, nicht von Musk. Ein Suchauszug schreibt es fälschlich Musk zu; im Film steht es nicht.
- Quellen: [Video](https://www.youtube.com/watch?v=XuoqKYxDHVc&t=1880s) · [Free Press Journal](https://www.freepressjournal.in/tech/money-wont-matter-in-2036-elon-musk-predicts-big-shift-in-global-economy-as-ai-driven-abundance-takes-hold) · [Forbes, 13.8.2026](https://www.forbes.com/sites/davidbirnbaum/2026/08/13/elon-musk-says-money-wont-matter-by-2036-scarcity-has-other-plans/)

### 3d · +20–30 % und der Mond (Isaacson, 20.10.2026) → ok, ein Satz zugespitzt

- 0:16:40–0:17:20 (automatische Untertitel): „my guess is digital superintelligence probably improves the uh output of goods and services by 20 to 30%. Something like that. Call it like a you know, maybe a 30% increase in uh the the economy of Earth. So, that's still significant. It's like $30 trillion a year incremental.“
- Isaacson fragt nach: „Is that very much, really? Is that transformative?“ Musk (0:17:25): „30% more stuff is still a lot. … but if you have robots and … you get to space and … you can do a mass driver on the moon, um, then you can get to, I think, potentially a million times the size of the Earth economy.“ Auf die nächste Frage („money becomes irrelevant …?“) antwortet er (0:17:53): „Yeah, money becomes irrelevant.“
- Z. 33–35 und die Karten bei 2:26 und 2:39 sind damit **ok**. Z. 36 („For that, he says, the economy has to reach into space“) ist **zugespitzt**: Musk beschreibt einen Weg, keine ausdrückliche Bedingung. In der Gesprächsfolge kommt „money becomes irrelevant“ aber erst nach dem Mond-Schritt. Darf bleiben.
- Quelle: [Video, ab 0:16:40](https://www.youtube.com/watch?v=AQnwQHMnCrE&t=1000s)

### 3e · BLS-Preise 2000 → 2025 → ok, nachgerechnet

Monatswerte des CPI-U, nicht saisonbereinigt; gerechnet mit `cpi` 2.1.0.

| Kategorie | Serie | Jan. 2000 | Dez. 2025 | Δ bzw. Faktor | Aug. 2026 (Faktor ab 2000) |
|---|---|---|---|---|---|
| alle Preise | CUUR0000SA0 | 168,8 | 324,054 | +92,0 % | 1,98 |
| Fernseher | CUUR0000SERA01 | 5.115,9 | 92,729 | **0,0181** (−98,2 %) | 0,0189 |
| Software & Zubehör | CUUR0000SEEE02 | 87,9 | 23,727 | −73,0 % | 0,32 |
| Mobilfunk | CUUR0000SEED03 | 80,6 | 45,085 | −44,1 % | 0,59 |
| Miete | CUUR0000SEHA | 181,1 | 440,667 | +143,3 % | 2,48 |
| Krankenhausleistungen | CUUR0000SEMD01 | 112,6 | 446,056 | **3,96** (+296,1 %) | 4,08 |
| Pflegeheime & Tagespflege | CUUR0000SEMD02 | 113,9 | 303,44 | +166,4 % | 2,77 |
| Studiengebühren | CUUR0000SEEB01 | 326,0 | 966,259 | +196,4 % | 3,03 |
| Arztleistungen (Kontrolle) | CUUR0000SEMC01 | 239,6 | 431,766 | +80,2 % | 1,83 |

- Alle Einblendungen (3:02, 3:10, 3:13, 3:18) stimmen. Der Fernseher-Index ist qualitätsbereinigt, also „the same TV“ ✓.
- Der VO sagt richtig „hospital care“: Arztleistungen (+80 %) und Medikamente (+78 %) liegen unter der Inflation. Der Index misst den Preis der Leistung, egal wer zahlt; „you now pay“ ist als allgemeines Du vertretbar.
- Mit Jahresdurchschnitten kämen leicht andere Werte heraus (alle Preise +87 %). Die Karten sagen richtig „Jan 2000 – Dec 2025“ bzw. „2000–2025“.
- Quelle: [BLS CPI](https://www.bls.gov/cpi/data.htm)

### 3f · „A year in a nursing home … five years of the average Social Security check“ → ok

- **CareScout Cost of Care Survey 2025** (veröffentlicht 2.3.2026): Ein Einzelzimmer kostet im US-Median 355 $ pro Tag, also **129.575 $ im Jahr**; ein Doppelzimmer 315 $ pro Tag, also 114.975 $ (Suchauszug).
- **SSA, COLA 2026:** Die durchschnittliche Altersrente steigt nach der Anpassung von 2.015 $ auf **2.071 $ im Monat**, das sind 24.852 $ im Jahr (Suchauszug).
- Verhältnis: Einzelzimmer **5,2 Jahresrenten**, Doppelzimmer 4,6. Je nach Bundesstaat sind es zwischen 3,7 (Texas: 91.250 $) und 5,9 (Florida: 146.000 $). „about as much as five years“ ✓. In der Karte „PRIVATE ROOM“ und „US median“ behalten.
- Quellen: [CareScout / Business Wire](https://www.businesswire.com/news/home/20260302283881/en/CareScout-Releases-2025-Cost-of-Care-Survey-Results) · [SSA COLA-Faktenblatt 2026](https://www.ssa.gov/cola/factsheets/2026.html)

### 3g · Kongress, Schecks und „checks for everyone still need Congress“ → ok

- **Entwürfe 2026, keiner beschlossen (Stand der Suchauszüge bis Okt. 2026):**
  - Sen. Mark Kelly, „Make AI Work for Americans Act“ (Ende Sept. 2026): ein Treuhandfonds „AI Horizon Fund“, finanziert durch Steuern auf Digitalwerbung, KI-Nutzung und Übergewinne. Damit sollen Weiterbildung, Arbeitslosengeld u. a. bezahlt werden. Bisher ohne Mitunterzeichner.
  - KI-Token-Steuer zur Jobsicherung (Repräsentantenhaus, Fortune 1.9.2026).
  - Weitere Entwürfe: AI Tax and Work Protection Act (Rep. Casar), AI-Related Job Impacts Clarity Act (Warner/Hawley; Hausfassung H.R. 9352, Horsford, 18.6.2026), eine Reform der Arbeitslosenversicherung (Wyden).
  - Alle liegen in Ausschüssen. Die Karte bei 5:05 ist damit **ok (dünn)**. Den Stand am Upload-Tag auf congress.gov nachsehen: Nach der Wahl tagt der Kongress noch einmal.
- **„checks for everyone still need Congress“:** Nach der US-Verfassung (Art. I § 9) darf Geld aus dem Treasury nur aufgrund gesetzlicher Bewilligung fließen. Die drei Scheck-Runden 2020/21 kamen jeweils per Gesetz: CARES Act (März 2020), Consolidated Appropriations Act 2021 (Dez. 2020) und American Rescue Plan (März 2021). Musks eigenes Gegenbeispiel aus Moonshots (1:26:38: 1.776 $ an Soldaten, Dez. 2025) ging nicht an alle und kam nach Berichten aus bereits bewilligten Mitteln (hier nicht nachgeprüft). → **ok**; die Karte bei 6:23 ist unvollständig (K9).
- Quellen: [KJZZ, 25.9.2026](https://www.kjzz.org/text/politics/2026-09-25/sen-kelly-proposes-federal-trust-fund-to-shield-workers-from-large-scale-ai-related-job-losses) · [Roll Call, 25.9.2026](https://rollcall.com/2026/09/25/tech-taxes-would-drive-kellys-labor-focused-ai-horizon-fund/) · [Fortune, 1.9.2026](https://www.fortune.com/2026/09/01/bill-tax-ai-tokens-fund-jobs-technology-unemployment/) · [GovAI-Überblick](https://www.governance.ai/research-paper/how-congress-is-approaching-ais-labor-market-impacts) · [Verfassung (National Archives)](https://www.archives.gov/founding-docs/constitution-transcript) · [CARES Act](https://www.congress.gov/bill/116th-congress/house-bill/748) · [Consolidated Appropriations Act 2021](https://www.congress.gov/bill/116th-congress/house-bill/133) · [American Rescue Plan](https://www.congress.gov/bill/117th-congress/house-bill/1319)

### 3h · Acemoglu (Weltbank, Juni 2026) → ok

- ABCDE 2026 („Jobs for the Next Generation“), Weltbank mit Georgetown, 16.–17.6.2026 in Washington; Acemoglu hielt die Keynote am ersten Tag. Das Video wurde am 16.6.2026 veröffentlicht.
- Kontext (Hand-Untertitel des Kanals, 0:46:30–0:47:23): „AI will accelerate automation … what AGI means is that AI models will reach expertise equivalent to the very best, perhaps top 1% of workers in pretty much all activities, which means that they will take over pretty much all jobs. … it would have 100%, no doubt, an unequalizing impact on pre-tax income distribution. Now, could we redistribute enough to make the post-tax much more equal? Perhaps. But again, there is no evidence from history to show that.“
- Die Einordnung Z. 69 trifft das: „that“ heißt besteuern und verteilen; „most jobs“ ist sogar vorsichtiger als sein „pretty much all“. „enough“ meint bei ihm genug für deutlich gleichere Nettoeinkommen. Das ist nah genug an „could that be enough“. Nobelpreis 2024 ✓, „This June“ ✓.
- Quellen: [Video, ab 0:46:26](https://www.youtube.com/watch?v=7v2iPkIu0U0&t=2786s) · [Weltbank: ABCDE 2026](https://www.worldbank.org/en/events/2026/06/16/abcde-2026)

### 3i · Autonomy Day 2019 und die Robotaxis heute → ok

- 22.4.2019, Teslas Investoren-Tag zum autonomen Fahren. C3 (3:13:58–3:14:05) stimmt mit den Untertiteln überein (3n). Neun Minuten früher (3:04:52–3:05:08) sagt Musk: „only criticism and it's a fair one and sometimes I'm not on time but I get it done and the tesla team gets it done“ → Z. 86 ✓ („Earlier, on that same stage“), die Karte bei 6:53 → MB2. Ebenfalls 2019 (3:05:28): „we expect to have the first operating robotaxis next year with no one in them“.
- **Was kam:**
  - Bezahlte Fahrten in Austin gibt es seit Juni 2025, zunächst mit Sicherheitsbegleiter.
  - Fahrten ohne Begleiter im Auto gibt es seit 22.1.2026 (Musk auf X: „Just started Tesla Robotaxi drives in Austin with no safety monitor in the car“). Anfangs fuhr laut Electrek ein Begleitauto hinterher.
  - **Flotte:** Tesla meldete am 10.10.2026 „300+ Cybercabs“ in Austin, ohne zu sagen, wie viele ohne Begleiter fahren. Unabhängige Zählungen kommen auf 40–60 Autos ohne Begleiter (Bloomberg: 59 in Austin, Dallas und Houston; Texas DMV: 42 registriert; Datum unklar).
- „A small fleet, not a million“ stimmt bei jeder Zählung, „Years late“ (5–6 Jahre) ebenfalls. Der VO nennt richtigerweise keine Zahl.
- Quellen: [Video](https://www.youtube.com/watch?v=Ucp0TTmvqOE&t=11630s) · [CNBC, 22.4.2019](https://www.cnbc.com/2019/04/22/elon-musk-says-tesla-robotaxis-will-hit-the-market-next-year.html) · [Electrek, 22.1.2026](https://electrek.co/2026/01/22/tesla-starts-robotaxi-rides-without-safety-monitor-in-austin-what-you-need-to-know/) · [InsideEVs](https://insideevs.com/news/785220/tesla-robotaxi-austin-no-safety-monitor/) · [Not a Tesla App](https://notateslaapp.com/news/4802/tesla-now-has-300-cybercabs-in-austin-dallas-rides-next)

### 3j · Allianz 64 % → ok

- Allianz Life, 2025 Annual Retirement Study (Business Wire, 22.4.2025): „nearly two in three Americans (64%) worry more about running out of money than death“. Nach Generationen: Gen X 70 %, Millennials 66 %, Boomer 61 %.
- Methode: online, 1.000 Befragte ab 25, Jan./Feb. 2025, mit Mindesteinkommen (50.000 $ allein, 75.000 $ als Paar) oder 150.000 $ Anlagevermögen. Der VO folgt Allianz' eigener Formulierung; genauer wäre K1.
- Quelle: [Business Wire, 22.4.2025](https://secure.businesswire.com/news/home/20250422646926/en/Americans-Are-More-Worried-About-Running-Out-of-Money-Than-Death) (Suchauszug)

### 3k · Bismarck, FDR, Ida May Fuller → ok (nach M1)

- **Deutschland:** Laut SSA wurde Deutschland 1889 „the first nation in the world to adopt an old-age social insurance program“. Beiträge kamen „from the employee, the employer and the government“. Gemeint ist das Gesetz vom 22.6.1889 (Invaliditäts- und Altersversicherung), in Kraft seit 1.1.1891, mit Rente ab 70 (65 erst 1916). „Germany answered first“ ✓, die Karte bei 8:52 ✓.
- **FDR:** Der Social Security Act wurde am 14.8.1935 unterzeichnet. Der Ton von EN7NUindB38 ist das „Statement on Signing the Social Security Act“ (American Presidency Project), gesprochen „poverty-stricken“, geschrieben „poverty-ridden“. C5 stammt also aus dieser Aufnahme ✓. „At the signing, … said why“ ✓.
- **Ida May Fuller:** Scheck Nr. 00-000-001 über 22,54 $ vom 31.1.1940, Ludlow (Vermont), im Ruhestand seit Nov. 1939. Sie starb am 27.1.1975 mit 100 Jahren, hatte 24,75 $ eingezahlt und insgesamt 22.888,92 $ bekommen. „One winter“ ✓, „until she was a hundred“ ✓. „opened her mailbox“ ist szenisch.
- **M1:** Pauschalzahlungen gab es ab 1937 (s. oben).
- Quellen: [SSA: Otto von Bismarck](https://www.ssa.gov/history/ottob.html) · [American Presidency Project](https://www.presidency.ucsb.edu/documents/statement-signing-the-social-security-act-0) · [SSA: Ida May Fuller](https://www.ssa.gov/history/imf.html) (alle Suchauszug)

### 3l · Treuhänder-Bericht 2026 → ok

- Die Rücklagen des Altersrenten-Fonds (OASI) sind im **4. Quartal 2032** aufgebraucht, ein Quartal früher als im Vorjahr; danach wären **78 %** der Leistungen zahlbar. OASI und DI zusammen reichen bis zum 3. Quartal 2034, dann 83 %.
- „Unless Congress acts … will shrink in the early twenty-thirties. Shrink, not stop.“ ✓ Die Karte bei 9:42 ✓.
- Quellen: [SSA, Trustees Report 2026](https://www.ssa.gov/OACT/TR/2026/IV_B_LRest.html) (Suchauszug) · [SSA: Status of the Programs](https://www.ssa.gov/OACT/TRSUM/) · [Fox Business](https://foxbusiness.com/personal-finance/social-security-has-less-than-10-years-before-reserves-exhausted-new-trustees-report-warns)

### 3m · „The richest man on Earth“ und die relativen Zeitangaben → ok

- **Forbes, Liste vom November 2026:** Musk liegt mit 869 Mrd. $ (Stand 1.11.2026) auf Platz 1, mit großem Abstand (März 2026: 839 Mrd. $ gegen 257 Mrd. $ für Larry Page auf Platz 2). Bis zum 15.11. ist kein Wechsel denkbar. Keine Zahl nennen und nicht „trillionaire“ sagen; Forbes führt ihn am 1.11. unter 1 Bio. $. Quelle: [Forbes Argentina, Nov. 2026](https://www.forbesargentina.com/millonarios/las-10-personas-mas-ricas-mundo-noviembre-2026-n101542) (Suchauszug)

| Stelle | Wort | Bezug | Urteil am 15.11.2026 |
|---|---|---|---|
| Z. 8 | this year | Moonshots 6.1. · X 17.4. · Economist Juli · Isaacson 20.10. · X 29.10.2026 | ✓ |
| Z. 12, 76 | Last winter | aufgenommen 22.12.2025, veröffentlicht 6.1.2026 | ✓ (Winter 2025/26) |
| Z. 42 | today | BLS Dez. 2025 (Aug. 2026 praktisch gleich) | ✓ |
| Z. 59 | This spring | X-Post 16./17.4.2026 | ✓ |
| Z. 64 | today | kein UHI-Gesetz, Stand 11.11.2026 | ✓ |
| Z. 69 | This June | Keynote 16.6.2026 | ✓ |
| Z. 76 | This summer | Economist, Juli 2026 | ✓ |
| Z. 83 | In April twenty nineteen | 22.4.2019 | ✓ |
| Z. 86 | Earlier, on that same stage | 3:04:52 liegt vor 3:13:58 | ✓ |
| Z. 121 | in the early twenty-thirties | 4. Quartal 2032 | ✓ |
| Karten | JAN 2026 · JUL 2026 · Oct 2026 · July 2025 · 2025 · 2026 | wie oben | ✓; „Apr 17, 2026“ → K8 |

Die Jahreszeiten gelten für die Nordhalbkugel; das ist üblich.

### 3n · Clips C1–C5 gegen die YouTube-Untertitel → Wortlaut überall ok

| Clip | Quelle · In–Out | Wortlaut `clips.json` | Untertitel (Wortzeiten) | Urteil |
|---|---|---|---|---|
| C1 | Short sf1gUoREC54 · 0:01,600–0:16,000 (14,4 s) | „Don't worry about like squirreling money away for uh retirement in like 10 or 20 years. It won't matter. / Either either we're not going to be here or / it's it's you you won't need to save for retirement. If if any of the things that we've said are true, saving for retirement will be irrelevant.“ | automatisch, Wort für Wort gleich: „like“ 1,600 · „don't“ 1,920 · „irrelevant.“ 15,360 · „>> The“ 16,080. In der Langfassung (1:14:33–1:14:54) ist es derselbe Wortlaut, dort kommen „No.“ (1:14:38) und „Okay.“ (1:14:40) hinzu. | ok · Schnitt K12 · Sprecher des Einwurfs K11 · in den Untertiteln kein [Music], Musikbett trotzdem am Ton prüfen |
| C2 | RSNuB9pj9P8 · 1:13:54,400–1:14:00,000 (5,6 s) | „Is that then taxed by the government and redistributed as some level of income as a U- as a UHI“ | „uh“ 54,320 · „>> is“ 54,480 … „UHI“ 59,360 · „or“ 00,000 | ok · Sprecher Diamandis am Bild bestätigen · Schnitt K13 |
| C3 | Ucp0TTmvqOE · 3:13:58,600–3:14:05,000 (6,4 s) | „But next year for sure, we will have over a million robotaxis on the road.“ | „but“ 58,800 · „next year for sure“ 59,640 … „road“ 04,680; nächstes Wort bei 09,260 („the fleet wakes up“) | ok · Applaus am Ton prüfen |
| C4 | 7v2iPkIu0U0 · 0:47:17,500–0:47:23,750 (6,25 s) | „Perhaps. But again, there is no evidence from history to show that.“ | Hand-Untertitel: „Perhaps.“ ab 47:17,6, „But again, there is no evidence from history to show that.“ ab 47:18,3; automatisch: „perhaps“ 17,599 … „that“ 23,200 · „and“ 23,760 | ok · Schnitt K14 |
| C5 | EN7NUindB38 · 0:00:30,300–0:00:42,900 (12,6 s) | „Young people have come to wonder what would be their lot when they came to old age. The man with a job has wondered how long the job would last.“ | automatisch: „young“ 30,359 … „last“ 42,320 · „this“ 43,320; die Hand-Untertitel der Kopie JG1Eba0tnwo sind gleichlautend | ok · Text des Statement on Signing vom 14.8.1935 |

Mit K12–K14 ergibt sich: C1 ≈ 14,1 s, C2 ≈ 5,5 s, C4 ≈ 6,2 s. Alle Clips zusammen ≈ 44,6 s, das Moonshots-Paket ≈ 19,6 s (≤ 20 s). Die Abstände bleiben unverändert ≥ 45 s.

### 3o · Klingt etwas nach Finanzberatung? → nein

- „This isn't financial advice.“ steht bei 1:45 (Z. 21), dazu die Karte NOT FINANCIAL ADVICE.
- Die zwei Wetten (Z. 94–97) zeigen eine Logik ohne Betrag, Produkt oder Quote. „Keep saving“ steht nur als Fall in der Wette, nie als Aufforderung.
- Der Kernsatz („Saving was never a bet against the future. It's the bridge to it.“) ist eine Wertung, kein Anlagerat.
- Grenzwertig ist nur die große Karte „STOP SAVING MONEY“ (0:00), weil sie wie ein Rat liest (K3).

---

## 4 · Vollständige Aussagen-Tabelle Sprechtext (vo-v2 = vo-v3, in Sprechreihenfolge)

| # | Z. | Aussage (VO) | Ergebnis | Primärquelle | Anmerkung |
|---|---|---|---|---|---|
| 1 | 1 | „Elon Musk says saving money is pointless.“ | zugespitzt | [X-Post 29.10.2026 via Futurism](https://futurism.com/future-society/elon-musk-saving-money-pointless) (Suchauszug) | Kürzung ohne Zeitraum und Bedingung; beides kommt nach 10 s zurück (3a). Trägt. |
| 2 | 4–5 | „In his future, you won't need it. Machines will make almost everything, so cheaply that money won't matter anymore.“ | ok | [Moonshots #220](https://www.youtube.com/watch?v=RSNuB9pj9P8) 1:14:31 · [Isaacson](https://www.youtube.com/watch?v=AQnwQHMnCrE) 0:17:53 | Musks Sicht korrekt: „It won't matter“, „money becomes irrelevant“. |
| 3 | 6 | „To him, saving is a bet against that future.“ | zugespitzt | – | Unsere Deutung, als „To him“ gekennzeichnet; kein Musk-Wort. Pflanzung für den Kernsatz. |
| 4 | 8 | „He means it. The richest man on Earth …“ | ok | [Forbes, Nov. 2026](https://www.forbesargentina.com/millonarios/las-10-personas-mas-ricas-mundo-noviembre-2026-n101542) (Suchauszug) | Platz 1 mit 869 Mrd. $ (1.11.2026), großer Abstand (3m). |
| 5 | 8 | „… has said it again and again this year.“ | ok | Moonshots 6.1. · X 17.4. · Economist Juli · Isaacson 20.10. · X 29.10.2026 | Mindestens vier Fassungen 2026. Moonshots wurde 2025 aufgenommen, aber 2026 veröffentlicht. |
| 6 | 9 | „But he has also told us how to check him.“ | zugespitzt | C1 | Er nennt eine Bedingung, keine Prüfmethode; die Prüfliste ist unsere Konstruktion (Z. 22 sagt das offen). |
| 7 | 10 | „Part of his future is already here: machines do more and more of the work.“ | ok | Nr. 19–21 | Amazon, KI im Büro. |
| 8 | 11 | „But the part that would pay for your old age is still only a promise.“ | ok | Nr. 41–42 | Kein Gesetz, kein Programm. |
| 9 | 12 | „Last winter, on a podcast with the entrepreneur Peter Diamandis, he put it like this.“ | ok | [Moonshots #220](https://www.youtube.com/watch?v=RSNuB9pj9P8), Videobeschreibung | Aufgenommen 22.12.2025, veröffentlicht 6.1.2026 → „last winter“ ✓. Diamandis gründete die XPRIZE Foundation ✓. |
| 10 | 13 | [CLIP C1] | ok (Wortlaut) | [Short](https://www.youtube.com/watch?v=sf1gUoREC54) 0:01,6–0:16,0 | Untertitel = `clips.json`; Sprecher des Einwurfs offen (K11); Schnitt K12. |
| 11 | 14 | „In other words: if his picture of the future comes true.“ | ok | C1 | Sinngemäß für „If any of the things that we've said are true“ (F5). |
| 12 | 15 | „And behind that picture is a real argument, not a whim.“ | ok | Nr. 13–15 | Wertung, belegt. |
| 13 | 16 | „Artificial intelligence makes thinking almost free. Robots make labor almost free.“ | ok | Moonshots 1:10:00–1:10:42 · [Fox Business, 19.11.2025](https://foxbusiness.com/technology/musk-predicts-money-stop-being-relevant-future-ai-robotics-progress) | Musks Kernthese (Arbeit „optional“, Intelligenz fast gratis). Der VO zitiert nicht. |
| 14 | 17 | „Then almost anything costs little more than its materials and the electricity to make it.“ | ok | Isaacson 0:17:53 · Fox Business 19.11.2025 (Suchauszug) | Als Wiedergabe seines Arguments belegt („wattage and tonnage“, „electricity and mass“). Nur die Karte bei 1:24 hat ein Sprecherproblem → MB1. |
| 15 | 18 | „And when goods pile up faster than money, prices don't rise. They fall.“ | ok | Moonshots 1:10:59–1:11:22 · [X 17.4.2026 via Washington Times](https://www.washingtontimes.com/news/2026/apr/17/elon-musk-proposes-universal-high-income-answer-ai-driven-job-losses/) (Suchauszug) | Sein Argument (auch im Economist-Interview: Deflation statt Inflation). |
| 16 | 19 | „Everyone can afford what they want. He calls it universal high income.“ | ok | Moonshots 1:06:19 · X 17.4.2026 | „which is UHI. – Yes. Everyone can have whatever they want.“ |
| 17 | 20 | „Even he says he doesn't have it all figured out.“ | ok | Moonshots 1:08:20–1:09:02 | „it's not like I got this all figured out“ (wahrscheinlich Musk), „it's not like I know the answers here“ (sicher Musk). |
| 18 | 29 | „The first line is where he's closest to right.“ | ok | – | Wertung. |
| 19 | 30 | „Amazon's warehouses already run more than a million robots.“ | ok | [GeekWire, Juli 2025](https://www.geekwire.com/2025/amazons-robot-workforce-hits-1-million-heres-what-they-all-do/) · [Tom's Hardware](https://www.tomshardware.com/tech-industry/amazon-just-deployed-its-one-millionth-robot-in-its-warehouses-and-theyll-soon-outnumber-humans-generative-ai-to-help-cut-robot-fleet-travel-time-by-10-percent) | Der millionste Roboter kam im Juli 2025 (Japan), zusammen mit dem Steuerungsmodell DeepFleet. |
| 20 | 31 | „In offices, artificial intelligence writes first drafts, checks code, answers customers.“ | ok | F12 (Gallup, Jan. 2026) | allgemein bekannt. |
| 21 | 32 | „It isn't almost everything. Not yet. But it's spreading fast.“ | ok | F10–F12 | Wertung mit Beleg (etwa die Hälfte der US-Beschäftigten nutzt KI zumindest gelegentlich). |
| 22 | 33 | „… superintelligence alone would give the world twenty to thirty percent more stuff.“ | ok | [Isaacson](https://www.youtube.com/watch?v=AQnwQHMnCrE&t=1000s) ≈ 0:17:02 | „my guess is digital superintelligence probably improves the output of goods and services by 20 to 30%“; „stuff“ ist sein Wort. |
| 23 | 34 | „That's a lot, he says. He's right.“ | ok | ebd. 0:17:25 | „30% more stuff is still a lot“. |
| 24 | 35 | „But it isn't the end of money.“ | ok | ebd. | Folgt aus seiner Gesprächsfolge (3d). |
| 25 | 36 | „For that, he says, the economy has to reach into space: robots, rockets, and a launcher on the Moon.“ | zugespitzt | ebd. 0:17:25–0:17:56 | Er beschreibt einen Weg, keine ausdrückliche Bedingung; „launcher“ = „mass driver“ ✓. Darf bleiben. |
| 26 | 41 | „This is the heart of his argument. And half of it is already true.“ | ok | Nr. 27–30 | Wertung, belegt. |
| 27 | 42 | „For every dollar a TV cost in the year two thousand, the same TV costs about two cents today.“ | ok | [BLS CPI](https://www.bls.gov/cpi/data.htm) CUUR0000SERA01 | Faktor 0,0181 (Aug. 2026: 0,0189); qualitätsbereinigt → „the same TV“. Selbst nachgerechnet. |
| 28 | 43 | „Software and phone plans got cheaper too.“ | ok | BLS SEEE02, SEED03 | −73,0 % und −44,1 %. |
| 29 | 44 | „But for every dollar of hospital care back then, you now pay about four.“ | ok | BLS SEMD01 | Faktor 3,96 (Aug. 2026: 4,08). „hospital care“, nicht „medicine“ ✓. |
| 30 | 45 | „Nursing homes, rent and college also rose far faster than prices overall.“ | ok | BLS SEMD02, SEHA, SEEB01, SA0 | +166 %, +143 % und +196 % gegenüber +92 %. |
| 31 | 46–48 | „What a machine can copy gets cheap. What takes a person's time, or a particular place, does not.“ | zugespitzt | Baumol-Effekt (Lehrbuch) | Faustregel, im Kern richtig. TV-Preise fallen auch durch Qualitätsbereinigung und Welthandel; „place“ ist kein Baumol-Effekt (K7). |
| 32 | 51 | „Care costs what it does because it's a person's time.“ | ok | F18 | Pflege ist personalintensiv. |
| 33 | 52 | „A year in a nursing home already costs about as much as five years of the average Social Security check.“ | ok | [CareScout 2025](https://www.businesswire.com/news/home/20260302283881/en/CareScout-Releases-2025-Cost-of-Care-Survey-Results) · [SSA COLA 2026](https://www.ssa.gov/cola/factsheets/2026.html) (Suchauszüge) | Einzelzimmer 129.575 $ gegen 24.852 $ = 5,2; Doppelzimmer 4,6 (3f). |
| 34 | 53 | „Things got cheap. The things you need when you're old did not.“ | ok | Nr. 27–33 | Wertung, belegt. |
| 35 | 59 | „His answer is a universal high income. This spring, he got more specific: checks from the federal government.“ | ok | [Washington Times, 17.4.2026](https://www.washingtontimes.com/news/2026/apr/17/elon-musk-proposes-universal-high-income-answer-ai-driven-job-losses/) (Suchauszug) | Im Januar war UHI bei ihm vor allem „prices will drop“; im April machte er Bundes-Schecks zum Weg → „more specific“ ✓. Datum K8. |
| 36 | 60 | „Remember his advice about retirement? It was an answer to a question.“ | zugespitzt | Moonshots 1:13:46–1:14:38 | Der Rat folgte direkt auf die Frage; Musk leitete ihn aber selbst als „side recommendation“ ein (3b). |
| 37 | 60 | „His host had just asked about the profits from all those machines.“ | ok | ebd. | „profitability … taxed by the government and redistributed … massive profitability“; die Antwort folgt 35 s später ✓. |
| 38 | 61 | [CLIP C2] | ok (Wortlaut) | Moonshots 1:13:54,4–1:14:00,0 | Sprecher Diamandis laut [Gizmodo](https://gizmodo.com/worlds-richest-man-says-dont-bother-saving-for-retirement-2000708250) (Suchauszug); am Bild bestätigen; Schnitt K13. |
| 39 | 62 | „Asked who would pay, he answered with retirement advice.“ | zugespitzt | ebd. · Gizmodo | „who would pay“ verdichtet die Frage nach Steuer und Kaufkraft („Someone needs to be able to have the capital to buy it“). Seine Antwort war wörtlich der Spar-Rat. Darf bleiben. |
| 40 | 63 | „To be fair, elsewhere in that conversation he named two ideas: prices will fall, and the government could just issue people money.“ | ok | Moonshots 1:10:51 · 1:26:07–1:26:30 | Beides wahrscheinlich Musk; „elsewhere“ ✓ (vor und nach 1:14). |
| 41 | 64 | „But today, there is no such income. No law. No amount. No budget.“ | ok | Washington Times 17.4.2026 · [GovAI](https://www.governance.ai/research-paper/how-congress-is-approaching-ais-labor-market-impacts) | Vorschlag auf X; kein Gesetz, kein Betrag, kein Programm (Stand 11.11.2026). |
| 42 | 65 | „In Congress, there are a few bills about artificial intelligence and jobs. None has passed.“ | ok (dünn) | [KJZZ](https://www.kjzz.org/text/politics/2026-09-25/sen-kelly-proposes-federal-trust-fund-to-shield-workers-from-large-scale-ai-related-job-losses) · [Roll Call](https://rollcall.com/2026/09/25/tech-taxes-would-drive-kellys-labor-focused-ai-horizon-fund/) · [Fortune](https://www.fortune.com/2026/09/01/bill-tax-ai-tokens-fund-jobs-technology-unemployment/) | Alle in Ausschüssen (3g); Stand am Upload-Tag prüfen. |
| 43 | 66 | „And if the government just prints the money for those checks?“ | ok | Moonshots 1:11:29 · X 17.4.2026 | Frage, kein Faktum; nah an Musks eigener Sicht („let's not worry about growing the money supply“). |
| 44 | 67 | „Homes, hospital beds, a nurse's hours: they don't multiply. That's where new money would push prices up.“ | zugespitzt | F22 (Logik) · F24 | Als Konditional vertretbar. Wohnungen und Betten lassen sich bauen, aber langsam; wie stark der Effekt ist, ist umstritten. |
| 45 | 68 | „The other way is the one his host asked about: tax the profits, and share them out.“ | ok | C2 · Moonshots 1:10:43 | Richtig dem Gastgeber zugeordnet; Musk selbst: „it sounds like it's a tax and redistribute, but that's not the case“. |
| 46 | 69 | „This June, the Nobel-winning economist Daron Acemoglu asked whether that could be enough, if machines took over most jobs.“ | ok | [Video](https://www.youtube.com/watch?v=7v2iPkIu0U0&t=2786s) 0:46:26–0:47:23 · [Weltbank](https://www.worldbank.org/en/events/2026/06/16/abcde-2026) | Kontext stimmt (3h). |
| 47 | 70 | [CLIP C4] | ok | ebd. 0:47:17,5–0:47:23,75 | Hand-Untertitel gleich; Schnitt K14. |
| 48 | 76 | „Last winter, he said ten or twenty years.“ | ok | Moonshots / Short | „in like 10 or 20 years. It won't matter.“ |
| 49 | 76 | „This summer, he named a year: twenty thirty-six.“ | ok (Wortlaut: Suchauszug) | [Video](https://www.youtube.com/watch?v=XuoqKYxDHVc) · [Forbes, 13.8.2026](https://www.forbes.com/sites/davidbirnbaum/2026/08/13/elon-musk-says-money-wont-matter-by-2036-scarcity-has-other-plans/) | „I'll make another prediction. Money won't matter in 2036.“ Am Video gegenhören (3c). |
| 50 | 77 | „Credit where it's due: that's a date you can check. But it's still a forecast.“ | ok | – | Wertung. |
| 51 | 78 | „By his own account, artificial intelligence moves much faster than government.“ | ok | Moonshots 1:26:07 | „AI is moving you know 10 times faster than government maybe more“ (wahrscheinlich Musk). |
| 52 | 79 | „That's why he wants the simplest fix: just send people money.“ | ok | ebd. | „the one thing that the government can do is just issue people money“; „simplest fix“ ist unsere Übersetzung. |
| 53 | 80 | „But checks for everyone still need Congress.“ | ok | [Verfassung](https://www.archives.gov/founding-docs/constitution-transcript) Art. I § 9 · [CARES Act](https://www.congress.gov/bill/116th-congress/house-bill/748) · [CAA 2021](https://www.congress.gov/bill/116th-congress/house-bill/133) · [American Rescue Plan](https://www.congress.gov/bill/117th-congress/house-bill/1319) | Jede Scheck-Runde brauchte ein Gesetz (3g). |
| 54 | 80 | „And the jobs could be gone long before Congress moves.“ | ok | – | Möglichkeit („could“), keine Behauptung. |
| 55 | 83 | „In April twenty nineteen, on stage at Tesla's investor event about self-driving, he gave this date.“ | ok | [Video](https://www.youtube.com/watch?v=Ucp0TTmvqOE) · [CNBC, 22.4.2019](https://www.cnbc.com/2019/04/22/elon-musk-says-tesla-robotaxis-will-hit-the-market-next-year.html) | Autonomy (Investor) Day, 22.4.2019 ✓. |
| 56 | 84 | [CLIP C3] | ok | ebd. 3:13:58,6–3:14:05,0 | ✓ (3n). |
| 57 | 85 | „They came. Years late. A small fleet, not a million.“ | ok | [Electrek](https://electrek.co/2026/01/22/tesla-starts-robotaxi-rides-without-safety-monitor-in-austin-what-you-need-to-know/) · [Not a Tesla App](https://notateslaapp.com/news/4802/tesla-now-has-300-cybercabs-in-austin-dallas-rides-next) | Seit Juni 2025 bzw. Jan. 2026; „small“ bei jeder Zählung (3i). |
| 58 | 86 | „Earlier, on that same stage, he'd said it himself: sometimes he's not on time, but he gets it done.“ | ok | Video 3:04:52–3:05:08 | Indirekte Rede ✓; 9 Minuten vor C3 ✓. Zitatkarte → MB2. |
| 59 | 87–88 | „That's fair. For a carmaker, late is fine. For your retirement, late is the whole problem.“ | zugespitzt | – | Wertung, Pointe. |
| 60 | 89 | „So the fourth line: if his record holds, years late.“ | ok | Nr. 57; F25–F31 | Als Bedingung formuliert. |
| 61 | 94–97 | Zwei Wetten | ok | F33 | Logik, keine Zahl, kein Anlagerat (3o). |
| 62 | 98 | „Nearly two in three Americans say they worry more about running out of money than about dying.“ | ok | [Allianz Life / Business Wire, 22.4.2025](https://secure.businesswire.com/news/home/20250422646926/en/Americans-Are-More-Worried-About-Running-Out-of-Money-Than-Death) (Suchauszug) | 64 % ✓; Stichprobe s. K1. |
| 63 | 100 | „Musk has said it's better to be an optimist and wrong than a pessimist and right.“ | ok | Moonshots 1:09:07 · Davos (Suchauszug) · Moonshots #79, 2024 (Suchauszug) | Mehrfach belegt. |
| 64 | 101 | „He was talking about quality of life. There, he may have a point.“ | ok | Moonshots 1:09:15 | „Um for quality of life.“; davor „I have decided to look on the bright side“ ✓. |
| 65 | 103–105 | „For someone who owns the machines, being an optimist and wrong costs almost nothing. … That's not a charge against him.“ | zugespitzt | F36 | Wertung (Anreiz, kein Vorwurf). Belegt ist nur, dass sein Vermögen in Firmenanteilen steckt (Isaacson 0:22:16). |
| 66 | 110 | „Musk himself expects the years ahead to bring radical change, social unrest, and immense prosperity.“ | ok | Moonshots 1:06:36–1:06:47 · 0:07:31–0:07:57 | Wortlaut ✓, Sprecher wahrscheinlich Musk (3b); sonst K2. |
| 67 | 111 | „People have lived through that once already.“ | zugespitzt | – | Brücke zur Industrialisierung, historisch vertretbar. |
| 68 | 112 | „When machines turned work upside down, they faced this same question: who takes care of us when we're old?“ | ok | [FDR-Erklärung](https://www.presidency.ucsb.edu/documents/statement-signing-the-social-security-act-0) · [SSA: Bismarck](https://www.ssa.gov/history/ottob.html) | „startling industrial changes … make life insecure“. |
| 69 | 113 | „Germany answered first. In eighteen eighty-nine, an old-age pension became law, paid for by workers, employers and the state.“ | ok | [SSA: Bismarck](https://www.ssa.gov/history/ottob.html) (Suchauszug) | Weltweit die erste Alters-Sozialversicherung; Beiträge von Arbeitern, Arbeitgebern und Staat ✓ (3k). |
| 70 | 114 | „America followed in nineteen thirty-five. At the signing, President Franklin Roosevelt said why.“ | ok | [American Presidency Project](https://www.presidency.ucsb.edu/documents/statement-signing-the-social-security-act-0) · [Film](https://www.youtube.com/watch?v=EN7NUindB38) | 14.8.1935 ✓. |
| 71 | 115 | [CLIP C5] | ok | ebd. 0:30,3–0:42,9 | Beide Untertitel-Spuren gleich. |
| 72 | 116 | „His answer wasn't a promise. It was a law.“ | ok | – | Rahmung. |
| 73 | 117 | „With amounts, with dates, and with money set aside years before anyone collected.“ | **falsch** → M1 | [SSA History FAQ](https://www.ssa.gov/history/hfaq.html) · [PolitiFact](https://www.politifact.com/factchecks/2013/nov/12/jay-leno/leno-says-social-security-took-7-years-issue-its-f) (Suchauszüge) | Pauschalzahlungen ab 1937; richtig ist „before the first monthly check“. |
| 74 | 118 | „Then one winter, a retired woman in Vermont opened her mailbox. Ida May Fuller. Check number one.“ | ok | [SSA: Ida May Fuller](https://www.ssa.gov/history/imf.html) (Suchauszug) | 31.1.1940, Nr. 00-000-001, Ludlow (Vermont); „mailbox“ ist szenisch. |
| 75 | 119 | „She kept getting them until she was a hundred.“ | ok | ebd. | gestorben 27.1.1975 mit 100. |
| 76 | 120 | „Not because someone was generous. Because the law said so.“ | ok | – | Rahmung (Anspruch per Gesetz). |
| 77 | 121 | „Unless Congress acts, Social Security checks will shrink in the early twenty-thirties. Shrink, not stop.“ | ok | [SSA Trustees Report 2026](https://www.ssa.gov/OACT/TR/2026/IV_B_LRest.html) (Suchauszug) | OASI 4. Quartal 2032, dann 78 % (3l). |
| 78 | 122 | „A promise can be kept. A law has to be.“ | zugespitzt | – | Rhetorik: Auch Gesetze kann der Kongress ändern. Als Pointe vertretbar. |
| 79 | 123–125 | Einkommen aus dem Überfluss zählt erst als Gesetz; „a check in your mailbox … Because a law says so.“ | ok | – | Meinung, Übertragung. |
| 80 | 126 | „That law doesn't exist yet. Writing it is up to voters and lawmakers.“ | ok | Nr. 41–42 | Stand 11.11.2026. |
| 81 | 128–131 | Endstand; „As advice, it fails its own test.“ | ok | – | Unser Urteil, aus den fünf Zeilen abgeleitet. |
| 82 | 132–135 | „Maybe one day he'll be right …“; Kernsatz | ok | – | Meinung. |

**Sprechtext:** 82 Aussagen · 69 ok · 12 zugespitzt · 1 falsch · 0 unbelegt.

---

## 5 · Einblendungen und Bildtexte (text-v2, in Bildreihenfolge)

| # | Zeit | Einblendung / Bildtext | Ergebnis | Quelle | Anmerkung |
|---|---|---|---|---|---|
| E1 | 0:00 | STOP SAVING MONEY (groß) | zugespitzt | X-Post 29.10.2026 | Ohne Zuschreibung liest es sich als unser Rat; „stop“ ist nicht Musks Wort → K3. |
| E2 | 0:01 | „Saving money for the distant future is pointless with the advent of super intelligent abundance.“ · Elon Musk on X | ok (Suchauszug) | Futurism · The Hans India | In allen Berichten derselbe Wortlaut; den Post selbst konnte ich nicht öffnen. |
| E3 | 0:27 | Kärtchen „It won't matter.“ → „money won't matter in 2036“ → „pointless“ · Moonshots podcast · The Economist · X | ok | C1 · Nr. 49 · E2 | ohne Jahreszahl ✓ (Minute 1). |
| E4 | 0:50 | MOONSHOTS PODCAST · EP. 220 · JAN 2026 | ok | Video, veröffentlicht 6.1.2026 | ✓ |
| E5 | 0:56 | ELON MUSK · CEO, Tesla & SpaceX · 2026 · ORIGINAL FOOTAGE | ok | Videobeschreibung | Aufgenommen 22.12.2025; „2026“ ist das Jahr der Veröffentlichung, das ist vertretbar. |
| E6 | 0:56 | C1-Untertitel mit goldener Zeile „If any of the things that we've said are true …“ | ok | Short 0:11,0–0:15,4 | Wortlaut ✓; Sprechernamen K11. |
| E7 | 1:24 | „Things get down to basic cost of materials and electricity“ · Musk, Moonshots | **unbelegt** (Sprecher) | Moonshots 1:10:32 | → MB1 |
| E8 | 1:31 | „you will have deflation“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:11:18 | K4 |
| E9 | 1:36 | UNIVERSAL HIGH INCOME | ok | Moonshots · X | sein Begriff ✓ |
| E10 | 1:41 | „it's not like I got this all figured out“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:08:26 | K5 |
| E11 | 2:13 | AMAZON · 1,000,000+ ROBOTS · ≈ 1.5 MILLION EMPLOYEES · Amazon, July 2025 | ok | GeekWire · Tom's Hardware (Suchauszug) | Laut Jahresbericht ≈ 1,55 Mio. Beschäftigte (Stand 31.12.2024). |
| E12 | 2:26 | +20–30 % · „my guess is digital superintelligence probably improves the output of goods and services by 20 to 30%“ · Musk to Walter Isaacson, Oct 2026 | ok | Isaacson ≈ 0:17:02 | Im Ton steht „the uh output“; das Füllwort wegzulassen ist üblich. |
| E13 | 2:39 | ROBOTS + SPACE + A MASS DRIVER ON THE MOON → „potentially a million times the size of the Earth economy“ · Musk, Oct 2026 | ok | Isaacson ≈ 0:17:35 | ✓ |
| E14 | 3:02 | TV (SAME QUALITY) · $1 IN 2000 → ≈ 2¢ TODAY · BLS CPI, Jan 2000 – Dec 2025 | ok | BLS SERA01 | 0,0181 ✓ |
| E15 | 3:10 | SOFTWARE −73 % · PHONE PLANS −44 % · BLS CPI 2000–2025 | ok | BLS SEEE02, SEED03 | ✓ |
| E16 | 3:13 | HOSPITAL CARE · $1 IN 2000 → ≈ $4 TODAY · BLS CPI | ok | BLS SEMD01 | 3,96 ✓ |
| E17 | 3:18 | ALL PRICES +92 % · NURSING HOMES +166 % · RENT +143 % · COLLEGE TUITION +196 % · TVs −98 % · BLS CPI 2000–2025 | ok | BLS | K6 optional |
| E18 | 3:29 | ECONOMISTS CALL IT THE BAUMOL EFFECT | zugespitzt | Lehrbuch | gilt für Menschenzeit, nicht für Lage → K7 |
| E19 | 3:50 | NURSING HOME, PRIVATE ROOM ≈ $130,000 / YEAR (US median 2025, CareScout) · AVG. SOCIAL SECURITY RETIREMENT BENEFIT ≈ $25,000 / YEAR (SSA 2026) | ok | CareScout · SSA (Suchauszüge) | 129.575 $ und 24.852 $ ✓ |
| E20 | 4:24 | „Universal HIGH INCOME via checks issued by the Federal government is the best way to deal with unemployment caused by AI.“ · Musk on X, Apr 17, 2026 | ok (Suchauszug) | Washington Times, 17.4.2026 | Datum ±1 Tag → K8 |
| E21 | 4:31 | Bild: Zeitstempel springt von 1:14:29 auf 1:13:54 | ok | Untertitel | ✓ |
| E22 | 4:41 | PETER DIAMANDIS · Host, „Moonshots“ · 2026 · ORIGINAL FOOTAGE | ok | Gizmodo (Suchauszug) · Storyboard | Sprecher am Bild bestätigen. |
| E23 | 4:47 | Moonshots #220 · question 1:13:54 · answer 1:14:29 | ok | Untertitel | ✓ |
| E24 | 4:51 | Moonshots #220 · ≈ 1:10 and 1:26 | ok | Untertitel | 1:10:51 und 1:26:07 ✓ |
| E25 | 5:05 | 2026 BILLS ON AI & JOBS: AI TAX PROPOSAL (House) · AI JOBS TRUST FUND (Sen. Kelly) · NONE PASSED | ok (dünn) | Fortune 1.9.2026 · KJZZ/Roll Call 25.9.2026 | Stand am Upload-Tag prüfen. |
| E26 | 5:30 | Bild: WORLD BANK · ABCDE 2026 | ok | Weltbank | 16.–17.6.2026 ✓ |
| E27 | 5:39 | DARON ACEMOGLU · Economist, MIT · Nobel Prize 2024 · WORLD BANK · JUNE 2026 · ORIGINAL FOOTAGE | ok | Video 16.6.2026 | ✓ |
| E28 | 5:58 | JAN 2026 · „10 or 20 years“ · Moonshots · JUL 2026 · „money won't matter in 2036“ · The Economist; Balken 10–20 YEARS (2036–2046) | ok (2036: Suchauszug) | Nr. 48–49 | Zitatkarte statt Clip ✓ |
| E29 | 6:14 | „AI is moving … 10 times faster than government, maybe more“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:26:12 | „…“ ersetzt „you know“ ✓ |
| E30 | 6:18 | „the one thing that the government can do is just issue people money“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:26:20 | Stotterer weggelassen ✓ |
| E31 | 6:23 | CHECKS FOR EVERYONE 2020/21: EACH ONE NEEDED AN ACT OF CONGRESS (CARES ACT · AMERICAN RESCUE PLAN) | ok, unvollständig | congress.gov | K9 |
| E32 | 6:35 | Bild: APR 22, 2019 | ok | Video · CNBC | ✓ |
| E33 | 6:42 | ELON MUSK · CEO, Tesla · 2019 · ORIGINAL FOOTAGE (Tesla Autonomy Day) | ok | Video | ✓ |
| E34 | 6:48 | PROMISED: 2020 · FIRST PAID RIDES: JUNE 2025, AUSTIN, WITH SAFETY MONITOR · NO ONE INSIDE: SINCE JAN 2026, SMALL FLEET | zugespitzt | Electrek · InsideEVs · Not a Tesla App | „NO ONE INSIDE“ ungenau → K10; der Rest stimmt. |
| E35 | 6:53 | „Only criticism, and it's a fair one, is sometimes I'm not on time. But I get it done.“ · Musk, Apr 22, 2019 | **unbelegt** (Wortlaut) | Video 3:04:57 | → MB2 |
| E36 | 7:40 | 64 % ARE MORE WORRIED ABOUT RUNNING OUT OF MONEY THAN ABOUT DEATH · Allianz Life, 2025 | ok | Business Wire, 22.4.2025 | Stichprobe s. K1 |
| E37 | 7:50 | „it is better to be an optimist and wrong than a pessimist and right … for quality of life“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:09:07–1:09:16 | „…“ ersetzt das „Yes, for sure.“ des Gastgebers ✓. Falls nötig, als Ersatz die Davos-Fassung (Suchauszug, am Video prüfen). |
| E38 | 8:35 | „radical change, social unrest and immense prosperity“ · Musk, Moonshots | ok (Sprecher wahrscheinlich) | Moonshots 1:06:43–1:06:47 | sonst K2 |
| E39 | 8:52 | GERMANY · OLD-AGE & DISABILITY INSURANCE LAW · JUNE 22, 1889 · PENSION FROM AGE 70 | ok | SSA · Faktenzettel F38 (bpb, DRV) | ✓ |
| E40 | 9:05 | FRANKLIN D. ROOSEVELT · U.S. President · 1935 · ORIGINAL FOOTAGE · ARCHIVE | ok | Film · American Presidency Project | ✓ |
| E41 | 9:18 | Siegel: SOCIAL SECURITY ACT · AUG 14, 1935 | ok | American Presidency Project | ✓ |
| E42 | 9:22 | CONTRIBUTIONS FROM 1937 · FIRST MONTHLY CHECK: JAN 1940 | ok | SSA | Passt zu M1; Bild K15. |
| E43 | 9:27 | IDA MAY FULLER · CHECK No. 00-000-001 · JAN 31, 1940 · $22.54 · Social Security Administration | ok | SSA (Suchauszug) | ✓ |
| E44 | 9:34 | PAID IN: $24.75 · RECEIVED: ≈ $22,900 · SSA History | ok | ebd. | 22.888,92 $ ✓ |
| E45 | 9:42 | UNLESS CONGRESS ACTS: RETIREMENT TRUST FUND (OASI) RUNS OUT END OF 2032 → THEN ≈ 78 % OF BENEFITS PAYABLE · Social Security Trustees Report 2026; Bild: ab „2033“ ein Scheck von ≈ drei Vierteln | ok (Suchauszug) | SSA Trustees Report 2026 | ✓ |
| E46 | 2:46–10:37 | Urteils-Stempel ✓ ½ ✗ ✗ ✗ und AS ADVICE: FAILS ITS OWN TEST | ok | – | Wertungen, aus den Belegen abgeleitet. |

**Einblendungen:** 46 Aussagen · 41 ok · 3 zugespitzt · 0 falsch · 2 unbelegt.

---

## 6 · Die 30 Punkte des Texters (text-v2, „Faktencheck: besonders prüfen“)

| # | Punkt | Ergebnis |
|---|---|---|
| 1 | X-Post 29.10., Wortlaut und Kürzung | Wortlaut ok (Suchauszug); die Kürzung trägt (3a); K3 |
| 2 | „again and again this year“ | ok |
| 3 | „The richest man on Earth“ | ok (Forbes 1.11.2026) |
| 4 | C1 und C2, Wortlaut und Sprecher | Wortlaut ok; Sprecher K11 und am Bild; mit K12/K13 ≈ 19,6 s |
| 5 | „His host had just asked …“ | ok (Frage 1:13:46–1:14:28, Antwort 1:14:29) |
| 6 | „Asked who would pay …“ und „elsewhere …“ | zugespitzt bzw. ok (3b) |
| 7 | „doesn't have it all figured out“ | ok, wahrscheinlich Musk; K5 |
| 8 | Steelman-Zitate 1:24 und 1:31 | 1:24 → MB1; 1:31 → K4 |
| 9 | X-Post 17.4.2026 | ok; Datum K8 |
| 10 | +20–30 % und Mond | ok; Z. 36 zugespitzt (3d) |
| 11 | Amazon | ok |
| 12 | BLS-Preise | ok, nachgerechnet (3e) |
| 13 | Pflegeheim ≈ fünf Jahresrenten | ok (5,2; 3f) |
| 14 | Kongress | ok (dünn); Stand am Upload-Tag prüfen |
| 15 | Zwei Wege (drucken / besteuern) | ok bzw. zugespitzt (Nr. 43–45) |
| 16 | Acemoglu | ok (3h) |
| 17 | „Last winter … This summer … 2036“ | ok; 2036-Wortlaut am Video gegenhören (3c) |
| 18 | Regierung langsam, „just send people money“ | ok, wahrscheinlich Musk |
| 19 | „checks for everyone still need Congress“ | ok; K9 |
| 20 | Robotaxis heute | ok; K10 |
| 21 | „sometimes I'm not on time“ | VO ok; Karte → MB2 |
| 22 | Allianz 64 % | ok; K1 |
| 23 | Optimisten-Satz und „quality of life“ | ok; Kontext stimmt |
| 24 | „radical change, social unrest and immense prosperity“ | ok, wahrscheinlich Musk; sonst K2 |
| 25 | „Germany answered first“ | ok (SSA) |
| 26 | „At the signing …“ | ok; C5 stammt aus der Unterzeichnungs-Erklärung |
| 27 | „years before anyone collected“ | **falsch → M1** |
| 28 | Ida May Fuller | ok |
| 29 | Treuhänder-Bericht 2026, „Shrink, not stop“ | ok |
| 30 | „That law doesn't exist yet“ | ok |

---

## 7 · Nicht prüfbar oder offen (für den Zweitprüfer)

1. **Sprecher im Moonshots-Podcast:** nur über automatische Marken zugeordnet. Am Bild oder Ton bestätigen:
   - 1:24 (MB1, sonst ersetzen), 1:31 (K4), 1:41 (K5), 6:14 und 6:18, 7:50, 8:35 (K2);
   - im C1-Einwurf „Either we're not going to be here or“ (K11);
   - C2 = Diamandis.
2. **2036:** Den Wortlaut kenne ich nur aus Berichten; am Economist-Video ab 31:20 gegenhören. Ein Suchauszug nennt „2030“ in einer Folgefrage.
3. **X-Posts:** Den Wortlaut vom 29.10. und vom 17.4. kenne ich nur aus Berichten (x.com gesperrt). Der April-Post kam am 16. oder 17.4. (K8).
4. **Kongress:** Stand der KI-Job-Entwürfe am 14./15.11. auf congress.gov nachsehen.
5. **Robotaxi-Flotte:** Die Zahlen widersprechen sich (Tesla: über 300 Cybercabs; unabhängig: 40–60 ohne Begleiter). Der VO sagt nur „small“, das hält.
6. **Ton:** Musikbett im Short (C1), Applaus bei C3. Für C5 eine Kopie aus FDR Library oder National Archives nehmen und die Zeitmarken dort neu setzen (`clips.json`).
7. **Nur als Suchauszug geprüft:** Trustees Report (78 %), CareScout und SSA-COLA, SSA-History-Seiten, Allianz, Davos-Fassung des Optimisten-Satzes.
8. **Freigabe nötig:** futurism.com und finance.biggo.com (WebFetch: ENOTFOUND). Mit Freigabe ließen sich der Futurism-Artikel und eine Abschrift des Economist-Interviews prüfen.

---

## 8 · Ampelseite-Kandidaten

**Ampel:**
- **sicher:** Die Primärquelle ist eindeutig.
- **umstritten:** Die Quelle trägt die Aussage, aber Maß oder Deutung sind angreifbar.
- **dünn:** Es gibt nur eine Quelle, oder ihr Primärtext war hier nicht einsehbar.

Grün gilt erst, wenn der Zweitprüfer die Primärquelle selbst geöffnet hat (viele Primärseiten waren hier gesperrt).

| # | Aussage (ein Satz) | Ampel | Primärquelle |
|---|---|---|---|
| 1 | Z. 1 und Titel: Musk schrieb am 29.10.2026 auf X „Saving money for the distant future is pointless with the advent of super intelligent abundance“. Der Film kürzt das zu „saving money is pointless“ und reicht Zeitraum und Bedingung nach 10 s nach. | umstritten | [Futurism, 29.10.2026](https://futurism.com/future-society/elon-musk-saving-money-pointless) (der Post selbst liegt auf x.com, hier gesperrt) |
| 2 | Z. 60–62: Musks Rat, nicht fürs Alter zu sparen, kam als direkte Erwiderung auf Diamandis' Frage, ob die Gewinne der Maschinen besteuert und als Einkommen verteilt werden. Musk leitete ihn selbst als „side recommendation“ ein. | umstritten | [Moonshots #220, 1:13:46–1:14:54](https://www.youtube.com/watch?v=RSNuB9pj9P8&t=4426s) |
| 3 | Z. 33–36: Musk schätzt, digitale Superintelligenz allein bringe 20–30 % mehr Güter. „potentially a million times the size of the Earth economy“ und „money becomes irrelevant“ kommen bei ihm erst mit Robotern, Raumfahrt und einem Massebeschleuniger auf dem Mond. | sicher | [Isaacson-Interview, 20.10.2026, ab 0:16:40](https://www.youtube.com/watch?v=AQnwQHMnCrE&t=1000s) |
| 4 | Z. 42–45: Laut US-Verbraucherpreisindex (Jan. 2000 → Dez. 2025) kostet ein Fernseher gleicher Qualität heute rund 2 Cent pro Dollar von 2000 (Faktor 0,018) und Krankenhausleistungen rund 4 $ (3,96). Pflegeheime (+166 %), Miete (+143 %) und Studiengebühren (+196 %) stiegen weit stärker als alle Preise (+92 %). | sicher | [BLS CPI](https://www.bls.gov/cpi/data.htm) (Serien CUUR0000SERA01, SEMD01, SEMD02, SEHA, SEEB01, SA0) |
| 5 | Z. 52: Ein Einzelzimmer im Pflegeheim kostete 2025 im US-Median 129.575 $ im Jahr, die durchschnittliche Altersrente 2026 beträgt 24.852 $ im Jahr. Das sind 5,2 Jahresrenten (Doppelzimmer 4,6, je nach Bundesstaat 3,7 bis 5,9). | umstritten | [CareScout 2025](https://www.businesswire.com/news/home/20260302283881/en/CareScout-Releases-2025-Cost-of-Care-Survey-Results) · [SSA COLA 2026](https://www.ssa.gov/cola/factsheets/2026.html) |
| 6 | Z. 65: Im Kongress liegen 2026 mehrere Entwürfe zu KI und Arbeitsplätzen, darunter Sen. Kellys „Make AI Work for Americans Act“ mit einem KI-Treuhandfonds; beschlossen ist keiner. | dünn | [KJZZ, 25.9.2026](https://www.kjzz.org/text/politics/2026-09-25/sen-kelly-proposes-federal-trust-fund-to-shield-workers-from-large-scale-ai-related-job-losses) · [GovAI-Überblick](https://www.governance.ai/research-paper/how-congress-is-approaching-ais-labor-market-impacts) |
| 7 | Z. 76: Musk sagte im Juli 2026 im Interview mit Zanny Minton Beddoes (The Economist): „Money won't matter in 2036.“ | dünn | [The Economist, Video](https://www.youtube.com/watch?v=XuoqKYxDHVc&t=1880s) (Wortlaut nur aus Berichten, z. B. [Forbes, 13.8.2026](https://www.forbes.com/sites/davidbirnbaum/2026/08/13/elon-musk-says-money-wont-matter-by-2036-scarcity-has-other-plans/)) |
| 8 | Z. 85: Teslas Robotaxis fahren seit Juni 2025 bezahlt in Austin (zuerst mit Sicherheitsbegleiter, seit Jan. 2026 teils ohne). Das ist Jahre nach dem Versprechen von 2019, und die Flotte ist klein (Tesla: über 300 Cybercabs; unabhängige Zählungen: 40–60 Autos ohne Begleiter). | umstritten | [Electrek, 22.1.2026](https://electrek.co/2026/01/22/tesla-starts-robotaxi-rides-without-safety-monitor-in-austin-what-you-need-to-know/) · [Not a Tesla App](https://notateslaapp.com/news/4802/tesla-now-has-300-cybercabs-in-austin-dallas-rides-next) |
| 9 | Z. 117 (neu) und Z. 118: Social Security zog ab 1937 Beiträge ein und zahlte bis 1939 nur einmalige Pauschalbeträge. Den ersten Monatsscheck (Nr. 00-000-001, 22,54 $) bekam am 31.1.1940 Ida May Fuller in Vermont. | sicher | [SSA: Ida May Fuller](https://www.ssa.gov/history/imf.html) · [SSA History FAQ](https://www.ssa.gov/history/hfaq.html) |
| 10 | Z. 121: Laut Treuhänder-Bericht 2026 sind die Rücklagen des Altersrenten-Fonds (OASI) im 4. Quartal 2032 aufgebraucht; danach wären ohne Gesetzesänderung rund 78 % der Leistungen zahlbar. | sicher | [SSA Trustees Report 2026](https://www.ssa.gov/OACT/TR/2026/IV_B_LRest.html) |

**Ohne Ampel, am Ton oder Bild prüfen (Sprecher und Wortlaut):**
- **Moonshots-Zitatkarten:** 1:31 „you will have deflation“, 1:41 „figured out“, 6:14 und 6:18 (Regierung), 7:50 (Optimist), 8:35 („radical change …“). Alle wahrscheinlich Musk. 1:24 („materials and electricity“) nur nach eindeutiger Bestätigung (MB1). [Folge](https://www.youtube.com/watch?v=RSNuB9pj9P8)
- **C1:** Sprecher des Einwurfs „Either we're not going to be here or“; Musikbett im Short. [Short](https://www.youtube.com/watch?v=sf1gUoREC54)
- **C2:** Sprecher Diamandis, bestätigen über das Sprecherwechsel-Zeichen direkt vor „is that then taxed“. [Folge, 1:13:46](https://www.youtube.com/watch?v=RSNuB9pj9P8&t=4426s)
- **6:53:** Wortlaut der Karte nach Gehör setzen (MB2). [Tesla Autonomy Day, 3:04:52](https://www.youtube.com/watch?v=Ucp0TTmvqOE&t=11092s)
