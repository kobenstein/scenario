# Film 8 · Motion rules for scene builders (lead brief)

Film: **"The Rise of AI-Native Companies"** (The Good Takeoff, English, ~10:16, 1920×1080, 30 fps). Guiding idea:
*An A.I.-native company is a living thing with three organs: a memory that forgets nothing, hands that never sleep, and a human will in front.
Whether a few people get these organs or millions do is the question that matters.*
Read this, then the kit API (`BUILDERS.md` of Film 7, same engine), then the binding shot list `/mnt/project-files/scenario/film-ein-person/bild/shots.md`.
Real timing: `/mnt/project-files/scenario/film-ein-person/audio/timing.json` (sections `00a` … `10a`, clip `C1`, quote cards `Q1`, `Q2`; 616.5 s incl. 20 s endcards).
Quality floor: Film 5 ("wirklich gut", Jakob 2026-10-20), Film 4 v2, Film 6, Film 7. Style reference Jakob loved: the fire circle under the Milky Way
(`/mnt/project-files/scenario/film-04-v2/stills/stil-referenz/f4_8m27_feuerkreis.jpg`): one warm light in a wide night, layered indigo ridges, rim-lit silhouettes.

## Motion DNA (unchanged from Film 5/7; one cell, never mixed)
- Calm and premium (editorial documentary), sharp accents on the key word. Speed contrast 3–5×: snappy accent, then a slow, living hold.
- Easing: entrances expo-out `(0.16, 1, 0.3, 1)`, exits expo-in `(0.7, 0, 0.84, 0)`, moves quart in-out `(0.76, 0, 0.24, 1)`. No linear except constant mechanical motion. No bouncy springs; ≤ 5 % overshoot.
- Base unit 0.4 s. Micro accents 0.25–0.35 s, entrances 0.4–0.7 s, hero moves 0.8–1.2 s, camera 1–2 s.
- Texture: print finish, grain, stipple and halftone falloff, intaglio hatching, rough paper edges. One hero light per frame.
- NO BLENDS: every transition is a continuous move, a fly-into-a-surface, a morph, or an exact match cut.

## The language of Film 8: the organism (weave, fireflies, the conductor, the workshop, the many lights)
The film takes one company apart like an anatomical engraving and puts it back together. Five objects carry it:
1. **The network** = the memory (the "company brain"). REVISED after Jakob's minute-1 comment (2026-10-23 12:04: "das Raster ist nicht optimal, eher ein Netzwerk,
   das an ein neuronales Netz erinnert, organischer, oder in Form eines Gehirns"). NO grid, no loom, no straight lattice lines anywhere.
   - Look: an organic neural network of light hanging in the dark. Nodes = soft glowing somata of varied size (2–14 px core, warm gold `#f3d9a0`, white core
     `#fff8e6`, a faint halo); filaments = curved, tapering, branching dendrite-like strands between nodes (bezier curves, thicker near the node, hair-thin at
     the tip, slight irregular wobble), never straight, never a regular pattern. Density varies: dense luminous clusters, sparse dark gaps.
   - Shape: seen whole, the cloud of nodes reads as a brain: two soft hemispheres side by side with a faint central cleft and loose gyri-like curls in the node
     distribution (silhouette only, made of the network itself; never an anatomical brain drawing, never pink, never a skull). Close up it is pure network.
   - Alive: signals (small bright pulses with a short tail) travel along filaments all the time, a slow breathing of brightness (period 3–5 s), nodes twinkle
     softly with stagger. Old memories = dimmer, deeper nodes that stay.
   - "Stitch" (a new memory arrives) = a new node sprouts with a soft flash, two to four filaments grow out of it (0.4–0.6 s, expo-out) and connect to neighbours,
     the neighbours light up 60–120 ms later. A tiny engraved glyph (speech bubble, envelope, check mark, crossed-out line) may sit next to a NEW node for ~1 s,
     then fades into the node; never text.
   - Knowledge in people's heads (01a): each person carries a small cluster of nodes above the head; when someone leaves, their cluster's filaments to the rest
     stretch and snap (thin sparks) and the cluster goes with them. In the A.I.-native company all clusters are wired into one shared network that stays.
   - "Query" (queryable, 01a) = a wave of signal pulses races through the whole network from one node.
   - Failures (02a–02b) = dark rust nodes `#7a3b2a` with dead (grey, broken) filaments; the night firefly visits each, the filaments reconnect and the node turns gold.
   - API names stay the same (`weave`, `stitch`, `knot/untie`, `pulse`, `ghost`, `tear`) so scenes keep working; only the drawing changes.
2. **The fireflies** = the hands (the agents). Small engraved lights with a soft cool-green glow `#b9f0c8` and a brighter core, each trailing a short luminous stroke.
   They fly out of the weave, do the work (a tiny engraved task: a letter sealed, a gear turned, a line on a chart drawn, a bug in a row of code-like dashes fixed —
   abstract, never real UI), and fly back to weave a new thread in. They never sleep: the night is their element. They are never faces, never robots, never eyes.
   The second agent at night (02a–02b) is one firefly that drifts slowly over yesterday's failures (dark knots in the weave) and quietly unties each one.
3. **The conductor** = the will. One human figure at figure scale, seen from behind or in profile, standing in front of the weave with one hand raised, the only warm
   light in the frame (amber `#ffb35c`, like the fire in the style reference). The fireflies move like an orchestra around the raised hand. The conductor holds no
   instrument. "Somebody has to want something" is shown by the hand lifting, and the swarm turning toward it.
4. **The workshop** = the whole company (organs assembled). A small engraved house or workshop alone in a wide night landscape; its windows glow with the weave,
   fireflies drift around its roof, one figure stands in its lit door. In the hook it is a mysterious lit building "with almost no employees"; in 04a it is the
   assembled organism; in the end it multiplies.
5. **The many lights** = who gets the organs. Seen from far: a landscape at night with many small workshops lit (millions), versus one single giant tower of light
   with everyone else as dark silhouettes outside its glass (the fork, 06a). The final image (10a, endcards) is the landscape of many small lights under the
   Milky Way, calm, with free space left and right for the endcards.
Supporting language: **paper and ink** for everything quoted or measured (quote cards Q1/Q2, the Shopify rule as a typed memo, App Store and Kenya numbers as engraved
chart cards with a source line, the World Bank report as a printed cover, India's price as a stamped tag). **Engraved landscapes** for places (Austin skyline at dusk,
a Kenyan market street, a farm, a workshop, a bakery street of one city) always with people at figure scale.

## Signature moves (use them at ★ shots and at chunk boundaries)
- **The anatomy reveal**: the workshop opens like an engraved anatomical plate: walls lift away in layers (0.8–1.2 s, quart in-out), revealing the weave inside, the
  fireflies around it and the figure in front, each labelled with a thin leader line and Inter caps (`MEMORY` · `HANDS` · `WILL`). It is the film's map, used in the hook
  (00a "take one apart … organ by organ") and reversed in the finale (10a "put it back together").
- **The thread weaves in**: a thread of light flies in, threads itself into the lattice with a small bright stitch (stagger 40–80 ms), and the surrounding threads
  tremble 60 ms later with smaller amplitude. Sound: a soft glass `chime` or `foil_glint`.
- **The firefly carries**: a firefly lifts off one surface and flies to the next scene, landing as its first light (the question carrier at section ends:
  "Who acts on it?", "What are people still for?", "How many conductors?" …).
- **The baton lift**: the conductor's hand rises (0.6 s, expo-out) and the swarm turns toward it 80–120 ms later, settling into an ordered pattern.
- Transition types: (a) continuous take with a camera path, (b) fly into a surface (a window, the weave, a firefly's glow, a card) and the next image grows out of it,
  (c) morph of a line (a thread becomes a chart line, a road, a skyline), (d) exact match cut. Nothing else.

## Smooth motion (REVISED after Jakob 2026-10-23 12:04: "die Animation teilweise noch etwas ruckelig")
Measured on minute 1: the frame cadence is clean (no duplicate or dropped frames); the jerkiness is speed contrast. Very fast camera lurches (whole-frame change
6–20× the calm level, e.g. the pull-backs at 6–8 s, 36 s, 46–47 s, 52 s, 65 s) sit between almost static holds. Rules from now on:
- Camera moves (push-in, pull-back, crane, fly-into) last at least 1.6 s, hero/plate dives at least 2.0 s, always quart in-out or a gentle S-curve. No "whip",
  no very fast pull-out. If a move cannot fit between two words, start it earlier (in the previous sentence) instead of making it faster.
- Every move eases in AND out; no move starts at full speed or stops dead. Holds keep a slow drift (camera float plus 1–2 % slow push), so motion never jumps
  from 0 to fast.
- Measure before reporting: mean absolute frame difference on a 320×180 grayscale render, per frame. Target: no frame above 12 outside the handoff plates, and
  frame-to-frame change of that value smooth (no single frame > 2.5× its neighbours). Use tools/smooth.mjs or the snippet in the brief.

## Every frame
- One motif per sentence, and the image shows what the sentence says (understandable without the voice). Faster than one shot per sentence is fine.
- Random-frame test: something is always alive (3–6 parallax layers, drift continues the last momentum, 1–3 % scale, threads shimmer, fireflies drift, stars twinkle,
  grain drifts), and exactly one thing commands attention. Stagger onsets 40–80 ms; never more than a third of the elements moving at once. < 5 % near-static frames,
  no still stretch > 2 s.
- Every keyframe works as a poster: grid, asymmetry, negative space, foreground/mid/background, 2–3 main colours plus neutrals.
- Cause and effect: when A touches B, B reacts 40–120 ms later with smaller amplitude.
- One ★ moment per section at most, at most 2 hard accents per 30 s.
- Nothing fades in half-transparent: objects rise out of the dark as one solid picture (offscreen, darken source-atop), are carried in, or grow out of something there.
  Never more than 0.3 s near-black.
- People: figure scale, seen from behind or in profile, `figure()` with `life()` (breathe, blink, weight shift), `walk()` for real steps, round shoulders, arms natural,
  never behind the back, no close-up hands. The conductor is always the same figure (same coat, same silhouette).
- On-screen text: Instrument Serif (titles, quotes, numbers) + Inter caps (labels, sources). Readable ≥ 1 s at ≤ 12–15 characters per second, mask reveals per word or
  line, never moving while read. Bottom 170 px free (burned-in subtitles). Every study or number carries its source. Running text ONLY on Q1, Q2 and the Shopify memo.
- The clip C1 (Tom Blomfield, 14 s): lower third `TOM BLOMFIELD · then partner at Y Combinator` + `ORIGINAL FOOTAGE`, framed as a print on the dark paper, entering by
  the firefly carry (a firefly lands on the frame and the print lights up), leaving the same way.
- Quote cards Q1/Q2 (5.5 s each, no VO): cream letterpress card `#f3ecda`, ink `#2a2420`, Instrument Serif quote, Inter caps attribution and date.
  Q1: "…the intelligence lives in the system." — Jack Dorsey & Roelof Botha, March 2026. Q2: "2026." — Dario Amodei, May 2025, asked when the first one-person
  billion-dollar company would appear.
- Forbidden: anatomical brains (the network may only suggest a brain silhouette, see above), glowing robot eyes, android faces, circuit boards, binary rain, server-rack corridors, real app UIs or logos as hero, chat bubbles with readable
  text, laptops at night, kitchen tables, cups, phones face-up, calendars, hourglasses, doors as metaphor, everyday routines (calendar entries, emails being typed:
  Jakob 2026-10-23: "detailreiche Alltagsabläufe … fad"). From earlier films: the share certificate, the dome, the curve, the cards I–IV, the mirror, the long table.

## Palette by section (ground / light / accent)
- Hook + memory (00a–01a): deep night indigo `#0b1030` → violet horizon `#2a2350` / weave gold `#f3d9a0` / workshop window amber `#ffb35c`.
- Hands (02a–02c): night blue `#0c1424` / firefly green `#b9f0c8` / failures as dark rust knots `#7a3b2a` that untie into gold.
- Will (03a): stage of night, the conductor rim-lit amber `#ffb35c`, everything else cool; orchestra of fireflies.
- One person (04a–04b): the workshop in a wide landscape at blue hour `#1b2a4a`, Austin dusk `#e7a96b` on the skyline.
- Does it work (05a): sober paper day `#e9e4d8`, ink `#2a2420`, one red mark `#b23a2a` for the falling line.
- Fork (06a): one giant tower of cold white `#e8eef6` vs a landscape of many warm small lights `#ffb35c`.
- Mentor, tools, shared memory (07a–09a): warm dawn `#f1d9a8`, market ochre `#c9893f`, farm green `#5f8f6a`; the shared weave gold over a bakery street.
- Finale (10a + endcards): the anatomy reversed, then the landscape of many small lights under the Milky Way (fire-circle reference).

## Music and sound
Music: one Lyria track per section, `/mnt/project-files/scenario/film-ein-person/audio/music/M0–M10.mp3` (cues in `cues.json`). Sound hooks: entries may carry
`sound: [{ f, t, v, d?, loop? }]` with absolute film times; files from `/mnt/project-files/scenario/sfx-bibliothek/akzent/` and `atmo/`. Accents in speech pauses,
3–8 per chunk. New sounds needed: thread stitch (glass), firefly flutter, anatomy plate lift (paper layers). Name them in your report.

## Gates (in this order)
1. Plan first: comment table per shot at the top of the scene file (VO words, image, hero light, camera, flow into next, ★, sound).
2. Build, then review by looking: snapshots every ~0.5 s around each move and one per sentence. At least 3 review rounds.
3. Seam-check every move and both chunk boundaries with `tools/seam.mjs`.
4. Performance ≤ 300 ms per frame at full size including the finish.
5. Score 1–5: poster quality · sentence = image · seamless · alive · people and props believable · text. Nothing below 4 before you report.
6. Touch only your own `scenes/scNN.mjs` and new `lib/f8_cNN_*.mjs`. Don't commit; the lead does.
