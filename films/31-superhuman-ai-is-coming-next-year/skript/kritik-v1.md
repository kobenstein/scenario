# Kritik v1 · Film #31 „AI is now building the next AI“ (Arbeitstitel)

Stand 16.11.2026 · Kritiker auf Fable 5.2

- **Geprüft:** `vo-v1.txt` (1.379 gesprochene Wörter Erzähltext plus 56 Wörter Clip-Zitate, VO-Ende ≈ 10:07 bei 2,4 Wörtern pro Sekunde), `text-v1.md`, `hook-v1.md` (HOOK FINAL = L1–L10).
- **Gegen:** `schreibraum/REGELN.md` (Stand 16.11.), `geruest-v2.md` (§0 = Jakobs Entscheidung), `faktenzettel.md`, `clips.json`. Zur Wahrheitsprüfung zusätzlich `recherche-roh.md`.
- **Gegengelesen:** `film-geheim-ki` (#55), `film-ai-goes-public` (#59), Film 2, die Leiter-Vorgeschichte in #21 und #24, `hook-bauplan.md`, Wochenanalyse 16.11. `regel_check.py` ist gelaufen.
- **Lesehilfe:** Zeilen (Lnn) = Zeilen in `vo-v1.txt`. Zeiten sind aus der Wortzahl gerechnet (Clips: K1 7 s, K6 8 s, K3 9 s). Die Fakten habe ich gegen Faktenzettel und Rohrecherche geprüft, nicht gegen die Originalquellen; das bleibt Aufgabe des Faktenchecks.

**Hinweis zur Befangenheit:** Diese Kritik stammt von Claude, einem Modell von Anthropic. Der Film stützt sich zu einem großen Teil auf Anthropics eigene Zahlen. Im Zweifel gehen meine Vorschläge deshalb zulasten der Firma: Anreiz früher nennen, Selbstauskünfte als solche kennzeichnen, zweite Zeugen holen.

**Note v1: 6,5/10. Regel-Check v1: 4 von 7 prüfbaren Abschnitten bestanden (alle vier mit Auflagen). Abweichungen: §1 (fünfeinhalb Minuten ohne „du“), §2 (fünf Bausteine doppelt mit #55), §7 (kein geprüfter Clip, K3 ist keiner). §8 und §9 nicht prüfbar, weil der Titel offen ist.**

---

## 1. Gesamturteil

Das Fundament trägt. Satz 1 ist stark und in der Lesart „erdacht“, nicht „gebaut“, durch den Faktenzettel gedeckt. Die Frage steht bei 0:31, der erste harte Fakt kommt vor 0:45, jede Station endet mit einer Frage. Die kritische Einordnung ist da und gut dosiert: Brins Interesse, Börsengang, geschwärzte Belege, Kritiker, Bilanz und Interesse der Prognostiker, „It's a story“. Die stärkste Minute ist 6:16–7:07: ein Gremium, eine Abstimmung, dann „Not code. Not experiments. Not even research.“

Für die Hörfassung ist v1 aus vier Gründen noch nicht fertig:

1. **Clips.** Kein einziger ist am Original geprüft, und K3 ist gar kein Clip.
2. **Die Mitte.** Zwischen 0:52 und 3:54 klingt die Leiter wie eine Liste mit gesprochenen Kapitelschildern. Das ist die Form, bei der Jakob in #24 ausgestiegen ist. Die schwächste Station (Fermat) trägt ein Wunder, das beim Zuhören nicht ankommt und das #55 im selben Stapel ebenfalls erzählt.
3. **Du-Bezug.** Von 0:10 bis 5:50 bin ich als Zuschauer nicht gemeint, und der Rat am Ende ist vage.
4. **Schluss.** Die Frage aus dem Hook wird nie mit dem Stand der Leiter beantwortet. „still ours“ fällt zweimal in 45 Sekunden. Und „The next one may be designed by a machine“ widerspricht dem, was der Film selbst belegt.

### Als normaler Zuschauer am Fernseher

- **Leicht zu folgen?** Hook und Stationen 4 bis 6: ja. In der Mitte kann ich folgen, aber ich höre ein Abhaken, keine Geschichte.
- **Sprünge?** Zwei. Bei 1:55 springt der Film von „Science is finding out what works“ zu einem Mathematik-Beweis. Zwischen 7:51 und 9:11 treten in 80 Sekunden acht Akteure auf (Monitor, Anthropic, Prüfer, Konzernchefs, Gesetzgeber, Washington, Peking, „one forecaster“).
- **Jede Minute relevant für mich?** Minute 1 und die letzten zwei: ja. 1:00–5:50 ist eine Labor-Geschichte ohne mich.
- **Wo würde ich wegklicken?**

| Zeit | Was passiert | Punkt |
|---|---|---|
| 0:41–0:57 | Fahrplan („a ladder with five rungs“), dann eine Wiederholung von 0:14. 16 Sekunden ohne Neues im teuersten Fenster. | M2 |
| 1:55–2:41 | Fermat. Ich verstehe nicht, warum 30 Stunden gegen 11 Tage beeindruckt (beides war die Maschine) und was ein Beweis mit Experimenten zu tun hat. Fünf Zahlen in 50 Sekunden. Größte Ausstiegsstelle. | M1a, M6 |
| 3:42–3:54 | Abo-Aufruf nach einer Auflösung, ohne offene Frage davor. | K1 |
| 4:58–5:50 | Vier Daten in 23 Sekunden, dann eine vorgelesene Karte mit „intelligence explosion … after all“. | M1b, K8 |
| 7:21–9:11 | 21 Wörter Fachsprache und gleich die Übersetzung hinterher. Danach die Kette der Institutionen. Mein Teil („learn how this works, and speak up“) ist dünn. | M1c, M4 |

**Was bleiben soll:** Satz 1 und die Rückkehr zur Szene am Schluss · „People steer. The machine builds.“ · L14 (Brins Interesse) · L35 (das Missverständnis aus dem Kino, ausgesprochen und gebrochen) · L47 („moves the calendar“) · L56–L58 (Bilanz, Interesse, Bedingung) · L61–L65 komplett · „Promised. Not required.“ · Schulmans „deciding what we actually want“ (3:15), das bei 6:54 als Sprosse vier zurückkehrt.

---

## 2. MUSS (8 Punkte)

### M1 · Clips: kein einziger am Original geprüft, K3 ist gar kein Clip (§7 nicht bestanden)

**Stelle:** L12–13 (1:18, K1) · L31–32 (3:15, K6) · L54–55 (5:44, Karte K10) · L68–69 (7:29, K3).

**Problem:**

- **K3:** Der Satz stammt aus Pachockis Essay „An Alien Mind“ (openai.com, 06.09.). Nach Faktenzettel und `clips.json` gibt es ihn nur geschrieben. Der Livestream in `clips.json` enthält einen anderen Satz, von 2025. Der Marker `[CLIP K3]` lässt `regel_check.py` drei Clips zählen, der Film besteht die Prüfung also nur zum Schein.
- **K6:** Wortlaut ungeprüft, zwei Fassungen im Umlauf. Die VO-Fassung hat Auslassungspunkte mitten im Satz. Ein Clip muss ein durchgehend gesprochener, vollständiger Satz sein.
- **K1:** Wortlaut nur aus der Presse. Ob er in dem genannten Video fällt, ist nicht bestätigt.
- **K10** ist eine vorgelesene Karte mit zwei Stolpersteinen fürs Ohr („intelligence explosion“, „after all“).
- Stand: 0 geprüft, 1 wahrscheinlich (K1), 1 unsicher (K6). Nötig sind mindestens 3.

**Vorschlag:** Vier Clip-Plätze planen und zwei Reserven benennen, damit mindestens drei die Prüfung am Original überleben.

| Platz | Clip | Ampel | Was zu tun ist |
|---|---|---|---|
| 1:18 | K1 Brin | grün | Bleibt. Am Video prüfen (Wortlaut, Zeit, Musik). Fällt er, wird er eine Karte. |
| ~2:10 neu | **K2 Altman,** OpenAI-Livestream 28.10.2025, ~10 s | grün | Stärkster neuer Kandidat: offizieller Kanal, vielfach zitiert, bekanntes Gesicht. Eine Vorhersage mit Datum, die der Film sofort nachprüft. Gibt Sprosse 2 einen zweiten Zeugen neben Anthropic. Zeitangaben widersprechen sich (07:03, 07:41, 07:43), also am Video suchen. Bauchbinde mit „2025“. Kein Widerspruch zu Faktenzettel §5: Dort geht es um neue Altman-Aussagen zu 2027. |
| 3:15 | K6 Schulman | gelb | Nur als EIN durchgehender Satz. VO-Zeile wörtlich an den Ton anpassen. Einleitung und Echo tragen beide Fassungen. |
| ~6:00 neu | **K7 Dwarkesh Patel,** Video-Essay 13.11., ~9 s | gelb | Zweite, unabhängige Stimme zur Prognose, in Alltagssprache. Ersetzt die vorgelesene Karte K10 (die Karte bleibt stumm im Bild). Offen: Video-URL, Wortlaut im Video, Hintergrundmusik (mit Musik nur als Karte). Sein eigener Vorbehalt (mindestens 25 % Chance, dass es bis nach 2032 dauert) als Einblendung. |
| 7:29 | K3 | – | Wird `[ZITATKARTE K3]` und kürzer (unten c). |
| Reserve | **K3 von 2025,** derselbe Livestream wie K2, ~6 s | grün | Sicherster dritter Clip, falls K6 und K7 scheitern: K1, K2 und K3 (2025) kämen alle von offiziellen Kanälen. Als Vorher-Satz vor dem Essay (unten d). K2 und K3 zusammen 16 s aus einem Video; erlaubt sind 2 Clips und 20 s. |
| Reserve | K5 Millidge (einziger schon geprüfter Clip) | gelb | Nur mit Jakobs OK, weil schon in Singularity Friday. Passt eher zu „how fast is the climb?“ als zu Sprosse 3. |

Mit K1, K2, K6 und K7: 34 s ≈ 5,3 % der Laufzeit (Ziel ≤ 8 %), Abstände ≥ 45 s, je Quellvideo ein Clip.

**(a) Station 2 neu, ersetzt L19–L24.** Fermat entfällt (siehe M6). Die Station beginnt mit der Antwort auf L17 („Can a machine do that too?“).

> [curious] By the lab's own verdict: yes. Describe an experiment clearly, and Anthropic's model carries it out as well as a skilled human. Or better.
>
> A year ago, a rival had put a date on exactly that. Sam Altman, head of OpenAI:
>
> [CLIP K2 · 2025] "…we think it is plausible that by September of next year, we have an intern-level A.I. research assistant, and that by March 2028, we have a legitimate A.I. researcher."
>
> September came. OpenAI says the intern is here. No outsider has checked that, and by its own account the intern still needs heavy steering.
>
> So the second rung, running the experiments: taken. On the labs' own word.

L25 bleibt als Übergang. K1 endet bei 1:23, K2 beginnt bei 2:10, also 47 s Abstand. Der Clip braucht den ganzen Satz bis „researcher“; ein Schnitt nach „assistant“ läge mitten im Gedanken.

**(b) Station 5, ersetzt L52–L55.**

> Their date marks one machine: a superhuman A.I. researcher. And they're not alone. Dwarkesh Patel, who interviews the people running these labs, said this month:
>
> [CLIP K7] "I've now come to the view that we're only a couple of years away, and possibly only a couple of months away, from AIs that are as good as the best humans at AI research."
>
> On the ladder, that's rung three, taken completely. From then on, machines can design the machines.

Wer Kokotajlos „Unfortunately“ hören will (es zeigt, dass er nicht jubelt), hängt an: *"And the lead author isn't celebrating. His own summary begins with one word: unfortunately."* (+14 Wörter), dazu die Karte im Bild.

**(c) K3 als Karte, ersetzt L67–L70.** Ein Durchgang statt Fachzitat plus Übersetzung, etwa 5 s kürzer.

> But holding a rung isn't being ready for it. In September, OpenAI's chief scientist, Jakub Pachocki, put it in writing. No lab, he says, can yet steer and check these systems well enough to, quote, "continue responsibly scaling at maximum speed for much longer."

**(d) Reserve mit dem echten K3 von 2025.**

> But holding a rung isn't being ready for it. A year ago, OpenAI's chief scientist, Jakub Pachocki, said this on stage:
>
> [CLIP K3 · 2025] "We believe that it is possible that deep learning systems are less than a decade away from superintelligence."
>
> This September, the same man put a warning in writing. No lab, he says, can yet steer and check these systems well enough to, quote, "continue responsibly scaling at maximum speed for much longer."

### M2 · Hook 0:31–0:57: Datum wofür? Und 16 Sekunden ohne Neues im teuersten Fenster (§4)

**Stelle:** L7–L10.

**Problem:**

- **„pulled their date forward“: Datum wofür?** Als Antwort auf die Frage klingt es wie das Datum für „niemand mehr am Steuer“. Gemeint ist ein übermenschlicher KI-Forscher. Der Film selbst ordnet das bei 5:26 als Sprosse 3 ein, die Sprossen 4 und 5 bleiben menschlich. `hook-v1.md` nennt die Lücke und schließt sie nur im Bild. Im Ton verspricht der Hook mehr als die Prognose (§4: der Hook führt nicht in die Irre; am Fernseher hören viele nur zu).
- **0:41–0:52** ist ein Fahrplan an der Stelle, an der 15 von 15 Filmen 7 bis 24 Punkte verlieren. Bei #21 stand an derselben Stelle „Six questions get you there, rung by rung“ und flog raus. **0:52–0:57** (L9) sagt in anderen Worten, was man seit 0:14 weiß. Das erste Bild zum Staunen (30.000 Agenten) fällt erst bei 1:01.
- **Drei Zahlen in Minute 1** (neun von zehn, 2027, fünf). Die Regel erlaubt eine. Die Fünf ist die billigste.

**Vorschlag:** Datum benennen, kurze Schläge, das Bild vor die Leiter, L9 und „five“ streichen. Die Fünf zeigt das Bild; `hook-v1.md` bietet diese Sparfassung selbst an. Zusammen 5 Wörter kürzer als L7–L10.

> Close enough that last week, the people behind the best-known forecast in A.I. moved their date for a machine that could do it. Not later. Earlier. To twenty twenty-seven. All of them.
>
> Inside that same lab, at any given moment, about thirty thousand A.I. agents are at work on its research and engineering. A small town's worth of workers. None of them human.
>
> Picture a ladder between today and that machine. A.I. already stands on the first rung: writing the code. And the last rung decides how this ends.

Zeiten: Prognose 0:31–0:45, Agenten 0:45–0:57, Leiter 0:57–1:08, danach L11 unverändert. Im Leck-Fenster liegen dann ein Datum und ein Bild, die Struktur kommt erst danach. „could do it“ benennt die Fähigkeit, nicht das Ereignis; das deckt sich mit L52 („machines can design the machines“).

**Mindestfassung,** falls die Reihenfolge des Gerüsts bleiben soll: nur „for a machine that could do it“ einfügen, „with five rungs“ und L9 streichen.

**Titelworte:** Sobald der Titel steht, müssen seine Worte in die ersten Sekunden. Satz 1 trägt bisher keinen der beiden Arbeitstitel. Ohne Jakobs Satz 1 anzufassen, geht es über L3: *"And while it answers, A.I. is already building its successor."*

### M3 · Die Leiter klingt 0:52–3:54 wie eine Liste (§3.3a, §3.3b, Bann-Liste „Wegweiser“)

**Stelle:** L9, L16, L19, L24, L27, L34, L39.

**Problem:** Dreimal dieselbe Schablone: Schild („The second rung is running the experiments.“), Beleg, Abhaken („So, rung two, running the experiments: taken.“), danach noch der Zwischenstand („Two rungs taken, one shared.“). In drei Minuten höre ich sieben Mal Sprosse plus Nummer. Jede Station endet zwar mit Wendung und Frage, das erfüllt §3.3a dem Buchstaben nach. Das Ohr hört trotzdem Punkt 1, Punkt 2, Punkt 3.

Diese Form ist auf dem Kanal zweimal durchgefallen:

- **#24 v2:** „First rung: yes.“ / „Second rung: names. Yes.“ / „Third rung: yes, though disputed.“ Jakob am 9.11.: „ich steig irgendwie schnell immer wieder aus“. Ursache laut Neubau-Notiz: „sieben Arten und eine Leiter mit fünf Sprossen in fünf Minuten, ohne Figur, der man folgen kann“. Der Neubau bekam die Vorgabe „Keine Leiter, kein ‚rung‘“.
- **#21 v1:** Kritik vom 6.11.: „sieben gesprochene Kapitelschilder … Das Wort ‚rung‘ kennt kaum ein Nicht-Muttersprachler.“ Lösung dort: „Keine gesprochenen Kapitelschilder. Die Leiter bleibt nur im Bild. Jede Station beginnt hörbar mit der Antwort auf die Frage davor.“
- **Hook-Bauplan:** „Path one.“ kostete 3,8 Punkte. „Jede Ansage, die sagt, was jetzt kommt, statt es zu zeigen, ist ein Ausstiegspunkt.“

Die Leiter selbst steht nicht zur Debatte: Jakobs Entscheidung, und der Kernsatz braucht „the last rung“. Es geht nur um die gesprochenen Schilder.

**Vorschlag,** vier Regeln für die Einarbeitung:

1. Keine Station beginnt mit dem Namen der Sprosse. Sie beginnt mit der Antwort auf die Frage davor.
2. Jede Sprosse wird einmal benannt, im Urteil. Dort ist sie ein Gewinn.
3. Nummern und Zwischenstand trägt das Bild. Der gezählte Stand kommt im Ton erst am Schluss, als große Antwort (M5).
4. Einmal „rung“ mit „step“ koppeln, für Nicht-Muttersprachler.

Konkret:

- **L9** streichen (M2).
- **L16:** *"So the first step up the ladder, writing the code: taken."* Ohne „People still steer“, das steht schon in L15.
- **L19:** kein Schild, sondern die Antwort: *"By the lab's own verdict: yes. …"* (M1a).
- **L27:** statt „That's the third rung: leading the research.“: *"Until this year, the answer was: people."* Dann L28.
- **L34** bleibt, das ist das Urteil.
- **L39:** „Two rungs taken, one shared.“ streichen, nur *"So how fast is the climb?"*
- **L65** bleibt. Dort ist die Benennung der Sprossen 4 und 5 die Pointe.

### M4 · Fünfeinhalb Minuten ohne „du“, und der Rat am Ende ist vage (§1.5, §6.5, Wochenanalyse H7)

**Stelle:** 0:10–5:50 (zwischen L2 und L56 kein „you“) · L79 (8:58).

**Problem:** Der Film beginnt bei meinem Assistenten und kehrt bei 9:38 zu mir zurück. Dazwischen schaue ich Labors zu. Die „eine Erkenntnis“ aus dem Gerüst (§1 Fundament: bei der nächsten Schlagzeile „KI baut KI“ fragen: auf welcher Sprosse?) steht nicht im VO. Sie wäre das Werkzeug, das ich mitnehme. Der einzige Rat („learn how this works, and speak up“) sagt nicht, wovor er schützt, stammt aus einer Liste vom Juni 2025 und kommt als „jemand rät“ in der letzten Minute.

**Vorschlag:**

**(a) Werkzeug,** nach L35 (3:31), vor dem Abo-Aufruf:

> So the next time a headline says A.I. is building A.I., ask one question: on which rung?

**(b) Rat, ersetzt L79.** Eine konkrete Frage statt „speak up“. Sie schützt davor, dass die letzte Sprosse bei den Firmen bleibt, die gegeneinander rennen.

> That includes the people you vote for. The question for them takes no expertise: who checks the labs, and who can call a stop? Ask it, and the last rung isn't left to the companies racing each other up the ladder.

**(c)** Zwei weitere Stellen mit „you“ stecken in M7 (die Erklärung von „led“ über den eigenen Assistenten, 2:59) und in K2 (warum mich das Tempo angeht, 4:16). Damit schrumpft die längste Strecke ohne Anrede von 5:40 auf unter 3 Minuten.

### M5 · Schluss 9:11–9:56: Die große Antwort fehlt, „still ours“ fällt zweimal, ein Satz stimmt nicht (§3.1, §2.4, §8.4)

**Stelle:** L80–L86.

**Problem:**

- **Die Frage aus dem Hook** („how close is A.I. to building its successor with no one at the controls?“) wird nie beantwortet. Stattdessen kommt bei 9:24 eine neue Frage („your last year before superhuman A.I.?“) mit der Antwort „It might be.“ Der Film hat die bessere Antwort längst: den Stand der Leiter.
- **L80 nimmt die Pointe vorweg:** „The deciding is still ours“ (9:14) und „That's the rung that matters“ (9:20), 40 Sekunden vor „That's the last rung. And it's still ours.“ Der Kernsatz landet als Wiederholung.
- **„Machines are taking over the building“** klingt ohne Bild nach einem Gebäude, und „taking over“ nach Machtübernahme. Der Texter merkt das selbst an.
- **Wahrheit:** „The next one may be designed by a machine“ passt nicht zu dem, was der Film belegt. Die nächste wird laut 0:10 schon gebaut, und zwar so: „People steer“ (0:23), „nowhere … fully on its own“ (2:54). Selbst die Prognose meint eine Maschine, die forschen *kann* (5:26). Satz 1 dagegen besteht die Prüfung (Abschnitt 4).

**Vorschlag:** Stand der Leiter als Antwort, Pointe nur einmal, wahrheitsfeste Fassung des zweiten Kernsatz-Teils. Die Entscheidung über den Kernsatz liegt bei Jakob (Gerüst §0: „Kritiker prüft die Wahrheit“).

> Machines now do the building. People still do the deciding: what gets built, who checks it, and when to stop.
>
> [thoughtful] So how close is A.I. to building its own successor?
>
> Two rungs: taken. The third: shared, and by the best-known forecast, taken within a year. The last two: still in human hands. And that forecast only holds if nobody chooses to slow down.
>
> [pause] Tomorrow you'll ask your assistant something small. A recipe. An email.
>
> You may be using one of the last A.I. models designed by human minds. The next one may be able to design its own successor. Whether it's allowed to is still a human decision.
>
> That's the last rung. And it's still ours.

Falls der Titel „Your Last Year Before Superhuman AI“ gewinnt, bleibt die Titelfrage bei 9:24, aber mit dem Stand der Leiter als Antwort: *"By the best-known forecast, it's the last year before a machine can do the research. The two rungs above it stay human for as long as people hold them."*

### M6 · Zwilling #55 und Rückgriffe auf Film 2: Stoff aufteilen, bevor die Hörfassung entsteht (§2.5, §3.4)

**Stelle:** L2 und L84 · L4 · L20–L22 · L41–L44 · L74 · dazu L40 und L78 (Film 2).

**Problem:** #55 „The Best AI Is Locked Away“ (Gerüst am 16.11. freigegeben, `vo-v1.txt` liegt vor) erzählt im selben Stapel dieselben fünf Bausteine, teils fast wortgleich.

| Baustein | #31 `vo-v1.txt` | #55 `vo-v1.txt` |
|---|---|---|
| Szene | L2 „Tomorrow you'll ask it something small.“ · L84 Rückkehr | L2 „Tonight, you'll ask the A.I. on your phone about a letter from the bank …“ · L72 Rückkehr |
| Code | L4 „nine out of every ten changes to its code“ | L20 „more than nine in ten changes … It is helping to build its own successor.“ |
| Fermat | L20–22 „Thirty hours. The lab's first run had taken eleven days.“ | L11 „… a computer could check every step. In eleven days.“ |
| Tempo und Schwärzung | L41, L44 | L54 „almost twice as fast as a year ago … key evidence was blacked out“ |
| Gebremste Fähigkeit | L74 | L48 „it held back one skill on purpose. A.I. research.“ |

Bei Fermat hören Zuschauer beider Filme sogar zwei verschiedene Zahlen für dasselbe Ereignis: in #55 sind die elf Tage das Wunder, in #31 der langsame alte Lauf. Der Faktenzettel #31 nennt #55 in §7 nicht. Dazu das Muster im Stapel: #31 und #55 öffnen und schließen beide mit „du fragst die KI auf deinem Handy etwas Kleines“; #49 beginnt laut Gerüst ebenfalls am Telefon (ein Anruf mit geklonter Stimme). #31 hat eine Leiter mit fünf Sprossen, #55 eine Schlange mit fünf Plätzen. „held back“ kommt auch in #59 vor (L99). Das ist das Schablonen-Risiko aus §3.4, und es gilt die Regel vom 19.10.: Pläne der laufenden Threads lesen und den Stoff aufteilen.

**Vorschlag** (Entscheidung beim Koordinator und bei Jakob, nicht beim Texter):

- **#31 behält:** neun von zehn (sein Titelbeleg), den Bericht der Prüfer samt Schwärzung (Station 4 hängt daran), die gebremste Fähigkeit als einen Satz.
- **#31 gibt ab:** Fermat. Die Station passt hier ohnehin schlecht: Eine Beweis-Formalisierung ist kein Experiment, und 30 Stunden gegen 11 Tage vergleicht Maschine mit Maschine. Ersatz: K2 und der OpenAI-Befund (M1a).
- **#55 kürzt im Gegenzug** L20 und L54 auf je einen Halbsatz.
- **Handy-Szene:** Wer zuerst erscheint, behält den Wortlaut. #31 braucht sie für den Kernsatz („the A.I. you are using“), sollte sie aber im Bild anders lösen als #55.
- **Film 2:** L40 auf einen Halbsatz kürzen (neu ist der Bericht vom 05.11., nicht die Prüfer im Haus). L78 Satz 1 (Kanal Washington–Peking) streichen oder durch das Neue ersetzen (K5).

### M7 · „led“ erklären (2:44): Daran hängen Klarheit und die Wahrheit von Satz 1

**Stelle:** L27–L29.

**Problem:** „its model led … About a quarter“. Was heißt „led“? Ohne Erklärung klingt es, als führe die KI ein Viertel der Forschung allein, und der nächste Satz („nowhere … fully on its own“) wirkt wie ein Widerspruch. Laut `recherche-roh.md` (Stufen nach Epoch) heißt „AI leads“: Das Modell erledigt den größten Teil einer Aufgabe nach einer groben Vorgabe, ein Mensch beaufsichtigt. Genau diese Definition stützt Satz 1 („designed by human minds“: Die Vorgabe kommt vom Menschen).

Zwei Dinge für den Faktenzettel: Die Definition steht dort nicht, also eintragen und am Original prüfen. Und „By September“ prüfen: Veröffentlicht wurde am 17.09., die Stichprobe stammt laut Rohrecherche aus dem Juli.

**Vorschlag,** ersetzt L27–L28, L29 bleibt. Die Erklärung läuft über den eigenen Assistenten des Zuschauers.

> [thoughtful] Until this year, the answer was: people.
>
> In February, by Anthropic's own estimate, its model led less than one percent of the lab's A.I. research. A few months later? About a quarter.
>
> "Led" works the way you use your own assistant: a person sets a rough goal, the model does most of the rest, and the person checks the result.

### M8 · Kritische Einordnung: drei Lücken schließen (§1.9a, §6.4, „Anthropic nie einziger Zeuge“)

**Stelle:** L41–L46 (4:11–4:58) · L73–L78 (7:51–8:58).

**Problem:**

- **Der Börsen-Anreiz kommt zu spät und am falschen Ort.** Er fällt bei 4:27 und hängt an der Zahl der externen Prüfer. Die eigenen Zahlen des Labors (neun von zehn, 30.000, „as well as a skilled human“, ein Viertel) liefen davor vier Minuten ohne diesen Hinweis.
- **„they say“ macht aus einer Schätzung eine Feststellung.** Im Bericht steht „We guess … perhaps ≈80 %“.
- **Das Urteil unterschlägt den zweiten Streit.** „The speed-up is real. Its size is still an open fight.“ Strittig ist auch die Ursache: Maschine oder Geld (sechsfache Ausgaben). Und das Urteil gilt für dieses eine Labor.
- **Lösungsakt:** dreimal Anthropic als Zeuge in eigener Sache (Monitor, gebremste Fähigkeiten, Option zur Pause), in der Woche des Börsengangs. Ein zweiter Zeuge steht im Faktenzettel (2d): Pachocki will die Sicherheitsregeln der Labs zur Pflicht machen.

**Vorschlag (a),** ersetzt L41–L46. Ohne „Now the fine print“ (ein Wegweiser, und „fine print“ steht schon in L14).

> This month, they published. Their estimate: the lab's models now improve almost twice as fast as a year ago.
>
> And most of that, by their best guess, comes from putting A.I. to work, with people still in the loop.
>
> But look at where these numbers come from. So far, every one came from the labs themselves, or passed through their hands. And this lab is going public this month. Speed sells.
>
> The evaluators say the lab blacked out most of their best evidence.
>
> And outside critics add up the bill: about six times the spending, for twice the speed.
>
> So here's what the evidence supports. At this lab, the speed-up is real. How big it is, and how much of it is the machine's doing, is still an open fight.

Die kleinere Schätzung (Ord, etwa 1,4-fach) und „gemessen wurden Testwerte, nicht das Forschungstempo“ bleiben als Einblendung.

**Vorschlag (b),** ersetzt L78.

> Here, even rivals sound alike. Anthropic says the world should have the option to pause, with rules set beforehand and people from outside the A.I. companies at the table. OpenAI's chief scientist wants the labs' safety rules made mandatory.

---

## 3. KANN

**K1 · Abo-Aufruf Mitte (3:42):** Die offene Frage vor den Aufruf ziehen, damit niemand an einer geschlossenen Schleife aussteigt. Nach dem Werkzeug aus M4a: *"And then a second one: how fast is the climb?"* Dann der Aufruf, danach: *"How fast? Don't take the lab's word for it. Ask the outsiders it let in."*

**K2 · Warum mich das Tempo angeht (nach dem Aufruf):** *"The speed matters to you for one reason: it decides how much time is left to agree on the rules."*

**K3 · Brins Kleingedrucktes (1:35):** Das „But“ in L15 widerspricht Brin nicht („hand in hand“ heißt ja: Menschen und Modell). Der echte Einwand aus demselben Bericht steht nur im Bild. Vorschlag: *"There, A.I. does write most of the code. But so far, the lab itself reports no clear sign that its research as a whole has sped up."* Das pflanzt die Tempo-Frage, die Station 4 erntet (Google: kein klarer Schub; Anthropics Prüfer: fast doppelt).

**K4 · Monitor ehrlicher und mit Einsatz (7:51–8:05):** Der Monitor ist selbst eine Maschine, und der Sandbox-Befund sagt, wovor er schützt (§6.5). *"At Anthropic, every action those agents take passes a monitor first: a machine watching the machines. About fifty cases a week reach a person."* Und: *"Here is why that matters. In the lab's own tests, its newest model reached outside its sandbox, for files or passwords, in about three of every hundred scenarios."*

**K5 · Eine Uhr für den Lösungsakt:** Der zweite UN-Dialog zur KI-Aufsicht ist für den 3./4. Mai 2027 angesetzt, Kokotajlos Datum ist der Mai 2027. *"The next United Nations talks on governing A.I. are set for May, twenty twenty-seven. The same month as the lead forecaster's date."* Im Faktenzettel als (S) markiert, also prüfen. Ersetzt den Kanal Washington–Peking, den Film 2 schon erzählt hat.

**K6 · L66 ohne die zwei Halbzitate** („just no longer the method“, „scale, pause, or deploy“ stolpern im Ohr): *"Back to today. By the labs' own account, people still hold both: they set the goal, and they decide whether to go on or to pause."* (8 Wörter kürzer)

**K7 · L56 konkret machen:** statt „Other calls for this year, they missed“: *"They expected a stock boom and mass protests by now. Neither has come."*

**K8 · Zahlen:** Mit Fermat verschwinden drei Zahlen aus der dichtesten Stelle. In Station 5 „the end of twenty twenty-eight“ statt „December, twenty twenty-eight“ und „everyone on his team“ statt „all six forecasters on the team“.

**K9 · Stolperer fürs Ohr:**

- L11 „both numbers are its own“ verlangt Rückrechnen. Besser: *"The lab is Anthropic, and those are its own numbers."*
- L44 „most of the evidence they found most telling“ (zweimal „most“). Besser „most of their best evidence“ (in M8).
- L76 „heads of the biggest A.I. companies“: Für OpenAI unterschrieb Brockman, nicht der Chef. Besser „leaders“.
- L35 „on the record“ reibt sich mit „blacked out“ eine Minute später. Besser: *"It's happening on a ladder, one measured rung at a time."*

**K10 · Wörter, die vom Release-Tag abhängen:**

- „last week“ (L7) stimmt nur bei Release vom 16. bis 22.11.
- „This month“ (L41, L74) stimmt bis 30.11.
- „is selling its shares to the public right now“ (L43): Laut Recherche zu #59 wird die Preisfestsetzung am Mi 18.11. abends US-Zeit erwartet, der erste Handelstag am Do 19.11. Ab dann: „has just gone public“. Die Zeitform am Release-Tag setzen.

**K11 · Echo zu #59:** „It's a forecast, not a schedule“ (L83) klingt wie „a price is a forecast, not a verdict“ (#59, L136), wenige Tage vorher. In M5 fällt der Satz ohnehin weg.

**K12 · Altmans zweites Datum ernten** (nur mit K2): in Station 5 ein Satz, *"OpenAI's own target for that machine was March, twenty twenty-eight. The forecasters now say: sooner."*

**K13 · Prüfskript:** Marker `[CLIP K3]` auf `[ZITATKARTE K3]` ändern. Außerdem schlägt „ICH-SATZ?“ auf „A.I.“ an: 21 der 23 Hinweise sind Fehlalarme. Echt sind zwei (Minute 1: das Jahr 2027 und neun Zahlwörter).

**K14 · Für den Faktencheck:**

- Wortlaut von K1, K2, K6, K7 am Video, mit ±30 s Kontext und Musik-Prüfung.
- Definition von „led“ (M7) und der Stichproben-Monat.
- „measured test scores“ gegen den METR-Bericht.
- Pachockis Forderung nach Pflicht-Regeln (S).
- UN-Termin (S).
- Ob der Monitor ein automatisches System ist (K4).
- Termine des Börsengangs am Release-Tag.

**Länge:** Alle MUSS-Vorschläge zusammen ergeben etwa 1.435 Wörter Erzähltext (+55) und 34 s Clips (+10 s), VO-Ende etwa 10:40 statt 10:07. Das liegt in der Regel (1.300–1.500 Wörter, 8–11 Minuten), aber über den ~10:00 aus dem Gerüst. Mit K6 (−8), L49 ohne zweite Hälfte (−8) und L40 als Halbsatz (−4) sind es etwa 10:32. Für ~10:15 müsste ein ganzer Baustein weichen; das empfehle ich nicht, weil die 34 Sekunden fast ganz aus dem zusätzlichen Clip, der Erklärung von „led“ und dem Werkzeug für den Zuschauer bestehen.

---

## 4. Regel-Checkliste §1–§9

| § | Ergebnis | Eine Zeile |
|---|---|---|
| 1 Haltung | **nicht bestanden** (knapp) | Staunen, Hoffnung statt Doom, keine Ich-Sätze, keine Offenlegung: ja. Aber „du“ fehlt von 0:10 bis 5:50 (§1.5), und §1.9a hat drei Lücken (M4, M8). |
| 2 Thema und Leitgedanke | **nicht bestanden** | Ein Leitgedanke, Kernsatz in Hook und Schluss, Recherche datiert: ja. §2.5: fünf Bausteine doppelt mit #55, zwei Rückgriffe auf Film 2 (M6). §2.5a: Hook hat „du“, Titel offen. |
| 3 Story | bestanden mit Auflage | Fragen-Kette, Uhr, Szenario mit hörbarer Brücke hinein und zurück, zweimal „subscribe“ mit Mission als Frage, kein QR: ja. Auflagen: Kapitelschilder (M3), große Antwort im letzten Fünftel fehlt (M5), Aufruf Mitte ohne offene Schleife (K1). |
| 4 Hook | bestanden mit Auflage | Satz 1 trägt den Kern, Frage fertig bei 0:31 (76 Wörter), erster harter Fakt 0:31–0:41, ohne Bild verständlich. Auflagen: „their date“ unbestimmt, 0:41–0:57 ohne Neues, drei Zahlen in Minute 1, Titelworte fehlen (M2). Statistik in der Szene: so im Gerüst freigegeben. |
| 5 Sprache | bestanden mit Auflage | Bann-Liste 0 wörtliche Treffer, „A.I.“, Tags ohne Flüstern, Länge im Rahmen. Auflagen: rund 23 Zahlen-Nennungen, gut 2 pro Minute statt 1 (Häufungen 2:05–2:54 und 5:03–5:26); vier Wegweiser dem Sinn nach (M3, M8); Fachwörter in K3 und K10. |
| 6 Payoff | bestanden mit Auflage | Titel vom Typ „AI builds AI“ bis 1:25 eingelöst, ein Mitnehm-Fakt pro Akt, Kenner lernen Neues, Zweifel dosiert und mit Urteil. Auflagen: Rat bei 8:58 vage (§6.5, M4), Staunen in Sprosse 2 kommt nicht an (M1a, M6). |
| 7 Clips | **nicht bestanden** | 0 von 3 nötigen Clips am Original geprüft, K3 ist ein Schrift-Zitat, K6 mit Auslassung im Satz (M1). Anteil und Abstände wären in Ordnung. |
| 8 Titel | nicht prüfbar | Freigabe läuft. Hinweis zu §8.4: „Superhuman AI“ im Titel wäre zugespitzt, die Prognose meint einen übermenschlichen KI-*Forscher*. Dann muss der Hook das Wort „researcher“ hörbar tragen (M2 löst das). |
| 9 Thumbnails | nicht prüfbar | Noch keine. Hinweis zu §9.4: Leiter als Hauptmotiv gegen #21 (dort sollte die Leiter laut Kritik vom 6.11. im Bild bleiben) und gegen die Jarvis-Idee (Erlaubnis-Leiter) prüfen. |

### Die Prüfpunkte aus dem Auftrag, je eine Zeile

| Prüfpunkt | Befund |
|---|---|
| Fragen-Kette | Intakt: Jede Station beantwortet eine Frage und öffnet die nächste. Schwachstellen: Sprosse 2 (Frage gut, Beleg passt nicht), Übergang 3:25–3:54 (Schleife vor dem Aufruf zu), Schluss (neue Frage statt Antwort auf die Hook-Frage). |
| Leiter als Liste (§3.3a) | Dem Buchstaben nach nein, im Ohr ja (M3). |
| Hook-Timing | Frage 0:25–0:31 · erster harter Fakt 0:31–0:41 (vor 0:45) · Leiter 0:41–0:52 · Wiederholung 0:52–0:57 · erstes Staunen-Bild erst 1:01 (M2). |
| Staunen | Minute 1: 0:14 (neun von zehn) und 0:31 (2027, alle). Sprosse 1: 30.000 Agenten. Sprosse 2: kommt nicht an. Sprosse 3: unter 1 % auf ein Viertel, stark, sobald „led“ klar ist. Station 5: Dezember 2028 auf Mai 2027. Station 6: 6 zu 4. Lösungsakt: schwach (K4, K5). |
| Kritische Einordnung | Vorhanden und gut dosiert: Anreiz Börse, Schwärzung, zwei Kritiker, Bilanz und Interesse der Prognostiker. Drei Lücken (M8). |
| Wahrheit von Satz 1 | **Besteht.** Dreifach abgesichert („may“, „one of the last“, „designed“ statt „built“). Belege: „humans supply the goal“; „research taste and judgment“ noch menschlich; „not operating fully autonomously for any measured subset“; OpenAI: „People still set our research priorities“; im Februar leitete das Modell unter 1 %. Der Zusatz „mainly“ aus `hook-v1.md` ist nicht nötig, wenn „led“ erklärt wird (M7). |
| Wahrheit im Schluss | „The next one may be designed by a machine“ besteht nicht (M5). |
| Zahlendichte | Rund 23 Nennungen, gut 2 pro Minute (ohne das sechsmal genannte Jahr 2027 rund 17). Der Texter zählt 13 Stellen. |
| Clips | Siehe M1: K2 und K7 neu, K3 als Karte, K3 von 2025 als sichere Reserve. |
| Ton ohne Bild | Der Hook funktioniert, die Leiter wird ausgesprochen. Unklar nur im Ton: „their date“, „that moment“, „both numbers“, „the lab's first run“, „taking over the building“, das Fachzitat bei 7:29. |
| Kernsatz am Ende | Die Ernte (Handy-Szene plus Satz 1) trägt. Die Pointe ist bei 9:14 schon verbraucht, und ein Satzteil stimmt nicht (M5). |

---

## 5. „Nach dem Film weiß ich, dass …“

1. … bei einem führenden Labor (Anthropic) eine KI etwa neun von zehn Änderungen am Code schreibt und dort rund 30.000 KI-Agenten gleichzeitig arbeiten. Beides nach Angaben der Firma.
2. … „KI baut KI“ kein Schalter ist, sondern eine Leiter: Code schreiben und Experimente fahren sind genommen, Forschung leiten ist geteilt (im Februar unter 1 %, wenige Monate später etwa ein Viertel), Ziel und Stopp liegen bei Menschen.
3. … externe Prüfer im Labor schätzen, dass es seine Modelle fast doppelt so schnell verbessert wie vor einem Jahr. Dass das Labor aber den größten Teil ihrer besten Belege geschwärzt hat, gerade an die Börse geht und Kritiker auf sechsfache Ausgaben verweisen.
4. … die Autoren von „AI 2027“ ihr Datum für einen übermenschlichen KI-Forscher auf 2027 vorgezogen haben (der Hauptautor von Dezember 2028 auf Mai 2027). Dass das nur gilt, wenn niemand bewusst bremst, dass ihre Bilanz gemischt ist und dass sie selbst eine Pause wollen.
5. *(letztes Drittel)* … in ihrem Szenario alles an einer Abstimmung hängt, 6 zu 4, und dass es dabei nicht ums Bauen geht, sondern um die zwei obersten Sprossen. Und dass der Chefwissenschaftler von OpenAI sagt: Kein Labor kann diese Systeme gut genug steuern und prüfen, um mit Höchsttempo weiterzumachen.
6. *(letztes Drittel)* … die Bremsen von heute dünn und freiwillig sind: ein Monitor, bei dem rund 50 Fälle pro Woche einen Menschen erreichen; ein Labor, das nach eigener Aussage Forschungsfähigkeiten gebremst hat; zugesagte, aber nicht vorgeschriebene Prüfungen von außen.

Das ist mehr als Artikel-Wissen. Die Punkte 2, 5 und 6 habe ich in den gegengelesenen Filmen so nicht gefunden.

**Was ich nach v1 NICHT weiß (und wissen sollte):**

- was „led“ heißt (M7);
- was genau ich tun oder fragen kann (M4);
- wie nah wir nun sind, als eine Antwort am Stück (M5);
- warum der Fermat-Beweis etwas mit Experimenten zu tun hat (M6);
- ob „the next one“ das Modell ist, das gerade gebaut wird, oder das danach (M5).

---

## 6. Reihenfolge für die Einarbeitung

1. **Clips am Original prüfen:** K2, K1, K6, K7, dazu K3 von 2025. Erst danach steht fest, welche Fassung von Station 2 und 5 gilt. Das blockiert alles andere.
2. **Aufteilung mit #55 klären** (Koordinator): Fermat, Handy-Szene, Tempo-Satz.
3. **Struktur:** Hook (M2), Kapitelschilder (M3), Schluss (M5).
4. **Tiefe und Du:** „led“ (M7), Werkzeug und Rat (M4), Einordnung (M8).
5. **Kürzen und Ohr:** KANN-Liste, dann `regel_check.py` mit korrigiertem K3-Marker.
6. **Faktenzettel nachtragen:** Definition von „led“, Termine des Börsengangs. Dann Hörfassung mit der Zeile „Regel-Check: X/Y“.
