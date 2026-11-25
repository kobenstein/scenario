# Film 63 · "The Pope Says AI Won't Save You" · motion bible · as of 2026-11-25

Skills (lead and every builder, before any code): **scenario-motion** (channel style, wins on conflict), **world-class-motion-design**,
**fluid-motion-design**, **motion-director-gates**; **dataviz** for every number graphic. Style: `stil/STIL-editorial-nacht.md`.
Rules: REGELN §13 (picture shows what the sentence says). Shot list: `docs/shots.md` (one row per sentence, binding).

## 1 · Intent
A motion-design film, not an animated illustration and NOT one world. ~10.4 min, 16:9, YouTube. One message: *the Pope accepts what AI
can do and refuses the word "save"; what must happen to the machines is the Church's word for nuclear weapons: disarmed.* Mood: calm,
precise, warm-in-the-dark. Every sentence with new information gets its own composed motif (number, quote card § number, comparison,
mechanism, person, place); motifs are joined by a carrier, never by a fade. Scenes carry feeling (hook, one ★ per chunk, human moments),
graphics carry understanding (every number, every quote, every mechanism).

**Numbers (real VO, `tools/shots63.py`):** explainer share **67.7 %** (target 60–70) · hard cuts **0** (budget ≈ 1/min) · leitbild anchors **4**.

## 2 · Leitbild = anchors only (4)
| anchor | where | picture |
|---|---|---|
| Hook | H.01 (0:00) | thumbnail A: night city, the gold machine block (circuit chip), the Pope's raised palm, you (small, yellow coat) |
| Wende | 2.14 (c03 end) | ★ THE SCALE: left pan BODY · MONEY · TIME (what it gives you), right pan empty → WHERE IS THE CATCH? |
| Pointe | 4.01 (c05) | ★ Babel (§7): one tower, one language, one direction · against it the wall (§9) built by many hands; DISARM in the gap |
| Schluss | 9.06 (c12) + A.01 | ★ the scale comes to rest level (nobody wins) · the wall again with subscribe 2 · end screen = the scale at rest |
The mini scale "WHAT STAYS YOURS?" (6.16, plateStays) is an explainer icon, not a fifth anchor. Between anchors: free motifs.

## 3 · Motion DNA (calm × sharp, editorial)
| dial | choice |
|---|---|
| Energy | calm, 2–4 s glides against few hard accents (≤ 2 per 30 s, ≤ 3 frames), ≥ 0.8 s hold after an accent |
| Easing | entrances `expoOut`/`rise` (mask reveals), exits `expoIn`, moves `sineIO`, deliberate transitions `quartIO`; never linear except rotation/creep |
| Overshoot | ~0 (serious content). Weight comes from timing: heavy things start slow, land with a 2–5 % squash (DISARMED lands) |
| Type | Inter Black condensed only for thumbnail/title words · Instrument Serif for numbers, quotes, key words (gold = the point, cream = the question) · Inter 600 caps labels ≥ 22 px |
| Text entry | words rise behind their own line mask on the spoken word (±2 frames); exits sink behind the same mask or leave with their carrier |
| Colour | night indigo ground; GOLD = the machine / the promise / the point; CREAM = questions, outlines, the struck word; WHITE (never yellow) = the Pope; amber/yellow = you |
| Camera | `cameraFloat` breathes over everything (film.mjs); each motif has its own `F.look(cx, cy, z)`; moves are motivated by the carrier |
| Life | figures breathe (1 + .006 sin), blink/look, arms natural; lamps sway; slots blink a caret; plates breathe (`S.breathe`) and creep |
| Finish | `PRINT63` (grain 14 on threes, vignette .5); grain never over type or the Pope |
| Signature | **the slot**: an empty dashed word slot with gold corners; things are typed into it, clips grow out of it and shrink back |

## 4 · Carriers (the transition vocabulary; no crossfades, no wipes)
1. **Shape becomes shape:** number → gold dot → lamp; ? of the question → slot; slot → clip plate → slot; a circuit trace → heartbeat line → baseline of SAVE.
2. **Iris** (`F.iris`): the next scene opens inside a shape of the current one, rim = that object's edge (the lamp's light circle).
3. **Portal** (`F.portal`): push through a window/frame of A, B lives inside it; ends EXACTLY on B's identity frame (no jump). Window furniture must open or leave (`F.kitchenFrame(c, open)`).
4. **Push-aside:** a growing plate shoulders the old motif out of frame and lets it back (C1 plate vs. block/warhead).
5. **Mask sink:** a line sinks behind its own mask when its sentence is over (never fades).
6. **Seam plates** between builder groups (`lib/f63_seams.mjs`): both sides draw the same plate ±0.5 s with the same creep.

c01 transition map (built): title words + rule under each spoken word → THE POPE: rolls into POPE LEO XIV, gold line to him → block exits right,
142 faithful roll out (1 = 10 million) → 1.4 BILLION collapses to a gold dot → dot falls into the kitchen lamp, iris opens the kitchen →
tiles grow out of your open hands → **★ portal through the window (mullions open), tiles fly and dock on the block** → CURE DISEASE ·
END POVERTY · TAKE THE WORK engraved → pull back: scaffold, builders → one trace leaves the chip as a heartbeat, the camera follows it
(§9 card) → the line flattens, SAVE rises out of it, the palm, the strike → SAVE tucks to a tag, you walk in, WHAT DOES HE MEAN? →
its ? drops into the slot (caret blinks) → THESE MACHINES ← slot → NUCLEAR WEAPONS (THE SAME WORD) → C1 grows out of the slot (framed
inset) and back → DISARMED typed into the slot → NOT BANNED / NOT BLESSED struck and pushed off → the slot opens, DISARMED grows into
`plateDisarmed` + the quote card → seam to B1.

## 5 · Clips (ORIGINAL FOOTAGE, real people only; everything else is code)
- Frames: `/tmp/claude-0/f63/clips/<id>/f00001.jpg…` (cut from `<ROOT>audio/slots.json` file_in_s + dur; source `/tmp/claude-0/f63/clips/Cn.mp4`).
- Always `F.clipPlate(ctx, t, T, id, { from: <rect of the object it grows out of>, morph })`; it grows out of an object and returns into it.
- **C1, C4** (Vatican News, 480p upscaled): framed **inset** 60 % of the frame width, dark mat, gold corner brackets, light grain; never full
  screen. Crop .8 hides the VATICAN NEWS bug. **C3, C5** (DRM News 1080p): full plate, cropped to the upper 78 % so the lower-third
  banner never shows. Lower third on every clip: NAME · ROLE · PLACE, DATE · ORIGINAL FOOTAGE (SOURCE). C4 wording "…when we are failing."

## 6 · Frame safety and type
Nothing important below y 880 (burned-in subtitles) · text ≥ 22 px at 1080p · quote cards show the exact wording (`wortlaut-verifiziert.md`) plus
the § number · numbers from `faktenzettel.md` with the ampelseite corrections ($250B, labor share 53.0 % Q3 2026 lowest since 1947, Hassabis 4:22) ·
source lines with `F.source` (y 880) · one hero focal point per frame, ≤ 2 movements at once.

## 7 · Nicht wiederholen (worlds and objects of earlier films)
- **#67:** headline in the sky, chalkboard, paper tower, referee, ribbon, checklist, gold card CORRECT, the one-world landscape itself.
- **#66:** the long land, price tags, receipts, pay slips, the dollar bar.
- **#59:** crystal, bell, stamps. **#54:** the great hall. **#31:** the ladder. **#27:** shop windows, letterbox.
- **Older:** the big clock, server rack / bowl, hourglass, fire circle; robots as faces, brains, matrix code.
- In this film: the kitchen (H.04–H.07) returns once (c11, "the kitchen"), the three tiles return at 3.x (harvest) and c12 (carried off).

## 8 · Checks per chunk (gates)
Snapshots every ~0.5 s + every transition (`node render.mjs --snap …`), contact sheet against gates AND script (does every frame show the
sentence being spoken?), then `python3 tools/calm.py <mp4> --scale 1280:720` (0 cuts), `python3 tools/smooth.py <mp4>` (no LURCH/POP),
`ffmpeg … freezedetect=n=0.001:d=0.5` (no stills ≥ 0.5 s), `SECS=cNN,cMM node tools/seam.mjs --at <seam>` (no POP/BLACK at the seam).
**c01 benchmark (real VO):** 0 cuts · mafd median 0.84 · smooth 0 flags · 0 stills ≥ 0.5 s · seam to c02 Δ ≤ 2.5.
