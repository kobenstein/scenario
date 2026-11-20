# Befund: Welche Schreibregeln verloren gingen oder sich widersprechen (6.11.2026)

Geprüft: Projekt-Erinnerung (MEMORY.md + verlinkte Notizen), `vibe-brief.md`, `feedback-log.md`, `hook-bauplan.md`, `treffer-check.md`, `clip-schritt.md`, die drei Fassungen des Skills `scenario-script` (installiert, `-SKILL-v3.md` vom 24.10., `-SKILL-neu.md` vom 28.10.), Skill `good-takeoff-thumbnails`, Kanal-Bibel (Doc vom 17.10.), Copywriting-Check 18.10., Top-Performer-Analyse, Kanal-, Wachstums- und Retention-Analysen.

## Hauptursache

**Der Skill, den die Texter laden, ist noch der Stand vom ~20.10.** Die Skill-Updates vom 24.10. (v3: Payoff-Check, Bann-Liste, Staunen-Rechercheur) und 28.10. (neu: Hook-Bauplan, Ausstiegsstellen) wurden nur als Karten vorgeschlagen und nie gespeichert. Dazu wurde die Fassung vom 28.10. auf einer älteren Basis gebaut und hat Payoff-Check, Bann-Liste und Staunen aus v3 wieder verloren. Der installierte Skill nennt außerdem die Kanal-Bibel vom 17.10. als „Quelle der Wahrheit“, die selbst veraltet ist. Ein Agent, der „nach Skill“ schreibt, sieht also fast keine Regel der letzten zwei Wochen.

## Verlorene Regeln (stehen nirgends, was ein Texter sicher liest)

| Regel | Wo sie steht | Im installierten Skill? |
|---|---|---|
| **Staunen vor Bericht, Vision/Staunen ist die Handlung** | Vibe-Brief 19.10., Copywriting-Check 18.10., Feedback-Log 22.10., Skill-v3 | nein; auch nicht in SKILL-neu, nicht im Index der Erinnerung |
| Payoff-Check (Titel bis 1:30, Mitnehm-Fakt pro Akt, Kenner-Test, Urteil) | Erinnerung writers-room, Skill-v3 | nein; in SKILL-neu wieder verloren |
| Bann-Liste der Floskeln | Erinnerung, Skill-v3 | nein; der Skill empfiehlt sogar „This is the part I can't stop thinking about“ |
| Hook-Bauplan + Ausstiegsstellen 28.10. | hook-bauplan.md, SKILL-neu | nein |
| Retention 5.11.: Szene statt Zitat 0:10–0:30, eine Hauptfrage, Mitte mit Uhr/Rätsel, Prüfskript | Analyse + Erinnerung | nein |
| Fragen-Kette, ein Leitgedanke statt vieler Metaphern | Erinnerung writers-room | nein (Skill verlangt eine durchgehende Leitmetapher) |
| Zeitwechsel nur mit hörbarer Brücke (2037) | Feedback-Log, Film-Notiz | nein |
| Zukunft statt Vergangenheit; Menschen statt Roboterbilder; Spiritualität nur als Frage; Leitgedanke ohne Rechenbeispiel; Hook-Beispiel betrifft den Zuschauer; keine detailreichen Alltagsabläufe | nur Feedback-Log | nein |
| Eigener Kernsatz pro Film | Copywriting-Check 18.10. | nein |
| Titel: kein „could“, ≤45 Zeichen, kein Fragezeichen am Ende | Erinnerung (Thumbnails-Runden, Wachstum) | nein (Skill: bis ~60 Zeichen) |
| Thumbnail-Abwechslung, 1-Sekunden-Warum, Text ergänzt den Titel | Erinnerung | nein, Thumbnail-Skill hat Stand 24.10. |

## Widersprüche und wie REGELN.md sie auflöst

1. **Ich-Sätze:** Kanal-Bibel und Skill verlangen 2–3 persönliche Ich-Sätze; YPP-Regel 26.10. „ein Ich-Satz pro Film“; Jakob 6.11.: keine mehr. → **keine**, Urteil ohne „I“.
2. **Format:** Bibel, Skill, Erinnerung „Szenario mit Abzweigung, Lösungsteil am längsten (≥⅓)“ vs. Kanal-Analyse 2.11. „Lösungen nur als 2. Akt“ und YPP „zwei Zukünfte max jeder 3. Film“. → Lösungen als 2. Akt mit echtem Raum, Abzweigung nur noch Option. **Bitte bestätigen.**
3. **Fahrplan-Satz:** Skill-v3 „bei 0:35–0:50 erwünscht“ vs. 28.10./5.11. verboten (kostet 5–13 Punkte). → verboten.
4. **Beleg im Hook:** Hook-Bauplan 28.10. „5–20 s Clip oder Insider-Zitat“, Kanal-Bibel „0:30–1:00 woher das Szenario kommt“ vs. Retention 5.11. „0:10–0:30 kein Zitat, keine Firma, eine Szene mit dem Zuschauer“. → neuere Daten: Szene; Clip im Hook nur, wenn er das Ereignis selbst zeigt; Zitate erst nach dem ersten Gewinn.
5. **Leitmetapher:** Skill „ein durchgehendes Bild“ vs. Jakob 28.10. „Leitbild = Gedanke, kein Bildmotiv“ + 23.10. „zu viele Metaphern“. → ein Leitgedanke, höchstens eine Metapher.
6. **Skript-Ablauf:** Erinnerung writers-room „per Ultracode“ (5.11. 14:14) vs. Gesamtablauf „ohne Ultracode, 1 Texter max + 1 Kritik“ (5.11. 17:43). → ohne Ultracode.
7. **Hörfassung:** Notiz film-production-gates „mit George, Kokoro klingt robotisch“ vs. Regel 22.10. „billige Kokoro-Hörfassung“. → Kokoro.
8. **Thumbnail-Farbe:** treffer-check.md Punkt 4 „eigene Farbe, nicht wieder Nachtblau/Gold“ vs. Jakob 6.11. „Editorial-Nacht beibehalten, keine neue Farbwelt ohne mich“. → Kanal-Look bleibt; treffer-check.md sollte angepasst werden.
9. **Titel-Länge:** 19.10. „25–40 Zeichen“, Skill „~60“, 4.11. „≤45“. → ≤45.
10. **Schlussbild:** Feedback-Log 23.10. „~20 s ohne Sprecher“ vs. Endscreen-Regel/Hook-Bauplan „höchstens 15 s, nicht stumm“. → 15 s mit Bild und Musik.
11. **Payoff „Here's what I think.“** (Skill-v3) widerspricht dem Ich-Verbot. → „Here's what the evidence says.“

## Stichprobe der aktuellen Skripte (Prüfskript `tools/regel_check.py` + Lesen der ersten Minute)

| Skript | Staunen | Regelbrüche |
|---|---|---|
| **AI-Crash vo-v3** | kaum; ruhiger Krisen-Ton, „Five things“-Liste | Minute 1: ~9 Zahlen (zwei Billionen, Tag 30, 6. Oktober, vier Ausgänge, sieben Wochen, zweieinhalb Jahre) und Rückblick auf vier frühere Crashs (Dotcom, Finanzkrise) = Rückblick + Zahlenkaskade; nur 2 Clips (Pflicht 3–6); „Five things“ = Listen-Schablone |
| **Altern vo-v4** | ja (alte Zellen werden jung) | Minute 1: Rückblick „for a hundred and sixty years“ + 3 Zahlen; Fragen-Stapel „Your grandparents? Your parents? You? Your kids?“; erster Satz mit „could“ |
| **Biocomputer vo-v3** | stark | keine Funde; eine Frage, Clip zeigt das Ereignis selbst. Vorbild für die anderen |
| **2037 vo-v4** | ja | Zahlen in Minute 1 sind Jahr + Uhrzeit (Zeitraster, ok); „I asked …“ ist Dialog einer Figur (ok) |
| **Tiere Gerüst v1** | ausdrücklich geplant | hält fast alles ein: eine Grundfrage, Leiter als Uhr, 5 Clips ≈ 6 %, Mitnehm-Liste, LOOP-Check, fragt statt zu predigen |

Nichts davon wurde geändert (erst nach Jakobs Freigabe der Regeln).

## Vorgeschlagene nächste Schritte nach Freigabe

1. Skill `scenario-script` als Karte vorschlagen, der auf REGELN.md verweist und die alten Teile (Ich-Sätze, Leitmetapher, Fahrplan, Abzweigung als Pflicht, Kanal-Bibel als Quelle) entfernt.
2. Thumbnail-Skill um die Regeln vom 24.10.–6.11. ergänzen.
3. treffer-check.md Punkt 4 (Farbe) korrigieren; Kanal-Bibel als „veraltet, siehe REGELN.md“ markieren.
4. AI-Crash- und Altern-Hook nach den Regeln nachschärfen (in den Film-Threads).
