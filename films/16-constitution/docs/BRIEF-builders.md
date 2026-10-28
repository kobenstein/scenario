# Film 16 · builder brief (3 builders in parallel, one checkout) · as of 2026-10-28

The owner approved the script and asked for the whole film, no style test. The picture lead built c01 (hook + level 1, 0 → 55.68 s) as the quality reference and holds the kit, the shot list and the seams. The rest is built by **three builders at the same time: B1, B2 and B3**, each ≈ 3 minutes.

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated there: "Hyperframes"/three.js. We draw with our own engine in Canvas 2D (2.5D cards in front of `cam3`).
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md` (worlds, objects, anchors, palette, budgets, kit)
   3. `docs/shots.md` (your shots with phrase anchors, carriers and transitions; binding)
   4. `docs/EDITORIAL-KIT.md` (2.5D stage, API)
   5. `/mnt/project-files/scenario/film-verfassung/vo-v4.txt` (your paragraphs)
   6. `/mnt/project-files/scenario/film-verfassung/faktencheck.md` (only these facts and numbers)
3. **Look at** the reference: the contact sheet `/mnt/project-files/scenario/film-verfassung/bild/c01_kontakt.jpg` and the code `scenes/sc01.mjs`. It is the pattern and the quality bar:
   - one plan sequence per chunk (one entry), worlds joined by flights into a surface;
   - camera from `camAt` keys on words (`T.G(phrase, 0, after)`);
   - reactions computed from positions (the thread arrives → the node lights);
   - text rises calmly from its baseline; quote cards stand ≥ 4 s while the voice runs;
   - the level stamp (`K.level`) and the empty reply field with its blinking cursor.

`/mnt/project-files` is a network mount and nearly full: exact paths only, never search the whole folder, only small jpg contact sheets go there (re-read a written file after ~10 s). Renders stay in your own scratchpad.

## 1 · Split (times from `timing.json`; in code anchor only on words)
| Builder | Chunks | Time (s) | Dur | Content |
|---|---|---|---|---|
| **B1** | c02, c03, c04 | 55.68–228.68 | 173 s | L2 the risky question (phone, quote, brilliant friend, ★ staircase of the four values, balance), L3 the perfect argument (poster hall, paper bridge, quote, ★ seven-limits wall, crack), L4 the maker (HQ letter, quote, many hands, ★ the machine hand refuses, rule vs judgment, the one token) |
| **B2** | c05, c06, c07, c08 | 228.68–421.60 | 193 s | L5 the plug (control room, pause button, objection hand, magnifier, ★ the dial, cost/benefit, open problems, the apology, ★ anchor 2: the book closes), L6 the real test (★ anchor 3: diorama, emails, ★ the 96 / 100 bar, text ocean, the separate "dropped sharply" chart without a number, ★ threads into the head, own tests, backside, leak, zero line, unsolved quote, the pen) |
| **B3** | c09, c10, c11 + end screen | 421.60–582.80 | 161 s | L7 who holds the pen (lectern, ballot slot, money quote, commentator, Model Spec, ★ chain of command vs character, broken link, 1,000 Americans, the pen passes between hands), ★ anchor 4 ending (tower, book, CC0, windows, eighth step, ink) and the end screen (≤ 15 s) |

Chunk boundaries inside a group: c02|c03 117.56 · c03|c04 172.96 · c05|c06 263.18 · c06|c07 315.75 · c07|c08 350.68 · c09|c10 467.96 · c10|c11 508.96 · VO end 566.90 · film end 582.80. The phrases are in `film.mjs` `CHUNKS`.

**c01 is finished** (lead). Do not touch `scenes/sc01.mjs`.

## 2 · The seams between the groups (fixed, defined by the lead)
The three group seams sit on a **shared picture**, a *plate* from `lib/f16_seams.mjs`. Both sides draw the plate from the same function with the same `t`, so the frames left and right of the seam are identical. Preview: `node tools/seam_plates16.mjs <dir>`.
- The handing side steers its last move so the picture lands on the plate, and draws the plate opaque over everything for `t ∈ [T0 − 0.5, T0)`.
- The receiving side draws it for `t ∈ [T0, T0 + 0.5)` and grows its world out of it: the plate pulls back or becomes a thing of the new world, never by a dissolve.
- Helpers: `seamWindow(t, T0)` and `SEAM_HALF`. Draw the plate after your cards, in screen space (it resets the transform itself).

| Seam | T0 (anchor) | Plate | Hand-over (end of the group before) | Take-over (start of the group after) |
|---|---|---|---|---|
| **Lead → B1** | `T.G('A letter from your landlord')` (≈ 55.68) | `plateChat`: **inside the chat box**. The chat glass fills the frame (`CHAT_PLATE`), the conversation has scrolled away, only Claude's empty reply field with the blinking cursor and the input line; badge `LEVEL 1`. | done (sc01): the push into your laptop screen lands on it. | 2.01: pull back, the glass is now **your phone screen** in a dark hallway (the box shrinks into the phone in your hand); the badge steps 1 → 2 as the `LEVEL 2` stamp rises. |
| **B1 → B2** | `T.G("You're still at Anthropic")` (≈ 228.68) | `plateButton`: **the pause button, close**. A round brass button with two warm pause bars, centre (960, 540), r 360, on a dark brass panel; badge `LEVEL 4`. | 4.07: everything sinks below its baseline, the one round token of light ("One thing") is pushed into until it is this button. | 5.01: pull back into the control room (`buttonFace` draws the same button at any size); badge 4 → 5. |
| **B2 → B3** | `T.G('Last level')` (≈ 421.60) | `plateNib`: **the nib, close**. Lamp-lit paper fills the frame; the fountain pen of light from the upper right, nib at (930, 600), a fresh line of ink-light from x 260 to the nib; badge `LEVEL 6`. | 8.10: the pen rises out of the training stack; push to the nib until the frame is the plate. | 9.01: pull back, the pen writes at the lectern in cool documentary daylight; badge 6 → 7. |

Seams inside your group (chunk to chunk) you build yourself on the same principle:
- the same camera and the same carrier state in the last frame of cN and the first of cN+1;
- simplest: a shared drawing function in your own `lib/f16_bN_*.mjs`;
- transition and carrier are in `shots.md`.

## 3 · Hard rules for the picture
- **Mix 2.5D scenes with real explainer graphics** built from the film's things (the book's gold lines, the thread, the head's network, you in yellow, the pen, the chat box): the staircase of the four values, the seven-limits wall, the dial corrigible ↔ autonomous, the blackmail bar 96 / 100, a **separate** "dropped sharply" chart **with no number**, chain of command vs character, the pen passing between hands. Each graphic shows exactly what the sentence says, readable without sound, one statement, at most one number and ≤ 6 words plus source. No generic chart panels, frames, gridded axes, legends.
- **Every transition carries an object into the next.** No cross-fades, nothing fades in half-transparent from nowhere.
- **The guiding image (book → threads → head network) only at the 4 anchors**: c01 hook (done), 6.08 (end of level 5), 7.01 / 8.03 (level 6), 11.01 (ending). Every other level has its own world (`MOTION.md` §2). No 3D-game look.
- **Calm:** max ~1 hard world change per minute (`shots.md` §3), slow camera moves on word keys, max 1–2 moving main elements at once, never a still image > 2 s.
- **Levels 1–5:** you type into a chat-like box; **Claude's reply field stays EMPTY with a blinking cursor** (`chatUI` `reply: { a: 1, cursor: 1 }`). Never invent a Claude answer. Level 6 shows the real published test. The `LEVEL n` badge sits in the top-left corner for the whole level (`K.level(ctx, t, { n, title, t0 })`: the stamp rises at `t0`, glides to the corner; before `t0` it shows the badge `from` if you pass it, e.g. `from: n − 1`).
- **Quote cards** (`K.quote`) appear while the voice continues, stand readable **≥ 4 s**, big type (≥ 58 px), small attribution, exact wording (`shots.md` §4).
- **End screen ≤ 15 s** (B3, 11.08): calm picture with free areas left (x 90–780, y 250–700) and right (x 1140–1830, y 250–700) plus subscribe centre (x 810–1110, y 330–600); picture and music keep running.
- **Timing:** anchor on words from `timing.json`, never hard-coded seconds.

## 4 · What you may touch and what not
- **Only your files:**
  - B1: `scenes/sc02.mjs` … `sc04.mjs`;
  - B2: `scenes/sc05.mjs` … `sc08.mjs`;
  - B3: `scenes/sc09.mjs` … `sc11.mjs`;
  - plus your own modules `lib/f16_b1_*.mjs`, `lib/f16_b2_*.mjs` or `lib/f16_b3_*.mjs`.
- **Do not change:**
  - `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f16_seams.mjs`, `lib/kit.mjs`;
  - `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `scenes/sc01.mjs`;
  - the other builders' files, and anything under `audio/` (the audio agent).
- **Something missing in the kit or a bug:** solve it in your module and report it as a kit wish. Only the lead changes the kit.
- **A scene file:** `export default async (T, R) => [entries]` with `entry = { t, draw(ctx, t), print: K.PRINT16 }`; `R = { a, b }` is the chunk range.
  - A chunk is normally **one** entry (plan sequence).
  - A second entry is a hard cut, allowed only where `shots.md` names a match move with a rhyming carrier.
- **No commit, no push.** All three work in the same checkout; the lead or the coordinator commits. No `git checkout`, `git stash`, `git reset` (that would hit the others' work).

## 5 · Kit state (after c01)
- `f16_kit.chatUI(ctx, t, x, y, w, { bubbles, typing, reply, scroll, t0 })`: laid out on 1000 × 562 design units, scaled to `w`. Your bubbles: `{ text, u }` or `{ poem: n, u, sag }`; `typing: { text, u }` types into the input line; `scroll` 0 → 1 scrolls everything away until only the empty reply field remains. Returns `rect`, `cursor`, `reply`, `bubbles` for carriers.
- `f16_kit.level`, `quote`, `rule`, `stamp`, `pen`, `stairs`, `book`, `bookClosed`, `head`, `cursor`, `blink`, `rise`, `along`, `roundRectPts` (signatures in the file header comments).
- `lib/f16_seams.mjs`: `plateChat`, `plateButton` + `buttonFace`, `plateNib`, `seamWindow`, `SEAM_HALF`, and the plate geometry constants.
- `timing.json` also carries `levels` (start/end per level) and `cues` (`card` / `onscreen` with the time the audio agent placed them, e.g. a card hit in the music). Land your quote card or on-screen graphic within ±0.5 s of its cue, but anchor the code on the phrase.
- **Sky:** deep indigo. `E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], …)`. Mean luma (calm.py) 40–60, the hero bright.
- **Finish:** `K.PRINT16 = { grain: 14, floor: 4, vig: .5 }`.
- `pen(ctx, x, y, ang, L, t, { glow, ink })` is a real fountain pen (split nib, breather hole, grip, band, cap, clip); `ang` = angle from the nib to the cap. Below L ≈ 200 px check that it still reads as a pen.
- **Memory:** no canvas, no pattern per frame. Build cached things once at load. `Path2D` comes from `@napi-rs/canvas` (import it).

## 6 · Rendering (4 cores, 15 GB for all three)
`SP` = your own scratchpad (from your system prompt). Work folder `$SP/f16/bN/`. Nothing big into `/mnt/project-files`.

**Review stills** (half size):

```
cd /home/user/scenario/films/16-constitution
SECS=c05 node render.mjs --snap 229,230.5,232 --dir $SP/f16/b2/snap --scale .5
```

Then build a contact sheet and **look at it**.

**Video** (full quality):
- pieces ≤ 20 s, always with `--expose-gc`;
- never more than one render per builder at a time (two only when nothing else runs).

```
SECS=c05 node --expose-gc render.mjs --out $SP/f16/b2/c05_a.mp4 --from 228.68 --to 248
SECS=c05 node --expose-gc render.mjs --out $SP/f16/b2/c05_b.mp4 --from 248 --to 263.18
```

Then join with `ffmpeg -f concat -c copy` into `$SP/f16/bN/cNN.mp4`.

**Delivery per chunk:**
- video: `$SP/f16/bN/cNN.mp4`; the path goes into the report;
- contact sheet (1 frame/s, small jpg): `/mnt/project-files/scenario/film-verfassung/bild/cNN_kontakt.jpg`.

## 7 · Mandatory checks per chunk (numbers into the report)
1. **Contact sheet looked at** (1 frame per 0.5–1 s plus every transition) and everything ugly or unclear fixed. At least 3 review rounds. Check:
   - every frame is a poster;
   - sentence = picture;
   - the hero is the brightest thing;
   - you are never cut off except in a deliberate move;
   - text is readable (phone copy 390 px wide).
2. `python3 tools/calm.py <cNN.mp4> --scale 1280:720`:
   - 0 cuts (except planned match moves);
   - mafd median ≤ ~0.45;
   - luma 40–60.
3. `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 jerks** (no LURCH/POP).
4. `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary and every render seam: no flags. At the group seams also check against the plate (`plateChat` / `plateButton` / `plateNib`); the lead checks both sides.
5. **Calm rules** (`MOTION.md` §5): 1–2 moving main elements; no still image > 2 s; 1.5–3 s hold after accents; nothing from nowhere; no dissolves, no fade, no slide.
6. Self-grade 1–5: poster · sentence = picture · seamless · calm · alive · graphics from film elements · text. Nothing under 4.

## 8 · Report (short, English)
- Chunks finished, with paths to videos and contact sheets.
- Numbers per chunk: calm, smooth, seam.
- Kit wishes.
- Open points and deviations from `shots.md`, with the reason.
- Which files you created or changed (so the lead can commit exactly those).
