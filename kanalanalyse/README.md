# Wochen-Kanalanalyse

Ein festes System, mit dem ein YouTube-Kanal jede Woche aus seinen Zahlen lernt.
Ergebnis ist **eine Seite** mit drei Abschnitten:

1. **Was die Woche gezeigt hat** – Kanal gegen Vorwoche, jeder Film mit Ampel gegen den eigenen Normalwert.
2. **Was aus den alten Hypothesen wurde** – bestätigt, widerlegt oder noch offen.
3. **Was wir im nächsten Batch ändern** – höchstens 3 neue Hypothesen, jede mit Messgröße.

## So funktioniert es

| Schritt | Wer | Was |
|---|---|---|
| 1. Zahlen ziehen | Skript `kanalanalyse.py` | YouTube Analytics + Data API → `DATUM/daten.json` und `DATUM/zahlen.md` |
| 2. Einordnen | Skript | Normalwert = Median der letzten 10 Filme; Ampel 🟢 ≥ 125 % · 🟡 · 🔴 ≤ 75 % |
| 3. Trichter | Skript + Claude | Pro Film: wo hängt es? Verpackung (CTR), Einstieg (0:30), Mittelteil (Ø gesehen), Kanalbindung (Abos/1k), Thema |
| 4. Retention gegen Skript | Skript + Claude | Auffällige Abfälle/Anstiege der Kurve mit dem Satz, der gerade lief (aus den Untertiteln) |
| 5. Konkurrenz | Skript | Filme direkter Konkurrenten mit ≥ 3× deren Normalwert in den letzten 14 Tagen |
| 6. Hypothesen + Logbuch | Claude (Skill `wochenanalyse`) | Alte Hypothesen prüfen, max. 3 neue, Bericht schreiben |

Rechnen tut nur das Skript, damit die Zahlen jede Woche gleich entstehen.
Claude deutet, schreibt und hält das Logbuch.

## Einrichten für einen Kanal (einmalig, ~30 Minuten)

1. Ordner anlegen und die vier Dateien aus `vorlage/` hineinkopieren:
   - `kanal.json` – Kanal-ID und Einstellungen (alles Kanal-Spezifische steht nur hier)
   - `merkmale.csv` – eine Zeile pro Film: Thema, Titel-Muster, Thumbnail-Text und -Art, Hook-Art, Pfad zu den Untertiteln
   - `logbuch.md` – leer starten oder mit dem, was man schon weiß
   - `konkurrenz.csv` – Kanal-IDs der direkten Konkurrenten
2. OAuth-Zugang als Umgebungsvariablen: `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`
   (Scopes `yt-analytics.readonly` und `youtube.readonly`). Für die Konkurrenz zusätzlich `YT_API_KEY`, falls kein Proxy ihn setzt.
3. Erster Lauf: `python3 kanalanalyse/kanalanalyse.py --config ORDNER/kanal.json`
   Das Skript listet alle Filme ohne Merkmale; die werden einmal in `merkmale.csv` nachgetragen.

## Jede Woche

`/wochenanalyse` aufrufen. Der Skill startet das Skript, prüft das Logbuch, schreibt `DATUM/bericht.md`.
Regeln ändern sich erst, wenn der Kanal-Inhaber eine bestätigte Hypothese freigibt.

## Grenzen

- Impressionen und CTR liefert die API nicht jedem Kanal. Dann liest der Skill sie für die Ausreißer in YouTube Studio nach.
- Analytics hinkt ~2 Tage hinterher; die Kanal-Woche endet deshalb vorgestern.
- Die Kurve zeigt, **wo** Leute gehen, nicht **warum**. Sicher wird eine Ursache erst, wenn die Änderung im nächsten Batch getestet ist. Dafür ist das Logbuch da.
- Kosten: eigener Kanal nur Analytics-Abfragen (kein Kontingent-Problem), Konkurrenz ~3 API-Einheiten pro Kanal.
