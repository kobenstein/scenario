# #77 Clip-Auftrag für den iMac (25.11.2026)

NUR auf „Jakob - 6A“ arbeiten (interne Platte voll), Ordner:
`/Volumes/Jakob - 6A/2026_TheGoodTakeoff/#77_AGI_The_Final_Human_Invention/clips/`
Nicht ~/Downloads, nicht /tmp, nicht Desktop. Nicht den Film bauen, das macht die Cloud.
Niemals Schlüsselbund oder Passwörter lesen. yt-dlp darf wie bei #63 die Browser-Cookies nutzen (`--cookies-from-browser chrome`).

Details zu jedem Clip (Ziel-Wortlaut, Prüfpunkte, Alternativen): `clips.json` in diesem Ordner.

## Vorgehen je Clip
1. Englische Untertitel (auch automatische) mit yt-dlp laden (`--write-auto-subs --sub-langs en --skip-download`) und nach den Suchwörtern suchen.
2. Stelle anhören. Einen ganzen Satz (oder zwei) nehmen, der für sich steht, 7–12 s, 1 s Rand vorn und hinten.
3. Schneiden: 1080p (sonst beste Auflösung), H.264 CRF 18, AAC 192k.
4. Exakten Wortlaut, Sprecher, Start/Ende in `clips-zeiten.txt` eintragen, dazu je 30 s Kontext davor/danach als Text.

| Slot | Video | Suchen nach | Zweck im Film |
|---|---|---|---|
| C1 | DsewHeVbL-0 (Stanford GSB, Hassabis), ca. 09:20 | „solve everything else“ | Sein Plan: „Step one: solve intelligence. Step two: use it to solve everything else.“ |
| C2 | YHiqVRxGViM (Latent Space, Periodic Labs), Kapitel 01:00:20, Ersatz 00:30:22 | „experiment“, „ground truth“, „decades“ | Ein Satz: auch die klügste KI braucht das Experiment / das Labor. WER spricht (Liam Fedus oder Ekin Dogus Cubuk)? Unbedingt notieren. |
| C3 | aHpPoNNTOKY (SAIR, Terence Tao „Math 2.0“), erste Hälfte | „abundance“, „understanding“ | Mehr Beweise bringen nicht von selbst mehr Verstehen („proof abundance“). Nicht als KI-Gegner schneiden. |
| C4 | -Ef0ocEoBCs (Hinton Lectures, Paul Christiano), Vortrag | „trajectory“, „plausible“, „working“ | Sein Urteil: die Methoden sind plausibel, aber keine ist sicher auf Kurs. Keine Doom-Sätze. Sinn erhalten. |

Wenn ein Satz nicht existiert oder anders gemeint ist: die Alternative aus `clips.json` → `alternativen` (C1b, C2b/C2c, C3b/C3c, C4b) prüfen und so schneiden, und das klar in `clips-zeiten.txt` schreiben.

## Ablage
C1.mp4, C2.mp4, C3.mp4, C4.mp4 + clips-zeiten.txt per Chrome (drive.google.com → Hochladen) in Drive
„The Good Takeoff / #77 AGI: The Final Human Invention / 3 Rohmaterial / clips“ (Ordner anlegen, falls nicht da).
Nicht über den Drive-Desktop-Ordner (legt Kopie auf interner Platte ab). Original-Downloads auf 6A lassen. Danach kurz melden.
