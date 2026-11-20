# Film 6 · Motion rules for scene builders (lead brief)

Film: **"AI Isn't Conscious. That's the Problem."** (The Good Takeoff, English, ~10:30, 1920×1080, 30 fps). Guiding idea, from Jakob:
*Intelligence and consciousness are two different things. Artificial intelligence got the first. Caring comes from the second.*
Read this, then `BUILDERS.md` (kit API; its Film 5 paths read as `film-06-mind` / `06-mind`), then the binding shot list
`/mnt/project-files/scenario/film-06-mind/bild/shots.md` and the builder brief `bild/BRIEF-builders.md` (no blend, handoff plates, seam checker).
Quality floor: Film 5 ("wirklich gut", Jakob 2026-10-20) and the Film 4 v2 chunks; stills under `/mnt/project-files/scenario/film-05-share/stills/`
and `/mnt/project-files/scenario/film-04-v2/stills/`.

## Motion DNA (unchanged from Film 5; one cell, never mixed)
- Calm and premium for scenes (editorial documentary), sharp accents on the key word of a sentence. Speed contrast 3–5×: snappy accent, then a slow, living hold.
- Easing: entrances and landings expo-out `(0.16, 1, 0.3, 1)`, exits expo-in `(0.7, 0, 0.84, 0)`, moves quart in-out `(0.76, 0, 0.24, 1)`. No linear except constant mechanical motion. No bouncy springs; a card may settle with ≤ 5 % overshoot.
- Base unit 0.4 s. Micro accents 0.25–0.35 s, element entrances 0.4–0.7 s, hero moves and transitions 0.8–1.2 s, camera moves 1–2 s. Duration grows ~40 % when distance or size doubles.
- Texture: print finish, grain, stipple and halftone falloff, intaglio hatching, rough paper edges. One hero light per frame.
- NO BLENDS (film.mjs turns every `tr` into a hard cut): every transition is drawn by you as a continuous move, a fly-into-a-surface, a morph, or an exact match cut. See BRIEF-builders.md §2.

## The language of Film 6: the pane, the line, the ember, the witness
Four objects carry the whole film. Use them exactly like this, so fourteen chunks read as one hand.
1. **The pane** (dark glass, `#0a0f24` → `#05060f`, a faint sliding reflection). Every screen, window and mirror in the film is the same object. It can
   *reflect* (a mirror: you see yourself), *transmit* (a window: you see others) or *glow* (a screen: the machine's answer in cool lines of text).
   The question of the film ("is anyone there?") is always drawn as: what is behind the glass. The artificial intelligence is NEVER a robot, a face,
   an avatar or a brain: it is only the pane with the cool line writing on it. Interview clips play on a pane too (`clipScreen`): the glass turns into a window onto the speaker.
2. **The cool line** = intelligence. One engraved, perfectly straight filament, silver-blue (`#bfe3ff`, core `#eef8ff`), the colour of the text on the pane,
   the cursor, a flat pulse line, the edge of a mirror, a wireframe. It *writes*: answers build line by line like light on water; it draws outlines (the wireframe mother,
   the two paths, the head profiles). It never breathes: it is precise, even, cold.
3. **The ember** = consciousness, feeling, care. A warm glow with a body: the desk lamp (hook), the candle (§2), the heartbeat in a chest (§3), the backlight behind
   a mother (§4), the night light on the ward (§7), the lit windows of the city (§8). Amber `#ffb35c`, core `#fff1d6`, deep `#c4512e`. It **breathes at a slow
   heartbeat** (about 60 per minute, ±3 % brightness, never a strobe). It is never a flat disc: a flame, a lamp, a pulse, a glow behind a figure, a window.
4. **The witness point**: a single calm point of white-gold light (`#fffaf0`), steadier and whiter than the ember, above or behind a head. §2 ("Who is watching them?"),
   §2 ("Awareness is the one looking in"), §8 ("there's one person you can be sure of"). It does not breathe and does not move on its own.
Supporting language: **paper and ink** for everything written from outside (rules, values, the comment card, the maps of the mind, "because" margin notes;
cream sheets, letterpress words, Film 5's paper kit), and **clouds** for thoughts (§2, half-transparent, drifting).

## Signature moves (use them at ★ shots and at chunk boundaries)
- **The pane turn**: the pane tilts a few degrees or its light changes, and what it does flips: a reflection becomes a view through it, a screen goes dark and
  becomes a mirror, a mirror becomes clear glass. Draw both states as real images in one take (reflection = the room drawn mirrored and darkened inside the pane).
- **The ember's breath travels**: the ember hands itself from object to object (lamp → candle → heartbeat → backlight → night light → windows) by a camera move
  into the light until it fills the frame (the `light` plates) and out of the next light.
- **The line writes the next thing**: the cool line draws the outline of the next object (a pane, a path, a profile, a pulse), then the object fills in. Use `ghostLine`,
  `unwind`, `peel` from the kit.
- Transition types inside a chunk: (a) continuous take with a camera path, (b) fly into a surface (a pane, a sheet, a light, the sky) and the next image grows out of it,
  (c) morph of a line, (d) exact match cut (same object, same place, same motion on both sides). Nothing else.

## Every frame
- One motif per sentence, and the image shows what the sentence says (understandable without the voice). Faster than one shot per sentence is fine.
- Random-frame test: something is always alive (3–6 parallax layers, drift continues the last momentum, 1–3 % scale, the ember breathes, grain drifts), and exactly one
  thing commands attention. Stagger onsets (40–80 ms); never more than a third of the elements in active motion at once. < 5 % near-static frames, no still stretch > 2 s.
- Every keyframe works as a poster: grid, asymmetry, negative space, foreground/mid/background, 2–3 main colours plus neutrals.
- Cause and effect: when A touches B, B reacts 40–120 ms later with smaller amplitude. Position leads, rotation follows, opacity settles last.
- One ★ moment per chunk at most, at most 2 hard accents per 30 s.
- Nothing fades in half-transparent: an object rises out of the dark as one solid picture (draw it offscreen, darken with source-atop), is carried in, or grows out of
  something already there. Never a ghostly alpha fade of a whole object, never a frame darker than the night plates, never more than 0.3 s near-black.
- People: "you" is the main character (seen from behind or at figure scale, never a portrait); `figure()` with `{t, seed}` and `life()` so everyone breathes, blinks and
  shifts weight; `walk()` for real steps; round shoulders, arms in front or beside the body, never behind; no close-up hands (Film 5's `heldPhone` POV is the one exception).
  Bodies physically right (weight, contact points, joints). Props read in one second.
- Time passes slowly (one night, one dawn at most per ~2 s of film, continuous colour, never a strobe).
- On-screen text: Instrument Serif (titles, quotes, numbers) + Inter caps (labels, sources). Readable ≥ 1 s at ≤ 12–15 characters per second, mask reveals per word or
  line, never moving while it must be read, never cut off. Bottom 170 px free (burned-in subtitles). Every study or number on screen carries its source (shots.md §5).
  Running text on screen ONLY for the two quoted answers in §6/§7 and the quote cards (`quoteCard2`). Comments and chats are `scribble()` (unreadable) except the one real
  praise comment, which is a card with its real wording.
- Forbidden: robots, androids, humanoid machines, glowing eyes, brains as organs, circuit boards, binary rain, data centres, server racks, HAL-style red eyes, chat bubbles
  with robot avatars, fireworks, globes, doors, keyholes, calendars, hourglasses, candle chains, waiting rooms, vertical light columns in the sky; from Film 4/5: kitchen table,
  phone lying on a table or flipping face up, bedside table, tea or cups, kitchen window at night, map strip with a field of igniting dots, long table, string lights, Maslow
  hill, the share certificate, the guilloche rosette as a motif (paper watermark in the plates is fine).

## Palette by section (ground / light / accent)
- Hook + §8: night room indigo `#0c1226` / lamp amber `#ffb35c` / screen text `#bfe3ff`.
- §1: the mirror: slate `#141a2e` / silver `#dfe7f2` / praise glint gold `#ffd27a`; the split: line `#bfe3ff` vs ember `#ff9a3c`.
- §2: dawn grey-gold: `#1b1a22` → morning `#f1d9a8` / candle `#ffb35c` / clockwork brass `#b8894a`, verdigris `#5f8f7a`; witness `#fffaf0`.
- §3: body warmth: `#160f14` / pulse `#ff6a3d` → `#ffb35c` / nursery cream `#f3ecda`.
- §4: library indigo `#0b1030` / lullaby warm `#ffcf8a` / threat cold `#9fb8d6` (same brightness); the wireframe `#bfe3ff`.
- §5: half-dark desks `#111624` / paper cream `#f3ecda` / scale brass `#b8894a`; the small flame `#ff9a3c`.
- §6: path one rose-amber mirrors `#2a1a1f` / `#ffb8a0` / painted heart `#e86a6a`; path two neutral `#12182a` / clear glass `#dfe7f2` / ember in the chest.
- §7: paper and hands cream `#f3ecda` / ink `#2a2420` / lamp amber; profiles: distress `#ff5a3c` flicker vs compassion `#ffb35c` calm; the ward: teal `#1f5560` / night light `#ffb35c`.

## Sound hooks
Entries may carry `sound: [{ f, t, v, d?, loop? }]` with absolute film times. Files: `/mnt/project-files/scenario/sfx-bibliothek/akzent/` (`pages`, `paper_pop`, `stamp`,
`tear`, `card`, `drop`, `whoosh`, `whoosh_airy`, `whoosh_up`, `swell`, `bloom`, `chime`, `gust`, `tick`, `shimmer_rings`, `foil_glint` …) and ambiences in
`sfx-bibliothek/atmo/` (`amb_city_night_hill`, `amb_rain`, `amb_hall`, `amb_dawn_birds` …). Accents in speech pauses (never under a running sentence), 3–8 per chunk; the
impact on the contact frame, a whoosh a few frames early. New sounds you need: name them in your report (the lead makes them).

## Gates (in this order)
1. Plan first: at the top of your scene file, a comment table per shot: VO words, image, hero light, camera, how it flows into the next (take / fly-into / morph / match cut), ★, sound.
2. Build, then review by looking: snapshots at 0.5 scale every ~0.5 s around each move and one per sentence. At least 3 review rounds; fix the weakest thing each round.
3. Seam-check every move and both chunk boundaries with `tools/seam.mjs` (BRIEF §2).
4. Performance ≤ 300 ms per frame at full size including the finish.
5. Score your chunk 1–5 on: poster quality · sentence = image · seamless (no blend) · alive · people and props believable · text. Nothing below 4 before you report.
6. Touch only your own `scenes/scNN.mjs` and new `lib/f6_cNN_*.mjs`. Don't commit; the lead does.
