# Film 02 · The Curve You Can't See

Second film (about the exponential curve), built in code: illustrated plates split into depth layers, motion-design scenes drawn in Canvas 2D, VO by George (ElevenLabs v4), ElevenLabs Music cues, Mirelo SFX.

Large assets (plates, audio, renders) live in `/mnt/project-files/scenario/film-02-exponential/`; this folder holds the code.

- `engine.mjs` renderer primitives (plates + 2.5D camera, figures, type, transitions, `Film`)
- `scenes/md.mjs` motion-design scenes
- `film.mjs` shot list anchored to VO word times (`audio/timing.json`) + sound plan
- `render.mjs` frames → ffmpeg (`--snap` for review stills)
- `render_all.sh` parallel chunks → concat → mux mix → burn subtitles
- `audio/build_vo.py` VO takes → `vo_master.wav` + `timing.json`
- `audio/mix.py` VO + ducked music + SFX → `mix.wav` at −14 LUFS
- `audio/subs.py` `subtitles.srt` / `subtitles.ass`
- `tools/key.py` green-screen keyer for near layers; `tools/grab_tts.py`, `tools/grab_ids.py` pull TTS timestamps from session logs

Rebuild: `python3 audio/build_vo.py $A/audio $A/audio && node -e "…write sound_plan.json…" && python3 audio/mix.py $A/audio && python3 audio/subs.py $A/audio $A && ./render_all.sh <out> 4` (A = the project-files folder).
