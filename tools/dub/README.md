# Dubbed audio tracks (YouTube multi-language audio)

Builds a foreign-language audio track that fits an already published film: same picture, same music and SFX stems, George's voice in the target language. First used for "AI Progress Is Going Vertical" (Spanish, German); outputs in `/mnt/project-files/scenario/film-02-exponential/v2/dub/`.

1. `en_lines.json`: the film's English VO split into lines, each with its start/end time from the film's `timing.json` (one entry per spoken line).
2. `<lang>.txt`: translation, `## <section id>` then exactly one line per English line (keeps the line-to-picture anchors). Keep lines about as long as the English when spoken.
3. `sections.py <dub_dir> <lang>` -> `<lang>_sections.json` (one TTS text per section, lines joined by newlines).
4. TTS per section on fal `fal-ai/elevenlabs/tts/eleven-v4`, voice George, stability 0.4, `language_code`, `timestamps: true`. Save `vo-<id>.mp3` per section.
   The MCP wait_for_jobs answer drops results over ~80k chars: wait on 3-4 jobs at a time so the answer lands in a tool-results file, then `grab.py <file> <dub_dir>` writes `ts-<id>.json`.
5. `assemble.py <dub_dir> <lang> <duration>`: each dubbed line starts at its English line's start; long lines may start up to 0.7 s early, are sped up to 1.12x, and only then push the next line. Writes `vo_master.wav`, `timing.json`, `report.txt`.
6. `mix.py <dir>` (copy of the film's mix: ducked music cues + sound plan, -14 LUFS). The dir needs `vo_master.wav`, `timing.json` (duration), `sound_plan.json`, `music/`, `sfx/`. Running it with the English VO reproduces the published mix (corr 0.9999).
7. `srt.py <lang>/timing.json <out.srt>`: subtitles in the dubbed language.

Cost: about 0.80 $ of TTS per language for a 12-minute film.
