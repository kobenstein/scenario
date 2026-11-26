# #NN · Working title

Copy this folder to `films/NN-your-title/` (NN = the film's fixed number, the title as on YouTube) and add an entry to
`films/filme.json`. Each file below is a step of the pipeline; the matching file of a real film is linked as an example.

- Video: (follows)
- Scheduled: YYYY-MM-DD 17:00
- Status: stop 1 / stop 2 / stop 3 / build / scheduled / online

| Step | File | Example from a real film |
|---|---|---|
| Stop 1: topic + title | `skript/stopp1-thema-titel.md` | [`films/74…/skript/stopp1-thema-titel-2026-11-23.md`](../../films/74-your-life-in-2050/skript/stopp1-thema-titel-2026-11-23.md) |
| Stop 2: core idea | `skript/stopp2-leitgedanke.md` | [`films/74…/skript/stopp2-lehren-vision-leitgedanke-2026-11-24.md`](../../films/74-your-life-in-2050/skript/stopp2-lehren-vision-leitgedanke-2026-11-24.md) |
| Outline | `skript/geruest-v1.md` | [`films/74…/skript/geruest-v1.md`](../../films/74-your-life-in-2050/skript/geruest-v1.md) |
| Research | `skript/faktenzettel.md`, `skript/clips.json` | [`films/74…/skript/faktenzettel.md`](../../films/74-your-life-in-2050/skript/faktenzettel.md) |
| Script | `skript/text-vN.md`, `skript/vo-vN.txt` (the voice-over only), `skript/kritik-vN.md` | [`films/74…/skript/vo-v3.txt`](../../films/74-your-life-in-2050/skript/vo-v3.txt) |
| Fact-check | `skript/ampelseite.md` | [`films/74…/skript/ampelseite.md`](../../films/74-your-life-in-2050/skript/ampelseite.md) |
| Build plan | `skript/bauplan.md`, `code/docs/shots.md` (one row per sentence) | [`films/74…/code/docs/shots.md`](../../films/74-your-life-in-2050/code/docs/shots.md) |
| Animation + audio | `code/` | [`films/74…/code/`](../../films/74-your-life-in-2050/code/) |
| Packaging | `verpackung/youtube.md` (title, description, tags, chapters), thumbnails A/B/C | [`films/74…/verpackung/youtube.md`](../../films/74-your-life-in-2050/verpackung/youtube.md) |

## Starting the code

Copy the reference film's code and replace the scenes:

```bash
cp -r films/74-your-life-in-2050/code/{engine.mjs,render.mjs,package.json,lib,audio} films/NN-your-title/code/
```

`engine.mjs` and `render.mjs` are generic (shot timeline, carriers between shots, frame-exact render to ffmpeg).
`film.mjs` and `scenes/` are the film itself: write them new for every film, anchored on the rows of `docs/shots.md`.

Skip files over 1 MB and third-party media (interview clips, press photos, source PDFs): keep them in your own storage.
