---
name: "good-takeoff-upload"
description: "Fertigen The-Good-Takeoff-Film per YouTube-API hochladen und einplanen, danach Studio-Schritte am iMac (Monetarisierung, Endscreen, Test & Compare) und Release-Check erledigen."
---

# Upload und Release für The Good Takeoff

Gilt für jeden Langfilm, auch Neu-Uploads. Antwort an Jakob deutsch, alles auf YouTube englisch.
Release-Standard: privat hochladen, `publishAt` 17:00 Wien. Beschreibungsregeln: `schreibraum/REGELN.md` §12.

## 1. Vor dem Upload prüfen
1. **Richtiger Kanal:** `GET https://youtube.googleapis.com/youtube/v3/channels?part=id&mine=true` muss `UCozIWUuVxpyDVkNUXaOqPFg` liefern. Sonst abbrechen und Jakob melden (11.11. lag ein Token auf dem Privatkanal).
2. **Echte Datei:** Größe mit `stat -L -c%s` (nie Symlink-Größe; 16.11. gingen zwei 41-Byte-Uploads raus). Master 1080p30, Ton −14 LUFS, Untertitel eingebrannt, `.srt` daneben.
   **Sicherung sofort (vor dem Upload):** genau diese Originaldatei nach Drive „#NN Titel/1 Film“ und auf „/Volumes/Jakob - 6A/2026_TheGoodTakeoff/#NN_Titel“ kopieren, Prüfsumme (`shasum -a 256`) mit dem Original vergleichen. Erst dann hochladen. Nie aus YouTube Studio herunterladen; fehlt das Original, Jakob melden.
3. **Clips:** `python3 tools/clip_check.py <clips.json> <timing.json>` bestanden (≤ 10 % Laufzeit).
4. **Sponsoren:** `regeln/sponsoren-aktiv.md` (Repo, nach Merge von PR #8 auf main) für den Veröffentlichungstag lesen; Links in die Beschreibung, Häkchen „bezahlte Werbung“, wenn ein Sponsor drin ist.
5. **Beschreibung:** Absatz 1 Hook, Absatz 2 Kaffee-Zeile, Absatz 3 Kurs-Zeile (genau wie in `tools/check_descriptions.py`), dann Kapitel, Quellen nach Themen, ORIGINAL-FOOTAGE-Credits, Zeile „Every animation in this film was built from scratch for it, in code … The narration uses a synthetic voice.“, „Spotted an error? Mention it in the comments.“ Gesamt ≤ ~4.850 Zeichen.

## 2. Upload per API (Cloud)
- Resumable Upload über `https://youtube.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`, in 32-MB-Stücken.
- `status`: `privacyStatus` private, `publishAt` 17:00 Wien in UTC, `selfDeclaredMadeForKids` false, `containsSyntheticMedia` true.
- `snippet`: Titel A (von Jakob gewählt), Beschreibung, Kategorie 27 (Education), Sprache en.
- Danach: Thumbnail A per `thumbnails/set`, `.srt` als Untertitel (wenn der Token es darf), Bytezahl im Log mit der Datei vergleichen.
- `python3 tools/check_descriptions.py` laufen lassen, bei Fehlern `--fix`.
- Video-ID, Termin und Titel in Film-Memory, Sheet „Filme und Ideen“ und `themen/nummern-liste.md` eintragen.

## 3. Studio-Schritte am iMac (Pflicht, gehen nicht per API)
Per Remote Control auf dem iMac, nur über die Claude-in-Chrome-Erweiterung. Im Auftrag immer: „Niemals Schlüsselbund, Browser-Cookies oder Passwörter lesen; wenn Chrome nicht verbunden ist, sofort abbrechen und melden.“ Studio-Klicks gehen nur durch, wenn Jakobs eigene Nachricht die Sitzung erreicht; den Auftrag deshalb mit seiner Nachricht starten.
1. **Monetarisierung → An**, Anzeigeneignung ehrlich ausfüllen, Mid-Rolls an. API-Uploads starten immer mit Werbung AUS.
2. **Endscreen:** „Aus Video importieren“ vom letzten Film, links bestes passendes Video, rechts neuester Upload, Abo-Element.
3. **Test & Compare:** Thumbnails A/B/C (oder Titel A/B/C) einschalten. Laufende oder abgeschlossene Tests nie neu starten.
4. **Urheberrechtsprüfung** abwarten; bei Anspruch den Clip durch eine Zitatkarte ersetzen und neu hochladen.
5. Ist der iMac offline: Auftrag stehen lassen und mit `send_later` alle ~2 h neu anfragen, bis erledigt.

## 4. Nach dem Release
- **~17:20:** öffentlich? Beschreibung ok? Test & Compare läuft? Monetarisierung an? Jakob eine Zeile.
- **Wecker für +24 h anlegen (Pflicht):** Klickrate im Studio lesen. Unter 6 % neuen Titel oder Bildtext aus der Titel-Werkstatt setzen (Skill `good-takeoff-thema-titel`, Schritt 8), Jakob eine Zeile.
- **Kommentare:** in den ersten 48 h die 5–10 meistgelikten in das Freigabe-Sheet „Kommentar-Antworten – zur Freigabe“ eintragen (Ich-Form als Jakob, Stil `jakob-schreibstil`); nur Zeilen mit „ok“/„eigene“ per Chrome posten. Anpinnen nur auf Jakobs Auftrag.
## 5. Archiv (Pflicht, am Release-Tag, gilt erst als erledigt, wenn alle vier Haken stehen)
1. **Drive:** Filmordner „#NN Titel“ in „The Good Takeoff“ (1cCNjwOJ47DdDtPU2hb2JkyVLpp96r8Eg) mit 1 Film / 2 Thumbnails / 3 Rohmaterial / 4 Texte & Recherche; fehlt er, anlegen. Prüfen, dass der Master aus Schritt 2 (Originaldatei, nie Studio-Download) in „1 Film“ und auf „Jakob - 6A“ liegt; Thumbnails A/B/C in „2 Thumbnails“. Nie löschen ohne Qualitätsvergleich.
2. **Repo:** Eintrag in `films/filme.json` (nr, ordner, titel, video, veroeffentlicht, skript_quellen, thumbnail_quelle, code_herkunft), Code nach `films/NN-titel/code/` (ohne Audio/Video/Dateien > 1 MB, die in der README listen), dann `python3 tools/sync_projektordner.py NN --youtube`.
3. **Merge:** PR auf main öffnen und ohne Konflikt selbst mergen.
4. **Filmliste (Jakobs Sheet):** „The Good Takeoff – Filme und Ideen“ (Google Sheets, ID `12yIldvXemnQQF1fD_COAev4Xy6W9XZfVI8VWpUIEKZ8`, Tab „Filme“) in place bearbeiten, nie neue Datei: Zeile #NN mit Status (geplant/online), Titel, Datum TT.MM.JJJJ, YouTube-Link, Notiz. Fehlt die Zeile, anhängen. Zwischen 10.11. und 27.11. wurde das vergessen, weil der Schritt nur in Abschnitt 2 stand.
Jakob in der Release-Zeile melden: „Archiv: Drive ✓ Repo ✓ main ✓ Liste ✓“ (oder was fehlt).