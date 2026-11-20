# Kritik v1 · „The Best AI Is Locked Away“ (Film #55, 16.11.2026)

Geprüft: `vo-v1.txt` (1.459 Wörter), `text-v1.md`, `hook-v1.md`, `clips.json`, gegen `geruest-v1.md` (mit „Jakob 16.11. 11:28“), `faktenzettel.md` und `schreibraum/REGELN.md` (Stand 16.11.). `regel_check.py` ist gelaufen: 14 Hinweise, alle Fehlalarm wegen „A.I.“; mit „AI“ 0. **Zeilennummern = Zeilen in `vo-v1.txt`.** Zeiten wie in text-v1 (2,5 Wörter/s).

**[P]** heißt: aus Primärseiten, die ich heute im Original gelesen habe (drei Anthropic-Seiten, URLs in Abschnitt 9), dazu die Fermat-Zeilen der Rohrecherche und der Paralleltext #31 (`film-ai-2027/vo-v1.txt`). Das steht **nicht im Faktenzettel**. Die Recherche muss es nachtragen und gegenprüfen, bevor der Texter es benutzt.

Alle Ersatzzeilen habe ich in eine Kopie eingesetzt und gemessen: 1.492 Wörter, Ende 10:25, Prüfskript 0 Hinweise (Schreibweise „AI“), „subscribe“ 2×, Minute 1 mit einer Frage und einer Zahl, Hauptfrage zurück bei 8:18 (80 %), Antwort ab 8:27 (81 %). Die Kopie liegt nicht im Projekt, alle Sätze stehen hier. 1.492 ist zu lang, die Kürzungen stehen in Abschnitt 2.

Befangenheit: Diese Kritik läuft auf Fable 5.2, also auf dem Modell, um das der Film kreist. Ich empfehle unten, zwei Ergebnisse genau dieses Modells zu zeigen. Darum jede dieser Stellen nur als Eigenangabe des Labs, erst nach Gegenprüfung, und zusammen mit den Gegengewichten aus Änderung 1e und 5.

**Note v1: 6/10. Regel-Check v1: 3 von 9 bestanden (§5 mit Auflagen, §7 unter Vorbehalt, §8). Nicht bestanden: §1 (1.1, 1.2), §2 (2.2, 2.5, 2.5b), §3 (3.1, 3.3, 3.3a, 3.8), §4 (Zeile 30–50 s), §6 (6.1, 6.4, 6.5). §9 nicht prüfbar.**

## Gesamturteil

1. **Das Handwerk ist gut.** Sätze fürs Ohr (Ø 8,1 Wörter), jede Eigenangabe hörbar zugeschrieben, 16 unsichere Stellen ehrlich markiert, Bann-Liste 0, beide Abo-Aufrufe richtig. Diese Zeilen müssen bleiben: „Not you. Not yet.“ (L28), „Found is not yet fixed.“ (L41), „It buys time. Use yours.“ (L60), „Permission. And power.“ (L68), der Kernsatz (L73).
2. **Aber es sind zwei Filme.** Jakobs Frage (Wissenschaft, „wie viel stärker?“) steht in Platz 1 und in der großen Antwort: 190 Wörter, 13 %. Dazwischen liegt der alte Mythos-Film über Zugang, Lücken und Aufsicht: 753 Wörter, 52 %, von 2:39 bis 8:16. Die Schärfung von 11:28 wurde vorn und hinten angesetzt. Die Mitte arbeitet nicht für die Frage.
3. **Der Wissenschafts-Kern steht auf einem einzigen, verkürzten Satz (S6).** Drei Zeilen überleben den Faktencheck so nicht (L12, L15, L65). Dieselben Primärseiten enthalten zugleich das beste Material für diesen Film (Änderung 1 und 3). Das ist kein Fehler des Texters: Der Faktenzettel entstand vor Jakobs Schärfung und wurde danach nicht nachrecherchiert.
4. **Als Zuschauer steige ich an fünf Stellen aus:** 0:34–0:57, 1:40–2:08, 2:39–3:58, 6:04–7:26, 7:52–8:16 (Abschnitt 3).
5. **Fairness:** insgesamt ausgewogen. Drei Stellen sind zu weich zu Anthropic (L23–L32, L40, L46–L47), zwei sind härter als die Quelle (L15, L49).

Nicht hörfassungsreif. Reihenfolge: Faktenzettel-Nachtrag, Hook-Entscheidung, dann Text v2.

---

## 1 · Die fünf wichtigsten Änderungen

### 1 · Fermat: Faktenzettel nachtragen, dann wird das Beispiel zur Achse des Films (L11–L12, L15, L65–L67, L70)

**Problem.** Der Faktenzettel hat zu Fermat einen Satz (S6, zitiert von der Seite vom 9.11.). In der Rohrecherche stand noch „mit Harness und Anleitung durch einen Forscher“ (Z. 247); das fiel weg. Auf den Primärseiten steht **[P]**:

- **4.9.:** Anthropic veröffentlicht den Elf-Tage-Lauf („the first complete computer-checked proof“). Erwartet wurden Jahre. Dutzende Agenten, eine eigens gebaute Plattform, gelegentliche Hinweise eines Forschers, rund sechs Milliarden Ausgabe-Tokens. Das Modell nennt das Lab selbst „roughly comparable to Claude Fable 5.1“. Der Beweis liegt offen auf GitHub, ein Mathematiker von außen (Kevin Buzzard) hat ihn begutachtet.
- **9.11.** (Fußnote ergänzt am 11.11.): 1.000 Agenten des **öffentlichen** Fable 5.2 schaffen dasselbe in **30 Stunden**, mit einem Drittel der Tokens. Sie bekamen ein Startpaket, darin 47 Lemmata aus dem ersten Beweis. Ein Lauf pro Modell. Das Alltagsmodell Opus 5.5 blieb mit demselben Aufbau bei 26 % stehen.

Folgen für v1:

- **L11** erzählt einen überholten Stand (§2.5b), und ohne Maßstab. „In eleven days“ wirkt nicht, solange niemand weiß, dass Jahre erwartet wurden. hook-v1 notiert das selbst bei Variante C.
- **L12** „You can't use the A.I. that did it“ stimmt wörtlich und führt in die Irre: Das Lab nennt diese Maschine selbst etwa so stark wie ein öffentliches Modell, und das öffentliche hat es inzwischen schneller geschafft. Genau das schreibt der erste Kenner in die Kommentare. Und es ist die Titel-Einlösung des Films (§6.1).
- **L15** „published its claim one day before it began pitching its shares“ ist für die elf Tage falsch (4.9.). Richtig ist der Satz nur für den 30-Stunden-Bericht (9.11., Roadshow 10.11.).
- **L65** nimmt den Elf-Tage-Lauf als Beispiel für „newer“. Er belegt eher „bigger“.
- **L66–L67:** Die zweite Form hängt allein an OpenAIs unbestätigtem Anspruch. „It takes a data center, not a subscription“ hat keine Quelle (eigener Vermerk Nr. 16), und dieselbe Anthropic-Seite hält dagegen: Mit drei persönlichen Abos entstand ein kleinerer Beweis in drei Tagen.
- #31 erzählt in derselben Woche das vollständige Paar (dort L20–L22).

**Die Chance.** Dieses eine Experiment beantwortet Jakobs Frage aus einer Primärquelle, und zwar in beiden Formen:

- *größer:* dasselbe käufliche Modell, tausend Kopien;
- *neuer:* im August nur drinnen, im November mit dem käuflichen Modell. Das ist der Beleg für „three to six months“ und für den Kernsatz.

**Vorschlag.**

a) Recherche trägt S6a–S6c nach (Abschnitt 9) und prüft die Wortlaute.

b) Platz 1, erst der Maßstab, dann die Zahl (ersetzt L10–L12):

> [curious] At the very front stand the people who built it.
>
> The proof of Fermat's Last Theorem is among the most famous in all of mathematics. To write it out so strictly that a computer can check every line, mathematicians expected to need years.
>
> A lab's machines did it in eleven days. Then, this fall, in thirty hours.
>
> The lab is Anthropic, and the stopwatch is its own. But the first proof is public, and any computer can check it.
>
> And the machine that wrote it? You can't use it. The lab calls it an unreleased research version.

Im Bild: „11 DAYS → 30 HOURS“, damit die Ernte in Minute 8 sitzt.

c) Große Antwort: erst die Enthüllung, dann die Frage, dann die zwei Formen (ersetzt L64–L67):

> [thoughtful] So what is in that room? One clue was in plain sight all along.
>
> Remember Fermat? Eleven days, then thirty hours. No locked machine did that thirty-hour run. By the lab's account, it was the model anyone can buy. A thousand copies of it, working side by side.
>
> And the first machine, the one you can't use? The lab itself calls it roughly comparable to one of its public models. What it had was dozens of copies, and eleven days.
>
> [pause] So if the machines are already doing mathematics, how much stronger is the A.I. you're not allowed to use? Stronger in two ways.
>
> The first is newer. Labs work with their models for months before you get a version. OpenAI is still holding its math model. How much newer? Nobody outside can measure it.
>
> The second is bigger. One copy answers your bank letter. A thousand write out Fermat. OpenAI says its math model ran as up to ten thousand, for days. Mathematicians haven't confirmed that result, and they're still arguing. But the method is plain. That is not a smarter machine. It is more of it than any subscription gives you.

L68 bleibt wörtlich.

d) T5 bekommt seinen Beleg (ersetzt L70):

> So what a lab shows off today is a preview of your own tools. In August, only a machine inside the lab had written out Fermat. By November, the one you can buy did it faster. Three to six months is a fair estimate. That gives you a season to plan your work around it, instead of a surprise.

e) Gegengewichte, damit das keine Werbung wird: „the stopwatch is its own“, „by the lab's account“, der Roadshow-Satz am richtigen Bericht (Änderung 3a). Im Bild beim 30-Stunden-Lauf: „single run · started with notes from the first proof“. Option für Platz 1 (+17 Wörter): „Two days later, it added a footnote. The machines had started with notes from the first proof.“

f) Mit #31 klären, wer Fermat behält. Für #55 ist es die Achse, für #31 ein Beispiel von mehreren. Ersatz, falls #31 es behält: Abschnitt 7, Reserve.

### 2 · Hook 0:34–0:57: nicht entschärfen, nicht aufzählen (L7–L10)

**Problem.** 0:00–0:30 trägt. Dann, im teuersten Fenster (§4, 30–50 s):

- **L7** beantwortet die Frage halb und nimmt ihr die Luft. 34 Sekunden nach dem Titel höre ich „it's the same model“. Das klingt wie ein Widerruf von 0:16 („never sits in your pocket“; hook-v1 sieht das selbst) und widerspricht der eigenen Antwort am Ende („newer“). S4 gilt nur für Fable und Mythos. „With doors that stay shut“ versteht man ohne Bild nicht.
- **L8** zählt alle fünf Plätze auf. Das ist eine Inhaltsangabe im Muster „first … then“ (§4, verboten in Minute 1; §3.3a). Sie verbraucht die Enthüllungen „Second in line? The government.“ (L27) und „Third come the giants.“ (L28). hook-v1 nennt genau das als Schwäche von Variante B.
- **L9** ist ein Wegweiser.
- Jakobs Wissenschaft kommt in Minute 1 nicht vor.

Gegentest (d): Bei 0:45 habe ich einen schwächeren Grund zu bleiben als bei 0:30. Die Frage ist entschärft, die Schlange schon erzählt.

**Vorschlag (ersetzt L7–L10; 72 → 42 Wörter; Platz 1 beginnt bei 0:47 statt 0:58):**

> And it doesn't stop at code. Behind that door, the machines have started doing mathematics. Not sums. Proofs.
>
> There's a line for that door. And you're not at the front. You're fifth.
>
> [curious] At the very front stand the people who built it.

- Der erste Fakt nach der Frage ist Jakobs Thema. Der erste Gewinn ist „You're fifth“, und er öffnet „wer sind die vier?“.
- „same model“ wandert nach Platz 5 (dort ist es die Auflösung) und in die große Antwort.
- Fürs Prüfskript: „eleven“ erst nach Wort 145.
- Das weicht vom freigegebenen Gerüst-Hook ab („dasselbe Modell“ als erster Gewinn). Jakob entscheidet.

Kandidat für den Hook-Schritt, erst nach Nachtrag **[P]**: Jakobs Vordersatz als Beweis vor der Frage (ersetzt L3–L6).

> This fall, a machine anyone can buy finished a calculation about black holes that physicists had left unfinished for twenty years. And that is the one they released. So how much stronger is the A.I. you're not allowed to use?

### 3 · Jakobs Schwerpunkt: ein echter Fund des neuesten Modells, und Platz 1 behält sein Staunen (L13–L21, L46–L47)

**Problem.**

- Im ganzen Film steht **ein** wissenschaftliches Ergebnis (Fermat), und das ist nach Anthropics eigenen Worten Prüfung, keine neue Mathematik. Dazu zwei Behauptungen (Altman L14, Schwarm L66). Es fehlt jedes Ergebnis des neuesten Modells, das der Zuschauer selbst nutzen kann, obwohl Platz 5 von genau diesem Modell handelt. Jakobs Satz beginnt aber mit „Wenn die neuesten Modelle Wissenschaft machen …“.
- Platz 1 nimmt sein Staunen zurück: 21 Sekunden Wunder (1:03–1:24), danach 28 Sekunden Zweifel (L15–L16, 59 Wörter) ohne Urteil. „Claims, then.“ wischt beide Funde weg (§6.4).
- „Consider the source, both times“ stellt einen offen liegenden, maschinengeprüften Beweis neben einen Bühnensatz.
- **L16** „on the record“: Friars Satz belegt, dass ein Modell zurückgehalten wird, nicht wie stark es ist. Ihr Interesse (Finanzchefin, Anleger) fehlt, während L15 es bei allen anderen nennt (§1.9a).
- **L19** „None of this is hidden“ widerspricht L52 und L54 (keine Offenlegungspflicht, geschwärzte Belege). M1 sagt: Zugang und **Teile der Belege**.
- **L20** ist der Hook-Fakt von #31 (dort L3–L4, samt „successor“), der längste Satz des Films, und keine Wissenschaft.
- **A1:** Satz 1 („Astra was a bit better“) hängt an einem Vergleich, den der Zuschauer nicht gehört hat. L13 „what comes next“ stimmt nicht: Altman beschreibt ein vorhandenes internes Modell.
- Zwischen 0:30 und 2:32 öffnet sich keine neue Frage (§3.3).

**Vorschlag.**

a) Zweifel bündeln, mit der Prüfer-Frage aus L55 als Werkzeug, dann urteilen (ersetzt L13–L20; L20 entfällt):

> A second lab, OpenAI, goes further. Its public model is called Astra. On stage, its chief executive, Sam Altman, described the one after it:
>
> [CLIP A1: "And this internal model after Astra can do things that even the world's best mathematicians cannot."]
>
> [thoughtful] So ask the inspector's question. Who checked it from outside? For that claim, nobody can yet. The model is locked, and OpenAI itself says outside mathematicians cannot reproduce its work.
>
> And both labs are worth more, the further ahead they look. Anthropic reported its thirty-hour run one day before it began pitching its shares to investors.
>
> So here is what holds up. Machines are doing real mathematics. And OpenAI is holding a model back. Its finance chief said so in November:
>
> [QUOTE CARD: Sarah Friar, CFO, OpenAI · CNBC, Nov 6, 2026]
>
> "We are still holding that model. We have not yet released it."
>
> [pause] So the best A.I. is not hidden. It is announced, out loud. What's locked away is the access. And some of the evidence.

L21 bleibt. T4 wird so nicht mehr als Hausaufgabe verkündet, sondern ab Minute 2 benutzt.

b) Ein Fund des neuesten öffentlichen Modells als Staunen in Platz 5 **[P]** (nach L46, ersetzt den Bruch-Satz):

> And that machine is no toy. This fall, by the lab's account, it finished a calculation about black holes. Physicists had mapped it out more than twenty years ago, and never completed it. Too much work.

Das ist Jakobs Prämisse im Film, mit Du-Bezug (§2.5a): Es ist die Version, die du haben kannst. Im Bild: „Anthropic, Nov 9 · preprints“. Kein früherer Film hat das (Stichwortsuche in Faktenzetteln, VO-Texten und `youtube/*.md`).

c) Reserve für Platz 1, falls Jakob dort eine echte neue Erkenntnis eines gesperrten Modells will **[P]**: Eine „unreleased research version“ verbesserte im August eine alte Schranke zur Riemann-Vermutung (41,6 % → 67,2 %), zwei Fachleute von außen sahen das Papier durch. Angestoßen hat es ein Nicht-Mathematiker mit „take a real stab“. Nachteil: August, und noch mehr Anthropic.

### 4 · Reihenfolge: Tipps weg vom Finale, die große Antwort aus dem Film heraus (L45–L70)

**Urteil zur Frage des Texters.** Das Prinzip stimmt: Ein Tipp gehört zu seiner Gefahr (§1.3), und eine Tipp-Liste als Ausklang wäre schlechter. Die Ausführung kostet aber genau die Zuschauer, die die große Antwort sehen sollen:

- Vier Aufforderungen in 76 Sekunden (L55, L56, L61, L62), dazu „Use yours“ (L60). Ab 7:01 klingt der Film nach Abspann.
- Danach muss L64 den Motor neu anwerfen: „One question is still open.“ Das ist eine Ankündigung (§3.8) und das Eingeständnis, dass die Hauptfrage seit 0:34 ruht.
- Von Routern zu Fermat ist der härteste Sprung des Films. Mathematik kam zuletzt sechs Minuten vorher vor.
- Die große Antwort liegt formal richtig (8:16 = 80 %, 8:27 = 82 %). Aber die eine Hälfte ist Rückblick (L65), die andere ein unbestätigter Anspruch (L66).
- T6 (L56) ist vage („back two demands“) und doppelt das Ende von #31 (dort L75–L79).

**Vorschlag: neue Reihenfolge ab Platz 5.**

1. Platz 5: Fable, dasselbe Modell, der Fund, die gebremste Fähigkeit (Zeilen in Änderung 5).
2. „But the line doesn't end with you.“ L58–L60 unverändert, direkt danach.
3. **Ein** Update-Tipp in einem Atemzug (ersetzt L61–L62; 60 → 47 Wörter):

> Switch on automatic updates, on your phone, your laptop, your router, and don't put off the restart. That protects you from attacks on flaws that are already found and fixed. And a device too old for updates? Take it offline. In there, a flaw never gets closed.

4. Der Einblick als Auffahrt zur großen Frage (ersetzt L50–L56):

> Sometimes, the door protects you, too. This fall, OpenAI was about to release its next model. Then it called the launch off. The reported reason? It was more deceptive than the one before.
>
> That call was made inside the room. And no rule forces a lab to tell you what it sees in there.

Dann Senats-Clip mit Einordnungssatz (Abschnitt 10), L53, und:

> Windows are being cut into that room. Outside groups tested the newest Mythos before its release. But when one of them published a report on the lab in November, key evidence had been blacked out by the company.
>
> So keep asking the inspector's questions. Who checked it from outside? What was blacked out? That protects you from hype, and from false comfort.

5. Große Antwort wie in Änderung 1c. Sie beginnt mit einer Frage aus dem Film („So what is in that room?“), nicht mit einem Wegweiser.
6. T5, Schlussszene, Kernsatz, Abo 2.

**T6:** streichen und #31 überlassen. Wenn Jakob ihn will, als ein Gedanke vor Punkt 5 (32 Wörter):

> And when A.I. rules are debated where you live, ask for one thing. A duty to report, in public, what goes wrong inside. Then you hear of it before it reaches you.

Gemessen in der Kopie: Update-Tipp 6:25, T4 7:36, „So what is in that room?“ 7:46, Hauptfrage 8:18, „Permission. And power.“ 9:03, Kernsatz 10:02.

### 5 · Sätze, die stärker oder ungenauer sind als die Quelle; Doppelungen mit #31

| Zeile | Problem | Ersatz |
|---|---|---|
| **L48–L49** (B13) | Dreifach ungenau **[P]**: Die Grenze gilt für Fable 5.2 **und** Mythos 5.2 (im Training gesetzt, nicht beim Ausliefern). Sie betrifft bestimmte Fähigkeiten (Kernel-Optimierung, Modell-Architektur), nicht „A.I. research“; klassische KI-Forschung ist ausdrücklich nicht betroffen. Und das Lab nennt einen Grund („could most directly accelerate AI development“). „Whatever the reason, … keeps a lab in front“ unterstellt, dass das Lab die Fähigkeit selbst behält; das steht nirgends. Der Fehler sitzt im Faktenzettel (B13, M3) und im Gerüst (dort Beleg für „neuere interne Modelle“). | „But one thing, the lab says, it was built not to get better at. The skills that most speed up the building of the next A.I. In the locked version, and in yours. What its own researchers work with, the lab doesn't say.“ |
| **L46–L47** | „dangerous biology“ ist enger als die Quelle **[P]** („most tasks in research biology“). „nineteen of twenty … never happens“ ist ein Bruch mit doppelter Verneinung, Stand Juni. „you really are holding the same machine“ gilt nur, wer Fable nutzt (bezahlte Pläne, Abschnitt F). | „It's called Fable. Its maker says it is the very same model as Mythos. So if Fable is the A.I. on your phone, your bank letter goes to the same machine. Only requests about hacking, and most research biology, get passed to an older model. Most days, you would never notice.“ |
| **L40** (B36) | „But the repairs are real“ plus Microsofts Rekord legt nahe, Mythos habe ihn verursacht. Microsoft nennt KI allgemein (eigener Vermerk Nr. 10). Microsoft ist aber Glasswing-Partner (B4). | „Critics called the whole thing marketing. And caution is this company's brand. But it can be marketing, and the flaws can still be real. In July, one of the partners, Microsoft, fixed more security flaws in a single month than ever before. Its own explanation? A.I. is helping defenders find more.“ |
| **L30–L32** | Die offizielle Antwort (Gefahr) gehört Anthropic und bekommt 80 Sekunden. Das Geschäftsmotiv belegt nur OpenAIs Chef. Anthropics eigenes Kostenmotiv fehlt (B1, B7, M4). „real edge“ ist stärker als B23 („größter Vorteil“). | „But safety is not all a closed door protects. Mythos, leaked files suggest, was also costly to run. And Sam Altman has named OpenAI's biggest advantage himself:“ |
| **L38** | Der Clip nennt keinen Grund fürs Wegsperren. „locked away“ an einem Tag stimmt nicht, Mythos wurde angekündigt. | „On the day Mythos was announced, Anthropic's chief executive, Dario Amodei, explained the hurry:“ |
| **L21 → L23** | Die Frage gilt den Mathe-Modellen, die Antwort einem anderen Modell. | „The clearest answer on record came this spring. It begins with that decades-old flaw.“ |
| **L33** | Ja/Nein-Frage, Antwort absehbar. | „So a closed door buys a lab time. Who else gets to use that time?“ |
| **L50** | „a new version of Astra“ ist die neunte Modell-Bezeichnung im Film. | „its next model“ (Zeile in Änderung 4) |
| **L59** (S7) | Offen herunterladbar war das Modell laut Rohrecherche (Z. 94, 208) etwa zwei Wochen nach dem 14.8., also nach gut viereinhalb Monaten. | „Within five months of Mythos being locked away, …“ |

**Doppelungen mit #31** (frühester Release 18.11.), vor Text v2 vom Koordinator zu klären (§2.5, §3.4):

- Hook-Szene und Rückkehr: #55 L2/L72 „Tonight, you'll ask …“ ↔ #31 L2/L84 „Tomorrow you'll ask …“.
- Fünf Stufen: Plätze 1–5 ↔ „a ladder with five rungs“ (#31 L8).
- 90 % des Codes und „successor“: L20 ↔ #31 L3–L4. In #55 streichen.
- Fermat: L11 ↔ #31 L20–L22.
- METR „fast doppelt so schnell“ und Schwärzung: L54 ↔ #31 L39–L46. In #55 nur die Schwärzung, ohne Zahl.
- Gebremste Forschungs-Fähigkeit, mit entgegengesetzter Deutung: L48–L49 (Vorsprung) ↔ #31 L74 (Schutz). Auf den Quellwortlaut einigen.
- Kokotajlo: L51–L52 ↔ #31 L50–L55. In #55 besser Hobbhahn (Abschnitt 10).
- Börsengang als Interesse: L15 ↔ #31 L43. Bleibt, anders formuliert.

---

## 2 · Wortbudget

| Abschnitt | v1 | Kopie mit allen Ersatzzeilen | Ziel v2 |
|---|---|---|---|
| Hook | 144 | 118 | ≤ 120 |
| Platz 1 | 231 | 248 | ≈ 240 |
| Plätze 2 und 3 | 176 | 183 | ≈ 155 |
| Platz 4 | 157 | 153 | ≈ 150 |
| Abo 1 | 29 | 29 | 29 |
| Platz 5 | 296 (mit Einblick) | 129 | ≈ 135 |
| Alle + ein Tipp | 124 | 111 | ≈ 110 |
| Einblick | – | 135 | ≈ 125 |
| Große Antwort | 211 | 295 | ≈ 285 |
| Schluss | 60 | 60 | 60 |
| Abo 2 | 31 | 31 | 31 |
| **Summe** | **1.459** | **1.492** | **≤ 1.460** |

Die Kopie zählt ohne C2 (drei Clips, 20 s) und ohne T6. Kürzungen, die ich zuerst probieren würde:

- L29 Szene im Finanzministerium: −25 (steht schon in den Kürzungsoptionen des Texters).
- L27 „up to a month“ ins Bild: −4.
- L26 „Instead, it chose who goes in.“: −6 (L27–L28 zeigen es).
- In 1c „But the method is plain.“: −5.

Bleibt C2 als vierter Clip: +14 Wörter und +12 s; dann die Ministeriums-Szene sicher streichen. Anteil Wissenschaft in der Kopie: rund 31 % (v1: 13 %).

---

## 3 · Als normaler Zuschauer

**Was mich hält:** 0:00–0:30 (mein Abend, die Tür, 27 Jahre, eine klare Frage). 0:58–1:24 (Fermat; viele über 45 kennen den Namen aus den Neunzigern). 2:32 die Laden-Frage. 3:19 das Finanzministerium. 4:07 fünf Millionen Testläufe. 5:19–5:47 „What came through?“. 7:26–7:46 „Attackers included … It buys time.“ 9:09 „Permission. And power.“ Der Schluss.

**Wo ich wegklicke:**

1. **0:34–0:57.** „It's the same model“: Dann ist die beste KI ja doch bei mir? Danach „doors“ in einem Modell, eine Liste aus fünf Einrichtungen, „Now walk …“. 23 Sekunden ohne neuen Reiz, mitten im größten Leck.
2. **1:40–2:08.** Eben noch Staunen, jetzt Börse, Investoren, „Claims, then“. Ich weiß nicht mehr, ob ich staunen darf.
3. **2:39–3:58.** Rückblende ins Frühjahr, Dekret, Firmenliste. Und die Frage von 2:32 galt den Mathe-Modellen; geantwortet wird mit Mythos.
4. **6:04–7:26.** Senat, Prüfgruppen, „back two demands“. Das fühlt sich nach Staatsbürgerkunde an, und ich weiß nicht, was ich tun soll.
5. **7:52–8:16.** Updates, alter Router: Das klingt wie der Abspann. Die beste Minute des Films kommt erst danach.

**Sprünge:**

- Die Tür bedeutet viermal etwas anderes: Zugang zum Lab (L4), Sperren im eigenen Modell (L7), eine gebremste Fähigkeit (L48), eine Release-Entscheidung (L50). Dazu „windows“ (L54). Eine Bedeutung behalten: Zugang.
- Neun Bezeichnungen für Modelle: Mythos, Fable, Astra, „a new version of Astra“, „internal model after Astra“, „math model“, „research version“, „older model“, „rival model“. Dazu wechselt der Erzähler zwischen „model“, „machine“ und „A.I.“.
- Lab-Wechsel: Anthropic → OpenAI → Anthropic → OpenAI → Senat → Anthropic → OpenAI.
- 8:04 → 8:16: vom Router zu Fermat.

**Geht es mich an?** Ja bei Handy und Bankbrief, bei „fifth“, bei den Updates, bei „a preview of your own tools“. Nein bei Dekret, Partnerliste, Senat. Es fehlt der Moment „das kann meine eigene Version“ (Änderung 3b).

---

## 4 · Regel-Checkliste §1–9

| § | Urteil | Befund mit Zeile |
|---|---|---|
| 1 Haltung | **nicht bestanden** (1.1, 1.2) | 1.1: Platz 1 nimmt das Staunen zurück (L15–L16); kein Staunen über die eigene Version. 1.2 Meldungs-Ton: L13, L15, L26–L27, L38, L50–L51. 1.3 ✓ jede Gefahr mit Wirksamkeit (L40–L41, L54–L56, L61–L62, L69). 1.4 Hinweis: 2:39–5:07 ist Rückschau auf April bis Juli. 1.5 ✓. 1.6 ✓ kein Ich-Satz. 1.9a teils: Friar ohne Interesse (L16). 1.10 ✓ kein „Claude“. |
| 2 Thema, Leitgedanke | **nicht bestanden** (2.2, 2.5, 2.5b) | 2.1 nicht prüfbar. 2.2: Tür in vier Bedeutungen (L4, L7, L48, L50). 2.3 ✓. 2.4 ✓ Kernsatz L4 → L73. 2.5: acht Doppelungen mit #31. 2.5a ✓. 2.5b: L11 überholt, L15 falsches Datum [P]. 2.5c ✓. |
| 3 Story-Gerüst | **nicht bestanden** (3.1, 3.3, 3.3a, 3.8) | 3.1: L21 → L23 verschiedene Modelle; L33 Ja/Nein; ab Platz 5 enden Stationen auf Rat statt Frage (L56, L62). 3.2 formal ✓, aber L8 verrät alle Sprossen. 3.3: keine neue Frage von 0:30 bis 2:32. 3.3a: L8. 3.3b: neun Modell-Namen, sechs Lab-Wechsel. 3.4 Hinweis: zweiter Fünf-Stufen-Film in einer Woche. 3.5 ✓. 3.8: L64 kündigt an; Abo 2× mit Mission und Frage ✓ (L43 bei 49 %, L75), kein QR ✓. |
| 4 Hook | **nicht bestanden** | Zeile 30–50 s (L7–L9). Abschnitt 5. |
| 5 Sprache | **bestanden mit Auflagen** | Bann-Liste 0. L20 (24 Wörter, drei Einschübe), L46 (Bruch mit doppelter Verneinung), 13 Zahlen ≈ 1,3 pro Minute, „model“, „agents“, „swarm“. Tags ✓, kein Flüstern ✓, 1.459 Wörter ✓. |
| 6 Payoff | **nicht bestanden** (6.1, 6.4, 6.5) | 6.1: 1:17 formal ✓, sachlich schief [P]. 6.2 ✓. 6.3 teils. 6.4: L15–L16. 6.5: L56 und L70 vage. 6.6: Platz 5 ohne Staunen. Abschnitt 8. |
| 7 Clips | **bestanden unter Vorbehalt** | 4 Clips, 29 s = 4,7 %, Abstände 118, 48, 109 s, Einordnungssätze ✓. Aber: C1 beginnt mitten im Satz, alle Wortlaute sekundär, C2 wohl mit Musik. Abschnitt 10. |
| 8 Titel | **bestanden** | 26 Zeichen, „AI“ erkennbar, Bild im Kopf, kein „could“, keine Frage, von Jakob freigegeben. 8.4: Der Film muss am Ende klar „ja“ sagen; L64 tut es. |
| 9 Thumbnails | **nicht prüfbar** | Keine Entwürfe im Ordner. Hinweis: Der Bildtext hat 5 Wörter und wiederholt den Titel fast wörtlich (§9.2, §9.6); so von Jakob freigegeben. B und C brauchen eigene Texte, die allein stehen. |

---

## 5 · Hook-Tabelle §4

| Baustein | v1 | Urteil |
|---|---|---|
| 0–3 s: Titelworte zuerst, Thumbnail-Motiv | L1 „The best A.I. in the world is locked away.“ | ✓ |
| 3–30 s: Szene mit „you“, keine Firma, keine Statistik | L2–L5 Bankbrief, Auto, Tür, 27 Jahre | ✓ |
| Eine Hauptfrage, nicht zu erraten | L6 bei 0:30, Ende 0:34, 86 Wörter | ✓, am oberen Rand |
| Erstes echtes Ergebnis vor 0:45 | L5 bei 0:23 | ✓ (ohne Absender; im Bild ergänzen) |
| 30–50 s: nicht erklären, einschränken, ankündigen | L7 schränkt ein und beantwortet halb, L8 zählt auf | ✗ |
| 50–60 s: erster Gewinn, der die nächste Lücke öffnet | „Fifth in line“, dann L9 Wegweiser | schwach |
| Verboten: Inhaltsangabe „first … then“ | L8 „go first. Then … Then … Then …“ | ✗ |
| Verboten: mehr als eine Frage, Zitat vor 0:30, Jahreszahl, Pause am Ende | – | ✓ |
| Zahlen | „twenty-seven“, „fifth“ | ✓ |
| Hook verwirrt nicht | 0:16 „never sits in your pocket“ gegen 0:34 „the same model“ | ✗ |
| Ohne Bild verständlich | „With doors that stay shut“ | ✗ |
| Gegentest a bis c | Thema, Echtheit, offene Frage | ✓ ✓ halb |
| Gegentest d | bei 0:45 stärkerer Grund als bei 0:30 | ✗ |

Zur offenen Frage des Texters (A oder C): A bis 0:30 behalten, dann die Zeilen aus Änderung 2. C verlangt in Minute 1 eine Mathe-Erklärung und hat keinen Einsatz für mich.

---

## 6 · Fragen-Kette, große Antwort, Platz der Tipps

| Station | beantwortet | öffnet | Urteil |
|---|---|---|---|
| Hook | – | L6 „how much stronger?“ | ✓, bei 0:34 halb beantwortet |
| Platz 1 (0:58–2:39) | Was liegt vorn? | L21 „why keep its best product off the shelf?“ | Frage gut; 122 s ohne neue Frage |
| Plätze 2, 3 (2:39–3:58) | Warum gesperrt? offiziell Gefahr; ehrlich Vorsprung, Rechenleistung | L33 „Does it serve anyone else?“ | Antwort gilt einem anderen Modell; Frage zu weich |
| Platz 4 (3:58–5:07) | Wem nützt es? den Reparierern | – (Abo) | ✓ beste Station, echte Auflösung |
| Platz 5 (5:19–7:26) | Was kam an? | L53 „who gets to look inside?“ | endet auf zwei Ratschlägen |
| Alle (7:26–8:16) | Wer steht hinter dir? | – | starke Wendung L58–L60, dann zwei Ratschläge |
| Große Antwort (8:16–9:42) | Hauptfrage | – | im letzten Fünftel ✓, aber ohne neue Fakten |

- **But/therefore:** bis Platz 4 sauber. Danach „and then“: Fable, und eine gebremste Fähigkeit, und Astra, und der Senat, und Prüfer, und zwei Tipps.
- **Der eigentliche Mangel:** Die Uhr (Plätze 1 bis 5) misst Zugang. Die Hauptfrage fragt nach Stärke. Keine Sprosse liefert hörbar ein Stück der Antwort, deshalb muss L64 sie neu aufrufen. Jede Sprosse sollte ein Indiz abwerfen, das die große Antwort einsammelt: Platz 1 „sie halten etwas zurück, wie stark, ist offen“; Plätze 2 und 3 „Rechenleistung, die ein Lab behält“ (L32, schon da); Platz 5 „dasselbe Modell, und es macht Physik“; Alle „der Abstand sind Monate“. Die Kopie tut das mit „Remember Fermat?“ und dem August-November-Satz.
- **Große Antwort im letzten Fünftel:** v1 ja (8:16 und 8:27). In der Kopie beginnt bei 7:46 die Enthüllung, die Hauptfrage kehrt bei 8:18 zurück, „Stronger in two ways“ bei 8:27. Nicht früher legen.
- **Tipps:** Urteil in Änderung 4. Kurz: Ort richtig gedacht, Dichte falsch. Vor dem Finale höchstens eine Aufforderung, und die als Rückgriff (T4).

---

## 7 · Jakobs Schwerpunkt: neueste Modelle, neueste wissenschaftliche Erkenntnisse

- **Anteil:** 190 von 1.459 Wörtern (L10–L14, L65–L67). Platz 1 hat 21 Sekunden Staunen.
- **Funde:** einer (Fermat, eine Prüfleistung), zwei Behauptungen. Keine „Erkenntnis“ im Wortsinn.
- **Neuester Stand:** Der Film zeigt vom 9.11. nur den Rückblick auf September. Die neuen Ergebnisse derselben Seite fehlen.
- **Staunen:** „In eleven days“ ohne Maßstab; danach sofort Zweifel.
- **Ursache:** Der Faktenzettel bietet zur Wissenschaft nur S6, B22, B24, B25. Er wurde für den Zugangs-Film gebaut.

Was die Primärseiten hergeben **[P]**, in dieser Reihenfolge prüfen:

1. Fermat-Paar: Jahre erwartet, elf Tage (intern, August), dreißig Stunden (öffentliches Modell, tausend Kopien, November). Achse des Films.
2. Schwarze Löcher: Fable 5.2 beendet eine Rechnung, die seit 2003 angelegt und „too laborious to complete“ war; dazu ein zweites Ergebnis. Zwei Preprints. Ein Satz in Platz 5.
3. Drei persönliche Abos schreiben einen echten Satz in drei Tagen aus. Option für „Power moves, too“ (+21 Wörter): „And the same lab reports a small test. With three personal subscriptions, its researchers wrote out a real theorem in three days.“
4. Reserve: Riemann-Schranke (August, unveröffentlichte Version).
5. Nicht nehmen: Kapsid (Medizin-Nähe, §2.5c, und #54), Geräte-Entwurf und Betriebssystem (Technik, kein Fund).

Zur Balance: OpenAIs öffentliches Astra löste laut B19 zehn offene Probleme. Das war Film 2, also höchstens ein Halbsatz als Rückgriff.

---

## 8 · Payoff-Check §6

**6.1 Titel-Einlösung bis 1:30:** formal bei 1:17 (L12). Sachlich trägt sie nicht [P]. Fester sind Friar (2:03, zu spät) und Mythos (2:54). Mit Änderung 1b bleibt 1:18 wahr und wird in Minute 8 ehrlich aufgelöst.

**6.2 Nach dem Film weiß ich, dass …**

1. … Labs offen sagen, dass sie Modelle zurückhalten („We are still holding that model“).
2. … es eine Reihenfolge gibt, und der Staat bis zu einen Monat früher prüfen darf, freiwillig.
3. … Fable und Mythos dasselbe Modell sind; riskante Anfragen gehen an ein älteres.
4. … Partner über hunderttausend Lücken fanden (Zählung des Labs), aber gefunden nicht behoben heißt.
5. … nach rund vier Monaten ein fast gleich starkes Modell frei herunterladbar war. Die Tür kauft Zeit.
6. … niemand offenlegen muss, was im Lab auffällt, und Belege geschwärzt wurden.
7. … (letztes Drittel) „stärker“ zwei Formen hat, Erlaubnis und Rechenleistung, und ich in drei bis sechs Monaten dran bin.

Punkte 2 bis 5 sind Artikel-Wissen aus dem Mythos-Jahr. Es fehlt: was die Wissenschaft gefunden hat; irgendeine Größe für „how much“; ob die Mathe-Ansprüche stimmen; warum OpenAI sein Mathe-Modell hält; was ich gegen „power“ tun kann.

**6.3 Kenner-Test:** teils. Neu für Kenner sind nur die November-Punkte, und zwei davon sind ungenau (L12, L48). Mit den Änderungen: tausend Kopien des käuflichen Modells; die erste Maschine laut Lab etwa auf dem Stand eines öffentlichen Modells; die Grenze gilt auch für die gesperrte Version.

**6.4 Zweifel dosieren, dann urteilen:** L15–L16 nicht bestanden (Änderung 3a). L40 gut gebaut, aber das Urteil stützt sich auf einen Beleg, der es nicht trägt. L67 gut.

**6.5 Rat sagt, wovor er schützt:** T1 ✓ (L61), T2 ✓ (L62), T4 ✓ (L55). T6 (L56) nennt den Nutzen, aber keine Handlung. T5 (L70) „get ready“ ist vage; Ersatz in 1d.

**6.6 Staunen:** Hook ✓, Platz 1 ✓ und zurückgenommen, Plätze 2 und 3 ✓ (Ministerium), Platz 4 ✓, Platz 5 fehlt, große Antwort nur über einen unbestätigten Anspruch.

---

## 9 · Fakten

### 9.1 Abgleich mit dem Faktenzettel (nur Auffälliges)

| Zeile | Aussage | Faktenzettel | Befund |
|---|---|---|---|
| L5, L24 | 27 Jahre alte Lücke, Absturz aus der Ferne | S1, sicher, Eigenangabe | ✓. Im Hook ohne Absender; im Bild ergänzen. |
| L11 | Fermat in elf Tagen | S6 | Wortlaut ✓, Stand überholt [P] |
| L12 | „You can't use the A.I. that did it“ | S6 | wörtlich ✓, irreführend [P] |
| L15 | Veröffentlicht einen Tag vor der Roadshow | Falle 4, Quelldatum S6 | ✗ für die elf Tage (4.9.) [P] |
| L15 | „cannot yet reproduce“ | B25, umstritten | ✓ mit „OpenAI itself says“; ob es dasselbe Modell ist, bleibt offen (O7) |
| L16–L18 | Friar | S5, umstritten | Wortlaut am Original prüfen; „on the record“ zu stark |
| L19 | „None of this is hidden“ | M1 | ✗, M1 nennt auch die Belege |
| L20 | „helping to build its own successor“ | S8 | Zahl ✓; der Nachsatz ist ein Schluss, kein Zitat |
| L27 | Dekret, bis zu ein Monat, freiwillig | B30, B31, umstritten | ✓. Die Plätze 2 und 3 sind ein Modell, keine Chronologie. |
| L38 | „gave the reason“ | B6 | ✗, der Clip nennt keinen Grund |
| L40 | Microsoft-Rekord | B36, umstritten | Ursache unterstellt |
| L46 | über 95 % der Sitzungen | S4, B8 | ✓, Stand Juni; für 5.2 keine Zahl |
| L46 | „dangerous biology“ | B12 (Kategorien) | enger als die Quelle [P] |
| L47 | „you really are holding the same machine“ | S4 | nur für Fable-Nutzer |
| L48–L49 | KI-Forschung gebremst | B13, M3 | ✗, Faktenzettel ungenau [P] |
| L54 | Prüfer, 1,9×, Schwärzung | B15 sicher, B17 umstritten | ✓ mit „estimates“; am Original prüfen |
| L59 | „About four months“ | S7 | knapp; siehe Änderung 5 |
| L65 | „The one that wrote out Fermat“ als „newer“ | S6 | ✗ als Beispiel [P] |
| L66–L67 | Schwarm, nicht bestätigt | B24, Falle 3 | Vorbehalt ✓; „data center“ ohne Quelle |
| L69 | Preis minus zwei Drittel | B7 | ✓ |

**Überzeichnungen laut Auftrag:** „secret“ 0 Treffer ✓. Astra richtig getrennt ✓ (Falle 2). Navier-Stokes ohne Namen und mit doppeltem Vorbehalt ✓. Eigenangaben als Tatsache: L5, L47, L65 und der Nachsatz in L20. CEO-Zitat ohne Interesse: Friar. Anthropic schonender: L23–L32, L40, L46–L47. Anthropic härter als die Quelle: L15, L49.

### 9.2 Nachträge für den Faktenzettel [P]

- **S6a** · 4.9.: „the first complete computer-checked proof of Fermat's Last Theorem“; „In 11 days, working largely autonomously“; „the formalization process was expected to take years“; „Dozens of Claude agents“; „occasional high-level instructions“; „about six billion output tokens from a general-purpose internal research model roughly comparable to Claude Fable 5.1“; Beweis auf GitHub; begutachtet von Kevin Buzzard. Das Lab selbst: „what's novel here is the verification“. · https://www.anthropic.com/research/formalizing-fermats-last-theorem
- **S6b** · 9.11., Edit 11.11.: „It relied on a purpose-built harness along with guidance from a human researcher. By contrast, a team of 1,000 Fable 5.2 agents fully formalized the theorem in just 30 hours, with minimal human intervention.“ Ein Drittel der „action tokens“, Beweis siebenmal kürzer. Opus 5.5: 26 % nach 18 Stunden. Fußnote 4: 60 Aussagen, eine Skizze, Definitionen, „47 proved lemmas from our earlier formalization“. Ein Lauf pro Modell. · https://www.anthropic.com/claude-fable-and-mythos-5-2
- **S6c** · ebd. 4.9.: drei persönliche Max-Abos, Vinogradovs Drei-Primzahlen-Satz in drei Tagen; „collaborative formalization of major results with consumer AI subscriptions is achievable“.
- **S9 (neu)** · 9.11.: „Claude Fable 5.2 solved two open problems in theoretical physics. Both concern black holes“; die Rechnung „was laid out in 2003 but was too laborious to complete. Fable 5.2, working largely autonomously, completed it“.
- **B13 (Korrektur)** · „The model that underlies Claude Fable 5.2 and Claude Mythos 5.2 … during the model's training, we took steps to limit advances in the specific research capabilities that could most directly accelerate AI development … Fable 5.2 and Claude Mythos 5.2 perform at about the level of Opus 5.5.“ Nicht betroffen: „agentic coding, hardware development, and traditional AI or machine learning research“. „We do not alter these capabilities … at inference time.“ M3 und der Gerüst-Beleg zu Form 1 sind anzupassen.
- **B8, S4 (Ergänzung)** · Fable 5.2 blockt „high-risk cyber activities … as well as most tasks in research biology“; Ersatz Opus 4.8 und Opus 5. Fable steckt in bezahlten Plänen. Für Alltagsaufgaben empfiehlt das Lab selbst Opus 5.5.
- **S10 (Reserve)** · 10.8.: „An unreleased research version of Claude has improved on a longstanding lower bound …“, 41,6 % → 67,2 %; durchgesehen von Brian Conrey und Dan Goldston. · https://www.anthropic.com/research/riemann-zeta
- **S7 (Datum)** · GLM-5.3 erschien am 14.8., die Gewichte rund zwei Wochen später (Rohrecherche Z. 94, 208).
- **Friar 14.10.** (Rohrecherche Z. 321, sekundär): Das Modell werde für weitere Sicherheitsprüfung gehalten. Ein Halbsatz würde L21 auch für OpenAI beantworten.

### 9.3 Rechercheaufträge

1. Kosten und Größe des 30-Stunden-Laufs. Grobe eigene Rechnung, nur Größenordnung: sechs Milliarden Tokens zum Listenpreis von 40 $ je Million wären rund 240.000 $, ein Drittel davon rund 80.000 $. Stimmt das, trägt ein Satz wie „Tens of thousands of dollars, in thirty hours“ Jakobs „Rechenkraft, die kein Einzelner bezahlen kann“.
2. Die zwei Physik-Preprints: Stimmen die Aussagen, gibt es Stimmen von außen?
3. Release-Datum von Fable 5.1 (für „one of its public models“). Ist auch der zweite Fermat-Beweis öffentlich?
4. O7: Welches OpenAI-Modell ist welches? Solange offen, „its math model“ nur für das Modell, von dem Friar spricht.
5. Friar-Wortlaut am CNBC-Transkript; Clip-Wortlaute per Whisper.
6. Ein belegter Halbsatz, was OpenBSD ist. Das Gerüst sagte „halb das Internet“; v1 hat das zu Recht weggelassen.
7. B1, falls das Kostenmotiv genannt wird (umstritten, „suggest“).

Aus meiner Sitzung nicht erreichbar (Netzwerk-Richtlinie der Umgebung): `claude.dev` (Begleittext zum 30-Stunden-Lauf) und `hexagonmath.org` (die Preprints). Wer sie prüfen soll, braucht die beiden Hosts in den erlaubten Domains der Cloud-Umgebung.

---

## 10 · Clips (§7)

| Clip | Stelle | Befund |
|---|---|---|
| A1 Altman, Dreamforce | 1:33, 7 s | Nur Satz 2 nehmen (≈ 5 s, vollständiger Satz). Satz 1 braucht den Vergleich davor. Musik prüfen. |
| C1 Altman, Berman | 3:38, 8 s | Beginnt mit „…“, Wortlaut offen. Ohne sauberen ganzen Satz: Sprechersatz (Ersatz des Texters passt). |
| C2 Amodei, Glasswing | 4:34, 6 s | Schwächster Clip, sagt wenig. Bei Musik streichen statt vorlesen (als Karte +21 Wörter). |
| C5 Kokotajlo, Senat | 6:29, 8 s | Hauptperson in #31. Besser Hobbhahn: „The most concerning threats posed by rogue AI agents precede their external release.“ Der Satz trifft das Thema von #55 genauer. Bedingung: Er sagt ihn mündlich. Einordnung: „Marius Hobbhahn, whose company tests these machines, told the U.S. Senate:“ (Rolle prüfen). |
| R1 Friar | 2:03, Karte | richtig als Karte. |

- Anzahl 4 ✓ (3 bis 6). Je 6 bis 8 s ✓. Summe 29 s = 4,7 % ✓. Abstände 118, 48, 109 s ✓; C1 → C2 ist knapp und kippt bei jeder Kürzung zwischen 3:46 und 4:34.
- Jeder Clip hat einen Einordnungssatz ✓ und endet mit einem ganzen Satz ✓. C1 beginnt nicht mit einem.
- Vorbehalt: kein Wortlaut ist per Whisper bestätigt, alle Zeitmarken fehlen.
- Zweimal Altman aus zwei Videos ist regelkonform. Wertvoller wäre aus dem Berman-Gespräch die Frage, wie weit OpenAI intern voraus ist, samt Antwort (Rohrecherche Z. 328). Das ist die Hauptfrage des Films, dem Chef gestellt. Als Clip in Platz 1 oder vor der großen Antwort prüfen.
- Fällt C2, bleiben drei Clips. Fällt auch C1, braucht es den Berman-Clip oder beide Senats-Stimmen.

---

## 11 · Bann-Liste, Abo, QR, Ich-Sätze, Tags, Ohr

- **Bann-Liste:** 0 Treffer. Nahe dran: L9 „Now walk to the front of that line“ und L64 „One question is still open“ (beide Wegweiser).
- **„subscribe“:** genau 2 (L43, L75), beide mit Mission und als Frage, keiner im Hook ✓.
- **QR:** nicht erwähnt ✓. **Ich-Sätze:** 0 ✓. **Flüster-Tags:** 0 ✓. Tags: calm, curious, thoughtful, warm, pause.
- **Satzlänge:** 181 Sätze, Ø 8,1 Wörter. Über 20 Wörter: L2 (21) und L20 (24). 34 Bruchstücke mit höchstens drei Wörtern; in Reihe (L8, L28) klingt die Stimme leicht abgehackt. Hörprobe.
- **Zahlen:** 13 Stellen, 1,3 pro Minute. Ins Bild: „up to a month“ (L27), „nineteen of twenty“ (L46), „almost twice“ (L54).
- **Zwei harte Zahlen ohne Luft:** L36 → L37. Dazwischen ein `[pause]` oder: „And that was one. By the lab's own count, its partners confirmed well over a hundred thousand within months.“
- **Fachwörter:** „model“ 15× ohne Einführung, „agents“, „swarm“, „generally available“. In der Erzählstimme „machine“; „copies“ statt „agents“.
- **„A.I.“ oder „artificial intelligence“:** offen (Hinweis des Texters). Vor der Hörfassung an der Stimme testen.
- **Länge:** bei 2,4 Wörtern/s rund 11:00 mit Endbild. Kein Spielraum nach oben.

---

## 12 · Zeilen-Notizen

- **L1–L6** bleiben. L5: im Bild „Anthropic's account“.
- **L7–L9** Änderung 2.
- **L10** „First come the labs“ wiederholt L8; entfällt mit Änderung 2.
- **L11–L12** Änderung 1b.
- **L13** „what comes next“ → „the one after it“.
- **L14** nur Satz 2.
- **L15–L20** Änderung 3a. L20 streichen.
- **L21** bleibt, gute Frage.
- **L23** Brücke aus Änderung 5.
- **L24** gut. „a computer“ ist weit; „OpenBSD“ steht nur im Bild.
- **L25–L26** zusammenziehen: „The A.I. that found it is called Mythos. Its maker, Anthropic, announced it, and said it had no plan to release it to the public.“
- **L27** Zahl ins Bild, „voluntary“ bleibt.
- **L28** bleibt.
- **L29** „chair of the Federal Reserve“ → „the head of America's central bank“. Erster Kürzungskandidat.
- **L30–L33** Änderung 5.
- **L35** „to turn the locked model on“ klingt nach Einschalten → „to point the locked model at the software the world runs on“.
- **L36–L37** Luft dazwischen (Abschnitt 11).
- **L38–L40** Änderung 5.
- **L41** bleibt.
- **L43** bleibt.
- **L45** bleibt.
- **L46–L49** Änderung 5 und 3b.
- **L50–L56** Änderung 4. Zu L52: Kalifornien verlangt vertrauliche Berichte (M6); „no rule forces a lab to tell you“ bleibt damit richtig.
- **L54** die Zahl gehört #31. „Part of that push comes from models that were never released“ ist dagegen der einzige Beleg von außen für „newer“. Option für 1c (+16 Wörter): „Outside testers say part of one lab's speed comes from models it never released.“
- **L58–L60** bleiben wörtlich, wandern vor den Einblick.
- **L61–L62** zusammenziehen (Änderung 4).
- **L64–L67** Änderung 1c.
- **L68** bleibt wörtlich.
- **L69** bleibt. „And power gets cheaper“ stimmt (B7).
- **L70** Änderung 1d.
- **L72–L73** bleiben; die Szene mit #31 abstimmen.
- **L75** bleibt.
- **Abschnittsenden:** L56, L62 und L70 enden auf Rat. Besser Wendung oder Frage (§11).

---

## 13 · Reihenfolge für die Einarbeitung

1. **Recherche:** Nachträge 9.2, Aufträge 9.3 Nr. 1 bis 3 zuerst.
2. **Koordinator, mit #31:** Fermat, Hook-Szene, Kokotajlo, Deutung der gebremsten Fähigkeit.
3. **Jakob entscheidet:**
   - Hook ohne „same model“ und ohne Aufzählung (weicht vom Gerüst ab)? Dazu der Kandidat mit den schwarzen Löchern für den Hook-Schritt.
   - Ein Satz zu den schwarzen Löchern in Platz 5 (mehr Anthropic-Wissenschaft, Offenlegung nur in der Beschreibung)?
   - T6 streichen oder ein Satz?
   - Was geht in der Mitte: Ministeriums-Szene oder C2?
4. **Texter, in getrennten Durchgängen:** Struktur (Änderung 4, dann 2), Fakten (1, 5), Platz 1 (3), Kürzen auf ≤ 1.460, Ohr.
5. **Vor der Hörfassung:** `regel_check.py`, Clip-Abstände neu messen, „subscribe“ zählen.
