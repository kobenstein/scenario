# Film 66 · Ton (audio/)

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 59 (`films/59-.../code/audio/`), Daten-Root `$F66ROOT` = `/mnt/project-files/scenario/film-geld-nach-si/`.

## Ablauf (Stand 20.11.2026)
1. `make_segments.py` — `<ROOT>vo-v3.txt` → `segments.json` (24 Takes absatzweise, ≤ 520 Zeichen, 4 Clip-Slots nach den Lead-in-Zeilen; „AI“ → „A.I.“; IPA für Hassabis/Acemoglu nur im TTS-Text `say`).
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301, mp3_44100_192 → `/tmp/claude-0/f66/audio/dl/vo-tNN.mp3` (Download-URLs in `fal_urls.txt`). t21 nach Zweitprüfung („a yearly check“) neu aufgenommen.
3. `align_ps.py . /tmp/claude-0/f66/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json`.
4. `clips_wav.py /tmp/claude-0/f66/audio/clipwav` — Ton der fertig geschnittenen `<ROOT>clips/Cn.mp4`.
5. `build_vo.py . /tmp/claude-0/f66/audio` — `vo_master.wav`, `vo_only.wav` (scratch) + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). END_TAIL 19 s (≈4 s Luft + 15 s Endbild).
6. `clips_json.py` — `clips.json` (Clip-Metadaten + Untertitel-Cues aus `clips-geprueft.json`). Bleibt NUR hier (das Bild-Kit liest unter `<ROOT>audio/clips.json` ein anderes Format).
7. Musik: `music/prompts.json` (Lyria 3.5, `google/lyria-3.5`, 6 Tracks M0–M5) + `music/cues.json`; SFX: `sound_plan.json` (+ `sfx_prompts.json` für Mirelo `pricetag`, `receipt`; Rest aus `sfx-bibliothek`).
8. `mix.py . /tmp/claude-0/f66/audio` — `mix.wav` (−14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −6 dB unter Stimme, −6 dB extra unter Clips.
9. `subs.py . <out>` — `subtitles.srt` + `subtitles.ass` (eine Zeile, ≤ 34 Zeichen, FontSize 19 auf 384x288, Outline 1.4, MarginV 20; Zahlen als Ziffern).

## Ergebnisse
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3` (128k).
Groß (Scratch `/tmp/claude-0/f66/audio/`): `mix.wav` (48 kHz, Endmischung), `mix.m4a`, `vo_master.wav` (VO + Clip-Ton, Hörfassung), `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/` (Takes + Alignment).

Dauer 623.92 s (10:23.9), VO-Ende 604.92 s. Slots: C1 55.30–70.27 · C2 231.37–240.80 · C3 311.76–325.33 · C4 461.62–474.46.
