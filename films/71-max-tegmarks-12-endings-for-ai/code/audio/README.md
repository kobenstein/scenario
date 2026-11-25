# Film 71 · Ton (audio/) · „Max Tegmark's 12 Endings for AI“

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode wie Film 69 (66 / 67). Daten-Root `$F71ROOT` = `/mnt/project-files/scenario/film-tegmark/`, Scratch `/tmp/claude-0/f71/audio/`, Clip-Quellen `films/71-assets/clips/` (iMac-Push 8d827da).

## Ablauf (Stand 25.11.2026, fertig gemischt mit echten Clips)
1. `make_segments.py` — parst `<ROOT>text-v2.md` (von Jakob freigegeben 25.11.): `[` … `]`-Blöcke mit den `## `-Stationen, einzeilige `[BILD …]`, `[CLIP Cn …]`, `[PAUSE 1 s]` sind Regie; alles andere = Sprechertext, Assert: Zeile für Zeile = `<ROOT>vo-v2.txt`. → `segments.json`: 29 Takes t00–t28 (≤ 520 Zeichen, ausgewogen geteilt) + 5 Clip-Slots C1, C2, C4, C5, C6 (C3 nicht im Film) an den `[CLIP]`-Zeilen. Ein Stimm-Tag pro Station (`TAGS`), keine Flüster-Tags (Assert). Nur im TTS-Text `say`: AI → „A.I.“. Slot-Länge = ffprobe von `<scratch>/cut/Cn.mp4`.
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 → `/tmp/claude-0/f71/audio/dl/vo-tNN.mp3` (URLs in `fal_urls.txt`). Namenskontrolle per Wizper (Tegmark, Hugging Face, Ball, Altman, Malta, Amish, Orwell, Nineteen Eighty-Four, MIT, ChatGPT): alle 1499 Wörter da, Namen ok, kein Retake nötig.
3. `align_ps.py . /tmp/claude-0/f71/audio/dl` — pocketsphinx-Forced-Alignment (Zusatzwörter `EXTRA`, AI → a_i).
4. `cut_clips.py` — schneidet die fünf Clips aus den iMac-Fenstern `films/71-assets/clips/Cn.mp4` → `<scratch>/cut/Cn.mp4` (H.264 CRF 18 bildgenau + AAC 192k, loudnorm −20 LUFS, Fades 30/60 ms) + `cut_clips.json` (In/Out je Clip, für den Bild-Schritt: gleicher Schnitt aus derselben Quelle). Grenzen per 20-ms-RMS + Whisper-Wortzeiten geprüft (Begründung im Docstring):
   - C1 21.50–28.85 · C2 51.45–59.55 (Start nach dem „my my my“-Stottern, beginnt mit „My P(doom)“) · C4 17.72–24.15 · C5 31.30–39.40 · C6 20.10–28.35 (iMac 19.5 hätte das Ende von „road.“ mitgenommen; leichter Expander gegen den Hall-Boden).
5. `clips_wav.py /tmp/claude-0/f71/audio/clipwav` — Ton der Schnitte als 48k-WAV.
6. `build_vo.py . /tmp/claude-0/f71/audio` — `vo_master.wav`, `vo_only.wav` + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (keine nach dem Hook), `[PAUSE 1 s]` = +1 s, 0.6 s Luft um jeden Clip, `BREATH` = kleine Atempausen für SFX, END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild, nur Musik).
7. `clip_cues.py` — Clip-Untertitel (Wortlaut aus `clips-geprueft-imac.json`, korrigiert aufs Gesprochene) per pocketsphinx auf den Clip-Ton → `clips_meta.json` (inkl. `gain_db`), dann `clips_json.py` → `clips.json`.
8. Musik: `music/prompts.json` (Lyria 3.5, M0–M5: dunkel 12–8, Wende bei 7/Abo, wärmer bis 1, ruhiger Schluss) + `music/cues.json`, URLs in `music/urls.txt`. SFX: `sound_plan.json` (9 Akzente nur in Pausen: 4× stamp, tick, screen_off, hatch_door, door, shimmer_rings) aus `sfx-bibliothek/akzent`, keine neuen SFX (`sfx_prompts.json`).
9. `mix.py . /tmp/claude-0/f71/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3` (nach `<ROOT>audio/`). Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung bricht ab, wenn ein Akzent auf ein Wort fällt.
10. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile ≤ 34 Zeichen, Inter 19 auf 384×288; Zahlen als Ziffern, A.I. → AI).

Neulauf ohne neue Takes: `W=/tmp/claude-0/f71/audio; python3 cut_clips.py && python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel` (mix.py läuft ≈ 3 min).

## Ergebnis (25.11.)
- Länge 706.65 s (11:46.7) · letztes VO-Wort 687.65 s · Endbild 691.65–706.65 s · Kanal-Aufrufe t13 336.86–347.42, t28 679.27–687.65
- Slots: C1 39.92–47.28 · C2 129.15–137.27 · C4 279.96–286.42 · C5 602.51–610.62 · C6 663.04–671.30 (Clip-Anteil 5.4 %)
- Clip-Pegel: `gain_db` C1 −1.3, C2 −0.5, C4 0, C5 −0.6, C6 −3.4 → im Mix +0.45 / +0.15 / +0.15 / +0.15 / +0.3 LU gegen die VO davor/danach
- mix.wav −14.01 LUFS, −1.49 dBTP, LRA 3.7 · 398 Untertitel, längste Zeile 34
- fal-Kosten ≈ 1.35 USD (TTS ≈ 0.7, Lyria ≈ 0.6, Wizper/Whisper ein paar Cent)

## Abweichungen vom Skript / zu prüfen
- Faktenfix 25.11. (Koordinator): „Thirty-one countries now call …“ → „About thirty countries now call …“ in text-v2.md, vo-v2.txt, hoerfassung-v2.txt; nur Take t25 neu (gleiche Stimme, seed 4301, Wizper-Kontrolle ok). Alles vor t25 (bis 611.29 s) unverändert, t25 neu getimt, ab t26 alles +0.64 s (C6, Schluss, Endbild).
- C1: Tegmark sagt „lost control **over** AI systems“ (text-v2 / iMac-json: „of“). Untertitel = Gesprochenes („over“).
- C2: Schnitt beginnt mit „My P(doom) is very low.“ (Untertitel mit „My“).
- C6: In-Punkt 20.10 statt iMac 19.5 (sonst Ende von „road.“ im Clip).
- Gesamtlänge 11:46, ≈ 24 s länger als die Schätzung 11:22 in text-v2 (echte Takes + Pausen + 15-s-Endbild).

## Dateien
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `STATUS.txt`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f71/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, Stems, `cut/` (Clip-Schnitte), `clipwav/`, `music/M0–M5`, `sfx/`, `dl/`.
