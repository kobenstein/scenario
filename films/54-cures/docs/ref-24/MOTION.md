# Film 24 · "AI Can Now Hear What Animals Feel" · motion bible

Narration: `/mnt/project-files/scenario/film-tiersprache/vo-v5.txt` (fact-checked; real timing 635.5 s incl. a 15 s end screen). Picture notes: `text-v4.md` in the same folder. Style: `/mnt/project-files/scenario/stil/STIL-editorial-nacht.md` (binding). Shot list: `docs/shots.md` (source `tools/shots24.py`). Builders: `docs/BRIEF-builders.md`. Kit: `lib/f24_kit.mjs`; seams: `lib/f24_seams.mjs`; reference chunk: `scenes/sc01.mjs`. Stills of the kit: `node tools/kit_sheet24.mjs <dir>`.

## 1 · Intent
One line: *a calm, curious night film. Machines already hear what animals feel; whether they ever hear what animals mean is open, and so is whether we listen.*
- Audience: curious adults who have heard of "dog translators" and nothing more.
- Mood: calm · curious · warm.
- Aspect: 16:9, 1080p30. Explainer share target 60–70 % (shots.md §2: **69.7 %**).
- Promise of the title: you hear two pigs yourself in the first 25 s, and the machine hears them too.

## 2 · The world: THE NIGHT MAP and its medallions (guiding image, Jakob 9.11.)
**THE NIGHT MAP (the anchor).** A flat world map at night (equirectangular, `F.map`). Indigo sea, land a shade lighter with a fine stipple, soft coastlines. Tiny call waves flicker everywhere ("every species", spreading out from California).
- Every listening place is a **pin**: a stalk and a round **medallion** with an animal silhouette. **Gold = Earth Species Project** (ESP, California, Amboseli, León), **cream = other teams** (pigs/Europe, Kenya, Dominica, Bahamas, Berkeley, Tel Aviv, Alaska), small dots = places of the story (Germany, Iceland, New Zealand, Iowa).
- **Station changes: zoom out onto the map, fly (`F.flight`, van Wijk), zoom in.** The place pin's medallion is the carrier: it opens like an **iris** onto the habitat or the explainer field (`F.iris`), and closes again into its pin. The map is the image at the anchors and station changes, not a permanent camera ride: one calm move per zoom.
- The **Europe pig pin's medallion IS the barn of the hook** (`F.barnMedallion`, the default inner of that pin): the hook shrinks into it, B2 and the ending open it again.

**THE HABITATS (the scenes inside the medallions).** 2.5D card stages (`E.cam3`, `E.card`, `E.aim`, `E.camAt`, `E.camDrift`): flat silhouettes on depth cards, ONE warm light per picture (the barn lamp, the low sun over Amboseli, a lamp in the kitchen, the light shaft in the sea). Animals are alive: they breathe, blink, flick ears and tails, the calling animal moves its mouth.

**THE EXPLAINER FIELD.** The night inside the ESP medallion (dark indigo, no frame): the graphics stand on it. Made of the film's own things, never of chart panels:
- **the listener** (`F.listener`): the A.I. is a gold ear trumpet, bell left, tip right. It drinks calls (`drink`), can wear a blindfold (`blind`). No box, no robot, no brain.
- **call waves** (`F.wave`, 11 kinds): mirrored bars, a gap can be greyed and filled.
- **index cards** (`F.idCard`): animal, NAME / sub, the FEELS row with its bead (gold = fine, cool = not fine).
- **the stone tablet** (`F.tablet`): a Rosetta-like slab with seven recessed slots round an empty MEANING; a slot is engraved station by station (NAMES, WHAT'S GOING ON, CONTEXT, FEELINGS, PARTS, NEXT SOUND, IT'S THERE). MEANING stays empty, and at 6.14 becomes the bar.
- **the [translating…] bar** (`F.transBar`): empty with a waiting cursor until the scenario types "time to go".
- **the 2030 strip** (`F.strip`): docked top right; a gold call wave runs from TODAY to a dot, then dashes to 2030. It grows big at 3.14, 7.14, 10.01, 11.10 (`o.big`) and carries WHAT CHANGES? / TARGET HIT. It is **not a clock**.

**You** (faceless, yellow raincoat, `E.du`): the viewer. At the fence in the barn (hook, 9.12, ending).

| Where | What the world does |
|---|---|
| hook c01 | the barn, the cards and waves, then the ONE zoom out of the barn into its pin; ESP pin, 2030 strip, push onto California |
| 4.01, 6.13, 11.09 | the whole map with all pins (pull back) |
| every station | zoom out → flight → zoom in; iris into the medallion |
| 7.16 | mid-film subscribe over the elephant family at dusk |
| ending | zoom into the Europe pig pin: the barn again, you listening; end screen |

## 3 · Nicht wiederholen (do not repeat)
No motif may be copied from an earlier film (Jakob, binding). Banned here:
- **No clock and no dial for "until 2030"** (no hands, no ring that ticks, no countdown digits). 2030 is the **call strip** (§2), a wave that runs from TODAY to a dashed stretch to 2030.
- No **server rack / Petri dish / drawer** (Film 19: rack, dish, drawer).
- No **hourglass, sand thread, rock edge** (Film 13).
- No **running track** and no **game board, zero line, loop road** (Film 18).
- No **kitchen table with generations** (the ageing film). The Iowa kitchen (11.01) is one family at dinner with a dog, no generations row.
- No **fire circle under the Milky Way**, no **monolith**.
- No **book of light with threads into the head** (Film 16). The blank dictionary (2.11) has no threads; its page light becomes a kitchen window.
- No **curve with a red line**. Numbers are grids of figures, counters or serif numbers.

**Our own world (new):** the night map with pins and medallions (iris), the gold listener (ear trumpet), the stone tablet with seven slots round MEANING, the call strip to 2030, the [translating…] bar, index cards with a FEELS bead, the barn of the hook as the pin's medallion.

## 4 · Motion DNA
- Energy: calm, ~70 BPM inner tempo. Long glides (2–4 s) against few accents (a bead slides, a slot is engraved, the bar types).
- Easing: `sineIO` for camera and flights; `expoOut` / `rise` for entrances (from their baseline, masked); `expoIn` for exits (sink back into their baseline). The hook's zoom uses a bezier (.55, 0, .25, 1) over 3.4 s: slow while the medallion is big, fast once it is small, long settle.
- Physics: light and soft. Cards and labels rise out of the thing they belong to (a pig's back, a pin, a label).
- Shape language: flat silhouettes with a soft grain gradient and a lit rim; one warm hero light per picture.
- Transitions: (1) map zoom + iris through a pin medallion, (2) morph (medallion → clip plate, slot → bar, bead → slot), (3) mask rise / sink. Hard cuts only with a rhyming carrier (shots.md marks them ✂; 6 in the film = 0.57/min).
- Camera: never still. Keys on words (`camAt`), plus `camDrift` (amount 1.5–2 on the barn stage), plus the film-wide `cameraFloat`.
- Signature move: **the world shrinks into a pin's medallion, the night map opens round it** (and back).
- ONE wow moment: 10.04, the bar types "time to go" for the first time while the family sets off.

## 5 · Palette and colour code
- Night: `P.night0/1/2`, indigo `P.ind0/1/2`, blue `P.blue0/1/2` (sea, land, walls).
- Warm light: `P.core0/1`, `P.halo0/1/2`, `P.shade0` (lamps, sun, rims).
- **Gold (`F.GOLD`, warmer than the halo): only ESP and 2030** (pins, labels, the listener, the strip, the A.I. marks).
- Cream (`F.CREAM`): other teams, cards, text.
- Yellow raincoat `P.coat`: only you.
- Cool blue-cream: NOT FINE, failure, the empty.
- Grain restrained: `PRINT24 = { grain: 14, floor: 4, vig: .5 }`. Mean luma 40–60 (c01: 53.7).

## 6 · Calm rules (all chunks)
- Max ~1 hard world change per minute; zooms through pins replace cuts.
- One main movement at a time (a zoom does not run while a strip flies; the strip waits, or the zoom waits).
- The camera never stops: < 5 % near-static frames is the aim (calm.py static share, mafd < .15), no stretch > 2 s. Dark pictures measure low: give holds a visible push or drift (≥ 6 % zoom over 8 s), let animals and calls live.
- Text: short labels (Inter caps) and serif numbers; never whole sentences except the one claim (1.02) and the questions. ≥ 1.5 s on screen, readable on a phone (390 px copy).
- Subtitles own y > 910. End screen: the right two thirds free for the end cards.
- Nothing from nowhere: every new thing grows out of something on screen. No cross-fades, no slides, no ghosts.

## 7 · Carriers per boundary
| Boundary | Carrier |
|---|---|
| barn → map (1.10) | the barn shrinks into the Europe pig pin's medallion |
| map → field (2.01) | the gold ESP medallion opens (iris) |
| field → clip (2.08, 4.04, 6.07, 7.10, 10.07) | the medallion / the phone grows into the clip plate (`F.clipPlate` o.from) |
| page → kitchen (3.01 ✂) | the blank page's light = the kitchen window (same rectangle) |
| kitchen → field (3.05) | pull back: the window becomes a medallion among the waves |
| station → station (4.02, 5.01, 6.01, 6.05, 6.10, 7.09, 9.09, 10.09, 11.01) | medallion closes into its pin → flight → next pin's medallion opens |
| 1970 (8.03 ✂) | the timeline's 1970 dot becomes the record's label |
| map → barn (8.05/9.01, 11.11) | the Europe pig pin's medallion opens: the barn |
| everything → end screen | the barn at rest |

## 8 · Kit (lib/f24_kit.mjs, the header has all signatures)
- Animals: `pig`, `elephant`, `spermWhale`, `humpback`, `dolphin`, `dog`, `crow` (`tag`: recorder on the tail feather), `finch`, `frog`; `icon(kind)` for medallions; all breathe and blink.
- Graphics: `wave`, `idCard`, `tick`, `listener`, `transBar`, `tablet`, `strip`, `questionLine`, `label`.
- Map: `mapView`, `map`, `mapXY`, `flight`, `PINS`, `pin` (`head`, `r`, `inner`, `lean` overrides), `pins`, `iris`, `RF`.
- Barn: `BARN`, `barn`, `barnCast`, `fence`, `BARN_MED`, `barnMedallion`. `E.withOuter` lets a whole card scene be drawn inside a medallion.
- Clips: `CLIP_RECT`, `CLIPS`, `clipWin`, `clipPlate`, `prepareClipFrames`.

## 9 · Gates (motion-director-gates)
1. Space: the map gives the large space (zoom), the 2.5D cards give the near space (parallax).
2. Plan: this file + shots.md + the transition map (§7).
3. Tool: Canvas 2D with card camera and map flights; that is enough for this flat editorial world (no 3D look on purpose).
4. Camera: on word keys; it follows the carrier (pin, medallion, bead).
5. Causality: waves grow while the animal calls; the bead slides on the answer; the strip is born on the ESP label.
6. Five-second test: c01 is the test (`bild/c01-stiltest.mp4`).
7. Frames reviewed before each render; contact sheet after.
8. Voice leads: all accents on phrase anchors.
9. Self-check in the builder report.
