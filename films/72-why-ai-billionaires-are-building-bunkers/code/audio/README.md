# Film 72 · Ton (audio/) · „Why AI Billionaires Are Building Bunkers“

Gehört dem Ton-Schritt; der Bild-Code liest nur `<ROOT>audio/*.json`. Methode 1:1 wie Film 73. Daten-Root `$F72ROOT` = `/mnt/project-files/scenario/film-bunker/`, Scratch `/tmp/claude-0/f72/audio/`. SFX-Bibliothek: `/mnt/project-files/scenario/sfx-bibliothek/akzent` (nicht unter `/home/user/scenario`).

## Ablauf
1. `make_segments.py` — `<ROOT>vo-v4.txt` (final) → `segments.json`: 24 Takes t00–t23 (≤ 520 Zeichen, Abo-Aufrufe als eigene Takes t16 / t23) + 4 Clip-Slots in Filmreihenfolge `[CLIP C1]`, `[CLIP C2]`, `[CLIP C3]`, `[CLIP C2b]`. Stationen: H Hook · 1 Bombe (C1 Altman) · 2 Maschine · 3 Chaos (C2 Harris) · 4 Wir (C3 Rushkoff, endet „So what would make the bunker unnecessary?“) · M Abo 1 · 5 Tür/Antwort (C2b Harris) · E Ende · A2 Abo 2. Ein Stimm-Tag pro Station aus vo-v4 (`[calm, conversational]` Hook/Ende, `[thoughtful]` 1–5, `[warm]` Abo), keine Flüster-Tags (Assert). `[pause] …` in vo-v4 = redaktionelle Pause: der Take davor bekommt `pause: true` (build_vo `PAUSE` 1.2 s), das Tag selbst geht nie an die TTS (t06, t14, t18, t21). Slot-Länge = `<ROOT>clips/Cn.mp4` (ffprobe), solange die Datei fehlt `clips-geprueft.json` `duration_s` (C1 7.61, C2 5.62, C3 10.26, C2b 5.8; Platzhalter, stumm).
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 → `/tmp/claude-0/f72/audio/dl/vo-tNN.mp3` (URLs in `fal_urls.txt`; der fal-Key lief über die fal-MCP-Tools, die Skripte rufen fal nicht selbst auf).
3. `align_ps.py . /tmp/claude-0/f72/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json` (OOV-Namen mit ARPAbet: Rushkoff, Zuckerberg, OpenAI, Helsinki, cyberattack(s), pandemics, A.I. / A.G.I. als Buchstaben). Hörprüfung fal-ai/wizper über die ganze VO (25.11.): alle Wörter da, nichts doppelt (nur Hörfehler „Theo Vaughan“ = Theo Von, „going to“ = gonna).
4. `clips_wav.py /tmp/claude-0/f72/audio/clipwav` — Ton der ganzen Dateien `<ROOT>clips/Cn.mp4`.
5. `build_vo.py . /tmp/claude-0/f72/audio` — `vo_master.wav`, `vo_only.wav` + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (keine nach dem Hook), 0.6 s Luft um jeden Clip, Pause-Takes 1.2 s, `BREATH` (Platz für Akzente im Take): t04 0.95 s vor „And something here is new“ (Bleistift), t07 0.95 s vor „But then why are they still building?“ (Bleistift), t12 0.7 s vor „Rushkoff offered a different answer“ (lever_switch). END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild, nur Musik).
6. `clip_cues.py` — Clip-Untertitel: geprüfter Wortlaut aus `<ROOT>clips-geprueft.json` per pocketsphinx auf den Clip-Ton → `clips_meta.json` (inkl. `gain_db`); dann `clips_json.py` → `clips.json`. Ohne Clip-Datei kein Eintrag (jetzt: `clips.json` = leere Liste).
7. Musik: `music/prompts.json` (Lyria 3.5 `google/lyria-3.5`, 6 Tracks M0–M5: M0 H,1 Nacht-Krimi, tiefer Puls, gedämpftes Klavier, weiche Pads · M1 2,3 · M2 4 bis „It's built against people.“ dunkler · M3 Wende „They're hiding from us.“ bis Abo 1, leise und ernst · M4 5 ab „Remember the answer …“ warme vorsichtige Hoffnung · M5 E, A2 + Endbild; keine Vocals, kein Horror, kein Alarm) + `music/cues.json`, URLs in `music/urls.txt` (M3: erster Prompt von Lyria mit value_error abgelehnt, umformuliert, kein Berechnungsfehler). SFX: `sound_plan.json` (5 Akzente nur in Pausen, alle aus `sfx-bibliothek/akzent`: pencil ×2 = Durchstreichen von Bombe und Maschine, lever_switch = Wachen, key = Schloss am Ende von „built against people“, shimmer_rings = Schluss; keine Mirelo-Sounds, `sfx_prompts.json`) → `/tmp/claude-0/f72/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f72/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3` (128k, nach `<ROOT>audio/`), Stems. Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung bricht bei Wort-Überlappung ab.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile ≤ 34 Zeichen, Inter 19 auf 384×288, Outline 1.4, MarginV 20; Zahlen als Ziffern „100 experts“, „8 billion“, A.I. → AI, A.G.I. → AGI), nach `<ROOT>audio/untertitel/`.

## Neulauf mit den echten Clips (ein Block)
Die Clips (C1, C2, C3, C2b als mp4) liegen im Branch `origin/f72-clips` unter `films/72-assets/clips/`. Mit den Clips ändern sich die Slot-Längen; Musik und SFX hängen an Takes/Wörtern und ziehen mit. Pegel: nach dem ersten Lauf `gain_db` pro Clip (`GAIN` in `clip_cues.py`) aus ebur128 (Clip vs. VO davor/danach, Ziel ±1 LU) nachziehen und `clip_cues.py → clips_json.py → mix.py` noch einmal laufen lassen.

```
cd /home/user/scenario && git fetch origin f72-clips && mkdir -p /tmp/claude-0/f72/clipsrc /mnt/project-files/scenario/film-bunker/clips \
 && git archive origin/f72-clips films/72-assets/clips | tar -x -C /tmp/claude-0/f72/clipsrc \
 && cp /tmp/claude-0/f72/clipsrc/films/72-assets/clips/*.mp4 /mnt/project-files/scenario/film-bunker/clips/
cd films/72-why-ai-billionaires-are-building-bunkers/code/audio && W=/tmp/claude-0/f72/audio \
 && python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py \
 && python3 mix.py . $W && python3 subs.py . untertitel && cp untertitel/subtitles.* /mnt/project-files/scenario/film-bunker/audio/untertitel/
```
(Dateinamen der Clips müssen `C1.mp4`, `C2.mp4`, `C3.mp4`, `C2b.mp4` heißen. `mix.py` dauert ~1.5 min. Szenen-Scratch `$W` neu aufbauen, falls leer: `dl/` aus `fal_urls.txt`, `music/` aus `music/urls.txt`, `sfx/` = pencil, lever_switch, key, shimmer_rings aus der SFX-Bibliothek.)

## Dateien
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f72/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`.

## Ergebnis (25.11., Stand mit stummen Platzhalter-Slots, echte Clips noch nicht da)
- Länge 594.98 s (9:55.0) · letztes VO-Wort „subscribe.“ 575.98 s · Endbild 579.98–594.98 s · Kanal-Aufrufe t16 418.96–429.34, t23 565.66–575.98
- Slots (Platzhalter, = `duration_s`): C1 93.77–101.38 (7.61 s) · C2 206.51–212.13 (5.62 s) · C3 288.10–298.36 (10.26 s) · C2b 497.18–502.98 (5.80 s), Clip-Anteil 4.9 %
- mix.wav −14.0 LUFS, −1.52 dBTP, LRA 4.6 · 324 Untertitel (ohne Clip-Untertitel; die kommen mit den Clips dazu), längste Zeile 34
- fal-Kosten ≈ 1.25 USD (TTS ≈ 0.62 für ≈ 7.7k Zeichen, Lyria 0.60 (der abgelehnte M3-Versuch wird nicht berechnet), Wizper ≈ 0.02; SFX aus der Bibliothek)
