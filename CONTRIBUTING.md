# Contributing

Thanks for wanting to help. This repo is the working system of a real channel, so it changes every day.
Contributions that make it easier for **anyone** to start their own channel are the most welcome.

## Good first contributions

- **Translate** a rule file or a skill from German to English (keep the German original, add `*.en.md` next to it).
- **Generalise** a channel-specific skill: replace The Good Takeoff details with placeholders and a short "adapt this" note.
- **Extract** something reusable from a film into `tools/` or `template/` (for example the audio pipeline from `films/74-*/code/audio/`).
- **Document** a step you got working on your own machine, especially setup problems.
- **Report** a broken link, a tool that does not run, or a rule that contradicts another one.

## How to contribute

1. Open an issue first for anything larger than a typo, so we can agree on the shape.
2. Fork, make a branch, keep the change focused on one thing.
3. Run what you touched: for a tool, a short example run; for film code, `node render.mjs --snap 5 --dir snaps --scale 0.5`.
4. Open a pull request that says what changed and how you checked it.

## Ground rules

- **No secrets.** Keys go into `.env` (never committed); add new variables to `.env.example` with a comment.
- **No third-party media and no files over 1 MB.** No interview clips, press photos, source PDFs, audio or video masters.
  Link to the source instead.
- **Keep the film folders as they are.** `films/` is the channel's history and a worked example. Fix links, do not rewrite films.
- **Rules carry their reason.** A new rule in `regeln/REGELN.md` gets a date and the lesson it came from.

By contributing you agree that your contribution is released under the [MIT License](LICENSE).
