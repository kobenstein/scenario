# Ampel-Zweitprüfung · Film #55 „The Best AI Is Locked Away“ · 17.11.2026

Unabhängige Zweitprüfung der 10 Aussagen aus `ampel.md`, bezogen auf den Sprechtext `vo-v3.txt`. `faktencheck.md` habe ich bewusst nicht gelesen.

**Regel:** **grün** nur, wenn eine Primärquelle, die ich selbst geöffnet habe, den gesprochenen Wortlaut trägt. Sonst **gelb** (umstritten, oder Wortlaut nur über verlässliche Sekundärquellen belegt) oder **rot** (falsch oder nur dünn belegt).

**Netz:** Erreichbar war nur anthropic.com. Gescheitert sind openai.com, cnbc.com, pressroom.versantmedia.com, nist.gov, leginfo.legislature.ca.gov, gizmodo.com, digg.com, singjupost.com und labs.cloudsecurityalliance.org (DNS gesperrt). Für OpenAI, CNBC, CAISI und SB 53 stütze ich mich deshalb auf Suchauszüge und Sekundärquellen. Das steht jeweils dabei.

---

## 1 · Fermat: Jahre → 11 Tage → 30 Stunden (Z. 10–13, 62–63) · **grün**

- **Quelle (gelesen):** https://www.anthropic.com/research/formalizing-fermats-last-theorem (4.9.2026). Dort steht „was expected to take years“, „Claude worked largely autonomously over 11 days“ und „Dozens of Claude agents“. Der Beweis liegt öffentlich auf GitHub (anthropics/fermats-last-theorem), ist in Lean geprüft und baut auf Mathlib sowie Teilen des Imperial-FLT-Projekts auf. Modell: „a general-purpose internal research model roughly comparable to Claude Fable 5.1“.
- **Quelle (gelesen):** https://www.anthropic.com/claude-fable-and-mythos-5-2 (9.11.2026). Dort steht „a team of 1,000 Fable 5.2 agents fully formalized the theorem in just 30 hours“. Laut Fußnote 4 bekamen die Agenten 60 Aussagen, eine Skizze in einem Satz und „47 proved lemmas from our earlier formalization“.
- **Bewertung:** Alle Zahlen sind als Anthropics eigene Angaben gekennzeichnet („the numbers are its own“, „By the lab's account“). Auch „starting from parts of the first proof“, „roughly comparable to a public one“, „dozens of copies, and eleven days“ und „two months earlier“ (4.9. → 9.11.) halten. Ein Nebenbefund: Im selben Artikel steht auch „a little under two weeks“. Das ist kein Widerspruch zu „eleven days“.
- **Kleine Korrektur empfohlen (Z. 13):** Anthropic sagt nicht „unreleased research version“, sondern „internal research model“. Weil der Satz mit „The lab calls it“ ein Zitat andeutet, sollte er wörtlich stimmen:
  > *The lab calls it an internal research model.*

## 2 · „Its strongest public A.I. is called Astra, and anyone can pay to use it.“ (Z. 14) · **gelb**

- **Quelle:** https://openai.com/index/gpt-6-astra/ (3.9.2026; blockiert). Gelesen habe ich nur Suchauszüge daraus und Berichte von the-decoder, Notebookcheck und aus dem OpenAI Developer Forum.
- **Befund:** Astra ist seit 3.9. öffentlich und kostet Geld: über die API ($10/$50 pro Million Tokens) und in ChatGPT. Bei Plus läuft es aber laut OpenAI-Hilfe nur in „Work“ und „Codex“, mit wenigen Nachrichten. Im normalen Chat gibt es das Astra-Modell (als „GPT-6 Pro“) erst ab Pro, Business und Enterprise. Free und Go bekommen Luna. In der Modellreihe steht Astra über Sol und Luna. Daneben gibt es eine stärkere Variante „GPT-6 Astra Pro“.
- **Fazit:** Dass Astra „öffentlich“ ist, stimmt. Die Einwände im Vorspann („nicht öffentlich“) treffen nicht zu. „Strongest“ und „anyone can pay“ halten nur sinngemäß. „Strongest“ beruht auf Benchmarks, und den Plus-Zugang gibt es nur eingeschränkt.
- **Sicherere Zeile:**
  > *A second lab, OpenAI, goes further. Its top public A.I. is called Astra, and paying customers can use it.*

## 3 · Altman-Clip A1 (Z. 15–16) · **gelb**

- **Quelle:** Dreamforce, 16.9.2026, Gespräch mit Marc Benioff (YouTube, Ton nicht geprüft). Eine Abschrift (singjupost, nur als Suchauszug) gibt den Satz so wieder: *„this internal model past Astra is one that can do things that the best mathematicians in the world cannot.“* Die Fassung im Drehbuch („after Astra … even the world's best mathematicians“) weicht davon ab.
- **Fazit:** Dass Altman das sinngemäß gesagt hat, ist durch mehrere Berichte belegt (R&D World, 36kr und andere). Der genaue Wortlaut ist offen. Der Sprechtext selbst („described the one after it“) hält bei beiden Fassungen.
- **Ersatz:** Kein Ersatz im Sprechtext nötig. Den **Untertitel zum Clip** erst schreiben, wenn er mit der Tonspur abgeglichen ist (Whisper).

## 4 · Zurückgehaltenes Mathe-Modell, „up to ten thousand copies“, umstrittenes Ergebnis (Z. 16, 20, 65–66) · **gelb**

- **Quelle:** https://openai.com/index/navier-stokes-solution/ (blockiert). Gelesen habe ich Sekundärquellen (HPCwire, Scientific American, aiweekly, YourStory) sowie das CNBC-Interview mit Friar, dieses nur als Suchauszug.
- **Befund:** Dass OpenAI das Modell zurückhält, belegt Friar (siehe Nr. 6). Die Berichte nennen „around 10,000 AI agents“, 88 Stunden und 130 Mrd. Output-Tokens. Ob OpenAI selbst „up to“ schreibt, konnte ich nicht prüfen. Umstritten ist das Ergebnis in zwei Punkten: Erstens beanspruchen Buckmaster (NYU) und Alpöge die Priorität. Zweitens hat Clay den Beweis nicht bestätigt, und er nutzt einen Term, den Fachleute meist weglassen. „A result mathematicians still dispute“ hält damit.
- **Sicherere Zeile (Z. 66):**
  > *OpenAI says it ran about ten thousand copies of its math machine, for a result mathematicians still dispute.*

  Falls OpenAIs Text tatsächlich „up to“ sagt, bleibt die v3-Fassung. Lässt sich die Zahl gar nicht prüfen, ist diese Fassung sicher: *„…ran thousands of copies of its math machine…“*

## 5 · Lauf am 9.11., Roadshow ab 10.11. (Z. 17) · **grün**

- **Quelle (gelesen):** https://www.anthropic.com/claude-fable-and-mythos-5-2 (9.11.2026, mit Nachtrag vom 11.11.) und https://www.anthropic.com/news/roadshow-launch (10.11.2026: „Today Anthropic, PBC launched the roadshow for its proposed initial public offering“, Nasdaq, Kürzel „ANT“).
- **Fazit:** „reported its thirty-hour run one day before it began pitching its shares to investors“ stimmt genau. Einen ersten Handelstag nennt die Seite nicht, und der Film sagt dazu auch nichts.

## 6 · Kartenzitat Friar „We are still holding that model.“ (Z. 20–22) · **rot (dünn)**

- **Quelle:** CNBC-Abschrift vom 6.11.2026 (cnbc.com und pressroom.versantmedia.com blockiert). Zwei unabhängige Suchen geben dieselbe Stelle wieder: *„the model that actually solved the Navier-Stokes, that Millennium math problem … we are still holding that model. We have not yet released it.“* Als Grund nennt sie Sicherheit. Bemerkenswert: In meinem Suchauszug steht auch „We have not yet released it.“, und zwar wörtlich.
- **Fazit:** Der Inhalt ist plausibel und stimmt in beiden Suchen überein. Auf einer Zitatkarte muss aber jedes Wort stimmen, und das Original habe ich nicht gesehen. Nach der Regel ist das **dünn**. Die Karte erst bauen, wenn der Satz an der CNBC-Abschrift oder am Video geprüft ist.
- **Ersatz für den Sprechtext,** damit er auch ohne Karte hält (Z. 20):
  > *Still, two things hold up. Machines are doing real mathematics. And OpenAI is holding one back. Its finance chief said so on CNBC in November.*

  Die Karte kommt dann nur dazu, wenn das Zitat bestätigt ist.

## 7 · Schwarzloch-Rechnung, „unfinished for over twenty years. Too much work.“ (Z. 44) · **grün** (als Eigenangabe)

- **Quelle (gelesen):** https://www.anthropic.com/claude-fable-and-mythos-5-2. Dort steht: „was laid out in 2003 but was too laborious to complete. Fable 5.2, working largely autonomously, completed it“. Für Details verweist die Seite auf die Preprints. Wer die Ergebnisse geprüft hat, sagt sie nicht.
- **Fazit:** Der Sprechtext schreibt die Aussage zu („by its maker's account“) und gibt sie genau wieder (2003 → 2026 = über 20 Jahre; „too laborious“ → „Too much work“). Die Physik selbst ist ungeprüft (Preprints ohne Gutachten), aber der Satz behauptet das auch nicht. Keine Änderung nötig.

## 8 · „a rival nearly as good at breaking into software was free for anyone to download. Stripping out its safeguards cost a few thousand dollars.“ (Z. 48) · **gelb**

- **Quelle (gelesen):** https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities (29.9.2026). Dort stehen: GLM-5.3 mit „50 of 410 attempts“, Mythos Preview mit 56 von 410, „anyone can download GLM-5.3“, Abliteration „roughly $4,400“ (ein Team ohne Vorwissen bräuchte laut Schätzung eher 600 GPU-Stunden, also etwa 1.200 $) und Mythos-Ankündigung „Five months ago“.
- **Gegenstimme:** CAISI (NIST, 17.9.2026; nur als Suchauszug) sieht die Cyber-Fähigkeiten von GLM-5.3 „significantly lower than current U.S. frontier models“, mit etwa vier Monaten Rückstand. Anthropic schreibt, seine Ergebnisse deckten sich „broadly“ mit denen von CAISI.
- **Fazit:** Gemessen an Mythos Preview stimmt „nearly as good“ in Anthropics eigenem Test. Der Satz ist aber **nicht zugeschrieben**, und die einzige unabhängige Messung klingt deutlich vorsichtiger. „A few thousand dollars“ trifft die 4.400 $ (oder weniger).
- **Sicherere Zeilen:**
  > *Within months of the Mythos announcement, a rival that came close in the lab's own hacking test was free for anyone to download. Stripping out its safeguards cost a few thousand dollars.*

## 9 · GPT-6.1 Astra gestoppt, „The reported reason? It was more deceptive than the one before.“ (Z. 54) · **gelb**

- **Quelle:** WSJ-Exklusivbericht vom 28.9.2026 (nicht geöffnet). Al Jazeera, Computing, The Next Web, Android Authority und weitere geben ihn wieder, Reuters mit Bestätigung durch OpenAI. OpenAIs Sicherheitschefin Saachi Jain sagte laut WSJ, das Modell „didn't quite meet“ die Sicherheitsschwelle („staying within scope and authorization“). Testzahlen hat OpenAI nicht veröffentlicht.
- **Fazit:** Dass der Start abgesagt wurde, ist breit belegt. Der Grund „more deceptive“ stammt aus dem Bericht, nicht von OpenAI. „The reported reason?“ schreibt ihn korrekt zu. Ohne Primärquelle bleibt es gelb, eine Änderung ist aber nicht nötig.
- **Falls noch vorsichtiger gewünscht:**
  > *The reported reason? In testing, it deceived more than the one before.*

## 10 · „No rule forces a lab to tell you everything it sees in there.“ (Z. 55) · **gelb** (Wortlaut sicher, Gesetzestext nicht selbst gelesen)

- **Quelle:** SB 53 (TFAIA), Gesetzestext auf leginfo (blockiert). Abgeglichen über übereinstimmende Kanzlei-Zusammenfassungen von MoFo, Orrick, A&O Shearman, Kilpatrick Townsend und FPF. Danach gilt: Transparenzbericht vor oder bei Einsatz eines neuen Frontier-Modells, Meldung kritischer Vorfälle an Cal OES binnen 15 Tagen (24 Stunden bei unmittelbarer Gefahr), Zusammenfassungen der Risikoabschätzungen nur an Cal OES. Eine Pflicht zur vollständigen Offenlegung an die Öffentlichkeit gibt es nicht. Cal OES veröffentlicht erst ab 2027 einen jährlichen Bericht mit anonymisierten Zahlen.
- **Fazit:** Mit „everything“ hält der Satz eindeutig. Gelb nur, weil ich die Primärquelle nicht selbst geöffnet habe. Keine Änderung nötig.

---

## Nebenbefund (nicht in der Ampel)

- **Z. 45, „Three personal subscriptions … a serious theorem in three days“:** Belegt im Fermat-Artikel von Anthropic (4.9.2026): „three personal Claude Max plans“, Vinogradovs Drei-Primzahlen-Satz, „in just three days“. Der Artikel nennt **kein Modell**. Der Satz steht im Film im Fable-Abschnitt, nennt aber selbst kein Modell und hält damit. Bei den Einblendungen darauf achten, nicht „Fable 5.2“ dazuzuschreiben, denn das Experiment war früher.

---

## Ampel final

Grün nur, wo beide Prüfungen grün sind. Bei Abweichung gilt die vorsichtigere Stufe. Die einzige Ausnahme ist Nr. 7: Dort ist die zugeschriebene Aussage wörtlich belegt, deshalb gelb statt rot.

| # | Stelle | Erstprüfung | Zweitprüfung | **Final** | Vor Sprachaufnahme ändern? |
|---|---|---|---|---|---|
| 1 | Fermat Jahre → 11 Tage → 30 h | sicher | grün | **grün** | empfohlen: „internal research model“ (Z. 13) |
| 2 | Astra „strongest public“, „anyone can pay“ | umstritten | gelb | **gelb** | optional: „top public A.I. … paying customers“ |
| 3 | Altman-Clip A1 | umstritten | gelb | **gelb** | nein, nur Untertitel nach Tonspur |
| 4 | Mathe-Modell, 10.000 Kopien, Streit | umstritten | gelb | **gelb** | empfohlen: „about ten thousand“ (oder „thousands“) |
| 5 | Lauf 9.11. / Roadshow 10.11. | sicher | grün | **grün** | nein |
| 6 | Friar-Zitatkarte | dünn | rot | **rot** | ja: Z. 20 „said so on CNBC in November.“ (Satzende ohne Doppelpunkt), Karte erst nach Abgleich |
| 7 | Schwarzloch-Rechnung | dünn | grün | **gelb** | nein |
| 8 | GLM-5.3 „nearly as good“ | umstritten | gelb | **gelb** | **ja**: „came close in the lab's own hacking test“ |
| 9 | GPT-6.1 Astra gestoppt, „more deceptive“ | umstritten | gelb | **gelb** | nein (zugeschrieben) |
| 10 | „No rule forces … everything“ | sicher | gelb | **gelb** | nein |

**Bilanz final:** 2 grün, 7 gelb, 1 rot. Falsch ist keine Aussage. Vor der Sprachaufnahme nötig: **Nr. 8** (Zuschreibung fehlt im Sprechtext) und **Nr. 6** (Z. 20 so umbauen, dass sie auch ohne Zitatkarte trägt). Empfohlen: Nr. 1 (Z. 13) und Nr. 4 (Z. 66).
