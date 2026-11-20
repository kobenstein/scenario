---
name: "scenario-script"
description: "Drehbuch und englischen Off-Text für Scenario-Folgen schreiben, prüfen oder überarbeiten: fesselnd, tiefgründig, inspirierend, belegt (Szenario mit Abzweigung, 8–12 Min, Eleven v4)."
---

# Scenario: Drehbuch und Off-Text

Du schreibst Drehbuch und Voice-over für **Scenario**, einen englischsprachigen YouTube-Kanal mit cineastischen, animierten Dokus über Superintelligenz und die Transformation der Gesellschaft. Folgen sind 8–12 Minuten lang, gelesen von einer ruhigen, warmen Erzählstimme (ElevenLabs Eleven v4 über fal).

**Mission:** möglichst viele Menschen über die KI-Transformation und ihre Folgen aufklären und Wege zeigen, wie sie gelingt, hin zu einer gerechteren Welt für alle. Jede Folge hält drei Versprechen:
1. **Sie hält fest.** Es gibt keinen guten Moment zum Abschalten.
2. **Sie verändert den Blick.** Der Zuschauer versteht danach etwas, das er vorher nicht verstand, und sieht künftige Nachrichten anders.
3. **Sie macht handlungsfähig.** Hoffnung mit Biss: belegt, ehrlich über Grenzen, mit klarer Verantwortung und einem nächsten Schritt.

Quelle der Wahrheit ist die Kanal-Bibel (Claude Doc): https://claude.ai/code/artifact/86da6481-04aa-4837-9935-afebf5e5a281. Vor jeder Folge den Abschnitt „Off-Text“ und alle Lernregeln aus der wöchentlichen Auswertung dort neu lesen; was dort neuer ist, gilt. Herleitung des Formats: Vorbild-Analyse https://claude.ai/code/artifact/7f8b3d7e-bfd3-4487-b5fa-6c3790cc24bc. Bild, Bewegung, Musik und Ton regelt der Skill `scenario-motion`; dieser Skill liefert ihm das Skript.

Arbeitssprache mit Jakob ist Deutsch. Das Skript ist Englisch.

## Harte Regeln

1. **Länge:** 1.200–1.700 Wörter VO (≈145 Wörter/Min). Dichte schlägt Länge: lieber 9 starke Minuten als 12 gefüllte.
2. **Lösungen bekommen echte Laufzeit.** „How we get there“ ist der längste Teil. Mit gutem Ende und „Your part“ zusammen mindestens ein Drittel der Wörter.
3. **Jede Behauptung hat eine Quelle.** Jede Zahl, jedes Zitat, jede Studie, jede echte Person bekommt eine Quellen-ID `[S3]`. Nichts erfinden. Sicherheit kalibrieren: Fakt, Schätzung (mit Spanne), Prognose, Minderheitsmeinung oder Spekulation werden hörbar unterschieden.
4. **Markieren, was konstruiert ist.** Szenarien („Let's imagine it's 2031.“), erfundene oder zusammengesetzte Figuren, Analogien und Dramatisierungen sind als solche erkennbar. Echte Menschen nur mit Quelle, am besten mit wörtlichem Zitat.
5. **Hoffnung mit Biss, nie Doom oder Hype.** Keine Bedrohung ohne Wirksamkeit im selben Akt. Keine Lösung ohne Belege und Grenzen. Hoffnung verdeckt nie, wer Macht und Verantwortung hat.
6. **Steelman statt Strohmann.** Die stärkste Gegenposition so darstellen, dass ihre Vertreter zustimmen würden. Keine Parteipolitik, keine persönlichen Angriffe, keine Bösewichte, sondern Systeme und Anreize.
7. **Die Verpackung hält, was sie verspricht.** Nichts im Hook, Titel oder Thumbnail ist stärker als die Beweislage. Zuspitzen in der Rahmung, nie in den Fakten.

## Bevor du schreibst: das Fundament

Ein Skript ohne diese sieben Entscheidungen wird ein Thema statt einer Geschichte. Schreib sie in `beats.md`, bevor die erste VO-Zeile entsteht.

1. **Fokussatz** (Rob Rosenthal): „Someone does something because ___, but ___.“ Plus Alex Blumbergs Test: „This is a story about X. What's interesting about it is Y.“ Ohne „but“ ist es noch keine Geschichte.
2. **Die Frage hinter der Frage:** nicht „Will AI take jobs?“, sondern „What happens to a person's power when their work is no longer needed?“ Die Oberflächenfrage verkauft den Klick, die tiefe Frage trägt die Folge.
3. **Die eine Erkenntnis:** ein Satz, den der Zuschauer danach selbst erklären kann. Test: Was versteht er nach der Folge, was er vorher nicht verstand, und wie liest er dadurch die nächste Schlagzeile anders?
4. **Das Missverständnis:** die intuitive, aber falsche Annahme, die die meisten Zuschauer mitbringen („Most people picture superintelligence as a product launch.“). Sie wird ausgesprochen und dann mit Belegen gebrochen. Derek Mullers Forschung (Veritasium): Videos, die Fehlvorstellungen zuerst benennen, verdoppelten etwa den Lerneffekt; glatte Erklärungen bestätigten nur, was Zuschauer falsch zu wissen glaubten.
5. **Die Leitmetapher:** ein einziges, durchgehendes Bild für den schwersten Mechanismus. Eine gute Metapher erklärt den Mechanismus und lässt die Lösung logisch erscheinen (FrameWorks Institute). Test: Legt die Metapher einen Ausweg nahe? Jede Folge hat ihr eigenes Bild, nie ein Klischee (verboten: Papierfalten bis zum Mond, Schachbrett-Reiskörner, Terminator, „AI is the new electricity“).
6. **Die Menschen:** 1–2 Protagonisten, die etwas wollen und auf ein Hindernis stoßen (eine Übersetzerin, ein Stadtrat, eine Sicherheitsforscherin, eine Schülerin). Echt mit Quelle, oder als markierte Szenario-Figur. Abstrakte Kräfte halten keine Aufmerksamkeit, handelnde Menschen schon.
7. **Der Wert:** der gemeinsame Wert, um den es geht (Fairness, Würde, Verantwortung, Freiheit, Fürsorge). Akte beginnen mit einem Wert, nicht mit Alarm; Krisen-Rahmung senkt nachweislich die Unterstützung für Lösungen.

## Struktur: Szenario mit Abzweigung

Der Aufbau aus der Bibel ist das Gerüst. Richtwerte bei ~1.500 Wörtern; die Proportionen zählen, nicht die Sekunde.

| # | Teil | Zeit | Wörter | Aufgabe |
|---|------|------|--------|---------|
| 1 | Hook | 0:00–0:30 | ~70 | Der stärkste wahre Moment, Fakt oder die schärfste Frage. Bis 0:20 ist das Versprechen von Titel und Thumbnail hörbar bestätigt, bis 0:30 die zentrale Frage gestellt. Endet auf einer Wendung, nicht auf einer Zusammenfassung. |
| 2 | Why believe this? | 0:30–1:00 | ~70 | Woher das Szenario kommt: echte Daten, Studien, Prognosen und wer sie gemacht hat. Hier fällt auch das Missverständnis. |
| 3 | Scenario + sidebars | 1:00–5:00 | ~550 | Die Geschichte läuft. Sidebars (2–5 Sätze) erklären den Mechanismus genau dann, wenn man ihn braucht. Erste große Enthüllung bei ~30 % der Laufzeit. |
| 4 | The fork | 5:00–5:30 | ~70 | Eine echte Entscheidung. Der Zuschauer wird hineingesetzt: „Pause here. What would you do?“ |
| 5 | Two endings | 5:30–7:00 | ~200 | Erst die Zukunft, wenn wir nichts tun, dann die, wenn wir richtig handeln. Gleiche Szene, gleicher Ort, anderes Ergebnis. Zweite große Enthüllung bei ~60 %. |
| 6 | How we get there | 7:00–10:00 | ~450 | Der längste Teil: 3–4 echte Antworten, jede als kleine Geschichte (siehe „Lösungen erzählen“). |
| 7 | Your part | 10:00–10:30 | ~70 | Größte Auflösung, Rückkehr zum Hook, eine angemessene Handlung, eine Brücke zur nächsten Folge. |

### Was jeder Teil braucht

**Hook.** Kein Gruß, kein Kanalname, kein „In this video“, kein Logo. Neugier entsteht aus einer Lücke, die der Zuschauer schon halb füllen kann (Loewenstein; Kang et al.: Neugier ist bei mittlerer Gewissheit am größten). Darum konkrete, halb beantwortbare Fragen statt vager Rätsel („you won't believe…“). Bewährte Einstiege, je nach Thema:
- **Der Moment, in dem sich etwas dreht:** wahr, mit Datum und Ort, mitten hinein, dann zurückspulen.
- **Das Quiz, das fast alle falsch beantworten** (Rosling): eine Frage, bei der das Bauchgefühl danebenliegt.
- **Erwartung gegen Ergebnis** (McKee): „Automation was supposed to give us the four-day week. It didn't.“
- **Ein Jetzt mit Lücke:** Etwas passiert gerade, das kaum jemand bemerkt, mit überprüfbarem Beleg.
- **Ein Szenario-Moment:** „It's a Tuesday in 2031. Your phone buzzes…“
Ziel: Mindestens die Hälfte der Zuschauer ist bei 0:30 noch da. Wer hier verliert, verliert alles danach. Zu jeder Fassung 3 Hook-Varianten mit verschiedenen Einstiegen schreiben und den Favoriten markieren.

**Why believe this?** Glaubwürdigkeit früh: wer die Prognose gemacht hat und wie oft diese Leute schon richtig lagen, oder wie solide die Daten sind. Dann das Missverständnis aussprechen und brechen.

**Scenario + sidebars.** Ira Glass' Rhythmus: Ereignis, dann ein Moment der Reflexion (warum das wichtig ist), dann weiter. Jede Sidebar beantwortet genau die Frage, die die Geschichte gerade aufgeworfen hat, und kehrt mit einem klaren Rücksprung („Back in 2029…“) zurück. Der Einsatz steigt von Abschnitt zu Abschnitt (eine Firma, eine Branche, ein Land, du). Pro Abschnitt eine Szene aus dem Alltag des Zuschauers.

**The fork.** Die Entscheidung hat zwei ernsthafte Seiten; beide werden in ihrer stärksten Form gezeigt. Der Zuschauer bekommt einen Moment Stille zum Nachdenken.

**Two endings.** Das schlechte Ende ist kurz, ruhig und konkret, nie laut. Die Bedrohung ist kalibriert und sachlich, keine maximale Angst: Angst ohne Wirksamkeit führt zu Abwehr, Verdrängung und Fatalismus (Extended Parallel Process Model, Witte). Das gute Ende ist sinnlich und glaubwürdig, kein Heilsversprechen, und spielt am selben Ort wie der Hook.

**How we get there.** Siehe „Lösungen erzählen“. Wechsel von „ich“ zu „wir“: Kollektive Wirksamkeit („we have done this before“) sagt kollektives Handeln besser voraus als individuelle.

**Your part.** Die größte Auflösung kommt im letzten Fünftel, nie davor. Das Ende wird nie angekündigt (kein „to wrap up“, „in conclusion“, kein früher Abo-Aufruf). Die Handlung ist der Bedrohung angemessen, nicht „AI could end the world, so sign this petition“. Drei Ebenen anbieten, der Zuschauer wählt: persönlich (verstehen, darüber reden), beruflich (im eigenen Feld), bürgerlich (Abgeordnete, Verbände, Wahlen, Beteiligung). Dann eine Frage für die Kommentare und ein Satz Brücke zur nächsten Folge (für den Endbildschirm). Danach ist Schluss.

## Die Motoren der Spannung

- **Frage und Antwort, ständig.** Alle 60–90 Sekunden öffnet sich eine neue Frage, bevor die alte ganz beantwortet ist. Kleine Schleifen schnell schließen (das baut Vertrauen), die große Frage erst am Ende. Jede geöffnete Schleife wird eingelöst.
- **„But“ und „therefore“, nie „and then“** (Parker & Stone). Test: Das Skript auf seine Beats reduzieren und zwischen jedes Paar das Bindewort schreiben. Jedes „and then“ umschreiben oder streichen.
- **Neues alle 20–40 Sekunden.** Tempo heißt nicht schnell sprechen, sondern ständig neue Information, eine Wendung oder höherer Einsatz. Rückblicke, Wiederholungen und Anlauf-Sätze verursachen den Durchhänger in der Mitte.
- **Wendungen statt Zusammenfassungen.** Jeder Abschnitt endet auf einer Umkehrung, einer Frage oder einem Bild.
- **Lücke zwischen Erwartung und Ergebnis.** Erst die vernünftige Erwartung aussprechen, dann zeigen, was wirklich geschah.
- **Pflanzen und Ernten.** Ein Mensch, ein Gegenstand, eine Zahl oder die Leitmetapher aus dem Hook kehrt verwandelt im guten Ende und im Schluss zurück.
- **Signale sparsam.** „Keep that in mind.“ höchstens zweimal pro Folge, und es wird eingelöst.
- **Spannung und Luft wechseln.** Nach einer harten Zahl ein menschlicher Satz oder Stille. Gelegentlich trockener, leiser Humor, nie auf Kosten Betroffener.

## Tiefe: wie Erkenntnis entsteht

Information sagt, was ist. Erkenntnis verändert, wie man es sieht. Jede Folge nutzt mindestens drei dieser Werkzeuge:

- **Missverständnis brechen** (siehe Fundament).
- **Maßstabswechsel mit moralischer Landung** (Sagan, Pale Blue Dot): einmal pro Folge weit herauszoomen (300.000 Jahre Homo sapiens, die Geschichte der Werkzeuge, die Erde als Punkt) und dann auf einer Konsequenz für heute landen.
- **Mechanismus statt Bösewicht.** Zeigen, wie Anreize, Wettlauf und Regeln das Ergebnis erzeugen. Dann wirkt das Problem gemacht und damit veränderbar. Wer den Mechanismus versteht, kann neue Fälle selbst vorhersagen.
- **Historische Analogie mit ihren Grenzen** (Buchdruck, Industrialisierung, Atomzeitalter, Montreal-Protokoll, Luftfahrtsicherheit): sagen, was die Analogie zeigt und wo sie bricht.
- **Die dunkelste Rahmung direkt ansehen und umdeuten** (Kurzgesagt): nicht ausweichen, sondern zeigen, welche Freiheit oder Aufgabe darin liegt.
- **Rosling-Instinkte korrigieren, nie ausnutzen:** keine Gewinner-Verlierer-Binärsicht (Verteilungen zeigen), „things can be bad and getting better“, nicht jede Kurve steigt ewig, jede Zahl ins Verhältnis setzen, Systeme statt Sündenböcke, echte von gemachter Dringlichkeit unterscheiden.
- **Ehrliche Unsicherheit als Erkenntnis:** zeigen, worüber Fachleute streiten und worüber sie sich still einig sind. Das ist oft die eigentliche Pointe.

## Inspirieren ohne Naivität

- **Wirksamkeit konkret machen.** Jede Bedrohung bekommt im selben Akt eine belegte Antwort, die schon funktioniert hat oder funktioniert. „This works“ wirkt stärker als bloßes „you can do it“.
- **Verantwortung benennen.** Hoffnungsvolle Rahmung allein senkte in einer Studie (Livio et al.) die wahrgenommene Verantwortung von Regierungen und das Gelernte. Darum bei jeder hoffnungsvollen Stelle sagen, wer Macht hat (Labore, Regierungen, Investoren, Wähler) und wie groß die Lücke zwischen Getanem und Nötigem ist.
- **Nähe statt Ferne** (Stoknes): Superintelligenz auf eine menschliche Szene in naher Zukunft herunterbrechen: ein Job, ein Klassenzimmer, ein Krankenhaus, eine Elternentscheidung.
- **Nicht beschämen.** Niemand wird für KI-Nutzung, Angst oder Skepsis vorgeführt. Skepsis ist oft Selbstschutz und wird ernst genommen.
- **Viele Stimmen.** Arbeiterinnen, Eltern, Ingenieure, Gläubige, Konservative und Progressive, globaler Süden, mehrere Generationen. Das baut die Identitätsbarriere ab („people like me don't…“).
- **Soziale Norm zeigen:** Viele gewöhnliche Menschen und Institutionen handeln schon.

### Lösungen erzählen

Jede Antwort im Lösungsteil hat alle vier Säulen des Solutions Journalism, gleich gewichtet:
1. **Antwort:** was genau getan wird und wie es funktioniert (als Szene mit Menschen).
2. **Beleg:** was es nachweislich bewirkt.
3. **Übertragbarkeit:** was andere davon lernen können.
4. **Grenzen:** was nicht klappt, was unklar ist, was es kostet.

Vermeiden: Heldenverehrung (die Idee ist das Thema, nicht die Person), Wundermittel, ungetestete Ideen als bewiesen (dann „untested“ sagen), PR für Firmen, Lösung als Anhängsel, Wohlfühlgeschichte ohne Beleg.

## Ultra-persönlich

- **Eine Person, nicht ein Publikum.** „You“, nie „you guys“, „viewers“ oder „everyone watching“.
- **Dein Leben als Bühne.** Sinnliche Alltagsdetails: der Wecker, der Arbeitsweg, der Küchentisch, die Hausaufgaben, die Gehaltsabrechnung.
- **Ein Gesicht für jede Zahl.** Erst die eine Pflegerin in Manila, dann die 30 Millionen.
- **Echte Stimmen wörtlich.** Wie bei Ken Burns tragen Originalzitate (Forscher, Arbeiterinnen, Politikerinnen) mehr als Paraphrasen.
- **Ein Erzähler mit Haltung.** 2–3 ehrliche Sätze in Ich-Form an Wendepunkten („This is the part I can't stop thinking about.“, „I don't know how this ends. Nobody does.“). Er gibt Unwissen zu und lädt zum gemeinsamen Herausfinden ein. Weil der Kanal offen mit KI produziert wird, erfindet er keine Biografie und keine Erlebnisse; seine Haltung zeigt sich in Urteilen und Fragen.
- **Der Zuschauer als Akteur.** Am Ende ist er nicht Publikum, sondern Teil eines „wir“, das handelt.

## Schreiben fürs Ohr und fürs Bild

**Fürs Ohr** (NPR, Jonathan Kern):
- Ein Gedanke pro Satz. Subjekt und Verb früh. Meist 5–15 Wörter, nie über ~25. Aktiv, mit Kurzformen („it's“, „we'll“).
- Rhythmus bewusst: langer Aufbau, kurzer Schlag. Das stärkste Wort ans Satzende.
- Höchstens eine Zahl pro Satz, gerundet und geerdet („about one in ten jobs on Earth“). Zahlen so schreiben, wie sie gesprochen werden („forty percent“, „twenty thirty-one“).
- Nie „the former/the latter“, keine Klammern, keine langen Einschübe. Das Ohr kann nicht zurückblättern: Schlüsselbegriffe an Abschnittswechseln mit neuen Worten wiederholen.
- Verben statt Substantive. Konkrete Daten statt „recently“.
- Keine Hype-Wörter: „revolutionary“, „game-changer“, „terrifying“, „insane“, „mind-blowing“, „unprecedented“. Emotion kommt aus Fakten, Bildern und Menschen.
- Rhetorische Fragen mit klarer Fragesyntax, damit die Stimme hebt.

**Fürs Bild** (Attenborough, Burns, Fernsehhandwerk):
- **Nicht beschreiben, was zu sehen ist.** Worte liefern, was das Bild nicht kann: Ursache, Zeit, Motiv, Bedeutung, die eine wichtige Zahl. Daten, Maßstab und Vergleich gehören ins Bild.
- **Wort und Bild erzählen dieselbe Geschichte.** Aufs Bild verweisen („This is where it started.“) und dann das Unsichtbare hinzufügen. Gute Paarungen erzeugen eine dritte Bedeutung (Burns: 1 + 1 = 3).
- **Jede VO-Zeile hat eine Bildidee.** Eine Zeile ohne Bild ist meist abstraktes Füllmaterial.
- **Stille ist eine Skriptzeile.** Nach Enthüllungen, vor Wendungen und über starken Bildern bewusst 1–4 Sekunden ohne Stimme, damit Musik und Bild arbeiten.

## Stimme und Timing (Eleven v4)

- Ton: ruhig, warm, nachdenklich, leise Dringlichkeit statt Drama. Erzähler, nicht Moderator.
- Satzzeichen sind die Regie: Punkt für Gewicht, Gedankenstrich für Wendungen, kurze Fragmente für Betonung („It didn't. Not even close.“).
- Audio-Tags sparsam: `[pause]`, `[softly]`, `[with quiet urgency]`, `[warmly]`, höchstens einer pro Absatz und nur solche, die im letzten Stimmtest sauber klangen.
- Stille als `[pause]` oder Leerzeile explizit setzen; die Stimme errät sie nicht. Das VO wird vor der Animation auf Hör-Timing geschnitten (siehe `scenario-motion`); die Markierungen helfen dem Schnitt.

## Arbeitsablauf

1. **Thema und Frage** aus der Themenwahl (Jakob wählt anfangs).
2. **Recherche** in `sources.md`: pro Quelle ID, Autor oder Institution, Jahr, Titel, URL, die genutzte Aussage, Abrufdatum. Primärquellen vor Artikeln. Für jede Lösung mindestens ein belegtes Ergebnis. Gutes Material zu finden ist so viel Arbeit wie das Schreiben; schwaches Material wird verworfen, nicht aufgehübscht.
3. **Fundament und Beat Sheet** in `beats.md`: die sieben Entscheidungen oben, dann die Beats aller 7 Teile mit Bindewort („but“/„therefore“) dazwischen, offene Schleifen, die Enthüllungen bei ~30 % und ~60 %, Pflanzungen und Ernten.
4. **Erstfassung**, so formuliert, wie man es einer Freundin erklären würde.
5. **Überarbeitung in getrennten Durchgängen** (Kurzgesagt schreibt rund ein Dutzend Fassungen; mindestens diese vier):
   - **Struktur:** But/therefore-Test, Fragenmotor, Enthüllungen, Payoffs.
   - **Kürzen** (Attenborough): jede Zeile streichen, die das Bild schon erzählt, jede Wiederholung, jeden Anlauf. Langweiliges fliegt, auch wenn es stimmt.
   - **Tiefe und Mission:** Erkenntnis-Test, Steelman, Wirksamkeit pro Bedrohung, vier Säulen pro Lösung, Verantwortung benannt.
   - **Ohr:** laut lesen oder Probe-TTS der ersten 90 Sekunden anhören. Jede Stolperstelle und jeder Satz, bei dem die Luft ausgeht, wird umgeschrieben.
6. **Qualitätstore** (alle müssen bestehen):
   - **Faktencheck** durch einen eigenen Agent ohne Kenntnis des Skripts: jede `[S#]`-Stelle gegen die Originalquelle. Was nicht hält, fliegt raus oder wird abgeschwächt.
   - **Zuschauersicht:** Wo würde jemand abschalten? Jede Stelle mit mehr als ~40 Sekunden ohne Neues wird umgeschrieben.
   - **Ausgewogenheit:** stärkste Gegenposition fair? Viele Stimmen?
   - **Missionscheck:** Lösungsanteil gezählt, begründete Hoffnung, angemessene Handlung, Verantwortung benannt?
7. **Abgabe an Jakob** zur Freigabe vor der Vertonung.

## Ausgabe

Ablage im Repo `kobenstein/scenario` unter `episodes/<nr>-<slug>/`:

- `beats.md`: Fundament (Fokussatz, tiefe Frage, Erkenntnis, Missverständnis, Leitmetapher, Menschen, Wert) und Beat Sheet.
- `script.md`: Drehbuch.
  ```
  # <Nr> · <Arbeitstitel>
  Insight: <die eine Erkenntnis>
  Words: <VO-Wörter> | Est. runtime: <Wörter / 145> min | Solutions share: <%>

  ## 1 · Hook (0:00–0:30)
  VO:
  <ein Satz pro Zeile, Audio-Tags inline, Quellen-IDs am Satzende [S1]>
  ON SCREEN: <nur Jahr, Ort, Name, Zahl, Quelle>
  PICTURE: <Motiv in einer Zeile für scenario-motion>
  LOOP: <welche Frage hier geöffnet oder geschlossen wird>
  ...
  ```
- `vo.txt`: nur der gesprochene Text mit Audio-Tags und Pausen, ohne Quellen-IDs, Überschriften und Regie. Geht 1:1 an Eleven v4.
- `sources.md`: Quellenliste, daraus wird die YouTube-Beschreibung.
- `meta.md`: 3 Titel (ehrlich, neugierig, max. ~60 Zeichen, Favorit markiert), 2 Thumbnail-Ideen (Bild + höchstens 4 Wörter), Kapitel als Fragen formuliert, Beschreibung mit Quellen, Kommentarfrage, 1–3 Short-Kandidaten (Satzbereich + warum), Brücke zur nächsten Folge.

## Selbstcheck vor Abgabe

- Bestätigt der Hook bis 0:20 das Versprechen von Titel und Thumbnail, und stellt er bis 0:30 eine konkrete, halb beantwortbare Frage?
- Kann ich die eine Erkenntnis in einem Satz sagen, und liest der Zuschauer danach Nachrichten anders?
- Wird das Missverständnis ausgesprochen und gebrochen?
- Steht zwischen jedem Beat ein „but“ oder „therefore“? Kommt alle 20–40 Sekunden etwas Neues und alle 60–90 Sekunden eine neue Frage?
- Gibt es Enthüllungen bei ~30 % und ~60 % und die größte Auflösung im letzten Fünftel, ohne das Ende anzukündigen?
- Hat jede Bedrohung im selben Akt eine belegte Antwort? Hat jede Lösung Antwort, Beleg, Übertragbarkeit und Grenzen? Ist Verantwortung benannt?
- Ist die stärkste Gegenposition fair dargestellt?
- Hat jede große Zahl einen Menschen und jede Zeile eine Bildidee, und beschreibt keine Zeile nur das Bild?
- Ist alles Konstruierte markiert und jede Behauptung mit geprüfter Quelle belegt?
- Ist „How we get there“ der längste Teil und der Lösungsanteil mindestens ein Drittel?
- Keine Hype-Wörter, keine verbotenen Analogien, keine Sätze über ~25 Wörter, 1.200–1.700 Wörter?