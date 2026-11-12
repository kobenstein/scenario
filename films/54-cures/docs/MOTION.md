# Film 54 · "AI Just Gave Disease a 10-Year Deadline" · motion bible (lead, 2026-11-12)

Style: Editorial-Nacht (`/mnt/project-files/scenario/stil/STIL-editorial-nacht.md`, memory `stil-editorial-nacht`). The picture comes from code only: flat shapes on 2.5D depth cards, grain, one hero light. No AI images, no primitive 3D shapes, no game look. Plan: `docs/shots.md` (source `tools/shots54.py`). Builders: `docs/BRIEF-builders.md`. Kit sheet: `<ROOT>bild/kit54_kontakt.jpg` (`node tools/kit_sheet54.mjs <dir>`).

## 1 · Intent
- **Audience:** people who saw the headline "AI will cure disease in ten years" and want to know whether to believe it.
- **The single message (Leitgedanke):** **every cure has two dates**. The day it is found (machines make that fast) and the day it is proven in human bodies (the body sets that pace). The 2036 deadline is a promise about the first date; we check it against the second, disease by disease.
- **Format:** 16:9, about 10:30 (VO ≈ 10:03 from vo-v3, then a quiet walk and a 15 s end screen), English VO by the narrator.
- **Mood:** calm, curious, fair. Hope without hype: each verdict is earned on screen and every caveat gets one quiet line.

## 2 · The world: THE HALL OF RELICS
One continuous place: **a museum at night, in your grandkids' future.** The diseases of today stand in it as exhibits. The question of the film is whether they will really be relics by the deadline.

**Layout** (left → right on the floor, design x on the F0 card; `S.HALL`):
- the **plague vitrine** (−820): a beaked mask with a wide-brimmed hat on a stand, plaque THE PLAGUE · A RELIC. This is what "a thing of the past" looks like.
- the **diorama A DOCTOR'S OFFICE · 2026** (−160): a period room behind glass. A doctor behind a desk, you beside someone you love. Four word cards fall on the desk. In the hook it ages into a relic (cream-grey).
- **four vitrines = the four diseases** (1440 · 2440 · 3440 · 4440): CANCER (the mint cell; thumbnail A), HEART DISEASE (a heart), MENTAL ILLNESS (quiet rings), ALZHEIMER'S (a brain as threads). Each has a plinth and a plaque.
- the **doorway** (2940, back wall): warm practical light from a corridor. It hosts subscribe 1 and the end-screen subscribe button.
- the **wall panel** (4900–6300): the quote cards C1 / C1b as wall text; the drawn **roadshow frame** (IPO ROADSHOW VIDEO · NOV 10, 2026, no footage, no person).
- the **lectern** (6650): the essay MACHINES OF LOVING GRACE, a magnifier.
- the **media kiosk** (7300): screen and bench; clips C3 / C2 grow out of its screen.
- the **audio-guide post** (7900): clip C5 (audio only) grows out of its speaker.
- the back wall: arched windows with moonlight shafts, pilasters; a foreground rope on stanchions (Z_FG) for parallax.

**Through-line: THE TWO DATES.** A museum label with two rows, FOUND and PROVEN (`F.twoDates`). It is born in the hook (H.08 "Every cure has two dates"). It clones into four, one per disease, with wait tracks (WEEKS … DECADES), returns for each disease, and closes the film (8: EVERY CURE HAS TWO DATES).

**The clock without a clock: THE DEADLINE BOARD** (`F.board`, screen top left).
- It shows DEADLINE: 2036 and four rows: CANCER · HEART · MIND · ALZHEIMER'S.
- Each row lights on its phrase, gets its answer time, then its verdict: ✓ MANY KINDS · ½ · ? · ✗.
- It drives itself from `F.BOARD` phrases; never animate it by hand.
- At 9:12 it glides big to the centre (`big`). It vanishes on "Maybe your grandkids will hear".

**Thumbnail A** (H.01, `03_thumb_cell` in the kit sheet): vitrine 1 huge with the mint cell, you tiny in front, DEADLINE: 2036 stamped on the glass, AI GAVE DISEASE / A DEADLINE on the left.

**Scenes and explainers alternate.**
- A scene is a lit room or a vitrine with breathing figures: the office, the lab inside vitrine 1, the infusion, the clinic, the study clinic.
- An explainer is made of museum things: labels, plaques, slabs of light, dots, rulers, the glass pipeline, stamps.
- Weighted explainer share is **62.8 %** (shots.md §1).

**Clips** (`F.clipPlate`, `F.audioPlate`; credits from `F.CLIPS`, label ORIGINAL FOOTAGE / ORIGINAL AUDIO + source):
- **C3 and C2** (Dario Amodei, Dwarkesh Podcast, Feb 2026) grow out of the kiosk screen (o.from = `S.kioskScreen()`, morph 0 → 1 → 0) and shrink back into it.
- **C5** (Venki Ramakrishnan, Nobel Prize in Chemistry 2009, audio only) grows out of the audio post's speaker. It has no portrait, ever: the name, the prize, and a mint waveform driven by the real envelope (`<clips>/C5/env.json`).
- **C1 and C1b** are **quote cards read by the narrator** (`F.wallText`, words light as spoken). They show no photo, no footage and no likeness. Credit: DARIO AMODEI · ANTHROPIC IPO ROADSHOW VIDEO · NOV 10, 2026.
- Frames come from `tools/f54_clips.py clips` (done on 12.11. for C3, C2, C5).

## 3 · Nicht wiederholen (do not repeat)
These worlds and objects belong to earlier films. None of them may be the world or a recurring object here.

| film | do not use |
|---|---|
| #20 | the **clock**, the **vintage strip** (no clock face, no ticking hand, no countdown digits: time is the board, the wait tracks and the breathing light) |
| #21 | the **server rack** and the **dish** as the world (the small petri-dish lid in the lab, 2.07, is a prop, not a world) |
| (several) | the **hourglass**, the **fire circle** |
| #28 They're Using AI to Save the World | the **tree with lanterns**, the **lamp rail**, the bead and beam, REAL stamps |
| #26 | the **piggy bank**, the **avenue of years** |
| #25 The Last Human Job | the **domino row**, the **timeline wall**, the rank rail of stones |
| Film 24 | the world map with pins, the stone tablet with slots |
| Film 16 | the staircase of light, the book of light with threads (the essay here is a small printed booklet under a lamp) |
| (several) | the monolith, the curve with the red line, robots, brains as AI, DNA helix wallpaper |

**Consequences for this film:**
- "a decade" and "2036" are a stamp and a board, never a clock.
- The years pass as the hall's light breathing (moon and veil), not as a calendar.
- The pipeline is glass in a museum, not a server.
- The machine is a small cool spark (`F.spark`), never a robot or a brain. The brain in vitrine 4 is a specimen of the disease, drawn as threads.

## 4 · Motion DNA
- **Energy:** calm. Long glides of 2–4 s; soft accents on the key words (a stamp presses, a plaque name lands, a verdict mark draws).
- **Easing:**
  - camera: `F.camPath` (monotone cubic through keys, log distance) and `E.camAt` 'i'/'o' for dives through glass;
  - objects: expoOut entrances, expoIn exits, sineIO moves;
  - no overshoot on facts.
- **Speed contrast:** the fast FINDING side (molecules pop in every 0.2 s) against the slow THE BODY side (one breath in 4.5 s). That contrast is the film's argument; use it, never invert it.
- **Physics:** paper and cards sway and fall; glass and plinths never move; people breathe.
- **Transitions** (three families only):
  1. **through the glass:** push into a vitrine, the diorama, the doorway or the kiosk screen, and back out (≥ 2.5 s, continuous);
  2. **object morph:** a plaque grows into a panel, the label clones into four, the wall text folds into the roadshow frame, a screen grows into the clip plate;
  3. **truck along the hall:** the camera walks from exhibit to exhibit, the rope and pilasters giving parallax.

  There are **0 hard world changes** (W): one hall, one take per chunk.
- **Camera:** at most 1–2 moving elements at once; the camera follows the carrier (a card, the label, the stamp). It never stands still: `E.camDrift` (about 5.5 / magnification), plus film.mjs' slow float.
- **Signature move:** a mint stamp presses FOUND; the PROVEN slot stays empty and blinks while the wait track creeps.
- **Wow moments:** one per chunk (★ in shots.md). The film's peak is 9:12: the board goes big, all four verdicts at once, then the grandkids in the hall.

## 5 · Palette and colour code (never break it)
| meaning | colour | kit |
|---|---|---|
| the cure, science, the hero light, FOUND / ✓ | mint | `F.MINT` |
| the machine (fast sparks, finds) | cool white-blue | `F.COOL` |
| night, hall, forms, glass | night blue / indigo | `F.INK`, `P.night*`, `P.ind*`, `P.blue*` |
| people's practical light (desk lamp, lectern, doorway) | cream (never gold) | `F.LAMP` |
| old, faded, "a relic" | cream-grey | `F.RELIC` |
| **you** (the viewer) | yellow coat | `E.du` only |
| everyone else | indigo silhouettes with mint/cream rim | `E.person` |
| text | cream; secondary `P.halo2`; key words mint (`F.mintText`) | Instrument Serif for quotes and numbers, Inter 600 caps for labels |

There is no red anywhere: ✗ is cream (REGELN §9.3). Mint is the brightest thing in a frame only where a cure is found.

## 6 · Calm rules (all chunks)
1. One motif per sentence. The picture changes with the sentence, not faster.
2. Scenes and explainers alternate. No two explainers of the same kind in a row.
3. At most **1–2 moving elements** at a time. The rest only breathes (drift, sway, motes, light).
4. One continuous take per chunk; inner chunk boundaries within a group are planned match frames.
5. Nothing appears from nowhere. Every element has an origin: it falls from the desk, rises from a plaque, grows from a glass, is stamped.
6. Text: at most one number and ≤ 6 words per statement, readable at 390 px width, on screen ≥ 1.2 s.
7. **Subtitles are burned in at the bottom (≈ 72 px): no important text below y 880**, and no key picture detail there either. Source lines sit at y ≤ 880 (`F.source`).
8. **QR corner:** during each QR window (`F.qrWindows(T)`: 27 s from "This channel exists", 1st and 2nd occurrence) the area **x ≥ 1330, y ≤ 580 stays quiet**. No text there, no moving object, no bright light. Fade with `F.qrQuiet(T, t)`. The overlay itself is laid on by ffmpeg in `tools/f54_clips.py assemble` (soft 0.6 s in/out). The 2nd window ends ≥ 15.6 s before the end.
9. Numbers: calm.py static share < 5 %, luma 40–60, no cuts. smooth.py 0 LURCH/POP.

## 7 · Carriers per boundary (group seams, `lib/f54_seams.mjs`)
- **Lead → B1** at `"He didn't invent it"`: `S.plateRoadshow`. The wall panel with the roadshow frame (left), the lectern with the closed essay under its cream lamp (right). B1 glides right to the lectern; the essay opens.
- **B1 → B2** at `'The third disease answers fast'`: `S.plateMind`. Vitrine 3 with the quiet rings, plaque MENTAL ILLNESS, V4's edge dim right, the board top left. The top-right corner is dark wall (QR window 1 is running).
- **B2 → B3** at `'He even warned of a jam'`: `S.plateKiosk`. The media kiosk with a dark screen and a cream play mark, the bench, the audio post on the right, the board complete so far.
- **Both sides draw the plate for ±0.5 s** with the same creep (`S.creep`: a 4 %/s push and a 30 px/s truck). Extend the creep backwards in your camera (sc01: `creepCam`, from tPlate − 2.5 s) so the arrival glides in, not stops.

## 8 · Kit (`lib/f54_kit.mjs` + `lib/f54_seams.mjs`; the headers list all signatures)
- **World:**
  - `S.hallWorld(ctx, c, t, { moon, door, v(i), plaque(i), plague, diorama, frame, panel(ctx), lectern, kiosk, post, kids, du, back, fg, extra })`
  - `S.HALL`, `S.hallX`, `S.glassOf(i)`, `S.plaqueOf(i)`, `S.frameRect()`, `S.kioskScreen()`, `S.postSpeaker()`, `S.dioramaGlass()`
  - `S.officeRoom(ctx, t, w, h, { lit, relic, doctor, loved, you, cards })`, `S.roadshowFrame`, `S.motes`
- **Exhibits:**
  - `F.vitrine`, `F.specimen(kind 'cell'|'heart'|'mind'|'brain')`, `F.cell`, `F.plaque({ name, sub, q })`, `F.diorama`, `F.plagueMask`, `F.wordCard`
  - `F.kiosk`, `F.audioPost`, `F.lectern`, `F.essay({ open, lens })`
- **Through-line and board:** `F.twoDates(ctx, t, x, y, s, { name, found, proven, blink, wait, waitTag, split })` · `F.stampMark` · `F.board(ctx, t, T, { big, from })` · `F.boardRow` · `F.verdictMark`
- **Quote cards:** `F.wallText(ctx, t, T, { id 'C1'|'C1b', x, y, w, size, credit, hi })` · `F.QUOTES` · `F.CREDIT`
- **Explainers:**
  - `F.molecule`, `F.spark`, `F.bloodTube`, `F.scan`, `F.pipeline({ neck, flow, jam })`
  - `F.dotField`, `F.ruler`, `F.slab(s)`, `F.bracket`, `F.label`, `F.tag`, `F.questionMark`, `F.thesis`
  - `F.source` + `F.SOURCES`, `F.mintText`, `F.mintSpan`
- **Camera:** `F.camPath(t, [[t, cam], …])`, `E.aim(F0, x, y, s, sx, sy)`, `E.camAt`, `E.camDrift`.
- **Clips:** `F.clipPlate(ctx, t, T, id, { from, morph, dark })` · `F.audioPlate` (via clipPlate for C5) · `F.CLIPS` · `F.clipWin(T, id)`. render.mjs awaits `film.prepare(t)` so the frames are loaded.
- **QR:** `F.QR`, `F.qrWindows(T)`, `F.qrQuiet(T, t)`. **End screen:** `S.END_CAM`, `S.END_TILES`.
- **napi-rs quirks:**
  - import `Path2D` from '@napi-rs/canvas';
  - never combine paths with `addPath` (it joins sub-paths);
  - cache paths and gradients that do not change per frame.

## 9 · Gates (motion-director-gates)
1. **Plan:** this file + shots.md before code.
2. **Space:** depth cards (wall Z 2600, floor F0, rope Z 1150) and a real camera (`E.aim`, `F.camPath`).
3. **Carrier camera:** the camera follows the falling card, the flying plaque names, the label, the stamp, the kids.
4. **Causality:**
   - a card falls on its word;
   - a plaque name lands where the card lands;
   - the stamp presses on "found";
   - the board row lights on its phrase.
5. **5 s test:** c01 is the reference (`<ROOT>bild/c01_kontakt.jpg`).
6. **Review frames** every 0.33–1 s plus every transition, then a contact sheet of the whole chunk.
7. **The voice drives timing:** phrase anchors only (`T.G`, `T.GE`, `T.clip`), never seconds.
8. **Honest self-grade** in every report.

## 10 · End screen (last 15 s, c13)
- **Camera:** `S.END_CAM` (the hall wide and low).
- **Exhibits:** the four vitrines sit in one row in the lower half (y ≈ 540–870).
  - Per text-v2, one holds an old faded exhibit without a plaque (relic); three are empty, with soft mint light (`st.v(i)`).
  - You stop before an empty one.
- **Free areas** (`S.END_TILES`): the upper wall is dark and empty.
  - Left tile: x 100–820, y 130–535.
  - Right tile: x 1100–1820, y 130–535.
  - The subscribe circle (960, 620, r 90) sits **inside the warm doorway** between HEART and MIND.
- **Rules:** no text, and no QR (its 2nd window has ended). The picture keeps breathing: drift, motes, the moon shafts.
- **Before it:** the VO ends, then a quiet walk without voice (~7–10 s, music carries) leads into the end screen.

## 11 · Text version and fact check
- **Text:** vo-v3.txt is final (5 small word changes vs vo-v2; the phrase anchors are unchanged except c03 "Less than a decade that's" and the board's "twenty thirty-six").
- **Mandatory on-screen changes** (faktencheck.md), already in shots.md §5 and `F.SOURCES`:
  - **MB1** (2:21): ONE AI-PROPOSED DESIGN · ≈ 10× MORE RECEPTORS ON THE CELLS · LAB TESTS ONLY · GENERATE BIOMEDICINES / ANTHROPIC, OCT 2026. The 70 % was draft length, not time: no speed motif.
  - **MB2** (7:55): WITHOUT SYMPTOMS: EXPERTS ADVISE IT ONLY IN TRIALS · TRAILBLAZER-ALZ 3 SCREENS BY BLOOD TEST.
- **Optional changes K5–K9:** listed in shots.md §5 for Jakob; the default is unchanged.
