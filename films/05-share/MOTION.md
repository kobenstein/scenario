# Film 5 · Motion rules for scene builders (lead brief)

Read this, then `BUILDERS.md` (kit API, by K0), then your chunk in `/mnt/project-files/scenario/film-05-share/bild/shots.md`.
Film 4's art brief is the floor for quality: `git show origin/claude/project-thread-p4c9r3:films/04-work/BRIEF.md`.
Jakob's ask (2026-10-19 23:18): it must feel like a gripping story, not a report; world-class motion design with strong transitions and motion graphics.

## Motion DNA (one cell, never mixed)
- Calm and premium for scenes (editorial documentary), sharp accents on the key word of a sentence. Speed contrast 3–5×: snappy accent, then a slow, living hold.
- Easing: entrances and landings expo-out `(0.16, 1, 0.3, 1)`, exits expo-in `(0.7, 0, 0.84, 0)`, moves quart in-out `(0.76, 0, 0.24, 1)`. No linear except constant mechanical motion. No bouncy springs (money topic: overshoot reads as a toy); a card may settle with ≤ 5 % overshoot.
- Base unit 0.4 s. Micro accents 0.25–0.35 s, element entrances 0.4–0.7 s, hero moves and transitions 0.8–1.2 s, camera moves 1–2 s. Duration grows ~40 % when distance or size doubles.
- Texture: print finish, grain, stipple and halftone falloff, intaglio hatching, rough paper edges, amber foil glints. One hero light per frame.

## Through-line and signature move
- Through-line: the engraved line of a share certificate (guilloche rosettes, fine intaglio lines, microtext, embossed seal, amber foil). It shows up as the buzz rings of the phone, the seal, seeds, coastlines, map borders and the final rosette.
- Signature move: an engraved line unwinds and redraws itself into the next object (rosette → coastline, seal → seed, ring → Earth). Use it at chunk boundaries and for the ★ shots; elsewhere use the three Film 4 transition types: (a) exit/carry, (b) push-in or iris into an object that becomes the next image, (c) motion match whip in the same direction (about 1 in 6).
- Nothing appears from nowhere: every new element grows out of, splits from, is revealed by, or is carried in by something already on screen. No crossfade as a default, no fade-out-then-in, never an empty reset frame.

## Every frame
- One motif per sentence, and the image shows what the sentence says (understandable without the voice). Faster than one shot per sentence is fine.
- Random-frame test: something is always alive (3–6 parallax layers, drift continues the last momentum, 1–3 % scale), and exactly one thing commands attention. Stagger onsets (40–80 ms) so they lead the eye in order; never more than a third of the elements in active motion at once.
- Every keyframe works as a poster: grid, asymmetry, negative space, foreground/mid/background, 2–3 main colours plus neutrals.
- Cause and effect: when A touches B, B reacts 40–120 ms later with smaller amplitude. Position leads, rotation follows, opacity settles last.
- One ★ wow moment per chunk at most, and at most 2 hard accents per 30 s.
- On-screen text: readable for ≥ 1 s at ≤ 12–15 characters per second, mask reveals per word or line, never move text while it must be read. Keep the bottom 170 px free of important text (burned-in subtitles live there).
- People: "you" is the main character, no invented hero; real, moving figures with natural round shoulders and arms never behind the back. No robots, brains, circuit boards, fireworks, doors, keyholes, calendars, hourglasses, candle chains, globes, waiting rooms, vertical light columns in the sky.
- Not again from Film 4: kitchen table or kitchen, phone lying on a table or flipping face up, bedside table, tea or cups, kitchen window at night, window push-in, map strip with a field of igniting amber dots, long table, string lights, Maslow hill.

## Sound hooks
Entries may carry `sound: [{ f, t, v, d?, loop? }]` with absolute film times. Files live in `/mnt/project-files/scenario/film-05-share/audio/sfx/` (names without .mp3): new for Film 5 `phone_buzz`, `shimmer_rings`, `foil_glint`, `press_notes`, `gavel`; plus the library (`pages`, `paper_pop`, `stamp`, `tear`, `card`, `coin`, `multiply`, `drop`, `whoosh`, `whoosh_airy`, `whoosh_up`, `swell`, `bloom`, `chime`, `gust`, `tick`, ambiences `amb_dawn`, `amb_dawn_birds`, `amb_city_night_hill`, `amb_city_street`, `amb_rain`, `amb_hall` …). Put accents in speech pauses where you can (Jakob: present, but not under a running sentence); the impact lands on the contact frame, a whoosh starts a few frames early.

## Gates (in this order)
1. Plan first: at the top of your scene file, a comment table per shot: hero onset, carrier into the next shot, transition type, ★.
2. Build, then review by looking: snapshots at 0.5 scale every ~0.33 s around each transition and one per shot (`SECS=cNN node render.mjs --snap … --dir …`). At least 2 review rounds; fix the weakest thing each round.
3. Performance ≤ 250 ms per frame at full size (cache static layers offscreen, deterministic prng, no Math.random; avoid createPattern and the 'copy' composite, they leak in @napi-rs/canvas).
4. Score your chunk 1–5 on: random-frame test, onset order, carriers at every boundary, speed contrast, poster quality, text readability. Nothing below 4 before you report.
5. Touch only your own `scenes/scNN.mjs` (and new files named `lib/cNN-*.mjs` if you need them). Shared-lib bugs go to the lead in your report. Don't commit; the lead does.
6. Report: shots built, 4–6 still paths (copy them to `/mnt/project-files/scenario/film-05-share/stills/cNN/`), ms per frame, anything you could not do.
