# Film 65 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-20

The picture lead built **c01** as the quality reference: the hook, 0 → `T.G('The first step is the voice')` = 0:59.35. The lead also holds the kit, the shot list and the seams. Three builders build the rest **at the same time**. The film is built today through to upload, with no interim review.

**Times are from the real VO** (`audio/timing.json`, 610.7 s).

| builder | chunks | from → to (phrase) | time | contents (shots.md) |
|---|---|---|---|---|
| **B1** | c02 c03 c04 c05 c06 | 'The first step is the voice' → 'The third step is a face' | 0:59.35 – 3:29.56 (150 s) | **STEP 1 THE VOICE:** the kitchen, the hearing room on her phone, **S1 clip** from the phone screen, the call timer to 5:30:00 while the moon crosses, FEELING SURE ≠ BEING RIGHT · the dialing computer (★ hundreds of blue lines, two answered), NO CASE: ONE HELLO → A CLONE · voice strips torn from video tiles · you at the table, the covered word note, ASK FOR THE WORD · HANG UP · CALL BACK, note 1 on the fridge, tag 1 gold · **STEP 2 THE STORY:** posts become text lines up the wire, the person + blue ribbon / the machine typing, the dating grid THOUSANDS · 3 OF 4 PROFILES · MACHINES (★ SUSPECTS), THE COMPANY REPORTS ON ITSELF, PAID CHAT, NOT SAVINGS · note 2 "?" · glide along the wire to pole 3 → **plateLine(3)** |
| **B2** | c07 c08 c09 c10 c11 | 'The third step is a face' → 'Then one step is left' | 3:29.56 – 6:38.97 (189 s) | **STEP 3 A FACE:** a tablet in a window across the valley with a forged generic leader, ABOUT CA$900,000, ★ NEARLY HALF · INVESTMENT FRAUD, NEVER RELIABLY MEASURED, the return line, note 3 FAMOUS FACE + PROFIT = FAKE · **M.01 channel moment** (270.6–280.3) · **STEP 4 THE CLOCK:** the moon's arc, DO IT NOW · DON'T TELL ANYONE, the fake chain (THE BANK, VIDEO CALL with a crooked seal, DON'T SPEAK TO ANYONE), **C10 quote card** out of the dark video screen · the busy line, ★ two dot fields, A SMALL SHARE OF CASES, A PLAN, MADE ON A CALM DAY, note 4 HURRY + SECRET + MONEY = STOP · ACTION PLAN on her phone, **C1 clip** from it · her walk down the line → **plateLine(5)** |
| **B3** | c12 c13 c14 c15 c16 | 'Then one step is left' → end | 6:38.97 – 10:10.69 (212 s, incl. the 15 s end picture) | **STEP 5 THE MONEY:** the bank window, the copy of pole 5 slides off, the savings behind the teller, ★ note 5 TRUSTED CONTACT, BROKER: MUST ASK · BANK: NOT REQUIRED · MARYLAND · NORTH CAROLINA (HOLD + ALERT), FRIGHTENED · SECRETIVE · COACHED, **S2 clip** from the counter window, A LOBBY, NEVER MEASURED, the scale contrast (glow vs a name on paper) · A RECORDING · A PHOTO · A LIFE POSTED ONLINE, ★ the gold slides from the voice onto the five notes · AI vs HUMAN 46 % / 18 %, ONE SMALL STUDY · 22 PEOPLE, your phone rings on your hill, TEN MINUTES · THIS WEEK, ONE WORD · ONE PERSON TO CALL · ONE NAME AT THE BANK · **the hook returns** (H.06 exactly), ★ "The line goes quiet", all tags gold · **A.01 channel moment** (585.7–593.7) · **end picture 15 s** (595.7–610.7) |

## Timing
- **Timing file.** `film.mjs` loads the real timing in this order:
  1. `$TIMING`;
  2. the repo's `audio/timing.json` (the sound agent's, in this checkout);
  3. `<ROOT>audio/timing.json`;
  4. `data/provisional_timing.json` (a fallback only, with a warning).

  ROOT = `/mnt/project-files/scenario/film-ki-betrug/` (`$F65ROOT`).
- **Anchor only on phrases.** Use `T.G(phrase, nth, after)` / `T.GE(…)`, and `T.clip('S1' | 'C10' | 'C1' | 'S2')` for the slots. Never use seconds.
- **Slots** (frame 1 of each file sits at the slot start):

  | slot | time | chunk |
  |---|---|---|
  | S1 | 70.34–73.96 | c02 |
  | C10 | 313.79–320.79 (music only, no voice: a card to read) | c09 |
  | C1 | 381.52–388.56 | c11 |
  | S2 | 455.76–462.73 | c13 |
- **Sound cues the picture must meet:**
  - the **ringtone** comes right after "Her phone rings." (c01, built) and after "her phone does ring." (c16): the phone rings visibly from that word on, and she lifts it;
  - the **hang-up** comes right after "The line goes quiet." (c16): the blue voice goes flat and falls apart on it.
- **S2:** Benda says "In **THOSE** moments". These are the moments the teller noticed (5.07 FRIGHTENED · SECRETIVE · COACHED), so the clip must follow that picture.
- **Repeated phrases** (search after a fence: `T.G(p, 0, after)`):
  - "A machine can copy" (hook H.05 and c16 7.03);
  - "This channel exists" (M.01, A.01);
  - "her phone";
  - "the bank".
- **The sound agent's folder `audio/` (in this checkout) and `<ROOT>audio/`, `<ROOT>ton/`: never touch, never stage.**

## 0 · Mandatory before the first line of code
1. **Load the skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Where scenario-motion's three.js/Hyperframes tooling differs, this film's canvas pipeline wins; its rules for look, calm and causality hold.
2. **Read the plan:**
   - `docs/MOTION.md` (whole).
   - `docs/shots.md`, your shots. It is **binding**: one motif per sentence, and the carrier column is the handover. §5 holds the only on-screen strings.
   - The headers of `lib/f65_kit.mjs` and `lib/f65_seams.mjs`.
3. **Watch c01:** `<ROOT>bild/c01_kontakt.jpg`. `scenes/sc01.mjs` is the reference:
   - an anchor table `a = {}` built from phrases;
   - world cameras as `E.cam3` / `S.look`;
   - ONE `S.camPath` with `S.drift` that dies before the seam (`dA`), and a state that settles onto `S.lineState(1)`;
   - the voice arcs as carriers;
   - the kitchen as a portal out of her window, with its own slow push and truck (so it is never still);
   - text in screen space with `maskLine` / `F.thesis`;
   - the exact plate for the last 0.5 s.
4. **Look at the kit sheet:** `node tools/kit_sheet65.mjs $SP/f65/bN/kit .5`. It shows the world from the thumbnail camera, the plates 1/3/5, the end picture, the kitchen, the kitchen lift, the phones, and the clip frames S1, C1 and C10.
5. **Make the footage frames once** (needed for S1, C1, S2): `F65SCRATCH=$SP/f65 python3 tools/f65_film.py clips`. The kit reads them from `$F65SCRATCH/clips/<id>/` (default: the lead's scratchpad). Set `F65SCRATCH` (or `F65CLIPS`) the same way when you render, or the clip frame stays empty with a warning.
6. **Facts:** check every on-screen number against `<ROOT>faktenzettel.md`, `<ROOT>faktencheck.md` (including "Hinweise fürs Bild") and `<ROOT>vo-v3.txt`. Use `F.SOURCES`. **On-screen numbers follow the spoken words:**
   - "thousands" (never 4,700);
   - "nearly half" (never 3.5 of 8 billion);
   - "a small share of cases" (never 6 % / 70 %);
   - no number for the AI share (NEVER RELIABLY MEASURED).

   If anything disagrees, the fact sheet / vo-v3 wins; note it in your report.

## 1 · The seams between the groups (fixed, `lib/f65_seams.mjs`)
A plate is the exact picture at a group boundary T0.
- **The handing side** steers its camera onto `S.lineCam(k)` and draws `S.plateLine(ctx, t, T, k)` for `[T0 − .5, T0)`.
- **The receiving side** draws the same plate for `[T0, T0 + .5)` and grows out of it. It continues the creep with `S.lineCam(k, S.creep(t, T, S.LINE_PHRASE[k]))` and the state `S.lineState(k)`.
- **Plates** creep (3 %/s push, 24 px/s truck) with **no drift**: let your drift die before the plate.

| seam | at | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | `'The first step is the voice'` (59.35) | `plateLine(1)` | built by the lead | B1 1.01 follows the wire up into her window |
| B1 → B2 | `'The third step is a face'` (209.56) | `plateLine(3)` | B1 2.07 settles onto it | B2 3.01 pushes into a lit window across the valley |
| B2 → B3 | `'Then one step is left'` (398.97) | `plateLine(5)` | B2 4.13: her walk ends out of frame or at the bank door, so the plate state has no figure | B3 5.01 the bank window |

Check with `SECS=c06,c07 node tools/seam.mjs --at 209.56 --dir $SP/f65/bN/seam` (and the same at 59.35 / 398.97 and at every inner boundary of your group). Inner chunk boundaries within a group are one continuous take: no plate, but they must match frame for frame.

## 2 · Hard rules for the picture
- **One world, one take.** Everything happens on or from THE LINE (`S.lineWorld`). These open out of a thing in the world (her window, a phone screen, a lit window across the valley, the counter window) and close back into it:
  - the kitchen (`S.kitchen`);
  - the phone screens (`F.phone`);
  - the tablet window;
  - the bank counter;
  - the clip frames.

  No W shots, no cuts, no blends, no fades between worlds; one entry per chunk.
- **Voices** are `F.voiceWave` ribbons: GOLD = a real person, COPY (blue) = the machine, NEUTRAL = can't tell. A copy has the same shape as the original, only cold.
- **The five steps** are the five tags on the poles. A tag turns gold (`st.tags.lit`) once its step is explained. `hi` = the step being told now (`F.stepLabel` STEP k OF 5 · NAME at the start of each step). Blue ghost poles (`st.ghosts`) stand for "a machine can fake it"; pole 5 never gets one.
- **The agreements** are the five gold notes on her fridge (`S.kitchen({ notes })`, `F.note`), in the order word (covered) · ? · house rule · stop rule · trusted contact. **The word itself is never shown.** Once on the fridge, a note stays for the rest of the film.
- **Clips** (`F.clipFrame`, MOTION.md §7):
  - S1, C1 and S2 are ORIGINAL FOOTAGE with the name bar from `F.CLIPS`. C1 is fit `contain` (burned-in subtitles: never crop, never distort).
  - C10 is the QUOTE card (no footage, no speaker's name).
  - Each frame grows out of a screen in the world (`from`: the phone screen rect, the dark video screen, the counter window) and shrinks back into it.
- **Real people** appear only in the clips. The forged leader and the fake agent are generic figures (`E.person`): no likeness, no real name on screen.
- **Explainers** are made of the world's things: voices, tags, notes, the phone, the town windows, the counter windows, `F.dotField`, `F.slab`, `F.tally`, `F.bracket`.
  - ≤ 6 words, at most one number, readable at 390 px, ≥ 1.2 s on screen.
  - Keep them **above y 880** (burned-in subtitles).
- **Colour code** (MOTION.md §5): gold = a real voice / an agreement / what matters; blue = the machine's copy; lamp cream = people's light; yellow coat = only you; **no red**.
- **Nicht wiederholen** (MOTION.md §3). In particular: no clock face, no hourglass, no calendar (time = the moon's arc + the call timer), no world map with pins, no robot, brain, orb, eye or hooded hacker, no door with a gold gap.
- **Subscribe** (no buttons, no bells, at most one small line):
  1. B2, M.01, 270.6–280.3: you on your hill, her window across the valley, the gold arc between you breathing, little motion.
  2. B3, A.01, 585.7–593.7: the glide to the end picture.

  **No QR anywhere.**
- **End picture 15 s** (B3, 595.7–610.7): `S.END_CAM` + `S.endState()`. Free tiles (`S.END_TILES`):
  - left: x 100–820, y 120–525;
  - right: x 1100–1820, y 120–525;
  - subscribe circle: (960, 380), r 90.

  No text; the picture breathes.
- **Calm:** at most 1–2 moving elements. The camera follows the carrier. `S.drift` is always on and dies only into plates. Nothing appears from nowhere. The kitchen always creeps (a slow push and truck) and the lamp sways: never a still frame.

## 3 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc06.mjs`
  - B2: `scenes/sc07.mjs` … `sc11.mjs`
  - B3: `scenes/sc12.mjs` … `sc16.mjs`

  You may also add your own modules `lib/f65_b1_*.mjs` / `lib/f65_b2_*.mjs` / `lib/f65_b3_*.mjs` (shared camera and state across your chunks, extra drawings such as the hearing room, the dating grid, the tablet, the counter).
- **Do not change:** `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f65_kit.mjs`, `lib/f65_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, **`audio/`**, `scenes/sc01.mjs`, or the other builders' files. Solve kit gaps in your own module and report them as kit wishes.
- **A scene file:** `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT65 }]`. Draw the whole chunk `[R.a, R.b)`. Boundaries inside your group must match frame for frame.
- **No commit, no push**, no `git add -A`, `git checkout`, `git stash`, `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the full list is in the headers)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f65_kit.mjs';  import * as S from '../lib/f65_seams.mjs';
E.cam3({ x, y, z, hz }) (f = F0 1700; camera height above the valley = S.EYE − y) · S.look(X, Y, Z, mag, sx, sy, hz) · S.camPath(t, [[t, cam], …])
S.drift(c, t, dist, amt, seed) · S.proj(c, X, Y, Z) → [sx, sy, s] · S.at(ctx, c, X, Z, fn, Y) · S.arc3(c, A, B, lift, n) → screen pts
S.lineWorld(ctx, c, t, { sky, moon { x, y, a }, source { a, pulse }, town { a, lit }, river, house { win, two }, bank { win, glow, teller },
             tags { lit(k), hi, hiA, a }, ghosts { a, of(k) }, wire { a, gold, u }, you { a, look, phone, screen, light, ring, timer } | false,
             grass, back(ctx), extra(ctx, out) }) → { you, phone, win, bankWin, pole(k), tag(k), source }
S.WORLD (house, poles, bank, you, source, …) · S.WIRE · S.TOWN · S.WINDOWS · S.herY(x) · S.yourY(x) · S.poleTop(k) · S.winWorld() · S.bankWinWorld()
S.winRect(c) · S.bankWinRect(c) (portal rects) · S.kitchen(ctx, t, w, h, { notes [5], phone { screen, ring, reach, lift, timer, light, a },
             mom { look, lean, a } | false, you { x, a }, lamp, dark, extra }) → { phone, mom, you, fridge, slots } · S.KITCHEN · S.NOTE_SLOTS
S.plateLine(ctx, t, T, k) · S.lineCam(k, kk) · S.lineState(k) · S.LINE_P · S.LINE_PHRASE · S.creep · S.SEAM_HALF · S.THUMB_CAM · S.END_CAM · S.END_TILES · S.endState()
F.voiceWave(ctx, t, pts, { amp, col F.GOLD|F.COPY|F.NEUTRAL, u0, u1, seed, speed, a, flicker, tremble, flat, cut, bands, core }) · F.arcPts(x0, y0, x1, y1, lift, n)
F.note(ctx, t, x, y, s, { lines, cover, lit, tilt, a, empty, magnet }) · F.phone(ctx, t, x, y, h, { screen 'call'|'timer'|'video'|'contacts'|'wave'|'dark', ring, glow,
             rot, timer, seal, rows, hi, a, light }) → { screen } · F.avatar · F.mom · F.reachArm · E.du (you) · E.person · F.coin
F.tally(ctx, t, { v, from, u, label, pre, post, dec, size, x, y, rise }) · F.stepLabel(ctx, t, k, name, u) · F.thesis · F.scenario · F.source(ctx, t, t0, t1, F.SOURCES.x)
F.clipFrame(ctx, t, T, id, { from, morph, label, dark }) · F.clipWin(T, id) · F.CLIPS · F.CLIP_RECT
F.portal(ctx, fromRect, toRect, m, inside(ctx, w, h, m), { rim, r }) · F.veil · F.screenFloat · F.paper · F.maskLine · F.rise · F.bump · F.priceTag · F.dotField
F.slab · F.slabBars · F.bracket · F.label · F.tag · F.questionMark · F.checkMark · F.crossMark · F.ruler · F.accentText/Span/Trail · F.PRINT65 · F.GOLD/COPY/NEUTRAL/LAMP/INK/WOOD
```

## 5 · Rendering (shared cores)
`SP` = your scratchpad. Work in `$SP/f65/bN/`, and run from `/home/user/scenario/films/65-ai-can-now-call-you-in-your-moms-voice/code`.
- **Stills:** `SECS=c03 node render.mjs --snap 90,95,100 --dir $SP/f65/b1/snap --scale .4`
- **Video:**
  - pieces ≤ 20 s, always `--expose-gc`;
  - at most one render per builder at a time (~180 ms/frame at `--scale .5` for c01);
  - example: `SECS=c03 F65SCRATCH=$SP/f65 node --expose-gc render.mjs --out $SP/f65/b1/c03_a.mp4 --from 85.4 --to 100 --scale .5`;
  - join with `ffmpeg -f concat -c copy`.
- **Delivery per chunk:**
  - the video at `$SP/f65/bN/cNN.mp4`;
  - a contact sheet (1 frame per 1–1.5 s, small jpg ≤ 1 MB) at `/mnt/project-files/scenario/film-ki-betrug/bild/cNN_kontakt.jpg`.

  The network drive is slow: read every file back about 10 s after writing it, and never search the whole folder.
- **Final 1080p:** the lead or the coordinator runs `python3 tools/f65_film.py render` and `assemble` on the real timing (no QR; the mix is the sound agent's). **No video or audio in the repo.** Only small jpgs go on the network drive.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at:** every 0.5–1 s plus every transition, ≥ 3 review rounds. Check:
   - poster quality;
   - sentence = picture;
   - gold brightest only where it matters;
   - figures alive;
   - text readable, ≥ 1.2 s, above y 880.
2. **calm.py:** `python3 tools/calm.py <cNN.mp4> --scale 1280:720`. No cuts; luma 40–60; static share < 10 %; report the mafd median.
   - **c01 reference:** cuts 0 · mafd median 0.546 · p90 2.03 · static 8.5 % · luma 58.5.
3. **smooth.py:** `python3 tools/smooth.py <cNN.mp4> <start second>`. 0 LURCH; a POP only at a seam frame you can name.
   - **c01 reference:** 1781 frames, mean Δ 1.43, max 8.5 (the portal opening at 23.9 s), 0 LURCH; 3 weak POPs of 1.6–1.7 at 53.5 s (the 10 Hz grain on an almost still frame; harmless).
4. **seam.mjs** at your group seams and every inner boundary: no flags. The receiving side draws the plate exactly; FROZEN inside a plate's half second is not allowed: the creep must be on.
5. **Calm rules** (MOTION.md §6) checked.
6. **Self-grade 1–5:** poster · sentence = picture · seamless · calm · alive · explainers made of the world's things · text · facts = fact sheet. Nothing under 4.

## 7 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk (calm, smooth, seam).
- Kit wishes.
- Deviations from shots.md, with the reason.
- Fact-check notes.
- The exact list of files you created or changed.
