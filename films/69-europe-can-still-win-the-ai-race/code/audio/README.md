# Film 69 · Ton (audio/) · „Europe Can Still Win the AI Race“

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 66, bei Abweichungen die Fassung aus Film 67. Daten-Root `$F69ROOT` = `/mnt/project-files/scenario/film-europa-ki/`, Scratch `/tmp/claude-0/f69/audio/`.

## Ablauf (Stand 24.11.2026, fertig gemischt)
1. `make_segments.py` — `<ROOT>vo-v3.txt` (Faktencheck final, inkl. Z. 86 „One satellite maker …“) → `segments.json`: 22 Takes t00–t21 (eine Station = ein oder mehrere Takes, ≤ 520 Zeichen) + 5 Clip-Slots hinter den Lead-ins (`CLIP_AFTER`: „he gave his own verdict:“ C1 · „Here's his warning:“ C2 · „really catching up:“ C3 · „listen to his point:“ C4 · „now says:“ C1b). Ein Stimm-Tag pro Station (`TAGS`), keine Flüster-Tags (Assert). Nur im TTS-Text `say`: AI → „A.I.“, IPA für Mistral, Mensch, Koerte, von der Leyen. Slot-Länge = `<ROOT>clips/Cn.mp4` (ffprobe).
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 (t14: Retake seed 4302), → `/tmp/claude-0/f69/audio/dl/vo-tNN.mp3` (URLs in `fal_urls.txt`).
3. `align_ps.py . /tmp/claude-0/f69/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json` (Zusatzwörter `EXTRA`, AI → a_i). Hörprüfung: fal-ai/wizper über die ganze VO, alle Wörter da, nichts doppelt; jedes Take-Ende still (letzte 100 ms < −70 dB) = nichts abgeschnitten.
4. `clips_wav.py /tmp/claude-0/f69/audio/clipwav` — Ton der ganzen Dateien `<ROOT>clips/Cn.mp4`.
5. `build_vo.py . /tmp/claude-0/f69/audio` — `vo_master.wav`, `vo_only.wav` + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (Leerzeile in vo-v3; keine nach dem Hook: `NO_STATION_PAUSE`), 0.6 s Luft um jeden Clip, `BREATH` = kleine Atempausen für SFX, END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild, nur Musik).
6. `clip_cues.py` — Clip-Untertitel: geprüfter Wortlaut aus `<ROOT>clips-geprueft.json` per pocketsphinx auf den Clip-Ton ausgerichtet → `clips_meta.json` (inkl. `gain_db`, s. u.). C4: das leise „Nobody.“ eines anderen Panelisten (~4,6 s) wird nicht untertitelt. Dann `clips_json.py` → `clips.json`.
7. Musik: `music/prompts.json` (Lyria 3.5 `google/lyria-3.5`, 6 Tracks M0–M5, mystisch: Drones, Pads, Filzpiano, Glas, ferner Chor; M0 = Prompt v2, v1 vom Inhaltsfilter abgelehnt) + `music/cues.json`, URLs in `music/urls.txt`. SFX: `sound_plan.json` (8 Akzente, nur in Pausen) aus `sfx-bibliothek` + 2 Mirelo-Sounds (`sfx_prompts.json`: kit_snap, pieces_scatter) → `/tmp/claude-0/f69/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f69/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3` (128k, nach `<ROOT>audio/`), Stems. Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung: hörbarer Teil eines Akzents auf einem Wort → Lauf bricht ab.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile ≤ 34 Zeichen, Inter 19 auf 384×288, Outline 1.4, MarginV 20; Zahlen als Ziffern, A.I. → AI; „,1000“-Fix).

Neulauf ohne neue Takes: `W=/tmp/claude-0/f69/audio; python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel`

## Ergebnis (24.11.)
- Länge 610.66 s (10:10.7) · letztes VO-Wort 591.66 s · Endbild 595.66–610.66 s · Kanal-Aufrufe t11 309.22–318.88, t21 580.05–591.66
- Slots: C1 96.98–105.45 · C2 198.83–208.22 · C3 351.49–361.86 · C4 460.53–475.70 · C1b 545.32–557.44 (Clip-Anteil 9.1 %)
- Clip-Pegel: `gain_db` C1 −1.4, C2 −0.9, C3 −0.7, C4 −0.9, C1b −2.0 → Clips im Mix innerhalb ±1 LU der VO davor/danach
- mix.wav −14.00 LUFS, −1.49 dBTP, LRA 4.0 · 344 Untertitel, längste Zeile 34
- fal-Kosten ≈ 1.40 USD (TTS ≈ 0.67, Lyria 0.60, Mirelo ≈ 0.09, Wizper ≈ 0.02)

## Dateien
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f69/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`.
