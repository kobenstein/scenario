# Episode 01 · scene build guide

One composition (`index.html`, 730.88 s, 30 fps) renders the whole episode. `engine.js` owns the renderer, post-processing, grain and the paper kit. Each beat is one module in `scenes/`, and its time window is fixed in `scenes/index.js`. A missing module renders as a placeholder.

The style rules come from the skill **scenario-motion** (paper diorama, a hero light in every image, amber for humans and cyan for the machine, nothing ever stands still, a carrier for every cut, one wow moment per scene, the 12 principles, subtle grain). Read `style-tests/b3-fast/index.html` as the quality bar: what it does per frame is the minimum a scene must reach.

## Scene module contract

```js
// scenes/s05-2028.js
export default {
  build(E, def) {          // def = { id, from, to } in GLOBAL seconds
    const { THREE } = E;
    const scene = new THREE.Scene();
    const camera = E.newCamera();          // FOV 35
    // ... build everything here, deterministic (E.rng(seed), never Math.random / Date.now)
    return {
      scene, camera,
      post: { bloom: 0.4, exposure: 1.15 }, // optional, may be mutated in update
      update(t) { /* t = GLOBAL seconds, def.from <= t < def.to */ },
    };
  },
};
```

- **Timing:** anchor every accent to a word with `E.at(section, "phrase", n)` (word start) or `E.end(section, "phrase")` (word end). Never hard-code seconds. The sections are `hook why scenario fork endings solutions yourpart`.
  - Words come from STT, so numbers appear as written in `timing.json` (e.g. `twenty`, `twenty-eight.`, `80%`?). Check spellings with `python3 -c "import json;print([w['w'] for w in json.load(open('timing.json'))['words']])"`.
  - The match is case-insensitive, ignores punctuation, and also works for phrases.
  - Accents land within ±2 frames of the word; after each accent hold at least 0.8 s; at most 2 hard accents per 30 s.
- **DOM text:** create it on `E.layer` during build (the engine shows it only while the scene is active). Use these helpers:
  - `E.stampDOM(layer, [{t, year, label}], outAt)` is the year stamp top-left. It rolls on each key.
  - `E.tagDOM(layer, {title, sub, inAt, outAt, cyan})` is a label with a rule. Call `.place(x, y)` each frame from `E.project(vec3, camera)`.
  - `E.srcDOM(layer, {big, small, inAt, outAt})` is the fact or source caption top-right (the ON SCREEN lines of the script).
  - `E.chapterDOM(...)` is the chapter word (REPORT / TEST / BRAKE / RULES).
  - `E.titleDOM(...)` is a centred title.
  - `E.fillDOM(layer, hex)` is a full-frame colour flood for FILL carriers.
  - Call each helper's `.update(t)` every frame.
  - Text in the image is only years, places, names, numbers and sources, never whole sentences. Subtitles are burned in later at the bottom, so keep the lower 140 px free of important text.
- **Kit (engine.js):**
  - Easing: `rng clamp lin smooth lerp expoOut inOut sineInOut backOut spring antic wob`.
  - Colours: `C`; palettes `PAL.night / grey / dawn`.
  - Paper: `paperMats paperMat extrude rectShape circleShape ringShape polyShape roundRectShape box glowPlane drawnCard cutoutText`.
  - Stage and light: `stage(scene, pal, opts)`, which returns `{update(t), floor, sky, orb}` (call update every frame); `lights(scene, pal, opts)`; `pointLight`.
  - Layouts: `popLayer`, `skylineShape`, `randomPick`, `city(parent, pal, opts)`, `tower(opts)` (floors light up with `userData.setFloor(i, k, hex)`).
  - Characters: `figure(opts)`, posed via `userData.pose(t, {lean, reach, lookUp, turn, walk, armUp})`; `machineEye(opts)`, animated via `userData.update(t, {open, glow, leak})`; `machineRings`.
  - The flipbook: `flipbook(opts)`, driven by `userData.update(t, {flip, spread})`; redraw pages with `userData.redrawPage(i, fn)`.
  - Camera: `camPath(keys, t, opts)`, which gives arcs, drift and an endless push; `applyCam(camera, cam, roll)`; `project`.
  - You may add scene-local helpers in your own module. Do NOT edit `engine.js`, `index.html` or `scenes/index.js` (other scenes depend on them). If you need an engine change, write it in your report.
- **Never still:** every frame differs from the last. The camera always drifts, layers breathe, lights flicker a little, rings and pages turn, and figures breathe.
- **Performance:** keep about 1 shadow-casting directional light at 2048 plus at most 1–2 shadowed point lights. Do not use more than about 400 meshes; use InstancedMesh for crowds and windows. Redraw canvas textures only when their content changes.

## Carriers between scenes (both sides must match)

| Cut | End of scene A | Start of scene B |
|---|---|---|
| s01 → s02 | The flipbook slows; the camera pushes into the top page until a cream **PAGE** fills the frame (page centred, facing camera, ≥ 100 % width). | Starts on the full-frame cream PAGE, which is the typewriter page; the camera pulls back to reveal the 1965 desk. |
| s02 → s03 | The report page is centred and facing the camera at the **PAGE** framing (`E.PAGE`: 16×9 page at `E.PAGE.dist`), with the % figure in its margin. | Starts on the same report page at the same framing; it unfolds into Lena's office. |
| s03 → s04 | The research hall folds into the **closed flipbook**, centred, cover facing the camera, about 45 % of the frame width, slightly below centre (y ≈ 46 % from top). | Starts with the same flipbook at the same screen spot; it opens. |
| s04 → s05 | The flipbook turns steadily in the dark; the camera pushes into one page until a cream **PAGE** fills the frame. | Starts full-frame cream; the page turns away (rotating left around its left edge) to reveal Lena's bigger 2028 office. |
| s05 → s06 | The question card (cream, with a hand-cut "?") lands on Lena's desk; the camera pushes in until the card is centred and fills about 60 % of the frame width. | Starts on the same card centred at about 60 % width; it unfolds into the two-door pop-up. |
| s06 → s07 | The camera pushes into the open **cyan** door until cyan light floods the frame (FILL `#bff4ff`). | Starts in the FILL; the camera pulls back out of the light into the cold grey world. |
| s07 → s08 | The cyan door opens with amber light inside; the camera pushes through until warm **gold** light floods the frame (FILL `#ffd9a8`). | Starts in the gold FILL; the camera rises above the towers at dawn. |
| s08 → s09 | Morning light on the workbench with the half-built brake lever; the camera settles at eye level with the bench edge as a **horizon line at 60 % of frame height**, dawn sky above. | Starts with the airport runway horizon at 60 % height under the same dawn sky. |
| s09 → s10 | The sieve: one big note caught, centred; the camera pushes in until that cream note fills about 60 % of the frame width. | Starts on the same cream note at about 60 % width; it is the exam booklet cover. |
| s10 → s11 | The paper net on its single peg; the camera pulls up so the net's top rope becomes a **horizontal line at 55 % height**. | Starts on the long straight road at sunrise, with its horizon at 55 % height. |
| s11 → s12 | The camera tilts **up** into the dawn sky until the sky fills the frame. | Starts tilted up in the dawn sky; the camera tilts down onto the scroll of promises. |
| s12 → s13 | One amber figure steps forward from the crowd; the camera pushes in until the figure is centred, about 40 % of frame height. | Starts on the same `E.figure({pose:"stand"})` at the same size and spot; the camera pulls back to the exam desk at dawn. |

Inside a scene, every change of motif also needs its own carrier (a form becomes the next form, a light moves, a line runs on, or the camera flies into an object). No crossfades, and nothing pops out of nothing.

## Review before you report

1. Render stills with `node tools/snap.mjs --dir episodes/01-intelligence-explosion/film --t <times> --out <scratch dir>`. Use every 0.5–1 s of your window plus every accent, the first and last frame, and a frame 1/30 s apart to prove motion. Look at them (Read the JPEGs).
2. Check:
   - Is the hero light clear in every frame?
   - Is every still a poster?
   - Do the accents sit on the words?
   - Does the carrier match the table at both ends?
   - Is there any frozen frame?
   - Is the text legible?
   - Are the colour meanings respected?
3. Fix and repeat until it holds up. Then report the scene's wow moment, its timings, and any engine change you'd need.
