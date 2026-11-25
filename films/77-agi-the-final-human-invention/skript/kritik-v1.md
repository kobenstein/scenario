# Kritik v1 · #77 „AGI: The Final Human Invention“ · 25.11.2026

Kritiker (Fable 5.2). Blick: normaler Zuschauer (Mann 35–54, schaut am TV, kein Fachwissen): leicht zu folgen, keine Sprünge, relevant für ihn, Staunen, hoffnungsvoll ohne Hype.
Gelesen: `schreibraum/REGELN.md` (Stand 24.11.), `geruest-v1.md`, `faktenzettel.md` (ganz), `hook-v1.md`, `text-v1.md`, `vo-v1.txt`, dazu `clips.json` (C1–C4), `stopp1-thema-titel.md`, `stopp2-leitgedanke.md`. `regel_check.py vo-v1.txt` gelaufen: 11 Hinweise, alle unechte Ich-Sätze („A.I.“/„A.G.I.“), Gegenprobe ohne Punkte: 0. Zeiten bei 2,4 Wörtern pro Sekunde wie in v1 (nachgerechnet, Stimme endet bei 10:42), auf die volle Sekunde abgerundet; `text-v1.md` rundet, darum liegen dieselben Stellen dort bis zu 1 s später.

**Regel-Check v1: 47 von 56 Punkten bestanden, 8 nicht bestanden, 1 nicht prüfbar.** Nicht bestanden: §1.1 (teilweise), §1.4 (bewusst), §1.5, §3.3, §3.5, §4 (Fenster 0:30–0:50), §5.3, §6.4.

## Kurzurteil

v1 ist sauber gebaut: eine Uhr (vier Zeilen, ein Test), eine große Schleife (die zweite Hälfte von Goods Satz), ehrliche Kalibrierung, ein starker Schluss mit Liam Price, Kernsatz und Schlusspointe sitzen. Der Faktenzettel ist fast lückenlos eingehalten. Das bleibt.

Für den Zuschauer am Fernseher hat v1 fünf Schwächen, nach Gewicht:

1. **Die Mitte dämpft mehr, als sie staunen lässt.** Fach 1: 12 s Wunder (3:09–3:21), danach 20 s Einschränkung in vier Portionen (3:21, 3:33, 3:36, 3:44). Fach 2: 17 s Wunder (4:16–4:33), dann 17 s Clip-Anlauf, dann fünf Dämpfer in 19 s (5:00–5:19), das Urteil endet auf „But small ones.“ Gefühl nach 5:25: „also doch nichts“. Das ist ehrlich, aber gegen §6.4 und §3.5.
2. **Drei Minuten ohne neue Frage und ohne „you“.** Zwischen 2:59 und 5:39 (160 s) öffnet sich keine neue Frage, genau im Fenster Minute 1–5 (§3.2: größter Hebel). Von 4:04 bis 7:18 fällt 194 s lang kein „you/your“, von 0:29 bis 2:26 sind es 117 s.
3. **Station 1 ist ein Zitate-Block.** Vier Zitate in 42 s (1:08, 1:34, 1:43, 1:50), dazu ein 20-Wörter-Satz mit vier Kommas (1:17). Die Hook-Frage von 0:29 liegt bis 2:48 auf Eis.
4. **Hook: die Zahl kommt erst bei 0:48,** davor 6 s Rätsel-Erklärung an der teuersten Stelle. Das Hook-Ende springt mit „And“ vom Rätsel zu „a single sentence“, behauptet „Only its first half is famous“ ohne Beleg und endet 6 s nach 1:00.
5. **Länge.** Stimme bis 10:42, Ziel ≤ ~10:15.

Alle fünf lassen sich ohne neuen Fakt beheben. v2 soll: Zweifel bündeln und als Antwort auf eine Frage des Zuschauers erzählen, Station 1 auf 40 s Geschichte kürzen, den Hook bei 1:00 beenden, 69 Wörter netto sparen.

---

## 1 · Regel-Checkliste §1–§9 (v1)

| § | Regel | Urteil | Stelle |
|---|---|---|---|
| 1.1 | Staunen ist die Handlung, erst Wunder, dann erklären | **teilweise nicht bestanden** | Wunder da (0:48, 3:09, 4:24–4:33, 6:14, 9:38), aber 3:21–3:47 und 5:00–5:24 dämpfen länger, als das Wunder dauert |
| 1.2 | Kein Bericht-Ton, Quellen ins Bild | bestanden, eine Stelle | 8:08–8:38: drei Rechtsräume, fünf Zeitangaben („Since May“, „since August“, „January first“, „months old“, „This fall“). 3:23 Firmenname „Lila Sciences“ im Satz unnötig |
| 1.3 | Hoffnung, kein Doom, kein Hype | bestanden | keine Hype-Wörter; Turing 7:43 und Christiano 9:04 bekommen im selben Akt Wirksamkeit (8:01, 9:09, 9:14) |
| 1.4 | Blick nach vorn, Geschichte nie in den ersten 2 Minuten | **nicht bestanden (bewusst)** | 1:06–1:54 gehört Good, Bletchley, Turing. Nötig für die Titel-Einlösung, aber auf ~40 s kürzbar |
| 1.5 | Hauptperson „du“ | **nicht bestanden in der Mitte** | 194 s ohne „you“ (4:04–7:18), 117 s (0:29–2:26) |
| 1.6 | Keine Ich-Sätze | bestanden | 0 |
| 1.7 | Fairness | bestanden | 5:32 „reaches all of us“ |
| 1.8 | Sinn nur als Frage | bestanden | 10:02 „Maybe that is what stays with us.“ |
| 1.9 | Pflege nicht verklären | bestanden | kommt nicht vor |
| 1.9a | CEO-Aussagen kritisch | bestanden | Hassabis 2:04/2:22, Lila 3:21, OpenAI 5:54, Fedus 4:38, Christiano 8:40. Ohr: „so he has a stake in this“ zweimal wörtlich; bei Hassabis steht das Interesse davor und danach |
| 1.10 | Keine Anthropic-Offenlegung | bestanden | Anthropic kommt nicht vor |
| 2.1 | Treffer-Check | bestanden | `stopp1`, `stopp2` |
| 2.2 | Ein Leitgedanke, höchstens eine Metapher | bestanden | die Liste mit vier Zeilen; „steer“ nur im Schlusssatz |
| 2.3 | Leitgedanke ohne Rechenbeispiel | bestanden | |
| 2.4 | Kernsatz klingt im Hook an und kehrt zurück | bestanden | 0:16–0:27 → 10:20 |
| 2.5, 2.5g | Keine Wiederholung früherer Filme | bestanden laut Faktenzettel 0.2–0.10 | von mir nicht an den alten Skripten geprüft |
| 2.5a | Technik nur mit Du-Bezug | bestanden | 0:02, 0:29 |
| 2.5b | Recherche top aktuell | bestanden, Vorbehalt | Faktenzettel 24.–25.11., aber kein Original gesehen (nur Suchauszüge) |
| 2.5c | Keine Medizin | bestanden | Brille statt Medikament |
| 2.5d | Treffer-Tor | bestanden | Ereignis „KI erfindet schon“ plus Du-Frage |
| 2.5e | Marktcheck je Schritt | bestanden | Gerüst §5, `hook-v1.md` |
| 2.5f | Personen-Check | bestanden laut Faktenzettel | offen: Gowers („solicited by OpenAI“, unbestätigt) |
| 2.6 | Ablauf mit Jakob | bestanden | Leitgedanke freigegeben |
| 3.1 | Fragen-Kette | bestanden, drei schwache Glieder | 0:53 („And …“), 3:51 (Brücke ist Aussage, keine Frage), 8:38 („And the science?“ ohne Bezug) |
| 3.2 | Uhr in der Mitte | bestanden | Liste ab 2:26, Test 2:37. Die Urteile klingen aber nicht wie Sprossen („no longer just waiting“, „has begun, too“, „isn't waiting“) |
| 3.3 | Alle 60–90 s eine neue offene Frage | **nicht bestanden** | 2:59–5:39 keine neue Frage (160 s) |
| 3.3a | Liste nie als Aufzählung | knapp bestanden | Fach 1 und 2 laufen nach demselben Muster: Imagine → Erklärung → Wunder → Dämpfer → kleines Urteil |
| 3.3b | Ein roter Faden, wenige Sprünge | bestanden | Goods Satz und die Liste tragen; New York (8:26) ist ein Ortswechsel ohne Ertrag |
| 3.3c | Klickfrage ehrlich beantworten | bestanden | 10:08–10:25; die Hook-Frage wird am Ende aber nicht hörbar zurückgeholt |
| 3.4 | Dramaturgie wechseln | nicht prüfbar | Vergleich mit den Vorfilmen fehlt mir; drei plus eine Zeile liegt nahe an „drei Dinge“ |
| 3.5 | Lösungen in Szenen, keine Politik-Liste; Zweifel bündeln | **nicht bestanden** | 8:08–8:38 Politik-Liste; Zweifel in Fach 1 und 2 an jedem Absatz |
| 3.6 | Zeitwechsel mit hörbarer Brücke | bestanden | 1:13, 1:57 |
| 3.7 | Keine Alltagsabläufe ohne Einsatz | bestanden | |
| 3.8 | Ende, Abo-Aufruf zweimal mit Mission als Frage | bestanden | „subscribe“ 5:37 und 10:41; keiner im Hook; Ende nicht angekündigt |
| 4 · 0–3 s | Titelworte, Thumbnail-Motiv | bestanden | 0:00 |
| 4 · 3–30 s | Szene mit dir, eine Hauptfrage | bestanden | 0:02–0:29; Frage endet nach 78 Wörtern |
| 4 · 30–50 s | Nicht erklären; harter Fakt | **nicht bestanden** | 0:39–0:45 erklärt das Rätsel (16 Wörter), die Zahl fällt erst 0:48 |
| 4 · 50–60 s | Erster Gewinn, der die nächste Lücke öffnet | knapp bestanden | 0:53–1:06: fünf abstrakte Nomen, kein Bild im Kopf, 6 s über 1:00 |
| 4 · Verbote | 1 Zahl, 1 Frage, kein Jahr, kein Fahrplan | bestanden | „eighty“, ein Fragezeichen |
| 4 · Ohr | Ohne Bild verständlich | bestanden | |
| 4 · Du | Beispiel betrifft den Zuschauer | bestanden | „The glasses on your face“ trifft nicht jeden |
| 4 · Gegentest | Fremder nach 60 s | knapp bestanden | siehe Abschnitt 2 |
| 5.1 | Fürs Ohr | bestanden, sechs Stolperstellen | Abschnitt 6; rund 20 echte Zahlen in 10:42 (Richtwert ~1 pro Minute), drei im selben Atemzug bei 6:05–6:14 |
| 5.2 | Bann-Liste | bestanden | 0 Treffer (Skript und von Hand) |
| 5.3 | Neuheit zeigen, nie behaupten | **nicht bestanden** | 0:58 „Only its first half is famous.“, 1:06 „the famous half“ (Faktenzettel 0.14: nicht geprüft) |
| 5.4 | „A.I.“, Regie-Tags, kein Flüstern | bestanden | |
| 5.5 | Länge | bestanden (1.424 Wörter) | Laufzeit 10:42 liegt über dem Ziel dieses Auftrags |
| 6.1 | Titel-Einlösung bis 1:30 | bestanden | 1:08 |
| 6.2 | Mitnehm-Fakt pro Akt | bestanden | Abschnitt 3 |
| 6.3 | Kenner-Test | bestanden | Bedingung im Wortlaut, falsches Datum, Überlebens-Satz, Fälle 2026 |
| 6.4 | Zweifel dosieren, dann urteilen | **nicht bestanden** | Fach 1: vier Dämpfer; Fach 2: fünf, einer davon dünn („None is known to be in mass production“) |
| 6.5 | Rat sagt, wovor er schützt | bestanden | kein Rat; die Tore sagen, was sie können |
| 6.6 | Staunen-Probe | bestanden | je Akt eine Stelle; Minute 1 nur mittel (abstraktes Rätsel) |
| 7 | Clips | auf dem Papier bestanden | 4 Clips, 42 s, 6,5 %, Abstände ≥ 97 s. Kein Wortlaut geprüft, C2-Sprecher offen, 40 Wörter Anlauf vor C2 |
| 8 | Titel (von Jakob gesetzt) | skriptseitig bestanden | Titelworte in Satz 1, Einlösung 1:08. Das Titelwort „A.G.I.“ fällt nach 0:16 nie wieder |
| 9 | Thumbnails | skriptseitig bestanden | Frame 0 = Thumbnail-Motiv, Motiv kommt im Film vor (0:00, 2:26, 10:25). Hinweis für den Thumbnail-Schritt: „FINAL HUMAN INVENTION“ nennt allein keine KI (§9.6, §8.8), das Bild muss sie zeigen |

---

## 2 · Hook-Gegentest (§4)

Ein Fremder hört nur die erste Minute, nur Ton.

| Frage | Antwort nach v1 | Urteil |
|---|---|---|
| Worum geht es? | A.G.I. ist eine Maschine, die alles kann, was ein Kopf kann, auch erfinden. Sie wäre die letzte Erfindung von Menschen, danach erfindet sie. | klar |
| Warum ist es echt? | Dieses Jahr hat eine KI ein 80 Jahre altes Rätsel beantwortet, ein Mathematiker hat es geprüft. | klar, aber fern: ein Punkte-Rätsel ist für ihn keine „Erfindung“ und hat keinen Einsatz |
| Welche Frage ist offen? | „Was erfindet sie für mich?“ und „Was ist die Bedingung?“ | zwei Schleifen. Die zweite ist als „nächste Lücke“ erlaubt, sie ist aber abstrakt formuliert |
| 0:45 stärker als 0:30? | Bei 0:30 steht eine persönliche Frage. Bei 0:45 steckt er in der Rätsel-Erklärung, die Zahl kommt erst 0:48. | **nur knapp.** Das Ergebnis (0:34) ist da, die 6 s Erklärung danach kosten den Schwung |

**Welche der drei Varianten ist am stärksten?** A („Look around you“), mit drei Eingriffen.
- **A** steckt den Zuschauer ab Sekunde 2 in ein Bild, das er sofort prüfen kann, erklärt das Kürzel auf der Pointe („Including invent.“) und hat den Rate-Moment vor der Zahl.
- **B** hat den direktesten Nutzen, stellt aber drei Wünsche vor jeden Beleg, behauptet mit „is being built to be“ etwas über die Erbauer, das erst C1 stützt, lässt die Zahl ohne Rate-Moment fallen und nimmt der Liste bei 2:26 die Neuheit. Die Wunschliste gehört dorthin, wo v1 sie hat.
- **C** hat die größte Fallhöhe, beginnt aber mit Rad, Buchdruck, Glühbirne (Geschichtsstunde in Sekunde 3), der Zuschauer kommt nur in einem Halbsatz vor, und „But not from us.“ kippt in Verlust.

**Die drei Eingriffe in A:**
1. Rätsel nicht erklären (die genaue Frage steht im Bild), so fällt die Zahl bei 0:45 statt 0:48. `hook-v1.md` sieht diese Kürzung selbst vor.
2. „stood unsolved“ streichen: Es zieht „solved“ nach, das Faktenzettel H1 und `hook-v1.md` ausdrücklich verbieten. „been waiting“ pflanzt dafür das Motiv des Films („still waiting“).
3. Hook-Ende als Wende statt mit „And“, ohne die Ruhm-Behauptung, in kurzen Schlägen. Der Hook endet dann bei 1:00, der Originalsatz steht bei 1:02.

Dazu eine Kleinigkeit: „The screen in front of you“ statt „The glasses on your face“ (jeder Zuschauer hat gerade einen Bildschirm vor sich, nicht jeder eine Brille).

**Hook v2 (146 Wörter, Frage 0:30, Ergebnis 0:35, Zahl 0:45, Ende 1:00):**

> A.G.I. may be the final human invention.
> Look around you. The light over your head. The phone in your hand. The screen in front of you.
> Each of them was invented by a person. So was every invention in history.
> A.G.I. would be the last. Artificial general intelligence: a machine that can do what a human mind does. Including invent.
> From then on, it invents for us. Faster than we ever could.
> So what will it invent for you?
> The inventing has already begun.
> This year, an A.I. found an answer no human had found.
> To a puzzle about dots on a page.
> Guess how long it had been waiting.
> Eighty years.
> A mathematician who checked the answer called it a milestone.
> But the idea of a final invention goes back to a single sentence. Half promise. Half condition. And the condition is up to us.

Gegentest v2: Bei 0:45 fällt die Zahl, bei 0:50 öffnet sich die zweite Schleife, bei 1:00 beginnt ohne Pause „Here is the promise.“ Damit ist 0:45 klar stärker als 0:30.

Geprüft und verworfen: Liam Price als Hook-Fakt (für den Laien der nahbarste Fall, aber er trägt den Schluss, und H1 ist der extern geprüfte Fall) · der gebaute Supraleiter als Hook-Fakt (wäre wörtlicher „erfunden“, steht im Faktenzettel aber nicht als Hook-Kandidat und hat einen großen Haken) · Satz 1 ohne „may“ (behauptet, was offen ist).

---

## 3 · Payoff-Check (§6)

**Titel-Einlösung:** 1:08 der Originalsatz, mit Verfasser, Ort und Begründung bis 1:31. Bestanden. Danach dreht der Film nicht weg.

**„Nach dem Film weiß ich, dass …“**
1. … der Satz von der „letzten Erfindung“ über 60 Jahre alt ist und von Jack Good stammt, der im Krieg in Bletchley Park für Alan Turing Codes knackte.
2. … Good darin kein Ende sah: Unser Überleben hänge am Bau dieser Maschine. Und dass er sich beim Datum verschätzt hat.
3. … ein Labor, das von einer KI geführt wird, in drei Monaten fast 3.000 Katalysatoren gebaut und getestet hat (bisher nur laut Firma), und dass ein von einer KI entworfener Supraleiter wirklich gebaut wurde, aber nur nahe dem absoluten Nullpunkt funktioniert.
4. … eine KI dieses Jahr eine 80 Jahre offene Mathe-Frage beantwortet hat und ein Prüfer sie „without hesitation“ für die wichtigste Zeitschrift empfohlen hätte; und dass ein anderes System offene Probleme für je ein paar Hundert Dollar löst.
5. *(letztes Drittel)* … Goods Satz eine zweite Hälfte hat: nur wenn die Maschine „docile“ genug ist. Dass in den USA fünf große Entwickler ihre Modelle vor dem Start prüfen lassen (freiwillig), Europa seit August prüfen, strafen und zurückrufen darf, und dass laut einem führenden Forscher noch keine Methode sicher auf Kurs ist.
6. *(letztes Drittel)* … ein 23-Jähriger ohne Mathe-Abschluss mit einer einzigen Frage an ChatGPT ein rund 60 Jahre altes Problem geknackt hat und heute Mitautor von Terence Tao ist.

Sechs Punkte, zwei im letzten Drittel, keiner ist bloßes Artikel-Wissen. Bestanden.
Was er für die nächste Schlagzeile mitnimmt: zwei Prüffragen, „Has the inventing begun?“ und „Who decides what it works on?“ Das ist die eine Erkenntnis nach §11, sie ist da.

**Kenner-Test:** Bestanden. Wer Kurzgesagt, Aperture und Miden Tech kennt, kennt den Satz, aber kaum die Bedingung im Wortlaut, „docile“, das falsche Datum und den Überlebens-Satz, dazu die datierten Fälle von 2026. Alle fremden Thesen sind zugeschrieben. Einwand eines Kenners, den v1 offen lässt: Good schrieb von einer „ultraintelligent machine“, der Titel sagt A.G.I. v2 verbindet beide einmal hörbar (1:47, „They call it A.G.I.“, gestützt auf F11).

**Staunen-Probe:**

| Akt | Stelle | Stärke für den Laien |
|---|---|---|
| Minute 1 | 0:48 „Eighty years.“ | mittel: Die Zahl ist stark, das Rätsel fern |
| Station 1 | 1:17 Turing, 1:43 „survival of man“ | mittel bis stark; im Kommasatz geht Turing unter. In v2 eigene Zeile: „His first boss there was Alan Turing.“ |
| Fach 1 | 3:09 fast 3.000 Katalysatoren in drei Monaten | mittel: „catalyst“ ist kein Ding, das er kennt |
| Fach 2 | 4:24–4:33 „never existed … And it worked.“ | stark |
| Fach 3 | 5:59 „without hesitation“, 6:14 ein paar Hundert Dollar | stark |
| Fach 4 | 7:25 der ganze Satz | stark, wenn die zweite Hälfte vorher noch einmal benannt wird |
| Schluss | 9:38 Liam Price | sehr stark |

Je Akt eine Stelle: bestanden. Das Staunen wird aber zweimal sofort weggedämpft (Fach 1, Fach 2).

**Zweifel dosieren (§6.4):** Nicht bestanden in Fach 1 und 2, siehe Änderung 1. **Rat (§6.5):** kein Rat im Film; in Fach 4 ist benannt, was jedes Tor kann und wer entscheidet. Bestanden.

---

## 4 · Fragen-Kette und but/therefore: wo man den Faden verliert

Beats von v1 mit Bindewort. **Fett** = „and then“, Aufzählung oder Essay.

- **Hook:** A.G.I. wäre die letzte Erfindung → *also* was erfindet sie für dich → *schon jetzt:* das Rätsel → **„And“** die Idee stammt aus einem Satz (0:53). *Sprung vom Rätsel zum Satz, die Wende ist als Anhängsel getarnt.*
- **Station 1:** der Satz → wer → warum → **„Turing had said it even earlier“** (1:34, reiht ein viertes Zitat an) → *aber* kein Ende → *aber* Datum falsch → *also* warum ihm glauben → *weil* heute gebaut wird → *aber* ein Erbauer ist kein Zeuge → *also* prüfen → **„Make a list“** (2:26, Sprung: Wessen Liste? Die drei Zeilen sind die des Films, nicht seine: „Materials that don't exist yet“ wünscht sich niemand).
- **Fach 1:** Wunsch → begonnen? → Katalysatoren → *aber* nur Firmenangabe → **dann** Tausende Labore → *aber* nur Prognose → *aber* Menschentempo → *also* Rechnung sinkt nicht, *aber* die Zeile wartet nicht mehr → *und* es war ein Stoff. *Vier „aber“ auf ein Wunder; die Brücke bei 3:51 ist gut.*
- **Fach 2:** Wunsch → Supraleiter → gebaut, funktioniert → Clip-Anlauf (40 Wörter) → *aber* nicht viel → *aber* nur bei Kälte → *aber* nur das eigene Team → *aber* nur am Bildschirm → *aber* keine Massenproduktion → *also* begonnen, *aber* klein. *Dämpfer-Kette, Essay-Ton. Hier steigt aus, wer auf „für dich“ gewartet hat.*
- **Abo-Aufruf** an einer geschlossenen Stelle; die nächste Frage („Why so small?“) kommt erst danach. Vertretbar (§3.8), 12 s.
- **Fach 3:** *warum* klein → *weil* Materie langsam ist → *aber* Mathe muss nichts bauen → das Rätsel → geprüft → **„And a Google DeepMind system“** → *aber* nur ein kleiner Teil → *aber* seitdem jeden Monat → Tao → Echo → Name dafür → **dann** 25 Preisträger → *also* schneller, als Menschen folgen → *also* wer entscheidet. *Gute Steigerung, aber 6:29–7:06 sind 37 s über die Sorgen der Mathematiker, und dem Laien sagt niemand, warum ihn Mathe angeht. „severely misaligned“ versteht er nicht.*
- **Fach 4:** *also* Goods Satz geht weiter (7:21; die zweite Hälfte wurde zuletzt bei 2:43 erwähnt, vor 4:40 min) → Bedingung → Turing dunkler → *also* unsere Aufgabe → Menschen haben begonnen → USA → **und** Europa → **und** New York → *aber* nichts fertig → **„And the science?“** (Welche Wissenschaft?) → keine Methode auf Kurs → *aber* die Maschinen zum Untersuchen → *also* wer schreibt die Zeile. *8:08–8:38 ist eine Politik-Liste im Bericht-Ton.*
- **Schluss:** Labore, Regierungen, Wähler → **„Which leaves you.“** (Wähler ist er doch schon: kleiner Bruch) → Price → *also* die Fragen und die Richtung → Liste → vierte Zeile → Kernsatz. *Stark. Die Hook-Frage wird nicht wörtlich zurückgeholt.*

**Schleifen-Abstand:** neue offene Fragen bei 0:29, 0:53, 1:54, 2:37, 2:41, dann erst 5:39, 6:21, 7:11, 8:38, 9:27. Das Loch liegt bei 2:59–5:39.

---

## 5 · Fakten: Stellen, die mehr sagen als der Faktenzettel

Der Sprechtext hält den Faktenzettel fast durchgehend ein. Neun Stellen gehen darüber hinaus oder lehnen sich weit hinaus:

| Zeit | Satz in v1 | Befund | In v2 |
|---|---|---|---|
| 0:45 | „Guess how long it had stood **unsolved**.“ | H1 und `hook-v1.md`: nicht „solved“. Die KI hat eine Vermutung widerlegt | „Guess how long it had been waiting.“ |
| 0:58, 1:06 | „Only its first half is **famous**.“ / „the famous half“ | nicht belegt (0.14: nicht prüfbar); dazu §5.3 | „Half promise. Half condition.“ / „Here is the promise.“ |
| 3:04 | „**The hard part** is the catalyst“ | steht nicht im Faktenzettel (F14 warnt schon vor „Iridium ist knapp“) | „It takes a catalyst, a material that makes the reaction run.“ |
| 5:15 | „**None is known** to be in mass production.“ | F25: dünn („habe ich nicht gefunden“). Kein Fund ist kein Beleg | gestrichen |
| 6:21 | „But **since then**: a new claim almost every month.“ | F30 listet Ansprüche vom 8.9., 6.10., 27.10., 20.11., 23.11. Für Juni bis August steht dort keiner; „since then“ (seit Mai) trägt nicht. Die Formulierung stammt aus dem „Sag“-Vorschlag von F30, die Liste darunter deckt sie nur für den Herbst | „But this fall: a new claim almost every month.“ Bildnotiz: Kalender September bis November, nicht Juni bis November |
| 4:35 | „Liam Fedus **helped create ChatGPT**.“ | nur laut The Generalist (F24); dazu offen, wer in C2 spricht | bleibt, als offen markiert; ohne Namen im Sprechtext |
| 8:47, 9:04 | „went through **every** method we have“, „**even probably**“ | F40: nur aus einem Fremdtranskript, kann eine Zusammenfassung sein. „every method“ steht so im „Sag“-Vorschlag von F40, belegt sind dort fünf Ansätze | „the methods we have“; „even probably“ bleibt, hängt am Clip |
| 0:18, 3:00, 4:11 | A.G.I.-Erklärung, Wasserstoff, Supraleiter | Lexikon-Glossen ohne Quelle im Faktenzettel (vom Texter selbst gemeldet, Punkt 15) | bleiben, im Faktencheck gegenlesen |
| 1:34 | „Turing had said **it** even earlier“ | ungenau: Turing schrieb vom Überholen, nicht von der letzten Erfindung | Satz gestrichen |

Nicht beanstandet, aber fürs Protokoll: „about a day of computing“ (4:16) steht für 28 GPU-Stunden, das ist Rechenzeit, kein Kalendertag. „co-founded Google DeepMind“ (2:04) folgt der Bauchbinde aus Faktenzettel 0.4.

Neu in v2 und aus dem Faktenzettel gedeckt: „His first boss there was Alan Turing.“ (F3: Turing leitete Hut 8, als Good im Mai 1941 anfing; F3 schlägt „His boss was Alan Turing“ selbst vor) · „They call it A.G.I.“ (F11: „by ‚solve intelligence' we meant build AGI“) · „our survival, Good wrote, depends on building this machine“ (F9, Umschreibung; der Wortlaut steht auf der Karte) · „Too many proofs, not too few.“ (F31, Nature: die Krise komme von zu vielen, nicht von zu wenigen Beweisen) · „the A.I. companies and the mathematicians want different things“ (F32, Umschreibung von „goals … severely misaligned“; der Wortlaut steht auf der Karte) · „Voluntarily.“ (F36).

---

## 6 · Ohr

**Stolperstellen in v1:**
1. 1:17 „During the Second World War, he worked at Bletchley Park, in Hut Eight, with Alan Turing, breaking German naval codes.“ 20 Wörter, vier Kommas, fünf Angaben. „Hut Eight“ sagt dem Zuschauer nichts.
2. 1:34 „… would soon ‚outstrip our feeble powers.‘“ Altes Englisch, viertes Zitat in Folge.
3. 1:43 „The survival of man depends on the early construction of an ultra-intelligent machine.“ Als Vorlese-Zitat schwer; als Umschreibung leicht.
4. 3:09 „an A.I.-run lab“: für die Stimme heikel. Besser „a lab run by A.I.“
5. 7:00 „The goals of the A.I. companies and of mathematicians, they wrote, are ‚severely misaligned.‘“ Einschub, Ellipse und ein Fachwort.
6. 8:17 „… fine its maker, and, as a last resort, order it off the market.“ 22 Wörter, Doppelkomma.

**Dazu:**
- **Zwei Liams.** „Liam Fedus“ (4:35) und „Liam Price“ (9:38), beide im Satz mit ChatGPT. Fedus steht in der Bauchbinde, im Sprechtext braucht es den Namen nicht.
- **Formel doppelt:** „so he has a stake in this“ bei 2:04 und 4:38.
- **Der Name „Good“** klingt wie das Adjektiv. „Good's promise“, „Good's reasoning“ kann man falsch hören. An Wiedereinstiegen „Jack Good“ sagen.
- **„His reasoning“ (1:26)** direkt nach Turing: Wessen?
- **Fachwörter:** „A.G.I.“ (erklärt 0:18), „catalyst“ (erklärt), „superconductor“ (erklärt), „docile“ (erklärt), „general-purpose model“ (halb erklärt), „misaligned“ (**nicht erklärt**), „proof indigestion“ (erklärt sich). „Hut Eight“ raus.
- **Drei Namen für eine Maschine:** „A.G.I.“, „ultra-intelligent machine“, „superintelligence“ (im Abo-Aufruf). Einmal verbinden.
- **Zahlen:** rund 20 echte Zahlen. Raus können „Hut Eight“ und „January first“; „fifty-six years“ wird „more than half a century“.

Satzlänge sonst gut (im Mittel 7 Wörter). Goods ganzer Satz (29 Wörter, 7:25) bleibt wörtlich, mit Atempause vor „provided“.

---

## 7 · Länge

v1: 1.424 Wörter, Stimme bis 10:42, mit Endbild 10:57. Ziel: Stimme ≤ ~10:15. Bei unveränderten Clips (42 s) heißt das höchstens rund 1.360 Wörter.

**Streichungen und Straffungen (Wort für Wort gegen `vo-v1.txt` gezählt, Zeiten von v1):**

| Stelle | Was | Wörter |
|---|---|---|
| 0:39–0:45 | Rätsel-Frage gesprochen streichen (steht im Bild) | −8 |
| 0:53–1:08 | Hook-Ende in kurzen Schlägen; „famous half“ → „promise“ | −7 |
| 1:34 | Turings erstes Zitat streichen (Vorschlag des Texters) | −14 |
| 1:40–1:48 | Überlebens-Satz umschreiben statt vorlesen | −6 |
| 1:57–2:25 | „actually“, „And their plan sounds a lot like his.“, Echo nach C1 straffen | −11 |
| 2:52–2:56 | „Imagine it cost almost nothing.“ (steht jetzt in der Liste) und „Drinking water made from the sea.“ | −10 |
| 3:04, 3:23 | „The hard part is“ → „It takes“; „Lila Sciences“ ins Bild | −4 |
| 3:33 | „That part is a forecast, not a fact.“ (das Wort „imagine“ trägt die Kalibrierung, der Stempel FORECAST bleibt im Bild) | −8 |
| 4:04, 5:19 | Wunsch-Zeile und Urteil von Fach 2 straffen | −6 |
| 4:33–4:50 | Clip-Anlauf C2 von 40 auf 31 Wörter | −9 |
| 5:02 | „So far, that isn't much.“ | −5 |
| 5:15 | „None is known to be in mass production.“ | −8 |
| 5:45 | „An idea counts the moment it's proven.“ (reibt sich mit „can't check them fast enough“) | −7 |
| 6:47–7:16 | Satz nach C3, Fields-Satz und „far bigger than mathematics“ straffen | −9 |
| 8:13–8:47 | „Since May“ (−2), New York (−13), „None of it is finished …“ (−16), Christiano-Rahmen (−1) | −32 |
| 9:26 | „Which leaves you.“ | −1 |
| **Summe Kürzungen** | | **−145** |
| Zusatz: Fragen des Zuschauers | „So when does your power bill shrink?“ mit „Not yet.“ und neuem Urteil; „So why isn't it in the power lines outside your home?“ mit Antwort | +15 |
| Zusatz: Fach 3 | „So that's where you can watch the inventing at full speed.“ | +11 |
| Zusatz: Fach 4 | Rückruf der zweiten Hälfte (+6), „his old boss, Alan“ (+4), „Rules work from the outside. And the machine itself?“ (+6), „That last one is you.“ (+5) | +21 |
| Zusatz: Titelwort und Bezug | „They call it A.G.I.“, „His plan:“, „should you“, die Liste als Frage, die Hook-Frage am Schluss | +14 |
| Zusatz: Ohr | Bletchley-Satz geteilt (+1), „a lab run by A.I.“ (+2), „Jack“ bei 3:27 und 9:09 (+2), „more than half a century“ (+3), „Voluntarily.“ (+1), Europa-Satz geteilt (+2), „screen in front of you“ (+1), dazu „like that“, „running“, „look at“ (+3) | +15 |
| **Summe Zusätze** | | **+76** |
| **Netto** | 1.424 → 1.355 | **−69** |

**Ergebnis v2: 1.355 Wörter, Stimme bis 10:13, mit Endbild 10:28.** Clip-Anteil 42 s von 613 s = 6,8 %.
Reserve, falls die echte Stimme langsamer spricht (zusammen −23): „Imagine heat without watching the meter.“ (−6) · „Has the inventing begun?“ bei 2:40 (−4) · „It cracked only a small share of what it tried.“ nicht streichen (ehrlicher Moment von Fach 3) · „So that what it invents reaches all of us.“ im ersten Abo-Aufruf (−9) · „Not to a professor.“ (−4).

---

## 8 · Die 10 wichtigsten Änderungen (priorisiert, mit Ersatztext)

### 1 · Fach 1 und 2: Zweifel bündeln und als Antwort auf seine Frage erzählen
**Problem:** vier und fünf Dämpfer nach je einem Wunder; die Urteile enden auf dem Kleinen; keine offene Frage, kein „you“ (§6.4, §3.5, §3.3, §1.5). **Lösung:** Nach dem Wunder stellt der Text die Frage, die der Zuschauer jetzt hat. Der ehrliche Haken wird zur Antwort (eine Auflösung statt eines Dämpfers). Das Urteil beantwortet den Test mit dessen eigenen Worten und endet auf dem, was da ist. Kein Fakt fällt weg außer dem dünnen („mass production“).

Fach 1, ab dem Wunder:
> In three months, a lab run by A.I. designed, made, and tested almost three thousand catalysts. And it found new ones that work, in a metal experts had written off.
> That's the company's own account. No outside lab has confirmed it yet.
> Now imagine the machine Jack Good described. Not one lab like that. Thousands, running day and night.
> So when does your power bill shrink?
> Not yet. Even a perfect invention has to be built, approved, and plugged in. And that still runs at human speed.
> But on the first line, the inventing has begun.
> And look at what that lab found. Not a power plant. A material.

Fach 2, ab dem Wunder (C2 rückt hinter den ehrlichen Moment; „only on a screen“ führt genau auf „needs a lab“):
> … Then the team behind it made it in a lab. And it worked.
> So why isn't it in the power lines outside your home?
> Because it only works in extreme cold, near absolute zero. So far, only its own team has tested it.
> And most A.I. designs still exist only on a screen.
> The man you'll hear next helped create ChatGPT. Today his own company builds labs where robots run the experiments. Here's why he says even the smartest A.I. still needs a lab:
> [CLIP C2]
> Only what gets built counts.
> So the second line has begun, too. Still small. But real.

### 2 · Hook 0:35–1:00: Zahl bei 0:45, Ende als Wende, Schluss bei 1:00
**Problem:** siehe Abschnitt 2. **Ersatz:**
> This year, an A.I. found an answer no human had found.
> To a puzzle about dots on a page.
> Guess how long it had been waiting.
> Eighty years.
> A mathematician who checked the answer called it a milestone.
> But the idea of a final invention goes back to a single sentence. Half promise. Half condition. And the condition is up to us.

Bild: Die genaue Frage („How many pairs can sit exactly the same distance apart?“) steht klein auf dem Blatt.

### 3 · Station 1: vom Zitate-Block zur Geschichte in 40 s
**Problem:** vier Zitate in 42 s, Kommasatz, §1.4. **Lösung:** zwei gesprochene Zitate (der Satz, „within the twentieth century“), Turing bekommt eine eigene kurze Zeile (das ist das Staunen), der Überlebens-Satz wird umschrieben (Wortlaut auf der Karte), Turings erstes Zitat fällt (er kehrt bei 7:16 mit „take control“ zurück). Fach 1 beginnt 14 s früher.
> Here is the promise.
> "The first ultra-intelligent machine is the last invention that man need ever make."
> It's more than sixty years old. Jack Good wrote it.
> In the Second World War, he helped break German naval codes at Bletchley Park. His first boss there was Alan Turing.
> The logic: a machine smarter than us can design a better machine. And that one, a better one still.
> It sounds like an ending. But our survival, Good wrote, depends on building this machine.
> He even guessed when: "within the twentieth century." About the date, he was wrong.
> So why should you take him seriously today?

### 4 · Die Liste zu seiner Liste machen, mit Brücke nach C1
**Problem:** „Make a list“ kommt aus dem Nichts; „Materials that don't exist yet“ wünscht sich niemand; das Interesse von Hassabis steht doppelt; das Titelwort A.G.I. ist seit 0:16 verschwunden. **Ersatz:**
> Because today, people are trying to build that machine. They call it A.G.I. Demis Hassabis co-founded Google DeepMind, so he has a stake in this. His plan:
> [CLIP C1]
> Jack Good's promise, in a builder's words. So check it against your own list.
> What are you still waiting for? Energy that costs almost nothing. Materials for a battery that lasts a week. Answers to puzzles that have beaten us for generations.
> For each line, one test: has the inventing begun?
> And leave a fourth line empty. It belongs to the second half of Good's sentence.

Fach 2 beginnt dann konkret vor abstrakt: „A battery that lasts a week. A home that keeps itself cool. Both are waiting for materials that don't exist yet.“ Die Zeile heißt weiter „Materials“ (der Beleg ist ein Supraleiter, keine Batterie).

### 5 · Fach 3: sagen, warum ihn Mathe angeht; „misaligned“ in Klartext
**Problem:** Der Laie weiß nicht, warum er einem Mathe-Teil folgen soll; 37 s Sorgen der Mathematiker; Fachwort; drei Zahlen in einem Atemzug. **Ersatz:**
> Why still small? Because matter is slow. But in mathematics, nothing has to be built. So that's where you can watch the inventing at full speed.

> … Two had waited more than half a century. The cost: a few hundred dollars each.
> It cracked only a small share of what it tried. But this fall: a new claim almost every month. Some so big that mathematicians can't check them fast enough.

> [CLIP C3]
> Too many proofs, not too few. Tao calls it "proof indigestion."
> In September, he and twenty-four other winners of math's highest prize signed a warning. Not against A.I. itself. Their point: the A.I. companies and the mathematicians want different things.
> So the third line isn't waiting. It's moving faster than people can follow.
> And that raises a bigger question: who decides what these machines work on? Your list, or someone else's?

„Want different things“ führt ohne Umweg auf „who decides“. Der Wortlaut „severely misaligned“ bleibt auf der Karte. Der Satz nach C3 wiederholt den Clip nicht mehr, er hält auch, wenn der Clip anders lautet.

### 6 · Fach 4: die zweite Hälfte hörbar zurückholen, Politik-Liste halbieren, Brücke zur Forschung
**Problem:** Die Schleife ist seit 4:40 min nicht mehr benannt; 8:08–8:38 ist eine Liste im Bericht-Ton (74 Wörter, in v2 46); „And the science?“ hängt in der Luft. **Ersatz:**
> This is where the second half of Jack Good's sentence comes in. Here is all of it.
> [ganzer Satz, unverändert]
> There's the condition. Docile: willing to be guided.
> Years earlier, his old boss, Alan Turing, had been darker: "At some stage therefore we should have to expect the machines to take control."
> [Erkenntnis, unverändert] … Making sure of that is our job.
> And people have started.
> Follow a new A.I. model on its way to your phone.
> In the United States, a government office can test it before launch. Five of the biggest developers have agreed to that. Voluntarily.
> In Europe, since August, regulators can test it themselves and fine its maker. As a last resort, they can order it off the market.
> Rules work from the outside. And the machine itself? Paul Christiano once led that research at OpenAI, and now sits on the board of its foundation. This fall, he went through the methods we have:
> [CLIP C4]

New York fällt (der Faktenzettel kennt nur die Schwelle, nicht die Pflichten; der Satz sagt nichts, was der Zuschauer behält). **Achtung:** New York stand im Auftrag des Texters; `text-v1.md` nennt die Streichung selbst als Notfall-Kürzung. Der Satz steht in `text-v2.md` unter „Ersatz-Bausteine“ und kostet beim Rückbau 13 Wörter (Stimme dann bis 10:18). Die ehrliche Lücke steht in einem Wort („Voluntarily.“), in „since August“ und in Christianos Urteil.

### 7 · Clip-Einordnungen: kürzer, ohne Formel-Doppel, ohne zweiten Liam
- C1: Interesse einmal davor, danach ein Satz, der den Bogen zu Good schlägt (siehe 4).
- C2: 31 statt 40 Wörter, ohne Namen im Sprechtext, Interesse als „his own company“ (siehe 1). Spricht Cubuk: „The man you'll hear next used to lead materials research at Google DeepMind. Today his own company builds labs where robots run the experiments. …“
- C3: unverändert davor; danach siehe 5.
- C4: siehe 6; „the methods we have“ statt „every method we have“.

### 8 · Schluss: die Hook-Frage wörtlich einlösen, „voters“ ist er selbst
**Problem:** „And voters … Which leaves you.“ bricht, die große Frage von 0:29 wird nicht hörbar geschlossen, das Titelwort fehlt am Ende. **Ersatz:**
> And voters, who choose who writes the rules. That last one is you.
>
> And if the machine does the inventing, what else is left for us?
> […]
> So what will A.G.I. invent for you? Three lines on your list. Not in your home yet. But begun.
> The fourth line is still empty. And it is ours to write.

Kernsatz und Schlusspointe bleiben wörtlich.

### 9 · Fünf Formulierungen an den Faktenzettel zurückholen
„unsolved“ → „been waiting“ · „famous“ → „promise“ · „The hard part is the catalyst“ → „It takes a catalyst“ · „since then“ → „this fall“ · „None is known to be in mass production.“ gestrichen. Siehe Abschnitt 5.

### 10 · Auf ≤ 10:15 kürzen
Tabelle in Abschnitt 7. Größte Posten: Politik-Block (−32), Turings erstes Zitat (−14), Hassabis-Rahmen (−11), Wunsch-Zeilen in Fach 1 (−10), Clip-Anlauf C2 (−9).

---

## 9 · Kleinere Änderungen

Zeiten mit „v1“ sind Stellen in v1, Zeiten mit „v2“ die neuen Stellen.

- v1 0:08 „The glasses on your face.“ → „The screen in front of you.“
- v1 3:09 „an A.I.-run lab“ → „a lab run by A.I.“
- v1 3:27 „the machine Good imagined“ → „the machine Jack Good described“; ebenso „Jack Good“ in v2 bei 2:06, 6:53 und 8:36 (der Name klingt wie das Adjektiv).
- v1 5:39 „Why so small?“ → „Why still small?“ (schließt an „Still small. But real.“ an).
- v1 8:47 „every method we have“ → „the methods we have“.
- Zitatkarten: Die Karte „outstrip our feeble powers“ (v1 1:34) entfällt mit dem Satz. Die Karten zum Überlebens-Satz (v2 1:28) und zur Fields-Erklärung (v2 6:28) zeigen den Wortlaut, den die Stimme umschreibt.
- Bild zu „this fall“ (v2 5:54): Kalender September bis November.
- Bild zum Weg des Modells (v2 7:40–8:04): zwei Tore statt drei.

## 10 · Was bleibt (bitte nicht anfassen)

Satz 1 und die Szene bis zur Hauptfrage · „Including invent.“ · der Rate-Moment · die Titel-Einlösung mit dem Originalsatz · „About the date, he was wrong.“ · der Test „has the inventing begun?“ · die Brücke „Not a power plant. A material.“ · „And it worked.“ · beide Abo-Aufrufe im Wortlaut · „Remember the dots on the page.“ · Goods ganzer Satz mit „Docile: willing to be guided.“ · „Follow a new A.I. model on its way to your phone.“ · die Liam-Price-Passage · „The machine found the way. A person chose the question. And people checked the answer.“ · Kernsatz und Schlusspointe.

## 11 · Verbleibende Risiken (auch nach v2)

1. **Kein Clip-Wortlaut ist geprüft.** Daran hängen in v2: der Satz nach C1 („Jack Good's promise, in a builder's words“), die Einordnung vor C2 („helped create ChatGPT“, Sprecher offen) und der Satz nach C4 („even probably“). Der Satz nach C3 hängt nicht mehr am Clip.
2. **§1.4 bleibt verletzt:** 40 s Geschichte ab 1:00. Ohne sie gibt es keine Titel-Einlösung bis 1:30.
3. **Der Hook-Beleg bleibt ein abstraktes Mathe-Rätsel,** und Satz 1 hat „may be“. Beides ist ehrlich, beides kostet etwas Zug zwischen 0:35 und 0:50.
4. **Fach 1 hängt an einer Firmenangabe (Lila).** Fällt sie im Faktencheck, steht F20 (Erdwärme in Nevada) bereit; dann fällt aber die Brücke „A material“.
5. **„They call it A.G.I.“** setzt Goods „ultraintelligent machine“ mit A.G.I. gleich, wie es der Titel tut. Ein Kenner kann widersprechen.
6. **C2 steht in v2 hinter dem ehrlichen Moment,** `clips.json` empfiehlt davor. Abstände bleiben ≥ 81 s.
7. **Länge 10:13** liegt knapp unter dem Ziel und hängt an 2,4 Wörtern pro Sekunde und an geschätzten Clip-Längen.
8. **§3.4 (Dramaturgie wechseln)** habe ich nicht gegen die Vorfilme geprüft.
9. **Fach 2 bleibt die nüchternste Strecke.** In v2 liegen bei 4:16–4:42 rund 25 s Haken und Clip-Anlauf am Stück, direkt vor dem Abo-Aufruf. Das trägt nur, wenn C2 ein starker, ganzer Satz ist.
10. **New York fehlt,** obwohl es im Auftrag des Texters stand (Rückbau-Satz in `text-v2.md`). Ebenso fehlt der gesprochene Satz „That part is a forecast, not a fact.“; die Prognose trägt jetzt „Now imagine“ und der Stempel im Bild.
