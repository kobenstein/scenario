# Film 68 · "The AI Race Will Be Decided by 2027" · motion bible (lead, 2026-11-25)

The Good Takeoff · English · 1080p30 · 582.6 s narration + 19 s tail (≈4 s air + 15 s end screen) = 601.6 s.
ROOT = `/mnt/project-files/scenario/film-ai-race/` · real VO timing `<ROOT>audio/timing.json` + `slots.json` · style `stil/STIL-editorial-nacht.md`.
Engine = Film 66/67 (Node + @napi-rs/canvas, `lib/f10_editorial.mjs`); kit `lib/f68_kit.mjs` (re-exports `lib/f67_kit.mjs`);
sequencer `film.mjs` (shots from `scenes/plan.mjs`, resolved on the VO by `scenes/resolve.mjs`); shot list `docs/shots.md` (`tools/shots68.mjs`).
No builder subagents were available: the lead built all seven chapter files (`scenes/ch_*.mjs`).

## 1 · Intent
One line: **The race between America and China is level (2 : 2), and the finish line is AI doing AI research, which a new forecast puts
in 2027. The real danger is the third lane: the AI itself. The only win is everyone crossing together.**
Mood: calm, editorial, night. The viewer is "you": a small faceless figure in a yellow raincoat.

## 2 · Motion DNA (calm × sharp)
- Energy: calm explainer, one motif per sentence, every element tied to a spoken phrase (`K.phr`: G/U/IN, lead ≈ .35 s).
- Easing: expoOut landings, sineIO moves, never linear (except constant rotation and runner strides).
- Camera: one slow motivated push or pull per shot (`K.shotCam`, z 1.00 ↔ 1.08) + drift; one big camera move in the film (p8 tilt).
- Shapes: flat grain-free night shapes with gold/cyan light (`halo`), Inter caps labels, Instrument Serif numbers.
- Colour code: America muted steel blue `#7f9fd8` · China muted terracotta `#d9805f` · Europe pale lilac · the AI = cyan orb `#8fe6ff`
  (never a robot; robots only literally in the R4 sprint) · GOLD = the scoreboard, numbers, the baton · the yellow coat = you.
- Finish: grain 14, floor 4, vignette .5 (`edFinish`).

## 3 · Through-line and carrier
- Leitbild (only 4 anchors): the night stadium with the giant scoreboard AI RACE. h1 (2027 rolls in) · r4f (2 : 2, the third lane strip
  still dark) · p8 (WOW: the third lane floods cyan, THE THIRD RUNNER: THE AI ITSELF) · e1 (end: "everyone crosses together" → "for everybody").
- Carrier at every shot boundary: **the baton**, a gold point of light. It leaves shot A at its `out` point, flies an arc (.45 s) to B's
  `in` point; B grows as a soft-edged disc from the landing point (.7 s, feather 120 px, gold rim). A mask, never a crossfade.
  Planned hard cuts: 0 (0.00 / min). Clip plates grow out of the previous shot's `out` point and shrink back into it.

## 4 · The one WOW (p8, ~6:29)
The board's dark third-lane strip floods cyan (cyan wash, floods dim), label THE THIRD RUNNER: THE AI ITSELF; the camera tilts down
following the disc as it drops from the strip into lane 3 below; the two national runners push it and it accelerates past them.
Sound: shimmer_rings on "lit up".

## 5 · Explanatory share (REGELN §13.2)
67.3 % (EXPL 365.5 s · MIX 78.8 s · SCENE 118.0 s · CLIP 39.4 s), computed before animating and unchanged after the build.
Clips (original sound, lower third NAME · role · year · ORIGINAL FOOTAGE): C1 Schmidt 10.2 s · C4 Kokotajlo 18.4 s · C5 Chan 7.1 s = 35.7 s (5.9 %).

## 6 · Rules kept
- Text only for numbers, names, sources, 1–5 word labels; on-screen text stays above y ≈ 920 (burned subtitles sit at y ≈ 935–1005).
- Sources at y 880 on every data shot; paraphrases marked (Gill: PARAPHRASED; Bessent: AS STATED BY WASHINGTON).
- Robot sprint animated, no news footage: Tiangong Ultra 9.39 s, Bolt 9.58 s, 22 Aug 2026; the stretcher robot is not named.
- Last 15 s: calm end image; board pulled up to the top, the end-screen tiles (left/right 640×360 at y 600, subscribe circle 960/900 r 80)
  stay free and calm.

## 7 · Skills used
world-class-motion-design, motion-director-gates, fluid-motion-design, scenario-motion (colour code, the figure, the AI as a disc),
dataviz (one axis, colour by entity, direct labels). No ad skills.
