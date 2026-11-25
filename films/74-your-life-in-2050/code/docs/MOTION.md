# Film 74 · "Your Life in 2050 If We Get AI Right" · motion bible · as of 2026-11-25

Skills (lead and every builder, before any code): **scenario-motion** (channel style, wins on conflict), **world-class-motion-design**,
**fluid-motion-design**, **motion-director-gates**; **dataviz** for every number graphic. No ad skills. Style: `stil/STIL-editorial-nacht.md`.
Rules: REGELN §13 (picture shows what the sentence says), with Jakob's #74 deviation of 25.11.: **"in dem fall viel 2,5 d szenen" ·
"also real diese szenen aus dem ort zeigen um die es im script geht"**. Shot list: `docs/shots.md` (one row per sentence, binding, from `tools/shots74.py`).

## 1 · Intent
A walk through YOUR street on one Monday in 2050, from waking up to the square at dusk. Every place the script names is shown as a real
**2.5D scene**: flat editorial shapes on cards standing at true depth in front of a perspective camera (`cam3`/`card` of the editorial kit),
parallax, one hero light, living figures (breathing, walking, working). Not a flat picture, not a 3D game. Numbers, sources and the
"back in the twenties" flashbacks ride ON the scenes as MIX: a **paper card** (cream paper, blue-ink line drawing, a TODAY line) that
unfolds out of an object of the scene and folds back into it. Pure explainer graphics (EXPL) only where a mechanism needs a diagram.

**Numbers (provisional VO, `tools/shots74.py`):** explainer share **41.8 %** weighted (§13.2 asks 60–70; #74 deviates on Jakob's order) ·
scene + MIX-on-scene **71 %** of the picture · 198 rows, 159 new motifs · hard cuts planned **0** · leitbild anchors **4**.

## 2 · Leitbild = the same street, 4 anchors (§13.4)
| anchor | where | picture |
|---|---|---|
| Hook | H.01 (0:00) | thumbnail B, right half: your street in morning gold, apple trees in the old parking bays, chalk, the robot on a ladder, you at the door · 2050: AI WENT RIGHT · A UTOPIA · IF WE GET IT RIGHT |
| Wende | M.01 (subscribe 1) | the same street at late morning, counter rows 1–4 ticked, the subscribe button hangs like a shop sign |
| Pointe | P.01 | the path loops back into the same street at dusk, the square at its end |
| Schluss | E.19 + end screen | the same street/square at dusk, she winds the clock, it rings, the children dance |
Between anchors: free places (bedroom, kitchen, boat shed, garage, crossing, roof, printed house, rooftops, fusion hills, sea, green desert, square at noon, garden, old school, bakery, moon town, orbit, forest, river, wolf hill, bench).

## 3 · Motion DNA (calm × soft, editorial daylight)
| dial | choice |
|---|---|
| Energy | calm walk tempo; 2–4 s glides; accents ≤ 2 per 30 s (the chime, the ring, the stamp), ≥ 0.8 s hold after an accent |
| Easing | camera `sineIO` (glides), transitions `quartIO`, entrances `expoOut`/`rise`, exits `expoIn`; linear only for rotation and the perpetual drift |
| Space | every place = 4–7 cards at depth (sky 40000 · far hills 12000 · far houses 6000 · mid 3200 · FOCUS 1700 · foreground 1150 · lens 800); the camera always moves (push, truck, rise) so the parallax is visible; `cameraFloat` breathes on top |
| Light | ONE hero light per picture: the sun (morning gold → noon cream → afternoon amber → dusk rose → lantern gold), a lit window, the fusion ring, the teacher ring, the Earth. The hour of the corner clock drives the sky (`K.hourLook`) |
| Colour | the channel palette in daylight: indigo-blue shadows and far layers, gold/cream light, the yellow coat = you, rust coat = the granddaughter, white robots with cream rim, cyan only for the machine circle (teacher ring, chime points, machine rings) |
| Figures | gelenkige Silhouetten (`du`, `person`, `robot` of the kit): breathe, look, walk, plane, hand over; no faces, no mouths |
| Type | Instrument Serif for numbers, years, big words; Inter 600 caps for labels/cards ≥ 22 px; kinetic on the spoken word (mask rise ±2 frames) |
| Paper card (MIX) | cream paper, soft cast shadow, blue-ink line drawing, header BACK IN THE TWENTIES or TODAY:, source line; unfolds out of an object (clock face, kerb, wall, fountain) and folds back |
| HUD | top left, small: `MONDAY · 8:10 AM` (the day clock) and the counter `GONE 1 … 9` (one line per station, grows; never over the subtitles) |
| Finish | `PRINT74` grain 12 on threes, vignette .38 (lighter than the night films); never over type |

## 4 · Carriers (no crossfades, no wipes)
1. **Portal** (`K.portal`): the camera pushes through a window/door/frame/screen of A, B lives inside it (H.13 window, H.15 front door, clip screen).
2. **Iris out of a shape** (`K.irisTo`): a round thing of A (sun, clock face, apple, coin, ring, the Earth) grows and B opens inside it, rim of light.
3. **Lens sweep** (`K.sweep`): a near layer of the 2.5D scene (tree trunk, lamp post, a wall edge) passes the lens on a lateral truck; B is behind it, the truck continues in B (direction and speed kept).
4. **Paper card**: a card unfolds out of an object of the scene (MIX), the scene stays alive behind it; the card folds back into the object.
5. **Same place, new view**: inside one place the camera glides to the next motif (only when the shot list says `no (beat)`; a new motif always gets its own composition).
The HUD and the counter stay across every seam (persistent carrier layer).

## 5 · Clips (ORIGINAL FOOTAGE, real people only)
C3 · C4 · C1 (Demis Hassabis), maybe C6 (Waymo, Tekedra Mawakana) if vo-v3 swaps it in. Each grows out of **the old flat screen** that leans on a garden wall (3.14), stands at the fountain (5.12), on a bench (8.17) and returns into it. Lower third: NAME · ROLE · PLACE, DATE · ORIGINAL FOOTAGE. Until the iMac cuts arrive in Drive "#74 …/3 Rohmaterial/clips": a placeholder plate with the exact wording. `tools/clip_check.py` before the render.

## 6 · Frame safety
Nothing important below y 880 (burned-in subtitles) · text ≥ 22 px · numbers exactly from `faktenzettel.md` / the Einblendungen of text-v2/v3 · at most one TODAY card at a time · one hero per frame, ≤ 2 movements at once.

## 7 · Nicht wiederholen
See `docs/shots.md` §4 (#23 street in section at night, light wall, voice-light tutor; #73; #66/#27/#64 money props; #63 block/slot/scale; #67; #59; #54; #16; the big clock symbol).

## 8 · Checks per chunk (gates)
Snapshots every ~0.5 s + every transition (`node render.mjs --snap …`), contact sheet against the gates AND the script, then
`python3 tools/calm.py <mp4> --scale 1280:720` (cuts), `python3 tools/smooth.py <mp4>`, `ffmpeg … freezedetect=n=0.001:d=0.5` (no stills ≥ 0.5 s; target < 5 % still, none > 2 s).
