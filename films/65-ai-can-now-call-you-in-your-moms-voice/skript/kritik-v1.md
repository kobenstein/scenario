# #65 · „AI Can Now Call Your Mom as You“ · Kritik v1 (20.11.2026)

Kritiker: Fable 5.2, als normaler Zuschauer (45+, am Fernseher, kein Fachmann). Geprüft: `vo-v1.txt`, `text-v1.md`, `hook-v1.md` gegen `schreibraum/REGELN.md` (Stand 20.11.), `geruest-v1.md` samt Nachtrag, `faktenzettel.md` und `ausreisser-analyse-2026-11-20.md`. Zusätzlich gelesen: `clips.json` (für den Clip-Check), `recherche.md` (nur für Zweifelsfälle; Maßstab für „belegt“ bleibt der Faktenzettel), `film-vorbereiten/vo-v4.txt` (#49) und die Endfassungen von #19, Singularität und Gute KI (Wiederholungen).

- **Z.** = Zeile in `vo-v1.txt`. Zeiten wie in `text-v1.md` (150 Wörter/Min, Clips addiert); nachgerechnet, sie stimmen auf 1 bis 4 Sekunden.
- **[N]** = steht nicht auf dem Faktenzettel, nur in `recherche.md` oder `clips.json`. Erst nachtragen und prüfen, dann benutzen.
- Nachgeprüft und in Ordnung: Sprechtext in `vo-v1.txt` und `text-v1.md` wortgleich (67 Zeilen, 0 Abweichungen) · 1.415 Wörter · Bann-Liste 0 Treffer (Prüfskript und eigene Suche über die ganze Liste aus §5.2) · „subscribe“ 2× · Ich- und Wir-Sätze 0 · Flüster-Tags 0 · „AI“ ohne Punkte 0 · Sätze im Mittel 8,2 Wörter, der längste 24 · keine Medizin · keine Fakten oder Zitate aus #19, Singularität (Bruder-Stimme) oder Gute KI (Apate) · #49 v4 enthält keinen Betrug mehr, also keine Doppelung der Inhalte.
- Die 54 % bleiben in diesem Film (#49 hat sie gestrichen). Der offene Punkt 3 in `text-v1.md` ist damit erledigt.
- Alle Ersatztexte aus Abschnitt 6 habe ich in eine Kopie eingesetzt und gemessen (Ergebnis am Ende von Abschnitt 6). Die Kopie liegt nicht im Projekt. An Skript und Sprechtext habe ich nichts geändert.
- Befangenheit: Diese Kritik läuft auf einem Modell von Anthropic. Der Bedrohungsbericht in Schritt 2 stammt laut `recherche.md` von Anthropic, die Studie bei 8:52 lief laut WIRED auf einem Claude-Modell. Meine Vorschläge fügen keinen solchen Beleg hinzu. Der Satz zum Eigeninteresse der Firma bleibt im Text, er rückt nur vor den Beleg.

---

## 1 · Note und Urteil

**Note: 7 von 10.**

Das Skript ist leicht zu verstehen, ehrlich und respektvoll, und drei Stellen tragen wirklich: die Mutter aus Kalifornien (0:56–1:26), der fünfte Schritt mit der Vertrauensperson (6:27–7:18) und der Schluss ab 8:40. In der Mitte verliert es mich viermal: Auf den besten Staunen-Moment folgen 28 Sekunden Einschränkungen (3:00), zwischen 2:46 und 4:10 fallen acht Mengenangaben in 84 Sekunden, von 4:40 bis 6:41 gibt es zwei Minuten Behörden-Warnung ohne ein einziges KI-Wort, und die große Antwort wird schon bei 2:06 verraten, sodass 8:08–8:30 wie eine Zusammenfassung klingt. Neu geschrieben werden muss nichts: Mit sechs gezielten Umbauten (alle mit Ersatztext, zusammen 29 Wörter kürzer) ist eine 8 bis 8,5 erreichbar; vor der Stimme müssen aber drei der vier Clip-Wortlaute am Ton bestätigt sein.

**Regel-Check v1: 4 von 9 bestanden** (§2, §4, §8; §7 unter Vorbehalt). Nicht bestanden: §1 (nur 1.2), §3 (3.1, 3.3, 3.5), §5 (nur 5.1 Zahlendichte), §6 (6.4). §9 nicht prüfbar, das Thumbnail fehlt. `regel_check.py`: 8 Hinweise, davon 1 echter (7 Zahl-Wörter in Minute 1) und 7 Fehlalarme bei „A.I.“. Mit MUSS 1–6 und SOLL 8 sind 8 von 9 erreichbar: Die Lücke aus §3.3 schließt erst SOLL 8, kein MUSS. Offen bleiben dann §9 und der Hinweis zu §3.4; bei §1.2 bleibt die Dichte an Behörden in Schritt 4 und 5 als Hinweis (SOLL 9 mildert sie).

**Das trägt und muss bleiben:**

- 0:27–0:42 (Z. 6–7): „Don't count on her ears. Or on yours.“ und „What protects her has to work even when she is completely fooled.“ Das ist mein Grund zu bleiben.
- 0:56–1:26 (Z. 11–14): der Fall aus dem Senat, „absolutely her voice“, fünfeinhalb Stunden, „She was certain. Anyone would be.“ Titel eingelöst, kein Spott.
- „It's a plan, made on a calm day.“ (Z. 45) und „Hurry, plus secrecy, plus money, means stop.“ (Z. 46).
- 6:27–6:44 (Z. 49–52): „But suppose she doesn't stop … she's on her way to the bank.“ Bester Übergang des Films.
- „You can't withdraw a cent.“ und „Brokers … must ask for that name. Banks don't have to.“ (Z. 54–55). Das Neueste und Nützlichste im Film.
- „For all of history, your child's voice was proof. That has ended.“ (Z. 66) und „it won't arrive as a robot. It arrives as a phone call.“ (Z. 68).
- Der Schluss (Z. 71–73): dieselbe Szene wie im Hook, „She asks for the word. The line goes quiet.“, dann der Kernsatz.
- Die Wahl von Hook-Variante A in `hook-v1.md` ist richtig: Nur A erfüllt Jakobs Regel vom 20.11. wörtlich (B stellt die Szene vor das Warum, C ist eine Inhaltsangabe und verrät die Stationen).

**Hinweis für Jakob, kein Umbau heute (§3.4):** #65 ist eine Fünfer-Leiter nach dem Muster „vier + eins“ („Four of them, a machine can now fake. One, it cannot.“). #19 hatte dasselbe Muster („Five things. And one of them, you can't do alone.“), und #49 v4, auf den die Endcard zeigt, zählt ebenfalls fünf Stufen herunter („FIVE YEARS → ONE YEAR“, die letzte ist die besondere). Alle drei bauen jede Station gleich: Staunen, Schritt, wovor er schützt, offene Frage. Zwei solche Filme direkt hintereinander sehen nach Schablone aus (YPP-Risiko, 26.10.). Mildern lässt sich das im Bild: #49 zeigt Jahre als Countdown, #65 sollte den Weg vom Handy zum Ersparten zeigen und nicht noch eine Zählleiste.

**Reihenfolge, weil heute alles in einem Zug produziert wird:** 1. Am iMac S1, C10 und S2 am Ton prüfen (Wortlaut, Zeitmarken, Musik) → 2. Texter arbeitet MUSS 1–6 und die gewählten SOLL-Punkte ein → 3. `regel_check.py` und Nachmessung → 4. Kokoro-Hörfassung an Jakob → 5. Faktencheck der [S]-Zeilen vor der Stimme (Liste am Ende von Abschnitt 5).

**Laufzeit:** Nach den `timing.json` der letzten sieben Filme spricht die Stimme über alles 128 bis 146 Wörter pro Minute (reine Sprechstrecken 154 bis 163). 1.415 Wörter ergeben damit eher 9:45 bis 10:30 vor dem Endbild als die 9:29 aus `text-v1.md`. Der Rahmen von 8 bis 11 Minuten hält.

---

## 2 · Zuschauer-Durchgang mit Zeitmarken

| Zeit (Z.) | Was ich höre | Wie es bei mir ankommt | Art |
|---|---|---|---|
| 0:00–0:08 (1–2) | Titelsatz, dann „a short recording of your voice, and almost no money“ | Sofort klar, betrifft mich. Ich bin drin. | stark |
| 0:08–0:17 (3) | „scam losses are at a record“ und die acht Milliarden | Trockenste Zeile des Hooks (22 Wörter in zwei Sätzen, drei Zahlangaben: one year, over sixty, eight billion). „Online crime“ klingt nicht nach einem Anruf. Kein Ausstieg, weil nach 9 s die Frage kommt. | leichter Durchhänger |
| 0:17–0:27 (4–5) | Hauptfrage, dann die Szene mit dem Telefon | Klar und persönlich. Die Szene steht nach der Frage (Regel vom 20.11.), hat 13 Wörter, ich sehe sie vor mir. | stark |
| 0:27–0:42 (6–7) | Münzwurf, „forget listening harder“ | Beste Stelle des Hooks. Der Münzwurf ist ein mittleres Staunen, der Satz danach ist der eigentliche Gewinn. | stark |
| 0:42–0:54 (8) | „your voice is only the first of five steps between that machine and her savings“ | Das Rätsel „Four … One, it cannot“ zieht. Den Satz davor muss ich zweimal hören: Eine Stimme als „Schritt“? Zwischen welcher Maschine und dem Ersparten? | leichte Verwirrung (SOLL 1) |
| 0:54–1:26 (10–14) | Mutter aus Kalifornien, Clip, fünfeinhalb Stunden | Stärkste Passage des Films. Der Titel ist bei rund 1:10 eingelöst. Echte Person, echte Stimme, kein Spott. | stark, Staunen |
| 1:26–1:51 (15–17) | „those silent seconds after you say hello“, Wählcomputer | Wer das 2,8-Mio.-Video kennt, bekommt eine befriedigende Korrektur. Wer es nicht kennt, rätselt 8 s: welche stillen Sekunden? „Duller“ klingt gesprochen wie „dollar“. „What is already posted“ bleibt ohne Bild im Kopf. | Verwirrung für Neulinge (SOLL 4) |
| 1:51–2:06 (18) | Codewort, „You've likely heard the advice“ | Ehrlich, sagt mir aber: jetzt 15 s nichts Neues. Für Kenner eine Vorspul-Stelle. | schwach |
| 2:06–2:21 (19) | „But notice why it can work … agreed on before the phone rang“ | Das ist die große Antwort des Films, sechs Minuten zu früh. Ab hier weiß ich, worauf alles hinausläuft. | Antwort verraten (MUSS 2) |
| 2:21–2:41 (20–23) | „The caller also seems to know your life. How?“ und die Antwort | Gute Frage. Die Antwort ist ein einziger allgemeiner Satz ohne Staunen. „The clearest evidence comes from chat“ ist ein Bericht-Satz. Dann Dating-Apps: Was hat das mit dem Anruf bei meiner Mutter zu tun? | Sprung, Staunen fehlt |
| 2:41–3:00 (24–25) | Fabrik: 4.700 KI-Personen, drei von vier, „starting to suspect“ | Gänsehaut bei „starting to suspect“. Aber drei Zahlen in 6 s. | Staunen, zu dicht |
| 3:00–3:28 (26–27) | Quelle hat ein Interesse · bezahlter Chat, kein Raub · am Telefon spricht meist ein Mensch · KI-Anteil nie gemessen | 70 Wörter, vier Einschränkungen hintereinander, direkt nach dem besten Moment. Danach glaube ich weniger als vorher. Und der Film sagt mir selbst, dass am Telefon meist ein Mensch spricht, obwohl der Titel „AI can call“ heißt. | **Ausstiegsstelle Nr. 1** (MUSS 1) |
| 3:28–3:40 (28) | Regel 2: eine Frage, deren Antwort nie online war | Klar, aber abstrakt. Was ist der Unterschied zum Codewort? Ein Beispiel fehlt. | blass (SOLL 7) |
| 3:40–3:47 (29) | „the panicked call is the small version“ | Redet klein, wofür ich geklickt habe. Und Schritt 3 gehört gar nicht zum Anruf: „five steps between that machine and her savings“ klang nach einem einzigen Betrug. | Sprung (SOLL 6) |
| 3:47–4:20 (31–34) | acht Milliarden, dreieinhalb, fast doppelt, Kanada, neunhunderttausend | Dichteste Zahlenstelle (fünf Angaben in 21 s). Der Fall Kanada bekommt einen Satz, ohne Bild, und die Zahl kommt vor dem Gesicht (§11 will es umgekehrt). „The most expensive forgery … a face“ klingt gut, ist aber nicht belegt. | zu dicht, Fakt (MUSS 4, 5) |
| 4:20–4:37 (35) | Hausregel „famous face plus promised profit“ | Klar, merkbar, ich könnte sie weitersagen. | stark |
| 4:37–4:47 (37) | Abo-Aufruf 1 | Steht an einem geschlossenen Punkt, nichts ist offen. „Superintelligence“ fällt hier zum ersten Mal. „Your mother included“ ist gut. | Ausstiegsstelle Nr. 4 (SOLL 8) |
| 4:47–5:02 (39–40) | „All three share one weakness: time.“ | Guter Mechanismus, ein Satz reicht. | gut |
| 5:02–5:33 (41–43) | FBI-Clip, dann „scammers borrow that very badge“, „from the same Chicago office“ | Der Clip warnt vor etwas, das ich noch nicht kenne. Laut `clips.json` heißt er „If a would-be agent tries to isolate …“; „would-be agent“ verstehe ich erst nach Z. 43. „From the same Chicago office“ klingt, als käme der Betrug aus dem FBI-Büro. Und der Betrüger verlangt ein „agreement“: das Schlüsselwort des Films in der falschen Hand. | Verwirrung (MUSS 3) |
| 5:33–5:55 (44–45) | „So is your mother simply too trusting? The numbers say no.“ | Gute Frage, überraschende Antwort. Aber „Six cases in a hundred carry seventy percent of the money“ ist eine Rechenaufgabe; ohne Bild fehlen „über 100.000 Dollar“ und „bei Älteren“. | Staunen, dann zu dicht (MUSS 5) |
| 5:55–6:27 (46–48) | Regel 4, FTC-Satz, Clip C1 | Regel klar. C1 sagt 70 s nach C10 fast dasselbe (Eile heißt Stopp). Zwei Warnungen vom Amt hintereinander wirken wie ein Aufklärungsspot. Von 4:40 bis 6:41 fällt 121 s lang kein KI-Wort. | Ausstiegsstelle Nr. 3, Staunen fehlt (SOLL 9) |
| 6:27–6:44 (49–52) | „But suppose she doesn't stop“ · „the one no machine can fake“ | Ich bin wieder ganz da. Kurze Frage im Kopf: Was heißt „Geld fälschen“? Z. 53 erklärt es nur halb. | stark |
| 6:44–7:26 (53–56) | Vertrauensperson, Broker und Banken, Maryland und North Carolina | Das nehme ich mit. „They pass real people, and real rules“: Stimmt das beim Online-Banking? Wer nicht in den USA lebt, fragt sich, ob das für ihn gilt. | stark, ein Zweifel (MUSS 6) |
| 7:26–7:49 (57–59) | Bankenlobby, „so test it“ | Gute Haltung. Dritter O-Ton einer Institution in zweieinhalb Minuten. | gut |
| 7:49–8:08 (60–61) | „They can fail.“ · „can be stopped by a name on a form“ | Der Film wackelt am Höhepunkt: erst „They can fail“, 11 s später „can be stopped“, 30 s später „That is why it works“. Was gilt? | Verwirrung (MUSS 6) |
| 8:08–8:30 (63–64) | zwei Listen: vier Fälschungen, fünf Absprachen | Zusammenfassung. Die Antwort kenne ich seit 2:10. Ich spüre das Ende und greife zur Fernbedienung. | **Ausstiegsstelle Nr. 2** (MUSS 2) |
| 8:30–8:52 (65–66) | „it was never at her kitchen table“ · „For all of history …“ | Die Belohnung, größter Gedanke des Films. Kommt erst nach den Listen. | stark, Staunen |
| 8:52–9:25 (67–68) | Studie, „an early glimpse of superintelligence“ | Echtes Staunen und das Thema des Kanals. Kleiner Haken: Die Studie war ein Chat, am Telefon spricht laut Z. 27 meist ein Mensch. | stark |
| 9:25–10:05 (69–75) | zehn Minuten am Küchentisch, Ernte der Hook-Szene, Kernsatz, Abo-Aufruf 2 | Rund. „And then the same for yourself“ holt die Älteren ab, die selbst die Mutter sind (spät, aber da). | stark |

**Wo ich aussteige, nach Gewicht:** 1. 3:00–3:28 (Fußnoten nach dem Staunen) · 2. 8:08–8:30 (Listen, Antwort bekannt) · 3. 5:02–6:27 (Behörden-Block ohne KI) · 4. 4:37 (Abo-Aufruf ohne offene Frage) · 5. 1:51–2:06 (für Kenner). Das bekannte Leck 0:30–1:00 ist hier gut gestopft.

**Zu dicht: die Zahlen**

| Stelle | gesprochen | Befund |
|---|---|---|
| 0:08–0:17 und 0:42–0:54 | one year · over sixty · nearly eight billion · five steps · four · one | eine Statistik plus die Schritt-Zählung; Prüfskript: 7 Zahl-Wörter in Minute 1 |
| 2:46–2:52 | two weeks · forty-seven hundred · three out of four | drei Angaben in 6 s |
| 3:49–4:10 | eight billion · three and a half · nearly double · in her eighties · nine hundred thousand Canadian dollars | fünf Angaben in 21 s, dichteste Stelle |
| 5:44–5:47 | six cases in a hundred · seventy percent | zwei Angaben in 3 s, zum Rechnen, Bezug fehlt |

Rund ein Dutzend Mengenangaben in zehn Minuten (Regel: etwa eine pro Minute), acht davon zwischen 2:46 und 4:10. Die Selbstprüfung in `text-v1.md` zählt dort vier; gezählt wurden Fakten, nicht das, was das Ohr hört.

**Wo Staunen fehlt:** 2:27–2:41 (Antwort auf „How?“) · der Fall Kanada, ein Satz · 4:47–6:27, ganzer Schritt 4 bis auf „less often than younger people“ · 6:56–7:49 (Formular, Bundesstaaten, Lobby: nützlich, aber Verwaltung) · 8:08–8:30 (Wiederholung).

**Sprünge und roter Faden:** „Du und deine Mutter“ hält, jeder Schritt kehrt zu ihr zurück. Dazwischen liegen acht Wechsel von Ort oder Quelle (Senat, App-Anbieter, Kanada, FBI Chicago, FTC, zwei Bundesstaaten, Bankenverband, Studie). Der einzige echte Bruch ist Schritt 3: Der Hook verspricht fünf Schritte eines Betrugs, das Gesicht gehört aber zu einem anderen Betrug als der Anruf. Bei 6:27 fehlt es folgerichtig („Voice, story and clock all work“), bei 8:08 ist es wieder da.

**Relevant für mich?** In Hook, Schritt 1, 3 und 5 und am Schluss ja. In Schritt 2 (Dating-Apps) und Schritt 4 (Behörden) werde ich als Sohn oder Tochter kaum angesprochen.

---

## 3 · Regel-Checkliste §1–9 und Prüfskripte

| § | Urteil | Begründung |
|---|---|---|
| §1 Haltung | **nicht bestanden** (nur 1.2) | 1.2: Quelle und Einordnung im Satz statt im Bild (Z. 26, zwei Sätze); von 5:01 bis 7:40 neunzehn Nennungen von Behörden und Verbänden. Alles andere hält: Hoffnung in jedem Schritt (1.3), „du“ als Hauptperson (1.5), keine Ich-Sätze (1.6), kein Bösewicht (1.7), Firma und Lobby eingeordnet (1.9a), keine Firmennennung (1.10). |
| §2 Thema und Leitgedanke | **bestanden** | Ein Leitgedanke, Kernsatz klingt im Hook an (0:17) und kehrt am Ende zurück. Hinweis 2.5b: Drei gesprochene Belege sind älter als zwölf Monate (FTC-Warnung 2023, FBI-Rat Dez. 2024, PLOS One 2025); der Stand muss wirklich im Bild stehen. Hinweis 2.5: Die Kernthese ist nicht neu (Abschnitt 4.3). |
| §3 Story-Gerüst | **nicht bestanden** (3.1, 3.3, 3.5) | 3.1: Kette steht, aber die große Antwort fällt bei 2:06 (Z. 19). 3.3: Zwischen 3:45 und 5:34 rund 110 s ohne neue offene Frage, quer über den Abo-Aufruf. 3.5: Zweifel nicht gebündelt (Schritt 2 vier Einschränkungen, Schritt 5 drei). 3.4: Hinweis für Jakob (Abschnitt 1). Bestanden: Uhr STEP 1–5 (3.2), but/therefore-Übergänge (3.3a), roter Faden (3.3b, knapp), Szenario mit hörbarer Brücke (3.6), Ende und zwei Abo-Aufrufe mit Mission als Frage (3.8). |
| §4 Hook | **bestanden**, zwei Hinweise | Satz 1 = Titel wörtlich. Warum in zwei Sätzen, dann die eine Frage bei 0:19 (54 Wörter), erst danach die Szene (Regel 20.11.). Erster überraschender Fakt bei 0:33, erster Gewinn bei 0:42. Keine Jahreszahl, keine Firma, kein Zitat vor 0:30, keine Pause. Hinweis 1: Die Statistik bei 0:08 widerspricht der alten Tabelle, ist aber vom freigegebenen Gerüst und der neuen Regel gedeckt. Hinweis 2: 7 Zahl-Wörter in Minute 1 und ein schwerer Hörsatz (Z. 8). Gegentest bestanden: Nach 60 s weiß ich Thema, Beleg und offene Frage, und bei 0:45 habe ich mehr Grund zu bleiben als bei 0:30. |
| §5 Satz und Sprache | **nicht bestanden** (nur 5.1) | Zahlendichte, siehe Abschnitt 2. Bann-Liste 0, „A.I.“ durchgehend, nur erlaubte Tags, 1.415 Wörter. |
| §6 Payoff | **nicht bestanden** (6.4) | Abschnitt 4. |
| §7 Clips | **bestanden unter Vorbehalt** | 4 Clips (Regel 3–6), angenommen 35 s = rund 6 %, Abstände 239 / 64 / 62 s, jeder mit Einordnungssatz, keiner im Hook. Vorbehalt: Nur C1 hat geprüften Wortlaut; C10 und S2 stehen im Skript anders als in `clips.json`; C10 steht vor der Geschichte, die ihn erklärt (MUSS 3). S1 und S2 kommen aus demselben Video und dürfen zusammen höchstens 20 s haben. |
| §8 Titel | **bestanden** (Arbeitstitel) | 31 Zeichen, „AI“ vorn, Präsens, kein „could“, keine Frage, sofort ein Bild und Bezug zu mir. Der Film löst ihn bei 0:56–1:23 ein. Jakobs Freigabe des Titels steht in keiner der Dateien; der Nachtrag im Gerüst nennt noch „How to Protect Yourself From AI Scams“ (Anleitungs-Form, laut §8.9 Verlierer). |
| §9 Thumbnails | **nicht prüfbar** | Thumbnail fehlt, erstes Bild in `text-v1.md` ist vorläufig. Von den drei Bildtext-Ideen im Gerüst hält nur „AI CLONED YOUR VOICE“. „IT'S NOT YOUR MOM“ hat ein „it“ ohne Bezug und dreht die Richtung um (gefälscht wirst du, nicht die Mutter). „3 SECONDS OF YOUR VOICE“ nennt eine Zahl, die der Faktenzettel ausdrücklich sperrt. |

**`regel_check.py`** (`cd /home/user/scenario && python3 tools/regel_check.py …/vo-v1.txt`, Exit-Code 1 wegen der Hinweise):

```
===== vo-v1.txt  (1415 Wörter ≈ 9.8 Min)
  MINUTE 1  7 Zahl-Wörter (Regel: höchstens eine Zahl): ['one', 'sixty', 'eight', 'billion', 'five', 'Four', 'One']
  ICH-SATZ?  A.I.                      (7 solche Zeilen, alle Fehlalarm)
  → 8 Hinweis(e)
```

Keine Meldung bei Bann-Liste, Fahrplan-Sätzen, Jahreszahlen, Fragezeichen in Minute 1 (eines), Clip-Anzahl (4) und Länge. Der eine echte Hinweis: Gesprochen ist es eine Statistik (acht Milliarden bei den Über-60-Jährigen in einem Jahr) plus die Zählung der Schritte. Vertretbar, mit SOLL 2 werden es 5 Zahl-Wörter.

**`clip_check.py`** ist auf `clips.json` nicht direkt anwendbar: Das Skript erwartet `in`, `out`, `url`, `transcript`; die Datei hat `start`, `ende`, `quelle_url`, `wortlaut`, und nur C1 hat Zeitmarken (Abbruch mit `KeyError: 'out'`). Ersatzlauf mit einer umgeschriebenen Kopie der vier Skript-Clips und angenommenen Längen (S1 8 s, C10 8 s, C1 10 s laut Zeitmarken, S2 10 s): 36 s von 565 bis 616 s = 5,8 bis 6,4 %, **GRÜN**. Gegenprobe S1 10 s und S2 12 s: **ROT** (22 s aus einem Quellvideo, Grenze 20 s). Vor dem Render mit echten Zeitmarken wiederholen.

**Selbstprüfung in `text-v1.md`, wo ich anders messe:** Zahlendichte (dort vier, gehört acht) · Clip-Wortlaut von C10 und S2 (dort „vermutet“, in `clips.json` steht der genauere Wortlaut) · Laufzeit (dort 9:29 bis 10:05, nach echten Sprechdaten eher 9:45 bis 10:30) · Regel-Zeile (dort sechs Abschnitte bestanden, hier vier).

---

## 4 · Payoff-Check (§6)

**4.1 Titel-Einlösung bis 1:30: bestanden.** „AI Can Now Call Your Mom as You“ wird bei 0:56–1:23 genau gespiegelt: Kalifornien, US-Senat, diesen Sommer, die Stimme der Tochter, „absolutely her voice“, fünfeinhalb Stunden. Ort, Ereignis und Zahl sind da. Die Einlösung hält auch, wenn S1 nur als Zitatkarte läuft. „Danach nicht wegdrehen“: Zwei Stellen nehmen den Titel halb zurück, 3:16 („a human usually still does the talking“) und 3:40 („the small version“). Die erste ist ehrlich und nötig, steht aber an der falschen Stelle (MUSS 1), die zweite ist unnötig (SOLL 6).

**4.2 Mitnehm-Fakt pro Akt: bestanden.** Nach dem Film weiß ich, dass …

1. … Menschen eine KI-Stimme am Ohr kaum besser erkennen als per Münzwurf, also hilft genaueres Hinhören nicht (Hook).
2. … die Stille nach dem „Hallo“ meist ein Wählcomputer ist und kein Stimmendieb; die Stimme kommt aus dem, was gepostet ist (Schritt 1).
3. … ein einziger App-Anbieter tausende KI-Personen als „echte Menschen“ laufen ließ und sein System sich merkte, wer misstrauisch wurde (Schritt 2).
4. … von den knapp acht Milliarden der Älteren dreieinhalb in Schein-Investments gingen, nicht in den Enkeltrick (Schritt 3).
5. … Ältere seltener Geld durch Betrug verlieren als Jüngere; es fehlt kein Misstrauen, sondern ein Plan (Schritt 4).
6. *(letztes Drittel)* … meine Mutter mich als Vertrauensperson eintragen kann: Ich kann nichts abheben, aber die Firma darf mich anrufen. Broker müssen danach fragen, Banken nicht.
7. *(letztes Drittel)* … Menschen in einer kleinen Studie einer KI mehr vertrauten als einem Menschen.

Punkt 2, 3 und 6 gehen über Artikel-Wissen hinaus. Punkt 4 muss anders gesagt werden (MUSS 4).

**4.3 Kenner-Test gegen die Konkurrenz: bestanden, mit einem Vorbehalt.**

| Was die Ausreißer schon erzählen | Was #65 daraus macht | Neu für den Kenner? |
|---|---|---|
| Wenige Sekunden Stimme reichen (Holy Schmidt: „3 Sekunden“) | „a short recording … almost no money“, bewusst ohne die drei Sekunden | nein, aber sauberer |
| Die Stille nach dem Hallo nimmt deine Stimme auf (Hayes, Infographics) | meist ein Wählcomputer; kein belegter Fall, dass ein Hallo reicht | **ja**, korrigiert die „dunklere Version“ der Konkurrenz |
| Codewort, auflegen, zurückrufen (alle) | als bekannter Rat markiert, nicht als Enthüllung | nein, und richtig behandelt |
| „Move your trust off the voice and onto the process, because the process is the one thing they can't clone“ (Hayes; ähnlich Varley) | Kernsatz und große Antwort | **nein.** Die These ist dieselbe, bis in den Satzbau („trust has to move … from … to …“). Neu ist nur die Begründung (Küchentisch). |
| Die Betrüger sind selbst Maschinen (Kitboga) | Fabrik mit tausenden KI-Personen, drei von vier Profilen, Misstrauens-Vermerk | **ja**, stärkster neuer Beleg; in v1 durch 28 s Fußnoten entwertet |
| Deepfake-Promi und Geldanlage (RTBF, Belgien) | Anteil am Gesamtschaden, Fall Kanada | teils |
| Ältere als leichte Opfer | Ältere verlieren seltener; es fehlt der Plan | **ja** |
| fehlt in allen Videos | Vertrauensperson bei Bank und Broker | **ja**, das Alleinstellungsmerkmal |
| fehlt in allen Videos | KI gewinnt mehr Vertrauen als ein Mensch; Superintelligenz kommt als Anruf | **ja** |

Ein Kenner lernt fünf neue Dinge. Vorbehalt: Die große Antwort (8:08–8:52) verkauft die bekannte These als Schlusspunkt. Sie sollte die neue Begründung verkaufen und die These nur noch festhalten (MUSS 2). Zuschreibung ist in Ordnung: Der „action plan“ wird der FTC zugeschrieben, das Codewort dem FBI.

**4.4 Zweifel dosieren, dann urteilen: nicht bestanden.** Schritt 2: vier Einwände in 28 s, das Urteil („a factory of patient, invented people“) geht dazwischen unter, zwei Einwände folgen noch danach. Schritt 5: „Banks don't have to“, „That's a lobby speaking“, „They can fail“, und dazu zwei Wirkungsbehauptungen, die dem widersprechen. Schritt 3 („Not all of that is A.I.“) und die große Antwort („If that holds up“) sind richtig dosiert.

**4.5 Jeder Rat sagt, wovor er schützt: bestanden, 5 von 5.** Codewort: „the panicked call in a voice she loves“ · Frage: „the caller who seems to know everything“ · Hausregel: „the fake investment“ · Stopp-Regel: „deciding alone, under pressure“ · Vertrauensperson: „the moment no code word can: when she is already convinced“. Kein vager Rat.

**4.6 Staunen-Probe: knapp bestanden.** Minute 1: Münzwurf (mittel). Schritt 1: fünfeinhalb Stunden (stark). Schritt 2: „starting to suspect“ (stark). Schritt 3: das Gesicht des Premierministers (mittel, ein Satz). Schritt 4: „less often than younger people“ (mittel). Schritt 5: der eine Schritt (Gedanke statt Bild). Antwort: KI gewinnt mehr Vertrauen (stark). Das stärkste denkbare Staunen in Minute 1 liegt ungenutzt herum: Der Film über unerkennbare KI-Stimmen wird von einer KI-Stimme gesprochen (SOLL 3).

---

## 5 · Fakten gegen den Faktenzettel

Alles, was hier nicht steht, ist vom Faktenzettel gedeckt (Münzwurf, Wählcomputer, „kein belegter Fall“, Codewort-Rat des FBI, die Fabrik-Zahlen, Kanada, der falsche Agent, „less often“, der Aktionsplan der FTC, Vertrauensperson, Maryland und North Carolina, die Studie).

| Zeit (Z.) | Aussage im Film | Faktenzettel | Befund |
|---|---|---|---|
| 0:03 (2) | „a short recording of your voice, and almost no money“ | FTC-Warnung Stand 2023 (kurzer Ausschnitt) und PLOS One Stand 2025 („wenige Minuten“, „almost no money“) | gedeckt, aber aus zwei Quellen zusammengesetzt; beide [S] und älter als zwölf Monate. Stand ins Bild. |
| 0:08 (3) | „scam losses are at a record“ direkt vor den acht Milliarden | Rekord = FTC, 16 Mrd., alle Altersgruppen. Acht Milliarden = FBI, über 60. | Zwei Zählsysteme in zwei Sätzen; „record“ ist für die FBI-Zahl nicht belegt. Das Gerüst wollte nur die FBI-Zahl. → SOLL 2 |
| 0:42 (8) | „Four of them, a machine can now fake.“ | Modell des Films | Stimme und Gesicht belegt. „Geschichte“ nur für Chat belegt. „Uhr“: kein Beleg, dass eine Maschine sie fälscht; der falsche Agent ist ein Mensch. Als Modell vertretbar. → SOLL 9 bindet die Uhr ehrlich an die Stimme |
| 1:14 (13) | „five and a half hours“ | 5½ Stunden [S] | gedeckt. [N] `recherche.md` 2.6: Berichte nennen 5 oder 5½. Im Faktencheck klären; hält beides aus: „for at least five hours“. |
| 3:00 (26) | „a factory of patient, invented people“ | „Betrug als Fabrik“ | „patient“ ist Ausschmückung. Entfällt mit MUSS 1. |
| 3:16 (27) | „with a machine lending the voice“ | „am Telefon sprechen meist noch Menschen, mit KI-Hilfe“ | enger als der Zettel. Vertretbar, weil der Film vom Stimmklon handelt. |
| 3:40 (29) | „the panicked call is the small version“ | keine Schadenszahl zum Panik-Anruf | Rangfolge nicht belegt. → SOLL 6 |
| 3:49 (32) | „investments that never existed“ | „Investmentbetrug“ | Ausschmückung. → MUSS 4 |
| 3:57 (33) | „Not all of that is A.I.“ | KI-Anteil misst niemand; die KI-Zeile des FBI hat 893 Mio. $ über alle Kategorien und Altersgruppen | Klingt nach „das meiste ist KI“. Zugespitzt. → MUSS 4 |
| 4:12 (34) | „the most expensive forgery is not your voice. It's a face she already trusts“ | 3,5 Mrd. $ Investmentbetrug; Einzelfälle mit Deepfake-Gesicht | **Nicht gedeckt.** Wie viel Investmentbetrug ein gefälschtes Gesicht nutzt, steht nirgends. Auch die Rangfolge der FBI-Kategorien ist noch [S]. → MUSS 4 |
| 5:02 (41) | „An FBI agent in Chicago“ | Einordnungssatz so vorgeschlagen | [N] `clips.json`: Ob Agent Zach Overby oder der Host spricht, ist ungeprüft. → MUSS 3 |
| 5:06 (42) | Clip „If someone tries to isolate …“ | nur das Satzende | [N] `clips.json`, `recherche.md` 5.2: „if a would-be agent tries to isolate and burden you …“ → MUSS 3 |
| 5:44 (44) | „Six cases in a hundred carry seventy percent of the money.“ | 6 % der Fälle über 100.000 $ sind 70 % des Geldes, bei Älteren | gedeckt, aber so verkürzt, dass es nach „6 % aller Fälle“ klingt. → MUSS 5 |
| 6:44 (53) | „on the way out, they pass real people, and real rules“ | Banken müssen nicht fragen; Anhalten erlaubt in zwei Bundesstaaten | Als allgemeine Tatsache nicht gedeckt (Online-Überweisung, Bargeld, Krypto). → MUSS 6 |
| 7:08 (55) | „So she has to offer it“ | Regel: bei Bank, Depot und Rentenkonto eintragen | setzt voraus, dass jede Bank das Feld hat. → „bring it up herself“ (MUSS 6) |
| 7:26 (57–58) | Benda „told the same Senate hearing“: „When a customer appears frightened, secretive or coached, human judgment …“ | zwei Satzteile [S] | [N] `clips.json`: Wortlaut aus der schriftlichen Aussage, der Satz beginnt „In these moments, …“; ob er ihn mündlich sagt, ist offen. Der Satz im Skript ist aus zwei Stellen zusammengesetzt und so nicht zitierbar. → MUSS 3 |
| 8:00 (61), 8:30 (65) | „can be stopped by a name on a form“ · „That is why it works.“ | „Kein Beleg misst, wie gut das wirkt → als Rat, nicht als Garantie“ | Wirkungsbehauptung, 11 und 41 s nach „They can fail.“ → MUSS 2, 6 |
| 8:30 (65) | „A machine can only copy what it has seen or heard.“ | Folgerung des Films | Als Satz über KI zu breit und im Widerspruch zu Z. 68 („better than people at a very human skill“). → MUSS 2 |

**Zeilen, die neu gesprochen werden müssten, wenn ein [S]-Beleg platzt** (darum vor der Stimme prüfen): Z. 3 (acht Milliarden, Rekord) · Z. 6 (54 %) · Z. 13 (fünfeinhalb Stunden, Entführung) · Z. 32–33 (3,5 Mrd., Kanada, „video“) · Z. 43 (falscher Agent, FBI Chicago) · Z. 44 (seltener, 6 % und 70 %) · Z. 54–56 (Vertrauensperson, Broker und Banken, Maryland und North Carolina) · Z. 67 (Studie, eine Woche, 46 gegen 18) · alle Clips außer C1. [P] und damit sicher: Z. 24–25 (Fabrik), Z. 47 (Aktionsplan), C1.

**Kleines Echo zu #49 v4:** Dort heißt es in Z. 27 ebenfalls „more than twice as often“, ebenfalls über die Studie einer KI-Firma. Wer beide Filme hintereinander sieht, hört es zweimal. In #65 geht auch: „and said yes to its request far more often“ (46 gegen 18 im Bild).

---

## 6 · MUSS (6) und SOLL (10)

### MUSS

**MUSS 1 · Schritt 2: 28 Sekunden Fußnoten nach dem Staunen (Z. 22–27, 2:27–3:28).** Vier Einschränkungen hintereinander relativieren den besten Beleg weg (§6.4, §3.5), zwei davon sind Quellen-Sätze im Bericht-Ton (§1.2). Lösung: Die ehrliche Einordnung kommt vor den Beleg, das Staunen steht am Ende. „Never been measured“ fällt einmal, in Schritt 3 (MUSS 4). Ersatz für Z. 22–27, Z. 28 bleibt:

```
[calm, conversational] That is the second step: the story. Whatever a family posts can be read, and used.
And the machine no longer just supplies facts. On the phone, a person usually still does the talking, with a machine lending the voice. But in chat, the machine can already hold the whole conversation.
The clearest case comes from an A.I. company reporting misuse of its own model, so it has a stake in looking vigilant. An app maker ran a chain of dating apps, advertised as fully human. It put thousands of A.I. personas to work. Three out of four profiles were machines.
This was paid chat, not a raid on savings. But look at the machinery.
[pause] The system kept track of which users were starting to suspect.
```

**MUSS 2 · Die große Antwort fällt bei 2:06, darum ist 8:08–8:30 eine Zusammenfassung (Z. 19, 61, 63–65).** §3.1 verlangt die große Antwort im letzten Fünftel. Lösung: In Schritt 1 die drei Sätze nach der FBI-Empfehlung streichen. Das Muster bleibt hörbar („So agree on a second thing“), der Grund bleibt offen. Am Ende statt zwei Listen die neue Begründung. Z. 61 sagt nur noch, was der Maschine im Weg steht, und verspricht nicht mehr, dass sie gestoppt wird. Ersatz für Z. 19:

```
The FBI recommends it, against one thing: the panicked call in a voice she loves.
```

Ersatz für Z. 61 und Z. 63–65, Z. 66 bleibt:

```
[curious] Which is strange. The newest machine in the world, and what stands in its way is a name on a form. Why?

[thoughtful] Because a copy needs an original. A recording. A photo. A life posted online. Whatever reaches her eyes and ears can now be copied from that.
But the word you chose together was never recorded. Neither was the name she gave her bank. And the machine was never at her kitchen table.
```

**MUSS 3 · Clips: Skript und `clips.json` passen bei C10 und S2 nicht zusammen (Z. 41–43, 57–58).** C10 heißt dort „If a would-be agent tries to isolate …“ und gehört laut Slot hinter den falschen Videoanruf. Im Skript steht er davor, mit geratenem Satzanfang. S2 beginnt dort „In these moments, …“; der Satz im Skript ist aus zwei Stellen gebaut. Lösung: erst die Masche, dann der Clip, und der Sprechtext trägt den Kontext, damit beide Clips auch als Zitatkarte funktionieren. „Sign a paper“ statt „sign an agreement“, damit das Schlüsselwort des Films nicht beim Betrüger landet. Ersatz für Z. 41–43:

```
One version, as the FBI's Chicago office describes it: the bank calls. Then a so-called agent appears on video, with a flag and a seal. Then the demand: sign a paper, and don't speak to anyone.
Here is the real FBI, on the bureau's own podcast:
[CLIP C10 – FBI Chicago (speaker to be verified: Zach Overby or the host), podcast Inside the FBI · wording per clips.json, to be verified on tape: "If a would-be agent tries to isolate and burden you with an overwhelming level of urgency, they may be a scammer."]
Real agents don't reach out by video call.
```

Ersatz für Z. 57–58:

```
The banks' own lobby group told the same Senate hearing what a banker can notice: a customer who seems frightened, secretive, or coached.
[CLIP S2 – Paul Benda, American Bankers Association · wording per clips.json, to be verified on tape: "In these moments, human judgment and the relationship between banker and customer can be just as important as any algorithm."]
```

Dazu drei Regeln für heute: (a) S1, C10 und S2 am iMac am Ton prüfen, bevor die Hörfassung an Jakob geht. (b) Steht der Benda-Satz nur in der schriftlichen Aussage: Zitatkarte, und der Einordnungssatz heißt dann (+4 Wörter): `In written testimony to the same Senate hearing, the banks' own lobby group described what a banker can notice: a customer who seems frightened, secretive, or coached.` (c) Fällt C10 aus (Musik, Stelle nicht gefunden), kommt an dieselbe Stelle F2 mit geprüftem Wortlaut (anderes Video als C1, aufgenommen 2025: das Jahr ins Bild):

```
No real agency works that way. The chairman of the Federal Trade Commission, in a warning recorded last year:
[CLIP F2 – Andrew Ferguson, FTC Chairman: "No one at the FTC will ever tell you to withdraw your money and give it to someone else."]
```

Nach dem Tausch liegen zwischen C10 und C1 noch 126 Wörter (47 s bei 160 Wörtern pro Minute). Das reicht, ist aber knapp; mit SOLL 9 sind es 150.

**MUSS 4 · Schritt 3: Die Kernaussage ist nicht gedeckt (Z. 32–35).** „The most expensive forgery is … a face“ und „Not all of that is A.I.“ behaupten mehr, als der Faktenzettel hergibt. Belegt ist: Der größte Posten ist Investmentbetrug, und ein gefälschtes Gesicht ist ein Weg dorthin. Lösung: erst die Frau, dann die Zahl (§11), und die Wendung kalibriert. Ersatz für Z. 32–35:

```
In Canada, a woman in her eighties saw her prime minister in a video, recommending an investment. The video was forged. She lost about nine hundred thousand Canadian dollars.
[thoughtful] She is far from alone. Nearly half of what older Americans reported lost went to investment fraud.
How much of that involved A.I. has never been measured. But a forged famous face is now one way in.
So the most expensive lie is not your voice in tears. It is a promised return. And it can now wear a face she already trusts.
Here, the agreement is a house rule: a famous face plus a promised profit is fake until proven otherwise. And the family never invests through a link from an ad or a chat. That guards against the fake investment, where the big money goes.
```

„Nearly half“ = 3,5 von knapp 8 Mrd. $ (45 %), beide FBI. Im Faktencheck bleiben: Rangfolge der FBI-Kategorien und „video … recommending an investment“ am CP24-Bericht. Wer dem Fall mehr Gesicht geben will: [N] `recherche.md` 4.2 nennt Rentenkonto und Hypothek auf die Wohnung.

**MUSS 5 · Zahlen: acht Angaben in 84 Sekunden, eine Rechenaufgabe (§5.1).** Drei Ersetzungen, die genauen Zahlen wandern ins Bild:

- Z. 24: „In two weeks, it put more than forty-seven hundred A.I. personas to work.“ → `It put thousands of A.I. personas to work.` (steht im Block von MUSS 1; Bild: „4,700+ · 2 weeks“)
- Z. 32: „Of those eight billion dollars, three and a half … Nearly double the year before.“ → `Nearly half of what older Americans reported lost went to investment fraud.` (steht im Block von MUSS 4; Bild: „$3.5 billion · nearly double“)
- Z. 44, letzter Satz: „Six cases in a hundred carry seventy percent of the money.“ → `A small share of cases, each over a hundred thousand dollars, carries most of the money.` (Bild: „6 % · 70 %“)

Ergebnis in Schritt 2 und 3: drei harte Zahlen (three out of four, nine hundred thousand, nearly half) statt acht.

**MUSS 6 · Schritt 5: Der Höhepunkt wackelt und verspricht zu viel (Z. 53, 55, 60).** „They pass real people, and real rules“ stimmt nicht allgemein. „They can fail“ steht gegen „can be stopped“ und „That is why it works“. Lösung: einmal erklären, warum dieser Schritt nicht fälschbar ist, einmal ehrlich sein, dann urteilen. Die beiden Wirkungssätze sind mit MUSS 2 schon weg. Ersatz für Z. 53:

```
Her savings sit in a bank, or with a broker. To reach the scammer, they have to leave. A voice can be forged. A transfer has to be real. And a real transfer can pass a real person, if you put one there.
```

Ersatz für den letzten Satz von Z. 55:

```
So she has to bring it up herself, wherever her savings sit.
```

Ersatz für Z. 60:

```
[thoughtful] How often these agreements hold has never been measured. But this one covers the moment no code word can: when she is already convinced.
```

### SOLL

In Klammern steht, wie viele Wörter der Vorschlag kostet.

**SOLL 1 · Hook, Z. 8: den Fünf-Schritte-Satz fürs Ohr bauen (+4).** „A voice alone doesn't move a dollar“ ist zugleich ein erstes Teilstück der Antwort.

```
And it exists. Because a voice alone doesn't move a dollar. To reach her savings, the scam has to get through five steps. Four of them, a machine can now fake. One, it cannot.
```

**SOLL 2 · Hook, Z. 3: ein Zählsystem, zwei Zahl-Wörter weniger (−1).** Nur die FBI-Zahl, wie im Gerüst. Im Bild: „Americans 60+ · +59 %“.

```
And the losses are climbing fast. In a single year, older Americans reported losing nearly eight billion dollars to online crime.
```

**SOLL 3 · Hook, Z. 6: die Erzählstimme als Staunen-Moment (+7, Entscheidung Jakob).** `hook-v1.md` nennt das als offenen Punkt 4. Ein Satz an der teuersten Stelle (0:33) macht aus der erwartbaren Kommentar-Spitze den stärksten Moment der ersten Minute, und er stimmt. Mit Kokoro in der Hörfassung genauso wahr wie später mit Eleven.

```
Don't count on her ears. Or on yours. By ear, people spot an A.I. voice barely better than a coin toss. You are listening to one right now.
```

**SOLL 4 · Schritt 1, Z. 15–18: vier Stolperstellen fürs Ohr (+17).** Den Mythos aussprechen, „duller“ ersetzen (klingt wie „dollar“), „posted“ ein Bild geben, die Frage-Form auflösen (eine Sprechstimme betont „A panicked call asks for money?“ leicht als Aussage).

```
[curious] So where does a machine get a voice? You may have heard this one: scammers stay silent for a few seconds after your hello, to record you.
Usually, that silence is something far more ordinary: a dialing computer, calling more numbers than there are scammers free to talk. No documented case shows one hello being enough for a clone.
The voice comes from what is already posted: a birthday video, a holiday clip. So hiding it comes too late.
That family in California now uses code words. You've likely heard the advice: a word that appears nowhere online. If a panicked call asks for money: ask for the word, hang up, and call back on the number you know.
```

**SOLL 5 · Schritt 1, Z. 14: Staunen-Fakt 4 sprechen statt nur als Tafel zeigen (+16).** Er steht auf dem Faktenzettel und vertieft die 54 %. „Anyone would be.“ bleibt, der Satz kommt dahinter.

```
[thoughtful] She was certain. Anyone would be. In a recent study, people who felt sure about a voice were right no more often.
```

Dazu ein Detail, das der Geschichte ihr Ende gibt und die Regel „zurückrufen“ vorbereitet, aber [N] ist (`recherche.md` 2.6, erst in den Faktenzettel): `It ended when she finally reached her real daughter.`

**SOLL 6 · Übergang zu Schritt 3, Z. 29: den Titel nicht kleinreden, den Sprung ansagen (+8).** „Often start on a screen“ ist gedeckt (FTC: oft über soziale Medien).

```
[curious] And still, the panicked call is not where the biggest losses are. Those often start on a screen. And they take a third step.
```

**SOLL 7 · Schritt 2, Z. 22 und 28: konkret statt abstrakt (+10).** Drei Beispielwörter für das, was mitgelesen wird, und eine Beispielfrage, damit Regel 2 sich vom Codewort unterscheidet.

```
[calm, conversational] That is the second step: the story. Whatever a family posts can be read, and used. Names. Trips. Grandchildren.
```

```
So agree on a second thing. Knowing things proves nothing. A panicked caller gets one question, whose answer was never online. What was on the table last Sunday? That guards against the caller who seems to know everything.
```

**SOLL 8 · Abo-Aufruf 1: eine offene Frage über den Aufruf tragen (+9).** Zwischen 3:45 und 5:34 gibt es sonst rund 110 s keine neue Frage. Das ist der einzige SOLL-Punkt, an dem eine Regel hängt (§3.3), also der erste, der übernommen werden sollte. Weicht leicht vom Wortlaut §3.8 ab („direkt nach einer Auflösung“): Auflösung, ein Satz, dann der Aufruf. Jakob entscheidet. Neuer Satz nach Z. 35, Z. 37 bleibt, Z. 39 neu:

```
[curious] A voice, a story, a face. And still, all three could fail for one simple reason: she might call you.
```

```
[calm, conversational] So the scam must not give her the time. The fourth step is a clock.
```

**SOLL 9 · Schritt 4: die Uhr an die KI und an Kalifornien zurückbinden (+38).** 121 Sekunden ohne KI-Wort sind auf diesem Kanal zu lang. Ein Satz sagt ehrlich, was neu ist. Ein zweiter holt die eine echte Person des Films zurück und erklärt die fünfeinhalb Stunden (Folgerung des Films, kein Messwert). Anhängen an Z. 39 und an Z. 43:

```
The trick is old. The voice that sets it is new: one she loves.
```

```
And think of those long hours on the phone in California: as long as she talked to them, she could not call her daughter.
```

**SOLL 10 · Schritt 5: sagen, wer die Lücke schließen muss, und die Zuschauer außerhalb der USA mitnehmen (+24).** §11 will bei jeder hoffnungsvollen Stelle hören, wer die Macht hat. Anhängen an Z. 56 und an Z. 59:

```
Closing the rest of that gap is a job for banks and lawmakers, not for her.
```

```
Wherever she lives, that question is the same.
```

### Messung der Ersatztexte (Kopie außerhalb des Projekts)

| Fassung | Wörter | `regel_check.py` | C10 → C1 | C1 → S2 |
|---|---|---|---|---|
| v1 | 1.415 | 1 echter Hinweis (7 Zahl-Wörter Minute 1), 7 Fehlalarme | 161 Wörter | 155 Wörter |
| MUSS 1–6 | 1.386 | 1 echter Hinweis (unverändert), 6 Fehlalarme | 126 Wörter (47 s bei 160 W/min) | 183 Wörter |
| MUSS + SOLL 1, 2, 6, 8, 9 | 1.444 | 1 echter Hinweis (5 Zahl-Wörter), 6 Fehlalarme | 150 Wörter (56 s) | 183 Wörter |
| MUSS + alle SOLL außer 3 | 1.511 | wie oben | 150 Wörter | 199 Wörter |

In allen Fassungen: Bann-Liste 0, „subscribe“ 2×, keine Ich-Sätze, längster Satz 24 Wörter. Die letzte Fassung liegt elf Wörter über dem Richtwert von 1.500. Wer alles übernimmt, streicht dafür die Kürzungsreserve aus `text-v1.md` oder lässt SOLL 5 weg (dann 1.495). Meine Empfehlung ist die dritte Zeile.
