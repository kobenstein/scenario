# Film 41 · Ton (audio/)

Gehört dem Ton-Schritt; der Bild-Code fasst diesen Ordner nicht an. Methode 1:1 wie Film 67 (`films/67-.../code/audio/`), Daten-Root `$F41ROOT` = `/mnt/project-files/scenario/film-bill-gates/`, Scratch `/tmp/claude-0/f41/audio/`.

## Ablauf (Stand 24.11.2026)
1. `make_segments.py` — `<ROOT>vo-v4.txt` → `segments.json` (25 Takes absatzweise, ≤ 520 Zeichen; Slots an den `CLIP: [CLIP Cn …]`-Zeilen; die Zeile `KARTE: [ZITATKARTE …]` wird nicht gesprochen und bekommt keinen Slot — die nächste Zeile spricht das Zitat, der Take trägt `card: C4`). Sektionen wie `code/tools/provisional_timing.py`: H 1 2 3 4 M 5 6 7 A2. Sparsame Regie-Tags (`DIRECT`: calm, conversational / thoughtful / curious / wry / warm), keine Flüster-Tags (Assert). `[pause]`-Zeilen kommen vor die nächste Zeile. Aussprache nur im TTS-Text `say`: Etzioni /ɛtˈsjoʊni/.
   Slot-Länge = echte Datei `films/41-assets/clips/Cn.mp4` (ffprobe): C1 10.91 · C2 12.98 · C3 8.51 s. `C4-alt-*` werden ignoriert.
2. Stimme: fal `elevenlabs/tts/eleven-v4`, voice `akQnlreIUIoJxrTrosJj`, stability 0.3, similarity 0.75, seed 4301, mp3_44100_192 → `/tmp/claude-0/f41/audio/dl/vo-tNN.mp3` (Download-URLs in `fal_urls.txt`).
2b. Abhör-Check: alle Takes + Clips hintereinander (`asr/all.mp3`) durch `fal-ai/elevenlabs/speech-to-text` (Scribe) und gegen Skript/Wortlaut verglichen (difflib). Ergebnis 24.11.: alle Wörter da, Etzioni erkannt; nur t09 „So he's warning“ (Skript „he is“), C3 klingt für Scribe wie „you'll“ — Wortlaut bleibt laut clips-geprueft.json „it'll“.
3. `align_ps.py . /tmp/claude-0/f41/audio/dl` — pocketsphinx-Forced-Alignment → `dl/vo-tNN.json` (OOV: superintelligence, ChatGPT, deafened; bei fehlendem letzten Wort zweiter Versuch mit 0,5 s Stille dahinter, t23). Gegen Scribe-Zeiten geprüft: Median −0,06 s.
4. `clips_wav.py /tmp/claude-0/f41/audio/clipwav` — Ton der fertigen Clips `films/41-assets/clips/C1–C3.mp4` → wav, auf −20 LUFS (loudnorm zweistufig, linear), Fades 30/60 ms. Die mp4s gehören dem Clip-Schritt und bleiben unangetastet.
5. `build_vo.py . /tmp/claude-0/f41/audio` — `vo_master.wav`, `vo_only.wav` (scratch) + `timing.json`, `slots.json` (hier und nach `<ROOT>audio/`). END_TAIL 19 s (≈4 s Luft + 15 s Endbild). Zitatkarte C4: `kind: card`, `under: true`, `text` = Zitat, Zeit = die vom Sprecher gelesenen Zitatwörter.
6. `clips_json.py` — `clips_meta.json` (Sprecher, Quelle, Wortlaut aus clips-geprueft.json, Cue-Zeilen nach Scribe-Wortzeiten) → `clips.json` (mix.py + subs.py).
7. Musik: `music/prompts.json` (Lyria 3.5, `google/lyria-3.5`, 6 Tracks M0–M5, geheimnisvoll: Drones, Pads, Klavier, Glas, ferner Chor; URLs in `music/urls.txt`) + `music/cues.json`; SFX: `sound_plan.json`, 7 kurze Akzente nur in Satzpausen (paper_slide, rail_ping, bloom, stamp, paper_pop, shimmer_rings, chime, alle aus `sfx-bibliothek/akzent`, mit `d` auf die Pause gekürzt) → `/tmp/claude-0/f41/audio/sfx/`.
8. `mix.py . /tmp/claude-0/f41/audio` — `mix.wav` (−14 LUFS, TP ≤ −1 dBTP), `mix.m4a`, `mix_preview.mp3`, Stems. Musik −6 dB unter Stimme, −6 dB extra unter Clips.
9. `subs.py . untertitel` — `subtitles.srt` + `subtitles.ass` (eine Zeile, ≤ 34 Zeichen; A.I. → AI, Zahlen als Ziffern: 3 years, 3 stops, 19 percent, 2 to 8 years, 20 years, 40 percent; Clip-Zeilen wörtlich aus clips-geprueft.json).

Hörfassung: `mix_preview.mp3` → `/mnt/project-files/hoerfassungen/41-bill-gates-changed-his-mind-elevenlabs-v4.mp3` (normales Tempo, keine 1,5-fach-Kopie: die gilt nur für Kokoro-Vorschauen). Der Netz-Mount schreibt ein eigenes ID3-Tag dazu (Größe weicht ab, Ton identisch).

## Neulauf (z. B. neue Clip-Schnitte, keine neuen Takes)
```
cd films/41-bill-gates-on-work/code/audio; W=/tmp/claude-0/f41/audio
python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clips_json.py && python3 mix.py . $W && python3 subs.py . untertitel
```
make_segments.py nur neu laufen lassen, wenn sich das Skript nicht geändert hat (sonst passen die Takes in `dl/` nicht mehr).

## Ergebnisse
Klein (Netz-Mount `<ROOT>audio/`): `timing.json`, `slots.json`, `STATUS.txt`, `untertitel/subtitles.srt`, `untertitel/subtitles.ass`, `mix_preview.mp3`.
Groß (Scratch `/tmp/claude-0/f41/audio/`): `mix.wav`, `mix.m4a`, `vo_master.wav`, `vo_only.wav`, `stem_music.wav`, `stem_sfx.wav`, `premix.wav`, `music/M0–M5.mp3`, `sfx/`, `clipwav/`, `dl/`, `asr/`.

Kosten 24.11.: Stimme 8.126 Zeichen ≈ 0,65 $ · Scribe-Check 10,3 min ≈ 0,31 $ · Lyria 6 × 0,10 $ = 0,60 $ → ≈ 1,56 $.
