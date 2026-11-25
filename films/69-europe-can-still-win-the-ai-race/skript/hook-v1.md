# Hook v1 · #69 „Europe Can Still Win the AI Race“ · 23.11.2026

Drei Varianten nach REGELN §4 (eigener Schritt, eigene Kritik). Alle drei: erste Worte = Titelversprechen, dann „Everyone says it has already lost …“, dann warum es dich betrifft, dann EINE Hauptfrage, 0:30–0:50 harte Wendung mit **genau einer** Zahl, erster Gewinn („It's in twenty-seven pieces.“) bis 1:00. Keine Metapher, die nur mit Bild funktioniert (Hörfassungs-Test). Zeiten bei 2,4 Wörtern/Sekunde.

Im VO steht „A.I.“ (Aussprache), in `vo-v1.txt` steht „AI“ wie im Vorbild #66.

---

## A · „Drei Teile, drei Mal weg“ — **GEWÄHLT**

153 Wörter bis zum Hook-Ende (1:03). Hauptfrage nach 71 Wörtern (0:26). Eine Zahl.

> Europe can still win the race for artificial intelligence.
> Everyone says it has already lost. Too slow. Too small. Too many rules.
> And whoever builds it gets a say in how it treats you. Which A.I. reads your contracts. Sits in on your job interview. Says yes or no to your loan.
> Wherever you live.
> Right now, almost none of that A.I. is European.
> So how could Europe possibly still win?
> Guess how much of the world's computing power for A.I. sits in the European Union.
> About a twentieth.
> And yet: the only machines on Earth that can print the most advanced chips are built in Europe. Then shipped away.
> Many of its best A.I. researchers are trained in Europe. Then hired away.
> Its savings sit in European banks, and stay there.
> So Europe isn't too small.
> It's in twenty-seven pieces.
> And the plan to put them together is already on the table.

| Zeit | Regel §4 | In A | Urteil |
|---|---|---|---|
| 0–3 s | Erste Worte = Titelworte, erstes Bild = Thumbnail-Motiv, These groß, stumm verständlich | „Europe can still win the race for artificial intelligence.“ + Bausatz-Brett mit losen Teilen, Text EUROPE CAN STILL WIN | erfüllt |
| 3–30 s | Erst das Warum (1–3 Sätze), Einsatz, dann EINE Hauptfrage; kein Zitat, keine Firma, keine Statistik | 0:03 der Abgesang, den alle kennen · 0:09 dein Einsatz in drei Schlägen (Vertrag, Bewerbungsgespräch, Kredit) · 0:21 „Wherever you live“ · 0:22 Lücke · Frage 0:26–0:29 | erfüllt |
| 30–50 s | Teuerste Stelle: harte Wendung in kurzen Schlägen, nicht erklären, nicht einschränken, nicht zurückblicken | 0:29 Rate-Moment · 0:35 die eine Zahl · 0:37/0:45/0:51 drei Mal „ist da, geht weg“ (Maschine, Köpfe, Geld) | erfüllt |
| 50–60 s | Erster Gewinn, der die nächste Lücke öffnet | 0:55 „So Europe isn't too small.“ · 0:57 **„It's in twenty-seven pieces.“** · 0:58 der Plan liegt auf dem Tisch | erfüllt |
| Minute 1 | höchstens eine Zahl, keine Jahreszahl, eine Frage, kein Fahrplan, kein Firmen-Detail | 1 Zahl („about a twentieth“), 0 Jahreszahlen, 1 Fragezeichen, kein Fahrplan, kein Firmenname | erfüllt, eine begründete Ausnahme: „twenty-seven“ (siehe Risiken) |

**Gegentest (Fremder, nur die erste Minute, nur Ton):**
- (a) Worum geht es? Europa kann das KI-Rennen noch gewinnen, obwohl alle das Gegenteil sagen.
- (b) Warum ist es echt? Eine Zahl (ein Zwanzigstel der KI-Rechenleistung) und drei Dinge, die es wirklich gibt.
- (c) Welche Frage ist offen? Wie soll das gehen — und was ist der Plan, der „schon auf dem Tisch“ liegt?
- (d) Stärkerer Grund zu bleiben bei 0:45 als bei 0:30? Ja. Bei 0:30 steht eine Frage. Bei 0:37–0:51 kommt das Staunen (die einzigen Maschinen der Welt stehen in Europa und fahren weg), bei 0:57 die Umdeutung des ganzen Themas.

**Warum A:**
1. **Der Marktcheck verlangt die Gegenthese, nicht den Abgesang.** Satz 2 holt den Abgesang ab, den dieses Publikum kennt (Chatham House 855k, Front Page 373k), und dreht ihn in Satz 3–7 um. Genau die Spur „actually winning / surprisingly well“ (113k–221k).
2. **Du-Bezug für ein Publikum, das vielleicht nicht in Europa lebt.** Der Einsatz ist „welche KI entscheidet über dich“ plus „Wherever you live“, nicht „dein Erspartes“. Das Ersparte kommt erst in Station 2 als Europäer-Szene („If you live there, part of that is yours.“).
3. **Die Wendung ist dreimal dieselbe Form** (es ist da → es geht weg). Das macht „It's in twenty-seven pieces“ hörbar unausweichlich, ohne es zu erklären. Keine Erklärung, kein Rückblick, keine Einschränkung im Fenster 0:30–0:50.
4. **Ohne Bild verständlich.** Kein abstraktes Bild, keine Kurve, keine Linie. Der Bausatz ist im Bild, der Text braucht ihn nicht.

**Risiken von A:**
- „twenty-seven“ ist im strengen Sinn eine zweite Zahl in Minute 1. Sie steht hier bewusst: Sie ist der Kernsatz des Films und keine Zahl zum Rechnen, sondern der Name der Sache (27 Mitgliedsländer). `regel_check.py` zählt „twenty“ und „seven“ als zwei Zahl-Wörter und bleibt damit unter der Warnschwelle.
- „Many of its best A.I. researchers are trained in Europe. Then hired away.“ ist die zugespitzte Fassung von F39/F40. Station 5 löst sie ehrlich auf (der Strom dreht sich gerade). Wer die Zuspitzung nicht will: „Many of the people who build A.I. are trained in Europe. Then hired away.“
- „Right now, almost none of that A.I. is European.“ hat keine harte Zahl (F3) und ist als Bild gesprochen, nicht als Statistik. Die Zahl dazu käme aus #68 und bleibt dort.
- Drei Schläge in Folge sind dicht. Wenn die Probe-TTS zu hektisch klingt: „Its savings sit in European banks, and stay there.“ streichen (−9 Wörter), Geld kommt in Station 2 ohnehin.

---

## B · „Die Maschine zuerst“ (nicht gewählt)

141 Wörter, Hauptfrage nach 59 Wörtern (0:25).

> Europe can still win the race for artificial intelligence.
> Everyone says it has already lost. Too slow. Too small. Too many rules.
> And whoever builds it gets a say in how it treats you. Which A.I. reads your contracts, sits in on your job interview, says yes or no to your loan.
> So how could Europe possibly still win?
> With this.
> In a Dutch town, one company builds a machine the size of a bus. Shipping one fills three cargo jets.
> No other company on Earth can build it. And almost every advanced A.I. chip in the world was printed by one.
> Now guess how much of the world's computing power for A.I. sits in the European Union.
> About a twentieth.
> Everything a superpower needs is already here. It's just not connected.
> Europe isn't too small. It's in twenty-seven pieces.

**Stärke:** Das Staunen kommt früher (0:27) und ist das stärkste Bild des Films. Die Frage steht schon bei 0:25.
**Schwäche, darum nicht gewählt:** Die teuerste Stelle (0:30–0:50) erklärt eine Firma und eine Maschine — §4 verbietet Firmen-Details in Minute 1, und die Wendung ist dann eine Beschreibung, keine Wendung. Die eine Zahl landet erst bei 0:48, der erste Gewinn drängt sich in die letzten 8 Sekunden. Außerdem fehlt „Wherever you live“, der Satz für Zuschauer außerhalb Europas.

---

## C · „Der Tisch“ (nicht gewählt)

150 Wörter, Hauptfrage nach 77 Wörtern (0:32).

> Europe can still win the race for artificial intelligence.
> Everyone says it has already lost. Too slow. Too small. Too many rules.
> But this race isn't only about who builds the smartest machine. It's about who sits at the table when the rules for it are written.
> And about which A.I. reads your contracts, sits in on your job interview, says yes or no to your loan. Wherever you live.
> So how could Europe possibly still win?
> Guess how much of the world's computing power for A.I. sits in the European Union. About a twentieth.
> And yet Europe holds something nobody else has. The only machines that can print the most advanced chips are built there.
> Ten trillion euros of savings sit in its banks.
> Everything is here. Nothing is together.
> Europe isn't too small. It's in twenty-seven pieces.

**Stärke:** Nennt das Ziel des Films (Mitsprache) am klarsten und liefert mit „Everything is here. Nothing is together.“ den Kernsatz K2 schon im Hook.
**Schwäche, darum nicht gewählt:** Zwei Zahlen in Minute 1 (ein Zwanzigstel, zehn Billionen) — klarer Regelbruch. „Who sits at the table when the rules are written“ ist abstrakter als „welche KI entscheidet über dich“ und für 45+ am TV schwerer zu greifen (§8.11). Die Frage kommt 6 Sekunden später als in A.

---

## Gemeinsame Auflagen für alle Varianten

- Kein Clip und kein Zitat vor 0:30 (Marktcheck, §4). Der erste O-Ton ist C1 (Draghi) bei ~2:02.
- Kein Musik-Break und keine Pause am Hook-Ende: 0:58 läuft direkt in Station 1.
- Erstes Bild = Thumbnail-Motiv (Europa-Karte als Bausatz-Brett, lose Teile, winzige Figur), Thesentext 3–6 Wörter, eingebrannte Untertitel ab dem ersten Wort.
- Nicht sagen: „every A.I. chip on Earth“ (Faktenzettel 0.2), „Europe“ statt „European Union“ bei der Zahl (0.1), „answers your doctor“ (§2.5c), keine US-Zahl (Überschneidung #68).
