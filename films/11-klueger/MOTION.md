# Film 11 · MOTION · "How Superintelligence Will Make You Smarter"

The image language of Film 11 (binding for every chunk). The shot list (`/mnt/project-files/scenario/film-klueger/bild/shots.md`) says what is seen in each
sentence; this file says how the film looks and moves. The kit that draws it is `lib/f11_kit.mjs` (its header is the API).
The motion DNA of Films 5–7 still applies (easing, cause and effect, onset order, nothing half-transparent, people alive); Film 11 adds RUHE (calm) as a hard rule.

## §1 The world: ONE gym of light
- One continuous world for the whole film: an old timber hall, half school gym, half atelier, in warm afternoon light. Never neon, never a gaming or sci-fi look,
  never dark. It is a real 3D room in metres (`view3`, `hall`), so every move is a true camera move and every place of the film is a spot in this hall.
- Geometry (`HALL`, x right −11…11, y up 0…10, z into the hall −4…40):
  - left wall (x = −11): six tall arched windows (`WINDOWS`), the sun comes through them; sun patches per pane on the floor, light shafts with slow dust.
  - right wall (x = +11): the mirror wall (`MIRROR`, z 4.5…31.5, y 0.3…3.1) with brass frame; wall bars (Sprossenwand) near the back.
  - back wall (z = 40): the blackboard (`BOARD`, chalk content in board cm via `o.board`), the pinned city map (`MAP`), the round window (`OCULUS`).
  - floor: honey planks; the Go grid inlaid like a court marking (`GO`, 4.5 m, 19 lines, x 4.6…9.1, z 18.4…22.9); the exam desks (`EXAM`, groups C · A · B
    left to right, 3 × 5 desks each, x −8.6…4.4, z 14.6…24.6).
  - your place: `YOU` (9, 0, 15) in front of the mirror, facing it (+x); `MACHINE` (8.4, 0, 15.45) just behind you (−x, a little deeper).
  - ceiling: trusses (`TRUSS`) with pendant globe lamps.
- All evidence lives in or at the hall, as objects: the Turkey exam on the desks and the board, the map (GPS), the doctors' stacks and coats, the mirror (the
  programmers' belief), the forklift, the Go board with the line of 66 years, the Harvard tutor's steps, the Anthropic test sheets, the Nigeria classroom in a
  window of the city. Quotes are paper cards pinned to the board or the wall.
- From 06a the hall grows street by street into a city (the hall stays its centre; windows brighten or dim); 07a shows two versions of the same city at dusk;
  09a/09b return into the hall; the end image is the hall again, calm and bright, with free areas left and right for the end cards.

## §2 Light
- One sun, low from the upper left through the windows (`SUN`), warm (#fff1d6 / #ffd9a0). Every figure gets its form light from the upper left and a warm rim
  on the left (`athlete` defaults). Contact shadows under everything that stands (`floorShadow`).
- Brightness clearly above Singularity: mean luma ≥ 120 (0–255) for every chunk, nothing below ~70 for more than a moment; no night black, no dark vignette (the
  film's vignette is 0.2). Dusk in 07/08 stays bright (rose / gold, `skyPlate` dusk), never night.
- Warm light is human effort (the dumbbell of light glows warmer when you lift, `glow`); cool light (#d6ecf6) is the machine's mind (its glass core, its hand
  of light). These are the only two light colours with meaning; everything else is the room.

## §3 Palette (`PAL`)
Plaster #dcc6a2 · wood #c99a62 / #9d6c41 · ceiling #6e4c34 · slate #34403a with chalk #efe9da · paper #f3ead6 · ink #3a2a22 · mirror #d9dcd6 · brass #c9a25a ·
machine core #d6ecf6 / #f6fcff / #9fc4d8 · effort #ffc96a / #fff3d4 · your shirt #3f7f8a, trousers #2e3448. Students: six shirt colours (`studentDress`).
No saturated blue screens, no purple, no neon; the city at dusk adds rose and gold, never cyan.

## §4 The machine: one instrument, two shapes (`machine`)
- A tall brass instrument on a round plinth with three castors, one slender column, a glass core pierced by the column with two slow armillary rings (its
  thinking) and a breathing cool glow. Never a face, never eyes, never a robot body, never a screen with a face.
- **Forklift shape** (it lifts for you): the fork carriage slides on the column front, two slender tines swing out (`fork`, `forkOut`) and carry the dumbbell.
  Your arms stay thin (`arm` .85) and you stand idle. Weights go up, your arms stay the same.
- **Trainer shape** (you lift): the arm (two brass segments, ball joints) reaches out and rests ONE hand of light on your upper back (`reach`, `armOut`; draw the
  hand after the figure with `noHand` + `lightHand`); you curl the dumbbell yourself, the dumbbell glows warm, your arm grows slowly (`arm` 1.0 → 1.2).
- The change between the shapes is always shown as one mechanical move (arm folds, tines swing out, or back), with a brass click; never a cut, never a morph of
  the whole machine. ★ moments: 1.02 (take-over), 6.10 (forklift becomes trainer), 10.x (the hand on your back).
- Today's small machines: `deskMachine` on the exam desks (a 30 cm version of the same instrument). Group B's machine carries the small difference: a warm dial dot.

## §5 The figure "you" and the people
- "You" = one athlete in a teal gym shirt with bare arms (`athlete`, `DRESS_YOU`), seen in profile at figure scale, facing the mirror. Arm muscle `arm` is the
  film's measure: thin .85 · normal 1.0 · strong 1.2–1.35. Your reflection can be broader than you (`refl`: the belief that you got better).
- Everyone breathes, blinks, shifts weight and glances (`figure` life via `t` + `seed`); arms in front or beside the body, never behind; natural shoulders; faces at
  figure scale (no portraits). Students at the desks are prepared sprites (`studentsPrepare`, `student`); the one we come close to is drawn live (`live`).
- The dumbbell of light (`dumbbell`): a disc of warm glass with brass rim and hub, seen end-on in profile scenes (side view `side: 1` on racks). It is the thought:
  bright and warm when lifted by you, cool and dim on the forks, dusty grey when unused (`dim`).

## §6 Camera
- One camera model (`view3`: position in metres, yaw, pitch, focal f px). Keys via `camEase(t, [[t, cam], …])` (move – hold – move: every key a soft stop),
  anchored to words. Holds carry the sentences (slow drift only), moves are short (2–5 s) and land before the accent. `camPath` (Catmull-Rom) only for long glides.
- Slow and soft: moves eased in and out, dolly ≤ ~1 m/s at the peak, pans ≤ ~12°/s at the peak; a faster move only as a fly-into an object (the last 2–3 s
  before a plate). The camera never freezes: in a hold it drifts a few centimetres and the global float in film.mjs breathes (1.0–1.6 % zoom). More hold than move:
  in c01 about two thirds of the time is hold.
- Place changes are moves through the hall or into/out of an object (a sheet, the mirror, a sun patch, the core, a window, the oculus, a card), never cuts.
  A hard cut is allowed only as an exact match cut; the film's target is ≤ 8 hard world changes in 11 minutes (≤ ~0.8 per minute; Grow Forever ≈ 0.9/min).
- Framing: the bottom 170 px stay free of text (burned subtitles ~72 px); keep faces and the key object above y ≈ 850. One hero per frame.

## §7 RUHE (calm) — measurable
- At most 1–2 moving elements at a time besides the camera (e.g. the bars grow while the camera drifts; the line draws while nothing else moves). Background calm:
  dust, breath and glow only.
- One motif per sentence; the image shows the sentence without the voice. Accents land on words (`T.S` / `T.E`), never on seconds.
- Measure every chunk with `tools/calm.py` on a 720p encode (or `--scale 1280:720`) and compare with the reference Grow Forever (Film 7, Jakob: "super"):
  hard cuts per minute ≤ 0.9 (target ≤ 0.8; plate cuts are invisible and do not count if seam.mjs is clean), mafd median not higher than Grow Forever's measured on
  the same scale (720p player parts: 0.30 / 0.43; coordinator figure 1.42 at full scale), mean luma ≥ 120.
- Nothing pops: an object enters by growing, being carried, a light switching on (≤ 0.5 s), chalk being written (mask), or the camera finding it.
  Never a half-transparent fade of a whole object, never a blend between scenes.

## §8 Forbidden
Neon, sci-fi HUDs, glowing circuit lines, holograms, robot bodies, faces or eyes on machines, brains with wires, AI-generated images, stock photo looks,
primitive 3D shapes (plain boxes, spheres as objects), dark night scenes, black frames, fast whip pans, shaking cameras, split screens, infographics floating in
empty space (numbers live on the board, on paper, on the floor), readable invented brand names, any text in the bottom 170 px.

## §9 Sound hooks
Ambience: `atmo/hall` (a big quiet room, distant birds through the windows); the city in 06–08: `atmo/city_street` low. Accents from `sfx-bibliothek/akzent/`:
`brass_click` (machine changes shape), `chime` (machines light), `chalk` (board), `powerdown` (lamps out), `paper_slide` (into paper), `glass_hum` (the core),
`whoosh_airy` (a fly-into). New: `stone_click` (a Go stone on wood), `dumbbell_ring` (warm glass hum when you lift; for c10). Accents in speech pauses where possible.

## §10 Kit map (`lib/f11_kit.mjs`)
`view3 · camPath · hall (o.board, o.map, o.mirror, o.go, o.outside, o.sky, o.lamps, o.shafts, o.dust, o.haze) · cityMap · goGrid · machine · lightHand ·
dumbbell · athlete · GYM · curl · bench · desk3 (o.sheetFill) · deskMachine · studentsPrepare · student · stool · chalkText · chalkBar · chalkLine · tag ·
goPt · goStone · floorLine · EXAM · examHall (o.lampOf, o.dotOf, o.live, o.sheetOf, o.after) · floorShadow · sprite · wallFrame · floorFrame · mirrorPt · ik2`
and the geometry constants `HALL WINDOWS BOARD MAP OCULUS MIRROR GO RACK YOU MACHINE TRUSS SUN PAL`. c01 (`scenes/sc01.mjs`) is the worked example.
