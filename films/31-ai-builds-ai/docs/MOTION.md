# Film 31 · "Superhuman AI Is Coming Next Year" (working title; AI builds the next AI) · motion bible (lead, 2026-11-17)

Channel The Good Takeoff (Scenario). Release Wed 18.11.2026 17:00 Vienna, 1080p30, ≈ 11:00 + 15 s end screen. Style: flat editorial grain
(`/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`, skill `scenario-motion`): deep indigo night, ONE warm light form, a tiny
faceless figure in a yellow raincoat = you. Everything is code (2.5D depth cards, `lib/f10_editorial.mjs`); no AI images, no 3D game look,
no logos, no real faces outside the interview clips.
Script: **`<ROOT>vo-final.txt`** (fact-checked; clips T2, T1a, T1b, T3 = Tao Lin, K3 = Pachocki card). Plan: `docs/shots.md` +
`docs/BRIEF-builders.md` · hook reference `scenes/sc01.mjs` (`<ROOT>bild/c01_kontakt.jpg`) · kit sheet `<ROOT>bild/kit31_kontakt.jpg`
(`node tools/kit_sheet31.mjs <dir>`). Film 59 (the process and quality reference) lives in `docs/ref-59/`.

## 1 · Intent
- **Audience:** people who saw "AI is building AI" / "superhuman AI next year" and want to know how close that really is.
- **The single message:** *machines now do the building; people still do the deciding.* A.I. stands on a ladder of five rungs: two taken
  (code, experiments), one shared and forecast to be taken next year (leading research), two still human (the goal, the brake).
- **Mood:** calm, precise, fair. Every number carries its source (most come from the labs themselves). Not doom: the top of the ladder is
  ours, and the film ends on the human decision.
- **Explainer share 60–70 %.** Weights as in film 59: EXPL 1 · MIX .5 · WORLD .3 · SCENE/CLIP 0.

## 2 · The world: THE NIGHT FOUNDRY (one place, no other worlds)
A dark workshop open to the night sky, where small lit machines assemble the next, bigger machine. `lib/f31_world.mjs` · `foundry(ctx, c, t, st)`.
- **THE NEXT MACHINE** (Z 6000, right of centre at home, r 330): a giant ring held in **the gantry** (two lattice towers, a crossbeam,
  cables). It is unfinished: plated outer ring (`build` 0..1, missing plates show as a dashed blueprint), a turning middle ring, the forge
  iris at its heart. **Its core is the ONE hero light** of the film. A machine is always a circle, never a robot or a brain.
- **THE BUILDERS:** small circle-machines with one forge eye and an arm; they circle the ring and weld the next plate (sparks). Machine work.
- **THE MACHINE YOU USE TODAY** (hall, Z 3800, left, on a plinth): smaller, finished, calm cool light. A forge **thread** runs from it to the
  builders, pulses travel toward the new machine: *it builds its successor.* (vo: "one of the last A.I. models designed by human minds".)
- **THE HALL** (Z 3800): cranes with warning lights, floor rails, carts that carry plates to the gantry (a slow steady loop = nothing stands still).
- **THE WORKSHOP** (F0, floor top y 975): **your bench and your lamp** at the left (warm; it goes OFF on "When you turn off the light tonight",
  the foundry keeps working), **you** (640, 972, h 150) looking up, and **THE LADDER** (foot (800, 975)) that reaches up INTO the machine's core (its height and
  lean follow the projected core point, `reach`; with `glow` 1 it is a ladder of pure gold light).
- **FRAME 0 = thumbnail A** (`<ROOT>../thumbnails/film-31/f31-a-superhuman-2027-1280.png`): the big golden ladder of light rising into the
  light, the tiny yellow coat at its foot, title "SUPERHUMAN / AI: 2027" (`HOOK_CAM`). The machine sits high (MACH y 220).
- **Plates** (`lib/f31_world.mjs`, the shared look at group seams): `plateLadder` ('Picture a ladder', LADDER_CAM, lamp off, ladder of
  light), `plateClimb` ("So don't take Anthropic's word", WIDE_CAM, rungs 1–2 taken, 3 shared, HUD), `plateMachine` ('Their scenario, late',
  MACH_CAM, ring build .94).
- **THE LADDER = the anchor** (three forms, one object): in the world (`st.ladder`), as a full-frame explainer (`F.ladder`, labels + tags),
  and as **the HUD** top left (`F.ladderHUD`, drives itself from `F.LADDER` phrases, sinks during clips and subscribe calls).
  Rungs: 1 CODE · 2 EXPERIMENTS · 3 LEADING RESEARCH · 4 THE GOAL (small flag) · 5 THE BRAKE (small lever). State per rung:
  forge = taken by the machine, cream = held by people, half forge = shared, dashed cool = forecast. A small builder machine climbs it (marker).
- **Explainers float over a night veil** (`F.veil` + `F.float`) while the camera keeps gliding behind (film 59 method).
- **Clips** (Tao Lin T2 6.7 s, T1a 33.0 s, T1b 11.9 s, T3 4.7 s; `<ROOT>clips/Tn.mp4`) grow out of a light in the scene (the old machine's core, a builder's eye, the
  monitor eye) with `F.clipPlate(…, { from })` and go back into it. K3 (Pachocki) is a paper quote card read by the narrator.

## 3 · Motion DNA (owner rules, binding)
1. **Calm choreography.** At most ~1 hard world change per minute (plan: 0, everything happens in the foundry). One main movement at a time:
   when a card moves, the camera only creeps; when the camera travels, cards hold (float only).
2. **A carrier for every transition** (write it into your header table before you code): the lamp → the machine's core; the thread → a
   rung lighting; a rung → the full-frame ladder → the HUD; a builder's eye → a clip plate → back; the core → the ring of 26 %; the agent
   windows of the swarm → the hall windows; the monitor eye ↔ a builder's eye.
3. **Nothing appears from nowhere; no ghost fades.** Things grow out of a thing (rise/mask wipes, plates slide in along their arc, rungs fill
   from the left, cards slide out of a tag). Alpha only as a quick 0→1 in ≤ .3 s together with a geometric move.
4. **Nothing stands still.** `camDrift` + `F.float`; the core breathes and pulses inward ("thinks"); the rings turn; builders orbit; carts
   roll; cables tremble; crane lights blink slowly. Check frame differences: no two identical consecutive frames.
5. **Speed:** big area changes ≥ 1.8 s with sineIO (smooth.py flags LURCH > 12); small hits (a rung fills, a stamp, a tag) ≤ .3 s on the word.
6. **One wow (★) per chunk.** Candidates: the lamp goes off and the foundry keeps glowing (hook) · the rungs 1–2 light (climb) · the ring
   jumps <1 % → 26 % · the forecast marker slides from end 2028 to May 2027 · the machine's last plate locks (rung 3 forecast) · pull back:
   you tiny at the foot of the ladder, the top rungs still cream (end).
7. **Thumbnails show only what the film shows:** the home frame (`HOME`) is thumbnail-ready (the ring big, the ladder, you small).

## 4 · Palette and type (`lib/f31_kit.mjs`)
Ground: nachtblau/indigo (`P.night0/1`, `P.ind0/1`). **THE accent colour of this film: GOLD** (`F.FORGE` = `F.GOLD`: body `#f6c95c`, hot `#ffe9a6`,
core `#fff8dc`, halo `#f2b632`, as in the thumbnails): the next machine's light, machine work, the machine's share in every number (9 of 10, 26 %, 1.9×). `GOLD` is an alias.
- **Cream (HUMAN)** = what people hold (rungs 4 and 5, the human card among the ten, flagged cases going to a person).
- **COOL** (pale blue) = checking and forecasting: the monitor eye, the independent evaluators, the forecasters' band and markers.
- **The yellow coat** = only you. **PAPER** = quotes, fine print. Never two lights of hero strength in one frame: the old machine stays dim.
Type: Inter (labels, caps, spacing .1–.2) and Instrument Serif (quotes, big numbers). Text ≥ 22 px at 1080p (sources 15–19 px), held
≥ 1.5 s, ≤ 6 words per statement except verbatim quotes. On-screen wording ONLY from vo-final via `F.SOURCES` (checked):
"Some insiders now forecast", METR 1.9× "on benchmarks", the AI 2027 scenario is "not an official one", "stocks up thirty percent".

## 5 · Frame safety
- **Burned-in subtitles** take the bottom 170 px: nothing important below y 880. Sources at y ≈ 870 (`F.source`).
- **No QR overlay anywhere.** No donation / support overlay.
- The HUD lives at x 60–480, y 40–300; full-frame explainers keep that corner free while the HUD is on.
- Clip frames: `F.clipPlate` (rounded plate, name / role / date label, ORIGINAL FOOTAGE (source)); clip subtitles are the burned-in track.
  Tao Lin is labelled **"Researcher at Anthropic · personal view"** (his view, not his company's).

## 6 · Camera
2.5D cards: `E.aim(Z, u, v, s, sx, sy)` puts card point (u, v) at screen (sx, sy) with scale s relative to home. `F.camPath(t, K)` (ref
depth 6000: it works when the camera flies past F0 into the hall). Keys on phrases only. Named cameras (`lib/f31_world.mjs`): `HOME`
(thumbnail), `WIDE_CAM` (the whole foundry, you tiny), `MACH_CAM` (the ring big), `LADDER_CAM` (the ladder with labels, clear of the core),
`BENCH_CAM` (your lamp), `OLD_CAM` (the machine you use + the thread), `END_CAM` / `END_TILES` (end screen). Plus `HOOK_CAM` (frame 0). Seam
plates use `creep` (4 %/s) / `trk` (30 px/s), see `docs/BRIEF-builders.md`.

## 7 · Gates (before you report)
Stills every ~.5 s around every transition (`node render.mjs --snap …`), a contact sheet of the chunk, `tools/calm.py` (0 cuts) and
`tools/smooth.py` (0 flagged) on the rendered chunk, `node tools/seam.mjs --at <T0>` at your group seams. Hero light clear in every frame;
every still a poster; grain subtle (phone screenshot test); every number on its word (±2 frames) with its source on screen.
