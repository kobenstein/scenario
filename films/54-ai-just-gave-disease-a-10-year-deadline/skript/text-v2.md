# Text v2 · „AI Just Gave Disease a 10-Year Deadline“ · The Good Takeoff (Film #54)

Stand 12.11.2026. Überarbeitung von `text-v1.md` nach `kritik-v1.md`. Umgesetzt sind alle MUSS-Punkte (M1–M5) sowie die KANN-Punkte K1–K4, K7 und K8. K5 steht als Bild-Hinweis unter „Hinweise“. K6 ist mit dem Clip-Nachtrag erledigt, K9 entfällt (C5 ist ein echter Clip).

**Nachtrag 12.11.:** Die Clip-Wortlaute stehen fest (`clips/schnitt.json`). Sie sind wortgleich eingearbeitet, die Einordnungssätze angepasst (Changelog, Punkt 0).

Grundlagen unverändert: `geruest-v1.md` (freigegeben), `faktenzettel.md` (Abschnitt 0 geht vor), `clips.json`, `schreibraum/REGELN.md` (Stand 11.11.), Koordinator-Vorgaben vom 12.11.:
- C1 und C1b sind gelesene Zitatkarten.
- C3 und C2 sind sichere Clips.
- C5 war zunächst nicht lokalisiert. Seit dem Nachtrag ist C5 ein echter Clip (nur Ton). Clip-Längen laut `clips/schnitt.json`: C3 10,5 s, C2 8,7 s, C5 9,3 s.
- Ziel 1.300–1.380 Wörter, ~1 Zahl pro Minute.

Hörfassung: `vo-v2.txt`. Keine Ich-Sätze. Keine Anlageberatung. Der Hook (A „Szene mit dir“, `hook-v1.md`) ist unverändert.

## Changelog v1 → v2

**Nachtrag 12.11.: Clip-Wortlaute aus `clips/schnitt.json`** (Koordinator: Wortlaute genau so verwenden, Einordnungssätze anpassen; C1/C1b bleiben gelesene Karten)

0. **Clips fest, Einordnung angepasst.**
   - **C3 (10,5 s)** beginnt mit „There's not efficacy, right?“ und nennt den Essay beim Titel. Kürzer geht es nicht, denn zwischen „right?“ und „And I make“ liegt keine Pause.
     - 1:11 nennt den Essay jetzt beim Namen, damit der Titel im O-Ton wiedererkannt wird: „Years ago, he wrote the same bet into an essay called Machines of Loving Grace. With small print.“ (+5 Wörter)
     - Einleitung 1:32: „he put his own limit on that.“ → „he made the same point, and set his own limit.“ „the same point“ nimmt Darios „I make exactly that point“ vorweg, und „There's not efficacy“ schließt an „most drugs barely work“ an. (+3 Wörter)
     - Nach dem Clip 1:50: Das Echo „Much faster. But not infinitely fast.“ hätte das Clip-Ende wortgleich wiederholt. Es ist ersetzt durch die Deutung „So even in his view, proof takes time.“ Sie verankert „proof“ und trägt auch ohne Clip (K6 erledigt). (+2 Wörter)
   - **C5 (9,3 s, echter Clip, nur Ton):** Weil man ihn nicht sieht, nennt die Einleitung jetzt den Namen: „The Nobel Prize-winning biologist Venki Ramakrishnan, asked this month …, named the slow part:“ (+2 Wörter). „named the slow part“ übersetzt „rate-limiting factor“ vorab. Die Deutung „The testing, not the finding.“ bleibt („computational work“ = finden, „experimental work“ = testen).
     - 6:32: „The other reason for his date“ → „…for Amodei's date“, weil direkt davor ein anderer Mann mit Namen spricht (±0 Wörter).
     - Fallback-Karte und Reserve C7 entfallen (K9).
   - **C2 (8,7 s):** Einleitung („warned of a jam“) und Echo („Discovery speeds up. Proof jams.“) passen unverändert zu „…the pipeline will get jammed up.“
   - **Folgen:**
     - 1.356 → **1.368 Wörter** (Vorgabe ✓).
     - Clips 23 s → 28,5 s. Der Sprechtext endet bei **10:07** statt 9:56 (+5,5 s Clips, +5 s Text), mit Endbild ≈ 10:29. Alle Zeiten sind neu berechnet.
     - Clip-Abstand C5→C2 bleibt 52 s. Dwarkesh zusammen 19,2 s (≤ 20 s, knapp).
     - `regel_check.py`: 0 Hinweise. [prüfen] im Skript weiter 16.

**MUSS (alle umgesetzt)**

1. **M1 · Station 6 ist eine Kette statt einer Stimmen-Liste (6:06–7:37).** Die Frage „why set a date at all?“ bekommt jetzt zwei Antworten.
   - **Erste Antwort, der Anreiz:** „Partly, because a sales pitch rewards a promise with a date on it. No villain needed.“
   - **Scharnier, der Nobelpreisträger:** Er nennt den langsamen Teil („named the slow part:“ → C5 → „The testing, not the finding.“). „The testing, not the finding.“ deutet den Satz und wiederholt ihn nicht. Seit dem Nachtrag ist C5 ein echter Clip (nur Ton, „rate-limiting factor“ statt „bottleneck“); die Deutung passt dazu (siehe Punkt 0).
   - **Zweite Antwort, seine Wette:** „The other reason for Amodei's date: he's betting that the testing can speed up too.“ Das hat er bei 1:39 selbst gesagt („much faster … but not infinitely fast“, F6, F7).
   - **Gestrichen:** Lilly („great, but unlikely“, nur sinngemäß, F31) und das Echo „The experiments. Always the bottleneck.“ (als Karte wäre es eine Doppelung).
   - **Neu bei Anthropics Medikament:** „First date: fast. Second date: years away.“ Das verankert die Schlüsselbegriffe am besten Beispiel neu.
   - **Schlussfrage jetzt direkt zu seiner Wette:** „So can proof come sooner, without making medicine less safe?“
   - Clip-Abstand C5→C2: 52 s (v1: 49 s).
2. **M2 · Länge und Zahlen.**
   - Die Kürzungsvorschläge aus text-v1 sind übernommen: „That's his theory, working.“, „The biggest drugmakers are already buying into one-time fixes like this.“ und Lilly (in M1).
   - Weitere Ersetzungen:
     - „Two years ago, he wrote …“ → „He wrote the same bet into an essay years ago, with small print.“ (seit dem Nachtrag mit Essay-Titel, Punkt 0)
     - „spread across a dozen different cancers. Three in four responded.“ → „spread across many different cancers. Most of them responded.“
     - „takes thousands of people, over years“ → „takes a stadium full of people, followed for years“ (Analogie statt Zahl)
     - „by twenty thirty-six“ (Station 5) → „by the deadline“
     - „One such trial already ran for more than four years. The drug didn't work. Another big one is due to finish next year.“ → „One such trial waited years for its answer. The drug didn't work.“
     - „doesn't start in twenty thirty-six“ → „doesn't start at the deadline“
     - „One step of that work takes a fraction of the time it used to.“ → „…helps design those hooks, in a fraction of the time.“
   - Die gestrichenen Zahlen stehen im Bild (12 CANCER TYPES · 75 %, 27,564 PATIENTS, 240 WEEKS).
   - Ergebnis zusammen mit K1, K3 und K4: 1.428 → **1.356 Wörter**, Sprechtext bis 9:56 (nach dem Clip-Nachtrag **1.368 Wörter, bis 10:07**, Punkt 0), Zahlen 17 → **12 Stellen** (≈ 1,2/min; ohne Titelzahl und Frist-Jahr 10 ≈ 1/min).
3. **M3 · Vorsichtig formuliert, was im Verkaufsvideo fehlt.**
   - „The sales pitch left that out.“ → „The line in the sales video just says: cancer.“ (2:58)
   - „The pitch left that out, too.“ → „The line in the sales video doesn't mention that either.“ (5:37)
   - Beide Sätze beziehen sich nur auf den zitierten Satz (C1). Sie bleiben wahr, auch wenn Dario an anderer Stelle im 42-Minuten-Video „most“ oder die Alzheimer-Einschränkung sagt. Zwei neue [prüfen]-Marken, weil beide am Wortlaut von C1 hängen.
4. **M4 · Der Schlusssatz stimmt am 16.11., egal ob der Preis steht.**
   - „This week, investors are putting a price on the first date.“ → „Investors are already putting a price on the first date.“ (9:41)
   - Vor der Preisfestsetzung: Die Spanne steht seit 10.11., die Orderbücher laufen. Danach: Die Anleger setzen den Preis im Handel weiter. Kein Wochenbezug mehr. [prüfen] bleibt (Stand am 16.11. vormittags; nur bei einer Absage muss der Satz neu).
5. **M5 · Verständlich ohne Bild.**
   - „half“ → „only halfway“ (3:48) bzw. „halfway“ (9:14)
   - „only about half the trials the regulator saw beat the sugar pill“ → „Even for the antidepressants already approved, only about half the trials beat the sugar pill.“ (FDA-Bezug in der Einblendung)
   - „In the lab, the first date is already moving.“ → „In the lab, the day a cure is found is already getting closer.“
   - „So can the second date come sooner …“ → „So can proof come sooner …“
   - „The heart shows the limit: …“ → „But remember the heart: …“

**KANN (umgesetzt)**

6. **K1 · Psilocybin-Satz gestrichen** (v1 4:55): Nebengleis, schweres Wort, umstrittener Beleg (F25). Seine [prüfen]-Marke entfällt mit dem Satz und ist im Faktencheck als gestrichen vermerkt.
7. **K2:** Die `[pause]` vor „This isn't about whether to buy the stock.“ ist gestrichen. Der Satz bleibt.
8. **K3 · Abo-Aufrufe gestrafft** (51 → 37 und 48 → 42 Wörter), beide mit Mission und als Frage, kein Spendenaufruf. In der Mitte entfällt „first date / second date“, weil die Begriffe dort ohne Anker stünden.
9. **K4 · Zitatkarte C1b gekürzt:** „I think if we do this right, we can create an age of miracles.“ (27 → 14 Wörter, die Karte zeigt „…“).
10. **K7 · [prüfen] nachgetragen** für Topol (F30), den X-Post vom August (F8) und die FDA-Prioritätsprüfung (F35). Diese Punkte hatte v1 nur in der Faktencheck-Liste.
11. **K8:** „Fewer people on a placebo“ → „on a sugar pill“ (dasselbe Wort wie bei 4:19 und 8:03); „accepts it for certain measurements“ → „accepts it for some trials“.

**KANN (als Hinweis):** K5 (Labor-Staunen über das Bild). K6 (Echo nach C3) ist mit dem Clip-Nachtrag erledigt, K9 (dritter echter Clip, falls C5 Karte wird) entfällt. **Nicht übernommen:** „Picture someone you love …“ ohne „Picture“. Es ist eine Szene von heute und kein Szenario (§3.6), und „Picture“ spiegelt den Hook.

**Folgen**
- Alle Zeiten neu berechnet (2,4 W/s; Clips laut `clips/schnitt.json`: C3 10,5 s, C5 9,3 s, C2 8,7 s; `[pause]` 1,5 s; Absatz 0,6 s).
- Tafel-Urteile bei 3:02, 3:48, 4:47 und 5:41; die Tafel ist komplett bei 7:30.
- Station 6 heißt jetzt „Der Pitch und seine Wette“.
- „Nach dem Film“: Punkt 2 ohne „ein Dutzend“, Punkt 4 mit Anthropics Medikament.
- Faktencheck: entfallen sind Lilly (F31), der Pharma-Kauf (F19, nur noch Hintergrund), TRAILBLAZER „next year“ und Psilocybin (F25).
- **[prüfen]: 16 Stellen im Skript.** v1 hatte 11; davon sind 10 übernommen, 1 entfällt mit dem Psilocybin-Satz. Dazu kommen 3 neue (2:58, 3:40, 5:37) und 3 nachgetragene (6:38, 6:46, 8:21).

---

## Kopf

**Leitgedanke (LG1):** Jede Heilung hat zwei Daten. Das erste (gefunden) könnten die Maschinen schnell genug liefern. Über Darios Frist entscheidet das zweite (bewiesen), und das setzt der Körper:
- bei Krebs in Wochen
- beim Herz in Wochen und Jahren
- bei der Psyche leise
- bei Alzheimer erst nach Jahrzehnten

Ergebnis ✓ ½ ? ✗. Das zweite Datum lässt sich vorziehen, ohne Medizin unsicherer zu machen, und das entscheiden Menschen, nicht Maschinen.

**Kernsatz:** „Every cure has two dates: the day it's found, and the day it's proven.“
- Wendung im Hook: 0:31
- Ernte: 9:35
- verwandelte Rückkehr: 9:41, „Investors are already putting a price on the first date. The second one is still ours to move.“

**Fundament (§11, aus dem Gerüst, unverändert):**
1. *Fokus mit „aber“:* Das ist eine Geschichte über eine Frist. Der Chef eines der größten KI-Labore sagt, Krebs, Alzheimer, Herzkrankheit und psychische Krankheit seien in weniger als zehn Jahren Geschichte. Spannend ist aber: Die Maschinen könnten schnell genug sein. Über die Frist entscheidet, wie lange ein menschlicher Körper braucht, um eine Heilung zu beweisen, und das ist für jede der vier Krankheiten anders.
2. *Frage hinter der Frage:*
   - Der Klick fragt: „Heilt KI bis 2036 Krebs und Alzheimer?“
   - Der Film fragt: Was entscheidet, wann eine gefundene Heilung bei Menschen ankommt, und wer kann das beschleunigen?
3. *Die eine Erkenntnis:* Jede Heilung hat zwei Daten. Bei der nächsten Schlagzeile „KI findet Mittel gegen X“ fragt der Zuschauer: Wie schnell kann ein Körper darauf antworten?
4. *Missverständnis, das gebrochen wird:*
   - „Wenn die KI das Mittel findet, ist die Krankheit erledigt.“ (Hook, Stationen 2–5)
   - Das kleine zweite: „Studien sind langsam wegen Bürokratie.“ Meist sind sie langsam, weil die Mittel kaum wirken. Das ist Darios eigene These (Station 1), und sie stimmt bei Krebs (Station 2).
5. *Wert:* Ehrlichkeit gegenüber Kranken: Hoffnung, die einen Termin aushält.

| Kennzahl | Wert |
|---|---|
| VO-Wörter (ohne Tags, mit den gelesenen Zitatkarten, gezählt wie `regel_check.py`) | **1.368** (Vorgabe 1.300–1.380 ✓; vor dem Clip-Nachtrag 1.356; v1: 1.428) |
| Laufzeit bei 2,4 W/s | Sprechtext 9:30 · + Clips 28,5 s · + 2 × `[pause]` à 1,5 s · + 9 Absatz-Pausen à 0,6 s = **≈ 10:07** (Ende VO) · + ~7 s Weg ins Schlussbild (Musik, QR blendet aus) · + **15 s Endbild = ≈ 10:29** |
| Clips | C3 10,5 s · C5 9,3 s · C2 8,7 s = **28,5 s ≈ 4,7 %** von 10:07 (Ziel ≤ 8 % ✓) · Wortlaute und Schnittpunkte fest laut `clips/schnitt.json` |
| Clip-Abstände (eigener Film dazwischen) | C3→C5 ≈ 270 s · C5→C2 ≈ 52 s (≥ 45 s ✓; v1: 49 s) |
| Pro Quelle | Dwarkesh (C3 + C2) 19,2 s in 2 Clips (≤ 20 s ✓, knapp) · Peterman/Ramakrishnan (C5) 9,3 s, nur Ton |
| Zitatkarten (gelesen, im Sprechtext mitgezählt) | C1 0:50 (20 Wörter ≈ 8 s) · C1b 8:45 (14 Wörter ≈ 6 s, gekürzt) · kein Footage aus dem Roadshow-Video · C5 ist ein echter Clip (nur Ton) |
| Hook | unverändert (A „Szene mit dir“): 62 Wörter bis zur Frage (0:21), Hook 112 Wörter (bis 0:47), Zitatkarte C1 ab 0:50 · Minute 1: 1 Frage, Zahlwörter „ten“ und „two“, keine Jahreszahl, Firma erst 0:59 |
| Titel eingelöst | 0:00 (Satz) · 0:50 Zitatkarte C1 (der Satz selbst) · 0:59 wer und wo · 1:53 „before twenty thirty-six“ (die Frist als Jahr, als unsere Umrechnung gekennzeichnet) |
| „This isn't about whether to buy the stock.“ | 1:08 (nach Minute 1, ohne Pause davor) |
| Abo-Aufrufe | 3:58 (Mitte, direkt nach dem Herz-Urteil ½) · 9:49 (Schluss, nach Kernsatz und Anleger-Satz); „subscribe“ = 2 Treffer ✓; kein gesprochener Spendenaufruf |
| Support-QR | 3:58 bis ~4:25 (≈ 27 s, läuft in den Anfang von Station 4) · 9:49 bis ~10:14 (25 s, weg, bevor das Endbild beginnt) |
| Zahlen (gesprochen) | ten-year 0:00 · 2036 1:53 · 55 Patienten 2:37 · über hundert 2:44 · halbiert 3:23 · bis zu 15 Jahre 3:32 · etwa die Hälfte 4:29 · ~20 Jahre 5:02 · unter 18 Monaten 6:57 · Ende 2028 7:06 · um die sechzig 7:40 · ein bis zwei Monate 8:21 → **12 Stellen in 10:07 ≈ 1,2 pro Minute** (v1: 17 ≈ 1,6); ohne Titelzahl und Frist-Jahr 10 ≈ 1/min · Minute 1: nur der Titel |
| [prüfen] | **16 Stellen** im Skript (gesammelt unter „Faktencheck“, dort fett markiert) |
| Regel-Check | `regel_check.py vo-v2.txt` → **0 Hinweise** (exit 0), Ausgabe am Ende |

Zeiten unten bei 2,4 W/s, jeweils Satzanfang (bei `[pause]` inklusive Pause). Fakten-IDs in geschweiften Klammern:
- `{F3}` = Faktenzettel
- `{0.2}` = Faktenzettel Abschnitt 0 (Fallen)
- `{Cn}` = clips.json
- `{neu}` = eigene Einordnung ohne direkten Beleg im Faktenzettel

**[prüfen: …]** markiert jede Zahl oder Aussage, die nicht 1:1 im Faktenzettel steht oder dort als umstritten gilt. IDs und Prüfvermerke gehören nicht in `vo-v2.txt`. Bildnotizen stehen kurz in runden Klammern.

---

## Fragen-Kette (Ist-Zeiten)

| # | Zeit | Station | beantwortet | öffnet |
|---|---|---|---|---|
| 0 | 0:00–0:47 | **Hook: die Frist** | Titelversprechen. Szene mit dir: Ein Arzt sagt eines von vier Wörtern zu jemandem, den du liebst; deine Enkel hören diese Wörter einmal wie „plague“. Wendung: Die Maschinen finden schneller, den Körper hetzen sie nicht; jede Heilung hat zwei Daten. Erster Gewinn: Die schnellste Krankheit antwortet in Wochen, die langsamste erst nach Jahrzehnten. | *„So which of these could really be history by the deadline?“* (0:21). Dazu die große Schleife: Welche ist die schnelle, welche die langsame? |
| 1 | 0:47–2:08 | **Das Versprechen, fair** (Zitatkarte C1 0:50, Clip C3 1:39) | Wer und wo: Dario Amodei (Karte C1), Chef von Anthropic, gesagt im Verkaufsvideo zum Börsengang. „This isn't about whether to buy the stock.“<br>*But:* Erfunden hat er es nicht für Anleger, er schrieb dieselbe Wette Jahre vorher auf, im Essay „Machines of Loving Grace“, mit Kleingedrucktem.<br>*Therefore* sein stärkstes Argument: Studien sind langsam, weil die meisten Mittel kaum wirken; was stark wirkt, ist schnell bewiesen. Seine eigene Grenze im O-Ton: „much faster … but not infinitely fast“. Die Frist als Jahr: vor 2036. Die Frist-Tafel erscheint. | *„When a medicine really works, how fast does the body say so?“* Die schnellste zuerst: Krebs. |
| 2 | 2:08–3:13 | **Krebs: antwortet in Wochen** | Labor: Der Tag, an dem eine Heilung gefunden wird, rückt näher. Immunzellen mit „Haken“, die KI hilft beim Design, alles noch im Labor.<br>Körper: Ein Tumor antwortet im Scan nach Wochen; 55 Patienten mit vielen verschiedenen Krebsarten reichten für eine Zulassung, die meisten sprachen an.<br>*But:* über hundert Krebsarten, die sich wehren. Sein Essay sagte selbst „most cancer“, der zitierte Satz im Verkaufsvideo sagt nur „cancer“.<br>Tafel **✓** für viele Arten. | *„But is a fast answer always the whole answer?“* |
| 3 | 3:13–3:58 | **Herz: das Blut in Wochen, das Herz in Jahren** | Eine einzige Infusion schaltet ein Gen in der Leber ab, das schlechte Cholesterin ist nach Wochen etwa halbiert, eine Behandlung fürs Leben.<br>*But:* Eine Änderung der DNA bleibt fürs Leben. Die Behörden verlangen bis zu 15 Jahre Nachbeobachtung, und ob Herzinfarkte ausbleiben, zeigt erst ein Stadion voller Menschen über Jahre.<br>Tafel **½** („only halfway“). | → Abo-Aufruf Mitte. Danach: Die dritte antwortet schnell, aber man hört die Antwort kaum. |
| M | 3:58–4:14 | **Abo-Aufruf Mitte + QR** | Mission + Frage: im Labor und am Krankenbett, für deine Eltern und eines Tages für dich. | |
| 4 | 4:14–5:02 | **Psyche: antwortet in Wochen, aber leise** | Studien dauern Wochen, aber viele werden auch mit der Zuckerpille besser. Selbst bei den zugelassenen Antidepressiva schlug nur etwa die Hälfte der Studien das Placebo. Kein Bluttest, die Diagnose ist ein Fragebogen.<br>Fair: „most mental illness can probably be cured“ (Essay).<br>Tafel **?**: Krebs hat seinen Scan, die Psyche wartet noch auf ihren. | *„And then the fourth disease. The slowest. It starts long before it shows.“* (große Schleife) |
| 5 | 5:02–6:06 | **Alzheimer: antwortet in Jahrzehnten** | Löst die große Schleife: Die Veränderungen beginnen rund 20 Jahre vor dem ersten vergessenen Namen. Viele, die bis zur Frist die Diagnose bekommen, tragen erste Spuren schon heute.<br>Vorbeugung beweisen heißt, Gesunde über Jahre zu begleiten; eine solche Studie wartete Jahre auf ihre Antwort, und die lautete: wirkt nicht.<br>Kleingedrucktes 2 („difficult to reverse“), im zitierten Satz nicht erwähnt.<br>Tafel **✗**.<br>*But* Hoffnung: Das Rennen beginnt jetzt; seit letztem Jahr findet ein Bluttest die ersten Spuren. | *„So if the machines aren't the slow part, why set a date at all?“* |
| 6 | 6:06–7:37 | **Der Pitch und seine Wette** (Clip C5 6:20, Clip C2 7:22) | Zwei Antworten:<br>1. Ein Verkaufsvideo belohnt ein Versprechen mit Datum (kein Bösewicht).<br>*But:* Ein Nobelpreisträger nennt den langsamen Teil: das Testen, nicht das Finden (C5).<br>2. *Therefore* seine Wette: Das Testen wird auch schneller.<br>*But* Kritik: Topol („wildly off-base“).<br>*But* fair: Er misst sich selbst an einem härteren Test („actually curing cancer“). Sein eigenes Medikament zeigt beide Daten (Idee bis Mausdaten in unter 18 Monaten, am Menschen frühestens Ende 2028: „First date: fast. Second date: years away.“), und den Stau sieht er selbst (C2).<br>Tafel komplett **✓ ½ ? ✗**. | *„So can proof come sooner, without making medicine less safe?“* (= seine Wette, als Frage) |
| 7 | 7:37–9:12 | **Lösung: das zweite Datum vorziehen** (Zitatkarte C1b 8:45) | „It can. And it's already starting.“ Drei Szenen, jede mit Antwort, Beleg, Grenze und Macht:<br>1. Früh finden: Studienklinik, Bluttest, Vorbeugestudie. Grenze: bei Gesunden nur in Studien.<br>2. Kleiner prüfen: digitale Zwillinge statt eines Teils der Placebo-Gruppe, anerkannt von der EU-Behörde. Grenze: Sie verkleinern die Vergleichsgruppe, ersetzen sie aber nicht.<br>3. Zulassung im Takt: KI-Assistent der US-Prüfer, für einige Prioritäts-Mittel Ziel ein bis zwei Monate, dazu Darios Vorschlag (Regeln für Mittel, die eindeutig wirken). Grenze: „remember the heart“.<br>Darios Bedingung (C1b, „if we do this right“). Mission-Satz: Das zweite Datum setzen Menschen: Kliniken, Forschende, Gesetzgeber. | *„So, does the deadline hold?“* |
| 8 | 9:12–9:49 | **Große Antwort** | Tafel-Bilanz in vier kurzen Sätzen. Ernte der Enkel: Alzheimer wie „plague“, nicht weil jemand ein Datum setzte, sondern weil jemand es bewies. **Kernsatz 9:35.** Anleger-Satz 9:41 (verwandelte Rückkehr). | — |
| A2 | 9:49–10:07 | **Abo-Aufruf Schluss + QR** | Mission + Frage, über dem Weg ins Schlussbild. | |
| E | 10:14–10:29 | **Endbild 15 s** | siehe Skript, E | |

- Das letzte Fünftel beginnt bei ≈ 8:06 (80 % von 10:07). Die Lösung beginnt bei 7:37, die große Antwort kommt bei 9:12–9:41. Der Kernsatz fällt bei ≈ 95 % der Sprechzeit.
- Offene Schleifen, höchstens ~90 s Abstand (größte Lücke 76 s):
  - 0:21 Hauptfrage
  - 0:37 Welche ist schnell, welche langsam? (große Schleife bis 5:02)
  - 1:53 Wie schnell antwortet der Körper?
  - 3:09 Ist eine schnelle Antwort die ganze?
  - 4:14 die dritte, die man kaum hört
  - 4:56 die vierte
  - 5:59 Warum ein Datum?
  - 6:32 Seine Wette: Wird das Testen schneller?
  - 7:32 Kann der Beweis früher kommen?
  - 7:49 Hält ein Mittel den ersten vergessenen Namen auf? (die Studie läuft)
  - 8:40 Welche Bedingung?
  - 9:12 Hält die Frist?
- **But/therefore-Kette:**
  - Frist → *but* die Maschinen sind nicht der langsame Teil → *therefore* vier Antwortzeiten
  - Krebs schnell, *but* nicht jede Art → Herz schnell, *but* fürs Leben → Psyche schnell, *but* leise → Alzheimer langsam, *but* das Rennen beginnt jetzt
  - *therefore* Warum ein Datum? → Anreiz, *but* der langsame Teil ist das Testen, *therefore* seine Wette: Das Testen wird schneller
  - *but* Kritik, *but* sein eigener harter Test, sein eigenes Medikament, sein eigener Stau
  - *therefore* Kann der Beweis früher kommen? → ja, drei Wege → Antwort

## Die Uhr: die Frist-Tafel (Bildecke, kein Uhr-Motiv)

| Zeile | ANSWERS IN … (Einblendung) | Urteil (Einblendung) | gesprochen | Zeit Urteil |
|---|---|---|---|---|
| CANCER | WEEKS | ✓ MANY KINDS | „So cancer, by the deadline: for many kinds, the proof can come in time. Not for every kind.“ | 3:02 |
| HEART | WEEKS (BLOOD) / YEARS (HEART) | ½ | „So heart disease, by the deadline: only halfway. The tool can be ready in time. The proof that it's safe for a lifetime can't.“ | 3:48 |
| MIND | WEEKS, BUT FAINT | ? | „So mental illness, by the deadline: an open question.“ | 4:47 |
| ALZHEIMER'S | DECADES | ✗ | „So Alzheimer's, by the deadline: no.“ | 5:41 |

- Überschrift DEADLINE: 2036, Fußnote OUR CONVERSION OF „LESS THAN A DECADE“ (NOV 2026). Die Tafel entsteht bei 1:53 aus der Mint-Zeile des Clips C3 und bleibt in der Bildecke bis 9:24.
- Der Endstand ✓ ½ ? ✗ ist komplett bei 7:30 (zur gestauten Pipeline). Bei 9:12–9:24 steht die Bilanz groß in der Bildmitte, danach verschwindet die Tafel. Im Endbild gibt es keine Tafel.
- Die Urteile werden gesprochen, damit die Hörfassung ohne Bild trägt. Das ½ heißt gesprochen „only halfway“ bzw. „halfway“ (M5).

## Wiederkehrende Bildmittel (Kanal-Look Editorial-Nacht)

- **Das Museumsschild FOUND / PROVEN** (der Kernsatz als Objekt):
  - 0:31 FOUND füllt sich sofort, PROVEN bleibt leer und blinkt
  - 0:37 vier Schilder
  - 2:08 Krebs-Schild, FOUND füllt sich ein Stück
  - 6:57 Anthropics Medikament, FOUND füllt sich
  - 7:06 FOUND voll, PROVEN weit hinten, dazu die Schlange vor HUMAN TRIALS
  - 7:32 PROVEN blinkt
  - 7:37 PROVEN rückt nach vorn
  - 8:51 daneben drei Menschen
  - 9:09 PROVEN rückt näher an FOUND
  - 9:35 groß
  - 9:41 PROVEN bleibt offen, ein Stift liegt daneben
- **Vitrine und Museum** (Thumbnail-Motiv): Frame 0 · 0:13 verblasste Schilder, Kinder gehen vorbei · 0:21 · 9:24 Kinder vor einer Vitrine mit dem verblassten Schild ALZHEIMER'S · Endbild.
- **Die Lupe auf dem Kleingedruckten:**
  - 1:11 noch unlesbar → 2:50 „most cancer“, lesbar → 5:29 „difficult to reverse“
  - Daneben die Zitatkarte C1: bei 2:58 leuchtet „cancer“, davor eine Lücke, wo im Essay „most“ steht; bei 5:37 leuchtet „Alzheimer's“, ohne Zusatz. Gezeigt wird nur der zitierte Satz, keine Behauptung über das ganze Video (M3).
- **Die zwei Studien-Bahnen:** 1:21 (die Wirkung zittert kaum über null, endlose Reihe Patienten) → 1:29 (steiler Sprung, wenige Patienten) → 2:37 (die steile Bahn blitzt auf, wenn die 55 Patienten erscheinen).
- **Der Haken:** 2:13 (Immunzelle mit Haken) → 2:21 (Haken-Varianten im Sekundentakt) → 2:44 (Krebszellen verformen sich und weichen aus).
- **Die gläserne Pipeline:** 6:29 (vorne strömt es frei, an der Engstelle TESTING der Flaschenhals) → 7:30 (vorne strömt es, hinten staut es sich).
- **Akzentfarbe Mint** auf nachtblauem Grund (Laborlicht, Mint-Linien im Gehirn, Licht in den leeren Vitrinen). ✓ in Mint, ✗ in Creme, kein flächiges Signalrot (REGELN §9.3). Keine Uhren, Lichterketten oder Startlinien (Motive früherer Filme).
- **Menschen im Mittelpunkt** (REGELN §1.5): Sprechzimmer, Studienklinik, Prüferin, Kinder im Museum, das Stadion bei 3:40. Keine Dario-Karikatur, keine Person in der Anreiz-Szene (6:06), keine Kurse, keine Preise.
- **Stumme Vorschau (erste 10 s):** Frame 0 = Thumbnail A, These groß, stummer Beleg ab 0:01 (Zitat klein, mit Name und Datum, ohne Firma), eingebrannte Untertitel ab dem ersten Wort.

---

## Skript (mit Hook A)

Format je Zeile: **Zeit** VO (gesprochen, v4-Tags inline) {Fakten-IDs} **[prüfen: …]**, darunter (Bild: …) bzw. (Einblendung: …).
- Clips: **Zeit [CLIP Cn]** „Transkript“, darunter (Quelle …) und (Einblendung …).
- Zitatkarten: **Zeit [ZITATKARTE Cn]** Die Erzählstimme liest: „…“.
- LOOP = was die Station beantwortet und öffnet.

### 0 · Hook: die Frist (ab 0:00) · unverändert
LOOP: öffnet die Hauptfrage (welche der vier Krankheiten bis zur Frist Geschichte wird); Wendung: zwei Daten; erster Gewinn: die schnellste in Wochen, die langsamste nach Jahrzehnten (große Schleife bis Station 5)

**0:00** [calm, conversational] Artificial intelligence just gave disease a ten-year deadline. {F1, Titel}  
(Bild: Frame 0 = Thumbnail A: riesige Museumsvitrine, darin eine leuchtende Krebszelle, davor klein die Figur in gelber Regenjacke; Stempel „DEADLINE: 2036“ knallt aufs Glas · Einblendung groß: AI GAVE DISEASE A DEADLINE · ab 0:01 klein unten, nur im Bild (stummer Beleg, ohne Firma): „…relics of the past in, I think, less than a decade.“ · Dario Amodei, Nov 10, 2026 · Untertitel ab dem ersten Wort)

**0:03** Think of the last time a doctor sat down with someone you love and said a word like cancer.  
(Bild: Sprechzimmer, warmes Licht; ein Arzt setzt sich, gegenüber jemand, den du liebst; du daneben, Hand auf der Schulter; Wortkarte CANCER fällt auf den Tisch)

**0:11** Or Alzheimer's. Heart disease. Depression. {0.3}  
(Bild: drei weitere Wortkarten fallen im Takt dazu)

**0:13** Now picture your grandkids hearing those words the way you hear the word plague. Something from a history book. {F4 (Bild aus dem Essay, kein Zitat)}  
(Bild: dieselben vier Wörter als verblasste Schilder in einem Museum; Kinder gehen daran vorbei wie an einem Ausstellungsstück, ohne Jahreszahl)

**0:21** So which of these could really be history by the deadline?  
(Bild: zurück zur Vitrine aus Frame 0; über ihr die vier Wörter, hinter jedem ein Fragezeichen · Einblendung: WHICH COULD BE HISTORY BY THE DEADLINE?)

**0:26** The machines can find cures faster. They can't rush the human body. {LG1/Gerüst}  
(Bild: links ein Bildschirm, auf dem Moleküle im Sekundentakt entstehen; rechts ein Mensch im Scanner, ruhiger Atem, nichts beschleunigt sich)

**0:31** Every cure has two dates. The day it's found. And the day it's proven. {Kernsatz}  
(Bild: Museumsschild mit zwei leeren Zeilen FOUND: ____ und PROVEN: ____; die erste füllt sich sofort, die zweite bleibt leer und blinkt)

**0:37** And for each of these diseases, the body gives its answer at its own speed. The fastest, in weeks. The slowest, only after decades. {F14, F26}  
(Bild: vier solche Schilder nebeneinander; bei einem füllt sich PROVEN fast sofort, bei einem anderen bleibt es leer, während der Raum dunkler und heller wird (Jahre, ohne Uhr und ohne Jahreszahl))


### 1 · Das Versprechen, fair (ab 0:47)
LOOP: wer und wo (Zitatkarte C1), keine Anlageberatung; *but* Jahre vorher schon aufgeschrieben, mit Kleingedrucktem; *therefore* sein stärkstes Argument + C3; die Frist = vor 2036; öffnet: Wie schnell antwortet der Körper? Die schnellste zuerst

**0:47** That deadline comes from Dario Amodei. In his words: {F1, C1-Einordnung}  
(Bild: die Zitatkarte baut sich auf (nachtblau, Creme-Schrift), Bauchbinde DARIO AMODEI · CEO, ANTHROPIC · NOV 10, 2026 · kein Footage)

**0:50 [ZITATKARTE C1]** Die Erzählstimme liest: „Cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.“ {F1, 0.1} **[prüfen: Wortlaut nur sekundär (Business Insider u. a.); am Original per Whisper bestätigen, Auszug ab „cancer“ (ohne „You know, if today we look at things like“)]**  
(Einblendung: Zitat wortgleich, Wort für Wort mitlaufend: „…cancer, Alzheimer's, heart disease, mental illness, these will be relics of the past in, I think, less than a decade.“ · Quelle klein: Anthropic, retail roadshow video, Nov 10, 2026)

**0:59** He runs Anthropic, among the biggest artificial intelligence labs, and he said it in the video made to sell its shares. {F1, F3} **[prüfen: „among the biggest artificial intelligence labs“ ist unsere Einordnung, steht so nicht im Faktenzettel (indirekt F3: Bewertung bis ~1,4 Bio. $, sekundär)]**  
(Bild: die Karte rückt in einen gezeichneten Videorahmen ROADSHOW; dahinter ein Börsensaal als Silhouette, Kürzel ANT, keine Kurse, keine Zahlen)

**1:08** This isn't about whether to buy the stock. {0.12} *(v2 ohne `[pause]`, K2)*  
(Einblendung: NOT INVESTMENT ADVICE)

**1:11** He didn't invent it for investors. Years ago, he wrote the same bet into an essay called Machines of Loving Grace. With small print. {F4, F5; Titel neu im Sprechtext, damit er im O-Ton C3 wiedererkannt wird}  
(Bild: aufgeschlagenes Essay MACHINES OF LOVING GRACE · OCT 2024; eine Lupe gleitet über Kleingedrucktes, noch unlesbar)

**1:21** And his reasoning is better than it sounds. Trials are slow, he argues, largely because most drugs barely work. {F6}  
(Bild: zwei Studien-Bahnen; auf der einen zittert eine Wirkung kaum über null und braucht eine endlose Reihe Patienten)

**1:29** When something works really well, the proof comes fast. {F6}  
(Bild: auf der zweiten Bahn springt die Wirkung steil hoch, nach wenigen Patienten ist das Ziel erreicht)

**1:32** Earlier this year, on a podcast, he made the same point, and set his own limit. {F7, C3-Einordnung: „the same point“ = „most drugs barely work“ (1:21), im Clip „There's not efficacy“; „his own limit“ = „not instant, not infinitely fast“}  
(Bild: gezeichnetes Podcast-Studio, Zoom in einen Bildschirm, der zum Original wird → Clip)

**1:39 [CLIP C3]** „There's not efficacy, right? And I make exactly that point in Machines of Loving Grace. I say the clinical trials are going to go much faster than we're used to, but not instant, not infinitely fast.“  
(Quelle: Dwarkesh Patel, n1E9IZfvGMA, 13.2.2026, 00:54:23,0–00:54:33,5 · Schnitt fest laut `clips/schnitt.json` (dwarkesh-a.mp4, in 33,01 s, out 43,46 s), Sprecher Dario Amodei · 10,5 s · kürzer ab „And I make“ wäre ein harter Schnitt mitten im Redefluss · Ausstieg knapp vor dem nächsten Satz: Ton 2–3 Frames ausblenden)  
(Einblendung: DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE (Dwarkesh Podcast) · eigene Untertitel, wortgleich, mit „Machines of Loving Grace“ (Whisper schrieb „Love and Grace“, gesprochen vermutlich „Loving“: am Kontrollschnitt C3.wav gegenhören))

**1:50** So even in his view, proof takes time. {F7, C3-Deutung statt Echo (K6 erledigt: der Clip endet wortgleich auf „not infinitely fast“); verankert „proof“, trägt auch ohne Clip}  
(Bild: der Clip-Rahmen schrumpft; die letzte Untertitelzeile NOT INSTANT, NOT INFINITELY FAST bleibt in Mint stehen)

**1:53** Less than a decade: that's before twenty thirty-six. Four diseases, and one question for each. When a medicine really works, how fast does the body say so? {0.2}  
(Bild: aus der Mint-Zeile wird die Frist-Tafel in der Bildecke: DEADLINE: 2036 · Fußnote: OUR CONVERSION OF „LESS THAN A DECADE“ (NOV 2026) · vier Zeilen CANCER · HEART · MIND · ALZHEIMER'S, Spalte ANSWERS IN … leer)

**2:04** The fastest clear answer comes from cancer. {F14}  
(Bild: Tafel-Zeile CANCER leuchtet auf)


### 2 · Krebs: antwortet in Wochen (ab 2:08)
LOOP: Labor (der Tag des Findens rückt näher); der Körper antwortet in Wochen (55 Patienten), Darios Theorie greift; *but* über hundert Krankheiten, Kleingedrucktes 1 geerntet, der zitierte Satz sagt nur „cancer“; Tafel ✓; öffnet: Ist eine schnelle Antwort die ganze?

**2:08** [curious] In the lab, the day a cure is found is already getting closer. {F9}  
(Bild: Labor bei Nacht, Mint-Licht; auf dem Krebs-Schild füllt sich die Zeile FOUND ein Stück)

**2:13** Doctors can rebuild a patient's own immune cells to hunt cancer, with a receptor that works like a hook. {neu: allgemeine Erklärung CAR-T} **[prüfen: CAR-T-Erklärung steht so nicht im Faktenzettel (Allgemeinwissen)]**  
(Bild: eine Immunzelle bekommt kleine Haken an die Oberfläche und schwimmt auf eine Krebszelle zu)

**2:21** Artificial intelligence now helps design those hooks, in a fraction of the time. {F9} **[prüfen: Umschreibung von „Designschritt ~70 % kürzer“ (F9); bestätigen, dass der Schritt das Rezeptor-Design betrifft; „in a fraction of the time“ gilt nur für diesen Schritt]**  
(Bild: auf einem Bildschirm entstehen Haken-Varianten im Sekundentakt · Einblendung: CAR-T DESIGN STEP ≈ 70 % SHORTER · PRECLINICAL · Anthropic research update, Oct 2026)

**2:27** All still in the lab. {F9 („mostly preclinical“)}  
(Bild: der Deckel einer Petrischale schließt sich)

**2:29** Then the body answers. And a tumor answers fast: on a scan, within weeks, it shrinks or it doesn't. {F14}  
(Bild: zwei Scanbilder nebeneinander, der Tumor schrumpft dazwischen · Tafel: CANCER · ANSWERS IN WEEKS)

**2:37** That's how one pill won approval with just fifty-five patients, spread across many different cancers. Most of them responded. {F13}  
(Bild: eine Kapsel, dahinter 55 kleine Figuren in zwölf Farbgruppen; drei von vier leuchten; die steile Studien-Bahn aus Station 1 blitzt kurz auf · Einblendung: LAROTRECTINIB · FDA, NOV 2018 · 55 PATIENTS · 12 CANCER TYPES · 75 % RESPONDED)

**2:44** But cancer isn't one disease. It's more than a hundred, and they fight back. {F15}  
(Bild: die eine Krebszelle zerfällt in über hundert verschiedene Formen, einige verformen sich und weichen dem Haken aus · Einblendung: 100+ TYPES OF CANCER · NCI)

**2:50** His own essay said so: the end of most cancer, not all. Some rare, difficult cancers may persist. {F5}  
(Bild: die Lupe aus Station 1 macht das Kleingedruckte lesbar · Einblendung: „Elimination of most cancer“ · „…an assortment of rare, difficult malignancies persists.“ · Amodei, Oct 2024)

**2:58** The line in the sales video just says: cancer. {F1 (der zitierte Satz enthält kein „most“)} **[prüfen: neu (M3); bezieht sich nur auf den zitierten Satz C1 und hängt an dessen Wortlaut (Kartentext ab „cancer“, ohne „most“). Stimmt unabhängig davon, was sonst im 42-Minuten-Video gesagt wird]**  
(Bild: daneben die Zitatkarte C1; das Wort „cancer“ leuchtet, davor eine Lücke, wo im Essay „most“ steht)

**3:02** So cancer, by the deadline: for many kinds, the proof can come in time. Not for every kind. {Urteil (Gerüst-Tafel)}  
(Bild: Tafel: CANCER · WEEKS · ✓ MANY KINDS)

**3:09** But is a fast answer always the whole answer?  
(Bild: Tafel-Zeile HEART beginnt zu leuchten)


### 3 · Herz: das Blut in Wochen, das Herz in Jahren (ab 3:13)
LOOP: Staunen (eine Infusion halbiert das LDL, eine Behandlung fürs Leben); *but* die Änderung bleibt fürs Leben, bis zu 15 Jahre Nachbeobachtung, Herzinfarkte zeigt erst ein Stadion voller Menschen über Jahre; Tafel ½; → Abo-Aufruf Mitte

**3:13** [thoughtful] Heart disease answers twice. {Gerüst-Tafel}  
(Bild: Herz und Leber als zwei leuchtende Organe, verbunden durch eine Ader)

**3:15** First, the blood. In a recent trial, people got a single infusion that switched off a gene in the liver. {F18}  
(Bild: ein Infusionsbeutel, ein einziger Tropfen; in der Leber klappt ein Gen-Schalter um · Einblendung: CTX310 · NEJM, NOV 2025 · 15 PEOPLE · ONE INFUSION)

**3:23** At the highest dose, weeks later, their bad cholesterol was cut roughly in half. {F18}  
(Bild: eine LDL-Säule sinkt auf die Hälfte · Einblendung: LDL ≈ −50 % · HIGHEST DOSE · DAY 60)

**3:29** One treatment, meant to last a lifetime. {F18}  
(Bild: eine einzelne Infusion, daneben ein Lebensband, das ohne weitere Tropfen weiterläuft; keine Konzern-Silhouetten mehr)

**3:32** But a change to your DNA is for life. So regulators ask to follow patients for up to fifteen years. {F20 (0.10: „up to“)}  
(Bild: ein DNA-Strang mit einer dauerhaften Markierung; daneben ein langer Weg, auf dem eine Figur jahrelang begleitet wird · Einblendung: FDA: UP TO 15 YEARS FOLLOW-UP FOR GENOME EDITING)

**3:40** And whether the heart attacks really stay away takes a stadium full of people, followed for years. {F21} **[prüfen: neu (M2); Analogie für FOURIER, 27.564 Patienten, Median 2,2 Jahre (F21); ein großes Stadion fasst Menschen in dieser Größenordnung; die Zahl steht nur in der Einblendung]**  
(Bild: ein Stadion füllt sich mit Tausenden kleinen Figuren, Jahreszeiten ziehen über die Tribünen; ein Herz schlägt ruhig weiter · Einblendung: E.G. FOURIER: 27,564 PATIENTS · MEDIAN 2.2 YEARS)

**3:48** So heart disease, by the deadline: only halfway. The tool can be ready in time. The proof that it's safe for a lifetime can't. {Urteil (Gerüst)}  
(Bild: Tafel: HEART · WEEKS (BLOOD) / YEARS (HEART) · ½)


### M · Abo-Aufruf Mitte (QR ab dem ersten Wort, ~25–30 s) (ab 3:58)
LOOP: direkt nach der Auflösung ½; Mission + Frage; kein Spendenaufruf

**3:58** [warm] This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. In the lab, and at the hospital bed, for your parents, and one day for you. Want that too? Then subscribe. {REGELN §3.8}  
(Bild: Krankenhausflur bei Nacht, eine offene Tür mit warmem Licht, darin ein Bett und ein Mensch daneben; dezenter Abo-Hinweis · QR-Overlay oben rechts (SUPPORT THIS CHANNEL) startet mit „This channel“, ~27 s bis ~4:25, sanft ein und aus)


### 4 · Psyche: antwortet in Wochen, aber leise (ab 4:14)
LOOP: Placebo-Rauschen, selbst bei zugelassenen Mitteln schlägt nur ~die Hälfte der Studien die Zuckerpille, kein Bluttest; fair: Darios Hoffnung; Tafel ?; öffnet die große Schleife (die vierte, langsamste)

**4:14** [thoughtful] The third disease answers fast. The problem is hearing the answer. {Gerüst}  
(Bild: Tafel-Zeile MIND leuchtet; ein Mikrofon vor einem Rauschen)

**4:19** Take depression, one part of mental illness. A trial runs for weeks. But in those weeks, many people improve on a sugar pill too. {0.3, F23} **[prüfen: „weeks“ als Studiendauer und „many people improve on a sugar pill“ stehen so nicht im Faktenzettel]**  
(Bild: zwei Gruppen im Wartezimmer; in beiden hellen sich Gesichter auf, auch bei der Zuckerpille)

**4:29** Even for the antidepressants already approved, only about half the trials beat the sugar pill. {F23 (0.11: „about half“)}  
(Bild: 74 kleine Karten, gut die Hälfte färbt sich mint · Einblendung: 38 OF 74 TRIALS POSITIVE (51 %) · FDA REVIEWS · Turner et al., NEJM 2008)

**4:35** And there's no blood test for depression. The diagnosis is a questionnaire. {F24}  
(Bild: ein leeres Blutröhrchen neben einem Fragebogen mit Kästchen)

**4:40** That doesn't make it hopeless. In his essay, he wrote that most mental illness can probably be cured. {F5}  
(Einblendung: „Most mental illness can probably be cured.“ · Amodei, Oct 2024)

**4:47** So mental illness, by the deadline: an open question. Cancer has its scan. The mind is still waiting for one. {Urteil (Gerüst: erst ein Maßband)}  
(Bild: Tafel: MIND · WEEKS, BUT FAINT · ? · daneben das Scanbild aus Station 2 und ein leerer Rahmen)

**4:56** And then the fourth disease. The slowest. It starts long before it shows. {F26 (große Schleife)}  
(Bild: Tafel-Zeile ALZHEIMER'S glimmt, die Spalte ANSWERS IN … bleibt leer)


### 5 · Alzheimer: antwortet in Jahrzehnten (ab 5:02)
LOOP: löst die große Schleife: ~20 Jahre Vorlauf; Vorbeugung beweisen dauert, eine Studie wartete Jahre auf ein Nein; Kleingedrucktes 2 geerntet, im zitierten Satz nicht erwähnt; Tafel ✗; Hoffnung: das Rennen beginnt jetzt (Bluttest); öffnet: Warum dann ein Datum?

**5:02** Alzheimer's.  
(Bild: ein Gehirn aus Mint-Linien)

**5:02** The changes in the brain start around twenty years before the first forgotten name. {F26}  
(Bild: im Gehirn glimmt ein winziger Punkt auf und wächst sehr langsam · Einblendung: CHANGES CAN BEGIN 20+ YEARS BEFORE SYMPTOMS · Alzheimer's Association)

**5:08** That means many people who'll be diagnosed by the deadline already carry the first traces today. {F26 (Ableitung laut Faktenzettel)}  
(Bild: Menschen auf einer belebten Straße von heute; bei einigen glimmt derselbe schwache Punkt)

**5:15** So the medicine has to come before the symptoms. Proving that means following healthy people for years, and counting who doesn't get sick. {F5 („Prevention“), F27}  
(Bild: eine Gruppe gesunder Menschen, Jahr für Jahr gezählt; eine Strichliste wächst)

**5:24** One such trial waited years for its answer. The drug didn't work. {F27} **[prüfen: F27 umstritten; A4 (Solanezumab) bei Menschen ohne Symptome, 240 Wochen, gescheitert; „waited years for its answer“ = Studiendauer bis zum Ergebnis]**  
(Bild: eine Strichliste über fast fünf Jahre, am Ende ein durchgestrichenes Fläschchen · Einblendung: A4 (SOLANEZUMAB) · 240 WEEKS · FAILED)

**5:29** And for those already sick, his essay had more small print: existing damage may be very difficult to reverse. {F5}  
(Bild: die Lupe auf dem Essay · Einblendung: „…damage from already existing Alzheimer's may be very difficult to reverse.“ · Amodei, Oct 2024)

**5:37** The line in the sales video doesn't mention that either. {F1} **[prüfen: neu (M3); wie 2:58: Nur der zitierte Satz C1 nennt die Einschränkung nicht; Wortlaut C1 per Whisper]**  
(Bild: die Zitatkarte C1 daneben; „Alzheimer's“ leuchtet, ohne Zusatz)

**5:41** So Alzheimer's, by the deadline: no. For many who'll get it by then, it has already begun. {Urteil (Gerüst), F26}  
(Bild: Tafel: ALZHEIMER'S · DECADES · ✗)

**5:48** [pause] But the race doesn't start at the deadline. It starts now. Since last year, a blood test can spot the first traces. {F29}  
(Bild: ein Blutröhrchen leuchtet mint auf · Einblendung: FIRST ALZHEIMER'S BLOOD TEST CLEARED · FDA, MAY 2025 · FOR PEOPLE WITH SYMPTOMS, 55+)

**5:59** So if the machines aren't the slow part, why set a date at all? {Gerüst}  
(Bild: zurück zur Zitatkarte C1, das Datum NOV 10, 2026 wird hervorgehoben)


### 6 · Der Pitch und seine Wette (ab 6:06)
LOOP: Warum ein Datum? Zwei Antworten: (1) Anreiz, kein Bösewicht; Scharnier: Der langsame Teil ist das Testen (C5); (2) seine Wette, dass das Testen schneller wird. *But* Kritik (Topol); *but* fair: sein harter Test, sein eigenes Medikament (zwei Daten am Beispiel), sein eigener Stau (C2); Tafel komplett; öffnet: Kann der Beweis früher kommen?

**6:06** Partly, because a sales pitch rewards a promise with a date on it. No villain needed. {neu: Einordnung (Anreiz statt Bösewicht)}  
(Bild: gezeichnete Bühne, ein Scheinwerfer fällt auf ein Datum; keine Person, keine Karikatur)

**6:12** The Nobel Prize-winning biologist Venki Ramakrishnan, asked this month about artificial intelligence and new drugs, named the slow part: {F32, C5-Einordnung; Name neu, weil der Clip nur Ton hat} **[prüfen: „this month“ (Interview 9.11., vor dem Roadshow-Video; nicht als Antwort auf Dario darstellen); „biologist“ (F32 nennt nur den Nobelpreis Chemie 2009); „asked … about artificial intelligence and new drugs“ an der Frage vor 05:36 im Original prüfen. Erledigt: Stelle gefunden (`clips/schnitt.json`); er meint Tempo („very fast“, „rate-limiting“), das trägt die Deutung „The testing, not the finding.“ bei 6:29]**  
(Bild: kein Footage, der Clip ist nur Ton. Gezeichnetes Interview-Studio als Silhouette, zwei Mikrofone, keine Gesichter; ein Mikrofon leuchtet auf → Ton-Clip)

**6:20 [CLIP C5]** „AI could be very fast at its computational work, but the experimental work is still going to be the rate-limiting factor.“  
(Quelle: Ryan Peterman, -1q0zA21AkY, 9.11.2026, 05:36,0–05:45,4 · Schnitt fest laut `clips/schnitt.json` (venki-ton.mp3), Sprecher Venki Ramakrishnan (Gast im Interview) · 9,3 s · nur Ton · saubere Pausen davor und danach · „bottleneck“ fällt nicht, der Satz sagt dasselbe)  
(Bild und Einblendung: Audiowelle in Mint über der Studio-Silhouette, Untertitel wortgleich · VENKI RAMAKRISHNAN · MOLECULAR BIOLOGIST · NOBEL PRIZE IN CHEMISTRY 2009 · NOV 2026 · ORIGINAL AUDIO (Ryan Peterman))

**6:29** The testing, not the finding. {F32, C5-Deutung: „computational work“ = finden, „experimental work“ = testen; „the slow part“ (6:12) übersetzt „rate-limiting factor“ vorab; keine Wortwiederholung}  
(Bild: eine gläserne Pipeline; vorne strömen Moleküle frei hinein (FINDING), an einer Engstelle mit dem Schild TESTING verengt sie sich zum Flaschenhals)

**6:32** The other reason for Amodei's date: he's betting that the testing can speed up too. {F6, F7 (C3: „much faster than we're used to“); „Amodei's“ statt „his“, weil direkt davor Ramakrishnan spricht}  
(Bild: das Museumsschild: hinter PROVEN erscheint ein Pfeil nach vorn mit einem Fragezeichen · Einblendung klein: „…the clinical trials are going to go much faster than we're used to…“ · Amodei, Feb 2026)

**6:38** The cardiologist Eric Topol, a fan of what artificial intelligence can do for health, called such cure timelines wildly off-base. {F30, 0.7 (ohne Datum)} **[prüfen: nachgetragen (K7); F30 Datum unklar, darum ohne Datum; Wortlaut „wildly off-base“ am Post prüfen]**  
(Einblendung: „…these cure projections are wildly off-base…“ · Eric Topol, cardiologist, on X (ohne Datum, bis es geprüft ist))

**6:46** To be fair, Amodei holds himself to a harder test. In August, he wrote that the only thing that will convince people is actually curing cancer. {F8} **[prüfen: nachgetragen (K7); F8 umstritten (nur sekundär, X blockiert); Wortlaut „The thing that will work is actually curing cancer.“ und Datum 15./16.8.2026 am Post]**  
(Einblendung: „The thing that will work is actually curing cancer.“ · Amodei on X, Aug 2026)

**6:57** His own company now designs medicines. One, for muscular dystrophy, went from idea to promising results in mice in under eighteen months. {F9}  
(Bild: ein Molekül saust einen kurzen, hellen Weg entlang bis zu einer Maus (FOUND füllt sich) · Einblendung: MITHRIL · MUSCULAR DYSTROPHY · IDEA → MOUSE DATA IN < 18 MONTHS)

**7:06** Its human trials could start as soon as late twenty twenty-eight. Same road as everyone else. First date: fast. Second date: years away. {F9; „First date … Second date …“ = unsere Einordnung}  
(Bild: dann reiht es sich in eine lange Schlange anderer Moleküle vor einer Tür HUMAN TRIALS ein; daneben das Museumsschild: FOUND voll, PROVEN weit hinten · Einblendung: „as soon as late 2028“)

**7:16** He even warned of a jam himself, earlier this year, on that same podcast. {F7, C2-Einordnung}  
(Bild: das Podcast-Studio aus Station 1 → Clip)

**7:22 [CLIP C2]** „AI models are going to greatly accelerate the rate at which we discover drugs and just the pipeline will get jammed up.“  
(Quelle: Dwarkesh Patel, n1E9IZfvGMA, 13.2.2026, 01:42:38,9–01:42:47,6 · Schnitt fest laut `clips/schnitt.json` (dwarkesh-b.mp4, in 38,92 s, out 47,64 s), Sprecher Dario Amodei · 8,7 s · beginnt mitten im Satz („I think“ davor weggelassen) · ~0,9 s Denkpause nach „going to“, im Schnitt ggf. straffen · Ausstieg knapp vor „like“ · Kontext: er will zugleich mehr KI-Sicherheitsgesetze (01:43:21))  
(Einblendung: DARIO AMODEI · CEO, ANTHROPIC · FEB 2026 · ORIGINAL FOOTAGE (Dwarkesh Podcast) · Untertitel wortgleich)

**7:30** Discovery speeds up. Proof jams. {F7, C2-Echo (trägt auch ohne Clip)}  
(Bild: die gläserne Pipeline aus 6:29: vorne strömen Moleküle hinein, hinten staut es sich · Tafel komplett: ✓ ½ ? ✗)

**7:32** So can proof come sooner, without making medicine less safe? {Gerüst; = seine Wette (6:32) als Frage}  
(Bild: das Museumsschild aus dem Hook, die Zeile PROVEN blinkt)


### 7 · Lösung: das zweite Datum vorziehen (ab 7:37)
LOOP: drei Szenen mit Antwort, Beleg, Grenze (früh finden · kleiner prüfen · Zulassung im Takt), Darios Bedingung (Zitatkarte C1b), Mission-Satz mit den Menschen, die handeln können

**7:37** It can. And it's already starting.  
(Bild: die Zeile PROVEN rückt ein Stück nach vorn)

**7:40** Picture someone you love, around sixty, sharp as ever. At a study clinic, a blood test finds the first traces, years early. {F27, F29} **[prüfen: Szene illustrativ; Alter 60 im Einschlussbereich der Vorbeugestudien bestätigen]**  
(Bild: Studienklinik, ein Mensch um die sechzig lacht mit der Pflegerin, ein Blutröhrchen; Ergebnis-Karte FIRST TRACES)

**7:49** So they join a trial: can a medicine hold off the first forgotten name? {F27}  
(Bild: eine Unterschrift unter ein Studienformular)

**7:55** For now, healthy people get that test only in trials. But that's how the slowest proof gets a head start. {0.9, F27 (Screening per Bluttest)}  
(Einblendung: IN PEOPLE WITHOUT SYMPTOMS: ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST)

**8:03** In other trials, part of the sugar-pill group is replaced by a prediction: a digital twin of each patient. {F34}  
(Bild: Studienteilnehmer in einer Reihe; neben jedem erscheint ein durchsichtiger Zwilling aus feinen Linien)

**8:11** Fewer people on a sugar pill, answers sooner. Europe's regulator accepts it for some trials. It shrinks the comparison group. It doesn't replace it. {F34}  
(Bild: die Reihe der Zuckerpillen wird kürzer, verschwindet aber nicht · Einblendung: DIGITAL TWINS (PROCOVA) · QUALIFIED BY EMA, SEPT 2022 · UP TO ~35 % SMALLER CONTROL GROUPS (COMPANY FIGURE))

**8:21** At America's regulator, reviewers now work with an artificial intelligence assistant. For a few priority medicines, the goal is a decision within one or two months. {F35} **[prüfen: nachgetragen (K7); F35 umstritten: CNPV-Ziel 1–2 Monate und „Elsa“ seit Juni 2025, Stand am Release prüfen]**  
(Bild: eine Prüferin am Schreibtisch, ein Aktenstapel schrumpft, ein Assistenzfenster markiert Stellen · Einblendung: FDA „ELSA“ SINCE JUNE 2025 · NATIONAL PRIORITY VOUCHER: TARGET 1–2 MONTHS)

**8:32** Amodei's own proposal: rules made for medicines that clearly work. But remember the heart: fast can't mean less safe. {F7, Gerüst-Grenze}  
(Einblendung: „…designed around an era of drugs that barely work…“ · Amodei, Feb 2026 · dann kurz die Herz-Zeile der Tafel: UP TO 15 YEARS FOLLOW-UP)

**8:40** In the sales video, his promise came with a condition. In his words: {F2, C1b-Einordnung}  
(Bild: die Zitatkarte aus Station 1 kehrt zurück, gleiche Gestaltung)

**8:45 [ZITATKARTE C1b]** Die Erzählstimme liest: „I think if we do this right, we can create an age of miracles.“ {F2} **[prüfen: Wortlaut nur sekundär; „age“ oder „era“ of miracles und Reihenfolge zu C1 am Original per Whisper; gekürzt nach „miracles“ (K4)]**  
(Einblendung: Zitat wortgleich mit „…“ am Ende: „I think if we do this right, we can create an age of miracles…“, „if we do this right“ in Mint · Quelle klein: Anthropic, retail roadshow video, Nov 10, 2026)

**8:51** If the machines make the first date come fast, the second date becomes the real deadline. And people set that one. {Gerüst (Mission-Satz)}  
(Bild: das Museumsschild: FOUND füllt sich schnell, PROVEN bleibt offen, daneben drei Menschen)

**9:00** Clinics that find disease early. Scientists who design leaner trials. Lawmakers who keep the rules in step with medicines that clearly work. {Gerüst §6 (wer die Macht hat)}  
(Bild: drei kurze Szenen: die Studienklinik, ein Studienbüro mit den Zwillingen, ein Parlamentssaal)

**9:09** That's what doing it right looks like.  
(Bild: die Zeile PROVEN rückt sichtbar näher an FOUND heran)


### 8 · Große Antwort (ab 9:12)
LOOP: Tafel-Bilanz, Ernte der Enkel, Kernsatz, Anleger-Satz; dann Abo-Aufruf 2

**9:12** So, does the deadline hold?  
(Bild: die Frist-Tafel fliegt groß in die Bildmitte)

**9:14** Cancer: for many kinds, yes. Heart disease: halfway. Mental illness: still open. Alzheimer's: not by then. But its race has already begun. {Bilanz der Stationen 2–5}  
(Bild: ✓ ½ ? ✗ leuchten im Takt der Wörter · Einblendung: ✓ ½ ? ✗)

**9:24** [pause] Maybe your grandkids will hear the word Alzheimer's the way you hear the word plague. Not because someone set a date. Because someone proved it. {F4 (Ernte aus dem Hook)}  
(Bild: Museum, Kinder vor einer Vitrine mit einem verblassten Schild ALZHEIMER'S; die Tafel ist weg)

**9:35** Every cure has two dates: the day it's found, and the day it's proven. {Kernsatz}  
(Bild: das Museumsschild mit beiden Zeilen, groß · Einblendung: EVERY CURE HAS TWO DATES)

**9:41** Investors are already putting a price on the first date. The second one is still ours to move. {F3, Gerüst} **[prüfen: umformuliert (M4); stimmt vor und nach der Preisfestsetzung (Spanne seit 10.11., Preis laut Sekundärquellen 18.11., Handel ab 19.11.); am 16.11. vormittags den Stand prüfen, nur bei einer Absage muss der Satz neu]**  
(Bild: ein Börsenticker blendet aus, ohne Kurs und Preis; die Zeile PROVEN bleibt offen, ein Stift liegt daneben)


### A2 · Abo-Aufruf Schluss (QR ab dem ersten Wort, ~25 s, weg vor dem Endbild) (ab 9:49)
LOOP: über dem Weg ins Schlussbild; Mission + Frage; kein Spendenaufruf

**9:49** [warm] This channel exists for one reason: so that the arrival of superintelligence goes well for everybody. Fast discoveries in the lab, and proof that arrives in time, for every family in a waiting room today. Including yours. Want that too? Then subscribe. {REGELN §3.8}  
(Bild: die Figur in gelber Regenjacke geht durch die nachtblaue Museumshalle auf die vier Vitrinen zu; Musik läuft weiter · QR-Overlay oben rechts ab „This channel“, bis ~10:14, sanft aus vor dem Endbild)

### E · Endbild (10:14–10:29, 15 s, ohne Stimme)

(Bild: Von 10:07 bis 10:14 geht die Figur in gelber Regenjacke ohne Stimme weiter durch die Halle, die Musik trägt, der QR blendet sanft aus (~0,6 s). Dann 15 s: eine stille, nachtblaue Museumshalle mit vier Sockeln und Glasvitrinen. In einer liegt ein altes, verblasstes Ausstellungsstück ohne Schild (ein Relikt), drei stehen leer, mit weichem Mint-Licht. Die Figur geht langsam vorbei und bleibt vor einer leeren Vitrine stehen. Kein Text, keine Tafel, kein QR; Musik und leichte Bewegung laufen weiter (kein stummes Standbild); Endcard-Flächen.)

---

## Nach dem Film weiß ich, dass …

1. … Dario Amodei im Verkaufsvideo zum Börsengang gesagt hat, Krebs, Alzheimer, Herzkrankheit und psychische Krankheit seien in weniger als zehn Jahren Geschichte (also vor 2036). Dieselbe Wette hatte er schon Jahre vorher aufgeschrieben, damals mit Kleingedrucktem: „most cancer“, und Alzheimer-Schäden seien vielleicht „very difficult to reverse“. Der zitierte Satz aus dem Verkaufsvideo hat dieses Kleingedruckte nicht.
2. … jede Heilung zwei Daten hat: den Tag, an dem sie gefunden, und den Tag, an dem sie bewiesen ist. Studien sind laut Dario vor allem deshalb langsam, weil die meisten Mittel kaum wirken. Was stark wirkt, ist schnell bewiesen: Für eine Zulassung reichten 55 Patienten, und die meisten sprachen an.
3. … der Körper bei jeder Krankheit in einem anderen Tempo antwortet. Bilanz bis 2036: ✓ ½ ? ✗.
   - Krebs im Scan nach Wochen.
   - Das Herz zweimal: Das Cholesterin ist nach Wochen halbiert, aber eine Genänderung wird bis zu 15 Jahre nachbeobachtet.
   - Die Psyche leise: Selbst bei zugelassenen Antidepressiva schlug nur etwa die Hälfte der Studien die Zuckerpille, und es gibt keinen Bluttest.
   - Alzheimer in Jahrzehnten: Die Veränderungen beginnen ~20 Jahre vor dem ersten Symptom.
4. *(letztes Drittel)* … der Flaschenhals das Testen ist, nicht das Finden. Selbst Anthropics eigenes Medikament kam in unter 18 Monaten von der Idee zu Mausdaten, Studien am Menschen beginnen frühestens Ende 2028. Dario wettet darauf, dass auch das Testen schneller wird, und warnt selbst vor einem Stau bei der Zulassung.
5. *(letztes Drittel)* … sich das zweite Datum vorziehen lässt, ohne Medizin unsicherer zu machen. Über das zweite Datum entscheiden Kliniken, Forschende und Gesetzgeber.
   - Ein Bluttest findet Alzheimer-Spuren Jahre früher (bei Gesunden vorerst nur in Studien).
   - Digitale Zwillinge verkleinern Placebo-Gruppen (in der EU für bestimmte Studien anerkannt).
   - Die US-Behörde will einige Prioritäts-Mittel mit KI-Hilfe in ein bis zwei Monaten prüfen.

## Faktencheck: besonders prüfen

Die **16** Stellen mit **[prüfen]** im Skript sind unten fett markiert. Die übrigen Punkte stehen im Faktenzettel, sind dort aber umstritten oder hängen am Release-Termin (Mo 16.11.).

1. **0:50 Zitatkarte C1 und die Quellzeile ab 0:01 [prüfen]:** Wortlaut nur sekundär (F1, Falle 0.1). Per Whisper am Original bestätigen (ipo.anthropic.com/us oder Re-Upload eynv5VR9qos, Schlusswort ~40:38). Auszug ab „cancer“, ohne „You know, if today we look at things like“; darum in der Karte „Cancer“ groß und in der Einblendung „…cancer“.
2. **0:59 „among the biggest artificial intelligence labs“ [prüfen]:** unsere Einordnung, steht nicht im Faktenzettel; indirekt F3 (Bewertung bis ~1,4 Bio. $, sekundär). Nicht „biggest IPO ever“ sagen (Falle 0.8). „the video made to sell its shares“ = retail roadshow video (F1, F3).
3. 1:11 „Years ago, he wrote the same bet into an essay called Machines of Loving Grace. With small print.“: Okt. 2024 (F4, F5); der Titel steht seit dem Clip-Nachtrag im Sprechtext. „Years ago“ statt „Two years ago“ (M2), stimmt für Okt. 2024 bis Nov. 2026. „the same bet“ stützt sich auf F4: „7-12 years from now“ ab Okt. 2024 ≈ 2031–2036.
4. 1:21–1:29 und 1:39 (C3): Darios Argument wörtlich F6. C3 = Dwarkesh 00:54:23,0–00:54:33,5 (F7); Wortlaut und Sprecher fest laut `clips/schnitt.json`. „There's not efficacy“ ist sein Argument von 1:21. 1:50 „So even in his view, proof takes time.“ ist unsere Deutung von „not instant, not infinitely fast“.
5. **2:13 CAR-T-Erklärung [prüfen]:** Allgemeinwissen, steht so nicht im Faktenzettel.
6. **2:21 „…helps design those hooks, in a fraction of the time“ [prüfen]:** Umschreibung von „CAR-T-Designschritt ~70 % kürzer“ (F9, Generate). Bestätigen, dass der Schritt das Rezeptor-Design betrifft; „in a fraction of the time“ gilt nur für diesen Schritt. „All still in the lab“ (2:27) gibt „mostly preclinical“ wieder (F9).
7. 2:37 Larotrectinib: FDA 26.11.2018, 55 Patienten, 12 Krebsarten („many different cancers“), Ansprechrate 75 % („Most of them responded“) (F13). „That's how“ verknüpft die schnelle Antwort im Scan (F14) mit der beschleunigten Zulassung auf Basis der Ansprechrate.
8. **2:58 „The line in the sales video just says: cancer.“ [prüfen] (neu, M3):** Der Satz behauptet nur etwas über den zitierten Satz C1: Er nennt „cancer“ ohne „most“. Das stimmt, sobald der Kartentext per Whisper wortgleich bestätigt ist, unabhängig davon, was sonst im 42-Minuten-Video gesagt wird. Ersetzt v1 „The sales pitch left that out.“
9. 3:15–3:23 CTX310: NEJM 8.11.2025, 15 Teilnehmer, eine Infusion, höchste Dosis LDL ≈ −50 % an Tag 60 (F18; Zahlen am Original). „In a recent trial“ = Nov. 2025.
10. 3:32 „up to fifteen years“: FDA-Guidance 2020 (F20). Der Entwurf von 2022 sagt „at least“ (Falle 0.10), darum „up to“.
11. **3:40 „a stadium full of people, followed for years“ [prüfen] (neu, M2):** Analogie für FOURIER, 27.564 Patienten, Median 2,2 Jahre (F21). Die Zahl steht nur in der Einblendung.
12. **4:19 „A trial runs for weeks. But in those weeks, many people improve on a sugar pill too.“ [prüfen]:** Studiendauer und Placebo-Ansprechen stehen so nicht im Faktenzettel (F23 nennt nur die 51 %). Beleg ergänzen.
13. 4:29 „only about half the trials“: Turner et al. 2008, 38 von 74 (51 %) (F23, Falle 0.11). v2 ohne „the regulator saw“; dass es FDA-Daten sind, sagt die Einblendung (FDA REVIEWS).
14. ~~4:55 Psilocybin [prüfen]~~: **entfällt mit dem Satz (K1).** Die Prüfung von F25 (COMP360-Antrag 9.11.2026, nur HCPLive) ist nur nötig, falls der Satz zurückkommt.
15. 5:02–5:08 „around twenty years“ und „by the deadline … already carry the first traces today“: F26 (Alzheimer's Association, „20 years or more“); der zweite Satz ist die vorsichtig formulierte Ableitung aus dem Faktenzettel („by the deadline“ = bis 2036).
16. **5:24 „One such trial waited years for its answer. The drug didn't work.“ [prüfen]:** F27 ist umstritten. A4 (Solanezumab) bei Menschen ohne Symptome lief 240 Wochen und scheiterte. Der v1-Teil „Another big one is due to finish next year“ (TRAILBLAZER-ALZ 3) ist gestrichen (M2); TRAILBLAZER-ALZ 3 steht nur noch in der Einblendung bei 7:55 (Screening per Bluttest).
17. **5:37 „The line in the sales video doesn't mention that either.“ [prüfen] (neu, M3):** wie Punkt 8, bezogen auf die Alzheimer-Einschränkung (F5). Ersetzt v1 „The pitch left that out, too.“
18. 5:48 „Since last year, a blood test can spot the first traces.“: FDA 16.5.2025, Lumipulse, nur bei Symptomen ab 55 (F29, Falle 0.9). Der Satz sagt nicht, dass Gesunde den Test bekommen; das sagt 7:55 ausdrücklich. „last year“ gilt für einen Release 2026.
19. **6:12 Ramakrishnan, mit der Deutung bei 6:29 [prüfen]:**
    - Das Interview stammt vom 9.11.2026, also vor dem Roadshow-Video: „this month“ und nicht als Antwort auf Dario darstellen.
    - „biologist“ ist ergänzt (F32 nennt nur den Nobelpreis Chemie 2009; Einblendung MOLECULAR BIOLOGIST).
    - Erledigt: Die C5-Stelle ist gefunden, 05:36,0–05:45,4 (`clips/schnitt.json`). „bottleneck“ fällt nicht, der Satz sagt dasselbe („rate-limiting factor“).
    - Sinn: Er meint Tempo („very fast“, „rate-limiting“), damit trägt „The testing, not the finding.“. Offen ist nur, ob die Frage davor KI und neue Medikamente betrifft („asked … about artificial intelligence and new drugs“). Direkt danach sagt er „Human biology is complicated“.
    - Der Name „Venki Ramakrishnan“ steht jetzt im Sprechtext, weil der Clip nur Ton hat. Der Fallback als Karte entfällt.
20. 6:32 „The other reason for Amodei's date: he's betting that the testing can speed up too.“: Einordnung aus F6 („When something works really well, it goes much faster“; „~1 year end-to-end … very compatible with radical transformation in 5-10 years“) und F7 (C3: „much faster than we're used to“; 01:42:50 Reform der Zulassung). Kein neuer Fakt.
21. **6:38 Topol [prüfen] (nachgetragen, K7):** Datum unklar (Falle 0.7, F30), darum ohne Datum; Wortlaut „wildly off-base“ am Post prüfen.
22. **6:46 „In August, he wrote that the only thing that will convince people is actually curing cancer.“ [prüfen] (nachgetragen, K7):** F8 umstritten (nur sekundär, X blockiert). Wortlaut „The thing that will work is actually curing cancer.“ und Datum 15./16.8.2026 am Post prüfen.
23. 6:57–7:06 Mithril: Idee bis Mausdaten in < 18 Monaten, Studien am Menschen „as soon as late 2028“ (F9, Primärquelle 27.10.2026). „First date: fast. Second date: years away.“ ist unsere Einordnung dieser beiden Fakten.
24. 7:22 C2: Dwarkesh 01:42:38,9–01:42:47,6 (F7); Wortlaut und Sprecher fest laut `clips/schnitt.json`; beginnt mitten im Satz („I think“ davor weggelassen).
25. **7:40 Szene „around sixty“ [prüfen]:** illustrativ. Bestätigen, dass sechzig im Einschlussalter der Vorbeugestudien liegt (z. B. TRAILBLAZER-ALZ 3); das Screening per Bluttest steht in F27.
26. 8:03–8:11 digitale Zwillinge: EMA-Qualifizierung von PROCOVA am 20.9.2022 für Phase-2/3-Studien mit stetigen Messgrößen (F34); „for some trials“ meint genau diese. „bis ~35 %“ ist eine Firmenangabe und steht nur so gekennzeichnet in der Einblendung.
27. **8:21 FDA [prüfen] (nachgetragen, K7):** „Elsa“ seit Juni 2025; Prioritätsprüfung (CNPV) mit Ziel 1–2 Monate (F35 umstritten, Stand am Release prüfen).
28. 8:32 Darios Vorschlag: F7 (01:42:50–01:43:21, „designed around an era of drugs that barely work“).
29. **8:45 Zitatkarte C1b [prüfen]:** Wortlaut nur sekundär (F2): „age“ oder „era“ of miracles, Reihenfolge zu C1 (Falle 0.1). „In the sales video“ setzt voraus, dass der Satz im Roadshow-Video fällt (laut Yahoo Finance ja). Gekürzt nach „miracles“ (K4); die Karte zeigt „…“.
30. **9:41 „Investors are already putting a price on the first date.“ [prüfen] (umformuliert, M4):** Termine laut F3 nur sekundär (Preis 18.11., Handel ab 19.11.). Der Satz stimmt vor der Preisfestsetzung (Spanne seit 10.11., Orderbücher laufen) und danach (Handel). Am 16.11. vormittags prüfen; nur bei einer Absage des Börsengangs muss er neu.
31. Am 16.11. allgemein: Ist inzwischen ein von KI entdecktes Medikament zugelassen (Falle 0.4)? Der Text behauptet es nicht; „Same road as everyone else“ (7:06) bliebe richtig. Zeitbezüge relativ zum Release:
    - „just“ (0:00)
    - „years ago“ (1:11)
    - „Earlier this year“ (1:32 und 7:16: Feb. 2026)
    - „In a recent trial“ (3:15)
    - „Since last year“ (5:48)
    - „this month“ (6:12)
    - „In August“ (6:46)
    - „already“ (9:41)

Entfallen mit v2, kein Prüfbedarf mehr:
- Lilly-Chef (F31, M1)
- Pharma-Kauf Verve (F19, M2; „like this“ war unscharf, weil Verve auf PCSK9 zielt)
- TRAILBLAZER „next year“ (Teil von F27, M2)
- Psilocybin (F25, K1)

---

## Hinweise

- **Regeln geprüft (REGELN §1–11):**
  - Kein „AI“ im Sprechtext, immer „artificial intelligence“ („AI“ nur im O-Ton C2 und C5 und in Einblendungen). Keine Ich-Sätze des Erzählers; „I think“ steht nur in den gelesenen Zitaten. Kein Flüstern: keine `[softly]`, `[whispers]`, `[quietly]`, `[hushed]`.
  - Bann-Liste: 0 Treffer (`regel_check.py`). Dazu Textsuche nach „nobody“, „no one“, „here's the“, „let's“, „most of us“, „in this video“, „the secret“, „real story“: 0.
  - Minute 1 unverändert: eine Frage (0:21), Zahlwörter „ten“ und „two“, keine Jahreszahl, kein Fahrplan, keine Biografie. Person und Zitat erst nach dem ersten Gewinn (0:47), die Firma bei 0:59 in einem einzigen Kontext-Satz.
  - Titel bis 1:30 eingelöst (Karte 0:50, wer und wo 0:59).
  - Abo-Aufruf zweimal, jeweils mit Mission und als Frage, nie im Hook (3:58 nach dem Urteil ½, 9:49 nach Kernsatz und Anleger-Satz); „subscribe“ = 2. Kein gesprochener Spendenaufruf. Der QR läuft je ~25–27 s ab dem Abo-Satz und ist vor dem Endbild weg.
  - Keine Anlageberatung: ein klarer Satz bei 1:08. Keine Bewertung der Aktie, keine Kurse, kein Ausgabepreis, auch nicht im Bild (Ticker bei 9:41 ohne Zahlen).
  - Keine Offenlegung „Claude ist von Anthropic“ (§1.10): Claude kommt nicht vor; Anthropics Medikamentenarbeit ohne Modellnamen.
  - Fairness: sein stärkstes Argument zuerst (1:21–1:29), seine eigene Grenze im O-Ton (C3), seine Wette in seinem Sinn (6:32). Fairness-Sätze:
    - 1:11 „He didn't invent it for investors.“
    - 1:21 „his reasoning is better than it sounds“
    - 4:40 „That doesn't make it hopeless.“
    - 6:32 „he's betting that the testing can speed up too“
    - 6:46 „To be fair, Amodei holds himself to a harder test.“
    - 7:16 „He even warned of a jam himself“
    - 8:32 „Amodei's own proposal“
    - 8:40 seine Bedingung (C1b)
  - Was im Verkaufsvideo fehlt, wird nur am zitierten Satz festgemacht (2:58, 5:37; M3). Die Kritik gilt dem Satz ohne Kleingedrucktes, nicht der Person und nicht der Vision. Anreiz statt Bösewicht (6:06 „No villain needed.“, §1.7).
  - Payoff-Check (§6):
    - Titel eingelöst.
    - Ein Mitnehm-Fakt pro Akt (siehe „Nach dem Film“).
    - Kenner-Test: neu sind die vier Antwortzeiten, das Kleingedruckte von 2024 neben dem zitierten Satz, Darios eigenes Medikament und sein eigener Stau als Beleg und die Lösung über das zweite Datum.
    - Jeder Einwand ein Satz, danach ein Urteil (Tafel).
  - Lösungen (§11): drei Szenen mit Antwort, Beleg, Grenze und Macht (7:40–8:32), Mission-Satz 8:51–9:09.
  - Tiefe (mindestens zwei):
    - zwei Missverständnisse gebrochen (Finden = Heilen; Studien sind langsam wegen Bürokratie)
    - Mechanismus statt Bösewicht (Anreiz des Verkaufsvideos)
    - offener Streit der Fachleute (Ramakrishnan, Topol gegen Darios Wette und seine eigenen Argumente)
    - Sicherheit hörbar gemacht: „he argues“, „may persist“, „can probably be cured“, „an open question“, „he's betting“
  - Pflanzen und Ernten:
    - Enkel und „plague“ (0:13) → 9:24
    - Kernsatz (0:31) → 9:35 → Anleger-Satz 9:41
    - Kleingedrucktes (1:11) → 2:50 („most cancer“) → 5:29 („difficult to reverse“)
    - Essay-Titel „Machines of Loving Grace“ (1:11) → O-Ton C3 (1:39)
    - „the fastest … the slowest“ (0:37) → 2:04 und 4:56 (große Schleife)
    - „much faster … but not infinitely fast“ (C3, 1:39) → 6:32 (seine Wette)
    - „the slow part“ (5:59) → 6:12 („named the slow part“)
    - Zuckerpille (4:19) → digitale Zwillinge (8:03)
    - Herz-Grenze „for life“ (3:32) → 8:32 („But remember the heart“)
    - „the first forgotten name“ (5:02) → 7:49
    - Bluttest (5:48) → Studienklinik (7:40)
    - „if we do this right“ (8:45) → 9:09 („That's what doing it right looks like.“)
  - Hörfassung ohne Bild: Die Tafel-Urteile werden gesprochen, „half“ heißt jetzt „only halfway“ bzw. „halfway“. Jeder Clip hat einen Einordnungssatz davor und danach ein Echo oder eine Deutung (1:50, 6:29, 7:30); der Text trägt auch ohne Clip. Die Schlüsselbegriffe „first date / second date“ sind bei 7:06 neu verankert.
  - Überschneidungen mit früheren Filmen geprüft (unverändert gegenüber v1). Nicht verwendet:
    - aus #20: Insulin, Preisschild, Uhr/Jahrgänge, Hassabis „end of disease“, „nine in ten drugs fail“, Lebensspanne
    - aus #15: Moderna, Phase-1-Quote, „below five years“, Isomorphic, Freiwilligen-Aufruf, Hep C, Lenacapavir
    - aus #4: RECOVERY, Dwarkesh 00:49:08, Rentosertib
    - Motive Uhr, Lichter, Startlinie
- **Tags (STANDARD-STIMME, höchstens ein Stil-Tag pro Absatz):**
  - `[calm, conversational]` ×1, `[curious]` ×1, `[thoughtful]` ×2, `[warm]` ×2 (nur Abo-Aufrufe)
  - `[pause]` ×2 (5:48, 9:24); die Pause vor dem Disclaimer ist gestrichen (K2)
  - Leerzeilen = Absatzwechsel (9). Zwischen Hook und Station 1 steht bewusst keine Leerzeile (keine Pause am Hook-Ende).
- **Zitatkarten in `vo-v2.txt`:** Marke `[ZITATKARTE C1]` bzw. `[ZITATKARTE C1b]` auf eigener Zeile, darunter der Kartentext in Anführungszeichen. Die Erzählstimme liest ihn im selben Ton, ohne Stimmwechsel. Die Anführungszeichen sind nur Markierung (und halten `regel_check.py` davon ab, das „I think“ als Ich-Satz zu zählen). C1b ist gekürzt (K4).
- **C5 ist ein echter Clip, nur Ton** (Nachtrag 12.11., `clips/schnitt.json`):
  - Das Bild kommt aus eigenem Material: Studio-Silhouette, Audiowelle, Bauchbinde, Untertitel wortgleich; kein Foto, kein Porträt.
  - Der Fallback als Zitatkarte und die Reserve C7 (K9) entfallen. Der Film hat 3 echte Clips (§7 ✓).
- **Aussprache-Test (v4):** „Amodei“ (wie im O-Ton C3/C2), „Anthropic“, „Alzheimer's“, „Topol“, „Nobel“, „Venki Ramakrishnan“, „Machines of Loving Grace“, „cholesterol“, „muscular dystrophy“, „infusion“. Zahlen sind ausgeschrieben, wie sie gesprochen werden („twenty thirty-six“, „twenty twenty-eight“, „fifty-five“). „Psilocybin“ und „Eli Lilly“ kommen nicht mehr vor.
- **Schnitt (§7, clip-schritt.md):**
  - C5 → C2 = 52 s (v1: 49 s). Zwischen 6:29 und 7:22 nur kürzen, wenn der Abstand danach neu gemessen wird. Grenze bei 2,4 W/s: ~108 Wörter; jetzt sind es 125.
  - C3 → C5 = 270 s.
  - C3 und C2 stammen aus derselben Folge (Dwarkesh): zusammen 19,2 s (10,45 + 8,72), knapp unter 20 s. Beide nicht verlängern; die Denkpause in C2 (~0,9 s) zu straffen schafft Luft.
  - Ein- und Ausstiege laut `clips/schnitt.json`: C3 und C2 enden knapp vor dem nächsten Wort (Ton 2–3 Frames ausblenden), C5 hat saubere Pausen.
  - C1/C1b sind Karten, kein Footage aus dem Roadshow-Video; die Musikfrage entfällt.
  - K6 ist erledigt: Das Echo nach C3 ist durch die Deutung „So even in his view, proof takes time.“ (1:50) ersetzt, weil der Clip jetzt wortgleich auf „not infinitely fast“ endet.
- **K5, Labor-Staunen im Bild:** Haken-Varianten im Sekundentakt, Einblendung „CAR-T DESIGN STEP ≈ 70 % SHORTER · PRECLINICAL“. Reserve, falls mehr Staunen gewünscht ist: F11 Kapsid (in unter einer Stunde, fast Atom für Atom, nur ohne Modellnamen, §1.10). Nicht eingebaut, weil der Text an der Wortgrenze ist.
- **Optional, nicht eingebaut:**
  - F16 Krebs-Sterblichkeit −34 % seit 1991
  - F39 Skorpiongift-Binder (Vázquez Torres: „binding itself is no longer the main bottleneck“) als Reserve für „Labor schnell, Weg zum Patienten lang“
  - F40 Australien (Gebärmutterhalskrebs um 2035) als Reserve für „relic of the past“
  - In v2 gestrichen: Psilocybin (K1), Lilly (M1), Pharma-Kauf (M2)
- **Offen für Jakob:**
  - Länge ≈ 10:29 mit Endbild; der Sprechtext endet bei 10:07 (vor dem Clip-Nachtrag 9:56; v1: 10:28 / 10:48). Die Sekunden über 10:00 kommen aus den festen Clip-Längen (+5,5 s) und den angepassten Einordnungssätzen (+5 s).
  - Der Hook ist unverändert. Hörprobe an der Wendung 0:26 und an der Übergabe 0:47 (wie in hook-v1).
  - Station 6 ist neu gebaut (M1). In der Hörprobe darauf achten, ob die Kette „Anreiz → langsamer Teil → seine Wette“ ohne Bild trägt.
  - Hörprobe C3: Kommt „There's not efficacy, right?“ direkt nach „…and set his own limit.“ verständlich an? Später einsteigen geht nicht (keine Pause vor „And I make“).

## Regel-Check

`python3 /mnt/project-files/scenario/schreibraum/regel_check.py vo-v2.txt` (12.11.2026, nach dem Clip-Nachtrag, auf der Projektdatei im Ordner `film-heilung`):

```
===== vo-v2.txt  (1368 Wörter ≈ 9.4 Min)
  → 0 Hinweis(e)
```

Exit-Code 0. Die Minutenangabe des Skripts rechnet mit 145 W/min ohne Clips und Pausen; mit Clips, Pausen und 2,4 W/s endet der Sprechtext bei 10:07.

Dazu per Textsuche in `vo-v2.txt`:
- „subscribe“ = 2
- Clip-Marken `[CLIP …]` = 3 (C3, C5, C2)
- Zitatkarten `[ZITATKARTE …]` = 2 (C1, C1b)
- Ich-Sätze 0 · „AI“ im Sprechtext 0 · verbotene Tags 0 · `[pause]` = 2
- [prüfen]-Marken in text-v2: 16
