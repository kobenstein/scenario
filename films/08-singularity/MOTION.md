# Film 8 · Motion rules · "How to Survive the Singularity" (the first minute)

Film: **"How to Survive the Singularity"** (The Good Takeoff, English, ~11 min, 1920×1080, 30 fps). This file covers the first minute (70.84 s, the hook up to
"That's the compass we're going to build."), built as a quality test. Guiding idea (geruest-v4): *The singularity is the point where our maps stop working.
To get through it, you don't need a map. You need a compass, and so do we.*
Binding shot list: `/mnt/project-files/scenario/film-singularitaet/m1/bild/shots.md`. Engine and kit: `BUILDERS.md`, `lib/F6_KIT.md` (Film 5/6 machinery).
Quality floor: Film 5 ("wirklich gut") and Film 4 shot 17.01, the fire circle under the Milky Way (`film-04-v2/stills/stil-referenz/f4_8m27_feuerkreis.jpg`).

## Style: the fire circle, at sea
- One warm light in a wide night. The night is deep indigo (`#04050f` → `#0a0d26` → `#141436`, horizon `#1f1c47`), the Milky Way runs across it, the land and
  the sea are layered indigo planes (ridges, swells) with a thin starlight rim, and the people are calm silhouettes with a rim from the one light.
- The world of this film is the ocean, the canoe and star navigation, so the sky is ONE sky for the whole minute: the same Milky Way, the same stars (Film 4's
  `v2_c17_sky`, copied as `lib/s8_sky.mjs`). The camera can tilt up into it and come down somewhere else: the sky carries the move.
- Print finish from Film 5 (riso, halftone in the light, hatch in the shadow, fibre, grain) on every frame; grain is texture, never an effect.

## The language of Film 8: the light, the map, the compass, the navigator
1. **The horizon light** = the singularity, the machine. A point of white-cyan light (`#d8f7ff`, halo `#8fe6ff`) on the horizon. It bends the stars round it
   into arcs (an Einstein ring), and its reflection runs down the water. It never has a face, a body, a robot, a brain or a screen of code. It never warms.
2. **The map** = the plan you were given. Cream paper (`#f3ecda`, aged `#e2cfa4`), ink `#2a2420`, engraved contours and roads. Maps unroll, race away, fog over,
   and **dissolve at their edges**: a thin ember edge eats the paper and the paper behind it breaks into flakes that lift on the wind (opaque flakes, never a fade).
3. **The compass** = what you carry instead. Brass (`#b8894a`, light `#f0c27a`) with an amber needle that glows (`#ffb35c`, core `#fff1d6`). It appears four times
   and grows each time: the compass on the dissolving map (the title, the thumbnail), the small one in your palm (yours), the rose of boats (ours), the star
   compass round the navigator (the one we will build). The needle swings, overshoots ≤ 5 %, and settles; it then breathes at ±3 %.
4. **The navigator** = you. A faceless figure seen from behind or at figure scale, rim-lit by the one warm light (a lantern, a fire box). Breathes, blinks,
   walks with natural arms (`figure.mjs`: `figure`, `figureBack`, `walk`, `life`), never a pictogram.
Supporting: **water** (swells as engraved lines at geometric depths, starlight glints, wakes), **fog** for "no one can see", **storm** for "the storms ahead".

## Motion DNA (from Film 5/6, unchanged)
- Calm and premium; sharp accents on the key word of a sentence. Speed contrast 3–5×: a snappy accent, then a slow living hold.
- Easing: entrances expo-out `(0.16, 1, 0.3, 1)`, exits expo-in `(0.7, 0, 0.84, 0)`, moves quart in-out or sine in-out; camera tracks are monotone cubic
  (PCHIP) through keys, so they never overshoot. No linear except constant mechanical motion (the roll, the drift of the stars).
- Base unit 0.4 s. Micro accents 0.25–0.35 s, entrances 0.4–0.7 s, hero moves 0.8–1.2 s, camera moves 1–2 s. Big things move slowly, small things fast.
- Cause and effect: when A touches B, B answers 40–120 ms later with a smaller amplitude (the light pulses, the rims brighten, a head turns).
- At most 2 hard accents per 30 s (here: the stars bending at "begun", the lightning at "storms").

## Never still
- `film.mjs` `cameraFloat` runs over the whole picture (1.6–3.6 % zoom breathing, drift, a hint of roll), and every take has its own slow camera drift.
- Water moves (swell lines travel, glints twinkle), stars drift, flames flicker, flakes fly, people breathe and blink, the lantern breathes at ~60 bpm.
- Measured on the render (`tools/motion.mjs`): near-static frames (mean |Δ| < 0.35 on a 240×135 thumbnail) under 5 %, no static stretch over 2 s.

## No blends (Jakob)
- `film.mjs` turns every `tr` into a hard cut; the whole minute is ONE draw function (`scenes/sc01.mjs`) that switches world only where the frame is the same
  picture on both sides: inside the horizon light's line, inside the sky (only stars on screen), or in a continuous camera move through glass.
- Objects rise out of the dark as one opaque picture, or are carried in (a hand brings the compass, the wind carries flakes, the camera passes things).
- The clip opens out of the line and closes back into it (old TV); the line is an object in both worlds.

## On-screen text
- The title `HOW TO SURVIVE THE SINGULARITY`: Anton (bold narrow grotesk, OFL, `fonts/Anton.woff2`), cream `#f3efe2` with a soft warm glow, mask reveal per line.
- Lower third for the clip: `Sam Altman` / `CEO, OPENAI` + the `ORIGINAL FOOTAGE` tag (`f6_kit.lowerThird`).
- Small labels (Inter caps, spacing): the canoe (`HŌKŪLEʻA · 1976`, `HAWAIʻI → TAHITI`), the four quarters of the star compass. Never the word "AI".
- Bottom 170 px free for the subtitles.

## Forbidden
Robots, androids, brains, circuit boards, binary rain, glowing eyes, data centres, server racks, globes, hourglasses, calendars, fireworks; crossfades; a frame
darker than the night for more than 0.3 s; two hero lights of equal strength in one frame; AI-generated images; primitive 3D shapes (cubes, spheres) as objects.
