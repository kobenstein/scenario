# Kritik v1 · „AI Just Gave Disease a 10-Year Deadline“ (Film #54, 12.11.2026)

Geprüft: `vo-v1.txt` (Hörfassung), `text-v1.md`, `hook-v1.md`, `geruest-v1.md`, `faktenzettel.md` (Abschnitt 0 zuerst), `clips.json`, gegen `schreibraum/REGELN.md` (Stand 11.11.) und die Koordinator-Vorgaben vom 12.11. (C1/C1b sind gelesene Zitatkarten; C3/C2 sichere Clips; C5 noch nicht lokalisiert; Ziel 1.300–1.380 Wörter, Off ≈ 10:00; ~1 Zahl pro Minute). Für Kontextfragen gezielt in `recherche-roh.md` nachgeschlagen: Der Roadshow-Wortlaut ist nur sekundär belegt, das 42-Minuten-Video hat niemand ganz gesehen, Ramakrishnan kennen wir nur aus der Videobeschreibung. Zeiten wie in text-v1 (2,4 W/s, Clip-Längen laut clips.json). **Zeilennummern = Zeilen in `vo-v1.txt`.**

**Note v1: 7/10.**

**Gesamturteil:** Der Film ist klar gebaut und fair im Ton. Der Hook hält REGELN §4 vollständig ein, der Kernsatz sitzt bei 0:31. Die Frist-Tafel (✓ ½ ? ✗) ist eine echte Uhr mit Fortschritt: Man weiß in jeder Minute, wo man steht und was noch offen ist. Darios stärkstes Argument kommt vor der Prüfung, und jede Station endet mit einem Urteil und einer neuen Frage.

**Noch nicht reif für die Hörfassung**, aus vier Gründen:
1. **Station 6 (6:23–7:50) ist eine Stimmen-Liste.** In 87 s kommen der Anreiz, ein Nobelpreisträger, Topol, der Lilly-Chef, Darios X-Post, Anthropics Medikament und der Dwarkesh-Clip. Die eigene Frage („why set a date at all?“) beantwortet die Station mit einem einzigen Satz.
2. **Zu lang und zu viele Zahlen.** 1.428 Wörter, der Sprechtext läuft bis 10:28. 17 Zahlenstellen, das sind ≈ 1,6 pro Minute (REGELN §5.1: ~1).
3. **Die zwei Sätze „The (sales) pitch left that out“ (2:57, 5:57)** behaupten etwas über ein 42-Minuten-Video, das wir nicht vollständig kennen.
4. **Vier Stellen versteht man ohne Bild beim ersten Hören nicht sicher:** „half“ als Urteil, „the trials the regulator saw beat“, „the first date is already moving“, „The heart shows the limit“.

Alle MUSS-Punkte tauschen Sätze aus oder streichen. Gerüst, Hook und Tafel bleiben, wie sie sind.

**Regel-Check: 8/9** (✗ §5.1 Zahlendichte). `regel_check.py vo-v1.txt`: **0 Hinweise, exit 0** (1.428 Wörter). Gegenprobe mit allen MUSS-Punkten (= `vo-v2.txt`):
- 0 Hinweise, 1.356 Wörter, Sprechtext bis 9:56
- 12 Zahlenstellen ≈ 1,2/min
- Clip-Abstand C5→C2 52 s (v1: 49 s)

---

## 1 · Zuschauer-Protokoll

Rolle: ohne Vorwissen, am Handy, schaut nebenbei. Gewertet wird nur, was man hört und was eine Einblendung sofort sagt.

| Zeit | Was ich höre | Reaktion |
|---|---|---|
| 0:00 | „Artificial intelligence just gave disease a ten-year deadline.“ | Große Behauptung, sofort klar. Ich bleibe. |
| 0:03–0:21 | Ein Arzt, „someone you love“, die vier Wörter, die Enkel hören sie wie „plague“ | Trifft. Zehn Sekunden schwer (Diagnose), dann Hoffnung. |
| 0:21 | „So which of these could really be history by the deadline?“ | Gute Frage, ich will die Antwort. |
| 0:26–0:37 | „The machines can find cures faster. They can't rush the human body. / Every cure has two dates …“ | Der Satz des Films. Den merke ich mir. |
| 0:37 | „The fastest, in weeks. The slowest, only after decades.“ | Welche ist welche? Ich tippe auf Alzheimer und will es bestätigt hören. Trägt. |
| 0:47–1:08 | Dario Amodei, Karte, Anthropic, „video made to sell its shares“, Pause, „This isn't about whether to buy the stock.“ | Jetzt ist es echt. Die Pause vor dem Disclaimer bremst kurz. |
| 1:12–1:32 | Essay „with small print“; „Trials are slow … because most drugs barely work.“ | Überraschend und klug. Das stärkste Argument kommt zuerst. |
| 1:38–2:03 | C3, Echo, „before twenty thirty-six“, „how fast does the body say so?“ | Ich weiß jetzt, wie der Film läuft: vier Krankheiten, vier Antworten. |
| **2:03** | „In the lab, the first date is already moving.“ | Kurzer Hänger: „first date“? Nach anderthalb Minuten ist die Zuordnung zu „found“ weg. Und „moving“, wohin? |
| 2:07–2:23 | Immunzellen mit Haken, KI hilft beim Design, „a fraction of the time it used to“, „All still in the lab.“ | Verständlich, aber kaum Staunen. Der Satz nimmt sich sofort zurück. |
| 2:26–2:42 | Tumor im Scan; „fifty-five patients, spread across a dozen different cancers. Three in four responded. / That's his theory, working.“ | Wow bei 55. Danach drei Zahlen in zehn Sekunden, die dritte rauscht vorbei. |
| 2:43–3:07 | Über hundert Krebsarten, „most cancer, not all“, **„The sales pitch left that out.“**, Urteil ✓ | Stark. Aber kurz der Gedanke: Woher wisst ihr, was im ganzen Video fehlt? |
| 3:11–3:43 | Eine Infusion, Cholesterin halbiert, „meant to last a lifetime“; „The biggest drugmakers are already buying …“; 15 Jahre Nachbeobachtung | Bester Staunen-Moment des Films. Der Pharma-Kauf ist ein Nebengleis. |
| **3:49** | „So heart disease, by the deadline: half.“ | Ohne Bild: „half“ wovon? Die Hälfte aller Herzkrankheiten? Erst „The tool can be ready …“ rettet es. |
| 3:59–4:21 | Abo-Aufruf | Passt nach dem Urteil, ist mit 21 s aber lang. |
| **4:21–4:47** | Psyche: Zuckerpille; „only about half the trials the regulator saw beat the sugar pill“ | **Stolperer** „saw beat“. Der Fakt selbst ist stark. |
| 4:55 | Psilocybin-Antrag | Nebengleis. Was hat das mit „hearing the answer“ zu tun? Dazu ein schweres Wort. |
| 5:02–5:17 | „Cancer has its scan. The mind is still waiting for one.“ / „It starts long before it shows.“ | Sehr gut. |
| 5:17–6:17 | 20 Jahre Vorlauf, „by twenty thirty-six“, Studie über vier Jahre, „next year“, Kleingedrucktes 2, „The pitch left that out, too.“, ✗, Bluttest | Inhaltlich der stärkste Akt. Aber vier Zeitangaben in 50 s, und das zweite „left that out“ klingt nach Nachtreten. |
| **6:23–7:44** | Anreiz-Satz, Nobelpreisträger, Topol, Lilly-Chef, „To be fair …“, Anthropics Medikament, „jam“-Clip | **Hier würde ich am ehesten wegwischen.** Wer sagte was, Stimme auf Stimme. Die Frage „why set a date at all?“ ist nach einem Satz erledigt, danach wird gesammelt. Anthropics eigenes Medikament (unter 18 Monate bis zur Maus, frühestens Ende 2028 am Menschen) ist der beste Moment der Station und geht unter. |
| 7:44 | „So can the second date come sooner …?“ | „second date“: Nach sieben Minuten muss ich kurz zurückdenken. |
| 7:50–8:44 | Studienklinik, digitale Zwillinge, FDA-Assistent, „The heart shows the limit“ | Konkret und hoffnungsvoll. „The heart shows the limit“ verstehe ich erst nach einer Sekunde. |
| 8:52–9:09 | Zitatkarte C1b, 27 Wörter vorgelesen | Lang. „problems that have eluded us for millennia“ ist Pathos aus der Rede; zählen tut die Bedingung „if we do this right“. |
| 9:09–9:30 | „the second date becomes the real deadline. And people set that one.“ | Gute Wendung, die Mission ist spürbar. |
| 9:30–9:59 | Bilanz, Enkel, Kernsatz, „This week, investors are putting a price …“ | Rund. „This week“ stimmt nur, wenn der Börsengang nicht wandert. |
| 10:08–10:28 | Abo-Aufruf am Schluss | Gut, etwas lang. |

**Ausstiegsstellen nach Risiko:**
1. 6:23–7:44: Stimmen-Liste ohne eigene Frage (Bericht-Ton, REGELN §1.2 und §3.1).
2. 2:26–2:42 und 5:17–6:06: Zahlenhaufen (§5.1).
3. 4:35–5:02: der Stolperer „saw beat“, dann das Psilocybin-Nebengleis.
4. 3:27: der Pharma-Kauf als Nebengleis mitten im besten Staunen-Moment.

**Beim ersten Hören nicht verstanden (ohne Bild):**
- 3:49 und 9:32 „half“ (L42, L96)
- 4:35 „the trials the regulator saw beat“ (L48)
- 2:03 „the first date is already moving“ (L23)
- 8:44 „The heart shows the limit“ (L87)
- kleiner: 7:44 „second date“ (L78)
- 0:37 „the body gives its answer“ trägt, weil 0:26 („the human body“) es vorbereitet.

**Sprünge:**
- 3:27 Pharma-Kauf
- 4:55 Psilocybin
- 6:30→6:54 Stimme auf Stimme
- 8:16 von der Alzheimer-Szene zu digitalen Zwillingen; der Rückgriff „sugar pill“ hält es gerade noch zusammen.

**Relevanz:** sehr hoch. Vier Krankheiten, die jede Familie kennt; „someone you love“, Eltern, Enkel, Wartezimmer. Börse und Firma bleiben Rahmen, nicht Thema ✓.

---

## 2 · Regel-Checkliste §1–9

| § | Ergebnis | Befund |
|---|---|---|
| **1 Haltung** | ✓ mit Auflagen (M1, M3) | Hoffnung statt Angst (Enkel; „the race … starts now“; Lösung in Szenen). Kein Hype, kein Doom, „du“ im Mittelpunkt. Keine Ich-Sätze („I think“ nur in gelesenen Zitaten). Anreiz statt Bösewicht („No villain needed“) ✓ §1.7. Keine Pflege durch Roboter ✓ §1.9. Claude kommt nicht vor ✓ §1.10. **Abweichungen:** Station 6 berichtet, wer was sagte (§1.2). „The (sales) pitch left that out“ ist für das ganze Video nicht belegt (M3). |
| **2 Thema/Leitgedanke** | ✓ | Ein Leitgedanke, kein Rechenbeispiel. Der Kernsatz wird im Hook gepflanzt (0:31) und am Ende verwandelt geerntet (9:54/9:59). Nichts aus #4, #15 oder #20 wiederholt. |
| **3 Story-Gerüst** | ✓ mit Auflage (M1) | Fragen-Kette und Uhr sind da (Tafel mit Fortschritt ✓ §3.2). Große Schleife „schnellste/langsamste“ von 0:37 bis 5:17 ✓. Abo zweimal, mit Mission und als Frage, jeweils nach einer Auflösung (3:59 nach ½, 10:08 nach dem Kernsatz) ✓ §3.8; „subscribe“ = 2, kein Spendenaufruf. Kein angekündigtes Ende, Endbild 15 s mit Musik ✓. **Delle:** Station 6 (siehe 2.2). |
| **4 Hook** | ✓ | Siehe 2.1. |
| **5 Satz/Sprache** | **✗ (§5.1)** | Bann-Liste: 0 Treffer (Skript und Handsuche nach „nobody“, „here's the“, „let's“, „most of us“, „in this video“, „secret“, „real story“). „artificial intelligence“ statt „AI“ ✓, kein Flüster-Tag ✓. Länge 1.428 Wörter ✓ nach §5.5, aber über der Vorgabe (1.300–1.380, Off ≈ 10:00). **Zahlen:** 17 Stellen in 10:28 ≈ 1,6 pro Minute. Häufungen: 2:33–2:43 (55, ein Dutzend, drei von vier, über hundert) und 5:17–6:06 (20 Jahre, 2036, über vier Jahre, nächstes Jahr, 2036). Ohr-Stolperer siehe Protokoll. |
| **6 Payoff** | ✓ mit Auflage (K5) | Siehe Abschnitt 5. |
| **7 Clips** | ✓, aber ohne Puffer | Echte Clips: C3 8 s, C5 5 s, C2 10 s = 23 s ≈ 3,7 % ✓. Dwarkesh 2 Clips/18 s ✓. Abstände C3→C5 ≈ 293 s, C5→C2 ≈ 49 s ✓ (knapp). Einordnungssätze ✓. C1/C1b sind korrekt als gelesene Karten mit „In his words:“ eingeleitet. **Risiken:** (a) C5 ist nicht lokalisiert. Wird er zur Karte, hat der Film nur 2 echte Clips (§7 verlangt 3–6). (b) Das Echo nach C5 („The experiments. Always the bottleneck.“) wiederholt als Karte wörtlich, was die Stimme gerade gelesen hat. (c) Streicht man Lilly (Vorschlag aus text-v1) ohne Umbau, fällt C5→C2 auf ~43 s. → M1, K9. |
| **8 Titel** | ✓ | 39 Zeichen, „AI“ vorn, Ereignis im Präsens, kein „could“. Zugespitzt ist nur die Rahmung: Die Frist setzte ein Mensch, kein Modell, und der Film sagt das bei 0:47. Titelfragen sind nicht Gegenstand dieser Kritik. |
| **9 Thumbnail** | ✓ (soweit im Text prüfbar) | Erstes Bild = Thumbnail A (Vitrine) ✓, eine Akzentfarbe (Mint) ✓. „CANCER'S DEADLINE: 2036“ (Gerüst §11) ist allein klar; der Film löst es mit „for many kinds“ ein und verspricht nicht mehr (§9.6) ✓. |

**Ich-Sätze:** 0. **„AI“ im Sprechtext:** 0. **Tags:** nur erlaubte.

**Koordinator-Vorgaben 12.11.:**
- C1 und C1b als gelesene Karten: ✓, schon in v1. C1b ist mit 27 Wörtern zu lang zum Vorlesen → K4.
- „left that out“ vorsichtig formulieren → M3.
- C5 so schreiben, dass er als Clip und als Karte trägt → M1.
- Abo zweimal mit Mission, kein Spendenaufruf: ✓; straffen → K3.
- Schlusssatz zum Börsengang muss am 16.11. stimmen → M4.
- Länge und Zahlen → M2.

### 2.1 Hook nach der §4-Tabelle und Gegentest

| Zeit | Regel | vo-v1 | Urteil |
|---|---|---|---|
| 0–3 s | Titelworte, Thumbnail-Bild, These groß | „Artificial intelligence just gave disease a ten-year deadline.“ + Vitrine und Stempel | ✓ |
| 3–30 s | Szene mit dir, sichtbarer Einsatz, eine Hauptfrage | Arzt und „someone you love“; Enkel und „plague“; Frage bei 0:21 (62 Wörter) | ✓ |
| 30–50 s | harte Wendung oder überraschender Fakt | 0:26 „They can't rush the human body.“ → 0:31 Kernsatz | ✓ |
| 50–60 s | erster Gewinn, erst dann Kontext | 0:37 Wochen/Jahrzehnte; 0:47 Person, 0:50 Karte, 0:59 Firma | ✓ |
| Minute 1 | ≤ 1 Zahl, kein Rückblick, eine Frage, kein Zitat vor 0:30 | „ten-year“ und „two“ (Kernsatz), 1 Frage, Karte erst ab 0:50 | ✓ |

**Gegentest:**
- Worum geht es? ✓
- Warum ist es echt? ✓ (Karte bei 0:50, stummer Beleg ab 0:01 im Bild)
- Welche Frage ist offen? ✓
- Bei 0:45 ein stärkerer Grund zu bleiben als bei 0:30? ✓ (Welche Krankheit ist die langsame?)

**Der Hook bleibt unverändert.** Das Restrisiko steht schon in hook-v1: die Übergabe zur Person bei 0:47. In der Hörprobe dort hinhören.

### 2.2 Fragen-Kette und LOOP je Station

| # | Station (v1) | beantwortet | öffnet | Urteil |
|---|---|---|---|---|
| 0 | Hook | – | Welche wird Geschichte? Dazu: schnell oder langsam? | ✓ |
| 1 | Versprechen | wer, wo, sein bestes Argument, seine Grenze (C3) | Wie schnell sagt der Körper es? | ✓ |
| 2 | Krebs | Wochen, 55 Patienten, ✓ für viele | Ist schnell auch vollständig? | ✓ (Labor-Teil ohne Staunen, K5) |
| 3 | Herz | Blut in Wochen, Herz in Jahren, ½ | (nach dem Abo) die dritte, leise | ✓ („half“ → M5) |
| 4 | Psyche | Placebo-Rauschen, kein Maßband, ? | die vierte, langsamste | ✓ (Psilocybin-Nebengleis → K1) |
| 5 | Alzheimer | 20 Jahre Vorlauf, ✗, das Rennen beginnt jetzt | Warum dann ein Datum? | ✓ |
| **6** | Pitch und Test | **ein Satz** („a sales pitch rewards a promise with a date“), danach Stimmen | Kann das zweite Datum früher kommen? | **½**: Die Station beantwortet ihre Frage zur Hälfte und sammelt dann Meinungen. Die Schlussfrage entsteht aus C2, nicht aus einer Antwort. |
| 7 | Lösung | ja, drei Wege, und wer entscheidet | Hält die Frist? | ✓ |
| 8 | Antwort | Bilanz, Kernsatz | – | ✓ |

Neue offene Fragen kommen höchstens 90 s auseinander ✓. Die größte Lücke (6:17 → 7:44 = 87 s) liegt ausgerechnet in Station 6.

**But/therefore:** Bis Station 5 ist die Kette sauber. In Station 6 stehen drei „and“: Nobelpreisträger *and* Topol *and* Lilly. M1 macht daraus: Anreiz, *but* die Experimente sind der Engpass, *therefore* seine Wette, *but* die Kritik, *but* er misst sich selbst hart und sein eigenes Medikament geht denselben Weg, *therefore* die Frage nach dem schnelleren Beweis.

### 2.3 Zahlendichte (§5.1)

v1 gesprochen (ohne Zählwörter wie „two dates“ oder „four diseases“):
- 0:00 ten-year · 1:12 two years ago · 1:48 2036
- 2:33 55, ein Dutzend, drei von vier · 2:43 über hundert
- 3:21 halbiert · 3:34 fünfzehn Jahre · 3:43 Tausende
- 4:35 etwa die Hälfte
- 5:17 zwanzig Jahre · 5:23 2036 · 5:39 über vier Jahre / nächstes Jahr · 6:06 2036
- 7:10 achtzehn Monate · 7:20 2028 · 7:52 sechzig · 8:33 ein bis zwei Monate

→ **17 Stellen ≈ 1,6 pro Minute.** Ziel ~1 pro Minute (≈ 10–12 Stellen in 10:00).

**Was bleibt:** Zahlen, die eine Station tragen (55 Patienten, halbiert, 15 Jahre, etwa die Hälfte, 20 Jahre, 18 Monate und 2028).

**Was geht:** ein Dutzend, drei von vier, die zweite und dritte 2036, über vier Jahre, nächstes Jahr, „two years ago“; „Tausende“ wird eine Analogie. → M2

### 2.4 Fairness und Faktenrisiken

| Zeit | Satz | Beleg | Risiko | Maßnahme |
|---|---|---|---|---|
| 2:57, 5:57 | „The sales pitch left that out.“ / „The pitch left that out, too.“ | F1: nur der zitierte Satz, sekundär; das ganze Video hat niemand gesehen (Falle 0.1) | Behauptung über das ganze Video; beim zweiten Mal Nachtreten | M3 |
| 9:59 | „This week, investors are putting a price on the first date.“ | F3 sekundär (Preis 18.11., Handel ab 19.11.) | Bei Verschiebung falsch | M4 |
| 6:54 | Lilly-Chef „great, but unlikely“ | F31: nur sinngemäß, nur sekundär | Wortlaut; dritte Gegenstimme in Folge | M1 (raus) |
| 6:43 | „The experiments. Always the bottleneck.“ nach C5 | F32, Sinn im Kontext ungeprüft | Als Karte doppelt | M1 |
| 3:27 | „The biggest drugmakers are already buying into one-time fixes like this.“ | F19: Verve zielt auf PCSK9, nicht auf ANGPTL3 | „like this“ unscharf, Nebengleis | M2 (raus) |
| 5:39 | „more than four years … next year“ | F27 umstritten | Zahlen | M2 (einfacher, [prüfen] bleibt) |
| 4:55 | Psilocybin „this month“ | F25 umstritten | Nebengleis | K1 (raus) |
| 6:45 | Topol „wildly off-base“ | F30, Datum unklar | Ohne Datum ok, im Skript aber ohne [prüfen] | K7 |
| 7:00 | „In August, he wrote … actually curing cancer.“ | F8 umstritten (X gesperrt) | im Skript ohne [prüfen] | K7 |
| 8:33 | FDA-Assistent, „one or two months“ | F35 umstritten | Stand am Release | K7 |

Alle anderen Fakten stehen sauber im Faktenzettel (text-v1, Faktencheck 1–31).

---

## 3 · MUSS-Änderungen (priorisiert)

| # | Zeile / Zeit | alt (wörtlich) | neu (Ersatztext) | Grund |
|---|---|---|---|---|
| **M1** | L66–L78 · 6:23–7:50 | „Partly, because a sales pitch rewards a promise with a date on it. No villain needed.“ / „A Nobel Prize-winning biologist, asked this month about artificial intelligence and new drugs, put the slow part in one place.“ / [CLIP C5] / „The experiments. Always the bottleneck.“ / „The cardiologist Eric Topol, …“ / „The head of drug giant Eli Lilly said it would be great, but unlikely.“ / „To be fair, …“ / „His own company …“ / „Its human trials could start as soon as late twenty twenty-eight. Same road as everyone else.“ / „He even warned of a jam himself, …“ / [CLIP C2] / „Discovery speeds up. Proof jams.“ / „So can the second date come sooner, without making medicine less safe?“ | Partly, because a sales pitch rewards a promise with a date on it. No villain needed.<br>A Nobel Prize-winning biologist, asked this month about artificial intelligence and new drugs, named the slow part:<br>[CLIP C5]<br>The testing, not the finding.<br>The other reason for his date: he's betting that the testing can speed up too.<br>The cardiologist Eric Topol, … (unverändert)<br>To be fair, … (unverändert)<br>His own company … (unverändert)<br>Its human trials could start as soon as late twenty twenty-eight. Same road as everyone else. First date: fast. Second date: years away.<br>He even warned of a jam himself, … (unverändert)<br>[CLIP C2]<br>Discovery speeds up. Proof jams.<br>So can proof come sooner, without making medicine less safe? | §1.2, §3.1. Die Station beantwortet ihre Frage jetzt in zwei Teilen: Anreiz und seine Wette. C5 ist das Scharnier dazwischen: Er nennt den langsamen Teil, und genau auf den wettet Dario. Diese Wette hat er bei 1:38 selbst ausgesprochen („much faster … but not infinitely fast“), sie ist also fair zugeschrieben (F6, F7). Lilly fliegt raus: nur sinngemäß belegt und die dritte Gegenstimme in Folge. **C5 trägt doppelt:** „named the slow part:“ leitet einen Clip und eine gelesene Karte gleich gut ein. „The testing, not the finding.“ deutet den Satz und wiederholt ihn nicht, darum gibt es auch bei einer Karte keine Doppelung. „First date: fast. Second date: years away.“ verankert die beiden Schlüsselbegriffe am besten Beispiel neu (§11, Schlüsselbegriffe an Abschnittswechseln). **Abstand C5→C2 jetzt 52 s** (v1: 49 s), mit Puffer für eine schnellere Stimme. |
| **M2** | mehrere · Länge und Zahlen | L14 „Two years ago, he wrote the same bet into an essay, with small print.“<br>L25 „Artificial intelligence now helps design those hooks. One step of that work takes a fraction of the time it used to.“<br>L28 „…spread across a dozen different cancers. Three in four responded.“<br>L29 „That's his theory, working.“<br>L39 „…The biggest drugmakers are already buying into one-time fixes like this.“<br>L41 „…takes thousands of people, over years.“<br>L57 „…diagnosed by twenty thirty-six…“<br>L59 „One such trial already ran for more than four years. The drug didn't work. Another big one is due to finish next year.“<br>L63 „But the race doesn't start in twenty thirty-six.“ | L14 „He wrote the same bet into an essay years ago, with small print.“<br>L25 „Artificial intelligence now helps design those hooks, in a fraction of the time.“<br>L28 „…spread across many different cancers. Most of them responded.“<br>L29 streichen<br>L39 nur „One treatment, meant to last a lifetime.“<br>L41 „…takes a stadium full of people, followed for years.“<br>L57 „…diagnosed by the deadline…“<br>L59 „One such trial waited years for its answer. The drug didn't work.“<br>L63 „But the race doesn't start at the deadline.“ | §5.1 und die Vorgabe 1.300–1.380 Wörter. Die Kürzungen aus text-v1 (L29, L39, Lilly in M1) sind übernommen. Zahlen: 17 → 12 Stellen. Die Zahlen, die eine Station tragen, bleiben; der Rest steht im Bild (12 CANCER TYPES · 75 %, 27,564 PATIENTS, 240 WEEKS). „a stadium full of people“ ist eine Analogie statt einer Zahl (§5.1). „by the deadline“ wiederholt den Schlüsselbegriff, statt die Jahreszahl ein zweites und drittes Mal zu nennen. „waited years for its answer“ greift das Motiv „the body answers“ auf. Zusammen mit K1, K3 und K4: 1.356 Wörter, Sprechtext bis 9:56. |
| **M3** | L32 · 2:57 und L61 · 5:57 | „The sales pitch left that out.“ · „The pitch left that out, too.“ | „The line in the sales video just says: cancer.“ · „The line in the sales video doesn't mention that either.“ | Koordinator-Vorgabe und Faktenzettel 0.1. Beide Sätze beziehen sich jetzt nur auf den zitierten Satz (C1), also auf das, was wir wirklich kennen. Sie bleiben wahr, auch wenn Dario an anderer Stelle im 42-Minuten-Video „most“ oder die Alzheimer-Einschränkung sagt. Die Spitze bleibt (der Satz hat kein Kleingedrucktes), das Nachtreten verschwindet. „just says: cancer“ ist ohne Bild hörbar: kein „most“. Neue [prüfen]-Marken, weil beide Sätze am Wortlaut von C1 hängen. |
| **M4** | L99 · 9:59 | „This week, investors are putting a price on the first date.“ | „Investors are already putting a price on the first date.“ | Koordinator-Vorgabe: Der Satz muss am 16.11. stimmen, egal ob der Preis steht. Die Spanne steht seit 10.11., die Orderbücher laufen, der Preis kommt laut Sekundärquellen am 18.11. Steht er am Montag schon, setzen ihn die Anleger im Handel weiter. „already“ trägt in beiden Fällen und hängt an keiner Woche. [prüfen] bleibt: am 16.11. vormittags den Stand prüfen; nur bei einer Absage muss der Satz neu. |
| **M5** | L23, L42, L48, L78, L87, L96 · Ohr ohne Bild | L23 „In the lab, the first date is already moving.“<br>L42 „…by the deadline: half.“<br>L48 „For the antidepressants already approved, only about half the trials the regulator saw beat the sugar pill.“<br>L78 „So can the second date come sooner, …?“<br>L87 „The heart shows the limit: fast can't mean less safe.“<br>L96 „Heart disease: half.“ | L23 „In the lab, the day a cure is found is already getting closer.“<br>L42 „…by the deadline: only halfway.“<br>L48 „Even for the antidepressants already approved, only about half the trials beat the sugar pill.“<br>L78 „So can proof come sooner, …?“<br>L87 „But remember the heart: fast can't mean less safe.“<br>L96 „Heart disease: halfway.“ | REGELN §4 und §5.1: Die Hörfassung muss ohne Bild verständlich sein. „half“ allein klingt wie „die Hälfte der Herzkrankheiten“. „saw beat“ ist ein Holzweg-Satz; der FDA-Bezug steht in der Einblendung (FDA REVIEWS · Turner 2008). „first date“ nach anderthalb Minuten ohne Anker → Wortlaut des Kernsatzes („the day … is found“). „proof“ statt „second date“ bei 7:44, weil M1 die Begriffe 50 s vorher neu verankert. „remember the heart“ macht den Rückgriff hörbar. |

**Gegenprobe mit allen MUSS-Punkten und K1–K4, K7, K8** (= `vo-v2.txt`):
- `regel_check.py`: 0 Hinweise; 1.356 Wörter
- Sprechtext bis 9:56, mit Weg ins Schlussbild und 15 s Endbild ≈ 10:19
- Minute 1 unverändert: 2 Zahlwörter, 1 Frage, keine Jahreszahl
- „subscribe“ = 2; Clips C3 8 s, C5 5 s, C2 10 s = 3,9 %; Abstände C3→C5 269 s, C5→C2 52 s
- 12 Zahlenstellen ≈ 1,2/min. Ohne Titelzahl und Frist-Jahr sind es 10 Datenzahlen, also ≈ 1/min.

---

## 4 · KANN-Änderungen

1. **K1 · Psilocybin streichen** (L51, 4:55): „And this month, a psilocybin therapy for depression was submitted for approval, years after its first big trial.“ Ein Nebengleis: Der Satz zeigt nicht, warum die Antwort der Psyche schwer zu hören ist. Dazu kommen ein schweres Wort für die Stimme und ein umstrittener Beleg (F25). −18 Wörter. Die Station endet auch ohne ihn mit Hoffnung („most mental illness can probably be cured“). Die [prüfen]-Marke entfällt mit dem Satz und bleibt im Faktencheck von text-v2 als gestrichen vermerkt.
2. **K2 · [pause] vor dem Disclaimer streichen** (L13, 1:08). Die Pause gibt dem Satz mehr Gewicht, als er braucht, und bremst kurz nach Minute 1. „This isn't about whether to buy the stock.“ bleibt.
3. **K3 · Abo-Aufrufe straffen, Mission bleibt** (L44, L101):
   - Mitte: „This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. In the lab, and at the hospital bed, for your parents, and one day for you. Want that too? Then subscribe.“ (51 → 37 Wörter; die Rede von „first date / second date“ entfällt, weil die Begriffe dort ohne Anker stünden).
   - Schluss: „This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. Fast discoveries in the lab, and proof that arrives in time, for every family in a waiting room today. Including yours. Want that too? Then subscribe.“ (48 → 42).
   - Beide behalten Mission und Frage, kein Spendenaufruf. Der QR läuft je ~25 s und ist vor dem Endbild weg.
4. **K4 · Zitatkarte C1b kürzen** (L90): „I think if we do this right, we can create an age of miracles.“ (27 → 14 Wörter). Die Bedingung ist der Punkt; „problems that have eluded us for millennia“ ist vorgelesen nur Pathos. Die Karte zeigt den Satz mit „…“ am Ende. clips.json nennt diese Kurzfassung schon.
5. **K5 · Labor-Staunen** (2:03–2:23): Die Zahl gehört ins Bild (Haken-Varianten im Sekundentakt, Einblendung „CAR-T DESIGN STEP ≈ 70 % SHORTER · PRECLINICAL“), der Satz wird kürzer (L25 in M2). Wer mehr Staunen will: F11 (Kapsid in unter einer Stunde, fast Atom für Atom, ohne Modellnamen) als Reserve. Nicht eingebaut, weil der Film schon an der Wortgrenze ist.
6. **K6 · Echo nach C3** (L19, „Much faster. But not infinitely fast.“) beim Schnitt prüfen. Wirkt die Wiederholung direkt nach Darios O-Ton doppelt, streichen (−6 Wörter). Für die Kokoro-Hörfassung bleibt es drin.
7. **K7 · [prüfen] nachtragen** für die umstrittenen Faktenzettel-Punkte, die v1 nur in der Faktencheck-Liste hatte: Topol (F30, 6:45), X-Post August (F8, 7:00), FDA-Prioritätsprüfung (F35, 8:33).
8. **K8 · Ohr, klein:** L85 „Fewer people on a placebo …“ → „Fewer people on a sugar pill …“ (dasselbe Wort wie bei 4:25 und 8:16); „accepts it for certain measurements“ → „accepts it for some trials“.
9. **K9 · Dritter echter Clip, falls C5 zur Karte wird:** Dann hat der Film nur zwei echte Clips (§7: 3–6). Reserve: C7 (Ricks, NVIDIA-Kanal, grün) in Station 6 an Stelle des Topol-Satzes, Stelle per Whisper; sonst entscheidet der Koordinator. Am Text ändert sich nichts: Die Einleitung „named the slow part:“ und der Satz danach tragen beide Fälle.

Nicht übernommen: „Picture someone you love …“ (7:52) direkt ohne „Picture“ zu beginnen. Es ist eine Szene von heute und kein Zukunftsszenario (§3.6), und „Picture“ spiegelt das „Now picture your grandkids“ aus dem Hook.

---

## 5 · Payoff-Check §6

**6.1 Titel-Einlösung ✓.** Der Satz fällt bei 0:00, die Karte bei 0:50 ist der Satz selbst, wer und wo folgt bei 0:59, die Frist als Jahr bei 1:48 (v2: 1:46). Danach bleibt der Film beim Versprechen: Jede Station misst sich daran.

**6.2 Nach dem Film weiß ich, dass …**
1. … Dario Amodei, Chef von Anthropic, im Verkaufsvideo zum Börsengang gesagt hat, Krebs, Alzheimer, Herzkrankheit und psychische Krankheit seien in weniger als zehn Jahren Geschichte, und dass sein eigenes Essay von 2024 vorsichtiger war: „most cancer“, und Alzheimer-Schäden seien vielleicht „very difficult to reverse“. *(Akt 1)*
2. … Studien laut Dario vor allem deshalb langsam sind, weil die meisten Mittel kaum wirken. Was stark wirkt, ist schnell bewiesen: Für eine Zulassung reichten 55 Patienten. *(Akt 1/Krebs)*
3. … jede Krankheit ihr eigenes Tempo hat:
   - Krebs antwortet im Scan nach Wochen.
   - Das Herz antwortet zweimal: Das Cholesterin ist nach Wochen halbiert, aber eine Genänderung wird bis zu 15 Jahre nachbeobachtet.
   - Die Psyche antwortet leise: Nur etwa die Hälfte der Studien zugelassener Antidepressiva schlug die Zuckerpille, und es gibt keinen Bluttest.
   - Alzheimer antwortet in Jahrzehnten: Die Veränderungen beginnen ~20 Jahre vor dem ersten Symptom.
   *(Akt 2)*
4. *(letztes Drittel)* … selbst Anthropics eigenes Medikament diesen Weg geht: in unter 18 Monaten von der Idee zu Mausdaten, am Menschen frühestens Ende 2028. Und Dario warnt selbst vor einem Stau bei der Zulassung. *(Akt 3)*
5. *(letztes Drittel)* … sich das zweite Datum vorziehen lässt, ohne Medizin unsicherer zu machen: Bluttest und Vorbeugestudien, digitale Zwillinge statt eines Teils der Placebo-Gruppe, Prüfung mit KI-Hilfe für einige Prioritäts-Mittel in ein bis zwei Monaten. Entscheiden müssen Kliniken, Forschende und Gesetzgeber. *(Lösung)*

Fünf Punkte, zwei im letzten Drittel. Die Punkte 1, 3 und 4 gehen über Artikelwissen hinaus. → **fertig im Sinn von §6.2.**

**6.3 Kenner-Test ✓.** Wer die Berichte zur Roadshow kennt (Business Insider: „Doctors aren't buying it“, Reaktions-Shorts), kennt den Satz und die Gegenstimmen. Neu für ihn sind:
- die zwei Daten als Werkzeug für jede künftige Schlagzeile
- die vier Antwortzeiten mit je einem Beleg
- Darios Kleingedrucktes von 2024 neben dem Satz von 2026
- dass sein eigenes Medikament und sein eigener „jam“ das Argument stützen
- konkrete Wege, das zweite Datum vorzuziehen

Die Gegenstimmen sind offen zugeschrieben und keine eigene Enthüllung ✓.

**6.4 Zweifel dosiert ✓ (mit M1).** Fairness-Sätze stehen bei 1:12, 1:21, 4:47, 7:00, 7:26, 8:44 und 8:52, jeder ein Satz, danach ein Urteil (die Tafel). In v1 standen in Station 6 drei Einwände direkt hintereinander (Nobelpreisträger, Topol, Lilly). M1 lässt zwei und schließt mit einem Urteil („Discovery speeds up. Proof jams.“).

**6.5 Rat sagt, wovor er schützt ✓.** Es gibt keinen Gesundheits- oder Finanzrat. Die Lösungen sagen, was sie leisten: „the slowest proof gets a head start“, „Fewer people on a sugar pill, answers sooner“, „fast can't mean less safe“.

**6.6 Staunen-Probe ✓ mit Hinweis (K5).**
- Minute 1: Die Enkel hören „Alzheimer's“ wie „plague“ (0:13); der Kernsatz (0:31).
- Akt 1: „Trials are slow … because most drugs barely work“ (1:21).
- Krebs: eine Pille, 55 Patienten, viele Krebsarten (2:33). Das Labor-Staunen davor ist schwach.
- Herz: eine Infusion fürs Leben (3:13–3:27), der stärkste Moment.
- Psyche: Nur die Hälfte schlägt die Zuckerpille (4:35).
- Alzheimer: zwanzig Jahre vor dem ersten vergessenen Namen (5:17).
- Akt 3: von der Idee zur Maus in unter 18 Monaten (7:10); der Bluttest Jahre früher (7:52).

---

**Zeile für Jakob (nach Einarbeitung):** Regel-Check: 8/9. Abweichung: §5.1, 1,6 Zahlen pro Minute (→ M2, jetzt ≈ 1,2). Außerdem:
- Station 6 war eine Stimmen-Liste (→ M1).
- „left that out“ bezog sich auf das ganze Video, jetzt nur auf den zitierten Satz (→ M3).
- Der Schlusssatz hing an „This week“ (→ M4).
- Vier Stellen waren ohne Bild unklar (→ M5).

`regel_check.py`: 0 Hinweise (v1 und v2).
