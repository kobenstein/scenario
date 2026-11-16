# Film 4 build brief (shared by every scene builder)

Film: **"You Don't Have to Work Anymore"** (The Good Takeoff, English, ~10 min, 1920×1080, 30 fps).
Guiding idea: *AI won't end work. It will end having to work.* Tone: mystical, wondrous, hopeful, never fear, never kitsch.
Jakob's words for the bar: **"It should simply look like a high-end motion design documentary, varied, so you always stay hooked."** World class, "ein Kunstwerk", every image directly supports the spoken sentence, many fast image changes, object-carrier transitions.

## Where things are
- Code: `/home/user/scenario/films/04-work/` (Node + `@napi-rs/canvas`, pure Canvas2D, every frame a pure function of t). **Do not commit or push; the lead commits.**
- `film.mjs` loads `scenes/s00.mjs … s08.mjs`, `scenes/s03b.mjs` and `scenes/hill.mjs`; each default-exports `async (T) => shots[]`.
  - shot = `{ t, draw(ctx, t, s), tr, d, x, y, r, depth }`. `t` = start time (seconds, absolute). `tr` = transition INTO this shot: `zoom` (camera flies into carrier at x,y → type b), `out` (pull back), `iris`, `match`, `push`, `left|right|up|down` (fast move in one direction → type c), `dissolve`, `cut`, `black` (chapter rests only). `d` = transition duration (default .9).
  - `s.a`/`s.b` inside draw = the shot's own window (incl. transition overlap). Draw full frame each call.
- Timing: `T.S(seg, 'phrase')` / `T.E(seg, 'phrase')` = start/end of a phrase inside VO segment `seg` (ids `00a`, `03b`, … see `/mnt/project-files/scenario/film-04-work/audio/segments.json`); `T.seg(id)`; `T.clip('M'|'S'|'A')` = {start,end}. Word list: `/mnt/project-files/scenario/film-04-work/audio/timing.json`. Anchor every accent to a word (±2 frames).
- Engine helpers: `engine.mjs` (W,H,C,rgba,clamp,lin,mix,sm,eio,eout,ein,sine,prng,drift,canvas,glow,addGlow,text,…), `lib/kit.mjs` (timing, `clipScreen`, `clipLabel`, `quoteCard`, `source`), `lib/world.mjs`, `lib/explain.mjs`, `lib/md2.mjs` (film 3 kit, lower quality — reuse mechanics, not looks).
- **The art level to hit: `lib/art.mjs`** (stipple, halftone, fog, cone, pool, bloom, soften, roughPath/Poly/Rect/Line, hatch, strokes, house, facade, quadMap, person, castShadow, printFinish, stratus, limb, vnoise/fbm). Reference implementations that Jakob approved: `ref/kunst/a1.mjs` (labelled Maslow hill), `a2.mjs` (steep street with workshops), `a3.mjs` (father + daughter, green/orange), `g1–g3.mjs` (explainer graphics). Rendered results: `/mnt/project-files/scenario/film-04-agents/bild/kunst-test/*.png` — look at them first. Concept keyframes (older look, good composition ideas): `ref/keyframes/*.mjs`, PNGs in `/mnt/project-files/scenario/film-04-agents/bild/keyframes-v2/` and `keyframes/`.
- Shot list (what each sentence shows, carriers, palettes): `/mnt/project-files/scenario/film-04-agents/bild/shots.md` §6 (+ §2 hill plan, §3 clips, §4 graphics, §5 motion). **Note:** a few VO lines in shots.md are from an older draft. The spoken text is `/mnt/project-files/scenario/schreibraum/film-04-vo-v2.txt`; always follow the real words, adapt the image idea.
- Approved full text with intent: `/mnt/project-files/scenario/schreibraum/film-04-text-v2.md`. Facts/sources for graphics: `/mnt/project-files/scenario/schreibraum/faktenzettel-film-04.md` and `film-04-faktencheck-v2.md` (Swedish lottery = Cesarini, Lindqvist, Notowidigdo, Östling 2017 AER / Lindqvist, Östling & Cesarini 2020 REStud; retirement = Hetschko, Knabe & Schöb 2014; free time = Sharif, Mogilner & Hershfield 2021; Kenya = GiveDirectly long-term UBI study, Banerjee et al.; flow = Csikszentmihalyi & LeFevre 1989; Bronnie Ware, *The Top Five Regrets of the Dying*).

## Look (hard rules)
- Illustration, not a game: one hero light per image, fog layers, light falling off as fine stipple (cells ≤ 2 px), hatching in shadows, slightly rough edges, varied hand-made shapes, perspective (no frontal symmetric tiles), bold palettes. Every still must work as a poster. Look at a1/a2/a3 before you draw anything.
- Colour code: amber/warm = humans, acting, solutions; cyan = machine/AI/phone (rare in this film, it's a human film); indigo/violet night. Colour arc per chapter is in shots.md §1.
- Figures: `person()` from art.mjs (capsule limbs, round sloping shoulders, rim light on the lit side), faceless, **arms in front of or beside the body, never behind the back**, no stick figures, no pictograms. Figures breathe, shift weight, turn heads, act (pour, plane, row, paint).
- Text on screen only for labels, numbers, names, sources, quote cards: Instrument Serif (headline/numbers) + Inter (labels, caps, letter-spacing). Explainer graphics: indigo ground, cream line with amber glow, source line bottom-left (Inter 16–18, muted). Every study graphic carries its source.
- Forbidden: robots, brains, circuit boards, Matrix code, fireworks, kitsch, crossfade as default, pop-ups out of nothing, frozen frames, doors/keyholes/calendars/hourglasses/candle chains/globes/waiting rooms (used in Film 3), vertical light column in the sky (Film 1), street of blue TV windows (Film 2).

## Motion (hard rules)
- One shot per sentence or faster; long sentences may hold 2 motifs. Jakob wants **many fast image changes** and variety: mix scenic shots, close details (hands, objects) and pure explainer graphics.
- **Every shot change has a carrier object** (shots.md names one per row): (a) an object leaves the frame and lands in / becomes the next image; (b) push into an object that becomes the next image; (c) a fast move continues in the same direction in the next shot (smear/speed ramp, ease-out landing). Roughly 1 in 6 is (c). Implement carriers inside your draw functions (the object really moves across the cut, at the x,y you pass to the next shot's `tr`), not just a `tr` label.
- **Nothing ever stands still**: permanent slow camera drift (`drift()`), parallax layers moving at different speeds (2.5D: 3–6 depth layers with real parallax and slow dolly), fog drifting, lights breathing, figures breathing. No two identical consecutive frames.
- Slow in / slow out, arcs, anticipation before accents, follow-through. Long glides 2–4 s against few hard accents (≤ 2 per 30 s). One wow moment per chapter (marked ★ in shots.md).
- No whip pans as a default; (c) handoffs are deliberate.

## Performance (hard rules, the whole film must render in reasonable time on 4 CPUs)
- Build every expensive static layer (stipple, fog, hatch, houses, facades, sky) **once** into offscreen canvases at module init/first use (cache by key), then per frame only composite them with transforms + cheap animated elements. Target **≤ 250 ms/frame average** for your chapter at 1920×1080; measure with `node render.mjs --out /tmp/x.mp4 --from A --to B` (prints ms/frame).
- `person()` allocates a canvas per call; for figures that move every frame keep the count small or cache pose frames; check memory stays flat over ~300 frames (`/usr/bin/time -v`).
- @napi-rs/canvas gotchas: `createPattern` and `globalCompositeOperation='copy'` leak native memory per frame (never use per frame). `arc` with start≠0 and sweep exactly 2π draws nothing. JPEG decode is async (clips are handled by kit's prepareClips).
- Deterministic: no Math.random / Date.now; use `prng(seed)`.

## Review loop (do it, it is how quality happens)
1. Before coding: write the carrier chain for your chapter as a comment at the top of your file (shot → carrier → next shot, type a/b/c).
2. Snapshots: `SECS=03 node render.mjs --snap 130,131.5,... --dir /tmp/claude-0/-home-user-scenario/779f010c-846c-5697-a605-6866c90a5774/scratchpad/snaps/s03 --scale .5` — every 0.5–1 s across your chapter plus every accent and every transition midpoint. **Look at them** (Read the jpgs). Ask: Is it beautiful like a1/a2/a3? Does it show exactly what the sentence says? Is the carrier visible? Is anything frozen? Would Jakob say "Computerspiel"? Fix and repeat at least 2 rounds.
3. Render a short mp4 of your hardest 10 s to check motion and speed.

## Ownership
- You only create/modify the files named in your assignment (your `scenes/sNN.mjs` and any new `lib/sNN_*.mjs` helper files you create). Do not edit `engine.mjs`, `lib/art.mjs`, `lib/kit.mjs` or other chapters' files; if you need a shared fix, copy the function into your own helper file and note it in your final report.
- Your chapter's shots must start exactly where your chapter's first VO segment begins (first shot `t` = previous chapter's handoff; use `T.seg(firstSeg).start - 1.0` for chapter 00 use 0) and the last shot runs until the next chapter's first shot. Chapter boundaries: the next chapter's builder starts its first shot at `T.seg(<its first segment>).start - 1.2`, transitioning from your last frame with the `tr` named in shots.md. Your final carrier should be centred and simple so the handoff reads.
- The labelled Maslow hill appearances are built by the hill builder (`scenes/hill.mjs`), whose time windows you must leave free (listed in your assignment).

## Final report (short)
Carrier chain, ms/frame measured, 4–6 snapshot paths that show your best frames, known weaknesses.

## Interview clips (original footage, light frame, shots.md §3)
- Frames: `/mnt/project-files/scenario/film-04-work/clips/<ID>/f00001.jpg…` (30 fps, native size; appear shortly), audio is mixed separately. Info: `/mnt/project-files/scenario/film-04-work/audio/clips.json` (who, role, quote, cues). `T.clip(id)` gives the slot.
- **M (Musk) and A (Altman) are vertical 608×1080 sources**, S (Suleyman) is 16:9. Design the frame for that: a tall portrait frame (rounded 12 px, cream hairline 35 %, soft shadow) placed in the scene, the scene keeps drifting dimly beside it; name label (amber bar, name in Instrument Serif, role in Inter caps) beside the frame; burned-in clip subtitles are added later by the lead (leave the lower 160 px free during clips).
- `kit.mjs` `clipScreen()` draws frames into a rect (check how it handles aspect; copy into your own helper if you need a different treatment).
