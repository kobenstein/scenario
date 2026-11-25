# Film 68 · "The AI Race Will Be Decided by 2027" (The Good Takeoff) · code

Editorial-night machine of Films 59–67 (Node + @napi-rs/canvas). Leitbild: the night stadium with the giant scoreboard AI RACE.
- Plan: `docs/MOTION.md` (DNA, carrier, wow, rules) · `docs/shots.md` (shot list with "zeigt wörtlich", "Motiv neu?", "Nicht wiederholen"; from `tools/shots68.mjs`).
- Sequencer: `film.mjs` runs the shots of `scenes/plan.mjs`, resolved on the real VO (`scenes/resolve.mjs`); every boundary is the gold baton
  (arc flight .45 s + disc reveal .7 s), 0 hard cuts. Chapters: `scenes/ch_hook|ch_1|ch_r12|ch_r34|ch_5|ch_6|ch_9.mjs`.
- Kit: `lib/f68_kit.mjs` (re-exports `lib/f67_kit.mjs`: clip plates, cards, sources).
- ROOT (small files, network mount): `/mnt/project-files/scenario/film-ai-race/`. Renders and big audio: `/tmp/claude-0/f68/`.
- Clip frames: `/tmp/claude-0/f68/clips/C1|C4|C5/` from `films/68-assets/clips/` (`tools/f68_clips.py`).

```
npm install
node tools/shots68.mjs                       # share (EXPL 1 · MIX .5 · SCENE/CLIP 0), cuts, leitbild anchors → docs/shots.md
tools/sheet.sh <name> 12,40.5,...            # contact sheet → /tmp/claude-0/f68/sheets/<name>.jpg
node render.mjs --from 0 --to 150 --out part.mp4
cd audio; W=/tmp/claude-0/f68/audio; python3 clips_json.py . && python3 mix.py . $W && python3 subs.py . $W/untertitel
```
Not in the repo (big files): VO takes, Lyria tracks M0–M5 (`audio/music/urls.txt`), SFX copies, clip videos, renders, master.
