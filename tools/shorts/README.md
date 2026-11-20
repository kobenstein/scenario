# Shorts (9:16)

1. `python3 ranges.py` picks each Short's time range from the film's .srt (cue boundaries) -> `ranges.json`.
2. Clean picture (no burned subtitles) per range from each film's own code renderer (branches: Folge 1 `yj91c5` film/code/render.js, Film 2 `feyj7f` film2.mjs, Folge 3 `05jlmn` film.mjs) -> `clean/<id>.mp4`; commands in `jobs.txt`.
3. `CANVAS_FROM=<dir with @napi-rs/canvas> node --expose-gc compose.mjs <id>` reframes to 1080x1920 with keyframes from `shorts.json`
   (`[t, scale, cx, cy]`: scale 1.78 fills the frame, 1.0 shows a square band over a blurred extension, 0.56 the whole 16:9 frame),
   adds the headline claim, big captions (cues split into short chunks, `fix` replaces spoken numbers with digits),
   the "Watch the full film" pill and cuts the audio from the finished long-form mix. `--snap 1,5` writes review stills.
