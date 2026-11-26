# Faktencheck · „Why AI Billionaires Are Building Bunkers“ (Film #72) · geprüft: vo-v2.txt → vo-v3.txt

Stand: Mittwoch, 25.11.2026. Release: Montag, 7.12.2026, 17:00 Wien. Alle relativen Zeitwörter sind für diesen Tag geprüft (Abschnitt 7). Geprüft ist jeder Satz mit Tatsachengehalt in `vo-v2.txt` samt den drei Clip-Zeilen (C1, C2, C3) und jede Einblendung und Zitatkarte in `text-v2.md` (Abschnitt 3b). Die Zeilennummern gelten für `vo-v2.txt` und `vo-v3.txt` gleich (beide 108 Zeilen). `clips-geprueft.json` lag bis zum Abschluss nicht vor; was am Clip-Wortlaut hängt, steht in Abschnitt 5.

**Ampel (wie bei #73):**
- **grün:** an der Primärquelle bestätigt (Bericht, Gesetz, Umfrage, eigene Seite der Person oder Firma; gesehen als Suchauszug der Primärseite, siehe Quellenlage), **und** eine zweite, unabhängige Quelle stimmt überein.
- **gelb:** zugespitzt, ungenau, nur eine Quelle oder die Primärquelle war nicht erreichbar. Gelb heißt nicht falsch; die Zeile darf bleiben. Wo es sich lohnt, steht ein Kann-Vorschlag dabei.
- **rot:** falsch oder irreführend. Das ist eine Muss-Änderung.
- **–:** Deutung, Szenario oder Frage, als solche hörbar. Kein Prüfgegenstand.

**Ergebnis:** 88 geprüfte Aussagen (50 im Sprechtext samt den drei Clips, 38 Einblendungen und Zitatkarten), dazu 30 Stellen ohne Tatsachengehalt (–). **44 grün · 44 gelb · 0 rot** (Sprechtext 24 · 26 · 0, Bild 20 · 18 · 0).
- **Sprechtext: keine rote Zeile.** `vo-v3.txt` ist darum byte-gleich mit `vo-v2.txt` (geprüft mit `cmp`). Länge unverändert: **1.362 Wörter** (`regel_check.py`: ≈ 9,4 Min; 12 Hinweise, alle bekannte Fehlalarme: „A.I.“ als Ich-Satz). Hook, Kernsatz, beide Abo-Aufrufe, alle Stimm-Tags, die drei Clip-Zeilen und alle Einleitungen vor den Clips sind unverändert.
- **Bild und Schnitt: keine Muss-Änderung (MB).** Acht Kann-Änderungen im Bild (KB1–KB8), fünf im Sprechtext (K1–K5). Jakobs Wahl.
- **Die Auflösung hält.** „anti-mutiny“-Abläufe (Hardened Structures, Brian Camden) und „detention areas“ (SAFE, McLean, Virginia) stehen so im WaPo-Text vom 9.10.2026, gesehen über zwei Nachdrucke (Moneywise, Yahoo Finance) und die Titelzeile der WaPo-Seite selbst. Das WaPo-Original war gesperrt. Darum gelb, nicht grün; einen Widerspruch gibt es nirgends.
- **Die wichtigsten Befunde:**
  - **Axios 9.10.2026 ist grün.** Führungskräfte bei Anthropic, OpenAI und anderen spielen privat den „day after“ eines katastrophalen KI-Ereignisses durch (am ehesten ein Cyberangriff auf Finanzdienste, Internet, Strom und Wasser) und wie Öffentlichkeit und Politik sich dann gegen sie wenden. OpenAI: „preparedness exercises“, „not treated as inevitable“. Das deckt Z. 49–50, 69–70 und 74.
  - **Altmans Bomben-Satz ist ein Wort kürzer als belegt.** Berichte zitieren „not because of AI, but **just** because people are dropping bombs in the world again“. In Z. 22 und auf der Einblendung fehlt „just“ (gelb, K1, KB1). Am Clip prüfen.
  - **Senatsentwurf S. 5518** („Make AI Work for Americans Act“): Nummer stimmt, eingebracht am 24.9.2026, an den Finanzausschuss überwiesen, keine Mitunterzeichner, nicht beschlossen (congress.gov, GovTrack). Die 75 % für 26 Wochen sind laut Roll Call eine **Untergrenze** („a minimum of 75 percent wage replacement“). Laut National Review gilt sie erst, wenn ein Beirat eine „significant labor market disruption“ erklärt, und dann für Arbeitslose allgemein. „up to three quarters“ und „If A.I. takes your job“ sind darum vereinfacht, aber nicht irreführend (gelb, K4, KB3, KB4).
  - **Der Router war am 13.11.2026**, also im November 2026. Die FAA stoppte landesweit alle Abflüge; Ankünfte und Medizinflüge liefen weiter. Die Dauer schwankt je Bericht („more than four hours“, „more than five hours“). FAA-Chef Bedford schloss Cyberangriff und KI aus. „every takeoff“ ist leicht zugespitzt (gelb, K2), „ABOUT 4.5 HOURS“ im Bild nicht sicher (KB2).
  - **Schweiz:** Grundsatz seit den 1960er-Jahren; 2022 rund 9,3 Mio. Schutzplätze für rund 8,7 Mio. Einwohner, Deckung über 100 % (BABS, Prüfbericht des Bundes). „Many are wine cellars or party rooms“ ist ein Wort zu stark: swissinfo schreibt im Titel „some“ (gelb, K3).
  - **Gallup:** 71 % gegen ein KI-Rechenzentrum in der Nähe, 53 % gegen ein Atomkraftwerk; befragt 2.–18.3.2026, veröffentlicht 13.5.2026 (grün, KB5).
  - **Sutskever:** Wortlaut beider Sätze, „a group of new researchers“, Sommer 2023, damals Chefwissenschaftler (bis Mai 2024) stimmen (grün).
- **Ohne Befund (grün):** Sutskever (Z. 7–8, 35–36); „The owners don't love the word bunker“; International AI Safety Report 2026 (über 100 Fachleute, echte Cyberangriffe mit KI); Harris früher bei Google; Axios (Z. 49–50, 69–70, 74); „No A.I. involved“; Rushkoff (Resort, fünf Investoren, „the Event“, „the angry mobs“, Schlösser, Halsbänder, Roboter, verdrehte Augen, „treat them like friends right now“); Gallup; Schweiz (Grundsatz, mehr Plätze als Menschen); Helsinki; Microsoft; „The bill hasn't passed“.
- **Dünn, aber haltbar (gelb):** Titelsatz Z. 1 · Tür voller Beton und Größe (Wired nur über Berichte) · Zuckerberg „for storms“ (er sagt „hurricane shelter or whatever“) · ob Theo Von nach dem Bunker *fragte* (Z. 20; am Clip prüfen) · Clip-Wortlaute C1–C3 · Bomben-Satz ohne „just“ · Verkäufer und KI auf der Liste (Newsweek KI-gestützt plus WaPo, Plural dünn) · Altman 2023 (WSJ-Video nicht gesehen, Wortlaut in zwei Berichten gleich) · Wendy Hall · Vorratsdauern (Werbung) · Router „every takeoff“ · „anti-mutiny“ und „detention areas“ (WaPo nur über Nachdrucke) · „in people and relationships“ (Wortlaut nur über Buchkopien) · Weinkeller („many“) · Harris „Write laws“ (inoffizielle Transkripte) · Senatsentwurf („up to“).

**Quellenlage (wichtig für den Zweitprüfer):**
- **WebFetch:** `www.washingtonpost.com`, `finance.yahoo.com` und `moneywise.com` scheiterten mit ENOTFOUND (nicht in den Netzwerk-Freigaben der Sitzung). Danach wurden keine weiteren Seiten per WebFetch versucht, auch kein Archiv (archive.org).
- **Alles andere stammt aus WebSearch-Auszügen vom 25.11.2026.** Wo die Suche den Text der Primärseite zeigte, gilt das als Primärquelle: axios.com, congress.gov, govinfo.gov, news.gallup.com (PDF), blogs.microsoft.com, babs.admin.ch, admin.ch (Prüfbericht), finland.fi, atlassurvivalshelters.com, archive.rushkoff.com, industry.gov.au (AI Safety Report), washingtonpost.com (nur Titelzeile und Teaser). Nur über Zweitquellen: WaPo-Fließtext (Moneywise, Yahoo Finance, MSN), Wired 2023, Bloomberg-Video, WSJ Tech Live 2023, Theo-Von-Folge, Harris-Folge (Singju-Transkripte), Karen Haos Buch (Atlantic-Auszug über Fortune, Futurism, Windows Central).
- **Zum direkten Lesen** müssten in den Netzwerk-Einstellungen der Sitzung u. a. `washingtonpost.com`, `moneywise.com`, `finance.yahoo.com`, `newsweek.com`, `rollcall.com`, `govinfo.gov` und `theatlantic.com` freigegeben werden. Für den Upload am 7.12. reicht der jetzige Stand.
- **Clips:** kein Wortlaut und keine Zeitmarke am Video geprüft (`clips-geprueft.json` fehlt).

---

## 1 · Muss-Änderungen

### Im Sprechtext (eingearbeitet in vo-v3.txt)

Keine. Keine Zeile ist falsch oder irreführend. `vo-v3.txt` = `vo-v2.txt`, Byte für Byte.

### Im Bild und im Schnitt (zum Übernehmen in text-v3 / Bau)

Keine. Alle Punkte für die Bauer stehen als Kann-Änderungen in Abschnitt 4 (KB1–KB8). Dringend vor dem Bau, weil Zitat- oder Zahlentext: **KB1** (Altmans Bomben-Satz mit „just“), **KB2** (Dauer des FAA-Stopps), **KB3/KB4** (S. 5518).

---

## 2 · Ampel: die heikelsten Aussagen (für die Ampelseite)

| # | Aussage (Z.) | Ampel | In einem Satz | Primärquelle |
|---|---|---|---|---|
| 1 | „anti-mutiny“ und „detention areas“ (Z. 15, 67–68) | **gelb** | Laut Washington Post (9.10.2026) haben Projekte von Hardened Structures „anti-mutiny“-Abläufe gegen Wachleute oder andere Bewohner, und die Firma SAFE hat Bunker mit Spas, Go-Kart-Bahnen und „detention areas“ entworfen; das Original war gesperrt, zwei Nachdrucke sagen dasselbe. | [WaPo, 9.10.2026](https://www.washingtonpost.com/style/2026/10/09/spas-rock-walls-other-must-have-amenities-your-doomsday-bunker/) · [Moneywise](https://moneywise.com/news/top-stories/luxury-doomsday-bunkers-ultra-rich-amenities) |
| 2 | KI-Firmen proben den „day after“ (Z. 49–50, 69–70, 74) | **grün** | Axios berichtete am 9.10.2026, dass Führungskräfte bei Anthropic, OpenAI und anderen privat durchspielen, wie Öffentlichkeit und Politik nach einem katastrophalen KI-Ereignis reagieren; OpenAI nennt es Übungen, keine Vorhersage. | [Axios, 9.10.2026](https://www.axios.com/2026/10/09/ai-companies-day-after-major-attack) |
| 3 | Sutskevers Bunker und „optional“ (Z. 7–8, 35–36) | **grün** | Im Sommer 2023 sagte OpenAIs damaliger Chefwissenschaftler vor neuen Forschern, man werde vor der Freigabe von AGI einen Bunker bauen, und der Eintritt sei „optional“ (Karen Hao, Empire of AI). | [Fortune, 20.5.2025](https://fortune.com/2025/05/20/chatgpt-openai-ilya-sutskever-chief-scientist-planneddoomsday-bunker-agi/) |
| 4 | Altman: Bomben, nicht KI (Z. 20–22) | **gelb** | Bei Theo Von (23.7.2025) sprach Altman von „underground concrete, heavy reinforcement basements“ und nannte als Grund „not because of AI, but just because people are dropping bombs in the world again“; im Film fehlt „just“. | [Fortune, 24.7.2025](https://fortune.com/2025/07/24/sam-altman-theo-von-podcast-ai-fears-humanity/) |
| 5 | Router im November (Z. 51–52) | **gelb** | Am 13.11.2026 stoppte die FAA landesweit die Abflüge für mehr als vier Stunden, Ursache ein fehlerhafter Router, kein Cyberangriff, keine KI; Medizinflüge liefen weiter. | [Axios, 16.11.2026](https://axios.com/2026/11/16/faa-flights-ground-stop-router-cause-reasons) |
| 6 | Gallup (Z. 71) | **grün** | Im März 2026 lehnten 71 % ein KI-Rechenzentrum in ihrer Gegend ab, 53 % ein Atomkraftwerk. | [Gallup (PDF), 13.5.2026](https://news.gallup.com/file/poll/709808/260513_AIDataCenters.pdf) |
| 7 | Schweiz (Z. 88–89) | **grün** | Seit den 1960er-Jahren gilt ein Schutzplatz für jeden Einwohner; 2022 gab es rund 9,3 Mio. Plätze für rund 8,7 Mio. Menschen. | [BABS](https://www.babs.admin.ch/en/shelters-for-the-population) |
| 8 | Senatsentwurf (Z. 95, 97) | **gelb** | S. 5518 (24.9.2026) würde nach einer erklärten Störung des Arbeitsmarkts mindestens 75 % des Lohns für 26 Wochen ersetzen; er liegt im Finanzausschuss und ist nicht beschlossen. | [congress.gov](https://www.congress.gov/bill/119th-congress/senate-bill/5518) |
| 9 | Harris „Don't build bunkers. Write laws.“ (Z. 94) | **gelb** | Der Satz steht in zwei inoffiziellen Transkripten von Harris-Gesprächen aus 2026, je leicht anders geschrieben; welches Gespräch, ist am Ton zu prüfen. | [Singju Post](https://singjupost.com/transcript-why-ai-ceos-are-building-bunkers-tristan-harris/) |
| 10 | Microsoft (Z. 96) | **grün** | Microsoft sagte am 13.1.2026 zu, die Stromkosten seiner Rechenzentren samt Netzausbau selbst zu tragen, damit Haushalte nicht mehr zahlen, und keine Steuernachlässe zu suchen. | [Microsoft, 13.1.2026](https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/) |

---

## 3 · Alle Aussagen

### 3a · Sprechtext (vo-v2.txt / vo-v3.txt)

| # | Z. | Aussage | Ampel | Befund | Quelle (Datum) |
|---|---|---|---|---|---|
| S01 | 1 | „The people building artificial intelligence are building bunkers.“ | gelb | Hält in dieser Form (nie „all of them“): Sutskever kündigte 2023 einen an, Zuckerberg hat einen Schutzraum, Altman „heavy reinforcement basements“, Harris 2026: „the AI company leaders are building bunkers“. Gebaut ist nur Zuckerbergs Anlage belegt. | siehe S05, S12, S15, S30 |
| S02 | 2–3 | Rahmung („They see this technology up close …“) | – | Deutung. | – |
| S03 | 4 | „some of them have built a place to hide. Underground. Behind a door filled with concrete.“ | gelb | Wired (14.12.2023): Metalltür, mit Beton gefüllt; Wired selbst gesperrt, Angaben in mehreren Berichten gleich. | [Fortune, 27.12.2024](https://fortune.com/2024/12/27/mark-zuckerberg-hawaii-underground-doomsday-bunker/) · Faktenzettel F4 |
| S04 | 5–6 | „A door that only opens for a few.“ · „So what are they hiding from?“ | – | Bild und Frage. | – |
| S05 | 7–8 | „OpenAI's chief scientist at the time told a room of new researchers: ‚We're definitely going to build a bunker before we release A.G.I.‘“ | grün | Atlantic-Auszug aus Haos „Empire of AI“ (15.5.2025): Sommer 2023, Treffen mit „a group of new researchers“, Wortlaut wörtlich. Sutskever war Mitgründer und Chefwissenschaftler bis Mai 2024, „at the time“ stimmt. Ein anwesender Forscher ist die Hauptquelle, zwei weitere bestätigten den Bunker (ob anwesend, schreiben die Berichte verschieden). Sutskever gab keinen Kommentar. | [Fortune, 20.5.2025](https://fortune.com/2025/05/20/chatgpt-openai-ilya-sutskever-chief-scientist-planneddoomsday-bunker-agi/) · [Futurism](https://futurism.com/the-byte/openai-scientists-agi-bunker) · [Windows Central](https://www.windowscentral.com/software-apps/openai-scientists-wanted-a-doomsday-bunker-before-agi) |
| S06 | 9 | „A.G.I. A machine as smart as us.“ | – | Begriffserklärung. | – |
| S07 | 10 | „They're afraid of the machine.“ | – | ausgesprochenes Missverständnis. | – |
| S08 | 11 | „But no door stops a machine that's smarter than you. And they know it.“ | gelb | Erster Satz: Logik. „And they know it“ stützt sich auf einen Mann (Altman 2023, S24). | siehe S24 |
| S09 | 12 | „They're building bunkers for a reason …“ | – | Deutung. | – |
| S10 | 14–15 | „The fourth is written into the floor plans of new bunkers.“ | gelb | „detention areas“ stehen in Entwürfen (SAFE), „anti-mutiny“ sind Abläufe, keine Grundrisse. Als Vorgriff haltbar, Quelle wie S48/S49. | siehe S48, S49 |
| S11 | 16 | „That door filled with concrete is real. It's in Hawaii.“ | gelb | Koolau Ranch, Kauai; Tür wie S03. | wie S03 |
| S12 | 17 | „Under Mark Zuckerberg's ranch, there's an underground shelter bigger than most houses.“ | gelb | ~5.000 sq ft (Wired 2023), ~4.500 sq ft laut Bauunterlagen des Countys (über Hawaii News Now, Business Insider). Viele Berichte gleich, Primärquelle nicht gesehen. | [Fortune, 27.12.2024](https://fortune.com/2024/12/27/mark-zuckerberg-hawaii-underground-doomsday-bunker/) · [Business Insider NL](https://businessinsider.nl/mark-zuckerberg-says-he-doesnt-have-a-hawaiian-doomsday-bunker-just-a-little-shelter-its-bigger-than-most-houses/) |
| S13 | 18 | „He says it's for storms. In his words: ‚a little shelter. It's like a basement.‘“ | gelb | Bloomberg, The Circuit (19.12.2024): „No, I think that's just like a little shelter. It's like a basement.“ und „whatever you want to call it: a hurricane shelter or whatever“. Wortlaut über mehrere Berichte gleich, Video nicht gesehen. „for storms“ verdichtet sein „hurricane shelter or whatever“, haltbar. | [Fortune](https://fortune.com/2024/12/27/mark-zuckerberg-hawaii-underground-doomsday-bunker/) · [HuffPost UK](https://huffingtonpost.co.uk/entry/mark-zuckerberg-bunker-hawaii-doomsday_n_67671c62e4b08c77e531e1a4) |
| S14 | 19 | „The owners don't love the word bunker.“ | grün | Zuckerberg: „doomsday bunker … just not true“; Altman 2023: „I wouldn't say a bunker“, 2025: „I don't have something I would call a bunker“. | [Fortune](https://fortune.com/2024/12/27/mark-zuckerberg-hawaii-underground-doomsday-bunker/) · [Business Insider India, Okt. 2023](https://www.businessinsider.in/tech/news/the-ultra-rich-are-obsessed-with-their-doomsday-bunkers-but-sam-altman-joked-they-wont-really-matter-if-theres-an-ai-apocalypse/articleshow/104574211.cms) |
| S15 | 20 | „Last year, the comedian Theo Von asked the head of OpenAI whether he has one. Here's Sam Altman:“ | gelb | Folge #599, 23.7.2025, Stelle ~1:25 („Last year“ stimmt). Die Berichte zeigen nicht, ob Von fragte oder ob Altman das Thema selbst aufbrachte. Clip-Einleitung → am Clip prüfen (Abschnitt 5). | [Fortune, 24.7.2025](https://fortune.com/2025/07/24/sam-altman-theo-von-podcast-ai-fears-humanity/) · [UNILAD, 31.7.2025](https://www.uniladtech.com/news/ai/sam-altman-ww3-plan-fear-bombs-dropping-866223-20250731) |
| S16 | 21 | [CLIP C1] „… underground concrete, heavy reinforcement basements, but I don't have something I would call a bunker.“ · Von: „Sam, that's a bunker.“ | gelb | Inhalt in mehreren Berichten gleich, Wortlaut schwankt („underground, concrete heavy, reinforced basements“). Am Video nicht geprüft. | [UNILAD](https://www.uniladtech.com/news/ai/sam-altman-ww3-plan-fear-bombs-dropping-866223-20250731) · [YouTube](https://www.youtube.com/watch?v=aYn8VKW6vXA) |
| S17 | 22 | „‚Not because of A.I.,‘ he said, ‚but because people are dropping bombs in the world again.‘“ | gelb | Berichte: „it has been on my mind, not because of AI, but **just** because people are dropping bombs in the world again.“ Sinn erhalten, ein Wort fehlt → K1. | [Fortune, 24.7.2025](https://fortune.com/2025/07/24/sam-altman-theo-von-podcast-ai-fears-humanity/) · [Zvi Mowshowitz](https://thezvi.substack.com/p/on-altmans-interview-with-theo-von) |
| S18 | 23 | „The people who sell bunkers name old reasons, too. War. Pandemics.“ | gelb | Ron Hubbard (Atlas) in Newsweek (4.10.2026): seit 2020 COVID-19, Ukraine-Krieg, Iran-Krieg (dazu illegale Einwanderung, bewusst nicht genannt). Newsweek-Text laut Vorlauf KI-gestützt; WaPo nennt Pandemien (nur über Faktenzettel). | [Newsweek, 4.10.2026](https://www.newsweek.com/ai-war-and-civil-unrest-why-the-rich-are-getting-their-bunkers-ready-12518873) |
| S19 | 24 | „So the bomb is real. But it's the oldest reason in the book.“ | – | Urteil. | – |
| S20 | 25 | „This year, bunker makers began adding a reason to their list. Artificial intelligence.“ | gelb | Hubbard: KI könne man jetzt auf die Liste setzen (Newsweek, Okt. 2026). WaPo: Nachfrage wegen … „and even artificial intelligence“ (nur über Faktenzettel; die WaPo-Titelzeile in der Suche bestätigt den Text, nicht die Stelle). Belegt ist ein Hersteller plus ein Branchenbericht; der Plural ist dünn. Kein Beleg gefunden, dass Hersteller KI schon vor 2026 als Kaufgrund nannten. → K5 | [Newsweek](https://www.newsweek.com/ai-war-and-civil-unrest-why-the-rich-are-getting-their-bunkers-ready-12518873) · [WaPo](https://www.washingtonpost.com/style/2026/10/09/spas-rock-walls-other-must-have-amenities-your-doomsday-bunker/) |
| S21 | 26 | „Is it the machine they're afraid of?“ | – | Frage. | – |
| S22 | 28 | „A panel of more than a hundred experts says A.I. is already being used in real cyberattacks.“ | grün | International AI Safety Report 2026 (3.2.2026, Vorsitz Yoshua Bengio, über 100 Fachleute, über 30 Länder): kriminelle Gruppen und staatliche Angreifer nutzen KI aktiv in Cyber-Operationen; mindestens ein echter Vorfall mit halbautonomen Fähigkeiten. Einschränkung im Bericht: keine vollautonomen Angriffe, Wirkung auf Ausmaß unklar. | [Bericht (PDF)](https://internationalaisafetyreport.org/sites/default/files/2026-02/international-ai-safety-report-2026.pdf) · [Australische Regierung](https://www.industry.gov.au/publications/international-ai-safety-report-2026) · [The Register, 3.2.2026](https://www.theregister.com/2026/02/03/autonomous_cyberattacks_not_real_yet/) |
| S23 | 29–33 | Gedankenspiel: Maschine, die nicht vorbeigeht | – | Szenario, im Bild markiert. | – |
| S24 | 34 | „The head of OpenAI has said it himself: ‚None of this is gonna help if A.G.I. goes wrong.‘“ | gelb | WSJ Tech Live (Okt. 2023), auf Joanna Sterns Frage nach einem Bunker: „I would say no“ … „None of this is gonna help if AGI goes wrong, this is a ridiculous question“. Wortlaut in zwei Berichten gleich, WSJ-Video nicht gesehen. | [Business Insider India](https://www.businessinsider.in/tech/news/the-ultra-rich-are-obsessed-with-their-doomsday-bunkers-but-sam-altman-joked-they-wont-really-matter-if-theres-an-ai-apocalypse/articleshow/104574211.cms) · [Binance Square (Nachdruck)](https://www.binance.com/en/square/post/1430692) |
| S25 | 35–36 | „The scientist who announced it added one detail: ‚Of course, it's going to be optional whether you want to get into the bunker.‘“ | grün | wörtlich wie im Atlantic-Auszug. | wie S05 |
| S26 | 37 | „Optional.“ | – | – | – |
| S27 | 38 | „Some scientists doubt that machine is anywhere close.“ | gelb | Wendy Hall (Southampton) zur BBC (Okt. 2025): „The scientific community says AI technology is amazing, but it's nowhere near human intelligence.“ BBC-Original nicht gesehen, nur Nachdrucke. | [AOL-Nachdruck der BBC](https://www.aol.com/articles/tech-billionaires-seem-doom-prepping-230256740.html) · [Futurism](https://futurism.com/artificial-intelligence/billionaires-preparing-for-end) |
| S28 | 39–41 | Urteil „build it right … Cross the machine off the list.“ | – | Deutung. | – |
| S29 | 43 | „Tristan Harris used to work at Google. Today he's one of the industry's sharpest critics. This spring he said:“ | grün | Früher Design-Ethiker bei Google, Mitgründer des Center for Humane Technology. „sharpest critics“ ist Wertung. Folge Modern Wisdom #1079 vom 2.4.2026 („This spring“ stimmt). | [Wikipedia](https://en.wikipedia.org/wiki/Tristan_Harris) · [Time 100 AI](https://time.com/collections/time100-ai/6308793/tristan-harris-ai/) · [Shortform, 2.4.2026](https://www.shortform.com/podcast/episode/modern-wisdom-2026-04-02-episode-summary-1079-tristan-harris-ai-expert-warns-this-is-the-last-mistake-well-ever-make) |
| S30 | 44 | [CLIP C2] „… right now the AI company leaders are building bunkers.“ | gelb | Nur im inoffiziellen Transkript (Singju Post); am Ton nicht geprüft. Ein anderer Harris-Auftritt (Sam Harris, #469) hat einen ähnlichen Satz; nicht verwechseln. | [Singju Post](https://singjupost.com/transcript-why-ai-ceos-are-building-bunkers-tristan-harris/) · [YouTube](https://www.youtube.com/watch?v=NufB1LL_rCU) |
| S31 | 45 | „Right now. He names no names.“ | gelb | hängt am Clip-Wortlaut (Abschnitt 5). | Transkript |
| S32 | 46 | „Most shelters are stocked for weeks or months. The biggest ones promise a few years.“ | gelb | Atlas: „a minimum of 30 days“, größere Modelle „up to 6 months“ (eigene Seite). Vivos: „a minimum of one year“ (Fast Company). Survival Condo „bis 5 Jahre“ in dieser Suche nicht bestätigt (Wikipedia: Vorrat für Jahre), Oppidum „up to 10 years“ (Entwickler 2015). Alles Werbung, das sagt Z. 47. | [Atlas](https://atlassurvivalshelters.com/shelter-features/) · [Fast Company](https://www.fastcompany.com/3052348/a-bunker-fit-for-billionaires-lets-you-enjoy-the-apocalypse-in-luxury) · [Survival Condo](https://en.wikipedia.org/wiki/Survival_Condo) |
| S33 | 47–48 | „Sales promises … every bunker is a clock.“ | – | Deutung. | – |
| S34 | 49–50 | „Inside the A.I. industry, many expect a major A.I. incident. Not killer robots. More like a cyberattack that takes down banks, the internet, maybe the power.“ | grün | Axios: „These officials anticipate a large-scale event, most likely a cyberattack, that shuts down access to financial services, internet connectivity, or even power and water.“ Insider halten es für unvermeidlich. | [Axios, 9.10.2026](https://www.axios.com/2026/10/09/ai-companies-day-after-major-attack) · [Raw Story](https://www.rawstory.com/ai-uprising/) |
| S35 | 51 | „In November, one faulty router stopped every takeoff in America. For hours.“ | gelb | 13.11.2026: landesweiter Stopp aller Abflüge, Ursache ein Router an einem entlegenen FAA-Standort (Umbau Kupfer → Glasfaser), aufgehoben 20:15/20:19 Uhr ET, „more than four hours“ (je Bericht auch „more than five“). Ankünfte und Medizinflüge liefen weiter → „every takeoff“ leicht zugespitzt, K2. | [Axios, 16.11.2026](https://axios.com/2026/11/16/faa-flights-ground-stop-router-cause-reasons) · [KTVU/FOX](https://www.ktvu.com/news/faa-halting-installation-new-routers) · [ABC7](https://abc7.com/faa-outage-system-down-all-flights-grounded-notam/12687851/) |
| S36 | 52 | „No A.I. involved. Then the planes flew again.“ | grün | FAA schloss Fremdeinwirkung und KI aus; Bedford: „it's not a cyber issue“. Abflüge ab 20:15 Uhr ET. | [GovInfoSecurity](https://www.govinfosecurity.com/faa-rules-out-ai-hackers-behind-us-ground-stop-a-33395) · [Fortune, 14.11.2026](https://fortune.com/2026/11/14/faa-ground-stop-telecom-router-cybersecurity-white-house-situation-room-national-security-apparatus-l3harris/) |
| S37 | 53–55 | „A bunker can carry you through it … fuel. Filters. And people.“ | – | Gedankengang (Generator, Filter, Personal laut Herstellerangaben, F20). | – |
| S38 | 57 | „Some years ago, the writer Douglas Rushkoff was brought to a luxury resort to give a talk about the future.“ | grün | 2017, „super-deluxe private resort“, Vortrag über die Zukunft der Technik; Essay 2018, Buch 2022. | [Rushkoff-Archiv (Essay 2018)](https://archive.rushkoff.com/articles/1094-survival-of-the-richest.html) · [WaPo-Rezension, 26.10.2022](https://www.washingtonpost.com/outlook/2022/10/26/survival-richest-review-rushkoff/) |
| S39 | 58 | „Instead of an audience, five very rich investors walked in. … as he tells it“ | grün | „five super-wealthy guys“ aus Tech-Investment und Hedgefonds, mindestens zwei Milliardäre; seine Schilderung. | wie S38 · [CoinDesk (Buchauszug), 19.9.2022](https://www.coindesk.com/layer2/2022/09/19/how-the-tech-elite-plan-to-escape-an-apocalypse-of-their-own-making) |
| S40 | 59 | [CLIP C3] „How do I maintain authority over my security force after the Event?“ | gelb | Die Frage steht so im Essay (2018) und im Buch; im Clip erzählt Rushkoff frei, Wortlaut offen. | wie S38 |
| S41 | 60 | „‚The Event.‘ Their word for the day everything breaks down.“ | grün | Essay: ihr Wort für Umweltkollaps, Unruhen, Atomexplosion, Virus oder Hack, „that takes everything down“. | wie S38 |
| S42 | 61 | „armed guards against what they called ‚the angry mobs.‘“ | grün | „armed guards would be required to protect their compounds from raiders as well as angry mobs“. | wie S38 |
| S43 | 62 | „But after the Event, why would the guards still obey?“ | – | Frage, deckt sich mit der Frage der Männer. | – |
| S44 | 63 | „Special locks on the food supply. Disciplinary collars. Robots as guards.“ | grün | „special combination locks on the food supply“, „disciplinary collars of some kind in return for their survival“, Roboter als Wachen und Arbeiter. | wie S38 · CoinDesk |
| S45 | 64 | „Rushkoff offered a different answer. They rolled their eyes.“ | grün | „treat them like friends right now“; „They rolled their eyes at what must have sounded to them like hippie philosophy“ (Buchtext, über Kopien und Zusammenfassungen). | CoinDesk · wie S38 |
| S46 | 65 | „That's his account. The men were never named. And they were investors, not the people who build A.I.“ | grün | ungenannt; Tech-Investment und Hedgefonds, einer Chef eines Brokerhauses. | wie S38 |
| S47 | 66 | „But look at what gets planned today.“ | – | Überleitung. | – |
| S48 | 67 | „Some new bunker projects come with ‚anti-mutiny‘ procedures, so that guards, or anyone else inside, can't take over.“ | gelb | WaPo über Moneywise und Yahoo Finance: Camdens (Hardened Structures) Projekte „include ‚anti-mutiny‘ procedures, designed to prevent security staff or other occupants from taking control during a crisis“. Inhalt deckungsgleich; Original gesperrt; beide Nachdrucke aus derselben Kette (Moneywise → Yahoo). | [WaPo](https://www.washingtonpost.com/style/2026/10/09/spas-rock-walls-other-must-have-amenities-your-doomsday-bunker/) · [Moneywise](https://moneywise.com/news/top-stories/luxury-doomsday-bunkers-ultra-rich-amenities) · [Yahoo Finance](https://finance.yahoo.com/real-estate/articles/luxury-doomsday-bunkers-kart-tracks-090000049.html) |
| S49 | 68 | „Others are designed with ‚detention areas.‘ The question from that room is now in the floor plans.“ | gelb | „SAFE, a McLean, Virginia, company, says they've designed shelters with spas, go-kart tracks and detention areas, the Post reports.“ Zweiter Satz ist Deutung. | wie S48 |
| S50 | 69 | „The companies that build A.I. are preparing, too. This fall, they were reported to be rehearsing a day of their own.“ | grün | Axios, 9.10.2026 („Scoop: AI companies plot ‚day after‘ scenarios for public revolt“); Folgeberichte Inc42, CXOToday, Raw Story. | [Axios](https://www.axios.com/2026/10/09/ai-companies-day-after-major-attack) · [CXOToday](https://cxotoday.com/ai/are-ai-startups-prepping-war-games-and-sacking-staff-that-blow-the-whistle/) |
| S51 | 70 | „The day after an A.I. disaster. The day the public and the politicians turn against them.“ | grün | Axios: Reaktion von Öffentlichkeit und Politik nach einem katastrophalen KI-Ereignis; Ziel auch, Abgeordnete zu informieren. Kein „uprising“ im Text des Films, richtig so. | wie S50 |
| S52 | 71 | „Already, more Americans oppose an A.I. data center near their home than a nuclear power plant.“ | grün | Gallup (2.–18.3.2026, veröffentlicht 13.5.2026): 71 % gegen ein KI-Rechenzentrum in der eigenen Gegend (48 % stark), 53 % gegen ein Atomkraftwerk. | [Gallup (PDF)](https://news.gallup.com/file/poll/709808/260513_AIDataCenters.pdf) · [Washington Times, 13.5.2026](https://www.washingtontimes.com/news/2026/may/13/gallup-poll-7-10-americans-dont-want-ai-data-centers-near/) · [Fortune, 15.5.2026](https://fortune.com/2026/05/15/more-americans-nuclear-energy-data-center/) |
| S53 | 72 | „for some owners, a bunker is just insurance. Or a very expensive hobby.“ | – | ehrlicher Moment, Wertung; Spas, Kletterwände, Go-Kart-Bahnen belegt (S49). | – |
| S54 | 73 | „The two owners you heard from say storms and bombs. Not people.“ | gelb | wie S13 und S17. | – |
| S55 | 74 | „And one A.I. company says its drills are practice, not a prediction.“ | grün | OpenAI: „preparedness exercises“; „these scenarios are not treated as inevitable, but are meant to help us prepare for a variety of circumstances.“ Anthropic: kein Kommentar. | wie S50 · [Inc42](https://inc42.com/?p=575460) |
| S56 | 75–80 | Ausschluss, Auflösung, „the fear makes sense“, Frage | – | Urteil des Films (Leitgedanke). | – |
| S57 | 82 | Abo-Aufruf 1 | – | Mission. | – |
| S58 | 84 | „Treat your guards like friends. Right now.“ | grün | „the way to get your guards to exhibit loyalty in the future was to treat them like friends right now“ (Buch); Essay 2018: „treat those people really well, right now“. | CoinDesk · Rushkoff-Archiv |
| S59 | 85 | „Invest, Rushkoff told them, ‚in people and relationships.‘“ | gelb | „Don't just invest in ammo and electric fences, invest in people and relationships.“ Inhalt bestätigt, den exakten Wortlaut nur über Buchkopien und Zusammenfassungen gesehen. | Faktenzettel F27 · [Medium/OneZero, 2018](https://onezero.medium.com/survival-of-the-richest-9ef6cddd0cc1) |
| S60 | 86 | „The best protection isn't a thicker door …“ | – | Satz des Films, nicht Rushkoffs. | – |
| S61 | 87 | „One country has built safety for everyone. In concrete.“ | – | Überleitung, gedeckt durch S62. | – |
| S62 | 88 | „Switzerland made it a rule decades ago: a protected place for every resident.“ | grün | Ziel „ein Schutzplatz pro Einwohner“ aus den 1960er-Jahren (Zivilschutzgesetz 1963), heute „nahezu erreicht“. | [BABS](https://www.babs.admin.ch/en/shelters-for-the-population) · [swissinfo](https://www.swissinfo.ch/eng/swiss-politics/truth-or-tale-is-it-true-that-there-are-enough-swiss-bunkers-to-shelter-its-population-in-case-of-a-war/91704075) |
| S63 | 89 | „Today it has more shelter places than people.“ | grün | Prüfbericht des Bundes: 2022 rund 9,3 Mio. Schutzplätze in rund 370.000 Schutzräumen für rund 8,7 Mio. Einwohner; BABS: Deckung über 100 %, lokale Lücken. Bevölkerung 2026 gut 9 Mio., der Vorsprung ist kleiner, aber da. | [Prüfbericht (PDF)](https://www.vbs.admin.ch/dam/it/sd-web/AJcq7ZAdiofw/Pruefbericht-A-2024-08-d.pdf) · [BABS](https://www.babs.admin.ch/en/shelters-for-the-population) |
| S64 | 89 | „Many are wine cellars or party rooms in the meantime.“ | gelb | swissinfo: Viele Schutzräume sind Lager oder Tiefgaragen, andere Weinkeller oder Partyräume; Titel: „with **some** being turned into wine cellars or party rooms“. „Many“ ein Wort zu stark → K3. | [swissinfo](https://www.swissinfo.ch/eng/demographics/switzerland-trying-to-keep-nuclear-shelters-up-and-running-with-some-being-turned-into-wine-cellars-or-party-rooms/91560820) |
| S65 | 90 | „In Helsinki, Finland, the shelters double as playgrounds and swimming pools.“ | grün | finland.fi: unter der Stadt Spielplätze, Turnhallen, Parkhäuser, Schwimmbäder (Itäkeskus, ~3.800 Schutzplätze), binnen 72 Stunden einsatzbereit; AFP-Bericht gleich. | [finland.fi](https://finland.fi/life-society/helsinki-underground-where-the-city-plays-swims-and-shelters/) · [The Star (AFP), 31.12.2025](https://www.thestar.com.my/lifestyle/living/2025/12/31/deep-beneath-helsinki-the-playgrounds-are-really-bomb-shelters) |
| S66 | 91 | „A bunker for a few is a hiding place …“ | – | Pointe. | – |
| S67 | 92 | „But those shelters are built against bombs. A bunker against people never has room for everyone.“ | – | Logik des Films (Zivilschutz gegen Kriegsfolgen, F42/F43). | – |
| S68 | 93 | „… can't be poured in concrete … an open argument.“ | – | Deutung. | – |
| S69 | 94 | „Tristan Harris has the shortest answer: ‚Don't build bunkers. Write laws.‘“ | gelb | In zwei inoffiziellen Transkripten 2026 als einer seiner Schritte, Schreibweise schwankt („right laws“). Aus welchem Gespräch, ist offen. | [Singju Post (Bunker-Folge)](https://singjupost.com/transcript-why-ai-ceos-are-building-bunkers-tristan-harris/) · [Singju Post (AI God)](https://singjupost.com/theyre-building-an-ai-god-they-cant-control-tristan-harris-transcript/) |
| S70 | 95 | „One has already been written. If A.I. takes your job in America, a bill in the Senate would pay up to three quarters of your wage, for half a year.“ | gelb | S. 5518, eingebracht 24.9.2026 (Sen. Mark Kelly). Titel V setzt Untergrenzen für Dauer, Lohnersatz und Höchstbetrag. Roll Call: „a minimum of 75 percent wage replacement for 26 weeks“. KJZZ: „cover 75% of lost wages for 26 weeks“. National Review: gilt, sobald ein Beirat eine „significant labor market disruption“ erklärt, dann für Arbeitslose allgemein. „up to“ untertreibt (75 % ist die Untergrenze, gedeckelt durch den Höchstbetrag), „If A.I. takes your job“ vereinfacht den Auslöser. Kernzahlen stimmen → K4. | [congress.gov](https://www.congress.gov/bill/119th-congress/senate-bill/5518) · [Gesetzestext](https://www.govinfo.gov/content/pkg/BILLS-119s5518is/xhtml/BILLS-119s5518is.html) · [Roll Call, 25.9.2026](https://rollcall.com/2026/09/25/tech-taxes-would-drive-kellys-labor-focused-ai-horizon-fund/) · [KJZZ, 25.9.2026](https://www.kjzz.org/politics/2026-09-25/sen-kelly-proposes-federal-trust-fund-to-shield-workers-from-large-scale-ai-related-job-losses) · [National Review, Okt. 2026](https://www.nationalreview.com/2026/10/who-pays-and-gains-from-senator-kellys-ai-fund/) |
| S71 | 96 | „Microsoft has promised its new data centers will pay their own way, so the neighbors don't.“ | grün | „Community-First AI Infrastructure“ (13.1.2026): Tarife so, dass Strom und Netzausbau für die eigenen Rechenzentren gedeckt sind und Haushalte nicht draufzahlen; keine Steuernachlässe; mehr Wasser zurück. | [Microsoft](https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/) · [Latitude Media](https://www.latitudemedia.com/news/microsoft-to-pay-its-own-way-for-power-hungry-data-centers/) |
| S72 | 97 | „Neither is done. The bill hasn't passed. The promise isn't a law.“ | grün | Stand 25.11.2026: an den Finanzausschuss überwiesen, keine Mitunterzeichner, keine weitere Handlung; GovTrack schätzt 0 % Chance auf Verabschiedung. Microsoft: freiwillige Zusage. | [congress.gov](https://www.congress.gov/bill/119th-congress/senate-bill/5518) · [GovTrack](https://www.govtrack.us/congress/bills/119/s5518) |
| S73 | 98–99 | „That world isn't built yet …“ | – | Deutung. | – |
| S74 | 101–104 | Schluss | – | Deutung. | – |
| S75 | 105–106 | Kernsatz „eight billion people“ | – | Kernsatz; die Zahl stimmt (UN: 8 Mrd. am 15.11.2022, 2024 rund 8,2 Mrd.). | [UN WPP 2024](https://population.un.org/wpp/) |
| S76 | 108 | Abo-Aufruf 2 | – | Mission. | – |

### 3b · Einblendungen und Zitatkarten (text-v2.md)

| # | Stelle | Einblendung | Ampel | Befund | Quelle |
|---|---|---|---|---|---|
| B01 | Z. 130, 156 | WHAT ARE THEY HIDING FROM? · Karte der Uhr | – | Frage, Grafik | – |
| B02 | Z. 137 | Zitatkarte Sutskever · co-founder and then chief scientist, OpenAI · summer 2023 · as recalled by researchers present, reported by Karen Hao, Empire of AI (2025) | gelb | Wortlaut, Rolle, Zeit stimmen. „researchers present“: Hauptquelle ist ein anwesender Forscher; ob die zwei Bestätiger im Raum waren, schreiben die Berichte verschieden (Futurism: ja, andere: offen) → KB7 | Fortune · Futurism |
| B03 | Z. 163 | KOOLAU RANCH · KAUAI, HAWAII | grün | mehrere Berichte, Wired | Fortune · HuffPost UK |
| B04 | Z. 167 | UNDERGROUND SHELTER, ABOUT 4,500–5,000 SQ FT · Wired, Dec 2023 · county planning documents, via Hawaii News Now, Dec 2024 | gelb | Spanne deckt beide Angaben, Primärquellen nicht gesehen | Business Insider · Faktenzettel F4 |
| B05 | Z. 171 | Zitatkarte Zuckerberg: “… just like a little shelter. It's like a basement.” · “hurricane shelter or whatever” · Bloomberg, The Circuit, 19 Dec 2024 · county building records: “storm shelter” | gelb | beide Zitate in mehreren Berichten wörtlich; „storm shelter“ aus den Bauunterlagen nur über den Faktenzettel | Fortune · HuffPost UK |
| B06 | Z. 180–182 | C1: SAM ALTMAN · CEO, OpenAI · 2025 · ORIGINAL FOOTAGE (#599, 23.7.2025) | grün | Folge und Datum bestätigt | Fortune · YouTube |
| B07 | Z. 186 | “… not because of AI but because people are dropping bombs in the world again.” · Sam Altman, 2025 | gelb | Berichte: „not because of AI, but just because …“ → KB1 | Fortune · Zvi |
| B08 | Z. 190 | Newsweek, 4 Oct 2026 · Washington Post, 9 Oct 2026 | gelb | beide Texte existieren; Newsweek KI-gestützt | Newsweek · WaPo |
| B09 | Z. 197 | “… AND EVEN ARTIFICIAL INTELLIGENCE” · Washington Post, 9 Oct 2026 · Atlas founder: A.I. can now be “added to the list” · Newsweek, 4 Oct 2026 | gelb | Hubbard-Aussage in Newsweek bestätigt (Wortlaut „added to the list“ nur Faktenzettel); WaPo-Zitat nicht selbst gesehen | Newsweek |
| B10 | Z. 207 | INTERNATIONAL AI SAFETY REPORT 2026 · chair: Yoshua Bengio · 100+ experts, 30+ countries · Feb 2026 | grün | wie S22 | Bericht · industry.gov.au |
| B11 | Z. 214 | THOUGHT EXPERIMENT | – | Kennzeichnung | – |
| B12 | Z. 227 | “None of this is gonna help if AGI goes wrong.” · SAM ALTMAN · CEO, OpenAI · WSJ Tech Live, Oct 2023 | gelb | wie S24 | Business Insider |
| B13 | Z. 234 | “Of course, it's going to be optional …” · ILYA SUTSKEVER · 2023 · Karen Hao | grün | wie S25 | Fortune · Futurism |
| B14 | Z. 241 | “… AI technology is amazing, but it's nowhere near human intelligence.” · DAME WENDY HALL · University of Southampton · BBC, Oct 2025 | gelb | wie S27; Universität Southampton bestätigt ihre Rolle (Sept. 2026) | AOL · Futurism · [Southampton](https://www.southampton.ac.uk/news/2026/09/dame-wendy-hall-talks-super-intelligent-ai-and-brainreading-tech.page) |
| B15 | Z. 261 | C2: TRISTAN HARRIS · Co-founder, Center for Humane Technology · 2026 · ORIGINAL FOOTAGE | grün | Rolle bestätigt | Wikipedia · Time |
| B16 | Z. 268 | MAKERS' OWN CLAIMS · Atlas: 30 days minimum · Vivos: 1 year minimum · Survival Condo, Kansas: up to 5 years · Oppidum: “up to 10 years” (developer, 2015) | gelb | Atlas und Vivos bestätigt, Survival Condo nicht → KB6 | Atlas · Fast Company |
| B17 | Z. 278 | Axios, 9 Oct 2026 | grün | wie S34 | Axios |
| B18 | Z. 285 | 13 NOV 2026 · FAA GROUND STOP, ABOUT 4.5 HOURS · cause: a faulty router (FAA) | gelb | Datum und Ursache grün; Dauer je Bericht über 4 bis über 5 Stunden → KB2 | Axios · ABC7 |
| B19 | Z. 289 | FAA: no cyberattack · ground stop lifted after about 4.5 hours | gelb | wie B18 → KB2 | GovInfoSecurity |
| B20 | Z. 296 | optional: without a way out, “you built a tomb.” · Brian Camden, engineer, Hardened Structures | gelb | Satz über Moneywise bestätigt („Without one,“ he says, „you built a tomb.“); WaPo-Original gesperrt | Moneywise |
| B21 | Z. 306 | 2017 | grün | wie S38 | Rushkoff-Archiv |
| B22 | Z. 314 | C3: DOUGLAS RUSHKOFF · Media theorist, author of “Survival of the Richest” · 2022 | grün | Buch W. W. Norton 2022 | [rushkoff.com](https://rushkoff.com/books/survival-of-the-richest.html) |
| B23 | Z. 318 | “THE EVENT”: environmental collapse, social unrest, nuclear explosion, virus, or hack | grün | wie S41 (im Essay „unstoppable virus, or Mr. Robot hack“) | Rushkoff-Archiv |
| B24 | Z. 328 | “special combination locks on the food supply” · “disciplinary collars” · “robots to serve as guards and workers” | grün | wie S44 | Rushkoff-Archiv · CoinDesk |
| B25 | Z. 335 | FIVE MEN FROM TECH INVESTING AND HEDGE FUNDS · never named · Rushkoff's own account | grün | wie S39, S46 | Rushkoff-Archiv |
| B26 | Z. 342 | “ANTI-MUTINY” PROCEDURES · Hardened Structures projects · Washington Post, 9 Oct 2026 | gelb | wie S48 | Moneywise · Yahoo Finance |
| B27 | Z. 346 | “DETENTION AREAS” · bunker designs by SAFE · Washington Post, 9 Oct 2026 | gelb | wie S49 | Moneywise |
| B28 | Z. 350 | AXIOS, 9 OCT 2026 · “DAY AFTER” SCENARIOS AT LEADING A.I. COMPANIES | grün | wie S50 | Axios |
| B29 | Z. 357 | OPPOSE NEARBY: A.I. DATA CENTER 71% · NUCLEAR PLANT 53% · Gallup, March 2026 | grün | Zahlen stimmen; März = Befragung, veröffentlicht 13.5.2026 → KB5 | Gallup (PDF) |
| B30 | Z. 361 | SPAS · ROCK WALLS · GO-KART TRACKS · Washington Post, 9 Oct 2026 | grün | WaPo-Titel „Spas, rock walls and other must-have amenities for your doomsday bunker“ (Suchauszug washingtonpost.com), Go-Kart-Bahnen über Moneywise | WaPo · Moneywise |
| B31 | Z. 368 | “preparedness exercises” | grün | OpenAI laut Axios; Firmenname offen (§1.10) | Axios · CXOToday |
| B32 | Z. 378, 388 | 4 US · WHAT WOULD MAKE THE BUNKER UNNECESSARY? | – | Auflösung, Frage | – |
| B33 | Z. 404 | Zitatkarte Rushkoff: “Don't just invest in ammo and electric fences, invest in people and relationships.” · Survival of the Richest, 2018 | gelb | wie S59 | Medium · Faktenzettel |
| B34 | Z. 414 | SWITZERLAND · PRINCIPLE SINCE 1963: A PROTECTED PLACE FOR EVERY RESIDENT | grün | wie S62 | BABS |
| B35 | Z. 418 | ABOUT 9 MILLION PLACES IN ABOUT 370,000 SHELTERS · MORE THAN 100% COVERAGE · Federal Office for Civil Protection | grün | wie S63 (2022: 9,3 Mio.) | BABS · Prüfbericht |
| B36 | Z. 422 | HELSINKI, FINLAND · SHELTERS IN EVERYDAY USE: PLAYGROUNDS, SWIMMING POOLS, SPORTS HALLS · finland.fi | grün | finland.fi nennt „playgrounds, gyms, car parks and swimming pools“ → KB8 (nur Wortwahl) | finland.fi |
| B37 | Z. 435 | “Don't build bunkers. Write laws.” · TRISTAN HARRIS · Center for Humane Technology · 2026 | gelb | wie S69 | Singju Post |
| B38 | Z. 439 | S. 5518 · MAKE AI WORK FOR AMERICANS ACT · introduced 24 Sept 2026 · up to 75% of lost wages for 26 weeks | gelb | Nummer, Titel, Datum grün; „up to“ steht gegen „minimum of 75 percent“ → KB3 | congress.gov · Roll Call |
| B39 | Z. 443 | MICROSOFT, JAN 2026: own power costs, full local taxes, more water returned than used · OPENAI FOUNDATION, MAY 2026: $250 MILLION for workers and communities | grün | Microsoft wie S71; OpenAI Foundation 27.5.2026, erste 250 Mio. $ für Beschäftigte und Regionen (Reuters) | Microsoft · [Yahoo/Reuters](https://finance.yahoo.com/economy/policy/articles/openai-foundation-commits-250-million-150221757.html) · [PYMNTS](https://www.pymnts.com/artificial-intelligence-2/2026/openai-pledges-250-million-to-help-ai-disrupted-workers/) |
| B40 | Z. 447 | S. 5518: NOT PASSED · open: how to prove the cause, how to pay for it (EPI) | gelb | „NOT PASSED“ grün. Die EPI-Kritik zu genau diesem Entwurf ist nicht gesehen; der Auslöser ist laut National Review eine erklärte Störung, kein Einzelnachweis → KB4 | congress.gov · National Review |
| B41 | Z. 472 | MORE THAN 8 BILLION PEOPLE · UN, 2024 | grün | UN WPP 2024 | UN |
| B42 | – | (Labels SCENARIO, TAG-Stempel) | – | Kennzeichnung | – |

Zählung Bild: 38 geprüft (B02–B10, B12–B31, B33–B41), davon 20 grün, 18 gelb; 4 Stellen – (B01, B11, B32, B42).

---

## 4 · Kann-Änderungen (nicht eingearbeitet)

### Sprechtext

| # | jetzt | Vorschlag | Warum |
|---|---|---|---|
| K1 | Z. 22: „‚but because people are dropping bombs in the world again.‘“ | „‚but **just** because people are dropping bombs in the world again.‘“ (+1) | So zitieren ihn die Berichte (S17). Erst am Clip prüfen: Steht der Satz im Clip, ändert sich Z. 22 ohnehin (Abschnitt 5). |
| K2 | Z. 51: „one faulty router stopped every takeoff in America.“ | „one faulty router stopped takeoffs all across America.“ (±0) | Ankünfte und Medizinflüge liefen weiter (S35). Die jetzige Fassung ist als Zuspitzung haltbar. |
| K3 | Z. 89: „**Many** are wine cellars or party rooms in the meantime.“ | „**Some** are wine cellars or party rooms in the meantime.“ (±0) | swissinfo: „some being turned into wine cellars or party rooms“; „many“ gilt dort für Lager und Tiefgaragen (S64). |
| K4 | Z. 95: „a bill in the Senate would pay **up to** three quarters of your wage, for half a year.“ | „a bill in the Senate would pay three quarters of your wage, for half a year.“ (−2) | 75 % sind im Entwurf die Untergrenze (Roll Call), gedeckelt nur durch den Höchstbetrag (S70). Länge danach 1.360 Wörter. Nimmt Jakob K4, KB3 mitziehen. |
| K5 | Z. 25: „This year, **bunker makers began** adding a reason to their list.“ | **nur falls das WaPo-Zitat „and even artificial intelligence“ am Original nicht hält:** „This year, **one big bunker maker began** adding a reason to his list.“ (+2) | Sicher belegt ist nur Hubbard (Atlas) in Newsweek, und Newsweek ist KI-gestützt (S20). |

### Bild (KB, für die Bauer)

| # | Stelle | jetzt | Vorschlag | Warum |
|---|---|---|---|---|
| KB1 | Z. 186 | “… not because of AI but because people are dropping bombs in the world again.” | “… not because of AI, but just because people are dropping bombs in the world again.” | Wortlaut der Berichte (S17). Am Clip C1 gegenhören; der Ton gilt. |
| KB2 | Z. 285, Z. 289 | … ABOUT 4.5 HOURS · … lifted after about 4.5 hours | … **MORE THAN 4 HOURS** · … lifted after **more than four hours** | Berichte nennen „more than four“ bis „more than five hours“; „more than four“ stimmt in allen (S35). |
| KB3 | Z. 439 (8:50) | … up to 75% of lost wages for 26 weeks | … **at least 75% of lost wages for 26 weeks, once a labor-market disruption is declared** | Roll Call: „a minimum of 75 percent wage replacement“; National Review: Auslöser ist die Erklärung des Beirats (S70). Passt zu K4; ohne K4 reicht „75% of lost wages for 26 weeks“. |
| KB4 | Z. 447 (9:11) | S. 5518: NOT PASSED · open: how to prove the cause, how to pay for it (EPI) | S. 5518: NOT PASSED · **in the Senate Finance Committee, no co-sponsors (Nov 2026)** | Die EPI-Kritik ist für diesen Entwurf nicht belegt, und einen Einzelnachweis der Ursache verlangt er laut National Review nicht. Der Status ist belegt (congress.gov). |
| KB5 | Z. 357 | … Gallup, March 2026 | … Gallup, **survey March 2026** | Befragt im März, veröffentlicht am 13.5.2026. Die jetzige Zeile ist nicht falsch. |
| KB6 | Z. 268 | Survival Condo, Kansas: up to 5 years | Survival Condo, Kansas: up to 5 years **(developer)** | Die Zahl ist eine Entwicklerangabe und in dieser Prüfung nicht bestätigt; die Zeilen darüber stehen schon unter „MAKERS' OWN CLAIMS“, die Klammer macht es für diese Zeile eindeutig. |
| KB7 | Z. 137 | … as recalled by researchers present … | … as recalled by **a researcher present** … | Hauptquelle ist ein Anwesender; ob die zwei Bestätiger im Raum waren, ist uneinheitlich berichtet (B02). |
| KB8 | Z. 422 (8:16) | … PLAYGROUNDS, SWIMMING POOLS, SPORTS HALLS … | … PLAYGROUNDS, SWIMMING POOLS, **GYMS** … | Wortwahl von finland.fi. |

---

## 5 · Clips: Einleitung und Folgesatz gegen den Wortlaut

`clips-geprueft.json` lag bis zum Abschluss (25.11.2026) nicht vor. Kein Clip-Wortlaut ist am Video geprüft. Was am iMac zu klären ist, bevor die Hörfassung steht:

| Clip | Einleitung (vo-v3) | Wortlaut laut Berichten | Folgesatz (vo-v3) | Was am Wortlaut hängt |
|---|---|---|---|---|
| C1 · Altman · Theo Von #599 · aYn8VKW6vXA · ~1:25:40 | Z. 20 „Last year, the comedian Theo Von asked the head of OpenAI whether he has one. Here's Sam Altman:“ | „I have, like, underground concrete, heavy reinforcement basements, but I don't have something I would call a bunker.“ · Von: „Sam, that's a bunker.“ (Wortlaut je Bericht leicht anders) | Z. 22 „And his reason? ‚Not because of A.I.,‘ he said, ‚but because people are dropping bombs in the world again.‘“ | **(1)** Fragt Von wirklich, ob Altman einen Bunker hat? Die Berichte zeigen nur, dass Von widerspricht. Wenn nicht: Einleitung anpassen, etwa „Last year, the comedian Theo Von talked bunkers with the head of OpenAI. Here's Sam Altman:“ (−1). **(2)** Folgt der Bomben-Satz direkt im Ton und bleibt der Clip ≤ 15 s: in den Clip, VO nur „Bombs. Not A.I.“ (text-v2). **(3)** Bleibt er im VO: Wortlaut mit „just“ (K1, KB1). **(4)** Z. 73 „storms and bombs“ hängt daran. |
| C2 · Harris · Modern Wisdom #1079 · NufB1LL_rCU · Stelle offen | Z. 43 „Tristan Harris used to work at Google. Today he's one of the industry's sharpest critics. This spring he said:“ | „… right now the AI company leaders are building bunkers.“ (nur Singju-Transkript) | Z. 45 „Right now. He names no names. But if he's right, a bunker must be good for something.“ | **(1)** „Right now.“ setzt voraus, dass „right now“ im Clip fällt; sonst beginnt Z. 45 mit „He names no names.“ (−2). **(2)** „He names no names“: prüfen, dass im Umfeld des Clips kein Name fällt. **(3)** „This spring“: Upload 2.4.2026; das Aufnahmedatum prüfen. **(4)** Z. 94 „Write laws“: aus diesem Gespräch? Dann als C2b möglich (C2 + C2b ≤ 20 s). |
| C3 · Rushkoff · The Great Simplification #36 · q7grRir4KPQ · Kapitel 01:52–04:48 | Z. 57–58 „Some years ago … five very rich investors walked in. Here's what they really wanted to know, as he tells it:“ | Essay und Buch: „How do I maintain authority over my security force after the Event?“ (im Video freie Erzählung, Wortlaut offen) | Z. 60 „‚The Event.‘ Their word for the day everything breaks down.“ | **(1)** Fällt „the Event“ im Clip? Sonst Z. 60: „They called it ‚the Event‘: the day everything breaks down.“ **(2)** Trägt der Clip die Frage klar, kann Z. 62 weg (−10). **(3)** Nennt der Clip schon eine Idee (Halsbänder, Roboter), diese in Z. 63 streichen. **(4)** Sagt Rushkoff dort selbst „five“ und „investors“/„hedge fund“? Sonst passt die Einleitung trotzdem (Essay). **(5)** Rushkoffs Antwort (Z. 84–85) als zweiter Clip aus demselben Video, nur wenn zusammen ≤ 20 s. |

Clip-Anteil laut text-v2: geschätzt 32 s ≈ 5,3 % von 10:07, nicht gemessen.

---

## 6 · Personen (§2.5f, §1.9a)

- **Ilya Sutskever:** nur zwei Sätze, mit „at the time“ (Chefwissenschaftler bis Mai 2024). Personen-Check laut Faktenzettel grün; nichts Neues gefunden.
- **Mark Zuckerberg, Sam Altman:** Personen-Check gelb (Faktenzettel), Jakob informieren. Beide mit eigenem Grund im Ton (Stürme, Bomben), beide als Besitzer mit Eigeninteresse gerahmt. Altman kommt dreimal vor (Clip, Bomben-Satz, Karte nur mit Amt), das ist die Obergrenze aus text-v2.
- **Tristan Harris:** aktiver Kritiker der Labore; als Mahner eingeordnet (Z. 43). Keine Namen unterstellt (Z. 45).
- **Douglas Rushkoff:** seine Schilderung, hörbar zugeschrieben („as he tells it“, „his account“). Hinweis aus dem Faktenzettel (Name in Epstein-Mails über den früheren Agenten, offen erklärt) bleibt.
- **Ron Hubbard (Atlas):** nur im Bild als „Atlas founder“, Glaubwürdigkeit gelb (Faktenzettel 0.16); Newsweek-Text KI-gestützt.
- **Brian Camden (Hardened Structures), SAFE:** Firmen mit Verkaufsinteresse; „anti-mutiny“ und „detention areas“ sind ihre eigenen Angaben gegenüber der WaPo.
- **Wendy Hall:** nur im Bild; Universität Southampton bestätigt ihre Rolle (Sept. 2026). Kein Skandal in dieser Suche.
- **Mark Kelly:** im Film ohne Namen und Partei („a bill in the Senate“), richtig so.
- **Thiel, Hoffman, Jensen Huang:** kommen nicht vor.

---

## 7 · Relative Zeitwörter (Release 7.12.2026)

| Wort | Z. | bezieht sich auf | Datum | Urteil |
|---|---|---|---|---|
| „at the time“ | 7 | Sutskever als Chefwissenschaftler | Sommer 2023 (Amt bis Mai 2024) | stimmt, zeitfest |
| „Last year“ | 20 | Theo-Von-Folge | 23.7.2025 | stimmt bis 31.12.2026; danach „In twenty twenty-five“ |
| „This year“ | 25 | KI auf der Liste der Hersteller | Okt. 2026 | stimmt bis 31.12.2026; danach „Last year“ |
| „already“, „today's A.I.“ | 28–29 | AI Safety Report | 3.2.2026 | stimmt |
| „This spring“ | 43 | Harris bei Modern Wisdom | 2.4.2026 | stimmt bis 31.12.2026; danach „Last spring“ |
| „Today he's“ | 43 | Harris als Kritiker | Nov. 2026 | stimmt |
| „right now“ | 44–45 | Harris' eigenes Wort | April 2026 | als Zitat zeitfest |
| „In November“ | 51 | Router, FAA | 13.11.2026 | stimmt: Am 7.12. ist „In November“ der Vormonat und eindeutig. Ab 1.1.2027 „Last November“, ab Nov. 2027 „In November 2026“. Es ist wirklich November **2026** (Axios 16.11.2026, Fortune 14.11.2026). |
| „Some years ago“ | 57 | Rushkoff | 2017 | zeitfest |
| „today“ | 66 | Bunkerprojekte | WaPo 9.10.2026 | stimmt |
| „This fall“ | 69 | Axios | 9.10.2026 | stimmt: Der Herbst läuft astronomisch bis 21.12.; auch meteorologisch (bis 30.11.) ist „this fall“ am 7.12. für den gerade vergangenen Herbst üblich. Ab 2027 „Last fall“. |
| „Already“ | 71 | Gallup | März/Mai 2026 | stimmt |
| „Right now“ | 84 | Rushkoffs Rat | 2017 | als Zitat zeitfest |
| „decades ago“ | 88 | Schweizer Grundsatz | 1963 | zeitfest |
| „Today“, „in the meantime“ | 89 | Schutzplätze, Weinkeller | Zahlen 2022, BABS 2025/26 | stimmt |
| „already been written“ | 95 | S. 5518 | 24.9.2026 | stimmt |
| „would pay“, „The bill hasn't passed“ | 95, 97 | S. 5518 | Stand 25.11.2026: im Finanzausschuss | **am 7.12. vor 17:00 auf congress.gov prüfen.** Der 119. Kongress endet am 3.1.2027; danach verfällt der Entwurf, und „a bill in the Senate would pay“ stimmt dann nicht mehr (für Shorts und Neu-Uploads). |
| „new data centers“ | 96 | Microsoft | 13.1.2026 | stimmt |
| „yet“ | 98 | – | – | stimmt |

Alle „this …“-Wörter und „Last year“ hängen am Jahr 2026. Wird der Film nach dem 31.12.2026 neu hochgeladen oder als Short zerschnitten, diese Stellen tauschen (Liste in text-v2, Hinweise).

---

## 8 · Offene Punkte und was Jakob entscheidet

1. **Clips am iMac** (Abschnitt 5): C1 (fragt Von? Bomben-Satz im Clip? „just“), C2 („right now“ im Clip, Aufnahmedatum, „Write laws“ aus derselben Folge?), C3 („the Event“ im Clip, Ideen doppelt?). Danach Einleitungen und Folgesätze nachziehen.
2. **WaPo 9.10.2026 am Original lesen**, wenn `washingtonpost.com` freigegeben wird: „anti-mutiny“, „detention areas“, „and even artificial intelligence“ (K5), Camdens „tomb“. Kein Widerspruch gefunden; es fehlt nur der Blick ins Original.
3. **K1–K5 und KB1–KB8:** Jakobs Wahl. Empfohlen vor dem Bau: KB1, KB2, KB3/KB4 (Zahlen und Zitate im Bild).
4. **S. 5518 am Release-Tag** auf congress.gov prüfen („The bill hasn't passed“).
5. **Harris „Write laws“:** Gespräch und Wortlaut am Ton; bis dahin Zitatkarte mit Vorbehalt oder die Umschreibung aus text-v2.
6. **Personen-Check gelb** (Zuckerberg, Altman) an Jakob.
7. **Netzwerk:** Für direktes Lesen `washingtonpost.com`, `moneywise.com`, `finance.yahoo.com`, `newsweek.com`, `rollcall.com`, `govinfo.gov`, `theatlantic.com` in den Netzwerk-Einstellungen der Sitzung freigeben. Für den Upload nicht nötig.
8. **`regel_check.py` auf vo-v3.txt:** 1.362 Wörter (≈ 9,4 Min), 12 Hinweise wie bei vo-v2, alle Fehlalarme („A.I.“ als Ich-Satz).
