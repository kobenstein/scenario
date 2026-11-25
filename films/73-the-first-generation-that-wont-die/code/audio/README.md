# Film 73 · Ton (audio/) · „The First Generation That Won't Die“

Gehört dem Ton-Schritt; der Bild-Code liest nur `<ROOT>audio/*.json`. Methode 1:1 wie Film 69. Daten-Root `$F73ROOT` = `/mnt/project-files/scenario/film-73-wont-die/`, Scratch `/tmp/claude-0/f73/audio/`.

## Ablauf
1. `make_segments.py` — `<ROOT>vo-v3.txt` (Faktencheck final) → `segments.json`: 25 Takes t00–t24 (≤ 520 Zeichen, Abo-Aufrufe als eigene Takes t11 / t24) + 3 Clip-Slots an den Zeilen `[CLIP C1]` / `[CLIP C3]` / `[CLIP C4]` (C3b nicht verwendet; `[SCHLUSSBILD …]` = Regie-Notiz, entfällt). Stationen wie `tools/provisional_timing.py`: H 1 2 3 M 4 5 6 E A2. Ein Stimm-Tag pro Station (`TAGS`: thoughtful, calm conversational, curious, warm), keine Flüster-Tags (Assert). vo-v3 schreibt schon „A.I.“ und Jahre ausgesprochen. Slot-Länge = `<ROOT>clips/Cn.mp4` (ffprobe), solange die Datei fehlt `clips-geprueft.json` `duration_s` (Platzhalter, stumm).
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 → `/tmp/claude-0/f73/audio/dl/vo-tNN.mp3` (URLs in `fal_urls.txt`).
3. `align_ps.py . /tmp/claude-0/f73/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json`. Hörprüfung fal-ai/wizper über die ganze VO (25.11.): alle Wörter da, nichts doppelt (nur Hörfehler „walk-in“ = walking, „Accept“ = Except). Eleven v4 schneidet die Dateien knapp (t00/t14 mit Klick am Ende) → build_vo blendet jedes Take-Ende 40 ms aus.
4. `clips_wav.py /tmp/claude-0/f73/audio/clipwav` — Ton der ganzen Dateien `<ROOT>clips/Cn.mp4`.
5. `build_vo.py . /tmp/claude-0/f73/audio` — `vo_master.wav`, `vo_only.wav` + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (keine nach dem Hook), 0.6 s Luft um jeden Clip, `BREATH` t07 0.7 s vor „The same executive“ (lever_switch), END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild, nur Musik).
6. `clip_cues.py` — Clip-Untertitel: geprüfter Wortlaut (`wording`) aus `<ROOT>clips-geprueft.json` per pocketsphinx auf den Clip-Ton → `clips_meta.json` (inkl. `gain_db`); dann `clips_json.py` → `clips.json`. Ohne Clip-Datei kein Eintrag.
7. Musik: `music/prompts.json` (Lyria 3.5 `google/lyria-3.5`, 6 Tracks M0–M5; Nacht, stilles Staunen, Zerbrechlichkeit eines Lebens und vorsichtige Hoffnung: Pads, warmer Streicher-Drone, Filzpiano, Celesta, keine Vocals) + `music/cues.json`, URLs in `music/urls.txt`. SFX: `sound_plan.json` (6 Akzente nur in Pausen, alle aus `sfx-bibliothek/akzent`: tick, lever_switch, heartbeat, bloom, shimmer_rings, chime; keine Mirelo-Sounds, `sfx_prompts.json`) → `/tmp/claude-0/f73/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f73/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3` (128k, nach `<ROOT>audio/`), Stems. Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung bricht bei Wort-Überlappung ab.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile ≤ 34 Zeichen, Inter 19 auf 384×288, Outline 1.4, MarginV 20; Zahlen als Ziffern, A.I. → AI), nach `<ROOT>audio/untertitel/`.

Neulauf ohne neue Takes: `W=/tmp/claude-0/f73/audio; python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel && cp untertitel/subtitles.* /mnt/project-files/scenario/film-73-wont-die/audio/untertitel/`

## Dateien
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f73/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`.

## Ergebnis (25.11., final mit den echten Clips)
- Länge 630.67 s (10:30.7) · letztes VO-Wort „subscribe.“ 611.67 s · Endbild 615.67–630.67 s · Kanal-Aufrufe t11 277.78–287.96, t24 601.65–611.67
- Slots (= ffprobe der Clip-Dateien): C1 56.71–64.02 (7.31 s) · C3 186.52–193.44 (6.92 s) · C4 342.91–352.91 (10.00 s), Clip-Anteil 3.8 %
- Clip-Pegel: `gain_db` C1 −0.9, C3 −1.5, C4 −1.4 → Clips im Mix +0.35 bis +0.55 LU über der VO davor/danach (ebur128)
- mix.wav −14.00 LUFS, −1.50 dBTP, LRA 3.5 · 362 Untertitel (davon 18 Clip-Untertitel), längste Zeile 34
- fal-Kosten ≈ 1.27 USD (TTS ≈ 0.65, Lyria 0.60, Wizper ≈ 0.02; SFX aus der Bibliothek)
