# Film 26 · builder brief (3 builders in parallel, one checkout) · as of 2026-11-11

The picture lead built **c01** as the quality reference: the hook, from 0 to `T.G('And behind that picture')` ≈ 72.8 s. The lead also holds the kit, the shot list and the seams. The rest is built by **three builders at the same time**, each covering about 3 to 4 minutes of picture:

| builder | chunks | from → to (phrase) | ≈ time (provisional, vo-v3) | contents |
|---|---|---|---|---|
| **B1** | c02 c03 c04 | 'And behind that picture' → 'Someone pays you an income' (nth 1) | 1:12.8 – 4:11.4 (179 s) | his argument in the sky field (thinking + labour free → materials + electricity, goods pile up, prices fall, UHI), the test card is written (2.x), **line 1** (warehouse street, 1,000,000 robots, offices, +20–30 %, robots → rocket → Moon ★, ✓), **line 2** (the price tag tears ★, TV $1 → 2 ¢, hospital $1 → $4, what a machine can copy, care = a person's hands, nursing home = 5 years of checks, ½), subscribe 1 |
| **B2** | c05 c06 c07 | 'Someone pays you an income' (nth 1) → "If he's wrong, you're still fine" (nth 1) | 4:11.4 – 7:01.0 (170 s, incl. C2 5.6 s, C4 6.3 s, C3 6.4 s) | **line 3** (the mailbox, checks from Washington, C2 Diamandis, who pays → retirement advice, no law / no amount / no budget, bills in Congress, printing money: homes, beds, a nurse's hours don't multiply, tax the profits, C4 Acemoglu, ✗), **line 4** (the avenue of years, 10–20 years → 2036, Congress slower than AI, robotaxi 2019 + C3, years late, ✗) |
| **B3** | c08 c09 c10 c11 | "If he's wrong, you're still fine" (nth 1) → end | 7:01.0 – 11:00.1 (239 s, incl. C5 12.6 s and 15 s end screen) | **line 5** (the hill, two bets on the balance ★, 2 in 3 fear running out, optimist and wrong, who carries the risk, ✗), a law not a promise (1889 Germany, 1935 America, C5 FDR), Ida May Fuller check No. 1 ★, Social Security shrinks not stops, a right written down, the check in your mailbox, **the five lines** (✓ ½ ✗ ✗ ✗, ADVICE FAILS ITS OWN TEST), the bridge ★, subscribe 2, end screen |

**Timing:**
- Until the audio agent writes `<ROOT>audio/timing.json`, the engine uses `data/provisional_timing.json` (built by `tools/provisional_timing.py` from the newest of vo-v4 / **vo-v3** / vo-v2 with the clip lengths from `<ROOT>clips.json`). Re-run `python3 tools/provisional_timing.py` if a newer vo-vN appears; never edit seconds by hand.
- When the real VO arrives, the seconds move. **Anchor only on phrases**: `T.G(phrase, nth, after)` / `T.GE(…)`, slots `T.clip('C2')`. Never seconds, never segment ids.
- **Repeated phrases** (each first occurs in the list of lines 26–32 of the VO): "Everything gets cheap", "Someone pays you an income", "It arrives in time", "If he's wrong, you're still fine" → the station sentence is `nth 1`. "There is" also occurs in "there is no such income": c09 starts at "There is It's been". "This channel exists" occurs twice (c04 subscribe 1, c11 subscribe 2). Safest: search after a fence, `T.G(p, 0, after)`.
- `ROOT` = `/mnt/project-files/scenario/film-sparen/` (`$F26ROOT`). The audio agent works in `<ROOT>audio/` and `films/26-saving/audio/`. **Do not touch either.**

## 0 · Mandatory before the first line of code
1. **Load the four skills** (Skill tool) and follow them: `anthropic-skills:scenario-motion`, `anthropic-skills:world-class-motion-design`, `anthropic-skills:fluid-motion-design`, `anthropic-skills:motion-director-gates`. Outdated in them: Hyperframes and three.js. We draw with our own engine in Canvas 2D: 2.5D depth cards `E.cam3`, `E.card`, `E.aim`, `F.camPath`.
2. **Read**, in this order:
   1. `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding)
   2. `docs/MOTION.md`: world, doors, **§3 Nicht wiederholen**, colour code, calm rules
   3. `docs/shots.md`: your shots (phrase anchors, layers, carriers, W/S doors, ★). Binding. §5 lists the only on-screen strings.
   4. the headers of `lib/f26_kit.mjs` (API) and `lib/f26_seams.mjs` (places, cameras, plates)
   5. `<ROOT>vo-v3.txt` (your lines), `<ROOT>faktenzettel.md` (numbers and sources), the picture notes for your part in `<ROOT>text-v2.md` (its text is older; vo-v3 counts)
3. **Look at** the reference: the code `scenes/sc01.mjs`, the contact sheet `<ROOT>bild/c01_kontakt.jpg`, and the kit stills `node tools/kit_sheet26.mjs $SP/f26/bN/kit` (the places, every piece, the three plates). What to take from sc01:
   - **One plan sequence per chunk** (one entry). Camera `F.camPath(t, [[t, E.aim(F0, u, v, s)], …], ref)` glides through its keys; `ref` must be deeper than every key camera (`S.Z_ROOM` when you go into a window).
   - `E.camAt(t, K, ref)` with `'i'`/`'o'` only for light doors. Ramps: `E.lightFlood(ctx, E.smooth(span(t, tp − 1.0, tp)))` before the peak, `1 − E.smooth(span(t, tp, tp + 1.2))` after.
   - **Sky doors**: rise until the camera is aimed at F0 y ≤ `S.SKY_Y` (−1500; use −1700 for margin), switch `hillWorld` ↔ `streetWorld` on any frame up there, come down. One camera path across the switch. A carrier crosses (a coin, a tag, the piggy) drawn with the same function in both worlds.
   - **Everything comes from somewhere**: the coin leaves the stream, the window lights when it lands, the dust leads the camera to the shop, the piggy floats from her hands to the pan, three coins flip into three cards, a coin lights the ON AIR sign, the clip plate grows out of the studio monitor.

`/mnt/project-files` is a network mount and almost full. Use exact paths, never search the whole folder, put only small jpg contact sheets there (after writing wait 10 s and read it back). Renders stay in your own scratchpad.

**Fact-check notes (vo-v3, faktenzettel), binding for the picture:**
- **`<ROOT>faktencheck.md` is binding** (§1 Muss, §2 Kann = Jakob's choice, also cut points of the clips). Done in the kit: **MB1** the card at ~1:24 is `F.QUOTES.wattage` (“currency will be measured in … wattage and tonnage” · Musk to Walter Isaacson, Oct 2026); the "materials and electricity" card is gone (speaker unconfirmed). **MB2** the card at ~6:53 is `F.QUOTES.ontime` (“… it’s a fair one … sometimes I’m not on time. But I get it done.” · Musk, Apr 22, 2019). K8: the UHI post is dated APR 2026. K15 (c10, 9:22): the 1940 check is the first **monthly** check (lump sums were paid from 1937). Open Kann points for Jakob: K4 `deflation`, K5 `figured` (safer: “it’s not like I know the answers here”), K6/K7/K9/K10 label wording.
- `F.QUOTES` entries with `check: true` are still open (the X post of Oct 29, 2026, "money won't matter in 2036" / The Economist, the Isaacson 20–30 % line, the UHI post of Apr 17, 2026). Keep the wording as in the kit; if the fact check changes it, only the kit changes (tell the lead).
- vo-v3 changed one sentence in c09: "… with money set aside years before **the first monthly check**." Picture for that sentence: money set aside (coin stacks / a ledger page) before the first check leaves.
- Numbers on screen only with a source line (`F.source(ctx, t, t0, t1, F.SOURCES.x)`): TV and hospital prices = BLS CPI 2000–2025; nursing home vs Social Security = CareScout 2025 · SSA 2026; "2 in 3" = Allianz Life 2025; "shrink in the early 2030s" = Trustees Report 2026; Amazon's robots = Amazon, July 2025.
- **Credits** of the clips (name, role, year, ORIGINAL FOOTAGE): `F.CLIPS`. Every clip has a spoken lead-in; the plate grows during it.

## 1 · The seams between the groups (fixed, defined by the lead, `lib/f26_seams.mjs`)

| seam | phrase | plate | handing side | receiving side |
|---|---|---|---|---|
| Lead → B1 | `T.G('And behind that picture')` | `S.plateCondition(ctx, t, T)`: above the roofs (COND_CAM), the gold condition line with “If any of the things that we’ve said are true …” | c01 (done) | 2.01: the argument is built on the line (it becomes the base line of the blueprint) |
| B1 → B2 | `T.G('Someone pays you an income', 1)` | `S.plateMailbox(ctx, t, T)`: the older you at the open, empty mailbox (MAIL_CAM), test card in the corner | 4.16 settles on it | 5.01: line 3 lifts (testCard does it), the check rises out of the mailbox |
| B2 → B3 | `T.G("If he's wrong, you're still fine", 1)` | `S.platePiggy(ctx, t, T)`: the hill = thumbnail A without the title (HILL_CAM), test card corner | 7.18 comes down onto it (sky door) | 8.01: line 5 lifts |

- Both sides draw the plate for ±0.5 s (`S.seamWindow`, `S.SEAM_HALF`) with the same creep (`S.plateCam`: 3 %/s push, 24 px/s truck). Handing side: steer your last camera key to exactly the plate camera at T0 − 0.5 (`S.plateCam(T0 − .5, T0, …)`), then `return S.plateX(ctx, t, T)`. Receiving side: start with the plate, then continue the same creep and grow your world out of it.
- **The test card** is drawn by `F.testCard(ctx, t, T)` on BOTH sides from the phrase anchors (corner placement, headline lift, marks), so it is identical at every seam. Do not draw your own copy; use `o.hide` / `o.headline` / `o.onLine` / `o.at` only where shots.md says so (c11 final is automatic).
- Check: `SECS=c04,c05 node tools/seam.mjs --at <T0>` → no flags.

## 2 · Hard rules for the picture
- **Places are anchors, not wallpaper.** The hill only at c08 and c11 (and where shots.md says PIG). Your street is the main stage of c02–c07 and c10; the sky field above it carries the explainers.
- **Explainers** are made of film things: coins, coin stacks, price tags on strings, gold-dust lines, paper checks and law pages, serif numbers, quote cards, the balance. One statement each, at most one number and ≤ 6 words. No chart panels, no legends, no UI.
- **Colour code** (MOTION.md §5): gold = money / what stays / ✓ ½ · rose only for ✗ and what fails (sparingly) · cool = machine · yellow coat = only you (`E.du`, older: `F.older`) · everybody else indigo `E.person`, faceless.
- **Care** (c04): a person's hands and time. **No care robots.** The machine never touches the old woman.
- **Scenes** open as a lit window (fly-in ≥ 2.5 s, out again). Each scene has one warm light; figures breathe.
- **Doors**: W only at the W shots (B1 none, B2 none, B3: 9.01 into 1889, 10.06 back to the present). Sky doors (S) where shots.md marks them (B1: 2.06, 3.01, 4.03, 4.10; B2: 7.18; B3: 11.05).
- **Nicht wiederholen** (MOTION.md §3): no domino rows, rank stones, umbrella, seal/certificate/stamp (marks are pen strokes), monolith, clock or dial, hourglass, fire circle, staircase of light, map with pins, running track, kitchen table with generations, server rack.
- **Clips** (C2 c05, C4 c06, C3 c07, C5 c09): `F.clipPlate(ctx, t, T, id, { from, morph })` grows out of a screen in the world (the studio monitor `S.MONITOR` via `E.project`, a TV in the shop, a newsreel screen in 1935) during the lead-in sentence, holds under the clip, shrinks back. **Fallback** if a clip cannot be used: `F26_C3=card` (or `F26_CARDS=C2,C4`) renders the same plate as a quote card; nothing else changes.
- **Subscribe** (c04 1, c11 2): one small line of text at most, no buttons, no bells.
- **End screen 15 s** (c11): the bridge at rest; keep the right two thirds (x 700–1830, y 120–860) a quiet dark sky. Picture and grain keep running.
- **Subtitles** own y > 910.

## 3 · What you may touch and what not
- **Only your files**: B1 `scenes/sc02.mjs` … `sc04.mjs` · B2 `scenes/sc05.mjs` … `sc07.mjs` · B3 `scenes/sc08.mjs` … `sc11.mjs`, plus your own modules `lib/f26_b1_*.mjs` / `lib/f26_b2_*.mjs` / `lib/f26_b3_*.mjs`.
- **Do not change**: `lib/f10_editorial.mjs`, `lib/f13_kit.mjs`, `lib/f16_kit.mjs`, `lib/f26_kit.mjs`, `lib/f26_seams.mjs`, `lib/kit.mjs`, `lib/stub.mjs`, `film.mjs`, `engine.mjs`, `render.mjs`, `tools/`, `docs/`, `data/`, `audio/`, `scenes/sc01.mjs` and the other builders' files.
- **Kit gaps or bugs**: solve them in your own module and report them as kit wishes.
- **A scene file**: `export default async (T, R) => [{ t: R.a, draw(ctx, t), print: F.PRINT26 }]`. One entry per chunk.
- **No commit, no push**, no `git checkout`, `git stash` or `git reset`. The lead or the coordinator commits.

## 4 · Kit API (short; the headers have all signatures)
```
import * as E from '../lib/f10_editorial.mjs';  import * as F from '../lib/f26_kit.mjs';  import * as S from '../lib/f26_seams.mjs';
F.camPath(t, [[t, E.aim(E.F0, u, v, s)], …], ref) · E.camAt(t, K, ref) for doors · E.lightFlood · E.project(c, Z, u, v) · S.unproject(c, Z, sx, sy)
S.hillWorld(ctx, c, t, { crack, fountain, du, pig, window, deck, winA, field, front }) · S.PIG · S.DU_HILL · S.crackOf() · S.HILL_CAM
S.streetWorld(ctx, c, t, { room: { page, label, gold, who, fig, hold, piggy, lit, extra }, studio, onAirA, shop: { fill, zero, light },
   mailbox: { open, check, flag }, older: {x, …}, du: {x, …}, lampsA, deck, field, mid, front }   (+ st.mail, st.olderHands, st.room.pig after the call)
S.STREET_CAM · S.MAIL_CAM · S.COND_CAM · S.SKY_CAM · S.SKY_Y · S.MYWIN · S.ONAIR · S.SHOP · S.SHELF_Y · S.MONITOR · S.MAILBOX · S.ROOM · S.Z_ROOM · S.Z_FIG
S.CAL_LABEL / S.CAL_GOLD (the calendar) · S.HOLD (arms holding the piggy) · S.condLine · S.plateCondition / plateMailbox / platePiggy · S.plateCam
F.piggy(ctx, t, x, y, h, { crack, fill, warm, lit, dark, dir, a }) → { slot, crack, top } · F.coin(ctx, x, y, r, { flip, glint, tilt }) · F.fountain · F.goldDust
F.older · E.du · E.person · F.house · F.win · F.street · F.streetLamp · F.mailbox · F.calendar · F.goods(kind) · F.priceTag(…, { torn, col }) · F.balance
F.coinStack(ctx, t, x, y, n, r, { value, label }) · F.check(ctx, t, x, y, w, { pay, from, amount, date, sig, no, dashed, blink, byLaw }) · F.qcard · F.rover · F.onAir
F.testCard(ctx, t, T, o) · F.testTimes(T) · F.TEST · F.mark(ctx, 'check'|'half'|'cross', x, y, s, u) · F.QUOTES · F.SOURCES · F.source · F.bracket · F.label
F.clipPlate(ctx, t, T, id, { from, morph }) · F.CLIPS · F.cardMode · F.title · F.questionLine · F.rise / F.maskLine / F.measure · F.PRINT26
```

## 5 · Rendering (4 cores, shared by all three)
`SP` is your own scratchpad. Work in `$SP/f26/bN/`.
```
cd /home/user/scenario/films/26-saving
SECS=c05 node render.mjs --snap 255,260,266 --dir $SP/f26/b2/snap --scale .4                       # review stills
SECS=c05 node --expose-gc render.mjs --out $SP/f26/b2/c05_a.mp4 --from 251.4 --to 271 --scale .5   # video, pieces ≤ 20 s
```
- At most one render per builder at a time (~160 ms/frame). Join pieces with `ffmpeg -f concat -c copy`.
- Delivery per chunk: the video `$SP/f26/bN/cNN.mp4` (half resolution is fine) and a contact sheet (1 frame/s, jpg ≤ 1 MB) at `/mnt/project-files/scenario/film-sparen/bild/cNN_kontakt.jpg`.

## 6 · Mandatory checks per chunk (numbers go into the report)
1. **Contact sheets looked at**: every 0.5–1 s plus every transition, at least 3 review rounds: poster quality, sentence = picture, the hero light is the brightest thing, figures alive, text readable at 390 px width, no empty frame (a sky door must carry something).
2. **calm.py**: `python3 tools/calm.py <cNN.mp4> --scale 1280:720`: cuts only at W shots; static share < 5 %; report the mafd median (c01 is the bar, see README).
3. **smooth.py**: `python3 tools/smooth.py <cNN.mp4> <start second>`: **0 LURCH/POP**, including at doors.
4. **seam.mjs**: `SECS=cNN,cMM node tools/seam.mjs --at <boundary>` at every chunk boundary: no flags.
5. **Calm rules** (MOTION.md §6) checked.
6. **Self-grade 1–5**: poster · sentence = picture · seamless · calm · alive · explainers made of film things · text. Nothing under 4.

## 7 · Report (short, English)
Chunks finished with paths (videos, contact sheets) · numbers per chunk (calm, smooth, seam) · kit wishes · deviations from shots.md with the reason · the exact list of files you created or changed.
