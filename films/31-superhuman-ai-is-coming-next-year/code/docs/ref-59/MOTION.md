# Film 59 · "You Can Now Buy a Piece of AI" (thumbnail AI GOES PUBLIC) · motion bible (lead, 2026-11-16)

Channel The Good Takeoff (Scenario). Upload Tue 17.11.2026 17:00 Vienna, 1080p30, 10:16 (VO ends ≈ 10:01, then a 15 s end screen).
Style: flat editorial grain (deep indigo night, warm gold as the ONE hero light, tiny faceless figure in a yellow raincoat = you). Everything is
code (2.5D depth cards, `lib/f10_editorial.mjs`); no AI images, no 3D game look, no logos, no real faces outside the UN clips.
Plan: `docs/shots.md` (from `tools/shots59.py`) · builders: `docs/BRIEF-builders.md` · kit sheet `<ROOT>bild/kit59_kontakt.jpg` (`node tools/kit_sheet59.mjs <dir>`).
On-screen text: ONLY from the current `<ROOT>vo-v3.txt` `[EINBLENDUNG]` lines (fact-checked); the strings live in `F.SOURCES`.

## 1 · Intent
- **Audience:** people who see "Anthropic IPO" headlines this week and wonder what buying a share actually gets them.
- **The single message:** *you can buy a piece of AI, not a say in where it goes.* A share is a claim on the money, not a hand on the wheel. Not
  the first chance to buy AI (chip makers, tech giants exist); new is a lab that builds only AI, and who else gets a seat (a trust with no shares).
- **Mood:** calm, curious, fair. Not investment advice (said and shown). No hype, no doom: the seller's own warning is quoted, the hopeful
  part (the public-benefit duty, the stake as a voice) is warm.
- **Explainer share 60–70 %** (now 69.1 %, `docs/shots.md` §1). Weights: EXPL 1 · MIX .5 · CITY .3 · SCENE/CLIP 0.

## 2 · The world: THE CITY UNDER THE CRYSTAL (one place, no other worlds)
- **The crystal** (Z 6000, high right at home): a giant faceted gold light over the night city = ANTHROPIC / the AI. One facet is missing (the
  gap): that piece is **the shard** = a share. It fell into your hand in frame 0 (thumbnail A).
- **You** on the rooftop ledge (F0, y 975), small, yellow coat, holding the shard. You are the viewer: with a share or without.
- **The tower window** (city card Z 3800): inside, **the room**: a long dinner table, 7 founders (gold) + 4 trustees (cream) as faceless busts,
  and on the back wall **the wheel of light behind glass** = control. You can see it; you cannot reach it.
- **The exchange and the bell** (Z 5200, far right): the first trade; the bell's clapper is a crystal.
- **The countdown board** (screen space, top left): COUNTDOWN TO THE BELL · STEP 1 THE PITCH · 2 THE ORDERS ARE COUNTED · 3 PRICING NIGHT ·
  4 FIRST TRADE · +15 TRADING DAYS. It changes itself on its phrases (`F.BOARD`); never set it by hand. It hides during clips.
- **The jar** (your savings, an index fund): a small gold slice lands in it ("whatever the price").
- **The documents:** the thick PROSPECTUS (S-1/A) with warning tabs; paper cards come out of it and go back.
- **Explainers float over a night veil** (`F.veil`) while the camera keeps gliding behind: that is how 69 % explainers stay in one world.
- **Clips** (UN Security Council, C1/C2/C3) grow out of a crystal facet (`F.clipPlate` with `from`) and go back into it. Quote card Z1 is a paper card.

## 3 · Motion DNA (owner rules, binding)
1. **Calm choreography.** At most ~1 hard world change per minute (the plan has 0: everything happens in the one city). One main movement
   at a time: when a card moves, the camera only creeps; when the camera travels, cards hold (float only).
2. **A carrier for every transition.** The shard → the phone → the shard; the tag on a gold thread → the quote card → the document's cover;
   the wheel flies into the window; a facet → a clip plate → back. Write the carrier into your header table before you code.
3. **Nothing appears from nowhere; no half-transparent ghost fades.** Things grow out of a thing (rise/mask wipes, unfold from a tag, slide out
   of a document edge). Alpha only as a quick 0→1 in ≤ .3 s together with a geometric move, never a slow crossfade.
4. **Nothing stands still.** `camDrift` + `F.float` everywhere; the crystal breathes; the wheel turns; window lights flicker slowly.
5. **Speed:** big area changes take ≥ 1.8 s with sineIO (smooth.py flags LURCH > 12); small hits (stamp, tick, tag) ≤ .3 s on the word.
6. **One wow (★) per chunk** (see shots.md); everything else stays quiet.
7. **Thumbnails show only what the film shows:** A = frame 0 (crystal, shard falling into your hand, AI GOES PUBLIC); B = the bell
   (9.03); C = YOU CAN'T STEER AI: you holding the shard up, the wheel of light big in the sky (3.08, `thumbnails/film-59/f59-c-steer-1280.png`).

## 4 · Palette and type (`lib/f59_kit.mjs`)
GOLD (the crystal, the shard, the founders, facts that matter) · PAPER (documents, quote cards) · COOL (the market: prices, orders, other
companies) · LAMP (people's light in windows) · INK. Type: Inter (labels, caps, spacing .12–.2) and Instrument Serif (quotes, big numbers;
falls back to Inter for → ≈ × glyphs). Text ≥ 22 px at 1080p, held ≥ 1.5 s, ≤ 6 words per statement except verbatim quotes.

## 5 · Frame safety
- **Burned-in subtitles** take the bottom 170 px: nothing important below y 880. Sources at y 890 (`F.source`) sit just above them.
- **No QR overlay anywhere** (owner, 16.11.). No donation / support overlay. No "corrections get pinned" line (description: "spotted an
  error? mention it in the comments").
- Clip frames as in film 54: `F.clipPlate` (rounded plate, name/role/date label, ORIGINAL FOOTAGE (UN Web TV)); subtitles of the clip are the
  burned-in track (the sound agent's ASS), not drawn in the plate.

## 6 · Camera
2.5D cards: `E.aim(Z, u, v, s, sx, sy)` puts card point (u, v) at screen (sx, sy) with scale s relative to home (cam3 = thumbnail A).
Use `F.camPath(t, K)` (ref depth 6000: it works when the camera flies past F0 into the city). Keys on phrases only. Seams: `lib/f59_world.mjs`
(plates, CREEP 4 %/s, TRUCK 30 px/s). End screen: `S.END_CAM` / `S.END_TILES` (crystal top centre; you small at the left on the ledge; the
dark rooftop below carries the two tiles + subscribe circle).

## 7 · Gates (before you report)
Stills every ~.5 s around every transition (`node render.mjs --snap …`), a contact sheet of the chunk, `tools/calm.py` (0 cuts) and
`tools/smooth.py` (0 flagged) on the rendered chunk, `node tools/seam.mjs --at <T0>` at your group seams. Static share in calm.py is ~20 %
because the editorial grain changes at 10 Hz; that is known and fine, but no section may be frozen.
