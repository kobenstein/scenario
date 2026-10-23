# Film 7 · Motion rules for scene builders (lead brief)

Film: **"Can Superintelligence Grow Forever?"** (The Good Takeoff, English, ~10:20, 1920×1080, 30 fps). Guiding idea:
*Superintelligence can grow forever in intelligence. It cannot grow forever in appetite. That difference decides whether abundance lasts.*
Read this, then `BUILDERS.md` (kit API; its Film 5 paths read as `film-ueberfluss` / `07-forever`), then the binding shot list
`/mnt/project-files/scenario/film-ueberfluss/bild/shots.md` and the builder brief `bild/BRIEF-builders.md` (no blend, handoff plates, seam checker).
Quality floor: Film 5 ("wirklich gut", Jakob 2026-10-20), Film 4 v2 and Film 6; stills under `/mnt/project-files/scenario/film-05-share/stills/`,
`/mnt/project-files/scenario/film-04-v2/stills/` and `/mnt/project-files/scenario/film-06-mind/stills/`. Style reference Jakob loved: the fire circle under the Milky Way
(`/mnt/project-files/scenario/film-04-v2/stills/stil-referenz/f4_8m27_feuerkreis.jpg`): one warm light in a wide night, layered indigo ridges, rim-lit silhouettes.

## Motion DNA (unchanged from Film 5; one cell, never mixed)
- Calm and premium for scenes (editorial documentary), sharp accents on the key word of a sentence. Speed contrast 3–5×: snappy accent, then a slow, living hold.
- Easing: entrances and landings expo-out `(0.16, 1, 0.3, 1)`, exits expo-in `(0.7, 0, 0.84, 0)`, moves quart in-out `(0.76, 0, 0.24, 1)`. No linear except constant mechanical motion. No bouncy springs; a card may settle with ≤ 5 % overshoot.
- Base unit 0.4 s. Micro accents 0.25–0.35 s, element entrances 0.4–0.7 s, hero moves and transitions 0.8–1.2 s, camera moves 1–2 s. Duration grows ~40 % when distance or size doubles.
- Texture: print finish, grain, stipple and halftone falloff, intaglio hatching, rough paper edges. One hero light per frame.
- NO BLENDS (film.mjs turns every `tr` into a hard cut): every transition is drawn by you as a continuous move, a fly-into-a-surface, a morph, or an exact match cut. See BRIEF-builders.md §2.

## The language of Film 7: the curve, the dome, the cards, the light, the ring
Five objects carry the whole film. Use them exactly like this, so twelve chunks read as one hand.
1. **The curve** = growth. One engraved, luminous filament drawn across the sky like a comet's trail, rising exponentially from the horizon. It is the film's carrier:
   it starts every big move and ends in the ring. Two tones, never mixed on one line:
   - **appetite** (energy, fuel, materials, "bigger"): ember amber `#ffb35c` with a hot white core `#fff1d6`, heat shimmer along it, sparks shed at its tip;
   - **intelligence** ("what it knows"): cool silver-blue `#bfe3ff`, core `#eef8ff`, perfectly clean, no heat, a faint star-glint travels along it.
   Until the twist (c06) there is only ONE curve and it is appetite-amber. At the twist it **splits**: the cool line peels off and keeps climbing, the amber line bends over and
   lies down into the ring. After the split both always appear together (cool above, amber in the ring).
2. **The dome** = the planet's limit. A vast, almost invisible glass hemisphere over the curved horizon of the Earth (engraved landscape, night side, thin atmosphere glow).
   It only shows itself when something touches it: a rim of light, refraction of the stars, heat haze, fine fracture lines of light where the curve presses (the
   thumbnail image). It never cracks open and never shatters (no doom). It is the same object in the hook (c01), the wall (c03), the fork (c07) and the end (c12).
3. **The cards** = the four questions. Four cream letterpress cards (`#f3ecda`, ink `#2a2420`, numbered I–IV in Instrument Serif, one short question each), the size of a
   playing card in the hand, filling a third of the frame when hero. They are dealt onto a dark table in c04/c05 (front: the question, each ends with its punchline
   stamped across it: `NO POWER BILL` · `METAL DOESN'T SCALE` · `ONE DIAL OF NINE` · `FOR WHOM?`), and turned over in c08–c11 (back: the answer, a small engraved image
   plus one word: `SUN` · `CEILING` · `WATCHMAN` · `A SHARE`). Same four cards, same table, same order. They turn with the card flip (signature move below).
4. **The light** = getting smarter, not burning more. A warm flame lineage that hands itself on: the Babylonian clay oil lamp → a candle → an incandescent bulb → a
   street of lit windows → the sun on solar panels. Amber `#ffb35c` → daylight `#fff6e0`. Each new light grows out of the previous one's flame (never appears from nothing).
5. **The ring** = enough, inside the limits. A luminous band around the Earth, seen from space at the end and from the ground as an aurora-like arc in the sky. It has
   two edges: a warm inner edge (the floor: what everyone needs) and a soft outer edge (the ceiling: the planet's limits); the amber appetite line lies calmly between
   them. The ring is born from the bent appetite curve (c06), named in the fork (c07), filled with life at the number (c11), and closes around the Earth (c12).
Contrast motif: **the furnace** (path A in the fork, c07): the same landscape seen through the mouth of a vast furnace, everything glowing red-orange `#e2552c`,
smoke instead of stars; it is shown only in c07 (and as a 0.5 s memory in c12), short and calm, never dramatic.
Supporting language: **paper and ink** for everything written from outside (the master plan as a printed page, the columnist's line as a quote card, the treaty, the
"cap" as a hand-drawn line on an engraved chart); **engraved landscapes** for the Earth (night side, layered ridges, fields, sea), always with people at figure scale.

## Signature moves (use them at ★ shots and at chunk boundaries)
- **The curve presses the dome**: the amber curve climbs into the glass; at the contact point the dome reveals itself with a ring of refracted light, heat haze and fine
  lines of light spreading from the contact. The curve never breaks through (except the cool intelligence line, which passes through the dome like starlight, c12).
- **The split**: one curve becomes two. The cool silver line peels off the amber one along its length (like a fibre unwinding), keeps climbing; the amber bends over in
  a slow arc and settles into the ring. Use `unwind`, `peel`, `ghostLine` from the kit.
- **The card flip**: a card on the table lifts at one edge, turns over in 3D perspective (0.8 s, quart in-out, a short paper flutter, soft shadow), lands with ≤ 5 %
  overshoot; the camera then flies into the card's image (the next world grows out of the engraving on its back).
- **The flame hands on**: push into a flame until it fills the frame (the `light` plates) and pull back out of the next light.
- Transition types inside a chunk: (a) continuous take with a camera path, (b) fly into a surface (a card, a flame, the glass of the dome, the sky, a page) and the next
  image grows out of it, (c) morph of a line (the curve becomes a chart line, a power line, a kerb, the ring), (d) exact match cut (same object, same place, same motion).
  Nothing else.

## Every frame
- One motif per sentence, and the image shows what the sentence says (understandable without the voice). Faster than one shot per sentence is fine.
- Random-frame test: something is always alive (3–6 parallax layers, drift continues the last momentum, 1–3 % scale, flames breathe, stars twinkle, heat shimmers, grain
  drifts), and exactly one thing commands attention. Stagger onsets (40–80 ms); never more than a third of the elements in active motion at once. < 5 % near-static frames,
  no still stretch > 2 s.
- Every keyframe works as a poster: grid, asymmetry, negative space, foreground/mid/background, 2–3 main colours plus neutrals.
- Cause and effect: when A touches B, B reacts 40–120 ms later with smaller amplitude. Position leads, rotation follows, opacity settles last.
- One ★ moment per chunk at most, at most 2 hard accents per 30 s.
- Nothing fades in half-transparent: an object rises out of the dark as one solid picture (draw it offscreen, darken with source-atop), is carried in, or grows out of
  something already there. Never a ghostly alpha fade of a whole object, never a frame darker than the night plates, never more than 0.3 s near-black.
- People: "you" and "we" are the main characters (figures seen from behind or at figure scale, never a portrait); `figure()` with `{t, seed}` and `life()` so everyone
  breathes, blinks and shifts weight; `walk()` for real steps; round shoulders, arms in front or beside the body, never behind; no close-up hands. Bodies physically right.
  Props read in one second. Robots (c01, c04): only as small, simple engraved humanoid silhouettes at figure scale in a row on the stage or a factory floor, never a face
  close-up, never glowing eyes, never menacing.
- Time passes slowly (continuous colour, never a strobe).
- On-screen text: Instrument Serif (titles, quotes, numbers, card questions) + Inter caps (labels, sources). Readable ≥ 1 s at ≤ 12–15 characters per second, mask reveals
  per word or line, never moving while it must be read, never cut off. Bottom 170 px free (burned-in subtitles). Every study or number on screen carries its source
  (shots.md §5). Running text on screen ONLY for the two quote cards (Tesla's plan sentence, the Bloomberg line) and the Nadella card.
- Forbidden: glowing robot eyes, android faces, brains, circuit boards, binary rain, server-rack corridors as hero (a data center is a long low building seen from outside
  with its cooling fans and power lines), explosions, cracking or shattering of the dome or the Earth, burning cities, fireworks, globes on a stand, calendars, hourglasses,
  doors, keyholes, candle chains; from Films 4–6: kitchen table, phone face-up, tea or cups, map strip of igniting dots, long table, string lights, Maslow hill, the share
  certificate, the mirror of the mind, the night room with the laptop, the pane with the cool line of text as "the machine" (Film 6's language).

## Palette by section (ground / light / accent)
- Hook + wall (c01–c03): space-night indigo `#0a1030` → horizon violet `#2a2350` / the amber curve `#ffb35c` / dome rim `#cfe6ff`; data-center night `#0c1424`.
- Test (c04–c05): stage black `#0b0b10` with a cold spotlight `#e8eef6` / cards cream `#f3ecda`, ink `#2a2420`, stamp red `#b23a2a` / copper `#c07a45`, lithium silver `#cfd6dc`.
- Twist (c06): lamp light amber `#ffb35c` on clay `#7a5236` → bulb `#ffe2a8` → daylight `#fff6e0`; the split: cool `#bfe3ff` vs amber `#ffb35c`.
- Fork (c07): furnace `#e2552c` / smoke `#3a2a28`; the ring path dawn `#f1d9a8`, sea teal `#2f6f74`, forest `#3f6b4a`.
- Answers (c08–c11): clear day `#e9eef2` → evening gold `#f1c27a`; grid lines cool `#9fb8d6`; paper cream; green `#5f8f6a` for land and sea protection.
- End (c12): Earth from space, ring amber/cream, intelligence line silver passing through the dome into the stars.

## Sound hooks
Entries may carry `sound: [{ f, t, v, d?, loop? }]` with absolute film times. Files: `/mnt/project-files/scenario/sfx-bibliothek/akzent/` (`pages`, `paper_pop`, `stamp`,
`tear`, `card`, `drop`, `whoosh`, `whoosh_airy`, `whoosh_up`, `swell`, `bloom`, `chime`, `gust`, `tick`, `shimmer_rings`, `foil_glint` …) and ambiences in
`sfx-bibliothek/atmo/`. Accents in speech pauses (never under a running sentence), 3–8 per chunk; the impact on the contact frame, a whoosh a few frames early. New sounds
you need (e.g. glass resonance for the dome, card flip, flame breath): name them in your report (the lead makes them).

## Gates (in this order)
1. Plan first: at the top of your scene file, a comment table per shot: VO words, image, hero light, camera, how it flows into the next (take / fly-into / morph / match cut), ★, sound.
2. Build, then review by looking: snapshots at 0.5 scale every ~0.5 s around each move and one per sentence. At least 3 review rounds; fix the weakest thing each round.
3. Seam-check every move and both chunk boundaries with `tools/seam.mjs` (BRIEF §2).
4. Performance ≤ 300 ms per frame at full size including the finish.
5. Score your chunk 1–5 on: poster quality · sentence = image · seamless (no blend) · alive · people and props believable · text. Nothing below 4 before you report.
6. Touch only your own `scenes/scNN.mjs` and new `lib/f7_cNN_*.mjs`. Don't commit; the lead does.
