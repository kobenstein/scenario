# Film 76 · Ton (audio/)

Stand 25.11.2026 (#76 "Your Kids Will Grow Up With Superintelligence"): Stimme 28 Takes (`<ROOT>vo-v3.txt`, ROOT `/mnt/project-files/scenario/film-76-kinder/`; t06–t08 nach der Skriptänderung Z.47/51 neu erzeugt, 0 Qualitäts-Retakes),
Musik Lyria 3.5 M0 M1 M3 M4 M5 (`music/prompts.json`, `music/urls.txt`, `music/cues.json`; M2 wurde vom Content-Filter abgelehnt, an der Stelle (M, 18) läuft M0 erneut),
SFX aus `sfx-bibliothek` (`sound_plan.json`: Küchen-Bett kitchen am Anfang und am Schluss, Akzente chime/heartbeat/bloom nur in Satzpausen),
Clips C1 Gopnik · C2 Susskind (Oxford Martin) · C4 Acemoglu · C5 Susskind (RSA), Schnitt `cut_clips.py` aus `films/76-assets/clips/Cn.mp4` nach `/tmp/claude-0/f76/clips/` bzw. `<ROOT>clips/`
(die Quelldateien in 76-assets bleiben unverändert, der Bild-Code `tools/f76_clips.py` liest sie dort), `clips_meta.json` → `clips.json`, Mix −14 LUFS (`mix.py`), Untertitel `subs.py` (eine Zeile ≤ 34 Zeichen, Jahreszahlen als Ziffern).
Scratch: `/tmp/claude-0/f76/audio/`. Sektions-IDs für den Bild-Code: H, 0, 6, 12, M, 18, 30, T, S, A2. Der Rest unten ist die Methode aus Film 67/68 (Pfade sinngemäß f67 → f76, ROOT film-76-kinder).

# Film 67 · Ton (audio/)

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 66 (`films/66-.../code/audio/`), Daten-Root `$F67ROOT` = `/mnt/project-files/scenario/film-si-arriving/`, Scratch `/tmp/claude-0/f67/audio/`.

## Ablauf (Stand 23.11.2026)
1. `make_segments.py` — `<ROOT>vo-v2.txt` → `segments.json` (25 Takes absatzweise, ≤ 520 Zeichen; Slots an den `[CLIP Cn]`-Zeilen; Regie-Tags des Skripts bleiben, keine Flüster-Tags (Assert); Aussprache nur im TTS-Text `say`: Alexandr → „Alexander“, Wang /wɑːŋ/, Riemann /ˈriːmɑːn/, Yann LeCun /jæn ləˈkʌn/, Tao /taʊ/; Maynard, Lean, M.I.T. wie geschrieben).
   Slot-Länge = echte Datei `films/67-assets/clips/Cn.*` (ffprobe), sonst Platzhalter C1 10 · C2 8 · C3 10 · C4 8 s (`placeholder: true`, stumm).
   **C0 (Mathematiker) nachrüsten:** `F67_C0="listen to the mathematician himself." python3 make_segments.py` setzt einen Slot hinter die Zeile, die so endet (oder `[CLIP C0]` ins Skript schreiben). Länge aus `clips/C0.*`, sonst 10 s.
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301, mp3_44100_192 → `/tmp/claude-0/f67/audio/dl/vo-tNN.mp3` (Download-URLs in `fal_urls.txt`).
3. `align_ps.py . /tmp/claude-0/f67/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json`.
3b. `cut_clips.py` — schneidet C1–C4 aus den 60-s-Fenstern `films/67-assets/clips/Cn-<name>.mp4` (clips.md) → `clips/Cn.mp4` (Video bleibt fürs Bild; Ton auf −20 LUFS, Fades 30/60 ms; Grenzen per RMS-Scan + Whisper geprüft). C0 (Alpöge) bekommt KEINEN Ton-Slot, nur Bild.
4. `clips_wav.py /tmp/claude-0/f67/audio/clipwav` — Ton der geschnittenen Clips aus `films/67-assets/clips/Cn.*` (fehlende Datei = stummer Platzhalter).
5. `build_vo.py . /tmp/claude-0/f67/audio` — `vo_master.wav`, `vo_only.wav` (scratch) + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). END_TAIL 19 s (≈4 s Luft + 15 s Endbild).
6. `clips_json.py` — `clips_meta.json` (Sprecher, Quelle, exakte Cue-Zeilen nach Whisper-Wortzeiten) → `clips.json` (mix.py + subs.py).
7. Musik: `music/prompts.json` (Lyria 3.5, `google/lyria-3.5`, 6 Tracks M0–M5, URLs in `music/urls.txt`) + `music/cues.json`; SFX: `sound_plan.json`, alles aus `sfx-bibliothek` (stamp, pages, shimmer_rings, chime, tick, atmo hall) → `/tmp/claude-0/f67/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f67/audio` — `mix.wav` (−14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −6 dB unter Stimme, −6 dB extra unter Clips.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile, ≤ 34 Zeichen; A.I. → AI, M.I.T. → MIT, Zahlen als Ziffern).

## Echte Clips einsetzen (schneller Neulauf, keine neuen Takes)
```
git pull   # films/67-assets/clips/C1..C4.*
cd films/67-.../code/audio; W=/tmp/claude-0/f67/audio
python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 mix.py . $W && python3 subs.py . untertitel
```
Danach verschieben sich alle Zeiten hinter einem Slot um (echte − Platzhalter-Länge); `timing.json` / `slots.json` in `<ROOT>audio/` werden überschrieben.

## Ergebnisse
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `STATUS.txt`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f67/audio/`): `mix.wav`, `mix.m4a`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`.
