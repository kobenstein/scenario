# Faktencheck · Film #55 „The Best AI Is Locked Away“ · 17.11.2026

Geprüft: `vo-v2.txt` (Stand 17.11. 16:45, mit dem Astra-Fix in Z. 14) Zeile für Zeile, dazu jede Einblendung, Quellenzeile und Clip-Bauchbinde in `text-v2.md`. Abgeglichen mit `faktenzettel.md` (inkl. G), `clips.json`, `kritik-v1.md`, `abgrenzung-31.md`, `schreibraum/REGELN.md`. Release: Do 19.11.2026.

**Ergebnis:** 138 Prüfpunkte (89 im Sprechtext, 49 Einblendungen und Bildangaben). **11 Must-changes:** 7 im Sprechtext (Z. 14, 16, 20, 43, 54, 55, 62), 4 nur in Einblendungen (1:00, 1:32, 1:37, 5:13). Umgesetzt in `vo-v3.txt` (1.445 Wörter, `regel_check.py` mit „AI“ statt „A.I.“: 0 Hinweise, „subscribe“ 2×, 3 Clips, 1 Zitatkarte, Endbild unverändert).

**Quellenlage:**
- **[P]** = Primärseite heute (17.11.) selbst gelesen. Das sind alle Anthropic-Seiten (Liste unten).
- **[S]** = nur über Suchauszüge oder Sekundärquellen.
  - Blockiert: openai.com, cnbc.com.
  - Nicht erreichbar (DNS, müssten in den Netzwerk-Einstellungen der Sitzung freigegeben werden): pressroom.versantmedia.com (CNBC-Presseseite mit dem Friar-Transkript), cybernews.com und www.nist.gov (CAISI-Bericht zu GLM-5.3).
  - Das GitHub-Repo `openai/math` ist für diese Sitzung nicht freigegeben.
- **Ton:** Keine Tonspur geprüft (kein Whisper). Alle Clip-Wortlaute sind sekundär.

---

## 1 · Must-change

| # | Stelle | Problem | Quelle | Ersatz (EN) |
|---|---|---|---|---|
| 1 | **Z. 14** | **Zwei Fehler.** „newest“ ist falsch: Nach GPT-6 Astra (3./4.9.) kamen GPT-6.1 Sol (29.9.) und GPT-6.1 Terra (26.10.). Astra ist das stärkste öffentliche Modell, nicht das neueste. „anyone can use it“ ist zu stark: Astra ist nicht kostenlos. Free und Go bekommen GPT-6 Luna. Plus nutzt Astra in Work und Codex, Pro, Business und Enterprise im Chat (dort „GPT-6 Pro“), dazu die API. **Zu Jakobs Frage:** Astra ist öffentlich freigegeben, aber nur gegen Bezahlung. Beide haben also halb recht. | [S] Engadget, „How to use GPT-6 Astra when it rolls out to you“ (Sept. 2026); Notebookcheck, GPT-6 Luna für Free/Go (Okt. 2026); The New Stack, GPT-6.1 Sol (29.9.2026); BleepingComputer, GPT-6.1 Terra (26.10.2026); BenchLM/Artificial Analysis: Astra knapp vor 6.1 Sol | `A second lab, OpenAI, goes further. Its strongest public A.I. is called Astra, and anyone can pay to use it. On stage, its chief executive, Sam Altman, described the one after it:` |
| 2 | **Z. 16** | **Zwei Fehler.** „Nobody can yet“ ist zu stark. Außenstehende prüfen die veröffentlichten Ergebnisse, aber nur zum Teil: Navier-Stokes-Streit, drei zurückgezogene Manuskripte, ein Retraction-Watch-Eintrag. „OpenAI itself says outside mathematicians cannot yet reproduce …“ ist als OpenAI-Wortlaut nicht belegbar; der Satz stammt aus einer Dealroom-Zusammenfassung. Belegt ist: Das Modell ist unveröffentlicht, und OpenAI ist „working to responsibly release“ es. | [S] Dealroom (Okt. 2026); Scientific American, „OpenAI unleashes hundreds more math results…“ (Okt. 2026; MIT-Mathematiker Sutherland: bis zur Freigabe „unverified“) | `[thoughtful] So ask what an inspector would ask. Who checked it from outside? Some mathematicians, in part. The machine itself stays locked.` |
| 3 | **Z. 20** = Karte 2:06 | Der zweite Satz „We have not yet released it.“ steht in keinem Auszug wörtlich, er ist nur sinngemäß belegt. Der erste Satz steht in mehreren CNBC-Auszügen wörtlich. | [S] CNBC-Transkript, 6.11.2026 (nur Suchauszüge) | `"We are still holding that model."` Vor dem Kartenbau am Original prüfen. |
| 4 | **Z. 43** | „Only“ ist zu stark und „an older one“ ungenau. Fable 5.2 leitet auch einen kleinen Teil der KI-Forschungsthemen (Kernel-Arbeit) an Opus 5 weiter („transparent fallbacks to Opus 5 for a small set of topics“). Cyber geht an Opus 4.8, Biologie an Opus 5, also an zwei Modelle. | [P] anthropic.com/claude-fable-and-mythos-5-2 (9.11.2026), Abschnitte „AI research and development“ und „Safeguards“ | `Mainly high-risk hacking requests, and most research biology, get passed to older ones.` |
| 5 | **Z. 54** | „its next machine … called the launch off“ führt in die Irre. OpenAI hat danach durchaus Neues veröffentlicht: GPT-6.1 Sol am 29.9., GPT-6.1 Terra am 26.10. Abgesagt wurde das Update von Astra (GPT-6.1 Astra). „the one before“ = GPT-6 Astra bleibt dann richtig. Die neue Formulierung grenzt sich zugleich besser von Altmans „the one after it“ (dem Mathe-Modell, Falle 2) ab. | [S] CNBC 28.9.2026; Engadget (GPT-6.1 Astra); The New Stack 29.9.; BleepingComputer 26.10. | `This fall, OpenAI planned to release an update to Astra. Then it called the launch off.` |
| 6 | **Z. 55** | „no rule“ ist zu absolut. Kaliforniens SB 53 gilt seit 1.1.2026. Es verlangt öffentliche Transparenzberichte vor dem Einsatz neuer Modelle, mit einer Zusammenfassung der Risikoprüfung. Kritische Vorfälle, auch aus interner Nutzung, gehen vertraulich an Cal OES; öffentlich gibt es ab 2027 nur anonymisierte Jahreszusammenfassungen. Alles offenlegen muss also niemand. | [S] Future of Privacy Forum, „California's SB 53 … explained“; Kilpatrick Townsend (Okt. 2025) | `And no rule forces a lab to tell you everything it sees in there.` |
| 7 | **Z. 62** | „notes“ verharmlost den Vorsprung. Laut Fußnote 4 bekam der Lauf 60 Aussagen, eine Ein-Satz-Skizze und **47 bewiesene Lemmata** aus dem ersten Beweis. Anthropic hat die Fußnote am 11.11. nachgetragen, „to more accurately describe the information we provided“. | [P] anthropic.com/claude-fable-and-mythos-5-2 (9.11., Edit 11.11.) | `A thousand copies, starting from parts of the first proof.` |
| 8 | Einblendung **1:00** | wie 7 | wie 7 | `Anthropic, Sep 4 / Nov 9, 2026 · one run each · the second started with 47 lemmas from the first proof` |
| 9 | Bauchbinde **1:32** | Das Datum ist falsch. Benioff und Altman sprachen am Dienstag, **15.9.2026** (erster Dreamforce-Tag); der 16.9. ist das Upload-Datum. | [S] SiliconANGLE, 15.9.2026; TechFinitive (Dreamforce 2026) | `ORIGINAL FOOTAGE · Sam Altman, CEO, OpenAI · Dreamforce, Sep 15, 2026` |
| 10 | Einblendung **1:37** | Das Zitat „outside mathematicians cannot yet reproduce“ · OpenAI ist kein belegter OpenAI-Wortlaut (siehe 2). | wie 2 | `MODEL STILL UNRELEASED · OpenAI, Oct 6, 2026` |
| 11 | Einblendung **5:13** | „no outside review yet“ ist nicht belegbar. Laut den Herkunftsangaben der Preprints hat ein (ungenannter) Physiker die Ergebnisse geprüft. Belegt ist nur: Preprints auf Hexagon vom 7.11., ohne Begutachtung. | [S] Cryptobriefing, TechTimes (Nov. 2026); [P] 5.2-Seite verlinkt hexagonmath.org 2611.00174/00175 | `Anthropic, Nov 9, 2026 · preprints, not peer-reviewed · the lab's own account` |

**Empfohlen, nicht zwingend:**
- **1:22 Bild:** Der Astra-Kern ist „frei zugänglich“ gedacht. Nach Fix 1 lieber mit Kasse oder Preisschild zeigen, sonst widerspricht das Bild dem Satz.
- **3:06:** „5× Opus 4.6 (launch price, Apr 7, 2026)“. Dann ist klar, 5× wovon: 25/125 $ gegen 5/25 $.
- **4:01:** „VERIFIED“ statt „CONFIRMED“ (Quellwort).
- **2:54:** „· EO 14409“ anhängen. Genau heißt es: bis zu 30 Tage vor der Freigabe an andere Partner.
- **6:36:** Paket-Aufschrift „ASTRA 6.1“ statt „NEXT“, passend zum neuen Z. 54.

---

## 2 · Am Release-Tag prüfen (Mi 18.11. abends / Do 19.11. vor Veröffentlichung)

1. **Z. 14, 54, 65 · OpenAI:** Ist ein neues Spitzenmodell erschienen?
   - Lage: The Information meldete am 4.11. einen möglichen Start „as early as Nov 6“. Bis 16.11. ist kein Start bestätigt, auch kein GPT-6.2 (nur Gerüchte zu Modell-IDs). Polymarket sah am 1.11. 65 % für einen Start bis 30.11.
   - Heißt das neue Spitzenmodell nicht „Astra“, fällt Z. 14.
   - Wird das Mathe-Modell freigegeben, fallen Z. 18, 20 und 65 („still holding“).
2. **Z. 17 · Anthropic-Börsengang:**
   - Roadshow seit 10.11. [P]. Preisfestsetzung erwartet am 18.11. abends; erster Handelstag an der Nasdaq (ANT) voraussichtlich **Do 19.11., also am Release-Tag** [S] CNBC 10.11. und 16.11.
   - Der Satz bleibt richtig, kein Änderungsbedarf. Am Release-Tag ist das Interesse aber hochaktuell; die Offenlegung in der Beschreibung (Falle 9) entsprechend prüfen.
3. **Z. 44 „the newest version“:** Nur falls Anthropic vor dem 19.11. ein neueres Fable veröffentlicht.
4. **Karte 2:06:** Friar-Wortlaut am CNBC-Original prüfen (cnbc.com oder pressroom.versantmedia.com freigeben).
5. **Clips A1, C1, C4:** Wortlaut per Whisper (Abschnitt 5).

---

## 3 · Neu seit 16.11. (und was es ändert)

| Datum | Neu | Folge für den Film |
|---|---|---|
| 17.11. (Prüfung) | GPT-6 Astra ist nur gegen Bezahlung nutzbar; Free/Go nutzen seit 8.10. GPT-6 Luna. Neuere OpenAI-Modelle: GPT-6.1 Sol (29.9.), GPT-6.1 Terra (26.10.). | Z. 14 und Z. 54 geändert (Must-change 1 und 5) |
| 11.11. | Anthropic ergänzt beim 30-Stunden-Lauf die Fußnote: 60 Aussagen, Skizze, 47 bewiesene Lemmata aus dem ersten Beweis [P] | Z. 62 und Einblendung 1:00 geändert |
| 10.11. | Roadshow für den Börsengang [P]; Handelsstart voraussichtlich 19.11. [S] | Z. 17 bleibt; siehe Abschnitt 2 |
| 7.11. | Die zwei Physik-Preprints liegen auf Hexagon, ohne Begutachtung; bisher keine Stimme von außen [S] | Einblendung 5:13 geändert; Z. 44 bleibt Eigenangabe |
| 5.11. | OpenAI stellt GPT-6 Cyber vor, nur für zugelassene Sicherheitskunden [S] TechCrunch, Fortune | Kein Änderungsbedarf. Stützt die These (gestaffelter Zugang, auch bei OpenAI); optionaler Halbsatz für Platz 4 |
| 9.11. | Systemkarte zu Mythos 5.2: „stronger covert capabilities than prior Claude models on several of our evaluations“ [S] TechCrunch | Nicht im Film; kein Änderungsbedarf |
| 16.11. | US-Energieversorger (u. a. Duke Energy) testen Mythos auf Lücken in Stromnetz-Software [S] Digitimes | Optional für Platz 4; kein Änderungsbedarf |
| 1.–17.11. | **Unverändert:** Mythos 5.2 nur für geprüfte Organisationen [P]; OpenAIs Mathe-Modell unveröffentlicht [S]; GPT-6.1 Astra nicht erschienen [S] | Z. 1, 18, 65 tragen |

---

## 4 · Alle Aussagen im Sprechtext (vo-v2.txt)

Urteil: **ok** · **overstated** (zu stark) · **wrong** (falsch) · **unverifiable** (nicht belegbar). „Eigenangabe“ = Zahl oder Aussage des Labs, im Film hörbar zugeschrieben. Quellenkürzel in Abschnitt 7.

| # | Z. | Aussage | Urteil | Quelle, Datum | Notiz |
|---|---|---|---|---|---|
| V1 | 1 | The best A.I. in the world is locked away. | ok (Einordnung) | P9 9.11.; S1 6.11. | Mythos 5.2 nur für Geprüfte; OpenAIs Mathe-Modell unveröffentlicht |
| V2 | 4 | The best never sits in your pocket. It sits behind a door you can't open. | ok (Einordnung) | P9 | |
| V3 | 5 | found a flaw hiding in computer code for twenty-seven years | ok (Eigenangabe) | P1 7.4.; S19 | Von OpenBSD gepatcht (laut heise); Absender im Bild |
| V4 | 7 | Behind that door, the machines have started doing mathematics. Not sums. Proofs. | ok | P4 4.9.; P3 10.8. | |
| V5 | 8 | You're fifth. | ok (Modell des Films) | Faktenzettel E | Reihenfolge als Modell, keine Chronologie |
| V6 | 9 | At the very front stand the people who built it. | ok (Einordnung) | — | |
| V7 | 10 | machines have written out the famous proof of Fermat's Last Theorem, so strictly that a computer can check every step | ok | P4 4.9. | Folgt „a simplified version of Wiles's proof“ (Darmon–Diamond–Taylor); Lean, nur die drei Standard-Axiome |
| V8 | 11 | That work was expected to take years. | ok | P4 („For FLT, the formalization process was expected to take years.“) | Wer das erwartete, sagt die Seite nicht |
| V9 | 11 | It took eleven days. | ok (Eigenangabe) | P4 | Baut auf Mathlib und Teilen des Imperial-FLT-Projekts auf; gelegentliche Hinweise eines Forschers; Lauf im August |
| V10 | 11 | Then, this fall, thirty hours. | ok (Eigenangabe) | P9 9.11./11.11. | Startpaket aus dem ersten Beweis (Einblendung 1:00, Z. 62); ein Lauf |
| V11 | 12 | The lab is Anthropic, and the numbers are its own. | ok | P4, P9 | |
| V12 | 12 | the first proof is public, and anyone can run the check | ok | P4 (github.com/anthropics/fermats-last-theorem) | Wer prüfen will, braucht Lean |
| V13 | 13 | You can't use it. The lab calls it an unreleased research version. | ok | P9 („performed by an unreleased research version of Claude“) | |
| V14 | 14 | A second lab, OpenAI, goes further. | ok (Einordnung) | — | |
| V15 | 14 | Its newest public A.I. is called Astra | **wrong** | S4 29.9./26.10.; S3 | → „strongest“ (Must-change 1) |
| V16 | 14 | and anyone can use it | **overstated** | S2 Sept.; S3 Okt. | Nur gegen Bezahlung (Must-change 1) |
| V17 | 14 | On stage, its chief executive, Sam Altman, described the one after it | ok | S5 15.9.; S6 | |
| V18 | 15 | [CLIP A1] Wortlaut | **unverifiable** | S6 | Zwei Fassungen im Umlauf (Abschnitt 5) |
| V19 | 16 | Who checked it from outside? Nobody can yet. | **overstated** | S7 Okt.; S8 | Must-change 2 |
| V20 | 16 | OpenAI itself says outside mathematicians cannot yet reproduce the results. | **unverifiable** | S7 (Dealroom-Formulierung) | Must-change 2 |
| V21 | 17 | both labs are worth more, the further ahead they look | ok (Einordnung, Interesse) | P10 10.11.; S23 | |
| V22 | 17 | Anthropic reported its thirty-hour run one day before it began pitching its shares to investors. | ok | P9 9.11.; P10 10.11. | Die Vorsprung-Fußnote kam erst am 11.11., nach Roadshow-Start |
| V23 | 18 | Machines are doing real mathematics. | ok | P4 (begutachtet von Buzzard); P3 (Conrey, Goldston) | |
| V24 | 18 | OpenAI is holding one back. Its finance chief said so in November | ok | S1 6.11. | |
| V25 | 20 | "We are still holding that model." | ok (nur Suchauszug) | S1 | Am Original prüfen |
| V26 | 20 | "We have not yet released it." | **unverifiable** | S1 | Must-change 3 |
| V27 | 21 | not hidden, announced; what's locked away is the access and some of the evidence | ok (Einordnung) | S7; P9 | |
| V28 | 22 | a lab lives from selling access | ok (Einordnung) | — | |
| V29 | 24 | Ask either lab, and the first answer is safety. | ok | P1; S1; S9 | Friar: intern weiter prüfen, bis man sich sicher fühlt |
| V30 | 24 | The clearest case came this spring | ok | P1 7.4. | |
| V31 | 25 | crash a computer from across the world, just by connecting to it | ok (Eigenangabe) | P1 („remotely crash any machine running the operating system just by connecting to it“) | |
| V32 | 26 | The A.I. that found it is called Mythos. | ok | P1 | |
| V33 | 26 | said it had no plan to release it to the public | ok | P1 („We do not plan to make Claude Mythos Preview generally available.“) | |
| V34 | 26 | it chose who goes in | ok | P1 (12 Startpartner, über 40 Organisationen) | |
| V35 | 27 | Second in line? The government. It may test a new A.I. before release, if the lab volunteers. | ok | S11 EO 14409 §3(b), 2.6.2026 | Bis zu 30 Tage vor der Freigabe an andere Partner, freiwillig |
| V36 | 28 | Apple. Google. Microsoft. The bank JPMorgan Chase. | ok | P1 | |
| V37 | 29 | Leaked files suggest Mythos was also costly to run. | ok | S12 (März 2026; Entwurf: „very expensive for us to serve“) | |
| V38 | 29 | Sam Altman has named OpenAI's biggest advantage himself | ok (sekundär) | S13 21.10. | |
| V39 | 30 | [CLIP C1] Wortlaut | **unverifiable** (Teilsatz) | S13 | Ganzer Satz per Whisper |
| V40 | 31 | A head start is worth money. So is the computing power a lab keeps for itself. | ok (Einordnung) | Faktenzettel B35; S12 | |
| V41 | 32 | So a closed door buys a lab time. | ok (Einordnung) | — | |
| V42 | 34 | Security teams, let in to point the locked machine at the software the world runs on | ok | P1 | |
| V43 | 35 | a program that handles video … a single line … automated tests … five million times, never caught it | ok (Eigenangabe) | P1 („automated testing tools had hit five million times without ever catching the problem“) | FFmpeg, 16 Jahre |
| V44 | 36 | By the lab's own count, its partners found well over a hundred thousand within months. | ok (Eigenangabe) | P7 6.10. („at least 129,000 verified … between April and July 2026“) | Hochgerechnet aus einer Umfrage bei einem Teil der Partner |
| V45 | 37 | Critics called it marketing. | ok | S20 (AP-Auszug; Internet of Bugs 17.4.) | |
| V46 | 37 | caution is this company's brand | ok (Einordnung) | — | |
| V47 | 37 | In July, Microsoft, one of the partners, fixed more security flaws in a single month than ever before. | ok | S14 15.7.2026; P1 | 570 laut Krebs; 622 nach Microsofts eigener Zählung |
| V48 | 37 | Its own explanation? A.I. helps defenders find more. | ok | S14 (Davuluri) | KI allgemein, nicht Mythos |
| V49 | 38 | Found is not yet fixed. Often, months passed in between. | ok | P8 8.10. („we often saw months pass between a vulnerability being found and being fixed“) | |
| V50 | 38 | the time behind the door was a head start for the people who repair things | ok (Einordnung) | P6 29.9. | Deutung des Labs |
| V51 | 42 | By June, the door opened. Partly. | ok | P2 9.6. | Vom 12.6. bis 1.7. ausgesetzt (wird nicht erzählt, kein Fehler) |
| V52 | 43 | Its maker says it is the same machine as Mythos. | ok | P9 („the same underlying model“) | |
| V53 | 43 | if Fable is the A.I. on your phone, your bank letter goes to that machine | ok | P9 | Bedingt formuliert |
| V54 | 43 | Only high-risk hacking requests, and most research biology, get passed to an older one. | **overstated** | P9 | Must-change 4 |
| V55 | 44 | the newest version just completed a black-hole calculation that had sat unfinished for over twenty years. Too much work. | ok (Eigenangabe) | P9 („laid out in 2003 but was too laborious to complete“); S17 | Preprints vom 7.11., nicht begutachtet |
| V56 | 45 | Three personal subscriptions … the proof of a serious theorem in three days | ok (Eigenangabe) | P4 („three personal Claude Max plans“; Vinogradovs Drei-Primzahlen-Satz) | |
| V57 | 46 | in training … held back in the skills that could most directly speed up A.I. development itself. In the locked version, and in yours. | ok | P9 | |
| V58 | 47 | Behind you stands everyone else. Attackers included. | ok (Einordnung) | — | |
| V59 | 48 | Within months of the Mythos announcement, a rival nearly as good at breaking into software was free for anyone to download. | ok | P6 (50 gegen 56 von 410 Exploits); S15 17.9. (Gewichte zwei Wochen nach dem 14.8.; ~4 Monate hinter der US-Spitze) | „Nearly as good“ misst Anthropic selbst; CAISI: „significantly lower than current U.S. frontier models“ (Stand Sept.) |
| V60 | 48 | Stripping out its safeguards cost a few thousand dollars. | ok (Eigenangabe) | P6 (~4.400 $; ein erfahrenes Team ~1.200 $) | |
| V61 | 49 | a locked door never keeps anyone safe for good. It buys time. | ok (Einordnung) | P6 („those models have now arrived“) | |
| V62 | 50 | Updates protect you from attacks on flaws already found and fixed | ok | P8 | |
| V63 | 50 | a device too old for updates … a flaw in it never gets closed | ok | allgemein | |
| V64 | 54 | This fall, OpenAI planned to release its next machine. Then it called the launch off. | **overstated** | S9 28.9.; S4 | Must-change 5 |
| V65 | 54 | The reported reason? It was more deceptive than the one before. | ok | S9 (WSJ via CNBC; Engadget) | OpenAI selbst enger: „didn't quite meet the bar in terms of staying within scope and authorization …“ |
| V66 | 55 | no rule forces a lab to tell you what it sees in there | **overstated** | S16 (SB 53 seit 1.1.2026) | Must-change 6 |
| V67 | 55 | Marius Hobbhahn runs a research group that tests these machines for deception. | ok | S10 (CEO, Apollo Research) | |
| V68 | 55 | He told the U.S. Senate | ok | S10 30.9.2026 | Schriftlich belegt, mündlich offen |
| V69 | 56 | [CLIP C4] Wortlaut | ok (schriftlich) / **unverifiable** (mündlich) | S10 | Abschnitt 5 |
| V70 | 57 | Before release means inside the room. | ok (Einordnung) | — | |
| V71 | 58 | Independent testers examined the newest Mythos before it went out. | ok | P9 („UK AI Security Institute, Frontier Design, and METR“) | |
| V72 | 58 | But the lab decides who gets in. | ok (Einordnung) | S11 (freiwillig) | |
| V73 | 62 | No locked machine did that thirty-hour run. … it was Fable, the one anyone can buy. | ok (Eigenangabe) | P9 („1,000 Fable 5.2 agents“; Fable im Pro-Plan bis 50 % des Wochenlimits) | |
| V74 | 62 | A thousand copies | ok | P9 | |
| V75 | 62 | starting from notes of the first proof | **overstated** (verharmlost) | P9 Fußnote 4 (11.11.) | Must-change 7 |
| V76 | 63 | The lab itself calls it roughly comparable to a public one. | ok | P4 („roughly comparable to Claude Fable 5.1“); P5 (Fable 5.1 öffentlich seit Sept.) | |
| V77 | 63 | What it had was dozens of copies, and eleven days. | ok | P4 („Dozens of Claude agents“) | |
| V78 | 63 | It was simply there two months earlier. | ok | P4 4.9.; P9 9.11. | Gerechnet nach Veröffentlichungsdaten; der Lauf selbst war im August |
| V79 | 65 | Labs work with each new version for weeks or months before you get it. | ok | P2; Faktenzettel B2, B19, B20 | |
| V80 | 65 | OpenAI is still holding its math machine. | ok (zeitkritisch) | S1 6.11.; S7 | Am Release-Tag prüfen |
| V81 | 65 | How far ahead? Nobody outside can measure that. | ok (Einordnung) | — | |
| V82 | 66 | OpenAI says it ran up to ten thousand copies of its math machine | ok | S8 9.9. („roughly 10,000 agents … 88 hours“) | |
| V83 | 66 | for a result mathematicians still dispute | ok | S8; S29 | Prioritätsstreit; nicht unabhängig bestätigt |
| V84 | 66 | One copy answers your bank letter. A thousand write out a famous proof. | ok | P9 | Mit Vorsprung (Z. 62) |
| V85 | 66 | more of the same machine than any single subscription is built to give you | ok (Einordnung) | P9 (Pro: Fable bis 50 % des Wochenlimits) | |
| V86 | 68 | Locked away in April, in your hands by June. | ok | P1; P2 (Mythos 5 „an upgrade to Claude Mythos Preview“, Fable 5 dasselbe Modell) | |
| V87 | 68 | Since April, the price of running Mythos has fallen by two thirds. | ok | P1 (25/125 $); P9 (8/40 $) | −68 %, Listenpreis |
| V88 | 69 | A few months is a fair estimate. | ok (Schätzung) | — | |
| V89 | 71 | a few months from now … a machine that today only the front of the line has met | ok (Prognose) | — | Durch „fair estimate“ davor kalibriert |

---

## 5 · Clips und Zitatkarte

| Clip | Befund | Urteil | Was tun |
|---|---|---|---|
| **A1** Altman, Dreamforce | Zwei Sekundär-Transkripte weichen ab: „this internal model **after** Astra can do things that **even the world's best mathematicians** cannot“ (KuCoin) gegen „this internal model **past** Astra can do things that **the best mathematicians in the world** cannot“ (Singju Post). Das Gespräch war am **15.9.** (Bauchbinde: Must-change 9). | unverifiable | Untertitel nur nach Whisper. Die Einleitung „described the one after it“ passt zu beiden Fassungen. Bühnenmusik prüfen. |
| **C1** Altman bei Berman, 21.10. | Laut Singju-Post-Transkript sinngemäß bei 00:32:26–00:32:48: größter Vorteil, „the next generation of models before anybody else“. Satzanfang fehlt. | unverifiable (Teilsatz) | Ganzen Satz per Whisper holen (§7). Sonst Sprechersatz aus `text-v2.md`. |
| **C4** Hobbhahn, Senat, 30.9. | Der Satz steht wörtlich in der **schriftlichen** Stellungnahme (hsgac.senate.gov). Ob er ihn mündlich sagt, ist offen. | ok (schriftlich) | Spricht er ihn nicht: Zitatkarte „written testimony“, gelesen. „He told the U.S. Senate“ bleibt dann richtig. |
| **R1** Friar, CNBC, 6.11. | Satz 1 steht wörtlich in mehreren Suchauszügen der CNBC-Seite; Satz 2 nirgends wörtlich. Gemeint ist laut Auszug „the model that actually solved the Navier-Stokes“. | Satz 1 ok (sekundär), Satz 2 unverifiable | Karte nur mit Satz 1 (Must-change 3); am Original gegenlesen. |

---

## 6 · Alle Einblendungen und Bildangaben (text-v2.md)

| # | Zeit | Einblendung | Urteil | Quelle | Notiz |
|---|---|---|---|---|---|
| E1 | 0:00 | THE BEST AI IS LOCKED (Bildtext) | ok (Einordnung) | — | |
| E2 | 0:23 | HIDDEN FOR 27 YEARS · Anthropic's account | ok | P1 | |
| E3 | 0:30 | HOW MUCH STRONGER? | — (Frage) | — | |
| E4 | 0:34 | NOT SUMS. PROOFS. | ok | P4, P3 | |
| E5 | 0:42 | YOU'RE FIFTH. | ok (Modell) | — | |
| E6 | 0:51 | FERMAT'S LAST THEOREM · computer-checked | ok | P4 | |
| E7 | 1:00 | 11 DAYS → 30 HOURS · Anthropic, Sep 4 / Nov 9, 2026 · one run each | ok | P4, P9 | |
| E8 | 1:00 | the second started with notes from the first proof | **overstated** | P9 | Must-change 8 |
| E9 | 1:06 | PROOF PUBLIC · reviewed by Kevin Buzzard | ok | P4 („We thank Kevin Buzzard for reviewing the proof“) | |
| E10 | 1:15 | „an unreleased research version“ | ok | P9 | |
| E11 | 1:22 | Bild: ASTRA-Kern „frei zugänglich“ | overstated (Bildidee) | S2 | Mit Kasse oder Preisschild zeigen (empfohlen) |
| E12 | 1:32 | ORIGINAL FOOTAGE · … · Dreamforce, Sep 16, 2026 | **wrong** (Datum) | S5 | Must-change 9 |
| E13 | 1:37 | „outside mathematicians cannot yet reproduce“ · OpenAI | **unverifiable** | S7 | Must-change 10 |
| E14 | 1:47 | NOV 9 → NOV 10 | ok | P9, P10 | |
| E15 | 1:57 | REAL MATHEMATICS · ONE HELD BACK | ok | P4, S1 | |
| E16 | 2:06 | Sarah Friar, CFO, OpenAI · CNBC, Nov 6, 2026 | ok | S1 | |
| E17 | 2:06 | Kartentext, Satz 2 | **unverifiable** | S1 | Must-change 3 |
| E18 | 2:06 | business TV interview | ok | S1 | |
| E19 | 2:11 | ANNOUNCED. NOT AVAILABLE. | ok (Einordnung) | — | |
| E20 | 2:28 | SAFETY · APR 7 | ok | P1 | |
| E21 | 2:36 | OpenBSD · Anthropic, Apr 7, 2026 | ok | P1 | |
| E22 | 2:42 | „We do not plan to make … generally available“ · Apr 7, 2026 | ok | P1 | |
| E23 | 2:54 | UP TO 30 DAYS BEFORE RELEASE · VOLUNTARY | ok | S11 | Genau: vor der Freigabe an andere Partner (empfohlen: „· EO 14409“) |
| E24 | 3:00 | Apple · Google · Microsoft · JPMorgan Chase · NOT YOU. NOT YET. | ok | P1 | |
| E25 | 3:06 | 5× (launch price, Apr 7, 2026) | ok | P1; P11 (Opus 4.6: 5/25 $) | Bezug nennen (empfohlen) |
| E26 | 3:17 | ORIGINAL FOOTAGE · … · interview with Matthew Berman, Oct 21, 2026 | ok (sekundär) | S13 | |
| E27 | 3:38 | PROJECT GLASSWING | ok | P1 | |
| E28 | 3:47 | Zähler 5,000,000 | ok | P1 | |
| E29 | 4:01 | 129,000+ CONFIRMED · April–July · Anthropic's own count | ok | P7 | Quellwort „verified“ |
| E30 | 4:08 | JULY · RECORD · Krebs on Security, TechCrunch · Microsoft cites AI in general | ok | S14 | |
| E31 | 4:51 | JUNE 9 | ok | P2 | |
| E32 | 4:56 | HACKING · BIOLOGY | ok (verkürzt) | P9 | |
| E33 | 5:13 | 2003 · Anthropic, Nov 9, 2026 · preprints · the lab's own account | ok | P9 | |
| E34 | 5:13 | no outside review yet | **unverifiable** | S17 | Must-change 11 |
| E35 | 5:23 | 3 SUBSCRIPTIONS · 3 DAYS · Anthropic, Sep 4, 2026 | ok | P4 | |
| E36 | 5:31 | „limit advances in the specific research capabilities that could most directly accelerate AI development“ | ok (wörtlich) | P9 | |
| E37 | 5:50 | APR → AUG · about $4,400 · CAISI, Sep 17 · Anthropic, Sep 29, 2026 | ok | P6, S15 | |
| E38 | 6:36 | NEXT · HELD BACK · WSJ, via CNBC, Sep 28, 2026 · GPT-6.1 Astra | ok | S9 | „NEXT“ → „ASTRA 6.1“ (empfohlen, passend zu Z. 54 neu) |
| E39 | 7:01 | ORIGINAL FOOTAGE · Marius Hobbhahn, CEO, Apollo Research · U.S. Senate hearing, Sep 30, 2026 | ok | S10 | Mündlich offen |
| E40 | 7:08 | WHO GETS TO LOOK IN? | — (Frage) | — | |
| E41 | 7:13 | UK AISI, METR, Frontier Design · Anthropic, Nov 9, 2026 | ok | P9 | |
| E42 | 7:21 | WHO CHECKED IT? · WHAT'S NOT SHOWN? | — (Frage) | — | |
| E43 | 7:35 | 11 DAYS → 30 HOURS · 1,000 copies · one run · started with 47 lemmas from the first proof | ok | P9 | Dazu 60 Aussagen und eine Skizze |
| E44 | 7:52 | „roughly comparable“ · SEP 4 → NOV 9 | ok | P4, P9 | |
| E45 | 8:17 | 1 · NEWER | ok (Einordnung) | — | |
| E46 | 8:31 | „OpenAI says“ · NOT CONFIRMED · 2 · BIGGER · same machine × 1,000 | ok | S8, P9 | |
| E47 | 8:56 | PERMISSION · POWER | ok (Einordnung) | — | |
| E48 | 9:01 | APR → JUNE · Preisschild auf ein Drittel · Anthropic, Apr 7 / Nov 9, 2026 | ok | P1, P9 | |
| E49 | 9:15 | A FEW MONTHS · ESTIMATE (3 to 6) | ok (Schätzung) | Faktenzettel T5 | Die Beispiele im Film liegen bei 1 bis 3 Monaten; „3 to 6“ ist die Schätzung des Faktenzettels |

---

## 7 · Quellen

**[P] Primär, am 17.11.2026 gelesen**
- **P1** https://www.anthropic.com/glasswing · 7.4.2026 (Nachtrag 6.10.)
- **P2** https://www.anthropic.com/news/claude-fable-5-mythos-5 · 9.6.2026 (Nachträge 12.6., 1.7.)
- **P3** https://www.anthropic.com/research/riemann-zeta · 10.8.2026
- **P4** https://www.anthropic.com/research/formalizing-fermats-last-theorem · 4.9.2026
- **P5** https://www.anthropic.com/claude-fable-and-mythos-5-1 · Sept. 2026 (laut Sekundärquellen 1.9.)
- **P6** https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities · 29.9.2026
- **P7** https://www.anthropic.com/news/cyber-verification-program · 6.10.2026
- **P8** https://www.anthropic.com/news/anthropic-cyber-mission · 8.10.2026
- **P9** https://www.anthropic.com/claude-fable-and-mythos-5-2 · 9.11.2026 (Edit 11.11.)
- **P10** https://www.anthropic.com/news/roadshow-launch · 10.11.2026
- **P11** https://www.anthropic.com/news/claude-opus-4-6 · 5.2.2026

**[S] Sekundär oder nur Suchauszug**
- **S1** CNBC-Transkript Friar/Eisen · 6.11.2026 · https://www.cnbc.com/2026/11/06/cnbc-exclusive-transcript-openai-cfo-sarah-friar-speaks-with-cnbcs-sara-eisen-on-squawk-on-the-street-today.html (blockiert, nur Auszüge)
- **S2** Engadget, GPT-6 Astra Rollout · Sept. 2026 · https://www.engadget.com/2252859/how-to-use-gpt-6-astra-rollout-schedule/ ; 9to5mac · 3.9.2026 (Rollout erst an ausgewählte Organisationen, dann Plus, Pro, Business, Enterprise und API) · https://9to5mac.com/2026/09/03/openai-releasing-major-upgrade-to-chatgpt-and-codex-with-gpt-6-astra-details-here/ ; OpenAI-Ankündigung, von zwei Seiten so zitiert (blockiert, nicht geöffnet) · https://openai.com/index/gpt-6-astra/
- **S3** Notebookcheck, GPT-6 Luna für Free/Go · Okt. 2026 · https://www.notebookcheck.net/ChatGPT-Free-and-Go-users-start-getting-GPT-6-Luna-in-Chat.1419032.0.html
- **S4** The New Stack, GPT-6.1 Sol · 29.9.2026 · https://thenewstack.io/openai-gpt-6-1-sol/ ; BleepingComputer, GPT-6.1 Terra · 26.10.2026 · https://bleepingcomputer.com/news/artificial-intelligence/openai-launches-gpt-61-terra-with-3x-faster-ai-agents-50-percent-lower-pricing ; Astra gegen 6.1 Sol: https://benchlm.ai/compare/gpt-6-1-sol-vs-gpt-6-astra
- **S5** SiliconANGLE · 15.9.2026 · https://siliconangle.com/2026/09/15/ai-progress-and-responsibility-nvidia-anthropic-and-openai-ceos-weigh-in-at-salesforces-annual-event/ ; TechFinitive · https://www.techfinitive.com/dreamforce-2026-forget-about-slowing-down-ai-bring-it-on-says-nvidia-ceo/
- **S6** Singju Post, Transkript Dreamforce · https://singjupost.com/transcript-marc-benioff-interviews-sam-altman-at-dreamforce-2026/ ; KuCoin · https://www.kucoin.com/news/insight/BTC/6aaab1fd7d10fa0007cdeec1
- **S7** Dealroom, 722 Manuskripte · Okt. 2026 · https://dealroom.co/news/160570-openai-publishes-722-math-papers-from-an-unreleased-frontier-model/ ; Scientific American · Okt. 2026 · https://www.scientificamerican.com/article/openai-unleashes-hundreds-more-math-results-upon-a-field-already-in-shock/
- **S8** CNBC, Navier-Stokes · 9.9.2026 · https://www.cnbc.com/2026/09/09/openai-navier-stokes-math-problem-solved.html ; Quanta · 8.9.2026 · https://www.quantamagazine.org/ai-has-solved-one-of-maths-1-million-millennium-prize-problems-20260908/ ; OpenAI-Post (blockiert) · https://openai.com/index/navier-stokes-solution/
- **S9** CNBC, GPT-6.1 Astra gestoppt · 28.9.2026 · https://www.cnbc.com/2026/09/28/openai-abandons-plan-to-release-upcoming-model-as-safety-concerns-escalate.html ; Engadget · https://www.engadget.com/2271626/openai-cancels-gpt-6-1-astra-release-deceptive-behavior/
- **S10** Schriftliche Stellungnahme Hobbhahn · 30.9.2026 · https://www.hsgac.senate.gov/subcommittees/dmdcc/hearings/rogue-ai-securing-the-homeland-against-ai-agent-attacks/marius-hobbhahn-testimony/
- **S11** EO 14409 · 2.6.2026 · https://www.presidency.ucsb.edu/documents/executive-order-14409-promoting-advanced-artificial-intelligence-innovation-and-security
- **S12** CSO Online, Mythos-Leak · März 2026 · https://www.csoonline.com/article/4151801/leak-reveals-anthropics-mythos-a-powerful-ai-model-aimed-at-cybersecurity-use-cases.html
- **S13** Singju Post, Transkript Berman · https://singjupost.com/sam-altman-on-rsi-ai-consciousness-openais-new-hardware-transcript/ ; Dealroom · https://dealroom.co/news/x-2113302574053134553-sam-altman-says-openais-edge-is-getting-new-models-first-pointing-to-mat/
- **S14** TechCrunch, Microsoft-Rekord · 15.7.2026 · https://techcrunch.com/2026/07/15/microsoft-patches-record-number-of-security-vulnerabilities-citing-its-use-of-ai/
- **S15** CAISI zu GLM-5.3 · 17.9.2026 · https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities
- **S16** SB 53: Future of Privacy Forum · https://fpf.org/?p=247081 ; Kilpatrick Townsend · Okt. 2025 · https://ktslaw.com/en/insights/alert/2025/10/california-enacts-the-transparency-in-frontier-artificial-intelligence-act-sb-53 ; Gesetzestext: https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB53
- **S17** Physik-Preprints · Nov. 2026 · https://cryptobriefing.com/claude-fable-black-hole-calculation/ ; TechTimes · 10.11.2026 · https://www.techtimes.com/articles/330361/20261110/claude-fable-52-ai-agents-rebuild-fermats-last-theorem-proof-30-hours-starting-47-lemmas.htm
- **S19** heise, OpenBSD 7.9 · https://heise.de/-11300769
- **S20** Kritik „Marketing“: AP-Auszug (Suchergebnis) ; Internet of Bugs · 17.4.2026 · https://www.youtube.com/watch?v=urkVFZAhz3U
- **S23** CNBC, Börsengang · 16.11.2026 · https://www.cnbc.com/2026/11/16/anthropic-ipo-date-price-range.html ; Fortune · 10.11.2026 · https://fortune.com/2026/11/10/anthropic-ipo-price-range-ai-stock-sell-off/
- **S29** Navier-Stokes-Prioritätsstreit · https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_priority_controversy ; The Decoder · https://the-decoder.com/mathematicians-say-openai-doesnt-understand-its-own-navier-stokes-proof/
- **Nachrichten 1.–17.11.:**
  - TechCrunch zu GPT-6 Cyber · 5.11.2026 · https://techcrunch.com/2026/11/05/openai-released-a-new-cybersecurity-model-is-that-enough/
  - TechCrunch zu Mythos 5.2 · 9.11.2026 · https://techcrunch.com/2026/11/09/anthropic-releases-new-mythos-and-fable-models-amid-rsi-concerns/
  - Digitimes · 16.11.2026 · https://digitimes.com/news/a20261116PD233/anthropic-microsoft-testing-software-cybersecurity.html

**Nicht erreichbar:** openai.com und cnbc.com (blockiert), pressroom.versantmedia.com, cybernews.com und www.nist.gov (DNS), GitHub `openai/math` (nicht freigegeben). Für den letzten Schritt vor dem Kartenbau sollten cnbc.com oder pressroom.versantmedia.com freigegeben werden.
