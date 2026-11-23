# Film 49 · Ton (audio/)

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 66 (`films/66-.../code/audio/`), Daten-Root `$F49ROOT` = `/mnt/project-files/scenario/film-vorbereiten/`, Scratch `/tmp/claude-0/f49/audio/`.

## Ablauf (Stand 23.11.2026)
1. `make_segments.py` — `<ROOT>vo-v8.txt` (1.392 Wörter) → `segments.json` (23 Takes t00–t22, ≤ 520 Zeichen, `[pause]` = Take-Grenze + 1.2 s Luft; 4 Clip-Slots C13/C5/C16/C2 an den Markern, bis die echten Clips da sind als stille Platzhalter 8/10/10/8 s; „AI“ → „A.I.“; IPA nur im TTS-Text `say` für Brynjolfsson und Nobel; Harari/Yuval ohne IPA korrekt; Amodei kommt in v8 nicht vor).
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 (t02/t11 4302), mp3_44100_192 → `dl/vo-tNN.mp3` (URLs in `fal_urls.txt`). Tags sparsam (calm / warm / amazed), kein whisper.
   ASR-Prüfung aller Takes mit `fal-ai/wizper`; neu aufgenommen: t02 („He's“ statt „He is“), t11 („But“ fehlte), t19 („noble-level“ → IPA für Nobel). Erste Fassungen in `dl/first/`.
3. `align_ps.py . /tmp/claude-0/f49/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json`.
4. `clips_wav.py /tmp/claude-0/f49/audio/clipwav` — Ton der fertig geschnittenen `<ROOT>clips/Cn.mp4` (fehlt die Datei: stiller Platzhalter, alte wav wird entfernt).
5. `build_vo.py . /tmp/claude-0/f49/audio` — `vo_master.wav`, `vo_only.wav` (Scratch) + `timing.json`, `slots.json`. Slot-Länge = echte Clip-Länge (ffprobe), sonst Platzhalter; alles danach rückt nach. END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild).
6. `clips_json.py` — `clips.json` (nur wenn `<ROOT>clips-geprueft.json` existiert; Clip-Untertitel ≤ 34 Zeichen aus den Wortzeiten). Bleibt NUR hier.
7. Musik: `music/prompts.json` (Lyria 3.5, `google/lyria-3.5`, M0 Hook · M1 Kern/Hochzeit · M2 Kap. 2, 3, M · M3 Kap. 4, 5 · M4 Kap. 6 · M5 Kap. 7, A2 + Endbild) + `music/cues.json`. Ist ein Kapitel länger als der Track, verlängert `mix.py` ihn mit einer Wiederholung aus der Mitte (Crossfade).
   SFX: `sound_plan.json` (Nachthimmel-Atmo im Hook aus `sfx-bibliothek`; je Countdown-Jahr ein heller Stufen-Ton step5…step1, Mirelo, siehe `sfx_prompts.json` inkl. ffmpeg `make_steps`).
8. `mix.py . /tmp/claude-0/f49/audio` — `mix.wav` (−14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −6 dB unter der Stimme.
9. `subs.py . untertitel/` — `subtitles.srt` + `subtitles.ass` (eine Zeile, ≤ 34 Zeichen, FontSize 19, Zahlen als Ziffern, „,1000“-Fix aus PR #12 drin).
10. `publish.sh [v8]` — Hörfassung (128k) + kleine Dateien auf den Mount, 10 s warten, prüfen (Text: Größe; mp3: md5 des dekodierten Tons, weil der Store ein C2PA-Manifest in die mp3 schreibt).

## Echte Clips einsetzen (OHNE die Stimme neu aufzunehmen)
Sobald `<ROOT>clips/C13.mp4`, `C5.mp4`, `C16.mp4`, `C2.mp4` (exakt geschnitten) und optional `<ROOT>clips-geprueft.json` liegen:

    cd films/49-you-have-five-years-before-superintelligence/code/audio && bash slots_update.sh v9

(anderer Root: `F49ROOT=/pfad/ bash slots_update.sh v9`). Läuft clips_wav → build_vo → clips_json → mix → subs → publish; schreibt `<ROOT>audio/*` neu und `hoerfassung-v9.mp3` (+ Kopie in `hoerfassungen/`). Fehlende Clips bleiben stille Platzhalter.
Voraussetzung: Scratch `/tmp/claude-0/f49/audio/` mit `dl/` (Takes + json), `music/`, `sfx/`. Ist er weg: Takes und M0–M5 aus `fal_urls.txt` per curl neu laden, `align_ps.py` laufen lassen, Stufen-Töne nach `sfx_prompts.json` (`make_steps`) und `nightsky` aus der sfx-bibliothek neu anlegen.

## Ergebnisse
Klein (Mount): `<ROOT>audio/timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`; `<ROOT>hoerfassung-v8.mp3`; `/mnt/project-files/hoerfassungen/#49 You Have Five Years - Hoerfassung v8.mp3`.
Groß (Scratch): `mix.wav`, `mix.m4a`, `vo_master.wav`, `vo_only.wav`, Stems, `premix.wav`, `music/`, `sfx/`, `clipwav/`, `dl/`.

Stand v8 (Platzhalter-Slots): Dauer 592.3 s (9:52.3), VO-Ende 573.3 s, Endbild 577.3–592.3. Slots: C13 75.64–83.64 · C5 252.00–262.00 · C16 313.56–323.56 · C2 474.19–482.19. Stufen-Töne bei 101.2 / 186.3 / 280.7 / 358.9 / 445.0 s. Mix −14.00 LUFS, TP −1.51 dBTP, LRA 4.9.
