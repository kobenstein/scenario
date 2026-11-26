# Building blocks

Everything in this repo you can lift into your own channel, grouped by what it does.
Language: most rules and two skills are written in German (the channel was run in German); Claude reads them in any language.

## Claude skills (`regeln/skills/`)

Add a skill to Claude as a custom skill in your Claude settings, or place its folder in `.claude/skills/` of your project for Claude Code.

| Skill | Use it for | Channel-specific? |
|---|---|---|
| [`good-takeoff-thema-titel`](../regeln/skills/good-takeoff-thema-titel/SKILL.md) | Find a topic with proven demand, write and score titles, check click rate after 24 h | yes, rename and adapt |
| [`scenario-script`](../regeln/skills/scenario-script/SKILL.md) | Outline and voice-over script, writer/critic loop, banned phrases | yes, adapt the stance |
| [`scenario-motion`](../regeln/skills/scenario-motion/SKILL.md) | The channel's visual and motion style (Editorial grain animation) | yes, replace with your style |
| [`world-class-motion-design`](../regeln/skills/world-class-motion-design/SKILL.md) | Craft rules for any motion design video: carriers, hand-offs, tempo, sync | no, general |
| [`motion-director-gates`](../regeln/skills/motion-director-gates/SKILL.md) | Hard review gates so a build does not become a slideshow | no, general |
| [`fluid-motion-design`](../regeln/skills/fluid-motion-design/SKILL.md) | One fluid shot instead of cuts, for code or AI video | no, general |
| [`good-takeoff-thumbnails`](../regeln/skills/good-takeoff-thumbnails/SKILL.md) | Three thumbnails A/B/C for Test & Compare, phone-size checks | yes, replace the style |
| [`good-takeoff-upload`](../regeln/skills/good-takeoff-upload/SKILL.md) | Upload and schedule via the YouTube API, Studio steps, release check | yes, replace channel ID and paths |
| [`wochenanalyse`](../regeln/skills/wochenanalyse/SKILL.md) | Weekly analytics review with a hypothesis log and max. three changes | mostly general |

## Rules (`regeln/`)

| File | What it holds |
|---|---|
| [`REGELN.md`](../regeln/REGELN.md) | The single source of truth: stance, topic, outline, hook, language, clips, titles, thumbnails, stops, description, build. Every section dated with the lesson it came from |
| [`hook-bauplan.md`](../regeln/hook-bauplan.md) | How the first 60 seconds are built, from retention data |
| [`treffer-check.md`](../regeln/treffer-check.md) | Demand check for a topic before any work starts |
| [`clip-schritt.md`](../regeln/clip-schritt.md) | Real interview clips: sources, length, share of runtime, traffic-light for rights |
| [`vibe-brief.md`](../regeln/vibe-brief.md) | The feel of the channel on one page |
| [`feedback-log.md`](../regeln/feedback-log.md) | Raw feedback the rules were distilled from |
| [`sponsoren-einbau.md`](../regeln/sponsoren-einbau.md) | How sponsor reads are placed in a film |

## Tools (`tools/`)

| Tool | What it does |
|---|---|
| [`regel_check.py`](../tools/regel_check.py) | Lints a voice-over against the rules (banned phrases, first minute, length, clips) |
| [`clip_check.py`](../tools/clip_check.py) | Share of interview clips in the runtime (target ≤ 8 %, hard 10 %) |
| [`check_descriptions.py`](../tools/check_descriptions.py) | Checks the description header of every long video, `--fix` repairs it |
| [`yt_analytics.py`](../tools/yt_analytics.py) | YouTube Analytics queries: retention, traffic sources, per-video stats |
| [`render-fast.mjs`](../tools/render-fast.mjs) | Parallel render of a composition (also as GitHub Action `render`) |
| [`thumbnails/`](../tools/thumbnails/) | Typesetting, export sizes and phone-size check images for thumbnails |
| [`dub/`](../tools/dub/) | Dubbed versions: translate, speak, align, mix |
| [`shorts/`](../tools/shorts/) | Cut 9:16 Shorts from the long films |
| [`sync_projektordner.py`](../tools/sync_projektordner.py) | Pulls rules, scripts and packaging from the working folder into the repo |

## Film code (`films/NN-*/code/`)

| Part | What it does |
|---|---|
| `engine.mjs` | Shot timeline, carriers between shots (portal, iris, sweep), camera drift |
| `render.mjs` | Renders frames from Canvas straight into ffmpeg; `--snap` writes stills for review |
| `docs/shots.md` | The shot list: one row per sentence, the picture it gets, the explainer share |
| `audio/build_vo.py`, `align_ps.py` | Lays voice takes and clip slots on one timeline, word timing by forced alignment |
| `audio/mix.py`, `subs.py` | Music, SFX and ducking mix; subtitles from the word timing |

Reference film with the cleanest structure: [`films/74-your-life-in-2050/code`](../films/74-your-life-in-2050/code).

## Analyses (`kanalanalyse/`)

Channel deep-dives, retention studies and competitor notes that fed the rules. Useful as a model for your own analysis, not as data.
