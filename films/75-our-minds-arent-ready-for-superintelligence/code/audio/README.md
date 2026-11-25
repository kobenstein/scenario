# Film 75 · Ton (audio/) · „Our Minds Aren't Ready for Superintelligence“

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 69. Daten-Root `$F75ROOT` = `/mnt/project-files/scenario/film-75-godlike/` (nur gelesen: vo-v5.txt), Clip-Quellen `/tmp/claude-0/f75/clips/`, Scratch `/tmp/claude-0/f75/audio/` (alle großen Dateien). Nichts wird in den Daten-Root kopiert (`F75_ROOT_COPY=1` schaltet die Kopie von timing.json, slots.json, mix_preview.mp3 nach `<ROOT>audio/` ein).

## Ablauf (Stand 25.11.2026, fertig gemischt)
1. `make_segments.py` — `<ROOT>vo-v5.txt` (Zweitprüfung 25.11.) → `segments.json`: 21 Takes t00–t20 (≤ 560 Zeichen, ein Take bleibt in einer Station) + 3 Clip-Slots an den `[CLIP …]`-Zeilen (C2 Bengio, K1 Wilson, C1 Harari; die Zeilen werden nicht gesprochen). Stationen H · 1 · 2 · M · 3 · 4 · 5 · A2 (wie tools/provisional_timing.py). Ein Stimm-Tag pro Station (`TAGS`), keine Flüster-Tags (Assert). Nur im TTS-Text `say`: AI → „A.I.“, UN → „U.N.“, IPA für Hassabis. Slot-Länge = `cuts.json` out_s − in_s.
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301 → `/tmp/claude-0/f75/audio/dl/vo-tNN.mp3` (URLs in `fal_urls.txt`). Zuerst vo-v4 eingesprochen; nach der Zweitprüfung (vo-v5, 7 Zeilen) nur t04 t07 t08 t13 t14 t16 t17 neu (alte Takes in `dl/v4/`).
3. `align_ps.py . /tmp/claude-0/f75/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json` (Zusatzwörter `EXTRA`, AI → a_i, UN → u_n). Hörprüfung: fal-ai/wizper über vo_master und über die fertige Mischung: alle Wörter da, nichts doppelt, Hassabis/UN richtig; jedes Take-Ende still (≥ 0,15 s nach dem letzten Laut, letzte 100 ms ≤ −58 dB).
4. `clips_wav.py /tmp/claude-0/f75/audio/clipwav` — schneidet die Clip-Quellen bei `cuts.json` in_s/out_s → `clipwav/<id>.wav` und prüft beide Schnittpunkte (10-ms-Rahmen < −50 dBFS, sonst Abbruch). Schnitte (aus clips_zeiten.txt, nachgeschärft): C2 6.08–17.50 (6.30 hätte das „C“ von „Citizens“ abgeschnitten) · K1 13.02–29.10 („modern“ beginnt bei 13.42, 12.40–12.98 ist ein Atem) · C1 9.38–26.81 („And we don't…“ folgt bei 26.83, nicht im Film).
5. `build_vo.py . /tmp/claude-0/f75/audio` — `vo_master.wav`, `vo_only.wav` + `timing.json`, `slots.json`. LEAD 0.6 s, Take-Lücke 0.75 s, Stationspause 1.3 s (Leerzeile in vo-v5; keine nach dem Hook: `NO_STATION_PAUSE`), 0.6 s Luft um jeden Clip, `breaths.json` = kleine Atempausen für die SFX (Schlüssel = die Phrase nach der Pause, `^` = vor dem Take), END_TAIL 19 s (≈ 4 s Luft + 15 s Endbild, nur Musik).
6. `clip_cues.py` — Clip-Untertitel: Original-Wortlaut (`cuts.json` transcript) per pocketsphinx auf den Clip-Ton ausgerichtet → `clips_meta.json` (erstes/letztes Wort, `gain_db` aus optionalem `clip_gain.json`, hier keins: Clips liegen 0,3–0,5 LU über der VO). Dann `clips_json.py` → `clips.json`.
7. Musik: `music/prompts.json` (Lyria 3.5 `google/lyria-3.5`, 6 Tracks M0–M5 = H | 1 | 2+M | 3 | 4 | 5+A2+Endbild; dunkel/mystisch: Drones, Pads, Filzpiano, Cello, Glas, ferner Chor; keine Celesta) + `music/cues.json` (M3 per Splice 60→80 s verlängert; Gain-Rider 0.5–0.7 gegen die Lyria-Steigerungen), URLs in `music/urls.txt`. SFX: `sound_plan.json` (8 Akzente, nur in Pausen) aus `sfx-bibliothek` (phone_buzz, heartbeat ×2, stone_click, stamp, tick, shimmer_rings) + 1 Mirelo-Sound (`sfx_prompts.json`: racing_ticks) → `/tmp/claude-0/f75/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f75/audio` — `mix.wav` (48 kHz, −14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −26 dB, −6 dB unter Stimme, −6 dB extra unter Clips. SFX-Überlappungsprüfung (hörbarer Teil eines Akzents auf einem Wort → Abbruch) und Clip-Lautheit gegen die VO davor/danach.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile ≤ 34 Zeichen, Inter 19 auf 384×288, Outline 1.4, MarginV 20; Zahlen als Ziffern, A.I. → AI; „E. O. Wilson“ bleibt ein Satz; Clip-Passagen mit Original-Wortlaut).

Neulauf ohne neue Takes: `W=/tmp/claude-0/f75/audio; python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel`

## Ergebnis (25.11.)
- Länge 631.83 s (10:31.8) · letztes VO-Wort 612.83 s · Endbild 616.83–631.83 s · Kanal-Aufrufe t09 255.46–265.73, t20 602.32–612.83
- Slots: C2 102.72–114.14 · K1 170.82–186.90 · C1 290.16–307.59 (Clip-Anteil 7.1 %). Erstes/letztes Clip-Wort: C2 102.78/113.99 · K1 171.22/186.67 · C1 290.16/307.59
- mix.wav −14.01 LUFS, −1.57 dBTP, LRA 3.6 · 353 Untertitel, längste Zeile 34
- fal-Kosten ≈ 1.57 USD (TTS ≈ 0.90 inkl. 7 Retakes für vo-v5, Lyria 0.60, Mirelo 0.04, Wizper ≈ 0.03)

## Für das Bild
- `timing.json` ist die Taktvorgabe (Format wie Film 69: duration, levels, sections, clips, slots, end_screen, channel_calls, words).
- Clip-Schnitte im Bild = `cuts.json` / `clips.json` file_in_s–file_out_s (Slot-Länge = Schnittlänge, kein +0.3 s): C2 6.08–17.50, K1 13.02–29.10, C1 9.38–26.81.

## Dateien
Klein (Repo, dieser Ordner): `timing.json`, `slots.json`, `segments.json`, `cuts.json`, `breaths.json`, `clips_meta.json`, `clips.json`, `sound_plan.json`, `sfx_prompts.json`, `music/`, `fal_urls.txt`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`.
Groß (Scratch `/tmp/claude-0/f75/audio/`): `mix.wav`, `mix.m4a`, `mix_preview.mp3`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`.
