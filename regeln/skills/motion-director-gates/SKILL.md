---
name: "motion-director-gates"
description: "Use with any motion design / explainer video build (code or AI video). Adds the hard gates that turn good motion principles into a reference-level result instead of a slideshow."
---

# Motion director gates

Use together with the world-class-motion-design principles. Those say WHAT good motion is. These gates make sure it actually happens. Do not skip a gate.

## Gate 1: Read the reference for space, not for objects
- Make contact sheets at 6 fps of the reference (first 20 s is enough).
- Write down for every ~2 s: camera move (push, truck, orbit, fly-through, pull-back), depth layers (blurred foreground, sharp mid-ground, slow background), and how the shot hands over to the next one.
- Count the scene changes. If your plan has fewer than about one per 2 s, it will feel like slides.
- Insight: references often use **flat 2D shapes inside a 3D space**. Copy the space, not the shapes.

## Gate 2: Plan on paper before code
Write into PLAN.md: Motion DNA, a through-line (one object or idea that opens AND closes the piece), the beat sheet, a transition map (the carrier for every boundary) and the onset order. Exactly ONE wow moment. No code before this file exists.

## Gate 3: Choose a tool that can do the camera
- If the reference moves through space, a flat 2D stage (SVG, plain canvas) is the wrong tool. Use a real perspective camera: Three.js (rendered frame by frame in headless Chromium), Blender, or After Effects 3D.
- Put flat art on planes at different depths. Give each object its own depth-of-field blur, add parallax and glow.
- Say it openly if the tool cannot reach the reference look. Do not build anyway.

## Gate 4: Carrier-driven camera
- One hero carrier (orb, line, spark) is on screen almost always.
- Compute the camera from the carrier's path: the look target is the carrier's average position over the last ~0.2 s plus a lead in its direction of travel; the camera body is the average over the last ~0.4 s. Result: motivated pans and perspective shifts, and the camera never overtakes the carrier.
- Transitions are carrier actions: merge, contact, flood mask from the impact point, flight into an object, cloning into many.

## Gate 5: Compute causality, do not hand-time it
- Reactions are derived from the carrier's position: a segment lights in the frame the carrier passes it; fills spread from the exact contact point, 40–120 ms after contact.
- Check the carrier's speed numerically. It must never hit zero unintentionally; arrivals glide into a breathing hold.

## Gate 6: 5-second test before the full film
Render only the first 5 s at final quality and get approval on the look and the camera. Only then build the rest in the same system.

## Gate 7: Review frames before every render
- Keyframes every 0.33 s plus every transition.
- Fix before rendering: empty frames, the carrier leaving frame, clumping, the camera flying through objects, text readable for < 1 s, any frame that could be a slide.
- After the render: a contact sheet of the whole film, plus 2–3 full-resolution frames of the hero moments.

## Gate 8: Voice-over drives the picture timing
- Generate the VO with word timestamps. Then time the picture events (cards, numbers, claim words) so the key word lands on the frame the visual appears (±0.1 s).
- Retime the picture to the voice. Speed the voice up by at most ~10 %.
- Mix: duck the SFX bed about 6 dB only while the voice is speaking. Voice about 4 dB above the bed. −16 LUFS integrated.

## Gate 9: Honest self-check
Before delivering, estimate the similarity to the reference in % and name the biggest gap. Under ~70 %: fix it or say so plainly.