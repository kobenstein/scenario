---
name: "good-takeoff-thumbnails"
description: "Make the three YouTube thumbnails (A/B/C for Test & Compare) for a The Good Takeoff film in the channel's flat grain-illustration style."
---

# Thumbnails für The Good Takeoff

Pro Film immer DREI Thumbnails (A, B, C). Alle drei laufen in YouTube Test & Compare. Jakob schreibt Deutsch, der Kanal ist Englisch: Der Bildtext ist englisch, die Antworten an Jakob sind deutsch.

## Der Stil (freigegeben von Jakob am 24.10.2026: „tausendmal besser“)
- **Zeichenstil:** flache Editorial-Grain-Illustration im Stil von Brian Stauffer. Große, einfache Formen, weiche körnige Verläufe, feines Stipple-Korn.
- **Bildaufbau:** eine winzige Figur vor EINER riesigen Lichtform, viel Leerraum, keine Kleinteile.
- **Farben wie die bisherigen Thumbnails:** tiefes Nachtblau und Indigo, warmes Gold, die kleine Figur in gelber Regenjacke.
- **Schrift:** sehr fette, schmale, leuchtende Creme-Grotesk in Großbuchstaben. Riesig und am Handy lesbar.
- **Verboten** (sieht „extrem nach KI“ aus):
  - viele Details: Geräte, Spiegelungen, Lichtnetze, Fenster mit Inhalt;
  - realistische oder malerische Oberflächen;
  - Filmstills als Vorlage („sieht shit aus“);
  - KI-Bilder als einzige Referenz.

## Referenzen (immer alle, in dieser Reihenfolge)
1. `/mnt/project-files/scenario/thumbnails/final/folge-01-thumbnail.png`: Farben, Figur und Schrift.
2. Diese vier Ausschnitte aus Jakobs Pinterest-Board liefern den Zeichenstil:
   - `/mnt/project-files/scenario/referenzen/thumb-stil/r1-monolith.png`
   - `/mnt/project-files/scenario/referenzen/thumb-stil/r3-eye.png`
   - `/mnt/project-files/scenario/referenzen/thumb-stil/r2-hands.png`
   - `/mnt/project-files/scenario/referenzen/thumb-stil/r5-stauffer.png`

Das ganze Board liegt unter `/mnt/project-files/scenario/referenzen/pinterest-stil-board.png`.

Hochladen: Rufe `mcp__fal__upload_file` mit `prepare_upload: true`, `file_name` und `file_size` auf. Dann `curl -X PUT -H "Content-Type: image/png" --upload-file <datei> "<upload_url>"`. Erst nach einem 2xx die `file_url` verwenden.

## Text auf dem Bild
- Eine starke Behauptung, nah am Titel. Die erste Variante ist das Titel-Versprechen.
- Höchstens 4–5 Wörter, keine Fachwörter.
- Der Text muss klar sagen, was im Film ist. Zusatz-Slogans sind verboten.
- Die drei Varianten unterscheiden sich in Bild UND Text:
  - A: das Versprechen, z. B. „IT WILL MAKE YOU SMARTER“;
  - B: die Frage oder der Gegensatz, z. B. „SMARTER OR DUMBER?“;
  - C: eine kurze Steigerung, z. B. „SMARTER THAN EVER“.
- Jedes Motiv ist EIN zentrales Bild aus dem Film-Leitgedanken: Hand aus Licht, Gegensatz links/rechts, Kopf-Silhouette mit Lichtsonne …

## Erzeugen
Endpoint `openai/gpt-image-2.5/sunburst/edit`. Die drei Varianten schickst du in einem `mcp__fal__submit_jobs`-Aufruf und holst sie dann einzeln mit `mcp__fal__check_job` ab.

Input: `image_urls` = die 5 Referenzen, `image_size` {width 2560, height 1440}, `quality` "high", `num_images` 1, `output_format` "png".

Prompt-Vorlage:
```
Create a NEW 16:9 YouTube thumbnail. COLORS and HEADLINE TYPOGRAPHY exactly as in image 1: deep night blue and indigo, warm golden light, a small figure in a yellow raincoat, headline in very bold condensed glowing cream capitals. DRAWING STYLE exactly as in images 2–5: flat editorial illustration in the manner of Brian Stauffer, large simple geometric shapes, smooth grainy gradients and fine stipple grain, a tiny human figure in front of one huge glowing shape, strong negative space, no realistic rendering, no small details, no painterly texture. Composition: <EIN Motiv, 2–3 Sätze>. Headline <on the left, two lines | across the top, one line>, huge, readable on a phone: "<TEXT>". Spell it exactly. No other text.
```
Die Schrift rendert GPT direkt. Prüfe jede Schreibweise. Für eine Textkorrektur machst du einen Edit mit der fal-URL des Bildes als einziger Referenz: „Change ONLY the text to …, keep the same font size“. Ohne Angabe der Schriftgröße schrumpft die Schrift.

Kosten: GPT Image 2.5 high, 3 Bilder, nur ein paar Cent bis wenige Dollar pro Runde. Neu erzeugen nur, wenn ein Bild nicht passt.

## Nachbearbeiten und ablegen
Ordner: `/mnt/project-files/scenario/thumbnails/film-NN/`.
- `fNN-<a|b|c>-<stichwort>-2560.png` ist das Original.
- 1280×720: `ffmpeg -i <2560.png> -vf "scale=1280:720:flags=lanczos,unsharp=3:3:0.4" <name>.png`, dazu eine `-1280.jpg` mit `-q:v 2` (unter 2 MB für YouTube).
- `vergleich.jpg`: alle drei nebeneinander (`hstack=3,scale=1920:-1`).
- `titel.md`: Texte, Motive, welche Variante gesetzt wird.
- Ältere Runden verschiebst du nach `alt-vN/`, nie löschen.

Das Projektverzeichnis ist ein Netz-Mount. Lies die Dateien etwa 10 s nach dem Schreiben noch einmal.

## An Jakob
- Die drei PNGs (1280) als Anhang schicken.
- Pro Variante eine Zeile: Text und Motiv.
- Eine Empfehlung, welche per Upload gesetzt wird. Meist ist das A, das Titel-Versprechen.
- Zapier kann kein Test & Compare. Eine Variante wird beim Upload gesetzt, die anderen zwei fügt Jakob in YouTube Studio hinzu. Sag ihm, wo die Dateien liegen.
- Neue Wünsche oder Lehren von Jakob trägst du in die Projekt-Erinnerung ein (scenario-thumbnails).