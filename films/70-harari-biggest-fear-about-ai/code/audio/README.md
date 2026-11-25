# Film 70 · Ton (audio/) · „Harari's Biggest Fear About AI Isn't Robots“

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 69 (`../../69-europe-can-still-win-the-ai-race/code/audio/README.md`). Daten-Root `$F70ROOT` = `/mnt/project-files/scenario/film-harari/`, Scratch `/tmp/claude-0/f70/audio/`. Stand 25.11.2026, fertig gemischt (nicht committet).

## Ablauf (Abweichungen von Film 69 fett)
1. `make_segments.py` — `<ROOT>vo-v3.txt` → `segments.json`: 22 Takes t00–t21 + 3 Clip-Slots hinter den Lead-ins (`CLIP_AFTER`: „Hear it from him.“ C1 · „…machines invent themselves.“ C2 · „Harari ends up in the same place.“ C3). **Die `[CLIP Cn: "…"]`-Zeilen in vo-v3 werden übersprungen; Stationen = Absätze (Leerzeilen), Kauf-Aufrufe M/A2 und die Brücke 3b mitten im Absatz über Anfangsworte; „December 2027“ wird als „twenty twenty-seven“ geschrieben (Aligner kann keine Ziffern; subs.py macht wieder 2027).** Ein Stimm-Tag pro Station (`TAGS`), keine Flüster-Tags (Assert). Nur im TTS-Text `say`: IPA für Yuval, Noah, Harari (AI kommt im Sprechtext nicht vor, Regel bleibt). **Slot-Länge = in..out aus `clips_cut.json`, nicht die ganze Datei (die hat ~1 s Vor-/Nachlauf).**
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301, alle 22 Takes im ersten Durchgang → `/tmp/claude-0/f70/audio/dl/vo-tNN.mp3` (URLs `fal_urls.txt`).
3. `align_ps.py . /tmp/claude-0/f70/audio/dl` — pocketsphinx-Forced-Alignment (`EXTRA`: harari, yuval, elon, chatbot(s), estonia, superintelligence). Hörprüfung: fal-ai/wizper über die ganze VO (`vo_only.mp3`, 619 s): alle Wörter da, nichts doppelt, Station und Reihenfolge stimmen.
4. `clips_wav.py` — Ton der Clips, zugeschnitten auf in..out (`clipwav/Cn.wav`, ganze Datei in `clipwav/full/`).
5. `build_vo.py . /tmp/claude-0/f70/audio` — `vo_master.wav`, `vo_only.wav`, `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (Leerzeile in vo-v3; **keine** vor/nach dem Kauf-Aufruf M und vor A2, dort steht in vo-v3 keine Leerzeile: `NO_STATION_PAUSE`), 0.6 s Luft um jeden Clip, `BREATH` = Atempausen für die SFX (4), END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild).
6. `clip_cues.py` — Clip-Untertitel: geprüfter Wortlaut aus `<ROOT>clips-geprueft.json` per pocketsphinx **auf die ganze Datei (mit Vor-/Nachlauf) ausgerichtet** (auf dem zugeschnittenen Clip bricht der Aligner ab) und um den Schnitt-Anfang verschoben → `clips_meta.json` (inkl. `gain_db`, `file_in_s`/`file_out_s`); `clips_json.py` → `clips.json`.
7. Musik: `music/prompts.json` (Lyria 3.5, 6 Tracks M0–M5, mystisch: Drones, Pads, Filzpiano, Glas, ferner Chor; Thema Vertrauenskette: Hände, Kartenleser, Brot, Kuh) + `music/cues.json`, URLs `music/urls.txt`. SFX nur in Pausen (`sound_plan.json`, 4 Akzente): 2× `card_beep` (Mirelo, „A beep.“ im Hook und im Schluss), 2× `ice_crack` (sfx-bibliothek: „…but with a crack.“, „Four cracks.“). `sfx_prompts.json`.
8. `mix.py . /tmp/claude-0/f70/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung bestanden (alle 4 OK).
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (≤ 34 Zeichen, Inter 19 auf 384×288); Zahlen als Ziffern (2027, 1.1 billion, 86%, 50 million, 20 minutes, 1 in 4, 8 in 10, 3 in 4, over 40), `BREAKS` für 10 Sätze.

Neulauf: `W=/tmp/claude-0/f70/audio; python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel`

## Ergebnis (25.11.)
- Länge **619.07 s (10:19.1)** · letztes VO-Wort 600.07 s · Endbild 604.07–619.07 s
- Kanal-Aufrufe: **t08 231.72–242.71** (Station M, Ende Kapitel Vertrag) · **t21 590.90–600.07** (Schluss)
- Clip-Slots (Harari, Originalton, Lead-in des Sprechers davor): C1 33.67–41.47 (7.80 s; Quelle 0:05,0 +0.65…8.45 der Datei) · C2 158.90–167.53 (8.63 s) · C3 531.43–540.06 (8.63 s) → **Clip-Anteil 4.05 %** (25.06 s)
- Clip-Pegel: `gain_db` C1 −1.0, C2 −1.7, C3 −2.0 → Clips −13.8 / −13.7 / −14.0 LUFS gegen −13.9…−14.6 der VO davor/danach (innerhalb ±1 LU)
- mix.wav −14.01 LUFS, −1.51 dBTP, LRA 4.0 · 366 Untertitel, längste Zeile 34
- fal-Kosten ≈ 1.37 USD (TTS 8302 Zeichen ≈ 0.66, Lyria 6 × 0.10 = 0.60, Mirelo 2 × 2 s ≈ 0.04, Wizper 6 Läufe ≈ 0.07)

## Hörprüfung · Auffälligkeiten
- VO (Wizper): Text deckt sich mit vo-v3. Einzige Abweichung: t05 „…the machine answers **alone**“ steht bei Wizper als „a loan“ (Homophon, Kontext „A loan.“ folgt direkt); gesprochen klingt beides gleich, kein Eingriff.
- Take-Enden: letzte 100 ms −44…−84 dBFS; t07, t09, t12, t16, t17, t21 liegen bei −44…−53 dB (leiser Ausklang, kein Wortverlust; die letzten Wörter stehen alle im Wizper-Text).
- Clips (Wizper auf den zugeschnittenen Ton): C2 und C3 wörtlich wie `clips-geprueft.json` (C3 „humans' problems“ ≈ „humans problems“); C1 hört Wizper am Ende als „…like AI creating a virus or **virus**“ statt „killer robots“. Auf der ganzen Datei (mit Vor-/Nachlauf) erkennt Wizper „…a virus or killer robots. It's“; der Schnitt liegt 0.25 s nach dem Wortende in der Pause (Pegel −54…−70 dB), die Wörter sind also im Ton, die Abweichung ist ein Wizper-Artefakt am Dateiende. Bitte „killer robots“ in C1 am Schnittplatz einmal anhören.
- Sprecher: in allen drei Clips spricht Harari (Quelle laut Clip-Liste; C3 zeigt in den ersten ~2 s Suleyman im Bild, Harari aus dem Off).
- C1 „collective dementia“ sagt Harari im Clip NICHT (so auch in clips-geprueft.json); der Sprecher sagt es danach als eigene Zeile („His word for it: collective dementia.“). Faktencheck/Text hat das Wort der Quelle zugeschrieben (ČT), nicht diesem Clip.
- C2 hat das Economist-„E“-Logo oben links im Bild (Bild-Schritt).

## Dateien
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f70/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`, `chk/`.
