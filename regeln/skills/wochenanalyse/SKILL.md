---
name: "wochenanalyse"
description: "Wöchentliche Kanalanalyse für The Good Takeoff mit Ampel, Hypothesen-Logbuch und höchstens 3 Änderungen für den nächsten Film-Batch. Nur auf Jakobs Aufruf."
---

# Wochen-Kanalanalyse

Ergebnis ist **eine Seite** (`DATUM/bericht.md`) mit drei Abschnitten:
1. **Was die Woche gezeigt hat:** Kanal gegen Vorwoche, jeder Film mit Ampel gegen den eigenen Normalwert.
2. **Was aus den alten Hypothesen wurde:** bestätigt, widerlegt oder offen.
3. **Was wir im nächsten Batch ändern:** höchstens 3 neue Hypothesen, jede mit Messgröße.

Jakob ruft den Skill selbst auf. Keine geplante Routine. Antwort an Jakob auf Deutsch.

## Dateien
- Ordner: `/mnt/project-files/scenario/analysen/woche/`
  - `kanal.json` – alles Kanal-Spezifische (Kanal-ID, Normalwert-Filme, Einstiegssekunde, Konkurrenz-Filter)
  - `merkmale.csv` – eine Zeile pro Film: video_id, nr, thema, titel_muster, thumb_text, thumb_art, hook_art, untertitel
  - `logbuch.md` – Hypothesen H1… mit Stärke und Status
  - `DATUM/daten.json`, `DATUM/zahlen.md`, `DATUM/bericht.md`
- Skript: `kanalanalyse/kanalanalyse.py` im Repo kobenstein/scenario (PR #6, Branch `claude/project-thread-8qfg3c`, bis zum Merge von dort holen). Vorlagen für andere Kanäle in `kanalanalyse/vorlage/`.
- Zugang: Umgebungsvariablen `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`. Data API über `youtube.googleapis.com` aufrufen (www.googleapis.com/youtube/v3 verliert hinter dem Proxy das Token).

## Ablauf
1. **Zahlen ziehen** (nur das Skript rechnet, damit jede Woche gleich gerechnet wird):
   `python3 kanalanalyse/kanalanalyse.py --config /mnt/project-files/scenario/analysen/woche/kanal.json`
   Das Skript schreibt `DATUM/daten.json` + `DATUM/zahlen.md` und listet Filme ohne Merkmale.
2. **Fehlende Merkmale** für neue Filme in `merkmale.csv` nachtragen (feste Werte wie in den bestehenden Zeilen, nichts Neues erfinden) und Schritt 1 wiederholen.
3. **Ampel lesen:** Normalwert = Median der letzten 10 Filme. 🟢 ≥ 125 %, 🔴 ≤ 75 %, sonst 🟡. Hauptmaß: Aufrufe an Tag 2.
4. **Trichter pro Ausreißer:** Wo hängt es? Verpackung (Klickrate), Einstieg (Halt bei 0:30 und 1:00), Mitte (Ø gesehen), Kanalbindung (Abos pro 1.000), Thema.
   Klickrate und Impressionen gibt die API nicht: nur für die Ausreißer im Studio (Erweiterter Modus, Chrome am iMac) nachlesen.
5. **Kurve gegen Skript:** auffällige Abfälle/Anstiege mit dem Satz abgleichen, der gerade lief (Untertitel-Pfad aus `merkmale.csv`). Besonders 0:16–0:50 prüfen.
6. **Konkurrenz:** Filme direkter Konkurrenten mit ≥ 3× deren Normalwert in den letzten 14 Tagen (Skript-Ausgabe) kurz einordnen.
7. **Logbuch:** jede offene Hypothese prüfen (bestätigt / widerlegt / offen, mit Zahl). Höchstens 3 neue aufnehmen, jede mit Beobachtung, Änderung, Messgröße, „Widerlegt, wenn“.
8. **Bericht** `DATUM/bericht.md` schreiben, eine Seite, drei Abschnitte wie oben.
9. **An Jakob:** 3–5 Sätze Deutsch: wichtigster Befund, was bestätigt/widerlegt ist, die bis zu 3 Änderungen für den nächsten Batch.

## Regeln
- Nur echte Zahlen, nie hochrechnen. Analytics hinkt ~2 Tage hinterher; die Woche endet vorgestern.
- Die Kurve zeigt, **wo** Leute gehen, nicht **warum**. Ursache gilt erst als sicher, wenn die Änderung im nächsten Batch getestet ist.
- Bestätigte Hypothesen werden **erst nach Jakobs Freigabe** in `schreibraum/REGELN.md` oder Skills übernommen.
- Nach dem Schreiben in den Projektordner ~10 s warten und neu lesen (Netz-Mount).