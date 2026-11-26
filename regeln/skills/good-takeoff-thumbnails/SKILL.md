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

## Pflicht: Das Thumbnail funktioniert ALLEIN (Jakob 23.11.2026)
Jedes Thumbnail (A, B UND C) muss ohne den Texttitel daneben komplett alles sagen: worum es im Film geht und warum man jetzt klicken will. Umgekehrt muss auch der Texttitel ohne Bild allein klar sein (REGELN §8.6, §9.6).
- **Test vor dem Bauen und nach jedem Bild:** Ein Fremder ohne Vorwissen sieht nur das Thumbnail im Feed, ohne Titel. Kann er in einem Satz sagen, worum es geht? Wenn nicht, ist das Thumbnail durchgefallen und wird neu gebaut, egal wie schön es ist.
- Kein „it/they“ ohne Bezug, kein Wortspiel oder Rätsel, das erst der Titel erklärt. Das Subjekt steht im Bild oder im Bildtext, KI ist erkennbar.
- Nicht an einem früheren Thumbnail-Aufbau festhalten (Jakob 23.11. zu #68: „orientiere dich nicht an Aging“), sondern das Motiv finden, das dieses Thema allein erklärt.
- An Jakob pro Variante einen Satz mitschicken: „Ohne Titel versteht man: …“.

## Text auf dem Bild
- Eine starke Behauptung, nah am Titel, die aber auch ohne Titel verständlich ist. Die erste Variante ist das Titel-Versprechen.
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

**Nie Edit auf Edit (Jakob 20.11.2026):** Jeder Edit rechnet das ganze Bild neu, und es wird bei jeder Generation sichtbar unschärfer. Bei #65 war die 4. Generation deutlich schlechter. Darum machst du jeden Text-Edit IMMER vom ersten generierten Original (`…-2560.png` der ersten Runde, nicht von einer Textvariante). Lade dieses Original bei Bedarf neu zu fal hoch. In `titel.md` schreibst du zu jeder Variante, von welchem Original sie stammt.

Kosten: GPT Image 2.5 high, 3 Bilder, nur ein paar Cent bis wenige Dollar pro Runde. Neu erzeugen nur, wenn ein Bild nicht passt.

## Nachbearbeiten und ablegen
Ordner: `/mnt/project-files/scenario/thumbnails/film-NN/`.
- `fNN-<a|b|c>-<stichwort>-2560.png` ist das Original.
- 1280×720: `ffmpeg -i <2560.png> -vf "scale=1280:720:flags=lanczos,unsharp=3:3:0.4" <name>.png`, dazu eine `-1280.jpg` mit `-q:v 2` (unter 2 MB für YouTube).
- `vergleich.jpg`: alle drei nebeneinander (`hstack=3,scale=1920:-1`).
- `titel.md`: Texte, Motive, welche Variante gesetzt wird.
- Ältere Runden verschiebst du nach `alt-vN/`, nie löschen.
- **Sofort nach Drive (Pflicht, jede Runde):** Gleich nach dem Erstellen alle A/B/C (2560er Original + 1280er PNG/JPG) in den Drive-Ordner „#NN Titel/2 Thumbnails“ in „The Good Takeoff“ (1cCNjwOJ47DdDtPU2hb2JkyVLpp96r8Eg) hochladen, ältere Runden dort in „alt-vN“. Fehlt der Filmordner, mit 1 Film / 2 Thumbnails / 3 Rohmaterial / 4 Texte & Recherche anlegen. Upload per Drive-Tool mit Dateireferenz aus einer echten Kopie im Scratchpad, `disableConversionToGoogleType: true`. Erst danach an Jakob schicken.

Das Projektverzeichnis ist ein Netz-Mount. Lies die Dateien etwa 10 s nach dem Schreiben noch einmal.

## An Jakob
- Die drei PNGs (1280) als Anhang schicken und den Drive-Link zu „2 Thumbnails“ dazuschreiben.
- Pro Variante eine Zeile: Text und Motiv.
- Eine Empfehlung, welche per Upload gesetzt wird. Meist ist das A, das Titel-Versprechen.
- Zapier kann kein Test & Compare. Eine Variante wird beim Upload gesetzt, die anderen zwei fügt Jakob in YouTube Studio hinzu. Sag ihm, wo die Dateien liegen.
- Neue Wünsche oder Lehren von Jakob trägst du in die Projekt-Erinnerung ein (scenario-thumbnails).