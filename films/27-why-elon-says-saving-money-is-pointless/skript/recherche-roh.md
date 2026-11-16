# Rohrecherche · „Why Elon Says Saving Money Is Pointless“ (Stand 10.11.2026, ca. 10:00 MEZ)

Für Faktencheck und Nachfragen. Der Texter liest den `faktenzettel.md`, nicht diese Datei. Clips mit allen Zeitmarken: `clips.json`.

**Sicherheit:** **sicher** = Primärquelle/Video selbst geprüft oder mehrere unabhängige Berichte · **umstritten** = Quellen weichen ab · **dünn** = eine Quelle oder nur Suchauszug („dünn/Suchauszug“).

---

## 0 · Methode und Grenzen

- **Gesperrt** (curl 000 / ENOTFOUND aus unserer Umgebung): praktisch alle Primärseiten (Fortune, Gizmodo, Yahoo, BLS, AEI, SSA, OECD, Census, CBO, Economist, singjupost, podcastrex, sozai.app, Wikipedia u. a.). Inhalte dieser Seiten stammen aus **WebSearch-Auszügen** → wo nicht anders vermerkt „dünn/Suchauszug“, im Faktencheck am Original abhaken.
- **Erreichbar:** YouTube (Untertitel per yt-dlp, mit Pausen und Wiederholungen), YouTube Data API v3 (sparsam: 2 × search.list, sonst videos/channels/playlistItems), PyPI.
- **Untertitel geholt und gelesen (Zeitmarken aus Wort-Zeitstempeln, ±0,5 s):** Moonshots #220 (RSNuB9pj9P8), offizieller Short (sf1gUoREC54), Tesla Autonomy Day 2019 (Ucp0TTmvqOE), Isaacson/The Builders (AQnwQHMnCrE), FDR-Unterzeichnung 1935 (EN7NUindB38 automatisch, JG1Eba0tnwo von Hand untertitelt), Valuetainment (W-jdh08zEGM), Times Axis (FYNoiPNTOy4).
- **Nicht bekommen** (HTTP 429 / „Sign in to confirm you're not a bot“): Economist-Interview (XuoqKYxDHVc), Rob Berger (zHl6OW8J_a0), Diamandis-Shorts _Mkv8S0DltA / mZh8IUuNnvs. Cookies wurden **nicht** benutzt (Zugriff auf den Cookie-Ordner verweigert), Bot-Check-Umgehung (Player-Client-Wechsel) wurde verweigert und nicht weiter versucht. Video-Downloads (Ton) gingen ebenfalls nicht → **Sprecher-Zuordnung** wurde mit YouTube-Storyboard-Bildern (ein Bild ca. alle 10 s) gestützt, Wortlaut ist **nicht am Ton** gehört.
- **BLS-Preise:** direkt aus der BLS-CPI-Datenbank, die das Python-Paket `cpi` 2.1.0 (palewire) mitliefert (Daten bis Aug. 2026), selbst gerechnet → sicher (Rechenweg unten).

---

## 1 · Das Zitat: Moonshots #220 (Peter Diamandis)

**Folge:** „Elon Musk on AGI Timeline, US vs China, Job Markets, Clean Energy & Humanoid Robots | 220“ · Kanal Peter H. Diamandis (UCvxm0qTrGN_1LMYgUaftWyQ) · veröffentlicht 6.1.2026, 15:07 UTC · 2:52:10 · ca. 2,0 Mio. Aufrufe (Stand Nov. 2026) · aufgenommen laut Beschreibung am 22.12.2025 (Gigafactory Texas) · mit Dave Blundin (Link Ventures). https://www.youtube.com/watch?v=RSNuB9pj9P8 · **sicher**

**Offizieller Short:** „Elon Musk: Don't Save For Retirement - It Won't Matter | MOONSHOTS“, gleicher Kanal, 11.1.2026, 23 s, ca. 385.000 Aufrufe. https://www.youtube.com/watch?v=sf1gUoREC54 · **sicher**. Der Short ist geschnitten: Die Einwürfe „No.“ / „Okay.“ der Langfassung fehlen.

### 1.1 Die Stelle (Langfassung, automatische Untertitel, Wortzeiten)

Sprecher gestützt durch Storyboard: Diamandis (graue Haare, Jacke mit Stern-Logo) im Bild 1:13:45–1:14:15; Musk im Bild ab ca. 1:14:29.

| Zeit | Sprecher | Wortlaut |
|---|---|---|
| 01:13:46.5 | (Host) | „so profitability of companies go through the roof“ |
| 01:13:50.2 | (Host) | „at some point. But but no but so the question becomes is that taxed by the government? uh“ |
| **01:13:54.5–01:14:28** | **Diamandis** | „is that then taxed by the government and redistributed as some level of income as a U as a UHI or UBI? [UBI endet ca. 01:14:00.9] In other words, um one of the questions is if in fact this future we hit massive productivity uh and massive profitability because we're dividing by zero. The cost of labor has gone to nothing. The cost of intelligence has gone to nothing and we're still producing products and services faster and faster. So there's more profitability. Someone needs to be buying it and someone needs to be able to have the capital to buy it. Um, I mean this is an important question to get to get thought through.“ |
| **01:14:29.4–01:14:38.2** | **Musk** | „Yeah. Um, well, one like side recommendation I have is like don't worry about like squirreling money away for uh retirement in like 10 or 20 years. It won't matter.“ („don't“ 01:14:33.44 · „matter“ endet ca. 01:14:38.2) |
| 01:14:38.3 | ? | „No.“ |
| 01:14:40.8 | Diamandis | „Okay. either either we're not going to be here or“ |
| **01:14:43.9–01:14:53.9** | **Musk** | „it it just uh like it's it's you won't need to save for retirement. If if any of the things that we've said are true, saving for retirement will be irrelevant.“ („If“ 01:14:49.04 · „irrelevant“ endet ca. 01:14:53.9) |
| 01:14:53.9–01:15:02.3 | **Diamandis** | „The services will be there to support you. You'll have the home, you'll have the healthcare, you'll have the entertainment.“ (Zuordnung auch laut Gizmodo) |
| 01:15:02.3 | wahrscheinlich Musk (Storyboard 1:15:05 zeigt Musk) | „The way this unfolds is fundamentally impossible to predict because of self-improvement of the AI and the accelerating timeline.“ |
| 01:15:27 | ? | „We're in the singularity.“ |

**Kernbefund:** Der Spar-Satz war wörtlich Musks Antwort auf Diamandis' Frage, ob die Gewinne besteuert und als Einkommen verteilt werden. Gizmodo: Musk sei „seemingly unwilling to acknowledge any role for the government“ und habe „pivoted“. https://gizmodo.com/worlds-richest-man-says-dont-bother-saving-for-retirement-2000708250 · **sicher** (Wortlaut aus Untertiteln; Deutung „wich aus“ ist Gizmodos und unsere Lesart, siehe Fairness unten).

**Short-Zeiten (sf1gUoREC54):** „One like side recommendation …“ ab 00:00:00.08 · „don't“ 00:00:01.60 · „matter.“ endet ca. 00:00:06.3 · Diamandis „Either either we're not going to be here or“ 00:00:06.3–00:00:08.4 · Musk „it's it's you you won't need to save for retirement. If if any of the things that we've said are true, saving for retirement will be irrelevant.“ 00:00:08.48–ca. 00:00:16.0 · Diamandis „The services will be there …“ 00:00:16.08–ca. 00:00:23.

### 1.2 Fairness-Kontext aus derselben Folge (für das Steelman und gegen „er wich nur aus“)

Sprecher ohne Ton nicht sicher; Storyboard-Hinweise stehen dabei. **Alle Zitate in diesem Block am Video gegenhören.**

- 00:00:00 (Teaser, später in der Folge): „My concern isn't the long run. It's the next 3 to seven years. How do we head towards Star Trek and not Terminator?“ (Host-Frage)
- 01:06:19 Host: „you have a solution to this — which is UHI.“ — 01:06:21 (wohl Musk): „Yes. Everyone can have whatever they want.“ — Diamandis 01:06:23: „So how does that work? How does UHI work?“ — 01:06:26 (wohl Musk, Musk im Bild 1:06:36): „It's it's a good question. like we have to figure out some like“
- 01:06:36: „yes the transition will be bumpy … yes we'll have radical change social unrest and immense prosperity“
- 01:06:54–01:07:05: „frankly if if this doesn't happen we we'd go bankrupt as a country. So the national debt is enormous.“ (Zinsen ca. 1 Bio. $)
- 01:08:15 Host: „But this is not about taxation and redistribution.“ — „So, how do how does it work? Reason through it with me.“ — **01:08:23 (sehr wahrscheinlich Musk): „Listen, by the way, I'm open to ideas here. … it's not like I got this all figured out.“**
- 01:08:41–01:09:01 (Musk): „This is my guess for how things … play out. And by the way, … this is going to be a bumpy ride and it's not like I know the answers here. Um but I have decided to look on the bright side.“
- **01:09:07.8–01:09:16.7 (Musk): „because I actually think it is better to be an optimist and wrong than a pessimist and right.“ — Host: „Yes, for sure.“ — „Um for quality of life.“** (Kontext: Lebensqualität/Stimmung, nicht Finanzplanung)
- 01:09:18 (ein Host): „like to me it's really clear that we don't have any system right now to make this go well.“
- 01:10:11–01:11:22 (Sprecher prüfen; Storyboard 1:10:36–56 zeigt einen Host, evtl. Gegenschnitt): „we're basically demonetizing everything. I mean labor becomes the cost of capex and electricity … Things get down to basic cost of materials and electricity … so people can have whatever stuff they want … when we say universal high income, it sounds like it's a tax and redistribute, but that's not the case. … my best guess for how this will manifest is that prices will … drop. … prices in dollar terms are the ratio between the output of goods and services and the money supply. … So if your output of goods and services increases faster than the money supply, you will have deflation“
- 01:11:29: „let's not worry about growing the money supply. It won't matter because the output of goods and services actually will grow faster than the money supply.“
- 01:25:08 Diamandis: „To put a bow around this part, I hope you'll put some more thought into UHI … people need a vision“ — 01:25:22: „Basically, the government could just issue people free money.“ — 01:25:25 (Musk im Bild 1:25:25–35): „Just issue people free money. No, they're doing that sort of kind of now.“ — „But just just basically issue checks uh to everybody.“
- 01:25:42 Blundin (blaues kariertes Hemd im Bild 1:25:45): „but then how big for which person … there's so much complexity there … there's no government entity that's going to keep up with that change.“
- 01:26:02–01:26:56 (Musk): „government is very slow moving … AI is moving you know 10 times faster than government maybe more. … the one thing that the government can do is just issue people money … try and keep the peace … co[vid] checks … President Trump recently issued like everyone in the military like I think $1,776. … you can just basically send people random random amounts of money … nobody's going to stop is what I'm saying.“
- 02:04:22: Vorschlag eines „UHI X Prize“ — „how do you know it works? I don't know.“

**Lesart für den Film:** Auf die direkte Frage „Wer verteilt die Gewinne?“ kam der Spar-Rat. In derselben Folge gibt Musk zwei Mechanismen an: (1) Preise fallen durch Überfluss (Deflation), „not tax and redistribute“; (2) der Staat könne „just issue people money“. Er sagt selbst: „I'm open to ideas … not like I got this all figured out“. → Im Film fair: „When he was asked who pays, he answered with retirement advice. Later he offered two answers: prices will fall, and governments can just send checks. He also said: ‚I'm open to ideas.‘“

---

## 2 · Musks Aussagen über Geld und Sparen, chronologisch (Nov. 2025 – Okt. 2026)

| Datum | Anlass | Wortlaut (englisch) | Quelle · Sicherheit |
|---|---|---|---|
| 19.11.2025 | US-Saudi Investment Forum, Kennedy Center, Washington (mit Jensen Huang) | „if you go out long enough — assuming there's a continued improvement in AI and robotics, which seems likely — money will stop being relevant.“ Es blieben Grenzen wie „electricity and mass“; Arbeit werde in 10–20 Jahren „optional“. | Fortune 20.11.2025 https://fortune.com/2025/11/20/elon-musk-tesla-ai-work-optional-money-irrelevant/ · Fox Business https://foxbusiness.com/technology/musk-predicts-money-stop-being-relevant-future-ai-robotics-progress · Gizmodo https://gizmodo.com/elon-musk-claims-money-wont-exist-in-the-future-and-jensen-huang-would-like-a-heads-up-2000688307 · **sicher** (Wortlaut je Medium leicht verschieden) |
| 17.12.2025 | Antwort auf X an Ray Dalio (Spende der Dells für „Trump Accounts“) | sinngemäß: nette Geste, aber „there will be no poverty in the future and so no need to save money. There will be universal high income.“ | Fortune 18.12.2025 https://fortune.com/2025/12/18/elon-musk-no-poverty-dalio-philanthropy-saving-accounts-trump/ (Spiegel dc.fortune.com) · **dünn/Suchauszug** (Wortlaut) |
| 22.12.2025 / 6.1.2026 | Moonshots #220 | „don't worry about … squirreling money away for … retirement in … 10 or 20 years. It won't matter.“ / „If any of the things that we've said are true, saving for retirement will be irrelevant.“ | Video (Abschnitt 1) · **sicher** |
| 17.4.2026 | X (angeheftet) | „Universal HIGH INCOME via checks issued by the Federal government is the best way to deal with unemployment caused by AI.“ Zweiter Satz sinngemäß: KI/Roboter erzeugen weit mehr Güter und Dienste als die Geldmenge wächst, daher keine Inflation. | Business Today 17.4.2026 https://www.businesstoday.in/latest/economy/story/elon-musks-universal-high-income-will-bankrupt-any-nation-526141-2026-04-17 · **sicher** (erster Satz), **dünn** (zweiter Satz) |
| 17.4.2026 | Antwort von **Sanjeev Sanyal** (Mitglied des Economic Advisory Council des indischen Premierministers) | „will bankrupt any government that attempts it“ (sinngemäß, Wortlaut prüfen) | Business Today (oben) · **sicher** für die Zuordnung zu Sanyal. **Fox Business und eWeek schreiben das „bankrupt“-Zitat fälschlich Musk zu** (https://www.eweek.com/news/elon-musk-universal-high-income-ai-economy/) |
| 12.6.2026 | Abundance Summit (laut Fortune), nach dem SpaceX-Börsengang | „AI and robots are going to make so much stuff … they'll run out of things to do for humans.“ Auf die Ironie, dass er reicher wird, während Geld unwichtiger werde: „Yeah, pretty much.“ | Fortune 12.6.2026 https://fortune.com/2026/06/12/elon-musk-trillionaire-spacex-ipo-money-one-day-irrelevant-ai-robotics/ · **dünn/Suchauszug** |
| **20./23.7.2026** (Aufnahme; Quellen uneinig) | **Interview mit Zanny Minton Beddoes (Chefredakteurin The Economist), Gigafactory Texas** | **„money won't matter in 2036“**; „What do you want money for? You want money for goods and services, right?“; „I think the Treasury should just simply issue people checks.“ Auf Beddoes' Frage nach Einnahmen und Inflationsgefahr: nicht Inflation, sondern Deflation werde das Problem; „Inflation is simply the ratio of money to goods and services“; man könne Geld „in the database“ schaffen, solange das langsamer geschieht, als Güter und Dienste wachsen. | Volle Fassung auf YouTube: „The full-length interview with Elon Musk“, Kanal The Economist, hochgeladen 29.7.2026, 1:25:07, ca. 8 Mio. Aufrufe, Kapitel „Work is going to be optional“ ab ca. 31:20 https://www.youtube.com/watch?v=XuoqKYxDHVc · Berichte: Gizmodo https://gizmodo.com/elon-musk-economist-interview-2000790016 · hwbusters https://hwbusters.com/news/musk-told-the-economist-that-money-wont-matter-in-2036-then-got-asked-how-that-works/ · 247wallst 28.7.2026 https://247wallst.com/investing/2026/07/28/elon-musk-spent-months-trying-to-cut-government-spending-now-he-says-the-treasury-should-just-issue-people-checks/ · Fortune 27.7.2026 https://fortune.com/2026/07/27/elon-musk-post-money-ai-abundance-future-vinod-khosla-dystopia/ · **sicher**, dass er „2036“ sagte (viele unabhängige Berichte); **Wortlaut und Zeitmarke ungeprüft** (Untertitel nicht bekommen, Transkriptseiten gesperrt) |
| 27.7.2026 | Reaktionen auf X | **Vinod Khosla:** Überfluss „only if the politics permits this great abundance“ (Warnung vor Dystopie). **Daron Acemoglu** (Nobelpreis 2024): Musk solle zusagen, bis 2036 rund 1 Bio. $ zu spenden, wenn Geld dann nicht mehr zähle; Musk laut Berichten: „actually going to do something along these lines“. **Gita Gopinath:** „If money does not matter in 2036 he may not have a trillion to give away.“ | Fortune 27.7.2026 (oben) · Barchart https://www.barchart.com/story/news/3532834/elon-musk-says-he-is-going-to-do-something-after-nobel-economist-dares-him-to-pledge-1-trillion-to-charity-if-money-wont-matter-in-2036 · **dünn/Suchauszug** (Wortlaute) |
| 27./28.7.2026 | X Money / Zahlungs-App startet | Ironie-Motiv vieler Videos (Firstpost, IBTimes) | https://www.ibtimes.com/elon-musk-says-money-wont-exist-2036-then-he-launched-payments-app-3805948 · **dünn** |
| 20.10.2026 | „The Builders with Walter Isaacson“, Folge „Elon Musk: The End of Work, the Death of Money, and a World Run by AI“ | siehe 2.1 | https://www.youtube.com/watch?v=AQnwQHMnCrE · **sicher** (Untertitel) |
| **29.10.2026** | **Antwort auf X** (an Nutzerin battleangelviv, Scherz über „questionable shopping“ im Überfluss) | **„Saving money for the distant future is pointless with the advent of super intelligent abundance.“** | Futurism https://futurism.com/future-society/elon-musk-saving-money-pointless · moneytalksnews (CPA Stacy Johnson widerspricht) https://www.moneytalksnews.com/elon-musk-says-saving-for-the-distant-future-is-pointless-im-a-cpa-heres-why-hes-wrong/ · tech-insider https://tech-insider.org/musk-saving-money-pointless-ai-abundance-868b-2026/ · **sicher** (mehrere Berichte), Wortlaut am Post prüfen |

**Wichtig für den Titel:** Das Wort „pointless“ stammt aus dem X-Post vom 29.10.2026, nicht aus dem Podcast. Der Titel „Why Elon Says Saving Money Is Pointless“ ist damit wörtlich gedeckt.

**Die Frist wandert:** Nov. 2025 „long enough … 10–20 years“ → Jan. 2026 „10 or 20 years“ → Juli 2026 „2036“ (≈ 10 Jahre) → Okt. 2026 „distant future“. Laut tech-insider hat Musk die These binnen 11 Monaten mindestens viermal wiederholt (dünn).

### 2.1 Isaacson-Interview (AQnwQHMnCrE), Untertitel gelesen · **sicher**

Kanal „The Builders with Walter Isaacson“ (UCG76YUwXNM4_1eIJr83rKJQ), 20.10.2026, 37:14, ca. 1,9 Mio. Aufrufe bei ca. 25.000 Abonnenten.

- 00:15:01 „the only way we're going to solve the national debt is with AI and robots. We're not going to solve it by trying to save our way there.“
- **00:17:02–00:17:19 „my guess is digital superintelligence probably improves the output of goods and services by 20 to 30%. Something like that. Call it like a … maybe a 30% increase in … the economy of Earth. … It's like $30 trillion a year incremental.“** — 00:17:25 „there'll be a lot more stuff. I mean, 30% more stuff is still a lot. And this is just my … rough guess.“ — 00:17:32–00:17:44 „but if you have robots and … you get to space and … you can do a mass driver on the moon, … then you can get to, I think, potentially a million times the size of the Earth economy.“
- 00:17:53–00:18:22 „Yeah, money becomes irrelevant. I mean, there will be still a currency, but I think currency will be measured in fundamental … physics metrics like … power like wattage and tonnage. … conventional currency will not matter in the future. … that's my guess. I think it's pretty obvious.“
- 00:19:06 „people who retire seem to be … fairly happy even though they're not working“ (sinngemäß, Stelle gegenlesen)
- **00:20:00–00:20:44 Isaacson:** Industrielle Revolution der 1890er, „great disparity of wealth … robber barons … people then picking up pitchforks … Will we put certain things in the commons the way they did in the 1890s when they made high school universal and free? Will we say, ‚Okay, health care, for example, should just be in the commons‘ …?“
- **00:20:49–00:21:03 Musk:** „as you heard me say, I mean, I don't think money's going to matter in the future. … anyone will be able to have any goods and services that they want. And I don't think even so-called wealthy people will ultimately control the AIs. I think they'll control themselves.“ → Er geht auf die Frage nach Gemeingütern (Gesundheit) nicht ein.
- 00:22:16–00:22:30 „my so-called wealth is simply a percentage ownership in … SpaceX and Tesla … And this is going to be taxed quite heavily.“
- **00:22:44 „So, if money still matters, which I don't think it will … my descendants would have a tiny fraction of what I have.“** (Musk sichert sich selbst sprachlich ab: „if money still matters“)

---

## 3 · Station 1 · „Machines make almost everything“ → ✓ unterwegs

- **Challenger, Gray & Christmas (Bericht Okt. 2026):** Firmen nannten KI als Grund für **121.401** angekündigte US-Stellenstreichungen bis Ende Okt. 2026, mehr als doppelt so viele wie im ganzen Jahr 2025 (**54.836**). Insgesamt 617.189 angekündigte Streichungen (−44 % zum Vorjahr) → KI ≈ 20 %. Im Oktober nur 1.265 (Tiefstwert des Jahres); Rekordmonat Mai 2026 mit 38.579. „Markt/Wirtschaftslage“ (130.531) hat KI als Hauptgrund überholt. HCAMag-Überschrift: „AI blamed for 121,401 job cuts, but the labor data isn't buying it“. Quellen: https://www.hcamag.com/us/specialization/transformation/ai-blamed-for-121401-job-cuts-but-the-labor-data-isnt-buying-it/594129 · https://www.cpapracticeadvisor.com/?p=193395 · **sicher** (mehrere Berichte; es sind Firmenangaben, keine gemessenen Jobverluste)
- **Amazon:** über 1 Mio. Roboter in den Lagern (Meilenstein Juli 2025), bei rund 1,5–1,56 Mio. Beschäftigten weltweit; laut WSJ-Berichten bald „as many robots as humans“. Quellen: https://www.therobotreport.com/amazon-ceo-says-robotics-key-faster-delivery-lower-costs/ · https://finance.yahoo.com/sectors/technology/articles/one-million-robots-amazon-automation-183547807.html · **sicher** (Größenordnung)
- **Humanoide Roboter:** Counterpoint Research: weltweit gut 22.000 ausgelieferte Humanoide im 1. Halbjahr 2026 (≈ +300 % zum Vorjahr), Erwartung > 50.000 für 2026; Agibot ca. 9.700. https://counterpointresearch.com/en/insights/humanoid-robot-shipments-up-300-forbes · **dünn/Suchauszug**. Einsätze: Agility „Digit“ bei GXO > 100.000 Kisten https://ai2.work/blog/digit-crosses-100-000-totes-humanoids-exit-the-demo-phase (dünn); Figure bei BMW (dünn).
- **KI im Büro:** Gallup (Jan. 2026): etwa die Hälfte der US-Beschäftigten nutzt KI zumindest ein paar Mal im Jahr, ein kleiner Teil täglich (ca. 13 %, Zahl prüfen) https://wtop.com/national/2026/01/how-americans-are-using-ai-at-work-according-to-a-new-gallup-poll/ · **dünn**. Epoch AI/Ipsos (2026): „one in five workers delegate work to AI“; vollständige Übergabe ganzer Aufgaben selten https://epoch.ai/publications/one-in-five-workers-delegate-work-to-ai · **dünn/Suchauszug**.
- **Musks eigene Größenordnung:** digitale Superintelligenz allein bringe +20–30 % Wirtschaftsleistung; „money irrelevant“ erst mit Robotern, Raumfahrt und „mass driver on the moon“ (Isaacson, 2.1) · **sicher**.
- **Urteil:** ✓ unterwegs, aber weit weg von „fast alles“. Fair bleiben: Hier hat Musk am ehesten recht.

---

## 4 · Station 2 · „Everything gets cheaper“ → ½

### 4.1 BLS-Verbraucherpreise (CPI-U, US-Städtedurchschnitt, nicht saisonbereinigt), selbst gerechnet · **sicher**

Rechenweg: Indexwert Dez. 2025 ÷ Indexwert Jan. 2000 − 1; daneben Jahresdurchschnitt 2025 ÷ Jahresdurchschnitt 2000 − 1 und Jan. 2000 → Aug. 2026. Daten: BLS CPI-Datenbank (Serien CUUR0000…), mitgeliefert im Python-Paket `cpi` 2.1.0. Original-Tabellen: https://www.bls.gov/cpi/data.htm · AEI/Perry-Grafik zum Vergleich: https://www.aei.org/carpe-diem/chart-of-the-day-or-century-8/

| Kategorie | BLS-Serie | Jan 2000 | Dez 2025 | Δ Jan00→Dez25 | Jahresdurchschnitt 2000→2025 | Aug 2026 | Δ Jan00→Aug26 |
|---|---|---|---|---|---|---|---|
| Alle Güter (Inflation) | CUUR0000SA0 | 168,8 | 324,054 | **+92,0 %** | +87,0 % | 334,98 | +98,4 % |
| Fernseher | CUUR0000SERA01 | 5115,9 | 92,729 | **−98,2 %** | −98,0 % | 96,561 | −98,1 % |
| Computer, Zubehör, Smart Home | CUUR0000SEEE01 | 518,9 | 33,73 | −93,5 % | −92,4 % | 38,02 | −92,7 % |
| Software & Zubehör | CUUR0000SEEE02 | 87,9 | 23,727 | **−73,0 %** | −72,5 % | 28,131 | −68,0 % |
| Mobilfunk-Dienste | CUUR0000SEED03 | 80,6 | 45,085 | −44,1 % | −38,8 % | 47,61 | −40,9 % |
| Spielzeug | CUUR0000SERE01 | 107,2 | 27,317 | −74,5 % | −73,6 % | 28,729 | −73,2 % |
| Kleidung | CUUR0000SAA | 126,8 | 128,122 | +1,0 % | +1,3 % | 136,752 | +7,8 % |
| Neuwagen | CUUR0000SETA01 | 143,3 | 178,034 | +24,2 % | +25,0 % | 179,715 | +25,4 % |
| Lebensmittel (zu Hause) | CUUR0000SAF11 | 166,3 | 315,664 | +89,8 % | +86,6 % | 321,5 | +93,3 % |
| **Miete (Hauptwohnung)** | CUUR0000SEHA | 181,1 | 440,667 | **+143,3 %** | +136,5 % | 448,997 | +147,9 % |
| Wohnen gesamt (Shelter) | CUUR0000SAH1 | 190,1 | 420,134 | +121,0 % | +114,7 % | 430,611 | +126,5 % |
| Medizinische Versorgung gesamt | CUUR0000SAM | 255,5 | 587,144 | +129,8 % | +122,4 % | 593,003 | +132,1 % |
| **Krankenhausleistungen** | CUUR0000SEMD01 | 112,6 | 446,056 | **+296,1 %** | +274,2 % | 459,659 | +308,2 % |
| Arztleistungen | CUUR0000SEMC01 | 239,6 | 431,766 | +80,2 % (unter Inflation) | +75,1 % | 439,389 | +83,4 % |
| Medikamente u. a. (Medical care commodities) | CUUR0000SAM1 | 235,2 | 418,532 | +77,9 % (unter Inflation) | +75,0 % | 405,528 | +72,4 % |
| **Pflegeheime & Tagespflege** | CUUR0000SEMD02 | 113,9 | 303,44 | **+166,4 %** | +156,1 % | 315,595 | +177,1 % |
| **Studiengebühren** | CUUR0000SEEB01 | 326,0 | 966,259 | **+196,4 %** | +187,8 % | 987,538 | +202,9 % |
| Kinderbetreuung & Vorschule | CUUR0000SEEB03 | 152,9 | 394,711 | +158,1 % | +147,2 % | 403,749 | +164,1 % |

Hinweise:
- Fernseher, Computer, Software sind **qualitätsbereinigt** (hedonisch): „ein Fernseher gleicher Qualität“. Sprechbar: „For every dollar a TV cost in 2000, the same TV today costs about two cents. For every dollar of hospital care, you now pay about four.“ (TV-Faktor 0,018; Krankenhaus-Faktor 3,96.)
- Inflationsbereinigt (÷ 1,92): Miete real +27 %, Pflegeheime real +39 %, Studiengebühren real +54 %, Krankenhaus real +106 %; Fernseher real −99 %.
- **„Medizin“ ist nicht einheitlich teurer:** Krankenhaus weit über der Inflation, Arztleistungen und Medikamente darunter, Medizin gesamt darüber (+130 % vs. +92 %).
- Gegenprobe Sekundärquellen: maseconomics (Jan 2000–Aug 2026: Krankenhaus +293 %, Studium +203 %, Miete +148 %, alle Güter +97 %, Löhne +137 %) https://maseconomics.com/why-is-everything-so-expensive-price-of-everything/ · AEI-Stand 2022 (Krankenhaus +220 %, TV −97 %, Software −70,5 %) · passt in der Größenordnung.
- Der Mechanismus hat einen Namen: **Baumol-Effekt** (William Baumol, 1960er): Wo Produktivität steigt, fallen Preise; Dienste, die menschliche Zeit brauchen (Pflege, Krankenhaus, Unterricht), werden relativ teurer. Lehrbuchwissen · **sicher**.

### 4.2 Pflegeheim und Rente

- **CareScout/Genworth Cost of Care 2025** (veröffentlicht 2.3.2026): Pflegeheim Einzelzimmer Median **$355 pro Tag ≈ $129.600 pro Jahr**; Doppelzimmer $315/Tag = $114.975/Jahr; häusliche Betreuung („non-medical caregiver“, Vollzeit) ≈ $101.244/Jahr. https://d1io3yog0oux5.cloudfront.net/_2ebdaa4eff576f39df62d5fd9866966e/genworth/news/2026-03-02_CareScout_Releases_2025_Cost_of_Care_Survey_1054.pdf · **dünn/Suchauszug** (Zahlen am PDF prüfen)
- Genworth 2024: Einzelzimmer $127.750, Doppelzimmer $111.325 · Genworth 2004: Einzelzimmer ≈ $65.200 ($179/Tag), ThinkAdvisor 2005 https://www.thinkadvisor.com/2005/05/25/genworth-elderly-pay-more-than-69000-for-ltc/ · **dünn**
- **Durchschnittliche Social-Security-Altersrente Jan. 2026: $2.071 pro Monat ≈ $24.850 pro Jahr** (nach +2,8 % COLA). https://www.ssa.gov/cola/factsheets/2026.html · **sicher**
- → Ein Jahr Pflegeheim (Einzelzimmer) ≈ **fünfmal** die durchschnittliche gesetzliche Jahresrente.

---

## 5 · Station 3 · „Someone pays you an income“ → ✗ bisher nur ein Versprechen

### 5.1 Stand: kein Gesetz, kein Programm
- Es gibt (Stand 10.11.2026) **kein** US-Gesetz und kein beschlossenes Programm für ein „universal high income“. Musk nennt keinen Betrag, keine Finanzierung, keine Behörde. **sicher** (keine gegenteiligen Berichte; Musk-Zitate selbst: „we have to figure out some like“, „I'm open to ideas“).
- **Entwürfe im Kongress 2026 (keiner beschlossen):**
  - Steuer auf KI-Umsätze/Tokens, die automatisch mit der Arbeitslosigkeit steigt (Start 2–3 % bei ≤ 5 % Arbeitslosigkeit), Geld für Jobprogramme; Demokraten im Repräsentantenhaus (u. a. Greg Casar, genannt auch Valerie Foushee, Sara Jacobs; Sponsoren prüfen). Fortune 1.9.2026 https://www.fortune.com/2026/09/01/bill-tax-ai-tokens-fund-jobs-technology-unemployment/ · allwork.space https://allwork.space/2026/09/u-s-lawmakers-propose-an-ai-tax-that-automatically-rises-with-unemployment/ · **dünn**
  - Sen. Mark Kelly: bundesweiter Treuhandfonds gegen große KI-bedingte Jobverluste (25.9.2026) https://www.kjzz.org/text/politics/2026-09-25/sen-kelly-proposes-federal-trust-fund-to-shield-workers-from-large-scale-ai-related-job-losses · **dünn/Suchauszug** (nur Überschrift)
  - Reform der Arbeitslosenversicherung inkl. „jobseeker's allowance“ und Einkommenshilfe bis zu 2 Jahren während Umschulung (Senats-Demokraten) https://newsweek.com/unemployment-benefits-would-get-boost-under-new-bill-linked-to-ai-fears-12620438 · **dünn**
  - Bernie Sanders: „Roboter-Steuer“, HELP-Bericht Okt. 2025 (KI könne ~100 Mio. US-Jobs ersetzen; 32-Stunden-Woche) https://www.washingtonexaminer.com/news/senate/3844942/sanders-plans-robot-tax-legislation/ · **dünn**
  - Überblick GovAI: https://www.governance.ai/research-paper/how-congress-is-approaching-ais-labor-market-impacts · Axios 25.3.2026 (Ökonomen/Investoren werben für Sicherheitsnetz) https://axios.com/2026/03/25/ai-job-loss-wealth-gap
  - NICHT verwenden (Film #5, Besitz/Dividende): Alex Bores' „AI dividend“ (New York), Alaska-Dividende, Staatsfonds.

### 5.2 Wer zahlt? Rechenbeispiel (eigene Rechnung, Musk nennt keinen Betrag)
- US-Bevölkerung 18+ am 1.7.2025: **≈ 269,8 Mio.** (Census Vintage 2025: 341.784.857 gesamt − 72.021.348 unter 18). https://www.census.gov/newsroom/press-kits/2026/vintage-2025-pop-estimates.html · Tabelle SCPRC-EST2025-18+POP (Spiegel: https://files.hawaii.gov/dbedt/census/popestimate/2025/state-pop/SCPRC-EST2025-18+POP.pdf) · **sicher** (Größenordnung), genaue Zahl dünn
- 50.000 $ × 269,8 Mio. = **≈ 13,5 Bio. $ pro Jahr** (50.000 $ ≈ ein gewöhnliches, kein „hohes“ Einkommen).
- Bundesausgaben Haushaltsjahr 2025: **≈ 7,0 Bio. $**; Einnahmen ≈ 5,2 Bio. $; Defizit ≈ 1,8 Bio. $ (5,9 % des BIP). CBO Monthly Budget Review FY2025 (Nov. 2025) https://www.cbo.gov/system/files/2025-11/61307-MBR-FY25-final.pdf · AAF https://www.americanactionforum.org/insight/cbo-fy-2025-budget-deficit-totaled-1-8-trillion/ · **sicher**
- US-BIP 2025 ≈ 30 Bio. $ (BEA; Größenordnung) → 13,5 Bio. $ ≈ 45 % der Wirtschaftsleistung · **dünn** (BIP-Zahl prüfen)
- Sprechbar: „Even fifty thousand dollars a year for every adult would cost about thirteen and a half trillion dollars a year. That's almost twice everything the federal government spends.“
- **Nuance (fair):** Brutto ≠ netto. Wird über Steuern finanziert, fließt viel zurück; Rossbach/Widerquist (2025) beziffern ein Grundeinkommen von 16.000 $ pro Erwachsenem netto auf ≈ 2,7 % des BIP, brutto ≈ 16 % (Projektdatei `scenario/recherche/grundeinkommen-finanzierbarkeit-2026-11-02.md`). Musks Mechanismus ist aber nicht Steuer, sondern Geldschöpfung („issue checks“, „create money in the database“) in der Erwartung, dass Güter schneller wachsen als Geld.
- **Der Haken genau an Station 2:** Neues Geld trifft auf Dinge, die nicht schneller wachsen (Wohnlage, Pflegezeit, Krankenhaus). Dort steigen die Preise. → Musks Deflations-Argument gilt für Fernseher, nicht für das, was man im Alter braucht. (Ökonomische Standardlogik; viele Kritiker, z. B. Romain Gougeon, Mark Moss, Firstpost, Las Vegas Sun/Gautam Mukunda https://lasvegassun.com/news/2026/aug/07/elon-musk-surprisingly-doesnt-understand-abundance/ · **sicher** als Argument, kein Messwert)
- Schecks und Inflation: Nach den Corona-Schecks stieg die US-Inflation bis Juni 2022 auf 9,1 % (Jahresrate, BLS). Wie viel davon die Schecks erklären, ist **umstritten** (Schätzungen der SF Fed: Konjunkturhilfen trugen bis Ende 2021 rund 3 Prozentpunkte bei; andere Studien weniger). Nur als „economists still argue“ verwenden.

### 5.3 Stimmen
- **Ekaterina Abramova** (London Business School, Data Science/KI): KI werde die Welt in 20 Jahren „undoubtedly reshape“, mache Altersvorsorge aber nicht automatisch überflüssig; breiter Wohlstand setze voraus, dass Regierungen die KI-Gewinne umverteilen. Business Insider, Jan. 2026 (7 Expertinnen/Experten), Nachdrucke AOL https://www.aol.com/articles/elon-musk-says-retirement-savings-100101373.html · IBTimes UK https://www.ibtimes.co.uk/elon-musk-ai-retirement-savings-experts-warning-1829693 · **dünn/Suchauszug** (Wortlaut am Original prüfen)
- **Sanjeev Sanyal:** „will bankrupt any government that attempts it“ (17.4.2026), siehe Abschnitt 2 · **sicher** (Zuordnung)
- **Vinod Khosla:** „only if the politics permits this great abundance“ (27.7.2026) · **dünn**
- **Zanny Minton Beddoes** fragte im Interview, woher die Einnahmen kommen, und warnte vor Inflation (hwbusters, Gizmodo) · **sicher** (Inhalt), Wortlaut ungeprüft
- **Kenneth Rogoff** soll Musks Satz „nonsense“ und „a surprisingly foolish thing to say“ genannt und gesagt haben, Musk könne seine Billion ja zurückgeben; Kapital werde wichtiger denn je. **Nur** laut Video „Times Axis“ (3.11.2026, FYNoiPNTOy4), Primärquelle (Interview/Kolumne) **nicht gefunden** → **nicht verwenden**, bis sie vorliegt.

---

## 6 · Station 4 · „It arrives in time“ → ✗

### 6.1 Musks Zeitpläne (nur Primärzitate)

| Datum | Anlass | Wortlaut | Was dann geschah | Quelle · Sicherheit |
|---|---|---|---|---|
| 21.12.2015 | Fortune-Interview | „We're going to end up with complete autonomy, and I think we will have complete autonomy in approximately two years.“ (Behörden könnten länger brauchen) | 2017: keine volle Autonomie | https://fortune.com/2015/12/21/elon-musk-interview/ · **sicher** |
| 19.10.2016 | Telefonkonferenz zur neuen Autopilot-Hardware | Ziel: Demonstrationsfahrt mit voller Autonomie von Los Angeles nach New York „by the end of next year“ (2017) | Fand 2017 nicht statt; Tesla verschob sie | Fortune https://fortune.com/2016/10/19/tesla-self-driving-tech/ · NBC https://www.nbcnews.com/business/autos/all-tesla-vehicles-being-produced-now-have-self-driving-hardware-n669441 · **sicher** |
| 29.9.2017 | Internationaler Raumfahrtkongress, Adelaide | Zwei Fracht-Starships zum Mars 2022, Crew 2024: „That's not a typo, although it is aspirational.“ | Kein Flug zum Mars bis heute | Fortune https://fortune.com/2017/09/29/elon-musk-space-x-australia/ · Planetary Society https://www.planetary.org/articles/20170929-spacex-updated-colonization-plans · **sicher** |
| **22.4.2019** | **Tesla Autonomy Day** (offizieller Tesla-Kanal, Video geprüft) | **03:13:50 „From our standpoint, if you fast forward a year, maybe a year and three months, but next year for sure, we will have over a million robotaxis on the road.“** · 03:05:20 „we feel very confident about being feature complete with self-driving next year … we expect to have the first operating robotaxis next year, with no one in them. Next year.“ | Erste bezahlte Robotaxi-Fahrten in Austin erst Juni 2025 (mit Sicherheitsbegleiter), ab Jan. 2026 erste Fahrten ohne Begleiter im Auto (fernüberwacht), kleine Flotte | Video https://www.youtube.com/watch?v=Ucp0TTmvqOE · TechCrunch https://techcrunch.com/2019/04/22/tesla-plans-to-launch-a-robotaxi-network-in-2020/amp · CNBC https://www.cnbc.com/2019/04/22/elon-musk-says-tesla-robotaxis-will-hit-the-market-next-year.html · **sicher** (Untertitel; Auto-Untertitel hören „fast for a year should look maybe a year maybe a year in three months“ → am Ton prüfen) |
| **22.4.2019** | gleiche Veranstaltung | **03:04:47–03:05:08 „So all these things I said we would do, we did it. Said we'd do it, we did it. We're gonna do the robotaxi thing too. Only criticism, and it's a fair one, is sometimes I'm not on time. But I get it done, and the Tesla team gets it done.“** (Auto-Untertitel: „rover taxi“, „to“) | Musk räumt Verspätungen selbst ein → **Fairness-Punkt** | Video · **sicher** (Untertitel) |
| 14./15.3.2025 | X | „Starship departs for Mars at the end of next year, carrying Optimus. If those landings go well, then human landings may start as soon as 2029, although 2031 is more likely.“ | Mars-Fenster 2026 wurde ausgelassen | Business Today https://www.businesstoday.in/technology/news/story/if-the-landings-go-well-elon-musk-plans-to-launch-tesla-optimus-and-human-missions-to-mars-as-early-as-spacex-starship-468071-2025-03-16 · **sicher** |
| Feb. 2026 | X / Reuters-Bericht | „SpaceX has already shifted focus to building a self-growing city on the Moon, as we can potentially achieve that in less than 10 years, whereas Mars would take 20+ years.“ — „The overriding priority is securing the future of civilization and the Moon is faster.“ | — | Fox Business https://www.foxbusiness.com/technology/musk-says-spacex-shifting-focus-self-growing-city-moon-before-mars-push · **sicher** (viele Fox-Ableger, Reuters-Text) |

**Was später doch kam (fair):**
- Tesla-Robotaxi Austin: Start 22.6.2025 mit Sicherheitsbegleiter; seit Jan. 2026 Fahrten ohne Begleiter im Auto (fernüberwacht), Miami ab Juli 2026; kleine Flotte (in einem Zwei-Wochen-Zeitraum rund 54 Fahrzeuge gezählt, dünn). https://insideevs.com/news/785220/tesla-robotaxi-austin-no-safety-monitor/ · https://techcrunch.com/2025/12/15/tesla-starts-testing-robotaxis-in-austin-with-no-safety-driver · **umstritten** (Flottengröße)
- Waymo (Google-Schwester) fährt fahrerlos in mehreren US-Städten, ca. 450.000 bezahlte Fahrten pro Woche (2026) · **dünn**
- Fazit: Vieles kommt, aber Jahre später und kleiner. Musk selbst: „sometimes I'm not on time. But I get it done.“ Für Sparer zählt genau das „when“.

### 6.2 Keynes 1930
- John Maynard Keynes, „Economic Possibilities for our Grandchildren“ (Essay, 1930, The Nation and Athenæum, Okt. 1930): Lebensstandard in „progressive countries“ in 100 Jahren „between four and eight times as high as it is to-day“; „the economic problem may be solved, or be at least within sight of solution, within a hundred years“ — unter der Bedingung „assuming no important wars and no important increase in population“; „Three-hour shifts or a fifteen-hour week may put off the problem for a great while.“ Volltext z. B. http://www.econ.yale.edu/smith/econ116a/keynes1.pdf · Mercatus https://www.mercatus.org/economic-insights/expert-commentary/economic-possibilities-our-grandchildren-will-we-ever-get · Open Culture https://openculture.com/2020/06/when-john-maynard-keynes-predicted-a-15-hour-workweek-in-a-hundred-years-time-1930.html · **sicher** (Wortlaute aus dem Essay)
- Eingetreten: US-BIP pro Kopf heute rund 6- bis 7-mal so hoch wie 1930 (real; je nach Datensatz 5–7×, Maddison Project / Mercatus) · **umstritten** (genaue Zahl), Größenordnung sicher.
- Nicht eingetreten: 15-Stunden-Woche. OECD: durchschnittlich geleistete Jahresstunden je Erwerbstätigem USA 2024 ≈ 1.796 (≈ 35 h pro Woche über alle 52 Wochen gerechnet), Deutschland ≈ 1.340, OECD-Schnitt ≈ 1.740. https://data.oecd.org/emp/hours-worked.htm · Spiegel https://fgeerolf.com/data/oecd/ANHRS.html · **dünn** (Zahlen 2024 prüfen)
- Parallele zu Musk: Auch Keynes knüpfte seine Vorhersage an Bedingungen. Der Wohlstand kam, die freie Zeit landete nicht automatisch bei den Menschen.

---

## 7 · Station 5 · „If he's wrong, you're fine“ → ✗

- **Allianz Life 2025 Annual Retirement Study:** 64 % der befragten Amerikaner sorgen sich mehr darum, dass ihnen das Geld ausgeht, als um den Tod (Befragung Jan./Feb. 2025, n = 1.000, ab 25 Jahren). Pressemitteilung 22.4.2025 https://secure.businesswire.com/news/home/20250422646926/en/Americans-Are-More-Worried-About-Running-Out-of-Money-Than-Death · **sicher**. Studie 2026: 67 % (2022: 57 %) · **dünn**
- **Finanzplaner (Zitate wörtlich laut Berichten):**
  - Eric Mangold (Argosy Wealth): „No one has a crystal ball and making such a monumental life change to stop saving for retirement because of something that may or may not happen, to me doesn't sound like a prudent financial move.“ · **dünn/Suchauszug** (Business Insider/Yahoo Jan. 2026)
  - Nicholas Juhle (CIO Greenleaf Trust): „That's an easy (and irresponsible) declaration to make when you have a net worth of nearly $800 billion.“ https://greenleaftrust.com/news/elon-musk-says-you-dont-need-to-worry-about-saving-for-retirement/ · **dünn**. Achtung: persönlich, im Film nur sinngemäß als Anreiz-Argument.
  - money.ca: Musk „isn't giving personal finance advice; he's describing a theoretical future economy.“ https://money.ca/retirement/musk-says-saving-for-retirement-wont-matter-in-10-to-20-years-thanks-to-ai-and-abundance-heres-why-thats-risky-advice · **dünn**
  - Knysna Plett Herald: Ersparnis als „insurance policy against a future that doesn't go according to Elon Musk's plan“. https://www.knysnaplettherald.com/News/Article/Business/will-technology-make-retirement-savings-obsolete-202602041009 · **dünn**
  - Stacy Johnson (CPA, Money Talks News), Antwort auf den X-Post vom 29.10.2026: nur 63 % der Amerikaner könnten eine Notausgabe von 400 $ bar bezahlen (Fed-SHED-Zahl) https://www.moneytalksnews.com/elon-musk-says-saving-for-the-distant-future-is-pointless-im-a-cpa-heres-why-hes-wrong/ · **dünn**
- **Gegenlager (Kapital zählt mehr):** L Rudolf L, „By default, capital will matter more than ever after AGI“, LessWrong 28.12.2024 https://www.lesswrong.com/posts/KFFaKu27FNugCHFmh/by-default-capital-will-matter-more-than-ever-after-agi (Substack-Titel „Capital, AGI, and human ambition“; später Grundlage von „The Intelligence Curse“ mit Luke Drago). Kern (Paraphrase): Wenn KI Arbeit ersetzt, wird Kapital zum allgemeinen Ersatz für Arbeit; wer heute Kapital hat, behält den Vorsprung, sozialer Aufstieg über Arbeit wird schwerer, und Staaten verlieren den Anreiz, sich um Menschen ohne Kapital zu kümmern. · **sicher** (Titel, Datum), Paraphrase.
- **Musk über sich selbst:** „my so-called wealth is simply a percentage ownership in … SpaceX and Tesla“ und „if money still matters, which I don't think it will“ (Isaacson, 2.1). In Moonshots: „it is better to be an optimist and wrong than a pessimist and right … for quality of life“ (01:09:08). → Anreiz-Argument ohne Vorwurf: Wer die Firmen besitzt, für den ist „optimistisch und falsch“ billig.
- **Gesetzliche Rente USA:** Treuhandfonds der Altersrente (OASI) laut Trustees-Bericht 2026 im 4. Quartal 2032 erschöpft, danach ca. 78 % der Leistungen zahlbar (kombiniert OASDI 2034). https://www.ssa.gov/OACT/TR/2026/II_A_highlights.html · AAF https://www.americanactionforum.org/insight/highlights-of-the-2026-social-security-and-medicare-trustees-reports/ · **sicher** (Jahr), Prozentsatz prüfen.

---

## 8 · Station 7 · Einkommen per Gesetz

### 8.1 Deutschland
- 17.11.1881: Kaiserliche Botschaft kündigt Sozialversicherung an. Krankenversicherung 1883, Unfallversicherung 1884.
- **„Gesetz, betreffend die Invaliditäts- und Altersversicherung“ vom 22.6.1889** (Reichstag stimmte im Mai 1889 zu), in Kraft **1.1.1891**. Altersrente ab **70**; Beiträge von Arbeitern und Arbeitgebern, dazu Reichszuschuss. Die meisten frühen Renten waren Invalidenrenten. Altersgrenze 65 erst 1916. https://www.bpb.de/themen/soziale-lage/rentenpolitik/289633/die-entwicklung-bis-1945/ · https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Historie/historie_node.html · **sicher** (Daten), Details (Wartezeit 30 Beitragsjahre) **dünn**
- Motiv war auch politisch: Bismarck wollte der Arbeiterbewegung/Sozialdemokratie den Wind aus den Segeln nehmen (Sozialistengesetz 1878) · **sicher** (Lehrbuch). Für den Film: Antwort auf Umbruch und Unruhe — Musk selbst sagt für die nächsten Jahre „social unrest“ voraus (Moonshots 01:06:42).

### 8.2 USA
- **Social Security Act unterzeichnet am 14.8.1935.** Beiträge ab 1937, **erste monatliche Rente Januar 1940**: Ida May Fuller (Vermont), Scheck Nr. 00-000-001 über **$22,54**; sie hatte insgesamt $24,75 eingezahlt, wurde 100 Jahre alt und bezog bis 1975 rund $22.889. https://www.ssa.gov/history/imf.html · **sicher** (SSA-Geschichtsseite, Standardfakt)
- **FDRs Erklärung bei der Unterzeichnung** (schriftlich: https://www.presidency.ucsb.edu/documents/statement-signing-the-social-security-act-0 · https://www.ssa.gov/history/fdrstate.html): „Today a hope of many years' standing is in large part fulfilled. The civilization of the past hundred years, with its startling industrial changes, has tended more and more to make life insecure. Young people have come to wonder what would be their lot when they came to old age. The man with a job has wondered how long the job would last.“ … „We can never insure one hundred percent of the population against one hundred percent of the hazards and vicissitudes of life, but we have tried to frame a law which will give some measure of protection to the average citizen and to his family against the loss of a job and against poverty-ridden old age.“ … „This law, too, represents a cornerstone in a structure which is being built but is by no means complete.“ · **sicher**
- **Gefilmte Fassung** (Video geprüft, siehe Clips): FDR sagt im Film „poverty-**stricken** old age“ (geschrieben: „poverty-ridden“). Zahl der Geschützten: von Hand untertitelt „30 million“, automatisch „50 millions“ → am Ton prüfen (schriftlich „thirty millions“). Der Satz „cornerstone …“ ist **nicht** im Film (American Rhetoric: Ton/Film gemeinfrei, Teile fehlen) https://americanrhetoric.com/speeches/fdrsocialsecurityact.htm
- Hintergrund (SSA-Geschichte): Industrialisierung, Verstädterung, Rückgang der Großfamilie, längeres Leben, Ersparnisse der Älteren in der Großen Depression vernichtet. https://www.ssa.gov/policy/docs/progdesc/sspus/histdev.html · **sicher** (Inhalt), Einzelzitate „unbearable burden“ (Committee on Economic Security) **dünn**

### 8.3 Heute (für die Brücke „Anspruch statt Gnade“)
- Kein Gesetz für ein KI-Einkommen; nur Entwürfe (Abschnitt 5.1). Musk selbst: „government is very slow moving“, „AI is moving … 10 times faster than government“ (Moonshots 01:26).
- Isaacson fragte Musk am 20.10.2026 ausdrücklich nach „commons“ wie 1890ff. (Schule frei für alle, Gesundheit als Gemeingut); Musk antwortete, Geld werde nicht zählen (2.1). → Brücke: Die Frage nach dem Gesetz ist gestellt, beantwortet ist sie nicht.

---

## 9 · Staunen-Kandidaten
1. **Zwei Cent und vier Dollar:** Für jeden Dollar, den ein Fernseher im Jahr 2000 kostete, kostet ein gleich guter heute rund 2 Cent; für jeden Dollar Krankenhaus heute rund 4 Dollar (BLS, eigene Rechnung) · sicher
2. **Ida May Fuller:** Gesetz 1935, erster Rentenscheck Januar 1940 über 22,54 $; sie zahlte 24,75 $ ein und bekam bis zu ihrem Tod mit 100 fast 23.000 $ (SSA) · sicher
3. **Musks eigene Rechnung:** Superintelligenz allein = +20–30 % Wirtschaft; „Geld egal“ braucht laut Musk Roboter, Raumfahrt und ein Katapult auf dem Mond („mass driver“) für eine „million times“ größere Wirtschaft (Isaacson) · sicher
4. **Keynes 1930:** sagte den Reichtum fast richtig voraus (4–8× in 100 Jahren; eingetreten ~6×), die 15-Stunden-Woche nicht · sicher/umstritten
5. **Pflegeheim:** ein Jahr ≈ 130.000 $ ≈ fünfmal die durchschnittliche gesetzliche Jahresrente (CareScout 2025, SSA 2026) · dünn/sicher
6. **Amazon:** über 1 Mio. Roboter bei ca. 1,5 Mio. Beschäftigten · sicher
7. Erstes kommerzielles Transatlantik-Telefonat 7.1.1927: 75 $ für drei Minuten (Zeitungen 1927, z. B. Papers Past https://paperspast.natlib.govt.nz/newspapers/TS19270108.2.84) ≈ 1.400 $ heute (CPI-Faktor ≈ 18,6) · dünn (Kaufkraftumrechnung grob); berührt Film #18 („Preise fallen“) → nur wenn dort nicht verwendet.

---

## 10 · Kenner-Test (Konkurrenzvideos, Rohdaten `scenario/themen/treffer-check-2026-11-10.json`)

| Video | Zahlen | Argumente (gelesen bzw. aus Beschreibung) |
|---|---|---|
| The Builders with Walter Isaacson, „Elon Musk: The End of Work, the Death of Money, and a World Run by AI“ (20.10.2026, AQnwQHMnCrE) | 1,9 Mio. Aufrufe, Kanal 25.000 Abos | Musks eigene Erzählung ohne Prüfung: Staatsschulden nur mit KI/Robotern lösbar, +30 % Wirtschaft, „million times“ mit Mond-Katapult, Währung in Watt/Tonnen, Geld egal; Isaacsons Gemeingüter-Frage bleibt unbeantwortet (Transkript gelesen) |
| Valuetainment, „‚AI Arms Race Is COMING‘ – Musk DECLARES Retirement Savings Will Become USELESS“ (18.2.2026, W-jdh08zEGM) | 684.000 Aufrufe, Kanal 7,2 Mio. | Spielt den Moonshots-Clip; Widerspruch „can't predict“ + „don't save“ sei „insane“; „super reckless“; Musk liege bei Zeitplänen oft falsch; „what if he's wrong?“; Pompliano: KI-Wettrüsten, Kapital zählt, „right that you won't trade time for money, wrong that you won't need money“, immer ein Sicherheitsnetz (Transkript gelesen) |
| Rob Berger, „Should You Stop Saving for Retirement Because of AI? (FQF)“ (7.11.2026, zHl6OW8J_a0) | 48.700 Aufrufe, Kanal 302.000 | Fragestunde, Anlass Business-Insider-Artikel zum X-Post vom 29.10.; Transkript nicht bekommen (429) → Argumente vermutlich klassisch (Planer-Sicht: Notgroschen, Unsicherheit) · ungeprüft |
| Weitere | — | Dr. Ed Weir „Elon Musk Says Saving for Retirement Is Pointless“ (11.1.2026, 34.000) — **fast gleicher Titel wie unserer**; Mark Moss (Dinge billiger, Lebenshaltung teurer, knappe Vermögenswerte); Firstpost (Knappheit: Strandgrundstücke, Rohstoffe, Aufmerksamkeit; X-Money-Ironie); Romain Gougeon (Quantitätsgleichung, Baumol, „juste sur le mécanisme, faux sur l'ampleur“); Finanztip (Umverteilungs-Annahmen, weiter sparen); SANSKRITI IAS (843.000, „Money Will Be Useless by 2036!“); Times Axis (Rogoff-Behauptung, unbelegt) |

**Was nur unser Film bringt:** (1) Der Spar-Satz war die Antwort auf die Steuer-Frage (Kontext aus derselben Minute). (2) Musks eigene Bedingung als Prüfliste, Punkt für Punkt mit Urteil. (3) BLS-Preisspaltung genau für Alters-Bedarf (Krankenhaus, Pflegeheim, Miete) mit Zahlen 2000→2025. (4) Musks eigene +20–30 %-Schätzung und die Mond-Bedingung. (5) Seine eigene Aussage „sometimes I'm not on time“ (Fairness) und die wandernde Frist 10–20 Jahre → 2036 → „distant future“. (6) Rente als Gesetz mit FDR-Original-Ton und Ida May Fuller. Bei „what if he's wrong“ und „Zeitpläne“ nicht wie Valuetainment klingen: dort als Spott, bei uns als nüchterne Prüfung mit Primärzitaten.

---

**Überschneidung mit eigenen Filmen (grep über vo-/text-Dateien, 10.11.):** Keynes' 15-Stunden-Woche in film-bullshit-jobs und film-zeit (dort „He was right about the riches“); Acemoglu in film-singularitaet (Clip „technology doesn't automatically bring prosperity“) und film-dreiteilung; film-ueberfluss: „In the benign scenario, as Musk calls it, everyone gets a universal high income. … Whoever owns the robots decides who shares in the abundance.“ Keine Treffer für Bismarck, Social Security Act, Ida May, Baumol, Perry, Autonomy Day, robotaxi, transatlantic.

---

## 11 · Falsche oder heikle Zuschreibungen (gesammelt)
- „would bankrupt any government“ → **Sanjeev Sanyal**, nicht Musk (Fox Business/eWeek irren).
- „only if the politics permits this great abundance“ → **Vinod Khosla**, nicht Musk.
- „The services will be there to support you. You'll have the home, you'll have the healthcare …“ → **Peter Diamandis**, nicht Musk.
- Billionen-Spenden-Herausforderung 2036 → **Daron Acemoglu**, nicht Rogoff; „he may not have a trillion to give away“ → **Gita Gopinath**.
- Rogoff „nonsense / surprisingly foolish / give his trillion back“ → nur Times-Axis-Video, Primärquelle fehlt → nicht verwenden.
- „pointless“ → X-Post 29.10.2026, nicht Podcast.
- „2036“ → Economist-Interview Juli 2026, nicht Moonshots.
- Moonshots: „UHI = Schecks vom Staat“ war in Moonshots nur eine Nebenbemerkung („just issue people free money“); Musks Hauptmechanismus dort war fallende Preise (Deflation), „not tax and redistribute“. Die Schecks als Hauptvorschlag kamen am 17.4.2026 (X) und im Juli (Economist).
- Video fR3R0YXE-ck ist ein chinesischer Re-Upload, nicht das Original.
- Bismarck: Altersrente ab 70, nicht 65.

---

## 12 · Offen für den Faktencheck (Schritt 7)
1. Economist-Interview: Wortlaut „money won't matter in 2036“ und Zeitmarke (Kapitel ab ca. 31:20) am Video; Aufnahmedatum 20. oder 23.7.2026.
2. Moonshots: Sprecher 01:06:26, 01:08:23, 01:09:08, 01:10:43, 01:15:02 am Ton.
3. Abramova-Wortlaut (Business Insider Jan. 2026).
4. CareScout-PDF 2025 (Pflegeheim $355/Tag).
5. Census 18+ (269,8 Mio.), BIP 2025.
6. OECD-Stunden 2024 (USA/Deutschland).
7. Robotaxi-Flottengröße 2026, Waymo-Fahrten pro Woche.
8. X-Post 29.10.2026 Wortlaut am Post.
9. FDR-Film: „30“ oder „50 millions“ am Ton (für den Clip nicht nötig).
